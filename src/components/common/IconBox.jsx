import React from "react";
import { motion } from "framer-motion";

const IconBox = ({
  Icon,
  color = "from-yellow-400 to-yellow-500",
  size = "w-16 h-16",
  iconSize = 32,
  className = "",
}) => {
  return (
    <motion.div
      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className={`${size} rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: "translateZ(20px)",
      }}
    >
      <Icon size={iconSize} className="text-white" />
    </motion.div>
  );
};

export default IconBox;

