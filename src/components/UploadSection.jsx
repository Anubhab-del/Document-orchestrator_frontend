import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function MagneticButton({ children, onClick, disabled, className, style }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      className={`magnetic ${className}`}
      style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", ...style }}
    >
      {children}
    </button>
  );
}

export default function UploadSection({ onResult, onLoading, onAddHistory }) {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === "application/pdf" || dropped.type === "text/plain")) {
      setFile(dropped); setError("");
    } else setError("Only PDF and TXT files are supported.");
  };

  const handleSubmit = async () => {
    if (!file) return setError("Please upload a document first.");
    if (!question.trim()) return setError("Please enter a question.");
    setError(""); setLoading(true);
    onLoading && onLoading(true); onResult(null);
    const formData = new FormData();
    formData.append("document", file);
    formData.append("question", question.trim());
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResult(response.data);
      onAddHistory && onAddHistory({ ...response.data, fileName: file.name, question: question.trim(), timestamp: new Date() });
      toast.success("Extraction complete", { icon: "◈" });
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong.";
      setError(msg); toast.error(msg);
    } finally { setLoading(false); onLoading && onLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl holo-border noise glow-amber"
      style={{ background: "var(--void-1)", border: "1px solid var(--border-0)" }}
    >
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--amber-dim)", border: "1px solid rgba(255,149,0,0.2)" }}
            >
              <Upload className="w-5 h-5" style={{ color: "var(--amber)" }} />
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                style={{ background: "var(--ice)", borderColor: "var(--void-1)", animation: "pulse 2s infinite" }}
              />
            </div>
            <div>
              <h2 className="display text-2xl" style={{ color: "var(--text-0)", letterSpacing: "0.06em" }}>
                Upload Document
              </h2>
              <p className="mono text-xs mt-0.5" style={{ color: "var(--text-2)" }}>
                PDF · TXT · MAX 10MB
              </p>
            </div>
          </div>
          <span className="tag" style={{ background: "var(--amber-dim)", border: "1px solid rgba(255,149,0,0.2)", color: "var(--amber)" }}>
            ◈ Step 01
          </span>
        </div>

        {/* Drop zone */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          animate={{
            borderColor: dragging ? "var(--amber)" : file ? "var(--ice)" : "var(--border-0)",
            backgroundColor: dragging ? "rgba(255,149,0,0.04)" : file ? "rgba(0,255,204,0.02)" : "transparent",
          }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden"
          style={{ minHeight: "150px" }}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={(e) => { setFile(e.target.files[0]); setError(""); }} className="hidden" />
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-4"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--void-2)", border: "1px solid var(--border-0)" }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FileText className="w-7 h-7" style={{ color: "var(--text-3)" }} />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                    {dragging ? "Release to upload" : "Drop your document here"}
                  </p>
                  <p className="mono text-xs mt-1" style={{ color: "var(--text-2)" }}>
                    or <span style={{ color: "var(--amber)" }}>click to browse</span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-5"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--ice-dim)", border: "1px solid rgba(0,255,204,0.2)" }}
                >
                  <FileText className="w-5 h-5" style={{ color: "var(--ice)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--text-0)" }}>{file.name}</p>
                  <p className="mono text-xs mt-0.5" style={{ color: "var(--text-2)" }}>
                    {(file.size / 1024).toFixed(1)} KB · <span style={{ color: "var(--ice)" }}>Ready</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: "var(--ice)" }} />
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ color: "var(--text-3)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--crimson)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-3)"}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Question */}
        <div className="mt-6 space-y-2">
          <label className="mono text-xs" style={{ color: "var(--text-2)", letterSpacing: "0.12em" }}>
            ◆ ANALYTICAL QUESTION
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are this person's technical skills?"
            rows={3}
            className="w-full rounded-2xl px-5 py-4 text-sm resize-none outline-none transition-all"
            style={{
              background: "var(--void-2)", border: "1px solid var(--border-0)",
              color: "var(--text-0)", fontFamily: "var(--font-body)",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,149,0,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,149,0,0.06)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border-0)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mt-4 rounded-xl px-4 py-3 text-xs"
              style={{ background: "rgba(255,51,102,0.06)", border: "1px solid rgba(255,51,102,0.2)", color: "var(--crimson)" }}
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <MagneticButton
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full relative overflow-hidden rounded-2xl py-4 text-sm font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: loading ? "var(--amber)" : "linear-gradient(135deg, #ff9500 0%, #ffcc00 50%, #ff6600 100%)",
            boxShadow: "0 8px 40px rgba(255,149,0,0.35), 0 2px 8px rgba(255,149,0,0.2)",
            fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontSize: "16px",
          }}
        >
          <div className="absolute inset-0 shimmer" />
          <span className="relative flex items-center justify-center gap-2.5">
            {loading ? (
              <>
                <motion.div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black"
                  animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
                ANALYSING...
              </>
            ) : (
              <><Zap className="w-4 h-4" /> ANALYSE DOCUMENT</>
            )}
          </span>
        </MagneticButton>
      </div>
    </motion.div>
  );
}