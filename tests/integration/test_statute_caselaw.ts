import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';
import { RetrievalEngine } from '../../src/server/retrieval';

async function run() {
  const engine = new RetrievalEngine();
  await new Promise(res => setTimeout(res, 2000)); // Wait for index load
  
  const queries = [
    "What does Section 50 provide?",
    "What has the Supreme Court held regarding Section 50?",
    "What does Section 50 provide and what has the Supreme Court held?",
    "Is the Supreme Court interpretation itself written in Section 50?",
    "What does Section 37 provide?",
    "How has the Supreme Court interpreted Section 37?"
  ];
  
  for (const q of queries) {
    const retrieved = await engine.retrieve(q, 3);
    const result = synthesizeAuthoritativeAnswer(q, retrieved);
    console.log(`\nQuery: "${q}"`);
    console.log(`Answer:\n${result.answer}`);
    console.log(`Top Source Type: ${retrieved[0]?.record?.source_type}`);
  }
}

run().catch(console.error);
