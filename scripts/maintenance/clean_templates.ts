import fs from 'fs';
import path from 'path';

const dir = './data/templates';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.json')) {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data.content) {
      data.content = data.content
        .replace(/\n{3,}/g, '\n\n')
        .replace(/_{3,}/g, '______')
        .trim();
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}
console.log('Cleaned all templates.');
