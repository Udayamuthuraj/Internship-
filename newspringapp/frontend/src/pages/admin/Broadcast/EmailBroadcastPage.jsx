import React, { useEffect, useState } from "react";
import { Plus, Mail, X, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "../../../components/admin/common/SearchBar";
import Pagination from "../../../components/admin/common/Pagination";
import EmailBroadcastModal from "../../../components/admin/modals/EmailBroadcastModal";

const EmailBroadcastPage = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewEmail, setViewEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/admin/broadcast/all");
      if (!response.ok) throw new Error("Failed to fetch broadcasts");
      const data = await response.json();
      setBroadcasts(data);
      toast.success("✅ Broadcast emails loaded successfully");
    } catch (error) {
      console.error("Broadcast fetch error:", error.message);
      toast.error("❌ Failed to load broadcast emails");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "Alumni":
        return "bg-[#930911] text-white";
      case "Students":
        return "bg-[#CA5C62] text-white";
      case "All":
        return "bg-[#E4A39D] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Invalid date";
    }
  };

  const filtered = broadcasts.filter((email) => {
    const matchSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterType === "all" ? true : email.recipientType === filterType;
    return matchSearch && matchFilter;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <h2 className="text-2xl font-bold text-[#930911] flex items-center gap-2">
            <Mail size={20} /> Email Broadcast
          </h2>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-[#EEC8B9] bg-white/30 backdrop-blur-md px-3 py-2 rounded-md text-sm text-[#930911] focus:outline-none focus:ring-2 focus:ring-[#930911] shadow-inner"
          >
            <option value="all">All</option>
            <option value="Alumni">Alumni</option>
            <option value="Students">Students</option>
          </select>
        </div>

        <div className="flex gap-3 w-full md:w-auto items-center">
          <SearchBar
            placeholder="Search by subject..."
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#930911] hover:bg-[#BA3D47] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow"
            aria-label="Compose Email"
          >
            <Plus size={16} /> Compose
          </motion.button>
        </div>
      </div>

      {/* Email Cards */}
      {loading ? (
        <div className="text-center text-[#930911] py-10 animate-pulse text-base font-medium">
          📩 Loading emails...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          😕 No broadcast emails found.
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {paginated.map((email) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-5 rounded-2xl border border-[#EEC8B9] bg-[#FFE9D4] shadow-xl transition-all hover:shadow-2xl space-y-2 relative"
              >
                <p className="text-sm text-[#930911] font-semibold">
                  Subject:{" "}
                  <span className="text-black font-normal">{email.subject}</span>
                </p>
                <p className="text-sm text-[#930911] font-semibold">
                  Message:{" "}
                  <span className="text-black font-normal">{email.message}</span>
                </p>
                <p className="text-sm text-[#930911] font-semibold">
                  Send To:{" "}
                  <span
                    className={`inline-block font-medium px-2 py-1 rounded-full text-white ${getBadgeColor(
                      email.recipientType
                    )}`}
                  >
                    {email.recipientType}
                  </span>
                </p>

                <div className="flex justify-between items-center text-xs mt-1 text-gray-600">
                  <span>Sent on: {formatDate(email.timestamp)}</span>
                  <button
                    onClick={() => setViewEmail(email)}
                    className="text-sm text-[#930911] hover:underline flex items-center gap-1"
                    aria-label={`View email titled ${email.subject}`}
                  >
                    <Eye size={14} /> View
                  </button>
                </div>
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

      {/* Compose Modal */}
      <EmailBroadcastModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchBroadcasts(); // Refresh the list
        }}
      />

      {/* View Modal */}

{/* View Modal */}
<AnimatePresence>
  {viewEmail && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="px-6 py-8 bg-[#FFE9D4]/90 backdrop-blur-xl text-[#930911] rounded-xl max-w-md w-full border border-[#EEC8B9] shadow-2xl space-y-5 relative"
      >
        <button
          onClick={() => setViewEmail(null)}
          className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"
          aria-label="Close view email modal"
        >
          <X size={20} />
        </button>

        {/* Subject */}
        <div>
                          <p className="text-sm text-[#930911] font-semibold">
                  Subject:{" "}
                  <span className="text-black font-normal">{viewEmail.subject}</span>
                </p>
        </div>

        {/* Message */}
        <div>
          <p className="text-sm font-semibold text-[#930911] mb-1">Message:</p>
          <div className="border border-[#EEC8B9] bg-white/50 rounded px-4 py-3 text-sm text-black whitespace-pre-line font-normal">
            {viewEmail.message}
          </div>
        </div>

        {/* Send To */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#930911]">Send To:</p>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${getBadgeColor(
              viewEmail.recipientType
            )}`}
          >
            {viewEmail.recipientType}
          </span>
        </div>

        {/* Timestamp */}
        <p className="flex justify-between items-center text-xs mt-1 text-gray-600">
          Sent on: {formatDate(viewEmail.timestamp)}
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>



    </motion.div>
  );
};

export default EmailBroadcastPage;
