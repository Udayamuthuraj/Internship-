import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Users,
  BarChart3,
  Mail,
  MessageSquare,
  Key,
  LogOut,
  Settings,
  Video as VideoIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const navItems = [
  { name: "Dashboard", path: "dashboard", icon: LayoutDashboard },
  { name: "Statistics", path: "statistics", icon: BarChart3 },
  { name: "Members", path: "members", icon: Users },
  { name: "Broadcast", path: "broadcast", icon: Mail },
  { name: "Feedback", path: "feedback", icon: MessageSquare },
  { name: "Videos", path: "videos", icon: VideoIcon },
  { name: "Gallery", path: "gallery", icon: Image },
  { name: "Events", path: "events/all", icon: CalendarDays },
  { name: "Forget Password", path: "forgotpassword", icon: Key },
  { name: "Profile Settings", path: "settings/profile", icon: Settings },
];

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      {/* Sidebar */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="h-screen fixed top-0 left-0 z-50 w-[260px] flex flex-col bg-white/30 backdrop-blur-md border-r border-white/30 shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-[#930911]/40 scrollbar-track-transparent"
      >
        {/* Admin Info */}
        <div className="flex flex-col items-center gap-2 py-6 border-b border-white/20 px-4 relative">
          <img
            src={avatarUrl}
            alt="Admin Avatar"
            className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          />
          <div className="text-center mt-1">
            <p className="text-sm font-semibold text-[#930911]">{admin?.name || "Admin"}</p>
            {admin?.email && (
              <p className="text-xs text-[#CA5C62]">{admin.email}</p>
            )}
            <p className="text-xs text-[#CA5C62] italic">Administrator</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-5">
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={`/admin/${path}`}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-[#930911]/90 text-white shadow-md"
                    : "text-[#930911] hover:bg-[#FFE9D4]/50 hover:text-[#BA3D47] hover:shadow hover:backdrop-blur-md"
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex items-center gap-3 w-full"
              >
                <Icon size={20} />
                <span className="tracking-wide">{name}</span>
              </motion.div>
              <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-[#930911] opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto px-3 py-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 bg-white/10 hover:bg-[#FFE9D4]/50 text-[#930911] hover:text-[#BA3D47] border border-[#EEC8B9]/40 rounded-xl font-medium shadow-sm transition"
          >
            <LogOut size={20} />
            <span className="tracking-wide text-sm">Logout</span>
          </motion.button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 text-[11px] text-[#930911] opacity-70 text-center">
          <p className="font-medium">&copy; University of Madras</p>
          
        </div>
      </motion.div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.img
              src={avatarUrl}
              alt="Full View"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[90%] max-w-[90%] object-contain rounded-xl border-4 border-[#BA3D47] shadow-xl"
            />
            <button
              className="absolute top-6 right-6 text-white hover:text-red-300"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X size={30} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
