import Breadcrumb from '../components/Breadcrumb';
import SectionHeader from '../components/SectionHeader';
import InfoCard from '../components/InfoCard';
import { aboutItems } from '../data/siteData';

export default function AboutPage() {
  return (
    <>
      <Breadcrumb current="About Us" />

      <section className="content-section">
        <div className="container">
          <SectionHeader
            eyebrow="About Us"
            title="Project Overview"
            subtitle="A formal and professional presentation of the website's purpose and capabilities."
          />

          <div className="card-grid">
            {aboutItems.map((item) => (
              <InfoCard
                key={item.title}
                title={item.title}
                description={item.description}
                badge="About"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}