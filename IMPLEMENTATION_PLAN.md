# Implementation Plan - OmniShell Studio (Public Web App)

**OmniShell Studio** is a high-performance, browser-native AI Developer Workstation and Code Sandbox built for public use. It combines an interactive CLI Shell, an AI Pair Programmer powered by Gemini, a real-time JavaScript/TypeScript REPL execution sandbox, and a bi-directional Voice Assistant into a unified, glassmorphic dark/light web application.

---

## 🎯 Architectural Strategy & Codebase Reuse

This application directly leverages the proven architecture, UI design system, state engines, and Web API integration patterns built for the portfolio site (`/home/ebendttl/portfolio-site`):

| Component / Feature | Portfolio Origin | OmniShell Studio Enhancement |
| :--- | :--- | :--- |
| **CLI & Terminal Engine** | `src/components/layout/AIChatWidget.tsx` | Extracted into modular `TerminalEngine` with tab completion, command history (`↑`/`↓`), command alias engine, and shell environment variables. |
| **JS REPL Execution Sandbox** | `AIChatWidget.tsx` (`runJSRepl`) | Full-page interactive REPL with live console capture, scope persistence (`const`/`let`/`var`), output inspector, and formatters. |
| **AI Stream Engine** | `/api/chat` + Gemini 2.0 API | System prompt customizer, multi-turn conversational context, code snippet extractors, and stream parsing. |
| **Voice Interface** | `AIChatWidget.tsx` (Web Speech API) | Hands-free continuous dictation (`SpeechRecognition`) and output text-to-speech (`SpeechSynthesis`) with active soundwave animation canvas. |
| **Command Palette (`Cmd+K`)** | `src/components/layout/CommandPalette.tsx` | Expanded palette with search filter, command execution shortcuts, session import/export, and layout switching. |
| **Design System & Theme Engine** | `ThemeToggle.tsx` + `globals.css` | Adaptive dark/light glassmorphic UI, CSS variable tokens, Framer Motion spring physics, and `@tsparticles` backdrop. |
| **Pipeline Toast Notifications** | `src/components/ui/MoreComingSoon.tsx` | Real-time workspace status toasts (e.g. "Script Executed in 12ms", "Session Exported", "Voice Sync Active"). |

---

## 🚀 Key Features for Public Users

1. **Dual-Pane Workstation**:
   - Split view balancing **CLI Shell / JS Sandbox** on the left and **AI Pair Programmer / Code Studio** on the right.
   - Resizable panes with full-screen toggle for individual modes.
2. **Interactive CLI Command Suite**:
   - `ai <prompt>` — Trigger immediate AI code generation or explanation.
   - `eval <code>` — Execute code directly in the sandbox with live return values.
   - `voice` — Toggle continuous voice dictation & text-to-speech feedback.
   - `templates` — Load instant starter templates (Algorithm visualizer, Async API fetcher, Data manipulation, AI schema builder).
   - `export` — Download full workspace session log as `.json` or `.md`.
   - `clear` / `neofetch` / `theme` — Utility commands with rich ASCII output.
3. **Live REPL Console & Output Inspector**:
   - Real-time capturing of `console.log`, `console.warn`, `console.error`, and return values.
   - Formatted syntax highlighted rendering for objects, arrays, and JSON outputs.
4. **Voice Command & Audio Visualizer**:
   - Real-time canvas waveform visualizer during speech output and microphone input.
   - Hands-free coding dictation mode.
5. **Instant Snippet Sharing & Session Storage**:
   - Automatic local storage persistence so users never lose their workspace state across browser reloads.

---

## 📂 Proposed File Structure & Scope

```
omnishell-studio/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with ThemeProvider & ParticleBackground
│   │   ├── page.tsx                  # Main Workstation Studio page
│   │   └── api/
│   │       └── chat/route.ts         # Gemini AI streaming endpoint
│   ├── components/
│   │   ├── studio/
│   │   │   ├── WorkstationLayout.tsx # Resizable dual-pane container
│   │   │   ├── TerminalPanel.tsx     # Enhanced CLI Shell & Command Processor
│   │   │   ├── ReplPanel.tsx         # Live JS execution sandbox & Console Inspector
│   │   │   ├── AiPanel.tsx           # AI pair programming view with Markdown renderer
│   │   │   └── VoiceBar.tsx          # Audio visualizer & Web Speech controller
│   │   ├── layout/
│   │   │   ├── HeaderNav.tsx         # Navbar with title, status badge, theme toggle
│   │   │   └── CommandPalette.tsx    # Cmd+K fuzzy search & command trigger modal
│   │   └── ui/
│   │       ├── ThemeToggle.tsx       # Sun/Moon animated mode toggle
│   │       ├── GlowCard.tsx          # Glassmorphic container with glowing hover effects
│   │       ├── ParticleBackground.tsx# Interactive background particle canvas
│   │       └── ToastMonitor.tsx      # Spring-animated notification toasts
│   ├── lib/
│   │   ├── repl-engine.ts            # Safe client-side JS evaluation engine
│   │   ├── speech-engine.ts          # Web Speech Synthesis & Recognition wrappers
│   │   └── templates.ts              # Pre-loaded JS & prompt templates
│   └── styles/
│       └── globals.css               # Design tokens, themes, dark/light CSS variables
```

---

## 🧪 Verification & Quality Assurance Plan

### Automated Verification
1. **TypeScript Verification**: Run `npx tsc --noEmit` to verify type safety across REPL state, AI stream chunks, and voice event handlers.
2. **Next.js Build Check**: Run `npm run build` to confirm zero static generation errors, clean SSR hydration, and route compilation.

### Manual Verification & UX Validation
1. **Terminal Command Testing**: Validate `tab` completion, arrow key history buffer (`↑`/`↓`), command alias handling, and ASCII rendering.
2. **REPL Execution Safety**: Test variable re-assignments, loop execution, console capture, and graceful error handling for syntax/runtime errors.
3. **Voice Integration**: Verify microphone dictation in Chrome/Edge/Firefox, text-to-speech synthesis, and waveform visualizer rendering.
4. **Theme Toggling & Layout**: Confirm smooth light ↔ dark transition across all panels, borders, and backdrop particles without layout shift.
