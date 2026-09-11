/* =========================================================
   CONSTANTS
========================================================= */

const ACTIVE_YEARS = [
  "2026-27",
];

const YEAR_OPTIONS = [
  { value: "", label: "Select Assessment Year" },
  { value: "2026-27", label: "AY 2026-27" },
];

const REGIME_OPTIONS = [
  {
    value: "old",
    label: "Old Regime / Old Slab",
  },
  {
    value: "new",
    label: "New Regime / New Slab",
  },
];

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
};

const INDIVIDUAL_THRESHOLD_TAX = {
  
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

const THRESHOLD_PREVIOUS_SURCHARGE_RATE = {
  individual_group: {
    old: {
      R50L: 0,
      R1CR: 10,
      R2CR: 15,
      R5CR: 25,
    },
    new: {
        "2026-27": {
        R50L: 0,
        R1CR: 10,
        R2CR: 15,
        R5CR: 25,
      },
    },
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
      "2026-27": {
        R50L: 10,
        R1CR: 15,
        R2CR: 25,
        R5CR: 25,
      },
    },
  },

};

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
  if (value === null || value === undefined) return 0;

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

// =======================================================
// STEP 4 — INDIVIDUAL SURCHARGE RATE
// =======================================================


function getSurchargeRate({
  ay,
  regime,
  rangeKey,
}) {
  if (!ay || !regime || !rangeKey) {
    return 0;
  }

  if (regime === "old") {
    return (
      SURCHARGE_RULES
        .individual_group
        ?.old?.[rangeKey] || 0
    );
  }

  return (
    SURCHARGE_RULES
      .individual_group
      ?.new?.[ay]?.[rangeKey] || 0
  );
}

function getThresholdPreviousSurchargeRate({
  ay,
  regime,
  rangeKey,
}) {
  if (!ay || !regime || !rangeKey) {
    return 0;
  }

  if (regime === "old") {
    return (
      THRESHOLD_PREVIOUS_SURCHARGE_RATE
        .individual_group
        ?.old?.[rangeKey] || 0
    );
  }

  return (
    THRESHOLD_PREVIOUS_SURCHARGE_RATE
      .individual_group
      ?.new?.[ay]?.[rangeKey] || 0
  );
}

// =======================================================
// STEP 4 — THRESHOLD TAX
// =======================================================

function getThresholdTax({
  ay,
  regime,
  rangeKey,
}) {
  if (!ay || !regime || !rangeKey) {
    return 0;
  }

  return (
    INDIVIDUAL_THRESHOLD_TAX
      ?.[ay]
      ?.[regime]
      ?.[rangeKey] || 0
  );
}

// =======================================================
// STEP 5 — INDIVIDUAL INCOME RANGE ENGINE
// =======================================================

// =======================================================
// STEP 5 — INDIVIDUAL INCOME RANGE ENGINE
// =======================================================

function getRangeKeyForIncome(income) {
  const taxableIncome = Math.max(
    Number(income) || 0,
    0
  );

  if (taxableIncome > 50000000) return "R5CR";
  if (taxableIncome > 20000000) return "R2CR";
  if (taxableIncome > 10000000) return "R1CR";
  if (taxableIncome > 5000000) return "R50L";

  return "";
}


// =======================================================
// STEP 5 — SURCHARGE RATE BY INCOME
// =======================================================

function getSurchargeRateForIncome({
  ay,
  regime,
  income,
}) {
  const incomeRangeKey =
    getRangeKeyForIncome(income);

  if (!incomeRangeKey) {
    return 0;
  }

  return getSurchargeRate({
    ay,
    regime,
    rangeKey: incomeRangeKey,
  });
}


// =======================================================
// STEP 5 — INDIVIDUAL AUTO RANGE ENGINE
// =======================================================

function getIndividualRange(
  ay,
  regime,
  income
) {
  const taxableIncome = Math.max(
    Number(income) || 0,
    0
  );

  if (taxableIncome <= 5000000) {
    return {
      rangeKey: "",
      thresholdIncome: 0,
      surchargeRate: 0,
      previousRate: 0,
      thresholdTax: 0,
      thresholdPayable: 0,
    };
  }

  // -----------------------------------------
  // Range identification
  // -----------------------------------------

  let rangeKey = "";

  if (taxableIncome <= 10000000) {
    rangeKey = "R50L";
  } else if (taxableIncome <= 20000000) {
    rangeKey = "R1CR";
  } else if (taxableIncome <= 50000000) {
    rangeKey = "R2CR";
  } else {
    rangeKey = "R5CR";
  }


  // -----------------------------------------
  // Threshold income
  // -----------------------------------------

  const thresholdIncome =
    RANGE_OPTIONS
      .individual_group
      .find(
        (item) => item.key === rangeKey
      )
      ?.thresholdIncome || 0;

  // -----------------------------------------
  // Threshold tax
  // -----------------------------------------

   const thresholdTax =
    getThresholdTax({
      ay,
      regime,
      rangeKey,
    });
  // -----------------------------------------
  // Current surcharge
  // -----------------------------------------

  let surchargeRate = 0;

  if (regime === "old") {
    surchargeRate =
      SURCHARGE_RULES
        .individual_group
        ?.old
        ?.[rangeKey] || 0;
  } else {
    surchargeRate =
      SURCHARGE_RULES
        .individual_group
        ?.new
        ?.[ay]
        ?.[rangeKey] || 0;
  }

  // -----------------------------------------
  // Previous surcharge
  // -----------------------------------------

  let previousRate = 0;

  if (regime === "old") {
    previousRate =
      THRESHOLD_PREVIOUS_SURCHARGE_RATE
        .individual_group
        ?.old
        ?.[rangeKey] || 0;
  } else {
    previousRate =
      THRESHOLD_PREVIOUS_SURCHARGE_RATE
        .individual_group
        ?.new
        ?.[ay]
        ?.[rangeKey] || 0;
  }

  // -----------------------------------------
  // Threshold payable
  // -----------------------------------------

   const thresholdPayable =
    thresholdTax +
    (thresholdTax * previousRate) / 100;

  return {
    rangeKey,
    thresholdIncome,
    surchargeRate,
    previousRate,
    thresholdTax,
    thresholdPayable,
  };
}



// =======================================================
// STEP 6 — SPECIAL RATE TAX CALCULATION
// =======================================================

function calculateSpecialRateTaxes({
  ay,
  totalIncome,
  normalTax,
  income111A = 0,
  income112 = 0,
  income112A = 0,
  dividendIncome = 0,
}) {
  const income = Math.max(
    Number(totalIncome) || 0,
    0
  );


  const rules =
    SPECIAL_RATE_RULES[ay] ||
    SPECIAL_RATE_RULES["2026-27"];

  const amount111A = Math.max(
    Number(income111A) || 0,
    0
  );

  const amount112 = Math.max(
    Number(income112) || 0,
    0
  );

  const amount112A = Math.max(
    Number(income112A) || 0,
    0
  );

  const dividendAmount = Math.max(
    Number(dividendIncome) || 0,
    0
  );

  const specialIncome =
    amount111A +
    amount112 +
    amount112A +
    dividendAmount;

  const normalIncome = Math.max(
    income - specialIncome,
    0
  );



  // =====================================================
  // SECTION 111A
  // =====================================================

  const taxable111AIncome = amount111A;

  const tax111A =
    taxable111AIncome *
    (rules.rate111A / 100);


  // =====================================================
  // SECTION 112A
  // =====================================================

   const taxable112AIncome = Math.max(
    amount112A -
      rules.exemption112A,
    0
  );

  const tax112A =
    taxable112AIncome *
    (rules.rate112A / 100);


  // =====================================================
  // SECTION 112
  // =====================================================

 const taxable112Income = amount112;

  const tax112 =
    taxable112Income *
    (rules.rate112 / 100);


  // =====================================================
  // DIVIDEND TAX — PROPORTIONATE
  // =====================================================

 

  const normalTaxAmount =
    Math.max(
      Number(normalTax) || 0,
      0
    );


  const normalIncomeWithDividend =
    normalIncome + dividendAmount;

  // Placeholder — existing logic preserved
   const dividendTax =
    normalIncomeWithDividend > 0
      ? normalTaxAmount *
        (
          dividendAmount /
          normalIncomeWithDividend
        )
      : 0;


  // =====================================================
  // TRIGGER INCOME
  // =====================================================

    const triggerIncome =
    income -
    dividendAmount -
    taxable111AIncome -
    taxable112Income -
    taxable112AIncome;


  // =====================================================
  // RETURN
  // =====================================================

  return {
    income,

    specialIncome,

    normalIncome,

    taxable111AIncome,
    taxable112Income,
    taxable112AIncome,

    income112A: amount112A,

    tax111A,
    tax112,
    tax112A,

    dividendIncome: dividendAmount,

    dividendTax,

    restrictedTax:
      tax111A +
      tax112 +
      tax112A,

    triggerIncome,
  };
}
// =======================================================
// STEP 7 — 25% SURCHARGE APPLICABILITY
// =======================================================


function is25PercentSurchargeApplicable({
  totalIncome,
  triggerIncome,
}) {
  const income =
    Number(totalIncome) || 0;

  const trigger =
    Number(triggerIncome) || 0;

  if (income < 20000000) {
    return false;
  }

  if (trigger < 20000000) {
    return false;
  }

  return true;
}

// =======================================================
// STEP 8 — INDIVIDUAL MARGINAL RELIEF ENGINE
// INITIAL DATA / RANGE SETUP
// =======================================================

function calculateIndividualMarginalRelief({
  ay,
  regime,
  totalIncome,
  normalTax,
  specialTax,
  manualThresholdPayable = null,
}) {
  const income = Math.max(
    Number(totalIncome) || 0,
    0
  );

  const normalTaxAmount = Math.max(
    Number(normalTax) || 0,
    0
  );

  const {
    normalIncome: otherIncome,
    specialIncome:
      restrictedIncomeAmount,

    taxable111AIncome,
    taxable112Income,
    taxable112AIncome,

    income112A,

    tax111A:
      tax111AAmount,

    tax112:
      tax112Amount,

    tax112A:
      tax112AAmount,

    dividendIncome:
      dividendIncomeAmount,

    dividendTax:
      dividendTaxAmount,

    restrictedTax:
      restrictedTaxPortion,
  } = specialTax;

const dividendSpecialRateSurcharge =
  (
    toNumber(tax111AAmount) +
    toNumber(tax112Amount) +
    toNumber(tax112AAmount) +
    toNumber(dividendTaxAmount)
  ) * 15 / 100;
  // =====================================================
  // INDIVIDUAL RANGE
  // =====================================================

  const range =
    getIndividualRange(
      ay,
      regime,
      income
    );



  // =====================================================
  // NORMAL INCOME RANGE
  // =====================================================

  const normalRange = getIndividualRange(
    ay,
    regime,
    otherIncome
  );
 /* -------------------------------------------------------
     THRESHOLD DATA
  ------------------------------------------------------- */

  const thresholdIncome =
    range.thresholdIncome;

  let thresholdTax =
    range.thresholdTax;

  const previousRate =
    range.previousRate;

  const surchargeRate =
    range.surchargeRate;

  // =====================================================
  // TRIGGER INCOME
  // =====================================================

const triggerIncome =
    income -
    dividendIncomeAmount -
    taxable111AIncome -
    taxable112Income -
    taxable112AIncome;
  // =====================================================
  // 25% SURCHARGE CHECK
  // =====================================================
 const is25Applicable =
    is25PercentSurchargeApplicable({
      totalIncome: income,
      triggerIncome,
    });


  // =====================================================
  // THRESHOLD DATA
  // =====================================================

  const isOneCroreThreshold =
    thresholdIncome === 10000000;

  const isTwoCroreThreshold =
    thresholdIncome === 20000000;

  const isFiveCroreThreshold =
    thresholdIncome === 50000000;

  const shouldAdjustThresholdTax =
    restrictedIncomeAmount > 0 &&
    (
      isOneCroreThreshold ||
      (
        isTwoCroreThreshold &&
        is25Applicable
      ) ||
      (
        isFiveCroreThreshold &&
        regime === "old"
      )
    );


 if (shouldAdjustThresholdTax) {
    const totalSpecialIncome =
      taxable111AIncome +
      taxable112Income +
      income112A +
      (
        isTwoCroreThreshold
          ? dividendIncomeAmount
          : 0
      );

    const totalSpecialTax =
      tax111AAmount +
      tax112Amount +
      tax112AAmount +
      (
        isTwoCroreThreshold
          ? dividendIncomeAmount * 0.30
          : 0
      );

    thresholdTax =
      thresholdTax -
      (
        totalSpecialIncome * 0.30
      ) + 
      totalSpecialTax;
  }


// =======================================================
// THRESHOLD PAYABLE
// =======================================================


  const thresholdPayable =
    manualThresholdPayable !== null &&
    manualThresholdPayable !== undefined &&
    manualThresholdPayable !== ""
      ? Number(manualThresholdPayable)
      : (
          thresholdTax +
          (
            thresholdTax *
            previousRate
          ) / 100
        );

// =======================================================
// STEP 10 — SURCHARGE SPLIT
// =======================================================
  const shouldSplitSurcharge =
    is25Applicable &&
    restrictedIncomeAmount > 0;

  let normalSurchargeRate =
    surchargeRate;

  let restrictedSurchargeRate = 0;

  if (shouldSplitSurcharge) {
    normalSurchargeRate =
      normalRange.surchargeRate;

    restrictedSurchargeRate =
      Math.min(
        surchargeRate,
        15
      );
  }

// =======================================================
// DIVIDEND TAX AT 30%
// =======================================================

  const dividendTaxAt30 =
    dividendIncomeAmount * 0.30;
// =======================================================
// EFFECTIVE NORMAL TAX
// =======================================================

  const effectiveNormalTax =
    Math.max(
      normalTaxAmount -
      dividendTaxAt30 +
      (
        dividendTaxAt30 -
        dividendTaxAmount
      ),
      0
    );

// =======================================================
// EFFECTIVE RESTRICTED TAX
// =======================================================
 const effectiveRestrictedTax =
    tax111AAmount +
    tax112Amount +
    tax112AAmount;
// =======================================================
// TOTAL TAX BEFORE SURCHARGE
// =======================================================

  const totalTax =
    normalTaxAmount +
    effectiveRestrictedTax;

// =======================================================
// STEP 11 — SURCHARGE CALCULATION
// =======================================================

  const normalTaxForSurcharge =
    effectiveNormalTax;

// =======================================================
// FINAL NORMAL SURCHARGE RATE
// =======================================================
 const finalNormalRate =
    income >= 20000000 &&
    !is25Applicable
      ? normalRange.surchargeRate
      : normalSurchargeRate;
// =======================================================
// NORMAL SURCHARGE
// =======================================================

  const normalSurcharge =
    shouldSplitSurcharge
      ? (
          normalTaxForSurcharge *
          finalNormalRate
        ) / 100
      : (
          totalTax *
          finalNormalRate
        ) / 100;
// =======================================================
// RESTRICTED INCOME SURCHARGE
// =======================================================
 const restrictedSurcharge =
    shouldSplitSurcharge
      ? (
          (
            restrictedTaxPortion +
            dividendTaxAmount
          ) *
          restrictedSurchargeRate
        ) / 100
      : 0;

// =======================================================
// SURCHARGE BEFORE MARGINAL RELIEF
// =======================================================
  const surchargeBeforeRelief =
    normalSurcharge +
    restrictedSurcharge;

// =======================================================
// TOTAL TAX INCLUDING SURCHARGE
// =======================================================
  const totalTaxWithSurcharge =
    totalTax +
    surchargeBeforeRelief;
// =======================================================
// MARGINAL RELIEF
// =======================================================
// Income exceeding the applicable threshold

const excessIncome =
    Math.max(
      income -
      thresholdIncome,
      0
    );

  const balanceRemainingIncome =
    excessIncome;
// =======================================================
// TAX ON EXCESS INCOME
// =======================================================
// Marginal relief comparison rate = 30%

  const taxOnExcessIncome =
    (
      excessIncome * 30
    ) / 100;

// =======================================================
// ALLOWABLE NET SURCHARGE
// =======================================================
  const allowableNetSurcharge =
    Math.max(
      excessIncome -
      taxOnExcessIncome,
      0
    );

// =======================================================
// EXCESS TAX PAYABLE
// =======================================================

  const excessTaxPayable =
    Math.max(
      totalTaxWithSurcharge -
      thresholdPayable,
      0
    );

// =======================================================
// STEP 13 — MARGINAL RELIEF
// =======================================================  
const rawMarginalRelief =
    Math.max(
      surchargeBeforeRelief -
      allowableNetSurcharge,
      0
    );

  let marginalRelief = 0;

  if (thresholdIncome === 5000000) {
    marginalRelief =
      Math.min(
        rawMarginalRelief,
        surchargeBeforeRelief
      );
  } else {
    marginalRelief =
      Math.min(
        Math.max(
          excessTaxPayable -
          balanceRemainingIncome,
          0
        ),
        surchargeBeforeRelief
      );
  }

  if (
    thresholdIncome === 20000000 &&
    !is25Applicable
  ) {
    marginalRelief = 0;
  }

  // ======================================================
// OPTION B
// PROPORTIONAL MARGINAL RELIEF SPLIT
// ======================================================

 const normalMarginalRelief =
    shouldSplitSurcharge
      ? (
          surchargeBeforeRelief > 0
            ? marginalRelief *
              (
                normalSurcharge /
                surchargeBeforeRelief
              )
            : 0
        )
      : marginalRelief;

  const restrictedMarginalRelief =
    shouldSplitSurcharge
      ? (
          surchargeBeforeRelief > 0
            ? marginalRelief *
              (
                restrictedSurcharge /
                surchargeBeforeRelief
              )
            : 0
        )
      : 0;

// ======================================================
// FINAL SURCHARGE
// ======================================================


  const finalNormalSurcharge =
    Math.max(
      normalSurcharge -
      normalMarginalRelief,
      0
    );

  const finalRestrictedSurcharge =
    Math.max(
      restrictedSurcharge -
      restrictedMarginalRelief,
      0
    );

  const finalSurcharge =
    finalNormalSurcharge +
    finalRestrictedSurcharge;

// =======================================================
// FINAL TAX
// =======================================================

const taxAfterMarginalRelief =
    totalTax +
    finalSurcharge;

  const cess =
    taxAfterMarginalRelief * 0.04;

  const totalTaxAfterMarginalRelief =
    taxAfterMarginalRelief +
    cess;

  const isRestrictedSurchargeCase =
    restrictedIncomeAmount > 0 &&
    surchargeRate > 15;

  const isMarginalReliefApplicable =
    marginalRelief > 0;

  const displaySurchargeRate =
    shouldSplitSurcharge
      ? `${normalSurchargeRate}% / ${restrictedSurchargeRate}%`
      : `${finalNormalRate}%`;

 return {
    income,

    thresholdIncome,
    thresholdTax,
    thresholdPayable,

     previousSurchargeRate: previousRate,
     previousSurchargeAmount:
    (thresholdTax * previousRate) / 100,
    surchargeRate,

    otherIncome,
    restrictedIncomeAmount,

    taxable111AIncome,
    taxable112Income,
    taxable112AIncome,

    tax111AAmount,
    tax112Amount,
    tax112AAmount,

    dividendIncomeAmount,
    dividendTaxAmount,
   tax111AAmount,
  tax112Amount,
  tax112AAmount,
  dividendTaxAmount,
    normalTax: Math.max(
  normalTaxAmount - dividendTaxAmount,
  0
),

    restrictedTaxPortion:
      restrictedTaxPortion,

    totalTax,

    triggerIncome,

    is25Applicable,

    shouldSplitSurcharge,

    normalSurchargeRate,
    restrictedSurchargeRate,

    finalNormalRate,
    displaySurchargeRate,
  dividendSpecialRateSurcharge,
    normalSurcharge,
    restrictedSurcharge,

    surchargeBeforeRelief,

    totalTaxWithSurcharge,

    excessIncome,
    balanceRemainingIncome,

    taxOnExcessIncome,
    allowableNetSurcharge,

    excessTaxPayable,

    rawMarginalRelief,
    marginalRelief,

    normalMarginalRelief,
    restrictedMarginalRelief,

    finalNormalSurcharge,
    finalRestrictedSurcharge,

    finalSurcharge,

    cess,

    totalTaxAfterMarginalRelief,

    isRestrictedSurchargeCase,
    isMarginalReliefApplicable,
  };
}
export {
  toNumber,
  formatINR,
  getSurchargeRate,
  getThresholdPreviousSurchargeRate,
  getThresholdTax,
  getRangeKeyForIncome,
  getSurchargeRateForIncome,
  getIndividualRange,
  calculateSpecialRateTaxes,
  is25PercentSurchargeApplicable,
  calculateIndividualMarginalRelief,
};