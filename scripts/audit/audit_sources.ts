import fs from 'fs';
import path from 'path';

function inspectJson(filePath: string) {
  if (!fs.existsSync(filePath)) return { exists: false };
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(content);
  return {
    exists: true,
    sizeBytes: content.length,
    count: Array.isArray(parsed) ? parsed.length : typeof parsed === 'object' ? Object.keys(parsed).length : 1,
    sampleKeys: Array.isArray(parsed) ? (parsed[0] ? Object.keys(parsed[0]) : []) : Object.keys(parsed).slice(0, 10)
  };
}

console.log("=== Knowledge Inventory Audit ===");
console.log("ndps_qa_clean.json:", inspectJson('data/ndps_qa_clean.json'));
console.log("ndps_documentation.json:", inspectJson('data/ndps_documentation.json'));
console.log("ndps_caselaw.json:", inspectJson('data/ndps_caselaw.json'));

const docPath = 'data/ndps_documentation.json';
if (fs.existsSync(docPath)) {
  const docs = JSON.parse(fs.readFileSync(docPath, 'utf-8'));
  const categories = new Set(docs.map((d: any) => d.category || d.type || d.section || 'unknown'));
  console.log("ndps_documentation categories/sections:", Array.from(categories));
}

const qaPath = 'data/ndps_qa_clean.json';
if (fs.existsSync(qaPath)) {
  const qas = JSON.parse(fs.readFileSync(qaPath, 'utf-8'));
  console.log("ndps_qa_clean sample items:", qas.slice(0, 3).map((q: any) => q.question || q.id || q.title));
}

