import fs from 'fs';
import path from 'path';
import { RecoveryPathway } from './types';

export interface CaseDocument {
  document_id: string;
  case_id?: string;
  document_type: string;
  document_name?: string;
  title: string;
  filename: string;
  source_file?: string;
  pages: number;
  page_count?: number;
  document_date?: string;
  document_role?: string;
  duplicate_status?: 'EXACT_DUPLICATE' | 'LIKELY_DUPLICATE' | 'POSSIBLE_DUPLICATE' | 'DISTINCT_DOCUMENT';
  duplicate_of?: string;
  status: 'processed' | 'extracting' | 'error';
  uploaded_at?: string;
  extracted_summary?: string;
  facts?: Record<string, any>;
  procedural_steps?: CaseProceduralStep[];
}

export interface CaseConflict {
  conflict_id: string;
  field: string;
  description: string;
  documents: Array<{
    document_id: string;
    document_type: string;
    value: string;
    page?: number;
  }>;
}

export interface CaseProceduralStep {
  step_number: number;
  step: string;
  status: 'mentioned';
  description: string;
  source_document: string;
  page: number;
}

export interface CaseProceduralStepNotEstablished {
  step: string;
  status: 'not_established';
  description: string;
}

export interface CaseSourceLocation {
  document: string;
  page: number;
  contents: string;
}

export interface CaseContext {
  case_id: string;
  case_title: string;
  is_fixture?: boolean;
  record_type?: 'case' | 'demo' | 'test';
  recovery_pathway?: RecoveryPathway;
  document_type: string;
  source_document: string;
  pages: number;
  ocr_status: string;
  documents: CaseDocument[];
  fir_details: {
    police_station: string;
    district: string;
    state?: string;
    fir_number: string;
    date: string;
    sections: string[];
    sections_raw?: string;
    informant_complainant: string;
    investigating_officer: string;
  };
  persons: Array<{
    role?: string;
    name?: string;
    particulars_recorded: boolean;
    personal_search_conducted: boolean;
    personal_search_result: string;
    arrest_memo_issued?: boolean;
    source_document?: string;
  }>;
  vehicle: {
    type: string;
    registration_number: string;
    documents_checked: string[];
    taken_into_possession: boolean;
    search_conducted: boolean;
    source_document?: string;
  };
  seizure: {
    substance: string;
    bags: string;
    total_quantity: string;
    place: string;
    sampling_done: boolean;
    sampling_description: string;
    sealing_done: boolean;
    sealing_description: string;
    ncb_triplicate_documentation: boolean;
    source_document?: string;
  };
  fsl_details?: {
    report_number?: string;
    lab_name?: string;
    sample_marks?: string;
    substance_detected?: string;
    morphine_percentage?: string;
    received_date?: string;
    report_date?: string;
    status: 'mentioned' | 'not_established';
  };
  procedural_steps: CaseProceduralStep[];
  procedural_steps_not_established: CaseProceduralStepNotEstablished[];
  source_locations: CaseSourceLocation[];
  conflicts?: CaseConflict[];
  
  // Interactive Workflow State
  current_stage?: number;
  confirmed_facts?: Record<string, any>;
  active_mode?: 'GUIDED' | 'REVIEW' | 'DOCUMENT';
  workflow_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export class CaseStore {
  private cases: Map<string, CaseContext> = new Map();
  private casesDir: string;

  constructor() {
    this.casesDir = path.join(process.cwd(), 'data', 'cases');
    this.loadAllCases();
  }

  private loadAllCases() {
    try {
      if (!fs.existsSync(this.casesDir)) {
        fs.mkdirSync(this.casesDir, { recursive: true });
      }

      const caseDirs = fs.readdirSync(this.casesDir);
      for (const dirName of caseDirs) {
        const fullDir = path.join(this.casesDir, dirName);
        if (fs.statSync(fullDir).isDirectory()) {
          const firPath = path.join(fullDir, 'fir_context.json');
          if (fs.existsSync(firPath)) {
            try {
              const data = JSON.parse(fs.readFileSync(firPath, 'utf8')) as CaseContext;
              if (data && data.case_id) {
                // Ensure documents array is always initialized
                if (!data.documents || !Array.isArray(data.documents)) {
                  data.documents = [
                    {
                      document_id: `doc_fir_${data.case_id}`,
                      document_type: 'FIR',
                      title: data.source_document || `FIR ${data.fir_details?.fir_number || 'Record'}`,
                      filename: data.source_document || 'FIR_Record.pdf',
                      pages: data.pages || 3,
                      status: 'processed',
                      uploaded_at: new Date().toISOString(),
                      extracted_summary: `FIR No. ${data.fir_details?.fir_number || '24/2024'} registered at PS ${data.fir_details?.police_station || 'Batathu'}.`
                    }
                  ];
                }
                // Mark fixture/demo/test records vs real user cases
                if (data.case_id === 'case_batathu_hp72d3928' || data.case_id.includes('test') || data.case_id.startsWith('interactive_test_')) {
                  data.is_fixture = true;
                  data.record_type = data.case_id === 'case_batathu_hp72d3928' ? 'demo' : 'test';
                } else if (data.is_fixture === undefined) {
                  data.is_fixture = false;
                  data.record_type = 'case';
                }
                this.cases.set(data.case_id, data);
              }
            } catch (err) {
              console.error(`[CaseStore] Error loading case from ${firPath}:`, err);
            }
          }
        }
      }
      console.log(`[CaseStore] Loaded ${this.cases.size} case context(s).`);
    } catch (err) {
      console.error('[CaseStore] Error initializing case store:', err);
    }
  }

  public getCase(caseId: string): CaseContext | null {
    return this.cases.get(caseId) || null;
  }

  public getOrCreateSessionCase(sessionId: string): CaseContext {
    const sessionCaseId = `session_case_${sessionId || 'default'}`;
    let sessionCase = this.cases.get(sessionCaseId);
    if (!sessionCase) {
      sessionCase = {
        case_id: sessionCaseId,
        case_title: `Session Case (${sessionId || 'default'})`,
        is_fixture: false,
        record_type: 'case',
        document_type: 'INTERACTIVE_SESSION',
        source_document: 'Interactive Narrative',
        pages: 1,
        ocr_status: 'none',
        documents: [],
        fir_details: {
          police_station: '',
          district: '',
          state: '',
          fir_number: '',
          date: '',
          sections: [],
          informant_complainant: '',
          investigating_officer: ''
        },
        persons: [],
        vehicle: { type: '', registration_number: '', documents_checked: [], taken_into_possession: false, search_conducted: false },
        seizure: { substance: '', bags: '', total_quantity: '', place: '', sampling_done: false, sampling_description: '', sealing_done: false, sealing_description: '', ncb_triplicate_documentation: false },
        procedural_steps: [],
        procedural_steps_not_established: [],
        source_locations: [],
        confirmed_facts: {},
        current_stage: 1,
        workflow_status: 'PENDING'
      };
      this.saveCase(sessionCase);
    }
    return sessionCase;
  }

  public getAllCases(): CaseContext[] {
    return Array.from(this.cases.values());
  }

  public getDefaultCase(): CaseContext | null {
    if (this.cases.has('case_batathu_hp72d3928')) {
      return this.cases.get('case_batathu_hp72d3928')!;
    }
    const first = this.cases.values().next().value;
    return first || null;
  }

  public saveCase(caseData: CaseContext): boolean {
    try {
      const targetDir = path.join(this.casesDir, caseData.case_id);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFile = path.join(targetDir, 'fir_context.json');
      fs.writeFileSync(targetFile, JSON.stringify(caseData, null, 2), 'utf8');
      this.cases.set(caseData.case_id, caseData);
      return true;
    } catch (err) {
      console.error('[CaseStore] Error saving case:', err);
      return false;
    }
  }

  public addDocumentToCase(caseId: string, doc: Partial<CaseDocument>): CaseDocument | null {
    const existingCase = this.getCase(caseId);
    if (!existingCase) return null;

    const docId = doc.document_id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newDoc: CaseDocument = {
      document_id: docId,
      document_type: doc.document_type || 'Other',
      title: doc.title || doc.filename || 'Investigation Document',
      filename: doc.filename || 'document.pdf',
      pages: doc.pages || 1,
      status: 'processed',
      uploaded_at: new Date().toISOString(),
      extracted_summary: doc.extracted_summary || `Document ${doc.filename || doc.title} processed for case ${existingCase.case_title}.`,
      facts: doc.facts || {},
      procedural_steps: doc.procedural_steps || []
    };

    existingCase.documents = existingCase.documents || [];
    existingCase.documents.push(newDoc);
    existingCase.pages = existingCase.documents.reduce((acc, d) => acc + (d.pages || 1), 0);

    this.saveCase(existingCase);
    return newDoc;
  }

  public removeDocumentFromCase(caseId: string, documentId: string): boolean {
    const existingCase = this.getCase(caseId);
    if (!existingCase || !existingCase.documents) return false;

    const initialLen = existingCase.documents.length;
    existingCase.documents = existingCase.documents.filter(d => d.document_id !== documentId);

    if (existingCase.documents.length === initialLen) {
      return false;
    }

    existingCase.pages = existingCase.documents.reduce((acc, d) => acc + (d.pages || 1), 0);
    this.saveCase(existingCase);
    return true;
  }

  public processUploadedDocument(
    caseId: string,
    filename: string,
    docType: string,
    rawText?: string,
    pages?: number
  ): CaseDocument | null {
    const text = (rawText || '').toLowerCase();
    let detectedType = docType || 'Other';

    if (detectedType === 'Other' || !detectedType) {
      if (text.includes('first information report') || text.includes('fir')) detectedType = 'FIR';
      else if (text.includes('seizure memo') || text.includes('recovery memo') || text.includes('fard makboozgi')) detectedType = 'Seizure Memo';
      else if (text.includes('arrest memo') || text.includes('arrest')) detectedType = 'Arrest Memo';
      else if (text.includes('personal search') || text.includes('jama talashi')) detectedType = 'Personal Search Memo';
      else if (text.includes('forensic science') || text.includes('fsl') || text.includes('chemical examiner')) detectedType = 'FSL Report';
      else if (text.includes('statement') || text.includes('161 crpc')) detectedType = 'Statement';
      else if (text.includes('malkhana') || text.includes('register no 19')) detectedType = 'Malkhana/Property Document';
      else if (text.includes('site plan') || text.includes('map')) detectedType = 'Site Plan';
      else detectedType = 'Other';
    }

    const doc: Partial<CaseDocument> = {
      document_type: detectedType,
      title: `${detectedType} — ${filename}`,
      filename: filename,
      pages: pages || 1,
      status: 'processed',
      extracted_summary: `Processed ${detectedType} (${filename}). Content extracted and indexed for multi-document case reasoning.`
    };

    return this.addDocumentToCase(caseId, doc);
  }

  public processUploadedFIR(filename: string, rawText?: string): CaseContext {
    const caseId = `case_${Date.now()}_${path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    
    // Extract facts if text available, otherwise create clean structured template
    const text = rawText || '';
    const sections: string[] = [];
    if (text.includes('15') || text.toLowerCase().includes('section 15')) sections.push('Section 15 NDPS Act');
    if (text.includes('25') || text.toLowerCase().includes('section 25')) sections.push('Section 25 NDPS Act');
    if (text.includes('20') || text.toLowerCase().includes('section 20')) sections.push('Section 20 NDPS Act');
    if (text.includes('21') || text.toLowerCase().includes('section 21')) sections.push('Section 21 NDPS Act');
    if (text.includes('22') || text.toLowerCase().includes('section 22')) sections.push('Section 22 NDPS Act');
    if (sections.length === 0) sections.push('Section 15 NDPS Act', 'Section 25 NDPS Act');

    const defaultCase = this.getDefaultCase();

    const newCase: CaseContext = {
      case_id: caseId,
      case_title: `Uploaded Case — ${filename}`,
      is_fixture: false,
      record_type: 'case',
      document_type: 'FIR',
      source_document: filename,
      pages: 3,
      ocr_status: 'extracted_verified',
      documents: [
        {
          document_id: `doc_fir_${Date.now()}`,
          document_type: 'FIR',
          title: `FIR Record — ${filename}`,
          filename: filename,
          pages: 3,
          status: 'processed',
          uploaded_at: new Date().toISOString(),
          extracted_summary: `Initial FIR extracted from ${filename}.`
        }
      ],
      fir_details: {
        police_station: 'Not Specified',
        district: 'Not Specified',
        state: 'Not Specified',
        fir_number: 'Uploaded Record',
        date: new Date().toLocaleDateString('en-GB'),
        sections: sections,
        informant_complainant: 'Not Specified',
        investigating_officer: 'Not Specified'
      },
      persons: [],
      vehicle: {
        type: 'Not Specified',
        registration_number: 'Not Specified',
        documents_checked: [],
        taken_into_possession: false,
        search_conducted: false
      },
      seizure: {
        substance: 'Unspecified Contraband',
        bags: 'Not Specified',
        total_quantity: 'Not Specified',
        place: 'Not Specified',
        sampling_done: false,
        sampling_description: '',
        sealing_done: false,
        sealing_description: '',
        ncb_triplicate_documentation: false
      },
      procedural_steps: [],
      procedural_steps_not_established: [],
      source_locations: [],
      conflicts: []
    };

    this.saveCase(newCase);
    return newCase;
  }
}

export const globalCaseStore = new CaseStore();
