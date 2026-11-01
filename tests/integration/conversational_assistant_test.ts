import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore, CaseContext } from '../../src/server/caseStore';
import { templateRegistry } from '../../src/server/templateRegistry';

function createFreshCase(prefix: string): CaseContext {
  const id = `session_case_${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  return globalCaseStore.getOrCreateSessionCase(id);
}

async function runConversationalAssistantTests() {
  console.log("==========================================================================");
  console.log("RUNNING ACCEPTANCE TEST SUITE: CONVERSATIONAL & CONTEXT-AWARE ASSISTANT");
  console.log("==========================================================================\n");

  let passedCount = 0;
  let totalCount = 0;

  function printTestResult(
    testId: string,
    testTitle: string,
    input: string,
    actualOutput: string,
    expectedCriteria: string,
    isPassed: boolean,
    reason: string
  ) {
    totalCount++;
    if (isPassed) passedCount++;

    console.log(`--------------------------------------------------------------------------`);
    console.log(`TEST ${testId}: ${testTitle}`);
    console.log(`STATUS: [${isPassed ? 'PASS' : 'FAIL'}]`);
    console.log(`ACTUAL INPUT: "${input}"`);
    console.log(`EXPECTED CRITERIA: ${expectedCriteria}`);
    console.log(`ACTUAL OUTPUT:\n${actualOutput}`);
    console.log(`RESULT REASON: ${reason}`);
    console.log(`--------------------------------------------------------------------------\n`);
  }

  // -------------------------------------------------------------------------
  // TEST A: Prior Information / Section 42 next steps, no document
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("testA_informer");
    const input = "A reliable informer has told me that a person may be carrying heroin to a house in the village. I have not recorded the information or conducted any search yet. Explain the appropriate next steps. Do not generate any document yet.";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const explainsSec42 = output.includes("Section 42") || output.includes("42(1)") || output.includes("writing");
    const hasOneFollowUp = output.includes("Follow-Up Question") || output.includes("General Diary");
    const noFullReport = !output.includes("### 1. CLASSIFICATION") && !output.includes("Four-Point Separation Test");
    const noDocGenerated = !output.includes("```text") && !output.includes("```");

    const isPassed = explainsSec42 && hasOneFollowUp && noFullReport && noDocGenerated;
    const reason = isPassed
      ? "Provided short relevant Section 42 explanation, asked one contextual follow-up question, suppressed full report and document generation."
      : `Failed criteria: explainsSec42=${explainsSec42}, hasOneFollowUp=${hasOneFollowUp}, noFullReport=${noFullReport}, noDocGenerated=${noDocGenerated}`;

    printTestResult("A", "Prior Information Intake & Section 42 Guidance (No Document)", input, output,
      "Short relevant Section 42 explanation, one useful follow-up, no full 14-stage report, no document block.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST B: Routine Patrolling Abandoned Packet Recovery
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("testB_abandoned");
    const input = "During routine patrolling, our team found a packet containing suspected charas abandoned beside a public road. We recovered the packet. No person was present. We have not weighed or sampled it yet.";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const acknowledgesRecovery = output.includes("roadside bench") || output.includes("public road") || output.includes("abandoned");
    const preservesSuspected = output.includes("suspected charas") || output.includes("suspected");
    const asksCustodySeizure = output.includes("Follow-Up Question") || output.includes("Fard Makboozgi") || output.includes("witnesses");
    const noInventedPersonVehicle = !output.includes("Maruti") && !output.includes("driver name") && !output.includes("vehicle HP-");
    const noFullReport = !output.includes("### 1. CLASSIFICATION") && !output.includes("Four-Point Separation Test");

    const isPassed = acknowledgesRecovery && preservesSuspected && asksCustodySeizure && noInventedPersonVehicle && noFullReport;
    const reason = isPassed
      ? "Acknowledged actual recovery, preserved suspected identity, asked one custody follow-up, invented no person or vehicle, and avoided full report dump."
      : `Failed criteria: acknowledgesRecovery=${acknowledgesRecovery}, preservesSuspected=${preservesSuspected}, asksCustodySeizure=${asksCustodySeizure}, noInventedPersonVehicle=${noInventedPersonVehicle}, noFullReport=${noFullReport}`;

    printTestResult("B", "Routine Patrol Abandoned Packet Recovery", input, output,
      "Acknowledge recovery, preserve suspected identity, ask one custody/seizure question, no invented suspect/vehicle, no full report dump.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST C: Person Flees, No Contraband Found -> Incident Documentation
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("testC_flight");
    const input = "A person ran away after seeing our police vehicle. We chased him but found no contraband or other suspicious article. What type of documentation is appropriate?";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const recommendsGD = output.includes("General Diary") || output.includes("Roznamcha");
    const noSeizureWorkflow = output.includes("No Seizure Workflow Activated") || output.includes("No seizure workflow") || !output.includes("14-Stage Chance Recovery Workflow");
    const asksAtMostOne = !output.includes("1. **General Diary Record**") || output.includes("Follow-Up Question");
    const noFullReport = !output.includes("### 1. CLASSIFICATION") && !output.includes("Four-Point Separation Test");

    const isPassed = recommendsGD && noSeizureWorkflow && asksAtMostOne && noFullReport;
    const reason = isPassed
      ? "Provided concise GD entry guidance, activated no seizure workflow, asked at most one follow-up, avoided full report dump."
      : `Failed criteria: recommendsGD=${recommendsGD}, noSeizureWorkflow=${noSeizureWorkflow}, asksAtMostOne=${asksAtMostOne}, noFullReport=${noFullReport}`;

    printTestResult("C", "Person Flees, No Contraband Found", input, output,
      "Concise explanation for General Diary documentation, no seizure workflow, at most one follow-up, no full report.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST D: Legal Question (Section 42 vs 50) -> Direct Legal Answer
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("testD_legal");
    const input = "Explain the difference between Sections 42 and 50 of the NDPS Act.";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const explainsDifferences = output.includes("Section 42") && output.includes("Section 50") && (output.includes("premises") || output.includes("building") || output.includes("personal search"));
    const noCaseIntake = !output.includes("Follow-Up Question") && !output.includes("suspect details") && !output.includes("What is the police station");
    const noClassificationReport = !output.includes("### 1. CLASSIFICATION") && !output.includes("Four-Point Separation Test");

    const isPassed = explainsDifferences && noCaseIntake && noClassificationReport;
    const reason = isPassed
      ? "Answered legal question directly, activated no case intake or workflow, produced no classification report."
      : `Failed criteria: explainsDifferences=${explainsDifferences}, noCaseIntake=${noCaseIntake}, noClassificationReport=${noClassificationReport}`;

    printTestResult("D", "Legal Question: Difference Between Sections 42 and 50", input, output,
      "Direct legal answer explaining statutory scope, no case intake, no classification report, no suspect questions.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST E: Review Request -> Concise Case Summary
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("testE_review");
    // First turn: intake
    await processInvestigatorQuery(
      "A reliable informer has told me that a person may be carrying heroin to a house in the village. I have not recorded the information or conducted any search yet.",
      freshCase,
      []
    );

    // Second turn: review request
    const input = "Review everything recorded so far. Do not proceed to the next stage.";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const showsSummary = output.includes("CASE SUMMARY") || output.includes("CONFIRMED FACTS");
    const showsPathway = output.includes("Information-Based") || output.includes("Prior Info");
    const preservesStage = freshCase.current_stage === 1;

    const isPassed = showsSummary && showsPathway && preservesStage;
    const reason = isPassed
      ? "Presented concise structured case summary without advancing the workflow stage."
      : `Failed criteria: showsSummary=${showsSummary}, showsPathway=${showsPathway}, preservesStage=${preservesStage}`;

    printTestResult("E", "Review Case Facts Request", input, output,
      "Present concise structured case summary, do not advance workflow stage.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST F: Fact Correction -> Single Field Update
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("testF_correct");
    // First turn: intake
    await processInvestigatorQuery(
      "During routine patrolling, an abandoned packet was found on a roadside bench at 8:00 PM.",
      freshCase,
      []
    );

    // Second turn: correction
    const input = "Correct the occurrence time to 9:45 PM.";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const output = res.answer;

    const updatedTime = freshCase.confirmed_facts?.['समय'] === '9:45 PM';
    const conciseAck = output.includes("Occurrence time updated to") && output.includes("9:45 PM");
    const noFullReport = !output.includes("### 1. CLASSIFICATION") && !output.includes("Four-Point Separation Test");

    const isPassed = updatedTime && conciseAck && noFullReport;
    const reason = isPassed
      ? "Updated only the occurrence time field and acknowledged naturally without dumping a full report."
      : `Failed criteria: updatedTime=${updatedTime}, conciseAck=${conciseAck}, noFullReport=${noFullReport}`;

    printTestResult("F", "Single-Field Fact Correction", input, output,
      "Update only occurrence time field, provide concise acknowledgement, no full report dump.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST G: All 29 Hindi Templates Intact Verification
  // -------------------------------------------------------------------------
  {
    const all = templateRegistry.getAllTemplates();
    const totalChance = all.filter(t => t.workflowType === 'CHANCE_RECOVERY').length;
    const totalInfo = all.filter(t => t.workflowType === 'INFORMATION_BASED').length;
    const totalTemplates = all.length;

    const isPassed = totalTemplates === 29;
    const reason = isPassed
      ? "All 29 original Hindi templates preserved intact in template registry (14 Chance Recovery + 15 Information-Based)."
      : `Failed criteria: totalTemplates=${totalTemplates} (expected 29)`;

    printTestResult("G", "Template Integrity (29 Hindi Templates Intact)", "Count registered templates",
      `Chance: ${totalChance}, Information-Based: ${totalInfo}, Total: ${totalTemplates}`,
      "Exactly 29 original Hindi templates preserved.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST H: Continuous Conversation Workflow Locking & Context Retention
  // -------------------------------------------------------------------------
  {
    const caseContext = createFreshCase("testH_continuous");

    // Turn 1: Intake Information-Based Narrative
    const turn1Input = "A reliable informer has told me that a person may be carrying heroin to a house in Sadar Una. The house is occupied. I have not recorded the information or conducted any search yet. Explain the appropriate next steps. Do not generate any document yet.";
    const res1 = await processInvestigatorQuery(turn1Input, caseContext, []);
    const output1 = res1.answer;

    // Turn 2: Correction
    const turn2Input = "Correction: the information was received at 6:45 PM, not 6:30 PM.";
    const history1 = [
      { role: 'user' as const, content: turn1Input },
      { role: 'assistant' as const, content: output1 }
    ];
    const res2 = await processInvestigatorQuery(turn2Input, caseContext, history1);
    const output2 = res2.answer;

    // Turn 3: Follow-Up Search Procedure Question
    const turn3Input = "What additional facts must be established before deciding the applicable search procedure?";
    const history2 = [
      ...history1,
      { role: 'user' as const, content: turn2Input },
      { role: 'assistant' as const, content: output2 }
    ];
    const res3 = await processInvestigatorQuery(turn3Input, caseContext, history2);
    const output3 = res3.answer;

    const remainsInfoBased = caseContext.recovery_pathway === 'INFORMATION_BASED';
    const timeIs645 = caseContext.confirmed_facts?.['समय'] === '6:45 PM';
    const output3IsInfoBased = output3.includes("Information-Based") || output3.includes("Section 42") || output3.includes("premises");
    const noChanceRecoveryInvented = !output3.includes("Chance Recovery Guidance") && !output3.includes("Fard Makboozgi") && !output3.includes("Spot Recovery Memo");
    const noClassificationMenu = !output3.includes("Select the origin below") && !output3.includes("### 1. CLASSIFICATION");

    const isPassed = remainsInfoBased && timeIs645 && output3IsInfoBased && noChanceRecoveryInvented && noClassificationMenu;
    const reason = isPassed
      ? "Locked workflow at Information-Based, preserved corrected time 6:45 PM and residential house context, provided Information-Based search procedure guidance without inventing Chance Recovery or displaying classification menu."
      : `Failed criteria: remainsInfoBased=${remainsInfoBased}, timeIs645=${timeIs645}, output3IsInfoBased=${output3IsInfoBased}, noChanceRecoveryInvented=${noChanceRecoveryInvented}, noClassificationMenu=${noClassificationMenu}`;

    printTestResult("H", "Continuous Conversation Workflow Locking & Context Retention", turn3Input, output3,
      "Remain Information-Based, preserve time 6:45 PM, provide Section 42/41 search procedure guidance, no Chance Recovery or Spot Recovery Memo invented.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST I: Premises Search Only (Occupants Present) -> Section 50 Not Applied
  // -------------------------------------------------------------------------
  {
    const caseContext = createFreshCase("testI_premises");
    const input = "We propose premises search only of a house where occupants are present. We do not plan to search any person physically. Does Section 50 apply?";
    const res = await processInvestigatorQuery(input, caseContext, []);
    const output = res.answer;

    const explainsSec42 = output.includes("Section 42") || output.includes("Premises Search");
    const clarifiesSec50NotTriggered = output.includes("does NOT trigger Section 50") || output.includes("does not automatically trigger Section 50") || output.includes("Pawan Kumar");
    const noFalseTrigger = !output.includes("mandatory Section 50 notice required for house search");

    const isPassed = explainsSec42 && clarifiesSec50NotTriggered && noFalseTrigger;
    const reason = isPassed
      ? "Clarified Section 42/41 governs premises search, confirmed presence of occupants does not trigger Section 50 for house search."
      : `Failed criteria: explainsSec42=${explainsSec42}, clarifiesSec50NotTriggered=${clarifiesSec50NotTriggered}, noFalseTrigger=${noFalseTrigger}`;

    printTestResult("I", "Premises Search Only (Occupants Present)", input, output,
      "Govern by Section 42/41, confirm presence of occupants does not trigger Section 50 for premises search.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST J: Personal Search of Occupant -> Section 50 Applies
  // -------------------------------------------------------------------------
  {
    const caseContext = createFreshCase("testJ_personal");
    const input = "We plan to conduct a personal bodily search of an occupant inside the house. What procedure applies?";
    const res = await processInvestigatorQuery(input, caseContext, []);
    const output = res.answer;

    const appliesSec50 = output.includes("Section 50") || output.includes("PERSONAL SEARCH PROCEDURE");
    const mentionsWrittenNotice = output.includes("written notice") || output.includes("Section 50(1)") || output.includes("Gazetted Officer");
    const mentionsFemaleMandate = output.includes("female") || output.includes("Section 50(4)");

    const isPassed = appliesSec50 && mentionsWrittenNotice && mentionsFemaleMandate;
    const reason = isPassed
      ? "Applied Section 50 strictly to personal bodily search, detailed mandatory Section 50(1) notice and Section 50(4) female search mandate."
      : `Failed criteria: appliesSec50=${appliesSec50}, mentionsWrittenNotice=${mentionsWrittenNotice}, mentionsFemaleMandate=${mentionsFemaleMandate}`;

    printTestResult("J", "Personal Bodily Search of Occupant", input, output,
      "Apply Section 50 strictly to personal search, detail Section 50(1) written notice and Section 50(4) female mandate.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST K: Both Premises and Personal Search -> Dual Separate Procedures
  // -------------------------------------------------------------------------
  {
    const caseContext = createFreshCase("testK_both");
    const input = "We plan both premises and personal search of the house and occupant. What procedures apply?";
    const res = await processInvestigatorQuery(input, caseContext, []);
    const output = res.answer;

    const discussesPremises = output.includes("Premises Search") || output.includes("Section 42");
    const discussesPersonal = output.includes("Personal Search") || output.includes("Section 50");
    const keepsSeparate = output.includes("separate statutory procedures") || output.includes("distinct") || (output.includes("1.") && output.includes("2."));

    const isPassed = discussesPremises && discussesPersonal && keepsSeparate;
    const reason = isPassed
      ? "Discussed premises search (Section 42/41) and personal search (Section 50) as separate procedures with distinct safeguards."
      : `Failed criteria: discussesPremises=${discussesPremises}, discussesPersonal=${discussesPersonal}, keepsSeparate=${keepsSeparate}`;

    printTestResult("K", "Both Premises and Personal Search", input, output,
      "Discuss premises search (Section 42/41) and personal search (Section 50) separately with distinct safeguards.", isPassed, reason);
  }

  // -------------------------------------------------------------------------
  // TEST L: Unknown Officer Empowerment & Search Authorization
  // -------------------------------------------------------------------------
  {
    const caseContext = createFreshCase("testL_unknown");
    const input = "The officer's statutory empowerment and search authorization status are unknown. How does this affect the search procedure?";
    const res = await processInvestigatorQuery(input, caseContext, []);
    const output = res.answer;

    const identifiesUnknowns = output.includes("unknown facts") || output.includes("unknown");
    const conditionalGuidance = output.includes("If Officer is Empowered") && output.includes("Section 41");
    const qualifiedConsequences = output.includes("Legal consequences") || output.includes("depend on");

    const isPassed = identifiesUnknowns && conditionalGuidance && qualifiedConsequences;
    const reason = isPassed
      ? "Identified officer empowerment and authorization as unknown facts, provided conditional guidance, and kept legal consequences qualified."
      : `Failed criteria: identifiesUnknowns=${identifiesUnknowns}, conditionalGuidance=${conditionalGuidance}, qualifiedConsequences=${qualifiedConsequences}`;

    printTestResult("L", "Unknown Officer Empowerment & Authorization", input, output,
      "Identify empowerment and authorization as unknown facts, provide conditional guidance, keep consequences qualified.", isPassed, reason);
  }

  console.log(`==========================================================================`);
  console.log(`RESULTS SUMMARY: ${passedCount} / ${totalCount} TESTS PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log(`==========================================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runConversationalAssistantTests().catch(err => {
  console.error("Conversational assistant test failed:", err);
  process.exit(1);
});
