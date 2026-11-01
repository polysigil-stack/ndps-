# Template Maintenance & Fidelity

## Authoritative Source
The authoritative source for all investigation templates is the `data/templates/` directory. These JSON files MUST NOT be modified manually for wording changes without a corresponding update to the reference documentation.

## Template Inventory
- **Chance Recovery**: 14 templates (01-14)
- **Information-Based**: 15 templates (01-15)
- **Total**: 29 templates

## Critical Requirements
1. **Section 35(3) BNSS**: Template `chance_recovery_09.json` contains critical legal conditions for arrest notices. These must be preserved exactly.
2. **Hindi Unicode**: All templates contain Hindi text. Ensure your editor supports UTF-8 and do not attempt to "normalize" Unicode characters unless strictly necessary.
3. **Ordering**: The `sequence` field in each template determines its order in the investigation workflow.

## Validation
To verify the integrity of the template registry, run:
```bash
tsx tests/integration/test_phase7_8_4_authoritative_template_source.ts
```
This script checks:
- Total count (29)
- Exact naming
- Source document attribution
- Field presence
