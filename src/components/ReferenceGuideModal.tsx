import React, { useEffect } from 'react';
import { X, BookOpen, ShieldCheck, Scale, FileText } from 'lucide-react';

interface ReferenceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic?: (query: string) => void;
}

const KEY_PROCEDURAL_PROVISIONS = [
  {
    section: 'Section 42',
    title: 'Search, Seizure & Arrest without Warrant',
    summary: 'Empowered officer may enter, search, and seize between sunrise and sunset. If recording secret information, take down in writing and send copy to immediate official superior within 72 hours (Karnail Singh compliance).',
    query: 'Explain complete Section 42 requirements, emergency search proviso, and 72-hour reporting compliance.'
  },
  {
    section: 'Section 50',
    title: 'Conditions under which Personal Search is Conducted',
    summary: 'Mandatory statutory right of the suspect to be searched before a Gazetted Officer or Magistrate. Substantial compliance is insufficient (Vijaysinh Chandubha Jadeja). Applies strictly to personal searches, not bags or baggage (State of Punjab v. Baldev Singh).',
    query: 'Explain Section 50 safeguards, mandatory communication of right, and exceptions.'
  },
  {
    section: 'Section 52A',
    title: 'Disposal of Seized Narcotic Drugs & Psychotropic Substances',
    summary: 'Drawing of samples and preparation of inventory must be conducted before a Magistrate (Union of India v. Mohanlal). The certificate issued by the Magistrate is primary evidence at trial.',
    query: 'Explain Section 52A procedure for drawing samples and inventory certification before a Magistrate.'
  },
  {
    section: 'Section 57',
    title: 'Report of Arrest and Seizure',
    summary: 'Whenever an officer makes an arrest or seizure under the Act, a full report of all particulars must be submitted to the immediate official superior within 48 hours.',
    query: 'What are the reporting timelines and requirements under Section 57?'
  },
  {
    section: 'Chapter V-A',
    title: 'Forfeiture of Illegally Acquired Property',
    summary: 'Freezing order under Section 68F must be served on person and copy sent to Competent Authority within 48 hours. Competent Authority must confirm within 30 days.',
    query: 'What is the statutory timeline and procedure for property freezing under Chapter V-A (Section 68F)?'
  }
];

export const ReferenceGuideModal: React.FC<ReferenceGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic
}) => {
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

  if (!isOpen) return null;

  return (
    <div
      id="reference-guide-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reference-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        id="reference-guide-container"
        className="relative w-full max-w-xl bg-[#212121] border border-[#3A3A3A] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#ECECEC] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#3A3A3A] flex items-center justify-between bg-[#171717]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-[#8E8E8E]">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="reference-guide-title" className="text-sm font-semibold text-[#ECECEC]">
                NDPS Statutory Reference & Procedural Guide
              </h2>
              <p className="text-[11px] text-[#8E8E8E]">
                Key statutory provisions, timelines, and landmark precedents
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4.5 space-y-3.5 text-xs text-[#B4B4B4] overflow-y-auto">
          {KEY_PROCEDURAL_PROVISIONS.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#ECECEC] text-[12.5px]">
                  {item.section} · {item.title}
                </span>
                {onSelectTopic && (
                  <button
                    onClick={() => {
                      onSelectTopic(item.query);
                      onClose();
                    }}
                    className="text-[11px] text-[#8E8E8E] hover:text-[#ECECEC] hover:underline cursor-pointer"
                  >
                    Inquire in chat →
                  </button>
                )}
              </div>
              <p className="text-[11.5px] text-[#B4B4B4] leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#3A3A3A] bg-[#171717] flex items-center justify-between">
          <span className="text-[11px] text-[#8E8E8E]">
            NDPS Act 1985 · Official Reference Guide
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#ECECEC] text-xs font-medium border border-[#3A3A3A] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
