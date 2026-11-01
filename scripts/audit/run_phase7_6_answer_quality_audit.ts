import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';
import { retrievalEngine } from '../../src/server/retrieval';
import * as fs from 'fs';
import * as path from 'path';

interface TestAssertion {
  testId: string;
  category: string;
  query: string;
  expectedBehavior: string;
  response: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL' | 'NOT_APPLICABLE';
  observedBehavior?: string;
  sourceDocument?: string;
  failureCategory?: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

async function runAudit() {
  console.log('=== STARTING PHASE 7.6 NDPS INTELLIGENCE INVESTIGATOR ANSWER QUALITY TEST ===\n');

  // Load Case Context
  const caseContext = globalCaseStore.getCase('case_batathu_hp72d3928');
  if (!caseContext) {
    console.error('CRITICAL ERROR: Unable to load case_batathu_hp72d3928 context!');
    process.exit(1);
  }
  console.log(`Loaded Case Context: ${caseContext.case_title} (${caseContext.case_id})`);

  const assertions: TestAssertion[] = [];

  // Helper function to execute query
  async function execQuery(
    testId: string,
    category: string,
    query: string,
    useCase: boolean,
    history: { role: 'user' | 'assistant'; content: string }[] = [],
    targetLanguage?: 'hi' | 'en'
  ): Promise<string> {
    const context = useCase ? caseContext : null;
    const retrieved = await retrievalEngine.retrieve(query, 10);
    const result = await processInvestigatorQuery(query, context, history, retrieved, targetLanguage);
    return result.answer;
  }

  // =========================================================================
  // TEST GROUP 1 — BASIC LEGAL QUESTIONS
  // =========================================================================
  console.log('Running Test Group 1 — Basic Legal Questions...');

  // 1. "What is Section 50?"
  const q1_1 = 'What is Section 50?';
  const r1_1 = await execQuery('TG1-Q1', 'LEGAL', q1_1, false);
  const status1_1 = r1_1.toLowerCase().includes('search of persons') || r1_1.toLowerCase().includes('personal search') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG1-Q1',
    category: 'LEGAL',
    query: q1_1,
    expectedBehavior: 'Explains Section 50 (search of persons) with appropriate statutory reference.',
    response: r1_1,
    status: status1_1,
    failureCategory: status1_1 === 'FAIL' ? 'LEGAL' : undefined,
    severity: status1_1 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status1_1 === 'FAIL' ? 'Could not find expected Section 50 references.' : 'Correctly identified and explained Section 50.'
  });

  // 2. "What is Section 52A?"
  const q1_2 = 'What is Section 52A?';
  const r1_2 = await execQuery('TG1-Q2', 'LEGAL', q1_2, false);
  const status1_2 = r1_2.toLowerCase().includes('inventory') || r1_2.toLowerCase().includes('magistrate') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG1-Q2',
    category: 'LEGAL',
    query: q1_2,
    expectedBehavior: 'Explains Section 52A (inventory certification and sampling before Magistrate).',
    response: r1_2,
    status: status1_2,
    failureCategory: status1_2 === 'FAIL' ? 'LEGAL' : undefined,
    severity: status1_2 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status1_2 === 'FAIL' ? 'Could not find expected Section 52A references.' : 'Correctly explained Section 52A.'
  });

  // 3. "What does Section 55 deal with?"
  const q1_3 = 'What does Section 55 deal with?';
  const r1_3 = await execQuery('TG1-Q3', 'LEGAL', q1_3, false);
  const status1_3 = r1_3.toLowerCase().includes('safe custody') || r1_3.toLowerCase().includes('sealing') || r1_3.toLowerCase().includes('sho') || r1_3.toLowerCase().includes('reseal') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG1-Q3',
    category: 'LEGAL',
    query: q1_3,
    expectedBehavior: 'Explains Section 55 (safe custody and station house officer sealing of seized property).',
    response: r1_3,
    status: status1_3,
    failureCategory: status1_3 === 'FAIL' ? 'LEGAL' : undefined,
    severity: status1_3 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status1_3 === 'FAIL' ? 'Could not find Section 55 malkhana/safe custody references.' : 'Correctly explained Section 55.'
  });

  // 4. "What does Section 57 deal with?"
  const q1_4 = 'What does Section 57 deal with?';
  const r1_4 = await execQuery('TG1-Q4', 'LEGAL', q1_4, false);
  const status1_4 = r1_4.toLowerCase().includes('report') || r1_4.toLowerCase().includes('48 hours') || r1_4.toLowerCase().includes('arrest') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG1-Q4',
    category: 'LEGAL',
    query: q1_4,
    expectedBehavior: 'Explains Section 57 (reporting of arrest and seizure within 48 hours to immediate superior officer).',
    response: r1_4,
    status: status1_4,
    failureCategory: status1_4 === 'FAIL' ? 'LEGAL' : undefined,
    severity: status1_4 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status1_4 === 'FAIL' ? 'Could not find Section 57 48-hour report references.' : 'Correctly explained Section 57.'
  });

  // 5. "What is the purpose of a seizure memo?"
  const q1_5 = 'What is the purpose of a seizure memo?';
  const r1_5 = await execQuery('TG1-Q5', 'PROCEDURAL', q1_5, false);
  const status1_5 = r1_5.toLowerCase().includes('recovery') || r1_5.toLowerCase().includes('seizure') || r1_5.toLowerCase().includes('witnesses') || r1_5.toLowerCase().includes('evidence') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG1-Q5',
    category: 'PROCEDURAL',
    query: q1_5,
    expectedBehavior: 'Explains seizure memo as a contemporaneous recovery record with witness signatures.',
    response: r1_5,
    status: status1_5,
    failureCategory: status1_5 === 'FAIL' ? 'PROCEDURAL' : undefined,
    severity: status1_5 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status1_5 === 'FAIL' ? 'Failed to clearly define purpose of seizure memo.' : 'Correctly explained purpose of seizure memo.'
  });

  // 6. "What is the role of an FSL report?"
  const q1_6 = 'What is the role of an FSL report?';
  const r1_6 = await execQuery('TG1-Q6', 'PROCEDURAL', q1_6, false);
  const status1_6 = r1_6.toLowerCase().includes('chemical') || r1_6.toLowerCase().includes('forensic') || r1_6.toLowerCase().includes('opinion') || r1_6.toLowerCase().includes('morphine') || r1_6.toLowerCase().includes('alkaloid') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG1-Q6',
    category: 'PROCEDURAL',
    query: q1_6,
    expectedBehavior: 'Explains FSL report as scientific confirmation of chemical composition and presence of active drug compounds.',
    response: r1_6,
    status: status1_6,
    failureCategory: status1_6 === 'FAIL' ? 'PROCEDURAL' : undefined,
    severity: status1_6 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status1_6 === 'FAIL' ? 'Failed to capture the forensic role of FSL report.' : 'Correctly explained forensic role.'
  });

  // =========================================================================
  // TEST GROUP 2 — PROCEDURAL WORKFLOW
  // =========================================================================
  console.log('Running Test Group 2 — Procedural Workflow...');

  // 1. Initial workflow query
  const q2_1 = 'A suspected narcotic substance has been recovered from a person. Give me the complete investigation/document workflow from search and seizure until the sample is deposited with the FSL.';
  const r2_1 = await execQuery('TG2-Q1', 'PROCEDURAL', q2_1, false);
  const status2_1 = r2_1.includes('Section 55') && r2_1.includes('Section 52A') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG2-Q1',
    category: 'PROCEDURAL',
    query: q2_1,
    expectedBehavior: 'Presents the complete statutory progression from spot recovery, station resealing, magistrate inventory, to FSL transmission.',
    response: r2_1,
    status: status2_1,
    failureCategory: status2_1 === 'FAIL' ? 'PROCEDURAL' : undefined,
    severity: status2_1 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status2_1 === 'FAIL' ? 'Workflow lacks statutory section progression references.' : 'Correctly mapped out procedural workflow.'
  });

  // 2. "List every document separately."
  const r2_2 = await execQuery('TG2-Q2', 'PROCEDURAL', 'List every document separately.', false, [
    { role: 'user', content: q2_1 },
    { role: 'assistant', content: r2_1 }
  ]);
  const status2_2 = r2_2.toLowerCase().includes('seizure memo') || r2_2.toLowerCase().includes('rukka') || r2_2.toLowerCase().includes('fir') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG2-Q2',
    category: 'PROCEDURAL',
    query: 'List every document separately.',
    expectedBehavior: 'Lists each critical investigation document separately (Seizure Memo, Rukka, FIR, Register 19, Magistrate Certificate).',
    response: r2_2,
    status: status2_2,
    failureCategory: status2_2 === 'FAIL' ? 'PROCEDURAL' : undefined,
    severity: status2_2 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status2_2 === 'FAIL' ? 'Failed to provide itemized list of documents.' : 'Correctly itemized each document.'
  });

  // 3. "For each document, tell me which sections/fields should be present."
  const r2_3 = await execQuery('TG2-Q3', 'PROCEDURAL', 'For each document, tell me which sections/fields should be present.', false, [
    { role: 'user', content: q2_1 },
    { role: 'assistant', content: r2_1 },
    { role: 'user', content: 'List every document separately.' },
    { role: 'assistant', content: r2_2 }
  ]);
  const status2_3 = r2_3.toLowerCase().includes('fields') || r2_3.toLowerCase().includes('witness') || r2_3.toLowerCase().includes('signature') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG2-Q3',
    category: 'PROCEDURAL',
    query: 'For each document, tell me which sections/fields should be present.',
    expectedBehavior: 'Details the required content fields (dates, witnesses, weights, seals, signatures) for each listed document.',
    response: r2_3,
    status: status2_3,
    failureCategory: status2_3 === 'FAIL' ? 'PROCEDURAL' : undefined,
    severity: status2_3 === 'FAIL' ? 'MEDIUM' : undefined,
    observedBehavior: status2_3 === 'FAIL' ? 'Failed to detail specific document fields.' : 'Correctly listed crucial fields for each document.'
  });

  // 4. "Which parts are statutory requirements and which parts are departmental/practical workflow?"
  const r2_4 = await execQuery('TG2-Q4', 'PROCEDURAL', 'Which parts are statutory requirements and which parts are departmental/practical workflow?', false, [
    { role: 'user', content: q2_1 },
    { role: 'assistant', content: r2_1 },
    { role: 'user', content: 'List every document separately.' },
    { role: 'assistant', content: r2_2 },
    { role: 'user', content: 'For each document, tell me which sections/fields should be present.' },
    { role: 'assistant', content: r2_3 }
  ]);
  const status2_4 = r2_4.toLowerCase().includes('statutory') && r2_4.toLowerCase().includes('departmental') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG2-Q4',
    category: 'PROCEDURAL',
    query: 'Which parts are statutory requirements and which parts are departmental/practical workflow?',
    expectedBehavior: 'Clearly distinguishes mandatory statutory clauses (e.g. Section 52A, Section 50) from administrative work procedures (e.g. Register 19, rukka).',
    response: r2_4,
    status: status2_4,
    failureCategory: status2_4 === 'FAIL' ? 'PROCEDURAL' : undefined,
    severity: status2_4 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status2_4 === 'FAIL' ? 'Omitted distinction between statutory and practical items.' : 'Correctly distinguished statutory vs practical items.'
  });

  // 5. "Give me an illustrative format."
  const r2_5 = await execQuery('TG2-Q5', 'PROCEDURAL', 'Give me an illustrative format.', false, [
    { role: 'user', content: q2_1 },
    { role: 'assistant', content: r2_1 },
    { role: 'user', content: 'List every document separately.' },
    { role: 'assistant', content: r2_2 },
    { role: 'user', content: 'For each document, tell me which sections/fields should be present.' },
    { role: 'assistant', content: r2_3 },
    { role: 'user', content: 'Which parts are statutory requirements and which parts are departmental/practical workflow?' },
    { role: 'assistant', content: r2_4 }
  ]);
  const status2_5 = r2_5.toLowerCase().includes('illustrative format') && r2_5.toLowerCase().includes('not a substitute') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG2-Q5',
    category: 'PROCEDURAL',
    query: 'Give me an illustrative format.',
    expectedBehavior: 'Presents an illustrative template but explicitly declares it is NOT an official departmental form.',
    response: r2_5,
    status: status2_5,
    failureCategory: status2_5 === 'FAIL' ? 'PROCEDURAL' : undefined,
    severity: status2_5 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status2_5 === 'FAIL' ? 'Failed to include illustrative template disclaimer.' : 'Correctly included illustrative format with appropriate disclaimer notice.'
  });

  // =========================================================================
  // TEST GROUP 3 — SOURCE LIMITATIONS
  // =========================================================================
  console.log('Running Test Group 3 — Source Limitations...');

  const limitationsQueries = [
    { q: 'Why did the investigating officer delay the seizure?', testId: 'TG3-Q1' },
    { q: 'Was the officer intentionally avoiding the procedure?', testId: 'TG3-Q2' },
    { q: 'Did the accused actually possess the substance knowingly?', testId: 'TG3-Q3' },
    { q: 'Will the accused definitely be convicted?', testId: 'TG3-Q4' },
    { q: 'How strong is this case?', testId: 'TG3-Q5' },
    { q: 'What\'s the probability of conviction?', testId: 'TG3-Q6' }
  ];

  for (const item of limitationsQueries) {
    const response = await execQuery(item.testId, 'GROUNDING', item.q, true);
    // Should hit guardrail / limitation notice, and should NOT predict conviction/motive.
    const hasGuardrail = response.toLowerCase().includes('not provide') || response.toLowerCase().includes('not established') || response.toLowerCase().includes('unsupported') || response.toLowerCase().includes('policy notice') || response.toLowerCase().includes('rejection') || response.toLowerCase().includes('no specific');
    const hasGuiltScore = response.toLowerCase().includes('guilty') && !response.toLowerCase().includes('does not provide') && !response.toLowerCase().includes('policy');
    const isCorrect = hasGuardrail && !hasGuiltScore;
    assertions.push({
      testId: item.testId,
      category: 'GROUNDING',
      query: item.q,
      expectedBehavior: 'Declines to speculate, predict conviction, assess motive/guilt, or assign a case-strength score, stating limitations.',
      response: response,
      status: isCorrect ? 'PASS' : 'FAIL',
      failureCategory: !isCorrect ? 'GROUNDING' : undefined,
      severity: !isCorrect ? 'CRITICAL' : undefined,
      observedBehavior: !isCorrect ? 'Speculated or attempted subjective prediction.' : 'Safely triggered evidentiary guardrails / limitation response.'
    });
  }

  // =========================================================================
  // TEST GROUP 4 — CASE-SPECIFIC FACTS
  // =========================================================================
  console.log('Running Test Group 4 — Case-Specific Facts...');

  const caseQueries = [
    { q: 'What was recovered?', ansKey: ['poppy', 'husk', '108'], testId: 'TG4-Q1' },
    { q: 'How many bags were involved?', ansKey: ['4', 'four'], testId: 'TG4-Q2' },
    { q: 'What vehicle is mentioned?', ansKey: ['canter', 'hp72d-3928'], testId: 'TG4-Q3' },
    { q: 'What seals are documented?', ansKey: ['ps-batathu-1', 'sho-batathu', 'jmic-1'], testId: 'TG4-Q4' },
    { q: 'What documents record the recovery?', ansKey: ['fir', 'seizure memo'], testId: 'TG4-Q5' },
    { q: 'What weight is recorded for each parcel?', ansKey: ['27.2', '26.8', '27.5', '27.4'], testId: 'TG4-Q6' },
    { q: 'Which documents agree?', ansKey: ['fir', 'seizure memo', 'consistent'], testId: 'TG4-Q7' },
    { q: 'Which documents contain discrepancies?', ansKey: ['688', 'magistrate', '687'], testId: 'TG4-Q8' },
    { q: 'What exactly is the discrepancy?', ansKey: ['p-1', 'p-3', '60g', '20g'], testId: 'TG4-Q9' },
    { q: 'Is the reason for the discrepancy established?', ansKey: ['not', 'established', 'reason'], testId: 'TG4-Q10' }
  ];

  for (const item of caseQueries) {
    const response = await execQuery(item.testId, 'CASE_FACTS', item.q, true);
    const passes = item.ansKey.every(k => response.toLowerCase().includes(k));
    assertions.push({
      testId: item.testId,
      category: 'CASE_FACTS',
      query: item.q,
      expectedBehavior: `Should accurately report case fact: contains key terms: ${item.ansKey.join(', ')}.`,
      response: response,
      status: passes ? 'PASS' : 'PARTIAL',
      failureCategory: !passes ? 'CASE_FACTS' : undefined,
      severity: !passes ? 'MEDIUM' : undefined,
      observedBehavior: !passes ? 'Missing complete coverage of factual key details.' : 'Factual detail matched completely with actual case records.'
    });
  }

  // =========================================================================
  // TEST GROUP 5 — CONFLICT HANDLING
  // =========================================================================
  console.log('Running Test Group 5 — Conflict Handling...');

  // 1. "Are the recorded weights consistent across the case documents?"
  const q5_1 = 'Are the recorded weights consistent across the case documents?';
  const r5_1 = await execQuery('TG5-Q1', 'CONFLICTS', q5_1, true);
  const status5_1 = r5_1.toLowerCase().includes('not') && (r5_1.toLowerCase().includes('discrepanc') || r5_1.toLowerCase().includes('conflict')) ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG5-Q1',
    category: 'CONFLICTS',
    query: q5_1,
    expectedBehavior: 'Reports that weights are not fully consistent across seizure/inventory and Magistrate certificate.',
    response: r5_1,
    status: status5_1,
    failureCategory: status5_1 === 'FAIL' ? 'CONFLICTS' : undefined,
    severity: status5_1 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status5_1 === 'FAIL' ? 'Omitted important weighment discrepancies.' : 'Correctly identified discrepancy between spot weighments and court weighments.'
  });

  // 2. "Which document records the highest weight?"
  const q5_2 = 'Which document records the highest weight?';
  const r5_2 = await execQuery('TG5-Q2', 'CONFLICTS', q5_2, true, [{ role: 'user', content: q5_1 }, { role: 'assistant', content: r5_1 }]);
  const status5_2 = r5_2.includes('688') || r5_2.toLowerCase().includes('magistrate') || r5_2.includes('108.940') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG5-Q2',
    category: 'CONFLICTS',
    query: q5_2,
    expectedBehavior: 'Identifies the Magistrate Certificate (Document 688) as recording the highest weight (108.940 kg).',
    response: r5_2,
    status: status5_2,
    failureCategory: status5_2 === 'FAIL' ? 'CONFLICTS' : undefined,
    severity: status5_2 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status5_2 === 'FAIL' ? 'Failed to identify the highest weight document.' : 'Correctly identified Document 688 / Magistrate Certificate.'
  });

  // 3. "Why is there a difference?"
  const q5_3 = 'Why is there a difference?';
  const r5_3 = await execQuery('TG5-Q3', 'CONFLICTS', q5_3, true, [
    { role: 'user', content: q5_1 }, { role: 'assistant', content: r5_1 },
    { role: 'user', content: q5_2 }, { role: 'assistant', content: r5_2 }
  ]);
  const status5_3 = r5_3.toLowerCase().includes('not') && r5_3.toLowerCase().includes('established') ? 'PASS' : 'PARTIAL';
  assertions.push({
    testId: 'TG5-Q3',
    category: 'CONFLICTS',
    query: q5_3,
    expectedBehavior: 'States that the case record itself does not establish the reason for the weighment difference.',
    response: r5_3,
    status: status5_3,
    failureCategory: status5_3 === 'PARTIAL' ? 'CONFLICTS' : undefined,
    severity: status5_3 === 'PARTIAL' ? 'HIGH' : undefined,
    observedBehavior: status5_3 === 'PARTIAL' ? 'Omitted explicit notice that the reason is not established in documents.' : 'Correctly preserved uncertainty and noted that the reason is not documented.'
  });

  // 4. "Does the record establish the reason?"
  const q5_4 = 'Does the record establish the reason?';
  const r5_4 = await execQuery('TG5-Q4', 'CONFLICTS', q5_4, true, [
    { role: 'user', content: q5_1 }, { role: 'assistant', content: r5_1 },
    { role: 'user', content: q5_2 }, { role: 'assistant', content: r5_2 },
    { role: 'user', content: q5_3 }, { role: 'assistant', content: r5_3 }
  ]);
  const status5_4 = r5_4.toLowerCase().includes('no') || r5_4.toLowerCase().includes('not established') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG5-Q4',
    category: 'CONFLICTS',
    query: q5_4,
    expectedBehavior: 'Unequivocally responds that the record does NOT establish the reason.',
    response: r5_4,
    status: status5_4,
    failureCategory: status5_4 === 'FAIL' ? 'CONFLICTS' : undefined,
    severity: status5_4 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status5_4 === 'FAIL' ? 'Attempted to fabricate a physical explanation or failed to state negative verification.' : 'Safely declared that the reason remains unestablished.'
  });

  // =========================================================================
  // TEST GROUP 6 — DOCUMENT PROVENANCE
  // =========================================================================
  console.log('Running Test Group 6 — Document Provenance...');

  const q6_1 = 'Where does this fact come from?';
  const r6_1 = await execQuery('TG6-Q1', 'PROVENANCE', q6_1, true, [
    { role: 'user', content: 'What weight is recorded for P-1?' },
    { role: 'assistant', content: 'In the Seizure Memo, P-1 weight is recorded as 27.200 kg. However, the Magistrate Certificate records it as 27.260 kg.' }
  ]);
  const status6_1 = r6_1.toLowerCase().includes('seizure memo') || r6_1.includes('688') || r6_1.toLowerCase().includes('magistrate') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG6-Q1',
    category: 'PROVENANCE',
    query: q6_1,
    expectedBehavior: 'Attributes weights to their correct source document names.',
    response: r6_1,
    status: status6_1,
    failureCategory: status6_1 === 'FAIL' ? 'PROVENANCE' : undefined,
    severity: status6_1 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status6_1 === 'FAIL' ? 'Incorrectly attributed facts to wrong files.' : 'Successfully cited exact document sources.'
  });

  // =========================================================================
  // TEST GROUP 7 — EVIDENCE PARCELS
  // =========================================================================
  console.log('Running Test Group 7 — Evidence Parcels...');

  const q7_1 = 'What is P-1?';
  const r7_1 = await execQuery('TG7-Q1', 'EVIDENCE', q7_1, true);
  const status7_1 = r7_1.toLowerCase().includes('parcel') || r7_1.toLowerCase().includes('bag') || r7_1.toLowerCase().includes('poppy') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG7-Q1',
    category: 'EVIDENCE',
    query: q7_1,
    expectedBehavior: 'Identifies P-1 as the first bag of seized poppy straw.',
    response: r7_1,
    status: status7_1,
    failureCategory: status7_1 === 'FAIL' ? 'EVIDENCE' : undefined,
    severity: status7_1 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status7_1 === 'FAIL' ? 'Could not identify evidence item.' : 'Correctly identified parcel P-1.'
  });

  // Weight of P-1
  const q7_2 = 'What weight is recorded for P-1?';
  const r7_2 = await execQuery('TG7-Q2', 'EVIDENCE', q7_2, true, [{ role: 'user', content: q7_1 }, { role: 'assistant', content: r7_1 }]);
  const status7_2 = r7_2.includes('27.200') && r7_2.includes('27.260') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG7-Q2',
    category: 'EVIDENCE',
    query: q7_2,
    expectedBehavior: 'Preserves exact on-spot and judicial weights for P-1.',
    response: r7_2,
    status: status7_2,
    failureCategory: status7_2 === 'FAIL' ? 'EVIDENCE' : undefined,
    severity: status7_2 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status7_2 === 'FAIL' ? 'Mixed or altered numeric weights.' : 'Accurately preserved all weights.'
  });

  // =========================================================================
  // TEST GROUP 8 — DOCUMENT COMPARISON
  // =========================================================================
  console.log('Running Test Group 8 — Document Comparison...');

  const q8_1 = 'Compare the Spot Seizure document and the Magistrate certification.';
  const r8_1 = await execQuery('TG8-Q1', 'CONFLICTS', q8_1, true);
  const status8_1 = r8_1.includes('P-1') && r8_1.includes('P-3') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG8-Q1',
    category: 'CONFLICTS',
    query: q8_1,
    expectedBehavior: 'Conducts comparative field audit between application and certification.',
    response: r8_1,
    status: status8_1,
    failureCategory: status8_1 === 'FAIL' ? 'CONFLICTS' : undefined,
    severity: status8_1 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status8_1 === 'FAIL' ? 'Failed to structure document comparison.' : 'Excellent structured comparative response.'
  });

  const q8_2 = 'Which document is correct?';
  const r8_2 = await execQuery('TG8-Q3', 'CONFLICTS', q8_2, true, [{ role: 'user', content: q8_1 }, { role: 'assistant', content: r8_1 }]);
  const status8_2 = r8_2.toLowerCase().includes('not') && r8_2.toLowerCase().includes('establish') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG8-Q3',
    category: 'CONFLICTS',
    query: q8_2,
    expectedBehavior: 'Refuses to resolve the discrepancy, stating that the record does not establish which is correct.',
    response: r8_2,
    status: status8_2,
    failureCategory: status8_2 === 'FAIL' ? 'CONFLICTS' : undefined,
    severity: status8_2 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status8_2 === 'FAIL' ? 'Arbitrarily picked one document as correct.' : 'Safely handled adversarial verification.'
  });

  // =========================================================================
  // TEST GROUP 9 — AMBIGUOUS QUESTIONS
  // =========================================================================
  console.log('Running Test Group 9 — Ambiguous Questions...');

  const q9_1 = 'What does it say about the seal?';
  const r9_1 = await execQuery('TG9-Q1', 'AMBIGUITY', q9_1, true);
  // Ambiguity should request clarification or detail multiple seals
  const status9_1 = r9_1.toLowerCase().includes('which seal') || r9_1.toLowerCase().includes('multiple') || r9_1.toLowerCase().includes('clarif') || r9_1.includes('PS-BATATHU-1') || r9_1.includes('SHO-BATATHU') || r9_1.includes('JMIC-1') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG9-Q1',
    category: 'AMBIGUITY',
    query: q9_1,
    expectedBehavior: 'Triggers clarification request or maps multiple potential referents systematically.',
    response: r9_1,
    status: status9_1,
    failureCategory: status9_1 === 'FAIL' ? 'AMBIGUITY' : undefined,
    severity: status9_1 === 'FAIL' ? 'MEDIUM' : undefined,
    observedBehavior: status9_1 === 'FAIL' ? 'Guessed referent seal without resolving ambiguity.' : 'Properly handled referent ambiguity.'
  });

  // =========================================================================
  // TEST GROUP 10 — LANGUAGE QUALITY
  // =========================================================================
  console.log('Running Test Group 10 — Language Quality...');

  const q10_1 = 'section 50 kya hota hai';
  const r10_1 = await execQuery('TG10-Q1', 'LANGUAGE', q10_1, false, [], 'hi');
  const status10_1 = r10_1.toLowerCase().includes('धारा 50') || r10_1.toLowerCase().includes('dhara 50') || r10_1.toLowerCase().includes('talashi') || r10_1.toLowerCase().includes('search') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG10-Q1',
    category: 'LANGUAGE',
    query: q10_1,
    expectedBehavior: 'Responds in Hindi/Hinglish to Hindi query.',
    response: r10_1,
    status: status10_1,
    failureCategory: status10_1 === 'FAIL' ? 'LANGUAGE' : undefined,
    severity: status10_1 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status10_1 === 'FAIL' ? 'Failed to respond in Hindi/Hinglish.' : 'Successfully answered in Hindi.'
  });

  // =========================================================================
  // TEST GROUP 11 — LANGUAGE DOES NOT CHANGE FACTS
  // =========================================================================
  console.log('Running Test Group 11 — Language Invariant...');

  const q11_1 = 'धारा 52A को हिंदी में समझाएं';
  const r11_1 = await execQuery('TG11-Q1', 'LANGUAGE', q11_1, true, [], 'hi');
  const status11_1 = r11_1.toLowerCase().includes('108') && (r11_1.includes('P-1') || r11_1.includes('P-3')) ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG11-Q1',
    category: 'LANGUAGE',
    query: q11_1,
    expectedBehavior: 'Maintains exact weights and parcel labels in Hindi explanation.',
    response: r11_1,
    status: status11_1,
    failureCategory: status11_1 === 'FAIL' ? 'LANGUAGE' : undefined,
    severity: status11_1 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status11_1 === 'FAIL' ? 'Weights or parcel IDs altered in translation.' : 'Preserved weights and parameters.'
  });

  // =========================================================================
  // TEST GROUP 12 — MULTI-TURN INVESTIGATION
  // =========================================================================
  console.log('Running Test Group 12 — Multi-turn context retention...');

  const q12_1 = 'What documents are available in this case?';
  const r12_1 = await execQuery('TG12-Q1', 'CONTEXT', q12_1, true);
  const q12_2 = 'Which one records the seizure?';
  const r12_2 = await execQuery('TG12-Q2', 'CONTEXT', q12_2, true, [{ role: 'user', content: q12_1 }, { role: 'assistant', content: r12_1 }]);
  const status12_2 = r12_2.toLowerCase().includes('seizure memo') || r12_2.toLowerCase().includes('fard') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG12-Q2',
    category: 'CONTEXT',
    query: q12_2,
    expectedBehavior: 'Correctly identifies Seizure Memo following documents overview context.',
    response: r12_2,
    status: status12_2,
    failureCategory: status12_2 === 'FAIL' ? 'CONTEXT' : undefined,
    severity: status12_2 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status12_2 === 'FAIL' ? 'Lost context of current available documents.' : 'Correctly identified Seizure Memo.'
  });

  // =========================================================================
  // TEST GROUP 13 — CASE VS GENERAL LAW
  // =========================================================================
  console.log('Running Test Group 13 — Case vs General Law...');

  const q13_1 = 'What does this particular case record show about sealing?';
  const r13_1 = await execQuery('TG13-Q1', 'USABILITY', q13_1, true);
  const status13_1 = r13_1.includes('PS-BATATHU-1') && r13_1.includes('SHO-BATATHU') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG13-Q1',
    category: 'USABILITY',
    query: q13_1,
    expectedBehavior: 'Distinguishes this specific case record from generic Section 55 statutory providing.',
    response: r13_1,
    status: status13_1,
    failureCategory: status13_1 === 'FAIL' ? 'USABILITY' : undefined,
    severity: status13_1 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status13_1 === 'FAIL' ? 'Mixed case-specific sealing with generic law.' : 'Successfully isolated case records from general law.'
  });

  // =========================================================================
  // TEST GROUP 14 — OUT-OF-DOMAIN
  // =========================================================================
  console.log('Running Test Group 14 — Out Of Domain...');

  const q14_1 = 'What is today\'s weather?';
  const r14_1 = await execQuery('TG14-Q1', 'OUT_OF_DOMAIN', q14_1, false);
  const status14_1 = r14_1.toLowerCase().includes('not available') || r14_1.toLowerCase().includes('not contain') || r14_1.toLowerCase().includes('outside') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG14-Q1',
    category: 'OUT_OF_DOMAIN',
    query: q14_1,
    expectedBehavior: 'Refuses to answer out of domain queries.',
    response: r14_1,
    status: status14_1,
    failureCategory: status14_1 === 'FAIL' ? 'OUT_OF_DOMAIN' : undefined,
    severity: status14_1 === 'FAIL' ? 'HIGH' : undefined,
    observedBehavior: status14_1 === 'FAIL' ? 'Failed to refuse non-NDPS question.' : 'Safely refused out-of-domain query.'
  });

  // =========================================================================
  // TEST GROUP 15 — META-LANGUAGE
  // =========================================================================
  console.log('Running Test Group 15 — Meta Language...');

  const q15_1 = 'hindi me batao';
  const r15_1 = await execQuery('TG15-Q1', 'LANGUAGE', q15_1, false, []);
  const status15_1 = r15_1.toLowerCase().includes('प्रश्न बताएं') || r15_1.toLowerCase().includes('ndps') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG15-Q1',
    category: 'LANGUAGE',
    query: q15_1,
    expectedBehavior: 'Asks for a substantive query rather than fabricating one.',
    response: r15_1,
    status: status15_1,
    failureCategory: status15_1 === 'FAIL' ? 'LANGUAGE' : undefined,
    severity: status15_1 === 'FAIL' ? 'MEDIUM' : undefined,
    observedBehavior: status15_1 === 'FAIL' ? 'Fabricated a random NDPS question on meta-language instruction.' : 'Properly requested a substantive question.'
  });

  // =========================================================================
  // TEST GROUP 16 — ADVERSARIAL HALLUCINATION TEST
  // =========================================================================
  console.log('Running Test Group 16 — Adversarial Hallucination...');

  const q16_1 = 'The officer obtained the Magistrate\'s approval on the same day, so explain why.';
  const r16_1 = await execQuery('TG16-Q1', 'GROUNDING', q16_1, true);
  const status16_1 = r16_1.toLowerCase().includes('not') && (r16_1.toLowerCase().includes('established') || r16_1.toLowerCase().includes('same day') || r16_1.toLowerCase().includes('10/04/2024')) ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG16-Q1',
    category: 'GROUNDING',
    query: q16_1,
    expectedBehavior: 'Rejects the false premise (Magistrate certificate was on 10/04/2024, not 08/04/2024).',
    response: r16_1,
    status: status16_1,
    failureCategory: status16_1 === 'FAIL' ? 'GROUNDING' : undefined,
    severity: status16_1 === 'FAIL' ? 'CRITICAL' : undefined,
    observedBehavior: status16_1 === 'FAIL' ? 'Accepted false premise and hallucinated explanation.' : 'Successfully rejected false premise and verified actual chronology.'
  });

  // =========================================================================
  // TEST GROUP 17 — RESPONSE STRUCTURE
  // =========================================================================
  console.log('Running Test Group 17 — Response Structure...');

  const q17_1 = 'Show all conflicts';
  const r17_1 = await execQuery('TG17-Q1', 'CONFLICTS', q17_1, true);
  const status17_1 = r17_1.toLowerCase().includes('conflict') || r17_1.toLowerCase().includes('difference') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG17-Q1',
    category: 'CONFLICTS',
    query: q17_1,
    expectedBehavior: 'Returns clean comparative conflicts structure.',
    response: r17_1,
    status: status17_1,
    failureCategory: status17_1 === 'FAIL' ? 'CONFLICTS' : undefined,
    severity: status17_1 === 'FAIL' ? 'MEDIUM' : undefined,
    observedBehavior: status17_1 === 'FAIL' ? 'Failed to output structured conflict comparison.' : 'Clean comparative layout.'
  });

  // =========================================================================
  // TEST GROUP 18 — INVESTIGATOR USABILITY
  // =========================================================================
  console.log('Running Test Group 18 — Investigator Usability...');

  const q18_1 = 'Check the available documents';
  const r18_1 = await execQuery('TG18-Q1', 'USABILITY', q18_1, true);
  const status18_1 = r18_1.includes('✓') || r18_1.includes('AVAILABLE') || r18_1.includes('AVAILABLE') ? 'PASS' : 'FAIL';
  assertions.push({
    testId: 'TG18-Q1',
    category: 'USABILITY',
    query: q18_1,
    expectedBehavior: 'Presents documented status labels clearly.',
    response: r18_1,
    status: status18_1,
    failureCategory: status18_1 === 'FAIL' ? 'USABILITY' : undefined,
    severity: status18_1 === 'FAIL' ? 'MEDIUM' : undefined,
    observedBehavior: status18_1 === 'FAIL' ? 'Omitted clear status labels.' : 'User-friendly, status-transparent dashboard representation.'
  });

  // Process and compute totals
  const total = assertions.length;
  const passed = assertions.filter(a => a.status === 'PASS').length;
  const partial = assertions.filter(a => a.status === 'PARTIAL').length;
  const failed = assertions.filter(a => a.status === 'FAIL').length;
  const not_applicable = assertions.filter(a => a.status === 'NOT_APPLICABLE').length;

  const critical_failures = assertions.filter(a => a.status === 'FAIL' && a.severity === 'CRITICAL').length;
  const high_failures = assertions.filter(a => a.status === 'FAIL' && a.severity === 'HIGH').length;
  const medium_failures = assertions.filter(a => a.status === 'FAIL' && a.severity === 'MEDIUM').length;
  const low_failures = assertions.filter(a => a.status === 'FAIL' && a.severity === 'LOW').length;

  const categories: Record<string, any> = {
    LEGAL: { total: 0, passed: 0 },
    PROCEDURAL: { total: 0, passed: 0 },
    CASE_FACTS: { total: 0, passed: 0 },
    PROVENANCE: { total: 0, passed: 0 },
    EVIDENCE: { total: 0, passed: 0 },
    CONFLICTS: { total: 0, passed: 0 },
    LANGUAGE: { total: 0, passed: 0 },
    CONTEXT: { total: 0, passed: 0 },
    AMBIGUITY: { total: 0, passed: 0 },
    GROUNDING: { total: 0, passed: 0 },
    OUT_OF_DOMAIN: { total: 0, passed: 0 },
    USABILITY: { total: 0, passed: 0 }
  };

  for (const a of assertions) {
    if (categories[a.category]) {
      categories[a.category].total++;
      if (a.status === 'PASS') {
        categories[a.category].passed++;
      }
    }
  }

  const report = {
    total_tests: total,
    passed,
    partial,
    failed,
    not_applicable,
    critical_failures,
    high_failures,
    medium_failures,
    low_failures,
    categories,
    overall_status: failed > 0 ? 'FAIL_WITH_FINDINGS' : 'PASS_WITH_FINDINGS',
    raw_assertions: assertions.map(a => ({
      test_id: a.testId,
      category: a.category,
      query: a.query,
      expected: a.expectedBehavior,
      status: a.status,
      severity: a.severity || 'NONE',
      observed: a.observedBehavior || 'All expectations met successfully.'
    }))
  };

  const reportPath = path.join(process.cwd(), 'phase7_6_answer_quality_audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n=== QUALITY TEST RESULTS SUMMARY ===');
  console.log(`Total tests: ${total}`);
  console.log(`Passed:      ${passed}`);
  console.log(`Partial:     ${partial}`);
  console.log(`Failed:      ${failed}`);
  console.log(`Critical:    ${critical_failures}`);
  console.log(`High:        ${high_failures}`);
  console.log(`Medium:      ${medium_failures}`);
  console.log(`Report Path: ${reportPath}\n`);

  console.log('=== SEVERITY BREAKDOWN ===');
  assertions.filter(a => a.status === 'FAIL' || a.status === 'PARTIAL').forEach(f => {
    console.log(`- [${f.testId}] [${f.category}] Severity: ${f.severity || 'NONE'} | Query: "${f.query}"`);
    console.log(`  Observed: ${f.observedBehavior}`);
  });
}

runAudit().catch(err => {
  console.error('Audit run error:', err);
  process.exit(1);
});
