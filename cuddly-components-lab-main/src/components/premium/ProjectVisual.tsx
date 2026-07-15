import { motion, useInView } from "motion/react";
import { Fragment, useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- ArchFlow: architecture as a visual, not a paragraph ---------- */

export interface ArchNode {
  label: string;
  sub?: string;
}

export function ArchFlow({ nodes }: { nodes: ArchNode[] }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center">
      {nodes.map((n, i) => (
        <Fragment key={n.label}>
          {i > 0 && (
            <div
              aria-hidden
              className="arch-connector mx-auto md:mx-0 h-6 w-px self-center md:h-px md:w-8 md:flex-none"
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center"
          >
            <div className="text-xs font-medium text-foreground/90">{n.label}</div>
            {n.sub && (
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
                {n.sub}
              </div>
            )}
          </motion.div>
        </Fragment>
      ))}
    </div>
  );
}

/* ---------- ProjectPreview: a crafted system-dashboard mock ---------- */

export interface PreviewMetric {
  value: string;
  label: string;
}

export function ProjectPreview({
  name,
  metrics,
  logLines,
  sparkline = "M0,58 C20,54 32,40 50,42 C70,44 82,26 100,30 C120,34 132,18 150,22 C170,26 184,12 202,16 C222,20 236,8 256,10 C276,12 288,6 300,8",
}: {
  name: string;
  metrics: PreviewMetric[];
  logLines: string[];
  sparkline?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const gradId = `fill-${name.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-container/50 backdrop-blur"
    >
      {/* faint grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* soft accent bloom */}
      <div
        aria-hidden
        className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-[oklch(0.62_0.14_250/0.1)] blur-3xl"
      />

      <div className="relative p-6 md:p-8">
        {/* window chrome */}
        <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 font-mono text-[10px] tracking-[0.2em] text-foreground/40">
            {name}
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            live
          </span>
        </div>

        {/* metrics row */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
            >
              <div className="font-display-xl text-2xl md:text-3xl text-foreground">{m.value}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* sparkline */}
        <svg viewBox="0 0 300 64" className="mb-6 h-16 w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.14 250)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="oklch(0.62 0.14 250)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`${sparkline} L300,64 L0,64 Z`}
            fill={`url(#${gradId})`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.9 }}
          />
          <motion.path
            d={sparkline}
            fill="none"
            stroke="oklch(0.68 0.13 250)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
          />
        </svg>

        {/* log tail */}
        <div className="space-y-1.5 font-mono text-[10px] leading-relaxed text-foreground/50">
          {logLines.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.15, ease: EASE }}
            >
              <span className="mr-2 text-accent/70">›</span>
              {line}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
