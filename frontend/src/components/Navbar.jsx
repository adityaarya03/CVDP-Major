import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">CVD Predictor</Link>
      </div>
      <div className="flex gap-6">
        <Link to="/report" className="text-gray-700 hover:text-blue-600">Health Report</Link>
        <Link to="/recommendations" className="text-gray-700 hover:text-blue-600">AI Recommendations</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
      </div>
      <div className="relative">
        {/* Profile dropdown to be implemented later */}
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-white font-semibold">U</span>
        </div>
      </div>
    </nav>
  );
}
