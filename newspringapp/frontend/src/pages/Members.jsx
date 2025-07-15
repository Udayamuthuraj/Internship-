// src/pages/Members.jsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Home, X, Search, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/unomstu1.jpg";

const BACKEND_URL = "http://localhost:8080";
const ITEMS_PER_PAGE = 8;

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fullImage, setFullImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/members/all`);
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMembers(sorted);
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return members.filter((m) => {
      const text = `${m.name} ${m.email} ${m.department} ${m.designation}`.toLowerCase();
      return text.includes(search);
    });
  }, [members, searchTerm]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Link
        to="/"
        className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
        title="Home"
        aria-label="Go to homepage"
      >
        <Home className="text-[#930911] w-6 h-6" />
      </Link>

      <div className="bg-white/10 backdrop-blur-md min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-8 max-w-7xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center text-[#930911] mb-8">Committee Members</h2>

          {/* Search Input */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 border border-[#EEC8B9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
              <Search className="absolute right-3 top-2.5 text-[#930911]" size={18} />
            </div>
          </div>

          {/* Members Grid */}
          {loading ? (
            <p className="text-center text-[#930911] animate-pulse">Loading members...</p>
          ) : paginatedMembers.length === 0 ? (
            <p className="text-center text-gray-600">No members available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-xl bg-[#FFE9D4] border-[#EEC8B9] shadow hover:shadow-lg overflow-hidden text-sm pb-0 flex flex-col"
                >
                  <div className="flex flex-col items-center px-4 pt-4">
                    {member.imageUrl && (
                      <img
                        src={`${BACKEND_URL}${member.imageUrl}`}
                        alt={member.name}
                        className="w-24 h-24 object-cover rounded-full border-4 border-[#BA3D47] shadow mb-3"
                      />
                    )}
                    <p className="font-semibold text-[#930911] text-center">{member.name}</p>
                    <p className="text-black text-center">
                      <span className="text-[#930911] font-medium">Designation:</span> {member.designation}
                    </p>
                    <p className="text-black text-center">
                      <span className="text-[#930911] font-medium">Department:</span> {member.department}
                    </p>
                    <p className="text-black text-center mb-3">
                      <span className="text-[#930911] font-medium">Email:</span> {member.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="w-full bg-[#930911] hover:bg-[#BA3D47] text-white text-sm font-semibold py-2 rounded-b-xl transition flex items-center justify-center"
                  >
                    <Eye className="inline mr-1" size={16} /> View
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#930911] text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-[#930911] font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[#930911] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* View Modal */}
          <AnimatePresence>
            {selectedMember && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMember(null)}
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  className="px-6 py-8 bg-[#FFE9D4]/90 backdrop-blur-xl text-[#930911] text-sm text-center rounded-xl max-w-md w-full border border-[#EEC8B9] shadow-2xl space-y-3 relative"
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-2 right-3 text-[#930911]/60 hover:text-[#930911]"
                  >
                    <X size={24} />
                  </button>
                  {selectedMember.imageUrl && (
                    <img
                      src={`${BACKEND_URL}${selectedMember.imageUrl}`}
                      alt={selectedMember.name}
                      className="w-24 h-24 object-cover rounded-full border-4 border-[#BA3D47] shadow mx-auto mb-3 cursor-zoom-in"
                      onClick={() => setFullImage(`${BACKEND_URL}${selectedMember.imageUrl}`)}
                    />
                  )}
                  <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                  <p><span className="font-semibold">Designation: </span><span className="text-black">{selectedMember.designation}</span></p>
                  <p><span className="font-semibold">Department: </span><span className="text-black">{selectedMember.department}</span></p>
                  <p><span className="font-semibold">Email: </span><span className="text-black">{selectedMember.email}</span></p>
                  {selectedMember.description && (
                    <p><span className="font-semibold">Description: </span><span className="text-black">{selectedMember.description}</span></p>
                  )}
                  {selectedMember.achievements && (
                    <p><span className="font-semibold">Achievements: </span><span className="text-black">{selectedMember.achievements}</span></p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fullscreen Image Modal */}
          <AnimatePresence>
            {fullImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setFullImage(null);
                }}
              >
                <div className="relative w-[600px] max-w-full max-h-[80vh] bg-[#FFE9D4] p-4 rounded-xl shadow-xl border border-[#EEC8B9]">
                  <motion.img
                    src={fullImage}
                    alt="Full View"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="object-contain max-h-full max-w-full rounded-xl border-4 border-[#BA3D47] shadow-xl"
                  />
                  <button
                    className="absolute -top-4 -right-4 bg-[#930911] text-white rounded-full p-1 shadow-lg hover:bg-red-600 z-50"
                    onClick={() => setFullImage(null)}
                    title="Close"
                  >
                    <X size={24} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
};

export default Members;
