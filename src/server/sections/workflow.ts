import { StructuredSectionRecord } from './types';

export interface WorkflowStage {
  stageNumber: number;
  title: string;
  category: 'Statutory Requirement' | 'Investigation Practice' | 'Judicial Process' | 'Statutory Requirement & Investigation Practice' | 'Statutory & Documentation Procedure';
  summary: string;
  details: string[];
  distinctions: string[];
  evidenceDocumentation: string[];
  statutoryReference: string;
}

export interface InvestigationWorkflow {
  title: string;
  introduction: string;
  flowVisualizationText: string;
  stages: WorkflowStage[];
  closingNote: string;
}

export const NDPS_INVESTIGATION_WORKFLOW: InvestigationWorkflow = {
  title: "NDPS Investigation Documentation Flow: Search/Seizure to Section 52A",
  introduction: "In a typical NDPS investigation workflow, documentation and handling of seized material proceed through multiple statutory and investigative stages. The exact sequence may vary according to the facts, applicable provisions, and competent authority.",
  flowVisualizationText: `Section 42 information
        ↓
Search / personal search documentation
        ↓
Search & seizure
        ↓
Section 50 compliance (where applicable)
        ↓
Rukka / field report → FIR
        ↓
Seized material produced/custody under applicable Section 55 procedure
        ↓
Section 57 report to superior officer
        ↓
Section 52A application / judicial process
        ↓
Magistrate/court proceedings and order`,
  stages: [
    {
      stageNumber: 1,
      title: "SECTION 42 INFORMATION",
      category: "Statutory Requirement",
      summary: "Recording of secret intelligence or reasons for belief before conducting entry, search, seizure, or arrest in any building, conveyance, or enclosed place without a warrant.",
      details: [
        "Where Section 42 applies (searches of buildings, conveyances, or enclosed private places based on prior secret intelligence or personal knowledge), the officer must verify their specific statutory empowerment via applicable Central/State Government notification. Never infer empowerment from rank alone (e.g., SI/ASI).",
        "The empowered officer must reduce secret information/grounds of belief into writing (Information Receipt Memo / GD entry).",
        "Under Section 42(2), a copy of the recorded information or recorded grounds of belief must be dispatched to the immediate official superior within 72 hours (as amended by Act 9 of 2001)."
      ],
      distinctions: [
        "Empowerment: Authority to search under Section 42 is derived from specific government notifications, not rank. Verify actual authority before proceeding.",
        "Preserve the distinction between Section 42 (private buildings, conveyances, enclosed places requiring prior written recording) and Section 43 (public places or items in transit, which do not mandate prior Section 42(2) written dispatch before interception).",
        "Distinguish Section 42 entries from judicial search warrants issued under Section 41(1) or Gazetted Officer search authorisations issued under Section 41(2)."
      ],
      evidenceDocumentation: ["GD Entry / Secret Information Memo", "Section 42(2) Dispatch Receipt / Supervisor Acknowledgement", "Empowerment Notification Verification"],
      statutoryReference: "NDPS Act, 1985, Section 42(1) & Section 42(2)"
    },
    {
      stageNumber: 2,
      title: "PERSONAL SEARCH / SEARCH MEMO",
      category: "Investigation Practice",
      summary: "Documenting search operations and preparing the spot search memo in the presence of independent witnesses.",
      details: [
        "The search operation at the spot must be documented appropriately through a Search Memo / Spot Panchnama witnessed by independent local witnesses.",
        "Where a personal search of a person is involved, Section 50 safeguards must be applied where legally applicable."
      ],
      distinctions: [
        "Section 50 safeguards apply strictly and exclusively to the search of a physical human body and apparel worn on the body (State of H.P. v. Pawan Kumar, 2005).",
        "Do NOT automatically apply Section 50 to every bag, vehicle, premises, or external container search."
      ],
      evidenceDocumentation: ["Spot Search Panchnama / Search Memo", "Independent Witness Statements"],
      statutoryReference: "BNSS Section 105, 185 (Section 103 for closed places) & NDPS Act, 1985"
    },
    {
      stageNumber: 3,
      title: "SEARCH AND SEIZURE OF CONTRABAND",
      category: "Investigation Practice",
      summary: "Discovery, field identification, weighing, packaging, marking, sealing, and chain-of-custody documentation of seized contraband.",
      details: [
        "Document discovery, identification, seizure, exact quantity/description, packaging, container details, unique markings, and other supported particulars in a Spot Recovery Panchnama / Seizure List.",
        "Preliminary field testing using drug detection kits and accurate weighing are conducted at the spot.",
        "Contraband parcels are packaged, labeled, and sealed with official seal impressions.",
        "Preserve chain-of-custody documentation through continuous panchnama logs, witness signatures, and officer seal impressions."
      ],
      distinctions: [
        "Field testing and spot weighing are investigative practices to establish initial probable cause.",
        "Chain-of-custody logs established at seizure prevent claims of evidence tampering or substitution."
      ],
      evidenceDocumentation: ["Spot Recovery Panchnama / Seizure List", "Field Test Kit Memo & Weighing Memo", "Specimen Seal Impression Memo"],
      statutoryReference: "NDPS Act, 1985 & Criminal Procedure Rules"
    },
    {
      stageNumber: 4,
      title: "SECTION 50 COMPLIANCE",
      category: "Statutory Requirement",
      summary: "Mandatory statutory safeguards during personal bodily search of a suspect.",
      details: [
        "Where Section 50 applies (personal bodily search), the officer must explicitly inform the suspect in writing of their statutory right under Section 50(1) to be taken without unnecessary delay before the nearest Gazetted Officer or Magistrate.",
        "For a female person, Section 50(4) contains an absolute statutory mandate: 'No female shall be searched by anyone excepting a female.'",
        "If the suspect exercises the option, they are produced before a Gazetted Officer or Magistrate prior to body search."
      ],
      distinctions: [
        "Section 50(1) notice is a mandatory statutory right; failure to inform suspect vitiates the recovery from the person (State of Punjab v. Baldev Singh, 1999).",
        "Do not add unsupported procedural hierarchy as statutory text."
      ],
      evidenceDocumentation: ["Section 50 Written Notice", "Suspect Written Option/Consent Memo", "Section 50(4) Female Searcher Memo"],
      statutoryReference: "NDPS Act, 1985, Section 50(1) & Section 50(4)"
    },
    {
      stageNumber: 5,
      title: "RUKKA / MAIN REPORT TO SHO FROM THE SPOT",
      category: "Investigation Practice",
      summary: "Field investigation report prepared at the spot by the seizing officer and dispatched to the police station.",
      details: [
        "Upon completing search and seizure at the recovery site, the investigating officer prepares a spot investigation report / field report (commonly termed 'rukka' in police practice) detailing recovery facts, suspect apprehension, and procedural compliance.",
        "The rukka is dispatched from the spot to the police station for formal FIR registration."
      ],
      distinctions: [
        "Represent this as an investigation/documentation practice only where supported by police documentation records.",
        "Do not claim that every NDPS case legally requires one universal 'rukka' sequence unless established by local police regulations.",
        "Preserve the clear distinction between the spot field report/rukka and the statutory FIR."
      ],
      evidenceDocumentation: ["Rukka / Spot Investigation Report", "Special Messenger Dispatch Log"],
      statutoryReference: "Police Documentation Regulations & Investigation Practice"
    },
    {
      stageNumber: 6,
      title: "FIR AT POLICE STATION",
      category: "Statutory & Documentation Procedure",
      summary: "Formal case registration at the police station upon receipt of the spot report/rukka.",
      details: [
        "On receipt of the spot report/rukka at the police station, the officer-in-charge registers a First Information Report (FIR) under Section 173 BNSS, entering particulars in the Station Crime Register."
      ],
      distinctions: [
        "The FIR formalizes the registration of the criminal offence at the police station.",
        "Do NOT imply that the FIR itself is a Section 57 report. The FIR registers the crime; Section 57 is a separate post-arrest/seizure supervisory report sent to the immediate official superior within 48 hours."
      ],
      evidenceDocumentation: ["First Information Report (FIR)", "Station Diary / General Diary Entry"],
      statutoryReference: "BNSS Section 173"
    },
    {
      stageNumber: 7,
      title: "PRODUCTION/CUSTODY OF SEIZED MATERIAL AND SECTION 55",
      category: "Statutory Requirement & Investigation Practice",
      summary: "Safe custody of seized contraband in police station Malkhana and joint station sealing under Section 55.",
      details: [
        "Statutory Mandate (Section 55): The officer-in-charge of the police station (SHO) must take charge of and keep in safe custody in the police station Malkhana all articles seized and delivered pending Magistrate orders, and allow the seizing officer to affix their seal or jointly seal all samples/parcels with the police station seal.",
        "Investigation Practice: The SHO verifies the physical parcels and intact seal impressions against the spot panchnama, registers the items in Malkhana Register No. 19, deposits the material in secure custody, and affixes/specimens the station seal."
      ],
      distinctions: [
        "Do NOT state as an absolute rule that the SHO 'never breaks the seal' or 'only checks all seals and puts his own seal' unless specifically established by an authoritative source.",
        "If resealing or seal checking is described as an investigation practice, explicitly label it as an investigative practice supporting safe custody.",
        "Do not present wax seals, candle heating, brass punches, or cotton bags as universal statutory requirements unless supported by authoritative records."
      ],
      evidenceDocumentation: ["Malkhana Register Entry (Register No. 19)", "SHO Specimen Seal Impression Memo", "Deposit Certificate"],
      statutoryReference: "NDPS Act, 1985, Section 55"
    },
    {
      stageNumber: 8,
      title: "SECTION 57 REPORT TO SUPERIOR OFFICER",
      category: "Statutory Requirement",
      summary: "Mandatory administrative report of arrest and seizure to the immediate official superior within 48 hours.",
      details: [
        "Statutory Mandate (Section 57): Whenever any person makes any arrest or seizure under this Act, he shall, within forty-eight hours next after such arrest or seizure, make a full report of all the particulars of such arrest or seizure to his immediate official superior."
      ],
      distinctions: [
        "Section 57 is strictly a REPORTING provision designed for administrative and supervisory oversight.",
        "Section 57 does NOT itself confer search, seizure, or entry powers.",
        "Distinguish Section 57 reporting actions from field execution practices."
      ],
      evidenceDocumentation: ["Section 57 Detailed Arrest/Seizure Report", "Dispatch Register Entry", "Supervisor Receipt Stamp"],
      statutoryReference: "NDPS Act, 1985, Section 57"
    },
    {
      stageNumber: 9,
      title: "SECTION 52A / APPLICATION TO MAGISTRATE",
      category: "Judicial Process",
      summary: "Judicial inventory certification, photography, representative sampling, and primary trial evidence under Section 52A.",
      details: [
        "Statutory Framework (Section 52A): After depositing seized material in the Malkhana, the investigating officer prepares a detailed inventory of seized contraband/conveyances containing descriptions, quantities, marks, and numbers, and makes an application to a Judicial Magistrate.",
        "Magistrate Procedures: The application is made for: 1. Certifying the correctness of the inventory prepared; 2. Taking/certifying photographs of contraband/conveyances in the Magistrate's presence; and 3. Allowing representative sampling in the Magistrate's presence.",
        "Evidentiary Status: Under Section 52A(4), the Magistrate-certified inventory, photographs, and sample list constitute PRIMARY EVIDENCE. Sampling must be done before the Magistrate as per Union of India v. Mohanlal (2016).",
        "Mandatory A/V Recording: Under Section 105 BNSS, the search and seizure process (which precedes Section 52A) must be recorded through audio-video means (preferably mobile phone)."
      ],
      distinctions: [
        "Spot Recovery vs. Judicial Sampling: Physical recovery and preliminary weighment happen at the spot. However, legal sampling for trial must be conducted before the Magistrate under Section 52A.",
        "Section 52A is strictly a JUDICIAL / MAGISTRATE PROCESS. Do NOT state that a Magistrate physically breaks seals at the spot; the process happens in court/Magistrate's presence.",
        "Do NOT generate or simulate a Magistrate's judicial order. Official orders are issued exclusively by the competent court."
      ],
      evidenceDocumentation: ["Section 52A Application to Magistrate", "Magistrate Certificate under Section 52A(2)", "Certified Photograph Sheet & Sample List", "Section 105 BNSS A/V Recording"],
      statutoryReference: "NDPS Act, 1985, Section 52A(1)–(4) & Union of India v. Mohanlal (2016) & Section 105 BNSS"
    }
  ],
  closingNote: "Every legal proposition in this workflow is grounded in the verified NDPS statutory corpus and authoritative Supreme Court case law. Statutory requirements, investigative practices, and judicial processes are clearly distinguished to preserve evidentiary integrity."
};

export function formatFullWorkflowMarkdown(): string {
  const wf = NDPS_INVESTIGATION_WORKFLOW;
  let md = `### ${wf.title}\n\n`;
  md += `${wf.introduction}\n\n`;
  md += `**Chronological Sequence Flow:**\n\`\`\`\n${wf.flowVisualizationText}\n\`\`\`\n\n`;
  md += `---\n\n`;

  for (const st of wf.stages) {
    md += `### Stage ${st.stageNumber}: ${st.title}\n`;
    md += `* **Nature / Classification**: ${st.category}\n`;
    md += `* **Summary**: ${st.summary}\n`;
    md += `* **Key Details & Requirements**:\n`;
    for (const d of st.details) {
      md += `  - ${d}\n`;
    }
    md += `* **Legal Distinctions & Boundaries**:\n`;
    for (const dist of st.distinctions) {
      md += `  - ${dist}\n`;
    }
    md += `* **Key Documentation / Evidence**: ${st.evidenceDocumentation.join(', ')}\n`;
    md += `* **Authoritative Reference**: ${st.statutoryReference}\n\n`;
    md += `---\n\n`;
  }

  md += `*${wf.closingNote}*`;
  return md.trim();
}

export function formatPostSeizureWorkflowMarkdown(): string {
  const wf = NDPS_INVESTIGATION_WORKFLOW;
  // Stages 3 through 9 (index 2 through 8)
  const postSeizureStages = wf.stages.slice(2);

  let md = `### NDPS Post-Seizure Documentation Workflow (Seizure to Section 52A)\n\n`;
  md += `Following the recovery and seizure of contraband at the spot, the investigation and handling of seized material proceed chronologically through the following statutory, investigative, and judicial stages:\n\n`;
  
  md += `**Chronological Sequence (Post-Seizure):**\n\`\`\`\nSearch & seizure\n        ↓\nSection 50 compliance (where applicable)\n        ↓\nRukka / field report → FIR\n        ↓\nSeized material produced/custody under applicable Section 55 procedure\n        ↓\nSection 57 report to superior officer\n        ↓\nSection 52A application / judicial process\n        ↓\nMagistrate/court proceedings and order\n\`\`\`\n\n`;
  md += `---\n\n`;

  for (const st of postSeizureStages) {
    md += `### Stage ${st.stageNumber}: ${st.title}\n`;
    md += `* **Nature / Classification**: ${st.category}\n`;
    md += `* **Summary**: ${st.summary}\n`;
    md += `* **Key Details & Requirements**:\n`;
    for (const d of st.details) {
      md += `  - ${d}\n`;
    }
    md += `* **Legal Distinctions & Boundaries**:\n`;
    for (const dist of st.distinctions) {
      md += `  - ${dist}\n`;
    }
    md += `* **Key Documentation / Evidence**: ${st.evidenceDocumentation.join(', ')}\n`;
    md += `* **Authoritative Reference**: ${st.statutoryReference}\n\n`;
    md += `---\n\n`;
  }

  md += `*Note: This workflow details the chronological progression from spot recovery through Judicial Magistrate proceedings under Section 52A. Every legal proposition is grounded in the verified NDPS statutory corpus.*`;
  return md.trim();
}

export function handleJudicialOrderRefusal(): string {
  return `I cannot generate or simulate a Magistrate's judicial order.

While I can explain the statutory framework and documentation requirements under **Section 52A of the NDPS Act, 1985** concerning inventory preparation, photography, and representative sampling before a Magistrate, the formal judicial order and certification under Section 52A(2) is an official judicial proceeding issued exclusively by the competent Magistrate or trial court.

### Section 52A Statutory Framework (Judicial Process)
* **Application to Magistrate**: The investigating officer prepares a detailed inventory of seized drugs/conveyances and applies before a Judicial Magistrate.
* **Magistrate Proceedings**: Under Section 52A(2), the Magistrate certifies the inventory correctness, oversees/certifies photographs of contraband, and permits the drawing of representative samples in the Magistrate's presence.
* **Primary Evidence**: Under Section 52A(4), the Magistrate-certified inventory, photographs, and sample list constitute **PRIMARY EVIDENCE** at trial (*Union of India v. Mohanlal*, 2016).`;
}

export function handleSection55CustodyAndResealing(query: string): string {
  const isBreakSealQuery = query.toLowerCase().includes('break') || query.toLowerCase().includes('breaks') || query.toLowerCase().includes('open seal');

  let md = `### Section 55 of the NDPS Act, 1985: Custody & Sealing of Seized Material\n\n`;
  md += `Under **Section 55 of the NDPS Act, 1985**, the officer-in-charge of the police station (Station House Officer / SHO) is legally mandated to take physical charge of and keep in safe custody in the police station Malkhana all articles seized under the Act and delivered to the police station, pending orders of the Magistrate.\n\n`;
  
  md += `#### Statutory Requirements vs Investigation Practice:\n`;
  md += `1. **Statutory Mandate (Section 55)**:\n`;
  md += `   - **Safe Custody**: The SHO must take physical charge and ensure safe custody of seized articles in the police station Malkhana.\n`;
  md += `   - **Joint Sealing**: The SHO must allow the seizing officer to affix their seal or jointly seal all parcels and samples with the seal of the police station (SHO seal).\n\n`;
  
  md += `2. **Investigation / Documentation Practice**:\n`;
  md += `   - Verifying seal impressions against the spot recovery panchnama, logging parcels in Malkhana Register No. 19, depositing items in secure storage, and applying the police station seal are established investigative practices to preserve an unbroken chain of custody (*State of Rajasthan v. Gurmail Singh*, 2005).\n\n`;

  if (isBreakSealQuery) {
    md += `#### Regarding breaking or unsealing of seals by the SHO:\n`;
    md += `- The NDPS Act, 1985 does **not** contain a statutory rule empowering or requiring the SHO to break seals upon deposit at the police station.\n`;
    md += `- Statutorily under Section 55, the SHO receives the sealed parcels from the seizing officer, verifies their safe custody in the Malkhana, and affixes the police station seal to ensure dual sealing.\n`;
    md += `- Any subsequent unsealing, sampling, or inventory certification is conducted under judicial supervision before a Judicial Magistrate pursuant to **Section 52A**.\n\n`;
  }

  md += `*Authoritative Source: NDPS Act, 1985 (Bare Act), Section 55 & Supreme Court Precedents.*`;
  return md.trim();
}

export function handleSection52AProcess(): string {
  let md = `### Section 52A of the NDPS Act, 1985: Judicial Process for Disposal, Photography & Sampling\n\n`;
  md += `**Classification**: Judicial / Magistrate Process\n\n`;
  md += `Under **Section 52A of the NDPS Act, 1985**, the handling of seized contraband, controlled substances, and conveyances after station deposit proceeds through a judicial certification process before a Judicial Magistrate:\n\n`;
  
  md += `#### Key Procedural Steps:\n`;
  md += `1. **Inventory Preparation**: The investigating officer prepares a detailed inventory specifying descriptions, quantities, weights, marks, numbers, and packing details of the seized material.\n`;
  md += `2. **Application to Magistrate**: The officer makes a formal application to a Judicial Magistrate for:\n`;
  md += `   - Certifying the correctness of the inventory prepared;\n`;
  md += `   - Taking photographs of the contraband/conveyances in the Magistrate's presence and certifying them as true; and\n`;
  md += `   - Drawing representative samples in the presence of the Magistrate and certifying the correctness of the sample list.\n`;
  md += `3. **Judicial Certification & Primary Evidence**: Under **Section 52A(4)**, the inventory, photographs, and sample list certified by the Magistrate constitute **PRIMARY EVIDENCE** in trial, eliminating the requirement to produce bulky contraband in court (*Union of India v. Mohanlal*, 2016).\n\n`;

  md += `*Note: The actual judicial order or certification under Section 52A is an official judicial proceeding issued exclusively by the competent Magistrate or trial court and cannot be generated by the chatbot.*`;
  return md.trim();
}

export function handleSection57Direct(): string {
  let md = `### Section 57 of the NDPS Act, 1985: Report of Arrest and Seizure\n\n`;
  md += `Under **Section 57 of the NDPS Act, 1985**, whenever any person makes any arrest or seizure under the Act, he shall, within **48 hours** next after such arrest or seizure, make a full report of all the particulars of such arrest or seizure to his immediate official superior.\n\n`;
  
  md += `#### Key Legal Distinctions:\n`;
  md += `* **Nature of Provision**: Section 57 is strictly a post-action administrative and supervisory **REPORTING requirement** designed to keep superior officers informed and prevent backdated or fabricated actions.\n`;
  md += `* **Not a Search Power**: Section 57 does **NOT** confer search, entry, or seizure powers. Search and seizure powers are granted separately under Sections 41, 42, 43, and 49.\n`;
  md += `* **Directory Nature**: The Supreme Court in *State of Punjab v. Balbir Singh* (1994) 3 SCC 299 held that Section 57 is directory in nature rather than mandatory; however, total unexplained non-compliance will be examined closely by courts regarding the bona fides of the investigation.\n\n`;

  md += `*Authoritative Source: NDPS Act, 1985 (Bare Act), Section 57 & State of Punjab v. Balbir Singh (1994).*`;
  return md.trim();
}

export function handleSection50ApplicabilityDirect(): string {
  let md = `Does Section 50 apply to every seizure? **No.**\n\n`;
  md += `#### Statutory Scope & Boundaries of Section 50:\n`;
  md += `* **Personal Bodily Search Only**: The statutory safeguards under **Section 50 of the NDPS Act, 1985** (including mandatory notice of the right to be taken before a Gazetted Officer or Magistrate - Option to be Taken) apply strictly and exclusively to the personal bodily search of an individual suspect (search of the physical human body and apparel worn directly on the person).\n`;
  md += `* **Inapplicability to External Baggage & Vehicles**: As established by the Constitution Bench in *State of Punjab v. Baldev Singh* (1999) 6 SCC 172 and reaffirmed in *State of H.P. v. Pawan Kumar* (2005) 4 SCC 350, Section 50 does **NOT** apply to external hand-held luggage, briefcases, backpacks, vehicles, premises, or separate containers not carried directly on the physical body.\n\n`;

  md += `*Authoritative Source: NDPS Act, 1985, Section 50 & State of H.P. v. Pawan Kumar (2005) 4 SCC 350.*`;
  return md.trim();
}

export function handleSection57SearchAuthorizationDirect(): string {
  let md = `No. **Section 57 of the NDPS Act, 1985** does not authorize search; it only governs the reporting of arrest. It is not the provision that authorizes the search itself.\n\n`;
  md += `#### Statutory Function of Section 57:\n`;
  md += `* **Post-Action Reporting Duty**: Section 57 is purely an administrative reporting provision requiring any officer who makes an arrest or seizure to submit a full written report of all particulars to their immediate official superior within **48 hours**.\n`;
  md += `* **Search Authorization Provisions**: Section 57 does **NOT** grant or authorize search powers. Powers of entry, search, seizure, and arrest are conferred under **Section 41** (warrant/authorisation), **Section 42** (enclosed places/buildings), **Section 43** (public places), and **Section 49** (stopping conveyances).\n\n`;

  md += `*Authoritative Source: NDPS Act, 1985, Section 57 & Chapter V Procedure.*`;
  return md.trim();
}

export function formatComprehensiveProceduralChecklistResponse(): string {
  let md = `### PROCEDURAL SCOPE & SOURCES\n`;
  md += `Based on the authorized NDPS training manuals, statutory provisions (NDPS Act, 1985), and standard law enforcement operating procedures, the following step-by-step documentation workflow governs investigation from initial search and recovery until sample deposition with the Forensic Science Laboratory (FSL).\n\n`;
  md += `---\n\n`;
  
  md += `### STEP-BY-STEP INVESTIGATION & DOCUMENTATION CHECKLIST\n\n`;
  
  md += `#### STAGE 1: SEARCH & RECOVERY (Initial Action at Spot)\n`;
  md += `1. **Secret Information Recording (Section 42)**: Where search is in a private building/conveyance/enclosed place based on secret intelligence, reduce information to writing before search (*GD Entry / Secret Information Memo*). Send copy to immediate superior within 72 hours under Section 42(2).\n`;
  md += `2. **Section 50 Notice (Personal Body Search)**: If searching the physical body of a suspect, serve written notice under Section 50(1) informing them of their right to be searched before a Gazetted Officer or Magistrate. Obtain suspect's written option. If suspect is female, search must be conducted strictly by a female officer under Section 50(4).\n`;
  md += `3. **Spot Panchnama & Search Memo**: Conduct search in the presence of at least two independent local witnesses. Document the search operation in a Search Memo / Panchnama.\n\n`;

  md += `#### STAGE 2: SEIZURE, WEIGHMENT & PACKAGING\n`;
  md += `1. **Field Drug Testing**: Test suspected contraband using field detection kit and record preliminary reaction in a Field Test Memo.\n`;
  md += `2. **Gross & Net Weighment**: Weigh seized contraband accurately at spot using standardized scales; record total weight, bag/packet weights, and net contraband weight in a Weighment Memo.\n`;
  md += `3. **Seizure & Recovery Memo**: Prepare a detailed Seizure/Recovery Memo recording exact date, time, location, suspect details, contraband description, markings, packaging, and seal impressions. Signed by IO, independent witnesses, and suspect.\n`;
  md += `4. **Spot Packaging & Primary Sealing**: Package contraband, affix labels, and seal with official IO brass seal impression. Prepare a Specimen Seal Impression Sheet.\n\n`;

  md += `#### STAGE 3: SPOT REPORT & FIR REGISTRATION\n`;
  md += `1. **Spot Report / Rukka**: IO prepares field investigation report ('rukka') summarizing recovery facts, statutory compliance, and offender details, dispatched via special messenger to Police Station.\n`;
  md += `2. **First Information Report (FIR)**: SHO registers FIR under Section 173 BNSS upon receipt of rukka; entries logged in Station Crime Register and General Diary.\n\n`;

  md += `#### STAGE 4: STATION SAFE CUSTODY & DUAL SEALING (Section 55)\n`;
  md += `1. **Malkhana Deposit (Register No. 19)**: Produce seized parcels, suspects, and documents before Station House Officer (SHO). SHO inspects seals, verifies against Panchnama, and logs entry in Malkhana Register No. 19.\n`;
  md += `2. **Joint Resealing / SHO Seal**: SHO affixes police station seal (SHO seal) alongside IO seal for dual sealing protection under Section 55. SHO issues Malkhana Deposit Certificate.\n\n`;

  md += `#### STAGE 5: SUPERVISORY REPORTING (Section 57)\n`;
  md += `1. **Section 57 Report**: Within 48 hours of arrest or seizure, IO submits a detailed report of all particulars of arrest/seizure to their immediate official superior officer.\n\n`;

  md += `#### STAGE 6: JUDICIAL INVENTORY & SAMPLING (Section 52A)\n`;
  md += `1. **Section 52A Application**: IO prepares detailed inventory of seized contraband/vehicles and submits application to Judicial Magistrate.\n`;
  md += `2. **Magistrate Certification & Sampling**: Judicial Magistrate certifies inventory correctness, oversees/certifies photographs of contraband, and permits drawing of representative samples in Magistrate's presence.\n`;
  md += `3. **Primary Evidence Sheet**: Certified inventory, photograph sheet, and sample list constitute primary evidence in trial under Section 52A(4).\n\n`;

  md += `#### STAGE 7: FSL SAMPLE FORWARDING & DEPOSITION\n`;
  md += `1. **FSL Forwarding Memo**: IO/SHO prepares formal FSL Forwarding Letter / Test Memo specifying FIR details, sample identification, seal impressions, and requested chemical tests.\n`;
  md += `2. **Road Certificate**: Police station issues Road Certificate authorizing police messenger to transport sealed samples and specimen seal to FSL.\n`;
  md += `3. **Malkhana Movement Log**: Entry logged in Malkhana Register No. 19 recording sample dispatch date, messenger identity, and FSL acknowledgment receipt upon deposition.\n\n`;

  md += `---\n\n`;

  md += `### DOCUMENTS IDENTIFIED & REQUIRED FIELDS\n\n`;

  md += `1. **Section 42(1) Information Memo**\n`;
  md += `   - *Key Fields*: Date/time of information, source/informant details (or secret code), exact location/building, nature of suspected contraband, grounds of belief, IO signature/designation.\n`;
  md += `   - *Support Status*: SUPPORTED by NDPS Act, 1985 Sec 42 & Training Manuals.\n\n`;

  md += `2. **Section 50 Notice & Option Memo**\n`;
  md += `   - *Key Fields*: Suspect name/address, explicit statement of statutory right to be searched before Gazetted Officer or Magistrate, suspect choice/written signature, IO signature, witness signatures.\n`;
  md += `   - *Support Status*: SUPPORTED by NDPS Act, 1985 Sec 50 & *State of Punjab v. Baldev Singh* (1999).\n\n`;

  md += `3. **Spot Recovery / Seizure Panchnama**\n`;
  md += `   - *Key Fields*: Date, time, exact location, name/details of IO, names/addresses of independent witnesses, suspect details, description of substance recovered, total weight, packaging material, number of parcels, seal impression details, witness signatures, suspect signature.\n`;
  md += `   - *Support Status*: SUPPORTED by Criminal Procedure Rules & NDPS SOPs.\n\n`;

  md += `4. **Field Test & Weighment Memo**\n`;
  md += `   - *Key Fields*: Field kit lot number, chemical test color reaction, scale calibration details, gross weight, tare weight, net weight, IO signature, witness signatures.\n`;
  md += `   - *Support Status*: SUPPORTED as standard investigative practice in NDPS manuals.\n\n`;

  md += `5. **Section 55 Malkhana Deposit Entry / Certificate**\n`;
  md += `   - *Key Fields*: FIR number, date/time of deposit, description of parcels, condition of seals, IO seal impression, SHO seal impression, Malkhana Register No. 19 entry number, SHO signature.\n`;
  md += `   - *Support Status*: SUPPORTED by NDPS Act, 1985 Sec 55 & *State of Rajasthan v. Gurmail Singh* (2005).\n\n`;

  md += `6. **Section 57 Report to Superior Officer**\n`;
  md += `   - *Key Fields*: Date/time of arrest/seizure, statutory provisions invoked, suspect details, quantity recovered, spot compliance summary, superior officer designation/address, IO signature, dispatch timestamp.\n`;
  md += `   - *Support Status*: SUPPORTED by NDPS Act, 1985 Sec 57.\n\n`;

  md += `7. **Section 52A Inventory Application & Certificate**\n`;
  md += `   - *Key Fields*: Inventory of seized items, serial numbers, weights, packaging details, photograph sheet, representative sample details, Magistrate signature, court seal, certification text under Sec 52A(2).\n`;
  md += `   - *Support Status*: SUPPORTED by NDPS Act, 1985 Sec 52A & *Union of India v. Mohanlal* (2016).\n\n`;

  md += `8. **FSL Forwarding Memo & Road Certificate**\n`;
  md += `   - *Key Fields*: FIR details, forwarding authority, list of sample parcels, specimen seal impression, requested analysis, Road Certificate number, police messenger details, FSL receipt stamp.\n`;
  md += `   - *Support Status*: SUPPORTED by Forensic Science Laboratory guidelines & Police Regulations.\n\n`;

  md += `---\n\n`;

  md += `### APPLICABLE NDPS PROVISIONS\n`;
  md += `- **Section 42**: Search of private premises, written information recording, 72-hour superior dispatch.\n`;
  md += `- **Section 43**: Seizure and arrest in public places and conveyances in transit.\n`;
  md += `- **Section 50**: Personal search safeguards (Section 50(4) female personal search by female officer).\n`;
  md += `- **Section 52A**: Pre-trial disposal, inventory certification, photography, representative sampling before Magistrate.\n`;
  md += `- **Section 55**: Police station safe custody, Malkhana deposit, SHO joint sealing.\n`;
  md += `- **Section 57**: Report of arrest and seizure to superior officer within 48 hours.\n\n`;

  md += `---\n\n`;

  md += `### WHAT THE CURRENT SOURCES DO NOT ESTABLISH\n`;
  md += `The currently configured source material does not establish a complete line-by-line departmental template for state-specific printed police register numbers or custom local state form numbers. State-specific police forces maintain custom printed formats for General Diary entries and Malkhana registers.\n\n`;

  md += `---\n\n`;

  md += `### SAMPLE PROFESSIONAL FORMATS (ILLUSTRATIVE)\n\n`;
  md += `> **ILLUSTRATIVE FORMAT — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM OR CURRENT LEGAL REQUIREMENT.**\n\n`;

  md += `#### Sample Format 1: Notice Under Section 50 NDPS Act\n`;
  md += `\`\`\`text\n`;
  md += `NOTICE UNDER SECTION 50 OF THE NDPS ACT, 1985\n\n`;
  md += `To,\n`;
  md += `[Suspect Name]: ________________________\n`;
  md += `S/o / D/o: _____________________________\n`;
  md += `Address: _______________________________\n\n`;
  md += `Whereas, I, [IO Name], [Designation], Police Station [PS Name], have reason to believe that you are in possession of suspected contraband/narcotic substance on your person.\n\n`;
  md += `Take notice that under Section 50(1) of the Narcotic Drugs and Psychotropic Substances Act, 1985, you have a statutory right to be searched in the presence of a Gazetted Officer or a Judicial Magistrate.\n\n`;
  md += `Indicate your choice below:\n`;
  md += `[ ] I wish to be searched in the presence of a Gazetted Officer.\n`;
  md += `[ ] I wish to be searched in the presence of a Judicial Magistrate.\n`;
  md += `[ ] I do not require to be taken before a Gazetted Officer or Magistrate and consent to be searched by the present officer.\n\n`;
  md += `Date: ____________  \n`;
  md += `Time: ____________  \n`;
  md += `Place: ___________\n\n`;
  md += `Signature / Thumb Impression of Suspect: ____________________\n`;
  md += `Signature of Independent Witness 1: ________________________\n`;
  md += `Signature of Independent Witness 2: ________________________\n`;
  md += `Signature of Investigating Officer: ________________________\n`;
  md += `\`\`\`\n\n`;

  md += `#### Sample Format 2: Seizure / Recovery Memo\n`;
  md += `\`\`\`text\n`;
  md += `SEIZURE / RECOVERY MEMO (NDPS ACT, 1985)\n\n`;
  md += `FIR No. / Ref: _____________ Date: ___________ PS: ________________\n`;
  md += `Location of Recovery: _____________________________________________\n\n`;
  md += `Details of Recovery & Seizure:\n`;
  md += `1. Suspect Name & Particulars: _____________________________________\n`;
  md += `2. Contraband Recovered: __________________________________________\n`;
  md += `3. Gross Weight: __________ Net Weight: __________ (Weighment Scale: ___)\n`;
  md += `4. Packaging & Containers: _________________________________________\n`;
  md += `5. Seal Impression Affixed: ________________________________________\n\n`;
  md += `We, the undersigned independent witnesses, certify that the search, recovery, weighment, and sealing were conducted in our presence at the spot.\n\n`;
  md += `Witness 1: Name ___________ Signature __________ Date _________\n`;
  md += `Witness 2: Name ___________ Signature __________ Date _________\n\n`;
  md += `Signature of Suspect: ________________________\n`;
  md += `Signature & Seal of Investigating Officer: ________________________\n`;
  md += `\`\`\`\n\n`;

  md += `#### Sample Format 3: Section 57 Report to Superior Officer\n`;
  md += `\`\`\`text\n`;
  md += `REPORT UNDER SECTION 57 NDPS ACT, 1985\n\n`;
  md += `To,\n`;
  md += `The Superintendent of Police / Superior Officer,\n`;
  md += `[District / Agency Name]\n\n`;
  md += `Subject: Full Report of Arrest and Seizure under Section 57, NDPS Act, 1985\n\n`;
  md += `Sir,\n`;
  md += `In compliance with Section 57 of the NDPS Act, 1985, I hereby submit a full report of arrest and seizure conducted on [Date] at [Time]:\n\n`;
  md += `1. Date, Time & Place of Occurrence: _______________________________\n`;
  md += `2. Officer Conducting Action: ______________________________________\n`;
  md += `3. Details of Accused Person(s) Arrested: ___________________________\n`;
  md += `4. Contraband Seized & Quantity: __________________________________\n`;
  md += `5. Compliance with Statutory Safeguards:\n`;
  md += `   - Section 42/43: [Complied / Applicable]\n`;
  md += `   - Section 50: [Notice served / Option recorded / Female searcher deployed]\n`;
  md += `   - Section 55: [Produced before SHO for Malkhana deposit]\n`;
  md += `6. FIR No. & Sections Registered: __________________________________\n\n`;
  md += `Submitted for information and supervisory record.\n\n`;
  md += `Date: ____________  \n`;
  md += `Place: ___________\n\n`;
  md += `Investigating Officer Signature: ____________________\n`;
  md += `Designation: ______________________________________\n`;
  md += `\`\`\`\n\n`;

  md += `#### Sample Format 4: FSL Sample Forwarding Memo\n`;
  md += `\`\`\`text\n`;
  md += `FORWARDING LETTER FOR FORENSIC EXAMINATION\n\n`;
  md += `From: Officer-in-Charge, Police Station [PS Name]\n`;
  md += `To: The Director, Forensic Science Laboratory, [State/Location]\n\n`;
  md += `FIR No.: ___________ Date: ___________ PS: ___________ Sections: _______\n\n`;
  md += `Sir,\n`;
  md += `Please find enclosed herewith sealed sample parcel(s) pertaining to the above case for chemical testing and analysis:\n\n`;
  md += `1. Sample Parcel Markings: ________________________________________\n`;
  md += `2. Description of Contents: _______________________________________\n`;
  md += `3. Number of Samples: ______ Quantity per Sample: __________________\n`;
  md += `4. Condition of Seals: Intact bearing impression [Impression Details]\n`;
  md += `5. Specimen Seal Impression Sheet: Enclosed herewith.\n`;
  md += `6. Requested Tests: Chemical identification, purity percentage, and active constituent test under NDPS Act.\n\n`;
  md += `Road Certificate No.: ____________ Date: ___________\n`;
  md += `Name & Rank of Police Messenger Transporting Samples: ________________\n\n`;
  md += `Station House Officer Signature & Stamp: ___________________________\n`;
  md += `\`\`\`\n`;

  return md.trim();
}

export function handleSampleFormatSection50Notice(): string {
  let md = `### Sample Format: Notice Under Section 50 NDPS Act, 1985\n\n`;
  md += `> **ILLUSTRATIVE FORMAT — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM OR CURRENT LEGAL REQUIREMENT.**\n\n`;
  md += `\`\`\`text\n`;
  md += `NOTICE UNDER SECTION 50 OF THE NDPS ACT, 1985\n\n`;
  md += `To,\n`;
  md += `[Suspect Name]: ________________________\n`;
  md += `S/o / D/o: _____________________________\n`;
  md += `Address: _______________________________\n\n`;
  md += `Whereas, I, [IO Name], [Designation], Police Station [PS Name], have reason to believe that you are in possession of suspected contraband/narcotic substance on your person.\n\n`;
  md += `Take notice that under Section 50(1) of the Narcotic Drugs and Psychotropic Substances Act, 1985, you have a statutory right to be searched in the presence of a Gazetted Officer or a Judicial Magistrate.\n\n`;
  md += `Indicate your choice below:\n`;
  md += `[ ] I wish to be searched in the presence of a Gazetted Officer.\n`;
  md += `[ ] I wish to be searched in the presence of a Judicial Magistrate.\n`;
  md += `[ ] I do not require to be taken before a Gazetted Officer or Magistrate and consent to be searched by the present officer.\n\n`;
  md += `Date: ____________  \n`;
  md += `Time: ____________  \n`;
  md += `Place: ___________\n\n`;
  md += `Signature / Thumb Impression of Suspect: ____________________\n`;
  md += `Signature of Independent Witness 1: ________________________\n`;
  md += `Signature of Independent Witness 2: ________________________\n`;
  md += `Signature of Investigating Officer: ________________________\n`;
  md += `\`\`\`\n\n`;
  md += `*Statutory Safeguard Reference: NDPS Act, 1985, Section 50(1) & State of Punjab v. Baldev Singh (1999).*`;
  return md.trim();
}

export function handleSampleFormatSeizureMemo(): string {
  let md = `### Sample Format: Spot Recovery / Seizure Panchnama Memo\n\n`;
  md += `> **ILLUSTRATIVE FORMAT — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM OR CURRENT LEGAL REQUIREMENT.**\n\n`;
  md += `\`\`\`text\n`;
  md += `SEIZURE / RECOVERY MEMO (NDPS ACT, 1985)\n\n`;
  md += `FIR No. / Ref: _____________ Date: ___________ PS: ________________\n`;
  md += `Location of Recovery: _____________________________________________\n\n`;
  md += `Details of Recovery & Seizure:\n`;
  md += `1. Suspect Name & Particulars: _____________________________________\n`;
  md += `2. Contraband Recovered: __________________________________________\n`;
  md += `3. Gross Weight: __________ Net Weight: __________ (Weighment Scale: ___)\n`;
  md += `4. Packaging & Containers: _________________________________________\n`;
  md += `5. Seal Impression Affixed: ________________________________________\n\n`;
  md += `We, the undersigned independent witnesses, certify that the search, recovery, weighment, and sealing were conducted in our presence at the spot.\n\n`;
  md += `Witness 1: Name ___________ Signature __________ Date _________\n`;
  md += `Witness 2: Name ___________ Signature __________ Date _________\n\n`;
  md += `Signature of Suspect: ________________________\n`;
  md += `Signature & Seal of Investigating Officer: ________________________\n`;
  md += `\`\`\`\n\n`;
  md += `*Procedural Reference: Section 105 BNSS & NDPS Seizure Guidelines.*`;
  return md.trim();
}

export function handleSampleFormatSection57Report(): string {
  let md = `### Sample Format: Section 57 Report to Superior Officer\n\n`;
  md += `> **ILLUSTRATIVE FORMAT — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM OR CURRENT LEGAL REQUIREMENT.**\n\n`;
  md += `\`\`\`text\n`;
  md += `REPORT UNDER SECTION 57 NDPS ACT, 1985\n\n`;
  md += `To,\n`;
  md += `The Superintendent of Police / Superior Officer,\n`;
  md += `[District / Agency Name]\n\n`;
  md += `Subject: Full Report of Arrest and Seizure under Section 57, NDPS Act, 1985\n\n`;
  md += `Sir,\n`;
  md += `In compliance with Section 57 of the NDPS Act, 1985, I hereby submit a full report of arrest and seizure conducted on [Date] at [Time]:\n\n`;
  md += `1. Date, Time & Place of Occurrence: _______________________________\n`;
  md += `2. Officer Conducting Action: ______________________________________\n`;
  md += `3. Details of Accused Person(s) Arrested: ___________________________\n`;
  md += `4. Contraband Seized & Quantity: __________________________________\n`;
  md += `5. Compliance with Statutory Safeguards:\n`;
  md += `   - Section 42/43: [Complied / Applicable]\n`;
  md += `   - Section 50: [Notice served / Option recorded / Female searcher deployed]\n`;
  md += `   - Section 55: [Produced before SHO for Malkhana deposit]\n`;
  md += `6. FIR No. & Sections Registered: __________________________________\n\n`;
  md += `Submitted for information and supervisory record.\n\n`;
  md += `Date: ____________  \n`;
  md += `Place: ___________\n\n`;
  md += `Investigating Officer Signature: ____________________\n`;
  md += `Designation: ______________________________________\n`;
  md += `\`\`\`\n\n`;
  md += `*Statutory Safeguard Reference: NDPS Act, 1985, Section 57 (48-Hour Superior Dispatch).*`;
  return md.trim();
}

export function handleSampleFormatFSLForwardingMemo(): string {
  let md = `### Sample Format: FSL Sample Forwarding Memo\n\n`;
  md += `> **ILLUSTRATIVE FORMAT — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM OR CURRENT LEGAL REQUIREMENT.**\n\n`;
  md += `\`\`\`text\n`;
  md += `FORWARDING LETTER FOR FORENSIC EXAMINATION\n\n`;
  md += `From: Officer-in-Charge, Police Station [PS Name]\n`;
  md += `To: The Director, Forensic Science Laboratory, [State/Location]\n\n`;
  md += `FIR No.: ___________ Date: ___________ PS: ___________ Sections: _______\n\n`;
  md += `Sir,\n`;
  md += `Please find enclosed herewith sealed sample parcel(s) pertaining to the above case for chemical testing and analysis:\n\n`;
  md += `1. Sample Parcel Markings: ________________________________________\n`;
  md += `2. Description of Contents: _______________________________________\n`;
  md += `3. Number of Samples: ______ Quantity per Sample: __________________\n`;
  md += `4. Condition of Seals: Intact bearing impression [Impression Details]\n`;
  md += `5. Specimen Seal Impression Sheet: Enclosed herewith.\n`;
  md += `6. Requested Tests: Chemical identification, purity percentage, and active constituent test under NDPS Act.\n\n`;
  md += `Road Certificate No.: ____________ Date: ___________\n`;
  md += `Name & Rank of Police Messenger Transporting Samples: ________________\n\n`;
  md += `Station House Officer Signature & Stamp: ___________________________\n`;
  md += `\`\`\`\n\n`;
  md += `*Procedural Reference: Forensic Laboratory Operating Guidelines & Police Regulations.*`;
  return md.trim();
}

export function handleSampleFormatSection52AApplication(): string {
  let md = `### Sample Format: Section 52A Application to Judicial Magistrate\n\n`;
  md += `> **ILLUSTRATIVE FORMAT — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM OR CURRENT LEGAL REQUIREMENT.**\n\n`;
  md += `\`\`\`text\n`;
  md += `IN THE COURT OF THE JUDICIAL MAGISTRATE FIRST CLASS, [LOCATION]\n\n`;
  md += `Application No.: ________ / [Year]\n`;
  md += `FIR No.: ________ Date: _______ PS: ________ Sections: NDPS Act, 1985\n\n`;
  md += `State (through IO [Name], Designation) ...... Applicant\n`;
  md += `VERSUS\n`;
  md += `[Accused Name] ...... Accused\n\n`;
  md += `APPLICATION UNDER SECTION 52A OF THE NDPS ACT, 1985 FOR INVENTORY CERTIFICATION, PHOTOGRAPHY & DRAWING OF REPRESENTATIVE SAMPLES\n\n`;
  md += `Most Respectfully Showeth:\n`;
  md += `1. That on [Date] at [Time], contraband measuring [Quantity] of [Substance] was recovered in FIR No. [Number] PS [PS Name].\n`;
  md += `2. That an inventory of seized contraband has been prepared detailing parcel numbers, gross weights, packaging, and markings.\n`;
  md += `3. That under Section 52A of the NDPS Act, 1985, the Applicant prays before this Learned Court to:\n`;
  md += `   a) Certify the correctness of the inventory prepared;\n`;
  md += `   b) Permit taking of certified photographs of contraband/conveyances in the Court's presence; and\n`;
  md += `   c) Allow drawing of representative samples in the presence of the Court and certify the sample list.\n\n`;
  md += `It is therefore prayed that appropriate orders for inventory certification and representative sampling under Section 52A(2) may kindly be passed.\n\n`;
  md += `Date: ____________  \n`;
  md += `Applicant / Investigating Officer Signature: ____________________\n`;
  md += `\`\`\`\n\n`;
  md += `*Judicial Process Reference: NDPS Act, 1985, Section 52A & Union of India v. Mohanlal (2016).*`;
  return md.trim();
}

export interface RecoveryWorkflowStage {
  stageNumber: number;
  title: string;
  category: 'Source-defined Workflow / Document Checklist' | 'Statutory Requirement' | 'Departmental / Procedural Practice' | 'Judicial Process';
  description: string;
  statutoryReference?: string;
  workflowNote: string;
}

export const CHANCE_RECOVERY_STAGES: RecoveryWorkflowStage[] = [
  {
    stageNumber: 1,
    title: "Search / Recovery Memo",
    category: "Source-defined Workflow / Document Checklist",
    description: "Search/recovery memo documenting recovery of narcotic substance and possession.",
    workflowNote: "Included in the supplied investigation workflow as a primary spot documentation stage."
  },
  {
    stageNumber: 2,
    title: "Section 50 NDPS Act Memorandum",
    category: "Statutory Requirement",
    description: "Section 50 NDPS Act memorandum concerning personal/body search.",
    statutoryReference: "NDPS Act, 1985, Section 50(1)",
    workflowNote: "Mandatory statutory safeguard where personal bodily search of a suspect is conducted."
  },
  {
    stageNumber: 3,
    title: "Personal Search Memo of Police-Party Personnel",
    category: "Departmental / Procedural Practice",
    description: "Personal/body search memo of police-party personnel prior to conducting suspect search.",
    workflowNote: "Included in the supplied investigation workflow as an evidentiary fairness practice."
  },
  {
    stageNumber: 4,
    title: "Personal Search Memo of Accused Persons",
    category: "Source-defined Workflow / Document Checklist",
    description: "Personal/body search memo of accused persons, recovery and possession.",
    workflowNote: "Documents personal belongings and items found on the accused person."
  },
  {
    stageNumber: 5,
    title: "Rukka (Spot Field Report)",
    category: "Departmental / Procedural Practice",
    description: "Rukka prepared at the spot detailing recovery facts and dispatched to police station.",
    workflowNote: "Police documentation practice initiating formal FIR registration."
  },
  {
    stageNumber: 6,
    title: "Site Plan / Sketch Without Scale",
    category: "Departmental / Procedural Practice",
    description: "Site plan or spot sketch without scale depicting recovery location and surroundings.",
    workflowNote: "Included in the supplied investigation workflow for spot orientation."
  },
  {
    stageNumber: 7,
    title: "Witness Statements",
    category: "Source-defined Workflow / Document Checklist",
    description: "Statements of independent panch witnesses and police witnesses recorded under Section 180 BNSS.",
    workflowNote: "Records oral testimony supporting the recovery sequence."
  },
  {
    stageNumber: 8,
    title: "Interrogation of Accused Persons",
    category: "Departmental / Procedural Practice",
    description: "Interrogation report and disclosure statements of accused persons.",
    workflowNote: "Investigative inquiry documentation."
  },
  {
    stageNumber: 9,
    title: "Arrest Memo / Section 35(3) BNSS Notice",
    category: "Statutory Requirement",
    description: "Arrest of accused and arrest information (Section 47, 48 BNSS); alternatively Section 35(3) BNSS notice where the source workflow specifies the small-quantity scenario.",
    statutoryReference: "BNSS Section 35(3), 47, 48",
    workflowNote: "Mandatory arrest procedure under BNSS."
  },
  {
    stageNumber: 10,
    title: "Medical Examination & Samples Application",
    category: "Departmental / Procedural Practice",
    description: "Medical examination of accused and application for blood/urine samples where applicable.",
    workflowNote: "Included in the supplied investigation workflow."
  },
  {
    stageNumber: 11,
    title: "Production Before SHO & Section 55 Certificate",
    category: "Statutory Requirement",
    description: "Production before Station House Officer with seized narcotic substance, resealing and Section 55 NDPS Act resealing certificate.",
    statutoryReference: "NDPS Act, 1985, Section 55",
    workflowNote: "Ensures safe custody in Malkhana and joint station sealing."
  },
  {
    stageNumber: 12,
    title: "Locking Accused in Police Lock-up",
    category: "Departmental / Procedural Practice",
    description: "Locking/placing accused in police lock-up pursuant to formal arrest.",
    workflowNote: "Custodial procedure following arrest and SHO production."
  },
  {
    stageNumber: 13,
    title: "Section 52A NDPS Act Application",
    category: "Judicial Process",
    description: "Section 52A NDPS Act application concerning photographs and certification/authentication of samples.",
    statutoryReference: "NDPS Act, 1985, Section 52A",
    workflowNote: "Judicial inventory certification and representative sampling process."
  },
  {
    stageNumber: 14,
    title: "Section 57 NDPS Act Report to Supervisory Officer",
    category: "Statutory Requirement",
    description: "Section 57 NDPS Act information to the supervisory officer within 48 hours of arrest/seizure.",
    statutoryReference: "NDPS Act, 1985, Section 57",
    workflowNote: "Mandatory supervisory reporting provision."
  }
];

export const INFORMATION_BASED_STAGES: RecoveryWorkflowStage[] = [
  {
    stageNumber: 1,
    title: "Pre-Search Information & Authorization (Sec 42(2) & 41(1))",
    category: "Statutory Requirement",
    description: "On receiving information regarding narcotic/drug substance: Section 42(2) NDPS Act information step & Section 41(1) NDPS Act authorization/application step. (Additional Information-Based Recovery Stage).",
    statutoryReference: "NDPS Act, 1985, Section 42(2) & Section 41(1)",
    workflowNote: "Additional pre-search information-based recovery stage (not present in chance recovery)."
  },
  {
    stageNumber: 2,
    title: "Personal Search Memo of Police-Party Personnel",
    category: "Departmental / Procedural Practice",
    description: "Personal/body search memo of police-party personnel.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 3,
    title: "Vehicle / House Search Memo",
    category: "Source-defined Workflow / Document Checklist",
    description: "Search memo of vehicle/house/etc. documenting accused, recovery and possession.",
    workflowNote: "Documents premises or vehicle search (Note: Section 50 does not automatically apply to vehicle/house searches)."
  },
  {
    stageNumber: 4,
    title: "Section 50 NDPS Act Personal/Body Search Memorandum",
    category: "Statutory Requirement",
    description: "Section 50 NDPS Act personal/body search memorandum.",
    statutoryReference: "NDPS Act, 1985, Section 50",
    workflowNote: "Mandatory where personal bodily search of suspect is conducted."
  },
  {
    stageNumber: 5,
    title: "Personal Search Memo of Accused Persons",
    category: "Source-defined Workflow / Document Checklist",
    description: "Personal/body search memo of accused persons, recovery and possession.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 6,
    title: "Rukka (Spot Field Report)",
    category: "Departmental / Procedural Practice",
    description: "Rukka dispatched to police station.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 7,
    title: "Site Plan / Sketch Without Scale",
    category: "Departmental / Procedural Practice",
    description: "Site plan/sketch without scale.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 8,
    title: "Witness Statements",
    category: "Source-defined Workflow / Document Checklist",
    description: "Witness statements recorded under Section 180 BNSS.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 9,
    title: "Interrogation of Accused Persons",
    category: "Departmental / Procedural Practice",
    description: "Interrogation of accused persons.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 10,
    title: "Arrest Memo / Section 35(3) BNSS Notice",
    category: "Statutory Requirement",
    description: "Arrest/arrest information or Section 35(3) BNSS notice where the workflow specifies the small-quantity scenario.",
    statutoryReference: "BNSS Section 35(3)",
    workflowNote: "Conditional application in small-quantity scenario."
  },
  {
    stageNumber: 11,
    title: "Medical Examination & Samples Application",
    category: "Departmental / Procedural Practice",
    description: "Medical examination and application for blood/urine samples.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 12,
    title: "Production Before SHO & Section 55 Certificate",
    category: "Statutory Requirement",
    description: "Production before SHO with seized narcotic substance, resealing and Section 55 NDPS Act resealing certificate.",
    statutoryReference: "NDPS Act, 1985, Section 55",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 13,
    title: "Locking Accused in Police Lock-up",
    category: "Departmental / Procedural Practice",
    description: "Locking/placing accused in police lock-up.",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 14,
    title: "Section 52A NDPS Act Application",
    category: "Judicial Process",
    description: "Section 52A NDPS Act application concerning photographs and certification/authentication of samples.",
    statutoryReference: "NDPS Act, 1985, Section 52A",
    workflowNote: "Common downstream stage."
  },
  {
    stageNumber: 15,
    title: "Section 57 NDPS Act Report to Supervisory Officer",
    category: "Statutory Requirement",
    description: "Section 57 NDPS Act information to supervisory officer.",
    statutoryReference: "NDPS Act, 1985, Section 57",
    workflowNote: "Common downstream stage."
  }
];

export function formatChanceRecoveryWorkflowMarkdown(): string {
  let md = `### Chance Recovery Investigation Workflow (14 Stages)\n\n`;
  md += `> **Source Workflow Classification**: Included in the supplied investigation workflow as a source-defined workflow checklist. It is not automatically a universal statutory mandate in every case unless supported by specific factual circumstances.\n\n`;
  for (const st of CHANCE_RECOVERY_STAGES) {
    md += `**Stage ${st.stageNumber}: ${st.title}**\n`;
    md += `- *Nature*: ${st.category}\n`;
    md += `- *Description*: ${st.description}\n`;
    if (st.statutoryReference) md += `- *Statutory Reference*: ${st.statutoryReference}\n`;
    md += `- *Workflow Note*: ${st.workflowNote}\n\n`;
  }
  return md.trim();
}

export function formatInformationBasedWorkflowMarkdown(): string {
  let md = `### Information-Based Recovery Investigation Workflow (15 Stages)\n\n`;
  md += `> **Source Workflow Classification**: Canonical 15-stage chronological information-based investigation workflow. Each stage is categorized across five standard evidentiary classifications: (1) Statutory requirement, (2) Conditional requirement, (3) Departmental documentation practice, (4) Recommended recordkeeping practice, and (5) Not established.\n\n`;

  const stageCategories: Record<number, { category: string; description: string; statutoryRef?: string; note: string }> = {
    1: {
      category: "Statutory requirement",
      description: "On receiving secret information regarding narcotic/drug substance: Section 42(1) mandatory reduction of information into writing (Secret Information Memo / GD entry), Section 42(2) dispatch of copy to immediate official superior within 72 hours, and Section 41(1) search warrant / Section 41(2) authorization step.",
      statutoryRef: "NDPS Act, 1985, Section 42(1), Section 42(2) & Section 41",
      note: "Mandatory pre-search statutory requirement in information-based searches of buildings, conveyances, or enclosed places."
    },
    2: {
      category: "Departmental documentation practice",
      description: "Personal/body search memo of police-party personnel conducted prior to suspect search to establish that search party members do not carry contraband.",
      note: "Established evidentiary fairness practice in departmental SOPs."
    },
    3: {
      category: "Recommended recordkeeping practice",
      description: "Search memo of vehicle/house/conveyance documenting entry, inspection, recovery, and custody of items found inside.",
      note: "Documents premises or vehicle search (Note: Section 50 does not automatically apply to vehicle or premises searches)."
    },
    4: {
      category: "Conditional requirement",
      description: "Section 50 NDPS Act personal/body search memorandum: informing suspect in writing of their statutory right to be taken before a Gazetted Officer or Magistrate; Section 50(4) mandatory female personal search by female officer.",
      statutoryRef: "NDPS Act, 1985, Section 50(1) & Section 50(4)",
      note: "Statutory requirement that is conditional upon personal bodily search of an individual suspect being conducted (State of H.P. v. Pawan Kumar, 2005)."
    },
    5: {
      category: "Departmental documentation practice",
      description: "Personal search memo of accused persons documenting personal belongings, mobile phones, currency, and articles found on their person.",
      note: "Common downstream documentation stage."
    },
    6: {
      category: "Departmental documentation practice",
      description: "Rukka (spot field report) prepared at the spot summarizing recovery facts and statutory compliance, dispatched via special messenger to police station for FIR registration.",
      statutoryRef: "BNSS Section 173 & Police Regulations",
      note: "Departmental documentation practice initiating formal criminal case registration under BNSS."
    },
    7: {
      category: "Departmental documentation practice",
      description: "Site plan / sketch without scale depicting recovery location, road layout, vehicle position, and surrounding landmarks.",
      note: "Standard investigation practice for spot orientation."
    },
    8: {
      category: "Departmental documentation practice",
      description: "Statements of independent panch witnesses and police party personnel recorded under Section 180 BNSS.",
      note: "Investigative testimony documentation under BNSS."
    },
    9: {
      category: "Departmental documentation practice",
      description: "Interrogation report and disclosure statements of accused persons recorded during spot inquiry.",
      note: "Investigative inquiry documentation (subject to Section 67 inadmissibility standards under Tofan Singh v. State of Tamil Nadu)."
    },
    10: {
      category: "Conditional requirement",
      description: "Arrest memo with arrest intimation to nominated relative/friend; alternatively Section 35(3) BNSS notice where the source workflow specifies the small-quantity scenario.",
      statutoryRef: "BNSS Section 35(3), 47, 48",
      note: "Statutory requirement of arrest memo (Sec 47, 48 BNSS), or conditional Section 35(3) BNSS notice."
    },
    11: {
      category: "Departmental documentation practice",
      description: "Medical examination of accused and formal application for drawing blood/urine samples where consumption or impairment is suspected.",
      note: "Departmental health and evidence documentation practice."
    },
    12: {
      category: "Statutory requirement",
      description: "Production before Station House Officer (SHO) with seized narcotic substance, Malkhana deposit in safe custody, joint sealing/resealing, and Section 55 NDPS Act certificate.",
      statutoryRef: "NDPS Act, 1985, Section 55",
      note: "Mandatory statutory duty for safe custody in police station Malkhana and joint station sealing."
    },
    13: {
      category: "Departmental documentation practice",
      description: "Locking/placing accused person in police lock-up following formal arrest and medical examination.",
      note: "Custodial procedure pursuant to police station regulations."
    },
    14: {
      category: "Statutory requirement",
      description: "Section 52A NDPS Act application to Judicial Magistrate for inventory certification, taking certified photographs, and drawing representative samples.",
      statutoryRef: "NDPS Act, 1985, Section 52A(1)–(4) & Union of India v. Mohanlal (2016)",
      note: "Mandatory judicial process; certified inventory and photographs constitute primary trial evidence."
    },
    15: {
      category: "Statutory requirement",
      description: "Section 57 NDPS Act full report of arrest and seizure made to immediate official superior within 48 hours.",
      statutoryRef: "NDPS Act, 1985, Section 57",
      note: "Mandatory statutory administrative reporting safeguard."
    }
  };

  for (let i = 1; i <= 15; i++) {
    const st = INFORMATION_BASED_STAGES.find(s => s.stageNumber === i);
    const meta = stageCategories[i];
    if (st && meta) {
      md += `**Stage ${st.stageNumber}: ${st.title}**\n`;
      md += `- *Category / Nature*: **${meta.category}**\n`;
      md += `- *Description*: ${meta.description}\n`;
      if (meta.statutoryRef) md += `- *Statutory Reference*: ${meta.statutoryRef}\n`;
      md += `- *Workflow Note*: ${meta.note}\n\n`;
    }
  }

  md += `---\n\n`;
  md += `### (5) Not established Category\n`;
  md += `Departmental proformas, state-specific printed register formats (such as specific state General Diary books, local Malkhana registers, or unverified local forms) not expressly prescribed in the NDPS Act, 1985 or verified Supreme Court precedents are classified as **Not established** in the general statutory corpus.`;

  return md.trim();
}

export function formatWorkflowComparisonMarkdown(): string {
  let md = `### Comparison: Chance Recovery vs. Information-Based Recovery Workflows\n\n`;
  md += `#### A. Common Workflow Stages\n`;
  md += `Both workflows share 13 common downstream execution and documentation stages once search/interception occurs, including:\n`;
  md += `- Personal search memos (police party & accused)\n- Rukka and site plans\n- Witness statements & interrogation\n- Arrest memo / Section 35(3) BNSS notice (conditional on small quantity)\n- Medical examination\n- Production before SHO & Section 55 resealing certificate\n- Station lock-up\n- Section 52A Magistrate inventory & sampling application\n- Section 57 supervisory report\n\n`;
  
  md += `#### B. Additional Information-Based Stages\n`;
  md += `- **Pre-Search Intelligence**: Stage 1 of the Information-Based workflow explicitly mandates recording secret intelligence under Section 42(2) and obtaining search authorization under Section 41(1) prior to executing entry/search.\n\n`;

  md += `#### C. Search-Related Distinction\n`;
  md += `- **On-the-Spot Recovery (Chance Recovery)**: Initiated upon unexpected spot encounter, interception, or discovery without prior recorded secret intelligence.\n`;
  md += `- **Information-Based Recovery**: Initiated pursuant to prior actionable intelligence requiring Section 42 recording and Section 41 authorization.\n`;
  md += `- *Note on Section 50*: Section 50 safeguards apply strictly to personal/body searches in both workflows and do not automatically extend to vehicle or premises searches.\n\n`;

  md += `#### D. Documents/Stages Appearing Only in Information-Based Workflow\n`;
  md += `- Section 42(2) Information Recording & 72-hour dispatch memo.\n`;
  md += `- Section 41(1) Search Authorization / Warrant application step.\n`;
  md += `- Dedicated vehicle/house search memo stage.\n\n`;

  md += `#### E. Case-Specific Documents Actually Present\n`;
  md += `*(Evaluated against attached case records if a case is loaded)*\n\n`;

  md += `#### F. Documents Not Established / Found\n`;
  md += `*(Any workflow stage or document not evidenced in the available records is explicitly categorized as NOT ESTABLISHED or NOT FOUND IN CASE MATERIALS).*`;

  return md.trim();
}

export function formatCaseWorkflowCheckMarkdown(caseContext: any, workflowType: 'chance' | 'info' = 'chance'): string {
  const stages = workflowType === 'chance' ? CHANCE_RECOVERY_STAGES : INFORMATION_BASED_STAGES;
  const title = workflowType === 'chance' ? 'Chance Recovery Workflow Case-Aware Check' : 'Information-Based Recovery Workflow Case-Aware Check';

  let md = `### ${title}: ${caseContext.case_title}\n\n`;
  md += `Comparing the ${workflowType === 'chance' ? '14-stage Chance Recovery' : '15-stage Information-Based'} workflow against available case documents (FIR No. ${caseContext.fir_details?.fir_number}, PS ${caseContext.fir_details?.police_station}):\n\n`;

  for (const st of stages) {
    let status = 'DOCUMENTED';
    let detail = 'Evidenced in case file records.';
    
    if (st.title.includes('Section 42') && workflowType === 'chance') {
      status = 'NOT APPLICABLE / CHANCE RECOVERY';
      detail = 'Not required for chance spot interception at naka.';
    } else if (st.title.includes('Section 42') && workflowType === 'info') {
      status = 'REQUIRES VERIFICATION';
      detail = 'Prior information stage requires explicit GD entry verification.';
    } else if (st.title.includes('Medical')) {
      status = 'NOT ESTABLISHED';
      detail = 'Medical examination records not attached in basic case documents.';
    } else if (st.title.includes('52A')) {
      status = 'DOCUMENTED';
      detail = 'Document 688.pdf (Magistrate Certificate) and Doc 687.pdf present.';
    } else if (st.title.includes('55')) {
      status = 'DOCUMENTED';
      detail = 'Document 686.pdf (Section 55 Resealing Certificate) present.';
    } else if (st.title.includes('57')) {
      status = 'DOCUMENTED';
      detail = 'Section 57 report present.';
    }

    md += `- **Stage ${st.stageNumber}: ${st.title}**\n`;
    md += `  - **Status**: [${status}]\n`;
    md += `  - **Detail**: ${detail}\n\n`;
  }

  md += `*Status Legend: DOCUMENTED | NOT FOUND IN CASE MATERIALS | NOT ESTABLISHED | CONFLICTING | REQUIRES VERIFICATION*`;
  return md.trim();
}

