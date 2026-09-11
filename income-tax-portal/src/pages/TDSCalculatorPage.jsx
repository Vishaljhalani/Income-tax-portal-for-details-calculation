import React, { useMemo, useState, useEffect } from "react";

export default function TDSCalculatorPage() {
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

  const financialYears = [
    "2016-17",
    "2017-18",
    "2018-19",
    "2019-20",
    "2020-21",
    "2021-22",
    "2022-23",
    "2023-24",
    "2024-25",
    "2025-26",
  ];

  const residentTDSSections = [
    // Core salary + interest

    {
    code: "192",
    label: "192 - Salary",
    threshold: 0,
    rate: "Slab Rates",
  },
  {
    code: "192A",
    label: "192A - Premature withdrawal from EPF",
    threshold: 50000,
    rate: "10%",
  },
  {
    code: "193",
    label: "193 - Interest on Securities",
    threshold: 10000,
    rate: "10%",
  },
  {
    code: "194",
    label: "194 - Dividends",
    threshold: 10000,
    rate: "10%",
  },
  {
    code: "194A",
    label: "194A - Interest on bank/post office deposits",
    threshold: 50000,
    rate: "10%",
  },
  {
    code: "194A-SC",
    label: "194A - Senior Citizen Interest",
    threshold: 100000,
    rate: "10%",
  },
  {
    code: "194A-O",
    label: "194A - Interest (Others)",
    threshold: 10000,
    rate: "10%",
  },
  {
    code: "194K",
    label: "194K - Mutual Fund Dividend",
    threshold: 10000,
    rate: "10%",
  },
  {
    code: "194B",
    label: "194B - Lottery / Gambling Winnings",
    threshold: 10000,
    rate: "30%",
  },
  {
    code: "194BA",
    label: "194BA - Online Gaming Winnings",
    threshold: 0,
    rate: "30%",
  },
  {
    code: "194BB",
    label: "194BB - Horse Race Winnings",
    threshold: 10000,
    rate: "30%",
  },
  {
    code: "194C",
    label: "194C - Contractor Payment",
    threshold: 30000,
    yearlyThreshold: 100000,
    rate: "1% Individual/HUF, 2% Others",
  },
  {
    code: "194D",
    label: "194D - Insurance Commission",
    threshold: 20000,
    rate: "2% Individual/HUF, 10% Others",
  },
  {
    code: "194DA",
    label: "194DA - Life Insurance Policy",
    threshold: 100000,
    rate: "2%",
  },
  {
    code: "194EE",
    label: "194EE - NSS Payment",
    threshold: 2500,
    rate: "10%",
  },
  {
    code: "194G",
    label: "194G - Lottery Commission",
    threshold: 20000,
    rate: "2%",
  },
  {
    code: "194H",
    label: "194H - Commission / Brokerage",
    threshold: 20000,
    rate: "2%",
  },
  {
    code: "194J-A",
    label: "194J(a) - Technical Services",
    threshold: 50000,
    rate: "2%",
  },
  {
    code: "194J-B",
    label: "194J(b) - Professional Services",
    threshold: 50000,
    rate: "10%",
  },
  {
    code: "194I-A",
    label: "194I(a) - Rent Plant & Machinery",
    threshold: 50000,
    rate: "2%",
  },
  {
    code: "194I-B",
    label: "194I(b) - Rent Land/Building/Furniture",
    threshold: 50000,
    rate: "10%",
  },
  {
    code: "194IA",
    label: "194IA - Immovable Property Transfer",
    threshold: 5000000,
    rate: "1%",
  },
  {
    code: "194IB",
    label: "194IB - Rent by Individual/HUF",
    threshold: 50000,
    rate: "2%",
  },
  {
    code: "194IC",
    label: "194IC - Joint Development Agreement",
    threshold: 0,
    rate: "10%",
  },
  {
    code: "194LA",
    label: "194LA - Compensation on Property Transfer",
    threshold: 500000,
    rate: "10%",
  },
  {
    code: "194LBA",
    label: "194LBA - Business Trust Income",
    threshold: 0,
    rate: "10%",
  },
  {
    code: "194LBB",
    label: "194LBB - Investment Fund Income",
    threshold: 0,
    rate: "10%",
  },
  {
    code: "194LBC",
    label: "194LBC - Securitization Trust Income",
    threshold: 0,
    rate: "10%",
  },
  {
    code: "194M",
    label: "194M - Contract/Brokerage/Professional Fees",
    threshold: 5000000,
    rate: "2%",
  },
  {
  code: "194N",
  label: "194N - Cash Withdrawal",
  threshold: 10000000, // Normal threshold 1 Crore
  cooperativeThreshold: 30000000, // Co-operative Society 3 Crore
  noITRThreshold: 2000000, // 20 Lakh if no ITR
  rate: "2% / 5% conditional",
  note: "2% above 1Cr, 3Cr for Co-op Society, special rates if ITR not filed",
},
  {
    code: "194O",
    label: "194O - E-commerce Participant",
    threshold: 500000,
    rate: "0.10%",
  },
  {
    code: "194P",
    label: "194P - Specified Senior Citizen",
    threshold: 0,
    rate: "Slab Rates",
  },
  {
    code: "194Q",
    label: "194Q - Purchase of Goods",
    threshold: 5000000,
    rate: "0.10%",
  },
  {
    code: "194R",
    label: "194R - Benefits / Perquisites",
    threshold: 20000,
    rate: "10%",
  },
  {
    code: "194S",
    label: "194S - Virtual Digital Asset",
    threshold: 10000,
    rate: "1%",
  },
  {
    code: "194S-SP",
    label: "194S - VDA (Specified Person)",
    threshold: 50000,
    rate: "1%",
  },
  // ==============================
// SECTION 194T — RESIDENT
// Payment to Partner
// ==============================

{
  code: "194T",
  label: "194T - Payment to Partner",
  description:
    "Salary, remuneration, commission, bonus or interest to partner of firm (w.e.f. 01-04-2025)",
  threshold: 20000,
  rate: "10%",
}
];
const nonResidentTDSSections = [
  {
    code: "192",
    label: "192 - Payment of Salary",
    description: "Payment of Salary",
    rate: "Slab Rates",
  },
  {
    code: "192A",
    label: "192A - EPF Withdrawal",
    description:
      "Payment of accumulated balance of provident fund taxable in hands of employee",
    rate: "10%",
  },
  {
    code: "194B",
    label: "194B - Lottery / Gambling Winnings",
    description:
      "Lottery, crossword puzzles, card games, gambling, betting winnings",
    rate: "30%",
  },
  {
    code: "194BA",
    label: "194BA - Online Gaming Winnings",
    description: "Income by way of winnings from any online game",
    rate: "30%",
  },
  {
    code: "194BB",
    label: "194BB - Horse Race Winnings",
    description: "Income by way of winnings from horse races",
    rate: "30%",
  },
  {
    code: "194E",
    label: "194E - Non Resident Sportsman",
    description:
      "Payment to non-resident sportsmen / sports association",
    rate: "20%",
  },
  {
    code: "194EE",
    label: "194EE - NSS Payment",
    description:
      "Payment in respect of deposits under National Savings Scheme",
    rate: "10%",
  },
  {
    code: "194F",
    label: "194F - Mutual Fund Repurchase",
    description:
      "Payment on account of repurchase of unit by Mutual Fund / UTI",
    rate: "20%",
  },
  {
    code: "194G",
    label: "194G - Lottery Commission",
    description:
      "Commission on sale of lottery tickets",
    rate: "2%",
  },
  {
    code: "194LB",
    label: "194LB - Infrastructure Debt Fund",
    description:
      "Interest on infrastructure debt fund",
    rate: "5%",
  },
  {
    code: "194LBA-2A",
    label: "194LBA(2) - Section 10(23FC)(a)",
    description:
      "Business trust payment under section 10(23FC)(a)",
    rate: "5%",
  },
  {
    code: "194LBA-2B",
    label: "194LBA(2) - Section 10(23FC)(b)",
    description:
      "Business trust payment under section 10(23FC)(b)",
    rate: "10%",
  },
  {
    code: "194LBA-3",
    label: "194LBA(3) - Section 10(23FCA)",
    description:
      "Business trust payment under section 10(23FCA)",
    rate: "30%",
  },
  {
    code: "194LBB",
    label: "194LBB - Investment Fund Income",
    description:
      "Income from investment fund to unit holder",
    rate: "30%",
  },
  {
    code: "194LBC",
    label: "194LBC - Securitisation Trust",
    description:
      "Income from securitisation trust",
    rate: "30%",
  },
  {
    code: "194LC-1",
    label: "194LC - Long Term Bond / RDB IFSC",
    description:
      "Interest on long term bond or RDB listed on IFSC",
    rate: "4%",
  },
  {
    code: "194LC-2",
    label: "194LC - Bond issued after 01-04-2023",
    description:
      "Specified bonds issued after 01-04-2023",
    rate: "9%",
  },
  {
    code: "194LD",
    label: "194LD - Rupee Bond / Govt Securities",
    description:
      "Interest on rupee denominated bond / government securities",
    rate: "5%",
  },
  {
  code: "194N",
  label: "194N - Cash Withdrawal",
  description:
    "Cash withdrawal exceeding ₹1 Crore = 2%; if ITR not filed for preceding 3 years: above ₹20 Lakh to ₹1 Crore = 2%, above ₹1 Crore = 5%",
  normalThreshold: 10000000, // 1 Crore
  noITRThreshold: 2000000,   // 20 Lakh
  highRateThreshold: 10000000, // 1 Crore
  rate: "2% / 5%",
},

{
  code: "194T",
  label: "194T - Payment to Partner",
  description:
    "Salary, remuneration, commission, bonus or interest to partner of firm (w.e.f. 01-04-2025)",
  threshold: 20000,
  rate: "10%",
}
];



  
// ==========================================
// SECTION 195 (a) to (m)
// NON-RESIDENT COMPLETE MASTER
// Exact Rate + Description + Threshold
// Add inside nonResidentTDSSections
// ==========================================

const section195Master = [
  {
    code: "195-A",
    label: "195(a) - Investment Income (NRI)",
    description:
      "Income in respect of investment made by a Non-Resident Indian Citizen",
    threshold: 0,
    rate: 20,
  },

  {
    code: "195-B",
    label: "195(b) - LTCG u/s 115E",
    description:
      "Long-term capital gains referred to in Section 115E",
    threshold: 0,
    rate: 20,
  },

  {
    code: "195-C",
    label: "195(c) - LTCG u/s 112",
    description:
      "Long-term capital gains referred to in Section 112",
    threshold: 0,
    rate: 12.5,
  },

  {
    code: "195-D",
    label: "195(d) - LTCG u/s 112A",
    description:
      "Long-term capital gains u/s 112A exceeding ₹1,25,000",
    threshold: 125000,
    rate: 12.5,
  },

  {
    code: "195-E",
    label: "195(e) - STCG u/s 111A",
    description:
      "Short-term capital gains referred to in Section 111A",
    threshold: 0,
    rate: 12.5,
  },

  {
    code: "195-F",
    label: "195(f) - Other LTCG",
    description:
      "Any other long-term capital gains",
    threshold: 0,
    rate: 20,
  },

  {
    code: "195-G",
    label: "195(g) - IFSC Dividend",
    description:
      "Dividend from unit in International Financial Services Centre",
    threshold: 0,
    rate: 12.5,
  },

  {
    code: "195-H",
    label: "195(h) - Other Dividend",
    description:
      "Dividend other than IFSC dividend",
    threshold: 0,
    rate: 10,
  },

  {
    code: "195-I",
    label: "195(i) - Foreign Currency Borrowing Interest",
    description:
      "Interest on foreign currency borrowings payable by Govt or Indian concern",
    threshold: 0,
    rate: 20,
  },

  {
    code: "195-J",
    label: "195(j) - Royalty (Book Copyright / Software)",
    description:
      "Royalty for transfer/licensing of specified book copyrights or software u/s 115A",
    threshold: 0,
    rate: 20,
  },

  {
    code: "195-K",
    label: "195(k) - Other Royalty",
    description:
      "Royalty income other than section 195(j)",
    threshold: 0,
    rate: 20,
  },

  {
    code: "195-L",
    label: "195(l) - Fees for Technical Services",
    description:
      "Fees for technical services under govt approved agreement",
    threshold: 0,
    rate: 20,
  },

  {
    code: "195-M",
    label: "195(m) - Any Other Income",
    description:
      "Any other income payable to Non-Resident",
    threshold: 0,
    rate: 20,
  },

  {
    code: "196A",
    label: "196A - Units of Non Resident",
    description:
      "Income in respect of units of non-resident",
    rate: "30%",
  },
  {
    code: "196B-1",
    label: "196B - Income from Units",
    description:
      "Income from units under section 115AB",
    rate: "20%",
  },
  {
    code: "196B-2",
    label: "196B - LTCG on Units",
    description:
      "Long-term capital gain on transfer of units",
    rate: "12.5%",
  },
  {
    code: "196C-1",
    label: "196C - Interest / Dividend on Bonds",
    description:
      "Interest or dividend on bonds / GDR",
    rate: "12.5%",
  },
  {
    code: "196C-2",
    label: "196C - LTCG on Bonds / GDR",
    description:
      "Long-term capital gain on transfer of bonds / GDR",
    rate: "12.5%",
  },
  {
    code: "196D",
    label: "196D - FII Income",
    description:
      "Income of Foreign Institutional Investors",
    rate: "20%",
  },
  {
    code: "196D-1A",
    label: "196D(1A) - Specified Fund",
    description:
      "Specified fund income under section 115AD",
    rate: "10%",
  },
];
  const defaultForm = {
  financialYear: "",
  residentialStatus: "",
  recipientCategory: "",
  panNotAvailable: false,
  section: "",
  amount: "",
  thresholdInput: "",
  paymentDate: "",
  sectionSubtype: "default",
  itrFiled: "yes",
};
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const tdsSections =
  form.residentialStatus === "resident"
    ? residentTDSSections
    : [...nonResidentTDSSections, ...section195Master];
  
  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedSection = useMemo(() => {
    return tdsSections.find((s) => s.code === form.section);
  }, [form.section]);

    // ✅ NEW: AUTO THRESHOLD POPULATE (MAIN FIX)
  useEffect(() => {
  if (!selectedSection) return;

  if (isResetting) return; // 👈 ADD THIS LINE

  let threshold = 0;

  if (selectedSection.threshold !== undefined) {
    threshold = selectedSection.threshold;
  }

  setForm((prev) => ({
    ...prev,
    thresholdInput: threshold,
  }));
}, [form.section, isResetting]);

  const getRate = () => {
    if (!selectedSection) return 0;

    if (
  form.residentialStatus === "nonResident" &&
  form.section.startsWith("195-")
) {
  const selected195 = section195Master.find(
    (item) => item.code === form.section
  );

  if (!selected195) return 0;

  let rate = selected195.rate || 0;

  if (form.panNotAvailable && rate < 20) {
    rate = 20;
  }

  return rate;
}

    let rate = 0;

    if (form.residentialStatus === "nonResident") {
      rate = Number(selectedSection.nonResidentRate) || 20;
    } else {
      switch (form.section) {
        case "194C":
          rate =
            form.recipientCategory === "Individual" ||
            form.recipientCategory === "HUF"
              ? 1
              : 2;
          break;

        case "194I":
          rate = form.sectionSubtype === "plant" ? 2 : 10;
          break;

        case "194J":
          rate = form.sectionSubtype === "technical" ? 2 : 10;
          break;

        case "194D":
          rate =
            form.recipientCategory === "Individual" ||
            form.recipientCategory === "HUF"
              ? 2
              : 10;
          break;

        case "194A":
          rate = 10;
          break;

        default:
  rate =
    Number(
      String(selectedSection.rate || "")
        .replace("%", "")
        .replace("Slab Rates", "0")
    ) || 0;
      }
    }

    if (form.panNotAvailable && rate < 20) {
      rate = 20;
    }

    return rate;
  };

  
  const calculateTDS = () => {
  if (!selectedSection) return "0.00";

   // DATE VALIDATION HERE
  if (
    form.paymentDate &&
    (
      form.paymentDate < "2025-04-01" ||
      form.paymentDate > "2026-03-31"
    )
  ) {
    return "Invalid Date for FY 2025-26";
  }

  const amount = Number(form.amount) || 0; 
if (
    form.residentialStatus === "nonResident" &&
    form.section.startsWith("195-")
  ) {
    const selected195 = section195Master.find(
      (item) => item.code === form.section
    );

    if (!selected195) return "0.00";

    let threshold = selected195.threshold || 0;
    let rate = selected195.rate || 0;

    if (form.panNotAvailable && rate < 20) {
      rate = 20;
    }

    if (amount <= threshold) return "0.00";

    return (((amount - threshold) * rate) / 100).toFixed(2);
  }

 // =========================
  // SECTION 194N
  // =========================
  if (form.section === "194N") {
    const itrFiled = form.itrFiled === "yes";
    const isCooperativeSociety =
      form.recipientCategory === "Co-operative Society";

    let tds = 0;

    if (itrFiled) {
      const threshold =
        form.residentialStatus === "resident" &&
        isCooperativeSociety
          ? 30000000
          : 10000000;

      if (amount > threshold) {
        tds = (amount - threshold) * 0.02;
      }
    } else {
      if (amount <= 2000000) {
        tds = 0;
      } else if (amount <= 10000000) {
        tds = (amount - 2000000) * 0.02;
      } else {
        tds =
          (10000000 - 2000000) * 0.02 +
          (amount - 10000000) * 0.05;
      }
    }

    return tds.toFixed(2);
  }
 // =========================
  // SECTION 194T
  // =========================
  if (form.section === "194T") {
    const threshold = 20000;

    if (amount <= threshold) return "0.00";

    return (((amount - threshold) * 10) / 100).toFixed(2);
  }

 // =========================
  // NORMAL TDS LOGIC
  // =========================
   
    const threshold = Number(form.thresholdInput) || selectedSection?.threshold || 0;

    if (amount <= threshold) {
      return 0;
    }

    const rate = getRate();
    return (((amount - threshold) * rate) / 100).toFixed(2);
   
  };

  const resetForm = () => {
  setForm(defaultForm);
};

return (
  <div className="tds-modern-page">
    <div className="tds-modern-container">

      {/* HEADER */}
      <div className="tds-modern-header">
        <div>
          <p className="tds-modern-kicker">Income Tax Utility</p>
          <h1>TDS Calculator</h1>
          <p>
            Calculate Tax Deducted at Source with section-wise threshold and rate.
          </p>
        </div>

        <div className="tds-modern-badge">
          <span>Financial Year</span>
          <strong>{form.financialYear || "Not Selected"}</strong>
        </div>
      </div>

      <div className="tds-modern-grid">

        {/* LEFT FORM */}
        <div className="tds-modern-card">
          <div className="tds-section-title">
            <h2>Deduction Details</h2>
            <p>Fill payment and deductee details for TDS computation</p>
          </div>

          <div className="tds-form-grid">

            <div className="tds-field">
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

            <div className="tds-field">
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

            <div className="tds-field">
              <label>Recipient Category <span>*</span></label>
              <select
                value={form.recipientCategory}
                onChange={(e) => update("recipientCategory", e.target.value)}
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

            <div className="tds-field">
              <label>Section / Description <span>*</span></label>
              <select
                value={form.section}
                onChange={(e) => update("section", e.target.value)}
              >
                <option value="">Select Section</option>
                {tdsSections.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="tds-field">
              <label>Amount Paid / Credited <span>*</span></label>
              <input
                type="number"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
              />
            </div>

            <div className="tds-field">
              <label>Payment Date <span>*</span></label>
              <input
                type="date"
                min="2025-04-01"
                max="2026-03-31"
                value={form.paymentDate}
                onChange={(e) => update("paymentDate", e.target.value)}
              />
            </div>

            <div className="tds-field">
              <label>Threshold Limit</label>
              <input
                type="number"
                placeholder="Threshold limit"
                value={form.thresholdInput}
                onChange={(e) => update("thresholdInput", e.target.value)}
              />
            </div>

            <div className="tds-field">
              <label>ITR Filing Status</label>
              <select
                value={form.itrFiled}
                onChange={(e) => update("itrFiled", e.target.value)}
              >
                <option value="yes">ITR Filed</option>
                <option value="no">ITR Not Filed (206AB)</option>
              </select>
            </div>

            <div className="tds-check-box">
              <input
                type="checkbox"
                checked={form.panNotAvailable}
                onChange={(e) => update("panNotAvailable", e.target.checked)}
              />
              <div>
                <strong>PAN not available</strong>
                <p>Higher rate may apply under Section 206AA.</p>
              </div>
            </div>
          </div>

          <div className="tds-modern-actions">
            <button onClick={resetForm} className="tds-btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT RESULT PANEL */}
        <div className="tds-result-panel">
          <div className="tds-result-head">
            <p>Computation Summary</p>
            <h2>₹ {calculateTDS()}</h2>
            <span>Total TDS Amount</span>
          </div>

          <div className="tds-result-list">
            <div className="tds-result-item">
              <span>Applicable Rate</span>
              <strong>{getRate()}%</strong>
            </div>

            <div className="tds-result-item">
              <span>Threshold Limit</span>
              <strong>₹ {form.thresholdInput || 0}</strong>
            </div>

            <div className="tds-result-item">
              <span>Amount Paid / Credited</span>
              <strong>₹ {form.amount || 0}</strong>
            </div>

            <div className="tds-result-item">
              <span>Selected Section</span>
              <strong>{form.section || "-"}</strong>
            </div>

            <div className="tds-result-item final">
              <span>Final TDS</span>
              <strong>₹ {calculateTDS()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .tds-modern-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
          linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
        color: #e5e7eb;
        padding: 34px;
        font-family: Inter, Arial, sans-serif;
      }

      .tds-modern-container {
        max-width: 1250px;
        margin: 0 auto;
      }

      .tds-modern-header {
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

      .tds-modern-kicker {
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 8px;
      }

      .tds-modern-header h1 {
        font-size: 36px;
        line-height: 1.1;
        margin: 0;
        color: #ffffff;
      }

      .tds-modern-header p {
        margin: 10px 0 0;
        color: #94a3b8;
        font-size: 15px;
      }

      .tds-modern-badge {
        min-width: 190px;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12));
        border: 1px solid rgba(96, 165, 250, 0.28);
        text-align: center;
      }

      .tds-modern-badge span {
        display: block;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .tds-modern-badge strong {
        color: #ffffff;
        font-size: 20px;
      }

      .tds-modern-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 26px;
        align-items: start;
      }

      .tds-modern-card,
      .tds-result-panel {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 24px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
      }

      .tds-modern-card {
        padding: 26px;
      }

      .tds-section-title {
        margin-bottom: 24px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .tds-section-title h2 {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
      }

      .tds-section-title p {
        margin: 7px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .tds-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .tds-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .tds-field label {
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 700;
      }

      .tds-field label span {
        color: #f87171;
      }

      .tds-field input,
      .tds-field select {
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

      .tds-field input::placeholder {
        color: #64748b;
      }

      .tds-field input:focus,
      .tds-field select:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .tds-field option {
        background: #0f172a;
        color: #ffffff;
      }

      .tds-check-box {
        grid-column: span 2;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(37, 99, 235, 0.08);
        border: 1px solid rgba(96, 165, 250, 0.18);
      }

      .tds-check-box input {
        width: 20px;
        height: 20px;
        accent-color: #3b82f6;
      }

      .tds-check-box strong {
        color: #ffffff;
        font-size: 14px;
      }

      .tds-check-box p {
        margin: 4px 0 0;
        color: #94a3b8;
        font-size: 12px;
      }

      .tds-modern-actions {
        display: flex;
        justify-content: flex-end;
        gap: 14px;
        margin-top: 26px;
      }

      .tds-btn-secondary {
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

      .tds-btn-secondary:hover {
        background: rgba(248, 113, 113, 0.16);
        color: #fecaca;
        border-color: rgba(248, 113, 113, 0.32);
      }

      .tds-result-panel {
        overflow: hidden;
        position: sticky;
        top: 22px;
      }

      .tds-result-head {
        padding: 26px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(14, 165, 233, 0.16));
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .tds-result-head p {
        margin: 0;
        color: #bfdbfe;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .tds-result-head h2 {
        margin: 14px 0 4px;
        color: #ffffff;
        font-size: 34px;
        word-break: break-word;
      }

      .tds-result-head span {
        color: #93c5fd;
        font-size: 13px;
        font-weight: 700;
      }

      .tds-result-list {
        padding: 18px;
      }

      .tds-result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 15px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      }

      .tds-result-item:last-child {
        border-bottom: none;
      }

      .tds-result-item span {
        color: #94a3b8;
        font-size: 14px;
      }

      .tds-result-item strong {
        color: #ffffff;
        font-size: 16px;
        text-align: right;
        word-break: break-word;
      }

      .tds-result-item.final {
        margin-top: 10px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(34, 197, 94, 0.24);
        background: rgba(34, 197, 94, 0.08);
      }

      .tds-result-item.final span {
        color: #bbf7d0;
        font-weight: 800;
      }

      .tds-result-item.final strong {
        color: #86efac;
        font-size: 20px;
      }

      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }

      @media (max-width: 1050px) {
        .tds-modern-page {
          padding: 20px;
        }

        .tds-modern-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .tds-modern-grid {
          grid-template-columns: 1fr;
        }

        .tds-result-panel {
          position: static;
        }
      }

      @media (max-width: 680px) {
        .tds-form-grid {
          grid-template-columns: 1fr;
        }

        .tds-check-box {
          grid-column: span 1;
        }

        .tds-modern-actions {
          flex-direction: column;
        }

        .tds-btn-secondary {
          width: 100%;
        }
      }
    `}</style>
  </div>
);
}
