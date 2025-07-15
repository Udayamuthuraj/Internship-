import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * StatCard - Animated dashboard metric card
 *
 * @param {string} title - Main label (e.g., "Alumni")
 * @param {number} count - Numeric value to animate to
 * @param {React.ElementType} icon - Lucide-react icon component
 * @param {string} hint - Optional sublabel or tooltip
 */
const StatCard = ({ title, count = 0, icon: Icon, hint }) => {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    let frameId;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * count);
      setAnimatedCount(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
      className="w-full p-5 rounded-2xl shadow-xl bg-[#FFE9D4] border border-[#EEC8B9] transition-all"
      role="region"
      aria-labelledby={`${title}-label`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Text Content */}
        <div className="flex-1">
          <p
            id={`${title}-label`}
            className="text-sm font-semibold text-[#930911] mb-1 tracking-wide"
          >
            {title}
          </p>
          <h2 className="text-3xl font-bold text-[#930911] tracking-tight">
            {animatedCount.toLocaleString()}
          </h2>
          {hint && (
            <p className="text-xs text-[#BA3D47] mt-1">{hint}</p>
          )}
        </div>

        {/* Icon Bubble */}
        {Icon && (
          <motion.div
            whileHover={{ rotate: 5, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="w-12 h-12 min-w-[48px] rounded-full bg-[#930911] flex items-center justify-center shadow-inner"
            aria-hidden="true"
          >
            <Icon size={26} className="text-[#EEC8B9]" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
