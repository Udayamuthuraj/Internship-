import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import universityBg from "../../assets/unomstu1.jpg";

const StudentRegister = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [details, setDetails] = useState({
    name: "",
    department: "",
    batch: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendOTP = () => {
    if (!email) return;
    setOtpSent(true);
    alert("OTP sent to your email.");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!emailRegex.test(email)) {
      alert("Enter a valid email.");
      return;
    }
    if (!passwordRegex.test(details.password)) {
      alert(
        "Password must be 8+ characters, contain upper/lowercase, number, special char."
      );
      return;
    }

    alert("🎉 Registered successfully!");
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
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="input-style"
                  value={details.department}
                  onChange={(e) =>
                    setDetails({ ...details, department: e.target.value })
                  }
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
                  required
                />

                <div className="flex gap-3">
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
                </div>

                <input
                  type="password"
                  placeholder="Create Password"
                  className="input-style"
                  value={details.password}
                  onChange={(e) =>
                    setDetails({ ...details, password: e.target.value })
                  }
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-[#930911] text-white py-3 rounded-lg font-semibold hover:bg-[#BA3D47] transition duration-300"
                >
                  Register
                </button>
              </form>

              {/* Enhanced Visibility for Login Prompt */}
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
