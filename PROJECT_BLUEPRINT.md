# 🚀 OmniShell Studio — Master Project Blueprint & Execution Guide

This document serves as the master architectural specification and execution guide for building **OmniShell Studio** in this workspace directory (`/home/ebendttl/omnishell-studio`).

This workspace contains three core design & implementation guides:
1. **`PROJECT_BLUEPRINT.md`**: Master architecture spec, feature roadmap, and pattern reusability guide.
2. **`IMPLEMENTATION_PLAN.md`**: Detailed step-by-step implementation strategy, component breakdown, and verification tests.
3. **`TASTESKILL_PROMPT.md`**: Taste Skill v2 anti-slop design rules, aesthetic dials, and audit guidelines.

---

## 🎯 Project Overview & Core Goals

**OmniShell Studio** is a high-performance, browser-native AI Developer Workstation and Code Sandbox built for public use. It combines:
1. **Interactive Bash-like CLI Shell**: Tab completion, command history (`↑`/`↓`), command aliases, neofetch ASCII outputs.
2. **AI Pair Programmer**: Powered by Google Gemini API streaming with system prompt customizer and Markdown code formatting.
3. **Live JS REPL Sandbox**: Real-time JavaScript execution using safe client-side scope evaluation (`new Function()`), console output capture (`log`, `warn`, `error`), and value inspection.
4. **Hands-free Voice Interface**: Web Speech API (`SpeechRecognition` listening + `SpeechSynthesis` speaking) with a dynamic canvas soundwave frequency visualizer.
5. **Command Palette (`Cmd+K` / `Ctrl+K`)**: Quick actions modal, fuzzy search, session export/import (`.json` / `.md`).
6. **Dark/Light Glassmorphic Design Token System**: Adaptive slate/indigo glass surfaces, CSS variable theme toggling, Framer Motion spring physics, and `@tsparticles` ambient background.

---

## 🛠️ Reference Codebase & Pattern Reusability

When implementing components in this workspace, refer to patterns from `/home/ebendttl/portfolio-site`:

| Feature | Portfolio Reference Source | Target Implementation in OmniShell Studio |
| :--- | :--- | :--- |
| **CLI & Terminal Engine** | `portfolio-site/src/components/layout/AIChatWidget.tsx` | `src/components/studio/TerminalPanel.tsx` |
| **JS REPL Engine** | `portfolio-site/src/components/layout/AIChatWidget.tsx` (`runJSRepl`) | `src/lib/repl-engine.ts` + `src/components/studio/ReplPanel.tsx` |
| **AI Stream Integration** | `portfolio-site/src/app/api/chat/route.ts` | `src/app/api/chat/route.ts` |
| **Voice Dictation & TTS** | `portfolio-site/src/components/layout/AIChatWidget.tsx` | `src/lib/speech-engine.ts` + `src/components/studio/VoiceBar.tsx` |
| **Theme System & Tokens** | `portfolio-site/src/components/ui/ThemeToggle.tsx` & `globals.css` | `src/components/ui/ThemeToggle.tsx` & `src/app/globals.css` |
| **Command Palette** | `portfolio-site/src/components/layout/CommandPalette.tsx` | `src/components/layout/CommandPalette.tsx` |
| **Toast Notifications** | `portfolio-site/src/components/ui/MoreComingSoon.tsx` | `src/components/ui/ToastMonitor.tsx` |

---

## 📐 Application Architecture & File Structure

```
omnishell-studio/
├── PROJECT_BLUEPRINT.md
├── IMPLEMENTATION_PLAN.md
├── TASTESKILL_PROMPT.md
├── .agents/skills/design-taste-frontend/SKILL.md
└── src/
    ├── app/
    │   ├── layout.tsx                # Root layout with ThemeProvider & ParticleBackground
    │   ├── page.tsx                  # Main Workstation Studio page
    │   └── api/
    │       └── chat/route.ts         # Gemini AI streaming POST endpoint
    ├── components/
    │   ├── studio/
    │   │   ├── WorkstationLayout.tsx # Resizable split view container
    │   │   ├── TerminalPanel.tsx     # Enhanced CLI Shell & Command Processor
    │   │   ├── ReplPanel.tsx         # Live JS execution sandbox & Console Inspector
    │   │   ├── AiPanel.tsx           # AI pair programming view with streaming Markdown
    │   │   └── VoiceBar.tsx          # Soundwave canvas visualizer & Web Speech UI
    │   ├── layout/
    │   │   ├── HeaderNav.tsx         # Header navbar with title, theme toggle & status
    │   │   └── CommandPalette.tsx    # Cmd+K fuzzy search modal
    │   └── ui/
    │       ├── ThemeToggle.tsx       # Framer Motion animated Sun/Moon toggle
    │       ├── GlowCard.tsx          # Glassmorphic card container with hover glows
    │       ├── ParticleBackground.tsx# Interactive ambient tsparticles canvas
    │       └── ToastMonitor.tsx      # Spring-animated status toasts
    ├── lib/
    │   ├── repl-engine.ts            # Safe client-side JS evaluation sandbox
    │   ├── speech-engine.ts          # Web Speech Synthesis & Dictation manager
    │   └── templates.ts              # Pre-loaded JS code & prompt starter templates
    └── styles/
        └── globals.css               # Design tokens, dark/light CSS variables
```

---

## ⚡ Execution Roadmap for New Workspace Session

1. **Initialize App & Dependencies**:
   - `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
   - Install dependencies: `lucide-react`, `framer-motion`, `@tsparticles/react`, `@tsparticles/slim`, `tsparticles`, `clsx`, `tailwind-merge`, `@radix-ui/react-dialog`, `@radix-ui/react-tabs`.
2. **Setup Git & GitHub**:
   - `git init`
   - `gh repo create Ebendttl/omnishell-studio --public --source=. --push`
3. **Build Core Design Tokens**:
   - Port adaptive CSS variables for dark/light themes to `src/app/globals.css`.
   - Implement `ThemeToggle.tsx` and `ParticleBackground.tsx`.
4. **Build Studio Components**:
   - Implement `repl-engine.ts` and `ReplPanel.tsx`.
   - Implement `TerminalPanel.tsx` with CLI commands (`ai`, `eval`, `templates`, `voice`, `export`, `clear`, `neofetch`).
   - Implement `AiPanel.tsx` with streaming `/api/chat` handler.
   - Implement `VoiceBar.tsx` with Web Speech synthesis & mic dictation + audio waveform visualizer.
   - Assemble `WorkstationLayout.tsx` and `CommandPalette.tsx`.
5. **Verify & Validate**:
   - Run `npx tsc --noEmit` and `npm run build`.
   - Verify terminal tab completion, REPL evaluation, voice speech output, and theme switching.
