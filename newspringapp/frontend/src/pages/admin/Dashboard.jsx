// src/pages/admin/Dashboard.jsx

import React, { useEffect, useState } from "react";
import StatCard from "../../components/admin/common/StatCard";
import ChartCard from "../../components/admin/common/ChartCard";
import useAxios from "../../hooks/useAxios";

import {
  GraduationCap,
  Users,
  MessageSquare,
  CalendarDays,
  Image,
  Mail,
  User,
  Video,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const axiosInstance = useAxios(); // ✅ using wrapped axios instance
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          axiosInstance.get("/api/admin/dashboard/stats"),              // ✅ Fixed: Removed duplicate `/api`
          axiosInstance.get("/api/admin/dashboard/department-stats"),   // ✅
        ]);

        setStats(statsRes.data);

        const formattedChartData = Array.isArray(chartRes.data)
          ? chartRes.data.map((item) => ({
              department: item.department,
              students: item.studentCount,
              alumni: item.alumniCount,
            }))
          : [];

        setChartData(formattedChartData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axiosInstance]);

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#930911]">
        <LayoutDashboard size={32} className="animate-pulse mb-2" />
        <p className="font-medium text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  // Error or Null
  if (error || !stats) {
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error || "Something went wrong!"}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard size={24} className="text-[#930911]" />
        <h1 className="text-xl font-bold text-[#930911] tracking-wide">
          Admin Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <StatCard title="Total Alumni" count={stats.totalAlumni || 0} icon={GraduationCap} />
        <StatCard title="Total Students" count={stats.totalStudents || 0} icon={Users} />
        <StatCard title="Feedback Count" count={stats.totalFeedback || 0} icon={MessageSquare} />
        <StatCard title="Total Events" count={stats.totalEvents || 0} icon={CalendarDays} />
        <StatCard title="Gallery Photos" count={stats.totalGallery || 0} icon={Image} />
        <StatCard title="Broadcasts Sent" count={stats.totalBroadcasts || 0} icon={Mail} />
        <StatCard title="Committee Members" count={stats.totalMembers || 0} icon={User} />
        <StatCard title="Videos" count={stats.totalVideos || 0} icon={Video} />
      </div>

      {/* Department-wise Chart */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 size={22} className="text-[#930911]" />
          <h2 className="text-xl font-bold text-[#930911] tracking-wide">
            Department-wise Registrations
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full"
        >
          <ChartCard title="Registrations by Department" data={chartData} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
