import React from "react";
import { motion as Motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import {  Sparkles} from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase.js";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";

function Auth() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;

      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black px-4 sm:px-8">
      {/* Header */}
      <Motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.7 }}
        className="max-w-7xl mx-auto mt-6 sm:mt-8 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/10 px-6 sm:px-8 py-5 sm:py-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.6)] transition-shadow duration-300"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
            🎓
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">SukuAI</h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Master your exams with confidence.
            </p>
          </div>
        </div>
      </Motion.header>

      <main className="max-w-7xl mx-auto py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
        {/* Left Content */}
        <Motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.7 }}
        >
          {/* Badge */}
          <Motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ y: -2 }} 
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold",
              "bg-emerald-50 text-emerald-700",
              "border-b-4 border-emerald-300/80", 
              "shadow-[0_10px_20px_-10px_rgba(16,185,129,0.4)]", 
              "active:border-b-0 active:translate-y-[2px]", 
              "transition-all duration-150",
            ].join(" ")}
          >
            <Sparkles className="h-4 w-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
            <span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              AI-Powered Study Platform
            </span>
          </Motion.div>
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Unlock Smart <br />
            Study with <br />
            <span className="text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 bg-clip-text">
              SukuAI
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
            Get <span className="font-bold text-black">50 FREE credits</span> to
            generate smart exam notes, master AI mock interviews, and refine
            communication skills -- all in one industry-grade platform.
          </p>

          {/* Google Sign In Button */}
          <Motion.button
            whileHover={{
              y: -10,
              rotateX: 8,
              rotateY: 8,
              scale: 1.07,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="w-full sm:w-auto mt-10 px-10 py-3 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/10 text-white font-semibold text-lg shadow-[0_25px_60px_rgba(0,0,0,0.7)] mb-6 cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            onClick={handleGoogleAuth}
          >
            <FcGoogle size={22} />
            Continue with Google
          </Motion.button>

          {/* Features List */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">⚡</span>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-500">⭐</span>
              <span>50 Free Credits</span>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-xs sm:text-sm text-gray-400">
            Start with 50 free credits · Upgrade anytime · Instant access
          </p>
        </Motion.div>

        {/* Right Content - Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <Feature
            icon="🎁"
            iconBg="bg-gradient-to-br from-pink-500 to-pink-600"
            title="50 Free Credits"
            des="Unlock premium AI tools -- notes, interviews & communication, all free."
            delay={0.1}
          />
          <Feature
            icon="📋"
            iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
            title="Exam Notes"
            des="High-yield, exam-focused notes for quick revision and better scores."
            delay={0.2}
          />
          <Feature
            icon="📁"
            iconBg="bg-gradient-to-br from-teal-500 to-teal-600"
            title="Project Notes"
            des="Generate structured, ready-to-use project notes instantly with AI."
            delay={0.3}
          />
          <Feature
            icon="⬇️"
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            title="PDF Download"
            des="Save and access your notes anytime with one-click PDF export."
            delay={0.4}
          />
          <Feature
            icon="👥"
            iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
            title="Mock Interviews"
            des="Practice with AI-driven interviews and boost your confidence."
            delay={0.5}
          />
          <Feature
            icon="💬"
            iconBg="bg-gradient-to-br from-pink-500 to-purple-600"
            title="Communication Tools"
            des="Improve speaking and writing with smart AI communication support."
            delay={0.6}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto pb-8 flex justify-center sm:justify-end gap-6 sm:gap-8 text-xs sm:text-sm text-gray-500">
        <a href="#" className="hover:text-gray-700 transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-gray-700 transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-gray-700 transition-colors">
          Support
        </a>
      </footer>
    </div>
  );
}

function Feature({ icon, iconBg, title, des, delay }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{
        y: -12,
        rotateX: 8,
        rotateY: -8,
        scale: 1.05,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15,
        },
      }}
      className="relative rounded-2xl p-5 sm:p-6 bg-black/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_80px_rgba(0,0,0,0.7)] text-white opacity-90 hover:opacity-100"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${iconBg} flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 shadow-lg`}
        >
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
          {des}
        </p>
      </div>
    </Motion.div>
  );
}

export default Auth;
