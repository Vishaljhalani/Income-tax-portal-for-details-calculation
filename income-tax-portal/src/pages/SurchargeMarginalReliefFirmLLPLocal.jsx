import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


const ACTIVE_YEARS = ["2026-27"];

const YEAR_OPTIONS = [
  {
    value: "",
    label: "Select Assessment Year",
  },
  {
    value: "2026-27",
    label: "AY 2026-27",
  },
  {
    value: "coming-soon",
    label: "AY 2025-26 & Earlier - Coming Soon",
  },
];

const STATUS_OPTIONS = [
  {
    value: "firm_llp_local",
    label: "Firm / LLP / Local Authority",
  },
];

const RANGE_OPTIONS = {
  firm_llp_local: [
    {
      key: "FIRM_1CR",
      label: "Above ₹1 crore",
      shortLabel: "Above 1Cr",
      thresholdIncome: 10000000,
    },
  ],
};

const NON_INDIVIDUAL_THRESHOLD_TAX = {
  firm_llp_local: {
    FIRM_1CR: 3000000,
  },
};

const SURCHARGE_RULES = {
  firm_llp_local: {
    FIRM_1CR: 12,
  },
};

const THRESHOLD_PREVIOUS_SURCHARGE_RATE = {
  firm_llp_local: {
    FIRM_1CR: 0,
  },
};
const FIRM_LLP_LOCAL_SPECIAL_RATE_RULES = {
  "2026-27": {
    rate111A: 20,
    rate112: 12.5,
    rate112A: 12.5,
    exemption112A: 125000,
  },
};
function getFirmLlpLocalSpecialRateRules(ay) {
  return (
    FIRM_LLP_LOCAL_SPECIAL_RATE_RULES[ay] ||
    FIRM_LLP_LOCAL_SPECIAL_RATE_RULES["2026-27"]
  );
}
function calculateFirmLlpLocalSpecialRateTaxes({
  ay,
  income111A = 0,
  income112 = 0,
  income112A = 0,
}) {
  const rules =
    getFirmLlpLocalSpecialRateRules(ay);

  /* =========================================
     INPUT INCOME
  ========================================= */

  const taxable111AIncome = Math.max(
    toNumber(income111A),
    0
  );

  const taxable112Income = Math.max(
    toNumber(income112),
    0
  );

  const gross112AIncome = Math.max(
    toNumber(income112A),
    0
  );

  /* =========================================
     SECTION 112A
  ========================================= */

  const taxable112AIncome = Math.max(
    gross112AIncome -
      Number(rules.exemption112A || 0),
    0
  );

  console.log("112A DEBUG", {
  ay,
  rules,
  exemption112A: rules.exemption112A,
  gross112AIncome,
  taxable112AIncome,
});
  /* =========================================
     TAX u/s 111A
  ========================================= */

  const tax111A =
    taxable111AIncome *
    Number(rules.rate111A || 0) /
    100;

  /* =========================================
     TAX u/s 112
  ========================================= */

  const tax112 =
    taxable112Income *
    Number(rules.rate112 || 0) /
    100;

  /* =========================================
     TAX u/s 112A
  ========================================= */

  const tax112A =
    taxable112AIncome *
    Number(rules.rate112A || 0) /
    100;

  /* =========================================
     TOTAL SPECIAL RATE TAX
  ========================================= */

  const totalSpecialRateTax =
    tax111A +
    tax112 +
    tax112A;

  return {
    income111A:
      taxable111AIncome,

    income112:
      taxable112Income,

    income112A:
      gross112AIncome,

    taxable111AIncome,
    taxable112Income,
    taxable112AIncome,

    tax111A,
    tax112,
    tax112A,

    totalSpecialRateTax,
  };
}

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getRangeKeyForIncome(status, income) {
  const taxableIncome =
    Math.max(
      Number(income) || 0,
      0
    );



  if (status === "firm_llp_local") {
    if (taxableIncome > 10000000) {
      return "FIRM_1CR";
    }

    return "";
  }

  return "";
}
/* =========================================================
   FIRM / LLP / LOCAL AUTHORITY
   MARGINAL RELIEF CALCULATION
   AY 2026-27
========================================================= */

function calculateFirmLlpLocalMarginalRelief({
  ay,
  status,
  totalIncome,
  normalTax,
  specialTax,
  useManualThresholdPayable = false,
  manualThresholdPayable = "",
}) {
  /* =======================================================
     BASIC INPUTS
  ======================================================= */

  const income = Math.max(
    toNumber(totalIncome),
    0
  );

  const normalTaxAmount = Math.max(
    toNumber(normalTax),
    0
  );

  /* =======================================================
     SPECIAL RATE TAX
  ======================================================= */

  const tax111AAmount =
    Number(
      specialTax?.tax111A
    ) || 0;

  const tax112Amount =
    Number(
      specialTax?.tax112
    ) || 0;

  const tax112AAmount =
    Number(
      specialTax?.tax112A
    ) || 0;

  const specialRateTax =
    tax111AAmount +
    tax112Amount +
    tax112AAmount;

  /* =======================================================
     SPECIAL RATE INCOME
  ======================================================= */

  const income111A =
    Math.max(
      Number(
        specialTax?.income111A
      ) || 0,
      0
    );

  const income112 =
    Math.max(
      Number(
        specialTax?.income112
      ) || 0,
      0
    );

  const income112A =
    Math.max(
      Number(
        specialTax?.income112A
      ) || 0,
      0
    );

  const totalSpecialIncome =
    income111A +
    income112 +
    income112A;

  /* =======================================================
     TOTAL TAX BEFORE SURCHARGE
  ======================================================= */

  const totalTax =
    normalTaxAmount +
    specialRateTax;

  /* =======================================================
     RANGE
  ======================================================= */

  const rangeKey =
    getRangeKeyForIncome(
      status,
      income
    );

  /* =======================================================
     BELOW ₹1 CRORE
  ======================================================= */

  if (!rangeKey) {
    return {
      totalIncome: income,
      rangeKey: "",

      thresholdIncome: 0,
      thresholdTax: 0,
      thresholdSurcharge: 0,
      thresholdPayable: 0,

      normalTax: normalTaxAmount,

      tax111AAmount,
      tax112Amount,
      tax112AAmount,

      specialRateTax,

      totalTax,

      surchargeRate: 0,
      previousSurchargeRate: 0,

      surchargeBeforeRelief: 0,

      excessIncome: 0,
      taxOnExcessIncome: 0,
      allowableNetSurcharge: 0,
      excessTaxPayable: 0,

      marginalRelief: 0,

      finalSurcharge: 0,

      totalTaxWithSurcharge:
        totalTax,

      totalTaxAfterMarginalRelief:
        totalTax,

      finalTax:
        totalTax,

      isMarginalReliefApplicable:
        false,
    };
  }

  /* =======================================================
     THRESHOLD DATA
  ======================================================= */

  const selectedRange =
    RANGE_OPTIONS[
      status
    ]?.find(
      (item) =>
        item.key === rangeKey
    );

  const thresholdIncome =
    Number(
      selectedRange?.thresholdIncome
    ) || 0;

  /* =======================================================
     THRESHOLD TAX
     
     FIRM / LLP / LOCAL AUTHORITY
     
     Base threshold tax:
     ₹30,00,000
     
     Special-rate income ka tax
     threshold calculation ke liye
     normal rate @ 30% se calculate
     karke base threshold tax se
     subtract kiya jayega.
  ======================================================= */

  const baseThresholdTax =
    Number(
      NON_INDIVIDUAL_THRESHOLD_TAX[
        status
      ]?.[rangeKey]
    ) || 0;


 /* =======================================================
   SPECIAL RATE INCOME WITHIN ₹1 CRORE THRESHOLD
======================================================= */

const specialIncome111AAtThreshold = Math.min(
  income111A,
  thresholdIncome
);

const remainingAfter111A = Math.max(
  thresholdIncome -
    specialIncome111AAtThreshold,
  0
);

const specialIncome112AtThreshold = Math.min(
  income112,
  remainingAfter111A
);

const remainingAfter112 = Math.max(
  remainingAfter111A -
    specialIncome112AtThreshold,
  0
);

const specialIncome112AAtThreshold = Math.min(
  income112A,
  remainingAfter112
);

/* =======================================================
   ACTUAL SPECIAL-RATE TAX AT THRESHOLD
======================================================= */

const thresholdSpecialTax =
  calculateFirmLlpLocalSpecialRateTaxes({
    ay,

    income111A:
      specialIncome111AAtThreshold,

    income112:
      specialIncome112AtThreshold,

    income112A:
      specialIncome112AAtThreshold,
  });

const actualSpecialTaxAtThreshold =
  Number(
    thresholdSpecialTax?.totalSpecialRateTax
  ) || 0;

/* =======================================================
   SPECIAL INCOME TAX @ NORMAL 30%
   
   Base threshold tax already includes
   special-rate income @ 30%.
   
   Therefore remove 30% tax and add
   actual special-rate tax.
======================================================= */

const specialIncomeAtThreshold =
  specialIncome111AAtThreshold +
  specialIncome112AtThreshold +
  specialIncome112AAtThreshold;

const specialIncomeTaxAtNormalRate =
  specialIncomeAtThreshold *
  30 /
  100;

/* =======================================================
   FINAL THRESHOLD TAX
======================================================= */

const thresholdTax =
  Math.max(
    baseThresholdTax -
      specialIncomeTaxAtNormalRate +
      actualSpecialTaxAtThreshold,
    0
  );
  /* =======================================================
     PREVIOUS SURCHARGE RATE
     
     ₹1 CRORE THRESHOLD PAR
     PREVIOUS SURCHARGE = 0%
  ======================================================= */

  const previousSurchargeRate =
    Number(
      THRESHOLD_PREVIOUS_SURCHARGE_RATE[
        status
      ]?.[rangeKey]
    ) || 0;

  /* =======================================================
     THRESHOLD SURCHARGE
  ======================================================= */

  const thresholdSurcharge =
    thresholdTax *
    previousSurchargeRate /
    100;

  /* =======================================================
     CALCULATED THRESHOLD PAYABLE
  ======================================================= */

  const calculatedThresholdPayable =
    thresholdTax +
    thresholdSurcharge;

  /* =======================================================
     MANUAL THRESHOLD PAYABLE
  ======================================================= */

  const thresholdPayable =
    useManualThresholdPayable &&
    manualThresholdPayable !== ""
      ? toNumber(
          manualThresholdPayable
        )
      : calculatedThresholdPayable;

  /* =======================================================
     CURRENT SURCHARGE
  ======================================================= */

  const surchargeRate =
    Number(
      SURCHARGE_RULES[
        status
      ]?.[rangeKey]
    ) || 0;

  /* =======================================================
     SURCHARGE BEFORE MARGINAL RELIEF
  ======================================================= */

  const surchargeBeforeRelief =
    totalTax *
    surchargeRate /
    100;

  /* =======================================================
     TOTAL TAX WITH SURCHARGE
  ======================================================= */

  const totalTaxWithSurcharge =
    totalTax +
    surchargeBeforeRelief;

  /* =======================================================
     EXCESS INCOME
  ======================================================= */

  const excessIncome =
    Math.max(
      income -
      thresholdIncome,
      0
    );

  /* =======================================================
     TAX RATE ON EXCESS INCOME
     
     FIRM / LLP / LOCAL AUTHORITY
     = 30%
  ======================================================= */

  const excessIncomeTaxRate = 30;

  /* =======================================================
     TAX ON EXCESS INCOME
  ======================================================= */

  const taxOnExcessIncome =
    excessIncome *
    excessIncomeTaxRate /
    100;

  /* =======================================================
     ALLOWABLE NET SURCHARGE
  ======================================================= */

  const allowableNetSurcharge =
    Math.max(
      excessIncome -
      taxOnExcessIncome,
      0
    );

  /* =======================================================
     EXCESS TAX PAYABLE
     
     Actual tax + surcharge
     minus threshold payable
  ======================================================= */

  const excessTaxPayable =
    Math.max(
      totalTaxWithSurcharge -
      thresholdPayable,
      0
    );

  /* =======================================================
     MARGINAL RELIEF
     
     Additional tax payable should not exceed
     excess income over ₹1 crore.
  ======================================================= */

  let marginalRelief = Math.max(
    excessTaxPayable -
    excessIncome,
    0
  );

  /* =======================================================
     RELIEF CANNOT EXCEED
     SURCHARGE ACTUALLY LEVIED
  ======================================================= */

  marginalRelief =
    Math.min(
      marginalRelief,
      surchargeBeforeRelief
    );

  /* =======================================================
     FINAL SURCHARGE
  ======================================================= */

  const finalSurcharge =
    Math.max(
      surchargeBeforeRelief -
      marginalRelief,
      0
    );

  /* =======================================================
     FINAL TAX
     
     CESS INTENTIONALLY NOT INCLUDED
  ======================================================= */

  const totalTaxAfterMarginalRelief =
    totalTax +
    finalSurcharge;

  const finalTax =
    totalTaxAfterMarginalRelief;

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    /* Basic */

    totalIncome:
      income,

    rangeKey,

    /* Threshold */

    thresholdIncome,

    thresholdTax,

    thresholdSurcharge,

    thresholdPayable,

    /* Tax Components */

    normalTax:
      normalTaxAmount,

    tax111AAmount,

    tax112Amount,

    tax112AAmount,

    specialRateTax,

    totalTax,

    /* Surcharge */

    surchargeRate,

    previousSurchargeRate,

    surchargeBeforeRelief,

    /* Marginal Relief */

    excessIncome,

    taxOnExcessIncome,

    allowableNetSurcharge,

    excessTaxPayable,

    marginalRelief,

    isMarginalReliefApplicable:
      marginalRelief > 0,

    /* Final */

    finalSurcharge,

    totalTaxWithSurcharge,

    totalTaxAfterMarginalRelief,

    finalTax,
  };
}




export default function SurchargeMarginalReliefCalculatorCompany() {
  const navigate = useNavigate();

const [assessmentYear, setAssessmentYear] =
  useState("2026-27");

const [status, setStatus] =
  useState("firm_llp_local");

const [totalIncome, setTotalIncome] =
  useState("");

const [normalTax, setNormalTax] =
  useState("");

const [income111A, setIncome111A] =
  useState("");

const [income112, setIncome112] =
  useState("");

const [income112A, setIncome112A] =
  useState("");

const [useManualThresholdPayable, setUseManualThresholdPayable] =
  useState(false);

const [manualThresholdPayable, setManualThresholdPayable] =
  useState("");  

  const specialTax = useMemo(
  () =>
    calculateFirmLlpLocalSpecialRateTaxes({
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
/* =========================================================
   MAIN CALCULATION
========================================================= */

const calculation = useMemo(
  () =>
    calculateFirmLlpLocalMarginalRelief({
      ay: assessmentYear,

      status,

      totalIncome,

      normalTax,

      specialTax,

      useManualThresholdPayable,

      manualThresholdPayable,
    }),
  [
    assessmentYear,
    status,

    totalIncome,

    normalTax,

    specialTax,

    useManualThresholdPayable,

    manualThresholdPayable,
  ]
);


return (
   <>
    <style>
      {`
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .no-spinner {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}
    </style>

  <div
    style={{
      minHeight: "100vh",
      background: "#0b1224",
      padding: "28px",
      color: "#fff",
      fontFamily:
        "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}
  >
    {/* =====================================================
        BACK BUTTON
    ===================================================== */}

    <button
      type="button"
      onClick={() =>
        navigate(
          "/SurchargeMarginalReliefCalculatorStatusWise"
        )
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 18px",
        borderRadius: "10px",
        border: "1px solid #3b82f6",
        background: "#132b50",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        marginBottom: "22px",
      }}
    >
      ← Back
    </button>
      
    {/* =====================================================
        PAGE HEADER
    ===================================================== */}

    <div
      style={{
        marginBottom: "24px",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "30px",
          fontWeight: "800",
          color: "#ffffff",
        }}
      >
        Firm / LLP / Local Authority
      </h1>

      <p
        style={{
          marginTop: "7px",
          marginBottom: 0,
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        Surcharge & Marginal Relief Calculator
      </p>
    </div>

    {/* =====================================================
        MAIN TWO COLUMN LAYOUT
    ===================================================== */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(0, 2fr) minmax(360px, 1fr)",
        gap: "22px",
        alignItems: "start",
      }}
    >
      {/* ===================================================
          LEFT SIDE
      =================================================== */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* =================================================
            STEP 1 - BASIC SELECTION
        ================================================= */}

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #263552",
            borderRadius: "18px",
            padding: "26px",
          }}
        >
          {/* STEP HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "11px",
                background:
                  "linear-gradient(135deg, #2563eb, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "17px",
              }}
            >
              1
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  fontWeight: "800",
                  color: "#ffffff",
                }}
              >
                Basic Selection
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                Assessment year aur status select karein.
              </p>
            </div>
          </div>

          {/* INPUT GRID */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {/* ASSESSMENT YEAR */}

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#cbd5e1",
                }}
              >
                Assessment Year
              </label>

              <select
                value={assessmentYear}
                onChange={(e) =>
                  setAssessmentYear(e.target.value)
                }
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 14px",
                  borderRadius: "11px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="2026-27">
                  AY 2026-27
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#cbd5e1",
                }}
              >
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 14px",
                  borderRadius: "11px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="firm_llp_local">
                  Firm / LLP / Local Authority
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* =================================================
            STEP 2 - TOTAL INCOME
        ================================================= */}

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #263552",
            borderRadius: "18px",
            padding: "26px",
          }}
        >
          {/* STEP HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "11px",
                background:
                  "linear-gradient(135deg, #2563eb, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "17px",
              }}
            >
              2
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  fontWeight: "800",
                  color: "#ffffff",
                }}
              >
                Computation of Total Income
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                Total income aur normal tax enter karein.
              </p>
            </div>
          </div>

          {/* TOTAL INCOME + NORMAL TAX */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "18px",
              marginBottom: "20px",
            }}
          >
            {/* TOTAL INCOME */}

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#cbd5e1",
                }}
              >
                Total Income
              </label>

              <input
                type="number"
                className="no-spinner"
                min="0"
                value={totalIncome}
                onChange={(e) =>
                  setTotalIncome(e.target.value)
                }
                placeholder="Example: 1,20,00,000"
                style={{
                  width: "100%",
                  height: "48px",
                  boxSizing: "border-box",
                  padding: "0 14px",
                  borderRadius: "11px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {/* NORMAL TAX */}

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#cbd5e1",
                }}
              >
                Normal Tax
              </label>

              <input
                type="number"
                className="no-spinner"
                min="0"
                value={normalTax}
                onChange={(e) =>
                  setNormalTax(e.target.value)
                }
                placeholder="Enter normal tax"
                style={{
                  width: "100%",
                  height: "48px",
                  boxSizing: "border-box",
                  padding: "0 14px",
                  borderRadius: "11px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* =================================================
              SPECIAL RATE INCOME TABLE
          ================================================= */}

          <div
            style={{
              border: "1px solid #263552",
              borderRadius: "14px",
              overflow: "hidden",
              background: "#0b1224",
            }}
          >
            {/* TABLE HEADER */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 170px 110px",
                gap: "10px",
                padding: "14px 16px",
                background: "#13203a",
                borderBottom:
                  "1px solid #263552",
                fontSize: "12px",
                fontWeight: "800",
                color: "#94a3b8",
              }}
            >
              <div>Special Rate Income</div>
              <div style={{ textAlign: "right" }}>
                Income
              </div>
              <div style={{ textAlign: "right" }}>
                Tax
              </div>
            </div>

            {/* 111A */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 170px 110px",
                gap: "10px",
                alignItems: "center",
                padding: "15px 16px",
                borderBottom:
                  "1px solid #1e293b",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#ffffff",
                  }}
                >
                  Section 111A
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  Short-Term Capital Gain
                </div>
              </div>

              <input
                type="number"
                className="no-spinner"
                min="0"
                value={income111A}
                onChange={(e) =>
                  setIncome111A(e.target.value)
                }
                placeholder="0"
                style={{
                  width: "100%",
                  height: "38px",
                  boxSizing: "border-box",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  textAlign: "right",
                  outline: "none",
                }}
              />

              <div
                style={{
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#e2e8f0",
                }}
              >
                ₹
                {Number(
                  specialTax?.tax111A || 0
                ).toLocaleString("en-IN")}
              </div>
            </div>

            {/* 112 */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 170px 110px",
                gap: "10px",
                alignItems: "center",
                padding: "15px 16px",
                borderBottom:
                  "1px solid #1e293b",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#ffffff",
                  }}
                >
                  Section 112
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  Long-Term Capital Gain
                </div>
              </div>

              <input
                type="number"
                className="no-spinner"
                min="0"
                value={income112}
                onChange={(e) =>
                  setIncome112(e.target.value)
                }
                placeholder="0"
                style={{
                  width: "100%",
                  height: "38px",
                  boxSizing: "border-box",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  textAlign: "right",
                  outline: "none",
                }}
              />

              <div
                style={{
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#e2e8f0",
                }}
              >
                ₹
                {Number(
                  specialTax?.tax112 || 0
                ).toLocaleString("en-IN")}
              </div>
            </div>

            {/* 112A */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 170px 110px",
                gap: "10px",
                alignItems: "center",
                padding: "15px 16px",
                borderBottom:
                  "1px solid #1e293b",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#ffffff",
                  }}
                >
                  Section 112A
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  Eligible Long-Term Capital Gain
                </div>
              </div>

              <input
                type="number"
                className="no-spinner"
                min="0"
                value={income112A}
                onChange={(e) =>
                  setIncome112A(e.target.value)
                }
                placeholder="0"
                style={{
                  width: "100%",
                  height: "38px",
                  boxSizing: "border-box",
                  padding: "0 10px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  textAlign: "right",
                  outline: "none",
                }}
              />

              <div
                style={{
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#e2e8f0",
                }}
              >
                ₹
                {Number(
                  specialTax?.tax112A || 0
                ).toLocaleString("en-IN")}
              </div>
            </div>

            {/* TOTAL SPECIAL TAX */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr auto",
                gap: "15px",
                alignItems: "center",
                padding: "15px 16px",
                background: "#101d35",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#94a3b8",
                }}
              >
                Total Tax Before Surcharge
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  color: "#ffffff",
                }}
              >
                ₹
                {Number(
                  calculation?.totalTax || 0
                ).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            STEP 3 - THRESHOLD
        ================================================= */}

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #263552",
            borderRadius: "18px",
            padding: "26px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "11px",
                background:
                  "linear-gradient(135deg, #2563eb, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "17px",
              }}
            >
              3
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  fontWeight: "800",
                  color: "#ffffff",
                }}
              >
                Calculate Tax up to Threshold
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                ₹1 crore threshold par tax aur
                previous surcharge calculate hoga.
              </p>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #263552",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
                borderBottom:
                  "1px solid #263552",
              }}
            >
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                Total Income up to Threshold
              </span>

              <strong>
                ₹
                {Number(
                  calculation?.thresholdIncome || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
                borderBottom:
                  "1px solid #263552",
              }}
            >
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                Tax on Threshold Income
              </span>

              <strong>
                ₹
                {Number(
                  calculation?.thresholdTax || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
                borderBottom:
                  "1px solid #263552",
              }}
            >
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                Previous Slab Surcharge @{" "}
                {Number(
                  calculation?.previousSurchargeRate || 0
                )}
                %
              </span>

              <strong>
                ₹
                {Number(
                  calculation?.thresholdSurcharge || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div
              style={{
                margin: "12px",
                padding: "15px",
                borderRadius: "10px",
                background: "#132b50",
                border:
                  "1px solid #2563eb",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#dbeafe",
                }}
              >
                Tax Payable on Threshold including Surcharge
              </span>

              <strong>
                ₹
                {Number(
                  calculation?.thresholdPayable || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          {/* MANUAL OVERRIDE */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginTop: "17px",
              color: "#cbd5e1",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={
                useManualThresholdPayable
              }
              onChange={(e) =>
                setUseManualThresholdPayable(
                  e.target.checked
                )
              }
            />

            Threshold payable manually override karna hai
          </label>

          {useManualThresholdPayable && (
            <div style={{ marginTop: "14px" }}>
              <input
                type="number"
                min="0"
                value={manualThresholdPayable}
                onChange={(e) =>
                  setManualThresholdPayable(
                    e.target.value
                  )
                }
                placeholder="Enter threshold payable"
                style={{
                  width: "100%",
                  height: "45px",
                  boxSizing: "border-box",
                  padding: "0 13px",
                  borderRadius: "9px",
                  border:
                    "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                  outline: "none",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          RIGHT SIDE - FINAL OUTPUT
      =================================================== */}

      <div
        style={{
          background: "#0f172a",
          border: "1px solid #263552",
          borderRadius: "18px",
          padding: "22px",
          position: "sticky",
          top: "20px",
        }}
      >
        <div
          style={{
            color: "#38bdf8",
            fontSize: "13px",
            fontWeight: "900",
            letterSpacing: "0.5px",
          }}
        >
          FINAL OUTPUT
        </div>

        <h2
          style={{
            margin:
              "6px 0 20px",
            fontSize: "24px",
            fontWeight: "900",
          }}
        >
          Marginal Relief Result
        </h2>

        {/* SELECTED CASE */}

        <div
          style={{
            padding: "16px",
            borderRadius: "13px",
            background: "#132b50",
            border:
              "1px solid #2563eb",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              color: "#93c5fd",
              fontSize: "11px",
              fontWeight: "800",
              marginBottom: "5px",
            }}
          >
            SELECTED CASE
          </div>

          <div
            style={{
              fontSize: "17px",
              fontWeight: "900",
            }}
          >
            AY {assessmentYear}
            {" / "}
            Firm / LLP / Local Authority
          </div>
        </div>

        {/* CURRENT SURCHARGE */}

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#020617",
            border:
              "1px solid #263552",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Current Surcharge Rate
            </span>

            <strong>
              {Number(
                calculation?.surchargeRate || 0
              )}
              %
            </strong>
          </div>
        </div>

        {/* NORMAL TAX */}

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#020617",
            border:
              "1px solid #263552",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Normal / Other Tax
            </span>

            <strong>
              ₹
              {Number(
                calculation?.normalTax || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* SURCHARGE */}

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#020617",
            border:
              "1px solid #263552",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Surcharge Before Marginal Relief
            </span>

            <strong>
              ₹
              {Number(
                calculation?.surchargeBeforeRelief || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* TOTAL TAX WITH SURCHARGE */}

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#020617",
            border:
              "1px solid #263552",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Total Tax with Surcharge
            </span>

            <strong>
              ₹
              {Number(
                calculation?.totalTaxWithSurcharge || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* THRESHOLD PAYABLE */}

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#132b50",
            border:
              "1px solid #2563eb",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#93c5fd",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Threshold Tax Payable
            </span>

            <strong>
              ₹
              {Number(
                calculation?.thresholdPayable || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* EXCESS TAX PAYABLE */}

        <div
          style={{
            color: "#38bdf8",
            fontSize: "13px",
            fontWeight: "900",
            marginBottom: "10px",
          }}
        >
          EXCESS TAX PAYABLE
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#020617",
            border:
              "1px solid #263552",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Excess Income
            </span>

            <strong>
              ₹
              {Number(
                calculation?.excessIncome || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#020617",
            border:
              "1px solid #263552",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Tax on Excess Income
            </span>

            <strong>
              ₹
              {Number(
                calculation?.taxOnExcessIncome || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "#020617",
            border:
              "1px solid #263552",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Excess Tax Payable
            </span>

            <strong>
              ₹
              {Number(
                calculation?.excessTaxPayable || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* MARGINAL RELIEF */}

        <div
          style={{
            color: "#38bdf8",
            fontSize: "13px",
            fontWeight: "900",
            marginBottom: "10px",
          }}
        >
          MARGINAL RELIEF
        </div>

        <div
          style={{
            padding: "18px",
            borderRadius: "14px",
            background:
              calculation?.isMarginalReliefApplicable
                ? "#073b35"
                : "#1e293b",
            border:
              calculation?.isMarginalReliefApplicable
                ? "1px solid #059669"
                : "1px solid #334155",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <strong
              style={{
                fontSize: "14px",
              }}
            >
              {calculation?.isMarginalReliefApplicable
                ? "MMR Applicable"
                : "MMR Not Applicable"}
            </strong>

            <strong
              style={{
                fontSize: "18px",
              }}
            >
              ₹
              {Number(
                calculation?.marginalRelief || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* FINAL SURCHARGE */}

        <div
          style={{
            padding: "18px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, #2563eb, #0284c7)",
            marginTop: "12px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "800",
              color: "#dbeafe",
              marginBottom: "7px",
            }}
          >
            NET SURCHARGE AMOUNT
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "900",
            }}
          >
            ₹
            {Number(
              calculation?.finalSurcharge || 0
            ).toLocaleString("en-IN")}
          </div>

          <div
            style={{
              marginTop: "7px",
              fontSize: "11px",
              color: "#dbeafe",
              lineHeight: "1.5",
            }}
          >
            Net Surcharge = Surcharge Before
            Marginal Relief − Marginal Relief
          </div>
        </div>

        {/* TOTAL TAX AFTER RELIEF */}

        <div
          style={{
            padding: "22px",
            borderRadius: "14px",
            background: "#e0f2fe",
            color: "#0f172a",
            textAlign: "center",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "800",
              color: "#475569",
              marginBottom: "7px",
            }}
          >
            TOTAL TAX AFTER MARGINAL RELIEF
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "900",
              color: "#0f3b68",
            }}
          >
            ₹
            {Number(
              calculation?.totalTaxAfterMarginalRelief ||
                0
            ).toLocaleString("en-IN")}
          </div>
        </div>

        {/* RESET */}

        <button
          type="button"
          onClick={() => {
            setAssessmentYear("2026-27");
            setStatus("firm_llp_local");
            setTotalIncome("");
            setNormalTax("");
            setIncome111A("");
            setIncome112("");
            setIncome112A("");
            setUseManualThresholdPayable(false);
            setManualThresholdPayable("");
          }}
          style={{
            width: "100%",
            height: "46px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#132b50",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          Reset Calculator
        </button>
      </div>
    </div>

    
     </div>
  </>
);
}