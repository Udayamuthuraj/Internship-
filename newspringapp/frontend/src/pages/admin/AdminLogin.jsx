// src/pages/admin/AdminLogin.jsx

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Home } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import universityBg from "../../assets/unomstu1.jpg";
import { loginAdmin } from "../../services/admin/adminService";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const { login, admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (admin?.token) {
      navigate("/admin/dashboard", { replace: true });
    }
    const timer = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(timer);
  }, [admin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAdmin({ email: email.trim(), password: password.trim() });
      login(res.admin, res.token);
      toast.success(`🎉 Welcome, ${res.admin.name || "Admin"}!`);
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message || "Login failed.";
      toast.error(`❌ ${errorMsg}`);
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
              transition={{ duration: 0.8 }}
              className="bg-white/30 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl px-10 py-12 max-w-md w-full"
            >
              <h2 className="text-4xl font-bold text-center text-[#930911] mb-6 tracking-wide">
                🔐 Admin Login
              </h2>

              <form onSubmit={handleLogin} className="space-y-5">
                <input
                  type="email"
                  placeholder="📧 Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-style"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="🔒 Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-style pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#930911]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex justify-end text-sm">
                  <Link
                    to="/admin/forgot-reset-password"
                    className="text-yellow-300 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-white bg-[#930911] hover:bg-[#BA3D47] transition duration-300"
                >
                  {loading ? "⏳ Logging in..." : "🚀 Login"}
                </button>
              </form>

              <p className="mt-8 text-center text-base text-gray-800 bg-white/60 rounded-xl px-4 py-3 shadow hover:shadow-lg transition">
                Don&apos;t have an account?{" "}
                <Link
                  to="/admin/register"
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

export default AdminLogin;
