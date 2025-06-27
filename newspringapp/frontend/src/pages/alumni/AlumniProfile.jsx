import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Import social media icons
import { FiCamera } from 'react-icons/fi'; // Import camera icon for background change
import universityBg from '../../assets/unomstu1.jpg'; // Assuming this path is correct for your background image

// Logout confirmation modal component
function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null; // Don't render if not open
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Logout</h2>
                <p className="text-gray-700 text-center mb-6">Are you sure you want to logout?</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

const AlumniProfile = () => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const API_BASE_URL = "http://localhost:8080"; // Base URL for your backend API, adjusted to root

    // Retrieve userId from local storage, convert to integer, or set to null
    const raw = localStorage.getItem("uid");
    const userId = raw && raw !== "undefined" && !isNaN(raw) ? parseInt(raw) : null;

    // State for user profile data
    const [userProfile, setUserProfile] = useState({
        username: "",
        email: "",
        profilePhotoUrl: "https://placehold.co/150x150/CA5C62/ffffff?text=Add+Photo", // Default placeholder image
        currentJob: "",
        batch: "",
        department: "",
        yearsOfExperience: 0,
        numOfProjects: 0,
        numOfAwards: 0,
        contactNumber: "",
        summary: "",
        specializations: "",
        facebookUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
    });

    const [connections, setConnections] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activities, setActivities] = useState([]); // This will serve as the "Recent Activities" / "Posts" section
    const [alumniPosts, setAlumniPosts] = useState([]); // State specifically for alumni's own posts

    const [showAllPostsOnProfile, setShowAllPostsOnProfile] = useState(false);
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [displayedBackgroundImage, setDisplayedBackgroundImage] = useState(universityBg); 
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("uid");      // Clear user ID
        localStorage.removeItem("username"); // Clear username
        localStorage.removeItem("token");    // Clear JWT token
        navigate("/alumni/login");           // Redirect to login page
    };

    const handleBackgroundImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackgroundImageFile(file);
            setDisplayedBackgroundImage(URL.createObjectURL(file)); 
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token"); 
        if (!userId) {
            handleLogout();
            return;
        }
        const fetchUserProfile = async () => {
            try {
                setProfileLoading(true); // Set loading state
                const res = await fetch(`${API_BASE_URL}/api/alumni/${userId}/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}` // Include Authorization header
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json(); // Attempt to parse error message from response
                    throw new Error(errorData.message || "Failed to load profile");
                }
                const data = await res.json(); // Parse successful response
                // Update userProfile state with fetched data, providing fallbacks for null/undefined values
                setUserProfile({
                    username: data.uname || "Alumni User",
                    email: data.uemail || "user@example.com",
                    profilePhotoUrl: data.profilePhotoUrl || "https://placehold.co/150x150/CA5C62/ffffff?text=Photo",
                    currentJob: data.currentJob || "Not updated",
                    batch: data.ubatch || "N/A",
                    department: data.udepartment || "N/A",
                    yearsOfExperience: data.yearsOfExperience || 0,
                    numOfProjects: data.numOfProjects || 0,
                    numOfAwards: data.numOfAwards || 0,
                    contactNumber: data.contactNumber || "N/A",
                    summary: data.summary || "No summary provided yet.",
                    specializations: data.specializations || "No specializations yet.",
                    facebookUrl: data.facebookUrl || "",
                    instagramUrl: data.instagramUrl || "",
                    linkedinUrl: data.linkedinUrl || "",
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
                setProfileError("Failed to load profile: " + err.message); // Set error message
            } finally {
                setProfileLoading(false); // End loading state
            }
        };

        // Function to fetch user's connections
        const fetchConnections = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/alumni/connection/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) console.warn("Failed to fetch connections, status:", res.status);
                const data = await res.json();
                setConnections(data || []);
            } catch (err) { console.error("Failed to load connections:", err); }
        };

        // Function to fetch user's messages
        const fetchMessages = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/${userId}/messages`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) console.warn("Failed to fetch messages, status:", res.status);
                const data = await res.json();
                setMessages(data || []);
            } catch (err) { console.error("Failed to load messages:", err); }
        };

        // Function to fetch user's general activities
        const fetchActivities = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/alumni/activity/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) console.warn("Failed to fetch activities, status:", res.status);
                const data = await res.json();
                setActivities(data || []);
            } catch (err) { console.error("Failed to load activities:", err); }
        };

        // Function to fetch alumni's own posts
        const fetchAlumniPosts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/${userId}/posts`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!res.ok) {
                    console.warn("Failed to fetch alumni posts, status:", res.status);
                    const errorText = await res.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        console.error("Error fetching alumni posts:", errorJson.message || errorJson);
                    } catch (parseError) {
                        console.error("Error fetching alumni posts: Non-JSON response:", errorText);
                    }
                    return; // Exit if not successful
                }

                const data = await res.json();
                setAlumniPosts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load alumni posts (network error or unexpected data):", err);
                setAlumniPosts([]); // Reset to empty array on error
            }
        };

        // Call all necessary fetch functions
        fetchUserProfile();
        fetchConnections();
        fetchMessages();
        fetchActivities();
        fetchAlumniPosts(); // Call the new fetch function for alumni's own posts
    }, [userId, navigate, API_BASE_URL]); // Dependencies for useEffect

    // Determine which posts to display based on showAllPostsOnProfile state
    const displayedPosts = showAllPostsOnProfile ? alumniPosts : alumniPosts.slice(0, 2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter">
            {/* Top Navigation Bar */}
            <nav className="bg-[#BA3D47] p-4 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/alumni/dashboard" className="text-2xl font-bold tracking-wide">AlumniConnect</Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/alumni/dashboard" className="hover:text-[#FFE9D4] transition font-medium text-base">Home</Link>
                        <Link to="/events" className="hover:text-[#FFE9D4] transition font-medium text-base">Events</Link>
                        <Link to="/alumni/messages" className="hover:text-[#FFE9D4] transition font-medium text-base">Messages</Link>
                        <Link to="/alumni/posts" className="hover:text-[#FFE9D4] transition font-semibold text-base">Posts</Link>
                        <button onClick={() => setIsLogoutModalOpen(true)} className="hover:text-[#FFE9D4] transition font-medium text-base">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Conditional rendering for loading, error, or profile content */}
            {profileLoading ? (
                <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                    <p className="text-[#BA3D47] text-xl">Loading profile...</p>
                </div>
            ) : profileError ? (
                <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl text-center border border-red-400">
                        <p className="text-red-600 text-lg">{profileError}</p>
                        <button onClick={() => navigate('/alumni/login')} className="mt-4 px-4 py-2 bg-[#BA3D47] text-white rounded-md">Login Again</button>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto mt-0 pb-12">
                    {/* Hero Section for profile banner and basic info */}
                    <div className="relative bg-cover bg-center h-64 rounded-b-xl shadow-lg flex items-end justify-center pb-8"
                           style={{ backgroundImage: `url(${displayedBackgroundImage})` }}>
                        <div className="absolute inset-0 bg-black opacity-40 rounded-b-xl"></div>
                        
                        {/* Camera icon for changing background */}
                        <label className="absolute top-4 right-4 z-20 cursor-pointer p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBackgroundImageChange}
                                className="hidden"
                            />
                            <FiCamera size={24} className="text-white" />
                        </label>

                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white pt-8">
                            <img
                                src={`${API_BASE_URL}${userProfile.profilePhotoUrl}`}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg -mt-16"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/CA5C62/ffffff?text=Photo"; }}
                            />
                            <h2 className="text-3xl font-bold mt-2">{userProfile.username}</h2>
                            <p className="text-lg italic mt-1">{userProfile.currentJob}</p>
                            <p className="text-sm mt-0.5">{userProfile.batch} &bull; {userProfile.department}</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-4">
                        {/* Left Column: Personal Details & Edit Profile & My Posts */}
                        <div className="md:col-span-1 space-y-6">
                           
                            {/* My Posts Section */}
                            <div className="bg-white shadow-lg rounded-xl p-6 border border-[#E4A39D]">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-xl text-[#930911]">My Posts ({alumniPosts.length})</h3>
                                    <Link to="/alumni/post" className="px-4 py-2 bg-[#BA3D47] text-white rounded-full text-sm font-semibold hover:bg-[#930911] transition-colors">
                                        New Post
                                    </Link>
                                </div>
                                {alumniPosts.length > 0 ? (
                                    <ul className="text-sm text-gray-700 space-y-3">
                                        {/* Render posts based on showAllPostsOnProfile state */}
                                        {displayedPosts.map((post) => (
                                            <li key={post.postId} className="flex items-start bg-gray-50 p-3 rounded-md border border-gray-100 hover:shadow-sm transition">
                                                <span className="text-[#CA5C62] mr-2 text-lg leading-none">•</span>
                                                <div>
                                                    <p className="font-medium text-gray-800 break-words whitespace-pre-wrap">{post.postText}</p>
                                                    {post.postPhotoUrl && (
                                                         <img
                                                            src={`${API_BASE_URL}${post.postPhotoUrl}`}
                                                            alt="Post Image"
                                                            className="mt-2 w-full h-auto max-h-48 object-cover rounded shadow"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x100/eeeeee/333333?text=Image+Load+Error"; }}
                                                        />
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleString()}</p>
                                                </div>
                                            </li>
                                        ))}
                                        {/* Show "View All" button if there are more than 2 posts AND not all posts are currently shown */}
                                        {alumniPosts.length > 2 && !showAllPostsOnProfile && (
                                            <li className="text-center mt-2">
                                                {/* Button to show all posts on the same page */}
                                                <button
                                                    onClick={() => setShowAllPostsOnProfile(true)}
                                                    className="text-[#BA3D47] hover:text-[#930911] text-sm font-semibold transition px-4 py-2 rounded-full border border-[#BA3D47]"
                                                >
                                                    View All My Posts
                                                </button>
                                            </li>
                                        )}
                                        {/* OPTIONAL: Show "Show Less" button if all posts are currently shown and there are more than 2 */}
                                        {alumniPosts.length > 2 && showAllPostsOnProfile && (
                                            <li className="text-center mt-2">
                                                <button
                                                    onClick={() => setShowAllPostsOnProfile(false)}
                                                    className="text-[#BA3D47] hover:text-[#930911] text-sm font-semibold transition px-4 py-2 rounded-full border border-[#BA3D47]"
                                                >
                                                    Show Less
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">No posts found yet. Start by creating one!</p>
                                )}
                            </div>
                            {/* END NEW: Alumni Posts Section */}

                            {/* START COMBINED PERSONAL DETAILS SECTION */}
                            <div className="bg-white shadow-lg rounded-lg p-6 border border-[#E4A39D] space-y-6">
                                {/* About Me Card */}
                                <div>
                                    <h3 className="font-bold text-xl text-[#930911] mb-3">About Me</h3>
                                    <p className="text-gray-700 leading-relaxed">{userProfile.summary}</p>
                                </div>

                                {/* Professional Metrics Card */}
                                <div>
                                    <h3 className="font-bold text-xl text-[#930911] mb-4">Professional Metrics</h3>
                                    <div className="space-y-3">
                                        <p className="flex justify-between items-center text-gray-700">
                                            <span className="font-semibold">Years of Experience:</span>
                                            <span className="text-[#BA3D47] font-bold">{userProfile.yearsOfExperience}</span>
                                        </p>
                                        <p className="flex justify-between items-center text-gray-700">
                                            <span className="font-semibold">Projects Completed:</span>
                                            <span className="text-[#BA3D47] font-bold">{userProfile.numOfProjects}</span>
                                        </p>
                                        <p className="flex justify-between items-center text-gray-700">
                                            <span className="font-semibold">Awards Won:</span>
                                            <span className="text-[#BA3D47] font-bold">{userProfile.numOfAwards}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Specializations Card */}
                                <div>
                                    <h3 className="font-bold text-xl text-[#930911] mb-3">Specializations</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {userProfile.specializations.split(',').filter(s => s.trim() !== '').map((spec, i) => (
                                            <span key={i} className="bg-[#EEC8B9] text-[#930911] text-sm px-3 py-1 rounded-full font-medium">
                                                {spec.trim()}
                                            </span>
                                        ))}
                                        {userProfile.specializations === "No specializations yet." && (
                                             <span className="text-sm text-gray-500">No specializations provided yet.</span>
                                        )}
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
                                {/* Contact Information Card */}
                                <div>
                                    <h3 className="font-bold text-xl text-[#930911] mb-4">Contact Information</h3>
                                    <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">Email:</span> {userProfile.email}
                                    </p>
                                    <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">Phone:</span> {userProfile.contactNumber}
                                    </p>
                                    <div className="flex space-x-4 mt-4 justify-center">
                                        {userProfile.facebookUrl && (
                                            <a href={userProfile.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-[#3b5998] hover:scale-110 transition-transform">
                                                <FaFacebookF size={24} />
                                            </a>
                                        )}
                                        {userProfile.instagramUrl && (
                                            <a href={userProfile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:scale-110 transition-transform">
                                                <FaInstagram size={24} />
                                            </a>
                                        )}
                                        {userProfile.linkedinUrl && (
                                            <a href={userProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:scale-110 transition-transform">
                                                <FaLinkedinIn size={24} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* END COMBINED PERSONAL DETAILS SECTION */}
                            
                            {/* Edit Profile Button - Moved here as requested (under social icons in combined section) */}
                            <div className="text-center">
                                <Link to="/alumni/editprofile">
                                    <button className="px-6 py-3 bg-[#CA5C62] hover:bg-[#BA3D47] text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105 w-full">
                                        Edit Profile
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Connections, Direct Messages, Recent Activities */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Connections Card */}
                            <div className="bg-white shadow-lg rounded-lg p-6 border border-[#E4A39D]">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-xl text-[#930911]">Connections ({connections.length})</h3>
                                    <Link to="/alumni/connections" className="text-[#BA3D47] hover:text-[#930911] text-sm font-semibold transition">
                                        View All
                                    </Link>
                                </div>
                                {connections.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {connections.slice(0, 6).map((c, i) => ( // Show a few, then view all
                                            <div key={i} className="bg-[#FFE9D4] text-[#BA3D47] text-center rounded-md p-3 shadow-sm text-sm font-semibold truncate hover:scale-105 transition-transform">
                                                {c.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No connections found.</p>
                                )}
                            </div>

                            {/* Direct Messages Card */}
                            <div className="bg-white shadow-lg rounded-lg p-6 border border-[#E4A39D]">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-xl text-[#930911]">Direct Messages</h3>
                                    <Link to="/alumni/messages" className="text-[#BA3D47] hover:text-[#930911] text-sm font-semibold transition">
                                        View All
                                    </Link>
                                </div>
                                {messages.length > 0 ? (
                                    <ul className="text-sm text-gray-700 space-y-3">
                                        {messages.slice(0, 3).map((msg, i) => ( // Show a few, then view all
                                            <li key={i} className="flex items-start bg-gray-50 p-3 rounded-md border border-gray-100">
                                                <span className="text-[#CA5C62] mr-2 text-lg leading-none">•</span>
                                                <p className="truncate w-full font-medium">{msg.content}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">No new messages.</p>
                                )}
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
                            {/* Recent Activities (Posts) Section - Renamed and refined */}
                            <div className="bg-white shadow-lg rounded-lg p-6 border border-[#E4A39D]">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-xl text-[#930911]">Recent Activities</h3>
                                    <Link to="/alumni/activities" className="text-[#BA3D47] hover:text-[#930911] text-sm font-semibold transition">
                                        View All
                                    </Link>
                                </div>
                                {activities.length > 0 ? (
                                    <ul className="text-sm text-gray-700 space-y-3">
                                        {activities.slice(0, 5).map((act, i) => ( // Show a few, then view all
                                            <li key={i} className="flex items-start bg-gray-50 p-3 rounded-md border border-gray-100">
                                                <span className="text-[#CA5C62] mr-2 text-lg leading-none">•</span>
                                                <div>
                                                    <p className="font-medium">{act.activity_details}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{new Date(act.created_at).toLocaleString()}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">No recent activities to display.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
