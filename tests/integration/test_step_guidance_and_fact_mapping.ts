import { answerGenerator } from '../../src/server/gemini';
import { globalCaseStore } from '../../src/server/caseStore';
import { templateRegistry } from '../../src/server/templateRegistry';

async function runStepGuidanceAndFactMappingTests() {
  console.log("================================================================");
  console.log("STARTING STEP GUIDANCE, FACT MAPPING & DOCUMENT GENERATION TESTS");
  console.log("================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, actual?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
      if (actual) console.log(`      Actual Output: ${actual.substring(0, 400)}...`);
      failed++;
    }
  }

  // TEST 1: Fresh Patrolling Investigation Activation
  console.log("--- TEST 1: FRESH PATROLLING INVESTIGATION ACTIVATION ---");
  const sessionId = 'guidance_test_session_' + Date.now();
  const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
  let history: { role: 'user' | 'assistant'; content: string }[] = [];

  const turn1Query = "During routine patrolling, my team stopped a man carrying a suspicious packet. There was no prior secret information. Help me start the NDPS case documentation, one document at a time. Don't assume facts I haven't provided.";
  console.log(`\nTurn 1: "${turn1Query}"`);
  const res1 = await answerGenerator.generateAnswer(turn1Query, [], history, undefined, caseContext);

  assert(res1.answer.includes("Chance Recovery") || res1.answer.includes("CHANCE_RECOVERY"), "Turn 1 must select Chance Recovery pathway", res1.answer);
  assert(res1.answer.includes("Step 1 of 14") || res1.answer.includes("चरण 1"), "Turn 1 must activate Step 1 of 14", res1.answer);
  assert(res1.answer.includes("IO को इस चरण में क्या करना है"), "Turn 1 must explain IO's practical actions under 'IO को इस चरण में क्या करना है'", res1.answer);
  assert(res1.answer.includes("Next Question") || res1.answer.includes("दिनांक"), "Turn 1 must ask one next question (दिनांक)", res1.answer);
  assert(caseContext.fir_details.fir_number === '', "Turn 1 must not attach demo FIR 24/2024");
  assert(caseContext.vehicle.registration_number === '', "Turn 1 must not attach demo vehicle HP72D-3928");
  assert(caseContext.current_stage === 1, "Turn 1: Case context current_stage must be 1");
  history.push({ role: 'user', content: turn1Query }, { role: 'assistant', content: res1.answer });

  // TEST 2: Strict Fact Mapping (Date only)
  console.log("\n--- TEST 2: FACT MAPPING — DATE ---");
  const turn2Query = "28 October 2026";
  console.log(`Turn 2: "${turn2Query}"`);
  const res2 = await answerGenerator.generateAnswer(turn2Query, [], history, undefined, caseContext);

  assert(caseContext.confirmed_facts?.['दिनांक'] === '28 October 2026', "Turn 2: Date must be recorded as '28 October 2026'");
  assert(!caseContext.confirmed_facts?.['समय'], "Turn 2: समय must not be populated with date");
  assert(!caseContext.confirmed_facts?.['थाना'], "Turn 2: थाना must not be populated with date");
  assert(res2.answer.includes("समय"), "Turn 2 must ask for the next field: समय", res2.answer);
  history.push({ role: 'user', content: turn2Query }, { role: 'assistant', content: res2.answer });

  // TEST 3: Strict Fact Mapping (Time only - Bug Verification: 7:30 PM must NOT populate थाना)
  console.log("\n--- TEST 3: FACT MAPPING BUG FIX — 7:30 PM MUST NOT POPULATE थाना ---");
  const turn3Query = "7:30 PM";
  console.log(`Turn 3: "${turn3Query}"`);
  const res3 = await answerGenerator.generateAnswer(turn3Query, [], history, undefined, caseContext);

  assert(caseContext.confirmed_facts?.['समय'] === '7:30 PM', "Turn 3: समय must be recorded as '7:30 PM'");
  assert(caseContext.confirmed_facts?.['थाना'] !== '7:30 PM' && !caseContext.confirmed_facts?.['थाना'], "Turn 3 CRITICAL BUG FIX: थाना must NEVER be populated with '7:30 PM'", String(caseContext.confirmed_facts?.['थाना']));
  assert(res3.answer.includes("थाना"), "Turn 3 must ask for the next field: थाना", res3.answer);
  history.push({ role: 'user', content: turn3Query }, { role: 'assistant', content: res3.answer });

  // TEST 4: Strict Fact Mapping (Police Station)
  console.log("\n--- TEST 4: FACT MAPPING — POLICE STATION ---");
  const turn4Query = "Police Station Sadar";
  console.log(`Turn 4: "${turn4Query}"`);
  const res4 = await answerGenerator.generateAnswer(turn4Query, [], history, undefined, caseContext);

  assert(caseContext.confirmed_facts?.['थाना'] === 'Police Station Sadar', "Turn 4: थाना must be recorded as 'Police Station Sadar'");
  assert(caseContext.confirmed_facts?.['समय'] === '7:30 PM', "Turn 4: समय must remain '7:30 PM'");
  assert(res4.answer.includes("जिला"), "Turn 4 must ask for the next field: जिला", res4.answer);
  history.push({ role: 'user', content: turn4Query }, { role: 'assistant', content: res4.answer });

  // TEST 5: Strict Fact Mapping (District)
  console.log("\n--- TEST 5: FACT MAPPING — DISTRICT ---");
  const turn5Query = "District Una";
  console.log(`Turn 5: "${turn5Query}"`);
  const res5 = await answerGenerator.generateAnswer(turn5Query, [], history, undefined, caseContext);

  assert(caseContext.confirmed_facts?.['जिला'] === 'District Una', "Turn 5: जिला must be recorded as 'District Una'");
  assert(res5.answer.includes("स्थान"), "Turn 5 must ask for the next field: स्थान", res5.answer);
  history.push({ role: 'user', content: turn5Query }, { role: 'assistant', content: res5.answer });

  // TEST 6: Strict Fact Mapping (Location)
  console.log("\n--- TEST 6: FACT MAPPING — LOCATION ---");
  const turn6Query = "Near Bus Stand Naka";
  console.log(`Turn 6: "${turn6Query}"`);
  const res6 = await answerGenerator.generateAnswer(turn6Query, [], history, undefined, caseContext);

  assert(caseContext.confirmed_facts?.['स्थान'] === 'Near Bus Stand Naka', "Turn 6: स्थान must be recorded as 'Near Bus Stand Naka'");
  assert(res6.answer.includes("पदार्थ"), "Turn 6 must ask for the next field: पदार्थ", res6.answer);
  history.push({ role: 'user', content: turn6Query }, { role: 'assistant', content: res6.answer });

  // TEST 7: Strict Fact Mapping (Substance)
  console.log("\n--- TEST 7: FACT MAPPING — SUBSTANCE ---");
  const turn7Query = "हेरोइन";
  console.log(`Turn 7: "${turn7Query}"`);
  const res7 = await answerGenerator.generateAnswer(turn7Query, [], history, undefined, caseContext);

  assert(caseContext.confirmed_facts?.['पदार्थ'] === 'हेरोइन', "Turn 7: पदार्थ must be recorded as 'हेरोइन'");
  assert(res7.answer.includes("वजन"), "Turn 7 must ask for the next field: वजन", res7.answer);
  history.push({ role: 'user', content: turn7Query }, { role: 'assistant', content: res7.answer });

  // TEST 8: Immediate Completed Document Generation on Last Field Answered
  console.log("\n--- TEST 8: IMMEDIATE DOCUMENT GENERATION & REVIEW PROMPT ---");
  const turn8Query = "500 grams";
  console.log(`Turn 8: "${turn8Query}"`);
  const res8 = await answerGenerator.generateAnswer(turn8Query, [], history, undefined, caseContext);

  assert(caseContext.confirmed_facts?.['वजन'] === '500 ग्राम', "Turn 8: वजन must be recorded as '500 ग्राम'");
  assert(res8.answer.includes("```text") && res8.answer.includes("बरामदगी फर्द मौका"), "Turn 8 must immediately render completed document inside preformatted code block", res8.answer);
  assert(res8.answer.includes("28 October 2026") && res8.answer.includes("7:30 PM") && res8.answer.includes("Police Station Sadar"), "Turn 8 rendered document must contain confirmed facts", res8.answer);
  assert(res8.answer.includes("दस्तावेज़ समीक्षा") || res8.answer.includes("Document Review"), "Turn 8 must present document review section", res8.answer);
  assert(res8.answer.includes("पुष्टि करें") || res8.answer.includes("Confirm"), "Turn 8 must prompt IO for confirmation", res8.answer);
  assert(caseContext.current_stage === 1, "Turn 8: Current stage must remain Stage 1 until explicit confirmation");
  history.push({ role: 'user', content: turn8Query }, { role: 'assistant', content: res8.answer });

  // TEST 9: Step 1 to Step 2 Transition on Explicit Confirmation
  console.log("\n--- TEST 9: STEP 1 TO STEP 2 TRANSITION ON EXPLICIT CONFIRMATION ---");
  const turn9Query = "पुष्टि करें";
  console.log(`Turn 9: "${turn9Query}"`);
  const res9 = await answerGenerator.generateAnswer(turn9Query, [], history, undefined, caseContext);

  assert(caseContext.current_stage === 2, "Turn 9: Stage must advance to Stage 2 after explicit confirmation");
  assert(res9.answer.includes("Step 2 of 14") || res9.answer.includes("चरण 2"), "Turn 9 must display Step 2 of 14 header", res9.answer);
  assert(res9.answer.includes("धारा 50 NDPS Act"), "Turn 9 must reference Section 50 Notice template", res9.answer);
  assert(res9.answer.includes("IO को इस चरण में क्या करना है"), "Turn 9 must display IO guidance for Section 50 under 'IO को इस चरण में क्या करना है'", res9.answer);
  assert(res9.answer.includes("आरोपी"), "Turn 9 must prompt for the first Step 2 question (आरोपी)", res9.answer);

  // TEST 10: Clean Case Isolation Check
  console.log("\n--- TEST 10: PROCEDURAL STEPS IN CLEAN CASE ---");
  const cleanSessionId = 'clean_case_lookup_' + Date.now();
  const cleanCaseContext = globalCaseStore.getOrCreateSessionCase(cleanSessionId);
  const cleanQuery = "What procedural steps are documented in this case?";
  const cleanRes = await answerGenerator.generateAnswer(cleanQuery, [], [], undefined, cleanCaseContext);

  assert(!cleanRes.answer.includes("Batathu") && !cleanRes.answer.includes("HP72D-3928") && !cleanRes.answer.includes("Manoj Kumar"), "Clean case lookup must NOT mention Batathu, HP72D-3928, or Manoj Kumar", cleanRes.answer);
  assert(cleanRes.answer.includes("No procedural steps are documented") || cleanRes.answer.includes("NOT ESTABLISHED") || cleanRes.answer.includes("No source documents") || cleanRes.answer.includes("संलग्न नहीं"), "Clean case lookup must state no documents/records linked", cleanRes.answer);

  console.log("\n================================================================");
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log("================================================================");

  if (failed > 0) process.exit(1);
}

runStepGuidanceAndFactMappingTests().catch(err => {
  console.error("Fatal error in test suite:", err);
  process.exit(1);
});
