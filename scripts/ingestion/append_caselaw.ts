import fs from 'fs';
import path from 'path';
import { NDPSRecord } from '../../src/server/types';

const caseLawRecords: Partial<NDPSRecord>[] = [
  {
    record_id: 'case_sec35_1',
    question_number: 1010,
    question: 'What is the Supreme Court interpretation of Section 35 regarding culpable mental state?',
    answer: 'Under Section 35 of the NDPS Act, a presumption of culpable mental state (intention, motive, knowledge) is drawn against the accused. However, the Supreme Court has clarified that this presumption only arises after the prosecution has discharged its initial burden of proving the foundational facts beyond a reasonable doubt (e.g., conscious possession). Once established, the burden shifts to the accused to prove they had no such mental state by a preponderance of probabilities.\n\n*Reference: Naresh Kumar @ Nitu v. State of Himachal Pradesh (2017), Supreme Court of India.*',
    source: 'Naresh Kumar @ Nitu v. State of Himachal Pradesh (2017)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 35 Culpable Mental State\nContent: The Supreme Court in Naresh Kumar v. State of HP (2017) held that the presumption of culpable mental state under Section 35 of the NDPS Act triggers only after the prosecution proves the foundational facts of recovery and conscious possession beyond reasonable doubt. The accused must then rebut it on a preponderance of probabilities.',
    source_type: 'case_law',
    section: 'Section 35'
  },
  {
    record_id: 'case_sec20_21_22_1',
    question_number: 1011,
    question: 'How does the Supreme Court interpret quantity-based offences and sentencing under Sections 20, 21, and 22 of the NDPS Act?',
    answer: 'The Supreme Court has upheld the quantity-based sentencing structure under the NDPS Act. Crucially, regarding mixtures containing neutral substances, the Supreme Court held that the entire weight of the seized mixture (including neutral material), and not just the pure drug content, must be considered to determine whether it constitutes a small or commercial quantity.\n\n*Reference: Hira Singh v. Union of India (2020), Supreme Court of India (Constitution Bench).*',
    source: 'Hira Singh v. Union of India (2020)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Quantity Determination (Mixtures)\nContent: In Hira Singh v. Union of India (2020), a Constitution Bench of the Supreme Court held that for determining small or commercial quantities under Sections 20, 21, and 22 of the NDPS Act, the total weight of the seized mixture (including neutral substances) must be considered, not just the weight of the pure narcotic or psychotropic substance.',
    source_type: 'case_law',
    section: 'Quantity-based Offences'
  },
  {
    record_id: 'case_sec29_1',
    question_number: 1012,
    question: 'What is the Supreme Court interpretation of Section 29 regarding abetment and criminal conspiracy?',
    answer: 'The Supreme Court has established that to prove criminal conspiracy under Section 29 of the NDPS Act, the prosecution must show a meeting of minds or an agreement to commit an offence under the Act. Mere association with the principal accused or passive presence is insufficient to attract Section 29. Furthermore, confessional statements of co-accused under Section 67 (now inadmissible) cannot solely form the basis for conviction under Section 29 without independent corroborative evidence.\n\n*Reference: Surinder Kumar Khanna v. Intelligence Officer, DRI (2018), Supreme Court of India.*',
    source: 'Surinder Kumar Khanna v. Intelligence Officer, DRI (2018)',
    page: 1,
    quality_status: 'clean',
    retrieval_eligible: true,
    rag_text: 'Title: Supreme Court Interpretation - Section 29 Abetment and Conspiracy\nContent: The Supreme Court held in Surinder Kumar Khanna (2018) that Section 29 of the NDPS Act requires proof of an agreement or meeting of minds. A conviction under Section 29 cannot be based solely on the confessional statement of a co-accused without independent corroborating evidence.',
    source_type: 'case_law',
    section: 'Section 29'
  }
];

const caselawPath = path.resolve('data/ndps_caselaw.json');
let records = JSON.parse(fs.readFileSync(caselawPath, 'utf-8'));
records = records.concat(caseLawRecords);
fs.writeFileSync(caselawPath, JSON.stringify(records, null, 2));
console.log(`Appended 3 records to data/ndps_caselaw.json. Total: ${records.length}`);
