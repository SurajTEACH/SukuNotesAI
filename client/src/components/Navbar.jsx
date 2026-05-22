import React, { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { GraduationCap, User, LogOut, ChevronLeft, Plus} from "lucide-react"; 
import { Sparkle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {  setUserData } from "../redux/userSlice.js";
import axios from "axios";
import { serverUrl } from "../App";

function Navbar() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const credits = userData?.credits || 0;

  return (
    <div className="w-full">
      <Motion.div
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="mx-auto mt-6 w-[min(1300px,94vw)]"
      >
        <div className="rounded-2xl bg-neutral-950/95 ring-1 ring-white/10 shadow-[0_18px_55px_-25px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between px-5 py-4 sm:px-7 sm:py-5">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/15 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-semibold text-white leading-tight"> SukuAI </div>
                  <div className="text-[10px] text-slate-400"> Master your exams with confidence. </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Credits Section */}
              <div className="relative">
                <div className="flex items-center gap-2 px-1 py-1 pl-4 rounded-full bg-white/10 border border-white/20 text-white text-sm shadow-md">
                  <span className="text-blue-400 text-xs">🔷</span>
                  <span className="font-medium mr-1">{credits}</span>
                  <button 
                    onClick={() => setCreditsOpen(!creditsOpen)}
                    className="h-7 w-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Plus className="text-blue-500" size={20} />
                  </button>
                </div>

                <AnimatePresence>
                    {creditsOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setCreditsOpen(false)} />
                        <Motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 z-50 w-60 sm:w-68 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f11] p-5 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.9)]"
                        >
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 mb-3">
                            <Sparkle size={18} className="text-white" />
                          </div>
                          <h3 className="text-sm font-extrabold text-white mb-1">Power Up Your Preparation ⚡</h3>
                          <p className="text-xs text-white/45 mb-4 leading-relaxed">
                           Generate AI Notes, Practice Mock Interviews & Improve Communication Skills.
                          </p>
                          <button
                            className="w-full py-2.5 text-sm bg-gradient-to-r from-orange-500 to-pink-500 text-white font-extrabold rounded-xl hover:opacity-90 active:scale-98 transition cursor-pointer"
                            onClick={() => navigate("/pricing")}
                          >
                            Buy More Credits →
                          </button>
                        </Motion.div>
                      </>
                    )}
                  </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setPopoverOpen(!popoverOpen)}
                  className={`group relative grid h-11 w-11 place-items-center rounded-full transition-all focus:outline-none cursor-pointer ${
                    popoverOpen ? "bg-white/20 ring-2 ring-orange-400/50" : "bg-white/10 ring-1 ring-white/10 hover:bg-white/15"
                  }`}
                >
                  {/* Avatar with Email First Letter */}
                  <span className="text-white font-bold uppercase">
                    {userData?.email ? userData.email[0] : <User size={20} />}
                  </span>
                </button>

                <ProfilePopover
                  open={popoverOpen}
                  onClose={() => setPopoverOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}

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
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
    } catch (err) { console.log(err); }
    dispatch(setUserData(null));
    navigate("/auth");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
          >
            {/* Header */}
            <div className="flex flex-col items-center border-b border-white/5 bg-white/5 p-6 text-center">
              <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-xl text-2xl font-bold uppercase">
                {userData?.email ? userData.email[0] : <User size={32} />}
              </div>
              <div className="w-full">
                
                
                <div className="truncate text-xs text-slate-400">
                  {userData?.email || "Connect your account"}
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-2 space-y-1">
              <MenuItem 
                text="History" 
                onClick={() => { navigate("/history"); onClose(); }} 
              />
              
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

function MenuItem({ onClick, text, red }) {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer rounded-xl ${
        red ? "text-red-400 hover:bg-red-500/10" : "text-gray-200 hover:bg-white/10"
      }`}
    >
      {text}
    </div>
  );
}

export default Navbar;