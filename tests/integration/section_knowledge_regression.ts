import { RetrievalEngine } from '../../src/server/retrieval';
import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';
import { ALL_SECTIONS } from '../../src/server/sections';

async function runSectionKnowledgeRegression() {
  console.log('====================================================');
  console.log('STARTING EXPANDED NDPS SECTION KNOWLEDGE REGRESSION');
  console.log('====================================================\n');

  const engine = new RetrievalEngine();

  interface TestCase {
    name: string;
    query: string;
    history?: { role: string; content: string }[];
    expectedIncludes?: string[];
    expectedExcludes?: string[];
    isRefusal?: boolean;
  }

  const tests: TestCase[] = [
    // 1. SECTION 11 TESTS
    {
      name: 'Section 11 Disambiguation (bare query)',
      query: 'section11',
      expectedIncludes: [
        'NDPS Act, 1985 — Section 11',
        'PIT NDPS Act, 1988 — Section 11',
        'distrained or attached',
        '1 year',
        '2 years'
      ]
    },
    {
      name: 'Section 11 NDPS Act specific',
      query: 'section 11 of ndps act 1985',
      expectedIncludes: [
        'Prohibition of Attachment',
        'distrained or attached'
      ],
      expectedExcludes: ['2 years']
    },
    {
      name: 'Section 11 PIT NDPS Act specific',
      query: 'section 11 of pit ndps act',
      expectedIncludes: [
        'Maximum Period of Detention',
        '1 year',
        '2 years'
      ]
    },

    // 2. FEMALE PERSONAL SEARCH TESTS
    {
      name: 'Female personal search in public place',
      query: 'can female personal search allowed in public',
      expectedIncludes: [
        'No female shall be searched by anyone excepting a female',
        'isolated place',
        'strict regard to decency',
        'Section 50(4)'
      ]
    },
    {
      name: 'Female search follow-up: which section',
      query: 'which section',
      history: [
        { role: 'user', content: 'can female personal search allowed in public' },
        { role: 'assistant', content: 'No female shall be searched by anyone excepting a female...' }
      ],
      expectedIncludes: [
        'Section 50(4)',
        'No female shall be searched by anyone excepting a female'
      ]
    },

    // 3. SECTION COMPARISONS
    {
      name: 'Section 42 vs Section 43 comparison',
      query: 'Section 42 vs Section 43',
      expectedIncludes: [
        'Section 42 vs Section 43',
        'Private Premises vs Public Places',
        'Karnail Singh v. State of Haryana'
      ]
    },
    {
      name: 'Section 42 vs Section 50 comparison',
      query: 'Section 42 vs Section 50',
      expectedIncludes: [
        'Premises/Vehicle Search vs Bodily Personal Search',
        'State of H.P. v. Pawan Kumar'
      ]
    },
    {
      name: 'Section 50 vs Section 49 comparison',
      query: 'Section 50 vs Section 49',
      expectedIncludes: [
        'Search of Suspect Person vs Stopping & Searching Conveyances'
      ]
    },
    {
      name: 'Section 52 vs Section 52A comparison',
      query: 'Section 52 vs Section 52A',
      expectedIncludes: [
        'Post-Arrest Disposal vs Pre-Trial Disposal & Sampling',
        'Union of India v. Mohanlal'
      ]
    },
    {
      name: 'Section 55 vs Section 57 comparison',
      query: 'Section 55 vs Section 57',
      expectedIncludes: [
        'Station House Officer Custody vs Immediate Superior Officer Report'
      ]
    },
    {
      name: 'Section 37 vs Punishment Provisions comparison',
      query: 'Section 37 vs punishment provisions',
      expectedIncludes: [
        'Cognizability & Stringent Bail Framework vs Substantive Penal Sanctions'
      ]
    },

    // 4. PENAL SECTIONS (8, 15, 17, 18, 20, 21, 22, 23, 25, 27, 27A, 29, 31, 31A, 35, 37)
    {
      name: 'Section 8 (Prohibition of certain operations)',
      query: 'section 8',
      expectedIncludes: ['Section 8', 'Prohibition of certain operations', 'Exact Statutory Provision']
    },
    {
      name: 'Section 15 (Poppy straw penalty)',
      query: 'section15',
      expectedIncludes: ['Section 15', 'Punishment for contravention in relation to poppy straw']
    },
    {
      name: 'Section 18 (Opium poppy & opium)',
      query: 'section 18',
      expectedIncludes: ['Section 18', 'Punishment for contravention in relation to opium poppy and opium']
    },
    {
      name: 'Section 20 (Cannabis plant & cannabis)',
      query: 'section20',
      expectedIncludes: ['Section 20', 'Punishment for contravention in relation to cannabis plant and cannabis']
    },
    {
      name: 'Section 21 (Manufactured drugs and preparations)',
      query: 'section 21',
      expectedIncludes: ['Section 21', 'Punishment for contravention in relation to manufactured drugs and preparations']
    },
    {
      name: 'Section 22 (Psychotropic substances)',
      query: 'sec 22',
      expectedIncludes: ['Section 22', 'Punishment for contravention in relation to psychotropic substances']
    },
    {
      name: 'Section 23 (Illegal import/export/transhipment)',
      query: 'section23',
      expectedIncludes: ['Section 23', 'Punishment for illegal import into India, export from India or transhipment']
    },
    {
      name: 'Section 25 (Allowing premises/conveyance to be used)',
      query: 'section 25',
      expectedIncludes: ['Section 25', 'Punishment for allowing premises, etc., to be used for commission of an offence']
    },
    {
      name: 'Section 27 (Consumption penalty)',
      query: 'section 27',
      expectedIncludes: ['Section 27', 'Punishment for consumption of any narcotic drug or psychotropic substance']
    },
    {
      name: 'Section 27A (Financing illicit traffic & harbouring)',
      query: 'section27a',
      expectedIncludes: ['Section 27A', 'Punishment for financing illicit traffic and harbouring offenders']
    },
    {
      name: 'Section 29 (Abetment and criminal conspiracy)',
      query: 'section 29',
      expectedIncludes: ['Section 29', 'Punishment for abetment and criminal conspiracy']
    },
    {
      name: 'Section 31 (Enhanced punishment for previous conviction)',
      query: 'section 31',
      expectedIncludes: ['Section 31', 'Enhanced punishment for offences after previous conviction']
    },
    {
      name: 'Section 31A (Death penalty / 30 years discretionary)',
      query: 'section31a',
      expectedIncludes: ['Section 31A', '30 years rigorous imprisonment', 'Discretionary']
    },
    {
      name: 'Section 35 (Presumption of culpable mental state)',
      query: 'section 35',
      expectedIncludes: ['Section 35', 'Presumption of culpable mental state', 'burden of proof']
    },
    {
      name: 'Section 37 (Offences to be cognizable and non-bailable)',
      query: 'section 37',
      expectedIncludes: ['Section 37', 'Offences to be cognizable and non-bailable', 'twin conditions']
    },

    // 5. PROCEDURE SECTIONS (41, 42, 43, 44, 49, 50, 50A, 51, 52, 52A, 53, 55, 57, 60, 61, 62, 63)
    {
      name: 'Section 41 (Power to issue warrant and authorization)',
      query: 'section 41',
      expectedIncludes: ['Section 41', 'Power to issue warrant and authorisation']
    },
    {
      name: 'Section 42 (Power of entry, search, seizure and arrest)',
      query: 'section42',
      expectedIncludes: ['Section 42', 'Power of entry, search, seizure and arrest without warrant or authorisation', '72 hours']
    },
    {
      name: 'Section 43 (Power of seizure and arrest in public place)',
      query: 'sec 43',
      expectedIncludes: ['Section 43', 'Power of seizure and arrest in public place']
    },
    {
      name: 'Section 44 (Application of Section 41, 42 and 43 to coca, cannabis, poppy)',
      query: 'section 44',
      expectedIncludes: ['Section 44', 'relating to coca plant, opium poppy and cannabis plant']
    },
    {
      name: 'Section 49 (Power to stop and search conveyance)',
      query: 'section49',
      expectedIncludes: ['Section 49', 'Power to stop and search conveyance']
    },
    {
      name: 'Section 50 (Conditions under which search of persons conducted)',
      query: 'section 50',
      expectedIncludes: ['Section 50', 'Conditions under which search of persons shall be conducted', 'Gazetted Officer']
    },
    {
      name: 'Section 50A (Power to undertake controlled delivery)',
      query: 'section 50a',
      expectedIncludes: ['Section 50A', 'Power to undertake controlled delivery', 'Director General']
    },
    {
      name: 'Section 51 (Application of CrPC / BNSS)',
      query: 'sec 51',
      expectedIncludes: ['Section 51', 'Application of the Code of Criminal Procedure, 1973']
    },
    {
      name: 'Section 52 (Disposal of persons arrested and articles seized)',
      query: 'section52',
      expectedIncludes: ['Section 52', 'Disposal of persons arrested and articles seized']
    },
    {
      name: 'Section 52A (Disposal of seized drugs and psychotropic substances)',
      query: 'section 52a',
      expectedIncludes: ['Section 52A', 'Disposal of seized narcotic drugs and psychotropic substances', 'Magistrate', 'Mohanlal']
    },
    {
      name: 'Section 53 (Power to invest officers with powers of an officer-in-charge of police station)',
      query: 'section 53',
      expectedIncludes: ['Section 53', 'Power to invest officers of certain departments with powers of an officer-in-charge']
    },
    {
      name: 'Section 55 (Police to take charge of articles seized and delivered)',
      query: 'sec 55',
      expectedIncludes: ['Section 55', 'Police to take charge of articles seized and delivered', 'malkhana']
    },
    {
      name: 'Section 57 (Report of arrest and seizure within 48 hours)',
      query: 'section57',
      expectedIncludes: ['Section 57', 'Report of arrest and seizure', '48 hours', 'immediate official superior']
    },
    {
      name: 'Section 60 (Liability of illicit drugs, substances, plants, articles and conveyances to confiscation)',
      query: 'section 60',
      expectedIncludes: ['Section 60', 'Liability of illicit drugs, substances, plants, articles and conveyances to confiscation']
    },
    {
      name: 'Section 61 (Confiscation of goods used for concealing illicit drugs)',
      query: 'section 61',
      expectedIncludes: ['Section 61', 'Confiscation of goods used for concealing illicit drugs or substances']
    },
    {
      name: 'Section 62 (Confiscation of sale proceeds of illicit drugs)',
      query: 'section 62',
      expectedIncludes: ['Section 62', 'Confiscation of sale proceeds of illicit drugs or substances']
    },
    {
      name: 'Section 63 (Procedure in making confiscations)',
      query: 'section 63',
      expectedIncludes: ['Section 63', 'Procedure in making confiscations', 'Special Court']
    },

    // 6. FORFEITURE SECTIONS (CHAPTER V-A: 68A to 68Z)
    {
      name: 'Section 68A (Application of Chapter V-A)',
      query: 'section 68a',
      expectedIncludes: ['Section 68A', 'Application', 'Chapter V-A', 'Illegally Acquired Property']
    },
    {
      name: 'Section 68B (Definitions for Chapter V-A)',
      query: 'section68b',
      expectedIncludes: ['Section 68B', 'Definitions', 'identifying', 'tracing']
    },
    {
      name: 'Section 68C (Prohibition of holding illegally acquired property)',
      query: 'section 68c',
      expectedIncludes: ['Section 68C', 'Prohibition of holding illegally acquired property']
    },
    {
      name: 'Section 68E (Identifying illegally acquired property)',
      query: 'section 68e',
      expectedIncludes: ['Section 68E', 'Identifying illegally acquired property']
    },
    {
      name: 'Section 68F (Seizure or freezing of illegally acquired property)',
      query: 'section68f',
      expectedIncludes: ['Section 68F', 'Seizure or freezing of illegally acquired property', 'Competent Authority']
    },
    {
      name: 'Section 68H (Notice of forfeiture of property)',
      query: 'section 68h',
      expectedIncludes: ['Section 68H', 'Notice of forfeiture of property', 'show cause']
    },
    {
      name: 'Section 68-I (Forfeiture of property in certain cases)',
      query: 'section 68i',
      expectedIncludes: ['Section 68I', 'Forfeiture of property in certain cases', 'competent authority']
    },
    {
      name: 'Section 68J (Burden of proof)',
      query: 'section 68j',
      expectedIncludes: ['Section 68J', 'Burden of proof', 'person affected']
    },
    {
      name: 'Section 68Z (Release of property in certain cases)',
      query: 'section 68z',
      expectedIncludes: ['Section 68Z', 'Release of property in certain cases', 'acquittal']
    },

    // 7. OUT OF DOMAIN / REFUSAL
    {
      name: 'Refusal: Traffic fine query',
      query: 'what is the traffic fine for speeding under motor vehicles act',
      isRefusal: true
    },
    {
      name: 'Refusal: Fake case law',
      query: 'what was held in state of maharashtra v. some fake name regarding section 19',
      isRefusal: true
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    const results = await engine.retrieve(t.query, 10);
    const synth = synthesizeAuthoritativeAnswer(t.query, results, t.history || []);

    let ok = true;
    const errors: string[] = [];

    if (t.isRefusal) {
      if (!synth.answer.toLowerCase().includes('not available')) {
        ok = false;
        errors.push(`Expected refusal message, but got: ${synth.answer.substring(0, 100)}...`);
      }
    } else {
      if (synth.answer.toLowerCase().includes('not available')) {
        ok = false;
        errors.push(`Unexpected refusal for legitimate query: ${synth.answer}`);
      }

      if (t.expectedIncludes) {
        for (const exp of t.expectedIncludes) {
          if (!synth.answer.toLowerCase().includes(exp.toLowerCase())) {
            ok = false;
            errors.push(`Missing expected substring: "${exp}"`);
          }
        }
      }

      if (t.expectedExcludes) {
        for (const exc of t.expectedExcludes) {
          if (synth.answer.toLowerCase().includes(exc.toLowerCase())) {
            ok = false;
            errors.push(`Unexpected substring found: "${exc}"`);
          }
        }
      }
    }

    if (ok) {
      console.log(`✅ [PASS] ${t.name}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${t.name}`);
      for (const err of errors) {
        console.log(`   - ${err}`);
      }
      failed++;
    }
  }

  console.log('\n====================================================');
  console.log(`REGRESSION TEST RESULTS: ${passed}/${tests.length} PASSED (${failed} FAILED)`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSectionKnowledgeRegression().catch(err => {
  console.error('Fatal error during regression test:', err);
  process.exit(1);
});
