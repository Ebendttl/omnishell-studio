"use client";

import React from "react";
import { Terminal, Command, Cpu, Sparkles, GitBranch, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderNavProps {
  onOpenCommandPalette: () => void;
}

export function HeaderNav({ onOpenCommandPalette }: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Status Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Terminal className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">OmniShell</span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  STUDIO v2.4
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">REPL Active</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gemini Stream 14ms</span>
            </div>
          </div>
        </div>

        {/* Center Quick Command Bar */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all shadow-inner"
          >
            <Command className="h-3.5 w-3.5 text-indigo-400" />
            <span>Search actions or run CLI template...</span>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions & Social Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCommandPalette}
            className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <Command className="h-4 w-4" />
          </button>

          <a
            href="https://github.com/Ebendttl/omnishell-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700"
          >
            <GitBranch className="w-4 h-4" />
            <span className="hidden sm:inline">Source</span>
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
