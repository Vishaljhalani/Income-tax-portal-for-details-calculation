// src/data/actComparisonData.js

export const keyHighlights = [
  {
    id: 1,
    title: "Sections Reduced by ~35%",
    oldValue: "819 Sections (1961 Act)",
    newValue: "536 Sections (2025 Act)",
    description: "All alphabetical suffixes (like 80C, 10AA, 194A) removed for clean numeric sequencing.",
    tag: "Structure"
  },
  {
    id: 2,
    title: "Unified 'Tax Year'",
    oldValue: "Previous Year (PY) + Assessment Year (AY)",
    newValue: "Single 'Tax Year' (Section 3)",
    description: "Eliminates dual-year confusion. Income earned and assessed under one unified term.",
    tag: "Core Concept"
  },
  {
    id: 3,
    title: "Chapters & Schedules",
    oldValue: "47 Chapters & 14 Scattered Schedules",
    newValue: "23 Chapters & 16 Organized Schedules",
    description: "Exemptions, deductions, and rate tables shifted to dedicated Schedules (I to XVI).",
    tag: "Organization"
  },
  {
    id: 4,
    title: "TDS / TCS Consolidation",
    oldValue: "60+ Scattered TDS Sections (192–196D)",
    newValue: "3 Core Sections (Sec 392, 393 & 394)",
    description: "All non-salary TDS rates unified into structured tables under Section 393.",
    tag: "Compliance"
  }
];

export const overviewMetrics = [
  {
    parameter: "Total Chapters",
    act1961: "47 Chapters (including sub-chapters like VI-A, VI-B, XII-BA)",
    act2025: "23 Chapters (Sequential Chapters I to XXIII)",
    impact: "Fragmented sub-chapters merged into a logical, linear statutory flow."
  },
  {
    parameter: "Total Sections",
    act1961: "819 Sections (with complex suffixes like 80JJAA, 115BBH)",
    act2025: "536 Sections (Purely numeric 1 to 536; zero alphabetical suffixes)",
    impact: "Eliminates confusing sub-sections and redundant/omitted provisions."
  },
  {
    parameter: "Schedules Structure",
    act1961: "14 Schedules (Mostly administrative/procedural)",
    act2025: "16 Comprehensive Schedules (Schedules I to XVI)",
    impact: "Massive lists from old Sec 10 & Sec 80C moved to Schedules II–VIII and XV."
  },
  {
    parameter: "Tax Period Terminology",
    act1961: "Previous Year (Sec 3) & Assessment Year (Sec 2(9))",
    act2025: "Single 'Tax Year' (Sec 3) effective from April 1, 2026",
    impact: "Aligns Indian tax law with global standards and removes taxpayer confusion."
  },
  {
    parameter: "Charitable Trusts & NPOs",
    act1961: "Scattered across Sec 11, 12, 12A, 12AB, 13 & 115TD",
    act2025: "Dedicated Chapter XVII (Sections 332–355) for Registered NPOs",
    impact: "Single self-contained code governing registration, corpus, and compliance."
  },
  {
    parameter: "Drafting & Legal Language",
    act1961: "Dense prose with heavy 'Provided that' & 'Explanation' clauses",
    act2025: "Plain English, tabular matrices, and mathematical formulas",
    impact: "Reduces ambiguity, simplifies interpretation, and curtails tax litigation."
  },
  {
    parameter: "Criminal Procedure Code",
    act1961: "References to Code of Criminal Procedure (CrPC), 1973",
    act2025: "Aligned with Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023",
    impact: "Updated prosecution and Special Court procedures (Sections 498 & 521)."
  }
];

export const chapterComparison = [
  {
    category: "Core & Charge",
    topic: "Preliminary & Tax Year Definition",
    act1961Chapter: "Chapter I – Preliminary",
    act2025Chapter: "Chapter I – Preliminary",
    whatChanged: "Section 3 replaces 'Previous Year' with 'Tax Year'. Dual PY/AY terminology abolished across the entire statute.",
    practicalEffect: "Forms, notices, and returns will refer to a single Tax Year (e.g., Tax Year 2026–27)."
  },
  {
    category: "Core & Charge",
    topic: "Basis of Charge, Residence & Deemed Income",
    act1961Chapter: "Chapter II – Basis of Charge",
    act2025Chapter: "Chapter II – Basis of Charge",
    whatChanged: "Dividend income (old Sec 8) merged into Sec 7. Portuguese Civil Code (old Sec 5A) moved to Sec 10. Fund management safe harbor rules (old Sec 9A) shifted to Schedule I.",
    practicalEffect: "Cleaner charge provisions without cross-referencing scattered subsections."
  },
  {
    category: "Exemptions",
    topic: "Incomes Not Forming Part of Total Income",
    act1961Chapter: "Chapter III – Incomes Which Do Not Form Part Of Total Income",
    act2025Chapter: "Chapter III – Incomes Which Do Not Form Part of Total Income",
    whatChanged: "Bulky Section 10 dismantled into thematic Schedules (II to VIII) covering agricultural income, NRE interest, SEZs, IFSC units, and political parties.",
    practicalEffect: "Users can locate specific exemptions via dedicated Schedules rather than reading 100+ clauses of Sec 10."
  },
  {
    category: "Computation",
    topic: "Heads of Income: Salary & House Property",
    act1961Chapter: "Chapter IV – Computation of Total Income",
    act2025Chapter: "Chapter IV – Computation of Total Income",
    whatChanged: "Omitted sections 18–21 removed. Perquisites (Sec 17) and Profits in lieu of salary (Sec 18) given separate dedicated sections; Standard deduction moved to Sec 19.",
    practicalEffect: "Clear separation of salary components and house property deductions."
  },
  {
    category: "Computation",
    topic: "Profits & Gains of Business or Profession (PGBP)",
    act1961Chapter: "Chapter IV – Computation of Total Income",
    act2025Chapter: "Chapter IV – Computation of Total Income",
    whatChanged: "Resident presumptive schemes (44AD, 44ADA, 44AE) consolidated into Sec 58. Non-resident presumptive rules grouped in Sec 61. Tax audit moved to Sec 63.",
    practicalEffect: "Easier navigation for business deductions, depreciation, and disallowances."
  },
  {
    category: "Losses & Clubbing",
    topic: "Clubbing, Aggregation & Set-Off of Losses",
    act1961Chapter: "Chapter V & Chapter VI",
    act2025Chapter: "Chapter V, Chapter VI & Chapter VII",
    whatChanged: "Old Chapter VI split into two: Chapter VI handles Unexplained Credits/Investments, while Chapter VII exclusively handles Set-off & Carry Forward of Losses.",
    practicalEffect: "Clear statutory separation between unexplained income taxation and loss set-off rules."
  },
  {
    category: "Deductions & Rates",
    topic: "Deductions (Chapter VI-A) & Rebates",
    act1961Chapter: "Chapter VI-A – Deductions to be Made in Computing Total Income",
    act2025Chapter: "Chapter VIII – Deductions to be made in computing total income",
    whatChanged: "80C moved to Sec 123 (eligible list in Schedule XV), 80D to Sec 126, 80G to Sec 133, and 87A rebate to Sec 156.",
    practicalEffect: "Obsolete deductions removed; active deductions arranged sequentially."
  },
  {
    category: "Deductions & Rates",
    topic: "Special Tax Regimes, New Regime & MAT/AMT",
    act1961Chapter: "Chapter VIII – Rebates and Reliefs",
    act2025Chapter: "Chapter XIII – Determination of tax in special cases",
    whatChanged: "New Tax Regime (Sec 202), Corporate concessional rates (Sec 200/201), Capital gains tax rates, and MAT/AMT (Sec 206) unified.",
    practicalEffect: "All special rate provisions reside in one comprehensive chapter."
  },
  {
    category: "Compliance & TDS",
    topic: "TDS, TCS, Advance Tax & Penalties",
    act1961Chapter: "Chapter VI-B & Chapter VII",
    act2025Chapter: "Chapter XIX – Collection and recovery of tax",
    whatChanged: "60+ TDS sections merged into Sec 392 & 393 (Tabular). Crypto/VDA reporting added in Sec 509. Repeal & Savings in Sec 536.",
    practicalEffect: "Tabular TDS lookup reduces compliance errors; new crypto reporting increases transparency."
  }
];

export const sectionMapping = [
  { category: "Core", topic: "Definition of Tax Year / Previous Year", sec1961: "Section 3", sec2025: "Section 3", changeNote: "Replaced 'Previous Year' & 'Assessment Year' with unified 'Tax Year'" },
  { category: "Exemptions", topic: "General Exempt Incomes", sec1961: "Section 10", sec2025: "Section 11 & Schedules II–VI", changeNote: "Detailed clauses moved into structured Schedules II to VI" },
  { category: "Salary", topic: "Heads of Income", sec1961: "Section 14", sec2025: "Section 13", changeNote: "Retained all 5 heads with clean numbering" },
  { category: "Salary", topic: "Standard Deduction & Salary Deductions", sec1961: "Section 16", sec2025: "Section 19", changeNote: "Perquisites (Sec 17) & Profits in lieu (Sec 18) separated before deductions" },
  { category: "House Property", topic: "Deductions from House Property (30% & Interest)", sec1961: "Section 24", sec2025: "Section 22", changeNote: "Simplified wording for self-occupied and let-out properties" },
  { category: "Business", topic: "Depreciation Allowance", sec1961: "Section 32", sec2025: "Section 33", changeNote: "Actual cost & WDV separated into Sections 39 & 41" },
  { category: "Business", topic: "Presumptive Taxation (Business, Profession, Goods Carriages)", sec1961: "Sections 44AD, 44ADA, 44AE", sec2025: "Section 58", changeNote: "All three resident presumptive regimes consolidated into a single section" },
  { category: "Business", topic: "Compulsory Tax Audit", sec1961: "Section 44AB", sec2025: "Section 63", changeNote: "Renumbered cleanly without alphabetical suffix" },
  { category: "Capital Gains", topic: "Capital Gains Charging Provision", sec1961: "Section 45", sec2025: "Section 67", changeNote: "Renumbered" },
  { category: "Capital Gains", topic: "Capital Gain Exemption on Residential House", sec1961: "Section 54 & Section 54F", sec2025: "Section 82 & Section 86", changeNote: "Renumbered sequentially" },
  { category: "Deductions", topic: "Life Insurance, PF, ELSS, Tuition Fee Deduction", sec1961: "Section 80C", sec2025: "Section 123 & Schedule XV", changeNote: "Qualifying savings instruments listed in Schedule XV" },
  { category: "Deductions", topic: "Health Insurance & Preventive Check-up", sec1961: "Section 80D", sec2025: "Section 126", changeNote: "Renumbered" },
  { category: "Deductions", topic: "Donations to Charitable Institutions", sec1961: "Section 80G", sec2025: "Section 133", changeNote: "Renumbered" },
  { category: "Tax Rates", topic: "Rebate for Resident Individuals", sec1961: "Section 87A", sec2025: "Section 156", changeNote: "Moved to Chapter IX (Rebates and Reliefs)" },
  { category: "Tax Rates", topic: "New Tax Regime (Default Slab Regime)", sec1961: "Section 115BAC", sec2025: "Section 202", changeNote: "Consolidated in Chapter XIII (Special Cases)" },
  { category: "Tax Rates", topic: "MAT & AMT Provisions", sec1961: "Sections 115JB & 115JC", sec2025: "Section 206", changeNote: "Combined into a single unified section" },
  { category: "Compliance", topic: "Filing Return of Income & Updated Return", sec1961: "Section 139 & 139(8A)", sec2025: "Section 263 & Section 267", changeNote: "Updated return given its own independent section (Sec 267)" },
  { category: "TDS/TCS", topic: "TDS on Salary", sec1961: "Section 192", sec2025: "Section 392", changeNote: "Renumbered" },
  { category: "TDS/TCS", topic: "TDS on Non-Salary Payments (Interest, Contractor, Rent, Prof. Fee)", sec1961: "Sections 193 to 194T", sec2025: "Section 393", changeNote: "60+ sections replaced with structured rate & threshold tables" },
  { category: "TDS/TCS", topic: "Tax Collected at Source (TCS)", sec1961: "Section 206C", sec2025: "Section 394", changeNote: "Consolidated into tabular format" },
  { category: "Compliance", topic: "Interest for Late Return / Advance Tax Default", sec1961: "Sections 234A, 234B, 234C", sec2025: "Sections 423, 424, 425", changeNote: "Sequential numbering without suffixes" },
  { category: "Compliance", topic: "Crypto / Virtual Digital Asset Transaction Reporting", sec1961: "Section 285BAA", sec2025: "Section 509", changeNote: "Expanded reporting obligations for crypto-assets" }
];