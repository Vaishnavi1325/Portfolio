import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
  wrap,
} from "motion/react";

export function ScrollVelocity({
  words,
  baseVelocity = 2,
}: {
  words: string[];
  baseVelocity?: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const directionFactor = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-25, -75, v)}%`);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const line = words.join("  •  ") + "  •  ";
  return (
    <div className="overflow-hidden -my-2">
      <motion.div className="flex whitespace-nowrap font-display-xl text-5xl md:text-7xl text-foreground/10 tracking-tight" style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mr-8">{line}</span>
        ))}
      </motion.div>
    </div>
  );
}
