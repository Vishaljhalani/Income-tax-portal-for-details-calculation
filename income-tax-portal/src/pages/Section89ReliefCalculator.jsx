import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AY_LIST = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => {
  const y = 2003 + i;
  return `${y}-${String(y + 1).slice(-2)}`;
});

const emptyRow = () => ({
  ageGroup: "below60",
  actualAge: "",
  regime: "",
  gender: "",
  salary: "",
  arrear: "",
  houseProperty: "",
  otherIncome: "",

  // CAPITAL GAINS GROUP (SEPARATE BLOCK)
  capitalGains: {
    ltcg20: "",
    ltcg10: "",
    ltcg125: "",
    stcg15: "",
    stcg20: "",
    stcgApplicable: ""
  },

  eligibleInvestment: "",
  agriIncome: "",
  chapterVI_A: "",
  rebate: ""
});

export default function Section89ReliefCalculator() {

  const handleReset = () => {
  setRows(
    AY_LIST.map((ay) => ({
      ay,
      ...emptyRow()
    }))
  );
};

const handleCalculateArrear = () => {
  const doc = new jsPDF();

  doc.text("Section 89 Year-wise Report", 14, 15);

  const tableData = rows.map((r) => [
    r.ay,
    r.salary || 0,
    r.arrear || 0,
    r.houseProperty || 0,
    r.otherIncome || 0,
    r.rebate || 0
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["AY", "Salary", "Arrear", "HP Income", "Other", "Rebate"]],
    body: tableData
  });

  doc.save("Section89_Report.pdf");
};
  const [rows, setRows] = useState(
    AY_LIST.map((ay) => ({
      ay,
      ...emptyRow()
    }))
  );

  const handleChange = (index, field, value, subField = null) => {
    const copy = [...rows];

    if (subField) {
      copy[index][field][subField] = value;
    } else {
      copy[index][field] = value;
    }

    setRows(copy);
  };

  return (
    <div className="container">

      <h2>Section 89 Relief Calculator</h2>

      <div className="table-wrap">

        <table className="tax-table">

          <thead>
            <tr>
              <th>AY</th>
              <th>Age</th>
              <th>Actual Age</th>
              <th>Regime</th>
              <th>Gender</th>
              <th>Salary Before SD</th>
              <th>Arrear Received</th>
              <th>House Property</th>
              <th>Other Income</th>

              <th>Capital Gains</th>

              <th>Eligible Inv</th>
              <th>Agri</th>
              <th>VI-A</th>
              <th>Rebate 88B/88C</th>
            </tr>
          </thead>

          <tbody>

            {rows.map((row, index) => {
              const ayYear = parseInt(row.ay.split("-")[0]);

              return (
                <tr key={row.ay}>

                  {/* AY */}
                  <td>{row.ay}</td>

                  {/* AGE */}
                  <td>
                    <select
                      value={row.ageGroup}
                      onChange={(e) =>
                        handleChange(index, "ageGroup", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="below60">Below 60</option>
                      <option value="60to79">60–79</option>
                      <option value="80plus">80+</option>
                    </select>
                  </td>
                  
                  <td>
  <input
    value={row.actualAge}
    onChange={(e) =>
      handleChange(index, "actualAge", e.target.value)
    }
    placeholder="Enter Age"
  />
</td>

                  {/* REGIME */}
                  <td>
                    {ayYear >= 2021 ? (
                      <select
                        value={row.regime}
                        onChange={(e) =>
                          handleChange(index, "regime", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="old">Old</option>
                        <option value="new">New</option>
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
  <select
    value={row.gender}
    onChange={(e) =>
      handleChange(index, "gender", e.target.value)
    }
  >
    <option value="">Select</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
</td>

                  <td>
                    <input
                      value={row.salary}
                      onChange={(e) =>
                        handleChange(index, "salary", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={row.arrear}
                      onChange={(e) =>
                        handleChange(index, "arrear", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={row.houseProperty}
                      onChange={(e) =>
                        handleChange(index, "houseProperty", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={row.otherIncome}
                      onChange={(e) =>
                        handleChange(index, "otherIncome", e.target.value)
                      }
                    />
                  </td>

                  {/* ================= CAPITAL GAINS BLOCK ================= */}
                  <td className="cg-block">

                    <div className="cg-title">
                      Capital Gains (Enter values for {row.ay})
                    </div>

                    <div className="cg-grid">

                      <input
                        placeholder="LTCG 20%"
                        value={row.capitalGains.ltcg20}
                        onChange={(e) =>
                          handleChange(index, "capitalGains", e.target.value, "ltcg20")
                        }
                      />

                      <input
                        placeholder="LTCG 10%"
                        value={row.capitalGains.ltcg10}
                        onChange={(e) =>
                          handleChange(index, "capitalGains", e.target.value, "ltcg10")
                        }
                      />

                      <input
                        placeholder="LTCG 12.5%"
                        value={row.capitalGains.ltcg125}
                        onChange={(e) =>
                          handleChange(index, "capitalGains", e.target.value, "ltcg125")
                        }
                      />

                      <input
                        placeholder="STCG 15%"
                        value={row.capitalGains.stcg15}
                        onChange={(e) =>
                          handleChange(index, "capitalGains", e.target.value, "stcg15")
                        }
                      />

                      <input
                        placeholder="STCG 20%"
                        value={row.capitalGains.stcg20}
                        onChange={(e) =>
                          handleChange(index, "capitalGains", e.target.value, "stcg20")
                        }
                      />

                      <input
                        placeholder="STCG Applicable"
                        value={row.capitalGains.stcgApplicable}
                        onChange={(e) =>
                          handleChange(index, "capitalGains", e.target.value, "stcgApplicable")
                        }
                      />

                    </div>

                  </td>

                  {/* ================= OTHER FIELDS ================= */}
                  <td>
                    <input
                      value={row.eligibleInvestment}
                      onChange={(e) =>
                        handleChange(index, "eligibleInvestment", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={row.agriIncome}
                      onChange={(e) =>
                        handleChange(index, "agriIncome", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={row.chapterVI_A}
                      onChange={(e) =>
                        handleChange(index, "chapterVI_A", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={row.rebate}
                      onChange={(e) =>
                        handleChange(index, "rebate", e.target.value)
                      }
                    />
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

</div>

{/* ================= BUTTONS HERE ================= */}
<div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

  <button onClick={handleCalculateArrear}>
    Calculate Arrear (PDF)
  </button>

  <button onClick={handleReset}>
    Reset
  </button>

</div>

<style>{`
.table-wrap {
  width: 100%;
  overflow: hidden;
}

.tax-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 11px;
}

.tax-table th,
.tax-table td {
  border: 1px solid #ddd;
  padding: 3px;
  text-align: center;
  vertical-align: top;
}

.tax-table input,
.tax-table select {
  width: 90px;
  font-size: 11px;
  padding: 2px;
}

.cg-block {
  min-width: 220px;
}

.cg-title {
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 4px;
}

.cg-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3px;
}
        `}</style>
    </div>
  );
}