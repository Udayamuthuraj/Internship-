import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSearch,
  FaEnvelope,
  FaTachometerAlt,
  FaSignOutAlt,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaUsers,
  FaLink
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getStudentProfile } from "../../services/studentService";

const POLL_INTERVAL = 5000;

const StudentHome = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [alumniList, setAlumniList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getStudentProfile();
      setProfile(data);
    };

    fetchProfile();

    const realPosts = [
      {
        id: 1,
        name: "Ramya Krishnan",
        role: "Software Engineer at Google",
        profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "June 12, 2025",
        content: "Excited to share that I’ve joined Google! 🎉💼",
        imageUrl: "https://source.unsplash.com/600x400/?office,success",
        likes: 198,
        comments: [
          { user: "Arjun", text: "Congrats Ramya! So proud of you! 🎊" },
          { user: "Sneha", text: "Well deserved 👏" },
        ],
        liked: true,
      },
      {
        id: 2,
        name: "Arjun Raj",
        role: "Data Analyst at Microsoft",
        profilePic: "https://randomuser.me/api/portraits/men/22.jpg",
        date: "June 13, 2025",
        content: "Just wrapped up a project on GenAI 🚀",
        imageUrl: "https://source.unsplash.com/600x400/?data,analytics",
        likes: 120,
        comments: [
          { user: "Divya", text: "Waiting to hear more! 🙌" },
          { user: "Karan", text: "Awesome stuff 🔥" },
        ],
        liked: false,
      },
    ];

    setPosts(realPosts);

    const alumniProfiles = [
      { id: 1, name: "Ramya", pic: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: 2, name: "Arjun", pic: "https://randomuser.me/api/portraits/men/22.jpg" },
      { id: 3, name: "Divya", pic: "https://randomuser.me/api/portraits/women/47.jpg" },
      { id: 4, name: "Karan", pic: "https://randomuser.me/api/portraits/men/45.jpg" },
    ];

    setAlumniList(alumniProfiles);
  }, []);

  const toggleLike = (pid) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === pid ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  if (!profile)
    return <div className="h-screen flex justify-center items-center text-gray-500 text-xl">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f7] text-base xl:text-lg">
      <nav className="w-24 bg-white shadow flex flex-col items-center py-6 space-y-10 xl:space-y-12">
        <Tooltip label="Profile"><button onClick={() => navigate("/student/profile")}><FaUser className="text-4xl hover:text-pink-600" /></button></Tooltip>
        <Tooltip label="Search"><button onClick={() => navigate("/student/search")}><FaSearch className="text-4xl hover:text-pink-600" /></button></Tooltip>
        <Tooltip label="Messages"><button onClick={() => navigate("/student/messages")}><FaEnvelope className="text-4xl hover:text-pink-600" /></button></Tooltip>
        <Tooltip label="Dashboard"><button onClick={() => navigate("/student/dashboard")}><FaTachometerAlt className="text-4xl hover:text-pink-600" /></button></Tooltip>
        <Tooltip label="Logout"><button onClick={handleLogout}><FaSignOutAlt className="text-4xl hover:text-red-600" /></button></Tooltip>
      </nav>

      <main className="flex-1 overflow-y-auto py-8 px-6 flex gap-8">
        <div className="w-full max-w-3xl space-y-10">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center p-6">
                <img src={post.profilePic} alt="profile" className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-gray-800 text-lg">{post.name}</p>
                  <p className="text-sm text-gray-500">{post.role} • {post.date}</p>
                </div>
              </div>
              <img src={post.imageUrl} alt="alumni-post" className="w-full object-cover max-h-[500px]" />
              <div className="flex items-center gap-8 px-6 py-4">
                <button onClick={() => toggleLike(post.id)}>
                  {post.liked ? <FaHeart className="text-red-500 text-2xl" /> : <FaRegHeart className="text-2xl" />}
                </button>
                <FaRegComment className="text-2xl" />
              </div>
              <div className="px-6 text-base text-gray-700">{post.likes} likes</div>
              <div className="px-6 text-base text-gray-900 mb-4">
                <span className="font-bold mr-2">{post.name}</span>
                {post.content}
              </div>
              <div className="px-6 pb-5 space-y-2 text-base text-gray-700">
                {post.comments.slice(0, 2).map((c, idx) => (
                  <p key={idx}><span className="font-semibold mr-2">{c.user}</span>{c.text}</p>
                ))}
                <p className="text-sm text-blue-600 cursor-pointer hover:underline">View all comments</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden xl:flex flex-col gap-8 w-96">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center mb-5">
              <img src={profile.profilePic || "https://via.placeholder.com/40"} alt="student" className="w-14 h-14 rounded-full mr-4" />
              <div>
                <p className="text-base font-bold text-gray-800">{profile.name}</p>
                <p className="text-sm text-gray-500">{profile.department} • Batch {profile.batch}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">{profile.email}</p>
            <p className="text-base font-medium text-gray-600">Connections: 34</p>
            <button className="mt-4 bg-pink-600 text-white px-4 py-2 rounded text-base hover:bg-pink-700 w-full">Edit Profile</button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Alumni You May Know</h3>
            <div className="space-y-4">
              {alumniList.map((alum) => (
                <div key={alum.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={alum.pic} alt="alumni" className="w-10 h-10 rounded-full mr-4" />
                    <p className="text-base text-gray-700">{alum.name}</p>
                  </div>
                  <button className="text-sm text-pink-600 font-medium hover:underline flex items-center gap-2">
                    <FaLink className="text-base" /> Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-10 w-96 text-center shadow-2xl">
            <p className="text-xl font-semibold mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-around mt-6">
              <button onClick={confirmLogout} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">Yes</button>
              <button onClick={cancelLogout} className="bg-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-400 transition">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Tooltip = ({ label, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm rounded px-3 py-1 whitespace-nowrap">
      {label}
    </div>
  </div>
);

export default StudentHome;
