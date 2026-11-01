import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';

async function runLegalPrecisionReviewTests() {
  console.log("==========================================================================");
  console.log("RUNNING FINAL TARGETED LEGAL PRECISION REVIEW TESTS (1 through 5)");
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
  // Test 1: BNSS Section 105 Scope & Section 51 NDPS Act Harmonisation
  // -------------------------------------------------------------------------
  {
    const query = "Does BNSS Section 105 audio-video recording automatically apply across the board to every NDPS search?";
    console.log(`Input Query 1: "${query}"`);
    const res = synthesizeAuthoritativeAnswer(query, []);
    const text = res.answer;
    console.log("--- Output 1 ---");
    console.log(text.substring(0, 300) + "...\n");

    const mentionsChapter7Or185 = text.includes("Chapter VII") || text.includes("Section 185");
    const mentionsSection51 = text.includes("Section 51") || text.includes("not inconsistent");
    const explainsNonAutomatic = text.includes("not") && (text.includes("automatically") || text.includes("across the board"));
    assert(mentionsChapter7Or185 && mentionsSection51 && explainsNonAutomatic, "Test 1: BNSS Section 105 Scope & Harmonisation", "Must explain Chapter VII / 185 scope, Section 51 NDPS Act harmonisation, and state it is not an automatic across-the-board rule.");
  }

  // -------------------------------------------------------------------------
  // Test 2: NDPS Section 42 vs BNSS Section 185 Dual Obligations
  // -------------------------------------------------------------------------
  {
    const query = "Does BNSS Section 185 replace NDPS Section 42 recording and reporting requirements?";
    console.log(`Input Query 2: "${query}"`);
    const res = synthesizeAuthoritativeAnswer(query, []);
    const text = res.answer;
    console.log("--- Output 2 ---");
    console.log(text.substring(0, 300) + "...\n");

    const statesNotReplace = text.includes("NOT") || text.includes("not replace") || text.includes("separate");
    const mentions72Hours = text.includes("72 hours");
    const mentionsMagistrateForthwith = text.includes("Magistrate") && text.includes("forthwith");
    assert(statesNotReplace && mentions72Hours && mentionsMagistrateForthwith, "Test 2: NDPS Sec 42 vs BNSS Sec 185 Dual Obligations", "Must state Sec 185 does NOT replace Sec 42, and distinguish 72-hour superior report from forthwith Magistrate report.");
  }

  // -------------------------------------------------------------------------
  // Test 3: Section 52A Statutory Categories & Supreme Court Jurisprudence
  // -------------------------------------------------------------------------
  {
    const query = "What are the three statutory categories under Section 52A(2) and how does Bharat Aambale apply?";
    console.log(`Input Query 3: "${query}"`);
    const res = synthesizeAuthoritativeAnswer(query, []);
    const text = res.answer;
    console.log("--- Output 3 ---");
    console.log(text.substring(0, 300) + "...\n");

    const mentionsInventory = text.includes("Certified Inventory") || text.includes("inventory");
    const mentionsPhotos = text.includes("Certified Photographs") || text.includes("photographs");
    const mentionsSamples = text.includes("List of Samples") || text.includes("samples");
    const mentionsBharatAambale = text.includes("Bharat Aambale") || text.includes("prejudice");
    assert(mentionsInventory && mentionsPhotos && mentionsSamples && mentionsBharatAambale, "Test 3: Section 52A Statutory Categories & Jurisprudence", "Must list certified inventory, certified photographs, certified sample list, and cite Bharat Aambale ratio.");
  }

  // -------------------------------------------------------------------------
  // Test 4: Section 55 Bare Statutory Duties vs SOP / Standing Order 1/88 Bulk Resealing
  // -------------------------------------------------------------------------
  {
    const query = "Is resealing of bulk parcels by the SHO mandatory under the bare statutory text of Section 55 NDPS Act?";
    console.log(`Input Query 4: "${query}"`);
    const res = synthesizeAuthoritativeAnswer(query, []);
    const text = res.answer;
    console.log("--- Output 4 ---");
    console.log(text.substring(0, 300) + "...\n");

    const mentionsSafeCustody = text.includes("safe custody") || text.includes("Bare Statutory Text");
    const mentionsStandingOrder = text.includes("Standing Order") || text.includes("1/88") || text.includes("SOPs") || text.includes("Rules");
    const distinguishesBareFromSop = text.includes("distinguish") || text.includes("bare statutory") || text.includes("derived");
    assert(mentionsSafeCustody && mentionsStandingOrder && distinguishesBareFromSop, "Test 4: Section 55 Bare Text vs SOP Bulk Resealing", "Must distinguish Section 55 bare text (safe custody & seal allowance) from Standing Order 1/88 & SOP bulk resealing/Register 19.");
  }

  // -------------------------------------------------------------------------
  // Test 5: State of Haryana v. Jarnail Singh Ratio & Boota Singh Boundary
  // -------------------------------------------------------------------------
  {
    const query = "What is the exact ratio of State of Haryana v. Jarnail Singh and does it allow classifying private vehicles as public conveyances?";
    console.log(`Input Query 5: "${query}"`);
    const res = synthesizeAuthoritativeAnswer(query, []);
    const text = res.answer;
    console.log("--- Output 5 ---");
    console.log(text.substring(0, 300) + "...\n");

    const mentionsJarnailHolding = text.includes("Jarnail Singh") && text.includes("transit");
    const mentionsBootaBoundary = text.includes("Boota Singh") && (text.includes("private vehicle") || text.includes("not"));
    const cautionsGeneralization = text.includes("NOT") || text.includes("generalized") || text.includes("Explanation");
    assert(mentionsJarnailHolding && mentionsBootaBoundary && cautionsGeneralization, "Test 5: Jarnail Singh Ratio & Boota Singh Boundary", "Must state Jarnail Singh transit ratio, Boota Singh private vehicle boundary, and caution against overgeneralization.");
  }

  console.log(`\n==========================================================================`);
  console.log(`LEGAL PRECISION REVIEW RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`==========================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runLegalPrecisionReviewTests().catch(err => {
  console.error("Legal precision review test failed:", err);
  process.exit(1);
});
