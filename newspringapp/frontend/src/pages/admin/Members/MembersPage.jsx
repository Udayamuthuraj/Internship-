// src/pages/admin/Gallery/MembersPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { Pencil, Plus, Trash2, Eye, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import MemberFormModal from "../../../components/admin/modals/MemberFormModal";
import Pagination from "../../../components/admin/common/Pagination";
import SearchBar from "../../../components/admin/common/SearchBar";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const FilterDropdown = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-white/30 bg-white/20 backdrop-blur-md px-3 py-2 rounded-md text-sm text-[#930911] focus:outline-none focus:ring-2 focus:ring-[#930911] shadow-inner"
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMember, setViewMember] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const itemsPerPage = 6;

  useEffect(() => { fetchMembers(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, departmentFilter]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/admin/members/all`);
      setMembers(data || []);
    } catch {
      toast.error("❌ Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(() => {
    const uniq = Array.from(new Set(members.map(m => m.department).filter(Boolean)));
    return ["All", ...uniq];
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter(m => {
      const hay = `${m.name} ${m.email} ${m.department} ${m.designation}`.toLowerCase();
      return hay.includes(searchTerm.toLowerCase()) &&
        (departmentFilter === "All" || m.department === departmentFilter);
    });
  }, [members, searchTerm, departmentFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (member) => setViewMember({ ...member, deleteMode: true });
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/api/admin/members/delete/${viewMember.id}`);
      toast.success("🗑️ Member deleted");
      setViewMember(null);
      fetchMembers();
    } catch {
      toast.error("❌ Failed to delete");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#930911]">Committee Members</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <SearchBar placeholder="Search by name, email, department..." value={searchTerm} onChange={setSearchTerm} />
          <FilterDropdown value={departmentFilter} onChange={setDepartmentFilter} options={departments} />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => { setSelectedMember(null); setModalOpen(true); }}
            className="bg-[#930911] hover:bg-[#BA3D47] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow-md"
          >
            <Plus size={16} /> Add Member
          </motion.button>
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <p className="text-center text-[#930911] py-10 animate-pulse">Loading members...</p>
      ) : paginated.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No members found.</p>
      ) : (
        <motion.div
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {paginated.map(member => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFE9D4] border border-[#EEC8B9] rounded-2xl shadow-xl hover:shadow-2xl p-5 space-y-2"
              >
                {member.imageUrl && (
                  <div onClick={() => setFullImage(`${API_BASE}${member.imageUrl}`)} className="cursor-zoom-in">
                    <img src={`${API_BASE}${member.imageUrl}`} alt={member.name}
                         className="h-28 w-28 mx-auto rounded-full mb-4 border-4 border-[#BA3D47] object-cover" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-center text-[#930911]">{member.name}</h3>
                <p><span className="text-[#930911] font-semibold">Designation: </span><span className="text-black">{member.designation}</span></p>
                <p><span className="text-[#930911] font-semibold">Department: </span><span className="text-black">{member.department}</span></p>
                <p><span className="text-[#930911] font-semibold">Email: </span><span className="text-black">{member.email}</span></p>
                {member.createdAt && <p><span className="text-[#930911] font-semibold">Created on: </span><span className="text-black">{new Date(member.createdAt).toLocaleDateString("en-IN")}</span></p>}
                {member.updatedAt && <p className="text-xs text-center text-gray-500">Last updated on {new Date(member.updatedAt).toLocaleDateString("en-IN")}</p>}
                <div className="flex justify-center gap-3 p-3 border-t border-[#EEC8B9]">
                  <button onClick={() => setViewMember(member)} className="text-[#930911] hover:underline text-sm flex items-center gap-1"><Eye size={14} /> View</button>
                  <button onClick={() => { setSelectedMember(member); setModalOpen(true); }} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Pencil size={14} /> Edit</button>
                  <button onClick={() => handleDelete(member)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showStatus />}

      {/* Add/Edit Modal */}
      <MemberFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchMembers} initialData={selectedMember} />

      {/* View/Delete Modal */}
      <AnimatePresence>
        {viewMember && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="px-6 py-10 bg-[#FFE9D4]/90 backdrop-blur-xl text-[#930911] text-sm text-center rounded-xl max-w-2xl w-full border border-[#EEC8B9] shadow-2xl space-y-3 relative"
                        initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.3 }}>
              <button onClick={() => setViewMember(null)}
                      className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"><X size={20} /></button>
              {viewMember.imageUrl && <div onClick={() => setFullImage(`${API_BASE}${viewMember.imageUrl}`)} className="cursor-zoom-in">
                <img src={`${API_BASE}${viewMember.imageUrl}`} alt={viewMember.name}
                     className="h-28 w-28 mx-auto rounded-full mb-4 border-4 border-[#BA3D47] object-cover" />
              </div>}
              <h3 className="text-xl font-semibold">{viewMember.name}</h3>
              <p><span className="text-[#930911] font-semibold">Designation: </span><span className="text-black">{viewMember.designation}</span></p>
              <p><span className="text-[#930911] font-semibold">Department: </span><span className="text-black">{viewMember.department}</span></p>
              <p><span className="text-[#930911] font-semibold">Email: </span><span className="text-black">{viewMember.email}</span></p>
              {viewMember.description && <p><span className="text-[#930911] font-semibold">Description: </span><span className="text-black">{viewMember.description}</span></p>}
              {viewMember.achievements && <p><span className="text-[#930911] font-semibold">Achievements: </span><span className="text-black">{viewMember.achievements}</span></p>}
              {viewMember.createdAt && <p className="text-sm text-gray-700">Created on {new Date(viewMember.createdAt).toLocaleDateString("en-IN")}</p>}
              {viewMember.updatedAt && <p className="text-sm text-gray-700">Last updated on {new Date(viewMember.updatedAt).toLocaleDateString("en-IN")}</p>}
              {viewMember.deleteMode && (
                <div className="pt-4 flex justify-center gap-3">
                  <button onClick={confirmDelete} className="bg-[#930911] hover:bg-[#BA3D47] text-white px-4 py-2 rounded">Confirm Delete</button>
                  <button onClick={() => setViewMember(null)} className="bg-white/40 border border-[#EEC8B9] px-4 py-2 rounded">Cancel</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-image Modal */}
      <AnimatePresence>
        {fullImage && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullImage(null)}>
            <motion.img src={fullImage} alt="Full"
                        className="max-h-[90%] max-w-[90%] object-contain rounded-xl border-4 border-[#BA3D47] shadow-xl"
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} />
            <button className="absolute top-6 right-6 text-white hover:text-red-300" onClick={() => setFullImage(null)}><X size={30} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersPage;
