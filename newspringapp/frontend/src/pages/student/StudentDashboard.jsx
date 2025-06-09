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
  const [studentName, setStudentName] = useState('Abinaya'); // You can replace this with dynamic data later
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-black/30 space-y-6">
        {/* Greeting Message - Outside the card, large and bold */}
        <h2 className="text-6xl font-extrabold text-white drop-shadow-md mt-8 mb-4">
          {greeting}, {studentName}! 
        </h2>


        {/* Welcome Card */}
        <div className="max-w-3xl w-full p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl text-center">
          <h1 className="text-4xl font-extrabold text-white mb-6">Welcome to CSITTA</h1>
          <p className="text-lg leading-relaxed text-gray-100">
            🚀 Here you can:
            <br />📌 See posts made by alumni
            <br />🤝 Connect with alumni from various domains and years
            <br />📝 Edit your profile and upload your resume
            <br />📅 Register for events & webinars
            <br />📬 Get important announcements
          </p>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
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
