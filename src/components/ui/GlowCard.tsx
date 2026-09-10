"use client";

import React, { useState } from "react";
import { clsx } from "clsx";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "indigo" | "cyan" | "emerald" | "amber";
  interactive?: boolean;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "indigo",
  interactive = true,
}: GlowCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const glowStyles = {
    indigo: "rgba(99, 102, 241, 0.15)",
    cyan: "rgba(6, 182, 212, 0.15)",
    emerald: "rgba(16, 185, 129, 0.15)",
    amber: "rgba(245, 158, 11, 0.15)",
  }[glowColor];

  const borderGlowStyles = {
    indigo: "rgba(99, 102, 241, 0.4)",
    cyan: "rgba(6, 182, 212, 0.4)",
    emerald: "rgba(16, 185, 129, 0.4)",
    amber: "rgba(245, 158, 11, 0.4)",
  }[glowColor];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "relative rounded-xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-md transition-all duration-300 overflow-hidden",
        interactive && "hover:border-white/20 hover:-translate-y-0.5 shadow-lg",
        className
      )}
    >
      {/* Radial Hover Glow */}
      {isHovered && interactive && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles}, transparent 80%)`,
          }}
        />
      )}

      {/* Border Highlight Effect */}
      {isHovered && interactive && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
          style={{
            border: `1px solid ${borderGlowStyles}`,
            maskImage: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
