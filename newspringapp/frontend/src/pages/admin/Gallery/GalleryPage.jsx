// src/pages/admin/Gallery/GalleryPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ImagePlus, Trash2, Eye, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import UploadMediaModal from "../../../components/admin/modals/UploadMediaModal";
import Pagination from "../../../components/admin/common/Pagination";
import SearchBar from "../../../components/admin/common/SearchBar";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = "http://localhost:8080";

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

const GalleryPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMedia, setEditMedia] = useState(null);
  const [viewMedia, setViewMedia] = useState(null);
  const [deleteMedia, setDeleteMedia] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const itemsPerPage = 8;

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/admin/gallery/all`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
      );
      setMediaList(sorted);
    } catch {
      toast.error("❌ Failed to load gallery media.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchMedia();
    setShowModal(false);
    setEditMedia(null);
    setCurrentPage(1);
  };

  const confirmDelete = async () => {
    if (!deleteMedia) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/gallery/delete/${deleteMedia.id}`);
      toast.success("✅ Media deleted successfully!");
      setMediaList((prev) => prev.filter((item) => item.id !== deleteMedia.id));
      setDeleteMedia(null);
    } catch {
      toast.error("❌ Failed to delete media.");
    }
  };

  const formatFileUrl = (url) =>
    url?.startsWith("http") ? url : `${BACKEND_URL}${url}`;

  const isImage = (type = "") => type.startsWith("image/");

  const categoryOptions = useMemo(() => {
    const set = new Set(mediaList.map((m) => m.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [mediaList]);

  const filteredMedia = useMemo(() => {
    return mediaList.filter((media) => {
      const searchText = `${media.title || ""} ${media.filename || ""} ${media.category || ""} ${media.description || ""}`.toLowerCase();
      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || media.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, mediaList, categoryFilter]);

  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const paginatedMedia = filteredMedia.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#930911]">Gallery</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <SearchBar placeholder="Search by title, filename, category..." value={searchTerm} onChange={setSearchTerm} />
          <FilterDropdown value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} />
          <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} onClick={() => { setEditMedia(null); setShowModal(true); }} className="bg-[#930911] hover:bg-[#BA3D47] text-white px-4 py-2 rounded flex items-center gap-2 shadow-md">
            <ImagePlus size={18} /> Upload
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center text-[#930911] py-10 animate-pulse">Loading gallery...</p>
      ) : paginatedMedia.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No media found.</p>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
          {paginatedMedia.map((media) => (
            <motion.div key={media.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="relative rounded-xl overflow-hidden border border-[#EEC8B9] bg-[#FFE9D4] shadow-xl hover:shadow-2xl">
              {isImage(media.contentType) ? (
                <img src={formatFileUrl(media.fileUrl)} alt={media.description || "Media"} className="w-full h-48 object-cover cursor-zoom-in" onClick={() => setFullImage(formatFileUrl(media.fileUrl))} />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-700 text-sm">{media.contentType}</div>
              )}

  

              <div className="p-4 text-sm space-y-1">
                <p className="font-semibold text-[#930911] truncate text-center">{media.title || "Untitled"}</p>
                {media.description && <p><span className="text-[#930911] font-semibold">Description: </span><span className="text-black">{media.description}</span></p>}
                {media.category && <p><span className="text-[#930911] font-semibold">Category: </span><span className="text-black">#{media.category}</span></p>}
                {media.uploadedBy && <p><span className="text-[#930911] font-semibold">Uploaded by: </span><span className="text-black">{media.uploadedBy}</span></p>}
                {media.uploadDate && <p><span className="text-[#930911] font-semibold">Uploaded at: </span><span className="text-black">{new Date(media.uploadDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></p>}
              </div>
                <div className="flex justify-center gap-3 p-3 border-t border-[#EEC8B9]">
                <button onClick={() => setViewMedia(media)} className="text-[#930911] hover:underline text-sm flex items-center gap-1">
                  <Eye size={14} /> View
                </button>
                <button onClick={() => { setEditMedia(media); setShowModal(true); }} className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                  <Pencil size={14} /> Edit
                </button>
                <button  onClick={() => setDeleteMedia(media)} className="text-red-600 hover:underline text-sm flex items-center gap-1">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showStatus={true} />}

      {/* Upload/Edit Modal */}
      {showModal && <UploadMediaModal onClose={() => setShowModal(false)} onUploadSuccess={handleUploadSuccess} initialData={editMedia} />}

      {/* View Modal */}
      <AnimatePresence>
        {viewMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-[#FFE9D4]/90 backdrop-blur-xl border border-[#EEC8B9] p-6 max-w-md w-full rounded-xl relative space-y-3 text-[#930911] text-sm">
              <button onClick={() => setViewMedia(null)} className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"><X size={20} /></button>
              {viewMedia.fileUrl && <img src={formatFileUrl(viewMedia.fileUrl)} alt="Media" className="w-full max-h-64 object-cover rounded border-4 border-[#BA3D47]" />}
              <h3 className="text-lg font-semibold text-center">{viewMedia.title || "Untitled"}</h3>
              <p><span className="text-[#930911] font-semibold">Filename: </span><span className="text-black">{viewMedia.filename}</span></p>
              {viewMedia.description && <p><span className="text-[#930911] font-semibold">Description: </span><span className="text-black">{viewMedia.description}</span></p>}
              {viewMedia.category && <p><span className="text-[#930911] font-semibold">Category: </span><span className="text-black">#{viewMedia.category}</span></p>}
              {viewMedia.uploadedBy && <p><span className="text-[#930911] font-semibold">Uploaded by: </span><span className="text-black">{viewMedia.uploadedBy}</span></p>}
              {viewMedia.uploadDate && <p><span className="text-[#930911] font-semibold">Uploaded at: </span><span className="text-black">{new Date(viewMedia.uploadDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-[#FFE9D4]/90 backdrop-blur-xl border text-[#930911] border-[#EEC8B9] px-6 py-8 max-w-md w-full rounded-xl space-y-3 text-center relative">
              <button onClick={() => setDeleteMedia(null)} className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"><X size={20} /></button>
              <h3 className="text-xl font-semibold">Confirm Deletion</h3>
              <p className="text-black">Are you sure you want to delete <strong>{deleteMedia.title}</strong>?</p>
              <div className="flex justify-center gap-3 pt-4">
                <button onClick={confirmDelete} className="bg-[#930911] hover:bg-[#BA3D47] text-white px-4 py-2 rounded">Yes, Delete</button>
                <button onClick={() => setDeleteMedia(null)} className="bg-white/40 border border-[#EEC8B9] px-4 py-2 rounded">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" onClick={() => setFullImage(null)}>
            <motion.img 
            
            src={fullImage} alt="Full View" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} className="max-h-[90%] max-w-[90%] object-contain rounded-xl border-4 border-[#BA3D47] shadow-xl" />
            <button className="absolute top-6 right-6 text-white hover:text-red-300" onClick={() => setFullImage(null)}><X size={30} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryPage;
