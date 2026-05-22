// client/src/components/TopicFrom.jsx

import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { generateNotes } from "../services/api";
import { useDispatch } from "react-redux";
import { updateCredits } from "../redux/userSlice";

function TopicFrom({ setResult, setLoading, loading, setError, setTopicName }) {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagrams, setIncludeDiagrams] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);

  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please Enter the topic");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const result = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram: includeDiagrams,
        includeChart,
      });

      if (typeof setTopicName === "function") setTopicName(topic);

      setResult(result);

      setClassLevel("");
      setTopic("");
      setExamType("");
      setRevisionMode(false);
      setIncludeDiagrams(false);
      setIncludeChart(false);

      if (typeof result?.creditsLeft === "number") {
        dispatch(updateCredits(result.creditsLeft));
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch notes from server");
    } finally {
      setLoading(false);
    }
  };

  // Progress animation
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setProgressText("");
      return;
    }

    let value = 0;
    setProgressText("Generating notes...");

    const interval = setInterval(() => {
      value += Math.random() * 8;

      if (value > 95) {
        value = 95;
        setProgressText("Almost done...");
      } else if (value > 75) {
        setProgressText("Finalizing notes...");
      } else if (value > 45) {
        setProgressText("Processing notes...");
      } else {
        setProgressText("Generating notes...");
      }

      setProgress(Math.floor(value));
    }, 700);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ borderColor: "rgba(251, 146, 60, 0.4)" }}
        className="max-w-7xl mx-auto rounded-[2.5rem] bg-black border border-white/10 shadow-2xl p-6 md:p-10 text-white transition-colors duration-500"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">Create Smart Notes</h2>
            <p className="text-gray-400 text-sm">
              Enter your details below to generate AI-powered study material.
            </p>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side */}
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <InputField
                  label="TOPIC NAME"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Web Development"
                />
                <InputField
                  label="CLASS / LEVEL"
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  placeholder="e.g. 12th Grade"
                />
                <InputField
                  label="EXAM CATEGORY"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  placeholder="e.g. JEE / UPSC"
                />
              </div>

              {/* ✅ Mobile Toggle Box (Generate button ke upar) */}
              <Motion.div
                whileHover={{ borderColor: "rgba(251, 146, 60, 0.3)" }}
                className="lg:hidden w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex flex-col justify-center gap-6 transition-colors duration-300"
              >
                <Toggle
                  label="Revision Mode"
                  checked={revisionMode}
                  onChange={() => setRevisionMode(!revisionMode)}
                />
                <Toggle
                  label="Include Diagrams"
                  checked={includeDiagrams}
                  onChange={() => setIncludeDiagrams(!includeDiagrams)}
                />
                <Toggle
                  label="Include Charts"
                  checked={includeChart}
                  onChange={() => setIncludeChart(!includeChart)}
                />
              </Motion.div>

              {/* Button */}
              <Motion.button
                onClick={handleSubmit}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all cursor-pointer
                  ${
                    loading
                      ? "bg-gray-800 text-gray-500"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
              >
                {loading ? "Generating..." : "Generate Professional Notes"}
              </Motion.button>

              {/* Progress Bar */}
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: loading ? 1 : 0,
                  height: loading ? "auto" : 0,
                }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                {loading && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-300">{progressText}</p>
                      <Motion.span
                        key={progress}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-semibold text-orange-300"
                      >
                        {progress}%
                      </Motion.span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                      <Motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(251,146,60,1) 0%, rgba(255,255,255,0.9) 60%, rgba(251,146,60,1) 100%)",
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeInOut", duration: 0.45 }}
                      />

                      <Motion.div
                        className="h-full -mt-3 w-1/3 bg-white/20 blur-md"
                        animate={{ x: ["-40%", "340%"] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>

                    <p className="text-[11px] text-gray-500 mt-2">
                      Please wait… notes are being generated.
                    </p>
                  </div>
                )}
              </Motion.div>
            </div>

            {/* ✅ Desktop Toggle Box (Right side only on lg+) */}
            <Motion.div
              whileHover={{ borderColor: "rgba(251, 146, 60, 0.3)" }}
              className="hidden lg:flex w-full lg:w-[320px] bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 flex-col justify-center gap-6 transition-colors duration-300"
            >
              <Toggle
                label="Revision Mode"
                checked={revisionMode}
                onChange={() => setRevisionMode(!revisionMode)}
              />
              <Toggle
                label="Include Diagrams"
                checked={includeDiagrams}
                onChange={() => setIncludeDiagrams(!includeDiagrams)}
              />
              <Toggle
                label="Include Charts"
                checked={includeChart}
                onChange={() => setIncludeChart(!includeChart)}
              />
            </Motion.div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 ml-1">
        {label}
      </label>
      <input
        type="text"
        className="w-full p-4 rounded-2xl bg-[#121212] border border-white/5 focus:border-orange-400/50 outline-none transition-all placeholder:text-gray-700 text-white"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer group"
      onClick={onChange}
    >
      <span
        className={`text-sm font-medium transition-colors ${
          checked ? "text-white" : "text-gray-500 group-hover:text-gray-300"
        }`}
      >
        {label}
      </span>

      <div className="relative w-10 h-5 flex items-center">
        <Motion.div
          animate={{
            backgroundColor: checked ? "#fb923c" : "rgba(255,255,255,0.1)",
          }}
          className="w-full h-full rounded-full"
        />
        <Motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className={`absolute h-3.5 w-3.5 rounded-full ${
            checked ? "bg-white" : "bg-gray-600"
          }`}
        />
      </div>
    </div>
  );
}

export default TopicFrom;
