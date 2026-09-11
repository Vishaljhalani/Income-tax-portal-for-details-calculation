import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ACTIVE_YEARS = ["2026-27"];

const YEAR_OPTIONS = [
  {
    value: "2026-27",
    label: "AY 2026-27",
  },
];

const STATUS_LABEL =
  "AOP – Maximum Marginal Rate";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatINR(value) {
  return Math.round(
    Number(value) || 0
  ).toLocaleString("en-IN");
}

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

function getSpecialRateRules(ay) {
  return (
    SPECIAL_RATE_RULES[ay] ||
    SPECIAL_RATE_RULES["2026-27"]
  );
}

/* =========================================================
   SPECIAL RATE TAX
========================================================= */

function calculateSpecialRateTaxes({ 
  assessmentYear,
  totalIncome,
  income111A, 
  income112, 
  income112A, 
  dividendIncome,
  normalIncomeTax,
}) {
  const rules =
    getSpecialRateRules(
      assessmentYear
    );

  const gross111A = Math.max(
    toNumber(income111A),
    0
  );

  const gross112 = Math.max(
    toNumber(income112),
    0
  );

  const gross112A = Math.max(
    toNumber(income112A),
    0
  );

  const dividend = Math.max(
    toNumber(dividendIncome),
    0
  );

  const taxable112A = Math.max(
    gross112A -
      Number(
        rules.exemption112A || 0
      ),
    0
  );

  const tax111A =
    gross111A *
    Number(rules.rate111A || 0) /
    100;

  const tax112 =
    gross112 *
    Number(rules.rate112 || 0) /
    100;

  const tax112A =
    taxable112A *
    Number(rules.rate112A || 0) /
    100;

  /* =========================================================
     DIVIDEND TAX - PROPORTIONATE METHOD
     
     Normal Income =
     Total Income - Special Income
  ========================================================= */

  const specialIncome =
    gross111A +
    gross112 +
    gross112A;

    const normalIncome = Math.max(
  toNumber(totalIncome) -
    specialIncome -
    dividend,
  0);

  
  const dividendTax =
  normalIncome > 0
    ? (
        Number(normalIncomeTax || 0) /
        normalIncome
      ) * dividend
    : 0;

  /* =========================================================
     DIVIDEND SURCHARGE @ 15%
  ========================================================= */

  const dividendSurcharge =
    dividendTax * 15 / 100;

  const dividendTaxWithSurcharge =
    dividendTax +
    dividendSurcharge;

  const totalSpecialRateTax =
    tax111A +
    tax112 +
    tax112A;

  return {
    income111A: gross111A,
    income112: gross112,
    income112A: gross112A,
    dividendIncome: dividend,

    taxable111AIncome: gross111A,
    taxable112Income: gross112,
    taxable112AIncome: taxable112A,

    exemption112A:
      Number(
        rules.exemption112A || 0
      ),

  tax111A,
tax112,
tax112A,

totalSpecialRateTax,

specialIncome,
normalIncome,

normalIncomeTax:
  Number(normalIncomeTax || 0),

dividendTax,
dividendSurcharge,
dividendTaxWithSurcharge,
 
    totalSpecialRateTax,
  };
}
/* =========================================================
   AOP MAXIMUM MARGINAL RATE CALCULATION
========================================================= */

function calculateAOPMaximumMarginalRate({
  totalIncome,
  income111A,
  income112,
  income112A,
  dividendIncome,
  regime,
}) {
  const income = Math.max(
    toNumber(totalIncome),
    0
  );

  /*
    ----------------------------------------
    STEP 1: Special Rate Income
    ----------------------------------------
  */

  const gross111A = Math.max(
    toNumber(income111A),
    0
  );

  const gross112 = Math.max(
    toNumber(income112),
    0
  );

  const gross112A = Math.max(
    toNumber(income112A),
    0
  );

  const dividend = Math.max(
    toNumber(dividendIncome),
    0
  );

  const specialIncome =
    gross111A +
    gross112 +
    gross112A;

  /*
    ----------------------------------------
    STEP 2: Normal Income
    ----------------------------------------
  */

  const normalIncome = Math.max(
    income -
      specialIncome -
      dividend,
    0
  );

  /*
    AOP – Maximum Marginal Rate
    Normal Income = 30%
  */

  const normalTax =
    normalIncome * 30 / 100;

  /*
    ----------------------------------------
    STEP 3: Special Rate Tax
    ----------------------------------------
  */

  const specialTax =
    calculateSpecialRateTaxes({
      assessmentYear: "2026-27",
      totalIncome: income,
      income111A: gross111A,
      income112: gross112,
      income112A: gross112A,
      dividendIncome: dividend,
      normalIncomeTax: normalTax,
    });

 
 
  /*
    ----------------------------------------
    STEP 5: Special Rate Tax
    ----------------------------------------
  */

  const specialRateTax =
    specialTax.totalSpecialRateTax;

  /*
    ----------------------------------------
    STEP 6: Tax Before Surcharge
    ----------------------------------------
  */

 const totalTaxBeforeSurcharge =
  normalTax +
  specialRateTax +
  specialTax.dividendTax;
  /*
    ----------------------------------------
    STEP 7: General Surcharge Rate
    ----------------------------------------
  */

  const surchargeRate =
    regime === "new"
      ? 25
      : 37;

  /*
    ----------------------------------------
    STEP 8: Surcharge Break-up
    ----------------------------------------
  */

  const normalIncomeSurcharge =
    normalTax *
    surchargeRate /
    100;

 const specialRateIncomeSurcharge =
  specialRateTax * 15 / 100;
  /*
    Dividend surcharge is separately calculated
    @ 15%
  */

  /*
    ----------------------------------------
    STEP 9: Total Surcharge
    ----------------------------------------
  */
const totalSurcharge =
  normalIncomeSurcharge +
  specialRateIncomeSurcharge +
  specialTax.dividendSurcharge;

  /*
    ----------------------------------------
    STEP 10: Final Tax
    ----------------------------------------
  */

  const totalTaxAfterSurcharge =
    totalTaxBeforeSurcharge +
    totalSurcharge;

  return {
    totalIncome: income,

    /*
      Normal Income
    */
    normalIncome,
    normalTax,

    /*
      Special Rate Income
    */
    income111A: gross111A,
    income112: gross112,
    income112A: gross112A,

    taxable112AIncome:
      specialTax.taxable112AIncome,

    exemption112A:
      specialTax.exemption112A,

    tax111A:
      specialTax.tax111A,

    tax112:
      specialTax.tax112,

    tax112A:
      specialTax.tax112A,

    specialRateTax,

    dividendIncome: dividend,
dividendTax: specialTax.dividendTax,
dividendSurcharge: specialTax.dividendSurcharge,
totalTaxBeforeSurcharge,

    /*
      Surcharge
    */
    surchargeRate,

    normalIncomeSurcharge,

    specialRateIncomeSurcharge,

    totalSurcharge,

    /*
      Existing field
      Keep this so existing UI
      does not break.
    */
    surcharge: totalSurcharge,

    /*
      Final
    */
    totalTaxAfterSurcharge,

    finalTax:
      totalTaxAfterSurcharge,

    /*
      MMR case:
      No marginal relief
      No threshold tax
      No excess income
    */
    marginalRelief: 0,

    thresholdTax: 0,

    excessIncome: 0,

    taxOnExcessIncome: 0,
  };
}
/* =========================================================
   COMPONENT
========================================================= */

export default function AOPMaximumMarginalRateCalculator() {
  const navigate = useNavigate();

  const [assessmentYear, setAssessmentYear] =
    useState("2026-27");

  const [regime, setRegime] =
    useState("new");

  const [totalIncome, setTotalIncome] =
    useState("");

  const [income111A, setIncome111A] =
    useState("");

  const [income112, setIncome112] =
    useState("");

  const [income112A, setIncome112A] =
    useState("");

  const [dividendIncome, setDividendIncome] =
    useState("");



  const calculation = useMemo(() => {
    return calculateAOPMaximumMarginalRate({
      totalIncome,
      income111A,
      income112,
      income112A,
      dividendIncome,
      regime,
    });
  }, [
    totalIncome,
    income111A,
    income112,
    income112A,
    dividendIncome,
    regime,
  ]);

  const resetCalculator = () => {
    setAssessmentYear("2026-27");
    setRegime("new");
    setTotalIncome("");
    setIncome111A("");
    setIncome112("");
    setIncome112A("");
    setDividendIncome("");
  };

  return (
    <div className="smr-page">

      <style>{`
        * {
          box-sizing: border-box;
        }
        /* Remove spinner arrows from ALL number inputs */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
  
        .smr-page {
          min-height: 100vh;
          background:
            linear-gradient(
              135deg,
              #071021 0%,
              #0b1427 55%,
              #0e1d34 100%
            );
          color: #f7f9fc;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .smr-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid #3b82f6;
          background: #132b50;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 22px;
        }

        .smr-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 28px 70px;
        }

        .smr-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 2fr)
            minmax(350px, 1fr);
          gap: 22px;
          align-items: start;
        }

        .smr-left {
          min-width: 0;
        }

        .smr-right {
          position: sticky;
          top: 18px;
          min-width: 0;
        }

        .smr-card {
          background:
            linear-gradient(
              180deg,
              rgba(16, 29, 51, 0.98),
              rgba(10, 21, 38, 0.98)
            );
          border: 1px solid #243653;
          border-radius: 22px;
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.22);
        }

        .smr-input-card {
          padding: 24px;
        }

        .smr-top-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .smr-field label {
          display: block;
          margin-bottom: 8px;
          color: #e4e9f2;
          font-size: 13px;
          font-weight: 800;
        }

        .smr-select,
        .smr-input {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: 1px solid #273b5c;
          background: #060e1d;
          color: #f4f7fb;
          padding: 0 15px;
          outline: none;
          font-size: 14px;
          font-weight: 650;
        }

        .smr-select:focus,
        .smr-input:focus {
          border-color: #2c91e8;
          box-shadow:
            0 0 0 3px rgba(34, 137, 230, 0.13);
        }

        .smr-regimes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }

        .smr-regime-btn {
          height: 48px;
          border-radius: 15px;
          border: 1px solid #31425b;
          background: #1b2a40;
          color: #cbd3df;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
        }

        .smr-regime-btn.active {
          background:
            linear-gradient(
              90deg,
              #2370e8,
              #12a5df
            );
          border-color: #2d91ec;
          color: white;
          box-shadow:
            0 8px 22px rgba(21, 122, 231, 0.22);
        }

        .smr-section-title {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin: 22px 0 18px;
        }

        .smr-step {
          width: 35px;
          height: 35px;
          border-radius: 11px;
          background:
            linear-gradient(
              135deg,
              #1478f4,
              #16a8df
            );
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          flex-shrink: 0;
          box-shadow:
            0 7px 20px rgba(21, 125, 239, 0.25);
        }

        .smr-section-title h2 {
          margin: 1px 0 3px;
          font-size: 20px;
          font-weight: 900;
        }

        .smr-section-title p {
          margin: 0;
          color: #91a0b6;
          font-size: 12px;
          line-height: 1.5;
        }

        .smr-income-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 18px;
        }

        .smr-special-card {
          border: 1px solid #293d5b;
          border-radius: 15px;
          overflow: hidden;
          background: #0b172a;
        }

        .smr-special-head {
          display: grid;
          grid-template-columns: 1fr 130px 100px;
          padding: 14px 16px;
          background: #102038;
          border-bottom: 1px solid #263955;
          color: #e7edf6;
          font-size: 12px;
          font-weight: 850;
        }

        .smr-special-row {
          display: grid;
          grid-template-columns: 1fr 130px 100px;
          align-items: center;
          min-height: 58px;
          padding: 8px 16px;
          border-bottom: 1px solid #20324d;
        }

        .smr-special-row:last-child {
          border-bottom: 0;
        }

        .smr-special-name {
          font-size: 13px;
          font-weight: 800;
        }

        .smr-special-description {
          margin-top: 3px;
          color: #7e8da3;
          font-size: 10px;
        }

        .smr-special-input {
          width: 130px;
          height: 37px;
          border-radius: 8px;
          border: 1px solid #32496b;
          background: #0a1424;
          color: white;
          text-align: right;
          padding: 0 10px;
          outline: none;
        }

        .smr-special-tax {
          text-align: right;
          font-size: 13px;
          font-weight: 850;
        }

        .smr-special-total {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          background: #101e34;
          font-size: 12px;
          font-weight: 800;
          color: #a9b5c6;
        }
          .smr-dividend-card {
  margin-top: 18px;
  border: 1px solid #293d5b;
  border-radius: 18px;
  overflow: hidden;
  background: #0b172a;
}

.smr-dividend-header {
  padding: 16px;
  background: #102038;
  border-bottom: 1px solid #263955;
}

.smr-dividend-title {
  color: #e7edf6;
  font-size: 14px;
  font-weight: 900;
}

.smr-dividend-description {
  margin-top: 5px;
  color: #7e8da3;
  font-size: 11px;
  line-height: 1.5;
}

.smr-dividend-row {
  display: grid;
  grid-template-columns: 1fr 130px;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid #20324d;
}

.smr-dividend-name {
  color: #f1f5fb;
  font-size: 13px;
  font-weight: 850;
}

.smr-dividend-calculation {
  padding: 8px 16px 14px;
}

.smr-dividend-calc-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 11px 0;
  color: #a9b5c6;
  font-size: 12px;
  font-weight: 750;
  border-bottom: 1px solid #20324d;
}

.smr-dividend-calc-row span:last-child {
  color: #f4f7fb;
  font-weight: 850;
  text-align: right;
}

.smr-dividend-total {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 8px;
  padding: 13px 14px;
  border-radius: 12px;
  background: #0c2b48;
  border: 1px solid #145a8d;
  color: #dbeeff;
  font-size: 12px;
  font-weight: 900;
}

.smr-dividend-total span:last-child {
  color: #fff;
  font-size: 14px;
}

        .smr-summary-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 18px 0 26px;
        }

        .smr-summary-card {
          min-height: 96px;
          border-radius: 18px;
          border: 1px solid #263956;
          background: #081225;
          padding: 16px;
        }

        .smr-summary-label {
          color: #8f9eb3;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
        }

        .smr-summary-value {
          margin-top: 10px;
          font-size: 18px;
          font-weight: 900;
        }

        .smr-info-card {
          border: 1px solid #293d5b;
          border-radius: 20px;
          background: #0a1628;
          padding: 18px;
          margin-top: 22px;
        }

        .smr-info-card h3 {
          margin: 0 0 10px;
          color: #83c8f1;
          font-size: 14px;
          font-weight: 900;
        }

        .smr-info-card p {
          margin: 0;
          color: #aab6c7;
          font-size: 12px;
          line-height: 1.7;
          white-space: pre-line;
        }

        .smr-result-card {
          padding: 18px;
        }

        .smr-result-header {
          border-radius: 17px;
          background: #0b2d50;
          border: 1px solid #17558b;
          padding: 16px;
          margin-bottom: 12px;
        }

        .smr-result-header small {
          color: #8eb8df;
          font-size: 11px;
          font-weight: 850;
        }

        .smr-result-header h2 {
          margin: 5px 0 0;
          font-size: 17px;
          font-weight: 900;
        }

        .smr-result-item {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 0 15px;
          margin-bottom: 10px;
          border-radius: 16px;
          background: #081225;
          border: 1px solid #263753;
        }

        .smr-result-item.highlight {
          background: #0c2b48;
          border-color: #145a8d;
        }

        .smr-result-label {
          color: #92a0b4;
          font-size: 12px;
          font-weight: 850;
        }

        .smr-result-value {
          font-size: 14px;
          font-weight: 900;
          text-align: right;
        }

        .smr-result-heading {
          margin: 18px 0 9px;
          color: #83c8f1;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.2px;
        }

        .smr-net-card {
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              #1d76ed,
              #078fd8
            );
          padding: 20px;
          margin-bottom: 16px;
          box-shadow:
            0 15px 30px rgba(9, 118, 223, 0.18);
        }

        .smr-net-card small {
          display: block;
          font-size: 12px;
          font-weight: 850;
        }

        .smr-net-value {
          margin: 8px 0 10px;
          font-size: 31px;
          font-weight: 950;
        }

        .smr-net-formula {
          color: rgba(255,255,255,0.88);
          font-size: 11px;
          line-height: 1.45;
        }

        .smr-actions {
          display: grid;
          gap: 10px;
        }

        .smr-action-btn {
          min-height: 46px;
          border-radius: 14px;
          border: 1px solid #28405e;
          background: #102039;
          color: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 900;
        }

        @media (max-width: 1000px) {
          .smr-grid {
            grid-template-columns: 1fr;
          }

          .smr-right {
            position: static;
          }
        }

        @media (max-width: 720px) {
          .smr-top-selection,
          .smr-income-grid,
          .smr-regimes {
            grid-template-columns: 1fr;
          }

          .smr-summary-grid {
            grid-template-columns: 1fr 1fr;
          }

          .smr-special-head,
          .smr-special-row {
            grid-template-columns:
              1fr 100px 70px;
          }

          .smr-special-input {
            width: 100px;
          }

          .smr-content {
            padding: 18px 12px 40px;
          }
        }

        @media (max-width: 480px) {
          .smr-summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="smr-content">

        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <button
          type="button"
          className="smr-back-btn"
          onClick={() =>
            navigate(
              "/SurchargeMarginalReliefCalculatorStatusWise"
            )
          }
        >
          ← Back
        </button>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "800",
              color: "#fff",
            }}
          >
            AOP – Maximum Marginal Rate
          </h1>

          <p
            style={{
              marginTop: "7px",
              marginBottom: 0,
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Surcharge Calculator
          </p>
        </div>

        <div className="smr-grid">

          {/* ===================================================
              LEFT PANEL
          =================================================== */}

          <section className="smr-left">

            <div className="smr-card smr-input-card">

              {/* =================================================
                  STEP 1
              ================================================= */}

              <div className="smr-section-title">
                <div className="smr-step">1</div>

                <div>
                  <h2>Basic Selection</h2>
                  <p>
                    Select assessment year and tax regime.
                  </p>
                </div>
              </div>

              <div className="smr-top-selection">

                <div className="smr-field">
                  <label>
                    Assessment Year
                  </label>

                  <select
                    className="smr-select"
                    value={assessmentYear}
                    onChange={(e) =>
                      setAssessmentYear(
                        e.target.value
                      )
                    }
                  >
                    {YEAR_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="smr-field">
                  <label>
                    Status
                  </label>

                  <select
                    className="smr-select"
                    value="aop_mmr"
                    disabled
                  >
                    <option value="aop_mmr">
                      {STATUS_LABEL}
                    </option>
                  </select>
                </div>

              </div>

              <div className="smr-regimes">

                <button
                  type="button"
                  className={
                    regime === "old"
                      ? "smr-regime-btn active"
                      : "smr-regime-btn"
                  }
                  onClick={() =>
                    setRegime("old")
                  }
                >
                  Old Tax Regime
                </button>

                <button
                  type="button"
                  className={
                    regime === "new"
                      ? "smr-regime-btn active"
                      : "smr-regime-btn"
                  }
                  onClick={() =>
                    setRegime("new")
                  }
                >
                  New Tax Regime
                </button>

              </div>

              {/* =================================================
                  STEP 2
              ================================================= */}

              <div className="smr-section-title">
                <div className="smr-step">2</div>

                <div>
                  <h2>
                    Computation of Total Income
                  </h2>

                  <p>
                    Enter total income and
                    special-rate income details.
                  </p>
                </div>
              </div>

              <div className="smr-income-grid">

                <div className="smr-field">
                  <label>
                    Total Income
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="smr-input no-spinner"
                    value={totalIncome}
                    onChange={(e) =>
                      setTotalIncome(
                        e.target.value
                      )
                    }
                    placeholder="Enter total income"
                  />
                </div>

              </div>

              {/* =================================================
                  SPECIAL RATE TABLE
              ================================================= */}

              <div className="smr-special-card">

                <div className="smr-special-head">
                  <div>
                    Special Rate Income
                  </div>

                  <div>
                    Income
                  </div>

                  <div>
                    Tax
                  </div>
                </div>

                {/* 111A */}

                <div className="smr-special-row">

                  <div>
                    <div className="smr-special-name">
                      Section 111A
                    </div>

                    <div className="smr-special-description">
                      STCG on specified securities
                    </div>
                  </div>

                  <input
                    type="number"
                    min="0"
                    className="smr-special-input no-spinner"
                    value={income111A}
                    onChange={(e) =>
                      setIncome111A(
                        e.target.value
                      )
                    }
                    placeholder="0"
                  />

                  <div className="smr-special-tax">
                    ₹
                    {formatINR(
                      calculation.tax111A
                    )}
                  </div>

                </div>

                {/* 112 */}

                <div className="smr-special-row">

                  <div>
                    <div className="smr-special-name">
                      Section 112
                    </div>

                    <div className="smr-special-description">
                      LTCG other than Section 112A
                    </div>
                  </div>

                  <input
                    type="number"
                    min="0"
                    className="smr-special-input no-spinner"
                    value={income112}
                    onChange={(e) =>
                      setIncome112(
                        e.target.value
                      )
                    }
                    placeholder="0"
                  />

                  <div className="smr-special-tax">
                    ₹
                    {formatINR(
                      calculation.tax112
                    )}
                  </div>

                </div>

                {/* 112A */}

                <div className="smr-special-row">

                  <div>
                    <div className="smr-special-name">
                      Section 112A
                    </div>

                    <div className="smr-special-description">
                      LTCG on specified securities
                    </div>
                  </div>

                  <input
                    type="number"
                    min="0"
                    className="smr-special-input no-spinner"
                    value={income112A}
                    onChange={(e) =>
                      setIncome112A(
                        e.target.value
                      )
                    }
                    placeholder="0"
                  />

                  <div className="smr-special-tax">
                    ₹
                    {formatINR(
                      calculation.tax112A
                    )}
                  </div>

                </div>

             

                <div className="smr-special-total">
                  <span>
                    Total Special Rate Tax
                  </span>

                  <span>
                    ₹
                    {formatINR(
                      calculation.specialRateTax
                    )}
                  </span>
                </div>

              </div>

                    {/* =================================================
    DIVIDEND INCOME & TAX
================================================= */}

<div className="smr-dividend-card">

  <div className="smr-dividend-header">
    <div>
      <div className="smr-dividend-title">
        Dividend Income & Tax
      </div>

      <div className="smr-dividend-description">
        Dividend is not treated as special-rate income.
        Tax is calculated proportionately with normal income tax.
      </div>
    </div>
  </div>

  <div className="smr-dividend-row">

    <div>
      <div className="smr-dividend-name">
        Dividend Income
      </div>
    </div>

    <input
      type="number"
      min="0"
      className="smr-special-input no-spinner"
      value={dividendIncome}
      onChange={(e) =>
        setDividendIncome(
          e.target.value
        )
      }
      placeholder="0"
    />

  </div>

  </div>

              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="smr-summary-grid">

                <div className="smr-summary-card">
                  <div className="smr-summary-label">
                    Normal Income
                  </div>

                  <div className="smr-summary-value">
                    ₹
                    {formatINR(
                      calculation.normalIncome
                    )}
                  </div>
                </div>
                </div>

             
                      {/* =================================================
    SURCHARGE BREAK-UP
================================================= */}

<div
  style={{
    marginTop: "22px",
    border: "1px solid #293d5b",
    borderRadius: "18px",
    overflow: "hidden",
    background: "#0b172a",
  }}
>
  <div
    style={{
      padding: "16px 18px",
      background: "#102038",
      borderBottom: "1px solid #263955",
    }}
  >
    <div
      style={{
        color: "#83c8f1",
        fontSize: "14px",
        fontWeight: "900",
      }}
    >
      Surcharge Break-up
    </div>

    <div
      style={{
        marginTop: "4px",
        color: "#7f90a7",
        fontSize: "11px",
      }}
    >
      Separate surcharge calculation for normal income,
      special-rate income and dividend income.
    </div>
  </div>

  {/* Normal Income Surcharge */}
  {/* Normal Income Surcharge */}
<div className="smr-special-row">
  <div>
    <div className="smr-special-name">
      Normal Income Surcharge
    </div>

    <div className="smr-special-description">
      Tax: ₹
      {formatINR(
        calculation.normalTax
      )}
    </div>
  </div>

  <div
    style={{
      textAlign: "right",
      color: "#aebbd0",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    {calculation.surchargeRate}%
  </div>

  <div className="smr-special-tax">
    ₹
    {formatINR(
      calculation.normalIncomeSurcharge
    )}
  </div>
</div>

  {/* Special Rate Income Surcharge */}
  {/* Special Rate Income Surcharge */}
<div className="smr-special-row">
  <div>
    <div className="smr-special-name">
      Special Rate Income Surcharge
    </div>

    <div className="smr-special-description">
      Tax: ₹
      {formatINR(
        calculation.specialRateTax
      )}
    </div>
  </div>

  <div
    style={{
      textAlign: "right",
      color: "#aebbd0",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    15%
  </div>

  <div className="smr-special-tax">
    ₹
    {formatINR(
      calculation.specialRateIncomeSurcharge
    )}
  </div>
</div>


  {/* Dividend Surcharge */}
 {/* Dividend Income Surcharge */}
<div className="smr-special-row">
  <div>
    <div className="smr-special-name">
      Dividend Income Surcharge
    </div>

    <div className="smr-special-description">
      Tax: ₹
      {formatINR(
        calculation.dividendTax
      )}
    </div>
  </div>

  <div
    style={{
      textAlign: "right",
      color: "#aebbd0",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    15%
  </div>

  <div className="smr-special-tax">
    ₹
    {formatINR(
      calculation.dividendSurcharge
    )}
  </div>
</div>


  {/* Total Surcharge */}
  <div
    style={{
      padding: "18px",
      background:
        "linear-gradient(90deg, #102742, #0d2038)",
      borderTop: "1px solid #294566",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <div>
        <div
          style={{
            color: "#dce7f5",
            fontSize: "13px",
            fontWeight: "900",
          }}
        >
          Total Surcharge
        </div>

        <div
          style={{
            marginTop: "5px",
            color: "#8fa5bf",
            fontSize: "11px",
            fontWeight: "700",
          }}
        >
           Applicable Rate: {calculation.surchargeRate}% on Normal Income Tax
  + 15% on Special Rate Tax
  + 15% on Dividend Tax
        </div>
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: "19px",
          fontWeight: "950",
          textAlign: "right",
        }}
      >
        ₹
        {formatINR(
          calculation.totalSurcharge
        )}
      </div>
    </div>

    <div
      style={{
        marginTop: "14px",
        paddingTop: "12px",
        borderTop: "1px solid #294566",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "#8fa5bf",
          fontSize: "11px",
          fontWeight: "800",
        }}
      >
        Final Surcharge Amount
      </span>

      <span
        style={{
          color: "#83c8f1",
          fontSize: "16px",
          fontWeight: "950",
        }}
      >
        ₹
        {formatINR(
          calculation.totalSurcharge
        )}
      </span>
    </div>
  </div>
</div>

              {/* =================================================
                  INFORMATION BOX
              ================================================= */}

       <div className="smr-info-card">

  <h3>
    AOP Tax Treatment – Situations
  </h3>

  <p style={{ marginBottom: "12px" }}>
    Applicable tax treatment of AOP income
  </p>

  <div
    style={{
      border: "1px solid #293d5b",
      borderRadius: "10px",
      overflow: "hidden",
      background: "#0b172a",
      fontSize: "11px",
    }}
  >

    {/* HEADER */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr",
        background: "#102038",
        borderBottom: "1px solid #293d5b",
      }}
    >
      <div
        style={{
          padding: "9px 11px",
          color: "#83c8f1",
          fontWeight: "900",
        }}
      >
        Situation
      </div>

      <div
        style={{
          padding: "9px 11px",
          color: "#83c8f1",
          fontWeight: "900",
          borderLeft: "1px solid #293d5b",
        }}
      >
        AOP par tax
      </div>
    </div>

    {/* ROW 1 */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr",
        borderBottom: "1px solid #20324d",
      }}
    >
      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          lineHeight: "1.4",
        }}
      >
        <strong>Share determined</strong>
        <br />
        + all members below basic exemption
      </div>

      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          fontWeight: "800",
          borderLeft: "1px solid #20324d",
          display: "flex",
          alignItems: "center",
        }}
      >
        Individual rates
      </div>
    </div>

    {/* ROW 2 */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr",
        borderBottom: "1px solid #20324d",
      }}
    >
      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          lineHeight: "1.4",
        }}
      >
        <strong>Share determined</strong>
        <br />
        + any member exceeds basic exemption
      </div>

      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          fontWeight: "800",
          borderLeft: "1px solid #20324d",
          display: "flex",
          alignItems: "center",
        }}
      >
        MMR
      </div>
    </div>

    {/* ROW 3 */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr",
        borderBottom: "1px solid #20324d",
      }}
    >
      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          lineHeight: "1.4",
        }}
      >
        <strong>Share determined</strong>
        <br />
        + any member&apos;s rate &gt; MMR
      </div>

      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          fontWeight: "800",
          lineHeight: "1.4",
          borderLeft: "1px solid #20324d",
        }}
      >
        That member&apos;s attributable share
        → higher rate
        <br />
        Balance → MMR
      </div>
    </div>

    {/* ROW 4 */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr",
        borderBottom: "1px solid #20324d",
      }}
    >
      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          lineHeight: "1.4",
        }}
      >
        <strong>Share indeterminate / unknown</strong>
      </div>

      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          fontWeight: "800",
          borderLeft: "1px solid #20324d",
          display: "flex",
          alignItems: "center",
        }}
      >
        MMR
      </div>
    </div>

    {/* ROW 5 */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr",
      }}
    >
      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          lineHeight: "1.4",
        }}
      >
        <strong>
          Share indeterminate + member&apos;s
          rate &gt; MMR
        </strong>
      </div>

      <div
        style={{
          padding: "9px 11px",
          color: "#dce7f5",
          fontWeight: "800",
          lineHeight: "1.4",
          borderLeft: "1px solid #20324d",
        }}
      >
        Entire AOP income
        <br />
        → higher rate(25% and 37% both are applicable and select manually)
      </div>
    </div>

  </div>

</div>
            </div>

          </section>

          {/* ===================================================
              RIGHT PANEL
          =================================================== */}

          <aside className="smr-right">

            <div className="smr-card smr-result-card">

              <div className="smr-result-header">
                <small>
                  FINAL OUTPUT
                </small>

                <h2>
                  AOP Maximum Marginal Rate
                </h2>
              </div>

              <div className="smr-result-heading">
                Tax Computation
              </div>

              <div className="smr-result-item">

                <span className="smr-result-label">
                  Total Income
                </span>

                <span className="smr-result-value">
                  ₹
                  {formatINR(
                    calculation.totalIncome
                  )}
                </span>

              </div>

              <div className="smr-result-item">

                <span className="smr-result-label">
                  Normal Tax @ 30%
                </span>

                <span className="smr-result-value">
                  ₹
                  {formatINR(
                    calculation.normalTax
                  )}
                </span>

              </div>

              <div className="smr-result-item">

                <span className="smr-result-label">
                  Special Rate Tax
                </span>

                <span className="smr-result-value">
                  ₹
                  {formatINR(
                    calculation.specialRateTax
                  )}
                </span>

              </div>

              <div className="smr-result-item">

  <span className="smr-result-label">
    Dividend Tax
  </span>

  <span className="smr-result-value">
    ₹
    {formatINR(
      calculation.dividendTax
    )}
  </span>

</div>



              <div className="smr-result-item highlight">

                <span className="smr-result-label">
                  Tax Before Surcharge
                </span>

                <span className="smr-result-value">
                  ₹
                  {formatINR(
                    calculation.totalTaxBeforeSurcharge
                  )}
                </span>

              </div>

              <div className="smr-result-heading">
                Surcharge
              </div>

              <div className="smr-result-item">

                <span className="smr-result-label">
                  Surcharge Rate
                </span>

                <span className="smr-result-value">
                  {calculation.surchargeRate}%
                </span>

              </div>

              <div className="smr-result-item">

                <span className="smr-result-label">
                  Surcharge
                </span>

                <span className="smr-result-value">
                  ₹
                  {formatINR(
                    calculation.surcharge
                  )}
                </span>

              </div>

              <div className="smr-net-card">

                <small>
                  FINAL TAX AFTER SURCHARGE
                </small>

                <div className="smr-net-value">
                  ₹
                  {formatINR(
                    calculation.finalTax
                  )}
                </div>

                <div className="smr-net-formula">
                  Tax Before Surcharge + Surcharge
                </div>

              </div>

              <div className="smr-actions">

                <button
                  type="button"
                  className="smr-action-btn"
                  onClick={resetCalculator}
                >
                  Reset Calculator
                </button>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}