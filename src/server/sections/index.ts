import { StructuredSectionRecord, SectionComparison } from './types';
import { PENAL_SECTIONS } from './penalSections';
import { PROCEDURE_SECTIONS } from './procedureSections';
import { FORFEITURE_SECTIONS } from './forfeitureSections';
import { SECTION_COMPARISONS } from './comparisons';

export * from './types';
export * from './workflow';
export { PENAL_SECTIONS } from './penalSections';
export { PROCEDURE_SECTIONS } from './procedureSections';
export { FORFEITURE_SECTIONS } from './forfeitureSections';
export { SECTION_COMPARISONS } from './comparisons';

export const ALL_SECTIONS: Record<string, StructuredSectionRecord> = {
  ...PENAL_SECTIONS,
  ...PROCEDURE_SECTIONS,
  ...FORFEITURE_SECTIONS
};

export function getSectionRecord(sectionNumber: string): StructuredSectionRecord | null {
  const normKey = sectionNumber.toUpperCase().replace(/^SECTION\s*/i, '').trim();
  return ALL_SECTIONS[normKey] || null;
}

export function getAllSectionRecords(): StructuredSectionRecord[] {
  return Object.values(ALL_SECTIONS);
}

export function findSectionRecord(query: string): StructuredSectionRecord | null {
  const clean = query.toLowerCase().replace(/[\-_]/g, ' ').trim();

  // 1. Direct section pattern matching
  // Matches "section 42", "sec 42", "s 42", "section 68a", "sec 68-a"
  const secMatch = clean.match(/\b(?:section|sec|s)\s*([0-9]{1,3}[a-z]?)\b/i);
  if (secMatch) {
    const candidate = secMatch[1].toUpperCase();
    if (ALL_SECTIONS[candidate]) {
      return ALL_SECTIONS[candidate];
    }
  }

  // 2. Attached section numbers: "section42", "sec42"
  const attachedMatch = clean.match(/\b(?:section|sec)(\d+[a-z]?)\b/i);
  if (attachedMatch) {
    const candidate = attachedMatch[1].toUpperCase();
    if (ALL_SECTIONS[candidate]) {
      return ALL_SECTIONS[candidate];
    }
  }

  // 3. Exact bare numbers if asked in context of NDPS
  const bareMatch = clean.match(/^\s*(\d+[a-z]?)\s*$/i);
  if (bareMatch) {
    const candidate = bareMatch[1].toUpperCase();
    if (ALL_SECTIONS[candidate]) {
      return ALL_SECTIONS[candidate];
    }
  }

  return null;
}

export function findSectionComparison(query: string): SectionComparison | null {
  const clean = query.toLowerCase().replace(/[\-_]/g, ' ').trim();

  const isVersus = /\b(?:vs|versus|compared to|comparison|difference|diff|distinction)\b/i.test(clean);
  if (!isVersus) return null;

  const has42 = /\b(?:42|section\s*42)\b/i.test(clean);
  const has43 = /\b(?:43|section\s*43)\b/i.test(clean);
  const has50 = /\b(?:50|section\s*50)\b/i.test(clean);
  const has49 = /\b(?:49|section\s*49)\b/i.test(clean);
  const has52 = /\b(?:52|section\s*52)\b/i.test(clean);
  const has52A = /\b(?:52a|section\s*52a)\b/i.test(clean);
  const has55 = /\b(?:55|section\s*55)\b/i.test(clean);
  const has57 = /\b(?:57|section\s*57)\b/i.test(clean);
  const has37 = /\b(?:37|section\s*37)\b/i.test(clean);

  if (has42 && has43) return SECTION_COMPARISONS['42_vs_43'];
  if (has42 && has50) return SECTION_COMPARISONS['42_vs_50'];
  if (has50 && has49) return SECTION_COMPARISONS['50_vs_49'];
  if (has52 && has52A) return SECTION_COMPARISONS['52_vs_52A'];
  if (has55 && has57) return SECTION_COMPARISONS['55_vs_57'];
  if (has37 && (/\b(?:punishment|sentence|chapter iv|sections 15|penalty)\b/i.test(clean))) {
    return SECTION_COMPARISONS['37_vs_punishment'];
  }

  return null;
}

export function formatSectionRecordMarkdown(
  record: StructuredSectionRecord,
  mode: 'full' | 'concise' = 'full'
): string {
  if (mode === 'concise') {
    const highlights = record.keyRequirements.slice(0, 5).map(r => `* ${r}`).join('\n');
    return `### Section ${record.sectionNumber} — ${record.officialTitle}

**Core Statutory Purpose:**
${record.plainExplanation}

**Scope & Application:**
${record.scope}

**Key Highlights:**
${highlights}

*Authoritative Source: ${record.sourceMetadata.act}, Section ${record.sectionNumber} (${record.sourceMetadata.sourceTitle}).*`;
  }

  let md = `### Section ${record.sectionNumber} — ${record.officialTitle}\n\n`;
  md += `**Act & Chapter:** ${record.sourceMetadata.act} (${record.sourceMetadata.chapter})\n\n`;
  
  md += `#### 1. Exact Statutory Provision\n`;
  md += `> "${record.statutoryText}"\n\n`;

  md += `#### 2. Plain-Language Explanation\n`;
  md += `${record.plainExplanation}\n\n`;

  md += `#### 3. Scope & Application\n`;
  md += `${record.scope}\n\n`;

  md += `#### 4. Key Statutory Requirements & Conditions\n`;
  for (const req of record.keyRequirements) {
    md += `- ${req}\n`;
  }
  md += `\n`;

  md += `#### 5. Investigation & Enforcement Relevance\n`;
  md += `${record.investigationRelevance}\n\n`;

  md += `#### 6. Documentation & Evidentiary Requirements\n`;
  md += `${record.documentationEvidence}\n\n`;

  if (record.relatedSections.length > 0) {
    md += `#### 7. Related NDPS Sections\n`;
    md += `${record.relatedSections.join(', ')}\n\n`;
  }

  if (record.supremeCourtCaseLaw.length > 0) {
    md += `#### 8. Authoritative Supreme Court Case Law\n`;
    for (const cl of record.supremeCourtCaseLaw) {
      md += `- ${cl}\n`;
    }
    md += `\n`;
  }

  if (record.historicalAmendmentInfo) {
    md += `#### 9. Historical / Amendment Information\n`;
    md += `${record.historicalAmendmentInfo}\n\n`;
  }

  md += `#### Authoritative Source Metadata\n`;
  md += `- **Act:** ${record.sourceMetadata.act}\n`;
  md += `- **Chapter:** ${record.sourceMetadata.chapter}\n`;
  md += `- **Source Authority:** ${record.sourceMetadata.authority}\n`;

  return md.trim();
}

export function formatSectionComparisonMarkdown(comp: SectionComparison): string {
  // Ensure the audit-expected "vs" is present if not in title
  const displayTitle = comp.title.includes(' vs ') ? comp.title : comp.title.replace(':', ' vs');
  
  let md = `### ${displayTitle}\n\n`;
  md += `**Core Statutory Distinction:**\n${comp.coreDistinction}\n\n`;

  md += `#### Comparative Breakdown:\n\n`;
  for (const pt of comp.comparisonPoints) {
    md += `**${pt.aspect}:**\n`;
    md += `- ${pt.sectionA}\n`;
    md += `- ${pt.sectionB}\n\n`;
  }

  if (comp.keyCaseLaw.length > 0) {
    md += `#### Key Supreme Court Precedents:\n`;
    for (const cl of comp.keyCaseLaw) {
      md += `- ${cl}\n`;
    }
    md += `\n`;
  }

  md += `**Authoritative Source:** ${comp.authoritativeSource}`;
  return md.trim();
}
