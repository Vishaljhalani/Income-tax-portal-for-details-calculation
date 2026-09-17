import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LeaveEncashmentCalculator() {
const navigate = useNavigate();
  // =========================================
  // INITIAL STATE
  // =========================================
  const initialState = {
    govtEmployee: "no",
    retirementCase: "yes",

    avgBasicSalary: "",
    avgDA: "",
    avgCommission: "",

    daEligibleForRetirement: "yes",
    commissionEligible: "yes",

    serviceYears: "",
    earnedLeaveDays: "",
    leaveAvailedDays: "",

    leaveSalaryReceived: "",

    retirementYear: "",

    previousExemptionClaimed: "",
  };

  const [f, setF] = useState(initialState);

  const updateField = (key, value) => {
    setF((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const num = (value) =>
    Number(value) || 0;

  const roundOff = (value) =>
  Math.round(Number(value) || 0);

  // =========================================
  // MAIN CALCULATION
  // =========================================
  const result = useMemo(() => {

    let warnings = [];

    // =====================================
    // BASIC VALIDATION
    // =====================================

    if (!f.leaveSalaryReceived) {
      return {
        exemptLeaveEncashment: 0,
        taxableLeaveEncashment: 0,
        averageSalary: 0,
        warnings,
      };
    }

    // =====================================
    // ELIGIBLE DA
    // =====================================

    const eligibleDA =
      f.daEligibleForRetirement === "yes"
        ? num(f.avgDA)
        : 0;

    // =====================================
    // ELIGIBLE COMMISSION
    // =====================================

    const eligibleCommission =
      f.commissionEligible === "yes"
        ? num(f.avgCommission)
        : 0;

    // =====================================
    // AVERAGE SALARY
    // Last 10 Months
    // =====================================

    const averageSalary =
      num(f.avgBasicSalary) +
      eligibleDA +
      eligibleCommission;

    // =====================================
    // FINAL VALUES
    // =====================================

    let exemptLeaveEncashment = 0;

    let taxableLeaveEncashment = 0;

    // =====================================
    // CASE 1
    // DURING SERVICE
    // FULLY TAXABLE
    // =====================================

    if (f.retirementCase === "no") {

      exemptLeaveEncashment = 0;

      taxableLeaveEncashment =
        num(f.leaveSalaryReceived);
    }

    // =====================================
    // CASE 2
    // RETIREMENT / SUPERANNUATION
    // =====================================

    else {

      // ===================================
      // GOVT EMPLOYEE
      // FULLY EXEMPT
      // ===================================

      if (f.govtEmployee === "yes") {

        exemptLeaveEncashment =
          num(f.leaveSalaryReceived);

        taxableLeaveEncashment = 0;
      }

      // ===================================
      // NON-GOVT EMPLOYEE
      // LEAST OF 4 CONDITIONS
      // ===================================

      else {

        // ================================
        // CONDITION A
        // Cash equivalent of leave credit
        // Max 30 days per completed year
        // ================================

        const maxLeaveAllowed =
          num(f.serviceYears) * 30;

        const leaveAtCredit =
          Math.max(
            0,
            num(f.earnedLeaveDays) -
              num(f.leaveAvailedDays)
          );

        const leaveDaysConsidered =
          Math.min(
            leaveAtCredit,
            maxLeaveAllowed
          );

        const leaveConditionA =
          (averageSalary / 30) *
          leaveDaysConsidered;

        // ================================
        // CONDITION B
        // 10 Months Average Salary
        // ================================

        const leaveConditionB =
          averageSalary * 10;

        // ================================
        // CONDITION C
        // Statutory Limit
        // Up to 31-03-2023 = 3 Lakh
        // From 01-04-2023 = 25 Lakh
        // ================================

        const statutoryLimit =
          num(f.retirementYear) >= 2023
            ? 2500000
            : 300000;

        const leaveConditionC =
          Math.max(
            0,
            statutoryLimit -
              num(
                f.previousExemptionClaimed
              )
          );

        // ================================
        // CONDITION D
        // Actual Received
        // ================================

        const leaveConditionD =
          num(f.leaveSalaryReceived);

        // ================================
        // FINAL EXEMPTION
        // LEAST OF 4
        // ================================

        exemptLeaveEncashment =
          Math.min(
            leaveConditionA,
            leaveConditionB,
            leaveConditionC,
            leaveConditionD
          );

        // ================================
        // TAXABLE PORTION
        // ================================

        taxableLeaveEncashment =
          Math.max(
            0,
            leaveConditionD -
              exemptLeaveEncashment
          );
      }
    }

    return {
  averageSalary:
    roundOff(averageSalary),

  exemptLeaveEncashment:
    roundOff(exemptLeaveEncashment),

  taxableLeaveEncashment:
    roundOff(taxableLeaveEncashment),

  warnings,
};

  }, [f]);

  // =========================================
  // UI CONDITIONS
  // =========================================

  const showRetirementFields =
    f.retirementCase === "yes" &&
    f.govtEmployee === "no";

  // =========================================
  // UI
  // =========================================

 return (
  <div className="le-modern-page">
    <div className="le-modern-container">
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
      <div className="le-modern-header">
        <div>
          <p className="le-modern-kicker">Salary Tax Utility</p>
          <h1>Leave Encashment Calculator</h1>
          <p>
            Calculate exempt and taxable leave encashment under Section 10(10AA).
          </p>
        </div>

        <div className="le-modern-badge">
          <span>Section</span>
          <strong>10(10AA)</strong>
        </div>
      </div>

      <div className="le-modern-grid">

        {/* LEFT FORM */}
        <div className="le-modern-card">
          <div className="le-section-title">
            <h2>Employee Details</h2>
            <p>Select employee type and retirement status</p>
          </div>

          <div className="le-form-grid">
            <div className="le-field">
              <label>Government Employee</label>
              <select
                value={f.govtEmployee}
                onChange={(e) =>
                  updateField("govtEmployee", e.target.value)
                }
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="le-field">
              <label>Encashment on Retirement</label>
              <select
                value={f.retirementCase}
                onChange={(e) =>
                  updateField("retirementCase", e.target.value)
                }
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* SALARY DETAILS */}
          <div className="le-section-title small">
            <h2>Salary Details</h2>
            <p>Average salary for last 10 months</p>
          </div>

          <div className="le-form-grid">
            <div className="le-field">
              <label>Average Basic Salary</label>
              <input
                type="number"
                value={f.avgBasicSalary}
                onChange={(e) =>
                  updateField("avgBasicSalary", e.target.value)
                }
                placeholder="Enter amount"
              />
            </div>

            <div className="le-field">
              <label>Average Dearness Allowance</label>
              <input
                type="number"
                value={f.avgDA}
                onChange={(e) =>
                  updateField("avgDA", e.target.value)
                }
                placeholder="Enter amount"
              />
            </div>

            <div className="le-field">
              <label>DA forms part of retirement benefits</label>
              <select
                value={f.daEligibleForRetirement}
                onChange={(e) =>
                  updateField("daEligibleForRetirement", e.target.value)
                }
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="le-field">
              <label>Average Commission</label>
              <input
                type="number"
                value={f.avgCommission}
                onChange={(e) =>
                  updateField("avgCommission", e.target.value)
                }
                placeholder="Enter amount"
              />
            </div>

            <div className="le-field">
              <label>Commission as % of turnover</label>
              <select
                value={f.commissionEligible}
                onChange={(e) =>
                  updateField("commissionEligible", e.target.value)
                }
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* RETIREMENT DETAILS */}
          {showRetirementFields && (
            <>
              <div className="le-section-title small">
                <h2>Leave Credit Details</h2>
                <p>Applicable for non-government employee on retirement</p>
              </div>

              <div className="le-form-grid">
                <div className="le-field">
                  <label>Completed Years of Service</label>
                  <input
                    type="number"
                    value={f.serviceYears}
                    onChange={(e) =>
                      updateField("serviceYears", e.target.value)
                    }
                    placeholder="Enter years"
                  />
                </div>

                <div className="le-field">
                  <label>Earned Leave Days</label>
                  <input
                    type="number"
                    value={f.earnedLeaveDays}
                    onChange={(e) =>
                      updateField("earnedLeaveDays", e.target.value)
                    }
                    placeholder="Enter days"
                  />
                </div>

                <div className="le-field">
                  <label>Leave Availed Days</label>
                  <input
                    type="number"
                    value={f.leaveAvailedDays}
                    onChange={(e) =>
                      updateField("leaveAvailedDays", e.target.value)
                    }
                    placeholder="Enter days"
                  />
                </div>

                <div className="le-field">
                  <label>Retirement Year</label>
                  <input
                    type="number"
                    value={f.retirementYear}
                    onChange={(e) =>
                      updateField("retirementYear", e.target.value)
                    }
                    placeholder="e.g. 2025"
                  />
                </div>

                <div className="le-field">
                  <label>Previous Exemption Claimed</label>
                  <input
                    type="number"
                    value={f.previousExemptionClaimed}
                    onChange={(e) =>
                      updateField("previousExemptionClaimed", e.target.value)
                    }
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </>
          )}

          {/* RECEIVED AMOUNT */}
          <div className="le-section-title small">
            <h2>Leave Encashment Received</h2>
            <p>Enter actual leave salary received</p>
          </div>

          <div className="le-form-grid">
            <div className="le-field">
              <label>Amount Received <span>*</span></label>
              <input
                type="number"
                value={f.leaveSalaryReceived}
                onChange={(e) =>
                  updateField("leaveSalaryReceived", e.target.value)
                }
                placeholder="Enter amount"
              />
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="le-warning-box">
              {result.warnings.map((warning, index) => (
                <div key={index}>⚠ {warning}</div>
              ))}
            </div>
          )}

          <div className="le-info-box">
            <strong>Information</strong>
            <p>
              For non-government employees, exemption is calculated as least of
              prescribed limits. During service, leave encashment is fully taxable.
            </p>
          </div>

          {/* ACTION */}
          <div className="le-modern-actions">
            <button
              onClick={() => setF(initialState)}
              className="le-btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT RESULT PANEL */}
        <div className="le-result-panel">
          <div className="le-result-head">
            <p>Computation Summary</p>
            <h2>
              ₹ {result.taxableLeaveEncashment.toLocaleString("en-IN")}
            </h2>
            <span>Taxable Leave Encashment</span>
          </div>

          <div className="le-result-list">
            <div className="le-result-item">
              <span>Average Salary</span>
              <strong>
                ₹ {result.averageSalary.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="le-result-item">
              <span>Leave Salary Received</span>
              <strong>
                ₹ {(Number(f.leaveSalaryReceived) || 0).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="le-result-item">
              <span>Exempt Amount</span>
              <strong>
                ₹ {result.exemptLeaveEncashment.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="le-result-item">
              <span>Government Employee</span>
              <strong>{f.govtEmployee === "yes" ? "Yes" : "No"}</strong>
            </div>

            <div className="le-result-item">
              <span>Retirement Case</span>
              <strong>{f.retirementCase === "yes" ? "Yes" : "No"}</strong>
            </div>

            <div className="le-result-item final">
              <span>Taxable Amount</span>
              <strong>
                ₹ {result.taxableLeaveEncashment.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .le-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .le-modern-container {
        max-width: 1300px;
        margin: 0 auto;
      }

      .le-modern-header {
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

      .le-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .le-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .le-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .le-modern-badge {
        min-width: 190px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .le-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .le-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .le-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 26px;
        align-items: start;
      }

      .le-modern-card,
      .le-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .le-modern-card {
        padding: 26px;
      }

      .le-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .le-section-title.small {
        margin-top: 28px;
      }

      .le-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .le-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .le-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .le-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .le-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
      }

      .le-field label span {
        color: #f87171;
      }

      .le-field input,
      .le-field select {
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

      .le-field input::placeholder {
        color: #64748b;
      }

      .le-field input:focus,
      .le-field select:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .le-field option {
        background: #0f172a;
        color: #ffffff;
      }

      .le-info-box {
        margin-top: 24px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(37, 99, 235, 0.08);
        border: 1px solid rgba(96, 165, 250, 0.18);
      }

      .le-info-box strong {
        color: #bfdbfe;
        font-size: 14px;
      }

      .le-info-box p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.6;
      }

      .le-warning-box {
        margin-top: 22px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(248, 113, 113, 0.12);
        border: 1px solid rgba(248, 113, 113, 0.3);
        color: #fecaca;
        font-size: 14px;
        font-weight: 700;
      }

      .le-warning-box div + div {
        margin-top: 8px;
      }

      .le-modern-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 26px;
      }

      .le-btn-secondary {
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

      .le-btn-secondary:hover {
        background: rgba(248, 113, 113, 0.16);
        color: #fecaca;
        border-color: rgba(248, 113, 113, 0.32);
      }

      .le-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .le-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .le-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .le-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 32px;
        line-height: 1.2;
        word-break: break-word;
      }

      .le-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .le-result-list {
        padding: 18px;
      }

      .le-result-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .le-result-item:last-child {
        border-bottom: none;
      }

      .le-result-item span {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.4;
      }

      .le-result-item strong {
        color: #ffffff;
        font-size: 15px;
        text-align: right;
        white-space: nowrap;
      }

      .le-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(248, 113, 113, 0.28);
        background: rgba(248, 113, 113, 0.09);
      }

      .le-result-item.final span {
        color: #fecaca;
        font-weight: 800;
      }

      .le-result-item.final strong {
        color: #fca5a5;
        font-size: 20px;
      }

      @media (max-width: 1100px) {
        .le-modern-page {
          padding: 20px;
        }

        .le-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .le-modern-grid {
          grid-template-columns: 1fr;
        }

        .le-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .le-form-grid {
          grid-template-columns: 1fr;
        }

        .le-modern-actions {
          flex-direction: column;
        }

        .le-btn-secondary {
          width: 100%;
        }

        .le-result-item {
          flex-direction: column;
        }

        .le-result-item strong {
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