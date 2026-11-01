import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Clock, FileText, Filter, Search } from 'lucide-react';
import { InvestigationChecklistItem } from '../types';

interface InvestigationChecklistViewProps {
  caseId: string;
}

export const InvestigationChecklistView: React.FC<InvestigationChecklistViewProps> = ({ caseId }) => {
  const [checklist, setChecklist] = useState<InvestigationChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cases/${caseId}/investigation-checklist`)
      .then(res => res.json())
      .then(res => {
        if (res.checklist) {
          setChecklist(res.checklist);
        }
      })
      .catch(err => console.error('Error fetching checklist:', err))
      .finally(() => setLoading(false));
  }, [caseId]);

  const filtered = checklist.filter(item => {
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verification_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.documents.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DOCUMENTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-700/50">
            <CheckCircle2 className="w-3 h-3" />
            Documented
          </span>
        );
      case 'CONFLICTING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 text-amber-400 border border-amber-700/50">
            <AlertTriangle className="w-3 h-3" />
            Conflicting
          </span>
        );
      case 'REQUIRES_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-700/50">
            <HelpCircle className="w-3 h-3" />
            Verification Needed
          </span>
        );
      case 'NOT_ESTABLISHED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2A2A2A] text-[#8E8E8E] border border-[#3A3A3A]">
            <Clock className="w-3 h-3" />
            Not Established
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-[#8E8E8E]">
        Loading 13-Area Investigation Checklist...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'DOCUMENTED', 'CONFLICTING', 'REQUIRES_VERIFICATION', 'NOT_ESTABLISHED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#262626] text-[#8E8E8E] hover:text-[#ECECEC] border border-[#3A3A3A]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
          <input
            type="text"
            placeholder="Search checklist..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#222222] border border-[#3A3A3A] rounded-lg text-xs text-[#ECECEC] placeholder-[#666666] focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-2.5">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-[#222222] border border-[#333333] hover:border-[#444444] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-[10px] font-mono font-bold bg-[#1C1C1C] px-2 py-0.5 rounded border border-[#2E2E2E] text-indigo-400 shrink-0 mt-0.5">
                  {item.category}
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-[#ECECEC]">{item.title}</h4>
                  <p className="text-xs text-[#AAAAAA] mt-1">{item.verification_notes}</p>
                </div>
              </div>
              <div className="shrink-0">{getStatusBadge(item.status)}</div>
            </div>

            {/* Documents and Evidence Provenance */}
            <div className="mt-3 pt-2.5 border-t border-[#2D2D2D] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8E8E8E]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[#8E8E8E]">
                  <FileText className="w-3 h-3 text-[#8E8E8E]" />
                  Sources:
                </span>
                {item.documents.length > 0 ? (
                  item.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-[#B4B4B4]"
                    >
                      {doc} (p. {item.pages[idx] || 1})
                    </span>
                  ))
                ) : (
                  <span className="italic text-[#666666]">None documented in loaded record</span>
                )}
              </div>

              {item.evidence_ids.length > 0 && (
                <div className="font-mono text-[10px] text-[#666666]">
                  Ref: {item.evidence_ids.join(', ')}
                </div>
              )}
            </div>

            {/* Conflicts Warning */}
            {item.conflicts && item.conflicts.length > 0 && (
              <div className="mt-2.5 p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px] space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Noted Numeric Discrepancies:
                </div>
                {item.conflicts.map((conf, cIdx) => (
                  <div key={cIdx} className="pl-4">
                    • {conf}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
