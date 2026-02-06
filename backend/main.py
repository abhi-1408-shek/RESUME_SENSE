"""
ResumeSense 2.0 - FastAPI Application
Main entry point for the REST API.
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import tempfile
import os

from app.services.parser_service import parse_resume
from app.services.nlp_service import analyze_resume
from app.services.matcher_service import match_resume_to_jd
from app.services.saliency_service import analyze_resume_saliency
from app.core.config import API_HOST, API_PORT
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(
    title="ResumeSense 2.0",
    description="AI-Powered Resume Parser & Analytics Platform",
    version="2.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Models ============

class MatchRequest(BaseModel):
    resume_text: str
    jd_text: str


class AnalyzeRequest(BaseModel):
    text: str


# ============ Endpoints ============

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "running",
        "service": "ResumeSense 2.0",
        "version": "2.0.0"
    }


@app.post("/api/parse")
async def parse_file(file: UploadFile = File(...)):
    """
    Parse a resume file and extract raw text.
    
    Supports: PDF, DOCX, TXT
    """
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".docx", ".doc", ".txt"}:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. Supported: PDF, DOCX, TXT"
        )
    
    # Save to temp file and process
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        text = parse_resume(tmp_path)
        
        return {
            "success": True,
            "filename": file.filename,
            "text": text,
            "char_count": len(text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'tmp_path' in locals():
            os.unlink(tmp_path)


@app.post("/api/analyze")
async def analyze_file(file: UploadFile = File(...)):
    """
    Analyze a resume file and extract structured information.
    """
    # First parse the file
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".docx", ".doc", ".txt"}:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}"
        )
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Parse and analyze
        text = parse_resume(tmp_path)
        data = analyze_resume(text)
        
        return {
            "success": True,
            "filename": file.filename,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'tmp_path' in locals():
            os.unlink(tmp_path)


@app.post("/api/analyze/text")
async def analyze_text(request: AnalyzeRequest):
    """
    Analyze resume text directly (for already-parsed content).
    """
    if not request.text or len(request.text) < 50:
        raise HTTPException(
            status_code=400,
            detail="Text too short. Please provide more content."
        )
    
    data = analyze_resume(request.text)
    return {"success": True, "data": data}


@app.post("/api/match")
async def match_resume(request: MatchRequest):
    """
    Match resume text against a job description.
    """
    if not request.resume_text or not request.jd_text:
        raise HTTPException(
            status_code=400,
            detail="Both resume_text and jd_text are required."
        )
    
    result = match_resume_to_jd(request.resume_text, request.jd_text)
    return {"success": True, "result": result}


@app.post("/api/match/file")
async def match_file(
    file: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """
    Upload a resume file and match against job description text.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".docx", ".doc", ".txt"}:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}"
        )
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Parse, analyze, and match
        resume_text = parse_resume(tmp_path)
        data = analyze_resume(resume_text)
        match_result = match_resume_to_jd(resume_text, jd_text)
        
        return {
            "success": True,
            "filename": file.filename,
            "resume_data": data,
            "match_result": match_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'tmp_path' in locals():
            os.unlink(tmp_path)


@app.post("/api/saliency")
async def analyze_saliency(
    file: UploadFile = File(...),
    api_key: Optional[str] = Form(None)
):
    """
    Analyze a resume PDF for visual attention patterns.
    
    Uses AI to predict where a recruiter's eyes would focus during a 6-second scan.
    Returns the resume image with attention zone coordinates.
    
    Requires GOOGLE_API_KEY environment variable or api_key form field.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Saliency analysis only supports PDF files"
        )
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Analyze saliency using Gemini Vision
        result = analyze_resume_saliency(Path(tmp_path), api_key)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Saliency analysis failed")
            )
        
        return {
            "success": True,
            "filename": file.filename,
            "image_base64": result.get("image_base64"),
            "attention_zones": result.get("attention_zones", []),
            "overall_score": result.get("overall_score", 0),
            "summary": result.get("summary", "")
        }
    except HTTPException:
        raise
    except ImportError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Missing dependencies: {str(e)}. Run: pip install google-generativeai Pillow"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'tmp_path' in locals():
            os.unlink(tmp_path)


# ============ Run Server ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=API_HOST, port=API_PORT)
