// src/pages/HomePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitPrediction } from "../redux/Slices/predictionSlice";
import { fetchLatestPrediction } from "../redux/Slices/predictionSlice";
import { fetchHistory } from "../redux/Slices/historySlice";
import PredictionForm from "../components/PredictionForm";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import LatestPrediction from "../components/LatestPrediction";

export default function HomePage() {
  const dispatch = useDispatch();
  const { result, loading } = useSelector((state) => state.prediction);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchLatestPrediction());
    }
  }, [dispatch, user]);

  const handlePredict = async (formData) => {
    try {
      await dispatch(submitPrediction(formData)).unwrap();
      toast.success("Prediction successful!");
      await dispatch(fetchHistory());
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {result && <LatestPrediction result={result} />}
        <PredictionForm onSubmit={handlePredict} loading={loading} />
      </div>
    </>
  );
}
