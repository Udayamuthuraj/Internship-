import React, { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:8080/api";

const UploadMediaModal = ({ onClose, onUploadSuccess, initialData = null }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "");

      if (initialData.fileUrl) {
        const absoluteUrl = initialData.fileUrl.startsWith("http")
          ? initialData.fileUrl
          : `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"}${initialData.fileUrl}`;
        setPreviewUrl(absoluteUrl);
      }
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPreviewUrl(null);
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setFile(selected);

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    if (selected) {
      const objectUrl = URL.createObjectURL(selected);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.warning("⚠️ Title is required.");
    if (!description.trim()) return toast.warning("⚠️ Description is required.");
    if (!category.trim()) return toast.warning("⚠️ Category is required.");

    try {
      setLoading(true);

      if (initialData && !file) {
        await axios.put(
          `${BASE_URL}/admin/gallery/update/${initialData.id}`,
          new URLSearchParams({ title, description, category }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        toast.success("📝 Media metadata updated successfully!");
      } else {
        const formData = new FormData();
        if (file) formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("uploadedBy", "Admin");

        await axios.post(`${BASE_URL}/admin/gallery/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("📷 Media uploaded successfully!");
      }

      onUploadSuccess?.();
      onClose();
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error("🚫 Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md p-6 rounded-2xl bg-[#FFE9D4]/90 backdrop-blur-xl border border-[#EEC8B9] shadow-2xl"
        >
          <button
            onClick={() => {
              resetForm();
              onClose();
              toast.info("❌ Upload cancelled.");
            }}
            className="absolute top-3 right-3 text-[#930911]/70 hover:text-[#930911]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-[#930911] mb-4 flex items-center gap-2">
            <UploadCloud size={22} />
            {initialData ? "Edit Media" : "Upload Media"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-[#930911]">
                {initialData ? "Replace Image (optional)" : "Select Image"}{" "}
                {!initialData && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!initialData}
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
              {file && <p className="text-xs mt-1 text-gray-500 truncate">Selected: {file.name}</p>}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-3 w-28 h-28 object-cover rounded-lg border-2 border-[#BA3D47] cursor-zoom-in"
                  onClick={() => setFullImage(previewUrl)}
                />
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#930911]">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., College Fest Banner"
                required
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#930911]">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Event, Banner, Celebration"
                required
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#930911]">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description..."
                required
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 text-right">
              <motion.button
                type="submit"
                disabled={loading || (!file && !initialData)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[#930911] to-[#BA3D47] shadow-md hover:brightness-110 disabled:opacity-60"
              >
                {loading
                  ? initialData
                    ? "Updating..."
                    : "Uploading..."
                  : initialData
                  ? "Update Media"
                  : "Upload Media"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Fullscreen Image Viewer */}
        {fullImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullImage(null)}
          >
            <motion.img
              src={fullImage}
              alt="Full Preview"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[90%] max-w-[90%] object-contain rounded-xl border-4 border-[#BA3D47] shadow-xl"
            />
            <button
              className="absolute top-6 right-6 text-white hover:text-red-300"
              onClick={() => setFullImage(null)}
            >
              <X size={30} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadMediaModal;
