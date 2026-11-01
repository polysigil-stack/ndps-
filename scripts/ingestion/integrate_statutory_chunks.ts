import fs from 'fs';
import path from 'path';
import { STATUTORY_CHUNKS } from './statutory_data';

const dataPath = path.resolve('data/ndps_qa_clean.json');
const existingRecords: any[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

console.log(`Initial total records: ${existingRecords.length}`);

// Check canonical chunks
const canonicalIds = ['rec_chunk_1', 'rec_chunk_2', 'rec_chunk_3', 'rec_chunk_4', 'rec_chunk_5', 'rec_chunk_6'];
for (const cid of canonicalIds) {
  const found = existingRecords.find(r => r.record_id === cid);
  if (!found) {
    throw new Error(`CRITICAL: Canonical record ${cid} is missing!`);
  }
}
console.log('Verified: All 6 canonical records exist and are preserved.');

// Remove any existing stat_ chunks if previously added, so this script is idempotent
const filteredRecords = existingRecords.filter(r => !r.record_id.startsWith('stat_'));

// Prepare new statutory records with sequential question numbers
let nextQNum = 600;
const newRecords = STATUTORY_CHUNKS.map(chunk => ({
  ...chunk,
  question_number: nextQNum++
}));

console.log(`Adding ${newRecords.length} new statutory and regulatory chunks...`);

// Insert new chunks right after the 6 canonical chunks
const canonicalRecords = filteredRecords.filter(r => canonicalIds.includes(r.record_id));
const otherRecords = filteredRecords.filter(r => !canonicalIds.includes(r.record_id));

const updatedRecords = [...canonicalRecords, ...newRecords, ...otherRecords];

fs.writeFileSync(dataPath, JSON.stringify(updatedRecords, null, 2), 'utf-8');
console.log(`Updated data/ndps_qa_clean.json written. New total records: ${updatedRecords.length}`);

// Verify
const verifyData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
console.log(`Verification: Read back ${verifyData.length} records. First 10 IDs:`, verifyData.slice(0, 10).map((r: any) => r.record_id));
