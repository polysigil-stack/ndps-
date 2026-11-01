export interface NDPSRecord {
  record_id: string;
  question_number: number;
  question: string;
  answer: string;
  source: string;
  page: number;
  quality_status: string;
  retrieval_eligible?: boolean;
  rag_text?: string;
  quality_issues?: string[];
}

export interface SourceCitation {
  questionNumber?: number;
  source?: string | null;
  page?: number;
  recordId?: string;
  questionText?: string;
  answerSnippet?: string;
  record_id?: string;
  section?: string | null;
  act?: string | null;
  title?: string | null;
  court?: string | null;
  source_type?: string | null;
  evidence?: string | null;
}

export interface CitationItem extends SourceCitation {}

export interface RetrievalResult {
  record: NDPSRecord;
  score: number;
  cosineSimilarity?: number;
  bm25Score?: number;
  sectionBoost?: number;
  exactMatch?: boolean;
  matchedTerms?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  userQuery?: string;
  userLanguage?: 'hi-IN' | 'en-IN';
  responseLanguage?: 'auto' | 'hi' | 'en';
  sources?: SourceCitation[];
  citations?: CitationItem[];
  retrievedRecords?: RetrievalResult[];
  pathway_selector?: boolean;
  selected_pathway?: 'INFORMATION_BASED' | 'CHANCE_RECOVERY' | 'OTHER' | 'UNSET';
  related_questions?: string[];
  debugInfo?: {
    latencyMs: number;
    retrievalType: string;
    topScore: number;
    recordCountRetrieved: number;
  };
}

export interface TestCase {
  id: string;
  title: string;
  category: string;
  query: string;
  description: string;
}

export interface AppSettings {
  showSources: boolean;
  showProceduralGuidance: boolean;
  voiceLanguageMode?: 'auto' | 'hi-IN' | 'en-IN';
}

export interface CaseDocumentItem {
  document_id: string;
  document_type: string;
  title: string;
  filename: string;
  pages: number;
  status: 'processed' | 'extracting' | 'error';
  uploaded_at?: string;
  extracted_summary?: string;
}

export interface CaseConflictItem {
  conflict_id?: string;
  field: string;
  description: string;
  documents: Array<{
    document_id?: string;
    document_type: string;
    value: string;
    page?: number;
  }>;
}

export interface CaseDetails {
  case_id: string;
  case_title: string;
  is_fixture?: boolean;
  record_type?: 'case' | 'demo' | 'test';
  document_type: string;
  source_document: string;
  pages: number;
  documents?: CaseDocumentItem[];
  fir_details: {
    police_station: string;
    district: string;
    state?: string;
    fir_number: string;
    date: string;
    sections: string[];
    investigating_officer: string;
  };
  persons?: Array<{
    role?: string;
    name?: string;
    particulars_recorded: boolean;
    personal_search_conducted: boolean;
    personal_search_result: string;
  }>;
  vehicle: {
    type: string;
    registration_number: string;
    documents_checked: string[];
  };
  seizure: {
    substance: string;
    bags: string;
    total_quantity: string;
    place: string;
  };
  fsl_details?: {
    report_number?: string;
    lab_name?: string;
    sample_marks?: string;
    substance_detected?: string;
    received_date?: string;
    report_date?: string;
    status?: string;
  };
  procedural_steps: Array<{
    step_number: number;
    step: string;
    description: string;
    source_document?: string;
    page: number;
  }>;
  procedural_steps_not_established: Array<{
    step: string;
    description: string;
  }>;
  conflicts?: CaseConflictItem[];
}

export type EvidenceStatus = 'DOCUMENTED' | 'NOT_ESTABLISHED' | 'CONFLICTING' | 'REQUIRES_VERIFICATION';

export interface CaseFactItem {
  fact_id: string;
  category: string;
  field: string;
  value: string;
  status: EvidenceStatus;
  document: string;
  page?: number;
  details?: string;
}

export interface ProceduralReviewItem {
  area: string;
  category_number: number;
  status: EvidenceStatus;
  evidence_summary: string;
  documents: string[];
  pages?: number[];
  notes?: string;
  verification_prompt?: string;
}

export interface TimelineEventItem {
  event_id: string;
  step_number: number;
  event: string;
  date?: string;
  time?: string;
  document: string;
  page: number;
  status: EvidenceStatus;
  description: string;
}

export interface DocumentCoverageItem {
  document_type: string;
  title: string;
  status: 'AVAILABLE' | 'NOT_UPLOADED';
  pages?: number;
  filename?: string;
  notes?: string;
}

export interface CaseInvestigationAnalysis {
  case_id: string;
  case_title: string;
  summary_metrics: {
    documents_available: number;
    documents_not_uploaded: number;
    facts_documented: number;
    procedural_steps_documented: number;
    conflicts_detected: number;
    not_established_items: number;
    requires_verification_items: number;
  };
  document_coverage: DocumentCoverageItem[];
  facts: CaseFactItem[];
  persons: Array<{
    name: string;
    role: string;
    status: EvidenceStatus;
    document: string;
    page?: number;
    personal_search_result: string;
  }>;
  vehicles: Array<{
    type: string;
    registration_number: string;
    status: EvidenceStatus;
    document: string;
    page?: number;
  }>;
  substances: Array<{
    substance: string;
    status: EvidenceStatus;
    document: string;
    page?: number;
  }>;
  quantities: Array<{
    quantity: string;
    bags: string;
    status: EvidenceStatus;
    document: string;
    page?: number;
  }>;
  sections: Array<{
    section: string;
    description: string;
    status: EvidenceStatus;
    document: string;
    page?: number;
  }>;
  procedural_review: ProceduralReviewItem[];
  timeline: TimelineEventItem[];
  conflicts: Array<{
    conflict_id: string;
    field: string;
    description: string;
    status: 'CONFLICTING';
    documents: Array<{
      document_id?: string;
      document_type: string;
      value: string;
      page?: number;
    }>;
  }>;
  not_established: Array<{
    item_id: string;
    area: string;
    description: string;
    status: 'NOT_ESTABLISHED';
    reason: string;
  }>;
  requires_verification: Array<{
    item_id: string;
    area: string;
    prompt: string;
    status: 'REQUIRES_VERIFICATION';
    context: string;
  }>;
}

export type OCRConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'VISUAL_VERIFICATION_REQUIRED';

export type EvidenceCategory =
  | 'SUBSTANCE'
  | 'PARCEL'
  | 'QUANTITY'
  | 'WEIGHT'
  | 'SAMPLE'
  | 'SEAL'
  | 'PACKAGING'
  | 'VEHICLE'
  | 'PERSON'
  | 'SEARCH'
  | 'SEIZURE'
  | 'ARREST'
  | 'INVENTORY'
  | 'MAGISTRATE_CERTIFICATION'
  | 'RESEALING'
  | 'FSL'
  | 'MALKHANA'
  | 'OFFICER_ACTION'
  | 'DATE'
  | 'TIME'
  | 'LOCATION'
  | 'DOCUMENT_REFERENCE'
  | 'PROCEDURAL_EVENT'
  | 'OTHER';

export interface CaseEvidenceItem {
  evidence_id: string;
  case_id: string;
  document_id: string;
  document_type: string;
  document_name: string;
  page: number;
  evidence_category: EvidenceCategory;
  fact: string;
  normalized_value: any;
  raw_value: string;
  context: string;
  status: EvidenceStatus;
  confidence: number;
  ocr_confidence: OCRConfidence;
  extraction_method: 'DOCUMENT_ANALYSIS' | 'STRUCTURED_RECONCILIATION' | 'CROSS_VERIFICATION';
  related_evidence_ids: string[];
  created_at: string;
}

export interface ParcelItem {
  parcel_id: string;
  case_id: string;
  substance: string;
  document_id: string;
  page: number;
  source_value: string;
  weight: number;
  weight_unit: string;
  packaging: string;
  seal_marks: string[];
  original_seal: string;
  reseal_mark?: string;
  court_seal?: string;
  sample_weight?: number;
  sample_status?: 'SAMPLE_MENTIONED' | 'SAMPLE_DRAWN' | 'SAMPLE_DISPATCHED' | 'SAMPLE_RECEIVED_BY_FSL' | 'FSL_EXAMINATION_COMPLETED' | 'NOT_ESTABLISHED';
  inventory_reference?: string;
  section_52a_reference?: string;
  section_55_reference?: string;
  fsl_reference?: string;
  status: EvidenceStatus;
  documented_weights: {
    seizure_memo?: { raw: string; normalized_kg: number; doc: string; page: number };
    inventory_52a?: { raw: string; normalized_kg: number; doc: string; page: number };
    magistrate_cert_52a?: { raw: string; normalized_kg: number; doc: string; page: number };
    resealing_55?: { raw: string; normalized_kg: number; doc: string; page: number };
  };
  weight_status: 'CONSISTENT' | 'CONFLICTING' | 'REQUIRES_VERIFICATION';
  difference_note?: string;
}

export interface WeightComparisonItem {
  field: string;
  entity: string;
  source_a: string;
  value_a: number | string;
  raw_a: string;
  source_b: string;
  value_b: number | string;
  raw_b: string;
  difference: number;
  difference_str: string;
  unit: string;
  status: 'MATCHING' | 'CONFLICTING' | 'REQUIRES_VERIFICATION' | 'NOT_ESTABLISHED';
  notes?: string;
}

export interface WeightDashboardData {
  reported_total_fir: { raw: string; kg: number; doc: string };
  reported_total_seizure: { raw: string; kg: number; doc: string };
  sum_seizure_parcels: { kg: number; difference_vs_fir: number; status: 'MATCH' | 'MISMATCH' };
  inventory_52a_total: { raw: string; kg: number; doc: string };
  magistrate_52a_total: { raw: string; kg: number; doc: string; difference_vs_fir: number; status: 'MATCH' | 'MISMATCH' };
  resealing_55_total: { raw: string; kg: number; doc: string };
  comparisons: WeightComparisonItem[];
}

export interface MagistrateInventoryComparisonItem {
  field: string;
  entity: string;
  inventory_value: string;
  inventory_doc: string;
  inventory_page: number;
  certificate_value: string;
  certificate_doc: string;
  certificate_page: number;
  status: 'MATCHING' | 'CONFLICTING' | 'ONLY_IN_INVENTORY' | 'ONLY_IN_CERTIFICATE' | 'NOT_ESTABLISHED';
  difference?: string;
  notes?: string;
}

export interface Section55ResealingData {
  document_id: string;
  document_name: string;
  page: number;
  case_reference: string;
  date: string;
  time: string;
  officer_presenting: string;
  officer_resealing: string;
  parcels: string[];
  original_seal_observed: string;
  reseal_applied: string;
  weights_recorded: Record<string, string>;
  malkhana_custody_indicated: boolean;
  duplicate_copy_present: boolean;
  duplicate_file_name: string;
  provenance: string;
}

export interface SealTrackingItem {
  seal_id: string;
  seal_mark: string;
  impression_description: string;
  document_id: string;
  document_name: string;
  document_type: string;
  page: number;
  parcel_id?: string;
  seal_role: 'ORIGINAL_IO_SEAL' | 'STATION_RESEAL' | 'COURT_MAGISTRATE_SEAL' | 'FSL_LAB_SEAL';
  status: 'CONSISTENT' | 'CONFLICTING' | 'NOT_ESTABLISHED';
  context: string;
}

export interface SampleTrackingItem {
  sample_id: string;
  parcel_id: string;
  sample_weight: number;
  unit: string;
  sample_description: string;
  seal: string;
  document_id: string;
  document_name: string;
  page: number;
  source_text: string;
  destination: string;
  dispatch_status: 'SAMPLE_MENTIONED' | 'SAMPLE_DRAWN' | 'SAMPLE_DISPATCHED' | 'SAMPLE_RECEIVED_BY_FSL' | 'FSL_EXAMINATION_COMPLETED' | 'NOT_ESTABLISHED';
  fsl_reference?: string;
  status: EvidenceStatus;
}

export interface DocumentDuplicateItem {
  primary_file: string;
  duplicate_file: string;
  match_type: 'EXACT_DUPLICATE' | 'LIKELY_DUPLICATE' | 'POSSIBLE_DUPLICATE' | 'DISTINCT_DOCUMENT';
  reason: string;
  action_taken: 'BOTH_FILES_PRESERVED_NO_DOUBLE_COUNT';
}

export interface EvidenceRelationItem {
  relation_id: string;
  case_id: string;
  from_evidence_id: string;
  relation_type:
    | 'SAME_EVENT'
    | 'SAME_PARCEL'
    | 'SAME_SUBSTANCE'
    | 'SAME_PERSON'
    | 'SAME_DOCUMENT'
    | 'REFERENCES'
    | 'CORROBORATES'
    | 'CONTRADICTS'
    | 'FOLLOWS'
    | 'PRECEDES'
    | 'SAMPLE_OF'
    | 'RESEAL_OF'
    | 'INVENTORY_OF'
    | 'CERTIFIES'
    | 'REPORTS'
    | 'FORWARDED_TO';
  to_evidence_id: string;
  source_document_id: string;
  page: number;
  status: EvidenceStatus;
}

export interface TimelineProvenanceEvent {
  event_id: string;
  date: string;
  time: string;
  event: string;
  officer: string;
  document: string;
  page: number;
  evidence_ids: string[];
  status: EvidenceStatus;
  notes?: string;
}

export interface ExecutiveSummaryData {
  case_id: string;
  case_title: string;
  fir_number: string;
  police_station: string;
  district: string;
  recovery: string;
  substance: string;
  quantity: string;
  parcels: string[];
  sampling: string;
  sealing: string;
  section_52a: string;
  section_55: string;
  fsl: string;
  conflicts_count: number;
  verification_items_count: number;
  coverage_scorecard: {
    documented_count: number;
    conflicting_count: number;
    not_established_count: number;
    requires_verification_count: number;
    disclaimer: string;
  };
}

export interface InvestigationChecklistItem {
  id: string;
  category: string;
  title: string;
  status: 'DOCUMENTED' | 'NOT_ESTABLISHED' | 'CONFLICTING' | 'REQUIRES_VERIFICATION';
  evidence_count: number;
  documents: string[];
  pages: number[];
  conflicts?: string[];
  verification_notes?: string;
  evidence_ids: string[];
}

export interface ConflictWorkspaceItem {
  conflict_id: string;
  category: 'QUANTITY' | 'WEIGHT' | 'SEAL' | 'DATE' | 'TIME' | 'PERSON' | 'VEHICLE' | 'DOCUMENT_REFERENCE' | 'PROCEDURAL_EVENT' | 'OTHER';
  field: string;
  entity: string;
  source_a: string;
  value_a: string;
  document_a: string;
  page_a: number;
  source_b: string;
  value_b: string;
  document_b: string;
  page_b: number;
  difference?: string;
  status: 'CONFLICTING';
  resolution_note: string;
  evidence_ids: string[];
}

export interface VerificationWorkspaceItem {
  issue_id: string;
  title: string;
  why_flagged: string;
  supporting_documents: string[];
  pages: number[];
  evidence_ids: string[];
  category: string;
  status: 'REQUIRES_VERIFICATION';
}

export interface DocumentComparisonField {
  field_name: string;
  value_a: string;
  value_b: string;
  status: 'MATCH' | 'CONFLICT' | 'ONLY_IN_DOCUMENT_A' | 'ONLY_IN_DOCUMENT_B' | 'NOT_ESTABLISHED';
  difference?: string;
  notes?: string;
}

export interface DocumentComparisonResult {
  doc_a: { document_id: string; document_name: string; document_type: string; pages: number };
  doc_b: { document_id: string; document_name: string; document_type: string; pages: number };
  fields: DocumentComparisonField[];
}

export interface EvidenceGraphNode {
  id: string;
  label: string;
  type: 'Case' | 'Document' | 'Parcel' | 'Sample' | 'Seal' | 'Event' | 'Person' | 'Vehicle' | 'Substance';
  status?: EvidenceStatus;
  document_id?: string;
  page?: number;
  evidence_id?: string;
  details?: string;
}

export interface EvidenceGraphEdge {
  id: string;
  source: string;
  target: string;
  label: 'DOCUMENTS' | 'CONTAINS' | 'REFERENCES' | 'SAMPLE_OF' | 'RESEALED_AS' | 'CERTIFIED_BY' | 'MENTIONS' | 'PRECEDES' | 'CONFLICTS_WITH' | 'CORROBORATES';
  status?: EvidenceStatus;
}

export interface EvidenceGraphData {
  nodes: EvidenceGraphNode[];
  edges: EvidenceGraphEdge[];
}

export interface CaseSearchResultItem {
  item_id: string;
  category: 'FACT' | 'DOCUMENT' | 'PARCEL' | 'EVENT' | 'SEAL' | 'SAMPLE' | 'WEIGHT' | 'PROCEDURE' | 'PERSON' | 'VEHICLE';
  title: string;
  snippet: string;
  document_id?: string;
  document_name?: string;
  page?: number;
  evidence_id?: string;
  status: EvidenceStatus;
}



