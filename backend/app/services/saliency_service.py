"""
Saliency Analysis Service

Uses Google Gemini Vision API to analyze visual attention patterns in resumes.
This predicts where a recruiter's eyes would focus during a 6-second scan.
"""

import os
import io
import base64
import json
import re
from pathlib import Path
from typing import Optional

# PDF to Image
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

# Image processing
try:
    from PIL import Image
except ImportError:
    Image = None

# Google Gemini
try:
    import google.generativeai as genai
except ImportError:
    genai = None


class SaliencyService:
    """Analyzes resume visual attention using AI."""
    
    # Prompt for Gemini Vision
    ANALYSIS_PROMPT = """You are a recruiter analysis AI. Analyze this resume image and identify the regions that would catch a recruiter's attention during a 6-second initial scan.

Consider:
1. Visual hierarchy (headers, name, titles)
2. High-contrast elements (bold text, icons)
3. Key information areas (contact, skills, recent experience)
4. Layout flow patterns (F-pattern, Z-pattern reading)

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
    "attention_zones": [
        {
            "x_percent": 10,
            "y_percent": 5,
            "width_percent": 80,
            "height_percent": 8,
            "attention_level": 95,
            "reason": "Name and title - highest visual weight"
        }
    ],
    "overall_score": 75,
    "summary": "Resume has good visual hierarchy but skills section lacks prominence"
}

Rules:
- Provide 5-8 attention zones
- All coordinates as percentages (0-100) of image dimensions
- attention_level: 0-100 (100 = highest attention)
- Be specific about WHY each zone attracts attention
- overall_score: How well-optimized is this resume for quick scanning (0-100)"""

    @classmethod
    def is_available(cls) -> bool:
        """Check if all dependencies are available."""
        return all([fitz, Image, genai])
    
    @classmethod
    def configure_api(cls, api_key: Optional[str] = None) -> bool:
        """Configure the Gemini API with the provided key."""
        key = api_key or os.environ.get("GOOGLE_API_KEY")
        if not key:
            return False
        
        if genai:
            genai.configure(api_key=key)
            return True
        return False
    
    @classmethod
    def pdf_to_image(cls, pdf_path: Path, page_num: int = 0, dpi: int = 150) -> Optional[bytes]:
        """Convert a PDF page to PNG image bytes."""
        if not fitz:
            raise ImportError("PyMuPDF (fitz) is required for PDF conversion")
        
        try:
            doc = fitz.open(str(pdf_path))
            page = doc[page_num]
            
            # Render at specified DPI
            zoom = dpi / 72  # 72 is default PDF DPI
            matrix = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=matrix)
            
            # Convert to PNG bytes
            img_bytes = pix.tobytes("png")
            doc.close()
            
            return img_bytes
        except Exception as e:
            raise ValueError(f"Failed to convert PDF to image: {e}")
    
    @classmethod
    def image_to_base64(cls, image_bytes: bytes) -> str:
        """Convert image bytes to base64 string."""
        return base64.b64encode(image_bytes).decode("utf-8")
    
    @classmethod
    def analyze_saliency(cls, pdf_path: Path, api_key: Optional[str] = None) -> dict:
        """
        Analyze a resume PDF for visual attention patterns.
        
        Returns:
            {
                "image_base64": str,  # PNG image as base64
                "attention_zones": [...],
                "overall_score": int,
                "summary": str
            }
        """
        # Check dependencies
        if not cls.is_available():
            missing = []
            if not fitz: missing.append("pymupdf")
            if not Image: missing.append("Pillow")
            if not genai: missing.append("google-generativeai")
            raise ImportError(f"Missing dependencies: {', '.join(missing)}")
        
        # Configure API
        if not cls.configure_api(api_key):
            raise ValueError("GOOGLE_API_KEY not set. Get one at https://makersuite.google.com/app/apikey")
        
        # Convert PDF to image
        image_bytes = cls.pdf_to_image(pdf_path)
        image_base64 = cls.image_to_base64(image_bytes)
        
        # Create PIL Image for Gemini
        pil_image = Image.open(io.BytesIO(image_bytes))
        
        # Call Gemini Vision API
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content([
                cls.ANALYSIS_PROMPT,
                pil_image
            ])
            
            # Parse the response
            response_text = response.text.strip()
            
            # Try to extract JSON from the response
            # Sometimes Gemini wraps it in markdown code blocks
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                result = json.loads(json_match.group())
            else:
                raise ValueError("Could not parse JSON from Gemini response")
            
            # Add the image to the result
            result["image_base64"] = image_base64
            result["success"] = True
            
            return result
            
        except Exception as e:
            # Return a fallback with error info
            return {
                "success": False,
                "error": str(e),
                "image_base64": image_base64,
                "attention_zones": [],
                "overall_score": 0,
                "summary": f"Analysis failed: {e}"
            }


# Convenience function
def analyze_resume_saliency(pdf_path: Path, api_key: Optional[str] = None) -> dict:
    """Analyze a resume for visual attention patterns."""
    return SaliencyService.analyze_saliency(pdf_path, api_key)
