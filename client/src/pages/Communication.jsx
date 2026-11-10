import React, { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import Navbar from "../components/Navbar.jsx";
import BackButton from "../components/BackButton.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  TrendingUp,
  History,
  BookOpen,
  Award,
  Zap,
  MessageSquare,
  ChevronRight,
  Loader2,
} from "lucide-react";

function Communication() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // Topics & Form state
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [userSpeech, setUserSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // History state
  const [historyList, setHistoryList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Speech Recognition Ref
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Load default topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${serverUrl}/api/communication/topics`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setTopics(res.data);
        if (res.data?.length > 0) {
          setSelectedTopic(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      }
    };
    fetchTopics();
  }, []);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Speech Recognition Setup
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your speech directly.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        setError("");
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
        setUserSpeech(finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech error:", event.error);
        if (event.error === "not-allowed") {
          setError("Microphone permission was denied. Please allow mic access in your browser settings.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Format timer seconds into mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Submit for Evaluation
  const handleEvaluate = async () => {
    if (!userSpeech || userSpeech.trim().length < 15) {
      setError("Please provide a speech or written answer of at least 15 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const activeTopicTitle = selectedTopic ? selectedTopic.title : customPrompt || "General Speaking";
      const activeCategory = selectedTopic ? selectedTopic.category : "Custom Practice";

      const res = await axios.post(
        `${serverUrl}/api/communication/evaluate`,
        {
          topic: activeTopicTitle,
          category: activeCategory,
          userSpeech: userSpeech.trim(),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      setEvaluation(res.data.evaluation);
      if (res.data.creditsLeft !== undefined && userData) {
        dispatch(setUserData({ ...userData, credits: res.data.creditsLeft }));
      }
    } catch (err) {
      console.error("Evaluation failed:", err);
      setError(err.response?.data?.message || "Failed to evaluate speech. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load Past History
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${serverUrl}/api/communication/history`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setHistoryList(res.data);
      setShowHistory(true);
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <BackButton label="Back to Home" fallbackTo="/" />
          <button
            onClick={fetchHistory}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm cursor-pointer"
          >
            <History className="h-4 w-4 text-emerald-600" />
            <span>Practice History</span>
          </button>
        </div>

        {/* Hero Banner */}
        <Motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden mb-8"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              AI Communication & Speech Trainer
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Speak Confidently, Clearly & Professionally.
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Practice professional elevator pitches, behavioral scenarios, and technical explanations.
              Get instant AI feedback on grammar, tone, vocabulary, and filler words.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </Motion.div>

        {/* Topics Selector Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              Choose a Speaking Practice Topic
            </h2>
            <span className="text-xs text-gray-400">Costs 2 credits per AI evaluation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTopic(t);
                  setCustomPrompt("");
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedTopic?.id === t.id
                    ? "bg-emerald-50/70 border-emerald-400 shadow-sm ring-1 ring-emerald-400"
                    : "bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full mb-2">
                  {t.category}
                </span>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{t.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{t.prompt}</p>
              </div>
            ))}
          </div>

          {/* Prompt Detail Card */}
          {selectedTopic && (
            <div className="mt-4 p-4 rounded-2xl bg-white border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Target Scenario
                </span>
                <p className="text-sm font-medium text-gray-800">{selectedTopic.prompt}</p>
                <span className="text-xs text-emerald-600 mt-1 block">💡 Tip: {selectedTopic.tips}</span>
              </div>
            </div>
          )}
        </div>

        {/* Speech Input & Mic Console */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              Your Spoken or Written Response
            </span>
            {isRecording && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold animate-pulse">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Recording ({formatTime(timer)})
              </div>
            )}
          </div>

          <textarea
            value={userSpeech}
            onChange={(e) => setUserSpeech(e.target.value)}
            placeholder="Click the microphone below to speak, or type your answer directly here in English..."
            rows={5}
            className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm sm:text-base text-gray-800 resize-none transition"
          />

          {/* Action Row */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer active:scale-95 ${
                  isRecording
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 animate-pulse"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm"
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-emerald-400" />}
                {isRecording ? "Stop Recording" : "Record with Voice"}
              </button>

              {userSpeech && (
                <button
                  type="button"
                  onClick={() => {
                    setUserSpeech("");
                    setEvaluation(null);
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                  title="Clear speech"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={loading || isRecording || !userSpeech.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Speech with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Evaluate Communication (2 Credits)
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Evaluation Result View */}
        {evaluation && (
          <Motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mb-12"
          >
            {/* Main Score Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
                    <Award className="h-3.5 w-3.5" />
                    AI Communication Assessment
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{evaluation.topic}</h2>
                  <p className="text-xs text-gray-500 mt-1">Category: {evaluation.category}</p>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-emerald-600 block">
                      {evaluation.overallScore}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      Overall Score / 10
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Metric Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-800">Grammar & Syntax</span>
                    <span className="text-sm font-bold text-blue-900">{evaluation.grammarScore}/10</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((evaluation.grammarScore / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-800">Vocabulary & Range</span>
                    <span className="text-sm font-bold text-emerald-900">{evaluation.vocabularyScore}/10</span>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((evaluation.vocabularyScore / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-800">Fluency & Tone</span>
                    <span className="text-sm font-bold text-amber-900">{evaluation.fluencyScore}/10</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((evaluation.fluencyScore / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Filler Words Detected */}
              {evaluation.fillerWords?.length > 0 && (
                <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                    Filler Words Detected
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.fillerWords.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        "{f.word}": {f.count} times
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Better Alternative Rephrasing */}
            {evaluation.betterAlternative && (
              <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    How an Executive/Native Speaker Would Say It
                  </span>
                  <button
                    onClick={() => handleCopy(evaluation.betterAlternative)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 transition cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied" : "Copy Version"}</span>
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal italic">
                  "{evaluation.betterAlternative}"
                </p>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {evaluation.strengths?.map((s, i) => (
                    <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  Actionable Improvements
                </h3>
                <ul className="space-y-2">
                  {evaluation.improvements?.map((imp, i) => (
                    <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Feedback */}
            {evaluation.detailedFeedback && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Coach's Summary</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {evaluation.detailedFeedback}
                </p>
              </div>
            )}
          </Motion.div>
        )}

        {/* History Modal / Drawer */}
        <AnimatePresence>
          {showHistory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <History className="h-5 w-5 text-emerald-600" />
                    Past Speech Evaluations ({historyList.length})
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-3 flex-1">
                  {historyLoading ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                    </div>
                  ) : historyList.length === 0 ? (
                    <p className="text-center py-12 text-sm text-gray-400">
                      No previous speech records yet. Try your first practice above!
                    </p>
                  ) : (
                    historyList.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          setEvaluation(item);
                          setShowHistory(false);
                        }}
                        className="p-4 rounded-2xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 truncate">{item.topic}</h4>
                          <p className="text-xs text-gray-400 truncate mt-0.5">"{item.userSpeech}"</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base font-extrabold text-emerald-600 block">
                            {item.overallScore}/10
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Communication;

