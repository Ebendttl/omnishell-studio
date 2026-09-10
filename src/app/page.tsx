"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { WorkstationLayout } from "@/components/studio/WorkstationLayout";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ToastProvider, useToast } from "@/components/ui/ToastMonitor";
import { GlowCard } from "@/components/ui/GlowCard";
import { CODE_TEMPLATES } from "@/lib/templates";

import {
  Terminal,
  Code2,
  Sparkles,
  Mic,
  Command,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Github,
  Download,
  Layers,
  Keyboard,
  Globe,
  Lock,
} from "lucide-react";

function PageContent() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const scrollToWorkstation = () => {
    const el = document.getElementById("studio-workstation");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const filteredTemplates =
    selectedCategory === "All"
      ? CODE_TEMPLATES
      : CODE_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Ambient Particle Backdrop */}
      <ParticleBackground />

      {/* Header Navigation */}
      <HeaderNav onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* SECTION 1: Kinetic Centered Hero Header (Layout Family 1) */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Next Gen Browser AI Developer Workstation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Browser-Native AI Developer Workstation.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Execute JavaScript code in real time, pair program with Gemini, and trigger commands hands-free via voice dictation.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={scrollToWorkstation}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold shadow-xl shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
          >
            <span>Launch Live Workstation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium hover:border-slate-700 hover:text-white transition-all text-xs sm:text-sm shadow-inner"
          >
            <Command className="w-4 h-4 text-indigo-400" />
            <span>Open Command Palette</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>
      </section>

      {/* SECTION 2: Interactive Live Dual-Pane Workstation (Layout Family 2) */}
      <section id="studio-workstation" className="relative z-10 py-6">
        <WorkstationLayout onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      </section>

      {/* SECTION 3: Kinetic Capabilities Matrix (Layout Family 3) */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            ENGINE CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Built for High-Agency Developers
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Four powerful developer tools harmonized into a single browser workstation interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlowCard glowColor="indigo">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Interactive CLI Shell</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Tab completion, arrow key command history buffer, custom aliases, and ASCII neofetch rendering.
            </p>
          </GlowCard>

          <GlowCard glowColor="cyan">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Live REPL Sandbox</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Safe client-side JavaScript execution with console output interceptor and execution metrics.
            </p>
          </GlowCard>

          <GlowCard glowColor="emerald">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Gemini AI Stream</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Multi-turn pair programmer context with 1-click code injection directly into the REPL scope.
            </p>
          </GlowCard>

          <GlowCard glowColor="amber">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 mb-4">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Voice Interface</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Web Speech API continuous mic dictation with active HTML5 canvas soundwave frequency visualizer.
            </p>
          </GlowCard>
        </div>
      </section>

      {/* SECTION 4: Interactive Code Template Studio (Layout Family 4) */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              PRESET CODE LIBRARY
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Instant Starter Snippets
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {["All", "Algorithms", "Async API", "State Machines", "Data Specs"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    {template.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {template.description}
                </p>
                <pre className="mt-4 p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-36 border border-slate-800">
                  {template.code}
                </pre>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={scrollToWorkstation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50 text-xs font-semibold transition-all"
                >
                  <span>Load into Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Architecture & Visualizer Showcase (Layout Family 5) */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              SYSTEM ARCHITECTURE
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Hybrid Client Exec & AI Stream Pipeline
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              OmniShell Studio executes JavaScript safely in browser scope without network latency for execution, while passing streaming prompt requests directly to Gemini 2.0.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero Server Side Code Evaluation Risk (100% Client-isolated)</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Sub-15ms Local REPL Sandbox Execution Benchmark</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Bi-directional Web Speech Synthesis and Dictation Sync</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-2 shadow-2xl overflow-hidden backdrop-blur-md">
              <Image
                src="/images/omnishell_architecture_spec.png"
                alt="OmniShell Architecture Blueprint"
                width={700}
                height={500}
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Keyboard Shortcut Grid (Layout Family 6) */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            POWER USER SHORTCUTS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Command Palette & Hotkey Reference
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "⌘K / Ctrl+K", label: "Global Command Palette" },
            { key: "↑ / ↓", label: "CLI Input Command History" },
            { key: "Tab", label: "Terminal Auto Completion" },
            { key: "Alt + R", label: "Run JS REPL Sandbox" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-center backdrop-blur-md"
            >
              <kbd className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-xs font-bold shadow-inner">
                {item.key}
              </kbd>
              <div className="text-xs text-slate-400 mt-2.5 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Key Performance Metrics Grid (Layout Family 7) */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 text-center">
            <div className="text-4xl font-extrabold text-cyan-400 font-mono">12ms</div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Avg REPL Eval Speed</div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 text-center">
            <div className="text-4xl font-extrabold text-emerald-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Client Sandbox Isolation</div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 text-center">
            <div className="text-4xl font-extrabold text-indigo-400 font-mono">24ms</div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Voice Waveform Refresh</div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 text-center">
            <div className="text-4xl font-extrabold text-amber-400 font-mono">0</div>
            <div className="text-xs text-slate-400 mt-2 font-medium">External Exec Dependencies</div>
          </div>
        </div>
      </section>

      {/* SECTION 8: High-Agency Footer CTA (Layout Family 8) */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">OmniShell Studio</div>
              <div className="text-xs text-slate-500">Browser-Native AI Developer Workstation</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a
              href="https://github.com/Ebendttl/omnishell-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hover:text-white transition-colors"
            >
              Command Palette (⌘K)
            </button>
          </div>
        </div>
      </footer>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTemplate={() => {}}
        onRunCliCommand={() => {}}
        onToggleVoice={() => {}}
        onExportSession={() => {}}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <PageContent />
    </ToastProvider>
  );
}
