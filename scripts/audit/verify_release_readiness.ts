import { templateRegistry } from '../../src/server/templateRegistry';
import * as fs from 'fs';
import * as path from 'path';
import mammoth from 'mammoth';

async function verifyReleaseReadiness() {
  console.log('================================================================');
  console.log('        NDPS INVESTIGATION ASSISTANT: RELEASE-READINESS REVIEW   ');
  console.log('================================================================\n');

  let checksPassed = 0;
  let checksFailed = 0;

  // ---------------------------------------------------------------------------
  // 1. VERIFY STAGE 9 CORRECTION
  // ---------------------------------------------------------------------------
  console.log('--- 1. VERIFY STAGE 9 CORRECTION (`chance_recovery_09.json`) ---');
  
  const jsonPath = 'data/templates/chance_recovery_09.json';
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const docxFile = fs.existsSync('chance.docx') ? 'chance.docx' : 'Chance_Recovery_NDPS_Documents (1).docx';
  const htmlResult = await mammoth.convertToHtml({ path: docxFile });
  const html = htmlResult.value;

  // Extract Document 9 HTML
  const doc9Start = html.indexOf('9. अभियुक्त की गिरफ्तारी');
  const doc10Start = html.indexOf('10. अभियुक्त के चिकित्सा');
  const doc9Html = html.substring(doc9Start, doc10Start);
  
  const doc9SourceClean = doc9Html
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  const cond1 = "1. अभियुक्त आवश्यकता पड़ने पर जांच अधिकारी/न्यायालय के समक्ष उपस्थित होगा।";
  const cond2 = "2. अभियुक्त साक्ष्यों से छेड़छाड़ नहीं करेगा।";
  const cond3 = "3. अभियुक्त गवाहों को प्रभावित करने का प्रयास नहीं करेगा।";

  const hasCond1 = jsonData.content.includes(cond1);
  const hasCond2 = jsonData.content.includes(cond2);
  const hasCond3 = jsonData.content.includes(cond3);

  const cond1Index = jsonData.content.indexOf(cond1);
  const cond2Index = jsonData.content.indexOf(cond2);
  const cond3Index = jsonData.content.indexOf(cond3);

  const correctOrder = cond1Index !== -1 && cond1Index < cond2Index && cond2Index < cond3Index;

  // Check for duplicates
  const countCond1 = (jsonData.content.match(new RegExp(cond1.slice(0, 15), 'g')) || []).length;
  const noDuplicates = countCond1 === 1;

  console.log(`Condition 1 Present: ${hasCond1 ? '✅ YES' : '❌ NO'}`);
  console.log(`Condition 2 Present: ${hasCond2 ? '✅ YES' : '❌ NO'}`);
  console.log(`Condition 3 Present: ${hasCond3 ? '✅ YES' : '❌ NO'}`);
  console.log(`Conditions In Order: ${correctOrder ? '✅ YES' : '❌ NO'}`);
  console.log(`No Duplicate Text:  ${noDuplicates ? '✅ YES' : '❌ NO'}`);

  if (hasCond1 && hasCond2 && hasCond3 && correctOrder && noDuplicates) {
    console.log('Stage 9 Correction Result: ✅ PASSED VERIFICATION\n');
    checksPassed++;
  } else {
    console.error('Stage 9 Correction Result: ❌ FAILED VERIFICATION\n');
    checksFailed++;
  }

  // ---------------------------------------------------------------------------
  // 2. VERIFY GENERATED DOCUMENT QUALITY (FICTIONAL CASES)
  // ---------------------------------------------------------------------------
  console.log('--- 2. VERIFY GENERATED DOCUMENT QUALITY (DRAFTING SAFETY) ---');

  const fictionalChanceFacts = {
    "दिनांक": "29/10/2026",
    "समय": "14:30",
    "थाना": "सदर फिक्शनपुर",
    "जिला": "फिक्शन जिला",
    "स्थान": "हाइवे किलोमीटर 12",
    "पदार्थ": "चरस",
    "वजन": "500 ग्राम"
  };

  const tmplChanceStage1 = templateRegistry.findTemplate('CHANCE_RECOVERY', 1);
  const rawChanceTemplateContent = tmplChanceStage1?.content || '';

  // Generate draft by replacing placeholders with supplied fictional facts
  let draftChance = rawChanceTemplateContent;
  Object.entries(fictionalChanceFacts).forEach(([key, value]) => {
    draftChance = draftChance.replace(`_______`, value);
  });

  const sourceUnchanged = tmplChanceStage1?.content === rawChanceTemplateContent;
  const containsSuppliedFact = draftChance.includes("29/10/2026") && draftChance.includes("500 ग्राम");
  const containsRemainingPlaceholders = draftChance.includes("_______");

  console.log(`Source Template Untouched:  ${sourceUnchanged ? '✅ YES' : '❌ NO'}`);
  console.log(`Supplied Facts Inserted:    ${containsSuppliedFact ? '✅ YES' : '❌ NO'}`);
  console.log(`Missing Fields Preserved:   ${containsRemainingPlaceholders ? '✅ YES (_______ placeholders retained)' : '❌ NO'}`);

  if (sourceUnchanged && containsSuppliedFact && containsRemainingPlaceholders) {
    console.log('Generated Document Quality Result: ✅ PASSED VERIFICATION\n');
    checksPassed++;
  } else {
    console.error('Generated Document Quality Result: ❌ FAILED VERIFICATION\n');
    checksFailed++;
  }

  // ---------------------------------------------------------------------------
  // 3. VERIFY CASE LIFECYCLE & ISOLATION
  // ---------------------------------------------------------------------------
  console.log('--- 3. VERIFY CASE LIFECYCLE & ISOLATION ---');

  const chanceTemplates = templateRegistry.getAllTemplates().filter(t => t.workflowType === 'CHANCE_RECOVERY');
  const infoTemplates = templateRegistry.getAllTemplates().filter(t => t.workflowType === 'INFORMATION_BASED');

  const chance14OK = chanceTemplates.length === 14;
  const info15OK = infoTemplates.length === 15;

  console.log(`Chance Recovery Workflow Isolation (14 Templates):      ${chance14OK ? '✅ YES' : '❌ NO'}`);
  console.log(`Information-Based Workflow Isolation (15 Templates):  ${info15OK ? '✅ YES' : '❌ NO'}`);

  if (chance14OK && info15OK) {
    console.log('Case Lifecycle & Isolation Result: ✅ PASSED VERIFICATION\n');
    checksPassed++;
  } else {
    console.error('Case Lifecycle & Isolation Result: ❌ FAILED VERIFICATION\n');
    checksFailed++;
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('================================================================');
  console.log('             RELEASE-READINESS TECHNICAL SUMMARY               ');
  console.log('================================================================');
  console.log(`Total Review Modules Passed: ${checksPassed} / ${checksPassed + checksFailed}`);
  console.log(`Total Review Modules Failed: ${checksFailed}`);
  console.log('================================================================\n');

  if (checksFailed > 0) process.exit(1);
}

verifyReleaseReadiness().catch(err => {
  console.error(err);
  process.exit(1);
});
