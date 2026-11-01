import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';
import { RetrievalEngine } from '../../src/server/retrieval';

async function run() {
  const engine = new RetrievalEngine();
  await new Promise(res => setTimeout(res, 2000));
  
  const queries = [
    "What has the Supreme Court held in the case of State of Maharashtra v. Some Fake Name?",
    "Does Section 120 of the NDPS Act say that a bag search is valid?",
    "What has the Supreme Court held about Section 138 of the Income Tax Act?",
    "What did the Supreme Court say about Section 19 of the NDPS Act?"
  ];
  
  for (const q of queries) {
    const retrieved = await engine.retrieve(q, 3);
    const result = synthesizeAuthoritativeAnswer(q, retrieved);
    console.log(`\nQuery: "${q}"`);
    console.log(`Answer: ${result.answer}`);
  }
}

run().catch(console.error);
