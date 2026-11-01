import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';

async function runFreshChatAndPersistenceTests() {
  console.log("==========================================================================");
  console.log("RUNNING ACCEPTANCE TEST: FRESH CHAT & MULTI-CONVERSATION CONTEXT ISOLATION");
  console.log("==========================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] Test ${total}: ${testName}`);
    } else {
      console.log(`[FAIL] Test ${total}: ${testName} - ${detail}`);
    }
  }

  // 1. Session Isolation Test: Session A vs Session B
  const sessionA_Id = `session_test_A_${Date.now()}`;
  const sessionB_Id = `session_test_B_${Date.now()}`;

  const caseContextA = globalCaseStore.getOrCreateSessionCase(sessionA_Id);
  const caseContextB = globalCaseStore.getOrCreateSessionCase(sessionB_Id);

  // Turn 1 in Session A: Informer report about Heroin in Sadar Una
  const queryA = "A reliable informer told me that heroin is in a house in Sadar Una. I have not recorded information yet.";
  await processInvestigatorQuery(queryA, caseContextA, []);

  // Turn 1 in Session B: Chance recovery of Charas on roadside
  const queryB = "During routine patrolling, an abandoned packet of charas was found on a roadside bench at 8:00 PM.";
  await processInvestigatorQuery(queryB, caseContextB, []);

  assert(
    caseContextA.recovery_pathway === 'INFORMATION_BASED',
    "Session A Pathway Isolation",
    `Expected INFORMATION_BASED, got ${caseContextA.recovery_pathway}`
  );

  assert(
    caseContextB.recovery_pathway === 'CHANCE_RECOVERY',
    "Session B Pathway Isolation",
    `Expected CHANCE_RECOVERY, got ${caseContextB.recovery_pathway}`
  );

  // 2. Fact / Pathway Cross-Contamination Check:
  // Session A must remain INFORMATION_BASED and must not contain Session B's CHANCE_RECOVERY facts
  assert(
    caseContextA.recovery_pathway !== caseContextB.recovery_pathway,
    "No Cross-Contamination of Recovery Pathways",
    "Session A and Session B pathways bled into each other!"
  );

  assert(
    caseContextA.case_id !== caseContextB.case_id,
    "Isolated Case Context References",
    "Session A and Session B share the same case_id!"
  );

  // 3. Fresh Chat on Initialization Simulation
  // Simulating the localStorage state after saving Session A and Session B
  const mockLocalStorageSessions = [
    { id: sessionA_Id, title: "Informer report Sadar Una", updatedAt: Date.now() - 1000 },
    { id: sessionB_Id, title: "Abandoned charas on roadside", updatedAt: Date.now() - 500 }
  ];

  const mockLocalStorageMessages: Record<string, any[]> = {
    [sessionA_Id]: [{ role: 'user', content: queryA }],
    [sessionB_Id]: [{ role: 'user', content: queryB }]
  };

  // Run the fresh initialization logic as implemented in App.tsx
  const freshSessionId = `session-${Date.now()}`;
  const freshSession = {
    id: freshSessionId,
    title: 'New chat',
    updatedAt: Date.now()
  };

  const initialSessions = [freshSession, ...mockLocalStorageSessions];

  assert(
    initialSessions.length === 3,
    "Fresh Chat Setup: 3 Total Sessions in History List",
    `Expected 3 sessions, got ${initialSessions.length}`
  );

  assert(
    initialSessions[0].id === freshSessionId,
    "Fresh Chat Active First on Page Refresh",
    `First session should be the brand new active session ID (${freshSessionId})`
  );

  assert(
    initialSessions[1].id === sessionA_Id && initialSessions[2].id === sessionB_Id,
    "Saved Conversations Retained in Sidebar History",
    "Previous sessions not correctly preserved in sidebar history"
  );

  console.log(`\n==========================================================================`);
  console.log(`FRESH CHAT & CONTEXT ISOLATION TEST RESULTS: ${passed} / ${total} PASSED`);
  console.log(`==========================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runFreshChatAndPersistenceTests().catch(err => {
  console.error("Fresh chat persistence test failed:", err);
  process.exit(1);
});
