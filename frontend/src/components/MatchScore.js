import React from "react";

export default function MatchScore({ score, breakdown, loading }) {
  const percent = Math.round((score || 0) * 100);
  return (
    <div className="rounded-3xl p-6 bg-gradient-to-tr from-cyan-100/60 via-white/40 to-fuchsia-100/60 dark:from-gray-900/40 dark:to-cyan-900/30 shadow-xl border border-white/10 neon-glow flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 text-cyan-500">Match Score</h2>
      <div className="relative w-28 h-28 flex items-center justify-center mb-4">
        <svg className="absolute top-0 left-0" width="112" height="112">
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="#e0e7ef"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="#06b6d4"
            strokeWidth="12"
            fill="none"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={2 * Math.PI * 48 * (1 - percent / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)" }}
          />
        </svg>
        <span className="text-3xl font-extrabold text-cyan-500 drop-shadow-lg">{loading ? "..." : `${percent}%`}</span>
      </div>
      {breakdown && (
        <div className="w-full grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
          {Object.entries(breakdown).map(([k, v]) => (
            <div key={k} className="flex flex-col items-center">
              <span className="font-bold text-cyan-400 uppercase">{k.replace("_", " ")}</span>
              <span className="font-mono text-base">{Math.round((v || 0) * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
