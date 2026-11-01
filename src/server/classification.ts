import { CaseContext } from './caseStore';
import { Citation, RetrievalResult } from './types';
import { ExtractedNarrative } from './caseSynthesizer';
// We need these imports but they might cause circular dependencies if not careful.
// Let's assume they are available.
import { isTargetedInterceptionScenario, parseChronologyEvents, extractUnknownFacts, generateDiagnosticResponse } from './caseSynthesizer';

export interface CaseAnswerResult {
  isCaseQuery: boolean;
  mode: string;
  answer: string;
  sources: any[];
  citations: Citation[];
}

export function runAuthoritativeClassificationPipeline(
  query: string,
  caseContext: CaseContext | null | undefined,
  extracted: ExtractedNarrative
): CaseAnswerResult {
  const isPriorInfo = extracted.isTargetedInterception || isTargetedInterceptionScenario(query);
  const label = isPriorInfo ? 'Prior Information' : 'On-the-Spot Recovery (Chance Recovery)';
  
  const events = parseChronologyEvents(query);
  const unknowns = extractUnknownFacts(query);
  const justification = isPriorInfo 
    ? 'The scenario is classified as Prior Information because specific information existed prior to deployment, the officer and team knew of it, and the departure was specifically prompted by it.'
    : 'The scenario is classified as On-the-Spot Recovery (Chance Recovery) because no specific information prior to deployment is established, and the operation originated as routine patrolling or checking.';

  const answer = `### 1. CLASSIFICATION\n${label}\n\n${justification}\n\n` +
                 `### 2. CHRONOLOGY\n${events.map(e => `- ${e}`).join('\n')}\n\n` +
                 `### 3. UNKNOWN FACTS\n${unknowns.map(u => `- ${u}`).join('\n')}\n\n` +
                 `### 4. WORKFLOW\n${isPriorInfo ? 'Information-Based Workflow activated.' : 'Chance Recovery Workflow activated.'}`;

  return {
    isCaseQuery: !!caseContext,
    mode: 'GENERAL_NDPS',
    answer,
    sources: [],
    citations: [],
    pathwayResolved: isPriorInfo ? 'INFORMATION_BASED' : 'CHANCE_RECOVERY',
    hasIncidentNarrative: true
  } as any;
}
