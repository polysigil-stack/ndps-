import { RetrievalEngine } from '../../src/server/retrieval';
import { synthesizeAuthoritativeAnswer, classifyQueryIntent, AnswerDepth } from '../../src/server/synthesizer';

async function runIntentDepthTests() {
  console.log('====================================================');
  console.log('   NDPS RAG - INTENT-BASED ANSWER DEPTH TEST SUITE   ');
  console.log('====================================================\n');

  const engine = new RetrievalEngine();
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

  // --- TEST A: "What is Section 42?" ---
  {
    const query = "What is Section 42?";
    const intent = classifyQueryIntent(query);
    assertTest("Test A: Intent classification for 'What is Section 42?' is OVERVIEW", intent.depth === AnswerDepth.OVERVIEW, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    const wordCount = result.answer.split(/\s+/).length;
    assertTest("Test A: Answer length is concise OVERVIEW (~50-220 words)", wordCount >= 30 && wordCount <= 220, `Word count: ${wordCount}`);
    assertTest("Test A: Answer mentions Section 42 title / purpose", result.answer.toLowerCase().includes('section 42'), `Answer sample: ${result.answer.slice(0, 100)}`);
  }

  // --- TEST B: "Explain Section 42." ---
  {
    const query = "Explain Section 42.";
    const intent = classifyQueryIntent(query);
    assertTest("Test B: Intent classification for 'Explain Section 42.' is OVERVIEW", intent.depth === AnswerDepth.OVERVIEW, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    const wordCount = result.answer.split(/\s+/).length;
    assertTest("Test B: Answer length is concise OVERVIEW (~50-220 words)", wordCount >= 30 && wordCount <= 220, `Word count: ${wordCount}`);
  }

  // --- TEST C: "What are the requirements of Section 42?" ---
  {
    const query = "What are the requirements of Section 42?";
    const intent = classifyQueryIntent(query);
    assertTest("Test C: Intent classification for 'What are the requirements of Section 42?' is DETAILED", intent.depth === AnswerDepth.DETAILED, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test C: Detailed answer contains key procedural requirements", 
      result.answer.toLowerCase().includes('writing') && 
      result.answer.toLowerCase().includes('72 hours') &&
      result.answer.toLowerCase().includes('sunset'),
      `Answer sample: ${result.answer.slice(0, 150)}`
    );
  }

  // --- TEST D: Turn 1: "What is Section 42?", Turn 2: "Explain more." ---
  {
    const turn1Query = "What is Section 42?";
    const turn1Retrieved = await engine.retrieve(turn1Query, 5);
    const turn1Result = synthesizeAuthoritativeAnswer(turn1Query, turn1Retrieved);

    const history = [
      { role: 'user', content: turn1Query },
      { role: 'assistant', content: turn1Result.answer }
    ];

    const turn2Query = "Explain more.";
    const intent = classifyQueryIntent(turn2Query, "Explain more.", history);
    assertTest("Test D: Follow-up 'Explain more.' classified as EXPANDED", intent.depth === AnswerDepth.EXPANDED, `Got: ${intent.depth}`);
    assertTest("Test D: Active topic extracted as 'section 42'", intent.activeTopic.includes('section 42'), `Got: ${intent.activeTopic}`);

    const turn2Retrieved = await engine.retrieve("Section 42 in detail", 5);
    const turn2Result = synthesizeAuthoritativeAnswer(turn2Query, turn2Retrieved, history, "Explain more.");
    const wordCount = turn2Result.answer.split(/\s+/).length;
    assertTest("Test D: Expanded answer is deeper/detailed", wordCount >= 120, `Word count: ${wordCount}`);
  }

  // --- TEST E: "Which section?" (Female search context) ---
  {
    const history = [
      { role: 'user', content: 'Can a male officer conduct personal search of a female suspect?' },
      { role: 'assistant', content: 'No female shall be searched by anyone excepting a female.' }
    ];
    const query = "Which section?";
    const intent = classifyQueryIntent(query, "Which section?", history);
    assertTest("Test E: Intent classification for 'Which section?' is DIRECT", intent.depth === AnswerDepth.DIRECT, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve("female search section", 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved, history, "Which section?");
    assertTest("Test E: Direct answer cites Section 50(4) and female rule",
      result.answer.includes("Section 50(4)") && result.answer.includes("No female shall be searched by anyone excepting a female"),
      `Got: ${result.answer}`
    );
  }

  // --- TEST F: "Does Section 57 authorize search?" ---
  {
    const query = "Does Section 57 authorize search?";
    const intent = classifyQueryIntent(query);
    assertTest("Test F: Intent classification for 'Does Section 57 authorize search?' is DIRECT", intent.depth === AnswerDepth.DIRECT, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test F: Direct answer starts with 'No.' and explains 48h reporting",
      result.answer.toLowerCase().startsWith('no') && result.answer.includes('48 hours'),
      `Got: ${result.answer}`
    );
  }

  // --- TEST G: "Is Section 37 a punishment section?" ---
  {
    const query = "Is Section 37 a punishment section?";
    const intent = classifyQueryIntent(query);
    assertTest("Test G: Intent classification for 'Is Section 37 a punishment section?' is DIRECT", intent.depth === AnswerDepth.DIRECT, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test G: Direct answer starts with 'No.' and explains bail framework",
      result.answer.toLowerCase().startsWith('no') && result.answer.toLowerCase().includes('bail'),
      `Got: ${result.answer}`
    );
  }

  // --- TEST H: "What did Karnail Singh hold regarding Section 42?" ---
  {
    const query = "What did Karnail Singh hold regarding Section 42?";
    const intent = classifyQueryIntent(query);
    assertTest("Test H: Intent classification for Karnail Singh query is CASE_LAW", intent.depth === AnswerDepth.CASE_LAW, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test H: Case law response includes case name, court, holding, key principle",
      result.answer.includes("Karnail Singh v. State of Haryana") &&
      result.answer.includes("Constitution Bench") &&
      result.answer.includes("Section 42"),
      `Got: ${result.answer.slice(0, 150)}`
    );
  }

  // --- TEST I: "What is Section 11?" ---
  {
    const query = "What is Section 11?";
    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test I: Dual-statute overview for bare 'What is Section 11?'",
      result.answer.includes("NDPS Act, 1985") && result.answer.includes("PIT NDPS Act, 1988"),
      `Got: ${result.answer.slice(0, 150)}`
    );
  }

  // --- TEST J: "What is Section 11 of the PIT NDPS Act?" ---
  {
    const query = "What is Section 11 of the PIT NDPS Act?";
    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test J: Focused PIT NDPS Section 11 answer",
      result.answer.includes("PIT NDPS Act") && result.answer.includes("1 year") && result.answer.includes("2 years"),
      `Got: ${result.answer}`
    );
  }

  // --- TEST K: "What is Section 11 of the NDPS Act?" ---
  {
    const query = "What is Section 11 of the NDPS Act?";
    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test K: Focused NDPS Act 1985 Section 11 answer",
      result.answer.includes("NDPS Act, 1985") && result.answer.toLowerCase().includes("attachment"),
      `Got: ${result.answer}`
    );
  }

  // --- TEST L: "What is Section 50(4)?" (Specific Subsection Fix) ---
  {
    const query = "What is Section 50(4)?";
    const intent = classifyQueryIntent(query);
    assertTest("Test L: Specific subsection query classified as FOCUSED_SUBSECTION", intent.depth === AnswerDepth.FOCUSED_SUBSECTION, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test L: Result focuses specifically on Section 50(4) female rule",
      result.answer.includes("Section 50(4)") && result.answer.includes("No female shall be searched by anyone excepting a female"),
      `Got: ${result.answer}`
    );
  }

  // --- TEST M: "Explain the procedure and reporting requirements under Section 57." (Procedure Fix) ---
  {
    const query = "Explain the procedure and reporting requirements under Section 57.";
    const intent = classifyQueryIntent(query);
    assertTest("Test M: Procedure query classified as DETAILED", intent.depth === AnswerDepth.DETAILED, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test M: Result contains 48 hours and superior officer reporting details",
      result.answer.includes("48 hours") && result.answer.toLowerCase().includes("official superior"),
      `Got: ${result.answer}`
    );
  }

  // --- TEST N: Turn 1: "What is Section 50?", Turn 2: "What are the requirements?" (Contextual Requirements Fix) ---
  {
    const turn1Query = "What is Section 50?";
    const turn1Retrieved = await engine.retrieve(turn1Query, 5);
    const turn1Result = synthesizeAuthoritativeAnswer(turn1Query, turn1Retrieved);

    const history = [
      { role: 'user', content: turn1Query },
      { role: 'assistant', content: turn1Result.answer }
    ];

    const turn2Query = "What are the requirements?";
    const intent = classifyQueryIntent(turn2Query, "What are the requirements?", history);
    assertTest("Test N: Contextual requirements follow-up classified as DETAILED", intent.depth === AnswerDepth.DETAILED, `Got: ${intent.depth}`);
    assertTest("Test N: Active topic extracted as 'section 50'", intent.activeTopic.includes('section 50'), `Got: ${intent.activeTopic}`);

    const turn2Retrieved = await engine.retrieve("Section 50 requirements", 5);
    const turn2Result = synthesizeAuthoritativeAnswer(turn2Query, turn2Retrieved, history, "What are the requirements?");
    assertTest("Test N: Answer provides detailed Section 50 requirements",
      turn2Result.answer.toLowerCase().includes("gazetted officer") || turn2Result.answer.toLowerCase().includes("magistrate"),
      `Got: ${turn2Result.answer.slice(0, 150)}`
    );
  }

  // --- TEST O: "Explain Section 50 in one sentence." (One Sentence Constraint Fix) ---
  {
    const query = "Explain Section 50 in one sentence.";
    const intent = classifyQueryIntent(query);
    assertTest("Test O: 'One sentence' query classified as CONSTRAINED_DIRECT", intent.depth === AnswerDepth.CONSTRAINED_DIRECT, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test O: Answer is concise single-sentence summary of Section 50",
      result.answer.includes("Section 50 of the NDPS Act, 1985") && result.answer.length < 250,
      `Got: ${result.answer}`
    );
  }

  // --- TEST P: "State only the key point of Section 50." (Key Point Only Fix) ---
  {
    const query = "State only the key point of Section 50.";
    const intent = classifyQueryIntent(query);
    assertTest("Test P: 'Key point only' query classified as CONSTRAINED_DIRECT", intent.depth === AnswerDepth.CONSTRAINED_DIRECT, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test P: Answer focuses strictly on single key point of Section 50",
      result.answer.includes("Gazetted Officer or Magistrate") && result.answer.length < 300,
      `Got: ${result.answer}`
    );
  }

  // --- TEST Q: "Explain Section 50 in complete detail." (Complete Detail Fix) ---
  {
    const query = "Explain Section 50 in complete detail.";
    const intent = classifyQueryIntent(query);
    assertTest("Test Q: 'Complete detail' query classified as DETAILED", intent.depth === AnswerDepth.DETAILED, `Got: ${intent.depth}`);

    const retrieved = await engine.retrieve(query, 5);
    const result = synthesizeAuthoritativeAnswer(query, retrieved);
    assertTest("Test Q: Answer returns full detailed breakdown of Section 50",
      result.answer.includes("Mandatory Procedural Requirements") || result.answer.includes("Gazetted Officer"),
      `Got: ${result.answer.slice(0, 150)}`
    );
  }

  console.log(`\n----------------------------------------------------`);
  console.log(`SUMMARY: ${passed} / ${total} tests passed.`);
  console.log(`----------------------------------------------------\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runIntentDepthTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
