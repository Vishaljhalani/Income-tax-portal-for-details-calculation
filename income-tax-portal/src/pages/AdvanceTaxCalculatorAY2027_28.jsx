import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
export default function AdvanceTaxCalculatorAY2027_28() {
  const navigate = useNavigate();
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
    const initialFormData = {
    taxYear: "2026-27",
    status: "Individual",
    residentialStatus: "Resident",
    dob: "",
    salaryIncome: "",
    salaryDeductionNotAllowed: "",
    housePropertyLetOut: "",
    housePropertyDeduction: "",
    housePropertySelfOccupied: "",
    businessOrdinary: "",
    businessDeductionNotAllowed: "",
    businessSpeculative: "",
    presumptiveBusiness: "",
    ltcg125Section198: "",
    ltcg10Others: "",
    ltcg125Section197: "",
    stcgSection196: "",
    stcgOthers: "",
    otherIncome: "",
    casualIncome: "",
    familyPension: "",
    agriculturalIncome: "",
    clubbingIncome: "",
    numberOfChildren: "",
    minorIncome: "",
    bfHouseProperty: "",
    bfBusinessOrdinary: "",
    bfBusinessSpeculation: "",
    bfLTCG: "",
    bfSTCG: "",
    bfUnabsorbedDepreciation: "",
    chapterVIA: "",
    chapterVIANewRegime: "",
    adjustedTotalIncomeAMT: "",
    companyOption: "NO",
    coOperativeOption: "NO",
    bookProfit: "",
    tds: "",
    advanceTaxPaid: "",
    months234A: "",
    months234B: "",
    advanceTaxJune: "",
    advanceTaxSeptember: "",
    advanceTaxDecember: "",
    advanceTaxMarch: "",
    matCredit:"",
    };
const [formData, setFormData] = useState(initialFormData);
const [result, setResult] =useState(null);
const resultRef = useRef(null);
const handleChange = (e) => {
const { name, value, type, checked } = e.target;
    setFormData({...formData,[name]: type === "checkbox" ? checked : value,});};
const handleReset = () => {setFormData(initialFormData);setResult(null);};
const handleDownloadPDF = () => {

  const element =
    document.getElementById("print-section");

  const options = {

    margin: 0.3,

    filename:
      `Advance-Tax-Report-${formData.taxYear}.pdf`,

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {
      scale: 2,
      useCORS: true
    },

    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }

  };

  html2pdf(element, options);

};
const formatAmount = (value) => {
    return Number(value || 0).toLocaleString();};
const calculateTax = () => {
  if (!formData.status) {
    alert("Please select Status");
  return;}
  if (formData.status === "Individual"&&!formData.dob) {
  alert("Please enter Date of Birth");
  return;}
    // =====================
    // AGE CALCULATION
    // =====================
const today = new Date();
const dob = formData.dob ? new Date(formData.dob) : null;
let age = 0;
    if (dob) {age = today.getFullYear() - dob.getFullYear();
const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 ||(monthDiff === 0 && today.getDate() < dob.getDate())) {age--;}}
    
    // =====================
    // SENIOR CITIZEN
    // =====================
const isSeniorCitizen = age >= 60;
const isSuperSeniorCitizen = age >= 80;







const salaryBeforeStandardDeduction =
  Number(formData.salaryIncome || 0);

let salaryIncomeOld =
  Math.max(
    0,
    salaryBeforeStandardDeduction - 50000
  );

let salaryIncomeNew =
  Math.max(
    0,
    salaryBeforeStandardDeduction +
    Number(formData.salaryDeductionNotAllowed || 0)
    - 75000
  );
const letOutNAV =
  Number(formData.housePropertyLetOut || 0);

const oldHousePropertyIncome =
  (letOutNAV * 0.70)
  - Number(formData.housePropertyDeduction || 0)
  + Number(formData.housePropertySelfOccupied || 0);

const newHousePropertyIncome =
  (letOutNAV * 0.70)
  - Number(formData.housePropertyDeduction || 0);


const capitalGainIncome =
  Number(formData.ltcg125Section198 || 0)
  + Number(formData.ltcg10Others || 0)
  + Number(formData.ltcg125Section197 || 0)
  + Number(formData.stcgSection196 || 0)
  + Number(formData.stcgOthers || 0);
const eligibleChildren =
  Math.min(Number(formData.numberOfChildren || 0), 2);

const minorExemption =
  Math.min(
    Number(formData.minorIncome || 0),
    eligibleChildren * 1500
  );

const clubbedMinorIncome =
  Number(formData.minorIncome || 0)
  - minorExemption;

const familyPension =
  Number(formData.familyPension || 0);

const familyPensionDeduction =
  Math.min(
    familyPension / 3,
    25000
  );

const netFamilyPension =
  Math.max(
    0,
    familyPension - familyPensionDeduction
  );

let otherIncome =
  Number(formData.otherIncome || 0)
  + Number(formData.casualIncome || 0)
  + netFamilyPension
  + Number(formData.clubbingIncome || 0)
  + clubbedMinorIncome;

  // =====================
// ADJUSTED INCOME
// =====================

const adjustedHousePropertyIncomeOld =
  oldHousePropertyIncome;

const adjustedHousePropertyIncomeNew =
  newHousePropertyIncome;

const adjustedBusinessOrdinaryOld =
  Number(formData.businessOrdinary || 0);

const adjustedBusinessOrdinaryNew =
  Number(formData.businessOrdinary || 0)
  + Number(formData.businessDeductionNotAllowed || 0);



const adjustedBusinessSpeculation =
  Number(formData.businessSpeculative || 0);

const adjustedPresumptiveBusiness =
  Number(formData.presumptiveBusiness || 0);

const adjustedSTCG196 =
  Number(formData.stcgSection196 || 0);

const adjustedSTCGOthers =
  Number(formData.stcgOthers || 0);

const adjustedLTCG198 =
  Number(formData.ltcg125Section198 || 0);

const adjustedLTCG197 =
  Number(formData.ltcg125Section197 || 0);

const adjustedLTCGOthers =
  Number(formData.ltcg10Others || 0);


// =====================
// CURRENT YEAR LOSS SET OFF
// =====================

let currentHousePropertyOld =
  adjustedHousePropertyIncomeOld;

let currentHousePropertyNew =
  adjustedHousePropertyIncomeNew;


// =====================
// HOUSE PROPERTY LOSS AVAILABLE
// =====================

let hpLossOld = 0;

if (currentHousePropertyOld < 0) {

  hpLossOld = Math.abs(
    currentHousePropertyOld
  );

  currentHousePropertyOld = 0;
}
// =====================
// HOUSE PROPERTY LOSS → SALARY
// =====================

if (
  hpLossOld > 0 &&
  salaryIncomeOld > 0
) {

  const used = Math.min(
    hpLossOld,
    salaryIncomeOld
  );

  salaryIncomeOld -= used;
  hpLossOld -= used;
}

// =====================
// HOUSE PROPERTY LOSS → BUSINESS
// =====================

if (
  hpLossOld > 0 &&
  currentBusinessOrdinaryOld > 0
) {

  const used = Math.min(
    hpLossOld,
    currentBusinessOrdinaryOld
  );

  currentBusinessOrdinaryOld -= used;
  hpLossOld -= used;
}

if (
  hpLossOld > 0 &&
  currentPresumptiveBusinessOld > 0
) {

  const used = Math.min(
    hpLossOld,
    currentPresumptiveBusinessOld
  );

  currentPresumptiveBusinessOld -= used;
  hpLossOld -= used;
}

if (
  hpLossOld > 0 &&
  currentBusinessSpeculationOld > 0
) {

  const used = Math.min(
    hpLossOld,
    currentBusinessSpeculationOld
  );

  currentBusinessSpeculationOld -= used;
  hpLossOld -= used;
}

// =====================
// HOUSE PROPERTY LOSS → OTHER SOURCES
// =====================

if (
  hpLossOld > 0 &&
  otherIncome > 0
) {

  const used = Math.min(
    hpLossOld,
    otherIncome
  );

  otherIncome -= used;
  hpLossOld -= used;
}

if (
  hpLossOld > 0 &&
  currentSTCGOthers > 0
) {

  const used = Math.min(
    hpLossOld,
    currentSTCGOthers
  );

  currentSTCGOthers -= used;
  hpLossOld -= used;
}

if (
  hpLossOld > 0 &&
  currentSTCG196 > 0
) {

  const used = Math.min(
    hpLossOld,
    currentSTCG196
  );

  currentSTCG196 -= used;
  hpLossOld -= used;
}

if (
  hpLossOld > 0 &&
  currentLTCG198 > 0
) {

  const used = Math.min(
    hpLossOld,
    currentLTCG198
  );

  currentLTCG198 -= used;
  hpLossOld -= used;
}

if (
  hpLossOld > 0 &&
  currentLTCG197 > 0
) {

  const used = Math.min(
    hpLossOld,
    currentLTCG197
  );

  currentLTCG197 -= used;
  hpLossOld -= used;
}

if (
  hpLossOld > 0 &&
  currentLTCGOthers > 0
) {

  const used = Math.min(
    hpLossOld,
    currentLTCGOthers
  );

  currentLTCGOthers -= used;
  hpLossOld -= used;
}






  

let currentBusinessOrdinaryOld =
  adjustedBusinessOrdinaryOld;

let currentBusinessOrdinaryNew =
  adjustedBusinessOrdinaryNew;

let currentBusinessSpeculationOld =
  adjustedBusinessSpeculation;

let currentBusinessSpeculationNew =
  adjustedBusinessSpeculation;

let currentPresumptiveBusinessOld =
  adjustedPresumptiveBusiness;

let currentPresumptiveBusinessNew =
  adjustedPresumptiveBusiness;

        // =====================
// CURRENT YEAR BUSINESS LOSS SET OFF
// =====================

// Ordinary Business Loss - OLD REGIME
if (currentBusinessOrdinaryOld < 0) {

  let loss = Math.abs(currentBusinessOrdinaryOld);

  currentBusinessOrdinaryOld = 0;

  // Presumptive Profit
 let used = Math.min(
  loss,
  Math.max(0, currentPresumptiveBusinessOld)
);

currentPresumptiveBusinessOld -= used;
loss -= used;

used = Math.min(
  loss,
  Math.max(0, currentBusinessSpeculationOld)
);

currentBusinessSpeculationOld -= used;
loss -= used;

currentBusinessOrdinaryOld = -loss;
}

// Ordinary Business Loss - NEW REGIME
if (currentBusinessOrdinaryNew < 0) {

  let loss = Math.abs(currentBusinessOrdinaryNew);

  currentBusinessOrdinaryNew = 0;

  // Presumptive Profit
 let used = Math.min(
  loss,
  Math.max(0, currentPresumptiveBusinessNew)
);

currentPresumptiveBusinessNew -= used;
loss -= used;

used = Math.min(
  loss,
  Math.max(0, currentBusinessSpeculationNew)
);

currentBusinessSpeculationNew -= used;
loss -= used;

currentBusinessOrdinaryNew = -loss;
}

// Presumptive Business Loss
// Presumptive Business Loss - OLD
if (currentPresumptiveBusinessOld < 0) {

  let loss = Math.abs(currentPresumptiveBusinessOld);

  currentPresumptiveBusinessOld = 0;

  let used = Math.min(
    loss,
    Math.max(0, currentBusinessOrdinaryOld)
  );

  currentBusinessOrdinaryOld -= used;
  loss -= used;

  

  used = Math.min(
    loss,
    Math.max(0, currentBusinessSpeculationOld)
  );

  currentBusinessSpeculationOld -= used;
  loss -= used;

  currentPresumptiveBusinessOld = -loss;
}

// Presumptive Business Loss - NEW
if (currentPresumptiveBusinessNew < 0) {

  let loss = Math.abs(currentPresumptiveBusinessNew);

  currentPresumptiveBusinessNew = 0;

  let used = Math.min(
    loss,
    Math.max(0, currentBusinessOrdinaryNew)
  );

  currentBusinessOrdinaryNew -= used;
  loss -= used;

  used = Math.min(
    loss,
    Math.max(0, currentBusinessSpeculationNew)
  );

  currentBusinessSpeculationNew -= used;
  loss -= used;

  currentPresumptiveBusinessNew = -loss;

}

// =====================
// REMAINING BUSINESS LOSS
// =====================

let businessLossOld = 0;

if (currentBusinessOrdinaryOld < 0) {

  businessLossOld += Math.abs(
    currentBusinessOrdinaryOld
  );

  currentBusinessOrdinaryOld = 0;
}

if (currentPresumptiveBusinessOld < 0) {

  businessLossOld += Math.abs(
    currentPresumptiveBusinessOld
  );

  currentPresumptiveBusinessOld = 0;
}

// =====================
// BUSINESS LOSS → HOUSE PROPERTY
// =====================

if (
  businessLossOld > 0 &&
  currentHousePropertyOld > 0
) {

  const used = Math.min(
    businessLossOld,
    currentHousePropertyOld
  );

  currentHousePropertyOld -= used;
  businessLossOld -= used;
}

// =====================
// BUSINESS LOSS → OTHER SOURCES
// =====================

if (
  businessLossOld > 0 &&
  otherIncome > 0
) {

  const used = Math.min(
    businessLossOld,
    otherIncome
  );

  otherIncome -= used;
  businessLossOld -= used;
}

// =====================
// BUSINESS LOSS → STCG (SLAB RATE)
// =====================

if (
  businessLossOld > 0 &&
  currentSTCGOthers > 0
) {

  const used = Math.min(
    businessLossOld,
    currentSTCGOthers
  );

  currentSTCGOthers -= used;
  businessLossOld -= used;
}

if (
  businessLossOld > 0 &&
  currentSTCG196 > 0
) {

  const used = Math.min(
    businessLossOld,
    currentSTCG196
  );

  currentSTCG196 -= used;
  businessLossOld -= used;
}

if (
  businessLossOld > 0 &&
  currentLTCG198 > 0
) {

  const used = Math.min(
    businessLossOld,
    currentLTCG198
  );

  currentLTCG198 -= used;
  businessLossOld -= used;
}

if (
  businessLossOld > 0 &&
  currentLTCG197 > 0
) {

  const used = Math.min(
    businessLossOld,
    currentLTCG197
  );

  currentLTCG197 -= used;
  businessLossOld -= used;
}

if (
  businessLossOld > 0 &&
  currentLTCGOthers > 0
) {

  const used = Math.min(
    businessLossOld,
    currentLTCGOthers
  );

  currentLTCGOthers -= used;
  businessLossOld -= used;
}


// =====================
// REMAINING BUSINESS LOSS - NEW
// =====================

let businessLossNew = 0;

if (currentBusinessOrdinaryNew < 0) {

  businessLossNew += Math.abs(
    currentBusinessOrdinaryNew
  );

  currentBusinessOrdinaryNew = 0;
}

if (currentPresumptiveBusinessNew < 0) {

  businessLossNew += Math.abs(
    currentPresumptiveBusinessNew
  );

  currentPresumptiveBusinessNew = 0;
}

if (
  businessLossNew > 0 &&
  currentHousePropertyNew > 0
) {

  const used = Math.min(
    businessLossNew,
    currentHousePropertyNew
  );

  currentHousePropertyNew -= used;
  businessLossNew -= used;
}

if (
  businessLossNew > 0 &&
  otherIncome > 0
) {

  const used = Math.min(
    businessLossNew,
    otherIncome
  );

  otherIncome -= used;
  businessLossNew -= used;
}

// =====================
// BUSINESS LOSS → STCG (SLAB RATE)
// =====================

if (
  businessLossNew > 0 &&
  currentSTCGOthers > 0
) {

  const used = Math.min(
    businessLossNew,
    currentSTCGOthers
  );

  currentSTCGOthers -= used;
  businessLossNew -= used;
}

if (
  businessLossNew > 0 &&
  currentSTCG196 > 0
) {

  const used = Math.min(
    businessLossNew,
    currentSTCG196
  );

  currentSTCG196 -= used;
  businessLossNew -= used;
}

if (
  businessLossNew > 0 &&
  currentLTCG198 > 0
) {

  const used = Math.min(
    businessLossNew,
    currentLTCG198
  );

  currentLTCG198 -= used;
  businessLossNew -= used;
}

if (
  businessLossNew > 0 &&
  currentLTCG197 > 0
) {

  const used = Math.min(
    businessLossNew,
    currentLTCG197
  );

  currentLTCG197 -= used;
  businessLossNew -= used;
}

if (
  businessLossNew > 0 &&
  currentLTCGOthers > 0
) {

  const used = Math.min(
    businessLossNew,
    currentLTCGOthers
  );

  currentLTCGOthers -= used;
  businessLossNew -= used;
}

// =====================
// CURRENT YEAR SPECULATION LOSS
// =====================

const currentYearSpeculationLossCF =
  Math.abs(
    Math.min(
      0,
      currentBusinessSpeculationOld
    )
  );

currentBusinessSpeculationOld =
  Math.max(
    0,
    currentBusinessSpeculationOld
  );

// IMPORTANT:
// Speculation Loss
// No adjustment allowed against
// Ordinary or Presumptive Profit


let currentSTCG196 =
  adjustedSTCG196;

let currentSTCGOthers =
  adjustedSTCGOthers;

let currentLTCG198 =
  adjustedLTCG198;

let currentLTCG197 =
  adjustedLTCG197;

let currentLTCGOthers =
  adjustedLTCGOthers;

// =====================
// CURRENT YEAR CAPITAL LOSS SET OFF
// =====================

// STCG u/s 196 loss

if (currentSTCG196 < 0) {

  let loss = Math.abs(currentSTCG196);

  currentSTCG196 = 0;

  let used = Math.min(loss, currentSTCGOthers);
  currentSTCGOthers -= used;
  loss -= used;

  used = Math.min(loss, currentLTCG198);
  currentLTCG198 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCG197);
  currentLTCG197 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCGOthers);
  currentLTCGOthers -= used;
  loss -= used;

  currentSTCG196 = -loss;
}


// STCG Other loss

if (currentSTCGOthers < 0) {

  let loss = Math.abs(currentSTCGOthers);

  currentSTCGOthers = 0;

  let used = Math.min(loss, currentSTCG196);
  currentSTCG196 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCG198);
  currentLTCG198 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCG197);
  currentLTCG197 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCGOthers);
  currentLTCGOthers -= used;
  loss -= used;

  currentSTCGOthers = -loss;
}


// LTCG u/s 198 loss

if (currentLTCG198 < 0) {

  let loss = Math.abs(currentLTCG198);

  currentLTCG198 = 0;

  let used = Math.min(loss, currentLTCG197);
  currentLTCG197 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCGOthers);
  currentLTCGOthers -= used;
  loss -= used;
  
  currentLTCG198 = -loss;
}


// LTCG u/s 197 loss

if (currentLTCG197 < 0) {

  let loss = Math.abs(currentLTCG197);

  currentLTCG197 = 0;

  let used = Math.min(loss, currentLTCG198);
  currentLTCG198 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCGOthers);
  currentLTCGOthers -= used;
  loss -= used;

  currentLTCG197 = -loss;
}


// Other LTCG loss

if (currentLTCGOthers < 0) {

  let loss = Math.abs(currentLTCGOthers);

  currentLTCGOthers = 0;

  let used = Math.min(loss, currentLTCG198);
  currentLTCG198 -= used;
  loss -= used;

  used = Math.min(loss, currentLTCG197);
  currentLTCG197 -= used;
  loss -= used;

  currentLTCGOthers = -loss;
}

// =====================
// REMAINING STCG LOSS
// =====================



if (currentSTCG196 < 0) {

  currentYearSTCGLossCF += Math.abs(
    currentSTCG196
  );

  currentSTCG196 = 0;
}

if (currentSTCGOthers < 0) {

  currentYearSTCGLossCF += Math.abs(
    currentSTCGOthers
  );

  currentSTCGOthers = 0;
}

// =====================
// REMAINING LTCG LOSS
// =====================



if (currentLTCG198 < 0) {

  currentYearLTCGLossCF += Math.abs(
    currentLTCG198
  );

  currentLTCG198 = 0;
}

if (currentLTCG197 < 0) {

  currentYearLTCGLossCF += Math.abs(
    currentLTCG197
  );

  currentLTCG197 = 0;
}

if (currentLTCGOthers < 0) {

  currentYearLTCGLossCF += Math.abs(
    currentLTCGOthers
  );

  currentLTCGOthers = 0;
}

  
  
// =====================
// BROUGHT FORWARD LOSSES
// =====================

let bfHousePropertyOld =
  Number(formData.bfHouseProperty || 0);

  if (
  bfHousePropertyOld > 0 &&
  currentHousePropertyOld > 0
) {

  const used = Math.min(
    bfHousePropertyOld,
    currentHousePropertyOld
  );

  currentHousePropertyOld -= used;
  bfHousePropertyOld -= used;
}

let bfHousePropertyNew =
  Number(formData.bfHouseProperty || 0);

  if (
  bfHousePropertyNew > 0 &&
  currentHousePropertyNew > 0
) {

  const used = Math.min(
    bfHousePropertyNew,
    currentHousePropertyNew
  );

  currentHousePropertyNew -= used;
  bfHousePropertyNew -= used;
}

let bfBusinessOrdinaryOld =
  Number(formData.bfBusinessOrdinary || 0);

  if (
  bfBusinessOrdinaryOld > 0 &&
  currentBusinessOrdinaryOld > 0
) {

  const used = Math.min(
    bfBusinessOrdinaryOld,
    currentBusinessOrdinaryOld
  );

  currentBusinessOrdinaryOld -= used;
  bfBusinessOrdinaryOld -= used;
}

let bfBusinessOrdinaryNew =
  Number(formData.bfBusinessOrdinary || 0);

  if (
  bfBusinessOrdinaryNew > 0 &&
  currentBusinessOrdinaryNew > 0
) {

  const used = Math.min(
    bfBusinessOrdinaryNew,
    currentBusinessOrdinaryNew
  );

  currentBusinessOrdinaryNew -= used;
  bfBusinessOrdinaryNew -= used;
}

let bfBusinessSpeculationOld =
  Number(formData.bfBusinessSpeculation || 0);

  if (
  bfBusinessSpeculationOld > 0 &&
  currentBusinessSpeculationOld > 0
) {

  const used = Math.min(
    bfBusinessSpeculationOld,
    currentBusinessSpeculationOld
  );

  currentBusinessSpeculationOld -= used;
  bfBusinessSpeculationOld -= used;
}

let bfBusinessSpeculationNew =
  Number(formData.bfBusinessSpeculation || 0);

if (
  bfBusinessSpeculationNew > 0 &&
  currentBusinessSpeculationNew > 0
) {

  const used = Math.min(
    bfBusinessSpeculationNew,
    currentBusinessSpeculationNew
  );

  currentBusinessSpeculationNew -= used;
  bfBusinessSpeculationNew -= used;
}













const bfSTCGLoss =
  Number(formData.bfSTCGLoss || 0);

// =====================
// BF STCG LOSS SET OFF
// =====================

let remainingBFSTCGLoss = bfSTCGLoss;

if (
  remainingBFSTCGLoss > 0 &&
  currentSTCG196 > 0
) {

  const used = Math.min(
    remainingBFSTCGLoss,
    currentSTCG196
  );

  currentSTCG196 -= used;
  remainingBFSTCGLoss -= used;
}

if (
  remainingBFSTCGLoss > 0 &&
  currentSTCGOthers > 0
) {

  const used = Math.min(
    remainingBFSTCGLoss,
    currentSTCGOthers
  );

  currentSTCGOthers -= used;
  remainingBFSTCGLoss -= used;
}










if (
  remainingBFSTCGLoss > 0 &&
  currentLTCG198 > 0
) {

  const used = Math.min(
    remainingBFSTCGLoss,
    currentLTCG198
  );

  currentLTCG198 -= used;
  remainingBFSTCGLoss -= used;
}

if (
  remainingBFSTCGLoss > 0 &&
  currentLTCG197 > 0
) {

  const used = Math.min(
    remainingBFSTCGLoss,
    currentLTCG197
  );

  currentLTCG197 -= used;
  remainingBFSTCGLoss -= used;
}

if (
  remainingBFSTCGLoss > 0 &&
  currentLTCGOthers > 0
) {

  const used = Math.min(
    remainingBFSTCGLoss,
    currentLTCGOthers
  );

  currentLTCGOthers -= used;
  remainingBFSTCGLoss -= used;
}

const bfLTCGLoss =
  Number(formData.bfLTCGLoss || 0);

// =====================
// BF LTCG LOSS SET OFF
// =====================
let remainingBFLTCGLoss =
  bfLTCGLoss;

if (
  remainingBFLTCGLoss > 0 &&
  currentLTCG198 > 0
) {

  const used = Math.min(
    remainingBFLTCGLoss,
    currentLTCG198
  );

  currentLTCG198 -= used;
  remainingBFLTCGLoss -= used;
}

if (
  remainingBFLTCGLoss > 0 &&
  currentLTCG197 > 0
) {

  const used = Math.min(
    remainingBFLTCGLoss,
    currentLTCG197
  );

  currentLTCG197 -= used;
  remainingBFLTCGLoss -= used;
}

if (
  remainingBFLTCGLoss > 0 &&
  currentLTCGOthers > 0
) {

  const used = Math.min(
    remainingBFLTCGLoss,
    currentLTCGOthers
  );

  currentLTCGOthers -= used;
  remainingBFLTCGLoss -= used;
}

const bfSTCGLossCF =
  remainingBFSTCGLoss;

const bfLTCGLossCF =
  remainingBFLTCGLoss;


let bfUnabsorbedDepreciation =
  Number(formData.bfUnabsorbedDepreciation || 0);

// =====================
// UNABSORBED DEPRECIATION SET OFF
// =====================

let remainingUnabsorbedDepreciationOld =
  bfUnabsorbedDepreciation;

let remainingUnabsorbedDepreciationNew =
  bfUnabsorbedDepreciation;
// =====================
// UNABSORBED DEPRECIATION → ORDINARY BUSINESS
// =====================

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentBusinessOrdinaryOld > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentBusinessOrdinaryOld
  );

  currentBusinessOrdinaryOld -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentBusinessOrdinaryNew > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentBusinessOrdinaryNew
  );

  currentBusinessOrdinaryNew -= used;
  remainingUnabsorbedDepreciationNew -= used;
}

// =====================
// UNABSORBED DEPRECIATION → PRESUMPTIVE BUSINESS
// =====================

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentPresumptiveBusinessOld > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentPresumptiveBusinessOld
  );

  currentPresumptiveBusinessOld -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentPresumptiveBusinessNew > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentPresumptiveBusinessNew
  );

  currentPresumptiveBusinessNew -= used;
  remainingUnabsorbedDepreciationNew -= used;
}
// =====================
// UNABSORBED DEPRECIATION → HOUSE PROPERTY
// =====================

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentHousePropertyOld > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentHousePropertyOld
  );

  currentHousePropertyOld -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentHousePropertyNew > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentHousePropertyNew
  );

  currentHousePropertyNew -= used;
  remainingUnabsorbedDepreciationNew -= used;
}

// =====================
// UNABSORBED DEPRECIATION → OTHER SOURCES
// =====================

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  otherIncome > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    otherIncome
  );

  otherIncome -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  otherIncome > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    otherIncome
  );

  otherIncome -= used;
  remainingUnabsorbedDepreciationNew -= used;
}

// =====================
// UNABSORBED DEPRECIATION → CAPITAL GAIN (OLD)
// =====================

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentSTCG196 > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentSTCG196
  );

  currentSTCG196 -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentSTCGOthers > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentSTCGOthers
  );

  currentSTCGOthers -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentLTCG198 > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentLTCG198
  );

  currentLTCG198 -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentLTCG197 > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentLTCG197
  );

  currentLTCG197 -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

if (
  remainingUnabsorbedDepreciationOld > 0 &&
  currentLTCGOthers > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationOld,
    currentLTCGOthers
  );

  currentLTCGOthers -= used;
  remainingUnabsorbedDepreciationOld -= used;
}

// =====================
// UNABSORBED DEPRECIATION → CAPITAL GAIN (NEW)
// =====================

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentSTCG196 > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentSTCG196
  );

  currentSTCG196 -= used;
  remainingUnabsorbedDepreciationNew -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentSTCGOthers > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentSTCGOthers
  );

  currentSTCGOthers -= used;
  remainingUnabsorbedDepreciationNew -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentLTCG198 > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentLTCG198
  );

  currentLTCG198 -= used;
  remainingUnabsorbedDepreciationNew -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentLTCG197 > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentLTCG197
  );

  currentLTCG197 -= used;
  remainingUnabsorbedDepreciationNew -= used;
}

if (
  remainingUnabsorbedDepreciationNew > 0 &&
  currentLTCGOthers > 0
) {

  const used = Math.min(
    remainingUnabsorbedDepreciationNew,
    currentLTCGOthers
  );

  currentLTCGOthers -= used;
  remainingUnabsorbedDepreciationNew -= used;
}
const bfUnabsorbedDepreciationCFOld =
  remainingUnabsorbedDepreciationOld;

const bfUnabsorbedDepreciationCFNew =
  remainingUnabsorbedDepreciationNew;



const currentYearHousePropertyLossCF =
  hpLossOld;

const currentYearBusinessLossCFOld =
  businessLossOld;

const currentYearBusinessLossCFNew =
  businessLossNew;

const currentYearSpeculationLossCFOld =
  speculationLossOld;

const currentYearSpeculationLossCFNew =
  speculationLossNew;

let currentYearSTCGLossCF =
  remainingSTCGLoss;

let currentYearLTCGLossCF =
  remainingLTCGLoss;

const finalHousePropertyIncomeOld =
  Math.max(0, currentHousePropertyOld);

const finalHousePropertyIncomeNew =
  Math.max(0, currentHousePropertyNew);

const finalBusinessIncomeOld =
  Math.max(0, currentBusinessOrdinaryOld)
  + Math.max(0, currentPresumptiveBusinessOld)
  + Math.max(0, currentBusinessSpeculationOld);

const finalBusinessIncomeNew =
  Math.max(0, currentBusinessOrdinaryNew)
  + Math.max(0, currentPresumptiveBusinessNew)
  + Math.max(0, currentBusinessSpeculationNew);


const finalCapitalGainIncome =
  currentSTCG196 +
  currentSTCGOthers +
  currentLTCG198 +
  currentLTCG197 +
  currentLTCGOthers;

const finalOtherIncome =
  Math.max(0, otherIncome);

const grossTotalIncomeOld =
  salaryIncomeOld
  + finalHousePropertyIncomeOld
  + finalBusinessIncomeOld
  + finalCapitalGainIncome
  + finalOtherIncome;

const grossTotalIncomeNew =
  salaryIncomeNew
  + finalHousePropertyIncomeNew
  + finalBusinessIncomeNew
  + finalCapitalGainIncome
  + finalOtherIncome;




const totalDeductionOld =
  Number(formData.totalDeductionOld || 0);

const totalDeductionNew =
  Number(formData.totalDeductionNew || 0);

const allowedDeductionOld = Math.min(
  totalDeductionOld,
  Math.max(0, grossTotalIncomeOld)
);

const allowedDeductionNew = Math.min(
  totalDeductionNew,
  Math.max(0, grossTotalIncomeNew)
);


const totalIncomeOld = Math.max(
  0,
  grossTotalIncomeOld - allowedDeductionOld
);

const totalIncomeNew = Math.max(
  0,
  grossTotalIncomeNew - allowedDeductionNew
);

const oldRegimeRoundedIncome =
  Math.round(totalIncomeOld / 10) * 10;

const newRegimeRoundedIncome =
  Math.round(totalIncomeNew / 10) * 10;

const seniorCitizenWithBusiness =
  isSeniorCitizen &&
  finalBusinessIncomeOld > 0;

const seniorCitizenWithoutBusiness =
  isSeniorCitizen &&
  finalBusinessIncomeOld <= 0;







  



const agriculturalIncome = Number(formData.agriculturalIncome || 0);
let oldBasicExemption = 250000;

if (
  formData.status === "Individual" &&
  formData.residentialStatus === "Resident") 
  {
  if (isSuperSeniorCitizen) {
    oldBasicExemption = 500000;
  }
  else if (isSeniorCitizen) {
    oldBasicExemption = 300000;
  }
}
let newBasicExemption = 400000;
const oldAgriIntegrationApplicable = agriculturalIncome > 5000 && oldRegimeRoundedIncome >
     oldBasicExemption;
const newAgriIntegrationApplicable =agriculturalIncome > 5000 && newRegimeRoundedIncome >
     newBasicExemption;

function calculateOldSlabTax(income) {  income = Math.max(0, income);
    if (income <= oldBasicExemption) {
    return 0;}
    // Resident Individual
    if (formData.status === "Individual" &&formData.residentialStatus === "Resident") {
    // Super Senior Citizen
    if (isSuperSeniorCitizen) {
    if (income <= 500000)return 0;
    if (income <= 1000000)return (income - 500000) * 0.20;
      return (100000 +(income - 1000000) * 0.30);}
    // Senior Citizen
    if (isSeniorCitizen) {
    if (income <= 500000)return (income - 300000) * 0.05;
    if (income <= 1000000)return (10000 +(income - 500000) * 0.20);
    return (110000 +(income - 1000000) * 0.30);}}
    // Default slab
    if (income <= 500000)return (income - 250000) * 0.05;
    if (income <= 1000000)
      return (12500 +(income - 500000) * 0.20);
      return (112500 +(income - 1000000) * 0.30);}
function calculateNewSlabTax(income) {  income = Math.max(0, income);
    if (income <= 400000)return 0;
    if (income <= 800000)return ((income - 400000) * 0.05);
    if (income <= 1200000)return (20000 +(income - 800000) * 0.10);
    if (income <= 1600000)return (60000 +(income - 1200000) * 0.15);
    if (income <= 2000000)return (120000 +(income - 1600000) * 0.20);
    if (income <= 2400000)return (200000 +(income - 2000000) * 0.25);
      return (300000 +(income - 2400000) * 0.30);}
const oldSlabTax =calculateOldSlabTax(oldRegimeRoundedIncome);
const newSlabTax =calculateNewSlabTax(newRegimeRoundedIncome);
const isFirmOrLLP =formData.status === "Firm" || formData.status === "LLP";
  function calculateFirmTax(income) { return income * 0.30;}
  function calculateLocalAuthorityTax(income) {return income * 0.30;}
  function calculateCooperativeNormalTax(income) {
  if (income <= 10000)
    return income * 0.10;
  if (income <= 20000)
    return 1000 + (income - 10000) * 0.20;
    return 3000 + (income - 20000) * 0.30;}
  function calculate115BADTax(income) {return income * 0.22;}
  function calculate115BAETax(income) {return income * 0.15;}
  function calculateCompany25Tax(income) {return income * 0.25;}
  function calculate115BATax(income) {return income * 0.25;}
  function calculate115BAATax(income) {return income * 0.22;}
  function calculate115BABTax(income) {return income * 0.15;}
 
// =====================
// BASE TAX ENGINE
// =====================
function calculateBaseTax({

  regime,

  status,

  taxableIncome,

  agriculturalApplicable,

  agriculturalTax,

  slabTax,

  companyOption,

  cooperativeOption,

}) {

  let tax =
    agriculturalApplicable
      ? agriculturalTax
      : slabTax;

  switch (status) {

    case "Firm":

    case "LLP":

      tax =
        calculateFirmTax(
          taxableIncome
        );

      break;

    case "Local Authority":

      tax =
        calculateLocalAuthorityTax(
          taxableIncome
        );

      break;

    case "Co-operative Society":

      switch (cooperativeOption) {

        case "115BAD":

          tax =
            calculate115BADTax(
              taxableIncome
            );

          break;

        case "115BAE":

          tax =
            calculate115BAETax(
              taxableIncome
            );

          break;

        default:

          tax =
            calculateCooperativeNormalTax(
              taxableIncome
            );

      }

      break;

    case "Private Company":

    case "Public Company":

      switch (companyOption) {

        case "TURNOVER_400":

          tax =
            calculateCompany25Tax(
              taxableIncome
            );

          break;

        case "115BA":

          tax =
            calculate115BATax(
              taxableIncome
            );

          break;

        case "115BAA":

          tax =
            calculate115BAATax(
              taxableIncome
            );

          break;

        case "115BAB":

          tax =
            calculate115BABTax(
              taxableIncome
            );

          break;

        default:

          tax =
            taxableIncome * 0.30;

      }

      break;

    case "Foreign Company":

      tax =
        calculateForeignCompanyTax(
          taxableIncome
        );

      break;

    default:

      break;

  }

  return tax;

}

let oldTax = calculateBaseTax({

  regime: "Old",

  status: formData.status,

  taxableIncome: oldRegimeRoundedIncome,

  agriculturalApplicable: oldAgriIntegrationApplicable,

  agriculturalTax: oldAgriculturalTax,

  slabTax: oldSlabTax,

  companyOption: formData.companyOption,

  cooperativeOption: formData.coOperativeOption,

});

let newTax = calculateBaseTax({

  regime: "New",

  status: formData.status,

  taxableIncome: newRegimeRoundedIncome,

  agriculturalApplicable: newAgriIntegrationApplicable,

  agriculturalTax: newAgriculturalTax,

  slabTax: newSlabTax,

  companyOption: formData.companyOption,

  cooperativeOption: formData.coOperativeOption,

});

const stcg196Tax =
  Math.max(0, currentSTCG196) * 0.20;

const ltcg198Tax =
  Math.max(0, currentLTCG198) * 0.125;

const ltcg197Tax =
  Math.max(0, currentLTCG197) * 0.125;

const ltcgOtherTax =
  Math.max(0, currentLTCGOthers) * 0.10;

const casualIncomeTax =
   Number(formData.casualIncome || 0) * 0.30;


   // =====================
// SPECIAL TAX ENGINE
// =====================

function calculateSpecialTax({

  stcg111A,

  ltcg112A,

  ltcg112,

  otherLTCG,

  casualIncome,

}) {

  const stcg111ATax =
    Math.max(0, stcg111A) * 0.20;

  const ltcg112ATax =
    Math.max(0, ltcg112A) * 0.125;

  const ltcg112Tax =
    Math.max(0, ltcg112) * 0.125;

  const otherLTCGTax =
    Math.max(0, otherLTCG) * 0.10;

  const casualTax =
    Math.max(0, casualIncome) * 0.30;

  return {

    stcg111ATax,

    ltcg112ATax,

    ltcg112Tax,

    otherLTCGTax,

    casualTax,

    totalSpecialTax:

      stcg111ATax +

      ltcg112ATax +

      ltcg112Tax +

      otherLTCGTax +

      casualTax,

  };

}
const specialTaxResult =
  calculateSpecialTax({

    stcg111A:
      currentSTCG196,

    ltcg112A:
      currentLTCG198,

    ltcg112:
      currentLTCG197,

    otherLTCG:
      currentLTCGOthers,

    casualIncome:
      Number(formData.casualIncome || 0),

});

const specialRateTax =
  specialTaxResult.totalSpecialTax;

  // =====================
// DIVIDEND TRACKING
// =====================

const dividendIncome =
  Math.max(
    0,
    Number(formData.dividendIncome || 0)
  );



const oldDividendTax =
  oldNormalIncome > 0
    ? (oldNormalTax / oldNormalIncome) *
      dividendIncome
    : 0;

const newDividendTax =
  newNormalIncome > 0
    ? (newNormalTax / newNormalIncome) *
      dividendIncome
    : 0;

const totalSpecialIncome =

  Math.max(0, currentSTCG196) +

  Math.max(0, currentLTCG198) +

  Math.max(0, currentLTCG197) +

  Math.max(0, currentLTCGOthers) +

  Math.max(
    0,
    Number(formData.casualIncome || 0)
  ) +

  dividendIncome;
 
  // =====================
// REBATE ENGINE
// =====================

function calculateRebate({

  regime,

  rebate,

  tax,

}) {

  return Math.min(

    rebate,

    tax

  );

}
// =====================
// FINAL TAX OBJECT
// =====================

const oldTaxResult = {

  taxableIncome: oldRegimeRoundedIncome,

  normalIncome: oldNormalIncome,

  normalTax: oldNormalTax,

  specialIncome: totalSpecialIncome,

  specialTax: specialRateTax,

  rebate: oldRebate,

  taxAfterRebate: oldTax,

};

const newTaxResult = {

  taxableIncome: newRegimeRoundedIncome,

  normalIncome: newNormalIncome,

  normalTax: newNormalTax,

  specialIncome: totalSpecialIncome,

  specialTax: specialRateTax,

  rebate: newRebate,

  taxAfterRebate: newTax,

};


const oldNormalIncome = Math.max(0, oldRegimeRoundedIncome - totalSpecialIncome);
const newNormalIncome = Math.max(0, newRegimeRoundedIncome - totalSpecialIncome);
const oldNormalTax = calculateOldSlabTax(oldNormalIncome);
const newNormalTax = calculateNewSlabTax(newNormalIncome);
let oldRebate = 0;
let newRebate = 0;

// =====================
// SECTION 87A REBATE
// =====================

if (
  formData.status === "Individual" &&
  formData.residentialStatus === "Resident"
) {

  // Old Regime
  if (oldRegimeRoundedIncome <= 500000) {

   oldRebate = Math.min(
  oldNormalTax +
  specialRateTax,
  12500
);
  }

  // New Regime
  if (newRegimeRoundedIncome <= 1200000) {

    newRebate = Math.min(
      newNormalTax,
      60000
    );

  }

}
 
   oldTax =

Math.max(

0,

oldNormalTax -

oldRebate

)

+

specialRateTax;


newTax =

Math.max(

0,

newNormalTax -

newRebate

)

+

specialRateTax;
    // =====================
// NEW REGIME MARGINAL REBATE RELIEF
// =====================


if (
  formData.status === "Individual" &&
  formData.residentialStatus === "Resident" &&
  newRegimeRoundedIncome > 1200000 &&
  newRegimeRoundedIncome <= 1275000
) {

  const excessIncome =
    newRegimeRoundedIncome - 1200000;

  const maximumTaxAllowed =
    specialRateTax +
    excessIncome;

  if (newTax > maximumTaxAllowed) {

    newTax = maximumTaxAllowed;

  }

}



// =====================
// SURCHARGE RATE
// =====================

function calculateSurchargeRate(

  income,

  regime,

  status,

  companyOption,

  coOperativeOption

) {

  let rate = 0;

  // ---------------------
  // Individual / HUF / AOP / BOI / AJP
  // ---------------------

  const individualStatuses = [
  "Individual",
  "HUF",
  "AOP",
  "AOP Trust",
  "BOI",
  "Artificial Judicial Person"
];

  if (individualStatuses.includes(status)) {

    if (regime === "Old") {

      if (income > 50000000) rate = 0.37;

      else if (income > 20000000) rate = 0.25;

      else if (income > 10000000) rate = 0.15;

      else if (income > 5000000) rate = 0.10;

    }

    else {

      if (income > 20000000) rate = 0.25;

      else if (income > 10000000) rate = 0.15;

      else if (income > 5000000) rate = 0.10;

    }

  }

  // Firm / LLP / Local Authority

  else if (

    status === "Firm" ||

    status === "LLP" ||

    status === "Local Authority"

  ) {

    if (income > 10000000)

      rate = 0.12;

  }

  // Co-operative Society

  else if (status === "Co-operative Society") {

    if (

      coOperativeOption === "115BAD" ||

      coOperativeOption === "115BAE"

    ) {

      if (income > 10000000)

        rate = 0.10;

    }

    else {

      if (income > 10000000)

        rate = 0.12;

    }

  }

  // Domestic Company

  else if (

    status === "Private Company" ||

    status === "Public Company"

  ) {

    switch (companyOption) {

      case "115BA":
case "115BAA":
case "115BAB":

        rate = income > 10000000 ? 0.10 : 0;

        break;

      default:

        if (income > 100000000)

          rate = 0.12;

        else if (income > 10000000)

          rate = 0.07;

    }

  }

  // Foreign Company

  else if (status === "Foreign Company") {

    if (income > 100000000)

      rate = 0.05;

    else if (income > 10000000)

      rate = 0.02;

  }

  return rate;

}

// =====================
// SURCHARGE RATE
// =====================

const oldSurchargeRate =
  calculateSurchargeRate(
    oldRegimeRoundedIncome,
    "Old",
    formData.status,
    formData.companyOption,
    formData.coOperativeOption
  );

const newSurchargeRate =
  calculateSurchargeRate(
    newRegimeRoundedIncome,
    "New",
    formData.status,
    formData.companyOption,
    formData.coOperativeOption
  );


// Income eligible for 15% surcharge cap

const oldSurchargeCap15Tax =
  stcg196Tax +
  ltcg198Tax +
  ltcg197Tax +
  oldDividendTax;

const newSurchargeCap15Tax =
  stcg196Tax +
  ltcg198Tax +
  ltcg197Tax +
  newDividendTax;

const oldSurchargeResult =
  calculateTaxWithSurcharge(
    oldTax,
    oldSurchargeRate,
    oldSurchargeCap15Tax
  );

const newSurchargeResult =
  calculateTaxWithSurcharge(
    newTax,
    newSurchargeRate,
    newSurchargeCap15Tax
  );

let oldSurcharge =
  oldSurchargeResult.surcharge;

let newSurcharge =
  newSurchargeResult.surcharge;

let oldTaxWithSurcharge =
  oldSurchargeResult.taxWithSurcharge;

let newTaxWithSurcharge =
  newSurchargeResult.taxWithSurcharge;

// =====================
// PORTAL MARGINAL RELIEF
// =====================
function calculateThresholdTax(
  thresholdIncome,
  regime,
  surchargeRate,
  specialRateTax
) {

  const thresholdNormalIncome =
    Math.max(
      0,
      thresholdIncome - totalSpecialIncome
    );

  let thresholdNormalTax =
    regime === "Old"
      ? calculateOldSlabTax(thresholdNormalIncome)
      : calculateNewSlabTax(thresholdNormalIncome);

  // Rebate u/s 87A only for normal tax
  if (
    formData.status === "Individual" &&
    formData.residentialStatus === "Resident"
  ) {

    if (
      regime === "Old" &&
      thresholdIncome <= 500000
    ) {

      thresholdNormalTax = Math.max(
        0,
        thresholdNormalTax - 12500
      );

    }

    if (
      regime === "New" &&
      thresholdIncome <= 1200000
    ) {

      thresholdNormalTax = Math.max(
        0,
        thresholdNormalTax - 60000
      );

    }

  }

  const thresholdTotalTax =
    thresholdNormalTax +
    specialRateTax;

  return calculateTaxWithSurcharge(
    thresholdTotalTax,
    surchargeRate,
    specialRateTax
  ).taxWithSurcharge;

}
function applyPortalMarginalRelief(
  income,
  taxWithSurcharge,
  thresholds,
  regime,
  surchargeRate,
  specialRateTax
) {

  let finalTax = taxWithSurcharge;

  for (const threshold of thresholds) {

    if (income <= threshold) continue;

    const thresholdTax =
      calculateThresholdTax(
        threshold,
        regime,
        surchargeRate,
        specialRateTax
      );

    const maximumTax =
      thresholdTax +
      (income - threshold);

    if (finalTax > maximumTax) {

      finalTax = maximumTax;

    }

  }

  return finalTax;

}
  // =====================
// MARGINAL RELIEF THRESHOLDS
// =====================

const oldMMRThresholds = [
  5000000,
  10000000,
  20000000,
  50000000
];

const newMMRThresholds = [
  5000000,
  10000000,
  20000000
];

// =====================
// SURCHARGE CALCULATOR
// =====================

function calculateTaxWithSurcharge(

  tax,

  surchargeRate,

  surchargeCap15Tax

) {

  const normalTax = Math.max(

    0,

    tax - surchargeCap15Tax

  );

  const surchargeOnSpecialIncome =

    surchargeCap15Tax *

    Math.min(

      surchargeRate,

      0.15

    );

  const surchargeOnNormalIncome =

    normalTax *

    surchargeRate;

  const surcharge =

    surchargeOnSpecialIncome +

    surchargeOnNormalIncome;

  return {

    surcharge,

    taxWithSurcharge:

      tax + surcharge,

  };

}

// =====================
// APPLY PORTAL MARGINAL RELIEF
// =====================

oldTaxWithSurcharge =
  applyPortalMarginalRelief(
    oldRegimeRoundedIncome,
    oldTaxWithSurcharge,
    oldMMRThresholds,
    "Old",
    oldSurchargeRate,
    oldSurchargeCap15Tax
  );

newTaxWithSurcharge =
  applyPortalMarginalRelief(
    newRegimeRoundedIncome,
    newTaxWithSurcharge,
    newMMRThresholds,
    "New",
    newSurchargeRate,
    newSurchargeCap15Tax
  );

// =====================
// HEALTH & EDUCATION CESS
// =====================

const oldHealthEducationCess =
  oldTaxWithSurcharge * 0.04;

const newHealthEducationCess =
  newTaxWithSurcharge * 0.04;

let oldFinalTax =
  oldTaxWithSurcharge +
  oldHealthEducationCess;

let newFinalTax =
  newTaxWithSurcharge +
  newHealthEducationCess;


// =====================
// ROUND OFF U/S 288B
// =====================

oldFinalTax =
  Math.round(oldFinalTax / 10) * 10;

newFinalTax =
  Math.round(newFinalTax / 10) * 10;


// =====================
// AFTER MAT / AMT CREDIT
// =====================

let oldFinalTaxAfterMATAMT =
  oldFinalTax;

let newFinalTaxAfterMATAMT =
  newFinalTax;
// MAT
// =====================

const showMAT =
(
  formData.status === "Private Company" ||
  formData.status === "Public Company"
)
&&
formData.companyOption !== "Section 115BAA"
&&
formData.companyOption !== "Section 115BAB";
let matRate = 0.15;

if (
  formData.isIFSC === "Yes"
) {

  matRate = 0.09;

}

let matTax = 0;
let matSurcharge = 0;
let matCess = 0;
let matFinalTax = 0;

function calculateMATSurcharge(bookProfit, matTax) {

  if (bookProfit > 100000000) {

    return matTax * 0.12;

  }

  if (bookProfit > 10000000) {

    return matTax * 0.07;

  }

  return 0;

}

if (showMAT) {

  const bookProfit =
    Number(formData.bookProfit || 0);

  matTax =
    bookProfit * matRate;

  matSurcharge =
    calculateMATSurcharge(
      bookProfit,
      matTax
    );

  // MAT before Cess
  let matTaxWithSurcharge =
    matTax +
    matSurcharge;

  // MAT Marginal Relief

  if (bookProfit > 10000000) {

    const thresholdTax =
      (10000000 * matRate) +
      calculateMATSurcharge(
        10000000,
        10000000 * matRate
      );

    const maximumTax =
      thresholdTax +
      (bookProfit - 10000000);

    matTaxWithSurcharge =
      Math.min(
        matTaxWithSurcharge,
        maximumTax
      );

  }

  if (bookProfit > 100000000) {

    const thresholdTax =
      (100000000 * matRate) +
      calculateMATSurcharge(
        100000000,
        100000000 * matRate
      );

    const maximumTax =
      thresholdTax +
      (bookProfit - 100000000);

    matTaxWithSurcharge =
      Math.min(
        matTaxWithSurcharge,
        maximumTax
      );

  }

  matCess =
    matTaxWithSurcharge * 0.04;

  matFinalTax =
    matTaxWithSurcharge +
    matCess;

  matFinalTax =
    Math.round(
      matFinalTax / 10
    ) * 10;

}

if (
  showMAT &&
  matFinalTax >
  oldFinalTaxAfterMATAMT
) {

  oldFinalTaxAfterMATAMT =
    matFinalTax;

}

 //Adjusted Total Income > 20 lakh
// =====================
// AMT
// =====================

const showAMT =
(
  formData.status === "Individual" ||
  formData.status === "HUF" ||
  formData.status === "AOP" ||
  formData.status === "BOI" ||
  formData.status === "Artificial Judicial Person" ||
  formData.status === "Firm" ||
  formData.status === "LLP" ||
  formData.status === "Co-operative Society"
)
&&
Number(formData.adjustedTotalIncomeAMT || 0) > 2000000;


let amtRate = 0.185;

if (
  formData.isIFSC === "Yes"
) {

  amtRate = 0.09;

}

let amtTax = 0;
let amtSurcharge = 0;
let amtCess = 0;
let amtFinalTax = 0;

const amtSurchargeRate =
  calculateSurchargeRate(
    Number(formData.adjustedTotalIncomeAMT || 0),
    "Old",
    formData.status,
    formData.companyOption,
    formData.coOperativeOption
  );

if (showAMT) {

  amtTax =
    Number(formData.adjustedTotalIncomeAMT || 0)
    * amtRate;


  let amtTaxWithSurcharge =
  amtTax +
  (amtTax * amtSurchargeRate);

// Apply Marginal Relief
amtTaxWithSurcharge =
  applyPortalMarginalRelief(
    Number(formData.adjustedTotalIncomeAMT || 0),
    amtTaxWithSurcharge,
    oldMMRThresholds,
    "Old",
    amtSurchargeRate,
    amtTax
  );

// Health & Education Cess
amtCess =
  amtTaxWithSurcharge * 0.04;

amtFinalTax =
  amtTaxWithSurcharge +
  amtCess;


  amtFinalTax =
    Math.round(
      amtFinalTax / 10
    ) * 10;

}


if (
  showAMT &&
  amtFinalTax >
  oldFinalTaxAfterMATAMT
) {

  oldFinalTaxAfterMATAMT =
    amtFinalTax;

}
const finalOldTaxPayable = oldFinalTaxAfterMATAMT;
const finalNewTaxPayable = newFinalTaxAfterMATAMT;
const oldAssessedTax = Math.max( 0, finalOldTaxPayable- Number(formData.tds || 0));
const newAssessedTax =Math.max(0,finalNewTaxPayable- Number(formData.tds || 0));
// =====================
// INTEREST U/S 234A
// =====================

const selfAssessmentTaxPaid =
  Number(formData.selfAssessmentTaxPaid || 0);

const oldInterest234AAmount =
  Math.max(
    0,
    oldAssessedTax -
    selfAssessmentTaxPaid
  );

const newInterest234AAmount =
  Math.max(
    0,
    newAssessedTax -
    selfAssessmentTaxPaid
  );

const oldInterest234A =
  oldInterest234AAmount *
  0.01 *
  Number(formData.months234A || 0);

const newInterest234A =
  newInterest234AAmount *
  0.01 *
  Number(formData.months234A || 0);
// =====================
// INTEREST U/S 234B
// =====================

let oldInterest234B = 0;
let newInterest234B = 0;

const advanceTaxPaid =
  Number(formData.advanceTaxPaid || 0);

if (
  advanceTaxPaid <
  oldAssessedTax * 0.90
) {

  const shortfall =
    oldAssessedTax -
    advanceTaxPaid;

  oldInterest234B =
    shortfall *
    0.01 *
    Number(formData.months234B || 0);

}

if (
  advanceTaxPaid <
  newAssessedTax * 0.90
) {

  const shortfall =
    newAssessedTax -
    advanceTaxPaid;

  newInterest234B =
    shortfall *
    0.01 *
    Number(formData.months234B || 0);

}




// =====================
// INTEREST U/S 234C
// =====================

let oldInterest234C = 0;
let newInterest234C = 0;

const oldJuneTax =
  oldAssessedTax * 0.15;

const oldSepTax =
  oldAssessedTax * 0.45;

const oldDecTax =
  oldAssessedTax * 0.75;

const oldMarTax =
  oldAssessedTax;

const newJuneTax =
  newAssessedTax * 0.15;

const newSepTax =
  newAssessedTax * 0.45;

const newDecTax =
  newAssessedTax * 0.75;

const newMarTax =
  newAssessedTax;


// cumulative advance tax paid

const advanceTaxJune =
  Number(formData.advanceTaxJune || 0);

const advanceTaxSeptember =
  advanceTaxJune +
  Number(formData.advanceTaxSeptember || 0);

const advanceTaxDecember =
  advanceTaxSeptember +
  Number(formData.advanceTaxDecember || 0);

const advanceTaxMarch =
  advanceTaxDecember +
  Number(formData.advanceTaxMarch || 0);


const oldJuneShortfall =
  Math.max(0, oldJuneTax - advanceTaxJune);

const oldSepShortfall =
  Math.max(0, oldSepTax - advanceTaxSeptember);

const oldDecShortfall =
  Math.max(0, oldDecTax - advanceTaxDecember);

const oldMarShortfall =
  Math.max(0, oldMarTax - advanceTaxMarch);

const newJuneShortfall =
  Math.max(0, newJuneTax - advanceTaxJune);

const newSepShortfall =
  Math.max(0, newSepTax - advanceTaxSeptember);

const newDecShortfall =
  Math.max(0, newDecTax - advanceTaxDecember);

const newMarShortfall =
  Math.max(0, newMarTax - advanceTaxMarch);

if (!seniorCitizenWithoutBusiness)
  { // June 
   oldInterest234C += 
   Math.max( 
    0,
     oldJuneTax - advanceTaxJune
     ) * 0.01 * 3;
      newInterest234C += 
      Math.max( 0, 
        newJuneTax - advanceTaxJune 
      ) * 0.01 * 3;

  // September

  oldInterest234C +=
    Math.max(
      0,
      oldSepTax - advanceTaxSeptember
    ) * 0.01 * 3;

  newInterest234C +=
    Math.max(
      0,
      newSepTax - advanceTaxSeptember
    ) * 0.01 * 3;


  // December

  oldInterest234C +=
    Math.max(
      0,
      oldDecTax - advanceTaxDecember
    ) * 0.01 * 3;

  newInterest234C +=
    Math.max(
      0,
      newDecTax - advanceTaxDecember
    ) * 0.01 * 3;


  // March

  oldInterest234C +=
    Math.max(
      0,
      oldMarTax - advanceTaxMarch
    ) * 0.01;

  newInterest234C +=
    Math.max(
      0,
      newMarTax - advanceTaxMarch
    ) * 0.01;

}
const oldTotalInterest =oldInterest234A +oldInterest234B +oldInterest234C;
const newTotalInterest =newInterest234A +newInterest234B +newInterest234C;
const oldTotalTaxLiability =finalOldTaxPayable +oldTotalInterest;
const newTotalTaxLiability =finalNewTaxPayable +newTotalInterest;
const totalTaxesPaid = Number(formData.tds || 0)+Number(formData.advanceTaxPaid || 0);
const oldNetTaxPayable =Math.max(0,oldTotalTaxLiability -totalTaxesPaid);
const newNetTaxPayable =Math.max(0,newTotalTaxLiability -totalTaxesPaid);
const oldRefund =Math.max(0,totalTaxesPaid -oldTotalTaxLiability);
const newRefund =Math.max(0,totalTaxesPaid -newTotalTaxLiability);
const roundedOldNetTaxPayable =Math.round(oldNetTaxPayable / 10) * 10;
const roundedNewNetTaxPayable =Math.round(newNetTaxPayable / 10) * 10;
const roundedOldRefund =Math.round(oldRefund / 10) * 10;
const roundedNewRefund =Math.round(newRefund / 10) * 10;
setResult({grossTotalIncomeOld,
          grossTotalIncomeNew,
          oldRegimeTotalIncome:
          oldRegimeRoundedIncome,
          newRegimeTotalIncome:
          newRegimeRoundedIncome,
          oldTax,
          newTax,
          oldSurcharge,
          newSurcharge,
          oldHealthEducationCess,
          newHealthEducationCess,
          finalOldTaxPayable,
          finalNewTaxPayable,
          oldInterest234A,
          newInterest234A,
          oldInterest234B,
          newInterest234B,
          oldInterest234C,
          newInterest234C,
          oldTotalInterest,
          newTotalInterest,
          oldTotalTaxLiability,
          newTotalTaxLiability,
          totalTaxesPaid,
          oldNetTaxPayable:
          roundedOldNetTaxPayable,
          newNetTaxPayable:
          roundedNewNetTaxPayable,
          oldRefund:
          roundedOldRefund,
          newRefund:
          roundedNewRefund,
          age,
          isSeniorCitizen,
          isSuperSeniorCitizen,
          familyPensionDeduction,
          isMATApplicable,
          isAMTApplicable,
          minorExemption,
          oldJuneTax,
oldSepTax,
oldDecTax,
oldMarTax,

newJuneTax,
newSepTax,
newDecTax,
newMarTax,

advanceTaxJune,
advanceTaxSeptember,
advanceTaxDecember,
advanceTaxMarch,

oldJuneShortfall,
oldSepShortfall,
oldDecShortfall,
oldMarShortfall,

newJuneShortfall,
newSepShortfall,
newDecShortfall,
newMarShortfall,

oldJuneInterest,
oldSepInterest,
oldDecInterest,
oldMarInterest,

newJuneInterest,
newSepInterest,
newDecInterest,
newMarInterest,
});

//setTimeout(() => {
  //resultRef.current?.scrollIntoView({
 //   behavior: "smooth"
 // });
//}, 100);

};
   


return (
    <>
    
      <section className="content-section">
        
      <div className="container">
        <div className="business-code-back-wrapper">
          <button
            type="button"
            className="business-code-back-btn"
            onClick={() => navigate(-1)}
          >
            <span>←</span>
            Back
          </button>
        </div>
      {/* Basic Details */}
      <div className="calc-grid">
      <div className="calc-card">
      <h3>Basic Details</h3>
      <div className="input-group">
      <label>Tax Year</label>
      <input type="text"
      name="taxYear"
      value={formData.taxYear}
      onChange={handleChange}/></div>
      <div className="input-group">
      <label>Status</label>
      <select
      name="status"
      value={formData.status}
      onChange={handleChange}>
    <option>Individual</option>
    <option>HUF</option>
    <option>AOP</option>
    <option>AOP Trust</option>
    <option>Firm</option>
    <option>LLP</option>
    <option>Co-operative Society</option>
    <option>Private Company</option>
    <option>Public Company</option>
    <option>BOI</option>
    <option>Local Authority</option>
    <option>Artificial Judicial Person</option>
    </select></div>
      <div className="input-group">
      <label>Residential Status</label>
      <select
      name="residentialStatus"
      value={formData.residentialStatus}
      onChange={handleChange}>
      <option>Resident</option>
      <option>Non-Resident</option>
      </select></div>
      <div className="input-group">
      <label>DOB / DOI</label>
      <input
      type="date"
      name="dob"
      value={formData.dob}
      onChange={handleChange}/></div></div>
      {/* Salary */}
      <div className="calc-card">
      <h3>Salary</h3>
      <div className="input-group">
      <label>Salary After all Exem / Ded except Standard Deduction</label>
      <input
      type="number"
      name="salaryIncome"
      value={formData.salaryIncome || ""}
      onChange={handleChange}/></div>
      <div className="input-group">
      <label>Exem / Ded except Standard Deduction</label>
      <input
      type="number"
      name="salaryDeductionNotAllowed"
      value={formData.salaryDeductionNotAllowed || ""}
      onChange={handleChange}/></div></div>
      {/* House Property */}
      <div className="calc-card">
      <h3>House Property</h3>
            

      <div className="input-group">
      <label>Let Out</label>
      <input
        type="number"
        name="housePropertyLetOut"
        value={formData.housePropertyLetOut || ""}
        onChange={handleChange}/></div>

      <div className="input-group">
      <label>Ded. except u/s 24(a)</label>
      <input
        type="number"
       name="housePropertyDeduction"
        value={formData.housePropertyDeduction || ""}
        onChange={handleChange}/></div>

      <div className="input-group">
      <label>Self Occupied</label>
      <input
        type="number"
         name="housePropertySelfOccupied"
        value={formData.housePropertySelfOccupied || ""}
        onChange={handleChange}/></div></div>

      {/* Business or Profession */}
      <div className="calc-card">
        <h3>Business or Profession</h3>
        <div className="input-group">
        <label>Ordinary (After all allowed Deductions)</label>
        <input
          type="number"
          name="businessOrdinary"
          value={formData.businessOrdinary || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>Deductions (Not allowed as per New Regime)</label>
      <input
        type="number"
        name="businessDeductionNotAllowed"
        value={formData.businessDeductionNotAllowed || ""}
        onChange={handleChange}/></div>

      <div className="input-group">
      <label>Speculative</label>
      <input
        type="number"
        name="businessSpeculative"
        value={formData.businessSpeculative || ""}
        onChange={handleChange}/></div>

      <div className="input-group">
      <label>Presumptive Business</label>
      <input
        type="number"
        name="presumptiveBusiness"
        value={formData.presumptiveBusiness || ""}
        onChange={handleChange}/></div></div>

      {/* Capital Gain */}
      <div className="calc-card">
      <h3>Capital Gain</h3>
      <div className="input-group">
      <label>LTCG 12.5% (u/s 198)</label>
      <input
        type="number"
        name="ltcg125Section198"
        value={formData.ltcg125Section198 || ""}
        onChange={handleChange}/></div>

      <div className="input-group">
      <label>LTCG 10% (Others)</label>
      <input
          type="number"
          name="ltcg10Others"
          value={formData.ltcg10Others || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>LTCG 12.5% (u/s 197)</label>
      <input
          type="number"
          name="ltcg125Section197"
          value={formData.ltcg125Section197 || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>STCG (u/s 196)</label>
      <input
          type="number"
          name="stcgSection196"
          value={formData.stcgSection196 || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>STCG (Others)</label>
      <input
          type="number"
          name="stcgOthers"
          value={formData.stcgOthers || ""}
          onChange={handleChange}/></div></div>

        {/* Other Income */}
        <div className="calc-card">
          <h3>Other Income</h3>
          <div className="input-group">
          <label>Other</label>
          <input
            type="number"
            name="otherIncome"
            value={formData.otherIncome || ""}
            onChange={handleChange}/></div>

        <div className="input-group">
        <label>Casual Income</label>
        <input
            type="number"
            name="casualIncome"
            value={formData.casualIncome || ""}
            onChange={handleChange}/></div>

      <div className="input-group">
      <label>Family Pension</label>
      <input
          type="number"
          name="familyPension"
          value={formData.familyPension || ""}
          onChange={handleChange}/></div>

        <div className="input-group">
        <label>Agricultural Income</label>
        <input
            type="number"
            name="agriculturalIncome"
            value={formData.agriculturalIncome || ""}
            onChange={handleChange}/></div>

        <div className="input-group">
        <label>Clubbing of Income</label>
        <input
            type="number"
            name="clubbingIncome"
            value={formData.clubbingIncome || ""}
            onChange={handleChange}/></div>

        <div className="input-group">
        <label>Nos. of Child</label>
        <input
              type="number"
              name="numberOfChildren"
              value={formData.numberOfChildren || ""}
              onChange={handleChange}/></div>

        <div className="input-group">
        <label>Minor Income</label>
        <input
            type="number"
            name="minorIncome"
            value={formData.minorIncome || ""}
            onChange={handleChange}/></div>
          </div>

      {/* Brought Forward Losses */}
      <div className="calc-card">
      <h3>Brought Forward Losses</h3>
      <div className="input-group">
      <label>House Property</label>
      <input
          type="number"
          name="bfHouseProperty"
          value={formData.bfHouseProperty || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>Business Ordinary</label>
      <input
          type="number"
          name="bfBusinessOrdinary"
          value={formData.bfBusinessOrdinary || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>Business Speculation</label>
      <input
          type="number"
          name="bfBusinessSpeculation"
          value={formData.bfBusinessSpeculation || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>Long-term Capital Gain</label>
      <input
          type="number"
          name="bfLTCG"
          value={formData.bfLTCG || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>Short-term Capital Gain</label>
      <input
          type="number"
          name="bfSTCG"
          value={formData.bfSTCG || ""}
          onChange={handleChange}/></div>

      <div className="input-group">
      <label>Unabsorbed Depreciation</label>
      <input
          type="number"
          name="bfUnabsorbedDepreciation"
          value={formData.bfUnabsorbedDepreciation || ""}
          onChange={handleChange}/></div>
          </div>

      {/* Deductions under Chapter VI-A */}
      <div className="calc-card">
      <h3>Deductions under Chapter VI-A</h3>
      <div className="input-group">
      <label>Deductions under Chapter-VIII</label>
      <input
            type="number"
            name="chapterVIA"
            value={formData.chapterVIA || ""}
            onChange={handleChange}/></div>

      <div className="input-group">
      <label>Deductions under Chapter-VIII (Allowed as per New Regime)</label>
      <input
            type="number"
            name="chapterVIANewRegime"
            value={formData.chapterVIANewRegime || ""}
            onChange={handleChange}/></div>

      <div className="input-group">
      <label>Adjusted Total Income for AMT Calculation</label>
      <input
            type="number"
            name="adjustedTotalIncomeAMT"
            value={formData.adjustedTotalIncomeAMT || ""}
            onChange={handleChange}/></div></div>

      <h3>MAT / AMT & Company Options</h3>
      {
(formData.status === "Private Company" ||
 formData.status === "Public Company") && (
      <div className="input-group">
      <label>Applicable Tax Rate (Company)</label>
      <select
          name="companyOption"
          value={formData.companyOption}
          onChange={handleChange}>
      <option value="NO">No</option>
      <option value="TURNOVER_400">
      Turnover ≤ ₹400 Crore
      </option>
      <option value="115BA">
      Section 115BA
      </option>
      <option value="115BAA">
      Section 115BAA
      </option>
      <option value="115BAB">
      Section 115BAB
      </option>
      </select></div>)}

      {
formData.status === "Co-operative Society" && (


      <div className="input-group">
      <label>Applicable Tax Rate (Co-operative Society)</label>
      <select
          name="coOperativeOption"
          value={formData.coOperativeOption}
          onChange={handleChange}>
      <option value="NO">No</option>
      <option value="115BAD">
      Section 115BAD
      </option>
      <option value="115BAE">
      Section 115BAE
      </option>
      </select></div>)}

    <div className="input-group">
    <label>Book Profit</label>
    <input
          type="number"
          name="bookProfit"
          value={formData.bookProfit || ""}
          onChange={handleChange}/></div> </div></div>
      
<div className="button-group">

  <button
    type="button"
    className="calculate-btn"
    onClick={calculateTax}
  >
    Calculate Tax
  </button>

  <button
    type="button"
    className="reset-btn"
    onClick={handleReset}
  >
    Reset
  </button>

  <button
    type="button"
    className="print-btn"
    onClick={() => window.print()}
  >
    Print Report
  </button>

  <button
  type="button"
  className="pdf-btn"
  onClick={handleDownloadPDF}
  >
  Download PDF
  </button>

</div>
{result && (

<div
className="result-section"
ref={resultRef}>

      <div className="watermark">

      Advance Tax Calculator

    </div>
        <div className="print-header">

      <h1>
        Advance Tax Calculator
      </h1>

      <h3>
        Assessment Year 2026-27
      </h3>

      <p>
        Generated on :
        {new Date().toLocaleString()}
      </p>

      <p>

  Report No :

  ATC-{new Date().getFullYear()}-
  {Math.floor(Math.random() * 100000)}

</p>

    </div>

    <div className="calc-card summary-card">

  <h2>Executive Summary</h2>

<div className="result-row">
  <span>Gross Total Income</span>

  <strong>

    Old Regime :
    ₹ {(result?.grossTotalIncomeOld || 0).toLocaleString()}

    <br />

    New Regime :
    ₹ {(result?.grossTotalIncomeNew || 0).toLocaleString()}

  </strong>

</div>

  <div className="result-row">
    <span>Old Regime Tax Liability</span>
    <strong>
      ₹ {result.oldTotalTaxLiability.toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>New Regime Tax Liability</span>
    <strong>
      ₹ {result.newTotalTaxLiability.toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Tax Saving</span>
    <strong>

      ₹ {

        Math.abs(

          result.oldTotalTaxLiability -

          result.newTotalTaxLiability

        ).toLocaleString()

      }

    </strong>
  </div>

  <div className="result-row">
    <span>Recommended Regime</span>

    <strong>

      {

        result.oldTotalTaxLiability <
        result.newTotalTaxLiability

          ? "Old Regime"

          : result.newTotalTaxLiability <
            result.oldTotalTaxLiability

          ? "New Regime"

          : "Both Regimes are Equal"

      }

    </strong>

  </div>

  <div className="result-row">
    <span>Old Regime Net Tax Payable</span>

    <strong>

      ₹ {result.oldNetTaxPayable.toLocaleString()}

    </strong>

  </div>

  <div className="result-row">
    <span>New Regime Net Tax Payable</span>

    <strong>

      ₹ {result.newNetTaxPayable.toLocaleString()}

    </strong>

  </div>

</div>

    <div className="calc-card">

  <h2>Taxpayer Details</h2>
  <div className="result-row">

  <span>PAN</span>

  <strong>

    XXXXX1234X

  </strong>

</div>

  <div className="result-row">
    <span>Assessment Year</span>
    <strong>
      {formData.taxYear}
    </strong>
  </div>

  <div className="result-row">
    <span>Status</span>
    <strong>
      {formData.status}
    </strong>
  </div>

  <div className="result-row">
    <span>Residential Status</span>
    <strong>
      {formData.residentialStatus}
    </strong>
  </div>

  <div className="result-row">
    <span>Date of Birth</span>
    <strong>
      {formData.dob || "-"}
    </strong>
  </div>

  <div className="result-row">
  <span>Age</span>
  <strong>
    {result.age}
  </strong>
</div>

  <div className="result-row">
    <span>Category</span>
    <strong>

      {
  result.isSuperSeniorCitizen
    ? "Super Senior Citizen"
    : result.isSeniorCitizen
    ? "Senior Citizen"
    : "Non-Senior Citizen"
}

    </strong>
  </div>

</div>
<div className="calc-card">

  <h2>Income Details</h2>

  <div className="result-row">
    <span>Salary Income</span>
    <strong>
      ₹ {Number(formData.salaryIncome || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>House Property Income</span>
    <strong>
      ₹ {
        (
          Number(formData.housePropertySelfOccupied || 0)
          +
          Number(formData.housePropertyLetOut || 0)
        ).toLocaleString()
      }
    </strong>
  </div>

  <div className="result-row">
    <span>Business Income</span>
    <strong>
      ₹ {
        (
          Number(formData.businessOrdinary || 0)
          +
          Number(formData.businessSpeculative || 0)
          +
          Number(formData.presumptiveBusiness || 0)
        ).toLocaleString()
      }
    </strong>
  </div>

  <div className="result-row">
    <span>Capital Gains</span>
    <strong>
      ₹ {
        (
          Number(formData.stcgSection196 || 0)
          +
          Number(formData.stcgOthers || 0)
          +
          Number(formData.ltcg125Section197 || 0)
          +
          Number(formData.ltcg125Section198 || 0)
          +
          Number(formData.ltcg10Others || 0)
        ).toLocaleString()
      }
    </strong>
  </div>

  <div className="result-row">
    <span>Income from Other Sources</span>
    <strong>
      ₹ {
        (
          Number(formData.otherIncome || 0)
          +
          Number(formData.familyPension || 0)
          +
          Number(formData.casualIncome || 0)
        ).toLocaleString()
      }
    </strong>
  </div>

  <div className="result-row">
    <span>Agricultural Income</span>
    <strong>
      ₹ {Number(formData.agriculturalIncome || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Clubbing Income</span>
    <strong>
      ₹ {Number(formData.clubbingIncome || 0).toLocaleString()}
    </strong>
  </div>

</div>

    <div className="calc-card">

      <h2>Income Summary</h2>

<div className="result-row">
  <span>Gross Total Income</span>

  <strong>
    Old Regime :
    ₹ {(result?.grossTotalIncomeOld || 0).toLocaleString()}

    <br />

    New Regime :
    ₹ {(result?.grossTotalIncomeNew || 0).toLocaleString()}
  </strong>

</div>

      <div className="result-row">
        <span>Old Regime Total Income</span>
        <strong>
          ₹ {result.oldRegimeTotalIncome.toLocaleString()}
        </strong>
      </div>

      <div className="result-row">
        <span>New Regime Total Income</span>
        <strong>
          ₹ {result.newRegimeTotalIncome.toLocaleString()}
        </strong>
      </div>

    </div>

  </div>

)}
<div className="calc-card">

  <h2>Tax Payments & Interest Details</h2>

  <div className="result-row">
    <span>TDS/TCS Credit</span>
    <strong>
      ₹ {Number(formData.tds || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Advance Tax Paid</span>
    <strong>
      ₹ {Number(formData.advanceTaxPaid || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234A (Old Regime)</span>
    <strong>
      ₹ {(result?.oldInterest234A || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234B (Old Regime)</span>
    <strong>
      ₹ {(result?.oldInterest234B || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234C (Old Regime)</span>
    <strong>
      ₹ {(result?.oldInterest234C || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Total Interest (Old Regime)</span>
    <strong>
      ₹ {(result?.oldTotalInterest || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234A (New Regime)</span>
    <strong>
      ₹ {(result?.newInterest234A || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234B (New Regime)</span>
    <strong>
      ₹ {(result?.newInterest234B || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234C (New Regime)</span>
    <strong>
      ₹ {(result?.newInterest234C || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Total Interest (New Regime)</span>
    <strong>
      ₹ {(result?.oldTotalInterest || 0).toLocaleString()}
    </strong>
  </div>

</div>





<div className="calc-card">

  <h2>Advance Tax Installment Details</h2>

  <div className="result-row">
    <span>June Installment</span>
    <strong>
      ₹ {Number(formData.advanceTaxJune || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>September Installment</span>
    <strong>
      ₹ {Number(formData.advanceTaxSeptember || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>December Installment</span>
    <strong>
      ₹ {Number(formData.advanceTaxDecember || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>March Installment</span>
    <strong>
      ₹ {Number(formData.advanceTaxMarch || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Total Advance Tax Paid</span>
    <strong>
      ₹ {
        (
          Number(formData.advanceTaxJune || 0)
          +
          Number(formData.advanceTaxSeptember || 0)
          +
          Number(formData.advanceTaxDecember || 0)
          +
          Number(formData.advanceTaxMarch || 0)
        ).toLocaleString()
      }
    </strong>
  </div>

</div>



<div className="calc-card">

  <h2>Old Regime Tax Computation</h2>

  <div className="result-row">
    <span>Basic Tax</span>
    <strong>
      ₹ {(result?.oldTax || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Surcharge</span>
    <strong>
      ₹ {(result?.oldSurcharge || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Health & Education Cess</span>
    <strong>
      ₹ {(result?.oldHealthEducationCess || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Final Tax Payable</span>
    <strong>
      ₹ {(result?.finalOldTaxPayable || 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234A</span>
    <strong>
      ₹ {(result?.oldInterest234A ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234B</span>
    <strong>
      ₹ {(result?.oldInterest234B ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234C</span>
    <strong>
      ₹ {(result?.oldInterest234C ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Total Interest</span>
    <strong>
      ₹ {(result?.oldTotalInterest ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Total Tax Liability</span>
    <strong>
      ₹ {(result?.oldTotalTaxLiability ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Net Tax Payable</span>
    <strong>
      ₹ {(result?.oldNetTaxPayable|| 0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Refund</span>
    <strong>
      ₹ {(result?.oldRefund ||0) .toLocaleString()}
    </strong>
  </div>

</div>
<div className="calc-card">

  <h2>New Regime Tax Computation</h2>

  <div className="result-row">
    <span>Basic Tax</span>
    <strong>
      ₹ {(result?.newTax ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Surcharge</span>
    <strong>
      ₹ {(result?.newSurcharge ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Health & Education Cess</span>
    <strong>
      ₹ {(result?.newHealthEducationCess ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Final Tax Payable</span>
    <strong>
      ₹ {(result?.finalNewTaxPayable ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234A</span>
    <strong>
      ₹ {(result?.newInterest234A ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234B</span>
    <strong>
      ₹ {(result?.newInterest234B ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Interest u/s 234C</span>
    <strong>
      ₹ {(result?.newInterest234C ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Total Interest</span>
    <strong>
      ₹ {(result?.newTotalInterest ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Total Tax Liability</span>
    <strong>
      ₹ {(result?.newTotalTaxLiability ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Net Tax Payable</span>
    <strong>
      ₹ {(result?.newNetTaxPayable ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Refund</span>
    <strong>
      ₹ {(result?.newRefund ||0).toLocaleString()}
    </strong>
  </div>

</div>
<div className="calc-card">

  <h2>Regime Comparison</h2>

  <div className="result-row">
    <span>Old Regime Total Liability</span>
    <strong>
      ₹ {(result?.oldTotalTaxLiability ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>New Regime Total Liability</span>
    <strong>
      ₹ {(result?.newTotalTaxLiability  ||0).toLocaleString()}
    </strong>
  </div>

  <div className="result-row">
    <span>Tax Saving</span>
    <strong>
      ₹ {
  Math.abs(
    (result?.oldTotalTaxLiability || 0) -
    (result?.newTotalTaxLiability || 0)
  ).toLocaleString()
}
    </strong>
  </div>

  <div className="result-row">
    <span>Recommended Regime</span>

    <strong>
      {
  result
    ? (
        result.oldTotalTaxLiability <
        result.newTotalTaxLiability
          ? "Old Regime"
          : result.newTotalTaxLiability <
            result.oldTotalTaxLiability
          ? "New Regime"
          : "Both Regimes are Equal"
      )
    : "-"
}
    </strong>

  </div>

</div>
<div className="calc-card recommendation-card">

  <h2>
    Recommended Regime
  </h2>

  <h1>

    {
  result
    ? (
        result.oldTotalTaxLiability <
        result.newTotalTaxLiability
          ? "Old Regime"
          : result.newTotalTaxLiability <
            result.oldTotalTaxLiability
          ? "New Regime"
          : "Both Regimes are Equal"
      )
    : ""
}

  </h1>

</div>

<div className="calc-card">

  <h2>Disclaimer</h2>

  <p>

    This report is generated based on the
    information provided by the taxpayer.
    Please verify all figures before filing
    the Income Tax Return. This report is
    intended for informational purposes only
    and should not be considered as legal or
    professional advice.

  </p>

</div>
<div className="print-footer">

Generated by Advance Tax Calculator

<br />

Assessment Year :

{formData.taxYear}

<br />

Generated on :

{new Date().toLocaleString()}

</div>

{result && (

<div id="print-section" className="pdf-section">

  {/* Header */}
  <div className="pdf-header">

    <h1>Advance Tax Calculator</h1>

    <h2>Assessment Year : {formData.taxYear}</h2>

    <p>
      Generated on : {new Date().toLocaleString()}
    </p>

    <p>
      Report No : ATC-XXXXXXXX
    </p>

  </div>


  {/* Basic Details */}
  <h3>Basic Details</h3>

  <table className="pdf-table">
    <tbody>

      <tr>
        <td>Status</td>
        <td>{formData.status}</td>
      </tr>

      <tr>
        <td>Residential Status</td>
        <td>{formData.residentialStatus}</td>
      </tr>

      <tr>
        <td>Age</td>
        <td>{result?.age}</td>
      </tr>

      <tr>
        <td>Senior Citizen</td>
        <td>
          {result?.isSeniorCitizen ? "Yes" : "No"}
        </td>
      </tr>

      <tr>
        <td>Super Senior Citizen</td>
        <td>
          {result?.isSuperSeniorCitizen ? "Yes" : "No"}
        </td>
      </tr>

    </tbody>
  </table>


  {/* Income Details */}
  <h3>Income Details</h3>

<table className="pdf-table">

  <thead>

    <tr>

      <th>Particular</th>
      <th>Amount</th>

      <th>Particular</th>
      <th>Amount</th>

    </tr>

  </thead>

  <tbody>

    <tr>

      <td>Salary Income</td>
      <td>{(Number(formData.salaryIncome) || 0).toLocaleString()}</td>
      

      <td>Other Income</td>
       <td>
     {(Number(formData.otherIncome) || 0).toLocaleString()}
  </td>
     

    </tr>

    <tr>

      <td>Salary Exemption / Deduction</td>
      <td>
     {(Number(formData.salaryDeductionNotAllowed) || 0).toLocaleString()}
  </td>
      

      <td>Casual Income</td>
       <td>
     {(Number(formData.casualIncome) || 0).toLocaleString()}
  </td>
      

    </tr>

    <tr>

      <td>Let Out House Property</td>
  
      <td>{(Number(formData.letOutHouseProperty) || 0).toLocaleString()}</td>

      <td>Family Pension</td>
   
      <td> {(Number(formData.familyPension) || 0).toLocaleString()}</td>

    </tr>

    <tr>

      <td>Self Occupied House Property</td>
      
      <td>{(Number(formData.selfOccupiedHouseProperty) || 0).toLocaleString()}</td>

      <td>Agricultural Income</td>
      
      <td>{(Number(formData.agriculturalIncome) || 0).toLocaleString()}</td>

    </tr>

    <tr>

      <td>Ordinary Business Income</td>
     
      <td>{(result.businessIncomeOld || 0).toLocaleString()}</td>
      
      <td>{(result.businessIncomeNew || 0).toLocaleString()}</td>

      <td>Minor Income</td>
     
      <td> {(Number(formData.minorIncome) || 0).toLocaleString()}</td>

    </tr>

    <tr>

      <td>Speculation Business Income</td>
      
      <td>{(Number(formData.businessSpeculation) || 0).toLocaleString()}</td>

      <td>Clubbing Income</td>
      
      <td>{(Number(formData.clubbingIncome) || 0).toLocaleString()}</td>

    </tr>

    <tr>

      <td>STCG u/s 196</td>
     
      <td> {(Number(formData.stcg196) || 0).toLocaleString()}</td>

      <td>LTCG u/s 198</td>
     
      <td>{(Number(formData.ltcg198) || 0).toLocaleString()}</td>

    </tr>

    <tr>

      <td>STCG Others</td>
      
      <td>{(Number(formData.stcgOthers) || 0).toLocaleString()}</td>

      <td>LTCG u/s 197</td>
      
      <td>{(Number(formData.ltcg197) || 0).toLocaleString()}</td>

    </tr>

    <tr>

      <td>LTCG Others</td>
      
      <td>{(Number(formData.ltcgOthers) || 0).toLocaleString()}</td>

      <td>Dividend Income</td>
     
      <td> {(Number(formData.dividendIncome) || 0).toLocaleString()}</td>

    </tr>

  </tbody>

</table>


  {/* Brought Forward Losses */}
  <h3>Brought Forward Losses</h3>

  <table className="pdf-table">
    <tbody>

      <tr>
        <td>House Property</td>
        <td>{(Number(formData.bfHouseProperty) || 0).toLocaleString()}</td>
      </tr>

      <tr>
        <td>Business Ordinary</td>
        <td>{(Number(formData.bfBusinessOrdinary) || 0).toLocaleString()}</td>
      </tr>

      <tr>
        <td>Business Speculation</td>
        <td> {(Number(formData.bfBusinessSpeculation) || 0).toLocaleString()}</td>
      </tr>

      <tr>
        <td>Long-Term Capital Gain</td>
        <td>{(Number(formData.bfLTCG) || 0).toLocaleString()}</td>
      </tr>

      <tr>
        <td>Short-Term Capital Gain</td>
        <td> {(Number(formData.bfSTCG) || 0).toLocaleString()}</td>
      </tr>

      <tr>
        <td>Unabsorbed Depreciation</td>
        <td>{(Number(formData.bfUnabsorbedDepreciation) || 0).toLocaleString()}</td>
      </tr>

    </tbody>
  </table>


  {/* Tax Comparison */}
  <h3>Tax Comparison</h3>

  <table className="pdf-table">

    <thead>

      <tr>
        <th>Particulars</th>
        <th>Old Regime</th>
        <th>New Regime</th>
      </tr>

    </thead>

    <tbody>

      <tr>
  <td>Total Income</td>

  <td>
    ₹ {(result?.oldRegimeTotalIncome || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newRegimeTotalIncome || 0).toLocaleString()}
  </td>
</tr>

      <tr>
  <td>Tax Before Rebate</td>

  <td>
    ₹ {(result?.oldTax || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newTax || 0).toLocaleString()}
  </td>
</tr>

      <tr>
  <td>Rebate u/s 87A(156)</td>

  <td>₹ 0</td>

  <td>₹ 0</td>
</tr>

      <tr>
  <td>Tax After Rebate</td>

  <td>
    ₹ {(result?.oldTax || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newTax || 0).toLocaleString()}
  </td>
</tr>

      <tr>
  <td>Surcharge</td>

  <td>
    ₹ {(result?.oldSurcharge || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newSurcharge || 0).toLocaleString()}
  </td>
</tr>
      <tr>
  <td>HEC</td>

  <td>
    ₹ {(result?.oldHealthEducationCess || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newHealthEducationCess || 0).toLocaleString()}
  </td>
</tr>

     <tr>
  <td>Total Tax Liability</td>

  <td>
    ₹ {(result?.oldTotalTaxLiability || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newTotalTaxLiability || 0).toLocaleString()}
  </td>
</tr>

      <tr>
  <td>Net Tax Payable</td>

  <td>
    ₹ {(result?.oldNetTaxPayable || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newNetTaxPayable || 0).toLocaleString()}
  </td>
</tr>

      <tr>
  <td>Refund</td>

  <td>
    ₹ {(result?.oldRefund || 0).toLocaleString()}
  </td>

  <td>
    ₹ {(result?.newRefund || 0).toLocaleString()}
  </td>
</tr>

    </tbody>

  </table>


  {/* Recommendation */}
  <h3>Recommendation</h3>

  <table className="pdf-table">
    <tbody>

      <tr>
  <td>Recommended Regime</td>
  <td>
    {
      result?.oldTotalTaxLiability <
      result?.newTotalTaxLiability
        ? "Old Regime"
        : "New Regime"
    }
  </td>
</tr>

<tr>
  <td>Tax Saving</td>
  <td>
    ₹ {
      Math.abs(
        (result?.oldTotalTaxLiability || 0) -
        (result?.newTotalTaxLiability || 0)
      ).toLocaleString()
    }
  </td>
</tr>

    </tbody>
  </table>


  {/* Advance Tax Installment */}
  <h3>Advance Tax Installment Schedule</h3>

<table className="pdf-table">

<thead>
<tr>
<th>Due Date</th>
<th>Old Required</th>
<th>New Required</th>
<th>Paid</th>
<th>Old Shortfall</th>
<th>New Shortfall</th>
<th>Old Interest</th>
<th>New Interest</th>
</tr>
</thead>

<tbody>

<tr>
<td>15 June</td>

<td>₹ {(result?.oldJuneTax || 0).toLocaleString()}</td>
<td>₹ {(result?.newJuneTax || 0).toLocaleString()}</td>

<td>₹ {(result?.advanceTaxJune || 0).toLocaleString()}</td>

<td>₹ {(result?.oldJuneShortfall || 0).toLocaleString()}</td>
<td>₹ {(result?.newJuneShortfall || 0).toLocaleString()}</td>

<td>₹ {(result?.oldJuneInterest || 0).toLocaleString()}</td>
<td>₹ {(result?.newJuneInterest || 0).toLocaleString()}</td>
</tr>

<tr>
<td>15 September</td>

<td>₹ {(result?.oldSepTax || 0).toLocaleString()}</td>
<td>₹ {(result?.newSepTax || 0).toLocaleString()}</td>

<td>₹ {(result?.advanceTaxSeptember || 0).toLocaleString()}</td>

<td>₹ {(result?.oldSepShortfall || 0).toLocaleString()}</td>
<td>₹ {(result?.newSepShortfall || 0).toLocaleString()}</td>

<td>₹ {(result?.oldSepInterest || 0).toLocaleString()}</td>
<td>₹ {(result?.newSepInterest || 0).toLocaleString()}</td>
</tr>

<tr>
<td>15 December</td>

<td>₹ {(result?.oldDecTax || 0).toLocaleString()}</td>
<td>₹ {(result?.newDecTax || 0).toLocaleString()}</td>

<td>₹ {(result?.advanceTaxDecember || 0).toLocaleString()}</td>

<td>₹ {(result?.oldDecShortfall || 0).toLocaleString()}</td>
<td>₹ {(result?.newDecShortfall || 0).toLocaleString()}</td>

<td>₹ {(result?.oldDecInterest || 0).toLocaleString()}</td>
<td>₹ {(result?.newDecInterest || 0).toLocaleString()}</td>
</tr>

<tr>
<td>15 March</td>

<td>₹ {(result?.oldMarTax || 0).toLocaleString()}</td>
<td>₹ {(result?.newMarTax || 0).toLocaleString()}</td>

<td>₹ {(result?.advanceTaxMarch || 0).toLocaleString()}</td>

<td>₹ {(result?.oldMarShortfall || 0).toLocaleString()}</td>
<td>₹ {(result?.newMarShortfall || 0).toLocaleString()}</td>

<td>₹ {(result?.oldMarInterest || 0).toLocaleString()}</td>
<td>₹ {(result?.newMarInterest || 0).toLocaleString()}</td>
</tr>

</tbody>

</table>


 


</div>

)}


</section>
  <style>{`
.calc-card{
  background:#fff;
  border-radius:14px;
  padding:18px;
  margin-bottom:15px;
  box-shadow:0 4px 12px rgba(0,0,0,0.08);
}

.calc-card h2,
.calc-card h3{
  color:#0d4ea6;
  margin-bottom:15px;
  padding-bottom:8px;
  border-bottom:2px solid #ececec;
}
  .form-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:15px;
}

  .input-group{
  margin-bottom:8px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.input-group input,
.input-group select{
  width:100%;
  padding:11px 12px;
  border:1px solid #d6dce7;
  border-radius:10px;
  font-size:15px;
}

  .button-group{
  display:flex;
  gap:15px;
  margin-top:25px;
  flex-wrap:wrap;
}

.calculate-btn,
.reset-btn,
.print-btn{
  padding:12px 24px;
  border:none;
  border-radius:8px;
  font-size:16px;
  font-weight:600;
  cursor:pointer;
}

.calculate-btn{
  background:#0d6efd;
  color:white;
}

.reset-btn{
  background:#dc3545;
  color:white;
}

.print-btn{
  background:#198754;
  color:white;
}
  .result-section{
  margin-top:30px;
}

.result-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:8px 0;
  border-bottom:1px solid #e8e8e8;
}

.result-row span{
  font-weight:500;
}

.result-row strong{
  color:#0d4ea6;
}
  .recommendation-card{
  text-align:center;
}

.recommendation-card h1{
  color:#198754;
  margin-top:20px;
  font-size:36px;
}
  .print-header{
  text-align:center;
  margin-bottom:30px;
}

.print-header h1{
  color:#0d4ea6;
  margin-bottom:10px;
}

.print-header h3{
  margin-bottom:10px;
}
  .print-footer{
  text-align:center;
  margin-top:40px;
  color:#666;
}
  @media print {

  body{
    background:white;
  }

  .button-group{
    display:none;
  }

  form{
    display:none;
  }

  .input-group{
    display:none;
  }

  h1{
    color:black;
  }

  .calc-card{
    page-break-inside:avoid;
  }

}
  .summary-card{

  border:2px solid #198754;

}

.summary-card h2{

  color:#198754;

}
  .calc-card{
  background:#fff;
  border-radius:12px;
  padding:25px;
  margin-bottom:25px;
  box-shadow:
    0 4px 15px rgba(0,0,0,0.08);
}
    .calc-card h2{
  color:#0d4ea6;
  margin-bottom:20px;
  padding-bottom:10px;
  border-bottom:2px solid #e8e8e8;
}
  .result-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px 0;
  border-bottom:1px solid #ececec;
}
  .result-row span{
  color:#555;
  font-weight:500;
}
  .result-row strong{
  color:#0d4ea6;
  font-weight:700;
}
  .recommendation-card{
  text-align:center;
  border:2px solid #198754;
}
  .recommendation-card h1{
  color:#198754;
  font-size:40px;
  margin-top:20px;
}
  .print-header{
  text-align:center;
  margin-bottom:40px;
}
  .print-header h1{
  color:#0d4ea6;
  font-size:38px;
}
  .print-header h3{
  margin-top:10px;
}
  .print-footer{
  margin-top:50px;
  text-align:center;
  color:#777;
}
  @media(max-width:768px){

.form-grid{
  grid-template-columns:1fr;
}

.result-row{
  flex-direction:column;
  align-items:flex-start;
  gap:6px;
}

.button-group{
  flex-direction:column;
}

.button-group button,
.pdf-btn{
  width:100%;
}

}
@media print{

body{
  background:white;
}

.button-group{
  display:none;
}

.calc-card{
  page-break-inside:avoid;
  box-shadow:none;
  border:1px solid #ddd;
}

}
.pdf-btn{

  background:#198754;

  color:white;

  border:none;

  padding:12px 20px;

  border-radius:8px;

  cursor:pointer;

}
  .watermark{

position:fixed;

top:50%;

left:50%;

transform:
translate(-50%,-50%)
rotate(-30deg);

font-size:70px;

color:
rgba(0,0,0,0.05);

pointer-events:none;

z-index:0;

}
.calc-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:15px;
}

@media(max-width:768px){

  .calc-grid{
    grid-template-columns:1fr;
  }

}
.pdf-section{
  position:absolute;
  left:-99999px;
  top:0;
  background:white;
  width:800px;
  padding:20px;
}
.pdf-header{
text-align:center;
margin-bottom:30px;
}

.pdf-header h1{
color:#0d4ea6;
font-size:30px;
margin-bottom:10px;
}

.pdf-header h2{
font-size:22px;
margin-bottom:10px;
}

.pdf-section h3{
color:#0d4ea6;
margin-top:30px;
margin-bottom:15px;
border-bottom:2px solid #ddd;
padding-bottom:8px;
}

.pdf-table{
width:100%;
border-collapse:collapse;
margin-bottom:25px;
font-size:14px;
}

.pdf-table th{
background:#0d4ea6;
color:white;
padding:10px;
border:1px solid #ccc;
}

.pdf-table td{
padding:8px 10px;
border:1px solid #ccc;
}

.pdf-table tr:nth-child(even){
background:#f8f8f8;
}

      `}</style>
    </>
  );
}