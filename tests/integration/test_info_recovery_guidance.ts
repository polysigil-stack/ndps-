import { answerGenerator } from '../../src/server/gemini';
import { globalCaseStore } from '../../src/server/caseStore';
import { templateRegistry } from '../../src/server/templateRegistry';

async function runInfoRecoveryGuidanceTest() {
  console.log("==========================================================================");
  console.log("TESTING INFORMATION-BASED RECOVERY GUIDANCE & PREMISES/PERSONAL SEARCH SCENARIO");
  console.log("==========================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, actual?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
      if (actual) console.log(`      Actual Output: ${actual.substring(0, 400)}...\n`);
      failed++;
    }
  }

  const sessionId = 'info_guidance_test_' + Date.now();
  const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
  let history: { role: 'user' | 'assistant'; content: string }[] = [];

  const query = "I received information from the Superintendent of Police that a person would be bringing heroin to his house. My team reached the house and intercepted him. I have not yet told you whether we searched the house or conducted his personal search. First explain what I, as the IO, must do. Do not generate a document yet.";
  console.log(`User Query: "${query}"\n`);

  const res = await answerGenerator.generateAnswer(query, [], history, undefined, caseContext);
  console.log(`Response Preview:\n${res.answer.substring(0, 600)}...\n`);

  assert(caseContext.recovery_pathway === 'INFORMATION_BASED', "Information-Based pathway recognized");
  assert(res.answer.includes("IO को इस चरण में क्या करना है"), "IO guidance appears first under 'IO को इस चरण में क्या करना है'");
  assert(res.answer.includes("परिसर तलाशी बनाम व्यक्तिगत तलाशी") || res.answer.includes("Premises Search"), "Distinguishes premises search from personal search");
  assert(res.answer.includes("प्रथम प्रश्न") || res.answer.includes("Clarifying Question"), "Asks one relevant clarifying question");
  assert(!res.answer.includes("### तैयार किया गया दस्तावेज़") && !res.answer.includes("```text"), "Does NOT generate a completed document yet when facts are missing");

  console.log("\n================================================================");
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================");

  if (failed > 0) process.exit(1);
}

runInfoRecoveryGuidanceTest().catch(err => {
  console.error("Fatal error in test:", err);
  process.exit(1);
});
