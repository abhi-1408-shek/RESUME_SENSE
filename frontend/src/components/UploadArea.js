import React, { useRef, useState } from "react";

export default function UploadArea({ onFileUpload, loading }) {
  const fileInput = useRef();
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`rounded-3xl p-8 border-2 border-dashed transition-all duration-300 ${dragActive ? "border-cyan-400 bg-cyan-50/20" : "border-white/20 bg-white/10 dark:bg-gray-900/20"} shadow-xl neon-glow`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => fileInput.current.click()}
      style={{ cursor: loading ? "not-allowed" : "pointer" }}
    >
      <input
        type="file"
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
        style={{ display: "none" }}
        ref={fileInput}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
          }
        }}
        disabled={loading}
      />
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">🚀</span>
        <span className="text-lg font-semibold text-cyan-400">Drag & Drop or Click to Upload Resume</span>
        <span className="text-xs text-gray-400">PDF, DOCX, TXT, PNG, JPG supported</span>
      </div>
    </div>
  );
}
