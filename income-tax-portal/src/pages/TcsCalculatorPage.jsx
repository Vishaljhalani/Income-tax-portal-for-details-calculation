import React, { useMemo, useState } from "react";

export default function TCSCalculatorPage() {
  // ===================== DATA =====================
  const financialYears = [
    "2016-17","2017-18","2018-19","2019-20","2020-21",
    "2021-22","2022-23","2023-24","2024-25","2025-26",
  ];
  const defaultForm = {
  financialYear: "",
  residentialStatus: "",
  buyerCategory: "",
  section: "",
  amount: "",
  thresholdInput: "",
  collectionDate: "",
  panNotAvailable: false,
  itrFiled: "yes",
  surchargeRate: "",
};
const recipientCategories = [
    "Individual",
    "HUF",
    "Firm",
    "Local Authority",
    "Association of Person",
    "Body of Individual",
    "Co-operative Society",
    "Artificial Judicial Person",
    "Foreign Company",
    "Domestic Company",
  ];
  const tcsSections = [
  {
    code: "206C-ALCOHOL",
    label: "206C(1) - Alcoholic liquor for human consumption",
    threshold: 0,
    rate: 2,
  },
  {
    code: "206C-TENDU",
    label: "206C(1) - Tendu leaves",
    threshold: 0,
    rate: 2,
  },
  {
    code: "206C-TIMBER",
    label: "206C(1) - Timber (forest lease or other mode)",
    threshold: 0,
    rate: 2,
  },
  {
    code: "206C-SCRAP",
    label: "206C(1) - Scrap",
    threshold: 0,
    rate: 2,
  },
  {
    code: "206C-MINERALS",
    label: "206C(1) - Minerals (coal, lignite, iron ore)",
    threshold: 0,
    rate: 2,
  },
  {
    code: "206C-1C",
    label: "206C(1C) - Parking lot / Toll plaza / Mining / Quarrying",
    threshold: 0,
    rate: 2,
  },
  {
    code: "206C-1F",
    label: "206C(1F) - Sale of motor vehicle",
    threshold: 1000000,
    rate: 1,
  },
  {
    code: "206C-1G-EDU",
    label: "206C(1G) - LRS Education / Medical",
    threshold: 1000000,
    rate: 2,
  },
  {
    code: "206C-1G-OTHER",
    label: "206C(1G) - LRS Other purposes",
    threshold: 1000000,
    rate: 20,
  },
  {
    code: "206C-1G-TOUR",
    label: "206C(1G) - Overseas tour programme package",
    threshold: 0,
    rate: 2,
  },
];


 const [form, setForm] = useState(defaultForm);
const [result, setResult] = useState(null);
  const update = (k, v) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // ===================== AUTO SECTION =====================
  const selectedSection = useMemo(() => {
    return tcsSections.find((s) => s.code === form.section);
  }, [form.section]);

  const amount = Number(form.amount) || 0;


  // ===================== CA LEVEL TCS ENGINE =====================
   const calculateTCS = () => {
  if (!selectedSection) return 0;

  let baseRate = selectedSection.rate;
  let threshold = selectedSection.threshold;

  // ✅ NEW ADDITION: CATEGORY BASED RATE OVERRIDE (SAFE PATCH)
  const category = form.buyerCategory;

  if (
    selectedSection.categoryRates &&
    selectedSection.categoryRates[category] !== undefined
  ) {
    baseRate = selectedSection.categoryRates[category];
  }

  // PAN logic (UNCHANGED)
  if (form.panNotAvailable) {
    baseRate = Math.max(baseRate, 5);
  }

  // Threshold logic (UNCHANGED)
  let taxable = amount > threshold ? amount - threshold : 0;

  let baseTCS = (taxable * baseRate) / 100;

  // Surcharge logic (UNCHANGED)
  let surcharge = 0;
  if (form.residentialStatus === "nonResident") {
    surcharge = (baseTCS * Number(form.surchargeRate)) / 100;
  }

  let tcsAfterSurcharge = baseTCS + surcharge;

  // Cess (UNCHANGED)
  let cess = tcsAfterSurcharge * 0.04;

  let finalTCS = tcsAfterSurcharge + cess;

  return {
    baseRate,
    threshold,
    baseTCS: baseTCS.toFixed(2),
    surcharge: surcharge.toFixed(2),
    cess: cess.toFixed(2),
    final: finalTCS.toFixed(2),
  };
};
  const handleCalculate = () => {
    const output = calculateTCS();
    setResult(output);
  };

  // ===================== RESET =====================
  const resetForm = () => {
  setForm(defaultForm);
  setResult(null);
};
  


  // ===================== UI =====================
 return (
  <div className="tcs-modern-page">
    <div className="tcs-modern-container">

      {/* HEADER */}
      <div className="tcs-modern-header">
        <div>
          <p className="tcs-modern-kicker">Income Tax Utility</p>
          <h1>TCS Calculator</h1>
          <p>
            Calculate Tax Collected at Source with rate, surcharge and cess breakup.
          </p>
        </div>

        <div className="tcs-modern-badge">
          <span>FY</span>
          <strong>{form.financialYear || "Not Selected"}</strong>
        </div>
      </div>

      <div className="tcs-modern-grid">

        {/* LEFT SIDE FORM */}
        <div className="tcs-modern-card">
          <div className="tcs-section-title">
            <h2>Collection Details</h2>
            <p>Fill basic details for TCS computation</p>
          </div>

          <div className="tcs-form-grid">

            <div className="tcs-field">
              <label>Financial Year <span>*</span></label>
              <select
                value={form.financialYear}
                onChange={(e) => update("financialYear", e.target.value)}
              >
                <option value="">Select FY</option>
                {financialYears.map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>
            </div>

            <div className="tcs-field">
              <label>Residential Status <span>*</span></label>
              <select
                value={form.residentialStatus || ""}
                onChange={(e) => update("residentialStatus", e.target.value)}
              >
                <option value="">Select Residential Status</option>
                <option value="resident">Resident</option>
                <option value="nonResident">Non-Resident</option>
              </select>
            </div>

            <div className="tcs-field">
              <label>Buyer Category <span>*</span></label>
              <select
                value={form.buyerCategory}
                onChange={(e) => update("buyerCategory", e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Individual">Individual</option>
                <option value="HUF">HUF</option>
                <option value="Firm">Firm</option>
                <option value="Association of Person">Association of Person</option>
                <option value="Body of Individual">Body of Individual</option>
                <option value="Co-operative Society">Co-operative Society</option>
                <option value="Artificial Judicial Person">Artificial Judicial Person</option>
                <option value="Domestic Company">Domestic Company</option>
                <option value="Local Authority">Local Authority</option>
                <option value="Foreign Company">Foreign Company</option>
              </select>
            </div>

            <div className="tcs-field">
              <label>Nature of Collection <span>*</span></label>
              <select
                value={form.section}
                onChange={(e) => update("section", e.target.value)}
              >
                <option value="">Select Nature of Collection</option>
                {tcsSections.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="tcs-field">
              <label>Amount Received / Debited <span>*</span></label>
              <input
                type="number"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
              />
            </div>

            <div className="tcs-field">
              <label>Date of Collection</label>
              <input
                type="date"
                value={form.collectionDate}
                onChange={(e) => update("collectionDate", e.target.value)}
              />
            </div>

            {form.residentialStatus === "nonResident" && (
              <div className="tcs-field">
                <label>Surcharge Rate</label>
                <select
                  value={form.surchargeRate}
                  onChange={(e) => update("surchargeRate", e.target.value)}
                >
                  <option value="">Select Surcharge Rate</option>
                  <option value="0">0%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="25">25%</option>
                  <option value="37">37%</option>
                </select>
              </div>
            )}

            <div className="tcs-check-box">
              <input
                type="checkbox"
                checked={form.panNotAvailable}
                onChange={(e) => update("panNotAvailable", e.target.checked)}
              />
              <div>
                <strong>PAN not available</strong>
                <p>Higher rate may apply as per applicable provision.</p>
              </div>
            </div>
          </div>

          <div className="tcs-modern-actions">
            <button onClick={handleCalculate} className="tcs-btn-primary">
              Calculate TCS
            </button>

            <button onClick={resetForm} className="tcs-btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT SIDE RESULT */}
        <div className="tcs-result-panel">
          <div className="tcs-result-head">
            <p>Computation Summary</p>
            <h2>₹ {result?.final || 0}</h2>
            <span>Final TCS Payable</span>
          </div>

          <div className="tcs-result-list">
            <div className="tcs-result-item">
              <span>Base Rate</span>
              <strong>{result?.baseRate || 0}%</strong>
            </div>

            <div className="tcs-result-item">
              <span>Base TCS</span>
              <strong>₹ {result?.baseTCS || 0}</strong>
            </div>

            <div className="tcs-result-item">
              <span>Surcharge</span>
              <strong>₹ {result?.surcharge || 0}</strong>
            </div>

            <div className="tcs-result-item">
              <span>Cess 4%</span>
              <strong>₹ {result?.cess || 0}</strong>
            </div>

            <div className="tcs-result-item final">
              <span>Total TCS</span>
              <strong>₹ {result?.final || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .tcs-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .tcs-modern-container {
        max-width: 1250px;
        margin: 0 auto;
      }

      .tcs-modern-header {
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

      .tcs-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .tcs-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .tcs-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .tcs-modern-badge {
        min-width: 170px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .tcs-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .tcs-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .tcs-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 26px;
        align-items: start;
      }

      .tcs-modern-card,
      .tcs-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .tcs-modern-card {
        padding: 26px;
      }

      .tcs-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .tcs-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .tcs-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .tcs-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .tcs-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .tcs-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
      }

      .tcs-field label span {
        color: #f87171;
      }

      .tcs-field input,
      .tcs-field select {
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

      .tcs-field input::placeholder {
        color: #64748b;
      }

      .tcs-field input:focus,
      .tcs-field select:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .tcs-field option {
        background: #0f172a;
        color: #ffffff;
      }

      .tcs-check-box {
        grid-column: span 2;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(37, 99, 235, 0.08);
        border: 1px solid rgba(96, 165, 250, 0.18);
      }

      .tcs-check-box input {
        width: 20px;
        height: 20px;
        accent-color: #3b82f6;
      }

      .tcs-check-box strong {
        color: #ffffff;
        font-size: 14px;
      }

      .tcs-check-box p {
        margin: 4px 0 0;
        color: #94a3b8;
        font-size: 12px;
      }

      .tcs-modern-actions {
        display: flex;
        justify-content: flex-end;
        gap: 14px;
        margin-top: 26px;
      }

      .tcs-btn-primary,
      .tcs-btn-secondary {
        border: none;
        height: 44px;
        padding: 0 24px;
        border-radius: 14px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tcs-btn-primary {
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        color: #ffffff;
        box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
      }

      .tcs-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 36px rgba(37, 99, 235, 0.35);
      }

      .tcs-btn-secondary {
        background: rgba(148, 163, 184, 0.12);
        color: #cbd5e1;
        border: 1px solid rgba(148, 163, 184, 0.22);
      }

      .tcs-btn-secondary:hover {
        background: rgba(248, 113, 113, 0.16);
        color: #fecaca;
        border-color: rgba(248, 113, 113, 0.32);
      }

      .tcs-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .tcs-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .tcs-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .tcs-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 34px;
      }

      .tcs-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .tcs-result-list {
        padding: 18px;
      }

      .tcs-result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .tcs-result-item:last-child {
        border-bottom: none;
      }

      .tcs-result-item span {
        color: #94a3b8;
        font-size: 14px;
      }

      .tcs-result-item strong {
        color: #ffffff;
        font-size: 16px;
      }

      .tcs-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(34, 197, 94, 0.24);
        background: rgba(34, 197, 94, 0.08);
      }

      .tcs-result-item.final span {
        color: #bbf7d0;
        font-weight: 800;
      }

      .tcs-result-item.final strong {
        color: #86efac;
        font-size: 20px;
      }

      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }

      @media (max-width: 1050px) {
        .tcs-modern-page {
          padding: 20px;
        }

        .tcs-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .tcs-modern-grid {
          grid-template-columns: 1fr;
        }

        .tcs-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .tcs-form-grid {
          grid-template-columns: 1fr;
        }

        .tcs-check-box {
          grid-column: span 1;
        }

        .tcs-modern-actions {
          flex-direction: column;
        }

        .tcs-btn-primary,
        .tcs-btn-secondary {
          width: 100%;
        }
      }
    `}</style>
  </div>
);
}