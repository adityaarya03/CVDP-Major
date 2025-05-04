import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from 'recharts';
  
  export default function TrendChart({ data = [], loading }) {
    if (loading) {
      return <div className="bg-white p-4 rounded shadow">Loading trend chart...</div>;
    }
  
    if (!Array.isArray(data) || data.length === 0) {
      return <div className="bg-white p-4 rounded shadow">No prediction data to display.</div>;
    }
  
    const chartData = data.map((item) => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      score: item.average_prediction || 0,
    })).reverse();
  
    return (
      <div className="w-full h-72 bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Risk Score Trend</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  