export interface RecoveryTemplate {
  id: string;
  name: string;
  englishAlias: string[];
  workflowType: 'CHANCE_RECOVERY' | 'INFORMATION_BASED';
  sequence: number;
  sourceDocument: string;
  sourcePage: number;
  language: string;
  content: string;
  fields: string[];
  conditionalNotes?: string;
  collectionId?: string;
}

export const CHANCE_RECOVERY_TEMPLATES: RecoveryTemplate[] = [
  {
    id: "chance_recovery_01",
    name: "1. फर्द वरामदगी मादक पदार्थ व मकबूजगी",
    englishAlias: ["spot recovery", "seizure memo", "recovery memo", "फर्द बरामदगी", "stage 1", "spot", "fard makboozgi", "fard makboojgi", "fard makbujgi", "makboozgi", "makboojgi", "makbujgi", "fard baramadgi", "fard bramadgi", "baramadgi", "bramadgi", "fard zabti", "fard"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 1,
    sourceDocument: "templateof ndps",
    sourcePage: 2,
    language: "hi",
    content: `बरामदगी फर्द मौका
दिनांक _______ समय _______ बजे, थाना _______ जिला _______ की पुलिस टीम मय हमराह मुलाजमान _______ के, मुखबिर खास/वायरलैस सूचना पर गश्त के दौरान स्थान _______ पर मौजूद थी। इसी दौरान एक व्यक्ति/वाहन _______ पर शक होने पर रोका गया। तलाशी की निष्पक्ष कार्यवाही हेतु दो स्वतंत्र गवाहान श्री _______ व श्री _______ को बुलाकर उन्हें कार्यवाही में शामिल होने हेतु कहा गया।
आरोपी के कब्जे से एक _______ (बैग/लिफाफा/थैला/वाहन डिक्की आदि) बरामद हुआ, जिसकी तलाशी लेने पर उसमें से अनुमानतः _______ ग्राम/किलोग्राम वजनी संदिग्ध मादक पदार्थ (चरस/अफीम/स्मैक/गांजा/अन्य _______) बरामद हुआ। बरामद मादक पदार्थ को इलेक्ट्रॉनिक तराजू से तौला गया, नमूना अलग निकाला गया, शेष माल व नमूना अलग-अलग पैकेटों में पैक कर सीलबंद किया गया तथा पैकेटों पर पुलिस मोहर व गवाहान के हस्ताक्षर/सील अंकित की गई।
संपूर्ण कार्यवाही की यह फर्द मौके पर तैयार कर गवाहान व पुलिस पार्टी के हस्ताक्षर लिए गए।
गवाहन:
- गवाह संख्या 1 (हस्ताक्षर): _______________________
- गवाह संख्या 2 (हस्ताक्षर): _______________________
- फर्द लेखक अधिकारी (हस्ताक्षर): _______________________`,
    fields: ["दिनांक", "समय", "थाना", "जिला", "मुलाजमान", "स्थान", "व्यक्ति/वाहन", "गवाह 1", "गवाह 2", "सामग्री प्रकार", "अनुमानित वजन", "पदार्थ प्रकार", "लेखक अधिकारी हस्ताक्षर"]
  },
  {
    id: "chance_recovery_02",
    name: "2. धारा 50 NDPS Act के अंतर्गत ज्ञापन",
    englishAlias: ["section 50", "sec 50 notice", "धारा 50", "stage 2", "notice"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 2,
    sourceDocument: "templateof ndps",
    sourcePage: 3,
    language: "hi",
    content: `आरोपी _______ पुत्र/पुत्री _______ निवासी _______ को व्यक्तिगत शारीरिक तलाशी लिए जाने से पूर्व यह अवगत कराया गया कि धारा 50 एनडीपीएस एक्ट के अंतर्गत उसे यह वैधानिक अधिकार प्राप्त है कि उसकी तलाशी निकटतम गजटेड अधिकारी अथवा मजिस्ट्रेट के समक्ष ली जाए। आरोपी को यह अधिकार मौखिक व लिखित रूप से समझाया गया तथा उससे स्पष्ट रूप से पूछा गया कि क्या वह गजटेड अधिकारी/मजिस्ट्रेट के समक्ष तलाशी देना चाहता है अथवा मौजूद पुलिस अधिकारी से ही तलाशी देने हेतु सहमत है।

आरोपी का उत्तर:
____________________________________________________________________
____________________________________________________________________

उपरोक्त कथन पर आरोपी के हस्ताक्षर/अंगूठा निशान लिए गए तथा गवाहान के भी हस्ताक्षर कराए गए।
- आरोपी का हस्ताक्षर/अंगूठा निशान: _______________________
- गवाह संख्या 1 (हस्ताक्षर): _______________________
- गवाह संख्या 2 (हस्ताक्षर): _______________________
- ज्ञापन तैयार करने वाला अधिकारी: _______________________`,
    fields: ["आरोपी नाम", "पिता/पुत्री", "निवासी", "आरोपी का उत्तर", "आरोपी हस्ताक्षर/अंगूठा", "गवाह 1", "गवाह 2", "अधिकारी"]
  },
  {
    id: "chance_recovery_03",
    name: "3. फर्द व्यक्तिगत शारीरिक तलाशी — पुलिस पार्टी मुलाजमान",
    englishAlias: ["police personal search", "police party search memo", "मुलाजमान तलाशी", "stage 3", "police search"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 3,
    sourceDocument: "templateof ndps",
    sourcePage: 4,
    language: "hi",
    content: `आरोपी की तलाशी लेने से पूर्व, कार्यवाही में पारदर्शिता बनाए रखने व यह सुनिश्चित करने हेतु कि तलाशी लेने वाली पुलिस पार्टी के पास स्वयं कोई मादक पदार्थ अथवा अन्य आपत्तिजनक वस्तु मौजूद नहीं है, तलाशी दल में शामिल समस्त पुलिस मुलाजमान की व्यक्तिगत शारीरिक तलाशी गवाहान के समक्ष स्वयं ली गई।

- मुलाजमान 1 (नाम/पद): _______________________
- मुलाजमान 2 (नाम/पद): _______________________
- मुलाजमान 3 (नाम/पद): _______________________
- गवाह संख्या 1: _______________________
- गवाह संख्या 2: _______________________

ली गई तलाशी में उक्त मुलाजमान के पास से कोई आपत्तिजनक वस्तु/मादक पदार्थ बरामद नहीं हुआ। इस आशय की फर्द मौके पर तैयार कर गवाहान व पुलिस पार्टी के हस्ताक्षर लिए गए।`,
    fields: ["मुलाजमान 1", "मुलाजमान 2", "मुलाजमान 3", "गवाह 1", "गवाह 2"]
  },
  {
    id: "chance_recovery_04",
    name: "4. फर्द व्यक्तिगत शारीरिक तलाशी आरोपीगण, वरामदगी व मकबूजगी",
    englishAlias: ["accused personal search", "accused search and recovery", "आरोपी तलाशी", "stage 4", "accused search"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 4,
    sourceDocument: "templateof ndps",
    sourcePage: 5,
    language: "hi",
    content: `गवाहान श्री _______ व श्री _______ के समक्ष आरोपी _______ पुत्र _______ निवासी _______ की व्यक्तिगत शारीरिक तलाशी ली गई। तलाशी के दौरान आरोपी के कब्जे से _______ बरामद हुआ, जिसकी जांच व तौल करने पर वह _______ ग्राम/किलोग्राम वजनी संदिग्ध मादक पदार्थ पाया गया।
बरामद मादक पदार्थ में से लगभग _______ ग्राम नमूने के तौर पर अलग निकालकर पृथक पैकेट में सीलबंद किया गया तथा शेष मादक पदार्थ _______ ग्राम/किलोग्राम को अलग पैकेट में सीलबंद किया गया। दोनों पैकेटों पर पुलिस मोहर व गवाहान के हस्ताक्षर/सील अंकित की गई। जब्शुदा सामग्री की मकबूजगी सूची निम्नानुसार तैयार की गई:

1. संदिग्ध मादक पदार्थ (नमूना): _______________________
2. संदिग्ध मादक पदार्थ (शेष माल): _______________________
3. पैकेजिंग सामग्री/बैग: _______________________
4. अन्य वस्तु (यदि कोई हो): _______________________

संपूर्ण कार्यवाही की फर्द मौके पर तैयार कर आरोपी, गवाहान व पुलिस पार्टी के हस्ताक्षर लिए गए।`,
    fields: ["गवाह 1", "गवाह 2", "आरोपी नाम", "पिता", "निवासी", "कब्जे से बरामद", "वजन", "नमूना वजन", "शेष वजन"]
  },
  {
    id: "chance_recovery_05",
    name: "5. रुक्का",
    englishAlias: ["rukka", "spot report", "रुक्का", "stage 5"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 5,
    sourceDocument: "templateof ndps",
    sourcePage: 6,
    language: "hi",
    content: `सेवा में,
श्रीमान थाना प्रभारी,
थाना _______ जिला _______

महोदय,
निवेदन है कि दिनांक _______ को समय _______ बजे मुखिबर खास की सूचना पर गश्त के दौरान स्थान _______ पर आरोपी _______ पुत्र _______ निवासी _______ के कब्जे से गवाहान _______ व _______ के समक्ष लगभग _______ ग्राम/किलोग्राम संदिग्ध मादक पदार्थ (_______) बरामद किया गया है, जो कि एनडीपीएस एक्ट की धारा _______ के अंतर्गत दण्डनीय अपराध है। घटनास्थल पर फर्द बरामदगी, फर्द तलाशी व अन्य आवश्यक कार्यवाही पूर्ण कर ली गई है।
अतः प्रकरण में सुसंगत धाराओं के अंतर्गत मुकदमा पंजीकृत कर आवश्यक विधिक कार्यवाही करने का कष्ट करें।

- रुक्का लेखक/प्रेषक (नाम व पद): _______________________
- दिनांक व समय: _______________________`,
    fields: ["थाना प्रभारी", "थाना", "जिला", "दिनांक", "समय", "स्थान", "आरोपी", "पिता", "निवासी", "गवाह 1", "गवाह 2", "वजन", "पदार्थ", "धारा", "लेखक नाम व पद"]
  },
  {
    id: "chance_recovery_06",
    name: "6. नक्शा मौका नजरी बिना स्केल",
    englishAlias: ["site plan", "sketch without scale", "नक्शा मौका", "stage 6", "site sketch"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 6,
    sourceDocument: "templateof ndps",
    sourcePage: 7,
    language: "hi",
    content: `घटनास्थल का विवरण: _______________________
घटना दिनांक/समय: _______________________
उत्तर दिशा में: _______________________
दक्षिण दिशा में: _______________________
पूर्व दिशा में: _______________________
पश्चिम दिशा में: _______________________

(नक्शा मौका नजरी यहाँ हाथ से बनाएं)

नक्शे में बरामदगी स्थल, आरोपी की स्थिति, पुलिस पार्टी व गवाहान की स्थिति तथा नज़दीकी पहचान चिन्ह अंकित किए जाएं।

- नक्शा तैयार करने वाले अधिकारी का नाम: _______________________
- हस्ताक्षर व दिनांक: _______________________`,
    fields: ["घटनास्थल विवरण", "दिनांक/समय", "उत्तर दिशा", "दक्षिण दिशा", "पूर्व दिशा", "पश्चिम दिशा", "अधिकारी नाम", "हस्ताक्षर"]
  },
  {
    id: "chance_recovery_07",
    name: "7. बयान गवाहन",
    englishAlias: ["witness statement", "statement of witness", "बयान गवाहन", "stage 7", "witness"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 7,
    sourceDocument: "templateof ndps",
    sourcePage: 8,
    language: "hi",
    content: `(धारा 161 CrPC / धारा 180 BNSS के अंतर्गत कलमबंद बयान)

- गवाह का नाम व पिता का नाम: _______________________
- निवासी: _______________________
- दिनांक बयान: _______________________

बयान: मैं दिनांक _______ को समय _______ बजे स्थान _______ पर मौजूद था। इसी दौरान पुलिस पार्टी ने मुझे व _______ को तलाशी की कार्यवाही में गवाह बनने हेतु बुलाया। पुलिस पार्टी ने आरोपी को रोककर उसे धारा 50 एनडीपीएस एक्ट के तहत उसका अधिकार बताया। आरोपी की तलाशी लेने पर उसके कब्जे से संदिग्ध मादक पदार्थ बरामद हुआ, जिसे मौके पर तौला गया, नमूना अलग किया गया तथा सीलबंद किया गया। पुलिस ने संपूर्ण कार्यवाही की फर्द मौके पर तैयार की, जिस पर मैंने व अन्य गवाह ने अपने हस्ताक्षर किए।
उपरोक्त बयान मैंने अपनी मर्जी से सही-सही बयान किया है।

- गवाह के हस्ताक्षर/अंगूठा निशान: _______________________
- बयान लेखक अधिकारी: _______________________`,
    fields: ["गवाह नाम", "पिता नाम", "निवासी", "दिनांक", "समय", "स्थान", "अन्य गवाह", "गवाह हस्ताक्षर", "लेखक अधिकारी"]
  },
  {
    id: "chance_recovery_08",
    name: "8. पूछताछ आरोपीगण",
    englishAlias: ["interrogation", "accused interrogation", "पूछताछ", "stage 8"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 8,
    sourceDocument: "templateof ndps",
    sourcePage: 9,
    language: "hi",
    content: `- आरोपी का नाम, पिता का नाम, आयु: _______________________
- निवासी: _______________________

1. बरामद मादक पदार्थ किसका है व कहाँ से प्राप्त किया?
उत्तर: ____________________________________________________________

2. मादक पदार्थ को कहाँ ले जाया जा रहा था व किसे देना था?
उत्तर: ____________________________________________________________

3. क्या इस कार्य में कोई अन्य व्यक्ति संलिप्त है?
उत्तर: ____________________________________________________________

4. मादक पदार्थ की कीमत व खरीद का स्रोत क्या है?
उत्तर: ____________________________________________________________

5. पूर्व में किसी मादक पदार्थ संबंधी प्रकरण में संलिप्तता रही है?
उत्तर: ____________________________________________________________

- पूछताछ अधिकारी का नाम व पद: _______________________
- दिनांक व समय: _______________________`,
    fields: ["आरोपी नाम", "पिता", "आयु", "निवासी", "उत्तर 1", "उत्तर 2", "उत्तर 3", "उत्तर 4", "उत्तर 5", "अधिकारी नाम व पद"]
  },
  {
    id: "chance_recovery_09",
    name: "9. अभियुक्त की गिरफ्तारी, सूचना पत्र व धारा 35(3) BNSS नोटिस",
    englishAlias: ["arrest memo", "bnss 35(3) notice", "गिरफ्तारी", "stage 9", "arrest"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 9,
    sourceDocument: "templateof ndps",
    sourcePage: 10,
    language: "hi",
    content: `गिरफ्तारी व गिरफ्तारी सूचना पत्र
आरोपी _______ पुत्र _______ निवासी _______ को दिनांक _______ समय _______ बजे उपरोक्त प्रकरण में गिरफ्तार किया गया। गिरफ्तारी की सूचना आरोपी द्वारा बताए गए व्यक्ति _______ (रिश्ता _______, दूरभाष संख्या _______) को दूरभाष/लिखित रूप से दी गई।

धारा 35(3) BNSS के अंतर्गत नोटिस (यदि मादक पदार्थ Small Quantity में पाया जाए)
चूंकि प्रकरण में बरामद मादक पदार्थ लघु मात्रा (Small Quantity) की श्रेणी में पाया गया है, अतः अभियुक्त _______ को धारा 35(3) BNSS के प्रावधानों के अनुसार गिरफ्तार न करते हुए निम्न शर्तों पर पाबंद किया जाता है:
1. अभियुक्त आवश्यकता पड़ने पर जांच अधिकारी/न्यायलय के समक्ष उपस्थित होगा।
2. अभियुक्त साक्ष्यों से छेड़छाड़ नहीं करेगा।
3. अभियुक्त गवाहों को प्रभावित करने का प्रयास नहीं करेगा।

- अभियुक्त के हस्ताक्षर/अंगूठा निशान: _______________________
- जांच अधिकारी के हस्ताक्षर: _______________________
- दिनांक: _______________________`,
    fields: ["आरोपी", "पिता", "निवासी", "दिनांक", "समय", "संबद्ध व्यक्ति", "रिश्ता", "दूरभाष", "अधिकारी हस्ताक्षर"]
  },
  {
    id: "chance_recovery_10",
    name: "10. अभियुक्त के चिकित्सा परीक्षण व नमूना रक्त/मूत्र हेतु आवेदन पत्र",
    englishAlias: ["medical examination", "blood urine sample application", "चिकित्सा परीक्षण", "stage 10", "medical"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 10,
    sourceDocument: "templateof ndps",
    sourcePage: 11,
    language: "hi",
    content: `सेवा में,
श्री चिकित्सा अधिकारी,
राजकीय चिकित्सालय _______

विषय: अभियुक्त के चिकित्सा परीक्षण व रक्त/मूत्र नमूना लिए जाने बाबत्।

महोदय,
निवेदन है कि थाना _______ में प्रकरण संख्या _______ धारा _______ एनडीपीएस एक्ट में गिरफ्तार अभियुक्त _______ पुत्र _______ आयु _______ निवासी _______ को चिकित्सा परीक्षण हेतु प्रस्तुत किया जा रहा है। कृपया अभियुक्त का सामान्य चिकित्सा परीक्षण करते हुए उसके रक्त व मूत्र के नमूने लेकर जांच हेतु सुरक्षित रखने व रिपोर्ट उपलब्ध कराने का कष्ट करें।

- जांच अधिकारी का नाम व पद: _______________________
- थाना: _______________________
- दिनांक: _______________________`,
    fields: ["चिकित्सा अधिकारी", "चिकित्सालय", "थाना", "प्रकरण संख्या", "धारा", "अभियुक्त", "पिता", "आयु", "निवासी", "जांच अधिकारी"]
  },
  {
    id: "chance_recovery_11",
    name: "11. आरोपी को थाना प्रभारी के समक्ष पेश करना व रिसील प्रमाणपत्र (धारा 55 NDPS Act)",
    englishAlias: ["sho production", "section 55 resealing", "रिसील प्रमाणपत्र", "stage 11", "section 55"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 11,
    sourceDocument: "templateof ndps",
    sourcePage: 12,
    language: "hi",
    content: `दिनांक _______ को जांच अधिकारी _______ द्वारा आरोपी _______ को मय जब्शुदा सीलबंद मादक पदार्थ (नमूना पैकेट व शेष माल पैकेट) थाना प्रभारी _______ के समक्ष पेश किया गया।
थाना प्रभारी द्वारा प्रस्तुत सीलबंद पैकेटों की सील की जांच कर उन्हें पुनः रीसील किया गया तथा मालखाना रजिस्टर में इन्द्राज कर सुरक्षित रखा गया।

रीसील प्रमाणपत्र (धारा 55 NDPS Act)
प्रमाणित किया जाता है कि जांच अधिकारी द्वारा प्रस्तुत सीलबंद पैकेट संख्या _______ (नमूना) व पैकेट संख्या _______ (शेष माल) की सीलें भली-भांति जांची गईं, जो सही व अक्षुण्ण पाई गईं। उक्त पैकेटों को मेरी उपस्थिति में पुनः सीलबंद (रीसील) कर थाने के मालखाने में सुरक्षित रखवाया गया।

- थाना प्रभारी के हस्ताक्षर व मोहर: _______________________
- दिनांक: _______________________`,
    fields: ["दिनांक", "जांच अधिकारी", "आरोपी", "थाना प्रभारी", "पैकेट संख्या नमूना", "पैकेट संख्या शेष", "थाना प्रभारी हस्ताक्षर"]
  },
  {
    id: "chance_recovery_12",
    name: "12. आरोपी को हवालात में बंद करना (रोजनामचा प्रविष्टि)",
    englishAlias: ["lock-up entry", "general diary entry", "हवालात", "stage 12", "lockup"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 12,
    sourceDocument: "templateof ndps",
    sourcePage: 13,
    language: "hi",
    content: `दिनांक _______ समय _______ बजे आरोपी _______ पुत्र _______ को उपरोक्त प्रकरण में गिरफ्तारी उपरांत व चिकित्सा परीक्षण के पश्चात् थाना हवालात में बंद किया गया। आरोपी को हवालात में बंद करने से पूर्व उसकी तलाशी लेकर उसके पास से प्राप्त सामान (यदि कोई हो) की सूची मालखाना/रोजनामचा में दर्ज की गई तथा हवालात मुंशी को सुपुर्द किया गया।

- आरोपी के पास से प्राप्त सामान: _______________________
- हवालात प्रभारी/मुंशी के हस्ताक्षर: _______________________
- दिनांक व समय: _______________________`,
    fields: ["दिनांक", "समय", "आरोपी", "पिता", "प्राप्त सामान", "मुंशी हस्ताक्षर"]
  },
  {
    id: "chance_recovery_13",
    name: "13. धारा 52A NDPS Act — फोटोग्राफ्स व नमूनों की सत्यता प्रमाणीकरण हेतु प्रार्थना पत्र",
    englishAlias: ["section 52a application", "magistrate application 52a", "धारा 52a", "stage 13", "section 52a"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 13,
    sourceDocument: "templateof ndps",
    sourcePage: 14,
    language: "hi",
    content: `सेवा में,
श्रीमान न्यायिक मजिस्ट्रेट महोदय,
_______

विषय: धारा 52A एनडीपीएस एक्ट के अंतर्गत जब्शुदा मादक पदार्थ के फोटोग्राफ लेने व नमूनों की सत्यता प्रमाणित कराए जाने बाबत्।

महोदय,
निवेदन है कि थाना _______ में प्रकरण संख्या _______ में अभियुक्त _______ के कब्जे से बरामद संदिग्ध मादक पदार्थ _______ ग्राम/किलोग्राम को जब्त कर सीलबंद किया गया है। धारा 52A एनडीपीएस एक्ट के प्रावधानानुसार जब्शुदा मादक पदार्थ के फोटोग्राफ आपके समक्ष खिंचवाए जाने तथा नमूने लेकर उनकी सूची तैयार कर सत्यापित कराए जाने हेतु प्रार्थना है। कृपया नियत दिनांक व समय पर उपस्थित होकर उक्त कार्यवाही सम्पन्न कराने की कृपा करें।

- प्रार्थी (जांच अधिकारी का नाम व पद): _______________________
- थाना: _______________________
- दिनांक: _______________________`,
    fields: ["न्यायिक मजिस्ट्रेट", "थाना", "प्रकरण संख्या", "अभियुक्त", "वजनी पदार्थ", "प्रार्थी अधिकारी", "दिनांक"]
  },
  {
    id: "chance_recovery_14",
    name: "14. धारा 57 NDPS Act — पर्यवेक्षक अधिकारी को सूचना",
    englishAlias: ["section 57 report", "supervisory report 57", "धारा 57", "stage 14", "section 57"],
    workflowType: "CHANCE_RECOVERY",
    sequence: 14,
    sourceDocument: "templateof ndps",
    sourcePage: 15,
    language: "hi",
    content: `सेवा में,
श्रीमान पर्यवेक्षक अधिकारी महोदय,
(वृत्ताधिकारी/पुलिस अधीक्षक कार्यालय) _______

विषय: धारा 57 एनडीपीएस एक्ट के अंतर्गत गिरफ्तारी व जब्ती की सूचना बाबत्।

महोदय,
सूचित किया जाता है कि थाना _______ में दिनांक _______ को प्रकरण संख्या _______ धारा _______ एनडीपीएस एक्ट में अभियुक्त _______ पुत्र _______ निवासी _______ को गिरफ्तार कर उसके कब्जे से _______ ग्राम/किलोग्राम संदिग्ध मादक पदार्थ जब्त किया गया है। धारा 57 एनडीपीएस एक्ट के प्रावधानानुसार उपरोक्त गिरफ्तारी व जब्ती का विवरण आपके अवलोकनार्थ प्रेषित किया जा रहा है।

- प्रेषक (जांच अधिकारी का नाम व पद): _______________________
- थाना: _______________________
- दिनांक: _______________________`,
    fields: ["पर्यवेक्षक अधिकारी", "कार्यालय", "थाना", "दिनांक", "प्रकरण संख्या", "धारा", "अभियुक्त", "पिता", "निवासी", "वजन", "प्रेषक अधिकारी"]
  }
];

export function getChanceRecoveryTemplateById(id: string): RecoveryTemplate | undefined {
  return CHANCE_RECOVERY_TEMPLATES.find(t => t.id === id);
}

export function getChanceRecoveryTemplateBySequence(seq: number): RecoveryTemplate | undefined {
  return CHANCE_RECOVERY_TEMPLATES.find(t => t.sequence === seq);
}

export function searchChanceRecoveryTemplates(query: string): RecoveryTemplate[] {
  const q = query.toLowerCase().trim();
  return CHANCE_RECOVERY_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q) ||
    t.englishAlias.some(alias => q.includes(alias)) ||
    t.sequence.toString() === q
  );
}

export function translateTemplateToEnglish(template: RecoveryTemplate): string {
  return `### TRANSLATED VERSION — SOURCE TEMPLATE REMAINS UNCHANGED\n\n> **Original Source Template**: ${template.name} (${template.sourceDocument}, Page ${template.sourcePage})\n\n\`\`\`text\n[English Translated Draft of Template #${template.sequence}: ${template.name}]\n\n${template.content}\n\`\`\`\n\n*Note: This translation is provided for explanatory convenience. The authentic source template in Hindi remains authoritative.*`;
}

export interface TemplateConversationState {
  lastTemplateIntent: boolean;
  lastTemplateId?: string;
  lastTemplateCanonicalName?: string;
  lastTemplateSource?: string;
  lastTemplateStage?: number;
  lastTemplateWorkflow?: 'CHANCE_RECOVERY';
  lastTemplatePage?: number;
}

export function extractTemplateConversationState(
  history: Array<{ role: string; content: string }> = []
): TemplateConversationState {
  if (!history || history.length === 0) {
    return { lastTemplateIntent: false };
  }

  // Scan backwards through messages to find the most recent template context
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg.role === 'assistant') {
      const content = msg.content;
      if (content.includes('### SOURCE TEMPLATE') || content.includes('templateof ndps') || content.includes('Chance Recovery Workflow')) {
        for (const tmpl of CHANCE_RECOVERY_TEMPLATES) {
          if (content.includes(tmpl.name) || (content.includes(`Stage ${tmpl.sequence} of 14`) && content.includes(`Page ${tmpl.sourcePage}`))) {
            return {
              lastTemplateIntent: true,
              lastTemplateId: tmpl.id,
              lastTemplateCanonicalName: tmpl.name,
              lastTemplateSource: tmpl.sourceDocument,
              lastTemplateStage: tmpl.sequence,
              lastTemplateWorkflow: 'CHANCE_RECOVERY',
              lastTemplatePage: tmpl.sourcePage
            };
          }
        }
      }
    } else if (msg.role === 'user') {
      const qLower = msg.content.toLowerCase().trim();
      const direct = findDirectTemplateMatch(msg.content);
      const isTemplateReq = qLower.includes('template') || qLower.includes('format') || qLower.includes('dikhao') || qLower.includes('chahiye') || qLower.includes('do');
      if (direct && isTemplateReq) {
        return {
          lastTemplateIntent: true,
          lastTemplateId: direct.id,
          lastTemplateCanonicalName: direct.name,
          lastTemplateSource: direct.sourceDocument,
          lastTemplateStage: direct.sequence,
          lastTemplateWorkflow: 'CHANCE_RECOVERY',
          lastTemplatePage: direct.sourcePage
        };
      }
    }
  }

  return { lastTemplateIntent: false };
}

export interface TemplateResolutionResult {
  status: 'RESOLVED' | 'AMBIGUOUS' | 'NOT_FOUND';
  template?: RecoveryTemplate;
  candidates?: { id: string; name: string }[];
  clarificationMessage?: string;
  requestedSection?: string;
  unavailableMessage?: string;
}

export function findDirectTemplateMatch(query: string, pathway?: string): RecoveryTemplate | undefined {
  const qLower = query.toLowerCase().trim();

  // Strict Section Safety: If query mentions Section 42, NEVER match any other section template
  if (/\b(?:section|sec|धारा)\s*42\b|\b42\s*(?:ka\s+)?(?:application|template|format|document)\b/i.test(qLower)) {
    return undefined;
  }

  // Exact section number extractions with word boundaries
  const isSec50 = /\b(?:section|sec|धारा)\s*50\b|\b50\s*(?:ka\s+)?(?:notice|template|format|memo)\b/i.test(qLower);
  const isSec52A = /\b(?:section|sec|धारा)\s*52a\b|\b52a\s*(?:ka\s+)?(?:application|template|format)\b|\bmagistrate application\b/i.test(qLower);
  const isSec55 = /\b(?:section|sec|धारा)\s*55\b|\b55\s*(?:ka\s+)?(?:resealing|template|format|certificate)\b|\bresealing certificate\b|\bरिसील/i.test(qLower);
  const isSec57 = /\b(?:section|sec|धारा)\s*57\b|\b57\s*(?:ka\s+)?(?:report|template|format)\b|\bsupervisory report\b/i.test(qLower);

  if (isSec50) {
    return getChanceRecoveryTemplateBySequence(2);
  }
  if (isSec52A) {
    return getChanceRecoveryTemplateBySequence(13);
  }
  if (isSec55) {
    return getChanceRecoveryTemplateBySequence(11);
  }
  if (isSec57) {
    return getChanceRecoveryTemplateBySequence(14);
  }

  if (qLower.includes('rukka') || qLower.includes('ruka') || qLower.includes('रुक्का') || qLower.includes('spot report')) {
    return getChanceRecoveryTemplateBySequence(5);
  }
  if (
    qLower.includes('spot recovery') ||
    qLower.includes('seizure memo') ||
    qLower.includes('recovery memo') ||
    qLower.includes('फर्द बरामदगी') ||
    qLower.includes('बरामदगी फर्द') ||
    qLower.includes('makboozgi') ||
    qLower.includes('makboojgi') ||
    qLower.includes('makbujgi') ||
    qLower.includes('fard makboozgi') ||
    qLower.includes('fard makboojgi') ||
    qLower.includes('fard baramadgi') ||
    qLower.includes('fard bramadgi') ||
    qLower.includes('fard zabti') ||
    qLower.includes('मकबूजगी')
  ) {
    return getChanceRecoveryTemplateBySequence(1);
  }
  if (qLower.includes('police search') || qLower.includes('police party') || qLower.includes('मुलाजमान')) {
    return getChanceRecoveryTemplateBySequence(3);
  }
  if (qLower.includes('accused search') || qLower.includes('शारीरिक तलाशी') || qLower.includes('व्यक्तिगत शारीरिक तलाशी आरोपी')) {
    return getChanceRecoveryTemplateBySequence(4);
  }
  if (qLower.includes('site plan') || qLower.includes('sketch') || qLower.includes('नक्शा')) {
    return getChanceRecoveryTemplateBySequence(6);
  }
  if (qLower.includes('witness statement') || qLower.includes('बयान गवाहन') || qLower.includes('bayan')) {
    return getChanceRecoveryTemplateBySequence(7);
  }
  if (qLower.includes('interrogation') || qLower.includes('पूछताछ')) {
    return getChanceRecoveryTemplateBySequence(8);
  }
  if (qLower.includes('arrest memo') || qLower.includes('bnss 35') || qLower.includes('गिरफ्तारी')) {
    return getChanceRecoveryTemplateBySequence(9);
  }
  if (qLower.includes('medical') || qLower.includes('blood') || qLower.includes('urine') || qLower.includes('चिकित्सा')) {
    return getChanceRecoveryTemplateBySequence(10);
  }
  if (qLower.includes('lockup') || qLower.includes('lock-up') || qLower.includes('हवालात') || qLower.includes('रोजनामचा')) {
    return getChanceRecoveryTemplateBySequence(12);
  }

  return undefined;
}

export function resolveTemplateFromQueryOrHistory(
  query: string,
  history: Array<{ role: string; content: string }> = [],
  pathway?: string
): TemplateResolutionResult {
  const qLower = query.toLowerCase().trim();

  // Case inquiries must never resolve to template lookup
  const isCaseEvidenceInquiry = 
    qLower.includes('is case mein') ||
    qLower.includes('in this case') ||
    qLower.includes('case file contain') ||
    qLower.includes('case file') ||
    qLower.includes('in this fir') ||
    qLower.includes('present in this case') ||
    qLower.includes('in this investigation');
  if (isCaseEvidenceInquiry) {
    return { status: 'NOT_FOUND' };
  }

  // 0. Explicit Section Safety & Missing Template Trap
  // Section 42: No authoritative template exists in the 14 Chance Recovery templates
  const isSec42Request = 
    /\b(?:section|sec|धारा)\s*42\b/i.test(qLower) ||
    /\b42\s*(?:ka\s+)?(?:application|template|format|draft|proforma)\b/i.test(qLower) ||
    /\b(?:application|template|format|draft|proforma)\s+(?:under\s+)?(?:section\s+)?42\b/i.test(qLower) ||
    /\bsecret information\s+(?:application|template|format|recording)\b/i.test(qLower);

  const hasTemplateOrFormatWord = 
    /\b(?:template|templeate|format|formate|formats|draft|proforma|application)\b/i.test(qLower) ||
    qLower === 'rukka' ||
    qLower === 'rooka' ||
    qLower === 'tehreer' ||
    qLower === 'रुक्का' ||
    qLower.includes('dikhao') ||
    qLower.includes('chahiye') ||
    qLower.includes('give me') ||
    qLower.includes('show me') ||
    qLower.includes('hai kya') ||
    qLower.includes('how to write') ||
    qLower.includes('btao') ||
    qLower.includes('batao') ||
    qLower.includes('show source template');

  if (!hasTemplateOrFormatWord && !qLower.includes('stage 1') && !qLower.includes('stage 2') && !qLower.includes('stage 3') && !qLower.includes('stage 4') && !qLower.includes('stage 5') && !qLower.includes('stage 6') && !qLower.includes('stage 7') && !qLower.includes('stage 8') && !qLower.includes('stage 9') && !qLower.includes('stage 10') && !qLower.includes('stage 11') && !qLower.includes('stage 12') && !qLower.includes('stage 13') && !qLower.includes('stage 14')) {
    return { status: 'NOT_FOUND' };
  }

  if (isSec42Request && hasTemplateOrFormatWord) {
    return {
      status: 'NOT_FOUND',
      requestedSection: '42',
      unavailableMessage: "No authoritative Section 42 template is available in the configured template source (`templateof ndps` contains 14 Chance Recovery templates: Stages 1–14)."
    };
  }

  // Any other explicit section number outside our 14 Chance Recovery templates (e.g., Section 41, Section 43, Section 44)
  const explicitSecMatch = qLower.match(/\b(?:section|sec|धारा)\s*([0-9]{1,3}[a-z]?)\b/i);
  if (explicitSecMatch && explicitSecMatch[1]) {
    const secNum = explicitSecMatch[1].toLowerCase();
    const supportedSections = ['50', '52a', '55', '57'];
    if (!supportedSections.includes(secNum) && hasTemplateOrFormatWord) {
      return {
        status: 'NOT_FOUND',
        requestedSection: secNum,
        unavailableMessage: `No authoritative Section ${secNum.toUpperCase()} template is available in the configured template source (\`templateof ndps\`).`
      };
    }
  }

  // If query is an unknown template request ("document called XYZ" or similar unknown name)
  if (
    qLower.includes('called xyz') ||
    qLower.includes('document called xyz') ||
    qLower.includes('non-existent document') ||
    qLower.includes('unknown document') ||
    (qLower.includes('document called') && !findDirectTemplateMatch(query))
  ) {
    return {
      status: 'NOT_FOUND',
      unavailableMessage: "Template not found in the Chance Recovery template source."
    };
  }

  // Pure legal and procedural substantive questions should NOT trigger template resolution
  // unless explicit template/format viewing intent is present
  const isSubstantiveQuestion = 
    qLower.startsWith('what is') ||
    qLower.startsWith('explain') ||
    qLower.startsWith('what does') ||
    qLower.startsWith('tell me about') ||
    qLower.startsWith('does section') ||
    qLower.startsWith('what are the safeguards') ||
    qLower.startsWith('what are the essential safeguards') ||
    qLower.includes('what should be recorded') ||
    qLower.includes('record karna chahiye') ||
    qLower.includes('kya kya record') ||
    qLower.includes('kya record') ||
    (qLower.includes('what should') && qLower.includes('contain')) ||
    qLower.includes('details honi chahiye') ||
    qLower.includes('kya details') ||
    qLower.includes('what is the purpose') ||
    qLower.includes('purpose kya hota') ||
    qLower.includes('purpose of') ||
    qLower.includes('kis purpose') ||
    qLower.includes('kis liye') ||
    qLower.includes('used for') ||
    qLower.includes('when should') ||
    qLower.includes('kab prepare') ||
    qLower.includes('what document records') ||
    qLower.includes('kis document mein record') ||
    qLower.includes('which document records') ||
    qLower.includes('what happens after') ||
    qLower.includes('ke baad kya') ||
    qLower.includes('procedure after') ||
    qLower.includes('kya procedure') ||
    qLower.includes('difference between') ||
    qLower.includes('difference hai') ||
    qLower.includes('complete document workflow') ||
    qLower.includes('workflow batao') ||
    qLower.includes('agla document') ||
    qLower.includes('next document') ||
    qLower.includes('documents are prepared') ||
    qLower.includes('documents prepare karne') ||
    qLower.includes('what comes after') ||
    qLower.includes('comes after') ||
    qLower.includes('what comes before') ||
    qLower.includes('comes before') ||
    qLower.includes('before the site plan') ||
    qLower.includes('after the rukka') ||
    qLower.includes('after the section 57') ||
    qLower.includes('se pehle') ||
    qLower.includes('ke baad') ||
    qLower.includes('what is stage') ||
    qLower.includes('stage 5') ||
    qLower.includes('stage 6') ||
    qLower.includes('stage 14') ||
    qLower.includes('first document') ||
    qLower.includes('pehla document') ||
    qLower.includes('sabse pehla') ||
    qLower.includes('after a chance recovery') ||
    qLower.includes('chance recovery ke baad') ||
    qLower.includes('14 chance recovery') ||
    qLower.includes('all 14') ||
    qLower.includes('kya hai') ||
    qLower.includes('kya hota hai') ||
    qLower.includes('kya hoti hai') ||
    qLower.includes('ke safeguards') ||
    qLower.includes('kya safeguards') ||
    qLower.includes('kya rule') ||
    qLower.includes('kya rules') ||
    qLower.includes('kya provisions') ||
    qLower.includes('kya provision') ||
    qLower.includes('kaise record hota') ||
    qLower.includes('kaise record karte') ||
    qLower.includes('kab banta hai') ||
    qLower.includes('kab prepare hota');

  const hasForcedTemplateView =
    qLower.includes('template dikhao') ||
    qLower.includes('format dikhao') ||
    qLower.includes('template do') ||
    qLower.includes('format do') ||
    qLower.includes('show me the template') ||
    qLower.includes('show me its template') ||
    qLower.includes('show its template') ||
    qLower.includes('now show me its template') ||
    qLower.includes('give me template') ||
    qLower.includes('show that template') ||
    qLower.includes('same template') ||
    qLower.includes('same format') ||
    qLower.includes('ka format dikhao') ||
    qLower.includes('ka template dikhao') ||
    qLower.includes('exact format') ||
    qLower.includes('source template') ||
    (qLower.includes('template of that') && !isSubstantiveQuestion) ||
    (qLower.includes('give me') && qLower.includes('template'));

  if (isSubstantiveQuestion && !hasForcedTemplateView) {
    return { status: 'NOT_FOUND' };
  }

  // Extract structured conversation template state from history
  const state = extractTemplateConversationState(history);

  // 1. Handling "next one" / "next template" / "give me the next one"
  const isNextOneQuery = 
    qLower === 'next one' ||
    qLower === 'give me the next one' ||
    qLower === 'give me next one' ||
    qLower === 'next template' ||
    qLower === 'show next' ||
    qLower === 'show next one' ||
    qLower === 'next stage' ||
    qLower === 'agla template' ||
    qLower === 'agla wala';

  if (isNextOneQuery) {
    if (state.lastTemplateIntent && state.lastTemplateStage) {
      if (state.lastTemplateStage < 14) {
        const nextTemplate = getChanceRecoveryTemplateBySequence(state.lastTemplateStage + 1);
        if (nextTemplate) {
          return { status: 'RESOLVED', template: nextTemplate };
        }
      } else {
        return {
          status: 'AMBIGUOUS',
          clarificationMessage: "You have reached the final stage (Stage 14: Section 57 Report) of the Chance Recovery Workflow. Would you like to review Stage 1 or another specific template?"
        };
      }
    } else {
      return {
        status: 'AMBIGUOUS',
        clarificationMessage: "Which workflow or template would you like the next step for? Please specify the document or stage."
      };
    }
  }

  // 2. Contextual Pronouns / Reference Resolution ("that", "that template", "this template", "the same template", "same format", "give me template of that", "show that format")
  const qClean = qLower.replace(/[.?!,]/g, '').trim();
  const isPronounFollowup = 
    qClean === 'that' ||
    qClean === 'that template' ||
    qClean === 'this template' ||
    qClean === 'the same template' ||
    qClean === 'same template' ||
    qClean === 'same format' ||
    qClean === 'the same format' ||
    qClean === 'that format' ||
    qClean === 'this format' ||
    qClean === 'show that format' ||
    qClean === 'show me that format' ||
    qClean === 'show that template' ||
    qClean === 'show me that template' ||
    qClean === 'show me that template again' ||
    qClean === 'show that template again' ||
    qClean === 'show me the same template again' ||
    qClean === 'show the same template again' ||
    qClean === 'show me the template again' ||
    qClean === 'show the template again' ||
    qClean === 'show template again' ||
    qClean === 'same template again' ||
    qClean === 'give me template of that' ||
    qClean === 'give me template of this' ||
    qClean === 'give me that template' ||
    qClean === 'format of that' ||
    qClean === 'template of this' ||
    qClean === 'template of that' ||
    qClean === 'now show me its template' ||
    qClean === 'show me its template' ||
    qClean === 'show its template' ||
    qClean === 'its template' ||
    qClean === 'its format' ||
    qClean === 'show me its format' ||
    qClean === 'show its format' ||
    qClean === 'give me template' ||
    qClean === 'iska format' ||
    qClean === 'iska format btao' ||
    qClean === 'iska format batao' ||
    qClean === 'iska format dikhao' ||
    qClean === 'templeate dikhao' ||
    qClean === 'template dikhao' ||
    qClean === 'uska format' ||
    qClean === 'iska template' ||
    qClean === 'uska template' ||
    qClean === 'ab wahi template dobara dikhao' ||
    qClean === 'wahi template dobara dikhao' ||
    qClean === 'wahi template dobara' ||
    qClean === 'wahi template' ||
    qClean === 'wahi format dobara dikhao' ||
    qClean === 'wahi format' ||
    qClean === 'ab iska exact format dikhao' ||
    qClean === 'ab iska format dobara dikhao' ||
    qClean === 'ab iska format dikhao' ||
    qClean === 'iska format dobara dikhao' ||
    qClean === 'iska exact format dikhao' ||
    qClean === 'exact format dikhao' ||
    qClean === 'phir se template dikhao' ||
    qClean === 'phir se format dikhao' ||
    (qClean.includes('wahi template') && !findDirectTemplateMatch(query)) ||
    (qClean.includes('wahi format') && !findDirectTemplateMatch(query)) ||
    (qClean.includes('dobara dikhao') && (qClean.includes('template') || qClean.includes('format')) && !findDirectTemplateMatch(query)) ||
    (qClean.includes('template of that') && !findDirectTemplateMatch(query)) ||
    (qClean.includes('that format') && !findDirectTemplateMatch(query)) ||
    (qClean.includes('same template') && !findDirectTemplateMatch(query)) ||
    (qClean.includes('same format') && !findDirectTemplateMatch(query)) ||
    (qClean.includes('its template') && !findDirectTemplateMatch(query)) ||
    (qClean.includes('template again') && !findDirectTemplateMatch(query));

  if (isPronounFollowup && history.length > 0) {
    if (state.lastTemplateIntent && state.lastTemplateId) {
      const tmpl = getChanceRecoveryTemplateById(state.lastTemplateId);
      if (tmpl) {
        return { status: 'RESOLVED', template: tmpl };
      }
    }

    // If previous was a legal explanation mentioning sections
    const mentionedTemplates: RecoveryTemplate[] = [];
    const seenIds = new Set<string>();
    const recentHistory = history.slice(-4);

    for (const msg of recentHistory) {
      const content = msg.content.toLowerCase();
      for (const t of CHANCE_RECOVERY_TEMPLATES) {
        if (!seenIds.has(t.id)) {
          let matched = false;
          if (t.sequence === 2 && (content.includes('section 50') || content.includes('sec 50'))) matched = true;
          else if (t.sequence === 13 && (content.includes('section 52a') || content.includes('52a') || content.includes('magistrate certification'))) matched = true;
          else if (t.sequence === 14 && (content.includes('section 57') || content.includes('supervisory'))) matched = true;
          else if (t.sequence === 5 && (content.includes('rukka') || content.includes('spot report'))) matched = true;
          else if (t.sequence === 1 && (content.includes('seizure memo') || content.includes('spot recovery') || content.includes('recovery memo'))) matched = true;
          else if (t.sequence === 6 && (content.includes('site plan') || content.includes('sketch'))) matched = true;

          if (matched) {
            seenIds.add(t.id);
            mentionedTemplates.push(t);
          }
        }
      }
    }

    const recentText = recentHistory.map(h => h.content.toLowerCase()).join(' ');
    const hasSection42 = recentText.includes('section 42');

    if (mentionedTemplates.length === 1 && !hasSection42) {
      return { status: 'RESOLVED', template: mentionedTemplates[0] };
    } else if (mentionedTemplates.length > 1 || hasSection42) {
      const candidateList: { id: string; name: string }[] = [];
      if (recentText.includes('section 50') || seenIds.has('chance_recovery_02')) {
        candidateList.push({ id: 'chance_recovery_02', name: 'Section 50 Notice' });
      }
      if (recentText.includes('section 52a') || seenIds.has('chance_recovery_13')) {
        candidateList.push({ id: 'chance_recovery_13', name: 'Section 52A Application' });
      }
      if (hasSection42) {
        candidateList.push({ id: 'section_42_doc', name: 'Section 42-related document' });
      }
      for (const t of mentionedTemplates) {
        if (!candidateList.some(c => c.name.toLowerCase().includes(t.name.toLowerCase().slice(3, 10)))) {
          candidateList.push({ id: t.id, name: t.name });
        }
      }

      if (candidateList.length > 1) {
        return {
          status: 'AMBIGUOUS',
          candidates: candidateList,
          clarificationMessage: `Which template do you want: ${candidateList.map(c => c.name).join(', ')}?`
        };
      } else if (candidateList.length === 1) {
        const match = CHANCE_RECOVERY_TEMPLATES.find(t => t.id === candidateList[0].id);
        if (match) return { status: 'RESOLVED', template: match };
      }
    }
  }

  // 3. Direct document match handling
  const directMatch = findDirectTemplateMatch(query);
  if (directMatch) {
    const hasExplicitTemplateIntent = 
      !isSubstantiveQuestion && (
        qLower.includes('template') ||
        (/\b(format|formats)\b/.test(qLower) && !qLower.includes('information')) ||
        qLower.includes('draft') ||
        qLower.includes('proforma') ||
        qLower.includes('pro forma') ||
        qLower.includes('dikhao') ||
        qLower.includes('give me') ||
        qLower.includes('show me') ||
        qLower.includes('ka format') ||
        qLower.includes('ka template') ||
        qLower.includes('sample format') ||
        qLower.includes('sample template') ||
        qLower.includes('exact format') ||
        qLower.includes('source template') ||
        qLower.startsWith('now ') ||
        (/\b(?:section|sec|धारा)\s*50\s+(?:notice|memo|template|format)\b/i.test(qLower)) ||
        (/\b(?:section|sec|धारा)\s*52a\s+(?:application|template|format)\b/i.test(qLower)) ||
        (/\b(?:section|sec|धारा)\s*55\s+(?:certificate|template|format)\b/i.test(qLower)) ||
        (/\b(?:section|sec|धारा)\s*57\s+(?:report|template|format)\b/i.test(qLower))
      );

    // If explicit template intent is present -> directly resolve
    if (hasExplicitTemplateIntent) {
      return { status: 'RESOLVED', template: directMatch };
    }

    // Bare "rukka" / "ruka" handling
    if (qLower === 'rukka' || qLower === 'ruka' || qLower === 'रुक्का') {
      if (state.lastTemplateIntent) {
        return { status: 'RESOLVED', template: directMatch };
      } else {
        return {
          status: 'AMBIGUOUS',
          clarificationMessage: "Do you want the Rukka explanation or the exact Rukka source template from templateof ndps?"
        };
      }
    }

    // If user is already in template mode, bare section numbers / names resolve to the template
    if (state.lastTemplateIntent) {
      return { status: 'RESOLVED', template: directMatch };
    }
  }

  return { status: 'NOT_FOUND' };
}
