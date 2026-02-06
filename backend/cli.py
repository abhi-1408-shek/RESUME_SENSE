#!/usr/bin/env python3
"""
ResumeSense 2.0 - Command Line Interface
A CLI tool for parsing resumes and matching against job descriptions.

Usage:
    python cli.py parse resume.pdf
    python cli.py analyze resume.pdf
    python cli.py match resume.pdf --jd "job description text or file"
"""
import sys
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent))

import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.syntax import Syntax
from rich import print as rprint

from app.services.parser_service import parse_resume
from app.services.nlp_service import analyze_resume
from app.services.matcher_service import match_resume_to_jd

app = typer.Typer(
    name="resumesense",
    help="ResumeSense 2.0 - AI-Powered Resume Parser & Analytics",
    add_completion=False
)
console = Console()


@app.command()
def parse(
    file: Path = typer.Argument(..., help="Path to resume file (PDF, DOCX, TXT)"),
    output: bool = typer.Option(False, "--output", "-o", help="Output raw text only")
):
    """Extract raw text from a resume file."""
    try:
        if not file.exists():
            console.print(f"[red]Error: File not found: {file}[/red]")
            raise typer.Exit(1)
        
        text = parse_resume(file)
        
        if output:
            print(text)
        else:
            console.print(Panel(
                text[:2000] + "..." if len(text) > 2000 else text,
                title=f"[cyan]Extracted Text from {file.name}[/cyan]",
                subtitle=f"[dim]{len(text)} characters[/dim]"
            ))
            
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def analyze(
    file: Path = typer.Argument(..., help="Path to resume file"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Output as JSON")
):
    """Analyze a resume and extract structured information."""
    try:
        if not file.exists():
            console.print(f"[red]Error: File not found: {file}[/red]")
            raise typer.Exit(1)
        
        # Parse and analyze
        text = parse_resume(file)
        data = analyze_resume(text)
        
        if json_output:
            import json
            print(json.dumps(data, indent=2))
        else:
            # Display in a nice table
            console.print(f"\n[bold cyan]Resume Analysis: {file.name}[/bold cyan]\n")
            
            # Contact Info Table
            table = Table(title="Contact Information", show_header=True)
            table.add_column("Field", style="cyan")
            table.add_column("Value", style="green")
            
            table.add_row("Name", data.get("name", "N/A") or "N/A")
            table.add_row("Email(s)", ", ".join(data.get("emails", [])) or "N/A")
            table.add_row("Phone(s)", ", ".join(data.get("phones", [])) or "N/A")
            table.add_row("Links", ", ".join(data.get("links", [])[:3]) or "N/A")
            console.print(table)
            
            # Skills
            skills = data.get("skills", [])
            if skills:
                console.print(f"\n[bold]Skills ({len(skills)}):[/bold]")
                console.print(", ".join(skills))
            
            # Summary
            console.print(f"\n[dim]{data.get('summary', '')}[/dim]")
            
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def match(
    resume: Path = typer.Argument(..., help="Path to resume file"),
    jd: str = typer.Option(..., "--jd", help="Job description text or path to file")
):
    """Match a resume against a job description."""
    try:
        if not resume.exists():
            console.print(f"[red]Error: Resume not found: {resume}[/red]")
            raise typer.Exit(1)
        
        # Load JD (check if it's a file or text)
        jd_text = jd
        jd_path = Path(jd)
        if jd_path.exists():
            jd_text = jd_path.read_text()
        
        # Parse resume and match
        resume_text = parse_resume(resume)
        result = match_resume_to_jd(resume_text, jd_text)
        
        # Display results
        console.print(f"\n[bold cyan]Match Analysis[/bold cyan]\n")
        
        # Score display with color coding
        score = result["overall_score"]
        score_color = "green" if score >= 70 else "yellow" if score >= 40 else "red"
        console.print(Panel(
            f"[bold {score_color}]{score}%[/bold {score_color}]",
            title="Overall Match Score",
            expand=False
        ))
        
        # Skills analysis
        console.print("\n[bold green]Matching Skills:[/bold green]")
        matching = result.get("matching_skills", [])
        if matching:
            console.print(", ".join(matching[:15]))
        else:
            console.print("[dim]None found[/dim]")
        
        console.print("\n[bold red]Missing Skills:[/bold red]")
        missing = result.get("missing_skills", [])
        if missing:
            console.print(", ".join(missing[:15]))
        else:
            console.print("[dim]None - Great![/dim]")
        
        # Recommendations
        console.print("\n[bold]Recommendations:[/bold]")
        for rec in result.get("recommendations", []):
            console.print(f"  • {rec}")
        
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def version():
    """Show version information."""
    console.print("[cyan]ResumeSense[/cyan] 2.0.0")
    console.print("[dim]AI-Powered Resume Parser & Analytics Platform[/dim]")


if __name__ == "__main__":
    app()
