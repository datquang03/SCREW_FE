import React from "react";

// Very lightweight SVG line chart (no dependencies)
const MiniLineChart = ({ data = [], color = "#f59e0b", height = 140 }) => {
  const width = 320;
  const padding = 12;
  const maxY = Math.max(...data, 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);
  const points = data
    .map((y, i) => {
      const x = padding + i * stepX;
      const yPos = height - padding - (y / maxY) * (height - padding * 2);
      return `${x},${yPos}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polygon
        fill="url(#lineGrad)"
        points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`}
      />
    </svg>
  );
};

export default MiniLineChart;


