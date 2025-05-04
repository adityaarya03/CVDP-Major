// src/pages/LoginPage.jsx
import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/Slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(form);
      if (response.message === "Login successful") {
        toast.success("Login successful!");

        // 👇 Fetch user profile so Redux updates `user` state
        await dispatch(fetchUserProfile());
        // setTimeout(async () => {
        //   await dispatch(fetchUserProfile());
        //   navigate("/");
        // }, 300);

        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {["email", "password"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700">{field.toUpperCase()}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Log In
        </button>
        <div className=" text-sm mt-2">
          Don't have an account?{" "}
          <Link className=" text-blue-500" to="/signup">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
