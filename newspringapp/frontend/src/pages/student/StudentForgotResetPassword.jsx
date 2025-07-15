import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Eye, EyeOff } from "lucide-react";
import universityBg from "../../assets/unomstu1.jpg";
import {
  sendStudentOtp,
  verifyStudentOtp,
  resetStudentPassword,
} from "../../services/studentService";

const StudentForgotResetPassword = () => {
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(password);

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) return alert("Enter a valid email.");

    try {
      setLoading(true);
      await sendStudentOtp(email);
      setOtpSent(true);
      alert("✅ OTP sent to your email.");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) return alert("Enter both email and OTP.");

    try {
      setLoading(true);
      const response = await verifyStudentOtp({ email, otp });
      if (response === "OTP verified successfully.") {
        alert("✅ OTP verified!");
        setOtpVerified(true);
      } else {
        alert("❌ Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify OTP first.");
    if (!isValidPassword(newPassword)) {
      return alert(
        "Password must contain uppercase, lowercase, number, special character and be 8+ characters."
      );
    }

    try {
      setLoading(true);
      await resetStudentPassword({ email, otp, newPassword });
      alert("🎉 Password reset successfully!");
      navigate("/student/login");
    } catch (err) {
      console.error(err);
      alert(`❌ Reset failed: ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${universityBg})` }}
    >
      <Link
        to="/"
        className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
        title="Home"
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
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl px-10 py-12 max-w-lg w-full"
            >
              <h2 className="text-4xl font-bold text-center text-[#930911] mb-8">
                Student Forgot / Reset Password
              </h2>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <input
                  type="email"
                  placeholder="Registered Email"
                  className="input-style"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className={`input-style flex-1 ${
                      !otpSent ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={!otpSent}
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={!isValidEmail(email) || loading}
                    className={`px-3 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                      isValidEmail(email)
                        ? "bg-[#930911] hover:bg-[#BA3D47]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otpSent || loading}
                    className={`px-3 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                      otpSent
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Verify
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="input-style pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={!otpVerified}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-600 hover:text-black"
                    aria-label="Toggle password visibility"
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
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="mt-8 text-center text-base font-medium text-gray-700 bg-white/60 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300">
                Remembered your password?{" "}
                <Link
                  to="/student/login"
                  className="text-[#930911] font-bold underline hover:text-[#BA3D47] transition"
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

export default StudentForgotResetPassword;
