import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Shield, Truck, Scale, Plus, Trash2, Sparkles, Layers, FileCheck, ClipboardList, HelpCircle, Package, ArrowLeftRight, Search, GitFork, ListChecks, ShieldAlert } from 'lucide-react';
import { CaseDetails, CaseDocumentItem, CaseInvestigationAnalysis } from '../types';
import { EvidenceDashboard } from './EvidenceDashboard';
import { ParcelDashboard } from './ParcelDashboard';
import { WeightReconciliationDashboard } from './WeightReconciliationDashboard';
import { Section52AComparisonView } from './Section52AComparisonView';
import { SealsAndSamplesView } from './SealsAndSamplesView';
import { ExecutiveSummaryView } from './ExecutiveSummaryView';
import { InvestigationChecklistView } from './InvestigationChecklistView';
import { ConflictsWorkspaceView } from './ConflictsWorkspaceView';
import { VerificationWorkspaceView } from './VerificationWorkspaceView';
import { DocumentComparisonView } from './DocumentComparisonView';
import { EvidenceGraphView } from './EvidenceGraphView';
import { CaseSearchWorkspace } from './CaseSearchWorkspace';

interface CaseContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseDetails: CaseDetails | null;
  cases?: CaseDetails[];
  onSelectCase?: (caseId: string | null) => void;
  isAttached: boolean;
  onToggleAttach: () => void;
  onSelectPrompt: (prompt: string) => void;
  onAddDocument?: (doc: { filename: string; docType: string; rawText?: string; pages?: number }) => Promise<void>;
  onRemoveDocument?: (docId: string) => Promise<void>;
}

export const CaseContextModal: React.FC<CaseContextModalProps> = ({
  isOpen,
  onClose,
  caseDetails,
  cases,
  onSelectCase,
  isAttached,
  onToggleAttach,
  onSelectPrompt,
  onAddDocument,
  onRemoveDocument
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'checklist'
    | 'conflicts_workspace'
    | 'verification_workspace'
    | 'comparison'
    | 'graph'
    | 'search'
    | 'review'
    | 'parcels'
    | 'weights'
    | 'section52a'
    | 'seals'
    | 'evidence'
    | 'documents'
    | 'steps'
    | 'conflicts'
    | 'gaps'
  >('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocType, setNewDocType] = useState('Seizure Memo');
  const [newDocFilename, setNewDocFilename] = useState('');
  const [newDocPages, setNewDocPages] = useState(1);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [analysisData, setAnalysisData] = useState<CaseInvestigationAnalysis | null>(null);

  useEffect(() => {
    if (isOpen && caseDetails?.case_id) {
      fetch(`/api/cases/${caseDetails.case_id}/analysis`)
        .then(res => res.json())
        .then(data => {
          if (data.analysis) {
            setAnalysisData(data.analysis);
          }
        })
        .catch(err => console.warn('Could not fetch structured analysis:', err));
    }
  }, [isOpen, caseDetails?.case_id]);

  const [showDemoRecords, setShowDemoRecords] = useState(false);

  if (!isOpen) return null;

  const isFixtureRecord = (c: CaseDetails) => {
    if (c.is_fixture === true) return true;
    if (c.record_type === 'demo' || c.record_type === 'test') return true;
    if (c.case_id === 'case_batathu_hp72d3928' || c.case_id.startsWith('interactive_test_') || c.case_id.includes('test_')) return true;
    return false;
  };

  if (!caseDetails) {
    const allCases = cases || [];
    const realCases = allCases.filter(c => !isFixtureRecord(c));
    const demoCases = allCases.filter(c => isFixtureRecord(c));

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className="bg-[#212121] border border-[#3A3A3A] rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden text-[#ECECEC]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
        >
          <div className="p-4 border-b border-[#3A3A3A] bg-[#171717] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-[#8E8E8E]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 id="case-modal-title" className="text-sm font-semibold text-[#ECECEC]">
                  Select Investigation Case
                </h3>
                <p className="text-[11px] text-[#8E8E8E]">
                  Attach a case record to inspect evidence, conflicts, and legal scorecards.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
            <div
              onClick={() => {
                if (onSelectCase) onSelectCase(null);
                onClose();
              }}
              className="p-3.5 bg-[#2A2A2A] hover:bg-[#333333] border border-[#3A3A3A] rounded-xl cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-[#ECECEC]">Start New / Interactive Investigation</div>
                <div className="text-[11px] text-[#B4B4B4] mt-0.5">Proceed with clean state (0 inherited facts or documents)</div>
              </div>
              <span className="text-xs font-medium text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">Clean State</span>
            </div>

            {realCases.length > 0 ? (
              <div className="pt-2 space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8E8E8E]">
                  User Investigation Cases ({realCases.length})
                </div>
                <div className="space-y-2">
                  {realCases.map((c) => (
                    <div
                      key={c.case_id}
                      onClick={() => {
                        if (onSelectCase) onSelectCase(c.case_id);
                        onClose();
                      }}
                      className="p-3.5 bg-[#171717] hover:bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#ECECEC]">{c.case_title || `Case ${c.fir_details?.fir_number || c.case_id}`}</div>
                        <div className="text-[11px] text-[#B4B4B4] mt-0.5">
                          {c.fir_details?.police_station ? `PS ${c.fir_details.police_station}` : 'Case Record'} • {c.documents?.length || 1} document(s)
                        </div>
                      </div>
                      <span className="text-xs text-[#ECECEC] hover:underline font-medium">Select & Attach →</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#171717] border border-[#3A3A3A] rounded-xl text-center space-y-2">
                <div className="text-xs font-semibold text-[#ECECEC]">No investigation cases yet</div>
                <div className="text-[11px] text-[#8E8E8E]">
                  No user-created investigation cases found. Start a new investigation or upload an FIR to create your first case record.
                </div>
                <button
                  onClick={() => {
                    if (onSelectCase) onSelectCase(null);
                    onClose();
                  }}
                  className="mt-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Start New Investigation
                </button>
              </div>
            )}

            {demoCases.length > 0 && (
              <div className="pt-3 border-t border-[#3A3A3A] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8E8E8E]">
                      Demo & Test Records ({demoCases.length})
                    </div>
                    <div className="text-[10.5px] text-[#8E8E8E]">
                      Pre-loaded benchmark cases and test fixtures for system demonstration
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDemoRecords(!showDemoRecords)}
                    className="text-xs text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    {showDemoRecords ? 'Hide Demo Records' : 'Show Demo Records →'}
                  </button>
                </div>

                {showDemoRecords && (
                  <div className="space-y-2 mt-2">
                    {demoCases.map((c) => (
                      <div
                        key={c.case_id}
                        onClick={() => {
                          if (onSelectCase) onSelectCase(c.case_id);
                          onClose();
                        }}
                        className="p-3 bg-[#171717] hover:bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#ECECEC] flex items-center gap-2">
                            <span>{c.case_title || `Case ${c.fir_details?.fir_number || c.case_id}`}</span>
                            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-medium">
                              {c.record_type === 'demo' ? 'Demo Fixture' : 'Test Record'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#B4B4B4] mt-0.5">
                            {c.fir_details?.police_station ? `PS ${c.fir_details.police_station}` : 'Fixture Record'} • {c.documents?.length || 1} document(s)
                          </div>
                        </div>
                        <span className="text-xs text-[#ECECEC] hover:underline font-medium">Select & Attach →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isBatathu = caseDetails.case_id === 'case_batathu_hp72d3928';
  const firNumber = caseDetails.fir_details?.fir_number || (isBatathu ? '24/2024' : 'Not Specified');
  const policeStation = caseDetails.fir_details?.police_station || (isBatathu ? 'Batathu' : 'Not Specified');
  const district = caseDetails.fir_details?.district || (isBatathu ? 'Kangra' : 'Not Specified');
  const sections = (caseDetails.fir_details?.sections && caseDetails.fir_details.sections.length > 0)
    ? caseDetails.fir_details.sections
    : (isBatathu ? ['Section 15 NDPS Act', 'Section 25 NDPS Act'] : ['NDPS Act']);
  const ioName = caseDetails.fir_details?.investigating_officer || (isBatathu ? 'ASI Nirmal Patial' : 'Not Specified');
  const vehicleType = caseDetails.vehicle?.type || (isBatathu ? 'Canter' : 'Not Specified');
  const vehicleReg = caseDetails.vehicle?.registration_number || (isBatathu ? 'HP72D-3928' : 'Not Specified');
  const seizureSubstance = caseDetails.seizure?.substance || (isBatathu ? 'Suspected Poppy Husk (Bhukki)' : 'Not Specified');
  const seizureBags = caseDetails.seizure?.bags || (isBatathu ? '4 bags' : 'Not Specified');
  const seizureQty = caseDetails.seizure?.total_quantity || (isBatathu ? '108 kg 900 g' : 'Not Specified');
  const seizurePlace = caseDetails.seizure?.place || (isBatathu ? 'Batathu Naka near Gandhi Suvidha Kendra' : 'Not Specified');
  const proceduralSteps = caseDetails.procedural_steps || [];
  const proceduralGaps = caseDetails.procedural_steps_not_established || [];
  const documents: CaseDocumentItem[] = caseDetails.documents || [
    {
      document_id: 'doc_fir_default',
      document_type: 'FIR',
      title: `FIR No. ${firNumber}`,
      filename: `FIR_${firNumber.replace('/', '_')}.pdf`,
      pages: caseDetails.pages || 3,
      status: 'processed'
    }
  ];
  const conflicts = caseDetails.conflicts || [];

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocFilename.trim() || !onAddDocument) return;

    setIsSubmittingDoc(true);
    try {
      await onAddDocument({
        filename: newDocFilename.trim(),
        docType: newDocType,
        pages: Number(newDocPages) || 1
      });
      setNewDocFilename('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add document:', err);
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#212121] border border-[#3A3A3A] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#ECECEC]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-modal-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#3A3A3A] bg-[#171717] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-[#8E8E8E]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8E8E8E] flex items-center gap-1.5">
                <span>Case Investigation & Evidence Intelligence</span>
                <span className="text-[10px] bg-[#2A2A2A] px-1.5 py-0.2 rounded border border-[#3A3A3A] text-[#B4B4B4]">
                  {documents.length} {documents.length === 1 ? 'doc' : 'docs'}
                </span>
              </div>
              <h3 id="case-modal-title" className="text-sm font-semibold text-[#ECECEC]">
                {caseDetails.case_title || `Case: ${firNumber}`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleAttach}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                isAttached
                  ? 'bg-[#2A2A2A] border-[#8E8E8E] text-[#ECECEC]'
                  : 'bg-[#2F2F2F] border-[#3A3A3A] text-[#B4B4B4] hover:text-[#ECECEC]'
              }`}
            >
              {isAttached ? '✓ Attached to Chat' : '+ Attach to Chat'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#3A3A3A] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3A3A3A] px-4 bg-[#1C1C1C] gap-1 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-2.5 border-b-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'checklist'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>13-Pt Checklist</span>
          </button>
          <button
            onClick={() => setActiveTab('conflicts_workspace')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'conflicts_workspace'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Conflict Workspace</span>
          </button>
          <button
            onClick={() => setActiveTab('verification_workspace')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'verification_workspace'
                ? 'border-blue-400 text-blue-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'comparison'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Compare Docs</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'search'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Case Search</span>
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'graph'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Evidence Graph</span>
          </button>
          <button
            onClick={() => setActiveTab('parcels')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'parcels'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-indigo-400" />
            <span>Parcels (P1–P4)</span>
          </button>
          <button
            onClick={() => setActiveTab('weights')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'weights'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Weight Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('section52a')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'section52a'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sec. 52A Review</span>
          </button>
          <button
            onClick={() => setActiveTab('seals')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'seals'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Seals & Custody</span>
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'evidence'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Evidence Items</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'documents'
                ? 'border-[#ECECEC] text-[#ECECEC]'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <span>Case Documents</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#2A2A2A] text-[10px] text-[#B4B4B4]">
              {documents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'steps'
                ? 'border-[#ECECEC] text-[#ECECEC]'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <span>Timeline</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#2A2A2A] text-[10px] text-[#B4B4B4]">
              {proceduralSteps.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-2.5 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'review'
                ? 'border-[#ECECEC] text-[#ECECEC]'
                : 'border-transparent text-[#8E8E8E] hover:text-[#B4B4B4]'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>18-Point Review</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-[#ECECEC] space-y-4">
          {activeTab === 'overview' && (
            <ExecutiveSummaryView caseId={caseDetails.case_id} onSelectPrompt={onSelectPrompt} />
          )}

          {activeTab === 'checklist' && (
            <InvestigationChecklistView caseId={caseDetails.case_id} />
          )}

          {activeTab === 'conflicts_workspace' && (
            <ConflictsWorkspaceView caseId={caseDetails.case_id} />
          )}

          {activeTab === 'verification_workspace' && (
            <VerificationWorkspaceView caseId={caseDetails.case_id} />
          )}

          {activeTab === 'comparison' && (
            <DocumentComparisonView caseId={caseDetails.case_id} />
          )}

          {activeTab === 'search' && (
            <CaseSearchWorkspace caseId={caseDetails.case_id} onSelectPrompt={onSelectPrompt} />
          )}

          {activeTab === 'graph' && (
            <EvidenceGraphView caseId={caseDetails.case_id} />
          )}

          {activeTab === 'review' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-[12px] text-[#B4B4B4] leading-relaxed">
                <strong className="text-[#ECECEC]">Investigation Review Matrix:</strong> Objective procedural evaluation across 18 NDPS investigation areas, classified into Documented, Not Established, Conflicting, or Requires Verification.
              </div>

              {analysisData?.procedural_review && (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {analysisData.procedural_review.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[#ECECEC] text-[12.5px] flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#3A3A3A] text-[10.5px] flex items-center justify-center text-[#B4B4B4]">
                            {item.category_number}
                          </span>
                          <span>{item.area}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                            item.status === 'DOCUMENTED'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : item.status === 'NOT_ESTABLISHED'
                              ? 'bg-[#212121] border-[#3A3A3A] text-[#8E8E8E]'
                              : item.status === 'CONFLICTING'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[#B4B4B4] text-[11.5px] leading-relaxed">
                        {item.evidence_summary}
                      </p>
                      <div className="flex items-center justify-between text-[10.5px] text-[#8E8E8E] pt-1 border-t border-[#3A3A3A]">
                        <span>Sources: {item.documents.length > 0 ? item.documents.join(', ') : 'None in uploaded container'}</span>
                        {item.verification_prompt && (
                          <button
                            onClick={() => {
                              onSelectPrompt(item.verification_prompt!);
                              onClose();
                            }}
                            className="text-[#ECECEC] hover:underline cursor-pointer"
                          >
                            Verify in Chat →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'parcels' && (
            <div className="h-full">
              <ParcelDashboard
                caseId={caseDetails.case_id}
                onSelectPrompt={p => {
                  onSelectPrompt(p);
                  onClose();
                }}
              />
            </div>
          )}

          {activeTab === 'weights' && (
            <div className="h-full">
              <WeightReconciliationDashboard
                caseId={caseDetails.case_id}
                onSelectPrompt={p => {
                  onSelectPrompt(p);
                  onClose();
                }}
              />
            </div>
          )}

          {activeTab === 'section52a' && (
            <div className="h-full">
              <Section52AComparisonView
                caseId={caseDetails.case_id}
                onSelectPrompt={p => {
                  onSelectPrompt(p);
                  onClose();
                }}
              />
            </div>
          )}

          {activeTab === 'seals' && (
            <div className="h-full">
              <SealsAndSamplesView
                caseId={caseDetails.case_id}
                onSelectPrompt={p => {
                  onSelectPrompt(p);
                  onClose();
                }}
              />
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="h-full">
              <EvidenceDashboard
                caseId={caseDetails.case_id}
                onSelectPrompt={p => {
                  onSelectPrompt(p);
                  onClose();
                }}
              />
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-[#8E8E8E]">
                  All documents attached to active case: <strong>{caseDetails.case_title}</strong>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-2.5 py-1 rounded-lg bg-[#2F2F2F] hover:bg-[#3A3A3A] border border-[#3A3A3A] text-xs text-[#ECECEC] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? 'Cancel' : '+ Add Document'}</span>
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleCreateDocument} className="p-3.5 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] space-y-3">
                  <div className="text-[12px] font-semibold text-[#ECECEC]">
                    Attach New Document to Case
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] text-[#8E8E8E] block mb-1">Document Type</label>
                      <select
                        value={newDocType}
                        onChange={(e) => setNewDocType(e.target.value)}
                        className="w-full bg-[#171717] border border-[#3A3A3A] rounded-lg px-2.5 py-1.5 text-xs text-[#ECECEC] focus:outline-hidden"
                      >
                        <option value="FIR">FIR</option>
                        <option value="Seizure Memo">Seizure Memo</option>
                        <option value="Arrest Memo">Arrest Memo</option>
                        <option value="Personal Search Memo">Personal Search Memo</option>
                        <option value="Recovery Memo">Recovery Memo</option>
                        <option value="Statement">Statement</option>
                        <option value="FSL Report">FSL Report</option>
                        <option value="Site Plan">Site Plan</option>
                        <option value="Malkhana/Property Document">Malkhana/Property Document</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#8E8E8E] block mb-1">Filename / Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Seizure_Memo_Batathu.pdf"
                        value={newDocFilename}
                        onChange={(e) => setNewDocFilename(e.target.value)}
                        required
                        className="w-full bg-[#171717] border border-[#3A3A3A] rounded-lg px-2.5 py-1.5 text-xs text-[#ECECEC] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#8E8E8E] block mb-1">Pages</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={newDocPages}
                        onChange={(e) => setNewDocPages(Number(e.target.value))}
                        className="w-full bg-[#171717] border border-[#3A3A3A] rounded-lg px-2.5 py-1.5 text-xs text-[#ECECEC] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-2.5 py-1 rounded-lg text-xs text-[#8E8E8E] hover:text-[#ECECEC]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingDoc || !newDocFilename.trim()}
                      className="px-3 py-1 rounded-lg bg-[#ECECEC] text-[#212121] font-semibold text-xs hover:bg-white disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingDoc ? 'Processing...' : 'Attach Document'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {documents.map((d) => (
                  <div
                    key={d.document_id}
                    className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-[#171717] border border-[#3A3A3A] flex items-center justify-center text-[#8E8E8E] shrink-0 mt-0.5">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#ECECEC] text-[12.5px]">{d.title || d.document_type}</span>
                          <span className="text-[10px] bg-[#212121] border border-[#3A3A3A] text-[#8E8E8E] px-1.5 py-0.2 rounded font-medium">
                            {d.document_type}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8E8E8E] truncate">
                          File: {d.filename} • {d.pages} {d.pages === 1 ? 'page' : 'pages'} • ID: {d.document_id}
                        </div>
                        {d.extracted_summary && (
                          <p className="text-[11.5px] text-[#B4B4B4] leading-relaxed pt-0.5">
                            {d.extracted_summary}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Processed</span>
                      </span>
                      {onRemoveDocument && documents.length > 1 && (
                        <button
                          onClick={() => onRemoveDocument(d.document_id)}
                          className="p-1 rounded text-[#8E8E8E] hover:text-red-400 hover:bg-[#3A3A3A] transition-colors cursor-pointer"
                          title="Remove document from case"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8E8E8E]">
                All {proceduralSteps.length} documented procedural steps combined across FIR, Seizure Memo, Arrest Memo, and FSL Report:
              </div>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {proceduralSteps.map((s) => (
                  <div
                    key={s.step_number}
                    className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#3A3A3A] text-[#ECECEC] text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {s.step_number}
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#ECECEC] text-[12.5px]">{s.step}</span>
                        <span className="text-[10px] text-[#8E8E8E] bg-[#212121] px-2 py-0.5 rounded border border-[#3A3A3A]">
                          {s.source_document || 'Case Record'} • Page {s.page}
                        </span>
                      </div>
                      <p className="text-[#B4B4B4] text-[12px] leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'conflicts' && (
            <div className="space-y-3">
              {conflicts.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[12px]">
                    <strong>Conflict Detection Principle:</strong> When case records contain differing details (e.g. quantity or vehicle registration), NDPS Intelligence objectively reports the difference without deciding which record is correct.
                  </div>
                  {conflicts.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[12.5px]">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Discrepancy: {c.field}</span>
                      </div>
                      <p className="text-[#B4B4B4] text-[12px]">{c.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {c.documents.map((d, dIdx) => (
                          <div key={dIdx} className="p-2 rounded bg-[#212121] border border-[#3A3A3A] text-[11.5px]">
                            <span className="text-[#8E8E8E] font-medium">{d.document_type}:</span>{' '}
                            <span className="text-[#ECECEC] font-semibold">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <div className="text-sm font-semibold text-[#ECECEC]">No Cross-Document Discrepancies</div>
                  <p className="text-[#8E8E8E] text-[12px] max-w-md mx-auto">
                    The facts recorded in the FIR, Seizure Memo, Personal Search Memo, Arrest Memo, and FSL Report are completely consistent regarding contraband quantity (108.9 kg), vehicle registration (HP72D-3928), and accused persons (Manoj Kumar & Rajesh Kumar).
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gaps' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-[#B4B4B4] text-[12px] leading-relaxed">
                <strong className="text-[#ECECEC]">Absence vs. Non-Performance Rule:</strong> The absence of a procedure in an initial document does not prove it was not done. It simply indicates that proof of the step is not established from the currently available case records.
              </div>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {proceduralGaps.map((n, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#8E8E8E] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#ECECEC] text-[12.5px]">{n.step}</div>
                      <p className="text-[#8E8E8E] text-[12px] leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#3A3A3A] bg-[#171717] flex items-center justify-between">
          <span className="text-[11px] text-[#8E8E8E]">
            Multi-Document Case Context • {documents.length} Documents Attached
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSelectPrompt('Give me a case summary.');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#ECECEC] text-[#212121] hover:bg-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Case Summary</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#ECECEC] text-xs font-medium border border-[#3A3A3A] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
