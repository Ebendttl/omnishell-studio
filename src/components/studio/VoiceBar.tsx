"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX, Radio, Sparkles } from "lucide-react";
import { speechEngine } from "@/lib/speech-engine";

interface VoiceBarProps {
  onDictatedText: (text: string) => void;
}

export function VoiceBar({ onDictatedText }: VoiceBarProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    speechEngine.setIntensityCallback((val) => setIntensity(val));
  }, []);

  // Render dynamic audio frequency soundwave canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.08;

      const active = isListening || isSpeaking;
      const currentIntensity = active ? Math.max(intensity, 0.25) : 0.05;

      const lines = [
        { color: "rgba(99, 102, 241, 0.8)", speed: 1, height: 14 },
        { color: "rgba(6, 182, 212, 0.7)", speed: 1.4, height: 10 },
        { color: "rgba(16, 185, 129, 0.6)", speed: 0.8, height: 8 },
      ];

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = line.color;

        for (let x = 0; x < canvas.width; x += 2) {
          const y =
            canvas.height / 2 +
            Math.sin(x * 0.05 + step * line.speed) * line.height * currentIntensity;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animId);
  }, [isListening, isSpeaking, intensity]);

  const toggleListening = () => {
    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
    } else {
      speechEngine.startListening(
        (transcript, isFinal) => {
          if (isFinal) {
            onDictatedText(transcript);
          }
        },
        (err) => console.warn("Voice dictation error:", err),
        () => setIsListening(false)
      );
      setIsListening(true);
    }
  };

  const handleTestSpeech = () => {
    if (isSpeaking) {
      speechEngine.cancelSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechEngine.speak("Voice interface active. Ready for hands-free coding commands.", () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 shadow-xl backdrop-blur-md">
      {/* Mic Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
            isListening
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
              : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
          }`}
        >
          {isListening ? <Mic className="w-4 h-4 text-rose-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
          <span>{isListening ? "Listening..." : "Voice Dictation"}</span>
        </button>

        <button
          onClick={handleTestSpeech}
          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
          title="Test Speech Output"
        >
          {isSpeaking ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Waveform Canvas */}
      <div className="flex-1 mx-4 h-8 relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={280}
          height={32}
          className="w-full max-w-xs h-full"
        />
      </div>

      {/* Mode Badge */}
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
        <Radio className="w-3.5 h-3.5 text-emerald-400" />
        <span>Web Speech Sync</span>
      </div>
    </div>
  );
}
