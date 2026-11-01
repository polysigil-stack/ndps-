import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const dataPath = path.resolve('data/ndps_qa_clean.json');
const caseLawPath = path.resolve('data/ndps_caselaw.json');
const docPath = path.resolve('data/ndps_documentation.json');
const embeddingsPath = path.resolve('data/ndps_embeddings.json');

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found, skipping embedding pregeneration.');
    return;
  }

  let records: any[] = [];
  if (fs.existsSync(dataPath)) {
    records = records.concat(JSON.parse(fs.readFileSync(dataPath, 'utf-8')));
  }
  if (fs.existsSync(caseLawPath)) {
    records = records.concat(JSON.parse(fs.readFileSync(caseLawPath, 'utf-8')));
  }
  if (fs.existsSync(docPath)) {
    records = records.concat(JSON.parse(fs.readFileSync(docPath, 'utf-8')));
  }
  
  console.log(`Starting embedding generation for ${records.length} records...`);

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  let embeddingsMap: Record<string, number[]> = {};
  if (fs.existsSync(embeddingsPath)) {
    try {
      embeddingsMap = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8'));
    } catch (e) {}
  }

  const hashesPath = path.resolve('data/ndps_embedding_hashes.json');
  let hashesMap: Record<string, string> = {};
  if (fs.existsSync(hashesPath)) {
    try {
      hashesMap = JSON.parse(fs.readFileSync(hashesPath, 'utf-8'));
    } catch (e) {}
  }

  // Remove any cached embeddings for records that no longer exist in data/ndps_qa_clean.json
  const activeRecordIds = new Set(records.map((r: any) => r.record_id));
  for (const id of Object.keys(embeddingsMap)) {
    if (!activeRecordIds.has(id)) {
      delete embeddingsMap[id];
      delete hashesMap[id];
    }
  }

  // Content hash check: re-embed any record whose question/answer content has changed
  for (const rec of records) {
    const textToEmbed = `Question: ${rec.question}\nAnswer: ${rec.answer}`;
    const hash = Buffer.from(textToEmbed).toString('base64');
    if (hashesMap[rec.record_id] !== hash) {
      delete embeddingsMap[rec.record_id];
      hashesMap[rec.record_id] = hash;
    }
  }

  // Clear cached embeddings for canonical chunk records to guarantee current vectors
  const forceUpdateIds = ['rec_chunk_1', 'rec_chunk_2', 'rec_chunk_3', 'rec_chunk_4', 'rec_chunk_5', 'rec_chunk_6'];
  for (const id of forceUpdateIds) {
    delete embeddingsMap[id];
  }

  console.log(`Currently cached: ${Object.keys(embeddingsMap).length}/${records.length}`);

  const missing = records.filter((r: any) => !embeddingsMap[r.record_id]);
  console.log(`Remaining to embed: ${missing.length}`);

  if (missing.length === 0) {
    console.log('All embeddings complete!');
    return;
  }

  const batchSize = 25;

  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);
    const textsToEmbed = batch.map((rec: any) => `Question: ${rec.question}\nAnswer: ${rec.answer}`);
    
    let batchSuccess = false;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await ai.models.embedContent({
          model: 'gemini-embedding-001',
          contents: textsToEmbed
        });
        if (res.embeddings && res.embeddings.length === batch.length) {
          for (let j = 0; j < batch.length; j++) {
            const vals = res.embeddings[j]?.values;
            if (vals) {
              embeddingsMap[batch[j].record_id] = vals;
            }
          }
          batchSuccess = true;
          break;
        }
      } catch (err: any) {
        if (err?.message?.includes('429') || err?.status === 'RESOURCE_EXHAUSTED') {
          console.log(`Quota limit reached, backing off 20s for attempt ${attempt + 1}...`);
          await new Promise((r) => setTimeout(r, 20000));
        } else {
          console.error(`Error in batch ${i}-${i + batch.length}:`, err?.message || err);
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    if (!batchSuccess) {
      console.warn(`Batch ${i} failed after retries, falling back to sequential individual items...`);
      for (const rec of batch) {
        try {
          const res = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: `Question: ${rec.question}\nAnswer: ${rec.answer}`
          });
          if (res.embeddings && res.embeddings[0]?.values) {
            embeddingsMap[rec.record_id] = res.embeddings[0].values;
          }
        } catch (e: any) {
          console.error(`Individual embedding failed for ${rec.record_id}:`, e?.message);
        }
      }
    }

    fs.writeFileSync(embeddingsPath, JSON.stringify(embeddingsMap));
    fs.writeFileSync(hashesPath, JSON.stringify(hashesMap));
    console.log(`Progress: ${Object.keys(embeddingsMap).length}/${records.length} embeddings cached.`);
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  fs.writeFileSync(embeddingsPath, JSON.stringify(embeddingsMap));
  fs.writeFileSync(hashesPath, JSON.stringify(hashesMap));
  console.log(`Successfully generated and cached ${Object.keys(embeddingsMap).length} embeddings to ${embeddingsPath}!`);

  // Final statutory verification check
  const finalActiveCount = records.length;
  const finalEmbedCount = Object.keys(embeddingsMap).length;
  console.log(`Embedding Verification: ${finalActiveCount} active records vs ${finalEmbedCount} active embeddings.`);
  if (finalActiveCount !== finalEmbedCount) {
    console.warn(`[WARNING] Embedding count mismatch! Active records: ${finalActiveCount}, Active embeddings: ${finalEmbedCount}`);
  }
}

main().catch(console.error);
