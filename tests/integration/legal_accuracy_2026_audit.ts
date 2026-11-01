import { RetrievalEngine } from '../../src/server/retrieval';
import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';
import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';

async function runLegalAccuracy2026Audit() {
  console.log('================================================================');
  console.log('NDPS LEGAL ACCURACY 2026 AUDIT: NEW REPAIRS VERIFICATION');
  console.log('================================================================\n');

  const engine = new RetrievalEngine();

  interface AuditTestCase {
    category: string;
    question: string;
    expectedKeywords: string[];
    forbiddenKeywords?: string[];
  }

  const testCases: AuditTestCase[] = [
    {
      category: 'Officer Empowerment',
      question: 'Is an ASI empowered to search a building under Section 42?',
      expectedKeywords: ['verify', 'notification', 'not from rank alone', 'statutory designation']
    },
    {
      category: 'BNSS 2023 Integration',
      question: 'What are the search requirements under Section 105 and 106 BNSS?',
      expectedKeywords: ['Section 105', 'audio-video', 'Section 106', 'receipt', 'occupant']
    },
    {
      category: 'Digital Evidence',
      question: 'Can I search a mobile phone found during a search at the spot?',
      expectedKeywords: ['physical seizure', 'authority to search', 'tech-forensic authorization', 'Puttaswamy']
    },
    {
      category: 'Section 67 & Tofan Singh',
      question: 'Is a statement recorded by police under Section 67 admissible as a confession?',
      expectedKeywords: ['Tofan Singh', 'inadmissible', 'not a confession', 'police officer']
    },
    {
      category: 'Section 52A & Mohanlal',
      question: 'Can I draw samples for FSL at the spot for trial purposes?',
      expectedKeywords: ['Magistrate', 'Section 52A', 'Mohanlal', 'primary evidence', 'in the presence of']
    }
  ];

  let passedCount = 0;

  for (const t of testCases) {
    const results = await engine.retrieve(t.question, 10);
    const synth = synthesizeAuthoritativeAnswer(t.question, results, []);
    const answerLower = synth.answer.toLowerCase();

    let ok = true;
    for (const kw of t.expectedKeywords) {
      if (!answerLower.includes(kw.toLowerCase())) {
        ok = false;
        console.error(`[FAIL] ${t.category}: Missing keyword "${kw}"`);
        console.error(`Actual answer snippet: ${synth.answer.substring(0, 200)}...`);
        break;
      }
    }

    if (ok) {
      passedCount++;
      console.log(`[PASS] ${t.category}`);
    }
  }

  // 6. Narrative-to-field mapping check (Scenario 7/10 fix)
  console.log('\n--- Verifying Narrative-to-Field Mapping Integrity ---');
  const freshCase = globalCaseStore.getOrCreateSessionCase(`audit_case_${Date.now()}`);
  const narrative = "Information was received at 7:30 PM on 28 October 2026. The police station is Sadar Una, district Una. The location is Bus Stand Una. The suspected substance is heroin and the stated weight is 500 grams.";
  await processInvestigatorQuery(narrative, freshCase, []);
  
  const facts = freshCase.confirmed_facts || {};
  let mappingOk = true;
  if (facts['थाना']?.includes('The police station is')) {
    console.error(`[FAIL] Fact Mapping: 'थाना' contains narrative sentence: "${facts['थाना']}"`);
    mappingOk = false;
  }
  if (facts['समय']?.includes('Information was received')) {
    console.error(`[FAIL] Fact Mapping: 'समय' contains narrative sentence: "${facts['समय']}"`);
    mappingOk = false;
  }
  if (facts['थाना'] === 'Sadar Una' && facts['समय'] === '7:30 PM') {
    console.log(`[PASS] Fact Mapping: Atomic values extracted correctly.`);
  } else {
    console.error(`[FAIL] Fact Mapping: Expected atomic values not found. Found: ${JSON.stringify(facts)}`);
    mappingOk = false;
  }

  console.log('\n================================================================');
  console.log(`AUDIT RESULTS: ${passedCount}/${testCases.length} Legal Logic Tests Passed`);
  console.log(`Fact Mapping Integrity: ${mappingOk ? 'PASSED' : 'FAILED'}`);
  console.log('================================================================\n');

  if (passedCount === testCases.length && mappingOk) {
    console.log('🎉 ALL 2026 LEGAL REPAIRS VERIFIED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runLegalAccuracy2026Audit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
