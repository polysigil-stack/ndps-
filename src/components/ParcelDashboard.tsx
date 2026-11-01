import React, { useState, useEffect } from 'react';
import { Package, Scale, AlertTriangle, CheckCircle2, Shield, Eye, HelpCircle, ArrowRight } from 'lucide-react';
import { ParcelItem } from '../types';

interface ParcelDashboardProps {
  caseId: string;
  onSelectPrompt: (prompt: string) => void;
}

export const ParcelDashboard: React.FC<ParcelDashboardProps> = ({ caseId, onSelectPrompt }) => {
  const [parcels, setParcels] = useState<ParcelItem[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState<string>('P-1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/cases/${caseId}/parcels`)
      .then(res => res.json())
      .then(data => {
        if (data.parcels) {
          setParcels(data.parcels);
        }
      })
      .catch(err => console.error('Error fetching parcels:', err))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const activeParcel = parcels.find(p => p.parcel_id === selectedParcelId) || parcels[0];

  return (
    <div className="flex flex-col h-full space-y-4 text-left">
      {/* Overview Header banner */}
      <div className="bg-[#1C1C1C] border border-[#333] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            <span>4 Seized Contraband Parcels (P-1 to P-4)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Tracking individual parcel weights across 4 independent documents: Spot Recovery, Station Resealing, Section 52A Application, and Judicial Magistrate Certification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {parcels.map(p => {
            const isConflicting = p.weight_status === 'CONFLICTING';
            const isSelected = p.parcel_id === selectedParcelId;
            return (
              <button
                key={p.parcel_id}
                onClick={() => setSelectedParcelId(p.parcel_id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#252525] text-zinc-300 hover:bg-[#303030] border border-[#3A3A3A]'
                }`}
              >
                <span>{p.parcel_id}</span>
                {isConflicting ? (
                  <AlertTriangle className={`w-3 h-3 ${isSelected ? 'text-amber-200' : 'text-amber-400'}`} />
                ) : (
                  <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-emerald-200' : 'text-emerald-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading || !activeParcel ? (
        <div className="p-12 text-center text-sm text-zinc-400">Loading parcel intelligence...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Parcel Card */}
          <div className="md:col-span-8 bg-[#1A1A1A] border border-[#333] rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-zinc-100">{activeParcel.parcel_id}</span>
                <span className="text-xs text-zinc-400">({activeParcel.substance})</span>
              </div>
              <div className="flex items-center gap-2">
                {activeParcel.weight_status === 'CONFLICTING' ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-950/70 text-rose-300 border border-rose-800/80 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>WEIGHT CONFLICTING</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WEIGHT CONSISTENT</span>
                  </span>
                )}
              </div>
            </div>

            {/* Documented Weights Table */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
                <span>Documented Weights Across 4 Stages</span>
                <span className="text-[11px] text-zinc-500 font-normal">Preserving raw recorded values</span>
              </h4>

              <div className="overflow-x-auto rounded-lg border border-[#2F2F2F]">
                <table className="w-full text-xs">
                  <thead className="bg-[#222] text-zinc-400 border-b border-[#2F2F2F]">
                    <tr>
                      <th className="py-2 px-3 text-left font-semibold">Procedural Stage</th>
                      <th className="py-2 px-3 text-left font-semibold">Document Source</th>
                      <th className="py-2 px-3 text-right font-semibold">Recorded Weight</th>
                      <th className="py-2 px-3 text-right font-semibold">Page</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282828] bg-[#161616]">
                    <tr>
                      <td className="py-2 px-3 font-medium text-zinc-200">1. Spot Seizure</td>
                      <td className="py-2 px-3 text-zinc-400">Seizure Memo / Recovery Fard</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-zinc-100">
                        {activeParcel.documented_weights.seizure_memo?.raw || `${activeParcel.weight.toFixed(3)} kg`}
                      </td>
                      <td className="py-2 px-3 text-right text-zinc-500">p. 1</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-zinc-200">2. Station Resealing</td>
                      <td className="py-2 px-3 text-zinc-400">Document 686.pdf (Sec. 55)</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-zinc-100">
                        {activeParcel.documented_weights.resealing_55?.raw || `${activeParcel.weight.toFixed(3)} kg`}
                      </td>
                      <td className="py-2 px-3 text-right text-zinc-500">p. 1</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-zinc-200">3. Police Inventory</td>
                      <td className="py-2 px-3 text-zinc-400">Document 687.pdf (Sec. 52A App)</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-zinc-100">
                        {activeParcel.documented_weights.inventory_52a?.raw || `${activeParcel.weight.toFixed(3)} kg`}
                      </td>
                      <td className="py-2 px-3 text-right text-zinc-500">p. 2</td>
                    </tr>
                    <tr className={activeParcel.weight_status === 'CONFLICTING' ? 'bg-rose-950/20' : ''}>
                      <td className="py-2 px-3 font-medium text-zinc-200 flex items-center gap-1">
                        <span>4. Court Certification</span>
                        {activeParcel.weight_status === 'CONFLICTING' && (
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                        )}
                      </td>
                      <td className="py-2 px-3 text-zinc-400">Document 688.pdf (JMIC Certificate)</td>
                      <td className={`py-2 px-3 text-right font-mono font-bold ${
                        activeParcel.weight_status === 'CONFLICTING' ? 'text-amber-300' : 'text-zinc-100'
                      }`}>
                        {activeParcel.documented_weights.magistrate_cert_52a?.raw || `${activeParcel.weight.toFixed(3)} kg`}
                      </td>
                      <td className="py-2 px-3 text-right text-zinc-500">p. 1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Difference note if conflicting */}
            {activeParcel.difference_note && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200/90 leading-relaxed">
                <span className="font-semibold block mb-1">Divergence Observation:</span>
                {activeParcel.difference_note}
              </div>
            )}

            {/* Quick Action to Chat */}
            <button
              onClick={() => onSelectPrompt(`What was the weight of ${activeParcel.parcel_id} across documents?`)}
              className="w-full flex items-center justify-center gap-2 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg py-2.5 transition-colors font-medium"
            >
              <span>Ask Assistant: "What was the weight of {activeParcel.parcel_id} across documents?"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Parcel Metadata & Custody Panel */}
          <div className="md:col-span-4 bg-[#1A1A1A] border border-[#333] rounded-xl p-4 space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold border-b border-[#2C2C2C] pb-2">
              Seals & Sampling Details
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-[#222] rounded-lg border border-[#2F2F2F]">
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Spot IO Seal Mark</span>
                <span className="text-zinc-200 font-mono font-semibold">{activeParcel.original_seal}</span>
              </div>

              <div className="p-2.5 bg-[#222] rounded-lg border border-[#2F2F2F]">
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">SHO Station Reseal</span>
                <span className="text-zinc-200 font-mono font-semibold">{activeParcel.reseal_mark || 'SHO-BATATHU'}</span>
              </div>

              <div className="p-2.5 bg-[#222] rounded-lg border border-[#2F2F2F]">
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Court Judicial Seal</span>
                <span className="text-zinc-200 font-mono font-semibold">{activeParcel.court_seal || 'JMIC-1'}</span>
              </div>

              <div className="p-2.5 bg-[#222] rounded-lg border border-[#2F2F2F]">
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Judicial Sampling</span>
                <span className="text-zinc-200 font-medium block">
                  2 representative duplicate samples of 250 g each drawn before JMIC
                </span>
                <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                  Sample Mark: {activeParcel.parcel_id}/A & {activeParcel.parcel_id}/B
                </span>
              </div>

              <div className="p-2.5 bg-[#222] rounded-lg border border-[#2F2F2F]">
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">FSL Chemical Examination</span>
                <span className="text-zinc-200 font-medium block">
                  Report No. FSL-NDPS-2024-884: Positive for Papaver somniferum L. (Poppy Straw)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
