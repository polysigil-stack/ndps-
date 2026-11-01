import { answerGenerator } from '../../src/server/gemini';
import { globalCaseStore } from '../../src/server/caseStore';
import { globalEvidenceStore } from '../../src/server/evidenceStore';
import { templateRegistry } from '../../src/server/templateRegistry';

async function runRegressionSuite() {
  console.log("================================================================");
  console.log("STARTING LIVE WORKFLOW REGRESSION & AUDIT SUITE");
  console.log("================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, actual?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
      if (actual) console.log(`      Actual Output: ${actual.substring(0, 300)}...`);
      failed++;
    }
  }

  // TEST 1: Exact 5-Turn Sequence requested by user
  console.log("--- TEST CASE 1: EXACT USER SEQUENCE ---");
  const sessionId = 'live_reg_session_' + Date.now();
  const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
  let history: { role: 'user' | 'assistant'; content: string }[] = [];

  // Turn 1: hi
  console.log("\nTurn 1: 'hi'");
  const res1 = await answerGenerator.generateAnswer('hi', [], history, undefined, caseContext);
  assert(res1.answer.toLowerCase().includes('hello') || res1.answer.toLowerCase().includes('namaste') || res1.answer.includes('NDPS'), "Greeting response should welcome user without error", res1.answer);
  history.push({ role: 'user', content: 'hi' }, { role: 'assistant', content: res1.answer });

  // Turn 2: Start case
  console.log("\nTurn 2: 'Start the fictional case using the facts I provided. Ask the first necessary question only.'");
  const turn2Query = "Start the fictional case using the facts I provided. Ask the first necessary question only.";
  const res2 = await answerGenerator.generateAnswer(turn2Query, [], history, undefined, caseContext);
  assert(!res2.answer.includes("outside authorized NDPS"), "Turn 2 should not report outside authorized NDPS error", res2.answer);
  assert(!res2.answer.includes("Template not found"), "Turn 2 should not report 'Template not found'", res2.answer);
  history.push({ role: 'user', content: turn2Query }, { role: 'assistant', content: res2.answer });

  // Turn 3: Scenario Narrative
  console.log("\nTurn 3: Fictional Patrolling Scenario Narrative");
  const scenario = "I am an Investigation Officer posted at Police Station Sadar, Fictionpur, Punjab. On 28 October 2026, at approximately 7:30 PM, during routine patrolling on a fictional public road, my team encountered an adult person carrying a small sealed-looking packet. There was no prior secret information about this person or the packet. The substance has not been scientifically identified. No recovery or search procedure has yet been completed in this scenario. The person's identity, exact location, quantity or weight, witness details, search-related responses, seal particulars, and subsequent procedural actions are not yet known. This is a fictional software test.";
  const res3 = await answerGenerator.generateAnswer(scenario, [], history, undefined, caseContext);
  
  assert(res3.answer.includes("Chance Recovery") || res3.answer.includes("CHANCE_RECOVERY"), "Turn 3 should select Chance Recovery workflow", res3.answer);
  assert(res3.answer.includes("Step 1 of 14"), "Turn 3 should activate Step 1 of 14", res3.answer);
  assert(res3.answer.includes("28 October 2026") || res3.answer.includes("Police Station Sadar"), "Turn 3 should preserve confirmed facts (date/station)", res3.answer);
  assert(!res3.answer.includes("outside authorized NDPS"), "Turn 3 should not trigger unsupported refusal", res3.answer);
  assert(res3.answer.includes("Next Question") || res3.answer.includes("exact location"), "Turn 3 should ask exactly one next relevant question", res3.answer);
  assert(caseContext.recovery_pathway === 'CHANCE_RECOVERY', "Case context pathway should be set to CHANCE_RECOVERY");
  assert(caseContext.current_stage === 1, "Case context stage should be 1");
  history.push({ role: 'user', content: scenario }, { role: 'assistant', content: res3.answer });

  // Turn 4: next (Stage 1 remains active with missing field explanation)
  console.log("\nTurn 4: 'next'");
  const res4 = await answerGenerator.generateAnswer("next", [], history, undefined, caseContext);
  assert(!res4.answer.includes("Template not found"), "Turn 4 ('next') MUST NOT return 'Template not found'", res4.answer);
  assert(res4.answer.includes("unresolved") && res4.answer.includes("स्थान"), "Turn 4 should explain unresolved location field without advancing", res4.answer);
  assert(caseContext.current_stage === 1, "Case context stage should remain Stage 1 after 'next'");
  history.push({ role: 'user', content: "next" }, { role: 'assistant', content: res4.answer });

  // Turn 5: mark as unknown (Advances Stage 1 -> Stage 2)
  console.log("\nTurn 5: 'I do not know this detail yet. Mark it as unknown and continue with the next relevant question.'");
  const turn5Query = "I do not know this detail yet. Mark it as unknown and continue with the next relevant question.";
  const res5 = await answerGenerator.generateAnswer(turn5Query, [], history, undefined, caseContext);
  assert(!res5.answer.includes("Template not found"), "Turn 5 MUST NOT return 'Template not found'", res5.answer);
  assert(res5.answer.includes("Step 2 of 14") || res5.answer.includes("Step 2"), "Turn 5 should advance to Step 2 of 14", res5.answer);
  assert(res5.answer.includes("आरोपी") && !res5.answer.includes("exact location or spot details"), "Turn 5 should ask for आरोपी with correct suspect example", res5.answer);
  assert(caseContext.current_stage === 2, "Case context stage should be Stage 2 after marking unknown");
  history.push({ role: 'user', content: turn5Query }, { role: 'assistant', content: res5.answer });

  // Turn 6: continue with unresolved fields (Advances Stage 2 -> Stage 3)
  console.log("\nTurn 6: 'continue with unresolved fields'");
  const turn6Query = "continue with unresolved fields";
  const res6 = await answerGenerator.generateAnswer(turn6Query, [], history, undefined, caseContext);
  assert(!res6.answer.includes("Template not found"), "Turn 6 MUST NOT return 'Template not found'", res6.answer);
  assert(res6.answer.includes("Step 3 of 14") || res6.answer.includes("Step 3"), "Turn 6 should advance to Step 3 of 14", res6.answer);
  assert(res6.answer.includes("मुलाजमान_1") && !res6.answer.includes("exact location or spot details"), "Turn 6 should ask for मुलाजमान_1 with officer example", res6.answer);
  assert(caseContext.current_stage === 3, "Case context stage should be Stage 3 after continue with unresolved fields");
  history.push({ role: 'user', content: turn6Query }, { role: 'assistant', content: res6.answer });

  // Turn 7: Review facts
  console.log("\nTurn 7: 'review facts'");
  const res7 = await answerGenerator.generateAnswer("review facts", [], history, undefined, caseContext);
  assert(res7.answer.includes("Review Case Facts") || res7.answer.includes("Confirmed facts"), "Turn 7 should return review of facts", res7.answer);
  assert(caseContext.current_stage === 3, "Review mode must preserve current stage as Stage 3");
  history.push({ role: 'user', content: "review facts" }, { role: 'assistant', content: res7.answer });

  // Turn 8: Informational query during active case
  console.log("\nTurn 8: Informational query 'tell me about NDPS'");
  const res8 = await answerGenerator.generateAnswer("tell me about NDPS", [], history, undefined, caseContext);
  assert(res8.answer.includes("NDPS"), "Turn 8 should return informational NDPS content", res8.answer);
  assert(caseContext.current_stage === 3, "Informational query must NOT reset or change current stage (should remain Stage 3)");
  history.push({ role: 'user', content: "tell me about NDPS" }, { role: 'assistant', content: res8.answer });

  // Turn 9: Resume case workflow
  console.log("\nTurn 9: Resume case workflow ('next step')");
  const res9 = await answerGenerator.generateAnswer("next step", [], history, undefined, caseContext);
  assert(!res9.answer.includes("Template not found"), "Turn 9 MUST NOT return 'Template not found'", res9.answer);
  assert(caseContext.current_stage === 3, "Workflow should resume at active stage 3");

  // TEST 2: Template Registry Canonical Lookups
  console.log("\n--- TEST CASE 2: TEMPLATE REGISTRY CANONICAL RESOLUTION ---");
  const t1 = templateRegistry.findTemplate('CHANCE_RECOVERY', 1);
  assert(t1?.id === 'chance_recovery_01', "Stage 1 Chance Recovery template ID should be chance_recovery_01");
  const t14 = templateRegistry.findTemplate('CHANCE_RECOVERY', 14);
  assert(t14?.id === 'chance_recovery_14', "Stage 14 Chance Recovery template ID should be chance_recovery_14");
  const tInfo1 = templateRegistry.findTemplate('INFORMATION_BASED', 1);
  assert(tInfo1?.id === 'ndps_act_documents_01', "Stage 1 Information-Based template ID should be ndps_act_documents_01");

  // TEST 3: Fact Isolation between Sessions
  console.log("\n--- TEST CASE 3: SESSION FACT ISOLATION ---");
  const sessionA = globalCaseStore.getOrCreateSessionCase('session_A_' + Date.now());
  const sessionB = globalCaseStore.getOrCreateSessionCase('session_B_' + Date.now());
  sessionA.confirmed_facts!['थाना'] = 'PS Sadar Alpha';
  sessionB.confirmed_facts!['थाना'] = 'PS Beta';
  assert(sessionA.confirmed_facts!['थाना'] !== sessionB.confirmed_facts!['थाना'], "Sessions must maintain isolated confirmed facts");

  // TEST 4: EXACT 4-TURN INFORMATIONAL WORKFLOW SEQUENCE
  console.log("\n--- TEST CASE 4: EXACT 4-TURN INFORMATIONAL WORKFLOW SEQUENCE ---");
  const session4Id = 'live_reg_session4_' + Date.now();
  const case4Context = globalCaseStore.getOrCreateSessionCase(session4Id);
  case4Context.recovery_pathway = 'CHANCE_RECOVERY';
  case4Context.current_stage = 2;
  case4Context.active_mode = 'GUIDED';
  case4Context.confirmed_facts = { 'दिनांक': '28 October 2026', 'समय': '7:30 PM', 'थाना': 'PS Sadar', 'आरोपी': 'John Doe' };
  let history4: { role: 'user' | 'assistant'; content: string }[] = [];

  // 1. resume my case
  console.log("\nTurn 4.1: 'resume my case'");
  const res4_1 = await answerGenerator.generateAnswer("resume my case", [], history4, undefined, case4Context);
  assert(!res4_1.answer.includes("Template not found"), "Turn 4.1 'resume my case' should load active case without error", res4_1.answer);
  assert(case4Context.current_stage === 2, "Turn 4.1: Case context stage should remain Stage 2");
  history4.push({ role: 'user', content: "resume my case" }, { role: 'assistant', content: res4_1.answer });

  // 2. what is the first document i need to prepare
  console.log("\nTurn 4.2: 'what is the first document i need to prepare'");
  const res4_2 = await answerGenerator.generateAnswer("what is the first document i need to prepare", [], history4, undefined, case4Context);
  assert(res4_2.answer.includes("फर्द वरामदगी मादक पदार्थ व मकबूजगी") || res4_2.answer.includes("Stage 1"), "Turn 4.2 should identify Stage 1 फर्द वरामदगी as first document in sequence", res4_2.answer);
  assert(res4_2.answer.includes("DISTINCTION") || res4_2.answer.includes("Actionability"), "Turn 4.2 should clearly distinguish template sequence from case actionability", res4_2.answer);
  assert(!res4_2.answer.includes("पिता_पति"), "Turn 4.2 MUST NOT swallow question with Stage 2 prompt for पिता_पति", res4_2.answer);
  assert(case4Context.current_stage === 2, "Turn 4.2: Stage must remain unchanged at Stage 2 after informational query");
  assert(case4Context.confirmed_facts['आरोपी'] === 'John Doe', "Turn 4.2: Confirmed facts must remain preserved");
  history4.push({ role: 'user', content: "what is the first document i need to prepare" }, { role: 'assistant', content: res4_2.answer });

  // 3. next step
  console.log("\nTurn 4.3: 'next step'");
  const res4_3 = await answerGenerator.generateAnswer("next step", [], history4, undefined, case4Context);
  assert(res4_3.answer.includes("पिता_पति") && res4_3.answer.includes("unresolved"), "Turn 4.3 should report unresolved पिता_पति field", res4_3.answer);
  assert(res4_3.answer.includes("NOT advanced") || res4_3.answer.includes("unresolved"), "Turn 4.3 should explain stage has NOT advanced and list options", res4_3.answer);
  assert(case4Context.current_stage === 2, "Turn 4.3: Stage must remain Stage 2 when required field is missing");
  history4.push({ role: 'user', content: "next step" }, { role: 'assistant', content: res4_3.answer });

  // 4. next step again
  console.log("\nTurn 4.4: 'next step' (again)");
  const res4_4 = await answerGenerator.generateAnswer("next step", [], history4, undefined, case4Context);
  assert(res4_4.answer.includes("पिता_पति") && res4_4.answer.includes("unresolved"), "Turn 4.4 should again report unresolved पिता_पति field", res4_4.answer);
  assert(res4_4.answer.includes("NOT advanced"), "Turn 4.4 should clearly state stage has NOT advanced", res4_4.answer);
  assert(case4Context.current_stage === 2, "Turn 4.4: Stage must remain Stage 2 on repeated next step");
  history4.push({ role: 'user', content: "next step" }, { role: 'assistant', content: res4_4.answer });

  // TEST 5: DEFECT 1 AND DEFECT 2 REGRESSION TESTS
  console.log("\n--- TEST CASE 5: CONCISE NARRATIVE & UNKNOWN SUBSTANCE/WEIGHT HANDLING ---");
  const session5Id = 'live_reg_session5_' + Date.now();
  const case5Context = globalCaseStore.getOrCreateSessionCase(session5Id);
  let history5: { role: 'user' | 'assistant'; content: string }[] = [];

  // Turn 5.1: Initial narrative entry
  console.log("\nTurn 5.1: Initial incident narrative");
  const narrative5 = "I am an investigation officer on routine patrol. I encounter an adult carrying a small packet of suspected contraband on a fictional public road. There was no prior secret information. The substance has not been identified, and no search or seizure details have been established.";
  const res5_1 = await answerGenerator.generateAnswer(narrative5, [], history5, undefined, case5Context);
  assert(res5_1.answer.includes("Chance Recovery") && res5_1.answer.includes("Step 1 of 14"), "Turn 5.1 should select Chance Recovery and Step 1 of 14", res5_1.answer);
  assert(res5_1.answer.includes("Next Question"), "Turn 5.1 should prompt for next question", res5_1.answer);
  assert(!res5_1.answer.includes("DIAGNOSTIC METADATA") && !res5_1.answer.includes("SOURCE TEMPLATE PROFORMA"), "Turn 5.1 MUST NOT dump full template or diagnostic metadata automatically", res5_1.answer);
  history5.push({ role: 'user', content: narrative5 }, { role: 'assistant', content: res5_1.answer });

  // Turn 5.2: Substance & weight unknown inquiry
  console.log("\nTurn 5.2: 'The substance has not been identified and weight is unknown. What should I do next?'");
  const query5_2 = "The substance has not been identified and weight is unknown. What should I do next?";
  const res5_2 = await answerGenerator.generateAnswer(query5_2, [], history5, undefined, case5Context);
  assert(res5_2.answer.includes("HANDLING UNKNOWN SUBSTANCE OR WEIGHT"), "Turn 5.2 should provide concise context-aware guidance for unknown substance/weight", res5_2.answer);
  assert(!res5_2.answer.includes("Commercial Quantity") && !res5_2.answer.includes("Small Quantity"), "Turn 5.2 MUST NOT dump quantity-threshold tables", res5_2.answer);
  assert(!res5_2.answer.includes("Section 37") && !res5_2.answer.includes("Section 31A"), "Turn 5.2 MUST NOT dump unrelated legal references", res5_2.answer);
  assert(res5_2.answer.includes("Next Question"), "Turn 5.2 should ask the next missing field question", res5_2.answer);
  assert(case5Context.confirmed_facts?.['पदार्थ'] === 'unknown' && case5Context.confirmed_facts?.['वजन'] === 'unknown', "Turn 5.2 should preserve unknown substance/weight as 'unknown'");
  assert(case5Context.current_stage === 1, "Turn 5.2 should remain at Stage 1 for remaining missing fields");

  // TEST 6: DEMO CASE REMOVAL & CASE ISOLATION REGRESSION TESTS
  console.log("\n--- TEST CASE 6: DEMO CASE REMOVAL & CASE ISOLATION REGRESSION TESTS ---");
  const freshSessionId = 'fresh_session_isolation_' + Date.now();
  const freshCaseContext = globalCaseStore.getOrCreateSessionCase(freshSessionId);

  assert(freshCaseContext.fir_details?.fir_number === '', "Fresh session case FIR number must be empty", freshCaseContext.fir_details?.fir_number);
  assert(freshCaseContext.vehicle?.registration_number === '', "Fresh session case vehicle reg must be empty", freshCaseContext.vehicle?.registration_number);
  assert(freshCaseContext.seizure?.total_quantity === '', "Fresh session case seizure quantity must be empty", freshCaseContext.seizure?.total_quantity);
  assert(freshCaseContext.documents.length === 0, "Fresh session case must have 0 attached documents");
  assert(Object.keys(freshCaseContext.confirmed_facts || {}).length === 0, "Fresh session case confirmed_facts must be empty");

  // Verify evidence store case isolation
  const freshDuplicates = globalEvidenceStore.getDuplicates(freshCaseContext.case_id);
  assert(freshDuplicates.length === 0, "Fresh session case must have 0 duplicates", String(freshDuplicates.length));

  const freshDocs = globalEvidenceStore.getCaseDocuments(freshCaseContext.case_id);
  assert(freshDocs.length === 0, "Fresh session case must have 0 audited case documents", String(freshDocs.length));

  const freshConflicts = globalEvidenceStore.getConflictsWorkspace(freshCaseContext.case_id);
  assert(freshConflicts.length === 0, "Fresh session case must have 0 conflict workspace items", String(freshConflicts.length));

  const freshChecklist = globalEvidenceStore.getInvestigationChecklist(freshCaseContext.case_id);
  assert(freshChecklist.length === 0, "Fresh session case must have 0 checklist items", String(freshChecklist.length));

  const freshSummary = globalEvidenceStore.getExecutiveSummary(freshCaseContext.case_id);
  assert(freshSummary.fir_number !== '24/2024', "Fresh session executive summary must NOT inherit Batathu FIR 24/2024", freshSummary.fir_number);
  assert(freshSummary.conflicts_count === 0, "Fresh session executive summary must have 0 conflicts", String(freshSummary.conflicts_count));
  assert(freshSummary.coverage_scorecard.conflicting_count === 0, "Fresh session scorecard must have 0 conflicting items", String(freshSummary.coverage_scorecard.conflicting_count));

  // Verify explicit retrieval of Batathu demo case
  const batathuCase = globalCaseStore.getCase('case_batathu_hp72d3928');
  assert(batathuCase !== null, "Explicit Batathu case lookup must still be preserved");
  if (batathuCase) {
    assert(batathuCase.fir_details?.fir_number === '24/2024', "Explicit Batathu case must load FIR 24/2024", batathuCase.fir_details?.fir_number);
    assert(batathuCase.vehicle?.registration_number === 'HP72D-3928', "Explicit Batathu case must load HP72D-3928", batathuCase.vehicle?.registration_number);
  }

  const batathuSummary = globalEvidenceStore.getExecutiveSummary('case_batathu_hp72d3928');
  assert(batathuSummary.fir_number === '24/2024', "Explicit Batathu summary must report FIR 24/2024", batathuSummary.fir_number);
  assert(batathuSummary.conflicts_count === 4, "Explicit Batathu summary must report 4 conflicts", String(batathuSummary.conflicts_count));

  // TEST 7: CASE SELECTOR FIXTURE METADATA & RECORD SEPARATION
  console.log("\n--- TEST CASE 7: CASE SELECTOR FIXTURE METADATA & RECORD SEPARATION ---");
  const allCases = globalCaseStore.getAllCases();
  assert(allCases.length > 0, "CaseStore must contain cases", String(allCases.length));

  const batathuCaseRecord = allCases.find(c => c.case_id === 'case_batathu_hp72d3928');
  assert(batathuCaseRecord !== undefined, "Batathu demo record must exist in CaseStore");
  assert(batathuCaseRecord?.is_fixture === true, "Batathu record must have is_fixture: true", String(batathuCaseRecord?.is_fixture));
  assert(batathuCaseRecord?.record_type === 'demo', "Batathu record must have record_type: 'demo'", String(batathuCaseRecord?.record_type));

  const userCases = allCases.filter(c => !c.is_fixture && c.record_type !== 'demo' && c.record_type !== 'test');
  const demoCases = allCases.filter(c => c.is_fixture || c.record_type === 'demo' || c.record_type === 'test');

  assert(demoCases.some(c => c.case_id === 'case_batathu_hp72d3928'), "Demo/test list must include Batathu demo case");
  assert(!userCases.some(c => c.case_id === 'case_batathu_hp72d3928'), "Normal user cases list must EXCLUDE Batathu demo case");

  // Create a simulated user case and verify it appears in userCases without being filtered
  const newUserCase = globalCaseStore.processUploadedFIR('FIR_Test_User_Case.pdf', 'First Information Report No. 99/2026 PS Sadar');
  assert(newUserCase.is_fixture === false, "User created case must have is_fixture: false");
  const updatedAllCases = globalCaseStore.getAllCases();
  const updatedUserCases = updatedAllCases.filter(c => !c.is_fixture && c.record_type !== 'demo' && c.record_type !== 'test');
  assert(updatedUserCases.some(c => c.case_id === newUserCase.case_id), "Legitimate user case must be present in userCases list");

  console.log("\n================================================================");
  console.log(`REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runRegressionSuite().catch((err) => {
  console.error("Fatal error in regression suite:", err);
  process.exit(1);
});
