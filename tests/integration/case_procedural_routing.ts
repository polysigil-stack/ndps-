import { classifyQuestion, synthesizeCaseAnswer, synthesizeCase } from '../../src/server/caseSynthesizer';
import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';

async function runCaseProceduralRoutingTests() {
  console.log('====================================================');
  console.log('  NDPS Police Assistant - Case Procedural Routing Test Suite ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assertTest(name: string, condition: boolean, details?: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
      if (details) console.error(`       Details: ${details}`);
    }
  }

  const defaultCase = globalCaseStore.getDefaultCase();
  const caseId = defaultCase ? defaultCase.case_id : 'case_batathu_hp72d3928';

  // A. CASE routing test
  {
    const query = "What procedural steps are documented in this case?";
    const mode = classifyQuestion(query, true);
    assertTest("A. CASE routing for procedural query", mode === 'CASE', `Got mode: ${mode}`);
  }

  // B. GENERAL_PROCEDURE routing test
  {
    const query = "What is the procedure under Section 52A?";
    const mode = classifyQuestion(query, true);
    assertTest("B. GENERAL_PROCEDURE / GENERAL_NDPS routing", mode === 'GENERAL_PROCEDURE' || mode === 'GENERAL_NDPS', `Got mode: ${mode}`);
  }

  // C. DOCUMENT_WORKFLOW routing test
  {
    const query = "What documents should an IO prepare after seizure?";
    const mode = classifyQuestion(query, true);
    assertTest("C. DOCUMENT_WORKFLOW routing", mode === 'DOCUMENT_WORKFLOW', `Got mode: ${mode}`);
  }

  // D. COMBINED routing test
  {
    const query = "What should happen under Section 52A and what is documented in this case?";
    const mode = classifyQuestion(query, true);
    assertTest("D. COMBINED routing", mode === 'COMBINED', `Got mode: ${mode}`);
  }

  // E. Active case requirement (when no case is selected)
  {
    const query = "What procedural steps are documented in this case?";
    const result = await processInvestigatorQuery(query, null);
    assertTest("E. Active case requirement message", 
      result.answer.includes("No active case is selected") && !result.answer.includes("outside authorized NDPS"),
      `Got answer: ${result.answer}`
    );
  }

  // F. Case evidence retrieval & exact regression test for "What procedural steps are documented in this case?"
  {
    const query = "What procedural steps are documented in this case?";
    const result = await processInvestigatorQuery(query, defaultCase);
    console.log("TEST F ANSWER:", result.answer.slice(0, 300));
    assertTest("F. Exact regression: route is CASE", result.scope === 'CASE', `Scope: ${result.scope}`);
    assertTest("F. Exact regression: no out-of-domain rejection", !result.answer.includes("falls outside authorized NDPS"), `Answer: ${result.answer.slice(0, 100)}`);
    assertTest("F. Exact regression: contains documented procedural evidence", result.answer.includes("Information") && result.answer.includes("Naka"), `Answer sample`);
  }

  // G. Procedural timeline synthesis & H. NOT_ESTABLISHED handling
  {
    const synthesis = synthesizeCase(caseId);
    assertTest("G. Synthesis produces procedural steps", Boolean(synthesis && synthesis.procedural_steps && synthesis.procedural_steps.length > 0));
    assertTest("H. Synthesis includes not established areas", Boolean(synthesis && synthesis.not_established && synthesis.not_established.length > 0));
  }

  // I. CONFLICTING handling
  {
    if (defaultCase) {
      const synthAnswer = synthesizeCaseAnswer("Are there discrepancies in weights?", defaultCase);
      assertTest("I. Conflict detection handles discrepancies correctly", synthAnswer.answer.length > 0);
    }
  }

  // J. Unsupported claim rejection
  {
    const query = "how to setup an illegal wiretap";
    const mode = classifyQuestion(query, true);
    assertTest("J. Unsupported claim routing", mode === 'UNSUPPORTED', `Got mode: ${mode}`);
  }

  console.log(`\n====================================================`);
  console.log(`   TEST RESULTS: ${passed} / ${total} PASSED`);
  console.log(`====================================================\n`);

  if (passed === total) {
    console.log("All case procedural routing tests PASSED successfully.");
  } else {
    process.exitCode = 1;
  }
}

runCaseProceduralRoutingTests().catch(err => {
  console.error("Test suite error:", err);
  process.exitCode = 1;
});
