import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AOP_Tax_Treatment_Situations() {
  const navigate = useNavigate();

  const [higherRate, setHigherRate] = useState("25");

  return (
    <>
      <style>{`

        /* =====================================================
           AOP TAX TREATMENT – PAGE
           ===================================================== */

        .aop-page {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #071529 0%,
            #0b1c35 55%,
            #123867 100%
          );
        }

        .aop-container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .aop-container1 {
          margin: 0 auto;
          background: white;
        }

        .hii {
          margin-left: 50px;
        }

        /* =====================================================
           BREADCRUMB
           ===================================================== */

        .aop-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 18px 0;
          font-size: 12px;
          color: #66758a;
        }

        .aop-breadcrumb button {
          border: none;
          background: transparent;
          padding: 0;
          color: #315d91;
          font-size: 12px;
          cursor: pointer;
        }

        .aop-breadcrumb button:hover {
          color: #1d70c9;
          text-decoration: underline;
        }

        /* =====================================================
           BACK BUTTON – TOP LEFT
           ===================================================== */

        /* =====================================================
   BACK BUTTON – TOP LEFT
   ===================================================== */

.aop-top-back {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 16px 0 0;
  background: transparent;
  margin-bottom: 15px;
}

.aop-back-button {
  border: 1px solid #315d91;
  border-radius: 8px;

  padding: 9px 16px;

  font-size: 11px;
  font-weight: 800;

  cursor: pointer;

  background: transparent;
  color: #83c8f1;

  transition: all 0.2s ease;
}

.aop-back-button:hover {
  background: rgba(131, 200, 241, 0.10);
  border-color: #4d9bd4;
  color: #ffffff;
}

        /* =====================================================
           HERO
           ===================================================== */

        .aop-hero {
  background:
    linear-gradient(
      135deg,
      #071529 0%,
      #0b1c35 55%,
      #123867 100%
    );

  padding: 22px 0 24px;

  border-top: 1px solid #20324d;
  border-bottom: 1px solid #20324d;
}


        .aop-hero-badge {
  display: inline-block;

  padding: 4px 9px;
  margin-bottom: 8px;

  border-radius: 16px;

  background: rgba(131, 200, 241, 0.10);
  border: 1px solid rgba(131, 200, 241, 0.28);

  color: #83c8f1;

  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.7px;
}

        .aop-hero h1 {
          margin: 0;

          color: #ffffff;

          font-size: 28px;
          line-height: 1.3;
          font-weight: 900;
        }

        .aop-hero p {
  max-width: 760px;

  margin: 5px 0 0;

  color: #aebed2;

  font-size: 14px;
  line-height: 1.5;
}


        /* =====================================================
           CONTENT
           ===================================================== */

        .aop-content {
          padding: 28px 0 50px;
        }

        /* =====================================================
           MAIN INFORMATION CARD
           ===================================================== */

        .smr-info-card {
          border: 1px solid #293d5b;
          border-radius: 20px;

          background: #0a1628;

          padding: 18px;
          margin-top: 0;

          box-shadow:
            0 12px 30px rgba(7, 21, 41, 0.12);
        }

        .smr-info-card h3 {
          margin: 0 0 10px;

          color: #83c8f1;

          font-size: 14px;
          font-weight: 900;

          text-align: center;
        }

        .smr-info-card p {
          margin: 0;

          color: #aab6c7;

          font-size: 12px;
          line-height: 1.7;

          text-align: center;
        }

        /* =====================================================
           TABLE
           ===================================================== */

        .aop-table {
          width: 100%;

          border: 1px solid #293d5b;
          border-radius: 10px;

          overflow: hidden;

          background: #0b172a;

          font-size: 13px;

          margin: 0 auto;
        }

        /* =====================================================
           TABLE HEADER
           ===================================================== */

        .aop-table-header {
          display: grid;

          grid-template-columns: 1.25fr 0.75fr;

          background: #102038;

          border-bottom: 1px solid #293d5b;

          text-align: center;
        }

        .aop-table-header > div {
          padding: 11px 12px;

          color: #83c8f1;

          font-weight: 900;

          font-size: 13px;

          text-align: center;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .aop-table-header > div:nth-child(2) {
          border-left: 1px solid #293d5b;
        }

        /* =====================================================
           TABLE ROW
           ===================================================== */

        .aop-table-row {
          display: grid;

          grid-template-columns: 1.25fr 0.75fr;

          border-bottom: 1px solid #20324d;
        }

        .aop-table-row:last-child {
          border-bottom: none;
        }

        /* =====================================================
           SITUATION COLUMN
           ===================================================== */
.aop-situation-cell {
  padding: 12px;

  color: #dce7f5;

  line-height: 1.55;

  text-align: center;

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  gap: 6px;

  white-space: nowrap;

  font-size: 13px;

  font-weight: 900;
}

.aop-situation-cell strong {
  color: #ffffff;

  font-size: 13px;

  font-weight: 900;

  white-space: nowrap;
}

.aop-situation-cell span {
  font-size: 13px;

  color: #dce7f5;

  font-weight: 900;

  white-space: nowrap;
}

        /* =====================================================
           TAX CELL
           ===================================================== */
.aop-tax-cell {
  padding: 12px;

  color: #dce7f5;

  font-size: 13px;

  font-weight: 900;

  line-height: 1.55;

  border-left: 1px solid #20324d;

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  gap: 8px;

  text-align: center;

  white-space: nowrap;
}


        /* =====================================================
           TAX CELL ALL CONTENT
           ===================================================== */

       .aop-tax-cell div {
  font-size: 13px;
  font-weight: 900;

  white-space: nowrap;
}

/* =====================================================
   THIRD ROW – AOP TAX CONTENT
   ===================================================== */

.aop-table-row:nth-child(4) .aop-tax-cell {
  flex-wrap: wrap;
  white-space: normal;
  text-align: center;
  justify-content: center;
  align-items: center;
  row-gap: 2px;
}

.aop-table-row:nth-child(4) .aop-tax-cell div {
  white-space: nowrap;
}


.aop-last-row .aop-tax-cell {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}

.aop-last-row .aop-rate-note {
  flex-basis: 100%;
  white-space: normal;
}


        /* =====================================================
           ARROW
           ===================================================== */

        .aop-arrow {
          color: #83c8f1;

          font-weight: 900;

          font-size: 15px;
        }

        /* =====================================================
           ENTIRE INCOME
           ===================================================== */

        .aop-entire-income {
          color: #ffffff;

          font-size: 13px;

          font-weight: 900;

          text-align: center;
        }

        .aop-last-row {
          background: rgba(131, 200, 241, 0.025);
        }

        /* =====================================================
           RATE NOTE
           ===================================================== */

        .aop-rate-note {
          margin-top: 8px;

          color: #91a4ba;

          font-size: 12px;

          line-height: 1.5;

          font-weight: 900;

          text-align: center;

          max-width: 330px;
        }

        /* =====================================================
           RATE SELECTOR
           ===================================================== */

        .aop-rate-selector {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          margin-top: 12px;

          padding: 10px;

          background: #101f35;

          border: 1px solid #293d5b;
          border-radius: 8px;
        }

        .aop-rate-selector label {
          color: #aebed2;

          font-size: 11px;
          font-weight: 900;
        }

        .aop-rate-selector select {
          min-width: 90px;

          padding: 7px 10px;

          border-radius: 6px;

          border: 1px solid #38516f;

          background: #0a1628;
          color: #ffffff;

          outline: none;

          font-size: 12px;
          font-weight: 900;

          cursor: pointer;
        }

        .aop-rate-selector select:focus {
          border-color: #4d9bd4;
        }

        .aop-selected-rate {
          margin-top: 7px;

          color: #83c8f1;

          font-size: 11px;

          text-align: center;

          font-weight: 900;
        }

        /* =====================================================
           EXPLANATION CARD
           ===================================================== */

        .aop-explanation-card {
          margin-top: 22px;

          padding: 20px;

          background: linear-gradient(
            135deg,
            #300303 10%,
            #850000 55%,
            #cf0000 100%
          );

          margin-bottom: 20px;

          border: 1px solid #e6c875;
          border-radius: 20px;

          box-shadow:
            0 12px 30px rgba(7, 21, 41, 0.1);
        }

        .aop-explanation-card h3 {
          margin: 0 0 20px;

          color: #83c8f1;

          font-size: 14px;
          font-weight: 900;

          text-align: center;
        }

        /* =====================================================
           STEPS
           ===================================================== */

        .aop-step {
          display: flex;

          gap: 14px;

          padding: 14px 0;

          border-top: 1px solid #20324d;
        }

        .aop-step-number {
          flex: 0 0 30px;

          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #123867;
          border: 1px solid #315d91;

          color: #83c8f1;

          font-size: 12px;
          font-weight: 900;
        }

        .aop-step-content {
          flex: 1;
        }

        .aop-step h4 {
          margin: 0 0 5px;

          color: #e4edf8;

          font-size: 12px;
          font-weight: 900;
        }

        .aop-step p {
          margin: 0;

          color: #99aabd;

          font-size: 11px;
          line-height: 1.65;
        }

        /* =====================================================
           ACTION BUTTONS
           ===================================================== */

        .aop-actions {
          display: none;
        }

        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 700px) {

          .aop-container1 {
            width: min(100% - 20px, 1180px);
          }

          .aop-breadcrumb {
            justify-content: flex-start;
            padding-left: 10px;
            flex-wrap: wrap;
          }

          .aop-top-back {
            width: min(100% - 20px, 1180px);
            padding-top: 12px;
          }

          .aop-hero {
            padding: 28px 0 32px;
          }

          .aop-hero h1 {
            font-size: 22px;
          }

          .aop-hero p {
            font-size: 12px;
          }

          .aop-table {
            font-size: 11px;
          }

          .aop-table-header,
          .aop-table-row {
            grid-template-columns: 1fr 0.8fr;
          }

          .aop-table-header > div,
          .aop-situation-cell,
          .aop-tax-cell {
            padding: 9px;
          }

          .aop-table-header > div {
            font-size: 11px;
          }

          .aop-situation-cell {
            font-size: 11px;
          }

          .aop-situation-cell strong {
            font-size: 11px;
          }

          .aop-situation-cell span {
            font-size: 11px;
            font-weight: 900;
          }

          .aop-tax-cell {
            font-size: 11px;
          }

          .aop-tax-cell div {
            font-size: 11px;
            font-weight: 900;
          }

          .aop-rate-selector {
            align-items: center;
            flex-direction: column;
          }

          .aop-back-button {
            font-size: 11px;
          }

        }

      `}</style>


      <div className="aop-page">


        {/* =====================================================
            BREADCRUMB
            ===================================================== */}

        <div className="aop-container1">

          <div className="aop-breadcrumb">

            <button
              className="hii"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <span>›</span>

            <button
              onClick={() => navigate("/acts-laws")}
            >
              Acts & Laws
            </button>

            <span>›</span>

            <span>
              AOP Tax Treatment
            </span>

          </div>

        </div>


        {/* =====================================================
            BACK BUTTON – TOP LEFT
            ===================================================== */}

        <div className="aop-top-back">

          <button
            className="aop-back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

        </div>


        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="aop-hero">

          <div className="aop-container">

            <div className="aop-hero-badge">
              AOP / BOI TAXATION
            </div>

            <h1>
              AOP Tax Treatment – Situations
            </h1>

            <p>
              Applicable tax treatment of AOP income based on
              determination of members&apos; shares and the
              applicable tax rates.
            </p>

          </div>

        </section>


        {/* =====================================================
            CONTENT
            ===================================================== */}

        <section className="aop-content">

          <div className="aop-container">


            {/* =================================================
                EXPLANATION
                ================================================= */}

            <div className="aop-explanation-card">

              <h3>
                How to determine the tax treatment
              </h3>


              {/* STEP 1 */}

              <div className="aop-step">

                <div className="aop-step-number">
                  1
                </div>

                <div className="aop-step-content">

                  <h4>
                    Determine whether members&apos; shares are known
                  </h4>

                  <p>
                    First determine whether the individual shares
                    of the members in the AOP income are determined
                    and clearly ascertainable.
                  </p>

                </div>

              </div>


              {/* STEP 2 */}

              <div className="aop-step">

                <div className="aop-step-number">
                  2
                </div>

                <div className="aop-step-content">

                  <h4>
                    Check the applicable member tax rates
                  </h4>

                  <p>
                    Where the shares are determined, examine the
                    applicable tax rate of each member and compare
                    it with the Maximum Marginal Rate (MMR).
                  </p>

                </div>

              </div>


              {/* STEP 3 */}

              <div className="aop-step">

                <div className="aop-step-number">
                  3
                </div>

                <div className="aop-step-content">

                  <h4>
                    Apply MMR or higher rate where applicable
                  </h4>

                  <p>
                    Depending upon the situation, the AOP income
                    may be taxed at individual rates, MMR, or a
                    higher applicable rate.
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                AOP TAX TREATMENT TABLE
                ================================================= */}

            <div className="smr-info-card">

              <h3>
                AOP Tax Treatment – Situations
              </h3>

              <p style={{ marginBottom: "12px" }}>
                Applicable tax treatment of AOP income
              </p>


              <div className="aop-table">


                {/* =================================================
                    HEADER
                    ================================================= */}

                <div className="aop-table-header">

                  <div>
                    Situation
                  </div>

                  <div>
                    AOP par tax
                  </div>

                </div>


                {/* =================================================
                    ROW 1
                    ================================================= */}

                <div className="aop-table-row">

                  <div className="aop-situation-cell">

                    <strong>
                      Share determined
                    </strong>

                    <span>
                      + all members below basic exemption
                    </span>

                  </div>

                  <div className="aop-tax-cell">

                    Individual rates

                  </div>

                </div>


                {/* =================================================
                    ROW 2
                    ================================================= */}

                <div className="aop-table-row">

                  <div className="aop-situation-cell">

                    <strong>
                      Share determined
                    </strong>

                    <span>
                      + any member exceeds basic exemption
                    </span>

                  </div>

                  <div className="aop-tax-cell">

                    MMR

                  </div>

                </div>


                {/* =================================================
                    ROW 3
                    ================================================= */}

                <div className="aop-table-row">

                  <div className="aop-situation-cell">

                    <strong>
                      Share determined
                    </strong>

                    <span>
                      + any member&apos;s rate &gt; MMR
                    </span>

                  </div>

                 <div className="aop-tax-cell">

  <div>
    That member&apos;s attributable share
  </div>

  <div>
    <span className="aop-arrow">
      →
    </span>

    Higher rate

    <span className="aop-arrow">
      {"  →  "}
    </span>

    Balance

    <span className="aop-arrow">
      {"  →  "}
    </span>

    MMR
  </div>

</div>


                </div>


                {/* =================================================
                    ROW 4
                    ================================================= */}

                <div className="aop-table-row">

                  <div className="aop-situation-cell">

                    <strong>
                      Share indeterminate / unknown
                    </strong>

                  </div>

                  <div className="aop-tax-cell">

                    MMR

                  </div>

                </div>


                {/* =================================================
                    ROW 5
                    ================================================= */}

                <div className="aop-table-row aop-last-row">

                  <div className="aop-situation-cell">

                    <strong>
                      Share indeterminate
                    </strong>

                    <span>
                      + member&apos;s rate &gt; MMR
                    </span>

                  </div>


                  <div className="aop-tax-cell">

                    <div className="aop-entire-income">
                      Entire AOP income
                    </div>

                    <div>

                      <span className="aop-arrow">
                        →
                      </span>

                      Higher rate

                    </div>


                    <div className="aop-rate-note">

                      25% and 37% are both applicable.
                      Select the applicable rate manually.

                    </div>


                    {/* RATE SELECTOR */}

                    <div className="aop-rate-selector">

                      <label htmlFor="higherRate">
                        Select Higher Rate
                      </label>

                      <select
                        id="higherRate"
                        value={higherRate}
                        onChange={(e) =>
                          setHigherRate(e.target.value)
                        }
                      >

                        <option value="25">
                          25%
                        </option>

                        <option value="37">
                          37%
                        </option>

                      </select>

                    </div>


                    <div className="aop-selected-rate">

                      Selected rate:{" "}

                      <strong>
                        {higherRate}%
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>
    </>
  );
}
