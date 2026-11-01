# System Architecture

## Overview
NDPS Intelligence is a full-stack application built with React (Vite) and Express. It uses the Gemini API for intelligent retrieval and generation, grounded in a local corpus of NDPS-related legal and procedural data.

## Server-Side Logic (`src/server/`)
- `retrieval.ts`: Implements keyword-based and semantic-aware retrieval from the NDPS corpus.
- `gemini.ts`: Orchestrates calls to the Gemini model with specific system instructions and grounding context.
- `investigatorQueryEngine.ts`: The central router for handling investigator queries, identifying intent, and selecting appropriate workflows.
- `caseStore.ts` & `evidenceStore.ts`: Manage the persistence of case context and evidence collection during an investigation.
- `templateRegistry.ts`: The central registry for all 29 authoritative templates.

## Workflows
The system distinguishes between two primary workflows:
1. **Chance Recovery**: Used when contraband is discovered unexpectedly during routine patrolling or search.
2. **Information-Based**: Used when a search is conducted based on prior specific intelligence.

## Template Registry
The `data/templates/` directory contains the authoritative JSON definitions for:
- 14 Chance Recovery templates (`chance_recovery_01.json` to `14.json`)
- 15 Information-Based templates (`ndps_act_documents_01.json` to `15.json`)

## Grounding & Fidelity
The system enforces strict grounding by:
- Normalizing statutory references (e.g., ensuring Section 50(4) is cited correctly).
- Validating generated answers against keywords and mandatory conditions (e.g., Section 35(3) BNSS notice requirements).
