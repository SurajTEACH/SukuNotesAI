import React from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Award,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Zap,
  ArrowRight,
  RotateCcw,
  History,
  Printer,
  ChevronDown,
} from "lucide-react";
import BackButton from "./BackButton";

function InterviewStep3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Report Data Available</h3>
        <p className="text-gray-500 mb-6">We could not load your interview assessment.</p>
        <button
          onClick={() => navigate("/mock-interview")}
          className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition"
        >
          Start New Interview
        </button>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
    role = "Software Engineer",
    mode = "Technical",
    experience = "1-3 Years",
  } = report;

  const getScoreVerdict = (score) => {
    if (score >= 8.5) return { text: "Outstanding Candidate", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (score >= 7.0) return { text: "Strong Candidate", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" };
    if (score >= 5.0) return { text: "Competent - Needs Polish", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" };
    return { text: "Needs Significant Practice", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200" };
  };

  const verdict = getScoreVerdict(finalScore);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <BackButton label="Back to Interviews" fallbackTo="/mock-interview" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>
          <button
            onClick={() => navigate("/interview-history")}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>

      {/* Main Hero Card */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100 mb-3">
              <Award className="h-3.5 w-3.5" />
              Interview Evaluation Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {role} Interview Assessment
            </h1>
            <p className="text-sm text-gray-500">
              Mode: <span className="font-medium text-gray-700">{mode}</span> · Experience:{" "}
              <span className="font-medium text-gray-700">{experience}</span>
            </p>
          </div>

          {/* Big Score Ring */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="relative flex items-center justify-center w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke={finalScore >= 7 ? "#10b981" : finalScore >= 5 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - Math.min(finalScore, 10) / 10)}`}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold text-gray-900">{finalScore}</span>
                <span className="text-[10px] text-gray-400 block -mt-1">/ 10</span>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Overall Score
              </span>
              <span className={`text-sm font-bold ${verdict.color}`}>{verdict.text}</span>
            </div>
          </div>
        </div>

        {/* 3 Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Correctness & Depth
              </span>
              <span className="text-base font-bold text-blue-900">{correctness}/10</span>
            </div>
            <div className="w-full bg-blue-100/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min((correctness / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Accuracy and technical validity of answers.</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Communication
              </span>
              <span className="text-base font-bold text-emerald-900">{communication}/10</span>
            </div>
            <div className="w-full bg-emerald-100/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min((communication / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Clarity, structure, and professional phrasing.</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-100/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-600" />
                Confidence & Flow
              </span>
              <span className="text-base font-bold text-amber-900">{confidence}/10</span>
            </div>
            <div className="w-full bg-amber-100/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min((confidence / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Pacing, tone confidence, and conviction.</p>
          </div>
        </div>
      </Motion.div>

      {/* Question Wise Breakdown */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-600" />
          Question-by-Question Detailed Feedback ({questionWiseScore.length})
        </h2>

        {questionWiseScore.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 border border-gray-100">
            No question evaluations recorded.
          </div>
        ) : (
          questionWiseScore.map((q, idx) => (
            <Motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 grid h-7 w-7 place-items-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700">
                    Q{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-gray-50 px-3 py-1 rounded-full border border-gray-200/60">
                  <span className="text-xs text-gray-500">Score:</span>
                  <span
                    className={`text-sm font-bold ${
                      (q.score ?? 0) >= 7 ? "text-emerald-600" : (q.score ?? 0) >= 5 ? "text-amber-600" : "text-rose-600"
                    }`}
                  >
                    {q.score ?? 0}/10
                  </span>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-blue-50 text-blue-700">
                  Correctness: {q.correctness ?? 0}/10
                </span>
                <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700">
                  Communication: {q.communication ?? 0}/10
                </span>
                <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-amber-50 text-amber-700">
                  Confidence: {q.confidence ?? 0}/10
                </span>
              </div>

              {/* User Answer if available */}
              {q.answer && (
                <div className="mb-3 bg-gray-50/70 rounded-xl p-3 border border-gray-100 text-xs text-gray-600">
                  <span className="font-semibold text-gray-700 block mb-1">Your Answer:</span>
                  <p className="italic">"{q.answer}"</p>
                </div>
              )}

              {/* AI Feedback */}
              {q.feedback && (
                <div className="bg-violet-50/50 rounded-xl p-3 border border-violet-100 text-xs text-violet-900">
                  <span className="font-semibold text-violet-950 block mb-1">AI Evaluator Feedback:</span>
                  <p className="leading-relaxed">{q.feedback}</p>
                </div>
              )}
            </Motion.div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950 text-white rounded-3xl p-6 sm:p-8">
        <div>
          <h3 className="text-lg font-bold">Ready to improve your score?</h3>
          <p className="text-xs sm:text-sm text-gray-400">
            Practice makes perfect. Generate targeted questions for another domain or experience level.
          </p>
        </div>
        <button
          onClick={() => navigate("/mock-interview")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm hover:opacity-95 transition shadow-lg active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Mock Interview
        </button>
      </div>
    </div>
  );
}

export default InterviewStep3Report;
