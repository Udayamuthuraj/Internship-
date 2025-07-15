import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { motion } from "framer-motion";
import universityBg from "../../../assets/unomstu1.jpg";

const AdminLayout = () => {
  return (
    <div
      className="flex min-h-screen w-full overflow-hidden bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${universityBg})`,
        backgroundColor: "#FFE9D4", // Fallback color
      }}
      aria-label="Admin Dashboard Layout Background"
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col flex-1 ml-[80px] lg:ml-[260px] transition-all duration-300 ease-in-out"
        aria-label="Main Content Wrapper"
      >
        {/* Topbar */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Topbar />
        </motion.div>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#CA5C62]/70 scrollbar-track-transparent px-4 sm:px-6 py-6 backdrop-blur-lg bg-white/30 border border-white/30 shadow-inner transition-all duration-500 ease-in-out"
          aria-label="Admin Dashboard Content Area"
        >
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
