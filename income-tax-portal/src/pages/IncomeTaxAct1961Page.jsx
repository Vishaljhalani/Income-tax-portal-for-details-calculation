import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import SectionHeader from "../components/SectionHeader";
import { act1961Chapters } from "../data/act1961Chapters";
import { getAllSections } from "../components/flat";
import { searchSections } from "../components/searchSections";

export default function IncomeTaxAct1961Page() {
  const [openChapter, setOpenChapter] = useState(null);
const [query, setQuery] = useState("");

  const toggleChapter = (index) => {
    setOpenChapter(openChapter === index ? null : index);
  };
const allSections = getAllSections(act1961Chapters);
const filteredSections = searchSections(allSections, query);
  return (
    <>
      <Breadcrumb current="Acts & Laws / Income Tax Act 1961" />

      <section className="content-section">
        <div className="container">
          <SectionHeader
            eyebrow="Income Tax Act 1961"
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
    act1961Chapters.map((chapter, index) => (
      <div key={chapter.chapter} className="chapter-card">
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

          <div>
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
}
  .search-input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #d8e0ef;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 15px;
}

.chapter-header {
  padding: 18px 22px;
  background: #f5f8fd;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.Section-link:hover {
  background: #f8fbff;
}

            `}</style>
        </div>
      </section>
    </>
  );
}
