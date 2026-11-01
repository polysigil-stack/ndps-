import { templateRegistry, getSourceFilename } from '../../src/server/templateRegistry';
import { globalChatManager } from '../../src/server/chatManager';
import { globalCaseStore } from '../../src/server/caseStore';
import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { normalizeStatutoryReferences } from '../../src/server/normalization';
import { RetrievalEngine } from '../../src/server/retrieval';

const retrieval = new RetrievalEngine();

async function runE2EWorkflowAudit() {
  console.log('================================================================');
  console.log('NDPS Assistant: Focused End-to-End Workflow Progression & Persistence Audit');
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

  // -------------------------------------------------------------------------
  // Audit Step 1: Chance Recovery 14-Stage Order & Structure
  // -------------------------------------------------------------------------
  console.log('--- AUDIT STEP 1: Chance Recovery 14-Stage Sequence & Registry Integrity ---');
  const chanceTemplates = templateRegistry.getAllTemplates()
    .filter(t => t.workflowType === 'CHANCE_RECOVERY')
    .sort((a, b) => a.sequence - b.sequence);

  assert(
    chanceTemplates.length === 14,
    'Step 1.1: Chance Recovery collection contains exactly 14 stages',
    `Found ${chanceTemplates.length} stages`
  );

  let chanceOrderValid = true;
  for (let i = 0; i < 14; i++) {
    const expectedSeq = i + 1;
    const expectedId = `chance_recovery_${expectedSeq.toString().padStart(2, '0')}`;
    if (!chanceTemplates[i] || chanceTemplates[i].sequence !== expectedSeq || chanceTemplates[i].id !== expectedId) {
      chanceOrderValid = false;
      console.error(`Mismatch at position ${i}: expected sequence ${expectedSeq} (${expectedId}), got`, chanceTemplates[i]);
    }
  }
  assert(
    chanceOrderValid,
    'Step 1.2: All 14 Chance Recovery stages remain in exact configured order (1 to 14)'
  );

  assert(
    chanceTemplates[0]?.name.includes('फर्द वरामदगी मादक पदार्थ व मकबूजगी'),
    'Step 1.3: Stage 1 heading matches फर्द वरामदगी मादक पदार्थ व मकबूजगी',
    `Got: ${chanceTemplates[0]?.name}`
  );

  assert(
    chanceTemplates[13]?.name.includes('धारा 57 NDPS Act'),
    'Step 1.4: Stage 14 heading matches धारा 57 NDPS Act',
    `Got: ${chanceTemplates[13]?.name}`
  );

  // -------------------------------------------------------------------------
  // Audit Step 2: Information-Based Recovery 15-Stage Sequence & Registry Integrity
  // -------------------------------------------------------------------------
  console.log('\n--- AUDIT STEP 2: Information-Based Recovery 15-Stage Sequence & Isolation ---');
  const infoTemplates = templateRegistry.getAllTemplates()
    .filter(t => t.workflowType === 'INFORMATION_BASED')
    .sort((a, b) => a.sequence - b.sequence);

  assert(
    infoTemplates.length === 15,
    'Step 2.1: Information-Based Recovery collection contains exactly 15 stages',
    `Found ${infoTemplates.length} stages`
  );

  let infoOrderValid = true;
  for (let i = 0; i < 15; i++) {
    const expectedSeq = i + 1;
    const expectedId = `ndps_act_documents_${expectedSeq.toString().padStart(2, '0')}`;
    if (!infoTemplates[i] || infoTemplates[i].sequence !== expectedSeq || infoTemplates[i].id !== expectedId) {
      infoOrderValid = false;
      console.error(`Mismatch at position ${i}: expected sequence ${expectedSeq} (${expectedId}), got`, infoTemplates[i]);
    }
  }
  assert(
    infoOrderValid,
    'Step 2.2: All 15 Information-Based Recovery stages remain in exact configured order (1 to 15)'
  );

  assert(
    infoTemplates[0]?.name.includes('सूचना (धारा 42(2)) एवं तलाशी अधिकार-पत्र'),
    'Step 2.3: Information-Based Stage 1 matches Section 42(2) / Section 41(1) heading',
    `Got: ${infoTemplates[0]?.name}`
  );

  assert(
    infoTemplates[14]?.name.includes('धारा 57 NDPS Act'),
    'Step 2.4: Information-Based Stage 15 matches Section 57 heading',
    `Got: ${infoTemplates[14]?.name}`
  );

  // -------------------------------------------------------------------------
  // Audit Step 3: No Automatic Stage Advancement on Template Display
  // -------------------------------------------------------------------------
  console.log('\n--- AUDIT STEP 3: No Automatic Stage Advancement on Display ---');
  const session1 = `audit-session-${Date.now()}`;
  globalChatManager.clearSession(session1);

  const q1 = 'I am an Investigation Officer. A person was found with suspected narcotics during patrolling. There was no prior information about the person or suspected substance.';
  const normQ1 = normalizeStatutoryReferences(q1);
  const ret1 = await retrieval.retrieve(normQ1, 5);
  const res1 = await processInvestigatorQuery(normQ1, null, [], ret1);

  assert(
    res1.selected_pathway === 'CHANCE_RECOVERY',
    'Step 3.1: Activates CHANCE_RECOVERY on initial narrative'
  );

  assert(
    res1.answer.includes('STAGE 1: फर्द वरामदगी मादक पदार्थ व मकबूजगी'),
    'Step 3.2: Displays Stage 1 फर्द वरामदगी मादक पदार्थ व मकबूजगी'
  );

  // Repeat turn or ask a clarification about Stage 1
  const history1 = [
    { role: 'user' as const, content: q1 },
    { role: 'assistant' as const, content: res1.answer }
  ];
  const q2 = 'What is required to fill Stage 1?';
  const normQ2 = normalizeStatutoryReferences(q2);
  const ret2 = await retrieval.retrieve(normQ2, 5);
  const res2 = await processInvestigatorQuery(normQ2, null, history1, ret2);

  assert(
    !res2.answer.includes('STAGE 2:'),
    'Step 3.3: Asking for required details on Stage 1 DOES NOT auto-advance to Stage 2'
  );

  assert(
    res2.answer.includes('MATCHES_STORED_TEMPLATE') || res2.answer.includes('STAGE 1') || res2.answer.includes('फर्द वरामदगी'),
    'Step 3.4: Remains anchored at Stage 1 until stage progression is requested or facts confirmed'
  );

  // -------------------------------------------------------------------------
  // Audit Step 4: Deterministic Registry Template Retrieval across Stages
  // -------------------------------------------------------------------------
  console.log('\n--- AUDIT STEP 4: Deterministic Stage Template Retrieval (Stages 1, 6, 14) ---');
  const history2 = [
    ...history1,
    { role: 'user' as const, content: q2 },
    { role: 'assistant' as const, content: res2.answer }
  ];

  // Request Stage 6
  const qStage6 = 'Show stage 6 template';
  const resStage6 = await processInvestigatorQuery(qStage6, null, history2, ret2);

  assert(
    resStage6.answer.includes('chance_recovery_06') && resStage6.answer.includes('नक्शा मौका नजरी बिना स्केल'),
    'Step 4.1: Deterministically retrieves Stage 6 (chance_recovery_06: नक्शा मौका नजरी बिना स्केल)'
  );

  assert(
    resStage6.answer.includes('Chance_Recovery_NDPS_Documents (1).docx') && resStage6.answer.includes('MATCHES_STORED_TEMPLATE'),
    'Step 4.2: Verified diagnostic metadata for Stage 6 template'
  );

  // Request Stage 14
  const qStage14 = 'Show stage 14 template';
  const resStage14 = await processInvestigatorQuery(qStage14, null, history2, ret2);

  assert(
    resStage14.answer.includes('chance_recovery_14') && resStage14.answer.includes('धारा 57 NDPS Act'),
    'Step 4.3: Deterministically retrieves Stage 14 (chance_recovery_14: धारा 57 NDPS Act)'
  );

  // -------------------------------------------------------------------------
  // Audit Step 5: Fact Preservation & Non-Assertion of Unconfirmed Actions
  // -------------------------------------------------------------------------
  console.log('\n--- AUDIT STEP 5: Fact Preservation & Non-Assertion of Unconfirmed Actions ---');
  const qSparse = 'I am an Investigation Officer. Patrolling team stopped a suspect with a bag containing 500g suspected charas. There was no prior information about the suspect or substance.';
  const resSparse = await processInvestigatorQuery(qSparse, null, [], ret1);

  assert(
    resSparse.answer.includes('### SOURCE TEMPLATE PROFORMA (UNALTERED)'),
    'Step 5.1: Source template proforma rendered unaltered'
  );

  assert(
    resSparse.answer.includes('[जानकारी अपेक्षित]'),
    'Step 5.2: Unsupported fields explicitly marked as [जानकारी अपेक्षित]'
  );

  assert(
    resSparse.answer.includes('None of these actions are asserted as completed events'),
    'Step 5.3: Explicit warning against asserting unconfirmed actions (witnesses, weighment, sealing) as completed events'
  );

  // -------------------------------------------------------------------------
  // Audit Step 6: Incomplete Facts, Correction, & Return to Previously Visited Stage
  // -------------------------------------------------------------------------
  console.log('\n--- AUDIT STEP 6: Navigation, Corrections, & Returning to Previous Stages ---');
  
  // Return to Stage 1 after visiting Stage 6
  const qReturn1 = 'Show stage 1 template again';
  const resReturn1 = await processInvestigatorQuery(qReturn1, null, history2, ret2);

  assert(
    resReturn1.answer.includes('chance_recovery_01') && resReturn1.answer.includes('फर्द वरामदगी मादक पदार्थ व मकबूजगी'),
    'Step 6.1: Smoothly returns to Stage 1 (chance_recovery_01) without state corruption'
  );

  assert(
    resReturn1.answer.includes('MATCHES_STORED_TEMPLATE'),
    'Step 6.2: Verifies Stage 1 stored proforma remains 100% unaltered upon return'
  );

  // -------------------------------------------------------------------------
  // Audit Step 7: Persistence & State Re-hydration
  // -------------------------------------------------------------------------
  console.log('\n--- AUDIT STEP 7: Persistence & State Re-hydration ---');
  const persistentSessionId = `persistent-audit-session-${Date.now()}`;
  globalChatManager.clearSession(persistentSessionId);

  // User turn 1: establishes patrolling & chance recovery
  globalChatManager.addMessage(persistentSessionId, 'user', q1);
  const stateTurn1 = globalChatManager.getSession(persistentSessionId);

  assert(
    stateTurn1.hasIncidentNarrative === true,
    'Step 7.1: Session state persists hasIncidentNarrative = true'
  );

  assert(
    stateTurn1.pathwayResolved === 'CHANCE_RECOVERY',
    'Step 7.2: Session state persists pathwayResolved = CHANCE_RECOVERY'
  );

  // Simulate application reload / retrieving session state from store
  const reloadedSession = globalChatManager.getSession(persistentSessionId);
  const priorHist = reloadedSession.history.map(h => ({ role: h.role, content: h.content }));
  const resReloaded = await processInvestigatorQuery('Show stage 2 template', null, priorHist, ret1);

  assert(
    resReloaded.selected_pathway === 'CHANCE_RECOVERY' || resReloaded.answer.includes('chance_recovery_02'),
    'Step 7.3: Re-hydrated session context maintains CHANCE_RECOVERY pathway for subsequent stage requests'
  );

  console.log('\n================================================================');
  console.log(`Audit Summary: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2EWorkflowAudit().catch(err => {
  console.error('Fatal error during E2E workflow audit:', err);
  process.exit(1);
});
