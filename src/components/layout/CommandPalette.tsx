"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Code2, Sparkles, Mic, Download, X, Play, RefreshCw } from "lucide-react";
import { CODE_TEMPLATES, SYSTEM_PROMPTS } from "@/lib/templates";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (code: string) => void;
  onRunCliCommand: (cmd: string) => void;
  onToggleVoice: () => void;
  onExportSession: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTemplate,
  onRunCliCommand,
  onToggleVoice,
  onExportSession,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setSearch("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTemplates = CODE_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
        >
          {/* Search Header */}
          <div className="relative flex items-center border-b border-slate-800 px-4 py-3">
            <Search className="h-5 w-5 text-indigo-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search templates..."
              className="ml-3 w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            {/* Quick CLI Actions */}
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Quick Actions
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onToggleVoice();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Mic className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Toggle Hands-free Voice Dictation</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">voice</span>
                </button>

                <button
                  onClick={() => {
                    onExportSession();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Export Workspace Session (.json)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">export</span>
                </button>

                <button
                  onClick={() => {
                    onRunCliCommand("neofetch");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Terminal className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>Print Neofetch System Artwork</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">neofetch</span>
                </button>
              </div>
            </div>

            {/* Code Templates */}
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Code Starter Templates
              </div>
              <div className="space-y-1">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template.code);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <Code2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 group-hover:text-cyan-300" />
                      <div>
                        <div className="font-semibold text-slate-200">{template.name}</div>
                        <div className="text-[11px] text-slate-400 leading-tight">
                          {template.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {template.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-950/60 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Press <kbd className="px-1 bg-slate-800 rounded text-slate-300 font-mono">ESC</kbd> to exit</span>
            <span>OmniShell Studio Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
