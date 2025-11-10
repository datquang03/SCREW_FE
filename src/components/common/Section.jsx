import React, { forwardRef } from "react";
import { motion, useInView } from "framer-motion";

const Section = forwardRef(({
  children,
  className = "",
  title,
  subtitle,
  badge,
  containerClass = "container mx-auto",
  ...props
}, ref) => {
  const sectionRef = ref || React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className={`relative isolate ${className}`} {...props}>
      <div className={`${containerClass} relative z-10`}>
        {(title || subtitle || badge) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            {badge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-600 rounded-full text-sm font-semibold mb-4"
              >
                {badge}
              </motion.span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg" style={{
                color: className.includes('bg-gray-900') || className.includes('from-gray-900') 
                  ? 'white' 
                  : '#111827',
                textShadow: className.includes('bg-gray-900') || className.includes('from-gray-900')
                  ? '0 4px 20px rgba(0,0,0,0.3)'
                  : '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl max-w-2xl mx-auto font-semibold" style={{
                color: className.includes('bg-gray-900') || className.includes('from-gray-900') 
                  ? '#f3f4f6' 
                  : '#374151',
                textShadow: className.includes('bg-gray-900') || className.includes('from-gray-900')
                  ? '0 2px 8px rgba(0,0,0,0.2)'
                  : '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
});

Section.displayName = 'Section';

export default Section;