import { RetrievalEngine } from '../../src/server/retrieval';

async function testStatutory() {
  const engine = new RetrievalEngine();
  console.log(`Loaded ${engine.getRecordCount()} records and embeddings.`);

  const testCases = [
    { query: 'What is Section 20 of the NDPS Act?', expectedSec: '20' },
    { query: 'What is the procedure for personal search under Section 50 of NDPS Act?', expectedSec: '50' },
    { query: 'What is Section 42 of NDPS Act regarding search and seizure?', expectedSec: '42' },
    { query: 'What are the bail conditions under Section 37 of NDPS Act?', expectedSec: '37' },
    { query: 'When is a conveyance liable to confiscation under Section 60(3)?', expectedSec: '60' },
    { query: 'What is Section 52A disposal and sampling before Magistrate?', expectedSec: '52a' },
    { query: 'What is the punishment for financing illicit traffic under Section 27A?', expectedSec: '27a' },
    { query: 'What is the small and commercial quantity for heroin and ganja under S.O. 1055(E)?', expectedSec: '1055' },
    { query: 'What is Section 57 requirement for reporting arrest and seizure?', expectedSec: '57' },
    { query: 'What is Section 68A regarding forfeiture of illegally acquired property?', expectedSec: '68' },
    { query: 'How does Section 80 relate to the Drugs and Cosmetics Act?', expectedSec: '80' },
  ];

  let passed = 0;
  for (const tc of testCases) {
    const results = await engine.retrieve(tc.query, 3);
    const top1 = results[0];
    const topText = top1 ? `${top1.record.question} ${top1.record.answer} ${top1.record.source || ''}`.toLowerCase() : '';
    const isMatch = topText.includes(`section ${tc.expectedSec}`) || topText.includes(`s.o. ${tc.expectedSec}`) || topText.includes(tc.expectedSec);

    console.log(`Query: "${tc.query}"`);
    console.log(`Top-1 ID: ${top1?.record?.record_id} | Score: ${top1?.score?.toFixed(3)} | Match: ${isMatch ? 'PASS' : 'FAIL'}`);
    if (isMatch) passed++;
    console.log('-'.repeat(50));
  }

  console.log(`Statutory Retrieval Results: ${passed} / ${testCases.length} passed (${((passed / testCases.length) * 100).toFixed(1)}%)`);
  if (passed !== testCases.length) {
    process.exit(1);
  }
}

testStatutory().catch(console.error);
