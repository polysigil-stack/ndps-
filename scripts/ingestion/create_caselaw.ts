import fs from 'fs';
import path from 'path';
import { NDPSRecord } from '../../src/server/types';

// Let's create an array of case law records.
const caseLawRecords: Partial<NDPSRecord>[] = [
  {
    record_id: 'case_sec37_1',
    question_number: 1001,
    question: 'What is the Supreme Court interpretation of Section 37 regarding the twin conditions for bail in commercial quantity cases?',
    answer: 'The Supreme Court of India has consistently held that the twin conditions under Section 37 of the NDPS Act are mandatory for offences involving commercial quantities. Before granting bail, the court must be satisfied that there are reasonable grounds for believing that the accused is not guilty of such offence and that they are not likely to commit any offence while on bail. The term "reasonable grounds" means something more than prima facie grounds; it contemplates substantial probable causes for believing that the accused is not guilty. \n\n*Reference: State of Kerala and Ors. v. Rajesh and Ors. (2020), Supreme Court of India.*',
    source: 'State of Kerala and Ors. v. Rajesh and Ors. (2020)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 37 Twin Conditions for Bail\nContent: The Supreme Court of India in State of Kerala v. Rajesh (2020) held that the twin conditions under Section 37 of the NDPS Act are mandatory for commercial quantities. "Reasonable grounds" means more than prima facie grounds; it requires substantial probable causes for believing the accused is not guilty and not likely to commit an offence while on bail.',
    source_type: 'case_law',
    section: 'Section 37'
  },
  {
    record_id: 'case_sec37_2',
    question_number: 1002,
    question: 'Can prolonged incarceration overriding the statutory restrictions of Section 37 of the NDPS Act be a ground for bail under Article 21?',
    answer: 'Yes, the Supreme Court has held that while the twin conditions under Section 37 are stringent, they are not absolute if they violate the fundamental right to a speedy trial under Article 21 of the Constitution of India. In cases of prolonged incarceration where the trial is unlikely to conclude in a reasonable time, the constitutional mandate of Article 21 can override the statutory restrictions of Section 37, allowing the court to grant bail.\n\n*Reference: Rabi Prakash v. State of Odisha (2023), Supreme Court of India.*',
    source: 'Rabi Prakash v. State of Odisha (2023)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 37 vs Article 21 Prolonged Incarceration\nContent: In Rabi Prakash v. State of Odisha (2023), the Supreme Court held that prolonged incarceration and delay in trial can override the stringent twin conditions of Section 37 under the NDPS Act, as the fundamental right to life and liberty under Article 21 of the Constitution takes precedence.',
    source_type: 'case_law',
    section: 'Section 37'
  },
  {
    record_id: 'case_sec42_1',
    question_number: 1003,
    question: 'What is the Supreme Court interpretation of Section 42 of the NDPS Act regarding recording of information?',
    answer: 'The Supreme Court has held that the requirement to record information in writing and forward a copy to the immediate official superior under Section 42 of the NDPS Act is mandatory. However, total non-compliance renders the trial vitiated, while delayed compliance (within a reasonable time) may be acceptable if the officer can explain the delay due to emergency circumstances. Substantial compliance is required, and any departure must be justified.\n\n*Reference: Karnail Singh v. State of Haryana (2009), Supreme Court of India (Constitution Bench).*',
    source: 'Karnail Singh v. State of Haryana (2009)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 42 Recording of Information\nContent: In Karnail Singh v. State of Haryana (2009), a Constitution Bench of the Supreme Court held that compliance with Section 42 of the NDPS Act (recording information in writing and sending it to a superior) is mandatory. Delayed compliance may be excused if explained by emergent circumstances, but total non-compliance vitiates the search and seizure.',
    source_type: 'case_law',
    section: 'Section 42'
  },
  {
    record_id: 'case_sec43_1',
    question_number: 1004,
    question: 'How does the Supreme Court distinguish between Section 42 and Section 43 for search and seizure in public places?',
    answer: 'The Supreme Court has clarified that Section 43 of the NDPS Act applies to search and seizure in public places or transit, where the strict requirements of Section 42 (such as recording information in writing before acting) do not apply. If the recovery is made from a public place or a vehicle in transit in a public place, Section 43 is attracted, and the officer is not bound by the procedural rigors of Section 42.\n\n*Reference: State of Haryana v. Jarnail Singh (2004) and Mohan Lal v. State of Rajasthan (2015), Supreme Court of India.*',
    source: 'Mohan Lal v. State of Rajasthan (2015)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 43 vs Section 42\nContent: The Supreme Court in cases like Mohan Lal v. State of Rajasthan (2015) has held that for search and seizure in a public place or a vehicle in transit, Section 43 of the NDPS Act applies, not Section 42. Thus, the requirement of recording information under Section 42 is not mandatory in public places.',
    source_type: 'case_law',
    section: 'Section 43'
  },
  {
    record_id: 'case_sec50_1',
    question_number: 1005,
    question: 'What is the Supreme Court interpretation of Section 50 of the NDPS Act regarding personal search?',
    answer: 'The Supreme Court has held that the requirements of Section 50 of the NDPS Act are mandatory and strictly apply only to the "personal search" of the accused. The suspect must be informed of their legal right to be searched in the presence of a Gazetted Officer or a Magistrate. Failure to communicate this right vitiates the personal search. However, Section 50 does not apply to the search of a bag, briefcase, container, or vehicle carried by the person.\n\n*Reference: State of Punjab v. Baldev Singh (1999) and State of H.P. v. Pawan Kumar (2005), Supreme Court of India.*',
    source: 'State of Punjab v. Baldev Singh (1999)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 50 Personal Search\nContent: The Supreme Court (Constitution Bench) in State of Punjab v. Baldev Singh (1999) held that Section 50 is mandatory. The officer must inform the suspect of their right to be searched before a Gazetted Officer or Magistrate. In State of H.P. v. Pawan Kumar (2005), the Court clarified that Section 50 applies strictly to the search of the person, not to bags, vehicles, or containers.',
    source_type: 'case_law',
    section: 'Section 50'
  },
  {
    record_id: 'case_sec52a_1',
    question_number: 1006,
    question: 'What is the Supreme Court interpretation of Section 52A regarding inventory, sampling, and Magistrate certification?',
    answer: 'The Supreme Court has held that compliance with Section 52A of the NDPS Act is mandatory. The process of drawing samples must be done in the presence of a Magistrate, and the inventory must be certified by the Magistrate. Samples drawn at the spot by the investigating officer without the Magistrate\'s presence are not valid primary evidence. Failure to strictly comply with Section 52A renders the contraband evidence inadmissible and often leads to acquittal.\n\n*Reference: Union of India v. Mohanlal (2016) and Mangilal v. State of Madhya Pradesh (2023), Supreme Court of India.*',
    source: 'Union of India v. Mohanlal (2016)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 52A Sampling and Certification\nContent: In Union of India v. Mohanlal (2016) and subsequent cases like Mangilal v. State of MP (2023), the Supreme Court ruled that sampling and inventory of seized contraband under Section 52A must be certified by a Magistrate. Samples drawn directly by officers at the spot without a Magistrate are invalid, rendering the seizure evidence legally deficient.',
    source_type: 'case_law',
    section: 'Section 52A'
  },
  {
    record_id: 'case_sec54_1',
    question_number: 1007,
    question: 'What is the Supreme Court interpretation of Section 54 regarding presumption from possession?',
    answer: 'Under Section 54 of the NDPS Act, a presumption of guilt arises once the prosecution proves beyond reasonable doubt that the accused was in conscious possession of the contraband. The Supreme Court has held that the initial burden rests on the prosecution to establish possession. Once established, the burden shifts to the accused to satisfactorily account for the possession to rebut the statutory presumption.\n\n*Reference: Dharampal Singh v. State of Punjab (2010), Supreme Court of India.*',
    source: 'Dharampal Singh v. State of Punjab (2010)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 54 Presumption of Possession\nContent: In Dharampal Singh v. State of Punjab (2010), the Supreme Court held that the presumption under Section 54 of the NDPS Act triggers only after the prosecution initially establishes conscious possession of the drugs beyond reasonable doubt. Then, the burden shifts to the accused to explain it.',
    source_type: 'case_law',
    section: 'Section 54'
  },
  {
    record_id: 'case_sec67_1',
    question_number: 1008,
    question: 'What is the Supreme Court interpretation of Section 67 regarding statements and confessions?',
    answer: 'The Supreme Court fundamentally altered the interpretation of Section 67 of the NDPS Act, holding that officers of the Central and State agencies appointed under the NDPS Act are "police officers" within the meaning of Section 25 of the Evidence Act. Therefore, any confessional statement recorded under Section 67 of the NDPS Act is inadmissible in evidence and cannot be used to convict an accused.\n\n*Reference: Tofan Singh v. State of Tamil Nadu (2021), Supreme Court of India.*',
    source: 'Tofan Singh v. State of Tamil Nadu (2021)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 67 Confessional Statements\nContent: In Tofan Singh v. State of Tamil Nadu (2021), the Supreme Court held that officers under the NDPS Act are "police officers". Consequently, confessional statements recorded by them under Section 67 of the NDPS Act are barred by Section 25 of the Evidence Act and are inadmissible as evidence.',
    source_type: 'case_law',
    section: 'Section 67'
  },
  {
    record_id: 'case_sec60_3',
    question_number: 1009,
    question: 'What is the Supreme Court interpretation of Section 60(3) regarding confiscation of conveyances?',
    answer: 'The Supreme Court has clarified that under Section 60(3) of the NDPS Act, a conveyance is liable to confiscation unless the owner proves it was used without their knowledge or connivance. However, the confiscation proceedings are distinct from the criminal trial of the accused, and temporary release of the vehicle (superdari) during trial can be ordered under the CrPC by the Magistrate.\n\n*Reference: Sunderbhai Ambalal Desai v. State of Gujarat (2002) (General principle on disposal) and specific NDPS rulings on Section 60(3).*',
    source: 'Supreme Court Interpretations on Section 60(3)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 60(3) Confiscation\nContent: The Supreme Court has held that for Section 60(3) of the NDPS Act, a conveyance used in carrying drugs is liable to confiscation unless the owner proves lack of knowledge. Courts can order temporary release (superdari) of the vehicle during trial to prevent its deterioration.',
    source_type: 'case_law',
    section: 'Section 60(3)'
  }
];

fs.writeFileSync(path.resolve('data/ndps_caselaw.json'), JSON.stringify(caseLawRecords, null, 2));
console.log('Created data/ndps_caselaw.json');
