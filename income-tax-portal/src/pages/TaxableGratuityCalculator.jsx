
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TaxableGratuityCalculator() {
   const navigate = useNavigate();
const ayOptions = [
"2017-18",
"2018-19",
"2019-20",
"2020-21",
"2021-22",
"2022-23",
"2023-24",
"2024-25",
"2025-26",
"2026-27",
];

const [ay, setAy] = useState("2026-27");

const [employerType, setEmployerType] =
useState("other");

const [covered, setCovered] =
useState("no");

const [serviceMode, setServiceMode] =
useState("manual");

const [serviceYears, setServiceYears] =
useState("");

const [joiningDate, setJoiningDate] =
useState("");

const [retirementDate, setRetirementDate] =
useState("");

const [avgSalary, setAvgSalary] =
useState("");

const [gratuityReceived, setGratuityReceived] =
useState("");

const [pieceRate, setPieceRate] =
useState(false);

const [seasonal, setSeasonal] =
useState(false);

const [previousExemption, setPreviousExemption] =
useState("");

const [payableDate, setPayableDate] =
useState("");

const calculatedYears = useMemo(() => {
if (!joiningDate || !retirementDate)
return 0;


const joining = new Date(joiningDate);

const retirement = new Date(
  retirementDate
);

let years =
  retirement.getFullYear() -
  joining.getFullYear();

const monthDiff =
  retirement.getMonth() -
  joining.getMonth();

const dayDiff =
  retirement.getDate() -
  joining.getDate();

if (
  monthDiff < 0 ||
  (monthDiff === 0 && dayDiff < 0)
) {
  years--;
}

return Math.max(0, years);


}, [joiningDate, retirementDate]);

const salaryLabel = useMemo(() => {
  if (covered === "yes") {
    if (pieceRate) {
      return "Average of Last Drawn Three Months Wages (excluding OT)";
    }

    return "Last Drawn Salary";
  }

  return "Average Salary of Last 10 Months";
}, [covered, pieceRate]);
const result = useMemo(() => {
const gratuity = Number(
gratuityReceived || 0
);


const prev = Number(
  previousExemption || 0
);

const salary = Number(avgSalary || 0);

let ceiling = 2000000;

if (ay === "2017-18") {
  ceiling = 1000000;
} else if (ay === "2018-19") {
  if (payableDate) {
    ceiling =
      new Date(payableDate) <
      new Date("2018-03-29")
        ? 1000000
        : 2000000;
  } else {
    ceiling = 1000000;
  }
}

if (
  employerType === "government" ||
  employerType === "localAuthority"
) {
  return {
    exempt: gratuity,
    taxable: 0,
    serviceYearsUsed: 0,
  };
}

const yrs =
  serviceMode === "manual"
    ? Number(serviceYears || 0)
    : calculatedYears;

const remainingLimit = Math.max(
  0,
  ceiling - prev
);

let formulaAmount = 0;

if (covered === "yes") {

  if (seasonal) {

    formulaAmount =
      (7 / 26) * salary * yrs;

  } else if (pieceRate) {

    formulaAmount =
      (15 / 26) * salary * yrs;

  } else {

    formulaAmount =
      (15 / 26) * salary * yrs;

  }

} else {

  formulaAmount =
    0.5 * salary * yrs;

}

const exempt = Math.min(
  gratuity,
  remainingLimit,
  formulaAmount
);

const taxable = Math.max(
  0,
  gratuity - exempt
);

return {
  exempt,
  taxable,
  serviceYearsUsed: yrs,
};


}, [
ay,
employerType,
covered,
serviceMode,
serviceYears,
calculatedYears,
avgSalary,
gratuityReceived,
previousExemption,
payableDate,
pieceRate,
seasonal,
]);

const handleReset = () => {

  setAy("2026-27");

  setEmployerType("other");

  setCovered("no");

  setServiceMode("manual");

  setServiceYears("");

  setJoiningDate("");

  setRetirementDate("");

  setAvgSalary("");

  setGratuityReceived("");

  setPieceRate(false);

  setSeasonal(false);

  setPreviousExemption("");

  setPayableDate("");

};



return (
  <div className="gratuityPage">
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
    
  <div className="calculatorLayout">
  
    {/* LEFT SIDE */}

    <div className="leftSection">

      <div className="calculatorCard">

        <div className="cardTop">

          <h2>
            Taxable Gratuity Calculator
          </h2>

          <p>
            AY 2017-18 to AY 2026-27
          </p>

        </div>

        <div className="cardContent">

          {/* BASIC DETAILS */}

          <div className="formSection">

            <h3>
              Basic Details
            </h3>

            <div className="twoGrid">

              <div>

                <label>
                  Assessment Year
                </label>

                <select
                  value={ay}
                  onChange={(e) =>
                    setAy(
                      e.target.value
                    )
                  }
                >
                  {ayOptions.map((x) => (
                    <option key={x}>
                      {x}
                    </option>
                  ))}
                </select>

                {ay === "2018-19" &&
 !(employerType === "government" ||
   employerType === "localAuthority") && (

                  <div className="topSpace">

                    <label>
                      Gratuity Payable Date
                    </label>

                    <input
                      type="date"
                      value={payableDate}
                      onChange={(e) =>
                        setPayableDate(
                          e.target.value
                        )
                      }
                    />

                  </div>

                )}

              </div>

              <div>

                <label>
                  Employer Type
                </label>

                <select
                  value={employerType}
                  onChange={(e) =>
                    setEmployerType(
                      e.target.value
                    )
                  }
                >
                  <option value="government">
                    Central / State Government
                  </option>

                  <option value="statutory">
                    Statutory Corporation
                  </option>

                  <option value="localAuthority">
                    Local Authority
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

              </div>

            </div>

            {!(employerType ===
              "government" ||
              employerType ===
                "localAuthority") && (

              <div className="topSpace">

                <label>
                  Covered Under Payment of Gratuity Act, 1972?
                </label>

                <div className="buttonFlex">

                  <button
                    className={
                      covered === "yes"
                        ? "activeButton"
                        : "inactiveButton"
                    }
                    onClick={() =>
                      setCovered("yes")
                    }
                  >
                    Yes
                  </button>

                  <button
                    className={
                      covered === "no"
                        ? "activeButton"
                        : "inactiveButton"
                    }
                    onClick={() =>
                      setCovered("no")
                    }
                  >
                    No
                  </button>

                </div>

                {covered === "yes" && (

                  <div className="checkContainer">

                    <label className="checkBoxRow">

                      <input
                        type="checkbox"
                        checked={pieceRate}
                        onChange={(e) => {

                          const checked =
                            e.target.checked;

                          setPieceRate(
                            checked
                          );

                          if (checked) {
                            setSeasonal(
                              false
                            );
                          }

                        }}
                      />

                      <span>
                        Select if wages based on piece rate
                      </span>

                    </label>

                    <label className="checkBoxRow">

                      <input
                        type="checkbox"
                        checked={seasonal}
                        onChange={(e) => {

                          const checked =
                            e.target.checked;

                          setSeasonal(
                            checked
                          );

                          if (checked) {
                            setPieceRate(
                              false
                            );
                          }

                        }}
                      />

                      <span>
                        Is seasonal establishment?
                      </span>

                    </label>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* SERVICE DETAILS */}

          {!(employerType ===
            "government" ||
            employerType ===
              "localAuthority") && (

            <div className="formSection">

              <h3>
                Service Period Details
              </h3>

              <div className="buttonFlex">

                <button
                  className={
                    serviceMode ===
                    "manual"
                      ? "activeButton"
                      : "inactiveButton"
                  }
                  onClick={() =>
                    setServiceMode(
                      "manual"
                    )
                  }
                >
                  Manual Entry
                </button>

                <button
                  className={
                    serviceMode ===
                    "date"
                      ? "activeButton"
                      : "inactiveButton"
                  }
                  onClick={() =>
                    setServiceMode(
                      "date"
                    )
                  }
                >
                  Date Based
                </button>

              </div>

              {serviceMode ===
              "manual" ? (

                <div className="topSpace">

                  <label>
                    Completed Service Years
                  </label>

                  <input
                    type="number"
                    value={serviceYears}
                    onChange={(e) =>
                      setServiceYears(
                        e.target.value
                      )
                    }
                    placeholder="Enter completed years"
                  />

                </div>

              ) : (

                <div className="twoGrid topSpace">

                  <div>

                    <label>
                      Date of Joining
                    </label>

                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) =>
                        setJoiningDate(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div>

                    <label>
                      Date of Retirement / Resignation
                    </label>

                    <input
                      type="date"
                      value={retirementDate}
                      onChange={(e) =>
                        setRetirementDate(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="yearBox">

                    <span>
                      Service Years
                    </span>

                    <h2>
                      {calculatedYears}
                    </h2>

                  </div>

                </div>

              )}

            </div>

          )}

          {/* GRATUITY DETAILS */}

          <div className="formSection">

            <h3>
              Salary & Gratuity Details
            </h3>

            <div className="twoGrid">

              {!(employerType ===
                "government" ||
                employerType ===
                  "localAuthority") && (

                <>

                  <div>

                    <label>
                      {salaryLabel}
                    </label>

                    <input
                      type="number"
                      value={avgSalary}
                      onChange={(e) =>
                        setAvgSalary(
                          e.target.value
                        )
                      }
                      placeholder="Enter salary"
                    />

                  </div>

                  <div>

                    <label>
                      Previous Exempt Gratuity Claimed
                    </label>

                    <input
                      type="number"
                      value={previousExemption}
                      onChange={(e) =>
                        setPreviousExemption(
                          e.target.value
                        )
                      }
                      placeholder="Enter amount"
                    />

                  </div>

                </>

              )}

              <div>

                <label>
                  Gratuity Received
                </label>

                <input
                  type="number"
                  value={gratuityReceived}
                  onChange={(e) =>
                    setGratuityReceived(
                      e.target.value
                    )
                  }
                  placeholder="Enter gratuity"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}

    <div className="rightSection">

      <div className="resultCard">

        <div className="resultTitle">
          Result Summary
        </div>

        <div className="resultContent">

          <div className="resultItem">

            <p>
              Service Years Used
            </p>

            <h2>
              {result.serviceYearsUsed}
            </h2>

          </div>

          <div className="resultItem">

            <p>
              Exempt Gratuity
            </p>

            <h2>
              ₹{" "}
              {result.exempt.toLocaleString(
                "en-IN"
              )}
            </h2>

          </div>

          <div className="resultItem">

            <p>
              Taxable Gratuity
            </p>

            <h2>
              ₹{" "}
              {result.taxable.toLocaleString(
                "en-IN"
              )}
            </h2>

          </div>

          {!(employerType ===
            "government" ||
            employerType ===
              "localAuthority") && (

            <div className="resultItem">

              <p>
                Formula Used
              </p>

              <h2
  style={{
    fontSize: "22px",
    lineHeight: "36px",
  }}
>
  {covered === "yes" ? (
    seasonal ? (
      "7/26 × Last Drawn Salary × Service Years"
    ) : (
      `15/26 × ${
        pieceRate
          ? "Average of Last Drawn Three Months Wages"
          : "Last Drawn Salary"
      } × Service Years`
    )
  ) : (
    "1/2 × Average Salary of Last 10 Months × Service Years"
  )}
</h2>

            </div>

          )}

          <div className="buttonFlex topSpace">

  

  <button
    className="inactiveButton"
    onClick={handleReset}
  >
    Reset
  </button>

</div>

        </div>

      </div>

    </div>

  </div>

  <style>{`


.gratuityPage{
min-height:100vh;
background:#03152f;
padding:30px;
font-family:Arial, Helvetica, sans-serif;
color:white;
}

.calculatorLayout{
display:grid;
grid-template-columns:2fr 1fr;
gap:25px;
max-width:1400px;
margin:auto;
}

.calculatorCard,
.resultCard{
background:#071c3a;
border:1px solid #15427e;
border-radius:20px;
overflow:hidden;
}

.cardTop{
padding:25px;
border-bottom:1px solid #15427e;
}

.cardTop h2{
margin:0;
font-size:34px;
}

.cardTop p{
margin-top:8px;
color:#98b8e4;
}

.cardContent{
padding:25px;
}

.formSection{
margin-bottom:40px;
}

.formSection h3{
margin-bottom:20px;
color:#59a4ff;
font-size:24px;
}

.twoGrid{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px;
}

label{
display:block;
margin-bottom:10px;
font-size:14px;
font-weight:600;
}

input,
select{
width:100%;
padding:14px;
border-radius:12px;
border:1px solid #15427e;
background:#0c2b57;
color:white;
font-size:15px;
}

.buttonFlex{
display:flex;
gap:15px;
flex-wrap:wrap;
}

.activeButton{
background:#1b76ff;
border:none;
color:white;
padding:14px 28px;
border-radius:12px;
font-weight:bold;
cursor:pointer;
}

.inactiveButton{
background:#0c2b57;
border:1px solid #15427e;
color:white;
padding:14px 28px;
border-radius:12px;
font-weight:bold;
cursor:pointer;
}

.topSpace{
margin-top:20px;
}

.yearBox{
background:#0c2b57;
border:1px solid #15427e;
border-radius:15px;
padding:20px;
}

.yearBox span{
color:#98b8e4;
}

.yearBox h2{
margin-top:10px;
font-size:38px;
}

.resultTitle{
padding:25px;
border-bottom:1px solid #15427e;
font-size:30px;
font-weight:bold;
}

.resultContent{
padding:20px;
}

.resultItem{
background:#0c2b57;
border:1px solid #15427e;
border-radius:15px;
padding:20px;
margin-bottom:20px;
}

.resultItem p{
color:#98b8e4;
margin-bottom:10px;
}

.resultItem h2{
font-size:34px;
margin:0;
}

.checkContainer{
margin-top:25px;
display:flex;
flex-direction:column;
gap:18px;
}

.checkBoxRow{
display:flex;
align-items:center;
gap:12px;
background:#0c2b57;
border:1px solid #15427e;
padding:16px;
border-radius:14px;
cursor:pointer;
}

.checkBoxRow input{
width:18px;
height:18px;
accent-color:#1b76ff;
}

.checkBoxRow span{
color:white;
font-size:15px;
}

@media(max-width:900px){

.calculatorLayout{
grid-template-columns:1fr;
}

.twoGrid{
grid-template-columns:1fr;
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
