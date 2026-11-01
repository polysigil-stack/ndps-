import React from 'react';
import { ShieldCheck, Database, FlaskConical, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenTestCases: () => void;
  onOpenExplorer: () => void;
  onResetChat: () => void;
  recordCount: number;
  embeddingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTestCases,
  onOpenExplorer,
  onResetChat,
  recordCount,
  embeddingCount,
}) => {
  return (
    <header id="ndps-header" className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-slate-100">NDPS Training Assistant</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {recordCount > 0 ? `${recordCount} Records Active` : 'Indexed'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reference-based NDPS training and procedural knowledge assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            id="header-btn-test-cases"
            onClick={onOpenTestCases}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-xs cursor-pointer"
            title="Open 7 Pre-configured Test Cases"
            aria-label="Open 7 Test Scenarios"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>Test Scenarios (7)</span>
          </button>

          <button
            id="header-btn-dataset"
            onClick={onOpenExplorer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-xs cursor-pointer"
            title="Browse Knowledge Base & Test Retrieval"
            aria-label={`Browse Knowledge Base (${recordCount} records)`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Knowledge Base ({recordCount})</span>
          </button>

          <button
            id="header-btn-reset"
            onClick={onResetChat}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Clear Chat Conversation"
            aria-label="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
