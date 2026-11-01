export interface ChatSessionState {
  sessionId: string;
  history: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
  caseId: string | null;
  pathwayResolved: 'UNSET' | 'CHANCE_RECOVERY' | 'INFORMATION_BASED';
  hasIncidentNarrative: boolean;
  incidentSummary: string | null;
  clarificationAsked: boolean;
  lastQuery: string;
}

export function analyzeConversationContext(history: { role: string; content: string }[] = []) {
  let hasIncidentNarrative = false;
  let incidentSummary: string | null = null;
  let pathwayResolved: 'UNSET' | 'CHANCE_RECOVERY' | 'INFORMATION_BASED' = 'UNSET';
  let clarificationAsked = false;

  for (const msg of history) {
    const text = msg.content.toLowerCase();
    if (msg.role === 'user') {
      if (text.includes('patrol') || text.includes('patrolling') || text.includes('suspected narcotics') || text.includes('found with') || text.includes('incident')) {
        hasIncidentNarrative = true;
        incidentSummary = msg.content;
      }
      if (
        text.includes('chance recovery') ||
        text.includes('no prior') ||
        text.includes('without prior') ||
        text.includes('no secret') ||
        text.includes('without secret') ||
        text.includes('unexpected') ||
        text.includes('pathway b') ||
        text.includes('on-the-spot')
      ) {
        pathwayResolved = 'CHANCE_RECOVERY';
      } else if (
        (text.includes('prior information') ||
         text.includes('secret information') ||
         text.includes('intelligence received') ||
         text.includes('specific information') ||
         text.includes('pathway a') ||
         text.includes('information-based')) &&
        !text.includes('no prior') &&
        !text.includes('without prior') &&
        !text.includes('no secret') &&
        !text.includes('no specific') &&
        !text.includes('without specific') &&
        !text.includes('no information was received')
      ) {
        pathwayResolved = 'INFORMATION_BASED';
      }
    } else if (msg.role === 'assistant') {
      const text = msg.content.toLowerCase();
      if (text.includes('clarifying question') || text.includes('prior information') || text.includes('chance recovery') || text.includes('did the patrolling team') || text.includes('origin')) {
        clarificationAsked = true;
      }
    }
  }

  return {
    hasIncidentNarrative,
    incidentSummary,
    pathwayResolved,
    clarificationAsked
  };
}

class ChatManager {
  private sessions: Map<string, ChatSessionState> = new Map();

  public getSession(sessionId: string): ChatSessionState {
    if (!sessionId) {
      sessionId = 'default-session';
    }
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        history: [],
        caseId: null,
        pathwayResolved: 'UNSET',
        hasIncidentNarrative: false,
        incidentSummary: null,
        clarificationAsked: false,
        lastQuery: ''
      };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  public updateSession(sessionId: string, updates: Partial<ChatSessionState>): ChatSessionState {
    const session = this.getSession(sessionId);
    const updated = {
      ...session,
      ...updates,
      sessionId
    };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  public addMessage(sessionId: string, role: 'user' | 'assistant', content: string): ChatSessionState {
    sessionId = sessionId || 'default-session';
    const session = this.getSession(sessionId);
    const newHistory = [...session.history, { role, content, timestamp: Date.now() }];
    
    const context = analyzeConversationContext(newHistory);

    return this.updateSession(sessionId, {
      history: newHistory,
      hasIncidentNarrative: context.hasIncidentNarrative,
      incidentSummary: context.incidentSummary,
      pathwayResolved: context.pathwayResolved,
      clarificationAsked: context.clarificationAsked,
      lastQuery: role === 'user' ? content : session.lastQuery
    });
  }

  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const globalChatManager = new ChatManager();
