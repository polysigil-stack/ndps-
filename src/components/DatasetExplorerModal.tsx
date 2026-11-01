import React, { useState, useEffect } from 'react';
import { X, Search, Database, FileText, CheckCircle, SlidersHorizontal, ArrowRight, Cpu } from 'lucide-react';
import { NDPSRecord, RetrievalResult } from '../types';

interface DatasetExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQueryForChat: (query: string) => void;
  initialSearch?: string;
}

export const DatasetExplorerModal: React.FC<DatasetExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectQueryForChat,
  initialSearch = ''
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'simulator'>('browse');

  // Browse state
  const [records, setRecords] = useState<NDPSRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sourceFilter, setSourceFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  // Simulator state
  const [simQuery, setSimQuery] = useState('What are the safeguards under Section 50?');
  const [simTopK, setSimTopK] = useState(5);
  const [simResults, setSimResults] = useState<RetrievalResult[]>([]);
  const [simLoading, setSimLoading] = useState(false);
  const [simLatency, setSimLatency] = useState(0);

  // Fetch records for browse
  useEffect(() => {
    if (!isOpen || activeTab !== 'browse') return;

    const fetchRecords = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '15',
          search: searchTerm,
          source: sourceFilter,
          quality: qualityFilter
        });
        const res = await fetch(`/api/records?${params.toString()}`);
        const data = await res.json();
        setRecords(data.records || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (e) {
        console.error('Failed to load records:', e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRecords, 150);
    return () => clearTimeout(timer);
  }, [isOpen, activeTab, page, searchTerm, sourceFilter, qualityFilter]);

  // Run simulation
  const handleRunSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!simQuery.trim()) return;

    setSimLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: simQuery, topK: simTopK })
      });
      const data = await res.json();
      setSimResults(data.results || []);
      setSimLatency(data.latencyMs || 0);
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setSimLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="dataset-explorer-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="dataset-explorer-modal"
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">NDPS Reference Knowledge Base</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {total} Total Q&As
                </span>
              </div>
              <p className="text-xs text-slate-400">Inspect clean training records and verify RAG retrieval ranking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Browse Records ({total})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('simulator');
              if (simResults.length === 0) handleRunSimulation();
            }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>RAG Retrieval Simulator</span>
          </button>
        </div>

        {/* Tab 1: Browse Records */}
        {activeTab === 'browse' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Filters Bar */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-hidden focus:border-emerald-500"
              >
                <option value="">All Source Documents</option>
                <option value="Question 331.pdf">Question 331.pdf (331 Q&As)</option>
                <option value="Training Outcome.pdf">State CID + NCB Training Outcome.pdf (35 Q&As)</option>
              </select>

              <select
                value={qualityFilter}
                onChange={(e) => {
                  setQualityFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-hidden focus:border-emerald-500"
              >
                <option value="">All Quality Statuses</option>
                <option value="clean">Clean (234 records)</option>
                <option value="repaired">Repaired (130 records)</option>
                <option value="needs_manual_review">Needs Manual Review (2 records)</option>
              </select>
            </div>

            {/* Records List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="text-center py-12 text-slate-400 text-xs">Loading records...</div>
              ) : records.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No records found matching filter.</div>
              ) : (
                records.map((r) => (
                  <div
                    key={r.record_id}
                    className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">
                          Q.{r.question_number}
                        </span>
                        <span className="text-slate-400 text-[11px]">({r.record_id})</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {r.source} · p.{r.page}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                            r.quality_status === 'clean'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : r.quality_status === 'repaired'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {r.quality_status}
                        </span>
                        <button
                          onClick={() => {
                            onSelectQueryForChat(r.question);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Ask this question in Chat"
                        >
                          <span>Ask</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-slate-200">{r.question}</p>
                    <p className="text-xs text-slate-400 whitespace-pre-wrap pl-2 border-l-2 border-slate-800 line-clamp-3 hover:line-clamp-none">
                      {r.answer}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>
                Page {page} of {totalPages} ({total} records)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: RAG Retrieval Simulator */}
        {activeTab === 'simulator' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 space-y-4">
            <form onSubmit={handleRunSimulation} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                placeholder="Enter query to inspect top retrieved chunks..."
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
              <div className="flex items-center gap-2">
                <select
                  value={simTopK}
                  onChange={(e) => setSimTopK(Number(e.target.value))}
                  className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-hidden focus:border-cyan-500"
                >
                  <option value={3}>Top 3</option>
                  <option value={5}>Top 5</option>
                  <option value={8}>Top 8</option>
                </select>
                <button
                  type="submit"
                  disabled={simLoading}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-50"
                >
                  {simLoading ? 'Simulating...' : 'Test Retrieval'}
                </button>
              </div>
            </form>

            {/* Results */}
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Retrieved {simResults.length} records ({simLatency}ms)</span>
                <span className="text-[11px] font-mono">Ranking: 0.50*Cosine + 0.35*BM25 + 0.25*Section</span>
              </div>

              {simResults.map((res, index) => (
                <div key={res.record.record_id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-cyan-400">Rank #{index + 1}</span>
                      <span className="text-slate-300">Q.{res.record.question_number}</span>
                      <span className="text-slate-500">({res.record.record_id})</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-semibold">
                        Score: {res.score.toFixed(3)}
                      </span>
                      {res.cosineSimilarity !== undefined && (
                        <span className="text-slate-400">Cosine: {res.cosineSimilarity.toFixed(3)}</span>
                      )}
                      <span className="text-slate-400">BM25: {res.bm25Score?.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">{res.record.question}</p>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                    {res.record.answer}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Source: {res.record.source} · Page {res.record.page}</span>
                    <button
                      onClick={() => {
                        onSelectQueryForChat(res.record.question);
                        onClose();
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Ask in Assistant &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
