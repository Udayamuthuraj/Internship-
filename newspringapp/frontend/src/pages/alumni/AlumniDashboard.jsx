import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import alumniBg from "../../assets/Alumnibg.jpg"; 

function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6 relative transform transition-all">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Logout</h2>
        <p className="text-gray-700 text-center mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "Loading...",
    email: "Loading...",
    currentJob: "Loading...",
    profilePhotoUrl: "https://placehold.co/100x100/CA5C62/ffffff?text=Photo",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "http://localhost:8080/api";
  const currentUserId = localStorage.getItem('uid');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!currentUserId) {
          navigate('/alumni/login');
          return;
        }
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/alumni/${currentUserId}/profile`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          if (response.status === 404) {
            setUserProfile({
              username: "User",
              email: "user@example.com",
              currentJob: "Not updated",
              profilePhotoUrl: "https://placehold.co/100x100/CA5C62/ffffff?text=Add+Photo",
            });
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserProfile({
          username: data.uname || "Alumni User",
          email: data.uemail || "No email provided",
          currentJob: data.currentJob || "Job status not updated",
          profilePhotoUrl: data.profilePhotoUrl || "https://placehold.co/100x100/CA5C62/ffffff?text=Photo",
        });
      } catch (e) {
        setError("Failed to load profile data.");
        setUserProfile({
          username: "Error loading",
          email: "Error loading",
          currentJob: "Error loading",
          profilePhotoUrl: "https://placehold.co/100x100/CA5C62/ffffff?text=Error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [currentUserId, navigate]);

  const handleSearchBarClick = () => {
    navigate('/alumni/search');
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/alumni/login");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cover bg-center font-inter pb-12" style={{ backgroundImage: `url(${alumniBg})` }}>
      <div className="w-full lg:w-64 bg-gradient-to-b from-[#BA3D47] to-[#930911] text-white p-6 text-center shadow-lg lg:rounded-r-2xl flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-[#CA5C62] flex items-center justify-center font-bold text-lg border-4 border-[#E4A39D] shadow-md mb-3 overflow-hidden">
          {loading ? (
            <div className="animate-pulse w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">Loading...</span>
            </div>
          ) : (
            <img src={userProfile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
          )}
        </div>
        {loading ? (
          <>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-[#FFE9D4] mb-0.5">{userProfile.username}</h3>
            <p className="text-sm italic text-[#EEC8B9]">{userProfile.email}</p>
            {userProfile.currentJob && userProfile.currentJob !== "Not updated" && (
              <p className="text-sm italic text-[#EEC8B9] mt-1">{userProfile.currentJob}</p>
            )}
          </>
        )}
        {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
      </div>

      <div className="flex-1 p-8 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="flex items-center bg-white p-2.5 rounded-full w-full max-w-md shadow-lg mb-10 border border-gray-200" onClick={handleSearchBarClick}>
            <span className="text-[#BA3D47] mr-2 text-lg">🔍</span>
            <input type="text" placeholder="Search for students..." className="border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400 bg-transparent" readOnly />
          </div>

          <h1 className="text-5xl font-extrabold text-[#FFE9D4] text-center mb-3 leading-tight drop-shadow-md">Welcome to Alumni Dashboard</h1>
          <p className="text-3xl text-[#EEC8B9] text-center mb-3 max-w-2xl drop-shadow-md">Connect, share, and grow your network.</p>
          <p className="text-xl text-[#E4A39D] text-center mb-12 max-w-2xl drop-shadow-md">Discover opportunities, forge new relationships, and stay connected with your alma mater.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-center">
            {[
              { icon: '🤝', title: 'Build Connections', desc: 'Find and connect with fellow alumni, mentors, and students across various fields.' },
              { icon: '📚', title: 'Expand Your Knowledge', desc: 'Access resources, participate in workshops, and share your expertise with the community.' },
              { icon: '📈', title: 'Advance Your Career', desc: 'Discover job opportunities, get career advice, and mentor the next generation.' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-[#E4A39D] transform hover:scale-105 transition duration-300 ease-in-out">
                <span className="text-5xl text-[#BA3D47] mx-auto mb-4">{card.icon}</span>
                <h3 className="text-xl font-semibold text-[#930911] mb-2">{card.title}</h3>
                <p className="text-sm text-gray-700">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-[#FFE9D4] flex justify-around items-center py-1 shadow-lg z-30 rounded-t-xl border-t border-gray-200">
          {[
            { to: "/alumni/post", icon: "➕", label: "Post" },
            { to: "/alumni/profile", icon: "👤", label: "Profile" }
          ].map((item, idx) => (
            <Link key={idx} to={item.to} className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 group">
              <div className="w-10 h-10 bg-[#930911] group-hover:bg-[#BA3D47] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg transform group-hover:scale-110">
                <span className="text-white text-lg">{item.icon}</span>
              </div>
              <span className="text-xxs mt-0.5 font-medium text-[#BA3D47]">{item.label}</span>
            </Link>
          ))}

          <div onClick={() => setIsLogoutModalOpen(true)} className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 cursor-pointer group">
            <div className="w-10 h-10 bg-[#930911] group-hover:bg-[#BA3D47] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg transform group-hover:scale-110">
              <span className="text-white text-lg">➡️</span>
            </div>
            <span className="text-xxs mt-0.5 font-medium text-[#BA3D47]">Logout</span>
          </div>
        </div>
      </div>

      <LogoutConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} />
    </div>
  );
};

export default AlumniDashboard;
