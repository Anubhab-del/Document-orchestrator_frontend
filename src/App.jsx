import { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Cpu, Zap, FileSearch, Brain, Mail, ArrowRight, History } from "lucide-react";
import UploadSection from "./components/UploadSection";
import ResultsPanel from "./components/ResultsPanel";
import EmailPanel from "./components/EmailPanel";
import HistoryPanel from "./components/HistoryPanel";

/* ── Aurora Canvas ─────────────────────────────────────── */
function AuroraCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    const ORBS = [
      { x: 0.2, y: 0.2, r: 0.45, color: [91, 79, 245], speed: 0.0004 },
      { x: 0.8, y: 0.8, r: 0.40, color: [123, 94, 167], speed: 0.0003 },
      { x: 0.5, y: 0.5, r: 0.35, color: [0, 212, 255], speed: 0.0005 },
      { x: 0.1, y: 0.9, r: 0.30, color: [255, 149, 0], speed: 0.0002 },
    ];

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ORBS.forEach((orb, i) => {
        const ox = (orb.x + Math.sin(t * orb.speed + i) * 0.2 + mouse.current.x * 0.08) * canvas.width;
        const oy = (orb.y + Math.cos(t * orb.speed * 1.3 + i) * 0.15 + mouse.current.y * 0.08) * canvas.height;
        const r = orb.r * Math.min(canvas.width, canvas.height);
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, `rgba(${orb.color.join(",")},0.07)`);
        grad.addColorStop(0.5, `rgba(${orb.color.join(",")},0.03)`);
        grad.addColorStop(1, `rgba(${orb.color.join(",")},0)`);
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}

/* ── Grid Overlay ──────────────────────────────────────── */
function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* Scan line */}
      <motion.div className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,149,0,0.3), transparent)" }}
        animate={{ y: ["-5vh", "105vh"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
      />
    </div>
  );
}

/* ── Custom Cursor ─────────────────────────────────────── */
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(mx, { stiffness: 100, damping: 18 });
  const ry = useSpring(my, { stiffness: 100, damping: 18 });

  useEffect(() => {
    const move = (e) => {
      mx.set(e.clientX); my.set(e.clientY);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div ref={dotRef} id="cursor-dot" />
      <motion.div id="cursor-ring" style={{ x: rx, y: ry }} />
    </>
  );
}

/* ── Ticker ────────────────────────────────────────────── */
function Ticker() {
  const items = [
    "◈ AI-POWERED EXTRACTION",
    "◆ GROQ LLAMA 3.3 70B",
    "◈ N8N WORKFLOW AUTOMATION",
    "◆ REAL-TIME DOCUMENT ANALYSIS",
    "◈ STRUCTURED JSON OUTPUT",
    "◆ AUTOMATED EMAIL ALERTS",
    "◈ EXPORT PDF REPORTS",
    "◆ SESSION HISTORY",
  ];
  const text = [...items, ...items].join("   ·   ");

  return (
    <div className="relative overflow-hidden py-2.5 border-y" style={{ borderColor: "rgba(255,149,0,0.1)", background: "rgba(255,149,0,0.02)" }}>
      <div className="flex">
        <div className="ticker-track mono text-xs whitespace-nowrap" style={{ color: "var(--text-2)", letterSpacing: "0.1em" }}>
          {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
    </div>
  );
}

/* ── Header ────────────────────────────────────────────── */
function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 sticky top-0"
      style={{ background: "rgba(3,3,8,0.85)", backdropFilter: "blur(40px)", borderBottom: "1px solid var(--border-1)" }}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #ff9500, #ff6600)", boxShadow: "0 4px 20px rgba(255,149,0,0.35)" }}
          >
            <Cpu className="w-5 h-5 text-black" />
          </motion.div>
          <div>
            <h1 className="display text-2xl" style={{ color: "var(--text-0)", letterSpacing: "0.08em" }}>
              DOCORCHESTRATOR
            </h1>
            <p className="mono text-xs" style={{ color: "var(--text-2)", letterSpacing: "0.12em" }}>
              AI DOCUMENT INTELLIGENCE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(0,255,204,0.05)", border: "1px solid rgba(0,255,204,0.12)" }}
          >
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ice)" }}
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="mono text-xs" style={{ color: "var(--ice)" }}>SYSTEMS LIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: "var(--void-2)", border: "1px solid var(--border-0)" }}
          >
            <Zap className="w-3 h-3" style={{ color: "var(--amber)" }} />
            <span className="mono text-xs" style={{ color: "var(--text-2)" }}>GROQ · N8N</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function Hero() {
  const chars = "EXTRACT. ANALYSE. AUTOMATE.".split("");

  return (
    <div className="relative text-center py-28 px-6">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2.5 mb-10 rounded-full px-5 py-2.5"
        style={{ background: "var(--amber-dim)", border: "1px solid rgba(255,149,0,0.2)" }}
      >
        <motion.div className="w-2 h-2 rounded-full" style={{ background: "var(--amber)" }}
          animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="mono text-xs" style={{ color: "var(--amber)", letterSpacing: "0.15em" }}>
          AI DOCUMENT INTELLIGENCE PLATFORM
        </span>
        <ArrowRight className="w-3 h-3" style={{ color: "var(--amber)" }} />
      </motion.div>

      {/* Character-by-character headline */}
      <div className="mb-8 overflow-hidden">
        <div className="display leading-none" style={{ fontSize: "clamp(56px, 10vw, 120px)", color: "var(--text-0)" }}>
          {["EXTRACT.", "ANALYSE.", "AUTOMATE."].map((word, wi) => (
            <div key={word} className={wi === 2 ? "text-gradient-amber" : ""}>
              {word.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.15 + wi * 0.15 + ci * 0.03,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              {wi < 2 && <br />}
            </div>
          ))}
        </div>
      </div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-lg max-w-md mx-auto mb-16 leading-relaxed"
        style={{ color: "var(--text-2)" }}
      >
        Upload any document. Ask a precise question.
        Receive only what you need — then automate intelligent alerts.
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center gap-3 flex-wrap"
      >
        {[
          { icon: FileSearch, label: "SMART EXTRACTION", color: "var(--amber)", bg: "var(--amber-dim)", border: "rgba(255,149,0,0.2)" },
          { icon: Brain, label: "AI ANALYSIS", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
          { icon: Mail, label: "AUTO EMAIL", color: "var(--ice)", bg: "var(--ice-dim)", border: "rgba(0,255,204,0.2)" },
          { icon: History, label: "SESSION HISTORY", color: "var(--violet)", bg: "rgba(123,94,167,0.08)", border: "rgba(123,94,167,0.2)" },
        ].map(({ icon: Icon, label, color, bg, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05 + i * 0.07 }}
            whileHover={{ scale: 1.06, y: -3 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-default"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color }} />
            <span className="mono text-xs font-semibold" style={{ color, letterSpacing: "0.08em" }}>{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Step Tracker ──────────────────────────────────────── */
function StepTracker({ step1Done }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="flex items-center justify-center gap-4 mb-16"
    >
      {[
        { n: "01", label: "UPLOAD & EXTRACT", done: step1Done, active: !step1Done },
        { n: "02", label: "SEND ALERT MAIL", done: false, active: step1Done },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                background: s.done ? "var(--ice)" : s.active ? "var(--amber)" : "var(--void-3)",
                boxShadow: s.active ? "0 0 20px rgba(255,149,0,0.5)" : s.done ? "0 0 20px rgba(0,255,204,0.3)" : "none",
              }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-full flex items-center justify-center mono text-xs font-bold"
              style={{ color: s.done || s.active ? "#030308" : "var(--text-3)" }}
            >
              {s.done ? "✓" : s.n}
            </motion.div>
            <span className="mono text-xs font-semibold" style={{
              color: s.done ? "var(--ice)" : s.active ? "var(--amber)" : "var(--text-3)",
              letterSpacing: "0.1em",
            }}>
              {s.label}
            </span>
          </div>
          {i === 0 && (
            <motion.div className="w-16 h-px"
              animate={{ background: step1Done ? "var(--ice)" : "var(--border-1)" }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

/* ── Root App ──────────────────────────────────────────── */
export default function App() {
  const [uploadResult, setUploadResult] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [history, setHistory] = useState([]);

  const addHistory = (item) => {
    setHistory((prev) => [item, ...prev].slice(0, 8));
  };

  const restoreHistory = (item) => {
    setUploadResult(item);
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen relative" style={{ background: "var(--void)" }}>
      <Cursor />
      <AuroraCanvas />
      <GridOverlay />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--void-2)",
            color: "var(--text-0)",
            border: "1px solid var(--border-0)",
            borderRadius: "16px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.06em",
          },
        }}
      />

      <Header />
      <Ticker />
      <Hero />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <StepTracker step1Done={!!uploadResult} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left column */}
          <div className="space-y-6">
            <UploadSection
              onResult={setUploadResult}
              onLoading={setIsAnalysing}
              onAddHistory={addHistory}
            />
            <AnimatePresence>
              {uploadResult && <ResultsPanel data={uploadResult} />}
            </AnimatePresence>
            <AnimatePresence>
              {history.length > 0 && (
                <HistoryPanel
                  history={history}
                  onRestore={restoreHistory}
                  onClear={clearHistory}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right column */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {uploadResult ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <EmailPanel uploadData={uploadResult} />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-6 min-h-[400px]"
                  style={{ background: "var(--void-1)", border: "1px solid var(--border-0)" }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{ background: "var(--void-2)", border: "1px solid var(--border-0)" }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Mail className="w-10 h-10" style={{ color: "var(--text-3)" }} />
                  </motion.div>
                  <div className="space-y-3">
                    <p className="display text-2xl" style={{ color: "var(--text-2)", letterSpacing: "0.08em" }}>
                      AUTOMATION STANDBY
                    </p>
                    <p className="mono text-xs" style={{ color: "var(--text-3)" }}>
                      Complete Step 01 to unlock this panel
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ background: "var(--text-3)" }}
                        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10" style={{ borderTop: "1px solid var(--border-1)" }}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <p className="mono text-xs" style={{ color: "var(--text-3)", letterSpacing: "0.08em" }}>
            DOCORCHESTRATOR · AI DOCUMENT INTELLIGENCE · REACT + EXPRESS + GROQ + N8N
          </p>
          <div className="flex items-center gap-2">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ice)" }}
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="mono text-xs" style={{ color: "var(--text-3)" }}>LIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}