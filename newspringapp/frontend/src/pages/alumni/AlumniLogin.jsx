import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Home } from "lucide-react";
import universityBg from "../../assets/unomstu1.jpg";
import { loginAlumni } from "../../services/alumniService";

const AlumniLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginAlumni({ email, password });
      localStorage.setItem("alumniName", response.name || "Alumni");
      localStorage.setItem("alumniToken", response.token);
      setAlert({
        message: `🎉 Login successful! Welcome, ${response.name || "Alumni"}`,
        type: "success",
      });
      setTimeout(() => navigate("/alumni/dashboard"), 1200);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setAlert({ message: `❌ Login failed: ${errorMsg}`, type: "error" });
    } finally {
      setLoading(false);
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

      <div className="min-h-screen flex items-center justify-center px-4 bg-black/30">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl px-10 py-12 max-w-lg w-full"
            >
              <h2 className="text-4xl font-extrabold text-center text-[#930911] mb-6 tracking-wide">
                Alumni Login
              </h2>

              {alert.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 px-4 py-3 rounded-lg text-center font-medium text-base transition-all duration-300 ${
                    alert.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {alert.message}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (alert.message) setAlert({ message: "", type: "" });
                  }}
                  required
                  className="w-full py-3 px-4 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#930911] transition"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (alert.message) setAlert({ message: "", type: "" });
                    }}
                    required
                    className="w-full py-3 px-4 pr-10 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#930911] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#930911]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex justify-end text-sm">
                  <Link
                    to="/alumni/forgot-reset-password"
                    className="text-yellow-300 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#930911] hover:bg-[#BA3D47] text-white py-3 rounded-xl font-semibold text-lg tracking-wide shadow-md transition duration-300"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mt-8 text-center text-base text-gray-700 bg-white/70 px-4 py-3 rounded-xl shadow hover:shadow-lg transition-all">
                Don&apos;t have an account?{" "}
                <Link
                  to="/alumni/register"
                  className="text-[#930911] font-bold underline hover:text-[#BA3D47]"
                >
                  Register here
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlumniLogin;
