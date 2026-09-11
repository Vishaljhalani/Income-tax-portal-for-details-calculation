import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   CURRENT YEAR ONLY
========================================================= */

const CURRENT_AY = "2026-27";

/* =========================================================
   STATUS
========================================================= */

const STATUS = {
  value: "cooperative_society",
  label: "Co-operative Society",
};

/* =========================================================
   CO-OPERATIVE SOCIETY OPTIONS
========================================================= */

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
    taxRateLabel:
      "15% for manufacturing income, 22% for other income",
    thresholdTaxRate: 15,
    fixedSurchargeRate: 10,
    noMarginalRelief: true,
  },
];

/* =========================================================
   RANGE OPTIONS
========================================================= */

const RANGE_OPTIONS = {
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

/* =========================================================
   THRESHOLD TAX
   AY 2026-27

   1Cr threshold = 29,97,000
   10Cr threshold = 2,99,97,000
========================================================= */

const NON_INDIVIDUAL_THRESHOLD_TAX = {
  cooperative_society: {
    COOP_1CR: 2997000,
    COOP_10CR: 29997000,
  },
};

/* =========================================================
   SURCHARGE
========================================================= */

const SURCHARGE_RULES = {
  cooperative_society: {
    COOP_1CR: 7,
    COOP_10CR: 12,
  },
};

/* =========================================================
   PREVIOUS SLAB SURCHARGE
========================================================= */

const THRESHOLD_PREVIOUS_SURCHARGE_RATE = {
  cooperative_society: {
    COOP_1CR: 0,
    COOP_10CR: 7,
  },
};

/* =========================================================
   SPECIAL RATE RULES
   AY 2026-27
========================================================= */

const COOPERATIVE_SPECIAL_RATE_RULES = {
  "2026-27": {
    rate111A: 20,
    rate112: 12.5,
    rate112A: 12.5,

    // AY 2026-27
    exemption112A: 125000,
  },
};

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function getCooperativeSocietyOption(optionKey) {
  return (
    COOPERATIVE_SOCIETY_OPTIONS.find(
      (item) => item.value === optionKey
    ) || COOPERATIVE_SOCIETY_OPTIONS[0]
  );
}

function isCooperativeConcessionalRegime(optionKey) {
  return (
    optionKey === "section_115BAD" ||
    optionKey === "section_115BAE"
  );
}

function calculateCooperativeConcessionalTax({
  totalIncome,
  optionKey,
  manufacturingIncome = 0,
  otherIncome = 0,
  specialTax = {},
}) {
  const income = Math.max(
    toNumber(totalIncome),
    0
  );

  const specialRateTax =
    Number(specialTax?.totalSpecialRateTax) || 0;

  const specialIncome =
    (Number(specialTax?.income111A) || 0) +
    (Number(specialTax?.income112) || 0) +
    (Number(specialTax?.income112A) || 0);

  let normalIncome = Math.max(
    income - specialIncome,
    0
  );

  let incomeTax = 0;
  let manufacturingTax = 0;
  let otherIncomeTax = 0;
  let taxRate = 0;

  /* =======================================================
     SECTION 115BAD
     22% on normal income
  ======================================================= */

  if (optionKey === "section_115BAD") {
    taxRate = 22;

    incomeTax =
      normalIncome * 22 / 100;
  }

  /* =======================================================
     SECTION 115BAE
     15% Manufacturing
     22% Other Income
  ======================================================= */

  if (optionKey === "section_115BAE") {
    const manufacturing =
      Math.max(
        toNumber(manufacturingIncome),
        0
      );

    const other =
      Math.max(
        toNumber(otherIncome),
        0
      );

    manufacturingTax =
      manufacturing * 15 / 100;

    otherIncomeTax =
      other * 22 / 100;

    incomeTax =
      manufacturingTax +
      otherIncomeTax;
  }

  /* =======================================================
     TOTAL TAX BEFORE SURCHARGE

     IMPORTANT:
     Normal/concessional tax
     +
     Special-rate tax
  ======================================================= */

  const totalTax =
    incomeTax +
    specialRateTax;

  /* =======================================================
     SURCHARGE
  ======================================================= */

  const surchargeRate = 10;

  const surcharge =
    totalTax *
    surchargeRate /
    100;

  /* =======================================================
     TOTAL TAX WITH SURCHARGE
  ======================================================= */

  const taxWithSurcharge =
    totalTax +
    surcharge;

  /* =======================================================
     CESS
  ======================================================= */

  const cess =
    taxWithSurcharge *
    4 /
    100;

  const finalTax =
    taxWithSurcharge +
    cess;

  return {
    income,

    normalIncome,
    specialIncome,

    taxRate,

    manufacturingTax,
    otherIncomeTax,

    incomeTax,
    specialRateTax,

    totalTax,

    surchargeRate,
    surcharge,

    taxWithSurcharge,

    cess,
    finalTax,

    marginalRelief: 0,
    isMarginalReliefApplicable: false,
  };
}

function getRangeKeyForIncome(income) {
  const taxableIncome = Math.max(
    toNumber(income),
    0
  );

  if (taxableIncome > 100000000) {
    return "COOP_10CR";
  }

  if (taxableIncome > 10000000) {
    return "COOP_1CR";
  }

  return "";
}

function getSpecialRateRules() {
  return COOPERATIVE_SPECIAL_RATE_RULES[CURRENT_AY];
}

/* =========================================================
   SPECIAL RATE TAX CALCULATION
========================================================= */

function calculateCooperativeSpecialRateTaxes({
  income111A = 0,
  income112 = 0,
  income112A = 0,
}) {
  const rules = getSpecialRateRules();

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

  const taxable112AIncome = Math.max(
    gross112AIncome -
      Number(rules.exemption112A || 0),
    0
  );

  const tax111A =
    taxable111AIncome *
    Number(rules.rate111A || 0) /
    100;

  const tax112 =
    taxable112Income *
    Number(rules.rate112 || 0) /
    100;

  const tax112A =
    taxable112AIncome *
    Number(rules.rate112A || 0) /
    100;

  const totalSpecialRateTax =
  tax111A +
  tax112 +
  tax112A;


  return {
    income111A: taxable111AIncome,
    income112: taxable112Income,
    income112A: gross112AIncome,

    taxable111AIncome,
    taxable112Income,
    taxable112AIncome,

    tax111A,
    tax112,
    tax112A,

    exemption112A:
      Number(rules.exemption112A || 0),

    totalSpecialRateTax,
  };
}

/* =========================================================
   MAIN MARGINAL RELIEF CALCULATION
========================================================= */

function calculateCooperativeMarginalRelief({
  totalIncome,
  normalTax,
  manufacturingIncome,
  otherIncome,
  specialTax,
  cooperativeOption,

  useManualThresholdPayable = false,
  manualThresholdPayable = "",
}) {
  const income = Math.max(
    toNumber(totalIncome),
    0
  );

  const normalTaxEntered =
  String(normalTax ?? "").trim() !== "";

const normalTaxAmount =
  normalTaxEntered
    ? Math.max(
        toNumber(normalTax),
        0
      )
    : 0;

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

const totalTax =
  normalTaxAmount +
  specialRateTax;

  /* =======================================================
     SPECIAL RATE INCOME
  ======================================================= */

  const income111A =
    Number(
      specialTax?.income111A
    ) || 0;

  const income112 =
    Number(
      specialTax?.income112
    ) || 0;

  const income112A =
    Number(
      specialTax?.income112A
    ) || 0;

  const totalSpecialIncome =
    income111A +
    income112 +
    income112A;

    const calculatedOtherIncome =
  Math.max(
    income -
      toNumber(manufacturingIncome) -
      totalSpecialIncome,
    0
  );

  const isConcessional =
  isCooperativeConcessionalRegime(
    cooperativeOption
  );

if (isConcessional) {
 
  /* =====================================================
     CONCESSIONAL TAX
  ===================================================== */

  const concessionalTax =
    calculateCooperativeConcessionalTax({
      totalIncome: income,

      optionKey:
        cooperativeOption,

      manufacturingIncome,
      otherIncome:
  calculatedOtherIncome,
    });

  /* =====================================================
     NORMAL / CONCESSIONAL TAX

     115BAD:
     Special-rate income should NOT be taxed again
     at 22%.

     Therefore:
     Total Income - Special Rate Income
     = Normal Income

     115BAE:
     Manufacturing / Other income calculation will
     continue through concessionalTax.incomeTax.
  ===================================================== */
const concessionalNormalTax =
  normalTaxEntered
    ? normalTaxAmount
    : 0;

  /* =====================================================
     TOTAL TAX BEFORE SURCHARGE

     IMPORTANT:

     Concessional Normal Tax
     +
     Special Rate Tax
     =
     Total Tax
  ===================================================== */

const manufacturingTax =
  cooperativeOption === "section_115BAE"
    ? Number(
        concessionalTax.manufacturingTax
      ) || 0
    : 0;

const concessionalTotalTax =
  concessionalNormalTax +
  manufacturingTax +
  specialRateTax;

  /* =====================================================
     THRESHOLD

     DO NOT REMOVE THIS.

     Threshold remains visible/calculated even though
     Marginal Relief is NOT applicable for 115BAD/115BAE.
  ===================================================== */

  const thresholdIncome =
    10000000;

  const thresholdTax =
    thresholdIncome *
    concessionalTax.taxRate /
    100;

  const thresholdSurcharge =
    thresholdTax *
    concessionalTax.surchargeRate /
    100;

  const thresholdPayable =
    thresholdTax +
    thresholdSurcharge;

  /* =====================================================
     SURCHARGE

     115BAD / 115BAE = 10%
  ===================================================== */

  const surchargeRate =
    Number(
      concessionalTax.surchargeRate
    ) || 0;

  const surcharge =
  normalTaxEntered
    ? concessionalTotalTax *
      surchargeRate /
      100
    : 0;
  /* =====================================================
     TOTAL TAX WITH SURCHARGE
  ===================================================== */

  const totalTaxWithSurcharge =
  normalTaxEntered
    ? concessionalTotalTax +
      surcharge
    : 0;
  /* =====================================================
     CESS
  ===================================================== */

const cess =
  normalTaxEntered
    ? totalTaxWithSurcharge *
      4 /
      100
    : 0;
    
const finalTax =
  normalTaxEntered
    ? totalTaxWithSurcharge +
      cess
    : 0;
    
  /* =====================================================
     RETURN
  ===================================================== */

  return {
    totalIncome:
      income,

    optionKey:
      cooperativeOption,

    /* ============================
       THRESHOLD
    ============================ */

    thresholdIncome,

    thresholdTax,

    thresholdSurcharge,

    thresholdPayable,

    /* ============================
       NORMAL / CONCESSIONAL TAX
    ============================ */

    normalTax:
      concessionalNormalTax,

    /* ============================
       SPECIAL RATE TAX
    ============================ */

    tax111AAmount,

    tax112Amount,

    tax112AAmount,

    specialRateTax,

    /* ============================
       TOTAL TAX
    ============================ */

   totalTax:
  concessionalTotalTax,

    manufacturingIncome,

    otherIncome,

    /* ============================
       SURCHARGE
    ============================ */

    surchargeRate,

    previousSurchargeRate:
      0,

    surchargeBeforeRelief:
      surcharge,

    /* ============================
       MARGINAL RELIEF
       NOT APPLICABLE
    ============================ */

    excessIncome:
      0,

    taxOnExcessIncome:
      0,

    allowableNetSurcharge:
      0,

    excessTaxPayable:
      0,

    marginalRelief:
      0,

    isMarginalReliefApplicable:
      false,

    /* ============================
       FINAL SURCHARGE
    ============================ */

    finalSurcharge:
      surcharge,

    /* ============================
       TOTAL TAX WITH SURCHARGE
    ============================ */

    totalTaxWithSurcharge,

    totalTaxAfterMarginalRelief:
      totalTaxWithSurcharge,

    /* ============================
       CESS
    ============================ */

    cess,

    finalTax,

    noMarginalRelief:
      true,
  };
}
  /* =======================================================
     RANGE
  ======================================================= */

  const rangeKey =
    getRangeKeyForIncome(income);

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

      noMarginalRelief: false,
    };
  }

  /* =======================================================
     SELECTED RANGE
  ======================================================= */

  const selectedRange =
    RANGE_OPTIONS.cooperative_society.find(
      (item) =>
        item.key === rangeKey
    );

  const thresholdIncome =
    Number(
      selectedRange?.thresholdIncome
    ) || 0;

  /* =======================================================
     BASE THRESHOLD TAX
  ======================================================= */

  const baseThresholdTax =
    Number(
      NON_INDIVIDUAL_THRESHOLD_TAX
        .cooperative_society?.[rangeKey]
    ) || 0;

  /* =======================================================
     SPECIAL INCOME AT NORMAL RATE

     Special-rate income ko threshold
     comparison ke liye 30% par calculate.
  ======================================================= */

  const specialIncomeTaxAtNormalRate =
    totalSpecialIncome *
    30 /
    100;

  /* =======================================================
     NORMAL TAX UP TO THRESHOLD

     IMPORTANT:
     Special income ka actual special-rate tax
     threshold tax mein ADD kiya jayega.

     Pehle normal-rate equivalent ko remove
     karne ke baad actual special tax add.
  ======================================================= */

  const normalThresholdTax =
    Math.max(
      baseThresholdTax -
        specialIncomeTaxAtNormalRate,
      0
    );

  const specialThresholdTax =
    specialRateTax;

  const thresholdTax =
    normalThresholdTax +
    specialThresholdTax;

  /* =======================================================
     PREVIOUS SURCHARGE
  ======================================================= */

  const previousSurchargeRate =
    Number(
      THRESHOLD_PREVIOUS_SURCHARGE_RATE
        .cooperative_society?.[rangeKey]
    ) || 0;

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
      SURCHARGE_RULES
        .cooperative_society?.[rangeKey]
    ) || 0;

  /* =======================================================
     SURCHARGE BEFORE RELIEF
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
     TAX ON EXCESS INCOME

     Co-operative Society normal rate
     assumed 30%.
  ======================================================= */

  const excessIncomeTaxRate = 30;

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
  ======================================================= */

  const excessTaxPayable =
    Math.max(
      totalTaxWithSurcharge -
        thresholdPayable,
      0
    );

  /* =======================================================
     MARGINAL RELIEF
  ======================================================= */

  let marginalRelief =
    Math.max(
      excessTaxPayable -
        excessIncome,
      0
    );

  /* =======================================================
     RELIEF CANNOT EXCEED SURCHARGE
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
  ======================================================= */

  const totalTaxAfterMarginalRelief =
    totalTax +
    finalSurcharge;

  const finalTax =
    totalTaxAfterMarginalRelief;

  return {
    totalIncome: income,

    rangeKey,

    thresholdIncome,

    thresholdTax,
    thresholdSurcharge,
    thresholdPayable,

    normalTax:
      normalTaxAmount,

    tax111AAmount,
    tax112Amount,
    tax112AAmount,

    specialRateTax,

    totalTax,

    surchargeRate,
    previousSurchargeRate,

    surchargeBeforeRelief,

    excessIncome,

    taxOnExcessIncome,

    allowableNetSurcharge,

    excessTaxPayable,

    marginalRelief,

    isMarginalReliefApplicable:
      marginalRelief > 0,

    finalSurcharge,

    totalTaxWithSurcharge,

    totalTaxAfterMarginalRelief,

    finalTax,

    noMarginalRelief: false,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function
SurchargeMarginalReliefCooperativeSociety() {
  const navigate = useNavigate();

  /* =======================================================
     STATES
  ======================================================= */

  const [cooperativeOption, setCooperativeOption] =
    useState(
      "normal_cooperative_society"
    );

  const [totalIncome, setTotalIncome] =
    useState("");

  const [normalTax, setNormalTax] =
    useState("");

  const [manufacturingIncome, setManufacturingIncome] =
  useState("");

  

  const [otherIncome, setOtherIncome] =
  useState("");

  const [income111A, setIncome111A] =
    useState("");

  const [income112, setIncome112] =
    useState("");

  const [income112A, setIncome112A] =
    useState("");

  const [
    useManualThresholdPayable,
    setUseManualThresholdPayable,
  ] = useState(false);

  const [
    manualThresholdPayable,
    setManualThresholdPayable,
  ] = useState("");

  /* =========================================================
     SPECIAL TAX
  ========================================================= */

  const specialTax = useMemo(
    () =>
      calculateCooperativeSpecialRateTaxes({
        income111A,
        income112,
        income112A,
      }),
    [
      income111A,
      income112,
      income112A,
    ]
  );

  /* =========================================================
     MAIN CALCULATION
  ========================================================= */
  const numericTotalIncome =
  Math.max(
    toNumber(totalIncome),
    0
  );

const numericManufacturingIncome =
  Math.max(
    toNumber(manufacturingIncome),
    0
  );

const numericIncome111A =
  Math.max(
    toNumber(income111A),
    0
  );

const numericIncome112 =
  Math.max(
    toNumber(income112),
    0
  );

const numericIncome112A =
  Math.max(
    toNumber(income112A),
    0
  );

const calculatedOtherIncome =
  Math.max(
    numericTotalIncome -
      numericManufacturingIncome -
      numericIncome111A -
      numericIncome112 -
      numericIncome112A,
    0
  );

  const calculation = useMemo(
  () =>
    calculateCooperativeMarginalRelief({
      totalIncome,
      normalTax,
      manufacturingIncome,
      otherIncome: calculatedOtherIncome,
      specialTax,
      cooperativeOption,
      useManualThresholdPayable,
      manualThresholdPayable,
    }),
  [
    totalIncome,
    normalTax,
    specialTax,
    manufacturingIncome,
    calculatedOtherIncome,
    cooperativeOption,
    useManualThresholdPayable,
    manualThresholdPayable,
  ]
);

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setCooperativeOption(
      "normal_cooperative_society"
    );

    setTotalIncome("");
    setNormalTax("");

    setIncome111A("");
    setIncome112("");
    setIncome112A("");

    setUseManualThresholdPayable(false);
    setManualThresholdPayable("");
  };

   return (
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

    <style>
      {`
        input.no-spinner::-webkit-outer-spin-button,
        input.no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input.no-spinner {
          -moz-appearance: textfield;
        }
      `}
    </style>

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
        color: "#fff",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        marginBottom: "22px",
      }}
    >
      ← Back
    </button>

    {/* =====================================================
        HEADER
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
          color: "#fff",
        }}
      >
        Co-operative Society
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
          TWO COLUMN LAYOUT
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
            LEFT
        =================================================== */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* =================================================
              STEP 1
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
                  Assessment year aur tax option select karein.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              {/* AY */}

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

                <input
                  type="text"
                  value={`AY ${CURRENT_AY}`}
                  readOnly
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing: "border-box",
                    padding: "0 14px",
                    borderRadius: "11px",
                    border:
                      "1px solid #334155",
                    background: "#020617",
                    color: "#94a3b8",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* OPTION */}

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
                  Tax Option
                </label>

                <select
                  value={cooperativeOption}
                  onChange={(e) =>
                    setCooperativeOption(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 14px",
                    borderRadius: "11px",
                    border:
                      "1px solid #334155",
                    background: "#020617",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  {COOPERATIVE_SOCIETY_OPTIONS.map(
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
            </div>

            {/* OPTION INFO */}

            <div
              style={{
                marginTop: "18px",
                padding: "13px 15px",
                borderRadius: "10px",
                background: "#13203a",
                border:
                  "1px solid #263552",
                color: "#94a3b8",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            >
              <strong
                style={{
                  color: "#dbeafe",
                }}
              >
                Selected:
              </strong>{" "}
              {getCooperativeSocietyOption(
                cooperativeOption
              ).label}
              {" — "}
              {
                getCooperativeSocietyOption(
                  cooperativeOption
                ).taxRateLabel
              }
            </div>
          </div>

          {/* =================================================
              STEP 2
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
                  Total income, normal tax aur special-rate income enter karein.
                </p>
              </div>
            </div>

            {/* TOTAL + NORMAL TAX */}

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
                    setTotalIncome(
                      e.target.value
                    )
                  }
                  placeholder="Example: 1,20,00,000"
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing: "border-box",
                    padding: "0 14px",
                    borderRadius: "11px",
                    border:
                      "1px solid #334155",
                    background: "#020617",
                    color: "#fff",
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
                    setNormalTax(
                      e.target.value
                    )
                  }
                  placeholder="Enter normal tax"
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing: "border-box",
                    padding: "0 14px",
                    borderRadius: "11px",
                    border:
                      "1px solid #334155",
                    background: "#020617",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* SPECIAL RATE TABLE */}

            <div
              style={{
                border:
                  "1px solid #263552",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#0b1224",
              }}
            >
              {/* HEADER */}

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
                <div>
                  Special Rate Income
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  Income
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  Tax
                </div>
              </div>

              {/* =================================================
    115BAE - MANUFACTURING / OTHER INCOME
================================================= */}

{cooperativeOption === "section_115BAE" && (
  <div
    style={{
      marginTop: "20px",
      padding: "18px",
      borderRadius: "14px",
      border: "1px solid #263552",
      background: "#0b1224",
    }}
  >
    <div
      style={{
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: "800",
          color: "#ffffff",
        }}
      >
        Section 115BAE Income Break-up
      </div>

      <div
        style={{
          marginTop: "4px",
          fontSize: "11px",
          color: "#64748b",
        }}
      >
        Manufacturing income @ 15% and other income @ 22%
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(2, minmax(0, 1fr))",
        gap: "18px",
      }}
    >
      {/* MANUFACTURING INCOME */}

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
          Manufacturing Income
        </label>

        <input
          type="number"
          className="no-spinner"
          min="0"
          value={manufacturingIncome}
          onChange={(e) =>
            setManufacturingIncome(
              e.target.value
            )
          }
          placeholder="Enter manufacturing income"
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

      {/* OTHER INCOME */}

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
    Other Income
  </label>

  <div
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
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <span>
      ₹{Number(calculatedOtherIncome || 0).toLocaleString("en-IN")}
    </span>

    <span
      style={{
        fontSize: "11px",
        color: "#60a5fa",
        fontWeight: "600",
      }}
    >
      Auto Calculated
    </span>
  </div>
</div>
    </div>
  </div>
)}

              {/* =================================================
                  111A
              ================================================= */}

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
                    setIncome111A(
                      e.target.value
                    )
                  }
                  placeholder="0"
                  style={{
                    width: "100%",
                    height: "38px",
                    boxSizing: "border-box",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border:
                      "1px solid #334155",
                    background: "#020617",
                    color: "#fff",
                    textAlign: "right",
                    outline: "none",
                  }}
                />

                <div
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    fontWeight: "800",
                  }}
                >
                  ₹
                  {Number(
                    specialTax?.tax111A || 0
                  ).toLocaleString("en-IN")}
                </div>
              </div>

              {/* =================================================
                  112
              ================================================= */}

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
                    setIncome112(
                      e.target.value
                    )
                  }
                  placeholder="0"
                  style={{
                    width: "100%",
                    height: "38px",
                    boxSizing: "border-box",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border:
                      "1px solid #334155",
                    background: "#020617",
                    color: "#fff",
                    textAlign: "right",
                    outline: "none",
                  }}
                />

                <div
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    fontWeight: "800",
                  }}
                >
                  ₹
                  {Number(
                    specialTax?.tax112 || 0
                  ).toLocaleString("en-IN")}
                </div>
              </div>

              {/* =================================================
                  112A
              ================================================= */}

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
                    setIncome112A(
                      e.target.value
                    )
                  }
                  placeholder="0"
                  style={{
                    width: "100%",
                    height: "38px",
                    boxSizing: "border-box",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border:
                      "1px solid #334155",
                    background: "#020617",
                    color: "#fff",
                    textAlign: "right",
                    outline: "none",
                  }}
                />

                <div
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    fontWeight: "800",
                  }}
                >
                  ₹
                  {Number(
                    specialTax?.tax112A || 0
                  ).toLocaleString("en-IN")}
                </div>
              </div>

              {/* 112A EXEMPTION INFO */}

              <div
                style={{
                  padding:
                    "11px 16px",
                  background: "#0f1b30",
                  color: "#94a3b8",
                  fontSize: "11px",
                }}
              >
                Section 112A exemption considered:
                <strong
                  style={{
                    color: "#dbeafe",
                    marginLeft: "5px",
                  }}
                >
                  ₹
                  {Number(
                    specialTax?.exemption112A ||
                      0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              {/* TOTAL */}

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
                  }}
                >
                  ₹
                  {Number(
                    calculation?.totalTax ||
                      0
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
                  Threshold par tax aur previous surcharge calculate hoga.
                </p>
              </div>
            </div>

            <div
              style={{
                border:
                  "1px solid #263552",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {/* THRESHOLD */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
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
                    calculation?.thresholdIncome ||
                      0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              {/* THRESHOLD TAX */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
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
                    calculation?.thresholdTax ||
                      0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              {/* PREVIOUS SURCHARGE */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
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
                    calculation?.previousSurchargeRate ||
                      0
                  )}
                  %
                </span>

                <strong>
                  ₹
                  {Number(
                    calculation?.thresholdSurcharge ||
                      0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              {/* THRESHOLD PAYABLE */}

              <div
                style={{
                  margin: "12px",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#132b50",
                  border:
                    "1px solid #2563eb",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "15px",
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
                    calculation?.thresholdPayable ||
                      0
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
              <div
                style={{
                  marginTop: "14px",
                }}
              >
                <input
                  type="number"
                  className="no-spinner"
                  min="0"
                  value={
                    manualThresholdPayable
                  }
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
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE
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
              margin: "6px 0 20px",
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
                fontSize: "16px",
                fontWeight: "900",
                lineHeight: "1.5",
              }}
            >
              AY {CURRENT_AY}
              {" / "}
              Co-operative Society
            </div>

            <div
              style={{
                marginTop: "5px",
                fontSize: "11px",
                color: "#93c5fd",
              }}
            >
              {
                getCooperativeSocietyOption(
                  cooperativeOption
                ).label
              }
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
                justifyContent:
                  "space-between",
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
                  calculation?.surchargeRate ||
                    0
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
                justifyContent:
                  "space-between",
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
                  calculation?.normalTax ||
                    0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          {/* SPECIAL TAX */}

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
                justifyContent:
                  "space-between",
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
                Special Rate Tax
              </span>

              <strong>
                ₹
                {Number(
                  calculation?.specialRateTax ||
                    0
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
                justifyContent:
                  "space-between",
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
                  calculation?.surchargeBeforeRelief ||
                    0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          {/* TOTAL WITH SURCHARGE */}

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
                justifyContent:
                  "space-between",
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
                    calculation?.totalTaxWithSurcharge ||
                      0
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
                justifyContent:
                  "space-between",
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
                  calculation?.thresholdPayable ||
                    0
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

          {/* EXCESS INCOME */}

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
                justifyContent:
                  "space-between",
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
                  calculation?.excessIncome ||
                    0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          {/* TAX ON EXCESS */}

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
                justifyContent:
                  "space-between",
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
                  calculation?.taxOnExcessIncome ||
                    0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          {/* EXCESS TAX PAYABLE */}

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
                justifyContent:
                  "space-between",
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
                  calculation?.excessTaxPayable ||
                    0
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
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <strong
                style={{
                  fontSize: "14px",
                }}
              >
                {calculation?.noMarginalRelief
                  ? "MMR Not Available"
                  : calculation?.isMarginalReliefApplicable
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
                  calculation?.marginalRelief ||
                    0
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
                calculation?.finalSurcharge ||
                  0
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

          {/* TOTAL TAX */}

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
            onClick={handleReset}
            style={{
              width: "100%",
              height: "46px",
              borderRadius: "10px",
              border:
                "1px solid #334155",
              background: "#132b50",
              color: "#fff",
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
  );
}