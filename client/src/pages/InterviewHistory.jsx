import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import Navbar from "../components/Navbar";

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-1/4" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-10 w-20 bg-gray-100 rounded-xl" />
        <div className="h-7 w-24 bg-gray-100 rounded-full" />
        <div className="h-8 w-8 bg-gray-100 rounded-full" />
      </div>
    </div>
    <div className="mt-4 h-2 bg-gray-100 rounded-full w-full" />
  </div>
);

// ── Score Ring ────────────────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const pct = Math.min((score / 10) * 100, 100);
  const color =
    score >= 8 ? "#10b981" : score >= 5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28" cy="28" r="22"
          fill="none" stroke="#e5e7eb" strokeWidth="5"
        />
        <circle
          cx="28" cy="28" r="22"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>
        {score ?? 0}
      </span>
    </div>
  );
};

// ── Badges ────────────────────────────────────────────────────────────────────
const ExpBadge = ({ label }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
    {label}
  </span>
);

const ModeBadge = ({ mode }) => {
  const styles = {
    technical:  "bg-purple-50 text-purple-600 border-purple-100",
    behavioral: "bg-orange-50 text-orange-600 border-orange-100",
    mixed:      "bg-teal-50 text-teal-600 border-teal-100",
  };
  const cls = styles[mode?.toLowerCase()] ?? "bg-gray-50 text-gray-600 border-gray-100";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${cls}`}>
      {mode}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const done = status === "completed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
        done
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : "bg-rose-50 text-rose-500 border-rose-100"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${done ? "bg-emerald-500" : "bg-rose-400"}`} />
      {done ? "Completed" : "Incomplete"}
    </span>
  );
};

// ── Interview Card ────────────────────────────────────────────────────────────
const InterviewCard = ({ item, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-2xl border border-gray-100 cursor-pointer overflow-hidden"
      style={{
        animation: `slideUp 0.4s ease both`,
        animationDelay: `${index * 80}ms`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 40px -10px rgba(16,185,129,0.18)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Left Accent Bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{
          background:
            item.status === "completed"
              ? "linear-gradient(to bottom,#10b981,#059669)"
              : "linear-gradient(to bottom,#f43f5e,#e11d48)",
        }}
      />

      <div className="pl-5 pr-5 pt-5 pb-4">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

          {/* Left ─ Role + Meta */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 truncate leading-snug group-hover:text-emerald-600 transition-colors duration-200">
              {item.role || "Interview"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <ExpBadge label={`${item.experience} yrs`} />
              <ModeBadge mode={item.mode} />
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Right ─ Score + Status + Arrow */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex flex-col items-center">
              <ScoreRing score={item.finalScore ?? 0} />
              <span className="text-[10px] text-gray-400 mt-0.5 font-medium">Score</span>
            </div>
            <StatusBadge status={item.status} />
            <div
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0"
              style={{
                transform: hovered ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              Performance
            </span>
            <span className="text-[10px] font-bold text-gray-500">
              {(item.finalScore ?? 0) * 10}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: hovered ? `${(item.finalScore ?? 0) * 10}%` : "0%",
                background:
                  (item.finalScore ?? 0) >= 8
                    ? "linear-gradient(to right,#10b981,#059669)"
                    : (item.finalScore ?? 0) >= 5
                    ? "linear-gradient(to right,#f59e0b,#d97706)"
                    : "linear-gradient(to right,#ef4444,#dc2626)",
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ onStart }) => (
  <div
    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-14 flex flex-col items-center gap-4 text-center"
    style={{ animation: "fadeIn 0.5s ease" }}
  >
    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
      <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-gray-800">No Interviews Yet</h3>
    <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
      You haven't taken any interviews yet. Start your first mock interview to track your progress.
    </p>
    <button
      onClick={onStart}
      className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-200 hover:shadow-lg active:scale-95"
    >
      Start First Interview
    </button>
  </div>
);

// ── Stats Bar ─────────────────────────────────────────────────────────────────
const StatsBar = ({ interviews }) => {
  const total     = interviews.length;
  const completed = interviews.filter((i) => i.status === "completed").length;
  const avgScore  =
    total > 0
      ? (interviews.reduce((s, i) => s + (i.finalScore ?? 0), 0) / total).toFixed(1)
      : "—";

  const stats = [
    { label: "Total",     value: total,             icon: "📋", bg: "bg-blue-50",    text: "text-blue-700"   },
    { label: "Completed", value: completed,          icon: "✅", bg: "bg-emerald-50", text: "text-emerald-700"},
    { label: "Avg Score", value: avgScore,           icon: "⭐", bg: "bg-amber-50",   text: "text-amber-700"  },
    { label: "Pending",   value: total - completed,  icon: "⏳", bg: "bg-rose-50",    text: "text-rose-600"   },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`${s.bg} rounded-2xl p-4 flex flex-col gap-1`}
          style={{ animation: "slideUp 0.4s ease both", animationDelay: `${i * 60}ms` }}
        >
          <span className="text-xl">{s.icon}</span>
          <span className={`text-2xl font-extrabold ${s.text}`}>{s.value}</span>
          <span className="text-xs text-gray-400 font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
function InterviewHistory() {
  const [interviews,    setInterviews]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [filterStatus,  setFilterStatus]  = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/interview/get-interview`,
          { withCredentials: true }
        );
        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMyInterviews();
  }, []);

  // ── Filter Logic ─────────────────────────────────────────────────────────
  // ✅ FIX 1: "pending" tab → show anything that is NOT "completed"
  const filtered = interviews.filter((item) => {
    const matchSearch =
      item.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "completed"
        ? item.status === "completed"
        : item.status !== "completed"; // ← "pending" catches "incomplete", undefined, etc.

    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* ── Global Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/*
        ✅ FIX 2 ─ Sticky Navbar + Scrollable Content
        ┌────────────────────────────────┐  h-screen (viewport height)
        │  sticky top-0  <Navbar />      │  ← never moves
        ├────────────────────────────────┤
        │  flex-1 overflow-y-auto        │  ← only this part scrolls
        │    (all page content)          │
        └────────────────────────────────┘
      */}
      <div className="h-screen flex flex-col overflow-hidden">

        {/* ── Fixed Navbar ────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 sticky top-0 z-50">
          <Navbar />
        </div>

        {/* ── Scrollable Body ─────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 40%,#eff6ff 100%)",
          }}
        >
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="mb-8" style={{ animation: "slideUp 0.5s ease both" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight">
                    Interview History
                  </h1>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Track your past interviews &amp; performance reports
                  </p>
                </div>
              </div>
            </div>

            {/* ── Stats Bar ───────────────────────────────────────────────── */}
            {!loading && interviews.length > 0 && (
              <StatsBar interviews={interviews} />
            )}

            {/* ── Search + Filter Row ─────────────────────────────────────── */}
            {!loading && interviews.length > 0 && (
              <div
                className="flex flex-col sm:flex-row gap-3 mb-6"
                style={{ animation: "slideUp 0.45s ease both" }}
              >
                {/* Search Input */}
                <div className="relative flex-1">
                  <svg
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by role or mode…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-200 shadow-sm"
                  />
                </div>

                {/* Filter Tabs */}
                {/* ✅ FIX 1 (UI part) ─ "pending" button now correctly filters */}
                <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                  {["all", "completed", "pending"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterStatus(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                        filterStatus === tab
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Content Area ────────────────────────────────────────────── */}
            {loading ? (
              // Skeleton Loading
              <div className="grid gap-3">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>

            ) : interviews.length === 0 ? (
              // Empty State
              <EmptyState onStart={() => navigate("/interview")} />

            ) : filtered.length === 0 ? (
              // No search/filter results
              <div
                className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100"
                style={{ animation: "fadeIn 0.3s ease" }}
              >
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-semibold text-sm">No interviews match your search.</p>
                <p className="text-gray-400 text-xs mt-1">Try a different keyword or clear the filters.</p>
                <button
                  onClick={() => { setSearchQuery(""); setFilterStatus("all"); }}
                  className="mt-4 px-5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-xl transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>

            ) : (
              // Interview Cards List
              <div className="grid gap-3">
                {filtered.map((item, index) => (
                  <InterviewCard
                    key={item._id ?? index}
                    item={item}
                    index={index}
                    onClick={() => navigate(`/interview-report/${item._id}`)}
                  />
                ))}
              </div>
            )}

            {/* ── Footer Count ────────────────────────────────────────────── */}
            {!loading && filtered.length > 0 && (
              <p
                className="text-center text-xs text-gray-300 mt-8 pb-4"
                style={{ animation: "fadeIn 0.5s ease" }}
              >
                Showing {filtered.length} of {interviews.length} interviews
              </p>
            )}

          </div>
        </div>
        {/* ── End Scrollable Body ─────────────────────────────────────────── */}

      </div>
    </>
  );
}

export default InterviewHistory;
