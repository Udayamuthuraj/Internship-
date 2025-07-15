import React, { useEffect, useState } from "react";
import { X, Users, ImageIcon, BadgeCheck } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const MemberFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    email: "",
    image: null,
    description: "",
    achievements: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set form data if editing or reset when closed
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        designation: initialData.designation || "",
        department: initialData.department || "",
        email: initialData.email || "",
        image: null,
        description: initialData.description || "",
        achievements: initialData.achievements || "",
      });

      if (initialData.imageUrl) {
        const absoluteUrl = initialData.imageUrl.startsWith("http")
          ? initialData.imageUrl
          : `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"}${initialData.imageUrl}`;
        setPreviewUrl(absoluteUrl);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        name: "",
        designation: "",
        department: "",
        email: "",
        image: null,
        description: "",
        achievements: "",
      });
      setPreviewUrl(null);
    }
  }, [initialData, isOpen]);

  // Cleanup image blob
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      const base = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
      const url = initialData
        ? `${base}/api/admin/members/update/${initialData.id}`
        : `${base}/api/admin/members/add`;

      const method = initialData ? axios.put : axios.post;

      const response = await method(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`✅ Member ${initialData ? "updated" : "added"} successfully`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("❌ Error submitting member form:", err);
      toast.error(`❌ Failed to submit. ${err.response?.data || ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl px-6 py-8 bg-[#FFE9D4]/90 backdrop-blur-xl border border-[#EEC8B9] text-[#930911] shadow-2xl rounded-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-[#930911]/70 hover:text-[#930911]"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <Users size={20} />
              {initialData ? "Edit Committee Member" : "Add Committee Member"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                  <FormField label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
                  <FormField label="Department" name="department" value={formData.department} onChange={handleChange} />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-[#930911] flex items-center gap-2">
                      <ImageIcon size={16} /> Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
                    />
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        onClick={() => setFullImage(previewUrl)}
                        className="mt-2 w-24 h-24 object-cover rounded-full border-2 border-[#BA3D47] cursor-zoom-in"
                      />
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <FormTextArea
                    label="Short Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                  <FormTextArea
                    label={
                      <span className="flex items-center gap-1">
                        <BadgeCheck size={16} /> Achievements
                      </span>
                    }
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-right mt-6">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 text-sm font-semibold rounded-lg text-white bg-[#930911] hover:bg-[#BA3D47] shadow-md disabled:opacity-60"
                >
                  {loading
                    ? initialData
                      ? "Updating..."
                      : "Adding..."
                    : initialData
                    ? "Update Member"
                    : "Add Member"}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Fullscreen Preview */}
          <AnimatePresence>
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
                  onClick={() => setFullImage(null)}
                  className="absolute top-6 right-6 text-white hover:text-red-300"
                >
                  <X size={30} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Input Field Component
const FormField = ({ label, name, type = "text", value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-[#930911]">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={label}
      pattern={name === "email" ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
      className="w-full px-4 py-2 mt-1 text-sm rounded-lg border border-[#EEC8B9] bg-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911] text-gray-800"
    />
  </div>
);

// TextArea Field Component
const FormTextArea = ({ label, name, value, onChange, rows = 3 }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-[#930911]">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      required
      placeholder={`Enter ${name.replace(/([A-Z])/g, " $1").toLowerCase()}...`}
      className="w-full px-4 py-2 mt-1 text-sm rounded-lg border border-[#EEC8B9] bg-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911] text-gray-800 resize-none"
    />
  </div>
);

export default MemberFormModal;
