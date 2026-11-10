import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import Navbar from "../components/Navbar.jsx";
import InterviewStep3Report from "../components/InterviewStep3Report.jsx";
import BackButton from "../components/BackButton.jsx";
import { AlertCircle, Loader2 } from "lucide-react";

function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${serverUrl}/api/interview/report/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setReport(res.data);
      } catch (err) {
        console.error("Failed to load interview report:", err);
        setError(err.response?.data?.message || "Failed to load report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="py-8">
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <p className="text-sm font-medium text-gray-500">Generating assessment report...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-rose-100 shadow-sm text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-500 mx-auto mb-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Could Not Load Report</h3>
            <p className="text-xs text-gray-500 mb-5">{error}</p>
            <div className="flex justify-center gap-3">
              <BackButton label="Back to History" fallbackTo="/interview-history" />
              <button
                onClick={() => navigate("/mock-interview")}
                className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition"
              >
                Start Interview
              </button>
            </div>
          </div>
        ) : (
          <InterviewStep3Report report={report} />
        )}
      </main>
    </div>
  );
}

export default InterviewReport;
