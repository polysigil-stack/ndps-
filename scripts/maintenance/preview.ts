
import mammoth from 'mammoth';
import fs from 'fs';

async function extract(path: string) {
    const result = await mammoth.extractRawText({path});
    console.log(result.value.substring(0, 1000));
}

extract('chance.docx');
extract('act.docx');
