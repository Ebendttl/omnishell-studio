"use client";

import React, { useState } from "react";
import { TerminalPanel, TerminalOutput } from "./TerminalPanel";
import { ReplPanel } from "./ReplPanel";
import { AiPanel, ChatMessage } from "./AiPanel";
import { VoiceBar } from "./VoiceBar";
import { executeJsRepl, ExecutionResult } from "@/lib/repl-engine";
import { CODE_TEMPLATES, SYSTEM_PROMPTS } from "@/lib/templates";
import { useToast } from "@/components/ui/ToastMonitor";
import { LayoutGrid, Terminal, Code2, Sparkles, Maximize2, Split } from "lucide-react";

interface WorkstationLayoutProps {
  onOpenCommandPalette: () => void;
}

export function WorkstationLayout({ onOpenCommandPalette }: WorkstationLayoutProps) {
  const { showToast } = useToast();
  const [layoutMode, setLayoutMode] = useState<"dual" | "terminal" | "repl" | "ai">("dual");
  const [leftTab, setLeftTab] = useState<"terminal" | "repl">("terminal");
  const [replCode, setReplCode] = useState<string>("");

  // Terminal State
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalOutput[]>([
    {
      id: "welc-1",
      type: "ascii",
      text: `
  ___                  _  ____  _          _ _ 
 / _ \\ _ __ ___  _ __ (_)/ ___|| |__   ___| | |
| | | | '_ \` _ \\| '_ \\| | \\___ \\| '_ \\ / _ \\ | |
| |_| | | | | | | | | | | |___) | | | |  __/ | |
 \\___/|_| |_| |_|_| |_|_|_|____/|_| |_|\\___|_|_| STUDIO v2.4
      `,
    },
    {
      id: "welc-2",
      type: "system",
      text: "Welcome to OmniShell Studio. Browser-native AI Developer Workstation initialized.\nType 'help' for interactive CLI command reference.",
    },
  ]);

  // AI Chat State
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: "ai-init",
      role: "assistant",
      content:
        "Greetings, Developer! I am your AI Pair Programmer inside OmniShell Studio. How can we collaborate on code today?",
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Command Processor
  const handleExecuteCli = (cmd: string) => {
    const newOutput: TerminalOutput = {
      id: Math.random().toString(36).substring(2, 9),
      type: "input",
      text: cmd,
    };
    setTerminalOutputs((prev) => [...prev, newOutput]);

    const parts = cmd.trim().split(" ");
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    if (mainCmd === "help") {
      setTerminalOutputs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "output",
          text: `OmniShell Interactive CLI Reference:
  help              - Display this command manual
  neofetch          - Render OmniShell system specs & ASCII logo
  ai <prompt>       - Stream prompt directly to AI Pair Programmer
  eval <code>       - Evaluate JavaScript directly in isolated REPL sandbox
  templates         - List available code starter templates
  voice             - Trigger hands-free voice recognition mode
  export            - Download workspace session logs as .json
  clear             - Reset terminal buffer output`,
        },
      ]);
    } else if (mainCmd === "neofetch") {
      setTerminalOutputs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "output",
          text: `
  OS: OmniShell Studio Web Sandbox v2.4
  Host: Browser Client (V8 JS Engine)
  Kernel: Next.js App Router 15.x
  Uptime: Active Session
  Shell: omni-bash 5.2.15
  CPU: Gemini AI Stream Engine
  Memory: Browser Scope Persistence Active
          `,
        },
      ]);
    } else if (mainCmd === "ai") {
      if (!args) {
        setTerminalOutputs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "error",
            text: "Error: Prompt required. Usage: ai <your prompt string>",
          },
        ]);
      } else {
        handleSendMessageToAi(args);
        setTerminalOutputs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "system",
            text: `[AI Request Dispatched]: "${args}"`,
          },
        ]);
      }
    } else if (mainCmd === "eval") {
      if (!args) {
        setTerminalOutputs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "error",
            text: "Error: Code required. Usage: eval <code>",
          },
        ]);
      } else {
        const result = executeJsRepl(args);
        setTerminalOutputs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            type: result.success ? "output" : "error",
            text: `[Eval (${result.executionTimeMs}ms)]: ${
              result.logs.map((l) => l.content).join("\n") || String(result.returnValue)
            }`,
          },
        ]);
        showToast("Script Executed", `Completed in ${result.executionTimeMs}ms`, "success");
      }
    } else if (mainCmd === "clear") {
      setTerminalOutputs([]);
    } else if (mainCmd === "templates") {
      const templateList = CODE_TEMPLATES.map((t) => `• ${t.id}: ${t.name} (${t.category})`).join("\n");
      setTerminalOutputs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "output",
          text: `Starter Templates:\n${templateList}\nUse 'eval' or Command Palette (Cmd+K) to load.`,
        },
      ]);
    } else if (mainCmd === "export") {
      handleExportSession();
    } else {
      setTerminalOutputs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "error",
          text: `Command not found: '${mainCmd}'. Type 'help' for command list.`,
        },
      ]);
    }
  };

  // AI Message Handler
  const handleSendMessageToAi = async (prompt: string, systemPromptId?: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...aiMessages, userMsg],
          systemPromptId: systemPromptId || SYSTEM_PROMPTS[0].id,
        }),
      });

      if (!response.ok) throw new Error("API streaming error");

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }),
      };

      setAiMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const fallbackMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: "assistant",
        content: `Here is a solution pattern for your request:\n\n\`\`\`javascript\n// Auto generated helper\nfunction processData(input) {\n  console.log("Processing:", input);\n  return { ok: true, timestamp: Date.now() };\n}\n\nprocessData("${prompt}");\n\`\`\``,
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }),
      };
      setAiMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendCodeToRepl = (code: string) => {
    setReplCode(code);
    setLeftTab("repl");
    showToast("Snippet Loaded", "Sent code snippet to REPL Sandbox", "info");
  };

  const handleExportSession = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      terminalHistory: terminalOutputs,
      chatHistory: aiMessages,
    };
    const jsonStr = JSON.stringify(sessionData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omnishell-session-${Date.now()}.json`;
    a.click();
    showToast("Session Exported", "Downloaded workspace log as JSON", "success");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 gap-4">
      {/* Workstation Toolbar */}
      <div className="flex items-center justify-between bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLeftTab("terminal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              leftTab === "terminal"
                ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI Terminal</span>
          </button>

          <button
            onClick={() => setLeftTab("repl")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              leftTab === "repl"
                ? "bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>REPL Sandbox</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setLayoutMode("dual")}
              className={`p-1.5 rounded ${
                layoutMode === "dual" ? "bg-slate-800 text-indigo-300" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Dual Split View"
            >
              <Split className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode("terminal")}
              className={`p-1.5 rounded ${
                layoutMode === "terminal" ? "bg-slate-800 text-indigo-300" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Maximize Terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode("ai")}
              className={`p-1.5 rounded ${
                layoutMode === "ai" ? "bg-slate-800 text-indigo-300" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Maximize AI Pair Programmer"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Panes Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Pane (CLI / REPL) */}
        {(layoutMode === "dual" || layoutMode === "terminal" || layoutMode === "repl") && (
          <div
            className={`${
              layoutMode === "dual" ? "lg:col-span-6" : "lg:col-span-12"
            } h-full min-h-[420px]`}
          >
            {leftTab === "terminal" ? (
              <TerminalPanel
                outputs={terminalOutputs}
                onExecuteCommand={handleExecuteCli}
                onClearTerminal={() => setTerminalOutputs([])}
              />
            ) : (
              <ReplPanel initialCode={replCode} />
            )}
          </div>
        )}

        {/* Right Pane (AI Pair Programmer) */}
        {(layoutMode === "dual" || layoutMode === "ai") && (
          <div
            className={`${
              layoutMode === "dual" ? "lg:col-span-6" : "lg:col-span-12"
            } h-full min-h-[420px]`}
          >
            <AiPanel
              messages={aiMessages}
              onSendMessage={handleSendMessageToAi}
              onSendCodeToRepl={handleSendCodeToRepl}
              isStreaming={isStreaming}
            />
          </div>
        )}
      </div>

      {/* Bottom Voice Controller Bar */}
      <VoiceBar onDictatedText={(text) => handleExecuteCli(`ai ${text}`)} />
    </div>
  );
}
