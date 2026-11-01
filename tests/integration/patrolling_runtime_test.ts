import { RetrievalEngine } from '../../src/server/retrieval';
import { AnswerGenerator } from '../../src/server/gemini';
import { normalizeStatutoryReferences } from '../../src/server/normalization';
import { globalChatManager } from '../../src/server/chatManager';

const retrieval = new RetrievalEngine();
const generator = new AnswerGenerator();

// Helper to simulate client-side getProceduralTimelineGuidance from MessageItem.tsx
function getProceduralTimelineGuidance(content: string): { title: string; steps: string[] } | null {
  const lower = content.toLowerCase();

  if (
    lower.includes('clarifying question') ||
    lower.includes('did the patrolling team') ||
    lower.includes('patrolling') ||
    lower.includes('workflow')
  ) {
    return null;
  }

  if (
    (lower.includes('section 42 statutory') || lower.includes('guidance (section 42') || lower.includes('section 42 compliance') || lower.includes('section 42 ndps act')) &&
    !lower.includes('patrol')
  ) {
    return {
      title: 'Section 42 Statutory Timelines & Safeguards',
      steps: [
        'Record secret information in writing or record grounds of belief prior to search/entry (proviso).',
        'Send copy of information / grounds to immediate official superior within 72 hours under Section 42(2).',
        'Total non-compliance vitiates trial; substantial compliance permitted in emergent cases (Karnail Singh).'
      ]
    };
  }
  return null;
}

// Helper to simulate client-side getContextualRelatedQuestions from MessageItem.tsx
function getContextualRelatedQuestions(content: string): string[] {
  const lower = content.toLowerCase();

  if (
    lower.includes('clarifying question') ||
    lower.includes('did the patrolling team') ||
    lower.includes('workflow') ||
    lower.includes('patrolling')
  ) {
    return [];
  }

  if ((lower.includes('section 42') || lower.includes('sec 42') || lower.includes('sec. 42')) && !lower.includes('patrol')) {
    return [
      'What are the exceptions to recording information in writing under the Section 42 proviso?',
      'Explain compliance with sending copy to official superior within 72 hours under Section 42(2).',
      'How does Karnail Singh Constitution Bench clarify Section 42 compliance?'
    ];
  }
  return [];
}

async function simulateTurn(sessionId: string, message: string) {
  const normalizedMessage = normalizeStatutoryReferences(message.trim());
  globalChatManager.addMessage(sessionId, 'user', message);
  const sessionState = globalChatManager.getSession(sessionId);
  const priorHistory = sessionState.history.slice(0, -1).map(h => ({ role: h.role, content: h.content }));

  const retrieved = await retrieval.retrieve(normalizedMessage, 8);
  const result = await generator.generateAnswer(normalizedMessage, retrieved, priorHistory, normalizedMessage);
  globalChatManager.addMessage(sessionId, 'assistant', result.answer);
  return result;
}

async function runPatrollingRuntimeTests() {
  console.log('================================================================');
  console.log('NDPS Runtime Test Suite: Patrolling Discovery & Workflow Continuity');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (detail) console.error(`     Detail: ${detail}`);
      failed++;
    }
  }

  const sessionId = `test-patrol-session-${Date.now()}`;
  globalChatManager.clearSession(sessionId);

  // -------------------------------------------------------------------------
  // Test A: Initial Patrolling Query Response Content
  // -------------------------------------------------------------------------
  console.log('--- TEST A: Initial Patrolling Query Response Content ---');
  const queryA = 'I am an investigation officer. A person was found with suspected narcotics during patrolling. What should I do next?';
  const resA = await simulateTurn(sessionId, queryA);

  assert(
    !resA.answer.includes('### WORKFLOW SELECTION PENDING') && !resA.answer.includes('WORKFLOW SELECTION PENDING'),
    'Test A1: Header must not be raw internal state (### WORKFLOW SELECTION PENDING)',
    `Actual answer starts with: ${resA.answer.slice(0, 100)}`
  );

  assert(
    resA.answer.toLowerCase().includes('patrolling') || resA.answer.toLowerCase().includes('patrol'),
    'Test A2: Acknowledges reported discovery during patrolling'
  );

  assert(
    resA.answer.toLowerCase().includes('secure') && (resA.answer.toLowerCase().includes('scene') || resA.answer.toLowerCase().includes('person')),
    'Test A3: Provides immediate operational guidance to secure scene and person'
  );

  assert(
    resA.answer.toLowerCase().includes('independent') && resA.answer.toLowerCase().includes('witness'),
    'Test A4: Directs officer to associate independent witnesses'
  );

  assert(
    resA.answer.toLowerCase().includes('not yet') || resA.answer.toLowerCase().includes('not established') || resA.answer.toLowerCase().includes('have not'),
    'Test A5: Explicitly preserves unestablished facts (no search, seizure, arrest presumed)'
  );

  assert(
    resA.answer.toLowerCase().includes('section 42') && (resA.answer.toLowerCase().includes('section 43') || resA.answer.toLowerCase().includes('chance recovery')),
    'Test A6: Explains statutory procedural fork (Prior Information vs Chance Recovery)'
  );

  const clarifyingMatch = resA.answer.match(/\*\*Clarifying Question\*\*:/g);
  assert(
    clarifyingMatch !== null && clarifyingMatch.length === 1,
    'Test A7: Asks EXACTLY ONE focused clarifying question'
  );

  assert(
    !resA.answer.includes('FIR No. 24/2024') && !resA.answer.includes('HP72D-3928'),
    'Test A8: Does NOT invent fictional facts (FIR numbers or vehicle registrations)'
  );

  // -------------------------------------------------------------------------
  // Test B: No Suggestion Contamination
  // -------------------------------------------------------------------------
  console.log('\n--- TEST B: No Suggestion Contamination ---');
  const sec42Questions = [
    'What are the exceptions to recording information in writing under the Section 42 proviso?',
    'Explain compliance with sending copy to official superior within 72 hours under Section 42(2).',
    'How does Karnail Singh Constitution Bench clarify Section 42 compliance?'
  ];

  const containsSec42InAnswer = sec42Questions.some(q => resA.answer.includes(q));
  assert(
    !containsSec42InAnswer,
    'Test B1: Answer markdown text does NOT contain Section 42 suggestion questions'
  );

  const relatedQuestionsA = resA.related_questions || [];
  const containsSec42InMetadata = sec42Questions.some(q => relatedQuestionsA.includes(q));
  assert(
    !containsSec42InMetadata,
    'Test B2: Structured metadata related_questions does NOT contain Section 42 questions',
    `related_questions: ${JSON.stringify(relatedQuestionsA)}`
  );

  const clientFallbackSuggestions = getContextualRelatedQuestions(resA.answer);
  assert(
    clientFallbackSuggestions.length === 0,
    'Test B3: Client-side getContextualRelatedQuestions returns empty list for patrolling guidance'
  );

  // -------------------------------------------------------------------------
  // Test C: No Checklist Contamination
  // -------------------------------------------------------------------------
  console.log('\n--- TEST C: No Checklist Contamination ---');
  const sec42ChecklistItems = [
    'Record secret information in writing or record grounds of belief prior to search/entry (proviso).',
    'Send copy of information / grounds to immediate official superior within 72 hours under Section 42(2).',
    'Total non-compliance vitiates trial; substantial compliance permitted in emergent cases (Karnail Singh).'
  ];

  const containsChecklistInAnswer = sec42ChecklistItems.some(item => resA.answer.includes(item));
  assert(
    !containsChecklistInAnswer,
    'Test C1: Answer text does NOT contain the static Section 42 checklist bullets'
  );

  const timelineGuidance = getProceduralTimelineGuidance(resA.answer);
  assert(
    timelineGuidance === null,
    'Test C2: Procedural checklist is NOT triggered for patrolling discovery inquiry'
  );

  // -------------------------------------------------------------------------
  // Test D: Follow-Up 'What is the first step in this case?'
  // -------------------------------------------------------------------------
  console.log('\n--- TEST D: Follow-Up: "What is the first step in this case?" ---');
  const queryD = 'What is the first step in this case?';
  const resD = await simulateTurn(sessionId, queryD);

  assert(
    !resD.answer.includes('No case or investigation documents are currently attached to this chat') &&
    !resD.answer.includes('+ Attach Case Context'),
    'Test D1: Recognizes active patrolling context, does NOT demand attached FIR document'
  );

  assert(
    !resD.answer.includes('### WORKFLOW SELECTION PENDING'),
    'Test D2: Does NOT output raw ### WORKFLOW SELECTION PENDING header'
  );

  assert(
    resD.answer.toLowerCase().includes('secure') && (resD.answer.toLowerCase().includes('person') || resD.answer.toLowerCase().includes('scene')),
    'Test D3: States immediate first operational step (securing person and scene)'
  );

  assert(
    resD.answer.toLowerCase().includes('witness'),
    'Test D4: Directs associating independent local witnesses as first step'
  );

  assert(
    resD.answer.includes('Clarifying Question'),
    'Test D5: Re-solicits workflow clarification without losing context'
  );

  // -------------------------------------------------------------------------
  // Test E: Workflow Resolution on Clarification
  // -------------------------------------------------------------------------
  console.log('\n--- TEST E: Workflow Resolution on Clarification ---');
  // Branch 1: Chance Recovery
  const queryE1 = 'Chance Recovery. There was no prior information about this person or suspected substance.';
  const resE1 = await simulateTurn(sessionId, queryE1);

  assert(
    resE1.answer.includes('On-the-Spot Recovery (Chance Recovery)'),
    'Test E1: Resolves classification to On-the-Spot Recovery (Chance Recovery)'
  );

  assert(
    resE1.answer.toLowerCase().includes('stage 1') && (resE1.answer.includes('Spot Recovery') || resE1.answer.includes('Seizure Memo')),
    'Test E2: Outlines Stage 1 Spot Recovery / Seizure Memo'
  );

  assert(
    resE1.answer.toLowerCase().includes('what is prescribed') || resE1.answer.toLowerCase().includes('distinction'),
    'Test E3: Clearly distinguishes what has been completed vs what is prescribed'
  );

  // Branch 2: Prior Information in a separate session
  const sessionPrior = `test-prior-session-${Date.now()}`;
  globalChatManager.clearSession(sessionPrior);
  await simulateTurn(sessionPrior, queryA);
  const resE2 = await simulateTurn(sessionPrior, 'Prior information. We received specific secret information before heading out.');

  assert(
    resE2.answer.includes('Prior Information Recovery'),
    'Test E4: Resolves classification to Prior Information Recovery'
  );

  assert(
    resE2.answer.includes('Section 42(1)') && resE2.answer.includes('72 hours'),
    'Test E5: Outlines Section 42(1) recording and Section 42(2) 72-hour superior communication'
  );

  // -------------------------------------------------------------------------
  // Test F: Follow-Up on Section 50 in Patrolling Context
  // -------------------------------------------------------------------------
  console.log('\n--- TEST F: Follow-Up on Section 50 ---');
  const queryF = 'What about Section 50?';
  const resF = await simulateTurn(sessionId, queryF);

  assert(
    resF.answer.includes('Section 50') && resF.answer.toLowerCase().includes('personal'),
    'Test F1: Explains Section 50 personal search safeguards'
  );

  assert(
    resF.answer.toLowerCase().includes('bag') || resF.answer.toLowerCase().includes('vehicle'),
    'Test F2: Distinguishes personal bodily search from search of baggage/vehicle'
  );

  assert(
    resF.answer.toLowerCase().includes('gazetted officer') || resF.answer.toLowerCase().includes('magistrate'),
    'Test F3: Explains statutory right to be taken before Gazetted Officer or Magistrate'
  );

  assert(
    resF.answer.toLowerCase().includes('female'),
    'Test F4: Explains Section 50(4) female search safeguard'
  );

  const containsSec42InF = sec42Questions.some(q => resF.answer.includes(q) || (resF.related_questions || []).includes(q));
  assert(
    !containsSec42InF,
    'Test F5: Section 50 answer is NOT contaminated with Section 42 suggestions'
  );

  // -------------------------------------------------------------------------
  // Test G: Session Isolation
  // -------------------------------------------------------------------------
  console.log('\n--- TEST G: Session Isolation ---');
  const freshSessionId = `test-fresh-isolated-${Date.now()}`;
  globalChatManager.clearSession(freshSessionId);

  const resG = await simulateTurn(freshSessionId, 'What was seized in this case?');
  assert(
    resG.answer.includes('No case or investigation documents are currently attached to this chat') ||
    resG.answer.includes('+ Attach Case Context'),
    'Test G1: Fresh session starts completely clean, does not inherit patrolling context from previous sessions'
  );

  // -------------------------------------------------------------------------
  // Test H: Direct Single-Turn Patrolling + No Prior Information
  // -------------------------------------------------------------------------
  console.log('\n--- TEST H: Direct Single-Turn Patrolling + No Prior Information ---');
  const singleTurnSessionId = `test-single-turn-${Date.now()}`;
  globalChatManager.clearSession(singleTurnSessionId);

  const queryH = 'I am an Investigation Officer. A person was found with suspected narcotics during patrolling. There was no prior information about the person or suspected substance.';
  const resH = await simulateTurn(singleTurnSessionId, queryH);

  assert(
    !resH.pathway_selector,
    'Test H1: Does NOT present pathway selector menu when pathway is stated in single turn'
  );

  assert(
    resH.answer.includes('ON-THE-SPOT RECOVERY (CHANCE RECOVERY)'),
    'Test H2: Directly activates ON-THE-SPOT RECOVERY (CHANCE RECOVERY)'
  );

  assert(
    resH.answer.includes('फर्द वरामदगी मादक पदार्थ व मकबूजगी'),
    'Test H3: Preserves exact Stage 1 template source heading (फर्द वरामदगी मादक पदार्थ व मकबूजगी)'
  );

  assert(
    resH.answer.includes('[जानकारी अपेक्षित]'),
    'Test H4: Marks unsupplied fields as [जानकारी अपेक्षित] without hallucinating facts'
  );

  assert(
    resH.selected_pathway === 'CHANCE_RECOVERY',
    'Test H5: Sets selected_pathway to CHANCE_RECOVERY in result state'
  );

  assert(
    resH.answer.includes('chance_recovery_01') &&
    resH.answer.includes('Chance_Recovery_NDPS_Documents (1).docx') &&
    resH.answer.includes('MATCHES_STORED_TEMPLATE'),
    'Test H6: Exposes complete diagnostic metadata (Template ID, Filename, Verification Status)'
  );

  assert(
    resH.answer.includes('### SOURCE TEMPLATE PROFORMA (UNALTERED)') &&
    resH.answer.includes('None of these actions are asserted as completed events'),
    'Test H7: Separates unaltered template proforma from draft status and warns against asserting unconfirmed actions'
  );

  console.log('\n================================================================');
  console.log(`Results: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPatrollingRuntimeTests().catch(err => {
  console.error('Fatal error in patrolling runtime tests:', err);
  process.exit(1);
});
