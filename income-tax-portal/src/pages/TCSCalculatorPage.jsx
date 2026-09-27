import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ==========================================================================
// FY 2026-27 (Tax Year 2026-27) — Income-tax Act, 2025
// Source: TRACES TCS rate chart (traces.tdscpc.gov.in/thingsToKnow/ratecharts,
// section 394(1), Collection Code 206C), cross-checked against Gen e-TDS
// software (ver 2.26.8/2.26.9) for the SecCode / Old Section mapping.
//
// Every row below is verified against both sources. All 25 rows had a
// SecCode in Gen e-TDS, so none are left blank here (unlike a few TDS rows).
// ==========================================================================
const NEW_ACT_FY = "2026-27";

const getFinancialYearLabel = (fy) =>
  fy === NEW_ACT_FY ? `${fy} (Tax Year ${fy})` : fy;

// "Nil" / "-" -> 0, "1000000" -> 1000000
const parseThreshold = (value) => {
  const text = String(value ?? "").trim();
  if (!text || text === "-" || text.toLowerCase() === "nil") return 0;
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

const tcsChart2026 = [
  { code: "1068", old: "206C-A", sec: "394(1) [Table: Sl. No. 1]", nature: "Sale of alcoholic liquor for human consumption.", threshold: "-", rate: 2 },
  { code: "1069", old: "206C-I", sec: "394(1) [Table: Sl. No. 2]", nature: "Sale of tendu leaves", threshold: "-", rate: 2 },
  { code: "1070", old: "206C-B", sec: "394(1) [Table: Sl. No. 3]", nature: "Sale of timber obtained under a forest lease", threshold: "-", rate: 2 },
  { code: "1071", old: "206C-C", sec: "394(1) [Table: Sl. No. 3]", nature: "Sale of timber obtained by any mode other than a forest lease", threshold: "-", rate: 2 },
  { code: "1072", old: "206C-D", sec: "394(1) [Table: Sl. No. 3]", nature: "Sale of any other forest produce (not being timber or tendu leaves) obtained under a forest lease.", threshold: "-", rate: 2 },
  { code: "1073", old: "206C-E", sec: "394(1) [Table: Sl. No. 4]", nature: "Sale of scrap.", threshold: "-", rate: 2 },
  { code: "1074", old: "206C-J", sec: "394(1) [Table: Sl. No. 5]", nature: "Sale of minerals, being coal or lignite or iron ore.", threshold: "-", rate: 2 },

  { code: "1075", old: "206C-L", sec: "394(1) [Table: Sl. No. 6.D(a)]", nature: "Sale consideration exceeding threshold limit in case of sale of motor vehicle", threshold: "1000000", rate: 1 },
  { code: "1076", old: "206C-MA", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of wrist watch", threshold: "1000000", rate: 1 },
  { code: "1077", old: "206C-MB", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of art piece such as antiques, painting, sculpture", threshold: "1000000", rate: 1 },
  { code: "1078", old: "206C-MC", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of collectibles such as coin, stamp", threshold: "1000000", rate: 1 },
  { code: "1079", old: "206C-MD", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of yacht, rowing boat, canoe, helicopter", threshold: "1000000", rate: 1 },
  { code: "1080", old: "206C-ME", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of pair of sunglasses", threshold: "1000000", rate: 1 },
  { code: "1081", old: "206C-MF", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of bag such as handbag, purse", threshold: "1000000", rate: 1 },
  { code: "1082", old: "206C-MG", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of pair of shoes", threshold: "1000000", rate: 1 },
  { code: "1083", old: "206C-MH", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of sportswear and equipment such as golf kit, ski-wear", threshold: "1000000", rate: 1 },
  { code: "1084", old: "206C-MI", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of home theatre system", threshold: "1000000", rate: 1 },
  { code: "1085", old: "206C-MJ", sec: "394(1) [Table: Sl. No. 6.D(b)]", nature: "Sale consideration exceeding threshold limit in case of sale of horse for horse racing in race clubs and horse for polo", threshold: "1000000", rate: 1 },

  { code: "1086", old: "206C-T", sec: "394(1) [Table: Sl. No. 7.D(a)]", nature: "Remittance under the Liberalised Remittance Scheme of an amount or aggregate of the amounts exceeding threshold limit for purposes of education or medical treatment (Education/Medical)", threshold: "1000000", rate: 2 },
  { code: "1087", old: "206C-Q", sec: "394(1) [Table: Sl. No. 7.D(b)]", nature: "Remittance under the Liberalised Remittance Scheme of an amount or aggregate of the amounts exceeding threshold limit for purposes other than education or medical treatment (Other Purposes)", threshold: "1000000", rate: 20 },

  { code: "1088", old: "206C-O", sec: "394(1) [Table: Sl. No. 8.D(a)]", nature: "Sale of \u201coverseas tour programme package\u201d including expenses for travel or hotel stay or boarding or lodging or any such similar or related expenditure with amount or aggregate of amounts up to \u20b910,00,000 (Up to \u20b910,00,000)", threshold: "-", rate: 2 },
  { code: "1089", old: "206C-O", sec: "394(1) [Table: Sl. No. 8.D(b)]", nature: "Sale of \u201coverseas tour programme package\u201d including expenses for travel or hotel stay or boarding or lodging or any such similar or related expenditure with amount or aggregate of amounts above \u20b910,00,000 (Above \u20b910,00,000)", threshold: "-", rate: 2 },

  { code: "1090", old: "206C-F", sec: "394(1) [Table: Sl. No. 9]", nature: "Use of parking lot for the purpose of business, excluding mining and quarrying of mineral oil (including petroleum and natural gas).", threshold: "-", rate: 2 },
  { code: "1091", old: "206C-G", sec: "394(1) [Table: Sl. No. 9]", nature: "Use of toll plaza for the purpose of business, excluding mining and quarrying of mineral oil (including petroleum and natural gas).", threshold: "-", rate: 2 },
  { code: "1092", old: "206C-H", sec: "394(1) [Table: Sl. No. 9]", nature: "Use of mine or quarry for the purpose of business, excluding mining and quarrying of mineral oil (including petroleum and natural gas).", threshold: "-", rate: 2 },
];

// Threshold clarifications for the handful of rows that are easy to pick
// the wrong tier for, shown next to the Nature of Collection field (not
// buried inside the option text).
const THRESHOLD_NOTE_2026 = {
  "1086": "Applies to LRS remittances for education or medical treatment",
  "1087": "Applies to LRS remittances for purposes other than education or medical treatment",
  "1088": "Select this when the aggregate overseas tour package spend for the year is up to \u20b910,00,000",
  "1089": "Select this when the aggregate overseas tour package spend for the year exceeds \u20b910,00,000",
};

const buildTcsSection2026 = (row) => {
  const nature = String(row.nature).replace(/\s*\n\s*/g, " ");
  const codePrefix = row.code ? `${row.code} - ` : "";
  const oldSection = row.old ? ` (${row.old})` : "";
  const sectionText = `${codePrefix}${row.sec}${oldSection}`;

  return {
    code: row.code,
    isNewAct: true,
    sectionText,
    label: `${sectionText} - ${nature}`,
    description: nature,
    threshold: parseThreshold(row.threshold),
    rate: row.rate,
    thresholdNote: THRESHOLD_NOTE_2026[row.code],
  };
};

const tcsSections2026 = tcsChart2026.map(buildTcsSection2026);

// Surcharge Rate options — same list for every financial year.
const SURCHARGE_RATE_OPTIONS = [
  { code: "0", label: "0%" },
  { code: "2", label: "2%" },
  { code: "5", label: "5%" },
  { code: "7", label: "7%" },
  { code: "12", label: "12%" },
];

const ENTER_DATE_MESSAGE_2026 = "Enter Date of Collection to calculate";
const NOT_COLLECTIBLE_MESSAGE = "TCS is not collectible";
const SELECT_YES_NO_MESSAGE = "Select Yes or No";

// Amount is equal to / below the threshold: result depends on whether the
// total payment during the year is more than the threshold limit. Shared by
// FY 2025-26-and-earlier and FY 2026-27, same as the equivalent question in
// the TDS Calculator.
//   - returns a plain number: the taxable amount, continue as normal
//   - returns { error }: short-circuit the calculation with this message
const resolveTaxable = (amountValue, threshold, yearlyAnswer) => {
  if (amountValue > 0 && amountValue <= threshold) {
    if (yearlyAnswer === "yes") return amountValue;
    if (yearlyAnswer === "no") return { error: NOT_COLLECTIBLE_MESSAGE };
    return { error: SELECT_YES_NO_MESSAGE };
  }
  // Above the threshold: TCS applies on the complete amount, not just the
  // excess over the threshold (same rule as the TDS Calculator).
  return amountValue > threshold ? amountValue : 0;
};

// Cess (Health & Education Cess) rule — shared by FY 2025-26-and-earlier and
// FY 2026-27:
//   Resident: only when the Buyer Category is Foreign Company; never for
//     any other Buyer Category.
//   Non-Resident, PE not established in India: always.
//   Non-Resident, PE established in India, PAN available: always.
//   Non-Resident, PE established in India, PAN NOT available: only when the
//     Buyer Category is Foreign Company.
//   Non-Resident, PE question not yet answered: not applicable (default,
//     until answered).
const isCessApplicable = (residentialStatus, buyerCategory, peEstablished, panNotAvailable) => {
  if (residentialStatus !== "nonResident") return buyerCategory === "Foreign Company";
  if (peEstablished === "no") return true;
  if (peEstablished === "yes") {
    if (panNotAvailable) return buyerCategory === "Foreign Company";
    return true;
  }
  return false;
};

// A dropdown whose open list shows the FULL option text, wrapped onto as
// many lines as needed, inside a box the same width as the trigger (i.e.
// the same width as every other input field) — a plain <select>'s native
// popup either truncates long option text or grows wider than the screen,
// neither of which this component does.
function TcsWrapSelect({ value, onChange, options, getLabel, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const selectedEl = menuRef.current.querySelector(".is-selected");
    if (selectedEl) selectedEl.scrollIntoView({ block: "nearest" });
  }, [open]);

  const selected = options.find((option) => option.code === value);

  return (
    <div className="tcs-wrap-select" ref={containerRef}>
      <button
        type="button"
        className={`tcs-wrap-select-trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected ? getLabel(selected) : placeholder}</span>
        <span className="tcs-wrap-select-arrow">{open ? "\u25b2" : "\u25bc"}</span>
      </button>

      {open && (
        <div className="tcs-wrap-select-menu" ref={menuRef}>
          {options.map((option) => (
            <div
              key={option.code}
              className={`tcs-wrap-select-option${
                option.code === value ? " is-selected" : ""
              }`}
              onClick={() => {
                onChange(option.code);
                setOpen(false);
              }}
            >
              {getLabel(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TCSCalculatorPage() {
   const navigate = useNavigate();
  // ===================== DATA =====================
  const financialYears = [
    "2016-17","2017-18","2018-19","2019-20","2020-21",
    "2021-22","2022-23","2023-24","2024-25","2025-26","2026-27",
  ];
  const defaultForm = {
  financialYear: NEW_ACT_FY,
  residentialStatus: "",
  buyerCategory: "",
  section: "",
  amount: "",
  thresholdInput: "",
  collectionDate: "",
  panNotAvailable: false,
  itrFiled: "yes",
  surchargeRate: "",
  yearlyAboveThreshold: "",
  peEstablished: "",
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

  // FY 2026-27 (Tax Year 2026-27) uses the new 25-row chart; every other FY
  // keeps using the original 10-entry list, untouched.
  const isNewActFY = form.financialYear === NEW_ACT_FY;
  const activeTcsSections = isNewActFY ? tcsSections2026 : tcsSections;

  // Section codes and the collection-date window differ between FY 2026-27
  // and older FYs, so clear them when switching between the two.
  const handleFinancialYearChange = (value) => {
    setForm((prev) => {
      const switchedRegime =
        (prev.financialYear === NEW_ACT_FY) !== (value === NEW_ACT_FY);

      return switchedRegime
        ? { ...prev, financialYear: value, section: "", collectionDate: "" }
        : { ...prev, financialYear: value };
    });
    setResult(null);
  };

  const handleSectionChange = (value) => {
    setForm((prev) => ({ ...prev, section: value, yearlyAboveThreshold: "" }));
    setResult(null);
  };

  // Non-Resident-only fields (PE question, PAN not available) don't apply
  // once switched away from Non-Resident — clear them so a stale answer
  // can't silently affect the calculation.
  const handleResidentialStatusChange = (value) => {
    setForm((prev) => ({
      ...prev,
      residentialStatus: value,
      peEstablished: value === "nonResident" ? prev.peEstablished : "",
      panNotAvailable: value === "nonResident" ? prev.panNotAvailable : false,
    }));
    setResult(null);
  };

  // PAN not available only applies when PE is established in India — clear
  // it when PE is "No" (or the question is reset) so it doesn't stay
  // checked behind a hidden field.
  const handlePeEstablishedChange = (value) => {
    setForm((prev) => ({
      ...prev,
      peEstablished: value,
      panNotAvailable: value === "yes" ? prev.panNotAvailable : false,
    }));
    setResult(null);
  };

  // ===================== AUTO SECTION =====================
  const selectedSection = useMemo(() => {
    return activeTcsSections.find((s) => s.code === form.section);
  }, [form.section, isNewActFY]);

  const amount = Number(form.amount) || 0;

  // Threshold Limit — auto-populated from the selected section, for every
  // financial year, editable like the rest of the form.
  useEffect(() => {
    if (!selectedSection) return;
    setForm((prev) => ({ ...prev, thresholdInput: selectedSection.threshold }));
  }, [form.section, isNewActFY]);

  // Threshold Limit is not allowed for Non-Resident — TCS applies on the
  // full amount from the first rupee, for every section.
  const effectiveThreshold =
    form.residentialStatus === "nonResident" || !selectedSection
      ? 0
      : Number(form.thresholdInput) || selectedSection.threshold || 0;

  // Threshold field is not shown in the UI, only used internally — show the
  // "more than threshold for the year?" question whenever the entered
  // amount is at or below the selected section's threshold.
  const showYearlyThresholdQuestion =
    !!selectedSection && amount > 0 && amount <= effectiveThreshold;

  // Whether Non-Resident's "PAN not available" checkbox should even be
  // offered — only once PE established in India is answered "Yes".
  const showPanCheckbox =
    form.residentialStatus !== "nonResident" || form.peEstablished === "yes";


  // ===================== CA LEVEL TCS ENGINE (FY 2025-26 and earlier — unchanged) =====================
   const calculateTCS = () => {
  if (!selectedSection) return 0;

  // Whether PE is established in India is mandatory for Non-Resident.
  if (form.residentialStatus === "nonResident" && !form.peEstablished) {
    return { error: "Select whether PE is established in India" };
  }

  let baseRate = selectedSection.rate;
  // Threshold Limit is not allowed for Non-Resident.
  let threshold =
    form.residentialStatus === "nonResident"
      ? 0
      : Number(form.thresholdInput) || selectedSection.threshold || 0;

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

  // Threshold logic — below/equal to threshold now depends on the "more
  // than threshold for the year?" answer (see resolveTaxable)
  const taxableResult = resolveTaxable(amount, threshold, form.yearlyAboveThreshold);
  if (taxableResult && typeof taxableResult === "object") return taxableResult;
  let taxable = taxableResult;

  let baseTCS = (taxable * baseRate) / 100;

  // Surcharge logic (UNCHANGED)
  let surcharge = 0;
  if (form.residentialStatus === "nonResident") {
    surcharge = (baseTCS * Number(form.surchargeRate)) / 100;
  }

  let tcsAfterSurcharge = baseTCS + surcharge;

  // Cess (Health & Education Cess) — see isCessApplicable for the full rule.
  const cessApplicable = isCessApplicable(
    form.residentialStatus,
    form.buyerCategory,
    form.peEstablished,
    form.panNotAvailable
  );
  let cess = cessApplicable ? tcsAfterSurcharge * 0.04 : 0;

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

  // ===================== FY 2026-27 (Tax Year 2026-27) — separate engine =====================
  // Same base-rate / threshold / surcharge / cess shape as FY 2025-26 above.
  // Two verified differences, both taken from the TRACES chart's own note:
  //   1. Date of Collection is required, and must fall within FY 2026-27.
  //   2. PAN not available/invalid/inoperative (Section 397): rate is twice
  //      the specified rate or 5%, whichever is higher — capped at 20%.
  const calculateTCS2026 = () => {
    if (!selectedSection) {
      return { error: "Select a Nature of Collection to calculate" };
    }

    if (!form.collectionDate) {
      return { error: ENTER_DATE_MESSAGE_2026 };
    }

    if (form.collectionDate < "2026-04-01" || form.collectionDate > "2027-03-31") {
      return { error: "Invalid Date for FY 2026-27" };
    }

    // Whether PE is established in India is mandatory for Non-Resident.
    if (form.residentialStatus === "nonResident" && !form.peEstablished) {
      return { error: "Select whether PE is established in India" };
    }

    let baseRate = selectedSection.rate;
    // Threshold Limit is not allowed for Non-Resident.
    const threshold =
      form.residentialStatus === "nonResident"
        ? 0
        : Number(form.thresholdInput) || selectedSection.threshold || 0;

    // Section 397: PAN not available/invalid/inoperative
    if (form.panNotAvailable) {
      baseRate = Math.min(Math.max(baseRate * 2, 5), 20);
    }

    const taxableResult = resolveTaxable(amount, threshold, form.yearlyAboveThreshold);
    if (taxableResult && typeof taxableResult === "object") return taxableResult;
    const taxable = taxableResult;
    const baseTCS = (taxable * baseRate) / 100;

    let surcharge = 0;
    if (form.residentialStatus === "nonResident") {
      surcharge = (baseTCS * Number(form.surchargeRate || 0)) / 100;
    }

    const tcsAfterSurcharge = baseTCS + surcharge;

    // Cess (Health & Education Cess) — see isCessApplicable for the full rule.
    const cessApplicable = isCessApplicable(
      form.residentialStatus,
      form.buyerCategory,
      form.peEstablished,
      form.panNotAvailable
    );
    const cess = cessApplicable ? tcsAfterSurcharge * 0.04 : 0;
    const finalTCS = tcsAfterSurcharge + cess;

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
    const output = isNewActFY ? calculateTCS2026() : calculateTCS();
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
          <strong>
            {form.financialYear
              ? getFinancialYearLabel(form.financialYear)
              : "Not Selected"}
          </strong>
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
                onChange={(e) => handleFinancialYearChange(e.target.value)}
              >
                <option value="">Select FY</option>
                {financialYears.map((fy) => (
                  <option key={fy} value={fy}>{getFinancialYearLabel(fy)}</option>
                ))}
              </select>
            </div>

            <div className="tcs-field">
              <label>Residential Status <span>*</span></label>
              <select
                value={form.residentialStatus || ""}
                onChange={(e) => handleResidentialStatusChange(e.target.value)}
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
              {isNewActFY ? (
                <TcsWrapSelect
                  value={form.section}
                  onChange={handleSectionChange}
                  options={tcsSections2026}
                  getLabel={(s) => s.label}
                  placeholder="Select Nature of Collection"
                />
              ) : (
                <select
                  value={form.section}
                  onChange={(e) => handleSectionChange(e.target.value)}
                >
                  <option value="">Select Nature of Collection</option>
                  {tcsSections.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}
              {isNewActFY && selectedSection?.thresholdNote && (
                <p className="tcs-threshold-note">{selectedSection.thresholdNote}</p>
              )}
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

            {form.residentialStatus !== "nonResident" && (
              <div className="tcs-field">
                <label>Threshold Limit</label>
                <input
                  type="number"
                  placeholder="Threshold limit"
                  value={form.thresholdInput}
                  onChange={(e) => update("thresholdInput", e.target.value)}
                />
              </div>
            )}

            <div className="tcs-field">
              <label>
                Date of Collection {isNewActFY && <span>*</span>}
              </label>
              <input
                type="date"
                min={isNewActFY ? "2026-04-01" : undefined}
                max={isNewActFY ? "2027-03-31" : undefined}
                value={form.collectionDate}
                onChange={(e) => update("collectionDate", e.target.value)}
              />
            </div>

            {form.residentialStatus === "nonResident" && (
              <div className="tcs-field">
                <label>
                  Whether PE is established in India? <span>*</span>
                </label>
                <select
                  value={form.peEstablished}
                  onChange={(e) => handlePeEstablishedChange(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            )}

            {form.residentialStatus === "nonResident" && (
              <div className="tcs-field">
                <label>Surcharge Rate</label>
                <TcsWrapSelect
                  value={form.surchargeRate}
                  onChange={(value) => update("surchargeRate", value)}
                  options={SURCHARGE_RATE_OPTIONS}
                  getLabel={(o) => o.label}
                  placeholder="Select Surcharge Rate"
                />
              </div>
            )}

            {showYearlyThresholdQuestion && (
              <div className="tcs-field tcs-field-wide">
                <label>
                  Whether total payment during the year is more than above
                  threshold limit? <span>*</span>
                </label>
                <select
                  value={form.yearlyAboveThreshold}
                  onChange={(e) => update("yearlyAboveThreshold", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            )}

            {showPanCheckbox && (
              <div className="tcs-check-box">
                <input
                  type="checkbox"
                  checked={form.panNotAvailable}
                  onChange={(e) => update("panNotAvailable", e.target.checked)}
                />
                <div>
                  <strong>PAN not available</strong>
                  <p>
                    {isNewActFY
                      ? "Section 397: twice the specified rate or 5%, whichever is higher (capped at 20%)."
                      : "Higher rate may apply as per applicable provision."}
                  </p>
                </div>
              </div>
            )}
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
          {result?.error ? (
            <div className="tcs-result-head">
              <p>Computation Summary</p>
              <h2>{result.error}</h2>
              <span>Total TCS Amount</span>
            </div>
          ) : (
            <div className="tcs-result-head">
              <p>Computation Summary</p>
              <h2>₹ {result?.final || 0}</h2>
              <span>Final TCS Payable</span>
            </div>
          )}

          <div className="tcs-result-list">
            <div className="tcs-result-item">
              <span>Base Rate</span>
              <strong>{result?.error ? "-" : `${result?.baseRate || 0}%`}</strong>
            </div>

            <div className="tcs-result-item">
              <span>Threshold</span>
              <strong>₹ {result?.error ? 0 : result?.threshold || 0}</strong>
            </div>

            <div className="tcs-result-item">
              <span>Base TCS</span>
              <strong>₹ {result?.error ? 0 : result?.baseTCS || 0}</strong>
            </div>

            <div className="tcs-result-item">
              <span>Surcharge</span>
              <strong>₹ {result?.error ? 0 : result?.surcharge || 0}</strong>
            </div>

            <div className="tcs-result-item">
              <span>Cess 4%</span>
              <strong>₹ {result?.error ? 0 : result?.cess || 0}</strong>
            </div>

            <div className="tcs-result-item tcs-result-item-wrap">
              <span>Selected Nature of Collection</span>
              <strong>{selectedSection?.label || form.section || "-"}</strong>
            </div>

            <div className="tcs-result-item final">
              <span>Total TCS</span>
              <strong>₹ {result?.error ? 0 : result?.final || 0}</strong>
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

      .tcs-field-wide {
        grid-column: span 2;
      }

      .tcs-threshold-note {
        margin: 2px 2px 0;
        color: #93c5fd;
        font-size: 12px;
        line-height: 1.4;
      }

      .tcs-wrap-select {
        position: relative;
      }

      .tcs-wrap-select-trigger {
        width: 100%;
        height: 46px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(2, 6, 23, 0.48);
        color: #ffffff;
        padding: 0 14px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
      }

      .tcs-wrap-select-trigger span:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }

      .tcs-wrap-select-trigger:hover,
      .tcs-wrap-select-trigger.is-open {
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
        background: rgba(15, 23, 42, 0.95);
      }

      .tcs-wrap-select-arrow {
        flex-shrink: 0;
        color: #60a5fa;
        font-size: 11px;
      }

      .tcs-wrap-select-menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        width: 100%;
        max-height: 320px;
        overflow-y: auto;
        background: #0f172a;
        border: 1px solid rgba(148, 163, 184, 0.28);
        border-radius: 14px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
        z-index: 60;
        padding: 6px;
        scrollbar-width: thin;
        scrollbar-color: rgba(96, 165, 250, 0.45) rgba(15, 23, 42, 0.4);
      }

      .tcs-wrap-select-menu::-webkit-scrollbar {
        width: 8px;
      }

      .tcs-wrap-select-menu::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.4);
        border-radius: 8px;
      }

      .tcs-wrap-select-menu::-webkit-scrollbar-thumb {
        background: rgba(96, 165, 250, 0.45);
        border-radius: 8px;
      }

      .tcs-wrap-select-menu::-webkit-scrollbar-thumb:hover {
        background: rgba(96, 165, 250, 0.7);
      }

      .tcs-wrap-select-option {
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 13px;
        line-height: 1.45;
        color: #e5e7eb;
        white-space: normal;
        word-break: break-word;
        cursor: pointer;
      }

      .tcs-wrap-select-option:hover {
        background: rgba(96, 165, 250, 0.14);
      }

      .tcs-wrap-select-option.is-selected {
        background: rgba(37, 99, 235, 0.32);
        color: #ffffff;
        font-weight: 700;
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
        word-break: break-word;
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

      .tcs-result-item-wrap {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .tcs-result-item-wrap strong {
        max-width: 365px;
        width: 100%;
        text-align: left;
        white-space: normal;
        word-break: break-word;
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