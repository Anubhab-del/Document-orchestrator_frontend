import { motion, AnimatePresence } from "framer-motion";
import { Clock, FileText, ChevronRight, Trash2 } from "lucide-react";

export default function HistoryPanel({ history, onRestore, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl overflow-hidden"
      style={{ background: "var(--void-1)", border: "1px solid var(--border-0)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(123,94,167,0.05)", borderBottom: "1px solid var(--border-1)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(123,94,167,0.15)", border: "1px solid rgba(123,94,167,0.2)" }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: "var(--violet)" }} />
          </div>
          <div>
            <p className="display text-base" style={{ color: "var(--text-0)", letterSpacing: "0.06em" }}>
              SESSION HISTORY
            </p>
            <p className="mono text-xs" style={{ color: "var(--text-2)" }}>
              {history.length} extraction{history.length !== 1 ? "s" : ""} this session
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ color: "var(--text-3)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--crimson)"; e.currentTarget.style.background = "rgba(255,51,102,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.background = "transparent"; }}
          title="Clear history"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* History items */}
      <div className="divide-y" style={{ borderColor: "var(--border-1)" }}>
        <AnimatePresence>
          {history.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onRestore(item)}
              className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all group"
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,149,0,0.03)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--void-2)", border: "1px solid var(--border-0)" }}
              >
                <FileText className="w-4 h-4" style={{ color: "var(--text-2)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-0)" }}>
                  {item.fileName}
                </p>
                <p className="mono text-xs mt-0.5 truncate" style={{ color: "var(--text-2)" }}>
                  {item.question}
                </p>
                <p className="mono text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                  {item.timestamp?.toLocaleTimeString()}
                </p>
              </div>
              <ChevronRight
                className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: "var(--text-3)" }}
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}