import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync(path.resolve('data/ndps_caselaw.json'), 'utf-8'));
console.log(`Total records: ${data.length}`);
let sc = 0;
let hc = 0;
let missingCitation = 0;
let missingDate = 0;
let missingUrl = 0;
let missingSection = 0;

data.forEach((r: any) => {
  if (r.answer.toLowerCase().includes('supreme court') || r.rag_text.toLowerCase().includes('supreme court')) sc++;
  else if (r.answer.toLowerCase().includes('high court') || r.rag_text.toLowerCase().includes('high court')) hc++;
  
  if (!r.source || !r.source.match(/\(\d{4}\)/)) missingDate++;
  if (!r.section) missingSection++;
  if (!r.source_url) missingUrl++;
  
});
console.log(`Supreme Court: ${sc}`);
console.log(`High Court: ${hc}`);
console.log(`Missing Date: ${missingDate}`);
console.log(`Missing Section: ${missingSection}`);
console.log(`Missing URL: ${missingUrl}`);

