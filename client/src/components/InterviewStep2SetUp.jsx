import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import TimerInterview from "./TimerInterview";
import { motion as Motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import { serverUrl } from "../App";

function InterviewStep2SetUp({ interviewData, onFinish }) {
  const { interviewId, questions = [], userName } = interviewData || {};

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [answer, setAnswer] = useState("");
  const recognitionRef = useRef(null);

  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  // Refs to avoid duplicate / restart issues
  const lastFinalRef = useRef(""); // last final chunk (dedupe)
  const startedRef = useRef(false); // recognition started?
  const stopRequestedRef = useRef(false); // manual stop flag
  const isMicOnRef = useRef(true);
  const isAIPlayingRef = useRef(false);
  const isIntroPhaseRef = useRef(true);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  useEffect(() => {
    isIntroPhaseRef.current = isIntroPhase;
  }, [isIntroPhase]);

  const currentQuestion = useMemo(
    () => questions?.[currentIndex],
    [questions, currentIndex]
  );

  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 60);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(currentQuestion?.timeLimit || 60);
  }, [currentQuestion?.timeLimit, currentIndex]);

  // Load TTS voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      if (!voices.length) return;

      const femaleVoice = voices.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes("zira") || n.includes("samantha") || n.includes("female");
      });

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes("david") || n.includes("mark") || n.includes("male");
      });

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const normalizeText = useCallback((t) => {
    return (t || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const stopMic = useCallback(() => {
    stopRequestedRef.current = true;
    try {
      recognitionRef.current?.stop?.();
    } catch {
      /* ignore */
    }
  }, []);

  const startMic = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isAIPlayingRef.current) return;
    if (!isMicOnRef.current) return;

    stopRequestedRef.current = false;

    // Avoid double-start (start() multiple times can throw)
    if (startedRef.current) return;

    try {
      recognitionRef.current.start();
      startedRef.current = true;
    } catch {
      /* ignore */
    }
  }, []);

  // Speech synthesis with controllable mic auto-start
  const speakText = useCallback(
    (text, options = {}) => {
      const { autoStartMicAfter = true } = options;

      return new Promise((resolve) => {
        if (!window.speechSynthesis || !selectedVoice) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        const humanText = (text || "")
          .replace(/,/g, ", ... ")
          .replace(/\./g, ", ... ");

        const utterance = new SpeechSynthesisUtterance(humanText);
        utterance.voice = selectedVoice;
        utterance.rate = 0.92;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsAIPlaying(true);
          stopMic();

          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {
              /* ignore */
            });
          }
        };

        utterance.onend = () => {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }

          setIsAIPlaying(false);

          // Start mic only when allowed (prevents unwanted listening between speeches)
          if (autoStartMicAfter && isMicOnRef.current) {
            setTimeout(() => startMic(), 700);
          }

          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 600);
        };

        setSubtitle(text);
        window.speechSynthesis.speak(utterance);
      });
    },
    [selectedVoice, startMic, stopMic]
  );

  // Intro + question flow
  useEffect(() => {
    if (!selectedVoice) return;
    if (!currentQuestion && !isIntroPhase) return;

    let cancelled = false;

    const run = async () => {
      if (cancelled) return;

      if (isIntroPhase) {
        await speakText(
          `Hi ${userName || ""}, great to meet you today. Stay calm, answer naturally, and take your time.`,
          { autoStartMicAfter: false }
        );
        await speakText("I’ll ask a few questions. When you're ready, let’s begin.", {
          autoStartMicAfter: false,
        });

        setIsIntroPhase(false);
        return;
      }

      await new Promise((r) => setTimeout(r, 500));

      if (currentIndex === questions.length) return;

      if (currentQuestion?.question) {
        await speakText(currentQuestion.question, { autoStartMicAfter: true });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    selectedVoice,
    currentQuestion,
    isIntroPhase,
    currentIndex,
    questions.length,
    speakText,
    userName,
  ]);

  // Setup speech recognition once (fixed)
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech recognition not supported in this browser.");
      return undefined;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true; // we append ONLY final results
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      startedRef.current = true;
    };

    recognition.onend = () => {
      startedRef.current = false;

      if (stopRequestedRef.current) return;
      if (!isMicOnRef.current) return;
      if (isAIPlayingRef.current) return;

      setTimeout(() => {
        startMic();
      }, 250);
    };

    recognition.onresult = (event) => {
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = normalizeText(res?.[0]?.transcript || "");
        if (!text) continue;

        if (res.isFinal) {
          finalChunk += (finalChunk ? " " : "") + text;
        }
      }

      finalChunk = normalizeText(finalChunk);
      if (!finalChunk) return;

      if (finalChunk === lastFinalRef.current) return;
      lastFinalRef.current = finalChunk;

      setAnswer((prev) => {
        const prevNorm = normalizeText(prev);

        if (prevNorm && prevNorm.toLowerCase().endsWith(finalChunk.toLowerCase())) {
          return prevNorm;
        }

        return normalizeText((prevNorm ? `${prevNorm} ` : "") + finalChunk);
      });
    };

    recognition.onerror = () => {
      /* ignore (optional UI handling) */
    };

    recognitionRef.current = recognition;

    // Do not start mic during intro automatically
    setTimeout(() => {
      if (!isIntroPhaseRef.current && isMicOnRef.current && !isAIPlayingRef.current) {
        startMic();
      }
    }, 300);

    return () => {
      try {
        stopRequestedRef.current = true;
        recognition.stop();
        recognition.abort();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
      startedRef.current = false;
    };
  }, [normalizeText, startMic]);

  // Timer countdown
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
    if (feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [feedback, isIntroPhase, isSubmitting, currentQuestion]);

  const submitAnswer = useCallback(async () => {
    if (isSubmitting) return;
    if (!currentQuestion) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: (currentQuestion?.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true }
      );

      const fb = result?.data?.feedback || "Thanks. Noted.";
      setFeedback(fb);

      // Do not auto-start mic after feedback; user clicks Next
      await speakText(fb, { autoStartMicAfter: false });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    answer,
    currentIndex,
    currentQuestion,
    interviewId,
    isSubmitting,
    speakText,
    stopMic,
    timeLeft,
  ]);

  // Auto submit when time ends
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [feedback, isIntroPhase, isSubmitting, currentQuestion, timeLeft, submitAnswer]);

  const finishInterview = useCallback(async () => {
    stopMic();
    setIsMicOn(false);
    isMicOnRef.current = false;

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true }
      );
      onFinish?.(result?.data);
    } catch (error) {
      console.log(error);
      onFinish?.();
    }
  }, [interviewId, onFinish, stopMic]);

  const handleNext = useCallback(async () => {
    lastFinalRef.current = "";
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      await speakText("This is the end of the interview. Thank you for your time.", {
        autoStartMicAfter: false,
      });
      await finishInterview();
      return;
    }

    // Do not start mic after this transition line
    await speakText("Alright, let's move on to the next question.", {
      autoStartMicAfter: false,
    });

    setCurrentIndex((prev) => prev + 1);
    // Next question will be spoken by effect; mic starts after the question ends.
  }, [currentIndex, questions.length, speakText, finishInterview]);

  const toggleMic = useCallback(() => {
    setIsMicOn((p) => {
      const next = !p;
      isMicOnRef.current = next;

      if (next) startMic();
      else stopMic();

      return next;
    });
  }, [startMic, stopMic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMic();
      try {
        recognitionRef.current?.abort?.();
      } catch {
        /* ignore */
      }
      window.speechSynthesis?.cancel?.();
    };
  }, [stopMic]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-teal-100 px-3 sm:px-6 py-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 shadow-2xl backdrop-blur">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT: AI Panel */}
          <aside className="w-full lg:w-[38%] border-b lg:border-b-0 lg:border-r border-emerald-100 bg-gradient-to-b from-white to-emerald-50/60 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-emerald-700/80">
                  AI SMART INTERVIEW
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Interview Assistant
                </h2>
              </div>

              <div className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                {isAIPlaying ? "AI Speaking" : isIntroPhase ? "Intro" : "Listening"}
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
              <video
                src={videoSource}
                key={videoSource}
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="aspect-video w-full object-cover"
              />
            </div>

            {/* Subtitle */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-center text-sm sm:text-[15px] leading-relaxed text-slate-700">
                {subtitle || " "}
              </p>
            </div>

            {/* Timer + stats */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Time Remaining</p>
                <p className="text-xs font-medium text-slate-500">
                  Q {currentIndex + 1} / {questions.length}
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <TimerInterview
                  timeLeft={timeLeft}
                  totalTime={currentQuestion?.timeLimit || 60}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-center">
                  <div className="text-2xl font-extrabold text-emerald-700">
                    {currentIndex + 1}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600">Current</div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-teal-50/60 p-3 text-center">
                  <div className="text-2xl font-extrabold text-teal-700">
                    {questions.length}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600">Total</div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: Q/A Panel */}
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            {/* Question Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Question {currentIndex + 1} of {questions.length}
                  </p>
                  <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900">
                    {currentQuestion?.question || "Loading question..."}
                  </h3>
                </div>

                <div className="hidden sm:block rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow">
                  Focus Mode
                </div>
              </div>

              <div className="mt-4">
                <textarea
                  placeholder="Type your answer here..."
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                  className="min-h-[220px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
                <p className="mt-2 text-[12px] text-slate-500">
                  Tip: If the mic is ON, you can speak to fill your answer automatically.
                </p>
              </div>
            </div>

            {/* Actions / Feedback */}
            {!feedback ? (
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.96 }}
                  className={`h-12 w-full sm:w-14 rounded-2xl border shadow-sm flex items-center justify-center transition
                    ${
                      isMicOn
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-800 border-slate-200"
                    }
                  `}
                  title={isMicOn ? "Mic is ON" : "Mic is OFF"}
                >
                  {isMicOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
                </Motion.button>

                <Motion.button
                  onClick={submitAnswer}
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="h-12 w-full flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 font-semibold text-white shadow-lg shadow-emerald-200/40 transition hover:opacity-95 disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </Motion.button>
              </div>
            ) : (
              <Motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6 shadow-sm"
              >
                <p className="text-emerald-900 font-semibold">AI Feedback</p>
                <p className="mt-2 text-emerald-800 leading-relaxed">{feedback}</p>

                <button
                  onClick={handleNext}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white shadow-lg shadow-emerald-200/40 transition hover:opacity-95"
                >
                  Next Question <BsArrowRight size={18} className="inline-block ml-2" />
                </button>
              </Motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default InterviewStep2SetUp;
