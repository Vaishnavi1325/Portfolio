"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface ScrollBasedVelocityProps {
  text: string;
  default_velocity?: number;
  className?: string;
}

function useParallax(baseVelocity = 100) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const directionFactor = useRef<number>(1);

  const x = useTransform(baseX, (v) => {
    return `${wrap(-20, -45, v)}%`;
  });

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return x;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function ScrollBasedVelocity({
  text,
  default_velocity = 5,
  className,
}: ScrollBasedVelocityProps) {
  const x = useParallax(default_velocity);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className={cn("flex whitespace-nowrap", className)}
        style={{ x }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="mr-12 inline-block">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
