"use client";

import { useEffect, useState } from "react";

interface PredictionEntry {
  id: string;
  model: string;
  analyzedOn: string;
  status: string;
}

export default function AccountPage() {
  const [history, setHistory] = useState<PredictionEntry[]>([]);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiEntry, setAiEntry] = useState<PredictionEntry | null>(null);
  const [aiText, setAiText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    try {
      const storedHistory = JSON.parse(localStorage.getItem('prediction_history') || '[]');
      // Reverse history so latest is on top
      setHistory(storedHistory.reverse());
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const handleDelete = (index: number) => {
    const newHistory = [...history];
    const actualIndex = history.length - 1 - index;
    newHistory.splice(index, 1);
    setHistory(newHistory);
    
    try {
        const storedHistory = JSON.parse(localStorage.getItem('prediction_history') || '[]');
        storedHistory.splice(actualIndex, 1);
        localStorage.setItem('prediction_history', JSON.stringify(storedHistory));
    } catch (e) {}
  };

  const handleDownload = (entry: PredictionEntry) => {
    alert(`Downloading report for ${entry.id}...`);
  };

  const handleShare = async (entry: PredictionEntry) => {
    const shareData = {
        title: `SmartPredict - ${entry.id} Analysis`,
        text: `Check out the ${entry.model} report for ${entry.id} analyzed on ${entry.analyzedOn}.`,
        url: window.location.origin,
    };
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {}
    } else {
        navigator.clipboard.writeText(window.location.origin).then(() => {
            alert('Dashboard Link copied to clipboard!');
        });
    }
  };

  const handleAskAI = (entry: PredictionEntry) => {
    setAiEntry(entry);
    setAiModalOpen(true);
    setIsTyping(true);
    setAiText("");
    
    // Simulate streaming typing effect
    const fullText = `I have analyzed the ${entry.model} report for Asset **${entry.id}**.

The prediction returned a status of **${entry.status}**. 
This indicates that the key operational metrics—including Rotational Speed, Torque, and Process Temperature—were processed efficiently.

### **Why this matters:**
No critical anomalies or data drifts were detected during this window. The equipment is running smoothly. Wait time for subsequent review is fully dependent on your standard preventative maintenance schedule.

### **Recommendations:**
1. Continue tracking Torque variations during startup sequences.
2. Maintain the current operational loads.
3. Review XAI Insights in the Dashboard Command Center if you notice manual drift.`;

    let i = 0;
    const interval = setInterval(() => {
        setAiText(fullText.substring(0, i));
        i += 2;
        if (i > fullText.length) {
            clearInterval(interval);
            setAiText(fullText); // ensure it completes perfectly
            setIsTyping(false);
        }
    }, 15);
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem", position: "relative" }}>
      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "2.3rem", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", color: "#0f172a" }}>
          ACCOUNT OVERVIEW
        </h1>
        <button style={{ backgroundColor: "rgba(239, 68, 68, 0.05)", color: "#ef4444", border: "1px solid #fca5a5", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s ease" }}>
          <span style={{ textDecoration: "underline" }}>Logout Session</span>
        </button>
      </div>

      {/* ACTIVE PROFILE SECTION */}
      <section className="card-section" style={{ marginBottom: "2rem", border: "1px solid #f1f5f9", borderRadius: "14px", padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", background: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              ACTIVE PROFILE
            </p>
            <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a", fontWeight: 800 }}>SGRAHUL447</h2>
            <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
              sgrahul447@gmail.com
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "inline-block", padding: "0.3rem 0.8rem", borderRadius: "999px", background: "#dcfce7", color: "#16a34a", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              VERIFIED SESSION
            </div>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "#cbd5e1", fontStyle: "italic" }}>
              Data Secured by MongoDB Atlas Cloud
            </p>
          </div>
        </div>
      </section>

      {/* PREDICTION HISTORY LOG SECTION */}
      <section className="card-section" style={{ border: "1px solid #f1f5f9", borderRadius: "14px", padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", background: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em" }}>PREDICTION HISTORY LOG</h3>
          <div style={{ background: "#0f172a", color: "white", padding: "0.25rem 0.6rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 800 }}>
            {history.length} {history.length === 1 ? 'ENTRY' : 'ENTRIES'}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "1rem 0", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>ASSET ID</th>
                <th style={{ padding: "1rem 0", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>MODEL</th>
                <th style={{ padding: "1rem 0", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>ANALYZED ON</th>
                <th style={{ padding: "1rem 0", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>STATUS</th>
                <th style={{ padding: "1rem 0", textAlign: "right", fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem 0", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic" }}>
                    No predictions made yet. Try predicting an asset from the dashboard.
                  </td>
                </tr>
              ) : (
                history.map((entry, index) => (
                  <tr key={index} style={{ borderBottom: index < history.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <td style={{ padding: "1rem 0", fontWeight: 700, color: "#8b5cf6", fontSize: "0.85rem" }}>{entry.id}</td>
                    <td style={{ padding: "1rem 0", fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" }}>{entry.model}</td>
                    <td style={{ padding: "1rem 0", color: "#64748b", fontSize: "0.8rem" }}>{entry.analyzedOn}</td>
                    <td style={{ padding: "1rem 0" }}>
                      <span style={{ display: "inline-block", background: "#dcfce7", color: "#16a34a", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase" }}>
                        {entry.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0", textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button onClick={() => handleAskAI(entry)} style={{ background: "#1e1b4b", color: "#c7d2fe", border: "1px solid #3730a3", padding: "0.4rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <i className="ph-fill ph-magic-wand"></i> Ask AI
                      </button>
                      <button onClick={() => handleDownload(entry)} style={{ background: "#22c55e", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <i className="ph-fill ph-file-pdf"></i> Download
                      </button>
                      <button onClick={() => handleShare(entry)} style={{ background: "#3b82f6", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <i className="ph-fill ph-share-network"></i> Share
                      </button>
                      <button onClick={() => handleDelete(index)} style={{ background: "transparent", color: "#cbd5e1", border: "none", padding: "0.4rem", cursor: "pointer", display: "flex", alignItems: "center" }} aria-label="Delete">
                        <i className="ph-bold ph-trash" style={{ fontSize: "1.1rem" }}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI INSIGHT MODAL */}
      {aiModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }}>
          <div style={{
            background: "white",
            width: "100%",
            maxWidth: "600px",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ background: "#1e1b4b", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white" }}>
                <i className="ph-fill ph-magic-wand" style={{ color: "#818cf8", fontSize: "1.3rem" }}></i>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>AI Insight Summary</h3>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#818cf8", cursor: "pointer" }}
              >
                <i className="ph-bold ph-x" style={{ fontSize: "1.2rem" }}></i>
              </button>
            </div>
            
            <div style={{ padding: "1.5rem", position: "relative" }}>
              {isTyping && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#818cf8", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
                  <span style={{ color: "#818cf8", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI is analyzing data...</span>
                </div>
              )}
              
              <div style={{ color: "#334155", fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                {aiText}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
