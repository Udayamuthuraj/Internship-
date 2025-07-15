// src/pages/admin/StatisticsPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Users, Shield, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/admin/common/SearchBar";
import { useAuth } from "../../../context/AuthContext";

const StatisticsPage = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    totalAdmins: 0,
    totalStudents: 0,
    totalAlumni: 0,
  });

  const [studentSummaries, setStudentSummaries] = useState([]);
  const [alumniSummaries, setAlumniSummaries] = useState([]);
  const [adminSummaries, setAdminSummaries] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reasonType, setReasonType] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const getFinalReason = () => {
    switch (reasonType) {
      case "moveToAlumni":
        return "Move to Alumni";
      case "fake":
        return "Fake or Invalid Entry";
      case "custom":
        return customReason.trim();
      default:
        return "";
    }
  };

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, alumniRes, adminsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/dashboard/stats"),
        axios.get("http://localhost:8080/api/admin/dashboard/students"),
        axios.get("http://localhost:8080/api/admin/dashboard/alumni"),
        axios.get("http://localhost:8080/api/admin/dashboard/admins"),
      ]);
      setDashboardStats(statsRes.data || {});
      setStudentSummaries(studentsRes.data || []);
      setAlumniSummaries(alumniRes.data || []);
      setAdminSummaries(adminsRes.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const getUrlForType = (type, id) => {
    switch (type) {
      case "student":
        return `http://localhost:8080/api/admin/dashboard/students/${id}`;
      case "alumni":
        return `http://localhost:8080/api/admin/dashboard/alumni/${id}`;
      case "admin":
        return `http://localhost:8080/api/admin/dashboard/admins/${id}`;
      default:
        return "";
    }
  };

  const confirmDelete = async () => {
    const reason = getFinalReason();
    if (!deleteTarget || !reason) return;

    const { type, id, name, email } = deleteTarget;
    const url = getUrlForType(type, id);

    try {
      await axios.delete(url, {
        data: { name, email, reason },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (type === "student") {
        setStudentSummaries((prev) => prev.filter((s) => s.id !== id));
      } else if (type === "alumni") {
        setAlumniSummaries((prev) => prev.filter((a) => a.id !== id));
      } else if (type === "admin") {
        setAdminSummaries((prev) => prev.filter((a) => a.id !== id));
        if (email === admin?.email) {
          toast.warn("Your admin account has been deleted. Logging out...");
          setTimeout(() => {
            logout();
            navigate("/admin/login");
          }, 2000);
        }
      }

      toast.success(`${name} (${type}) deleted successfully!`);
      setDeleteTarget(null);
      setReasonType("");
      setCustomReason("");
    } catch (err) {
      toast.error("❌ Failed to delete. Please try again.");
    }
  };

  const departments = useMemo(() => {
    const allDepts = [
      ...studentSummaries.map((s) => s.department),
      ...alumniSummaries.map((a) => a.department),
    ].filter(Boolean);
    return ["All", ...Array.from(new Set(allDepts))];
  }, [studentSummaries, alumniSummaries]);

  const filteredStudents = useMemo(
    () =>
      studentSummaries.filter(
        (item) =>
          `${item.name} ${item.email} ${item.department || ""} ${item.batch || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (departmentFilter === "All" || item.department === departmentFilter)
      ),
    [studentSummaries, searchTerm, departmentFilter]
  );

  const filteredAlumni = useMemo(
    () =>
      alumniSummaries.filter(
        (item) =>
          `${item.name} ${item.email} ${item.department || ""} ${item.batch || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (departmentFilter === "All" || item.department === departmentFilter)
      ),
    [alumniSummaries, searchTerm, departmentFilter]
  );

  const filteredAdmins = useMemo(
    () =>
      adminSummaries.filter((item) =>
        `${item.name} ${item.email}`.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [adminSummaries, searchTerm]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-6"
    >
      <ToastContainer />
      <h2 className="text-2xl font-bold text-[#930911]">Statistics Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Students" value={dashboardStats.totalStudents} Icon={Users} delay={0} />
        <SummaryCard label="Total Alumni" value={dashboardStats.totalAlumni} Icon={GraduationCap} delay={0.1} />
        <SummaryCard label="Total Admins" value={dashboardStats.totalAdmins} Icon={Shield} delay={0.2} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <h3 className="text-xl font-semibold text-[#930911]">Statistics Summary</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar placeholder="Search by name, email..." value={searchTerm} onChange={setSearchTerm} />
          <FilterDropdown value={departmentFilter} onChange={setDepartmentFilter} options={departments} />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-[#930911] py-10 animate-pulse">Loading data...</p>
      ) : error ? (
        <p className="text-center text-red-600 py-10 font-semibold">{error}</p>
      ) : (
        <>
          <SummaryTable
            title="Student Summary"
            data={filteredStudents}
            onDelete={(stu) =>
              setDeleteTarget({ type: "student", id: stu.id, name: stu.name, email: stu.email })
            }
          />
          <SummaryTable
            title="Alumni Summary"
            data={filteredAlumni}
            onDelete={(al) =>
              setDeleteTarget({ type: "alumni", id: al.id, name: al.name, email: al.email })
            }
          />
          <SummaryTable
            title="Admin Summary"
            data={filteredAdmins}
            onDelete={(adminUser) =>
              setDeleteTarget({ type: "admin", id: adminUser.id, name: adminUser.name, email: adminUser.email })
            }
            showProfile
            onProfileClick={(imgUrl, name) => setPreviewImage({ imgUrl, name })}
          />
        </>
      )}

      {/* Confirm Delete Modal */}
<AnimatePresence>
  {deleteTarget && (
    <motion.div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#FFE9D4]/90 border border-[#CA5C62] rounded-xl p-6 w-full max-w-md text-center text-[#930911] shadow-2xl backdrop-blur-lg relative">
        <button onClick={() => { setDeleteTarget(null); setReasonType(""); setCustomReason(""); }} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
        <p className="mb-2">Are you sure you want to delete <span className="font-bold">{deleteTarget.name}</span> ({deleteTarget.type})?</p>

        {/* 👇 Reason options based on type */}
        <div className="text-left mt-4 space-y-2">
          {deleteTarget.type === "student" && (
            <label className="flex items-center gap-2">
              <input type="radio" name="reason" value="moveToAlumni" checked={reasonType === "moveToAlumni"} onChange={(e) => setReasonType(e.target.value)} />
              Move to Alumni
            </label>
          )}

          <label className="flex items-center gap-2">
            <input type="radio" name="reason" value="fake" checked={reasonType === "fake"} onChange={(e) => setReasonType(e.target.value)} />
            Fake / Invalid Entry
          </label>

          <label className="flex items-start gap-2">
            <input type="radio" name="reason" value="custom" checked={reasonType === "custom"} onChange={(e) => setReasonType(e.target.value)} />
            <span className="flex-1">
              Other:
              {reasonType === "custom" && (
                <textarea rows={3} value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Enter custom reason" className="w-full mt-1 p-2 border border-[#CA5C62] rounded-md text-sm" />
              )}
            </span>
          </label>
        </div>

        <div className="flex justify-center gap-4 mt-5">
          <button onClick={confirmDelete} disabled={!getFinalReason()} className="bg-[#930911] text-white px-4 py-2 rounded hover:bg-[#BA3D47]">Yes, Delete</button>
          <button onClick={() => { setDeleteTarget(null); setReasonType(""); setCustomReason(""); }} className="border border-[#930911] text-[#930911] px-4 py-2 rounded hover:bg-[#FFE9D4]/70">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Profile Image Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewImage(null)}>
            <motion.img
              src={previewImage.imgUrl}
              alt={previewImage.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90%] max-w-[90%] object-contain rounded-xl border-4 border-[#BA3D47] shadow-xl"
            />
            <button className="absolute top-6 right-6 text-white hover:text-red-300" onClick={() => setPreviewImage(null)}>
              <X size={30} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StatisticsPage;

// SummaryCard
const SummaryCard = ({ label, value, Icon, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.4 }} className="bg-[#FFE9D4]/90 rounded-2xl border border-[#CA5C62] shadow-md p-5 text-center hover:shadow-lg transition">
    <div className="flex justify-center mb-2 text-[#930911]"><Icon size={28} /></div>
    <p className="text-sm text-[#930911]/80">{label}</p>
    <p className="text-3xl font-bold text-[#930911]">{value}</p>
  </motion.div>
);

// SummaryTable
const SummaryTable = ({ title, data, onDelete, hideDelete = false, showProfile = false, onProfileClick }) => (
  <div className="bg-[#FFE9D4]/70 p-6 rounded-2xl border border-[#EEC8B9] shadow-lg mt-4">
    <h3 className="text-lg font-semibold mb-4 text-[#930911]">{title}</h3>
    <div className="overflow-auto max-h-[300px]">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-[#930911] text-white">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            {!showProfile && <th className="p-2">Department</th>}
            {!showProfile && <th className="p-2">Batch</th>}
            {showProfile && <th className="p-2">Profile</th>}
            {!hideDelete && <th className="p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const normalizedUrl = item.profileImageUrl
              ? item.profileImageUrl.startsWith("http")
                ? item.profileImageUrl
                : `http://localhost:8080${item.profileImageUrl.startsWith("/") ? "" : "/"}${item.profileImageUrl}`
              : `https://ui-avatars.com/api/?name=${item.name}&background=930911&color=fff`;

            return (
              <tr key={item.id} className="border-b border-[#EEC8B9]">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.email}</td>
                {showProfile ? (
                  <td className="p-2">
                    <img
                      src={normalizedUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full cursor-pointer border border-white shadow-md"
                      onClick={() => onProfileClick(normalizedUrl, item.name)}
                    />
                  </td>
                ) : (
                  <>
                    <td className="p-2">{item.department || "-"}</td>
                    <td className="p-2">{item.batch || "-"}</td>
                  </>
                )}
                {!hideDelete && (
                  <td className="p-2">
                    <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-800" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// FilterDropdown
const FilterDropdown = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="border border-white/30 bg-white/20 backdrop-blur-md px-3 py-2 rounded-md text-sm text-[#930911] focus:outline-none focus:ring-2 focus:ring-[#930911] shadow-inner">
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);
