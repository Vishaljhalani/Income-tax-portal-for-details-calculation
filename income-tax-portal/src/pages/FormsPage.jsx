import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import SectionHeader from '../components/SectionHeader';
import InfoCard from '../components/InfoCard';
import { formsItems } from '../data/siteData';

export default function FormsPage() {
  return (
    <>
      <Breadcrumb current="Income Tax Forms" />

      <section className="content-section">
        <div className="container">
          <SectionHeader
            eyebrow="Income Tax Forms"
            title="Forms Section"
            subtitle="Dedicated professional page for forms and related downloads."
          />

          <div className="card-grid">
            {formsItems.map((item) => {
              const card = (
                <InfoCard
                  title={item.title}
                  description={item.description}
                  badge="Forms"
                />
              );

              return item.path ? (
                <Link
                  key={item.title}
                  to={item.path}
                  className="card-link"
                >
                  {card}
                </Link>
              ) : (
                <div key={item.title}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}