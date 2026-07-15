import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

interface Item {
  label: string;
  content: ReactNode;
}

export function BouncyAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/80 hover:bg-white/[0.03] transition-colors"
              data-cursor="button"
            >
              <span>{it.label}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-lg leading-none"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 text-sm text-foreground/70 leading-relaxed border-t border-white/5">
                    {it.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
