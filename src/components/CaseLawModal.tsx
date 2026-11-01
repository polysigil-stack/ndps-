import React, { useState } from 'react';
import { X, Search, Scale, ArrowRight, BookMarked } from 'lucide-react';

interface CaseLawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

interface CaseItem {
  citation: string;
  title: string;
  section: string;
  court: string;
  bench: string;
  ratio: string;
  sampleQuery: string;
}

const PRECEDENT_CASES: CaseItem[] = [
  {
    citation: '(1999) 6 SCC 172',
    title: 'State of Punjab v. Baldev Singh',
    section: 'Section 50',
    court: 'Supreme Court of India (Constitution Bench)',
    bench: '5-Judge Bench',
    ratio: 'Compliance with Section 50(1) is mandatory. The suspect must be clearly informed of their right to be searched before a Gazetted Officer or Magistrate. Failure to inform vitiates the recovery and trial.',
    sampleQuery: 'What did the Supreme Court hold in State of Punjab v. Baldev Singh regarding Section 50?'
  },
  {
    citation: '(2005) 4 SCC 350',
    title: 'State of H.P. v. Pawan Kumar',
    section: 'Section 50',
    court: 'Supreme Court of India (3-Judge Bench)',
    bench: '3-Judge Bench',
    ratio: 'Section 50 applies exclusively to the search of the physical person (human body). Search of a bag, briefcase, vehicle, or container carried by a person is not a search of the person under Section 50.',
    sampleQuery: 'Explain the principle in State of H.P. v. Pawan Kumar on whether search of a bag requires Section 50 compliance.'
  },
  {
    citation: '(2009) 8 SCC 539',
    title: 'Karnail Singh v. State of Haryana',
    section: 'Section 42',
    court: 'Supreme Court of India (Constitution Bench)',
    bench: '5-Judge Bench',
    ratio: 'Substantial compliance with Section 42 is permissible where total non-compliance would delay urgent action or allow suspect to escape, but recording and reporting grounds of belief must be completed as soon as feasible.',
    sampleQuery: 'What did the Supreme Court hold in Karnail Singh v. State of Haryana regarding Section 42 compliance?'
  },
  {
    citation: '(2016) 3 SCC 379',
    title: 'Union of India v. Mohanlal',
    section: 'Section 52A',
    court: 'Supreme Court of India',
    bench: 'Division Bench',
    ratio: 'Seized contraband must be produced before the Magistrate immediately under Section 52A for inventory certification and sample drawing. Samples drawn in the presence of the Magistrate constitute primary evidence.',
    sampleQuery: 'Explain the landmark ruling in Union of India v. Mohanlal regarding Section 52A sampling before Magistrate.'
  },
  {
    citation: '(2005) 3 SCC 59',
    title: 'State of Rajasthan v. Gurmail Singh',
    section: 'Section 55 / Malkhana',
    court: 'Supreme Court of India',
    bench: 'Division Bench',
    ratio: 'Proper entries in the Malkhana Register and preservation of specimen seal impressions are critical. Failure to prove unbroken custody from seizure to laboratory analysis entitles the accused to acquittal.',
    sampleQuery: 'What did the Supreme Court hold in State of Rajasthan v. Gurmail Singh regarding malkhana custody and chain of custody?'
  },
  {
    citation: '(2020) 10 SCC 120',
    title: 'Mukesh Singh v. State (NCT of Delhi)',
    section: 'Investigation & Fairness',
    court: 'Supreme Court of India (Constitution Bench)',
    bench: '5-Judge Bench',
    ratio: 'The informant-police officer can also be the investigating officer in NDPS cases, provided there is no bias, prejudice, or unfairness established by the defense.',
    sampleQuery: 'Can the informant police officer also be the investigating officer in an NDPS case according to Mukesh Singh?'
  },
  {
    citation: '(2021) 4 SCC 1',
    title: 'Tofan Singh v. State of Tamil Nadu',
    section: 'Section 67 / Evidence',
    court: 'Supreme Court of India',
    bench: '3-Judge Bench',
    ratio: 'Officers of the NCB, DRI, and designated NDPS officers are "police officers" within the meaning of Section 25 of the Evidence Act; any confessional statement recorded under Section 67 NDPS is inadmissible as substantive evidence.',
    sampleQuery: 'Is a confessional statement recorded under Section 67 of the NDPS Act admissible in evidence under Tofan Singh?'
  }
];

export const CaseLawModal: React.FC<CaseLawModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery
}) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = PRECEDENT_CASES.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase()) ||
    c.section.toLowerCase().includes(filter.toLowerCase()) ||
    c.ratio.toLowerCase().includes(filter.toLowerCase()) ||
    c.citation.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      id="caselaw-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="caselaw-modal-container"
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d121c] border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>Supreme Court Precedents Index</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  Landmark Decisions
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Authoritative judicial rulings shaping NDPS procedure, admissibility, and search standards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close case law modal"
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
              placeholder="Search case name, section, citation or legal ratio (e.g. Baldev Singh, Mohanlal, Section 50)..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#161f2e] text-xs text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-slate-700/80 focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>

        {/* Cases List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No matching case precedents found for "{filter}".
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.title}
                className="rounded-lg bg-[#111827]/70 border border-slate-800/80 p-4 hover:border-slate-700 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-100 italic">{c.title}</span>
                    <span className="text-xs font-mono px-2 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      {c.section}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">({c.citation})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span>{c.court}</span> · <span className="text-slate-300">{c.bench}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                    <strong className="text-teal-300 font-mono text-[11px]">Ratio Decidendi: </strong>
                    {c.ratio}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectQuery(c.sampleQuery);
                    onClose();
                  }}
                  className="sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-teal-950 text-slate-200 hover:text-teal-200 border border-slate-700 hover:border-teal-700 transition-colors cursor-pointer"
                  title="Query this case law in chat"
                >
                  <span>Query Case</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#111827]/80 flex items-center justify-between text-xs text-slate-400">
          <span>Click "Query Case" to inspect complete judicial ratio and statutory application.</span>
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
