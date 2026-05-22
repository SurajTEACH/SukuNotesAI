// client/src/components/RechartSetUp.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";

function RechartSetUp({ charts }) {
  if (!charts || charts.length === 0) return null;

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

  return (
    <div className="space-y-5">
      {charts.map((chart, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h4 className="font-extrabold text-gray-900">
              📊 {chart.title || `Chart ${index + 1}`}
            </h4>
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {chart.type}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <>
                {chart.type === "bar" && (
                  <BarChart data={chart.data}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {chart.data?.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                )}

                {chart.type === "line" && (
                  <LineChart data={chart.data}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                )}

                {chart.type === "pie" && (
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={chart.data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      {chart.data?.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                )}

                {!["bar", "line", "pie"].includes(chart.type) && (
                  <BarChart data={chart.data}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
                  </BarChart>
                )}
              </>
            </ResponsiveContainer>
          </div>

        </div>
      ))}
    </div>
  );
}

export default RechartSetUp;
