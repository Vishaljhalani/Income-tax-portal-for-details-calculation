import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   ACTIVE YEARS
========================================================= */

const ACTIVE_YEARS = [
  "2023-24",
  "2024-25",
  "2025-26",
  "2026-27",
];

const YEAR_OPTIONS = [
  { value: "", label: "Select Assessment Year" },
  { value: "2026-27", label: "AY 2026-27" },
  { value: "2025-26", label: "AY 2025-26" },
  { value: "2024-25", label: "AY 2024-25" },
  { value: "2023-24", label: "AY 2023-24" },
];

/* =========================================================
   STATUS
========================================================= */

const COMPANY_STATUS_OPTIONS = [
  {
    value: "domestic_company",
    label: "Domestic Company",
  },
  {
    value: "foreign_company",
    label: "Foreign Company",
  },
];

/* =========================================================
   DOMESTIC COMPANY OPTIONS
========================================================= */

const DOMESTIC_COMPANY_OPTIONS = [
  {
    value: "turnover_400cr_py_2020_21",
    label:
      "Total Turnover/Gross Receipts does not exceed ₹400 crore",
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
    taxRateLabel:
      "15% for business income, 22% for other than business income",
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

/* =========================================================
   DOMESTIC COMPANY TURNOVER PREVIOUS YEAR
========================================================= */

const DOMESTIC_COMPANY_TURNOVER_PREVIOUS_YEARS = {
  "2023-24": "2020-21",
  "2024-25": "2021-22",
  "2025-26": "2022-23",
  "2026-27": "2023-24",
};

function getDomesticCompanyTurnoverPreviousYear(ay) {
  return (
    DOMESTIC_COMPANY_TURNOVER_PREVIOUS_YEARS[ay] ||
    "2020-21"
  );
}

function getDomesticCompanyOptionLabel(item, ay) {
  if (item.value !== "turnover_400cr_py_2020_21") {
    return item.label;
  }

  return `Total Turnover/Gross Receipts during PY ${getDomesticCompanyTurnoverPreviousYear(
    ay
  )} does not exceed ₹400 crore`;
}

/* =========================================================
   FOREIGN COMPANY OPTIONS
========================================================= */

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

/* =========================================================
   RANGE OPTIONS
========================================================= */

const RANGE_OPTIONS = {
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
};

/* =========================================================
   FALLBACK THRESHOLD TAX
========================================================= */

const COMPANY_THRESHOLD_TAX = {
  domestic_company: {
    COMPANY_1CR: 3000000,
    COMPANY_10CR: 30000000,
  },

  foreign_company: {
    FOREIGN_1CR: 3500000,
    FOREIGN_10CR: 35000000,
  },
};

/* =========================================================
   SURCHARGE RULES
========================================================= */

const SURCHARGE_RULES = {
  domestic_company: {
    COMPANY_1CR: 7,
    COMPANY_10CR: 12,
  },

  foreign_company: {
    FOREIGN_1CR: 2,
    FOREIGN_10CR: 5,
  },
};

/* =========================================================
   PREVIOUS SLAB SURCHARGE
========================================================= */

const THRESHOLD_PREVIOUS_SURCHARGE_RATE = {
  domestic_company: {
    COMPANY_1CR: 0,
    COMPANY_10CR: 7,
  },

  foreign_company: {
    FOREIGN_1CR: 0,
    FOREIGN_10CR: 2,
  },
};

/* =========================================================
   SPECIAL RATE RULES
========================================================= */

const SPECIAL_RATE_RULES = {
 

  "2026-27": {
    rate111A: 20,
    rate112: 12.5,
    rate112A: 12.5,
    exemption112A: 125000,
  },
};

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const cleaned = String(value)
    .replace(/,/g, "")
    .trim();

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

/* =========================================================
   RANGE HELPERS
========================================================= */

function getAvailableRanges(status) {
  return RANGE_OPTIONS[status] || [];
}

function getRangeByKey(status, key) {
  return (
    (RANGE_OPTIONS[status] || []).find(
      (item) => item.key === key
    ) || null
  );
}

/* =========================================================
   COMPANY OPTIONS
========================================================= */

function getDomesticCompanyOption(optionKey) {
  return (
    DOMESTIC_COMPANY_OPTIONS.find(
      (item) => item.value === optionKey
    ) || DOMESTIC_COMPANY_OPTIONS[0]
  );
}

function getForeignCompanyOption(optionKey) {
  return (
    FOREIGN_COMPANY_OPTIONS.find(
      (item) => item.value === optionKey
    ) || FOREIGN_COMPANY_OPTIONS[1]
  );
}

/* =========================================================
   FOREIGN TAX RATE
========================================================= */

function getForeignCompanyThresholdTaxRate(
  optionKey,
  ay
) {
  const selectedOption =
    getForeignCompanyOption(optionKey);

  if (selectedOption.thresholdTaxRateByAy) {
    return (
      selectedOption.thresholdTaxRateByAy[ay] ??
      selectedOption.thresholdTaxRate
    );
  }

  return selectedOption.thresholdTaxRate;
}

/* =========================================================
   RANGE BASED ON INCOME
========================================================= */

function getRangeKeyForIncome(status, income) {
  const taxableIncome = Math.max(
    Number(income) || 0,
    0
  );

  if (status === "domestic_company") {
    if (taxableIncome > 100000000) {
      return "COMPANY_10CR";
    }

    if (taxableIncome > 10000000) {
      return "COMPANY_1CR";
    }

    return "";
  }

  if (status === "foreign_company") {
    if (taxableIncome > 100000000) {
      return "FOREIGN_10CR";
    }

    if (taxableIncome > 10000000) {
      return "FOREIGN_1CR";
    }

    return "";
  }

  return "";
}

/* =========================================================
   CURRENT SURCHARGE RATE
========================================================= */

function getSurchargeRate({
  status,
  rangeKey,
  domesticCompanyOption,
}) {
  if (!status || !rangeKey) {
    return 0;
  }

  if (status === "domestic_company") {
    const selectedOption =
      getDomesticCompanyOption(
        domesticCompanyOption
      );

    if (
      selectedOption.fixedSurchargeRate !==
      null
    ) {
      return selectedOption.fixedSurchargeRate;
    }
  }

  return (
    SURCHARGE_RULES[status]?.[rangeKey] || 0
  );
}

/* =========================================================
   PREVIOUS SURCHARGE
========================================================= */

function getThresholdPreviousSurchargeRate({
  status,
  rangeKey,
}) {
  if (!status || !rangeKey) {
    return 0;
  }

  return (
    THRESHOLD_PREVIOUS_SURCHARGE_RATE[
      status
    ]?.[rangeKey] || 0
  );
}

/* =========================================================
   THRESHOLD TAX
========================================================= */
function getThresholdTax({
  ay,
  status,
  rangeKey,
  domesticCompanyOption,
  foreignCompanyOption,
  income111A = 0,
  income112 = 0,
  income112A = 0,
}) {
  if (!ay || !status || !rangeKey) {
    return 0;
  }

  const selectedRange =
    getRangeByKey(status, rangeKey);

  const thresholdIncome =
    selectedRange?.thresholdIncome || 0;

  /* =====================================================
     DOMESTIC COMPANY
  ===================================================== */

/* =====================================================
   DOMESTIC COMPANY
===================================================== */

if (status === "domestic_company") {

  const selectedOption =
    getDomesticCompanyOption(
      domesticCompanyOption
    );

  const normalTaxRate =
    Number(
      selectedOption?.thresholdTaxRate
    ) || 0;

  const specialIncome =
    Math.max(
      toNumber(income111A),
      0
    ) +
    Math.max(
      toNumber(income112),
      0
    ) +
    Math.max(
      toNumber(income112A),
      0
    );

  const specialIncomeTaxAtCompanyRate =
    specialIncome *
    normalTaxRate /
    100;

  const baseThresholdTax =
    thresholdIncome *
    normalTaxRate /
    100;

  const adjustedThresholdTax =
  Math.max(
    baseThresholdTax -
    specialIncomeTaxAtCompanyRate,
    0
  );


/* -----------------------------------------------
   SPECIAL RATE TAX
   ACTUAL TAX ON 111A + 112 + 112A
----------------------------------------------- */

const specialTax =
  calculateSpecialRateTaxes({
    ay,
    income111A,
    income112,
    income112A,
  });


/* -----------------------------------------------
   FINAL THRESHOLD TAX

   Base Threshold Tax
   - Company-rate tax on special income
   + Actual special-rate tax
----------------------------------------------- */

const finalThresholdTax =
  adjustedThresholdTax +
  (
    Number(specialTax?.tax111A) || 0
  ) +
  (
    Number(specialTax?.tax112) || 0
  ) +
  (
    Number(specialTax?.tax112A) || 0
  );


return finalThresholdTax;
}
  /* =====================================================
     FOREIGN COMPANY
  ===================================================== */


if (status === "foreign_company") {

  /* -----------------------------------------------
     APPLICABLE FOREIGN COMPANY TAX RATE
  ----------------------------------------------- */

  const normalTaxRate =
    Number(
      getForeignCompanyThresholdTaxRate(
        foreignCompanyOption,
        ay
      )
    ) || 0;


  /* -----------------------------------------------
     SPECIAL RATE INCOME
     ONLY 111A + 112 + 112A
  ----------------------------------------------- */

  const specialIncome =
    Math.max(
      toNumber(income111A),
      0
    ) +
    Math.max(
      toNumber(income112),
      0
    ) +
    Math.max(
      toNumber(income112A),
      0
    );


  /* -----------------------------------------------
     TAX ON SPECIAL RATE INCOME
     AT APPLICABLE FOREIGN COMPANY RATE
  ----------------------------------------------- */

  const specialIncomeTaxAtCompanyRate =
    specialIncome *
    normalTaxRate /
    100;


  /* -----------------------------------------------
     ORIGINAL THRESHOLD TAX
  ----------------------------------------------- */

  const adjustedThresholdTax =
    COMPANY_THRESHOLD_TAX[
      status
    ]?.[rangeKey] || 0;


  /* -----------------------------------------------
     ADJUSTED THRESHOLD TAX
  ----------------------------------------------- */

  return Math.max(
    adjustedThresholdTax -
    specialIncomeTaxAtCompanyRate,
    0
  );
}
}
/* =========================================================
   SPECIAL RATE TAX
========================================================= */

function calculateSpecialRateTaxes({
  ay,
  income111A,
  income112,
  income112A,
}) {
  const rules = SPECIAL_RATE_RULES[ay];

  if (!rules) {
    return {
      taxable111A: 0,
      taxable112: 0,
      gross112A: 0,
      taxable112A: 0,

      tax111A: 0,
      tax112: 0,
      tax112A: 0,

      totalSpecialTax: 0,
    };
  }

  /* -----------------------------------------
     SECTION 111A
  ----------------------------------------- */

  const taxable111A = Math.max(
    toNumber(income111A),
    0
  );

  /* -----------------------------------------
     SECTION 112
  ----------------------------------------- */

  const taxable112 = Math.max(
    toNumber(income112),
    0
  );

  /* -----------------------------------------
     SECTION 112A
  ----------------------------------------- */

  const gross112A = Math.max(
    toNumber(income112A),
    0
  );

  const taxable112A = Math.max(
    gross112A -
      (Number(rules.exemption112A) || 0),
    0
  );

  /* -----------------------------------------
     SPECIAL RATE TAX
  ----------------------------------------- */

  const tax111A =
    (
      taxable111A *
      Number(rules.rate111A || 0)
    ) / 100;

  const tax112 =
    (
      taxable112 *
      Number(rules.rate112 || 0)
    ) / 100;

  const tax112A =
    (
      taxable112A *
      Number(rules.rate112A || 0)
    ) / 100;

  const totalSpecialTax =
    tax111A +
    tax112 +
    tax112A;

  /* -----------------------------------------
     RETURN
  ----------------------------------------- */

  return {
    /* INCOME */

    taxable111A,
    taxable112,
    gross112A,
    taxable112A,

    /* TAX */

    tax111A,
    tax112,
    tax112A,

    totalSpecialTax,
  };
}
/* =========================================================
   COMPANY CALCULATION ENGINE
========================================================= */

function calculateCompanyMarginalRelief({
  ay,
  status,
  totalIncome,
  normalTax,

  specialTax,

  domesticCompanyOption,
  foreignCompanyOption,

  useManualThresholdPayable,
  manualThresholdPayable,
}) {
  const income =
    Math.max(
      toNumber(totalIncome),
      0
    );

  const normalTaxAmount =
    Math.max(
      toNumber(normalTax),
      0
    );

  const tax111AAmount =
  specialTax?.tax111A || 0;

const tax112Amount =
  specialTax?.tax112 || 0;

const tax112AAmount =
  specialTax?.tax112A || 0;

  /* -----------------------------------------
     AUTO RANGE
  ----------------------------------------- */

  const rangeKey =
    getRangeKeyForIncome(
      status,
      income
    );

  /*
    If income is below ₹1 crore,
    no surcharge range exists.
  */

  if (!rangeKey) {
  const totalTax =
    normalTaxAmount +
    tax111AAmount +
    tax112Amount +
    tax112AAmount;

  return {
    totalIncome: income,
    rangeKey: "",

    thresholdIncome: 0,
    thresholdTax: 0,
    thresholdPayable: 0,

    normalTax: normalTaxAmount,

    tax111AAmount,
    tax112Amount,
    tax112AAmount,

    specialRateTax: 
      tax111AAmount +
      tax112Amount +
      tax112AAmount,

    totalTax,

    surchargeRate: 0,
    previousSurchargeRate: 0,

    surchargeBeforeRelief: 0,
    marginalRelief: 0,
    finalSurcharge: 0,

    totalTaxWithSurcharge: totalTax,

    cess: 0,

    totalTaxAfterMarginalRelief: totalTax,

    finalTaxIncludingCess: totalTax,

    isMarginalReliefApplicable: false,
  };
}

console.log(
  "========== COMPANY THRESHOLD INPUT DEBUG =========="
);

console.log("status =", status);
console.log("rangeKey =", rangeKey);
console.log(
  "domesticCompanyOption =",
  domesticCompanyOption
);

console.log("specialTax =", specialTax);

console.log(
  "111A income =",
  specialTax?.taxable111A
);

console.log(
  "112 income =",
  specialTax?.taxable112
);

console.log(
  "112A income =",
  specialTax?.gross112A
);

console.log(
  "111A tax =",
  specialTax?.tax111A
);

console.log(
  "112 tax =",
  specialTax?.tax112
);

console.log(
  "112A tax =",
  specialTax?.tax112A
);

console.log(
  "===================================================="
);
  /* -----------------------------------------
     RANGE
  ----------------------------------------- */

  const selectedRange =
    getRangeByKey(
      status,
      rangeKey
    );

  const thresholdIncome =
    selectedRange?.thresholdIncome || 0;

  /* -----------------------------------------
     SURCHARGE
  ----------------------------------------- */

  const surchargeRate =
    getSurchargeRate({
      status,
      rangeKey,
      domesticCompanyOption,
    });

  /* -----------------------------------------
     PREVIOUS SURCHARGE
  ----------------------------------------- */

  const previousSurchargeRate =
    getThresholdPreviousSurchargeRate({
      status,
      rangeKey,
    });

  /* -----------------------------------------
     THRESHOLD TAX
  ----------------------------------------- */
const thresholdTax =
  getThresholdTax({
    ay,
    status,
    rangeKey,
    domesticCompanyOption,
    foreignCompanyOption,

    income111A:
  Number(specialTax?.taxable111A) || 0,

income112:
  Number(specialTax?.taxable112) || 0,

income112A:
  Number(specialTax?.gross112A) || 0,
  });

  /* -----------------------------------------
     THRESHOLD SURCHARGE
  ----------------------------------------- */

  const thresholdSurcharge =
    thresholdTax *
    previousSurchargeRate /
    100;

  const calculatedThresholdPayable =
    thresholdTax +
    thresholdSurcharge;

  /* -----------------------------------------
     MANUAL THRESHOLD PAYABLE
  ----------------------------------------- */

const thresholdPayable =
  manualThresholdPayable !== ""
    ? toNumber(manualThresholdPayable)
    : calculatedThresholdPayable;

  /* -----------------------------------------
     TOTAL TAX BEFORE SURCHARGE
  ----------------------------------------- */

 const specialRateTax =
  tax111AAmount +
  tax112Amount +
  tax112AAmount;

 const totalTax =
  normalTaxAmount +
  specialRateTax;

  /* -----------------------------------------
     SURCHARGE BEFORE RELIEF
  ----------------------------------------- */

  const surchargeBeforeRelief =
    totalTax *
    surchargeRate /
    100;

  const totalTaxWithSurcharge =
    totalTax +
    surchargeBeforeRelief;

  /* -----------------------------------------
     FIXED SURCHARGE
  ----------------------------------------- */

  const selectedDomesticOption =
    status === "domestic_company"
      ? getDomesticCompanyOption(
          domesticCompanyOption
        )
      : null;

  const isFixedSurcharge =
    status === "domestic_company" &&
    selectedDomesticOption
      ?.fixedSurchargeRate !== null;

  /* -----------------------------------------
     EXCESS INCOME
  ----------------------------------------- */

  const excessIncome =
    Math.max(
      income -
      thresholdIncome,
      0
    );

  /* -----------------------------------------
     TAX RATE ON EXCESS INCOME
  ----------------------------------------- */

/* -----------------------------------------
   APPLICABLE TAX RATE ON EXCESS INCOME
----------------------------------------- */

let excessIncomeTaxRate = 0;

if (status === "domestic_company") {

  const selectedOption =
    getDomesticCompanyOption(
      domesticCompanyOption
    );

  excessIncomeTaxRate =
    Number(
      selectedOption?.thresholdTaxRate
    ) || 0;
}

if (status === "foreign_company") {

  excessIncomeTaxRate =
    Number(
      getForeignCompanyThresholdTaxRate(
        foreignCompanyOption,
        ay
      )
    ) || 0;
}


/* -----------------------------------------
   TAX ON EXCESS INCOME
----------------------------------------- */

const taxOnExcessIncome =
  excessIncome *
  excessIncomeTaxRate /
  100;
  
  /* -----------------------------------------
     ALLOWABLE NET SURCHARGE
  ----------------------------------------- */

  const allowableNetSurcharge =
    Math.max(
      excessIncome -
      taxOnExcessIncome,
      0
    );

  /* -----------------------------------------
     EXCESS TAX PAYABLE
  ----------------------------------------- */

  const excessTaxPayable =
    Math.max(
      totalTaxWithSurcharge -
      thresholdPayable,
      0
    );

  /* -----------------------------------------
     MARGINAL RELIEF
  ----------------------------------------- */

 let marginalRelief = 0;

if (!isFixedSurcharge) {
  marginalRelief = Math.max(
    excessTaxPayable -
    excessIncome,
    0
  );

  marginalRelief = Math.min(
    marginalRelief,
    surchargeBeforeRelief
  );
}

  

  /*
    In the actual marginal-relief
    calculation, relief is based on
    excess tax payable over excess income.
  */

 const finalSurcharge =
  isFixedSurcharge
    ? surchargeBeforeRelief
    : Math.max(
        surchargeBeforeRelief -
        marginalRelief,
        0
      );

  const totalTaxAfterMarginalRelief =
    totalTax +
    finalSurcharge;

  /* -----------------------------------------
     CESS
  ----------------------------------------- */

  const cess =
    totalTaxAfterMarginalRelief *
    4 /
    100;

  const finalTaxIncludingCess =
    totalTaxAfterMarginalRelief +
    cess;

 return {
  /* Basic */

  totalIncome: income,
  rangeKey,

  /* Threshold */

  thresholdIncome,
  thresholdTax,
  thresholdSurcharge,
  thresholdPayable,

  /* Tax components */

  normalTax: normalTaxAmount,

  tax111AAmount,
  tax112Amount,
  tax112AAmount,

  totalTax,
  

  /* Surcharge */

  surchargeRate,
  previousSurchargeRate,

  surchargeBeforeRelief,

  /* Marginal Relief */

  excessIncome,
  taxOnExcessIncome,
  excessIncomeTaxRate,
  allowableNetSurcharge,
  excessTaxPayable,

  marginalRelief,

  isMarginalReliefApplicable:
    marginalRelief > 0,

  /* Final */

  finalSurcharge,

  totalTaxWithSurcharge:
    totalTax + surchargeBeforeRelief,

  totalTaxAfterMarginalRelief,

  /* Cess */

  cess,

  finalTaxIncludingCess,

  isFixedSurcharge,
};
}
/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function
SurchargeMarginalReliefCalculatorCompany() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [assessmentYear, setAssessmentYear] =
    useState("2026-27");

  const [status, setStatus] =
    useState("domestic_company");

  const [domesticCompanyOption, setDomesticCompanyOption] =
    useState(
      "turnover_400cr_py_2020_21"
    );

  const [foreignCompanyOption, setForeignCompanyOption] =
    useState(
      "any_other_foreign_company_income"
    );

  const [totalIncome, setTotalIncome] =
    useState("");

  const [normalTax, setNormalTax] =
    useState("");

  const [tax111A, setTax111A] =
    useState("");

  const [tax112, setTax112] =
    useState("");

  const [tax112A, setTax112A] =
    useState("");

  

  const [income111A, setIncome111A] = useState("");
  const [income112, setIncome112] = useState("");
  const [income112A, setIncome112A] = useState("");


  const [
    useManualThresholdPayable,
    setUseManualThresholdPayable,
  ] = useState(false);

  const [
    manualThresholdPayable,
    setManualThresholdPayable,
  ] = useState("");

 const specialTax = useMemo(
  () =>
    calculateSpecialRateTaxes({
      ay: assessmentYear,
      income111A,
      income112,
      income112A,
    }),
  [
    assessmentYear,
    income111A,
    income112,
    income112A,
  ]
);
  /* =======================================================
     COMPANY CALCULATION
  ======================================================= */

const calculation = useMemo(() => {
  return calculateCompanyMarginalRelief({
    ay: assessmentYear,
    status,
    totalIncome,
    normalTax,
    specialTax,
    domesticCompanyOption,
    foreignCompanyOption,
    useManualThresholdPayable,
    manualThresholdPayable,
  });
}, [
  assessmentYear,
  status,
  totalIncome,
  normalTax,
  specialTax,
  domesticCompanyOption,
  foreignCompanyOption,
  useManualThresholdPayable,
  manualThresholdPayable,
]);

const {
  thresholdIncome: calculatedThresholdIncome,
  thresholdTax,
  thresholdSurcharge,
  thresholdPayable,

  surchargeRate,
  previousSurchargeRate,
  surchargeBeforeRelief,

  excessIncome,
  taxOnExcessIncome,
  excessIncomeTaxRate,
  allowableNetSurcharge,
  excessTaxPayable,

  marginalRelief,
  finalSurcharge,

  totalTaxAfterMarginalRelief,
  cess,
  finalTaxIncludingCess,
} = calculation;

  /* =======================================================
     CURRENT COMPANY RANGE
  ======================================================= */

  const enteredTotalIncome =
    toNumber(totalIncome);

    const enteredNormalTax =
  Math.max(Number(normalTax) || 0, 0);


  const isDomesticCompany =
  status === "domestic_company";

const isForeignCompany =
  status === "foreign_company";
  
  const currentRangeKey =
    getRangeKeyForIncome(
      status,
      enteredTotalIncome
    );

  const currentRange =
    getRangeByKey(
      status,
      currentRangeKey
    );

    const thresholdIncome =
  currentRange?.thresholdIncome || 0;

const showMarginalRelief =
  enteredTotalIncome > 10000000;

const showSpecialTaxFields =
  enteredTotalIncome >= 20000000;

 const companyRangeKey =
  isDomesticCompany
    ? currentRangeKey
    : "";

const companyThresholdIncome =
  isDomesticCompany
    ? thresholdIncome
    : 0;

const companyNormalTax =
  isDomesticCompany
    ? enteredNormalTax
    : 0;

const companyTax111A =
  isDomesticCompany
    ? specialTax?.tax111A || 0
    : 0;

const companyTax112 =
  isDomesticCompany
    ? specialTax?.tax112 || 0
    : 0;

const companyTax112A =
  isDomesticCompany
    ? specialTax?.tax112A || 0
    : 0;

const companyRestrictedTax =
  companyTax111A +
  companyTax112 +
  companyTax112A;

const companyTotalTaxBeforeSurcharge =
  companyNormalTax +
  companyRestrictedTax;


/* =================================================
   COMPANY SURCHARGE RATE
================================================= */

const companySurchargeRate =
  isDomesticCompany
    ? getSurchargeRate({
        status: "domestic_company",
        rangeKey: companyRangeKey,
        domesticCompanyOption,
      })
    : 0;

const companyPreviousSurchargeRate =
  isDomesticCompany
    ? getThresholdPreviousSurchargeRate({
        status: "domestic_company",
        rangeKey: companyRangeKey,
      })
    : 0;

const companyThresholdTax =
  isDomesticCompany
    ? getThresholdTax({
        ay: assessmentYear,
        status: "domestic_company",
        rangeKey: companyRangeKey,
        domesticCompanyOption,
        foreignCompanyOption,
      })
    : 0;

/* =======================================================
   CURRENT SURCHARGE
======================================================= */

const companySurchargeBeforeRelief =
  isDomesticCompany
    ? (
        companyTotalTaxBeforeSurcharge *
        companySurchargeRate
      ) / 100
    : 0;

/* =======================================================
   THRESHOLD PAYABLE
======================================================= */
const companyThresholdSurcharge =
  isDomesticCompany
    ? calculation.thresholdSurcharge
    : 0;

const companyThresholdPayable =
  isDomesticCompany
    ? calculation.thresholdPayable
    : 0;

/* =======================================================
   EXCESS INCOME
======================================================= */

const companyExcessIncome =
  isDomesticCompany
    ? Math.max(
        enteredTotalIncome -
        companyThresholdIncome,
        0
      )
    : 0;

/* =======================================================
   TAX ON EXCESS INCOME
======================================================= */

const companyTaxOnExcessIncome =
  isDomesticCompany
    ? (
        companyExcessIncome * 30
      ) / 100
    : 0;

/* =======================================================
   ALLOWABLE NET SURCHARGE
======================================================= */

const companyAllowableNetSurcharge =
  isDomesticCompany
    ? Math.max(
        companyExcessIncome -
        companyTaxOnExcessIncome,
        0
      )
    : 0;

/* =======================================================
   EXCESS TAX PAYABLE
======================================================= */

const companyExcessTaxPayable =
  isDomesticCompany
    ? Math.max(
        (
          companyTotalTaxBeforeSurcharge +
          companySurchargeBeforeRelief
        ) -
        companyThresholdPayable,
        0
      )
    : 0;

/* =======================================================
   FIXED SURCHARGE CHECK
======================================================= */

const selectedDomesticOption =
  isDomesticCompany
    ? getDomesticCompanyOption(
        domesticCompanyOption
      )
    : null;

const isFixedSurcharge =
  isDomesticCompany &&
  selectedDomesticOption?.fixedSurchargeRate !== null;

/* =======================================================
   MARGINAL RELIEF
======================================================= */

const companyMarginalRelief =
  isDomesticCompany
    ? calculation.marginalRelief
    : 0;

/* =======================================================
   FINAL SURCHARGE
======================================================= */

const companyFinalSurcharge =
  isDomesticCompany
    ? calculation.finalSurcharge
    : 0;

/* =======================================================
   TAX AFTER MARGINAL RELIEF
======================================================= */

const companyTaxAfterMarginalRelief =
  isDomesticCompany
    ? calculation.totalTaxAfterMarginalRelief
    : 0;
    /* =================================================
   CESS
================================================= */

const companyCess =
  isDomesticCompany
    ? calculation.cess
    : 0;


/* =================================================
   FINAL TAX
================================================= */

const companyFinalTaxIncludingCess =
  isDomesticCompany
    ? calculation.finalTaxIncludingCess
    : 0;
  /* =======================================================
   FOREIGN COMPANY CALCULATION BLOCKS
======================================================= */

const foreignRangeKey =
  isForeignCompany
    ? currentRangeKey
    : "";

const foreignThresholdIncome =
  isForeignCompany
    ? thresholdIncome
    : 0;

const foreignNormalTax =
  isForeignCompany
    ? enteredNormalTax
    : 0;

const foreignTax111A =
  isForeignCompany
    ? Math.max(
        Number(specialTax?.tax111A) || 0,
        0
      )
    : 0;

const foreignTax112 =
  isForeignCompany
    ? Math.max(
        Number(specialTax?.tax112) || 0,
        0
      )
    : 0;

const foreignTax112A =
  isForeignCompany
    ? Math.max(
        Number(specialTax?.tax112A) || 0,
        0
      )
    : 0;

const foreignRestrictedTax =
  foreignTax111A +
  foreignTax112 +
  foreignTax112A;

const foreignTotalTaxBeforeSurcharge =
  foreignNormalTax +
  foreignRestrictedTax;


/* -------------------------------------------------------
   FOREIGN CURRENT SURCHARGE
------------------------------------------------------- */

const foreignSurchargeRate =
  isForeignCompany
    ? getSurchargeRate({
        status: "foreign_company",
        rangeKey: foreignRangeKey,
        domesticCompanyOption,
      })
    : 0;


/* -------------------------------------------------------
   FOREIGN PREVIOUS SLAB SURCHARGE
------------------------------------------------------- */

const foreignPreviousSurchargeRate =
  isForeignCompany
    ? getThresholdPreviousSurchargeRate({
        status: "foreign_company",
        rangeKey: foreignRangeKey,
      })
    : 0;


/* -------------------------------------------------------
   FOREIGN THRESHOLD TAX
------------------------------------------------------- */

const foreignThresholdTax =
  isForeignCompany
    ? getThresholdTax({
        ay: assessmentYear,
        status: "foreign_company",
        rangeKey: foreignRangeKey,
        domesticCompanyOption,
        foreignCompanyOption,
      })
    : 0;


/* -------------------------------------------------------
   FOREIGN THRESHOLD SURCHARGE
------------------------------------------------------- */

const foreignThresholdSurcharge =
  isForeignCompany
    ? (
        foreignThresholdTax *
        foreignPreviousSurchargeRate
      ) / 100
    : 0;


/* -------------------------------------------------------
   FOREIGN THRESHOLD PAYABLE
------------------------------------------------------- */

const foreignThresholdPayable =
  isForeignCompany
    ? calculation.thresholdPayable
    : 0;

/* -------------------------------------------------------
   FOREIGN SURCHARGE BEFORE RELIEF
------------------------------------------------------- */

const foreignSurchargeBeforeRelief =
  isForeignCompany
    ? (
        foreignTotalTaxBeforeSurcharge *
        foreignSurchargeRate
      ) / 100
    : 0;


/* -------------------------------------------------------
   FOREIGN EXCESS INCOME
------------------------------------------------------- */

const foreignExcessIncome =
  isForeignCompany
    ? Math.max(
        enteredTotalIncome -
        foreignThresholdIncome,
        0
      )
    : 0;


/* -------------------------------------------------------
   FOREIGN TAX RATE ON EXCESS INCOME
------------------------------------------------------- */

const foreignExcessIncomeTaxRate =
  isForeignCompany
    ? getForeignCompanyThresholdTaxRate(
        foreignCompanyOption,
        assessmentYear
      )
    : 0;


/* -------------------------------------------------------
   FOREIGN TAX ON EXCESS INCOME
------------------------------------------------------- */

const foreignTaxOnExcessIncome =
  isForeignCompany
    ? (
        foreignExcessIncome *
        foreignExcessIncomeTaxRate
      ) / 100
    : 0;


/* -------------------------------------------------------
   FOREIGN ALLOWABLE NET SURCHARGE
------------------------------------------------------- */

const foreignAllowableNetSurcharge =
  isForeignCompany
    ? Math.max(
        foreignExcessIncome -
        foreignTaxOnExcessIncome,
        0
      )
    : 0;


/* -------------------------------------------------------
   FOREIGN EXCESS TAX PAYABLE
------------------------------------------------------- */

const foreignExcessTaxPayable =
  isForeignCompany
    ? Math.max(
        (
          foreignTotalTaxBeforeSurcharge +
          foreignSurchargeBeforeRelief
        ) -
        foreignThresholdPayable,
        0
      )
    : 0;


/* -------------------------------------------------------
   FOREIGN MARGINAL RELIEF
------------------------------------------------------- */

const foreignMarginalRelief =
  isForeignCompany
    ? Math.min(
        Math.max(
          foreignExcessTaxPayable -
          foreignExcessIncome,
          0
        ),
        foreignSurchargeBeforeRelief
      )
    : 0;


/* -------------------------------------------------------
   FOREIGN FINAL SURCHARGE
------------------------------------------------------- */

const foreignFinalSurcharge =
  isForeignCompany
    ? Math.max(
        foreignSurchargeBeforeRelief -
        foreignMarginalRelief,
        0
      )
    : 0;


/* -------------------------------------------------------
   FOREIGN TAX AFTER MARGINAL RELIEF
------------------------------------------------------- */

const foreignTaxAfterMarginalRelief =
  isForeignCompany
    ? foreignTotalTaxBeforeSurcharge +
      foreignFinalSurcharge
    : 0;


/* -------------------------------------------------------
   FOREIGN CESS
------------------------------------------------------- */

const foreignCess =
  isForeignCompany
    ? (
        foreignTaxAfterMarginalRelief *
        4
      ) / 100
    : 0;


/* -------------------------------------------------------
   FOREIGN FINAL TAX INCLUDING CESS
------------------------------------------------------- */

const foreignFinalTaxIncludingCess =
  isForeignCompany
    ? foreignTaxAfterMarginalRelief +
      foreignCess
    : 0;
  /* =======================================================
     RESET
  ======================================================= */

  const resetCalculator = () => {
    setAssessmentYear("2026-27");

    setStatus("domestic_company");

    setDomesticCompanyOption(
      "turnover_400cr_py_2020_21"
    );

    setForeignCompanyOption(
      "any_other_foreign_company_income"
    );

    setTax111A("");
setTax112("");
setTax112A("");


setIncome111A("");
setIncome112("");
setIncome112A("");


setUseManualThresholdPayable(false);
setManualThresholdPayable("");
  };

  /* =======================================================
     UI
  ======================================================= */

return (
  <>
    <style>{`
      .smr-page {
        min-height: 100vh;
        background: #f4f7fb;
        padding: 30px 40px 50px;
        box-sizing: border-box;
      }

      .smr-header {
        max-width: 1400px;
        margin: 0 auto 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        background: #ffffff;
        border: 1px solid #dbe4ef;
        border-radius: 14px;
        padding: 22px 26px;
        box-shadow: 0 4px 14px rgba(15,45,75,0.06);
      }

      .smr-back-btn {
        border: 1px solid #cbd7e5;
        background: #ffffff;
        color: #173b63;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }

      .smr-back-btn:hover {
        background: #edf5ff;
        border-color: #8eb0d2;
      }

      .smr-header-content h1 {
        margin: 0;
        color: #12355b;
        font-size: 27px;
        font-weight: 750;
      }

      .smr-header-content p {
        margin: 6px 0 0;
        color: #718096;
        font-size: 14px;
      }

      .smr-layout {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 26px;
        align-items: start;
      }

      .smr-card {
        background: #ffffff;
        border: 1px solid #dbe4ef;
        border-radius: 14px;
        padding: 26px;
        box-shadow: 0 5px 18px rgba(15,45,75,0.07);
        box-sizing: border-box;
      }

      .smr-result-card {
        position: sticky;
        top: 20px;
      }

      .smr-card-header {
        padding-bottom: 18px;
        margin-bottom: 22px;
        border-bottom: 1px solid #e4ebf3;
      }

      .smr-card-header h2 {
        margin: 0;
        color: #173b63;
        font-size: 21px;
        font-weight: 700;
      }

      .smr-card-header p {
        margin: 6px 0 0;
        color: #718096;
        font-size: 13px;
      }

      .smr-section-title {
        margin: 25px 0 14px;
        padding-bottom: 9px;
        border-bottom: 1px solid #e3eaf2;
        color: #173b63;
        font-size: 15px;
        font-weight: 700;
      }

      .smr-field {
        margin-bottom: 17px;
      }

      .smr-field label {
        display: block;
        margin-bottom: 7px;
        color: #334e68;
        font-size: 13px;
        font-weight: 650;
      }

      .smr-field input,
      .smr-field select {
        width: 100%;
        height: 44px;
        padding: 0 13px;
        box-sizing: border-box;
        border: 1px solid #cbd7e5;
        border-radius: 8px;
        background: #ffffff;
        color: #263f56;
        font-size: 14px;
        outline: none;
      }

      .smr-field input:focus,
      .smr-field select:focus,
      .smr-special-input:focus {
        border-color: #3578b8;
        box-shadow: 0 0 0 3px rgba(53,120,184,0.12);
      }

      .smr-special-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 170px 120px;
        gap: 15px;
        align-items: center;
        padding: 14px 0;
        border-bottom: 1px solid #edf1f5;
      }
        /* =================================================
   LEFT SIDE THRESHOLD TABLE
================================================= */

.threshold-table {
  width: 100%;
  border: 1px solid #d9e2ec;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  margin-top: 10px;
}

.threshold-table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 13px 16px;

  border-bottom: 1px solid #e5eaf0;
}

.threshold-table-row:last-child {
  border-bottom: none;
}

.threshold-table-label {
  color: #425466;
  font-size: 14px;
  line-height: 1.4;
}

.threshold-table-value {
  color: #17365d;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  text-align: right;
}


/* ---------------------------------------------
   THRESHOLD PAYABLE HIGHLIGHT
--------------------------------------------- */

.threshold-table-highlight {
  background: #f1f7ff;
}

.threshold-table-highlight .threshold-table-label {
  color: #17365d;
  font-weight: 600;
}

.threshold-table-highlight .threshold-table-value {
  color: #0b4f8a;
  font-size: 15px;
}


/* ---------------------------------------------
   MANUAL OVERRIDE
--------------------------------------------- */

.threshold-manual-toggle {
  margin-top: 14px;
}


/* ---------------------------------------------
   RESPONSIVE
--------------------------------------------- */

@media (max-width: 600px) {

  .threshold-table-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .threshold-table-value {
    text-align: left;
  }

}
      .smr-special-name {
        color: #173b63;
        font-size: 14px;
        font-weight: 700;
      }

      .smr-special-description {
        margin-top: 4px;
        color: #718096;
        font-size: 12px;
        line-height: 1.4;
      }

      .smr-special-input {
        width: 100%;
        height: 42px;
        padding: 0 12px;
        box-sizing: border-box;
        border: 1px solid #cbd7e5;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
      }

      .smr-special-tax {
        text-align: right;
        color: #1d5f91;
        font-size: 14px;
        font-weight: 700;
      }

      .smr-result-section {
        margin-bottom: 20px;
        padding: 17px;
        background: #f8fafc;
        border: 1px solid #e1e8f0;
        border-radius: 10px;
      }

      .smr-result-section-title {
        margin-bottom: 12px;
        color: #173b63;
        font-size: 14px;
        font-weight: 750;
      }

      .smr-result-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 10px 0;
        border-bottom: 1px solid #e9eef4;
      }

      .smr-result-item:last-child {
        border-bottom: none;
      }

      .smr-result-label {
        color: #52677c;
        font-size: 13px;
        line-height: 1.45;
      }

      .smr-result-value {
        flex-shrink: 0;
        color: #1d344d;
        font-size: 14px;
        font-weight: 700;
        text-align: right;
      }

      .smr-highlight-value {
        color: #b45309;
      }

      .smr-final-result {
        margin-top: 24px;
        padding: 22px;
        border-radius: 12px;
        background: #edf5ff;
        border: 1px solid #bfd7ef;
        text-align: center;
      }

      .smr-final-label {
        color: #45627e;
        font-size: 13px;
        font-weight: 650;
        margin-bottom: 8px;
      }

      .smr-final-value {
        color: #123f6d;
        font-size: 27px;
        font-weight: 800;
      }

      .smr-reset-btn {
        width: 100%;
        height: 44px;
        margin-top: 20px;
        border: 1px solid #c7d3df;
        border-radius: 8px;
        background: #ffffff;
        color: #173b63;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .smr-reset-btn:hover {
        background: #173b63;
        border-color: #173b63;
        color: #ffffff;
      }

      @media (max-width: 1050px) {
        .smr-page {
          padding: 22px;
        }

        .smr-layout {
          grid-template-columns: 1fr;
        }

        .smr-result-card {
          position: static;
        }
      }

      @media (max-width: 650px) {
        .smr-page {
          padding: 14px;
        }

        .smr-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .smr-special-row {
          grid-template-columns: 1fr;
        }

        .smr-special-tax {
          text-align: left;
        }

        .smr-result-item {
          align-items: flex-start;
          flex-direction: column;
          gap: 5px;
        }

        .smr-result-value {
          text-align: left;
        }
      }
    `}</style>

    <div className="smr-page">
    {/* =====================================================
        HEADER
    ===================================================== */}

    <div className="smr-header">

      <button
        type="button"
        className="smr-back-btn"
        onClick={() =>
          navigate("/SurchargeMarginalReliefCalculatorStatusWise")
        }
      >
        ← Back
      </button>

      <div className="smr-header-content">
        <h1>Domestic / Foreign Company</h1>

        <p>
          Company Surcharge & Marginal Relief Calculator
        </p>
      </div>

    </div>


    {/* =====================================================
        MAIN TWO COLUMN LAYOUT
    ===================================================== */}

    <div className="smr-layout">


      {/* ===================================================
          LEFT PANEL — INPUTS
      =================================================== */}

      <div className="smr-card">

        <div className="smr-card-header">
          <h2>Company Details</h2>

          <p>
            Enter the details required to calculate surcharge
            and marginal relief.
          </p>
        </div>


        {/* -----------------------------------------------
            ASSESSMENT YEAR
        ------------------------------------------------ */}

        <div className="smr-field">

          <label>
            Assessment Year
          </label>

          <select
            value={assessmentYear}
            onChange={(e) =>
              setAssessmentYear(e.target.value)
            }
          >
            {YEAR_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

        </div>


        {/* -----------------------------------------------
            COMPANY TYPE
        ------------------------------------------------ */}

        <div className="smr-field">

          <label>
            Company Type
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="domestic_company">
              Domestic Company
            </option>

            <option value="foreign_company">
              Foreign Company
            </option>

          </select>

        </div>


        {/* =================================================
            DOMESTIC COMPANY OPTIONS
        ================================================= */}

        {status === "domestic_company" && (

          <div className="smr-field">

            <label>
              Domestic Company Tax Option
            </label>

            <select
              value={domesticCompanyOption}
              onChange={(e) =>
                setDomesticCompanyOption(
                  e.target.value
                )
              }
            >

              {DOMESTIC_COMPANY_OPTIONS.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {getDomesticCompanyOptionLabel(
                      item,
                      assessmentYear
                    )}
                  </option>
                )
              )}

            </select>

          </div>

        )}


        {/* =================================================
            FOREIGN COMPANY OPTIONS
        ================================================= */}

        {status === "foreign_company" && (

          <div className="smr-field">

            <label>
              Foreign Company Income Type
            </label>

            <select
              value={foreignCompanyOption}
              onChange={(e) =>
                setForeignCompanyOption(
                  e.target.value
                )
              }
            >

              {FOREIGN_COMPANY_OPTIONS.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </div>

        )}


        {/* =================================================
            TOTAL INCOME
        ================================================= */}

        <div className="smr-section-title">
          Income & Tax Details
        </div>


        <div className="smr-field">

          <label>
            Total Income
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter Total Income"
            value={totalIncome}
            onChange={(e) =>
              setTotalIncome(e.target.value)
            }
          />

        </div>


        {/* =================================================
            NORMAL / OTHER TAX
        ================================================= */}

        <div className="smr-field">

          <label>
            Normal / Other Tax
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter Normal / Other Tax"
            value={normalTax}
            onChange={(e) =>
              setNormalTax(e.target.value)
            }
          />

        </div>


        {/* =================================================
            CAPITAL GAIN / SPECIAL RATE INPUTS
        ================================================= */}

        <div className="smr-section-title">
          Capital Gain / Special Rate Income
        </div>


        {/* 111A */}

        <div className="smr-special-row">

          <div>
            <div className="smr-special-name">
              STCG u/s 111A
            </div>

            <div className="smr-special-description">
              Short-Term Capital Gain taxable at special rate
            </div>
          </div>

         <input
  className="smr-special-input"
  type="text"
  inputMode="numeric"
  placeholder="0"
  value={income111A}
  onChange={(e) =>
    setIncome111A(e.target.value)
  }
/>

<div className="smr-special-tax">
  {formatINR(specialTax?.tax111A || 0)}
</div>

        </div>


        {/* 112 */}

        <div className="smr-special-row">

          <div>
            <div className="smr-special-name">
              LTCG u/s 112
            </div>

            <div className="smr-special-description">
              Long-Term Capital Gain taxable u/s 112
            </div>
          </div>

        <input
  className="smr-special-input"
  type="text"
  inputMode="numeric"
  placeholder="0"
  value={income112}
  onChange={(e) =>
    setIncome112(e.target.value)
  }
/>

<div className="smr-special-tax">
  {formatINR(specialTax?.tax112 || 0)}
</div>

        </div>


        {/* 112A */}

        <div className="smr-special-row">

          <div>
            <div className="smr-special-name">
              LTCG u/s 112A
            </div>

            <div className="smr-special-description">
              Listed Equity / Equity-oriented units
            </div>
          </div>

         <input
  className="smr-special-input"
  type="text"
  inputMode="numeric"
  placeholder="0"
  value={income112A}
  onChange={(e) =>
    setIncome112A(e.target.value)
  }
/>

<div className="smr-special-tax">
  {formatINR(specialTax?.tax112A || 0)}
</div>

        </div>



    

     {/* =================================================
    THRESHOLD TAX & MARGINAL RELIEF
================================================= */}


{/* =================================================
    THRESHOLD TAX & MARGINAL RELIEF
================================================= */}

<div className="smr-section-title">
  Threshold Tax
</div>

<div className="threshold-card">

  {/* ---------------------------------------------
      THRESHOLD COMPARISON TABLE
  --------------------------------------------- */}

  <div className="threshold-table">

    {/* TOTAL INCOME UP TO THRESHOLD */}

    <div className="threshold-table-row">

      <span className="threshold-table-label">
        Total Income up to Threshold
      </span>

      <strong className="threshold-table-value">
        {formatINR(
          calculation.thresholdIncome
        )}
      </strong>

    </div>


    {/* TAX ON THRESHOLD INCOME */}

    <div className="threshold-table-row">

      <span className="threshold-table-label">
        Tax on Threshold Income
      </span>

      <strong className="threshold-table-value">
        {formatINR(
          calculation.thresholdTax
        )}
      </strong>

    </div>


    {/* PREVIOUS SLAB SURCHARGE */}

    <div className="threshold-table-row">

      <span className="threshold-table-label">
        Previous Slab Surcharge @{" "}
        {calculation.previousSurchargeRate}%
      </span>

      <strong className="threshold-table-value">
        {formatINR(
          calculation.thresholdSurcharge
        )}
      </strong>

    </div>


    {/* THRESHOLD PAYABLE */}

    <div className="threshold-table-row threshold-table-highlight">

      <span className="threshold-table-label">
        Tax Payable on Threshold including Surcharge
      </span>

      <strong className="threshold-table-value">
        {formatINR(
          useManualThresholdPayable &&
          manualThresholdPayable !== ""
            ? toNumber(
                manualThresholdPayable
              )
            : calculation.thresholdPayable
        )}
      </strong>

    </div>

  </div>


  {/* ---------------------------------------------
      MANUAL OVERRIDE
  --------------------------------------------- */}

  <label className="toggle-row compact threshold-manual-toggle">

    <input
      type="checkbox"
      checked={
        useManualThresholdPayable
      }
      onChange={(e) => {

        setUseManualThresholdPayable(
          e.target.checked
        );

      }}
    />

    <span>
      Threshold payable manually override karna hai
    </span>

  </label>


  {/* ---------------------------------------------
      MANUAL THRESHOLD PAYABLE INPUT
  --------------------------------------------- */}

  {useManualThresholdPayable && (

    <label className="field mt-small">

      <span>
        Manual Tax Payable on Threshold including Surcharge
      </span>

      <input
        type="text"
        inputMode="numeric"
        placeholder="Enter threshold payable amount"
        value={
          manualThresholdPayable
        }
        onChange={(e) => {

          setManualThresholdPayable(
            e.target.value
          );

        }}
      />

    </label>

  )}

</div>
        {/* =================================================
            RESET
        ================================================= */}

        <button
          type="button"
          className="smr-reset-btn"
          onClick={resetCalculator}
        >
          Reset Calculator
        </button>

      </div>


      {/* ===================================================
          RIGHT PANEL — RESULTS
      =================================================== */}

      <div className="smr-card smr-result-card">

        <div className="smr-card-header">

          <h2>
            Calculation Summary
          </h2>

          <p>
            Surcharge and marginal relief calculation
          </p>

        </div>


        {/* =================================================
            BASIC DETAILS
        ================================================= */}

        <div className="smr-result-section">

          <div className="smr-result-section-title">
            Income Details
          </div>


          <div className="smr-result-item">

            <span className="smr-result-label">
              Total Income
            </span>

            <span className="smr-result-value">
              {formatINR(
                enteredTotalIncome
              )}
            </span>

          </div>


          <div className="smr-result-item">

            <span className="smr-result-label">
              Threshold Income
            </span>

            <span className="smr-result-value">
              {formatINR(
                status === "domestic_company"
                  ? thresholdIncome
                  : status === "foreign_company"
                  ? thresholdIncome
                  : 0
              )}
            </span>

          </div>

        </div>


        {/* =================================================
            TAX DETAILS
        ================================================= */}

        <div className="smr-result-section">

          <div className="smr-result-section-title">
            Tax Details
          </div>


          <div className="smr-result-item">

            <span className="smr-result-label">
              Normal / Other Tax
            </span>

            <span className="smr-result-value">
              {formatINR(
                enteredNormalTax
              )}
            </span>

          </div>


          <div className="smr-result-item">

            <span className="smr-result-label">
              Tax u/s 111A
            </span>

            <span className="smr-result-value">
              {formatINR(
                specialTax?.tax111A || 0
              )}
            </span>

          </div>


          <div className="smr-result-item">

            <span className="smr-result-label">
              Tax u/s 112
            </span>

            <span className="smr-result-value">
              {formatINR(
                specialTax?.tax112 || 0
              )}
            </span>

          </div>


          <div className="smr-result-item">

            <span className="smr-result-label">
              Tax u/s 112A
            </span>

            <span className="smr-result-value">
              {formatINR(
                specialTax?.tax112A || 0
              )}
            </span>

          </div>
                </div>


        

        {/* =================================================
            SURCHARGE
        ================================================= */}
<div className="smr-result-item">
  <span className="smr-result-label">
    Tax Before Surcharge
  </span>

  <span className="smr-result-value">
    {formatINR(
      isDomesticCompany
        ? companyTotalTaxBeforeSurcharge
        : isForeignCompany
        ? foreignTotalTaxBeforeSurcharge
        : 0
    )}
  </span>
</div>

<div className="smr-result-section">

  <div className="smr-result-section-title">
    Surcharge Calculation
  </div>


  <div className="smr-result-item">

    <span className="smr-result-label">
      Current Surcharge @{" "}
      {isDomesticCompany
        ? companySurchargeRate
        : isForeignCompany
        ? foreignSurchargeRate
        : 0}
      %
    </span>

    <span className="smr-result-value">

      {formatINR(
        isDomesticCompany
          ? companySurchargeBeforeRelief
          : isForeignCompany
          ? foreignSurchargeBeforeRelief
          : 0
      )}

    </span>

  </div>


  <div className="smr-result-item">

    <span className="smr-result-label">
      Previous Slab Surcharge @{" "}
      {isDomesticCompany
        ? companyPreviousSurchargeRate
        : isForeignCompany
        ? foreignPreviousSurchargeRate
        : 0}
      %
    </span>

    <span className="smr-result-value">

      {formatINR(
        isDomesticCompany
          ? (
              companyThresholdTax *
              companyPreviousSurchargeRate
            ) / 100
          : isForeignCompany
          ? (
              foreignThresholdTax *
              foreignPreviousSurchargeRate
            ) / 100
          : 0
      )}

    </span>

  </div>


  <div className="smr-result-item">

    <span className="smr-result-label">
      Surcharge Before Marginal Relief
    </span>

    <span className="smr-result-value">

      {formatINR(
        isDomesticCompany
          ? companySurchargeBeforeRelief
          : isForeignCompany
          ? foreignSurchargeBeforeRelief
          : 0
      )}

    </span>

  </div>

</div>

     {/* =================================================
    THRESHOLD COMPARISON
================================================= */}

{/* =================================================
    THRESHOLD COMPARISON
================================================= */}

<div className="smr-result-section">

  <div className="smr-result-section-title">
    Threshold Comparison
  </div>


  <div className="smr-result-item">

    <span className="smr-result-label">
      Total Income up to Threshold
    </span>

    <span className="smr-result-value">
      {formatINR(
        isDomesticCompany
          ? companyThresholdIncome
          : isForeignCompany
          ? foreignThresholdIncome
          : 0
      )}
    </span>

  </div>


  <div className="smr-result-item">

    <span className="smr-result-label">
      Tax on Threshold Income
    </span>

    <span className="smr-result-value">
      {formatINR(
        isDomesticCompany
          ? companyThresholdTax
          : isForeignCompany
          ? foreignThresholdTax
          : 0
      )}
    </span>

  </div>


  <div className="smr-result-item">

    <span className="smr-result-label">
      Previous Slab Surcharge @{" "}
      {isDomesticCompany
        ? companyPreviousSurchargeRate
        : isForeignCompany
        ? foreignPreviousSurchargeRate
        : 0}
      %
    </span>

    <span className="smr-result-value">
      {formatINR(
        isDomesticCompany
          ? (
              companyThresholdTax *
              companyPreviousSurchargeRate /
              100
            )
          : isForeignCompany
          ? (
              foreignThresholdTax *
              foreignPreviousSurchargeRate /
              100
            )
          : 0
      )}
    </span>

  </div>


  <div className="smr-result-item smr-result-highlight">

    <span className="smr-result-label">
      Tax Payable on Threshold including Surcharge
    </span>

    <span className="smr-result-value">
      {formatINR(
        isDomesticCompany
          ? companyThresholdPayable
          : isForeignCompany
          ? foreignThresholdPayable
          : 0
      )}
    </span>

  </div>

</div>


{/* =================================================
    MARGINAL RELIEF
================================================= */}

<div className="smr-result-section">

  <div className="smr-result-section-title">
    Marginal Relief
  </div>


  {/* ---------------------------------------------
      EXCESS INCOME
  --------------------------------------------- */}

  <div className="smr-result-item">

    <span className="smr-result-label">
      Excess Income
    </span>

    <span className="smr-result-value">
      {formatINR(
        calculation.excessIncome
      )}
    </span>

  </div>


  {/* ---------------------------------------------
      TAX ON EXCESS INCOME
  --------------------------------------------- */}

  <div className="smr-result-item">

    <span className="smr-result-label">
      Tax on Excess Income
    </span>

    <span className="smr-result-value">
      {formatINR(
        calculation.taxOnExcessIncome
      )}
    </span>

  </div>


  {/* ---------------------------------------------
      EXCESS TAX PAYABLE
  --------------------------------------------- */}

  <div className="smr-result-item">

    <span className="smr-result-label">
      Excess Tax Payable(Total tax with surcharge - Threshold tax)
    </span>

    <span className="smr-result-value">
      {formatINR(
        isDomesticCompany
          ? companyExcessTaxPayable
          : isForeignCompany
          ? foreignExcessTaxPayable
          : 0
      )}
    </span>

  </div>


  {/* ---------------------------------------------
      MARGINAL RELIEF
  --------------------------------------------- */}

  <div className="smr-result-item">

    <span className="smr-result-label">
      Marginal Relief(Excess tax payble - Excess income)
    </span>

    <span className="smr-result-value smr-highlight-value">
      {formatINR(
        isDomesticCompany
          ? companyMarginalRelief
          : isForeignCompany
          ? foreignMarginalRelief
          : 0
      )}
    </span>

  </div>


  {/* ---------------------------------------------
      FINAL SURCHARGE
  --------------------------------------------- */}

  <div className="smr-result-item">

    <span className="smr-result-label">
      Final Surcharge(Surcharge - Marginal Relief)
    </span>

    <span className="smr-result-value">
      {formatINR(
        isDomesticCompany
          ? companyFinalSurcharge
          : isForeignCompany
          ? foreignFinalSurcharge
          : 0
      )}
    </span>

  </div>

</div>

        {/* =================================================
            FINAL RESULT
        ================================================= */}
<div className="smr-final-result">

  <div className="smr-final-label">
    Total Tax After Marginal Relief
  </div>

  <div className="smr-final-value">

   {formatINR(
  isDomesticCompany
    ? companyTaxAfterMarginalRelief
    : isForeignCompany
    ? foreignTaxAfterMarginalRelief
    : 0
)}

  </div>

</div>


<div className="smr-result-item">

  <span className="smr-result-label">
    Health & Education Cess @ 4%
  </span>

  <span className="smr-result-value">

    {formatINR(
  isDomesticCompany
    ? companyCess
    : isForeignCompany
    ? foreignCess
    : 0
)}

  </span>

</div>


<div className="smr-final-result">

  <div className="smr-final-label">
    Final Tax Including Cess
  </div>

  <div className="smr-final-value">

   {formatINR(
  isDomesticCompany
    ? companyFinalTaxIncludingCess
    : isForeignCompany
    ? foreignFinalTaxIncludingCess
    : 0
)}

  </div>

</div>

      </div>   
    </div>    

 </div>
  </>     

);
}

