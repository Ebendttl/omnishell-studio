"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "warning" | "info";
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: "success" | "warning" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (title: string, message?: string, type: "success" | "warning" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-lg"
            >
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
                {toast.message && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
