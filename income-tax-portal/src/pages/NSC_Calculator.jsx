import React, { useState } from "react";

const interestData = {
  "2026-27": {
    "VIII Issue": [
      { period: "1 Apr 2020 to 31 Mar 2021", rate: 8.85 },
      { period: "1 Apr 2021 to 31 Mar 2022", rate: 8.28 },
      { period: "1 Apr 2022 to 31 Mar 2023", rate: 7.76 },
      { period: "1 Apr 2023 to 31 Mar 2024", rate: 8.01 },
      { period: "1 Apr 2024 to 31 Mar 2025", rate: 8.29 },
      { period: "1 Apr 2025 to 31 Mar 2026", rate: 7.7 },
      { period: "1 Apr 2026 to 31 Mar 2027", rate: 0 },
    ],
    "IX Issue": [{ period: "1 Apr 2015 to 20 Dec 2015", rate: 19.52 }],
  },

  "2025-26": {
    "VIII Issue": [
      { period: "1 Apr 2019 to 30 Jun 2019", rate: 10.88 },
      { period: "1 Jul 2019 to 31 Mar 2020", rate: 10.71 },
      { period: "1 Apr 2020 to 31 Mar 2021", rate: 8.28 },
      { period: "1 Apr 2021 to 31 Mar 2022", rate: 7.76 },
      { period: "1 Apr 2022 to 31 Dec 2022", rate: 7.26 },
      { period: "1 Jan 2023 to 31 Mar 2023", rate: 7.49 },
      { period: "1 Apr 2023 to 31 Mar 2024", rate: 7.70 },
      { period: "1 Apr 2024 to 31 Mar 2025", rate: 0 },
    ],
    "IX Issue": [
      { period: "1 Apr 2014 to 31 Mar 2015", rate: 19.52 },
      { period: "1 Apr 2015 to 20 Dec 2015", rate: 17.91 },
    ],
  },

  "2024-25": {
    "VIII Issue": [
      { period: "1 Apr 2018 to 30 Sep 2018", rate: 10.19 },
      { period: "1 Oct 2018 to 31 Mar 2019", rate: 10.88 },
      { period: "1 Apr 2019 to 30 Jun 2019", rate: 10.08 },
      { period: "1 Jun 2019 to 31 Mar 2020", rate: 9.92 },
      { period: "1 Apr 2020 to 31 Mar 2021", rate: 7.76 },
      { period: "1 Apr 2021 to 31 Mar 2022", rate: 7.26 },
      { period: "1 Apr 2022 to 31 Dec 2022", rate: 6.8 },
      { period: "1 Jan 2023 to 31 Mar 2023", rate: 7 },
      { period: "1 Apr 2023 to 31 Mar 2024", rate: "" },
    ],
    "IX Issue": [
      { period: "1 Apr 2013 to 31 Mar 2014", rate: 19.52 },
      { period: "1 Apr 2014 to 31 Mar 2015", rate: 17.91 },
      { period: "1 Apr 2015 to 20 Dec 2015", rate: 16.43 },
    ],
  },
};

const assessmentYears = [
  "2026-27",
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
  "2018-19",
  "2017-18",
];

const emptyRow = {
  nscType: "",
  period: "",
  amount: "",
  interest: "",
};

export default function NSCCalculator() {
  const [assessmentYear, setAssessmentYear] = useState("");
  const [rows, setRows] = useState([{ ...emptyRow }]);

  const isComingSoon =
    assessmentYear &&
    !["2026-27", "2025-26", "2024-25"].includes(assessmentYear);

  const calculateInterest = (ay, type, period, amount) => {
  const investmentAmount = Number(amount);

  if (!ay || !type || !period || !investmentAmount) {
    return "";
  }

  const selectedPeriod = interestData?.[ay]?.[type]?.find(
    (item) => item.period === period
  );

  if (!selectedPeriod) {
    return "";
  }

  const rate = Number(selectedPeriod.rate);

  if (selectedPeriod.rate === "" || isNaN(rate)) {
    return "";
  }

  const interest = (investmentAmount * rate) / 100;

  return interest.toFixed(2);
};

const handleAssessmentYearChange = (value) => {
  setAssessmentYear(value);
  setRows([{ ...emptyRow }]);
};

const handleRowChange = (index, field, value) => {
  const updatedRows = rows.map((row, i) => {
    if (i !== index) return row;

    const updatedRow = {
      ...row,
      [field]: value,
    };

    if (field === "nscType") {
      updatedRow.period = "";
      updatedRow.interest = "";
      return updatedRow;
    }

    updatedRow.interest = calculateInterest(
      assessmentYear,
      updatedRow.nscType,
      updatedRow.period,
      updatedRow.amount
    );

    return updatedRow;
  });

  setRows(updatedRows);
};
  const addMoreRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const resetCalculator = () => {
    setAssessmentYear("");
    setRows([{ ...emptyRow }]);
  };

  const totalInvestment = rows.reduce(
    (total, row) => total + Number(row.amount || 0),
    0
  );

  const totalInterest = rows.reduce(
    (total, row) => total + Number(row.interest || 0),
    0
  );

  return (
    <div className="nsc-page">
      <div className="nsc-container">
        <div className="nsc-left-card">
          <h2 className="nsc-title">NSC Calculator</h2>

          <div className="form-row">
            <label>
              Assessment Year <span>*</span>
            </label>
            <select
              value={assessmentYear}
              onChange={(e) => handleAssessmentYearChange(e.target.value)}
            >
              <option value="">Select Assessment Year</option>
              {assessmentYears.map((ay) => (
                <option key={ay} value={ay}>
                  AY {ay}
                </option>
              ))}
            </select>
          </div>

          {isComingSoon ? (
            <div className="coming-soon">Coming Soon...</div>
          ) : (
            <>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>S. No</th>
                      <th>
                        NSC Type <span>*</span>
                      </th>
                      <th>
                        Period <span>*</span>
                      </th>
                      <th>
                        Amount of Investment <span>*</span>
                      </th>
                      <th>
                        Interest <span>*</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        <td>
                          <select
                            value={row.nscType}
                            onChange={(e) =>
                              handleRowChange(index, "nscType", e.target.value)
                            }
                            disabled={!assessmentYear}
                          >
                            <option value="">Select</option>
                            <option value="VIII Issue">VIII Issue</option>
                            <option value="IX Issue">IX Issue</option>
                          </select>
                        </td>

                        <td>
                          <select
                            value={row.period}
                            onChange={(e) =>
                              handleRowChange(index, "period", e.target.value)
                            }
                            disabled={!assessmentYear || !row.nscType}
                          >
                            <option value="">Select Period</option>
                            {interestData?.[assessmentYear]?.[row.nscType]?.map(
                              (item) => (
                                <option key={item.period} value={item.period}>
                                  {item.period}
                                </option>
                              )
                            )}
                          </select>
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.amount}
                            placeholder="Enter Amount"
                            onChange={(e) =>
                              handleRowChange(index, "amount", e.target.value)
                            }
                            disabled={!assessmentYear}
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.interest}
                            placeholder="0.00"
                            readOnly
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="button-row">
                <button className="add-btn" onClick={addMoreRow}>
                  Add More
                </button>

                <button className="reset-btn" onClick={resetCalculator}>
                  Reset
                </button>
              </div>
            </>
          )}
        </div>

        <div className="nsc-right-card">
          <h3>Result</h3>

          <div className="result-box">
            <p>Total Investment</p>
            <h4>₹ {totalInvestment.toFixed(2)}</h4>
          </div>

          <div className="result-box">
            <p>Total Interest</p>
            <h4>₹ {totalInterest.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      <style>{`
        .nsc-page {
          min-height: 100vh;
          background: #07111f;
          padding: 30px;
          color: #ffffff;
          font-family: Arial, sans-serif;
        }

        .nsc-container {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 25px;
          max-width: 1300px;
          margin: auto;
        }

        .nsc-left-card,
        .nsc-right-card {
          background: #0d1b2f;
          border: 1px solid #1c6dd0;
          border-radius: 8px;
          padding: 22px;
          box-shadow: 0 0 15px rgba(28, 109, 208, 0.25);
        }

        .nsc-title {
          margin-bottom: 25px;
          font-size: 26px;
          color: #ffffff;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          max-width: 320px;
          margin-bottom: 25px;
        }

        label {
          margin-bottom: 8px;
          font-size: 15px;
          color: #dce8ff;
        }

        span {
          color: red;
        }

        select,
        input {
          width: 100%;
          height: 38px;
          background: #10243d;
          color: #ffffff;
          border: 1px solid #2d75c7;
          border-radius: 4px;
          padding: 0 10px;
          outline: none;
        }

        select:focus,
        input:focus {
          border-color: #4aa3ff;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th {
          background: #12355b;
          color: #ffffff;
          padding: 12px;
          font-size: 14px;
          border: 1px solid #2d75c7;
          text-align: left;
        }

        td {
          padding: 10px;
          border: 1px solid #2d75c7;
          background: #0f2239;
        }

        td:first-child {
          text-align: center;
          font-weight: bold;
        }

        .button-row {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .add-btn,
        .reset-btn {
          border: none;
          padding: 10px 22px;
          border-radius: 4px;
          color: #ffffff;
          cursor: pointer;
          font-size: 15px;
        }

        .add-btn {
          background: #1c6dd0;
        }

        .reset-btn {
          background: #d0342c;
        }

        .add-btn:hover {
          background: #1558aa;
        }

        .reset-btn:hover {
          background: #a92a24;
        }

        .nsc-right-card h3 {
          margin-bottom: 20px;
          font-size: 22px;
          border-bottom: 1px solid #2d75c7;
          padding-bottom: 12px;
        }

        .result-box {
          background: #10243d;
          border: 1px solid #2d75c7;
          border-radius: 6px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .result-box p {
          margin: 0 0 10px;
          color: #dce8ff;
          font-size: 15px;
        }

        .result-box h4 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
        }

        .coming-soon {
          background: #10243d;
          border: 1px solid #2d75c7;
          padding: 30px;
          border-radius: 6px;
          font-size: 24px;
          text-align: center;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .nsc-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}