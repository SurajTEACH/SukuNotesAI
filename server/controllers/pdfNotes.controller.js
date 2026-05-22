

import PDFDocument from "pdfkit";

/* ============================================================
   🎨 DESIGN TOKENS
   ============================================================ */
const C = {
  grad1:        "#6366F1",
  grad2:        "#8B5CF6",
  grad3:        "#EC4899",
  primary:      "#6366F1",
  primaryDark:  "#4338CA",
  primaryDeep:  "#312E81",
  primaryLight: "#EEF2FF",
  primaryGlow:  "#C7D2FE",
  secondary:    "#8B5CF6",
  accent:       "#F59E0B",
  accentLight:  "#FEF3C7",
  success:      "#10B981",
  successLight: "#D1FAE5",
  danger:       "#EF4444",
  dangerLight:  "#FEE2E2",
  info:         "#0EA5E9",
  infoLight:    "#E0F2FE",
  dark:         "#0F172A",
  darkCard:     "#1E293B",
  darkBorder:   "#334155",
  text:         "#1E293B",
  subtext:      "#64748B",
  muted:        "#94A3B8",
  border:       "#E2E8F0",
  borderLight:  "#F1F5F9",
  white:        "#FFFFFF",
  bg:           "#F8FAFC",
  bgAlt:        "#F1F5F9",
  cardBg:       "#FFFFFF",
  cardShadow:   "#E2E8F0",
  highBg:       "#FFF1F2",
  medBg:        "#FFFBEB",
  lowBg:        "#F0FDF4",
};

const F = {
  display: 30, h1: 22, h2: 16, h3: 13,
  h4: 11, body: 10.5, small: 9.5, tiny: 8.5, micro: 7.5,
};

const PG = {
  margin: 44,
  width:  595.28,
  height: 841.89,
  get cw() { return this.width - this.margin * 2; },
  // ✅ FIX: footer zone starts at 808, content stops at 790
  contentBottom: 790,
  footer:        808,
};

/* ============================================================
   🛠️  PRIORITY PARSER — FIXED
   ============================================================ */
function parsePriority(key) {
  const k = String(key).trim();

  const filledStars = (k.match(/★/g)  || []).length;
  const emojiStars  = (k.match(/⭐/g) || []).length;
  const asciiStars  = (k.match(/\*/g) || []).length;
  const totalStars  = Math.max(filledStars, emojiStars, asciiStars);

  if (totalStars >= 3 || /\bhigh\b/i.test(k) || /priority[\s_\-]*3/i.test(k))
    return { label: "HIGH", level: 3, color: C.danger,  bg: C.highBg, glow: "#FECACA" };

  if (totalStars >= 2 || /\bmed(ium)?\b/i.test(k) || /priority[\s_\-]*2/i.test(k))
    return { label: "MED",  level: 2, color: C.accent,  bg: C.medBg,  glow: "#FDE68A" };

  return   { label: "LOW",  level: 1, color: C.success, bg: C.lowBg,  glow: "#A7F3D0" };
}

/* ============================================================
   🎨 DRAWING PRIMITIVES
   ============================================================ */
function rRect(doc, x, y, w, h, r, fill, stroke = null, sw = 0.8) {
  doc.save().roundedRect(x, y, w, h, r);
  if (fill)   doc.fillColor(fill).fill();
  if (stroke) doc.roundedRect(x, y, w, h, r).strokeColor(stroke).lineWidth(sw).stroke();
  doc.restore();
}

function sRect(doc, x, y, w, h, fill) {
  doc.save().rect(x, y, w, h).fillColor(fill).fill().restore();
}

function gradRect(doc, x, y, w, h, r, colorA, colorB, steps = 36) {
  doc.save();
  doc.roundedRect(x, y, w, h, r).fillColor(colorA).fill();
  const sw = w / steps;
  for (let i = 0; i < steps; i++) {
    doc.rect(x + i * sw, y, sw + 0.5, h)
       .fillOpacity((i / steps) * 0.45).fillColor(colorB).fill();
  }
  doc.restore();
}

function hr(doc, color = C.border, lw = 0.5) {
  const y = doc.y;
  doc.save()
     .moveTo(PG.margin, y).lineTo(PG.margin + PG.cw, y)
     .strokeColor(color).lineWidth(lw).stroke()
     .restore();
}

/* ============================================================
   🔑 KEY FIX: safe text renderer — NO doc.y corruption
   ============================================================ */
/**
 * Renders text at explicit (x, y) and returns the new Y position.
 * Uses pre-calculated height to avoid relying on PDFKit's cursor
 * after doc.restore() or potential auto-page-break interference.
 */
function safeText(doc, text, x, y, opts, font = "Helvetica", size = F.body, color = C.text) {
  const h = doc.heightOfString(text, { width: opts.width || PG.cw, fontSize: size, lineGap: opts.lineGap || 0 });
  doc.save()
     .font(font).fontSize(size).fillColor(color).fillOpacity(1)
     .text(text, x, y, { ...opts, lineBreak: true })
     .restore();
  return y + h;   // ✅ always returns correct next-Y (no page-break corruption)
}

/* ============================================================
   🧱 COMPONENT LIBRARY
   ============================================================ */
function secHeader(doc, title, color = C.primary) {
  const x = PG.margin, y = doc.y, w = PG.cw, h = 30;

  gradRect(doc, x, y, w, h, 6, C.primaryLight, color + "22");
  rRect(doc, x, y, 4, h, 2, color);

  const dotY = y + h / 2;
  doc.save().circle(x + 16, dotY, 5).fillColor(color).fillOpacity(0.15).fill().restore();
  doc.save().circle(x + 16, dotY, 3).fillColor(color).fillOpacity(0.35).fill().restore();
  doc.save().circle(x + 16, dotY, 1.5).fillColor(color).fillOpacity(1).fill().restore();

  safeText(doc, title.toUpperCase(), x + 30, y + 9, { width: w - 70, characterSpacing: 0.8 },
           "Helvetica-Bold", F.h3, color);

  const bw = 28, bh = 14;
  rRect(doc, x + w - bw - 4, y + (h - bh) / 2, bw, bh, 7, color);
  safeText(doc, "NEW", x + w - bw - 4, y + (h - bh) / 2 + 3.5,
           { width: bw, align: "center" }, "Helvetica-Bold", F.micro, C.white);

  doc.y = y + h + 6;   // ✅ explicit, predictable
}

function priorityBadge(doc, x, y, prio) {
  const { label, color } = prio;
  const stars = label === "HIGH" ? "!!!" : label === "MED" ? "!!" : "!";
  const txt   = `${stars} ${label}`;
  const tw    = doc.widthOfString(txt, { fontSize: F.tiny });
  const bw    = tw + 18, bh = 16;
  rRect(doc, x + 1, y + 1, bw, bh, 9, color + "44");
  rRect(doc, x, y, bw, bh, 9, color);
  safeText(doc, txt, x + 9, y + 4, { width: tw + 2 }, "Helvetica-Bold", F.tiny, C.white);
  return bw;
}

function bullet(doc, text, color = C.primary, indent = 0, showTint = false) {
  const x   = PG.margin + 18 + indent;
  const y   = doc.y;
  const tw  = PG.cw - 32 - indent;
  // ✅ pre-calculate height BEFORE rendering
  const txH = doc.heightOfString(text, { width: tw, fontSize: F.body, lineGap: 2 });
  const rowH = txH + 7;

  if (showTint) rRect(doc, PG.margin, y - 1, PG.cw, rowH, 3, C.borderLight);

  doc.save().circle(x - 7, y + 5.5, 4).fillColor(color).fillOpacity(0.15).fill().restore();
  doc.save().circle(x - 7, y + 5.5, 2.2).fillColor(color).fillOpacity(1).fill().restore();

  // ✅ use safeText — no doc.y corruption
  safeText(doc, text, x, y, { width: tw, lineGap: 2 });

  doc.y = y + txH + 5;   // ✅ always correct, based on pre-calc
}

function qCard(doc, num, text, color) {
  const x  = PG.margin, y = doc.y;
  const tw = PG.cw - 52;
  // ✅ pre-calculate
  const th = doc.heightOfString(text, { width: tw, fontSize: F.body, lineGap: 2 });
  const ch = Math.max(th + 16, 32);

  rRect(doc, x + 1, y + 1, PG.cw, ch, 7, C.cardShadow);
  rRect(doc, x, y, PG.cw, ch, 7, C.white, C.border, 0.6);
  sRect(doc, x, y + 3, 3, ch - 6, color);

  const bx = x + 12, by = y + ch / 2 - 9;
  rRect(doc, bx, by, 18, 18, 9, color);
  safeText(doc, `${num}`, bx, by + 4, { width: 18, align: "center" },
           "Helvetica-Bold", F.small, C.white);

  safeText(doc, text, x + 36, y + 8, { width: tw, lineGap: 2 });

  doc.y = y + ch + 5;   // ✅ explicit
}

function subLabel(doc, text, bg, color) {
  const y = doc.y, w = PG.cw;
  rRect(doc, PG.margin, y, w, 22, 5, bg, color + "55", 0.5);
  doc.save().circle(PG.margin + 11, y + 11, 4).fillColor(color).fill().restore();
  doc.save().circle(PG.margin + 11, y + 11, 2).fillColor(C.white).fill().restore();
  safeText(doc, text, PG.margin + 22, y + 6, { width: w - 34 },
           "Helvetica-Bold", F.small, color);
  doc.y = y + 26;   // ✅ explicit
}

function infoCard(doc, label, value, borderColor) {
  const x = PG.margin, y = doc.y;
  const vh = doc.heightOfString(value, { width: PG.cw - 28, fontSize: F.h3 });
  const ch = Math.max(vh + 22, 38);

  rRect(doc, x + 1, y + 1, PG.cw, ch, 7, C.cardShadow);
  rRect(doc, x, y, PG.cw, ch, 7, C.white, C.border, 0.6);
  rRect(doc, x, y, 5, ch, 3, borderColor);

  safeText(doc, label.toUpperCase(), x + 13, y + 6,
           { width: PG.cw - 22, characterSpacing: 1 }, "Helvetica-Bold", F.micro, borderColor);
  safeText(doc, value, x + 13, y + 17,
           { width: PG.cw - 22 }, "Helvetica-Bold", F.h3, C.dark);

  doc.y = y + ch + 7;
}

function statBox(doc, x, y, w, h, num, label, color) {
  rRect(doc, x - 1, y - 1, w + 2, h + 2, 10, color + "18");
  rRect(doc, x, y, w, h, 9, C.white, C.border, 0.7);
  rRect(doc, x, y, w, 3, 2, color);
  safeText(doc, `${num}`, x, y + 10, { width: w, align: "center" },
           "Helvetica-Bold", 22, color);
  doc.save()
     .moveTo(x + w * 0.25, y + 42).lineTo(x + w * 0.75, y + 42)
     .strokeColor(C.border).lineWidth(0.5).stroke().restore();
  safeText(doc, label.toUpperCase(), x, y + 47,
           { width: w, align: "center", characterSpacing: 0.5 },
           "Helvetica-Bold", F.micro, C.subtext);
}

function footer(doc, pageIdx, total) {
  const fy = PG.footer;
  gradRect(doc, PG.margin, fy, PG.cw, 1.5, 0, C.primary, C.secondary, 28);
  const now = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
  safeText(doc, "SukuAI",    PG.margin, fy + 5, { width: 80 },
           "Helvetica-Bold", F.micro, C.primary);
  safeText(doc, now,         PG.margin, fy + 5, { width: PG.cw, align: "center" },
           "Helvetica",      F.micro, C.muted);
  safeText(doc, `${pageIdx} / ${total}`, PG.margin, fy + 5,
           { width: PG.cw, align: "right" }, "Helvetica-Bold", F.micro, C.subtext);
}

/* ============================================================
   🔑 KEY FIX: need() — ONLY page-break mechanism
   With margin:0 in PDFDocument, PDFKit's auto-break is at y=841.
   Our need() fires at y = contentBottom - pts → always first.
   ============================================================ */
function need(doc, pts = 50) {
  if (doc.y + pts > PG.contentBottom) {
    doc.addPage();
    doc.y = PG.margin;
  }
}

/* ============================================================
   🌟 COVER PAGE
   ============================================================ */
function buildCover(doc, result) {
  const BAND = 222;

  sRect(doc, 0, 0, PG.width, BAND, C.primaryDeep);
  gradRect(doc, 0, 0, PG.width, BAND, 0, C.primaryDark, C.secondary, 55);

  doc.save().circle(PG.width + 10, -10, 160).fillColor(C.white).fillOpacity(0.04).fill().restore();
  doc.save().circle(-20, BAND + 10, 100).fillColor(C.accent).fillOpacity(0.05).fill().restore();
  doc.save().circle(80, 30, 45).fillColor(C.white).fillOpacity(0.04).fill().restore();

  sRect(doc, 0, BAND - 4, PG.width, 4, C.accent);

  // Brand
  doc.save().circle(PG.margin + 18, 56, 18).fillColor(C.white).fillOpacity(0.12).fill().restore();
  doc.save().circle(PG.margin + 18, 56, 12).fillColor(C.white).fillOpacity(0.20).fill().restore();
  safeText(doc, "E", PG.margin + 13, 51, { width: 12, align: "center" },
           "Helvetica-Bold", 10, C.white);
  safeText(doc, "SukuAI", PG.margin + 38, 46, { characterSpacing: 2 },
           "Helvetica-Bold", F.h2, C.white);
  safeText(doc, "AI-Powered Smart Study Notes", PG.margin + 38, 66, { width: PG.cw - 38 },
           "Helvetica", F.small, C.primaryGlow);

  // Topic
  const topic = result.topic || result.subject || "Study Notes";
  safeText(doc, topic, PG.margin, 104, { width: PG.cw, align: "center", lineGap: 4 },
           "Helvetica-Bold", F.h1, C.white);

  // Importance pill
  if (result.importance) {
    const iL = result.importance.toLowerCase();
    const ic = iL.includes("high") ? C.danger : iL.includes("med") ? C.accent : C.success;
    const t  = result.importance.toUpperCase();
    const tw = doc.widthOfString(t, { fontSize: F.small });
    const iw = tw + 30, ix = PG.margin + (PG.cw - iw) / 2;
    rRect(doc, ix, 158, iw, 22, 11, ic + "22", ic, 1);
    safeText(doc, t, ix, 163.5, { width: iw, align: "center" },
             "Helvetica-Bold", F.small, C.white);
  }

  const dStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
  safeText(doc, `Generated  ${dStr}`, PG.margin, 190,
           { width: PG.cw, align: "center" }, "Helvetica", F.tiny, C.primaryGlow);

  // Stats
  const sTopics  = result.subTopics ? Object.values(result.subTopics).flat().length : 0;
  const sRev     = Array.isArray(result.revisionPoints) ? result.revisionPoints.length : 0;
  const sQ       = result.questions
    ? (result.questions.short?.length || 0) + (result.questions.long?.length || 0)
      + (Array.isArray(result.questions.diagram) ? result.questions.diagram.length
         : result.questions.diagram ? 1 : 0)
    : 0;

  const sbw = (PG.cw - 24) / 3, sby = BAND + 20;
  [
    { n: sTopics, lbl: "Sub Topics",  color: C.primary   },
    { n: sRev,    lbl: "Revision Pts", color: C.secondary },
    { n: sQ,      lbl: "Questions",   color: C.accent    },
  ].forEach((s, i) =>
    statBox(doc, PG.margin + i * (sbw + 12), sby, sbw, 66, s.n, s.lbl, s.color)
  );

  // About card
  const aY = sby + 66 + 16;
  rRect(doc, PG.margin, aY, PG.cw, 48, 8, C.primaryLight, C.primary + "33", 0.6);
  rRect(doc, PG.margin, aY, 4, 48, 2, C.primary);
  safeText(doc, "About This Document", PG.margin + 12, aY + 7, { width: PG.cw - 24 },
           "Helvetica-Bold", F.small, C.primaryDark);
  safeText(doc,
    "This document was auto-generated by Exam Notes AI using advanced AI. " +
    "It contains curated sub-topics, concise revision points, and exam-focused questions.",
    PG.margin + 12, aY + 21, { width: PG.cw - 24, lineGap: 1.5 },
    "Helvetica", F.tiny, C.subtext);

  // Bottom strip
  sRect(doc, 0, PG.height - 8, PG.width, 8, C.primaryDeep);
  gradRect(doc, 0, PG.height - 8, PG.width, 8, 0, C.primary, C.secondary, 28);
}

/* ============================================================
   📋 TABLE OF CONTENTS
   ============================================================ */
function buildTOC(doc, result) {
  secHeader(doc, "Table of Contents", C.primary);

  const toc = [
    result.importance               && "Importance Level",
    result.subTopics                && "Sub Topics",
    result.notes                    && "Notes",
    result.revisionPoints?.length   && "Revision Points",
    result.questions?.short?.length && "Short Answer Questions",
    result.questions?.long?.length  && "Long Answer Questions",
    result.questions?.diagram       && "Diagram / Practical Questions",
  ].filter(Boolean);

  toc.forEach((item, idx) => {
    need(doc, 18);
    const ty = doc.y;
    rRect(doc, PG.margin, ty - 1, PG.cw, 17, 3, idx % 2 === 0 ? C.bg : C.white);
    rRect(doc, PG.margin + 3, ty + 1.5, 13, 13, 6, C.primary);
    safeText(doc, `${idx + 1}`, PG.margin + 3, ty + 4.5,
             { width: 13, align: "center" }, "Helvetica-Bold", F.tiny, C.white);
    safeText(doc, item, PG.margin + 20, ty + 3.5, { width: PG.cw - 38 },
             "Helvetica", F.small, C.text);
    doc.y = ty + 17;
  });

  doc.y += 8;
}

/* ============================================================
   📝 NOTES SECTION
   ============================================================ */
function buildNotes(doc, result) {
  need(doc, 60);
  secHeader(doc, "Notes", C.info);

  const clean = result.notes.replace(/[#*_`]/g, "").trim();
  const paras = clean.split(/\n{2,}/);

  paras.forEach((para) => {
    para.split("\n").forEach((line) => {
      const t = line.trim();
      if (!t) { doc.y += 2; return; }
      need(doc, 24);

      const isH = (t === t.toUpperCase() && t.length > 3 && !/^\d/.test(t)) || t.endsWith(":");
      if (isH) {
        doc.y += 2;
        const y = doc.y;
        rRect(doc, PG.margin, y, PG.cw, 20, 4, C.primaryLight, C.primary + "44", 0.5);
        rRect(doc, PG.margin, y, 3, 20, 2, C.primary);
        safeText(doc, t, PG.margin + 9, y + 5, { width: PG.cw - 18 },
                 "Helvetica-Bold", F.h4, C.primaryDark);
        doc.y = y + 24;
      } else if (/^[-–•·]/.test(t)) {
        bullet(doc, t.replace(/^[-–•·]\s*/, ""), C.info);
      } else {
        const y  = doc.y;
        const h  = doc.heightOfString(t, { width: PG.cw, fontSize: F.body, lineGap: 2 });
        safeText(doc, t, PG.margin, y, { width: PG.cw, lineGap: 2 });
        doc.y = y + h + 4;
      }
    });
    doc.y += 2;
  });
}

/* ============================================================
   📄 MAIN EXPORT
   ============================================================ */
export const pdfDownload = (req, res) => {
  try {
    const { result } = req.body;
    if (!result || typeof result !== "object")
      return res.status(400).json({ error: "Invalid content" });

    /* ══════════════════════════════════════════════════════
       ✅ CRITICAL FIX: margin: 0
       PDFKit's auto page-break fires at y = 841.89 (page height).
       Our need() fires at y = 790 → always wins → no double breaks.
       ══════════════════════════════════════════════════════ */
    const doc = new PDFDocument({
      size:        "A4",
      margin:      0,          // ← THE FIX (was 44 → caused double page-breaks)
      bufferPages: true,
      info: {
        Title:   "Exam Notes AI",
        Author:  "SukuAI",
        Subject: result.topic || result.subject || "Study Notes",
        Creator: "SukuAI",
      },
    });

    doc.on("error", (e) => {
      console.error("PDF error:", e);
      if (!res.headersSent) res.status(500).json({ error: "PDF generation failed" });
    });

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="ExamNotesAI.pdf"');
    doc.pipe(res);

    /* ══ 1 — COVER ══ */
    buildCover(doc, result);

    /* ══ 2 — CONTENT PAGES ══ */
    doc.addPage();
    doc.y = PG.margin;

    /* TOC */
    buildTOC(doc, result);
    hr(doc);
    doc.y += 8;

    /* IMPORTANCE */
    if (result.importance) {
      need(doc, 60);
      secHeader(doc, "Importance Level", C.accent);
      const ic = result.importance.toLowerCase().includes("high") ? C.danger
               : result.importance.toLowerCase().includes("med")  ? C.accent : C.success;
      infoCard(doc, "Priority", result.importance, ic);
    }

    /* SUB TOPICS */
    if (result.subTopics && typeof result.subTopics === "object") {
      need(doc, 70);
      secHeader(doc, "Sub Topics", C.primary);

      Object.entries(result.subTopics).forEach(([key, topics]) => {
        if (!Array.isArray(topics) || !topics.length) return;
        need(doc, 44);

        const prio = parsePriority(key);
        const y    = doc.y;

        rRect(doc, PG.margin, y, PG.cw, 24, 5, prio.bg, prio.glow, 0.6);
        rRect(doc, PG.margin, y, 4, 24, 2, prio.color);

        const bw = priorityBadge(doc, PG.margin + 8, y + 4, prio);

        const groupLabel = prio.label === "HIGH" ? "High Priority Topics"
                         : prio.label === "MED"  ? "Medium Priority Topics"
                         : "Low Priority Topics";

        safeText(doc, groupLabel, PG.margin + 12 + bw, y + 7, { width: PG.cw - 20 - bw },
                 "Helvetica-Bold", F.small, prio.color);

        const cntTxt = `${topics.length} topics`;
        const cntW   = doc.widthOfString(cntTxt, { fontSize: F.micro }) + 10;
        rRect(doc, PG.margin + PG.cw - cntW - 3, y + 5, cntW, 13, 6, prio.color + "22");
        safeText(doc, cntTxt, PG.margin + PG.cw - cntW - 3, y + 8.5,
                 { width: cntW, align: "center" }, "Helvetica", F.micro, prio.color);

        doc.y = y + 28;

        topics.forEach((t, ti) => {
          need(doc, 20);
          bullet(doc, t, prio.color, 8, ti % 2 === 0);
        });
        doc.y += 4;
      });
    }

    /* NOTES */
    if (result.notes) {
      buildNotes(doc, result);
      doc.y += 3;
    }

    /* REVISION POINTS */
    if (Array.isArray(result.revisionPoints) && result.revisionPoints.length) {
      need(doc, 70);
      secHeader(doc, "Revision Points", C.success);
      result.revisionPoints.forEach((pt, i) => {
        need(doc, 20);
        bullet(doc, pt, C.success, 0, i % 2 === 0);
      });
      doc.y += 4;
    }

    /* QUESTIONS */
    if (result.questions && typeof result.questions === "object") {
      need(doc, 70);
      secHeader(doc, "Important Questions", C.accent);

      if (Array.isArray(result.questions.short) && result.questions.short.length) {
        need(doc, 44);
        subLabel(doc, `Short Answer Questions  (${result.questions.short.length})`, C.accentLight, C.accent);
        result.questions.short.forEach((q, i) => { need(doc, 36); qCard(doc, i + 1, q, C.accent); });
        doc.y += 4;
      }

      if (Array.isArray(result.questions.long) && result.questions.long.length) {
        need(doc, 44);
        subLabel(doc, `Long Answer Questions  (${result.questions.long.length})`, C.primaryLight, C.primary);
        result.questions.long.forEach((q, i) => { need(doc, 36); qCard(doc, i + 1, q, C.primary); });
        doc.y += 4;
      }

      const diag = result.questions.diagram;
      if (diag) {
        need(doc, 44);
        subLabel(doc, "Diagram / Practical Questions", C.successLight, C.success);
        const lines = Array.isArray(diag)
          ? diag
          : String(diag).split("\n").map(l => l.trim()).filter(Boolean);
        lines.forEach((l, i) => { need(doc, 36); qCard(doc, i + 1, l, C.success); });
        doc.y += 4;
      }
    }

    /* ══ 3 — MOTIVATIONAL CLOSER ══ */
    need(doc, 72);
    doc.y += 8;
    const fcy = doc.y, fch = 58;

    rRect(doc, PG.margin + 2, fcy + 2, PG.cw, fch, 10, C.primaryDeep + "55");
    gradRect(doc, PG.margin, fcy, PG.cw, fch, 10, C.primaryDark, C.secondary, 38);
    doc.save().circle(PG.margin + PG.cw - 15, fcy + 12, 50)
       .fillColor(C.white).fillOpacity(0.04).fill().restore();
    rRect(doc, PG.margin, fcy, PG.cw, 3, 2, C.accent);

    safeText(doc, "All the best for your exams!",
             PG.margin, fcy + 12, { width: PG.cw, align: "center" },
             "Helvetica-Bold", F.h3, C.white);
    safeText(doc, "Keep revising. Stay confident. You've got this.  —  SukuAI",
             PG.margin, fcy + 32, { width: PG.cw, align: "center" },
             "Helvetica", F.small, C.primaryGlow);

    /* ══ 4 — FOOTER PASS ══ */
    const total = doc.bufferedPageRange().count;
    for (let i = 0; i < total; i++) {
      doc.switchToPage(i);
      if (i === 0) continue;
      footer(doc, i + 1, total);
    }

    doc.flushPages();
    doc.end();

  } catch (err) {
    console.error("PDF Error:", err);
    if (!res.headersSent)
      res.status(500).json({ error: "Failed to generate PDF" });
  }
};
