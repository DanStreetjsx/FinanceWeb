"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { cn } from "../../lib/utils";

interface SparklesTextProps {
  /**
   * The text to be displayed with sparkles.
   */
  text: string;
  /**
   * The class name to be applied to the text container.
   */
  className?: string;
  /**
   * The class name to be applied to each sparkle.
   */
  sparklesCount?: number;
  /**
   * The colors of the sparkles.
   */
  colors?: {
    first: string;
    second: string;
  };
}

const Sparkle = ({
  color,
  size,
  x,
  y,
}: {
  color: string;
  size: number;
  x: string;
  y: string;
}) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute z-10"
    style={{ left: x, top: y }}
    initial={{ scale: 0, rotate: 0 }}
    animate={{
      scale: [0, 1, 0],
      rotate: [0, 180],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: Math.random() * 3,
    }}
  >
    <path
      d="M80 0C80 0 84.2846 41.2925 101.421 58.5786C118.558 75.8647 160 80 160 80C160 80 118.558 84.1353 101.421 101.421C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.5786 101.421C41.4422 84.1353 0 80 0 80C0 80 41.4422 75.8647 58.5786 58.5786C75.7154 41.2925 80 0 80 0Z"
      fill={color}
    />
  </motion.svg>
);

export default function SparklesText({
  text,
  className,
  sparklesCount = 10,
  colors = { first: "#9E7AFF", second: "#FE8BBB" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: string; y: string; color: string; size: number }>
  >([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: sparklesCount }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: i % 2 === 0 ? colors.first : colors.second,
        size: Math.random() * 15 + 10,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, [sparklesCount, colors.first, colors.second]);

  return (
    <div className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} {...sparkle} />
      ))}
      <span className="relative z-0">{text}</span>
    </div>
  );
}
