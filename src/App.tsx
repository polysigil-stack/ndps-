import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, ChatSession } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatInput } from './components/ChatInput';
import { MessageItem } from './components/MessageItem';
import { LandingHero } from './components/LandingHero';
import { SettingsModal } from './components/SettingsModal';
import { SourceDrawer } from './components/SourceDrawer';
import { ReferenceGuideModal } from './components/ReferenceGuideModal';
import { CaseContextModal } from './components/CaseContextModal';
import { Message, SourceCitation, AppSettings, CaseDetails } from './types';
import { VoiceLanguageMode, detectLanguage } from './utils/speechUtils';
import { AlertCircle, RotateCw } from 'lucide-react';

// Helper to initialize sessions and messages on fresh page load
function initializeFreshSessionState() {
  let savedSessions: ChatSession[] = [];
  let savedMessages: Record<string, Message[]> = {};
  let savedAttached: Record<string, string | null> = {};

  try {
    const rawSessions = localStorage.getItem('ndps_sessions');
    if (rawSessions) savedSessions = JSON.parse(rawSessions);
  } catch (e) {}

  try {
    const rawMessages = localStorage.getItem('ndps_messages');
    if (rawMessages) savedMessages = JSON.parse(rawMessages);
  } catch (e) {}

  try {
    const rawAttached = localStorage.getItem('ndps_attached_cases');
    if (rawAttached) savedAttached = JSON.parse(rawAttached);
  } catch (e) {}

  // Filter out past empty/untouched sessions so history remains clean
  const validSavedSessions = savedSessions.filter(s => {
    const msgs = savedMessages[s.id];
    return msgs && msgs.length > 0;
  });

  // Create a brand-new fresh chat session for this page load/refresh
  const freshId = `session-${Date.now()}`;
  const freshSession: ChatSession = {
    id: freshId,
    title: 'New chat',
    updatedAt: Date.now()
  };

  const initialSessions = [freshSession, ...validSavedSessions];
  savedMessages[freshId] = [];

  return {
    initialSessions,
    initialActiveId: freshId,
    initialMessages: savedMessages,
    initialAttached: savedAttached
  };
}

const {
  initialSessions: BOOTSTRAP_SESSIONS,
  initialActiveId: BOOTSTRAP_ACTIVE_ID,
  initialMessages: BOOTSTRAP_MESSAGES,
  initialAttached: BOOTSTRAP_ATTACHED
} = initializeFreshSessionState();

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>(BOOTSTRAP_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(BOOTSTRAP_ACTIVE_ID);
  const [messagesBySession, setMessagesBySession] = useState<Record<string, Message[]>>(BOOTSTRAP_MESSAGES);

  // Case context management
  const [cases, setCases] = useState<CaseDetails[]>([]);
  const [attachedCaseBySession, setAttachedCaseBySession] = useState<Record<string, string | null>>(BOOTSTRAP_ATTACHED);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);

  const [voiceLanguageMode, setVoiceLanguageMode] = useState<VoiceLanguageMode>(() => {
    try {
      const saved = localStorage.getItem('ndps_setting_voice_language');
      if (saved === 'hi-IN' || saved === 'en-IN' || saved === 'auto') {
        return saved;
      }
    } catch {}
    return 'auto';
  });

  const handleSetVoiceLanguageMode = (mode: VoiceLanguageMode) => {
    setVoiceLanguageMode(mode);
    try {
      localStorage.setItem('ndps_setting_voice_language', mode);
    } catch {}
  };

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSources = localStorage.getItem('ndps_setting_show_sources');
      const savedGuidance = localStorage.getItem('ndps_setting_show_guidance');
      return {
        showSources: savedSources !== null ? JSON.parse(savedSources) : true,
        showProceduralGuidance: savedGuidance !== null ? JSON.parse(savedGuidance) : true,
        voiceLanguageMode: 'auto'
      };
    } catch {
      return {
        showSources: true,
        showProceduralGuidance: true,
        voiceLanguageMode: 'auto'
      };
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'searching' | 'analyzing'>('searching');
  const [lastError, setLastError] = useState<string | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation | null>(null);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load available cases on start
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          if (data.cases && data.cases.length > 0) {
            setCases(data.cases);
          }
        }
      } catch (err) {
        console.warn('Could not fetch cases list:', err);
      }
    };
    fetchCases();
  }, []);

  const activeCaseId = attachedCaseBySession[activeSessionId] || null;
  const activeCaseData = activeCaseId ? (cases.find(c => c.case_id === activeCaseId) || null) : null;

  const handleSelectCase = (caseId: string | null) => {
    setAttachedCaseBySession(prev => {
      const updated = {
        ...prev,
        [activeSessionId]: caseId
      };
      try {
        localStorage.setItem('ndps_attached_cases', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleToggleAttachCase = () => {
    setAttachedCaseBySession(prev => {
      const current = prev[activeSessionId];
      const defaultCaseId = cases.find(c => c.case_id === 'case_batathu_hp72d3928')?.case_id || cases[0]?.case_id || null;
      const updated = {
        ...prev,
        [activeSessionId]: current ? null : defaultCaseId
      };
      try {
        localStorage.setItem('ndps_attached_cases', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleAddDocument = async (doc: { filename: string; docType: string; rawText?: string; pages?: number }) => {
    if (!activeCaseData) return;
    try {
      const res = await fetch(`/api/cases/${activeCaseData.case_id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.case) {
          setCases(prev => prev.map(c => c.case_id === data.case.case_id ? data.case : c));
        }
      }
    } catch (err) {
      console.error('Failed to add document:', err);
    }
  };

  const handleRemoveDocument = async (docId: string) => {
    if (!activeCaseData) return;
    try {
      const res = await fetch(`/api/cases/${activeCaseData.case_id}/documents/${docId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.case) {
          setCases(prev => prev.map(c => c.case_id === data.case.case_id ? data.case : c));
        }
      }
    } catch (err) {
      console.error('Failed to remove document:', err);
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('ndps_setting_show_sources', JSON.stringify(newSettings.showSources));
      localStorage.setItem('ndps_setting_show_guidance', JSON.stringify(newSettings.showProceduralGuidance));
    } catch (e) {}
  };

  // Active messages for the current session
  const currentMessages = messagesBySession[activeSessionId] || [];

  // Persist sessions and messages
  useEffect(() => {
    try {
      const sessionsToSave = sessions.filter(s => {
        const msgs = messagesBySession[s.id];
        return (msgs && msgs.length > 0) || s.id === activeSessionId;
      });
      localStorage.setItem('ndps_sessions', JSON.stringify(sessionsToSave));
      localStorage.setItem('ndps_messages', JSON.stringify(messagesBySession));
      localStorage.setItem('ndps_attached_cases', JSON.stringify(attachedCaseBySession));
    } catch (e) {}
  }, [sessions, messagesBySession, attachedCaseBySession, activeSessionId]);

  // Auto-scroll when messages change or loading state updates
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    // Check if user is near bottom (within 150px)
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (isNearBottom || currentMessages.length <= 2) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages.length, loading]);

  // Loading stage progression timer
  useEffect(() => {
    if (loading) {
      setLoadingStage('searching');
      const timer = setTimeout(() => {
        setLoadingStage('analyzing');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Handle creating a new chat
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New chat',
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setMessagesBySession(prev => ({ ...prev, [newId]: [] }));
    setAttachedCaseBySession(prev => ({
      ...prev,
      [newId]: null
    }));
    setActiveSessionId(newId);
    setLastError(null);
  };

  // Handle selecting a session
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setLastError(null);
  };

  // Handle deleting a session
  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setMessagesBySession(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setAttachedCaseBySession(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  // Clear all sessions
  const handleClearAllHistory = () => {
    const freshId = `session-${Date.now()}`;
    setSessions([{ id: freshId, title: 'New chat', updatedAt: Date.now() }]);
    setMessagesBySession({ [freshId]: [] });
    setActiveSessionId(freshId);
    setLastError(null);
    try {
      localStorage.removeItem('ndps_sessions');
      localStorage.removeItem('ndps_messages');
    } catch (e) {}
  };

  // Handle opening source drawer
  const handleViewSource = (citation: SourceCitation) => {
    setSelectedCitation(citation);
    setIsSourceDrawerOpen(true);
  };

  // Handle sending a message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setLastError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    const updatedMessages = [...currentMessages, userMessage];
    setMessagesBySession(prev => ({
      ...prev,
      [activeSessionId]: updatedMessages
    }));

    // Update title of session if it's the first user message
    if (currentMessages.length === 0) {
      const cleanTitle = query.slice(0, 32) + (query.length > 32 ? '...' : '');
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? { ...s, title: cleanTitle, updatedAt: Date.now() }
            : s
        )
      );
    }

    setInput('');
    setLoading(true);

    const historyPayload = updatedMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          think: isThinkingMode,
          caseId: activeCaseId,
          sessionId: activeSessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.answer || data.reply || 'The answer is not available in the provided NDPS reference material.',
        userQuery: query,
        responseLanguage: data.responseLanguage || (data.answer && detectLanguage(data.answer) === 'hi-IN' ? 'hi' : 'auto'),
        sources: data.sources || [],
        citations: data.citations || [],
        retrievedRecords: data.retrievedRecords || [],
        related_questions: data.related_questions || [],
        pathway_selector: data.pathway_selector,
        selected_pathway: data.selected_pathway,
        debugInfo: data.debugInfo,
        timestamp: Date.now()
      };

      setMessagesBySession(prev => ({
        ...prev,
        [activeSessionId]: [...updatedMessages, assistantMessage]
      }));
    } catch (error: any) {
      console.error('Chat error:', error);
      setLastError(error.message || 'Request failed');
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'An error occurred while connecting to the NDPS reference service. Please try again.',
        timestamp: Date.now()
      };

      setMessagesBySession(prev => ({
        ...prev,
        [activeSessionId]: [...updatedMessages, errorMessage]
      }));
    } finally {
      setLoading(false);
    }
  };

  const isConversationEmpty = currentMessages.length === 0;

  const currentAttachedCaseTitle = activeCaseId && activeCaseData
    ? (
        activeCaseData.fir_details?.fir_number
          ? `FIR ${activeCaseData.fir_details.fir_number}${activeCaseData.vehicle?.registration_number && activeCaseData.vehicle.registration_number !== 'Not Specified' ? ` (${activeCaseData.vehicle.registration_number})` : ''}`
          : activeCaseData.case_title || 'Attached Case'
      )
    : null;

  return (
    <div className="flex h-screen w-full bg-[#212121] text-[#ECECEC] font-sans antialiased overflow-hidden select-none">
      {/* Refined Minimal Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full bg-[#212121] relative overflow-hidden min-w-0">
        {/* Minimal Top Bar */}
        <TopBar
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(!sidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          attachedCaseTitle={currentAttachedCaseTitle}
          onOpenCaseModal={() => setIsCaseModalOpen(true)}
        />

        {/* Conversation Stream or Centered Landing Page */}
        {isConversationEmpty ? (
          /* Centered Balanced Landing Page */
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center my-auto w-full py-8">
            <LandingHero
              onSelectQuery={handleSendMessage}
              attachedCaseTitle={currentAttachedCaseTitle}
              onOpenCaseModal={() => setIsCaseModalOpen(true)}
            >
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={handleSendMessage}
                loading={loading}
                isThinkingMode={isThinkingMode}
                setIsThinkingMode={setIsThinkingMode}
                placeholder="Ask NDPS Intelligence about this FIR or general legal reference..."
                attachedCaseTitle={currentAttachedCaseTitle}
                onDetachCase={handleToggleAttachCase}
                onOpenCaseModal={() => setIsCaseModalOpen(true)}
                onAnalyzeFIR={() => handleSendMessage('Analyze FIR and document procedural steps')}
                voiceLanguageMode={voiceLanguageMode}
                setVoiceLanguageMode={handleSetVoiceLanguageMode}
              />
            </LandingHero>
          </div>
        ) : (
          /* Active Conversation Layout with Independent Scroll Area & Fixed Composer Below */
          <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
            {/* Scrollable Conversation Stream */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 sm:py-6"
            >
              <div className="space-y-1 w-full">
                {currentMessages.map((msg, idx) => {
                  const lastUserMsg = currentMessages
                    .slice(0, idx + 1)
                    .filter(m => m.role === 'user')
                    .slice(-1)[0];
                  const previousUserLanguage = lastUserMsg ? detectLanguage(lastUserMsg.content) : undefined;

                  return (
                    <MessageItem
                      key={msg.id}
                      message={msg}
                      showSources={settings.showSources}
                      showProceduralGuidance={settings.showProceduralGuidance}
                      voiceLanguageMode={voiceLanguageMode}
                      previousUserLanguage={previousUserLanguage}
                      onViewSource={handleViewSource}
                      onSelectQuery={handleSendMessage}
                      onRegenerate={
                        msg.role === 'assistant'
                          ? () => {
                              const lastUser = currentMessages.filter(m => m.role === 'user').slice(-1)[0];
                              if (lastUser) handleSendMessage(lastUser.content);
                            }
                          : undefined
                      }
                    />
                  );
                })}

                {/* Professional Subdued Loading State */}
                {loading && (
                  <div className="py-4 px-4 max-w-[780px] mx-auto w-full">
                    <div className="flex items-center gap-2.5 text-xs text-[#8E8E8E] font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E8E] animate-pulse" />
                      <span>
                        {loadingStage === 'searching'
                          ? (activeCaseId ? 'Reading FIR case document & NDPS reference knowledge...' : 'Searching NDPS knowledge base and statutory provisions...')
                          : 'Synthesizing evidence and procedural safeguards...'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Notice */}
                {lastError && (
                  <div className="py-3 px-4 max-w-[780px] mx-auto w-full">
                    <div className="p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl flex items-center justify-between gap-3 text-xs text-[#ECECEC]">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-[#8E8E8E] shrink-0" />
                        <span>{lastError}</span>
                      </div>
                      <button
                        onClick={() => {
                          const lastUser = currentMessages.filter(m => m.role === 'user').slice(-1)[0];
                          if (lastUser) handleSendMessage(lastUser.content);
                        }}
                        className="flex items-center gap-1 text-[#ECECEC] hover:underline cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-6" />
              </div>
            </div>

            {/* Fixed Composer Bottom Dock with safe spacing */}
            <div className="flex-shrink-0 w-full bg-[#212121] pt-2 pb-4 px-4 border-t border-transparent">
              <div className="max-w-[760px] mx-auto">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={handleSendMessage}
                  loading={loading}
                  isThinkingMode={isThinkingMode}
                  setIsThinkingMode={setIsThinkingMode}
                  placeholder={activeCaseId ? "Ask about FIR No. 24/2024 or NDPS investigation procedure..." : "Ask NDPS Intelligence about investigation, procedure, or legal reference..."}
                  attachedCaseTitle={currentAttachedCaseTitle}
                  onDetachCase={handleToggleAttachCase}
                  onOpenCaseModal={() => setIsCaseModalOpen(true)}
                  onAnalyzeFIR={() => handleSendMessage('Analyze FIR and document procedural steps')}
                  voiceLanguageMode={voiceLanguageMode}
                  setVoiceLanguageMode={handleSetVoiceLanguageMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Context Modal */}
      <CaseContextModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        caseDetails={activeCaseData}
        cases={cases}
        onSelectCase={handleSelectCase}
        isAttached={!!activeCaseId}
        onToggleAttach={handleToggleAttachCase}
        onSelectPrompt={(p) => handleSendMessage(p)}
        onAddDocument={handleAddDocument}
        onRemoveDocument={handleRemoveDocument}
      />

      {/* Slide-out Source Drawer */}
      <SourceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
        citation={selectedCitation}
        onAskFollowUp={handleSendMessage}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearHistory={handleClearAllHistory}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Reference & Guide Modal */}
      <ReferenceGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onSelectTopic={handleSendMessage}
      />
    </div>
  );
}

export default App;
