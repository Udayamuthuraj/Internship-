import React, { useContext, useState, useEffect, useRef } from "react";
import { LogOut, Key, ChevronDown, X, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// University of Madras Theme Colors
const COLORS = {
  primary: "#930911", // Cardinal Red
  accent: "#BA3D47",  // Deep Rose
  lightBg: "#FFE9D4", // Light Beige
  softText: "#CA5C62" // Warm Gray
};

const Topbar = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowProfileDropdown(false);
  }, [location.pathname]);

  if (!context) {
    return (
      <div className="w-full h-16 flex items-center justify-between px-4 backdrop-blur-lg bg-white/30 border-b border-white/30 shadow-md">
        <span className="text-[#930911] text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const { admin, logout } = context;

  const getPageTitle = () => {
    const path = location.pathname.split("/").slice(2).join(" / ") || "dashboard";
    return path
      .split("/")
      .map(segment =>
        segment
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" / ");
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const normalizedImageUrl =
    admin?.profileImageUrl?.startsWith("http") || admin?.profileImageUrl?.startsWith("https")
      ? admin.profileImageUrl
      : admin?.profileImageUrl
      ? `http://localhost:8080${admin.profileImageUrl.startsWith("/") ? "" : "/"}${admin.profileImageUrl}`
      : null;

  const avatarUrl = normalizedImageUrl
    ? normalizedImageUrl
    : `https://ui-avatars.com/api/?name=${admin?.name || "Admin"}&background=930911&color=fff`;

  return (
    <>
      {/* Topbar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 w-full h-16 px-4 flex items-center justify-between backdrop-blur-lg bg-white/30 border-b border-white/30 shadow-md"
      >
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-semibold tracking-wide"
          style={{ color: COLORS.primary }}
        >
          {getPageTitle()}
        </motion.h1>

        {/* Right Side: Clock + Avatar */}
        <div className="flex items-center gap-4 relative">
          {/* Current Time */}
          <span className="hidden md:inline text-sm font-medium text-[#444] select-none">
            {currentTime.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>

          {/* Avatar + Dropdown */}
          <motion.div
            className="relative flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#930911]/50 rounded-md"
            onClick={() => setShowProfileDropdown(prev => !prev)}
            ref={dropdownRef}
            tabIndex={0}
            aria-label="Open profile menu"
          >
            <img
              src={avatarUrl}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full border border-white shadow object-cover"
              onClick={(e) => {
                e.stopPropagation();
                setShowImageModal(true);
              }}
            />
            <ChevronDown className="text-[#930911]" size={16} />
          </motion.div>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-48 backdrop-blur-lg bg-white/30 border border-white/20 shadow-xl rounded-xl z-50 overflow-hidden"
              >
                <ul className="text-sm font-medium text-[#930911]">
                  <li
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#FFE9D4]/40 hover:text-[#BA3D47] transition"
                    onClick={() => {
                      navigate("/admin/settings/profile");
                      setShowProfileDropdown(false);
                    }}
                  >
                    <Settings size={16} /> Profile Settings
                  </li>
                  <li
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#FFE9D4]/40 hover:text-[#BA3D47] transition"
                    onClick={() => {
                      navigate("/admin/forgotpassword");
                      setShowProfileDropdown(false);
                    }}
                  >
                    <Key size={16} /> Forget Password
                  </li>
                  <li
                    className="flex items-center gap-2 px-4 py-2 text-red-600 cursor-pointer hover:bg-[#FFE9D4]/40 transition"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Logout
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>


    </>
  );
};

export default Topbar;
