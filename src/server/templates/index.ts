
import { RecoveryPathway } from '../types';
import { isIncidentNarrative } from '../caseSynthesizer';
import { templateRegistry } from '../templateRegistry';
import type { RecoveryTemplate } from '../templateRegistry';

export { RecoveryTemplate };

export interface TemplateResolutionResult {
  status: 'RESOLVED' | 'AMBIGUOUS' | 'NOT_FOUND';
  template?: RecoveryTemplate;
  candidates?: { id: string; name: string }[];
  clarificationMessage?: string;
  requestedSection?: string;
  unavailableMessage?: string;
}

export function findDirectTemplateMatch(query: string, pathway: RecoveryPathway = 'UNSET'): RecoveryTemplate | undefined {
  if (isIncidentNarrative(query)) {
    return undefined;
  }
  
  const qLower = query.toLowerCase().trim();
  const workflowType = pathway === 'INFORMATION_BASED' ? 'INFORMATION_BASED' : 'CHANCE_RECOVERY';

  // Search in the registry with optional workflow type filtering
  const matches = templateRegistry.searchTemplates(qLower, pathway !== 'UNSET' ? workflowType : undefined);
  
  if (matches.length > 0) return matches[0];
  
  return undefined;
}

export function resolveTemplateFromQueryOrHistory(
  query: string,
  history: Array<{ role: string; content: string }> = [],
  pathway: RecoveryPathway = 'UNSET'
): TemplateResolutionResult {
  if (!query) return { status: 'NOT_FOUND' };

  // Normalize common typos in template requests
  let qLower = query.toLowerCase().trim()
    .replace(/\btempleate\b/g, 'template')
    .replace(/\btemplet\b/g, 'template')
    .replace(/\bformate\b/g, 'format')
    .replace(/\budhahran\b/g, 'udaharan')
    .replace(/\budharan\b/g, 'udaharan');

  // Case evidence inquiries must never resolve to template lookup
  const isCaseEvidenceInquiry = 
    qLower.includes('is case mein') ||
    qLower.includes('in this case') ||
    qLower.includes('case file contain') ||
    qLower.includes('case file') ||
    qLower.includes('in this fir') ||
    qLower.includes('present in this case') ||
    qLower.includes('in this investigation');
  if (isCaseEvidenceInquiry) {
    return { status: 'NOT_FOUND' };
  }

  // Classification Must Precede Workflow Activation
  if (isIncidentNarrative(query)) {
    return {
      status: 'NOT_FOUND',
      unavailableMessage: "Classification must precede workflow activation. Under NDPS procedural rules, the assistant must complete the two-category provisional classification before activating document templates."
    };
  }

  // Strict Section Safety
  if (pathway === 'CHANCE_RECOVERY' && (qLower.includes('section 42') || qLower.includes('sec 42') || qLower.includes('धारा 42'))) {
    return {
      status: 'NOT_FOUND',
      requestedSection: '42',
      unavailableMessage: "No authoritative Section 42 template is available in the Chance Recovery template source."
    };
  }

  const workflowType = pathway === 'INFORMATION_BASED' ? 'INFORMATION_BASED' : 'CHANCE_RECOVERY';

  // Check if query is explicitly asking for a template/format/document generation
  const isTemplateRequest =
    qLower.includes('template') ||
    qLower.includes('templeate') ||
    qLower.includes('format') ||
    qLower.includes('draft') ||
    qLower.includes('proforma') ||
    qLower.includes('dikhao') ||
    qLower.includes('chahiye') ||
    qLower.includes('rukka') ||
    /\b(?:template|format|draft|proforma|sample|udharan|udhahran)\s+(?:do|dijiye|banaen|banao)\b/i.test(qLower) ||
    /\b(?:mujhe|iska|ye|is|woh)\s+.*?\b(?:do|dijiye|dikhao|banao)\b/i.test(qLower) ||
    (/\b(?:generate|create|prepare|build|banao)\b/i.test(qLower) && /\b(?:memo|notice|report|certificate|template|format|draft|fard|rukka)\b/i.test(qLower));

  if (!isTemplateRequest) {
    return { status: 'NOT_FOUND' };
  }

  // 1. Deterministic Stage Number Lookup (e.g., "stage 2", "step 1", "1")
  const stageMatch = qLower.match(/\b(?:stage|step)\s*(\d{1,2})\b/i) || qLower.match(/^(\d{1,2})\b/);
  if (stageMatch) {
    const seq = parseInt(stageMatch[1], 10);
    const tmpl = templateRegistry.findTemplate(workflowType, seq);
    if (tmpl) {
      return { status: 'RESOLVED', template: tmpl };
    }
  }

  // 2. Direct Match from Query
  const directMatches = templateRegistry.searchTemplates(qLower, workflowType);
  if (directMatches.length > 0) {
    return { status: 'RESOLVED', template: directMatches[0] };
  }

  // 3. Coreference Resolution from History (e.g. "template of this", "templeate of this", "iska template do")
  const isCoreferenceTemplateReq =
    qLower.includes('template of this') ||
    qLower.includes('this') ||
    qLower.includes('iska') ||
    qLower.includes('isme') ||
    qLower.includes('ye') ||
    qLower.includes('same') ||
    qLower.includes('above') ||
    qLower === 'template' ||
    qLower === 'show template';

  if (isCoreferenceTemplateReq && history.length > 0) {
    // Scan history backwards for document or stage references
    for (let i = history.length - 1; i >= 0; i--) {
      const msgText = history[i].content.toLowerCase();

      // Check stage numbers in previous message
      const prevStageMatch = msgText.match(/\b(?:stage|step)\s*(\d{1,2})\b/i) || msgText.match(/(?:^|\n)(\d{1,2})\.\s+/);
      if (prevStageMatch) {
        const seq = parseInt(prevStageMatch[1], 10);
        const tmpl = templateRegistry.findTemplate(workflowType, seq);
        if (tmpl) {
          return { status: 'RESOLVED', template: tmpl };
        }
      }

      // Check document keywords in previous message
      const docKeywordMap: { key: string; seq: number }[] = [
        { key: 'fard makboozgi', seq: 1 },
        { key: 'spot recovery', seq: 1 },
        { key: 'seizure memo', seq: 1 },
        { key: 'spot seizure', seq: 1 },
        { key: 'fard zabti', seq: 1 },
        { key: 'section 50 notice', seq: 2 },
        { key: 'notice u/s 50', seq: 2 },
        { key: 'dhara 50 notice', seq: 2 },
        { key: 'police party search', seq: 3 },
        { key: 'personal search memo', seq: 4 },
        { key: 'bodily search', seq: 4 },
        { key: 'personal belongings', seq: 5 },
        { key: 'jama talashi', seq: 5 },
        { key: 'site plan', seq: 6 },
        { key: 'spot inspection', seq: 6 },
        { key: 'nazri naksha', seq: 6 },
        { key: 'identification memo', seq: 7 },
        { key: 'interrogation', seq: 8 },
        { key: 'arrest memo', seq: 9 },
        { key: 'rukka', seq: 10 },
        { key: 'spot report', seq: 10 },
        { key: 'seal delivery', seq: 11 },
        { key: 'supurdginama', seq: 11 },
        { key: 'special report', seq: 12 },
        { key: 'section 57', seq: 12 },
        { key: 'section 52a', seq: 13 },
        { key: 'magistrate inventory', seq: 13 },
        { key: 'road certificate', seq: 14 },
        { key: 'fsl road certificate', seq: 14 }
      ];

      for (const item of docKeywordMap) {
        if (msgText.includes(item.key)) {
          const tmpl = templateRegistry.findTemplate(workflowType, item.seq) || templateRegistry.findTemplate('CHANCE_RECOVERY', item.seq);
          if (tmpl) {
            return { status: 'RESOLVED', template: tmpl };
          }
        }
      }
    }
  }

  // Fallback: Default to Stage 1 template if pathway is set
  const defaultStage1 = templateRegistry.findTemplate(workflowType, 1);
  if (defaultStage1) {
    return { status: 'RESOLVED', template: defaultStage1 };
  }

  return { status: 'NOT_FOUND' };
}

export function translateTemplateToEnglish(template: RecoveryTemplate): string {
  return `### TRANSLATED VERSION — SOURCE TEMPLATE REMAINS UNCHANGED\n\n> **Original Source Template**: ${template.name}\n\n\`\`\`text\n[English Translated Draft of Stage #${template.sequence}: ${template.name}]\n\n${template.content}\n\`\`\`\n\n*Note: This translation is provided for explanatory convenience. The authentic source template in Hindi remains authoritative.*`;
}
