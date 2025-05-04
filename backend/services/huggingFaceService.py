import requests
import os

class HuggingFaceService:
    @staticmethod
    def generate_recommendations(report, height, weight):
        token = os.getenv("HF_TOKEN")
        endpoint = "https://router.huggingface.co/novita/v3/openai/chat/completions"

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        prompt = (
            f"You are a certified medical and fitness AI assistant.\n\n"
            f"Based on the user's health data, generate a personalized health improvement plan.\n\n"
            f"User Profile:\n"
            f"- Age: {report.get('age')}\n"
            f"- Gender: {'Male' if report.get('gender') == 1 else 'Female'}\n"
            f"- Height: {height} cm\n"
            f"- Weight: {weight} kg\n"
            f"- Average Risk Score: {report.get('average_risk_score')}\n"
            f"- Average Metrics: {report.get('average_metrics')}\n\n"
            f"Provide these sections:\n"
            f"1. Daily Calorie & Macro Targets (with grams and %)\n"
            f"2. Sample Diet Plan (meals with food items)\n"
            f"3. Weekly Exercise Plan (cardio + strength)\n"
            f"4. Lifestyle Recommendations (alcohol, smoking, sleep)\n"
            f"5. Daily Goals Checklist\n\n"
            f"Use simple language. Bullet points are welcome."
        )

        payload = {
            "model": "deepseek/deepseek-prover-v2-671b",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1200,
            "temperature": 0.7
        }

        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        return result["choices"][0]["message"]["content"]
