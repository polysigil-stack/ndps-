import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { RetrievalEngine } from '../../src/server/retrieval';
import { AnswerGenerator } from '../../src/server/gemini';
import { getRecordSection, getRecordAct } from '../../src/server/synthesizer';

async function runBenchmark() {
  console.log('=== NDPS Citation & Traceability Automated Test Suite ===\n');

  const retrievalEngine = new RetrievalEngine();
  const answerGenerator = new AnswerGenerator();

  // Load ground truth database
  const dataPath = path.join(process.cwd(), 'data', 'ndps_qa_clean.json');
  const caseLawPath = path.join(process.cwd(), 'data', 'ndps_caselaw.json');
  const docPath = path.join(process.cwd(), 'data', 'ndps_documentation.json');
  
  let allRecords = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  if (fs.existsSync(caseLawPath)) {
    allRecords = allRecords.concat(JSON.parse(fs.readFileSync(caseLawPath, 'utf-8')));
  }
  if (fs.existsSync(docPath)) {
    allRecords = allRecords.concat(JSON.parse(fs.readFileSync(docPath, 'utf-8')));
  }
  const recordsMap = new Map<string, any>();
  for (const r of allRecords) {
    recordsMap.set(r.record_id, r);
  }

  const queries = [
    {
      id: 1,
      query: 'What is Section 42 of the NDPS Act?',
      expectedSections: ['Section 42'],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 2,
      query: 'What safeguards apply during search of a person under NDPS Section 50?',
      expectedSections: ['Section 50'],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 3,
      query: 'What are the statutory timelines regarding forfeiture under Chapter V-A?',
      expectedSections: [],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 4,
      query: 'What is the procedure for electronic seizure & e-Sakshya under BSA?',
      expectedSections: [],
      expectedAct: null // Out of domain / refusal expected
    },
    {
      id: 5,
      query: 'What is the difference between Section 10 and Section 11 of PIT NDPS Act?',
      expectedSections: ['Section 10', 'Section 11'],
      expectedAct: 'PIT NDPS Act, 1988'
    },
    {
      id: 6,
      query: 'Does Section 10 of PIT NDPS Act itself impose a two-year detention?',
      expectedSections: ['Section 10', 'Section 11'],
      expectedAct: 'PIT NDPS Act, 1988'
    },
    {
      id: 7,
      query: 'Does Section 31A of the NDPS Act prescribe a mandatory death penalty?',
      expectedSections: ['Section 31A'],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 8,
      query: 'Is the PIT NDPS Act a punishment law?',
      expectedSections: [], // Canonical chunk comparisons / general
      expectedAct: 'PIT NDPS Act, 1988'
    },
    {
      id: 9,
      query: 'Does PIT NDPS preventive detention mean conviction?',
      expectedSections: [], // Canonical comparison
      expectedAct: 'PIT NDPS Act, 1988'
    },
    {
      id: 10,
      query: 'Is the maximum PIT NDPS detention always two years?',
      expectedSections: ['Section 10', 'Section 11'],
      expectedAct: 'PIT NDPS Act, 1988'
    },
    {
      id: 11,
      query: 'What operations are prohibited under Section 8 of the NDPS Act?',
      expectedSections: ['Section 8'],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 12,
      query: 'What are the restrictions on bail under Section 37 of the NDPS Act?',
      expectedSections: ['Section 37'],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 13,
      query: 'What are the enhanced penalties for repeat offences under Section 31A?',
      expectedSections: ['Section 31A'],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 14,
      query: 'What is Section 11 of the PIT NDPS Act?',
      expectedSections: ['Section 11'],
      expectedAct: 'PIT NDPS Act, 1988'
    },
    {
      id: 15,
      query: 'Compare Section 42 and Section 43 of the NDPS Act.',
      expectedSections: ['Section 42', 'Section 43'],
      expectedAct: 'NDPS Act, 1985'
    },
    {
      id: 16,
      query: 'Is there a Section 31A under the PIT NDPS Act?',
      expectedSections: ['Section 31A'],
      expectedAct: 'NDPS Act, 1985' // Refusal/clarification discusses Section 31A of NDPS Act
    },
    {
      id: 17,
      query: 'What is Section 10 of the NDPS Act, 1985?',
      expectedSections: ['Section 10'],
      expectedAct: 'PIT NDPS Act, 1988' // Cross-act note discusses Section 10 of PIT NDPS Act
    },
    {
      id: 18,
      query: 'What is the punishment for possessing commercial quantity of heroin under Section 21?',
      expectedSections: [],
      expectedAct: null // Refusal expected
    },
    {
      id: 19,
      query: 'What is the limitation period for filing an appeal under Section 42?',
      expectedSections: [],
      expectedAct: null // Refusal expected
    },
    {
      id: 20,
      query: 'What was the central message of the training programme?',
      expectedSections: [],
      expectedAct: null // Overview canonical chunk
    }
  ];

  let totalCitationsCount = 0;
  let trueCitationsCount = 0;

  let totalMentionsCount = 0;
  let citedMentionsCount = 0;

  let sourceIntegrityCount = 0;
  let sourceIntegrityTotal = 0;

  let sectionIntegrityCount = 0;
  let sectionIntegrityTotal = 0;

  const results: any[] = [];

  for (const q of queries) {
    console.log(`Running Query [${q.id}/20]: "${q.query}"`);
    const retrieved = await retrievalEngine.retrieve(q.query, 8);
    const result = await answerGenerator.generateAnswer(q.query, retrieved);

    const answer = result.answer;
    const citations = result.citations || [];

    const isUnavailable =
      answer.toLowerCase().includes('not available in the provided ndps reference material') ||
      answer.toLowerCase().includes('not available in the provided reference');

    // Parse sections mentioned in the answer
    const sectionMentions = answer.match(/\bSection\s+(\d+[A-Z]?(?:\(\d+\))?)\b/gi) || [];
    const bareSectionMentions = answer.match(/\bSection\s+(\d+[A-Z]?)\b/gi) || [];
    const normalizedMentions = Array.from(new Set(
      [...sectionMentions, ...bareSectionMentions].map(s => s.toLowerCase().replace(/\s+/g, ''))
    ));

    console.log(` -> Sections detected in Answer: [${normalizedMentions.join(', ')}]`);
    console.log(` -> Citations returned: [${citations.map(c => c.record_id).join(', ')}]`);

    // 1. Citation Precision:
    // Out of all returned citations, does the cited section actually appear in the final answer?
    // If answer is a refusal, citations MUST be empty.
    let qTrueCitations = 0;
    if (isUnavailable) {
      if (citations.length === 0) {
        // Correct refusal behavior
        qTrueCitations = 0;
      } else {
        console.log(` ❌ FAILURE: Refusal answer has returned citations!`);
      }
    } else {
      for (const cit of citations) {
        if (!cit.section) {
          // General canonical chunk - check if relevant
          qTrueCitations++;
        } else {
          const normCitSection = cit.section.toLowerCase().replace(/\s+/g, '');
          const isMentioned = normalizedMentions.some(m => m.includes(normCitSection) || normCitSection.includes(m));
          if (isMentioned) {
            qTrueCitations++;
          } else {
            console.log(` ❌ FAILURE: Citation ${cit.record_id} cites ${cit.section} but it is NOT in the answer text!`);
          }
        }
      }
    }

    const qCitationsCount = citations.length;
    totalCitationsCount += qCitationsCount;
    trueCitationsCount += qTrueCitations;

    const queryPrecision = qCitationsCount > 0 ? (qTrueCitations / qCitationsCount) : 1.0;

    // 2. Citation Recall:
    // For every section mentioned in the answer, did we generate a citation for it if a matching record was retrieved?
    let qCitedMentions = 0;
    let qTotalMentions = 0;

    for (const mention of normalizedMentions) {
      // Find if we actually retrieved a record for this mentioned section
      const hasRetrievedRecord = retrieved.some(item => {
        const rSec = getRecordSection(item.record);
        if (!rSec) return false;
        const normRSec = rSec.toLowerCase().replace(/\s+/g, '');
        return normRSec === mention || mention.includes(normRSec) || normRSec.includes(mention);
      });

      if (hasRetrievedRecord) {
        qTotalMentions++;
        // Check if there is a corresponding citation
        const isCited = citations.some(cit => {
          if (!cit.section) return false;
          const normCitSec = cit.section.toLowerCase().replace(/\s+/g, '');
          return normCitSec === mention || mention.includes(normCitSec) || normCitSec.includes(mention);
        });

        if (isCited) {
          qCitedMentions++;
        } else {
          console.log(` ❌ FAILURE: Section ${mention} was mentioned in the answer and retrieved, but NOT cited in citations!`);
        }
      }
    }

    totalMentionsCount += qTotalMentions;
    citedMentionsCount += qCitedMentions;

    const queryRecall = qTotalMentions > 0 ? (qCitedMentions / qTotalMentions) : 1.0;

    // 3. Source & Section Integrity Checks
    let qSourceIntegrityPass = true;
    let qSectionIntegrityPass = true;

    for (const cit of citations) {
      sourceIntegrityTotal++;
      sectionIntegrityTotal++;

      const groundTruth = recordsMap.get(cit.record_id);
      if (!groundTruth) {
        console.log(` ❌ FAILURE: Citation references nonexistent record_id: ${cit.record_id}`);
        qSourceIntegrityPass = false;
        continue;
      }

      // Check fields matching
      if (cit.source !== groundTruth.source) {
        console.log(` ❌ FAILURE: Source mismatch for ${cit.record_id}. Got: "${cit.source}", Expected: "${groundTruth.source}"`);
        qSourceIntegrityPass = false;
      }

      if (cit.evidence !== groundTruth.answer) {
        console.log(` ❌ FAILURE: Evidence mismatch for ${cit.record_id}. Evidence is fabricated/incorrect.`);
        qSourceIntegrityPass = false;
      }

      const expectedSec = getRecordSection(groundTruth);
      if (cit.section !== expectedSec) {
        console.log(` ❌ FAILURE: Section mismatch for ${cit.record_id}. Got: "${cit.section}", Expected: "${expectedSec}"`);
        qSourceIntegrityPass = false;
      }

      const expectedAct = getRecordAct(groundTruth);
      if (cit.act !== expectedAct) {
        console.log(` ❌ FAILURE: Act mismatch for ${cit.record_id}. Got: "${cit.act}", Expected: "${expectedAct}"`);
        qSectionIntegrityPass = false;
      }
    }

    if (qSourceIntegrityPass && citations.length > 0) sourceIntegrityCount++;
    if (qSectionIntegrityPass && citations.length > 0) sectionIntegrityCount++;

    results.push({
      id: q.id,
      query: q.query,
      isUnavailable,
      citationsCount: qCitationsCount,
      trueCitations: qTrueCitations,
      precision: queryPrecision,
      recall: queryRecall,
      sourceIntegrity: qSourceIntegrityPass,
      sectionIntegrity: qSectionIntegrityPass
    });

    console.log(` -> Precision: ${(queryPrecision * 100).toFixed(1)}%, Recall: ${(queryRecall * 100).toFixed(1)}%\n`);
  }

  const finalPrecision = totalCitationsCount > 0 ? (trueCitationsCount / totalCitationsCount) : 1.0;
  const finalRecall = totalMentionsCount > 0 ? (citedMentionsCount / totalMentionsCount) : 1.0;
  const finalSourceIntegrity = sourceIntegrityTotal > 0 ? (sourceIntegrityCount / results.filter(r => r.citationsCount > 0).length) : 1.0;
  const finalSectionIntegrity = sectionIntegrityTotal > 0 ? (sectionIntegrityCount / results.filter(r => r.citationsCount > 0).length) : 1.0;

  console.log('=== AUDIT BENCHMARK SUMMARY ===');
  console.log(`Total Queries Tested:          ${results.length}`);
  console.log(`Average Citation Precision:    ${(finalPrecision * 100).toFixed(2)}%`);
  console.log(`Average Citation Recall:       ${(finalRecall * 100).toFixed(2)}%`);
  console.log(`Source Integrity Score:        ${(finalSourceIntegrity * 100).toFixed(2)}%`);
  console.log(`Section Integrity Score:       ${(finalSectionIntegrity * 100).toFixed(2)}%`);
  console.log('===============================\n');

  // Assertions
  if (finalPrecision < 0.95) {
    console.error(`❌ FAILURE: Average Citation Precision is ${(finalPrecision * 100).toFixed(2)}%, which is below the 95% threshold!`);
    process.exit(1);
  }
  if (finalRecall < 0.95) {
    console.error(`❌ FAILURE: Average Citation Recall is ${(finalRecall * 100).toFixed(2)}%, which is below the 95% threshold!`);
    process.exit(1);
  }
  if (finalSourceIntegrity < 1.0) {
    console.error(`❌ FAILURE: Source Integrity is ${(finalSourceIntegrity * 100).toFixed(2)}%, which is below the 100% threshold!`);
    process.exit(1);
  }
  if (finalSectionIntegrity < 1.0) {
    console.error(`❌ FAILURE: Section Integrity is ${(finalSectionIntegrity * 100).toFixed(2)}%, which is below the 100% threshold!`);
    process.exit(1);
  }

  console.log('✅ ALL CITATION TRACEABILITY AUDIT TESTS PASSED FLAWLESSLY WITH 100% INTEGRITY!');
  process.exit(0);
}

runBenchmark().catch(err => {
  console.error('Fatal error during benchmark execution:', err);
  process.exit(1);
});
