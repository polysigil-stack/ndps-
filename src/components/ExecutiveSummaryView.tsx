import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertTriangle, Shield, Clock, HelpCircle, ArrowRight, Layers, FileCheck } from 'lucide-react';
import { ExecutiveSummaryData } from '../types';

interface ExecutiveSummaryViewProps {
  caseId: string;
  onSelectPrompt?: (prompt: string) => void;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({ caseId, onSelectPrompt }) => {
  const [data, setData] = useState<ExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cases/${caseId}/executive-summary`)
      .then(res => res.json())
      .then(res => {
        if (res.summary) {
          setData(res.summary);
        } else {
          setError('Failed to load executive summary.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-[#8E8E8E]">
        Loading Executive Summary & Document Coverage Scorecard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40 text-red-300 text-xs">
        {error || 'Unable to load summary data.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Disclaimer */}
      <div className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider uppercase text-indigo-400 mb-1">
            Investigator Case Intelligence
          </div>
          <h2 className="text-base font-semibold text-[#ECECEC]">
            {data.case_title}
          </h2>
          <p className="text-xs text-[#8E8E8E] mt-0.5">
            FIR No. {data.fir_number} • PS {data.police_station} • District {data.district}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-700/50">
            Commercial Quantity
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#2A2A2A] text-[#B4B4B4] border border-[#3A3A3A]">
            11 Documents Loaded
          </span>
        </div>
      </div>

      {/* Coverage Scorecard */}
      <div>
        <div className="text-xs font-semibold text-[#ECECEC] mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Document Coverage Scorecard
          </span>
          <span className="text-[10px] text-[#8E8E8E]">
            Evidentiary Documentation Indicator
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#222222] border border-[#3A3A3A]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8E8E8E]">Documented</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {data.coverage_scorecard.documented_count}
            </div>
            <div className="text-[11px] text-[#8E8E8E] mt-0.5">Established facts</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#222222] border border-amber-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8E8E8E]">Conflicting</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {data.coverage_scorecard.conflicting_count}
            </div>
            <div className="text-[11px] text-[#8E8E8E] mt-0.5">Numeric divergences</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#222222] border border-blue-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8E8E8E]">Verification Needed</span>
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">
              {data.coverage_scorecard.requires_verification_count}
            </div>
            <div className="text-[11px] text-[#8E8E8E] mt-0.5">Items for follow-up</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#222222] border border-[#3A3A3A]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8E8E8E]">Not Established</span>
              <Clock className="w-3.5 h-3.5 text-[#8E8E8E]" />
            </div>
            <div className="text-2xl font-bold text-[#8E8E8E] mt-1">
              {data.coverage_scorecard.not_established_count}
            </div>
            <div className="text-[11px] text-[#8E8E8E] mt-0.5">Not in current upload</div>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] text-[11px] text-[#8E8E8E] italic flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{data.coverage_scorecard.disclaimer}</span>
        </div>
      </div>

      {/* Core Evidence Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recovery & Contraband */}
        <div className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] space-y-3">
          <h3 className="text-xs font-semibold text-[#ECECEC] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Recovery & Contraband Profile
          </h3>
          <div className="text-xs space-y-2 text-[#CCCCCC]">
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Interception & Recovery:</span>
              <p className="mt-0.5">{data.recovery}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Substance & Quantity:</span>
              <p className="mt-0.5">{data.substance}</p>
              <p className="mt-0.5 text-indigo-300 font-medium">{data.quantity}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Parcel Breakdown:</span>
              <div className="mt-1 space-y-1">
                {data.parcels.map((p, idx) => (
                  <div key={idx} className="font-mono text-[11px] bg-[#1A1A1A] px-2 py-1 rounded border border-[#2E2E2E]">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chain of Custody & Statutory Procedures */}
        <div className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] space-y-3">
          <h3 className="text-xs font-semibold text-[#ECECEC] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
            Statutory Procedures & Custody
          </h3>
          <div className="text-xs space-y-2.5 text-[#CCCCCC]">
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Representative Sampling:</span>
              <p className="mt-0.5">{data.sampling}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Official Sealing Chain:</span>
              <p className="mt-0.5 font-mono text-[11px] text-indigo-300">{data.sealing}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Section 52A Magistrate Inventory:</span>
              <p className="mt-0.5">{data.section_52a}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Section 55 Station Resealing:</span>
              <p className="mt-0.5">{data.section_55}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E] block text-[11px]">Forensic Science Laboratory (FSL):</span>
              <p className="mt-0.5">{data.fsl}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Follow-ups */}
      {onSelectPrompt && (
        <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#333333]">
          <div className="text-xs font-semibold text-[#ECECEC] mb-2">
            Suggested Investigation Prompts
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onSelectPrompt('Give me a full case summary with document citations')}
              className="p-2.5 text-left rounded-lg bg-[#262626] hover:bg-[#2E2E2E] border border-[#3A3A3A] text-xs text-[#ECECEC] flex items-center justify-between group transition-colors"
            >
              <span>Case summary with citations</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8E8E] group-hover:text-[#ECECEC] transition-colors" />
            </button>
            <button
              onClick={() => onSelectPrompt('What are the conflicting numeric values across documents?')}
              className="p-2.5 text-left rounded-lg bg-[#262626] hover:bg-[#2E2E2E] border border-[#3A3A3A] text-xs text-[#ECECEC] flex items-center justify-between group transition-colors"
            >
              <span>Explain numeric weight conflicts</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8E8E] group-hover:text-[#ECECEC] transition-colors" />
            </button>
            <button
              onClick={() => onSelectPrompt('What procedural steps were taken under Section 52A and Section 55?')}
              className="p-2.5 text-left rounded-lg bg-[#262626] hover:bg-[#2E2E2E] border border-[#3A3A3A] text-xs text-[#ECECEC] flex items-center justify-between group transition-colors"
            >
              <span>Review Sec 52A & Sec 55 compliance</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8E8E] group-hover:text-[#ECECEC] transition-colors" />
            </button>
            <button
              onClick={() => onSelectPrompt('Show me the seal tracking across all 11 case documents')}
              className="p-2.5 text-left rounded-lg bg-[#262626] hover:bg-[#2E2E2E] border border-[#3A3A3A] text-xs text-[#ECECEC] flex items-center justify-between group transition-colors"
            >
              <span>Audit seal chain of custody</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8E8E] group-hover:text-[#ECECEC] transition-colors" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
