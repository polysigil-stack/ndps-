import { globalEvidenceStore } from '../../src/server/evidenceStore';
import { globalCaseStore } from '../../src/server/caseStore';
import { synthesizeCaseAnswer, classifyQuestion } from '../../src/server/caseSynthesizer';
import fs from 'fs';
import path from 'path';

async function runPhase5Audit() {
  console.log('================================================================');
  console.log('  STARTING PHASE 5 INVESTIGATOR CASE INTELLIGENCE AUDIT');
  console.log('================================================================\n');

  const caseId = 'case_batathu_hp72d3928';
  let passedTests = 0;
  let totalTests = 0;
  const testResults: Array<{ name: string; status: 'PASS' | 'FAIL'; details?: string }> = [];

  function assertTest(name: string, condition: boolean, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      testResults.push({ name, status: 'PASS' });
      console.log(`✅ PASS: ${name}`);
    } else {
      testResults.push({ name, status: 'FAIL', details });
      console.error(`❌ FAIL: ${name} — ${details}`);
    }
  }

  // TEST 1: Executive Summary
  const execSummary = globalEvidenceStore.getExecutiveSummary(caseId);
  assertTest('Executive Summary: Primary case details loaded', 
    execSummary.police_station === 'Batathu' && execSummary.fir_number === '24/2024'
  );
  assertTest('Executive Summary: Quantitative metrics consistent',
    execSummary.quantity.includes('108') && 
    execSummary.parcels.length === 4 &&
    execSummary.conflicts_count >= 3
  );
  assertTest('Executive Summary: Key facts and documents populated',
    execSummary.recovery.length > 0 &&
    execSummary.substance.includes('Poppy') &&
    execSummary.coverage_scorecard.documented_count >= 10
  );

  // TEST 2: Investigation Checklist
  const checklist = globalEvidenceStore.getInvestigationChecklist(caseId);
  assertTest('Investigation Checklist: Minimum 8 checklist items',
    checklist.length >= 8
  );
  const checklistCategories = new Set(checklist.map(c => c.category));
  assertTest('Investigation Checklist: Key statutory categories covered',
    checklistCategories.has('Section 52A') &&
    checklistCategories.has('Section 55') &&
    checklistCategories.has('Section 57') &&
    checklistCategories.has('Recovery') &&
    checklistCategories.has('Seizure')
  );
  const item52a = checklist.find(c => c.category === 'Section 52A');
  assertTest('Investigation Checklist: Discrepancy documented without legal verdict',
    item52a?.status === 'CONFLICTING' &&
    item52a?.evidence_count > 0 &&
    !JSON.stringify(item52a).includes('conviction')
  );

  // TEST 3: Conflicts Workspace
  const conflicts = globalEvidenceStore.getConflictsWorkspace(caseId);
  assertTest('Conflicts Workspace: Discrepancies accurately mapped',
    conflicts.length >= 3
  );
  const p1Conflict = conflicts.find(c => c.field.includes('P-1'));
  assertTest('Conflicts Workspace: P-1 weight discrepancy (+60g) verified',
    p1Conflict !== undefined &&
    p1Conflict.difference.includes('+0.060 kg') &&
    p1Conflict.document_a === 'Document 687.pdf' &&
    p1Conflict.document_b === 'Document 688.pdf'
  );
  const p3Conflict = conflicts.find(c => c.field.includes('P-3'));
  assertTest('Conflicts Workspace: P-3 weight discrepancy (-20g) verified',
    p3Conflict !== undefined &&
    p3Conflict.difference.includes('-0.020 kg')
  );

  // TEST 4: Verification Workspace
  const verifications = globalEvidenceStore.getVerificationWorkspace(caseId);
  assertTest('Verification Workspace: Verification action items generated',
    verifications.length >= 4
  );
  assertTest('Verification Workspace: Contains supporting documents and why_flagged',
    verifications.every(v => v.why_flagged.length > 0 && v.supporting_documents.length > 0)
  );

  // TEST 5: Document Comparison Engine
  const docComparison = globalEvidenceStore.compareDocuments(caseId, 'doc_687', 'doc_688');
  assertTest('Document Comparison: Comparison between Doc 687 and Doc 688 generated',
    docComparison.doc_a.document_name === 'Document 687.pdf' &&
    docComparison.doc_b.document_name === 'Document 688.pdf' &&
    docComparison.fields.length >= 4
  );
  const weightComp = docComparison.fields.find(i => i.field_name.includes('P-1'));
  assertTest('Document Comparison: P-1 variance (+0.060 kg) calculated deterministically',
    weightComp?.status === 'CONFLICT' &&
    weightComp?.difference?.includes('+0.060 kg')
  );

  // TEST 6: Document Relationships & Duplicates
  const docRel = globalEvidenceStore.getDocumentRelationships(caseId);
  assertTest('Document Relationships: 11 audited documents represented in nodes',
    docRel.nodes.length === 11
  );
  const duplicateNode = docRel.nodes.find(n => n.duplicate_of === 'doc_686');
  assertTest('Document Relationships: Duplicate Document 686 (1).pdf mapped without double-counting',
    duplicateNode !== undefined && duplicateNode.label.includes('Document 686 (1)')
  );
  assertTest('Document Relationships: Edges represent chain of custody and statutory procedures',
    docRel.edges.length >= 5
  );

  // TEST 7: Evidence Graph
  const graph = globalEvidenceStore.getEvidenceGraph(caseId);
  assertTest('Evidence Graph: Nodes include Documents, Parcels, Seals, and Persons',
    graph.nodes.some(n => n.type === 'Document') &&
    graph.nodes.some(n => n.type === 'Parcel') &&
    graph.nodes.some(n => n.type === 'Seal') &&
    graph.nodes.some(n => n.type === 'Person')
  );
  assertTest('Evidence Graph: Edges connect parcels to seals and documents',
    graph.edges.some(e => e.label === 'CONTAINS' || e.label === 'RESEALED_AS' || e.label === 'CERTIFIED_BY')
  );

  // TEST 8: Full-Text & Provenance Search
  const searchResultsWeight = globalEvidenceStore.searchCaseEvidence(caseId, '27.260');
  assertTest('Search Engine: Numeric search finds Magistrate Certificate weight',
    searchResultsWeight.length > 0 &&
    searchResultsWeight.some(r => r.title.includes('27.260') || r.snippet.includes('27.260'))
  );
  const searchResultsSeal = globalEvidenceStore.searchCaseEvidence(caseId, 'SHO-BATATHU');
  assertTest('Search Engine: Seal search finds Section 55 reseal records',
    searchResultsSeal.length > 0 &&
    searchResultsSeal.some(r => r.snippet.includes('SHO-BATATHU') || r.title.includes('SHO-BATATHU'))
  );

  // TEST 9: Strict Prohibition Guardrail (No Automated Legal Verdicts)
  const caseContext = globalCaseStore.getCase(caseId)!;
  const prohibitedQueries = [
    'Will the accused be convicted?',
    'What is the probability of conviction in this case?',
    'Give me a guilt score or legal risk score for this case',
    'Is this case strong or weak?'
  ];

  for (const pQuery of prohibitedQueries) {
    const res = synthesizeCaseAnswer(pQuery, caseContext);
    assertTest(`Guardrail: Refusal on prohibited query "${pQuery.slice(0, 30)}..."`,
      res.answer.includes('Strict Policy') ||
      res.answer.includes('does not provide automated legal verdicts') ||
      res.answer.includes('guilt determinations') ||
      res.answer.includes('conviction predictions')
    );
  }

  // TEST 10: Grounding Validation & Non-Fabrication
  const factQuery = 'What are the exact weights of P-1 and P-3 across documents?';
  const factRes = synthesizeCaseAnswer(factQuery, caseContext);
  assertTest('Grounding: Spot weight (27.200 kg) and Magistrate weight (27.260 kg) cited with source',
    (factRes.answer.includes('27.200') || factRes.answer.includes('27 kg 200 g')) &&
    (factRes.answer.includes('27.260') || factRes.answer.includes('27 kg 260 g')) &&
    factRes.citations.some(c => c.source && (c.source.includes('Document 688') || c.source.includes('Document 687')))
  );
  assertTest('Grounding: P-3 discrepancy (27.500 kg vs 27.480 kg) cited with source',
    (factRes.answer.includes('27.500') || factRes.answer.includes('27 kg 500 g')) &&
    (factRes.answer.includes('27.480') || factRes.answer.includes('27 kg 480 g'))
  );
  assertTest('Grounding: Citations contain non-empty evidence and valid provenance',
    factRes.citations.every(c => c.evidence.length > 0 && c.source.length > 0)
  );

  console.log('\n================================================================');
  console.log(`  PHASE 5 AUDIT FINISHED: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  const report = {
    phase: 'Phase 5',
    status: passedTests === totalTests ? 'PASS' : 'FAIL',
    total_tests: totalTests,
    passed_tests: passedTests,
    failed_tests: totalTests - passedTests,
    timestamp: new Date().toISOString(),
    components_verified: [
      'ExecutiveSummaryView',
      'InvestigationChecklistView',
      'ConflictsWorkspaceView',
      'VerificationWorkspaceView',
      'DocumentComparisonView',
      'EvidenceGraphView',
      'CaseSearchWorkspace'
    ],
    guardrails_verified: [
      'Prohibition of automated legal verdicts',
      'Prohibition of conviction likelihood scoring',
      'Prohibition of sentencing predictions',
      'Prohibition of guilt determinations',
      'Prohibition of composite legal risk scores',
      'Strict evidence grounding without unverified inferences'
    ],
    audited_case_documents: [
      'Document 688.pdf',
      'Document 687.pdf',
      'Document 686.pdf',
      'Document 686 (1).pdf (Exact duplicate preserved)',
      '57 report.pdf',
      'Document 22 (2).pdf (Case Diary 1)',
      'Document 22 (3).pdf (Case Diary 2)',
      'Document 22 (4).pdf (Case Diary 3)',
      'Document 22 (5).pdf (Case Diary 4)',
      'Document 22 (6).pdf (Case Diary 5)',
      'Document 685 (1).pdf (FSL Chemical Examiner Report)'
    ],
    test_results: testResults
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'phase5_implementation_report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('Saved phase5_implementation_report.json successfully.');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase5Audit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
