import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmniShell Studio | Browser-Native AI Developer Workstation",
  description:
    "OmniShell Studio is a browser-native AI developer workstation combining an interactive CLI shell, real-time JavaScript REPL execution sandbox, Gemini AI pair programmer streaming, and hands-free voice dictation.",
  keywords: [
    "AI Developer Workstation",
    "JavaScript REPL Sandbox",
    "CLI Shell Browser Engine",
    "Gemini AI Pair Programmer",
    "Web Speech Voice Coding",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
