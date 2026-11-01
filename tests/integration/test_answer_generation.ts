import http from 'http';

const queries = [
  // Basic
  { id: 1, category: 'Basic', query: 'What is the NDPS Act?' },
  { id: 2, category: 'Basic', query: 'What does the NDPS Act regulate?' },
  { id: 3, category: 'Basic', query: 'What is the difference between NDPS Act and PIT NDPS Act?' },

  // Conviction
  { id: 4, category: 'Conviction', query: 'Under which Act is criminal conviction awarded?' },
  { id: 5, category: 'Conviction', query: 'Does preventive detention constitute criminal conviction?' },
  { id: 6, category: 'Conviction', query: 'Can PIT NDPS detention itself result in an NDPS conviction?' },

  // Section 10
  { id: 7, category: 'Section 10', query: 'What is Section 10 of the PIT NDPS Act?' },
  { id: 8, category: 'Section 10', query: 'Who can make a Section 10 declaration?' },
  { id: 9, category: 'Section 10', query: 'What is the purpose of a Section 10 declaration?' },

  // Section 11
  { id: 10, category: 'Section 11', query: 'What is Section 11 of the PIT NDPS Act?' },
  { id: 11, category: 'Section 11', query: 'What is the maximum detention period under PIT NDPS?' },
  { id: 12, category: 'Section 11', query: 'When can the maximum detention period be two years?' },
  { id: 13, category: 'Section 11', query: 'Is PIT NDPS detention always two years?' },

  // Section 31A
  { id: 14, category: 'Section 31A', query: 'What is Section 31A of the NDPS Act?' },
  { id: 15, category: 'Section 31A', query: 'Is there a death penalty under the NDPS Act?' },
  { id: 16, category: 'Section 31A', query: 'Is the death penalty under Section 31A mandatory?' },
  { id: 17, category: 'Section 31A', query: 'What alternative punishment is available under Section 31A?' },

  // Adversarial
  { id: 18, category: 'Adversarial', query: 'What is Section 10 of the NDPS Act?' },
  { id: 19, category: 'Adversarial', query: 'What is Section 11 of the NDPS Act?' },
  { id: 20, category: 'Adversarial', query: 'What is Section 31A of the PIT NDPS Act?' },
  { id: 21, category: 'Adversarial', query: 'Is PIT NDPS a punishment law?' },
  { id: 22, category: 'Adversarial', query: 'Does a PIT NDPS detention order mean the person has been convicted?' },
  { id: 23, category: 'Adversarial', query: 'Is the maximum PIT NDPS detention always two years?' },
  { id: 24, category: 'Adversarial', query: 'Does Section 10 itself impose a two-year detention?' },
  { id: 25, category: 'Adversarial', query: 'Does Section 31A impose a mandatory death penalty?' },

  // Insufficient-context
  { id: 26, category: 'Insufficient Context', query: 'What is the punishment under Section 20?' },
  { id: 27, category: 'Insufficient Context', query: 'What is Section 42?' },
  { id: 28, category: 'Insufficient Context', query: 'What is Section 50?' },
  { id: 29, category: 'Insufficient Context', query: 'What is the punishment for possession of commercial quantity?' },
  { id: 30, category: 'Insufficient Context', query: 'What is the limitation period under the NDPS Act?' }
];

async function callChat(query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ message: query });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ error: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('Starting Answer-Generation Grounding Validation against /api/chat...\n');
  const results = [];

  for (const tc of queries) {
    const start = Date.now();
    try {
      const res = await callChat(tc.query);
      const elapsed = Date.now() - start;

      const topRec = (res.retrievedRecords || res.records)?.[0];
      const answer = res.answer || res.error || '';

      const testResult = {
        id: tc.id,
        category: tc.category,
        query: tc.query,
        topRecordId: topRec?.record?.record_id || 'NONE',
        topRecordSource: topRec?.record?.source || 'NONE',
        topRecordQuestion: topRec?.record?.question || 'NONE',
        topRecordSnippet: topRec?.record?.answer ? topRec.record.answer.slice(0, 120) + '...' : 'NONE',
        answer: answer,
        latencyMs: elapsed
      };

      results.push(testResult);
      console.log(`[${tc.id}/30] ${tc.category} - "${tc.query}"`);
      console.log(`Top Record: ${testResult.topRecordId} (${testResult.topRecordSource})`);
      console.log(`Answer Preview: ${answer.replace(/\n/g, ' ').slice(0, 160)}...`);
      console.log('-'.repeat(80));

      // Small delay between calls to be gentle with rate limits
      await new Promise(r => setTimeout(r, 600));
    } catch (e: any) {
      console.error(`Error on query ${tc.id}:`, e.message);
    }
  }

  // Save all results to a JSON file for complete reporting
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(path.join(process.cwd(), 'answer_validation_results.json'), JSON.stringify(results, null, 2));
  console.log('\nAll 30 validation tests completed. Saved to answer_validation_results.json.');
}

runTests();
