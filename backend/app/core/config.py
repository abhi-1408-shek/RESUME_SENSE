"""
ResumeSense 2.0 - Core Configuration
"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

# API Settings
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# NLP Model
SPACY_MODEL = os.getenv("SPACY_MODEL", "en_core_web_sm")
