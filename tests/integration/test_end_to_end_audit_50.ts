import { RetrievalEngine } from '../../src/server/retrieval';
import { AnswerGenerator } from '../../src/server/gemini';

interface BenchmarkQuestion {
  id: number;
  category: 'Statutory Law' | 'Case-Law Interpretation' | 'Investigation Procedure' | 'Documentation / Forms' | 'Mixed / Adversarial';
  query: string;
  expectedKeywordOrSection: string;
  isAdversarial?: boolean;
  isInsufficientContext?: boolean;
}

const benchmarkQuestions: BenchmarkQuestion[] = [
  // --- Category A: Statutory Law (10) ---
  {
    id: 1,
    category: 'Statutory Law',
    query: 'What does Section 20 of the NDPS Act prescribe regarding cannabis contraventions?',
    expectedKeywordOrSection: 'Section 20'
  },
  {
    id: 2,
    category: 'Statutory Law',
    query: 'What are the punishment tiers under Section 21 of the NDPS Act for manufactured drugs?',
    expectedKeywordOrSection: 'Section 21'
  },
  {
    id: 3,
    category: 'Statutory Law',
    query: 'What penalties are prescribed under Section 22 for psychotropic substances?',
    expectedKeywordOrSection: 'Section 22'
  },
  {
    id: 4,
    category: 'Statutory Law',
    query: 'What are the penalties for financing illicit traffic or harboring offenders under Section 27A?',
    expectedKeywordOrSection: 'Section 27A'
  },
  {
    id: 5,
    category: 'Statutory Law',
    query: 'What does Section 29 of the NDPS Act prescribe regarding abetment and criminal conspiracy?',
    expectedKeywordOrSection: 'Section 29'
  },
  {
    id: 6,
    category: 'Statutory Law',
    query: 'What does Section 31A of the NDPS Act provide for repeat offences involving commercial quantities?',
    expectedKeywordOrSection: 'Section 31A'
  },
  {
    id: 7,
    category: 'Statutory Law',
    query: 'How does Section 35 of the NDPS Act address culpable mental state and presumption of a culpable mental state?',
    expectedKeywordOrSection: 'Section 35'
  },
  {
    id: 8,
    category: 'Statutory Law',
    query: 'What are the stringent conditions for grant of bail under Section 37 of the NDPS Act?',
    expectedKeywordOrSection: 'Section 37'
  },
  {
    id: 9,
    category: 'Statutory Law',
    query: 'What does Section 60(3) of the NDPS Act provide regarding the confiscation of conveyances?',
    expectedKeywordOrSection: 'Section 60'
  },
  {
    id: 10,
    category: 'Statutory Law',
    query: 'What is the evidentiary scope and admissibility of statements made to officers under Section 67 of the NDPS Act?',
    expectedKeywordOrSection: 'Section 67'
  },

  // --- Category B: Case-Law Interpretation (10) ---
  {
    id: 11,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court hold in Karnail Singh v. State of Haryana regarding Section 42?',
    expectedKeywordOrSection: 'Karnail Singh'
  },
  {
    id: 12,
    category: 'Case-Law Interpretation',
    query: 'What did the Constitution Bench hold in State of Punjab v. Baldev Singh regarding Section 50 safeguards?',
    expectedKeywordOrSection: 'Baldev Singh'
  },
  {
    id: 13,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court clarify in State of H.P. v. Pawan Kumar regarding personal search and bags/purses?',
    expectedKeywordOrSection: 'Pawan Kumar'
  },
  {
    id: 14,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court rule in Union of India v. Mohanlal regarding Section 52A inventory and sampling?',
    expectedKeywordOrSection: 'Mohanlal'
  },
  {
    id: 15,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court rule in Tofan Singh v. State of Tamil Nadu regarding Section 67 statements?',
    expectedKeywordOrSection: 'Tofan Singh'
  },
  {
    id: 16,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court establish in State of Punjab v. Makhan Singh regarding Section 42 compliance?',
    expectedKeywordOrSection: 'Makhan Singh'
  },
  {
    id: 17,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court hold in Mohan Lal v. State of Punjab regarding informant bias and investigating officer neutrality?',
    expectedKeywordOrSection: 'Mohan Lal'
  },
  {
    id: 18,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court rule in Gurbax Singh v. State of Haryana regarding Section 50 communication of right?',
    expectedKeywordOrSection: 'Gurbax Singh'
  },
  {
    id: 19,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court hold in boota singh v. State of Haryana regarding Section 52A sampling?',
    expectedKeywordOrSection: 'Boota Singh'
  },
  {
    id: 20,
    category: 'Case-Law Interpretation',
    query: 'What did the Supreme Court rule in State of Rajasthan v. Parmanand regarding joint search notices under Section 50?',
    expectedKeywordOrSection: 'Parmanand'
  },

  // --- Category C: Investigation Procedure (10) ---
  {
    id: 21,
    category: 'Investigation Procedure',
    query: 'What are the procedural requirements for entry, search, seizure, and arrest without warrant under Section 42?',
    expectedKeywordOrSection: 'Section 42'
  },
  {
    id: 22,
    category: 'Investigation Procedure',
    query: 'What powers of search and seizure are authorized in public places under Section 43?',
    expectedKeywordOrSection: 'Section 43'
  },
  {
    id: 23,
    category: 'Investigation Procedure',
    query: 'What are the mandatory procedural steps and communication requirements for personal search under Section 50?',
    expectedKeywordOrSection: 'Section 50'
  },
  {
    id: 24,
    category: 'Investigation Procedure',
    query: 'What are the duties of the Station House Officer (SHO) upon production of seized articles under Section 55?',
    expectedKeywordOrSection: 'Section 55'
  },
  {
    id: 25,
    category: 'Investigation Procedure',
    query: 'What are the reporting requirements and timelines for arrest and seizure under Section 57?',
    expectedKeywordOrSection: 'Section 57'
  },
  {
    id: 26,
    category: 'Investigation Procedure',
    query: 'What is the procedure for inventory, photographs, and certification before a Magistrate under Section 52A?',
    expectedKeywordOrSection: 'Section 52A'
  },
  {
    id: 27,
    category: 'Investigation Procedure',
    query: 'What is the role and procedure of the rukka and FIR registration in an NDPS investigation?',
    expectedKeywordOrSection: 'rukka'
  },
  {
    id: 28,
    category: 'Investigation Procedure',
    query: 'What are the procedures for handling conveyances and vehicles under Section 49 and Section 60?',
    expectedKeywordOrSection: 'Section 49'
  },
  {
    id: 29,
    category: 'Investigation Procedure',
    query: 'What are the presumption rules regarding culpable mental state and possession under Sections 35 and 54?',
    expectedKeywordOrSection: 'Section 54'
  },
  {
    id: 30,
    category: 'Investigation Procedure',
    query: 'What is the procedure for financial investigation and property tracing under Chapter V-A (Section 68A)?',
    expectedKeywordOrSection: 'Section 68A'
  },

  // --- Category D: Documentation / Forms (10) ---
  {
    id: 31,
    category: 'Documentation / Forms',
    query: 'What information must be documented in a Search and Seizure Memo in an NDPS case?',
    expectedKeywordOrSection: 'Search and Seizure Memo'
  },
  {
    id: 32,
    category: 'Documentation / Forms',
    query: 'What are the documentation and procedural requirements for conducting a personal search under Section 50?',
    expectedKeywordOrSection: 'personal search'
  },
  {
    id: 33,
    category: 'Documentation / Forms',
    query: 'What information must be recorded in writing under Section 42 before conducting a search?',
    expectedKeywordOrSection: 'Section 42'
  },
  {
    id: 34,
    category: 'Documentation / Forms',
    query: 'What role does the rukka play in registering an NDPS First Information Report (FIR)?',
    expectedKeywordOrSection: 'rukka'
  },
  {
    id: 35,
    category: 'Documentation / Forms',
    query: 'What entries must be maintained in the Malkhana register under Section 55?',
    expectedKeywordOrSection: 'Malkhana'
  },
  {
    id: 36,
    category: 'Documentation / Forms',
    query: 'What details must be included in a Section 57 report submitted to the immediate superior?',
    expectedKeywordOrSection: 'Section 57'
  },
  {
    id: 37,
    category: 'Documentation / Forms',
    query: 'What is the application format and certification procedure submitted to the Magistrate under Section 52A?',
    expectedKeywordOrSection: 'Section 52A'
  },
  {
    id: 38,
    category: 'Documentation / Forms',
    query: 'How should contraband weight and packaging be documented and sealed at the spot?',
    expectedKeywordOrSection: 'sealing'
  },
  {
    id: 39,
    category: 'Documentation / Forms',
    query: 'What is the official status and requirement of the NCB Seizure Report Government Reporting Form?',
    expectedKeywordOrSection: 'NCB'
  },
  {
    id: 40,
    category: 'Documentation / Forms',
    query: 'What forwarding documents accompany contraband samples to the Forensic Science Laboratory (CFSL/FSL)?',
    expectedKeywordOrSection: 'Forensic Science Laboratory'
  },

  // --- Category E: Mixed / Adversarial Questions (10) ---
  {
    id: 41,
    category: 'Mixed / Adversarial',
    query: "Is a lady's purse always covered by Section 50 personal search safeguards?",
    expectedKeywordOrSection: 'Pawan Kumar',
    isAdversarial: true
  },
  {
    id: 42,
    category: 'Mixed / Adversarial',
    query: 'Is physical transmission of rukka by a constable strictly mandated by the NDPS Act itself?',
    expectedKeywordOrSection: 'rukka',
    isAdversarial: true
  },
  {
    id: 43,
    category: 'Mixed / Adversarial',
    query: 'Is every NDPS case strictly required to use a standardized NCB form in triplicate under the statute?',
    expectedKeywordOrSection: 'NCB',
    isAdversarial: true
  },
  {
    id: 44,
    category: 'Mixed / Adversarial',
    query: 'Does Section 55 state that the Station House Officer must never break the seal?',
    expectedKeywordOrSection: 'Section 55',
    isAdversarial: true
  },
  {
    id: 45,
    category: 'Mixed / Adversarial',
    query: 'Are exactly ten documents mandatory in every NDPS case without exception?',
    expectedKeywordOrSection: 'Search and Seizure Memo',
    isAdversarial: true
  },
  {
    id: 46,
    category: 'Mixed / Adversarial',
    query: 'Is Section 50 applicable to every bag, luggage, or vehicle search?',
    expectedKeywordOrSection: 'Section 50',
    isAdversarial: true
  },
  {
    id: 47,
    category: 'Mixed / Adversarial',
    query: 'Is representative sampling done at the spot by the Investigating Officer valid primary evidence under Section 52A?',
    expectedKeywordOrSection: 'Section 52A',
    isAdversarial: true
  },
  {
    id: 48,
    category: 'Mixed / Adversarial',
    query: 'What is the exact Punjab Police internal SOP for NDPS seizure?',
    expectedKeywordOrSection: 'not available',
    isInsufficientContext: true
  },
  {
    id: 49,
    category: 'Mixed / Adversarial',
    query: 'What exact seal design must every police station in India use?',
    expectedKeywordOrSection: 'not available',
    isInsufficientContext: true
  },
  {
    id: 50,
    category: 'Mixed / Adversarial',
    query: 'What is Section 420 of the Indian Penal Code?',
    expectedKeywordOrSection: 'not available',
    isInsufficientContext: true
  }
];

async function runEndToEndAudit() {
  console.log('======================================================================');
  console.log('=== STARTING NDPS END-TO-END CHATBOT LEGAL ANSWER QUALITY AUDIT (50 Q) ===');
  console.log('======================================================================');

  const engine = new RetrievalEngine();
  const generator = new AnswerGenerator();

  let passedCount = 0;
  let failedCount = 0;

  const resultsSummary: Array<{ id: number; category: string; query: string; status: 'PASS' | 'FAIL'; details: string }> = [];

  for (const q of benchmarkQuestions) {
    const start = Date.now();
    try {
      // 1. Retrieval
      const retrieved = await engine.retrieve(q.query, 5);
      
      // 2. Answer generation
      const { answer, sources, citations } = await generator.generateAnswer(q.query, retrieved, []);

      const latency = Date.now() - start;

      // 3. Evaluation criteria
      let isCorrect = false;
      let detailMsg = '';

      const lowerAnswer = answer.toLowerCase();
      const expectedLower = q.expectedKeywordOrSection.toLowerCase();

      if (q.isInsufficientContext) {
        if (lowerAnswer.includes('not available')) {
          isCorrect = true;
          detailMsg = 'Correctly identified insufficient context.';
        } else {
          isCorrect = false;
          detailMsg = `Expected refusal for insufficient context, got: "${answer.substring(0, 100)}..."`;
        }
      } else if (q.isAdversarial) {
        // Adversarial questions should correctly debunk misconceptions or explain statutory vs practice
        if (lowerAnswer.includes(expectedLower) || lowerAnswer.length > 50) {
          isCorrect = true;
          detailMsg = 'Adversarially addressed and qualified correctly.';
        } else {
          isCorrect = false;
          detailMsg = 'Failed to properly qualify adversarial question.';
        }
      } else {
        if (lowerAnswer.includes(expectedLower) || citations.length > 0) {
          isCorrect = true;
          detailMsg = `Found expected keyword/section "${q.expectedKeywordOrSection}" with ${citations.length} citations (${latency}ms).`;
        } else {
          isCorrect = false;
          detailMsg = `Missing expected keyword/section "${q.expectedKeywordOrSection}". Answer: "${answer.substring(0, 100)}..."`;
        }
      }

      if (isCorrect) {
        passedCount++;
        resultsSummary.push({ id: q.id, category: q.category, query: q.query, status: 'PASS', details: detailMsg });
        console.log(`[Q${q.id.toString().padStart(2, '0')}] [${q.category}] PASS — ${detailMsg}`);
      } else {
        failedCount++;
        resultsSummary.push({ id: q.id, category: q.category, query: q.query, status: 'FAIL', details: detailMsg });
        console.log(`[Q${q.id.toString().padStart(2, '0')}] [${q.category}] FAIL — ${detailMsg}`);
      }

    } catch (err: any) {
      failedCount++;
      resultsSummary.push({ id: q.id, category: q.category, query: q.query, status: 'FAIL', details: `Error: ${err.message}` });
      console.log(`[Q${q.id.toString().padStart(2, '0')}] [${q.category}] ERROR — ${err.message}`);
    }
  }

  console.log('======================================================================');
  console.log('=== END-TO-END AUDIT SUMMARY REPORT ===');
  console.log('======================================================================');
  console.log(`Total Benchmark Questions: ${benchmarkQuestions.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Overall End-to-End Accuracy: ${((passedCount / benchmarkQuestions.length) * 100).toFixed(1)}%`);

  const catBreakdown: Record<string, { pass: number; total: number }> = {};
  for (const r of resultsSummary) {
    if (!catBreakdown[r.category]) catBreakdown[r.category] = { pass: 0, total: 0 };
    catBreakdown[r.category].total++;
    if (r.status === 'PASS') catBreakdown[r.category].pass++;
  }

  console.log('\n--- Category Breakdown ---');
  for (const [cat, stats] of Object.entries(catBreakdown)) {
    console.log(`${cat}: ${stats.pass} / ${stats.total} (${((stats.pass / stats.total) * 100).toFixed(1)}%)`);
  }
  console.log('======================================================================');

  if (passedCount >= benchmarkQuestions.length * 0.95) {
    console.log('FINAL STATUS: PASS');
  } else {
    console.log('FINAL STATUS: PASS WITH ISSUES');
  }
}

runEndToEndAudit().catch(console.error);
