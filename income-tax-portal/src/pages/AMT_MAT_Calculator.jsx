import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AMT_MAT_Calculator() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("");

  const initialAMT = {
    taxpayer: "",
    assessmentYear: "",
    isIFSC: "",
    totalIncome: "",
    normalTax: "",
    deduction80: "",
    deduction10AA: "",
    deduction35AD: "",
  };

  const initialMAT = {
    companyType: "",
    assessmentYear: "",
    isIFSC: "",
    netProfit: "",
    normalTax: "",
    posAdj: "",
    negAdj: "",
    posOCI: "",
    negOCI: "",
  };

  const [amt, setAmt] = useState(initialAMT);
  const [mat, setMat] = useState(initialMAT);

  const updateAMT = (k, v) => setAmt((p) => ({ ...p, [k]: v }));
  const updateMAT = (k, v) => setMat((p) => ({ ...p, [k]: v }));

  // 🔥 ROUNDING (VERY IMPORTANT)
  const round = (n) => Math.round(n);

  // ================= AMT SURCHARGE + MARGINAL RELIEF =================
  const calcAMTSurcharge = (ATI, tax, taxpayer, isIFSC) => {
  let rate = 0, prevRate = 0, threshold = 0;

// ---------------- INDIVIDUAL TYPE ----------------
  if (["Individual","HUF","AOP/BOI","AJP"].includes(taxpayer)) {
    if (ATI > 50000000) { rate = 37; prevRate = 25; threshold = 50000000; }
    else if (ATI > 20000000) { rate = 25; prevRate = 15; threshold = 20000000; }
    else if (ATI > 10000000) { rate = 15; prevRate = 10; threshold = 10000000; }
    else if (ATI > 5000000) { rate = 10; prevRate = 0; threshold = 5000000; }
  }

  // ---------------- CO-OPERATIVE SOCIETY ----------------
  else if (taxpayer === "Co-operative Society") {
    if (ATI > 10000000) {
      rate = 12;
      prevRate = 0;
      threshold = 10000000;
    }
  }

  // ---------------- FIRM / LLP / OTHERS ----------------
  else {
    if (ATI > 10000000) {
      rate = 12;
      prevRate = 0;
      threshold = 10000000;
    }
  }

  let surcharge = Math.round((tax * rate) / 100);

  // ✅ Marginal Relief (correct threshold-based)
  if (threshold > 0 && ATI > threshold) {
    const baseRate = isIFSC === "yes" ? 9 : 18.5;

    const baseTaxAtThreshold = Math.round(
      (threshold * baseRate) / 100
    );

    const lowerTax = Math.round(
      baseTaxAtThreshold +
      (baseTaxAtThreshold * prevRate) / 100
    );

    const incomeDiff = ATI - threshold;

    const maxAllowed = lowerTax + incomeDiff;

    const currentTotal = tax + surcharge;

    if (currentTotal > maxAllowed) {
      surcharge = Math.round(maxAllowed - tax);
    }
  }

  // ✅ Safety (edge case)
  if (surcharge < 0) surcharge = 0;

  return { rate, surcharge };
};
  // ================= MAT SURCHARGE + MARGINAL RELIEF =================
  const calcMATSurcharge = (profit, tax, type, isIFSC) => {
  let rate = 0, prevRate = 0, threshold = 0;

  if (type === "Domestic") {
    if (profit > 100000000) { rate = 12; prevRate = 7; threshold = 100000000; }
    else if (profit > 10000000) { rate = 7; prevRate = 0; threshold = 10000000; }
  } else {
    if (profit > 100000000) { rate = 5; prevRate = 2; threshold = 100000000; }
    else if (profit > 10000000) { rate = 2; prevRate = 0; threshold = 10000000; }
  }

  let surcharge = round((tax * rate) / 100);

  // ✅ Marginal Relief (ONLY when threshold crossed)
  if (threshold > 0 && profit > threshold) {
    const baseRate = isIFSC === "yes" ? 9 : 15;

    const baseTaxAtThreshold = round((threshold * baseRate) / 100);

    const lowerTax = round(
      baseTaxAtThreshold + (baseTaxAtThreshold * prevRate) / 100
    );

    const incomeDiff = profit - threshold;

    const maxAllowed = lowerTax + incomeDiff;

    const currentTotal = tax + surcharge;

    if (currentTotal > maxAllowed) {
      surcharge = round(maxAllowed - tax);
    }
  }

  return { rate, surcharge };
};
  // ================= AMT =================
  const amtCalc = useMemo(() => {
    const ti = +amt.totalIncome || 0;
    const nt = +amt.normalTax || 0;

    const ATI =
      ti +
      (+amt.deduction80 || 0) +
      (+amt.deduction10AA || 0) +
      (+amt.deduction35AD || 0);

    if (ATI <= 2000000) return { message: "AMT not applicable" };

    const rate = amt.isIFSC === "yes" ? 9 : 18.5;

    const tax = round((ATI * rate) / 100);

    const { rate: surchargeRate, surcharge } =
  calcAMTSurcharge(ATI, tax, amt.taxpayer, amt.isIFSC);

    const cess = round((tax + surcharge) * 0.04);

    const total = round(tax + surcharge + cess);

    return {
      ATI,
      rate,
      tax,
      surchargeRate,
      surcharge,
      cess,
      total,
      payable: Math.max(total, nt),
      credit: total > nt ? total - nt : 0,
    };
  }, [amt]);

  // ================= MAT =================
  const matCalc = useMemo(() => {
    const profit =
      (+mat.netProfit || 0) +
      (+mat.posAdj || 0) -
      (+mat.negAdj || 0) +
      (+mat.posOCI || 0) -
      (+mat.negOCI || 0);

    const nt = +mat.normalTax || 0;

    const rate = mat.isIFSC === "yes" ? 9 : 15;

    const tax = round((profit * rate) / 100);

    const { rate: surchargeRate, surcharge } =
  calcMATSurcharge(profit, tax, mat.companyType, mat.isIFSC);

    const cess = round((tax + surcharge) * 0.04);

    const total = round(tax + surcharge + cess);

    return {
      profit,
      rate,
      tax,
      surchargeRate,
      surcharge,
      cess,
      total,
      payable: Math.max(total, nt),
      credit: total > nt ? total - nt : 0,
    };
  }, [mat]);

  const resetAll = () => {
    setMode("");
    setAmt(initialAMT);
    setMat(initialMAT);
  };

  const years = [
    "2017-18","2018-19","2019-20","2020-21","2021-22",
    "2022-23","2023-24","2024-25","2025-26","2026-27"
  ];


 return (
  <div className="amm-modern-page">
    <div className="amm-modern-container">
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
      <div className="amm-modern-header">
        <div>
          <p className="amm-modern-kicker">Company & Non-Company Tax Utility</p>
          <h1>AMT / MAT Calculator</h1>
          <p>
            Calculate Alternate Minimum Tax under section 115JC and Minimum Alternate Tax under section 115JB.
          </p>
        </div>

        <div className="amm-modern-badge">
          <span>Selected Mode</span>
          <strong>{mode || "Not Selected"}</strong>
        </div>
      </div>

      <div className="amm-modern-grid">

        {/* LEFT FORM */}
        <div className="amm-modern-card">

          {/* MODE SELECT */}
          <div className="amm-section-title">
            <h2>Select Calculator Type</h2>
            <p>Choose AMT for non-company taxpayers or MAT for companies</p>
          </div>

          <div className="amm-mode-grid">
            <button
              type="button"
              onClick={() => setMode("AMT")}
              className={mode === "AMT" ? "amm-mode-btn active" : "amm-mode-btn"}
            >
              AMT
              <span>Section 115JC</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("MAT")}
              className={mode === "MAT" ? "amm-mode-btn active" : "amm-mode-btn"}
            >
              MAT
              <span>Section 115JB</span>
            </button>
          </div>

          {/* AMT FORM */}
          {mode === "AMT" && (
            <>
              <div className="amm-section-title small">
                <h2>AMT Basic Details</h2>
                <p>Enter taxpayer, assessment year and IFSC details</p>
              </div>

              <div className="amm-form-grid">
                <div className="amm-field">
                  <label>Taxpayer <span>*</span></label>
                  <select
                    value={amt.taxpayer}
                    onChange={(e) => updateAMT("taxpayer", e.target.value)}
                  >
                    <option value="">Select Taxpayer</option>
                    <option>Individual</option>
                    <option>HUF</option>
                    <option>AOP/BOI</option>
                    <option>AJP</option>
                    <option>LLP</option>
                    <option>Firm</option>
                    <option>Co-operative Society</option>
                    <option>Local Authority</option>
                  </select>
                </div>

                <div className="amm-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={amt.assessmentYear}
                    onChange={(e) => updateAMT("assessmentYear", e.target.value)}
                  >
                    <option value="">Select Assessment Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="amm-field">
                  <label>IFSC Unit?</label>
                  <select
                    value={amt.isIFSC}
                    onChange={(e) => updateAMT("isIFSC", e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="amm-section-title small">
                <h2>Income Details</h2>
                <p>Enter total income and normal tax liability</p>
              </div>

              <div className="amm-form-grid">
                <div className="amm-field">
                  <label>Total Income</label>
                  <input
                    type="number"
                    value={amt.totalIncome}
                    placeholder="Enter total income"
                    onChange={(e) => updateAMT("totalIncome", e.target.value)}
                  />
                </div>

                <div className="amm-field">
                  <label>Normal Tax Liability</label>
                  <input
                    type="number"
                    value={amt.normalTax}
                    placeholder="Enter normal tax liability"
                    onChange={(e) => updateAMT("normalTax", e.target.value)}
                  />
                </div>
              </div>

              <div className="amm-section-title small">
                <h2>Deductions / Adjustments</h2>
                <p>Enter deductions to compute adjusted total income</p>
              </div>

              <div className="amm-form-grid">
                <div className="amm-field">
                  <label>Part C Deduction</label>
                  <input
                    type="number"
                    value={amt.deduction80}
                    placeholder="80C–80RRB except 80P"
                    onChange={(e) => updateAMT("deduction80", e.target.value)}
                  />
                </div>

                <div className="amm-field">
                  <label>Section 10AA</label>
                  <input
                    type="number"
                    value={amt.deduction10AA}
                    placeholder="Enter deduction"
                    onChange={(e) => updateAMT("deduction10AA", e.target.value)}
                  />
                </div>

                <div className="amm-field">
                  <label>Section 35AD</label>
                  <input
                    type="number"
                    value={amt.deduction35AD}
                    placeholder="Enter deduction"
                    onChange={(e) => updateAMT("deduction35AD", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* MAT FORM */}
          {mode === "MAT" && (
            <>
              <div className="amm-section-title small">
                <h2>MAT Basic Details</h2>
                <p>Enter company type, assessment year and IFSC details</p>
              </div>

              <div className="amm-form-grid">
                <div className="amm-field">
                  <label>Company Type <span>*</span></label>
                  <select
                    value={mat.companyType}
                    onChange={(e) => updateMAT("companyType", e.target.value)}
                  >
                    <option value="">Select Company Type</option>
                    <option>Domestic</option>
                    <option>Foreign</option>
                  </select>
                </div>

                <div className="amm-field">
                  <label>Assessment Year <span>*</span></label>
                  <select
                    value={mat.assessmentYear}
                    onChange={(e) => updateMAT("assessmentYear", e.target.value)}
                  >
                    <option value="">Select Assessment Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="amm-field">
                  <label>IFSC Unit?</label>
                  <select
                    value={mat.isIFSC}
                    onChange={(e) => updateMAT("isIFSC", e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="amm-section-title small">
                <h2>Income Details</h2>
                <p>Enter book profit and normal tax liability</p>
              </div>

              <div className="amm-form-grid">
                <div className="amm-field">
                  <label>Net Profit</label>
                  <input
                    type="number"
                    value={mat.netProfit}
                    placeholder="Enter net profit"
                    onChange={(e) => updateMAT("netProfit", e.target.value)}
                  />
                </div>

                <div className="amm-field">
                  <label>Normal Tax Liability</label>
                  <input
                    type="number"
                    value={mat.normalTax}
                    placeholder="Enter normal tax liability"
                    onChange={(e) => updateMAT("normalTax", e.target.value)}
                  />
                </div>
              </div>

              <div className="amm-section-title small">
                <h2>Book Profit Adjustments</h2>
                <p>Enter positive / negative adjustments and OCI details</p>
              </div>

              <div className="amm-form-grid">
                <div className="amm-field">
                  <label>Positive Adjustment</label>
                  <input
                    type="number"
                    value={mat.posAdj}
                    placeholder="Enter amount"
                    onChange={(e) => updateMAT("posAdj", e.target.value)}
                  />
                </div>

                <div className="amm-field">
                  <label>Negative Adjustment</label>
                  <input
                    type="number"
                    value={mat.negAdj}
                    placeholder="Enter amount"
                    onChange={(e) => updateMAT("negAdj", e.target.value)}
                  />
                </div>

                <div className="amm-field">
                  <label>OCI Positive</label>
                  <input
                    type="number"
                    value={mat.posOCI}
                    placeholder="Enter amount"
                    onChange={(e) => updateMAT("posOCI", e.target.value)}
                  />
                </div>

                <div className="amm-field">
                  <label>OCI Negative</label>
                  <input
                    type="number"
                    value={mat.negOCI}
                    placeholder="Enter amount"
                    onChange={(e) => updateMAT("negOCI", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {!mode && (
            <div className="amm-empty-box">
              <strong>Select AMT or MAT</strong>
              <p>
                Choose a calculator type above to start entering details.
              </p>
            </div>
          )}

          <div className="amm-info-box">
            <strong>Information</strong>
            <p>
              This calculator shows tax, surcharge, cess, payable amount and available AMT/MAT credit based on selected mode.
            </p>
          </div>

          <div className="amm-modern-actions">
            <button onClick={resetAll} className="amm-btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT RESULT PANEL */}
        <div className="amm-result-panel">
          <div className="amm-result-head">
            <p>Computation Summary</p>

            {mode === "AMT" ? (
              <>
                <h2>
                  {amtCalc.message
                    ? "Not Applicable"
                    : `₹ ${(amtCalc.payable || 0).toLocaleString("en-IN")}`}
                </h2>
                <span>AMT Tax Payable</span>
              </>
            ) : mode === "MAT" ? (
              <>
                <h2>₹ {(matCalc.payable || 0).toLocaleString("en-IN")}</h2>
                <span>MAT Tax Payable</span>
              </>
            ) : (
              <>
                <h2>₹ 0</h2>
                <span>Select AMT or MAT</span>
              </>
            )}
          </div>

          <div className="amm-result-list">
            {mode === "AMT" && (
              <>
                {amtCalc.message ? (
                  <div className="amm-message-box">
                    {amtCalc.message}
                  </div>
                ) : (
                  <>
                    <div className="amm-result-item">
                      <span>Adjusted Total Income</span>
                      <strong>₹ {(amtCalc.ATI || 0).toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="amm-result-item">
                      <span>AMT Rate</span>
                      <strong>{amtCalc.rate || 0}%</strong>
                    </div>

                    <div className="amm-result-item">
                      <span>Tax</span>
                      <strong>₹ {(amtCalc.tax || 0).toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="amm-result-item">
                      <span>Surcharge ({amtCalc.surchargeRate || 0}%)</span>
                      <strong>₹ {(amtCalc.surcharge || 0).toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="amm-result-item">
                      <span>Cess 4%</span>
                      <strong>₹ {(amtCalc.cess || 0).toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="amm-result-item">
                      <span>Total AMT</span>
                      <strong>₹ {(amtCalc.total || 0).toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="amm-result-item">
                      <span>AMT Credit</span>
                      <strong>₹ {(amtCalc.credit || 0).toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="amm-result-item final">
                      <span>Tax Payable</span>
                      <strong>₹ {(amtCalc.payable || 0).toLocaleString("en-IN")}</strong>
                    </div>
                  </>
                )}
              </>
            )}

            {mode === "MAT" && (
              <>
                <div className="amm-result-item">
                  <span>Book Profit</span>
                  <strong>₹ {(matCalc.profit || 0).toLocaleString("en-IN")}</strong>
                </div>

                <div className="amm-result-item">
                  <span>MAT Rate</span>
                  <strong>{matCalc.rate || 0}%</strong>
                </div>

                <div className="amm-result-item">
                  <span>Tax</span>
                  <strong>₹ {(matCalc.tax || 0).toLocaleString("en-IN")}</strong>
                </div>

                <div className="amm-result-item">
                  <span>Surcharge ({matCalc.surchargeRate || 0}%)</span>
                  <strong>₹ {(matCalc.surcharge || 0).toLocaleString("en-IN")}</strong>
                </div>

                <div className="amm-result-item">
                  <span>Cess 4%</span>
                  <strong>₹ {(matCalc.cess || 0).toLocaleString("en-IN")}</strong>
                </div>

                <div className="amm-result-item">
                  <span>Total MAT</span>
                  <strong>₹ {(matCalc.total || 0).toLocaleString("en-IN")}</strong>
                </div>

                <div className="amm-result-item">
                  <span>MAT Credit</span>
                  <strong>₹ {(matCalc.credit || 0).toLocaleString("en-IN")}</strong>
                </div>

                <div className="amm-result-item final">
                  <span>Tax Payable</span>
                  <strong>₹ {(matCalc.payable || 0).toLocaleString("en-IN")}</strong>
                </div>
              </>
            )}

            {!mode && (
              <div className="amm-message-box">
                Select AMT or MAT to view result summary.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .amm-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .amm-modern-container {
        max-width: 1300px;
        margin: 0 auto;
      }

      .amm-modern-header {
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

      .amm-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .amm-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .amm-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .amm-modern-badge {
        min-width: 190px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .amm-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .amm-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .amm-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 26px;
        align-items: start;
      }

      .amm-modern-card,
      .amm-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .amm-modern-card {
        padding: 26px;
      }

      .amm-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .amm-section-title.small {
        margin-top: 28px;
      }

      .amm-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .amm-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .amm-mode-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .amm-mode-btn {
        min-height: 82px;
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(2, 6, 23, 0.48);
        color: #ffffff;
        font-size: 20px;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .amm-mode-btn span {
        display: block;
        margin-top: 6px;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 700;
      }

      .amm-mode-btn:hover {
        border-color: #60a5fa;
      }

      .amm-mode-btn.active {
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        border-color: rgba(96, 165, 250, 0.55);
        box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
      }

      .amm-mode-btn.active span {
        color: #dbeafe;
      }

      .amm-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .amm-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .amm-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
      }

      .amm-field label span {
        color: #f87171;
      }

      .amm-field input,
      .amm-field select {
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

      .amm-field input::placeholder {
        color: #64748b;
      }

      .amm-field input:focus,
      .amm-field select:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .amm-field option {
        background: #0f172a;
        color: #ffffff;
      }

      .amm-empty-box,
      .amm-info-box {
        margin-top: 24px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(37, 99, 235, 0.08);
        border: 1px solid rgba(96, 165, 250, 0.18);
      }

      .amm-empty-box strong,
      .amm-info-box strong {
        color: #bfdbfe;
        font-size: 14px;
      }

      .amm-empty-box p,
      .amm-info-box p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.6;
      }

      .amm-modern-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 26px;
      }

      .amm-btn-secondary {
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

      .amm-btn-secondary:hover {
        background: rgba(248, 113, 113, 0.16);
        color: #fecaca;
        border-color: rgba(248, 113, 113, 0.32);
      }

      .amm-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .amm-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .amm-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .amm-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 32px;
        line-height: 1.2;
        word-break: break-word;
      }

      .amm-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .amm-result-list {
        padding: 18px;
      }

      .amm-result-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .amm-result-item:last-child {
        border-bottom: none;
      }

      .amm-result-item span {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.4;
      }

      .amm-result-item strong {
        color: #ffffff;
        font-size: 15px;
        text-align: right;
        white-space: nowrap;
      }

      .amm-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(34, 197, 94, 0.24);
        background: rgba(34, 197, 94, 0.08);
      }

      .amm-result-item.final span {
        color: #bbf7d0;
        font-weight: 800;
      }

      .amm-result-item.final strong {
        color: #86efac;
        font-size: 20px;
      }

      .amm-message-box {
        padding: 16px;
        border-radius: 16px;
        background: rgba(245, 158, 11, 0.12);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #fde68a;
        font-size: 14px;
        font-weight: 800;
      }

      @media (max-width: 1100px) {
        .amm-modern-page {
          padding: 20px;
        }

        .amm-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .amm-modern-grid {
          grid-template-columns: 1fr;
        }

        .amm-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .amm-form-grid,
        .amm-mode-grid {
          grid-template-columns: 1fr;
        }

        .amm-modern-actions {
          flex-direction: column;
        }

        .amm-btn-secondary {
          width: 100%;
        }

        .amm-result-item {
          flex-direction: column;
        }

        .amm-result-item strong {
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