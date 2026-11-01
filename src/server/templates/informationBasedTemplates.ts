export interface RecoveryTemplate {
  id: string;
  name: string;
  englishAlias: string[];
  workflowType: 'INFORMATION_BASED' | 'CHANCE_RECOVERY';
  sequence: number;
  sourceDocument: string;
  sourcePage: number;
  language: string;
  content: string;
  fields: string[];
  conditionalNotes?: string;
}

export const INFORMATION_BASED_TEMPLATES: RecoveryTemplate[] = [
  {
    id: "info_based_01",
    name: "1. गुप्त सूचना का लेखन (धारा 42 NDPS Act)",
    englishAlias: ["recording of information", "secret information", "section 42(1)", "gupt suchna", "stage 1"],
    workflowType: "INFORMATION_BASED",
    sequence: 1,
    sourceDocument: "standard ndps procedure",
    sourcePage: 1,
    language: "hi",
    content: `सूचना प्राप्ति ज्ञापन (धारा 42 एनडीपीएस एक्ट)
दिनांक _______ समय _______ बजे, मैं _______ (नाम व पद), थाना _______ जिला _______ में मौजूद था। इसी दौरान एक विश्वसनीय मुखबिर/स्रोत से यह गुप्त सूचना प्राप्त हुई कि:
"आरोपी _______ पुत्र _______ निवासी _______ अपने कब्जे/वाहन _______/मकान _______ में भारी मात्रा में मादक पदार्थ (_______) रखे हुए है और इसे _______ (समय/स्थान) पर ले जाने/बेचने की फिराक में है।"

उक्त सूचना विश्वसनीय होने के कारण इसे धारा 42 एनडीपीएस एक्ट के अंतर्गत लेखबद्ध किया गया तथा आगामी कार्यवाही हेतु इसे सुरक्षित रखा गया।
- सूचना प्राप्त करने वाले अधिकारी के हस्ताक्षर: _______________________
- पद व थाना: _______________________`,
    fields: ["दिनांक", "समय", "नाम व पद", "थाना", "जिला", "आरोपी", "पिता", "निवासी", "वाहन/मकान", "पदार्थ", "समय/स्थान", "अधिकारी हस्ताक्षर"]
  },
  {
    id: "info_based_02",
    name: "2. तलाशी वारंट या अधिकार पत्र (धारा 41 NDPS Act)",
    englishAlias: ["search warrant", "authorization", "section 41", "stage 2"],
    workflowType: "INFORMATION_BASED",
    sequence: 2,
    sourceDocument: "standard ndps procedure",
    sourcePage: 2,
    language: "hi",
    content: `तलाशी वारंट / अधिकार पत्र (धारा 41 एनडीपीएस एक्ट)
सेवा में,
_______ (अधिकारी का नाम/पद),
थाना _______ जिला _______

विषय: धारा 41 एनडीपीएस एक्ट के अंतर्गत तलाशी वारंट/अधिकार पत्र जारी करने बाबत्।

चूँकि विश्वसनीय सूचना प्राप्त हुई है कि स्थान _______ पर मादक पदार्थ _______ छिपाकर रखा गया है, अतः आपको धारा 41 एनडीपीएस एक्ट के अंतर्गत अधिकृत किया जाता है कि आप उक्त स्थान की तलाशी लें, संदिग्ध सामग्री को जब्त करें और संबंधित व्यक्तियों को गिरफ्तार करें।
यह वारंट/अधिकार पत्र दिनांक _______ से _______ तक प्रभावी रहेगा।

- जारीकर्ता अधिकारी/मजिस्ट्रेट (हस्ताक्षर व मोहर): _______________________
- दिनांक: _______________________`,
    fields: ["अधिकारी नाम", "थाना", "जिला", "स्थान", "पदार्थ", "दिनांक से", "तक", "जारीकर्ता हस्ताक्षर"]
  },
  {
    id: "info_based_03",
    name: "3. सूचना का उच्चाधिकारी को प्रेषण (धारा 42(2) NDPS Act)",
    englishAlias: ["dispatch to superior", "section 42(2)", "superior notification", "stage 3"],
    workflowType: "INFORMATION_BASED",
    sequence: 3,
    sourceDocument: "standard ndps procedure",
    sourcePage: 3,
    language: "hi",
    content: `उच्चाधिकारी को सूचना प्रेषण (धारा 42(2) एनडीपीएस एक्ट)
सेवा में,
श्रीमान _______ (उच्चाधिकारी का पद),
_______ (कार्यालय)

विषय: धारा 42(2) एनडीपीएस एक्ट के अंतर्गत लेखबद्ध सूचना की प्रति प्रेषित करने बाबत्।

महोदय,
निवेदन है कि आज दिनांक _______ को समय _______ बजे प्राप्त गुप्त सूचना/विश्वास के कारणों को धारा 42(1) एनडीपीएस एक्ट के अंतर्गत लेखबद्ध किया गया है। उक्त लेखबद्ध सूचना की प्रति धारा 42(2) के अनुपालन में आपके अवलोकनार्थ एवं आवश्यक कार्यवाही हेतु प्रेषित की जा रही है।

संलग्न: लेखबद्ध सूचना की प्रति।

- प्रेषक अधिकारी (हस्ताक्षर): _______________________
- पद व थाना: _______________________
- प्राप्ति समय व दिनांक (कार्यालय): _______________________`,
    fields: ["उच्चाधिकारी पद", "कार्यालय", "दिनांक", "समय", "प्रेषक हस्ताक्षर", "प्राप्ति समय"]
  },
  {
    id: "info_based_04",
    name: "4. फर्द व्यक्तिगत शारीरिक तलाशी — पुलिस पार्टी मुलाजमान",
    englishAlias: ["police personal search", "police party search memo", "मुलाजमान तलाशी", "stage 4"],
    workflowType: "INFORMATION_BASED",
    sequence: 4,
    sourceDocument: "standard ndps procedure",
    sourcePage: 4,
    language: "hi",
    content: `मुलाजमान की तलाशी (पारदर्शिता हेतु)
आरोपी/स्थान की तलाशी लेने से पूर्व, गवाहान श्री _______ व श्री _______ के समक्ष पुलिस पार्टी के समस्त मुलाजमान की व्यक्तिगत शारीरिक तलाशी स्वयं ली गई ताकि यह सुनिश्चित हो सके कि पुलिस पार्टी के पास कोई आपत्तिजनक वस्तु नहीं है।

- मुलाजमान 1 (नाम/पद): _______________________
- मुलाजमान 2 (नाम/पद): _______________________
- गवाह 1: _______________________
- गवाह 2: _______________________

ली गई तलाशी में कुछ भी संदिग्ध बरामद नहीं हुआ।
- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["गवाह 1", "गवाह 2", "मुलाजमान 1", "मुलाजमान 2"]
  },
  {
    id: "info_based_05",
    name: "5. फर्द वरामदगी व मकबूजगी (Seizure Memo)",
    englishAlias: ["seizure memo", "recovery memo", "फर्द बरामदगी", "stage 5"],
    workflowType: "INFORMATION_BASED",
    sequence: 5,
    sourceDocument: "standard ndps procedure",
    sourcePage: 5,
    language: "hi",
    content: `फर्द बरामदगी व जब्ती ज्ञापन
दिनांक _______ समय _______ बजे, स्थान _______ पर प्राप्त सूचना के आधार पर कार्यवाही करते हुए आरोपी _______ के कब्जे/मकान/वाहन से _______ ग्राम/किलोग्राम संदिग्ध मादक पदार्थ (_______) बरामद किया गया।
बरामद माल को मौके पर तौला गया, नमूना अलग निकाला गया और शेष माल को सीलबंद किया गया। पैकेटों पर पुलिस मोहर _______ अंकित की गई।

- गवाह 1: _______________________
- गवाह 2: _______________________
- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["दिनांक", "समय", "स्थान", "आरोपी", "वजन", "पदार्थ", "मोहर", "गवाह 1", "गवाह 2"]
  },
  {
    id: "info_based_06",
    name: "6. धारा 50 NDPS Act के अंतर्गत ज्ञापन (Section 50 Notice)",
    englishAlias: ["section 50 notice", "sec 50 notice", "धारा 50", "stage 6"],
    workflowType: "INFORMATION_BASED",
    sequence: 6,
    sourceDocument: "standard ndps procedure",
    sourcePage: 6,
    language: "hi",
    content: `आरोपी _______ को अवगत कराया गया कि धारा 50 एनडीपीएस एक्ट के तहत उसे यह अधिकार प्राप्त है कि उसकी व्यक्तिगत शारीरिक तलाशी किसी राजपत्रित अधिकारी (Gazetted Officer) या मजिस्ट्रेट के समक्ष ली जाए।
आरोपी का उत्तर: ____________________________________________________

- आरोपी हस्ताक्षर: _______________________
- गवाह 1: _______________________
- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["आरोपी", "आरोपी उत्तर", "गवाह 1"]
  },
  {
    id: "info_based_07",
    name: "7. फर्द व्यक्तिगत शारीरिक तलाशी आरोपी",
    englishAlias: ["accused personal search", "personal search accused", "stage 7"],
    workflowType: "INFORMATION_BASED",
    sequence: 7,
    sourceDocument: "standard ndps procedure",
    sourcePage: 7,
    language: "hi",
    content: `आरोपी _______ की व्यक्तिगत शारीरिक तलाशी गवाहान के समक्ष ली गई। तलाशी में आरोपी के पास से _______ बरामद हुआ। बरामद सामग्री को जब्त कर सीलबंद किया गया।

- आरोपी हस्ताक्षर: _______________________
- गवाह 1: _______________________
- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["आरोपी", "बरामदगी"]
  },
  {
    id: "info_based_08",
    name: "8. रुक्का (Rukka / Spot Report)",
    englishAlias: ["rukka", "spot report", "रुक्का", "stage 8"],
    workflowType: "INFORMATION_BASED",
    sequence: 8,
    sourceDocument: "standard ndps procedure",
    sourcePage: 8,
    language: "hi",
    content: `सेवा में, थाना प्रभारी _______
विषय: मुकदमा पंजीकृत करने हेतु रुक्का।
महोदय, आज दिनांक _______ को गुप्त सूचना पर कार्यवाही करते हुए आरोपी _______ से _______ ग्राम मादक पदार्थ बरामद किया गया है। फर्द बरामदगी व अन्य कार्यवाही पूर्ण कर ली गई है। कृपया सुसंगत धाराओं में FIR दर्ज करें।

- प्रेषक: _______________________
- समय: _______________________`,
    fields: ["थाना प्रभारी", "दिनांक", "आरोपी", "वजन", "प्रेषक", "समय"]
  },
  {
    id: "info_based_09",
    name: "9. नक्शा मौका नजरी (Site Plan)",
    englishAlias: ["site plan", "site sketch", "नक्शा मौका", "stage 9"],
    workflowType: "INFORMATION_BASED",
    sequence: 9,
    sourceDocument: "standard ndps procedure",
    sourcePage: 9,
    language: "hi",
    content: `घटनास्थल का नक्शा मौका (बिना स्केल)
स्थान: _______
उत्तर: _______ दक्षिण: _______ पूर्व: _______ पश्चिम: _______
(यहाँ हाथ से नक्शा बनाएं जिसमें रिकवरी स्थल व गवाहों की स्थिति दर्शाएं)

- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["स्थान", "उत्तर", "दक्षिण", "पूर्व", "पश्चिम"]
  },
  {
    id: "info_based_10",
    name: "10. बयान गवाहन (Witness Statements)",
    englishAlias: ["witness statement", "statement of witness", "बयान", "stage 10"],
    workflowType: "INFORMATION_BASED",
    sequence: 10,
    sourceDocument: "standard ndps procedure",
    sourcePage: 10,
    language: "hi",
    content: `बयान गवाह श्री _______ पुत्र _______ निवासी _______
(धारा 161 CrPC / 180 BNSS के तहत)
मैं आज पुलिस पार्टी के साथ था और मैंने अपनी आँखों से आरोपी के पास से मादक पदार्थ बरामद होते देखा। पुलिस ने नियमानुसार कार्यवाही की और मैंने फर्द पर हस्ताक्षर किए।

- गवाह हस्ताक्षर: _______________________
- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["गवाह", "पिता", "निवासी"]
  },
  {
    id: "info_based_11",
    name: "11. पूछताछ आरोपीगण (Interrogation)",
    englishAlias: ["interrogation", "accused interrogation", "पूछताछ", "stage 11"],
    workflowType: "INFORMATION_BASED",
    sequence: 11,
    sourceDocument: "standard ndps procedure",
    sourcePage: 11,
    language: "hi",
    content: `पूछताछ आरोपी: _______
1. माल कहाँ से लाए? _______
2. किसे बेचना था? _______
3. और कौन शामिल है? _______

- पूछताछ अधिकारी: _______________________`,
    fields: ["आरोपी", "उत्तर 1", "उत्तर 2", "उत्तर 3"]
  },
  {
    id: "info_based_12",
    name: "12. अभियुक्त की गिरफ्तारी व नोटिस (Arrest Memo)",
    englishAlias: ["arrest memo", "arrest notice", "गिरफ्तारी", "stage 12"],
    workflowType: "INFORMATION_BASED",
    sequence: 12,
    sourceDocument: "standard ndps procedure",
    sourcePage: 12,
    language: "hi",
    content: `गिरफ्तारी सूचना पत्र
आरोपी _______ को दिनांक _______ समय _______ बजे गिरफ्तार किया गया। गिरफ्तारी की सूचना उसके परिजन _______ को दी गई।

- आरोपी हस्ताक्षर: _______________________
- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["आरोपी", "दिनांक", "समय", "परिजन"]
  },
  {
    id: "info_based_13",
    name: "13. अभियुक्त का चिकित्सा परीक्षण (Medical Examination)",
    englishAlias: ["medical examination", "medical memo", "चिकित्सा", "stage 13"],
    workflowType: "INFORMATION_BASED",
    sequence: 13,
    sourceDocument: "standard ndps procedure",
    sourcePage: 13,
    language: "hi",
    content: `चिकित्सा परीक्षण हेतु आवेदन
सेवा में, चिकित्सा अधिकारी _______
कृपया आरोपी _______ का चिकित्सा परीक्षण करें और उसके रक्त/मूत्र के नमूने जांच हेतु लें।

- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["चिकित्सा अधिकारी", "आरोपी"]
  },
  {
    id: "info_based_14",
    name: "14. आरोपी को थाना प्रभारी के समक्ष पेश करना (Section 55 NDPS Act)",
    englishAlias: ["sho production", "section 55", "sho production memo", "stage 14"],
    workflowType: "INFORMATION_BASED",
    sequence: 14,
    sourceDocument: "standard ndps procedure",
    sourcePage: 14,
    language: "hi",
    content: `आरोपी व माल की SHO के समक्ष पेशी
दिनांक _______ को आरोपी _______ व सीलबंद माल को थाना प्रभारी के समक्ष पेश किया गया। थाना प्रभारी ने सील की जांच की और मालखाने में जमा करने का आदेश दिया।

- थाना प्रभारी हस्ताक्षर: _______________________
- अधिकारी हस्ताक्षर: _______________________`,
    fields: ["दिनांक", "आरोपी"]
  },
  {
    id: "info_based_15",
    name: "15. धारा 57 NDPS Act के अंतर्गत पर्यवेक्षक अधिकारी को सूचना",
    englishAlias: ["section 57 report", "supervisory report 57", "धारा 57", "stage 15"],
    workflowType: "INFORMATION_BASED",
    sequence: 15,
    sourceDocument: "standard ndps procedure",
    sourcePage: 15,
    language: "hi",
    content: `धारा 57 की रिपोर्ट
सेवा में, श्रीमान पुलिस अधीक्षक/पर्यवेक्षक अधिकारी _______
महोदय, धारा 57 एनडीपीएस एक्ट के अनुपालन में आपको सूचित किया जाता है कि आज दिनांक _______ को आरोपी _______ से _______ ग्राम मादक पदार्थ जब्त किया गया है और उसे गिरफ्तार किया गया है।

- प्रेषक अधिकारी: _______________________
- दिनांक: _______________________`,
    fields: ["उच्चाधिकारी", "दिनांक", "आरोपी", "वजन", "प्रेषक"]
  }
];

export function getInformationBasedTemplateById(id: string): RecoveryTemplate | undefined {
  return INFORMATION_BASED_TEMPLATES.find(t => t.id === id);
}

export function getInformationBasedTemplateBySequence(seq: number): RecoveryTemplate | undefined {
  return INFORMATION_BASED_TEMPLATES.find(t => t.sequence === seq);
}

export function searchInformationBasedTemplates(query: string): RecoveryTemplate[] {
  const q = query.toLowerCase().trim();
  return INFORMATION_BASED_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q) ||
    t.englishAlias.some(alias => q.includes(alias)) ||
    t.sequence.toString() === q
  );
}
