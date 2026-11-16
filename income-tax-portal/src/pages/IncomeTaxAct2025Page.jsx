import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import SectionHeader from "../components/SectionHeader";
import { act2025Chapters } from "../data/act2025Chapters";
import { getAllSections } from "../components/flat";
import { searchSections } from "../components/searchSections";

export default function IncomeTaxAct2025Page() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openChapter, setOpenChapter] = useState(null);
  const [query, setQuery] = useState("");

  // तुलना पेज से यदि कोई टारगेट चैप्टर पास किया गया हो तो उसे ऑटो-ओपन करें
  const targetChapter = location.state?.targetChapter;

  useEffect(() => {
    if (targetChapter) {
      const index = act2025Chapters.findIndex((ch) =>
        ch.chapter.toLowerCase().includes(targetChapter.toLowerCase().trim())
      );
      if (index !== -1) {
        setOpenChapter(index);
        setTimeout(() => {
          const element = document.getElementById(`chapter-2025-${index}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  }, [targetChapter]);

  const toggleChapter = (index) => {
    setOpenChapter(openChapter === index ? null : index);
  };

  const allSections = getAllSections(act2025Chapters);
  const filteredSections = searchSections(allSections, query);

  return (
    <>
      <Breadcrumb current="Acts & Laws / Income Tax Act 2025" />

      <section className="content-section">
        <div className="container">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="back-btn"
          >
            ← Back to Comparison
          </button>

          <SectionHeader
            eyebrow="Income Tax Act 2025"
            title="Chapter-wise Structure"
            subtitle="Browse chapters and open individual Sections."
          />
          
          <input
            type="text"
            placeholder="Search Section number, title, chapter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />

          <div className="chapters-container">
            {query ? (
              filteredSections.map((section) => (
                <a
                  key={section.Section}
                  href={section.pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="Section-link"
                >
                  Section {section.Section} - {section.title}
                  <div className="chapter-topic">
                    {section.chapter}
                  </div>
                </a>
              ))
            ) : (
              act2025Chapters.map((chapter, index) => (
                <div 
                  key={chapter.chapter} 
                  id={`chapter-2025-${index}`}
                  className={`chapter-card ${openChapter === index ? "active-card" : ""}`}
                >
                  <div
                    className="chapter-header"
                    onClick={() => toggleChapter(index)}
                  >
                    <div>
                      <strong>{chapter.chapter}</strong>

                      <div className="chapter-topic">
                        {chapter.topic}
                      </div>

                      <div className="chapter-count">
                        {chapter.annexure.length} Sections
                      </div>
                    </div>

                    <div className="toggle-icon">
                      {openChapter === index ? "−" : "+"}
                    </div>
                  </div>

                  {openChapter === index && (
                    <div className="chapter-Sections">
                      {chapter.annexure.map((Section) => (
                        <a
                          key={Section.Section}
                          href={Section.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="Section-link"
                        >
                          Section {Section.Section} - {Section.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <style>{`
            .back-btn {
              background-color: #f8fafc;
              border: 1px solid #cbd5e1;
              color: #334155;
              padding: 9px 16px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              margin-bottom: 20px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: all 0.2s ease;
            }
            .back-btn:hover {
              background-color: #f1f5f9;
              border-color: #94a3b8;
            }

            .chapters-container {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .chapter-card {
              border: 1px solid #d8e0ef;
              border-radius: 12px;
              overflow: hidden;
              background: #fff;
              transition: all 0.2s ease;
            }

            .chapter-card:hover {
              box-shadow: 0 6px 16px rgba(0,0,0,0.06);
            }

            .active-card {
              border-color: #3b82f6;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
            }

            .search-input {
              width: 100%;
              padding: 14px 18px;
              border: 1px solid #d8e0ef;
              border-radius: 12px;
              margin-bottom: 20px;
              font-size: 15px;
              outline: none;
              transition: border-color 0.2s;
            }
            .search-input:focus {
              border-color: #3b82f6;
            }

            .chapter-header {
              padding: 18px 22px;
              background: #f5f8fd;
              cursor: pointer;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .chapter-header:hover {
              background: #edf3fc;
            }

            .chapter-count {
              margin-top: 6px;
              font-size: 13px;
              color: #0d4ea6;
              font-weight: 600;
            }

            .chapter-topic {
              margin-top: 4px;
              color: #6b7280;
              font-size: 14px;
            }

            .chapter-Sections {
              padding: 10px 0;
            }

            .Section-link {
              display: block;
              padding: 14px 22px;
              text-decoration: none;
              color: #0d4ea6;
              border-top: 1px solid #eef2f7;
              transition: all 0.15s ease;
            }

            .Section-link:hover {
              background: #f8fbff;
              color: #083b82;
            }

            .toggle-icon {
              font-size: 18px;
              font-weight: bold;
              color: #475569;
            }
          `}</style>
        </div>
      </section>
    </>
  );
}