# NDPS Training & Reference Assistant — Operations Manual

**Release Identifier:** NDPS-RAG-v1.0.0  
**Status:** RELEASE READY  

---

## 1. Installation & Environment Configuration

### Prerequisites
- Node.js (v18+)
- npm

### Environment Variables
Create a `.env` file in the project root based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=production
```
> **Security Notice:** `GEMINI_API_KEY` must remain strictly server-side and never be prefixed with `VITE_`.

---

## 2. Starting the Application

### Development Mode
```bash
npm install
npm run dev
```

### Production Build & Start
```bash
npm run build
npm start
```

---

## 3. Corpus Loading & Versioning
- **Statutory Corpus:** Loaded from `data/ndps_qa_clean.json`.
- **Case-Law Corpus:** Loaded from `data/ndps_caselaw.json`.
- **Investigation Documentation & Forms:** Loaded from `data/ndps_documentation.json`.
- **Embeddings:** Pre-computed and cached in `data/ndps_embeddings.json`.
- **Corpus Versioning:** Managed via `/server/knowledgePipeline.ts` with review queues and automated snapshots.

---

## 4. Health Check
Endpoint: `GET /api/health`  
Returns safe operational metadata:
```json
{
  "status": "ok",
  "app": "NDPS Training Assistant",
  "recordsIndexed": 499,
  "embeddingsCached": 451,
  "geminiConfigured": true
}
```

---

## 5. Legal Knowledge Updates & Review Workflow
1. **Discovery:** New legal material is submitted as pending via the knowledge pipeline.
2. **Review:** Administrators inspect provenance, source authority, and citations.
3. **Approval:** Approved records trigger automatic corpus snapshotting, BM25/vector re-indexing, regression testing, and publication.

---

## 6. Backup, Snapshot & Rollback
- **Snapshots:** Stored automatically in `data/corpus_snapshots/` prior to any corpus mutation.
- **Rollback:** If regression tests fail after an update, invoke `rollbackToLatestSnapshot()` in `KnowledgeUpdatePipeline` to restore the last known-good corpus immediately.

---

## 7. Troubleshooting & Quota Fallback
- **Gemini Quota Exceeded (429):** The retrieval engine and answer generator automatically fall back to high-fidelity BM25 lexical retrieval and deterministic RAG synthesis without exposing raw provider errors to users.
- **Missing API Key:** The system gracefully falls back to deterministic authoritative retrieval.

---

## 8. Regression Testing
Run the complete regression suite:
```bash
npx tsx scripts/test_legal_accuracy_audit.ts
npx tsx scripts/test_investigation_documentation.ts
npx tsx scripts/test_knowledge_pipeline.ts
```
