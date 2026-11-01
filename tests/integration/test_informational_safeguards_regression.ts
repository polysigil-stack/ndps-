import { answerGenerator } from '../../src/server/gemini';
import { globalCaseStore } from '../../src/server/caseStore';
import { templateRegistry } from '../../src/server/templateRegistry';

async function runInformationalSafeguardsSuite() {
  console.log("================================================================");
  console.log("STARTING TARGETED INFORMATIONAL SAFEGUARDS REGRESSION SUITE");
  console.log("================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, actual?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
      if (actual) console.log(`      Actual Output: ${actual.substring(0, 300)}...`);
      failed++;
    }
  }

  // SCENARIO D.1: "What procedural steps are documented in this case?"
  // Must NOT store query string into 'दिनांक' or any other field; must answer procedural inquiry; must preserve stage.
  console.log("--- SCENARIO D.1: Procedural steps inquiry must not become confirmed fact ---");
  {
    const sessionId = 'safeguard_d1_' + Date.now();
    const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
    caseContext.recovery_pathway = 'CHANCE_RECOVERY';
    caseContext.current_stage = 1;
    caseContext.active_mode = 'GUIDED';
    caseContext.confirmed_facts = {};

    const query = "What procedural steps are documented in this case?";
    const res = await answerGenerator.generateAnswer(query, [], [], undefined, caseContext);

    assert(caseContext.confirmed_facts['दिनांक'] === undefined, "दिनांक must NOT be set to query string", caseContext.confirmed_facts['दिनांक']);
    assert(Object.keys(caseContext.confirmed_facts).length === 0, "No confirmed facts should be created from procedural query", JSON.stringify(caseContext.confirmed_facts));
    assert(caseContext.current_stage === 1, "Active stage must remain Stage 1", `Stage: ${caseContext.current_stage}`);
    assert(res.answer.includes("Procedural Steps") || res.answer.includes("procedural") || res.answer.includes("Stage 1"), "Must return substantive procedural response", res.answer);
    assert(res.answer.includes("Preserving active stage") || res.answer.includes("Stage 1"), "Must note stage preservation", res.answer);
  }

  // SCENARIO D.2: "give me template for the same"
  // Must NOT store query string into 'समय' or any other field; must display Stage proforma; must preserve stage.
  console.log("\n--- SCENARIO D.2: 'give me template for the same' must not become confirmed fact ---");
  {
    const sessionId = 'safeguard_d2_' + Date.now();
    const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
    caseContext.recovery_pathway = 'CHANCE_RECOVERY';
    caseContext.current_stage = 1;
    caseContext.active_mode = 'GUIDED';
    caseContext.confirmed_facts = { 'दिनांक': '28 October 2026' };

    const query = "give me template for the same";
    const res = await answerGenerator.generateAnswer(query, [], [], undefined, caseContext);

    assert(caseContext.confirmed_facts['समय'] === undefined, "समय must NOT be set to template request string", caseContext.confirmed_facts['समय']);
    assert(caseContext.confirmed_facts['दिनांक'] === '28 October 2026', "Pre-existing confirmed fact must be preserved", caseContext.confirmed_facts['दिनांक']);
    assert(caseContext.current_stage === 1, "Active stage must remain Stage 1", `Stage: ${caseContext.current_stage}`);
    assert(res.answer.includes("chance_recovery_01"), "Must display template metadata with stable ID chance_recovery_01", res.answer);
    assert(res.answer.includes("SOURCE TEMPLATE PROFORMA"), "Must display authentic unaltered source proforma", res.answer);
    assert(res.answer.includes("CRITICAL FACT PRESERVATION"), "Must include procedural action & verification warning", res.answer);
  }

  // SCENARIO D.3: "what is the first document i need to prepare"
  // Must NOT be stored as a fact; must return Stage 1 फर्द वरामदगी; must preserve active stage.
  console.log("\n--- SCENARIO D.3: 'what is the first document i need to prepare' must not become confirmed fact ---");
  {
    const sessionId = 'safeguard_d3_' + Date.now();
    const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
    caseContext.recovery_pathway = 'CHANCE_RECOVERY';
    caseContext.current_stage = 2;
    caseContext.active_mode = 'GUIDED';
    caseContext.confirmed_facts = { 'दिनांक': '28 October 2026', 'समय': '7:30 PM', 'थाना': 'PS Sadar', 'आरोपी': 'John Doe' };

    const query = "what is the first document i need to prepare";
    const res = await answerGenerator.generateAnswer(query, [], [], undefined, caseContext);

    assert(res.answer.includes("फर्द वरामदगी मादक पदार्थ व मकबूजगी") || res.answer.includes("Stage 1"), "Must identify Stage 1 फर्द वरामदगी as first document", res.answer);
    assert(res.answer.includes("DISTINCTION"), "Must distinguish configured sequence from actual case actionability", res.answer);
    assert(caseContext.current_stage === 2, "Active stage must remain Stage 2", `Stage: ${caseContext.current_stage}`);
    assert(caseContext.confirmed_facts['आरोपी'] === 'John Doe', "Confirmed facts must remain unchanged", caseContext.confirmed_facts['आरोपी']);
    assert(!res.answer.includes("पिता_पति"), "Must not repeat current stage missing field prompt", res.answer);
  }

  // SCENARIO D.4: Narrative with suspected contraband but no established search or seizure
  // Must distinguish suspected possession from confirmed contraband; must note unknown facts; must not assert procedural acts occurred.
  console.log("\n--- SCENARIO D.4: Suspected possession vs confirmed recovery separation in narrative ---");
  {
    const sessionId = 'safeguard_d4_' + Date.now();
    const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);

    const narrative = "I am an Investigation Officer posted at Police Station Sadar, Fictionpur, Punjab. On 28 October 2026, at approximately 7:30 PM, during routine patrolling on a fictional public road, my team encountered an adult person carrying a small sealed-looking packet. There was no prior secret information about this person or the packet. The substance has not been scientifically identified. No recovery or search procedure has yet been completed in this scenario. The person's identity, exact location, quantity or weight, witness details, search-related responses, seal particulars, and subsequent procedural actions are not yet known. This is a fictional software test.";
    const res = await answerGenerator.generateAnswer(narrative, [], [], undefined, caseContext);

    assert(res.answer.includes("Provisional Classification"), "Must contain visible provisional classification section", res.answer);
    assert(res.answer.includes("On-the-Spot Recovery (Chance Recovery)") || res.answer.includes("Chance Recovery"), "Must select Chance Recovery", res.answer);
    assert(res.answer.includes("Four-Point Separation Test"), "Must visibly include Four-Point Separation Test", res.answer);
    assert(res.answer.includes("SUSPECTED POSSESSION") || res.answer.includes("Suspected Possession"), "Must distinguish suspected possession from confirmed recovery", res.answer);
    assert(res.answer.includes("scientific") || res.answer.includes("chemical") || res.answer.includes("substance has not been scientifically identified"), "Must note substance is not scientifically identified", res.answer);
    assert(res.answer.includes("Step 1 of 14"), "Must activate Step 1 of 14", res.answer);
    assert(caseContext.confirmed_facts['दिनांक'] === '28 October 2026', "Extracted date must be confirmed", caseContext.confirmed_facts['दिनांक']);
    assert(caseContext.confirmed_facts['समय'] === 'approximately 7:30 PM', "Extracted time must be confirmed", caseContext.confirmed_facts['समय']);
  }

  // SCENARIO D.5: Informational query while a case has an unresolved date or time
  // Must NOT populate unresolved fields with informational text; must preserve stage.
  console.log("\n--- SCENARIO D.5: Informational query while date/time unresolved ---");
  {
    const sessionId = 'safeguard_d5_' + Date.now();
    const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
    caseContext.recovery_pathway = 'CHANCE_RECOVERY';
    caseContext.current_stage = 1;
    caseContext.active_mode = 'GUIDED';
    caseContext.confirmed_facts = { 'थाना': 'PS Sadar' }; // दिनांक and समय are missing

    const query = "tell me about NDPS Act Section 50";
    const res = await answerGenerator.generateAnswer(query, [], [], undefined, caseContext);

    assert(caseContext.confirmed_facts['दिनांक'] === undefined, "दिनांक must remain undefined after informational query", caseContext.confirmed_facts['दिनांक']);
    assert(caseContext.confirmed_facts['समय'] === undefined, "समय must remain undefined after informational query", caseContext.confirmed_facts['समय']);
    assert(caseContext.current_stage === 1, "Stage must remain Stage 1", `Stage: ${caseContext.current_stage}`);
    assert(res.answer.includes("Section 50") || res.answer.includes("personal search"), "Must provide substantive Section 50 information", res.answer);
  }

  // SCENARIO D.6: Template request while Guided Mode is active
  // Must return template proforma with metadata, confirmed facts, unknown facts, and required fields; must NOT advance stage.
  console.log("\n--- SCENARIO D.6: Template request in active Guided Mode ---");
  {
    const sessionId = 'safeguard_d6_' + Date.now();
    const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);
    caseContext.recovery_pathway = 'CHANCE_RECOVERY';
    caseContext.current_stage = 2;
    caseContext.active_mode = 'GUIDED';
    caseContext.confirmed_facts = { 'दिनांक': '28 October 2026', 'समय': '7:30 PM', 'स्थान': 'unknown' };

    const query = "show template for stage 2";
    const res = await answerGenerator.generateAnswer(query, [], [], undefined, caseContext);

    assert(caseContext.current_stage === 2, "Active stage must remain Stage 2 after template request", `Stage: ${caseContext.current_stage}`);
    assert(res.answer.includes("chance_recovery_02"), "Must return Stage 2 template ID chance_recovery_02", res.answer);
    assert(res.answer.includes("DIAGNOSTIC METADATA"), "Must include diagnostic metadata section", res.answer);
    assert(res.answer.includes("SOURCE TEMPLATE PROFORMA"), "Must include unaltered source template proforma", res.answer);
    assert(res.answer.includes("CASE FACT STATUS & MISSING FIELDS"), "Must include fact status section", res.answer);
    assert(res.answer.includes("दिनांक: 28 October 2026"), "Must show confirmed facts in template response", res.answer);
    assert(res.answer.includes("स्थान: unknown"), "Must show unknown facts distinctly in template response", res.answer);
    assert(res.answer.includes("Fields Still Required"), "Must show fields still required", res.answer);
    assert(res.answer.includes("PROCEDURAL ACTION & VERIFICATION WARNING"), "Must include procedural action warning", res.answer);
  }

  console.log("\n================================================================");
  console.log(`INFORMATIONAL SAFEGUARDS SUMMARY: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runInformationalSafeguardsSuite().catch((err) => {
  console.error("Fatal error in safeguards suite:", err);
  process.exit(1);
});
