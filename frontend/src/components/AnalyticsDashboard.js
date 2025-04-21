import React from "react";

export default function AnalyticsDashboard({ summary, charts, loading }) {
  if (loading) {
    return (
      <div className="mt-8">
        <div className="h-32 w-full bg-gradient-to-r from-cyan-100 via-white to-fuchsia-100 animate-pulse rounded-3xl" />
      </div>
    );
  }
  if (!summary) return null;
  return (
    <div className="mt-8 rounded-3xl p-6 bg-gradient-to-br from-cyan-100/60 via-white/40 to-fuchsia-100/60 dark:from-gray-900/40 dark:to-cyan-900/30 shadow-xl border border-white/10 neon-glow">
      <h2 className="text-xl font-bold mb-4 text-fuchsia-500">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Stat label="Total Resumes" value={summary.total_resumes} />
        <Stat label="Top Skills" value={Array.isArray(summary.top_skills) ? summary.top_skills.map(([s, c]) => `${s} (${c})`).join(", ") : "—"} />
        <Stat label="Top Education" value={Array.isArray(summary.top_education) ? summary.top_education.map(([e, c]) => `${e} (${c})`).join(", ") : "—"} />
        <Stat label="Top Organizations" value={Array.isArray(summary.top_organizations) ? summary.top_organizations.map(([o, c]) => `${o} (${c})`).join(", ") : "—"} />
      </div>
      {charts && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {charts.skills && <ChartImage title="Skills" data={charts.skills} />}
          {charts.education && <ChartImage title="Education" data={charts.education} />}
          {charts.organizations && <ChartImage title="Organizations" data={charts.organizations} />}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-bold uppercase tracking-wide text-cyan-400">{label}</span>
      <span className="text-base font-mono">{value || <span className="text-gray-400">—</span>}</span>
    </div>
  );
}

function ChartImage({ title, data }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-bold text-fuchsia-500 mb-2">{title}</span>
      <img src={`data:image/png;base64,${data}`} alt={title + " chart"} className="rounded shadow-lg border border-white/10" style={{ maxHeight: 180 }} />
    </div>
  );
}
