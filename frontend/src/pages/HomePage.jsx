// HomePage.jsx
import Navbar from "../components/Navbar";
import PredictionForm from "../components/PredictionForm";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <PredictionForm />
      </div>
    </>
  );
}
