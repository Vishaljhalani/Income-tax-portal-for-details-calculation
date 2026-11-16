import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  keyHighlights,
  overviewMetrics,
  chapterComparison,
  sectionMapping,
} from "../data/actComparisonData";

const ActComparison = () => {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'chapters' | 'sections'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const navigate = useNavigate();

  const categories =
    activeTab === "chapters"
      ? ["All", ...new Set(chapterComparison.map((item) => item.category))]
      : activeTab === "sections"
      ? ["All", ...new Set(sectionMapping.map((item) => item.category))]
      : [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory("All");
    setSearchQuery("");
  };

  const goToAct1961Chapter = (chapterName) => {
    navigate("/acts-laws/income-tax-act-1961", { state: { targetChapter: chapterName } });
  };

  const goToAct2025Chapter = (chapterName) => {
    navigate("/acts-laws/income-tax-act-2025", { state: { targetChapter: chapterName } });
  };

  const filteredChapters = chapterComparison.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.act1961Chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.act2025Chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whatChanged.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.practicalEffect.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSections = sectionMapping.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sec1961.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sec2025.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.changeNote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Top Hero Banner */}
        <div style={styles.heroCard}>
          <div style={styles.heroBadge}>STATUTORY LAW COMPARISON</div>
          <h1 style={styles.title}>
            Income Tax Act, 1961 <span style={styles.vsText}>vs</span> Income Tax Act, 2025
          </h1>
          <p style={styles.subtitle}>
            Detailed legal analysis, chapter restructuring, and section-by-section mapping 
            effective from <strong>April 1, 2026 (Tax Year 2026–27)</strong>.
          </p>
        </div>

        {/* 4 Key Highlight Metric Cards */}
        <div style={styles.cardsGrid}>
          {keyHighlights.map((item) => (
            <div key={item.id} style={styles.highlightCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTag}>{item.tag}</span>
              </div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <div style={styles.comparisonBox}>
                <div style={styles.oldLine}>
                  <span style={styles.dotRed}></span> {item.oldValue}
                </div>
                <div style={styles.arrowDown}>↓</div>
                <div style={styles.newLine}>
                  <span style={styles.dotGreen}></span> {item.newValue}
                </div>
              </div>
              <p style={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Panel */}
        <div style={styles.mainPanel}>
          <div style={styles.toolbar}>
            <div style={styles.tabGroup}>
              <button
                style={activeTab === "overview" ? styles.activeTab : styles.tab}
                onClick={() => handleTabChange("overview")}
              >
                📊 Structural Overview
              </button>
              <button
                style={activeTab === "chapters" ? styles.activeTab : styles.tab}
                onClick={() => handleTabChange("chapters")}
              >
                📚 Chapter-by-Chapter Analysis
              </button>
              <button
                style={activeTab === "sections" ? styles.activeTab : styles.tab}
                onClick={() => handleTabChange("sections")}
              >
                🔍 Section Mapping (1961 → 2025)
              </button>
            </div>

            {activeTab !== "overview" && (
              <div style={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search section, chapter, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={styles.clearBtn}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {activeTab !== "overview" && (
            <div style={styles.filterBar}>
              <span style={styles.filterLabel}>Filter by Area:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={
                    selectedCategory === cat ? styles.activePill : styles.pill
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* TAB 1: Structural Overview */}
          {activeTab === "overview" && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: "20%" }}>Parameter</th>
                    <th style={{ ...styles.th, width: "26%" }}>Income Tax Act, 1961</th>
                    <th style={{ ...styles.th, width: "26%" }}>Income Tax Act, 2025</th>
                    <th style={{ ...styles.th, width: "28%" }}>Legal & Practical Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewMetrics.map((row, idx) => (
                    <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                      <td style={{ ...styles.td, fontWeight: "700", color: "#0f172a" }}>
                        {row.parameter}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.oldTextBox}>{row.act1961}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.newTextBox}>{row.act2025}</div>
                      </td>
                      <td style={{ ...styles.td, color: "#334155" }}>{row.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Detailed Chapter-by-Chapter Analysis */}
          {activeTab === "chapters" && (
            <div style={styles.chapterList}>
              {filteredChapters.length > 0 ? (
                filteredChapters.map((item, idx) => (
                  <div key={idx} style={styles.chapterCard}>
                    <div style={styles.chapterCardTop}>
                      <div style={styles.chapterTitleArea}>
                        <span style={styles.categoryBadge}>{item.category}</span>
                        <h3 style={styles.chapterTopic}>{item.topic}</h3>
                      </div>
                    </div>

                    <div style={styles.transitionBar}>
                      <button
                        style={styles.actPillOld}
                        onClick={() => goToAct1961Chapter(item.act1961Chapter)}
                        title="Open 1961 Act Chapter"
                      >
                        <span style={styles.pillLabel}>1961 Act:</span> {item.act1961Chapter} ↗
                      </button>

                      <div style={styles.transitionArrow}>
                        <span>➔</span>
                      </div>

                      <button
                        style={styles.actPillNew}
                        onClick={() => goToAct2025Chapter(item.act2025Chapter)}
                        title="Open 2025 Act Chapter"
                      >
                        <span style={styles.pillLabel}>2025 Act:</span> {item.act2025Chapter} ↗
                      </button>
                    </div>

                    <div style={styles.chapterDetailsGrid}>
                      <div style={styles.detailBoxOld}>
                        <div style={styles.detailHeadingOld}>⚖️ What Changed as per Law</div>
                        <p style={styles.detailText}>{item.whatChanged}</p>
                      </div>
                      <div style={styles.detailBoxNew}>
                        <div style={styles.detailHeadingNew}>💡 Practical Impact</div>
                        <p style={styles.detailText}>{item.practicalEffect}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  No matching chapters found for "<strong>{searchQuery}</strong>".
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Quick Section Mapping */}
          {activeTab === "sections" && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: "12%" }}>Area</th>
                    <th style={{ ...styles.th, width: "26%" }}>Provision / Topic</th>
                    <th style={{ ...styles.th, width: "18%" }}>1961 Act</th>
                    <th style={{ ...styles.th, width: "20%" }}>2025 Act</th>
                    <th style={{ ...styles.th, width: "24%" }}>Key Modification</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSections.length > 0 ? (
                    filteredSections.map((row, idx) => (
                      <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>{row.category}</span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: "600", color: "#0f172a" }}>
                          {row.topic}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.badgeOld}>{row.sec1961}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.badgeNew}>{row.sec2025}</span>
                        </td>
                        <td style={{ ...styles.td, color: "#475569" }}>{row.changeNote}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={styles.emptyState}>
                        No matching sections found for "<strong>{searchQuery}</strong>".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: "#f8fafc", // एकदम सॉफ्ट और मॉडर्न कॉर्पोरेट बैकग्राउंड
    minHeight: "100vh",
    padding: "32px 20px",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#1e293b",
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
  },
  heroCard: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // रिच डार्क स्लेट ग्रेडिएंट
    color: "#ffffff",
    padding: "36px 40px",
    borderRadius: "16px",
    marginBottom: "28px",
    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
  },
  heroBadge: {
    display: "inline-block",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    color: "#38bdf8",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.2px",
    padding: "5px 12px",
    borderRadius: "20px",
    marginBottom: "14px",
    border: "1px solid rgba(56, 189, 248, 0.3)",
  },
  title: {
    fontSize: "30px",
    fontWeight: "800",
    margin: "0 0 10px 0",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
  },
  vsText: {
    color: "#38bdf8",
    fontWeight: "600",
    fontSize: "24px",
    margin: "0 8px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: 0,
    maxWidth: "780px",
    lineHeight: "1.6",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "28px",
  },
  highlightCard: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    marginBottom: "12px",
  },
  cardTag: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#2563eb",
    backgroundColor: "#eff6ff",
    padding: "4px 10px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
  },
  cardTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 14px 0",
  },
  comparisonBox: {
    backgroundColor: "#f8fafc",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
    marginBottom: "14px",
  },
  oldLine: {
    fontSize: "13px",
    color: "#b91c1c",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  newLine: {
    fontSize: "13px",
    color: "#15803d",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  arrowDown: {
    fontSize: "12px",
    color: "#94a3b8",
    paddingLeft: "16px",
    margin: "4px 0",
  },
  dotRed: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    display: "inline-block",
  },
  dotGreen: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    display: "inline-block",
  },
  cardDesc: {
    fontSize: "13.5px",
    color: "#64748b",
    margin: 0,
    lineHeight: "1.5",
  },
  mainPanel: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "20px",
    marginBottom: "20px",
  },
  tabGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 18px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  activeTab: {
    padding: "10px 18px",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
  },
  searchWrapper: {
    position: "relative",
    width: "340px",
    maxWidth: "100%",
  },
  searchInput: {
    width: "100%",
    padding: "11px 36px 11px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s",
  },
  clearBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "24px",
  },
  filterLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    marginRight: "6px",
  },
  pill: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  activePill: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #0f172a",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    fontWeight: "700",
    padding: "14px 18px",
    borderBottom: "1px solid #cbd5e1",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
    lineHeight: "1.6",
  },
  evenRow: { backgroundColor: "#ffffff" },
  oddRow: { backgroundColor: "#fafbfc" },
  oldTextBox: {
    color: "#b91c1c",
    backgroundColor: "#fff5f5",
    padding: "8px 12px",
    borderRadius: "8px",
    borderLeft: "3px solid #ef4444",
    fontSize: "13.5px",
  },
  newTextBox: {
    color: "#15803d",
    backgroundColor: "#f0fdf4",
    padding: "8px 12px",
    borderRadius: "8px",
    borderLeft: "3px solid #22c55e",
    fontSize: "13.5px",
    fontWeight: "500",
  },
  chapterList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  chapterCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
    transition: "border-color 0.2s",
  },
  chapterCardTop: {
    marginBottom: "16px",
  },
  chapterTitleArea: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    fontSize: "11px",
    fontWeight: "700",
    color: "#1d4ed8",
    backgroundColor: "#eff6ff",
    padding: "4px 10px",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  chapterTopic: {
    fontSize: "19px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  transitionBar: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #f1f5f9",
    padding: "14px 18px",
    borderRadius: "10px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  actPillOld: {
    backgroundColor: "#fff5f5",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "9px 16px",
    borderRadius: "8px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  actPillNew: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    padding: "9px 16px",
    borderRadius: "8px",
    fontSize: "13.5px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pillLabel: {
    fontWeight: "500",
    opacity: 0.8,
  },
  transitionArrow: {
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: "14px",
  },
  chapterDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
  },
  detailBoxOld: {
    backgroundColor: "#fafaf9",
    border: "1px solid #e7e5e4",
    borderRadius: "10px",
    padding: "16px 18px",
  },
  detailHeadingOld: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#78716c",
    marginBottom: "8px",
  },
  detailBoxNew: {
    backgroundColor: "#f4fbf7",
    border: "1px solid #d1fae5",
    borderRadius: "10px",
    padding: "16px 18px",
  },
  detailHeadingNew: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#047857",
    marginBottom: "8px",
  },
  detailText: {
    fontSize: "14px",
    color: "#334155",
    margin: 0,
    lineHeight: "1.6",
  },
  badgeOld: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "12.5px",
  },
  badgeNew: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "12.5px",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px",
    color: "#64748b",
    fontSize: "15px",
  },
};

export default ActComparison;