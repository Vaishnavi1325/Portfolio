import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const LINES = [
  "Initializing Portfolio...",
  "Loading Components...",
  "Connecting Intelligence...",
  "Rendering Experience...",
  "Welcome.",
];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const step = 420;
    const id = setInterval(() => {
      setIdx((i) => {
        if (i >= LINES.length - 1) {
          clearInterval(id);
          setTimeout(() => {
            setDone(true);
            setTimeout(onDone, 500);
          }, 500);
          return i;
        }
        return i + 1;
      });
    }, step);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="h-6 relative overflow-hidden font-mono text-[11px] tracking-[0.35em] uppercase text-foreground/80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {LINES[idx]}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="relative h-[1px] w-56 overflow-hidden bg-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${((idx + 1) / LINES.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-foreground"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
