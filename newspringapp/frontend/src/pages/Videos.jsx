// src/pages/Videos.jsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Home, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/unomstu1.jpg";

const BACKEND_URL = "http://localhost:8080";
const ITEMS_PER_PAGE = 8;

const Videos = () => {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/videos/all`);
      const sorted = res.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      setVideoList(sorted);
    } catch (err) {
      console.error("Failed to load videos", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return videoList.filter((video) => {
      const combined = `${video.title || ""} ${video.description || ""} ${video.category || ""}`.toLowerCase();
      return combined.includes(search);
    });
  }, [videoList, searchTerm]);

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
  const paginatedVideos = filteredVideos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
        title="Home"
        aria-label="Go to homepage"
      >
        <Home className="text-[#930911] w-6 h-6" />
      </Link>

      <div className="bg-white/10 backdrop-blur-md min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-8 max-w-7xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center text-[#930911] mb-8">Videos</h2>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, category, description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 border border-[#EEC8B9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
              <Search className="absolute right-3 top-2.5 text-[#930911]" size={18} />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <p className="text-center text-[#930911] animate-pulse">Loading videos...</p>
          ) : filteredVideos.length === 0 ? (
            <p className="text-center text-gray-600">No videos found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-xl bg-[#FFE9D4] border-[#EEC8B9] shadow hover:shadow-lg overflow-hidden flex flex-col"
                >
                  <video
                    src={video.fileUrl}
                    controls
                    className="w-full h-56 object-cover bg-black"
                  />
                  <div className="p-4 space-y-1 text-sm flex-grow">
                    <p className="text-center font-semibold text-[#930911] truncate">
                      {video.title || "Untitled"}
                    </p>
                    {video.description && (
                      <p className="text-xs text-black mt-1">
                        <span className="text-[#930911] font-semibold">Description:</span> {video.description}
                      </p>
                    )}
                    <div className="text-xs text-black mt-1 space-y-0.5">
                      {video.category && (
                        <div>
                          <span className="text-[#930911] font-semibold">Category:</span> #{video.category}
                        </div>
                      )}
                      {video.uploadedBy && (
                        <div>
                          <span className="text-[#930911] font-semibold">By:</span> {video.uploadedBy}
                        </div>
                      )}
                      {video.uploadDate && (
                        <div>
                          <span className="text-[#930911] font-semibold">Uploaded on:</span>{" "}
                          {new Date(video.uploadDate).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="bg-[#930911] hover:bg-[#BA3D47] text-white text-sm py-2 font-semibold transition"
                  >
                    <Eye className="inline mr-1" size={16} /> View
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#930911] text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-[#930911] font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[#930911] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* View Modal */}
          <AnimatePresence>
            {selectedVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                onClick={() => setSelectedVideo(null)}
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-8 bg-[#FFE9D4]/90 backdrop-blur-xl text-[#930911] text-xs text-center rounded-xl max-w-md w-full border border-[#EEC8B9] shadow-2xl space-y-3 relative"
                >
                  <button
                    className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"
                    onClick={() => setSelectedVideo(null)}
                  >
                    <X size={26} />
                  </button>

                  <video
                    src={selectedVideo.fileUrl}
                    controls
                    className="w-full max-h-[400px] bg-black rounded border-4 border-[#BA3D47] shadow-md mb-4"
                  />

                  <h3 className="text-lg font-bold mb-2">{selectedVideo.title || "Untitled"}</h3>

                  <div className="text-xs text-left text-black space-y-1">
                    {selectedVideo.description && (
                      <p>
                        <span className="text-[#930911] font-semibold">Description:</span> {selectedVideo.description}
                      </p>
                    )}
                    {selectedVideo.category && (
                      <p>
                        <span className="text-[#930911] font-semibold">Category:</span> #{selectedVideo.category}
                      </p>
                    )}
                    {selectedVideo.uploadedBy && (
                      <p>
                        <span className="text-[#930911] font-semibold">Uploaded by:</span> {selectedVideo.uploadedBy}
                      </p>
                    )}
                    {selectedVideo.uploadDate && (
                      <p>
                        <span className="text-[#930911] font-semibold">Uploaded on:</span>{" "}
                        {new Date(selectedVideo.uploadDate).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    )}
                    <p>
                      <span className="text-[#930911] font-semibold">Type:</span> {selectedVideo.contentType}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Videos;
