import { RetrievalEngine } from '../../src/server/retrieval';

async function run() {
  const engine = new RetrievalEngine();
  await new Promise(res => setTimeout(res, 2000)); // wait for init

  const queries = [
    "Supreme Court interpretation of Section 37",
    "Supreme Court interpretation of Section 50",
    "Supreme Court interpretation of Section 52A",
    "Supreme Court interpretation of Section 42",
    "Supreme Court interpretation of Section 54",
    "Supreme Court interpretation of Section 67",
    "What does Section 50 provide and how has the Supreme Court interpreted it?",
    "What does Section 37 provide and how is it applied by the Supreme Court?",
    "What does Section 52A provide and what has the Supreme Court held about compliance?",
    "What does Section 50 say in the Act?",
    "What has the Supreme Court held regarding Section 50?"
  ];

  for (const q of queries) {
    const res = await engine.retrieve(q, 3);
    console.log(`\nQuery: "${q}"`);
    for (let i = 0; i < Math.min(3, res.length); i++) {
      console.log(`  [${i+1}] ${res[i].record.record_id} (Score: ${res[i].score.toFixed(3)}) - ${res[i].record.source_type} - ${res[i].record.source}`);
    }
  }
}
run().catch(console.error);
