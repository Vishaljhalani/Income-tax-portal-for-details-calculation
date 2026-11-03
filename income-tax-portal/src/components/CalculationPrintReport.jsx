import React from "react";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return `₹ ${Math.round(value).toLocaleString("en-IN")}`;
  }

  return value;
};

export default function CalculationPrintReport({
  calculatorName = "",
  assessmentYear = "",
  sections = [],
}) {
  return (
    <div className="calculation-print-report">
      <style>{`
        .calculation-print-report {
          display: none;
          background: #ffffff;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }

        .calculation-print-report * {
          box-sizing: border-box;
        }

        .print-report-header {
          text-align: center;
          margin-bottom: 8px;
        }

        .print-report-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 2px;
        }

        .print-report-ay {
          font-size: 11px;
          color: #374151;
          margin: 0;
        }

        .print-report-section {
          margin-top: 8px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .print-report-section-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 4px;
          padding-bottom: 2px;
          border-bottom: 1.5px solid #111827;
        }

        .print-report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          table-layout: fixed;
        }

        .print-report-table th,
        .print-report-table td {
          border: 1px solid #9ca3af;
          padding: 3px 5px;
          vertical-align: middle;
          word-wrap: break-word;
        }

        .print-report-table th {
          background: #f3f4f6;
          font-weight: 700;
          text-align: center;
        }

        .print-report-table td:first-child {
          font-weight: 600;
          width: 28%;
        }

        .print-report-table td:not(:first-child) {
          text-align: right;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 5mm 5mm 5mm;
          }

          html, body {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }

          body * {
            visibility: hidden !important;
          }

          .calculation-print-report,
          .calculation-print-report * {
            visibility: visible !important;
          }

          .calculation-print-report {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          .print-report-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 6px !important;
          }
        }
      `}</style>

      <div className="print-report-header">
        <h1 className="print-report-title">
          {calculatorName}
        </h1>

        {assessmentYear && (
          <p className="print-report-ay">
            Assessment Year: {assessmentYear}
          </p>
        )}
      </div>

      {sections.map((section, sectionIndex) => (
        <section
          className="print-report-section"
          key={sectionIndex}
        >
          {section.title && (
            <h2 className="print-report-section-title">
              {section.title}
            </h2>
          )}

          <table className="print-report-table">
            {section.columns?.length > 0 && (
              <thead>
                <tr>
                  {section.columns.map((column, columnIndex) => (
                    <th key={columnIndex}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody>
              {(section.rows || []).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.label}</td>

                  {(row.values || []).map(
                    (value, valueIndex) => (
                      <td key={valueIndex}>
                        {formatValue(value)}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}