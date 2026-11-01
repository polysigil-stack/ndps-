import { AnswerGenerator } from '../../src/server/gemini';
import { RetrievalEngine } from '../../src/server/retrieval';

async function main() {
  const retrieval = new RetrievalEngine();
  const generator = new AnswerGenerator();
  
  const query = "A suspected narcotic substance was recovered from a person. What documents should the investigating officer prepare from the moment of search and recovery until the sample is deposited with the FSL? Give me the complete step-by-step checklist, required sections/fields in every document, applicable NDPS provisions, and a sample professional format for each document.";
  
  console.log("Query:", query);
  const retrieved = await retrieval.retrieve(query, 8);
  console.log("Retrieved count:", retrieved.length, "Top score:", retrieved[0]?.score);
  
  const res = await generator.generateAnswer(query, retrieved, []);
  console.log("=== RESPONSE ===");
  console.log(res.answer);
}

main();
