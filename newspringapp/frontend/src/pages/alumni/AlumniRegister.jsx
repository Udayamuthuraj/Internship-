import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Eye, EyeOff } from "lucide-react";
import universityBg from "../../assets/unomstu1.jpg";
import {
  registerAlumni,
  checkAlumniEmailExists,
  sendAlumniOtp,
  verifyAlumniOtp,
} from "../../services/alumniService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlumniRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({ name: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1000);
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

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(password);

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) {
      return toast.warn("Enter a valid email before requesting OTP.");
    }

    try {
      setLoading(true);
      await sendAlumniOtp(email.trim());
      setOtpSent(true);
      setResendCooldown(30);
      toast.success("OTP sent to your email!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      return toast.warn("Email and OTP required to verify.");
    }

    try {
      setLoading(true);
      const response = await verifyAlumniOtp({ email: email.trim(), otp: otp.trim() });
      if (response === "OTP verified successfully.") {
        toast.success("OTP verified!");
        setOtpVerified(true);
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      return toast.warn("Invalid email format.");
    }

    if (!batch.trim() || !department.trim()) {
      return toast.warn("Batch and Department are required.");
    }

    if (!isOtpVerified) {
      return toast.warn("Verify OTP before registering.");
    }

    if (!isValidPassword(details.password)) {
      return toast.warn(
        "Password must have uppercase, lowercase, number, special character, and be 8+ chars."
      );
    }

    if (details.password !== details.confirmPassword) {
      return toast.warn("Passwords do not match.");
    }

    try {
      setLoading(true);
      const emailExists = await checkAlumniEmailExists(email.trim());
      if (emailExists) {
        return toast.warn("This email is already registered.");
      }

      const payload = {
        name: details.name.trim(),
        email: email.trim(),
        password: details.password.trim(),
        batch: batch.trim(),
        department: department.trim(),
        otp: otp.trim(),
      };

      await registerAlumni(payload);
      toast.success("Registered successfully!");
      navigate("/alumni/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(`Registration failed: ${err.response?.data || err.message}`);
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

      <ToastContainer />

      <div className="min-h-screen flex items-center justify-center px-4 bg-black/30">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl px-10 py-12 max-w-lg w-full"
            >
              <h2 className="text-4xl font-bold text-center text-[#930911] mb-8">
                Alumni Register
              </h2>
              <form onSubmit={handleRegister} className="space-y-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-style"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Batch (e.g., 2018-2021)"
                  className="input-style"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="input-style"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input-style"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    maxLength={6}
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
                    disabled={!isValidEmail(email) || loading || resendCooldown > 0}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                      isValidEmail(email) && resendCooldown === 0
                        ? "bg-[#930911] hover:bg-[#BA3D47]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {resendCooldown > 0 ? `Resend (${resendCooldown})` : otpSent ? "Resend" : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otpSent || loading}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                      otpSent ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Verify OTP
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    className="input-style pr-12"
                    value={details.password}
                    onChange={(e) => setDetails({ ...details, password: e.target.value })}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-4 cursor-pointer text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="input-style"
                  value={details.confirmPassword}
                  onChange={(e) =>
                    setDetails({ ...details, confirmPassword: e.target.value })
                  }
                  required
                />

                <button
                  type="submit"
                  disabled={!isOtpVerified || loading}
                  className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                    isOtpVerified
                      ? "bg-[#930911] text-white hover:bg-[#BA3D47]"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <p className="mt-8 text-center text-base font-medium text-gray-700 bg-white/60 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300">
                Already an alumni?{" "}
                <Link
                  to="/alumni/login"
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

export default AlumniRegister;
