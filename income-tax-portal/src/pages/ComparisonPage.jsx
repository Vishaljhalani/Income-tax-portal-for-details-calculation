import Breadcrumb from '../components/Breadcrumb';
import SectionHeader from '../components/SectionHeader';

const rows = [
  ['Legal Framework', 'New structured regime presentation', 'Legacy structure'],
  ['Navigation Style', 'Modern grouped chapter blocks', 'Traditional act reference format'],
  ['Website Use', 'Future-ready digital presentation', 'Historical statutory reference'],
  ['User Experience', 'Cleaner modular content presentation', 'Classic documentation style'],
];

export default function ComparisonPage() {
  return (
    <>
      <Breadcrumb current="Acts & Laws / Comparison 2025 vs 1961" />

      <section className="content-section">
        <div className="container">
          <SectionHeader
            eyebrow="Comparison"
            title="Income Tax Act 2025 vs Income Tax Act 1961"
            subtitle="A clean comparison layout for visual understanding."
          />

          <div className="table-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Basis</th>
                  <th>Income Tax Act 2025</th>
                  <th>Income Tax Act 1961</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}