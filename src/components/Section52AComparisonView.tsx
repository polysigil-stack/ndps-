import React, { useState, useEffect } from 'react';
import { FileCheck, AlertTriangle, CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { MagistrateInventoryComparisonItem } from '../types';

interface Section52AComparisonViewProps {
  caseId: string;
  onSelectPrompt: (prompt: string) => void;
}

export const Section52AComparisonView: React.FC<Section52AComparisonViewProps> = ({
  caseId,
  onSelectPrompt
}) => {
  const [comparisons, setComparisons] = useState<MagistrateInventoryComparisonItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/cases/${caseId}/magistrate-inventory`)
      .then(res => res.json())
      .then(data => {
        if (data.comparisons) {
          setComparisons(data.comparisons);
        }
      })
      .catch(err => console.error('Error fetching 52A comparisons:', err))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  if (isLoading) {
    return <div className="p-12 text-center text-sm text-zinc-400">Loading Section 52A comparison...</div>;
  }

  return (
    <div className="flex flex-col h-full space-y-4 text-left">
      {/* Header Info */}
      <div className="bg-[#1C1C1C] border border-[#333] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-400" />
            <span>Section 52A NDPS Act: Police Inventory vs. Magistrate Certificate</span>
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Sec. 52A(2) Compliance</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Comparison between <strong>Document 687.pdf</strong> (Police Application & Inventory submitted by IO ASI Nirmal Patial) and <strong>Document 688.pdf</strong> (Judicial Order & Certificate of Inventory issued by the Judicial Magistrate First Class).
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="overflow-x-auto rounded-lg border border-[#2F2F2F]">
          <table className="w-full text-xs">
            <thead className="bg-[#222] text-zinc-400 border-b border-[#2F2F2F]">
              <tr>
                <th className="py-2.5 px-3 text-left font-semibold">Field / Entity</th>
                <th className="py-2.5 px-3 text-left font-semibold">Police Inventory (Doc 687)</th>
                <th className="py-2.5 px-3 text-left font-semibold">Magistrate Certificate (Doc 688)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Comparison Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828] bg-[#161616]">
              {comparisons.map((item, idx) => {
                const isConflict = item.status === 'CONFLICTING';
                return (
                  <tr key={idx} className={isConflict ? 'bg-rose-950/20' : ''}>
                    <td className="py-2.5 px-3 font-medium text-zinc-200">
                      <div>{item.field}</div>
                      <div className="text-[10px] text-zinc-500">{item.entity}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-zinc-200 font-semibold">{item.inventory_value}</div>
                      <div className="text-[10px] text-zinc-500">{item.inventory_doc} (p. {item.inventory_page})</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className={`font-mono font-semibold ${isConflict ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {item.certificate_value}
                      </div>
                      <div className="text-[10px] text-zinc-500">{item.certificate_doc} (p. {item.certificate_page})</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isConflict ? (
                        <div className="inline-flex flex-col items-end">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
                            <AlertTriangle className="w-3 h-3" />
                            <span>CONFLICTING</span>
                          </span>
                          {item.difference && (
                            <span className="text-[10px] font-mono text-amber-300 mt-0.5">{item.difference}</span>
                          )}
                        </div>
                      ) : item.status === 'MATCHING' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>MATCHING</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
                          <span>{item.status.replace(/_/g, ' ')}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggested Chat Prompt */}
      <div className="pt-1">
        <button
          onClick={() => onSelectPrompt('What is documented about Section 52A inventory vs Magistrate certificate?')}
          className="w-full flex items-center justify-center gap-2 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg py-2.5 transition-colors font-medium"
        >
          <span>Ask Assistant: "What is documented about Section 52A inventory vs Magistrate certificate?"</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
