import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Pagination Component - Animated, accessible, and responsive
 *
 * Props:
 * - currentPage (number): Current active page
 * - totalPages (number): Total number of pages
 * - onPageChange (function): Callback when page changes
 * - showStatus (boolean): Show "Page X of Y"
 * - maxButtons (number): Max numbered buttons shown (default: 5)
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showStatus = false,
  maxButtons = 5,
}) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // Optional: Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && currentPage > 1) onPageChange(currentPage - 1);
      if (e.key === "ArrowRight" && currentPage < totalPages) onPageChange(currentPage + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, onPageChange]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex items-center justify-center mt-6 gap-2 flex-wrap"
    >
      {/* ⬅ Prev */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
        aria-label="Previous Page"
        title="Previous Page"
        className="p-2 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md text-[#930911] hover:bg-[#930911] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={18} />
      </motion.button>

      {/* 🔢 Page Buttons */}
      <AnimatePresence mode="wait">
        {generatePageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-[#930911] opacity-70 text-sm select-none"
              aria-hidden="true"
              title="More pages"
            >
              ...
            </span>
          ) : (
            <motion.button
              key={`page-${page}-${index}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
              title={`Go to page ${page}`}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm backdrop-blur-md ${
                page === currentPage
                  ? "bg-[#930911] text-white"
                  : "bg-white/30 text-[#930911] border border-white/50 hover:bg-[#930911] hover:text-white"
              }`}
            >
              {page}
            </motion.button>
          )
        )}
      </AnimatePresence>

      {/* ➡ Next */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
        aria-label="Next Page"
        title="Next Page"
        className="p-2 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md text-[#930911] hover:bg-[#930911] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRight size={18} />
      </motion.button>

      {/* Page X of Y */}
      {showStatus && (
        <div className="ml-4 text-sm text-[#930911] font-medium opacity-80">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </motion.nav>
  );
};

export default Pagination;
