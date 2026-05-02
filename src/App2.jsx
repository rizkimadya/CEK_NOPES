import { useState, useEffect } from "react";

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f5f5f5",
    color: "#1a1a1a",
    fontFamily: "'Poppins', 'Courier New', monospace",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: "1px solid #e0e0e0",
    padding: "28px 40px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#fff",
  },
  badge: {
    background: "#ff6b35",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "2px",
    padding: "4px 10px",
    borderRadius: "4px",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "500",
    color: "#1a1a1a",
    letterSpacing: "0.5px",
  },
  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#999",
    letterSpacing: "1px",
  },
  main: {
    flex: 1,
    width: "80%",
    margin: "0 auto",
    padding: "40px 0",
    boxSizing: "border-box",
  },
  card: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    letterSpacing: "2px",
    color: "#999",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  textarea: {
    width: "100%",
    background: "#fafafa",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    color: "#1a1a1a",
    fontFamily: "'Poppins', 'Courier New', monospace",
    fontSize: "13px",
    padding: "14px",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.7",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btnPrimary: {
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 32px",
    fontSize: "13px",
    fontFamily: "'Poppins', 'Courier New', monospace",
    fontWeight: "700",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
  },
  btnDanger: {
    background: "transparent",
    color: "#ff4444",
    border: "1px solid #ff4444",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "12px",
    fontFamily: "'Poppins', 'Courier New', monospace",
    cursor: "pointer",
    letterSpacing: "0.5px",
    transition: "background 0.2s",
  },
  statsRow: {
    display: "flex",
    gap: "16px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  statChip: (color) => ({
    background: "#fafafa",
    border: `1px solid ${color}55`,
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "13px",
    color: color,
    fontWeight: "600",
  }),
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  },
  th: {
    background: "#fafafa",
    color: "#999",
    letterSpacing: "1.5px",
    fontSize: "10px",
    textTransform: "uppercase",
    padding: "12px 14px",
    textAlign: "left",
    borderBottom: "1px solid #e0e0e0",
    whiteSpace: "nowrap",
  },
  tdBase: {
    padding: "12px 14px",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
  },
  loadingWrap: {
    textAlign: "center",
    padding: "60px 0",
    color: "#aaa",
    letterSpacing: "2px",
    fontSize: "12px",
  },
  dot: (delay) => ({
    display: "inline-block",
    animation: `blink 1.2s ${delay}s infinite`,
  }),
  textarea: {
    width: "100%",
    background: "#fafafa",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    color: "#1a1a1a",
    fontSize: "18px",  // ← ubah angka ini sesuai selera, default sekarang 13px
    padding: "14px",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.7",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
};

const COLS = ["#", "No. Pesanan", "Status"];

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataNopes, setDataNopes] = useState([]);
  const [fetchReady, setFetchReady] = useState(false);
  const [focusArea, setFocusArea] = useState(false);

  useEffect(() => {
    fetch("/data/nopes.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDataNopes(data);
      })
      .catch((err) => console.error("Error fetch nopes.json:", err))
      .finally(() => setFetchReady(true));
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    const list = query
      .split(/[\n,]+/)
      .map((r) => r.trim())
      .filter((r) => r);

    const resultsArray = list.map((val) => {
      const last4 = val.slice(-4).toUpperCase();
      const found = dataNopes.find(
        (item) => item.no_pes && item.no_pes.slice(-4).toUpperCase() === last4
      );
      return found
        ? { input: val, found: true, no_pes: found.no_pes }
        : { input: val, found: false };
    });

    setResults(resultsArray);
    setLoading(false);
  };

  const copyNotFound = () => {
    const text = results
      .filter((r) => !r.found)
      .map((r) => r.input)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("📋 Nomor yang tidak ditemukan berhasil disalin!");
  };

  const foundCount = results.filter((r) => r.found).length;
  const notFoundCount = results.filter((r) => !r.found).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body { background: #f5f5f5; }
        @keyframes blink { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .result-row { animation: fadeIn 0.25s ease both; }
        textarea:focus { border-color: #ff6b35 !important; }
        .btn-primary:hover { opacity: 0.85; transform: scale(0.98); }
        .btn-danger:hover { background: #ff444422; }
        tr:hover td { background: #fafafa; }
      `}</style>

      <div style={styles.root}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.badge}>NoPes</span>
          <div>
            <h1 style={styles.title}>Cek Nomor Pesanan</h1>
            <p style={styles.subtitle}>Solusi cepat untuk pabom 💩</p>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "14px", color: "#bbb", letterSpacing: "1px" }}>
            {fetchReady
              ? `${dataNopes.length} data loaded`
              : "loading data..."}
          </div>
        </div>

        <div style={styles.main}>
          {/* Input card */}
          <div style={styles.card}>
            <label style={styles.label}>Masukkan nomor pesanan</label>
            <textarea
              rows={8}
              style={styles.textarea}
              placeholder={"Satu per baris atau pisah dengan koma\nContoh: 580412921456920201\natau cukup 4 angka terakhir: 0201"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocusArea(true)}
              onBlur={() => setFocusArea(false)}
            />
            <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                className="btn-primary"
                style={{ ...styles.btnPrimary, opacity: !fetchReady ? 0.5 : 1, cursor: !fetchReady ? "not-allowed" : "pointer" }}
                onClick={handleSearch}
                disabled={!fetchReady}
              >
                🔍 CARI
              </button>
              {notFoundCount > 0 && (
                <button className="btn-danger" style={styles.btnDanger} onClick={copyNotFound}>
                  📋 Salin yang tidak ditemukan ({notFoundCount})
                </button>
              )}
            </div>

            {/* Stats */}
            {results.length > 0 && (
              <div style={styles.statsRow}>
                <div style={styles.statChip("#aaa")}>
                  Total: {results.length}
                </div>
                <div style={styles.statChip("#4caf50")}>
                  ✅ Ditemukan: {foundCount}
                </div>
                <div style={styles.statChip("#ff4444")}>
                  ❌ Tidak ditemukan: {notFoundCount}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {loading && (
            <div style={styles.loadingWrap}>
              MENCARI
              <span style={styles.dot(0)}>.</span>
              <span style={styles.dot(0.2)}>.</span>
              <span style={styles.dot(0.4)}>.</span>
            </div>
          )}

          {results.length > 0 && !loading && (
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Input</th>
                    <th style={styles.th}>No. Pesanan (data)</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={idx} className="result-row" style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td style={{ ...styles.tdBase, color: "#bbb", width: "40px" }}>{idx + 1}</td>
                      <td style={{ ...styles.tdBase, color: "#555", fontFamily: "'Poppins', monospace" }}>
                        {r.input}
                      </td>
                      <td style={{ ...styles.tdBase, color: r.found ? "#1a1a1a" : "#ccc" }}>
                        {r.found ? r.no_pes : "—"}
                      </td>
                      <td style={{ ...styles.tdBase }}>
                        {r.found ? (
                          <span style={{
                            background: "#e8f5e9",
                            color: "#2e7d32",
                            padding: "3px 10px",
                            borderRadius: "4px",
                            fontSize: "14px",
                            letterSpacing: "1px",
                          }}>✅ ADA</span>
                        ) : (
                          <span style={{
                            background: "#ffebee",
                            color: "#c62828",
                            padding: "3px 10px",
                            borderRadius: "4px",
                            fontSize: "14px",
                            letterSpacing: "1px",
                          }}>❌ TIDAK ADA</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
