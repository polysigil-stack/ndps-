import fs from 'fs';
import path from 'path';

export interface RecoveryTemplate {
    id: string;
    name: string;
    workflowType: 'CHANCE_RECOVERY' | 'INFORMATION_BASED';
    sequence: number;
    content: string;
    fields: string[];
    collectionId?: string;
}

const TEMPLATE_ALIAS_MAP: Record<string, string[]> = {
    'chance_recovery_01': ['fard makboozgi', 'fard makbujgi', 'spot recovery memo', 'seizure memo', 'fard zabti', 'fard', 'spot recovery', 'bramadgi fard', 'fard bramadgi', 'bramadgi'],
    'chance_recovery_02': ['notice section 50', 'section 50 notice', 'dhara 50 notice', 'jama talashi notice', 'personal search notice', 'option form'],
    'chance_recovery_03': ['search of police', 'fard talashi mulazman', 'mulazman talashi', 'police party search'],
    'chance_recovery_04': ['personal search memo', 'fard jama talashi', 'sharirik talashi', 'bodily search memo'],
    'chance_recovery_05': ['personal effects memo', 'jama talashi', 'jaama talashi', 'personal belongings'],
    'chance_recovery_06': ['spot inspection', 'site plan', 'nazri naksha', 'fard nishandehi', 'naksha mauka', 'nishandehi'],
    'chance_recovery_07': ['identification memo', 'fard shinakht', 'shinakht aaropi'],
    'chance_recovery_08': ['interrogation memo', 'fard puchtach', 'interrogation statement', 'puchtach'],
    'chance_recovery_09': ['arrest memo', 'fard giraftari', 'giraftari memo', 'arrest notice'],
    'chance_recovery_10': ['rukka', 'rooka', 'tehreer', 'tehroor', 'spot report'],
    'chance_recovery_11': ['seal delivery memo', 'supurdginama', 'supurdgi seal', 'seal handover'],
    'chance_recovery_12': ['special report', 'section 57 report', 'dhara 57 report', 'special report 57'],
    'chance_recovery_13': ['section 52a application', 'dhara 52a a आवेदन', 'magistrate inventory', '52a application'],
    'chance_recovery_14': ['road certificate', 'rc', 'fsl road certificate', 'fsl rc'],

    'ndps_act_documents_01': ['secret information memo', 'section 42 memo', 'dhara 42 soochana', '42(2) report', 'informer memo'],
    'ndps_act_documents_02': ['section 50 notice', 'dhara 50 notice', 'written notice 50'],
    'ndps_act_documents_03': ['section 50 response', 'dhara 50 uttar', 'option response'],
    'ndps_act_documents_04': ['section 42 proviso search', 'night search memo', 'proviso memo'],
    'ndps_act_documents_05': ['seizure memo info', 'fard zabti info', 'recovery memo info'],
    'ndps_act_documents_06': ['malkhana deposit', 'section 55 malkhana', 'malkhana memo'],
    'ndps_act_documents_07': ['section 57 report info', 'dhara 57 report info'],
    'ndps_act_documents_08': ['section 52a application info', '52a application info'],
    'ndps_act_documents_09': ['arrest memo info', 'giraftari memo info'],
    'ndps_act_documents_10': ['remand application', 'custody application'],
    'ndps_act_documents_11': ['interrogation u/s 67', 'section 67 statement'],
    'ndps_act_documents_12': ['fsl forwarding letter', 'fsl sample letter'],
    'ndps_act_documents_13': ['section 68f notice', 'financial investigation notice'],
    'ndps_act_documents_14': ['property seizure notice 68f'],
    'ndps_act_documents_15': ['final report', 'chargesheet', 'section 173 report']
};

export class TemplateRegistry {
    private templates: Map<string, RecoveryTemplate> = new Map();

    constructor() {
        this.loadTemplates();
    }

    private loadTemplates() {
        const possibleDirs = [
            path.join(process.cwd(), 'data', 'templates'),
            '/data/templates',
            '/app/applet/data/templates'
        ];

        let targetDir = possibleDirs.find(dir => fs.existsSync(dir));
        if (!targetDir) return;

        try {
            const files = fs.readdirSync(targetDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = JSON.parse(fs.readFileSync(path.join(targetDir, file), 'utf8'));
                    if (data && data.id) {
                        this.templates.set(data.id, data);
                    }
                }
            }
        } catch (e) {
            console.error('[TemplateRegistry] Failed loading templates:', e);
        }
    }

    public getTemplate(id: string): RecoveryTemplate | undefined {
        return this.templates.get(id);
    }

    public getAllTemplates(): RecoveryTemplate[] {
        return Array.from(this.templates.values());
    }

    public findTemplate(workflowType: string, sequence: number): RecoveryTemplate | undefined {
        return this.getAllTemplates().find(t => t.workflowType === workflowType && t.sequence === sequence);
    }

    public searchTemplates(query: string, workflowType?: string): RecoveryTemplate[] {
        const q = query.toLowerCase().trim();
        const all = this.getAllTemplates();

        // Filter by workflowType if specified
        const pool = workflowType ? all.filter(t => t.workflowType === workflowType) : all;

        // 1. Direct name / id match
        const exactMatches = pool.filter(t =>
            t.id.toLowerCase() === q ||
            t.name.toLowerCase().includes(q)
        );
        if (exactMatches.length > 0) return exactMatches;

        // 2. Alias match
        const aliasMatches = pool.filter(t => {
            const aliases = TEMPLATE_ALIAS_MAP[t.id] || [];
            return aliases.some(alias => q.includes(alias) || alias.includes(q));
        });
        if (aliasMatches.length > 0) return aliasMatches;

        // 3. Content / field match
        return pool.filter(t => t.content.toLowerCase().includes(q));
    }
}

export function getSourceFilename(collectionId: string): string {
    if (collectionId === 'chance_recovery') {
        return 'Chance_Recovery_NDPS_Documents (1).docx';
    }
    if (collectionId === 'ndps_act_documents') {
        return 'NDPS Act (1).docx';
    }
    return 'Unknown Source Document';
}

export const templateRegistry = new TemplateRegistry();

