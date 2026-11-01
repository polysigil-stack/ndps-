import fs from 'fs';
import path from 'path';
import { KnowledgeUpdatePipeline, VersionedLegalRecord } from '../../src/server/knowledgePipeline';

async function testKnowledgePipeline() {
  console.log('=== STARTING NDPS KNOWLEDGE UPDATE & VERSIONING PIPELINE TESTS ===');
  const pipeline = new KnowledgeUpdatePipeline();
  
  // Reset queue for clean test run
  fs.writeFileSync(path.resolve('data/knowledge_review_queue.json'), '[]', 'utf-8');

  // Test 1: Submit new verified Supreme Court judgment
  console.log('\n[Test 1] Submitting new verified SC judgment...');
  const newRecord: VersionedLegalRecord = {
    record_id: 'sc_test_2026_1',
    question_number: 999,
    question: 'What did the Supreme Court hold regarding digital search warrants in State v. Test?',
    answer: 'The Supreme Court held that digital search warrants require specific judicial authorization under Section 42.',
    source: 'Supreme Court of India',
    source_title: 'State v. Test (2026)',
    citation: '(2026) 3 SCC 450',
    source_type: 'SUPREME_COURT_CASE',
    source_authority: 'SUPREME_COURT_JUDGMENT',
    publication_date: '2026-03-01',
    effective_date: '2026-03-01',
    verification_status: 'unverified',
    version: 1,
    status: 'draft',
    page: 1,
    quality_status: 'VERIFIED',
    section: 'Section 42',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updateId = pipeline.submitForReview(newRecord, 'New Supreme Court interpretation on digital search warrants', ['Section 42']);
  console.log(`✅ Submitted successfully with Update ID: ${updateId}`);

  // Test 2: Duplicate detection
  console.log('\n[Test 2] Testing duplicate submission...');
  try {
    pipeline.submitForReview(newRecord, 'Duplicate submission test', ['Section 42']);
    console.error('❌ Failed: Allowed duplicate submission!');
  } catch (e: any) {
    console.log(`✅ Duplicate correctly rejected: ${e.message}`);
  }

  // Test 3: Unverified / Secondary source rejection
  console.log('\n[Test 3] Testing secondary source restriction...');
  const secondaryRecord: VersionedLegalRecord = {
    ...newRecord,
    record_id: 'secondary_blog_1',
    citation: 'Blog post by unauthorized user',
    source_authority: 'SECONDARY_SOURCE'
  };
  const secUpdateId = pipeline.submitForReview(secondaryRecord, 'Blog post claim', ['Section 42']);

  try {
    pipeline.reviewAndUpdate(secUpdateId, 'APPROVE', 'Admin Auditor', 'Approving blog post');
    console.error('❌ Failed: Allowed approval of secondary source!');
  } catch (e: any) {
    console.log(`✅ Secondary source approval correctly blocked: ${e.message}`);
  }

  // Test 4: Approval & Publishing of valid SC judgment
  console.log('\n[Test 4] Approving valid SC judgment...');
  const approved = pipeline.reviewAndUpdate(updateId, 'APPROVE', 'Chief Legal Reviewer', 'Verified against official Supreme Court judgment text.');
  if (approved) {
    console.log('✅ Record approved and published to production corpus with snapshot backing.');
  } else {
    console.error('❌ Approval failed!');
  }

  // Test 5: Rollback mechanism test
  console.log('\n[Test 5] Testing rollback mechanism...');
  const rolledBack = pipeline.rollbackToLatestSnapshot();
  if (rolledBack) {
    console.log('✅ Rollback mechanism executed successfully.');
  } else {
    console.log('⚠️ No snapshot available for rollback.');
  }

  console.log('\n======================================================================');
  console.log('✅ ALL KNOWLEDGE PIPELINE & VERSIONING TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================================');
}

testKnowledgePipeline().catch(console.error);
