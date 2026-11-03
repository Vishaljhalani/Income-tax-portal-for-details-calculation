import React from "react";
import { useNavigate } from "react-router-dom";

const RATIOS_DATA = [
  {
    sno: "a)",
    name: "Current Ratio",
    numerator: "Current Assets",
    denominator: "Current Liabilities",
  },
  {
    sno: "b)",
    name: "Debt-Equity Ratio",
    numerator: "Long Term Debt",
    denominator: "Shareholder's Fund",
  },
  {
    sno: "c)",
    name: "Debt Service Coverage Ratio",
    numerator: "EBDITA",
    denominator: "Interest + Principal Repayment (Term loan interest only, not WC Interest)",
  },
  {
    sno: "d)",
    name: "Return on Equity Ratio",
    numerator: "Net Earnings after Tax",
    denominator: "Shareholder’s Equity",
  },
  {
    sno: "e)",
    name: "Inventory Turnover Ratio",
    numerator: "Cost of Sales",
    denominator: "Average Stock",
  },
  {
    sno: "f)",
    name: "Trade Receivables Turnover Ratio",
    numerator: "Credit Sales",
    denominator: "Accounts Receivable",
  },
  {
    sno: "g)",
    name: "Trade Payables Turnover Ratio",
    numerator: "Credit Purchases",
    denominator: "Accounts Payable",
  },
  {
    sno: "h)",
    name: "Net Capital Turnover Ratio",
    numerator: "Revenue from Operation",
    denominator: "Working Capital",
  },
  {
    sno: "i)",
    name: "Net Profit Ratio",
    numerator: "Net Profit after Tax",
    denominator: "Revenue from Operation",
  },
  {
    sno: "j)",
    name: "Return on Capital Employed",
    numerator: "Earnings before Interest, Tax & Prior Period Item",
    denominator: "Capital Employed",
  },
  {
    sno: "k)",
    name: "Return on Investment",
    numerator: "Net Profit after Interest, Taxes & Preference Dividends",
    denominator: "Equity Share Capital plus Reserves",
  },
];

export default function FinancialRatiosDisclosure() {
  const navigate = useNavigate();

  return (
    <div className="ratios-page">
      <div className="ratios-container">
        
        {/* BACK BUTTON */}
        <button
          type="button"
          className="ratios-back-btn"
          onClick={() => navigate(-1)}
        >
          <span>←</span> Back
        </button>

        {/* HEADER SECTION */}
        <div className="ratios-header">
          <div>
            <span className="badge">SCHEDULE III COMPLIANCE</span>
            <h1>Financial Ratios & Mathematical Formulas</h1>
            <p>
              Companies Act, 2013 ke antargat aane wale sabhi mandatory financial ratios ke standard mathematical formulas.
            </p>
          </div>
        </div>

        {/* RATIOS TABLE */}
        <div className="table-wrapper">
          <table className="ratios-table">
            <thead>
              <tr>
                <th style={{ width: "70px", textAlign: "center" }}>S. No</th>
                <th style={{ width: "300px" }}>Particulars / Ratio Name</th>
                <th style={{ textAlign: "center" }}>Mathematical Formula (Numerator / Denominator)</th>
              </tr>
            </thead>
            <tbody>
              {RATIOS_DATA.map((item, index) => (
                <tr key={index}>
                  <td className="sno" style={{ textAlign: "center" }}>{item.sno}</td>
                  <td className="particulars">{item.name}</td>
                  <td className="formula-cell-container">
                    <div className="math-fraction">
                      <span className="numerator">{item.numerator}</span>
                      <span className="fraction-divider"></span>
                      <span className="denominator">{item.denominator}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMBEDDED CSS STYLES */}
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 rgba(15, 23, 42, 0.6);
        }

        .ratios-page {
          min-height: 100vh;
          background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.2), transparent 30%), linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%);
          color: #e2e8f0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 32px 20px;
        }

        .ratios-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .ratios-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 42px;
          padding: 0 18px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(15, 23, 42, 0.9);
          color: #cbd5e1;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .ratios-back-btn:hover {
          border-color: #60a5fa;
          color: #fff;
          background: rgba(37, 99, 235, 0.15);
        }

        .ratios-header {
          margin-bottom: 24px;
        }

        .badge {
          display: inline-block;
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.3);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .ratios-header h1 {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .ratios-header p {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        .table-wrapper {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .ratios-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        .ratios-table th {
          background: #0f172a;
          color: #93c5fd;
          padding: 16px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }

        .ratios-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          color: #e2e8f0;
          vertical-align: middle;
        }

        .ratios-table tr:hover {
          background: rgba(30, 41, 59, 0.5);
        }

        .sno {
          font-weight: 700;
          color: #60a5fa;
        }

        .particulars {
          font-weight: 700;
          color: #ffffff;
          font-size: 14px;
        }

        /* Mathematical Fraction Styling */
        .formula-cell-container {
          text-align: center;
          padding: 10px 16px !important;
        }

        .math-fraction {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin: 4px 0;
        }

        .numerator {
          padding: 2px 8px;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 13px;
        }

        .fraction-divider {
          width: 100%;
          min-width: 180px;
          height: 1.5px;
          background: rgba(148, 163, 184, 0.4);
          margin: 3px 0;
        }

        .denominator {
          padding: 2px 8px;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 13px;
        }

        /* Custom Scrollbars */
        .table-wrapper::-webkit-scrollbar {
          height: 8px;
        }
        .table-wrapper::-webkit-scrollbar-track {
          background: #07111f;
        }
        .table-wrapper::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}