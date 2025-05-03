// src/components/LatestPrediction.jsx
export default function LatestPrediction({ result }) {
    const avg = result?.average_prediction ?? 0;
    let riskLevel = "Low Risk";
    let color = "text-green-600";
  
    if (avg > 0.8) {
      riskLevel = "High Risk";
      color = "text-red-600";
    } else if (avg > 0.5) {
      riskLevel = "Moderate Risk";
      color = "text-yellow-600";
    }
  
    return (
      <div className="bg-white shadow p-4 rounded border">
        <h2 className="text-lg font-semibold mb-2">Latest Prediction</h2>
        <p className={`text-md font-bold ${color}`}>
          Risk: {riskLevel} ({(avg * 100).toFixed(1)}%)
        </p>
        <div className="mt-2 text-sm text-gray-600">
          <ul className="list-disc ml-6">
            {Object.entries(result.predictions || {}).map(([model, val]) => (
              <li key={model}>
                {model}: {val === 1 ? "At Risk" : "No Risk"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  