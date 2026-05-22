// client/src/components/MermaidSetup.jsx

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

const normalizeMermaid = (diagram) => {
  if (!diagram) return "";
  let clean = String(diagram).replace(/\r\n/g, "\n").trim();

  // If it already starts with graph/flowchart, keep as-is
  // Otherwise, default to graph TD
  const startsLikeMermaid =
    clean.startsWith("graph ") ||
    clean.startsWith("graph\n") ||
    clean.startsWith("flowchart ") ||
    clean.startsWith("flowchart\n");

  if (!startsLikeMermaid) clean = `graph TD\n${clean}`;
  return clean;
};

// Optional: auto-fix bracket nodes to avoid duplicates causing Mermaid issues
const autoFixNodes = (diagram) => {
  let index = 0;
  
  const  used = new Map();

  return  diagram.replace(/\[(.*?)\]/g, (match, label) => {
      const  key = label.trim();

      // reuse same node if label already seen
      if(used.has(key)){
         return used.get(key);
      }

      index++;
      const id = `N${index}`;
      const node = `${id}["${key}"]`;

      used.set(key, node);
      return node;
  });
  
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        containerRef.current.innerHTML = "";

        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

        const safeChart = autoFixNodes(normalizeMermaid(diagram));
        const { svg } = await mermaid.render(uniqueId, safeChart);

        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error("Mermaid Rendering Error:", error);
        containerRef.current.innerHTML = `
          <div style="padding:12px;border:1px solid #fecaca;background:#fef2f2;border-radius:12px;color:#991b1b">
            Mermaid diagram failed to render. Please regenerate or simplify the diagram.
          </div>
        `;
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white p-4">
      <div ref={containerRef} />
    </div>
  );
}

export default MermaidSetup;
