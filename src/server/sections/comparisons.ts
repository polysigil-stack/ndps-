import { SectionComparison } from './types';

export const SECTION_COMPARISONS: Record<string, SectionComparison> = {
  '42_vs_43': {
    title: 'Section 42 vs Section 43: Search of Enclosed Places vs Public Places',
    primarySections: ['Section 42', 'Section 43'],
    coreDistinction: `Section 42 applies strictly to entry, search, seizure, and arrest in any "building, conveyance or enclosed place", requiring prior reduction of secret intelligence into writing and dispatch to official superior within 72 hours. Section 43 governs seizures and arrests made in a "public place or in transit", where prior recording and dispatch of grounds under Section 42(2) is not mandated.`,
    comparisonPoints: [
      {
        aspect: 'Physical Location & Scope',
        sectionA: 'Section 42: Applies to private buildings, conveyances, warehouses, and enclosed places.',
        sectionB: 'Section 43: Applies to public places (roads, bus stands, railway stations, public conveyances, hotels, shops) or items/persons in transit.'
      },
      {
        aspect: 'Recording of Information (Writing Requirement)',
        sectionA: 'Section 42(1): Mandatory to record secret intelligence / grounds in writing prior to search.',
        sectionB: 'Section 43: No statutory requirement to record secret information in writing before intercepting in a public place.'
      },
      {
        aspect: 'Night Search Requirements (Sunset to Sunrise)',
        sectionA: 'Section 42 Proviso: Requires recording grounds of belief regarding urgency/danger of escape before conducting a night search without warrant.',
        sectionB: 'Section 43: Can be exercised at any time in a public place without special night search recording.'
      },
      {
        aspect: 'Reporting to Official Superior',
        sectionA: 'Section 42(2): Mandatory to send copy of recorded information/grounds to immediate official superior within 72 hours.',
        sectionB: 'Section 43: Section 42(2) does not apply; general 48-hour post-seizure report under Section 57 applies.'
      },
      {
        aspect: 'Search of Person Safeguards',
        sectionA: 'Section 42: Personal search requires compliance with Section 50.',
        sectionB: 'Section 43: If an individual\'s physical person is searched in a public place, Section 50 safeguards MUST still be strictly complied with (State of Punjab v. Baldev Singh).'
      }
    ],
    keyCaseLaw: [
      'Karnail Singh v. State of Haryana, (2009) 8 SCC 539 (Constitution Bench): Mandatory nature and substantial compliance parameters of Section 42.',
      'State of Haryana v. Jarnail Singh, (2004) 5 SCC 188: Clear delineation between private conveyances in private premises (Section 42) vs vehicles intercepted on public roads in transit (Section 43).',
      'Boota Singh v. State of Haryana, (2021) SCC OnLine SC 324: A private vehicle stopped on a public road where occupants were sitting inside with doors shut was examined under Section 42 principles.'
    ],
    authoritativeSource: 'NDPS Act, 1985 (Bare Act) — Chapter V (Sections 42 & 43) & Supreme Court of India'
  },
  '42_vs_50': {
    title: 'Section 42 vs Section 50: Search of Premises/Conveyance vs Personal Search of Suspect',
    primarySections: ['Section 42', 'Section 50'],
    coreDistinction: `Section 42 governs the power to enter and search physical places, buildings, enclosures, and conveyances. Section 50 provides mandatory constitutional and statutory safeguards applicable strictly to the personal bodily search of an individual's physical human body and clothing worn on the body.`,
    comparisonPoints: [
      {
        aspect: 'Object of Search',
        sectionA: 'Section 42: Search of premises, rooms, houses, warehouses, enclosed grounds, and vehicles.',
        sectionB: 'Section 50: Search of the physical person and clothing worn on the body of a human suspect.'
      },
      {
        aspect: 'Mandatory Notice of Legal Right',
        sectionA: 'Section 42: No requirement to offer suspect the option to be searched before a Gazetted Officer or Magistrate.',
        sectionB: 'Section 50(1): Mandatory requirement to inform suspect of the statutory right to be searched before the nearest Gazetted Officer or Magistrate.'
      },
      {
        aspect: 'Gender Safeguard',
        sectionA: 'Section 42: Addresses premises entry and search.',
        sectionB: 'Section 50(4): Strict statutory mandate: "No female shall be searched by anyone excepting a female."'
      },
      {
        aspect: 'Bags & External Containers',
        sectionA: 'Section 42: Applies to containers, lockers, and receptacles found inside premises.',
        sectionB: 'Section 50: Does NOT apply to separate hand-held bags, backpacks, or briefcases not on the physical body (State of H.P. v. Pawan Kumar, 2005).'
      }
    ],
    keyCaseLaw: [
      'State of Punjab v. Baldev Singh, (1999) 6 SCC 172: Section 50 is mandatory for personal search.',
      'State of H.P. v. Pawan Kumar, (2005) 4 SCC 350: Section 50 applies exclusively to physical person, not baggage or containers.'
    ],
    authoritativeSource: 'NDPS Act, 1985 (Bare Act) — Chapter V (Sections 42 & 50) & Supreme Court of India'
  },
  '50_vs_49': {
    title: 'Section 50 vs Section 49: Personal Search vs Search of Conveyance',
    primarySections: ['Section 50', 'Section 49'],
    coreDistinction: `Section 49 gives empowered officers the power to stop, rummage, and search conveyances (animals, vehicles, vessels, aircraft) in transit where contraband is suspected. Section 50 governs the personal search of human suspects. Searching a vehicle under Section 49 does not attract Section 50 safeguards unless the physical body of a passenger/driver is searched.`,
    comparisonPoints: [
      {
        aspect: 'Subject Matter',
        sectionA: 'Section 50: The human body and clothing worn by an individual suspect.',
        sectionB: 'Section 49: Moving conveyances, vehicles, cargo, luggage compartments, cavities, animals, and aircraft.'
      },
      {
        aspect: 'Procedural Safeguards',
        sectionA: 'Section 50: Mandatory right to Gazetted Officer / Magistrate (50(1)) and female searcher for females (50(4)).',
        sectionB: 'Section 49: Empowered officer may directly rummage and inspect vehicle compartments without offering Magistrate option for the vehicle.'
      },
      {
        aspect: 'Use of Force',
        sectionA: 'Section 50: Detention for personal search under Section 100 CrPC / Section 105 BNSS.',
        sectionB: 'Section 49: Statutory power to compel aircraft to land and use all lawful means (including firing upon conveyance if necessary) to stop fleeing conveyances.'
      }
    ],
    keyCaseLaw: [
      'State of H.P. v. Pawan Kumar, (2005) 4 SCC 350: Personal search vs container/vehicle search distinction.'
    ],
    authoritativeSource: 'NDPS Act, 1985 (Bare Act) — Chapter V (Sections 49 & 50) & Supreme Court of India'
  },
  '52_vs_52A': {
    title: 'Section 52 vs Section 52A: Disposal vs Statutory Sampling',
    primarySections: ['Section 52', 'Section 52A'],
    coreDistinction: `Section 52 regulates the immediate post-arrest handling of suspects and seized property (informing grounds of arrest and forwarding to the nearest police station or Section 53 officer). Section 52A governs the judicial pre-trial inventory certification, photography, representative sampling before a Magistrate, and safe disposal of contraband, creating primary trial evidence under Section 52A(4).`,
    comparisonPoints: [
      {
        aspect: 'Core Purpose',
        sectionA: 'Section 52: Custodial transfer of arrested person and physical custody of seized articles to police station/investigator.',
        sectionB: 'Section 52A: Pre-trial sampling and judicial certification before Magistrate to facilitate disposal and create primary evidence.'
      },
      {
        aspect: 'Role of Magistrate',
        sectionA: 'Section 52: Suspect produced before Magistrate under CrPC/BNSS for remand.',
        sectionB: 'Section 52A: Magistrate actively certifies inventory correctness, supervises photography, and oversees drawing of representative samples.'
      },
      {
        aspect: 'Evidentiary Status at Trial',
        sectionA: 'Section 52: Relates to initial custody and grounds of arrest documentation.',
        sectionB: 'Section 52A(4): The Magistrate-certified inventory, photographs, and sample list constitute PRIMARY EVIDENCE at trial, overriding contrary Evidence Act provisions.'
      }
    ],
    keyCaseLaw: [
      'Union of India v. Mohanlal, (2016) 3 SCC 379: Held that samples must be drawn exclusively in the presence of the Magistrate under Section 52A; field samples drawn at the spot without Magistrate certification are not primary evidence.',
      'Mangilal v. State of Madhya Pradesh, 2023 SCC OnLine SC 862: Strict compliance with Section 52A is mandatory.'
    ],
    authoritativeSource: 'NDPS Act, 1985 (Bare Act) — Chapter V (Sections 52 & 52A) & Supreme Court of India'
  },
  '55_vs_57': {
    title: 'Section 55 vs Section 57: Malkhana vs Reporting of Arrest',
    primarySections: ['Section 55', 'Section 57'],
    coreDistinction: `Section 55 mandates that the Station House Officer (SHO) must take physical safe custody of seized contraband in the police Malkhana and affix the police station seal on articles and samples. Section 57 imposes an administrative reporting duty requiring every officer making an arrest or seizure to submit a full written report to their immediate official superior within 48 hours (48-hour mandatory reporting rule).`,
    comparisonPoints: [
      {
        aspect: 'Statutory Duty',
        sectionA: 'Section 55: Physical custody, safe preservation in Malkhana, and dual sealing with SHO seal.',
        sectionB: 'Section 57: Submission of a comprehensive written report of all arrest and seizure particulars.'
      },
      {
        aspect: 'Responsible Officer',
        sectionA: 'Section 55: Officer-in-Charge of the Police Station (SHO).',
        sectionB: 'Section 57: Any officer who executed the arrest or seizure.'
      },
      {
        aspect: 'Statutory Timeline',
        sectionA: 'Section 55: Immediate upon delivery of seized articles pending Magistrate orders.',
        sectionB: 'Section 57: Strictly within 48 hours next after such arrest or seizure.'
      },
      {
        aspect: 'Evidentiary Impact',
        sectionA: 'Section 55: Vital for proving chain of custody and ruling out seal tampering.',
        sectionB: 'Section 57: Classified as directory by Supreme Court (State of Punjab v. Balbir Singh), but unexplained total non-compliance affects prosecution credibility.'
      }
    ],
    keyCaseLaw: [
      'State of Rajasthan v. Gurmail Singh, (2005) 3 SCC 59: Unbroken chain of custody under Section 55 is essential.',
      'State of Punjab v. Balbir Singh, (1994) 3 SCC 299: Section 57 reporting is directory, but deliberate non-compliance is scrutinized.'
    ],
    authoritativeSource: 'NDPS Act, 1985 (Bare Act) — Chapter V (Sections 55 & 57) & Supreme Court of India'
  },
  '37_vs_punishment': {
    title: 'Section 37 (Bail & Cognizability) vs Chapter IV Punishment Sections (Sections 15–32)',
    primarySections: ['Section 37', 'Sections 15–32'],
    coreDistinction: `Section 37 is a procedural threshold and bail restriction provision establishing that all NDPS offences are cognizable and imposing twin conditions for bail in commercial quantity cases. It does NOT define substantive offences or prescribe prison terms. Chapter IV (Sections 15 to 32) contains the substantive penal provisions defining criminal acts and prescribing specific prison sentences and fines calibrated to quantity.`,
    comparisonPoints: [
      {
        aspect: 'Legal Character',
        sectionA: 'Section 37: Procedural regulation governing bail conditions and arrest classification (cognizable & non-bailable).',
        sectionB: 'Chapter IV: Substantive penal law defining offences, quantity thresholds, and sentencing terms.'
      },
      {
        aspect: 'Twin Conditions for Bail',
        sectionA: 'Section 37(1)(b): Restricts bail by requiring (1) opportunity to prosecutor to oppose, and (2) court satisfaction of innocence and lack of reoffending risk.',
        sectionB: 'Chapter IV: Prescribes sentences (e.g. 10 to 20 years RI) imposed after full judicial trial upon conviction.'
      },
      {
        aspect: 'Application Scope',
        sectionA: 'Section 37: Invoked during pre-trial custody, remand, and bail applications.',
        sectionB: 'Chapter IV: Invoked for framing charges, determining penal liability, and final judgment sentencing.'
      }
    ],
    keyCaseLaw: [
      'State of Kerala v. Rajesh, (2020) 12 SCC 122: Section 37 twin conditions are mandatory for commercial quantity bail.',
      'Hira Singh v. Union of India, (2020) 20 SCC 272: Total mixture weight determines commercial quantity under Chapter IV and triggers Section 37.'
    ],
    authoritativeSource: 'NDPS Act, 1985 (Bare Act) — Chapter IV & Chapter V & Supreme Court of India'
  }
};
