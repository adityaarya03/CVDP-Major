import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/Slices/historySlice";
import Navbar from "../components/Navbar";
import TrendChart from "../components/TrendChart";
import PredictionCard from "../components/PredictionCard";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { data: history, loading } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const top10 = Array.isArray(history) ? history.slice(0, 10) : [];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <h2 className="text-2xl font-bold">Prediction Trends</h2>
        <TrendChart data={history} loading={loading} />

        <h2 className="text-xl font-semibold mt-8">Recent Predictions</h2>
        <div className="space-y-4">
          {top10.map((entry, index) => (
            <PredictionCard key={entry._id || index} data={entry} rank={index + 1} />
          ))}
        </div>
      </div>
    </>
  );
}
