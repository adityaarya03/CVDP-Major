// src/pages/HomePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/Slices/historySlice";
import { submitPrediction } from "../redux/Slices/predictionSlice";
import PredictionForm from "../components/PredictionForm";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import LatestPrediction from "../components/LatestPrediction";

export default function HomePage() {
  const dispatch = useDispatch();
  const { result, loading } = useSelector((state) => state.prediction);
  const { history } = useSelector((state) => state.history);

  // On mount: load last prediction from history
  useEffect(() => {
    dispatch(fetchHistory()).unwrap().then((data) => {
      if (data && data.length > 0) {
        dispatch({
          type: "prediction/submit/fulfilled", // mimic fulfilled state manually
          payload: data[0], // latest prediction
        });
      }
    });
  }, [dispatch]);

  const handlePredict = async (formData) => {
    try {
      await dispatch(submitPrediction(formData)).unwrap();
      toast.success("Prediction successful!");
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