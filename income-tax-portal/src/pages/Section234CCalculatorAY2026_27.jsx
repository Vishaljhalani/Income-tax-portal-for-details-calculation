import React, { useMemo, useState } from "react";

export default function Section234CCalculatorAY2026_27() {
  const ASSESSMENT_YEAR = "2026-27";
  const FINANCIAL_YEAR = "2025-26";

  const periods = [
    { key: "jun15", label: "Up to 15/6", dueDate: "15/06/2025" },
    { key: "sep15", label: "Up to 15/9", dueDate: "15/09/2025" },
    { key: "dec15", label: "Up to 15/12", dueDate: "15/12/2025" },
    { key: "mar15", label: "Up to 15/3", dueDate: "15/03/2026" },
    { key: "mar31", label: "Up to 31/3", dueDate: "31/03/2026" },
  ];

  const installments = [
    { key: "jun15", title: "1st Installment", dueDate: "15/06/2025", duePercent: 15, minimumPercent: 12, months: 3 },
    { key: "sep15", title: "2nd Installment", dueDate: "15/09/2025", duePercent: 45, minimumPercent: 36, months: 3 },
    { key: "dec15", title: "3rd Installment", dueDate: "15/12/2025", duePercent: 75, minimumPercent: 75, months: 3 },
    { key: "mar15", title: "4th Installment", dueDate: "15/03/2026", duePercent: 100, minimumPercent: 100, months: 1 },
  ];

  const statusOptions = [
    { value: "individual_group", label: "Individual / HUF / AOP / BOI / Artificial Juridical Person" },
    { value: "aop_company_group", label: "AOP" },
    { value: "firm_llp_local", label: "Firm / LLP / Local Authority" },
    { value: "domestic_company", label: "Domestic Company" },
    { value: "foreign_company", label: "Foreign Company" },
    { value: "cooperative_society", label: "Co-operative Society" },
  ];

  const regimeOptions = [
    { value: "new", label: "New Regime / Section 115BAC" },
    { value: "old", label: "Old Regime" },
  ];

  const ageOptions = [
    { value: "below_60", label: "Below 60 years / HUF / AOP / BOI / AJP" },
    { value: "senior", label: "Resident Senior Citizen" },
    { value: "super_senior", label: "Resident Super Senior Citizen" },
  ];

  const domesticCompanyOptions = [
    { value: "turnover_400cr", label: "Turnover/Gross Receipts during PY 2023-24 does not exceed ₹400 crore", rate: 25, fixedSurchargeRate: null },
    { value: "section_115BA", label: "Section 115BA", rate: 25, fixedSurchargeRate: null },
    { value: "section_115BAA", label: "Section 115BAA", rate: 22, fixedSurchargeRate: 10 },
    { value: "section_115BAB", label: "Section 115BAB", rate: 15, fixedSurchargeRate: 10 },
    { value: "other_domestic_company", label: "Any other Domestic Company", rate: 30, fixedSurchargeRate: null },
  ];

  const foreignCompanyOptions = [
    { value: "royalty_fts", label: "Royalty / FTS from Government or Indian concern under approved agreement", rate: 50 },
    { value: "other_foreign_income", label: "Any other income", rate: 35 },
  ];

  const cooperativeOptions = [
    { value: "normal", label: "Normal Co-operative Society", rate: null, fixedSurchargeRate: null },
    { value: "section_115BAD", label: "Section 115BAD", rate: 22, fixedSurchargeRate: 10 },
    { value: "section_115BAE", label: "Section 115BAE", rate: 15, fixedSurchargeRate: 10 },
  ];

  const initialIncome = {
    normalIncome: { jun15: "", sep15: "", dec15: "", mar15: "", mar31: "" },
    dividendIncome: { jun15: "", sep15: "", dec15: "", mar15: "", mar31: "" },
    stcgSlabIncome: {jun15: "",sep15: "",dec15: "",mar15: "",mar31: "",},
    presumptiveIncome: { jun15: "", sep15: "", dec15: "", mar15: "", mar31: "" },
    ltcg125: { jun15: "", sep15: "", dec15: "", mar15: "", mar31: "" },
    ltcg112a: { jun15: "", sep15: "", dec15: "", mar15: "", mar31: "" },
    stcg111a: { jun15: "", sep15: "", dec15: "", mar15: "", mar31: "" },
    vdaIncome: {jun15: "", sep15: "", dec15: "", mar15: "", mar31: "",},
  };

  const initialAdvanceTax = {
    jun15: { paidDate: "", paidAmount: "" },
    sep15: { paidDate: "", paidAmount: "" },
    dec15: { paidDate: "", paidAmount: "" },
    mar15: { paidDate: "", paidAmount: "" },
  };

  const [status, setStatus] = useState("individual_group");
  const [regime, setRegime] = useState("new");
  const [ageCategory, setAgeCategory] = useState("below_60");
  const [seniorNoBusiness, setSeniorNoBusiness] = useState(false);
  const [domesticCompanyOption, setDomesticCompanyOption] = useState("turnover_400cr");
  const [manufacturingBusinessIncome, setManufacturingBusinessIncome] =useState("");
  const [foreignCompanyOption, setForeignCompanyOption] = useState("other_foreign_income");
  const [cooperativeOption, setCooperativeOption] = useState("normal");
  const [income, setIncome] = useState(initialIncome);
  const [commonCredit, setCommonCredit] = useState("");
  const [advanceTax, setAdvanceTax] = useState(initialAdvanceTax);
  const [mmrAmount, setMmrAmount] = useState("");

  const num = (value) => {
    if (value === null || value === undefined) return 0;
    const cleaned = String(value).replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (amount) => Number(Math.round(amount || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const roundDownTo100 = (amount) => Math.floor(Math.max(Number(amount) || 0, 0) / 100) * 100;

  const updateIncome = (rowKey, periodKey, value) => {
    setIncome((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], [periodKey]: value } }));
  };

  const updateAdvanceTax = (installmentKey, field, value) => {
    setAdvanceTax((prev) => ({ ...prev, [installmentKey]: { ...prev[installmentKey], [field]: value } }));
  };

  const calculateSlabTax = (taxableIncome, slabs) => {
    const incomeAmount = Math.max(Number(taxableIncome) || 0, 0);
    let tax = 0;
    slabs.forEach((slab) => {
      if (incomeAmount > slab.from) {
        const amountInSlab = Math.min(incomeAmount, slab.to) - slab.from;
        tax += amountInSlab * (slab.rate / 100);
      }
    });
    return Math.max(tax, 0);
  };

  const showRegime = () => status === "individual_group" || status === "aop_company_group";

  const getBasicExemption = () => {
    if (regime === "new") return 400000;
    if (ageCategory === "senior") return 300000;
    if (ageCategory === "super_senior") return 500000;
    return 250000;
  };

  const getIndividualSlabTax = (amount) => {
    if (regime === "new") {
      return calculateSlabTax(amount, [
        { from: 0, to: 400000, rate: 0 },
        { from: 400000, to: 800000, rate: 5 },
        { from: 800000, to: 1200000, rate: 10 },
        { from: 1200000, to: 1600000, rate: 15 },
        { from: 1600000, to: 2000000, rate: 20 },
        { from: 2000000, to: 2400000, rate: 25 },
        { from: 2400000, to: Infinity, rate: 30 },
      ]);
    }
    if (ageCategory === "super_senior") {
      return calculateSlabTax(amount, [
        { from: 0, to: 500000, rate: 0 },
        { from: 500000, to: 1000000, rate: 20 },
        { from: 1000000, to: Infinity, rate: 30 },
      ]);
    }
    if (ageCategory === "senior") {
      return calculateSlabTax(amount, [
        { from: 0, to: 300000, rate: 0 },
        { from: 300000, to: 500000, rate: 5 },
        { from: 500000, to: 1000000, rate: 20 },
        { from: 1000000, to: Infinity, rate: 30 },
      ]);
    }
    return calculateSlabTax(amount, [
      { from: 0, to: 250000, rate: 0 },
      { from: 250000, to: 500000, rate: 5 },
      { from: 500000, to: 1000000, rate: 20 },
      { from: 1000000, to: Infinity, rate: 30 },
    ]);
  };

  const getCooperativeNormalTax = (amount) => calculateSlabTax(amount, [
    { from: 0, to: 10000, rate: 10 },
    { from: 10000, to: 20000, rate: 20 },
    { from: 20000, to: Infinity, rate: 30 },
  ]);

  const selectedDomesticCompanyOption = domesticCompanyOptions.find((item) => item.value === domesticCompanyOption) || domesticCompanyOptions[0];
  const selectedForeignCompanyOption = foreignCompanyOptions.find((item) => item.value === foreignCompanyOption) || foreignCompanyOptions[1];
  const selectedCooperativeOption = cooperativeOptions.find((item) => item.value === cooperativeOption) || cooperativeOptions[0];
  const getStatusLabel = () => statusOptions.find((item) => item.value === status)?.label || "";

  const calculateOrdinaryTax = (ordinaryIncome) => {
    const amount = Math.max(Number(ordinaryIncome) || 0, 0);
    if (status === "individual_group") {return getIndividualSlabTax(amount);}
    if (status === "aop_company_group") {return amount * 0.30;}
    if (status === "firm_llp_local") return amount * 0.3;
    if (status === "domestic_company") {
    if (domesticCompanyOption === "section_115BAB") {
      const manufacturingIncome = Math.min(Math.max(Number(manufacturingBusinessIncome) || 0, 0),amount  );
      const remainingIncome = Math.max(amount - manufacturingIncome,0);
      const manufacturingTax =manufacturingIncome * 0.15;
      const remainingTax =remainingIncome * 0.22;
      return manufacturingTax + remainingTax;}
      return (amount *(selectedDomesticCompanyOption.rate / 100) );}
    if (status === "foreign_company") return amount * (selectedForeignCompanyOption.rate / 100);
    if (status === "cooperative_society") {
    if (selectedCooperativeOption.value === "normal") {return getCooperativeNormalTax(amount); }
    if (selectedCooperativeOption.value === "section_115BAE") {
      const manufacturingIncome = Math.min( Math.max(Number(manufacturingBusinessIncome) || 0, 0), amount);
      const remainingIncome = Math.max(amount - manufacturingIncome,  0 );
      const manufacturingTax =manufacturingIncome * 0.15;
      const remainingTax = remainingIncome * 0.22;
      return manufacturingTax + remainingTax; }
      return amount * (selectedCooperativeOption.rate / 100);}
      return 0;
  };

  const getSurchargeRate = (totalIncome,adjustedIncomeForEnhancedSurcharge = totalIncome) => {
    const incomeAmount = Math.max(Number(totalIncome) || 0, 0);
    if (status === "individual_group") {

  // Income excluding capped income
  const enhancedSurchargeIncome =
    adjustedIncomeForEnhancedSurcharge ?? incomeAmount;

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
    adjustedIncomeForEnhancedSurcharge ?? incomeAmount;

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
    if (status === "firm_llp_local") return incomeAmount > 10000000 ? 12 : 0;
    if (status === "domestic_company") {
      if (selectedDomesticCompanyOption.fixedSurchargeRate !== null) return selectedDomesticCompanyOption.fixedSurchargeRate;
      if (incomeAmount > 100000000) return 12;
      if (incomeAmount > 10000000) return 7;
      return 0;
    }
    if (status === "foreign_company") {
      if (incomeAmount > 100000000) return 5;
      if (incomeAmount > 10000000) return 2;
      return 0;
    }
    if (status === "cooperative_society") {
      if (selectedCooperativeOption.fixedSurchargeRate !== null) return selectedCooperativeOption.fixedSurchargeRate;
      if (incomeAmount > 100000000) return 12;
      if (incomeAmount > 10000000) return 7;
      return 0;
    }
    return 0;
  };

  const getSurchargeThresholdInfo = (totalIncome) => {
    const incomeAmount = Math.max(Number(totalIncome) || 0, 0);

    if (status === "individual_group") {
      if (incomeAmount > 50000000) return { threshold: 50000000, previousRate: 25 };
      if (incomeAmount > 20000000) return { threshold: 20000000, previousRate: 15 };
      if (incomeAmount > 10000000) return { threshold: 10000000, previousRate: 10 };
      if (incomeAmount > 5000000) return { threshold: 5000000, previousRate: 0 };
      return null;
    }

    if (status === "aop_company_group") {
      if (incomeAmount > 10000000) return { threshold: 10000000, previousRate: 10 };
      if (incomeAmount > 5000000) return { threshold: 5000000, previousRate: 0 };
      return null;
    }

    if (status === "firm_llp_local") {
      if (incomeAmount > 10000000) return { threshold: 10000000, previousRate: 0 };
      return null;
    }

    if (status === "domestic_company") {
      if (selectedDomesticCompanyOption.fixedSurchargeRate !== null) return null;
      if (incomeAmount > 100000000) return { threshold: 100000000, previousRate: 7 };
      if (incomeAmount > 10000000) return { threshold: 10000000, previousRate: 0 };
      return null;
    }

    if (status === "foreign_company") {
      if (incomeAmount > 100000000) return { threshold: 100000000, previousRate: 2 };
      if (incomeAmount > 10000000) return { threshold: 10000000, previousRate: 0 };
      return null;
    }

    if (status === "cooperative_society") {
      if (selectedCooperativeOption.fixedSurchargeRate !== null) return null;
      if (incomeAmount > 100000000) return { threshold: 100000000, previousRate: 7 };
      if (incomeAmount > 10000000) return { threshold: 10000000, previousRate: 0 };
      return null;
    }

    return null;
  };

  const getPeriodIncome = (periodKey) => {
  const order = ["jun15", "sep15", "dec15", "mar15", "mar31"];

  const currentIndex = order.indexOf(periodKey);

  const cumulative = (rowKey) => {
    return order
      .slice(0, currentIndex + 1)
      .reduce((sum, key) => sum + num(income[rowKey][key]), 0);
  };

  // Normal income frozen rahega
  const normalIncome = num(income.normalIncome.jun15);

  // Quarter-wise cumulative income
  const dividendIncome = cumulative("dividendIncome");

  const stcgSlabIncome = cumulative("stcgSlabIncome");

  const ltcg125 = cumulative("ltcg125");

  const ltcg112a = cumulative("ltcg112a");

  const stcg111a = cumulative("stcg111a");

  const vdaIncome = cumulative("vdaIncome");

  
let presumptiveIncome = 0;

if (periodKey === "mar15") {
  presumptiveIncome = num( income.presumptiveIncome.mar15);
}

if (periodKey === "mar31") {
  presumptiveIncome = num(income.presumptiveIncome.mar15 );
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

  const calculateTaxForPeriod = (periodKey) => {const data = getPeriodIncome(periodKey);const normalBaseIncome = data.normalIncome + data.presumptiveIncome;
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

const taxOnNormalIncomeOnly = calculateOrdinaryTax(
  data.normalIncome
);

const taxOnNormalAndPresumptive = calculateOrdinaryTax(
  normalBaseIncome
);

const taxOnNormalPresumptiveAndStcg = calculateOrdinaryTax(
  ordinaryWithoutDividend
);

const taxOnOrdinaryWithDividend = calculateOrdinaryTax(
  ordinaryWithDividend
);
const taxWithDividend = taxOnOrdinaryWithDividend;
// Normal income ka tax
const normalIncomeTax = Math.max(
  taxOnNormalIncomeOnly,
  0
);

// Presumptive income ki wajah se additional tax
const presumptiveIncomeTax = Math.max(
  taxOnNormalAndPresumptive - taxOnNormalIncomeOnly,
  0
);

// STCG slab rate ki wajah se additional tax
const stcgSlabTax = Math.max(
  taxOnNormalPresumptiveAndStcg -
    taxOnNormalAndPresumptive,
  0
);

// Sirf dividend ki wajah se additional tax
const dividendTaxOnly = Math.max(
  taxOnOrdinaryWithDividend -
    taxOnNormalPresumptiveAndStcg,
  0
);

// Ordinary income ka actual total tax
const normalTax = Math.max(
  taxOnOrdinaryWithDividend,
  0
);

// UI mein "Tax on Dividend Income" ke andar
// Normal + Presumptive + STCG Slab + Dividend tax
// ka combined amount show hoga.
const dividendTax = Math.max(
  normalIncomeTax +
    presumptiveIncomeTax +
    stcgSlabTax +
    dividendTaxOnly,
  0
);

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

// =========================================================
// BASIC EXEMPTION — FINAL YEAR BASIS
// =========================================================

// Final quarter (31 March) ka normal-rate income
// decide karega ki basic exemption available hai ya nahi.

const finalData = getPeriodIncome("mar31");

const finalNormalIncomeForExemption =
  finalData.normalIncome +
  finalData.presumptiveIncome +
  finalData.stcgSlabIncome +
  finalData.dividendIncome;

const basicExemptionLimit = getBasicExemption();

// Agar final normal income basic exemption se upar hai,
// to kisi bhi quarter me special-rate income ko
// basic exemption se adjust nahi kiya jayega.

let unusedBasicExemption = 0;

if (finalNormalIncomeForExemption < basicExemptionLimit) {
  unusedBasicExemption =
    basicExemptionLimit - finalNormalIncomeForExemption;
}
  
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
    const totalTax =
  normalTax +
  ltcg125Tax +
  ltcg112aTax +
  stcg111aTax +
  vdaIncomeTax;
  // =========================================================
// MMR — TOTAL TAX SE LESS HOGA
// =========================================================

const mmr = Math.max(num(mmrAmount), 0);

const taxAfterMMR = Math.max(
  totalTax - mmr,
  0
);
    const specialTax =
  stcgSlabTax +
  dividendTaxOnly +
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
   const surchargeRate = getSurchargeRate(totalIncome, adjustedIncomeForEnhancedSurcharge);

   // =========================
// SPECIAL RATE SURCHARGE
// =========================

// Capped surcharge rate
const cappedSurchargeRate =
  Math.min(surchargeRate, 15);

// Tax on capped income
const cappedIncomeTax =
  dividendTaxOnly +
  ltcg125Tax +
  ltcg112aTax +
  stcg111aTax;

// =========================================================
// SURCHARGE AFTER MMR
// =========================================================

const surchargeTaxBase = Math.max(
  taxAfterMMR,
  0
);

// Capped special-rate tax cannot exceed tax after MMR
const cappedIncomeTaxAfterMMR = Math.min(
  cappedIncomeTax,
  surchargeTaxBase
);

// Remaining tax is normal-rate tax
const normalIncomeTaxForSurcharge =
  Math.max(
    surchargeTaxBase - cappedIncomeTaxAfterMMR,
    0
  );

// Surcharge on normal-rate tax
const normalSurcharge =
  normalIncomeTaxForSurcharge *
  (surchargeRate / 100);

// Surcharge on capped special-rate tax
const cappedIncomeSurcharge =
  cappedIncomeTaxAfterMMR *
  (cappedSurchargeRate / 100);

// Total surcharge before Marginal Relief
const rawSurcharge =
  normalSurcharge +
  cappedIncomeSurcharge;

    const calculateThresholdTaxAndSurcharge = (threshold, previousRate) => {
      const thresholdSpecialIncome = data.dividendIncome + data.ltcg125 + data.ltcg112a + data.stcg111a;
      const thresholdOrdinaryWithDividend = Math.max(threshold - thresholdSpecialIncome, 0);
      const thresholdDividendIncome = Math.min(data.dividendIncome, thresholdOrdinaryWithDividend);
      const thresholdTaxWithDividend = calculateOrdinaryTax(thresholdOrdinaryWithDividend);

      let thresholdLtcg125Taxable = data.ltcg125;
      let thresholdLtcg112aTaxable = Math.max(data.ltcg112a - 125000, 0);
      let thresholdStcg111aTaxable = data.stcg111a;

      if (status === "individual_group" || status === "aop_company_group") {
 // =========================================================
// BASIC EXEMPTION FOR MARGINAL RELIEF
// FINAL YEAR BASIS
// =========================================================

const finalDataForThreshold =
  getPeriodIncome("mar31");

const finalNormalIncomeForExemption =
  finalDataForThreshold.normalIncome +
  finalDataForThreshold.presumptiveIncome +
  finalDataForThreshold.stcgSlabIncome +
  finalDataForThreshold.dividendIncome;

const basicExemptionLimitForThreshold =
  getBasicExemption();

// Final annual normal income basic exemption se
// upar hai to special-rate income ko exemption
// nahi milega.

let thresholdUnusedBasicExemption = 0;

if (
  finalNormalIncomeForExemption <
  basicExemptionLimitForThreshold
) {
  thresholdUnusedBasicExemption =
    basicExemptionLimitForThreshold -
    finalNormalIncomeForExemption;
}
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
      finalNormalIncomeForExemption,
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

   const marginalReliefInfo = getSurchargeThresholdInfo(totalIncome, adjustedIncomeForEnhancedSurcharge );
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
     const currentTaxAndRawSurcharge = taxAfterMMR + rawSurcharge;

      marginalRelief = Math.max(
        currentTaxAndRawSurcharge - maximumTaxAndSurcharge,
        0
      );
    }

    const surcharge = Math.max(
  rawSurcharge - marginalRelief,
  0
);

// Cess MMR ke baad bache tax + net surcharge par
    const taxBeforeCess =taxAfterMMR + surcharge;
    const cess =taxBeforeCess * 0.04;
    const taxWithSurchargeAndCess =taxBeforeCess + cess;
    const commonCreditAmount = num(commonCredit);
    const balanceTax = Math.max(taxWithSurchargeAndCess - commonCreditAmount, 0);

    return {
      ...data,
      ordinaryWithoutDividend,
      ordinaryWithDividend,
      normalIncomeTotal,
      specialIncomeTotal,
      totalIncome,
      normalTax: taxWithDividend,
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

  const periodCalculation = useMemo(() => {
    const result = {};
    periods.forEach((period) => {
      result[period.key] = calculateTaxForPeriod(period.key);
    });
    return result;
  }, [income, commonCredit, mmrAmount, manufacturingBusinessIncome, status, regime, ageCategory, seniorNoBusiness, domesticCompanyOption, foreignCompanyOption, cooperativeOption]);

  const installmentCalculation = useMemo(() => {
  let cumulativeAdvanceTaxPaid = 0;

  return installments.map((item) => {
    const taxData =
      item.key === "mar15"
        ? periodCalculation.mar31 || {}
        : periodCalculation[item.key] || {};

    const balanceTax =
      taxData.balanceTax || 0;

    // Current installment ka actual payment
    const currentAdvanceTaxPaid =
      num(advanceTax[item.key]?.paidAmount);

    // Previous installments + current installment
    cumulativeAdvanceTaxPaid +=
      currentAdvanceTaxPaid;

    // Cumulative advance tax requirement
    const dueInstallmentAmount =
      balanceTax *
      (item.duePercent / 100);

    // Minimum cumulative payment required
    // to avoid interest u/s 234C
    const minimumAmountToAvoid234C =
      balanceTax *
      (item.minimumPercent / 100);

    // 234C tab lagega jab cumulative advance tax
    // minimum required amount se kam ho.
    //
    // Interest payable amount:
    // Cumulative Due Amount - Cumulative Advance Tax Paid
    const shortfall =
      cumulativeAdvanceTaxPaid >=
      minimumAmountToAvoid234C
        ? 0
        : Math.max(
            dueInstallmentAmount -
            cumulativeAdvanceTaxPaid,
            0
          );

    // Interest ke liye ₹100 ke nearest lower multiple
    const interestPayableOn =
      roundDownTo100(shortfall);

    const interest =
      interestPayableOn *
      0.01 *
      item.months;

    return {
      ...item,

      balanceTax,

      paidDate:
        advanceTax[item.key]?.paidDate || "",

      // Current installment ka payment
      currentAdvanceTaxPaid,

      // Cumulative / Gross advance tax paid
      paidGrossAmount:
        cumulativeAdvanceTaxPaid,

      dueInstallmentAmount,

      minimumAmountToAvoid234C,

      interestPayableOn,

      interest,
    };
  });
}, [periodCalculation, advanceTax]);

  const finalTax = periodCalculation.mar31 || {};
  const total234CInterest = installmentCalculation.reduce((sum, item) => sum + item.interest, 0);

  const resetCalculator = () => {
    setStatus("individual_group");
    setRegime("new");
    setAgeCategory("below_60");
    setSeniorNoBusiness(false);
    setDomesticCompanyOption("turnover_400cr");
    setForeignCompanyOption("other_foreign_income");
    setCooperativeOption("normal");
    setIncome(initialIncome);
    setCommonCredit("");
    setMmrAmount("");
    setAdvanceTax(initialAdvanceTax);
  };

  return (
    <div className="c234-page">
      <div className="c234-container">
        <div className="c234-header">
          <div>
            <p className="c234-kicker">Income Tax Utility</p>
            <h1>Section 234C Interest Calculator</h1>
            <p>AY {ASSESSMENT_YEAR} ke liye quarter-wise income, tax, advance tax aur 234C interest calculation.</p>
          </div>

          <div className="c234-badge">
            <span>Assessment Year</span>
            <strong>AY {ASSESSMENT_YEAR}</strong>
            <small>FY {FINANCIAL_YEAR}</small>
          </div>
        </div>

        <div className="c234-grid">
          <div className="c234-left">
            <div className="c234-card">
              <div className="c234-section-title">
                <h2>Basic Details</h2>
                <p>Status aur applicable tax option select karein.</p>
              </div>

              <div className="c234-form-grid">
                <div className="c234-field">
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statusOptions.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                {showRegime() && (
                  <div className="c234-field">
                    <label>Regime</label>
                    <select value={regime} onChange={(e) => setRegime(e.target.value)}>
                      {regimeOptions.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {status === "individual_group" && (
                  <div className="c234-field">
                    <label>Age / Category</label>
                    <select value={ageCategory} onChange={(e) => setAgeCategory(e.target.value)}>
                      {ageOptions.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {status === "domestic_company" && (
  <div className="c234-field">
    <label>Domestic Company Option</label>

    <select
      value={domesticCompanyOption}
      onChange={(e) =>
        setDomesticCompanyOption(e.target.value)
      }
    >
      {domesticCompanyOptions.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  </div>
)}


                {status === "foreign_company" && (
                  <div className="c234-field">
                    <label>Foreign Company Option</label>
                    <select value={foreignCompanyOption} onChange={(e) => setForeignCompanyOption(e.target.value)}>
                      {foreignCompanyOptions.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {status === "cooperative_society" && (
                  <div className="c234-field">
                    <label>Co-operative Society Option</label>
                    <select value={cooperativeOption} onChange={(e) => setCooperativeOption(e.target.value)}>
                      {cooperativeOptions.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {(
  status === "domestic_company" &&
  domesticCompanyOption === "section_115BAB"
) ||
(
  status === "cooperative_society" &&
  cooperativeOption === "section_115BAE"
) ? (
  <div className="c234-field">
    <label>Manufacturing Business Income</label>

    <input
      type="text"
      inputMode="numeric"
      value={manufacturingBusinessIncome}
      onChange={(e) =>
        setManufacturingBusinessIncome(e.target.value)
      }
      placeholder="Enter manufacturing business income"
    />
  </div>
) : null}

              {status === "individual_group" && (
                <label className="c234-check">
                  <input type="checkbox" checked={seniorNoBusiness} onChange={(e) => setSeniorNoBusiness(e.target.checked)} />
                  <span>Resident senior / super senior citizen without business or profession income</span>
                </label>
              )}

              <div className="c234-info-box">
                <strong>Instruction</strong>
                <p>LTCG me indexation option include nahi hai. Capital gain amount before exemption/rebate enter karein. 112A me ₹1,25,000 exemption tax calculation me auto deduct hoga. Dividend alag row me hai, par tax normal slab se hoga.</p>
              </div>
            </div>

            <div className="c234-card">
              <div className="c234-section-title">
                <h2>Income Input - Quarter Wise</h2>
                <p>Client se direct quarter-wise income value input hogi.</p>
              </div>

              <div className="c234-table-wrap">
                <table className="c234-input-table">
                  <thead>
                    <tr>
                      <th>Income Particulars</th>
                      {periods.map((period) => <th key={period.key}>{period.label}</th>)}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
  <td>Normal Income</td>
  {periods.map((period) => (<td key={period.key}>{period.key === "jun15" ? (
        <input
          type="text" inputMode="numeric" value={income.normalIncome.jun15} onChange={(e) => updateIncome("normalIncome", "jun15", e.target.value)}
        />) : (
        <input
          type="text"value={income.normalIncome.jun15}readOnly className="c234-auto-field"/>)}
    </td>))}
</tr>

<tr>
  <td>STCG - Taxable at Slab Rate</td>
  {periods.map((period) => (<td key={period.key}>
      <input
        type="text" inputMode="numeric" value={income.stcgSlabIncome[period.key]} onChange={(e) => updateIncome("stcgSlabIncome", period.key, e.target.value)}
      />
    </td>))}
</tr>

                    <tr>
                      <td>Dividend Income - taxable at normal slab</td>
                      {periods.map((period) => (
                        <td key={period.key}><input type="text" inputMode="numeric" value={income.dividendIncome[period.key]} onChange={(e) => updateIncome("dividendIncome", period.key, e.target.value)} /></td>
                      ))}
                    </tr>

       <tr>
  <td>44AD / 44ADA Presumptive Income</td>

  {periods.map((period) => {
    const allowed =
      period.key === "mar15" ||
      period.key === "mar31";

    return (
      <td key={period.key}>
        {period.key === "mar15" ? (
          <input
            type="text"
            inputMode="numeric"
            value={income.presumptiveIncome.mar15}
            onChange={(e) =>
              updateIncome(
                "presumptiveIncome",
                "mar15",
                e.target.value
              )
            }
          />
        ) : period.key === "mar31" ? (
          <input
            type="text"
            inputMode="numeric"
            value={income.presumptiveIncome.mar15}
            readOnly
            className="c234-auto-field"
          />
        ) : (
          <span className="c234-disabled-cell">
            Only 15/3
          </span>
        )}
      </td>
    );
  })}
</tr>

                    <tr className="c234-total-row">
                      <td>Total Normal Income</td>
                      {periods.map((period) => (
                        <td key={period.key}><span className="c234-total-display">₹ {formatCurrency(periodCalculation[period.key].normalIncomeTotal)}</span></td>
                      ))}
                    </tr>

                    <tr>
                      <td>LTCG @12.5%</td>
                      {periods.map((period) => (
                        <td key={period.key}><input type="text" inputMode="numeric" value={income.ltcg125[period.key]} onChange={(e) => updateIncome("ltcg125", period.key, e.target.value)} /></td>
                      ))}
                    </tr>

                    <tr>
                      <td>LTCG u/s 112A @12.5% (before ₹1,25,000 exemption)</td>
                      {periods.map((period) => (
                        <td key={period.key}><input type="text" inputMode="numeric" value={income.ltcg112a[period.key]} onChange={(e) => updateIncome("ltcg112a", period.key, e.target.value)} /></td>
                      ))}
                    </tr>

                    <tr>
                      <td>STCG u/s 111A @20%</td>
                      {periods.map((period) => (
                        <td key={period.key}><input type="text" inputMode="numeric" value={income.stcg111a[period.key]} onChange={(e) => updateIncome("stcg111a", period.key, e.target.value)} /></td>
                      ))}
                    </tr>

                    <tr>
                        <td>VDA / Crypto Income @30%</td>
                        {periods.map((period) => (
                            <td key={period.key}><input type="text" inputMode="numeric"value={income.vdaIncome[period.key]}onChange={(e) =>updateIncome("vdaIncome", period.key, e.target.value) }/></td>))}
                    </tr>

                    <tr className="c234-total-row">
                      <td>Total Special Income</td>
                      {periods.map((period) => (
                        <td key={period.key}><span className="c234-total-display">₹ {formatCurrency(periodCalculation[period.key].specialIncomeTotal)}</span></td>
                      ))}
                    </tr>

                    <tr className="c234-grand-total-row">
                      <td>Total Income</td>
                      {periods.map((period) => (
                        <td key={period.key}><span className="c234-total-display">₹ {formatCurrency(periodCalculation[period.key].totalIncome)}</span></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="c234-credit-box">
                <div className="c234-field">
                  <label>Less: TDS / TCS / Rebate / Relief / Credit</label>
                  <input type="text" inputMode="numeric" value={commonCredit} onChange={(e) => setCommonCredit(e.target.value)} placeholder="Common amount for all quarters" />
                </div>
                <p>Ye frozen common field hai. Same amount sabhi quarter calculation me reduce hoga.</p>
              </div>
            </div>

            <div className="c234-card">
              <div className="c234-section-title">
                <h2>Income Wise Advance Tax Bifurcation</h2>
                <p>Tax, surcharge, cess aur balance tax auto calculate hoga.</p>
              </div>

              <div className="c234-table-wrap">
                <table className="c234-result-table">
                  <thead>
                    <tr>
                      <th>Particulars</th>
                      {periods.map((period) => <th key={period.key}>{period.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                   {[
  ["Total Income", "totalIncome"],
  ["Tax on normal income", "dividendTax"],
  ["Tax on STCG - Slab Rate", "stcgSlabTax"],
  ["Tax on LTCG @12.5%", "ltcg125Tax"],
  ["Tax on 112A @12.5%", "ltcg112aTax"],
  ["Tax on 111A @20%", "stcg111aTax"],
  ["Tax on VDA / Crypto @30%", "vdaIncomeTax"],
  ["Total Tax", "totalTax"],
].map(([label, key]) => (
  <tr key={key}>
    <td>{label}</td>

    {periods.map((period) => (
      <td key={period.key}>
        ₹ {formatCurrency(periodCalculation[period.key][key])}
      </td>
    ))}
  </tr>
))}

{/* MMR ROW */}
<tr>
  <td>MMR</td>

  {periods.map((period, index) => (
    <td key={period.key}>
      <input
        type="text"
        inputMode="numeric"
        value={mmrAmount}
        onChange={(e) => {
          if (index === 0) {
            setMmrAmount(e.target.value);
          }
        }}
        readOnly={index !== 0}
        placeholder={index === 0 ? "Enter MMR" : ""}
        className={index !== 0 ? "c234-auto-field" : ""}
      />
    </td>
  ))}
</tr>

{[
  ["Surcharge before Marginal Relief", "rawSurcharge"],
  ["Less: Marginal Relief", "marginalRelief"],
  ["Net Surcharge", "surcharge"],
  ["Cess @4%", "cess"],
  ["Tax + Surcharge + Cess", "taxWithSurchargeAndCess"],
  ["Less: TDS / TCS / Rebate / Relief / Credit", "commonCreditAmount"],
].map(([label, key]) => (
  <tr key={key}>
    <td>{label}</td>

    {periods.map((period) => (
      <td key={period.key}>
        ₹ {formatCurrency(periodCalculation[period.key][key])}
      </td>
    ))}
  </tr>
))}
                    <tr className="c234-highlight-row">
                      <td>Balance Tax</td>
                      {periods.map((period) => <td key={period.key}>₹ {formatCurrency(periodCalculation[period.key].balanceTax)}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="c234-card">
              <div className="c234-section-title">
                <h2>Advance Tax Paid</h2>
                <p>Installment-wise paid date aur gross amount enter karein.</p>
              </div>

              <div className="c234-table-wrap">
                <table className="c234-input-table advance-table">
                  <thead>
                    <tr>
                      <th>Installment</th>
                      <th>Due Date</th>
                      <th>Advance Tax Paid Date</th>
                      <th>Advance Tax Paid Gross Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((item) => (
                      <tr key={item.key}>
                        <td>{item.title}</td>
                        <td>{item.dueDate}</td>
                        <td><input type="date" value={advanceTax[item.key].paidDate} onChange={(e) => updateAdvanceTax(item.key, "paidDate", e.target.value)} /></td>
                        <td><input type="text" inputMode="numeric" value={advanceTax[item.key].paidAmount} onChange={(e) => updateAdvanceTax(item.key, "paidAmount", e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="c234-card">
              <div className="c234-section-title">
                <h2>Interest Calculation u/s 234C</h2>
                <p>234C ki final summary sabse neeche auto generate hogi.</p>
              </div>

              <div className="c234-table-wrap">
                <table className="c234-result-table interest-table">
                  <thead>
                    <tr>
                      <th>Installment</th>
                      <th>Due Date</th>
                      <th>Due %</th>
                      <th>Due Amount</th>
                      <th>Minimum % to avoid 234C</th>
                      <th>Minimum Amount</th>
                      <th>Advance Tax Paid Gross Amount</th>
                      <th>Interest Payable On</th>
                      <th>Interest u/s 234C</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installmentCalculation.map((item) => (
                      <tr key={item.key}>
                        <td>{item.title}</td>
                        <td>{item.dueDate}</td>
                        <td>{item.duePercent}%</td>
                        <td>₹ {formatCurrency(item.dueInstallmentAmount)}</td>
                        <td>{item.minimumPercent}%</td>
                        <td>₹ {formatCurrency(item.minimumAmountToAvoid234C)}</td>
                        <td>₹ {formatCurrency(item.paidGrossAmount)}</td>
                        <td>₹ {formatCurrency(item.interestPayableOn)}</td>
                        <td>₹ {formatCurrency(item.interest)}</td>
                      </tr>
                    ))}
                    <tr className="c234-highlight-row">
                      <td colSpan="8">Total Interest u/s 234C</td>
                      <td>₹ {formatCurrency(total234CInterest)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="c234-formula-box">
                <strong>Formula Used</strong>
                <p>1st: 3 × 1% × shortfall | 2nd: 3 × 1% × shortfall | 3rd: 3 × 1% × shortfall | 4th: 1 × 1% × shortfall</p>
              </div>
            </div>
          </div>

          <div className="c234-result-panel">
            <div className="c234-result-head">
              <p>Final Output</p>
              <h2>₹ {formatCurrency(total234CInterest)}</h2>
              <span>Total Interest u/s 234C</span>
            </div>
            <div className="c234-result-list">
              <div className="c234-result-item"><span>Selected Case</span><strong>AY {ASSESSMENT_YEAR} / {getStatusLabel()}</strong></div>
              <div className="c234-result-item"><span>Total Income</span><strong>₹ {formatCurrency(finalTax.totalIncome)}</strong></div>
              <div className="c234-result-item"><span>Total Tax</span><strong>₹ {formatCurrency(finalTax.totalTax)}</strong></div>
              <div className="c234-result-item"><span>Surcharge Rate</span><strong>{finalTax.surchargeRate || 0}%</strong></div>
              <div className="c234-result-item"><span>Surcharge before Marginal Relief</span><strong>₹ {formatCurrency(finalTax.rawSurcharge)}</strong></div>
              <div className="c234-result-item"><span>Less: Marginal Relief</span><strong>₹ {formatCurrency(finalTax.marginalRelief)}</strong></div>
              <div className="c234-result-item"><span>Net Surcharge</span><strong>₹ {formatCurrency(finalTax.surcharge)}</strong></div>
              <div className="c234-result-item"><span>Cess @4%</span><strong>₹ {formatCurrency(finalTax.cess)}</strong></div>
              <div className="c234-result-item exempt"><span>Balance Tax</span><strong>₹ {formatCurrency(finalTax.balanceTax)}</strong></div>
              <div className="c234-result-item final"><span>Total Interest u/s 234C</span><strong>₹ {formatCurrency(total234CInterest)}</strong></div>
            </div>
            <button type="button" className="c234-reset-btn" onClick={resetCalculator}>Reset Calculator</button>
          </div>
        </div>
      </div>

      <style>{`
        .c234-page { min-height: 100vh; background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%), linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%); color: #e5e7eb; padding: 34px; font-family: Inter, Arial, sans-serif; }
        .c234-container { max-width: 1450px; margin: 0 auto; }
        .c234-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 28px; padding: 26px; border-radius: 24px; background: rgba(15, 23, 42, 0.86); border: 1px solid rgba(148, 163, 184, 0.18); box-shadow: 0 22px 60px rgba(0,0,0,0.35); }
        .c234-kicker { color: #60a5fa; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-weight: 800; margin: 0 0 8px; }
        .c234-header h1 { font-size: 36px; line-height: 1.1; margin: 0; color: #ffffff; }
        .c234-header p { margin: 10px 0 0; color: #94a3b8; font-size: 15px; line-height: 1.6; }
        .c234-badge { min-width: 190px; padding: 18px; border-radius: 20px; background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12)); border: 1px solid rgba(96,165,250,0.28); text-align: center; }
        .c234-badge span { display: block; color: #93c5fd; font-size: 12px; font-weight: 700; margin-bottom: 5px; }
        .c234-badge strong { display: block; color: #ffffff; font-size: 20px; }
        .c234-badge small { display: block; color: #94a3b8; margin-top: 5px; font-size: 12px; font-weight: 700; }
        .c234-grid { display: grid; grid-template-columns: 1fr; gap: 26px; align-items: start; }
        .c234-left { display: grid; gap: 24px; min-width: 0; }
        .c234-card, .c234-result-panel { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(148,163,184,0.18); border-radius: 24px; box-shadow: 0 22px 60px rgba(0,0,0,0.32); }
        .c234-card { padding: 26px; }
        .c234-section-title { margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid rgba(148,163,184,0.15); }
        .c234-section-title h2 { margin: 0; color: #ffffff; font-size: 22px; }
        .c234-section-title p { margin: 7px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6; }
        .c234-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .c234-field { display: flex; flex-direction: column; gap: 8px; }
        .c234-field label { color: #cbd5e1; font-size: 13px; font-weight: 700; }
        .c234-field input,
.c234-field select,
.c234-input-table input,
.c234-result-table input {
  width: 100%;
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,0.22);
  background: rgba(2,6,23,0.48);
  color: #ffffff;
  padding: 0 14px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
}
        .c234-field input::placeholder { color: #64748b; }
        .c234-field input:focus,
.c234-field select:focus,
.c234-input-table input:focus,
.c234-result-table input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96,165,250,0.14);
  background: rgba(15,23,42,0.95);
}
        .c234-check { display: flex; align-items: flex-start; gap: 10px; margin-top: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.6; cursor: pointer; }
        .c234-check input { margin-top: 4px; accent-color: #0ea5e9; }
        .c234-info-box, .c234-credit-box, .c234-formula-box { margin-top: 24px; padding: 16px; border-radius: 18px; background: rgba(37,99,235,0.08); border: 1px solid rgba(96,165,250,0.18); }
        .c234-info-box strong, .c234-formula-box strong { color: #bfdbfe; font-size: 14px; }
        .c234-info-box p, .c234-credit-box p, .c234-formula-box p { margin: 7px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.6; }
        .c234-table-wrap { width: 100%; overflow-x: visible; border-radius: 18px; border: 1px solid rgba(148,163,184,0.16); }
        .c234-input-table, .c234-result-table { width: 100%; min-width: 0; table-layout: fixed; border-collapse: collapse; background: rgba(2,6,23,0.38); }
        .advance-table { min-width: 0; }
        .interest-table { min-width: 0; }
        .c234-input-table th, .c234-input-table td, .c234-result-table th, .c234-result-table td { border-bottom: 1px solid rgba(148,163,184,0.12); border-right: 1px solid rgba(148,163,184,0.1); padding: 10px; color: #e5e7eb; font-size: 12px; vertical-align: middle; white-space: normal; word-break: break-word; }
        .c234-input-table th, .c234-result-table th { background: rgba(15,23,42,0.94); color: #bfdbfe; text-align: left; font-weight: 900; }
        .c234-input-table td:first-child, .c234-result-table td:first-child { color: #dbeafe; font-weight: 900; width: 22%; min-width: 0; }
        .c234-input-table input { min-width: 0; width: 100%; padding: 0 8px; }
        .c234-auto-field {background: rgba(15, 23, 42, 0.72) !important;color: #93c5fd !important;cursor: not-allowed;}
        .c234-disabled-cell { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; padding: 0 12px; border-radius: 12px; background: rgba(148,163,184,0.09); color: #94a3b8; font-size: 12px; font-weight: 800; }
        .c234-highlight-row td { background: rgba(14,165,233,0.12); color: #ffffff; font-weight: 900; }
        .c234-total-row td { background: rgba(37,99,235,0.10); color: #ffffff; font-weight: 900; }
        .c234-grand-total-row td { background: rgba(14,165,233,0.18); color: #ffffff; font-weight: 950; }
        .c234-total-display { display: inline-flex; min-height: 40px; align-items: center; color: #bfdbfe; font-weight: 900; }
        .c234-result-panel { overflow: hidden; position: static; top: auto; }
        .c234-result-head { padding: 26px; background: linear-gradient(135deg, rgba(37,99,235,0.32), rgba(14,165,233,0.16)); border-bottom: 1px solid rgba(148,163,184,0.14); }
        .c234-result-head p { margin: 0; color: #bfdbfe; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
        .c234-result-head h2 { margin: 14px 0 4px; color: #ffffff; font-size: 32px; line-height: 1.2; word-break: break-word; }
        .c234-result-head span { color: #93c5fd; font-size: 13px; font-weight: 700; }
        .c234-result-list { padding: 18px; }
        .c234-result-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; padding: 15px 0; border-bottom: 1px solid rgba(148,163,184,0.12); }
        .c234-result-item:last-child { border-bottom: none; }
        .c234-result-item span { color: #94a3b8; font-size: 14px; line-height: 1.4; }
        .c234-result-item strong { color: #ffffff; font-size: 15px; text-align: right; white-space: normal; }
        .c234-result-item.exempt { margin-top: 10px; padding: 16px; border-radius: 16px; border: 1px solid rgba(34,197,94,0.24); background: rgba(34,197,94,0.08); }
        .c234-result-item.exempt span { color: #bbf7d0; font-weight: 800; }
        .c234-result-item.exempt strong { color: #86efac; font-size: 18px; }
        .c234-result-item.final { margin-top: 10px; padding: 16px; border-radius: 16px; border: 1px solid rgba(96,165,250,0.28); background: linear-gradient(135deg, rgba(37,99,235,0.2), rgba(14,165,233,0.1)); }
        .c234-result-item.final span { color: #bfdbfe; font-weight: 800; }
        .c234-result-item.final strong { color: #ffffff; font-size: 20px; }
        .c234-reset-btn { width: calc(100% - 36px); margin: 0 18px 20px; height: 46px; border-radius: 14px; border: 1px solid rgba(148,163,184,0.22); background: rgba(2,6,23,0.48); color: #cbd5e1; font-weight: 900; cursor: pointer; transition: all 0.2s ease; }
        .c234-reset-btn:hover { border-color: #60a5fa; color: #ffffff; background: rgba(15,23,42,0.95); }
        @media (max-width: 1100px) { .c234-page { padding: 20px; } .c234-header { flex-direction: column; align-items: flex-start; } .c234-grid { grid-template-columns: 1fr; } .c234-result-panel { position: static; } }
        @media (max-width: 680px) { .c234-form-grid { grid-template-columns: 1fr; } .c234-result-item { flex-direction: column; } .c234-result-item strong { text-align: left; } }
      `}</style>
    </div>
  );
}
