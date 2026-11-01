import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';
import { auditProvisionalClassification } from '../../src/server/claimAuditor';
import { synthesizeRecoveryClassification } from '../../src/server/caseSynthesizer';

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
  console.log('=== STARTING PROVISIONAL CLASSIFICATION AUDIT TEST ===\n');

  const caseContext = globalCaseStore.getCase('case_batathu_hp72d3928');

  // Test 1: Active Case Classification Query
  console.log('--- Test 1: Active Case Classification ---');
  const query1 = 'Classify the recovery in this case based on the available records';
  const res1 = await processInvestigatorQuery(query1, caseContext, [], [], 'en');

  // Rule 6: Two permitted labels only
  const hasPermittedLabel1 =
    res1.answer.includes('**Prior Information**') ||
    res1.answer.includes('**On-the-Spot Recovery (Chance Recovery)**');
  assert('Test 1.1: Uses permitted label', hasPermittedLabel1);

  const hasNoThirdCategory1 =
    !res1.answer.toLowerCase().includes('category: mixed') &&
    !res1.answer.toLowerCase().includes('category: disputed') &&
    !res1.answer.toLowerCase().includes('category: insufficient evidence') &&
    !res1.answer.toLowerCase().includes('category: undetermined');
  assert('Test 1.2: No third classification category introduced', hasNoThirdCategory1);

  // Rule 1: Provisional classification distinguished from definitive finding
  const hasDistinction1 =
    res1.answer.toLowerCase().includes('provisional classification based on available evidence') ||
    res1.answer.toLowerCase().includes('provisional classification based on currently available') ||
    res1.answer.toLowerCase().includes('not a definitive finding about what actually occurred');
  assert('Test 1.3: Clearly distinguishes provisional classification from definitive factual finding', hasDistinction1);

  // Rule 2: Does not equate not established with did not exist
  const hasRule2_1 =
    res1.answer.toLowerCase().includes('must not be equated with a finding that prior knowledge or causation did not exist') ||
    res1.answer.toLowerCase().includes('does not equate to a finding that prior knowledge or causation did not exist');
  assert('Test 1.4: Does not equate "not established by records" with "did not exist"', hasRule2_1);

  // Rule 3: Does not treat later-recorded transmission as conclusive proof that no earlier communication occurred
  const hasRule3_1 =
    res1.answer.toLowerCase().includes('cannot be treated as conclusive proof that no earlier communication occurred');
  assert('Test 1.5: Does not treat later transmission as proof that no earlier communication occurred', hasRule3_1);

  // Rule 5: Specific resolving evidence identified
  const hasCommLogs1 = res1.answer.toLowerCase().includes('original time-stamped communication logs');
  const hasPatrolRecords1 = res1.answer.toLowerCase().includes('contemporaneous patrol records');
  const hasReasonForStop1 = res1.answer.toLowerCase().includes("officer's recorded reason for the stop");
  assert('Test 1.6: Identifies original time-stamped communication logs', hasCommLogs1);
  assert('Test 1.7: Identifies contemporaneous patrol records', hasPatrolRecords1);
  assert('Test 1.8: Identifies officer\'s recorded reason for the stop', hasReasonForStop1);

  // Rule 7: Record integrity mandate
  const hasIntegrity1 =
    res1.answer.toLowerCase().includes('never recommend creating, altering, backdating, concealing, or destroying records') ||
    res1.answer.toLowerCase().includes('preserve and verify existing records') ||
    res1.answer.toLowerCase().includes('preserve and verify existing contemporaneous records');
  assert('Test 1.9: Does not recommend altering/backdating; recommends preserving existing records', hasIntegrity1);

  // Test 2: Incomplete Records Scenario (Patrol stop at 10:00, GD entry at 10:15, no prior transmission log)
  console.log('\n--- Test 2: Incomplete Records Scenario (Provisional On-the-Spot Recovery) ---');
  const query2 = 'A vehicle was stopped by a patrolling team at 10:00 AM. At 10:15 AM, a GD entry recorded secret info. No transmission log shows the patrol team received the info before 10:00 AM. Classify this recovery.';
  const res2 = await processInvestigatorQuery(query2, null, [], [], 'en');

  // Rule 6: Label is On-the-Spot Recovery (Chance Recovery)
  const isOnTheSpot2 = res2.answer.includes('On-the-Spot Recovery (Chance Recovery)');
  assert('Test 2.1: Label is strictly On-the-Spot Recovery (Chance Recovery)', isOnTheSpot2);

  // Rule 4: Explains classification may change if reliable evidence establishes prior info materially prompted interception
  const hasChangeExplanation2 =
    res2.answer.toLowerCase().includes('may change if reliable evidence establishes that prior information') ||
    res2.answer.toLowerCase().includes('may change to **prior information** if reliable') ||
    res2.answer.toLowerCase().includes('classification may change if reliable evidence');
  assert('Test 2.2: Explains provisional classification may change if reliable evidence establishes prior info prompted stop', hasChangeExplanation2);

  // Rule 1: Provisional vs factual finding
  const hasDistinction2 =
    res2.answer.toLowerCase().includes('provisional classification based on available evidence') ||
    res2.answer.toLowerCase().includes('not a definitive finding about what actually occurred');
  assert('Test 2.3: Clearly distinguishes provisional classification from factual finding', hasDistinction2);

  // Rule 2 & 3 in scenario
  const hasRule2_2 = res2.answer.toLowerCase().includes('must not be equated with a finding that prior knowledge or causation did not exist') ||
    res2.answer.toLowerCase().includes('does not equate to a finding that prior knowledge or causation did not exist');
  assert('Test 2.4: Does not equate missing transmission proof with non-existence of prior info', hasRule2_2);

  const hasRule3_2 = res2.answer.toLowerCase().includes('cannot be treated as conclusive proof that no earlier communication occurred');
  assert('Test 2.5: Later transmission not treated as conclusive proof of no earlier communication', hasRule3_2);

  // Rule 5: Resolving evidence in scenario
  assert('Test 2.6: Identifies original time-stamped communication logs', res2.answer.toLowerCase().includes('original time-stamped communication logs'));
  assert('Test 2.7: Identifies contemporaneous patrol records', res2.answer.toLowerCase().includes('contemporaneous patrol records'));
  assert('Test 2.8: Identifies officer\'s recorded reason for the stop', res2.answer.toLowerCase().includes("officer's recorded reason for the stop"));

  // Rule 7: Record integrity in scenario
  assert('Test 2.9: Recommends preserving/verifying existing records without backdating',
    res2.answer.toLowerCase().includes('never recommend creating, altering, backdating, concealing, or destroying records') ||
    res2.answer.toLowerCase().includes('preserve and verify existing contemporaneous records')
  );

  // Test 3: Claim Auditor Hardening on Malformed Input
  console.log('\n--- Test 3: Claim Auditor Direct Hardening ---');
  const malformedInput = `### 5. Provisional Classification
Mixed Circumstances (Third Category)

The officer states there was no prior information. This proves that prior knowledge did not exist.
Furthermore, the later-recorded transmission proves that no earlier communication occurred.
Recommendation: IO should backdate the General Diary entry to 09:30 AM to fix the record.`;

  const audited = auditProvisionalClassification('classify this case', malformedInput);

  assert('Test 3.1: Prohibited category converted to permitted label',
    !audited.includes('Mixed Circumstances') && audited.includes('On-the-Spot Recovery (Chance Recovery)'));
  assert('Test 3.2: Equating non-existence corrected',
    !audited.includes('proves that prior knowledge did not exist') && audited.includes('must NOT be equated with a finding that prior knowledge or causation did not exist'));
  assert('Test 3.3: Conclusive proof of no earlier communication corrected',
    !audited.includes('proves that no earlier communication occurred') && audited.includes('cannot be treated as conclusive proof that no earlier communication occurred'));
  assert('Test 3.4: Backdating recommendation eliminated',
    !audited.includes('backdate the General Diary') && audited.includes('without alteration or backdating'));
  assert('Test 3.5: Preserving and verifying records mandate appended',
    audited.toLowerCase().includes('preserve and verify existing'));

  console.log(`\n=== AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
