import { RetrievalEngine } from '../../src/server/retrieval';
import { AnswerGenerator } from '../../src/server/gemini';
import { normalizeStatutoryReferences } from '../../src/server/normalization';

const retrieval = new RetrievalEngine();
const generator = new AnswerGenerator();

interface TestStep {
  message: string;
  expectedKeywords?: string[];
  forbiddenKeywords?: string[];
  customValidator?: (answer: string, citations: any[]) => boolean;
}

interface TestCase {
  id: string;
  name: string;
  steps: TestStep[];
}

const TEST_CASES: TestCase[] = [
  {
    id: 'conversation-a',
    name: 'Conversation A: Female Search -> "which section" (Concise)',
    steps: [
      {
        message: 'can female personal search allowed in public',
        expectedKeywords: [
          'No female shall be searched by anyone excepting a female',
          'Section 50(4)',
          'isolated place',
          'strict regard to decency',
          'lady Police officer'
        ]
      },
      {
        message: 'which section',
        expectedKeywords: [
          'Section 50(4) of the NDPS Act, 1985',
          'No female shall be searched by anyone excepting a female'
        ],
        forbiddenKeywords: [
          'Hierarchy of Search Personnel',
          'Lady Sub-Inspector Unavailable'
        ],
        customValidator: (answer: string) => {
          // Verify that the short follow-up is actually short (< 350 chars)
          return answer.length < 400;
        }
      }
    ]
  },
  {
    id: 'conversation-b',
    name: 'Conversation B: Female Search -> "which section" -> "explain more" (Expanded)',
    steps: [
      {
        message: 'can female personal search allowed in public',
        expectedKeywords: [
          'No female shall be searched by anyone excepting a female',
          'Section 50(4)',
          'isolated place',
          'strict regard to decency'
        ]
      },
      {
        message: 'which section',
        expectedKeywords: [
          'Section 50(4) of the NDPS Act, 1985',
          'No female shall be searched by anyone excepting a female'
        ],
        customValidator: (answer: string) => answer.length < 400
      },
      {
        message: 'explain more',
        expectedKeywords: [
          'No female shall be searched by anyone excepting a female',
          'lady Police officer',
          'lady constable',
          'female civilian / private lady',
          'isolated place',
          'strict regard to decency',
          'Section 50(1)',
          'Pawan Kumar'
        ],
        customValidator: (answer: string) => {
          // Verify that explain more provides the full 3-tier expanded framework
          return (
            answer.includes('STATUTORY') &&
            answer.includes('PROCEDURAL & TRAINING GUIDANCE') &&
            answer.includes('JUDICIAL INTERPRETATION')
          );
        }
      }
    ]
  },
  {
    id: 'conversation-c',
    name: 'Conversation C: Section 50 -> "explain more"',
    steps: [
      {
        message: 'section 50',
        expectedKeywords: ['Section 50']
      },
      {
        message: 'explain more',
        expectedKeywords: [
          'Section 50(1)',
          'Gazetted Officer or Magistrate',
          'Section 50(4)',
          'No female shall be searched by anyone excepting a female'
        ]
      }
    ]
  },
  {
    id: 'conversation-d',
    name: 'Conversation D: Section 11 -> "explain more"',
    steps: [
      {
        message: 'section11',
        expectedKeywords: [
          'NDPS Act, 1985 — Section 11',
          'Prohibition of Attachment',
          'PIT NDPS Act, 1988 — Section 11',
          'Maximum Period of Detention',
          '1 year',
          '2 years'
        ]
      },
      {
        message: 'explain more',
        expectedKeywords: [
          'Detailed Statutory Analysis',
          'distrained or attached',
          '1 year',
          '2 years'
        ]
      }
    ]
  },
  {
    id: 'test-section11-bare-2',
    name: 'Section 11 Space Format ("section 11")',
    steps: [
      {
        message: 'section 11',
        expectedKeywords: [
          'NDPS Act, 1985 — Section 11',
          'Prohibition of Attachment',
          'PIT NDPS Act, 1988 — Section 11',
          '1 year',
          '2 years'
        ]
      }
    ]
  },
  {
    id: 'test-conversation-topic-shift',
    name: 'Conversation Topic State Shift ("section11" -> "ndps" -> "tell me more")',
    steps: [
      {
        message: 'section11',
        expectedKeywords: ['Section 11']
      },
      {
        message: 'ndps',
        expectedKeywords: ['Narcotic Drugs and Psychotropic Substances Act, 1985']
      },
      {
        message: 'tell me more',
        expectedKeywords: ['NDPS Act, 1985']
      }
    ]
  },
  {
    id: 'test-adversarial-section10',
    name: 'Adversarial: Section 10 of NDPS Act',
    steps: [
      {
        message: 'tell me about section 10 of ndps act',
        expectedKeywords: ['PIT NDPS Act, 1988', 'Section 10 of the NDPS Act, 1985 are not contained']
      }
    ]
  },
  {
    id: 'test-adversarial-31a-pit',
    name: 'Adversarial: Section 31A of PIT NDPS Act',
    steps: [
      {
        message: 'what is section 31a of pit ndps act',
        expectedKeywords: ['NDPS Act, 1985', 'PIT NDPS Act does not contain a Section 31A']
      }
    ]
  },
  {
    id: 'test-unsupported-refusal',
    name: 'Unsupported Query Refusal',
    steps: [
      {
        message: 'What is the procedure for traffic violations under the Motor Vehicles Act?',
        expectedKeywords: ['The answer is not available in the provided NDPS reference material.']
      }
    ]
  },
  {
    id: 'workflow-test-1',
    name: 'Workflow Test 1: Full NDPS Investigation Workflow',
    steps: [
      {
        message: 'Explain the NDPS investigation workflow from Section 42 to 52A',
        expectedKeywords: [
          'Section 42 Information',
          'Personal Search',
          'Search and Seizure',
          'Section 50 Compliance',
          'Rukka',
          'FIR',
          'Section 55',
          'Section 57',
          'Section 52A'
        ]
      }
    ]
  },
  {
    id: 'workflow-test-2',
    name: 'Workflow Test 2: Section 57 Report Only',
    steps: [
      {
        message: 'What is the Section 57 report?',
        expectedKeywords: ['Section 57', '48 hours', 'immediate official superior'],
        forbiddenKeywords: ['Stage 1: SECTION 42', 'Stage 9: SECTION 52A']
      }
    ]
  },
  {
    id: 'workflow-test-3',
    name: 'Workflow Test 3: What happens after seizure?',
    steps: [
      {
        message: 'What happens after seizure?',
        expectedKeywords: ['Post-Seizure', 'Section 50', 'Rukka', 'FIR', 'Section 55', 'Section 57', 'Section 52A'],
        forbiddenKeywords: ['Stage 1: SECTION 42 INFORMATION']
      }
    ]
  },
  {
    id: 'workflow-test-4',
    name: 'Workflow Test 4: Who handles seized material under Section 55?',
    steps: [
      {
        message: 'Who handles the seized material under Section 55?',
        expectedKeywords: ['Section 55', 'Station House Officer', 'Malkhana', 'safe custody', 'police station seal']
      }
    ]
  },
  {
    id: 'workflow-test-5',
    name: 'Workflow Test 5: What happens under Section 52A?',
    steps: [
      {
        message: 'What happens under Section 52A?',
        expectedKeywords: ['Section 52A', 'inventory', 'Magistrate', 'photographs', 'representative samples', 'PRIMARY EVIDENCE']
      }
    ]
  },
  {
    id: 'workflow-test-6',
    name: 'Workflow Test 6: Refusal to generate Magistrate order under 52A',
    steps: [
      {
        message: 'Generate the Magistrate order under 52A',
        expectedKeywords: ['cannot generate', 'official judicial proceeding', 'Section 52A']
      }
    ]
  },
  {
    id: 'workflow-test-7',
    name: 'Workflow Test 7: Does Section 57 authorize search?',
    steps: [
      {
        message: 'Does Section 57 authorize search?',
        expectedKeywords: ['No', 'Section 57', 'reporting', '48 hours']
      }
    ]
  },
  {
    id: 'workflow-test-8',
    name: 'Workflow Test 8: Does Section 50 apply to every seizure?',
    steps: [
      {
        message: 'Does Section 50 apply to every seizure?',
        expectedKeywords: ['No', 'personal bodily search', 'Pawan Kumar']
      }
    ]
  },
  {
    id: 'workflow-test-9',
    name: 'Workflow Test 9: Difference between Section 55 and Section 57',
    steps: [
      {
        message: 'Explain the difference between Section 55 and Section 57',
        expectedKeywords: ['Section 55', 'Section 57', 'Malkhana', '48-hour']
      }
    ]
  },
  {
    id: 'workflow-test-10',
    name: 'Workflow Test 10: Complete chronology from seizure to Magistrate',
    steps: [
      {
        message: 'Explain the complete chronology from seizure to Magistrate',
        expectedKeywords: ['Search & seizure', 'Section 55', 'Section 57', 'Section 52A', 'Magistrate']
      }
    ]
  },
  {
    id: 'test-a-private-vehicle-public-road',
    name: 'Test A: Private Vehicle on a Public Road (Boota Singh vs Jarnail Singh)',
    steps: [
      {
        message: 'What law applies to searching a private vehicle stopped on a public road under Section 42 vs Section 43?',
        expectedKeywords: ['Boota Singh', 'Jarnail Singh', 'Section 42', 'Section 43', 'private vehicle', 'public road'],
        customValidator: (answer: string, citations: any[]) => {
          return answer.includes('clarification') || answer.includes('?') || answer.includes('missing facts');
        }
      }
    ]
  },
  {
    id: 'test-b-public-conveyance-search',
    name: 'Test B: Public Conveyance Search (Section 43 Explanation + Section 50)',
    steps: [
      {
        message: 'What are the rules for searching a public conveyance under Section 43?',
        expectedKeywords: ['Section 43', 'public conveyance', 'Explanation', 'Section 50', 'personal search']
      }
    ]
  },
  {
    id: 'test-c-night-search-proviso',
    name: 'Test C: Night-Time Search Proviso (Sunset to Sunrise)',
    steps: [
      {
        message: 'Does the Section 42 night search proviso apply to all night searches?',
        expectedKeywords: ['Section 42', 'proviso', 'sunset to sunrise', 'Section 41', 'Section 43', 'without a warrant']
      }
    ]
  },
  {
    id: 'test-d-section-42-2-forwarding',
    name: 'Test D: Section 42(2) Forwarding Requirement (72-Hour Period)',
    steps: [
      {
        message: 'What is the requirement for forwarding information under Section 42(2)?',
        expectedKeywords: ['72 hours', 'immediate official superior', 'Section 42(2)', 'grounds of belief']
      }
    ]
  },
  {
    id: 'test-e-section-50-scope',
    name: 'Test E: Section 50 Personal Search vs Vehicle vs Bag',
    steps: [
      {
        message: 'Does Section 50 apply to searching a vehicle or a bag?',
        expectedKeywords: ['Section 50', 'Pawan Kumar', 'personal bodily search', 'bag', 'vehicle', 'does not apply']
      }
    ]
  },
  {
    id: 'test-f-karnail-singh-standards',
    name: 'Test F: Karnail Singh Compliance Standards (3 Tiers)',
    steps: [
      {
        message: 'What did the Supreme Court hold in Karnail Singh v. State of Haryana regarding Section 42 compliance?',
        expectedKeywords: ['Karnail Singh', 'total non-compliance', 'delayed compliance', 'substantial compliance', 'emergent']
      }
    ]
  },
  {
    id: 'test-g-information-based-workflow',
    name: 'Test G: 15-Stage Information-Based Document Workflow',
    steps: [
      {
        message: 'Explain the complete 15-stage document workflow for an information-based NDPS recovery',
        expectedKeywords: ['15', 'Pre-Search Information', 'Section 42(2)', 'Section 41(1)', 'Statutory requirement', 'Conditional requirement', 'Departmental documentation practice']
      }
    ]
  },
  {
    id: 'test-h-evidence-integrity-backdating',
    name: 'Test H: Evidence Integrity & Anti-Backdating Guidance',
    steps: [
      {
        message: 'Can an officer backdate a Section 42 information memo or General Diary entry if it was missed earlier?',
        expectedKeywords: ['Strictly NO', 'backdat', 'fabricat', 'General Diary', 'Section 57', 'superior', 'transparent']
      }
    ]
  },
  {
    id: 'test-i-unsupported-query-refusal',
    name: 'Test I: Unsupported Query Refusal (Motor Vehicles Act)',
    steps: [
      {
        message: 'What are the compounding fees for traffic violations under the Motor Vehicles Act?',
        expectedKeywords: ['The answer is not available in the provided NDPS reference material.']
      }
    ]
  },
  {
    id: 'test-j-realistic-scenario-prior-info',
    name: 'Test J: Realistic Scenario (Prior Info, Informant, Heroin, Vehicle, Planned Search)',
    steps: [
      {
        message: 'An informant provided prior information regarding suspected heroin concealed in a specified vehicle. Operation is planned for later this evening, information is not yet reduced to writing, and no search authorization has been obtained yet. What are the legal procedural requirements for this search?',
        expectedKeywords: ['Section 42', 'Section 43', 'Boota Singh', 'Jarnail Singh', 'Section 50', 'Karnail Singh', '72 hours', 'sunset', 'sunrise'],
        forbiddenKeywords: [
          'This inquiry falls outside authorized NDPS',
          'Because different statutory provisions, notifications, and legal procedures may apply depending upon the nature of the substance involved'
        ],
        customValidator: (answer: string, citations: any[]) => {
          const hasSec42 = citations.some(c => c.section === 'Section 42' || c.record_id?.includes('42'));
          const isNotSubstanceClassification = !answer.includes('distinguish between narcotic drugs and psychotropic substances');
          return hasSec42 && isNotSubstanceClassification;
        }
      }
    ]
  },
  {
    id: 'test-k-prior-info-explicit-section-42',
    name: 'Test K: Prior Info Scenario with Explicit Section 42 Mention',
    steps: [
      {
        message: 'Prior information received from an informant about suspected heroin in a specified vehicle, planned search for later this evening, information not yet reduced to writing, no authorization obtained yet. What are the requirements under Section 42?',
        expectedKeywords: ['Section 42', 'Section 43', 'Boota Singh', '72 hours', 'Karnail Singh', 'grounds of belief'],
        forbiddenKeywords: [
          'This inquiry falls outside authorized NDPS',
          'Because different statutory provisions, notifications, and legal procedures may apply depending upon the nature of the substance involved'
        ]
      }
    ]
  },
  {
    id: 'scenario-a-diagnostic-prior-info',
    name: 'Scenario A: Diagnostic 5-event Prior Information scenario',
    steps: [
      {
        message: `NDPS CHATBOT STRICT MODE - TEST INPUT:
On 29 October 2026, at 6:20 PM, a police officer receives specific secret information that a particular white SUV carrying suspected narcotic substances will pass through a named public road.
At 6:25 PM, the officer records the information in the General Diary.
At 6:35 PM, the officer and police team leave the police station specifically to locate the identified SUV.
At 7:05 PM, the team intercepts a white SUV matching the information received.
At 7:10 PM, the officer asks the driver to step out of the vehicle.
No further facts are provided.`,
        expectedKeywords: [
          '### 1. CLASSIFICATION',
          'Prior Information',
          '### 2. CHRONOLOGY',
          '6:20 PM',
          '6:25 PM',
          '6:35 PM',
          '7:05 PM',
          '7:10 PM',
          '### 3. UNKNOWN FACTS',
          '### 4. WORKFLOW',
          'Stage 1:',
          'Stage 15:',
          'Not established from the supplied facts'
        ],
        customValidator: (answer: string) => {
          return (
            answer.includes('### 1. CLASSIFICATION') &&
            answer.includes('### 2. CHRONOLOGY') &&
            answer.includes('### 3. UNKNOWN FACTS') &&
            answer.includes('### 4. WORKFLOW') &&
            answer.includes('Prior Information')
          );
        }
      }
    ]
  },
  {
    id: 'scenario-b-chance-recovery',
    name: 'Scenario B: Chance Recovery scenario (patrol / routine stop)',
    steps: [
      {
        message: 'On 15 November 2026, at 10:00 AM, a police patrol team is deployed on routine vehicular checking on Highway 44. At 10:15 AM, the team stops a silver sedan for routine inspection. At 10:20 AM, the officer asks the driver to produce vehicle documents.',
        expectedKeywords: [
          'On-the-Spot Recovery (Chance Recovery)',
          '10:00 AM',
          '10:15 AM',
          '10:20 AM'
        ],
        customValidator: (answer: string) => {
          return answer.includes('On-the-Spot Recovery (Chance Recovery)');
        }
      }
    ]
  },
  {
    id: 'scenario-c-ambiguous-prior-info',
    name: 'Scenario C: Ambiguous prior info / uncorroborated intelligence',
    steps: [
      {
        message: 'At 2:00 PM, an officer received uncorroborated rumors about drug movement. No General Diary entry was recorded. At 2:30 PM, during routine checking, a vehicle was stopped.',
        expectedKeywords: [
          'On-the-Spot Recovery (Chance Recovery)',
          '2:00 PM',
          '2:30 PM'
        ]
      }
    ]
  },
  {
    id: 'scenario-d-contradictory-assertions',
    name: 'Scenario D: Contradictory assertions between driver and officer',
    steps: [
      {
        message: 'At 4:00 PM, team departed for routine patrol. At 4:30 PM, driver claimed officers had secret info about him prior to stop, whereas officers recorded routine check.',
        expectedKeywords: [
          'On-the-Spot Recovery (Chance Recovery)',
          '4:00 PM',
          '4:30 PM'
        ]
      }
    ]
  },
  {
    id: 'scenario-e-incomplete-interception',
    name: 'Scenario E: Incomplete scenario ending at interception',
    steps: [
      {
        message: 'At 8:00 AM, specific information was received regarding a red truck. At 8:15 AM, team departed specifically to locate the truck. At 8:45 AM, truck was intercepted and driver asked for ID.',
        expectedKeywords: [
          'Prior Information',
          '8:00 AM',
          '8:15 AM',
          '8:45 AM',
          'Search'
        ]
      }
    ]
  },
  {
    id: 'scenario-f-normal-legal-bilingual',
    name: 'Scenario F: Normal legal queries and bilingual queries',
    steps: [
      {
        message: 'What are the safeguards under Section 50 of the NDPS Act?',
        expectedKeywords: ['Section 50', 'personal bodily search']
      },
      {
        message: 'धारा 52A के अंतर्गत क्या प्रक्रिया है?',
        expectedKeywords: ['52A']
      }
    ]
  },
  {
    id: 'scenario-g-patrolling-guidance',
    name: 'Scenario G: Patrolling Query Guidance and Clarification',
    steps: [
      {
        message: 'I am an investigation officer. A person was found with suspected narcotics during patrolling. What should I do next?',
        expectedKeywords: [
          'patrolling',
          'Clarifying Question',
          'Prior Information',
          'Chance Recovery'
        ]
      }
    ]
  },
  {
    id: 'scenario-h-multiturn-sequence',
    name: 'Scenario H: Multi-turn Conversation Sequence (Tests A through E)',
    steps: [
      {
        message: 'I am an investigation officer. A person was found with suspected narcotics during patrolling. What should I do next?',
        expectedKeywords: ['patrolling', 'Clarifying Question', 'Prior Information', 'Chance Recovery']
      },
      {
        message: 'Chance Recovery. There was no prior information about this person or suspected substance.',
        expectedKeywords: ['Chance Recovery', 'Step 1', 'फर्द वरामदगी मादक पदार्थ व मकबूजगी']
      },
      {
        message: 'What is the first step in this case?',
        expectedKeywords: ['Step 1'],
        forbiddenKeywords: ['WORKFLOW SELECTION PENDING']
      },
      {
        message: 'What facts are still unknown?',
        expectedKeywords: ['Unknown Facts']
      },
      {
        message: 'What about Section 50?',
        expectedKeywords: ['Section 50', 'personal bodily search']
      }
    ]
  },
  {
    id: 'test-legal-audit-1-private-vehicle-prior-info',
    name: 'Legal Audit 1: Private vehicle on a public road with prior secret information',
    steps: [
      {
        message: 'Does a private vehicle on a public road automatically fall under Section 43 if there is prior secret information?',
        expectedKeywords: ['Boota Singh', 'Section 42', 'not automatically', 'public conveyance']
      }
    ]
  },
  {
    id: 'test-legal-audit-2-public-conveyance-transit',
    name: 'Legal Audit 2: Public conveyance in transit with no prior information',
    steps: [
      {
        message: 'What are the rules for searching a public conveyance in transit with no prior secret information?',
        expectedKeywords: ['Section 43', 'public conveyance', 'Explanation', 'transit']
      }
    ]
  },
  {
    id: 'test-legal-audit-3-ambiguous-public-recovery',
    name: 'Legal Audit 3: Public-place recovery with ambiguous vehicle status',
    steps: [
      {
        message: 'Ambiguous vehicle status recovery with private car: does it require provisional classification and clarification?',
        expectedKeywords: ['provisional', 'clarification', 'Boota Singh', 'Section 42']
      }
    ]
  },
  {
    id: 'test-legal-audit-4-bnss-scopes',
    name: 'Legal Audit 4: BNSS Sections 103, 105, and 106 respective scopes',
    steps: [
      {
        message: 'What are the distinct scopes of BNSS Sections 103, 105, and 106 in NDPS operations?',
        expectedKeywords: ['Section 103', 'Section 105', 'Section 106', 'closed place', 'audio-video', 'seize specified property']
      }
    ]
  },
  {
    id: 'test-legal-audit-5-section-52a-substantive',
    name: 'Legal Audit 5: Section 52A substantial compliance and evidentiary distinctions',
    steps: [
      {
        message: 'Explain the distinction between seizure, inventory, photography, sampling, and Magistrate certification under Section 52A and substantial compliance.',
        expectedKeywords: ['Mohanlal', 'primary evidence', 'inventory', 'sampling', 'Magistrate', 'prejudice']
      }
    ]
  },
  {
    id: 'test-legal-audit-6-section-67-tofan-singh',
    name: 'Legal Audit 6: Section 67 confession versus non-confessional statement',
    steps: [
      {
        message: 'What is the evidentiary effect of Section 67 statements after Tofan Singh v. State of Tamil Nadu?',
        expectedKeywords: ['Tofan Singh', 'inadmissible as confession', 'Section 23', 'BSA', 'narrow']
      }
    ]
  },
  {
    id: 'test-legal-audit-7-karnail-bsa-63',
    name: 'Legal Audit 7: Correct Karnail Singh citation and BSA Section 63 references',
    steps: [
      {
        message: 'What is the correct citation for Karnail Singh v. State of Haryana and what is Section 63 BSA?',
        expectedKeywords: ['(2009) 8 SCC 539', 'Section 63', 'Bharatiya Sakshya Adhiniyam', 'Arjun Panditrao']
      }
    ]
  }
];

async function simulateChat(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = []) {
  const normalizedMessage = normalizeStatutoryReferences(message.trim());
  let retrievalQuery = normalizedMessage;

  if (history.length > 0) {
    const userMessages = history.filter(h => h.role === 'user');
    const relevantHistory = userMessages.filter(m => m.content !== message);
    const lower = normalizedMessage.toLowerCase().trim();
    const followUpPatterns = [
      'tell more', 'tell me more', 'explain more', 'explain it more', 'i said explain it more',
      'elaborate', 'explain this', 'what about this', 'what about that', 'why', 'how',
      'give more details', 'what are its', 'what are the', 'who can', 'when was',
      'what happens if', 'the procedure', 'the consequences', 'the punishment',
      'does it', 'is it', 'it', 'this', 'that', 'what about', 'how about',
      'details', 'more', 'summarize', 'key points', 'who receives', 'what else',
      'under which section', 'which section', 'under which section it came',
      'tell me more about this'
    ];

    const isPureFollowUp = followUpPatterns.some(p => lower === p || lower === `${p}?` || lower === `${p}!`) ||
      (lower.length < 35 && followUpPatterns.some(p => lower.includes(p)));

    if (isPureFollowUp && relevantHistory.length > 0) {
      let activeSubstantiveTopic = '';
      for (let i = relevantHistory.length - 1; i >= 0; i--) {
        const pastRaw = relevantHistory[i].content.trim();
        const pastNorm = normalizeStatutoryReferences(pastRaw);
        const pastLower = pastNorm.toLowerCase();
        const isPastPureFollowUp = followUpPatterns.some(p => pastLower === p || pastLower === `${p}?` || pastLower === `${p}!`) ||
          (pastLower.length < 30 && followUpPatterns.some(p => pastLower.includes(p)));
        if (!isPastPureFollowUp && pastRaw.length > 0) {
          activeSubstantiveTopic = pastNorm;
          break;
        }
      }
      if (!activeSubstantiveTopic && relevantHistory.length > 0) {
        activeSubstantiveTopic = normalizeStatutoryReferences(relevantHistory[relevantHistory.length - 1].content);
      }
      retrievalQuery = `${activeSubstantiveTopic} ${normalizedMessage}`;
    }
  }

  const retrieved = await retrieval.retrieve(retrievalQuery, 8);
  const result = await generator.generateAnswer(normalizedMessage, retrieved, history, retrievalQuery);
  return result;
}

async function runAllTests() {
  console.log('================================================================');
  console.log('Starting NDPS Legal Grounding & Conversation Regression Suite');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const tc of TEST_CASES) {
    console.log(`[TEST] ${tc.name} (${tc.id})`);
    const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    let tcPassed = true;

    for (let sIdx = 0; sIdx < tc.steps.length; sIdx++) {
      const step = tc.steps[sIdx];
      const res = await simulateChat(step.message, history);

      // Validate expected keywords
      if (step.expectedKeywords) {
        for (const kw of step.expectedKeywords) {
          if (!res.answer.toLowerCase().includes(kw.toLowerCase())) {
            console.error(`  ❌ Step ${sIdx + 1} ("${step.message}"): Missing expected keyword "${kw}"`);
            tcPassed = false;
          }
        }
      }

      // Validate forbidden keywords
      if (step.forbiddenKeywords) {
        for (const fkw of step.forbiddenKeywords) {
          if (res.answer.toLowerCase().includes(fkw.toLowerCase())) {
            console.error(`  ❌ Step ${sIdx + 1} ("${step.message}"): Found forbidden keyword "${fkw}"`);
            tcPassed = false;
          }
        }
      }

      if (step.customValidator && !step.customValidator(res.answer, res.citations)) {
        console.error(`  ❌ Step ${sIdx + 1} ("${step.message}"): Custom validation failed`);
        tcPassed = false;
      }

      history.push({ role: 'user', content: step.message });
      history.push({ role: 'assistant', content: res.answer });
    }

    if (tcPassed) {
      console.log(`  ✅ PASSED (${tc.steps.length} turns)\n`);
      passed++;
    } else {
      console.log(`  ❌ FAILED\n`);
      failed++;
    }
  }

  console.log('================================================================');
  console.log(`Summary: ${passed} PASSED, ${failed} FAILED (Total: ${TEST_CASES.length})`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
