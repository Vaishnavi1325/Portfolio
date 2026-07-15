import { useEffect, useRef } from "react";

/** Layered background: animated gradient + pixel canvas + subtle "liquid" blobs. */
export function BackgroundLayers() {
  const pixelRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = pixelRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const pixels: { x: number; y: number; a: number; s: number; dir: number }[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);
      pixels.length = 0;
      const count = Math.floor((w * h) / 16000);
      for (let i = 0; i < count; i++) {
        pixels.push({
          x: Math.random() * w,
          y: Math.random() * h,
          a: Math.random() * 0.25 + 0.05,
          s: Math.random() * 0.006 + 0.002,
          dir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pixels) {
        p.a += p.s * p.dir;
        if (p.a > 0.32 || p.a < 0.03) p.dir *= -1;
        ctx.fillStyle = `rgba(190, 208, 255, ${p.a})`;
        ctx.fillRect(p.x, p.y, 1.4, 1.4);
      }
      raf = requestAnimationFrame(loop);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Layer 2: animated gradient */}
      <div className="absolute inset-0 opacity-25 bg-gradient-shift" />
      {/* Layer 1: soft depth blobs — restrained blue only */}
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[oklch(0.5_0.11_255/0.10)] blur-3xl animate-liquid-a" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.6_0.08_245/0.08)] blur-3xl animate-liquid-b" />
      <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-[oklch(0.45_0.1_260/0.08)] blur-3xl animate-liquid-c" />
      {/* Layer 3: pixel canvas */}
      <canvas ref={pixelRef} className="absolute inset-0 opacity-50" />
      {/* grid overlay */}
      <div className="grid-overlay absolute inset-0" />
      <div className="noise-overlay" />
    </div>
  );
}
