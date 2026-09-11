import { useMemo, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import SectionHeader from '../components/SectionHeader';

const incomeTaxForms2026 = [
  {
    title: 'Form 01',
    description: 'Monthly Statement to be furnished by a stock exchange in respect of transactions in which client codes have been modified after registering in the system for the month of …….',
    pdf: '/forms/Form-No-1.pdf',
  },
  {
    title: 'Form 02',
    description: 'Application for notification of a zero coupon bond under section 2(112).',
    pdf: '/forms/form-no-2.pdf',
  },
  {
    title: 'Form 03',
  description: 'Certificate of an accountant under rule 7 for entity issuing zero coupon bond.',
    pdf: '/forms/form-no-3.pdf',
  },
  {
    title: 'Form 04',
   description: 'Income attributable to assets located in India under section 9(10)(a).',
    pdf: '/forms/form-no-4.pdf',
  },
  {
    title: 'Form 05',
    description: 'Statement regarding preliminary expenses incurred by the assessee to be furnished under Section 44(3).',
    pdf: '/forms/form-no-5.pdf',
  },
  {
    title: 'Form 06',
    description: 'Audit Report for claiming deduction for certain preliminary expenses under section 44 or expenditure for prospecting certain minerals under section 51.',
    pdf: '/forms/form-no-6.pdf',
  },
  {
    title: 'Form 07',
    description: 'Application for approval of scientific research programme under section 45(3)(c).',
    pdf: '/forms/form-no-7.pdf',
  },
  {
    title: 'Form 08',
    description: 'Order of approval of Scientific Research Programme under section 45(3)(c).',
    pdf: '/forms/form-no-8.pdf',
  },
  {
    title: 'Form 09',
    description: 'Receipt of payment for carrying out scientific research under section 45(3)(c).',
    pdf: '/forms/form-no-9.pdf',
  },
  {
    title: 'Form 10',
    description: 'Report to be submitted by the prescribed authority to the Chief Commissioner of Income-tax having jurisdiction over the sponsor after approval of scientific research programme under section 45(3)(c).',
    pdf: '/forms/form-no-10.pdf',
  },
  {
    title: 'Form 11',
    description: 'Application for entering into an agreement with the Department of Scientific and Industrial research for cooperation in In-house research development facility.',
    pdf: '/forms/form-no-11.pdf',
  },
  {
    title: 'Form 12',
    description: 'Report to be submitted by the prescribed authority to the Chief Commissioner of Income-tax having jurisdiction over the company.',
    pdf: '/forms/form-no-12.pdf',
  },
  {
    title: 'Form 13',
    description: 'Report from an accountant to be furnished under Section 45(2) relating to in-house scientific research and development facility.',
    pdf: '/forms/form-no-13.pdf',
  },
  {
    title: 'Form 14',
    description: 'Order of approval of in-house research and development facility under section 45(2).',
    pdf: '/forms/form-no-14.pdf',
  },
  {
    title: 'Form 15',
    description: 'Statement to be filed by research association, university, college or other institution or company (“donee”) under section 45(4)(a).',
    pdf: '/forms/form-no-15.pdf',
  },
  {
    title: 'Form 16',
    description: 'Certificate of donation under section 45(4)(a) made to the research association, university, college or other institution or company.',
    pdf: '/forms/form-no-16.pdf',
  },
  {
    title: 'Form 17',
    description: 'Application for approval of a company under section 45(3)(b) and of a research association, university, college or other institution under section 45(4)(b).',
    pdf: '/forms/form-no-17.pdf',
  },
  {
    title: 'Form 18',
    description: 'Application for notification of affordable housing project as specified business under section 46.',
    pdf: '/forms/form-no-18.pdf',
  },
  {
    title: 'Form 19',
    description: 'Application for notification of a semiconductor wafer fabrication manufacturing unit as specified business under section 46.',
    pdf: '/forms/form-no-19.pdf',
  },
  {
    title: 'Form 20',
    description: 'Application for approval of agricultural extension project under section 47(1)(a).',
    pdf: '/forms/form-no-20.pdf',
  },
  {
    title: 'Form 21',
    description: 'Form for notification of agricultural extension project under section 47(1)(a).',
    pdf: '/forms/form-no-21.pdf',
  },
  {
    title: 'Form 22',
    description: 'Application for approval of skill development project under section 47(1)(b).',
    pdf: '/forms/form-no-22.pdf',
  },
  {
    title: 'Form 23',
    description: 'Form for notification of skill development project under section 47(1)(b).',
    pdf: '/forms/form-no-23.pdf',
  },
  {
    title: 'Form 24',
    description: 'Audit Report under section 59 for computation of royalty and fee for technical services in the case of nonresident (not being a company) or a foreign company.',
    pdf: '/forms/form-no-24.pdf',
  },
  {
    title: 'Form 25',
    description: 'Form of daily case register.',
    pdf: '/forms/form-no-25.pdf',
  },
  {
    title: 'Form 26',
    description: 'Audit report and Statement of particulars required to be furnished under section 63.',
    pdf: '/forms/form-no-26.pdf',
  },
  {
    title: 'Form 27',
    description: 'Details of amount attributed to capital asset remaining with the specified entity.',
    pdf: '/forms/form-no-27.pdf',
  },
  {
    title: 'Form 28',
    description: 'Report of an accountant to be furnished by an assessee under section 77(4) of the Act relating to the computation of capital gains in the case of slump sale.',
    pdf: '/forms/form-no-28.pdf',
  },
  {
    title: 'Form 29',
    description: 'Certificate from the principal officer of the amalgamated company and duly verified by an accountant regarding achievement of the prescribed level of production and continuance of such level of production in subsequent years.',
    pdf: '/forms/form-no-29.pdf',
  },
  {
    title: 'Form 30',
    description: 'Certificate of the medical authority for certifying ‗person with disability‘, ‗severe disability‘, ‗autism‘, ‗cerebral palsy‘ and ‗multiple disability‘ for purposes of section 127 and section 154 of the Act..',
    pdf: '/forms/form-no-30.pdf',
  },
  {
    title: 'Form 31',
    description: 'Declaration to be filed by the assessee for claiming deduction under section 134 of the Act for rents paid.',
    pdf: '/forms/form-no-31.pdf',
  },
  {
    title: 'Form 32',
    description: 'Audit report under section 46, 138, 139, 140(8), 141, 142, 143 and 144 of the Act.',
    pdf: '/forms/form-no-32.pdf',
  },
  {
    title: 'Form 33',
    description: 'Particulars to be furnished in respect of units established under Special Economic Zone for claiming deduction under section 144 of the Act.',
    pdf: '/forms/form-no-33.pdf',
  },
  {
    title: 'Form 34',
    description: 'Report for deduction in respect of additional employee cost under section 146 of the Act.',
    pdf: '/forms/form-no-34.pdf',
  },
  {
    title: 'Form 35',
    description: 'Report for deduction in respect of income of Offshore Banking Units and Units of International Financial Services Centre under section 147(4)(a) of the Act.',
    pdf: '/forms/form-no-35.pdf',
  },
  {
    title: 'Form 36',
    description: 'Certificate under section 151(5) of the Act for authors of certain books in receipt of royalty income.',
    pdf: '/forms/form-no-36.pdf',
  },
  {
    title: 'Form 37',
    description: 'Certificate under section 152(5) of the Act for Patentees in receipt of royalty income.',
    pdf: '/forms/form-no-37.pdf',
  },
  {
    title: 'Form 38',
    description: 'Certificate of foreign inward remittance.',
    pdf: '/forms/form-no-38.pdf',
  },
  {
    title: 'Form 39',
    description: 'Form for claiming relief under section 157(1) of the Act in case of receipt of additional salary, or gratuity or Retrenchment Compensation or commutation of pension.',
    pdf: '/forms/form-no-39.pdf',
  },
  {
    title: 'Form 40',
    description: 'Exercise of option for relief from taxation in income from retirement benefit account maintained in a notified country under section 158 of the Act.',
    pdf: '/forms/form-no-40.pdf',
  },
  {
    title: 'Form 41',
    description: 'Information to be provided under section 159(8).',
    pdf: '/forms/form-no-41.pdf',
  },
  {
    title: 'Form 42',
    description: 'Application for Certificate of residence for the purposes of an agreement under section 159(1) and 159(2).',
    pdf: '/forms/form-no-42.pdf',
  },
  {
    title: 'Form 43',
    description: 'Certificate of residence for the purposes of section 159.',
    pdf: '/forms/form-no-43.pdf',
  },
  {
    title: 'Form 44',
    description: 'Statement of income from a country or region outside India and Foreign Tax Credit.',
    pdf: '/forms/form-no-44.pdf',
  },
  {
    title: 'Form 45',
    description: 'Intimation of settlement of dispute regarding foreign tax for which credit has not been claimed.',
    pdf: '/forms/form-no-45.pdf',
  },
  {
    title: 'Form 46',
    description: 'Exercise of option for determination of arm‘s length price (ALP) under section 166(9).',
    pdf: '/forms/form-no-46.pdf',
  },
  {
    title: 'Form 47',
    description: 'Certificate of an accountant under section 166.',
    pdf: '/forms/form-no-47.pdf',
  },
  {
    title: 'Form 48',
    description: 'Report from an accountant to be furnished under section 172 relating to international transaction(s) and/or specified domestic transaction(s).',
    pdf: '/forms/form-no-48.pdf',
  },
  {
    title: 'Form 49',
    description: 'Application for opting for Safe Harbour.',
    pdf: '/forms/form-no-49.pdf',
  },
  {
    title: 'Form 50',
    description: 'Application for a pre-filing consultation.',
    pdf: '/forms/form-no-50.pdf',
  },
];

export default function IncomeTaxForms2026Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForms = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return incomeTaxForms2026.filter((form) => {
      const matchesSearch =
        form.title.toLowerCase().includes(search) ||
        form.description.toLowerCase().includes(search);

      return matchesSearch;
    });
  }, [searchTerm]);

  return (
    <>
      <Breadcrumb current="Income Tax Forms 2026" />

      <section className="itf2026-page">
        <div className="container">
          <SectionHeader
            eyebrow="Income Tax Forms 2026"
            title="Income Tax Act, 2025 - Forms & PDF Library"
            subtitle="View and open all Income Tax Forms for 2026 in one professional searchable page."
          />

          <div className="itf2026-dashboard">
            <aside className="itf2026-sidebar">
              <div className="itf2026-panel">
                <p className="itf2026-label">Search Forms</p>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search form name..."
                  className="itf2026-search"
                />
              </div>

              <div className="itf2026-summary-card">
                <span>Total Forms</span>
                <strong>{incomeTaxForms2026.length}</strong>
                <p>PDF files can be opened directly in a new browser tab.</p>
              </div>
            </aside>

            <main className="itf2026-main">
              <div className="itf2026-toolbar">
                <div>
                  <h3>Available Forms</h3>
                  <p>
                    Showing {filteredForms.length} of {incomeTaxForms2026.length}{' '}
                    forms
                  </p>
                </div>

                {searchTerm && (
                  <button
                    type="button"
                    className="itf2026-reset-btn"
                    onClick={() => {
                      setSearchTerm('');
                    }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {filteredForms.length > 0 ? (
                <div className="itf2026-card-grid">
                  {filteredForms.map((form) => (
                    <article key={`${form.title}-${form.pdf}`} className="itf2026-card">
                      <div className="itf2026-card-top">
                        <span className="itf2026-badge">{form.category}</span>
                        <span className="itf2026-file-type">PDF</span>
                      </div>

                      <h3>{form.title}</h3>
                      <p>{form.description}</p>

                      <div className="itf2026-card-actions">
                        <a
                          href={form.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="itf2026-primary-link"
                        >
                          Open PDF
                        </a>

                        <a
                          href={form.pdf}
                          download
                          className="itf2026-secondary-link"
                        >
                          Download
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="itf2026-empty">
                  <h3>No form found</h3>
                  <p>Please change search text.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <style>{`
        .itf2026-page {
          min-height: 100vh;
          padding: 36px 0 70px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 34%),
            linear-gradient(135deg, #020617 0%, #0f172a 48%, #111827 100%);
          color: #e5e7eb;
        }

        .itf2026-dashboard {
          display: grid;
          grid-template-columns: 310px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          margin-top: 28px;
        }

        .itf2026-sidebar {
          position: sticky;
          top: 18px;
          display: grid;
          gap: 18px;
        }

        .itf2026-panel,
        .itf2026-summary-card,
        .itf2026-toolbar,
        .itf2026-card,
        .itf2026-empty {
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.82);
          box-shadow: 0 20px 45px rgba(2, 6, 23, 0.35);
          backdrop-filter: blur(14px);
          border-radius: 22px;
        }

        .itf2026-panel {
          padding: 18px;
        }

        .itf2026-label {
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #93c5fd;
        }

        .itf2026-search {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.28);
          outline: none;
          border-radius: 14px;
          padding: 13px 14px;
          background: rgba(2, 6, 23, 0.72);
          color: #f8fafc;
          font-size: 14px;
        }

        .itf2026-search::placeholder {
          color: #64748b;
        }

        .itf2026-search:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.12);
        }

        .itf2026-summary-card {
          padding: 20px;
          background:
            linear-gradient(135deg, rgba(37, 99, 235, 0.24), rgba(15, 23, 42, 0.9));
        }

        .itf2026-summary-card span {
          display: block;
          color: #93c5fd;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .itf2026-summary-card strong {
          display: block;
          margin-top: 8px;
          color: #ffffff;
          font-size: 42px;
          line-height: 1;
        }

        .itf2026-summary-card p {
          margin: 10px 0 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
        }

        .itf2026-main {
          min-width: 0;
        }

        .itf2026-toolbar {
          padding: 18px 20px;
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .itf2026-toolbar h3 {
          margin: 0;
          color: #ffffff;
          font-size: 20px;
        }

        .itf2026-toolbar p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 14px;
        }

        .itf2026-reset-btn {
          border: 1px solid rgba(148, 163, 184, 0.25);
          background: rgba(15, 23, 42, 0.9);
          color: #dbeafe;
          border-radius: 12px;
          padding: 11px 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .itf2026-reset-btn:hover {
          border-color: #60a5fa;
          color: #ffffff;
        }

        .itf2026-card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .itf2026-card {
          padding: 20px;
          transition: all 0.22s ease;
          min-height: 230px;
          display: flex;
          flex-direction: column;
        }

        .itf2026-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.7);
          box-shadow: 0 24px 55px rgba(2, 6, 23, 0.52);
        }

        .itf2026-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .itf2026-badge {
          display: inline-flex;
          align-items: center;
          max-width: 78%;
          min-height: 28px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.16);
          color: #bfdbfe;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
        }

        .itf2026-file-type {
          min-width: 42px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: rgba(248, 113, 113, 0.13);
          color: #fecaca;
          font-size: 12px;
          font-weight: 900;
        }

        .itf2026-card h3 {
          margin: 0;
          color: #ffffff;
          font-size: 21px;
          line-height: 1.25;
        }

        .itf2026-card p {
          margin: 11px 0 18px;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.65;
          flex: 1;
        }

        .itf2026-card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .itf2026-primary-link,
        .itf2026-secondary-link {
          flex: 1;
          min-height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
          transition: all 0.2s ease;
        }

        .itf2026-primary-link {
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #ffffff;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.28);
        }

        .itf2026-primary-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px rgba(37, 99, 235, 0.42);
        }

        .itf2026-secondary-link {
          border: 1px solid rgba(148, 163, 184, 0.26);
          background: rgba(2, 6, 23, 0.36);
          color: #dbeafe;
        }

        .itf2026-secondary-link:hover {
          border-color: #60a5fa;
          color: #ffffff;
        }

        .itf2026-empty {
          padding: 44px 22px;
          text-align: center;
        }

        .itf2026-empty h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
        }

        .itf2026-empty p {
          margin: 8px 0 0;
          color: #94a3b8;
        }

        @media (max-width: 1180px) {
          .itf2026-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 920px) {
          .itf2026-dashboard {
            grid-template-columns: 1fr;
          }

          .itf2026-sidebar {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .itf2026-page {
            padding: 24px 0 50px;
          }

          .itf2026-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .itf2026-card-grid {
            grid-template-columns: 1fr;
          }

          .itf2026-card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}