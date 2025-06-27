import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- LogoutConfirmationModal Component (Defined inline for this file) ---
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

const AlumniProfile = () => {
    const navigate = useNavigate();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const [userProfile, setUserProfile] = useState({
        username: "",
        email: "",
        profilePhotoUrl: "https://placehold.co/150x150/CA5C62/ffffff?text=Add+Photo",
        currentJob: "",
        batch: "",
        department: "",
        yearsOfExperience: null,
        numOfProjects: null,
        numOfAwards: null,
        contactNumber: "",
        summary: "",
        specializations: "",
        facebookUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
    });

    const [alumniPosts, setAlumniPosts] = useState([]);

    const [profileLoading, setProfileLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);
    const [postsError, setPostsError] = useState(null);

    const API_BASE_URL = "http://localhost:8080/api";
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setProfileLoading(true);
                setProfileError(null);

                if (!currentUserId) {
                    console.warn("No user ID found. Cannot fetch profile. Redirecting to login.");
                    setProfileLoading(false);
                    navigate('/alumni/login');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/profile`);

                if (!response.ok) {
                    if (response.status === 404) {
                        console.log("User profile not found. Displaying blank/default information.");
                        setUserProfile(prev => ({
                            ...prev,
                            username: "Alumni User",
                            email: "user@example.com",
                            currentJob: "Not updated",
                            batch: "N/A",
                            department: "N/A",
                            yearsOfExperience: 0,
                            numOfProjects: 0,
                            numOfAwards: 0,
                            contactNumber: "N/A",
                            summary: "No summary provided yet.",
                            specializations: "No specializations yet.",
                            profilePhotoUrl: "https://placehold.co/150x150/CA5C62/ffffff?text=Add+Photo"
                        }));
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setUserProfile({
                        username: data.username || "Alumni User",
                        email: data.email || "user@example.com",
                        profilePhotoUrl: data.profilePhotoUrl || "https://placehold.co/150x150/CA5C62/ffffff?text=Photo",
                        currentJob: data.currentJob || "Not updated",
                        batch: data.batch || "N/A",
                        department: data.department || "N/A",
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
                }
            } catch (e) {
                console.error("Error fetching user profile:", e);
                setProfileError("Failed to load profile data.");
                setUserProfile(prev => ({
                    ...prev,
                    username: "Error loading",
                    email: "Error loading",
                    currentJob: "Error loading",
                    profilePhotoUrl: "https://placehold.co/150x150/CA5C62/ffffff?text=Error"
                }));
            } finally {
                setProfileLoading(false);
            }
        };

        const fetchUserPosts = async () => {
            try {
                setPostsLoading(true);
                setPostsError(null);

                if (!currentUserId) {
                    console.warn("No user ID found. Cannot fetch posts.");
                    setPostsLoading(false);
                    return;
                }
                const response = await fetch(`${API_BASE_URL}/posts/user/${currentUserId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        console.log("No posts found for this user.");
                        setAlumniPosts([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setAlumniPosts(data);
                }
            } catch (e) {
                console.error("Error fetching user posts:", e);
                setPostsError("Failed to load posts.");
                setAlumniPosts([]);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchUserProfile();
        fetchUserPosts();
    }, [currentUserId, navigate]);

    const connections = [
        { id: 1, name: "Arun Kumar", profile: "https://placehold.co/50x50/3498db/ffffff?text=AK" },
        { id: 2, name: "Sneha Reddy", profile: "https://placehold.co/50x50/2ecc71/ffffff?text=SR" },
        { id: 3, name: "Praveen Nair", profile: "https://placehold.co/50x50/e67e22/ffffff?text=PN" },
        { id: 4, name: "Deepika Sharma", profile: "https://placehold.co/50x50/9b59b6/ffffff?text=DS" },
        { id: 5, name: "Rahul Singh", profile: "https://placehold.co/50x50/f39c12/ffffff?text=RS" },
        { id: 6, name: "Priya Patel", profile: "https://placehold.co/50x50/1abc9c/ffffff?text=PP" },
    ];

    const directMessages = [
        { id: 101, sender: "Arun Kumar", lastMessage: "Hey, how are you doing? Let's catch up soon!", timestamp: "5 min ago" },
        { id: 102, sender: "Sneha Reddy", lastMessage: "Great to connect! Looking forward to collaborating.", timestamp: "1 hour ago" },
        { id: 103, sender: "Praveen Nair", lastMessage: "Regarding the project proposal...", timestamp: "Yesterday" },
        { id: 104, sender: "Deepika Sharma", lastMessage: "Can you share the notes from the last alumni meet?", timestamp: "2 days ago" },
    ];

    const recentActivity = [
        { id: 201, text: "Updated the profile information and skills.", time: "3 hours ago" },
        { id: 202, text: "Posted a new job opportunity: Software Engineer at ISRO.", time: "2 days ago" },
        { id: 203, text: "Commented on Arun Kumar's latest post.", time: "1 day ago" },
    ];

    const mentorshipOpportunities = [
        { id: 301, text: "Seeking mentor for AI/ML career path.", status: "New" },
        { id: 302, text: "Offering mentorship in Software Development.", status: "Available" },
        { id: 303, text: "Joined the 'Career Guidance for Freshers' group.", status: "Active" },
    ];


    const handleLogout = () => {
        console.log("Logging out from AlumniProfile...");
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        setIsLogoutModalOpen(false);
        navigate('/pages/welcome');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter pb-12">
            <div className="container mx-auto mt-8 flex flex-col lg:flex-row p-4 gap-4">
                <div className="lg:w-1/4 bg-gradient-to-br from-[#BA3D47] to-[#930911] text-white p-6 rounded-xl shadow-xl flex flex-col items-center text-center">
                    <div className="relative w-28 h-28 mb-4">
                        {profileLoading ? (
                            <div className="animate-pulse w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 text-xs">Loading...</span>
                            </div>
                        ) : (
                            <img src={userProfile.profilePhotoUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-3 border-[#E4A39D] shadow-lg" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/CA5C62/ffffff?text=Photo" }} />
                        )}
                        <span className="absolute bottom-1 right-1 bg-[#CA5C62] text-white rounded-full p-1.5 cursor-pointer shadow-md hover:bg-[#BA3D47] transition duration-300">
                           📷
                        </span> {/* Replaced Lucide Camera */}
                    </div>
                    {profileLoading ? (
                        <>
                            <div className="h-7 bg-gray-300 rounded w-3/4 mb-1"></div>
                            <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                        </>
                    ) : (
                        <>
                            <div className="text-2xl font-bold mb-1 text-[#FFE9D4]">{userProfile.username || "Alumni User"}</div>
                            <div className="text-base italic mb-4 text-[#EEC8B9]">{userProfile.currentJob || "Job status not updated"}</div>
                            <div className="text-[#EEC8B9] text-xs mb-4">
                                <i>{userProfile.batch || "N/A"} · {userProfile.department || "N/A"}</i>
                            </div>
                        </>
                    )}
                    <div className="flex justify-center gap-4 mb-4">
                        <div className="text-center">
                            <strong className="block text-xl font-bold text-[#FFE9D4]">{userProfile.yearsOfExperience !== null ? userProfile.yearsOfExperience : 'N/A'}</strong>
                            <span className="text-[#EEC8B9] text-sm">Years Exp.</span>
                        </div>
                        <div className="text-center">
                            <strong className="block text-xl font-bold text-[#FFE9D4]">{userProfile.numOfProjects !== null ? userProfile.numOfProjects : 'N/A'}</strong>
                            <span className="text-[#EEC8B9] text-sm">Projects</span>
                        </div>
                        <div className="text-center">
                            <strong className="block text-xl font-bold text-[#FFE9D4]">{userProfile.numOfAwards !== null ? userProfile.numOfAwards : 'N/A'}</strong>
                            <span className="text-[#EEC8B9] text-sm">Awards</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center mb-4 text-[#EEC8B9] text-sm">
                        <div className="flex items-center gap-1.5">
                            📞 <span>{userProfile.contactNumber || "N/A"}</span> {/* Replaced Lucide Phone */}
                        </div>
                        <div className="flex items-center gap-1.5">
                            ✉️ <span>{userProfile.email || "N/A"}</span> {/* Replaced Lucide Mail */}
                        </div>
                    </div>
                    <Link to="/alumni/editprofile" className="w-full no-underline">
                        <button className="w-full py-2 bg-[#CA5C62] hover:bg-[#BA3D47] text-white font-semibold rounded-lg transition duration-300 ease-in-out shadow-md transform hover:scale-105">
                            Edit Profile
                        </button>
                    </Link>

                    <div className="w-full mt-6 bg-[#930911] p-4 rounded-lg shadow-inner text-left">
                        <h3 className="text-lg font-bold text-[#FFE9D4] mb-2 border-b border-[#CA5C62] pb-2">Summary</h3>
                        <p className="text-sm text-[#EEC8B9] whitespace-pre-wrap">{userProfile.summary || "No summary provided yet."}</p>
                    </div>

                    <div className="w-full mt-4 bg-[#930911] p-4 rounded-lg shadow-inner text-left">
                        <h3 className="text-lg font-bold text-[#FFE9D4] mb-2 border-b border-[#CA5C62] pb-2">Specializations</h3>
                        <p className="text-sm text-[#EEC8B9] whitespace-pre-wrap">{userProfile.specializations || "No specializations yet."}</p>
                    </div>

                    <div className="w-full mt-6 bg-[#930911] p-4 rounded-lg shadow-inner">
                        <div className="flex items-center justify-between mb-3 border-b border-[#CA5C62] pb-2">
                            <h3 className="text-lg font-bold text-[#FFE9D4] flex items-center gap-2">🖼️ My Posts</h3> {/* Replaced Lucide Image */}
                            <Link to="/alumni/myposts" className="text-xs text-[#EEC8B9] hover:underline">View All</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {postsLoading ? (
                                <p className="text-sm text-[#EEC8B9] text-center col-span-2">Loading posts...</p>
                            ) : postsError ? (
                                <p className="text-sm text-red-300 text-center col-span-2">{postsError}</p>
                            ) : alumniPosts.length === 0 ? (
                                <p className="text-sm text-[#EEC8B9] text-center col-span-2">No posts yet.</p>
                            ) : (
                                alumniPosts.map(post => (
                                    <Link key={post.id} to={`/alumni/post/${post.id}`} className="group relative block w-full aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                                        <img src={post.postPhotoUrl || "https://placehold.co/100x100/52B788/ffffff?text=Post"} alt={post.postText || "Alumni Post"} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/52B788/ffffff?text=Post" }} />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-white text-xs text-center p-1 font-medium truncate">{post.postText || "No caption"}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 justify-center">
                        {userProfile.facebookUrl && (
                            <a href={userProfile.facebookUrl} target="_blank" rel="noreferrer" className="block">
                                <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md">
                                    <span className="text-white">📘</span> {/* Replaced Lucide Facebook */}
                                </div>
                            </a>
                        )}
                        {userProfile.instagramUrl && (
                            <a href={userProfile.instagramUrl} target="_blank" rel="noreferrer" className="block">
                                <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md">
                                    <span className="text-white">📸</span> {/* Replaced Lucide Instagram */}
                                </div>
                            </a>
                        )}
                        {userProfile.linkedinUrl && (
                            <a href={userProfile.linkedinUrl} target="_blank" rel="noreferrer" className="block">
                                <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md">
                                    <span className="text-white">👔</span> {/* Replaced Lucide Linkedin */}
                                </div>
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white p-6 rounded-xl shadow-xl gap-4">
                    <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
                            <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2">👥 Connections</h2> {/* Replaced Lucide Users */}
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

                    <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4 flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
                            <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2">✉️ Direct Messages</h2> {/* Replaced Lucide Send */}
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

                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4 flex-1">
                            <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
                                <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2">📊 Recent Activity</h2> {/* Replaced Lucide Activity */}
                                <Link to="/alumni/activity" className="text-sm text-[#930911] hover:underline">View All</Link>
                            </div>
                            <div className="overflow-auto h-48">
                                {recentActivity.map(item => (
                                    <div key={item.id} className="p-2 rounded-md hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                                        <p className="text-sm text-gray-700">{item.text}</p>
                                        <span className="text-xxs text-gray-400">{item.time}</span>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
                            </div>
                        </div>

                        <div className="bg-[#FFE9D4] rounded-lg shadow-sm p-4 flex-1">
                            <div className="flex items-center justify-between mb-2 border-b-2 border-[#CA5C62] pb-1.5">
                                <h2 className="text-xl font-bold text-[#BA3D47] flex items-center gap-2">🏆 Mentorship Opportunities</h2> {/* Replaced Lucide Award */}
                                <Link to="/alumni/mentorship" className="text-sm text-[#930911] hover:underline">View All</Link>
                            </div>
                            <div className="overflow-auto h-48">
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

            <div className="fixed bottom-0 left-0 w-full bg-[#FFE9D4] flex justify-around items-center py-1 shadow-lg z-10 rounded-t-xl">
                <Link to="/alumni/dashboard" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
                    <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
                        <span className="text-white">🏠</span> {/* Replaced Lucide Home */}
                    </div>
                    <span className="text-xxs mt-1 text-[#BA3D47]">Home</span>
                </Link>
                <Link to="/alumni/post" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
                    <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
                        <span className="text-white">➕</span> {/* Replaced Lucide Plus */}
                    </div>
                    <span className="text-xxs mt-1 text-[#BA3D47]">Post</span>
                </Link>
                <Link to="/alumni/profile" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
                    <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
                        <span className="text-white">👤</span> {/* Replaced Lucide Users with a generic user icon */}
                    </div>
                    <span className="text-xxs mt-1 text-[#BA3D47]">Profile</span>
                </Link>
                <div
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 cursor-pointer"
                >
                    <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
                        <span className="text-white">➡️</span> {/* Replaced Lucide LogOut */}
                    </div>
                    <span className="text-xxs mt-1 text-[#BA3D47]">Logout</span>
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

export default AlumniProfile;