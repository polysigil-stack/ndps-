import React, { useState, useEffect } from 'react';
import { Shield, Package, CheckCircle2, AlertTriangle, ArrowRight, Copy, FileText } from 'lucide-react';
import { SealTrackingItem, SampleTrackingItem, DocumentDuplicateItem } from '../types';

interface SealsAndSamplesViewProps {
  caseId: string;
  onSelectPrompt: (prompt: string) => void;
}

export const SealsAndSamplesView: React.FC<SealsAndSamplesViewProps> = ({
  caseId,
  onSelectPrompt
}) => {
  const [seals, setSeals] = useState<SealTrackingItem[]>([]);
  const [samples, setSamples] = useState<SampleTrackingItem[]>([]);
  const [duplicates, setDuplicates] = useState<DocumentDuplicateItem[]>([]);
  const [subTab, setSubTab] = useState<'seals' | 'samples' | 'duplicates'>('seals');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch(`/api/cases/${caseId}/seals`).then(res => res.json()),
      fetch(`/api/cases/${caseId}/samples`).then(res => res.json()),
      fetch(`/api/cases/${caseId}/duplicates`).then(res => res.json())
    ])
      .then(([sealData, sampleData, dupeData]) => {
        if (sealData.seals) setSeals(sealData.seals);
        if (sampleData.samples) setSamples(sampleData.samples);
        if (dupeData.duplicates) setDuplicates(dupeData.duplicates);
      })
      .catch(err => console.error('Error fetching seals/samples:', err))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  if (isLoading) {
    return <div className="p-12 text-center text-sm text-zinc-400">Loading chain-of-custody data...</div>;
  }

  return (
    <div className="flex flex-col h-full space-y-4 text-left">
      {/* Sub-nav switcher */}
      <div className="flex items-center justify-between border-b border-[#333] pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubTab('seals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === 'seals'
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#2A2A2A]'
            }`}
          >
            Official Seals ({seals.length})
          </button>
          <button
            onClick={() => setSubTab('samples')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === 'samples'
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#2A2A2A]'
            }`}
          >
            Representative Samples ({samples.length})
          </button>
          <button
            onClick={() => setSubTab('duplicates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === 'duplicates'
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#2A2A2A]'
            }`}
          >
            Document Duplicates ({duplicates.length})
          </button>
        </div>

        <span className="text-[11px] text-zinc-500 font-mono">Chain of Custody Tracking</span>
      </div>

      {/* Seals View */}
      {subTab === 'seals' && (
        <div className="space-y-3 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seals.map(seal => (
              <div key={seal.seal_id} className="bg-[#1C1C1C] border border-[#333] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-mono text-zinc-100">{seal.seal_mark}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                    {seal.status}
                  </span>
                </div>

                <div className="text-xs text-zinc-300">
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Authority / Role</span>
                  <span className="font-medium text-indigo-300">{seal.seal_role.replace(/_/g, ' ')}</span>
                </div>

                <p className="text-xs text-zinc-400 bg-[#141414] p-2 rounded border border-[#282828]">
                  {seal.impression_description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-[#282828]">
                  <span className="truncate">{seal.document_name}</span>
                  <span>Page {seal.page}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPrompt('What seals were used across the case documents and are they consistent?')}
            className="w-full flex items-center justify-center gap-2 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg py-2.5 transition-colors font-medium mt-2"
          >
            <span>Ask Assistant: "What seals were used across the case documents and are they consistent?"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Samples View */}
      {subTab === 'samples' && (
        <div className="space-y-3 flex-1 overflow-y-auto">
          <div className="overflow-x-auto rounded-lg border border-[#2F2F2F]">
            <table className="w-full text-xs">
              <thead className="bg-[#222] text-zinc-400 border-b border-[#2F2F2F]">
                <tr>
                  <th className="py-2.5 px-3 text-left font-semibold">Sample ID</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Parent Parcel</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Sample Weight</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Seal Mark</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Destination</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828] bg-[#161616]">
                {samples.map(sample => (
                  <tr key={sample.sample_id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-300">{sample.sample_id}</td>
                    <td className="py-2.5 px-3 font-medium text-zinc-200">Parcel {sample.parcel_id}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-200">
                      {sample.sample_weight} {sample.unit}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">{sample.seal}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{sample.destination}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60">
                        {sample.dispatch_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => onSelectPrompt('How were the representative samples drawn and tracked to the FSL?')}
            className="w-full flex items-center justify-center gap-2 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg py-2.5 transition-colors font-medium mt-2"
          >
            <span>Ask Assistant: "How were the representative samples drawn and tracked to the FSL?"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Duplicates View */}
      {subTab === 'duplicates' && (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {duplicates.map((dupe, idx) => (
            <div key={idx} className="bg-[#1C1C1C] border border-[#333] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Document Duplication Identified</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                  {dupe.match_type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#141414] rounded-lg border border-[#282828]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Primary File</span>
                  <span className="font-mono text-zinc-200">{dupe.primary_file}</span>
                </div>
                <div className="p-2.5 bg-[#141414] rounded-lg border border-[#282828]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Duplicate File</span>
                  <span className="font-mono text-zinc-200">{dupe.duplicate_file}</span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 leading-relaxed bg-[#161616] p-2.5 rounded-lg border border-[#282828]">
                <strong className="text-zinc-300">Auditing Rationale:</strong> {dupe.reason}
              </div>

              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Handling Action: {dupe.action_taken.replace(/_/g, ' ')}</span>
              </div>
            </div>
          ))}

          <button
            onClick={() => onSelectPrompt('Explain the duplicate document detected between Document 686 and 686 (1).')}
            className="w-full flex items-center justify-center gap-2 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg py-2.5 transition-colors font-medium mt-2"
          >
            <span>Ask Assistant: "Explain the duplicate document detected between Document 686 and 686 (1)."</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
