import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function PartnerRemunerationCalculator() {
  const navigate = useNavigate();
  const assessmentYears = [
    "2017-18","2018-19","2019-20","2020-21","2021-22",
    "2022-23","2023-24","2024-25","2025-26","2026-27",
  ];

 const emptyPartner = {
  name: "",
  profitRatio: "",
  amount: "",
};

  const getInitialState = () => ({
    assessmentYear: "",
    netProfit: "",
    totalInterestPaid: "",
    remunerationToPartner: "",
    salaryToPartners: "",
    bonusToPartners: "",
    commissionToPartners: "",
    depreciation: "",
    otherDisallowances: "",
    depreciationAllowable: "",
    otherAllowableItems: "",
    manualProfitBefore: "",
    manualLessInterest: "",
    editProfitBefore: false,
    editLessInterest: false,
    partners: [{ ...emptyPartner }],
  });

  const [form, setForm] = useState(getInitialState);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePartner = (index, field, value) => {
    setForm((prev) => {
      const partners = [...(prev.partners || [])];

      partners[index] = {
        ...partners[index],
        [field]: value,
      };

      return { ...prev, partners };
    });
  };

  const addPartner = () => {
    setForm((prev) => ({
      ...prev,
      partners: [...(prev.partners || []), { ...emptyPartner }],
    }));
  };

  const removePartner = (index) => {
    setForm((prev) => {
      const partners = prev.partners.filter((_, i) => i !== index);
      return {
        ...prev,
        partners: partners.length ? partners : [{ ...emptyPartner }],
      };
    });
  };

  const resetForm = () => {
    setForm(getInitialState());
  };

  const num = (v) => Number(v) || 0;

  const result = useMemo(() => {
   const netProfit = Number(form.netProfit) || 0;
const salary = Number(form.salaryToPartners) || 0;
const bonus = Number(form.bonusToPartners) || 0;
const commission = Number(form.commissionToPartners) || 0;
const remunerationInput = Number(form.remunerationToPartner) || 0;
const depreciation = Number(form.depreciation) || 0;
const otherDisallowances = Number(form.otherDisallowances) || 0;
const depreciationAllowable = Number(form.depreciationAllowable) || 0;
const otherAllowableItems = Number(form.otherAllowableItems) || 0;

    const totalInterestFromTable = (form.partners || []).reduce(
  (sum, p) => sum + (Number(p.amount) || 0),
  0
);

    const totalInterestPaid = totalInterestFromTable;

    const totalRemunerationClaimed =
      remunerationInput + salary + bonus + commission;

   const profitBeforeAuto =
  netProfit +
  depreciation +
  totalInterestFromTable +
  totalRemunerationClaimed +
  otherDisallowances;

    const lessInterestAuto = totalInterestPaid;

    const profitBefore = profitBeforeAuto;

    

const lessInterest = totalInterestPaid * 0.12;

    const bookProfitBase =
      profitBefore -
      lessInterest -
      depreciationAllowable -
      otherAllowableItems;

    let maxRemuneration = 0;

    const isNewRule = form.assessmentYear === "2026-27";

    if (bookProfitBase <= 0) {
      maxRemuneration = isNewRule ? 300000 : 150000;
    } else {
      const firstLimit = isNewRule ? 600000 : 300000;
      const minimum = isNewRule ? 300000 : 150000;

      if (bookProfitBase <= firstLimit) {
        maxRemuneration = Math.max(minimum, bookProfitBase * 0.9);
      } else {
        const firstPart = Math.max(minimum, firstLimit * 0.9);
        const remaining = (bookProfitBase - firstLimit) * 0.6;
        maxRemuneration = firstPart + remaining;
      }
    }

    const totalRemunerationAllowed = Math.min(
      totalRemunerationClaimed,
      maxRemuneration
    );
    const finalBookProfit =
  bookProfitBase - totalRemunerationAllowed;

    return {
 totalInterestPaid,
  bookProfitBase,
  totalRemunerationAllowed,
  profitBefore,
  lessInterest,
  finalBookProfit,
};
  }, [form]);

  const format = (v) =>
    Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });

   return (
  <div className="pr-modern-page">
    <div className="pr-modern-container">
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
      <div className="pr-modern-header">
        <div>
          <p className="pr-modern-kicker">Firm Tax Utility</p>
          <h1>Partner Remuneration Calculator</h1>
          <p>
            Calculate allowable partner remuneration, interest adjustment and final book profit.
          </p>
        </div>

        <div className="pr-modern-badge">
          <span>Assessment Year</span>
          <strong>{form.assessmentYear || "Not Selected"}</strong>
        </div>
      </div>

      <div className="pr-modern-grid">

        {/* LEFT FORM */}
        <div className="pr-modern-card">
          <div className="pr-section-title">
            <h2>Firm & Partner Details</h2>
            <p>Enter profit and partner-wise interest details for book profit computation</p>
          </div>

          <div className="pr-form-grid">
            <div className="pr-field">
              <label>Assessment Year <span>*</span></label>
              <select
                value={form.assessmentYear}
                onChange={(e) => update("assessmentYear", e.target.value)}
              >
                <option value="">Select AY</option>
                {assessmentYears.map((ay) => (
                  <option key={ay} value={ay}>
                    {ay}
                  </option>
                ))}
              </select>
            </div>

            <div className="pr-field">
              <label>Net Profit / (Loss) as per P&L</label>
              <input
                type="number"
                placeholder="Enter net profit / loss"
                value={form.netProfit}
                onChange={(e) => update("netProfit", e.target.value)}
              />
            </div>
          </div>

          {/* PARTNER TABLE */}
          <div className="pr-table-section">
            <div className="pr-sub-title">
              <h3>Interest Paid to Partners</h3>
              <button onClick={addPartner} className="pr-btn-primary">
                Add More
              </button>
            </div>

            <div className="pr-table-wrap">
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Name of Partner</th>
                    <th>Actual Rate (%)</th>
                    <th>Amount of Interest</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {form.partners.map((p, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>

                      <td>
                        <input
                          value={p.name}
                          placeholder="Partner name"
                          onChange={(e) =>
                            updatePartner(i, "name", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={p.actualRate}
                          placeholder="Rate %"
                          onChange={(e) => {
                            const newValue = Number(e.target.value) || 0;
                            const otherTotal = form.partners.reduce(
                              (sum, row, idx) =>
                                idx !== i
                                  ? sum + (Number(row.actualRate) || 0)
                                  : sum,
                              0
                            );

                            if (otherTotal + newValue > 100) {
                              alert("Total Actual Rate (%) cannot exceed 100%");
                              return;
                            }

                            updatePartner(i, "actualRate", e.target.value);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={p.amount}
                          placeholder="Amount"
                          onChange={(e) =>
                            updatePartner(i, "amount", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <button
                          onClick={() => removePartner(i)}
                          className="pr-btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* OTHER INPUTS */}
          <div className="pr-section-title small">
            <h2>Profit & Allowance Details</h2>
            <p>Enter remuneration, depreciation and other adjustment amounts</p>
          </div>

          <div className="pr-form-grid">
            {[
              ["totalInterestPaid", "Total Interest Paid to Partners"],
              ["remunerationToPartner", "Remuneration to Partner"],
              ["salaryToPartners", "Salary to Partners"],
              ["bonusToPartners", "Bonus to Partners"],
              ["commissionToPartners", "Commission to Partners"],
              ["depreciation", "Depreciation"],
              ["otherDisallowances", "Interest Paid to Partners and Other Disallowances"],
              ["depreciationAllowable", "Depreciation allowable as per Income-Tax Act, 1961"],
              ["otherAllowableItems", "Other Allowable Items"],
            ].map(([key, label]) => (
              <div key={key} className="pr-field">
                <label>{label}</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={
                    key === "totalInterestPaid"
                      ? result.totalInterestPaid
                      : form[key]
                  }
                  onChange={(e) =>
                    key !== "totalInterestPaid" &&
                    update(key, e.target.value)
                  }
                  readOnly={key === "totalInterestPaid"}
                />
              </div>
            ))}
          </div>

          {/* INFORMATION */}
          <div className="pr-info-box">
            <strong>Information</strong>
            <p>
              Please check the interest allowed as per Income-tax Act. In case any
              capital is introduced or withdrawn during the year, please change the
              interest amount manually.
            </p>
          </div>

          {/* ACTION */}
          <div className="pr-modern-actions">
            <button onClick={resetForm} className="pr-btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT RESULT PANEL */}
        <div className="pr-result-panel">
          <div className="pr-result-head">
            <p>Computation Summary</p>
            <h2>₹ {format(result.finalBookProfit || 0)}</h2>
            <span>Final Book Profit</span>
          </div>

          <div className="pr-result-list">
            <div className="pr-result-item">
              <span>Total Interest Paid</span>
              <strong>₹ {format(result.totalInterestPaid || 0)}</strong>
            </div>

            <div className="pr-result-item">
              <span>Profit Before Interest / Depreciation / Remuneration</span>
              <strong>₹ {format(result.profitBefore || 0)}</strong>
            </div>

            <div className="pr-result-item">
              <span>Less: Interest on Capital to Partners</span>
              <strong>₹ {format(result.lessInterest || 0)}</strong>
            </div>

            <div className="pr-result-item">
              <span>Book Profit Base</span>
              <strong>₹ {format(result.bookProfitBase || 0)}</strong>
            </div>

            <div className="pr-result-item">
              <span>Total Remuneration Allowed</span>
              <strong>₹ {format(result.totalRemunerationAllowed || 0)}</strong>
            </div>

            <div className="pr-result-item final">
              <span>Final Book Profit</span>
              <strong>₹ {format(result.finalBookProfit || 0)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .pr-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .pr-modern-container {
        max-width: 1300px;
        margin: 0 auto;
      }

      .pr-modern-header {
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

      .pr-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .pr-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .pr-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .pr-modern-badge {
        min-width: 190px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .pr-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .pr-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .pr-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 26px;
        align-items: start;
      }

      .pr-modern-card,
      .pr-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .pr-modern-card {
        padding: 26px;
      }

      .pr-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .pr-section-title.small {
        margin-top: 28px;
      }

      .pr-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .pr-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .pr-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .pr-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .pr-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
      }

      .pr-field label span {
        color: #f87171;
      }

      .pr-field input,
      .pr-field select,
      .pr-table input {
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

      .pr-field input::placeholder,
      .pr-table input::placeholder {
        color: #64748b;
      }

      .pr-field input:focus,
      .pr-field select:focus,
      .pr-table input:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .pr-field input[readonly] {
        opacity: 0.8;
        cursor: not-allowed;
        background: rgba(30, 41, 59, 0.75);
      }

      .pr-field option {
        background: #0f172a;
        color: #ffffff;
      }

      .pr-table-section {
        margin-top: 28px;
        padding: 20px;
        border-radius: 22px;
        background: rgba(2, 6, 23, 0.24);
        border: 1px solid rgba(148, 163, 184, 0.14);
      }

      .pr-sub-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        margin-bottom: 16px;
      }

      .pr-sub-title h3 {
        margin: 0;
        color: #ffffff;
        font-size: 18px;
      }

      .pr-table-wrap {
        width: 100%;
        overflow-x: auto;
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.14);
      }

      .pr-table {
        width: 100%;
        min-width: 850px;
        border-collapse: collapse;
        background: rgba(15, 23, 42, 0.72);
      }

      .pr-table th {
        padding: 14px;
        text-align: left;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        background: rgba(37, 99, 235, 0.15);
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .pr-table td {
        padding: 12px;
        color: #e5e7eb;
        font-size: 14px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      }

      .pr-table tr:last-child td {
        border-bottom: none;
      }

      .pr-btn-primary,
      .pr-btn-secondary,
      .pr-btn-delete {
        height: 44px;
        padding: 0 20px;
        border-radius: 14px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .pr-btn-primary {
        border: none;
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        color: #ffffff;
        box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
      }

      .pr-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 36px rgba(37, 99, 235, 0.35);
      }

      .pr-btn-secondary {
        background: rgba(148, 163, 184, 0.12);
        color: #cbd5e1;
        border: 1px solid rgba(148, 163, 184, 0.22);
      }

      .pr-btn-secondary:hover {
        background: rgba(248, 113, 113, 0.16);
        color: #fecaca;
        border-color: rgba(248, 113, 113, 0.32);
      }

      .pr-btn-delete {
        height: 38px;
        padding: 0 14px;
        border: 1px solid rgba(248, 113, 113, 0.32);
        background: rgba(248, 113, 113, 0.12);
        color: #fecaca;
      }

      .pr-btn-delete:hover {
        background: rgba(239, 68, 68, 0.24);
        color: #ffffff;
      }

      .pr-info-box {
        margin-top: 24px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(37, 99, 235, 0.08);
        border: 1px solid rgba(96, 165, 250, 0.18);
      }

      .pr-info-box strong {
        color: #bfdbfe;
        font-size: 14px;
      }

      .pr-info-box p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.6;
      }

      .pr-modern-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 26px;
      }

      .pr-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .pr-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .pr-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .pr-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 32px;
        line-height: 1.2;
        word-break: break-word;
      }

      .pr-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .pr-result-list {
        padding: 18px;
      }

      .pr-result-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .pr-result-item:last-child {
        border-bottom: none;
      }

      .pr-result-item span {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.4;
      }

      .pr-result-item strong {
        color: #ffffff;
        font-size: 15px;
        text-align: right;
        white-space: nowrap;
      }

      .pr-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(34, 197, 94, 0.24);
        background: rgba(34, 197, 94, 0.08);
      }

      .pr-result-item.final span {
        color: #bbf7d0;
        font-weight: 800;
      }

      .pr-result-item.final strong {
        color: #86efac;
        font-size: 20px;
      }

      @media (max-width: 1100px) {
        .pr-modern-page {
          padding: 20px;
        }

        .pr-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .pr-modern-grid {
          grid-template-columns: 1fr;
        }

        .pr-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .pr-form-grid {
          grid-template-columns: 1fr;
        }

        .pr-sub-title {
          flex-direction: column;
          align-items: stretch;
        }

        .pr-modern-actions {
          flex-direction: column;
        }

        .pr-btn-primary,
        .pr-btn-secondary {
          width: 100%;
        }

        .pr-result-item {
          flex-direction: column;
        }

        .pr-result-item strong {
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
