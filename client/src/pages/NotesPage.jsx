

import React, { useMemo, useState } from "react";
import NavbarNotes from "../components/NavbarNotes.jsx";
import { motion as Motion, AnimatePresence } from "framer-motion";
import TopicFrom from "../components/TopicFrom.jsx";
import SidebarNotes from "../components/SidebarNotes.jsx";
import FinalResultNotes from "../components/FinalResultNotes.jsx";

function NotesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // {data, noteId, creditsLeft} OR payload
  const [error, setError] = useState("");

  // ✅ New: store current topic name for meta card
  const [topicName, setTopicName] = useState("");

  // Normalize: result wrapper vs direct payload
  const payload = useMemo(() => result?.data ?? result, [result]);

  const meta = useMemo(
    () => ({
      creditsLeft: result?.creditsLeft,
      noteId: result?.noteId,
    }),
    [result]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavbarNotes />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="space-y-6">
          {/* Form */}
          <TopicFrom
            setResult={setResult}
            setLoading={setLoading}
            loading={loading}
            setError={setError}
            setTopicName={setTopicName} // ✅ pass setter
          />

          {/* Alerts */}
          <AnimatePresence>
            {loading && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4 shadow-sm"
              >
                <Motion.p
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="text-sm sm:text-base font-semibold text-indigo-700"
                >
                  Generating exam‑focused notes… (please wait)
                </Motion.p>
              </Motion.div>
            )}

            {!!error && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm"
              >
                <p className="text-sm sm:text-base font-semibold text-red-700">{error}</p>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Empty Placeholder */}
          {!payload && !loading && (
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] bg-white border border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-10"
            >
              <div className="max-w-2xl mx-auto text-center space-y-2">
                <p className="text-4xl">📘</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Generated notes will appear here
                </h3>
                <p className="text-sm text-gray-500">
                  Fill details above and click “Generate Professional Notes”.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-600">Exam‑style</p>
                    <p className="text-sm text-gray-700 mt-1">Structure + questions</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-600">Quick Revision</p>
                    <p className="text-sm text-gray-700 mt-1">5‑minute mode</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-600">Visuals</p>
                    <p className="text-sm text-gray-700 mt-1">Diagram + charts</p>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}

          {/* Result Layout */}
          {payload && (
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 space-y-4">
                  {/* ✅ Meta card (Topic name instead of noteId) */}
                  <Motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 overflow-hidden relative"
                  >
                    {/* soft glow */}
                    <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-indigo-100 blur-3xl opacity-60" />
                    <div className="absolute -bottom-24 -left-24 w-52 h-52 rounded-full bg-purple-100 blur-3xl opacity-60" />

                    <div className="relative">
                      <p className="text-xs font-semibold text-gray-500">Generate Notes by - SukuAI</p>

                      <p className="text-sm text-gray-800 mt-2">
                        Topic:
                        <span className="ml-2 font-extrabold text-gray-900">
                          {topicName || payload?.topic || "—"}
                        </span>
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-500">Available Credits</p>
                          <p className="text-sm font-extrabold text-indigo-700">
                            {typeof meta.creditsLeft === "number" ? meta.creditsLeft : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Motion.div>

                  <SidebarNotes result={payload} />
                </div>
              </aside>

              {/* Main */}
              <section className="lg:col-span-8">
                <div className="rounded-2xl bg-white border border-gray-200 shadow-[0_18px_55px_rgba(0,0,0,0.12)] overflow-hidden">
                  <FinalResultNotes result={payload} />
                </div>
              </section>
            </Motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NotesPage;
