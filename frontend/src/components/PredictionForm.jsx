// src/components/PredictionForm.jsx
import { useState } from "react";

const initialForm = {
  age: "",
  gender: "",
  chestpain: "",
  restingBP: "",
  serumcholestrol: "",
  fastingbloodsugar: "",
  restingrelectro: "",
  maxheartrate: "",
  exerciseangia: "",
  oldpeak: "",
  slope: "",
  noofmajorvessels: "",
};

export default function PredictionForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass = "border p-2 rounded w-full";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h2 className="col-span-full text-xl font-semibold mb-2">
        Predict Cardiovascular Risk
      </h2>

      {Object.keys(initialForm).map((field) => (
        <div key={field}>
          <label className="block mb-1 capitalize text-gray-700 text-sm">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="number"
            name={field}
            value={form[field]}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full text-sm"
          />
        </div>
      ))}

      <div className="col-span-full text-right">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>
    </form>
  );
}