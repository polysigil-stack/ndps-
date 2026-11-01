
import mammoth from 'mammoth';

async function preview() {
    const result = await mammoth.extractRawText({path: 'chance.docx'});
    console.log(result.value.substring(0, 5000));
}

preview();
