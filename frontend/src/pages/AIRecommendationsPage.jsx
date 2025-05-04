import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AIRecommendationsPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ai_recommendations');
    if (saved) {
      setRecommendations(saved);
    }
  }, []);

  const handleGenerate = async () => {
    if (!height || !weight) {
      toast.error('Please enter both height and weight');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/recommendations`,
        { height: Number(height), weight: Number(weight) },
        { withCredentials: true }
      );

      const data = res.data?.recommendations;
      if (!data) throw new Error('Invalid response from server');
      console.log('Recommendations:', data);
      localStorage.setItem('ai_recommendations', data);
      setRecommendations(data);
      toast.success('Recommendations generated');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch recommendations');
    }finally {
      setLoading(false);
    }
  };

  const renderRecommendations = (text) => {
    const lines = text.split('\n');
    const rendered = [];
  
    for (let line of lines) {
      if (/^###\s*(.+)/.test(line)) {
        rendered.push(
          <h2 className="text-2xl font-bold text-blue-700 mt-6 mb-2">
            {line.replace(/^###\s*/, '')}
          </h2>
        );
      } else if (/^[-*]\s+\[\s\]/.test(line)) {
        rendered.push(
          <li className="list-disc ml-6 text-green-700">{line.replace(/^[-*]\s+\[\s\]\s*/, '')}</li>
        );
      } else if (/^[-*]\s+/.test(line)) {
        rendered.push(
          <li className="list-disc ml-6">{line.replace(/^[-*]\s+/, '')}</li>
        );
      } else if (line.trim() === '') {
        rendered.push(<br />);
      } else {
        rendered.push(<p className="text-gray-800">{line}</p>);
      }
    }
  
    return <div className="space-y-2">{rendered}</div>;
  };
  

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">AI-Based Health Recommendations</h1>

        <div className="bg-white p-4 rounded shadow space-y-4">
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Generating...' : 'Generate Recommendations'}
          </button>
        </div>

        {recommendations && (
          <div className="bg-white p-6 rounded shadow prose max-w-none">
            {renderRecommendations(recommendations)}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIRecommendationsPage;
