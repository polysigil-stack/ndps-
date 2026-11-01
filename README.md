# NDPS Intelligence — Investigation & Legal Assistant

NDPS Intelligence is a production-grade training and procedural knowledge assistant grounded strictly in official reference material, statutory provisions, procedural manuals, and Supreme Court rulings.

## Project Structure

- `src/` — Application source code
  - `src/server/` — Server-side business logic, retrieval engine, and workflow services
  - `src/components/` — Reusable UI components
  - `src/workflows/` — Recovery pathway logic and stage progression
- `data/` — Authoritative data and runtime state
  - `data/templates/` — The authoritative 29 template JSON files (14 Chance Recovery, 15 Information-Based)
  - `data/cases/` — Runtime case data and documents
- `tests/` — Automated test suites
  - `tests/unit/` — Focused unit tests
  - `tests/integration/` — Registry, persistence, and workflow integration tests
  - `tests/e2e/` — Complete user journey and acceptance tests
- `scripts/` — Maintenance and ingestion utilities
  - `scripts/ingestion/` — Utilities for ingesting and patching templates and caselaw
  - `scripts/audit/` — Diagnostic and audit reporting scripts
  - `scripts/maintenance/` — General maintenance and preview tools
- `docs/` — Project documentation and reference materials

## Common Commands

### Development
```bash
npm run dev
```

### Testing
```bash
npm test              # Runs the main regression test suite
npm run audit         # Runs the Phase 7 audit report
```

### Building
```bash
npm run build
```

## Core Principles
1. **Strict Grounding**: All answers are grounded in provided statutory and procedural sources.
2. **Template Fidelity**: Preserves exact wording and ordering of the 29 authoritative templates.
3. **Workflow Isolation**: Maintains separate paths for Chance Recovery and Information-Based investigations.
