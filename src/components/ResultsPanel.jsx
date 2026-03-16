import { motion } from "framer-motion";
import { Database, Lightbulb, Download, Hash } from "lucide-react";

function exportPDF(data) {
  const { extracted_data, relevance_summary, question } = data;
  const entries = Object.entries(extracted_data || {});
  const now = new Date().toLocaleString();

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>DocOrchestrator Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=DM+Mono:wght@400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Outfit', sans-serif; background: #030308; color: #e0e0f0; padding: 60px; min-height: 100vh; }
  .header { border-bottom: 1px solid rgba(255,149,0,0.3); padding-bottom: 32px; margin-bottom: 40px; }
  .logo { font-size: 11px; letter-spacing: 0.2em; color: #ff9500; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 16px; }
  h1 { font-size: 42px; font-weight: 700; color: #fff; letter-spacing: -0.02em; line-height: 1.1; }
  .meta { margin-top: 12px; font-size: 12px; color: #6868a0; font-family: 'DM Mono', monospace; }
  .question-box { background: rgba(255,149,0,0.06); border: 1px solid rgba(255,149,0,0.2); border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; }
  .question-label { font-size: 10px; letter-spacing: 0.15em; color: #ff9500; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 8px; }
  .question-text { font-size: 15px; color: #e0e0f0; font-style: italic; }
  .section-title { font-size: 10px; letter-spacing: 0.2em; color: #6868a0; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
  tr:last-child { border: none; }
  td { padding: 14px 16px; font-size: 13px; }
  td:first-child { color: #ff9500; font-weight: 600; text-transform: capitalize; width: 35%; font-family: 'DM Mono', monospace; font-size: 12px; }
  td:last-child { color: #c8c8e0; }
  .summary-box { background: rgba(0,255,204,0.04); border: 1px solid rgba(0,255,204,0.15); border-radius: 12px; padding: 20px 24px; }
  .summary-label { font-size: 10px; letter-spacing: 0.15em; color: #00ffcc; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 8px; }
  .summary-text { font-size: 13px; color: #c8c8e0; line-height: 1.7; }
  .footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #2a2a50; font-family: 'DM Mono', monospace; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">◈ DocOrchestrator — AI Extraction Report</div>
    <h1>Extraction Report</h1>
    <div class="meta">Generated: ${now}</div>
  </div>
  <div class="question-box">
    <div class="question-label">Query</div>
    <div class="question-text">${question || "N/A"}</div>
  </div>
  <div class="section-title">◆ Extracted Data Fields</div>
  <table>
    ${entries.map(([k, v]) => `<tr><td>${k.replace(/_/g, " ")}</td><td>${Array.isArray(v) ? v.join(", ") : v}</td></tr>`).join("")}
  </table>
  ${relevance_summary ? `
  <div class="summary-box">
    <div class="summary-label">AI Summary</div>
    <div class="summary-text">${relevance_summary}</div>
  </div>` : ""}
  <div class="footer">DocOrchestrator · AI-Powered Document Intelligence · Powered by Groq + n8n</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  setTimeout(() => { win && win.print(); }, 800);
}

function Row({ label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-5 gap-4 px-5 py-3.5 rounded-xl transition-all group"
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,149,0,0.04)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <div className="col-span-2 flex items-start gap-2">
        <Hash className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "var(--amber)", opacity: 0.5 }} />
        <span className="mono text-xs font-medium capitalize leading-relaxed" style={{ color: "var(--amber)" }}>
          {label.replace(/_/g, " ")}
        </span>
      </div>
      <div className="col-span-3">
        <span className="text-xs leading-relaxed" style={{ color: "var(--text-1)" }}>
          {Array.isArray(value) ? value.join(", ") : String(value)}
        </span>
      </div>
    </motion.div>
  );
}

export default function ResultsPanel({ data }) {
  if (!data) return null;
  const { extracted_data, relevance_summary } = data;
  const entries = extracted_data ? Object.entries(extracted_data) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px" style={{ background: "var(--border-1)" }} />
        <span className="tag" style={{ background: "var(--amber-dim)", border: "1px solid rgba(255,149,0,0.2)", color: "var(--amber)" }}>
          <motion.span className="w-1.5 h-1.5 rounded-full bg-current"
            animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
          />
          Extraction Complete
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border-1)" }} />
      </div>

      {/* Card */}
      <div className="rounded-3xl overflow-hidden glow-amber" style={{ background: "var(--void-1)", border: "1px solid var(--border-0)" }}>
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(255,149,0,0.03)", borderBottom: "1px solid var(--border-1)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--amber-dim)", border: "1px solid rgba(255,149,0,0.2)" }}
            >
              <Database className="w-4 h-4" style={{ color: "var(--amber)" }} />
            </div>
            <div>
              <p className="display text-lg" style={{ color: "var(--text-0)", letterSpacing: "0.06em" }}>Structured Data</p>
              <p className="mono text-xs" style={{ color: "var(--text-2)" }}>{entries.length} fields extracted</p>
            </div>
          </div>
          <button
            onClick={() => exportPDF(data)}
            className="magnetic flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "var(--ice-dim)", border: "1px solid rgba(0,255,204,0.2)", color: "var(--ice)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,204,0.12)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,204,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ice-dim)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>

        {/* Rows */}
        <div className="px-2 py-3 space-y-0.5">
          {entries.map(([key, value], i) => <Row key={key} label={key} value={value} index={i} />)}
        </div>

        {/* Summary */}
        {relevance_summary && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mx-4 mb-4 flex items-start gap-3 rounded-2xl px-5 py-4"
            style={{ background: "rgba(0,255,204,0.03)", border: "1px solid rgba(0,255,204,0.1)" }}
          >
            <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--ice)" }} />
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-1)" }}>
              <span className="font-semibold" style={{ color: "var(--ice)" }}>AI Note — </span>
              {relevance_summary}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}