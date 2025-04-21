import React from "react";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center items-center py-4 mt-12 border-t border-white/10 dark:border-cyan-900/40 bg-gradient-to-r from-cyan-100/70 via-white/60 to-fuchsia-100/70 dark:from-gray-900/60 dark:to-cyan-950/60">
      <span className="text-center text-xs md:text-sm font-mono tracking-widest text-fuchsia-600 dark:text-cyan-300 neon-glow-futuristic drop-shadow-md" style={{letterSpacing: '0.2em'}}>
        Engineered by Abhishek
      </span>
    </footer>
  );
}
