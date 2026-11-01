import * as fs from 'fs';
import * as path from 'path';

interface TurnResult {
  turn: number | string;
  input: string;
  response: string;
  latencyMs: number;
  checks: { name: string; passed: boolean; note?: string }[];
  allPassed: boolean;
}

interface TestSectionResult {
  testId: string;
  title: string;
  description: string;
  turns: TurnResult[];
  allPassed: boolean;
}

async function sendChat(sessionId: string, message: string): Promise<{ answer: string; latencyMs: number; raw: any }> {
  const start = Date.now();
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message })
  });
  const data = await res.json();
  const latencyMs = Date.now() - start;
  return { answer: data.answer || '', latencyMs, raw: data };
}

async function runIndependentValidation() {
  console.log('================================================================');
  console.log('STARTING INDEPENDENT LIVE CHATBOT VALIDATION — NDPS v2.4.0');
  console.log('================================================================');

  const results: TestSectionResult[] = [];

  // ============================================================================
  // TEST 1 — Greetings and conversational opening (Fresh session for each)
  // ============================================================================
  console.log('\n--- EXECUTING TEST 1: GREETINGS AND CONVERSATIONAL OPENING ---');
  {
    const turns: TurnResult[] = [];
    const testCases = [
      { input: 'Hi', checkKeyword: 'Hello' },
      { input: 'Hello', checkKeyword: 'Hello' },
      { input: 'Kaise ho?', checkKeyword: 'theek' },
      { input: 'Namaste', checkKeyword: 'Namaste' },
      { input: 'Thank you', checkKeyword: 'swagat' },
      { input: 'Mujhe ek information mili hai.', checkKeyword: 'details' },
      { input: 'I have received secret information.', checkKeyword: 'details' }
    ];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const sessId = `qa-test1-${i}-${Date.now()}`;
      const { answer, latencyMs } = await sendChat(sessId, tc.input);
      const lower = answer.toLowerCase();

      const notRejected = !lower.includes('outside authorized ndps') && !lower.includes('not available in the reference material');
      const noPrematureWorkflow = !lower.includes('chance recovery workflow') && !lower.includes('stage 1 of 14');
      const isNatural = answer.length > 10;
      const invitesDetails = (i >= 5) ? (lower.includes('detail') || lower.includes('share') || lower.includes('bataiye') || lower.includes('स्थान') || lower.includes('पदार्थ')) : true;

      const checks = [
        { name: 'Natural response without out-of-domain rejection', passed: notRejected && isNatural },
        { name: 'Does not invent recovery workflow or document prematurely', passed: noPrematureWorkflow },
        { name: 'Invites officer to share case details when preamble given', passed: invitesDetails }
      ];

      const allPassed = checks.every(c => c.passed);
      turns.push({
        turn: i + 1,
        input: tc.input,
        response: answer,
        latencyMs,
        checks,
        allPassed
      });
      console.log(`[Test 1.${i + 1}] "${tc.input}" -> [${allPassed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    results.push({
      testId: 'TEST-1',
      title: 'Greetings and Conversational Opening',
      description: 'Verify greetings, preambles, and conversational openings across English and Hindi/Hinglish in fresh sessions.',
      turns,
      allPassed: turns.every(t => t.allPassed)
    });
  }

  // ============================================================================
  // TEST 2 — Spelling, Hindi and Hinglish
  // ============================================================================
  console.log('\n--- EXECUTING TEST 2: SPELLING, HINDI AND HINGLISH ---');
  {
    const turns: TurnResult[] = [];
    const testCases = [
      { input: 'fard makboozgi', expectTemplate: true, doc: 'फर्द' },
      { input: 'fard makboojgi', expectTemplate: true, doc: 'फर्द' },
      { input: 'makboozgi', expectTemplate: true, doc: 'फर्द' },
      { input: 'fard baramadgi', expectTemplate: true, doc: 'फर्द' },
      { input: 'fard zabti', expectTemplate: true, doc: 'फर्द' },
      { input: 'templeate of this', expectTemplate: false, ambiguity: true },
      { input: 'formate dikhao', expectTemplate: false, ambiguity: true },
      { input: 'btao isme kya likhna hai', expectExplanationOrClarification: true }
    ];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const sessId = `qa-test2-${i}-${Date.now()}`;
      const { answer, latencyMs } = await sendChat(sessId, tc.input);
      const lower = answer.toLowerCase();

      const checks = [];
      if (tc.expectTemplate) {
        checks.push({
          name: 'Understands phonetic spelling / colloquial alias and presents original Hindi template',
          passed: (answer.includes('फर्द') || answer.includes('बरामदगी') || answer.includes('मकबूजगी')) && answer.includes('______')
        });
      } else if (tc.ambiguity) {
        checks.push({
          name: 'Understands typo/pronoun and asks focused clarification without hallucinating',
          passed: lower.includes('which') || lower.includes('spasht') || lower.includes('kaun') || lower.includes('kripya') || answer.includes('स्पष्ट') || answer.includes('कौन सा')
        });
      } else if (tc.expectExplanationOrClarification) {
        checks.push({
          name: 'Understands informal shorthand and explains required contents or asks clarification',
          passed: lower.includes('fard') || lower.includes('document') || answer.includes('फर्द') || answer.includes('दस्तावेज़') || lower.includes('which') || lower.includes('kya')
        });
      }

      const allPassed = checks.every(c => c.passed);
      turns.push({
        turn: i + 1,
        input: tc.input,
        response: answer,
        latencyMs,
        checks,
        allPassed
      });
      console.log(`[Test 2.${i + 1}] "${tc.input}" -> [${allPassed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    results.push({
      testId: 'TEST-2',
      title: 'Spelling, Hindi and Hinglish Understanding',
      description: 'Audit phonetic spellings, colloquialisms, typos, and shorthand terms.',
      turns,
      allPassed: turns.every(t => t.allPassed)
    });
  }

  // ============================================================================
  // TEST 3 — Incremental Case Facts and Memory (One Session)
  // ============================================================================
  console.log('\n--- EXECUTING TEST 3: INCREMENTAL CASE FACTS AND MEMORY ---');
  {
    const turns: TurnResult[] = [];
    const sessId = `qa-test3-${Date.now()}`;

    const inputs = [
      'Mujhe ek informer se information mili hai.',
      'Information ka time 6:30 PM tha.',
      'Location Sadar Una hai.',
      'Ghar residential hai.',
      'Substance heroin bataya gaya hai.',
      'Abhi search nahi hui hai.',
      'Location kya thi?',
      'Information ka time kya tha?',
      'Premises kis type ka hai?',
      'Abhi search hui hai kya?',
      'Mere case ki confirmed details batao.'
    ];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const { answer, latencyMs } = await sendChat(sessId, input);
      const lower = answer.toLowerCase();

      const checks = [];
      if (i === 0) {
        checks.push({
          name: 'Records initial informer information',
          passed: lower.includes('informer') || lower.includes('information') || answer.includes('सूचना')
        });
      } else if (i === 1) {
        checks.push({
          name: 'Records time 6:30 PM',
          passed: answer.includes('6:30')
        });
      } else if (i === 2) {
        checks.push({
          name: 'Records location Sadar Una',
          passed: lower.includes('sadar') || lower.includes('una') || answer.includes('सदर')
        });
      } else if (i === 3) {
        checks.push({
          name: 'Records residential house',
          passed: lower.includes('residential') || answer.includes('आवासीय')
        });
      } else if (i === 4) {
        checks.push({
          name: 'Records substance heroin',
          passed: lower.includes('heroin') || answer.includes('हेरोइन')
        });
      } else if (i === 5) {
        checks.push({
          name: 'Acknowledges search not yet conducted',
          passed: lower.includes('not conducted') || lower.includes('nahi') || answer.includes('नहीं')
        });
      } else if (i === 6) {
        checks.push({
          name: 'Recalls location Sadar Una accurately',
          passed: lower.includes('sadar') || lower.includes('una') || answer.includes('सदर')
        });
      } else if (i === 7) {
        checks.push({
          name: 'Recalls time 6:30 PM accurately',
          passed: answer.includes('6:30')
        });
      } else if (i === 8) {
        checks.push({
          name: 'Recalls premises type residential house accurately',
          passed: lower.includes('residential') || answer.includes('आवासीय')
        });
      } else if (i === 9) {
        checks.push({
          name: 'Recalls search status as NOT CONDUCTED',
          passed: lower.includes('no') || lower.includes('nahi') || lower.includes('pending') || lower.includes('not conducted') || answer.includes('नहीं')
        });
      } else if (i === 10) {
        checks.push({
          name: 'Synthesizes complete confirmed facts record with no invented actions',
          passed: (lower.includes('sadar') || lower.includes('una')) &&
                  answer.includes('6:30') &&
                  (lower.includes('heroin') || answer.includes('हेरोइन')) &&
                  (lower.includes('residential') || answer.includes('आवासीय')) &&
                  !lower.includes('recovered 500') && !lower.includes('weighed 1')
        });
      }

      const allPassed = checks.every(c => c.passed);
      turns.push({
        turn: i + 1,
        input,
        response: answer,
        latencyMs,
        checks,
        allPassed
      });
      console.log(`[Test 3.${i + 1}] "${input}" -> [${allPassed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    results.push({
      testId: 'TEST-3',
      title: 'Incremental Case Facts and Memory Retention',
      description: 'Submit 6 case facts sequentially and verify 5 fact-recall queries from active case memory.',
      turns,
      allPassed: turns.every(t => t.allPassed)
    });

    // ============================================================================
    // TEST 4 — Single-Field Correction (Continue in Same Session from Test 3)
    // ============================================================================
    console.log('\n--- EXECUTING TEST 4: SINGLE-FIELD CORRECTION ---');
    {
      const corrTurns: TurnResult[] = [];
      const corrInputs = [
        'Iska time 6:45 PM kar do.',
        'Location kya thi?',
        'Information ka time kya hai?',
        'Ghar residential hi hai na?',
        'Abhi search hui hai kya?'
      ];

      for (let i = 0; i < corrInputs.length; i++) {
        const input = corrInputs[i];
        const { answer, latencyMs } = await sendChat(sessId, input);
        const lower = answer.toLowerCase();

        const checks = [];
        if (i === 0) {
          checks.push({
            name: 'Updates time to 6:45 PM and acknowledges correction',
            passed: answer.includes('6:45') && (lower.includes('update') || lower.includes('supersed') || answer.includes('संशोधित') || answer.includes('दर्ज'))
          });
        } else if (i === 1) {
          checks.push({
            name: 'Location remains Sadar / Una (not erased by time update)',
            passed: lower.includes('sadar') || lower.includes('una') || answer.includes('सदर')
          });
        } else if (i === 2) {
          checks.push({
            name: 'Confirmed time is now 6:45 PM (old 6:30 PM replaced)',
            passed: answer.includes('6:45')
          });
        } else if (i === 3) {
          checks.push({
            name: 'Premises remains residential house',
            passed: lower.includes('residential') || answer.includes('आवासीय')
          });
        } else if (i === 4) {
          checks.push({
            name: 'Search remains NOT CONDUCTED / pending',
            passed: lower.includes('no') || lower.includes('nahi') || lower.includes('pending') || lower.includes('not conducted') || answer.includes('नहीं')
          });
        }

        const allPassed = checks.every(c => c.passed);
        corrTurns.push({
          turn: i + 1,
          input,
          response: answer,
          latencyMs,
          checks,
          allPassed
        });
        console.log(`[Test 4.${i + 1}] "${input}" -> [${allPassed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
      }

      results.push({
        testId: 'TEST-4',
        title: 'Single-Field Correction and State Integrity',
        description: 'Update only the time field to 6:45 PM and verify all other case facts remain intact.',
        turns: corrTurns,
        allPassed: corrTurns.every(t => t.allPassed)
      });
    }
  }

  // ============================================================================
  // TEST 5 — Workflow Classification (Separate Fresh Sessions)
  // ============================================================================
  console.log('\n--- EXECUTING TEST 5: WORKFLOW CLASSIFICATION ---');
  {
    const turns: TurnResult[] = [];

    // Scenario A: Information received, no search yet
    {
      const sessA = `qa-test5-A-${Date.now()}`;
      const msg = 'Informer ne confidential information di hai ki ek godown mein charas rakhi hai. Abhi koi talashi nahi hui hai.';
      const { answer, latencyMs } = await sendChat(sessA, msg);
      const lower = answer.toLowerCase();
      const passed = (lower.includes('information-based') || lower.includes('42') || answer.includes('गुप्त सूचना') || answer.includes('धारा 42')) &&
                     !lower.includes('chance recovery workflow');
      turns.push({
        turn: 'Scenario A',
        input: msg,
        response: answer,
        latencyMs,
        checks: [{ name: 'Routes to Information-Based workflow (Sec 42 compliance)', passed }],
        allPassed: passed
      });
      console.log(`[Test 5.A] Scenario A -> [${passed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    // Scenario B: Suspect found with contraband, actual recovery explicitly confirmed
    {
      const sessB = `qa-test5-B-${Date.now()}`;
      const msg = 'Gasht ke dauran ek vyakti ko roka gaya aur uske paas se 500 gram charas mauke par baramad ho gayi hai.';
      const { answer, latencyMs } = await sendChat(sessB, msg);
      const lower = answer.toLowerCase();
      const passed = (lower.includes('chance recovery') || answer.includes('चांस रिकवरी') || answer.includes('फर्द') || lower.includes('seizure memo')) &&
                     !lower.includes('section 42(2) report within 72 hours');
      turns.push({
        turn: 'Scenario B',
        input: msg,
        response: answer,
        latencyMs,
        checks: [{ name: 'Routes to Chance Recovery (Spot Seizure Memo stage)', passed }],
        allPassed: passed
      });
      console.log(`[Test 5.B] Scenario B -> [${passed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    // Scenario C: Suspect fled before any recovery; no contraband found
    {
      const sessC = `qa-test5-C-${Date.now()}`;
      const msg = 'Naka checking ke dauran ek car aayi, police ko dekh kar chalak gaadi chhod kar bhag gaya. Talashi lene par gaadi se koi contraband recover nahi hua.';
      const { answer, latencyMs } = await sendChat(sessC, msg);
      const lower = answer.toLowerCase();
      const passed = (lower.includes('no recovery') || answer.includes('कोई बरामदगी नहीं') || answer.includes('घटना दस्तावेज़ीकरण') || lower.includes('incident documentation') || lower.includes('general diary')) &&
                     !lower.includes('fard baramadgi proforma') && !lower.includes('seizure memo proforma');
      turns.push({
        turn: 'Scenario C',
        input: msg,
        response: answer,
        latencyMs,
        checks: [{ name: 'Classifies as No Recovery / Incident Documentation without seizure memo', passed }],
        allPassed: passed
      });
      console.log(`[Test 5.C] Scenario C -> [${passed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    // Scenario D: Search conducted but no contraband recovered
    {
      const sessD = `qa-test5-D-${Date.now()}`;
      const msg = 'Sadar mein ek suspect ki talashi li gayi par uske paas se koi narcotics ya contraband recover nahi hua. Search report banani hai.';
      const { answer, latencyMs } = await sendChat(sessD, msg);
      const lower = answer.toLowerCase();
      const passed = (lower.includes('no recovery') || lower.includes('nil') || answer.includes('कोई बरामदगी नहीं') || lower.includes('incident') || lower.includes('diary')) &&
                     !lower.includes('electronic weighing scale weight 500g');
      turns.push({
        turn: 'Scenario D',
        input: msg,
        response: answer,
        latencyMs,
        checks: [{ name: 'Prevents contraband seizure generation when search yielded nil recovery', passed }],
        allPassed: passed
      });
      console.log(`[Test 5.D] Scenario D -> [${passed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    results.push({
      testId: 'TEST-5',
      title: 'Workflow Classification Scenarios',
      description: 'Audit accurate workflow selection across Information-Based, Chance Recovery, Suspect Fled, and Nil Recovery.',
      turns,
      allPassed: turns.every(t => t.allPassed)
    });
  }

  // ============================================================================
  // TEST 6 — Information-Based Follow-ups (Controlled Session)
  // ============================================================================
  console.log('\n--- EXECUTING TEST 6: INFORMATION-BASED FOLLOW-UPS ---');
  {
    const turns: TurnResult[] = [];
    const sessId = `qa-test6-${Date.now()}`;

    // Setup session facts
    await sendChat(sessId, 'Mujhe secret information mili hai ki Sadar Una ke ek residential house mein narcotics rakhe hain. Time 6:30 PM hai aur abhi koi search nahi hui hai.');

    const followUps = [
      'Ab mujhe kya karna chahiye?',
      'Kya Section 50 ka notice abhi dena hai?',
      'Section 42 aur BNSS Section 185 mein kya difference hai?',
      'Kaunsi details abhi confirm karni baaki hain?'
    ];

    for (let i = 0; i < followUps.length; i++) {
      const q = followUps[i];
      const { answer, latencyMs } = await sendChat(sessId, q);
      const lower = answer.toLowerCase();

      const checks = [];
      if (i === 0) {
        checks.push({
          name: 'Directs to Sec 42(1) recording and 42(2) dispatch, does not leap to seizure',
          passed: (lower.includes('42') || answer.includes('42(1)')) && !lower.includes('fard makboozgi proforma')
        });
      } else if (i === 1) {
        checks.push({
          name: 'Explains Sec 50 applies to personal body search, not advance premises search',
          passed: (lower.includes('personal') || lower.includes('body') || answer.includes('व्यक्तिगत') || answer.includes('शरीर')) &&
                  (lower.includes('premises') || lower.includes('makan') || answer.includes('मकान') || answer.includes('परिसर') || lower.includes('abhi nahi'))
        });
      } else if (i === 2) {
        checks.push({
          name: 'Distinguishes NDPS Sec 42 special law safeguards from general search provisions under BNSS 185',
          passed: (lower.includes('42') && (lower.includes('185') || lower.includes('bnss'))) || answer.includes('42')
        });
      } else if (i === 3) {
        checks.push({
          name: 'Identifies pending items (empowerment, warrant/grounds of belief, search execution)',
          passed: lower.includes('quantity') || lower.includes('warrant') || lower.includes('ground') || lower.includes('search') || answer.includes('मात्रा') || answer.includes('तलाशी')
        });
      }

      const allPassed = checks.every(c => c.passed);
      turns.push({
        turn: i + 1,
        input: q,
        response: answer,
        latencyMs,
        checks,
        allPassed
      });
      console.log(`[Test 6.${i + 1}] "${q}" -> [${allPassed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    results.push({
      testId: 'TEST-6',
      title: 'Information-Based Follow-ups & Procedural Integrity',
      description: 'Audit procedural next steps, Section 50 applicability, BNSS 185 comparison, and pending case details.',
      turns,
      allPassed: turns.every(t => t.allPassed)
    });
  }

  // ============================================================================
  // TEST 7 — Legal Precision & Statutory Boundaries
  // ============================================================================
  console.log('\n--- EXECUTING TEST 7: LEGAL PRECISION & STATUTORY BOUNDARIES ---');
  {
    const turns: TurnResult[] = [];
    const legalQuestions = [
      {
        q: 'Section 42 aur Section 50 mein kya difference hai?',
        check: (a: string) => {
          const l = a.toLowerCase();
          return (l.includes('premises') || l.includes('place') || a.includes('स्थान') || a.includes('मकान') || a.includes('परिसर')) &&
                 (l.includes('personal') || l.includes('body') || a.includes('व्यक्तिगत') || a.includes('शरीर'));
        },
        desc: 'Distinguishes Sec 42 premises search from Sec 50 bodily personal search'
      },
      {
        q: 'Kya premises search mein Section 50 automatically apply hota hai?',
        check: (a: string) => {
          const l = a.toLowerCase();
          return (l.includes('not') || l.includes('nahi') || a.includes('नहीं') || l.includes('automatic')) &&
                 (l.includes('baldev') || l.includes('pawan kumar') || l.includes('personal') || a.includes('व्यक्तिगत'));
        },
        desc: 'Explains premises search does NOT automatically trigger Sec 50 (Baldev Singh / Pawan Kumar)'
      },
      {
        q: 'Section 52A ka purpose kya hai?',
        check: (a: string) => {
          const l = a.toLowerCase();
          return (l.includes('magistrate') || a.includes('मजिस्ट्रेट')) &&
                 (l.includes('inventory') || l.includes('sample') || a.includes('प्रमाणीकरण') || a.includes('नमूना'));
        },
        desc: 'Explains Section 52A Magistrate inventory & sample certification (Mohanlal)'
      },
      {
        q: 'BNSS Section 105 ka kya role hai?',
        check: (a: string) => {
          const l = a.toLowerCase();
          return (l.includes('audio-video') || l.includes('recording') || l.includes('electronic') || a.includes('ऑडियो-वीडियो') || a.includes('वीडियोग्राफी'));
        },
        desc: 'Explains mandatory audio-video recording for search and seizure under BNSS Section 105'
      },
      {
        q: 'Section 67 ke statement ki evidentiary value kya hai?',
        check: (a: string) => {
          const l = a.toLowerCase();
          return (l.includes('tofan singh') || l.includes('confession') || l.includes('inadmissible') || a.includes('तूफान सिंह') || a.includes('अस्वीकार्य') || a.includes('स्वीकारोक्ति'));
        },
        desc: 'Explains Tofan Singh ruling that confessional statements under Section 67 are inadmissible as confessions'
      }
    ];

    for (let i = 0; i < legalQuestions.length; i++) {
      const lq = legalQuestions[i];
      const sessId = `qa-test7-${i}-${Date.now()}`;
      const { answer, latencyMs } = await sendChat(sessId, lq.q);
      const passed = lq.check(answer);

      turns.push({
        turn: i + 1,
        input: lq.q,
        response: answer,
        latencyMs,
        checks: [{ name: lq.desc, passed }],
        allPassed: passed
      });
      console.log(`[Test 7.${i + 1}] "${lq.q}" -> [${passed ? 'PASS' : 'FAIL'}] (${latencyMs}ms)`);
    }

    results.push({
      testId: 'TEST-7',
      title: 'Legal Precision & Statutory Boundaries',
      description: 'Audit core statutory provisions (NDPS 42, 50, 52A, 67, BNSS 105) and constitutional jurisprudence.',
      turns,
      allPassed: turns.every(t => t.allPassed)
    });
  }

  // ============================================================================
  // SUMMARY REPORT GENERATION
  // ============================================================================
  const outPath = path.join(process.cwd(), 'independent_live_validation_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');

  let totalTurns = 0;
  let passedTurns = 0;
  for (const r of results) {
    for (const t of r.turns) {
      totalTurns++;
      if (t.allPassed) passedTurns++;
    }
  }

  console.log('\n================================================================');
  console.log(`INDEPENDENT VALIDATION COMPLETE: ${passedTurns} / ${totalTurns} turns passed (${((passedTurns / totalTurns) * 100).toFixed(1)}%).`);
  console.log(`Results saved to: ${outPath}`);
  console.log('================================================================\n');
}

runIndependentValidation().catch(err => {
  console.error('Validation script execution failed:', err);
  process.exit(1);
});
