import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { fetchHealthReport } from '../redux/Slices/healthReportSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

function HealthReportPage() {
  const dispatch = useDispatch();
  const { report, loading, error } = useSelector((state) => state.healthReport);

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    dispatch(fetchHealthReport());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // const downloadPDF = async () => {
  //   if (!height || !weight) {
  //     toast.error('Please enter both height and weight');
  //     return;
  //   }

  //   try {
  //     setDownloading(true);

  //     const response = await fetch('http://127.0.0.1:5000/api/report/pdf', {
  //       method: 'POST',
  //       credentials: 'include', // important for sending cookies
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ height: Number(height), weight: Number(weight) })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to generate PDF');
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'Health_Report.pdf';
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();

  //     toast.success('PDF downloaded successfully!');
  //   } catch (err) {
  //     toast.error(err.message || 'Something went wrong');
  //   } finally {
  //     setDownloading(false);
  //   }
  // };



const downloadPDF = async () => {
  if (!height || !weight) {
    toast.error('Please enter both height and weight');
    return;
  }

  try {
    setDownloading(true);
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/report/pdf`,
      { height: Number(height), weight: Number(weight) },
      {
        responseType: 'blob',
        withCredentials: true
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Health_Report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();

    toast.success('PDF downloaded successfully!');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to generate PDF');
  } finally {
    setDownloading(false);
  }
};

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Health Report</h1>

        {loading && <p>Loading report...</p>}
        {!loading && report && (
          <div className="space-y-4 border p-4 rounded bg-white shadow">
            <p><strong>Name:</strong> {report.name}</p>
            <p><strong>Age:</strong> {report.age}</p>
            <p><strong>Gender:</strong> {report.gender === 1 ? 'Male' : 'Female'}</p>
            <p><strong>Total Predictions:</strong> {report.total_entries}</p>
            <p><strong>Average Risk Score:</strong> {report.average_risk_score}</p>
            <div>
              <h2 className="text-lg font-semibold">Average Metrics:</h2>
              <ul className="list-disc pl-6">
                {Object.entries(report.average_metrics).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-gray-500">Generated at: {new Date(report.generated_at).toLocaleString()}</p>
          </div>
        )}

        {/* PDF Generation Form */}
        <div className="mt-8 bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">Download PDF Report</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height (cm)"
              className="border px-4 py-2 rounded w-full"
            />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight (kg)"
              className="border px-4 py-2 rounded w-full"
            />
          </div>
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={downloading}
          >
            {downloading ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthReportPage;
