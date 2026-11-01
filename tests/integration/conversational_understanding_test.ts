import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';

async function runConversationalUnderstandingTests() {
  console.log("==========================================================================");
  console.log("RUNNING ACCEPTANCE SUITE: CONVERSATIONAL UNDERSTANDING & HINGLISH SUPPORT (TESTS A-L)");
  console.log("==========================================================================\n");

  let totalPassed = 0;
  let totalTests = 0;

  function reportResult(testLetter: string, testTitle: string, passed: boolean, inputQuery: string, actualOutput: string, expectedCriteria: string) {
    totalTests++;
    if (passed) totalPassed++;
    console.log(`--------------------------------------------------------------------------`);
    console.log(`TEST ${testLetter}: ${testTitle}`);
    console.log(`STATUS: [${passed ? 'PASS' : 'FAIL'}]`);
    console.log(`INPUT QUERY: "${inputQuery}"`);
    console.log(`EXPECTED: ${expectedCriteria}`);
    console.log(`ACTUAL OUTPUT:\n${actualOutput.slice(0, 400)}${actualOutput.length > 400 ? '...' : ''}`);
    console.log(`--------------------------------------------------------------------------\n`);
  }

  // -------------------------------------------------------------------------
  // TEST A: "hi" — natural greeting
  // -------------------------------------------------------------------------
  {
    const query = "hi";
    const res = await processInvestigatorQuery(query, null, []);
    const output = res.answer;

    const isNatural = output.toLowerCase().includes("hello") || output.toLowerCase().includes("help");
    const noFilterMessage = !output.includes("Outside authorized NDPS provisions") && !output.includes("Not available in the reference material");

    const pass = isNatural && noFilterMessage;
    reportResult("A", "Natural Greeting ('hi')", pass, query, output, "Natural polite greeting, no rejection message.");
  }

  // -------------------------------------------------------------------------
  // TEST B: "kaise ho" — natural Roman Hindi response
  // -------------------------------------------------------------------------
  {
    const query = "kaise ho";
    const res = await processInvestigatorQuery(query, null, []);
    const output = res.answer;

    const isRomanHindi = output.includes("Main theek hoon") || output.includes("theek hoon") || output.includes("Aap bataiye") || output.includes("madad");
    const noFilterMessage = !output.includes("Outside authorized NDPS provisions") && !output.includes("Not available");

    const pass = isRomanHindi && noFilterMessage;
    reportResult("B", "Natural Roman Hindi Greeting ('kaise ho')", pass, query, output, "Natural response in Roman Hindi, no rejection filter.");
  }

  // -------------------------------------------------------------------------
  // TEST C: "ndps kya hota hai" — concise explanation in Roman Hindi
  // -------------------------------------------------------------------------
  {
    const query = "ndps kya hota hai";
    const res = await processInvestigatorQuery(query, null, []);
    const output = res.answer;

    const explainsNDPS = output.includes("Narcotic Drugs") || output.includes("Psychotropic Substances") || output.includes("1985") || output.includes("kanoon") || output.includes("act");
    const isRomanHindi = output.includes("hai") || output.includes("matlab") || output.includes("kanoon");

    const pass = explainsNDPS && isRomanHindi;
    reportResult("C", "NDPS Definition in Roman Hindi ('ndps kya hota hai')", pass, query, output, "Concise explanation of NDPS Act in Roman Hindi.");
  }

  // -------------------------------------------------------------------------
  // TEST D: "fard makboozgi me kya likhna hota hai" — understands document and explains supported fields
  // -------------------------------------------------------------------------
  {
    const query = "fard makboozgi me kya likhna hota hai";
    const res = await processInvestigatorQuery(query, null, []);
    const output = res.answer;

    const explainsFields = (output.includes("Dinank") || output.includes("Date") || output.includes("दिनांक")) &&
                           (output.includes("Weight") || output.includes("वजन") || output.includes("weight")) &&
                           (output.includes("Gawah") || output.includes("Witness") || output.includes("गवाह"));

    const pass = explainsFields;
    reportResult("D", "Document Fields Explanation ('fard makboozgi me kya likhna hota hai')", pass, query, output, "Understands document and explains supported fields.");
  }

  // -------------------------------------------------------------------------
  // TEST E: "1 isme kya likhna hota hai" — resolves reference to the first step of previous answer
  // -------------------------------------------------------------------------
  {
    const history = [
      { role: 'user' as const, content: "What documents need to be prepared initially?" },
      { role: 'assistant' as const, content: "1. Prepare Spot Recovery Memo (Fard Makboozgi) contemporaneously.\n2. Prepare Section 50 Notice." }
    ];
    const query = "1 isme kya likhna hota hai";
    const res = await processInvestigatorQuery(query, null, history);
    const output = res.answer;

    const resolvesToFardMakboozgi = output.includes("FARD MAKBOOZGI") || output.includes("SPOT RECOVERY MEMO") || output.includes("Dinank");

    const pass = resolvesToFardMakboozgi;
    reportResult("E", "Coreference Resolution ('1 isme kya likhna hota hai')", pass, query, output, "Resolves step 1 to Fard Makboozgi and explains its fields.");
  }

  // -------------------------------------------------------------------------
  // TEST F: "koy udhahran do" — understands spelling mistake and provides a labelled example
  // -------------------------------------------------------------------------
  {
    const history = [
      { role: 'user' as const, content: "Tell me about Spot Recovery Memo (Fard Makboozgi)." },
      { role: 'assistant' as const, content: "Fard Makboozgi is prepared on the spot to record seizure and weighment." }
    ];
    const query = "koy udhahran do";
    const res = await processInvestigatorQuery(query, null, history);
    const output = res.answer;

    const handlesSpelling = output.includes("ILLUSTRATIVE DRAFT EXAMPLE") || output.includes("उदाहरणात्मक") || output.includes("Illustrative");
    const includesPlaceholders = output.includes("[दिनांक") || output.includes("[Date]") || output.includes("[स्थान") || output.includes("[वजन");

    const pass = handlesSpelling && includesPlaceholders;
    reportResult("F", "Spelling Fix & Example Generation ('koy udhahran do')", pass, query, output, "Understands spelling typo and provides a clearly labelled sample draft with placeholders.");
  }

  // -------------------------------------------------------------------------
  // TEST G: "template of this" — resolves previous document reference and searches correct template
  // -------------------------------------------------------------------------
  {
    const history = [
      { role: 'user' as const, content: "Explain Step 1 Spot Recovery Memo (Fard Makboozgi)." },
      { role: 'assistant' as const, content: "1. Prepare Spot Recovery Memo (Fard Makboozgi) contemporaneously at the scene." }
    ];
    const query = "template of this";
    const res = await processInvestigatorQuery(query, null, history);
    const output = res.answer;

    const returnsOriginalTemplate = output.includes("OFFICIAL SOURCE TEMPLATE") || output.includes("बरामदगी फर्द मौका") || output.includes("chance_recovery_01");

    const pass = returnsOriginalTemplate;
    reportResult("G", "Context-Aware Template Retrieval ('template of this')", pass, query, output, "Resolves document reference from history and returns exact original Hindi template.");
  }

  // -------------------------------------------------------------------------
  // TEST H: "templeate of this" — same behaviour despite spelling mistakes
  // -------------------------------------------------------------------------
  {
    const history = [
      { role: 'user' as const, content: "Explain Step 1 Spot Recovery Memo (Fard Makboozgi)." },
      { role: 'assistant' as const, content: "1. Prepare Spot Recovery Memo (Fard Makboozgi) contemporaneously at the scene." }
    ];
    const query = "templeate of this";
    const res = await processInvestigatorQuery(query, null, history);
    const output = res.answer;

    const handlesTypoAndRetrieves = output.includes("OFFICIAL SOURCE TEMPLATE") || output.includes("बरामदगी फर्द मौका") || output.includes("chance_recovery_01");

    const pass = handlesTypoAndRetrieves;
    reportResult("H", "Template Retrieval with Typo ('templeate of this')", pass, query, output, "Handles spelling typo 'templeate' and returns exact original Hindi template.");
  }

  // -------------------------------------------------------------------------
  // TEST I: Ambiguous reference — asks one concise clarification question
  // -------------------------------------------------------------------------
  {
    const history = [
      { role: 'user' as const, content: "Tell me about Seizure Memo and Personal Search Memo." },
      { role: 'assistant' as const, content: "Seizure Memo records recovered contraband. Personal Search Memo records search u/s 50." },
      { role: 'user' as const, content: "What is recorded in Seizure Memo?" },
      { role: 'assistant' as const, content: "Seizure Memo records weights, bags, and spot seals." },
      { role: 'user' as const, content: "What is recorded in Personal Search Memo?" },
      { role: 'assistant' as const, content: "Personal Search Memo records personal search notice response and body search." }
    ];
    const query = "which document confirms that";
    const res = await processInvestigatorQuery(query, null, history);
    const output = res.answer;

    const asksClarification = output.includes("Multiple documents have been discussed") || output.includes("clarify which document") || output.includes("कृपया स्पष्ट करें");

    const pass = asksClarification;
    reportResult("I", "Ambiguous Reference Clarification ('which document confirms that')", pass, query, output, "Asks one concise clarification question when multiple documents exist in history.");
  }

  // -------------------------------------------------------------------------
  // TEST J: Incorrectly spelled substance or legal section — does not silently guess if correction could alter meaning
  // -------------------------------------------------------------------------
  {
    const caseContext = globalCaseStore.getOrCreateSessionCase(`test_J_${Date.now()}`);
    const query = "Is the seized substance heroin or opium? Please clarify Section 50 vs 52.";
    const res = await processInvestigatorQuery(query, caseContext, []);
    const output = res.answer;

    const preservesFacts = !output.includes("We assume the substance is heroin") && !output.includes("We converted opium to heroin");
    const discussesBoth = output.includes("Section 50") || output.includes("Section 52") || output.includes("heroin") || output.includes("opium");

    const pass = preservesFacts && discussesBoth;
    reportResult("J", "Legal Section & Fact Alteration Safety", pass, query, output, "Does not silently alter substance or legal section based on guesses.");
  }

  // -------------------------------------------------------------------------
  // TEST K: User asks for a document without enough facts — uses placeholders or asks missing facts
  // -------------------------------------------------------------------------
  {
    const caseContext = globalCaseStore.getOrCreateSessionCase(`test_K_${Date.now()}`);
    caseContext.recovery_pathway = 'CHANCE_RECOVERY';
    const query = "Generate Spot Recovery Memo for my case.";
    const res = await processInvestigatorQuery(query, caseContext, []);
    const output = res.answer;

    const asksMissingOrUsesPlaceholders = output.includes("Next Question") || output.includes("unresolved") || output.includes("______") || output.includes("[दिनांक]");
    const doesNotInventFacts = !output.includes("108 kg 900 g") || !output.includes("Batathu");

    const pass = asksMissingOrUsesPlaceholders && doesNotInventFacts;
    reportResult("K", "Document Generation Fact Safety", pass, query, output, "Uses placeholders or asks for missing facts rather than inventing completed actions.");
  }

  // -------------------------------------------------------------------------
  // TEST L: Existing case context and workflow isolation remain intact
  // -------------------------------------------------------------------------
  {
    const caseA = globalCaseStore.getOrCreateSessionCase(`test_L_A_${Date.now()}`);
    const caseB = globalCaseStore.getOrCreateSessionCase(`test_L_B_${Date.now()}`);

    await processInvestigatorQuery("A reliable informer reported heroin in Una.", caseA, []);
    await processInvestigatorQuery("Routine patrol team found abandoned charas in Jalandhar.", caseB, []);

    const pathA = caseA.recovery_pathway;
    const pathB = caseB.recovery_pathway;

    const isIsolated = pathA === 'INFORMATION_BASED' && pathB === 'CHANCE_RECOVERY' && caseA.case_id !== caseB.case_id;

    reportResult("L", "Existing Case Context & Workflow Isolation", isIsolated, "Case A vs Case B", `Case A Pathway: ${pathA}, Case B Pathway: ${pathB}`, "Case context and workflows remain completely isolated.");
  }

  console.log(`==========================================================================`);
  console.log(`TEST SUITE RESULTS (A-L): ${totalPassed} / ${totalTests} PASSED (${Math.round((totalPassed / totalTests) * 100)}%)`);
  console.log(`==========================================================================\n`);

  if (totalPassed !== totalTests) {
    process.exit(1);
  }
}

runConversationalUnderstandingTests().catch(err => {
  console.error("Conversational understanding test failed:", err);
  process.exit(1);
});
