
import { templateRegistry } from '../../src/server/templateRegistry';

function validate() {
    const templates = templateRegistry.getAllTemplates();
    const chance = templates.filter(t => t.workflowType === 'CHANCE_RECOVERY');
    const info = templates.filter(t => t.workflowType === 'INFORMATION_BASED');

    console.log(`--- Validation Diagnostic ---`);
    console.log(`Total Templates: ${templates.length}`);
    console.log(`Chance Recovery Templates: ${chance.length} (Expected: 14)`);
    console.log(`Information-Based Templates: ${info.length} (Expected: 15)`);

    console.log(`\n--- Chance Recovery Mapping Validation ---`);
    for (let i = 1; i <= 14; i++) {
        const t = chance.find(tmpl => tmpl.sequence === i);
        console.log(`Stage ${i}: ${t ? 'Mapped (' + t.name + ')' : 'MISSING'}`);
    }

    console.log(`\n--- Information-Based Mapping Validation ---`);
    for (let i = 1; i <= 15; i++) {
        const t = info.find(tmpl => tmpl.sequence === i);
        console.log(`Stage ${i}: ${t ? 'Mapped (' + t.name + ')' : 'MISSING'}`);
    }
}

validate();
