"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "cyber" | "system">("dark");

  useEffect(() => {
    // Lock dark glass theme as standard high-agency developer aesthetic
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
          theme === "dark"
            ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium"
            : "text-slate-400 hover:text-slate-200"
        }`}
        title="Dark Tech Glass Theme"
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </button>

      <button
        onClick={() => setTheme("cyber")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
          theme === "cyber"
            ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-medium"
            : "text-slate-400 hover:text-slate-200"
        }`}
        title="Cyber Emerald Theme"
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Cyber</span>
      </button>
    </div>
  );
}
