// ============================================================
// Section 234C Calculation Engine
// AY 2026-27
//
// IMPORTANT:
// This file contains calculation helpers extracted from
// Section234CCalculatorAY2026_27.jsx.
//
// Existing calculation logic should remain unchanged.
// UI / JSX / CSS is NOT handled here.
// ============================================================


// ============================================================
// BASIC HELPERS
// ============================================================

export const num = (value) => {
  if (value === null || value === undefined) return 0;

  const cleaned = String(value)
    .replace(/,/g, "")
    .trim();

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
};


export const formatCurrency = (amount) =>
  Number(Math.round(amount || 0)).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });


export const roundDownTo100 = (amount) =>
  Math.floor(Math.max(Number(amount) || 0, 0) / 100) * 100;


// ============================================================
// SLAB TAX
// ============================================================

export const calculateSlabTax = (taxableIncome, slabs) => {
  const incomeAmount = Math.max(
    Number(taxableIncome) || 0,
    0
  );

  let tax = 0;

  slabs.forEach((slab) => {
    if (incomeAmount > slab.from) {
      const amountInSlab =
        Math.min(incomeAmount, slab.to) - slab.from;

      tax += amountInSlab * (slab.rate / 100);
    }
  });

  return Math.max(tax, 0);
};


// ============================================================
// BASIC EXEMPTION
// ============================================================

export const getBasicExemption = ({
  regime,
  ageCategory,
}) => {
  if (regime === "new") {
    return 400000;
  }

  if (ageCategory === "senior") {
    return 300000;
  }

  if (ageCategory === "super_senior") {
    return 500000;
  }

  return 250000;
};


// ============================================================
// INDIVIDUAL / AOP SLAB TAX
// ============================================================

export const getIndividualSlabTax = ({
  amount,
  regime,
  ageCategory,
}) => {
  const incomeAmount = Math.max(
    Number(amount) || 0,
    0
  );

  if (regime === "new") {
    return calculateSlabTax(incomeAmount, [
      {
        from: 0,
        to: 400000,
        rate: 0,
      },
      {
        from: 400000,
        to: 800000,
        rate: 5,
      },
      {
        from: 800000,
        to: 1200000,
        rate: 10,
      },
      {
        from: 1200000,
        to: 1600000,
        rate: 15,
      },
      {
        from: 1600000,
        to: 2000000,
        rate: 20,
      },
      {
        from: 2000000,
        to: 2400000,
        rate: 25,
      },
      {
        from: 2400000,
        to: Infinity,
        rate: 30,
      },
    ]);
  }

  if (ageCategory === "super_senior") {
    return calculateSlabTax(incomeAmount, [
      {
        from: 0,
        to: 500000,
        rate: 0,
      },
      {
        from: 500000,
        to: 1000000,
        rate: 20,
      },
      {
        from: 1000000,
        to: Infinity,
        rate: 30,
      },
    ]);
  }

  if (ageCategory === "senior") {
    return calculateSlabTax(incomeAmount, [
      {
        from: 0,
        to: 300000,
        rate: 0,
      },
      {
        from: 300000,
        to: 500000,
        rate: 5,
      },
      {
        from: 500000,
        to: 1000000,
        rate: 20,
      },
      {
        from: 1000000,
        to: Infinity,
        rate: 30,
      },
    ]);
  }

  return calculateSlabTax(incomeAmount, [
    {
      from: 0,
      to: 250000,
      rate: 0,
    },
    {
      from: 250000,
      to: 500000,
      rate: 5,
    },
    {
      from: 500000,
      to: 1000000,
      rate: 20,
    },
    {
      from: 1000000,
      to: Infinity,
      rate: 30,
    },
  ]);
};


// ============================================================
// CO-OPERATIVE SOCIETY NORMAL TAX
// ============================================================

export const getCooperativeNormalTax = (amount) =>
  calculateSlabTax(amount, [
    {
      from: 0,
      to: 10000,
      rate: 10,
    },
    {
      from: 10000,
      to: 20000,
      rate: 20,
    },
    {
      from: 20000,
      to: Infinity,
      rate: 30,
    },
  ]);


// ============================================================
// ORDINARY TAX
// ============================================================

export const calculateOrdinaryTax = ({
  ordinaryIncome,
  status,
  regime,
  ageCategory,
  selectedDomesticCompanyOption,
  selectedForeignCompanyOption,
  selectedCooperativeOption,
}) => {
  const amount = Math.max(
    Number(ordinaryIncome) || 0,
    0
  );

  if (
    status === "individual_group" ||
    status === "aop_company_group"
  ) {
    return getIndividualSlabTax({
      amount,
      regime,
      ageCategory,
    });
  }

  if (status === "firm_llp_local") {
    return amount * 0.3;
  }

  if (status === "domestic_company") {
    return (
      amount *
      (
        Number(selectedDomesticCompanyOption?.rate) || 0
      ) /
      100
    );
  }

  if (status === "foreign_company") {
    return (
      amount *
      (
        Number(selectedForeignCompanyOption?.rate) || 0
      ) /
      100
    );
  }

  if (status === "cooperative_society") {
    if (
      selectedCooperativeOption?.value === "normal"
    ) {
      return getCooperativeNormalTax(amount);
    }

    return (
      amount *
      (
        Number(selectedCooperativeOption?.rate) || 0
      ) /
      100
    );
  }

  return 0;
};


// ============================================================
// SURCHARGE RATE
// ============================================================

export const getSurchargeRate = ({
  totalIncome,
  adjustedIncomeForEnhancedSurcharge = totalIncome,
  status,
  regime,
  selectedDomesticCompanyOption,
  selectedCooperativeOption,
}) => {
  const incomeAmount = Math.max(
    Number(totalIncome) || 0,
    0
  );

  if (status === "individual_group") {

    const enhancedSurchargeIncome =
      adjustedIncomeForEnhancedSurcharge ??
      incomeAmount;

    // Above 5 crore
    if (enhancedSurchargeIncome > 50000000) {
      return regime === "new" ? 25 : 37;
    }

    // Above 2 crore
    if (enhancedSurchargeIncome > 20000000) {
      return 25;
    }

    // Above 1 crore
    if (incomeAmount > 10000000) {
      return 15;
    }

    // Above 50 lakh
    if (incomeAmount > 5000000) {
      return 10;
    }

    return 0;
  }


  if (status === "aop_company_group") {

    const enhancedSurchargeIncome =
      adjustedIncomeForEnhancedSurcharge ??
      incomeAmount;

    if (enhancedSurchargeIncome > 20000000) {
      return 15;
    }

    if (incomeAmount > 10000000) {
      return 15;
    }

    if (incomeAmount > 5000000) {
      return 10;
    }

    return 0;
  }


  if (status === "firm_llp_local") {
    return incomeAmount > 10000000
      ? 12
      : 0;
  }


  if (status === "domestic_company") {

    if (
      selectedDomesticCompanyOption?.fixedSurchargeRate !==
      null &&
      selectedDomesticCompanyOption?.fixedSurchargeRate !==
      undefined
    ) {
      return selectedDomesticCompanyOption.fixedSurchargeRate;
    }

    if (incomeAmount > 100000000) {
      return 12;
    }

    if (incomeAmount > 10000000) {
      return 7;
    }

    return 0;
  }


  if (status === "foreign_company") {

    if (incomeAmount > 100000000) {
      return 5;
    }

    if (incomeAmount > 10000000) {
      return 2;
    }

    return 0;
  }


  if (status === "cooperative_society") {

    if (
      selectedCooperativeOption?.fixedSurchargeRate !==
      null &&
      selectedCooperativeOption?.fixedSurchargeRate !==
      undefined
    ) {
      return selectedCooperativeOption.fixedSurchargeRate;
    }

    if (incomeAmount > 100000000) {
      return 12;
    }

    if (incomeAmount > 10000000) {
      return 7;
    }

    return 0;
  }


  return 0;
};


// ============================================================
// SURCHARGE THRESHOLD INFORMATION
// ============================================================

export const getSurchargeThresholdInfo = ({
  totalIncome,
  status,
  selectedDomesticCompanyOption,
  selectedCooperativeOption,
}) => {
  const incomeAmount = Math.max(
    Number(totalIncome) || 0,
    0
  );


  if (status === "individual_group") {

    if (incomeAmount > 50000000) {
      return {
        threshold: 50000000,
        previousRate: 25,
      };
    }

    if (incomeAmount > 20000000) {
      return {
        threshold: 20000000,
        previousRate: 15,
      };
    }

    if (incomeAmount > 10000000) {
      return {
        threshold: 10000000,
        previousRate: 10,
      };
    }

    if (incomeAmount > 5000000) {
      return {
        threshold: 5000000,
        previousRate: 0,
      };
    }

    return null;
  }


  if (status === "aop_company_group") {

    if (incomeAmount > 10000000) {
      return {
        threshold: 10000000,
        previousRate: 10,
      };
    }

    if (incomeAmount > 5000000) {
      return {
        threshold: 5000000,
        previousRate: 0,
      };
    }

    return null;
  }


  if (status === "firm_llp_local") {

    if (incomeAmount > 10000000) {
      return {
        threshold: 10000000,
        previousRate: 0,
      };
    }

    return null;
  }


  if (status === "domestic_company") {

    if (
      selectedDomesticCompanyOption?.fixedSurchargeRate !==
      null &&
      selectedDomesticCompanyOption?.fixedSurchargeRate !==
      undefined
    ) {
      return null;
    }

    if (incomeAmount > 100000000) {
      return {
        threshold: 100000000,
        previousRate: 7,
      };
    }

    if (incomeAmount > 10000000) {
      return {
        threshold: 10000000,
        previousRate: 0,
      };
    }

    return null;
  }


  if (status === "foreign_company") {

    if (incomeAmount > 100000000) {
      return {
        threshold: 100000000,
        previousRate: 2,
      };
    }

    if (incomeAmount > 10000000) {
      return {
        threshold: 10000000,
        previousRate: 0,
      };
    }

    return null;
  }


  if (status === "cooperative_society") {

    if (
      selectedCooperativeOption?.fixedSurchargeRate !==
      null &&
      selectedCooperativeOption?.fixedSurchargeRate !==
      undefined
    ) {
      return null;
    }

    if (incomeAmount > 100000000) {
      return {
        threshold: 100000000,
        previousRate: 7,
      };
    }

    if (incomeAmount > 10000000) {
      return {
        threshold: 10000000,
        previousRate: 0,
      };
    }

    return null;
  }


  return null;
};


// ============================================================
// PERIOD INCOME
// ============================================================

export const getPeriodIncome = ({
  periodKey,
  income,
}) => {
  const order = [
    "jun15",
    "sep15",
    "dec15",
    "mar15",
    "mar31",
  ];

  const currentIndex =
    order.indexOf(periodKey);


  const cumulative = (rowKey) => {
    return order
      .slice(0, currentIndex + 1)
      .reduce(
        (sum, key) =>
          sum +
          num(
            income?.[rowKey]?.[key]
          ),
        0
      );
  };


  // Normal income frozen rahega
  const normalIncome =
    num(income?.normalIncome?.jun15);


  // Quarter-wise cumulative income
  const dividendIncome =
    cumulative("dividendIncome");

  const stcgSlabIncome =
    cumulative("stcgSlabIncome");

  const ltcg125 =
    cumulative("ltcg125");

  const ltcg112a =
    cumulative("ltcg112a");

  const stcg111a =
    cumulative("stcg111a");

  const vdaIncome =
    cumulative("vdaIncome");


  let presumptiveIncome = 0;

  if (periodKey === "mar15") {
    presumptiveIncome =
      num(
        income?.presumptiveIncome?.mar15
      );
  }

  if (periodKey === "mar31") {
    presumptiveIncome =
      num(
        income?.presumptiveIncome?.mar31
      );
  }


  return {
    normalIncome,
    dividendIncome,
    stcgSlabIncome,
    presumptiveIncome,
    ltcg125,
    ltcg112a,
    stcg111a,
    vdaIncome,
  };
};
export const calculateTaxForPeriod = ({
  periodKey,
  income,
  commonCredit,
  status,
  regime,
  ageCategory,
  seniorNoBusiness,
  selectedDomesticCompanyOption,
  selectedForeignCompanyOption,
  selectedCooperativeOption,
}) => {
  const data = getPeriodIncome({
    periodKey,
    income,
  });
  const normalBaseIncome = data.normalIncome + data.presumptiveIncome;
  const ordinaryWithoutDividend = normalBaseIncome + data.stcgSlabIncome;
  const ordinaryWithDividend = ordinaryWithoutDividend + data.dividendIncome;
  const normalIncomeTotal = ordinaryWithDividend;
  const specialIncomeTotal = data.ltcg125 + data.ltcg112a + data.stcg111a + data.vdaIncome;
  const totalIncome = normalIncomeTotal + specialIncomeTotal;
  const no234cForSenior = status === "individual_group" && seniorNoBusiness && (ageCategory === "senior" || ageCategory === "super_senior");

    if (no234cForSenior) {
      return {
        ...data,
        ordinaryWithoutDividend,
        ordinaryWithDividend,
        normalIncomeTotal,
        specialIncomeTotal,
        totalIncome,
        normalTax: 0,
        stcgSlabTax: 0,
        dividendTax: 0,
        ltcg125Tax: 0,
        ltcg112aTax: 0,
        stcg111aTax: 0,
        vdaTax: 0,
        totalTax: 0,
        specialTax: 0,
        surchargeRate: 0,
        rawSurcharge: 0,
        marginalRelief: 0,
        surcharge: 0,
        cess: 0,
        taxWithSurchargeAndCess: 0,
        commonCreditAmount: num(commonCredit),
        balanceTax: 0,
      };
    }
const taxOnNormalBase = calculateOrdinaryTax({
  ordinaryIncome: normalBaseIncome,
  status,
  regime,
  ageCategory,
  selectedDomesticCompanyOption,
  selectedForeignCompanyOption,
  selectedCooperativeOption,
});

const taxWithoutDividend = calculateOrdinaryTax({
  ordinaryIncome: ordinaryWithoutDividend,
  status,
  regime,
  ageCategory,
  selectedDomesticCompanyOption,
  selectedForeignCompanyOption,
  selectedCooperativeOption,
});

const taxWithDividend = calculateOrdinaryTax({
  ordinaryIncome: ordinaryWithDividend,
  status,
  regime,
  ageCategory,
  selectedDomesticCompanyOption,
  selectedForeignCompanyOption,
  selectedCooperativeOption,
});

const normalTax = taxOnNormalBase;
const stcgSlabTax = Math.max(taxWithoutDividend - taxOnNormalBase, 0);
const dividendTax = Math.max(taxWithDividend - taxWithoutDividend, 0);

   let ltcg125Taxable = data.ltcg125;
let ltcg112aTaxable = Math.max(data.ltcg112a - 125000, 0);
let stcg111aTaxable = data.stcg111a;
let vdaIncomeTaxable = data.vdaIncome;

if (status === "individual_group" || status === "aop_company_group") {
  // =========================================================
  // BASIC EXEMPTION ADJUSTMENT ORDER
  //
  // 1. Normal Income + Dividend
  // 2. STCG - Slab Rate
  // 3. STCG u/s 111A
  // 4. LTCG u/s 112 @ 12.5%
  // 5. LTCG u/s 112A @ 12.5%
  // 6. VDA u/s 115BBH
  // =========================================================

  const normalIncomeForExemption =
    data.normalIncome +
    data.presumptiveIncome +
    data.dividendIncome;

 let unusedBasicExemption = Math.max(
  getBasicExemption({
    regime,
    ageCategory,
  }) - normalIncomeForExemption,
  0
);

  // ---------------------------------------------------------
  // 1. STCG - Slab Rate
  // ---------------------------------------------------------
  const adjustStcgSlab = Math.min(
    unusedBasicExemption,
    data.stcgSlabIncome
  );

  unusedBasicExemption -= adjustStcgSlab;

  // ---------------------------------------------------------
  // 2. STCG u/s 111A
  // ---------------------------------------------------------
  const adjust111A = Math.min(
    unusedBasicExemption,
    stcg111aTaxable
  );

  stcg111aTaxable -= adjust111A;
  unusedBasicExemption -= adjust111A;

  // ---------------------------------------------------------
  // 3. LTCG u/s 112 @ 12.5%
  // ---------------------------------------------------------
  const adjustLtcg125 = Math.min(
    unusedBasicExemption,
    ltcg125Taxable
  );

  ltcg125Taxable -= adjustLtcg125;
  unusedBasicExemption -= adjustLtcg125;

  // ---------------------------------------------------------
  // 4. LTCG u/s 112A @ 12.5%
  // ---------------------------------------------------------
  const adjust112a = Math.min(
    unusedBasicExemption,
    ltcg112aTaxable
  );

  ltcg112aTaxable -= adjust112a;
  unusedBasicExemption -= adjust112a;

}
    const ltcg125Tax = ltcg125Taxable * 0.125;
    const ltcg112aTax = ltcg112aTaxable * 0.125;
    const stcg111aTax = stcg111aTaxable * 0.2;
    const vdaIncomeTax = vdaIncomeTaxable * 0.30;
    const totalTax = normalTax + stcgSlabTax + dividendTax + ltcg125Tax + ltcg112aTax + stcg111aTax +  vdaIncomeTax;
    const specialTax =
  stcgSlabTax +
  dividendTax +
  ltcg125Tax +
  ltcg112aTax +
  stcg111aTax +
  vdaIncomeTax;
  console.log("LTCG 12.5% DEBUG", {
  periodKey,
  ltcg125Income: data.ltcg125,
  ltcg125Taxable,
  ltcg125Tax,
  specialTax,
});
    const adjustedIncomeForEnhancedSurcharge = totalIncome -( data.dividendIncome + data.ltcg125 + data.ltcg112a + data.stcg111a );
   const surchargeRate =
  getSurchargeRate({
    totalIncome,
    adjustedIncomeForEnhancedSurcharge,
    status,
    regime,
    selectedDomesticCompanyOption,
    selectedCooperativeOption,
  });

   // =========================
// SPECIAL RATE SURCHARGE
// =========================

// Capped surcharge rate
const cappedSurchargeRate =
  Math.min(surchargeRate, 15);

// Tax on capped income
const cappedIncomeTax =
  dividendTax +
  ltcg125Tax +
  ltcg112aTax +
  stcg111aTax;

// Tax on non-capped income
const normalIncomeTaxForSurcharge =
  Math.max(
    totalTax - cappedIncomeTax,
    0
  );

// Surcharge on normal income tax
const normalSurcharge =
  normalIncomeTaxForSurcharge *
  (surchargeRate / 100);

// Surcharge on capped income tax
const cappedIncomeSurcharge =
  cappedIncomeTax *
  (cappedSurchargeRate / 100);

// Final surcharge before marginal relief
const rawSurcharge =
  normalSurcharge +
  cappedIncomeSurcharge;

    const calculateThresholdTaxAndSurcharge = (threshold, previousRate) => {
      const thresholdSpecialIncome = data.dividendIncome + data.ltcg125 + data.ltcg112a + data.stcg111a;
      const thresholdOrdinaryWithDividend = Math.max(threshold - thresholdSpecialIncome, 0);
      const thresholdDividendIncome = Math.min(data.dividendIncome, thresholdOrdinaryWithDividend);
      const thresholdTaxWithDividend =
  calculateOrdinaryTax({
    ordinaryIncome:
      thresholdOrdinaryWithDividend,
    status,
    regime,
    ageCategory,
    selectedDomesticCompanyOption,
    selectedForeignCompanyOption,
    selectedCooperativeOption,
  });
      let thresholdLtcg125Taxable = data.ltcg125;
      let thresholdLtcg112aTaxable = Math.max(data.ltcg112a - 125000, 0);
      let thresholdStcg111aTaxable = data.stcg111a;

      if (status === "individual_group" || status === "aop_company_group") {
  const thresholdNormalIncomeForExemption =
    data.normalIncome +
    data.presumptiveIncome +
    data.dividendIncome;

  let thresholdUnusedBasicExemption =
  Math.max(
    getBasicExemption({
      regime,
      ageCategory,
    }) -
      thresholdNormalIncomeForExemption,
    0
  );

  // =========================================================
  // SAME BASIC EXEMPTION ORDER FOR MARGINAL RELIEF
  //
  // 1. Normal Income + Dividend
  // 2. STCG - Slab Rate
  // 3. STCG u/s 111A
  // 4. LTCG u/s 112 @ 12.5%
  // 5. LTCG u/s 112A @ 12.5%
  // =========================================================

  // ---------------------------------------------------------
  // 1. STCG - Slab Rate
  // ---------------------------------------------------------
  const thresholdStcgSlabIncome = Math.min(
    data.stcgSlabIncome,
    Math.max(
      thresholdOrdinaryWithDividend -
        thresholdNormalIncomeForExemption,
      0
    )
  );

  const thresholdAdjustStcgSlab = Math.min(
    thresholdUnusedBasicExemption,
    thresholdStcgSlabIncome
  );

  thresholdUnusedBasicExemption -= thresholdAdjustStcgSlab;

  // ---------------------------------------------------------
  // 2. STCG u/s 111A
  // ---------------------------------------------------------
  const thresholdAdjust111A = Math.min(
    thresholdUnusedBasicExemption,
    thresholdStcg111aTaxable
  );

  thresholdStcg111aTaxable -= thresholdAdjust111A;
  thresholdUnusedBasicExemption -= thresholdAdjust111A;

  // ---------------------------------------------------------
  // 3. LTCG u/s 112 @ 12.5%
  // ---------------------------------------------------------
  const thresholdAdjustLtcg125 = Math.min(
    thresholdUnusedBasicExemption,
    thresholdLtcg125Taxable
  );

  thresholdLtcg125Taxable -= thresholdAdjustLtcg125;
  thresholdUnusedBasicExemption -= thresholdAdjustLtcg125;

  // ---------------------------------------------------------
  // 4. LTCG u/s 112A @ 12.5%
  // ---------------------------------------------------------
  const thresholdAdjust112a = Math.min(
    thresholdUnusedBasicExemption,
    thresholdLtcg112aTaxable
  );

  thresholdLtcg112aTaxable -= thresholdAdjust112a;
  thresholdUnusedBasicExemption -= thresholdAdjust112a;
}

      const thresholdLtcg125Tax = thresholdLtcg125Taxable * 0.125;
      const thresholdLtcg112aTax = thresholdLtcg112aTaxable * 0.125;
      const thresholdStcg111aTax = thresholdStcg111aTaxable * 0.2;
      const thresholdTotalTax =
        thresholdTaxWithDividend +
        thresholdLtcg125Tax +
        thresholdLtcg112aTax +
        thresholdStcg111aTax;

      const thresholdCappedRate = Math.min(previousRate, 15);
      const thresholdDividendTaxForSurcharge =
  thresholdDividendIncome > 0 &&
  thresholdOrdinaryWithDividend > 0
    ? (
        thresholdDividendIncome /
        thresholdOrdinaryWithDividend
      ) * thresholdTaxWithDividend
    : 0;

const thresholdCappedIncomeTax =
  thresholdDividendTaxForSurcharge +
  thresholdLtcg125Tax +
  thresholdLtcg112aTax +
  thresholdStcg111aTax;

const thresholdNormalTaxForSurcharge =
  Math.max(
    thresholdTotalTax -
    thresholdCappedIncomeTax,
    0
  );

const thresholdSurcharge =
  (
    thresholdNormalTaxForSurcharge *
    (previousRate / 100)
  ) +
  (
    thresholdCappedIncomeTax *
    (thresholdCappedRate / 100)
  );

      return {
        thresholdTotalTax,
        thresholdSurcharge,
      };
    };

  const marginalReliefInfo =
  getSurchargeThresholdInfo({
    totalIncome,
    status,
    selectedDomesticCompanyOption,
    selectedCooperativeOption,
  });
    let marginalRelief = 0;

    if (marginalReliefInfo) {
      const { threshold, previousRate } = marginalReliefInfo;
      const { thresholdTotalTax, thresholdSurcharge } = calculateThresholdTaxAndSurcharge(
        threshold,
        previousRate
      );
      const excessIncomeOverThreshold = Math.max(totalIncome - threshold, 0);
      const maximumTaxAndSurcharge =
        thresholdTotalTax + thresholdSurcharge + excessIncomeOverThreshold;
      const currentTaxAndRawSurcharge = totalTax + rawSurcharge;

      marginalRelief = Math.max(
        currentTaxAndRawSurcharge - maximumTaxAndSurcharge,
        0
      );
    }

    const surcharge = Math.max(rawSurcharge - marginalRelief, 0);
    const cess = (totalTax + surcharge) * 0.04;
    const taxWithSurchargeAndCess = totalTax + surcharge + cess;
    const commonCreditAmount = num(commonCredit);
    const balanceTax = Math.max(taxWithSurchargeAndCess - commonCreditAmount, 0);

    return {
      ...data,
      ordinaryWithoutDividend,
      ordinaryWithDividend,
      normalIncomeTotal,
      specialIncomeTotal,
      totalIncome,
      normalTax,
      stcgSlabTax,
      dividendTax,
      ltcg125Tax,
      ltcg112aTax,
      stcg111aTax,
      vdaIncomeTax,
      totalTax,
      specialTax,
      surchargeRate,
      rawSurcharge,
      marginalRelief,
      surcharge,
      cess,
      taxWithSurchargeAndCess,
      commonCreditAmount,
      balanceTax,
    };
  };
