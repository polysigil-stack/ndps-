import { RetrievalEngine } from '../../src/server/retrieval';
import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';

async function testSection11Preproduction() {
  console.log('================================================================');
  console.log('SECTION 11 PRE-PRODUCTION DISAMBIGUATION TEST SUITE');
  console.log('================================================================\n');

  const engine = new RetrievalEngine();

  interface Section11TestCase {
    id: string;
    description: string;
    query: string;
    history?: { role: string; content: string }[];
    expectedAct: 'PIT NDPS Act, 1988' | 'NDPS Act, 1985' | 'DUAL';
    expectedKeywords: string[];
  }

  const testCases: Section11TestCase[] = [
    {
      id: 'A',
      description: 'Explicit PIT NDPS Act query',
      query: 'What is Section 11 of the PIT NDPS Act?',
      expectedAct: 'PIT NDPS Act, 1988',
      expectedKeywords: ['PIT NDPS Act, 1988', 'Section 11', '1 year', '2 years']
    },
    {
      id: 'B',
      description: 'Explain Section 11 of PIT NDPS Act',
      query: 'Explain Section 11 of PIT NDPS Act',
      expectedAct: 'PIT NDPS Act, 1988',
      expectedKeywords: ['PIT NDPS Act, 1988', 'Section 11', '1 year', '2 years']
    },
    {
      id: 'C',
      description: 'PIT NDPS Section 11',
      query: 'PIT NDPS Section 11',
      expectedAct: 'PIT NDPS Act, 1988',
      expectedKeywords: ['PIT NDPS Act, 1988', 'Section 11', '1 year', '2 years']
    },
    {
      id: 'D',
      description: 'Explicit NDPS Act query',
      query: 'What is Section 11 of the NDPS Act?',
      expectedAct: 'NDPS Act, 1985',
      expectedKeywords: ['NDPS Act, 1985', 'Section 11', 'Prohibition of Attachment']
    },
    {
      id: 'E',
      description: 'Explain Section 11 of NDPS Act 1985',
      query: 'Explain Section 11 of NDPS Act 1985',
      expectedAct: 'NDPS Act, 1985',
      expectedKeywords: ['NDPS Act, 1985', 'Section 11', 'Prohibition of Attachment']
    },
    {
      id: 'F',
      description: 'Bare Section 11 query (dual disambiguation)',
      query: 'What is Section 11?',
      expectedAct: 'DUAL',
      expectedKeywords: ['NDPS Act, 1985', 'PIT NDPS Act, 1988', 'Prohibition of Attachment', 'Maximum Period of Detention']
    },
    {
      id: 'G',
      description: 'What is Section 11 of PIT NDPS?',
      query: 'What is Section 11 of PIT NDPS?',
      expectedAct: 'PIT NDPS Act, 1988',
      expectedKeywords: ['PIT NDPS Act, 1988', 'Section 11', '1 year', '2 years']
    },
    {
      id: 'H',
      description: 'What is Section 11 under PIT?',
      query: 'What is Section 11 under PIT?',
      expectedAct: 'PIT NDPS Act, 1988',
      expectedKeywords: ['PIT NDPS Act, 1988', 'Section 11', '1 year', '2 years']
    },
    {
      id: 'Follow-Up-PIT',
      description: 'PIT NDPS Section 11 -> Explain more follow up',
      query: 'Explain more',
      history: [
        { role: 'user', content: 'What is Section 11 of the PIT NDPS Act?' },
        { role: 'assistant', content: 'Under Section 11 of the PIT NDPS Act, 1988...' }
      ],
      expectedAct: 'PIT NDPS Act, 1988',
      expectedKeywords: ['PIT NDPS Act, 1988', 'Section 11', '1 year']
    },
    {
      id: 'Follow-Up-NDPS',
      description: 'NDPS Act Section 11 -> Explain more follow up',
      query: 'Explain more',
      history: [
        { role: 'user', content: 'What is Section 11 of the NDPS Act?' },
        { role: 'assistant', content: 'Under Section 11 of the NDPS Act, 1985...' }
      ],
      expectedAct: 'NDPS Act, 1985',
      expectedKeywords: ['NDPS Act, 1985', 'Section 11', 'Prohibition of Attachment']
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    const results = await engine.retrieve(tc.query, 10);
    const synth = synthesizeAuthoritativeAnswer(tc.query, results, tc.history || []);
    const answer = synth.answer;

    let isOk = true;
    for (const kw of tc.expectedKeywords) {
      if (!answer.toLowerCase().includes(kw.toLowerCase())) {
        isOk = false;
        console.error(`[FAIL ID ${tc.id}] Missing expected keyword "${kw}"`);
      }
    }

    if (tc.expectedAct === 'PIT NDPS Act, 1988') {
      if (answer.includes('Prohibition of Attachment')) {
        isOk = false;
        console.error(`[FAIL ID ${tc.id}] Conflated NDPS 1985 Attachment into PIT NDPS query!`);
      }
    } else if (tc.expectedAct === 'NDPS Act, 1985') {
      if (answer.includes('Maximum Period of Detention') && !answer.includes('Prohibition of Attachment')) {
        isOk = false;
        console.error(`[FAIL ID ${tc.id}] Conflated PIT NDPS Detention into NDPS 1985 query!`);
      }
    }

    if (isOk) {
      passed++;
      console.log(`[PASS ID ${tc.id}] (${tc.description}) -> Correctly routed to ${tc.expectedAct}`);
    } else {
      failed++;
      console.log(`[FAIL ID ${tc.id}] (${tc.description})\nOUTPUT:\n${answer}\n`);
    }
  }

  console.log('\n================================================================');
  console.log(`SUMMARY: Total: ${testCases.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

testSection11Preproduction().catch((err) => {
  console.error(err);
  process.exit(1);
});
