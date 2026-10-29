import React from "react";

export default function Form10IEANotes() {
  return (
    <>
      <style>{`
        /* =========================================================
           GLOBAL PAGE BACKGROUND
           ========================================================= */

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(37, 99, 235, 0.28),
              transparent 32%
            ),
            radial-gradient(
              circle at 85% 20%,
              rgba(14, 165, 233, 0.18),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #07111f 0%,
              #0b1d3a 45%,
              #0a1730 100%
            );
        }

        body {
          min-height: 100vh;
        }

        #root {
          min-height: 100vh;
        }

        /* =========================================================
           FULL FORM 10-IEA PAGE
           ========================================================= */

        .form10iea-page {
          width: 100%;
          min-height: 100vh;
          box-sizing: border-box;

          padding: 32px 18px 60px;

          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(37, 99, 235, 0.28),
              transparent 32%
            ),
            radial-gradient(
              circle at 85% 20%,
              rgba(14, 165, 233, 0.18),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #07111f 0%,
              #0b1d3a 45%,
              #0a1730 100%
            );

          color: #e5eefc;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .form10iea-page *,
        .form10iea-page *::before,
        .form10iea-page *::after {
          box-sizing: border-box;
        }

        .form10iea-container {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
        }

        /* =========================================================
           MAIN CARD
           ========================================================= */

        .form10iea-main-card {
          width: 100%;
          padding: 0;

          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }

        /* =========================================================
           HEADER
           ========================================================= */

        .form10iea-header {
          padding: 30px;
          margin-bottom: 32px;

          background:
            linear-gradient(
              105deg,
              #243f91 0%,
              #2563eb 48%,
              #0284c7 100%
            );

          border: none !important;
          border-radius: 20px;

          color: #ffffff;

          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.22);
        }

        .form10iea-badge {
          display: inline-flex;
          align-items: center;

          padding: 7px 13px;
          margin-bottom: 14px;

          background: rgba(255, 255, 255, 0.12);

          border: none !important;
          border-radius: 999px;

          color: #ffffff;

          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .form10iea-title {
          margin: 0;

          color: #ffffff;

          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .form10iea-subtitle {
          margin: 12px 0 0;

          color: #dbeafe;

          font-size: 15px;
          line-height: 1.7;
        }

        /* =========================================================
           SECTION TITLES
           ========================================================= */

        .form10iea-section-title {
          margin: 34px 0 16px;
          padding: 0;

          color: #a9ccff;

          border: none !important;
          border-bottom: none !important;

          font-size: 23px;
          line-height: 1.35;
          font-weight: 800;
        }

        /* =========================================================
           CONTENT CARDS
           ========================================================= */

        .form10iea-card {
          padding: 22px;
          margin-bottom: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(17, 38, 73, 0.88),
              rgba(9, 27, 54, 0.88)
            ) !important;

          border: none !important;
          outline: none !important;
          border-radius: 16px;

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.16);
        }

        .form10iea-card.full {
          width: 100%;
        }

        .form10iea-card-title {
          display: flex;
          align-items: center;
          gap: 11px;

          margin-bottom: 15px;

          color: #dbeafe;

          font-size: 17px;
          font-weight: 800;
          line-height: 1.5;
        }

        /* =========================================================
           ICON
           ========================================================= */

        .form10iea-icon {
          width: 34px;
          height: 34px;
          min-width: 34px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #0284c7
            );

          border: none !important;
          border-radius: 10px;

          color: #ffffff;

          font-size: 12px;
          font-weight: 800;

          box-shadow:
            0 5px 15px rgba(37, 99, 235, 0.25);
        }

        /* =========================================================
           TEXT
           ========================================================= */

        .form10iea-text {
          margin: 0 0 12px;

          color: #cbdcf2;

          font-size: 14px;
          line-height: 1.75;
        }

        .form10iea-text:last-child {
          margin-bottom: 0;
        }

        .form10iea-list {
          margin: 8px 0 0;
          padding-left: 23px;

          color: #cbdcf2;
        }

        .form10iea-list li {
          margin-bottom: 9px;

          color: #cbdcf2;

          font-size: 14px;
          line-height: 1.7;
        }

        .form10iea-list li:last-child {
          margin-bottom: 0;
        }

        /* =========================================================
           GRID
           ========================================================= */

        .form10iea-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        /* =========================================================
           TABLE WRAPPER
           ========================================================= */

        .form10iea-table-wrap {
          width: 100%;
          overflow-x: auto;

          margin-top: 15px;

          background: transparent !important;

          border: none !important;
          outline: none !important;
          border-radius: 12px;
        }

        /* =========================================================
           TABLE
           ========================================================= */

        .form10iea-table {
          width: 100%;
          min-width: 760px;

          border-collapse: collapse;
          border-spacing: 0;

          background: transparent !important;

          border: none !important;
        }

        .form10iea-table {
          padding: 14px 15px;
        line-height: 1.6;
          background:
            linear-gradient(
              105deg,
              #243f91 0%,
              #2563eb 48%,
              #0284c7 100%
            ) !important;

          color: #ffffff;

          text-align: left;

          font-size: 13px;
          font-weight: 700;

          vertical-align: top;

          border: none !important;
        }

        .form10iea-table td {
          padding: 14px 15px;

          background: rgba(13, 29, 55, 0.86) !important;

          color: #dbeafe;

          font-size: 13px;
          line-height: 1.6;

          vertical-align: top;

          border: none !important;
        }

        .form10iea-table tbody tr:nth-child(even) td {
          background: rgba(18, 38, 70, 0.90) !important;
        }

        .form10iea-table tbody tr:hover td {
          background: rgba(37, 99, 235, 0.18) !important;
        }

        /* =========================================================
           HIGHLIGHT
           ========================================================= */

        .form10iea-highlight {
          margin-top: 15px;
          padding: 17px 18px;

          background:
            linear-gradient(
              135deg,
              rgba(30, 64, 175, 0.28),
              rgba(14, 116, 144, 0.18)
            ) !important;

          color: #dbeafe;

          border: none !important;
          border-left: none !important;
          outline: none !important;
          border-radius: 14px;

          font-size: 14px;
          line-height: 1.7;
        }

        /* =========================================================
           WARNING
           ========================================================= */

        .form10iea-warning {
          margin-top: 15px;
          padding: 17px 18px;

          background:
            linear-gradient(
              135deg,
              rgba(120, 53, 15, 0.22),
              rgba(154, 52, 18, 0.12)
            ) !important;

          color: #fed7aa;

          border: none !important;
          border-left: none !important;
          outline: none !important;
          border-radius: 14px;

          font-size: 14px;
          line-height: 1.7;
        }

        /* =========================================================
           FOOTER
           ========================================================= */

        .form10iea-footer {
          margin-top: 30px;
          padding: 18px 20px;

          background:
            rgba(10, 29, 56, 0.72) !important;

          color: #9fb5d1;

          border: none !important;
          outline: none !important;
          border-radius: 14px;

          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================================
           REMOVE ACCIDENTAL WHITE BACKGROUNDS
           ========================================================= */

        .form10iea-page .bg-white {
          background: transparent !important;
        }

        .form10iea-page [class*="bg-white"] {
          background: transparent !important;
        }

        .form10iea-page [class*="border"] {
          border-color: transparent !important;
        }

        /* =========================================================
           SCROLLBAR
           ========================================================= */

        .form10iea-table-wrap::-webkit-scrollbar {
          height: 8px;
        }

        .form10iea-table-wrap::-webkit-scrollbar-track {
          background: #07111f;
        }

        .form10iea-table-wrap::-webkit-scrollbar-thumb {
          background: #2454a6;
          border-radius: 10px;
        }

        .form10iea-table-wrap::-webkit-scrollbar-thumb:hover {
          background: #3274db;
        }

        .back-btn {
        padding: 10px;
        border-radius: 10px;
        font-weight: 800;
        cursor: pointer;
        background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 60%, #0284c7 100%);
        margin-bottom:20px;
        color: #e5eefc;
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */

        @media (max-width: 900px) {
          .form10iea-main-card {
            padding: 0;
          }

          .form10iea-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .form10iea-page {
            padding: 20px 10px 40px;
          }

          .form10iea-header {
            padding: 23px;
            border-radius: 18px;
          }

          .form10iea-section-title {
            font-size: 20px;
          }

          .form10iea-card {
            padding: 18px;
            border-radius: 14px;
          }
        }

        @media (max-width: 480px) {
          .form10iea-page {
            padding: 15px 7px 30px;
          }

          .form10iea-header {
            padding: 19px;
          }

          .form10iea-title {
            font-size: 25px;
          }

          .form10iea-subtitle {
            font-size: 13px;
          }
        
          .tra ()

          .form10iea-card {
            padding: 17px;
          }
           .form10iea-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            color: #0772dd;
            border: 1px solid rgba(96, 165, 250, 0.30);
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            box-shadow:
                0 6px 18px rgba(0, 0, 0, 0.16);
            transition:
                background 0.2s ease,
                color 0.2s ease,
                transform 0.2s ease,
                box-shadow 0.2s ease;
            }

.form10iea-back-btn:hover {
  background:
    linear-gradient(
      135deg,
      rgba(37, 99, 235, 0.45),
      rgba(2, 132, 199, 0.32)
    );

  color: #ebf4ff;

  transform: translateX(-3px);

  box-shadow:
    0 8px 22px rgba(37, 99, 235, 0.20);
}

.form10iea-back-icon {
  font-size: 18px;
  line-height: 1;
  backgroung: red;
}
        }
      `}</style>

     <div className="form10iea-page">
  <div className="form10iea-container">

    <button
      type="button"
      className="back-btn"
      onClick={() => window.history.back()}
    >
      <span className="form10iea-back-icon">←</span>
      Back
    </button>

    <div className="form10iea-main-card">

            {/* =====================================================
                HEADER
                ===================================================== */}

            <div className="form10iea-header">
              <div className="form10iea-badge">
                Form 10-IEA
              </div>

              <h1 className="form10iea-title">
                Form 10-IEA — Complete Notes
              </h1>

              <p className="form10iea-subtitle">
                AY 2022-23 se abhi (Tax Year 2026-27) tak
              </p>
            </div>

            {/* =====================================================
                1. BACKGROUND
                ===================================================== */}

            <h2 className="form10iea-section-title">
              1. Background — kab kya form tha
            </h2>

            <div className="form10iea-card full">
              <div className="form10iea-table-wrap">
                <table className="form10iea-table">
                  <thead>
                    <tr className="tra">
                      <th>Period</th>
                      <th>Default Regime</th>
                      <th>Business/Profession Income wale</th>
                      <th>Bina Business Income wale</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        AY 2021-22 se AY 2023-24
                        <br />
                        (FY 2020-21 se 2022-23)
                      </td>

                      <td>
                        Old Regime default
                      </td>

                      <td>
                        New regime chahiye to Form 10-IE file karo
                      </td>

                      <td>
                        Har saal ITR mein hi free se chun sakte ho
                      </td>
                    </tr>

                    <tr>
                      <td>
                        AY 2024-25 se AY 2026-27
                        <br />
                        (FY 2023-24 se 2025-26)
                      </td>

                      <td>
                        New Regime default
                      </td>

                      <td>
                        Old regime chahiye to Form 10-IEA file karo
                      </td>

                      <td>
                        Har saal ITR mein hi free se chun sakte ho
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Tax Year 2026-27 se
                        <br />
                        (FY 2026-27, return 2027 mein)
                      </td>

                      <td>
                        New Regime default (ab Section 202,
                        Income-tax Act 2025 ke under)
                      </td>

                      <td>
                        Koi alag Form 10-IEA nahi — regime
                        choice/withdrawal seedha ITR ke andar
                        (Rule 136) hoga
                      </td>

                      <td>
                        Seedha ITR mein
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="form10iea-highlight">
                Yani Form 10-IEA sirf AY 2024-25 se AY 2026-27 tak
                relevant hai (purane Act, Section 115BAC ke under).
                Tax Year 2026-27 (jo abhi chal raha hai, FY 2026-27)
                ke liye, jab return 2027 mein banega, tab 10-IEA ki
                jagah ye option seedha return ke andar exercise hoga —
                naya alag form nahi bharna padega.
              </div>

              <p className="form10iea-text">
                Form 10-IEA sirf un logon ke liye hai jinke paas
                Business ya Profession ka income hai (PGBP head).
                Jo sirf salary/other sources se income kamate hain,
                unhe kabhi bhi koi form nahi bharna — wo har saal ITR
                mein hi "Old" ya "New" tick karke free mein switch
                kar sakte hain.
              </p>
            </div>

            {/* =====================================================
                2. DECISION TREE
                ===================================================== */}

            <h2 className="form10iea-section-title">
              2. Aapka case — business/profession income wala — decision tree
            </h2>

            <div className="form10iea-card full">
              <div className="form10iea-card-title">
                <span className="form10iea-icon">
                  1
                </span>

                <span>
                  Step 1: Kya aapne pehle kisi AY mein
                  (AY 2024-25 ya 2025-26 ya 2026-27)
                  Form 10-IEA file kiya hai?
                </span>
              </div>

              <p className="form10iea-text">
                Agar kabhi file nahi kiya (matlab ab tak default New Regime mein ho):
              </p>

              <ul className="form10iea-list">
                <li>
                  Is saal New Regime mein hi rehna hai → kuch mat karo,
                  koi form nahi chahiye.
                </li>

                <li>
                  Is saal Old Regime mein jaana hai → Form 10-IEA file
                  karo ("Opting Out") — due date u/s 139(1) ke andar,
                  ITR file karne se PEHLE (ITR mein 10-IEA ki
                  acknowledgement number daalni padti hai).
                </li>
              </ul>

              <div
                className="form10iea-card"
                style={{ marginTop: "18px" }}
              >
                <div className="form10iea-card-title">
                  <span className="form10iea-icon">
                    2
                  </span>

                  <span>
                    Agar pehle file kiya hai (Old Regime opt kiya tha)
                    aur kabhi withdraw nahi kiya:
                  </span>
                </div>

                <ul className="form10iea-list">
                  <li>
                    Is saal bhi Old Regime mein rehna hai → Koi form
                    file nhi krna hai or previous 10IEA ki details
                    enter krke continue krna hai.
                  </li>

                  <li>
                    Is saal New Regime mein jaana hai → Form 10-IEA
                    file karo, par is baar "Re-entering New Regime /
                    Withdrawal" option select karo, due date ke andar.
                    Ye withdrawal zindagi mein sirf EK baar allowed hai.
                  </li>
                </ul>
              </div>

              <div
                className="form10iea-card"
                style={{ marginTop: "18px" }}
              >
                <div className="form10iea-card-title">
                  <span className="form10iea-icon">
                    3
                  </span>

                  <span>
                    Agar pehle Old Regime file kiya tha, AUR uske baad
                    kisi saal withdrawal bhi kar chuke ho
                    (New Regime mein wapas aa gaye ho):
                  </span>
                </div>

                <ul className="form10iea-list">
                  <li>
                    Ab aap permanently New Regime mein ho — jab tak
                    business/profession income rahega, Old Regime mein
                    dobara nahi ja sakte. 10-IEA dobara file karne ka
                    option system hi nahi dega.
                  </li>

                  <li>
                    Agar kisi future saal business income band ho jaaye
                    (sirf salary/other income reh jaaye), to ye
                    restriction hat jaati hai — tab har saal free se
                    choose kar sakte ho.
                  </li>
                </ul>
              </div>
            </div>

            {/* =====================================================
                3. VALIDITY
                ===================================================== */}

            <h2 className="form10iea-section-title">
              3. Validity — kab form valid hoga
            </h2>

            <div className="form10iea-card full">
              <p className="form10iea-text">
                Form 10-IEA sirf tab valid hai jab wo original due date
                u/s 139(1) ke andar file ho (belated return ki date nahi,
                original due date — jaise non-audit case ke liye
                AY 2026-27 mein 31 July 2026, audit case 31 Oct 2026,
                aur transfer pricing (3CEB) case 30 Nov 2026).
              </p>

              <p className="form10iea-text">
                Agar due date ke baad file kiya:
              </p>

              <ul className="form10iea-list">
                <li>
                  Form invalid maana jaata hai.
                </li>

                <li>
                  Us saal ke liye New Regime hi apply hoga, chahe
                  aapko Old Regime chahiye ho.
                </li>

                <li>
                  Belated return bhi Old Regime allow nahi karegi,
                  chahe 10-IEA time par file ho gaya ho — return khud
                  bhi 139(1) ke andar honi chahiye.
                </li>
              </ul>
            </div>

            {/* =====================================================
                4. FILE AGAIN / WITHDRAWAL
                ===================================================== */}

            <h2 className="form10iea-section-title">
              4. "Maine file karke phir se file kiya aur withdraw ho gaya" wala case
            </h2>

            <div className="form10iea-card full">
              <p className="form10iea-text">
                Ye genuinely ek confusing area hai jahan real users
                galti kar chuke hain. Form 10-IEA ek toggle ki tarah
                kaam karta hai:
              </p>

              <ul className="form10iea-list">
                <li>
                  Pehli baar file karne par "Opting Out" select hota hai.
                </li>

                <li>
                  Agar aap dobara file karte ho (chahe galti se),
                  system assume kar leta hai ki aap "Re-entering New
                  Regime" kar rahe ho — even if aapka intention sirf
                  old regime continue karna tha.
                </li>
              </ul>

              <p
                className="form10iea-text"
                style={{ marginTop: "16px" }}
              >
                Isliye agar aisa ho chuka hai (galti se ya jaanbujh kar
                dobara file karke withdraw ho gaye ho):
              </p>

              <ul className="form10iea-list">
                <li>
                  Usi assessment year ke andar isko cancel/undo karne
                  ka koi tareeka nahi hai — ek baar withdraw ho gaya
                  to us saal ke liye New Regime hi lagega.
                </li>

                <li>
                  Aage se, jaisa point 2 mein bataya, ab aap permanently
                  New Regime mein ho (jab tak business income hai).
                </li>
              </ul>
            </div>

            {/* =====================================================
                5. IMPORTANT CAVEAT
                ===================================================== */}

            <h2 className="form10iea-section-title">
              5. Important caveat — "continuing old regime" ke liye annual filing
            </h2>

            <div className="form10iea-card full">
              <p className="form10iea-text">
                Yahan thoda nuance hai jisme recent guidance (last 1-2
                mahine ki) thodi strict ho gayi hai:
              </p>

              <div className="form10iea-highlight">
                <strong>
                  • Purana samajh (2024-25 ke time se):
                </strong>{" "}
                Ek baar 10-IEA file kar diya (opt-out), to wo
                automatically continue hota hai agle saalon mein bhi,
                jab tak withdraw na karo — dobara file karne ki zaroorat nahi.
              </div>

              <div className="form10iea-warning">
                <strong>
                  • Naya/current guidance (AY 2026-27 ke liye):
                </strong>{" "}
                Ek baar Form 10-IEA file karke Old Regime opt karne ke baad,
                agar taxpayer Old Regime hi continue karta hai, to har saal
                Form 10-IEA file karne ki zaroorat nahi hai. Previous Form
                10-IEA ki details ITR mein provide karke Old Regime continue
                kiya ja sakta hai. Form 10-IEA dobara tab file karna hota hai
                jab taxpayer New Tax Regime mein re-enter karna chahta hai.
              </div>
            </div>

            {/* =====================================================
                6. QUICK SUMMARY
                ===================================================== */}

            <h2 className="form10iea-section-title">
              6. Quick one-line summary for fy 2025-26
            </h2>

            <div className="form10iea-card full">
              <div className="form10iea-table-wrap">
                <table className="form10iea-table">
                  <thead>
                    <tr>
                      <th>
                        Aapki situation
                      </th>

                      <th>
                        Karna kya hai
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        Kabhi 10-IEA file nahi kiya, New mein hi rehna hai
                      </td>

                      <td>
                        Kuch nahi
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Kabhi 10-IEA file nahi kiya, Old chahiye
                      </td>

                      <td>
                        10-IEA file karo (due date ke andar)
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Pehle Old opt kiya tha, Old hi continue karna hai
                      </td>

                      <td>
                        10-IEA Ki details fill karo jis year me file kiya tha
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Pehle Old opt kiya tha, ab New jaana hai
                      </td>

                      <td>
                        10-IEA file karo "withdrawal" wala — lifetime mein sirf ek baar
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Withdrawal already use kar chuke ho
                      </td>

                      <td>
                        Ab permanently New Regime, dobara 10-IEA nahi ban sakta
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Sirf salary/other income, koi business income nahi
                      </td>

                      <td>
                        Kabhi bhi koi form nahi — ITR mein hi free choice, har saal
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Tax Year 2026-27 (FY26-27, return 2027 mein)
                      </td>

                      <td>
                        10-IEA ki zaroorat hi nahi, option seedha return ke andar
                        (Rule 136)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}