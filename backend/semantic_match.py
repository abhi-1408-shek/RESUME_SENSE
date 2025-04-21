from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

try:
    from sentence_transformers import SentenceTransformer, util
    model = SentenceTransformer('all-MiniLM-L6-v2')
except ImportError:
    model = None

router = APIRouter()

class SemanticMatchRequest(BaseModel):
    resume_text: str
    jd_text: str

@router.post("/semantic-match")
def semantic_match_endpoint(data: SemanticMatchRequest) -> Dict[str, Any]:
    if model is None:
        raise HTTPException(status_code=500, detail="SentenceTransformer not installed.")
    resume = data.resume_text
    jd = data.jd_text
    if not resume or not jd:
        raise HTTPException(status_code=400, detail="Both resume_text and jd_text are required.")
    resume_emb = model.encode(resume, convert_to_tensor=True)
    jd_emb = model.encode(jd, convert_to_tensor=True)
    score = util.pytorch_cos_sim(resume_emb, jd_emb).item()
    return {"semantic_score": round(score, 3)}
