import React, { useState, useMemo } from "react";
import InfoCard from "../components/InfoCard";
import { useNavigate } from "react-router-dom";
export default function Section54Calculator() {
  const navigate = useNavigate();
  const initial54 = {
  assessmentYear: "",
  capitalGain: "",
  investment: "",
  cgasDeposit: "",
};

const initial54B = {
  assessmentYear: "",
  capitalGain: "",
  investment: "",
  cgasDeposit: "",
};

const initial54D = { 
  assessmentYear: "",
  capitalGainType: "",
  capitalGain: "",
  investment: "",
  cgasDeposit: "",
};

const initial54EC = {
  assessmentYear: "",
  capitalGain: "",
  investment: "",
};

const initial54EE = {
  assessmentYear: "",
  capitalGain: "",
  investment: "",
};

const initial54F = {
  assessmentYear: "",
  capitalGain: "",
  netConsideration: "",
  investment: "",
  cgas: "",
};

const initial54G = {
  assessmentYear: "",
  capitalGain: "",
  investmentCost: "",
  cgas: "",
};

const initial54GA = {
  assessmentYear: "",
  capitalGain: "",
  investmentCost: "",
  cgas: "",
};

const [sec54, setSec54] = useState(initial54);
const [sec54B, setSec54B] = useState(initial54B);
const [sec54D, setSec54D] = useState(initial54D);
const [sec54EC, setSec54EC] = useState(initial54EC);
const [sec54EE, setSec54EE] = useState(initial54EE);
const [sec54F, setSec54F] = useState(initial54F);
const [sec54G, setSec54G] = useState(initial54G);
const [sec54GA, setSec54GA] = useState(initial54GA);

const update54 = (k, v) => setSec54((p) => ({ ...p, [k]: v }));
const update54B = (k, v) => setSec54B((p) => ({ ...p, [k]: v }));
const update54D = (k, v) => setSec54D((p) => ({ ...p, [k]: v }));
const update54EC = (k, v) => setSec54EC((p) => ({ ...p, [k]: v }));
const update54EE = (k, v) => setSec54EE((p) => ({ ...p, [k]: v }));
const update54F = (k, v) => setSec54F((p) => ({ ...p, [k]: v }));
const update54G = (k, v) => setSec54G((p) => ({ ...p, [k]: v }));
const update54GA = (k, v) => setSec54GA((p) => ({ ...p, [k]: v }));



 const handleReset = () => {
  if (activeTab === "54") setSec54(initial54);
  if (activeTab === "54B") setSec54B(initial54B);
  if (activeTab === "54D") setSec54D(initial54D);
  if (activeTab === "54EC") setSec54EC(initial54EC);
  if (activeTab === "54EE") setSec54EE(initial54EE);
  if (activeTab === "54F") setSec54F(initial54F);
  if (activeTab === "54G") setSec54G(initial54G);
  if (activeTab === "54GA") setSec54GA(initial54GA);
};

const [activeTab, setActiveTab] = useState("54");

  const assessmentYears = [
    "2017-18","2018-19","2019-20","2020-21","2021-22",
    "2022-23","2023-24","2024-25","2025-26","2026-27",
  ];

 
const result = useMemo(() => {
const capitalGain = Number(sec54.capitalGain || 0);
const investment = Number(sec54.investment || 0);
const cgas = Number(sec54.cgasDeposit || 0);
const totalInvestment = investment + cgas;
// 🔥 Extract starting year from AY (e.g., "2024-25" → 2024)
const ayStart = Number(sec54.assessmentYear?.split("-")[0] || 0);
let exemption;
if (ayStart >= 2024) {
    // ✅ Apply ₹10 Cr cap
    const cap = 100000000; // 10 Crore
    exemption = Math.min(capitalGain, totalInvestment, cap);
  } else {
    // ✅ No cap for earlier years
    exemption = Math.min(capitalGain, totalInvestment);
  }
const taxable = Math.max(capitalGain - exemption, 0);
return { exemption, taxable };},
[sec54]);

const result54B = useMemo(() => {
const capitalGain = Number(sec54B.capitalGain || 0);
const investment = Number(sec54B.investment || 0);
const cgas = Number(sec54B.cgasDeposit || 0);
const totalInvestment = investment + cgas;
const exemption = Math.min(capitalGain, totalInvestment);
const taxable = Math.max(capitalGain - exemption, 0);
return { exemption, taxable };}, 
[sec54B]);

const result54D = useMemo(() => {
const capitalGain = Number(sec54D.capitalGain || 0);
const investment = Number(sec54D.investment || 0);
const cgas = Number(sec54D.cgasDeposit || 0);
const totalInvestment = investment + cgas;
const exemption = Math.min(capitalGain, totalInvestment);
const taxable = Math.max(capitalGain - exemption, 0);
const warning =totalInvestment > capitalGain && capitalGain > 0;
return { exemption,taxable,warning,};}, 
[sec54D]);

const num = (val) => Number(val) || 0;
const calculation = useMemo(() => {
const capitalGain = num(sec54EC.capitalGain);
const investment = num(sec54EC.investment);
const MAX_LIMIT = 5000000;
const eligibleInvestment = Math.min(investment, MAX_LIMIT);
const exemption = Math.min(capitalGain, eligibleInvestment);
const taxable = capitalGain - exemption;
return { eligibleInvestment,exemption,taxable};},
[sec54EC]);

const result54EE = useMemo(() => {
const capitalGain = num(sec54EE.capitalGain);
const investment = num(sec54EE.investment);
const MAX_LIMIT = 5000000;
const eligibleInvestment = Math.min(investment, MAX_LIMIT);
const exemption = Math.min(capitalGain, eligibleInvestment, MAX_LIMIT);
const taxable = capitalGain - exemption;
return { eligibleInvestment,exemption,taxable};},
[sec54EE]);

const result54F = useMemo(() => {
const ay = sec54F.assessmentYear;
const capitalGain = num(sec54F.capitalGain);
const netConsideration = num(sec54F.netConsideration);
const investment = num(sec54F.investment);
const cgas = num(sec54F.cgas);
let totalInvestment = investment + cgas;
let exemption = 0;
let warnings = [];
const ayNumber = parseInt(ay?.split("-")[0]) || 0;
    // AY CAP LOGIC (₹10 crore cap)
const MAX_LIMIT = 100000000; // 10 crore


   if (ayNumber >= 2024) {
    if (totalInvestment > MAX_LIMIT) {
      totalInvestment = MAX_LIMIT;
      warnings.push("Exemption capped at ₹10 Crore (AY 2024-25 onwards)");
    }
  }

    if (capitalGain > 0 && netConsideration > 0 && totalInvestment > 0) {
    exemption = (capitalGain * totalInvestment + cgas) / netConsideration;
  }

  // final cap
  exemption = Math.min(exemption, capitalGain);
  exemption = Math.round(exemption);
  const taxable = Math.round(capitalGain - exemption);

    // Warnings
   if (netConsideration > 0 && totalInvestment < netConsideration) {
    warnings.push("Proportionate exemption applied");
  }

  if (totalInvestment <= 0) {
    warnings.push("No exemption (no investment / CGAS)");
  }

  if (netConsideration <= 0) {
    warnings.push("Invalid Net Consideration");
  }
    return { exemption,taxable,warnings,};},
[sec54F]);

  const result54G= useMemo(() => {
  const capitalGain = num(sec54G.capitalGain);
  const investmentCost = num(sec54G.investmentCost);
  const cgas = num(sec54G.cgas);
  const totalEligibleAmount = investmentCost + cgas;
  const exemption = Math.min(capitalGain, totalEligibleAmount);
  const taxable = capitalGain - exemption;
  return { exemption, taxable,};}, 
  [sec54G]);

  const result54GA= useMemo(() => {
  const capitalGain = num(sec54GA.capitalGain);
  const investmentCost = num(sec54GA.investmentCost);
  const cgas = num(sec54GA.cgas);
  const totalEligibleAmount = investmentCost + cgas;
  const exemption = Math.min(capitalGain, totalEligibleAmount);
  const taxable = capitalGain - exemption;
  return { exemption, taxable,};}, 
  [sec54GA]);



return (
  <div className="cg-modern-page">
    <div className="cg-modern-container">
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
      {/* HEADER */}
      <div className="cg-modern-header">
        <div>
          <p className="cg-modern-kicker">Capital Gain Exemption Utility</p>
          <h1>Section 54 Exemption Calculator</h1>
          <p>
            Calculate exemption and taxable capital gain under Sections 54, 54B, 54D, 54EC, 54EE, 54F, 54G and 54GA.
          </p>
        </div>

        <div className="cg-modern-badge">
          <span>Active Section</span>
          <strong>Section {activeTab}</strong>
        </div>
      </div>

      <div className="cg-modern-grid">

        {/* LEFT FORM */}
        <div className="cg-modern-card">

          {/* TABS */}
          <div className="cg-tab-wrap">
            {["54","54B","54D","54EC","54EE","54F","54G","54GA"].map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveTab(sec)}
                className={activeTab === sec ? "cg-tab active" : "cg-tab"}
              >
                Section {sec}
              </button>
            ))}
          </div>

          {/* ================= SECTION 54 ================= */}
          {activeTab === "54" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54 Calculator</h2>
                <p>Exemption for investment in residential house property</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54.assessmentYear}
                    onChange={(e) => update54("assessmentYear", e.target.value)}
                  >
                    <option value="">Select Assessment Year</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming exemption <span>*</span></label>
                  <input value="Individual / HUF" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for exemption <span>*</span></label>
                  <input value="Residential House Property" disabled />
                </div>

                <div className="cg-field">
                  <label>Amount of Capital Gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54.capitalGain}
                    onChange={(e) => update54("capitalGain", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of Investment / Cost / Expenditure incurred</label>
                  <input
                    type="number"
                    value={sec54.investment}
                    onChange={(e) => update54("investment", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field full">
                  <label>Amount deposited in Capital Gain Account Scheme</label>
                  <input
                    type="number"
                    value={sec54.cgasDeposit}
                    onChange={(e) => update54("cgasDeposit", e.target.value)}
                    placeholder="Enter CGAS deposit"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= SECTION 54B ================= */}
          {activeTab === "54B" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54B Calculator</h2>
                <p>Exemption for investment in agricultural land</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54B.assessmentYear}
                    onChange={(e) => update54B("assessmentYear", e.target.value)}
                  >
                    <option value="">Select Assessment Year</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming the exemption <span>*</span></label>
                  <input value="Individual / HUF" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term / Short Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for exemption <span>*</span></label>
                  <input value="Agricultural Land" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for investment <span>*</span></label>
                  <input value="Agricultural Land" disabled />
                </div>

                <div className="cg-field">
                  <label>Amount of capital gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54B.capitalGain}
                    onChange={(e) => update54B("capitalGain", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of investment / cost / expenditure</label>
                  <input
                    type="number"
                    value={sec54B.investment}
                    onChange={(e) => update54B("investment", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field full">
                  <label>Amount deposited in Capital Gains Account Scheme</label>
                  <input
                    type="number"
                    value={sec54B.cgasDeposit}
                    onChange={(e) => update54B("cgasDeposit", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= SECTION 54D ================= */}
          {activeTab === "54D" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54D Calculator</h2>
                <p>Exemption on compulsory acquisition of industrial land/building</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54D.assessmentYear}
                    onChange={(e) => update54D("assessmentYear", e.target.value)}
                  >
                    <option value="">Select</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming the exemption <span>*</span></label>
                  <input value="Any person" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term / Short Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for exemption <span>*</span></label>
                  <input
                    value="Compulsory acquistion land or building used for industrial purpose"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for investment <span>*</span></label>
                  <input
                    value="Land or building used for new establishment of undertaking"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of capital gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54D.capitalGain}
                    onChange={(e) => update54D("capitalGain", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of investment / cost / expenditure</label>
                  <input
                    type="number"
                    value={sec54D.investment}
                    onChange={(e) => update54D("investment", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount deposited in Capital Gains Account Scheme</label>
                  <input
                    type="number"
                    value={sec54D.cgasDeposit}
                    onChange={(e) => update54D("cgasDeposit", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {result54D.warning && (
                <div className="cg-warning-box">
                  ⚠ Investment + CGAS cannot exceed Capital Gain
                </div>
              )}
            </>
          )}

          {/* ================= SECTION 54EC ================= */}
          {activeTab === "54EC" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54EC Calculator</h2>
                <p>Exemption for investment in specified bonds</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54EC.assessmentYear}
                    onChange={(e) => update54EC("assessmentYear", e.target.value)}
                  >
                    <option value="">Select Assessment Year</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming exemption <span>*</span></label>
                  <input value="Any person" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for exemption <span>*</span></label>
                  <input value="Land and building" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for investment <span>*</span></label>
                  <input
                    value="NHAI bond / REC bond / Any other notified bonds"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of Capital Gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54EC.capitalGain}
                    onChange={(e) => update54EC("capitalGain", e.target.value)}
                    placeholder="Enter capital gain amount"
                  />
                </div>

                <div className="cg-field full">
                  <label>Amount of Investment / Cost / Expenditure incurred</label>
                  <input
                    type="number"
                    value={sec54EC.investment}
                    onChange={(e) => update54EC("investment", e.target.value)}
                    placeholder="Enter investment amount"
                  />
                </div>
              </div>

              {num(sec54EC.investment) > 5000000 && (
                <div className="cg-warning-box">
                  ⚠ Maximum eligible investment under 54EC is ₹50,00,000 per FY.
                </div>
              )}
            </>
          )}

          {/* ================= SECTION 54EE ================= */}
          {activeTab === "54EE" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54EE Calculator</h2>
                <p>Exemption for investment in specified assets</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54EE.assessmentYear}
                    onChange={(e) => update54EE("assessmentYear", e.target.value)}
                  >
                    <option value="">Select Assessment Year</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming exemption <span>*</span></label>
                  <input value="Any person" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital assets eligible for exemption <span>*</span></label>
                  <input value="Long term capital assets" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for investment <span>*</span></label>
                  <input value="Specified assets" disabled />
                </div>

                <div className="cg-field">
                  <label>Amount of Capital Gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54EE.capitalGain}
                    onChange={(e) => update54EE("capitalGain", e.target.value)}
                    placeholder="Enter capital gain amount"
                  />
                </div>

                <div className="cg-field full">
                  <label>Amount of Investment / Cost / Expenditure incurred</label>
                  <input
                    type="number"
                    value={sec54EE.investment}
                    onChange={(e) => update54EE("investment", e.target.value)}
                    placeholder="Enter investment amount"
                  />
                </div>
              </div>

              {num(sec54EE.investment) > 5000000 && (
                <div className="cg-warning-box">
                  ⚠ Maximum eligible investment under 54EE is ₹50,00,000 per FY.
                </div>
              )}
            </>
          )}

          {/* ================= SECTION 54F ================= */}
          {activeTab === "54F" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54F Calculator</h2>
                <p>Exemption for investment in residential house property</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54F.assessmentYear}
                    onChange={(e) => update54F("assessmentYear", e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming exemption <span>*</span></label>
                  <input value="Individiual/HUF" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital assets eligible for exemption <span>*</span></label>
                  <input
                    value="Any long term asset other than residenitial house property"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for investment <span>*</span></label>
                  <input value="Residenitial house property of India" disabled />
                </div>

                <div className="cg-field">
                  <label>Amount of Capital Gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54F.capitalGain}
                    onChange={(e) => update54F("capitalGain", e.target.value)}
                    placeholder="Enter capital gain amount"
                  />
                </div>

                <div className="cg-field full">
                  <label>Net sale consideration</label>
                  <input
                    type="number"
                    value={sec54F.netConsideration}
                    onChange={(e) => update54F("netConsideration", e.target.value)}
                    placeholder="Enter net sale consideration amount"
                  />
                </div>

                <div className="cg-field full">
                  <label>Amount of Investment / Cost / Expenditure incurred</label>
                  <input
                    type="number"
                    value={sec54F.investment}
                    onChange={(e) => update54F("investment", e.target.value)}
                    placeholder="Enter investment amount"
                  />
                </div>

                <div className="cg-field full">
                  <label>Amount deposited in Capital Gains Account Scheme</label>
                  <input
                    type="number"
                    value={sec54F.cgas}
                    onChange={(e) => update54F("cgas", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {result54F.warnings.length > 0 && (
                <div className="cg-warning-box">
                  <p>Notes:</p>
                  <ul>
                    {result54F.warnings.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* ================= SECTION 54G ================= */}
          {activeTab === "54G" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54G Calculator</h2>
                <p>Exemption on shifting of industrial undertaking</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54G.assessmentYear}
                    onChange={(e) => update54G("assessmentYear", e.target.value)}
                  >
                    <option value="">Select</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming the exemption <span>*</span></label>
                  <input value="Any person" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term / Short Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for exemption <span>*</span></label>
                  <input
                    value="Plant and machinery, Land and building and Shifting expenses"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for investment <span>*</span></label>
                  <input
                    value="Plant and machinery, Land and building and any right thereon"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of capital gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54G.capitalGain}
                    onChange={(e) => update54G("capitalGain", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of investment / cost / expenditure</label>
                  <input
                    type="number"
                    value={sec54G.investmentCost}
                    onChange={(e) => update54G("investmentCost", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount deposited in Capital Gains Account Scheme</label>
                  <input
                    type="number"
                    value={sec54G.cgas}
                    onChange={(e) => update54G("cgas", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= SECTION 54GA ================= */}
          {activeTab === "54GA" && (
            <>
              <div className="cg-section-title">
                <h2>Section 54GA Calculator</h2>
                <p>Exemption on shifting of industrial undertaking to SEZ</p>
              </div>

              <div className="cg-form-grid">
                <div className="cg-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={sec54GA.assessmentYear}
                    onChange={(e) => update54GA("assessmentYear", e.target.value)}
                  >
                    <option value="">Select</option>
                    {assessmentYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="cg-field">
                  <label>Eligible person for claiming the exemption <span>*</span></label>
                  <input value="Any person" disabled />
                </div>

                <div className="cg-field">
                  <label>Type of capital gain <span>*</span></label>
                  <input value="Long Term / Short Term" disabled />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for exemption <span>*</span></label>
                  <input
                    value="Plant and machinery, Land and building and Shifting expenses"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Capital asset eligible for investment <span>*</span></label>
                  <input
                    value="Plant and machinery, Land and building and any right thereon"
                    disabled
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of capital gain <span>*</span></label>
                  <input
                    type="number"
                    value={sec54GA.capitalGain}
                    onChange={(e) => update54GA("capitalGain", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount of investment / cost / expenditure</label>
                  <input
                    type="number"
                    value={sec54GA.investmentCost}
                    onChange={(e) => update54GA("investmentCost", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="cg-field">
                  <label>Amount deposited in Capital Gains Account Scheme</label>
                  <input
                    type="number"
                    value={sec54GA.cgas}
                    onChange={(e) => update54GA("cgas", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </>
          )}

          <div className="cg-modern-actions">
            <button onClick={handleReset} className="cg-btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT RESULT PANEL */}
        <div className="cg-result-panel">
          <div className="cg-result-head">
            <p>Computation Summary</p>
            <h2>
              ₹ {
                activeTab === "54" ? result.exemption.toLocaleString() :
                activeTab === "54B" ? result54B.exemption.toLocaleString() :
                activeTab === "54D" ? result54D.exemption.toLocaleString() :
                activeTab === "54EC" ? calculation.exemption.toLocaleString() :
                activeTab === "54EE" ? result54EE.exemption.toLocaleString() :
                activeTab === "54F" ? result54F.exemption.toLocaleString() :
                activeTab === "54G" ? result54G.exemption.toLocaleString() :
                activeTab === "54GA" ? result54GA.exemption.toLocaleString() :
                "0"
              }
            </h2>
            <span>Amount of Exemption</span>
          </div>

          <div className="cg-result-list">
            <div className="cg-result-item">
              <span>Selected Section</span>
              <strong>Section {activeTab}</strong>
            </div>

            <div className="cg-result-item">
              <span>Assessment Year</span>
              <strong>
                {
                  activeTab === "54" ? sec54.assessmentYear || "-" :
                  activeTab === "54B" ? sec54B.assessmentYear || "-" :
                  activeTab === "54D" ? sec54D.assessmentYear || "-" :
                  activeTab === "54EC" ? sec54EC.assessmentYear || "-" :
                  activeTab === "54EE" ? sec54EE.assessmentYear || "-" :
                  activeTab === "54F" ? sec54F.assessmentYear || "-" :
                  activeTab === "54G" ? sec54G.assessmentYear || "-" :
                  activeTab === "54GA" ? sec54GA.assessmentYear || "-" :
                  "-"
                }
              </strong>
            </div>

            <div className="cg-result-item">
              <span>Capital Gain</span>
              <strong>
                ₹ {
                  activeTab === "54" ? Number(sec54.capitalGain || 0).toLocaleString() :
                  activeTab === "54B" ? Number(sec54B.capitalGain || 0).toLocaleString() :
                  activeTab === "54D" ? Number(sec54D.capitalGain || 0).toLocaleString() :
                  activeTab === "54EC" ? Number(sec54EC.capitalGain || 0).toLocaleString() :
                  activeTab === "54EE" ? Number(sec54EE.capitalGain || 0).toLocaleString() :
                  activeTab === "54F" ? Number(sec54F.capitalGain || 0).toLocaleString() :
                  activeTab === "54G" ? Number(sec54G.capitalGain || 0).toLocaleString() :
                  activeTab === "54GA" ? Number(sec54GA.capitalGain || 0).toLocaleString() :
                  "0"
                }
              </strong>
            </div>

            <div className="cg-result-item exempt">
              <span>Amount of Exemption</span>
              <strong>
                ₹ {
                  activeTab === "54" ? result.exemption.toLocaleString() :
                  activeTab === "54B" ? result54B.exemption.toLocaleString() :
                  activeTab === "54D" ? result54D.exemption.toLocaleString() :
                  activeTab === "54EC" ? calculation.exemption.toLocaleString() :
                  activeTab === "54EE" ? result54EE.exemption.toLocaleString() :
                  activeTab === "54F" ? result54F.exemption.toLocaleString() :
                  activeTab === "54G" ? result54G.exemption.toLocaleString() :
                  activeTab === "54GA" ? result54GA.exemption.toLocaleString() :
                  "0"
                }
              </strong>
            </div>

            <div className="cg-result-item final">
              <span>Taxable Capital Gain</span>
              <strong>
                ₹ {
                  activeTab === "54" ? result.taxable.toLocaleString() :
                  activeTab === "54B" ? result54B.taxable.toLocaleString() :
                  activeTab === "54D" ? result54D.taxable.toLocaleString() :
                  activeTab === "54EC" ? calculation.taxable.toLocaleString() :
                  activeTab === "54EE" ? result54EE.taxable.toLocaleString() :
                  activeTab === "54F" ? result54F.taxable.toLocaleString() :
                  activeTab === "54G" ? result54G.taxable.toLocaleString() :
                  activeTab === "54GA" ? result54GA.taxable.toLocaleString() :
                  "0"
                }
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .cg-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .cg-modern-container {
        max-width: 1300px;
        margin: 0 auto;
      }

      .cg-modern-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 28px;
        padding: 26px;
        border-radius: 24px;
        background: rgba(15, 23, 42, 0.86);
        border: 1px solid rgba(148, 163, 184, 0.18);
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.35);
      }

      .cg-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .cg-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .cg-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .cg-modern-badge {
        min-width: 190px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .cg-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .cg-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .cg-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 26px;
        align-items: start;
      }

      .cg-modern-card,
      .cg-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .cg-modern-card {
        padding: 26px;
      }

      .cg-tab-wrap {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 18px;
        margin-bottom: 24px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .cg-tab {
        min-width: max-content;
        height: 42px;
        padding: 0 18px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(2, 6, 23, 0.48);
        color: #cbd5e1;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .cg-tab:hover {
        border-color: #60a5fa;
        color: #ffffff;
      }

      .cg-tab.active {
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        border-color: rgba(96, 165, 250, 0.55);
        color: #ffffff;
        box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
      }

      .cg-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .cg-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .cg-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .cg-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .cg-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cg-field.full {
        grid-column: span 2;
      }

      .cg-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.45;
      }

      .cg-field label span {
        color: #f87171;
      }

      .cg-field input,
      .cg-field select {
        width: 100%;
        height: 46px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(2, 6, 23, 0.48);
        color: #ffffff;
        padding: 0 14px;
        outline: none;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .cg-field input::placeholder {
        color: #64748b;
      }

      .cg-field input:focus,
      .cg-field select:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .cg-field input:disabled {
        opacity: 0.9;
        cursor: not-allowed;
        background: rgba(30, 41, 59, 0.75);
        color: #cbd5e1;
      }

      .cg-field option {
        background: #0f172a;
        color: #ffffff;
      }

      .cg-warning-box {
        margin-top: 22px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(245, 158, 11, 0.12);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #fde68a;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.6;
      }

      .cg-warning-box p {
        margin: 0 0 6px;
      }

      .cg-warning-box ul {
        margin: 0;
        padding-left: 0;
        list-style: none;
      }

      .cg-modern-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 26px;
      }

      .cg-btn-secondary {
        height: 44px;
        padding: 0 24px;
        border-radius: 14px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s ease;
        background: rgba(148, 163, 184, 0.12);
        color: #cbd5e1;
        border: 1px solid rgba(148, 163, 184, 0.22);
      }

      .cg-btn-secondary:hover {
        background: rgba(248, 113, 113, 0.16);
        color: #fecaca;
        border-color: rgba(248, 113, 113, 0.32);
      }

      .cg-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .cg-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .cg-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .cg-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 32px;
        line-height: 1.2;
        word-break: break-word;
      }

      .cg-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .cg-result-list {
        padding: 18px;
      }

      .cg-result-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .cg-result-item:last-child {
        border-bottom: none;
      }

      .cg-result-item span {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.4;
      }

      .cg-result-item strong {
        color: #ffffff;
        font-size: 15px;
        text-align: right;
        white-space: nowrap;
      }

      .cg-result-item.exempt {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(34, 197, 94, 0.24);
        background: rgba(34, 197, 94, 0.08);
      }

      .cg-result-item.exempt span {
        color: #bbf7d0;
        font-weight: 800;
      }

      .cg-result-item.exempt strong {
        color: #86efac;
        font-size: 18px;
      }

      .cg-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(248, 113, 113, 0.28);
        background: rgba(248, 113, 113, 0.09);
      }

      .cg-result-item.final span {
        color: #fecaca;
        font-weight: 800;
      }

      .cg-result-item.final strong {
        color: #fca5a5;
        font-size: 20px;
      }

      @media (max-width: 1100px) {
        .cg-modern-page {
          padding: 20px;
        }

        .cg-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .cg-modern-grid {
          grid-template-columns: 1fr;
        }

        .cg-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .cg-form-grid {
          grid-template-columns: 1fr;
        }

        .cg-field.full {
          grid-column: span 1;
        }

        .cg-modern-actions {
          flex-direction: column;
        }

        .cg-btn-secondary {
          width: 100%;
        }

        .cg-result-item {
          flex-direction: column;
        }

        .cg-result-item strong {
          text-align: left;
          white-space: normal;
        }
      }
        /* BACK BUTTON */

        .business-code-back-wrapper {
         
          margin-bottom: 20px;
        }

        .business-code-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 46px;
          padding: 0 20px;
          border-radius: 14px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(15, 23, 42, 0.9);
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .business-code-back-btn:hover {
          border-color: #60a5fa;
          color: #ffffff;
          background: rgba(37, 99, 235, 0.12);
        }

        .business-code-back-btn span {
          font-size: 18px;
        }
    `}</style>
  </div>
);
}