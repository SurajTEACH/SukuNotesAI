import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  MessageSquare,
  Mic,
  Sparkles,
  User
} from "lucide-react";

import { logout, setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App.jsx";

export default function Home() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  

  const features = useMemo(
    () => [
      {
        title: "Notes",
        description: "Generate AI-powered exam notes and study materials.",
        Icon: BookOpen,
        iconBg: "bg-orange-500",
        cardGradient:
          "bg-linear-to-br from-[#18131c] via-[#201825] to-[#2a1f2b]",
        to: "/notes",
      },
      {
        title: "Mock Interview",
        description: "Practice with AI-driven mock interviews tailored to you.",
        Icon: Mic,
        iconBg: "bg-violet-500",
        cardGradient:
          "bg-linear-to-br from-[#151427] via-[#1a1930] to-[#2b2450]",
        to: "/mock-interview",
      },
      {
        title: "Communication",
        description: "Sharpen your professional and academic speaking skills.",
        Icon: MessageSquare,
        iconBg: "bg-emerald-500",
        cardGradient:
          "bg-linear-to-br from-[#0d2428] via-[#0f2a2f] to-[#123840]",
        to: "/communication",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="w-full">
        <Motion.div
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="mx-auto mt-6 w-[min(1120px,92vw)]"
        >
          <div className="rounded-2xl bg-neutral-950/95 ring-1 ring-white/10 shadow-[0_18px_55px_-25px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between px-5 py-4 sm:px-7 sm:py-5">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-pink-500 to-orange-400">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-base font-semibold text-white">
                    SukuAI
                  </div>
                  <div className="text-xs text-slate-400">
                    Master your exams.
                  </div>
                </div>
              </div>

              {/* Profile Menu Wrapper */}
              <div className="relative">
                <button
                  onClick={() => setPopoverOpen(!popoverOpen)}
                  className={`group relative grid h-11 w-11 place-items-center rounded-full transition-all focus:outline-none cursor-pointer ${
                    popoverOpen
                      ? "bg-white/20 ring-2 ring-orange-400/50"
                      : "bg-white/10 ring-1 ring-white/10 hover:bg-white/15"
                  }`}
                >
                  <Motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="h-5 w-5 text-white" />
                  </Motion.div>
                </button>

                {/* Chrome-style Popover */}
                <ProfilePopover
                  open={popoverOpen}
                  onClose={() => setPopoverOpen(false)}
                />
              </div>
            </div>
          </div>
        </Motion.div>
      </div>

      <main className="mx-auto w-[min(1120px,92vw)] pb-16 pt-10">
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
        <div className="mt-10">
          {/* Welcome Back - Subtle 3D */}
          <Motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="text-5xl font-black tracking-tighter text-slate-800 sm:text-7xl"
            style={{
              // 3D Depth Layering
              textShadow: `
                1px 1px 0px #cbd5e1, 
                2px 2px 0px #cbd5e1, 
                3px 3px 0px #cbd5e1, 
                4px 4px 0px #cbd5e1,
                5px 5px 15px rgba(0,0,0,0.2), 
                10px 10px 30px rgba(0,0,0,0.1)
              `,
              // Optional: halka sa tilt dene ke liye
              transform: "perspective(500px) rotateX(5deg)",
            }}
          >
            Welcome back!
          </Motion.h1>

          {/* Main Heading - Heavy 3D Look */}
          <Motion.h2
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]"
            style={{
              // Inline style for proper 3D text shadow layering
              textShadow:
                "0 4px 8px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.08)",
            }}
          >
            <span className="bg-linear-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
              What would you like to learn today?
            </span>
          </Motion.h2>

          {/* Subtext - Soft shadow */}
          <Motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.4 }}
            className="mt-6 max-w-2xl text-lg font-medium text-slate-600 drop-shadow-sm"
          >
            Choose a feature below to get started. Each tool is designed to help
            you prepare smarter and achieve better results.
          </Motion.p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ------------------------- Chrome-Style Popover ------------------------- */
function ProfilePopover({ open, onClose }) {
  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null))
      navigate("/auth");
    } catch (err) {
      console.log(err);
    }
    dispatch(logout());
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Invisible click-away overlay */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
          >
            {/* Header / User Info */}
            <div className="flex flex-col items-center border-b border-white/5 bg-white/5 p-6 text-center">
              <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-linear-to-br from-pink-500 to-orange-400 text-white shadow-xl">
                <User size={32} />
              </div>
              <div className="w-full">
                <div className="truncate text-lg font-bold text-white">
                  {userData?.name || "Ready to Learn?"}
                </div>
                <div className="truncate text-xs text-slate-400">
                  {userData?.email || "Connect your account"}
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-2">
              <div className="my-1 h-px bg-white/5" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- Feature Card ----------------------------- */
function FeatureCard({ title, description, Icon, iconBg, cardGradient, to }) {
  return (
    <Motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className="h-full"
    >
      <Link
        to={to}
        className={[
          "group relative block h-full overflow-hidden rounded-2xl p-6 transition-shadow duration-300",
          "ring-1 ring-white/10 border border-white/10 shadow-xl",
          cardGradient,
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/15" />
        <div className="flex items-start gap-4">
          <div
            className={`${iconBg} grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-lg ring-1 ring-white/15`}
          >
            {/* Yahan Icon ko render kiya gaya hai */}
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold text-white">{title}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/70">
              {description}
            </div>
          </div>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85">
          Open <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </Motion.div>
  );
}
