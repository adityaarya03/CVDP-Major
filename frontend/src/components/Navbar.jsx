import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/Slices/authSlice";
import { toast } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between relative z-50">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">CVD Predictor</Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Predict</Link>
        <Link to="/report" className="text-gray-700 hover:text-blue-600">Health Report</Link>
        <Link to="/recommendations" className="text-gray-700 hover:text-blue-600">AI Recommendations</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
      </div>

      {/* Burger Menu Icon */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden focus:outline-none text-blue-600"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Profile Dropdown */}
      {user && (
        <div className="hidden md:block relative" ref={dropdownRef}>
          <div
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg p-4 z-50">
              <p className="font-semibold text-gray-800 mb-1">{user.name}</p>
              <p className="text-sm text-gray-500 mb-3">Age: {user.age || 'N/A'}</p>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  toast('Account Settings not implemented yet');
                }}
                className="block w-full text-left text-sm text-blue-600 hover:underline mb-2"
              >
                Account Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col items-start p-4 md:hidden z-40">
          {user && (
            <div className="mb-4">
              <p className="font-bold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500 mb-2">Age: {user.age || 'N/A'}</p>
              <button
                onClick={() => {
                  toast('Account Settings not implemented yet');
                  setIsMobileMenuOpen(false);
                }}
                className="text-sm text-blue-600 hover:underline mb-3"
              >
                Account Settings
              </button>
            </div>
          )}
          <Link to="/" className="mb-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Predict</Link>
          <Link to="/report" className="mb-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Health Report</Link>
          <Link to="/recommendations" className="mb-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>AI Recommendations</Link>
          <Link to="/dashboard" className="mb-4 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
