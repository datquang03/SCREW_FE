import React from "react";
import { motion } from "framer-motion";
import { Card } from "antd";

const AnimatedCard = ({
  children,
  className = "",
  delay = 0,
  index = 0,
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
          ? {
              scale: 1.05,
              rotateY: 5,
              z: 50,
              transition: { duration: 0.3 },
            }
          : {}
      }
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      <Card className={`rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`} {...props}>
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;

