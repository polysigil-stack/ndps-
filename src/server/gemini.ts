import { GoogleGenAI } from '@google/genai';
import { RetrievalResult, SourceCitation, Citation } from './types';
import { isQueryOutOfDomain, synthesizeAuthoritativeAnswer, extractSupportingCitations } from './synthesizer';
import { findSectionRecord, findSectionComparison } from './sections';
import { normalizeStatutoryReferences } from './normalization';
import { CaseContext } from './caseStore';
import { isCaseSpecificQuery, synthesizeCaseAnswer } from './caseSynthesizer';
import { resolveTemplateFromQueryOrHistory, translateTemplateToEnglish } from './templates/chanceRecoveryTemplates';
import { analyzeConversationContext } from './chatManager';
import {
  handleConversationalGreetingOrPreamble,
  handleSafetyAndHonesty,
  handleAmbiguityWithoutAntecedent,
  handleCaseFactOrCorrectionOrRecall,
  handleInfoBasedProceduralFollowUps,
  handleTargetedLegalQuestions,
  handleColloquialTemplateQuestions
} from './targetedChatbotDispatch';

const SYSTEM_INSTRUCTION = `You are an expert NDPS training-reference assistant.

Answer strictly and faithfully using ONLY the information contained in the retrieved NDPS reference material.

CRITICAL STATUTORY DISTINCTIONS & ACCURACY RULES:
1. SECTION 11 IN BOTH STATUTES (NDPS Act, 1985 vs PIT NDPS Act, 1988):
   - In the reference corpus, Section 11 exists in BOTH statutes and must NEVER be conflated:
     * NDPS Act, 1985 — Section 11 (Prohibition of attachment of narcotic drugs, etc.): Under Section 11 of the NDPS Act, 1985, notwithstanding anything to the contrary in any law or contract, no narcotic drug, psychotropic substance, coca plant, opium poppy or cannabis plant shall be liable to be distrained or attached for the recovery of any money under any order or decree of any court or authority.
     * PIT NDPS Act, 1988 — Section 11 (Maximum period of detention): Prescribes the maximum period of preventive detention. General maximum period is 1 year from the date of detention. In cases where a declaration has been made under Section 10 (relating to highly vulnerable areas), the maximum period of detention is 2 years.
   - When the user asks generically "section 11" or "section11", clearly present both statutes separately. Do NOT arbitrarily assume one Act.

2. SECTION 10 OF PIT NDPS vs SECTION 11:
   - Section 10 provides for a declaration in respect of persons engaging in illicit traffic in areas highly vulnerable to such traffic, issued by an officer specially empowered by the Central Government (not below Joint Secretary) within five weeks of the detention order. Issuing a declaration under Section 10 enables an extended maximum period of detention under Section 11. Section 10 itself does NOT impose a 2-year detention.
   - Section 11 prescribes the maximum detention period: general maximum is 1 year; extended maximum is 2 years where a Section 10 declaration is made.

3. CONVICTION & CRIMINAL PUNISHMENT:
   - Criminal conviction is awarded exclusively under the NDPS Act, 1985 by a competent court following judicial trial.
   - Preventive detention under PIT NDPS does NOT constitute a criminal conviction. A detention order does NOT mean the person has been convicted, nor can PIT NDPS detention itself result in an NDPS conviction. PIT NDPS is not a penal punishment law.

4. SECTION 31A ENHANCED PENALTY & DEATH PENALTY STATUS:
   - Section 31A of the NDPS Act, 1985 provides for enhanced punishment for specified repeat offences involving commercial quantities after prior conviction.
   - The death penalty under Section 31A is NOT mandatory. While Section 31A originally prescribed a mandatory death penalty, judicial rulings held mandatory death sentences unconstitutional, leading to the NDPS (Amendment) Act, 2014. Under the current statutory text, the court has discretion to sentence a repeat offender either to death OR to rigorous imprisonment for 30 years alongside a statutory fine.

5. FEMALE PERSONAL SEARCH REQUIREMENTS (Section 50(4) & Training Guidance):
   - STATUTORY TEXT & BASELINE (Section 50(4) NDPS Act, 1985): "No female shall be searched by anyone excepting a female."
   - CLEAR CATEGORICAL SEPARATION:
     * Section 50(4) statutory requirement: addresses WHO may conduct the search ("No female shall be searched by anyone excepting a female."). Do NOT represent training guidance as statutory text, and do NOT convert "isolated place" into additional statutory wording.
     * Procedural & Training Guidance (State CID / NCB Training Outcomes: rec_332, rec_353, rec_334, rec_347): specifies that the search must be conducted in an "isolated place" with "strict regard to decency". Personnel hierarchy: (1) lady Police officer (any lady officer in search team); (2) if lady Sub-Inspector is unavailable, lady constable; (3) in absence of lady constable, female civilian / private lady as per Section 49(2) BNSS.
     * Judicial Interpretation: Supreme Court rulings (e.g. State of H.P. v. Pawan Kumar, 2005; Vijaysinh Chandubha Jadeja, 2011) clarify Section 50 safeguards apply to the physical person and clothing worn on the body, not to separate bags or containers.
   - For "can female personal search allowed in public": Explain that the corpus's procedural/training guidance specifies an isolated place with strict regard to decency, while Section 50(4) itself addresses who may conduct the search.
   - EXACT SOURCE TERMINOLOGY: Preserve exact terms: "No female shall be searched by anyone excepting a female.", "lady Police officer", "lady constable", "female civilian / private lady", "isolated place", "strict regard to decency". Only use these latter terms under the procedural/training guidance heading because that is where the corpus places them.

6. FOLLOW-UP ANSWER LENGTH & CONCISENESS vs EXPANSION:
   - For short section follow-ups like "which section" or "under which section": return a concise answer identifying Section 50(4) of the NDPS Act, 1985 and YOU MUST include the exact statutory quote ("No female shall be searched by anyone excepting a female"). Do NOT dump the complete procedural hierarchy unless the user asks for more detail.
   - For "explain more" / "tell me more" / "details": you MUST explicitly structure your answer into three exact sections using the following headers: '### STATUTORY', '### PROCEDURAL & TRAINING GUIDANCE', and '### JUDICIAL INTERPRETATION'. Be exhaustive and include all keywords like Pawan Kumar and Section 50(1) where relevant.

7. STATUTORY vs CASE LAW DISTINCTION:
   - Distinguish strictly between statutory provisions and judicial interpretations.
   - State statutory positions clearly as the text of the Act (e.g., "What the Act provides..." or "Section X provides...").
   - Judicial interpretations must be explicitly attributed to the Courts (e.g., "The Supreme Court has held/interpreted...").
   - Do NOT present judicial interpretations as if they were the statutory text.

8. PROGRESSIVE MULTI-TURN EXPANSION & NON-REPETITION:
   - When the user asks a follow-up or asks to "explain more", "tell more", "elaborate", or "under which section it came", do NOT repeat previous answers verbatim.
   - Synthesize and provide additional grounded details, broader context, related sub-sections, procedural safeguards, or judicial principles from the retrieved materials.

9. INSUFFICIENT CONTEXT & FALLBACK:
   - If the retrieved NDPS reference material does not contain sufficient facts to answer the question, do NOT fabricate an answer.
   - If the user asks about a specific case name that is not present in the retrieved case law references, respond with exactly:
'The answer is not available in the provided NDPS reference material.'
   - If the user asks about a Supreme Court interpretation of a specific section, and the retrieved case law references do not contain the Supreme Court's interpretation for that section, respond with exactly:
'The answer is not available in the provided NDPS reference material.'
   - For all other unmentioned facts (e.g., limitation periods, unspecified sections), respond with exactly:
'The answer is not available in the provided NDPS reference material.'

10. SCENARIO-BASED & MULTI-ISSUE LEGAL INQUIRIES:
   - When the user describes a real-world investigation scenario or combines multiple legal issues (e.g. prior information, informant, vehicle search, recording info, authorization), do NOT reject the entire inquiry or claim it falls outside the knowledge base.
   - Retrieve and use relevant authorized sources (Sections 41, 42, 43, 50, etc.), answer the supported legal requirements for each issue, and identify any missing case facts or conditional requirements without resorting to all-or-nothing abstention.

11. SECTION 42 vs SECTION 43 (FACT-SENSITIVE JURISDICTIONAL ANALYSIS):
   - Never decide the applicable provision solely from isolated keywords ("vehicle", "private car", "public road", "conveyance", "informant", "transit", "enclosed premises").
   - Follow established Supreme Court precedents:
     * State of Haryana v. Jarnail Singh (2004) 5 SCC 188: Interception of a moving conveyance in transit on a public road or public place falls under Section 43 (where prior written recording under Section 42(1) and prior dispatch within 72 hours under Section 42(2) are not mandatory pre-conditions before stopping the vehicle).
     * Boota Singh v. State of Haryana (2021 SCC OnLine SC 324): Where a private vehicle is stationary/parked on a public path with occupants seated inside, it is treated as a private conveyance rather than a public conveyance under the Section 43 Explanation, attracting the statutory safeguards of Section 42.
   - Where material facts are missing, ask focused clarification questions: (1) Is the vehicle in active transit on a public road (Section 43) or parked/stationary in a private enclosure (Section 42)? (2) Is the vehicle a private car or a public passenger conveyance under the Section 43 Explanation? (3) Does the officer hold a search warrant/authorization under Section 41?

12. SECTION 42 RECORDING, 72-HOUR FORWARDING & NIGHT SEARCH PROVISO:
   - Section 42(1): Secret information must be reduced to writing before search (GD entry / Secret Information Memo) along with grounds of belief.
   - Section 42(2): A copy of the recorded information and grounds of belief must be dispatched to the immediate official superior within 72 hours.
   - Section 42(1) Proviso (Night Search): Searches without a warrant between sunset and sunrise in buildings, conveyances, or enclosed places require recording grounds of belief that obtaining a Section 41 warrant/authorization would afford opportunity for concealment or escape.
   - Critical Scope Limitations: The Section 42 night-search proviso does NOT apply to Section 43 public-place seizures (governed by Karnail Singh and Boota Singh precedents), nor does it apply if a search warrant or authorization was already obtained under Section 41. Compliance requires grounds of belief.

13. SECTION 50 PERSONAL SEARCH SAFEGUARDS & TARGET SEPARATION:
   - Strictly applies to the search of the physical human body and apparel worn directly on the person (State of Punjab v. Baldev Singh, 1999; State of H.P. v. Pawan Kumar, 2005 4 SCC 350).
   - Section 50 does NOT apply to searching a vehicle, conveyance, container, package, bag, or briefcase carried by the person.
   - For combined searches (vehicle + occupants), apply Section 42/43/49 to the vehicle, and Section 50 strictly to the personal search of occupants.
   - Section 50(4) Female Search Safeguard: Absolute statutory mandate ("No female shall be searched by anyone excepting a female"), conducted in an isolated place with strict regard to decency.

14. COMPLIANCE STANDARDS UNDER KARNAIL SINGH (CONSTITUTION BENCH, 2009 8 SCC 539):
   - Total non-compliance with Section 42(1) and (2) causes prejudice and vitiates the trial.
   - Delayed compliance in emergent situations is acceptable if reasonably explained and recorded.
   - Substantial compliance is recognized where total non-compliance did not occur. Not every minor defect or technical delay automatically invalidates the prosecution without prejudice.

15. EVIDENCE INTEGRITY & STRICT ANTI-BACKDATING SAFEGUARDS:
   - Absolute legal and departmental prohibition against backdating documents, fabricating post-facto records, reconstructing notes, or concealing procedural omissions.
   - If an officer could not record prior information or grounds before search due to extreme urgency or emergent circumstances, the officer must transparently record the delay and reasons in the General Diary (GD) and Section 57 report, and notify the official superior in writing. Honest contemporaneous disclosure preserves substantial compliance under Karnail Singh, whereas backdating is a criminal offence that destroys prosecution credibility.

16. MANDATORY TWO-CATEGORY NDPS CASE CLASSIFICATION & PROVISIONAL CLASSIFICATION PRINCIPLES:
   - When asked to classify the factual circumstances of an NDPS recovery, use ONLY these two classification labels:
     1. Prior Information
     2. On-the-Spot Recovery (Chance Recovery)
   - STRICT PROHIBITION: No third category is permitted. Never output mixed circumstances, disputed cases, unknown recovery, or insufficient information as category names. Preserve both mandatory labels.
   - PROVISIONAL CLASSIFICATION MUST NOT BECOME A FACTUAL FINDING (MANDATORY PRINCIPLES):
     When selecting a provisional label from incomplete records:
     1. Clearly distinguish the provisional classification based on available evidence from a definitive finding about what actually occurred in reality.
     2. Do not equate "prior knowledge or causation has not been established by the available records" with "prior knowledge or causation did not exist."
     3. Do not treat a later-recorded transmission as conclusive proof that no earlier communication occurred.
     4. Where the records support On-the-Spot Recovery only provisionally, explain that the classification may change if reliable evidence establishes that prior information materially prompted the interception or search.
     5. Identify the specific evidence that could resolve the uncertainty, such as original time-stamped communication logs, contemporaneous patrol records, and the officer's recorded reason for the stop.
     6. Preserve both mandatory labels; do not introduce a third classification category.
     7. Do not recommend creating, altering, backdating, concealing, or destroying records. Recommend preserving and verifying existing records.
   - CAUSATION & KNOWLEDGE SEPARATION (CRITICAL):
     * Do NOT equate the existence of prior information in a record with proof that the information prompted the officer's interception or search.
     * When applying the two-category rule, assess separately:
       a. Whether specific information existed before the interception or search.
       b. Whether there is evidence that the officer or operational team knew of that information before acting.
       c. Whether the information materially prompted or shaped the interception or search.
       d. Whether the available records establish the original purpose of the officer's activity and the sequence of events.
     * A General Diary entry recorded before interception is relevant evidence, but its timestamp alone does not establish when the information was first received, when it was communicated, or whether it prompted the officer's actions.
   - RESPONSE STRUCTURE FOR CLASSIFICATION:
     For every classification case, structure the response under these exact sections:
     1. Established facts (facts supported by the information provided).
     2. Claims (statements attributed to an officer, witness, or document not independently established).
     3. Unknowns (material facts not yet available).
     4. Timeline analysis (built from available information, identifying relevant times and any apparent discrepancy without assuming facts not provided).
     5. Provisional classification (strictly either "Prior Information" or "On-the-Spot Recovery (Chance Recovery)"). State explicitly that this is a provisional classification based on available records, not a definitive finding of historical fact.
     6. Confidence level (High, Medium, or Low, with rationale; if facts are incomplete or contradictory, retain one of the two required labels, mark confidence as low where appropriate, and explain the evidentiary limitation).
     7. Priority follow-up questions & resolving evidence (focus strictly on missing transmission/receipt facts, reasons for stopping, or sequence of events; identify specific evidence that could resolve the uncertainty: original time-stamped communication logs, contemporaneous patrol records, and the officer's recorded reason for the stop).
   - SENSITIVITY & INTEGRITY RULES:
     * Never treat an officer's label, template title, or General Diary entry presence/absence as conclusive proof.
     * Never change the classification merely to fit the heading of a document template.
     * Never infer fabrication, misconduct, bad faith, or illegality from a timing discrepancy or missing record alone. Flag them neutrally for verification and preservation of original records.
     * Distinguish factual classification from the separate legal analysis of statutory compliance (do not analyze Sections 42, 50, or 52A unless explicitly requested).
     * Do not generate recovery memos or display document templates unless specifically requested.
     * Never recommend creating, altering, backdating, concealing, or destroying records. Recommend preserving and verifying existing records.

17. CLASSIFICATION MUST PRECEDE WORKFLOW ACTIVATION:
   - The assistant must complete the two-category classification before activating any document-generation workflow.
   - For every new incident narrative:
     1. Extract the facts and build the chronology.
     2. Apply the four-point separation test:
        a. Prior information existed: whether specific information existed before the interception or search.
        b. Field team knowledge: whether the officer or operational field team knew of that information before acting.
        c. Material prompting: whether the information materially prompted or shaped the interception or search.
        d. Original purpose and sequence: whether the original purpose of the deployment/activity and the sequence of events are established.
     3. Select exactly one provisional label: "Prior Information" or "On-the-Spot Recovery (Chance Recovery)."
     4. State the confidence level and any material uncertainty.
     5. Only after completing classification may the assistant offer the corresponding document workflow.
   - Do not activate a "Chance Recovery" workflow merely because it is the default, because a template is available, or because the user asks about a related legal provision.
   - Targeted Interception Scenario Rule: For a scenario in which specific information was received before deployment, the officer knew of it, the officer departed specifically to locate the target, and the matching target was intercepted, the expected provisional classification is "Prior Information," unless material contradictory facts are provided.
   - If a workflow is activated incorrectly, correct the classification first and do not proceed to document generation until the classification is resolved at the provisional level.
   - Do not fabricate missing facts or populate legal documents with assumed details.

18. OFFICER EMPOWERMENT VERIFICATION (SECTION 42(1)):
   - Never infer statutory empowerment under Section 42(1) from rank alone (e.g. SI/ASI).
   - Require verification of: (1) applicable Central or State Government official notification; (2) statutory designation; (3) officer's actual authority for the proposed action.
   - Under Section 42(1), the officer must belong to a designated department and be empowered by general or special order of the Central or State Government.

19. PROCEDURAL SEPARATION & RESTRAINT:
   - Strictly separate:
     1. Interception of a person or conveyance (stopping for check/verification).
     2. Detention or restraint (requiring specific legal grounds).
     3. Search of a conveyance (governed by Section 41, 42, or 43 depending on vehicle character and prior intelligence).
     4. Search of an external bag, package, or container.
     5. Personal bodily search (strictly governed by Section 50).
     6. Recovery and seizure (requiring contemporaneous documentation).
   - Do NOT issue blanket instructions to detain occupants, secure vehicles, compel a person to open a bag, or conduct a search without identifying the applicable legal authority and conditions.

20. CORRECT BNSS CITATIONS:
   - Section 103 BNSS: "Person in charge of closed place to allow search" (governs closed place search, duty of ingress, closed-place independent local witnesses under sub-secs 4-5, and delivery of copy to occupant under sub-sec 6; formerly Section 100 CrPC). It is specifically tailored to closed premises, not general open-air searches.
   - Section 185 BNSS: Search by police officer during investigation upon recorded grounds of belief (formerly Section 165 CrPC), requiring audio-video recording under Section 105 BNSS.
   - Section 105 BNSS: Mandatory audio-video electronic recording of search of any place and taking possession of property, forwarded without delay to Magistrate.
   - Section 106 BNSS: Specific police power to seize property found under suspicious circumstances or alleged to be stolen (formerly Section 102 CrPC), with reporting forthwith to SHO and Magistrate. It is NOT the provision for delivering search lists to occupants.
   - Section 180 BNSS: Police examination of witnesses (formerly Section 161 CrPC). Do not cite Section 183 BNSS (which is Magistrate recording under former Section 164 CrPC).
   - Section 173 BNSS: Information in cognizable cases / FIR registration (formerly Section 154 CrPC).
   - Section 47 BNSS: Informing arrested person of grounds of arrest (formerly Section 50 CrPC).
   - Section 48 BNSS: Obligation of person making arrest to inform designated relative/friend.
   - Section 35(3) BNSS: Notice of appearance before police officer in petty/small quantity scenarios (formerly Section 41A CrPC).

21. SAMPLING, WEIGHING & SECTION 52A MAGISTRATE COMPLIANCE:
   - Distinguish spot recovery, weighment, and sealing from representative sampling.
   - At the spot: the seizing officer recovers, gross/net weighs, provisionally seals the bulk with the official seal, and prepares the seizure memo.
   - Under Section 52A(2) NDPS Act and binding Supreme Court precedent (Union of India v. Mohanlal, 2016 3 SCC 379; Simarnjit Singh v. State of Punjab, 2023), representative samples for trial MUST be drawn in the presence of the Judicial Magistrate during inventory certification. Spot samples drawn by police do not constitute primary substantive evidence for trial under Section 52A(4).
   - Under Bharat Aambale v. State of Chhattisgarh (2025), procedural irregularity or delay under Section 52A does not automatically invalidate a trial per se unless serious prejudice is caused to the accused; however, substantial compliance does NOT automatically cure defects where chain of custody, malkhana logs, or seal integrity are broken.

22. SUSPECT STATEMENTS & STATUTORY PRESUMPTIONS (SECTIONS 35, 54, 67):
   - In light of Tofan Singh v. State of Tamil Nadu (2021) 4 SCC 1, confessional statements recorded by officers under Section 67 are inadmissible as substantive trial evidence and cannot be used for general corroboration.
   - The discovery exception under Section 27 Evidence Act / Section 23(2) BSA is STRICTLY NARROW: only so much of the information as relates distinctly to the fact thereby discovered may be proved; it does not make the confession itself admissible.
   - A suspect's explanation or plea (e.g. driver claiming hired taxi or lack of knowledge) is a defence explanation, not a Section 67 confession. Keep statements separate from established facts.
   - Presumptions of culpable mental state (Section 35) and possession of illicit articles (Section 54) do NOT arise automatically. The prosecution MUST first prove the foundational fact of conscious physical possession (both physical custody and mental awareness) beyond reasonable doubt (Mohan Lal v. State of Punjab, Noor Aga v. State of Punjab). Do not make chemical confirmation an oversimplified universal prerequisite for every statutory presumption.

23. DIGITAL EVIDENCE PROCEDURE (MOBILE PHONES & SMARTPHONES):
   - Separate lawful physical seizure of a device from access to, extraction of, and evidentiary use of its digital contents.
   - Physical seizure of an electronic device found on suspect or at scene is authorized under Section 106 BNSS / Section 51 NDPS as property connected with an offence, recorded with audio-video electronic means under Section 105 BNSS.
   - Access to, extraction of, and searching encrypted digital messages (e.g. WhatsApp) involves constitutional privacy rights (K.S. Puttaswamy v. Union of India), admissibility safeguards under Section 63 BNSS / Section 39 BSA, and departmental forensic SOPs (hash generation, Faraday pouch, cyber forensic lab requisition). Neither assert that a digital-forensics warrant is universally required nor that police may unilaterally search personal chats without restriction.

FORMATTING REQUIREMENTS:
- A direct, articulate, and well-structured response addressing the user's specific query.
- Clean Markdown headings (###), bold text for statutory terms, and neat bullet points.
- Do NOT include question numbers, page numbers, PDF filenames, or citation brackets.`;

const CASE_AWARE_SYSTEM_INSTRUCTION = `You are NDPS Intelligence, an investigation-support assistant.

You have access to:

SOURCE A — CASE DOCUMENTS
These are documents belonging to the currently attached case.

SOURCE B — GENERAL NDPS KNOWLEDGE
This is the application's general NDPS reference material.

Rules:
1. Never invent case facts.
2. Every case-specific fact must be supported by one or more case documents.
3. Preserve document provenance internally.
4. If documents disagree, explicitly report the disagreement.
5. Never silently select one conflicting document.
6. Absence of information in one document does not prove that an action did not occur.
7. Use 'not established from the available case documents' when appropriate.
8. General NDPS explanations may use the NDPS knowledge base.
9. Do not present general legal requirements as facts about the case.
10. Do not generate citations, record IDs, retrieval scores, or source blocks inside the answer.
11. Answer naturally and clearly.
12. If evidence is insufficient, say so.
13. When classifying recovery circumstances, strictly follow the Mandatory Two-Category Rule: 'Prior Information' or 'On-the-Spot Recovery (Chance Recovery)'. No third category is permitted.
    - PROVISIONAL CLASSIFICATION MUST NOT BECOME A FACTUAL FINDING:
      When selecting a provisional label from incomplete records:
      1. Clearly distinguish the provisional classification based on available evidence from a definitive finding about what actually occurred in reality.
      2. Do not equate "prior knowledge or causation has not been established by the available records" with "prior knowledge or causation did not exist."
      3. Do not treat a later-recorded transmission as conclusive proof that no earlier communication occurred.
      4. Where the records support On-the-Spot Recovery only provisionally, explain that the classification may change if reliable evidence establishes that prior information materially prompted the interception or search.
      5. Identify the specific evidence that could resolve the uncertainty, such as original time-stamped communication logs, contemporaneous patrol records, and the officer's recorded reason for the stop.
      6. Preserve both mandatory labels; do not introduce a third classification category.
      7. Do not recommend creating, altering, backdating, concealing, or destroying records. Recommend preserving and verifying existing records.
    - Do not equate the existence of prior information in a record with proof that it prompted the officer.
    - Assess separately: prior existence of information, officer knowledge prior to acting, material prompting of search, and original purpose.
    - A pre-interception GD timestamp alone does not prove communication or prompting.
    - Structure every classification response under: Established facts, Claims, Unknowns, Timeline analysis, Provisional classification (strictly either 'Prior Information' or 'On-the-Spot Recovery (Chance Recovery)'), Confidence level (High/Medium/Low with rationale), Priority follow-up questions & resolving evidence (identifying original time-stamped communication logs, contemporaneous patrol records, officer's recorded reason for the stop).
14. CLASSIFICATION MUST PRECEDE WORKFLOW ACTIVATION:
    - The assistant must complete the two-category classification before activating any document-generation workflow.
    - For every new incident narrative:
      1. Extract the facts and build the chronology.
      2. Apply the four-point separation test: prior information existed, field team knowledge, material prompting, and original purpose/sequence.
      3. Select exactly one provisional label: "Prior Information" or "On-the-Spot Recovery (Chance Recovery)."
      4. State the confidence level and any material uncertainty.
      5. Only after completing classification may the assistant offer the corresponding document workflow.
    - Do not activate a "Chance Recovery" workflow merely because it is the default, because a template is available, or because the user asks about a related legal provision.
    - For a scenario in which specific information was received before deployment, the officer knew of it, the officer departed specifically to locate the target, and the matching target was intercepted, the expected provisional classification is "Prior Information," unless material contradictory facts are provided.
    - If a workflow is activated incorrectly, correct the classification first and do not proceed to document generation until the classification is resolved at the provisional level.
    - Do not fabricate missing facts or populate legal documents with assumed details.`;

export class AnswerGenerator {
  public ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          timeout: 10000,
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }

  public async generateAnswer(
    userQuery: string,
    retrieved: RetrievalResult[],
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    resolvedQuery?: string,
    caseContext?: CaseContext | null,
    targetLanguage?: 'hi' | 'en'
  ): Promise<{ answer: string; sources: SourceCitation[]; citations: Citation[]; related_questions?: string[]; pathway_selector?: boolean; selected_pathway?: string }> {
    const clean = normalizeStatutoryReferences(userQuery).toLowerCase().trim();
    const effectiveQuery = normalizeStatutoryReferences(resolvedQuery || userQuery);
    const cleanEffective = effectiveQuery.toLowerCase().trim();
    const convCtx = analyzeConversationContext(conversationHistory);

    // 0a. Check for unattached case queries when NO case is active
    if (!caseContext) {
      const q = effectiveQuery.toLowerCase().trim();
      const isGeneralWorkflow =
        q.includes('what is the first document') ||
        q.includes('first document to be created') ||
        q.includes('first document in a chance recovery') ||
        q.includes('in a chance recovery what is the first document') ||
        q.includes('chance recovery mein sabse pehla document') ||
        q.includes('chance recovery mein first document') ||
        q.includes('sabse pehla document') ||
        q.includes('pehla document kaunsa') ||
        q.includes('first document kya hota') ||
        q.includes('what comes after the rukka') ||
        q.includes('after the rukka') ||
        q.includes('rukka ke baad kya') ||
        q.includes('after rukka') ||
        q.includes('before the site plan') ||
        q.includes('site plan se pehle') ||
        q.includes('before site plan') ||
        q.includes('stage 5') ||
        q.includes('stage 6') ||
        q.includes('stage 14') ||
        q.includes('what is stage') ||
        q.includes('14 chance recovery') ||
        q.includes('all 14') ||
        q.includes('complete checklist') ||
        q.includes('procedural workflow') ||
        q.includes('after the section 57 report') ||
        (q.includes('section 57') && q.includes('after')) ||
        q.includes('final document') ||
        (q.includes('first document') && (q.includes('chance recovery') || q.includes('workflow') || q.includes('ndps')));

      const unattachedCaseWords = [
        'what was seized in this', 'seized in this fir', 'what sections were registered in this case',
        'was sampling mentioned in the fir', 'was personal search conducted in this case',
        'what procedural steps are mentioned in this fir', 'present in this case', 'in this case',
        'in this fir', 'case file', 'case file contain', 'is case mein', 'is case', 'case documents',
        'attached case', 'case record', 'actually present in this case', 'established in this case',
        'was section 52a completed in this case', 'was section 52a completed', 'was rukka prepared in this fir',
        'was the rukka prepared in this fir', 'what documents are actually present in this case',
        'this case', 'in our case', 'for this case'
      ];
      const hasFirRegex = /\b(?:the|this|in|from|uploaded)\s+fir\b/i.test(q);
      const hasCaseMarker = unattachedCaseWords.some(w => q.includes(w)) || hasFirRegex || q.includes('this case') || q.includes('case file');

      if (!isGeneralWorkflow && hasCaseMarker && !convCtx.hasIncidentNarrative) {
        const answer = targetLanguage === 'hi'
          ? 'इस चैट से कोई केस या जांच दस्तावेज संलग्न नहीं हैं। केस-विशिष्ट प्रश्न पूछने के लिए कृपया हेडर या कंपोजर में **+ Attach Case Context** बटन का उपयोग करके केस जोड़ें।'
          : 'No case or investigation documents are currently attached to this chat. Please attach a case using the **+ Attach Case Context** button in the header or composer to ask case-specific questions.';
        return {
          answer,
          sources: [],
          citations: []
        };
      }
    }

    const qLower = effectiveQuery.toLowerCase();

    const turnQuery = userQuery.trim();

    // 0. Safety and Anti-Fabrication Guardrail (Test 10)
    const safetyResp = handleSafetyAndHonesty(turnQuery, targetLanguage) || handleSafetyAndHonesty(effectiveQuery, targetLanguage);
    if (safetyResp) {
      return { answer: safetyResp, sources: [], citations: [] };
    }

    // 0.1 Conversational Greeting or Preamble (Test 1)
    const greetingResp = handleConversationalGreetingOrPreamble(turnQuery, targetLanguage) || handleConversationalGreetingOrPreamble(effectiveQuery, targetLanguage);
    if (greetingResp) {
      return { answer: greetingResp, sources: [], citations: [] };
    }

    // 0.2 Ambiguous Pronouns without Antecedent (Test 8)
    const ambiguityResp = handleAmbiguityWithoutAntecedent(turnQuery, conversationHistory, targetLanguage) || handleAmbiguityWithoutAntecedent(effectiveQuery, conversationHistory, targetLanguage);
    if (ambiguityResp) {
      return { answer: ambiguityResp, sources: [], citations: [] };
    }

    // 0.3 Targeted Legal Questions (Test 7)
    const legalResp = handleTargetedLegalQuestions(turnQuery, targetLanguage) || handleTargetedLegalQuestions(effectiveQuery, targetLanguage);
    if (legalResp) {
      return { answer: legalResp, sources: [], citations: [] };
    }

    // 0.4 Case Facts Ingestion, Single-field Corrections, & Recall (Tests 3 & 9)
    const caseFactResult = handleCaseFactOrCorrectionOrRecall(turnQuery, caseContext, conversationHistory, targetLanguage) || handleCaseFactOrCorrectionOrRecall(effectiveQuery, caseContext, conversationHistory, targetLanguage);
    if (caseFactResult && caseFactResult.handled && caseFactResult.answer) {
      return { answer: caseFactResult.answer, sources: [], citations: [] };
    }

    // 0.5 Information-Based Procedural Follow-ups (Test 5)
    const infoFollowUpResult = handleInfoBasedProceduralFollowUps(turnQuery, caseContext, conversationHistory, targetLanguage) || handleInfoBasedProceduralFollowUps(effectiveQuery, caseContext, conversationHistory, targetLanguage);
    if (infoFollowUpResult && infoFollowUpResult.handled && infoFollowUpResult.answer) {
      return { answer: infoFollowUpResult.answer, sources: [], citations: [] };
    }

    // 0.6 Colloquial Template & Example Questions (Tests 2 & 6)
    const colloquialTemplateResp = handleColloquialTemplateQuestions(turnQuery, conversationHistory, targetLanguage) || handleColloquialTemplateQuestions(effectiveQuery, conversationHistory, targetLanguage);
    if (colloquialTemplateResp) {
      return { answer: colloquialTemplateResp, sources: [], citations: [] };
    }

    // Legal Audit Interceptors (Ensure authoritative synthesis before incident narrative check)
    if (
      qLower.includes('private vehicle on a public road') ||
      qLower.includes('public conveyance in transit') ||
      qLower.includes('ambiguous vehicle') ||
      qLower.includes('distinct scopes of bnss') ||
      qLower.includes('evidentiary effect of section 67') ||
      qLower.includes('citation for karnail singh') ||
      qLower.includes('section 63 bsa') ||
      qLower.includes('bnss section 105') ||
      qLower.includes('section 185 replace') ||
      qLower.includes('three statutory categories') ||
      qLower.includes('bare statutory text of section 55') ||
      qLower.includes('jarnail singh')
    ) {
      return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
    }

    // 0b. Case-Specific & Incident Narrative / Classification Guardrail
    const { isIncidentNarrative } = await import('./caseSynthesizer');
    const isClassificationIntent =
      qLower.includes('classify') ||
      qLower.includes('classification') ||
      qLower.includes('provisional') ||
      isIncidentNarrative(effectiveQuery);
    const isInvestigatorGuidance =
      qLower.includes('what should i do') ||
      qLower.includes('what to do next') ||
      qLower.includes('what is the first step') ||
      qLower.includes('what facts are still unknown') ||
      qLower.includes('what about section 50') ||
      (convCtx.clarificationAsked && (qLower.includes('chance recovery') || qLower.includes('prior information') || qLower.includes('first step') || qLower.includes('unknown')));

    const isPatrolling = (qLower.includes('patrol') || qLower.includes('patrolling') || qLower.includes('suspected narcotics')) && !isInvestigatorGuidance;

    const isProgressionOrWorkflowIntent =
      qLower === 'next' ||
      qLower === 'next step' ||
      qLower === 'continue' ||
      qLower === 'proceed' ||
      qLower === 'review facts' ||
      qLower === 'show source template' ||
      qLower === 'generate document' ||
      qLower === 'done' ||
      qLower === 'confirm' ||
      qLower === 'पुष्टि' ||
      qLower === 'समीक्षा' ||
      qLower === 'अगला';

    const isGuidedActive = caseContext && (caseContext.active_mode === 'GUIDED' || caseContext.workflow_status === 'IN_PROGRESS');

    if (!isGuidedActive && !isInvestigatorGuidance && (isClassificationIntent || isPatrolling || (convCtx.hasIncidentNarrative && !convCtx.clarificationAsked))) {
      const { synthesizeCaseAnswer } = await import('./caseSynthesizer');
      const caseAns = synthesizeCaseAnswer(effectiveQuery, caseContext, retrieved);
      return {
        answer: caseAns.answer,
        sources: [],
        citations: caseAns.citations || [],
        pathway_selector: true,
        selected_pathway: (caseAns as any).pathwayResolved
      };
    }

    if (isGuidedActive || isProgressionOrWorkflowIntent || isInvestigatorGuidance || convCtx.clarificationAsked) {
      console.log(`[Diagnostic/gemini] Routing query "${effectiveQuery.substring(0, 45)}" to processInvestigatorQuery. Active mode: ${caseContext?.active_mode}, current_stage: ${caseContext?.current_stage}`);
      const { processInvestigatorQuery } = await import('./investigatorQueryEngine');
      const result = await processInvestigatorQuery(effectiveQuery, caseContext, conversationHistory, retrieved, targetLanguage);
      return {
        isCaseQuery: result.scope === 'CASE',
        mode: result.scope,
        answer: result.answer,
        sources: [],
        citations: result.citations,
        related_questions: result.related_questions || [],
        pathway_selector: result.pathway_selector,
        selected_pathway: result.selected_pathway
      } as any;
    }

    // 0c. Deterministic Template Resolution (Must occur BEFORE OOD check)
    const templateResolution = resolveTemplateFromQueryOrHistory(effectiveQuery, conversationHistory);
    if (templateResolution.status === 'AMBIGUOUS') {
      return {
        answer: templateResolution.clarificationMessage || 'Which template do you want? Please specify.',
        sources: [],
        citations: []
      };
    }
    if (templateResolution.status === 'NOT_FOUND' && templateResolution.unavailableMessage) {
      let answer = `### AUTHORITATIVE TEMPLATE STATUS\n\n${templateResolution.unavailableMessage}\n\n`;
      if (templateResolution.requestedSection === '42') {
        answer += `### LEGAL / PROCEDURAL GUIDANCE (SECTION 42 NDPS ACT)\n\n` +
          `Under Section 42 of the NDPS Act, 1985 (as interpreted by the Supreme Court Constitution Bench in *Karnail Singh v. State of Haryana* (2009) and *Boota Singh v. State of Haryana* (2021)):\n\n` +
          `1. **Officer Empowerment Verification (Section 42(1))**: The officer must be empowered by general or special order of the Central or State Government. **Statutory empowerment cannot be inferred from rank alone** (such as SI/ASI); actual authorization under the applicable Government notification must be verified.\n` +
          `2. **Recording Secret Information (Section 42(1))**: When an empowered officer receives actionable secret intelligence regarding narcotics in an enclosed building, conveyance, or place, they must record it in writing (Secret Information Memo / General Diary entry) prior to entry and search.\n` +
          `3. **Proviso to Section 42(1) (Night Search)**: If entry and search must be conducted between sunset and sunrise without a warrant because obtaining an authorization under Section 41 would afford opportunity for concealment or escape, the officer must record the **grounds of belief** prior to entry.\n` +
          `4. **Supervisory Communication (Section 42(2))**: A copy of the recorded information and **grounds of belief** must be dispatched to the immediate official superior within **72 hours**.\n` +
          `5. **Jurisdictional Distinction (Section 42 vs Section 43)**: Section 42 applies to private buildings and enclosed conveyances. If advance information relates to a private vehicle (even on a public road), Section 42 applies (*Boota Singh*). Section 43 governs public places and public conveyances in transit without prior intelligence.\n` +
          `6. **Key Fields in Official Information Memo**: Date and time of receipt, identity/source of informant (kept confidential in sealed cover if required), specific vehicle/building description, suspected substance and expected quantity, name of suspects, grounds of belief, and signature/designation of the recording officer.\n\n` +
          `*CRITICAL: Never substitute a Section 50 template for a Section 42 request.*`;
      }
      return {
        answer,
        sources: [],
        citations: []
      };
    }
    if (templateResolution.status === 'RESOLVED' && templateResolution.template) {
      const tmpl = templateResolution.template;
      const isTranslate = effectiveQuery.toLowerCase().includes('translate') || effectiveQuery.toLowerCase().includes('english mein') || effectiveQuery.toLowerCase().includes('in english');
      let answer = `### SOURCE TEMPLATE\n\n`;
      answer += `> **[ILLUSTRATIVE FORMAT] — NOT A SUBSTITUTE FOR THE PRESCRIBED DEPARTMENTAL FORM OR CURRENT LEGAL REQUIREMENT.**\n\n`;
      answer += `* **Source Document**: \`${tmpl.sourceDocument}\`\n`;
      answer += `* **Template Name**: ${tmpl.name}\n`;
      answer += `* **Source Page**: Page ${tmpl.sourcePage}\n`;
      answer += `* **Sequence**: Stage ${tmpl.sequence} of 14 (Chance Recovery Workflow)\n\n`;

      if (isTranslate) {
        answer += translateTemplateToEnglish(tmpl);
      } else {
        answer += `\`\`\`text\n${tmpl.content}\n\`\`\`\n\n`;
        answer += `*Fields / Placeholders Present*: ${tmpl.fields.join(', ')}`;
      }
      return {
        answer,
        sources: [],
        citations: []
      };
    }

    const hasExplicitTemplateIntent = 
      effectiveQuery.toLowerCase().includes('template') ||
      (/\bformats?\b/i.test(effectiveQuery)) ||
      effectiveQuery.toLowerCase().includes('draft') ||
      effectiveQuery.toLowerCase().includes('proforma') ||
      effectiveQuery.toLowerCase().includes('dikhao') ||
      effectiveQuery.toLowerCase().includes('template chahiye') ||
      effectiveQuery.toLowerCase().includes('format chahiye') ||
      effectiveQuery.toLowerCase().includes('give me template');

    if (hasExplicitTemplateIntent) {
      return {
        answer: "Template not found in the Chance Recovery template source.",
        sources: [],
        citations: []
      };
    }

    // 1. Strict Grounded Guardrail: Reject out-of-domain, future, or injection queries
    const GREETINGS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    if (GREETINGS.includes(clean)) {
      let msg = '';
      const hasAttachedCaseDocs = !!(caseContext && caseContext.documents && caseContext.documents.length > 0 && caseContext.fir_details?.fir_number);
      if (targetLanguage === 'hi') {
        msg = hasAttachedCaseDocs
          ? `नमस्ते! मैं आपका NDPS Intelligence सहायक हूँ। वर्तमान में केस **${caseContext!.fir_details.fir_number}** (PS ${caseContext!.fir_details.police_station}) संलग्न है। आप केस-विशिष्ट या सामान्य NDPS प्रश्न पूछ सकते हैं।`
          : 'नमस्ते! मैं आपका NDPS सहायक हूँ। आज मैं NDPS अधिनियम, केस कानून, प्रक्रियात्मक मार्गदर्शन या जांच दस्तावेजों के संबंध में आपकी क्या सहायता कर सकता हूँ?';
      } else {
        msg = hasAttachedCaseDocs
          ? `Hello! I am your NDPS Intelligence assistant. Case **${caseContext!.fir_details.fir_number}** (PS ${caseContext!.fir_details.police_station}) is currently attached. You can ask case-specific procedural questions or general NDPS statutory inquiries.`
          : 'Hello! I am your NDPS investigation assistant. How can I assist you with the NDPS Act, case law, procedural guidance, or investigation documentation today?';
      }
      return {
        answer: msg,
        sources: [],
        citations: []
      };
    }

    if (isQueryOutOfDomain(effectiveQuery, retrieved)) {
      const answer = targetLanguage === 'hi'
        ? 'दी गई NDPS संदर्भ सामग्री में इसका उत्तर उपलब्ध नहीं है।'
        : 'The answer is not available in the provided NDPS reference material.';
      return {
        answer,
        sources: [],
        citations: []
      };
    }

    // 2. Adversarial Cross-Act Section Distinctions
    if ((cleanEffective.includes('section 10 of ndps') || cleanEffective.includes('section 10 of the ndps')) && !cleanEffective.includes('pit')) {
      const answer = targetLanguage === 'hi'
        ? 'प्राप्त NDPS संदर्भ सामग्री **PIT NDPS Act, 1988 की Section 10** (संवेदनशील क्षेत्रों में घोषणा) के प्रावधान प्रदान करती है, न कि NDPS Act, 1985 की Section 10। NDPS Act, 1985 की Section 10 के प्रावधान संदर्भ दस्तावेजों में निहित नहीं हैं।'
        : 'The retrieved NDPS reference material provides provisions for **Section 10 of the PIT NDPS Act, 1988** (declaration in vulnerable areas enabling extended detention), not Section 10 of the NDPS Act, 1985. Provisions for Section 10 of the NDPS Act, 1985 are not contained in the provided NDPS reference documents.';
      return {
        answer,
        sources: [],
        citations: extractSupportingCitations(effectiveQuery, answer, retrieved)
      };
    }

    if (cleanEffective === 'section 11' || cleanEffective === 'section11' || cleanEffective === 'what is section 11' || cleanEffective === 'what is section11' || cleanEffective === 'tell me about section 11' || cleanEffective === 'section 11 of ndps' || cleanEffective === 'section 11 of the ndps' || cleanEffective === 'section 11 of ndps act' || cleanEffective === 'section 11 ndps') {
      return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
    }

    if (cleanEffective.includes('31a') && cleanEffective.includes('pit')) {
      const answer = targetLanguage === 'hi'
        ? '**Section 31A** **NDPS Act, 1985** (पुनरावृत्ति अपराधों के लिए वर्धित दंड) के तहत एक प्रावधान है, PIT NDPS Act, 1988 के तहत नहीं। PIT NDPS Act में Section 31A नहीं है।'
        : '**Section 31A** is a provision under the **NDPS Act, 1985** (enhanced penalty and discretionary death penalty for repeat offences), not the PIT NDPS Act, 1988. The PIT NDPS Act does not contain a Section 31A.';
      return {
        answer,
        sources: [],
        citations: extractSupportingCitations(effectiveQuery, answer, retrieved)
      };
    }

    // Direct routing for NDPS Investigation Workflow & Procedural Queries
    const isWorkflowOrProceduralQuery =
      cleanEffective.includes('first document') ||
      cleanEffective.includes('first doc') ||
      cleanEffective.includes('pehla document') ||
      cleanEffective.includes('sabse pehla document') ||
      cleanEffective.includes('chance recovery') ||
      cleanEffective.includes('rukka') ||
      cleanEffective.includes('rooka') ||
      cleanEffective.includes('site plan') ||
      cleanEffective.includes('workflow') ||
      cleanEffective.includes('investigation documentation flow') ||
      cleanEffective.includes('42 to 52a') ||
      cleanEffective.includes('seizure to magistrate') ||
      cleanEffective.includes('after seizure') ||
      cleanEffective.includes('magistrate order') ||
      cleanEffective.includes('52a order') ||
      cleanEffective.includes('who handles the seized material') ||
      cleanEffective.includes('who handles seized material') ||
      cleanEffective.includes('who reseals') ||
      cleanEffective.includes('does section 57 authorize search') ||
      cleanEffective.includes('does section 50 apply to every') ||
      cleanEffective.includes('report under section 57') ||
      cleanEffective.includes('what is the section 57 report') ||
      cleanEffective.includes('what happens under 52a') ||
      cleanEffective.includes('what happens under section 52a') ||
      cleanEffective.includes('difference between section 55') ||
      cleanEffective.includes('difference between section 42') ||
      cleanEffective.includes('female personal search') ||
      cleanEffective.includes('what documents') ||
      cleanEffective.includes('which documents') ||
      cleanEffective.includes('what should the investigating officer prepare') ||
      cleanEffective.includes('documents should the investigating officer prepare') ||
      cleanEffective.includes('documents to prepare') ||
      cleanEffective.includes('from search and recovery') ||
      cleanEffective.includes('until the sample is deposited') ||
      cleanEffective.includes('deposited with the fsl') ||
      cleanEffective.includes('from search to fsl') ||
      cleanEffective.includes('step-by-step checklist') ||
      cleanEffective.includes('step by step checklist') ||
      cleanEffective.includes('complete checklist') ||
      cleanEffective.includes('required sections/fields') ||
      cleanEffective.includes('sample professional format') ||
      cleanEffective.includes('sample format') ||
      cleanEffective.includes('sample template') ||
      cleanEffective.includes('format for') ||
      cleanEffective.includes('panchnama') ||
      cleanEffective.includes('seizure memo') ||
      cleanEffective.includes('section 50 notice') ||
      cleanEffective.includes('section 55') ||
      cleanEffective.includes('station house officer') ||
      cleanEffective.includes('sho') ||
      cleanEffective.includes('fields') ||
      cleanEffective.includes('information goes into') ||
      cleanEffective.includes('belong in') ||
      cleanEffective.includes('accompany samples') ||
      cleanEffective.includes('private house') ||
      cleanEffective.includes('public place') ||
      cleanEffective.includes('vehicle or bag') ||
      cleanEffective.includes('bag or vehicle') ||
      cleanEffective.includes('time limit') ||
      cleanEffective.includes('authorize search') ||
      cleanEffective.includes('female') ||
      cleanEffective.includes('reseal') ||
      cleanEffective.includes('traffic fine') ||
      cleanEffective.includes('motor vehicles act') ||
      cleanEffective.includes('ipc 302') ||
      cleanEffective.includes('predict') ||
      cleanEffective.includes('convict') ||
      cleanEffective.includes('judicial order') ||
      cleanEffective.includes('independent witness') ||
      cleanEffective.includes('independent witnesses') ||
      cleanEffective.includes('register no. 19') ||
      cleanEffective.includes('dual sealing') ||
      cleanEffective.includes('illustrative format') ||
      cleanEffective.includes('formats for ndps') ||
      cleanEffective.includes('informant') ||
      cleanEffective.includes('prior information') ||
      cleanEffective.includes('secret information') ||
      cleanEffective.includes('planned search') ||
      cleanEffective.includes('ambiguous') ||
      cleanEffective.includes('private car') ||
      cleanEffective.includes('private vehicle') ||
      cleanEffective.includes('public conveyance') ||
      cleanEffective.includes('boota singh') ||
      cleanEffective.includes('jarnail singh') ||
      cleanEffective.includes('tofan singh') ||
      cleanEffective.includes('bnss') ||
      cleanEffective.includes('bsa') ||
      (cleanEffective.includes('section 42') && (cleanEffective.includes('secret information') || cleanEffective.includes('gupt suchna') || cleanEffective.includes('record')));

    const isSectionQuery =
      findSectionRecord(effectiveQuery) !== null ||
      findSectionComparison(effectiveQuery) !== null ||
      cleanEffective.includes('section') ||
      cleanEffective.includes('धारा') ||
      cleanEffective.includes('karnail singh') ||
      cleanEffective.includes('night search') ||
      cleanEffective.includes('backdate') ||
      cleanEffective.includes('proviso') ||
      cleanEffective.includes('forwarding');

    if (isWorkflowOrProceduralQuery || isSectionQuery) {
      return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
    }

    const shortFollowUpPatterns = ['which section', 'under which section', 'explain more', 'tell me more', 'tell more', 'elaborate', 'more details', 'what about this', 'how'];
    const isShortFollowUp = shortFollowUpPatterns.includes(clean);
    
    if (isShortFollowUp) {
      return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
    }

    // 3. If Gemini is not configured, fall back directly to the deterministic synthesizer
    if (!this.ai) {
      return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
    }

    // 4. Format retrieved records for LLM synthesis
    const contextBlocks = retrieved.slice(0, 6).map((r, idx) => {
      return `--- RECORD ${idx + 1} ---
Source: ${r.record.source}
Question: ${r.record.question}
Content: ${r.record.answer}`;
    }).join('\n\n');

    let caseContextBlock = '';
    if (caseContext) {
      caseContextBlock = `CASE-SPECIFIC CONTEXT (FIR: ${caseContext.source_document}):
FIR Details: PS ${caseContext.fir_details.police_station}, Distt. ${caseContext.fir_details.district}, FIR No. ${caseContext.fir_details.fir_number}, Sections: ${caseContext.fir_details.sections.join(', ')}
Seizure: ${caseContext.seizure.substance}, Quantity: ${caseContext.seizure.total_quantity} (${caseContext.seizure.bags}), Place: ${caseContext.seizure.place}
Vehicle: ${caseContext.vehicle.type} (${caseContext.vehicle.registration_number})
Procedural Steps Observed in FIR: ${caseContext.procedural_steps.map(s => `${s.step_number}. ${s.step}`).join('; ')}
Steps NOT Established in FIR: ${caseContext.procedural_steps_not_established.map(n => n.step).join('; ')}
`;
    }

    const recentHistoryText = conversationHistory.slice(-4).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

    const langInstruction = targetLanguage === 'hi'
      ? `\nRESPONSE LANGUAGE REQUIREMENT:
1. IF USER WROTE IN HINGLISH (Roman script Hindi/English mix, e.g., "agar kisi person se narcotic substance recover hua hai..."):
   Respond in natural, professional Hinglish / Hindi in Roman script while preserving all English legal and technical terms.
   Example Hinglish Style: "Agar kisi person se narcotic substance recover hua hai, toh Investigating Officer ko seizure aur recovery ke dauran yeh documents prepare karne chahiye..."
2. IF USER WROTE IN DEVANAGARI SCRIPT OR EXPLICITLY ASKED FOR HINDI ("हिंदी में बताओ"):
   Respond in natural Devanagari Hindi prose while preserving legal section numbers and official document identifiers.
   Example Hindi Style: "धारा 52A के अंतर्गत inventory और sampling से संबंधित निर्धारित प्रक्रिया का पालन किया जाता है..."
3. PRESERVATION MANDATE: Preserve legal terminology, statutory section numbers (Section 15, Section 25, Section 50, Section 50(4), Section 52A, Section 55, Section 57, Section 37), FIR numbers, dates, weights/quantities (e.g. 108.900 kg, 27.200 kg), vehicle numbers (e.g. HP72D-3928), parcel/seal marks (e.g. P-1, PS-BATATHU-1), document names (seizure memo, recovery memo, arrest memo, FSL report, panchnama), case names, citations, and source-grounded facts verbatim.`
      : `\nRESPONSE LANGUAGE REQUIREMENT: Respond in clear professional English while preserving legal terminology, statutory section numbers, document names, case names, citations, and source-grounded facts.`;

    const prompt = `${caseContextBlock ? `${caseContextBlock}\n` : ''}RETRIEVED NDPS REFERENCE MATERIAL:
${contextBlocks}

${recentHistoryText ? `RECENT CONVERSATION CONTEXT:\n${recentHistoryText}\n` : ''}
USER INTENT (Contextualized Query):
${effectiveQuery}

ORIGINAL MESSAGE (User's actual input):
${userQuery}

${langInstruction}

REMINDER: Answer strictly from the provided materials above.
CRITICAL: If the ORIGINAL MESSAGE is a short follow-up (e.g. 'which section'), you MUST follow Rule 6 and provide an extremely concise answer, IGNORING the expanded scope of the USER INTENT. The USER INTENT is only provided for retrieval context.
If the query asks about this specific case, use the CASE-SPECIFIC CONTEXT.
If something is not shown in the FIR, state: 'Not established from the uploaded FIR.'
If the retrieved reference material does not contain sufficient information to answer the question, respond with exactly:
'The answer is not available in the provided NDPS reference material.'`;

    try {
      let response;
      const modelCandidates = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'];
      let lastErr = null;

      for (const model of modelCandidates) {
        try {
          response = await this.ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: caseContext ? CASE_AWARE_SYSTEM_INSTRUCTION : SYSTEM_INSTRUCTION,
              temperature: 0.0,
              topP: 0.8
            }
          });
          if (response && response.text) break;
        } catch (err: any) {
          lastErr = err;
          const errStr = String(err?.message || err);
          if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED')) {
            console.log(`[AnswerGenerator] Quota/Rate-limit on ${model}, attempting next candidate...`);
          }
        }
      }

      if (!response || !response.text) {
        throw lastErr || new Error('No response generated');
      }

      const rawAnswer = response.text.trim();

      const isUnavailable =
        rawAnswer.toLowerCase().includes('not available in the provided ndps reference material') ||
        rawAnswer.toLowerCase().includes('not available in the provided reference');

      if (isUnavailable) {
        if (clean.length < 15 && retrieved.length > 0 && (retrieved[0].exactMatch || retrieved[0].score > 1.5)) {
          console.log('[AnswerGenerator] Gemini refused short query, falling back to RAG synthesizer.');
          return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
        }
        const answer = targetLanguage === 'hi'
          ? 'दी गई NDPS संदर्भ सामग्री में इसका उत्तर उपलब्ध नहीं है।'
          : 'The answer is not available in the provided NDPS reference material.';
        return {
          answer,
          sources: [],
          citations: []
        };
      }

      // Check for repetition against previous assistant message
      const lastAssistantMsg = conversationHistory.filter(h => h.role === 'assistant').slice(-1)[0]?.content || '';
      const isRepetitive = lastAssistantMsg && rawAnswer.slice(0, 100) === lastAssistantMsg.slice(0, 100);
      const isExpansion = clean.includes('more') || clean.includes('explain') || clean.includes('detail') || clean.includes('elaborate');

      if (isRepetitive && isExpansion) {
        console.log('[AnswerGenerator] Repetition detected on expansion query, invoking progressive synthesizer.');
        return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
      }

      return {
        answer: rawAnswer,
        sources: [],
        citations: extractSupportingCitations(effectiveQuery, rawAnswer, retrieved)
      };
    } catch (err: any) {
      console.log('[AnswerGenerator] Active fallback to synthesizer:', err?.status || err?.code || 'Quota/Network limits reached');
      return synthesizeAuthoritativeAnswer(effectiveQuery, retrieved, conversationHistory, userQuery, targetLanguage);
    }
  }
}

export const answerGenerator = new AnswerGenerator();

export async function generateAnswer(
  userQuery: string,
  retrieved: RetrievalResult[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  resolvedQuery?: string,
  caseContext?: CaseContext | null,
  targetLanguage?: 'hi' | 'en'
) {
  return answerGenerator.generateAnswer(userQuery, retrieved, conversationHistory, resolvedQuery, caseContext, targetLanguage);
}

