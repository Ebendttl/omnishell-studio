"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, CornerDownLeft, Trash2, Sparkles, Play, ShieldAlert } from "lucide-react";

export interface TerminalOutput {
  id: string;
  type: "input" | "output" | "system" | "error" | "ascii";
  text: string;
}

interface TerminalPanelProps {
  outputs: TerminalOutput[];
  onExecuteCommand: (cmd: string) => void;
  onClearTerminal: () => void;
}

export function TerminalPanel({ outputs, onExecuteCommand, onClearTerminal }: TerminalPanelProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    onExecuteCommand(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInput(history[history.length - 1 - nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 font-semibold pl-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-indigo-400" />
            omnishell@studio:~
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Press 'help' for commands</span>
          <button
            onClick={onClearTerminal}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Buffer */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-200">
        {outputs.map((out) => (
          <div key={out.id} className="leading-relaxed">
            {out.type === "input" && (
              <div className="flex items-start gap-2 text-indigo-300">
                <span className="text-emerald-400 font-bold select-none">dev@omnishell:~$</span>
                <span className="break-all">{out.text}</span>
              </div>
            )}

            {out.type === "output" && (
              <div className="text-slate-300 pl-4 border-l border-slate-800 whitespace-pre-wrap">
                {out.text}
              </div>
            )}

            {out.type === "system" && (
              <div className="text-cyan-400 pl-4 whitespace-pre-wrap font-medium">
                {out.text}
              </div>
            )}

            {out.type === "error" && (
              <div className="text-rose-400 pl-4 border-l-2 border-rose-500/50 whitespace-pre-wrap">
                {out.text}
              </div>
            )}

            {out.type === "ascii" && (
              <pre className="text-indigo-400 font-bold text-[10px] leading-none overflow-x-auto p-2 bg-slate-900/50 rounded border border-indigo-900/30">
                {out.text}
              </pre>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Prompt Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center border-t border-slate-800 bg-slate-900/60 px-4 py-2.5 gap-2"
      >
        <span className="text-emerald-400 font-bold select-none">dev@omnishell:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help', 'neofetch', 'ai <prompt>', 'eval <code>')..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
        />
        <button
          type="submit"
          className="p-1 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50 transition-all"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
