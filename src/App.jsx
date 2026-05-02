import { useState, useEffect } from "react";

const S = {
  root: {
    minHeight: "100vh",
    background: "#f5f5f5",
    color: "#1a1a1a",
    fontFamily: "'Poppins', 'Poppins', Poppins",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: "1px solid #e0e0e0",
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#fff",
  },
  badge: {
    background: "#ff6b35",
    color: "#fff",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "2px",
    padding: "4px 10px",
    borderRadius: "4px",
    textTransform: "uppercase",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: "500", color: "#1a1a1a" },
  subtitle: { margin: 0, fontSize: "14px", color: "#999", letterSpacing: "1px" },
  dataCount: { marginLeft: "auto", fontSize: "13px", color: "#bbb", letterSpacing: "1px" },
  main: { flex: 1, width: "70%", margin: "0 auto", padding: "32px 0", boxSizing: "border-box" },
  card: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "28px",
    marginBottom: "20px",
  },
  label: {
    display: "block", fontSize: "13px", letterSpacing: "2px",
    color: "#999", textTransform: "uppercase", marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    background: "#fafafa",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontFamily: "Poppins",
    color: "#1a1a1a",
    fontSize: "18px",
    padding: "14px",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.7",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btnRow: { marginTop: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" },
  btnPrimary: {
    background: "#ff6b35", color: "#fff", border: "none", borderRadius: "8px",
    padding: "12px 32px", fontSize: "13px",
    fontFamily: "'Poppins', 'Poppins', Poppins",
    fontWeight: "700", letterSpacing: "1px", cursor: "pointer",
  },
  btnRefresh: {
    background: "transparent", color: "#888", border: "1px solid #ddd",
    borderRadius: "8px", padding: "12px 18px", fontSize: "14px",
    fontFamily: "Poppins", cursor: "pointer", letterSpacing: "0.5px",
    display: "flex", alignItems: "center", gap: "6px",
  },
  btnDanger: {
    background: "transparent", color: "#e53935", border: "1px solid #e53935",
    borderRadius: "8px", padding: "13px 18px", fontSize: "14px",
    fontFamily: "'Poppins', 'Poppins', Poppins", cursor: "pointer", letterSpacing: "0.5px",
  },
  statsRow: { display: "flex", gap: "12px", marginTop: "18px", flexWrap: "wrap" },
  chip: (color, bg) => ({
    background: bg, border: `1px solid ${color}44`,
    borderRadius: "8px", padding: "8px 16px",
    fontSize: "14px", color: color, fontWeight: "600",
  }),
  groupCard: (found) => ({
    background: "#fff",
    border: `1px solid ${found ? "#e0e0e0" : "#ffcdd2"}`,
    borderLeft: `4px solid ${found ? "#ff6b35" : "#e53935"}`,
    borderRadius: "8px",
    marginBottom: "16px",
    overflow: "hidden",
  }),
  groupHeader: (found) => ({
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px 18px",
    background: found ? "#98dc77" : "#f9bebe",
    borderBottom: found ? "1px solid #ffe8df" : "1px solid #ffcdd2",
  }),
  groupNoPes: { fontWeight: "700", fontSize: "14px", letterSpacing: "0.5px", flex: 1 },
  statusBadge: (found) => ({
    fontSize: "13px", fontWeight: "700", letterSpacing: "1px",
    padding: "3px 10px", borderRadius: "4px",
    background: found ? "#e8f5e9" : "#ffebee",
    color: found ? "#2e7d32" : "#c62828",
  }),
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    background: "#fafafa", color: "#888", letterSpacing: "1px",
    fontSize: "13px", textTransform: "uppercase",
    padding: "10px 18px", textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
  },
  td: { padding: "10px 18px", borderBottom: "1px solid #f9f9f9", verticalAlign: "top" },
  notFoundRow: { padding: "14px 18px", color: "#c62828", fontSize: "14px", fontStyle: "italic" },
  loadingWrap: { textAlign: "center", padding: "50px 0", color: "#bbb", fontSize: "14px", letterSpacing: "2px" },
};

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataNopes, setDataNopes] = useState([]);
  const [fetchReady, setFetchReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setFetchReady(false);
    setRefreshing(true);
    setQuery("");
    setResults([]);
    fetch("/data/nopes.json?t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDataNopes(data);
      })
      .catch((err) => console.error("Error fetch nopes.json:", err))
      .finally(() => {
        setFetchReady(true);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    const list = query
      .split(/[\n,]+/)
      .map((r) => r.trim())
      .filter((r) => r);

    const unique = [...new Set(list)];

    const resultsArray = unique.map((val) => {
      const last4 = val.slice(-4).toUpperCase();
      const matched = dataNopes.filter(
        (item) => item.no_pes && item.no_pes.slice(-4).toUpperCase() === last4
      );
      if (matched.length > 0) {
        return { input: val, found: true, no_pes: matched[0].no_pes, items: matched };
      } else {
        return { input: val, found: false };
      }
    });

    setResults(resultsArray);
    setLoading(false);
  };

  const copyNotFound = () => {
    const text = results.filter((r) => !r.found).map((r) => r.input).join("\n");
    navigator.clipboard.writeText(text);
    alert("Nomor yang tidak ditemukan berhasil disalin!");
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .fade-up { animation: fadeUp 0.2s ease both; }
        .spinning { animation: spin 0.8s linear infinite; display: inline-block; }
        textarea:focus { border-color: #ff6b35 !important; box-shadow: 0 0 0 3px #ff6b3520; }
        .btn-primary:hover { opacity: 0.87; transform: scale(0.98); }
        .btn-danger:hover { background: #ffebee; }
        .btn-refresh:hover { background: #f5f5f5; border-color: #bbb !important; color: #555 !important; }
        tbody tr:hover td { background: #fffaf8; }
      `}</style>

      <div style={S.root}>
        <div style={S.header}>
          <span style={S.badge}>NoPes</span>
          <div>
            <h1 style={S.title}>Cek Nomor Pesanan</h1>
            <p style={S.subtitle}>Solusi cepat untuk pabom 💩</p>
          </div>
          <div style={S.dataCount}>
            {fetchReady ? `${dataNopes.length} data loaded` : "loading..."}
          </div>
        </div>

        <div style={S.main}>
          <div style={S.card}>
            <label style={S.label}>Masukkan nomor pesanan</label>
            <textarea
              rows={10}
              style={S.textarea}
              placeholder={"Satu per baris atau pisah koma\nContoh: 583825549674317374\natau 4 angka terakhir: 7374"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div style={S.btnRow}>
              <button
                className="btn-primary"
                style={{ ...S.btnPrimary, opacity: !fetchReady ? 0.5 : 1, cursor: !fetchReady ? "not-allowed" : "pointer" }}
                onClick={handleSearch}
                disabled={!fetchReady}
              >
                CARI
              </button>

              {/* Tombol Refresh */}
              <button
                className="btn-refresh"
                style={{ ...S.btnRefresh, opacity: refreshing ? 0.6 : 1 }}
                onClick={loadData}
                disabled={refreshing}
                title="Refresh data dari nopes.json"
              >
                <span className={refreshing ? "spinning" : ""}>↻</span>
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </button>

              {notFoundCount > 0 && (
                <button className="btn-danger" style={S.btnDanger} onClick={copyNotFound}>
                  Salin tidak ditemukan ({notFoundCount})
                </button>
              )}
            </div>

            {results.length > 0 && (
              <div style={S.statsRow}>
                <div style={S.chip("#888", "#f5f5f5")}>Total: {results.length}</div>
                <div style={S.chip("#2e7d32", "#e8f5e9")}>Ditemukan: {foundCount}</div>
                <div style={S.chip("#c62828", "#ffebee")}>Tidak ditemukan: {notFoundCount}</div>
              </div>
            )}
          </div>

          {loading && (
            <div style={S.loadingWrap}>
              MENCARI
              <span style={{ animation: "blink 1.2s 0s infinite", display: "inline-block" }}>.</span>
              <span style={{ animation: "blink 1.2s 0.2s infinite", display: "inline-block" }}>.</span>
              <span style={{ animation: "blink 1.2s 0.4s infinite", display: "inline-block" }}>.</span>
            </div>
          )}

          {!loading && results.map((r, idx) => (
            <div
              key={idx}
              className="fade-up"
              style={{ ...S.groupCard(r.found), animationDelay: `${idx * 0.04}s` }}
            >
              <div style={S.groupHeader(r.found)}>
                <div style={S.groupNoPes}>
                  {r.found ? r.no_pes : r.input}
                </div>
                <span style={S.statusBadge(r.found)}>
                  {r.found ? `ADA · ${r.items.length} produk` : "TIDAK ADA"}
                </span>
              </div>

              {r.found ? (
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>#</th>
                      <th style={S.th}>Nama Produk</th>
                      <th style={{ ...S.th, textAlign: "right" }}>Harga</th>
                      <th style={{ ...S.th, textAlign: "center" }}>Qty</th>
                      <th style={S.th}>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ ...S.td, color: "#ccc", width: "32px" }}>{i + 1}</td>
                        <td style={{ ...S.td, color: "#1a1a1a", maxWidth: "380px" }}>
                          {item.nama_produk}
                        </td>
                        <td style={{ ...S.td, textAlign: "right", color: "#ff6b35", fontWeight: "500", whiteSpace: "nowrap" }}>
                          Rp {item.harga}
                        </td>
                        <td style={{ ...S.td, textAlign: "center", color: "#555" }}>
                          {item.qty}
                        </td>
                        <td style={{ ...S.td, color: "#999", whiteSpace: "nowrap" }}>
                          {item.tanggal_co}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={S.notFoundRow}>
                  Nomor pesanan tidak ditemukan dalam database
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
