import React, { useEffect, useMemo, useState } from "react";

const ACTIVE_YEARS = ["2023-24", "2024-25", "2025-26", "2026-27"];

const YEAR_OPTIONS = [
  { value: "", label: "Select Assessment Year" },
  { value: "2026-27", label: "AY 2026-27" },
  { value: "2025-26", label: "AY 2025-26" },
  { value: "2024-25", label: "AY 2024-25" },
  { value: "2023-24", label: "AY 2023-24" },
  { value: "coming-soon", label: "AY 2022-23 & Earlier - Coming Soon" },
];

const STATUS_OPTIONS = [
  {
    value: "individual_group",
    label: "Individual / HUF / AOP / BOI / Artificial Juridical Person",
  },
  {
    value: "aop_company_group",
    label: "AOP consisting only companies as members",
  },
  {
    value: "firm_llp_local",
    label: "Firm / LLP / Local Authority",
  },
  {
    value: "domestic_company",
    label: "Domestic Company",
  },
  {
    value: "foreign_company",
    label: "Foreign Company",
  },
  {
    value: "cooperative_society",
    label: "Co-operative Society",
  },
];

const REGIME_OPTIONS = [
  { value: "old", label: "Old Regime / Old Slab" },
  { value: "new", label: "New Regime / New Slab" },
];

const DOMESTIC_COMPANY_OPTIONS = [
  {
    value: "turnover_400cr_py_2020_21",
    label: "Total Turnover/Gross Receipts does not exceed ₹400 crore",
    taxRateLabel: "25%",
    thresholdTaxRate: 25,
    fixedSurchargeRate: null,
    noMarginalRelief: false,
  },
  {
    value: "section_115BA",
    label: "If opted for Section 115BA",
    taxRateLabel: "25%",
    thresholdTaxRate: 25,
    fixedSurchargeRate: null,
    noMarginalRelief: false,
  },
  {
    value: "section_115BAA",
    label: "If opted for Section 115BAA",
    taxRateLabel: "22%",
    thresholdTaxRate: 22,
    fixedSurchargeRate: 10,
    noMarginalRelief: true,
  },
  {
    value: "section_115BAB",
    label: "If opted for Section 115BAB",
    taxRateLabel: "15% for business income, 22% for other than business income",
    thresholdTaxRate: 15,
    fixedSurchargeRate: 10,
    noMarginalRelief: true,
  },
  {
    value: "any_other_domestic_company",
    label: "Any other Domestic Company",
    taxRateLabel: "30%",
    thresholdTaxRate: 30,
    fixedSurchargeRate: null,
    noMarginalRelief: false,
  },
];

const DOMESTIC_COMPANY_TURNOVER_PREVIOUS_YEARS = {
  "2023-24": "2020-21",
  "2024-25": "2021-22",
  "2025-26": "2022-23",
  "2026-27": "2023-24",
};

function getDomesticCompanyTurnoverPreviousYear(ay) {
  return DOMESTIC_COMPANY_TURNOVER_PREVIOUS_YEARS[ay] || "2020-21";
}

function getDomesticCompanyOptionLabel(item, ay) {
  if (item.value !== "turnover_400cr_py_2020_21") return item.label;

  return `Total Turnover/Gross Receipts during PY ${getDomesticCompanyTurnoverPreviousYear(
    ay
  )} does not exceed ₹400 crore`;
}

const FOREIGN_COMPANY_OPTIONS = [
  {
    value: "royalty_fts_approved_agreement",
    label:
      "Royalty/FTS from Government or Indian concern under approved old agreement",
    thresholdTaxRate: 50,
  },
  {
    value: "any_other_foreign_company_income",
    label: "Any other income",
    thresholdTaxRate: 35,
    thresholdTaxRateByAy: {
      "2023-24": 40,
      "2024-25": 40,
      "2025-26": 35,
      "2026-27": 35,
    },
  },
];

const COOPERATIVE_SOCIETY_OPTIONS = [
  {
    value: "normal_cooperative_society",
    label: "Normal Co-operative Society",
    taxRateLabel: "Normal slab rate",
    fixedSurchargeRate: null,
    noMarginalRelief: false,
  },
  {
    value: "section_115BAD",
    label: "If opted for Section 115BAD",
    taxRateLabel: "22%",
    thresholdTaxRate: 22,
    fixedSurchargeRate: 10,
    noMarginalRelief: true,
  },
  {
    value: "section_115BAE",
    label: "If opted for Section 115BAE",
    taxRateLabel: "15% for manufacturing income, 22% for other income",
    thresholdTaxRate: 15,
    fixedSurchargeRate: 10,
    noMarginalRelief: true,
    applicableFromAy: "2024-25",
  },
];

function getCooperativeSocietyAvailableOptions(ay) {
  return COOPERATIVE_SOCIETY_OPTIONS.filter(
    (item) => item.value !== "section_115BAE" || ay !== "2023-24"
  );
}

const RANGE_OPTIONS = {
  individual_group: [
    {
      key: "R50L",
      label: "₹50 lakh to ₹1 crore",
      shortLabel: "50L - 1Cr",
      thresholdIncome: 5000000,
    },
    {
      key: "R1CR",
      label: "₹1 crore to ₹2 crore",
      shortLabel: "1Cr - 2Cr",
      thresholdIncome: 10000000,
    },
    {
      key: "R2CR",
      label: "₹2 crore to ₹5 crore",
      shortLabel: "2Cr - 5Cr",
      thresholdIncome: 20000000,
    },
    {
      key: "R5CR",
      label: "Above ₹5 crore",
      shortLabel: "Above 5Cr",
      thresholdIncome: 50000000,
    },
  ],

  aop_company_group: [
    {
      key: "R50L",
      label: "₹50 lakh to ₹1 crore",
      shortLabel: "50L - 1Cr",
      thresholdIncome: 5000000,
    },
    {
      key: "R1CR",
      label: "Above ₹1 crore",
      shortLabel: "Above 1Cr",
      thresholdIncome: 10000000,
    },
  ],

  firm_llp_local: [
    {
      key: "FIRM_1CR",
      label: "Above ₹1 crore",
      shortLabel: "Above 1Cr",
      thresholdIncome: 10000000,
    },
  ],

  domestic_company: [
    {
      key: "COMPANY_1CR",
      label: "₹1 crore to ₹10 crore",
      shortLabel: "1Cr - 10Cr",
      thresholdIncome: 10000000,
    },
    {
      key: "COMPANY_10CR",
      label: "Above ₹10 crore",
      shortLabel: "Above 10Cr",
      thresholdIncome: 100000000,
    },
  ],

  foreign_company: [
    {
      key: "FOREIGN_1CR",
      label: "₹1 crore to ₹10 crore",
      shortLabel: "1Cr - 10Cr",
      thresholdIncome: 10000000,
    },
    {
      key: "FOREIGN_10CR",
      label: "Above ₹10 crore",
      shortLabel: "Above 10Cr",
      thresholdIncome: 100000000,
    },
  ],

  cooperative_society: [
    {
      key: "COOP_1CR",
      label: "₹1 crore to ₹10 crore",
      shortLabel: "1Cr - 10Cr",
      thresholdIncome: 10000000,
    },
    {
      key: "COOP_10CR",
      label: "Above ₹10 crore",
      shortLabel: "Above 10Cr",
      thresholdIncome: 100000000,
    },
  ],
};

const INDIVIDUAL_THRESHOLD_TAX = {
  "2023-24": {
    old: {
      R50L: 1312500,
      R1CR: 2812500,
      R2CR: 5812500,
      R5CR: 14812500,
    },
    new: {
      R50L: 1237500,
      R1CR: 2737500,
      R2CR: 5737500,
      R5CR: 14737500,
    },
  },

  "2024-25": {
    old: {
      R50L: 1312500,
      R1CR: 2812500,
      R2CR: 5812500,
      R5CR: 14812500,
    },
    new: {
      R50L: 1200000,
      R1CR: 2700000,
      R2CR: 5700000,
      R5CR: 14700000,
    },
  },

  "2025-26": {
    old: {
      R50L: 1312500,
      R1CR: 2812500,
      R2CR: 5812500,
      R5CR: 14812500,
    },
    new: {
      R50L: 1190000,
      R1CR: 2690000,
      R2CR: 5690000,
      R5CR: 14690000,
    },
  },

  "2026-27": {
    old: {
      R50L: 1312500,
      R1CR: 2812500,
      R2CR: 5812500,
      R5CR: 14812500,
    },
    new: {
      R50L: 1080000,
      R1CR: 2580000,
      R2CR: 5580000,
      R5CR: 14580000,
    },
  },
};

const NON_INDIVIDUAL_THRESHOLD_TAX = {
  firm_llp_local: {
    FIRM_1CR: 3000000,
  },
  domestic_company: {
    COMPANY_1CR: 3000000,
    COMPANY_10CR: 30000000,
  },
  foreign_company: {
    FOREIGN_1CR: 3500000,
    FOREIGN_10CR: 35000000,
  },
  cooperative_society: {
    COOP_1CR: 2997000,
    COOP_10CR: 29997000,
  },
};

const SURCHARGE_RULES = {
  individual_group: {
    old: {
      R50L: 10,
      R1CR: 15,
      R2CR: 25,
      R5CR: 37,
    },
    new: {
      "2023-24": {
        R50L: 10,
        R1CR: 15,
        R2CR: 25,
        R5CR: 37,
      },
      "2024-25": {
        R50L: 10,
        R1CR: 15,
        R2CR: 25,
        R5CR: 25,
      },
      "2025-26": {
        R50L: 10,
        R1CR: 15,
        R2CR: 25,
        R5CR: 25,
      },
      "2026-27": {
        R50L: 10,
        R1CR: 15,
        R2CR: 25,
        R5CR: 25,
      },
    },
  },

  aop_company_group: {
    old: {
      R50L: 10,
      R1CR: 15,
    },
    new: {
      "2023-24": {
        R50L: 10,
        R1CR: 15,
      },
      "2024-25": {
        R50L: 10,
        R1CR: 15,
      },
      "2025-26": {
        R50L: 10,
        R1CR: 15,
      },
      "2026-27": {
        R50L: 10,
        R1CR: 15,
      },
    },
  },

  firm_llp_local: {
    FIRM_1CR: 12,
  },

  domestic_company: {
    COMPANY_1CR: 7,
    COMPANY_10CR: 12,
  },

  foreign_company: {
    FOREIGN_1CR: 2,
    FOREIGN_10CR: 5,
  },

  cooperative_society: {
    COOP_1CR: 7,
    COOP_10CR: 12,
  },
};

const THRESHOLD_PREVIOUS_SURCHARGE_RATE = {
  individual_group: {
    old: {
      R50L: 0,
      R1CR: 10,
      R2CR: 15,
      R5CR: 25,
    },
    new: {
      "2023-24": {
        R50L: 0,
        R1CR: 10,
        R2CR: 15,
        R5CR: 25,
      },
      "2024-25": {
        R50L: 0,
        R1CR: 10,
        R2CR: 15,
        R5CR: 25,
      },
      "2025-26": {
        R50L: 0,
        R1CR: 10,
        R2CR: 15,
        R5CR: 25,
      },
      "2026-27": {
        R50L: 0,
        R1CR: 10,
        R2CR: 15,
        R5CR: 25,
      },
    },
  },

  aop_company_group: {
    old: {
      R50L: 0,
      R1CR: 10,
    },
    new: {
      "2023-24": {
        R50L: 0,
        R1CR: 10,
      },
      "2024-25": {
        R50L: 0,
        R1CR: 10,
      },
      "2025-26": {
        R50L: 0,
        R1CR: 10,
      },
      "2026-27": {
        R50L: 0,
        R1CR: 10,
      },
    },
  },

  firm_llp_local: {
    FIRM_1CR: 0,
  },

  domestic_company: {
    COMPANY_1CR: 0,
    COMPANY_10CR: 7,
  },

  foreign_company: {
    FOREIGN_1CR: 0,
    FOREIGN_10CR: 2,
  },

  cooperative_society: {
    COOP_1CR: 0,
    COOP_10CR: 7,
  },
};

function toNumber(value) {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function formatINR(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

function shouldShowRegime(status) {
  return status === "individual_group" || status === "aop_company_group";
}

function getAvailableRanges(status) {
  return RANGE_OPTIONS[status] || [];
}

function getRangeByKey(status, key) {
  return (RANGE_OPTIONS[status] || []).find((item) => item.key === key) || null;
}

function getDomesticCompanyOption(optionKey) {
  return (
    DOMESTIC_COMPANY_OPTIONS.find((item) => item.value === optionKey) ||
    DOMESTIC_COMPANY_OPTIONS[0]
  );
}

function getForeignCompanyOption(optionKey) {
  return (
    FOREIGN_COMPANY_OPTIONS.find((item) => item.value === optionKey) ||
    FOREIGN_COMPANY_OPTIONS[1]
  );
}

function getForeignCompanyThresholdTaxRate(optionKey, ay) {
  const selectedOption = getForeignCompanyOption(optionKey);

  if (selectedOption.thresholdTaxRateByAy) {
    return (
      selectedOption.thresholdTaxRateByAy[ay] ??
      selectedOption.thresholdTaxRate
    );
  }

  return selectedOption.thresholdTaxRate;
}

function getCooperativeSocietyOption(optionKey, ay) {
  const availableOptions = getCooperativeSocietyAvailableOptions(ay);

  return (
    availableOptions.find((item) => item.value === optionKey) ||
    availableOptions[0] ||
    COOPERATIVE_SOCIETY_OPTIONS[0]
  );
}

function getSurchargeRate({
  ay,
  status,
  regime,
  rangeKey,
  domesticCompanyOption,
  cooperativeSocietyOption,
}) {
  if (!ay || !status || !rangeKey) return 0;

  if (status === "individual_group" || status === "aop_company_group") {
    if (regime === "old") {
      return SURCHARGE_RULES[status]?.old?.[rangeKey] || 0;
    }

    return SURCHARGE_RULES[status]?.new?.[ay]?.[rangeKey] || 0;
  }

  if (status === "domestic_company") {
    const selectedDomesticCompanyOption = getDomesticCompanyOption(
      domesticCompanyOption
    );

    if (selectedDomesticCompanyOption.fixedSurchargeRate !== null) {
      return selectedDomesticCompanyOption.fixedSurchargeRate;
    }
  }

  if (status === "cooperative_society") {
    const selectedCooperativeSocietyOption = getCooperativeSocietyOption(
      cooperativeSocietyOption,
      ay
    );

    if (selectedCooperativeSocietyOption.fixedSurchargeRate !== null) {
      return selectedCooperativeSocietyOption.fixedSurchargeRate;
    }
  }

  return SURCHARGE_RULES[status]?.[rangeKey] || 0;
}

function getThresholdPreviousSurchargeRate({ ay, status, regime, rangeKey }) {
  if (!ay || !status || !rangeKey) return 0;

  if (status === "individual_group" || status === "aop_company_group") {
    if (regime === "old") {
      return THRESHOLD_PREVIOUS_SURCHARGE_RATE[status]?.old?.[rangeKey] || 0;
    }

    return THRESHOLD_PREVIOUS_SURCHARGE_RATE[status]?.new?.[ay]?.[rangeKey] || 0;
  }

  return THRESHOLD_PREVIOUS_SURCHARGE_RATE[status]?.[rangeKey] || 0;
}

function getThresholdTax({
  ay,
  status,
  regime,
  rangeKey,
  domesticCompanyOption,
  foreignCompanyOption,
  cooperativeSocietyOption,
}) {
  if (!ay || !status || !rangeKey) return 0;

  if (status === "individual_group" || status === "aop_company_group") {
    return INDIVIDUAL_THRESHOLD_TAX[ay]?.[regime]?.[rangeKey] || 0;
  }

  if (status === "domestic_company") {
    const selectedDomesticCompanyOption = getDomesticCompanyOption(
      domesticCompanyOption
    );
    const selectedRange = getRangeByKey(status, rangeKey);
    const thresholdIncome = selectedRange?.thresholdIncome || 0;

    return (
      thresholdIncome * (selectedDomesticCompanyOption.thresholdTaxRate / 100)
    );
  }

  if (status === "foreign_company") {
  const selectedRange = getRangeByKey(status, rangeKey);
  const thresholdIncome = selectedRange?.thresholdIncome || 0;

  const foreignCompanyTaxRate = getForeignCompanyThresholdTaxRate(
    foreignCompanyOption,
    ay
  );

  return thresholdIncome * (foreignCompanyTaxRate / 100);
}

  if (status === "cooperative_society") {
    const selectedCooperativeSocietyOption = getCooperativeSocietyOption(
      cooperativeSocietyOption,
      ay
    );

    if (selectedCooperativeSocietyOption.value === "normal_cooperative_society") {
      return NON_INDIVIDUAL_THRESHOLD_TAX[status]?.[rangeKey] || 0;
    }

    const selectedRange = getRangeByKey(status, rangeKey);
    const thresholdIncome = selectedRange?.thresholdIncome || 0;

    return (
      thresholdIncome *
      ((selectedCooperativeSocietyOption.thresholdTaxRate || 0) / 100)
    );
  }

  return NON_INDIVIDUAL_THRESHOLD_TAX[status]?.[rangeKey] || 0;
}

function getRangeKeyForIncome(status, income) {
  const safeIncome = Math.max(Number(income) || 0, 0);

  if (status === "individual_group") {
    if (safeIncome > 50000000) return "R5CR";
    if (safeIncome > 20000000) return "R2CR";
    if (safeIncome > 10000000) return "R1CR";
    if (safeIncome > 5000000) return "R50L";
    return "";
  }

  if (status === "aop_company_group") {
    if (safeIncome > 10000000) return "R1CR";
    if (safeIncome > 5000000) return "R50L";
    return "";
  }

  if (status === "firm_llp_local") {
    return safeIncome > 10000000 ? "FIRM_1CR" : "";
  }

  if (status === "domestic_company") {
    if (safeIncome > 100000000) return "COMPANY_10CR";
    if (safeIncome > 10000000) return "COMPANY_1CR";
    return "";
  }

  if (status === "foreign_company") {
    if (safeIncome > 100000000) return "FOREIGN_10CR";
    if (safeIncome > 10000000) return "FOREIGN_1CR";
    return "";
  }

  if (status === "cooperative_society") {
    if (safeIncome > 100000000) return "COOP_10CR";
    if (safeIncome > 10000000) return "COOP_1CR";
    return "";
  }

  return "";
}

function getSurchargeRateForIncome({
  ay,
  status,
  regime,
  income,
  domesticCompanyOption,
  cooperativeSocietyOption,
}) {
  const incomeRangeKey = getRangeKeyForIncome(status, income);

  if (!incomeRangeKey) return 0;

  return getSurchargeRate({
    ay,
    status,
    regime,
    rangeKey: incomeRangeKey,
    domesticCompanyOption,
    cooperativeSocietyOption,
  });
}


function SurchargeMarginalReliefCalculator() {
  const [assessmentYear, setAssessmentYear] = useState("2026-27");
  const [status, setStatus] = useState("individual_group");
  const [regime, setRegime] = useState("old");
  const [rangeKey, setRangeKey] = useState("R50L");
  const [domesticCompanyOption, setDomesticCompanyOption] = useState(
    "turnover_400cr_py_2020_21"
  );
  const [foreignCompanyOption, setForeignCompanyOption] = useState(
    "any_other_foreign_company_income"
  );
  const [cooperativeSocietyOption, setCooperativeSocietyOption] = useState(
    "normal_cooperative_society"
  );

  const [totalIncome, setTotalIncome] = useState("");
  const [totalTax, setTotalTax] = useState("");
  const [restrictedIncome, setRestrictedIncome] = useState("");

  const [useManualThresholdPayable, setUseManualThresholdPayable] =
    useState(false);
  const [manualThresholdPayable, setManualThresholdPayable] = useState("");

  const isComingSoon =
    assessmentYear === "coming-soon" || !ACTIVE_YEARS.includes(assessmentYear);

  const availableRanges = useMemo(() => getAvailableRanges(status), [status]);

  useEffect(() => {
    if (!availableRanges.length) {
      setRangeKey("");
      return;
    }

    const exists = availableRanges.some((item) => item.key === rangeKey);

    if (!exists) {
      setRangeKey(availableRanges[0].key);
    }
  }, [availableRanges, rangeKey]);

  useEffect(() => {
    if (!shouldShowRegime(status)) {
      setRegime("old");
    }
  }, [status]);

  useEffect(() => {
    if (status !== "cooperative_society") return;

    const availableOptions = getCooperativeSocietyAvailableOptions(
      assessmentYear
    );
    const exists = availableOptions.some(
      (item) => item.value === cooperativeSocietyOption
    );

    if (!exists) {
      setCooperativeSocietyOption(
        availableOptions[0]?.value || "normal_cooperative_society"
      );
    }
  }, [assessmentYear, status, cooperativeSocietyOption]);

  const selectedRange = getRangeByKey(status, rangeKey);
  const thresholdIncome = selectedRange?.thresholdIncome || 0;

  const selectedDomesticCompanyOption =
    status === "domestic_company"
      ? getDomesticCompanyOption(domesticCompanyOption)
      : null;

  const selectedForeignCompanyOption =
    status === "foreign_company"
      ? getForeignCompanyOption(foreignCompanyOption)
      : null;

  const availableCooperativeSocietyOptions = getCooperativeSocietyAvailableOptions(
    assessmentYear
  );

  const selectedCooperativeSocietyOption =
    status === "cooperative_society"
      ? getCooperativeSocietyOption(cooperativeSocietyOption, assessmentYear)
      : null;

  const isDomesticCompanyFixedSurcharge =
    status === "domestic_company" &&
    selectedDomesticCompanyOption?.fixedSurchargeRate !== null;

  const isCooperativeSocietyFixedSurcharge =
    status === "cooperative_society" &&
    selectedCooperativeSocietyOption?.fixedSurchargeRate !== null;

  const isFixedSurchargeWithoutMarginalRelief =
    isDomesticCompanyFixedSurcharge || isCooperativeSocietyFixedSurcharge;

  const surchargeRate = getSurchargeRate({
    ay: assessmentYear,
    status,
    regime,
    rangeKey,
    domesticCompanyOption,
    cooperativeSocietyOption,
  });

  const thresholdPreviousSurchargeRate = getThresholdPreviousSurchargeRate({
    ay: assessmentYear,
    status,
    regime,
    rangeKey,
  });

  const thresholdTax = getThresholdTax({
    ay: assessmentYear,
    status,
    regime,
    rangeKey,
    domesticCompanyOption,
    foreignCompanyOption,
    cooperativeSocietyOption,
  });

  const defaultThresholdSurcharge =
    thresholdTax * (thresholdPreviousSurchargeRate / 100);

  const defaultThresholdPayable = thresholdTax + defaultThresholdSurcharge;

  const thresholdPayable = useManualThresholdPayable
    ? toNumber(manualThresholdPayable)
    : defaultThresholdPayable;

  const shouldShowRestrictedIncomeField = surchargeRate > 15;

  const calculation = useMemo(() => {
    const income = toNumber(totalIncome);
    const tax = toNumber(totalTax);

    const restrictedIncomeAmount = Math.min(
      Math.max(toNumber(restrictedIncome), 0),
      Math.max(income, 0)
    );

    const isRestrictedSurchargeCase =
      income > 0 && tax > 0 && restrictedIncomeAmount > 0 && surchargeRate > 15;

    const otherIncome = isRestrictedSurchargeCase
      ? Math.max(income - restrictedIncomeAmount, 0)
      : income;

    const restrictedTaxPortion = isRestrictedSurchargeCase
      ? Math.min((tax * restrictedIncomeAmount) / income, tax)
      : 0;

    const normalTax = Math.max(tax - restrictedTaxPortion, 0);

    const normalSurchargeRate = isRestrictedSurchargeCase
      ? getSurchargeRateForIncome({
          ay: assessmentYear,
          status,
          regime,
          income: otherIncome,
          domesticCompanyOption,
          cooperativeSocietyOption,
        })
      : surchargeRate;

    const restrictedSurchargeRate = isRestrictedSurchargeCase
      ? Math.min(surchargeRate, 15)
      : 0;

    const normalSurcharge = normalTax * (normalSurchargeRate / 100);
    const restrictedSurcharge =
      restrictedTaxPortion * (restrictedSurchargeRate / 100);

    const surchargeBeforeRelief = normalSurcharge + restrictedSurcharge;
    const totalTaxWithSurcharge = tax + surchargeBeforeRelief;

    const balanceRemainingIncome = Math.max(income - thresholdIncome, 0);

    const excessTaxPayable = Math.max(
      totalTaxWithSurcharge - thresholdPayable,
      0
    );

    const rawMarginalRelief = excessTaxPayable - balanceRemainingIncome;

    const marginalRelief = isFixedSurchargeWithoutMarginalRelief
      ? 0
      : Math.min(Math.max(rawMarginalRelief, 0), surchargeBeforeRelief);

    const netSurcharge = Math.max(surchargeBeforeRelief - marginalRelief, 0);

    return {
      income,
      tax,
      restrictedIncomeAmount,
      otherIncome,
      restrictedTaxPortion,
      normalTax,
      normalSurchargeRate,
      restrictedSurchargeRate,
      normalSurcharge,
      restrictedSurcharge,
      surchargeBeforeRelief,
      totalTaxWithSurcharge,
      balanceRemainingIncome,
      excessTaxPayable,
      rawMarginalRelief,
      marginalRelief,
      netSurcharge,
      isRestrictedSurchargeCase,
      isMarginalReliefApplicable: marginalRelief > 0,
    };
  }, [
    totalIncome,
    totalTax,
    restrictedIncome,
    surchargeRate,
    thresholdIncome,
    thresholdPayable,
    isFixedSurchargeWithoutMarginalRelief,
    assessmentYear,
    status,
    regime,
    domesticCompanyOption,
    cooperativeSocietyOption,
  ]);

  const canCalculate =
    !isComingSoon &&
    assessmentYear &&
    status &&
    rangeKey &&
    thresholdIncome > 0 &&
    surchargeRate > 0;

  function resetCalculator() {
    setAssessmentYear("2026-27");
    setStatus("individual_group");
    setRegime("old");
    setRangeKey("R50L");
    setDomesticCompanyOption("turnover_400cr_py_2020_21");
    setForeignCompanyOption("any_other_foreign_company_income");
    setCooperativeSocietyOption("normal_cooperative_society");
    setTotalIncome("");
    setTotalTax("");
    setRestrictedIncome("");
    setUseManualThresholdPayable(false);
    setManualThresholdPayable("");
  }

  return (
    <div className="surcharge-page">
      <style>{styles}</style>

      <div className="surcharge-shell">
        <header className="hero-card">
          <div>
            <p className="eyebrow">Income Tax Utility</p>
            <h1>Surcharge & Marginal Relief Calculator</h1>
            <p className="hero-text">
              AY-wise aur status-wise rules ke आधार par surcharge, marginal
              relief aur net surcharge calculate karein.
            </p>
          </div>

          <div className="hero-badge">
            <span>Active AY</span>
            <strong>2023-24 to 2026-27</strong>
          </div>
        </header>

        <main className="calculator-grid">
          <section className="input-panel">
            <div className="section-title">
              <span className="step-count">1</span>
              <div>
                <h2>Basic Selection</h2>
                <p>Assessment year aur status select karein.</p>
              </div>
            </div>

            <div className="form-grid two">
              <label className="field">
                <span>Assessment Year</span>
                <select
                  value={assessmentYear}
                  onChange={(e) => setAssessmentYear(e.target.value)}
                >
                  {YEAR_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {isComingSoon ? (
              <div className="coming-card">
                <h3>Coming soon...</h3>
                <p>
                  Abhi calculation sirf AY 2023-24, AY 2024-25, AY 2025-26 aur
                  AY 2026-27 ke liye active hai.
                </p>
              </div>
            ) : (
              <>
                {shouldShowRegime(status) && (
                  <div className="regime-row">
                    {REGIME_OPTIONS.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        className={`pill-btn ${
                          regime === item.value ? "active" : ""
                        }`}
                        onClick={() => setRegime(item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}

                {!shouldShowRegime(status) && (
                  <div className="info-strip">
                    Selected status ke liye old/new regime option required nahi
                    hai. Status-wise surcharge rule apply hoga.
                  </div>
                )}

                {status === "domestic_company" && (
                  <div className="domestic-company-card">
                    <label className="field">
                      <span>Domestic Company Tax Option</span>
                      <select
                        value={domesticCompanyOption}
                        onChange={(e) =>
                          setDomesticCompanyOption(e.target.value)
                        }
                      >
                        {DOMESTIC_COMPANY_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {getDomesticCompanyOptionLabel(
                              item,
                              assessmentYear
                            )}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div
                      className={`company-rule-note ${
                        selectedDomesticCompanyOption?.noMarginalRelief
                          ? "fixed"
                          : ""
                      }`}
                    >
                      <span>
                        Tax Rate:{" "}
                        <strong>
                          {selectedDomesticCompanyOption?.taxRateLabel}
                        </strong>
                      </span>
                      {selectedDomesticCompanyOption?.value ===
                        "turnover_400cr_py_2020_21" && (
                        <p>
                          Turnover/Gross Receipts check is for PY {getDomesticCompanyTurnoverPreviousYear(
                            assessmentYear
                          )} as per selected AY.
                        </p>
                      )}
                      {selectedDomesticCompanyOption?.noMarginalRelief && (
                        <p>
                          Surcharge fixed 10% under selected option. Marginal
                          relief not applicable.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {status === "foreign_company" && (
                  <div className="domestic-company-card">
                    <label className="field">
                      <span>Foreign Company Tax Option</span>
                      <select
                        value={foreignCompanyOption}
                        onChange={(e) => setForeignCompanyOption(e.target.value)}
                      >
                        {FOREIGN_COMPANY_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="company-rule-note">
                      <span>
                        Tax Rate:{" "}
<strong>
  {getForeignCompanyThresholdTaxRate(
    foreignCompanyOption,
    assessmentYear
  )}
  %
</strong>
                      </span>
                      <p>
                        Surcharge: 2% above ₹1 crore up to ₹10 crore, and 5% above ₹10 crore. Marginal relief applicable.
                      </p>
                    </div>
                  </div>
                )}

                {status === "cooperative_society" && (
                  <div className="domestic-company-card">
                    <label className="field">
                      <span>Co-operative Society Tax Option</span>
                      <select
                        value={cooperativeSocietyOption}
                        onChange={(e) =>
                          setCooperativeSocietyOption(e.target.value)
                        }
                      >
                        {availableCooperativeSocietyOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div
                      className={`company-rule-note ${
                        selectedCooperativeSocietyOption?.noMarginalRelief
                          ? "fixed"
                          : ""
                      }`}
                    >
                      <span>
                        Tax Rate: <strong>{selectedCooperativeSocietyOption?.taxRateLabel}</strong>
                      </span>
                      {assessmentYear === "2023-24" && (
                        <p>
                          AY 2023-24 me Section 115BAE option applicable nahi hai.
                        </p>
                      )}
                      {selectedCooperativeSocietyOption?.noMarginalRelief && (
                        <p>
                          Surcharge fixed 10% under selected option. Marginal
                          relief not applicable.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="section-title mt">
                  <span className="step-count">2</span>
                  <div>
                    <h2>Marginal Relief Calculation</h2>
                    <p>Income range / surcharge threshold select karein.</p>
                  </div>
                </div>

                <div className="range-tabs">
                  {availableRanges.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`range-tab ${
                        rangeKey === item.key ? "active" : ""
                      }`}
                      onClick={() => setRangeKey(item.key)}
                    >
                      <strong>{item.shortLabel}</strong>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="section-title mt">
                  <span className="step-count">3</span>
                  <div>
                    <h2>Computation of Total Income</h2>
                    <p>Total income aur total tax client manually enter karega.</p>
                  </div>
                </div>

                <div className="form-grid two">
                  <label className="field">
                    <span>Total Income</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Example: 2,00,50,000"
                      value={totalIncome}
                      onChange={(e) => setTotalIncome(e.target.value)}
                    />
                  </label>

                  <label className="field">
                    <span>Total Tax before Surcharge</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Example: 58,27,500"
                      value={totalTax}
                      onChange={(e) => setTotalTax(e.target.value)}
                    />
                  </label>
                </div>

                {shouldShowRestrictedIncomeField && (
                  <div className="form-grid two mt-small">
                    <label className="field">
                      <span>Dividend / 111A / 112 / 112A Income</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Example: 10,00,000"
                        value={restrictedIncome}
                        onChange={(e) => setRestrictedIncome(e.target.value)}
                      />
                      <small className="field-help">
                        Sirf income amount enter karein. Is income par enhanced
                        surcharge 25% / 37% apply nahi hoga; max 15% rate apply
                        hoga. Blank/zero hone par normal calculation same rahegi.
                      </small>
                    </label>
                  </div>
                )}

                <div className="computed-box compact-four">
                  <div>
                    <span>Normal / Other Tax Portion</span>
                    <strong>{formatINR(calculation.normalTax)}</strong>
                  </div>
                  <div>
                    <span>Restricted Tax Portion</span>
                    <strong>{formatINR(calculation.restrictedTaxPortion)}</strong>
                  </div>
                  <div>
                    <span>Surcharge before MMR</span>
                    <strong>{formatINR(calculation.surchargeBeforeRelief)}</strong>
                  </div>
                  <div>
                    <span>Total Tax with Surcharge</span>
                    <strong>{formatINR(calculation.totalTaxWithSurcharge)}</strong>
                  </div>
                </div>

                <div className="section-title mt">
                  <span className="step-count">4</span>
                  <div>
                    <h2>Calculate Tax up to Threshold</h2>
                    <p>
                      Threshold tax ke sath previous slab surcharge include hai.
                    </p>
                  </div>
                </div>

                <div className="threshold-card">
                  <div className="threshold-line">
                    <span>Total Income up to Threshold</span>
                    <strong>{formatINR(thresholdIncome)}</strong>
                  </div>

                  <div className="threshold-line">
                    <span>Tax on Threshold Income</span>
                    <strong>{formatINR(thresholdTax)}</strong>
                  </div>

                  <div className="threshold-line">
                    <span>
                      Previous Slab Surcharge @{thresholdPreviousSurchargeRate}%
                    </span>
                    <strong>{formatINR(defaultThresholdSurcharge)}</strong>
                  </div>

                  <div className="threshold-line highlight">
                    <span>Tax Payable on Threshold including Surcharge</span>
                    <strong>{formatINR(thresholdPayable)}</strong>
                  </div>

                  <label className="toggle-row compact">
                    <input
                      type="checkbox"
                      checked={useManualThresholdPayable}
                      onChange={(e) =>
                        setUseManualThresholdPayable(e.target.checked)
                      }
                    />
                    <span>Threshold payable manually override karna hai</span>
                  </label>

                  {useManualThresholdPayable && (
                    <label className="field mt-small">
                      <span>
                        Manual Tax Payable on Threshold including Surcharge
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter threshold payable amount"
                        value={manualThresholdPayable}
                        onChange={(e) =>
                          setManualThresholdPayable(e.target.value)
                        }
                      />
                    </label>
                  )}
                </div>
              </>
            )}
          </section>

          <aside className="result-panel">
            <div className="result-card sticky">
              <div className="result-header">
                <p>Final Output</p>
                <h2>Marginal Relief Result</h2>
              </div>

              {!canCalculate ? (
                <div className="empty-result">
                  <h3>Calculation not available</h3>
                  <p>
                    Assessment year, status, income range aur values select karne
                    ke baad result yaha show hoga.
                  </p>
                </div>
              ) : (
                <>
                  <div className="summary-pill">
                    <span>Selected Case</span>
                    <strong>
                      AY {assessmentYear} /{" "}
                      {status === "domestic_company"
                        ? selectedDomesticCompanyOption?.label
                        : status === "foreign_company"
                        ? selectedForeignCompanyOption?.label
                        : status === "cooperative_society"
                        ? selectedCooperativeSocietyOption?.label
                        : shouldShowRegime(status)
                        ? regime === "old"
                          ? "Old Regime"
                          : "New Regime"
                        : "Status Rule"}
                    </strong>
                  </div>

                  <div className="result-list">

                    <div className="result-row">
                      <span>Current Surcharge Rate</span>
                      <strong>{surchargeRate}%</strong>
                    </div>

                    {isDomesticCompanyFixedSurcharge && (
                      <div className="result-note">
                        Section 115BAA / 115BAB: 10% surcharge fixed. Marginal
                        relief not applicable.
                      </div>
                    )}

                    {isCooperativeSocietyFixedSurcharge && (
                      <div className="result-note">
                        Section 115BAD / 115BAE: 10% surcharge fixed. Marginal
                        relief not applicable.
                      </div>
                    )}

                    <div className="result-row">
                      <span>
                        Normal / Other Surcharge @{calculation.normalSurchargeRate}%
                      </span>
                      <strong>{formatINR(calculation.normalSurcharge)}</strong>
                    </div>

                    {calculation.isRestrictedSurchargeCase && (
                      <div className="result-row">
                        <span>
                          Dividend / 111A / 112 / 112A Surcharge @
                          {calculation.restrictedSurchargeRate}%
                        </span>
                        <strong>
                          {formatINR(calculation.restrictedSurcharge)}
                        </strong>
                      </div>
                    )}

                    <div className="result-row">
                      <span>Surcharge before Marginal Relief</span>
                      <strong>
                        {formatINR(calculation.surchargeBeforeRelief)}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Total Tax with Surcharge</span>
                      <strong>
                        {formatINR(calculation.totalTaxWithSurcharge)}
                      </strong>
                    </div>

                    <div className="result-row strong-row">
                      <span>Threshold Tax Payable</span>
                      <strong>{formatINR(thresholdPayable)}</strong>
                    </div>
                  </div>

                  <div className="mini-heading">Excess Tax Payable</div>

                  <div className="result-list">
                    <div className="result-row">
                      <span>Excess Tax Payable</span>
                      <strong>{formatINR(calculation.excessTaxPayable)}</strong>
                    </div>

                    <div className="result-row">
                      <span>Balance Remaining Income</span>
                      <strong>
                        {formatINR(calculation.balanceRemainingIncome)}
                      </strong>
                    </div>
                  </div>

                  <div className="mini-heading">Marginal Relief</div>

                  <div
                    className={`relief-box ${
                      calculation.isMarginalReliefApplicable ? "yes" : "no"
                    }`}
                  >
                    <span>
                      {calculation.isMarginalReliefApplicable
                        ? "MMR Applicable"
                        : "MMR Not Applicable"}
                    </span>
                    <strong>{formatINR(calculation.marginalRelief)}</strong>
                  </div>

                  <div className="net-card">
                    <span>Net Surcharge Amount</span>
                    <strong>{formatINR(calculation.netSurcharge)}</strong>
                    <p>
                      Net Surcharge = Surcharge before MMR − Marginal Relief
                    </p>
                  </div>

                  <div className="working-note">
                    <strong>Formula Used:</strong>
                    <p>
                      {isDomesticCompanyFixedSurcharge
                        ? "Selected Domestic Company option me surcharge 10% fixed hai aur marginal relief apply nahi hota."
                        : isCooperativeSocietyFixedSurcharge
                        ? "Selected Co-operative Society option me surcharge 10% fixed hai aur marginal relief apply nahi hota."
                        : calculation.isRestrictedSurchargeCase
                        ? "Dividend / 111A / 112 / 112A income enter hone par restricted income ke tax portion par max 15% surcharge apply hota hai. Balance tax portion par rate Total Income se nahi, restricted income hataane ke baad bachi income ke slab se decide hota hai. Marginal relief ka existing formula same rakha gaya hai."
                        : "Normal income mode me tax before surcharge par applicable surcharge rate apply hota hai. Blank/zero restricted income hone par existing normal income calculation same rahegi. Marginal relief ka existing formula same rakha gaya hai."}
                    </p>
                  </div>
                </>
              )}

              <button
                type="button"
                className="reset-btn"
                onClick={resetCalculator}
              >
                Reset Calculator
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

const styles = `
  .surcharge-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(37, 99, 235, 0.35), transparent 32%),
      radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.18), transparent 34%),
      linear-gradient(135deg, #020617 0%, #0f172a 42%, #111827 100%);
    color: #e5e7eb;
    padding: 28px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .surcharge-shell {
    max-width: 1320px;
    margin: 0 auto;
  }

  .hero-card {
    display: flex;
    justify-content: space-between;
    gap: 22px;
    align-items: center;
    background: rgba(15, 23, 42, 0.82);
    border: 1px solid rgba(148, 163, 184, 0.22);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
    border-radius: 28px;
    padding: 28px;
    backdrop-filter: blur(18px);
    margin-bottom: 22px;
  }

  .eyebrow {
    margin: 0 0 8px;
    color: #38bdf8;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .hero-card h1 {
    margin: 0;
    font-size: clamp(28px, 4vw, 46px);
    line-height: 1.05;
    color: #f8fafc;
    letter-spacing: -0.04em;
  }

  .hero-text {
    margin: 14px 0 0;
    color: #cbd5e1;
    max-width: 780px;
    font-size: 15px;
    line-height: 1.7;
  }

  .hero-badge {
    min-width: 220px;
    border-radius: 22px;
    padding: 18px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(14, 165, 233, 0.12));
    border: 1px solid rgba(56, 189, 248, 0.25);
  }

  .hero-badge span {
    display: block;
    color: #93c5fd;
    font-size: 13px;
    margin-bottom: 6px;
  }

  .hero-badge strong {
    color: #ffffff;
    font-size: 20px;
  }

  .calculator-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.75fr);
    gap: 22px;
    align-items: start;
  }

  .input-panel,
  .result-card {
    background: rgba(15, 23, 42, 0.78);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 28px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(18px);
  }

  .input-panel {
    padding: 24px;
  }

  .result-card {
    padding: 22px;
  }

  .sticky {
    position: sticky;
    top: 22px;
  }

  .section-title {
    display: flex;
    gap: 13px;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .section-title.mt {
    margin-top: 30px;
  }

  .step-count {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2563eb, #0ea5e9);
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 900;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
    flex: 0 0 auto;
  }

  .section-title h2 {
    margin: 0;
    color: #f8fafc;
    font-size: 21px;
    letter-spacing: -0.02em;
  }

  .section-title p {
    margin: 4px 0 0;
    color: #94a3b8;
    font-size: 14px;
  }

  .form-grid {
    display: grid;
    gap: 16px;
  }

  .form-grid.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field {
    display: grid;
    gap: 8px;
  }

  .field span {
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 800;
  }

  .field input,
  .field select {
    width: 100%;
    border: 1px solid rgba(148, 163, 184, 0.24);
    outline: none;
    border-radius: 16px;
    background: rgba(2, 6, 23, 0.58);
    color: #f8fafc;
    padding: 14px 15px;
    font-size: 15px;
    transition: 0.2s ease;
  }

  .field select {
    cursor: pointer;
  }

  .field input:focus,
  .field select:focus {
    border-color: rgba(56, 189, 248, 0.75);
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
  }

  .field input::placeholder {
    color: #64748b;
  }

  .regime-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 18px;
  }

  .pill-btn,
  .range-tab,
  .reset-btn {
    border: 0;
    cursor: pointer;
    font-family: inherit;
  }

  .pill-btn {
    border-radius: 16px;
    padding: 14px 16px;
    background: rgba(30, 41, 59, 0.88);
    color: #cbd5e1;
    border: 1px solid rgba(148, 163, 184, 0.2);
    font-weight: 900;
    transition: 0.2s ease;
  }

  .pill-btn.active,
  .pill-btn:hover {
    background: linear-gradient(135deg, #2563eb, #0ea5e9);
    border-color: rgba(125, 211, 252, 0.5);
    color: #ffffff;
    transform: translateY(-1px);
  }

  .info-strip,
  .coming-card {
    margin-top: 18px;
    background: rgba(14, 165, 233, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.22);
    color: #bfdbfe;
    border-radius: 18px;
    padding: 14px 16px;
    line-height: 1.6;
    font-size: 14px;
  }

  .domestic-company-card {
    margin-top: 18px;
    display: grid;
    gap: 12px;
    background: rgba(2, 6, 23, 0.42);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 20px;
    padding: 16px;
  }

  .company-rule-note {
    display: grid;
    gap: 6px;
    background: rgba(14, 165, 233, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.2);
    color: #bfdbfe;
    border-radius: 16px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.55;
  }

  .company-rule-note.fixed {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.24);
  }

  .company-rule-note span,
  .company-rule-note p {
    margin: 0;
  }

  .company-rule-note strong {
    color: #ffffff;
  }






















  .coming-card h3 {
    margin: 0 0 4px;
    color: #f8fafc;
  }

  .coming-card p {
    margin: 0;
    color: #cbd5e1;
  }

  .range-tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .range-tab {
    text-align: left;
    border-radius: 18px;
    padding: 15px;
    background: rgba(30, 41, 59, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.2);
    color: #e2e8f0;
    min-height: 88px;
    transition: 0.2s ease;
  }

  .range-tab strong {
    display: block;
    font-size: 17px;
    color: #f8fafc;
    margin-bottom: 7px;
  }

  .range-tab span {
    color: #94a3b8;
    font-size: 13px;
    line-height: 1.4;
  }

  .range-tab.active,
  .range-tab:hover {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.85), rgba(14, 165, 233, 0.65));
    border-color: rgba(125, 211, 252, 0.48);
    transform: translateY(-1px);
  }

  .range-tab.active span,
  .range-tab:hover span {
    color: #e0f2fe;
  }


  .field-help {
    color: #94a3b8;
    font-size: 12px;
    line-height: 1.55;
    font-weight: 650;
  }

  .computed-box {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .computed-box div {
    background: rgba(2, 6, 23, 0.42);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 18px;
    padding: 16px;
  }

  .computed-box span {
    display: block;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 7px;
  }

  .computed-box strong {
    color: #f8fafc;
    font-size: 18px;
  }

  .computed-box.compact-four {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .toggle-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 18px;
    color: #cbd5e1;
    font-size: 14px;
    line-height: 1.55;
    cursor: pointer;
  }

  .toggle-row.compact {
    margin-top: 14px;
  }

  .toggle-row input {
    margin-top: 3px;
    accent-color: #0ea5e9;
  }

  .threshold-card {
    background: rgba(2, 6, 23, 0.45);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 22px;
    padding: 18px;
  }

  .threshold-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 13px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  }

  .threshold-line:first-child {
    padding-top: 0;
  }

  .threshold-line.highlight {
    margin-top: 4px;
    padding: 15px;
    border-radius: 16px;
    border-bottom: 0;
    background: rgba(14, 165, 233, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.18);
  }

  .threshold-line span {
    color: #94a3b8;
    font-size: 14px;
    font-weight: 800;
  }

  .threshold-line strong {
    color: #f8fafc;
    font-size: 18px;
  }

  .mt-small {
    margin-top: 14px;
  }

  .result-header {
    margin-bottom: 16px;
  }

  .result-header p {
    margin: 0 0 5px;
    color: #38bdf8;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 900;
  }

  .result-header h2 {
    margin: 0;
    color: #f8fafc;
    font-size: 25px;
    letter-spacing: -0.03em;
  }

  .empty-result {
    background: rgba(2, 6, 23, 0.45);
    border: 1px dashed rgba(148, 163, 184, 0.25);
    border-radius: 20px;
    padding: 18px;
    margin-bottom: 18px;
  }

  .empty-result h3 {
    margin: 0 0 6px;
    color: #f8fafc;
  }

  .empty-result p {
    margin: 0;
    color: #94a3b8;
    line-height: 1.6;
  }

  .summary-pill {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(14, 165, 233, 0.12));
    border: 1px solid rgba(56, 189, 248, 0.22);
    border-radius: 18px;
    padding: 14px;
    margin-bottom: 14px;
  }

  .summary-pill span {
    display: block;
    color: #93c5fd;
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 4px;
  }

  .summary-pill strong {
    color: #fff;
    font-size: 18px;
  }

  .result-list {
    display: grid;
    gap: 10px;
  }

  .result-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    background: rgba(2, 6, 23, 0.42);
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 15px;
    padding: 13px 14px;
  }

  .result-row.strong-row {
    background: rgba(14, 165, 233, 0.1);
    border-color: rgba(56, 189, 248, 0.25);
  }

  .result-note {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.24);
    color: #bbf7d0;
    border-radius: 15px;
    padding: 12px 14px;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.55;
  }

  .result-row span {
    color: #94a3b8;
    font-size: 13px;
    font-weight: 800;
  }

  .result-row strong {
    color: #f8fafc;
    text-align: right;
  }

  .mini-heading {
    margin: 18px 0 10px;
    color: #bae6fd;
    font-weight: 950;
    font-size: 14px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .relief-box {
    border-radius: 20px;
    padding: 18px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
  }

  .relief-box.yes {
    background: rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .relief-box.no {
    background: rgba(148, 163, 184, 0.1);
  }

  .relief-box span {
    color: #dbeafe;
    font-weight: 950;
  }

  .relief-box strong {
    color: #ffffff;
    font-size: 24px;
  }

  .net-card {
    margin-top: 14px;
    border-radius: 22px;
    padding: 20px;
    background: linear-gradient(135deg, #2563eb, #0284c7);
    box-shadow: 0 20px 50px rgba(37, 99, 235, 0.24);
  }

  .net-card span {
    color: #dbeafe;
    font-weight: 900;
    font-size: 13px;
  }

  .net-card strong {
    display: block;
    color: #fff;
    font-size: 32px;
    margin: 7px 0 5px;
    letter-spacing: -0.04em;
  }

  .net-card p {
    margin: 0;
    color: #dbeafe;
    font-size: 13px;
  }

  .working-note {
    margin-top: 14px;
    background: rgba(2, 6, 23, 0.42);
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 18px;
    padding: 14px;
  }

  .working-note strong {
    color: #f8fafc;
  }

  .working-note p {
    margin: 6px 0 0;
    color: #94a3b8;
    line-height: 1.6;
    font-size: 13px;
  }

  .reset-btn {
    width: 100%;
    margin-top: 18px;
    border-radius: 16px;
    padding: 14px 16px;
    background: rgba(15, 23, 42, 0.9);
    color: #e2e8f0;
    border: 1px solid rgba(148, 163, 184, 0.25);
    font-weight: 950;
    transition: 0.2s ease;
  }

  .reset-btn:hover {
    background: rgba(30, 41, 59, 1);
    transform: translateY(-1px);
  }

  @media (max-width: 1050px) {
    .calculator-grid {
      grid-template-columns: 1fr;
    }

    .sticky {
      position: static;
    }

    .range-tabs,
    .computed-box.compact-four {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .surcharge-page {
      padding: 16px;
    }

    .hero-card {
      flex-direction: column;
      align-items: stretch;
      padding: 22px;
    }

    .hero-badge {
      min-width: 0;
    }

    .input-panel,
    .result-card {
      border-radius: 22px;
      padding: 18px;
    }

    .form-grid.two,
    .computed-box,
    .computed-box.compact-four,
    .regime-row,
    .range-tabs {
      grid-template-columns: 1fr;
    }

    .result-row,
    .threshold-line,
    .relief-box {
      flex-direction: column;
      align-items: flex-start;
    }

    .result-row strong {
      text-align: left;
    }
  }
`;

export default SurchargeMarginalReliefCalculator;