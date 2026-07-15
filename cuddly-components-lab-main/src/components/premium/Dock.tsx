import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ITEMS = [
  { id: "home", label: "Home", href: "#home", icon: "home" },
  { id: "about", label: "About", href: "#about", icon: "person" },
  { id: "skills", label: "Skills", href: "#skills", icon: "code" },
  { id: "projects", label: "Projects", href: "#projects", icon: "grid_view" },
  { id: "experience", label: "Experience", href: "#experience", icon: "timeline" },
  { id: "contact", label: "Contact", href: "#contact", icon: "mail" },
  { id: "resume", label: "Resume", href: "https://drive.google.com/uc?export=download&id=1IGaHxcHv16C6HOgOcwnXx9QS-oFXsv5-", icon: "description", download: true },
];

function DockItem({ mouseX, icon, label, href, download }: {
  mouseX: MotionValue<number>;
  icon: string;
  label: string;
  href: string;
  download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });
  const scale = useTransform(distance, [-100, 0, 100], [1, 1.5, 1]);
  const size = useSpring(scale, { stiffness: 300, damping: 20 });

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ scale: size }}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 hover:text-foreground transition-colors"
      data-cursor={download ? "download" : "link"}
      aria-label={label}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span className="pointer-events-none absolute -top-9 rounded-md bg-foreground px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-background opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </motion.a>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-1 rounded-full border border-white/10 bg-background/60 px-3 py-2 backdrop-blur-xl shadow-2xl"
      >
        {ITEMS.map((it) => (
          <DockItem key={it.id} mouseX={mouseX} {...it} />
        ))}
      </div>
    </motion.nav>
  );
}
