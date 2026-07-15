import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { BackgroundLayers } from "@/components/premium/BackgroundLayers";
import { BlurText } from "@/components/premium/BlurText";
import { BouncyAccordion } from "@/components/premium/BouncyAccordion";
import { CustomCursor } from "@/components/premium/CustomCursor";
import { Dock } from "@/components/premium/Dock";
import { LoadingScreen } from "@/components/premium/LoadingScreen";
import { MagneticButton } from "@/components/premium/MagneticButton";
import { ArchFlow, ProjectPreview, type ArchNode, type PreviewMetric } from "@/components/premium/ProjectVisual";
import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particle-typography";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";
import { Signature } from "@/components/premium/Signature";
import { LoopingTerminal } from "@/components/premium/Terminal";
import { TextRepel } from "@/components/premium/TextRepel";
import { TiltCard } from "@/components/premium/TiltCard";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

/* ---------- helpers ---------- */

function SectionLabel({ children, index }: { children: string; index: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/50 mb-6">
      <span className="text-foreground/30">{index}</span>
      <span className="h-px w-8 bg-foreground/20" />
      <span>{children}</span>
    </div>
  );
}

function useCounter(target: number, start: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);
  return val;
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const val = useCounter(target, inView);
  return (
    <div ref={ref} className="font-display-xl text-5xl md:text-6xl text-foreground">
      {val}
      {suffix}
    </div>
  );
}

function TimelineDot({ highlight }: { highlight?: boolean }) {
  return (
    <div className="absolute left-2 md:left-1/2 -translate-x-1/2 z-10">
      <div
        className={`w-3 h-3 rounded-full ${
          highlight ? "bg-foreground shadow-[0_0_16px_rgba(255,255,255,0.5)]" : "bg-foreground/60"
        }`}
      />
    </div>
  );
}

/* ---------- data ---------- */

const TIMELINE = [
  { year: "2023", title: "Started B.Tech Computer Science", desc: "Foundations in algorithms, systems, and distributed computing." },
  { year: "2024", title: "Started Full Stack Development", desc: "End-to-end delivery: React, Node, Express, PostgreSQL." },
  { year: "2025", title: "Built Data Drill", desc: "Data mining pipelines and ETL optimization." },
  { year: "2026", title: "Built AgriGuardian", desc: "Edge AI for real-time crop disease detection." },
  { year: "2027", title: "Seeking Backend & AI Engineer roles", desc: "Available for full-time opportunities.", highlight: true },
];

const SKILL_GROUPS = [
  { label: "LANGUAGES", items: ["Python", "TypeScript", "C++", "Java", "SQL"] },
  { label: "BACKEND", items: ["Node.js", "Express", "FastAPI", "REST", "Socket.IO"] },
  { label: "FRONTEND", items: ["React", "Next.js", "Tailwind", "Motion"] },
  { label: "AI / ML", items: ["LangChain", "RAG", "Vector DBs"] },
  { label: "DATABASES", items: ["PostgreSQL", "MongoDB", "Redis", "SQL"] },
  { label: "DEVOPS", items: ["Docker", "AWS", "GitHub Actions", "Vercel"] },
];

const SECTION_LABELS: Record<string, string> = {
  about: "About",
  experience: "Experience",
  skills: "Capabilities",
  projects: "Selected Work",
  playground: "Playground",
  achievements: "By the Numbers",
  contact: "Contact",
};

const PROJECTS: {
  name: string;
  status: string;
  tagline: string;
  description: string;
  arch: ArchNode[];
  metrics: PreviewMetric[];
  logLines: string[];
  sparkline?: string;
  details: { label: string; content: ReactNode }[];
  links: { label: string; href: string }[];
}[] = [
  {
  name: "AgriGuardian",
  status: "Production",
  tagline: "AI-Powered Smart Crop & Pest Management Platform",

  description:
    "A full-stack agricultural advisory platform providing AI-powered pest detection, weather-based crop recommendations, multilingual farmer support, and real-time monitoring.",

  arch: [
    { label: "React Frontend", sub: "TypeScript + Vite" },
    { label: "Express API", sub: "REST Services" },
    { label: "Groq AI", sub: "Llama 3.1" },
    { label: "Weather Engine", sub: "OpenWeatherMap API" },
    { label: "MongoDB", sub: "Crop & User Data" },
  ],

  metrics: [
    { value: "60%", label: "Productivity Boost" },
    { value: "70%", label: "Less Manual Diagnosis" },
    { value: "35%", label: "Lower Response Time" },
  ],

  logLines: [
    "crop image uploaded → AI analysis started",
    "pest detected → advisory generated",
    "weather synced → farmer notifications sent",
  ],

  details: [
    {
      label: "Key Features",
      content:
        "AI pest detection · Weather recommendations · Multilingual chatbot · Farmer dashboard · Cloud image storage",
    },
    {
      label: "Architecture",
      content:
        "Scalable MERN architecture integrating Groq Llama 3.1, OpenWeatherMap API, Cloudinary, JWT authentication, caching, and secure REST APIs.",
    },
    {
      label: "Tech Stack",
      content:
        "React.js • TypeScript • Vite • Tailwind CSS • Node.js • Express.js • MongoDB • JWT • Groq AI (Llama 3.1) • OpenWeatherMap API • Cloudinary • REST APIs",
    },
  ],

  links: [
    {
      label: "GitHub",
      href: "https://github.com/Vaishnavi1325/Krishi_Rakshak",
    },
    {
      label: "Live Demo",
      href: "https://krishi-rakshakk-one.vercel.app/",
    },
  ],
},
{
  name: "AI Resume Analyzer",
  status: "Production",
  tagline: "AI-Powered Resume Analysis Platform",

  description:
    "An AI-powered platform that analyzes resumes, extracts technical skills, generates structured feedback, and provides personalized improvement suggestions using LLMs.",

  arch: [
    { label: "FastAPI", sub: "Backend APIs" },
    { label: "Resume Parser", sub: "Text Extraction" },
    { label: "OpenAI API", sub: "LLM Analysis" },
    { label: "Skill Engine", sub: "Technical Matching" },
    { label: "REST APIs", sub: "JSON Responses" },
  ],

  metrics: [
    { value: "65%", label: "Less Manual Review" },
    { value: "50%", label: "Better AI Accuracy" },
    { value: "40%", label: "Fewer API Failures" },
  ],

  logLines: [
    "resume uploaded → text extracted",
    "skills identified → AI analysis completed",
    "recommendations generated → JSON response returned",
  ],

  details: [
    {
      label: "Key Features",
      content:
        "Resume parsing · Skill extraction · AI feedback · Resume summarization · Personalized recommendations",
    },
    {
      label: "Architecture",
      content:
        "Modular FastAPI backend integrating OpenAI APIs with prompt engineering, request validation, exception handling, and scalable REST endpoints.",
    },
    {
      label: "Tech Stack",
      content:
        "Python • FastAPI • OpenAI API • REST APIs",
    },
  ],

  links: [
    {
      label: "GitHub",
      href: "https://github.com/Vaishnavi1325/AI-Resume-Analyzer",
    },
    {
      label: "Live Demo",
      href: "https://ai-resume-analyzer-five-bay.vercel.app/",
    },
  ],
},
];

/* ---------- Playground modal ---------- */

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-lg glass-panel rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/70">{title}</h3>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground" data-cursor="button">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function RegexTool() {
  const [text, setText] = useState("");
  const [flags, setFlags] = useState("g");
  let pattern = "";
  try {
    if (text) {
      // very simple heuristic: escape special chars
      pattern = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  } catch {}
  return (
    <div className="space-y-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter literal text to match…"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm outline-none focus:border-foreground/30"
      />
      <input
        value={flags}
        onChange={(e) => setFlags(e.target.value)}
        placeholder="flags"
        className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs outline-none"
      />
      <div className="rounded-lg bg-black/40 p-4 font-mono text-xs text-foreground/80 break-all">
        /{pattern || "…"}/{flags}
      </div>
    </div>
  );
}

function JsonTool() {
  const [input, setInput] = useState('{"hello":"world","nested":{"n":1}}');
  let output = "";
  let error = "";
  try {
    output = JSON.stringify(JSON.parse(input), null, 2);
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <div className="space-y-3">
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-xs outline-none focus:border-foreground/30 resize-none"
      />
      <pre className={`rounded-lg bg-black/40 p-4 font-mono text-xs overflow-auto max-h-64 ${error ? "text-red-400" : "text-foreground/80"}`}>
        {error || output}
      </pre>
    </div>
  );
}

function ColorTool() {
  const [hue, setHue] = useState(275);
  const palette = Array.from({ length: 5 }, (_, i) => {
    const l = 0.25 + i * 0.15;
    return `oklch(${l.toFixed(2)} 0.14 ${hue})`;
  });
  return (
    <div className="space-y-4">
      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={(e) => setHue(Number(e.target.value))}
        className="w-full accent-foreground"
      />
      <div className="flex rounded-lg overflow-hidden h-24">
        {palette.map((c, i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 font-mono text-[9px] text-foreground/60">
        {palette.map((c, i) => <div key={i} className="truncate">{c}</div>)}
      </div>
    </div>
  );
}

/* ---------- Contact form ---------- */

// Messages are delivered ONLY to this inbox. Visitors cannot change the recipient —
// it never appears in the form, only in the request we build here.
const CONTACT_EMAIL = "vaishnavishukla9578b@gmail.com";

function ContactForm() {
  const STEPS = [
    "Initializing Connection...",
    "Encrypting Request...",
    "Sending...",
    "Delivered ✓",
  ];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [step, setStep] = useState(0);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    setStep(0);
    // advance the terminal steps while the request is in flight; hold before "Delivered"
    const ticker = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 2));
    }, 700);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email") || "not provided",
          message: data.get("message"),
          _replyto: data.get("email") || undefined,
          _subject: `Portfolio contact from ${data.get("name")}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error(`delivery failed (${res.status})`);
      setStep(STEPS.length - 1);
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      clearInterval(ticker);
    }
  }

  if (status === "error") {
    return (
      <div className="glass-panel rounded-2xl p-8 font-mono text-sm space-y-4 max-w-xl mx-auto">
        <div className="text-foreground/80">
          <span className="text-destructive/80 mr-2">✕</span>
          Delivery failed. Please try again.
        </div>
        <button
          onClick={() => setStatus("idle")}
          data-cursor="button"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground border border-white/10 rounded-full px-5 py-2.5 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (status === "sending" || status === "sent") {
    return (
      <div className="glass-panel rounded-2xl p-8 font-mono text-sm space-y-2 max-w-xl mx-auto">
        {STEPS.slice(0, step + 1).map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={i === STEPS.length - 1 ? "text-foreground" : "text-foreground/60"}
          >
            <span className="text-foreground/30 mr-2">$</span>
            {s}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl space-y-4 mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          name="name"
          placeholder="Name"
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-foreground/30 transition-colors placeholder:text-foreground/30"
        />
        <input
          name="email"
          type="email"
          placeholder="Email (optional, for reply)"
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-foreground/30 transition-colors placeholder:text-foreground/30"
        />
      </div>
      <textarea
        required
        name="message"
        rows={5}
        placeholder="Message"
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-foreground/30 transition-colors placeholder:text-foreground/30 resize-none"
      />
      <MagneticButton
        as="button"
        type="submit"
        data-cursor="button"
        className="w-full py-5 bg-foreground text-background rounded-xl font-mono text-xs uppercase tracking-[0.35em] font-medium hover:bg-foreground/90 transition-colors"
      >
        Send Message
      </MagneticButton>
    </motion.form>
  );
}

/* ---------- Skill card ---------- */

function SkillCard({ group }: { group: (typeof SKILL_GROUPS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <TiltCard intensity={4} className="h-full" data-cursor="button">
      <div
        ref={ref}
        onMouseMove={onMove}
        className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7 overflow-hidden group hover:border-white/20 hover:shadow-[0_8px_40px_oklch(0.62_0.14_250/0.08)] transition-[border-color,box-shadow] duration-500"
      >
        <motion.div
          style={{ x: sx, y: sy }}
          className="absolute h-44 w-44 rounded-full bg-[oklch(0.62_0.14_250/0.08)] blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-4">
            {group.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((it) => (
              <span
                key={it}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-foreground/80"
              >
                {it}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

/* ---------- Portfolio ---------- */

function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<null | "regex" | "json" | "color">(null);

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <CustomCursor />
      <BackgroundLayers />
      <Dock />

      <main className="relative z-10">
        {/* HERO */}
        <section id="home" className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
          {/* Layered aurora: one soft blue bloom behind the name, a horizon line below */}
          <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
            <div className="hero-aurora absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 h-[55vh] w-[92vw] max-w-5xl rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.5_0.12_252/0.14),transparent_65%)] blur-2xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[72vw] max-w-4xl bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-36 w-[72vw] max-w-4xl bg-[radial-gradient(ellipse_at_bottom,oklch(0.55_0.13_250/0.08),transparent_70%)]" />
          </div>

          <div className="max-w-5xl w-full text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 mb-12 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Open to opportunities
            </motion.div>
            <div className="w-full min-h-[200px] md:min-h-[280px] relative mb-4">
              <CursorDrivenParticleTypography
                text="Vaishnavi Shukla"
                fontSize={120}
                particleSize={1.5}
                particleDensity={4}
                dispersionStrength={12}
                returnSpeed={0.08}
                color="rgba(248, 250, 255, 0.92)"
              />
            </div>
            <TextRepel
              text="Engineering products where software meets intelligence."
              className="text-xl md:text-2xl font-extralight tracking-[-0.01em] text-foreground/70 mb-12 mx-auto max-w-2xl"
            />
            <div className="flex flex-wrap justify-center gap-3 mb-14 font-mono text-[10px] uppercase tracking-[0.3em]">
              <BlurText text="Full Stack Engineer" by="line" className="px-4 py-2 rounded-full border border-white/10 text-foreground/80" delay={0.3} />
              <BlurText text="Backend Engineer" by="line" className="px-4 py-2 rounded-full border border-white/10 text-foreground/80" delay={0.5} />
              <BlurText text="AI Engineer" by="line" className="px-4 py-2 rounded-full border border-white/10 text-foreground/80" delay={0.7} />
            </div>
            <MagneticButton
              as="a"
              href="#projects"
              data-cursor="button"
              className="px-8 py-4 rounded-full bg-foreground text-background font-mono text-[11px] uppercase tracking-[0.3em] font-medium hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-shadow"
            >
              View My Work
              <span className="material-symbols-outlined text-sm">arrow_outward</span>
            </MagneticButton>
          </div>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 font-mono text-[9px] tracking-[0.3em] uppercase z-10">
            Scroll
            <span className="material-symbols-outlined text-sm animate-bounce">expand_more</span>
          </div>
        </section>

        {/* SCROLL VELOCITY BAND */}
        <div className="velocity-band py-16 md:py-20 border-y border-white/5">
          <ScrollBasedVelocity
            text="BACKEND — AI — NODEJS — SYSTEM DESIGN —"
            default_velocity={3}
            className="text-center text-5xl font-extralight tracking-[-0.02em] text-foreground/[0.08] md:text-8xl md:leading-none uppercase"
          />
        </div>

        {/* ABOUT */}
        <section id="about" className="py-section-gap px-margin-mobile max-w-container-max mx-auto md:px-margin-desktop">
          <SectionLabel index="01">{SECTION_LABELS.about}</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <BlurText
                as="h2"
                text="Building resilient intelligence at scale."
                className="font-display-xl text-5xl md:text-6xl text-foreground max-w-xl"
              />
              <BlurText
                text="Specialized in high-performance backend infrastructure and LLM orchestration. My approach integrates cognitive engineering with production-grade reliability."
                className="text-foreground/60 text-lg font-light leading-relaxed max-w-lg"
                stagger={0.02}
                delay={0.3}
              />
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <Counter target={2} suffix="+" />
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                    Deployments
                  </div>
                </div>
                <div>
                  <Counter target={200} suffix="+" />
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                    Algorithms
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 font-mono text-xs h-[380px] overflow-hidden relative">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <span className="ml-3 text-[10px] text-foreground/30">~/portfolio</span>
              </div>
              <LoopingTerminal />
            </div>
          </div>
        </section>

        {/* EXPERIENCE / TIMELINE */}
        <section id="experience" className="py-section-gap px-margin-mobile max-w-4xl mx-auto">
          <SectionLabel index="02">{SECTION_LABELS.experience}</SectionLabel>
          <BlurText
            as="h2"
            text="Experience."
            className="font-display-xl text-5xl md:text-6xl mb-20"
          />
          <div className="relative">
            <div className="timeline-line" />
            <div className="space-y-20">
              {TIMELINE.map((item, i) => {
                const reversed = i % 2 === 1;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative pl-10 md:pl-0"
                  >
                    <TimelineDot highlight={item.highlight} />
                    <div className={`md:flex ${reversed ? "flex-row-reverse" : ""}`}>
                      <div className={`md:w-1/2 ${reversed ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}>
                        <div className="font-mono text-[11px] tracking-[0.3em] text-foreground/50 mb-1">{item.year}</div>
                        <h4 className={`text-lg md:text-xl font-medium mb-2 ${item.highlight ? "text-foreground" : "text-foreground/90"}`}>
                          {item.title}
                        </h4>
                        <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="md:w-1/2" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="py-section-gap px-margin-mobile max-w-container-max mx-auto md:px-margin-desktop">
          <SectionLabel index="03">{SECTION_LABELS.skills}</SectionLabel>
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <BlurText as="h2" text="Skills & Stack." className="font-display-xl text-5xl md:text-6xl" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              06 disciplines
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_GROUPS.map((g) => (
              <SkillCard key={g.label} group={g} />
            ))}
          </div>
        </section>

        {/* SCROLL VELOCITY BAND 2 */}
        <div className="velocity-band py-16 md:py-20 border-y border-white/5">
          <ScrollBasedVelocity
            text="FULL STACK — REACT — MONGODB — POSTGRES —"
            default_velocity={-3}
            className="text-center text-5xl font-extralight tracking-[-0.02em] text-foreground/[0.08] md:text-8xl md:leading-none uppercase"
          />
        </div>

        {/* PROJECTS */}
        <section id="projects" className="py-section-gap px-margin-mobile max-w-container-max mx-auto md:px-margin-desktop">
          <SectionLabel index="04">{SECTION_LABELS.projects}</SectionLabel>
          <div className="flex items-end justify-between mb-20 flex-wrap gap-4">
            <BlurText as="h2" text="Featured Projects." className="font-display-xl text-5xl md:text-6xl" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              02 shipped
            </span>
          </div>

          <div className="space-y-28 md:space-y-36">
            {PROJECTS.map((p, i) => (
              <div
                key={p.name}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <TiltCard intensity={3} data-cursor="view">
                    <ProjectPreview
                      name={p.name.toLowerCase().replace(/\s/g, "-")}
                      metrics={p.metrics}
                      logLines={p.logLines}
                      sparkline={p.sparkline}
                    />
                  </TiltCard>
                </div>

                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="inline-block px-3 py-1 mb-5 rounded-full bg-accent/10 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/70 border border-accent/20">
                      {p.status}
                    </span>
                    <h3 className="font-headline-lg text-3xl md:text-4xl text-foreground mb-2">
                      {p.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">
                      {p.tagline}
                    </p>
                    <p className="text-foreground/60 font-light leading-relaxed max-w-md mb-10">
                      {p.description}
                    </p>
                  </motion.div>

                  <div className="mb-10">
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
                      Architecture
                    </div>
                    <ArchFlow nodes={p.arch} />
                  </div>

                  <BouncyAccordion items={p.details} />

                  <div className="mt-8 flex gap-6">
                    {p.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                        data-cursor="link"
                        className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors"
                      >
                        {l.label}
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          arrow_outward
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* in progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-dashed border-white/12 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
            >
              <div>
                <h3 className="text-lg font-medium mb-2">More in progress</h3>
                <p className="text-foreground/50 text-sm font-light max-w-md">
                  Currently building an LLM evaluation harness and a distributed job runner.
                </p>
              </div>
              <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                shipping soon
              </span>
            </motion.div>
          </div>
        </section>

        {/* AI PLAYGROUND */}
        <section id="playground" className="py-section-gap px-margin-mobile max-w-container-max mx-auto md:px-margin-desktop">
          <SectionLabel index="05">{SECTION_LABELS.playground}</SectionLabel>
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <BlurText as="h2" text="AI Playground." className="font-display-xl text-5xl md:text-6xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { id: "regex", title: "Regex Generator", icon: "code" },
              { id: "json", title: "JSON Formatter", icon: "data_object" },
              { id: "color", title: "Color Palette", icon: "palette" },
            ].map((t) => (
              <TiltCard key={t.id} data-cursor="button">
                <button
                  onClick={() => setTool(t.id as any)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-left hover:border-white/20 transition-colors group"
                >
                  <span className="material-symbols-outlined text-3xl text-foreground/70 mb-6 block group-hover:text-foreground transition-colors">
                    {t.icon}
                  </span>
                  <div className="font-medium text-foreground mb-1">{t.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                    open tool →
                  </div>
                </button>
              </TiltCard>
            ))}
          </div>
        </section>

        <Modal open={tool === "regex"} onClose={() => setTool(null)} title="Regex Generator"><RegexTool /></Modal>
        <Modal open={tool === "json"} onClose={() => setTool(null)} title="JSON Formatter"><JsonTool /></Modal>
        <Modal open={tool === "color"} onClose={() => setTool(null)} title="Color Palette"><ColorTool /></Modal>

        {/* ACHIEVEMENTS */}
        <section className="py-section-gap px-margin-mobile max-w-container-max mx-auto md:px-margin-desktop">
          <SectionLabel index="06">{SECTION_LABELS.achievements}</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-14">
            {[
              { n: 12, label: "Projects" },
              { n: 400, label: "Coding Problems" },
              { n: 18, label: "Technologies" },
              { n: 4, label: "Certifications" },
            ].map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-white/10 pt-7"
              >
                <Counter target={a.n} suffix="+" />
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                  {a.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-section-gap px-margin-mobile max-w-container-max mx-auto md:px-margin-desktop text-center">
          <SectionLabel index="07">{SECTION_LABELS.contact}</SectionLabel>
          <BlurText
            as="h2"
            text="Let's build something."
            className="font-display-xl text-6xl md:text-8xl mb-6"
          />
          <BlurText
            text="Have a system to scale or a product to ship — say hello."
            className="text-foreground/50 font-light mb-14"
            delay={0.4}
          />
          <ContactForm />

          <div className="mt-24 flex flex-col items-center">
            <Signature />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2.8, duration: 0.8 }}
              className="mt-6 text-sm text-foreground/60"
            >
              Thank you for visiting. Let's build something meaningful.
            </motion.p>
          </div>
        </section>

        <footer id="resume" className="border-t border-white/5 py-10 px-6 flex flex-col md:flex-row justify-between items-center gap-4 max-w-container-max mx-auto text-foreground/40 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>© 2027 Vaishnavi Shukla</span>
          <div className="flex gap-6">
            <a href="https://github.com/Vaishnavi1325/" target="_blank" rel="noreferrer" data-cursor="link">GitHub</a>
            <a href="https://www.linkedin.com/in/vaishnavi1325/" target="_blank" rel="noreferrer" data-cursor="link">LinkedIn</a>
            <a href="https://docs.google.com/document/d/1cdfFdK2U9cY8Lpbt2vBe1uxsKZ5lmu76/edit?usp=sharing&ouid=102870744013068861118&rtpof=true&sd=true" data-cursor="download">Resume ↓</a>
          </div>
        </footer>
      </main>
    </>
  );
}
