import React from "react";

export default function ExtractionPreview({ data, loading }) {
  if (loading) {
    return (
      <div className="mt-8">
        <div className="h-32 w-full bg-gradient-to-r from-cyan-100 via-white to-cyan-100 animate-pulse rounded-3xl" />
      </div>
    );
  }
  if (!data) {
    return null;
  }
  return (
    <div className="mt-8 rounded-3xl p-6 bg-white/30 dark:bg-gray-900/40 shadow-xl border border-white/10 neon-glow">
      <h2 className="text-xl font-bold mb-4 text-cyan-500">Extracted Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name" value={data.name} highlight />
        <Field label="Emails" value={data.emails && data.emails.join(", ")} />
        <Field label="Phones" value={data.phones && data.phones.join(", ")} />
        <Field label="Links" value={data.links && data.links.join(", ")} />
        <Field label="Education" value={data.education && data.education.join("; ")} />
        <Field label="Work Experience" value={data.work_experience && data.work_experience.join("; ")} />
        <Field label="Skills" value={data.skills && data.skills.join(", ")} />
        <Field label="Organizations" value={data.organizations && data.organizations.join(", ")} />
        <Field label="Locations" value={data.locations && data.locations.join(", ")} />
        <Field label="Dates" value={data.dates && data.dates.join(", ")} />
      </div>
    </div>
  );
}

function Field({ label, value, highlight }) {
  return (
    <div className="flex flex-col">
      <span className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-fuchsia-500" : "text-cyan-400"}`}>{label}</span>
      <span className={`text-base font-mono ${highlight ? "bg-fuchsia-100/40 dark:bg-fuchsia-900/30 px-2 rounded" : ""}`}>{value || <span className="text-gray-400">—</span>}</span>
    </div>
  );
}
