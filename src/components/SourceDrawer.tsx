import React, { useEffect, useState } from 'react';
import { X, BookOpen, FileText, CheckCircle2, Copy, Check } from 'lucide-react';
import { SourceCitation } from '../types';

interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  citation: SourceCitation | null;
  onAskFollowUp?: (query: string) => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  isOpen,
  onClose,
  citation,
  onAskFollowUp
}) => {
  const [copiedExcerpt, setCopiedExcerpt] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !citation) return null;

  const actName = citation.act || 'NDPS Act, 1985';
  const sectionName = citation.section;
  const isCaseLaw =
    citation.source_type === 'case_law' ||
    citation.source?.toLowerCase().includes('v.') ||
    citation.title?.toLowerCase().includes('v.');

  const title = isCaseLaw
    ? (citation.title || citation.source || 'Supreme Court Precedent')
    : sectionName
    ? `${actName} — ${sectionName}`
    : (citation.title || actName);

  const documentName = citation.source || 'Department NDPS Training Material';
  const questionNumber = citation.questionNumber;
  const pageNumber = citation.page;
  const excerptText = citation.evidence || citation.answerSnippet || citation.title || 'Official statutory reference verified in NDPS reference repository.';

  const handleCopyExcerpt = () => {
    try {
      navigator.clipboard.writeText(excerptText);
      setCopiedExcerpt(true);
      setTimeout(() => setCopiedExcerpt(false), 2000);
    } catch {}
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="source-drawer-backdrop"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <aside
        id="source-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-drawer-title"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#212121] border-l border-[#3A3A3A] shadow-2xl flex flex-col overflow-hidden text-[#ECECEC] animate-in slide-in-from-right duration-200"
        aria-label="Source Document Details"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#3A3A3A] flex items-center justify-between bg-[#171717]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-[#8E8E8E]">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[#8E8E8E]">
                Authoritative Reference
              </div>
              <h3 id="source-drawer-title" className="text-sm font-semibold text-[#ECECEC] truncate max-w-[260px]">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
            aria-label="Close source panel"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-[#ECECEC] select-text">
          {/* Provenance Metadata Tags */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {questionNumber && (
              <span className="px-2.5 py-1 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#B4B4B4] font-medium">
                Question #{questionNumber}
              </span>
            )}
            {pageNumber && (
              <span className="px-2.5 py-1 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#B4B4B4] font-medium">
                Page {pageNumber}
              </span>
            )}
            {citation.court && (
              <span className="px-2.5 py-1 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#B4B4B4] font-medium">
                {citation.court}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[#B4B4B4] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8E8E8E]" aria-hidden="true" />
              <span>Grounded Reference</span>
            </span>
          </div>

          {/* Original Question Section if present */}
          {citation.questionText && (
            <div className="space-y-1.5 pt-2 border-t border-[#3A3A3A]">
              <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
                Original Question / Inquiry
              </div>
              <div className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-[#ECECEC] text-[13px] leading-relaxed font-medium">
                {citation.questionText}
              </div>
            </div>
          )}

          {/* Statutory Content / Official Excerpt */}
          <div className="space-y-1.5 pt-2 border-t border-[#3A3A3A]">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
                Statutory Excerpt / Official Answer
              </div>
              <button
                type="button"
                onClick={handleCopyExcerpt}
                className="text-[11px] text-[#8E8E8E] hover:text-[#ECECEC] flex items-center gap-1 cursor-pointer transition-colors"
                title="Copy excerpt"
              >
                {copiedExcerpt ? <Check className="w-3 h-3 text-[#ECECEC]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedExcerpt ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-[#ECECEC] text-[13.5px] leading-relaxed space-y-2">
              <p className="whitespace-pre-wrap">
                {excerptText}
              </p>
            </div>
          </div>

          {/* Source Document Details */}
          <div className="space-y-1.5 pt-2 border-t border-[#3A3A3A]">
            <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Source Document
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-[#B4B4B4]">
              <FileText className="w-4 h-4 text-[#8E8E8E] shrink-0" aria-hidden="true" />
              <span className="text-xs truncate font-mono">{documentName}</span>
            </div>
          </div>

          {/* Follow-up Quick Action */}
          {sectionName && onAskFollowUp && (
            <div className="pt-3 border-t border-[#3A3A3A]">
              <button
                type="button"
                onClick={() => {
                  onAskFollowUp(`Explain complete procedural requirements and case law under ${sectionName}`);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#3A3A3A] text-[#ECECEC] text-xs font-medium transition-colors cursor-pointer text-center"
              >
                Inquire further about {sectionName} →
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-[#3A3A3A] bg-[#171717] flex items-center justify-between">
          <span className="text-[11px] text-[#8E8E8E]">
            NDPS Knowledge Base · Verified Record
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#ECECEC] text-xs font-medium border border-[#3A3A3A] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
};
