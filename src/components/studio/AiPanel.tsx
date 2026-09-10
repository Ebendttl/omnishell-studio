"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, Code2, Copy, Check, SlidersHorizontal } from "lucide-react";
import { SYSTEM_PROMPTS } from "@/lib/templates";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AiPanelProps {
  messages: ChatMessage[];
  onSendMessage: (prompt: string, systemPromptId?: string) => void;
  onSendCodeToRepl: (code: string) => void;
  isStreaming: boolean;
}

export function AiPanel({
  messages,
  onSendMessage,
  onSendCodeToRepl,
  isStreaming,
}: AiPanelProps) {
  const [input, setInput] = useState("");
  const [selectedPromptId, setSelectedPromptId] = useState(SYSTEM_PROMPTS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim(), selectedPromptId);
    setInput("");
  };

  const extractCodeBlocks = (text: string): string[] => {
    const regex = /```(?:js|javascript|ts|typescript)?\n([\s\S]*?)```/g;
    const blocks: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      blocks.push(match[1].trim());
    }
    return blocks;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI Pair Programmer (Gemini Engine)</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPromptId}
            onChange={(e) => setSelectedPromptId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none"
          >
            {SYSTEM_PROMPTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const codeBlocks = extractCodeBlocks(msg.content);
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-tr from-indigo-500 to-cyan-400 text-slate-950"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600/20 text-indigo-100 border border-indigo-500/30"
                    : "bg-slate-900/90 text-slate-200 border border-slate-800 shadow-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Extract & Inject Code to REPL */}
                {codeBlocks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                    {codeBlocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-slate-950 border border-indigo-900/40 text-[11px]"
                      >
                        <div className="flex items-center gap-2 text-indigo-300 font-mono">
                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Generated Snippet #{idx + 1}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(block, `${msg.id}-${idx}`)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Copy snippet"
                          >
                            {copiedId === `${msg.id}-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onSendCodeToRepl(block)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-600/60 transition-all font-mono text-[10px]"
                          >
                            <span>Send to REPL</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isStreaming && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs italic">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AI is synthesizing code...</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center border-t border-slate-800 bg-slate-900/60 p-3 gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI pair programmer for assistance or code generation..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 disabled:opacity-50 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
