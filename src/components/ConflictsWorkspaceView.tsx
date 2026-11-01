import React, { useState, useEffect } from 'react';
import { AlertTriangle, FileText, ArrowRight, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { ConflictWorkspaceItem } from '../types';

interface ConflictsWorkspaceViewProps {
  caseId: string;
}

export const ConflictsWorkspaceView: React.FC<ConflictsWorkspaceViewProps> = ({ caseId }) => {
  const [conflicts, setConflicts] = useState<ConflictWorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cases/${caseId}/conflicts-workspace`)
      .then(res => res.json())
      .then(res => {
        if (res.conflicts) {
          setConflicts(res.conflicts);
        }
      })
      .catch(err => console.error('Error loading conflicts workspace:', err))
      .finally(() => setLoading(false));
  }, [caseId]);

  const categories = ['ALL', ...Array.from(new Set(conflicts.map(c => c.category)))];

  const filtered = selectedCategory === 'ALL'
    ? conflicts
    : conflicts.filter(c => c.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-[#8E8E8E]">
        Loading Conflict Intelligence Workspace...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Overview Card */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-300">
              Cross-Document Conflict Workspace
            </h3>
            <p className="text-xs text-[#B4B4B4] mt-0.5">
              Identifies divergent values between spot records and judicial/magisterial certifications.
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-900/40 border border-amber-700/50 text-amber-300 text-xs font-semibold">
          {conflicts.length} Active Divergences
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white'
                : 'bg-[#262626] text-[#8E8E8E] hover:text-[#ECECEC] border border-[#3A3A3A]'
            }`}
          >
            {cat} {cat === 'ALL' ? `(${conflicts.length})` : ''}
          </button>
        ))}
      </div>

      {/* Conflict Cards */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div
            key={item.conflict_id}
            className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] hover:border-amber-700/50 transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-700/50">
                  {item.category}
                </span>
                <h4 className="text-xs font-semibold text-[#ECECEC]">
                  {item.field} ({item.entity})
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-[#1C1C1C] px-2.5 py-1 rounded border border-amber-900/40">
                Diff: {item.difference}
              </span>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Source A */}
              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] space-y-1.5">
                <div className="text-[11px] font-semibold text-[#8E8E8E] flex items-center justify-between">
                  <span>Source Document A</span>
                  <span className="font-mono text-[10px] text-indigo-400">Page {item.page_a}</span>
                </div>
                <div className="text-xs font-bold text-[#ECECEC]">
                  {item.value_a}
                </div>
                <div className="text-[11px] text-[#8E8E8E]">
                  {item.source_a} ({item.document_a})
                </div>
              </div>

              {/* Source B */}
              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-amber-900/30 space-y-1.5">
                <div className="text-[11px] font-semibold text-amber-400 flex items-center justify-between">
                  <span>Source Document B</span>
                  <span className="font-mono text-[10px] text-amber-400">Page {item.page_b}</span>
                </div>
                <div className="text-xs font-bold text-amber-300">
                  {item.value_b}
                </div>
                <div className="text-[11px] text-[#8E8E8E]">
                  {item.source_b} ({item.document_b})
                </div>
              </div>
            </div>

            {/* Resolution Guidance */}
            <div className="p-2.5 rounded-lg bg-[#1A1A1A] border border-[#2D2D2D] text-xs text-[#AAAAAA] flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[#ECECEC] font-medium">Investigative Guidance: </span>
                {item.resolution_note}
              </div>
            </div>

            {/* Provenance References */}
            <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between text-[10px] text-[#666666]">
              <span>Ref IDs: {item.evidence_ids.join(', ')}</span>
              <span className="font-mono">Status: {item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
