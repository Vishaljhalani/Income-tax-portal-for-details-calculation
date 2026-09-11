import Breadcrumb from '../components/Breadcrumb';
import SectionHeader from '../components/SectionHeader';
import InfoCard from '../components/InfoCard';
import { helpItems } from '../data/siteData';

export default function HelpPage() {
  return (
    <>
      <Breadcrumb current="Help" />

      <section className="content-section">
        <div className="container">
          <SectionHeader
            eyebrow="Help"
            title="Support & Assistance"
            subtitle="Contact and grievance blocks displayed in a clean support page format."
          />

          <div className="card-grid">
            {helpItems.map((item) => (
              <InfoCard
                key={item.title}
                title={item.title}
                description={item.description}
                badge="Help"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}