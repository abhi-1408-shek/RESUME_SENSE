from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
import os
from pdfminer.high_level import extract_text as extract_pdf_text
from docx import Document
import textract
import tempfile
from PIL import Image

router = APIRouter()

SUPPORTED_EXTENSIONS = {"pdf", "docx", "txt", "png", "jpg", "jpeg"}


def detect_file_type(filename: str) -> str:
    ext = filename.split(".")[-1].lower()
    if ext in SUPPORTED_EXTENSIONS:
        return ext
    return "unsupported"


def extract_docx_text(file_path):
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])


def extract_txt_text(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def extract_image_text(file_path):
    # Placeholder: route to OCR module
    return None


def extract_file_text(file_path, ext):
    if ext == "pdf":
        return extract_pdf_text(file_path)
    elif ext == "docx":
        return extract_docx_text(file_path)
    elif ext == "txt":
        return extract_txt_text(file_path)
    elif ext in {"png", "jpg", "jpeg"}:
        return extract_image_text(file_path)
    else:
        return None


@router.post("/extract")
async def extract(file: UploadFile = File(...)):
    ext = detect_file_type(file.filename)
    if ext == "unsupported":
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_file_text(tmp_path, ext)
        if text is None and ext in {"png", "jpg", "jpeg"}:
            return {"text": None, "needs_ocr": True}
        return {"text": text}
    finally:
        os.remove(tmp_path)
