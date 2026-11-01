# Testing & Quality Assurance

## Overview
The project maintains a rigorous testing suite to ensure legal accuracy, procedural fidelity, and workflow integrity.

## Test Categories

### Regression Tests
The primary test suite is `tests/integration/regression.ts`. It covers multi-turn conversations, keyword validation, and response formatting.
```bash
npm test
```

### E2E Acceptance Tests
Located in `tests/e2e/`, these tests simulate full user journeys through investigation workflows.
```bash
tsx tests/e2e/e2e_workflow_audit.ts
```

### Specialized Integration Tests
Located in `tests/integration/`, these focus on specific components:
- `test_chance_recovery_templates_reconciliation.ts`: Verifies the 14 recovery templates.
- `test_legal_accuracy_audit.ts`: Audits legal citations and grounding.

### Audit & Reporting
The `scripts/audit/` directory contains scripts that generate comprehensive reports on system performance:
```bash
npm run audit
```

## Continuous Verification
Before any production deployment, the following must pass:
1. `npm run lint` (Typechecking)
2. `npm test` (Regression)
3. `npm run build` (Production Build)
