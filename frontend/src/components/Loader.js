import React from "react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin neon-glow"></div>
      <span className="mt-4 text-cyan-400 font-semibold text-lg animate-pulse">{label}</span>
    </div>
  );
}
