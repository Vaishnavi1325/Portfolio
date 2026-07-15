import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function Signature() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 120"
      className="w-64 md:w-80 h-auto text-foreground"
      aria-label="Vaishnavi"
      role="img"
    >
      <motion.text
        x="200"
        y="62"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Caveat', cursive"
        fontSize="76"
        fontWeight="600"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: 700, strokeDashoffset: 700, fillOpacity: 0 }}
        animate={inView ? { strokeDashoffset: 0, fillOpacity: 1 } : {}}
        transition={{
          strokeDashoffset: { duration: 2.2, ease: "easeInOut" },
          fillOpacity: { delay: 1.7, duration: 0.9 },
        }}
      >
        Vaishnavi
      </motion.text>
      <motion.path
        d="M60,98 L340,98"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.3 } : {}}
        transition={{ duration: 1, delay: 2.2 }}
      />
    </svg>
  );
}
