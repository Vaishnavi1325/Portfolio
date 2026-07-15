import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  "data-cursor"?: string;
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  as = "button",
  href,
  onClick,
  type = "button",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 15, mass: 0.4 });
  const cx = useTransform(x, (v) => v * 0.5);
  const cy = useTransform(y, (v) => v * 0.5);

  function handleMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * strength);
    my.set((e.clientY - r.top - r.height / 2) * strength);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  const Comp: any = motion[as];
  return (
    <Comp
      ref={ref as any}
      href={href}
      type={as === "button" ? type : undefined}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={cn("inline-flex items-center justify-center relative", className)}
      {...rest}
    >
      <motion.span style={{ x: cx, y: cy }} className="pointer-events-none inline-flex items-center gap-2">
        {children}
      </motion.span>
    </Comp>
  );
}
