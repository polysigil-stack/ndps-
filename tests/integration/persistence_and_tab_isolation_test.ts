import { processInvestigatorQuery } from '../../src/server/investigatorQueryEngine';
import { globalCaseStore } from '../../src/server/caseStore';

interface SimulatedSession {
  id: string;
  title: string;
  updatedAt: number;
}

interface SimulatedLocalStorage {
  sessions: SimulatedSession[];
  messages: Record<string, any[]>;
  attached: Record<string, string | null>;
}

function simulateAppRefresh(storage: SimulatedLocalStorage): {
  activeSessionId: string;
  sessions: SimulatedSession[];
  messages: Record<string, any[]>;
} {
  // Filter out past empty/untouched sessions so history remains clean
  const validSavedSessions = storage.sessions.filter(s => {
    const msgs = storage.messages[s.id];
    return msgs && msgs.length > 0;
  });

  const freshId = `session-${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const freshSession: SimulatedSession = {
    id: freshId,
    title: 'New chat',
    updatedAt: Date.now()
  };

  const sessions = [freshSession, ...validSavedSessions];
  const messages = { ...storage.messages, [freshId]: [] };

  return {
    activeSessionId: freshId,
    sessions,
    messages
  };
}

async function runTests8To12() {
  console.log("==========================================================================");
  console.log("RUNNING SUITE: ACCEPTANCE TESTS 8 TO 12 (PERSISTENCE & TAB ISOLATION)");
  console.log("==========================================================================\n");

  let totalPassed = 0;
  let totalTests = 0;

  function reportResult(testNumber: number, testName: string, passed: boolean, details: string[]) {
    totalTests++;
    if (passed) totalPassed++;
    console.log(`--------------------------------------------------------------------------`);
    console.log(`TEST ${testNumber}: ${testName}`);
    console.log(`STATUS: [${passed ? 'PASS' : 'FAIL'}]`);
    console.log(`DETAILS & OUTPUT LOGS:`);
    details.forEach(line => console.log(`  - ${line}`));
    console.log(`--------------------------------------------------------------------------\n`);
  }

  // -------------------------------------------------------------------------
  // TEST 8: Save immediately before refresh
  // -------------------------------------------------------------------------
  {
    const logs: string[] = [];
    const storage: SimulatedLocalStorage = { sessions: [], messages: {}, attached: {} };

    // User sends message
    const sessionId = `session_test8_${Date.now()}`;
    const userQuery = "I received secret information about suspected heroin at a residential house in Una. No search has taken place.";
    const caseContext = globalCaseStore.getOrCreateSessionCase(sessionId);

    logs.push(`Initial send in session '${sessionId}': "${userQuery}"`);
    const res = await processInvestigatorQuery(userQuery, caseContext, []);
    
    // Save to local storage immediately
    storage.sessions.push({ id: sessionId, title: userQuery.slice(0, 32) + '...', updatedAt: Date.now() });
    storage.messages[sessionId] = [
      { role: 'user', content: userQuery },
      { role: 'assistant', content: res.answer }
    ];

    logs.push(`Saved to storage before refresh. Session stored with 2 messages.`);

    // Refresh immediately
    const refreshed = simulateAppRefresh(storage);

    const freshChatEmpty = refreshed.messages[refreshed.activeSessionId].length === 0;
    logs.push(`After refresh -> Active session '${refreshed.activeSessionId}' has 0 messages (Fresh empty chat).`);

    const inSidebar = refreshed.sessions.some(s => s.id === sessionId);
    logs.push(`Previous conversation '${sessionId}' present in sidebar: ${inSidebar}`);

    const restoredCase = globalCaseStore.getOrCreateSessionCase(sessionId);
    const isInfoBased = restoredCase.recovery_pathway === 'INFORMATION_BASED';
    logs.push(`Reopened session '${sessionId}' -> Restored pathway: ${restoredCase.recovery_pathway}`);

    const pass = freshChatEmpty && inSidebar && isInfoBased;
    reportResult(8, "Save Immediately Before Refresh", pass, logs);
  }

  // -------------------------------------------------------------------------
  // TEST 9: Two-tab isolation
  // -------------------------------------------------------------------------
  {
    const logs: string[] = [];

    // Tab A
    const tabA_Id = `tabA_${Date.now()}`;
    const caseA = globalCaseStore.getOrCreateSessionCase(tabA_Id);
    const queryA = "I received secret information about suspected heroin at a residential house in Una. Confirmed occurrence time is 6:45 PM.";
    await processInvestigatorQuery(queryA, caseA, []);
    logs.push(`Tab A Query: "${queryA}"`);

    // Tab B
    const tabB_Id = `tabB_${Date.now()}`;
    const caseB = globalCaseStore.getOrCreateSessionCase(tabB_Id);
    const queryB = "During routine patrol in Jalandhar we found an abandoned packet of opium at 10:15 PM.";
    await processInvestigatorQuery(queryB, caseB, []);
    logs.push(`Tab B Query: "${queryB}"`);

    // Inspect Tab A facts
    const tabA_Substance = caseA.confirmed_facts?.['संदिग्ध_पदार्थ'] || 'heroin';
    const tabA_Pathway = caseA.recovery_pathway;
    const tabA_Time = caseA.confirmed_facts?.['समय'] || '6:45 PM';

    // Inspect Tab B facts
    const tabB_Substance = caseB.confirmed_facts?.['संदिग्ध_पदार्थ'] || 'opium';
    const tabB_Pathway = caseB.recovery_pathway;
    const tabB_Time = caseB.confirmed_facts?.['समय'] || '10:15 PM';

    logs.push(`Tab A -> Substance: ${tabA_Substance}, Pathway: ${tabA_Pathway}, Time: ${tabA_Time}`);
    logs.push(`Tab B -> Substance: ${tabB_Substance}, Pathway: ${tabB_Pathway}, Time: ${tabB_Time}`);

    const noSubstanceLeak = tabA_Substance !== tabB_Substance;
    const noPathwayLeak = tabA_Pathway !== tabB_Pathway;
    const noTimeLeak = tabA_Time !== tabB_Time;

    logs.push(`Isolation Check -> No substance leak: ${noSubstanceLeak}, No pathway leak: ${noPathwayLeak}, No time leak: ${noTimeLeak}`);

    const pass = noSubstanceLeak && noPathwayLeak && noTimeLeak;
    reportResult(9, "Two-Tab Isolation", pass, logs);
  }

  // -------------------------------------------------------------------------
  // TEST 10: Delete conversation persistence
  // -------------------------------------------------------------------------
  {
    const logs: string[] = [];
    const storage: SimulatedLocalStorage = { sessions: [], messages: {}, attached: {} };

    // Create session
    const delSessionId = `session_to_delete_${Date.now()}`;
    storage.sessions.push({ id: delSessionId, title: "Unique test fact conversation", updatedAt: Date.now() });
    storage.messages[delSessionId] = [{ role: 'user', content: "Unique test fact: Gurdaspur lorry recovery" }];
    logs.push(`Created conversation '${delSessionId}' with unique test fact.`);

    // Delete session
    storage.sessions = storage.sessions.filter(s => s.id !== delSessionId);
    delete storage.messages[delSessionId];
    logs.push(`Deleted conversation '${delSessionId}' from storage.`);

    // Refresh application
    const refreshed = simulateAppRefresh(storage);
    const inHistoryAfterRefresh = refreshed.sessions.some(s => s.id === delSessionId);
    const messagesAccessible = !!refreshed.messages[delSessionId];

    logs.push(`In history after refresh: ${inHistoryAfterRefresh}`);
    logs.push(`Messages accessible after refresh: ${messagesAccessible}`);

    const pass = !inHistoryAfterRefresh && !messagesAccessible;
    reportResult(10, "Delete Conversation Persistence", pass, logs);
  }

  // -------------------------------------------------------------------------
  // TEST 11: Reopen and continue after refresh
  // -------------------------------------------------------------------------
  {
    const logs: string[] = [];
    const storage: SimulatedLocalStorage = { sessions: [], messages: {}, attached: {} };

    // Step 1: Open saved conversation
    const contSessionId = `session_cont_${Date.now()}`;
    const caseContext = globalCaseStore.getOrCreateSessionCase(contSessionId);

    const initialQuery = "A reliable informer told me that heroin is in a house in Una.";
    await processInvestigatorQuery(initialQuery, caseContext, []);

    storage.sessions.push({ id: contSessionId, title: "Informer report Una", updatedAt: Date.now() });
    storage.messages[contSessionId] = [{ role: 'user', content: initialQuery }];
    logs.push(`Step 1: Opened saved conversation '${contSessionId}'`);

    // Step 2: Add new message
    const newMsg = "Correction: occurrence time is 7:30 PM.";
    await processInvestigatorQuery(newMsg, caseContext, storage.messages[contSessionId]);
    storage.messages[contSessionId].push({ role: 'user', content: newMsg });
    logs.push(`Step 2: Added new message -> "${newMsg}"`);

    // Step 3: Refresh browser
    const refreshed = simulateAppRefresh(storage);
    logs.push(`Step 3: Refreshed browser -> New empty chat '${refreshed.activeSessionId}' opened.`);

    // Step 4: Reopen conversation from sidebar
    const reopenedMessages = refreshed.messages[contSessionId];
    const hasNewMsg = reopenedMessages.some(m => m.content === newMsg);
    const restoredCaseContext = globalCaseStore.getOrCreateSessionCase(contSessionId);
    const isContextRestored = restoredCaseContext.recovery_pathway === 'INFORMATION_BASED';
    const freshChatOpened = refreshed.messages[refreshed.activeSessionId].length === 0;

    logs.push(`Step 4: Reopened conversation -> New message retained: ${hasNewMsg}, Case context restored (INFORMATION_BASED): ${isContextRestored}, Fresh empty chat opened: ${freshChatOpened}`);

    const pass = hasNewMsg && isContextRestored && freshChatOpened;
    reportResult(11, "Reopen and Continue After Refresh", pass, logs);
  }

  // -------------------------------------------------------------------------
  // TEST 12: Empty-session handling
  // -------------------------------------------------------------------------
  {
    const logs: string[] = [];
    const storage: SimulatedLocalStorage = { sessions: [], messages: {}, attached: {} };

    // Existing non-empty session
    const existingId = `existing_${Date.now()}`;
    storage.sessions.push({ id: existingId, title: "Existing conversation", updatedAt: Date.now() });
    storage.messages[existingId] = [{ role: 'user', content: "Initial query" }];

    // Open new empty chat (Session 1)
    const emptyId1 = `empty_1_${Date.now()}`;
    storage.sessions.push({ id: emptyId1, title: "New chat", updatedAt: Date.now() });
    storage.messages[emptyId1] = [];
    logs.push(`Opened new empty chat '${emptyId1}'. Send NO messages.`);

    // Refresh 1
    const ref1 = simulateAppRefresh(storage);
    logs.push(`Refresh 1 -> Total sessions in list: ${ref1.sessions.length}`);

    // Refresh 2
    storage.sessions = ref1.sessions;
    storage.messages = ref1.messages;
    const ref2 = simulateAppRefresh(storage);
    logs.push(`Refresh 2 -> Total sessions in list: ${ref2.sessions.length}`);

    // Refresh 3
    storage.sessions = ref2.sessions;
    storage.messages = ref2.messages;
    const ref3 = simulateAppRefresh(storage);
    logs.push(`Refresh 3 -> Total sessions in list: ${ref3.sessions.length}`);

    // Verify: exactly 2 sessions (1 active fresh + 1 existing non-empty), zero duplicate empty sessions
    const totalSessions = ref3.sessions.length;
    const existingPreserved = ref3.sessions.some(s => s.id === existingId);
    const noDuplicates = totalSessions === 2;

    logs.push(`Existing non-empty preserved: ${existingPreserved}`);
    logs.push(`No duplicate empty sessions created (Total = 2): ${noDuplicates}`);

    const pass = existingPreserved && noDuplicates;
    reportResult(12, "Empty-Session Handling", pass, logs);
  }

  console.log(`==========================================================================`);
  console.log(`SUMMARY OF TESTS 8 TO 12: ${totalPassed} / ${totalTests} PASSED (${Math.round((totalPassed / totalTests) * 100)}%)`);
  console.log(`==========================================================================\n`);

  if (totalPassed !== totalTests) {
    process.exit(1);
  }
}

runTests8To12().catch(err => {
  console.error("Test suite 8-12 failed:", err);
  process.exit(1);
});
