import { useEffect, useRef } from "react";

interface Props {
  text: string;
  className?: string;
  fontSize?: number;
}

/** Cursor-driven particle text. Letters form the string, particles repel from cursor and spring back. */
export function ParticleTitle({ text, className, fontSize = 140 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, r: 90 };
    let particles: {
      x: number; y: number; ox: number; oy: number; vx: number; vy: number; c: number;
    }[] = [];

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const responsiveFont = Math.min(fontSize, w / (text.length * 0.55));
      const h = responsiveFont * 2.2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      ctx.font = `700 ${responsiveFont}px "Space Grotesk", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2);

      const data = ctx.getImageData(0, 0, w * dpr, h * dpr).data;
      ctx.clearRect(0, 0, w, h);
      particles = [];
      const step = 4;
      for (let y = 0; y < h * dpr; y += step) {
        for (let x = 0; x < w * dpr; x += step) {
          const idx = (y * w * dpr + x) * 4 + 3;
          if (data[idx] > 128) {
            const px = x / dpr;
            const py = y / dpr;
            particles.push({
              x: px + (Math.random() - 0.5) * 40,
              y: py + (Math.random() - 0.5) * 40,
              ox: px,
              oy: py,
              vx: 0,
              vy: 0,
              c: Math.random(),
            });
          }
        }
      }
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(wrap);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < mouse.r) {
          const f = (mouse.r - d) / mouse.r;
          p.vx += (dx / d) * f * 2;
          p.vy += (dy / d) * f * 2;
        }
        // spring back
        p.vx += (p.ox - p.x) * 0.02;
        p.vy += (p.oy - p.y) * 0.02;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = 0.55 + p.c * 0.4;
        ctx.fillStyle = `rgba(245,245,255,${alpha})`;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [text, fontSize]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}
