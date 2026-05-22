// NotesHistory.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  GraduationCap,
  ChevronLeft,
  Plus,
  Menu,
  X,
  Search,
  Calendar,
  Sparkles,
  BookOpen,
  Brain,
  Layers,
  AlignLeft,
  Clock,
  TrendingUp,
  ChevronRight,
  NotebookPen,
  RotateCcw,
} from "lucide-react";

import FinalResultNotes from "../components/FinalResultNotes";

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function NotesHistory() {
  const navigate = useNavigate();
  const { userData } = useSelector((s) => s.user);
  const credits = userData?.credits || 0;

  const [topics, setTopics]       = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected]   = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingNote, setLoadingNote] = useState(false);
  const [errorList, setErrorList]     = useState("");
  const [errorNote, setErrorNote]     = useState("");

  const [creditsOpen, setCreditsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [query, setQuery]             = useState("");

  const SINGLE_NOTE_PATH = (id) => `/api/notes/${id}`;

  /* ── Fetch all notes list ── */
  useEffect(() => {
    let mounted = true;
    const myNotes = async () => {
      setLoadingList(true);
      setErrorList("");
      try {
        const res = await axios.get(`${serverUrl}/api/notes/get-notes`, {
          withCredentials: true,
        });
        const list = Array.isArray(res.data) ? res.data : [];
        if (!mounted) return;
        setTopics(list);
        if (!selectedId && list.length) {
          const firstId = list[0]?._id;
          if (firstId) setSelectedId(firstId);
        }
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErrorList("Notes not load . Please refresh / login again.");
      } finally {
        if (mounted) setLoadingList(false);
      }
    };
    myNotes();
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, []);

  /* ── Fetch single note ── */
  useEffect(() => {
    if (!selectedId) return;
    let mounted = true;
    const fetchSingle = async () => {
      setLoadingNote(true);
      setErrorNote("");
      setSelected(null);
      try {
        const res = await axios.get(
          `${serverUrl}${SINGLE_NOTE_PATH(selectedId)}`,
          { withCredentials: true }
        );
        if (!mounted) return;
        setSelected(res.data || null);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErrorNote("Note open nahi ho raha. Route/ID check kar lo.");
      } finally {
        if (mounted) setLoadingNote(false);
      }
    };
    fetchSingle();
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, [selectedId]);

  /* ── Derived state ── */
  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) => {
      const topic   = (t?.topic || t?.title || t?.name || "").toLowerCase();
      const subject = (t?.subject || "").toLowerCase();
      return topic.includes(q) || subject.includes(q);
    });
  }, [topics, query]);

  const selectedMeta = useMemo(
    () => topics.find((t) => t?._id === selectedId) || null,
    [topics, selectedId]
  );

  /* ── ESC closes overlays ── */
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key !== "Escape") return;
      setDrawerOpen(false);
      setCreditsOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const openNote = (id) => {
    setSelectedId(id);
    setDrawerOpen(false);
  };

  /* ══════════════════════════════════════════════════════════════
     ✅ PAGE = h-screen flex flex-col overflow-hidden
        → No page-level scroll. Everything inside viewport.
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white text-slate-900">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-dark {
          background: rgba(8, 8, 10, 0.93);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .sidebar-item-glow:hover {
          box-shadow: 0 4px 24px -4px rgba(251,146,60,0.18);
        }
      `}</style>

      {/* ══════════ NAVBAR — shrink-0 (takes own height, never grows) ══════════ */}
      <div className="shrink-0 z-30">
        <Motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="mx-auto mt-3 sm:mt-4 w-[min(1340px,95vw)]"
        >
          <div className="glass-dark rounded-2xl border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

              {/* Left: Back + Brand */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => navigate("/notes-page")}
                  className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.15] active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Back"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
                </button>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 shrink-0 shadow-lg shadow-orange-900/30">
                    <GraduationCap className="h-5 w-5 text-white" />
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#08080a]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-base font-extrabold text-white leading-tight tracking-tight truncate">
                      Suku
                      <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent ml-1">
                        AI
                      </span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/35 font-medium leading-tight truncate">
                      AI-powered exam notes & revision
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Credits + Mobile Menu + New Notes */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Credits pill */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-white text-[11px] sm:text-sm">
                    <Sparkles size={12} className="text-yellow-400 shrink-0" />
                    <span className="font-extrabold tabular-nums">{credits}</span>
                    <span className="text-white/35 hidden sm:inline text-[10px]">credits</span>
                    <button
                      onClick={() => setCreditsOpen((v) => !v)}
                      className="ml-1 h-6 w-6 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.18] transition-colors cursor-pointer"
                      title="Top up credits"
                    >
                      <Plus className="text-white/80" size={12} />
                    </button>
                    <button
                      onClick={() => { setCreditsOpen(false); setDrawerOpen(true); }}
                      className="ml-0.5 grid h-6 w-6 sm:hidden place-items-center rounded-full bg-white/[0.08] hover:bg-white/[0.18] transition"
                    >
                      <Menu size={12} className="text-white/80" />
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
                            <Sparkles size={18} className="text-white" />
                          </div>
                          <h3 className="text-sm font-extrabold text-white mb-1">Top up Credits</h3>
                          <p className="text-xs text-white/45 mb-4 leading-relaxed">
                            Get more credits to generate high-quality AI notes, diagrams & charts.
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

                {/* New Notes — desktop */}
                <button
                  onClick={() => navigate("/notes-page")}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold hover:bg-white/90 active:scale-95 transition text-sm shadow-md cursor-pointer"
                >
                  <NotebookPen size={15} />
                  New Notes
                </button>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ✅ MAIN AREA — flex-1 min-h-0 overflow-hidden
             Takes all remaining height below navbar. No page scroll.
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {/* ✅ Inner container — full height, centred, small padding */}
        <div className="mx-auto w-[min(1340px,95vw)] h-full py-4 sm:py-5">

          {/* ✅ Grid — h-full so children can stretch to full height */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 h-full">

            {/* ══ DESKTOP SIDEBAR — h-full, no page scroll ══ */}
            <aside className="hidden lg:flex lg:flex-col h-full min-h-0">
              <SidebarCard
                loading={loadingList}
                error={errorList}
                topics={filteredTopics}
                totalCount={topics.length}
                selectedId={selectedId}
                onSelect={openNote}
                query={query}
                setQuery={setQuery}
                onNewNotes={() => navigate("/notes-page")}
              />
            </aside>

            {/* ══ CONTENT PANEL ══
                ✅ min-h-0 + overflow-y-auto → only THIS scrolls
            ══ */}
            <main className="min-h-0 overflow-y-auto no-scrollbar">
              <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.14)] overflow-hidden">

                {/* Mobile top bar (sticky inside its scroll container) */}
                <div className="lg:hidden sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => setDrawerOpen(true)}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition shrink-0"
                    >
                      <Menu size={16} className="text-slate-700" />
                    </button>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 truncate">
                        {selected?.topic || selectedMeta?.topic || "Select a Note"}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {selected?.createdAt
                          ? new Date(selected.createdAt).toLocaleDateString()
                          : "Tap menu to browse"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/notes-page")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 transition text-xs cursor-pointer"
                  >
                    <NotebookPen size={13} />
                    New
                  </button>
                </div>

                {/* Content body */}
                <div className="p-4 sm:p-6">
                  {loadingNote ? (
                    <SkeletonNote />
                  ) : errorNote ? (
                    <ErrorState
                      message={errorNote}
                      onRetry={() => setSelectedId((id) => id)}
                    />
                  ) : !selected ? (
                    <EmptyState />
                  ) : (
                    <NoteViewer selected={selected} meta={selectedMeta} />
                  )}
                </div>
              </div>

              {/* Bottom breathing room inside scroll area */}
              <div className="h-6" />
            </main>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE DRAWER (position:fixed — unaffected by layout)
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setDrawerOpen(false)}
            />
            <Motion.div
              initial={{ x: -420 }}
              animate={{ x: 0 }}
              exit={{ x: -420 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[88vw] max-w-[360px] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 glass-dark shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-900/30">
                    <GraduationCap size={17} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white">Your Notes</div>
                    <div className="text-[11px] text-white/40">Tap a note to open</div>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.1] border border-white/[0.1] hover:bg-white/[0.15] transition cursor-pointer"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden p-3">
                <SidebarCard
                  compact
                  loading={loadingList}
                  error={errorList}
                  topics={filteredTopics}
                  totalCount={topics.length}
                  selectedId={selectedId}
                  onSelect={openNote}
                  query={query}
                  setQuery={setQuery}
                  onNewNotes={() => { setDrawerOpen(false); navigate("/notes-page"); }}
                />
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR CARD
   ✅ Uses flex-1 min-h-0 on list when NOT compact → fills parent height
═══════════════════════════════════════════════════════════════════ */
function SidebarCard({
  compact = false,
  loading,
  error,
  topics,
  totalCount,
  selectedId,
  onSelect,
  query,
  setQuery,
  onNewNotes,
}) {
  return (
    /* ✅ h-full + flex col so the list can flex-1 inside */
    <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col h-full">

      {/* ── Header (fixed height) ── */}
      <div className="shrink-0 p-4 border-b border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 shrink-0">
              <Layers size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-white truncate">Your Notes</div>
              <div className="text-[10px] text-white/40 truncate">History + quick access</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-white/70">
              {totalCount} notes
            </span>
            <button
              onClick={onNewNotes}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-slate-900 font-extrabold hover:bg-white/90 transition text-[11px] cursor-pointer shadow-md"
            >
              <Plus size={11} />
              New
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topic..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-orange-400/40 text-sm placeholder:text-white/25 text-white"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Stats row (fixed height, optional) ── */}
      {!compact && !loading && topics.length > 0 && (
        <div className="shrink-0 px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <TrendingUp size={11} className="text-emerald-500" />
            <span className="font-semibold">
              {query ? `${topics.length} results` : `${topics.length} total`}
            </span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock size={11} className="text-blue-500" />
            <span>Recently updated</span>
          </div>
        </div>
      )}

      {/* ── List ──
          ✅ Desktop (compact=false): flex-1 min-h-0 → fills remaining sidebar height
          ✅ Drawer  (compact=true) : max-h-[68vh]  → bounded inside drawer
      ── */}
      <div
        className={[
          "p-2 overflow-y-auto no-scrollbar",
          compact
            ? "flex-1 min-h-0 max-h-[68vh]"   // drawer: bounded
            : "flex-1 min-h-0",                // desktop: fills parent
        ].join(" ")}
      >
        {loading ? (
          <SidebarSkeleton />
        ) : error ? (
          <div className="m-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        ) : topics?.length ? (
          <div className="space-y-1">
            {topics.map((t, idx) => (
              <NoteCard
                key={t?._id}
                note={t}
                index={idx}
                active={t?._id === selectedId}
                onClick={() => t?._id && onSelect(t._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 border border-slate-200 mb-3">
              <Brain size={20} className="text-slate-400" />
            </div>
            <div className="text-sm font-bold text-slate-500">Koi notes nahi mile</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {query ? "Try different search terms" : "Create your first note!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Note Card (sidebar item) ── */
const NOTE_COLORS = [
  { icon: "bg-blue-100 border-blue-200",    iconText: "text-blue-600"   },
  { icon: "bg-violet-100 border-violet-200", iconText: "text-violet-600" },
  { icon: "bg-emerald-100 border-emerald-200", iconText: "text-emerald-600" },
  { icon: "bg-amber-100 border-amber-200",  iconText: "text-amber-600"  },
  { icon: "bg-rose-100 border-rose-200",    iconText: "text-rose-600"   },
  { icon: "bg-cyan-100 border-cyan-200",    iconText: "text-cyan-600"   },
];

function NoteCard({ note, index, active, onClick }) {
  const topic     = note?.topic || note?.title || "Untitled";
  const createdAt = note?.createdAt ? new Date(note.createdAt) : null;
  const color     = NOTE_COLORS[index % NOTE_COLORS.length];

  const chips = [
    note?.classLevel ? `Class ${note.classLevel}` : null,
    note?.board   || null,
    note?.subject || null,
  ].filter(Boolean);

  const firstLetter = topic.charAt(0).toUpperCase();

  return (
    <Motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={[
        "w-full text-left rounded-xl border p-3 transition-all sidebar-item-glow cursor-pointer",
        active
          ? "bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 border-orange-200 shadow-sm"
          : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={[
            "mt-0.5 grid h-9 w-9 place-items-center rounded-xl border shrink-0 text-sm font-extrabold",
            active
              ? "bg-gradient-to-br from-orange-400 to-pink-500 border-orange-300 text-white"
              : `${color.icon} ${color.iconText}`,
          ].join(" ")}
        >
          {firstLetter}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <div
              className={[
                "font-bold text-sm truncate leading-tight",
                active ? "text-orange-700" : "text-slate-900",
              ].join(" ")}
            >
              {topic}
            </div>
            <ChevronRight
              size={13}
              className={active ? "text-orange-400 shrink-0" : "text-slate-300 shrink-0"}
            />
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Calendar size={10} />
            <span className="truncate">
              {createdAt
                ? createdAt.toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "2-digit",
                  })
                : "—"}
            </span>
          </div>

          {chips.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {chips.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className={[
                    "px-1.5 py-0.5 rounded-full text-[10px] font-medium border",
                    active
                      ? "bg-orange-100 border-orange-200 text-orange-700"
                      : "bg-slate-100 border-slate-200 text-slate-600",
                  ].join(" ")}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NOTE VIEWER — FinalResultNotes integrated
═══════════════════════════════════════════════════════════════════ */

function safeParse(value) {
  if (typeof value !== "string") return value;
  const s = value.trim();
  if (!(s.startsWith("{") || s.startsWith("["))) return value;
  try { return JSON.parse(s); } catch { return value; }
}

function NoteViewer({ selected, meta }) {
  const topic     = selected?.topic || meta?.topic || "Untitled";
  const createdAt = selected?.createdAt || meta?.createdAt;

  const content      = safeParse(selected?.content ?? "");
  const isStructured = content && typeof content === "object" && !Array.isArray(content);

  return (
    <div className="space-y-5">

      {/* ── Hero Header ── */}
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-900/30 shrink-0">
              <BookOpen size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight truncate">
                {topic}
              </h1>
              <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                <Clock size={11} />
                <span>{createdAt ? new Date(createdAt).toLocaleString() : "—"}</span>
              </div>
            </div>
          </div>

          {isStructured && content?.importance && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-yellow-300">
                {content.importance}
              </span>
            </div>
          )}
        </div>

        {/* Sub-topics preview pills */}
        {isStructured && content?.subTopics && (
          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {Object.entries(content.subTopics)
              .flatMap(([, arr]) => (Array.isArray(arr) ? arr : []))
              .slice(0, 6)
              .map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-white/[0.07] border border-white/[0.1] text-[11px] text-white/55"
                >
                  {typeof t === "string" ? t : ""}
                </span>
              ))}
          </div>
        )}
      </Motion.div>

      {/* ── Content ── */}
      {!isStructured ? (
        <FadeSection>
          <ContentCard title="Content" icon={<AlignLeft size={15} />} gradient="from-slate-50 to-white">
            <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
              {content || "No content available."}
            </pre>
          </ContentCard>
        </FadeSection>
      ) : (
        /* ✅ Delegate entirely to FinalResultNotes */
        <FadeSection delay={0.05}>
          <FinalResultNotes result={content} />
        </FadeSection>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED UI HELPERS
═══════════════════════════════════════════════════════════════════ */

function ContentCard({ title, icon, gradient = "from-slate-50 to-white", accentColor = "border-slate-100", children }) {
  return (
    <div className={`rounded-2xl border ${accentColor} bg-gradient-to-br ${gradient} p-4 sm:p-5 shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm">
            {icon}
          </span>
        )}
        <span className="text-sm font-extrabold text-slate-900">{title}</span>
      </div>
      {children}
    </div>
  );
}

function FadeSection({ children, delay = 0 }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </Motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 mb-4 shadow-inner"
      >
        <Brain className="text-slate-400" size={26} />
      </Motion.div>
      <div className="text-base font-extrabold text-slate-800">Koi note select nahi hua</div>
      <div className="mt-1.5 text-sm text-slate-400 max-w-xs">
        Left sidebar se koi topic choose karo, content yahan show hoga.
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
      <div className="font-bold mb-1">Kuch galat ho gaya</div>
      <div className="text-rose-600 text-xs mb-3">{message}</div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 transition text-rose-700 text-xs font-bold cursor-pointer"
      >
        <RotateCcw size={12} />
        Retry
      </button>
    </div>
  );
}

function SkeletonNote() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="rounded-2xl bg-slate-800 p-6 h-28" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="h-3 w-1/4 bg-slate-200 rounded-lg mb-4" />
          <div className="space-y-2.5">
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-11/12 bg-slate-100 rounded" />
            <div className="h-3 w-10/12 bg-slate-100 rounded" />
            <div className="h-3 w-9/12 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-1.5 p-1 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-xl border border-slate-100 p-3">
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 w-3/4 bg-slate-200 rounded" />
              <div className="h-2.5 w-1/2 bg-slate-100 rounded" />
              <div className="h-2 w-1/3 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
