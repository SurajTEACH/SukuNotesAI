

import React, { useMemo } from "react";

function SidebarNotes({ result }) {
  const ok = result?.subTopics && result?.questions?.short && result?.questions?.long;
  const entries = useMemo(() => (result?.subTopics ? Object.entries(result.subTopics) : []), [result]);

  if (!ok) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📌</span>
        <h3 className="text-base sm:text-lg font-bold text-indigo-700">Quick Exam View</h3>
      </div>

      {/* Importance */}
      <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
        <p className="text-sm font-semibold text-gray-800">🔥 Exam Importance</p>
        <p className="mt-1 text-sm font-bold text-yellow-800">{result.importance || "—"}</p>
      </div>

      {/* Subtopics */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">⭐ Sub Topics (Priority Wise)</p>
          <span className="text-xs text-gray-500">{entries.reduce((a, [,t]) => a + (t?.length || 0), 0)} items</span>
        </div>

        <div className="space-y-3">
          {entries.map(([star, topics]) => (
            <div
              key={star}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            >
              <p className="text-sm font-bold text-indigo-700 mb-2">{star} Priority</p>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                {Array.isArray(topics) && topics.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Questions */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-gray-800">🚨 Important Questions</p>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-bold text-indigo-700 mb-2">❓ Short Questions</p>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            {result.questions.short.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-bold text-purple-700 mb-2">📚 Long Questions</p>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            {result.questions.long.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>

        {result.questions.diagram && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm font-bold text-sky-700 mb-2">🗺️ Diagram Question</p>
            <p className="text-sm text-gray-700">{result.questions.diagram}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SidebarNotes;
