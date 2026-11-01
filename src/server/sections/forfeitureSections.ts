import { StructuredSectionRecord } from './types';

export const FORFEITURE_SECTIONS: Record<string, StructuredSectionRecord> = {
  '68A': {
    sectionNumber: '68A',
    officialTitle: 'Application',
    statutoryText: `(1) The provisions of this Chapter shall apply only to the persons specified in sub-section (2). (2) The persons referred to in sub-section (1) are the following, namely:— (a) every person who has been convicted of an offence punishable under this Act with imprisonment for a term of ten years or more; (b) every person who has been convicted of a similar offence by a competent court of criminal jurisdiction outside India; (c) every person in respect of whom an order of detention has been made under the Prevention of Illicit Traffic in Narcotic Drugs and Psychotropic Substances Act, 1988 (46 of 1988), or under the Jammu and Kashmir Prevention of Illicit Traffic in Narcotic Drugs and Psychotropic Substances Act, 1988... (cc) every person who has been arrested or against whom a warrant or authorisation of arrest has been issued for the commission of an offence punishable under this Act with imprisonment for a term of ten years or more; (d) every person who is a relative of a person referred to in clause (a) or clause (b) or clause (c) or clause (cc); (e) every associate of a person referred to in clause (a) or clause (b) or clause (c) or clause (cc); (f) any holder of any property which was at any time previously held by a person referred to in clause (a) or clause (b) or clause (c) or clause (cc) unless the present holder or any previous holder was a transferee in good faith for adequate consideration.`,
    plainExplanation: `Defines the jurisdictional scope of Chapter V-A asset forfeiture. It applies to persons convicted of offences carrying 10+ years imprisonment, persons detained under PIT NDPS Act 1988, arrested persons facing 10+ years imprisonment, their relatives, business associates, and current holders of illegally acquired assets.`,
    scope: `Threshold gateway determining which persons and properties are subject to Chapter V-A financial investigation and forfeiture.`,
    keyRequirements: [
      'Conviction with 10+ years imprisonment OR detention order under PIT NDPS Act 1988 OR arrest for 10+ year offence.',
      'Extends to relatives (spouse, siblings, lineal ascendants/descendants) and associates (partners, companies, trustees).',
      'Extends to third-party transferees unless they prove bona fide purchase for adequate consideration.'
    ],
    investigationRelevance: `Establishing the statutory nexus between the accused/detenu and the targeted property holder.`,
    documentationEvidence: `Conviction judgment, PIT NDPS detention order, arrest warrant, family tree genealogy, business partnership deeds.`,
    relatedSections: ['Section 68B', 'Section 68C', 'Section 68E', 'Section 68F'],
    supremeCourtCaseLaw: [
      'Aslam Mohammad Merchant v. Competent Authority, (2008) 14 SCC 186: Statutory requirements under Chapter V-A must be strictly construed; foundational link between drug crime and property acquisition must be established before issuing show cause notices.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68A',
      authority: 'Parliament of India'
    }
  },
  '68B': {
    sectionNumber: '68B',
    officialTitle: 'Definitions',
    statutoryText: `In this Chapter, unless the context otherwise requires,— (a) "Appellate Tribunal" means the Appellate Tribunal for Forfeited Property; (b) "associate" in relation to a person whose property is liable to forfeiture... includes partner, company director, trust settlor, or financial beneficiary; (g) "illegally acquired property" means any property acquired by such person, whether before or after the commencement of this Chapter, wholly or partly out of or by means of any income, earnings or assets derived or obtained from or attributable to the illicit traffic in narcotic drugs and psychotropic substances...; (i) "relative" in relation to a person, means (1) spouse; (2) brother or sister; (3) brother or sister of the spouse; (4) lineal ascendant or descendant; (5) lineal ascendant or descendant of spouse; (6) spouse of brother/sister; (7) lineal descendant of brother/sister.`,
    plainExplanation: `Defines key statutory terms used across Chapter V-A, including "illegally acquired property" (assets derived directly or indirectly from illicit drug trafficking), "relative", "associate", "Appellate Tribunal", and "identifying".`,
    scope: `Provides legal definitions applicable across all Chapter V-A forfeiture proceedings.`,
    keyRequirements: [
      'Broad definition of "illegally acquired property" covering past and future assets.',
      'Covers assets converted into other properties or held in benami/family names.',
      'Strict legal definitions for relatives and associates.'
    ],
    investigationRelevance: `Framing the property tracing matrix and linking benami assets to drug proceeds.`,
    documentationEvidence: `Financial audit chart, bank account tracing, property registry documents.`,
    relatedSections: ['Section 68A', 'Section 68C', 'Section 68E'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68B',
      authority: 'Parliament of India'
    }
  },
  '68C': {
    sectionNumber: '68C',
    officialTitle: 'Prohibition of holding illegally acquired property',
    statutoryText: `(1) As from the commencement of this Chapter, it shall not be lawful for any person to whom this Chapter applies to hold any illegally acquired property either by himself or through any other person on his behalf. (2) Where any person holds any illegally acquired property in contravention of the provisions of sub-section (1), such property shall be liable to be forfeited to the Central Government in accordance with the provisions of this Chapter.`,
    plainExplanation: `Declares it unlawful for any covered person to hold illegally acquired property, whether directly in their own name or indirectly through benamidars, relatives, or nominees. Any property held in violation is statutorily liable to forfeiture to the Central Government.`,
    scope: `Substantive prohibition against holding tainted drug assets.`,
    keyRequirements: [
      'Universal prohibition on holding drug-derived assets.',
      'Statutory liability for forfeiture to the Central Government free from all encumbrances.'
    ],
    investigationRelevance: `Provides the legal basis for seizing and forfeiting tainted properties.`,
    documentationEvidence: `Title deeds, balance sheets, registry records.`,
    relatedSections: ['Section 68A', 'Section 68F', 'Section 68I'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68C',
      authority: 'Parliament of India'
    }
  },
  '68D': {
    sectionNumber: '68D',
    officialTitle: 'Competent authority and Associate Authority',
    statutoryText: `(1) The Central Government may, by order published in the Official Gazette, authorise any Commissioner of Customs or Commissioner of Central Excise or Commissioner of Income-tax or any other officer of the Central Government of equivalent rank to perform the functions of the competent authority under this Chapter.`,
    plainExplanation: `Empowers the Central Government to appoint officers of Commissioner rank (Customs, Central Excise, Income Tax, or equivalent) to act as the "Competent Authority" to conduct forfeiture proceedings, issue freezing orders, and pass final forfeiture orders.`,
    scope: `Designates the statutory quasi-judicial authority for Chapter V-A.`,
    keyRequirements: [
      'Officer must be of Commissioner rank or equivalent.',
      'Acts as the quasi-judicial forum for property forfeiture.'
    ],
    investigationRelevance: `Investigating agencies submit property investigation reports to the Competent Authority.`,
    documentationEvidence: `Official Gazette notification of Competent Authority appointment.`,
    relatedSections: ['Section 68F', 'Section 68H', 'Section 68I'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68D',
      authority: 'Parliament of India'
    }
  },
  '68E': {
    sectionNumber: '68E',
    officialTitle: 'Identifying illegally acquired property',
    statutoryText: `(1) Every officer empowered under section 53 and every officer-in-charge of a police station shall, on receipt of information that any person to whom this Chapter applies has acquired illegally acquired property, proceed to take all steps necessary for tracing and identifying any property of such person. (2) The steps referred to in sub-section (1) may include any inquiry, investigation or survey in respect of any person, place, property, assets, documents, books of account in any bank or public financial institution or any other relevant matters.`,
    plainExplanation: `Mandates that investigating officers and police station SHOs must actively trace, identify, and investigate all assets, properties, bank accounts, and financial holdings of suspected drug traffickers and their networks.`,
    scope: `Governs the financial investigation and asset tracing phase.`,
    keyRequirements: [
      'Empowers tracing and identifying properties, bank accounts, and financial assets.',
      'Authorizes inquiry and survey across banks and financial institutions.'
    ],
    investigationRelevance: `Financial investigation (FI) conducted parallel to the substantive NDPS criminal investigation.`,
    documentationEvidence: `Bank account statements, income tax returns, land revenue records, FIU-IND suspicious transaction reports.`,
    relatedSections: ['Section 53', 'Section 68F', 'Section 68S'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68E',
      authority: 'Parliament of India'
    }
  },
  '68F': {
    sectionNumber: '68F',
    officialTitle: 'Seizure or freezing of illegally acquired property',
    statutoryText: `(1) Where any officer conducting an inquiry or investigation under section 68E has reason to believe that any property in relation to which such inquiry or investigation is being conducted is an illegally acquired property and such property is likely to be concealed, transferred or dealt with in any manner which will result in frustrating any proceeding relating to the forfeiture of such property under this Chapter, he may make an order seizing such property, or where it is not practicable to seize such property, he may make an order that such property shall not be transferred or otherwise dealt with, except with the prior permission of the officer making such order, or of the competent authority and a copy of such order shall be served on the person concerned. (2) Any order made under sub-section (1) shall have no effect unless it is confirmed by an order of the competent authority within a period of thirty days of its being made.`,
    plainExplanation: `Authorizes investigating officers to issue provisional freezing/seizure orders on bank accounts, immovable properties, or assets to prevent their sale or transfer. Crucially, any provisional freezing order issued by an investigating officer MUST be confirmed by the Competent Authority within 30 days, failing which the freeze lapses automatically.`,
    scope: `Provisional freezing of movable and immovable assets during investigation.`,
    keyRequirements: [
      'Reason to believe property is illegally acquired and likely to be transferred/concealed.',
      'Provisional freezing order served on owner/bank/registrar.',
      'MANDATORY: Must be confirmed by Competent Authority within 30 days under Section 68F(2).'
    ],
    investigationRelevance: `Immediate freezing of bank accounts, fixed deposits, commercial properties, and residential buildings.`,
    documentationEvidence: `Section 68F(1) Freezing Order, confirmation application, Section 68F(2) Confirmation Order by Competent Authority.`,
    relatedSections: ['Section 68E', 'Section 68D', 'Section 68H'],
    supremeCourtCaseLaw: [
      'Aslam Mohammad Merchant v. Competent Authority, (2008) 14 SCC 186: Strict compliance with statutory timelines and application of mind by Competent Authority within 30 days.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68F',
      authority: 'Parliament of India'
    }
  },
  '68G': {
    sectionNumber: '68G',
    officialTitle: 'Management of properties seized or forfeited under this Chapter',
    statutoryText: `(1) The Central Government may, by order published in the Official Gazette, appoint as many Administrators as it thinks fit to perform the functions of an Administrator under this Chapter. (2) The Administrator appointed under sub-section (1) shall receive and manage the property that has been seized, frozen or forfeited under this Chapter in such manner and subject to such conditions as may be prescribed.`,
    plainExplanation: `Authorizes the Central Government to appoint Administrators to take physical charge of, maintain, manage, and safeguard properties that have been seized, frozen, or forfeited under Chapter V-A.`,
    scope: `Property management and custody post-seizure/forfeiture.`,
    keyRequirements: [
      'Appointment of official Administrator by Central Government.',
      'Administrator receives and manages seized/frozen/forfeited assets.'
    ],
    investigationRelevance: `Handing over physical control of factories, buildings, or vehicles to appointed Administrator.`,
    documentationEvidence: `Handover-takeover memo with Administrator, property inventory register.`,
    relatedSections: ['Section 68F', 'Section 68I', 'Section 68U'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68G',
      authority: 'Parliament of India'
    }
  },
  '68H': {
    sectionNumber: '68H',
    officialTitle: 'Notice of forfeiture of property',
    statutoryText: `(1) If, having regard to the value of the properties held by any person to whom this Chapter applies, either by himself or through any other person on his behalf, his known sources of income, earnings or assets, and any other information or material available to it as a result of a report from any officer making an investigation under section 68E or otherwise, the competent authority has reason to believe that all or any of such properties are illegally acquired properties, it may serve a notice upon such person calling upon him within a period of thirty days specified in the notice to indicate the sources of his income, earnings or assets, out of which or by means of which he has acquired such property, the evidence on which he relies and other relevant information and to show cause why all or any of such properties should not be declared to be illegally acquired properties and forfeited to the Central Government.`,
    plainExplanation: `The Competent Authority issues a formal Show Cause Notice (SCN) giving the affected person 30 days to disclose their legitimate income sources, produce documentary evidence, and show cause why the properties should not be forfeited to the Central Government.`,
    scope: `Initiation of formal quasi-judicial forfeiture adjudication.`,
    keyRequirements: [
      'Competent Authority must record "reason to believe" based on investigation reports.',
      '30-day statutory show cause notice served on affected person.',
      'Calls upon holder to disclose legitimate sources of acquisition.'
    ],
    investigationRelevance: `Submission of comprehensive valuation and income disparity reports to Competent Authority.`,
    documentationEvidence: `Show Cause Notice under Section 68H, service acknowledgement, ITR records disparity chart.`,
    relatedSections: ['Section 68D', 'Section 68F', 'Section 68I', 'Section 68J'],
    supremeCourtCaseLaw: [
      'Aslam Mohammad Merchant v. Competent Authority, (2008) 14 SCC 186: The Competent Authority must independently form and record reasons to believe that the property is illegally acquired before issuing notice under Section 68H; mechanical issuance without reasons is invalid.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68H',
      authority: 'Parliament of India'
    }
  },
  '68I': {
    sectionNumber: '68I',
    officialTitle: 'Forfeiture of property in certain cases',
    statutoryText: `(1) The competent authority may, after considering the explanation, if any, to the show cause notice issued under section 68H, and the materials available before it and after giving to the person affected a reasonable opportunity of being heard, by order, record a finding whether all or any of the properties in question are illegally acquired properties: Provided that if the person affected does not appear or produce evidence, the competent authority may proceed on the basis of materials available. (2) Where the competent authority is satisfied that any of the properties are illegally acquired properties, it shall declare that such properties shall stand forfeited to the Central Government free from all encumbrances.`,
    plainExplanation: `The Competent Authority passes the final forfeiture order after considering the explanation, reviewing financial records, and conducting a personal hearing. If satisfied that properties were acquired from illicit drug proceeds, the authority declares them forfeited to the Central Government free from all encumbrances.`,
    scope: `Final adjudication and forfeiture of illegally acquired assets.`,
    keyRequirements: [
      'Quasi-judicial hearing complying with natural justice principles.',
      'Recorded finding declaring properties as illegally acquired.',
      'Vesting of forfeited properties in the Central Government free from all encumbrances.'
    ],
    investigationRelevance: `Final culmination of Chapter V-A proceedings securing title transfer of properties to Government.`,
    documentationEvidence: `Final Forfeiture Order under Section 68I, mutation records in revenue/land registry.`,
    relatedSections: ['Section 68H', 'Section 68J', 'Section 68K', 'Section 68O'],
    supremeCourtCaseLaw: [
      'Attorney General for India v. Amratlal Prajivandas, (1994) 5 SCC 54: Constitutionality of forfeiture provisions targeting drug syndicate assets and relative/associate properties.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68I',
      authority: 'Parliament of India'
    }
  },
  '68J': {
    sectionNumber: '68J',
    officialTitle: 'Burden of proof',
    statutoryText: `In any proceedings under this Chapter, the burden of proving that any property specified in the notice issued under section 68H is not illegally acquired property shall be on the person affected.`,
    plainExplanation: `Places the legal burden of proof on the property holder. Once a valid notice under Section 68H is issued based on reasonable belief, the affected person must prove with documentary evidence that the property was acquired from legitimate, untainted income sources.`,
    scope: `Applies during all Chapter V-A forfeiture proceedings before the Competent Authority and Appellate Tribunal.`,
    keyRequirements: [
      'Burden of proving lawful source of property rests entirely on the affected person.',
      'Requires concrete documentary proof of legitimate earnings, loans, or inheritances.'
    ],
    investigationRelevance: `Controverting bogus loan agreements and unaccounted cash claims submitted by property holders.`,
    documentationEvidence: `Audited accounts, Income Tax returns, bank loan sanctions, sale deeds of ancestral property.`,
    relatedSections: ['Section 68H', 'Section 68I', 'Section 35'],
    supremeCourtCaseLaw: [
      'Aslam Mohammad Merchant v. Competent Authority, (2008) 14 SCC 186: Burden of proof under Section 68J shifts to the noticee only AFTER the Competent Authority establishes a prima facie nexus between drug crime and property acquisition in the Section 68H notice.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68J',
      authority: 'Parliament of India'
    }
  },
  '68K': {
    sectionNumber: '68K',
    officialTitle: 'Fine in lieu of forfeiture',
    statutoryText: `(1) Where the competent authority makes a declaration that any property stands forfeited to the Central Government under section 68I and it is a case where the source of only a part of the illegally acquired property has not been proved to the satisfaction of the competent authority, it shall make an order giving an option to the person affected to pay, in lieu of forfeiture, a fine equal to the market value of such part.`,
    plainExplanation: `Provides an option to pay a fine in lieu of forfeiture where only a minor or identifiable part of the property is found to be illegally acquired, allowing the owner to retain the asset upon paying a fine equal to the market value of the tainted portion.`,
    scope: `Applies to partially tainted properties where physical division is impractical.`,
    keyRequirements: [
      'Only applicable where part of the acquisition source is untainted and legitimate.',
      'Fine must equal the market value of the unproved/tainted part.'
    ],
    investigationRelevance: `Appraisal and market valuation of composite immovable properties.`,
    documentationEvidence: `Government approved valuer report, fine calculation order, treasury challan.`,
    relatedSections: ['Section 68I'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68K',
      authority: 'Parliament of India'
    }
  },
  '68L': {
    sectionNumber: '68L',
    officialTitle: 'Procedure in relation to certain trust properties',
    statutoryText: `In the case of any person referred to in clause (d) or clause (e) of sub-section (2) of section 68A, if the competent authority has reason to believe that any property held in trust is illegally acquired property, it may serve a notice upon the author of the trust or the trustees, and the provisions of this Chapter shall apply accordingly.`,
    plainExplanation: `Extends forfeiture proceedings to properties held under private or family trusts created to conceal drug proceeds.`,
    scope: `Applies to trust properties, trustees, and beneficiaries linked to drug traffickers.`,
    keyRequirements: [
      'Notice served on author of trust and trustees.',
      'Pierces trust veil to forfeit underlying drug-funded assets.'
    ],
    investigationRelevance: `Investigating bogus charitable/private family trusts holding real estate.`,
    documentationEvidence: `Trust deed, bank records of trust, asset acquisition ledgers.`,
    relatedSections: ['Section 68A', 'Section 68H'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68L',
      authority: 'Parliament of India'
    }
  },
  '68M': {
    sectionNumber: '68M',
    officialTitle: 'Certain transfers to be null and void',
    statutoryText: `Where after the making of an order under sub-section (1) of section 68F or the issue of a notice under section 68H, any property referred to in the said order or notice is transferred by any mode whatsoever such transfer shall, for the purposes of the proceedings under this Chapter, be ignored and if such property is subsequently forfeited to the Central Government under section 68I, then, the transfer of such property shall be deemed to be null and void.`,
    plainExplanation: `Renders any sale, gift, mortgage, or transfer of frozen or noticed property null and void. Any transfer executed after a Section 68F freezing order or Section 68H notice is statutorily ignored and has no legal effect against final forfeiture.`,
    scope: `Prevents alienations, distress sales, or transfers during the pendency of forfeiture proceedings.`,
    keyRequirements: [
      'Any transfer made after 68F freeze or 68H notice is deemed null and void.',
      'Protects Government title against third-party claims.'
    ],
    investigationRelevance: `Notifying sub-registrars and banks to block registration of transfers.`,
    documentationEvidence: `Intimation to Land Sub-Registrar / RTO / Banks regarding pending Chapter V-A proceedings.`,
    relatedSections: ['Section 68F', 'Section 68H', 'Section 68I'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68M',
      authority: 'Parliament of India'
    }
  },
  '68N': {
    sectionNumber: '68N',
    officialTitle: 'Constitution of Appellate Tribunal',
    statutoryText: `(1) The Central Government may, by notification in the Official Gazette, constitute an Appellate Tribunal to be called the Appellate Tribunal for Forfeited Property consisting of a Chairman and such number of other members... being persons who are or have been Judges of the Supreme Court or High Courts.`,
    plainExplanation: `Establishes the Appellate Tribunal for Forfeited Property (ATFP) headed by a Chairman (who is or has been a Supreme Court or High Court Judge) to hear appeals against forfeiture orders passed by the Competent Authority.`,
    scope: `Appellate forum for Chapter V-A.`,
    keyRequirements: [
      'Constitutes the Appellate Tribunal for Forfeited Property (ATFP).',
      'Headed by a judicial Chairman (retired SC/HC Judge).'
    ],
    investigationRelevance: `Appellate stage representing the enforcement agency against appeals.`,
    documentationEvidence: `Gazette notification of ATFP constitution.`,
    relatedSections: ['Section 68O', 'Section 68D'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68N',
      authority: 'Parliament of India'
    }
  },
  '68O': {
    sectionNumber: '68O',
    officialTitle: 'Appeals',
    statutoryText: `(1) Any person aggrieved by an order of the competent authority made under section 68F, section 68I, sub-section (1) of section 68K or section 68L, may, within forty-five days from the date on which the order is served on him, prefer an appeal to the Appellate Tribunal: Provided that the Appellate Tribunal may entertain any appeal after the said period of forty-five days, but not after sixty days, if satisfied of sufficient cause.`,
    plainExplanation: `Provides a statutory right of appeal to the Appellate Tribunal against orders of the Competent Authority. Appeals must be filed within 45 days (extendable by up to 15 days upon sufficient cause).`,
    scope: `Appellate remedy against freezing, forfeiture, and fine orders.`,
    keyRequirements: [
      '45-day statutory appeal limitation period (maximum 60 days).',
      'Appellate Tribunal has power to confirm, modify, or set aside orders.'
    ],
    investigationRelevance: `Defending confirmation and forfeiture orders before the Appellate Tribunal in New Delhi.`,
    documentationEvidence: `Appeal petition, ATFP stay/final order.`,
    relatedSections: ['Section 68I', 'Section 68N'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68O',
      authority: 'Parliament of India'
    }
  },
  '68P': {
    sectionNumber: '68P',
    officialTitle: 'Notice or order not to be invalid for error in description',
    statutoryText: `No notice issued or order passed, under this Chapter shall be deemed to be invalid merely by reason of any error or defect in the description of the property or of the person... if such person or property is otherwise identifiable from the description.`,
    plainExplanation: `Prevents technical invalidation of notices or orders due to minor clerical or descriptive errors regarding property details or person names, provided the property or person is otherwise identifiable.`,
    scope: `Protective procedural clause against technical drafting challenges.`,
    keyRequirements: [
      'Minor description defects do not invalidate notices/orders if property/person is identifiable.'
    ],
    investigationRelevance: `Defending typographical errors in survey numbers or address descriptions.`,
    documentationEvidence: `Rectification memo, identification cross-reference chart.`,
    relatedSections: ['Section 68H', 'Section 68V'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68P',
      authority: 'Parliament of India'
    }
  },
  '68Q': {
    sectionNumber: '68Q',
    officialTitle: 'Bar of jurisdiction',
    statutoryText: `No order passed or declaration made under this Chapter shall be appealable except as provided therein and no civil court shall have jurisdiction in respect of any matter which the Appellate Tribunal or any competent authority is empowered by or under this Chapter to determine.`,
    plainExplanation: `Bars the jurisdiction of civil courts from entertaining suits, injunctions, or challenges against any order or proceeding under Chapter V-A. The exclusive statutory remedy lies before the Appellate Tribunal and High Court under writ jurisdiction.`,
    scope: `Statutory bar on civil court interference.`,
    keyRequirements: [
      'Total bar on civil court jurisdiction.',
      'Prevents civil stay orders blocking property forfeiture.'
    ],
    investigationRelevance: `Filing applications to vacate unauthorized civil court injunctions.`,
    documentationEvidence: `Application for dismissal of civil suit under Section 68Q.`,
    relatedSections: ['Section 68O'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68Q',
      authority: 'Parliament of India'
    }
  },
  '68R': {
    sectionNumber: '68R',
    officialTitle: 'Competent authority and Appellate Tribunal to have powers of civil court',
    statutoryText: `The competent authority and the Appellate Tribunal shall have all the powers of a civil court while trying a suit under the Code of Civil Procedure, 1908 in respect of: (a) summoning and enforcing the attendance of any person and examining him on oath; (b) requiring the discovery and production of documents; (c) receiving evidence on affidavits; (d) requisitioning any public record; (e) issuing commissions.`,
    plainExplanation: `Vests the Competent Authority and Appellate Tribunal with civil court powers under CPC 1908 for summoning witnesses, enforcing attendance on oath, compelling production of bank records/books, and requisitioning public records.`,
    scope: `Quasi-judicial powers of inquiry and discovery.`,
    keyRequirements: [
      'Civil court powers for summoning, oaths, document discovery, and public record requisition.'
    ],
    investigationRelevance: `Summoning bank managers, accountants, and land revenue officers with original records.`,
    documentationEvidence: `Section 68R Summons, deposition recorded on oath.`,
    relatedSections: ['Section 68D', 'Section 68N'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68R',
      authority: 'Parliament of India'
    }
  },
  '68S': {
    sectionNumber: '68S',
    officialTitle: 'Information to competent authority',
    statutoryText: `(1) Notwithstanding anything contained in any other law, the competent authority shall have power to require any officer or authority of the Central Government or a State Government or a local authority to furnish information in relation to such persons, points or matters as in the opinion of the competent authority will be useful for, or relevant to, the purposes of this Chapter.`,
    plainExplanation: `Empowers the Competent Authority to mandate information sharing from all Central, State, municipal, and local government bodies (Income Tax, GST, Land Registry, Municipalities, Banks) overriding secrecy clauses in other laws.`,
    scope: `Inter-agency information gathering and intelligence integration.`,
    keyRequirements: [
      'Overriding statutory power to requisition information from any government/banking authority.'
    ],
    investigationRelevance: `Requisitioning ITRs, property registrations, motor vehicle databases, and financial intelligence.`,
    documentationEvidence: `Section 68S statutory requisition notice to banks/revenue departments.`,
    relatedSections: ['Section 68E', 'Section 68D'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68S',
      authority: 'Parliament of India'
    }
  },
  '68T': {
    sectionNumber: '68T',
    officialTitle: 'Certain officers to assist Administrator, competent authority and Appellate Tribunal',
    statutoryText: `For the purpose of any proceedings under this Chapter, the following officers are hereby empowered and required to assist the Administrator, the competent authority and the Appellate Tribunal, namely: (a) officers of the Police; (b) officers of the Customs Department; (c) officers of Central Excise; (d) officers of Income-tax; (e) officers of State Excise; (f) officers of the Central Government or State Government.`,
    plainExplanation: `Imposes a statutory duty on police, customs, central excise, income tax, state excise, and government officers to provide physical, logistical, and investigative assistance to the Administrator, Competent Authority, and Appellate Tribunal.`,
    scope: `Mandatory inter-agency assistance and security support.`,
    keyRequirements: [
      'Statutory obligation on all enforcement agencies to assist in property attachment and management.'
    ],
    investigationRelevance: `Providing armed police escorts and administrative assistance during physical property eviction and sealing.`,
    documentationEvidence: `Requisition memo for police assistance under Section 68T.`,
    relatedSections: ['Section 68G', 'Section 68U'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68T',
      authority: 'Parliament of India'
    }
  },
  '68U': {
    sectionNumber: '68U',
    officialTitle: 'Power to take possession',
    statutoryText: `(1) Where any property has been declared to be forfeited to the Central Government under section 68I, or where the person affected has failed to pay the fine due under sub-section (1) of section 68K within thirty days, the competent authority may order the person affected or any other person who may be in possession of the property to surrender or deliver possession thereof to the Administrator or to any person duly authorised by him in this behalf within thirty days of the service of the order. (2) If any person refuses or fails to comply with an order made under sub-section (1), the Administrator may take possession of the property and may for that purpose use such force as may be necessary.`,
    plainExplanation: `Empowers the Competent Authority and Administrator to take physical possession of forfeited properties. Occupants are given 30 days to surrender possession, failing which the Administrator is empowered to use necessary force to enter, evict, and take physical possession.`,
    scope: `Physical execution, eviction, and possession of forfeited real estate.`,
    keyRequirements: [
      '30-day notice to surrender physical possession.',
      'Administrator empowered to use necessary force upon refusal to vacate.'
    ],
    investigationRelevance: `Physical sealing, eviction of unauthorized occupants, and taking keys of forfeited properties.`,
    documentationEvidence: `Possession delivery notice, eviction and physical possession panchnama.`,
    relatedSections: ['Section 68I', 'Section 68G', 'Section 68T'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68U',
      authority: 'Parliament of India'
    }
  },
  '68V': {
    sectionNumber: '68V',
    officialTitle: 'Rectification of mistakes',
    statutoryText: `The competent authority and the Appellate Tribunal may, at any time within a period of one year from the date of the order, on its own motion, or on an application made in this behalf, rectify any mistake apparent from the record: Provided that no such rectification which has the effect of enhancing the forfeiture or fine shall be made without giving the person affected a reasonable opportunity of being heard.`,
    plainExplanation: `Allows the Competent Authority and Appellate Tribunal to rectify any clerical, arithmetic, or obvious mistake apparent on the record within one year of passing an order.`,
    scope: `Correction of apparent errors within 1 year.`,
    keyRequirements: [
      '1-year limitation period from order date.',
      'Opportunity of being heard mandatory if rectification increases forfeiture or fine.'
    ],
    investigationRelevance: `Correcting typographical errors in property valuation, bank account numbers, or survey records.`,
    documentationEvidence: `Section 68V Rectification application and Corrigendum order.`,
    relatedSections: ['Section 68I', 'Section 68P'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68V',
      authority: 'Parliament of India'
    }
  },
  '68W': {
    sectionNumber: '68W',
    officialTitle: 'Findings under other laws not conclusive for proceedings under this Chapter',
    statutoryText: `No finding of any court or authority regarding the issues which are relevant for the purpose of this Chapter in any other proceedings shall be conclusive for the purposes of any proceedings under this Chapter.`,
    plainExplanation: `Establishes that findings under other laws (e.g. Income Tax assessments, Customs adjudications, or civil court findings) are NOT conclusive or binding on Chapter V-A proceedings. Chapter V-A authorities conduct independent evaluations of whether assets stem from drug trafficking.`,
    scope: `Legal independence of Chapter V-A forfeiture proceedings from other statutory findings.`,
    keyRequirements: [
      'Independent evaluation of drug proceeds regardless of clean Income Tax or civil findings.',
      'Payment of income tax on illicit money does not immunize property from NDPS forfeiture.'
    ],
    investigationRelevance: `Overcoming defence arguments that properties were declared in Income Tax returns (ITRs).`,
    documentationEvidence: `Rebuttal memo showing illicit drug provenance despite tax filings.`,
    relatedSections: ['Section 68C', 'Section 68J'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68W',
      authority: 'Parliament of India'
    }
  },
  '68X': {
    sectionNumber: '68X',
    officialTitle: 'Service of notices and orders',
    statutoryText: `Any notice or order issued or made under this Chapter shall be served— (a) by tendering the notice or order or sending it by registered post to the person for whom it is intended; or (b) if the notice or order cannot be in the manner provided in clause (a), by affixing it on a conspicuous part of the property... or at the last known place of residence.`,
    plainExplanation: `Prescribes the legal methods for serving notices and orders under Chapter V-A: personal tender, registered post, or substitute service by affixing on a conspicuous part of the property or last known residence.`,
    scope: `Statutory service of process across all Chapter V-A notices and orders.`,
    keyRequirements: [
      'Service by tender, registered post, or physical affixation on property/residence.',
      'Valid service triggers statutory response timelines (e.g., 30 days under 68H).'
    ],
    investigationRelevance: `Establishing indisputable proof of service before proceeding ex-parte.`,
    documentationEvidence: `Postal tracking report, service memo, spot photograph of notice affixation on premises.`,
    relatedSections: ['Section 68H', 'Section 68I'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68X',
      authority: 'Parliament of India'
    }
  },
  '68Y': {
    sectionNumber: '68Y',
    officialTitle: 'Punishment for acquiring property in respect of which proceedings have been taken under this Chapter',
    statutoryText: `Any person who knowingly acquires any property in respect of which any proceedings are pending under this Chapter shall be punishable with imprisonment for a term which may extend to five years and also with fine which may extend to fifty thousand rupees.`,
    plainExplanation: `Criminalizes knowingly purchasing, acquiring, or taking transfer of any property against which Chapter V-A proceedings (freezing or forfeiture) are pending, punishing offenders with up to 5 years imprisonment and ₹50,000 fine.`,
    scope: `Penal sanction against third parties dealing in frozen/noticed drug assets.`,
    keyRequirements: [
      'Applies to persons knowingly acquiring property under Chapter V-A proceedings.',
      'Punishable with up to 5 years imprisonment and fine up to ₹50,000.'
    ],
    investigationRelevance: `Prosecuting collusive buyers attempting to rescue frozen properties for traffickers.`,
    documentationEvidence: `Sale deed executed during pendency of 68F/68H, proof of knowledge of proceedings.`,
    relatedSections: ['Section 68M', 'Section 68F', 'Section 68H'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68Y',
      authority: 'Parliament of India'
    }
  },
  '68Z': {
    sectionNumber: '68Z',
    officialTitle: 'Release of property in certain cases',
    statutoryText: `(1) Where the detention order in respect of a person is set aside or revoked, or where the person has been acquitted of the offence punishable under this Act with imprisonment for a term of ten years or more, the property of such person seized, frozen or forfeited under this Chapter shall stand released: Provided that if an appeal or further proceeding against such revocation or acquittal is pending, the property shall not be released until final orders are passed.`,
    plainExplanation: `Mandates the release and return of seized, frozen, or forfeited property if the underlying PIT NDPS detention order is revoked/quashed or if the accused is ultimately acquitted of the 10+ year NDPS offence, provided no further appeal against acquittal is pending.`,
    scope: `Restitution and release of property upon final acquittal or detention revocation.`,
    keyRequirements: [
      'Property stands released upon revocation of detention order or final acquittal.',
      'Proviso: Property is NOT released if an appeal against acquittal is pending in higher court.'
    ],
    investigationRelevance: `Processing property de-freezing applications following court acquittals or tracking State appeals against acquittal.`,
    documentationEvidence: `Certified copy of final acquittal judgment, certificate from Public Prosecutor verifying whether state appeal has been filed.`,
    relatedSections: ['Section 68A', 'Section 68F', 'Section 68I'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter V-A - Forfeiture of Illegally Acquired Property',
      sourceTitle: 'NDPS Act, 1985, Section 68Z',
      authority: 'Parliament of India'
    }
  }
};
