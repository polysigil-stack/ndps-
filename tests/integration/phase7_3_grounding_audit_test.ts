import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';

async function runPhase7_3GroundingAuditTests() {
  console.log('================================================================');
  console.log('  NDPS Police Assistant - Phase 7.3 Grounding & Claim Audit Tests');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assertTest(name: string, condition: boolean, details?: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
      if (details) console.error(`       Details: ${details}`);
    }
  }

  // Test Case 1: Register No. 19 Statutory Escalation Audit
  {
    const query = "Is Register No. 19 mandatory under Section 55 of the NDPS Act?";
    const result = await processInvestigatorQuery(query, null);
    
    const containsEscalationCorrection = result.answer.includes("departmental procedure") || result.answer.includes("Register No. 19 is a departmental record");
    const containsPrecedenceClarification = result.answer.includes("rather than a direct statutory mandate");
    
    assertTest(
      "1. Register No. 19 statutory assertion corrected and downgraded from statute to departmental/training authority",
      containsEscalationCorrection && containsPrecedenceClarification,
      `Answer was: ${result.answer}`
    );
  }

  // Test Case 2: Dual Sealing Section 55 Audit
  {
    const query = "Does Section 55 mandate dual sealing?";
    const result = await processInvestigatorQuery(query, null);
    
    const containsEscalationCorrection = result.answer.includes("joint safe custody") || result.answer.includes("joint sealing");
    const containsProcedureClarification = result.answer.includes("recommended departmental procedure") || result.answer.includes("departmental procedure");
    
    assertTest(
      "2. Dual sealing statutory assertion corrected to joint custody and marked as a departmental/procedural guidance claim",
      containsEscalationCorrection && containsProcedureClarification,
      `Answer was: ${result.answer}`
    );
  }

  // Test Case 3: Universal Independent Witnesses Audit
  {
    const query = "Are two independent witnesses universally mandatory under the NDPS Act?";
    const result = await processInvestigatorQuery(query, null);
    
    const containsCorrection = result.answer.includes("essential procedural safeguard") || result.answer.includes("training manuals");
    const containsNotMandatory = result.answer.includes("does not universally invalidate");
    
    assertTest(
      "3. Universal independent witnesses requirement correctly framed as recommended practice rather than strict statutory invalidate mandate",
      containsCorrection && containsNotMandatory,
      `Answer was: ${result.answer}`
    );
  }

  // Test Case 4: Section 50 Bag/Vehicle Audit
  {
    const query = "Does Section 50 apply to the search of a bag or vehicle?";
    const result = await processInvestigatorQuery(query, null);
    
    const containsCorrectPrecedent = result.answer.includes("State of H.P. v. Pawan Kumar") || result.answer.includes("Pawan Kumar");
    const containsInapplicability = result.answer.includes("does not apply") || result.answer.includes("bodily search");
    
    assertTest(
      "4. Section 50 bag/vehicle searches mapped to State of H.P. v. Pawan Kumar and marked inapplicable",
      containsCorrectPrecedent && containsInapplicability,
      `Answer was: ${result.answer}`
    );
  }

  // Test Case 5: Broad Procedural Documentation Workflow Query Structure
  {
    const query = "A suspected narcotic substance was recovered from a person. What documents should the investigating officer prepare from the moment of search and recovery until the sample is deposited with the FSL? Give me the complete step-by-step checklist, required sections/fields in every document, applicable NDPS provisions, and a sample professional format for each document.";
    const result = await processInvestigatorQuery(query, null);
    
    const containsScope = result.answer.includes("### PROCEDURAL SCOPE");
    const containsStatutory = result.answer.includes("### STATUTORY REQUIREMENTS");
    const containsJudicial = result.answer.includes("### JUDICIAL INTERPRETATION");
    const containsGuidance = result.answer.includes("### PROCEDURAL / DEPARTMENTAL GUIDANCE");
    const containsWorkflow = result.answer.includes("### DOCUMENTATION WORKFLOW");
    const containsIllustrative = result.answer.includes("### ILLUSTRATIVE FORMATS");
    const containsNotEstablished = result.answer.includes("### NOT ESTABLISHED BY CURRENT SOURCES");
    const containsGroundingStatus = result.answer.includes("### RESPONSE GROUNDING STATUS");
    
    assertTest(
      "5. Broad documentation query outputs strict 8-section layout with Response Grounding Status metadata",
      containsScope && containsStatutory && containsJudicial && containsGuidance && containsWorkflow && containsIllustrative && containsNotEstablished && containsGroundingStatus,
      `Missing sections. Scope: ${containsScope}, Statutory: ${containsStatutory}, Judicial: ${containsJudicial}, Guidance: ${containsGuidance}, Workflow: ${containsWorkflow}, Illustrative: ${containsIllustrative}, NotEst: ${containsNotEstablished}, Grounding: ${containsGroundingStatus}`
    );
  }

  // Test Case 6: Illustrative Disclaimer Presence
  {
    const query = "Give me professional illustrative formats for NDPS investigation documents.";
    const result = await processInvestigatorQuery(query, null);
    
    const containsDisclaimer = result.answer.includes("ILLUSTRATIVE FORMAT — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM");
    
    assertTest(
      "6. Illustrative formats include explicit legal disclaimer safeguarding them from being interpreted as statutory mandates",
      containsDisclaimer,
      `Answer was: ${result.answer}`
    );
  }

  console.log(`\n================================================================`);
  console.log(`   PHASE 7.3 AUDIT RESULTS: ${passed} / ${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed === total) {
    console.log('🎉 ALL PHASE 7.3 GROUNDING AUDIT TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('❌ SOME PHASE 7.3 TESTS FAILED. PLEASE VERIFY COMPLIANCE.');
    process.exit(1);
  }
}

runPhase7_3GroundingAuditTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
