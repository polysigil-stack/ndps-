import { synthesizeAuthoritativeAnswer } from '../../src/server/synthesizer';
import { RetrievalResult } from '../../src/server/types';

const queries = [
  "Is this punishment written in Section 37?",
  "Does Section 50 itself say that a bag search is invalid?",
  "Does Section 52A itself contain the Supreme Court's evidentiary rule?",
  "Is Article 21 part of Section 37?",
  "Did the NDPS Act create the Supreme Court's interpretation?"
];

for (const q of queries) {
  const dummyRetrieval: RetrievalResult[] = [
    {
      record: { record_id: 'rec_1', question_number: 1, question: 'dummy section 37 section 50 section 52a', answer: 'dummy punishment limitation commercial quantity', source: 'dummy', page: 1, quality_status: 'clean' },
      score: 1.0,
      exactMatch: true
    }
  ];
  const result = synthesizeAuthoritativeAnswer(q, dummyRetrieval);
  console.log(`\nQuery: "${q}"`);
  console.log(`Answer: ${result.answer}`);
}
