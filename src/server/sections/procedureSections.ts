import { StructuredSectionRecord } from './types';

export const PROCEDURE_SECTIONS: Record<string, StructuredSectionRecord> = {
  '41': {
    sectionNumber: '41',
    officialTitle: 'Power to issue warrant and authorisation',
    statutoryText: `(1) A Metropolitan Magistrate or a Magistrate of the first class, or any Magistrate of the second class specially empowered by the State Government, may issue a warrant for the arrest of any person whom he has reason to believe to have committed any offence punishable under this Act, or for the search of any building, conveyance or place. (2) Any such officer of gazetted rank of the departments of central excise, narcotics, customs, revenue intelligence or any other department of the Central Government or state police, if specially empowered by general or special order, may authorise any officer subordinate to him but superior in rank to a peon, sepoy or a constable to arrest such person or search a building, conveyance or place. (3) The officer to whom a warrant under sub-section (1) or an authorisation under sub-section (2) is addressed may enter, search, seize and arrest.`,
    plainExplanation: `Provides statutory authority to judicial magistrates to issue search and arrest warrants, and empowers designated Gazetted Officers of police, excise, NCB, customs, and DRI to issue written search authorisations to subordinate officers.`,
    scope: `Applies prior to search, seizure, or arrest operations in buildings, conveyances, or private premises.`,
    keyRequirements: [
      'Magistrate may issue warrant upon reason to believe an offence has been committed.',
      'Empowered Gazetted Officer may issue written authorisation to a subordinate officer superior to constable/sepoy.',
      'Officer executing warrant/authorisation exercises full entry, search, seizure, and arrest powers.'
    ],
    investigationRelevance: `Primary authority under which planned raids, building searches, and premises inspections are carried out.`,
    documentationEvidence: `Search authorization memo / warrant issued in writing under Section 41(2) prior to entry.`,
    relatedSections: ['Section 42', 'Section 43', 'Section 50'],
    supremeCourtCaseLaw: [
      'State of Punjab v. Balbir Singh, (1994) 3 SCC 299: Distinction between searches under warrant/authorisation under Section 41 and searches without warrant under Section 42.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 41',
      authority: 'Parliament of India'
    }
  },
  '42': {
    sectionNumber: '42',
    officialTitle: 'Power of entry, search, seizure and arrest without warrant or authorisation',
    statutoryText: `(1) Any such officer (being an officer superior in rank to a peon, sepoy or constable) of the departments of central excise, narcotics, customs, revenue intelligence or any other department of the Central Government or police... if he has reason to believe from personal knowledge or information given by any person and taken down in writing that any narcotic drug, or psychotropic substance... is kept or concealed in any building, conveyance or enclosed place, may between sunrise and sunset: (a) enter into and search any such building, conveyance or place; (b) in case of resistance, break open any door and remove any obstacle; (c) seize such drug or substance and all materials; (d) detain and search, and if he thinks proper, arrest any person whom he has reason to believe to have committed any offence punishable under this Act. Provided that in case of search between sunset and sunrise, if such officer has reason to believe that a search warrant or authorisation cannot be obtained without affording opportunity for the concealment of evidence or facility for the escape of an offender, he may enter and search at any time between sunset and sunrise after recording the grounds of his belief. (2) Where an officer takes down any information in writing under sub-section (1) or records grounds for his belief under the proviso thereto, he shall within seventy-two hours send a copy thereof to his immediate official superior.`,
    plainExplanation: `Empowers authorized officers to enter, search, seize, and arrest in any building, conveyance, or enclosed place without a warrant. OFFICER EMPOWERMENT IS NOT AUTOMATIC BY RANK: Authority must be derived from a specific Central or State Government Notification. Empowerment cannot be inferred from rank alone (not from rank alone). Investigating officers must verify their authority via the official notification. If acting on prior secret intelligence, the officer MUST reduce the information into writing (GD entry/secret info memo). If conducting a night search (between sunset and sunrise) without a warrant, grounds of belief regarding urgency must be recorded. A copy of the recorded information/grounds must be forwarded to the immediate official superior within 72 hours.`,
    scope: `Applies strictly to searches of buildings, conveyances, and enclosed places without warrant. Does NOT apply to a public place (which falls under Section 43).`,
    keyRequirements: [
      'OFFICER EMPOWERMENT: Officer must be specifically empowered by a Government Notification. Rank alone is insufficient.',
      'Secret intelligence must be reduced into writing before search (Mandatory Recording).',
      'Night search (sunset to sunrise) requires recording grounds of belief regarding urgency.',
      'Copy of recorded information/grounds must be sent to immediate official superior within 72 hours (Section 42(2)).',
      'Applies to buildings, conveyances, or enclosed places (distinguished from Section 43 public places).'
    ],
    investigationRelevance: `Foundational provision for intelligence-based raids. Requires verification of the officer's specific statutory empowerment notification.`,
    documentationEvidence: `Government Notification of Empowerment, Information receipt memo / GD entry, grounds of belief for night search, dispatch receipt under Section 42(2).`,
    relatedSections: ['Section 41', 'Section 43', 'Section 50', 'Section 57', 'Section 67'],
    supremeCourtCaseLaw: [
      'Karnail Singh v. State of Haryana, (2009) 8 SCC 539 (Constitution Bench): Total non-compliance with Section 42(1) and 42(2) is impermissible and vitiates the trial.',
      'Boota Singh v. State of Haryana, (2021) SCC OnLine SC 324: Private vehicle parked in a public place with closed doors remains a conveyance under Section 42.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 42',
      authority: 'Parliament of India'
    }
  },
  '43': {
    sectionNumber: '43',
    officialTitle: 'Power of seizure and arrest in public place',
    statutoryText: `Any officer of any of the departments mentioned in section 42 may— (a) seize in any public place or in transit, any narcotic drug or psychotropic substance or controlled substance in respect of which he has reason to believe an offence punishable under this Act has been committed, and, along with such drug or substance, any animal or conveyance or article liable to confiscation; (b) detain and search any person whom he has reason to believe to have committed an offence punishable under this Act, and if such person has any narcotic drug or psychotropic substance in his possession and such possession appears to him to be unlawful, arrest him and any other person in his company. Explanation.—For the purposes of this section, the expression "public place" includes any public conveyance, hotel, shop, or other place intended for use by, or accessible to, the public.`,
    plainExplanation: `Authorizes empowered officers to seize contraband and arrest suspects in any public place or in transit. OFFICER EMPOWERMENT: Requires specific Government Notification. While prior recording under Section 42(2) is not mandated, procedural separation between stopping a vehicle and searching a person must be maintained. Section 50 safeguards apply for personal searches.`,
    scope: `Applies to recoveries and arrests made in public places, open transit areas, and establishments open to the public.`,
    keyRequirements: [
      'Officer must be specifically empowered by notification.',
      'Applies to public places or goods/persons in transit.',
      'Does not require prior recording under Section 42(2) before interception.',
      'Personal search of suspect still requires Section 50 compliance.'
    ],
    investigationRelevance: `Governs routine naka checking and roadside patrolling. Requires separate documentation for vehicle search vs personal search.`,
    documentationEvidence: `Empowerment Notification, Patrolling GD entry, spot recovery panchnama, Section 50 compliance memo (if person searched), Audio-Video recording (Sec 105 BNSS).`,
    relatedSections: ['Section 42', 'Section 49', 'Section 50', 'Section 57'],
    supremeCourtCaseLaw: [
      'State of Punjab v. Baldev Singh, (1999) 6 SCC 172: Section 43 governs public places, but Section 50 applies if the person is searched.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 43',
      authority: 'Parliament of India'
    }
  },
  '44': {
    sectionNumber: '44',
    officialTitle: 'Power of entry, search, seizure and arrest in offences relating to coca plant, opium poppy and cannabis plant',
    statutoryText: `The provisions of sections 41, 42 and 43, shall also apply in relation to the offences punishable under Chapter IV and relating to coca plant, the opium poppy or cannabis plant and for this purpose references in those sections to narcotic drugs, or psychotropic substance, or controlled substance, shall be construed as including references to coca plant, the opium poppy and cannabis plant.`,
    plainExplanation: `Extends search and seizure powers to prohibited crops. Requires verification of officer empowerment via government notification.`,
    scope: `Applies to all agricultural and field operations involving illegal drug crops.`,
    keyRequirements: [
      'Officer empowerment verification required.',
      'Applies Sections 41, 42, 43 mutatis mutandis to prohibited crops.'
    ],
    investigationRelevance: `Field raids and crop destruction operations.`,
    documentationEvidence: `Empowerment Notification, Crop destruction panchnama, Section 52A Magistrate certificate.`,
    relatedSections: ['Section 18', 'Section 20', 'Section 41', 'Section 42', 'Section 48'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 44',
      authority: 'Parliament of India'
    }
  },
  '49': {
    sectionNumber: '49',
    officialTitle: 'Power to stop and search conveyance',
    statutoryText: `Any officer authorised under section 42, may, if he has reason to suspect that any animal or conveyance is, or is about to be, used for the transport of any narcotic drug or psychotropic substance, in respect of which he suspects that any provision of this Act has been, or is being, or is about to be, contravened at any time, stop such animal or conveyance, or, in the case of an aircraft, compel it to land, and (a) rummage and search the conveyance or part thereof; (b) examine and search any goods on the animal or in the conveyance; (c) if it becomes necessary to stop the animal or the conveyance, use all lawful means for stopping it, and where such means fail, the animal or the conveyance may be fired upon.`,
    plainExplanation: `Empowers authorized officers to stop and search any conveyance. SEARCH SEPARATION: Searching a vehicle is distinct from searching the person of passengers (Section 50). Rummaging a vehicle does not permit a personal search without Section 50 compliance.`,
    scope: `Applies to moving conveyances, highway checkpoints, and transit vehicles.`,
    keyRequirements: [
      'Empowerment verification required.',
      'Power to stop, rummage, and search compartments/cargo.',
      'Vehicle search under Section 49 is distinct from personal search under Section 50.'
    ],
    investigationRelevance: `Interception of vehicles. Requires separate panchnamas for vehicle cargo vs personal belongings of occupants.`,
    documentationEvidence: `Empowerment Notification, Vehicle search panchnama, Mechanical inspection memo, Seizure list.`,
    relatedSections: ['Section 42', 'Section 43', 'Section 50', 'Section 60(3)'],
    supremeCourtCaseLaw: [
      'State of H.P. v. Pawan Kumar, (2005) 4 SCC 350: Section 49 vehicle search does not trigger Section 50 unless the physical body/clothing is searched.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 49',
      authority: 'Parliament of India'
    }
  },
  '50': {
    sectionNumber: '50',
    officialTitle: 'Conditions under which search of persons shall be conducted',
    statutoryText: `(1) When any officer duly authorised under section 42 is about to search any person under the provisions of section 41, section 42 or section 43, he shall, if such person so requires, take such person without unnecessary delay to the nearest Gazetted Officer of any of the departments mentioned in section 42 or to the nearest Magistrate. (2) If such requisition is made, the officer may detain him until he can bring him before the Gazetted Officer or the Magistrate. (3) The Gazetted Officer or the Magistrate before whom any such person is brought shall, if he sees no reasonable ground for search, forthwith discharge the person but otherwise shall direct that search be made. (4) No female shall be searched by anyone excepting a female. (5) When an officer duly authorised under section 42 has reason to believe that it is not possible to take the person to be searched to the nearest Gazetted Officer or Magistrate without the possibility of the person to be searched parting with possession of any narcotic drug or psychotropic substance, or other article or document, he may, instead of taking such person to the nearest Gazetted Officer or Magistrate, proceed to search the person as provided under section 100 of the Code of Criminal Procedure, 1973. (6) After a search is conducted under sub-section (5), the officer shall record the reasons for such belief which necessitated such search and within seventy-two hours send a copy thereof to his immediate official superior.`,
    plainExplanation: `Mandatory statutory safeguards for PERSONAL BODILY SEARCH. Suspect must be informed of the right to be searched before a Gazetted Officer or Magistrate. STRICT SEPARATION: Section 50 applies ONLY to the human body and apparel. It does NOT apply to bags, luggage, or vehicles. Section 50(4) requires female searchers for female suspects. EMERGENCY: Section 50(5) allows search under BNSS Section 105 subject to recording reasons and reporting within 72 hours.`,
    scope: `Applies strictly to the search of the physical human body. Does NOT apply to handheld luggage or conveyances.`,
    keyRequirements: [
      'Mandatory notice of statutory right to nearest Gazetted Officer or Magistrate.',
      'Female suspects must be searched by a female officer (Section 50(4)).',
      'Audio-Video recording of search is mandatory under Section 105 BNSS.',
      'Empowerment of the officer must be verified via notification.'
    ],
    investigationRelevance: `Highest safeguard for personal search; failure to comply vitiates recovery from the person.`,
    documentationEvidence: `Section 50 Notice, Suspect's option memo, Female officer deployment memo, Audio-Video recording (Sec 105 BNSS).`,
    relatedSections: ['Section 41', 'Section 42', 'Section 43', 'Section 57', 'Section 67'],
    supremeCourtCaseLaw: [
      'State of Punjab v. Baldev Singh, (1999) 6 SCC 172: Compliance with Section 50(1) is mandatory.',
      'State of H.P. v. Pawan Kumar, (2005) 4 SCC 350: Section 50 applies only to physical person/clothing, not bags or containers.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 50',
      authority: 'Parliament of India'
    }
  },
  '50A': {
    sectionNumber: '50A',
    officialTitle: 'Power to undertake controlled delivery',
    statutoryText: `The Director General of Narcotics Control Bureau or any other officer authorised by him in this behalf, may, if he is satisfied that it is necessary so to do, in relation to any consignment of narcotic drugs or psychotropic substances or controlled substances, undertake controlled delivery of such consignment.`,
    plainExplanation: `Controlled delivery tracking. Requires specific authorization from DG NCB.`,
    scope: `Applies to international and inter-state investigations.`,
    keyRequirements: [
      'Strict authorization from DG NCB.',
      'Enables tracking without premature interception.'
    ],
    investigationRelevance: `Dismantling cartels.`,
    documentationEvidence: `Controlled delivery authorization, coordination memos.`,
    relatedSections: ['Section 23', 'Section 27A', 'Section 29', 'Section 53'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 50A',
      authority: 'Parliament of India'
    }
  },
  '51': {
    sectionNumber: '51',
    officialTitle: 'Application of the Bharatiya Nagarik Suraksha Sanhita, 2023 to warrants, searches, seizures and arrests',
    statutoryText: `The provisions of the Bharatiya Nagarik Suraksha Sanhita, 2023 (formerly Code of Criminal Procedure, 1973) shall apply, in so far as they are not inconsistent with the provisions of this Act, to all warrants issued and arrests, searches and seizures made under this Act.`,
    plainExplanation: `Procedural bridge incorporating BNSS 2023 (formerly CrPC 1973). Special provisions of the NDPS Act prevail over inconsistent general procedure. Under BNSS: Section 103 specifically concerns persons in charge of a closed place allowing a search, duty of ingress, and search of closed premises with independent local witnesses (sub-secs 4-5) and delivery of copy to occupant (sub-sec 6); Section 185 governs searches by police officers during investigation upon recording grounds of belief in the case diary; Section 105 mandates audio-video electronic recording of search of any place and taking possession of property; Section 106 governs the police power to seize specified property and report forthwith to the SHO and Magistrate.`,
    scope: `Applies across all procedural aspects not specific to NDPS Act.`,
    keyRequirements: [
      'BNSS applies where NDPS Act is silent and not inconsistent.',
      'Section 103 BNSS: Search of closed places, ingress duty, and closed-place witness safeguards.',
      'Section 185 BNSS: Search by police officer during investigation upon recorded grounds of belief.',
      'Section 105 BNSS: Mandatory audio-video electronic recording of search and seizure operations.',
      'Section 106 BNSS: Police power to seize specified property and report forthwith to Magistrate.'
    ],
    investigationRelevance: `Invoking BNSS 103 (closed-place ingress & witnesses), 185 (investigation search), 105 (audio-video recording), and 106 (property seizure reporting).`,
    documentationEvidence: `Audio-video recording logs (Sec 105 BNSS), closed-place search memos (Sec 103 BNSS), investigation search entries (Sec 185 BNSS), seizure reporting memos (Sec 106 BNSS).`,
    relatedSections: ['Section 41', 'Section 42', 'Section 50', 'Section 52'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 51',
      authority: 'Parliament of India'
    }
  },
  '52': {
    sectionNumber: '52',
    officialTitle: 'Disposal of persons arrested and articles seized',
    statutoryText: `(1) Any officer arresting a person under section 41, section 42, section 43 or section 44 shall, as soon as may be, inform him of the grounds for such arrest. (2) Every person arrested and article seized under warrant issued under sub-section (1) of section 41 shall be forwarded without unnecessary delay to the Magistrate by whom the warrant was issued. (3) Every person arrested and article seized under sub-section (2) of section 41, section 42, section 43 or section 44 shall be forwarded without unnecessary delay to— (a) the officer-in-charge of the nearest police station, or (b) the officer empowered under section 53. (4) The authority or officer to whom an arrested person or article is forwarded under sub-section (2) or sub-section (3) shall, with all convenient despatch, take such measures as may be necessary for the disposal according to law of such person or article.`,
    plainExplanation: `Post-arrest custody. SEPARATION: Grounds of arrest must be communicated immediately. SEIZURE is distinct from SAMPLING (Section 52A). Contraband must be forwarded to SHO/Empowered officer without delay.`,
    scope: `Applies immediately following any arrest or seizure.`,
    keyRequirements: [
      'Communication of grounds of arrest (Section 52(1)).',
      'Forwarding to PS/Section 53 officer without unnecessary delay.'
    ],
    investigationRelevance: `Chain of custody.`,
    documentationEvidence: `Grounds of arrest memo, forwarding letter, Malkhana entry.`,
    relatedSections: ['Section 52A', 'Section 53', 'Section 55', 'Section 57'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 52',
      authority: 'Parliament of India'
    }
  },
  '52A': {
    sectionNumber: '52A',
    officialTitle: 'Disposal of seized narcotic drugs and psychotropic substances',
    statutoryText: `(1) The Central Government may, having regard to the hazardous nature, vulnerability to theft, substitution, and constraints of space, specify by notification such narcotic drugs, psychotropic substances, controlled substances or conveyances which shall be disposed of by such officer and in such manner as may be prescribed. (2) Where any narcotic drugs, psychotropic substances, controlled substances or conveyances has been seized and forwarded to the officer-in-charge of the nearest police station or to the officer empowered under section 53, the officer shall prepare an inventory... and make an application, to any Magistrate for the purpose of— (a) certifying the correctness of the inventory so prepared; or (b) taking, in the presence of such Magistrate, photographs... and certifying such photographs as true; or (c) allowing to draw representative samples... in the presence of such Magistrate and certifying the correctness of any list of samples so drawn. (3) Where an application is made under sub-section (2), the Magistrate shall, as soon as may be, allow the application. (4) Notwithstanding anything contained in the Bharatiya Sakshya Adhiniyam, 2023 or the Bharatiya Nagarik Suraksha Sanhita, 2023, every court trying an offence under this Act, shall treat the inventory, the photographs... and any list of samples drawn... and certified by the Magistrate, as primary evidence in respect of such offence.`,
    plainExplanation: `STATUTORY JUDICIAL INVENTORY & SAMPLING: Contraband seized must be forwarded to the police station or Section 53 officer, an inventory prepared, and an application submitted under Section 52A(2) to the Magistrate for certifying the inventory, photographing, and drawing representative samples under Magistrate supervision. Under Section 52A(4), only Magistrate-certified inventories, photographs, and sample lists constitute PRIMARY EVIDENCE. Evidentiary consequences of non-compliance are fact-sensitive: under Bharat Aambale v. State of Chhattisgarh (2025), procedural delay or irregularity does not automatically vitiate the trial per se unless serious prejudice is caused to the accused; however, substantial compliance does NOT automatically cure defects where unverified custody, broken seals, or unexplained gaps cast reasonable doubt on contraband identity.`,
    scope: `Applies to all seized drugs and conveyances.`,
    keyRequirements: [
      'Inventory preparation and application to Magistrate without undue delay.',
      'PHOTOGRAPHY and SAMPLING must occur in the presence of the Magistrate.',
      'Magistrate certification is required for the samples to constitute PRIMARY EVIDENCE.',
      'Substantial compliance is evaluated against prejudice; it does NOT automatically cure broken custody or compromised seals.'
    ],
    investigationRelevance: `Central pillar of evidence management. Distinguish spot recovery list from Section 52A judicial inventory.`,
    documentationEvidence: `Section 52A Application, Magistrate's Certificate, Certified photos, Sample list, DDC destruction certificate.`,
    relatedSections: ['Section 52', 'Section 55', 'Section 60'],
    supremeCourtCaseLaw: [
      'Union of India v. Mohanlal, (2016) 3 SCC 379: Drawing samples must be done exclusively in the presence of the Magistrate; spot samples are not primary evidence.',
      'Simarnjit Singh v. State of Punjab, 2023 SCC OnLine SC 906: Total failure to draw representative samples before the Magistrate deprives the prosecution of primary evidence.',
      'Bharat Aambale v. State of Chhattisgarh, Criminal Appeal No. 250 of 2025 (decided Jan 6, 2025): Procedural irregularity or delay under Section 52A does not automatically mandate acquittal unless serious prejudice is caused to the accused, but substantial compliance cannot cure defects that compromise chain of custody or contraband integrity.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 52A',
      authority: 'Parliament of India'
    }
  },
  '53': {
    sectionNumber: '53',
    officialTitle: 'Power to invest officers of certain departments with powers of an officer-in-charge of a police station',
    statutoryText: `(1) The Central Government... may, by notification... invest any officer... with the powers of an officer-in-charge of a police station... (2) The State Government may, by notification... invest any officer... with the powers of an officer-in-charge of a police station...`,
    plainExplanation: `Empowerment of specialized agency officers. TOFAN SINGH (2021) RULE: Section 53 officers are "police officers" for Section 23 BSA / Section 25 Evidence Act. Confessions to them are inadmissible. Verification of empowerment notification is mandatory.`,
    scope: `Applies to specialized investigative agencies.`,
    keyRequirements: [
      'Verification of Government Gazette Notification for empowerment.',
      'Section 53 officers cannot record admissible confessions under Section 67 (Tofan Singh).'
    ],
    investigationRelevance: `Jurisdiction of NCB/DRI/Excise.`,
    documentationEvidence: `Government Gazette Notification for Empowerment.`,
    relatedSections: ['Section 41', 'Section 42', 'Section 53A', 'Section 67'],
    supremeCourtCaseLaw: [
      'Tofan Singh v. State of Tamil Nadu, (2021) 4 SCC 1: Section 53 officers are police officers; confessions are inadmissible.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 53',
      authority: 'Parliament of India'
    }
  },
  '54': {
    sectionNumber: '54',
    officialTitle: 'Presumption from possession of illicit articles',
    statutoryText: `In trials under this Act, it may be presumed, unless and until the contrary is proved, that the accused has committed an offence... for the possession of which he fails to account satisfactorily.`,
    plainExplanation: `Presumption of guilt upon proof of conscious possession. Requires proof of physical recovery beyond doubt.`,
    scope: `Applies during trial for possession offences.`,
    keyRequirements: [
      'Prosecution must prove conscious physical possession first.',
      'Burden shifts to accused only after foundational facts are proved.'
    ],
    investigationRelevance: `Establishing physical control and unbroken custody.`,
    documentationEvidence: `Seizure memo, recovery panchnama, proof of control of premises.`,
    relatedSections: ['Section 35', 'Section 8', 'Sections 15–27A'],
    supremeCourtCaseLaw: [
      'Noor Aga v. State of Punjab, (2008) 16 SCC 417: Foundational facts must be proved beyond reasonable doubt.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 54',
      authority: 'Parliament of India'
    }
  },
  '55': {
    sectionNumber: '55',
    officialTitle: 'Police to take charge of articles seized and delivered',
    statutoryText: `An officer-in-charge of a police station shall take charge of and keep in safe custody, pending the orders of the Magistrate, all articles seized under this Act within the local area of that police station...`,
    plainExplanation: `Safe custody in Malkhana. Joint sealing with SHO seal is mandatory. NO UNSEALING by SHO without Magistrate order under Section 52A.`,
    scope: `Applies upon delivery of contraband to police station.`,
    keyRequirements: [
      'SHO takes physical custody in Malkhana.',
      'Joint sealing with SHO/Station seal.',
      'Intact chain of custody must be documented.'
    ],
    investigationRelevance: `Negating allegations of tampering.`,
    documentationEvidence: `Malkhana Register Entry (Register No. 19), SHO specimen seal impression, Deposit Certificate.`,
    relatedSections: ['Section 52', 'Section 52A', 'Section 57'],
    supremeCourtCaseLaw: [
      'State of Rajasthan v. Gurmail Singh, (2005) 3 SCC 59: Proof of intact seals is fatal if missing.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 55',
      authority: 'Parliament of India'
    }
  },
  '57': {
    sectionNumber: '57',
    officialTitle: 'Report of arrest and seizure',
    statutoryText: `Whenever any person makes any arrest or seizure under this Act, he shall, within forty-eight hours next after such arrest or seizure, make a full report of all the particulars of such arrest or seizure to his immediate official superior.`,
    plainExplanation: `Administrative reporting obligation. Must be submitted within 48 hours to immediate superior.`,
    scope: `Applies to every arrest and seizure.`,
    keyRequirements: [
      'Full report within 48 hours.',
      'Addressed to immediate official superior.'
    ],
    investigationRelevance: `Supervisory oversight.`,
    documentationEvidence: `Section 57 Detailed Report, Dispatch register entry, Supervisor acknowledgement.`,
    relatedSections: ['Section 42(2)', 'Section 52', 'Section 55'],
    supremeCourtCaseLaw: [
      'State of Punjab v. Balbir Singh, (1994) 3 SCC 299: Section 57 is directory but non-compliance affects bona fides.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 57',
      authority: 'Parliament of India'
    }
  },
  '60': {
    sectionNumber: '60',
    officialTitle: 'Liability of illicit drugs, substances, plants, articles and conveyances to confiscation',
    statutoryText: `(1) Whenever any offence... has been committed, the narcotic drug... shall be liable to confiscation... (3) Any animal or conveyance used in carrying any narcotic drug... shall be liable to confiscation...`,
    plainExplanation: `Confiscation of contraband and vehicles. SEPARATION: Confiscation of vehicle (Sec 60(3)) is distinct from criminal penalty for driver (Sec 25).`,
    scope: `Applies to seized property.`,
    keyRequirements: [
      'Liability for mandatory confiscation.',
      'Conveyance owner must prove lack of knowledge to avoid confiscation.'
    ],
    investigationRelevance: `Asset seizure.`,
    documentationEvidence: `Seizure list, Vehicle registration, Court confiscation order.`,
    relatedSections: ['Section 25', 'Section 49', 'Section 61', 'Section 62', 'Section 63'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 60',
      authority: 'Parliament of India'
    }
  },
  '67': {
    sectionNumber: '67',
    officialTitle: 'Power to call for information, etc.',
    statutoryText: `Any officer referred to in section 42 who is authorised in this behalf by the Central Government or a State Government may, during the course of any enquiry in connection with the contravention of any provisions of this Act— (a) call for information from any person for the purpose of satisfying himself whether there has been any contravention of the provisions of this Act or any rule or order made thereunder; (b) require any person to produce or deliver any document or thing relevant to the enquiry; (c) examine any person acquainted with the facts and circumstances of the case.`,
    plainExplanation: `Power to examine persons and call for documents during enquiry. CRITICAL (TOFAN SINGH v. STATE OF TN, 2021 4 SCC 1): Officers empowered under Section 53 are "police officers". Any confessional statement recorded under Section 67 is hit by Section 25 Evidence Act / Section 23(1) BSA and is wholly inadmissible as a confession. It cannot be used as substantive evidence of guilt, nor can an inadmissible confession be used for general corroboration. The discovery exception under Section 27 Evidence Act / Section 23(2) BSA is STRICTLY NARROW: only so much of the information as relates distinctly to the fact thereby discovered (e.g., concealed contraband or items recovered from an unknown spot) may be proved; it does NOT make the confession, admission of guilt, or surrounding Section 67 statement generally admissible.`,
    scope: `Applies during enquiry and investigation.`,
    keyRequirements: [
      'Empowerment verification required.',
      'Statements are NOT admissible as confessions (Tofan Singh).',
      'Cannot by themselves establish guilt or serve as substantive evidence.',
      'Narrow discovery exception (Sec 23(2) BSA / Sec 27 Evidence Act): Only distinct facts discovered in consequence of information may be proved, not the confession itself.'
    ],
    investigationRelevance: `Examination of suspects and witnesses. Requires independent corroboration for any facts disclosed.`,
    documentationEvidence: `Examination Memo, Statement of suspect/witness (not to be treated as confession), independent corroborative evidence, recovery memo under Sec 23(2) BSA.`,
    relatedSections: ['Section 53', 'Section 29', 'Section 53A'],
    supremeCourtCaseLaw: [
      'Tofan Singh v. State of Tamil Nadu, (2021) 4 SCC 1: Held that statements under Section 67 to investigating officers are inadmissible as confessions.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V - Procedure',
      sourceTitle: 'NDPS Act, 1985, Section 67',
      authority: 'Parliament of India'
    }
  }
};

