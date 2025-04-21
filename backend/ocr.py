from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os
try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None

router = APIRouter()

@router.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    if pytesseract is None or Image is None:
        raise HTTPException(status_code=500, detail="OCR dependencies not installed.")
    ext = file.filename.split('.')[-1].lower()
    if ext not in {"png", "jpg", "jpeg"}:
        raise HTTPException(status_code=400, detail="Only image files are supported for OCR.")
    with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        image = Image.open(tmp_path)
        text = pytesseract.image_to_string(image)
        return {"text": text}
    finally:
        os.remove(tmp_path)
