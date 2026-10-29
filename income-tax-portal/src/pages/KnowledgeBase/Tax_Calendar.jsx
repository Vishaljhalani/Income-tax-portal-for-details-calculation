import React, { useMemo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

// ---------- Galaxy theme tokens (same as the other income-tax-portal pages) ----------
const galaxy = {
  text: "#e2e8f0",
  muted: "rgba(226, 232, 240, 0.7)",
  border: "rgba(96, 165, 250, 0.35)",
  headGradient: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 60%, #0284c7 100%)",
  cyan: "#67e8f9",
};

const ROWS_PER_PAGE = 10;

const financialYears = [
  "2020-21",
  "2021-22",
  "2022-23",
  "2023-24",
  "2024-25",
  "2025-26",
  "2026-27",
];

const dueDateTypes = ["All", "Audit", "ITR", "TDS/TCS", "Tax Payment"];

// Today at midnight, used for both hiding past-due rows and computing a
// live "days to go" badge — both derived from the same comparison so they
// can never disagree.
const getToday = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

// "2026-11-21" -> whole days remaining until that date (negative once past).
const daysUntil = (dateStr) => {
  const target = new Date(`${dateStr}T00:00:00`);
  const diffMs = target.getTime() - getToday().getTime();
  return Math.round(diffMs / 86400000);
};

const taxCalendarData = [
  // =====================================================
  // 2026-27 TDS/TCS + Tax Payment (deposits, certificates,
  // 24G/Form 137, challan-cum-statements, quarterly TDS/TCS
  // returns, advance tax instalments)
  // =====================================================

  { id: "2627-tdstcs-1", financialYear: "2026-27", date: "2026-04-07", month: "APR", day: "7", type: "TDS/TCS", title: "April 7, 2026 (Tuesday)", description: "TDS/TCS deposit (Govt. deductor) — Mar 2026", sections: ["193", "194C", "194D", "194DA", "194E"], portal: "" },
  { id: "2627-tdstcs-2", financialYear: "2026-27", date: "2026-04-07", month: "APR", day: "7", type: "TDS/TCS", title: "April 7, 2026 (Tuesday)", description: "Form 27C — Buyer declarations upload — Mar 2026", sections: ["193", "194C", "194D", "194DA", "194E"], portal: "" },
  { id: "2627-tdstcs-3", financialYear: "2026-27", date: "2026-04-14", month: "APR", day: "14", type: "TDS/TCS", title: "April 14, 2026 (Tuesday)", description: "TDS Certificate — 194-IA/194-IB/194M/194S — Feb 2026", sections: ["194M", "194-IA", "194-IB", "194S"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-4", financialYear: "2026-27", date: "2026-04-30", month: "APR", day: "30", type: "TDS/TCS", title: "April 30, 2026 (Thursday)", description: "Form 24G — Govt. TDS/TCS without challan — Mar 2026", sections: ["197", "196B", "196C", "198", "191"], portal: "" },
  { id: "2627-tdstcs-5", financialYear: "2026-27", date: "2026-04-30", month: "APR", day: "30", type: "TDS/TCS", title: "April 30, 2026 (Thursday)", description: "Challan-cum-statement — 194-IA/194-IB/194M/194S — Mar 2026", sections: ["194M", "194-IA", "194-IB", "194S"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-6", financialYear: "2026-27", date: "2026-04-30", month: "APR", day: "30", type: "TDS/TCS", title: "April 30, 2026 (Thursday)", description: "TDS deposit (non-Govt. deductor) — Mar 2026", sections: ["192", "193", "192A", "194", "190"], portal: "" },
  { id: "2627-tdstcs-7", financialYear: "2026-27", date: "2026-04-30", month: "APR", day: "30", type: "TDS/TCS", title: "April 30, 2026 (Thursday)", description: "Quarterly TDS deposit (AO-permitted) — Jan-Mar 2026", sections: ["194D", "194A", "194H", "192"], portal: "" },
  { id: "2627-tdstcs-8", financialYear: "2026-27", date: "2026-04-30", month: "APR", day: "30", type: "TDS/TCS", title: "April 30, 2026 (Thursday)", description: "Form 15G/15H upload — Q4 (qtr ending Mar 31, 2026)", sections: ["197A"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-9", financialYear: "2026-27", date: "2026-05-07", month: "MAY", day: "7", type: "TDS/TCS", title: "May 7, 2026 (Thursday)", description: "TDS/TCS deposit (Govt. deductor) — Apr 2026", sections: ["392", "398", "399", "397", "394"], portal: "" },
  { id: "2627-tdstcs-10", financialYear: "2026-27", date: "2026-05-07", month: "MAY", day: "7", type: "TDS/TCS", title: "May 7, 2026 (Thursday)", description: "Declaration u/s 394(2) by buyer — Apr 2026", sections: ["394"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-11", financialYear: "2026-27", date: "2026-05-15", month: "MAY", day: "15", type: "TDS/TCS", title: "May 15, 2026 (Friday)", description: "TDS Certificate — 194-IA/194-IB/194M — Mar 2026", sections: ["194-IB", "194-IA", "194M"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-12", financialYear: "2026-27", date: "2026-05-15", month: "MAY", day: "15", type: "TDS/TCS", title: "May 15, 2026 (Friday)", description: "Form 24G — Govt. TDS/TCS without challan — Apr 2026", sections: [], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-13", financialYear: "2026-27", date: "2026-05-15", month: "MAY", day: "15", type: "TDS/TCS", title: "May 15, 2026 (Friday)", description: "Quarterly TCS Return — Q4 (qtr ending Mar 31, 2026)", sections: [], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-14", financialYear: "2026-27", date: "2026-05-30", month: "MAY", day: "30", type: "TDS/TCS", title: "May 30, 2026 (Saturday)", description: "TCS Certificate — Q4 FY 2025-26", sections: ["394"], portal: "" },
  { id: "2627-tdstcs-15", financialYear: "2026-27", date: "2026-05-30", month: "MAY", day: "30", type: "TDS/TCS", title: "May 30, 2026 (Saturday)", description: "Challan-cum-statement (393(1) specified sections) — Apr 2026", sections: ["393"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-16", financialYear: "2026-27", date: "2026-05-31", month: "MAY", day: "31", type: "TDS/TCS", title: "May 31, 2026 (Sunday)", description: "Quarterly TDS Return — Q4 (qtr ending Mar 31, 2026)", sections: ["192", "193", "192A", "194", "190"], portal: "" },
  { id: "2627-tdstcs-17", financialYear: "2026-27", date: "2026-05-31", month: "MAY", day: "31", type: "TDS/TCS", title: "May 31, 2026 (Sunday)", description: "Superannuation fund — TDS on contributions return", sections: ["392"], portal: "" },
  { id: "2627-tdstcs-18", financialYear: "2026-27", date: "2026-06-07", month: "JUN", day: "7", type: "TDS/TCS", title: "June 7, 2026 (Sunday)", description: "TDS/TCS deposit (Govt. deductor) — May 2026", sections: ["392", "398", "399", "397", "394"], portal: "" },
  { id: "2627-tdstcs-19", financialYear: "2026-27", date: "2026-06-07", month: "JUN", day: "7", type: "TDS/TCS", title: "June 7, 2026 (Sunday)", description: "Declaration u/s 394(2) by buyer — May 2026", sections: ["394"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-20", financialYear: "2026-27", date: "2026-06-14", month: "JUN", day: "14", type: "TDS/TCS", title: "June 14, 2026 (Sunday)", description: "TDS Certificate (393(1) specified sections) — Apr 2026", sections: ["395", "393"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-21", financialYear: "2026-27", date: "2026-06-15", month: "JUN", day: "15", type: "TDS/TCS", title: "June 15, 2026 (Monday)", description: "Govt. TDS/TCS furnished without challan — May 2026", sections: [], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-22", financialYear: "2026-27", date: "2026-06-15", month: "JUN", day: "15", type: "TDS/TCS", title: "June 15, 2026 (Monday)", description: "Form 16 — Salary TDS Certificate — FY 2025-26", sections: [], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-23", financialYear: "2026-27", date: "2026-06-30", month: "JUN", day: "30", type: "TDS/TCS", title: "June 30, 2026 (Tuesday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — May 2026", sections: [], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-24", financialYear: "2026-27", date: "2026-06-30", month: "JUN", day: "30", type: "TDS/TCS", title: "June 30, 2026 (Tuesday)", description: "Non-deduction return — banking co. time deposits — Q4 (qtr ending Mar 31, 2026)", sections: [], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-25", financialYear: "2026-27", date: "2026-07-07", month: "JUL", day: "7", type: "TDS/TCS", title: "July 7, 2026 (Tuesday)", description: "TDS/TCS deposit (Govt. deductor) — Jun 2026", sections: ["393", "394"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-26", financialYear: "2026-27", date: "2026-07-07", month: "JUL", day: "7", type: "TDS/TCS", title: "July 7, 2026 (Tuesday)", description: "Quarterly TDS deposit (AO-permitted) — Apr-Jun 2026", sections: ["392", "393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-27", financialYear: "2026-27", date: "2026-07-15", month: "JUL", day: "15", type: "TDS/TCS", title: "July 15, 2026 (Wednesday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — May 2026", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-28", financialYear: "2026-27", date: "2026-07-30", month: "JUL", day: "30", type: "TDS/TCS", title: "July 30, 2026 (Thursday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Jun 2026", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-29", financialYear: "2026-27", date: "2026-07-31", month: "JUL", day: "31", type: "TDS/TCS", title: "July 31, 2026 (Friday)", description: "Form 143 — Quarterly TCS Return — Q1 (qtr ending Jun 30, 2026)", sections: ["397"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-30", financialYear: "2026-27", date: "2026-07-31", month: "JUL", day: "31", type: "TDS/TCS", title: "July 31, 2026 (Friday)", description: "Form 140 — Quarterly TDS Return (non-salary, residents) — Q1 (qtr ending Jun 30, 2026)", sections: ["397"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-31", financialYear: "2026-27", date: "2026-07-31", month: "JUL", day: "31", type: "TDS/TCS", title: "July 31, 2026 (Friday)", description: "Form 142 — Quarterly TDS Return (virtual digital asset) — Q1 (qtr ending Jun 30, 2026)", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-32", financialYear: "2026-27", date: "2026-07-31", month: "JUL", day: "31", type: "TDS/TCS", title: "July 31, 2026 (Friday)", description: "Form 144 — Quarterly TDS Return (Non-Residents) — Q1 (qtr ending Jun 30, 2026)", sections: ["397"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-33", financialYear: "2026-27", date: "2026-07-31", month: "JUL", day: "31", type: "TDS/TCS", title: "July 31, 2026 (Friday)", description: "Form 138 — Quarterly TDS Return (Salary / Specified Senior Citizen) — Q1 (qtr ending Jun 30, 2026)", sections: ["392", "393", "397"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-34", financialYear: "2026-27", date: "2026-08-14", month: "AUG", day: "14", type: "TDS/TCS", title: "August 14, 2026 (Friday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Jun 2026", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-35", financialYear: "2026-27", date: "2026-08-15", month: "AUG", day: "15", type: "TDS/TCS", title: "August 15, 2026 (Saturday)", description: "Form 137 — Govt. TDS/TCS furnished without challan — Jul 2026", sections: ["397"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-36", financialYear: "2026-27", date: "2026-08-15", month: "AUG", day: "15", type: "TDS/TCS", title: "August 15, 2026 (Saturday)", description: "Form 131 — TDS Certificate (non-salary) — Q1 (qtr ending Jun 30, 2026)", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-37", financialYear: "2026-27", date: "2026-08-15", month: "AUG", day: "15", type: "TDS/TCS", title: "August 15, 2026 (Saturday)", description: "Form 133 — TCS Certificate — Q1 (qtr ending Jun 30, 2026)", sections: ["395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-38", financialYear: "2026-27", date: "2026-08-30", month: "AUG", day: "30", type: "TDS/TCS", title: "August 30, 2026 (Sunday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Jul 2026", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-39", financialYear: "2026-27", date: "2026-09-07", month: "SEP", day: "7", type: "TDS/TCS", title: "September 7, 2026 (Monday)", description: "TDS/TCS deposit (Govt. deductor) — Aug 2026", sections: ["393", "394"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-40", financialYear: "2026-27", date: "2026-09-14", month: "SEP", day: "14", type: "TDS/TCS", title: "September 14, 2026 (Monday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Jul 2026", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-41", financialYear: "2026-27", date: "2026-09-15", month: "SEP", day: "15", type: "TDS/TCS", title: "September 15, 2026 (Tuesday)", description: "Form 137 — Govt. TDS/TCS furnished without challan — Aug 2026", sections: ["397"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-42", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "TDS/TCS", title: "September 30, 2026 (Wednesday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Aug 2026", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-43", financialYear: "2026-27", date: "2026-10-07", month: "OCT", day: "7", type: "TDS/TCS", title: "October 7, 2026 (Wednesday)", description: "TDS/TCS deposit (Govt. deductor) — Sep 2026", sections: ["393", "394"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-44", financialYear: "2026-27", date: "2026-10-07", month: "OCT", day: "7", type: "TDS/TCS", title: "October 7, 2026 (Wednesday)", description: "Quarterly TDS deposit (AO-permitted) — Jul-Sep 2026", sections: ["392", "393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-45", financialYear: "2026-27", date: "2026-10-07", month: "OCT", day: "7", type: "TDS/TCS", title: "October 7, 2026 (Wednesday)", description: "Form 137 — Govt. TDS/TCS furnished without challan — Sep 2026", sections: ["397"], portal: "Go to Protean Portal" },
  { id: "2627-tdstcs-46", financialYear: "2026-27", date: "2026-10-15", month: "OCT", day: "15", type: "TDS/TCS", title: "October 15, 2026 (Thursday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Aug 2026", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-47", financialYear: "2026-27", date: "2026-10-30", month: "OCT", day: "30", type: "TDS/TCS", title: "October 30, 2026 (Friday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Sep 2026", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-48", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "TDS/TCS", title: "October 31, 2026 (Saturday)", description: "Form 144 — Quarterly TDS Return (Non-Residents) — Q2 (qtr ending Sep 30, 2026)", sections: ["397"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-49", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "TDS/TCS", title: "October 31, 2026 (Saturday)", description: "Form 143 — Quarterly TCS Return — Q2 (qtr ending Sep 30, 2026)", sections: ["397"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-50", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "TDS/TCS", title: "October 31, 2026 (Saturday)", description: "Form 140 — Quarterly TDS Return (non-salary, residents) — Q2 (qtr ending Sep 30, 2026)", sections: ["397"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-51", financialYear: "2026-27", date: "2026-11-07", month: "NOV", day: "7", type: "TDS/TCS", title: "November 7, 2026 (Saturday)", description: "TDS/TCS deposit (Govt. deductor) — Oct 2026", sections: ["393", "394"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-52", financialYear: "2026-27", date: "2026-11-14", month: "NOV", day: "14", type: "TDS/TCS", title: "November 14, 2026 (Saturday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Sep 2026", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-53", financialYear: "2026-27", date: "2026-11-15", month: "NOV", day: "15", type: "TDS/TCS", title: "November 15, 2026 (Sunday)", description: "Form 137 — Govt. TDS/TCS furnished without challan — Oct 2026", sections: ["397"], portal: "Go to Protean Portal" },
  { id: "2627-tdstcs-54", financialYear: "2026-27", date: "2026-11-15", month: "NOV", day: "15", type: "TDS/TCS", title: "November 15, 2026 (Sunday)", description: "Form 133 — TCS Certificate — Q2 (qtr ending Sep 30, 2026)", sections: ["395"], portal: "" },
  { id: "2627-tdstcs-55", financialYear: "2026-27", date: "2026-11-15", month: "NOV", day: "15", type: "TDS/TCS", title: "November 15, 2026 (Sunday)", description: "Form 131 — TDS Certificate (non-salary) — Q2 (qtr ending Sep 30, 2026)", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-56", financialYear: "2026-27", date: "2026-11-30", month: "NOV", day: "30", type: "TDS/TCS", title: "November 30, 2026 (Monday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Oct 2026", sections: ["393"], portal: "" },
  { id: "2627-tdstcs-57", financialYear: "2026-27", date: "2026-12-07", month: "DEC", day: "7", type: "TDS/TCS", title: "December 7, 2026 (Monday)", description: "TDS/TCS deposit (Govt. deductor) — Nov 2026", sections: ["393", "394"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-58", financialYear: "2026-27", date: "2026-12-15", month: "DEC", day: "15", type: "TDS/TCS", title: "December 15, 2026 (Tuesday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Oct 2026", sections: ["393", "394"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-59", financialYear: "2026-27", date: "2026-12-30", month: "DEC", day: "30", type: "TDS/TCS", title: "December 30, 2026 (Wednesday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Nov 2026", sections: ["393"], portal: "" },
  { id: "2627-tdstcs-60", financialYear: "2026-27", date: "2027-01-07", month: "JAN", day: "7", type: "TDS/TCS", title: "January 7, 2027 (Thursday)", description: "Quarterly TDS deposit (AO-permitted) — Oct-Dec 2026", sections: ["392", "393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-61", financialYear: "2026-27", date: "2027-01-07", month: "JAN", day: "7", type: "TDS/TCS", title: "January 7, 2027 (Thursday)", description: "TDS/TCS deposit (Govt. deductor) — Dec 2026", sections: ["393", "394"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-62", financialYear: "2026-27", date: "2027-01-14", month: "JAN", day: "14", type: "TDS/TCS", title: "January 14, 2027 (Thursday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Nov 2026", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-63", financialYear: "2026-27", date: "2027-01-15", month: "JAN", day: "15", type: "TDS/TCS", title: "January 15, 2027 (Friday)", description: "Form 137 — Govt. TDS/TCS furnished without challan — Dec 2026", sections: ["397"], portal: "Go to Protean Portal" },
  { id: "2627-tdstcs-64", financialYear: "2026-27", date: "2027-01-30", month: "JAN", day: "30", type: "TDS/TCS", title: "January 30, 2027 (Saturday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Dec 2026", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-65", financialYear: "2026-27", date: "2027-01-31", month: "JAN", day: "31", type: "TDS/TCS", title: "January 31, 2027 (Sunday)", description: "Form 138 — Quarterly TDS Return (Salary / Specified Senior Citizen) — Q3 (qtr ending Dec 31, 2026)", sections: ["392", "393", "397"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-66", financialYear: "2026-27", date: "2027-01-31", month: "JAN", day: "31", type: "TDS/TCS", title: "January 31, 2027 (Sunday)", description: "Form 140 — Quarterly TDS Return (non-salary, residents) — Q3 (qtr ending Dec 31, 2026)", sections: ["397"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-67", financialYear: "2026-27", date: "2027-01-31", month: "JAN", day: "31", type: "TDS/TCS", title: "January 31, 2027 (Sunday)", description: "Form 144 — Quarterly TDS Return (Non-Residents) — Q3 (qtr ending Dec 31, 2026)", sections: ["397"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-68", financialYear: "2026-27", date: "2027-01-31", month: "JAN", day: "31", type: "TDS/TCS", title: "January 31, 2027 (Sunday)", description: "Form 143 — Quarterly TCS Return — Q3 (qtr ending Dec 31, 2026)", sections: ["397"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-69", financialYear: "2026-27", date: "2027-02-14", month: "FEB", day: "14", type: "TDS/TCS", title: "February 14, 2027 (Sunday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Dec 2026", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-70", financialYear: "2026-27", date: "2027-02-15", month: "FEB", day: "15", type: "TDS/TCS", title: "February 15, 2027 (Monday)", description: "Form 137 — Govt. TDS/TCS furnished without challan — Jan 2027", sections: ["397"], portal: "Go to Protean Portal" },
  { id: "2627-tdstcs-71", financialYear: "2026-27", date: "2027-02-15", month: "FEB", day: "15", type: "TDS/TCS", title: "February 15, 2027 (Monday)", description: "Form 131 — TDS Certificate (non-salary) — Q3 (qtr ending Dec 31, 2026)", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-72", financialYear: "2026-27", date: "2027-02-15", month: "FEB", day: "15", type: "TDS/TCS", title: "February 15, 2027 (Monday)", description: "Form 133 — TCS Certificate — Q3 (qtr ending Dec 31, 2026)", sections: ["395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-73", financialYear: "2026-27", date: "2027-03-02", month: "MAR", day: "2", type: "TDS/TCS", title: "March 2, 2027 (Tuesday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Jan 2027", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-74", financialYear: "2026-27", date: "2027-03-07", month: "MAR", day: "7", type: "TDS/TCS", title: "March 7, 2027 (Sunday)", description: "TDS/TCS deposit (Govt. deductor) — Feb 2027", sections: ["393", "394"], portal: "Go to e-Filing Portal" },
  { id: "2627-tdstcs-75", financialYear: "2026-27", date: "2027-03-17", month: "MAR", day: "17", type: "TDS/TCS", title: "March 17, 2027 (Wednesday)", description: "Form 132 — TDS Certificate (393(1) specified sections) — Jan 2027", sections: ["393", "395"], portal: "Go to TRACES Portal" },
  { id: "2627-tdstcs-76", financialYear: "2026-27", date: "2027-03-30", month: "MAR", day: "30", type: "TDS/TCS", title: "March 30, 2027 (Tuesday)", description: "Form 141 — Challan-cum-statement (393(1) specified sections) — Feb 2027", sections: ["393"], portal: "Go to e-Filing Portal" },
  { id: "2627-tax-payment-77", financialYear: "2026-27", date: "2026-06-15", month: "JUN", day: "15", type: "Tax Payment", title: "June 15, 2026 (Monday)", description: "Advance Tax — 1st Instalment (15%) — Tax Year 2026-27", sections: [], portal: "" },
  { id: "2627-tax-payment-78", financialYear: "2026-27", date: "2026-09-15", month: "SEP", day: "15", type: "Tax Payment", title: "September 15, 2026 (Tuesday)", description: "Advance Tax — 2nd Instalment (45%) — Tax Year 2026-27", sections: [], portal: "" },
  { id: "2627-tax-payment-79", financialYear: "2026-27", date: "2026-12-15", month: "DEC", day: "15", type: "Tax Payment", title: "December 15, 2026 (Tuesday)", description: "Advance Tax — 3rd Instalment (75%) — Tax Year 2026-27", sections: [], portal: "" },
  { id: "2627-tax-payment-80", financialYear: "2026-27", date: "2027-03-15", month: "MAR", day: "15", type: "Tax Payment", title: "March 15, 2027 (Monday)", description: "Advance Tax — Presumptive Scheme, 100% (Sec 58(2)) — Tax Year 2026-27", sections: [], portal: "Go to TRACES Portal" },
  { id: "2627-tax-payment-81", financialYear: "2026-27", date: "2027-03-15", month: "MAR", day: "15", type: "Tax Payment", title: "March 15, 2027 (Monday)", description: "Advance Tax — 4th / Final Instalment (100%) — Tax Year 2026-27", sections: [], portal: "Go to e-Filing Portal" },
  // =====================================================
  // 2026-27 Audit (tax audit reports, 44AB, 115JB/JC, trust/
  // NPO audit, transfer pricing, CbCR intimations, etc.)
  // =====================================================

  { id: "2627-audit-1", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 10-IJ — CA certificate, Category-III AIF exempt income (Sec 10(23FF)) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["10"], portal: "" },
  { id: "2627-audit-2", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 29B — Book Profit report (Sec 115JB, MAT) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["115JB"], portal: "" },
  { id: "2627-audit-3", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Tax Audit Report (Form 3CA/3CB/3CD, Sec 44AB) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["44AB"], portal: "" },
  { id: "2627-audit-4", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 3AC — Audit report, Tea/Coffee/Rubber development a/c (Sec 33AB) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["33AB"], portal: "" },
  { id: "2627-audit-5", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 10B/10BB — Audit report, trust/institution/university/hospital (NPO) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: [], portal: "" },
  { id: "2627-audit-6", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 3AE — Audit report, preliminary expenses (Sec 35D(4)) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["35D", "35E"], portal: "" },
  { id: "2627-audit-7", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 3AD — Audit report, Site Restoration Fund (Sec 33ABA) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["33ABA"], portal: "" },
  { id: "2627-audit-8", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 3CE — Audit report, non-resident/foreign co. royalty-FTS (Sec 44DA) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["44DA"], portal: "" },
  { id: "2627-audit-9", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 3CEA — Capital gains computation, slump sale (Sec 50B) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["50B"], portal: "" },
  { id: "2627-audit-10", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 29C — AMT report (Sec 115JC) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["115JC"], portal: "" },
  { id: "2627-audit-11", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 66 — Audit report, Tonnage Tax Company (Sec 115VW) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["115VW"], portal: "" },
  { id: "2627-audit-12", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 10-IL — Audit report, IFSC offshore banking unit (Sec 10(4D)) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["10"], portal: "" },
  { id: "2627-audit-13", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 10CCB — Audit report, deduction u/s 80-I/80-IA/80-IB/80-IC (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["80-IB", "80-IA", "80-I", "80-IC"], portal: "" },
  { id: "2627-audit-14", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 10DA — Additional employee cost report (Sec 80JJAA) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["80JJAA"], portal: "" },
  { id: "2627-audit-15", financialYear: "2026-27", date: "2026-09-30", month: "SEP", day: "30", type: "Audit", title: "September 30, 2026 (Wednesday)", description: "Form 3AE — Audit report, mineral prospecting expenditure (Sec 35E(6)) (Note: originally due earlier; revised to 21/10/2026 per Circular)", sections: ["35D", "35E"], portal: "" },
  { id: "2627-audit-16", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 10-IJ — CA certificate, Category-III AIF exempt income (Sec 10(23FF))", sections: ["10"], portal: "" },
  { id: "2627-audit-17", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Tax Audit Report (Form 3CA/3CB/3CD, Sec 44AB)", sections: ["44AB"], portal: "" },
  { id: "2627-audit-18", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 10-IL — Audit report, IFSC offshore banking unit (Sec 10(4D))", sections: ["10"], portal: "" },
  { id: "2627-audit-19", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 3AE — Audit report, preliminary expenses (Sec 35D(4))", sections: ["35D", "35E"], portal: "" },
  { id: "2627-audit-20", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 10B/10BB — Audit report, trust/institution/university/hospital (NPO)", sections: [], portal: "" },
  { id: "2627-audit-21", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 3AC — Audit report, Tea/Coffee/Rubber development a/c (Sec 33AB)", sections: ["33AB"], portal: "" },
  { id: "2627-audit-22", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 3AD — Audit report, Site Restoration Fund (Sec 33ABA)", sections: ["33ABA"], portal: "" },
  { id: "2627-audit-23", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 29B — Book Profit report (Sec 115JB, MAT)", sections: ["115JB"], portal: "" },
  { id: "2627-audit-24", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 29C — AMT report (Sec 115JC)", sections: ["115JC"], portal: "" },
  { id: "2627-audit-25", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 66 — Audit report, Tonnage Tax Company (Sec 115VW)", sections: ["115VW"], portal: "" },
  { id: "2627-audit-26", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 10DA — Additional employee cost report (Sec 80JJAA)", sections: ["80JJAA"], portal: "" },
  { id: "2627-audit-27", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 3AE — Audit report, mineral prospecting expenditure (Sec 35E(6))", sections: ["35D", "35E"], portal: "" },
  { id: "2627-audit-28", financialYear: "2026-27", date: "2026-10-21", month: "OCT", day: "21", type: "Audit", title: "October 21, 2026 (Wednesday)", description: "Form 3CE — Audit report, non-resident/foreign co. royalty-FTS (Sec 44DA)", sections: ["44DA"], portal: "" },
  { id: "2627-audit-29", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Tax Audit Report (44AB) — Sec 92E international/specified domestic transaction cases", sections: ["44AB", "92E"], portal: "" },
  { id: "2627-audit-30", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3CEAB — CbCR intimation by designated constituent entity (Sec 286)", sections: ["286"], portal: "" },
  { id: "2627-audit-31", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3CEJA — CA report, eligible investment fund conditions (Sec 9A)", sections: ["9A"], portal: "" },
  { id: "2627-audit-32", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3CEAC — CbCR intimation by constituent entity, foreign parent (Sec 286)", sections: ["286"], portal: "" },
  { id: "2627-audit-33", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 10-IJ — CA certificate, Category-III AIF exempt income (Sec 10(23FF))", sections: ["10"], portal: "" },
  { id: "2627-audit-34", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3AE — Audit report, mineral prospecting expenditure (Sec 35E(6))", sections: ["35D", "35E"], portal: "" },
  { id: "2627-audit-35", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3CE — Audit report, non-resident/foreign co. royalty-FTS (Sec 44DA)", sections: ["44DA"], portal: "" },
  { id: "2627-audit-36", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 10DA — Additional employee cost report (Sec 80JJAA)", sections: ["80JJAA"], portal: "" },
  { id: "2627-audit-37", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3AE — Audit report, preliminary expenses (Sec 35D(4))", sections: ["35E", "35D"], portal: "" },
  { id: "2627-audit-38", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3AC — Audit report, Tea/Coffee/Rubber development a/c (Sec 33AB)", sections: ["33AB"], portal: "" },
  { id: "2627-audit-39", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3AD — Audit report, Site Restoration Fund (Sec 33ABA)", sections: ["33ABA"], portal: "" },
  { id: "2627-audit-40", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3CEA — Capital gains computation, slump sale (Sec 50B)", sections: ["50B"], portal: "" },
  { id: "2627-audit-41", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 10CCB — Audit report, deduction u/s 80-I/80-IA/80-IB/80-IC", sections: ["80-I"], portal: "" },
  { id: "2627-audit-42", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 3CLA — In-house R&D facility accounts to DSIR (Sec 35(2AB)) (Note: originally due earlier; revised to 21/11/2026 per Circular)", sections: ["35"], portal: "" },
  { id: "2627-audit-43", financialYear: "2026-27", date: "2026-10-31", month: "OCT", day: "31", type: "Audit", title: "October 31, 2026 (Saturday)", description: "Form 10CCF — IFSC/Offshore Banking Unit deduction report (Sec 80LA) (Note: originally due earlier; revised to 21/11/2026 per Circular)", sections: ["80LA"], portal: "" },
  { id: "2627-audit-44", financialYear: "2026-27", date: "2026-11-21", month: "NOV", day: "21", type: "Audit", title: "November 21, 2026 (Saturday)", description: "Form 10BC — Audit report, Electoral Trust", sections: ["13B"], portal: "" },
  { id: "2627-audit-45", financialYear: "2026-27", date: "2026-11-21", month: "NOV", day: "21", type: "Audit", title: "November 21, 2026 (Saturday)", description: "Form 10CCF — IFSC/Offshore Banking Unit deduction report (Sec 80LA)", sections: ["80LA"], portal: "" },
  { id: "2627-audit-46", financialYear: "2026-27", date: "2026-11-21", month: "NOV", day: "21", type: "Audit", title: "November 21, 2026 (Saturday)", description: "Form 3CLA — In-house R&D facility accounts to DSIR (Sec 35(2AB))", sections: ["35"], portal: "" },
  { id: "2627-audit-47", financialYear: "2026-27", date: "2026-11-30", month: "NOV", day: "30", type: "Audit", title: "November 30, 2026 (Monday)", description: "Form 3CLA — In-house R&D facility accounts to DSIR (Sec 35(2AB))", sections: ["35"], portal: "" },
  { id: "2627-audit-48", financialYear: "2026-27", date: "2026-11-30", month: "NOV", day: "30", type: "Audit", title: "November 30, 2026 (Monday)", description: "Form 10CCF — IFSC/Offshore Banking Unit deduction report (Sec 80LA)", sections: ["80LA"], portal: "" },
  { id: "2627-audit-49", financialYear: "2026-27", date: "2026-11-30", month: "NOV", day: "30", type: "Audit", title: "November 30, 2026 (Monday)", description: "Form 3CEAA — Constituent entity report, international group (Sec 286)", sections: ["286"], portal: "" },
  { id: "2627-audit-50", financialYear: "2026-27", date: "2026-11-30", month: "NOV", day: "30", type: "Audit", title: "November 30, 2026 (Monday)", description: "Form 3CEFA/3CEFB/3CEFC — Safe Harbour option", sections: [], portal: "" },
  { id: "2627-audit-51", financialYear: "2026-27", date: "2026-12-31", month: "DEC", day: "31", type: "Audit", title: "December 31, 2026 (Thursday)", description: "Form 3CEAD — CbCR report by parent/alternate reporting entity (Sec 286)", sections: ["286"], portal: "" },
  { id: "2627-audit-52", financialYear: "2026-27", date: "2027-01-31", month: "JAN", day: "31", type: "Audit", title: "January 31, 2027 (Sunday)", description: "Form 3CEAC — CbCR intimation by constituent entity, foreign parent (Sec 286)", sections: ["286"], portal: "" },
  { id: "2627-audit-53", financialYear: "2026-27", date: "2027-03-31", month: "MAR", day: "31", type: "Audit", title: "March 31, 2027 (Wednesday)", description: "Form 3CEAD — CbCR report by parent/alternate reporting entity (Sec 286)", sections: ["286"], portal: "" },

  // =====================================================
  // 2026-27 ITR
  // =====================================================

  {
    id: "2627-itr-1",
    financialYear: "2026-27",
    date: "2026-07-31",
    month: "JUL",
    day: "31",
    type: "ITR",
    title: "July 31, 2026 (Friday)",
    description: `Due date for furnishing the return of income for the Assessment Year 2026–27 by an assessee, other than the following:

• An assessee, including a partner of a firm or the spouse of such partner (where Section 5A of the Income-tax Act, 1961 applies), to whom the provisions of Section 92E of the Income-tax Act, 1961 apply;

• A company to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

• An assessee whose accounts are required to be audited, to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

• A partner of a firm whose accounts are required to be audited, or the spouse of such partner (where Section 5A of the Income-tax Act, 1961 applies), to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

• An assessee having income from business or profession whose accounts are not required to be audited, and to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply; and

• A partner of a firm whose accounts are not required to be audited, or the spouse of such partner (where Section 5A of the Income-tax Act, 1961 applies), to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply.`,
    sections: [],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2627-itr-2",
    financialYear: "2026-27",
    date: "2026-08-31",
    month: "AUG",
    day: "31",
    type: "ITR",
    title: "August 31, 2026 (Monday)",
    description: `Due date for furnishing the return of income for the Assessment Year 2026–27 by the following assessees:

• An assessee having income from business or profession whose accounts are not required to be audited, and to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply; and

• A partner of a firm whose accounts are not required to be audited, or the spouse of such partner (where Section 5A of the Income-tax Act, 1961 applies), to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply.`,
    sections: ["92E", "5A"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2627-itr-3",
    financialYear: "2026-27",
    date: "2026-10-31",
    month: "OCT",
    day: "31",
    type: "ITR",
    title: "October 31, 2026 (Saturday)",
    daysToGo: "23 Days to go",
    revisedDate: "Revised due date 21/11/2026",
    description: `Due date for furnishing the return of income for the Assessment Year 2026–27 by the following assessees:

• A company to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

• An assessee whose accounts are required to be audited, to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

• A partner of a firm whose accounts are required to be audited, or the spouse of such partner (where Section 5A of the Income-tax Act, 1961 applies), to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

Note: The due date for furnishing of return of income for Assessment Year 2026-27 has been extended from October 31, 2026, to November 21, 2026, vide Circular No. 07/2026 dated 28-09-2026.`,
    sections: ["92E", "139", "5A"],
    portal: "Go to e-Filing Portal",
    circular: "Circular-7-2026",
  },

  {
    id: "2627-itr-4",
    financialYear: "2026-27",
    date: "2026-11-21",
    month: "NOV",
    day: "21",
    type: "ITR",
    title: "November 21, 2026 (Saturday)",
    description: `Due date for furnishing the return of income for the Assessment Year 2026–27 by the following assessees:

• A company to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

• An assessee whose accounts are required to be audited, to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

• A partner of a firm whose accounts are required to be audited, or the spouse of such partner (where Section 5A of the Income-tax Act, 1961 applies), to whom the provisions of Section 92E of the Income-tax Act, 1961 do not apply;

Note: The due date for furnishing of return of income for Assessment Year 2026-27 has been extended from October 31, 2026, to November 21, 2026, vide Circular No. 07/2026 dated 28-09-2026.`,
    sections: ["92E", "139", "5A"],
    portal: "Go to e-Filing Portal",
    circular: "Circular-7-2026",
  },

  {
    id: "2627-itr-5",
    financialYear: "2026-27",
    date: "2026-11-30",
    month: "NOV",
    day: "30",
    type: "ITR",
    title: "November 30, 2026 (Monday)",
    description: `Due date for furnishing the return of income for the Assessment Year 2026–27 by an assessee, including a partner of a firm or the spouse of such partner (where Section 5A of the Income-tax Act, 1961 applies), who is required to furnish a report under Section 92E of the Income-tax Act, 1961.`,
    sections: ["92E", "5A"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2627-itr-6",
    financialYear: "2026-27",
    date: "2026-12-31",
    month: "DEC",
    day: "31",
    type: "ITR",
    title: "December 31, 2026 (Thursday)",
    description:
      "Filing of belated return of income for the Assessment Year 2026-27 for all assessees (provided assessment has not been completed on or before December 31, 2026).",
    sections: [],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2627-itr-7",
    financialYear: "2026-27",
    date: "2027-03-31",
    month: "MAR",
    day: "31",
    type: "ITR",
    title: "March 31, 2027 (Wednesday)",
    description:
      "Filing of revised return of income for the Assessment Year 2026-27 for all assessees (provided assessment has not been completed on or before March 31, 2027).",
    sections: [],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2627-itr-8",
    financialYear: "2026-27",
    date: "2027-03-31",
    month: "MAR",
    day: "31",
    type: "ITR",
    title: "March 31, 2027 (Wednesday)",
    description:
      "Furnishing of an updated return of income for the Assessment Year 2022-23.",
    sections: [],
    portal: "Go to e-Filing Portal",
  },

  // =====================================================
  // 2025-26 ITR
  // =====================================================

  {
    id: "2526-itr-1",
    financialYear: "2025-26",
    date: "2025-07-31",
    month: "JUL",
    day: "31",
    type: "ITR",
    title: "July 31, 2025 (Thursday)",
    description: `Exercising the option to opt for alternative tax regime under section 115BAD or section 115BAE by co-operative society (if assessee is required to submit return of income by July 31, 2025)*

* The due date for furnishing the return of income for Assessment Year 2025-26 has been extended from July 31, 2025, to September 15, 2025, vide Circular No. 06/2025, dated 27-05-2025. The date has been further extended to September 16, 2025 vide Circular No. 12/2025, dated 15-09-2025. Accordingly, the due date for submission of this form/report shall stand extended to September 16, 2025.`,
    sections: ["115BAE", "115BAD"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-2",
    financialYear: "2025-26",
    date: "2025-07-31",
    month: "JUL",
    day: "31",
    type: "ITR",
    title: "July 31, 2025 (Thursday)",
    description: `Exercising the option to opt-out from the new tax regime under section 115BAC (if assessee is required to submit return of income by July 31, 2025)*

* The due date for furnishing the return of income for Assessment Year 2025-26 has been extended from July 31, 2025, to September 15, 2025, vide Circular No. 06/2025, dated 27-05-2025. The date has been further extended to September 16, 2025 vide Circular No. 12/2025, dated 15-09-2025. Accordingly, the due date for submission of this form/report shall stand extended to September 16, 2025.`,
    sections: ["115BAC"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-3",
    financialYear: "2025-26",
    date: "2025-09-15",
    month: "SEP",
    day: "15",
    type: "ITR",
    title: "September 15, 2025 (Monday)",
    description: `Return of income for the Assessment Year 2025-26 for all assessees other than:

(a) corporate assessee;
(b) non-corporate assessee whose books of account are required to be audited;
(c) partner of a firm whose accounts are required to be audited or the spouse of such partner if the provisions of Section 5A apply; or
(d) an assessee who is required to furnish a report under Section 92E.

Note: The due date for furnishing the return of income for Assessment Year 2025-26 has been extended from July 31, 2025, to September 15, 2025, vide Circular No. 06/2025, dated 27-05-2025.`,
    sections: ["139"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-4",
    financialYear: "2025-26",
    date: "2025-09-16",
    month: "SEP",
    day: "16",
    type: "ITR",
    title: "September 16, 2025 (Tuesday)",
    description: `Exercising the option to opt-out from the new tax regime under section 115BAC (if assessee is required to submit return of income by July 31, 2025)*

* The due date for furnishing the return of income for Assessment Year 2025-26 has been extended from July 31, 2025, to September 15, 2025, vide Circular No. 06/2025, dated 27-05-2025. The date has been further extended to September 16, 2025 vide Circular No. 12/2025, dated 15-09-2025. Accordingly, the due date for submission of this form/report shall stand extended to September 16, 2025.`,
    sections: ["115BAC"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-5",
    financialYear: "2025-26",
    date: "2025-09-16",
    month: "SEP",
    day: "16",
    type: "ITR",
    title: "September 16, 2025 (Tuesday)",
    description: `Exercising the option to opt for alternative tax regime under section 115BAD or section 115BAE by co-operative society (if assessee is required to submit return of income by July 31, 2025)*

* The due date for furnishing the return of income for Assessment Year 2025-26 has been extended to September 16, 2025 vide Circular No. 12/2025, dated 15-09-2025.`,
    sections: ["115BAE", "115BAD"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-6",
    financialYear: "2025-26",
    date: "2025-09-16",
    month: "SEP",
    day: "16",
    type: "ITR",
    title: "September 16, 2025 (Tuesday)",
    description: `Return of income for the Assessment Year 2025-26 for all assessees other than:

(a) corporate assessee;
(b) non-corporate assessee whose books of account are required to be audited;
(c) partner of a firm whose accounts are required to be audited or the spouse of such partner if the provisions of Section 5A apply; or
(d) an assessee who is required to furnish a report under Section 92E.

Note: The due date has been extended from July 31, 2025, to September 15, 2025, and subsequently to September 16, 2025.`,
    sections: ["139", "140"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-7",
    financialYear: "2025-26",
    date: "2025-09-16",
    month: "SEP",
    day: "16",
    type: "ITR",
    title: "September 16, 2025 (Tuesday)",
    description: `Furnishing of statement for exercising the option to pay tax at a concessional rate under Section 115BBF for income in the nature of royalty arising from patent developed and registered in India.

The due date has been extended to September 16, 2025.`,
    sections: ["35"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-8",
    financialYear: "2025-26",
    date: "2025-10-31",
    month: "OCT",
    day: "31",
    type: "ITR",
    title: "October 31, 2025 (Friday)",
    description:
      "Exercising the option to opt for alternative tax regime under Section 115BA or Section 115BAA by a domestic company, if due date of submission of return of income is October 31, 2025.",
    sections: ["115BA", "115BAA"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-9",
    financialYear: "2025-26",
    date: "2025-10-31",
    month: "OCT",
    day: "31",
    type: "ITR",
    title: "October 31, 2025 (Friday)",
    description:
      "Exercising the option to opt for alternative tax regime under Section 115BAB(1) by a domestic company, if due date of submission of first return of income is October 31, 2025.",
    sections: ["115BAB"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-10",
    financialYear: "2025-26",
    date: "2025-10-31",
    month: "OCT",
    day: "31",
    type: "ITR",
    title: "October 31, 2025 (Friday)",
    description:
      "Due date for furnishing of annual audited accounts for each approved programme under Section 35(2AA).",
    sections: ["35"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-11",
    financialYear: "2025-26",
    date: "2025-11-30",
    month: "NOV",
    day: "30",
    type: "ITR",
    title: "November 30, 2025 (Sunday)",
    description:
      "Return of income for the Assessment Year 2025-26 in the case of an assessee required to submit a report under Section 92E pertaining to international or specified domestic transactions.",
    sections: ["206C"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-12",
    financialYear: "2025-26",
    date: "2025-12-10",
    month: "DEC",
    day: "10",
    type: "ITR",
    title: "December 10, 2025 (Wednesday)",
    description: `Due date for filing of return of income for the Assessment Year 2025-26 if the assessee, not having any international or specified domestic transaction, is:

(a) corporate assessee;
(b) non-corporate assessee whose books of account are required to be audited; or
(c) partner of a firm whose accounts are required to be audited or the spouse of such partner if the provisions of Section 5A apply.

Note: The due date has been extended from October 31, 2025 to December 10, 2025, vide Circular No. 15/2025, dated 29-10-2025.`,
    sections: ["193", "194C", "194D", "194DA", "194E"],
    portal: "Go to e-Filing Portal",
  },

  {
    id: "2526-itr-13",
    financialYear: "2025-26",
    date: "2025-12-31",
    month: "DEC",
    day: "31",
    type: "ITR",
    title: "December 31, 2025 (Wednesday)",
    description:
      "Filing of belated/revised return of income for the Assessment Year 2025-26 for all assessees, provided assessment has not been completed before December 31, 2025.",
    sections: ["194M", "194-IA", "194-IB", "194S"],
    portal: "Go to TRACES Portal",
  },

  {
    id: "2526-itr-14",
    financialYear: "2025-26",
    date: "2026-03-31",
    month: "MAR",
    day: "31",
    type: "ITR",
    title: "March 31, 2026 (Tuesday)",
    description:
      "Furnishing of an updated return of income for the Assessment Year 2021-22.",
    sections: ["43"],
    portal: "",
  },
];

/*
  Years for which data has not yet been entered.
*/
const getYearData = (year) => taxCalendarData.filter((item) => item.financialYear === year);

const StyledCard = ({ children, sx }) => (
  <Box
    sx={{
      background: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(10px)",
      border: `1px solid ${galaxy.border}`,
      borderRadius: 3,
      boxShadow: "0 0 24px rgba(37, 99, 235, 0.18)",
      p: { xs: 2, sm: 2.5 },
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: "#60a5fa",
        boxShadow: "0 0 32px rgba(37, 99, 235, 0.3)",
      },
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default function Tax_Calendar() {
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [search, setSearch] = useState("");
  const [dueDateType, setDueDateType] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    const yearData = getYearData(financialYear);
    if (yearData.length === 0) return [];

    return yearData.filter((item) => {
      // "All" shows everything; any specific type shows only matching rows.
      const typeMatch = dueDateType === "All" || item.type === dueDateType;

      const searchMatch =
        search.trim() === "" ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.sections.some((section) => section.toLowerCase().includes(search.toLowerCase()));

      const fromDateMatch = fromDate === "" || item.date >= fromDate;
      const toDateMatch = toDate === "" || item.date <= toDate;

      // Once a due date is in the past, drop the row automatically.
      const notPastDue = daysUntil(item.date) >= 0;

      return typeMatch && searchMatch && fromDateMatch && toDateMatch && notPastDue;
    })
      // Soonest due date first, regardless of type (ISO dates sort correctly as text).
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [financialYear, search, dueDateType, fromDate, toDate]);

  // Whenever the filters change the result set, jump back to page 1 so the
  // pager never points past the end of a now-shorter list.
  useEffect(() => {
    setPage(1);
  }, [financialYear, search, dueDateType, fromDate, toDate]);

  const selectedYearHasData = getYearData(financialYear).length > 0;

  const pageCount = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const pagedData = filteredData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleReset = () => {
    setFinancialYear("2026-27");
    setSearch("");
    setDueDateType("All");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      borderRadius: 2.5,
      backgroundColor: "rgba(255, 255, 255, 0.07)",
      backdropFilter: "blur(6px)",
      "& fieldset": { borderColor: galaxy.border },
      "&:hover fieldset": { borderColor: "#60a5fa" },
      "&.Mui-focused fieldset": { borderColor: "#60a5fa", borderWidth: 1 },
    },
    "& .MuiInputLabel-root": { color: galaxy.muted },
    "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
    "& input::placeholder": { color: "rgba(226, 232, 240, 0.6)", opacity: 1 },
    "& .MuiSvgIcon-root": { color: galaxy.muted },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: galaxy.text,
        background:
          "radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%), linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%)",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* ================= HEADER ================= */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg, #bfdbfe 0%, #60a5fa 55%, #67e8f9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Tax Calendar
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: galaxy.muted }}>
          Important tax due dates, filing deadlines and compliance requirements.
        </Typography>
      </Box>

      {/* ================= FILTERS ================= */}
      <StyledCard sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(5, 1fr) auto" },
            gap: 2,
            alignItems: "end",
          }}
        >
          <FormControl size="small" sx={fieldSx}>
            <InputLabel>Financial Year</InputLabel>
            <Select
              label="Financial Year"
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              MenuProps={{ PaperProps: { sx: { bgcolor: "#0f172a", color: "#fff" } } }}
            >
              {financialYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Search"
            placeholder="Search tax compliance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={fieldSx}
          />

          <FormControl size="small" sx={fieldSx}>
            <InputLabel>Due Date Type</InputLabel>
            <Select
              label="Due Date Type"
              value={dueDateType}
              onChange={(e) => setDueDateType(e.target.value)}
              MenuProps={{ PaperProps: { sx: { bgcolor: "#0f172a", color: "#fff" } } }}
            >
              {dueDateTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />

          <TextField
            size="small"
            type="date"
            label="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />

          <Button
            onClick={handleReset}
            variant="outlined"
            size="small"
            sx={{
              height: 40,
              px: 2,
              color: "#dbeafe",
              textTransform: "none",
              borderRadius: 2.5,
              borderColor: galaxy.border,
              backgroundColor: "rgba(255, 255, 255, 0.07)",
              "&:hover": {
                borderColor: "#60a5fa",
                backgroundColor: "rgba(96, 165, 250, 0.18)",
                boxShadow: "0 0 18px rgba(96, 165, 250, 0.4)",
              },
            }}
          >
            Reset
          </Button>
        </Box>
      </StyledCard>

      {/* ================= RESULTS ================= */}
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
          Tax Due Dates \u2014 {financialYear}
        </Typography>
        <Typography variant="body2" sx={{ color: galaxy.muted }}>
          {filteredData.length} record{filteredData.length !== 1 ? "s" : ""} found
        </Typography>
      </Box>

      {/* No data for year */}
      {!selectedYearHasData && (
        <StyledCard sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
            Data will be updated soon
          </Typography>
          <Typography variant="body2" sx={{ color: galaxy.muted }}>
            Tax calendar details for Financial Year <strong>{financialYear}</strong> are currently being updated.
          </Typography>
        </StyledCard>
      )}

      {/* Data exists but filter gives no result */}
      {selectedYearHasData && filteredData.length === 0 && (
        <StyledCard sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
            No records found
          </Typography>
          <Typography variant="body2" sx={{ color: galaxy.muted }}>
            No tax due dates match your selected filters.
          </Typography>
        </StyledCard>
      )}

      {/* Tax Cards */}
      {pagedData.length > 0 && (
        <Stack spacing={2}>
          {pagedData.map((item) => (
            <StyledCard key={item.id}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                {/* Date box */}
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 64,
                    borderRadius: 2.5,
                    textAlign: "center",
                    background: galaxy.headGradient,
                    py: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#dbeafe", letterSpacing: 1 }}>
                    {item.month}
                  </Typography>
                  <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                    {item.day}
                  </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: "wrap" }}>
                    <Chip
                      label={item.type}
                      size="small"
                      sx={{
                        bgcolor: "rgba(37, 99, 235, 0.22)",
                        color: "#bfdbfe",
                        fontWeight: 700,
                        border: `1px solid ${galaxy.border}`,
                      }}
                    />
                    {(() => {
                      // Computed live against today's date, not a fixed
                      // string — this is also what the auto-hide filter
                      // above uses, so a row only ever shows 0 or more.
                      const d = daysUntil(item.date);
                      const label = d === 0 ? "Due today" : `${d} Day${d === 1 ? "" : "s"} to go`;
                      return (
                        <Chip
                          label={label}
                          size="small"
                          sx={{
                            bgcolor: d === 0 ? "rgba(248, 113, 113, 0.22)" : "rgba(248, 113, 113, 0.15)",
                            color: "#fecaca",
                            fontWeight: 600,
                          }}
                        />
                      );
                    })()}
                  </Stack>

                  <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15, mb: 0.5 }}>
                    {item.title}
                  </Typography>

                  {item.revisedDate && (
                    <Typography sx={{ color: "#fbbf24", fontSize: 12, fontWeight: 600, mb: 0.5 }}>
                      {item.revisedDate}
                    </Typography>
                  )}

                  <Typography sx={{ color: galaxy.text, fontSize: 13.5, whiteSpace: "pre-line", mb: item.sections.length ? 1 : 0 }}>
                    {item.description}
                  </Typography>

                  {/* Sections, as chips */}
                  {item.sections && item.sections.length > 0 && (
                    <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                      {item.sections.map((section, index) => (
                        <Chip
                          key={`${item.id}-section-${index}`}
                          label={`Sec. ${section}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "rgba(103, 232, 249, 0.4)",
                            color: galaxy.cyan,
                            fontSize: 11.5,
                            fontWeight: 600,
                            height: 22,
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  {item.circular && (
                    <Chip
                      label={item.circular}
                      size="small"
                      sx={{ ml: 1, mt: 1.5, bgcolor: "rgba(34, 197, 94, 0.14)", color: "#86efac", fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>
            </StyledCard>
          ))}
        </Stack>
      )}

      {/* Pagination \u2014 10 records per page */}
      {filteredData.length > ROWS_PER_PAGE && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: galaxy.text,
                borderColor: galaxy.border,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                background: galaxy.headGradient,
                color: "#fff",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}