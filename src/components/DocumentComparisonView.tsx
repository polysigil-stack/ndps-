import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, FileText, SplitSquareVertical } from 'lucide-react';
import { DocumentComparisonResult, CaseDocumentItem } from '../types';

interface DocumentComparisonViewProps {
  caseId: string;
}

export const DocumentComparisonView: React.FC<DocumentComparisonViewProps> = ({ caseId }) => {
  const [docAId, setDocAId] = useState('doc_687');
  const [docBId, setDocBId] = useState('doc_688');
  const [comparison, setComparison] = useState<DocumentComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<CaseDocumentItem[]>([]);

  useEffect(() => {
    fetch(`/api/cases/${caseId}/documents`)
      .then(res => res.json())
      .then(res => {
        if (res.documents) {
          setDocuments(res.documents);
        }
      })
      .catch(err => console.error('Error loading documents list:', err));
  }, [caseId]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cases/${caseId}/compare-documents?docA=${docAId}&docB=${docBId}`)
      .then(res => res.json())
      .then(res => {
        if (res.comparison) {
          setComparison(res.comparison);
        }
      })
      .catch(err => console.error('Error fetching document comparison:', err))
      .finally(() => setLoading(false));
  }, [caseId, docAId, docBId]);

  const getFieldBadge = (status: string) => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-700/50">
            <CheckCircle2 className="w-3 h-3" />
            Match
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 text-amber-400 border border-amber-700/50">
            <AlertTriangle className="w-3 h-3" />
            Conflict
          </span>
        );
      case 'ONLY_IN_DOCUMENT_A':
      case 'ONLY_IN_DOCUMENT_B':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2A2A2A] text-[#8E8E8E] border border-[#3A3A3A]">
            Single Source
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2A2A2A] text-[#8E8E8E]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Selector Controls */}
      <div className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider mb-1">
            Document A
          </label>
          <select
            value={docAId}
            onChange={e => setDocAId(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-xs text-[#ECECEC] focus:outline-none focus:border-indigo-500"
          >
            {documents.map(d => (
              <option key={d.document_id} value={d.document_id}>
                {d.title || d.filename} ({d.document_type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center p-2 rounded-lg bg-[#2A2A2A] text-[#8E8E8E] shrink-0">
          <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider mb-1">
            Document B
          </label>
          <select
            value={docBId}
            onChange={e => setDocBId(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-xs text-[#ECECEC] focus:outline-none focus:border-indigo-500"
          >
            {documents.map(d => (
              <option key={d.document_id} value={d.document_id}>
                {d.title || d.filename} ({d.document_type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-sm text-[#8E8E8E]">
          Comparing documents field-by-field...
        </div>
      ) : comparison ? (
        <div className="space-y-4">
          {/* Header Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#1F1F1F] border border-[#333333]">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Document A</div>
              <h4 className="text-xs font-semibold text-[#ECECEC] mt-0.5">{comparison.doc_a.document_name}</h4>
              <p className="text-[11px] text-[#8E8E8E]">Type: {comparison.doc_a.document_type} • Pages: {comparison.doc_a.pages}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#1F1F1F] border border-[#333333]">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Document B</div>
              <h4 className="text-xs font-semibold text-[#ECECEC] mt-0.5">{comparison.doc_b.document_name}</h4>
              <p className="text-[11px] text-[#8E8E8E]">Type: {comparison.doc_b.document_type} • Pages: {comparison.doc_b.pages}</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="rounded-xl border border-[#3A3A3A] overflow-hidden bg-[#222222]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#3A3A3A] bg-[#1A1A1A] text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
                    <th className="p-3 w-1/4">Field / Parameter</th>
                    <th className="p-3 w-1/3">Value in Document A</th>
                    <th className="p-3 w-1/3">Value in Document B</th>
                    <th className="p-3 text-right">Alignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D2D]">
                  {comparison.fields.map((field, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#282828] transition-colors ${
                        field.status === 'CONFLICT' ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      <td className="p-3 font-medium text-[#ECECEC] align-top">
                        <div>{field.field_name}</div>
                        {field.difference && (
                          <div className="font-mono text-[10px] text-amber-400 font-bold mt-0.5">
                            Δ {field.difference}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-[#CCCCCC] align-top font-mono text-[11px]">
                        {field.value_a}
                      </td>
                      <td className="p-3 text-[#CCCCCC] align-top font-mono text-[11px]">
                        {field.value_b}
                        {field.notes && (
                          <div className="font-sans text-[11px] text-amber-400 mt-1 italic">
                            {field.notes}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right align-top whitespace-nowrap">
                        {getFieldBadge(field.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-[#8E8E8E]">
          Select two documents above to compare them side-by-side.
        </div>
      )}
    </div>
  );
};
