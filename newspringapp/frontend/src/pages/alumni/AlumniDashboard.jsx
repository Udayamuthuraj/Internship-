import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// --- LogoutConfirmationModal Component ---
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
// --- End of LogoutConfirmationModal Component ---


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
  const currentUserId = localStorage.getItem('userId');


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentUserId) {
          console.warn("No user ID found. Cannot fetch profile. Redirecting to login.");
          setLoading(false);
          navigate('/alumni/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/profile`);

        if (!response.ok) {
          if (response.status === 404) {
            console.log("User profile not found. Displaying default/blank information.");
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
          username: data.username || "Alumni User",
          email: data.email || "No email provided",
          currentJob: data.currentJob || "Job status not updated",
          profilePhotoUrl: data.profilePhotoUrl || "https://placehold.co/100x100/CA5C62/ffffff?text=Photo",
        });
      } catch (e) {
        console.error("Error fetching user profile:", e);
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


  const colors = {lightBeige: "#FFE9D4",mutedPink: "#EEC8B9",softCoral: "#E4A39D",deepRose: "#BA3D47",cardinalRed: "#930911",warmGray: "#CA5C62",gray700: "#4B5563", gray400: "#9CA3AF",white: "#FFFFFF",gray100: "#F3F4F6",gray200: "#E5E7EB",
  };

  const textShadowClass = "drop-shadow-md";

  const handleSearchBarClick = () => {
    navigate('/alumni/search');
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsLogoutModalOpen(false); // Close the modal
    navigate('/'); // Redirect to Welcome.jsx
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[${colors.lightBeige}] to-[${colors.mutedPink}] font-inter pb-12`}>

      <div className={`w-full lg:w-64 bg-gradient-to-b from-[${colors.deepRose}] to-[${colors.cardinalRed}] text-white p-6 text-center shadow-lg lg:rounded-r-2xl flex flex-col items-center`}>
        <div className={`w-28 h-28 rounded-full bg-[${colors.warmGray}] flex items-center justify-center font-bold text-lg border-4 border-[${colors.softCoral}] shadow-md mb-3 overflow-hidden`}>
          {loading ? (
            <div className="animate-pulse w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">Loading...</span>
            </div>
          ) : (
            <img
              src={userProfile.profilePhotoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/CA5C62/ffffff?text=Photo" }}
            />
          )}
        </div>
        {loading ? (
          <>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </>
        ) : (
          <>
            <h3 className={`text-xl font-bold text-[${colors.lightBeige}] mb-0.5`}>{userProfile.username}</h3>
            <p className={`text-sm italic text-[${colors.mutedPink}]`}>{userProfile.email}</p>
            {userProfile.currentJob && userProfile.currentJob !== "Not updated" && (
                <p className={`text-sm italic text-[${colors.mutedPink}] mt-1`}>
                    {userProfile.currentJob}
                </p>
            )}
          </>
        )}
        {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
      </div>

      <div className="flex-1 p-8 flex flex-col items-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://placehold.co/1200x800/FFE9D4/BA3D47?text=University+Background)` }} // Replaced local image import
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x800/FFE9D4/BA3D47?text=University+Background" }}
        >
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full">

          <div className="flex items-center bg-white p-2.5 rounded-full w-full max-w-md shadow-lg mb-10 border border-gray-200"onClick={handleSearchBarClick}>
            <span className={`text-[${colors.deepRose}] mr-2 text-lg`}>🔍</span> {/* Replaced FaSearch */}
            <input
              type="text"
              placeholder="Search for students..."
              className={`border-none outline-none text-sm flex-1 text-[${colors.gray700}] placeholder-[${colors.gray400}] bg-transparent`}
              readOnly
            />
          </div>

          <h1 className={`text-5xl font-extrabold text-[${colors.lightBeige}] text-center mb-3 leading-tight ${textShadowClass}`}>
            Welcome to Alumni Dashboard
          </h1>
          <p className={`text-3xl text-[${colors.mutedPink}] text-center mb-3 max-w-2xl ${textShadowClass}`}>
            Connect, share, and grow your network.
          </p>
          <p className={`text-xl text-[${colors.softCoral}] text-center mb-12 max-w-2xl ${textShadowClass}`}>
            Discover opportunities, forge new relationships, and stay connected with your alma mater.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-center">
            <div className={`bg-white p-6 rounded-xl shadow-md border border-[${colors.softCoral}] transform hover:scale-105 transition duration-300 ease-in-out`}>
              <span className={`text-5xl text-[${colors.deepRose}] mx-auto mb-4`}>🤝</span> {/* Replaced FaHandshake */}
              <h3 className={`text-xl font-semibold text-[${colors.cardinalRed}] mb-2`}>Build Connections</h3>
              <p className={`text-sm text-[${colors.gray700}]`}>Find and connect with fellow alumni, mentors, and students across various fields.</p>
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-md border border-[${colors.softCoral}] transform hover:scale-105 transition duration-300 ease-in-out`}>
              <span className={`text-5xl text-[${colors.deepRose}] mx-auto mb-4`}>📚</span> {/* Replaced FaBookReader */}
              <h3 className={`text-xl font-semibold text-[${colors.cardinalRed}] mb-2`}>Expand Your Knowledge</h3>
              <p className={`text-sm text-[${colors.gray700}]`}>Access resources, participate in workshops, and share your expertise with the community.</p>
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-md border border-[${colors.softCoral}] transform hover:scale-105 transition duration-300 ease-in-out`}>
              <span className={`text-5xl text-[${colors.deepRose}] mx-auto mb-4`}>📈</span> {/* Replaced FaChartLine */}
              <h3 className={`text-xl font-semibold text-[${colors.cardinalRed}] mb-2`}>Advance Your Career</h3>
              <p className={`text-sm text-[${colors.gray700}]`}>Discover job opportunities, get career advice, and mentor the next generation.</p>
            </div>
          </div>
        </div>

        <div className={`fixed bottom-0 left-0 w-full bg-[${colors.lightBeige}] flex justify-around items-center py-0.0125 shadow-lg z-30 rounded-t-xl border-t border-gray-200`}>
          <Link to="/alumni/dashboard" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 group">
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <span className={`text-[${colors.white}] text-lg`}>🏠</span> {/* Replaced FaHome */}
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Home</span>
          </Link>
          <Link to="/alumni/post" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 group">
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <span className={`text-[${colors.white}] text-lg`}>➕</span> {/* Replaced FaPlus */}
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Post</span>
          </Link>
          <Link to="/alumni/profile" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 group">
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <span className={`text-[${colors.white}] text-lg`}>👤</span> {/* Replaced FaUser */}
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Profile</span>
          </Link>
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 cursor-pointer group"
          >
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <span className={`text-[${colors.white}] text-lg`}>➡️</span> {/* Replaced FaSignOutAlt */}
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Logout</span>
          </div>
        </div>
      </div>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AlumniDashboard;
