import Breadcrumb from '../components/Breadcrumb';
import SectionHeader from '../components/SectionHeader';
import InfoCard from '../components/InfoCard';
import { lawCards } from '../data/siteData';

export default function ActsLawsPage() {
  return (
    <>
      <Breadcrumb current="Acts & Laws" />

      <section className="content-section">
        <div className="container">
          <SectionHeader
            eyebrow="Acts & Laws"
            title="Legal Navigation"
            subtitle="Choose the law reference page you want to open."
          />

          <div className="card-grid">
            {lawCards.map((item) => (
              <InfoCard
                key={item.title}
                title={item.title}
                description={item.description}
                route={item.route}
                badge="Law"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}