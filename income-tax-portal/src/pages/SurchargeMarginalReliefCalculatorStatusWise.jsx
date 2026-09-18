import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  {
    value: "individual",
    label: "Individual / HUF / AOP / BOI / Artificial Juridical Person",
    shortLabel: "Individual / HUF / AOP / BOI / AJP",
  },
  {
    value: "aop_company_members",
    label: "AOP consisting only companies as members",
    shortLabel: "AOP – Companies as Members",
  },
  {
    value: "firm_llp_local_authority",
    label: "Firm / LLP / Local Authority",
    shortLabel: "Firm / LLP / Local Authority",
  },
  {
    value: "company",
    label: "Domestic Company and Foreign Company",
    shortLabel: "Domestic / Foreign Company",
  },
  {
    value: "cooperative_society",
    label: "Co-operative Society",
    shortLabel: "Co-operative Society",
  },
];

export default function SurchargeMarginalReliefCalculatorStatusWise() {
   const navigate = useNavigate();
 const [selectedStatusWise, setSelectedStatusWise] = useState("");
const selectedStatus = selectedStatusWise;

  const selectedStatusDetails = STATUS_OPTIONS.find(
    (item) => item.value === selectedStatus
  );

  const handleReset = () => {
    setSelectedStatus("");
  };

  return (
    <div className="status-wise-mr-page">

      
      {/* =========================================================
    STATUS-WISE MARGINAL RELIEF - NEW STATUS SELECTOR UI
    ========================================================= */}

<div
  style={{
    width: "100%",
    maxWidth: "1300px",
    padding: "10px",
    background: "linear-gradient(135deg, rgb(16, 26, 49), rgb(19, 43, 80))"
  }}
>
  {/* PAGE HEADER */}
  <div
    style={{
      background: "linear-gradient(135deg, #101a31, #132b50)",
      
      borderRadius: "22px",
      padding: "30px",
      marginBottom: "24px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div>
        <span
          style={{
            display: "inline-block",
            background: "#174477",
            color: "#8ec5ff",
            padding: "6px 12px",
            borderRadius: "7px",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "1px",
            marginBottom: "10px",
          }}
        >
          CALCULATOR
        </span>

        <h1
  style={{
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: "1.2",
  }}
>
  Surcharge & Marginal Relief Calculator
</h1>

        <p
  style={{
    margin: "10px 0 0",
    color: "#b8c7dc",
    fontSize: "14px",
    lineHeight: "1.6",
  }}
>
  Calculate surcharge and marginal relief based on taxpayer
  status, income and applicable tax rules.
</p>
      </div>

      <div
        style={{
          minWidth: "180px",
          padding: "20px",
          borderRadius: "16px",
          background: "rgba(21,55,101,0.55)",
          border: "1px solid rgba(72,143,255,0.35)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "block",
            color: "#a9c2e6",
            fontSize: "11px",
            fontWeight: "700",
          }}
        >
          INCOME TAX
        </span>

        <strong
  style={{
    display: "block",
    marginTop: "6px",
    fontSize: "17px",
    color: "#ffffff",
  }}
>
  Marginal Relief
</strong>
      </div>
    </div>
  </div>


  {/* MAIN CONTENT */}
  <div
  style={{
    width: "100%",
  }}
>

    {/* LEFT CARD */}
    <div
      style={{
        background: "#10182b",
        border: "1px solid rgba(148,163,184,0.15)",
        borderRadius: "22px",
        overflow: "hidden",
      }}
    >

      {/* STATUS SECTION */}
      <div
        style={{
          padding: "30px",
          borderBottom: "1px solid rgba(148,163,184,0.12)",
        }}
      >

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            marginBottom: "22px",
          }}
        >
          <span
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "#1e5aa7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
            }}
          >
            1
          </span>

          <div>
           <h2
  style={{
    margin: 0,
    fontSize: "21px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: "1.3",
  }}
>
  Select Status
</h2>

            <p
  style={{
    margin: "6px 0 0",
    color: "#9fb0ca",
    fontSize: "13px",
    lineHeight: "1.5",
  }}
>
  Select the taxpayer status for marginal relief calculation.
</p>
          </div>
        </div>


        {/* STATUS OPTIONS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >

         <button
  type="button"
  onClick={() => navigate("/SurchargeMarginalReliefCalculator/individual")}
  style={{
  padding: "14px 18px",
  minHeight: "50px",
  borderRadius: "12px",
  border:
    selectedStatusWise === "individual"
      ? "1px solid #3b82f6"
      : "1px solid #334765",
  background:
    selectedStatusWise === "individual"
      ? "linear-gradient(135deg, #174477, #1e5aa7)"
      : "#0c162a",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
  transition: "all 0.2s ease",
  boxShadow:
    selectedStatusWise === "individual"
      ? "0 6px 18px rgba(30,90,167,0.25)"
      : "none",
}}
>
  Individual / HUF / AOP / BOI / AJP
</button>


         <button
  type="button"
  onClick={() => navigate("/SurchargeMarginalReliefCalculator/aop-company")}
   style={{
  padding: "14px 18px",
  minHeight: "50px",
  borderRadius: "12px",
  border:
    selectedStatusWise === "aop_company"
      ? "1px solid #3b82f6"
      : "1px solid #334765",
  background:
    selectedStatusWise === "aop_company"
      ? "linear-gradient(135deg, #174477, #1e5aa7)"
      : "#0c162a",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
  transition: "all 0.2s ease",
  boxShadow:
    selectedStatusWise === "aop_company"
      ? "0 6px 18px rgba(30,90,167,0.25)"
      : "none",
}}
>
  AOP – Share indeterminate or unknown
</button>


          <button
  type="button"
  onClick={() => navigate("/SurchargeMarginalReliefCalculator/firm-llp-local")}
  style={{
  padding: "14px 18px",
  minHeight: "50px",
  borderRadius: "12px",
  border:
    selectedStatusWise === "firm_llp_local"
      ? "1px solid #3b82f6"
      : "1px solid #334765",
  background:
    selectedStatusWise === "firm_llp_local"
      ? "linear-gradient(135deg, #174477, #1e5aa7)"
      : "#0c162a",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
  transition: "all 0.2s ease",
  boxShadow:
    selectedStatusWise === "firm_llp_local"
      ? "0 6px 18px rgba(30,90,167,0.25)"
      : "none",
}}
>
  Firm / LLP / Local Authority
</button>


          <button
  type="button"
  onClick={() =>  navigate("/SurchargeMarginalReliefCalculator/company")}
  style={{
  padding: "14px 18px",
  minHeight: "50px",
  borderRadius: "12px",
  border:
    selectedStatusWise === "company"
      ? "1px solid #3b82f6"
      : "1px solid #334765",
  background:
    selectedStatusWise === "company"
      ? "linear-gradient(135deg, #174477, #1e5aa7)"
      : "#0c162a",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
  transition: "all 0.2s ease",
  boxShadow:
    selectedStatusWise === "company"
      ? "0 6px 18px rgba(30,90,167,0.25)"
      : "none",
}}
>
  Domestic / Foreign Company
</button>


          <button
  type="button"
  onClick={() => navigate("/SurchargeMarginalReliefCalculator/cooperative")}
  style={{
  padding: "14px 18px",
  minHeight: "50px",
  borderRadius: "12px",
  border:
    selectedStatusWise === "cooperative"
      ? "1px solid #3b82f6"
      : "1px solid #334765",
  background:
    selectedStatusWise === "cooperative"
      ? "linear-gradient(135deg, #174477, #1e5aa7)"
      : "#0c162a",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
  transition: "all 0.2s ease",
  boxShadow:
    selectedStatusWise === "cooperative"
      ? "0 6px 18px rgba(30,90,167,0.25)"
      : "none",
}}
>
  Co-operative Society
</button>
{selectedStatusWise && (
  <div
    style={{
      marginTop: "24px",
      borderRadius: "18px",
      border: "1px solid rgba(59,130,246,0.25)",
      background: "#0d172b",
      overflow: "hidden",
    }}
  >
    {/* ACTIVE STATUS HEADER */}
    <div
      style={{
        padding: "22px 26px",
        background: "linear-gradient(135deg, #122746, #10203a)",
        borderBottom: "1px solid rgba(148,163,184,0.15)",
      }}
    >
      <div
        style={{
          color: "#6fb1ff",
          fontSize: "11px",
          fontWeight: "800",
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "7px",
        }}
      >
        Selected Status
      </div>

      <h2
        style={{
          margin: 0,
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: "800",
          lineHeight: "1.3",
        }}
      >
        {selectedStatusWise === "individual" &&
          "Individual / HUF / AOP / BOI / Artificial Juridical Person"}

        {selectedStatusWise === "aop_company" &&
          "AOP consisting only Companies as Members"}

        {selectedStatusWise === "firm_llp_local" &&
          "Firm / LLP / Local Authority"}

        {selectedStatusWise === "company" &&
          "Domestic Company / Foreign Company"}

        {selectedStatusWise === "cooperative" &&
          "Co-operative Society"}
      </h2>
    </div>

    {/* CONTENT */}
    <div
      style={{
        padding: "28px",
        color: "#ffffff",
      }}
    >
      {selectedStatusWise === "individual" && (
        <>
          <h3
            style={{
              margin: "0 0 8px",
              color: "#ffffff",
              fontSize: "19px",
            }}
          >
            Individual / HUF / AOP / BOI / AJP
          </h3>

          <p
            style={{
              margin: 0,
              color: "#9fb0ca",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            Individual status ke applicable inputs aur marginal relief
            calculation yahan open hoga.
          </p>
        </>
      )}

      {selectedStatusWise === "aop_company" && (
        <>
          <h3
            style={{
              margin: "0 0 8px",
              color: "#ffffff",
              fontSize: "19px",
            }}
          >
            AOP – Companies as Members
          </h3>

          <p style={{ margin: 0, color: "#9fb0ca" }}>
            AOP consisting only companies as members ke inputs yahan
            open honge.
          </p>
        </>
      )}

      {selectedStatusWise === "firm_llp_local" && (
        <>
          <h3
            style={{
              margin: "0 0 8px",
              color: "#ffffff",
              fontSize: "19px",
            }}
          >
            Firm / LLP / Local Authority
          </h3>

          <p style={{ margin: 0, color: "#9fb0ca" }}>
            Firm / LLP / Local Authority ke inputs yahan open honge.
          </p>
        </>
      )}

      {selectedStatusWise === "company" && (
        <>
          <h3
            style={{
              margin: "0 0 8px",
              color: "#ffffff",
              fontSize: "19px",
            }}
          >
            Domestic / Foreign Company
          </h3>

          <p style={{ margin: 0, color: "#9fb0ca" }}>
            Domestic aur Foreign Company ke inputs yahan open honge.
          </p>
        </>
      )}

      {selectedStatusWise === "cooperative" && (
        <>
          <h3
            style={{
              margin: "0 0 8px",
              color: "#ffffff",
              fontSize: "19px",
            }}
          >
            Co-operative Society
          </h3>

          <p style={{ margin: 0, color: "#9fb0ca" }}>
            Co-operative Society ke inputs yahan open honge.
          </p>
        </>
      )}
    </div>
  </div>
)}
        </div>

      </div>


    
      </div>

    </div>

  </div>

</div>


  );
}