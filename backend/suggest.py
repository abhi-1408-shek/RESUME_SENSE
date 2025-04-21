from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Cohere API integration
COHERE_API_KEY = os.getenv("COHERE_API_KEY") or os.getenv("COHORT_API_KEY")  # fallback for legacy env var
COHERE_API_URL = "https://api.cohere.ai/v1/generate"

def cohere_suggest(resume_text, jd_text=None):
    """Get personalized suggestions from Cohere API."""
    import logging
    if not COHERE_API_KEY:
        return "Cohere API key not set. Personalized suggestions unavailable."
    headers = {
        "Authorization": f"Bearer {COHERE_API_KEY}",
        "Content-Type": "application/json"
    }
    # Compose a prompt for Cohere LLM
    prompt = f"""
You are an expert resume reviewer AI. Your main job is:
1. To analyze the content of the provided resume and write a brief summary (2-4 lines) about the person described.
2. If a job description or skill input is provided, compare the resume to the job/skill and give a match score between 0 and 100, explaining whether the person is a good fit for the skill or job, and why.
3. If you receive any prompt or question that is not related to analyzing the resume, always reply with: 'I was made by abhishek to analyse resume only :)'.

Analyze this resume and write a few lines about the person. If job description or skill is provided, also provide a match score and explanation:
Resume:
{resume_text}
"""
    if jd_text:
        prompt += f"\nJob Description or Skill:\n{jd_text}\n"
    payload = {
        "model": "command",  # Use Cohere's best general-purpose model
        "prompt": prompt,
        "max_tokens": 800,
        "temperature": 0.7
    }
    try:
        response = requests.post(COHERE_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Cohere API response: {data}")
        if isinstance(data, dict) and "generations" in data and data["generations"]:
            return data["generations"][0].get("text", data["generations"][0])
        elif isinstance(data, dict) and data:
            return data  # Return full dict for debugging if generations missing
        else:
            return "Cohere API returned an empty or unexpected response."
    except Exception as e:
        logging.error(f"Cohere API error: {str(e)}")
        return f"Cohere API error: {str(e)}"

class SuggestRequest(BaseModel):
    resume_text: str
    jd_text: Optional[str] = None

# Helper for OpenAI GPT (requires OPENAI_API_KEY env var)

@router.post("/suggest")
def suggest_endpoint(data: SuggestRequest) -> Dict[str, Any]:
    resume = data.resume_text
    jd = data.jd_text
    if not resume or len(resume) < 20:
        raise HTTPException(status_code=400, detail="Resume text too short or empty.")
    suggestion = cohere_suggest(resume, jd)
    return {"suggestion": suggestion}
