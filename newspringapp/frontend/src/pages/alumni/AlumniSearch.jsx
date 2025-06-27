import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Home, Plus, User, LogOut } from 'lucide-react';

function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Logout</h2>
        <p className="text-gray-700 text-center mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700">Logout</button>
        </div>
      </div>
    </div>
  );
}

const AlumniSearch = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectedIds, setConnectedIds] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All Depts');
  const [selectedBatch, setSelectedBatch] = useState('All Batch');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const alumniId = localStorage.getItem('uid');

  useEffect(() => {
    fetch('http://localhost:8080/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error('Failed to load students', err));
  }, []);

  const handleConnect = async (studentId) => {
    try {
      const response = await fetch('http://localhost:8080/api/alumni/connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId1: alumniId,
          userId2: studentId,
          status: 'connected'
        })
      });
      if (response.ok) {
        setConnectedIds(prev => [...prev, studentId]);
      } else {
        console.error('Failed to connect');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMessage = (studentId) => {
    navigate(`/alumni/chat/${studentId}`);
  };

  const handleProfileClick = (studentId) => {
    navigate(`/alumni/student-profile/${studentId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLogoutModalOpen(false);
    navigate('/pages/welcome');
  };

  const departments = ['All Depts', ...new Set(students.map(s => s.department))];
  const batches = ['All Batch', ...new Set(students.map(s => s.batch))].sort();

  const filteredStudents = students.filter(student => {
    const matchesName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All Depts' || student.department === selectedDepartment;
    const matchesBatch = selectedBatch === 'All Batch' || student.batch === selectedBatch;
    return matchesName && matchesDept && matchesBatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter pb-12">
      <div className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold text-[#BA3D47] text-center mb-6">Search Students</h1>

        <div className="bg-white p-6 rounded-xl shadow-xl mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} className="px-4 py-2 rounded-lg border">
            {departments.map(dept => <option key={dept}>{dept}</option>)}
          </select>

          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="px-4 py-2 rounded-lg border">
            {batches.map(batch => <option key={batch}>{batch}</option>)}
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-[#BA3D47] mb-4 border-b pb-2">Results</h2>
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map(student => (
                <div key={student.id} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <img
                    src={student.profileImage || "https://placehold.co/50x50/930911/ffffff?text=ST"}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#CA5C62] cursor-pointer"
                    onClick={() => handleProfileClick(student.id)}
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => handleProfileClick(student.id)}>
                    <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.department} - {student.batch}</p>
                  </div>
                  {connectedIds.includes(student.id) ? (
                    <button onClick={() => handleMessage(student.id)} className="ml-4 px-3 py-1 bg-green-600 text-white rounded-full">Message</button>
                  ) : (
                    <button onClick={() => handleConnect(student.id)} className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-full">Connect</button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No students found matching your criteria.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-[#FFE9D4] flex justify-around items-center py-2 shadow-lg z-10">
        <Link to="/alumni/dashboard"><Home className="text-[#930911]" /></Link>
        <Link to="/alumni/post"><Plus className="text-[#930911]" /></Link>
        <Link to="/alumni/profile"><User className="text-[#930911]" /></Link>
        <div onClick={() => setIsLogoutModalOpen(true)}><LogOut className="text-[#930911] cursor-pointer" /></div>
      </div>

      {/* Logout Confirmation */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AlumniSearch;
