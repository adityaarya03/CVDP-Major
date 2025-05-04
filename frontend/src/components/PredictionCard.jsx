export default function PredictionCard({ data, rank }) {
  const { average_prediction, input_data, timestamp } = data;
  const { age, gender, maxheartrate } = input_data; //

  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-blue-600">{rank}</div>
        <div>
          <p className="text-sm text-gray-500">
            {new Date(timestamp).toLocaleString()}
          </p>
          <p className="font-semibold">
            Risk Score: {(average_prediction * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            Age: {age}, Gender: {gender}, Max HR: {maxheartrate}
          </p>
        </div>
      </div>
    </div>
  );
}
