import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/10 dark:bg-gray-900/20 shadow-lg border-b border-white/10">
      <div className="flex items-center gap-3">
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text text-2xl font-extrabold tracking-tight select-none drop-shadow-lg">
          ResumeSense
        </span>
        <span className="ml-2 px-2 py-1 rounded bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-xs font-semibold text-white animate-pulse shadow">
          AI-First Resume Analyzer
        </span>
      </div>
      <ThemeToggle />
    </header>
  );
}
