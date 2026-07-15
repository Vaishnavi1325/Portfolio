import { motion, useInView } from "motion/react";
import { useRef, type ElementType } from "react";

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  by?: "word" | "line" | "char";
  stagger?: number;
  once?: boolean;
}

export function BlurText({
  text,
  as: Tag = "div",
  className,
  delay = 0,
  by = "word",
  stagger = 0.06,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.3 });
  const parts =
    by === "char" ? text.split("") : by === "line" ? text.split("\n") : text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      <span className="inline-block">
        {parts.map((p, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
            animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {p}
            {by === "word" && i < parts.length - 1 ? "\u00A0" : ""}
            {by === "line" && i < parts.length - 1 ? <br /> : null}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
}
