export interface StructuredSectionRecord {
  sectionNumber: string; // e.g., "8", "42", "50", "68A"
  officialTitle: string;
  statutoryText: string;
  plainExplanation: string;
  scope: string;
  keyRequirements: string[];
  investigationRelevance: string;
  documentationEvidence: string;
  relatedSections: string[];
  supremeCourtCaseLaw: string[];
  historicalAmendmentInfo?: string;
  sourceMetadata: {
    act: string;
    chapter: string;
    sourceTitle: string;
    authority: string;
  };
}

export interface SectionComparison {
  title: string;
  primarySections: string[];
  coreDistinction: string;
  comparisonPoints: Array<{ aspect: string; sectionA: string; sectionB: string }>;
  keyCaseLaw: string[];
  authoritativeSource: string;
}
