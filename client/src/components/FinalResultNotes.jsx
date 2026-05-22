// client/src/components/FinalResultNotes.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MermaidSetup from "./MermaidSetup";
import RechartSetUp from "./RechartSetUp";
import { motion as Motion } from "framer-motion";
import { downloadNotesPdf } from "../services/api";

const md = {
  h1: ({ children }) => (
    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-6 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mt-6 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">{children}</h3>
  ),
  p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-3">{children}</p>,
  ul: ({ children }) => <ul className="list-disc ml-6 space-y-1 text-gray-700">{children}</ul>,
  li: ({ children }) => <li className="marker:text-indigo-500">{children}</li>,
};

function FancyButton({ children, variant = "indigo", active = false, onClick }) {
  const styles = {
    indigo: {
      base:
        "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent",
      glow: "rgba(79,70,229,0.35)",
      ring: "ring-indigo-200",
    },
    green: {
      base:
        "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-transparent",
      glow: "rgba(16,185,129,0.30)",
      ring: "ring-emerald-200",
    },
    ghost: {
      base:
        "bg-white text-gray-900 border-gray-200 hover:border-gray-300",
      glow: "rgba(0,0,0,0.10)",
      ring: "ring-gray-200",
    },
  };

  const s = styles[variant] || styles.indigo;

  return (
    <Motion.button
      onClick={onClick}
      whileHover={{
        y: -2,
        boxShadow: `0 18px 45px ${s.glow}`,
      }}
      whileTap={{ scale: 0.98, y: 0 }}
      animate={{
        boxShadow: active ? `0 18px 45px ${s.glow}` : "0 8px 22px rgba(0,0,0,0.08)",
      }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={[
        "relative overflow-hidden",
        "px-4 py-2.5 rounded-xl text-sm font-extrabold cursor-pointer",
        "border",
        "w-full sm:w-auto", // ✅ mobile full width, sm+ auto and side-by-side
        "ring-1",
        s.ring,
        s.base,
      ].join(" ")}
    >
      {/* shimmer */}
      <Motion.span
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 35%, rgba(255,255,255,0) 70%)",
        }}
      />
      <span className="relative">{children}</span>
    </Motion.button>
  );
}

function FinalResultNotes({ result }) {
  const [quickRevision, setQuickRevision] = useState(false);

  console.log(result.questions);

  const ok =
    result?.notes &&
    result?.subTopics &&
    result?.questions?.short &&
    result?.questions?.long &&
    Array.isArray(result?.revisionPoints);

  if (!ok) return null;

  const hasDiagram = !!result?.diagram?.data;
  const hasCharts = Array.isArray(result?.charts) && result.charts.length > 0;

 // const handleDownloadPDF = () => window.print();

  return (
    <div className="p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            📚 Generated Notes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quick revision + printable view + visuals (if generated)
          </p>
        </div>

        {/* ✅ Buttons side-by-side on sm+, wrap on mobile */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <FancyButton
            variant="green"
            active={quickRevision}
            onClick={() => setQuickRevision((v) => !v)}
            className="cursor-pointer"
          >
            {quickRevision ? "Exit Revision Mode" : "Quick Revision (5 min)"}
          </FancyButton>

          <FancyButton  className="cursor-pointer" variant="indigo" onClick={()=> downloadNotesPdf(result)}>
            Download / Print PDF
          </FancyButton>
        </div>
      </div>

      {/* Quick Revision */}
      {quickRevision && (
        <section className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5">
          <h3 className="font-extrabold text-green-700 text-lg mb-3">
            ⚡ Exam Quick Revision Points
          </h3>
          <ul className="list-disc ml-6 space-y-1 text-gray-800">
            {result.revisionPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Notes */}
      {!quickRevision && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
            {result.notes}
          </ReactMarkdown>
        </section>
      )}

      {/* Diagram */}
      {hasDiagram && (
        <section className="space-y-3">
          <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 px-4 py-3 font-extrabold text-cyan-800">
            📊 Diagram
          </div>
           <p className='mt-3 text-xs text-gray-500 italic'>🖊️ If you need this diagram for future reference or revision you can save it by taking a screenshot</p>
          <MermaidSetup diagram={result.diagram.data} />
        </section>
      )}

      {/* Charts */}
      {hasCharts && (
        <section className="space-y-3">
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 font-extrabold text-indigo-800">
            📈 Visual Charts
          </div>
          <p className='mt-3 text-xs text-gray-500 italic'> 🖊️ If you need this charts for future reference or revision you can save it by taking a screenshot</p>
          <RechartSetUp charts={result.charts} />
        </section>
      )}

      {/* Questions */}
      <section className="space-y-3">
        <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 font-extrabold text-rose-800">
          ❗ Important Questions
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="font-extrabold text-gray-900 mb-2">Short Questions</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              {result.questions.short.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="font-extrabold text-gray-900 mb-2">Long Questions</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              {result.questions.long.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </div>

        {result.questions.diagram && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="font-extrabold text-gray-900 mb-2">Diagram Question</p>
            <p className="text-gray-700">{result.questions.diagram}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default FinalResultNotes;
