import React from "react";
import Navbar from "../components/Navbar.jsx";
import { motion as Motion } from "framer-motion";
import img from "../assets/img1.png";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Notes() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <div className="flex-grow">
        {/* top */}
        <section className="max-w-7xl mx-auto px-8 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
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
                "-mt-32" 
              ].join(" ")}
            >
              <Sparkles className="h-4 w-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
              <span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                AI-Powered Study Platform
              </span>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              whileHover={{ rotateX: 6, rotateY: -6 }}
              className="transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Motion.h2
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 text-5xl lg:text-7xl font-[950] tracking-tighter leading-[1.1] "
              >
                {/* Modern Black 3D Text */}
                <span
                  className="text-[#121212] block"
                  style={{
                    textShadow: `
                        1px 1px 0px #d1d5db, 
                        2px 2px 0px #94a3b8,
                        0px 10px 20px rgba(0,0,0,0.15)
                      `,
                  }}
                >
                  Create Smart <br />
                  AI Notes in Seconds
                </span>
              </Motion.h2>

              <Motion.p
                whileHover={{ y: -2 }}
                className="mt-6 max-w-xl text-lg bg-gradient-to-br from-gray-700 via-gray-500/80 to-gray-700 bg-clip-text text-transparent"
                style={{
                  transform: "translateZ(40px)",
                  textShadow: "0 18px 40px rgba(0,0,0,0.25)",
                  transformStyle: "preserve-3d",
                }}
              >
                Generate exam-focused notes, Project documentation, and flow
                diagrams and revisions-ready content using AI — faster, cleaner
                and smarter.
              </Motion.p>

            </Motion.div>

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
                onClick={() => navigate("/notes-page")}
              >
                Get Started
              </Motion.button>
          </div>

          <Motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{
              y: -12,
              rotateX: 8,
              rotateY: -8,
              scale: 1.05,
            }}
            className="transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="overflow-hidden">
              <img
                src={img}
                alt="img"
                style={{ transform: "translateZ(35px)" }}
              />
            </div>
          </Motion.div>
        </section>

        {/* bottom */}
        <section className="max-w-6xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-4 gap-10">
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
            icon="📊"
            iconBg="bg-gradient-to-br from-pink-500 to-pink-600"
            title="Flow Diagrams"
            des="Generate flow diagrams and diagrams for your projects."
            delay={0.5}
          />
        </section>
      </div>

      <Footer />
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

export default Notes;
