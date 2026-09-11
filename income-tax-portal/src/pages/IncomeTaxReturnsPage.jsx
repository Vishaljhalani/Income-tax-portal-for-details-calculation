import Breadcrumb from '../components/Breadcrumb';
import SectionHeader from '../components/SectionHeader';

const returnForms = [
  {
    title: 'ITR-1',
    description: 'For resident individuals having income from salary, one house property and other sources.',
    pdf: '/forms/ITR-1-2026-Eng.pdf',
  },
  {
    title: 'ITR-2',
    description: 'For individuals and HUFs not having income from business or profession.',
    pdf: '/forms/ITR-2-2026-Eng.pdf',
  },
  {
    title: 'ITR-3',
    description: 'For individuals and HUFs having income from business or profession.',
    pdf: '/forms/ITR-3-2026-Eng.pdf',
  },
  {
    title: 'ITR-4',
    description: 'For presumptive income from business or profession.',
    pdf: '/forms/ITR-4-2026-Eng.pdf',
  },
  {
    title: 'ITR-5',
    description: 'For firms, LLPs, AOPs, BOIs and other eligible entities.',
    pdf: '/forms/ITR-5-2026-Eng.pdf',
  },
  {
    title: 'ITR-6',
    description: 'For companies other than companies claiming exemption under section 11.',
    pdf: '/forms/ITR-6-2026-Eng.pdf',
  },
  {
    title: 'ITR-7',
    description: 'For trusts, institutions and persons required to file return under specific sections.',
    pdf: '/forms/ITR-7-2026-Eng.pdf',
  },
  {
    title: 'ITR-U',
    description: 'For persons to update income/reduce loss within forty-eight months from the end of the relevant assessment year.',
    pdf: '/forms/ITR-U-2026-Eng.pdf',
  },
  {
    title: 'ITR-V',
    description: 'Where the data of the Return of Income in Form ITR-1 (SAHAJ),ITR-2, ITR-3, ITR-4(SUGAM), ITR-5, ITR-7 filed but NOT verified electronically.',
    pdf: '/forms/ITR-V-2026-Eng.pdf',
  },
  {
    title: 'ITR-A',
    description: 'For successor entities to furnish return of income under section 170A consequent to business reorganisation.',
    pdf: '/forms/Form-ITR-A.pdf',
  },
  {
    title: 'ITR-B',
    description: 'For search and seizure cases (Chapter XIV-B).',
    pdf: '/forms/FORM-ITR_B_latest.pdf',
  },
];

export default function IncomeTaxReturnsPage() {
  return (
    <>
      <Breadcrumb current="Income Tax Returns" />

      <section className="itr-page">
        <div className="container">
          <SectionHeader
            eyebrow="Income Tax Returns"
            title="Income Tax Return Forms"
            subtitle="Select ITR-1 to ITR-7 to open blank PDF form."
          />

          <div className="itr-dashboard">
            <aside className="itr-sidebar">
              <div className="itr-summary-card">
                <span>Total ITR Forms</span>
                <strong>{returnForms.length}</strong>
                <p>Click Open PDF to view form or Download PDF to save form.</p>
              </div>
            </aside>

            <main className="itr-main">
              <div className="itr-toolbar">
                <div>
                  <h3>Available Return Forms</h3>
                  <p>Showing {returnForms.length} income tax return forms</p>
                </div>
              </div>

              <div className="itr-card-grid">
                {returnForms.map((form) => (
                  <article key={form.title} className="itr-card">
                    <div className="itr-card-top">
                      <span className="itr-badge">ITR Form</span>
                      <span className="itr-file-type">PDF</span>
                    </div>

                    <h3>{form.title}</h3>
                    <p>{form.description}</p>

                    <div className="itr-card-actions">
                      <a
                        href={form.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="itr-open-btn"
                      >
                        Open PDF
                      </a>

                      <a
                        href={form.pdf}
                        download
                        className="itr-download-btn"
                      >
                        Download PDF
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>

      <style>{`
        .itr-page {
          min-height: 100vh;
          padding: 36px 0 70px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 34%),
            linear-gradient(135deg, #020617 0%, #0f172a 48%, #111827 100%);
          color: #e5e7eb;
        }

        .itr-dashboard {
          display: grid;
          grid-template-columns: 310px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          margin-top: 28px;
        }

        .itr-sidebar {
          position: sticky;
          top: 18px;
          display: grid;
          gap: 18px;
        }

        .itr-summary-card,
        .itr-toolbar,
        .itr-card {
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.82);
          box-shadow: 0 20px 45px rgba(2, 6, 23, 0.35);
          backdrop-filter: blur(14px);
          border-radius: 22px;
        }

        .itr-summary-card {
          padding: 20px;
          background:
            linear-gradient(135deg, rgba(37, 99, 235, 0.24), rgba(15, 23, 42, 0.9));
        }

        .itr-summary-card span {
          display: block;
          color: #93c5fd;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .itr-summary-card strong {
          display: block;
          margin-top: 8px;
          color: #ffffff;
          font-size: 42px;
          line-height: 1;
        }

        .itr-summary-card p {
          margin: 10px 0 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
        }

        .itr-main {
          min-width: 0;
        }

        .itr-toolbar {
          padding: 18px 20px;
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .itr-toolbar h3 {
          margin: 0;
          color: #ffffff;
          font-size: 20px;
        }

        .itr-toolbar p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 14px;
        }

        .itr-card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .itr-card {
          padding: 20px;
          transition: all 0.22s ease;
          min-height: 230px;
          display: flex;
          flex-direction: column;
        }

        .itr-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.7);
          box-shadow: 0 24px 55px rgba(2, 6, 23, 0.52);
        }

        .itr-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .itr-badge {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.16);
          color: #bfdbfe;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
        }

        .itr-file-type {
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

        .itr-card h3 {
          margin: 0;
          color: #ffffff;
          font-size: 21px;
          line-height: 1.25;
        }

        .itr-card p {
          margin: 11px 0 18px;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.65;
          flex: 1;
        }

        .itr-card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .itr-open-btn,
        .itr-download-btn {
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

        .itr-open-btn {
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #ffffff;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.28);
        }

        .itr-open-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px rgba(37, 99, 235, 0.42);
        }

        .itr-download-btn {
          border: 1px solid rgba(148, 163, 184, 0.26);
          background: rgba(2, 6, 23, 0.36);
          color: #dbeafe;
        }

        .itr-download-btn:hover {
          border-color: #60a5fa;
          color: #ffffff;
        }

        @media (max-width: 1180px) {
          .itr-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 920px) {
          .itr-dashboard {
            grid-template-columns: 1fr;
          }

          .itr-sidebar {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .itr-page {
            padding: 24px 0 50px;
          }

          .itr-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .itr-card-grid {
            grid-template-columns: 1fr;
          }

          .itr-card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}