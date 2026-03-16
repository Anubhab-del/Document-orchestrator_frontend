import { motion } from "framer-motion";

const STEPS = [
  "Parsing document structure",
  "Extracting semantic content",
  "Querying AI model",
  "Structuring response",
];

export default function Loader({ message = "Processing..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-10"
    >
      {/* Orb */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,149,0,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {[
          { size: "inset-0", color: "#ff9500", dur: 1.6 },
          { size: "inset-4", color: "#7b5ea7", dur: 1.1, rev: true },
          { size: "inset-8", color: "#00ffcc", dur: 0.8 },
        ].map((r, i) => (
          <motion.div
            key={i}
            className={`absolute ${r.size} rounded-full border-2 border-transparent`}
            style={{ borderTopColor: r.color }}
            animate={{ rotate: r.rev ? -360 : 360 }}
            transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.div
          className="w-4 h-4 rounded-full"
          style={{ background: "var(--amber)" }}
          animate={{
            scale: [1, 2, 1],
            boxShadow: ["0 0 0 rgba(255,149,0,0)", "0 0 30px rgba(255,149,0,0.8)", "0 0 0 rgba(255,149,0,0)"],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Step timeline */}
      <div className="relative pl-8 space-y-4 w-56">
        <div className="timeline-line" />
        {STEPS.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="absolute left-0 w-6 h-6 rounded-full border flex items-center justify-center"
              style={{ background: "var(--void-2)", borderColor: "var(--amber)" }}
              animate={{ borderColor: ["var(--amber)", "var(--ice)", "var(--amber)"] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--amber)" }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            </motion.div>
            <p
              className="mono text-xs"
              style={{ color: "var(--text-2)", marginLeft: "8px" }}
            >
              {step}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}