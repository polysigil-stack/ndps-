import React, { useState, useEffect } from 'react';
import { HelpCircle, FileText, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { VerificationWorkspaceItem } from '../types';

interface VerificationWorkspaceViewProps {
  caseId: string;
}

export const VerificationWorkspaceView: React.FC<VerificationWorkspaceViewProps> = ({ caseId }) => {
  const [items, setItems] = useState<VerificationWorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cases/${caseId}/verification-workspace`)
      .then(res => res.json())
      .then(res => {
        if (res.verification_items) {
          setItems(res.verification_items);
        }
      })
      .catch(err => console.error('Error loading verification workspace:', err))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-[#8E8E8E]">
        Loading Verification Follow-up Items...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-300">
              Investigator Verification & Audit Workspace
            </h3>
            <p className="text-xs text-[#B4B4B4] mt-0.5">
              Unresolved evidentiary points flagged for judicial inquiry, docket cross-verification, or IO examination.
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold">
          {items.length} Action Items
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.issue_id}
            className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] hover:border-blue-700/50 transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold bg-blue-950/60 text-blue-400 px-2 py-0.5 rounded border border-blue-800/50">
                  {item.issue_id}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E8E] bg-[#1C1C1C] px-2 py-0.5 rounded border border-[#2E2E2E]">
                  {item.category}
                </span>
                <h4 className="text-xs font-semibold text-[#ECECEC]">{item.title}</h4>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-700/50">
                Requires Verification
              </span>
            </div>

            {/* Why flagged */}
            <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E]">
              <div className="text-[11px] font-semibold text-[#8E8E8E] mb-1">
                Reason Flagged for Verification:
              </div>
              <p className="text-xs text-[#CCCCCC]">{item.why_flagged}</p>
            </div>

            {/* Supporting documents */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#8E8E8E]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#8E8E8E] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Source Documents:
                </span>
                {item.supporting_documents.map((doc, dIdx) => (
                  <span
                    key={dIdx}
                    className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#333333] text-[11px] text-[#B4B4B4]"
                  >
                    {doc} (p. {item.pages[dIdx] || 1})
                  </span>
                ))}
              </div>

              <div className="font-mono text-[10px] text-[#666666]">
                Ref: {item.evidence_ids.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
