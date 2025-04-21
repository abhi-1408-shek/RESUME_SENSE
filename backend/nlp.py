from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import spacy
import re
from typing import List, Optional

# Load spaCy model (use en_core_web_sm for demo; swap for transformer model if needed)
nlp = spacy.load("en_core_web_sm")

router = APIRouter()

class ResumeText(BaseModel):
    text: str

EMAIL_REGEX = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
PHONE_REGEX = r"\+?\d[\d\-\s]{8,}\d"
LINK_REGEX = r"https?://[\w./-]+"


def extract_emails(text):
    return re.findall(EMAIL_REGEX, text)

def extract_phones(text):
    return re.findall(PHONE_REGEX, text)

def extract_links(text):
    return re.findall(LINK_REGEX, text)

def extract_entities(text):
    doc = nlp(text)
    entities = {"PERSON": [], "ORG": [], "GPE": [], "DATE": [], "EDUCATION": [], "WORK": []}
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            entities["PERSON"].append(ent.text)
        elif ent.label_ == "ORG":
            entities["ORG"].append(ent.text)
        elif ent.label_ == "GPE":
            entities["GPE"].append(ent.text)
        elif ent.label_ == "DATE":
            entities["DATE"].append(ent.text)
    # Heuristic for education/work
    for sent in doc.sents:
        s = sent.text.lower()
        if any(k in s for k in ["university", "college", "bachelor", "master", "phd", "degree"]):
            entities["EDUCATION"].append(sent.text)
        if any(k in s for k in ["experience", "worked at", "position", "role", "responsible for"]):
            entities["WORK"].append(sent.text)
    return entities

@router.post("/extract")
def nlp_extract(resume: ResumeText):
    text = resume.text
    if not text or len(text) < 20:
        raise HTTPException(status_code=400, detail="Resume text too short or empty.")
    emails = extract_emails(text)
    phones = extract_phones(text)
    links = extract_links(text)
    entities = extract_entities(text)
    return {
        "name": entities["PERSON"][0] if entities["PERSON"] else None,
        "emails": emails,
        "phones": phones,
        "links": links,
        "education": entities["EDUCATION"],
        "work_experience": entities["WORK"],
        "organizations": entities["ORG"],
        "locations": entities["GPE"],
        "dates": entities["DATE"]
    }
