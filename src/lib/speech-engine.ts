/**
 * Bi-directional Speech Recognition & Synthesis Engine
 * Handles hands-free dictation, audio output, and simulated frequency intensity for waveforms.
 */

// Declare Web Speech API types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export class SpeechEngine {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;
  private isSpeaking = false;
  private audioAnalyserCallback: ((intensity: number) => void) | null = null;
  private intensityInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-US";
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== "undefined" && (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ) {
    if (!this.recognition) {
      if (onError) onError("Speech Recognition not supported in this browser.");
      return;
    }

    try {
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.stopSimulatedAudioLevel();
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      this.startSimulatedAudioLevel();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (onError) onError(msg);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.stopSimulatedAudioLevel();
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown code blocks from speech output
    const cleanText = text
      .replace(/```[\s\S]*?```/g, " Code snippet omitted for brevity. ")
      .replace(/[`*_#~]/g, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.startSimulatedAudioLevel();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopSimulatedAudioLevel();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.stopSimulatedAudioLevel();
    };

    window.speechSynthesis.speak(utterance);
  }

  public cancelSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.stopSimulatedAudioLevel();
    }
  }

  public setIntensityCallback(cb: (intensity: number) => void) {
    this.audioAnalyserCallback = cb;
  }

  private startSimulatedAudioLevel() {
    if (this.intensityInterval) clearInterval(this.intensityInterval);
    this.intensityInterval = setInterval(() => {
      if (this.audioAnalyserCallback) {
        // Generate dynamic waveform intensity (0.2 to 0.95)
        const intensity = 0.2 + Math.random() * 0.75;
        this.audioAnalyserCallback(intensity);
      }
    }, 80);
  }

  private stopSimulatedAudioLevel() {
    if (this.intensityInterval) {
      clearInterval(this.intensityInterval);
      this.intensityInterval = null;
    }
    if (this.audioAnalyserCallback) {
      this.audioAnalyserCallback(0);
    }
  }
}

export const speechEngine = new SpeechEngine();
