import { StructuredSectionRecord } from './types';

export const PENAL_SECTIONS: Record<string, StructuredSectionRecord> = {
  '8': {
    sectionNumber: '8',
    officialTitle: 'Prohibition of certain operations',
    statutoryText: `No person shall— (a) cultivate any coca plant or gather any portion of coca plant; or (b) cultivate the opium poppy or any cannabis plant; or (c) produce, manufacture, possess, sell, purchase, transport, warehouse, use, consume, import inter-State, export inter-State, import into India, export from India or tranship any narcotic drug or psychotropic substance, except for medical or scientific purposes and in the manner and to the extent provided by the provisions of this Act or the rules or orders made thereunder.`,
    plainExplanation: `Section 8 forms the foundational prohibitory mandate of the NDPS Act. It lays down a blanket prohibition against cultivating prohibited plants (coca, opium poppy, cannabis) and engaging in any commercial, physical, or personal dealings with narcotic drugs and psychotropic substances, except strictly for licensed medical or scientific purposes.`,
    scope: `Applies universally across India and to Indian citizens outside India, prohibiting all unauthorized operations relating to narcotic drugs, psychotropic substances, and prohibited plants.`,
    keyRequirements: [
      'Total statutory prohibition on unauthorized cultivation, gathering, or harvesting of coca, opium poppy, and cannabis.',
      'Total prohibition on production, manufacture, possession, sale, purchase, transport, warehousing, consumption, import/export, or transhipment of contraband.',
      'Sole statutory exception is strictly for authorized medical or scientific purposes under valid licenses and rules.'
    ],
    investigationRelevance: `Acts as the substantive anchor defining the illegality of the underlying act before invoking specific penalty sections (Sections 15 to 27A).`,
    documentationEvidence: `Verification of lack of valid statutory license, permit, or medical authorization issued by competent central/state excise or narcotics authorities.`,
    relatedSections: ['Section 8A', 'Sections 15–27A', 'Section 41', 'Section 42'],
    supremeCourtCaseLaw: [
      'Noor Aga v. State of Punjab, (2008) 16 SCC 417: Clarifying that Section 8 is the primary prohibitory provision giving effect to international treaty obligations under strict liability parameters.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter III - Prohibition, Control and Regulation',
      sourceTitle: 'NDPS Act, 1985 (Bare Act), Section 8',
      authority: 'Parliament of India (Central Bare Act)'
    }
  },
  '15': {
    sectionNumber: '15',
    officialTitle: 'Punishment for contravention in relation to poppy straw',
    statutoryText: `Whoever, in contravention of any provision of this Act or any rule or order made or condition of a licence granted thereunder, produces, possesses, transports, imports inter-State, exports inter-State, sells, purchases, uses or omits to warehouse poppy straw or removes the same from a warehouse shall be punishable based on quantity: (a) small quantity: rigorous imprisonment up to 1 year, or fine up to ₹10,000, or both; (b) intermediate quantity: rigorous imprisonment up to 10 years, and fine up to ₹1,00,000; (c) commercial quantity: rigorous imprisonment from 10 years to 20 years, and fine from ₹1,00,000 to ₹2,00,000 (court may exceed ₹2,00,000).`,
    plainExplanation: `Prescribes graded penal sentences for illegal dealings in poppy straw based strictly on the seized weight categorised into small, intermediate, or commercial quantities.`,
    scope: `Applies whenever poppy straw is produced, possessed, transported, bought, sold, or warehoused in violation of the Act.`,
    keyRequirements: [
      'Graded sentencing structure strictly calibrated to threshold weight.',
      'Mandatory minimum sentence (10 years RI and ₹1 Lakh fine) applies upon crossing commercial quantity threshold (50 kg for poppy straw).',
      'Twin conditions for bail under Section 37 triggered for commercial quantity offences.'
    ],
    investigationRelevance: `Requires precise physical weighing, representative sampling under Section 52A, and forensic chemical examination proving the seized material is poppy straw.`,
    documentationEvidence: `Weighment memo, seizure panchnama, Section 52A Magistrate inventory certificate, chemical examiner report.`,
    relatedSections: ['Section 8', 'Section 2(xviii)', 'Section 37', 'Section 52A'],
    supremeCourtCaseLaw: [
      'State of Punjab v. Baldev Singh, (1999) 6 SCC 172: Statutory safeguards in recovery and penal application.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 15',
      authority: 'Parliament of India'
    }
  },
  '17': {
    sectionNumber: '17',
    officialTitle: 'Punishment for contravention in relation to prepared opium',
    statutoryText: `Whoever, in contravention of any provision of this Act or any rule or order made or condition of a licence granted thereunder, manufactures, possesses, sells, purchases, transports, imports inter-State, exports inter-State or uses prepared opium shall be punishable: (a) small quantity: RI up to 1 year, or fine up to ₹10,000, or both; (b) intermediate quantity: RI up to 10 years, and fine up to ₹1,00,000; (c) commercial quantity: RI from 10 to 20 years, and fine from ₹1,00,000 to ₹2,00,000.`,
    plainExplanation: `Prescribes graded penalties for unauthorized manufacture, possession, sale, transport, or usage of prepared opium according to small, intermediate, or commercial quantity tiers.`,
    scope: `Applies specifically to prepared opium as defined under Section 2(xx).`,
    keyRequirements: [
      'Covers prepared opium (smoking opium, dross, or any mixture).',
      'Sentencing scales directly with quantity tiers.',
      'Commercial threshold triggers Section 37 bail restrictions.'
    ],
    investigationRelevance: `Seizure and chemical confirmation of diacetylmorphine/morphine resinous extract constituting prepared opium.`,
    documentationEvidence: `Seizure memo, recovery panchnama, Chemical Examiner lab test confirming prepared opium.`,
    relatedSections: ['Section 2(xx)', 'Section 8', 'Section 37', 'Section 52A'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 17',
      authority: 'Parliament of India'
    }
  },
  '18': {
    sectionNumber: '18',
    officialTitle: 'Punishment for contravention in relation to opium poppy and opium',
    statutoryText: `Whoever, in contravention of any provision of this Act or any rule or order made or condition of licence granted thereunder, cultivates the opium poppy or produces, manufactures, possesses, sells, purchases, transports, imports inter-State, exports inter-State or uses opium, shall be punishable: (a) for cultivation: RI up to 10 years, and fine up to ₹1,00,000; (b) for small quantity of opium: RI up to 1 year, or fine up to ₹10,000, or both; (c) for commercial quantity of opium: RI from 10 to 20 years, and fine from ₹1,00,000 to ₹2,00,000; (d) for intermediate quantity: RI up to 10 years, and fine up to ₹1,00,000.`,
    plainExplanation: `Penalizes illegal cultivation of opium poppy as well as illicit production, manufacture, possession, transport, and trafficking of raw opium. Cultivation carries a standalone penalty of up to 10 years RI and ₹1 Lakh fine.`,
    scope: `Applies to illegal farming of opium poppy plants and illicit trafficking of raw opium.`,
    keyRequirements: [
      'Standalone offence for illegal cultivation of opium poppy under Section 18(a).',
      'Standard 3-tier quantity sentencing for possession/trafficking of opium under Sections 18(b), (c), and (d).',
      'Small quantity of opium is up to 25g; commercial quantity is 2.5 kg or more.'
    ],
    investigationRelevance: `In cultivation cases, physical crop inspection, demarcation of land revenue records, photography/videography of illicit fields, and crop destruction after sampling.`,
    documentationEvidence: `Revenue land records (Khasra/Khatauni), seizure memos, Section 52A Magistrate sample certificate, chemical analyst reports.`,
    relatedSections: ['Section 8', 'Section 12', 'Section 37', 'Section 44', 'Section 48'],
    supremeCourtCaseLaw: [
      'Amarsingh Ramjibhai Barot v. State of Gujarat, (2005) 7 SCC 550: Analysis of individual possession and quantity thresholds for opium mixtures.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 18',
      authority: 'Parliament of India'
    }
  },
  '20': {
    sectionNumber: '20',
    officialTitle: 'Punishment for contravention in relation to cannabis plant and cannabis',
    statutoryText: `Whoever, in contravention of any provision of this Act or any rule or order made or condition of licence granted thereunder: (a) cultivates any cannabis plant: RI up to 10 years, and fine up to ₹1,00,000; (b) produces, manufactures, possesses, sells, purchases, transports, imports inter-State, exports inter-State or uses cannabis: (i) small quantity: RI up to 1 year, or fine up to ₹10,000, or both; (ii) intermediate quantity: RI up to 10 years, and fine up to ₹1,00,000; (iii) commercial quantity: RI from 10 to 20 years, and fine from ₹1,00,000 to ₹2,00,000.`,
    plainExplanation: `Penalizes the unauthorized cultivation of cannabis plants and all unauthorized dealings in cannabis (charas, hashish, hashish oil, and ganja). Note that bhang (seeds/leaves when not accompanied by flowering tops) is excluded from the definition of cannabis under the NDPS Act.`,
    scope: `Applies to unauthorized farming of cannabis and trade/possession of charas, ganja, or cannabis resin.`,
    keyRequirements: [
      'Cultivation is punishable under Section 20(a) with up to 10 years RI and fine.',
      'Possession/trafficking of charas/ganja is penalized according to small, intermediate, or commercial quantity tiers.',
      'Small quantity: Ganja ≤ 1 kg; Charas ≤ 100 g. Commercial quantity: Ganja ≥ 20 kg; Charas ≥ 1 kg.'
    ],
    investigationRelevance: `Crucial to distinguish ganja (flowering or fruiting tops) from seeds and leaves without tops, and ensure proper net weight determination.`,
    documentationEvidence: `Seizure memo, botanical/chemical report verifying flowering tops or resinous charas content, weighment slip, Section 52A inventory.`,
    relatedSections: ['Section 2(iii)', 'Section 8', 'Section 37', 'Section 44'],
    supremeCourtCaseLaw: [
      'Union of India v. Mohanlal, (2016) 3 SCC 379: Pre-trial sampling and disposal of seized cannabis contraband before Magistrate.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 20',
      authority: 'Parliament of India'
    }
  },
  '21': {
    sectionNumber: '21',
    officialTitle: 'Punishment for contravention in relation to manufactured drugs and preparations',
    statutoryText: `Whoever, in contravention of any provision of this Act or any rule or order made or condition of licence granted thereunder, manufactures, possesses, sells, purchases, transports, imports inter-State, exports inter-State or uses any manufactured drug or any preparation containing any manufactured drug shall be punishable based on small, intermediate, or commercial quantity: (a) small quantity: RI up to 1 year, or fine up to ₹10,000, or both; (b) intermediate quantity: RI up to 10 years, and fine up to ₹1,00,000; (c) commercial quantity: RI from 10 to 20 years, and fine from ₹1,00,000 to ₹2,00,000.`,
    plainExplanation: `Prescribes graded criminal penalties for unauthorized manufacture, trafficking, possession, or sale of manufactured drugs (including heroin/smack/brown sugar, morphine, codeine preparations, methadone, etc.).`,
    scope: `Applies to all narcotic substances classified as manufactured drugs under Section 2(xi).`,
    keyRequirements: [
      'Applies to synthetic or semi-synthetic manufactured drugs (e.g. Heroin/Diacetylmorphine: small ≤ 5g, commercial ≥ 250g).',
      'Strict 3-tier sentencing mechanism.',
      'Total weight of the illicit mixture determines the quantity category per notification S.O. 2941(E) and Supreme Court ruling in Hira Singh (2020).'
    ],
    investigationRelevance: `Immediate field testing via drug detection kit (NDDK), followed by representative sampling before the Magistrate under Section 52A.`,
    documentationEvidence: `Testing memo, CRCL/FSL chemical analyst report, Section 52A certificate, seizure panchnama.`,
    relatedSections: ['Section 2(xi)', 'Section 8', 'Section 37', 'Section 52A'],
    supremeCourtCaseLaw: [
      'Hira Singh v. Union of India, (2020) 20 SCC 272: Held that in a mixture of a narcotic drug with neutral substance, the entire weight of the mixture is to be considered for determining small, intermediate, or commercial quantity.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 21',
      authority: 'Parliament of India'
    }
  },
  '22': {
    sectionNumber: '22',
    officialTitle: 'Punishment for contravention in relation to psychotropic substances',
    statutoryText: `Whoever, in contravention of any provision of this Act or any rule or order made or condition of licence granted thereunder, manufactures, possesses, sells, purchases, transports, imports inter-State, exports inter-State or uses any psychotropic substance shall be punishable based on quantity: (a) small quantity: RI up to 1 year, or fine up to ₹10,000, or both; (b) intermediate quantity: RI up to 10 years, and fine up to ₹1,00,000; (c) commercial quantity: RI from 10 to 20 years, and fine from ₹1,00,000 to ₹2,00,000.`,
    plainExplanation: `Penalizes unauthorized trafficking, possession, transport, manufacture, and sale of psychotropic substances listed in the Schedule to the Act (e.g. Alprazolam, Diazepam, MDMA/Ecstasy, Methamphetamine, Ketamine, Tramadol, etc.).`,
    scope: `Applies to any substance specified in the NDPS Schedule of Psychotropic Substances.`,
    keyRequirements: [
      'Substance must be explicitly listed in the NDPS Schedule.',
      'Punishment calibrated to small, intermediate, or commercial quantities.',
      'Commercial quantities attract strict bail limitations under Section 37.'
    ],
    investigationRelevance: `Accurate chemical verification of the molecular salt and scheduling entry.`,
    documentationEvidence: `FSL report, batch and manufacturing records if pharmaceutical diversion, Section 52A inventory certificate.`,
    relatedSections: ['Section 2(xxiii)', 'Section 8', 'Section 37', 'Schedule to NDPS Act'],
    supremeCourtCaseLaw: [
      'State of Uttaranchal v. Rajesh Kumar Gupta, (2007) 1 SCC 355: Scope of psychotropic schedule and exceptions for pharmaceutical preparations.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 22',
      authority: 'Parliament of India'
    }
  },
  '23': {
    sectionNumber: '23',
    officialTitle: 'Punishment for illegal import into India, export from India or transhipment of narcotic drugs and psychotropic substances',
    statutoryText: `Whoever, in contravention of any provision of this Act or any rule or order made or condition of licence or permit granted thereunder, imports into India or exports from India or tranships any narcotic drug or psychotropic substance shall be punishable: (a) small quantity: RI up to 1 year, or fine up to ₹10,000, or both; (b) intermediate quantity: RI up to 10 years, and fine up to ₹1,00,000; (c) commercial quantity: RI from 10 to 20 years, and fine from ₹1,00,000 to ₹2,00,000.`,
    plainExplanation: `Penalizes international cross-border trafficking—illegal import into India, export out of India, or transhipment through Indian territory of any narcotic drug or psychotropic substance.`,
    scope: `Applies to cross-border, customs, maritime, airport, and postal drug interception cases.`,
    keyRequirements: [
      'Involves international boundary crossing or international transhipment.',
      '3-tier sentencing strictly linked to the seized quantity.',
      'Applies to parcels, cargo, airport couriers, maritime vessels, and border crossings.'
    ],
    investigationRelevance: `Invokes coordination with Customs, DRI, NCB, and foreign law enforcement (controlled delivery under Section 50A).`,
    documentationEvidence: `Airway bills, shipping bills, baggage tags, customs declarations, passport entries, seizure panchnama.`,
    relatedSections: ['Section 8', 'Section 37', 'Section 50A', 'Section 53'],
    supremeCourtCaseLaw: [
      'Noor Aga v. State of Punjab, (2008) 16 SCC 417: Standards of burden of proof and customs search in airport contraband recovery under Section 23.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 23',
      authority: 'Parliament of India'
    }
  },
  '25': {
    sectionNumber: '25',
    officialTitle: 'Punishment for allowing premises, etc., to be used for commission of an offence',
    statutoryText: `Whoever, being the owner or occupier or having the use of any house, room, enclosure, space, place, animal or conveyance, knowingly permits it to be used for the commission by any other person of an offence punishable under any provision of this Act, shall be punishable with the punishment provided for that offence.`,
    plainExplanation: `Holds owners, tenants, drivers, or occupiers criminally liable if they knowingly permit their house, room, land, warehouse, vehicle, vessel, or animal to be used by anyone else for committing an NDPS offence. The penalty is identical to the punishment prescribed for the primary offence.`,
    scope: `Applies to property owners, landlords, fleet owners, vehicle drivers, and warehouse keepers knowingly facilitating drug crimes.`,
    keyRequirements: [
      'Accused must be owner, occupier, or have lawful use/control of the place, vehicle, or conveyance.',
      'Must have knowingly permitted another person to commit an NDPS offence therein/therewith.',
      'Punished with the exact punishment provided for the underlying substantive offence.'
    ],
    investigationRelevance: `Proving ownership/possession and established knowledge (mens rea) or invoking the statutory presumption under Section 35.`,
    documentationEvidence: `Registration certificate (RC), title deeds, lease/rental agreements, driver logbooks, call detail records (CDR).`,
    relatedSections: ['Section 35', 'Section 60(3)', 'Section 42', 'Section 43'],
    supremeCourtCaseLaw: [
      'Baldev Singh v. State of Haryana, (2015) 17 SCC 554: Mens rea and knowledge requirement of vehicle owner/driver under Section 25.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 25',
      authority: 'Parliament of India'
    }
  },
  '27': {
    sectionNumber: '27',
    officialTitle: 'Punishment for consumption of any narcotic drug or psychotropic substance',
    statutoryText: `Whoever, consumes any narcotic drug or psychotropic substance shall be punishable: (a) where the narcotic drug or psychotropic substance consumed is cocaine, morphine, diacetyl-morphine or any other narcotic drug or any psychotropic substance as may be specified in this behalf by the Central Government by notification in the Official Gazette, with rigorous imprisonment for a term which may extend to 1 year, or with fine which may extend to ₹20,000, or with both; and (b) where the narcotic drug or psychotropic substance consumed is other than those specified in or under clause (a), with imprisonment for a term which may extend to 6 months, or with fine which may extend to ₹10,000, or with both.`,
    plainExplanation: `Penalizes individual consumption of illicit drugs. It prescribes up to 1 year RI / ₹20,000 fine for hard drugs (cocaine, heroin, morphine) and up to 6 months imprisonment / ₹10,000 fine for other drugs (such as ganja). Addicts may seek immunity from prosecution under Section 64A by undergoing voluntary medical de-addiction treatment.`,
    scope: `Applies exclusively to personal consumption offences.`,
    keyRequirements: [
      'Two penal tiers: 1 year / ₹20,000 fine (clause a) vs. 6 months / ₹10,000 fine (clause b).',
      'Small bailable category offence.',
      'Immunity from prosecution available if offender voluntarily undergoes de-addiction under Section 64A.'
    ],
    investigationRelevance: `Medical examination, urine/blood toxicology analysis proving systemic drug ingestion.`,
    documentationEvidence: `Medical officer examination report, FSL/toxicology laboratory test result.`,
    relatedSections: ['Section 64A', 'Section 39', 'Section 37'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 27',
      authority: 'Parliament of India'
    }
  },
  '27A': {
    sectionNumber: '27A',
    officialTitle: 'Punishment for financing illicit traffic and harbouring offenders',
    statutoryText: `Whoever indulges in financing, directly or indirectly, any of the activities specified in sub-clauses (i) to (v) of clause (viiia) of section 2 or harbours any person engaged in any of the aforementioned activities, shall be punishable with rigorous imprisonment for a term which shall not be less than 10 years but which may extend to 20 years and shall also be liable to fine which shall not be less than ₹1,00,000 but which may extend to ₹2,00,000 (court may impose fine exceeding ₹2,00,000 for reasons recorded).`,
    plainExplanation: `Strict penal provision aimed at the financial masterminds and protectors of drug syndicates. It punishes direct or indirect financing of illicit drug trafficking activities and harbouring drug traffickers with a mandatory minimum of 10 to 20 years RI and ₹1 Lakh to ₹2 Lakhs fine.`,
    scope: `Applies to financiers, hawala operators, syndicate bosses, and individuals providing shelter or logistical finance to drug traffickers.`,
    keyRequirements: [
      'Mandatory minimum sentence: 10 years RI and ₹1,00,000 fine.',
      'Applies to direct or indirect financing of illicit traffic defined under Section 2(viiia).',
      'Covers harbouring persons engaged in illicit traffic.',
      'Section 37 twin conditions for bail apply automatically.'
    ],
    investigationRelevance: `Financial investigation, bank account analysis, crypto tracking, hawala paper trails, digital transaction logs, property verification for Chapter V-A freezing.`,
    documentationEvidence: `Bank statements, audit reports, electronic money transfer records, lease agreements of safehouses, CDR analysis.`,
    relatedSections: ['Section 2(viiia)', 'Section 37', 'Chapter V-A (Sections 68A–68Z)'],
    supremeCourtCaseLaw: [
      'Union of India v. Sanjeev V. Deshpande, (2014) 13 SCC 341: Broad legislative intent targeting trafficking networks and financing.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 27A',
      authority: 'Parliament of India'
    }
  },
  '29': {
    sectionNumber: '29',
    officialTitle: 'Punishment for abetment and criminal conspiracy',
    statutoryText: `(1) Whoever abets, or is a party to a criminal conspiracy to commit, an offence punishable under this Chapter, shall, whether such offence be or be not committed in consequence of such abetment or in pursuance of such criminal conspiracy, and notwithstanding anything contained in section 116 of the Indian Penal Code (45 of 1860), be punishable with the punishment provided for that offence. (2) A person abets, or is a party to a criminal conspiracy to commit, an offence, within the meaning of this section, who, in India, abets or is a party to the conspiracy to the commission of any act in a place without and beyond India which— (a) would constitute an offence if committed within India; or (b) under the laws of such place, is an offence relating to narcotic drugs or psychotropic substances having all the legal conditions required in respect of that act.`,
    plainExplanation: `Equates conspirators and abettors with principal offenders. Anyone who abets or conspires to commit an NDPS offence is liable for the exact same punishment as the main perpetrator, whether or not the planned offence was successfully executed. Also extends to cross-border conspiracies hatched in India targeting acts abroad.`,
    scope: `Applies to all syndicate members, conspirators, facilitators, brokers, and abettors connected to an NDPS crime.`,
    keyRequirements: [
      'Abettors and conspirators receive the exact same punishment as the primary offender.',
      'Offence is punishable even if the ultimate crime was not completed.',
      'Applies to domestic and international conspiracies.',
      'Section 37 bail restrictions apply if the underlying conspiracy involves commercial quantity.'
    ],
    investigationRelevance: `Establishing agreement, common intention, money flows, communication links between kingpins, carriers, and distributors.`,
    documentationEvidence: `Call detail records (CDR), WhatsApp/Telegram chat extractions under Section 63 BSA / 65B IEA, financial ledgers, co-accused disclosures corroborated by independent recovery.`,
    relatedSections: ['Section 8', 'Sections 15–27A', 'Section 37', 'Section 53A'],
    supremeCourtCaseLaw: [
      'Tofan Singh v. State of Tamil Nadu, (2021) 4 SCC 1: Section 67 NDPS statements to investigating officers cannot be treated as substantive confessions against co-accused under Section 29 without independent corroboration.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 29',
      authority: 'Parliament of India'
    }
  },
  '31': {
    sectionNumber: '31',
    officialTitle: 'Enhanced punishment for offences after previous conviction',
    statutoryText: `(1) If any person who has been convicted of the commission of, or attempt to commit, or abetment of, or criminal conspiracy to commit, any of the offences punishable under this Act is subsequently convicted of the commission of, or attempt to commit, or abetment of, or criminal conspiracy to commit, an offence punishable under this Act with the same amount of punishment shall be punished for the second and every subsequent offence with rigorous imprisonment for a term which may extend to one-half of the maximum term of imprisonment, and also be liable to fine which may extend to one-half of the maximum amount of fine.`,
    plainExplanation: `Authorizes enhanced penalties for repeat offenders previously convicted under the NDPS Act. Upon a second or subsequent conviction, the court may sentence the offender to up to one and a half times (1.5x) the maximum term of imprisonment and fine prescribed for the offence.`,
    scope: `Applies to any individual facing subsequent conviction under the NDPS Act following a prior NDPS conviction.`,
    keyRequirements: [
      'Requires proof of a prior final conviction under the NDPS Act.',
      'Enhances maximum sentence and fine by up to 1.5 times the standard maximum.',
      'Applies to attempts, abetments, conspiracies, and substantive offences.'
    ],
    investigationRelevance: `Checking previous criminal antecedents across state CCTNS and national NDPS offender databases (e.g. NIDAAN).`,
    documentationEvidence: `Certified copy of previous judgment of conviction, finger print bureau matching certificate.`,
    relatedSections: ['Section 31A', 'Section 54', 'Chapter V-A'],
    supremeCourtCaseLaw: [],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 31',
      authority: 'Parliament of India'
    }
  },
  '31A': {
    sectionNumber: '31A',
    officialTitle: 'Enhanced punishment for offences after previous conviction for certain offences',
    statutoryText: `(1) If any person who has been convicted of the commission of, or attempt to commit, or abetment of, or criminal conspiracy to commit, any of the offences punishable under section 19, section 24, section 27A and for offences involving commercial quantity of any narcotic drug or psychotropic substance, is subsequently convicted of the commission of, or attempt to commit, or abetment of, or criminal conspiracy to commit, an offence relating to specified commercial quantities, he shall be punishable with punishment of death or with imprisonment for a term which may extend to thirty years and shall also be liable to fine.`,
    plainExplanation: `Section 31A provides for enhanced penalties for repeat offenders convicted of major commercial quantity offences, financing (Section 27A), or embezzlement (Section 19). Following the NDPS (Amendment) Act, 2014, the death penalty is discretionary—the court has statutory discretion to sentence the repeat offender either to death OR to 30 years rigorous imprisonment plus fine.`,
    scope: `Applies strictly to repeat offenders previously convicted and subsequently convicted of commercial quantity trafficking, Section 19, Section 24, or Section 27A.`,
    keyRequirements: [
      'Previous conviction and subsequent offence must involve specified commercial quantities or Sections 19, 24, 27A.',
      'Death penalty is NOT mandatory; court has discretion between death sentence and 30 years RI.',
      'Amended by Act 16 of 2014 after the Bombay High Court (Indian Harm Reduction Network v. UOI, 2011) held mandatory death sentences unconstitutional.'
    ],
    investigationRelevance: `Documenting repeat conviction chain in commercial trafficking syndicates.`,
    documentationEvidence: `Certified copy of prior conviction order, chemical analysis proving commercial quantity threshold in both cases.`,
    relatedSections: ['Section 19', 'Section 24', 'Section 27A', 'Section 31'],
    supremeCourtCaseLaw: [
      'Indian Harm Reduction Network v. Union of India, 2011 Cri LJ 3418 (Bom HC): Struck down mandatory death penalty in Section 31A, leading to the 2014 parliamentary amendment providing 30 years RI as an alternative.'
    ],
    historicalAmendmentInfo: `Originally enacted in 1989 providing mandatory capital punishment; amended by NDPS (Amendment) Act, 2014 (Act 16 of 2014) to introduce alternative sentencing of 30 years RI.`,
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 31A',
      authority: 'Parliament of India'
    }
  },
  '35': {
    sectionNumber: '35',
    officialTitle: 'Presumption of culpable mental state',
    statutoryText: `(1) In any prosecution for an offence under this Act which requires a culpable mental state of the accused, the court shall presume the existence of such mental state but it shall be a defence for the accused to prove the fact that he had no such mental state with respect to the act charged as an offence in that prosecution. Explanation.—In this section "culpable mental state" includes intention, motive, knowledge of a fact and belief in, or reason to believe, a fact. (2) For the purposes of this section, a fact is said to be proved only when the court believes it to exist beyond a reasonable doubt and not merely when its existence is established by a preponderance of probability.`,
    plainExplanation: `Reverses the burden of proof regarding mental intent (mens rea). Once the prosecution establishes the foundational fact of physical possession or recovery of contraband from the accused, the court is statutorily required to presume that the accused had intentional knowledge/motive. The burden shifts to the accused to rebut this presumption beyond a reasonable doubt.`,
    scope: `Applies across all prosecutions under the NDPS Act where culpable mental state (intention, knowledge, belief) is an ingredient.`,
    keyRequirements: [
      'Statutory presumption of intention, knowledge, motive, and culpable mental state.',
      'Triggered only AFTER prosecution proves foundational fact of conscious possession or recovery beyond reasonable doubt.',
      'Accused must rebut the presumption not merely on balance of probabilities, but to the satisfaction of the court beyond reasonable doubt.'
    ],
    investigationRelevance: `Investigating officer must prove strict chain of custody and conscious physical control/possession to establish the foundational fact.`,
    documentationEvidence: `Seizure memo, recovery panchnama, independent witness statements establishing conscious possession.`,
    relatedSections: ['Section 54', 'Section 8', 'Sections 15–27A'],
    supremeCourtCaseLaw: [
      'Noor Aga v. State of Punjab, (2008) 16 SCC 417: Initial burden is on the prosecution to establish foundational facts beyond reasonable doubt before the statutory presumption under Section 35 can be raised against the accused.',
      'Mohan Lal v. State of Punjab, (2018) 17 SCC 627: Conscious possession is a core requirement before Section 35 presumption attaches.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 35',
      authority: 'Parliament of India'
    }
  },
  '37': {
    sectionNumber: '37',
    officialTitle: 'Offences to be cognizable and non-bailable',
    statutoryText: `(1) Notwithstanding anything contained in the Code of Criminal Procedure, 1973 (2 of 1974)— (a) every offence punishable under this Act shall be cognizable; (b) no person accused of an offence punishable for offences under section 19 or section 24 or section 27A and also for offences involving commercial quantity shall be released on bail or on his own bond unless— (i) the Public Prosecutor has been given an opportunity to oppose the application for such release, and (ii) where the Public Prosecutor opposes the application, the court is satisfied that there are reasonable grounds for believing that he is not guilty of such offence and that he is not likely to commit any offence while on bail. (2) The limitations on granting of bail specified in clause (b) of sub-section (1) are in addition to the limitations under the Code of Criminal Procedure, 1973 or any other law for the time being in force on granting of bail.`,
    plainExplanation: `Establishes that all NDPS offences are cognizable and non-bailable. For serious offences (commercial quantity, Section 19, 24, 27A), it imposes stringent "twin conditions" for bail: (1) opportunity to the Public Prosecutor to oppose bail, and (2) court satisfaction that there are reasonable grounds for believing the accused is not guilty and is not likely to commit any offence while on bail. Section 37 is a procedural bail restriction, NOT a sentencing/punishment section.`,
    scope: `Applies to all arrests and bail applications under the NDPS Act, especially cases involving commercial quantity, Section 19, Section 24, and Section 27A.`,
    keyRequirements: [
      'All NDPS offences are cognizable.',
      'Twin conditions for bail apply to commercial quantity offences, Section 19, 24, 27A.',
      'Overriding effect (non-obstante clause) over CrPC / BNSS general bail provisions.',
      'Reasonable grounds means substantial probable causes, not prima facie assertions.'
    ],
    investigationRelevance: `Critical during remand, bail hearings, and establishing commercial quantity threshold through chemical reporting.`,
    documentationEvidence: `Seizure memo, weighment certificate, Section 52A Magistrate certification, Public Prosecutor objection reply.`,
    relatedSections: ['Section 19', 'Section 24', 'Section 27A', 'Section 52A'],
    supremeCourtCaseLaw: [
      'State of Kerala v. Rajesh, (2020) 12 SCC 122: Twin conditions under Section 37 are mandatory and cumulative; "reasonable grounds" means substantial probable causes for believing the accused is not guilty.',
      'Union of India v. Shiv Shanker Kesari, (2007) 7 SCC 798: The recording of satisfaction regarding innocence and lack of likelihood of committing offences is an indispensable prerequisite for bail.',
      'Narcotics Control Bureau v. Mohit Aggarwal, (2022) SCC OnLine SC 891: Bail cannot be granted in commercial quantity cases without addressing Section 37 twin conditions.'
    ],
    sourceMetadata: {
      act: 'NDPS Act, 1985',
      chapter: 'Chapter IV - Offences and Penalties',
      sourceTitle: 'NDPS Act, 1985, Section 37',
      authority: 'Parliament of India'
    }
  }
};
