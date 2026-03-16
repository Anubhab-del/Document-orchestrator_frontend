import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle, XCircle, MessageSquare, Loader2, Brain, AtSign, Zap } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function OutputCard({ title, icon: Icon, accentColor, accentBg, content, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl overflow-hidden"
      style={{ background: "var(--void-1)", border: "1px solid var(--border-0)" }}
    >
      <div className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: accentBg, borderBottom: "1px solid var(--border-1)" }}
      >
        <Icon className="w-4 h-4" style={{ color: accentColor }} />
        <h3 className="display text-lg" style={{ color: "var(--text-0)", letterSpacing: "0.06em" }}>{title}</h3>
      </div>
      <div className="px-5 py-4">
        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-1)" }}>{content}</p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const isSent = status?.toLowerCase().includes("sent") || status?.toLowerCase().includes("success");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center gap-4 p-5 rounded-2xl"
      style={{
        background: isSent ? "rgba(0,255,204,0.04)" : "rgba(255,51,102,0.04)",
        border: `1px solid ${isSent ? "rgba(0,255,204,0.2)" : "rgba(255,51,102,0.2)"}`,
      }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: isSent ? "rgba(0,255,204,0.08)" : "rgba(255,51,102,0.08)" }}
      >
        {isSent
          ? <CheckCircle className="w-5 h-5" style={{ color: "var(--ice)" }} />
          : <XCircle className="w-5 h-5" style={{ color: "var(--crimson)" }} />}
      </div>
      <div>
        <p className="display text-lg" style={{ color: isSent ? "var(--ice)" : "var(--crimson)", letterSpacing: "0.06em" }}>
          {isSent ? "EMAIL DELIVERED" : "DELIVERY FAILED"}
        </p>
        <p className="mono text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{status}</p>
      </div>
    </motion.div>
  );
}

export default function EmailPanel({ uploadData }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  if (!uploadData) return null;

  const handleSendAlert = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Please enter a valid email address.");
    setError(""); setLoading(true); setResult(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/webhook`, {
        document_text: uploadData.document_text,
        extracted_data: uploadData.extracted_data,
        question: uploadData.question,
        recipient_email: email,
      });
      setResult(response.data);
      toast.success("Alert dispatched", { icon: "⚡" });
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to trigger automation.";
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px" style={{ background: "var(--border-1)" }} />
        <span className="tag" style={{ background: "var(--ice-dim)", border: "1px solid rgba(0,255,204,0.15)", color: "var(--ice)" }}>
          <Zap className="w-3 h-3" /> N8N AUTOMATION
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border-1)" }} />
      </div>

      {/* Email card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl p-7 holo-border glow-ice"
        style={{ background: "var(--void-1)", border: "1px solid rgba(0,255,204,0.1)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--ice-dim)", border: "1px solid rgba(0,255,204,0.15)" }}
          >
            <Mail className="w-5 h-5" style={{ color: "var(--ice)" }} />
          </div>
          <div>
            <h2 className="display text-2xl" style={{ color: "var(--text-0)", letterSpacing: "0.06em" }}>Send Alert Mail</h2>
            <p className="mono text-xs mt-0.5" style={{ color: "var(--text-2)" }}>Trigger AI + email via n8n</p>
          </div>
          <span className="ml-auto tag" style={{ background: "var(--ice-dim)", border: "1px solid rgba(0,255,204,0.15)", color: "var(--ice)" }}>
            ◈ Step 02
          </span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-2)" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="recipient@example.com"
              className="w-full rounded-2xl pl-11 pr-5 py-4 text-sm outline-none transition-all"
              style={{ background: "var(--void-2)", border: "1px solid var(--border-0)", color: "var(--text-0)", fontFamily: "var(--font-body)" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(0,255,204,0.3)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,255,204,0.05)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-0)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <motion.button
            onClick={handleSendAlert}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full relative overflow-hidden rounded-2xl py-4 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #00e5b0 0%, #00d4ff 50%, #00ffcc 100%)",
              boxShadow: "0 8px 40px rgba(0,255,204,0.2), 0 2px 8px rgba(0,255,204,0.15)",
              fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontSize: "16px", color: "#030308", fontWeight: "bold",
            }}
          >
            <div className="absolute inset-0 shimmer" />
            <span className="relative flex items-center justify-center gap-2.5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "DISPATCHING..." : "SEND ALERT MAIL"}
            </span>
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 mono text-xs flex items-center gap-2" style={{ color: "var(--crimson)" }}
            >
              <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="rounded-3xl p-10 flex flex-col items-center gap-6"
            style={{ background: "var(--void-1)", border: "1px solid var(--border-0)" }}
          >
            <div className="relative w-16 h-16">
              <motion.div className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{ borderTopColor: "var(--ice)" }}
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div className="absolute inset-2.5 rounded-full border-2 border-transparent"
                style={{ borderTopColor: "var(--amber)" }}
                animate={{ rotate: -360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="text-center">
              <p className="display text-xl" style={{ color: "var(--text-0)", letterSpacing: "0.08em" }}>PROCESSING WORKFLOW</p>
              <p className="mono text-xs mt-1" style={{ color: "var(--text-2)" }}>n8n is generating analysis and sending email</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px" style={{ background: "var(--border-1)" }} />
              <span className="tag" style={{ background: "rgba(0,255,204,0.06)", border: "1px solid rgba(0,255,204,0.2)", color: "var(--ice)" }}>
                <motion.span className="w-1.5 h-1.5 rounded-full bg-current"
                  animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                />
                AUTOMATION COMPLETE
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--border-1)" }} />
            </div>
            <StatusBadge status={result.status} />
            <OutputCard title="ANALYTICAL ANSWER" icon={Brain} accentColor="#a78bfa" accentBg="rgba(167,139,250,0.04)" content={result.answer} delay={0.1} />
            <OutputCard title="GENERATED EMAIL BODY" icon={MessageSquare} accentColor="var(--ice)" accentBg="var(--ice-dim)" content={result.email_body} delay={0.2} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}