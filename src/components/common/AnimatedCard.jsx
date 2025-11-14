// src/components/common/AnimatedCard.jsx
import React from "react";
import { Card } from "antd";
import { motion } from "framer-motion";

const AnimatedCard = ({
  children,
  className = "",
  index = 0,
  delay = 0,
  isInView = true,
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: delay + index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={
        hoverEffect
          ? { scale: 1.05, rotateY: 5, transition: { duration: 0.3 } }
          : {}
      }
      style={{ perspective: 1000, transformStyle: "preserve-3d", width: "100%" }}
    >
      <Card
        {...props}
        styles={{ body: { padding: "1rem" } }}
        className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
