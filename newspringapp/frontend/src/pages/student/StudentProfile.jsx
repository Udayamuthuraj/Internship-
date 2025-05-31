import React, { useState } from "react";
import { FaEdit, FaUpload, FaFilePdf, FaLinkedin } from "react-icons/fa";
import profilePic from "../../assets/defaultprofile.jpg"; // Add your default profile pic

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: "Nandhitha S",
    headline: "MCA Student | Full Stack Developer",
    about: "Aspiring software engineer passionate about web development and cloud computing.",
    education: "University of Madras, MCA - 2023 to 2025",
    skills: ["React", "Java", "Spring Boot", "MySQL"],
    resume: null,
  });

  const handleResumeUpload = (e) => {
    setProfile({ ...profile, resume: e.target.files[0] });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-gray-600 mt-1">{profile.headline}</p>
          <div className="flex gap-3 mt-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaLinkedin /> Connect
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="bg-white mt-6 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">About</h2>
          <FaEdit className="text-gray-500 cursor-pointer" />
        </div>
        <p className="mt-2 text-gray-600">{profile.about}</p>
      </section>

      {/* Education Section */}
      <section className="bg-white mt-6 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Education</h2>
          <FaEdit className="text-gray-500 cursor-pointer" />
        </div>
        <p className="mt-2 text-gray-600">{profile.education}</p>
      </section>

      {/* Skills Section */}
      <section className="bg-white mt-6 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Skills</h2>
          <FaEdit className="text-gray-500 cursor-pointer" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-[#930911] text-white px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Resume Upload Section */}
      <section className="bg-white mt-6 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Resume</h2>
          <label
            htmlFor="resume"
            className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaUpload /> Upload
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleResumeUpload}
          />
        </div>
        {profile.resume && (
          <div className="mt-4 flex items-center gap-3">
            <FaFilePdf className="text-red-600 text-xl" />
            <span className="text-gray-700">{profile.resume.name}</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentProfile;
