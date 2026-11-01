import React, { useState } from 'react';
import { X, ArrowRight, GitBranch, ShieldAlert, FileText, Scale, CheckCircle2, AlertTriangle, HelpCircle, Eye, Globe } from 'lucide-react';
import { CHANCE_RECOVERY_TEMPLATES, translateTemplateToEnglish } from '../server/templates/chanceRecoveryTemplates';
import { INFORMATION_BASED_TEMPLATES, RecoveryTemplate } from '../server/templates/informationBasedTemplates';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

interface StageItem {
  stageNumber: number;
  title: string;
  category: string;
  description: string;
  statutoryReference?: string;
  workflowNote: string;
  caseStatus?: 'DOCUMENTED' | 'NOT FOUND IN CASE MATERIALS' | 'NOT ESTABLISHED' | 'CONFLICTING' | 'REQUIRES VERIFICATION' | 'NOT APPLICABLE';
  hasTemplate?: boolean;
}

const CHANCE_RECOVERY_STAGES: StageItem[] = [
  {
    stageNumber: 1,
    title: "Search / Recovery Memo",
    category: "Source-defined Workflow / Document Checklist",
    description: "Search/recovery memo documenting recovery of narcotic substance and possession.",
    workflowNote: "Included in the supplied investigation workflow as a primary spot documentation stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 2,
    title: "Section 50 NDPS Act Memorandum",
    category: "Statutory Requirement",
    description: "Section 50 NDPS Act memorandum concerning personal/body search.",
    statutoryReference: "NDPS Act, 1985, Section 50(1)",
    workflowNote: "Mandatory statutory safeguard where personal bodily search of a suspect is conducted.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 3,
    title: "Personal Search Memo of Police-Party Personnel",
    category: "Departmental / Procedural Practice",
    description: "Personal/body search memo of police-party personnel prior to conducting suspect search.",
    workflowNote: "Included in the supplied investigation workflow as an evidentiary fairness practice.",
    caseStatus: "REQUIRES VERIFICATION",
    hasTemplate: true
  },
  {
    stageNumber: 4,
    title: "Personal Search Memo of Accused Persons",
    category: "Source-defined Workflow / Document Checklist",
    description: "Personal/body search memo of accused persons, recovery and possession.",
    workflowNote: "Documents personal belongings and items found on the accused person.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 5,
    title: "Rukka (Spot Field Report)",
    category: "Departmental / Procedural Practice",
    description: "Rukka prepared at the spot detailing recovery facts and dispatched to police station.",
    workflowNote: "Police documentation practice initiating formal FIR registration.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 6,
    title: "Site Plan / Sketch Without Scale",
    category: "Departmental / Procedural Practice",
    description: "Site plan or spot sketch without scale depicting recovery location and surroundings.",
    workflowNote: "Included in the supplied investigation workflow for spot orientation.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 7,
    title: "Witness Statements",
    category: "Source-defined Workflow / Document Checklist",
    description: "Statements of independent panch witnesses and police witnesses recorded under CrPC/BNSS.",
    workflowNote: "Records oral testimony supporting the recovery sequence.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 8,
    title: "Interrogation of Accused Persons",
    category: "Departmental / Procedural Practice",
    description: "Interrogation report and disclosure statements of accused persons.",
    workflowNote: "Investigative inquiry documentation.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 9,
    title: "Arrest Memo / Section 35(3) BNSS Notice",
    category: "Statutory Requirement",
    description: "Arrest of accused and arrest information; alternatively Section 35(3) BNSS notice where the source workflow specifies the small-quantity scenario.",
    statutoryReference: "BNSS Section 35(3) / CrPC Arrest Provisions",
    workflowNote: "Conditional application: Section 35(3) BNSS notice applies specifically where the source workflow specifies the small-quantity scenario.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 10,
    title: "Medical Examination & Samples Application",
    category: "Departmental / Procedural Practice",
    description: "Medical examination of accused and application for blood/urine samples where applicable.",
    workflowNote: "Included in the supplied investigation workflow.",
    caseStatus: "NOT ESTABLISHED",
    hasTemplate: true
  },
  {
    stageNumber: 11,
    title: "Production Before SHO & Section 55 Certificate",
    category: "Statutory Requirement",
    description: "Production before Station House Officer with seized narcotic substance, resealing and Section 55 NDPS Act resealing certificate.",
    statutoryReference: "NDPS Act, 1985, Section 55",
    workflowNote: "Ensures safe custody in Malkhana and joint station sealing.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 12,
    title: "Locking Accused in Police Lock-up",
    category: "Departmental / Procedural Practice",
    description: "Locking/placing accused in police lock-up pursuant to formal arrest.",
    workflowNote: "Custodial procedure following arrest and SHO production.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 13,
    title: "Section 52A NDPS Act Application",
    category: "Judicial Process",
    description: "Section 52A NDPS Act application concerning photographs and certification/authentication of samples.",
    statutoryReference: "NDPS Act, 1985, Section 52A",
    workflowNote: "Judicial inventory certification and representative sampling process.",
    caseStatus: "CONFLICTING",
    hasTemplate: true
  },
  {
    stageNumber: 14,
    title: "Section 57 NDPS Act Report to Supervisory Officer",
    category: "Statutory Requirement",
    description: "Section 57 NDPS Act information to the supervisory officer within 48 hours of arrest/seizure.",
    statutoryReference: "NDPS Act, 1985, Section 57",
    workflowNote: "Mandatory supervisory reporting provision.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  }
];

const INFORMATION_BASED_STAGES: StageItem[] = [
  {
    stageNumber: 1,
    title: "Pre-Search Information & Authorization (Sec 42(2) & 41(1))",
    category: "Statutory Requirement",
    description: "On receiving information regarding narcotic/drug substance: Section 42(2) NDPS Act information step & Section 41(1) NDPS Act authorization/application step. (Additional Information-Based Recovery Stage).",
    statutoryReference: "NDPS Act, 1985, Section 42(2) & Section 41(1)",
    workflowNote: "Additional pre-search information-based recovery stage (not present in chance recovery).",
    caseStatus: "NOT APPLICABLE",
    hasTemplate: true
  },
  {
    stageNumber: 2,
    title: "Personal Search Memo of Police-Party Personnel",
    category: "Departmental / Procedural Practice",
    description: "Personal/body search memo of police-party personnel.",
    workflowNote: "Common downstream stage.",
    caseStatus: "REQUIRES VERIFICATION",
    hasTemplate: true
  },
  {
    stageNumber: 3,
    title: "Vehicle / House Search Memo",
    category: "Source-defined Workflow / Document Checklist",
    description: "Search memo of vehicle/house/etc. documenting accused, recovery and possession.",
    workflowNote: "Documents premises or vehicle search (Note: Section 50 does not automatically apply to vehicle/house searches).",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 4,
    title: "Section 50 NDPS Act Personal/Body Search Memorandum",
    category: "Statutory Requirement",
    description: "Section 50 NDPS Act personal/body search memorandum.",
    statutoryReference: "NDPS Act, 1985, Section 50",
    workflowNote: "Mandatory where personal bodily search of suspect is conducted.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 5,
    title: "Personal Search Memo of Accused Persons",
    category: "Source-defined Workflow / Document Checklist",
    description: "Personal/body search memo of accused persons, recovery and possession.",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 6,
    title: "Rukka (Spot Field Report)",
    category: "Departmental / Procedural Practice",
    description: "Rukka dispatched to police station.",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 7,
    title: "Site Plan / Sketch Without Scale",
    category: "Departmental / Procedural Practice",
    description: "Site plan/sketch without scale.",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 8,
    title: "Witness Statements",
    category: "Source-defined Workflow / Document Checklist",
    description: "Witness statements recorded.",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 9,
    title: "Interrogation of Accused Persons",
    category: "Departmental / Procedural Practice",
    description: "Interrogation of accused persons.",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 10,
    title: "Arrest Memo / Section 35(3) BNSS Notice",
    category: "Statutory Requirement",
    description: "Arrest/arrest information or Section 35(3) BNSS notice where the workflow specifies the small-quantity scenario.",
    statutoryReference: "BNSS Section 35(3)",
    workflowNote: "Conditional application in small-quantity scenario.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 11,
    title: "Medical Examination & Samples Application",
    category: "Departmental / Procedural Practice",
    description: "Medical examination and application for blood/urine samples.",
    workflowNote: "Common downstream stage.",
    caseStatus: "NOT ESTABLISHED",
    hasTemplate: true
  },
  {
    stageNumber: 12,
    title: "Production Before SHO & Section 55 Certificate",
    category: "Statutory Requirement",
    description: "Production before SHO with seized narcotic substance, resealing and Section 55 NDPS Act resealing certificate.",
    statutoryReference: "NDPS Act, 1985, Section 55",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 13,
    title: "Locking Accused in Police Lock-up",
    category: "Departmental / Procedural Practice",
    description: "Locking/placing accused in police lock-up.",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  },
  {
    stageNumber: 14,
    title: "Section 52A NDPS Act Application",
    category: "Judicial Process",
    description: "Section 52A NDPS Act application concerning photographs and certification/authentication of samples.",
    statutoryReference: "NDPS Act, 1985, Section 52A",
    workflowNote: "Common downstream stage.",
    caseStatus: "CONFLICTING",
    hasTemplate: true
  },
  {
    stageNumber: 15,
    title: "Section 57 NDPS Act Report to Supervisory Officer",
    category: "Statutory Requirement",
    description: "Section 57 NDPS Act information to supervisory officer.",
    statutoryReference: "NDPS Act, 1985, Section 57",
    workflowNote: "Common downstream stage.",
    caseStatus: "DOCUMENTED",
    hasTemplate: true
  }
];

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery
}) => {
  const [activeTab, setActiveTab] = useState<'chance' | 'info' | 'compare'>('chance');
  const [selectedTemplate, setSelectedTemplate] = useState<RecoveryTemplate | null>(null);
  const [isTranslated, setIsTranslated] = useState<boolean>(false);

  if (!isOpen) return null;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'DOCUMENTED':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">DOCUMENTED</span>;
      case 'CONFLICTING':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">CONFLICTING</span>;
      case 'NOT ESTABLISHED':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">NOT ESTABLISHED</span>;
      case 'REQUIRES VERIFICATION':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">REQUIRES VERIFICATION</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{status || 'N/A'}</span>;
    }
  };

  return (
    <div
      id="workflow-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="workflow-modal-container"
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d121c] border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111827]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <GitBranch className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>NDPS Investigation Document Workflows & Source Templates</span>
              </h2>
              <p className="text-xs text-slate-400">
                Chance Recovery (14 Templates) vs Information-Based Recovery (15 Stages)
              </p>
            </div>
          </div>

          {/* Workflow Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('chance')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'chance'
                  ? 'bg-teal-950 text-teal-200 border border-teal-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chance Recovery (14)
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-teal-950 text-teal-200 border border-teal-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Information-Based (15)
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'compare'
                  ? 'bg-teal-950 text-teal-200 border border-teal-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Compare Workflows
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors absolute top-4 right-4 sm:static"
            aria-label="Close workflow modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'compare' ? (
            <div className="space-y-6 text-sm text-slate-300">
              <div className="p-4 rounded-lg bg-[#111827] border border-slate-800 space-y-3">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-400" />
                  <span>Workflow Comparison Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Both workflows share 13 common downstream execution and documentation stages once search or interception occurs. They differ primarily in the pre-search intelligence and authorization prerequisites.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <h4 className="font-medium text-teal-300 text-xs mb-2">Chance Recovery Workflow (14 Stages & Source Templates)</h4>
                    <ul className="text-xs space-y-1.5 text-slate-300">
                      <li>• Initiated upon spot interception or unexpected discovery.</li>
                      <li>• Starts directly with Search/Recovery Memo (Stage 1).</li>
                      <li>• No prior Section 42(2) recording required.</li>
                      <li>• Linked to all 14 official source templates from <code className="text-teal-400">templateof ndps</code>.</li>
                    </ul>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          onSelectQuery("Give me the chance recovery document checklist.");
                          onClose();
                        }}
                        className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Query Chance Recovery Workflow</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <h4 className="font-medium text-teal-300 text-xs mb-2">Information-Based Recovery Workflow (15 Stages)</h4>
                    <ul className="text-xs space-y-1.5 text-slate-300">
                      <li>• Initiated pursuant to prior actionable intelligence.</li>
                      <li>• Starts with pre-search Sec 42(2) & Sec 41(1) authorization (Stage 1).</li>
                      <li>• Includes dedicated vehicle/house search memo stage.</li>
                      <li>• Shares 13 downstream stages with chance recovery.</li>
                    </ul>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          onSelectQuery("Information based recovery mein kaun kaun se documents prepare hote hain?");
                          onClose();
                        }}
                        className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Query Information-Based Workflow</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              <div className="text-xs text-slate-400 pb-1 flex items-center justify-between">
                <span>
                  Showing {activeTab === 'chance' ? '14-Stage Chance Recovery (with Source Templates)' : '15-Stage Information-Based Recovery'} Workflow with Case-Aware Document Status:
                </span>
                <span className="font-mono text-teal-300">Case-Grounded & Source-Authenticated</span>
              </div>

              {(activeTab === 'chance' ? CHANCE_RECOVERY_STAGES : INFORMATION_BASED_STAGES).map((st) => (
                <div
                  key={st.stageNumber}
                  className="rounded-lg bg-[#111827]/70 border border-slate-800/80 p-4 hover:border-slate-700 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-md bg-teal-950 text-teal-300 font-mono text-xs font-semibold flex items-center justify-center shrink-0 border border-teal-800/60 mt-0.5">
                      {st.stageNumber}
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-100">{st.title}</span>
                        <span className="text-xs font-mono px-2 py-0.2 rounded bg-slate-800 text-teal-300 border border-slate-700">
                          {st.category}
                        </span>
                        {getStatusBadge(st.caseStatus)}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          SOURCE TEMPLATE AVAILABLE
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {st.description}
                      </p>
                      <div className="pt-1 text-[11px] text-slate-400 flex flex-col gap-1">
                        <div>
                          <strong className="text-slate-300">Workflow Note: </strong>
                          {st.workflowNote}
                        </div>
                        {st.statutoryReference && (
                          <div className="flex items-center gap-1.5 text-teal-400/90 font-mono text-[10px]">
                            <Scale className="w-3 h-3" aria-hidden="true" />
                            <span>Reference: {st.statutoryReference}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    {st.hasTemplate && (
                      <button
                        onClick={() => {
                          const tmpl = activeTab === 'chance'
                            ? CHANCE_RECOVERY_TEMPLATES[st.stageNumber - 1]
                            : INFORMATION_BASED_TEMPLATES[st.stageNumber - 1];
                          if (tmpl) {
                            setSelectedTemplate(tmpl);
                            setIsTranslated(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-teal-950 hover:bg-teal-900 text-teal-200 border border-teal-800 transition-colors cursor-pointer"
                        title="View exact source document template"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View Source Template</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectQuery(`Explain stage ${st.stageNumber} of the ${activeTab === 'chance' ? 'chance recovery' : 'information-based recovery'} workflow.`);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                      title="Query this workflow stage in chat"
                    >
                      <span>Query Stage</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#111827]/80 flex items-center justify-between text-xs text-slate-400">
          <span>Source-defined workflow checklist aligned with NDPS statutory safeguards and case evidence.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Template Viewer Modal */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[85vh] bg-[#0d121c] border border-teal-500/50 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Template Modal Header */}
            <div className="p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  SOURCE TEMPLATE #{selectedTemplate.sequence}
                </span>
                <h3 className="text-sm font-semibold text-slate-100">{selectedTemplate.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTranslated(!isTranslated)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    isTranslated
                      ? 'bg-blue-950 text-blue-200 border-blue-800'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Toggle English Translation"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isTranslated ? 'Showing English Translation' : 'Translate to English'}</span>
                </button>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Template Provenance & Details Bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-3">
                <span>Source: <strong className="text-teal-300 font-mono">{selectedTemplate.sourceDocument}</strong></span>
                <span>•</span>
                <span>Page: <strong className="text-teal-300 font-mono">Page {selectedTemplate.sourcePage}</strong></span>
              </div>
              <span className="text-[11px] text-amber-400/90 font-mono">SOURCE TEMPLATE — UNCHANGED</span>
            </div>

            {/* Template Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-slate-200 bg-[#090d16]">
              {isTranslated ? (
                <div className="whitespace-pre-wrap font-sans text-sm text-slate-300 space-y-4">
                  <div className="p-3 rounded bg-blue-950/40 border border-blue-900 text-blue-200 text-xs">
                    TRANSLATED VERSION — SOURCE TEMPLATE REMAINS UNCHANGED (Original Hindi source template remains authoritative).
                  </div>
                  <pre className="template-code p-4 rounded-xl bg-[#0e1422] border border-slate-800 text-slate-200 text-[13.5px] sm:text-[14px]">
                    {translateTemplateToEnglish(selectedTemplate)}
                  </pre>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800">
                  <pre className="template-code text-slate-200 text-[13.5px] sm:text-[14px]">
                    {selectedTemplate.content}
                  </pre>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-800 font-sans text-xs text-slate-400">
                <strong className="text-slate-300">Fields & Placeholders Present:</strong>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedTemplate.fields.map((f, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Modal Footer */}
            <div className="p-3.5 bg-[#111827] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Template extracted directly from authoritative DOCX source.</span>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Close Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
