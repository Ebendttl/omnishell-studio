"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Code2, Terminal as ConsoleIcon, CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react";
import { executeJsRepl, ConsoleLogEntry, ExecutionResult } from "@/lib/repl-engine";
import { CODE_TEMPLATES } from "@/lib/templates";

interface ReplPanelProps {
  initialCode?: string;
  onCodeExecuted?: (result: ExecutionResult) => void;
}

export function ReplPanel({ initialCode, onCodeExecuted }: ReplPanelProps) {
  const [code, setCode] = useState(
    initialCode ||
      `// Interactive JS REPL Sandbox Scope
const numbers = [12, 45, 68, 23, 89, 34];
console.log("Input Dataset:", numbers);

const doubled = numbers.map(n => n * 2);
console.log("Transformed Values:", doubled);

return { count: numbers.length, sum: numbers.reduce((a, b) => a + b, 0) };`
  );

  const [logs, setLogs] = useState<ConsoleLogEntry[]>([
    {
      id: "init-1",
      type: "system",
      content: "Client-side Execution Sandbox initialized. Ready for evaluation.",
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    },
  ]);
  const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "console">("editor");

  const handleRun = () => {
    const result = executeJsRepl(code);
    setLogs((prev) => [...prev, ...result.logs]);
    setLastExecutionTime(result.executionTimeMs);
    if (onCodeExecuted) onCodeExecuted(result);
  };

  const handleClearLogs = () => {
    setLogs([]);
    setLastExecutionTime(null);
  };

  const handleSelectTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CODE_TEMPLATES.find((t) => t.id === e.target.value);
    if (selected) {
      setCode(selected.code);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>REPL Execution Sandbox</span>
          </div>

          <select
            onChange={handleSelectTemplate}
            defaultValue=""
            className="hidden sm:block bg-slate-800 border border-slate-700 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none"
          >
            <option value="" disabled>
              Load Code Template...
            </option>
            {CODE_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {lastExecutionTime !== null && (
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Exec: {lastExecutionTime}ms
            </span>
          )}

          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-400 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 relative bg-slate-950 p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Write JavaScript code here..."
            className="w-full h-full bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none resize-none font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Console Inspector Drawer */}
        <div className="h-44 border-t border-slate-800 bg-slate-900/90 flex flex-col">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2 text-slate-400">
              <ConsoleIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-[11px]">Console Output Inspector</span>
              <span className="text-[10px] text-slate-600">({logs.length} entries)</span>
            </div>

            <button
              onClick={handleClearLogs}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Clear Inspector
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[11px]">
            {logs.length === 0 ? (
              <div className="text-slate-600 italic">No console logs emitted yet. Hit 'Run' to evaluate.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[9px] text-slate-600 select-none">{log.timestamp}</span>

                  {log.type === "log" && <span className="text-slate-200">{log.content}</span>}
                  {log.type === "warn" && <span className="text-amber-400 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{log.content}</span>}
                  {log.type === "error" && <span className="text-rose-400 font-semibold">{log.content}</span>}
                  {log.type === "result" && <span className="text-emerald-300 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">{log.content}</span>}
                  {log.type === "system" && <span className="text-cyan-400 italic">{log.content}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
