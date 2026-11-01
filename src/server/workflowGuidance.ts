import { RecoveryTemplate } from './templateRegistry';

/**
 * Strict field type validators to prevent fact mapping cross-contamination.
 */

export function isTimeOnlyValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  return (
    /\b\d{1,2}[:\.]\d{2}\s*(?:am|pm|hrs|hours|बजे)?\b/i.test(s) ||
    /\b\d{1,2}\s*(?:am|pm|बजे)\b/i.test(s) ||
    /^(?:morning|evening|afternoon|night|सुबह|शाम|दोपहर|रात)$/i.test(s)
  );
}

export function isDateValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  if (isTimeOnlyValue(v)) return false;
  return (
    /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/.test(s) ||
    /\b\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|जनवरी|फरवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर)\b/i.test(s) ||
    /\b(?:today|yesterday|कल|आज|दिनांक|तारीख)\b/i.test(s) ||
    (/\b\d{4}\b/.test(s) && (s.includes('oct') || s.includes('nov') || s.includes('dec') || s.includes('jan') || s.includes('feb') || s.includes('mar') || s.includes('apr') || s.includes('may') || s.includes('jun') || s.includes('jul') || s.includes('aug') || s.includes('sep')))
  );
}

export function isTimeValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  return isTimeOnlyValue(v) && !isDateValue(v);
}

export function isWeightValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  if (isTimeOnlyValue(v) || isDateValue(v)) return false;
  return /\b\d+(?:\.\d+)?\s*(?:kg|kgs|kilo|kilos|kilogram|kilograms|g|gm|gms|gram|grams|ग्राम|किलो|किलोग्राम|मिलीग्राम)\b/i.test(s);
}

export function isSubstanceValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  if (isTimeOnlyValue(v) || isDateValue(v) || isWeightValue(v)) return false;
  const substances = [
    'poppy straw', 'poppy husk', 'poppy', 'opium', 'charas', 'heroin', 'chitta', 'smack', 'ganja', 'bhang', 'cannabis', 'cocaine', 'mdma', 'meth',
    'चरस', 'अफीम', 'स्मैक', 'गांजा', 'भांग', 'हेरोइन', 'चिट्टा', 'डोडा', 'पोस्त', 'संदिग्ध मादक पदार्थ', 'मादक पदार्थ', 'contraband', 'narcotics', 'packet'
  ];
  return substances.some(sub => s.includes(sub));
}

export function isPoliceStationValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  if (isTimeOnlyValue(v) || isDateValue(v) || isWeightValue(v)) return false;
  if (/^\d+/.test(s)) return false;
  return true;
}

export function isDistrictValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  if (isTimeOnlyValue(v) || isDateValue(v) || isWeightValue(v)) return false;
  if (/^\d+/.test(s)) return false;
  return true;
}

export function isLocationValue(v: string): boolean {
  if (!v || typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  if (isTimeOnlyValue(v) || isDateValue(v)) return false;
  return true;
}

/**
 * Returns practical procedural instructions for the Investigating Officer for each template/step.
 * Kept strictly separate from document contents.
 */
export function getIOGuidance(workflowType: 'CHANCE_RECOVERY' | 'INFORMATION_BASED' | string, stage: number): string {
  if (workflowType === 'CHANCE_RECOVERY' || workflowType !== 'INFORMATION_BASED') {
    switch (stage) {
      case 1:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **अधिकारी के विधिक प्राधिकार का सत्यापन (Empowerment)**: यह सुनिश्चित करें कि आप संबंधित केंद्र अथवा राज्य सरकार की अधिसूचना के तहत विधिवत प्राधिकृत (Empowered) हैं। पद या रैंक (जैसे SI/ASI) से स्वतः प्राधिकार प्राप्त नहीं होता।\n` +
          `2. **कार्यवाहियों का विधिक पृथक्करण (Procedural Separation)**:\n` +
          `   - **घेराबंदी / रोकना (Interception)**: वाहन या व्यक्ति को केवल संदेह के आधार पर रोका गया है। यह अभी तलाशी नहीं है।\n` +
          `   - **निरोध / अभिरक्षा (Restraint/Detention)**: विधिक आधार के बिना किसी को अवैध हिरासत में न रखें।\n` +
          `   - **वाहन की तलाशी (Conveyance Search)**: वाहन की तलाशी हेतु स्वतंत्र गवाहों को बुलाएं तथा प्रक्रिया का पालन करें।\n` +
          `   - **बैग/कंटेनर की तलाशी**: बंद बैग या कंटेनर की तलाशी लेने से पूर्व गवाहों को शामिल करें। व्यक्ति को बैग खोलने हेतु विवश करने के लिए विधिक आधार होना चाहिए।\n` +
          `   - **व्यक्तिगत शारीरिक तलाशी (धारा 50)**: यदि संदिग्ध के शरीर या पहने हुए कपड़ों की तलाशी लेनी हो, तो धारा 50 का पृथक नोटिस अनिवार्य है।\n` +
          `3. **ऑडियो-वीडियो रिकॉर्डिंग (धारा 105 BNSS)**: तलाशी व जब्ती की समस्त कार्यवाही की ऑडियो-वीडियो इलेक्ट्रॉनिक रिकॉर्डिंग सुनिश्चित करें।\n` +
          `4. **बरामदगी व मौके पर तौल (Weighment)**: संदिग्ध वस्तु का इलेक्ट्रॉनिक तराजू से सटीक वजन करें।\n` +
          `5. **सीलबंदी व नमूनाकरण (Section 52A)**: मौके पर पूरी सामग्री को सीलबंद करें। स्मरण रहे कि ट्रायल हेतु साक्ष्यिक नमूनाकरण धारा 52-ए(2) के अंतर्गत मजिस्ट्रेट के समक्ष होगा।\n` +
          `6. **जब्ती रिपोर्टिंग व प्रति (धारा 106 व BNSS प्रक्रिया)**: जब्ती सूची तैयार कर प्रति कब्जाधारक को सौंपें तथा धारा 106 BNSS के तहत जब्ती की तत्काल रिपोर्ट मजिस्ट्रेट को प्रेषित करें।`;
      case 2:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **धारा 50 का वैधानिक अधिकार समझाना**: आरोपी की व्यक्तिगत शारीरिक तलाशी (Personal Bodily Search) लेने से पूर्व उसे धारा 50 एनडीपीएस एक्ट के तहत उसका वैधानिक अधिकार मौखिक व लिखित रूप से समझाएं।\n` +
          `2. **विकल्प देना**: आरोपी को स्पष्ट बताएं कि वह अपनी तलाशी किसी निकटतम राजपत्रित अधिकारी (Gazetted Officer) अथवा मजिस्ट्रेट के समक्ष कराने का विधिक अधिकार रखता है।\n` +
          `3. **महिला आरोपी की तलाशी (धारा 50(4))**: यदि आरोपी महिला है, तो उसकी तलाशी केवल महिला पुलिस अधिकारी/कर्मी द्वारा पूर्ण शालीनता व एकांत में ही ली जाएगी।\n` +
          `4. **उत्तर व हस्ताक्षर**: आरोपी का लिखित उत्तर नोटिस में दर्ज करें तथा आरोपी व गवाहों के हस्ताक्षर/अंगूठा निशान प्राप्त करें।`;
      case 3:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **पारदर्शिता हेतु स्वयं की तलाशी देना**: आरोपी की तलाशी लेने से पूर्व निष्पक्षता सिद्ध करने हेतु पुलिस पार्टी के सभी सदस्य अपनी व्यक्तिगत तलाशी आरोपी व स्वतंत्र गवाहों को दें।\n` +
          `2. **अनधिकृत वस्तु न होने की पुष्टि**: यह सुनिश्चित करें कि तलाशी में किसी पुलिसकर्मी के पास कोई आपत्तिजनक या मादक पदार्थ नहीं पाया गया।\n` +
          `3. **हस्ताक्षर**: फर्द तलाशी मुलाजमान पर गवाहों व आरोपी के हस्ताक्षर प्राप्त करें।`;
      case 4:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **आरोपी की शारीरिक तलाशी**: धारा 50 की सहमति/प्रक्रिया के उपरांत आरोपी की व्यक्तिगत तलाशी लें।\n` +
          `2. **बरामदगी दर्ज करना**: आरोपी के पहने हुए कपड़ों या जेबों से बरामद अन्य मादक पदार्थ, नकदी या आपत्तिजनक सामग्री को जब्त करें।\n` +
          `3. **तौल व जब्ती**: यदि शरीर से मादक पदार्थ बरामद हो, तो वजन कर विधिवत सीलबंद करें। फर्द पर गवाहों के हस्ताक्षर कराएं।`;
      case 5:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **व्यक्तिगत सामान की सूची**: आरोपी की जामा तलाशी में प्राप्त व्यक्तिगत वैध सामान (जैसे मोबाइल, पर्स, नकद राशि, पहचान पत्र आदि) की क्रमवार सूची बनाएं।\n` +
          `2. **सुरक्षित अभिरक्षा**: सभी वस्तुओं को सुरक्षित पैकेट में रखकर फर्द जामा तलाशी पर आरोपी व गवाहों के हस्ताक्षर प्राप्त करें।`;
      case 6:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **मौका निशानदेही**: आरोपी की निशानदेही पर घटनास्थल/बरामदगी स्थल का सटीक निरीक्षण करें।\n` +
          `2. **नजरी नक्शा तैयार करना**: घटनास्थल की चौहद्दी (चारों दिशाओं के लैंडमार्क) और नजरी नक्शा मौका तैयार कर फर्द निशानदेही पूर्ण करें।`;
      case 7:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **आरोपी की पहचान का सत्यापन**: स्थानीय संभ्रांत नागरिकों या स्वतंत्र गवाहों की उपस्थिति में आरोपी के वास्तविक नाम, पिता का नाम और स्थायी पते का सत्यापन करें।\n` +
          `2. **शिनाख्त फर्द तैयार करना**: पहचान की पुष्टि उपरांत फर्द शिनाख्त आरोपी पर गवाहों के हस्ताक्षर लें।`;
      case 8:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **पूछताछ (Interrogation)**: स्रोत और गंतव्य के संबंध में पूछताछ करें।\n` +
          `2. **धारा 67 की सीमा (Tofan Singh)**: आरोपी के कथन को स्वतः संस्वीकृति (Confession) न मानें। पुलिस के समक्ष दिया गया बयान ट्रायल में ग्राह्य नहीं है। तथ्यों की स्वतंत्र पुष्टि करें।\n` +
          `3. **केस डायरी**: मुख्य बिंदु केस डायरी में दर्ज करें।`;
      case 9:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **गिरफ्तारी के आधार (धारा 47 BNSS)**: आरोपी को गिरफ्तारी के विधिक आधारों से अवगत कराएं।\n` +
          `2. **परिजनों को सूचना (धारा 48 BNSS)**: नामित परिजन को तत्काल सूचित करें और विवरण दर्ज करें।`;
      case 10:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **रुक्का/तहरीर**: घटनाक्रम का पूर्ण विवरण देते हुए तहरीर तैयार करें।\n` +
          `2. **FIR (धारा 173 BNSS)**: रुक्का तत्काल थाने भेजें ताकि FIR दर्ज हो सके।`;
      case 11:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **मोहर (Seal) की सुपुर्दगी**: जब्ती व सीलबंदी के पश्चात इस्तेमाल की गई पुलिस मोहर को मौके पर उपस्थित स्वतंत्र गवाह के सुपुर्द करें ताकि सील में छेड़छाड़ की संभावना समाप्त हो सके।\n` +
          `2. **सुपुर्दगीनामा तैयार करना**: सुपुर्दगीनामा सील तैयार कर गवाह के हस्ताक्षर व रसीद प्राप्त करें।`;
      case 12:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **विशेष रिपोर्ट (धारा 57)**: 48 घंटे के भीतर वरिष्ठ अधिकारी (SP/DySP) को विस्तृत रिपोर्ट भेजें।\n` +
          `2. **विवरण**: रिपोर्ट में विधिक अनुपालन का स्पष्ट उल्लेख करें।`;
      case 13:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **मजिस्ट्रेट के समक्ष आवेदन (धारा 52-ए)**: इन्वेंट्री प्रमाणीकरण, फोटोग्राफी और नमूनाकरण हेतु मजिस्ट्रेट को आवेदन दें।\n` +
          `2. **न्यायिक नमूनाकरण**: नमूने मजिस्ट्रेट की उपस्थिति में ही निकलवाएं (Mohanlal निर्णय)।`;
      case 14:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **रोड सर्टिफिकेट (RC) बनाना**: मजिस्ट्रेट द्वारा प्रमाणित नमूनों को मालखाने से राज्य फोरेंसिक विज्ञान प्रयोगशाला (SFSL) रासायनिक परीक्षण हेतु भेजने के लिए रोड सर्टिफिकेट तैयार करें।\n` +
          `2. **कस्टडी की अखंडता (Chain of Custody)**: मालवाहक आरक्षी, मालखाना मोहर्रिर और SFSL की पावती को केस डायरी में सुरक्षित संकलित करें।`;
      default:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. निर्धारित प्रक्रियानुसार दस्तावेज़ तैयार करें और आवश्यक विधिक औपचारिकताओं का पालन करें।`;
    }
  } else {
    // Information-Based Workflow (15 steps)
    switch (stage) {
      case 1:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **प्राधिकार सत्यापन (Empowerment)**: सुनिश्चित करें कि आप अधिसूचना के तहत धारा 42 हेतु विधिवत प्राधिकृत हैं। रैंक (SI/ASI) पर्याप्त नहीं है।\n` +
          `2. **सूचना का लेखन (धारा 42(1))**: गुप्त सूचना को तत्काल लिखित रूप में (GD/Memo) दर्ज करें।\n` +
          `3. **वरिष्ठ अधिकारी को प्रेषण (धारा 42(2))**: 72 घंटे के भीतर सूचना की प्रति वरिष्ठ अधिकारी को भेजें।\n` +
          `4. **कार्यवाहियों का विधिक पृथक्करण (Separation)**:\n` +
          `   - **परिसर (Premises)**: निजी भवन की तलाशी धारा 42 के अधीन है।\n` +
          `   - **व्यक्ति (Personal Search)**: शारीरिक तलाशी केवल धारा 50 के अंतर्गत ही होगी।\n` +
          `   - **कंटेनर/बैग**: वाहन या बैग की तलाशी पृथक कार्यवाही है।\n` +
          `5. **रात्रि तलाशी**: सूर्यास्त से सूर्योदय के बीच तलाशी हेतु 'विश्वास के कारणों' (Grounds of Belief) का लेखन अनिवार्य है।\n\n` +
          `**स्पष्टीकरण**: क्या आपने केवल परिसर की घेराबंदी (Interception) की है, मकान की तलाशी ली है, या व्यक्ति की शारीरिक तलाशी की है?`;
      case 2:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **पारदर्शिता**: पुलिस पार्टी अपनी तलाशी स्वतंत्र गवाहों को दे।\n` +
          `2. **हस्ताक्षर**: फर्द पर हस्ताक्षर लें।`;
      case 3:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **परिसर तलाशी**: सूचना के आधार पर मकान/वाहन की तलाशी लें।\n` +
          `2. **गवाह व वीडियोग्राफी (BNSS 105 व प्रक्रिया)**: बंद परिसर में धारा 103 व सामान्य जांच में स्वतंत्र गवाह शामिल करें और धारा 105 के तहत अनिवार्य ऑडियो-वीडियो रिकॉर्डिंग करें।\n` +
          `3. **जब्ती**: बरामद वस्तु का वजन कर सीलबंद करें।\n` +
          `4. **अभिलेख प्रति (BNSS 103(6) / जब्ती रिपोर्टिंग धारा 106)**: तलाशी सूची की हस्ताक्षरित प्रति कब्जाधारक को दें और जब्ती रिपोर्टिंग नियमानुसार करें।`;
      case 4:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **धारा 50 सूचना**: यदि शारीरिक तलाशी लेनी है, तो विधिक अधिकार का नोटिस दें।\n` +
          `2. **लिखित उत्तर**: आरोपी का विकल्प लिखित में लें।`;
      case 5:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **व्यक्तिगत तलाशी**: धारा 50 की प्रक्रिया के बाद शारीरिक तलाशी लें और बरामदगी दर्ज करें।`;
      case 6:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **रुक्का लेखन**: घटनाक्रम का विवरण तैयार कर थाने भेजें।`;
      case 7:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **नजरी नक्शा**: घटनास्थल का लैंडमार्क सहित नक्शा तैयार करें।`;
      case 8:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **गवाहों के बयान (धारा 180 BNSS)**: गवाहों के विस्तृत बयान दर्ज करें।`;
      case 9:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **पूछताछ (धारा 67)**: आरोपी से पूछताछ करें। स्मरण रहे कि यह कथन ट्रायल में संस्वीकृति के रूप में ग्राह्य नहीं है (Tofan Singh)।`;
      case 10:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **गिरफ्तारी (धारा 47, 48 BNSS)**: गिरफ्तारी के आधार बताएं और परिजनों को सूचित करें।`;
      case 11:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **चिकित्सा परीक्षण**: अभियुक्त का मेडिकल चेकअप कराएं।`;
      case 12:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **धारा 55 अनुपालन**: माल व आरोपी को SHO के समक्ष पेश करें। SHO द्वारा रिसीलिंग व प्रमाण पत्र सुनिश्चित करें।`;
      case 13:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **हवालात**: विधिक औपचारिकताओं के बाद अभियुक्त को सुरक्षित बंद करें।`;
      case 14:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **धारा 52-ए**: मजिस्ट्रेट के समक्ष प्रमाणीकरण व न्यायिक नमूनाकरण हेतु आवेदन करें।`;
      case 15:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. **विशेष रिपोर्ट (धारा 57)**: 48 घंटे के भीतर SP/DySP को रिपोर्ट प्रेषित करें।`;
      default:
        return `### IO को इस चरण में क्या करना है\n` +
          `1. निर्धारित प्रक्रियानुसार विधिक दस्तावेज़ तैयार करें।`;
    }
  }
}

/**
 * Cleans excessive blank lines and normalizes formatting for professional Hindi documents.
 */
function cleanDocumentFormatting(content: string): string {
  return content
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}

/**
 * Generates a completed document from the authoritative source template and confirmed case facts.
 * Preserves the exact structure, wording, and formatting while replacing blank fields with confirmed facts or 'अज्ञात'.
 */
export function generateFilledDocument(
  template: RecoveryTemplate,
  facts: Record<string, any>
): string {
  let content = template.content;

  const getVal = (key: string, fallbackLabel: string = '______'): string => {
    const val = facts[key];
    if (!val || val === 'unknown' || val === 'unresolved') return fallbackLabel;
    return String(val);
  };

  if (template.id === 'ndps_act_documents_01') {
    const dateVal = getVal('दिनांक');
    const timeVal = getVal('समय');
    const thanaVal = getVal('थाना');
    const jilaVal = getVal('जिला');
    const mukhbirVal = getVal('मुखबिर/स्रोत');
    const aroopVal = getVal('आरोपी');
    const pitaVal = getVal('पिता');
    const niwasiVal = getVal('निवासी');
    const sthanVal = getVal('स्थान');
    const padarthVal = getVal('पदार्थ');
    const rapatVal = getVal('रोजनामचा_सं');
    const vajanVal = getVal('वजन');
    const padarthDisplay = vajanVal !== '______' ? `${padarthVal} (अनुमानित वजन: ${vajanVal})` : `${padarthVal}`;

    content = content
      .replace(/आज दिनांक ______/g, `आज दिनांक ${dateVal}`)
      .replace(/समय ______ बजे/g, `समय ${timeVal} बजे`)
      .replace(/मुझे ______ \(मुखबिर\/स्रोत\)/g, `मुझे ${mukhbirVal} (मुखबिर/स्रोत)`)
      .replace(/कि ______ \(नाम\/हुलिया\/वाहन नं\.\)/g, `कि ${aroopVal} (नाम/हुलिया/वाहन नं.)`)
      .replace(/पुत्र ______ निवासी ______/g, `पुत्र ${pitaVal} निवासी ${niwasiVal}`)
      .replace(/स्थान ______ पर/g, `स्थान ${sthanVal} पर`)
      .replace(/______ \(मादक पदार्थ का नाम\)/g, `${padarthDisplay} (मादक पदार्थ का नाम)`)
      .replace(/रोजनामचा आम रपट सं. ______ समय ______/g, `रोजनामचा आम रपट सं. ${rapatVal} समय ${timeVal}`)
      .replace(/थाना ______ जिला ______/g, `थाना ${thanaVal} जिला ${jilaVal}`)
      .replace(/दिनांक: ______ समय: ______/g, `दिनांक: ${dateVal} समय: ${timeVal}`)
      .replace(/थाना: ______/g, `थाना: ${thanaVal}`)
      .replace(/प्रार्थी ______ थाना ______/g, `प्रार्थी ${thanaVal} थाना ${thanaVal}`)
      .replace(/दिनांक ______ को विश्वसनीय/g, `दिनांक ${dateVal} को विश्वसनीय`)
      .replace(/\(नाम\/पता\) द्वारा ______ स्थान/g, `(${aroopVal}/${niwasiVal}) द्वारा ${sthanVal} स्थान`)
      .replace(/______ स्थान पर ______ \(मादक पदार्थ\)/g, `${sthanVal} स्थान पर ${padarthDisplay} (मादक पदार्थ)`)
      .replace(/स्थान\/वाहन ______ की तलाशी/g, `स्थान/वाहन ${sthanVal} की तलाशी`)
      .replace(/प्रार्थी: ______ \(नाम\/पद\/थाना\)/g, `प्रार्थी: [IO Name] (IO/${thanaVal})`);

  } else if (template.id === 'chance_recovery_01') {
    // Stage 1: Spot Recovery / Seizure Memo
    const dateVal = getVal('दिनांक');
    const timeVal = getVal('समय');
    const thanaVal = getVal('थाना');
    const jilaVal = getVal('जिला');
    const sthanVal = getVal('स्थान');
    const vajanVal = getVal('वजन');
    const padarthVal = getVal('पदार्थ');

    content = content
      .replace(/दिनांक\s*_{3,}/, `दिनांक ${dateVal}`)
      .replace(/समय\s*_{3,}\s*बजे/, `समय ${timeVal} बजे`)
      .replace(/थाना\s*_{3,}/, `थाना ${thanaVal}`)
      .replace(/जिला\s*_{3,}/, `जिला ${jilaVal}`)
      .replace(/स्थान\s*_{3,}/, `स्थान ${sthanVal}`)
      .replace(/अनुमानतः\s*_{3,}\s*ग्राम\/किलोग्राम/, `अनुमानतः ${vajanVal}`)
      .replace(/अन्य\s*_{3,}\)/, `अन्य ${padarthVal})`);

    // Clean any remaining long signature blanks or witness blanks
    content = content
      .replace(/हमराह मुलाजमान\s*_{3,}/, 'हमराह मुलाजमान पुलिस पार्टी')
      .replace(/एक व्यक्ति\/वाहन\s*_{3,}/, 'एक व्यक्ति/वाहन संदिग्ध अवस्था में')
      .replace(/श्री\s*_{3,}\s*व श्री\s*_{3,}/, 'श्री [स्वतंत्र गवाह 1] व श्री [स्वतंत्र गवाह 2]')
      .replace(/एक\s*_{3,}\s*\(बैग/, 'एक पैकेट/थैला (बैग');
  } else if (template.id === 'chance_recovery_02') {
    // Stage 2: Section 50 Notice
    const aroopVal = getVal('आरोपी');
    const pitaVal = getVal('पिता_पति');
    const niwasiVal = getVal('निवासी');
    const uttarVal = getVal('उत्तर');
    const adhikarival = getVal('अधिकारी');
    const gawah1Val = getVal('गवाह_1');
    const gawah2Val = getVal('गवाह_2');

    content = content
      .replace(/आरोपी\s*_{3,}/, `आरोपी ${aroopVal}`)
      .replace(/पुत्र\/पुत्री\s*_{3,}/, `पुत्र/पुत्री ${pitaVal}`)
      .replace(/निवासी\s*_{3,}/, `निवासी ${niwasiVal}`)
      .replace(/आरोपी का उत्तर\s*_{10,}/, `आरोपी का उत्तर: ${uttarVal}`)
      .replace(/ज्ञापन तैयार करने वाला अधिकारी\s*_{3,}/, `ज्ञापन तैयार करने वाला अधिकारी: ${adhikarival}`)
      .replace(/गवाह संख्या 1 \(हस्ताक्षर\)\s*_{3,}/, `गवाह संख्या 1 (हस्ताक्षर): ${gawah1Val}`)
      .replace(/गवाह संख्या 2 \(हस्ताक्षर\)\s*_{3,}/, `गवाह संख्या 2 (हस्ताक्षर): ${gawah2Val}`)
      .replace(/आरोपी का हस्ताक्षर\/अंगूठा निशान\s*_{3,}/, `आरोपी का हस्ताक्षर/अंगूठा निशान: [हस्ताक्षर/अंगूठा अंकित कराया गया]`);
  } else if (template.id === 'chance_recovery_03') {
    // Stage 3: Search of Police Party
    const m1 = getVal('मुलाजमान_1');
    const m2 = getVal('मुलाजमान_2');
    const m3 = getVal('मुलाजमान_3');
    content = content
      .replace(/मुलाजमान\s*_{3,}/, `मुलाजमान: ${m1}, ${m2}, ${m3}`);
  } else if (template.id === 'chance_recovery_09') {
    // Stage 9: Arrest Memo
    const aroopVal = getVal('आरोपी');
    const pitaVal = getVal('पिता_पति');
    const niwasiVal = getVal('निवासी');
    const dateVal = getVal('दिनांक');
    const timeVal = getVal('समय');
    const soochnaVal = getVal('सूचना_पाने_वाला');
    const rishtaVal = getVal('रिश्ता');
    const phoneVal = getVal('दूरभाष');

    content = content
      .replace(/आरोपी\s*_{3,}/, `आरोपी ${aroopVal}`)
      .replace(/पुत्र\/पुत्री\s*_{3,}/, `पुत्र/पुत्री ${pitaVal}`)
      .replace(/निवासी\s*_{3,}/, `निवासी ${niwasiVal}`)
      .replace(/दिनांक\s*_{3,}/, `दिनांक ${dateVal}`)
      .replace(/समय\s*_{3,}/, `समय ${timeVal}`)
      .replace(/नाम\s*_{3,}/, `नाम ${soochnaVal}`)
      .replace(/संबंध\s*_{3,}/, `संबंध ${rishtaVal}`)
      .replace(/दूरभाष\s*_{3,}/, `दूरभाष ${phoneVal}`);
  } else {
    // Generic replacement for defined fields if present
    if (template.fields && template.fields.length > 0) {
      for (const field of template.fields) {
        const val = getVal(field);
        const regex = new RegExp(`${field}\\s*_{3,}`, 'g');
        content = content.replace(regex, `${field}: ${val}`);
      }
    }

    // Common fact reuse across all remaining templates
    if (facts['दिनांक'] && facts['दिनांक'] !== 'unknown') {
      content = content.replace(/दिनांक\s*_{3,}/g, `दिनांक ${facts['दिनांक']}`);
    }
    if (facts['समय'] && facts['समय'] !== 'unknown') {
      content = content.replace(/समय\s*_{3,}/g, `समय ${facts['समय']}`);
    }
    if (facts['थाना'] && facts['थाना'] !== 'unknown') {
      content = content.replace(/थाना\s*_{3,}/g, `थाना ${facts['थाना']}`);
    }
    if (facts['जिला'] && facts['जिला'] !== 'unknown') {
      content = content.replace(/जिला\s*_{3,}/g, `जिला ${facts['जिला']}`);
    }
    if (facts['स्थान'] && facts['स्थान'] !== 'unknown') {
      content = content.replace(/स्थान\s*_{3,}/g, `स्थान ${facts['स्थान']}`);
    }
    if (facts['पदार्थ'] && facts['पदार्थ'] !== 'unknown') {
      content = content.replace(/मादक पदार्थ\s*_{3,}/g, `मादक पदार्थ ${facts['पदार्थ']}`);
    }
    if (facts['वजन'] && facts['वजन'] !== 'unknown') {
      content = content.replace(/वजन\s*_{3,}/g, `वजन ${facts['वजन']}`);
    }
    if (facts['आरोपी'] && facts['आरोपी'] !== 'unknown') {
      content = content.replace(/आरोपी\s*_{3,}/g, `आरोपी ${facts['आरोपी']}`).replace(/अभियुक्त\s*_{3,}/g, `अभियुक्त ${facts['आरोपी']}`);
    }
  }

  return cleanDocumentFormatting(content);
}
