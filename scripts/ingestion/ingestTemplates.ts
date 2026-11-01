
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

const CHANCE_RECOVERY_PATH = 'chance.docx';
const NDPS_ACT_PATH = 'act.docx';
const OUTPUT_DIR = './data/templates';

async function ingest() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Process Chance Recovery
    const chanceResult = await mammoth.extractRawText({path: CHANCE_RECOVERY_PATH});
    const chanceTemplates = splitTemplates(chanceResult.value, 'CHANCE_RECOVERY');
    saveTemplates(chanceTemplates, 'chance_recovery');

    // Process NDPS Act
    const actResult = await mammoth.extractRawText({path: NDPS_ACT_PATH});
    const actTemplates = splitTemplates(actResult.value, 'INFORMATION_BASED');
    saveTemplates(actTemplates, 'ndps_act_documents');
}

function splitTemplates(text: string, type: 'CHANCE_RECOVERY' | 'INFORMATION_BASED') {
    // Split by the pattern "Number. Name" at the start of a line.
    // Use positive lookahead to keep the delimiter.
    const parts = text.split(/(?=\n\d+\.\s+)/);
    const templates = [];

    for (const part of parts) {
        const match = part.match(/^\s*(\d+)\.\s+(.+?)\n([\s\S]*)$/);
        if (match) {
            templates.push({
                sequence: parseInt(match[1]),
                name: match[2].trim(),
                workflowType: type,
                content: match[3].trim(),
                fields: []
            });
        }
    }
    return templates;
}

function saveTemplates(templates: any[], collectionId: string) {
    for (const tmpl of templates) {
        const id = `${collectionId}_${tmpl.sequence.toString().padStart(2, '0')}`;
        tmpl.id = id;
        tmpl.collectionId = collectionId;
        fs.writeFileSync(`${OUTPUT_DIR}/${id}.json`, JSON.stringify(tmpl, null, 2));
    }
}

ingest().then(() => console.log('Ingestion complete.'));
