// 🔁 All existing imports stay the same
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import universityBg from "../../assets/unomstu1.jpg";
import {
  registerStudent,
  checkEmailExists,
  verifyStudentOtp, // ✅ Import here
} from "../../services/studentService";
import axios from "axios";

const StudentRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    department: "",
    batch: "",
    password: "",
  });
  const navigate = useNavigate();
  const EMAIL_API_BASE_URL = "http://localhost:8080/api/email";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendOTP = async () => {
    if (!email) return;
    try {
      await axios.get(`${EMAIL_API_BASE_URL}/send-otp?to=${email}`);
      setOtpSent(true);
      alert("✅ OTP sent to your email.");
    } catch (err) {
      alert("❌ Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
  if (!email || !otp) return;
  try {
    const response = await axios.get(`${EMAIL_API_BASE_URL}/verify-otp?to=${email}&otp=${otp}`);
    console.log("OTP Verification result:", response.data);
    if (response.data === true) {
      alert("✅ OTP verified successfully!");
      setOtpVerified(true);
    } else {
      alert("❌ Verification failed.");
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    alert("❌ Something went wrong during verification.");
  }
};

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!emailRegex.test(email)) {
      alert("Enter a valid email.");
      return;
    }

    if (!isOtpVerified) {
      alert("Please verify the OTP before registering.");
      return;
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        alert("⚠️ This email is already registered. Try logging in.");
        return;
      }
    } catch (error) {
      console.error("Email check failed:", error);
      alert("Something went wrong while checking the email.");
      return;
    }

    if (!passwordRegex.test(details.password)) {
      alert(
        "Password must be 8+ characters, contain upper/lowercase, number, and special character."
      );
      return;
    }

    const studentPayload = {
      name: details.name,
      department: details.department,
      batch: details.batch,
      email,
      password: details.password,
    };

    try {
      await registerStudent(studentPayload);
      alert("🎉 Registered successfully!");
      navigate("/student/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      alert(`❌ Registration failed: ${errMsg}`);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${universityBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link
        to="/"
        className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
        title="Home"
      >
        <Home className="text-[#930911] w-6 h-6" />
      </Link>

      <div className="min-h-screen w-full flex items-center justify-center px-4 bg-black/30">
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
                Student Register
              </h2>
              <form onSubmit={handleRegister} className="space-y-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-style"
                  value={details.name}
                  onChange={(e) =>
                    setDetails({ ...details, name: e.target.value })
                  }
                  autoComplete="name"
                  required
                />
                <input
                  type="text"
                  placeholder="Department e.g., CS or IT"
                  className="input-style"
                  value={details.department}
                  onChange={(e) =>
                    setDetails({ ...details, department: e.target.value })
                  }
                  autoComplete="organization"
                  required
                />
                <input
                  type="text"
                  placeholder="Batch (e.g., 2020-2023)"
                  className="input-style"
                  value={details.batch}
                  onChange={(e) =>
                    setDetails({ ...details, batch: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input-style"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className={`input-style flex-1 ${
                      !otpSent ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={!otpSent}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={!email}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                      email
                        ? "bg-[#930911] hover:bg-[#BA3D47]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {otpSent ? "Resend" : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otpSent}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                      otpSent
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Verify OTP
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="Create Password"
                  className="input-style"
                  value={details.password}
                  onChange={(e) =>
                    setDetails({ ...details, password: e.target.value })
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="submit"
                  disabled={!isOtpVerified}
                  className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                    isOtpVerified
                      ? "bg-[#930911] text-white hover:bg-[#BA3D47]"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Register
                </button>
              </form>

              <p className="mt-8 text-center text-base font-medium text-gray-700 bg-white/60 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300">
                Already have an account?{" "}
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

export default StudentRegister;
