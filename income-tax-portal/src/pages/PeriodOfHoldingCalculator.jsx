import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function PeriodOfHoldingCalculator() {
  const navigate = useNavigate();
  const initialState = {
    assessmentYear: "",
    assetType: "",
    listed: "",
    purchaseDate: "",
    transferDate: "",
  };

  const [form, setForm] = useState(initialState);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =====================================
  // EXACT CALENDAR DIFFERENCE FUNCTION
  // =====================================
  const calculateExactHolding = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // Day adjustment
    if (days < 0) {
      months--;

      const previousMonthDays = new Date(
        end.getFullYear(),
        end.getMonth(),
        0
      ).getDate();

      days += previousMonthDays;
    }

    // Month adjustment
    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      years,
      months,
      days,
      totalMonths: years * 12 + months,
    };
  };

  // =====================================
  // MAIN CALCULATION
  // =====================================
  const result = useMemo(() => {
    let warnings = [];

    if (
      !form.assessmentYear ||
      !form.assetType ||
      !form.purchaseDate ||
      !form.transferDate
    ) {
      return {
        holdingPeriod: "-",
        capitalAssetType: "-",
        warnings,
      };
    }

    const purchaseDate = new Date(form.purchaseDate);
    const transferDate = new Date(form.transferDate);

    if (
  isNaN(purchaseDate.getTime()) ||
  isNaN(transferDate.getTime())
) {
  warnings.push("Invalid date selected");

  return {
    holdingPeriod: "-",
    capitalAssetType: "-",
    warnings,
  };
}

    // =========================
    // DATE VALIDATION
    // =========================
    if (transferDate < purchaseDate) {
      warnings.push(
        "Date of Transfer cannot be earlier than Date of Purchase"
      );

      return {
        holdingPeriod: "-",
        capitalAssetType: "-",
        warnings,
      };
    }

    // =========================
    // AY VALIDATION
    // =========================
    const ayStart = parseInt(
      form.assessmentYear.split("-")[0]
    );

    const fyStart = new Date(`${ayStart - 1}-04-01`);
    const fyEnd = new Date(`${ayStart}-03-31`);

    if (
      transferDate < fyStart ||
      transferDate > fyEnd
    ) {
      warnings.push(
        "Transfer Date must fall within selected Assessment Year"
      );
    }

    // =====================================
    // EXACT HOLDING CALCULATION
    // =====================================
    const holdingData = calculateExactHolding(
      purchaseDate,
      transferDate
    );

    const years = holdingData.years;
    const months = holdingData.months;
    const totalMonths = holdingData.totalMonths;

    // =====================================
    // DEPARTMENT STYLE DISPLAY
    // =====================================
    const holdingPeriod = `More than ${years} Year${
  years !== 1 ? "s" : ""
} ${months} Month${
  months !== 1 ? "s" : ""
}`;

    // =====================================
    // THRESHOLD LOGIC
    // =====================================
    let threshold = 0;

    const ay = form.assessmentYear;
    const listed = form.listed || "No";

    // Immovable Property
    if (
      form.assetType ===
      "Immovable property (Being land and building or both)"
    ) {
      threshold = 24;
    }

    // Equity Shares
    else if (
      form.assetType ===
      "Equity share or preference share of a company"
    ) {
      threshold =
        listed === "Yes" ? 12 : 24;
    }

    // Equity Oriented MF
    else if (
      form.assetType ===
      "Units of Equity Oriented Mutual Fund"
    ) {
      threshold = 12;
    }

    // UTI
    else if (
      form.assetType === "Units of UTI"
    ) {
      threshold = 12;
    }

    // Zero Coupon Bonds
    else if (
      form.assetType === "Zero Coupon Bonds"
    ) {
      threshold = 12;
    }

    // Other Units
    else if (
      form.assetType === "Other units"
    ) {
      if (
        ay === "2025-26" ||
        ay === "2026-27"
      ) {
        threshold =
          listed === "Yes" ? 12 : 24;
      } else {
        threshold = 36;
      }
    }

    // Other Securities
    else if (
      form.assetType === "Other securities"
    ) {
      if (
        ay === "2025-26" ||
        ay === "2026-27"
      ) {
        threshold =
          listed === "Yes" ? 12 : 24;
      } else {
        threshold =
          listed === "Yes" ? 12 : 36;
      }
    }

    // Other Capital Assets
    else if (
      form.assetType ===
      "Other Capital Assets"
    ) {
      threshold =
        ay === "2025-26" ||
        ay === "2026-27"
          ? 24
          : 36;
    }

    // =====================================
    // FINAL RESULT
    // =====================================
    const capitalAssetType =
      totalMonths >= threshold
        ? "Long Term Capital Asset"
        : "Short Term Capital Asset";

    return {
      holdingPeriod,
      capitalAssetType,
      warnings,
    };
  }, [form]);

  // =====================================
  // SHOW LISTED FIELD
  // =====================================
  const showListedField = [
    "Equity share or preference share of a company",
    "Other units",
    "Other securities",
  ].includes(form.assetType);

   return (
  <div className="poh-modern-page">
    <div className="poh-modern-container">
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
      <div className="poh-modern-header">
        <div>
          <p className="poh-modern-kicker">Capital Gain Utility</p>
          <h1>Period of Holding Calculator</h1>
          <p>
            Determine whether the capital asset is Short Term or Long Term based on holding period.
          </p>
        </div>

        <div className="poh-modern-badge">
          <span>Assessment Year</span>
          <strong>{form.assessmentYear || "Not Selected"}</strong>
        </div>
      </div>

      <div className="poh-modern-grid">

        {/* LEFT FORM */}
        <div className="poh-modern-card">
          <div className="poh-section-title">
            <h2>Asset Details</h2>
            <p>Fill purchase, transfer and asset details for holding period calculation</p>
          </div>

          <div className="poh-form-grid">

            {/* AY */}
            <div className="poh-field">
              <label>Assessment Year <span>*</span></label>
              <select
                value={form.assessmentYear}
                onChange={(e) =>
                  updateField("assessmentYear", e.target.value)
                }
              >
                <option value="">Select Year</option>

                {[
                  "2017-18",
                  "2018-19",
                  "2019-20",
                  "2020-21",
                  "2021-22",
                  "2022-23",
                  "2023-24",
                  "2024-25",
                  "2025-26",
                  "2026-27",
                ].map((ay) => (
                  <option key={ay} value={ay}>
                    {ay}
                  </option>
                ))}
              </select>
            </div>

            {/* ASSET TYPE */}
            <div className="poh-field">
              <label>Type of Asset <span>*</span></label>
              <select
                value={form.assetType}
                onChange={(e) =>
                  updateField("assetType", e.target.value)
                }
              >
                <option value="">Select Asset Type</option>

                <option>
                  Immovable property (Being land and building or both)
                </option>

                <option>
                  Equity share or preference share of a company
                </option>

                <option>
                  Units of Equity Oriented Mutual Fund
                </option>

                <option>
                  Units of UTI
                </option>

                <option>
                  Zero Coupon Bonds
                </option>

                <option>
                  Other units
                </option>

                <option>
                  Other securities
                </option>

                <option>
                  Other Capital Assets
                </option>
              </select>
            </div>

            {/* LISTED */}
            {showListedField && (
              <div className="poh-field">
                <label>Securities are listed <span>*</span></label>
                <select
                  value={form.listed}
                  onChange={(e) =>
                    updateField("listed", e.target.value)
                  }
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}

            {/* PURCHASE DATE */}
            <div className="poh-field">
              <label>Date of Purchase <span>*</span></label>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) =>
                  updateField("purchaseDate", e.target.value)
                }
              />
            </div>

            {/* TRANSFER DATE */}
            <div className="poh-field">
              <label>Date of Transfer <span>*</span></label>
              <input
                type="date"
                value={form.transferDate}
                onChange={(e) =>
                  updateField("transferDate", e.target.value)
                }
              />
            </div>
          </div>

          {/* WARNINGS */}
          {result.warnings.length > 0 && (
            <div className="poh-warning-box">
              {result.warnings.map((warning, index) => (
                <div key={index}>
                  ⚠ {warning}
                </div>
              ))}
            </div>
          )}

          {/* RESET */}
          <div className="poh-modern-actions">
            <button
              onClick={() => setForm(initialState)}
              className="poh-btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT RESULT PANEL */}
        <div className="poh-result-panel">
          <div className="poh-result-head">
            <p>Computation Summary</p>
            <h2>{result.capitalAssetType}</h2>
            <span>Type of Capital Asset</span>
          </div>

          <div className="poh-result-list">
            <div className="poh-result-item">
              <span>Holding Period</span>
              <strong>{result.holdingPeriod}</strong>
            </div>

            <div className="poh-result-item">
              <span>Asset Type</span>
              <strong>{form.assetType || "-"}</strong>
            </div>

            <div className="poh-result-item">
              <span>Listed Security</span>
              <strong>
                {showListedField ? form.listed || "-" : "Not Applicable"}
              </strong>
            </div>

            <div className="poh-result-item">
              <span>Purchase Date</span>
              <strong>{form.purchaseDate || "-"}</strong>
            </div>

            <div className="poh-result-item">
              <span>Transfer Date</span>
              <strong>{form.transferDate || "-"}</strong>
            </div>

            <div
              className={`poh-result-item final ${
                result.capitalAssetType === "Long Term Capital Asset"
                  ? "long-term"
                  : "short-term"
              }`}
            >
              <span>Final Result</span>
              <strong>{result.capitalAssetType}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .poh-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .poh-modern-container {
        max-width: 1250px;
        margin: 0 auto;
      }

      .poh-modern-header {
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

      .poh-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .poh-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .poh-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .poh-modern-badge {
        min-width: 190px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .poh-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .poh-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .poh-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 26px;
        align-items: start;
      }

      .poh-modern-card,
      .poh-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .poh-modern-card {
        padding: 26px;
      }

      .poh-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .poh-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .poh-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .poh-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .poh-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .poh-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
      }

      .poh-field label span {
        color: #f87171;
      }

      .poh-field input,
      .poh-field select {
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

      .poh-field input:focus,
      .poh-field select:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .poh-field option {
        background: #0f172a;
        color: #ffffff;
      }

      .poh-warning-box {
        margin-top: 22px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(248, 113, 113, 0.12);
        border: 1px solid rgba(248, 113, 113, 0.3);
        color: #fecaca;
        font-size: 14px;
        font-weight: 700;
      }

      .poh-warning-box div + div {
        margin-top: 8px;
      }

      .poh-modern-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 26px;
      }

      .poh-btn-secondary {
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

      .poh-btn-secondary:hover {
        background: rgba(248, 113, 113, 0.16);
        color: #fecaca;
        border-color: rgba(248, 113, 113, 0.32);
      }

      .poh-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .poh-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .poh-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .poh-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 28px;
        line-height: 1.2;
        word-break: break-word;
      }

      .poh-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .poh-result-list {
        padding: 18px;
      }

      .poh-result-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .poh-result-item:last-child {
        border-bottom: none;
      }

      .poh-result-item span {
        color: #94a3b8;
        font-size: 14px;
        min-width: 110px;
      }

      .poh-result-item strong {
        color: #ffffff;
        font-size: 15px;
        text-align: right;
        word-break: break-word;
      }

      .poh-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border-bottom: none;
      }

      .poh-result-item.final.long-term {
        border: 1px solid rgba(34, 197, 94, 0.24);
        background: rgba(34, 197, 94, 0.08);
      }

      .poh-result-item.final.long-term span,
      .poh-result-item.final.long-term strong {
        color: #86efac;
      }

      .poh-result-item.final.short-term {
        border: 1px solid rgba(251, 146, 60, 0.28);
        background: rgba(251, 146, 60, 0.09);
      }

      .poh-result-item.final.short-term span,
      .poh-result-item.final.short-term strong {
        color: #fdba74;
      }

      .poh-result-item.final strong {
        font-size: 18px;
      }

      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }

      @media (max-width: 1050px) {
        .poh-modern-page {
          padding: 20px;
        }

        .poh-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .poh-modern-grid {
          grid-template-columns: 1fr;
        }

        .poh-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .poh-form-grid {
          grid-template-columns: 1fr;
        }

        .poh-modern-actions {
          flex-direction: column;
        }

        .poh-btn-secondary {
          width: 100%;
        }

        .poh-result-item {
          flex-direction: column;
        }

        .poh-result-item strong {
          text-align: left;
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