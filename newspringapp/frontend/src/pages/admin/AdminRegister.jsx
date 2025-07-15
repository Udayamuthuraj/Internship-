import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Eye, EyeOff } from "lucide-react";
import universityBg from "../../assets/unomstu1.jpg";
import {
  registerAdmin,
  checkAdminEmailExists,
  sendAdminOtp,
  verifyAdminOtp,
} from "../../services/admin/adminService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [details, setDetails] = useState({ name: "", password: "", confirmPassword: "" });

  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [registering, setRegistering] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(pw);

  const extractError = (err, fallback = "Something went wrong") => {
    return (
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      fallback
    );
  };

  const handleSendOTP = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedAdminCode = adminCode.trim();

    if (!isValidEmail(trimmedEmail)) return toast.warn("⚠️ Please enter a valid email.");
    if (!trimmedAdminCode) return toast.warn("⚠️ Admin code is required before sending OTP.");

    try {
      setOtpSending(true);
      await sendAdminOtp(trimmedEmail);
      setOtpSent(true);
      setResendCooldown(30);
      toast.success("✅ OTP sent! Check your inbox.");
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${extractError(err, "Failed to send OTP.")}`);
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !otp) return toast.warn("⚠️ Email & OTP are required.");
    try {
      setOtpVerifying(true);
      const res = await verifyAdminOtp({ email: trimmedEmail, otp: otp.trim() });
      if (res.toLowerCase().includes("verified")) {
        toast.success("✅ OTP verified!");
        setOtpVerified(true);
        setResendCooldown(0);
      } else {
        toast.error("❌ Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${extractError(err, "OTP verification failed.")}`);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registering) return;

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = details.password.trim();

    if (!isValidEmail(trimmedEmail)) return toast.warn("⚠️ Invalid email.");
    if (!adminCode.trim()) return toast.warn("⚠️ Admin code is required.");
    if (!isOtpVerified) return toast.warn("⚠️ Verify OTP first.");
    if (!isValidPassword(trimmedPassword))
      return toast.warn("⚠️ Password must include uppercase, lowercase, number & symbol.");
    if (trimmedPassword !== details.confirmPassword.trim())
      return toast.warn("⚠️ Passwords do not match.");

    try {
      setRegistering(true);
      const emailExists = await checkAdminEmailExists(trimmedEmail);
      if (emailExists) return toast.warn("⚠️ Email is already registered.");

      const payload = {
        name: details.name.trim(),
        email: trimmedEmail,
        password: trimmedPassword,
        adminCode: adminCode.trim(),
        otp: otp.trim(),
      };

      await registerAdmin(payload);
      toast.success("🎉 Registered successfully!");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${extractError(err, "Registration failed.")}`);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${universityBg})` }}
    >
      <Link to="/" className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
        <Home className="text-[#930911] w-6 h-6" />
      </Link>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="min-h-screen flex items-center justify-center px-4 bg-black/30">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white/30 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full"
            >
              <h2 className="text-4xl font-bold text-center text-[#930911] mb-6">🔐 Admin Register</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  placeholder="👤 Full Name"
                  className="input-style"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="🛡️ Admin Code"
                  className="input-style"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="📧 Email"
                  className="input-style"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter OTP"
                    className={`input-style flex-1 ${!otpSent ? "bg-gray-200" : ""}`}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    disabled={!otpSent}
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={!isValidEmail(email) || !adminCode.trim() || otpSending || resendCooldown > 0}
                    className={`px-3 py-2 rounded-lg font-semibold text-white ${
                      isValidEmail(email) && adminCode.trim() && resendCooldown === 0
                        ? "bg-[#930911] hover:bg-[#BA3D47]"
                        : "bg-gray-400"
                    }`}
                  >
                    {otpSending
                      ? "Sending..."
                      : resendCooldown > 0
                      ? `⌛ ${resendCooldown}s`
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otpSent || otpVerifying}
                    className={`px-3 py-2 rounded-lg font-semibold text-white ${
                      otpSent ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
                    }`}
                  >
                    {otpVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>

                {isOtpVerified && (
                  <>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="🔒 Create Password"
                        className="input-style pr-10"
                        value={details.password}
                        onChange={(e) => setDetails({ ...details, password: e.target.value })}
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-3 cursor-pointer text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </span>
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="🔒 Confirm Password"
                      className="input-style"
                      value={details.confirmPassword}
                      onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })}
                      required
                    />

                    <button
                      type="submit"
                      disabled={registering}
                      className="w-full py-3 rounded-lg font-semibold bg-[#930911] text-white hover:bg-[#BA3D47]"
                    >
                      {registering ? "Registering..." : "Register 🎉"}
                    </button>
                  </>
                )}
              </form>
              <p className="mt-6 text-center bg-white/60 rounded-lg px-4 py-3">
                Already an admin?{" "}
                <Link to="/admin/login" className="text-[#930911] font-bold underline">
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

export default AdminRegister;
