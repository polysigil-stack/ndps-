import fs from 'fs';
import path from 'path';
import { NDPSRecord, RetrievalResult } from './types';
import { GoogleGenAI } from '@google/genai';
import { normalizeStatutoryReferences } from './normalization';

// Stop words list
const STOP_WORDS: Set<string> = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t',
  'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t',
  'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s',
  'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were',
  'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s',
  'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re',
  'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'please', 'tell', 'explain', 'give'
]);

export class RetrievalEngine {
  private records: NDPSRecord[] = [];
  private embeddings: Record<string, number[]> = {};
  private invertedIndex: Map<string, Array<{ docId: string; tf: number; inQuestion: boolean }>> = new Map();
  private docLengths: Map<string, number> = new Map();
  private avgDocLength: number = 0;
  private sectionMap: Map<string, Set<string>> = new Map(); // sectionKey -> Set of docIds
  private aiClient: GoogleGenAI | null = null;

  constructor() {
    this.loadData();
    this.buildBM25Index();
    this.initAI();
  }

  private initAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }

  private loadData() {
    const dataPath = path.resolve('data/ndps_qa_clean.json');
    const caseLawPath = path.resolve('data/ndps_caselaw.json');
    const docPath = path.resolve('data/ndps_documentation.json');
    
    let allRecords: NDPSRecord[] = [];

    if (fs.existsSync(dataPath)) {
      try {
        const statRecords = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        // Assign source_type 'statutory' if missing
        statRecords.forEach((r: NDPSRecord) => {
          if (!r.source_type) r.source_type = 'statutory';
        });
        allRecords = allRecords.concat(statRecords);
      } catch (e) {
        console.error('[RetrievalEngine] Failed to load statutory records:', e);
      }
    } else {
      console.warn('[RetrievalEngine] data/ndps_qa_clean.json not found!');
    }

    if (fs.existsSync(caseLawPath)) {
      try {
        const caseRecords = JSON.parse(fs.readFileSync(caseLawPath, 'utf-8'));
        // Assign source_type 'case_law' if missing
        caseRecords.forEach((r: NDPSRecord) => {
          if (!r.source_type) r.source_type = 'case_law';
        });
        allRecords = allRecords.concat(caseRecords);
      } catch (e) {
        console.error('[RetrievalEngine] Failed to load case law records:', e);
      }
    } else {
      console.warn('[RetrievalEngine] data/ndps_caselaw.json not found!');
    }

    if (fs.existsSync(docPath)) {
      try {
        const docRecords = JSON.parse(fs.readFileSync(docPath, 'utf-8'));
        docRecords.forEach((r: NDPSRecord) => {
          if (!r.source_type) r.source_type = 'investigation_documentation';
        });
        allRecords = allRecords.concat(docRecords);
      } catch (e) {
        console.error('[RetrievalEngine] Failed to load documentation records:', e);
      }
    } else {
      console.warn('[RetrievalEngine] data/ndps_documentation.json not found!');
    }

    this.records = allRecords;
    console.log(`[RetrievalEngine] Loaded ${this.records.length} total NDPS records.`);

    this.reloadEmbeddings();
  }

  public reloadEmbeddings(): number {
    const embPath = path.resolve('data/ndps_embeddings.json');
    if (fs.existsSync(embPath)) {
      try {
        this.embeddings = JSON.parse(fs.readFileSync(embPath, 'utf-8'));
        const count = Object.keys(this.embeddings).length;
        console.log(`[RetrievalEngine] Loaded ${count} cached vector embeddings.`);
        return count;
      } catch (e) {
        console.error('[RetrievalEngine] Failed to load embeddings cache:', e);
      }
    }
    return 0;
  }

  public getRecordCount(): number {
    return this.records.length;
  }

  public getEmbeddingCount(): number {
    return Object.keys(this.embeddings).length;
  }

  public getAllRecords(): NDPSRecord[] {
    return this.records;
  }

  // Tokenizer with punctuation stripping & normalization
  private tokenize(text: string): string[] {
    if (!text) return [];
    return normalizeStatutoryReferences(text)
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
  }

  // Extract explicit statutory references (e.g., Section 50, Section 42, PIT NDPS, Chapter V-A)
  private extractSections(text: string): string[] {
    const sections = new Set<string>();
    const lower = normalizeStatutoryReferences(text).toLowerCase();

    // Specific section patterns
    const secRegex = /(?:section|sec\.?|s\.)\s*([0-9]+[a-z]?)/gi;
    let match: RegExpExecArray | null;
    while ((match = secRegex.exec(lower)) !== null) {
      sections.add(`section_${match[1].toLowerCase()}`);
    }

    // Bare section mentions like "50 ndps" or "42(2)"
    const bareSecRegex = /\b([0-9]{1,3}[a-z]?)\s*(?:ndps|of the ndps|of ndps|bnss|bsa|bns)\b/gi;
    while ((match = bareSecRegex.exec(lower)) !== null) {
      sections.add(`section_${match[1].toLowerCase()}`);
    }

    // Chapters and Acts
    if (lower.includes('chapter v-a') || lower.includes('chapter va') || lower.includes('chapter 5a') || lower.includes('forfeiture of illegally acquired')) {
      sections.add('chapter_va');
    }
    if (lower.includes('pit ndps') || lower.includes('preventive detention') || lower.includes('act 1988')) {
      sections.add('pit_ndps');
    }
    if (lower.includes('bnss') || lower.includes('nagarik suraksha')) {
      sections.add('bnss');
    }
    if (lower.includes('bsa') || lower.includes('sakshya')) {
      sections.add('bsa');
    }

    return Array.from(sections);
  }

  // Semantic query expander with clean NDPS legal concept mappings
  private expandQuery(query: string): string {
    const lower = normalizeStatutoryReferences(query).toLowerCase();
    const additions: string[] = [];

    // General NDPS Statutory Overview (Chunk 1)
    if (lower.includes('regulate') || lower.includes('governs') || lower.includes('law governs') || lower.includes('statute') || lower.includes('ndps act')) {
      additions.push('narcotic drugs and psychotropic substances act 1985 primary penal statute in india governing regulation prohibition');
    }

    // General NDPS vs PIT NDPS distinctions (Chunk 2)
    if (lower.includes('difference') || lower.includes('different') || lower.includes('versus') || lower.includes('vs') || lower.includes('criminal law') || lower.includes('preventive detention')) {
      additions.push('difference primary legal distinctions criminal prosecution vs preventive detention ndps act 1985 vs pit ndps act 1988 executive preventive detention');
    }

    // Conviction vs Preventive Detention (Chunk 3)
    if (lower.includes('conviction') || lower.includes('convicted') || lower.includes('awards conviction') || lower.includes('criminal prosecution') || lower.includes('detention mean')) {
      additions.push('criminal conviction awarded competent court judicial trial criminal prosecution ndps act 1985 executive detention order does not amount to criminal conviction');
    }

    // Vulnerable areas / Section 10 (Chunk 4)
    if (lower.includes('vulnerable area') || lower.includes('declaration') || lower.includes('section 10')) {
      additions.push('section 10 declaration vulnerable area pit ndps act 1988');
    }

    // Detention periods / Section 11 (Chunk 5)
    if (lower.includes('how long') || lower.includes('continue') || lower.includes('maximum detention') || lower.includes('detention period') || lower.includes('two years') || lower.includes('one year') || lower.includes('1 year') || lower.includes('2 years')) {
      additions.push('section 11 maximum detention period general maximum period 1 year 2 years preventive detention pit ndps act 1988');
    }
    if (lower.includes('section 11') || lower.includes('section11')) {
      additions.push('section 11 ndps act 1985 prohibition of attachment distrained attached recovery money pit ndps act 1988 maximum period of detention');
    }

    // Death penalty / Section 31A (Chunk 6)
    if (lower.includes('death penalty') || lower.includes('capital punishment') || lower.includes('repeat offence') || lower.includes('repeat offences') || lower.includes('section 31a')) {
      additions.push('section 31a enhanced penalty discretionary death penalty repeat offences ndps act 1985');
    }

    if (lower.includes('ndps') && !lower.includes('narcotic')) {
      additions.push('narcotic drugs and psychotropic substances act 1985');
    }
    if ((lower.includes('pit') || lower.includes('preventive')) && !lower.includes('prevention of illicit')) {
      additions.push('prevention of illicit traffic in narcotic drugs and psychotropic substances act 1988 pit ndps');
    }

    // Prior information & search scenarios (Sections 41, 42, 43, recording information)
    if (lower.includes('informant') || lower.includes('prior information') || lower.includes('secret information') || lower.includes('gupt suchna') || lower.includes('vehicle') || lower.includes('conveyance') || lower.includes('planned search') || lower.includes('reduction to writing')) {
      additions.push('section 42 section 43 section 41 prior information recording secret intelligence conveyance vehicle public place search authorization');
    }

    return additions.length > 0 ? `${query} ${additions.join(' ')}` : query;
  }

  private buildBM25Index() {
    let totalLen = 0;

    for (const rec of this.records) {
      const qTokens = this.tokenize(rec.question);
      const aTokens = this.tokenize(rec.answer);
      const combinedTokens = [...qTokens, ...aTokens];
      const docLen = combinedTokens.length;

      this.docLengths.set(rec.record_id, docLen);
      totalLen += docLen;

      // Extract sections in this record
      const recordText = `${rec.question} ${rec.answer} ${rec.rag_text || ''}`;
      const detectedSections = this.extractSections(recordText);
      for (const s of detectedSections) {
        if (!this.sectionMap.has(s)) {
          this.sectionMap.set(s, new Set());
        }
        this.sectionMap.get(s)!.add(rec.record_id);
      }

      // Track term frequencies
      const termCounts = new Map<string, { tf: number; inQuestion: boolean }>();
      for (const t of qTokens) {
        const cur = termCounts.get(t) || { tf: 0, inQuestion: true };
        cur.tf += 2.5; // Boost question tokens
        cur.inQuestion = true;
        termCounts.set(t, cur);
      }
      for (const t of aTokens) {
        const cur = termCounts.get(t) || { tf: 0, inQuestion: false };
        cur.tf += 1.0;
        termCounts.set(t, cur);
      }

      for (const [term, data] of termCounts.entries()) {
        if (!this.invertedIndex.has(term)) {
          this.invertedIndex.set(term, []);
        }
        this.invertedIndex.get(term)!.push({
          docId: rec.record_id,
          tf: data.tf,
          inQuestion: data.inQuestion
        });
      }
    }

    this.avgDocLength = this.records.length > 0 ? totalLen / this.records.length : 1;
    console.log(`[RetrievalEngine] BM25 index built with ${this.invertedIndex.size} unique terms. Detected sections: ${this.sectionMap.size}`);
  }

  private computeBM25(queryTokens: string[]): Map<string, number> {
    const scores = new Map<string, number>();
    const k1 = 1.2;
    const b = 0.75;
    const N = this.records.length;

    for (const token of queryTokens) {
      const postings = this.invertedIndex.get(token);
      if (!postings) continue;

      const df = postings.length;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);

      for (const post of postings) {
        const docLen = this.docLengths.get(post.docId) || this.avgDocLength;
        const tf = post.tf;
        const denom = tf + k1 * (1 - b + (b * docLen) / this.avgDocLength);
        const termScore = idf * ((tf * (k1 + 1)) / denom);

        scores.set(post.docId, (scores.get(post.docId) || 0) + termScore);
      }
    }

    return scores;
  }

  // Cosine similarity between two vectors
  private cosineSimilarity(v1: number[], v2: number[]): number {
    if (!v1 || !v2 || v1.length !== v2.length) return 0;
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }
    const denom = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denom === 0 ? 0 : dot / denom;
  }

  private queryEmbeddingCache: Map<string, number[]> = new Map();
  private quotaCooldownUntil: number = 0;

  // Generate vector embedding for user query
  private async embedQuery(queryText: string): Promise<number[] | null> {
    const normKey = queryText.toLowerCase().trim();
    if (this.queryEmbeddingCache.has(normKey)) {
      return this.queryEmbeddingCache.get(normKey)!;
    }
    if (!this.aiClient) return null;
    if (Date.now() < this.quotaCooldownUntil) {
      return null;
    }

    try {
      const res = await this.aiClient.models.embedContent({
        model: 'gemini-embedding-001',
        contents: queryText
      });
      if (res.embeddings && res.embeddings[0]?.values) {
        const vals = res.embeddings[0].values;
        this.queryEmbeddingCache.set(normKey, vals);
        return vals;
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isQuota = errMsg.includes('429') || errMsg.includes('Quota exceeded') || errMsg.includes('RESOURCE_EXHAUSTED') || err?.status === 'RESOURCE_EXHAUSTED';
      if (isQuota) {
        this.quotaCooldownUntil = Date.now() + 60000; // 1 minute cooldown
        console.warn('[RetrievalEngine] Query embedding skipped due to API quota limits (429). Falling back to high-fidelity BM25 lexical retrieval.');
      } else {
        console.warn('[RetrievalEngine] Query embedding skipped/failed:', errMsg);
      }
    }
    return null;
  }

  // Check exact question or high token overlap
  private checkExactMatch(query: string, record: NDPSRecord): number {
    const normalizeAcronyms = (str: string) =>
      normalizeStatutoryReferences(str)
         .toLowerCase()
         .replace(/\bnarcotic drugs and psychotropic substances act\b/g, 'ndps act')
         .replace(/\bnarcotic drugs and psychotropic substances\b/g, 'ndps')
         .replace(/[^\w\s]/g, '')
         .trim();

    const qClean = normalizeAcronyms(query);
    const rCleanQ = normalizeAcronyms(record.question);
    const rCleanT = normalizeAcronyms(record.title || record.source || '');

    if (qClean === rCleanQ || qClean === rCleanT) return 1.0;

    // Extract numbers / section identifiers (e.g. "10", "11", "31a")
    const getNumbers = (str: string): string[] => (str.match(/\b\d+[a-z]?\b/g) || []);
    const qNums = getNumbers(qClean);
    const rNums = getNumbers(rCleanQ);

    // If both have section numbers but they don't overlap, it's NOT a match (e.g., Section 10 vs Section 11)
    if (qNums.length > 0 && rNums.length > 0) {
      const hasNumberMatch = qNums.some(n => rNums.includes(n));
      if (!hasNumberMatch) return 0;
    }

    if (qClean.length >= 3 && (rCleanQ.includes(qClean) || qClean.includes(rCleanQ) || (rCleanT.length >= 3 && (rCleanT.includes(qClean) || qClean.includes(rCleanT))))) {
      return 0.95;
    }

    // Word Jaccard and coverage
    const qWords = new Set(qClean.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w)));
    const rWords = new Set(rCleanQ.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w)));
    if (qWords.size === 0 || rWords.size === 0) return 0;

    let common = 0;
    for (const w of qWords) {
      if (rWords.has(w)) common++;
    }
    const union = new Set([...qWords, ...rWords]).size;
    const jaccard = union > 0 ? common / union : 0;
    const qCoverage = common / qWords.size;
    const rCoverage = common / rWords.size;

    if (qCoverage >= 0.8 || rCoverage >= 0.8 || jaccard >= 0.6) {
      return 0.85 + 0.1 * Math.max(qCoverage, jaccard);
    }

    return 0;
  }

  // Main Hybrid Retrieval entry point
  public async retrieve(query: string, topK: number = 5): Promise<RetrievalResult[]> {
    const queryClean = normalizeStatutoryReferences(query.trim());
    if (!queryClean) return [];

    const querySections = this.extractSections(queryClean);
    const expandedQuery = this.expandQuery(queryClean);
    const queryTokens = this.tokenize(expandedQuery);

    // 1. BM25 scoring
    const bm25Map = this.computeBM25(queryTokens);

    // Normalize BM25 scores to [0, 1]
    let maxBm25 = 0;
    for (const s of bm25Map.values()) {
      if (s > maxBm25) maxBm25 = s;
    }

    // 2. Vector Embedding of the query
    let queryVector: number[] | null = null;
    try {
      queryVector = await this.embedQuery(queryClean);
    } catch (e) {
      console.warn('[RetrievalEngine] Vector search fallback to lexical:', e);
    }

    const hasVector = queryVector !== null && Object.keys(this.embeddings).length > 0;

    // 3. Score every record
    const scoredResults: RetrievalResult[] = [];

    for (const record of this.records) {
      const docId = record.record_id;
      const rawBm25 = bm25Map.get(docId) || 0;
      const normBm25 = maxBm25 > 0 ? rawBm25 / maxBm25 : 0;

      // Section match bonus
      let sectionBoost = 0;
      if (querySections.length > 0) {
        for (const sec of querySections) {
          const matchingDocs = this.sectionMap.get(sec);
          if (matchingDocs && matchingDocs.has(docId)) {
            sectionBoost += 0.45;
          }
        }
      }

      // Vector cosine similarity
      let cosineSim = 0;
      if (hasVector && this.embeddings[docId]) {
        cosineSim = this.cosineSimilarity(queryVector!, this.embeddings[docId]);
      }

      // Exact question match check
      const exactScore = this.checkExactMatch(queryClean, record);

      // Canonical chunk boost (rec_chunk_1 to rec_chunk_6 and stat_ statutory chunks)
      const isRelevant = exactScore > 0.8 || normBm25 > 0.15 || (hasVector && cosineSim > 0.68);
      const canonicalBoost = ((docId.startsWith('rec_chunk_') || docId.startsWith('stat_')) && isRelevant) ? 0.20 : 0.0;

      // Source type boost logic
      let sourceTypeBoost = 0;
      const lowerQuery = queryClean.toLowerCase();
      const isCaseLawQuery = lowerQuery.includes('supreme court') || lowerQuery.includes('high court') || lowerQuery.includes('held') || lowerQuery.includes('interpretation') || lowerQuery.includes('case law') || lowerQuery.includes('judgment') || lowerQuery.includes('ruling');
      const isStatutoryQuery = lowerQuery.includes('act provide') || lowerQuery.includes('statute') || lowerQuery.match(/\bwhat is section\b/) || lowerQuery.match(/\bdoes section\b/) || lowerQuery.match(/\bwhat does section\b/);

      if (isCaseLawQuery && record.source_type === 'case_law' && isRelevant) {
        sourceTypeBoost += 0.30;
      }
      if (isStatutoryQuery && record.source_type === 'statutory' && isRelevant) {
        sourceTypeBoost += 0.30;
      }

      // Hybrid calculation
      let finalScore = 0;
      if (exactScore > 0.8) {
        finalScore = 10.0 + exactScore + (0.50 * normBm25) + (0.30 * cosineSim) + (0.20 * sectionBoost) + canonicalBoost + sourceTypeBoost;
      } else if (hasVector) {
        finalScore = (0.50 * cosineSim) + (0.35 * normBm25) + (0.25 * sectionBoost) + canonicalBoost + sourceTypeBoost;
      } else {
        finalScore = (0.65 * normBm25) + (0.35 * sectionBoost) + canonicalBoost + sourceTypeBoost;
      }

      // Matched terms
      const recordTokens = new Set(this.tokenize(`${record.question} ${record.answer}`));
      const matchedTerms = queryTokens.filter(t => recordTokens.has(t)).slice(0, 6);

      scoredResults.push({
        record,
        score: finalScore,
        cosineSimilarity: hasVector ? Math.max(0, cosineSim) : undefined,
        bm25Score: rawBm25,
        sectionBoost,
        exactMatch: exactScore > 0.8,
        matchedTerms
      });
    }

    // Sort descending by score
    scoredResults.sort((a, b) => b.score - a.score);

    const topResults = scoredResults.slice(0, topK);

    console.log(`[RetrievalEngine] Retrieved ${topResults.length} records for query: "${query.slice(0, 45)}...". Top score: ${topResults[0]?.score.toFixed(3)}`);
    return topResults;
  }
}

export const retrievalEngine = new RetrievalEngine();

