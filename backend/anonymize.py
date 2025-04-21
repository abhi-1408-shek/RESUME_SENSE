from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
try:
    from presidio_analyzer import AnalyzerEngine
    from presidio_anonymizer import AnonymizerEngine
except ImportError:
    AnalyzerEngine = None
    AnonymizerEngine = None

router = APIRouter()

class AnonymizeRequest(BaseModel):
    text: str

@router.post("/anonymize")
def anonymize_endpoint(data: AnonymizeRequest) -> Dict[str, Any]:
    if AnalyzerEngine is None or AnonymizerEngine is None:
        raise HTTPException(status_code=500, detail="Presidio not installed.")
    text = data.text
    if not text or len(text) < 10:
        raise HTTPException(status_code=400, detail="Text too short or empty.")
    analyzer = AnalyzerEngine()
    anonymizer = AnonymizerEngine()
    results = analyzer.analyze(text=text, language="en")
    anonymized = anonymizer.anonymize(text=text, analyzer_results=results)
    entities = [r.entity_type for r in results]
    return {"anonymized_text": anonymized.text, "removed_entities": entities}
