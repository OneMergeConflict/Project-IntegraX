/**
 * IntegraX Comprehensive Legal Knowledge Base
 * Covering:
 * 1. Constitution of India (Articles, Fundamental Rights, Commercial/Contractual Provisions)
 * 2. Landmark Indian Business & Commercial Case Laws
 * 3. Commercial Statutes & Doctrines (Contract Act, Arbitration, IBC, Companies Act)
 */

export interface LegalEntry {
  id: string;
  category: "Constitution of India" | "Landmark Business Case" | "Statute & Doctrine";
  title: string;
  citationOrArticle: string;
  keywords: string[];
  summary: string;
  fullExplanation: string;
  commercialImpact: string;
  jargonTerm?: string;
  jargonDefinition?: string;
}

export const CONSTITUTIONAL_ENTRIES: LegalEntry[] = [
  {
    id: "const-art-14",
    category: "Constitution of India",
    title: "Article 14 - Equality Before Law & Prohibition of Arbitrariness",
    citationOrArticle: "Article 14, Constitution of India",
    keywords: ["article 14", "art 14", "equality before law", "arbitrariness", "equal protection", "natural justice"],
    summary: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
    fullExplanation: "Article 14 embodies the principle of non-discrimination and equality. In commercial jurisprudence (e.g., in *E.P. Royappa* and *Maneka Gandhi*), the Supreme Court established that Article 14 strikes at arbitrariness in State action. When government departments or Public Sector Undertakings (PSUs) award tenders, enter into contracts, or cancel licenses, any arbitrary, unfair, or biased conduct violates Article 14 and is subject to judicial review under Article 226/32.",
    commercialImpact: "Essential in Government procurement, PSU tenders, and concession agreements. Any capricious disqualification of a bidder can be challenged in High Court as a breach of Article 14.",
    jargonTerm: "Doctrine of Non-Arbitrariness",
    jargonDefinition: "The constitutional rule requiring government actions, including tender allocations and licensing, to be reasoned, fair, and free from whims or bias."
  },
  {
    id: "const-art-15",
    category: "Constitution of India",
    title: "Article 15 - Prohibition of Discrimination on Certain Grounds",
    citationOrArticle: "Article 15, Constitution of India",
    keywords: ["article 15", "art 15", "discrimination", "religion race caste sex", "article 15(1)", "article 15(3)", "affirmative action"],
    summary: "Prohibits the State from discriminating against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them.",
    fullExplanation: "Article 15 guarantees that no citizen shall face disability, liability, restriction, or condition regarding access to shops, public restaurants, hotels, and places of public entertainment based purely on religion, race, caste, sex, or birthplace. Clauses (3), (4), (5), and (6) permit special provisions for women, children, socially and educationally backward classes, Scheduled Castes/Tribes, and Economically Weaker Sections (EWS).\n\nIn business contexts, Article 15 guides non-discriminatory hiring principles, equal workplace accessibility, and statutory affirmative compliance in government-aided entities and educational enterprises.",
    commercialImpact: "Corporate compliance mandates that corporate policies, hiring processes, and public-facing services do not practice or facilitate prohibited discrimination. Also governs public-private enterprise partnerships with government diversity mandates.",
    jargonTerm: "Horizontal Rights",
    jargonDefinition: "Constitutional protections that apply not only against the State, but also restrain private individuals and entities regarding public access and facilities."
  },
  {
    id: "const-art-19-1-g",
    category: "Constitution of India",
    title: "Article 19(1)(g) - Freedom to Practice Any Profession, Trade or Business",
    citationOrArticle: "Article 19(1)(g) read with Article 19(6), Constitution of India",
    keywords: ["article 19", "art 19", "article 19(1)(g)", "freedom of trade", "practice profession", "carry on business", "reasonable restrictions", "trade license"],
    summary: "Guarantees all Indian citizens the fundamental right to practice any profession, or to carry on any occupation, trade, or business.",
    fullExplanation: "Article 19(1)(g) protects the entrepreneurial freedom to establish businesses, enter lawful trades, and engage in commercial enterprises across India. However, under Article 19(6), the State may impose 'reasonable restrictions' in the interests of the general public, prescribe professional qualifications, or create State monopolies in certain industries.",
    commercialImpact: "Serves as the constitutional shield against unreasonable regulatory bans, disproportionate trade licensing embargoes, and excessive executive interference in commercial operations.",
    jargonTerm: "Reasonable Restrictions (Article 19(6))",
    jargonDefinition: "Permissible limitations imposed by law on trade freedom, provided they satisfy the test of proportionality and public interest."
  },
  {
    id: "const-art-21",
    category: "Constitution of India",
    title: "Article 21 - Protection of Life and Personal Liberty",
    citationOrArticle: "Article 21, Constitution of India",
    keywords: ["article 21", "art 21", "right to life", "personal liberty", "privacy", "puttaswamy", "due process", "environmental compliance"],
    summary: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
    fullExplanation: "Article 21 has been expansively interpreted by the Supreme Court to include the Right to Privacy (*K.S. Puttaswamy v. Union of India*), Right to a Clean Environment (*M.C. Mehta*), and Right to Reputation. In business law, it underpins digital data privacy obligations (DPDP Act), environmental compliance for manufacturing industries, and occupational health and safety regulations.",
    commercialImpact: "Directly governs enterprise data collection, employee biometric processing, compliance with the Digital Personal Data Protection Act, and strict liability for industrial emissions.",
    jargonTerm: "Substantive Due Process",
    jargonDefinition: "The constitutional requirement that laws affecting liberty or rights must not only follow correct procedure, but must be just, fair, and reasonable."
  },
  {
    id: "const-art-298-299",
    category: "Constitution of India",
    title: "Article 298 & 299 - Contracts Made in the Exercise of Executive Power (Government Contracts)",
    citationOrArticle: "Articles 298 & 299, Constitution of India",
    keywords: ["article 299", "art 299", "article 298", "government contract", "psu contract", "executive power", "president of india", "governor"],
    summary: "Mandates that all contracts made in the exercise of executive power of the Union or a State must be expressed to be made by the President or the Governor.",
    fullExplanation: "Under Article 299(1), commercial contracts entered into with the Union Government or State Governments must strictly fulfill three formal conditions: (1) expressed to be made by the President/Governor, (2) executed on their behalf, and (3) executed by an authorized officer. If a contract fails to comply with Article 299, it is void and cannot be enforced against the Government, nor can the doctrine of promissory estoppel be easily invoked (*K.P. Chowdhry v. State of MP*).",
    commercialImpact: "Critical for vendors contracting with ministries, defense procurement, railways, or state infrastructure bodies. Contracts lacking formal execution under Article 299 render private contractors unable to sue for contractual damages.",
    jargonTerm: "Constitutional Formalism in Contracts",
    jargonDefinition: "The strict mandatory rule that government contracts must adhere to written constitutional formalities to be legally binding upon the State treasury."
  },
  {
    id: "const-art-300a",
    category: "Constitution of India",
    title: "Article 300A - Right to Property",
    citationOrArticle: "Article 300A, Constitution of India",
    keywords: ["article 300a", "art 300a", "right to property", "deprivation of property", "expropriation", "eminent domain"],
    summary: "No person shall be deprived of his property save by authority of law.",
    fullExplanation: "Following the 44th Constitutional Amendment (1978), the right to property ceased to be a fundamental right under Part III and became a constitutional right under Article 300A. The State cannot expropriate, seize, or acquire private corporate assets, land, intellectual property, or concessions without statutory authority and just compensation.",
    commercialImpact: "Protects corporations, foreign investors, and landowners against arbitrary state asset confiscation, arbitrary retrospective taxation, and unfair land acquisition.",
    jargonTerm: "Eminent Domain",
    jargonDefinition: "The sovereign power of the State to acquire private property for public use, subject to lawful statutory procedure and compensation."
  },
  {
    id: "const-art-301-304",
    category: "Constitution of India",
    title: "Articles 301 to 304 - Freedom of Trade, Commerce and Intercourse",
    citationOrArticle: "Part XIII, Articles 301-307, Constitution of India",
    keywords: ["article 301", "art 301", "trade commerce intercourse", "inter-state trade", "entry tax", "gst", "free flow of commerce"],
    summary: "Declares that trade, commerce, and intercourse throughout the territory of India shall be free, subject to parliamentary regulations in the public interest.",
    fullExplanation: "Part XIII ensures that India functions as a unified economic market without internal customs barriers, hostile state tariffs, or discriminatory entry levies (*Atiabari Tea Co.* and *Automobile Transport Rajasthan*). State legislatures cannot impose discriminatory taxes on goods imported from other Indian states compared to locally produced goods.",
    commercialImpact: "Foundational constitutional backing for the Goods and Services Tax (GST) framework and interstate supply chain logistics across Indian states.",
    jargonTerm: "Fiscal Barriers to Trade",
    jargonDefinition: "State taxes or tolls designed to protect domestic state manufacturers by placing out-of-state commodities at a competitive disadvantage."
  },
  {
    id: "const-art-226-32",
    category: "Constitution of India",
    title: "Articles 226 & 32 - Writ Jurisdiction & Commercial Judicial Review",
    citationOrArticle: "Articles 226 and 32, Constitution of India",
    keywords: ["article 226", "art 226", "article 32", "writ petition", "mandamus", "certiorari", "high court", "tender challenge"],
    summary: "Empowers the High Courts (Art 226) and Supreme Court (Art 32) to issue prerogative writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari).",
    fullExplanation: "In commercial litigation, Article 226 is the principal vehicle to challenge arbitrary administrative action, illegal disqualification in government tenders, cancellation of mining leases, blacklisting of vendors, or unconstitutional tax demands. The High Court examines the decision-making process to ensure fairness and adherence to natural justice.",
    commercialImpact: "The premier emergency legal remedy for private enterprises facing arbitrary blacklisting, unilateral bank guarantee invocations by state authorities, or biased tender decisions.",
    jargonTerm: "Writ of Mandamus",
    jargonDefinition: "A judicial command directing a public authority or government official to perform a mandatory statutory duty that they have refused or failed to execute."
  }
];

export const BUSINESS_CASE_ENTRIES: LegalEntry[] = [
  {
    id: "case-energy-watchdog",
    category: "Landmark Business Case",
    title: "Energy Watchdog v. Central Electricity Regulatory Commission (2017) 14 SCC 80",
    citationOrArticle: "Supreme Court of India (2017) 14 SCC 80",
    keywords: ["energy watchdog", "force majeure", "section 56", "frustration", "cerc", "coal price hike", "contract impossibility"],
    summary: "Definitive ruling on Force Majeure and Section 56 of the Indian Contract Act regarding commercial hardship and unexpected price hikes.",
    fullExplanation: "Adani Power and other power producers argued that unexpected changes in Indonesian coal export regulations increased raw material costs drastically, rendering Power Purchase Agreements (PPAs) commercially unviable. The Supreme Court held that:\n1. If a contract explicitly contains a Force Majeure clause, the clause governs under Section 32 of the Contract Act, and Section 56 (doctrine of frustration) has no application.\n2. Mere escalation of prices, abnormal rise in costs, or commercial hardship does not constitute frustration or Force Majeure. The contract must become fundamentally impossible to perform.",
    commercialImpact: "Critical precedent in all supply, EPC, and energy contracts. Parties cannot walk away from long-term supply agreements or renegotiate fixed tariffs merely because market conditions became unprofitable.",
    jargonTerm: "Doctrine of Frustration (Section 56)",
    jargonDefinition: "A common law and statutory doctrine discharging a contract when an unforeseen subsequent event renders performance legally or physically impossible, not merely financially onerous."
  },
  {
    id: "case-kailash-nath",
    category: "Landmark Business Case",
    title: "Kailash Nath Associates v. Delhi Development Authority (2015) 4 SCC 136",
    citationOrArticle: "Supreme Court of India (2015) 4 SCC 136",
    keywords: ["kailash nath", "kailash nath associates", "section 74", "liquidated damages", "forfeiture of earnest money", "dda", "proof of actual loss"],
    summary: "Authoritative decision on Section 74 of the Contract Act: Liquidated damages and forfeiture of earnest money require proof of actual loss.",
    fullExplanation: "DDA sought to forfeit an earnest money deposit of Rs. 78 lakhs after a bidder delayed payment during an auction, even though DDA later re-auctioned the land at a substantially higher price. The Supreme Court laid down that:\n1. Liquidated damages stipulated under Section 74 represent an upper ceiling of compensation.\n2. Compensation can only be awarded if damage or loss is actually suffered.\n3. Where it is possible to prove actual loss, such loss must be proved. Only where loss cannot be calculated may the court award a genuine pre-estimate.\n4. If the claiming party suffered zero loss (or actually made a profit), forfeiture or liquidated damages cannot be claimed.",
    commercialImpact: "Disallows automatic deduction of milestone delay penalties or liquidated damages unless the customer can demonstrate concrete financial loss caused by the contractor's delay.",
    jargonTerm: "Proof of Actual Loss",
    jargonDefinition: "The mandatory legal evidentiary requirement that a party claiming breach compensation must produce documentation establishing the precise financial injury suffered."
  },
  {
    id: "case-percept-dmark",
    category: "Landmark Business Case",
    title: "Percept D'Mark (India) Pvt Ltd v. Zaheer Khan (2006) 4 SCC 227",
    citationOrArticle: "Supreme Court of India (2006) 4 SCC 227",
    keywords: ["percept d'mark", "zaheer khan", "section 27", "non-compete", "restraint of trade", "right of first refusal", "post-termination covenant"],
    summary: "Supreme Court ruling that post-termination non-compete covenants are void and unenforcible under Section 27 of the Indian Contract Act.",
    fullExplanation: "Percept entered into an agreement with cricketer Zaheer Khan granting Percept a right of first refusal for future media endorsements even after the contract expired. The Supreme Court held that:\n1. Under Section 27 of the Indian Contract Act, 1872, any agreement restraining an individual from exercising a lawful profession is void.\n2. While negative covenants operating DURING the term of contract are valid (e.g. exclusive employment), any restrictive covenant extending POST-TERMINATION is contrary to public policy and void.",
    commercialImpact: "Renders standard 12-month or 24-month post-employment non-compete restrictions void against employees in India. Only reasonable non-solicitation of clients and protection of confidential trade secrets remain actionable.",
    jargonTerm: "Section 27 (Void Agreement in Restraint of Trade)",
    jargonDefinition: "Statutory provision invalidating any agreement where someone is restrained from practicing a lawful profession or business, regardless of whether the restraint is partial or absolute."
  },
  {
    id: "case-balco",
    category: "Landmark Business Case",
    title: "Bharat Aluminium Co. (BALCO) v. Kaiser Aluminium Technical Services (2012) 9 SCC 552",
    citationOrArticle: "Supreme Court of India (2012) 9 SCC 552 (Constitution Bench)",
    keywords: ["balco", "bharat aluminium", "arbitration seat", "seat vs venue", "part 1 arbitration", "foreign arbitration", "bhatia international"],
    summary: "Historic Constitution Bench ruling establishing territoriality: Indian Courts cannot intervene in foreign-seated arbitrations under Part I.",
    fullExplanation: "Overruling the controversial *Bhatia International* precedent, the 5-judge bench held that Part I of the Arbitration and Conciliation Act, 1996 only applies to arbitrations where the 'seat' is in India. If the seat is abroad (e.g., Singapore, London), Indian courts have no jurisdiction to entertain Section 9 interim measures (pre-2015) or Section 34 set-aside petitions. The 'seat' determines the curial law governing arbitral proceedings.",
    commercialImpact: "Transformed cross-border contract drafting in India. Global software and enterprise contracts now routinely designate SIAC (Singapore) or LCIA (London) as the supervisory seat to insulate awards from Indian local court delays.",
    jargonTerm: "Curial Law vs Substantive Law",
    jargonDefinition: "Substantive law governs the rights and duties of the agreement (e.g., Indian Contract Act), while curial law is the procedural law of the seat governing arbitral conduct and court supervision."
  },
  {
    id: "case-swiss-ribbons",
    category: "Landmark Business Case",
    title: "Swiss Ribbons Pvt Ltd v. Union of India (2019) 4 SCC 17",
    citationOrArticle: "Supreme Court of India (2019) 4 SCC 17",
    keywords: ["swiss ribbons", "ibc", "insolvency and bankruptcy code", "financial creditor", "operational creditor", "resolution plan", "section 29a"],
    summary: "Landmark judgment upholding the constitutional validity of the Insolvency and Bankruptcy Code, 2016 (IBC).",
    fullExplanation: "Promoters challenged the distinction between financial creditors (banks/NBFCs) and operational creditors (vendors/suppliers) under the IBC. The Supreme Court upheld the IBC in its entirety, confirming that:\n1. The primary objective of the IBC is resolution and revival of the corporate debtor, not debt liquidation.\n2. The classification between financial and operational creditors is rational and constitutional.\n3. Section 29A appropriately bars defaulting promoters from buying back distressed corporate assets at heavily discounted prices.",
    commercialImpact: "Established the creditor-in-control paradigm in Indian corporate finance. Vendors understand operational creditor status, and corporate boards prioritize debt compliance to avoid losing company control via Section 7/9 CIRP proceedings.",
    jargonTerm: "Corporate Insolvency Resolution Process (CIRP)",
    jargonDefinition: "A time-bound legal process under the IBC where management is transferred to an Insolvency Professional and a Committee of Creditors to restructure the distressed company."
  },
  {
    id: "case-vodafone",
    category: "Landmark Business Case",
    title: "Vodafone International Holdings BV v. Union of India (2012) 6 SCC 613",
    citationOrArticle: "Supreme Court of India (2012) 6 SCC 613",
    keywords: ["vodafone", "indirect transfer", "taxation", "corporate veil", "holding company", "offshore transaction", "capital gains tax"],
    summary: "Seminal ruling on offshore corporate structuring, holding company autonomy, and indirect transfer taxation.",
    fullExplanation: "Vodafone (Netherlands) acquired a Cayman Islands holding company from Hutchison Telecommunications for $11 billion, thereby acquiring a 67% interest in Hutchison Essar (India). The Indian Income Tax Department demanded over Rs. 11,000 crores in capital gains withholding tax. The Supreme Court held that:\n1. The transaction was a sale of offshore shares between two foreign entities, not a direct transfer of capital assets situated in India.\n2. Genuine corporate holding structures cannot be disregarded unless they are sham entities created solely for tax evasion.\n3. The court must 'look at' the transaction as a whole rather than 'look through' the corporate veil.",
    commercialImpact: "Pivotal precedent for cross-border M&A structuring, special purpose vehicles (SPVs), and tax predictability in foreign direct investment.",
    jargonTerm: "Look At vs Look Through Doctrine",
    jargonDefinition: "Principle in tax and corporate law where courts evaluate the commercial reality of a legitimate corporate hierarchy rather than piercing the veil without proof of fraud."
  },
  {
    id: "case-tata-cellular",
    category: "Landmark Business Case",
    title: "Tata Cellular v. Union of India (1994) 6 SCC 651",
    citationOrArticle: "Supreme Court of India (1994) 6 SCC 651",
    keywords: ["tata cellular", "government tender", "judicial review", "commercial contracts", "public procurement", "wednesbury unreasonableness"],
    summary: "Foundational landmark governing judicial review of government tenders and PSU commercial contracts in India.",
    fullExplanation: "Telecom companies challenged the Department of Telecommunications' allocation of cellular license tenders. The Supreme Court established the core principles of judicial review in government procurement:\n1. The government is free to set tender terms and select partners, provided it acts fairly and reasonably.\n2. Judicial review is not an appeal against the soundness of the decision, but a check on the fairness of the decision-making procedure.\n3. Interference is only justified if the decision suffers from arbitrariness, mala fides (bad faith), bias, or *Wednesbury unreasonableness*.",
    commercialImpact: "The bedrock citation used in every High Court writ petition challenging government tender disqualification, arbitrary RFP criteria, or procurement bid rejections.",
    jargonTerm: "Wednesbury Unreasonableness",
    jargonDefinition: "An administrative law standard where a public decision is so absurd or unreasonable that no sensible authority could ever have conceived it."
  },
  {
    id: "case-ongc-saw-pipes",
    category: "Landmark Business Case",
    title: "Oil & Natural Gas Corporation (ONGC) v. Saw Pipes Ltd (2003) 5 SCC 705",
    citationOrArticle: "Supreme Court of India (2003) 5 SCC 705",
    keywords: ["ongc", "saw pipes", "ongc v saw pipes", "liquidated damages", "pre-estimate of damages", "patent illegality", "section 34"],
    summary: "Landmark case discussing liquidated damages when actual loss cannot be proved, and 'patent illegality' as a ground to challenge arbitral awards.",
    fullExplanation: "ONGC deducted liquidated damages after Saw Pipes delayed casing pipe supplies due to a European labor strike. The Supreme Court held that where the parties genuinely agreed upon a pre-estimate of loss and the actual loss cannot be assessed mathematically (e.g. oil exploration delays impacting the nation), the contractually stipulated liquidated damages are recoverable under Section 74 without proving exact ledger loss.",
    commercialImpact: "Frequently relied upon by infrastructure employers and PSUs to enforce delay damages clauses where complex project losses cannot easily be quantified in exact invoices.",
    jargonTerm: "Patent Illegality",
    jargonDefinition: "A statutory ground under Section 34(2A) of the Arbitration Act to set aside domestic arbitral awards where an error of law is evident on the face of the award."
  }
];

export const COMMERCIAL_STATUTE_ENTRIES: LegalEntry[] = [
  {
    id: "stat-contract-sec-27",
    category: "Statute & Doctrine",
    title: "Section 27, Indian Contract Act, 1872 - Agreement in Restraint of Trade",
    citationOrArticle: "Section 27, Indian Contract Act, 1872",
    keywords: ["section 27", "sec 27", "restraint of trade", "non-compete", "non-solicitation", "employment covenant"],
    summary: "Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.",
    fullExplanation: "Unlike English law which permits reasonable restraints of trade, Section 27 is strict and absolute. Any covenant preventing an employee or business partner from practicing their profession or competing post-termination is void ab initio, except for the single statutory exception of sale of goodwill of a business. Non-solicitation covenants, however, may be enforced if drafted narrowly to protect company trade secrets and client connections.",
    commercialImpact: "Standard US-style post-employment non-compete clauses cannot be enforced in Indian jurisdictions. Employment agreements must rely on NDA confidentiality and IP assignment provisions.",
    jargonTerm: "Void Ab Initio",
    jargonDefinition: "Having no legal validity from the very beginning; null and void as if the clause never existed."
  },
  {
    id: "stat-contract-sec-56",
    category: "Statute & Doctrine",
    title: "Section 56, Indian Contract Act, 1872 - Agreement to Do Impossible Act (Frustration)",
    citationOrArticle: "Section 56, Indian Contract Act, 1872",
    keywords: ["section 56", "sec 56", "frustration", "impossible act", "force majeure", "supervening impossibility", "satyabrata ghose"],
    summary: "A contract to do an act which, after the contract is made, becomes impossible, or, by reason of some event which the promisor could not prevent, unlawful, becomes void.",
    fullExplanation: "Governs the doctrine of supervening impossibility. Laid down in *Satyabrata Ghose v. Mugneeram Bangur*, frustration occurs when an untoward event or change of circumstances beyond the contemplation of parties completely upsets the foundational basis on which the contract rested. If the contract explicitly contains a negotiated Force Majeure clause, Section 32 applies instead of Section 56.",
    commercialImpact: "Relied upon during pandemics, wartime trade embargoes, or government expropriation to extinguish contractual liability for non-performance.",
    jargonTerm: "Supervening Impossibility",
    jargonDefinition: "An unforeseen occurrence arising after the creation of a contract that makes performance physically or legally impossible without default by either party."
  },
  {
    id: "stat-contract-sec-73-74",
    category: "Statute & Doctrine",
    title: "Sections 73 & 74, Indian Contract Act - Compensation for Loss or Damage (Damages & Penalties)",
    citationOrArticle: "Sections 73 & 74, Indian Contract Act, 1872",
    keywords: ["section 73", "section 74", "sec 73", "sec 74", "damages", "liquidated damages", "penalty", "hadley v baxendale", "consequential damages"],
    summary: "Section 73 codifies compensation for direct and proximate breach loss. Section 74 governs contracts with predetermined liquidated damages or penalty stipulations.",
    fullExplanation: "Section 73 restricts recoverable damages to those which naturally arose in the usual course of things, excluding remote and indirect damages. Section 74 provides that when a contract names a sum to be paid upon breach, the party complaining of the breach is entitled to receive reasonable compensation not exceeding that amount, irrespective of whether actual damage or loss is proved.",
    commercialImpact: "Forms the legal foundation for every Limitation of Liability clause, Consequential Damages waiver, and SLA delay penalty in corporate agreements.",
    jargonTerm: "Remoteness of Damages",
    jargonDefinition: "The legal boundary that limits damages to direct, foreseeable consequences of a breach, preventing liability for speculative or unexpected downstream losses."
  },
  {
    id: "stat-arbitration-sec-8-9-11",
    category: "Statute & Doctrine",
    title: "Arbitration & Conciliation Act, 1996 - Key Commercial Sections (Sec 8, 9, 11, 34)",
    citationOrArticle: "Arbitration and Conciliation Act, 1996",
    keywords: ["arbitration act", "section 9", "section 11", "section 8", "section 34", "interim relief", "appointment of arbitrator", "setting aside award"],
    summary: "The statutory framework governing domestic and international commercial arbitrations seated in India.",
    fullExplanation: "Key provisions include:\n- Section 8: Mandatory reference to arbitration when an action is brought before a judicial authority.\n- Section 9: Urgent interim measures of protection granted by courts before or during arbitral proceedings (e.g. freezing bank guarantees or restraining asset dissipation).\n- Section 11: Court appointment of arbitrators when parties fail to agree.\n- Section 34: Restricted grounds to challenge or set aside an arbitral award (violation of public policy or patent illegality).",
    commercialImpact: "Arbitration is the primary mechanism for resolving commercial contract disputes in India due to faster disposal compared to ordinary civil courts.",
    jargonTerm: "Section 9 Interim Measure",
    jargonDefinition: "An emergency court injunction or protective order obtained prior to the constitution of the arbitral tribunal to preserve disputed assets or status quo."
  }
];

export const ALL_LEGAL_ENTRIES: LegalEntry[] = [
  ...CONSTITUTIONAL_ENTRIES,
  ...BUSINESS_CASE_ENTRIES,
  ...COMMERCIAL_STATUTE_ENTRIES,
];

/**
 * Fast search and retrieval matcher for legal queries
 */
export function queryLegalKnowledge(query: string): LegalEntry | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // 1. Direct Article match (e.g. "article 15", "what is article 14", "art 19")
  const articleRegex = /(?:article|art\.?)\s*([0-9]+(?:\([0-9a-z]+\))*)/i;
  const match = q.match(articleRegex);
  if (match) {
    const artNum = match[1].toLowerCase();
    const foundArt = CONSTITUTIONAL_ENTRIES.find((entry) =>
      entry.keywords.some((k) => k.includes(`article ${artNum}`) || k.includes(`art ${artNum}`))
    );
    if (foundArt) return foundArt;
  }

  // 2. Keyword exact containment check
  for (const entry of ALL_LEGAL_ENTRIES) {
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase())) {
        return entry;
      }
    }
  }

  // 3. Name or title partial match
  for (const entry of ALL_LEGAL_ENTRIES) {
    if (q.includes(entry.title.toLowerCase()) || q.includes(entry.citationOrArticle.toLowerCase())) {
      return entry;
    }
  }

  // 4. Token-level matching
  const words = q.split(/\s+/).filter((w) => w.length > 3);
  let bestMatch: LegalEntry | null = null;
  let highestScore = 0;

  for (const entry of ALL_LEGAL_ENTRIES) {
    let score = 0;
    for (const word of words) {
      if (entry.keywords.some((k) => k.includes(word))) score += 2;
      if (entry.title.toLowerCase().includes(word)) score += 3;
      if (entry.fullExplanation.toLowerCase().includes(word)) score += 1;
    }
    if (score > highestScore && score >= 3) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}
