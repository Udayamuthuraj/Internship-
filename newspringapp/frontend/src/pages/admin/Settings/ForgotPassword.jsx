// src/pages/admin/settings/ForgotPassword.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  sendAdminOtp,
  verifyAdminOtp,
  resetAdminPassword,
} from "../../../services/admin/adminService";
import { useAuth } from "../../../context/AuthContext";

const ForgotPassword = () => {
  const { admin } = useAuth();
  const email = admin?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  // Animate form on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle resend cooldown
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(password);

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) {
      return toast.warn("⚠️ Invalid email.");
    }
    try {
      setLoading(true);
      await sendAdminOtp(email.trim());
      setOtpSent(true);
      setResendCooldown(30);
      toast.success("✅ OTP sent to your email.");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.warn("⚠️ Enter OTP.");
    try {
      setLoading(true);
      const res = await verifyAdminOtp({
        email: email.trim(),
        otp: otp.trim(),
      });

      if (res.includes("verified")) {
        toast.success(res);
        setOtpVerified(true);
        setResendCooldown(0);
        
      } else {
        toast.error(res);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otpVerified) return toast.warn("⚠️ Verify OTP first.");
    if (!isValidPassword(newPassword)) {
      return toast.warn(
        "⚠️ Password must include uppercase, lowercase, number, and symbol."
      );
    }

    try {
      setLoading(true);
      await resetAdminPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });
      toast.success("🎉 Password reset successful!");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] w-full overflow-hidden py-10">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md rounded-2xl p-8 shadow-xl border border-[#EEC8B9] bg-[#FFE9D4]/90 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-center text-[#930911] mb-6">
              🔐 Reset Admin Password
            </h2>

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Read-only Email */}
              <input
                type="email"
                value={email}
                readOnly
                className="w-full p-3 rounded-lg bg-[#EEC8B9]/30 text-black font-medium border border-[#930911]/20 cursor-not-allowed"
              />

              {/* OTP Field */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  disabled={!otpSent}
                  className={`flex-1 p-3 rounded-lg border border-[#EEC8B9] bg-white/60 text-black placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911] ${
                    !otpSent ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={!isValidEmail(email) || loading || resendCooldown > 0}
                  className={`px-4 py-2 rounded-lg font-semibold text-white text-sm ${
                    resendCooldown > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#930911] hover:bg-[#BA3D47]"
                  }`}
                >
                  {resendCooldown > 0 ? `${resendCooldown}s` : otpSent ? "Resend" : "Send OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otpSent || loading}
                  className={`px-4 py-2 rounded-lg font-semibold text-white text-sm ${
                    otpSent
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Verify
                </button>
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!otpVerified}
                  className="w-full p-3 pr-10 rounded-lg border border-[#EEC8B9] bg-white/60 text-black placeholder:text-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#930911] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#930911]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!otpVerified || loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  otpVerified
                    ? "bg-[#930911] hover:bg-[#BA3D47]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "⏳ Resetting..." : "🔐 Reset Password"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
