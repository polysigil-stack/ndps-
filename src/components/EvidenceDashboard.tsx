import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, ExternalLink, AlertCircle, CheckCircle2, Clock, FileText, ChevronRight, Layers } from 'lucide-react';
import { CaseEvidenceItem, EvidenceCategory, OCRConfidence } from '../types';

interface EvidenceDashboardProps {
  caseId: string;
  onSelectPrompt: (prompt: string) => void;
}

export const EvidenceDashboard: React.FC<EvidenceDashboardProps> = ({ caseId, onSelectPrompt }) => {
  const [evidenceList, setEvidenceList] = useState<CaseEvidenceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<CaseEvidenceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/cases/${caseId}/evidence`)
      .then(res => res.json())
      .then(data => {
        if (data.evidence) {
          setEvidenceList(data.evidence);
        }
      })
      .catch(err => console.error('Error fetching evidence items:', err))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const categories: string[] = ['ALL', ...Array.from(new Set(evidenceList.map(e => e.evidence_category)))];

  const filteredEvidence = evidenceList.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.evidence_category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.fact.toLowerCase().includes(q) ||
      item.raw_value.toLowerCase().includes(q) ||
      item.document_name.toLowerCase().includes(q) ||
      item.context.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getConfidenceBadge = (confidence: OCRConfidence) => {
    switch (confidence) {
      case 'HIGH':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">OCR: HIGH</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60">OCR: MEDIUM</span>;
      case 'LOW':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-800/60">OCR: LOW</span>;
      case 'VISUAL_VERIFICATION_REQUIRED':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60">VISUAL VERIFICATION</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DOCUMENTED':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/60">DOCUMENTED</span>;
      case 'CONFLICTING':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60">CONFLICTING</span>;
      case 'NOT_ESTABLISHED':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60">NOT ESTABLISHED</span>;
      case 'REQUIRES_VERIFICATION':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/60">VERIFICATION REQ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#1A1A1A] border border-[#333] rounded-xl">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search evidence fact, raw text, or document..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-zinc-500 hover:text-zinc-300">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-[#242424] border border-[#3A3A3A] text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({cat === 'ALL' ? evidenceList.length : evidenceList.filter(e => e.evidence_category === cat).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View: Split Master-Detail */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-[420px]">
        {/* Evidence List */}
        <div className="md:col-span-7 flex flex-col space-y-2 overflow-y-auto max-h-[500px] pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-zinc-400">Loading evidence repository...</div>
          ) : filteredEvidence.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500 bg-[#1A1A1A] rounded-xl border border-[#333]">
              No evidence facts match the selected filters.
            </div>
          ) : (
            filteredEvidence.map(item => {
              const isSelected = selectedEvidence?.evidence_id === item.evidence_id;
              return (
                <div
                  key={item.evidence_id}
                  onClick={() => setSelectedEvidence(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#2A2A2A] border-indigo-500/80 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-[#1C1C1C] border-[#333] hover:border-[#4A4A4A] hover:bg-[#222]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-zinc-200 line-clamp-1">{item.fact}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {getStatusBadge(item.status)}
                      {getConfidenceBadge(item.ocr_confidence)}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 mb-2 line-clamp-2">
                    <span className="text-zinc-500 font-mono text-[11px] mr-1.5">[{item.evidence_category}]</span>
                    {item.raw_value}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-[#2A2A2A]">
                    <span className="flex items-center gap-1 text-zinc-400 truncate max-w-[240px]">
                      <FileText className="w-3 h-3 text-indigo-400 shrink-0" />
                      {item.document_name} <span className="text-zinc-500">(p. {item.page})</span>
                    </span>
                    <span className="text-zinc-500 font-mono text-[10px]">{item.evidence_id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Evidence Detail Panel */}
        <div className="md:col-span-5 bg-[#1A1A1A] border border-[#333] rounded-xl p-4 flex flex-col justify-between overflow-y-auto max-h-[500px]">
          {selectedEvidence ? (
            <div className="space-y-3.5 text-left">
              <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-2">
                <span className="text-xs font-mono text-zinc-400">{selectedEvidence.evidence_id}</span>
                <div className="flex items-center gap-1.5">
                  {getStatusBadge(selectedEvidence.status)}
                  {getConfidenceBadge(selectedEvidence.ocr_confidence)}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">Evidentiary Fact</h4>
                <p className="text-sm font-medium text-zinc-100">{selectedEvidence.fact}</p>
              </div>

              <div className="bg-[#121212] p-3 rounded-lg border border-[#282828] space-y-1.5">
                <h5 className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
                  <span>Raw Source Value</span>
                  <span className="text-[10px] text-zinc-500">Exact Document Extract</span>
                </h5>
                <p className="text-xs font-mono text-amber-200/90 whitespace-pre-wrap leading-relaxed">
                  "{selectedEvidence.raw_value}"
                </p>
              </div>

              <div>
                <h5 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">Case Context & Provenance</h5>
                <p className="text-xs text-zinc-300 leading-relaxed bg-[#222] p-2.5 rounded-lg border border-[#2F2F2F]">
                  {selectedEvidence.context}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-[#222] rounded-lg border border-[#2F2F2F]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Document</span>
                  <span className="text-zinc-200 font-medium truncate block">{selectedEvidence.document_name}</span>
                </div>
                <div className="p-2 bg-[#222] rounded-lg border border-[#2F2F2F]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Page Number</span>
                  <span className="text-zinc-200 font-medium block">Page {selectedEvidence.page}</span>
                </div>
              </div>

              {selectedEvidence.related_evidence_ids && selectedEvidence.related_evidence_ids.length > 0 && (
                <div>
                  <h5 className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-1.5">
                    Connected Evidence Records
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvidence.related_evidence_ids.map(relId => (
                      <span
                        key={relId}
                        onClick={() => {
                          const target = evidenceList.find(e => e.evidence_id === relId);
                          if (target) setSelectedEvidence(target);
                        }}
                        className="text-[11px] font-mono px-2 py-1 rounded bg-[#252525] hover:bg-[#303030] text-indigo-300 border border-[#3A3A3A] cursor-pointer transition-colors"
                      >
                        {relId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => onSelectPrompt(`What does the case record say about "${selectedEvidence.fact}"?`)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg py-2 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Ask Assistant About This Fact</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
              <Layers className="w-8 h-8 text-zinc-600" />
              <p className="text-xs">Select any evidence item on the left to inspect raw extracted text, provenance, and verification links.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
