"""
ResumeSense 2.0 - Matcher Service
Compare resume against job description and calculate match score.
"""
import re
from typing import Dict, List, Set, Any
from dataclasses import dataclass, field


@dataclass
class MatchResult:
    """Result of matching a resume against a job description."""
    overall_score: float = 0.0
    skill_score: float = 0.0
    matching_skills: List[str] = field(default_factory=list)
    missing_skills: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "overall_score": round(self.overall_score * 100, 1),
            "skill_score": round(self.skill_score * 100, 1),
            "matching_skills": self.matching_skills,
            "missing_skills": self.missing_skills,
            "recommendations": self.recommendations
        }


class MatcherService:
    """Handles resume-to-job-description matching."""
    
    # Extended stopwords for better keyword extraction
    STOPWORDS: Set[str] = {
        "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been",
        "being", "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "must", "shall", "can", "need", "dare", "ought",
        "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as",
        "into", "through", "during", "before", "after", "above", "below", "between",
        "under", "again", "further", "then", "once", "here", "there", "when", "where",
        "why", "how", "all", "each", "few", "more", "most", "other", "some", "such",
        "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just",
        "also", "now", "year", "years", "experience", "work", "working", "team", "using",
        "ability", "strong", "excellent", "good", "great", "knowledge", "skills", "skill",
        "required", "requirements", "looking", "seeking", "ideal", "candidate", "role",
        "position", "job", "company", "including", "etc", "i.e", "e.g", "well", "new"
    }
    
    @classmethod
    def match(cls, resume_text: str, jd_text: str) -> MatchResult:
        """
        Match resume against job description.
        
        Args:
            resume_text: Extracted resume text.
            jd_text: Job description text.
            
        Returns:
            MatchResult with scores and analysis.
        """
        result = MatchResult()
        
        # Extract keywords from both
        resume_keywords = cls._extract_keywords(resume_text)
        jd_keywords = cls._extract_keywords(jd_text)
        
        if not jd_keywords:
            result.recommendations.append("Job description appears to be empty or too short.")
            return result
        
        # Calculate overlap
        matching = resume_keywords & jd_keywords
        missing = jd_keywords - resume_keywords
        
        # Calculate scores
        result.skill_score = len(matching) / len(jd_keywords) if jd_keywords else 0
        result.overall_score = result.skill_score  # Can be expanded with more factors
        
        # Populate results
        result.matching_skills = sorted(list(matching))
        result.missing_skills = sorted(list(missing))
        
        # Generate recommendations
        result.recommendations = cls._generate_recommendations(result)
        
        return result
    
    @classmethod
    def _extract_keywords(cls, text: str) -> Set[str]:
        """Extract meaningful keywords from text."""
        # Normalize text
        text = text.lower()
        
        # Extract words (3+ characters)
        words = re.findall(r'\b[a-z][a-z\+\#\.]+\b', text)
        
        # Filter stopwords and short words
        keywords = {
            w for w in words 
            if len(w) >= 3 and w not in cls.STOPWORDS
        }
        
        # Also extract common tech terms (with special characters)
        tech_patterns = [
            r'c\+\+', r'c#', r'\.net', r'node\.js', r'next\.js', r'vue\.js',
            r'react\.js', r'ci/cd', r'sql', r'nosql', r'aws', r'gcp', r'api'
        ]
        for pattern in tech_patterns:
            if re.search(pattern, text):
                keywords.add(pattern.replace('\\', ''))
        
        return keywords
    
    @classmethod
    def _generate_recommendations(cls, result: MatchResult) -> List[str]:
        """Generate actionable recommendations."""
        recs = []
        
        if result.overall_score >= 0.7:
            recs.append("Strong match! Your resume aligns well with this position.")
        elif result.overall_score >= 0.4:
            recs.append("Good potential match. Consider highlighting more relevant skills.")
        else:
            recs.append("Resume could be improved for this specific role.")
        
        if result.missing_skills:
            top_missing = result.missing_skills[:5]
            recs.append(f"Consider adding these keywords: {', '.join(top_missing)}")
        
        if len(result.matching_skills) < 5:
            recs.append("Try to include more specific technical terms from the job description.")
        
        return recs


# Convenience function
def match_resume_to_jd(resume_text: str, jd_text: str) -> Dict[str, Any]:
    """Match resume against job description and return results."""
    return MatcherService.match(resume_text, jd_text).to_dict()
