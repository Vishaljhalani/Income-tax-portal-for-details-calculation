import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";


export default function AdvanceTaxCalculator() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    residential: "resident",
    regime: "new",
    age: "below60",

    salary: 0,
    house: 0,

    business: 0,
    presumptive: 0,
    speculative: 0,

    // CAPITAL GAINS
    // STCG Applicable Rate Quarter-wise
    stcgApplicableQ1: 0,
    stcgApplicableQ2: 0,
    stcgApplicableQ3: 0,
    stcgApplicableQ4: 0,

    // STCG 20% Quarter-wise
    stcg20Q1: 0,
    stcg20Q2: 0,
    stcg20Q3: 0,
    stcg20Q4: 0,

    // LTCG 12.5% Quarter-wise
    ltcg125Q1: 0,
    ltcg125Q2: 0,
    ltcg125Q3: 0,
    ltcg125Q4: 0,

    // LTCG 20% Quarter-wise
    ltcg20Q1: 0,
    ltcg20Q2: 0,
    ltcg20Q3: 0,
    ltcg20Q4: 0,

    // LTCG Applicable Rate Quarter-wise
    ltcgApplicableQ1: 0,
    ltcgApplicableQ2: 0,
    ltcgApplicableQ3: 0,
    ltcgApplicableQ4: 0,

    stcg: 0,
    stcgRate: 0.15,
    bfSTCG: 0,

    // STCG Quarter-wise bifurcation
    stcgQ1: 0,
    stcgQ2: 0,
    stcgQ3: 0,
    stcgQ4: 0,

    ltcg: 0,
    ltcgRate: 0.20,
    bfLTCG: 0,

    // LTCG Quarter-wise bifurcation
    ltcgQ1: 0,
    ltcgQ2: 0,
    ltcgQ3: 0,
    ltcgQ4: 0,

    ltcg112A: 0,
    bfLTCG112A: 0,

    exemption54: 0,

    bfHP: 0,
    bfBusiness: 0,
    bfSpeculative: 0,

    deductions: 0,
    otherSources: 0,
  });

  const set = (k, v) => {
    const textFields = ["residential", "regime", "age"];

    setF({
      ...f,
      [k]: textFields.includes(k) ? v : Number(v) || 0,
    });
  };

  // ===== INCOME =====
  const computeIncome = () => {
    let hp = f.house;

    if (hp < 0) hp = Math.max(hp, -200000);

    let normal =
      f.salary +
      hp +
      f.business +
      f.presumptive -
      f.bfHP -
      f.bfBusiness;

    let speculative = f.speculative - f.bfSpeculative;

    return {
      normal: Math.max(0, normal),
      speculative: Math.max(0, speculative),
    };
  };

  // ===== SLAB =====
  const slabTax = (income) => {
    let tax = 0;

    if (f.regime === "new") {
      const slabs = [
        [400000, 0],
        [400000, 0.05],
        [400000, 0.10],
        [400000, 0.15],
        [400000, 0.20],
        [400000, 0.25],
        [Infinity, 0.30],
      ];

      let r = income;

      for (let [limit, rate] of slabs) {
        if (r <= 0) break;
        let t = Math.min(limit, r);
        tax += t * rate;
        r -= t;
      }
    } else {
      let basic = 250000;
      if (f.age === "senior") basic = 300000;
      if (f.age === "super") basic = 500000;

      if (income > basic) {
        if (income <= 500000) tax += (income - basic) * 0.05;
        else if (income <= 1000000) {
          tax += (500000 - basic) * 0.05;
          tax += (income - 500000) * 0.2;
        } else {
          tax += (500000 - basic) * 0.05;
          tax += 500000 * 0.2;
          tax += (income - 1000000) * 0.3;
        }
      }
    }

    return tax;
  };

  // ===== CAPITAL GAINS =====
  const capitalGainTax = () => {
    const totalSTCG =
      f.stcg +
      f.stcgQ1 +
      f.stcgQ2 +
      f.stcgQ3 +
      f.stcgQ4 +
      f.stcgApplicableQ1 +
      f.stcgApplicableQ2 +
      f.stcgApplicableQ3 +
      f.stcgApplicableQ4 +
      f.stcg20Q1 +
      f.stcg20Q2 +
      f.stcg20Q3 +
      f.stcg20Q4;

    const totalLTCG =
      f.ltcg +
      f.ltcgQ1 +
      f.ltcgQ2 +
      f.ltcgQ3 +
      f.ltcgQ4 +
      f.ltcg125Q1 +
      f.ltcg125Q2 +
      f.ltcg125Q3 +
      f.ltcg125Q4 +
      f.ltcg20Q1 +
      f.ltcg20Q2 +
      f.ltcg20Q3 +
      f.ltcg20Q4 +
      f.ltcgApplicableQ1 +
      f.ltcgApplicableQ2 +
      f.ltcgApplicableQ3 +
      f.ltcgApplicableQ4;

    let stcgNet = totalSTCG - f.bfSTCG;

    let stcgLoss = Math.min(0, stcgNet);

    let ltcgNet = totalLTCG - f.bfLTCG + stcgLoss;

    // 112A limit ₹1.25L
    let ltcg112A = f.ltcg112A - f.bfLTCG112A;
    ltcg112A = Math.max(0, ltcg112A - 125000);

    stcgNet = Math.max(0, stcgNet);
    ltcgNet = Math.max(0, ltcgNet);

    let tax =
      stcgNet * f.stcgRate +
      ltcgNet * f.ltcgRate +
      ltcg112A * 0.1;

    tax -= f.exemption54;

    return Math.max(0, tax);
  };

  // ===== SURCHARGE =====
  const surcharge = (income, tax) => {
    let rate = 0;

    if (income > 50000000) rate = 0.37;
    else if (income > 20000000) rate = 0.25;
    else if (income > 10000000) rate = 0.15;
    else if (income > 5000000) rate = 0.1;

    return tax * rate;
  };

  // ===== FINAL TAX =====
  const calculateTax = () => {
    let { normal, speculative } = computeIncome();

    let income = normal;

    if (f.regime === "old") income -= f.deductions;

    income = Math.max(0, income);

    let slab = slabTax(income);

    if (f.residential === "resident") {
      if (f.regime === "new" && income <= 1200000) slab = 0;
      if (f.regime === "old" && income <= 500000) slab = 0;
    }

    let speculativeTax = speculative * 0.3;

    let cg = capitalGainTax();

    let total = slab + cg + speculativeTax;

    total += surcharge(income, total);

    total += total * 0.04;

    return Math.round(total);
  };

  const tax = calculateTax();

  const advanceTax =
    tax > 10000
      ? [
          { label: "15 Jun (15%)", value: tax * 0.15 },
          { label: "15 Sep (45%)", value: tax * 0.45 },
          { label: "15 Dec (75%)", value: tax * 0.75 },
          { label: "15 Mar (100%)", value: tax },
        ]
      : [];


  const incomeFields = [
    { key: "salary", label: "Salary Income", placeholder: "Enter Salary Income" },
    { key: "house", label: "House Property Income / Loss", placeholder: "Enter House Property Income / Loss" },
    { key: "business", label: "Business Income", placeholder: "Enter Business Income" },
    { key: "presumptive", label: "Presumptive Income", placeholder: "Enter Presumptive Income" },
    { key: "speculative", label: "Speculative Income", placeholder: "Enter Speculative Income" },
  ];

  const capitalGainFields = [
    { key: "bfSTCG", label: "BF STCG Loss", placeholder: "BF STCG Loss" },
    { key: "stcgApplicableQ1", label: "STCG Applicable Rate Q1", placeholder: "STCG Applicable Rate Q1 (Apr-Jun)" },
    { key: "stcgApplicableQ2", label: "STCG Applicable Rate Q2", placeholder: "STCG Applicable Rate Q2 (Jul-Sep)" },
    { key: "stcgApplicableQ3", label: "STCG Applicable Rate Q3", placeholder: "STCG Applicable Rate Q3 (Oct-Dec)" },
    { key: "stcgApplicableQ4", label: "STCG Applicable Rate Q4", placeholder: "STCG Applicable Rate Q4 (Jan-Mar)" },
    { key: "stcg20Q1", label: "STCG 20% Q1", placeholder: "STCG 20% Q1 (Apr-Jun)" },
    { key: "stcg20Q2", label: "STCG 20% Q2", placeholder: "STCG 20% Q2 (Jul-Sep)" },
    { key: "stcg20Q3", label: "STCG 20% Q3", placeholder: "STCG 20% Q3 (Oct-Dec)" },
    { key: "stcg20Q4", label: "STCG 20% Q4", placeholder: "STCG 20% Q4 (Jan-Mar)" },
    { key: "otherSources", label: "Other Sources", placeholder: "Other Sources" },
    { key: "bfLTCG", label: "BF LTCG Loss", placeholder: "BF LTCG Loss" },
    { key: "ltcg125Q1", label: "LTCG 12.5% Q1", placeholder: "LTCG 12.5% Q1 (Apr-Jun)" },
    { key: "ltcg125Q2", label: "LTCG 12.5% Q2", placeholder: "LTCG 12.5% Q2 (Jul-Sep)" },
    { key: "ltcg125Q3", label: "LTCG 12.5% Q3", placeholder: "LTCG 12.5% Q3 (Oct-Dec)" },
    { key: "ltcg125Q4", label: "LTCG 12.5% Q4", placeholder: "LTCG 12.5% Q4 (Jan-Mar)" },
    { key: "ltcg20Q1", label: "LTCG 20% Q1", placeholder: "LTCG 20% Q1 (Apr-Jun)" },
    { key: "ltcg20Q2", label: "LTCG 20% Q2", placeholder: "LTCG 20% Q2 (Jul-Sep)" },
    { key: "ltcg20Q3", label: "LTCG 20% Q3", placeholder: "LTCG 20% Q3 (Oct-Dec)" },
    { key: "ltcg20Q4", label: "LTCG 20% Q4", placeholder: "LTCG 20% Q4 (Jan-Mar)" },
    { key: "ltcgApplicableQ1", label: "LTCG Applicable Rate Q1", placeholder: "LTCG Applicable Rate Q1 (Apr-Jun)" },
    { key: "ltcgApplicableQ2", label: "LTCG Applicable Rate Q2", placeholder: "LTCG Applicable Rate Q2 (Jul-Sep)" },
    { key: "ltcgApplicableQ3", label: "LTCG Applicable Rate Q3", placeholder: "LTCG Applicable Rate Q3 (Oct-Dec)" },
    { key: "ltcgApplicableQ4", label: "LTCG Applicable Rate Q4", placeholder: "LTCG Applicable Rate Q4 (Jan-Mar)" },
    { key: "ltcg112A", label: "LTCG 112A", placeholder: "LTCG 112A (10% >1.25L)" },
    { key: "bfLTCG112A", label: "BF 112A Loss", placeholder: "BF 112A Loss" },
  ];

  const adjustmentFields = [
    { key: "exemption54", label: "Sec 54 Exemption", placeholder: "Sec 54 Exemption" },
    { key: "bfHP", label: "BF HP Loss", placeholder: "BF HP Loss" },
    { key: "bfBusiness", label: "BF Business Loss", placeholder: "BF Business Loss" },
    { key: "bfSpeculative", label: "BF Speculative Loss", placeholder: "BF Speculative Loss" },
    { key: "deductions", label: "Deductions", placeholder: "Deductions" },
  ];

  const formatAmount = (value) => Math.round(value || 0).toLocaleString("en-IN");

  return (
    <>
    
      <Breadcrumb current="Advance Tax Calculator" />
      

      <div className="advance-modern-page">
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

        <div className="advance-modern-container">
          <header className="advance-modern-header">
            <div>
              <p className="advance-modern-kicker">Tax Tool</p>
              <h1>Advance Tax Calculator</h1>
              <p>
                Calculate total tax liability and installment-wise advance tax payable.
              </p>
            </div>

            <div className="advance-modern-badge">
              <span>Estimated Tax</span>
              <strong>₹ {formatAmount(tax)}</strong>
            </div>
          </header>

          <main className="advance-modern-grid">
            <section className="advance-left-stack">
              <div className="advance-modern-card">
                <div className="advance-section-title">
                  <h2>Tax Profile</h2>
                  <p>Configure residential status, regime and age category.</p>
                </div>

                <div className="advance-form-grid three">
                  <div className="advance-field">
                    <label>Residential Status</label>
                    <select
                      value={f.residential}
                      onChange={(e) => set("residential", e.target.value)}
                    >
                      <option value="resident">Resident</option>
                      <option value="nonResident">Non Resident</option>
                    </select>
                  </div>

                  <div className="advance-field">
                    <label>Tax Regime</label>
                    <select
                      value={f.regime}
                      onChange={(e) => set("regime", e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="old">Old</option>
                    </select>
                  </div>

                  <div className="advance-field">
                    <label>Age Category</label>
                    <select
                      value={f.age}
                      onChange={(e) => set("age", e.target.value)}
                    >
                      <option value="below60">Below 60</option>
                      <option value="senior">60+</option>
                      <option value="super">80+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="advance-modern-card">
                <div className="advance-section-title">
                  <h2>Income Details</h2>
                  <p>Enter all income heads applicable for the financial year.</p>
                </div>

                <div className="advance-form-grid">
                  {incomeFields.map((item) => (
                    <div className="advance-field" key={item.key}>
                      <label>{item.label}</label>
                      <input
                        type="number"
                        placeholder={item.placeholder}
                        onChange={(e) => set(item.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="advance-modern-card">
                <div className="advance-section-title">
                  <h2>Capital Gains</h2>
                  <p>Quarterly capital gain bifurcation and brought forward losses.</p>
                </div>

                <div className="advance-form-grid">
                  {capitalGainFields.map((item) => (
                    <div className="advance-field" key={item.key}>
                      <label>{item.label}</label>
                      <input
                        type="number"
                        placeholder={item.placeholder}
                        onChange={(e) => set(item.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="advance-modern-card">
                <div className="advance-section-title">
                  <h2>Adjustments & Deductions</h2>
                  <p>Exemptions, deductions and brought forward losses.</p>
                </div>

                <div className="advance-form-grid">
                  {adjustmentFields.map((item) => (
                    <div className="advance-field" key={item.key}>
                      <label>{item.label}</label>
                      <input
                        type="number"
                        placeholder={item.placeholder}
                        onChange={(e) => set(item.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="advance-result-panel">
              <div className="advance-result-head">
                <p>Final Output</p>
                <h2>₹ {tax.toLocaleString("en-IN")}</h2>
                <span>Estimated Total Tax Liability</span>
              </div>

              <div className="advance-result-list">
                <div className="advance-result-item">
                  <span>Residential Status</span>
                  <strong>{f.residential === "resident" ? "Resident" : "Non Resident"}</strong>
                </div>

                <div className="advance-result-item">
                  <span>Tax Regime</span>
                  <strong>{f.regime === "new" ? "New" : "Old"}</strong>
                </div>

                <div className="advance-result-item">
                  <span>Age Category</span>
                  <strong>
                    {f.age === "below60" ? "Below 60" : f.age === "senior" ? "60+" : "80+"}
                  </strong>
                </div>

                <div className="advance-result-item final">
                  <span>Total Tax Liability</span>
                  <strong>₹ {tax.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="advance-schedule-wrap">
                <div className="advance-schedule-title">
                  <h3>Advance Tax Schedule</h3>
                  <p>Installment-wise advance tax payable.</p>
                </div>

                {advanceTax.length > 0 ? (
                  <div className="advance-schedule-list">
                    {advanceTax.map((a, i) => (
                      <div className="advance-schedule-item" key={i}>
                        <span>{a.label}</span>
                        <strong>₹ {formatAmount(a.value)}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="advance-info-box">
                    <strong>No Advance Tax Schedule</strong>
                    <p>Advance tax schedule will show when calculated tax exceeds ₹10,000.</p>
                  </div>
                )}
              </div>
            </aside>
          </main>
        </div>

        <style>{`
          .advance-modern-page {
            min-height: 100vh;
            background:
              radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
              linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
            color: #e5e7eb;
            padding: 34px;
            font-family: Inter, Arial, sans-serif;
          }

          .advance-modern-container {
            max-width: 1250px;
            margin: 0 auto;
          }

          .advance-modern-header {
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

          .advance-modern-kicker {
            color: #60a5fa;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 12px;
            font-weight: 800;
            margin: 0 0 8px;
          }

          .advance-modern-header h1 {
            font-size: 36px;
            line-height: 1.1;
            margin: 0;
            color: #ffffff;
          }

          .advance-modern-header p {
            margin: 10px 0 0;
            color: #94a3b8;
            font-size: 15px;
          }

          .advance-modern-badge {
            min-width: 190px;
            padding: 18px;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
            border: 1px solid rgba(96, 165, 250, 0.28);
            text-align: center;
          }

          .advance-modern-badge span {
            display: block;
            color: #93c5fd;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 5px;
          }

          .advance-modern-badge strong {
            color: #ffffff;
            font-size: 20px;
          }

          .advance-modern-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 380px;
            gap: 26px;
            align-items: start;
          }

          .advance-left-stack {
            display: grid;
            gap: 24px;
          }

          .advance-modern-card,
          .advance-result-panel {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 24px;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
          }

          .advance-modern-card {
            padding: 26px;
          }

          .advance-section-title {
            margin-bottom: 24px;
            padding-bottom: 18px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.15);
          }

          .advance-section-title h2 {
            margin: 0;
            color: #ffffff;
            font-size: 22px;
          }

          .advance-section-title p {
            margin: 7px 0 0;
            color: #94a3b8;
            font-size: 14px;
          }

          .advance-form-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .advance-form-grid.three {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .advance-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .advance-field label {
            color: #cbd5e1;
            font-size: 13px;
            font-weight: 700;
          }

          .advance-field input,
          .advance-field select {
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

          .advance-field select {
            cursor: pointer;
          }

          .advance-field input::placeholder {
            color: #64748b;
          }

          .advance-field input:focus,
          .advance-field select:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
            background: rgba(15, 23, 42, 0.95);
          }

          .advance-result-panel {
            overflow: hidden;
            position: sticky;
            top: 22px;
          }

          .advance-result-head {
            padding: 26px;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
            border-bottom: 1px solid rgba(148, 163, 184, 0.14);
          }

          .advance-result-head p {
            margin: 0;
            color: #bfdbfe;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }

          .advance-result-head h2 {
            margin: 14px 0 4px;
            color: #ffffff;
            font-size: 32px;
            line-height: 1.2;
            word-break: break-word;
          }

          .advance-result-head span {
            color: #93c5fd;
            font-size: 13px;
            font-weight: 700;
          }

          .advance-result-list,
          .advance-schedule-wrap {
            padding: 18px;
          }

          .advance-result-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 14px;
            padding: 15px 0;
            border-bottom: 1px solid rgba(148, 163, 184, 0.12);
          }

          .advance-result-item span,
          .advance-schedule-item span {
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.4;
          }

          .advance-result-item strong,
          .advance-schedule-item strong {
            color: #ffffff;
            font-size: 15px;
            text-align: right;
            white-space: nowrap;
          }

          .advance-result-item.final {
            margin-top: 10px;
            padding: 16px;
            border-radius: 16px;
            border: 1px solid rgba(34, 197, 94, 0.24);
            background: rgba(34, 197, 94, 0.08);
          }

          .advance-result-item.final span {
            color: #bbf7d0;
            font-weight: 800;
          }

          .advance-result-item.final strong {
            color: #86efac;
            font-size: 20px;
          }

          .advance-schedule-wrap {
            padding-top: 0;
          }

          .advance-schedule-title {
            padding-top: 18px;
            border-top: 1px solid rgba(148, 163, 184, 0.14);
            margin-bottom: 12px;
          }

          .advance-schedule-title h3 {
            margin: 0;
            color: #ffffff;
            font-size: 18px;
          }

          .advance-schedule-title p {
            margin: 6px 0 0;
            color: #94a3b8;
            font-size: 13px;
          }

          .advance-schedule-list {
            display: grid;
            gap: 10px;
          }

          .advance-schedule-item {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 14px;
            border-radius: 16px;
            background: rgba(2, 6, 23, 0.48);
            border: 1px solid rgba(148, 163, 184, 0.14);
          }

          .advance-info-box {
            padding: 16px;
            border-radius: 18px;
            background: rgba(37, 99, 235, 0.08);
            border: 1px solid rgba(96, 165, 250, 0.18);
          }

          .advance-info-box strong {
            color: #bfdbfe;
            font-size: 14px;
          }

          .advance-info-box p {
            margin: 7px 0 0;
            color: #94a3b8;
            font-size: 13px;
            line-height: 1.6;
          }

          @media (max-width: 1050px) {
            .advance-modern-page {
              padding: 20px;
            }

            .advance-modern-header {
              flex-direction: column;
              align-items: flex-start;
            }

            .advance-modern-grid {
              grid-template-columns: 1fr;
            }

            .advance-result-panel {
              position: static;
            }

            .advance-form-grid.three {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 680px) {
            .advance-form-grid {
              grid-template-columns: 1fr;
            }

            .advance-result-item,
            .advance-schedule-item {
              flex-direction: column;
            }

            .advance-result-item strong,
            .advance-schedule-item strong {
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
    </>
  );
}
