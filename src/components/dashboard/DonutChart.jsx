import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";

const DonutChart = ({ value = 65, color = "#6366f1", size = 140, label = "Tỉ lệ" }) => {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 120, damping: 25 });

  const [dashOffset, setDashOffset] = useState(circumference);
  const [displayValue, setDisplayValue] = useState(0);

  // Animate progress whenever value thay đổi
  useEffect(() => {
    progress.set(0);
    progress.set(value);
  }, [value, progress]);

  useAnimationFrame(() => {
    const latest = spring.get();
    setDashOffset(circumference - (latest / 100) * circumference);
    setDisplayValue(Math.round(latest));
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-800 font-bold text-lg"
        >
          {displayValue}%
        </text>
      </svg>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">
          {displayValue === 100 ? "Hoàn thành" : "Đang tiến hành"}
        </p>
      </div>
    </div>
  );
};

export default DonutChart;
