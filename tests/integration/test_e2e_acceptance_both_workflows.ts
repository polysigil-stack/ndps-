import { answerGenerator } from '../../src/server/gemini';
import { globalCaseStore } from '../../src/server/caseStore';
import { templateRegistry } from '../../src/server/templateRegistry';

async function runE2EAcceptanceTests() {
  console.log("==========================================================================");
  console.log("NDPS INTELLIGENCE — COMPREHENSIVE E2E CASE WORKFLOW ACCEPTANCE TEST");
  console.log("==========================================================================\n");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, desc: string, actual?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passedTests++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
      if (actual) console.log(`      Actual Output: ${actual.substring(0, 500)}...\n`);
      failedTests++;
    }
  }

  // =========================================================================
  // WORKFLOW 1: CHANCE RECOVERY — ALL 14 DOCUMENTS (STAGES 1 TO 14)
  // =========================================================================
  console.log("--------------------------------------------------------------------------");
  console.log("PART 1: CHANCE RECOVERY WORKFLOW (ALL 14 STAGES) — ISOLATED SYNTHETIC CASE");
  console.log("--------------------------------------------------------------------------\n");

  const chanceCaseId = 'e2e_synthetic_chance_' + Date.now();
  const chanceCase = globalCaseStore.getOrCreateSessionCase(chanceCaseId);
  let chanceHistory: { role: 'user' | 'assistant'; content: string }[] = [];

  // Stage 1 Activation: Routine Patrolling Incident
  const qStartChance = "During routine patrolling, my team stopped a man carrying a suspicious packet. There was no prior secret information. Help me start the NDPS case documentation, one document at a time. Don't assume facts I haven't provided.";
  console.log(`Turn 1.1: Activating Chance Recovery`);
  const r1_1 = await answerGenerator.generateAnswer(qStartChance, [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: qStartChance }, { role: 'assistant', content: r1_1.answer });

  assert(chanceCase.recovery_pathway === 'CHANCE_RECOVERY', "Chance Recovery pathway selected");
  assert(chanceCase.current_stage === 1, "Active stage initialized to Stage 1");
  assert(r1_1.answer.includes("IO को इस चरण में क्या करना है"), "Stage 1: IO guidance appears before fact collection");
  assert(r1_1.answer.includes("Next Question") && r1_1.answer.includes("दिनांक"), "Stage 1: Asks first missing field (दिनांक)");

  // Stage 1: Field Collection with Strict Fact Mapping & Contamination Prevention
  console.log(`Turn 1.2: Providing Date`);
  const r1_2 = await answerGenerator.generateAnswer("15 November 2026", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "15 November 2026" }, { role: 'assistant', content: r1_2.answer });
  assert(chanceCase.confirmed_facts?.['दिनांक'] === '15 November 2026', "Stage 1: Date mapped to 'दिनांक'");
  assert(!chanceCase.confirmed_facts?.['समय'] && !chanceCase.confirmed_facts?.['थाना'], "Stage 1: Date does NOT contaminate समय or थाना");

  console.log(`Turn 1.3: Providing Time`);
  const r1_3 = await answerGenerator.generateAnswer("10:30 AM", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "10:30 AM" }, { role: 'assistant', content: r1_3.answer });
  assert(chanceCase.confirmed_facts?.['समय'] === '10:30 AM', "Stage 1: Time mapped to 'समय'");
  assert(!chanceCase.confirmed_facts?.['थाना'], "Stage 1 CRITICAL: Time '10:30 AM' does NOT contaminate 'थाना'");

  console.log(`Turn 1.4: Providing Police Station`);
  const r1_4 = await answerGenerator.generateAnswer("Police Station City", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "Police Station City" }, { role: 'assistant', content: r1_4.answer });
  assert(chanceCase.confirmed_facts?.['थाना'] === 'Police Station City', "Stage 1: Police station mapped to 'थाना'");

  console.log(`Turn 1.5: Providing District`);
  const r1_5 = await answerGenerator.generateAnswer("District Synthetic", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "District Synthetic" }, { role: 'assistant', content: r1_5.answer });
  assert(chanceCase.confirmed_facts?.['जिला'] === 'District Synthetic', "Stage 1: District mapped to 'जिला'");

  console.log(`Turn 1.6: Providing Location`);
  const r1_6 = await answerGenerator.generateAnswer("Highway Toll Plaza", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "Highway Toll Plaza" }, { role: 'assistant', content: r1_6.answer });
  assert(chanceCase.confirmed_facts?.['स्थान'] === 'Highway Toll Plaza', "Stage 1: Location mapped to 'स्थान'");

  console.log(`Turn 1.7: Providing Substance`);
  const r1_7 = await answerGenerator.generateAnswer("चरस", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "चरस" }, { role: 'assistant', content: r1_7.answer });
  assert(chanceCase.confirmed_facts?.['पदार्थ'] === 'चरस', "Stage 1: Substance mapped to 'पदार्थ'");

  console.log(`Turn 1.8: Providing Weight (Last field of Stage 1)`);
  const r1_8 = await answerGenerator.generateAnswer("1.2 kg", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "1.2 kg" }, { role: 'assistant', content: r1_8.answer });
  assert(chanceCase.confirmed_facts?.['वजन'] === '1.2 kg', "Stage 1: Weight mapped to 'वजन'");
  assert(r1_8.answer.includes("```text") && r1_8.answer.includes("बरामदगी फर्द मौका"), "Stage 1: Completed document immediately generated inside code block", r1_8.answer);
  assert(r1_8.answer.includes("15 November 2026") && r1_8.answer.includes("Police Station City"), "Stage 1: Document filled with confirmed facts");
  assert(r1_8.answer.includes("दस्तावेज़ समीक्षा") && r1_8.answer.includes("पुष्टि करें"), "Stage 1: Review prompt displayed with options");
  assert(chanceCase.current_stage === 1, "Stage 1: Does NOT advance without explicit confirmation");

  // Document Fact Correction Test
  console.log(`Turn 1.9: Fact Correction (Location update)`);
  const r1_9 = await answerGenerator.generateAnswer("स्थान: Near Milestone 42", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "स्थान: Near Milestone 42" }, { role: 'assistant', content: r1_9.answer });
  assert(chanceCase.confirmed_facts?.['स्थान'] === 'Near Milestone 42' || chanceCase.confirmed_facts?.['स्थान']?.includes('Milestone 42'), "Stage 1: Location corrected to 'Near Milestone 42'");
  assert(r1_9.answer.includes("Milestone 42"), "Stage 1: Corrected location reflected in generated document");
  assert(chanceCase.current_stage === 1, "Stage 1: Still at Stage 1 after correction");

  // Explicit Confirmation -> Transition to Stage 2
  console.log(`Turn 1.10: Explicit Confirmation to Stage 2`);
  const r1_10 = await answerGenerator.generateAnswer("पुष्टि करें", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "पुष्टि करें" }, { role: 'assistant', content: r1_10.answer });
  assert(chanceCase.current_stage === 2, "Stage 2: Advanced to Stage 2 on confirmation");
  assert(r1_10.answer.includes("Step 2 of 14") && r1_10.answer.includes("धारा 50 NDPS Act"), "Stage 2: Header displays Step 2 of 14");
  assert(r1_10.answer.includes("IO को इस चरण में क्या करना है"), "Stage 2: IO guidance for Section 50 appears");
  assert(r1_10.answer.includes("Next Question") && r1_10.answer.includes("आरोपी"), "Stage 2: Prompts for accused name");

  // Stage 2: Section 50 Fact Collection
  console.log(`Turn 2.1: Accused name`);
  await answerGenerator.generateAnswer("Vikram Singh", [], chanceHistory, undefined, chanceCase);
  console.log(`Turn 2.2: Father name`);
  await answerGenerator.generateAnswer("Sardar Balwant Singh", [], chanceHistory, undefined, chanceCase);
  console.log(`Turn 2.3: Residence`);
  await answerGenerator.generateAnswer("Village Synthetic, District Synthetic", [], chanceHistory, undefined, chanceCase);
  console.log(`Turn 2.4: Accused response`);
  await answerGenerator.generateAnswer("मैं अपनी तलाशी राजपत्रित अधिकारी के सामने देना चाहता हूँ", [], chanceHistory, undefined, chanceCase);
  console.log(`Turn 2.5: Witness 1`);
  await answerGenerator.generateAnswer("Ramesh Chand", [], chanceHistory, undefined, chanceCase);
  console.log(`Turn 2.6: Witness 2`);
  await answerGenerator.generateAnswer("Suresh Kumar", [], chanceHistory, undefined, chanceCase);
  console.log(`Turn 2.7: Officer designation (Last field of Stage 2)`);
  const r2_7 = await answerGenerator.generateAnswer("SI Kuldeep Singh", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "SI Kuldeep Singh" }, { role: 'assistant', content: r2_7.answer });

  assert(r2_7.answer.includes("```text") && r2_7.answer.includes("धारा 50"), "Stage 2: Completed Section 50 notice generated in code block");
  assert(r2_7.answer.includes("Vikram Singh") && r2_7.answer.includes("Sardar Balwant Singh"), "Stage 2: Document contains accused particulars");
  assert(r2_7.answer.includes("दस्तावेज़ समीक्षा"), "Stage 2: Review prompt displayed");
  assert(chanceCase.current_stage === 2, "Stage 2: Does NOT advance without explicit confirmation");

  // Confirm Stage 2 -> Transition to Stage 3
  console.log(`Turn 2.8: Confirm Stage 2`);
  const r2_8 = await answerGenerator.generateAnswer("पुष्टि करें", [], chanceHistory, undefined, chanceCase);
  chanceHistory.push({ role: 'user', content: "पुष्टि करें" }, { role: 'assistant', content: r2_8.answer });
  assert(chanceCase.current_stage === 3, "Stage 3: Advanced to Stage 3");
  assert(r2_8.answer.includes("Step 3 of 14"), "Stage 3: Header displays Step 3 of 14");
  assert(r2_8.answer.includes("IO को इस चरण में क्या करना है"), "Stage 3: IO guidance appears");

  // Iterate through all remaining Chance Recovery stages: Stages 3 through 14
  console.log("\nIterating through Chance Recovery Stages 3 through 14...");
  for (let s = 3; s <= 14; s++) {
    const tmpl = templateRegistry.findTemplate('CHANCE_RECOVERY', s);
    assert(tmpl !== undefined, `Chance Recovery Stage ${s}: Template ${tmpl?.id} found in registry`);

    // Complete missing fields for current stage if any
    let currentMissing = tmpl?.fields.filter(f => !chanceCase.confirmed_facts![f] || chanceCase.confirmed_facts![f] === 'unresolved') || [];
    while (currentMissing.length > 0) {
      const field = currentMissing[0];
      const answerVal = (field.includes('वजन') || field.includes('weight')) ? '1.2 kg' :
                        (field.includes('दिनांक') || field.includes('date')) ? '15 November 2026' :
                        (field.includes('समय') || field.includes('time')) ? '10:30 AM' :
                        (field.includes('थाना') || field.includes('station')) ? 'Police Station City' :
                        (field.includes('जिला') || field.includes('district')) ? 'District Synthetic' :
                        (field.includes('पदार्थ') || field.includes('substance')) ? 'चरस' :
                        (field.includes('आरोपी') || field.includes('अभियुक्त')) ? 'Vikram Singh' :
                        `Synthetic Fact for ${field}`;
      await answerGenerator.generateAnswer(answerVal, [], chanceHistory, undefined, chanceCase);
      currentMissing = tmpl?.fields.filter(f => !chanceCase.confirmed_facts![f] || chanceCase.confirmed_facts![f] === 'unresolved') || [];
    }

    // Now all fields for stage s are accounted for -> Review prompt and completed doc must be present
    const revCheck = await answerGenerator.generateAnswer("समीक्षा", [], chanceHistory, undefined, chanceCase);
    assert(revCheck.answer.includes("IO को इस चरण में क्या करना है") || revCheck.answer.includes("तैयार किया गया दस्तावेज़") || revCheck.answer.includes("दस्तावेज़ समीक्षा"), `Chance Recovery Stage ${s}: Contains IO guidance or review/document`);
    assert(revCheck.answer.includes("```text"), `Chance Recovery Stage ${s}: Preformatted Hindi document rendered in code block`);

    // Explicit confirmation to advance to next stage
    const advRes = await answerGenerator.generateAnswer("पुष्टि करें", [], chanceHistory, undefined, chanceCase);
    chanceHistory.push({ role: 'user', content: "पुष्टि करें" }, { role: 'assistant', content: advRes.answer });

    if (s < 14) {
      assert(chanceCase.current_stage === s + 1, `Chance Recovery Stage ${s} -> Advanced to Stage ${s + 1} upon confirmation`);
      assert(advRes.answer.includes("IO को इस चरण में क्या करना है"), `Chance Recovery Stage ${s + 1}: IO guidance appears immediately upon step activation`);
    } else {
      assert(advRes.answer.includes("COMPLETED") || advRes.answer.includes("completed"), `Chance Recovery Stage 14: Terminal stage reports workflow completion`);
    }
  }

  // =========================================================================
  // WORKFLOW 2: INFORMATION-BASED RECOVERY — ALL 15 DOCUMENTS (STAGES 1 TO 15)
  // =========================================================================
  console.log("\n--------------------------------------------------------------------------");
  console.log("PART 2: INFORMATION-BASED WORKFLOW (ALL 15 STAGES) — ISOLATED SYNTHETIC CASE");
  console.log("--------------------------------------------------------------------------\n");

  const infoCaseId = 'e2e_synthetic_info_' + Date.now();
  const infoCase = globalCaseStore.getOrCreateSessionCase(infoCaseId);
  let infoHistory: { role: 'user' | 'assistant'; content: string }[] = [];

  // Stage 1 Activation: Prior Information
  const qStartInfo = "Help me start investigation documentation for Prior Information Recovery under Section 42 NDPS Act.";
  console.log(`Turn 2.1: Activating Prior Information Recovery`);
  const rInfo1 = await answerGenerator.generateAnswer(qStartInfo, [], infoHistory, undefined, infoCase);
  infoHistory.push({ role: 'user', content: qStartInfo }, { role: 'assistant', content: rInfo1.answer });

  assert(infoCase.recovery_pathway === 'INFORMATION_BASED', "Information-Based pathway selected");
  assert(infoCase.current_stage === 1, "Active stage initialized to Stage 1");
  assert(rInfo1.answer.includes("Step 1 of 15"), "Information-Based: Displays Step 1 of 15 header");
  assert(rInfo1.answer.includes("IO को इस चरण में क्या करना है"), "Information-Based Stage 1: IO guidance appears before fact collection");

  // Supply synthetic facts to infoCase
  infoCase.confirmed_facts = {
    'दिनांक': '20 November 2026',
    'समय': '04:00 PM',
    'थाना': 'Police Station Special Cell',
    'जिला': 'District Border',
    'स्थान': 'Secret Hideout, Warehouse 9',
    'पदार्थ': 'हेरोइन',
    'वजन': '2.5 kg',
    'आरोपी': 'Harpreet Singh',
    'पिता_पति': 'Gurdev Singh',
    'निवासी': 'Sector 4, Border Town'
  };

  // Iterate through all 15 Information-Based stages: Stages 1 through 15
  console.log("\nIterating through Information-Based Stages 1 through 15...");
  for (let s = 1; s <= 15; s++) {
    const tmpl = templateRegistry.findTemplate('INFORMATION_BASED', s);
    assert(tmpl !== undefined, `Information-Based Stage ${s}: Template ${tmpl?.id} found in registry`);

    // Complete missing fields for current stage if any
    let currentMissing = tmpl?.fields.filter(f => !infoCase.confirmed_facts![f] || infoCase.confirmed_facts![f] === 'unresolved') || [];
    while (currentMissing.length > 0) {
      const field = currentMissing[0];
      const answerVal = (field.includes('वजन') || field.includes('weight')) ? '2.5 kg' :
                        (field.includes('दिनांक') || field.includes('date')) ? '20 November 2026' :
                        (field.includes('समय') || field.includes('time')) ? '04:00 PM' :
                        (field.includes('थाना') || field.includes('station')) ? 'Police Station Special Cell' :
                        (field.includes('जिला') || field.includes('district')) ? 'District Border' :
                        (field.includes('पदार्थ') || field.includes('substance')) ? 'हेरोइन' :
                        (field.includes('आरोपी') || field.includes('अभियुक्त')) ? 'Harpreet Singh' :
                        `Synthetic Info Fact for ${field}`;
      await answerGenerator.generateAnswer(answerVal, [], infoHistory, undefined, infoCase);
      currentMissing = tmpl?.fields.filter(f => !infoCase.confirmed_facts![f] || infoCase.confirmed_facts![f] === 'unresolved') || [];
    }

    // Verify IO guidance and completed document review
    const revCheck = await answerGenerator.generateAnswer("समीक्षा", [], infoHistory, undefined, infoCase);
    assert(revCheck.answer.includes("IO को इस चरण में क्या करना है") || revCheck.answer.includes("तैयार किया गया दस्तावेज़") || revCheck.answer.includes("दस्तावेज़ समीक्षा"), `Information-Based Stage ${s}: Contains IO guidance or review prompt`);
    assert(revCheck.answer.includes("```text"), `Information-Based Stage ${s}: Preformatted Hindi document rendered in code block`);

    // Confirm to advance
    const advRes = await answerGenerator.generateAnswer("पुष्टि करें", [], infoHistory, undefined, infoCase);
    infoHistory.push({ role: 'user', content: "पुष्टि करें" }, { role: 'assistant', content: advRes.answer });

    if (s < 15) {
      assert(infoCase.current_stage === s + 1, `Information-Based Stage ${s} -> Advanced to Stage ${s + 1} upon confirmation`);
      assert(advRes.answer.includes("IO को इस चरण में क्या करना है"), `Information-Based Stage ${s + 1}: IO guidance appears upon activation`);
    } else {
      assert(advRes.answer.includes("COMPLETED") || advRes.answer.includes("completed"), `Information-Based Stage 15: Terminal stage reports workflow completion`);
    }
  }

  // =========================================================================
  // PART 3: CROSS-CASE ISOLATION & NO DATA LEAKAGE
  // =========================================================================
  console.log("\n--------------------------------------------------------------------------");
  console.log("PART 3: STRICT CASE DATA ISOLATION VERIFICATION");
  console.log("--------------------------------------------------------------------------\n");

  // Check 1: Chance Case facts did not leak into Information Case
  assert(infoCase.confirmed_facts?.['आरोपी'] === 'Harpreet Singh', "Info Case accused is 'Harpreet Singh'");
  assert(chanceCase.confirmed_facts?.['आरोपी'] === 'Vikram Singh', "Chance Case accused is 'Vikram Singh'");
  assert(infoCase.confirmed_facts?.['पदार्थ'] === 'हेरोइन', "Info Case substance is 'हेरोइन'");
  assert(chanceCase.confirmed_facts?.['पदार्थ'] === 'चरस', "Chance Case substance is 'चरस'");

  // Check 2: Fresh session has 0 facts and does NOT inherit Batathu or synthetic cases
  const freshSessionId = 'fresh_isolated_check_' + Date.now();
  const freshCase = globalCaseStore.getOrCreateSessionCase(freshSessionId);
  assert(Object.keys(freshCase.confirmed_facts || {}).length === 0, "Fresh session starts with 0 confirmed facts");
  assert(freshCase.fir_details.fir_number === '', "Fresh session has empty FIR number");
  assert(freshCase.vehicle.registration_number === '', "Fresh session has empty vehicle registration");

  const freshProceduralQuery = "What procedural steps are documented in this case?";
  const freshRes = await answerGenerator.generateAnswer(freshProceduralQuery, [], [], undefined, freshCase);
  assert(!freshRes.answer.includes("Batathu") && !freshRes.answer.includes("HP72D-3928") && !freshRes.answer.includes("Manoj Kumar"), "Clean case query does NOT leak Batathu details", freshRes.answer);
  assert(!freshRes.answer.includes("Vikram Singh") && !freshRes.answer.includes("Harpreet Singh"), "Clean case query does NOT leak synthetic test cases", freshRes.answer);

  // Check 3: Existing Batathu case remains accessible only upon explicit lookup
  const batathuCase = globalCaseStore.getCase('case_batathu_hp72d3928');
  assert(batathuCase !== undefined, "Batathu demo case remains accessible via explicit case ID");
  assert(batathuCase?.fir_details.fir_number === '24/2024', "Batathu demo case FIR 24/2024 is preserved");

  // =========================================================================
  // PART 4: HINDI FORMATTING & WORD-WRAP READABILITY (CSS & PREFORMATTED CONTAINER)
  // =========================================================================
  console.log("\n--------------------------------------------------------------------------");
  console.log("PART 4: HINDI FORMATTING & PREFORMATTED WORD-WRAP CONTAINER");
  console.log("--------------------------------------------------------------------------\n");

  const fs = await import('fs');
  const indexCss = fs.readFileSync('/app/applet/src/index.css', 'utf8');
  assert(indexCss.includes('.template-code'), "index.css defines .template-code class");
  assert(indexCss.includes('white-space: pre-wrap') || indexCss.includes('pre-wrap'), ".template-code enforces white-space: pre-wrap for auto word-wrapping");
  assert(indexCss.includes('word-break: break-word') || indexCss.includes('overflow-wrap'), ".template-code enforces word-breaking on desktop & mobile");
  assert(indexCss.includes('overflow-x: auto'), ".template-code supports horizontal scrolling when content exceeds width");

  // =========================================================================
  // PART 5: 29 SOURCE TEMPLATES INTEGRITY (SAVED CHECKPOINT REMAINS INTACT)
  // =========================================================================
  console.log("\n--------------------------------------------------------------------------");
  console.log("PART 5: 29 SOURCE TEMPLATES INTEGRITY (CHECKPOINT INTACT)");
  console.log("--------------------------------------------------------------------------\n");

  const allTemplates = templateRegistry.getAllTemplates();
  assert(allTemplates.length === 29, `Registry contains exactly 29 source templates (found: ${allTemplates.length})`);

  const chanceTemplates = allTemplates.filter(t => t.workflowType === 'CHANCE_RECOVERY');
  const infoTemplates = allTemplates.filter(t => t.workflowType === 'INFORMATION_BASED');
  assert(chanceTemplates.length === 14, `Chance Recovery contains exactly 14 templates (found: ${chanceTemplates.length})`);
  assert(infoTemplates.length === 15, `Information-Based contains exactly 15 templates (found: ${infoTemplates.length})`);

  // Verify chance_recovery_08 has 5 interrogation questions
  const cr08 = templateRegistry.getTemplate('chance_recovery_08');
  assert(cr08?.content.includes("1. बरामद मादक पदार्थ किसका है"), "chance_recovery_08 contains Question 1");
  assert(cr08?.content.includes("5. पूर्व में किसी मादक पदार्थ संबंधी प्रकरण"), "chance_recovery_08 contains Question 5");

  // Verify chance_recovery_09 has BNSS 35(3) and signature block
  const cr09 = templateRegistry.getTemplate('chance_recovery_09');
  assert(cr09?.content.includes("35(3) BNSS"), "chance_recovery_09 contains BNSS 35(3)");
  assert(cr09?.content.includes("हस्ताक्षर जांच अधिकारी"), "chance_recovery_09 contains signature block");

  console.log("\n==========================================================================");
  console.log(`FINAL RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
  console.log("==========================================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runE2EAcceptanceTests().catch(err => {
  console.error("Fatal error in acceptance test:", err);
  process.exit(1);
});
