'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResumeResults from '@/components/ResumeResults';
import MatchScore from '@/components/MatchScore';
import HeatmapViewer from '@/components/HeatmapViewer';
import {
  analyzeResume,
  matchResumeToJD,
  analyzeSaliency,
  ResumeData,
  MatchResult,
  SaliencyResponse
} from '@/lib/api';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [saliencyData, setSaliencyData] = useState<SaliencyResponse | null>(null);
  const [jdText, setJdText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'analyze' | 'match' | 'saliency'>('analyze');

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setResumeData(null);
    setMatchResult(null);
    setSaliencyData(null);

    if (mode === 'analyze') {
      await handleAnalyze(selectedFile);
    } else if (mode === 'saliency') {
      await handleSaliency(selectedFile);
    }
  };

  const handleAnalyze = async (selectedFile: File) => {
    setIsLoading(true);
    try {
      const response = await analyzeResume(selectedFile);
      setResumeData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!file || !jdText.trim()) {
      setError('Please upload a resume and enter a job description');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await matchResumeToJD(file, jdText);
      setResumeData(response.resume_data);
      setMatchResult(response.match_result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to match resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaliency = async (selectedFile: File) => {
    const keyToUse = apiKey || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeSaliency(selectedFile, keyToUse);
      setSaliencyData(response);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze saliency';
      if (errorMsg.includes('GOOGLE_API_KEY')) {
        setError('Please enter your Google API Key or set GOOGLE_API_KEY environment variable');
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink bg-clip-text text-transparent">
              ResumeSense
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            AI-Powered Resume Parser & Analytics Platform
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-1 inline-flex">
            <button
              onClick={() => setMode('analyze')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'analyze'
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-900'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Analyze
            </button>
            <button
              onClick={() => setMode('match')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'match'
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-900'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Match JD
            </button>
            <button
              onClick={() => setMode('saliency')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'saliency'
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-900'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              👁️ Recruiter View
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className={`grid gap-8 ${mode === 'saliency' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />

            {/* Job Description Input (only in match mode) */}
            {mode === 'match' && (
              <div className="glass-card p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Job Description
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-48 bg-dark-800/50 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50 resize-none"
                />
                <button
                  onClick={handleMatch}
                  disabled={isLoading || !file || !jdText.trim()}
                  className="btn-primary mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Match Resume'}
                </button>
              </div>
            )}

            {/* API Key Input (only in saliency mode) */}
            {mode === 'saliency' && (
              <div className="glass-card p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Google API Key (optional if set in env)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-dark-800/50 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Get free key at <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">makersuite.google.com</a>
                </p>
                {file && !saliencyData && (
                  <button
                    onClick={() => handleSaliency(file)}
                    disabled={isLoading}
                    className="btn-primary mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Analyzing with AI...' : '👁️ Analyze Recruiter View'}
                  </button>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="glass-card p-4 border-l-4 border-red-500 bg-red-500/10">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          {mode !== 'saliency' && (
            <div className="space-y-6">
              {resumeData && <ResumeResults data={resumeData} />}
              {matchResult && <MatchScore result={matchResult} />}

              {!resumeData && !isLoading && (
                <div className="glass-card p-12 text-center">
                  <div className="text-6xl mb-4 opacity-30">📄</div>
                  <p className="text-gray-500">
                    Upload a resume to see the analysis
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saliency Heatmap - Full Width */}
        {mode === 'saliency' && saliencyData && (
          <div className="mt-8">
            <HeatmapViewer
              imageBase64={saliencyData.image_base64}
              attentionZones={saliencyData.attention_zones}
              overallScore={saliencyData.overall_score}
              summary={saliencyData.summary}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>ResumeSense 2.0 • Built with Next.js & FastAPI • AI by Google Gemini</p>
        </footer>
      </div>
    </main>
  );
}
