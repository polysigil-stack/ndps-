import { answerGenerator } from '../../src/server/gemini';
import { globalCaseStore } from '../../src/server/caseStore';
import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';

async function runIsolationSuite() {
  console.log("================================================================");
  console.log("STARTING CASE EVIDENCE ISOLATION & MULTI-CASE AUDIT SUITE");
  console.log("================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, details?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
      if (details) console.log(`      Details: ${details.substring(0, 300)}...`);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // TEST 1: Fictional Patrol Scenario with NO attached records
  // -------------------------------------------------------------------------
  console.log("--- TEST 1: Active Fictional Case (No Linked Records) ---");
  const session1 = 'fictional_patrol_iso_' + Date.now();
  const case1 = globalCaseStore.getOrCreateSessionCase(session1);
  case1.case_title = 'Fictional Patrolling Case - Fictionpur';

  const queryProcedural = "What procedural steps are documented in this case?";
  const res1 = await processInvestigatorQuery(queryProcedural, case1, [], [], 'en');

  assert(
    res1.answer.includes("No procedural steps are documented in the records currently linked to this case."),
    "Must return exact no linked records notice",
    res1.answer
  );
  assert(
    res1.answer.includes("Please attach or select the relevant records"),
    "Must ask user to attach or select relevant records",
    res1.answer
  );
  assert(
    !res1.answer.includes("24/2024") &&
    !res1.answer.includes("HP72D-3928") &&
    !res1.answer.includes("Batathu") &&
    !res1.answer.includes("Poppy Straw") &&
    !res1.answer.includes("108.900") &&
    !res1.answer.includes("PS-BATATHU-1"),
    "Must NOT leak Batathu facts or FIR 24/2024 details into empty case",
    res1.answer
  );
  assert(res1.citations.length === 0, "Must have 0 citations for empty records", `Citations: ${res1.citations.length}`);

  // -------------------------------------------------------------------------
  // TEST 2: Active Case WITH linked Batathu records
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 2: Active Case WITH Linked Records (Batathu FIR 24/2024) ---");
  const caseBatathu = globalCaseStore.getCase('case_batathu_hp72d3928');
  assert(!!caseBatathu, "Batathu case fixture must exist in store");

  const res2 = await processInvestigatorQuery(queryProcedural, caseBatathu, [], [], 'en');

  assert(
    res2.answer.includes("FIR No. 24/2024") || res2.answer.includes("24/2024"),
    "Batathu case must reference its own FIR No. 24/2024",
    res2.answer
  );
  assert(
    res2.answer.includes("HP72D-3928") || res2.answer.includes("Batathu"),
    "Batathu case must reference its own vehicle / location",
    res2.answer
  );
  assert(
    res2.answer.includes("Seizure Memo") && res2.answer.includes("PS-BATATHU-1"),
    "Batathu case must document its own seizure memo and seal",
    res2.answer
  );
  assert(res2.citations.length > 0, "Batathu case must provide source citations", `Citations: ${res2.citations.length}`);

  // -------------------------------------------------------------------------
  // TEST 3: Multi-Case Isolation - Switch back to Case 1
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 3: Multi-Case Isolation (Switch back to Case 1) ---");
  const res3 = await processInvestigatorQuery(queryProcedural, case1, [], [], 'en');

  assert(
    res3.answer.includes("No procedural steps are documented in the records currently linked to this case."),
    "Case 1 must continue to report no procedural steps documented",
    res3.answer
  );
  assert(
    !res3.answer.includes("24/2024") &&
    !res3.answer.includes("HP72D-3928") &&
    !res3.answer.includes("Batathu"),
    "Case 1 must have ZERO contamination or cached bleed from Case 2",
    res3.answer
  );

  // -------------------------------------------------------------------------
  // TEST 4: Fictional Patrol Narrative Classification & Four-Point Separation Test
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 4: Fictional Patrol Encounter Classification & Confidence ---");
  const narrative = "I am an Investigation Officer posted at Police Station Sadar, Fictionpur, Punjab. On 28 October 2026, at approximately 7:30 PM, during routine patrolling on a fictional public road, my team encountered an adult person carrying a small sealed-looking packet. There was no prior secret information about this person or the packet. The substance has not been scientifically identified. No recovery or search procedure has yet been completed in this scenario. The person's identity, exact location, quantity or weight, witness details, and packaging remain unknown.";
  
  const resNarrative = await answerGenerator.generateAnswer(narrative, [], [], undefined, case1);

  assert(
    resNarrative.answer.includes("On-the-Spot Recovery (Chance Recovery)") || resNarrative.answer.includes("Chance Recovery"),
    "Narrative must classify as Chance Recovery",
    resNarrative.answer
  );
  assert(
    resNarrative.answer.includes("Provisional (Moderate)") || resNarrative.answer.includes("Moderate"),
    "Classification confidence must be stated as Provisional (Moderate)",
    resNarrative.answer
  );
  assert(
    resNarrative.answer.includes("Four-Point Separation Test"),
    "Four-Point Separation Test must be explicitly articulated",
    resNarrative.answer
  );
  assert(
    resNarrative.answer.includes("No prior secret information reported") || resNarrative.answer.includes("prior secret information"),
    "Four-Point test must reflect no prior secret information reported",
    resNarrative.answer
  );
  assert(
    resNarrative.answer.includes("SUSPECTED POSSESSION") || resNarrative.answer.includes("Suspected Possession"),
    "Must distinguish suspected possession from confirmed recovery",
    resNarrative.answer
  );
  assert(
    resNarrative.answer.includes("CRITICAL MISSING FACTS") || resNarrative.answer.includes("FOLLOW-UP QUESTIONS"),
    "Must provide follow-up questions for critical missing facts",
    resNarrative.answer
  );
  assert(
    !resNarrative.answer.includes("24/2024") &&
    !resNarrative.answer.includes("HP72D-3928") &&
    !resNarrative.answer.includes("Batathu"),
    "Narrative response must NOT contain Batathu facts",
    resNarrative.answer
  );

  // -------------------------------------------------------------------------
  // TEST 5: Guided Mode Preservation during Procedural Inquiry
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 5: Guided Mode Preservation during Procedural Query ---");
  case1.active_mode = 'GUIDED';
  case1.current_stage = 1;
  case1.recovery_pathway = 'CHANCE_RECOVERY';
  case1.confirmed_facts = { 'दिनांक': '28 October 2026', 'समय': 'approximately 7:30 PM' };

  const resGuidedProc = await answerGenerator.generateAnswer("What procedural steps are documented in this case?", [], [], undefined, case1);

  assert(
    resGuidedProc.answer.includes("No procedural steps are documented in the records currently linked to this case."),
    "Guided mode response must state no procedural steps documented in linked records",
    resGuidedProc.answer
  );
  assert(
    case1.current_stage === 1,
    "Guided mode stage must remain Stage 1",
    `Stage: ${case1.current_stage}`
  );
  assert(
    case1.confirmed_facts['दिनांक'] === '28 October 2026' && case1.confirmed_facts['समय'] === 'approximately 7:30 PM',
    "Guided mode confirmed facts must be preserved exactly",
    JSON.stringify(case1.confirmed_facts)
  );
  assert(
    case1.confirmed_facts['स्थान'] === undefined,
    "Missing field must NOT be populated with query text",
    case1.confirmed_facts['स्थान']
  );

  // -------------------------------------------------------------------------
  // TEST 6: False Premise & Specific Evidence Queries on Unlinked Case
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 6: Unlinked Case False Premise & Evidence Isolation ---");
  
  // 6.1 First document present in this case?
  const resFirstDoc = await processInvestigatorQuery("is the first document present in this case?", case1, [], [], 'en');
  assert(
    !resFirstDoc.answer.includes("Batathu") &&
    !resFirstDoc.answer.includes("HP72D-3928") &&
    !resFirstDoc.answer.includes("108.900") &&
    (resFirstDoc.answer.includes("No source documents") || resFirstDoc.answer.includes("No records") || resFirstDoc.answer.includes("NOT ESTABLISHED")),
    "First document query on unlinked case must not leak Batathu details",
    resFirstDoc.answer
  );

  // 6.2 Section 42 in this case?
  const resSec42 = await processInvestigatorQuery("is section 42 present in this case?", case1, [], [], 'en');
  assert(
    !resSec42.answer.includes("Batathu") &&
    !resSec42.answer.includes("HP72D-3928") &&
    (resSec42.answer.includes("No Section 42") || resSec42.answer.includes("NOT ESTABLISHED")),
    "Section 42 query on unlinked case must not leak Batathu details",
    resSec42.answer
  );

  // 6.3 Which document records the seizure?
  const resSeizureDoc = await processInvestigatorQuery("which document records the seizure in this case?", case1, [], [], 'en');
  assert(
    !resSeizureDoc.answer.includes("Batathu") &&
    !resSeizureDoc.answer.includes("HP72D-3928") &&
    !resSeizureDoc.answer.includes("108.900"),
    "Seizure document query on unlinked case must not leak Batathu details",
    resSeizureDoc.answer
  );

  // 6.4 Seal intact query
  const resSeal = await processInvestigatorQuery("does intact seal prove guilt in this case?", case1, [], [], 'en');
  assert(
    !resSeal.answer.includes("PS-BATATHU-1") &&
    !resSeal.answer.includes("SHO-BATATHU"),
    "Seal query on unlinked case must not leak Batathu seal names",
    resSeal.answer
  );

  console.log(`\n================================================================`);
  console.log(`CASE EVIDENCE ISOLATION SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log(`================================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runIsolationSuite().catch(err => {
  console.error("FATAL ERROR IN SUITE:", err);
  process.exit(1);
});
