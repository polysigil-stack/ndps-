import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data/ndps_caselaw.json', 'utf-8'));
data.forEach(r => {
  if (!r.source || !r.source.match(/\(\d{4}\)/)) {
    console.log(`Missing Date: ${r.record_id} - ${r.source}`);
  }
});
