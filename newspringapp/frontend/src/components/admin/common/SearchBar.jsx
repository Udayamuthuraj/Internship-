// src/components/admin/common/SearchBar.jsx

import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🔍 SearchBar - Accessible, animated search input with clear button
 *
 * Props:
 * - placeholder: string
 * - value: string
 * - onChange: function
 * - onClear: function (optional)
 * - onKeyDown: function (optional)
 * - autoFocus: boolean
 * - className: string (optional)
 */
const SearchBar = forwardRef(
  (
    {
      placeholder = "Search...",
      value,
      onChange,
      onClear,
      onKeyDown,
      autoFocus = false,
      className = "",
    },
    ref
  ) => {
    const handleClear = () => {
      onChange("");
      if (onClear) onClear();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative w-full max-w-sm ${className}`}
        role="search"
        aria-label="Search Input"
        aria-live="polite"
        aria-expanded={!!value}
      >
        {/* 🔍 Icon */}
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#930911] opacity-70 pointer-events-none"
          size={18}
          aria-hidden="true"
        />

        {/* Input Field */}
        <input
          type="search"
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          spellCheck={false}
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/30 backdrop-blur-md text-[#930911] placeholder:text-[#930911]/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#930911] text-sm transition-all duration-200 shadow-md [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none"
        />

        {/* ❌ Clear Button */}
        <AnimatePresence initial={false} mode="wait">
          {value && (
            <motion.button
              key="clear-search-button"
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleClear}
              className="absolute right-2 inset-y-0 my-auto p-1 rounded-full text-[#930911]/70 hover:text-[#930911] transition-colors duration-200"
              aria-label="Clear search input"
              title="Clear search"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default SearchBar;
