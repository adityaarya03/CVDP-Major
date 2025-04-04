from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
import os

class PDFService:
    @staticmethod
    def generate_health_report_pdf(report_data, user_id):
        if not report_data:
            return None

        pdf_filename = f"health_report_{user_id}.pdf"
        pdf_path = os.path.join("static", pdf_filename)

        c = canvas.Canvas(pdf_path, pagesize=letter)
        width, height = letter
        c.setFont("Helvetica-Bold", 18)
        c.setFillColor(colors.darkblue)
        c.drawCentredString(width / 2.0, height - 60, "Health Report")

        c.setStrokeColor(colors.black)
        c.line(50, height - 70, width - 50, height - 70)

        y_position = height - 100
        c.setFont("Helvetica", 12)
        c.setFillColor(colors.black)

        # User Info
        name = report_data.get("name", "N/A")
        age = report_data.get("age", "N/A")
        gender_val = report_data.get("gender")
        gender = "Male" if gender_val == 1 else "Female" if gender_val == 0 else "N/A"

        c.drawString(50, y_position, f"Name: {name}")
        y_position -= 20
        c.drawString(50, y_position, f"User ID: {user_id}")
        y_position -= 20
        c.drawString(50, y_position, f"Age: {age}")
        y_position -= 20
        c.drawString(50, y_position, f"Gender: {gender}")

        y_position -= 30
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position, "Average Health Metrics")
        c.line(50, y_position - 5, width - 50, y_position - 5)

        c.setFont("Helvetica", 12)
        y_position -= 25

        metrics = report_data.get("average_metrics", {})
        for key, value in metrics.items():
            formatted_key = key.replace("_", " ").title()
            display_val = value if value is not None else "N/A"
            c.drawString(60, y_position, f"{formatted_key}: {display_val}")
            y_position -= 20

        # Risk score
        y_position -= 10
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position, "Overall Risk Evaluation")
        c.line(50, y_position - 5, width - 50, y_position - 5)
        y_position -= 25
        avg_risk = report_data.get("average_risk_score", "N/A")
        c.setFont("Helvetica", 12)
        c.drawString(60, y_position, f"Average Risk Score: {avg_risk}")

        # Generated timestamp (optional)
        y_position -= 40
        c.setFont("Helvetica-Oblique", 10)
        c.setFillColor(colors.grey)
        generated_at = report_data.get("generated_at")
        if generated_at:
            c.drawString(50, y_position, f"Report generated at: {str(generated_at)}")

        c.save()
        return pdf_path
