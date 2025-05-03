import requests
import os

class HuggingFaceService:
    @staticmethod
    def generate_recommendations(report, height, weight):
        token = os.getenv("HF_TOKEN")
        endpoint = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        prompt = (
            f"You are a certified medical and fitness AI assistant.\n\n"
            f"Based on the user's health assessment below, generate a detailed and personalized health improvement plan. "
            f"Focus on actionable and measurable advice. Include specifics in calories, macros, food suggestions, workouts, and lifestyle changes.\n\n"
            f"Age: {report.get('age')}\n"
            f"Gender: {'Male' if report.get('gender') == 1 else 'Female'}\n"
            f"Height: {height} cm\n"
            f"Weight: {weight} kg\n"
            f"Average Risk Score: {report.get('average_risk_score')}\n"
            f"Metrics: {report.get('average_metrics')}\n\n"

            f"Generate the following sections:\n"
            f"1. 📊 **Daily Calorie & Macro Targets** - Calories, protein, carbs, fats (in grams and percentages)\n"
            f"2. 🍱 **Diet Plan** - Detailed meal plan with breakfast, lunch, dinner, and snacks. Include food names.\n"
            f"3. 🏋️ **Exercise Plan** - Weekly routine based on their fitness level. Include cardio and strength suggestions.\n"
            f"4. ⚠️ **Precautions & Lifestyle Tips** - Smoking, alcohol, sleep, and stress.\n"
            f"5. ✅ **Daily Goals Checklist** - Simple, actionable checklist format.\n\n"
            f"Be clear, concise, and supportive. Use bullet points where necessary."
        )

        response = requests.post(endpoint, headers=headers, json={
            "inputs": prompt,
            "parameters": {"return_full_text": False}
        })
        response.raise_for_status()

        result = response.json()
        full_text = result[0]["generated_text"] if isinstance(result, list) else result.get("generated_text", "")

        # Clean the output by slicing from "Health Professional:" onwards
        if "Health Professional:" in full_text:
            cleaned = full_text.split("Health Professional:")[-1].strip()
            return cleaned
        else:
            # Fallback if expected structure isn't found
            return full_text.strip()
