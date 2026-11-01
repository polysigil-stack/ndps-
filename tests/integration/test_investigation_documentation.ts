import { RetrievalEngine } from '../../src/server/retrieval';

async function runDocumentationBenchmark() {
  console.log('=== STARTING NDPS INVESTIGATION DOCUMENTATION & FORMS BENCHMARK ===');
  const engine = new RetrievalEngine();

  const testQueries = [
    // Section 42 (4)
    { query: "What are the procedural and documentation requirements under Section 42 of the NDPS Act?", expectedId: "doc_sec42_1" },
    { query: "Is recording information in writing under Section 42 mandatory before conducting a search?", expectedId: "doc_sec42_2" },
    { query: "What is the timeline for forwarding the recorded information to the superior officer under Section 42?", expectedId: "doc_sec42_3" },
    { query: "Does Section 42 apply to public places and transit searches?", expectedId: "doc_sec42_4" },

    // Section 50 / Personal Search (5)
    { query: "What are the documentation and procedural requirements for conducting a personal search under Section 50?", expectedId: "doc_sec50_1" },
    { query: "Does Section 50 personal search safeguard apply to bags, briefcases, purses, or vehicles?", expectedId: "doc_sec50_2" },
    { query: "Is a lady's handbag or purse legally classified as an apparel of the body under Section 50?", expectedId: "doc_sec50_3" },
    { query: "What are the documentation rules for female search under Section 50(4)?", expectedId: "doc_sec50_4" },
    { query: "How is emergency personal search documented when taking the suspect to a Gazetted Officer is impracticable?", expectedId: "doc_sec50_5" },

    // Search & Seizure (4)
    { query: "What information must be documented in a Search and Seizure Memo in an NDPS case?", expectedId: "doc_search_1" },
    { query: "Are independent pancha witnesses mandatory for an NDPS search and seizure memo?", expectedId: "doc_search_2" },
    { query: "How should contraband weight and packaging be documented at the spot?", expectedId: "doc_search_3" },
    { query: "Is a spot field drug testing kit report mandatory to attach to seizure documentation?", expectedId: "doc_search_4" },

    // Rukka / FIR (3)
    { query: "What is a rukka and what role does it play in registering an NDPS First Information Report FIR?", expectedId: "doc_rukka_1" },
    { query: "Is physical transmission of rukka by a constable legally mandated by the NDPS Act itself?", expectedId: "doc_rukka_2" },
    { query: "What are the documentation requirements for FIR transmission to the jurisdictional Magistrate?", expectedId: "doc_rukka_3" },

    // Section 55 (3)
    { query: "What are the duties of the Station House Officer SHO upon production of seized articles under Section 55?", expectedId: "doc_sec55_1" },
    { query: "Does Section 55 state that the SHO must never break the seal?", expectedId: "doc_sec55_2" },
    { query: "What entries must be maintained in the Malkhana register under Section 55?", expectedId: "doc_sec55_3" },

    // Section 57 (3)
    { query: "What are the official documentation and reporting requirements under Section 57 of the NDPS Act?", expectedId: "doc_sec57_1" },
    { query: "What is the legal consequence of failing to comply strictly with the 48-hour timeline under Section 57?", expectedId: "doc_sec57_2" },
    { query: "What details must be included in a Section 57 report?", expectedId: "doc_sec57_3" },

    // Section 52A (5)
    { query: "What are the mandatory requirements for inventory, photographs, and sampling under Section 52A?", expectedId: "doc_sec52a_1" },
    { query: "Is sampling done at the spot by the Investigating Officer valid primary evidence under Section 52A?", expectedId: "doc_sec52a_2" },
    { query: "Does the Magistrate physically break seals and reweigh all seized goods during Section 52A proceedings?", expectedId: "doc_sec52a_3" },
    { query: "What application format is submitted by the investigating agency to the Magistrate under Section 52A?", expectedId: "doc_sec52a_4" },
    { query: "What is the procedure for disposal or destruction of seized narcotics under Section 52A?", expectedId: "doc_sec52a_5" },

    // NCB Forms / Reporting (3)
    { query: "What is the official status and requirement of the NCB Seizure Report Government Reporting Form?", expectedId: "doc_ncb_1" },
    { query: "Is every NDPS case strictly required to use a standardized NCB reporting form in triplicate under the statute?", expectedId: "doc_ncb_2" },
    { query: "What forwarding documents accompany contraband samples to the Forensic Science Laboratory CFSL FSL?", expectedId: "doc_ncb_3" },

    // Adversarial / Edge Cases (5)
    { query: "Is a purse always personal search under Section 50?", expectedId: "doc_sec50_3" },
    { query: "Is physical rukka transmission mandatory?", expectedId: "doc_rukka_2" },
    { query: "Does the SHO have to break the seal?", expectedId: "doc_sec55_2" },
    { query: "Is every NDPS case required to use the NCB form?", expectedId: "doc_ncb_2" },
    { query: "What information must be documented in a Search and Seizure Memo and are there exactly ten mandatory documents?", expectedId: "doc_search_1" }
  ];

  let top1Correct = 0;
  let top3Correct = 0;

  for (let i = 0; i < testQueries.length; i++) {
    const t = testQueries[i];
    const results = await engine.retrieve(t.query, 3);
    const top1 = results[0]?.record.record_id;
    const top3Ids = results.map(r => r.record.record_id);

    const isTop1 = top1 === t.expectedId;
    const isTop3 = top3Ids.includes(t.expectedId);

    if (isTop1) top1Correct++;
    if (isTop3) top3Correct++;

    console.log(`[QUERY ${i+1}/${testQueries.length}] Query: "${t.query.substring(0, 50)}..." -> Top-1 Match: ${isTop1 ? 'YES' : 'NO'} (Got: ${top1}, Expected: ${t.expectedId})`);
  }

  console.log('========================================');
  console.log(`Total Documentation Queries: ${testQueries.length}`);
  console.log(`Top-1 Correct: ${top1Correct} / ${testQueries.length} (${((top1Correct/testQueries.length)*100).toFixed(1)}%)`);
  console.log(`Top-3 Correct: ${top3Correct} / ${testQueries.length} (${((top3Correct/testQueries.length)*100).toFixed(1)}%)`);
  console.log('========================================');

  if (top1Correct >= testQueries.length * 0.9 && top3Correct === testQueries.length) {
    console.log('✅ DOCUMENTATION BENCHMARK PASSED WITH EXCELLENT RELEVANCE!');
  } else {
    console.log('❌ DOCUMENTATION BENCHMARK COMPLETED WITH SOME MISMATCHES.');
  }
}

runDocumentationBenchmark().catch(console.error);
