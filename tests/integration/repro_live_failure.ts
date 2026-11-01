import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore, CaseContext } from '../../src/server/caseStore';

async function runReproduction() {
  console.log("=== RUNNING REPRODUCTION OF LIVE FAILURE ===\n");
  
  let history: { role: 'user' | 'assistant'; content: string }[] = [];
  
  // 1. Initialize case store for this test
  const caseId = 'repro_case_' + Date.now();
  
  // Helper to print state
  const logState = (res: any) => {
    console.log(`[Assistant Response]: ${res.answer.substring(0, 200)}...`);
  }

  // Initial minimal context
  let context: CaseContext = {
      case_id: caseId,
      case_title: 'Repro Case',
      document_type: 'NONE',
      fir_details: {},
      persons: [],
      vehicle: { type: '', registration_number: '', documents_checked: [], taken_into_possession: false, search_conducted: false },
      seizure: { substance: '', bags: '', total_quantity: '', place: '', sampling_done: false, sampling_description: '', sealing_done: false, sealing_description: '', ncb_triplicate_documentation: false },
      procedural_steps: [],
      procedural_steps_not_established: [],
      source_locations: []
  } as any;
  globalCaseStore.saveCase(context);

  // Turn 1: hi
  console.log("\nTurn 1: 'hi'");
  const res1 = await processInvestigatorQuery("hi", context, history);
  logState(res1);
  history.push({ role: 'user', content: "hi" }, { role: 'assistant', content: res1.answer });

  // Turn 2: Start case
  console.log("\nTurn 2: Start the fictional case...");
  const res2 = await processInvestigatorQuery("Start the fictional case using the facts I provided. Ask the first necessary question only.", context, history);
  logState(res2);
  history.push({ role: 'user', content: "Start the fictional case..." }, { role: 'assistant', content: res2.answer });

  // Turn 3: Scenario
  console.log("\nTurn 3: Scenario");
  const scenario = "I am an Investigation Officer posted at Police Station Sadar, Fictionpur, Punjab. On 28 October 2026, at approximately 7:30 PM, during routine patrolling on a fictional public road, my team encountered an adult person carrying a small sealed-looking packet. There was no prior secret information about this person or the packet. The substance has not been scientifically identified. No recovery or search procedure has yet been completed in this scenario. The person's identity, exact location, quantity or weight, witness details, search-related responses, seal particulars, and subsequent procedural actions are not yet known. This is a fictional software test.";
  const res3 = await processInvestigatorQuery(scenario, context, history);
  logState(res3);
  history.push({ role: 'user', content: scenario }, { role: 'assistant', content: res3.answer });

  // Turn 4: next
  console.log("\nTurn 4: 'next'");
  const res4 = await processInvestigatorQuery("next", context, history);
  logState(res4);
  history.push({ role: 'user', content: "next" }, { role: 'assistant', content: res4.answer });

  // Turn 5: unknown
  console.log("\nTurn 5: Mark unknown");
  const res5 = await processInvestigatorQuery("I do not know this detail yet. Mark it as unknown and continue with the next relevant question.", context, history);
  logState(res5);
  history.push({ role: 'user', content: "I do not know..." }, { role: 'assistant', content: res5.answer });

  console.log("\n=== REPRODUCTION COMPLETE ===");
}

runReproduction().catch(console.error);
