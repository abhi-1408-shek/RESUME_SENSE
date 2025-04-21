import matplotlib
matplotlib.use('Agg')
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import Counter
import matplotlib.pyplot as plt
import io
import base64

router = APIRouter()

class ResumeAnalyticsRequest(BaseModel):
    resumes: List[Dict[str, Any]]
    charts: bool = False  # Whether to return chart images as base64

def top_n(counter, n=10):
    return counter.most_common(n)

def make_chart(counter, title, xlabel, ylabel, n=10):
    items = counter.most_common(n)
    labels, values = zip(*items) if items else ([],[])
    fig, ax = plt.subplots(figsize=(6,3))
    ax.bar(labels, values)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    plt.xticks(rotation=30, ha='right')
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

@router.post("/summary")
def analytics_summary(data: ResumeAnalyticsRequest):
    resumes = data.resumes
    if not resumes:
        raise HTTPException(status_code=400, detail="No resumes provided.")
    skill_counter = Counter()
    edu_counter = Counter()
    org_counter = Counter()
    for r in resumes:
        skill_counter.update(r.get("skills", []))
        edu_counter.update(r.get("education", []))
        org_counter.update(r.get("organizations", []))
    summary = {
        "top_skills": top_n(skill_counter),
        "top_education": top_n(edu_counter),
        "top_organizations": top_n(org_counter),
        "total_resumes": len(resumes)
    }
    charts = {}
    if data.charts:
        charts["skills"] = make_chart(skill_counter, "Top Skills", "Skill", "Count")
        charts["education"] = make_chart(edu_counter, "Top Education", "Education", "Count")
        charts["organizations"] = make_chart(org_counter, "Top Organizations", "Organization", "Count")
    return {"summary": summary, "charts": charts}
