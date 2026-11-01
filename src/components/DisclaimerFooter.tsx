import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer id="ndps-disclaimer-footer" className="bg-slate-950 border-t border-slate-800/80 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-start gap-2.5 text-slate-400 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300 font-semibold">Official Notice: </strong>
          This assistant provides answers based only on the supplied NDPS training reference material. It does not replace legal advice, judicial interpretation, or official departmental instructions.
        </p>
      </div>
    </footer>
  );
};
