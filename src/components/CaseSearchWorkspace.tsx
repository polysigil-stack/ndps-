import React, { useState, useEffect } from 'react';
import { Search, FileText, ArrowRight, Layers, Box, Shield, Clock } from 'lucide-react';
import { CaseSearchResultItem } from '../types';

interface CaseSearchWorkspaceProps {
  caseId: string;
  onSelectPrompt?: (prompt: string) => void;
}

export const CaseSearchWorkspace: React.FC<CaseSearchWorkspaceProps> = ({ caseId, onSelectPrompt }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CaseSearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const executeSearch = (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    fetch(`/api/cases/${caseId}/search?q=${encodeURIComponent(q.trim())}`)
      .then(res => res.json())
      .then(res => {
        if (res.results) {
          setResults(res.results);
        }
        setHasSearched(true);
      })
      .catch(err => console.error('Search error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      executeSearch(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query, caseId]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PARCEL': return <Box className="w-3.5 h-3.5 text-amber-400" />;
      case 'SEAL': return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
      case 'TIMELINE': return <Clock className="w-3.5 h-3.5 text-blue-400" />;
      case 'DOCUMENT': return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Layers className="w-3.5 h-3.5 text-[#8E8E8E]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
        <input
          type="text"
          placeholder="Search case evidence (e.g., '27.260', 'poppy husk', 'P-1', 'JMIC-1', 'SHO-BATATHU', 'Nirmal Patial')..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#222222] border border-[#3A3A3A] rounded-xl text-xs text-[#ECECEC] placeholder-[#666666] focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
        />
      </div>

      {/* Suggested Quick Searches */}
      {!hasSearched && (
        <div className="p-4 rounded-xl bg-[#222222] border border-[#333333] space-y-2.5">
          <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
            Investigator Quick Search Terms
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['P-1 27.260 kg', 'Court Seal JMIC-1', 'Section 55 Reseal', 'Canter HP72D-3928', 'Manoj Kumar', '4 Bags 108.900 kg', '57 Report Jawali'].map(term => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] hover:bg-[#282828] border border-[#2E2E2E] text-xs text-[#B4B4B4] hover:text-[#ECECEC] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {hasSearched && (
        <div className="flex items-center justify-between text-xs text-[#8E8E8E] px-1">
          <span>{loading ? 'Searching...' : `Found ${results.length} evidentiary occurrences`}</span>
          <span className="font-mono text-[10px]">Scoped strictly to Case Records</span>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        {results.map(item => (
          <div
            key={item.item_id}
            className="p-3.5 rounded-xl bg-[#222222] border border-[#333333] hover:border-[#444444] transition-colors space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-[#1A1A1A] border border-[#2E2E2E]">
                  {getCategoryIcon(item.category)}
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-[#1C1C1C] px-1.5 py-0.5 rounded border border-[#2E2E2E]">
                  {item.category}
                </span>
                <h4 className="text-xs font-semibold text-[#ECECEC]">{item.title}</h4>
              </div>
              <span className="font-mono text-[10px] text-[#8E8E8E] bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#2E2E2E]">
                {item.document_name} • p. {item.page}
              </span>
            </div>

            <p className="text-xs text-[#CCCCCC] pl-8">{item.snippet}</p>

            <div className="pt-2 border-t border-[#2D2D2D] flex items-center justify-between text-[10px] text-[#8E8E8E] pl-8">
              <span className="font-mono text-[#666666]">Ref: {item.evidence_id}</span>
              {onSelectPrompt && (
                <button
                  onClick={() => onSelectPrompt(`What does ${item.document_name} say about ${item.title}?`)}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>Query in chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {hasSearched && results.length === 0 && !loading && (
          <div className="p-8 text-center text-xs text-[#8E8E8E] border border-dashed border-[#3A3A3A] rounded-xl">
            No matching case records found for query "{query}".
          </div>
        )}
      </div>
    </div>
  );
};
