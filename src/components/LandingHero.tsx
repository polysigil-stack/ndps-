import React from 'react';
import { Logo } from './Logo';

interface LandingHeroProps {
  onSelectQuery: (query: string) => void;
  children?: React.ReactNode;
  attachedCaseTitle?: string | null;
  onOpenCaseModal?: () => void;
}

const CASE_QUESTIONS = [
  {
    label: 'Case Investigation Review',
    query: 'Give me a case summary.'
  },
  {
    label: 'Documented Procedural Steps',
    query: 'What procedural steps are documented in this case?'
  },
  {
    label: 'Not Established Procedures',
    query: 'Which procedures are not established?'
  },
  {
    label: 'Quantity & Conflicts Check',
    query: 'Are the quantities consistent?'
  },
  {
    label: 'Investigation Timeline',
    query: 'Give me the investigation timeline.'
  },
  {
    label: 'Verification Prompts',
    query: 'What should be verified?'
  },
  {
    label: 'Section 50 vs Case',
    query: 'Compare the Section 50 requirements with this case.'
  },
  {
    label: 'FSL Dispatch Status',
    query: 'Was FSL dispatch completed?'
  }
];

const QUICK_QUESTIONS = [
  {
    label: 'Section 50 safeguards',
    query: 'What are the procedural safeguards under Section 50 of the NDPS Act for search of a person?'
  },
  {
    label: 'Section 42 requirements',
    query: 'Explain Section 42 search requirements, recording of information, and Karnail Singh compliance.'
  },
  {
    label: 'Section 52A procedure',
    query: 'What is the Section 52A procedure for inventory and sample certification before a Magistrate?'
  },
  {
    label: 'Search & seizure',
    query: 'Explain the mandatory procedure for search and seizure of conveyance and premises under NDPS.'
  }
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectQuery,
  children,
  attachedCaseTitle,
  onOpenCaseModal
}) => {
  const suggestions = attachedCaseTitle ? CASE_QUESTIONS : QUICK_QUESTIONS;

  return (
    <div
      id="landing-hero-container"
      className="w-full max-w-[760px] mx-auto px-4 flex flex-col items-center text-center select-none"
    >
      {/* Brand & Identity */}
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="mb-0.5">
          <Logo size="lg" collapsed={true} showSubtitle={false} />
        </div>

        <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-[#ECECEC] font-sans">
          NDPS Intelligence
        </h1>

        <p className="text-xs sm:text-[13px] text-[#B4B4B4] font-normal">
          {attachedCaseTitle ? (
            <span>
              Case Context Loaded: <strong className="text-[#ECECEC] font-medium">{attachedCaseTitle}</strong>. Ask about this FIR or NDPS law.
            </span>
          ) : (
            <span>Ask about NDPS investigation knowledge or attach a case FIR.</span>
          )}
        </p>
      </div>

      {/* Primary Search Input */}
      <div className="w-full mb-4">
        {children}
      </div>

      {/* Compact Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuery(item.query)}
            className="px-3 py-1.5 text-xs font-normal text-[#B4B4B4] bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#3A3A3A] hover:text-[#ECECEC] rounded-md transition-colors cursor-pointer text-center"
            title={`Ask: ${item.query}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

