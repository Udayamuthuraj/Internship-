import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const initialFormData = {
  subject: "",
  message: "",
  recipientType: "All",
};

const recipientColors = {
  All: "bg-[#930911]/90 text-white",
  Students: "bg-[#EEC8B9] text-[#930911]",
  Alumni: "bg-[#BA3D47]/90 text-white",
};

const EmailBroadcastModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => setFormData(initialFormData), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!subject || !message) {
      toast.warning("⚠️ Subject and message cannot be empty.");
      return;
    }

    if (message.length > 1800) {
      toast.info("📝 Your message is quite long. Consider shortening it.");
    }

    setIsSending(true);
    try {
      const response = await fetch("http://localhost:8080/api/admin/broadcast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, subject, message }),
      });

      const result = await response.text();

      if (response.ok) {
        toast.success("✅ Broadcast email sent successfully!");
        onClose();
      } else {
        toast.error(`❌ Failed: ${result || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("❌ Broadcast error:", err);
      toast.error("🚫 Network or server error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="broadcast-title"
            aria-describedby="broadcast-description"
            className="relative w-full max-w-xl p-6 rounded-2xl bg-[#FFE9D4]/90 backdrop-blur-xl border border-[#EEC8B9] shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-[#930911]/70 hover:text-[#930911]"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2
              id="broadcast-title"
              className="text-xl font-bold text-[#930911] mb-2 flex items-center gap-2"
            >
              <Send size={20} /> Broadcast Email
            </h2>

            {/* Recipient Type */}
            <span
              className={`inline-block mb-4 px-3 py-1 text-xs font-medium rounded-full ${recipientColors[formData.recipientType]}`}
            >
              Sending to: {formData.recipientType}
            </span>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" id="broadcast-description">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-[#930911]">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Announcement: Alumni Meet 2025"
                  className="w-full mt-1 px-4 py-2 text-sm rounded-lg border border-[#EEC8B9] bg-white/60 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#930911]">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  placeholder="Dear Alumni, we are excited to invite you to..."
                  className="w-full mt-1 px-4 py-3 text-sm rounded-lg border border-[#EEC8B9] bg-white/60 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
                />
              </div>

              {/* Recipient Dropdown */}
              <div>
                <label className="block text-sm font-medium text-[#930911]">Send To</label>
                <select
                  name="recipientType"
                  value={formData.recipientType}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 text-sm rounded-lg border border-[#EEC8B9] bg-white/60 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
                >
                  <option value="All">All</option>
                  <option value="Students">Students</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              {/* Submit */}
              <div className="text-right pt-2">
                <motion.button
                  type="submit"
                  disabled={isSending}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[#930911] to-[#BA3D47] shadow-md hover:brightness-110 disabled:opacity-60"
                >
                  {isSending ? "Sending..." : "Send Broadcast"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailBroadcastModal;
