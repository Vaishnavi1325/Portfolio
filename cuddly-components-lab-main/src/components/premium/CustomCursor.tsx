import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Variant = "default" | "link" | "button" | "view" | "download";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.style.cursor = "none";

    let rx = 0, ry = 0, dx = 0, dy = 0;
    let raf = 0;

    const move = (e: MouseEvent) => {
      setVisible(true);
      dx = e.clientX;
      dy = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      }

      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const kind = (target?.dataset.cursor as Variant | undefined) ?? "default";
      if (target?.tagName === "A" || target?.tagName === "BUTTON") {
        setVariant((v) => (kind !== "default" ? kind : v === "default" ? "link" : v));
      }
      setVariant(kind);
      setLabel(kind === "view" ? "VIEW" : kind === "download" ? "DOWNLOAD" : null);
    };

    const tick = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const click = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setSplashes((s) => [...s, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setSplashes((s) => s.filter((sp) => sp.id !== id)), 600);
    };

    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);
    window.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
      window.removeEventListener("mouseleave", leave);
      document.documentElement.style.cursor = "";
    };
  }, []);

  const ringSize =
    variant === "view" || variant === "download" ? 64 :
    variant === "link" ? 40 :
    variant === "button" ? 44 : 28;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-foreground mix-blend-difference"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <motion.div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-foreground/40 mix-blend-difference flex items-center justify-center"
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor:
            variant === "button" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="font-mono text-[9px] tracking-widest text-foreground"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {splashes.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0.4, scale: 0 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none fixed z-[9997] h-8 w-8 rounded-full border border-foreground/40"
          style={{ left: s.x - 16, top: s.y - 16 }}
        />
      ))}
    </>
  );
}
