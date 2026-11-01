import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data/ndps_caselaw.json', 'utf-8'));
data.forEach((r: any) => {
  if (r.record_id === 'case_sec60_3') {
    r.source = 'Sunderbhai Ambalal Desai v. State of Gujarat (2002)';
  }
});
fs.writeFileSync('data/ndps_caselaw.json', JSON.stringify(data, null, 2));
