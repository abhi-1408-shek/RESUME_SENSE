import React, { useState } from "react";
import Header from "../components/Header";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import ExportButtons from "../components/ExportButtons";
import Loader from "../components/Loader";
import { bulkParse, getAnalytics } from "../utils/api";

export default function Bulk() {
  const [files, setFiles] = useState([]);
  const [bulkData, setBulkData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [anonymize, setAnonymize] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleBulkUpload = async () => {
    if (!files.length) return;
    setLoading(true);
    setError("");
    try {
      const data = await bulkParse(files, anonymize);
      setBulkData(data);
      console.log("Bulk results:", data.results);
      if (!data.results || !data.results.length) {
        setError("No resumes could be parsed. Please check your files.");
        setLoading(false);
        return;
      }
      // Call analytics endpoint to get proper summary and charts
      try {
        const analyticsRes = await getAnalytics(data.results, true);
        console.log("Analytics response:", analyticsRes);
        setAnalytics(analyticsRes.summary);
        setCharts(analyticsRes.charts);
      } catch (analyticsErr) {
        console.error("Analytics error:", analyticsErr);
        setError("Analytics failed: " + (analyticsErr?.message || analyticsErr));
      }
    } catch (err) {
      setError("Bulk parsing failed. Please try again.");
    }
    setLoading(false);
  };

  const handleExport = async (type) => {
    setExporting(type);
    try {
      if (!bulkData || !bulkData.results) {
        setError('No data to export.');
        setExporting(null);
        return;
      }
      if (type === 'csv') {
        // Use CSV string from backend response
        const csv = bulkData.csv || '';
        if (!csv) throw new Error('No CSV data found.');
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadBlob(blob, 'bulk_results.csv');
      } else if (type === 'json') {
        const json = JSON.stringify(bulkData.results, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        downloadBlob(blob, 'bulk_results.json');
      } else {
        setError('Export type not supported in bulk.');
      }
    } catch (err) {
      setError('Export failed.');
    }
    setExporting(null);
  };

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-950 dark:to-cyan-950 transition-all">
      <Header />
      <div className="main-content">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-3xl p-8 border-2 border-dashed border-cyan-400 bg-white/10 dark:bg-gray-900/20 shadow-xl neon-glow flex flex-col items-center mb-8">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              multiple
              onChange={handleFileChange}
              className="mb-4"
            />
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" checked={anonymize} onChange={() => setAnonymize((a) => !a)} />
              <span className="text-sm text-cyan-600">Anonymize resumes (remove PII)</span>
            </label>
            <button
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 transition-all neon-glow"
              onClick={handleBulkUpload}
              disabled={loading || !files.length}
            >
              {loading ? "Processing..." : "Start Bulk Analysis"}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
          {loading && <Loader label="Analyzing resumes..." />}
          <AnalyticsDashboard summary={analytics} charts={charts} loading={loading} />
          <ExportButtons onExport={handleExport} exporting={exporting} />
        </main>
      </div>
    </div>
  );
}
