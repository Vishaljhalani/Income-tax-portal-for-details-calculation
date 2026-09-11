import React, { useMemo, useState } from "react";

export default function HRA_Calculator() {
  const initialState = {
    basicSalary: "",
    da: "",
    commission: "",
    hraReceived: "",
    rentPaid: "",
    cityType: "",
  };

  const [form, setForm] = useState(initialState);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const num = (val) => Number(val) || 0;

  const result = useMemo(() => {
    const warnings = [];

    if (
      !form.basicSalary ||
      !form.hraReceived ||
      !form.rentPaid ||
      !form.cityType
    ) {
      return {
        salaryForHRA: 0,
        conditionA: 0,
        conditionB: 0,
        conditionC: 0,
        exemptHRA: 0,
        taxableHRA: 0,
        warnings: ["Please fill all required fields."],
      };
    }

    const salaryForHRA =
      num(form.basicSalary) +
      num(form.da) +
      num(form.commission);

    const conditionA =
      form.cityType === "metro"
        ? salaryForHRA * 0.5
        : salaryForHRA * 0.4;

    const conditionB = num(form.hraReceived);

    const conditionC = Math.max(
      0,
      num(form.rentPaid) - salaryForHRA * 0.1
    );

    const exemptHRA = Math.min(
      conditionA,
      conditionB,
      conditionC
    );

    const taxableHRA = Math.max(
      0,
      num(form.hraReceived) - exemptHRA
    );

    if (num(form.rentPaid) <= salaryForHRA * 0.1) {
      warnings.push(
        "Rent paid is less than or equal to 10% of salary."
      );
    }

    if (num(form.hraReceived) === 0) {
      warnings.push("No HRA received.");
    }

    return {
      salaryForHRA,
      conditionA,
      conditionB,
      conditionC,
      exemptHRA,
      taxableHRA,
      warnings,
    };
  }, [form]);

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  return (
  <div className="hra-modern-page">
    <div className="hra-modern-container">

      {/* HEADER */}
      <div className="hra-modern-header">
        <div>
          <p className="hra-modern-kicker">Salary Tax Utility</p>
          <h1>HRA Calculator</h1>
          <p>
            Calculate HRA exemption and taxable HRA under Section 10(13A).
          </p>
        </div>

        <div className="hra-modern-badge">
          <span>Section</span>
          <strong>10(13A)</strong>
        </div>
      </div>

      <div className="hra-modern-grid">

        {/* LEFT FORM */}
        <div className="hra-modern-card">
          <div className="hra-section-title">
            <h2>Salary & Rent Details</h2>
            <p>Enter salary, HRA received, rent paid and city type</p>
          </div>

          <div className="hra-form-grid">

            <div className="hra-field">
              <label>Basic Salary <span>*</span></label>
              <input
                type="number"
                value={form.basicSalary}
                onChange={(e) =>
                  updateField("basicSalary", e.target.value)
                }
                placeholder="Enter basic salary"
              />
            </div>

            <div className="hra-field">
              <label>Dearness Allowance (DA)</label>
              <input
                type="number"
                value={form.da}
                onChange={(e) =>
                  updateField("da", e.target.value)
                }
                placeholder="Enter DA forming part of salary"
              />
            </div>

            <div className="hra-field">
              <label>Commission</label>
              <input
                type="number"
                value={form.commission}
                onChange={(e) =>
                  updateField("commission", e.target.value)
                }
                placeholder="Enter commission amount"
              />
            </div>

            <div className="hra-field">
              <label>HRA Received <span>*</span></label>
              <input
                type="number"
                value={form.hraReceived}
                onChange={(e) =>
                  updateField("hraReceived", e.target.value)
                }
                placeholder="Enter HRA received"
              />
            </div>

            <div className="hra-field">
              <label>Rent Paid <span>*</span></label>
              <input
                type="number"
                value={form.rentPaid}
                onChange={(e) =>
                  updateField("rentPaid", e.target.value)
                }
                placeholder="Enter annual rent paid"
              />
            </div>

            <div className="hra-field">
              <label>City Type <span>*</span></label>

              <div className="hra-city-grid">
                <button
                  type="button"
                  onClick={() =>
                    updateField("cityType", "metro")
                  }
                  className={
                    form.cityType === "metro"
                      ? "hra-city-btn active"
                      : "hra-city-btn"
                  }
                >
                  Metro
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateField("cityType", "nonMetro")
                  }
                  className={
                    form.cityType === "nonMetro"
                      ? "hra-city-btn active"
                      : "hra-city-btn"
                  }
                >
                  Non-Metro
                </button>
              </div>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="hra-warning-box">
              <strong>Notes / Warnings</strong>

              <ul>
                {result.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="hra-info-box">
            <strong>Information</strong>
            <p>
              HRA exemption is calculated as the least of actual HRA received,
              prescribed salary percentage, and rent paid minus 10% of salary.
            </p>
          </div>
        </div>

        {/* RIGHT RESULT PANEL */}
        <div className="hra-result-panel">
          <div className="hra-result-head">
            <p>Computation Summary</p>
            <h2>₹ {formatCurrency(result.exemptHRA)}</h2>
            <span>Exempt HRA</span>
          </div>

          <div className="hra-result-list">
            <div className="hra-result-item">
              <span>Salary for HRA</span>
              <strong>₹ {formatCurrency(result.salaryForHRA)}</strong>
            </div>

            <div className="hra-result-item">
              <span>50% / 40% of Salary</span>
              <strong>₹ {formatCurrency(result.conditionA)}</strong>
            </div>

            <div className="hra-result-item">
              <span>Actual HRA Received</span>
              <strong>₹ {formatCurrency(result.conditionB)}</strong>
            </div>

            <div className="hra-result-item">
              <span>Rent Paid - 10% Salary</span>
              <strong>₹ {formatCurrency(result.conditionC)}</strong>
            </div>

            <div className="hra-result-item exempt">
              <span>Exempt HRA</span>
              <strong>₹ {formatCurrency(result.exemptHRA)}</strong>
            </div>

            <div className="hra-result-item final">
              <span>Taxable HRA</span>
              <strong>₹ {formatCurrency(result.taxableHRA)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .hra-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .hra-modern-container {
        max-width: 1250px;
        margin: 0 auto;
      }

      .hra-modern-header {
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

      .hra-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .hra-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .hra-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .hra-modern-badge {
        min-width: 190px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .hra-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .hra-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .hra-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 26px;
        align-items: start;
      }

      .hra-modern-card,
      .hra-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .hra-modern-card {
        padding: 26px;
      }

      .hra-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .hra-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .hra-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .hra-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .hra-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .hra-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
      }

      .hra-field label span {
        color: #f87171;
      }

      .hra-field input {
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

      .hra-field input::placeholder {
        color: #64748b;
      }

      .hra-field input:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .hra-city-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .hra-city-btn {
        height: 46px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(2, 6, 23, 0.48);
        color: #cbd5e1;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .hra-city-btn:hover {
        border-color: #60a5fa;
        color: #ffffff;
      }

      .hra-city-btn.active {
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        color: #ffffff;
        border-color: rgba(96, 165, 250, 0.55);
        box-shadow: 0 12px 28px rgba(37, 99, 235, 0.24);
      }

      .hra-warning-box {
        margin-top: 22px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(245, 158, 11, 0.12);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #fde68a;
      }

      .hra-warning-box strong {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
      }

      .hra-warning-box ul {
        margin: 0;
        padding-left: 0;
        list-style: none;
      }

      .hra-warning-box li {
        font-size: 13px;
        line-height: 1.6;
      }

      .hra-info-box {
        margin-top: 24px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(37, 99, 235, 0.08);
        border: 1px solid rgba(96, 165, 250, 0.18);
      }

      .hra-info-box strong {
        color: #bfdbfe;
        font-size: 14px;
      }

      .hra-info-box p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.6;
      }

      .hra-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .hra-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .hra-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .hra-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 32px;
        line-height: 1.2;
        word-break: break-word;
      }

      .hra-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .hra-result-list {
        padding: 18px;
      }

      .hra-result-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .hra-result-item:last-child {
        border-bottom: none;
      }

      .hra-result-item span {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.4;
      }

      .hra-result-item strong {
        color: #ffffff;
        font-size: 15px;
        text-align: right;
        white-space: nowrap;
      }

      .hra-result-item.exempt {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(34, 197, 94, 0.24);
        background: rgba(34, 197, 94, 0.08);
      }

      .hra-result-item.exempt span {
        color: #bbf7d0;
        font-weight: 800;
      }

      .hra-result-item.exempt strong {
        color: #86efac;
        font-size: 18px;
      }

      .hra-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(248, 113, 113, 0.28);
        background: rgba(248, 113, 113, 0.09);
      }

      .hra-result-item.final span {
        color: #fecaca;
        font-weight: 800;
      }

      .hra-result-item.final strong {
        color: #fca5a5;
        font-size: 20px;
      }

      @media (max-width: 1050px) {
        .hra-modern-page {
          padding: 20px;
        }

        .hra-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .hra-modern-grid {
          grid-template-columns: 1fr;
        }

        .hra-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .hra-form-grid {
          grid-template-columns: 1fr;
        }

        .hra-result-item {
          flex-direction: column;
        }

        .hra-result-item strong {
          text-align: left;
          white-space: normal;
        }
      }
    `}</style>
  </div>
);
}