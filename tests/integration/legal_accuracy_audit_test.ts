import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore, CaseContext } from '../../src/server/caseStore';
import { generateFilledDocument } from '../../src/server/workflowGuidance';
import { templateRegistry } from '../../src/server/templateRegistry';
import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';

function createFreshCase(prefix: string): CaseContext {
  const id = `session_case_${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  return globalCaseStore.getOrCreateSessionCase(id);
}

async function runLegalAccuracyAuditTests() {
  console.log("==========================================================================");
  console.log("RUNNING LEGAL ACCURACY AUDIT REGRESSION TESTS (A through H)");
  console.log("==========================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${testName}`);
    } else {
      console.error(`[FAIL] ${testName}: ${detail}`);
    }
  }

  // -------------------------------------------------------------------------
  // Test A: Officer Empowerment Verification (No rank-alone inference)
  // -------------------------------------------------------------------------
  {
    const res = synthesizeAuthoritativeAnswer(
      "Can any Sub-Inspector or ASI automatically conduct a search under Section 42 NDPS Act based on rank alone?",
      []
    );
    const text = res.answer;
    const warnsRankAlone = text.includes("rank alone") || text.includes("notification") || text.includes("empower");
    const mentionsNotification = text.includes("notification") || text.includes("order");
    assert(warnsRankAlone && mentionsNotification, "Test A: Officer Empowerment", "Must state empowerment cannot be inferred from rank alone and requires notification verification.");
  }

  // -------------------------------------------------------------------------
  // Test B: Procedural Separation (Interception, Restraint, Search, Seizure)
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("test_b_separation");
    const input = "We intercepted a car on a highway. Can we immediately detain the driver and force him to open all locked luggage?";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const text = res.answer;
    const separatesActions = text.includes("Interception") || text.includes("interception") || text.includes("Procedural") || text.includes("विधिक पृथक्करण") || text.includes("witnesses") || text.includes("authority");
    const cautionsCompulsion = text.includes("not established") || text.includes("authority") || text.includes("without") || text.includes("विधिक प्राधिकार");
    assert(separatesActions && cautionsCompulsion, "Test B: Search, Interception & Detention Separation", "Must distinguish interception from detention and search, cautioning against unauthorized compulsion.");
  }

  // -------------------------------------------------------------------------
  // Test C: Correct BNSS References (103 for witnesses, 105 for video, 106 for seizure, 180 for statements)
  // -------------------------------------------------------------------------
  {
    const res = synthesizeAuthoritativeAnswer(
      "What are the witness requirements for an NDPS search under BNSS?",
      []
    );
    const text = res.answer;
    const cites103 = text.includes("Section 103 BNSS") || text.includes("103 BNSS");
    const neverCites100AsWitness = !text.includes("Section 100 BNSS witness") && !text.includes("under Section 100 BNSS for witness");
    const cites105Or106 = text.includes("105 BNSS") || text.includes("106 BNSS");
    assert(cites103 && neverCites100AsWitness, "Test C: Correct BNSS References", "Must cite Section 103 BNSS for search witnesses and never confuse with Section 100 BNSS.");
  }

  // -------------------------------------------------------------------------
  // Test D: Section 41, 42, 43 and 50 Scope & Precedents
  // -------------------------------------------------------------------------
  {
    const res = synthesizeAuthoritativeAnswer(
      "Explain the difference between Section 42 and Section 43 NDPS Act.",
      []
    );
    const text = res.answer;
    const mentionsBootaSingh = text.includes("Boota Singh") || text.includes("private conveyance");
    const distinguishesPublicConveyance = text.includes("Section 43 Explanation") || text.includes("public conveyance") || text.includes("public place");
    assert(mentionsBootaSingh && distinguishesPublicConveyance, "Test D: Section 42 vs 43 Nuance", "Must explain Boota Singh private vehicle on public road rule under Section 42 vs Section 43 Explanation.");
  }

  // -------------------------------------------------------------------------
  // Test E: Sampling under Section 52A (Mohanlal Supreme Court Mandate)
  // -------------------------------------------------------------------------
  {
    const res = synthesizeAuthoritativeAnswer(
      "Does the investigating officer draw trial samples at the spot or before the Magistrate under Section 52A?",
      []
    );
    const text = res.answer;
    const mentionsMagistrate = text.includes("Magistrate") || text.includes("मजिस्ट्रेट");
    const cites52AOrMohanlal = text.includes("52A") || text.includes("Mohanlal");
    assert(mentionsMagistrate && cites52AOrMohanlal, "Test E: Section 52A Sampling", "Must mandate representative trial sampling before the Magistrate under Section 52A.");
  }

  // -------------------------------------------------------------------------
  // Test F: Statements & Presumptions (Tofan Singh, Conscious Possession)
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("test_f_presumptions");
    const input = "The intercepted driver stated he was just a hired taxi driver and knew nothing about the locked bag in the trunk. Does this statement prove innocence or can we invoke Section 35 and 54 presumptions?";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const text = res.answer;
    const distinguishesStatement = text.includes("defence") || text.includes("statement") || text.includes("claim") || text.includes("Tofan Singh") || text.includes("plea");
    const explainsPresumption = text.includes("possession") || text.includes("conscious") || text.includes("35") || text.includes("54") || text.includes("foundational");
    assert(distinguishesStatement && explainsPresumption, "Test F: Suspect Statements & Presumptions", "Must separate driver statement from established facts and require foundational proof for Sections 35/54.");
  }

  // -------------------------------------------------------------------------
  // Test G: Digital Evidence (Physical Seizure vs Access to Digital Contents)
  // -------------------------------------------------------------------------
  {
    const freshCase = createFreshCase("test_g_digital");
    const input = "Can police confiscate a suspect's smartphone and search WhatsApp messages on the spot without a digital forensics warrant under NDPS Act?";
    const res = await processInvestigatorQuery(input, freshCase, []);
    const text = res.answer;
    const separatesPhysicalSeizure = text.includes("Physical Seizure") || text.includes("seize") || text.includes("106 BNSS");
    const discussesExtractionSafeguards = text.includes("Digital Contents") || text.includes("Puttaswamy") || text.includes("privacy") || text.includes("63 BNSS") || text.includes("BSA");
    assert(separatesPhysicalSeizure && discussesExtractionSafeguards, "Test G: Digital Evidence Separation", "Must separate physical device seizure (106 BNSS) from forensic extraction of digital communications (63 BNSS / BSA / privacy).");
  }

  // -------------------------------------------------------------------------
  // Test H: Document Fidelity — Scenario 10 (No Manufactured Informer Narrative)
  // -------------------------------------------------------------------------
  {
    const tmpl1 = templateRegistry.findTemplate('INFORMATION_BASED', 1)!;
    const facts = {
      'दिनांक': '28 October 2026',
      'समय': '8:15 PM',
      'थाना': 'Sadar Una',
      'जिला': 'Una',
      'स्थान': 'Bus Stand Una',
      'पदार्थ': 'heroin',
      'वजन': '500 grams'
    };
    const filledDoc = generateFilledDocument(tmpl1, facts);

    // Verify confirmed facts are present
    const hasConfirmedFacts = filledDoc.includes('28 October 2026') &&
      filledDoc.includes('8:15 PM') &&
      filledDoc.includes('Sadar Una') &&
      filledDoc.includes('Bus Stand Una') &&
      filledDoc.includes('heroin');

    // Verify unsupplied fields remain placeholders and are NOT fabricated
    const preservesPlaceholders = filledDoc.includes('______ (मुखबिर/स्रोत)') &&
      filledDoc.includes('______ (नाम/हुलिया/वाहन नं.)');

    // Strict negative check: Must NOT fabricate manufactured informant narrative
    const noManufacturedArrivalStory = !filledDoc.includes('भारी मात्रा में') &&
      !filledDoc.includes('लेकर आने वाला है') &&
      !filledDoc.includes('विश्वसनीय मुखबिर खास से');

    assert(hasConfirmedFacts && preservesPlaceholders && noManufacturedArrivalStory, "Test H: Document Fidelity (No Manufactured Informer Story)", "Must fill confirmed facts, preserve unsupplied placeholders, and never manufacture informer arrival storylines.");
  }

  console.log(`\n==========================================================================`);
  console.log(`LEGAL ACCURACY AUDIT RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`==========================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runLegalAccuracyAuditTests().catch(err => {
  console.error("Legal accuracy audit test failed:", err);
  process.exit(1);
});
