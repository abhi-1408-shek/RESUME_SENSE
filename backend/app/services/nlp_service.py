"""
ResumeSense 2.0 - NLP Service
Entity extraction and skill identification from resume text.
"""
import re
from typing import Dict, List, Any, Set
from dataclasses import dataclass, field


@dataclass
class ResumeData:
    """Structured resume data."""
    name: str = ""
    emails: List[str] = field(default_factory=list)
    phones: List[str] = field(default_factory=list)
    links: List[str] = field(default_factory=list)
    skills: List[str] = field(default_factory=list)
    education: List[str] = field(default_factory=list)
    experience: List[str] = field(default_factory=list)
    summary: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "emails": self.emails,
            "phones": self.phones,
            "links": self.links,
            "skills": self.skills,
            "education": self.education,
            "experience": self.experience,
            "summary": self.summary
        }


class NLPService:
    """Handles NLP-based extraction from resume text."""
    
    # Common tech skills (expandable)
    TECH_SKILLS: Set[str] = {
        # Programming Languages
        "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust",
        "swift", "kotlin", "php", "scala", "r", "matlab", "perl", "bash", "sql", "html", "css",
        # Frameworks & Libraries
        "react", "angular", "vue", "node.js", "express", "django", "flask", "fastapi",
        "spring", "rails", "laravel", "next.js", "gatsby", "svelte", "jquery", "tailwind",
        # Databases
        "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "sqlite", "oracle",
        "dynamodb", "cassandra", "neo4j", "firebase",
        # Cloud & DevOps
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible",
        "ci/cd", "linux", "git", "github", "gitlab", "bitbucket",
        # Data & ML
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn",
        "pandas", "numpy", "opencv", "nlp", "computer vision", "data science", "spark", "hadoop",
        # Other
        "agile", "scrum", "jira", "figma", "api", "rest", "graphql", "microservices"
    }
    
    # Regex patterns
    EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
    PHONE_PATTERN = re.compile(r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,}')
    URL_PATTERN = re.compile(r'https?://[^\s<>"{}|\\^`\[\]]+|www\.[^\s<>"{}|\\^`\[\]]+')
    LINKEDIN_PATTERN = re.compile(r'linkedin\.com/in/[\w-]+', re.IGNORECASE)
    GITHUB_PATTERN = re.compile(r'github\.com/[\w-]+', re.IGNORECASE)
    
    # Section headers
    EDUCATION_HEADERS = ["education", "academic", "qualification", "degree", "university", "college"]
    EXPERIENCE_HEADERS = ["experience", "employment", "work history", "professional", "career"]
    SKILLS_HEADERS = ["skills", "technical skills", "technologies", "proficiencies", "competencies"]
    
    @classmethod
    def extract(cls, text: str) -> ResumeData:
        """
        Extract structured information from resume text.
        
        Args:
            text: Raw resume text.
            
        Returns:
            ResumeData object with extracted information.
        """
        data = ResumeData()
        
        # Extract contact information
        data.emails = cls._extract_emails(text)
        data.phones = cls._extract_phones(text)
        data.links = cls._extract_links(text)
        
        # Extract name (usually first line or before email)
        data.name = cls._extract_name(text)
        
        # Extract skills
        data.skills = cls._extract_skills(text)
        
        # Extract sections
        sections = cls._split_into_sections(text)
        data.education = sections.get("education", [])
        data.experience = sections.get("experience", [])
        
        # Generate summary
        data.summary = cls._generate_summary(data)
        
        return data
    
    @classmethod
    def _extract_emails(cls, text: str) -> List[str]:
        """Extract email addresses."""
        emails = cls.EMAIL_PATTERN.findall(text)
        return list(set(emails))  # Remove duplicates
    
    @classmethod
    def _extract_phones(cls, text: str) -> List[str]:
        """Extract phone numbers."""
        phones = cls.PHONE_PATTERN.findall(text)
        # Clean and filter valid phone numbers
        cleaned = []
        for phone in phones:
            digits = re.sub(r'\D', '', phone)
            if 10 <= len(digits) <= 15:  # Valid phone length
                cleaned.append(phone.strip())
        return list(set(cleaned))
    
    @classmethod
    def _extract_links(cls, text: str) -> List[str]:
        """Extract URLs, especially LinkedIn and GitHub."""
        links = []
        
        # Find LinkedIn
        linkedin = cls.LINKEDIN_PATTERN.findall(text)
        links.extend([f"https://{l}" if not l.startswith("http") else l for l in linkedin])
        
        # Find GitHub
        github = cls.GITHUB_PATTERN.findall(text)
        links.extend([f"https://{g}" if not g.startswith("http") else g for g in github])
        
        # Find other URLs
        urls = cls.URL_PATTERN.findall(text)
        links.extend(urls)
        
        return list(set(links))
    
    @classmethod
    def _extract_name(cls, text: str) -> str:
        """Extract candidate name (best effort)."""
        lines = text.split('\n')
        
        for line in lines[:10]:  # Check first 10 lines
            line = line.strip()
            # Skip empty lines and lines with emails/phones
            if not line or '@' in line or any(c.isdigit() for c in line[:3]):
                continue
            # Skip common headers
            skip_words = ["resume", "cv", "curriculum", "portfolio", "objective", "summary"]
            if any(word in line.lower() for word in skip_words):
                continue
            # Name is likely 2-4 words, all capitalized or title case
            words = line.split()
            if 1 <= len(words) <= 5:
                # Check if it looks like a name (mostly letters)
                if all(word[0].isupper() for word in words if word):
                    return line
        
        return ""
    
    @classmethod
    def _extract_skills(cls, text: str) -> List[str]:
        """Extract technical skills from text."""
        text_lower = text.lower()
        found_skills = []
        
        for skill in cls.TECH_SKILLS:
            # Use word boundary matching
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill.title() if len(skill) > 3 else skill.upper())
        
        return sorted(list(set(found_skills)))
    
    @classmethod
    def _split_into_sections(cls, text: str) -> Dict[str, List[str]]:
        """Split resume into logical sections."""
        sections = {"education": [], "experience": []}
        lines = text.split('\n')
        
        current_section = None
        buffer = []
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Check for section headers
            if any(h in line_lower for h in cls.EDUCATION_HEADERS):
                if current_section and buffer:
                    sections[current_section] = buffer
                current_section = "education"
                buffer = []
            elif any(h in line_lower for h in cls.EXPERIENCE_HEADERS):
                if current_section and buffer:
                    sections[current_section] = buffer
                current_section = "experience"
                buffer = []
            elif any(h in line_lower for h in cls.SKILLS_HEADERS):
                if current_section and buffer:
                    sections[current_section] = buffer
                current_section = None  # Skip skills section (handled separately)
                buffer = []
            elif current_section and line.strip():
                buffer.append(line.strip())
        
        # Don't forget the last section
        if current_section and buffer:
            sections[current_section] = buffer
        
        return sections
    
    @classmethod
    def _generate_summary(cls, data: ResumeData) -> str:
        """Generate a brief summary of the resume."""
        parts = []
        
        if data.name:
            parts.append(f"Candidate: {data.name}")
        
        if data.skills:
            top_skills = data.skills[:5]
            parts.append(f"Top Skills: {', '.join(top_skills)}")
        
        if data.education:
            parts.append(f"Education entries: {len(data.education)}")
        
        if data.experience:
            parts.append(f"Experience entries: {len(data.experience)}")
        
        return " | ".join(parts) if parts else "No summary available"


# Convenience function
def analyze_resume(text: str) -> Dict[str, Any]:
    """Analyze resume text and return structured data."""
    return NLPService.extract(text).to_dict()
