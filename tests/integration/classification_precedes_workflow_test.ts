import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';
import { isIncidentNarrative, isTargetedInterceptionScenario } from '../../src/server/caseSynthesizer';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`PASS: ${description}`);
    passed++;
  } else {
    console.error(`FAIL: ${description}`);
    if (details) console.error(`   Details: ${details}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== STARTING CLASSIFICATION PRECEDES WORKFLOW ACTIVATION AUDIT TEST ===\n');

  const caseContext = globalCaseStore.getCase('case_batathu_hp72d3928');

  // Test 1: Helper function verification
  console.log('--- Test 1: Detection Helpers ---');
  const narrative1 = 'At 10:00 hrs secret information was received, team departed and intercepted truck HP-12-1234, 5 kg charas recovered. Give me the seizure memo template.';
  assert('Test 1.1: isIncidentNarrative correctly identifies incident narrative with template request', isIncidentNarrative(narrative1));

  const abstract1 = 'What is Section 50?';
  assert('Test 1.2: isIncidentNarrative returns false for abstract legal question', !isIncidentNarrative(abstract1));

  const pureTemplate = 'Show me the seizure memo template';
  assert('Test 1.3: isIncidentNarrative returns false for pure template request without scenario facts', !isIncidentNarrative(pureTemplate));

  const targetedNarrative = 'Specific information was received before deployment, the officer knew of it, the officer departed specifically to locate the target, and the matching target was intercepted.';
  assert('Test 1.4: isTargetedInterceptionScenario returns true for 4-point targeted scenario', isTargetedInterceptionScenario(targetedNarrative));

  // Test 2: Targeted Interception Scenario
  console.log('\n--- Test 2: Targeted Interception Scenario (Prior Information Mandate) ---');
  const query2 = 'Specific information was received before deployment, the officer knew of it, the officer departed specifically to locate the target, and the matching target was intercepted. Recovered 2 kg heroin. Give me the seizure memo.';
  const res2 = await processInvestigatorQuery(query2, null, [], [], 'en');

  // Rule: Provisional classification MUST be "Prior Information"
  const hasPriorInfo2 = res2.answer.includes('**Prior Information**');
  assert('Test 2.1: Targeted interception classified strictly as Prior Information', hasPriorInfo2);

  const noChanceRecoveryLabel2 = !res2.answer.includes('### 3. Provisional Classification\n**On-the-Spot Recovery (Chance Recovery)**');
  assert('Test 2.2: Does not label targeted interception as On-the-Spot Recovery', noChanceRecoveryLabel2);

  // Rule: Extracts facts and builds chronology
  const hasChronology2 = res2.answer.includes('Chronology') || res2.answer.includes('chronology');
  assert('Test 2.3: Chronology built from facts', hasChronology2);

  // Rule: Applies four-point separation test
  const hasFourPoint2 =
    res2.answer.includes('Four-Point Separation Test') &&
    res2.answer.includes('Prior information existed') &&
    res2.answer.includes('Field team knew of it') &&
    res2.answer.includes('Materially prompted or shaped the interception/search') &&
    res2.answer.includes('Original purpose and sequence established');
  assert('Test 2.4: Four-point separation test fully articulated', hasFourPoint2);

  // Rule: States confidence level
  const hasConfidence2 = res2.answer.includes('Confidence Level') && res2.answer.includes('High');
  assert('Test 2.5: High confidence level stated with rationale', hasConfidence2);

  // Rule: Classification must precede workflow activation — no template code blocks generated prematurely
  const hasNoTemplateCodeBlock2 = !res2.answer.includes('```text\n[Illustrative Seizure Memo');
  assert('Test 2.6: Does not prematurely output document template', hasNoTemplateCodeBlock2);

  // Rule: Offers corresponding document workflow (15-stage Information-Based) ONLY after classification
  const offersInfoWorkflow2 = res2.answer.includes('15-Stage Information-Based Recovery Workflow') || res2.answer.includes('Information-Based Recovery Workflow');
  assert('Test 2.7: Offers 15-Stage Information-Based Recovery Workflow after classification', offersInfoWorkflow2);

  // Rule: Anti-Fabrication mandate
  const hasNoFabrication2 = res2.answer.includes('Do not fabricate missing facts or populate legal documents with assumed details');
  assert('Test 2.8: Anti-fabrication mandate present ("Do not fabricate missing facts...")', hasNoFabrication2);

  // Test 3: Workflow Correction on Incorrect Activation
  console.log('\n--- Test 3: Workflow Correction on Incorrect Activation ---');
  const query3 = 'We are in Chance Recovery workflow. Here are the facts: specific information was received before deployment, officer knew of it, departed specifically to locate the target truck HP-12-9999, and the matching target was intercepted with 10 kg charas. Generate the first document.';
  const res3 = await processInvestigatorQuery(query3, null, [], [], 'en');

  // Rule: Corrects classification first
  const correctsClassification3 = res3.answer.includes('**Prior Information**');
  assert('Test 3.1: Corrects classification to Prior Information', correctsClassification3);

  // Rule: Explains workflow activation correction
  const hasWorkflowCorrectionNotice3 =
    res3.answer.includes('Workflow Activation Correction') ||
    res3.answer.includes('Classification Must Precede Workflow Activation');
  assert('Test 3.2: Contains Workflow Activation Correction notice', hasWorkflowCorrectionNotice3);

  const haltsDocumentGeneration3 =
    res3.answer.includes('do not proceed to document generation until the classification is resolved') ||
    res3.answer.includes('halted and corrected');
  assert('Test 3.3: States document generation is halted until classification is resolved', haltsDocumentGeneration3);

  // Test 4: Legal Provision Query within Narrative (e.g., Section 50)
  console.log('\n--- Test 4: Legal Provision (Section 50) within Incident Narrative ---');
  const query4 = 'Specific information was received before deployment, the officer knew of it, departed specifically to locate the target car, and intercepted the matching target with 500g smack. Is Section 50 notice required and what is the first document?';
  const res4 = await processInvestigatorQuery(query4, null, [], [], 'en');

  // Rule: Does NOT activate Chance Recovery workflow merely because user asked about a related legal provision
  const noChanceDefault4 = !res4.answer.includes('### 3. Provisional Classification\n**On-the-Spot Recovery (Chance Recovery)**');
  assert('Test 4.1: Does not activate Chance Recovery merely because Section 50 was asked', noChanceDefault4);

  const hasPriorInfo4 = res4.answer.includes('**Prior Information**');
  assert('Test 4.2: Classifies provisionally as Prior Information', hasPriorInfo4);

  // Rule: Answers Section 50 accurately (applies strictly to search of person, not vehicle)
  const answersSection50_4 =
    res4.answer.includes('Section 50') &&
    (res4.answer.includes('search of the physical person') || res4.answer.includes('body'));
  assert('Test 4.3: Accurately explains Section 50 applies to personal search of body', answersSection50_4);

  // Test 5: Routine Patrol / Chance Recovery Narrative
  console.log('\n--- Test 5: Routine Patrol / Chance Recovery Narrative ---');
  const query5 = 'During routine patrolling near bus stand at 22:00 hrs, police stopped a suspicious person carrying a bag, searched him and found 1 kg opium. What document should we make?';
  const res5 = await processInvestigatorQuery(query5, null, [], [], 'en');

  // Rule: Provisional classification is strictly "On-the-Spot Recovery (Chance Recovery)"
  const hasOnTheSpot5 = res5.answer.includes('**On-the-Spot Recovery (Chance Recovery)**');
  assert('Test 5.1: Routine patrol recovery classified as On-the-Spot Recovery (Chance Recovery)', hasOnTheSpot5);

  // Rule: Explains provisional classification may change if reliable evidence establishes prior info
  const explainsChange5 =
    res5.answer.includes('may change') &&
    res5.answer.includes('Prior Information');
  assert('Test 5.2: Explains provisional classification may change if reliable evidence shows prior info', explainsChange5);

  // Rule: Four-point separation test shows points 1-3 not established for targeted search
  const hasFourPoint5 = res5.answer.includes('Four-Point Separation Test');
  assert('Test 5.3: Four-point separation test evaluated for routine patrol', hasFourPoint5);

  // Rule: Identifies specific resolving evidence
  const hasResolvingEvidence5 =
    res5.answer.includes('Original time-stamped communication logs') &&
    res5.answer.includes('Contemporaneous patrol records') &&
    res5.answer.includes("Officer's recorded reason for the stop");
  assert('Test 5.4: Identifies original communication logs, patrol records, and stop reason', hasResolvingEvidence5);

  // Rule: Anti-fabrication mandate
  const hasAntiFabrication5 = res5.answer.includes('Do not fabricate missing facts or populate legal documents with assumed details');
  assert('Test 5.5: Anti-fabrication mandate present on Chance Recovery narrative', hasAntiFabrication5);

  // Rule: Offers 14-Stage Chance Recovery workflow ONLY after completing classification
  const offersChanceWorkflow5 = res5.answer.includes('14-Stage Chance Recovery Workflow') || res5.answer.includes('Chance Recovery Workflow');
  assert('Test 5.6: Offers 14-Stage Chance Recovery Workflow only after classification', offersChanceWorkflow5);

  // Test 6: Active Case Batathu (HP72D-3928)
  console.log('\n--- Test 6: Active Case Batathu Classification Precedence ---');
  const query6 = 'How should the recovery in this case be classified and can we generate the seizure memo?';
  const res6 = await processInvestigatorQuery(query6, caseContext, [], [], 'en');

  const hasPermittedLabel6 = res6.answer.includes('**Prior Information**') || res6.answer.includes('**On-the-Spot Recovery (Chance Recovery)**');
  assert('Test 6.1: Active case uses permitted classification label', hasPermittedLabel6);

  const hasFourPoint6 = res6.answer.includes('Four-Point Separation Test');
  assert('Test 6.2: Four-point separation test applied to active case', hasFourPoint6);

  const hasPrecedenceNotice6 = res6.answer.includes('Classification Must Precede Workflow Activation');
  assert('Test 6.3: Classification Must Precede Workflow Activation notice present', hasPrecedenceNotice6);

  const hasAntiFabrication6 = res6.answer.includes('Do not fabricate missing facts or populate legal documents with assumed details');
  assert('Test 6.4: Anti-fabrication mandate present in active case response', hasAntiFabrication6);

  console.log(`\n=== AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
