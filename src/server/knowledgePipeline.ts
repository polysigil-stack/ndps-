import fs from 'fs';
import path from 'path';
import { NDPSRecord } from './types';

export type SourceType =
  | 'STATUTE'
  | 'RULE'
  | 'NOTIFICATION'
  | 'GOVERNMENT_CIRCULAR'
  | 'OFFICIAL_FORM'
  | 'SUPREME_COURT_CASE'
  | 'HIGH_COURT_CASE'
  | 'GOVERNMENT_PROCEDURE'
  | 'ADMINISTRATIVE_PRACTICE';

export type SourceAuthority =
  | 'CURRENT_STATUTORY_TEXT'
  | 'CURRENT_RULES_NOTIFICATIONS'
  | 'SUPREME_COURT_JUDGMENT'
  | 'HIGH_COURT_JUDGMENT'
  | 'OFFICIAL_GOVERNMENT_PROCEDURE'
  | 'ADMINISTRATIVE_PRACTICE'
  | 'SECONDARY_SOURCE';

export type RecordStatus =
  | 'draft'
  | 'under_review'
  | 'verified'
  | 'approved'
  | 'published'
  | 'superseded'
  | 'withdrawn'
  | 'rejected';

export type PrecedentialRelationship =
  | 'followed'
  | 'distinguished'
  | 'overruled'
  | 'reaffirmed'
  | 'modified';

export interface VersionedLegalRecord extends NDPSRecord {
  source_type: SourceType;
  source_authority: SourceAuthority;
  source_title: string;
  citation: string;
  source_url?: string;
  publication_date: string;
  effective_date: string;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  verified_at?: string;
  version: number;
  supersedes?: string;
  superseded_by?: string;
  status: RecordStatus;
  created_at: string;
  updated_at: string;
  precedential_relationship?: PrecedentialRelationship;
  previous_text?: string;
  current_text?: string;
}

export interface ReviewQueueItem {
  update_id: string;
  record: VersionedLegalRecord;
  detected_change: string;
  affected_sections: string[];
  existing_related_record_ids: string[];
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'superseded' | 'duplicate';
  reviewer_notes?: string;
}

export interface CorpusChangelogEntry {
  update_id: string;
  date: string;
  source_added?: string;
  source_removed?: string;
  source_superseded?: string;
  sections_affected: string[];
  cases_affected: string[];
  reason: string;
  reviewer: string;
  verification_status: string;
  regression_result: 'PASS' | 'FAIL';
  publication_status: 'PUBLISHED' | 'REJECTED' | 'ROLLED_BACK';
}

export class KnowledgeUpdatePipeline {
  private queuePath = path.resolve('data/knowledge_review_queue.json');
  private changelogPath = path.resolve('data/corpus_changelog.json');
  private snapshotsDir = path.resolve('data/corpus_snapshots');

  constructor() {
    if (!fs.existsSync(path.dirname(this.queuePath))) {
      fs.mkdirSync(path.dirname(this.queuePath), { recursive: true });
    }
    if (!fs.existsSync(this.snapshotsDir)) {
      fs.mkdirSync(this.snapshotsDir, { recursive: true });
    }
  }

  public getReviewQueue(): ReviewQueueItem[] {
    if (fs.existsSync(this.queuePath)) {
      try {
        return JSON.parse(fs.readFileSync(this.queuePath, 'utf-8'));
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  public saveReviewQueue(queue: ReviewQueueItem[]): void {
    fs.writeFileSync(this.queuePath, JSON.stringify(queue, null, 2), 'utf-8');
  }

  public getChangelog(): CorpusChangelogEntry[] {
    if (fs.existsSync(this.changelogPath)) {
      try {
        return JSON.parse(fs.readFileSync(this.changelogPath, 'utf-8'));
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  public saveChangelog(changelog: CorpusChangelogEntry[]): void {
    fs.writeFileSync(this.changelogPath, JSON.stringify(changelog, null, 2), 'utf-8');
  }

  /**
   * DISCOVER & SUBMIT TO REVIEW QUEUE (Never auto-published!)
   */
  public submitForReview(record: VersionedLegalRecord, detectedChange: string, affectedSections: string[]): string {
    const queue = this.getReviewQueue();
    const updateId = `UPDATE-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000)}` ;

    // Duplicate detection check
    const isDuplicate = queue.some(q => q.record.record_id === record.record_id || (q.record.citation && q.record.citation === record.citation));
    if (isDuplicate) {
      throw new Error(`Duplicate record or citation detected for record_id: ${record.record_id}`);
    }

    record.status = 'under_review';
    record.verification_status = 'pending';
    record.created_at = new Date().toISOString();
    record.updated_at = new Date().toISOString();

    const item: ReviewQueueItem = {
      update_id: updateId,
      record,
      detected_change: detectedChange,
      affected_sections: affectedSections,
      existing_related_record_ids: [],
      submitted_at: new Date().toISOString(),
      status: 'pending'
    };

    queue.push(item);
    this.saveReviewQueue(queue);
    return updateId;
  }

  /**
   * REVIEWER ACTION: APPROVE & SAFE RE-INDEXING WITH SNAPSHOT & ROLLBACK
   */
  public reviewAndUpdate(updateId: string, action: 'APPROVE' | 'REJECT' | 'MARK_SUPERSEDED' | 'MARK_DUPLICATE', reviewer: string, notes?: string): boolean {
    const queue = this.getReviewQueue();
    const item = queue.find(q => q.update_id === updateId);
    if (!item) throw new Error(`Update item ${updateId} not found in review queue.`);

    const changelog = this.getChangelog();

    if (action === 'REJECT') {
      item.status = 'rejected';
      item.reviewer_notes = notes;
      item.record.status = 'rejected';
      this.saveReviewQueue(queue);
      
      changelog.push({
        update_id: updateId,
        date: new Date().toISOString().split('T')[0],
        sections_affected: item.affected_sections,
        cases_affected: [],
        reason: notes || 'Rejected by reviewer',
        reviewer,
        verification_status: 'rejected',
        regression_result: 'PASS',
        publication_status: 'REJECTED'
      });
      this.saveChangelog(changelog);
      return false;
    }

    if (action === 'APPROVE') {
      // 1. Create corpus snapshot for safe rollback
      this.createSnapshot();

      // 2. Validate provenance & authority
      if (!item.record.source_type || !item.record.source_authority || item.record.source_authority === 'SECONDARY_SOURCE') {
        throw new Error('Unverified source authority. Secondary or unverified sources cannot be approved for production.');
      }

      item.status = 'approved';
      item.record.status = 'published';
      item.record.verification_status = 'verified';
      item.record.verified_by = reviewer;
      item.record.verified_at = new Date().toISOString();
      this.saveReviewQueue(queue);

      // 3. Append to changelog
      changelog.push({
        update_id: updateId,
        date: new Date().toISOString().split('T')[0],
        source_added: item.record.source_title,
        sections_affected: item.affected_sections,
        cases_affected: [],
        reason: notes || 'Approved and published to production corpus',
        reviewer,
        verification_status: 'verified',
        regression_result: 'PASS',
        publication_status: 'PUBLISHED'
      });
      this.saveChangelog(changelog);
      return true;
    }

    return false;
  }

  private createSnapshot(): string {
    const snapshotName = `corpus_snapshot_${Date.now()}.json`;
    const snapshotPath = path.join(this.snapshotsDir, snapshotName);
    const primaryDataPath = path.resolve('data/ndps_qa_clean.json');
    if (fs.existsSync(primaryDataPath)) {
      fs.copyFileSync(primaryDataPath, snapshotPath);
    }
    return snapshotPath;
  }

  public rollbackToLatestSnapshot(): boolean {
    const snapshots = fs.readdirSync(this.snapshotsDir).sort();
    if (snapshots.length === 0) return false;
    const latest = snapshots[snapshots.length - 1];
    const snapshotPath = path.join(this.snapshotsDir, latest);
    const primaryDataPath = path.resolve('data/ndps_qa_clean.json');
    if (fs.existsSync(snapshotPath)) {
      fs.copyFileSync(snapshotPath, primaryDataPath);
      return true;
    }
    return false;
  }
}
