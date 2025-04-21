import React, { useState } from "react";
import Header from "../components/Header";
import UploadArea from "../components/UploadArea";
import ExtractionPreview from "../components/ExtractionPreview";
import AISuggestions from "../components/AISuggestions";
import MatchScore from "../components/MatchScore";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import ExportButtons from "../components/ExportButtons";
import Loader from "../components/Loader";
import {
  extractFile,
  ocrFile,
  extractNLP,
  matchResume,
  semanticMatch,
  getAISuggestion,
  getAnalytics,
  exportResume,
} from "../utils/api";

export default function Home() {
  // ...
  const [file, setFile] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [improvedResume, setImprovedResume] = useState("");
  const [match, setMatch] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [error, setError] = useState("");
  const [jd, setJD] = useState("");
  const [semantic, setSemantic] = useState(null);

  const handleFileUpload = async (file) => {
    setFile(file);
    setLoading(true);
    setError("");
    setExtracted(null);
    setSuggestion("");
    setImprovedResume("");
    setMatch(null);
    setAnalytics(null);
    setCharts(null);
    try {
      let extractRes = await extractFile(file);
      let text = extractRes.text;
      if (extractRes.needs_ocr) {
        const ocrRes = await ocrFile(file);
        text = ocrRes.text;
      }
      const nlpRes = await extractNLP(text);
      setExtracted(nlpRes);
      // Analytics for single resume
      const analyticsRes = await getAnalytics([nlpRes]);
      setAnalytics(analyticsRes.summary);
      setCharts(analyticsRes.charts);
    } catch (err) {
      setError("Extraction failed. Please try another file.");
    }
    setLoading(false);
  };

  const handleJDChange = (e) => {
    setJD(e.target.value);
  };

  const handleMatch = async () => {
    if (!extracted || !jd) return;
    setLoading(true);
    setError("");
    try {
      const matchRes = await matchResume(
        Object.values(extracted).join(" "),
        jd
      );
      setMatch({ score: matchRes.overall_score, breakdown: matchRes.breakdown });
      const semanticRes = await semanticMatch(
        Object.values(extracted).join(" "),
        jd
      );
      setSemantic(semanticRes.semantic_score);
    } catch (err) {
      setError("Matching failed. Try again.");
    }
    setLoading(false);
  };

  const handleAISuggestion = async () => {
    if (!extracted) return;
    setLoading(true);
    setError("");
    try {
      const aiRes = await getAISuggestion(
        Object.values(extracted).join(" "),
        jd
      );
      setSuggestion(aiRes.suggestion);
      // Optionally parse improved resume from suggestion
      const improved = aiRes.suggestion.match(/Improved Resume:(.*)$/s);
      setImprovedResume(improved ? improved[1].trim() : "");
    } catch (err) {
      setError("AI suggestion failed. Try again.");
    }
    setLoading(false);
  };

  const handleExport = async (type) => {
    setExporting(type);
    setError("");
    try {
      if (type === "json") {
        const blob = new Blob([JSON.stringify(extracted, null, 2)], {
          type: "application/json",
        });
        downloadBlob(blob, "resume.json");
      } else if (type === "csv") {
        // Simple CSV export
        const csv =
          Object.keys(extracted).join(",") +
          "\n" +
          Object.values(extracted)
            .map((v) =>
              Array.isArray(v) ? '"' + v.join(";") + '"' : '"' + v + '"'
            )
            .join(",");
        const blob = new Blob([csv], { type: "text/csv" });
        downloadBlob(blob, "resume.csv");
      } else {
        // Map extracted to ResumeExportRequest schema
        const exportData = {
          name: extracted.name || "",
          emails: extracted.emails || [],
          phones: extracted.phones || [],
          links: extracted.links || [],
          education: extracted.education || [],
          work_experience: extracted.work_experience || [],
          skills: extracted.skills || [],
          summary: "" // Optionally generate a summary here
        };
        const res = await exportResume(exportData, type);
        const blob = new Blob([res], {
          type:
            type === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        downloadBlob(blob, `resume.${type}`);
      }
    } catch (err) {
      setError("Export failed. Try again.");
    }
    setExporting(null);
  };

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-950 dark:to-cyan-950 transition-all">
      <Header />
      <main className="main-content">
        <UploadArea onFileUpload={handleFileUpload} loading={loading} />
        {loading && <Loader />}
        {error && <div className="text-red-500 font-bold p-2 text-center">{error}</div>}
        {extracted && <ExtractionPreview extracted={extracted} />}
        <div className="my-8">
          <label className="block text-cyan-500 font-bold mb-2">Job Description (for matching):</label>
          <textarea
            className="w-full rounded-xl border border-cyan-300 p-3 bg-white/40 dark:bg-gray-900/40 shadow"
            rows={3}
            value={jd}
            onChange={(e) => setJD(e.target.value)}
            placeholder="Paste a job description here to see match score and AI optimization"
            disabled={loading}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 transition-all neon-glow"
              onClick={handleMatch}
              disabled={loading || !extracted || !jd}
            >
              Match Resume
            </button>
          </div>
          <AISuggestions suggestion={suggestion} improvedResume={improvedResume} loading={loading} />
          <MatchScore score={match?.score} breakdown={match?.breakdown} loading={loading} />
          <AnalyticsDashboard summary={analytics} charts={charts} loading={loading} />
          <ExportButtons onExport={handleExport} exporting={exporting} />
        </div>
      </main>
    </div>
  );
}
