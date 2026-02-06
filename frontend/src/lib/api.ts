const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ResumeData {
    name: string;
    emails: string[];
    phones: string[];
    links: string[];
    skills: string[];
    education: string[];
    experience: string[];
    summary: string;
}

export interface MatchResult {
    overall_score: number;
    skill_score: number;
    matching_skills: string[];
    missing_skills: string[];
    recommendations: string[];
}

export interface AnalyzeResponse {
    success: boolean;
    filename: string;
    data: ResumeData;
}

export interface MatchResponse {
    success: boolean;
    filename: string;
    resume_data: ResumeData;
    match_result: MatchResult;
}

export async function analyzeResume(file: File): Promise<AnalyzeResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to analyze resume');
    }

    return response.json();
}

export async function matchResumeToJD(file: File, jdText: string): Promise<MatchResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jd_text', jdText);

    const response = await fetch(`${API_BASE}/api/match/file`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to match resume');
    }

    return response.json();
}
