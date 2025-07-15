// src/pages/admin/Settings/ProfileSettings.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";

const ProfileSettings = () => {
  const { admin, updateAdminInfo } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (admin?.email) setEmail(admin.email);
    if (admin?.name) setName(admin.name);
    if (admin?.profileImageUrl) {
      const normalizedUrl = admin.profileImageUrl.startsWith("http")
        ? admin.profileImageUrl
        : `http://localhost:8080${admin.profileImageUrl.startsWith("/") ? "" : "/"}${admin.profileImageUrl}`;
      setPreviewImage(normalizedUrl);
    }
  }, [admin]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleProfileUpdate = async () => {
    if (!email || !name) {
      toast.warn("⚠️ Name and email are required.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify({ email, newName: name })], {
          type: "application/json",
        })
      );
      if (profileImage) formData.append("profileImage", profileImage);

      const res = await axios.post(
        "http://localhost:8080/api/admin/profile/update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        toast.success("✅ Profile updated successfully");
        const updatedImageUrl = res.data.profileImageUrl.startsWith("http")
          ? res.data.profileImageUrl
          : `http://localhost:8080${res.data.profileImageUrl.startsWith("/") ? "" : "/"}${res.data.profileImageUrl}`;
        updateAdminInfo({
          name: res.data.name,
          email: res.data.email,
          profileImageUrl: res.data.profileImageUrl,
        });
        setPreviewImage(updatedImageUrl);
        setProfileImage(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email || !newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      toast.warn("⚠️ Enter a valid new email.");
      return;
    }

    try {
      setOtpLoading(true);
      await axios.post("http://localhost:8080/api/admin/profile/request-email-change", {
        currentEmail: email,
        newEmail,
      });
      setOtpSent(true);
      toast.success("📧 OTP sent to new email.");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtpLoading(true);
      await axios.post("http://localhost:8080/api/admin/profile/request-email-change", {
        currentEmail: email,
        newEmail,
      });
      toast.success("📨 OTP resent to new email.");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true);
      await axios.post("http://localhost:8080/api/admin/profile/verify-email-change", {
        currentEmail: email,
        newEmail,
        otp,
      });

      toast.success("✅ Email updated successfully");
      setEmail(newEmail);
      updateAdminInfo({ email: newEmail });

      setNewEmail("");
      
      setOtpSent(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="p-6 max-w-3xl mx-auto bg-[#FFE9D4]/90 rounded-2xl shadow-xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-[#930911] mb-6">🛠️ Profile Settings</h2>

        {/* Name & Image Section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#930911]">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-black placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[#930911]">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
              className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-gray-800 placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                onClick={() => setShowImageModal(true)}
                className="w-24 h-24 rounded-full mt-3 border-2 border-[#930911] object-cover shadow-md cursor-pointer"
              />
            )}
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="bg-[#930911] text-white px-5 py-2 rounded-md hover:bg-[#BA3D47] transition font-medium disabled:opacity-60"
          >
            {loading ? "Updating..." : "💾 Update Profile"}
          </button>
        </div>

        <hr className="my-6 border-[#EEC8B9]" />

        {/* Email Change Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#930911]">📧 Change Email</h3>

          <div>
            <label className="block text-sm font-medium text-[#930911]">New Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-black placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
          </div>

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="bg-[#930911] text-white px-5 py-2 rounded-md hover:bg-[#BA3D47] transition font-medium disabled:opacity-60"
            >
              {otpLoading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-[#930911]">Enter OTP</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-[#EEC8B9] bg-white/60 text-sm px-4 py-2 text-black placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpLoading}
                  className="bg-[#930911] text-white px-5 py-2 rounded-md hover:bg-[#BA3D47] transition font-medium disabled:opacity-60"
                >
                  {otpLoading ? "Verifying..." : "Verify & Update Email"}
                </button>

                <button
                  onClick={handleResendOtp}
                  disabled={otpLoading}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-60"
                >
                  {otpLoading ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
            onClick={() => setShowImageModal(false)}
          >
            <motion.img
              src={previewImage}
              alt="Full View"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[90%] max-w-[90%] object-contain rounded-xl border-4 border-[#BA3D47] shadow-xl"
            />
            <button
              className="absolute top-6 right-6 text-white hover:text-red-300"
              onClick={() => setShowImageModal(false)}
            >
              <X size={30} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSettings;
