import React, { useState } from 'react'; // Import useState
import { Home, Plus, LogOut, Camera, Phone, Mail, Facebook, Instagram, Linkedin, Users, Send, Activity, Award, Image } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

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

const AlumniProfile = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to control the visibility of the logout confirmation modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Corrected profile image URL format
  const profileImage = "https://placehold.co/150x150/CA5C62/ffffff?text=Photo";

  // Placeholder data for alumni posts
  const alumniPosts = [
    { id: 1, imageUrl: "https://placehold.co/100x100/52B788/ffffff?text=Post+1", caption: "Successful project launch!" },
    { id: 2, imageUrl: "https://placehold.co/100x100/4D9DE0/ffffff?text=Post+2", caption: "Reflecting on my journey." },
    { id: 3, imageUrl: "https://placehold.co/100x100/F4D35E/ffffff?text=Post+3", caption: "Team outing fun!" },
    { id: 4, imageUrl: "https://placehold.co/100x100/F05D5E/ffffff?text=Post+4", caption: "New research published." },
    { id: 5, imageUrl: "https://placehold.co/100x100/5E548E/ffffff?text=Post+5", caption: "Inspiring talk today." },
    { id: 6, imageUrl: "https://placehold.co/100x100/2B2D42/ffffff?text=Post+6", caption: "Weekend vibes." },
    { id: 7, imageUrl: "https://placehold.co/100x100/A3E635/ffffff?text=Post+7", caption: "Learning new skills." },
    { id: 8, imageUrl: "https://placehold.co/100x100/8B5CF6/ffffff?text=Post+8", caption: "Celebrating milestones." },
  ];

  // Placeholder data for connections
  const connections = [
    { id: 1, name: "Arun Kumar", profile: "https://placehold.co/50x50/3498db/ffffff?text=AK" },
    { id: 2, name: "Sneha Reddy", profile: "https://placehold.co/50x50/2ecc71/ffffff?text=SR" },
    { id: 3, name: "Praveen Nair", profile: "https://placehold.co/50x50/e67e22/ffffff?text=PN" },
    { id: 4, name: "Deepika Sharma", profile: "https://placehold.co/50x50/9b59b6/ffffff?text=DS" },
    { id: 5, name: "Rahul Singh", profile: "https://placehold.co/50x50/f39c12/ffffff?text=RS" },
    { id: 6, name: "Priya Patel", profile: "https://placehold.co/50x50/1abc9c/ffffff?text=PP" },
  ];

  // Placeholder data for direct messages
  const directMessages = [
    { id: 101, sender: "Arun Kumar", lastMessage: "Hey, how are you doing? Let's catch up soon!", timestamp: "5 min ago" },
    { id: 102, sender: "Sneha Reddy", lastMessage: "Great to connect! Looking forward to collaborating.", timestamp: "1 hour ago" },
    { id: 103, sender: "Praveen Nair", lastMessage: "Regarding the project proposal...", timestamp: "Yesterday" },
    { id: 104, sender: "Deepika Sharma", lastMessage: "Can you share the notes from the last alumni meet?", timestamp: "2 days ago" },
  ];

  // Placeholder data for recent activity
  const recentActivity = [
    { id: 201, text: "Posted a new job opportunity: Software Engineer at ISRO.", time: "2 days ago" },
    { id: 202, text: "Commented on Arun Kumar's latest post.", time: "1 day ago" },
    { id: 203, text: "Updated profile information and skills.", time: "3 hours ago" },
  ];

  // Placeholder data for mentorship opportunities
  const mentorshipOpportunities = [
    { id: 301, text: "Seeking mentor for AI/ML career path.", status: "New" },
    { id: 302, text: "Offering mentorship in Software Development.", status: "Available" },
    { id: 303, text: "Joined the 'Career Guidance for Freshers' group.", status: "Active" },
  ];

  // Function to handle logout confirmation
  const handleLogout = () => {
    // In a real application, you would clear user session/token here
    console.log("Logging out from AlumniProfile...");
    setIsLogoutModalOpen(false); // Close the modal
    navigate('/'); // Redirect to Welcome.jsx
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter pb-12">
      <div className="container mx-auto mt-8 flex flex-col lg:flex-row p-4 gap-4">
        {/* Sidebar for profile information */}
        <div className="lg:w-1/4 bg-gradient-to-br from-[#BA3D47] to-[#930911] text-white p-6 rounded-xl shadow-xl flex flex-col items-center text-center">
          <div className="relative w-28 h-28 mb-4">
            <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover border-3 border-[#E4A39D] shadow-lg" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/CA5C62/ffffff?text=Photo" }} />
            <Camera className="absolute bottom-1 right-1 bg-[#CA5C62] text-white rounded-full p-1.5 cursor-pointer shadow-md hover:bg-[#BA3D47] transition duration-300" size={24} title="Change Profile Picture" />
          </div>
          <div className="text-2xl font-bold mb-1 text-[#FFE9D4]">Priya Raj</div>
          <div className="text-base italic mb-4 text-[#EEC8B9]">Research Scientist at ISRO</div>
          <div className="text-[#EEC8B9] text-xs mb-4">
            <i>Class of 2018 · B.Sc Computer Science</i>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <div className="text-center">
              <strong className="block text-xl font-bold text-[#FFE9D4]">4</strong>
              <span className="text-[#EEC8B9] text-sm">Years Exp.</span>
            </div>
            <div className="text-center">
              <strong className="block text-xl font-bold text-[#FFE9D4]">17</strong>
              <span className="text-[#EEC8B9] text-sm">Projects</span>
            </div>
            <div className="text-center">
              <strong className="block text-xl font-bold text-[#FFE9D4]">2</strong>
              <span className="text-[#EEC8B9] text-sm">Awards</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center mb-4 text-[#EEC8B9] text-sm">
            <div className="flex items-center gap-1.5">
              <Phone size={16} /> <span>+91-9876543210</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={16} /> <span>priyaraj@isro.gov.in</span>
            </div>
          </div>
          <Link to="/alumni/editprofile" className="w-full no-underline">
            <button className="w-full py-2 bg-[#CA5C62] hover:bg-[#BA3D47] text-white font-semibold rounded-lg transition duration-300 ease-in-out shadow-md transform hover:scale-105">
              Edit Profile
            </button>
          </Link>

          {/* New Section: Alumni Posts Grid */}
          <div className="w-full mt-6 bg-[#930911] p-4 rounded-lg shadow-inner">
            <div className="flex items-center justify-between mb-3 border-b border-[#CA5C62] pb-2">
              <h3 className="text-lg font-bold text-[#FFE9D4] flex items-center gap-2"><Image size={18} />My Posts</h3>
              <Link to="/alumni/myposts" className="text-xs text-[#EEC8B9] hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar for better aesthetics */}
              {alumniPosts.map(post => (
                <Link key={post.id} to={`/alumni/post/${post.id}`} className="group relative block w-full aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                  <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs text-center p-1 font-medium truncate">{post.caption}</p>
                  </div>
                </Link>
              ))}
              {alumniPosts.length === 0 && <p className="text-sm text-[#EEC8B9] text-center col-span-2">No posts yet.</p>}
            </div>
          </div>

          {/* Social Media Icons (Moved below "My Posts") */}
          <div className="flex gap-3 mt-6 justify-center">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="block">
              <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md">
                <Facebook size={20} className="text-white" />
              </div>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="block">
              <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md">
                <Instagram size={20} className="text-white" />
              </div>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="block">
              <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md">
                <Linkedin size={20} className="text-white" />
              </div>
            </a>
          </div>
        </div>

        {/* Main content area (now split into 3 vertical parts, with the 3rd split horizontally) */}
        <div className="flex-1 flex flex-col bg-white p-6 rounded-xl shadow-xl gap-4">
          {/* Connections Section (Part 1 - remains same) */}
          <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
              <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2"><Users size={20} />Connections</h2>
              <Link to="/alumni/connections" className="text-sm text-[#930911] hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-auto h-48">
              {connections.map(connection => (
                <Link key={connection.id} to={`/alumni/profile/${connection.id}`} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-100">
                  <img src={connection.profile} alt={connection.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  <span className="text-xs text-gray-700 font-medium truncate w-full text-center">{connection.name}</span>
                </Link>
              ))}
              {connections.length === 0 && <p className="text-sm text-gray-500">No connections yet.</p>}
            </div>
          </div>

          {/* Direct Messages Section (Part 2 - remains same) */}
          <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
              <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2"><Send size={20} />Direct Messages</h2>
              <Link to="/alumni/messages" className="text-sm text-[#930911] hover:underline">View All</Link>
            </div>
            <div className="overflow-auto h-full">
              {directMessages.map(message => (
                <Link key={message.id} to={`/alumni/messages/${message.id}`} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">{message.sender}</span>
                    <p className="text-xs text-gray-500 truncate w-48 md:w-auto">{message.lastMessage}</p>
                  </div>
                  <span className="text-xxs text-gray-400">{message.timestamp}</span>
                </Link>
              ))}
              {directMessages.length === 0 && <p className="text-sm text-gray-500">No direct messages yet.</p>}
            </div>
          </div>

          {/* New Third Section - Split into 2 parts */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Sub-part 1 of Third Section: Recent Activity */}
            <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4 flex-1">
              <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
                <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2"><Activity size={20} />Recent Activity</h2>
                <Link to="/alumni/activity" className="text-sm text-[#930911] hover:underline">View All</Link>
              </div>
              <div className="overflow-auto h-48"> {/* Fixed height for scrolling */}
                {recentActivity.map(item => (
                  <div key={item.id} className="p-2 rounded-md hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                    <p className="text-sm text-gray-700">{item.text}</p>
                    <span className="text-xxs text-gray-400">{item.time}</span>
                  </div>
                ))}
                {recentActivity.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
              </div>
            </div>

            {/* Sub-part 2 of Third Section: Mentorship Opportunities */}
            <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4 flex-1">
              <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
                <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2"><Award size={20} />Mentorship Opportunities</h2>
                <Link to="/alumni/mentorship" className="text-sm text-[#930911] hover:underline">View All</Link>
              </div>
              <div className="overflow-auto h-48"> {/* Fixed height for scrolling */}
                {mentorshipOpportunities.map(item => (
                  <div key={item.id} className="p-2 rounded-md hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                    <p className="text-sm text-gray-700">{item.text}</p>
                    <span className="text-xxs text-gray-400 font-semibold">{item.status}</span>
                  </div>
                ))}
                {mentorshipOpportunities.length === 0 && <p className="text-sm text-gray-500">No mentorship opportunities.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer for navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-[#FFE9D4] flex justify-around items-center py-1 shadow-lg z-10 rounded-t-xl">
        <Link to="/alumni/dashboard" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
          <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
            <Home size={18} className="text-white" />
          </div>
          <span className="text-xxs mt-1 text-[#BA3D47]">Home</span>
        </Link>
        <Link to="/alumni/post" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
          <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
            <Plus size={18} className="text-white" />
          </div>
          <span className="text-xxs mt-1 text-[#BA3D47]">Post</span>
        </Link>
        {/* Logout button: now opens modal */}
        <div
          onClick={() => setIsLogoutModalOpen(true)} // Open the modal on click
          className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 cursor-pointer"
        >
          <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
            <LogOut size={18} className="text-white" />
          </div>
          <span className="text-xxs mt-1 text-[#BA3D47]">Logout</span>
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

export default AlumniProfile;
