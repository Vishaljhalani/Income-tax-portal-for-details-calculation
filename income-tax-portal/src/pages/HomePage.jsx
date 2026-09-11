import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import InfoCard from '../components/InfoCard';
import { homeHighlights } from '../data/siteData';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <span className="hero-tag">Official Style Tax Information Interface</span>
            <h2>Professional Multi-Page Income Tax Website in React.js</h2>
            <p>
              A modern, responsive and structured portal-style website designed for tax information,
              acts, forms, references and support pages.
            </p>

            <div className="hero-actions">
              <a href="#home-services" className="btn btn-primary">
                Explore Home Modules
              </a>

              {/* 🔥 NEW BUTTON */}
              <button
                className="btn btn-light"
                onClick={() => setShowModal(true)}
              >
                Circulars / Notifications
              </button>
            </div>
          </div>

          <div className="hero-panel" id="featured-panel">
            <div className="panel-header">Portal Highlights</div>
            <ul>
              <li>Government inspired professional UI</li>
              <li>React Router based multi-page navigation</li>
              <li>Responsive cards, sections and content layout</li>
              <li>Expandable legal content architecture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🔥 MODAL START */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Notifications / Circulars</h3>

            <ul>
              <li>
                <a href="/pdfs/notice1.pdf" target="_blank" rel="noreferrer">
                  Income Tax Circular 1
                </a>
              </li>
              <li>
                <a href="/pdfs/notice2.pdf" target="_blank" rel="noreferrer">
                  Income Tax Circular 2
                </a>
              </li>
            </ul>

            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
      {/* 🔥 MODAL END */}

      <section className="content-section">
        <div className="container">
          <SectionHeader
            eyebrow="Home Page"
            title="Core Modules"
            subtitle="These options open as professional content blocks for the main home area."
          />

          <div className="card-grid" id="home-services">
            {homeHighlights.map((item) => (
              <InfoCard
                key={item.title}
                title={item.title}
                description={item.description}
                badge="Home"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="content-section alt-bg">
        <div className="container two-column-section">
          <div className="feature-box">
            <h3>Structured Content Delivery</h3>
            <p>
              The homepage is designed with an official-portal feel, combining a clean hero section,
              easy card navigation and formal content blocks.
            </p>
          </div>

          <div className="feature-box">
            <h3>Ready for Future Expansion</h3>
            <p>
              You can later add login, notifications API, PDF downloads, search, advanced calculator,
              dynamic forms and admin data management.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* 🔥 Inline styles (no CSS issue) */
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
  },
  modal: {
    background: '#fff',
    padding: '20px',
    width: '400px',
    margin: '10% auto',
    borderRadius: '8px',
  },
};