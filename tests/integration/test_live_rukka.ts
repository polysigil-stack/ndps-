import { AnswerGenerator } from '../../src/server/gemini';
import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';
import { resolveTemplateFromQueryOrHistory, findDirectTemplateMatch } from '../../src/server/templates/chanceRecoveryTemplates';
import { normalizeStatutoryReferences, determineResponseLanguage } from '../../src/server/normalization';
import { retrievalEngine } from '../../src/server/retrieval';

async function testLiveRukka() {
  console.log("=== LIVE TEST FOR 'rukka ka format dikhao' ===");

  const rawQuery = "rukka ka format dikhao";
  console.log("1. Raw UI query:", rawQuery);

  const normalizedQuery = normalizeStatutoryReferences(rawQuery);
  console.log("2. Normalized query:", normalizedQuery);

  const directMatch = findDirectTemplateMatch(normalizedQuery);
  console.log("3. findDirectTemplateMatch() result:", directMatch ? `${directMatch.id} (${directMatch.name})` : "NONE");

  const resolution = resolveTemplateFromQueryOrHistory(normalizedQuery, []);
  console.log("4. resolveTemplateFromQueryOrHistory() result:", resolution.status, resolution.template?.name);

  const caseContext = globalCaseStore.getCase('case_batathu_hp72d3928');
  const engineResult = await processInvestigatorQuery(normalizedQuery, caseContext, []);
  console.log("5. processInvestigatorQuery() branch & scope:", engineResult.scope, "Grounding:", engineResult.grounding_status);
  console.log("   Answer starts with:", engineResult.answer.slice(0, 100).replace(/\n/g, ' '));

  const answerGen = new AnswerGenerator();
  const retrieved = await retrievalEngine.retrieve(normalizedQuery, 5);
  const genResult = await answerGen.generateAnswer(rawQuery, retrieved, [], normalizedQuery, caseContext, 'hi');
  console.log("6. AnswerGenerator.generateAnswer result (case attached):");
  console.log("   Answer starts with:", genResult.answer.slice(0, 100).replace(/\n/g, ' '));

  const genResultNoCase = await answerGen.generateAnswer(rawQuery, retrieved, [], normalizedQuery, null, 'hi');
  console.log("7. AnswerGenerator.generateAnswer result (no case):");
  console.log("   Answer starts with:", genResultNoCase.answer.slice(0, 100).replace(/\n/g, ' '));

  const containsRukkaSource = genResult.answer.includes("templateof ndps") &&
                             genResult.answer.includes("रुक्का") &&
                             genResult.answer.includes("Page 6");

  const containsForbiddenOOD = genResult.answer.includes("दी गई NDPS संदर्भ सामग्री में इसका उत्तर उपलब्ध नहीं है") ||
                              genResult.answer.includes("outside authorized NDPS");

  console.log("\nAssertions:");
  console.log("- Contains exact source doc & page 6:", containsRukkaSource);
  console.log("- Forbidden OOD avoided:", !containsForbiddenOOD);

  if (containsRukkaSource && !containsForbiddenOOD) {
    console.log("\n>>> TEST PASSED! <<<");
  } else {
    console.error("\n>>> TEST FAILED! <<<");
    process.exit(1);
  }
}

testLiveRukka().catch(err => {
  console.error(err);
  process.exit(1);
});
