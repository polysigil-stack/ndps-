import { RetrievalEngine } from '../../src/server/retrieval';
import fs from 'fs';

async function runBenchmark() {
  const engine = new RetrievalEngine();

  const benchmarkCases = [
    // Chunk 1
    { query: 'What is the NDPS Act?', expected: 'rec_chunk_1', category: 'Chunk 1' },
    { query: 'What does the NDPS Act regulate?', expected: 'rec_chunk_1', category: 'Chunk 1' },
    { query: 'What is the Narcotic Drugs and Psychotropic Substances Act?', expected: 'rec_chunk_1', category: 'Chunk 1' },
    { query: 'What law governs narcotic drugs in India?', expected: 'rec_chunk_1', category: 'Chunk 1' },
    { query: 'Explain the NDPS Act, 1985.', expected: 'rec_chunk_1', category: 'Chunk 1' },

    // Chunk 2
    { query: 'What is the difference between NDPS and PIT NDPS?', expected: 'rec_chunk_2', category: 'Chunk 2' },
    { query: 'How is PIT NDPS different from NDPS?', expected: 'rec_chunk_2', category: 'Chunk 2' },
    { query: 'Is PIT NDPS a criminal law?', expected: 'rec_chunk_2', category: 'Chunk 2' },
    { query: 'Which Act deals with preventive detention?', expected: 'rec_chunk_2', category: 'Chunk 2' },
    { query: 'Difference between criminal punishment and preventive detention under NDPS laws.', expected: 'rec_chunk_2', category: 'Chunk 2' },

    // Chunk 3
    { query: 'Under which Act is an NDPS conviction recorded?', expected: 'rec_chunk_3', category: 'Chunk 3' },
    { query: 'Can preventive detention result in conviction?', expected: 'rec_chunk_3', category: 'Chunk 3' },
    { query: 'Who awards conviction under the NDPS Act?', expected: 'rec_chunk_3', category: 'Chunk 3' },
    { query: 'Does PIT NDPS detention mean a person is convicted?', expected: 'rec_chunk_3', category: 'Chunk 3' },
    { query: 'Is preventive detention the same as criminal prosecution?', expected: 'rec_chunk_3', category: 'Chunk 3' },

    // Chunk 4
    { query: 'What is Section 10 of PIT NDPS?', expected: 'rec_chunk_4', category: 'Chunk 4' },
    { query: 'What does Section 10 provide?', expected: 'rec_chunk_4', category: 'Chunk 4' },
    { query: 'When can a Section 10 declaration be made?', expected: 'rec_chunk_4', category: 'Chunk 4' },
    { query: 'What is the Section 10 declaration?', expected: 'rec_chunk_4', category: 'Chunk 4' },
    { query: 'Which PIT NDPS section deals with highly vulnerable areas?', expected: 'rec_chunk_4', category: 'Chunk 4' },

    // Chunk 5
    { query: 'What is Section 11 of PIT NDPS?', expected: 'rec_chunk_5', category: 'Chunk 5' },
    { query: 'What is the maximum detention period under PIT NDPS?', expected: 'rec_chunk_5', category: 'Chunk 5' },
    { query: 'How long can preventive detention continue under PIT NDPS?', expected: 'rec_chunk_5', category: 'Chunk 5' },
    { query: 'When is the detention period two years?', expected: 'rec_chunk_5', category: 'Chunk 5' },
    { query: 'What is the one-year detention period under PIT NDPS?', expected: 'rec_chunk_5', category: 'Chunk 5' },

    // Chunk 6
    { query: 'What is Section 31A of NDPS?', expected: 'rec_chunk_6', category: 'Chunk 6' },
    { query: 'Is there a death penalty under NDPS?', expected: 'rec_chunk_6', category: 'Chunk 6' },
    { query: 'Does NDPS law provide for death penalty?', expected: 'rec_chunk_6', category: 'Chunk 6' },
    { query: 'What punishment is provided under Section 31A?', expected: 'rec_chunk_6', category: 'Chunk 6' },
    { query: 'What happens for repeat offences under Section 31A?', expected: 'rec_chunk_6', category: 'Chunk 6' },

    // Adversarial
    { query: 'What is Section 10 of NDPS?', expected: 'rec_chunk_4', category: 'Adversarial' },
    { query: 'What is Section 11 of NDPS?', expected: 'rec_chunk_5', category: 'Adversarial' },
    { query: 'What is Section 31A of PIT NDPS?', expected: 'rec_chunk_6', category: 'Adversarial' },
    { query: 'What is Section 10 of PIT NDPS and how long is detention?', expected: 'rec_chunk_4', category: 'Adversarial' },
    { query: 'What is Section 11 of PIT NDPS and is there a death penalty?', expected: 'rec_chunk_5', category: 'Adversarial' },

    // Unrelated
    { query: 'What is the capital of India?', expected: 'NONE', category: 'Unrelated' },
    { query: 'How does a firewall work?', expected: 'NONE', category: 'Unrelated' },
    { query: 'What is Section 420 IPC?', expected: 'NONE', category: 'Unrelated' },
    { query: 'What is the punishment for theft?', expected: 'NONE', category: 'Unrelated' },
    { query: 'How does DNS work?', expected: 'NONE', category: 'Unrelated' }
  ];

  let top1Correct = 0;
  let top3Correct = 0;
  let totalNDPS = 0;
  let falsePositives = 0;
  let totalUnrelated = 0;

  console.log('=' .repeat(80));
  console.log('NDPS RAG RETRIEVAL BENCHMARK EVALUATION');
  console.log('=' .repeat(80) + '\n');

  for (let i = 0; i < benchmarkCases.length; i++) {
    const tc = benchmarkCases[i];
    const results = await engine.retrieve(tc.query, 3);
    const top1 = results[0];
    const top3Ids = results.map(r => r.record.record_id);

    if (tc.category === 'Unrelated') {
      totalUnrelated++;
      // Unrelated query is a false positive if a canonical NDPS chunk is returned as top-1 with score > 1.0
      const isTop1Canonical = top1?.record?.record_id?.startsWith('rec_chunk_');
      const isFalsePositive = isTop1Canonical && top1.score > 1.0;
      if (isFalsePositive) falsePositives++;

      console.log(`[QUERY ${i + 1}] Category: ${tc.category}`);
      console.log(`Query: "${tc.query}"`);
      console.log(`Expected: ${tc.expected}`);
      console.log(`Top-1 Record: ${top1?.record?.record_id} (${top1?.record?.source})`);
      console.log(`Top-3 Records: [${top3Ids.join(', ')}]`);
      console.log(`Top-1 Score: ${top1 ? top1.score.toFixed(3) : 'N/A'}`);
      console.log(`False Positive: ${isFalsePositive ? 'YES' : 'NO'}`);
      console.log('-'.repeat(60));
    } else {
      totalNDPS++;
      const isTop1Match = top1?.record?.record_id === tc.expected;
      const isTop3Match = top3Ids.includes(tc.expected);

      if (isTop1Match) top1Correct++;
      if (isTop3Match) top3Correct++;

      console.log(`[QUERY ${i + 1}] Category: ${tc.category}`);
      console.log(`Query: "${tc.query}"`);
      console.log(`Expected: ${tc.expected}`);
      console.log(`Top-1 Record: ${top1?.record?.record_id} (${top1?.record?.source})`);
      console.log(`Top-3 Records: [${top3Ids.join(', ')}]`);
      console.log(`Top-1 Score: ${top1 ? top1.score.toFixed(3) : 'N/A'}`);
      console.log(`Correct Top-1: ${isTop1Match ? 'YES' : 'NO'}`);
      console.log(`Correct Top-3: ${isTop3Match ? 'YES' : 'NO'}`);
      console.log('-'.repeat(60));
    }
    await new Promise(res => setTimeout(res, 200));
  }

  const top1Acc = (top1Correct / totalNDPS) * 100;
  const top3Rec = (top3Correct / totalNDPS) * 100;
  const fpRate = (falsePositives / totalUnrelated) * 100;

  console.log('\n========================================');
  console.log('SUMMARY METRICS');
  console.log('========================================');
  console.log(`Total NDPS Queries Evaluated: ${totalNDPS}`);
  console.log(`Top-1 Correct: ${top1Correct} / ${totalNDPS}`);
  console.log(`Top-1 Accuracy: ${top1Acc.toFixed(1)}%`);
  console.log(`Top-3 Correct: ${top3Correct} / ${totalNDPS}`);
  console.log(`Top-3 Recall: ${top3Rec.toFixed(1)}%`);
  console.log(`Total Unrelated Queries: ${totalUnrelated}`);
  console.log(`False Positives: ${falsePositives} / ${totalUnrelated}`);
  console.log(`Unrelated False Positive Rate: ${fpRate.toFixed(1)}%`);
  console.log('========================================\n');
}

runBenchmark();
