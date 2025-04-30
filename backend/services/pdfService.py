from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import os
import textwrap

class PDFService:
    @staticmethod
    def generate_health_report_pdf(report_data, user_id, recommendations=None):
        if not report_data:
            return None

        pdf_filename = f"health_report_{user_id}.pdf"
        pdf_path = os.path.join("static", pdf_filename)

        c = canvas.Canvas(pdf_path, pagesize=letter)
        width, height = letter
        margin = 50

        styles = getSampleStyleSheet()
        normal_style = styles["Normal"]
        header_style = ParagraphStyle('Header', parent=styles['Heading2'], textColor=colors.darkblue)
        subheader_style = ParagraphStyle('SubHeader', parent=styles['Heading3'], textColor=colors.darkgreen)
        wrap_width = 90  # Max characters per line for wrapping

        # Title
        c.setFont("Helvetica-Bold", 20)
        c.setFillColor(colors.darkblue)
        c.drawCentredString(width / 2.0, height - 60, "Health Report")
        c.setStrokeColor(colors.black)
        c.line(margin, height - 70, width - margin, height - 70)

        y = height - 100
        c.setFont("Helvetica", 12)
        c.setFillColor(colors.black)

        # Basic Info
        name = report_data.get("name", "N/A")
        age = report_data.get("age", "N/A")
        gender_val = report_data.get("gender")
        gender = "Male" if gender_val == 1 else "Female" if gender_val == 0 else "N/A"

        user_info = [
            f"Name: {name}",
            f"User ID: {user_id}",
            f"Age: {age}",
            f"Gender: {gender}"
        ]
        for info in user_info:
            c.drawString(margin, y, info)
            y -= 20

        y -= 10
        # Health Metrics Header
        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(colors.darkred)
        c.drawString(margin, y, "Average Health Metrics")
        c.line(margin, y - 5, width - margin, y - 5)
        y -= 25

        c.setFont("Helvetica", 12)
        c.setFillColor(colors.black)
        metrics = report_data.get("average_metrics", {})
        for key, value in metrics.items():
            formatted_key = key.replace("_", " ").title()
            display_val = value if value is not None else "N/A"
            c.drawString(margin + 10, y, f"{formatted_key}: {display_val}")
            y -= 18

        y -= 10
        # Risk Score
        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(colors.darkred)
        c.drawString(margin, y, "Overall Risk Evaluation")
        c.line(margin, y - 5, width - margin, y - 5)
        y -= 25
        avg_risk = report_data.get("average_risk_score", "N/A")
        c.setFont("Helvetica", 12)
        c.setFillColor(colors.black)
        c.drawString(margin + 10, y, f"Average Risk Score: {avg_risk}")
        y -= 30

        # Timestamp
        generated_at = report_data.get("generated_at")
        if generated_at:
            c.setFont("Helvetica-Oblique", 10)
            c.setFillColor(colors.grey)
            c.drawString(margin, y, f"Report generated at: {str(generated_at)}")
            y -= 30

        # AI Recommendations Section
        if recommendations:
            if y < 180:  # Create space
                c.showPage()
                y = height - 80

            c.setFont("Helvetica-Bold", 14)
            c.setFillColor(colors.darkgreen)
            c.drawString(margin, y, "AI-Based Health Recommendations")
            c.line(margin, y - 5, width - margin, y - 5)
            y -= 25

            # Box background for recommendations
            box_top = y + 20
            box_bottom = y

            # Prepare wrapped lines
            c.setFont("Helvetica", 11)
            c.setFillColor(colors.black)
            for section in recommendations.split('\n\n'):
                for line in section.strip().split('\n'):
                    wrapped = textwrap.wrap(line.strip(), width=wrap_width)
                    for wline in wrapped:
                        if y < 80:
                            c.showPage()
                            y = height - 80
                            c.setFont("Helvetica", 11)
                        c.drawString(margin + 10, y, f"• {wline}")
                        y -= 16
                    y -= 6  # extra space between lines

        c.save()
        return pdf_path
