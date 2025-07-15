// src/pages/admin/Gallery/VideoPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Video, Trash2, Pencil, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import UploadVideoModal from "../../../components/admin/modals/UploadVideoModal";
import Pagination from "../../../components/admin/common/Pagination";
import SearchBar from "../../../components/admin/common/SearchBar";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const FilterDropdown = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-white/30 bg-white/20 backdrop-blur-md px-3 py-2 rounded-md text-sm text-[#930911] focus:outline-none focus:ring-2 focus:ring-[#930911] shadow-inner"
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

const VideoPage = () => {
  const [videoList, setVideoList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewVideo, setViewVideo] = useState(null);
  const [deleteVideo, setDeleteVideo] = useState(null);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/admin/videos/all`);
      setVideoList(res.data || []);
    } catch (err) {
      toast.error("❌ Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchVideos();
    setShowModal(false);
    setSelectedVideo(null);
  };

  const confirmDelete = async () => {
    if (!deleteVideo) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/videos/delete/${deleteVideo.id}`);
      toast.success("✅ Video deleted successfully!");
      fetchVideos();
      setDeleteVideo(null);
    } catch (err) {
      toast.error("❌ Failed to delete video.");
    }
  };

  const categoryOptions = useMemo(() => {
    const set = new Set(videoList.map((v) => v.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [videoList]);

  const filteredVideos = useMemo(() => {
    return videoList.filter((video) => {
      const matchesSearch = `${video.title} ${video.description} ${video.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || video.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [videoList, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#930911]">Videos</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <SearchBar
            placeholder="Search by title, category, description..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <FilterDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              setSelectedVideo(null);
              setShowModal(true);
            }}
            className="bg-[#930911] hover:bg-[#BA3D47] text-white px-4 py-2 rounded flex items-center gap-2 shadow-md"
          >
            <Video size={18} />
            Upload
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center text-[#930911] py-10 animate-pulse">Loading videos...</p>
      ) : paginatedVideos.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No videos found.</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {paginatedVideos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-xl overflow-hidden border border-[#EEC8B9] bg-[#FFE9D4] shadow-xl hover:shadow-2xl"
            >
              <video
                src={video.fileUrl}
                controls
                className="w-full h-48 object-cover bg-black"
              />

              <div className="p-4 text-sm space-y-1">
                <p className="font-semibold text-[#930911] truncate text-center">{video.title || "Untitled"}</p>
                {video.description && (
                  <p>
                    <span className="text-[#930911] font-semibold">Description: </span>
                    <span className="text-black">{video.description}</span>
                  </p>
                )}
                {video.category && (
                  <p>
                    <span className="text-[#930911] font-semibold">Category: </span>
                    <span className="text-black">#{video.category}</span>
                  </p>
                )}
                {video.uploadedBy && (
                  <p>
                    <span className="text-[#930911] font-semibold">Uploaded by: </span>
                    <span className="text-black">{video.uploadedBy}</span>
                  </p>
                )}
                {video.uploadDate && (
                  <p>
                    <span className="text-[#930911] font-semibold">Uploaded at: </span>
                    <span className="text-black">
                      {new Date(video.uploadDate).toLocaleString("en-IN", {
                        dateStyle: "medium", timeStyle: "short"
                      })}
                    </span>
                  </p>
                )}
                <p>
                  <span className="text-[#930911] font-semibold">Type: </span>
                  <span className="text-black">{video.contentType}</span>
                </p>
              </div>

              <div className="flex justify-center gap-3 p-3 border-t border-[#EEC8B9]">
                <button
                  onClick={() => setViewVideo(video)}
                  className="text-[#930911] hover:underline text-sm flex items-center gap-1 "
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => {
                    setSelectedVideo(video);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                 
                  onClick={() => setDeleteVideo(video)}
                  className="text-red-600 hover:underline text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showStatus={true}
        />
      )}

      {/* Upload/Edit Modal */}
      {showModal && (
        <UploadVideoModal
          onClose={() => {
            toast.info("🛑 Upload cancelled.");
            setShowModal(false);
            setSelectedVideo(null);
          }}
          onUploadSuccess={handleUploadSuccess}
          initialData={selectedVideo}
        />
      )}

      {/* View Modal */}
      <AnimatePresence>
        {viewVideo && (
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
              className="bg-[#FFE9D4]/90 backdrop-blur-xl border border-[#EEC8B9] p-6 max-w-xl w-full rounded-xl relative space-y-3 text-[#930911] text-sm"
            >
              <button
                onClick={() => setViewVideo(null)}
                className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-semibold text-center">{viewVideo.title}</h3>
              <video
                src={viewVideo.fileUrl}
                controls
                className="w-full rounded-lg border border-[#BA3D47] bg-black"
              />
              {viewVideo.description && (
                <p>
                  <span className="text-[#930911] font-semibold">Description: </span>
                  <span className="text-black">{viewVideo.description}</span>
                </p>
              )}
              {viewVideo.category && (
                <p>
                  <span className="text-[#930911] font-semibold">Category: </span>
                  <span className="text-black">#{viewVideo.category}</span>
                </p>
              )}
              {viewVideo.uploadedBy && (
                <p>
                  <span className="text-[#930911] font-semibold">Uploaded by: </span>
                  <span className="text-black">{viewVideo.uploadedBy}</span>
                </p>
              )}
              {viewVideo.uploadDate && (
                <p>
                  <span className="text-[#930911] font-semibold">Uploaded at: </span>
                  <span className="text-black">
                    {new Date(viewVideo.uploadDate).toLocaleString("en-IN", {
                      dateStyle: "medium", timeStyle: "short"
                    })}
                  </span>
                </p>
              )}
              <p>
                <span className="text-[#930911] font-semibold">Type: </span>
                <span className="text-black">{viewVideo.contentType}</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteVideo && (
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
              className="px-6 py-8 bg-[#FFE9D4]/90 backdrop-blur-xl border text-[#930911] text-sm text-center rounded-xl max-w-md w-full border border-[#EEC8B9] shadow-2xl space-y-3 relative"
            >
              <button
                onClick={() => setDeleteVideo(null)}
                className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-black">
                Are you sure you want to delete <strong>{deleteVideo.title}</strong>?
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={confirmDelete}
                  className="bg-[#930911] hover:bg-[#BA3D47] text-white px-4 py-2 rounded"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteVideo(null)}
                  className="bg-white/40 border border-[#EEC8B9] px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPage;
