import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function extractFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE}/extractor/extract`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function ocrFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE}/ocr/ocr`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function extractNLP(text) {
  const res = await axios.post(`${API_BASE}/nlp/extract`, { text });
  return res.data;
}

export async function matchResume(resume_text, jd_text) {
  const res = await axios.post(`${API_BASE}/match/match`, { resume_text, jd_text });
  return res.data;
}

export async function semanticMatch(resume_text, jd_text) {
  const res = await axios.post(`${API_BASE}/semantic-match/semantic-match`, { resume_text, jd_text });
  return res.data;
}

export async function getAISuggestion(resume_text, jd_text) {
  const res = await axios.post(`${API_BASE}/suggest/suggest`, { resume_text, jd_text });
  return res.data;
}

export async function getAnalytics(resumes, charts = false) {
  const res = await axios.post(`${API_BASE}/analytics/summary`, { resumes, charts });
  return res.data;
}

export async function bulkParse(files, anonymize = false) {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  formData.append("anonymize", anonymize);
  const res = await axios.post(`${API_BASE}/bulk/bulk`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function exportResume(data, type = "pdf") {
  const url = type === "pdf" ? `${API_BASE}/export/pdf` : `${API_BASE}/export/docx`;
  const res = await axios.post(url, data, { responseType: "blob" });
  return res.data;
}
