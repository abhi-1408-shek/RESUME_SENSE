from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import re
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Helper to get COHORT_API_KEY securely from environment
# Make sure to set COHORT_API_KEY in your .env file
COHORT_API_KEY = os.getenv("COHORT_API_KEY")
def get_cohort_api_key():
    return COHORT_API_KEY

class MatchRequest(BaseModel):
    resume_text: str
    jd_text: str

# Simple keyword extraction for demo (replace with NLP/AI for production)
def extract_keywords(text):
    # Remove punctuation, split by whitespace, filter short words
    words = re.findall(r"\b\w{3,}\b", text.lower())
    # Remove common stopwords (expand this list as needed)
    stopwords = set(["the", "and", "for", "with", "from", "that", "this", "have", "are", "was", "you", "your", "has", "will"])
    return set([w for w in words if w not in stopwords])

def match_score(resume_text, jd_text):
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(jd_text)
    if not jd_keywords:
        return 0, 0, 0, 0, 0, []
    overlap = resume_keywords & jd_keywords
    skill_score = len(overlap) / len(jd_keywords)
    # Placeholder: experience, education, tone (could use NLP for more granularity)
    experience_score = 0.5
    education_score = 0.5
    tone_score = 0.5
    overall = 0.5 * skill_score + 0.2 * experience_score + 0.2 * education_score + 0.1 * tone_score
    missing_skills = list(jd_keywords - resume_keywords)
    return overall, skill_score, experience_score, education_score, tone_score, missing_skills

@router.post("/match")
def match_endpoint(data: MatchRequest) -> Dict[str, Any]:
    resume = data.resume_text
    jd = data.jd_text
    if not resume or not jd:
        raise HTTPException(status_code=400, detail="Both resume_text and jd_text are required.")
    overall, skill_score, experience_score, education_score, tone_score, missing_skills = match_score(resume, jd)
    return {
        "overall_score": round(overall, 2),
        "breakdown": {
            "skill_score": round(skill_score, 2),
            "experience_score": round(experience_score, 2),
            "education_score": round(education_score, 2),
            "tone_score": round(tone_score, 2)
        },
        "missing_skills": missing_skills,
        "suggested_title": "Optimized Resume for JD"
    }
