import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// 🎞️ Animation Variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

/**
 * Modal - Reusable Animated Modal Component
 *
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Function to close
 * @param {string} title - Modal title
 * @param {JSX.Element} children - Main content
 * @param {JSX.Element} footer - Optional footer
 * @param {string} width - Tailwind max-width class (e.g., max-w-xl)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  width = "max-w-xl",
}) => {
  // 🔐 ESC close support & scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-full ${width} bg-white/90 backdrop-blur-xl border border-[#930911]/20 shadow-2xl rounded-2xl px-6 py-7 sm:px-8 sm:py-8 relative`}
          >
            {/* ❌ Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-gray-500 hover:text-[#930911] transition"
            >
              <X size={20} />
            </button>

            {/* 🧾 Title */}
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-[#930911] mb-5 text-center"
              >
                {title}
              </h2>
            )}

            {/* 📦 Content */}
            <div
              id="modal-description"
              className="modal-content text-sm text-[#333] max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#CA5C62]/70 scrollbar-track-transparent"
            >
              {children}
            </div>

            {/* 🚦 Footer */}
            {footer && (
              <div className="mt-6 border-t pt-4 border-[#930911]/20">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
