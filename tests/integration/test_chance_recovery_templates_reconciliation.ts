import { templateRegistry } from '../../src/server/templateRegistry';

async function runReconciliationTest() {
  console.log('=== RUNNING CHANCE RECOVERY RECONCILIATION REGRESSION TEST ===\n');

  const templates = templateRegistry.getAllTemplates();
  const chanceTemplates = templates
    .filter(t => t.workflowType === 'CHANCE_RECOVERY')
    .sort((a, b) => a.sequence - b.sequence);

  console.log(`Retrieved ${chanceTemplates.length} Chance Recovery templates.\n`);

  let failures = 0;

  // Expected mappings for Chance Recovery Stages 1 through 14
  const expectedChanceStages = [
    { seq: 1, id: 'chance_recovery_01', nameContains: 'फर्द वरामदगी मादक पदार्थ', contentContains: 'बरामदगी फर्द मौका' },
    { seq: 2, id: 'chance_recovery_02', nameContains: 'धारा 50 NDPS Act', contentContains: 'वैधानिक अधिकार' },
    { seq: 3, id: 'chance_recovery_03', nameContains: 'पुलिस पार्टी मुलाजमान', contentContains: 'पारदर्शिता बनाए रखने' },
    { seq: 4, id: 'chance_recovery_04', nameContains: 'आरोपीगण, वरामदगी व मकबूजगी', contentContains: 'व्यक्तिगत शारीरिक तलाशी ली गई' },
    { seq: 5, id: 'chance_recovery_05', nameContains: 'रुक्का', contentContains: 'सेवा में' },
    { seq: 6, id: 'chance_recovery_06', nameContains: 'नक्शा मौका नजरी', contentContains: 'घटनास्थल' },
    { seq: 7, id: 'chance_recovery_07', nameContains: 'बयान गवाहन', contentContains: '161 CrPC' },
    { seq: 8, id: 'chance_recovery_08', nameContains: 'पूछताछ आरोपीगण', contentContains: 'आरोपी का नाम' },
    { seq: 9, id: 'chance_recovery_09', nameContains: 'धारा 35(3) BNSS नोटिस', contentContains: '35(3) BNSS' },
    { seq: 10, id: 'chance_recovery_10', nameContains: 'चिकित्सा परीक्षण', contentContains: 'चिकित्सा' },
    { seq: 11, id: 'chance_recovery_11', nameContains: 'रिसील प्रमाणपत्र', contentContains: 'धारा 55' },
    { seq: 12, id: 'chance_recovery_12', nameContains: 'हवालात', contentContains: 'हवालात' },
    { seq: 13, id: 'chance_recovery_13', nameContains: 'धारा 52A NDPS Act', contentContains: '52A' },
    { seq: 14, id: 'chance_recovery_14', nameContains: 'धारा 57 NDPS Act', contentContains: '57' }
  ];

  // Disallowed sub-bullet headings that previously caused misextraction
  const forbiddenSubBullets = [
    'अभियुक्त साक्ष्यों से छेड़छाड़ नहीं करेगा',
    'अभियुक्त गवाहों को प्रभावित करने का प्रयास नहीं करेगा',
    'मादक पदार्थ की कीमत व खरीद का स्रोत क्या है',
    'पूर्व में किसी मादक पदार्थ संबंधी प्रकरण में संलिप्तता रही है'
  ];

  for (const exp of expectedChanceStages) {
    const tmpl = chanceTemplates.find(t => t.sequence === exp.seq);

    if (!tmpl) {
      console.error(`❌ FAIL: Stage ${exp.seq} is missing!`);
      failures++;
      continue;
    }

    if (tmpl.id !== exp.id) {
      console.error(`❌ FAIL: Stage ${exp.seq} ID mismatch. Expected ${exp.id}, got ${tmpl.id}`);
      failures++;
    }

    if (!tmpl.name.includes(exp.nameContains)) {
      console.error(`❌ FAIL: Stage ${exp.seq} Heading mismatch. Expected to contain "${exp.nameContains}", got "${tmpl.name}"`);
      failures++;
    }

    if (!tmpl.content || !tmpl.content.includes(exp.contentContains)) {
      console.error(`❌ FAIL: Stage ${exp.seq} Content mismatch. Expected to contain "${exp.contentContains}", got "${tmpl.content.slice(0, 50)}..."`);
      failures++;
    }

    // Check for forbidden sub-bullets
    for (const forbidden of forbiddenSubBullets) {
      if (tmpl.name.includes(forbidden)) {
        console.error(`❌ FAIL: Stage ${exp.seq} contains misparsed sub-bullet heading "${forbidden}"`);
        failures++;
      }
    }

    console.log(`✅ PASS: Stage ${exp.seq} (${tmpl.id}): "${tmpl.name}" [Length: ${tmpl.content.length} chars]`);
  }

  console.log('\n--- VERIFYING INFORMATION-BASED RECOVERY (15 STAGES ISOLATION) ---');
  const infoTemplates = templates.filter(t => t.workflowType === 'INFORMATION_BASED');
  if (infoTemplates.length !== 15) {
    console.error(`❌ FAIL: Expected 15 Information-Based templates, found ${infoTemplates.length}`);
    failures++;
  } else {
    console.log(`✅ PASS: Exactly 15 Information-Based templates preserved.`);
  }

  if (failures === 0) {
    console.log('\n🎉 ALL RECONCILIATION REGRESSION TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error(`\n❌ RECONCILIATION TEST FAILED WITH ${failures} ERRORS.`);
    process.exit(1);
  }
}

runReconciliationTest().catch(err => {
  console.error(err);
  process.exit(1);
});
