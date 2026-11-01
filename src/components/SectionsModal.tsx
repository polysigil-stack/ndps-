import React, { useState } from 'react';
import { X, Search, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

interface SectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

interface SectionItem {
  number: string;
  chapter: string;
  title: string;
  scope: string;
  keyRule: string;
  sampleQuery: string;
}

const STATUTORY_SECTIONS: SectionItem[] = [
  {
    number: 'Section 37',
    chapter: 'Chapter IV — Offences & Penalties',
    title: 'Offences to be cognizable and non-bailable',
    scope: 'Bail restrictions for commercial quantity and Sections 19, 24, 27A.',
    keyRule: 'Twin conditions: Public prosecutor opportunity to oppose, and Court satisfied reasonable grounds exist that accused is not guilty and not likely to commit offense while on bail.',
    sampleQuery: 'What are the twin conditions for bail under Section 37 of the NDPS Act?'
  },
  {
    number: 'Section 41',
    chapter: 'Chapter V — Procedure',
    title: 'Power to issue warrant and authorisation',
    scope: 'Magistrate warrant or Gazetted Officer authorisation for search, seizure, or arrest.',
    keyRule: 'Empowered Magistrate or Gazetted Officer may issue search warrant or authorization based on reasonable belief.',
    sampleQuery: 'Explain Section 41 regarding search warrants and authorisations by Gazetted Officers.'
  },
  {
    number: 'Section 42',
    chapter: 'Chapter V — Procedure',
    title: 'Power of entry, search, seizure and arrest without warrant',
    scope: 'Enclosed places, building, conveyance search between sunrise and sunset, or night search with grounds.',
    keyRule: 'Secret information must be taken down in writing; Section 42(2) report must be forwarded within 72 hours.',
    sampleQuery: 'What are the procedural requirements of Section 42(1) and Section 42(2) of NDPS Act?'
  },
  {
    number: 'Section 43',
    chapter: 'Chapter V — Procedure',
    title: 'Power of seizure and arrest in public place',
    scope: 'Public places, transit, open streets, buses, trains, and public thoroughfares.',
    keyRule: 'Does not require recording grounds of belief for night search unlike Section 42.',
    sampleQuery: 'What is the scope of search and seizure in a public place under Section 43?'
  },
  {
    number: 'Section 50',
    chapter: 'Chapter V — Procedure',
    title: 'Conditions under which search of persons shall be conducted',
    scope: 'Personal bodily search of a suspect.',
    keyRule: 'Mandatory obligation to inform suspect of right to be searched before a Gazetted Officer or Magistrate. Female suspect must only be searched by female officer.',
    sampleQuery: 'What are the procedural safeguards under Section 50 of the NDPS Act?'
  },
  {
    number: 'Section 52',
    chapter: 'Chapter V — Procedure',
    title: 'Disposal of persons arrested and articles seized',
    scope: 'Immediate procedure following arrest and seizure on the field.',
    keyRule: 'Arrested person must be informed of grounds of arrest without unnecessary delay and forwarded to nearest police station.',
    sampleQuery: 'What are the duties of an arresting officer under Section 52 of NDPS Act?'
  },
  {
    number: 'Section 52A',
    chapter: 'Chapter V — Procedure',
    title: 'Disposal of seized narcotic drugs and psychotropic substances',
    scope: 'Preparation of inventory, sampling, and Magistrate certification.',
    keyRule: 'Samples drawn in the presence of the Magistrate and certified under Section 52A constitute primary evidence in trial.',
    sampleQuery: 'Explain the mandatory Magistrate sampling procedure under Section 52A of the NDPS Act.'
  },
  {
    number: 'Section 55',
    chapter: 'Chapter V — Procedure',
    title: 'Police to take charge of articles seized and delivered',
    scope: 'Station house officer (SHO) custody, sealing, and malkhana entry.',
    keyRule: 'Officer-in-charge of police station must affix station seal and ensure safe custody in Malkhana with proper register entry.',
    sampleQuery: 'What are the requirements under Section 55 for police custody and malkhana register?'
  },
  {
    number: 'Section 57',
    chapter: 'Chapter V — Procedure',
    title: 'Report of arrest and seizure',
    scope: 'Mandatory post-seizure supervisory reporting.',
    keyRule: 'Full report of arrest or seizure must be submitted to immediate official superior within 48 hours.',
    sampleQuery: 'What are the statutory requirements and timelines under Section 57 of NDPS Act?'
  },
  {
    number: 'Chapter V-A (68A–68Z)',
    chapter: 'Chapter V-A — Forfeiture of Property',
    title: 'Forfeiture of Illegally Acquired Property',
    scope: 'Financial investigation, freezing orders, and property forfeiture.',
    keyRule: 'Section 68F freezing order requires 48-hour notice to Competent Authority and 30-day confirmation. Section 57A report within 90 days.',
    sampleQuery: 'Explain the financial investigation and freezing procedures under Chapter V-A of NDPS Act.'
  }
];

export const SectionsModal: React.FC<SectionsModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery
}) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = STATUTORY_SECTIONS.filter(s =>
    s.number.toLowerCase().includes(filter.toLowerCase()) ||
    s.title.toLowerCase().includes(filter.toLowerCase()) ||
    s.scope.toLowerCase().includes(filter.toLowerCase()) ||
    s.keyRule.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      id="sections-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="sections-modal-container"
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d121c] border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>NDPS Statutory Provisions Index</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  Key Sections & Safeguards
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Core investigation, procedural and search provisions under the NDPS Act, 1985
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sections modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search filter */}
        <div className="p-3 sm:px-6 border-b border-slate-800 bg-[#0e1420]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Filter sections by keyword, title, or requirement (e.g. 50, 42, bail, search)..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#161f2e] text-xs text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-slate-700/80 focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No matching statutory sections found for "{filter}".
            </div>
          ) : (
            filtered.map((sec) => (
              <div
                key={sec.number}
                className="rounded-lg bg-[#111827]/70 border border-slate-800/80 p-4 hover:border-slate-700 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                      {sec.number}
                    </span>
                    <span className="font-semibold text-sm text-slate-100">{sec.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({sec.chapter})</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-200">Scope: </strong>{sec.scope}
                  </p>
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Statutory Mandate: </strong>{sec.keyRule}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectQuery(sec.sampleQuery);
                    onClose();
                  }}
                  className="sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-teal-950 text-slate-200 hover:text-teal-200 border border-slate-700 hover:border-teal-700 transition-colors cursor-pointer"
                  title="Query this section in chat"
                >
                  <span>Query Section</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#111827]/80 flex items-center justify-between text-xs text-slate-400">
          <span>Click "Query Section" to inspect statutory and procedural grounding.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
