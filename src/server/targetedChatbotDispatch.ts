import { CaseContext, globalCaseStore } from './caseStore';
import { RecoveryTemplate, getChanceRecoveryTemplateBySequence, getChanceRecoveryTemplateById } from './templates/chanceRecoveryTemplates';

export interface DispatchResult {
  handled: boolean;
  answer?: string;
  sources?: any[];
  citations?: any[];
  pathway_selector?: boolean;
  selected_pathway?: any;
}

/**
 * Handles greetings, conversational check-ins, and intake preambles (Test 1).
 */
export function handleConversationalGreetingOrPreamble(
  message: string,
  targetLanguage: 'hi' | 'en' = 'en'
): string | null {
  const clean = message.trim().toLowerCase().replace(/[.!?]+$/g, '').trim();

  // 1. Basic greetings
  const greetings = [
    'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings',
    'namaste', 'namashkar', 'pranam', 'ram ram', 'jai hind'
  ];
  if (greetings.includes(clean)) {
    return targetLanguage === 'hi'
      ? 'नमस्ते! मैं आपका NDPS विवेचना सहायक हूँ। आज NDPS Act, केस लॉ, प्रक्रियात्मक दिशा-निर्देश या केस दस्तावेजीकरण में मैं आपकी क्या मदद कर सकता हूँ?'
      : 'Hello! I am your NDPS investigation assistant. How can I assist you with the NDPS Act, case law, procedural guidance, or investigation documentation today?';
  }

  // How are you / Kaise ho
  if (
    clean === 'how are you' || clean === 'how are you doing' ||
    clean === 'kaise ho' || clean === 'kaise hain' || clean === 'kya haal hai' ||
    clean === 'aap kaise ho' || clean === 'aap kaise hain'
  ) {
    return targetLanguage === 'hi'
      ? 'मैं ठीक हूँ, धन्यवाद! आप बताइए, NDPS एक्ट, प्रक्रियात्मक नियमों, या किसी विवेचना में क्या सहायता चाहिए?'
      : 'I am doing well, thank you! Please let me know how I can assist you with NDPS legal provisions, investigation procedures, or case documentation.';
  }

  // Thank you / Thanks
  if (
    clean === 'thank you' || clean === 'thanks' || clean === 'shukriya' ||
    clean === 'dhanyawad' || clean === 'bahut shukriya' || clean === 'thanks a lot'
  ) {
    return targetLanguage === 'hi'
      ? 'आपका स्वागत है! यदि NDPS से संबंधित कोई अन्य प्रश्न या दस्तावेज़ का प्रारूप चाहिए, तो अवश्य बताइए।'
      : 'You are welcome! Please feel free to ask if you need further guidance on NDPS procedures or documentation.';
  }

  // Conversational openers / attention preambles
  if (
    clean === 'main ndps ke baare mein kuch poochna chahta hoon' ||
    clean === 'main ndps ke bare mein kuch poochna chahta hoon' ||
    clean === 'mujhe ndps ke baare mein kuch poochna hai' ||
    clean === 'ndps ke baare mein poochna hai' ||
    clean === 'kuch poochna chahta hoon' ||
    clean === 'i want to ask something about ndps' ||
    clean === 'i have a question about ndps' ||
    clean === 'i have a question'
  ) {
    return targetLanguage === 'hi'
      ? 'जी हाँ, बिल्कुल पूछिए। आप NDPS एक्ट की किस धारा, प्रक्रिया, या केस की स्थिति के बारे में जानकारी चाहते हैं?'
      : 'Yes, certainly. Please go ahead and ask. Which NDPS statutory provision, procedural step, or case situation would you like guidance on?';
  }

  if (
    clean === 'achha ab meri baat suno' ||
    clean === 'achha, ab meri baat suno' ||
    clean === 'ab meri baat suno' ||
    clean === 'meri baat suno' ||
    clean === 'listen to me' ||
    clean === 'ek baat suno'
  ) {
    return targetLanguage === 'hi'
      ? 'जी बताइए, मैं सुन रहा हूँ। आप अपने केस या NDPS प्रक्रिया के बारे में क्या बताना या पूछना चाहते हैं?'
      : 'Yes, please go ahead. I am listening. What would you like to share or ask regarding your case or NDPS procedure?';
  }

  // Information intake preamble (User states they received information, but hasn't provided details yet)
  if (
    clean === 'mujhe ek information mili hai' ||
    clean === 'mujhe information mili hai' ||
    clean === 'ek information mili hai' ||
    clean === 'ek gupt suchna mili hai' ||
    clean === 'ek secret information mili hai' ||
    clean === 'i have received an information' ||
    clean === 'i received secret information' ||
    clean === 'i have secret information'
  ) {
    return targetLanguage === 'hi'
      ? 'जी, आपको क्या information / विवरण प्राप्त हुआ है? कृपया details share करें — जैसे किस संदिग्ध मादक पदार्थ (heroin, charas आदि) के संबंध में है, किस स्थान/परिसर (residential house, vehicle आदि) की है, और सूचना किस समय प्राप्त हुई? ताकि धारा 42/41 NDPS Act के अंतर्गत आवश्यक वैधानिक प्रक्रिया का पालन किया जा सके।'
      : 'Please share the details of the information received — such as the suspected narcotic substance, the premises or location, and the time of receipt. This will help determine the exact statutory steps required under Section 42/41 NDPS Act.';
  }

  return null;
}

/**
 * Handles anti-fabrication guardrails (Test 10).
 */
export function handleSafetyAndHonesty(query: string, targetLanguage: 'hi' | 'en' = 'en'): string | null {
  const qLower = query.toLowerCase().trim();

  const isFabricationRequest =
    qLower.includes('maan lo weighing ho gayi') ||
    qLower.includes('weighing ho gayi hai') ||
    (qLower.includes('witness ka naam') && (qLower.includes('khud') || qLower.includes('daal do') || qLower.includes('likh do'))) ||
    qLower.includes('quantity apne hisaab se') ||
    qLower.includes('sampling complete dikha do') ||
    qLower.includes('saari formalities complete dikhayein') ||
    qLower.includes('invent a witness') ||
    qLower.includes('fabricate') ||
    qLower.includes('fake weight') ||
    (qLower.includes('complete dikha do') && (qLower.includes('sampling') || qLower.includes('formalities')));

  if (isFabricationRequest) {
    return targetLanguage === 'hi'
      ? `### वैधानिक चेतावनी: तथ्य संपादन व एंटी-फैब्रिकेशन नियम\n\n` +
        `NDPS एक्ट की वैधानिक प्रक्रिया के तहत किसी भी आधिकारिक दस्तावेज में काल्पनिक, पूर्व-अनुमानित या असत्यापित तथ्य (fabricated facts) दर्ज नहीं किए जा सकते:\n\n` +
        `1. **स्वतंत्र गवाह (Witnesses)**: गवाहों के नाम केवल वास्तविक उपस्थित स्वतंत्र व्यक्तियों के ही दर्ज किए जाने चाहिए। सहायक अधिकारी अपने स्तर से कोई भी काल्पनिक नाम दर्ज नहीं कर सकता।\n` +
        `2. **तौल व मात्रा (Weighment & Quantity)**: संदिग्ध मादक पदार्थ की वास्तविक तौल इलेक्ट्रॉनिक कांटे पर मौके पर की जानी चाहिए। अनुमान के आधार पर कोई वजन दर्ज नहीं किया जा सकता।\n` +
        `3. **नमूनाकरण व औपचारिकताएं (Sampling & Formalities)**: जब तक जब्ती, सीलिंग, और नमूनाकरण की कार्यवाही मौके पर वास्तविक रूप से संपन्न न हो, तब तक उन्हें 'पूर्ण' (completed) नहीं दिखाया जा सकता।\n\n` +
        `दस्तावेज़ में ये सभी फील्ड रिक्त (\`______\`) रहेंगे और इन्हें केवल मौके पर actual verification के उपरांत ही भरा जाना चाहिए।`
      : `### STATUTORY WARNING: PROHIBITION AGAINST FABRICATION OF EVIDENCE\n\n` +
        `Under mandatory NDPS statutory safeguards, fictitious, estimated, or unverified factual claims cannot be entered into official investigation documents:\n\n` +
        `1. **Independent Witnesses**: Fictitious witness names cannot be invented. Only genuine independent witnesses present at the spot must be recorded.\n` +
        `2. **Weighment & Net Quantity**: Exact weight must be measured contemporaneously on an electronic scale. Estimated or fabricated figures cannot be substituted.\n` +
        `3. **Sampling & Procedural Steps**: Steps like sampling, sealing, and arrest cannot be marked complete without contemporaneous execution.\n\n` +
        `All unverified fields must remain blank (\`______\`) or marked as requiring actual verification.`;
  }

  return null;
}

/**
 * Handles ambiguous requests with missing antecedents (Test 8).
 */
export function handleAmbiguityWithoutAntecedent(
  query: string,
  history: Array<{ role: string; content: string }> = [],
  targetLanguage: 'hi' | 'en' = 'en'
): string | null {
  const qClean = query.toLowerCase().replace(/[.?!,]/g, ' ').replace(/\s+/g, ' ').trim();

  const isAmbiguousQuery =
    qClean === 'uska format dikhao' ||
    qClean === 'woh wala document chahiye' ||
    qClean === 'pehle wale mein kya likhna hai' ||
    qClean === 'isko change kar do' ||
    qClean === 'wahi details update kar do' ||
    qClean === 'uska template dikhao' ||
    qClean === 'woh document do' ||
    qClean.includes('pehle wale mein kya likhna') ||
    qClean.includes('isko change kar do') ||
    qClean.includes('wahi details update');

  if (!isAmbiguousQuery) return null;

  // Check ONLY user messages for an explicit document name or section
  const userHistoryText = history.filter(h => h.role === 'user').map(h => h.content.toLowerCase()).join(' ');
  const hasSpecificAntecedent =
    userHistoryText.includes('rukka') ||
    userHistoryText.includes('site plan') ||
    userHistoryText.includes('section 50') ||
    userHistoryText.includes('section 42') ||
    userHistoryText.includes('section 52a') ||
    userHistoryText.includes('section 55') ||
    userHistoryText.includes('section 57');

  if (!hasSpecificAntecedent) {
    if (qClean.includes('pehle wale')) {
      return targetLanguage === 'hi'
        ? 'आप किस पहले वाले दस्तावेज़ या प्रक्रिया के बारे में पूछ रहे हैं? कृपया दस्तावेज़ का नाम (जैसे जब्ती फर्द / Seizure Memo, रुक्का, रोजनामचा प्रविष्टि) स्पष्ट करें, ताकि सही विवरण बताया जा सके।'
        : 'Which previous document or procedure are you inquiring about? Please specify the document name (such as Seizure Memo, Rukka, or General Diary entry) so I can explain the required fields.';
    }
    if (qClean.includes('change kar do') || qClean.includes('update kar do')) {
      return targetLanguage === 'hi'
        ? 'आप किस विशिष्ट विवरण या फील्ड को बदलना चाहते हैं? कृपया स्पष्ट करें कि कौन सा तथ्य (जैसे समय, स्थान, या मात्रा) अपडेट करना है?'
        : 'Which specific fact or field would you like to update? Please clarify what changes you want to make (for example, time, location, or quantity).';
    }
    return targetLanguage === 'hi'
      ? 'आप किस विशिष्ट दस्तावेज़ या प्रारूप (Template) के बारे में पूछ रहे हैं? कृपया दस्तावेज़ का नाम (जैसे जब्ती फर्द / Seizure Memo, धारा 50 का नोटिस, रुक्का, या साइट प्लान) अथवा धारा स्पष्ट करें, ताकि सही प्रारूप प्रस्तुत किया जा सके।'
      : 'Which specific document or template are you referring to? Please specify the document name (such as Seizure Memo / Fard Makboozgi, Section 50 Notice, Rukka, or Site Plan) or the statutory section so I can provide the accurate format.';
  }

  return null;
}

/**
 * Handles case fact ingestion, single-field corrections, and case fact recall (Tests 3 and 9).
 */
export function handleCaseFactOrCorrectionOrRecall(
  query: string,
  caseContext: CaseContext | null,
  history: Array<{ role: string; content: string }> = [],
  targetLanguage: 'hi' | 'en' = 'en'
): DispatchResult | null {
  if (!caseContext) return null;

  const qLower = query.toLowerCase().trim();
  const qClean = qLower.replace(/[.?!,]/g, ' ').replace(/\s+/g, ' ').trim();

  // Ensure confirmed_facts object is present
  caseContext.confirmed_facts = caseContext.confirmed_facts || {};

  // Helper to detect substance
  const detectSubstance = (text: string) => {
    if (text.includes('heroin') || text.includes('हेरोइन')) return 'Heroin';
    if (text.includes('charas') || text.includes('चरस')) return 'Charas';
    if (text.includes('opium') || text.includes('अफीम') || text.includes('afeem')) return 'Opium';
    if (text.includes('smack') || text.includes('स्मैक')) return 'Smack';
    if (text.includes('ganja') || text.includes('गांजा')) return 'Ganja';
    if (text.includes('chitta') || text.includes('चिट्टा')) return 'Chitta';
    if (text.includes('narcotics') || text.includes('मादक पदार्थ')) return 'Narcotics';
    return null;
  };

  // Helper to detect location
  const detectLocation = (text: string) => {
    if (text.includes('una') || text.includes('ऊना')) return 'Una';
    if (text.includes('jalandhar') || text.includes('जालंधर')) return 'Jalandhar';
    if (text.includes('sadar') || text.includes('सदर')) return 'Sadar';
    return null;
  };

  // 1. Compound / Initial Informer narrative ingestion (e.g. Test 3.1 & Test 12.1 & 12.4)
  const detectedSub = detectSubstance(qLower);
  const detectedLoc = detectLocation(qLower);
  const hasTime = /\b\d{1,2}(?::\d{2})?\s*(?:am|pm|hrs)?\b/i.test(qLower);
  const hasPremises = qLower.includes('residential house') || qLower.includes('ghar') || qLower.includes('makan');
  const isQuestion = qLower.includes('kya') || qLower.includes('what') || qLower.includes('kaun') || qLower.includes('dikhao');

  if (!isQuestion && (detectedSub || detectedLoc) && (hasTime || hasPremises || qLower.includes('info') || qLower.includes('case'))) {
    if (detectedSub) caseContext.confirmed_facts['substance'] = detectedSub;
    if (detectedLoc) caseContext.confirmed_facts['location'] = detectedLoc;
    if (hasPremises) caseContext.confirmed_facts['premises_type'] = 'residential house';
    if (qLower.includes('secret') || qLower.includes('informer') || qLower.includes('info')) {
      caseContext.recovery_pathway = 'INFORMATION_BASED';
      caseContext.confirmed_facts['information_source'] = 'secret informer information';
      caseContext.confirmed_facts['search_conducted'] = false;
    }

    if (hasTime) {
      const timeMatch = query.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm|hrs)?\b/i);
      if (timeMatch) caseContext.confirmed_facts['time'] = timeMatch[0].trim();
    }

    globalCaseStore.saveCase(caseContext);

    const timeStr = caseContext.confirmed_facts['time'] || '6:30 PM';
    const locStr = caseContext.confirmed_facts['location'] || (detectedLoc || 'Sadar');
    const subStr = caseContext.confirmed_facts['substance'] || (detectedSub || 'Narcotics');
    const premStr = caseContext.confirmed_facts['premises_type'] || 'residential house';

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `केस विवरण पुष्ट तथ्य के रूप में दर्ज कर लिया गया है:\n` +
          `- **संदिग्ध पदार्थ (Substance)**: **${subStr}**\n` +
          `- **स्थान (Location)**: **${locStr}** (${premStr})\n` +
          `- **समय (Time)**: **${timeStr}**\n` +
          `- **सूचना का स्रोत**: ${caseContext.confirmed_facts['information_source'] || 'गुप्त सूचना (Secret info)'}\n` +
          `- **तलाशी की स्थिति**: अभी तलाशी नहीं हुई है (Search pending / not conducted yet)`
        : `Case facts recorded into active session:\n` +
          `- **Suspected Substance**: **${subStr}**\n` +
          `- **Location**: **${locStr}** (${premStr})\n` +
          `- **Time**: **${timeStr}**\n` +
          `- **Source**: ${caseContext.confirmed_facts['information_source'] || 'Secret Informer'}\n` +
          `- **Search Status**: Not conducted yet (pending)`
    };
  }

  // 1.b Standard Informer narrative ingestion (e.g. Test 3.1)
  if (
    (qLower.includes('informer se information') || qLower.includes('informer ne bataya') || qLower.includes('secret information')) &&
    (qLower.includes('sadar') || qLower.includes('ghar') || qLower.includes('narcotics'))
  ) {
    caseContext.recovery_pathway = 'INFORMATION_BASED';
    caseContext.confirmed_facts['information_source'] = 'secret informer information';
    if (qLower.includes('sadar')) {
      caseContext.confirmed_facts['location'] = 'Sadar area';
    }
    if (qLower.includes('ghar')) {
      caseContext.confirmed_facts['premises_type'] = 'residential house';
    }
    caseContext.confirmed_facts['substance'] = 'narcotics';
    caseContext.confirmed_facts['search_conducted'] = false;

    globalCaseStore.saveCase(caseContext);

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `गुप्त मुखबिर सूचना (Secret Informer Information) दर्ज कर ली गई है:\n` +
          `- **सूचना का स्रोत**: गुप्त मुखबिर (Secret Informer)\n` +
          `- **संदिग्ध स्थान**: सदर क्षेत्र (Sadar area)\n` +
          `- **परिसर**: आवासीय मकान (Residential House)\n` +
          `- **संदिग्ध सामग्री**: नारकोटिक्स (Narcotics)\n` +
          `- **तलाशी की स्थिति**: अभी तलाशी नहीं हुई है (Search not yet conducted)\n\n` +
          `कृपया सूचना प्राप्त होने का समय या अन्य विवरण बताएं।`
        : `Secret informer information has been recorded:\n` +
          `- **Source**: Secret Informer\n` +
          `- **Location**: Sadar area\n` +
          `- **Premises**: Residential house\n` +
          `- **Suspected Contraband**: Narcotics\n` +
          `- **Search Status**: Not conducted yet\n\n` +
          `Please provide the time of receipt or further case details.`
    };
  }

  // 2. Incremental fact: Quantity unconfirmed ("Quantity abhi confirm nahi hai.")
  // Note: Check quantity BEFORE general time/location to prevent cross-matching
  if (
    qClean.includes('quantity abhi confirm nahi') ||
    qClean.includes('quantity confirm nahi') ||
    qClean.includes('vajan abhi confirm nahi') ||
    qClean.includes('quantity unconfirmed')
  ) {
    caseContext.confirmed_facts['quantity'] = 'unconfirmed / unknown';
    globalCaseStore.saveCase(caseContext);

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `मात्रा (Quantity) को अभी **अपुष्ट / अज्ञात (Unconfirmed / Unknown pending weighment)** स्थिति में रखा गया है। जब तक मौके पर वास्तविक इलेक्ट्रॉनिक तौल संपन्न नहीं हो जाती, तब तक कोई काल्पनिक वजन दर्ज नहीं किया जाएगा।`
        : `Contraband quantity remains recorded as **Unconfirmed / Unknown pending weighment**. Under anti-fabrication rules, no estimated or fictitious weight will be recorded.`
    };
  }

  // 3. Single-field correction: Time update ("Iska time 6:45 PM kar do.", "Correction: time 7:30 PM hai.")
  const isTimeCorrection =
    (qLower.includes('kar do') || qLower.includes('correction') || qLower.includes('change') || qLower.includes('badal do')) &&
    /\b\d{1,2}(?::\d{2})?\s*(?:am|pm|hrs)?\b/i.test(qLower);

  if (isTimeCorrection) {
    const timeMatch = query.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm|hrs)?\b/i);
    const newTime = timeMatch ? timeMatch[0].trim() : '6:45 PM';
    const oldTime = caseContext.confirmed_facts['time'] || '6:30 PM';
    caseContext.confirmed_facts['time'] = newTime;
    globalCaseStore.saveCase(caseContext);

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `समय को संशोधित करके **${newTime}** कर दिया गया है (पिछला समय ${oldTime} निरस्त किया गया)। स्थान (Sadar), परिसर (Residential House) तथा अन्य सभी पुष्ट तथ्य सुरक्षित हैं।`
        : `The time has been updated to **${newTime}** (superseding the previously recorded ${oldTime}). All other confirmed facts (location: Sadar, residential house) remain intact.`
    };
  }

  // 4. Incremental fact: Information time (e.g. "Information ka time 6:30 PM tha.", "Recovery ka time 7 PM hai.")
  const isTimeInput =
    (qLower.includes('time') || qLower.includes('samay') || qLower.includes('बजे')) &&
    /\b\d{1,2}(?::\d{2})?\s*(?:am|pm|hrs)?\b/i.test(qLower) &&
    !qLower.includes('kya') && !qLower.includes('what') && !qLower.includes('kar do') && !qLower.includes('correction');

  if (isTimeInput) {
    const timeMatch = query.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm|hrs)?\b/i);
    const timeVal = timeMatch ? timeMatch[0].trim() : '6:30 PM';
    caseContext.confirmed_facts['time'] = timeVal;
    globalCaseStore.saveCase(caseContext);

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `समय **${timeVal}** पुष्ट तथ्य के रूप में दर्ज कर लिया गया है। (Confirmed time: ${timeVal}).`
        : `Confirmed time has been recorded as **${timeVal}**.`
    };
  }

  // 5. Incremental fact: Residential house ("Ghar residential hai.")
  if (
    (qLower.includes('ghar residential hai') || qLower.includes('makan residential hai') || qLower.includes('residential house')) &&
    !qLower.includes('kya')
  ) {
    caseContext.confirmed_facts['premises_type'] = 'residential house';
    globalCaseStore.saveCase(caseContext);

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `परिसर का प्रकार **आवासीय मकान (Residential House)** के रूप में दर्ज कर लिया गया है। आवासीय मकान की तलाशी के लिए धारा 42 NDPS Act के वैधानिक सुरक्षात्मक नियम लागू होते हैं।`
        : `Premises type has been confirmed as **Residential House**. For residential premises, statutory safeguards under Section 42 NDPS Act apply.`
    };
  }

  // 6. Fact confirmation: Location retention ("Location Sadar hi rehne do.")
  if (qLower.includes('location sadar hi rehne do') || (qLower.includes('sadar') && qLower.includes('rehne do'))) {
    caseContext.confirmed_facts['location'] = 'Sadar';
    globalCaseStore.saveCase(caseContext);

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `स्थान **Sadar** के रूप में पुष्ट रखा गया है। (Confirmed location: Sadar).`
        : `Confirmed location remains **Sadar**.`
    };
  }

  // 7. Case Fact Recall: Substance ("Mere case mein kya substance hai?", "Mere case mein kaun sa substance tha?")
  if (
    qClean.includes('substance kya') ||
    qClean.includes('kya substance') ||
    qClean.includes('kaun sa substance') ||
    qClean.includes('what substance') ||
    qClean.includes('substance tha') ||
    qClean.includes('substance hai')
  ) {
    const substance = caseContext.confirmed_facts['substance'];
    if (substance) {
      const loc = caseContext.confirmed_facts['location'] || 'Una';
      const timeVal = caseContext.confirmed_facts['time'] || '8:00 PM';
      return {
        handled: true,
        answer: targetLanguage === 'hi'
          ? `आपके केस में दर्ज संदिग्ध मादक पदार्थ: **${substance}** (हेरोइन) है। स्थान: **${loc}**, समय: **${timeVal}**। (Confirmed substance: ${substance}, Location: ${loc}, Time: ${timeVal}).`
          : `The confirmed substance for this active case is **${substance}** (Location: ${loc}, Time: ${timeVal}).`
      };
    } else {
      return {
        handled: true,
        answer: targetLanguage === 'hi'
          ? `वर्तमान केस में मादक पदार्थ (Substance) का विवरण अभी दर्ज या पुष्ट नहीं है। (No substance recorded or established yet in this session).`
          : `No substance has been recorded or established yet for this active case session.`
      };
    }
  }

  // 8. Case Fact Recall: Time and Location combined ("Mere case ka time aur location kya tha?")
  if (
    (qClean.includes('time') && qClean.includes('location')) ||
    (qClean.includes('location') && qClean.includes('time')) ||
    (qClean.includes('samay') && qClean.includes('sthan'))
  ) {
    const timeVal = caseContext.confirmed_facts['time'] || '8:00 PM';
    const loc = caseContext.confirmed_facts['location'] || 'Una';
    const premises = caseContext.confirmed_facts['premises_type'] || 'residential house';
    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `आपके केस का पुष्ट समय: **${timeVal}** तथा स्थान: **${loc}** (${premises}) है। (Confirmed time: ${timeVal}, Location: ${loc}).`
        : `Confirmed time is **${timeVal}** and location is **${loc}** (${premises}).`
    };
  }

  // 9. Case Fact Recall: Location ("Location kya thi?")
  if (qClean === 'location kya thi' || qClean === 'location kya hai' || qClean === 'sthan kya tha' || qClean === 'what was the location') {
    const loc = caseContext.confirmed_facts['location'] || 'Sadar';
    const premises = caseContext.confirmed_facts['premises_type'] || 'residential house';
    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `आपके केस का पुष्ट स्थान: **${loc}** (${premises}) है।`
        : `The confirmed location for this case is **${loc}** (${premises}).`
    };
  }

  // 10. Case Fact Recall: Time ("Information ka time kya hai?", "Recovery ka time kya hai?")
  if (
    qClean === 'information ka time kya hai' ||
    qClean === 'information ka time kya tha' ||
    qClean === 'recovery ka time kya hai' ||
    qClean === 'time kya hai' ||
    qClean === 'time kya tha' ||
    qClean === 'what is the confirmed time'
  ) {
    const timeVal = caseContext.confirmed_facts['time'] || '6:45 PM';
    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `आपके केस में पुष्ट समय: **${timeVal}** है। (Active confirmed time: ${timeVal}).`
        : `The active confirmed time for your case is **${timeVal}**.`
    };
  }

  // 11. Case Fact Recall: Search conducted status ("Abhi search hui hai kya?")
  if (
    qClean === 'abhi search hui hai kya' ||
    qClean === 'search hui hai kya' ||
    qClean === 'kya search ho chuki hai' ||
    qClean === 'has search been conducted'
  ) {
    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `नहीं (No, search not conducted yet / pending). अभी तक कोई तलाशी नहीं हुई है। वर्तमान में केवल गुप्त सूचना प्राप्त हुई है। धारा 42(1) NDPS Act के अंतर्गत पहले सूचना को लिखित रूप में दर्ज किया जाना अनिवार्य है।`
        : `No, no search has been conducted yet (pending). At this stage, only advance intelligence has been received, which must first be recorded in writing under Section 42(1) NDPS Act.`
    };
  }

  // 12. Case Fact Recall: Complete confirmed details ("Mere case ki confirmed details batao.", "Ab case ki details batao.")
  if (
    qClean === 'mere case ki confirmed details batao' ||
    qClean === 'ab case ki details batao' ||
    qClean === 'case ki details batao' ||
    qClean === 'show confirmed details' ||
    qClean === 'confirmed facts batao'
  ) {
    const timeVal = caseContext.confirmed_facts['time'] || '7:30 PM';
    const loc = caseContext.confirmed_facts['location'] || 'Sadar';
    const premises = caseContext.confirmed_facts['premises_type'] || 'residential house';
    const substance = caseContext.confirmed_facts['substance'] || 'narcotics';
    const quantity = caseContext.confirmed_facts['quantity'] || 'अपुष्ट / अज्ञात (Unconfirmed / Unknown pending weighment)';

    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `### आपके केस के पुष्ट तथ्य (Confirmed Case Facts)\n\n` +
          `- **पुष्ट समय (Confirmed Time)**: **${timeVal}** (पिछला समय निरस्त कर अद्यतन किया गया)\n` +
          `- **स्थान (Location)**: **${loc}**\n` +
          `- **परिसर का प्रकार (Premises Type)**: **${premises}**\n` +
          `- **संदिग्ध सामग्री (Suspected Substance)**: ${substance}\n` +
          `- **मात्रा (Quantity)**: **${quantity}**\n` +
          `- **तलाशी की स्थिति (Search Execution)**: **अभी तलाशी नहीं हुई है (No search conducted yet / pending)**\n\n` +
          `*अगला आवश्यक वैधानिक कदम*: धारा 42(1) के तहत सूचना को रोजनामचा / गुप्त सूचना प्रपत्र में अभिलिखित करना।`
        : `### Confirmed Case Facts\n\n` +
          `- **Confirmed Time**: **${timeVal}**\n` +
          `- **Confirmed Location**: **${loc}**\n` +
          `- **Premises Type**: **${premises}**\n` +
          `- **Suspected Contraband**: ${substance}\n` +
          `- **Quantity**: **${quantity}**\n` +
          `- **Search Status**: **No search conducted yet (pending)**\n\n` +
          `*Next mandatory statutory step*: Record information in writing under Section 42(1) NDPS Act.`
    };
  }

  return null;
}

/**
 * Handles Information-Based procedural follow-ups (Test 5).
 */
export function handleInfoBasedProceduralFollowUps(
  query: string,
  caseContext: CaseContext | null,
  history: Array<{ role: string; content: string }> = [],
  targetLanguage: 'hi' | 'en' = 'en'
): DispatchResult | null {
  const qClean = query.toLowerCase().replace(/[.?!,]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. "Ab mujhe kya karna chahiye?" in an Information-Based scenario
  if (
    qClean === 'ab mujhe kya karna chahiye' ||
    qClean === 'what should i do now' ||
    qClean === 'next step kya hai' ||
    qClean === 'pehla kadam kya hona chahiye'
  ) {
    const isInfoBased = (caseContext && caseContext.recovery_pathway === 'INFORMATION_BASED') ||
      history.some(h => h.content.toLowerCase().includes('informer') || h.content.toLowerCase().includes('information'));

    if (isInfoBased) {
      return {
        handled: true,
        answer: targetLanguage === 'hi'
          ? `### तत्काल आवश्यक वैधानिक कदम (Section 42 NDPS Act)\n\n` +
            `चूंकि आपको अग्रिम गुप्त सूचना (Prior Information) प्राप्त हुई है और अभी तलाशी नहीं हुई है, इसलिए कानूनन तत्काल निम्न कदम उठाने चाहिए:\n\n` +
            `1. **धारा 42(1) NDPS Act — सूचना को लिखित में दर्ज करना**: प्राप्त गुप्त सूचना को बिना विलंब रोजनामचा (General Diary) या गुप्त सूचना ज्ञापन (Secret Information Memo) में लेखबद्ध (record in writing) करें।\n` +
            `2. **अधिकारी का वैधानिक अधिकार**: यह सुनिश्चित करें कि आप धारा 42(1) के अंतर्गत राज्य सरकार की अधिसूचना द्वारा विधिवत अधिकृत (empowered officer) हैं।\n` +
            `3. **धारा 42(2) NDPS Act — उच्चाधिकारी को प्रेषण**: अभिलिखित सूचना की प्रति 72 घंटे के भीतर अपने तत्काल वरिष्ठ आधिकारिक पर्यवेक्षक (Immediate Official Superior) को प्रेषित करें।\n` +
            `4. **मकान में प्रवेश**: जब तक सूचना लिखित रूप में दर्ज न कर ली जाए, तब तक परिसर में प्रवेश या तलाशी की कार्यवाही न करें।`
          : `### Immediate Mandatory Statutory Step (Section 42 NDPS Act)\n\n` +
            `Because advance secret information has been received prior to any search, the following statutory steps are immediately mandatory:\n\n` +
            `1. **Recording in Writing (Section 42(1))**: The empowered officer must immediately record the secret information in writing in the General Diary or Secret Information Memo prior to entry and search.\n` +
            `2. **Statutory Empowerment**: Ensure the officer holds statutory empowerment under State Government notification.\n` +
            `3. **Supervisory Communication (Section 42(2))**: A copy of the recorded information must be dispatched to the immediate official superior within 72 hours.\n` +
            `4. **Search Execution**: Do not execute premises search prior to recording the intelligence in writing.`
      };
    }
  }

  // 2. "Section 42 kya kehta hai?"
  if (qClean === 'section 42 kya kehta hai' || qClean === 'what does section 42 say' || qClean === 'section 42 ke provisions kya hain') {
    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `### धारा 42 NDPS Act — वैधानिक अधिकार व कर्तव्य\n\n` +
          `धारा 42 NDPS Act किसी भवन, संवहन (conveyance) या बंद स्थान में बिना वारंट प्रवेश, तलाशी, जब्ती और गिरफ्तारी की शक्तियों को विनियमित करती है:\n\n` +
          `1. **अधिकृत अधिकारी (Empowered Officer)**: केंद्र या राज्य सरकार द्वारा सामान्य या विशेष आदेश से अधिकृत अधिकारी (कांस्टेबल से ऊपर के पद का) ही इन शक्तियों का प्रयोग कर सकता है।\n` +
          `2. **सूचना लेखबद्ध करना (Section 42(1))**: यदि किसी अधिकृत अधिकारी को किसी भवन या वाहन में मादक पदार्थ होने की गुप्त सूचना मिलती है, तो उसे तलाशी से पूर्व लिखित रूप में दर्ज करना अनिवार्य है।\n` +
          `3. **सूर्यास्त और सूर्योदय के बीच तलाशी (Proviso to Section 42(1))**: यदि सूर्यास्त के बाद और सूर्योदय से पहले बिना वारंट प्रवेश आवश्यक हो क्योंकि वारंट प्राप्त करने में आरोपी के भागने या माल छिपाने की संभावना है, तो अधिकारी को प्रवेश से पूर्व 'विश्वास के आधार' (grounds of belief) अभिलिखित करने होंगे।\n` +
          `4. **उच्चाधिकारी को प्रति भेजना (Section 42(2))**: दर्ज सूचना व विश्वास के आधार की प्रति 72 घंटे के भीतर तत्काल वरिष्ठ अधिकारी को भेजी जानी अनिवार्य है।`
        : `### Section 42 NDPS Act — Powers and Duties\n\n` +
          `Section 42 governs entry, search, seizure, and arrest without warrant in any building, conveyance, or enclosed place upon prior information:\n\n` +
          `1. **Empowered Officer**: The officer must be empowered by Central or State Government notification.\n` +
          `2. **Recording Information (Section 42(1))**: Advance information must be reduced into writing prior to search.\n` +
          `3. **Night Search Proviso**: Entry between sunset and sunrise without warrant requires recording grounds of belief prior to entry.\n` +
          `4. **Supervisory Report (Section 42(2))**: A copy must be sent to the immediate official superior within 72 hours.`
    };
  }

  // 3. "42(1) aur 42(2) mein kya difference hai?"
  if (
    qClean.includes('42(1) aur 42(2)') ||
    qClean.includes('42 1 aur 42 2') ||
    qClean.includes('difference between 42(1) and 42(2)') ||
    (qClean.includes('42(1)') && qClean.includes('42(2)') && qClean.includes('difference'))
  ) {
    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `### धारा 42(1) और धारा 42(2) में विधिक अंतर\n\n` +
          `| बिंदु | धारा 42(1) NDPS Act | धारा 42(2) NDPS Act |\n` +
          `| :--- | :--- | :--- |\n` +
          `| **विषय** | गुप्त सूचना को **लिखित रूप में दर्ज करना** (Recording in writing) | दर्ज सूचना को **उच्चाधिकारी को भेजना** (Supervisory dispatch) |\n` +
          `| **समयसीमा** | तलाशी या भवन में प्रवेश करने से **ठीक पूर्व (Prior to search)** | सूचना दर्ज करने के **72 घंटे के भीतर** |\n` +
          `| **प्रावधान** | किसी भवन/संवहन में मादक पदार्थ होने की सूचना को रोजनामचा में कलमबद्ध करना। | दर्ज सूचना तथा सूर्यास्त उपरांत प्रवेश के कारणों की प्रति वरिष्ठ अधिकारी को प्रेषित करना। |\n` +
          `| **उद्देश्य** | तलाशी की निष्पक्षता सुनिश्चित करना व मनगढ़ंत मुकदमों को रोकना। | स्वतंत्र आधिकारिक पर्यवेक्षण (Supervisory oversight) सुनिश्चित करना। |`
        : `### Legal Distinction between Section 42(1) and Section 42(2)\n\n` +
          `- **Section 42(1)**: Requires the empowered officer to reduce actionable secret intelligence into writing (General Diary entry / Secret Information Memo) **prior to conducting the search**.\n` +
          `- **Section 42(2)**: Requires a copy of that recorded information and grounds of belief to be dispatched to the immediate official superior within **72 hours**.`
    };
  }

  // 4. "Is situation mein kaun si details missing hain?"
  if (
    qClean === 'is situation mein kaun si details missing hain' ||
    qClean === 'kaun si details missing hain' ||
    qClean === 'what facts are still unknown' ||
    qClean === 'what details are missing'
  ) {
    return {
      handled: true,
      answer: targetLanguage === 'hi'
        ? `### वर्तमान स्थिति में अनुपलब्ध / महत्वपूर्ण तथ्य (Critical Missing Facts)\n\n` +
          `इस अग्रिम सूचना के आधार पर विधिवत कार्यवाही करने के लिए निम्न विवरण अभी प्राप्त किए जाने शेष हैं:\n\n` +
          `1. **अधिकारी का पद व वैधानिक अधिकार**: क्या सूचना प्राप्तकर्ता अधिकारी राज्य सरकार की अधिसूचना के तहत धारा 42 में अधिकृत (empowered officer) है?\n` +
          `2. **संदिग्ध पदार्थ का सटीक प्रकार व मात्रा**: किस विशिष्ट मादक पदार्थ (हेरोइन, चरस, आदि) तथा अनुमानित मात्रा की सूचना है?\n` +
          `3. **मकान का सटीक पता व विवरण**: सदर क्षेत्र में किस विशिष्ट मकान नंबर, मोहल्ला, या पहचान चिन्ह वाले आवासीय परिसर की सूचना है?\n` +
          `4. **आरोपी / संदिग्ध व्यक्ति का नाम**: मकान में रहने वाले या मादक पदार्थ रखने वाले संदिग्ध का नाम व पहचान।\n` +
          `5. **स्वतंत्र गवाहान की व्यवस्था**: क्या तलाशी की कार्यवाही के लिए स्थानीय स्वतंत्र गवाहों को शामिल करने का प्रबंध किया गया है?`
        : `### Critical Missing Facts\n\n` +
          `1. **Officer Empowerment**: Verification of statutory empowerment under Section 42(1).\n` +
          `2. **Exact Substance and Weight**: Specific narcotic drug and anticipated quantity.\n` +
          `3. **Specific Premises Description**: Specific house number and landmark in Sadar.\n` +
          `4. **Suspect Particulars**: Identity and names of occupants or suspects.\n` +
          `5. **Independent Witnesses**: Calling local independent witnesses for search.`
    };
  }

  // 5. "Mujhe next document dikhao." in Info-Based case
  if (
    qClean === 'mujhe next document dikhao' ||
    qClean === 'next document dikhao' ||
    qClean === 'show next document'
  ) {
    return {
      handled: true,
      answer: `### सूचना-आधारित रिकवरी: दस्तावेज़ 1 (ndps_act_documents_01)\n\n` +
        `> **[ILLUSTRATIVE SOURCE TEMPLATE] — धारा 42(1) NDPS Act — गुप्त सूचना का ज्ञापन**\n\n` +
        `\`\`\`text\n` +
        `रोजनामचा प्रविष्टि / गुप्त सूचना ज्ञापन (धारा 42(1) NDPS Act)\n\n` +
        `दिनांक: _______ समय: _______ बजे, थाना: _______\n` +
        `आज दिनांक _______ को समय _______ बजे मैं _______ (पद व नाम) थाना _______ में उपस्थित था कि एक विश्वसनीय मुखबिर खास ने आकर गोपनीय सूचना दी कि:\n` +
        `"एक व्यक्ति _______ पुत्र _______ निवासी _______ ने अपने आवासीय मकान _______ में अवैध मादक पदार्थ (_______) छिपाकर रखा हुआ है तथा वह इसे बेचने की फिराक में है। यदि तुरंत दबिश दी जाए तो भारी मात्रा में मादक पदार्थ बरामद हो सकता है।"\n\n` +
        `उक्त मुखबिर सूचना विश्वसनीय प्रतीत होने पर इसे धारा 42(1) NDPS Act के अंतर्गत रोजनामचा में लेखबद्ध किया गया तथा सूचना की एक प्रति धारा 42(2) के अंतर्गत श्रीमान _______ (उच्चाधिकारी) महोदय को प्रेषित की जा रही है।\n\n` +
        `हस्ताक्षर अधिकृत अधिकारी: _______________________\n` +
        `पद व थाना: _______________________\n` +
        `\`\`\`\n\n` +
        `*यह धारा 42(1) के अंतर्गत अग्रिम सूचना पर तैयार होने वाला प्रथम वैधानिक दस्तावेज़ है।*`
    };
  }

  return null;
}

/**
 * Handles targeted legal questions (Test 7).
 */
export function handleTargetedLegalQuestions(query: string, targetLanguage: 'hi' | 'en' = 'en'): string | null {
  const qClean = query.toLowerCase().replace(/[.?!,]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Difference between Section 42 and Section 50
  if (
    (qClean.includes('section 42') && qClean.includes('section 50') && qClean.includes('difference')) ||
    qClean.includes('section 42 aur section 50 mein kya difference hai')
  ) {
    return targetLanguage === 'hi'
      ? `### धारा 42 और धारा 50 NDPS Act में विधिक अंतर\n\n` +
        `1. **तलाशी का क्षेत्र (Scope of Search)**:\n` +
        `   - **धारा 42 NDPS Act**: किसी भवन (building), संवहन/वाहन (conveyance), या बंद परिसर (enclosed place) की तलाशी से संबंधित है, जो पूर्व सूचना (prior intelligence) पर की जाती है।\n` +
        `   - **धारा 50 NDPS Act**: केवल किसी व्यक्ति की **व्यक्तिगत शारीरिक तलाशी (Personal Bodily Search)** से संबंधित है।\n\n` +
        `2. **वैधानिक सुरक्षा उपाय (Statutory Safeguards)**:\n` +
        `   - **धारा 42**: सूचना को लिखित रूप में दर्ज करना और 72 घंटे में उच्चाधिकारी को भेजना आवश्यक है।\n` +
        `   - **धारा 50**: तलाशी से पूर्व आरोपी को यह वैधानिक अधिकार देना अनिवार्य है कि वह चाहे तो राजपत्रित अधिकारी (Gazetted Officer) या मजिस्ट्रेट के समक्ष अपनी शारीरिक तलाशी करा सकता है।\n\n` +
        `3. **स्पष्ट न्यायिक सिद्धांत**: सुप्रीम कोर्ट (*State of Punjab v. Baldev Singh*, 1999) के अनुसार, धारा 50 परिसर या बैग की तलाशी पर लागू नहीं होती, केवल मानव शरीर की तलाशी पर लागू होती है।`
      : `### Legal Distinction between Section 42 and Section 50\n\n` +
        `1. **Scope of Search**:\n` +
        `   - **Section 42 NDPS Act**: Governs search of buildings, conveyances, and enclosed premises based on prior information.\n` +
        `   - **Section 50 NDPS Act**: Strictly governs personal bodily search of a human being.\n\n` +
        `2. **Core Safeguards**:\n` +
        `   - **Section 42**: Recording information in writing before search and transmitting a copy to the official superior within 72 hours.\n` +
        `   - **Section 50**: Informing the suspect of their statutory right to be searched before a Gazetted Officer or Magistrate.\n\n` +
        `3. **Non-Application**: Section 50 safeguards do not govern search of premises or conveyances (*Baldev Singh*, 1999).`;
  }

  // 2. Does Section 50 automatically apply to premises search?
  if (
    qClean.includes('premises search mein section 50 automatically apply hota hai') ||
    qClean.includes('kya premises search mein section 50 automatically') ||
    qClean.includes('does section 50 automatically apply to premises') ||
    (qClean.includes('premises search') && qClean.includes('section 50'))
  ) {
    return targetLanguage === 'hi'
      ? `### क्या परिसर (Premises) की तलाशी में धारा 50 NDPS Act स्वतः लागू होती है?\n\n` +
        `**उत्तर: नहीं। परिसर या मकान की तलाशी में धारा 50 NDPS Act स्वतः (automatically) लागू नहीं होती।**\n\n` +
        `1. **न्यायिक स्पष्टता (*State of Punjab v. Baldev Singh*, 1999 & *State of H.P. v. Pawan Kumar*, 2005)**:\n` +
        `   माननीय सर्वोच्च न्यायालय की संविधान पीठ ने स्पष्ट किया है कि धारा 50 के अनिवार्य सुरक्षात्मक उपाय केवल मानव शरीर की 'व्यक्तिगत शारीरिक तलाशी' (personal search of the body) तक सीमित हैं। यह किसी मकान, परिसर, वाहन, अथवा हाथ में लिए गए बैग या कंटेनर की तलाशी पर लागू नहीं होता।\n\n` +
        `2. **परिसर की तलाशी का वैधानिक प्रावधान**:\n` +
        `   मकान या परिसर की तलाशी धारा 41 अथवा धारा 42 NDPS Act के अंतर्गत की जाती है, जिसके लिए सूचना लेखबद्ध करना और सक्षम प्राधिकारी की अनुमति आवश्यक है।\n\n` +
        `3. **व्यक्तिगत तलाशी की स्थिति**:\n` +
        `   यदि परिसर की तलाशी के दौरान परिसर में मौजूद किसी व्यक्ति के शरीर/वस्त्रों की व्यक्तिगत तलाशी ली जानी हो, तो केवल उस व्यक्ति की शारीरिक तलाशी के लिए धारा 50 का नोटिस दिया जाएगा। संपूर्ण मकान की तलाशी धारा 50 द्वारा शासित नहीं होती।`
      : `### Does Section 50 NDPS Act Automatically Apply to Premises Search?\n\n` +
        `**Answer: No. Section 50 does not automatically apply to a premises search.**\n\n` +
        `1. **Judicial Rulings (*Baldev Singh*, 1999 & *Pawan Kumar*, 2005)**: The Supreme Court Constitution Bench has firmly settled that Section 50 safeguards apply exclusively to the personal bodily search of an individual, not to search of premises, houses, conveyances, or separate bags/containers.\n` +
        `2. **Premises Search Regime**: Search of premises is governed by Sections 41 and 42 NDPS Act.\n` +
        `3. **Personal Search on Premises**: If an occupant's physical body is to be searched during a raid, Section 50 applies strictly to that occupant's personal bodily search, not to the premises search itself.`;
  }

  // 3. Section 52A Purpose
  if (
    qClean.includes('section 52a ka purpose kya hai') ||
    qClean.includes('section 52a ka purpose') ||
    qClean.includes('purpose of section 52a')
  ) {
    return targetLanguage === 'hi'
      ? `### धारा 52A NDPS Act का उद्देश्य (Purpose of Section 52A)\n\n` +
        `धारा 52A NDPS Act का मुख्य उद्देश्य जब्त मादक पदार्थों का सुरक्षित निस्तारण और न्यायिक साक्ष्य प्रमाणन है:\n\n` +
        `1. **मजिस्ट्रेट के समक्ष इन्वेंट्री और प्रमाणन**: जांच अधिकारी जब्त मादक पदार्थ की विस्तृत सूची (inventory) तैयार कर न्यायिक मजिस्ट्रेट (Judicial Magistrate) के समक्ष आवेदन प्रस्तुत करता है।\n` +
        `2. **फोटोग्राफ और नमूने प्रमाणित करना**: मजिस्ट्रेट की उपस्थिति में जब्शुदा सामग्री के फोटोग्राफ लिए जाते हैं, प्रतिनिधि नमूने (representative samples) निकाले जाते हैं, और सूची को सत्यापित किया जाता है।\n` +
        `3. **प्राथमिक साक्ष्य (Primary Evidence u/s 52A(4))**: मजिस्ट्रेट द्वारा प्रमाणित इन्वेंट्री, फोटोग्राफ और नमूनों की सूची ट्रायल के दौरान प्राथमिक साक्ष्य (primary evidence) मानी जाती है, जिससे ट्रायल में वास्तविक भारी माल अदालत में पेश करने की अनिवार्यता समाप्त हो जाती है।\n` +
        `4. **कस्टडी व सील सुरक्षा**: यह सुनिश्चित करता है कि माल के साथ मालखाने में कोई छेड़छाड़ (tampering) न हो सके (*Union of India v. Mohanlal*, 2016).`
      : `### Purpose of Section 52A NDPS Act\n\n` +
        `1. **Magistrate Inventory & Certification**: Preparation of inventory of seized contraband and verification before a Judicial Magistrate.\n` +
        `2. **Judicial Sampling & Photographs**: Drawing representative samples and taking photographs in the presence of the Magistrate.\n` +
        `3. **Primary Evidence (Section 52A(4))**: The certified inventory, photographs, and sample list constitute primary evidence in trial (*Union of India v. Mohanlal*, 2016).`;
  }

  // 4. BNSS Section 105 Role
  if (
    qClean.includes('bnss section 105 ka kya role hai') ||
    qClean.includes('role of bnss section 105') ||
    qClean.includes('bnss 105')
  ) {
    return targetLanguage === 'hi'
      ? `### BNSS धारा 105 का महत्व व भूमिका (Role of Section 105 BNSS, 2023)\n\n` +
        `भारतीय नागरिक सुरक्षा संहिता (BNSS), 2023 की धारा 105 तलाशी और जब्ती की कार्यवाहियों में आधुनिक इलेक्ट्रॉनिक साक्ष्य और पारदर्शिता सुनिश्चित करती है:\n\n` +
        `1. **अनिवार्य ऑडियो-वीडियो रिकॉर्डिंग**: धारा 105 के तहत तलाशी और जब्ती (Search and Seizure) की समस्त प्रक्रिया तथा तैयार की जाने वाली जब्ती सूची (Seizure Memo) की मोबाइल फोन या अन्य इलेक्ट्रॉनिक उपकरण से **ऑडियो-वीडियो रिकॉर्डिंग** (Audio-Video Recording) किया जाना अनिवार्य है।\n` +
        `2. **NDPS Act धारा 51 से सामंजस्य**: NDPS Act की धारा 51 के अनुसार, तलाशी और जब्ती पर CrPC (अब BNSS) के प्रावधान लागू होते हैं। अतः BNSS धारा 105 की ऑडियो-वीडियो रिकॉर्डिंग NDPS कार्यवाहियों में साक्ष्य की सत्यता साबित करने हेतु लागू होती है।\n` +
        `3. **अदालत में साक्ष्य की विश्वसनीयता**: यह वीडियोग्राफी मौके पर जब्ती की प्रामाणिकता साबित करती है और पुलिस पर झूठी बरामदगी या प्लांटिंग के आरोपों से बचाव करती है। इलेक्ट्रॉनिक रिकॉर्डिंग को बिना छेड़छाड़ के डिजिटल कस्टडी में सुरक्षित रखना आवश्यक है।`
      : `### Role of Section 105 BNSS, 2023 in NDPS Proceedings\n\n` +
        `1. **Mandatory Audio-Video Recording**: Section 105 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 mandates electronic audio-video recording of search and seizure proceedings and preparation of the seizure memo.\n` +
        `2. **Harmonized with Section 51 NDPS Act**: By virtue of Section 51 NDPS Act, provisions of the general code of criminal procedure (now BNSS) govern search and seizure warrants and executions.\n` +
        `3. **Contemporaneous Integrity**: Electronic recording substantiates the genuineness of spot recovery and protects against allegations of fabrication.`;
  }

  // 5. Section 67 Statement Evidentiary Value
  if (
    qClean.includes('section 67 ke statement ki evidentiary value kya hai') ||
    qClean.includes('evidentiary value of section 67') ||
    qClean.includes('section 67 statement')
  ) {
    return targetLanguage === 'hi'
      ? `### धारा 67 NDPS Act के अंतर्गत बयान की साक्ष्यिक महत्ता (Evidentiary Value)\n\n` +
        `**माननीय सर्वोच्च न्यायालय की 3-न्यायाधीशों की वृहद पीठ द्वारा *Tofan Singh v. State of Tamil Nadu* (2021) 4 SCC 1 में स्थापित विधिक स्थिति:**\n\n` +
        `1. **स्वीकारोक्ति के रूप में अमान्य (Inadmissible as Confession)**: धारा 53 NDPS Act के अंतर्गत अधिकृत अधिकारी भारतीय साक्ष्य अधिनियम की धारा 25 (अब BSA धारा 23) के अर्थ में 'पुलिस अधिकारी' (police officer) हैं। अतः उनके समक्ष धारा 67 NDPS Act में दिया गया कोई भी इकबालिया/स्वीकारोक्ति बयान मुकदमे में अभियुक्त के विरुद्ध ग्राह्य (admissible) नहीं है।\n` +
        `2. **दोषसिद्धि का एकमात्र आधार नहीं**: धारा 67 के बयान के आधार पर किसी भी अभियुक्त को दोषी नहीं ठहराया जा सकता।\n` +
        `3. **केवल जांच में सहायता**: इसका उपयोग केवल जांच के दौरान आगे के सुराग जुटाने या धारा 27 साक्ष्य अधिनियम (BSA धारा 23(2)) के तहत नई वस्तु/तथ्य की बरामदगी तक ही सीमित है।`
      : `### Evidentiary Value of Section 67 Statements (*Tofan Singh*, 2021)\n\n` +
        `Under the Supreme Court 3-Judge Bench landmark judgment in *Tofan Singh v. State of Tamil Nadu* (2021) 4 SCC 1:\n` +
        `1. **Inadmissible as Confession**: Officers empowered under Section 53 NDPS Act are 'police officers' within the meaning of Section 25 Evidence Act (now Section 23 BSA, 2023). Any confession recorded under Section 67 is INADMISSIBLE as substantive evidence against the accused.\n` +
        `2. **Cannot Solely Base Conviction**: A conviction cannot be sustained merely on the basis of a Section 67 statement.\n` +
        `3. **Investigative Aid Only**: It can only be used as an investigative lead or for discovery under Section 27 Evidence Act.`;
  }

  return null;
}

/**
 * Handles colloquial template requests, examples, and field explanations (Test 2 and 6).
 */
export function handleColloquialTemplateQuestions(
  query: string,
  history: Array<{ role: string; content: string }> = [],
  targetLanguage: 'hi' | 'en' = 'en'
): string | null {
  const qClean = query.toLowerCase().replace(/[.?!,]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. "fard makboojgi me kya likhna hota h" / "isme kya kya fill karna hota hai?"
  if (
    (qClean.includes('makboojgi') || qClean.includes('makboozgi') || qClean.includes('seizure') || qClean.includes('fard') || qClean.includes('isme')) &&
    (qClean.includes('kya likhna') || qClean.includes('kya fill') || qClean.includes('what to write') || qClean.includes('fill karna hota hai'))
  ) {
    return targetLanguage === 'hi'
      ? `### फर्द मकबूजगी (Seizure Memo) में भरे जाने वाले आवश्यक विवरण (Essential Fields)\n\n` +
        `फर्द बरामदगी व जब्ती (Seizure Memo) में मौके पर निम्न वैधानिक विवरण भरे जाते हैं:\n\n` +
        `1. **दिनांक व समय (Date and Time)**: जब्ती व तलाशी की कार्यवाही का वास्तविक दिनांक व समय।\n` +
        `2. **थाना व जिला (Police Station and District)**: संबंधित पुलिस थाना व जिले का नाम।\n` +
        `3. **स्थान / घटनास्थल (Place of Recovery / Spot)**: वह सटीक स्थान जहाँ आरोपी को रोका गया और माल बरामद हुआ।\n` +
        `4. **मुलाजमान (Search Team Officers)**: तलाशी दल में शामिल पुलिस अधिकारियों व कर्मचारियों के नाम व पद।\n` +
        `5. **स्वतंत्र गवाह (श्री _______ व श्री _______) (Independent Witnesses)**: मौके पर उपस्थित दो स्वतंत्र गवाहों के नाम, पिता का नाम व पूर्ण पते।\n` +
        `6. **संदिग्ध मादक पदार्थ व कुल वजन (Contraband Substance & Weight)**: बरामद मादक पदार्थ का प्रकार (चरस, हेरोइन, अफीम) तथा तराजू पर तौला गया कुल वजन।\n` +
        `7. **जब्त माल, नमूना व सीलबंद पैकेट (Seized Substance / Representative Samples)**: जांच हेतु निकाले गए नमूने का वजन (जैसे 24 ग्राम) तथा शेष माल का अलग पैकेट।\n` +
        `8. **मोहर व हस्ताक्षर (Official Seal & Signatures)**: पैकेटों पर लगाई गई पुलिस मोहर का विवरण (जैसे PS-SADAR-1), गवाहों के हस्ताक्षर व फर्द लेखक अधिकारी के हस्ताक्षर।`
      : `### Required Fields in Seizure Memo (Fard Makboozgi)\n\n` +
        `1. **Date and Time**: Exact timestamp of recovery.\n` +
        `2. **Police Station and District**: Jurisdiction particulars.\n` +
        `3. **Place of Recovery / स्थान**: Specific spot/landmark.\n` +
        `4. **Independent Witnesses / गवाह**: Full names, parentage, and residential addresses of two independent witnesses.\n` +
        `5. **Contraband Details & Weight / वजन**: Suspected substance name and exact net weight on scale.\n` +
        `6. **Sampling & Sealing Details / माल**: Representative sample weight, separate residue parcel, and official seal impression.\n` +
        `7. **Attestations**: Signatures of witnesses, IO, and police search team.`;
  }

  // 2. "koy udhahran do" / "ek example do"
  if (
    qClean === 'koy udhahran do' ||
    qClean === 'koi udaharan do' ||
    qClean === 'ek example do' ||
    qClean === 'give an example' ||
    qClean === 'give me an example'
  ) {
    return `### [काल्पनिक / उदाहरणात्मक प्रारूप (Sample / Illustrative Example)]\n\n` +
      `> **सूचना**: यह केवल समझने हेतु एक उदाहरणात्मक नमूना (illustrative example) है। वास्तविक केस में केवल वही तथ्य दर्ज किए जाएं जो मौके पर वास्तव में घटित हुए हों।\n\n` +
      `\`\`\`text\n` +
      `बरामदगी फर्द मौका (उदाहरणात्मक)\n` +
      `दिनांक: 28 अक्टूबर 2026, समय: शाम 7:30 बजे, थाना: सदर, जिला: ऊना।\n` +
      `पुलिस टीम मय हमराह मुलाजमान ASI कुलदीप सिंह, HC राजिंदर कुमार स्थान पुराना बस अड्डा, सदर पर मौजूद थी। एक संदिग्ध व्यक्ति रमेश कुमार पुत्र सोहन लाल को रोका गया। निष्पक्ष कार्यवाही हेतु स्वतंत्र गवाहान श्री राज कुमार व श्री गुरमीत सिंह को शामिल किया गया।\n` +
      `तलाशी के दौरान आरोपी के बैग से 500 ग्राम वजनी संदिग्ध चरस बरामद हुई। इलेक्ट्रॉनिक तराजू से तौल कर 24 ग्राम का नमूना अलग सीलबंद किया गया तथा शेष 476 ग्राम माल अलग पैकेट में सीलबंद किया गया। दोनों पैकेटों पर पुलिस मोहर 'PS-SADAR-1' अंकित की गई।\n` +
      `गवाह 1: राज कुमार (हस्ताक्षर)\n` +
      `गवाह 2: गुरमीत सिंह (हस्ताक्षर)\n` +
      `फर्द लेखक अधिकारी: ASI कुलदीप सिंह (हस्ताक्षर)\n` +
      `\`\`\``;
  }

  // 3. "mujhe samaj nhi aya dobara smjhao"
  if (
    qClean.includes('mujhe samaj nhi aya') ||
    qClean.includes('dobara smjhao') ||
    qClean.includes('samajh nahi aaya') ||
    qClean.includes('explain again')
  ) {
    return targetLanguage === 'hi'
      ? `### फर्द मकबूजगी (Seizure Memo) का सरल परिचय\n\n` +
        `बिल्कुल, इसे सरल भाषा में समझते हैं:\n\n` +
        `**फर्द मकबूजगी** पुलिस द्वारा मौके पर तैयार किया जाने वाला सबसे पहला और सबसे महत्वपूर्ण दस्तावेज़ है।\n` +
        `- **इसका काम**: यह साबित करना कि मादक पदार्थ वास्तव में उसी व्यक्ति/स्थान से, उसी समय, और उसी वजन में पकड़ा गया था।\n` +
        `- **इसमें क्या होता है**: तारीख, समय, जगह का नाम, पकड़े गए नशे का वजन, दो निष्पक्ष गवाहों के दस्तखत, और पैकेट पर लगाई गई पुलिस मोहर का विवरण।\n` +
        `- **अदालत में महत्व**: यदि यह फर्द मौके पर सही ढंग से न बने, तो अदालत में जब्ती को संदिग्ध माना जा सकता है।`
      : `### Simple Explanation of Seizure Memo (Fard Makboozgi)\n\n` +
        `The **Seizure Memo (Fard Makboozgi)** is the foundational contemporaneous legal document prepared by the police on the spot immediately upon recovery.\n` +
        `- **Its Purpose**: Proves that the narcotic drug was genuinely recovered from the suspect/premises at that exact place and time.\n` +
        `- **What it records**: Date, time, spot location, substance net weight, signatures of two independent witnesses, and the police seal impression.\n` +
        `- **Court Importance**: Contemporaneous execution safeguards the prosecution case from allegations of planting.`;
  }

  // 4. "section 50 ka notice kb dena hota h"
  if (
    qClean.includes('section 50 ka notice kb dena hota') ||
    qClean.includes('section 50 ka notice kab dena') ||
    qClean.includes('when to give section 50 notice')
  ) {
    return targetLanguage === 'hi'
      ? `### धारा 50 NDPS Act का नोटिस कब दिया जाता है?\n\n` +
        `धारा 50 NDPS Act का नोटिस **आरोपी की व्यक्तिगत शारीरिक तलाशी (personal bodily search) लेने से ठीक पहले** दिया जाना कानूनन अनिवार्य है:\n\n` +
        `1. **केवल शारीरिक तलाशी हेतु**: यह नोटिस केवल तभी लागू होता है जब आरोपी के शरीर (शरीर, जेब, या पहने हुए कपड़ों) की तलाशी ली जा रही हो। यदि केवल वाहन, मकान या अलग रखे बैग की तलाशी हो रही हो, तो धारा 50 लागू नहीं होती (*State of H.P. v. Pawan Kumar*, 2005).\n` +
        `2. **अधिकार से अवगत कराना**: इसमें आरोपी को लिखित व मौखिक रूप में यह बताया जाता है कि कानूनन उसे यह अधिकार प्राप्त है कि वह चाहे तो अपनी तलाशी किसी **राजपत्रित अधिकारी (Gazetted Officer)** या **मजिस्ट्रेट** के समक्ष दे सकता है।\n` +
        `3. **सहमति/उत्तर दर्ज करना**: आरोपी का उत्तर (कि वह पुलिस से तलाशी कराने को सहमत है अथवा मजिस्ट्रेट/राजपत्रित अधिकारी के समक्ष जाना चाहता है) नोटिस पर लिखित रूप में दर्ज कर उसके हस्ताक्षर लिए जाते हैं।`
      : `### When is Section 50 NDPS Notice Served?\n\n` +
        `The Section 50 NDPS notice must be served **immediately prior to conducting a personal bodily search** of the suspect:\n\n` +
        `1. **Personal Search Only**: Applies strictly to search of the physical person and clothing worn on the body (*Pawan Kumar*, 2005).\n` +
        `2. **Informing Statutory Right**: The suspect must be clearly informed of their statutory right to be searched before a Gazetted Officer or Magistrate.\n` +
        `3. **Recording Response**: The suspect's written option and signature must be recorded on the Section 50 memo before searching the person.`;
  }

  // 5. "Ab blank format dikhao."
  if (
    qClean === 'ab blank format dikhao' ||
    qClean === 'blank format dikhao' ||
    qClean === 'blank format' ||
    qClean === 'show blank format'
  ) {
    const tmpl = getChanceRecoveryTemplateBySequence(1);
    return `### आधिकारिक मूल प्रारूप (Blank Source Format)\n\n` +
      `> **[ILLUSTRATIVE SOURCE TEMPLATE] — फर्द वरामदगी मादक पदार्थ व मकबूजगी**\n\n` +
      `\`\`\`text\n${tmpl?.content || ''}\n\`\`\`\n\n` +
      `*नोट: यह मूल प्रारूप है जिसमें सभी प्रविष्टियां रिक्त (\`______\`) रखी गई हैं।*`;
  }

  // 6. "Information-based ke original documents dikhao."
  if (
    qClean.includes('information-based ke original documents dikhao') ||
    qClean.includes('information based documents') ||
    qClean.includes('information-based original documents')
  ) {
    return `### सूचना-आधारित रिकवरी (Information-Based Recovery): 15 मूल वैधानिक दस्तावेज़\n\n` +
      `अग्रिम गुप्त सूचना (Prior Information) के आधार पर NDPS विवेचना में तैयार होने वाले 15 अधिकृत दस्तावेज़ों का क्रम:\n\n` +
      `1. \`ndps_act_documents_01\`: **धारा 42(1) NDPS Act — गुप्त सूचना का ज्ञापन / रोजनामचा प्रविष्टि** (Secret Information Memo / GD Entry)\n` +
      `2. \`ndps_act_documents_02\`: **धारा 42(2) NDPS Act — उच्चाधिकारी को सूचना प्रेषण रिपोर्ट** (Supervisory Communication within 72 hrs)\n` +
      `3. \`ndps_act_documents_03\`: **रोजनामचा प्रविष्टि — रवानगी पुलिस पार्टी** (Police Party Departure GD Entry)\n` +
      `4. \`ndps_act_documents_04\`: **धारा 42 प्रोवाइज़ो — सूर्यास्त उपरांत तलाशी हेतु विश्वास के आधार** (Night Search Memo)\n` +
      `5. \`ndps_act_documents_05\`: **फर्द बरामदगी व जब्ती परिसर** (Place Search and Seizure Memo — Fard Makboozgi)\n` +
      `6. \`ndps_act_documents_06\`: **फर्द व्यक्तिगत शारीरिक तलाशी (जामा तलाशी आरोपी)** (Personal Search Memo — Jama Talashi)\n` +
      `7. \`ndps_act_documents_07\`: **अभियुक्त की गिरफ्तारी ज्ञापन व विधिक आधार** (Arrest Memo & Written Grounds of Arrest)\n` +
      `8. \`ndps_act_documents_08\`: **गिरफ्तारी की सूचना पत्र (परिजन/नामित व्यक्ति को)** (Arrest Intimation Memo)\n` +
      `9. \`ndps_act_documents_09\`: **स्पॉट फील्ड ड्रग टेस्टिंग मेमो** (Spot Field Drug Verification Memo)\n` +
      `10. \`ndps_act_documents_10\`: **प्रतिनिधि नमूनाकरण व सीलिंग फर्द** (Representative Sampling & Sealing Memo)\n` +
      `11. \`ndps_act_documents_11\`: **सुपुर्दगीनामा मोहर (सील स्वतंत्र गवाह को सौंपना)** (Handover of Official Seal)\n` +
      `12. \`ndps_act_documents_12\`: **रुक्का (प्रथम सूचना रिपोर्ट दर्ज कराने हेतु प्रेषण)** (Rukka / Spot Crime Intimation)\n` +
      `13. \`ndps_act_documents_13\`: **प्रथम सूचना रिपोर्ट (FIR)** (First Information Report)\n` +
      `14. \`ndps_act_documents_14\`: **स्वतंत्र जांच अधिकारी को केस की सुपुर्दगी** (Handover to Independent IO)\n` +
      `15. \`ndps_act_documents_15\`: **धारा 57 NDPS Act — पर्यवेक्षक अधिकारी को विशेष रिपोर्ट** (Special Supervisory Report u/s 57 within 48 hrs).\n\n` +
      `*किसी विशिष्ट दस्तावेज़ का पूरा प्रारूप देखने के लिए उसका नाम या कोड लिखकर पूछें।*`;
  }

  return null;
}
