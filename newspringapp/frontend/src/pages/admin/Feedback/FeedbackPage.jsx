// src/pages/admin/Feedback/FeedbackPage.jsx

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { MessageSquareText, Reply, X, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "../../../components/admin/common/SearchBar";
import Pagination from "../../../components/admin/common/Pagination";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewFeedback, setViewFeedback] = useState(null);

  const [replyData, setReplyData] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const itemsPerPage = 6;
  const searchInputRef = useRef();

  useEffect(() => {
    fetchFeedbacks();
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeReplyForm();
        setViewFeedback(null);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/feedback/all");
      if (!res.ok) throw new Error("Failed to load feedbacks");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      toast.error("❌ Failed to fetch feedbacks");
      console.error("Fetch feedbacks error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (feedback) => {
    setReplyData(feedback);
    setReplyMessage("");
  };

  const closeReplyForm = () => {
    setReplyData(null);
    setReplyMessage("");
    setSendingReply(false);
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      toast.warning("⚠️ Reply message cannot be empty");
      return;
    }

    setSendingReply(true);

    try {
      const replyBody = {
        feedbackId: replyData.id,
        email: replyData.email,
        subject: "Reply to your Feedback",
        message: replyMessage,
        originalFeedback: replyData.message,
      };

      const res = await fetch("http://localhost:8080/api/admin/email/reply-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(replyBody),
      });

      if (!res.ok) throw new Error("Failed to send reply email");

      await fetch(`http://localhost:8080/api/feedback/${replyData.id}/mark-replied`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminReply: replyMessage }),
      });

      toast.success("✅ Reply sent and marked as replied");
      closeReplyForm();
      fetchFeedbacks();
    } catch (error) {
      console.error("Reply error:", error.message);
      toast.error("❌ Failed to send reply");
      setSendingReply(false);
    }
  };

  const filtered = feedbacks.filter((item) => {
    const matchesSearch = `${item.name} ${item.email} ${item.message}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all"
      ? true
      : filterStatus === "replied"
      ? item.replied
      : !item.replied;
    return matchesSearch && matchesFilter;
  });

  const paginatedFeedbacks = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <h2 className="text-2xl font-bold text-[#930911] flex items-center gap-2">
            <MessageSquareText size={20} /> Feedback
          </h2>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-[#EEC8B9] bg-white/30 backdrop-blur-md px-3 py-2 rounded-md text-sm text-[#930911] focus:outline-none focus:ring-2 focus:ring-[#930911] shadow-inner"
          >
            <option value="all">All</option>
            <option value="unreplied">Unreplied</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <SearchBar
          ref={searchInputRef}
          placeholder="Search by name, email or message..."
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Feedback List */}
      {loading ? (
        <p className="text-center text-[#930911] py-10 animate-pulse">Loading feedback...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No feedback found.</p>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedFeedbacks.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFE9D4]/90 backdrop-blur-xl border border-[#EEC8B9] rounded-xl p-5 shadow-xl hover:shadow-2xl transition duration-300 relative"
              >
                <div className="text-base text-[#930911] font-semibold mb-1">
                  {item.name}{" "}
                  <span className="text-xs text-gray-500 font-normal">({item.email})</span>
                </div>

                <p className="text-sm text-gray-700 mt-2 line-clamp-5 whitespace-pre-line">
                  <strong className="text-[#930911]">Message: </strong>{item.message}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-500">
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "No timestamp"}
                  </p>

                  <button
                    onClick={() => setViewFeedback(item)}
                    className="text-xs text-[#930911] hover:underline flex items-center gap-1"
                  >
                    <Eye size={14} /> View
                  </button>
                </div>

                {item.adminReply && (
                  <div className="mt-3 p-3 bg-[#EEC8B9]/30 border-l-4 border-[#930911] rounded">
                    <p className="text-xs text-[#930911] font-semibold">Admin Reply:</p>
                    <p className="text-sm text-gray-800 whitespace-pre-line">{item.adminReply}</p>
                  </div>
                )}

                {item.replied ? (
                  <span className="absolute top-3 right-3 text-green-700 text-xs font-medium bg-green-100 px-2 py-0.5 rounded">
                    ✅ Replied
                  </span>
                ) : (
                  <button
                    onClick={() => handleReply(item)}
                    className="absolute top-3 right-3 text-xs   text-green-600 hover:underline flex items-center gap-1"
                    aria-label={`Reply to feedback from ${item.name}`}
                  >
                    <Reply size={14} /> Reply
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Reply Modal */}
      <AnimatePresence>
        {replyData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#FFE9D4]/90 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-[#EEC8B9] shadow-2xl relative"
            >
              <button
                className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"
                onClick={closeReplyForm}
                aria-label="Close reply form"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-semibold mb-4 text-[#930911]">Reply to {replyData.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {replyData.email}
              </p>
              <p className="text-sm text-gray-700 bg-white/40 p-3 rounded mb-3 whitespace-pre-line border border-[#EEC8B9]">
                <strong>Feedback:</strong> {replyData.message}
              </p>
              <textarea
                placeholder="Write your reply here..."
                className="w-full h-28 p-3 border border-[#EEC8B9] rounded text-sm focus:ring-2 focus:ring-[#930911] bg-white/60"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <button
                className={`mt-4 px-4 py-2 rounded transition text-white ${
                  sendingReply ? "bg-gray-500 cursor-not-allowed" : "bg-[#930911] hover:bg-[#BA3D47]"
                }`}
                onClick={sendReply}
                disabled={sendingReply}
              >
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FFE9D4]/90 backdrop-blur-xl rounded-xl p-6 w-full max-w-lg border border-[#EEC8B9] shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setViewFeedback(null)}
                className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"
                aria-label="Close view feedback modal"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold text-[#930911]">Feedback Details</h3>
              <p className="text-sm text-gray-800">
                <strong className="text-[#930911]">Name: </strong>{viewFeedback.name}
              </p>
              <p className="text-sm text-gray-800">
                <strong className="text-[#930911]">Email: </strong>{viewFeedback.email}
              </p>
              <div>
                <p className="text-sm font-semibold text-[#930911] mb-1">Message:</p>
                <p className="text-sm text-gray-800 whitespace-pre-line bg-white/50 border border-[#EEC8B9] rounded p-3">
                  {viewFeedback.message}
                </p>
              </div>
              {viewFeedback.adminReply && (
                <div>
                  <p className="text-sm font-semibold text-[#930911] mb-1">Admin Reply:</p>
                  <p className="text-sm text-gray-800 whitespace-pre-line bg-white/50 border border-[#EEC8B9] rounded p-3">
                    {viewFeedback.adminReply}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-600">
                Sent on: {new Date(viewFeedback.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeedbackPage;
