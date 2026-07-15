import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

/** Individual letters repel from cursor proximity. Subtle. */
export function TextRepel({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };
    const leave = () => {
      mx.set(-9999);
      my.set(-9999);
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [mx, my]);

  return (
    <div ref={ref} className={className}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.35em]">
          {word.split("").map((ch, ci) => (
            <Letter key={ci} ch={ch} mx={mx} my={my} />
          ))}
        </span>
      ))}
    </div>
  );
}

function Letter({ ch, mx, my }: { ch: string; mx: any; my: any }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const p = el.offsetLeft + el.offsetWidth / 2;
        const q = el.offsetTop + el.offsetHeight / 2;
        const dx = p - mx.get();
        const dy = q - my.get();
        const d = Math.hypot(dx, dy);
        const R = 80;
        if (d < R) {
          const f = (R - d) / R;
          x.set((dx / d) * f * 18);
          y.set((dy / d) * f * 18);
        } else {
          x.set(0);
          y.set(0);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mx, my, x, y]);

  return (
    <motion.span ref={ref} style={{ x: sx, y: sy }} className="inline-block">
      {ch}
    </motion.span>
  );
}
