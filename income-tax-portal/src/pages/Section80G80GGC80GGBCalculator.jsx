import React, { useMemo, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import SectionHeader from "../components/SectionHeader";
import { useNavigate } from "react-router-dom";
const MoneyInput = ({
  label,
  value,
  onChange,
  required = false,
}) => (
  <div className="s80g-field">
    <label>
      {label}
      {required && (
        <span className="s80g-required">*</span>
      )}
    </label>

    <div className="s80g-input-wrapper">
      <span className="s80g-rupee">₹</span>

      <input
        type="text"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => {
          const value = e.target.value;

          // Sirf digits allow karo
          if (/^\d*$/.test(value)) {
            onChange(value);
          }
        }}
        placeholder="Enter amount"
      />
    </div>
  </div>
);

 const DonationInput = ({
  value,
  onChange,
}) => (
  <div className="s80g-table-input">
    <span>₹</span>

    <input
      type="text"
      inputMode="numeric"
      value={value ?? ""}
      onChange={(e) => {
        const value = e.target.value;

        // Sirf digits allow karo
        if (/^\d*$/.test(value)) {
          onChange(value);
        }
      }}
      placeholder="0"
    />
  </div>
);


export default function Section80GCalculator() {
  const navigate = useNavigate();
  const [assessmentYear, setAssessmentYear] = useState("2026-27");

  const [income, setIncome] = useState({
    grossTotalIncome: "",
    deductions: "",
    ltcg: "",
    stcg111A: "",
    specifiedIncome: "",
  });

  const [donations, setDonations] = useState({
    unrestricted100: "",
    unrestricted50: "",
    restricted100: "",
    restricted50: "",
  });


  const num = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Math.max(0, Number(value) || 0));
  };

  const updateIncome = (field, value) => {
  setIncome((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  const updateDonation = (field, value) => {
  setDonations((prev) => ({
    ...prev,
    [field]: value,
  }));
};
  
  /* =====================================================
     ADJUSTED GROSS TOTAL INCOME
     ===================================================== */

  const adjustedGrossTotalIncome = useMemo(() => {
    const grossTotalIncome = num(income.grossTotalIncome);
    const deductions = num(income.deductions);
    const ltcg = num(income.ltcg);
    const stcg111A = num(income.stcg111A);
    const specifiedIncome = num(income.specifiedIncome);

    return Math.max(
      0,
      grossTotalIncome -
        deductions -
        ltcg -
        stcg111A -
        specifiedIncome
    );
  }, [income]);

  const restrictedLimit = adjustedGrossTotalIncome * 0.1;

  /* =====================================================
     80G DONATION CALCULATION
     ===================================================== */
const result = useMemo(() => {
  const unrestricted100 = num(donations.unrestricted100);
  const unrestricted50 = num(donations.unrestricted50);

  const restricted100 = num(donations.restricted100);
  const restricted50 = num(donations.restricted50);

  // -----------------------------------------
  // 1. Donations WITHOUT qualifying limit
  // -----------------------------------------
  const roundRupee = (value) =>
  Math.round(Number(value) || 0);

 const deduction100Unrestricted =
  roundRupee(unrestricted100);

  const deduction50Unrestricted =
    unrestricted50 * 0.50;

  // -----------------------------------------
  // 2. Donations SUBJECT TO qualifying limit
  // -----------------------------------------

  const totalRestrictedDonation =
    restricted100 + restricted50;

  const eligibleRestrictedDonation =
    Math.min(
      totalRestrictedDonation,
      restrictedLimit
    );

  // 100% restricted category
  const eligibleRestricted100 =
    Math.min(
      restricted100,
      eligibleRestrictedDonation
    );

  // Remaining qualifying limit
  const remainingRestrictedLimit =
    Math.max(
      0,
      eligibleRestrictedDonation -
        eligibleRestricted100
    );

  // 50% restricted category
  const eligibleRestricted50 =
    Math.min(
      restricted50,
      remainingRestrictedLimit
    );

  // -----------------------------------------
  // 3. Actual deduction
  // -----------------------------------------

 const deduction100Restricted =
  roundRupee(eligibleRestricted100);


 const deduction50Restricted =
  roundRupee(eligibleRestricted50 * 0.50);

  // -----------------------------------------
  // 4. Total deduction
  // -----------------------------------------

  const rawTotalDeduction =
    deduction100Unrestricted +
    deduction50Unrestricted +
    deduction100Restricted +
    deduction50Restricted;

  // Safety cap:
  // deduction cannot exceed Gross Total Income
  const totalDeduction = Math.min(
    rawTotalDeduction,
    num(income.grossTotalIncome)
  );

  return {
    unrestricted100,
    unrestricted50,
    restricted100,
    restricted50,

    totalRestrictedDonation,
    eligibleRestrictedDonation,

    eligibleRestricted100,
    eligibleRestricted50,

    deduction100Unrestricted,
    deduction50Unrestricted,
    deduction100Restricted,
    deduction50Restricted,

    rawTotalDeduction,
    totalDeduction: Math.max(
      0,
      totalDeduction
    ),
  };
}, [
  donations,
  restrictedLimit,
  income.grossTotalIncome,
]);
  /* =====================================================
     BUTTONS
     ===================================================== */

  

  const handleReset = () => {
    setAssessmentYear("2026-27");

    setIncome({
      grossTotalIncome: "",
      deductions: "",
      ltcg: "",
      stcg111A: "",
      specifiedIncome: "",
    });

    setDonations({
      unrestricted100: "",
      unrestricted50: "",
      restricted100: "",
      restricted50: "",
    });

  };

  /* =====================================================
     ICONS
     ===================================================== */

  const CalculatorIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="s80g-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h2" />
      <path d="M14 11h2" />
      <path d="M8 15h2" />
      <path d="M14 15h2" />
      <path d="M8 18h2" />
      <path d="M14 18h2" />
    </svg>
  );

  const MoneyIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="s80g-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4h12" />
      <path d="M6 8h12" />
      <path d="M8 4c4.8 0 7 1.7 7 4.5S12.8 13 8 13H6" />
      <path d="m8 13 8 7" />
    </svg>
  );

  const DonationIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="s80g-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12v7H4v-7" />
      <path d="M2 8h20v4H2z" />
      <path d="M12 8v11" />
      <path d="M12 8H7.5a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8Z" />
      <path d="M12 8h4.5a2.5 2.5 0 1 0 0-5C14 3 12 8 12 8Z" />
    </svg>
  );

  const ResultIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="s80g-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <path d="M17 7.5c0-1.7-1.9-3-5-3s-5 1.3-5 3 1.8 3 5 3 5 1.3 5 3-1.9 3-5 3-5-1.3-5-3" />
    </svg>
  );

  const ResetIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="s80g-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 5v5h5" />
    </svg>
  );

  const InfoIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="s80g-info-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );

  /* =====================================================
     SMALL COMPONENTS
     ===================================================== */

  const SectionTitle = ({
    icon,
    title,
    subtitle,
  }) => (
    <div className="s80g-section-heading">
      <div className="s80g-section-icon">
        {icon}
      </div>

      <div>
        <h2>{title}</h2>

        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );

 
  return (
    <>
      <style>{`

        /* =================================================
           PAGE
           ================================================= */

        .s80g-page {
          min-height: 100vh;
          color: #f8fafc;
        }

        .s80g-background {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at top left,
              rgba(37, 99, 235, 0.24),
              transparent 32%
            ),
            radial-gradient(
              circle at top right,
              rgba(14, 165, 233, 0.12),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #07111f 0%,
              #0a1220 45%,
              #050b16 100%
            );
        }

        .s80g-container {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
          padding: 24px 32px 40px;
        }

        /* =================================================
           HEADER
           ================================================= */

        .s80g-header {
          margin-top: 26px;
          margin-bottom: 28px;
        }

        /* =================================================
           MAIN GRID
           ================================================= */

        .s80g-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            390px;

          gap: 24px;
          align-items: start;
        }

        .s80g-left {
          min-width: 0;
        }

        .s80g-right {
          min-width: 0;

          position: sticky;
          top: 24px;
        }
       

        /* =================================================
           COMMON CARD
           ================================================= */

        .s80g-card,
        .s80g-result-card,
        .s80g-formula-card {
          border:
            1px solid rgba(71, 85, 105, 0.58);

          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.84),
              rgba(8, 15, 29, 0.76)
            );

          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.24);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          border-radius: 30px;
        }

        .s80g-left > .s80g-card {
          margin-bottom: 24px;
        }

        /* =================================================
           CARD HEADER
           ================================================= */

        .s80g-card-header {
          padding: 23px 26px;

          border-bottom:
            1px solid rgba(71, 85, 105, 0.52);
        }

        .s80g-card-body {
          padding: 26px;
        }

        /* =================================================
           SECTION HEADING
           ================================================= */

        .s80g-section-heading {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .s80g-section-icon {
          width: 44px;
          height: 44px;

          flex: 0 0 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          border:
            1px solid rgba(96, 165, 250, 0.22);

          background:
            rgba(37, 99, 235, 0.11);

          color: #60a5fa;
        }

        .s80g-icon {
          width: 21px;
          height: 21px;
        }

        .s80g-section-heading h2 {
          margin: 0;

          color: #f8fafc;

          font-size: 18px;
          line-height: 1.35;
          font-weight: 700;
        }

        .s80g-section-heading p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 12px;
          line-height: 1.5;
        }

        /* =================================================
           FORM
           ================================================= */

        .s80g-two-columns {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 22px;
        }

        .s80g-full {
          grid-column: 1 / -1;
        }

        .s80g-field {
          min-width: 0;
        }

        .s80g-field label {
          display: block;

          margin-bottom: 8px;

          color: #e2e8f0;

          font-size: 13px;
          line-height: 1.5;
          font-weight: 600;
        }

        .s80g-required {
          margin-left: 4px;
          color: #f87171;
        }

        .s80g-input-wrapper {
          position: relative;
        }

        .s80g-rupee {
          position: absolute;

          left: 15px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #64748b;

          font-size: 14px;

          pointer-events: none;
        }

        .s80g-field input,
        .s80g-field select {
          width: 100%;
          min-height: 48px;

          border:
            1px solid rgba(71, 85, 105, 0.75);

          border-radius: 13px;

          background:
            rgba(2, 8, 23, 0.68);

          color: #f8fafc;

          outline: none;

          font-size: 14px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .s80g-field input {
          padding:
            12px
            14px
            12px
            40px;
        }

        .s80g-field select {
          padding:
            12px 14px;
        }

        .s80g-field input::placeholder {
          color: #475569;
        }

        .s80g-field input:hover,
        .s80g-field select:hover {
          border-color:
            rgba(100, 116, 139, 0.9);
        }

        .s80g-field input:focus,
        .s80g-field select:focus {
          border-color: #3b82f6;

          box-shadow:
            0 0 0 3px
            rgba(59, 130, 246, 0.13);

          background:
            rgba(2, 8, 23, 0.86);
        }

        .s80g-field select:disabled {
          opacity: 0.78;
          cursor: not-allowed;
        }

        /* =================================================
           AGTI
           ================================================= */

        .s80g-agti {
          margin-top: 25px;

          padding: 20px;

          border:
            1px solid rgba(96, 165, 250, 0.20);

          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.14),
              rgba(14, 165, 233, 0.045)
            );
        }

        .s80g-agti-content {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .s80g-agti-label {
          display: block;

          color: #93c5fd;

          font-size: 11px;
          line-height: 1.4;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .s80g-agti-content p {
          margin: 5px 0 0;

          color: #64748b;

          font-size: 11px;
        }

        .s80g-agti-content strong {
          color: #ffffff;

          font-size: 26px;
          line-height: 1.2;
          font-weight: 800;

          white-space: nowrap;
        }

        .s80g-limit {
          display: flex;
          align-items: center;
          gap: 5px;

          margin-top: 13px;
          padding-top: 13px;

          border-top:
            1px solid rgba(71, 85, 105, 0.4);

          color: #94a3b8;

          font-size: 12px;
        }

        .s80g-limit strong {
          color: #cbd5e1;
        }

        /* =================================================
           DONATION TABLE
           ================================================= */

        .s80g-table-wrapper {
          width: 100%;

          overflow-x: auto;

          padding:
            4px 26px 0;
        }

        .s80g-table {
          width: 100%;
          min-width: 760px;

          border-collapse: collapse;
        }

        .s80g-table thead th {
          padding: 17px 14px;

          border-bottom:
            1px solid rgba(71, 85, 105, 0.65);

          color: #64748b;

          font-size: 10px;
          line-height: 1.4;
          font-weight: 700;

          text-align: left;

          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .s80g-table thead th:nth-child(2) {
          width: 220px;
        }

        .s80g-table thead th:nth-child(3) {
          width: 220px;

          text-align: right;
        }

        .s80g-table tbody tr {
          border-bottom:
            1px solid rgba(30, 41, 59, 0.9);
        }

        .s80g-table tbody tr:last-child {
          border-bottom: none;
        }

        .s80g-table td {
          padding: 20px 14px;
          vertical-align: middle;
        }

        .s80g-category-title {
          color: #f1f5f9;

          font-size: 13px;
          line-height: 1.55;
          font-weight: 600;
        }

        .s80g-category-description {
          margin-top: 4px;

          color: #64748b;

          font-size: 11px;
          line-height: 1.5;
        }

        .s80g-table-input {
          position: relative;
        }

        .s80g-table-input > span {
          position: absolute;

          left: 13px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #64748b;

          font-size: 13px;

          pointer-events: none;
        }

        .s80g-table-input input {
          width: 100%;
          height: 45px;

          padding:
            10px
            12px
            10px
            32px;

          border:
            1px solid rgba(71, 85, 105, 0.75);

          border-radius: 12px;

          background:
            rgba(2, 8, 23, 0.68);

          color: #f8fafc;

          outline: none;

          font-size: 13px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .s80g-table-input input::placeholder {
          color: #475569;
        }

        .s80g-table-input input:focus {
          border-color: #3b82f6;

          box-shadow:
            0 0 0 3px
            rgba(59, 130, 246, 0.13);
        }

        .s80g-deductible {
          color: #34d399;

          font-size: 14px;
          font-weight: 700;

          text-align: right;

          white-space: nowrap;
        }

        /* =================================================
           INFO
           ================================================= */

        .s80g-info-box {
          display: flex;
          align-items: flex-start;
          gap: 11px;

          margin:
            5px 26px 26px;

          padding: 14px 16px;

          border:
            1px solid rgba(251, 191, 36, 0.18);

          border-radius: 15px;

          background:
            rgba(251, 191, 36, 0.045);
        }

        .s80g-info-icon {
          width: 19px;
          height: 19px;

          flex: 0 0 19px;

          color: #fbbf24;
        }

        .s80g-info-box strong {
          display: block;

          color: #fcd34d;

          font-size: 12px;
        }

        .s80g-info-box p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;
          line-height: 1.55;
        }

        /* =================================================
           ACTION BUTTONS
           ================================================= */

        .s80g-actions {
          display: flex;
          gap: 13px;
        }

        .s80g-actions button {
          min-height: 50px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          padding:
            12px 25px;

          border-radius: 13px;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          transition:
            transform 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .s80g-actions button:hover {
          transform:
            translateY(-1px);
        }

        .s80g-actions button:active {
          transform:
            translateY(0);
        }

        .s80g-calculate-btn {
          flex: 1;

          border:
            1px solid rgba(59, 130, 246, 0.8);

          background: #2563eb;

          color: white;

          box-shadow:
            0 10px 28px
            rgba(37, 99, 235, 0.20);
        }

        .s80g-calculate-btn:hover {
          background: #3b82f6;
        }

        .s80g-reset-btn {
          flex: 1;

          border:
            1px solid rgba(71, 85, 105, 0.75);

          background:
            rgba(30, 41, 59, 0.72);

          color: #cbd5e1;
        }

        .s80g-reset-btn:hover {
          background:
            rgba(51, 65, 85, 0.8);

          border-color:
            rgba(100, 116, 139, 0.8);
        }

        /* =================================================
           RESULT
           ================================================= */

        .s80g-result-card {
          overflow: hidden;
        }

        .s80g-result-header {
          display: flex;
          align-items: center;
          gap: 13px;

          padding: 23px 22px;

          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.18),
              rgba(14, 165, 233, 0.045)
            );

          border-bottom:
            1px solid rgba(71, 85, 105, 0.48);
        }

        .s80g-result-icon-box {
          width: 48px;
          height: 48px;

          flex: 0 0 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 15px;

          border:
            1px solid rgba(96, 165, 250, 0.20);

          background:
            rgba(37, 99, 235, 0.11);

          color: #60a5fa;
        }

        .s80g-result-header > div:last-child {
          min-width: 0;
        }

        .s80g-result-header span {
          display: block;

          color: #93c5fd;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.15em;
        }

        .s80g-result-header h2 {
          margin: 5px 0 0;

          color: #f8fafc;

          font-size: 16px;
          line-height: 1.4;
          font-weight: 700;
        }

        .s80g-result-body {
          padding: 22px;
        }

        /* =================================================
           TOTAL BOX
           ================================================= */

        .s80g-total-box {
          padding:
            22px 18px;

          border:
            1px solid rgba(71, 85, 105, 0.55);

          border-radius: 19px;

          background:
            rgba(2, 8, 23, 0.5);

          text-align: center;
        }

        .s80g-total-box > span {
          display: block;

          color: #94a3b8;

          font-size: 12px;
        }

        .s80g-total-box > strong {
          display: block;

          margin-top: 9px;

          color: #ffffff;

          font-size: 32px;
          line-height: 1.2;
          font-weight: 800;

          overflow-wrap: anywhere;
        }

        .s80g-total-box > p {
          margin: 10px 0 0;

          color: #64748b;

          font-size: 11px;
          line-height: 1.5;
        }

        .s80g-completed {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          margin-top: 12px;
          padding: 6px 11px;

          border:
            1px solid rgba(52, 211, 153, 0.17);

          border-radius: 999px;

          background:
            rgba(52, 211, 153, 0.07);

          color: #6ee7b7;

          font-size: 10px;
          font-weight: 600;
        }

        .s80g-completed span {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #34d399;
        }

        /* =================================================
           BREAKDOWN
           ================================================= */

        .s80g-result-breakdown {
          margin-top: 19px;
        }

        .s80g-result-breakdown > div {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          padding: 13px 0;

          border-bottom:
            1px solid rgba(30, 41, 59, 0.95);
        }

        .s80g-result-breakdown > div:last-child {
          border-bottom: none;
        }

        .s80g-result-breakdown span {
          color: #94a3b8;

          font-size: 11px;
          line-height: 1.45;
        }

        .s80g-result-breakdown strong {
          color: #e2e8f0;

          font-size: 12px;
          font-weight: 700;

          text-align: right;

          white-space: nowrap;
        }

        /* =================================================
           FORMULA CARD
           ================================================= */

        .s80g-formula-card {
          margin-top: 20px;
          padding: 19px;
        }

        .s80g-formula-card > span {
          color: #64748b;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.13em;
        }

        .s80g-formula {
          margin-top: 12px;

          padding:
            13px 15px;

          border-radius: 13px;

          background:
            rgba(2, 8, 23, 0.56);
        }

        .s80g-formula p {
          margin: 0;

          color: #64748b;

          font-family: monospace;

          font-size: 10px;
          line-height: 1.9;
        }

        /* =================================================
           FOOTER
           ================================================= */

        .s80g-footer {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          margin-top: 32px;
          padding-top: 20px;

          border-top:
            1px solid rgba(30, 41, 59, 0.75);

          color: #475569;

          font-size: 10px;
        }

        .s80g-footer span {
          color: #334155;
        }

        /* =================================================
           RESPONSIVE
           ================================================= */

        @media (max-width: 1200px) {
          .s80g-layout {
            grid-template-columns:
              minmax(0, 1fr)
              350px;
          }

          .s80g-container {
            padding-left: 24px;
            padding-right: 24px;
          }
        }

        @media (max-width: 1024px) {
          .s80g-layout {
            grid-template-columns: 1fr;
          }

          .s80g-right {
            position: static;
          }
        }

        @media (max-width: 700px) {
          .s80g-container {
            padding:
              18px 14px 30px;
          }

          .s80g-header {
            margin-top: 20px;
            margin-bottom: 20px;
          }

          .s80g-card,
          .s80g-result-card,
          .s80g-formula-card {
            border-radius: 23px;
          }

          .s80g-card-header {
            padding: 19px;
          }

          .s80g-card-body {
            padding: 19px;
          }

          .s80g-two-columns {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .s80g-full {
            grid-column: auto;
          }

          .s80g-section-heading {
            align-items: flex-start;
          }

          .s80g-section-heading h2 {
            font-size: 16px;
          }

          .s80g-section-heading p {
            font-size: 11px;
          }

          .s80g-section-icon {
            width: 40px;
            height: 40px;
            flex-basis: 40px;
          }

          .s80g-agti-content {
            align-items: flex-start;
            flex-direction: column;
          }

          .s80g-agti-content strong {
            font-size: 23px;
          }

          .s80g-limit {
            align-items: flex-start;
            flex-direction: column;
            gap: 2px;
          }

          .s80g-table-wrapper {
            padding-left: 10px;
            padding-right: 10px;
          }

          .s80g-info-box {
            margin-left: 19px;
            margin-right: 19px;
          }

          .s80g-actions {
            flex-direction: column;
          }

          .s80g-actions button {
            width: 100%;
          }

          .s80g-result-header {
            padding: 20px;
          }

          .s80g-result-body {
            padding: 19px;
          }

          .s80g-total-box > strong {
            font-size: 28px;
          }
        }

        @media (max-width: 420px) {
          .s80g-container {
            padding-left: 10px;
            padding-right: 10px;
          }

          .s80g-card-header,
          .s80g-card-body {
            padding: 16px;
          }

          .s80g-section-heading {
            gap: 10px;
          }

          .s80g-section-icon {
            width: 37px;
            height: 37px;
            flex-basis: 37px;
          }

          .s80g-section-heading h2 {
            font-size: 15px;
          }

          .s80g-agti {
            padding: 16px;
          }

          .s80g-result-header {
            padding: 17px;
          }

          .s80g-result-body {
            padding: 16px;
          }

          .s80g-result-icon-box {
            width: 43px;
            height: 43px;
            flex-basis: 43px;
          }

          .s80g-result-header h2 {
            font-size: 14px;
          }

          .s80g-total-box {
            padding: 18px 13px;
          }

          .s80g-total-box > strong {
            font-size: 25px;
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

      <div className="s80g-page">
        <div className="s80g-background">

          

          <div className="s80g-container">
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
           

            <div className="s80g-layout">
              

              {/* =================================================
                  LEFT SIDE
                  ================================================= */}

              <main className="s80g-left">

                {/* BASIC DETAILS */}
                <section className="s80g-card">

                  <div className="s80g-card-header">
                    <SectionTitle
                      icon={<CalculatorIcon />}
                      title="Basic Details"
                      subtitle="Select assessment year and donation provision"
                    />
                  </div>

                  <div className="s80g-card-body">

                    <div className="s80g-two-columns">

                      <div className="s80g-field">
                        <label>
                          Assessment Year
                        </label>

                        <select
                          value={assessmentYear}
                          onChange={(e) => {
                            setAssessmentYear(
                              e.target.value
                            );

                            setCalculated(false);
                          }}
                        >
                          <option value="2026-27">
                            2026-27
                          </option>

                          <option value="2025-26">
                            2025-26
                          </option>

                          <option value="2024-25">
                            2024-25
                          </option>

                          <option value="2023-24">
                            2023-24
                          </option>
                        </select>
                      </div>

                      <div className="s80g-field">
                        <label>
                          Donation eligible for deduction under section
                        </label>

                        <select
                          value="80G"
                          disabled
                        >
                          <option value="80G">
                            80G
                          </option>
                        </select>
                      </div>

                    </div>

                  </div>
                </section>

                {/* =================================================
                    COMPUTATION
                    ================================================= */}

                <section className="s80g-card">

                  <div className="s80g-card-header">
                    <SectionTitle
                      icon={<MoneyIcon />}
                      title="Computation of deduction under section 80G"
                      subtitle="Enter the income details used for calculating adjusted gross total income"
                    />
                  </div>

                  <div className="s80g-card-body">

                    <div className="s80g-two-columns">

                      <MoneyInput
                        label="Gross Total Income"
                        required
                        value={
                          income.grossTotalIncome
                        }
                        onChange={(value) =>
                          updateIncome(
                            "grossTotalIncome",
                            value
                          )
                        }
                      />

                      <MoneyInput
                        label="Deduction under section 80C to 80U (other than section 80G)"
                        value={
                          income.deductions
                        }
                        onChange={(value) =>
                          updateIncome(
                            "deductions",
                            value
                          )
                        }
                      />

                      <MoneyInput
                        label="Long Term Capital Gains"
                        value={income.ltcg}
                        onChange={(value) =>
                          updateIncome(
                            "ltcg",
                            value
                          )
                        }
                      />

                      <MoneyInput
                        label="Short Term Capital Gains under section 111A"
                        value={
                          income.stcg111A
                        }
                        onChange={(value) =>
                          updateIncome(
                            "stcg111A",
                            value
                          )
                        }
                      />

                      <div className="s80g-full">

                        <MoneyInput
                          label="Other income of sections 115A, 115AB, 115AC, 115ACA, 115AD and 115D"
                          value={
                            income.specifiedIncome
                          }
                          onChange={(value) =>
                            updateIncome(
                              "specifiedIncome",
                              value
                            )
                          }
                        />

                      </div>

                    </div>

                    {/* AGTI */}
                    <div className="s80g-agti">

                      <div className="s80g-agti-content">

                        <div>
                          <span className="s80g-agti-label">
                            Adjusted Gross Total Income
                          </span>

                          <p>
                            Automatically calculated
                            from the above details
                          </p>
                        </div>

                        <strong>
                          ₹
                          {formatAmount(
                            adjustedGrossTotalIncome
                          )}
                        </strong>

                      </div>

                      <div className="s80g-limit">
                        <span>
                          10% of Adjusted Gross Total Income:
                        </span>

                        <strong>
                          ₹
                          {formatAmount(
                            restrictedLimit
                          )}
                        </strong>
                      </div>

                    </div>

                  </div>
                </section>

                {/* =================================================
                    DONATION DETAILS
                    ================================================= */}

                <section className="s80g-card">

                  <div className="s80g-card-header">
                    <SectionTitle
                      icon={<DonationIcon />}
                      title="Donation Details"
                      subtitle="Enter the gross amount under the applicable donation category"
                    />
                  </div>

                  <div className="s80g-table-wrapper">

                    <table className="s80g-table">

                      <thead>
                        <tr>
                          <th>
                            Donation Category
                          </th>

                          <th>
                            Gross Amount
                          </th>

                          <th>
                            Amount Deductible
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {/* 100% WITHOUT RESTRICTION */}
                        <tr>

                          <td>
                            <div className="s80g-category-title">
                              100% deduction without any restriction
                            </div>

                            <div className="s80g-category-description">
                              Entire eligible donation is deductible
                            </div>
                          </td>

                          <td>
                            <DonationInput
                              value={
                                donations.unrestricted100
                              }
                              onChange={(value) =>
                                updateDonation(
                                  "unrestricted100",
                                  value
                                )
                              }
                            />
                          </td>

                          <td className="s80g-deductible">
                            ₹
                            {formatAmount(
                              result.deduction100Unrestricted
                            )}
                          </td>

                        </tr>

                        {/* 50% WITHOUT RESTRICTION */}
                        <tr>

                          <td>
                            <div className="s80g-category-title">
                              50% deduction without any restriction
                            </div>

                            <div className="s80g-category-description">
                              50% of the eligible donation
                            </div>
                          </td>

                          <td>
                            <DonationInput
                              value={
                                donations.unrestricted50
                              }
                              onChange={(value) =>
                                updateDonation(
                                  "unrestricted50",
                                  value
                                )
                              }
                            />
                          </td>

                          <td className="s80g-deductible">
                            ₹
                            {formatAmount(
                              result.deduction50Unrestricted
                            )}
                          </td>

                        </tr>

                        {/* 100% WITH RESTRICTION */}
                        <tr>

                          <td>
                            <div className="s80g-category-title">
                              100% deduction with restricted to 10% of adjusted gross total income
                            </div>

                            <div className="s80g-category-description">
                              Subject to the 10% qualifying limit
                            </div>
                          </td>

                          <td>
                            <DonationInput
                              value={
                                donations.restricted100
                              }
                              onChange={(value) =>
                                updateDonation(
                                  "restricted100",
                                  value
                                )
                              }
                            />
                          </td>

                          <td className="s80g-deductible">
                            ₹
                            {formatAmount(
                              result.deduction100Restricted
                            )}
                          </td>

                        </tr>

                        {/* 50% WITH RESTRICTION */}
                        <tr>

                          <td>
                            <div className="s80g-category-title">
                              50% deduction with restricted to 10% of adjusted gross total income
                            </div>

                            <div className="s80g-category-description">
                              Subject to the 10% qualifying limit
                            </div>
                          </td>

                          <td>
                            <DonationInput
                              value={
                                donations.restricted50
                              }
                              onChange={(value) =>
                                updateDonation(
                                  "restricted50",
                                  value
                                )
                              }
                            />
                          </td>

                          <td className="s80g-deductible">
                            ₹
                            {formatAmount(
                              result.deduction50Restricted
                            )}
                          </td>

                        </tr>

                      </tbody>

                    </table>

                  </div>

                  {/* INFO */}
                  <div className="s80g-info-box">

                    <InfoIcon />

                    <div>

                      <strong>
                        10% restriction
                      </strong>

                      <p>
                        Donations falling under the
                        restricted categories are subject
                        to the 10% limit of Adjusted Gross
                        Total Income.
                      </p>

                    </div>

                  </div>

                </section>

                {/* =================================================
                    BUTTONS
                    ================================================= */}

                <div className="s80g-actions">

                  

                  <button
                    type="button"
                    className="s80g-reset-btn"
                    onClick={handleReset}
                  >
                    <ResetIcon />
                    Reset
                  </button>

                </div>

              </main>

              {/* =================================================
                  RIGHT SIDE RESULT
                  ================================================= */}

              <aside className="s80g-right">

                <div className="s80g-result-card">

                  <div className="s80g-result-header">

                    <div className="s80g-result-icon-box">
                      <ResultIcon />
                    </div>

                    <div>

                      <span>
                        RESULT
                      </span>

                      <h2>
                        Total deduction under section 80G
                      </h2>

                    </div>

                  </div>

                  <div className="s80g-result-body">

                    {/* TOTAL */}
                    <div className="s80g-total-box">

                      <span>
                        Total Deduction
                      </span>

                      <strong>
                        ₹
                       {formatAmount(result.totalDeduction)}
                      </strong>

                   

                    </div>

                    {/* BREAKDOWN */}
                    <div className="s80g-result-breakdown">

                      <div>
                        <span>
                          Adjusted Gross Total Income
                        </span>

                        <strong>
                          ₹
                          {formatAmount(
                            adjustedGrossTotalIncome
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          10% restricted limit
                        </span>

                        <strong>
                          ₹
                          {formatAmount(
                            restrictedLimit
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          100% unrestricted
                        </span>

                        <strong>
                          ₹
                          {formatAmount(
                            result.deduction100Unrestricted
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          50% unrestricted
                        </span>

                        <strong>
                          ₹
                          {formatAmount(
                            result.deduction50Unrestricted
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          100% restricted
                        </span>

                        <strong>
                          ₹
                          {formatAmount(
                            result.deduction100Restricted
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          50% restricted
                        </span>

                        <strong>
                          ₹
                          {formatAmount(
                            result.deduction50Restricted
                          )}
                        </strong>
                      </div>

                    </div>

                  </div>

                </div>

                {/* FORMULA */}
                <div className="s80g-formula-card">

                  <span>
                    CALCULATION FORMULA
                  </span>

                  <div className="s80g-formula">

                    <p>
                      Adjusted GTI = Gross Total Income
                    </p>

                    <p>
                      − 80C to 80U deductions
                    </p>

                    <p>
                      − Long Term Capital Gains
                    </p>

                    <p>
                      − STCG u/s 111A
                    </p>

                    <p>
                      − specified income
                    </p>

                  </div>

                </div>

              </aside>

            </div>

            {/* FOOTER */}
            <div className="s80g-footer">
              <span>
                Section 80G Deduction Calculator
              </span>

              <span>•</span>

              <span>
                Assessment Year {assessmentYear}
              </span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}