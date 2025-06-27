import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import alumniBg from "../../assets/Alumnibg.jpg";

const AlumniAllPosts = () => {
    const navigate = useNavigate();
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = "http://localhost:8080";
    const userId = parseInt(localStorage.getItem('uid'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Redirect if not logged in
        if (!userId || !token) {
            navigate('/alumni/login');
            return;
        }

        const fetchAllAlumniPosts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/api/users/${userId}/posts`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        throw new Error(errorJson.message || `Failed to fetch all posts. Status: ${res.status}`);
                    } catch (parseError) {
                        throw new Error(`Failed to fetch all posts. Status: ${res.status}, Response: ${errorText}`);
                    }
                }

                const data = await res.json();
                setAllPosts(Array.isArray(data) ? data : data.posts || []);
            } catch (err) {
                console.error("Error fetching all alumni posts:", err);
                setError(err.message || "Could not load all posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllAlumniPosts();
    }, [userId, token, navigate, API_BASE_URL]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter">
                <p className="text-[#BA3D47] text-xl">Loading all posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl text-center border border-red-400">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button onClick={() => navigate('/alumni/profile')} className="mt-4 px-4 py-2 bg-[#BA3D47] text-white rounded-md">Back to Profile</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cover bg-center font-inter p-4" style={{ backgroundImage: `url(${alumniBg})` }}>
            {/* Top Bar for Navigation */}
            <nav className="bg-white p-4 text-[#BA3D47] shadow-md rounded-lg mb-6 sticky top-0 z-10 flex justify-between items-center relative"> {/* Added 'relative' here for absolute positioning of elements */}
                {/* Profile Icon on Left */}
                {/* Removed 'flex items-center' from Link to let icon be purely standalone */}
                <Link to="/alumni/profile" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BA3D47] hover:text-[#930911] transition">
                    <span className="text-2xl">👤</span> {/* Smaller profile icon: changed text-3xl to text-2xl */}
                </Link>

                {/* Central Title - Moved out of the flex container for full centering */}
                <h1 className="text-3xl font-bold text-[#BA3D47] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">My Posts</h1>

                {/* Right Spacer or Right-aligned elements can go here if needed */}
                {/* For now, just a placeholder to maintain structure if you add more later */}
                <div className="w-8"></div>
            </nav>

            <div className="container mx-auto">
                {allPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allPosts.map((post) => (
                            <div key={post.postId} className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out">
                                {post.postPhotoUrl ? (
                                    <img
                                        src={`${API_BASE_URL}${post.postPhotoUrl}`}
                                        alt="Post Image"
                                        className="w-full h-48 object-cover" // Fixed height for consistency
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/e0e0e0/333333?text=Image+Not+Found"; }}
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-center p-4">
                                        No image for this post.
                                    </div>
                                )}
                                <div className="p-4">
                                    <p className="font-bold text-gray-900 mb-2 line-clamp-2">{post.postText}</p> {/* Clamp text to 2 lines */}
                                    <p className="text-xs text-gray-600 text-right">
                                        Posted on: {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    {/* You can add a "Read More" button or link here if posts are long */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-xl p-6 border border-[#E4A39D] text-center mt-8">
                        <h2 className="font-bold text-2xl text-[#930911] mb-4">No Posts Yet!</h2>
                        <p className="text-gray-700 text-lg mb-6">It looks like you haven't created any posts. Share your journey with fellow alumni!</p>
                        <Link
                            to="/alumni/post"
                            className="inline-block px-6 py-3 bg-[#BA3D47] text-white font-semibold rounded-full hover:bg-[#930911] transition-colors duration-300 shadow-md"
                        >
                            Create Your First Post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlumniAllPosts;