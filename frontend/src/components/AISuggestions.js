import React from "react";

export default function AISuggestions({ suggestion, improvedResume, loading }) {
  if (loading) {
    return (
      <div className="mt-8">
        <div className="h-32 w-full bg-gradient-to-r from-fuchsia-100 via-white to-cyan-100 animate-pulse rounded-3xl" />
      </div>
    );
  }
  if (!suggestion) return null;
  return (
    <div className="mt-8 rounded-3xl p-6 bg-gradient-to-br from-fuchsia-100/60 via-white/40 to-cyan-100/60 dark:from-gray-900/40 dark:to-fuchsia-900/30 shadow-xl border border-white/10 neon-glow">
      <h2 className="text-xl font-bold mb-4 text-fuchsia-500">AI Suggestions</h2>
      <div className="mb-4 text-base text-gray-700 dark:text-gray-200 whitespace-pre-line">
        {suggestion}
      </div>
      {improvedResume && (
        <div className="mt-4">
          <h3 className="text-cyan-500 font-semibold mb-1">Improved Resume (AI):</h3>
          <div className="rounded bg-white/60 dark:bg-gray-900/30 p-3 text-sm font-mono text-gray-700 dark:text-gray-100 overflow-x-auto">
            <pre>{improvedResume}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
