import React, { useState, useEffect } from "react";
import { X, VideoIcon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:8080/api";

const UploadVideoModal = ({ onClose, onUploadSuccess, initialData = null }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.category || "");
      setDescription(initialData.description || "");

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
    setFile(null);
    setTitle("");
    setCategory("");
    setDescription("");
    setPreviewUrl(null);
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

  const handleClose = () => {
    resetForm();
    toast.info("❌ Upload cancelled.");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("⚠️ Title is required.");
      return;
    }

    try {
      setLoading(true);

      if (initialData && !file) {
        await axios.put(
          `${BASE_URL}/admin/videos/update/${initialData.id}`,
          new URLSearchParams({ title, category, description }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        toast.success("✅ Video metadata updated!");
      } else {
        const formData = new FormData();
        if (file) formData.append("file", file);
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("uploadedBy", "Admin");

        await axios.post(`${BASE_URL}/admin/videos/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("🎬 Video uploaded successfully!");
      }

      onUploadSuccess?.();
      onClose();
    } catch (error) {
      console.error("❌ Upload/Update error:", error);
      toast.error(`🚫 Operation failed: ${error?.response?.data?.message || "Unknown error"}`);
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
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-[#930911]/70 hover:text-[#930911]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <h2 className="text-xl font-bold text-[#930911] mb-4 flex items-center gap-2">
            <VideoIcon size={22} />
            {initialData ? "Edit Video" : "Upload Video"}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            {/* File */}
            <div>
              <label className="block text-sm font-medium text-[#930911]">
                {initialData ? "Replace Video (optional)" : "Select Video"}{" "}
                {!initialData && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                required={!initialData}
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-3 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
              {file && (
                <p className="mt-1 text-xs text-gray-500 truncate">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {previewUrl && (
                <video
                  src={previewUrl}
                  controls
                  className="mt-3 w-full h-40 object-cover border-2 border-[#BA3D47] rounded-md"
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
                placeholder="e.g., Annual Day Highlights"
                required
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-3 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#930911]">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Cultural, Seminar"
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-3 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#930911]">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Enter a brief description..."
                className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-3 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
            </div>

            {/* Submit */}
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
                  ? "Update Video"
                  : "Upload Video"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadVideoModal;
