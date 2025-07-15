// src/pages/admin/AdminForgotResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import universityBg from "../../assets/unomstu1.jpg";
import {
  sendAdminOtp,
  verifyAdminOtp,
  resetAdminPassword,
} from "../../services/admin/adminService";

const AdminForgotResetPassword = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(password);

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) {
      return toast.warn("⚠️ Please enter a valid email first.");
    }
    try {
      setLoading(true);
      await sendAdminOtp(email.trim());
      setOtpSent(true);
      setResendCooldown(30);
      toast.success("✅ OTP sent! Check your email.");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to send OTP. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      return toast.warn("⚠️ Email & OTP required.");
    }
    try {
      setLoading(true);
      const response = await verifyAdminOtp({ email: email.trim(), otp: otp.trim() });

      if (response.includes("verified")) {
        toast.success(response);
        setOtpVerified(true);
        
        setResendCooldown(0);
      } else {
        toast.error(response);
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
    if (!otpVerified) return toast.warn("⚠️ Please verify OTP first!");
    if (!isValidPassword(newPassword)) {
      return toast.warn(
        "⚠️ Password must include uppercase, lowercase, number, symbol, and be at least 8 characters."
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
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "❌ Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${universityBg})` }}
    >
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <Link
        to="/"
        className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <Home className="text-[#930911] w-6 h-6" />
      </Link>

      <div className="min-h-screen flex items-center justify-center px-4 bg-black/30">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white/30 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl px-10 py-12 max-w-md w-full"
            >
              <h2 className="text-4xl font-bold text-center text-[#930911] mb-6">
                🔁 Reset Admin Password
              </h2>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <input
                  type="email"
                  placeholder="📧 Registered Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-style"
                />

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="🔢 Enter OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={!otpSent}
                    className={`input-style flex-1 ${
                      !otpSent ? "bg-gray-200" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={
                      !isValidEmail(email) || loading || resendCooldown > 0
                    }
                    className={`px-3 py-2 rounded-lg font-semibold text-white transition ${
                      isValidEmail(email) && resendCooldown === 0
                        ? "bg-[#930911] hover:bg-[#BA3D47]"
                        : "bg-gray-400"
                    }`}
                  >
                    {resendCooldown > 0
                      ? `⌛ ${resendCooldown}s`
                      : otpSent
                      ? "Resend"
                      : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otpSent || loading}
                    className={`px-3 py-2 rounded-lg font-semibold text-white ${
                      otpSent
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400"
                    }`}
                  >
                    Verify
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="🔒 New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!otpVerified}
                    className="input-style pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#930911]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!otpVerified || loading}
                  className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                    otpVerified
                      ? "bg-[#930911] text-white hover:bg-[#BA3D47]"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {loading ? "⏳ Resetting..." : "🔐 Reset Password"}
                </button>
              </form>

              <p className="mt-8 text-center text-base font-medium text-gray-800 bg-white/60 rounded-xl px-4 py-3 shadow hover:shadow-lg transition-all duration-300">
                🔙 Remembered?{" "}
                <Link
                  to="/admin/login"
                  className="text-[#930911] font-bold underline hover:text-[#BA3D47]"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminForgotResetPassword;
