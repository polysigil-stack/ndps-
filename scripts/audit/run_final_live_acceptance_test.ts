import { answerGenerator } from '../../src/server/gemini';
import { globalCaseStore } from '../../src/server/caseStore';

async function runLiveAcceptanceTest() {
  console.log("================================================================");
  console.log("STARTING FINAL LIVE ACCEPTANCE TEST");
  console.log("================================================================\n");

  // 1. Create a brand-new case
  const sessionId = 'acceptance_test_' + Date.now();
  const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
  console.log(`Created new session case: ${caseContext.case_id}`);

  let history: { role: 'user' | 'assistant'; content: string }[] = [];

  // Scenario
  const scenario = "I am an investigation officer on routine patrol. I encounter an adult carrying a small packet of suspected contraband on a fictional public road. There was no prior secret information. The substance has not been identified, and no search or seizure details have been established.";
  
  console.log("\n--- ENTERING SCENARIO ---");
  await answerGenerator.generateAnswer(scenario, [], history, undefined, caseContext);
  history.push({ role: 'user', content: scenario });
  console.log("Scenario context set.");

  // Test Messages
  const testMessages = [
    "What procedural steps are documented in this case?",
    "What is the first document in the configured Chance Recovery workflow?",
    "Give me the template for the same."
  ];

  for (const message of testMessages) {
    console.log(`\nUser: ${message}`);
    const res = await answerGenerator.generateAnswer(message, [], history, undefined, caseContext);
    console.log(`Assistant: ${res.answer}`);
    history.push({ role: 'user', content: message }, { role: 'assistant', content: res.answer });
  }

  console.log("\n--- FINAL STATE SNAPSHOT ---");
  console.log(`Active Stage: ${caseContext.current_stage}`);
  console.log(`Confirmed Facts: ${JSON.stringify(caseContext.confirmed_facts)}`);
  console.log(`Unresolved Fields: ${JSON.stringify(caseContext.procedural_steps_not_established)}`);
  console.log(`Linked Documents: ${caseContext.documents.length}`);
}

runLiveAcceptanceTest().catch((err) => {
  console.error("Fatal error in live acceptance test:", err);
  process.exit(1);
});
