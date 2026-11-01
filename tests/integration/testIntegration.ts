
import { templateRegistry } from '../../src/server/templateRegistry';
import { resolveTemplateFromQueryOrHistory } from '../../src/server/templates/index';

function testIntegration() {
    console.log('--- Integration Test ---');
    
    // 1. Chance Recovery Stage 1 Lookup
    const chanceStage1 = templateRegistry.findTemplate('CHANCE_RECOVERY', 1);
    console.log('Chance Stage 1 Title:', chanceStage1?.name);

    // 2. Info Based Stage 1 Lookup
    const infoStage1 = templateRegistry.findTemplate('INFORMATION_BASED', 1);
    console.log('Info Stage 1 Title:', infoStage1?.name);

    // 3. Resolve via Resolver
    const res = resolveTemplateFromQueryOrHistory('फर्द वरामदगी', [], 'CHANCE_RECOVERY');
    console.log('Resolved via Resolver:', res.status, res.template?.name);

    if (chanceStage1 && res.template && chanceStage1.id === res.template.id) {
        console.log('SUCCESS: Lookup matches registry.');
    } else {
        console.log('FAILURE: Lookup mismatch.');
    }
}

testIntegration();
