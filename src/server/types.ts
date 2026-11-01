export interface NDPSRecord {
  record_id: string;
  question_number: number;
  question: string;
  answer: string;
  source: string;
  title?: string;
  page: number;
  quality_status: string;
  retrieval_eligible?: boolean;
  rag_text?: string;
  quality_issues?: string[];
  section?: string;
  act?: string;
  chapter?: string;
  source_type?: string;
}

export interface RetrievalResult {
  record: NDPSRecord;
  score: number;
  cosineSimilarity?: number;
  bm25Score?: number;
  sectionBoost?: number;
  exactMatch?: boolean;
  matchedTerms?: string[];
}

export interface Citation {
  record_id: string;
  section: string | null;
  act: string | null;
  title: string | null;
  source: string | null;
  source_type: string | null;
  evidence: string;
}

export type RecoveryPathway = 'INFORMATION_BASED' | 'CHANCE_RECOVERY' | 'OTHER' | 'UNSET';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  sources?: SourceCitation[];
  citations?: Citation[];
  retrievedRecords?: RetrievalResult[];
  pathway_selector?: boolean;
  selected_pathway?: RecoveryPathway;
  debugInfo?: {
    latencyMs: number;
    retrievalType: string;
    sectionsDetected: string[];
    topScore: number;
  };
}

export interface SourceCitation {
  questionNumber: number;
  source: string;
  page: number;
  recordId: string;
  questionText: string;
  answerSnippet: string;
}
