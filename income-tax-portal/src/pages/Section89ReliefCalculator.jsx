import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const AY_LIST = Array.from({ length: 2026 - 2003 + 1 }, (_, i) => {
  const y = 2003 + i;
  return `${y}-${String(y + 1).slice(-2)}`;
});

const emptyRow = () => ({
  ageGroup: "below60",
  actualAge: "",
  regime: "old",
  gender: "male",
  salary: "",
  arrear: "",
  houseProperty: "",
  otherIncome: "",

  capitalGains: {
    ltcg20: "",
    ltcg10: "",
    ltcg125: "",
    stcg15: "",
    stcg20: "",
    stcgApplicable: ""
  },

  eligibleInvestment: "",
  agriIncome: "",
  chapterVI_A: "",
  rebate: ""
});

export default function Section89ReliefCalculator() {
  const navigate = useNavigate();
  const [currentAY, setCurrentAY] = useState("2026-27");
  const [selectedAYForBreakdown, setSelectedAYForBreakdown] = useState("2026-27");
  const [rows, setRows] = useState(
    AY_LIST.map((ay) => ({
      ay,
      ...emptyRow()
    }))
  );

  const handleReset = () => {
    setRows(
      AY_LIST.map((ay) => ({
        ay,
        ...emptyRow()
      }))
    );
  };

  const handleChange = (index, field, value, subField = null) => {
    const copy = [...rows];
    if (subField) {
      copy[index][field][subField] = value;
    } else {
      copy[index][field] = value;
    }
    setRows(copy);
  };

  const num = (val) => {
    if (!val) return 0;
    const parsed = parseFloat(String(val).replace(/,/g, "").trim());
    return isNaN(parsed) ? 0 : Math.max(parsed, 0);
  };

  const formatINR = (val) => `₹ ${Number(Math.round(val || 0)).toLocaleString("en-IN")}`;

  const getSlabTaxOnly = (taxableIncome, ayYear, isNew, basicExemption, isSenior, isSuperSenior, isFemale) => {
    let tax = 0;
    let rem = taxableIncome;
    if (rem <= basicExemption) return 0;

    if (isNew) {
      if (ayYear >= 2026) {
        if (rem > 400000) tax += Math.min(rem - 400000, 400000) * 0.05;
        if (rem > 800000) tax += Math.min(rem - 800000, 400000) * 0.10;
        if (rem > 1200000) tax += Math.min(rem - 1200000, 400000) * 0.15;
        if (rem > 1600000) tax += Math.min(rem - 1600000, 400000) * 0.20;
        if (rem > 2000000) tax += Math.min(rem - 2000000, 400000) * 0.25;
        if (rem > 2400000) tax += (rem - 2400000) * 0.30;
      } else if (ayYear >= 2024) {
        if (rem > 300000) tax += Math.min(rem - 300000, 300000) * 0.05;
        if (rem > 600000) tax += Math.min(rem - 600000, 300000) * 0.10;
        if (rem > 900000) tax += Math.min(rem - 900000, 300000) * 0.15;
        if (rem > 1200000) tax += Math.min(rem - 1200000, 300000) * 0.20;
        if (rem > 1500000) tax += (rem - 1500000) * 0.30;
      } else {
        if (rem > 250000) tax += Math.min(rem - 250000, 250000) * 0.05;
        if (rem > 500000) tax += Math.min(rem - 500000, 250000) * 0.10;
        if (rem > 750000) tax += Math.min(rem - 750000, 250000) * 0.15;
        if (rem > 1000000) tax += Math.min(rem - 1000000, 250000) * 0.20;
        if (rem > 1250000) tax += Math.min(rem - 1250000, 250000) * 0.25;
        if (rem > 1500000) tax += (rem - 1500000) * 0.30;
      }
    } else {
      let taxableBal = rem - basicExemption;
      if (ayYear <= 2005) {
        tax += Math.min(taxableBal, 10000) * 0.10;
        if (taxableBal > 10000) tax += Math.min(taxableBal - 10000, 90000) * 0.20;
        if (taxableBal > 100000) tax += (taxableBal - 100000) * 0.30;
      } else if (ayYear <= 2008) {
        const s1 = Math.min(taxableBal, 150000 - basicExemption);
        tax += Math.max(s1, 0) * 0.10;
        if (rem > 150000) tax += Math.min(rem - 150000, 100000) * 0.20;
        if (rem > 250000) tax += (rem - 250000) * 0.30;
      } else if (ayYear <= 2011) {
        const limit1 = isSenior ? 225000 : isFemale ? 180000 : 150000;
        if (rem > limit1) tax += Math.min(rem - limit1, 300000 - limit1) * 0.10;
        if (rem > 300000) tax += Math.min(rem - 300000, 200000) * 0.20;
        if (rem > 500000) tax += (rem - 500000) * 0.30;
      } else if (ayYear <= 2012) {
        const limit1 = isSuperSenior ? 500000 : isSenior ? 240000 : isFemale ? 190000 : 160000;
        if (rem > limit1 && rem <= 500000) tax += (rem - limit1) * 0.10;
        else if (rem > 500000) {
          if (limit1 < 500000) tax += (500000 - limit1) * 0.10;
          tax += Math.min(rem - 500000, 300000) * 0.20;
          if (rem > 800000) tax += (rem - 800000) * 0.30;
        }
      } else {
        const rateLower = ayYear <= 2017 ? 0.10 : 0.05;
        if (rem > basicExemption && rem <= 500000) tax += (rem - basicExemption) * rateLower;
        else if (rem > 500000) {
          if (basicExemption < 500000) tax += (500000 - basicExemption) * rateLower;
          tax += Math.min(rem - 500000, 500000) * 0.20;
          if (rem > 1000000) tax += (rem - 1000000) * 0.30;
        }
      }
    }
    return tax;
  };

  const calculateAdvancedSurchargeAndMR = (ayYear, isNew, totalTaxableIncome, normalTax, specialTax, stcg15, stcg20, ltcg10, ltcg125, ltcg20, stcgApp) => {
    let surchargeRate = 0;
    let thresholdIncome = 0;
    let previousRate = 0;

    if (totalTaxableIncome > 50000000) {
      surchargeRate = isNew && ayYear >= 2024 ? 25 : 37;
      thresholdIncome = 50000000;
      previousRate = 25;
    } else if (totalTaxableIncome > 20000000) {
      surchargeRate = 25;
      thresholdIncome = 20000000;
      previousRate = 15;
    } else if (totalTaxableIncome > 10000000) {
      surchargeRate = 15;
      thresholdIncome = 10000000;
      previousRate = 10;
    } else if (totalTaxableIncome > 5000000) {
      surchargeRate = 10;
      thresholdIncome = 5000000;
      previousRate = 0;
    }

    if (surchargeRate === 0) {
      return { surchargeRate: 0, surchargeAmount: 0, surchargeMarginalRelief: 0 };
    }

    const restrictedIncomeAmount = ltcg20 + ltcg10 + ltcg125 + stcg15 + stcg20;
    const is25Applicable = totalTaxableIncome >= 20000000 && restrictedIncomeAmount > 0 && surchargeRate === 37;
    const shouldSplitSurcharge = is25Applicable && restrictedIncomeAmount > 0;

    let normalSurchargeRate = surchargeRate;
    let restrictedSurchargeRate = 0;

    if (shouldSplitSurcharge) {
      normalSurchargeRate = totalTaxableIncome > 50000000 ? 25 : (totalTaxableIncome > 20000000 ? 15 : 10);
      restrictedSurchargeRate = Math.min(surchargeRate, 15);
    }

    const baseBasicExemption = ayYear >= 2026 && isNew ? 400000 : (ayYear >= 2024 && isNew ? 300000 : 250000);
    let thresholdTax = getSlabTaxOnly(thresholdIncome, ayYear, isNew, baseBasicExemption, false, false, false);
    
    const thresholdPayable = thresholdTax + (thresholdTax * previousRate) / 100;

    const totalTax = normalTax + specialTax;
    const normalSurcharge = shouldSplitSurcharge ? (normalTax * normalSurchargeRate) / 100 : (totalTax * normalSurchargeRate) / 100;
    const restrictedSurcharge = shouldSplitSurcharge ? (specialTax * restrictedSurchargeRate) / 100 : 0;
    const surchargeBeforeRelief = normalSurcharge + restrictedSurcharge;

    const totalTaxWithSurcharge = totalTax + surchargeBeforeRelief;
    const excessIncome = Math.max(totalTaxableIncome - thresholdIncome, 0);
    const taxOnExcessIncome = (excessIncome * 30) / 100;
    const allowableNetSurcharge = Math.max(excessIncome - taxOnExcessIncome, 0);

    const rawMarginalRelief = Math.max(surchargeBeforeRelief - allowableNetSurcharge, 0);
    let marginalRelief = 0;

    if (thresholdIncome === 5000000) {
      marginalRelief = Math.min(rawMarginalRelief, surchargeBeforeRelief);
    } else {
      marginalRelief = Math.min(Math.max((totalTaxWithSurcharge - thresholdPayable) - excessIncome, 0), surchargeBeforeRelief);
    }

    if (thresholdIncome === 20000000 && !is25Applicable && surchargeRate === 37) {
      marginalRelief = 0;
    }

    const finalSurcharge = Math.max(surchargeBeforeRelief - marginalRelief, 0);

    return {
      surchargeRate,
      surchargeAmount: Math.round(finalSurcharge),
      surchargeMarginalRelief: Math.round(marginalRelief)
    };
  };

  const calculateHeadwiseComputation = (row, ayYear, includeArrear = true) => {
    const salaryRaw = num(row.salary);
    const arrearRaw = includeArrear ? num(row.arrear) : 0;
    const totalGrossSalary = salaryRaw + arrearRaw;
    const isNew = ayYear >= 2021 && row.regime === "new";

    let stdDeduction = 0;
    if (!isNew) {
      if (ayYear === 2019) stdDeduction = Math.min(totalGrossSalary, 40000);
      else if (ayYear >= 2020) stdDeduction = Math.min(totalGrossSalary, 50000);
    } else {
      if (ayYear === 2024) stdDeduction = Math.min(totalGrossSalary, 50000);
      else if (ayYear >= 2025) stdDeduction = Math.min(totalGrossSalary, 75000);
    }

    const netSalaryHead = Math.max(totalGrossSalary - stdDeduction, 0);
    const hpHead = num(row.houseProperty);
    const otherHead = num(row.otherIncome);

    const ltcg20 = num(row.capitalGains.ltcg20);
    const ltcg10 = (ayYear >= 2019 && ayYear <= 2025) ? num(row.capitalGains.ltcg10) : 0;
    const ltcg125 = ayYear >= 2025 ? num(row.capitalGains.ltcg125) : 0;
    const stcg15 = (ayYear >= 2009 && ayYear <= 2025) ? num(row.capitalGains.stcg15) : 0;
    const stcg20 = ayYear >= 2025 ? num(row.capitalGains.stcg20) : 0;
    const stcgApp = num(row.capitalGains.stcgApplicable);

    const specialRateIncomesTotal = ltcg20 + ltcg10 + ltcg125 + stcg15 + stcg20;
    const capitalGainsHead = specialRateIncomesTotal + stcgApp;

    const grossTotalIncome = netSalaryHead + hpHead + otherHead + capitalGainsHead;

    let totalDeduction = 0;
    if (!isNew) {
      const elgInv = num(row.eligibleInvestment);
      const cap80C = ayYear >= 2015 ? 150000 : ayYear >= 2007 ? 100000 : 0;
      const invAllowed = cap80C > 0 ? Math.min(elgInv, cap80C) : elgInv;
      const viaDeductions = num(row.chapterVI_A);
      totalDeduction = invAllowed + viaDeductions;
    }

    const normalIncomeGross = Math.max(grossTotalIncome - specialRateIncomesTotal, 0);
    const normalTaxableIncome = Math.max(normalIncomeGross - totalDeduction, 0);
    const totalTaxableIncome = normalTaxableIncome + specialRateIncomesTotal;

    let basicExemption = 250000;
    const isSenior =
      (ayYear <= 2011 && row.ageGroup !== "below60") ||
      (ayYear >= 2012 && (row.ageGroup === "60to79" || row.ageGroup === "80plus"));
    const isSuperSenior = ayYear >= 2012 && row.ageGroup === "80plus";
    const isFemale = row.gender === "female";

    if (isNew) {
      if (ayYear >= 2026) basicExemption = 400000;
      else if (ayYear >= 2024) basicExemption = 300000;
      else basicExemption = 250000;
    } else {
      if (ayYear <= 2005) basicExemption = 50000;
      else if (ayYear <= 2008) {
        if (isSenior) basicExemption = 195000;
        else if (isFemale) basicExemption = 145000;
        else basicExemption = 110000;
      } else if (ayYear <= 2009) {
        if (isSenior) basicExemption = 225000;
        else if (isFemale) basicExemption = 180000;
        else basicExemption = 150000;
      } else if (ayYear <= 2011) {
        if (isSenior) basicExemption = 240000;
        else if (isFemale) basicExemption = 190000;
        else basicExemption = 160000;
      } else if (ayYear <= 2012) {
        if (isSuperSenior) basicExemption = 500000;
        else if (isSenior) basicExemption = 250000;
        else if (isFemale) basicExemption = 190000;
        else basicExemption = 180000;
      } else if (ayYear <= 2014) {
        if (isSuperSenior) basicExemption = 500000;
        else if (isSenior) basicExemption = 250000;
        else basicExemption = 200000;
      } else {
        if (isSuperSenior) basicExemption = 500000;
        else if (isSenior) basicExemption = 300000;
        else basicExemption = 250000;
      }
    }

    const agriInc = num(row.agriIncome);
    let normalTax = 0;

    if (agriInc > 5000 && normalTaxableIncome > basicExemption) {
      const taxStepA = getSlabTaxOnly(normalTaxableIncome + agriInc, ayYear, isNew, basicExemption, isSenior, isSuperSenior, isFemale);
      const taxStepB = getSlabTaxOnly(basicExemption + agriInc, ayYear, isNew, basicExemption, isSenior, isSuperSenior, isFemale);
      normalTax = Math.max(taxStepA - taxStepB, 0);
    } else {
      normalTax = getSlabTaxOnly(normalTaxableIncome, ayYear, isNew, basicExemption, isSenior, isSuperSenior, isFemale);
    }

    let unusedExemption = Math.max(basicExemption - normalTaxableIncome, 0);
    let ltcg20Taxable = ltcg20;
    const ltcg10ExemptionLimit = ayYear >= 2025 ? 125000 : 100000;
    let ltcg10Taxable = Math.max(ltcg10 - ltcg10ExemptionLimit, 0);
    let ltcg125Taxable = Math.max(ltcg125 - 125000, 0);
    let stcg15Taxable = stcg15;
    let stcg20Taxable = stcg20;

    if (unusedExemption > 0) {
      const adj1 = Math.min(unusedExemption, stcg15Taxable); stcg15Taxable -= adj1; unusedExemption -= adj1;
      const adj2 = Math.min(unusedExemption, stcg20Taxable); stcg20Taxable -= adj2; unusedExemption -= adj2;
      const adj3 = Math.min(unusedExemption, ltcg125Taxable); ltcg125Taxable -= adj3; unusedExemption -= adj3;
      const adj4 = Math.min(unusedExemption, ltcg20Taxable); ltcg20Taxable -= adj4; unusedExemption -= adj4;
      const adj5 = Math.min(unusedExemption, ltcg10Taxable); ltcg10Taxable -= adj5; unusedExemption -= adj5;
    }

    const specialTax =
      ltcg20Taxable * 0.20 +
      ltcg10Taxable * 0.10 +
      ltcg125Taxable * 0.125 +
      stcg15Taxable * 0.15 +
      stcg20Taxable * 0.20 +
      stcgApp * 0.20;

    let rebate87A = 0;
    let marginalRelief87A = 0;
    const taxEligibleForRebate = (ayYear >= 2024 && isNew) ? normalTax : (normalTax + specialTax);

    if (isNew) {
      if (ayYear >= 2026) {
        const threshold = 1200000;
        const maxRebateCap = 60000;
        if (totalTaxableIncome <= threshold) {
          rebate87A = Math.min(taxEligibleForRebate, maxRebateCap);
        } else {
          const excessIncome = totalTaxableIncome - threshold;
          if (taxEligibleForRebate > excessIncome) {
            marginalRelief87A = taxEligibleForRebate - excessIncome;
            rebate87A = marginalRelief87A;
          }
        }
      } else if (ayYear >= 2024) {
        const threshold = 700000;
        const maxRebateCap = 25000;
        if (totalTaxableIncome <= threshold) {
          rebate87A = Math.min(taxEligibleForRebate, maxRebateCap);
        } else {
          const excessIncome = totalTaxableIncome - threshold;
          if (taxEligibleForRebate > excessIncome) {
            marginalRelief87A = taxEligibleForRebate - excessIncome;
            rebate87A = marginalRelief87A;
          }
        }
      }
    } else {
      const taxBeforeRebateOld = normalTax + specialTax;
      if (ayYear >= 2020 && totalTaxableIncome <= 500000) rebate87A = Math.min(taxBeforeRebateOld, 12500);
      else if (ayYear >= 2017 && totalTaxableIncome <= 350000) rebate87A = Math.min(taxBeforeRebateOld, 2500);
      else if (ayYear >= 2014 && totalTaxableIncome <= 500000) rebate87A = Math.min(taxBeforeRebateOld, 2000);
    }

    if (num(row.rebate) > 0) rebate87A = num(row.rebate);
    const taxAfterRebate = Math.max((normalTax + specialTax) - rebate87A, 0);

    const surchargeResult = calculateAdvancedSurchargeAndMR(
      ayYear,
      isNew,
      totalTaxableIncome,
      normalTax,
      specialTax,
      stcg15,
      stcg20,
      ltcg10,
      ltcg125,
      ltcg20,
      stcgApp
    );

    let cessRate = 0.04;
    if (ayYear <= 2004) cessRate = 0;
    else if (ayYear <= 2007) cessRate = 0.02;
    else if (ayYear <= 2018) cessRate = 0.03;

    const cess = (taxAfterRebate + surchargeResult.surchargeAmount) * cessRate;
    const finalTax = Math.round(taxAfterRebate + surchargeResult.surchargeAmount + cess);

    return {
      grossSalary: totalGrossSalary,
      stdDeduction,
      netSalaryHead,
      hpHead,
      capitalGainsHead,
      otherHead,
      grossTotalIncome,
      totalDeduction,
      normalTaxableIncome,
      specialRateIncomesTotal,
      totalTaxableIncome,
      basicExemption,
      normalTax: Math.round(normalTax),
      specialTax: Math.round(specialTax),
      taxBeforeRebate: Math.round(normalTax + specialTax),
      rebate87A: Math.round(rebate87A),
      marginalRelief87A: Math.round(marginalRelief87A),
      taxAfterRebate: Math.round(taxAfterRebate),
      surchargeRate: surchargeResult.surchargeRate,
      surchargeAmount: surchargeResult.surchargeAmount,
      surchargeMarginalRelief: surchargeResult.surchargeMarginalRelief,
      cessRatePercent: Math.round(cessRate * 100),
      cess: Math.round(cess),
      finalTax
    };
  };

  const section89Summary = useMemo(() => {
    const activeRows = rows.filter((r) => num(r.salary) > 0 || num(r.arrear) > 0);
    const currRow = rows.find((r) => r.ay === currentAY) || activeRows[0] || rows[rows.length - 1];
    const currAYYear = parseInt(currRow.ay.split("-")[0]);

    const calcCurrentWith = calculateHeadwiseComputation(currRow, currAYYear, true);
    const calcCurrentWithout = calculateHeadwiseComputation(currRow, currAYYear, false);
    const diffCurrent = Math.max(calcCurrentWith.finalTax - calcCurrentWithout.finalTax, 0);

    let totalDiffArrearYears = 0;
    activeRows.forEach((r) => {
      if (r.ay !== currentAY && num(r.arrear) > 0) {
        const ayYear = parseInt(r.ay.split("-")[0]);
        const calcWith = calculateHeadwiseComputation(r, ayYear, true);
        const calcWithout = calculateHeadwiseComputation(r, ayYear, false);
        totalDiffArrearYears += Math.max(calcWith.finalTax - calcWithout.finalTax, 0);
      }
    });

    const netRelief89 = Math.max(diffCurrent - totalDiffArrearYears, 0);
    return { diffCurrent, totalDiffArrearYears, netRelief89 };
  }, [rows, currentAY]);

  const activeBreakdownRow = rows.find((r) => r.ay === selectedAYForBreakdown) || rows[rows.length - 1];
  const activeBreakdownAYYear = parseInt(activeBreakdownRow.ay.split("-")[0]);
  const breakdownWith = calculateHeadwiseComputation(activeBreakdownRow, activeBreakdownAYYear, true);
  const breakdownWithout = calculateHeadwiseComputation(activeBreakdownRow, activeBreakdownAYYear, false);

  const handleExportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 28, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("SECTION 89 RELIEF & HEAD-WISE COMPUTATION REPORT", 14, 13);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`Receipt Year (Arrear Received): AY ${currentAY}  |  Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 21);

    const activeRows = rows.filter((r) => num(r.salary) > 0 || num(r.arrear) > 0);

    if (activeRows.length === 0) {
      alert("Kripya kam se kam ek year me Salary ya Arrear enter karein.");
      return;
    }

    const formatPdfAmt = (val) => `Rs. ${Number(Math.round(val || 0)).toLocaleString("en-IN")}`;

    // SECTION 1: OVERVIEW SUMMARY TABLE
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("1. Year-Wise Arrear Tax Relief Overview (Form 10E Summary)", 14, 35);

    const summaryTableBody = [];
    activeRows.forEach((r) => {
      const ayYear = parseInt(r.ay.split("-")[0]);
      const calcWith = calculateHeadwiseComputation(r, ayYear, true);
      const calcWithout = calculateHeadwiseComputation(r, ayYear, false);
      const diff = Math.max(calcWith.finalTax - calcWithout.finalTax, 0);

      summaryTableBody.push([
        r.ay,
        r.regime === "new" ? "New" : "Old",
        formatPdfAmt(calcWith.grossTotalIncome),
        formatPdfAmt(calcWith.totalDeduction),
        formatPdfAmt(calcWith.totalTaxableIncome),
        formatPdfAmt(calcWith.finalTax),
        formatPdfAmt(calcWithout.finalTax),
        formatPdfAmt(diff)
      ]);
    });

    autoTable(doc, {
      startY: 38,
      head: [["AY", "Regime", "Gross Income", "Deductions", "Taxable Net", "Tax WITH", "Tax W/O", "Tax Difference"]],
      body: summaryTableBody,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, halign: "center" },
      bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right", fontStyle: "bold" }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // NET RELIEF BOX IN PDF
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(147, 197, 253);
    doc.roundedRect(14, currentY, 182, 14, 3, 3, "FD");
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(29, 78, 216);
    doc.text(`NET TAX RELIEF ALLOWABLE U/S 89(1): ${formatPdfAmt(section89Summary.netRelief89)}`, 18, currentY + 9);

    currentY += 20;

    // SECTION 2: YEAR-WISE COMPARATIVE TABLE (WITH VS WITHOUT ARREAR)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("2. Detailed Year-Wise Head Computation (WITH vs WITHOUT Arrear)", 14, currentY);

    currentY += 4;

    activeRows.forEach((r) => {
      const ayYear = parseInt(r.ay.split("-")[0]);
      const calcWith = calculateHeadwiseComputation(r, ayYear, true);
      const calcWithout = calculateHeadwiseComputation(r, ayYear, false);
      const taxDiff = Math.max(calcWith.finalTax - calcWithout.finalTax, 0);

      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      const comparativeRows = [
        ["1. Income from Salaries (Gross)", formatPdfAmt(calcWith.grossSalary), formatPdfAmt(calcWithout.grossSalary)],
        ["Less: Standard Deduction u/s 16", formatPdfAmt(calcWith.stdDeduction), formatPdfAmt(calcWithout.stdDeduction)],
        ["Net Income from Salaries", formatPdfAmt(calcWith.netSalaryHead), formatPdfAmt(calcWithout.netSalaryHead)],
        ["2. Income from House Property", formatPdfAmt(calcWith.hpHead), formatPdfAmt(calcWithout.hpHead)],
        ["3. Capital Gains (Special Rate + Slab CG)", formatPdfAmt(calcWith.capitalGainsHead), formatPdfAmt(calcWithout.capitalGainsHead)],
        ["4. Income from Other Sources", formatPdfAmt(calcWith.otherHead), formatPdfAmt(calcWithout.otherHead)],
        ["Gross Total Income (GTI)", formatPdfAmt(calcWith.grossTotalIncome), formatPdfAmt(calcWithout.grossTotalIncome)],
        ["Less: Chapter VI-A Deductions", formatPdfAmt(calcWith.totalDeduction), formatPdfAmt(calcWithout.totalDeduction)],
        ["Total Taxable Net Income", formatPdfAmt(calcWith.totalTaxableIncome), formatPdfAmt(calcWithout.totalTaxableIncome)],
        ["Tax on Normal Slab Income", formatPdfAmt(calcWith.normalTax), formatPdfAmt(calcWithout.normalTax)],
        ["Tax on Special Rate Capital Gains", formatPdfAmt(calcWith.specialTax), formatPdfAmt(calcWithout.specialTax)],
        ["Less: Rebate u/s 87A", formatPdfAmt(calcWith.rebate87A), formatPdfAmt(calcWithout.rebate87A)],
        ["Add: Surcharge", formatPdfAmt(calcWith.surchargeAmount), formatPdfAmt(calcWithout.surchargeAmount)],
        ["Add: Health & Education Cess", formatPdfAmt(calcWith.cess), formatPdfAmt(calcWithout.cess)],
        ["TOTAL TAX PAYABLE", formatPdfAmt(calcWith.finalTax), formatPdfAmt(calcWithout.finalTax)],
        ["TAX DIFFERENCE FOR THIS YEAR", "", formatPdfAmt(taxDiff)]
      ];

      autoTable(doc, {
        startY: currentY,
        head: [[`AY ${r.ay} (${r.regime === "new" ? "New Regime" : "Old Regime"})`, "WITH Arrear", "WITHOUT Arrear"]],
        body: comparativeRows,
        theme: "striped",
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
        bodyStyles: { fontSize: 7.5, textColor: [51, 65, 85] },
        columnStyles: {
          0: { cellWidth: 102 },
          1: { cellWidth: 40, halign: "right", fontStyle: "bold" },
          2: { cellWidth: 40, halign: "right", fontStyle: "bold" }
        },
        margin: { left: 14, right: 14 },
        didParseCell: (data) => {
          if (data.row.index === 14) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [220, 252, 231];
            data.cell.styles.textColor = [22, 101, 52];
          }
          if (data.row.index === 15) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [219, 234, 254];
            data.cell.styles.textColor = [30, 64, 175];
          }
        }
      });

      currentY = doc.lastAutoTable.finalY + 8;
    });

    doc.save(`Form10E_Detailed_Computation_AY_${currentAY}.pdf`);
  };

  return (
    <div className="s89-page">
      <div className="s89-container">
        
        {/* TOP BAR */}
        <div className="s89-topbar">
          <button type="button" className="s89-back-btn" onClick={() => navigate(-1)}>
            <span>←</span> Back
          </button>

          <div className="s89-topbar-right">
            <div className="s89-receipt-select">
              <label>Receipt Year (Arrear Received):</label>
              <select value={currentAY} onChange={(e) => setCurrentAY(e.target.value)}>
                {AY_LIST.slice(-6).map((ay) => (
                  <option key={ay} value={ay}>
                    AY {ay}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" onClick={handleExportPDF} className="s89-pdf-btn">
              📄 Download PDF Report
            </button>
          </div>
        </div>

        {/* HEADER */}
        <div className="s89-header">
          <div>
            <p className="s89-kicker">INCOME TAX UTILITY</p>
            <h1>Section 89 Relief & Head-Wise Computation</h1>
            <p>Advanced Surcharge & Marginal Relief Engine integrated seamlessly with PDF breakdown.</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="s89-summary-card">
          <div className="s89-summary-item">
            <span>Extra Tax in Receipt Year (AY {currentAY}) (A)</span>
            <strong>{formatINR(section89Summary.diffCurrent)}</strong>
          </div>
          <div className="s89-summary-item">
            <span>Total Tax on Arrears in Past Years (B)</span>
            <strong>{formatINR(section89Summary.totalDiffArrearYears)}</strong>
          </div>
          <div className="s89-summary-item highlight">
            <span>Net Tax Relief u/s 89(1) (A - B)</span>
            <h2>{formatINR(section89Summary.netRelief89)}</h2>
          </div>
        </div>

        {/* YEAR-WISE INPUT CARDS */}
        <div className="s89-card">
          <div className="s89-card-header">
            <h3>1. Year-Wise Income Input</h3>
            <p>Select any AY row to view its detailed breakdown below.</p>
          </div>

          <div className="year-cards-container">
            {rows.map((row, index) => {
              const ayYear = parseInt(row.ay.split("-")[0]);
              const isNewAllowed = ayYear >= 2021;
              const isFemaleAllowed = ayYear <= 2012;
              const isNewSelected = isNewAllowed && row.regime === "new";
              const isSelectedForBreakdown = row.ay === selectedAYForBreakdown;

              return (
                <div
                  key={row.ay}
                  className={`wireframe-card ${row.ay === currentAY ? "is-receipt" : ""} ${
                    isSelectedForBreakdown ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedAYForBreakdown(row.ay)}
                >
                  <div className="card-top-controls">
                    <div className="control-box ay-box">
                      <label>AY</label>
                      <div className="ay-badge">
                        {row.ay}
                        {row.ay === currentAY && <span className="tag">Receipt</span>}
                      </div>
                    </div>

                    <div className="control-box">
                      <label>AGE</label>
                      <input
                        value={row.actualAge}
                        onChange={(e) => handleChange(index, "actualAge", e.target.value)}
                        placeholder="Age"
                      />
                    </div>

                    <div className="control-box">
                      <label>AGE GROUP</label>
                      <select
                        value={row.ageGroup}
                        onChange={(e) => handleChange(index, "ageGroup", e.target.value)}
                      >
                        <option value="below60">Below {ayYear <= 2011 ? "65" : "60"}</option>
                        <option value="60to79">{ayYear <= 2011 ? "65+" : "60–79"}</option>
                        {ayYear >= 2012 && <option value="80plus">80+</option>}
                      </select>
                    </div>

                    <div className="control-box">
                      <label>REGIME</label>
                      <select
                        value={isNewAllowed ? row.regime : "old"}
                        disabled={!isNewAllowed}
                        className={!isNewAllowed ? "disabled-cell" : ""}
                        onChange={(e) => handleChange(index, "regime", e.target.value)}
                      >
                        <option value="old">Old</option>
                        {isNewAllowed && <option value="new">New</option>}
                      </select>
                    </div>

                    <div className="control-box">
                      <label>GENDER</label>
                      <select
                        value={row.gender}
                        disabled={!isFemaleAllowed}
                        className={!isFemaleAllowed ? "disabled-cell" : ""}
                        onChange={(e) => handleChange(index, "gender", e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="income-divider">
                    <span>income & deduction details</span>
                  </div>

                  <div className="card-income-grid">
                    <div className="income-box">
                      <label>Salary u/s 17(1)</label>
                      <input
                        value={row.salary}
                        onChange={(e) => handleChange(index, "salary", e.target.value)}
                        placeholder="Basic + Allowances"
                      />
                    </div>

                    <div className="income-box">
                      <label>Arrear u/s 89</label>
                      <input
                        value={row.arrear}
                        onChange={(e) => handleChange(index, "arrear", e.target.value)}
                        placeholder="Arrear Amt"
                      />
                    </div>

                    <div className="income-box">
                      <label>House Property u/s 24</label>
                      <input
                        value={row.houseProperty}
                        onChange={(e) => handleChange(index, "houseProperty", e.target.value)}
                        placeholder="HP Income / Interest"
                      />
                    </div>

                    <div className="income-box">
                      <label>Other Sources u/s 56</label>
                      <input
                        value={row.otherIncome}
                        onChange={(e) => handleChange(index, "otherIncome", e.target.value)}
                        placeholder="Interest / Dividend"
                      />
                    </div>

                    <div className="income-box cg-inline">
                      <label>LTCG u/s 112 (20%)</label>
                      <input
                        value={row.capitalGains.ltcg20}
                        onChange={(e) => handleChange(index, "capitalGains", e.target.value, "ltcg20")}
                        placeholder="u/s 112 (20%)"
                      />
                    </div>

                    {ayYear >= 2019 && ayYear <= 2025 && (
                      <div className="income-box cg-inline">
                        <label>LTCG u/s 112A (10%)</label>
                        <input
                          value={row.capitalGains.ltcg10}
                          onChange={(e) => handleChange(index, "capitalGains", e.target.value, "ltcg10")}
                          placeholder="u/s 112A (10%)"
                        />
                      </div>
                    )}

                    {ayYear >= 2025 && (
                      <div className="income-box cg-inline">
                        <label>LTCG u/s 112A (12.5%)</label>
                        <input
                          value={row.capitalGains.ltcg125}
                          onChange={(e) => handleChange(index, "capitalGains", e.target.value, "ltcg125")}
                          placeholder="u/s 112A (12.5%)"
                        />
                      </div>
                    )}

                    {ayYear >= 2009 && ayYear <= 2025 && (
                      <div className="income-box cg-inline">
                        <label>STCG u/s 111A (15%)</label>
                        <input
                          value={row.capitalGains.stcg15}
                          onChange={(e) => handleChange(index, "capitalGains", e.target.value, "stcg15")}
                          placeholder="u/s 111A (15%)"
                        />
                      </div>
                    )}

                    {ayYear >= 2025 && (
                      <div className="income-box cg-inline">
                        <label>STCG u/s 111A (20%)</label>
                        <input
                          value={row.capitalGains.stcg20}
                          onChange={(e) => handleChange(index, "capitalGains", e.target.value, "stcg20")}
                          placeholder="u/s 111A (20%)"
                        />
                      </div>
                    )}

                    <div className="income-box cg-inline">
                      <label>STCG Slab Rate</label>
                      <input
                        value={row.capitalGains.stcgApplicable}
                        onChange={(e) => handleChange(index, "capitalGains", e.target.value, "stcgApplicable")}
                        placeholder="Normal Slab CG"
                      />
                    </div>

                    <div className="income-box ded-inline">
                      <label>Eligible Inv u/s 80C</label>
                      <input
                        value={isNewSelected ? "" : row.eligibleInvestment}
                        disabled={isNewSelected}
                        className={isNewSelected ? "disabled-cell" : ""}
                        onChange={(e) => handleChange(index, "eligibleInvestment", e.target.value)}
                        placeholder="80C / Inv"
                      />
                    </div>

                    <div className="income-box ded-inline">
                      <label>Agri Income u/s 10(1)</label>
                      <input
                        value={row.agriIncome}
                        onChange={(e) => handleChange(index, "agriIncome", e.target.value)}
                        placeholder="Agri Income"
                      />
                    </div>

                    <div className="income-box ded-inline">
                      <label>Chapter VI-A Deductions</label>
                      <input
                        value={isNewSelected ? "" : row.chapterVI_A}
                        disabled={isNewSelected}
                        className={isNewSelected ? "disabled-cell" : ""}
                        onChange={(e) => handleChange(index, "chapterVI_A", e.target.value)}
                        placeholder="Chapter VI-A"
                      />
                    </div>

                    <div className="income-box ded-inline">
                      <label>Manual Rebate u/s 87A</label>
                      <input
                        value={row.rebate}
                        onChange={(e) => handleChange(index, "rebate", e.target.value)}
                        placeholder="Rebate 87A"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="s89-actions">
            <button type="button" onClick={handleReset} className="s89-btn-secondary">
              Reset All Inputs
            </button>
          </div>
        </div>

        {/* COMPUTATION BREAKDOWN CARD */}
        <div className="s89-card margin-top">
          <div className="s89-card-header">
            <h3>2. Head-Wise Tax Return Computation (Selected AY {selectedAYForBreakdown})</h3>
            <p>Form 10E detailed breakdown comparing Tax WITH Arrear vs Tax WITHOUT Arrear.</p>
          </div>

          <div className="s89-computation-grid">
            <table className="s89-computation-table">
              <thead>
                <tr>
                  <th>Head of Income / Computation Particulars</th>
                  <th>WITH Arrear (Total)</th>
                  <th>WITHOUT Arrear (Base)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Income from Salaries (Gross Salary)</td>
                  <td>{formatINR(breakdownWith.grossSalary)}</td>
                  <td>{formatINR(breakdownWithout.grossSalary)}</td>
                </tr>
                <tr>
                  <td>Less: Standard Deduction u/s 16</td>
                  <td>{formatINR(breakdownWith.stdDeduction)}</td>
                  <td>{formatINR(breakdownWithout.stdDeduction)}</td>
                </tr>
                <tr className="subtotal-row">
                  <td>
                    <strong>Net Income from Salaries</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWith.netSalaryHead)}</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWithout.netSalaryHead)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>2. Income from House Property</td>
                  <td>{formatINR(breakdownWith.hpHead)}</td>
                  <td>{formatINR(breakdownWithout.hpHead)}</td>
                </tr>
                <tr>
                  <td>3. Capital Gains (u/s 112, 112A, 111A & Slab Rates)</td>
                  <td>{formatINR(breakdownWith.capitalGainsHead)}</td>
                  <td>{formatINR(breakdownWithout.capitalGainsHead)}</td>
                </tr>
                <tr>
                  <td>4. Income from Other Sources</td>
                  <td>{formatINR(breakdownWith.otherHead)}</td>
                  <td>{formatINR(breakdownWithout.otherHead)}</td>
                </tr>
                <tr className="total-head-row">
                  <td>
                    <strong>Gross Total Income (GTI)</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWith.grossTotalIncome)}</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWithout.grossTotalIncome)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Less: Deductions under Chapter VI-A (80C, etc.)</td>
                  <td>{formatINR(breakdownWith.totalDeduction)}</td>
                  <td>{formatINR(breakdownWithout.totalDeduction)}</td>
                </tr>
                <tr className="grand-total-row">
                  <td>
                    <strong>Total Taxable Net Income</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWith.totalTaxableIncome)}</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWithout.totalTaxableIncome)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Tax on Normal Slab Income (Incl. Agri Partial Integration)</td>
                  <td>{formatINR(breakdownWith.normalTax)}</td>
                  <td>{formatINR(breakdownWithout.normalTax)}</td>
                </tr>
                <tr>
                  <td>Tax on Special Rate Capital Gains (u/s 112 / 112A / 111A)</td>
                  <td>{formatINR(breakdownWith.specialTax)}</td>
                  <td>{formatINR(breakdownWithout.specialTax)}</td>
                </tr>
                <tr>
                  <td>
                    Less: Rebate u/s 87A (Incl. Marginal Relief: {formatINR(breakdownWith.marginalRelief87A)})
                  </td>
                  <td>{formatINR(breakdownWith.rebate87A)}</td>
                  <td>{formatINR(breakdownWithout.rebate87A)}</td>
                </tr>
                <tr>
                  <td>
                    Add: Surcharge ({breakdownWith.surchargeRate}% - Marginal Relief:{" "}
                    {formatINR(breakdownWith.surchargeMarginalRelief)})
                  </td>
                  <td>{formatINR(breakdownWith.surchargeAmount)}</td>
                  <td>{formatINR(breakdownWithout.surchargeAmount)}</td>
                </tr>
                <tr>
                  <td>Add: Health & Education Cess ({breakdownWith.cessRatePercent}%)</td>
                  <td>{formatINR(breakdownWith.cess)}</td>
                  <td>{formatINR(breakdownWithout.cess)}</td>
                </tr>
                <tr className="final-tax-row">
                  <td>
                    <strong>TOTAL TAX PAYABLE (INCL. CESS)</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWith.finalTax)}</strong>
                  </td>
                  <td>
                    <strong>{formatINR(breakdownWithout.finalTax)}</strong>
                  </td>
                </tr>
                <tr className="diff-row">
                  <td colSpan="2">
                    <strong>TAX DIFFERENCE FOR AY {selectedAYForBreakdown}</strong>
                  </td>
                  <td>
                    <strong>
                      {formatINR(Math.max(breakdownWith.finalTax - breakdownWithout.finalTax, 0))}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 rgba(15, 23, 42, 0.6);
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(7, 17, 31, 0.9); border-radius: 6px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 6px; border: 1px solid rgba(96, 165, 250, 0.2); }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #1d4ed8, #2563eb); }

        .s89-page { min-height: 100vh; background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.2), transparent 30%), linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%); color: #e5e7eb; padding: 24px; font-family: Inter, Arial, sans-serif; }
        .s89-container { max-width: 1650px; margin: 0 auto; }
        .s89-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .s89-topbar-right { display: flex; align-items: center; gap: 14px; }
        .s89-back-btn { display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 12px; border: 1px solid rgba(148,163,184,0.22); background: rgba(15,23,42,0.9); color: #cbd5e1; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .s89-back-btn:hover { border-color: #60a5fa; color: #fff; background: rgba(37,99,235,0.15); }
        .s89-receipt-select { display: flex; align-items: center; gap: 10px; background: rgba(15,23,42,0.9); padding: 6px 14px; border-radius: 12px; border: 1px solid rgba(148,163,184,0.2); }
        .s89-receipt-select label { font-size: 13px; font-weight: 700; color: #93c5fd; }
        .s89-receipt-select select { height: 34px; border-radius: 8px; border: 1px solid rgba(148,163,184,0.22); background: rgba(2,6,23,0.5); color: #fff; padding: 0 10px; font-weight: 800; }
        .s89-pdf-btn { height: 42px; padding: 0 20px; border-radius: 12px; border: none; background: #2563eb; color: #fff; font-weight: 900; cursor: pointer; transition: all 0.2s; }
        .s89-pdf-btn:hover { background: #1d4ed8; }
        .s89-header { margin-bottom: 20px; padding: 22px 26px; border-radius: 20px; background: rgba(15,23,42,0.85); border: 1px solid rgba(148,163,184,0.18); }
        .s89-kicker { color: #60a5fa; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; font-weight: 800; margin: 0 0 6px; }
        .s89-header h1 { font-size: 28px; margin: 0; color: #ffffff; }
        .s89-header p { margin: 8px 0 0; color: #94a3b8; font-size: 14px; }
        .s89-summary-card { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 24px; }
        .s89-summary-item { background: rgba(15,23,42,0.9); border: 1px solid rgba(148,163,184,0.18); border-radius: 18px; padding: 18px; }
        .s89-summary-item span { display: block; color: #94a3b8; font-size: 13px; font-weight: 700; margin-bottom: 6px; }
        .s89-summary-item strong { color: #ffffff; font-size: 22px; }
        .s89-summary-item.highlight { background: linear-gradient(135deg, rgba(37,99,235,0.2), rgba(14,165,233,0.12)); border-color: rgba(96,165,250,0.3); }
        .s89-summary-item.highlight h2 { margin: 0; color: #60a5fa; font-size: 26px; }
        .s89-card { background: rgba(15,23,42,0.9); border: 1px solid rgba(148,163,184,0.18); border-radius: 20px; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .margin-top { margin-top: 24px; }
        .s89-card-header { margin-bottom: 16px; border-bottom: 1px solid rgba(148,163,184,0.12); padding-bottom: 12px; }
        .s89-card-header h3 { margin: 0; color: #ffffff; font-size: 18px; }
        .s89-card-header p { margin: 4px 0 0; color: #94a3b8; font-size: 13px; }

        .year-cards-container { display: flex; flex-direction: column; gap: 16px; max-height: 700px; overflow-y: auto; padding-right: 6px; }
        .wireframe-card { border: 2px solid rgba(148,163,184,0.2); border-radius: 14px; background: rgba(2,6,23,0.4); padding: 16px; transition: all 0.2s ease; cursor: pointer; }
        .wireframe-card:hover { border-color: #60a5fa; }
        .wireframe-card.is-receipt { border-color: #2563eb; background: rgba(37,99,235,0.08); }
        .wireframe-card.is-selected { border-color: #38bdf8; box-shadow: 0 0 15px rgba(56,189,248,0.25); }

        .card-top-controls { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; background: rgba(15,23,42,0.8); padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(148,163,184,0.15); }
        .control-box { display: flex; flex-direction: column; gap: 4px; }
        .control-box label { font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; }
        .control-box input, .control-box select { height: 34px; border-radius: 6px; border: 1.5px solid rgba(148,163,184,0.25); background: rgba(2,6,23,0.6); color: #fff; font-weight: 700; padding: 0 8px; font-size: 12px; outline: none; }
        .ay-box { align-items: flex-start; }
        .ay-badge { font-size: 14px; font-weight: 900; color: #60a5fa; display: flex; align-items: center; gap: 6px; margin-top: 4px; }
        .ay-badge .tag { font-size: 9px; background: #2563eb; color: #fff; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }

        .income-divider { margin: 12px 0 8px; border-bottom: 1px dashed rgba(148,163,184,0.2); text-align: left; }
        .income-divider span { font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; }

        .card-income-grid { display: flex; flex-wrap: wrap; gap: 12px; }
        .income-box { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 160px; }
        .income-box label { font-size: 11px; font-weight: 700; color: #cbd5e1; }
        .income-box input { height: 34px; border-radius: 6px; border: 1px solid rgba(148,163,184,0.2); background: rgba(2,6,23,0.5); color: #fff; padding: 0 10px; font-size: 12px; outline: none; }
        
        .cg-inline label { color: #93c5fd; }
        .cg-inline input { border-color: rgba(96,165,250,0.3); background: rgba(37,99,235,0.08); }
        .ded-inline label { color: #34d399; }
        .disabled-cell { background: rgba(15,23,42,0.7) !important; color: #64748b !important; cursor: not-allowed; }

        .s89-actions { display: flex; gap: 14px; margin-top: 16px; }
        .s89-btn-secondary { height: 40px; padding: 0 20px; border-radius: 10px; border: 1px solid rgba(148,163,184,0.22); background: rgba(2,6,23,0.48); color: #cbd5e1; font-weight: 800; cursor: pointer; }
        .s89-btn-secondary:hover { border-color: #60a5fa; color: #fff; }
        
        .s89-computation-grid { width: 100%; overflow-x: auto; }
        .s89-computation-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .s89-computation-table th, .s89-computation-table td { padding: 10px 14px; border-bottom: 1px solid rgba(148,163,184,0.12); text-align: left; }
        .s89-computation-table th { background: rgba(15,23,42,0.95); color: #bfdbfe; font-weight: 900; }
        .s89-computation-table td:nth-child(2), .s89-computation-table td:nth-child(3) { text-align: right; font-weight: 600; width: 25%; }
        .subtotal-row td { background: rgba(37,99,235,0.06); color: #bfdbfe; }
        .total-head-row td { background: rgba(37,99,235,0.12); color: #ffffff; }
        .grand-total-row td { background: rgba(14,165,233,0.16); color: #ffffff; font-size: 14px; }
        .final-tax-row td { background: rgba(34,197,94,0.15); color: #86efac; font-size: 14px; }
        .diff-row td { background: rgba(96,165,250,0.18); color: #ffffff; text-align: right !important; font-size: 15px; }
      `}</style>
    </div>
  );
}