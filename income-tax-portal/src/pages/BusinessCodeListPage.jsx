
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BusinessCodeListPage() {
  const navigate = useNavigate();

  const openPDF = () => {
    window.open("/BusinessCodeList.pdf", "_blank");
  };

  return (
    <div className="business-code-page">
      <div className="business-code-container">

       
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

        {/* Main Card */}
        <div className="business-code-card">

          <div className="business-code-section-title">
            <div>
              <h2>Business Code Reference</h2>
              <p>
                Open the complete business code list in PDF format.
              </p>
            </div>
          </div>

          <div className="business-code-content">

            <div className="business-code-icon">
              📄
            </div>

            <div className="business-code-info">
              <h3>Business Code List PDF</h3>

              <p>
                The complete list of business codes, descriptions and
                related details is available in the PDF document.
              </p>

              <button
                type="button"
                className="business-code-open-btn"
                onClick={openPDF}
              >
                <span>📄</span>
                Open Business Code List
              </button>
            </div>

          </div>

          {/* Information Box */}
          <div className="business-code-info-box">
            <strong>Important Information</strong>

            <p>
              Click the button above to open the Business Code List in a
              new browser tab. You can search, zoom, print or download the
              PDF from the browser.
            </p>
          </div>

        </div>

      

      </div>

      <style>{`

        .business-code-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top left,
              rgba(37, 99, 235, 0.25),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              #07111f 0%,
              #0f172a 45%,
              #111827 100%
            );
          color: #e5e7eb;
          padding: 34px;
          font-family: Inter, Arial, sans-serif;
          box-sizing: border-box;
        }

        .business-code-container {
          max-width: 1250px;
          margin: 0 auto;
        }

        /* HEADER */

        .business-code-header {
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

        .business-code-header-left {
          min-width: 0;
        }

        .business-code-kicker {
          color: #60a5fa;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .business-code-header h1 {
          font-size: 36px;
          line-height: 1.1;
          margin: 0;
          color: #ffffff;
        }

        .business-code-subtitle {
          margin: 10px 0 0;
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
        }

        /* BADGE */

        .business-code-badge {
          min-width: 190px;
          padding: 18px;
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.18),
              rgba(14, 165, 233, 0.12)
            );
          border: 1px solid rgba(96, 165, 250, 0.28);
          text-align: center;
          box-sizing: border-box;
        }

        .business-code-badge span {
          display: block;
          color: #93c5fd;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .business-code-badge strong {
          color: #ffffff;
          font-size: 20px;
        }

        /* MAIN CARD */

        .business-code-card {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 24px;
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
          padding: 26px;
        }

        /* SECTION TITLE */

        .business-code-section-title {
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        }

        .business-code-section-title h2 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
        }

        .business-code-section-title p {
          margin: 7px 0 0;
          color: #94a3b8;
          font-size: 14px;
        }

        /* CONTENT */

        .business-code-content {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px;
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.10),
              rgba(14, 165, 233, 0.05)
            );
          border: 1px solid rgba(96, 165, 250, 0.15);
        }

        .business-code-icon {
          width: 76px;
          height: 76px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.30),
              rgba(14, 165, 233, 0.18)
            );
          border: 1px solid rgba(96, 165, 250, 0.28);
          font-size: 34px;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
        }

        .business-code-info {
          flex: 1;
          min-width: 0;
        }

        .business-code-info h3 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 20px;
        }

        .business-code-info p {
          margin: 0 0 20px;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }

        /* OPEN PDF BUTTON */

        .business-code-open-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 20px;
          border-radius: 14px;
          border: 1px solid rgba(96, 165, 250, 0.35);
          background: linear-gradient(
            135deg,
            #2563eb,
            #0ea5e9
          );
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.24);
          transition: all 0.2s ease;
        }

        .business-code-open-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(37, 99, 235, 0.32);
        }

        .business-code-open-btn:active {
          transform: translateY(0);
        }

        /* INFO BOX */

        .business-code-info-box {
          margin-top: 24px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(96, 165, 250, 0.18);
        }

        .business-code-info-box strong {
          color: #bfdbfe;
          font-size: 14px;
        }

        .business-code-info-box p {
          margin: 7px 0 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
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

        /* RESPONSIVE */

        @media (max-width: 1050px) {

          .business-code-page {
            padding: 20px;
          }

          .business-code-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .business-code-badge {
            width: 100%;
          }
        }

        @media (max-width: 680px) {

          .business-code-page {
            padding: 14px;
          }

          .business-code-header,
          .business-code-card {
            padding: 20px;
            border-radius: 20px;
          }

          .business-code-header h1 {
            font-size: 28px;
          }

          .business-code-content {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .business-code-icon {
            width: 64px;
            height: 64px;
            font-size: 28px;
          }

          .business-code-open-btn {
            width: 100%;
          }

          .business-code-back-btn {
            width: 100%;
            justify-content: center;
          }
        }

      `}</style>
    </div>
  );
}

