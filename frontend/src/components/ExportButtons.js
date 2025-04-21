import React from "react";

export default function ExportButtons({ onExport, exporting }) {
  return (
    <div className="flex flex-wrap gap-4 mt-6 items-center">
      <button
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 hover:from-cyan-500 hover:to-fuchsia-600 transition-all neon-glow"
        onClick={() => onExport("pdf")}
        disabled={exporting}
      >
        {exporting === "pdf" ? "Exporting..." : "Download PDF"}
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 hover:from-fuchsia-600 hover:to-cyan-500 transition-all neon-glow"
        onClick={() => onExport("docx")}
        disabled={exporting}
      >
        {exporting === "docx" ? "Exporting..." : "Download DOCX"}
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold shadow-lg hover:scale-105 hover:from-gray-800 hover:to-gray-950 transition-all neon-glow"
        onClick={() => onExport("json")}
        disabled={exporting}
      >
        {exporting === "json" ? "Exporting..." : "Download JSON"}
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 hover:from-green-500 hover:to-blue-600 transition-all neon-glow"
        onClick={() => onExport("csv")}
        disabled={exporting}
      >
        {exporting === "csv" ? "Exporting..." : "Download CSV"}
      </button>
    </div>
  );
}
