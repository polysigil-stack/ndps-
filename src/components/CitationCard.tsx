import React, { useState } from 'react';
import { SourceCitation } from '../types';
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface CitationCardProps {
  citation: SourceCitation;
  onViewSource?: (citation: SourceCitation) => void;
  onSelectQuery?: (query: string) => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({
  citation,
  onViewSource,
  onSelectQuery
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const actName = citation.act || 'NDPS Act, 1985';
  const sectionName = citation.section;
  const isCaseLaw =
    citation.source_type === 'case_law' ||
    citation.source?.toLowerCase().includes('v.') ||
    citation.title?.toLowerCase().includes('v.');

  const sourceName = citation.source || (isCaseLaw ? 'Supreme Court of India' : 'NDPS Reference Bank');
  const questionNum = citation.questionNumber ? `Question ${citation.questionNumber}` : null;
  const pageNum = citation.page ? `Page ${citation.page}` : null;
  const mainLabel = isCaseLaw
    ? (citation.title || citation.source || 'Judicial Precedent')
    : sectionName
    ? `${actName} · ${sectionName}`
    : questionNum
    ? `${sourceName} · ${questionNum}`
    : (citation.title || actName);

  return (
    <div className="p-3 rounded-lg bg-[#171D25] hover:bg-[#1C232C] border border-[#252D36] hover:border-[#71859A]/40 transition-all duration-150 text-left select-none group flex flex-col justify-between gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <div className="w-5 h-5 rounded bg-[#182029] border border-[#252D36] flex items-center justify-center text-[#71859A] shrink-0 mt-0.5">
            <BookOpen className="w-3 h-3" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] font-semibold text-[#E8EDF2] truncate">
              {mainLabel}
            </div>
            <div className="text-[11px] text-[#AAB3BD] mt-0.5 flex flex-wrap items-center gap-x-2">
              <span className="truncate">{sourceName}</span>
              {questionNum && <span>· {questionNum}</span>}
              {pageNum && <span>· {pageNum}</span>}
            </div>
          </div>
        </div>

        {/* View source button */}
        {onViewSource && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewSource(citation);
            }}
            className="shrink-0 px-2 py-1 rounded bg-[#182029] hover:bg-[#1C232C] text-[#AAB3BD] hover:text-[#E8EDF2] border border-[#252D36] hover:border-[#71859A]/50 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
            title="View full source text and details"
            aria-label="View full source text and details"
          >
            <span>View source</span>
            <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Optional expand details for technical metadata */}
      {(citation.evidence || citation.court) && (
        <div className="pt-1.5 border-t border-[#252D36]/60 text-[11px] text-[#707A85] flex items-center justify-between">
          <span className="truncate max-w-[200px]">
            {citation.court ? `Court: ${citation.court}` : 'Grounded legal citation'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[#707A85] hover:text-[#AAB3BD] text-[10px] flex items-center gap-0.5 cursor-pointer"
            aria-label={showDetails ? 'Hide excerpt' : 'Show source excerpt'}
          >
            <span>{showDetails ? 'Hide excerpt' : 'Source details'}</span>
            {showDetails ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
          </button>
        </div>
      )}

      {showDetails && citation.evidence && (
        <div className="p-2 rounded bg-[#11161D] border border-[#252D36] text-[11.5px] text-[#AAB3BD] leading-relaxed max-h-28 overflow-y-auto">
          {citation.evidence}
        </div>
      )}
    </div>
  );
};

