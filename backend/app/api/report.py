from __future__ import annotations

from io import BytesIO

from fastapi import APIRouter
from fastapi.responses import Response
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from app.api.analyze import analyze
from app.schemas import AnalyzeRequest

router = APIRouter(tags=["report"])


@router.post("/report")
def report(payload: AnalyzeRequest) -> Response:
    analysis = analyze(payload)
    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4, title="ResumeAI Pro Report")
    styles = getSampleStyleSheet()
    story = [
        Paragraph("ResumeAI Pro Analysis Report", styles["Title"]),
        Spacer(1, 12),
        Paragraph(f"<b>Overall ATS Score:</b> {analysis.ats.overall_score}", styles["BodyText"]),
        Paragraph(f"<b>Target Domain:</b> {payload.target_domain or 'Not specified'}", styles["BodyText"]),
        Paragraph(f"<b>LinkedIn ID:</b> {payload.linkedin_id or 'Not specified'}", styles["BodyText"]),
        Paragraph(f"<b>Detected Skills:</b> {', '.join(analysis.profile.skills[:20])}", styles["BodyText"]),
        Paragraph(f"<b>Missing Keywords:</b> {', '.join(analysis.ats.missing_keywords[:20])}", styles["BodyText"]),
        Spacer(1, 12),
        Paragraph("<b>Top Suggestions</b>", styles["Heading2"]),
    ]
    for item in analysis.ats.suggestions[:10]:
        story.append(Paragraph(f"- {item}", styles["BodyText"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Interview Questions</b>", styles["Heading2"]))
    for item in analysis.interview.technical[:5]:
        story.append(Paragraph(f"- {item}", styles["BodyText"]))
    document.build(story)
    pdf = buffer.getvalue()
    buffer.close()
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="resumeai-pro-report.pdf"'},
    )
