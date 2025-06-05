import React, { useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaHome, FaUser, FaPlus, FaSignOutAlt, FaHandshake, FaBookReader, FaChartLine } from "react-icons/fa";
import alumniBg from "../../assets/Alumnibg.jpg";

// --- LogoutConfirmationModal Component (Defined inline for this file) ---
// This component displays a confirmation dialog for logout.
function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  // If the modal is not open, don't render anything.
  if (!isOpen) return null;

  return (
    // Modal overlay for darkening the background and centering the modal.
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6 relative transform transition-all">
        {/* Modal Header/Message */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Logout</h2>
        <p className="text-gray-700 text-center mb-6">Are you sure you want to logout?</p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          {/* Cancel button */}
          <button
            onClick={onClose} // Closes the modal without logging out
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
          >
            Cancel
          </button>
          {/* Logout button */}
          <button
            onClick={onConfirm} // Triggers the logout action
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
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to control the visibility of the logout confirmation modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // --- Data Definitions ---
  const alumniProfile = {
    name: "Dr. Priya Raj",
    work: "Research Scientist at ISRO",
    profileImage: "https://placehold.co/100x100/CA5C62/ffffff?text=Photo", // Placeholder
  };

  
  // Note: For actual production, consider using a Tailwind config for custom colors/sizes
  const colors = {lightBeige: "#FFE9D4",mutedPink: "#EEC8B9",softCoral: "#E4A39D",deepRose: "#BA3D47",cardinalRed: "#930911",warmGray: "#CA5C62",gray700: "#4B5563", gray400: "#9CA3AF",white: "#FFFFFF",gray100: "#F3F4F6",gray200: "#E5E7EB",
  };

  const textShadowClass = "drop-shadow-md"; // Reused for text shadow 

  const handleSearchBarClick = () => {
    navigate('/alumni/search');
  };

  // Function to handle logout confirmation
  const handleLogout = () => {
    // In a real application, you would clear user session/token here
    console.log("Logging out...");
    setIsLogoutModalOpen(false); // Close the modal
    navigate('/'); // Redirect to Welcome.jsx
  };

  return (
    // --- Main Layout Container ---
    // Sets up a full-height column layout, transitioning to row on large screens
    // pb-12 adds padding at the bottom to prevent content from being hidden by the fixed footer
    <div className={`min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[${colors.lightBeige}] to-[${colors.mutedPink}] font-inter pb-12`}>

      {/* --- Left Sidebar (Profile Section) --- */}
      <div className={`w-full lg:w-64 bg-gradient-to-b from-[${colors.deepRose}] to-[${colors.cardinalRed}] text-white p-6 text-center shadow-lg lg:rounded-r-2xl flex flex-col items-center`}>
        {/* Profile Photo */}
        <div className={`w-28 h-28 rounded-full bg-[${colors.warmGray}] flex items-center justify-center font-bold text-lg border-4 border-[${colors.softCoral}] shadow-md mb-3 overflow-hidden`}>
          <img
            src={alumniProfile.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/CA5C62/ffffff?text=Photo" }}
          />
        </div>
        {/* Profile Name and Work */}
        <h3 className={`text-xl font-bold text-[${colors.lightBeige}] mb-0.5`}>{alumniProfile.name}</h3>
        <p className={`text-sm italic text-[${colors.mutedPink}]`}>{alumniProfile.work}</p>
      </div>
      {/* --- Right Main Content Area --- */}
      <div className="flex-1 p-8 flex flex-col items-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${alumniBg})` }}
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x800/FFE9D4/BA3D47?text=University+Background" }}
        >
          {/* Semi-transparent Overlay for Text Readability */}
          {/* Current opacity-80. Adjust 'opacity-XX' (e.g., opacity-0, opacity-5, opacity-10) to make the image more visible */}
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>

        {/* Content Wrapper for Z-index (ensures content is above background) */}
        <div className="relative z-10 flex flex-col items-center w-full">

          {/* Search Bar */}
          <div className="flex items-center bg-white p-2.5 rounded-full w-full max-w-md shadow-lg mb-10 border border-gray-200"onClick={handleSearchBarClick}>
            <FaSearch className={`text-[${colors.deepRose}] mr-2 text-lg`} />
            <input
              type="text"
              placeholder="Search for students..."
              className={`border-none outline-none text-sm flex-1 text-[${colors.gray700}] placeholder-[${colors.gray400}] bg-transparent`}
            />
          </div>

          {/* Welcome Section Text */}
          {/* Increased font sizes and added text shadow for visibility */}
          <h1 className={`text-5xl font-extrabold text-[${colors.lightBeige}] text-center mb-3 leading-tight ${textShadowClass}`}>
            Welcome to Alumni Dashboard
          </h1>
          <p className={`text-3xl text-[${colors.mutedPink}] text-center mb-3 max-w-2xl ${textShadowClass}`}>
            Connect, share, and grow your network.
          </p>
          <p className={`text-xl text-[${colors.softCoral}] text-center mb-12 max-w-2xl ${textShadowClass}`}>
            Discover opportunities, forge new relationships, and stay connected with your alma mater.
          </p>

          {/* Attractive Design Section - Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-center">
            {/* Card 1: Build Connections */}
            <div className={`bg-white p-6 rounded-xl shadow-md border border-[${colors.softCoral}] transform hover:scale-105 transition duration-300 ease-in-out`}>
              <FaHandshake className={`text-5xl text-[${colors.deepRose}] mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold text-[${colors.cardinalRed}] mb-2`}>Build Connections</h3>
              <p className={`text-sm text-[${colors.gray700}]`}>Find and connect with fellow alumni, mentors, and students across various fields.</p>
            </div>
            {/* Card 2: Expand Your Knowledge */}
            <div className={`bg-white p-6 rounded-xl shadow-md border border-[${colors.softCoral}] transform hover:scale-105 transition duration-300 ease-in-out`}>
              <FaBookReader className={`text-5xl text-[${colors.deepRose}] mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold text-[${colors.cardinalRed}] mb-2`}>Expand Your Knowledge</h3>
              <p className={`text-sm text-[${colors.gray700}]`}>Access resources, participate in workshops, and share your expertise with the community.</p>
            </div>
            {/* Card 3: Advance Your Career */}
            <div className={`bg-white p-6 rounded-xl shadow-md border border-[${colors.softCoral}] transform hover:scale-105 transition duration-300 ease-in-out`}>
              <FaChartLine className={`text-5xl text-[${colors.deepRose}] mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold text-[${colors.cardinalRed}] mb-2`}>Advance Your Career</h3>
              <p className={`text-sm text-[${colors.gray700}]`}>Discover job opportunities, get career advice, and mentor the next generation.</p>
            </div>
          </div>
        </div> {/* End of content wrapper */}

        {/* --- Fixed Footer Icons --- */}
        <div className={`fixed bottom-0 left-0 w-full bg-[${colors.lightBeige}] flex justify-around items-center py-0.0125 shadow-lg z-30 rounded-t-xl border-t border-gray-200`}>
          {/* Footer Link: Home */}
          <Link to="/alumni/dashboard" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 group">
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <FaHome className={`text-[${colors.white}] text-lg`} />
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Home</span>
          </Link>
          {/* Footer Link: Post */}
          <Link to="/alumni/post" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 group">
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <FaPlus className={`text-[${colors.white}] text-lg`} />
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Post</span>
          </Link>
          {/* Footer Link: Profile */}
          <Link to="/alumni/profile" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 group">
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <FaUser className={`text-[${colors.white}] text-lg`} />
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Profile</span>
          </Link>
          {/* Footer Link: Logout - Now opens the confirmation modal */}
          <div
            onClick={() => setIsLogoutModalOpen(true)} // Open the modal on click
            className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 cursor-pointer group"
          >
            <div className={`w-10 h-10 bg-[${colors.cardinalRed}] group-hover:bg-[${colors.deepRose}] flex items-center justify-center rounded-xl transition duration-300 ease-in-out shadow-lg group-hover:shadow-xl transform group-hover:scale-110`}>
              <FaSignOutAlt className={`text-[${colors.white}] text-lg`} />
            </div>
            <span className={`text-xxs mt-0.5 font-medium text-[${colors.deepRose}]`}>Logout</span>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} // Close modal
        onConfirm={handleLogout} // Handle logout and redirection
      />
    </div>
  );
};

export default AlumniDashboard;
