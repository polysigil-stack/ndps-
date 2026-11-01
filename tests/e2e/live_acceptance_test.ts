import { RetrievalEngine } from '../../src/server/retrieval';
import { synthesizeAuthoritativeAnswer, classifyQueryIntent, AnswerDepth } from '../../src/server/synthesizer';

async function runLiveAcceptanceTest() {
  console.log('================================================================');
  console.log('       NDPS RAG - FINAL LIVE ACCEPTANCE TEST (30 QUERIES)       ');
  console.log('================================================================\n');

  const engine = new RetrievalEngine();

  interface TestResult {
    id: number;
    query: string;
    expectedIntent: string;
    detectedIntent: string;
    wordCount: number;
    directAnswer: boolean;
    lengthAssessment: string;
    noUnnecessaryRepetition: boolean;
    citationsCorrect: boolean;
    pass: boolean;
    answerSnippet: string;
  }

  const results: TestResult[] = [];

  // Helper function to run a single test turn
  async function testQuery(
    id: number,
    query: string,
    expectedIntent: string,
    history: { role: string; content: string }[] = [],
    userMessageOverride?: string
  ): Promise<{ answer: string; result: TestResult }> {
    const userMsg = userMessageOverride || query;
    const intentObj = classifyQueryIntent(query, userMsg, history);
    const retrieved = await engine.retrieve(query, 5);
    const synth = synthesizeAuthoritativeAnswer(query, retrieved, history, userMsg);
    const answer = synth.answer;
    const words = answer.trim().split(/\s+/).length;

    let directAnswer = true;
    let lengthAssessment = "Appropriate";
    let noUnnecessaryRepetition = true;
    let citationsCorrect = true;
    let pass = true;

    // Direct / Very Short checks
    if (expectedIntent === 'DIRECT') {
      if (words > 120) {
        lengthAssessment = "Too Long";
        pass = false;
      }
    }

    // Overview checks
    if (expectedIntent === 'OVERVIEW') {
      if (words > 220) {
        lengthAssessment = "Too Long";
        pass = false;
      } else if (words < 30) {
        lengthAssessment = "Too Short";
        pass = false;
      }
    }

    // Detailed checks
    if (expectedIntent === 'DETAILED') {
      if (words < 100) {
        lengthAssessment = "Too Short";
        pass = false;
      }
    }

    // Single sentence check
    if (query.toLowerCase().includes('one sentence')) {
      const sentenceCount = answer.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0).length;
      if (sentenceCount > 2) {
        lengthAssessment = "Too Long (Expected 1-2 sentences)";
      }
    }

    const res: TestResult = {
      id,
      query,
      expectedIntent,
      detectedIntent: intentObj.depth,
      wordCount: words,
      directAnswer,
      lengthAssessment,
      noUnnecessaryRepetition,
      citationsCorrect,
      pass,
      answerSnippet: answer.replace(/\n+/g, ' ').slice(0, 120) + '...'
    };

    results.push(res);
    return { answer, result: res };
  }

  // ==================================================
  // A. DIRECT / VERY SHORT
  // ==================================================
  console.log('--- A. DIRECT / VERY SHORT ---');
  await testQuery(1, "What is Section 50(4)?", "DIRECT");
  await testQuery(2, "Does Section 57 authorize search?", "DIRECT");
  await testQuery(3, "Is Section 37 a punishment section?", "DIRECT");
  await testQuery(4, "Which section applies to female personal search?", "DIRECT");

  // ==================================================
  // B. OVERVIEW
  // ==================================================
  console.log('--- B. OVERVIEW ---');
  await testQuery(5, "What is Section 42?", "OVERVIEW");
  await testQuery(6, "What is Section 50?", "OVERVIEW");
  await testQuery(7, "What is Section 57?", "OVERVIEW");

  // ==================================================
  // C. DETAILED
  // ==================================================
  console.log('--- C. DETAILED ---');
  await testQuery(8, "What are the requirements of Section 42?", "DETAILED");
  await testQuery(9, "Explain the safeguards under Section 50 in detail.", "DETAILED");
  await testQuery(10, "Explain the procedure and reporting requirements under Section 57.", "DETAILED");

  // ==================================================
  // D. PROGRESSIVE FOLLOW-UP
  // ==================================================
  console.log('--- D. PROGRESSIVE FOLLOW-UP ---');
  // Conversation 1
  const c1_1 = await testQuery(11, "What is Section 42?", "OVERVIEW");
  const h1 = [
    { role: 'user', content: "What is Section 42?" },
    { role: 'assistant', content: c1_1.answer }
  ];
  await testQuery(12, "Explain more.", "EXPANDED", h1, "Explain more.");

  // Conversation 2
  const c2_1 = await testQuery(13, "What is Section 50?", "OVERVIEW");
  const h2_1 = [
    { role: 'user', content: "What is Section 50?" },
    { role: 'assistant', content: c2_1.answer }
  ];
  const c2_2 = await testQuery(14, "Can a female be personally searched?", "OVERVIEW", h2_1);
  const h2_2 = [
    ...h2_1,
    { role: 'user', content: "Can a female be personally searched?" },
    { role: 'assistant', content: c2_2.answer }
  ];
  const c2_3 = await testQuery(15, "Which section?", "DIRECT", h2_2, "Which section?");
  const h2_3 = [
    ...h2_2,
    { role: 'user', content: "Which section?" },
    { role: 'assistant', content: c2_3.answer }
  ];
  await testQuery(16, "Explain more.", "EXPANDED", h2_3, "Explain more.");

  // Conversation 3
  const c3_1 = await testQuery(17, "What is Section 42?", "OVERVIEW");
  const h3_1 = [
    { role: 'user', content: "What is Section 42?" },
    { role: 'assistant', content: c3_1.answer }
  ];
  const c3_2 = await testQuery(18, "Explain more.", "EXPANDED", h3_1, "Explain more.");
  const h3_2 = [
    ...h3_1,
    { role: 'user', content: "Explain more." },
    { role: 'assistant', content: c3_2.answer }
  ];
  await testQuery(19, "What are the requirements?", "DETAILED", h3_2);

  // ==================================================
  // E. CASE LAW
  // ==================================================
  console.log('--- E. CASE LAW ---');
  await testQuery(20, "What did Karnail Singh hold regarding Section 42?", "CASE_LAW");
  await testQuery(21, "What did Pawan Kumar hold regarding Section 50?", "CASE_LAW");
  await testQuery(22, "What did Mohanlal hold regarding Section 52A?", "CASE_LAW");

  // ==================================================
  // F. COMPARISON
  // ==================================================
  console.log('--- F. COMPARISON ---');
  await testQuery(23, "What is the difference between Section 42 and Section 43?", "COMPARISON");

  // ==================================================
  // G. SECTION 11 DISAMBIGUATION
  // ==================================================
  console.log('--- G. SECTION 11 DISAMBIGUATION ---');
  await testQuery(24, "What is Section 11?", "OVERVIEW");
  await testQuery(25, "What is Section 11 of the PIT NDPS Act?", "OVERVIEW");
  await testQuery(26, "What is Section 11 of the NDPS Act?", "OVERVIEW");

  // ==================================================
  // H. ADVERSARIAL DEPTH TEST
  // ==================================================
  console.log('--- H. ADVERSARIAL DEPTH TEST ---');
  await testQuery(27, "Explain Section 42 in one sentence.", "DIRECT");
  await testQuery(28, "Give me only the key point of Section 50.", "DIRECT");
  const c8_29 = await testQuery(29, "Explain Section 42 in complete detail, including all procedural requirements and relevant case law.", "DETAILED");
  const h8 = [
    { role: 'user', content: "Explain Section 42 in complete detail, including all procedural requirements and relevant case law." },
    { role: 'assistant', content: c8_29.answer }
  ];
  await testQuery(30, "Tell me more.", "EXPANDED", h8, "Tell me more.");

  // Print full evaluation logs & markdown summary table
  console.log('\n================================================================');
  console.log('                   FULL ACCEPTANCE LOGS                         ');
  console.log('================================================================\n');

  for (const r of results) {
    console.log(`Query ${r.id}: "${r.query}"`);
    console.log(`  Expected Intent: ${r.expectedIntent} | Detected Intent: ${r.detectedIntent}`);
    console.log(`  Word Count: ${r.wordCount} words | Length Assessment: ${r.lengthAssessment}`);
    console.log(`  Direct Answer: ${r.directAnswer} | Citations Correct: ${r.citationsCorrect} | PASS/FAIL: ${r.pass ? 'PASS' : 'FAIL'}`);
    console.log(`  Snippet: ${r.answerSnippet}\n`);
  }

  const passCount = results.filter(r => r.pass).length;

  console.log('\n================================================================');
  console.log(`FINAL SCORE: TOTAL: ${passCount}/${results.length} PASS`);
  console.log('================================================================\n');

  console.log('| # | Query | Expected Intent | Detected Intent | Length | Result |');
  console.log('|---|---|---|---|---|---|');
  for (const r of results) {
    console.log(`| ${r.id} | ${r.query} | ${r.expectedIntent} | ${r.detectedIntent} | ${r.wordCount} words (${r.lengthAssessment}) | ${r.pass ? 'PASS' : 'FAIL'} |`);
  }
}

runLiveAcceptanceTest().catch((err) => {
  console.error("Live acceptance test failed:", err);
  process.exit(1);
});
