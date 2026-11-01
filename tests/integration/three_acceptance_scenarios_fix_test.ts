import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore, CaseContext } from '../../src/server/caseStore';

function createFreshCase(prefix: string): CaseContext {
  const id = `session_case_${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  return globalCaseStore.getOrCreateSessionCase(id);
}

async function runThreeAcceptanceScenariosFixTests() {
  console.log("==========================================================================");
  console.log("RUNNING REGRESSION TESTS FOR THREE ACCEPTANCE TEST SCENARIOS");
  console.log("==========================================================================\n");

  let passedCount = 0;
  let totalCount = 0;

  function printTestResult(
    testNum: number,
    testTitle: string,
    input: string,
    actualOutput: string,
    expectedOutputCriteria: string,
    isPassed: boolean,
    reason: string
  ) {
    totalCount++;
    if (isPassed) passedCount++;

    console.log(`--------------------------------------------------------------------------`);
    console.log(`TEST ${testNum}: ${testTitle}`);
    console.log(`STATUS: [${isPassed ? 'PASS' : 'FAIL'}]`);
    console.log(`ACTUAL INPUT: "${input}"`);
    console.log(`EXPECTED CRITERIA: ${expectedOutputCriteria}`);
    console.log(`ACTUAL OUTPUT:\n${actualOutput}`);
    console.log(`RESULT REASON: ${reason}`);
    console.log(`--------------------------------------------------------------------------\n`);
  }

  // -------------------------------------------------------------------------
  // Test 1: Informer intelligence before search -> Information-Based, no document generated
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("test1_informer");
    const input = "I received secret information that a suspect is storing 2 kg opium in a residence in Sadar Una. Do not generate a document yet, just explain the legal requirements under Section 42 NDPS Act.";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const isInfoBased = output.includes("Prior Information") || output.includes("Information-Based");
    const notChanceRecovery = !output.includes("On-the-Spot Recovery (Chance Recovery)") && !output.includes("14-Stage Chance Recovery Workflow");
    const noDocGenerated = !output.includes("```text");
    const explainsSection42 = output.includes("Section 42") || output.includes("धारा 42") || output.includes("72 hours") || output.includes("writing");
    const noMetaInstructionsInChronology = !output.includes("Do not generate a document yet") && !output.includes("just explain the legal requirements");

    const isPassed = isInfoBased && notChanceRecovery && noDocGenerated && explainsSection42 && noMetaInstructionsInChronology;
    const reason = isPassed
      ? "Classified as Information-Based, suppressed document generation as requested, explained Section 42 requirements, and cleaned meta-instructions from chronology."
      : `Failed criteria: isInfoBased=${isInfoBased}, notChanceRecovery=${notChanceRecovery}, noDocGenerated=${noDocGenerated}, explainsSection42=${explainsSection42}, noMetaInstructionsInChronology=${noMetaInstructionsInChronology}`;

    printTestResult(
      1,
      "Informer Intelligence Before Search -> Information-Based, No Document Generated",
      input,
      output,
      "Classify as Information-Based, generate no document code block, explain Section 42 NDPS Act requirements, exclude meta instructions from chronology.",
      isPassed,
      reason
    );
  }

  // -------------------------------------------------------------------------
  // Test 2: Abandoned packet recovered during routine patrol -> Chance Recovery, recovery acknowledged
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("test2_abandoned");
    const input = "During routine patrol, an abandoned sealed-looking packet containing suspected charas was found on a roadside bench at 10:15 AM. No person or vehicle was seen near the packet. How should this recovery be recorded?";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const isChanceRecovery = output.includes("On-the-Spot Recovery") || output.includes("Chance Recovery");
    const acknowledgesRecovery = output.includes("roadside bench") && output.includes("10:15 AM") && (output.includes("found") || output.includes("recovered") || output.includes("Discovery"));
    const noFalseRecoveryNotEstablished = !output.includes("Recovery and search execution not established");
    const keepsChemicalSuspected = output.includes("suspected charas") || output.includes("suspected");

    const hasMaruti = output.includes("Maruti");
    const hasDriverName = output.includes("driver name");
    const hasArrestedAtSpot = (output.includes("was arrested at the spot") || output.includes("accused arrested")) && !output.includes("no suspect") && !output.includes("Not applicable");
    const hasVehicleHP = output.includes("vehicle HP-");

    console.log(`[Diagnostic Test 2] hasMaruti=${hasMaruti}, hasDriverName=${hasDriverName}, hasArrestedAtSpot=${hasArrestedAtSpot}, hasVehicleHP=${hasVehicleHP}`);

    const noInventedPersonOrVehicle = !hasMaruti && !hasDriverName && !hasArrestedAtSpot && !hasVehicleHP;

    const isPassed = isChanceRecovery && acknowledgesRecovery && noFalseRecoveryNotEstablished && keepsChemicalSuspected && noInventedPersonOrVehicle;
    const reason = isPassed
      ? "Classified as Chance Recovery, acknowledged discovery and recovery on roadside bench as confirmed facts, kept chemical identity suspected, and invented no person or vehicle."
      : `Failed criteria: isChanceRecovery=${isChanceRecovery}, acknowledgesRecovery=${acknowledgesRecovery}, noFalseRecoveryNotEstablished=${noFalseRecoveryNotEstablished}, keepsChemicalSuspected=${keepsChemicalSuspected}, noInventedPersonOrVehicle=${noInventedPersonOrVehicle} (hasMaruti=${hasMaruti}, hasDriverName=${hasDriverName}, hasArrestedAtSpot=${hasArrestedAtSpot}, hasVehicleHP=${hasVehicleHP})`;

    printTestResult(
      2,
      "Abandoned Packet Recovered During Routine Patrol -> Chance Recovery, Recovery Acknowledged",
      input,
      output,
      "Classify as Chance Recovery, acknowledge discovery/recovery of abandoned packet on roadside bench at 10:15 AM as user-confirmed facts, keep chemical identity suspected, invent no person or vehicle.",
      isPassed,
      reason
    );
  }

  // -------------------------------------------------------------------------
  // Test 3: Person flees, no contraband found -> No Recovery / Incident Documentation
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("test3_flight");
    const input = "A suspicious person fled from the spot when approached during patrolling at Bus Stand Una at 8:00 PM. No suspicious article, contraband, or packet was recovered from the spot or person. How is this recorded?";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const isNoRecovery = output.includes("No Recovery") || output.includes("Incident Documentation") || output.includes("घटनारूप प्रविष्टि");
    const no14StageWorkflow = !output.includes("14-Stage Chance Recovery Workflow") && output.includes("No Seizure Workflow Activated");
    const recommendsGeneralDiary = output.includes("General Diary") || output.includes("Roznamcha");
    const noInventedSeizureOrOffence = !output.includes("seizure memo completed") && !output.includes("seized") && !output.includes("arrest memo");

    const isPassed = isNoRecovery && no14StageWorkflow && recommendsGeneralDiary && noInventedSeizureOrOffence;
    const reason = isPassed
      ? "Classified as No Recovery / Incident Documentation, did not activate 14-stage Chance Recovery seizure workflow, recommended General Diary entry, and invented no seizure or NDPS offence."
      : `Failed criteria: isNoRecovery=${isNoRecovery}, no14StageWorkflow=${no14StageWorkflow}, recommendsGeneralDiary=${recommendsGeneralDiary}, noInventedSeizureOrOffence=${noInventedSeizureOrOffence}`;

    printTestResult(
      3,
      "Person Flees, No Contraband Found -> No Recovery / Incident Documentation",
      input,
      output,
      "Classify as No Recovery / Incident Documentation, do NOT activate 14-stage Chance Recovery seizure workflow, recommend General Diary / Roznamcha entry, invent no seizure or NDPS offence.",
      isPassed,
      reason
    );
  }

  // -------------------------------------------------------------------------
  // Test 4: Case Isolation Verification
  // -------------------------------------------------------------------------
  {
    const caseA = createFreshCase("isolation_a");
    const caseB = createFreshCase("isolation_b");

    await processInvestigatorQuery(
      "I received secret information that a suspect is storing 2 kg opium in a residence in Sadar Una.",
      caseA,
      []
    );

    await processInvestigatorQuery(
      "A suspicious person fled from the spot when approached during patrolling at Bus Stand Una at 8:00 PM. No suspicious article was recovered.",
      caseB,
      []
    );

    const caseAIsInfoBased = caseA.recovery_pathway === "INFORMATION_BASED";
    const caseBNotSeizure = caseB.recovery_pathway !== "INFORMATION_BASED" && caseB.recovery_pathway !== "CHANCE_RECOVERY";
    const caseAHasCaseId = !!caseA.case_id;
    const caseBHasCaseId = !!caseB.case_id;
    const caseIdsAreDifferent = caseA.case_id !== caseB.case_id;

    const isPassed = caseAIsInfoBased && caseBNotSeizure && caseAHasCaseId && caseBHasCaseId && caseIdsAreDifferent;
    const reason = isPassed
      ? "Complete isolation confirmed between cases with zero state leakage."
      : `Failed isolation: caseAIsInfoBased=${caseAIsInfoBased}, caseBNotSeizure=${caseBNotSeizure}, caseAHasCaseId=${caseAHasCaseId}, caseBHasCaseId=${caseBHasCaseId}, caseIdsAreDifferent=${caseIdsAreDifferent}`;

    printTestResult(
      4,
      "Case Isolation Verification",
      "Case A (Opium info) vs Case B (Flight no recovery)",
      `Case A pathway=${caseA.recovery_pathway}, Case B pathway=${caseB.recovery_pathway}, Case A ID=${caseA.case_id}, Case B ID=${caseB.case_id}`,
      "Complete isolation between cases with zero state leakage.",
      isPassed,
      reason
    );
  }

  console.log(`==========================================================================`);
  console.log(`RESULTS SUMMARY: ${passedCount} / ${totalCount} TESTS PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log(`==========================================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runThreeAcceptanceScenariosFixTests().catch(err => {
  console.error("Three acceptance scenarios fix test failed:", err);
  process.exit(1);
});
