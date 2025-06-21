import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaEnvelope,
} from 'react-icons/fa';
import backgroundImg from '../../assets/unomstu1.jpg';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const name = localStorage.getItem('studentName');
    console.log('Loaded student name from localStorage:', name); // ✅ Debug log
    if (name) setStudentName(name);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.clear(); // ✅ clear token/name on logout
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col text-white font-sans bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Header */}
      <header className="bg-black/70 text-center text-3xl font-bold py-6 shadow-md">
        Student Dashboard – University of Madras
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 bg-black/30 w-full">
        {/* Greeting */}
        {greeting && (
          <h2 className="text-5xl font-bold text-center mt-10 mb-6 drop-shadow-md text-white">
            {greeting}, {studentName || 'Student'}!
          </h2>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl w-full mt-4">
          <FeatureCard
            icon={<FaHome className="text-4xl text-orange-400 drop-shadow-[0_0_10px_#fb923c]" />}
            title="Alumni Posts"
            description="Browse updates, job openings, and memories shared by alumni."
          />
          <FeatureCard
            icon={<FaEnvelope className="text-4xl text-purple-400 drop-shadow-[0_0_10px_#c084fc]" />}
            title="Connect"
            description="Connect with your alumni network."
          />
          <FeatureCard
            icon={<FaSearch className="text-4xl text-blue-400 drop-shadow-[0_0_10px_#60a5fa]" />}
            title="Search"
            description="Find and network with alumni."
          />
          <FeatureCard
            icon={<FaUserCircle className="text-4xl text-green-400 drop-shadow-[0_0_10px_#4ade80]" />}
            title="Profile"
            description="Edit info, upload resume, and update your profile."
          />
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-8 w-80 text-center shadow-xl">
            <p className="text-lg font-semibold mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-around mt-6">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gray-600 z-40">
        <div className="flex justify-around items-center py-3">
          <NavItem icon={<FaHome />} label="Home" onClick={() => navigate('/student/home')} />
          <NavItem icon={<FaSearch />} label="Search" onClick={() => navigate('/student/search')} />
          <NavItem icon={<FaEnvelope />} label="Messages" onClick={() => navigate('/student/messages')} />
          <NavItem icon={<FaUserCircle />} label="Profile" onClick={() => navigate('/student/profile')} />
          <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
        </div>
      </footer>
    </div>
  );
};

// Reusable Feature Card component
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white/10 border border-gray-400/40 backdrop-blur-lg rounded-3xl text-white shadow-lg hover:scale-105 transition duration-300">
    <div className="flex items-center space-x-4 mb-4">
      {icon}
      <h3 className="text-3xl font-bold">{title}</h3>
    </div>
    <p className="text-md text-gray-200">{description}</p>
  </div>
);

// Reusable Footer Nav item
const NavItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center text-white hover:text-rose-400 transition duration-300 group"
  >
    <div className="text-xl mb-1 group-hover:scale-110 group-hover:drop-shadow-md">{icon}</div>
    <div className="text-xs font-medium">{label}</div>
  </button>
);

export default StudentDashboard;
