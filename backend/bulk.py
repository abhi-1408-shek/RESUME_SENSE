from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any
import tempfile, os, zipfile, io, csv
from extractor import extract_file_text, detect_file_type
from nlp import extract_entities, extract_emails, extract_phones, extract_links
try:
    from presidio_analyzer import AnalyzerEngine
    from presidio_anonymizer import AnonymizerEngine
except ImportError:
    AnalyzerEngine = None
    AnonymizerEngine = None

router = APIRouter()

@router.post("/bulk")
async def bulk_parse(
    files: List[UploadFile] = File(...),
    anonymize: bool = Form(False)
) -> Dict[str, Any]:
    try:
        results = []
        analytics = {"skills": {}, "education": 0, "work_experience": 0, "emails": 0, "phones": 0, "links": 0, "total": 0}
        for file in files:
            ext = detect_file_type(file.filename)
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as tmp:
                tmp.write(await file.read())
                tmp_path = tmp.name
            try:
                text = extract_file_text(tmp_path, ext)
                if not text:
                    continue
                entities = extract_entities(text)
                emails = extract_emails(text)
                phones = extract_phones(text)
                links = extract_links(text)
                # Simple skill extraction from text (expand as needed)
                skills = [s for s in entities.get("WORK", []) if len(s.split()) <= 3]
                if anonymize and AnalyzerEngine and AnonymizerEngine:
                    analyzer = AnalyzerEngine()
                    anonymizer = AnonymizerEngine()
                    pres_results = analyzer.analyze(text=text, language="en")
                    text = anonymizer.anonymize(text=text, analyzer_results=pres_results).text
                results.append({
                    "filename": file.filename,
                    "text": text,
                    "entities": entities,
                    "emails": emails,
                    "phones": phones,
                    "links": links,
                    "skills": skills
                })
                analytics["skills"].update({k: analytics["skills"].get(k, 0) + 1 for k in skills})
                analytics["education"] += len(entities.get("EDUCATION", []))
                analytics["work_experience"] += len(entities.get("WORK", []))
                analytics["emails"] += len(emails)
                analytics["phones"] += len(phones)
                analytics["links"] += len(links)
                analytics["total"] += 1
            finally:
                os.remove(tmp_path)
        # Prepare CSV in-memory
        csv_buffer = io.StringIO()
        writer = csv.DictWriter(csv_buffer, fieldnames=["filename", "emails", "phones", "links", "skills"])
        writer.writeheader()
        for r in results:
            writer.writerow({
                "filename": r["filename"],
                "emails": ", ".join(r["emails"]),
                "phones": ", ".join(r["phones"]),
                "links": ", ".join(r["links"]),
                "skills": ", ".join(r["skills"])
            })
        csv_data = csv_buffer.getvalue()
        return {
            "analytics": analytics,
            "results": results,
            "csv": csv_data
        }
    except Exception as e:
        import traceback
        print("Bulk parse error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Bulk parse error: {str(e)}")

