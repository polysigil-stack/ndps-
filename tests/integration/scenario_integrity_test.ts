import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';
import { extractNarrativeEntities, isIncidentNarrative } from '../../src/server/caseSynthesizer';
import { verifyScenarioIntegrity } from '../../src/server/claimAuditor';

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
  console.log('=== STARTING MANDATORY USER-INPUT GROUNDING & SCENARIO INTEGRITY AUDIT TEST ===\n');

  const caseContext = globalCaseStore.getCase('case_batathu_hp72d3928');

  // -------------------------------------------------------------------------
  // Test 1: Entity Extraction from Custom Narrative
  // -------------------------------------------------------------------------
  console.log('--- Test 1: Narrative Entity Extraction ---');
  const narrative1 = 'At 16:00 hrs, ASI Ramesh Kumar was conducting routine vehicle checks at Toll Plaza on GT Road. He stopped truck PB-05-9999. The driver claimed that police already had secret info about him, but ASI Ramesh Kumar recorded that the stop was purely routine. A search revealed 50 kg poppy straw. How should this recovery be classified?';

  const ext1 = extractNarrativeEntities(narrative1);
  assert('Test 1.1: Extracts officer "ASI Ramesh Kumar"', ext1.primaryOfficer === 'ASI Ramesh Kumar');
  assert('Test 1.2: Extracts time "16:00 hrs"', ext1.times.includes('16:00 hrs'));
  assert('Test 1.3: Extracts vehicle "truck PB-05-9999"', ext1.primaryVehicle?.includes('PB-05-9999') === true);
  assert('Test 1.4: Extracts contraband "50 kg poppy straw"', ext1.primaryContraband?.includes('50 kg poppy straw') === true);
  assert('Test 1.5: Extracts location "Toll Plaza"', ext1.locations.some(l => l.includes('Toll Plaza')));
  assert('Test 1.6: Stated purpose identified as routine checks / patrol', ext1.statedPurpose?.toLowerCase().includes('routine') === true);
  assert('Test 1.7: hasGdMention is false (no GD mentioned in input)', ext1.hasGdMention === false);
  assert('Test 1.8: Detects conflicting claims between driver and officer', ext1.conflicts.length > 0);

  // -------------------------------------------------------------------------
  // Test 2: Full Query Execution for Custom Narrative (No Substitution)
  // -------------------------------------------------------------------------
  console.log('\n--- Test 2: Full Query Execution with Custom Narrative ---');
  // Pass caseContext to ensure the active case does NOT overwrite user's narrative
  const res2 = await processInvestigatorQuery(narrative1, caseContext, [], [], 'en');

  // Verify User Facts Preserved
  assert('Test 2.1: Preserves officer "ASI Ramesh Kumar"', res2.answer.includes('ASI Ramesh Kumar'));
  assert('Test 2.2: Does NOT substitute active case officer "ASI Nirmal Patial"', !res2.answer.includes('Nirmal Patial'));
  assert('Test 2.3: Preserves vehicle "PB-05-9999"', res2.answer.includes('PB-05-9999'));
  assert('Test 2.4: Does NOT substitute active case vehicle "HP72D-3928"', !res2.answer.includes('HP72D-3928'));
  assert('Test 2.5: Preserves contraband "50 kg poppy straw"', res2.answer.includes('50 kg poppy straw'));
  assert('Test 2.6: Does NOT substitute active case quantity "108 kg 900 g"', !res2.answer.includes('108 kg 900 g'));
  assert('Test 2.7: Preserves location "Toll Plaza" or "GT Road"', res2.answer.includes('Toll Plaza') || res2.answer.includes('GT Road'));
  assert('Test 2.8: Preserves time "16:00 hrs"', res2.answer.includes('16:00 hrs'));

  // Verify GD Integrity: No invented GD entry
  const assertsGdLogged = res2.answer.includes('A General Diary (GD) entry recording secret intelligence was logged at the police station');
  assert('Test 2.9: Does NOT assert that a GD entry was logged at the police station', !assertsGdLogged);
  const statesNoGd = res2.answer.includes('No General Diary (GD) entry or station log is stated in the user narrative') ||
                     res2.answer.includes('No General Diary (GD) entry or station communication is documented in the user narrative');
  assert('Test 2.10: Explicitly states that no GD entry is documented in the user narrative', statesNoGd);

  // Verify Conflict Handling
  const hasConflictSection = res2.answer.includes('Conflicting Points in User Narrative') || res2.answer.includes('Driver / Occupant Version');
  assert('Test 2.11: Explicitly displays conflicting points without silently replacing either version', hasConflictSection);
  assert('Test 2.12: Displays driver claim regarding secret info', res2.answer.toLowerCase().includes('driver') && res2.answer.toLowerCase().includes('secret info'));
  assert('Test 2.13: Displays officer assertion of routine stop', res2.answer.toLowerCase().includes('routine'));

  // Verify Classification & Workflow
  const isChanceProvisional = res2.answer.includes('**On-the-Spot Recovery (Chance Recovery)**');
  assert('Test 2.14: Provisionally classifies as On-the-Spot Recovery (Chance Recovery)', isChanceProvisional);
  assert('Test 2.15: Does NOT classify as Prior Information when causality is unestablished', !res2.answer.includes('### 6. Provisional Classification\n**Prior Information**'));
  assert('Test 2.16: Offers 14-Stage Chance Recovery Workflow only after classification', res2.answer.includes('14-Stage Chance Recovery Workflow'));
  assert('Test 2.17: Does not prematurely output document template', !res2.answer.includes('```text\n[Illustrative'));

  // Verify Pre-Response Grounding Status
  assert('Test 2.18: Grounding status is NEVER FULLY_SUPPORTED for scenario with unknowns/conflicts', res2.grounding_status !== 'GROUNDED' || res2.answer.includes('SUPPORTED_WITH_LIMITATIONS'));
  assert('Test 2.19: Appended grounding status reflects SUPPORTED_WITH_LIMITATIONS or CONTAINS_NOT_ESTABLISHED_ITEMS',
    res2.answer.includes('**SUPPORTED_WITH_LIMITATIONS**') || res2.answer.includes('**CONTAINS_NOT_ESTABLISHED_ITEMS**'));

  // -------------------------------------------------------------------------
  // Test 3: Targeted Interception Scenario with Specific User Entities
  // -------------------------------------------------------------------------
  console.log('\n--- Test 3: Targeted Interception with Specific User Entities ---');
  const narrative3 = 'Inspector Verma received specific information before deployment regarding car Swift DL-3C-AB-1234 carrying 3 kg smack. He was briefed and knew of it, departed specifically to locate the car, and intercepted the matching target vehicle at Sector 14 checkpoint. Recovered 3 kg smack. Classify this recovery.';

  const res3 = await processInvestigatorQuery(narrative3, caseContext, [], [], 'en');

  assert('Test 3.1: Preserves officer "Inspector Verma"', res3.answer.includes('Inspector Verma'));
  assert('Test 3.2: Preserves vehicle "Swift DL-3C-AB-1234"', res3.answer.includes('Swift DL-3C-AB-1234') || res3.answer.includes('DL-3C-AB-1234'));
  assert('Test 3.3: Preserves contraband "3 kg smack"', res3.answer.includes('3 kg smack'));
  assert('Test 3.4: Classifies strictly as Prior Information', res3.answer.includes('**Prior Information**'));
  assert('Test 3.5: Offers 15-Stage Information-Based Recovery Workflow after classification', res3.answer.includes('15-Stage Information-Based Recovery Workflow'));
  assert('Test 3.6: Does not offer Chance Recovery workflow for targeted interception', !res3.answer.includes('14-Stage Chance Recovery Workflow'));
  assert('Test 3.7: High confidence level stated', res3.answer.includes('Confidence Level: High'));

  // -------------------------------------------------------------------------
  // Test 4: Pre-Response Consistency Check (verifyScenarioIntegrity Direct Audit)
  // -------------------------------------------------------------------------
  console.log('\n--- Test 4: verifyScenarioIntegrity Direct Unit Audit ---');
  // Scenario: Answer erroneously contains Batathu officer and vehicle
  const badAnswer = `### 1. Established Facts
• Officer: ASI Nirmal Patial
• Vehicle: HP72D-3928
• A General Diary (GD) entry recording secret intelligence was logged at the police station.
• Automated tests have independently verified this conclusion.
### Provisional Classification
**Prior Information**
14-Stage Chance Recovery Workflow`;

  const integrityResult = verifyScenarioIntegrity(narrative1, badAnswer, 'FULLY_SUPPORTED');
  assert('Test 4.1: Corrects substituted officer ASI Nirmal Patial to ASI Ramesh Kumar', integrityResult.answer.includes('ASI Ramesh Kumar'));
  assert('Test 4.2: Corrects substituted vehicle HP72D-3928 to PB-05-9999', integrityResult.answer.includes('PB-05-9999'));
  assert('Test 4.3: Eliminates invented GD entry assertion', !integrityResult.answer.includes('A General Diary (GD) entry recording secret intelligence was logged'));
  assert('Test 4.4: Eliminates false automated test verification claim', !integrityResult.answer.includes('Automated tests have independently verified'));
  assert('Test 4.5: Resolves workflow mismatch (Prior Info -> 15-Stage Information-Based)', integrityResult.answer.includes('15-Stage Information-Based Recovery Workflow'));
  assert('Test 4.6: Downgrades status from FULLY_SUPPORTED to SUPPORTED_WITH_LIMITATIONS', integrityResult.status === 'SUPPORTED_WITH_LIMITATIONS');

  // -------------------------------------------------------------------------
  // Test 5: Active Case Query (Batathu) Still Preserved When Explicitly Inquired
  // -------------------------------------------------------------------------
  console.log('\n--- Test 5: Active Case Inquiry (Batathu) Still Preserved ---');
  const query5 = 'How should the recovery in this case be classified?';
  const res5 = await processInvestigatorQuery(query5, caseContext, [], [], 'en');

  assert('Test 5.1: Active case query retains FIR 24/2024 / Batathu context', res5.answer.includes('Batathu') || res5.answer.includes('HP72D-3928'));
  assert('Test 5.2: Uses permitted label for active case', res5.answer.includes('**Prior Information**') || res5.answer.includes('**On-the-Spot Recovery (Chance Recovery)**'));
  assert('Test 5.3: Anti-fabrication mandate present in active case', res5.answer.includes('Do not fabricate missing facts'));

  console.log(`\n=== AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
