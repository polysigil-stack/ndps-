import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore, CaseContext } from '../../src/server/caseStore';
import { templateRegistry } from '../../src/server/templateRegistry';

async function runInteractiveTests() {
  console.log("=== RUNNING INTERACTIVE WORKFLOW REGRESSION TESTS ===\n");
  
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, answer?: string) {
    if (condition) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  [FAIL] ${desc}`);
      if (answer) console.log(`    Actual Response: ${answer.substring(0, 500)}...`);
      failed++;
    }
  }

  function assertCaseInsensitive(str: string, pattern: string, desc: string, answer: string) {
      assert(str.toLowerCase().includes(pattern.toLowerCase()), desc, answer);
  }

  // Create test case
  const case1: CaseContext = {
      case_id: 'interactive_test_runtime',
      case_title: 'Test Case Runtime',
      document_type: 'TEST',
      source_document: 'test.pdf',
      pages: 1,
      ocr_status: 'none',
      documents: [],
      fir_details: {
        police_station: 'Police Station Sadar',
        district: 'Fictionpur',
        state: 'Punjab',
        fir_number: '123/2026',
        date: '28/10/2026',
        sections: [],
        informant_complainant: 'Test Officer',
        investigating_officer: 'Test IO'
      },
      persons: [],
      vehicle: { type: '', registration_number: '', documents_checked: [], taken_into_possession: false, search_conducted: false },
      seizure: { substance: '', bags: '', total_quantity: '', place: '', sampling_done: false, sampling_description: '', sealing_done: false, sealing_description: '', ncb_triplicate_documentation: false },
      procedural_steps: [],
      procedural_steps_not_established: [],
      source_locations: []
  };
  globalCaseStore.saveCase(case1);
  let history: { role: 'user' | 'assistant'; content: string }[] = [];

  console.log("Turn 1: Start scenario");
  const narrative = "On 28 October 2026, at approximately 7:30 PM, during routine patrolling on a fictional road, my team encountered an adult person who appeared to be carrying a small packet containing suspected contraband. There was no prior secret information.";
  const res1 = await processInvestigatorQuery(narrative, case1, history);
  history.push({ role: 'user', content: narrative }, { role: 'assistant', content: res1.answer });
  assertCaseInsensitive(res1.answer, 'Step 1', "Should indicate Step 1", res1.answer);
  assertCaseInsensitive(res1.answer, '**Next Question**', "Should ask for a next field", res1.answer);
  assert(case1.current_stage === 1, "Should be at Stage 1");

  console.log("Turn 2: next");
  const res2 = await processInvestigatorQuery("next", case1, history);
  history.push({ role: 'user', content: "next" }, { role: 'assistant', content: res2.answer });
  assertCaseInsensitive(res2.answer, 'unresolved', "Should explain unresolved fields", res2.answer);
  assert(case1.current_stage === 1, "Should stay at Stage 1");

  console.log("Turn 3: unknown");
  const res3 = await processInvestigatorQuery("unknown", case1, history);
  history.push({ role: 'user', content: "unknown" }, { role: 'assistant', content: res3.answer });
  assert(case1.confirmed_facts?.['स्थान'] === 'unknown', "Location should be recorded as unknown");

  console.log("Turn 4: continue with unresolved fields");
  const res4 = await processInvestigatorQuery("continue with unresolved fields", case1, history);
  history.push({ role: 'user', content: "continue with unresolved fields" }, { role: 'assistant', content: res4.answer });
  assert(case1.current_stage === 3, "Should advance to Stage 3");

  console.log("Turn 5: review facts");
  const res5 = await processInvestigatorQuery("review facts", case1, history);
  history.push({ role: 'user', content: "review facts" }, { role: 'assistant', content: res5.answer });
  assert(case1.current_stage === 3, "Review should not advance stage");
  assertCaseInsensitive(res5.answer, 'Mode B', "Should enter Review mode", res5.answer);

  console.log("Turn 6: tell me about NDPS");
  const res6 = await processInvestigatorQuery("tell me about NDPS", case1, history);
  history.push({ role: 'user', content: "tell me about NDPS" }, { role: 'assistant', content: res6.answer });
  assert(case1.current_stage === 3, "Informational query should not advance stage");
  assertCaseInsensitive(res6.answer, 'NDPS Act', "Should return info", res6.answer);

  console.log("Turn 7: Resume Guided Investigation");
  const res7 = await processInvestigatorQuery("continue investigation", case1, history);
  history.push({ role: 'user', content: "continue investigation" }, { role: 'assistant', content: res7.answer });
  assert(case1.current_stage === 3, "Should resume at stage 3");

  console.log(`\n=== INTERACTIVE WORKFLOW TESTS SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
}

runInteractiveTests().catch(console.error);
