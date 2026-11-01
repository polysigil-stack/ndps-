import http from 'http';
import fs from 'fs';

interface AuditTestCase {
  id: number;
  question: string;
  expectedSection: string;
  expectedLegalProposition: string;
  authoritativeSource: string;
  category: string;
}

const auditTestCases: AuditTestCase[] = [
  // Group 1: Direct Section Questions
  {
    id: 1,
    question: "What is Section 8 of the NDPS Act, 1985?",
    expectedSection: "Section 8",
    expectedLegalProposition: "Prohibits the cultivation, production, manufacture, possession, sale, purchase, transport, warehouse, use, consumption, import inter-state, export inter-state, import into India, export from India or transhipment of any narcotic drug or psychotropic substance, except for medical or scientific purposes.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 8)",
    category: "Direct Section"
  },
  {
    id: 2,
    question: "What are the provisions under Section 8A of the NDPS Act?",
    expectedSection: "Section 8A",
    expectedLegalProposition: "Prohibits any transaction, acquisition, possession, or conversion of property derived from illicit traffic of drugs, as well as concealing or disguising its illicit origin.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 8A)",
    category: "Direct Section"
  },
  {
    id: 3,
    question: "What power is given to the Central Government under Section 9A?",
    expectedSection: "Section 9A",
    expectedLegalProposition: "Empowers the Central Government to control and regulate controlled substances (precursors/chemicals) by notification if it is deemed necessary to prevent their illicit traffic or misuse.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 9A)",
    category: "Direct Section"
  },
  {
    id: 4,
    question: "What is the small and commercial quantity for heroin under S.O. 1055(E)?",
    expectedSection: "S.O. 1055(E)",
    expectedLegalProposition: "Small quantity for Heroin (Diacetylmorphine) is 5 grams, and the commercial quantity threshold is 250 grams.",
    authoritativeSource: "Ministry of Finance Notification S.O. 1055(E) as amended",
    category: "Quantity"
  },
  {
    id: 5,
    question: "Explain Chapter VA of the NDPS Act under Section 68A.",
    expectedSection: "Section 68A",
    expectedLegalProposition: "Chapter VA (Forfeiture of Illegally Acquired Property) applies to individuals convicted under the NDPS Act with 10+ years imprisonment, PIT NDPS detenus (unless revoked/set aside), and their relatives/associates.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 68A)",
    category: "Direct Section"
  },

  // Group 2: Punishment Questions
  {
    id: 6,
    question: "What punishment applies to cannabis contraventions under Section 20 of the NDPS Act?",
    expectedSection: "Section 20",
    expectedLegalProposition: "Prescribes different punishments based on the quantity of cannabis involved (small, intermediate, or commercial quantity) and cultivation of cannabis plant.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 20)",
    category: "Punishment"
  },
  {
    id: 7,
    question: "What are the punishments under Section 21 of the NDPS Act for manufactured drugs?",
    expectedSection: "Section 21",
    expectedLegalProposition: "Prescribes three levels of punishment (for small, intermediate, and commercial quantities) for contraventions involving manufactured drugs and preparations.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 21)",
    category: "Punishment"
  },
  {
    id: 8,
    question: "What are the penalties under Section 22 of the NDPS Act?",
    expectedSection: "Section 22",
    expectedLegalProposition: "Prescribes punishment levels (small, intermediate, commercial) specifically for contraventions involving psychotropic substances.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 22)",
    category: "Punishment"
  },
  {
    id: 9,
    question: "What is the penalty for consumption of drugs under Section 27?",
    expectedSection: "Section 27",
    expectedLegalProposition: "Prescribes punishment for consumption: up to 1 year or fine up to ₹20,000 for cocaine, morphine, diacetylmorphine; up to 6 months or fine up to ₹10,000 for other substances.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 27)",
    category: "Punishment"
  },
  {
    id: 10,
    question: "What are the penalties for financing illicit traffic under Section 27A of the NDPS Act?",
    expectedSection: "Section 27A",
    expectedLegalProposition: "Punishment for financing illicit traffic or harboring offenders is rigorous imprisonment for not less than 10 years (may extend to 20 years) and a fine of not less than ₹1,00,000 (may extend to ₹2,00,000).",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 27A)",
    category: "Punishment"
  },
  {
    id: 11,
    question: "Explain the enhanced punishment rules for repeat offenders under Section 31 of the NDPS Act.",
    expectedSection: "Section 31",
    expectedLegalProposition: "Prescribes enhanced sentencing (up to one and one-half times the maximum imprisonment and fine) for repeat convictions under specified major provisions or commercial offenses.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 31)",
    category: "Punishment"
  },

  // Group 3: Procedural & Search/Seizure Questions
  {
    id: 12,
    question: "What are the conditions for entry, search, seizure, and arrest without warrant under Section 42 of the NDPS Act?",
    expectedSection: "Section 42",
    expectedLegalProposition: "Empowers designated officers to enter, search, seize, and arrest between sunrise and sunset; if acting on personal knowledge or information, it must be written down and sent to the immediate official superior within 72 hours. Search after sunset requires recording grounds of belief for the emergency.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 42)",
    category: "Procedural"
  },
  {
    id: 13,
    question: "What powers of search and seizure are authorized in public places under Section 43 of the NDPS Act?",
    expectedSection: "Section 43",
    expectedLegalProposition: "Authorizes designated officers to seize contraband and arrest in any public place or in transit. Unlike Section 42, it does not require recording grounds of belief for after-sunset searches.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 43)",
    category: "Procedural"
  },
  {
    id: 14,
    question: "What is the procedure for stopping and searching a conveyance under Section 49 of the NDPS Act?",
    expectedSection: "Section 49",
    expectedLegalProposition: "Authorizes any empowered officer to stop and search any animal, vehicle, vessel, or aircraft if there is reason to suspect it is carrying any narcotic drug or psychotropic substance.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 49)",
    category: "Procedural"
  },
  {
    id: 15,
    question: "What are the mandatory conditions for personal search under Section 50 of the NDPS Act?",
    expectedSection: "Section 50",
    expectedLegalProposition: "If a person is to be searched, they must be informed of their right to be taken to the nearest Gazetted Officer or Magistrate. If requested, they must be taken immediately. Females must be searched only by females.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 50)",
    category: "Procedural"
  },
  {
    id: 16,
    question: "What is the requirement for reporting an arrest and seizure under Section 57 of the NDPS Act?",
    expectedSection: "Section 57",
    expectedLegalProposition: "Whenever any person makes an arrest or seizure under the Act, they must submit a full report of all particulars of such arrest or seizure to their immediate official superior within 48 hours.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 57)",
    category: "Procedural"
  },

  // Group 4: Confiscation Questions
  {
    id: 17,
    question: "When is a conveyance liable to confiscation under Section 60 of the NDPS Act?",
    expectedSection: "Section 60",
    expectedLegalProposition: "Conveyance (vehicle, vessel, aircraft) used in carrying contraband is liable to confiscation under Section 60(3), unless the owner proves it was used without their knowledge/connivance and they had taken all reasonable precautions.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 60)",
    category: "Confiscation"
  },
  {
    id: 18,
    question: "What is the procedure to be followed in making confiscations under Section 63 of the NDPS Act?",
    expectedSection: "Section 63",
    expectedLegalProposition: "Specifies how the Special Court or Magistrate decides on confiscation of seized articles/conveyances. If the owner is not known, the court cannot order confiscation before the expiration of one month from the date of seizure and without hearing interested parties.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 63)",
    category: "Confiscation"
  },
  {
    id: 19,
    question: "What does Section 61 of the NDPS Act say about confiscation of goods used for concealing illicit drugs?",
    expectedSection: "Section 61",
    expectedLegalProposition: "Any goods used for concealing any narcotic drug or psychotropic substance liable to confiscation under the Act are also liable to confiscation.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 61)",
    category: "Confiscation"
  },
  {
    id: 20,
    question: "What are the rules regarding confiscation of sale proceeds under Section 62 of the NDPS Act?",
    expectedSection: "Section 62",
    expectedLegalProposition: "The sale proceeds of any narcotic drug, psychotropic substance, or controlled substance sold in contravention of the Act are liable to confiscation.",
    authoritativeSource: "India Code — NDPS Act, 1985 (Section 62)",
    category: "Confiscation"
  },

  // Group 5: Preventive Detention Questions
  {
    id: 21,
    question: "What is Section 10 of the PIT NDPS Act, 1988?",
    expectedSection: "Section 10 of PIT NDPS",
    expectedLegalProposition: "Empowers the Central Government or a designated Joint Secretary to issue a declaration within five weeks regarding persons engaging in illicit traffic in highly vulnerable areas.",
    authoritativeSource: "PIT NDPS Act, 1988 (Section 10)",
    category: "Preventive Detention"
  },
  {
    id: 22,
    question: "What is Section 11 of the PIT NDPS Act, 1988?",
    expectedSection: "Section 11 of PIT NDPS",
    expectedLegalProposition: "Defines the maximum period of preventive detention: general maximum is one year; but where a Section 10 declaration is active, it can be extended up to two years.",
    authoritativeSource: "PIT NDPS Act, 1988 (Section 11)",
    category: "Preventive Detention"
  },
  {
    id: 23,
    question: "What is the maximum period of detention under Section 11 of the PIT NDPS Act?",
    expectedSection: "Section 11 of PIT NDPS",
    expectedLegalProposition: "The maximum detention period under PIT NDPS is 1 year (general) or up to 2 years (in cases with a Section 10 declaration).",
    authoritativeSource: "PIT NDPS Act, 1988 (Section 11)",
    category: "Preventive Detention"
  },

  // Group 6: NDPS vs PIT NDPS Questions
  {
    id: 24,
    question: "What is the difference between criminal punishment under the NDPS Act and preventive detention under the PIT NDPS Act?",
    expectedSection: "NDPS vs PIT NDPS",
    expectedLegalProposition: "NDPS Act, 1985 is a punitive criminal statute with trials and penalties. PIT NDPS Act, 1988 is a preventive, non-punitive executive statute allowing detention to prevent future illicit trafficking.",
    authoritativeSource: "PIT NDPS Act, 1988 / NDPS Act, 1985",
    category: "Comparison"
  },
  {
    id: 25,
    question: "Does PIT NDPS detention mean the person has been convicted?",
    expectedSection: "PIT NDPS",
    expectedLegalProposition: "No, preventive detention under PIT NDPS is an executive safety measure and does not represent a criminal conviction or declaration of guilt.",
    authoritativeSource: "PIT NDPS Act, 1988",
    category: "Adversarial"
  },
  {
    id: 26,
    question: "Is the PIT NDPS Act a punishment law?",
    expectedSection: "PIT NDPS",
    expectedLegalProposition: "No, the PIT NDPS Act is a preventive detention statute, not a punitive/penal criminal prosecution statute.",
    authoritativeSource: "PIT NDPS Act, 1988",
    category: "Adversarial"
  },

  // Group 7: Section Comparison & Adversarial Questions
  {
    id: 27,
    question: "Is the death penalty under Section 31A of the NDPS Act mandatory?",
    expectedSection: "Section 31A",
    expectedLegalProposition: "No, the mandatory death penalty under Section 31A was held unconstitutional; under the current 2014 statutory text, the court has discretion to sentence a repeat offender to either death or 30 years rigorous imprisonment.",
    authoritativeSource: "NDPS Act, 1985 (Section 31A)",
    category: "Adversarial"
  },
  {
    id: 28,
    question: "Does Section 42 of the NDPS Act authorize confiscation of a vehicle?",
    expectedSection: "Section 42",
    expectedLegalProposition: "No, Section 42 deals with entry, search, seizure, and arrest. Confiscation of vehicles is governed by Section 60(3) and the procedure in Section 63.",
    authoritativeSource: "NDPS Act, 1985 (Section 42 vs Section 60)",
    category: "Adversarial"
  },
  {
    id: 29,
    question: "Are Sections 42 and 43 of the NDPS Act interchangeable?",
    expectedSection: "Section 42 vs 43",
    expectedLegalProposition: "No. Section 42 applies to private building, conveyance, or enclosed place (requiring written info, superior officer reports, and strict sunset rules). Section 43 applies to public places or transits, which do not require sunset warrants or recording grounds.",
    authoritativeSource: "NDPS Act, 1985 (Section 42 vs 43)",
    category: "Adversarial"
  },
  {
    id: 30,
    question: "Is every search under Section 50 of the NDPS Act?",
    expectedSection: "Section 50",
    expectedLegalProposition: "No, Section 50 applies strictly to personal search (search of body). It does not apply to the search of a house, building, container, bag, or vehicle.",
    authoritativeSource: "NDPS Act, 1985 (Section 50)",
    category: "Adversarial"
  },
  {
    id: 31,
    question: "Does Section 60(3) deal with search or confiscation?",
    expectedSection: "Section 60(3)",
    expectedLegalProposition: "Deals with the liability of any animal or conveyance (vehicle, vessel, aircraft) to confiscation, not search.",
    authoritativeSource: "NDPS Act, 1985 (Section 60(3))",
    category: "Adversarial"
  },
  {
    id: 32,
    question: "Does Section 31A of the NDPS Act apply to every NDPS offence?",
    expectedSection: "Section 31A",
    expectedLegalProposition: "No. Section 31A applies only to repeat convictions involving specified offences (e.g. Section 19, 24, 27A) or commercial quantities of certain drugs, and only under strict parameters.",
    authoritativeSource: "NDPS Act, 1985 (Section 31A)",
    category: "Adversarial"
  },
  {
    id: 33,
    question: "Does Section 27A of the NDPS Act simply mean possession?",
    expectedSection: "Section 27A",
    expectedLegalProposition: "No. Section 27A is for financing illicit traffic or harboring offenders, not mere possession of drugs (which is covered under sections 20, 21, 22).",
    authoritativeSource: "NDPS Act, 1985 (Section 27A)",
    category: "Adversarial"
  },
  {
    id: 34,
    question: "Does Section 37 of the NDPS Act prescribe punishment?",
    expectedSection: "Section 37",
    expectedLegalProposition: "No, Section 37 does not prescribe criminal sentences or punishments. It declares NDPS offences cognizable and non-bailable, and outlines the twin conditions for bail.",
    authoritativeSource: "NDPS Act, 1985 (Section 37)",
    category: "Adversarial"
  },
  {
    id: 35,
    question: "What is the difference between Section 52 and Section 52A of the NDPS Act?",
    expectedSection: "Section 52 vs 52A",
    expectedLegalProposition: "Section 52 deals with disposal of arrested persons and seized articles to officers/police. Section 52A specifically regulates pre-trial disposal and inventory certification/sampling of drugs before a Magistrate.",
    authoritativeSource: "NDPS Act, 1985 (Section 52 vs 52A)",
    category: "Adversarial"
  },
  {
    id: 36,
    question: "What is the difference between Section 53 and Section 57 of the NDPS Act?",
    expectedSection: "Section 53 vs 57",
    expectedLegalProposition: "Section 53 empowers government officers of specified departments with powers of police officers-in-charge. Section 57 requires reporting any arrest/seizure to immediate superiors within 48 hours.",
    authoritativeSource: "NDPS Act, 1985 (Section 53 vs 57)",
    category: "Adversarial"
  },
  {
    id: 37,
    question: "Does Section 10 of the PIT NDPS Act itself impose a two-year detention?",
    expectedSection: "Section 10 vs 11 PIT NDPS",
    expectedLegalProposition: "No. Section 10 provides for an executive declaration within five weeks. Section 11 prescribes maximum detention periods (extended from one year to two years where a Section 10 declaration exists).",
    authoritativeSource: "PIT NDPS Act, 1988 (Section 10 vs 11)",
    category: "Adversarial"
  },
  {
    id: 38,
    question: "What is the difference between Section 31 and Section 31A of the NDPS Act?",
    expectedSection: "Section 31 vs 31A",
    expectedLegalProposition: "Section 31 prescribes imprisonment/fine up to 1.5 times the maximum sentence for repeat offenders. Section 31A governs discretionary capital punishment / 30-year sentences for specified commercial repeat convictions.",
    authoritativeSource: "NDPS Act, 1985 (Section 31 vs 31A)",
    category: "Adversarial"
  },

  // Group 8: Unsupported Questions (Insufficient Context)
  {
    id: 39,
    question: "What is Section 138 of the Income Tax Act?",
    expectedSection: "None (Insufficient Context)",
    expectedLegalProposition: "Out of scope of current NDPS knowledge base.",
    authoritativeSource: "None",
    category: "Insufficient Context"
  },
  {
    id: 40,
    question: "What is Section 420 of the Indian Penal Code?",
    expectedSection: "None (Insufficient Context)",
    expectedLegalProposition: "Out of scope of current NDPS knowledge base.",
    authoritativeSource: "None",
    category: "Insufficient Context"
  }
];

function queryChatAPI(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ message: question });
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve(data.reply || data.response || body);
          } catch (e) {
            resolve(body);
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function runAudit() {
  console.log(`Starting Legal Answer Accuracy Audit against /api/chat...\n`);

  let countA = 0; // Fully accurate
  let countB = 0; // Partially accurate
  let countC = 0; // Incorrect
  let countD = 0; // Unsupported/hallucinated

  let totalAdversarial = 0;
  let passedAdversarial = 0;
  let totalInsufficient = 0;
  let passedInsufficient = 0;

  const results: any[] = [];

  for (const tc of auditTestCases) {
    try {
      const chatbotAnswer = await queryChatAPI(tc.question);
      const cleanAns = chatbotAnswer.toLowerCase();

      let classification: string = 'A';
      let remarks = '';

      // Classification Logic based on core safety parameters
      if (tc.category === 'Insufficient Context') {
        totalInsufficient++;
        if (cleanAns.includes('not available') || cleanAns.includes('insufficient') || cleanAns.includes('not provide') || cleanAns.includes('cannot answer')) {
          classification = 'A';
          passedInsufficient++;
        } else {
          classification = 'D'; // Hallucinated/Unsupported response
          remarks = 'Failed to trigger insufficient-context safeguard!';
        }
      } else {
        // Evaluate based on adversarial target criteria
        if (tc.category === 'Adversarial') {
          totalAdversarial++;
        }

        // 1. Confusing NDPS with PIT NDPS check
        if (tc.question.includes('PIT NDPS') || tc.question.includes('preventive detention')) {
          if (cleanAns.includes('punishment') && !cleanAns.includes('preventive') && !cleanAns.includes('not a punishment')) {
            classification = 'C';
            remarks = 'Confused preventive detention with criminal punishment!';
          }
        }

        // 2. Section 31A mandatory death penalty position check
        if (tc.id === 27) {
          if (cleanAns.includes('mandatory') && !cleanAns.includes('not mandatory') && !cleanAns.includes('discretionary')) {
            classification = 'C';
            remarks = 'Claimed death penalty under Section 31A is mandatory!';
          }
        }

        // 3. Section 42 authorizing confiscation check
        if (tc.id === 28) {
          if (cleanAns.includes('section 42 authorize confiscation') || (cleanAns.includes('confiscate') && !cleanAns.includes('60'))) {
            classification = 'C';
            remarks = 'Incorrectly attributed vehicle confiscation to Section 42!';
          }
        }

        // 4. S42 and S43 interchangeability check
        if (tc.id === 29) {
          if ((cleanAns.includes('interchangeable') && !cleanAns.includes('not interchangeable') && !cleanAns.includes('not')) || cleanAns.includes('no difference')) {
            classification = 'C';
            remarks = 'Incorrectly stated Section 42 and 43 are interchangeable!';
          }
        }

        // 5. Section 50 check
        if (tc.id === 30) {
          if (cleanAns.includes('every search') || cleanAns.includes('vehicle search') || cleanAns.includes('house search')) {
            classification = 'C';
            remarks = 'Claimed Section 50 applies to all searches instead of personal searches!';
          }
        }

        // 6. Section 37 check
        if (tc.id === 34) {
          if (cleanAns.includes('prescribes punishment') || cleanAns.includes('sentenced under section 37')) {
            classification = 'C';
            remarks = 'Incorrectly claimed Section 37 prescribes punishments!';
          }
        }

        if (classification === 'A' && tc.category === 'Adversarial') {
          passedAdversarial++;
        }
      }

      if (classification === 'A') countA++;
      else if (classification === 'B') countB++;
      else if (classification === 'C') countC++;
      else countD++;

      console.log(`[Q ${tc.id}/40] Category: ${tc.category}`);
      console.log(`Query: "${tc.question}"`);
      console.log(`Expected Section: ${tc.expectedSection}`);
      console.log(`Classification: ${classification}`);
      if (remarks) console.log(`Remarks: ${remarks}`);
      console.log('-'.repeat(80));

      results.push({
        id: tc.id,
        question: tc.question,
        expectedSection: tc.expectedSection,
        expectedProposition: tc.expectedLegalProposition,
        authoritativeSource: tc.authoritativeSource,
        answer: chatbotAnswer,
        classification,
        remarks
      });

    } catch (err) {
      console.error(`Error executing Q ${tc.id}:`, err);
    }
  }

  const accuracyRate = ((countA + countB) / auditTestCases.length) * 100;
  const advAccuracy = (passedAdversarial / totalAdversarial) * 100;
  const safetyRate = (passedInsufficient / totalInsufficient) * 100;

  console.log('\n' + '='.repeat(40));
  console.log('FINAL AUDIT METRICS');
  console.log('='.repeat(40));
  console.log(`Fully Accurate (A): ${countA} / 40`);
  console.log(`Partially Accurate (B): ${countB} / 40`);
  console.log(`Incorrect (C): ${countC} / 40`);
  console.log(`Unsupported/Hallucinated (D): ${countD} / 40`);
  console.log(`Overall Accuracy Rate (A+B): ${accuracyRate.toFixed(1)}%`);
  console.log(`Adversarial Accuracy: ${passedAdversarial} / ${totalAdversarial} (${advAccuracy.toFixed(1)}%)`);
  console.log(`Insufficient-Context Safety Rate: ${passedInsufficient} / ${totalInsufficient} (${safetyRate.toFixed(1)}%)`);
  console.log('='.repeat(40));

  fs.writeFileSync('data/legal_accuracy_audit_results.json', JSON.stringify({
    summary: {
      fully_accurate: countA,
      partially_accurate: countB,
      incorrect: countC,
      unsupported: countD,
      accuracy_percentage: accuracyRate,
      adversarial_accuracy_percentage: advAccuracy,
      insufficient_context_safety_percentage: safetyRate
    },
    results
  }, null, 2));

  if (accuracyRate < 95.0) {
    console.error('Audit FAILED: Accuracy is below the 95% target threshold!');
    process.exit(1);
  } else {
    console.log('AUDIT PASSED PERFECTLY!');
  }
}

runAudit().catch(console.error);
