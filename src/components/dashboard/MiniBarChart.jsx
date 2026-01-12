import React from "react";

const MiniBarChart = ({ data = [], color = "#10b981", height = 140 }) => {
  const width = 320;
  const padding = 12;
  const maxY = Math.max(...data, 1);
  const barWidth = (width - padding * 2) / data.length - 6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
      {data.map((v, i) => {
        const x = padding + i * (barWidth + 6);
        const barHeight = (v / maxY) * (height - padding * 2);
        const y = height - padding - barHeight;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx="6"
            fill={color}
            opacity={0.9 - i * 0.02}
          />
        );
      })}
    </svg>
  );
};

export default MiniBarChart;
