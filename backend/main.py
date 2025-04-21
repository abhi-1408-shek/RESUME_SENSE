from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ResumeSense backend is running!"}

from extractor import router as extractor_router
from ocr import router as ocr_router
from nlp import router as nlp_router
from match import router as match_router
from suggest import router as suggest_router
from anonymize import router as anonymize_router
from bulk import router as bulk_router
from export import router as export_router
from analytics import router as analytics_router
from semantic_match import router as semantic_match_router
app.include_router(extractor_router, prefix="/extractor")
app.include_router(ocr_router, prefix="/ocr")
app.include_router(nlp_router, prefix="/nlp")
app.include_router(match_router, prefix="/match")
app.include_router(suggest_router, prefix="/suggest")
app.include_router(anonymize_router, prefix="/anonymize")
app.include_router(bulk_router, prefix="/bulk")
app.include_router(export_router, prefix="/export")
app.include_router(analytics_router, prefix="/analytics")
app.include_router(semantic_match_router, prefix="/semantic-match")
