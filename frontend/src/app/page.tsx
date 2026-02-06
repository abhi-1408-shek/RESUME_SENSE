'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResumeResults from '@/components/ResumeResults';
import MatchScore from '@/components/MatchScore';
import { analyzeResume, matchResumeToJD, ResumeData, MatchResult } from '@/lib/api';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [jdText, setJdText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'analyze' | 'match'>('analyze');

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setResumeData(null);
    setMatchResult(null);

    if (mode === 'analyze') {
      await handleAnalyze(selectedFile);
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
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'analyze'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-900'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Analyze Resume
            </button>
            <button
              onClick={() => setMode('match')}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'match'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-900'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Match to Job
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {/* Error Display */}
            {error && (
              <div className="glass-card p-4 border-l-4 border-red-500 bg-red-500/10">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
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
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>ResumeSense 2.0 • Built with Next.js & FastAPI</p>
        </footer>
      </div>
    </main>
  );
}
