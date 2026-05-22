import React, { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { GraduationCap, LogOut, ChevronLeft, Plus, FileText, History, User } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice.js";
import axios from "axios";
import { serverUrl } from "../App.jsx";

function NavbarNotes() {
  const [notesOpen, setNotesOpen] = useState(false);
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
        className="mx-auto mt-4 sm:mt-6 w-[min(1300px,94vw)]"
      >
        <div className="rounded-2xl bg-neutral-950/95 ring-1 ring-white/10 shadow-[0_18px_55px_-25px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between px-4 py-3 sm:px-7 sm:py-5">
            
            {/* Left Section: Back & Brand */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate(-1)}
                className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/15 transition-all cursor-pointer shrink-0"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 shrink-0">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm sm:text-base font-semibold text-white leading-tight"> SukuAI </div>
                  <div className="text-[8px] sm:text-[10px] text-slate-400 font-medium leading-tight"> 
                    AI-powered exam-oriented notes & revision 
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Credits & My Notes */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Credits Section */}
              <div className="relative">
                <div className="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:pl-4 rounded-full bg-white/5 border border-white/10 text-white text-[11px] sm:text-sm shadow-inner">
                  <span className="text-blue-400 text-[10px] sm:text-xs">🔷</span>
                  <span className="font-bold">{credits}</span>
                  <button 
                    onClick={() => setCreditsOpen(!creditsOpen)}
                    className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors cursor-pointer"
                  >
                    <Plus className="text-blue-400" size={14} sm={16} />
                  </button>
                </div>

                <AnimatePresence>
                  {creditsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setCreditsOpen(false)} />
                      <Motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 z-50 w-56 sm:w-64 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-4 sm:p-5 shadow-2xl"
                      >
                        <h3 className="text-base font-bold text-white mb-1">Top up Credits</h3>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                          Get more credits to generate high-quality AI notes and diagrams.
                        </p>
                        <button className="w-full py-2.5 text-xs sm:text-sm bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer" onClick={() => navigate("/pricing")} >
                          Buy More
                        </button>
                      </Motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* My Notes Button (Replacing Profile) */}
              <div className="relative">
                <button
                  onClick={() => setNotesOpen(!notesOpen)}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all cursor-pointer border ${
                    notesOpen 
                    ? "bg-white/20 border-orange-500/50 shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <FileText className={`h-4 w-4 sm:h-5 sm:w-5 ${notesOpen ? "text-orange-400" : "text-white"}`} />
                  <span className="text-white text-xs sm:text-sm font-medium hidden xs:block">My Notes</span>
                </button>

                <NotesPopover
                  open={notesOpen}
                  onClose={() => setNotesOpen(false)}
                />
              </div>

            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}

function NotesPopover({ open, onClose }) {
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
            className="absolute right-0 top-14 z-50 w-64 sm:w-72 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
          >
            {/* Header: Account Info */}
            <div className="bg-white/5 p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                    {userData?.email ? userData.email[0].toUpperCase() : <User size={14}/>}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">My Notes</span>
                    <span className="text-xs text-slate-300 truncate font-medium">{userData?.email || "User"}</span>
                  </div>
                </div>
            </div>

            {/* Menu Options */}
            <div className="p-2">
              <button
                onClick={() => { navigate("/history"); onClose(); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <History size={18} className="text-orange-400" />
                </div>
                <span>History</span>
              </button>
              
              <div className="my-2 h-px bg-white/5 mx-2" />
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-red-500/5 flex items-center justify-center">
                  <LogOut size={16} />
                </div>
                <span>Sign out</span>
              </button>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NavbarNotes;