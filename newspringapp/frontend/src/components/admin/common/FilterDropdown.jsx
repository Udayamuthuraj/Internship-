import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

/**
 * 🔽 FilterDropdown - Reusable animated dropdown for filtering data.
 *
 * Props:
 * - label: string – Label for dropdown
 * - endpoint: string – Backend API to fetch options
 * - filterKey: string – Key in response to extract options from
 * - value: string – Current selected value
 * - onChange: function – Called when dropdown changes
 * - showDefaultOption: boolean – Show "-- Select --" by default
 * - placeholder: string – Custom placeholder text
 * - optionFormatter: function – Optional formatter (e.g., capitalize)
 */
const FilterDropdown = ({
  label = "Filter By",
  endpoint = "",
  filterKey = "",
  value = "",
  onChange = () => {},
  showDefaultOption = true,
  placeholder = "-- Select --",
  optionFormatter = (v) => v,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectId = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    const fetchOptions = async () => {
      if (!endpoint || !filterKey) {
        setOptions([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(endpoint);
        const rawData = res?.data;
        const values = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.[filterKey])
          ? rawData[filterKey]
          : [];

        // Remove duplicates, format, and sort alphabetically
        const seen = new Set();
        const mapped = values
          .map((item) => {
            const label =
              typeof item === "object"
                ? optionFormatter(item.name || item.label)
                : optionFormatter(item);
            const val =
              typeof item === "object" ? item.id || item.value : item;
            return { label, value: val };
          })
          .filter((item) => {
            const key = `${item.label}-${item.value}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .sort((a, b) => a.label.localeCompare(b.label));

        setOptions(mapped);
      } catch (err) {
        console.error("❌ Failed to load filter options:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint, filterKey, optionFormatter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative inline-block w-56"
    >
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-[#930911] mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full appearance-none rounded-lg bg-white/30 backdrop-blur-lg border border-white/50 text-sm text-[#930911] px-4 py-2 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-[#930911] transition-all"
        >
          {showDefaultOption && (
            <option disabled value="">
              {loading ? "Loading..." : placeholder}
            </option>
          )}

          {!loading && options.length > 0 ? (
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          ) : (
            !loading && (
              <option disabled value="">
                No options available
              </option>
            )
          )}
        </select>

        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#930911]/80 pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export default FilterDropdown;
