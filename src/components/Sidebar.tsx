import React, { useMemo } from 'react';
import {
  Plus,
  Trash2,
  Settings,
  HelpCircle,
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { Logo } from './Logo';

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHelp?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings,
  onOpenHelp,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Group sessions by Today, Yesterday, and Older
  const { todaySessions, yesterdaySessions, olderSessions } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

    const today: ChatSession[] = [];
    const yesterday: ChatSession[] = [];
    const older: ChatSession[] = [];

    sessions.forEach((s) => {
      if (s.updatedAt >= startOfToday) {
        today.push(s);
      } else if (s.updatedAt >= startOfYesterday) {
        yesterday.push(s);
      } else {
        older.push(s);
      }
    });

    return { todaySessions: today, yesterdaySessions: yesterday, olderSessions: older };
  }, [sessions]);

  const renderSessionItem = (session: ChatSession) => {
    const isActive = session.id === activeSessionId;
    return (
      <div
        key={session.id}
        onClick={() => {
          onSelectSession(session.id);
          if (isOpen && window.innerWidth < 768) {
            onToggle();
          }
        }}
        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] cursor-pointer transition-all duration-150 ${
          isActive
            ? 'bg-[#2A2A2A] text-[#ECECEC] font-medium'
            : 'text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#2A2A2A]'
        }`}
        title={session.title}
      >
        <span className="truncate pr-2 flex-1 select-none leading-snug">
          {session.title || 'New inquiry'}
        </span>

        {/* Delete button appears on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteSession(session.id);
          }}
          className={`p-1 rounded text-[#8E8E8E] hover:text-rose-400 hover:bg-[#2A2A2A] transition-opacity cursor-pointer ${
            isActive ? 'opacity-70 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title="Delete conversation"
          aria-label={`Delete ${session.title}`}
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col h-full bg-[#171717] border-r border-[#3A3A3A] transition-all duration-200 ease-in-out ${
          isCollapsed ? 'md:w-0 md:overflow-hidden md:border-none' : 'w-[260px] min-w-[260px]'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        aria-label="Application sidebar"
      >
        {/* Top Header: Logo + Brand Name */}
        <div className="p-3.5 border-b border-[#3A3A3A] flex items-center justify-between">
          <Logo size="sm" showSubtitle={false} />

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Action: + New Chat */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (isOpen && window.innerWidth < 768) {
                onToggle();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#3A3A3A] text-[#ECECEC] text-[13px] font-medium transition-all duration-150 cursor-pointer shadow-xs group"
          >
            <Plus className="w-4 h-4 text-[#8E8E8E] group-hover:text-[#ECECEC] transition-colors" aria-hidden="true" />
            <span>New chat</span>
          </button>
        </div>

        {/* History Stream */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 text-xs">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-[#8E8E8E]">
              <MessageSquare className="w-5 h-5 mx-auto mb-2 text-[#8E8E8E]" />
              <p className="text-xs">No conversations yet</p>
            </div>
          ) : (
            <>
              {/* Today */}
              {todaySessions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider select-none">
                    Today
                  </div>
                  {todaySessions.map(renderSessionItem)}
                </div>
              )}

              {/* Yesterday */}
              {yesterdaySessions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider select-none">
                    Yesterday
                  </div>
                  {yesterdaySessions.map(renderSessionItem)}
                </div>
              )}

              {/* Previous 7 Days / Older */}
              {olderSessions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider select-none">
                    Previous Inquiries
                  </div>
                  {olderSessions.map(renderSessionItem)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[#3A3A3A] space-y-1 bg-[#171717]">
          {onOpenHelp && (
            <button
              type="button"
              onClick={onOpenHelp}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              aria-label="Open Reference and Guide"
            >
              <HelpCircle className="w-4 h-4 text-[#8E8E8E]" aria-hidden="true" />
              <span>Reference & Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#B4B4B4] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4 text-[#8E8E8E]" aria-hidden="true" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
