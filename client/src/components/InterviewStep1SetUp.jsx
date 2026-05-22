import React, { useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaCheckCircle,
  FaRocket,
  FaBrain,
  FaShieldAlt,
  FaStar,
  FaCode,
  FaTimes,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

/* ─── tiny helpers ─────────────────────────────────────────────── */
const FeatureCard = ({ icon, title, desc, delay }) => (
  <Motion.div
    initial={{ x: -40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={{ scale: 1.03, x: 6 }}
    className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 cursor-default"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg">
      {icon}
    </div>
    <div>
      <p className="text-white font-semibold text-sm">{title}</p>
      <p className="text-green-100 text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </Motion.div>
);

const FloatingOrb = ({ className }) => (
  <Motion.div
    animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
  />
);

/* ─── main component ────────────────────────────────────────────── */
export default function InterviewStep1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");

  const [resumeFile, setResumeFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canStart = !!role.trim() && !!experience.trim() && !loading;

  const resetResumeAnalysis = () => {
    setProjects([]);
    setSkills([]);
    setResumeText("");
    setAnalysisDone(false);
    setAnalyzing(false);
    setErrorMsg("");
  };

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setErrorMsg("");

    // Basic validation
    const isPdf = resumeFile.type === "application/pdf";
    const isUnder10MB = resumeFile.size <= 10 * 1024 * 1024;

    if (!isPdf) {
      setErrorMsg("Please upload a PDF file only.");
      return;
    }
    if (!isUnder10MB) {
      setErrorMsg("File too large. Please upload PDF up to 10MB.");
      return;
    }

    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/resume`,
        formData,
        { withCredentials: true }
      );

      setRole(result?.data?.role || "");
      setExperience(result?.data?.experience || "");
      setProjects(result?.data?.projects || []);
      setSkills(result?.data?.skills || []);
      setResumeText(result?.data?.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(error);
      setErrorMsg(
        error?.response?.data?.message ||
          "Resume analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    if (!canStart) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/generate-questions`,
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true }
      );

      if (userData) {
        dispatch(
          setUserData({
            ...userData,
            credits: result?.data?.creditsLeft,
          })
        );
      }

      console.log(result.data);

      onStart(result.data);
    } catch (error) {
      console.log(error);
      setErrorMsg(
        error?.response?.data?.message ||
          "Could not start interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filledCount = [role?.trim(), experience?.trim(), mode?.trim()].filter(
    Boolean
  ).length;

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* ── page header ───────────────────────────────────────── */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-200">
          <HiSparkles className="text-base" /> AI-Powered Interview Practice
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          Land Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
            Dream Job
          </span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-lg mx-auto">
          Practice with AI that simulates real interviews, gives instant
          feedback &amp; boosts your confidence.
        </p>
      </Motion.div>

      {/* ── main card ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-green-100 grid md:grid-cols-5"
        >
          {/* ── LEFT PANEL (2/5) ──────────────────────────────── */}
          <div className="md:col-span-2 relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 sm:p-10 flex flex-col justify-between overflow-hidden min-h-[420px]">
            <FloatingOrb className="w-52 h-52 bg-white/10 -top-16 -left-16" />
            <FloatingOrb className="w-36 h-36 bg-emerald-300/20 bottom-10 right-0" />

            <div className="relative z-10">
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg"
              >
                <FaBrain className="text-white text-2xl" />
              </Motion.div>

              <Motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3"
              >
                Master Your <br />
                <span className="text-green-200">Interview Skills</span>
              </Motion.h2>

              <Motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-green-100 text-sm leading-relaxed mb-8"
              >
                AI-driven scenarios tailored to your role. Speak, practice &
                improve — all in one place.
              </Motion.p>

              <div className="space-y-3">
                <FeatureCard
                  icon={<FaUserTie />}
                  title="Role-Specific Questions"
                  desc="Questions crafted for your exact position & level."
                  delay={0.45}
                />
                <FeatureCard
                  icon={<FaMicrophoneAlt />}
                  title="Smart Voice Interview"
                  desc="Real-time voice analysis with instant feedback."
                  delay={0.55}
                />
                <FeatureCard
                  icon={<FaChartLine />}
                  title="Deep Performance Insights"
                  desc="Score breakdown, strengths & improvement areas."
                  delay={0.65}
                />
                <FeatureCard
                  icon={<FaShieldAlt />}
                  title="Confidence Builder"
                  desc="Repeated practice builds unshakeable confidence."
                  delay={0.75}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (3/5) ─────────────────────────────── */}
          <Motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-3 bg-white p-8 sm:p-10 flex flex-col gap-6"
          >
            {/* header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Interview Setup
                </h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  Fill in your details to get started
                </p>
              </div>
              <span className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                <FaStar className="text-yellow-400" /> Pro Mode
              </span>
            </div>

            {/* progress dots */}
            <div className="flex items-center gap-2">
              {[role?.trim(), experience?.trim(), mode?.trim()].map((val, i) => (
                <Motion.div
                  key={i}
                  animate={{ scale: val ? 1.2 : 1 }}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    val ? "bg-green-500 w-8" : "bg-gray-200 w-4"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">
                {filledCount} / 3 filled
              </span>
            </div>

            {/* error message */}
            <AnimatePresence>
              {!!errorMsg && (
                <Motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMsg}
                </Motion.div>
              )}
            </AnimatePresence>

            {/* form fields */}
            <div className="space-y-4">
              {/* Role */}
              <div className="group">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FaUserTie className="text-green-500" /> Target Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer, Data Scientist..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-green-400 focus:ring-0 outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-300"
                  />
                  <AnimatePresence>
                    {!!role.trim() && (
                      <Motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaCheckCircle className="text-green-500" />
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FaBriefcase className="text-green-500" /> Experience Level
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 2 years, Fresher, 5+ years..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-green-400 focus:ring-0 outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-300"
                  />
                  <AnimatePresence>
                    {!!experience.trim() && (
                      <Motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <FaCheckCircle className="text-green-500" />
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Interview Mode — pill selector */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FaCode className="text-green-500" /> Interview Mode
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "Technical",
                      icon: <FaCode />,
                      desc: "DSA · System Design · Coding",
                    },
                    {
                      value: "HR",
                      icon: <FaUserTie />,
                      desc: "Behaviour · Culture Fit",
                    },
                  ].map(({ value, icon, desc }) => (
                    <Motion.button
                      type="button"
                      key={value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMode(value)}
                      className={`flex flex-col items-start gap-1 p-3.5 rounded-xl border-2 text-left transition-all duration-300 ${
                        mode === value
                          ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                          : "border-gray-100 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`text-base ${
                          mode === value ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {icon}
                      </span>
                      <span
                        className={`font-semibold text-sm ${
                          mode === value ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {value}
                      </span>
                      <span className="text-xs text-gray-400">{desc}</span>
                    </Motion.button>
                  ))}
                </div>
              </div>

              {/* Resume Upload */}
              <AnimatePresence>
                {!analysisDone && (
                  <Motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FaFileUpload className="text-green-500" /> Resume{" "}
                      <span className="normal-case font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <Motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                        resumeFile
                          ? "border-green-400 bg-green-50"
                          : "border-gray-200 hover:border-green-400 hover:bg-green-50/50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setResumeFile(file);
                          resetResumeAnalysis();
                        }}
                      />

                      <Motion.div
                        animate={{ y: resumeFile ? 0 : [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FaFileUpload
                          className={`text-3xl mx-auto mb-2 ${
                            resumeFile ? "text-green-500" : "text-gray-300"
                          }`}
                        />
                      </Motion.div>

                      <p
                        className={`text-sm font-medium ${
                          resumeFile ? "text-green-700" : "text-gray-400"
                        }`}
                      >
                        {resumeFile
                          ? `📄 ${resumeFile.name}`
                          : "Click to upload PDF resume"}
                      </p>

                      {!resumeFile && (
                        <p className="text-xs text-gray-300 mt-1">
                          PDF up to 10MB
                        </p>
                      )}

                      <AnimatePresence>
                        {resumeFile && (
                          <Motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUploadResume();
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={analyzing}
                            className="mt-4 inline-flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md disabled:opacity-60"
                          >
                            {analyzing ? (
                              <>
                                <Motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                                />
                                Analyzing…
                              </>
                            ) : (
                              <>
                                <HiSparkles /> Analyze Resume
                              </>
                            )}
                          </Motion.button>
                        )}
                      </AnimatePresence>
                    </Motion.div>
                  </Motion.div>
                )}
              </AnimatePresence>

              {/* Analysis Result Card */}
              <AnimatePresence>
                {analysisDone && (
                  <Motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
                          <FaCheckCircle className="text-white text-sm" />
                        </span>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            Resume Analysed
                          </p>
                          <p className="text-xs text-gray-400">
                            {resumeFile?.name}
                          </p>
                        </div>
                      </div>

                      <Motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setResumeFile(null);
                          resetResumeAnalysis();
                        }}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                      >
                        <FaTimes className="text-xs" />
                      </Motion.button>
                    </div>

                    {/* Projects */}
                    {projects.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Projects Found
                        </p>
                        <ul className="space-y-1">
                          {projects.map((p, i) => (
                            <Motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                              {p}
                            </Motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Skills Detected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((s, i) => (
                            <Motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.06 }}
                              className="bg-white border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                            >
                              {s}
                            </Motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <Motion.button
              type="button"
              disabled={!canStart}
              onClick={handleStart}
              whileHover={canStart ? { scale: 1.02, y: -2 } : {}}
              whileTap={canStart ? { scale: 0.97 } : {}}
              className={`relative w-full py-4 rounded-2xl text-base font-bold tracking-wide transition-all duration-300 overflow-hidden shadow-lg ${
                canStart
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-200 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {canStart && (
                <Motion.span
                  className="absolute inset-0 bg-white/10"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                    />
                    Starting…
                  </>
                ) : (
                  <>
                    <FaRocket className={canStart ? "text-white" : "text-gray-300"} />
                    {canStart ? "Start Interview Now" : "Fill all required fields"}
                  </>
                )}
              </span>
            </Motion.button>

            <p className="text-center text-xs text-gray-400">
              🔒 Your data is secure and never shared with third parties.
            </p>
          </Motion.div>
        </Motion.div>
      </div>
    </div>
  );
}
