import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaUpload, FaFilePdf, FaTimes, FaCheck } from "react-icons/fa";
import defaultProfilePic from "../../assets/defaultprofile.jpg";
import { updateStudentDetails } from "../../services/studentService";

const backendUrl = "http://localhost:8080";

const StudentProfile = () => {
  const [studentInfo, setStudentInfo] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    batch: "",
  });

  const [details, setDetails] = useState({
    headline: "",
    about: "",
    education: "",
    skills: "",
    linkedinGithub: "",
    resume: null,
    resumeUrl: "",
    profilePicUrl: "",
    profilePicFileName: "",
  });

  const [isEditing, setIsEditing] = useState({
    headline: false,
    about: false,
    education: false,
    skills: false,
    linkedinGithub: false,
  });

  const [isEditingPic, setIsEditingPic] = useState(false);
  const [tempProfilePic, setTempProfilePic] = useState(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState(null); // ✅ Fixed

  const fileInputRef = useRef(null);

  const profilePicUrl = details.profilePicUrl
    ? `${backendUrl}${details.profilePicUrl}`
    : defaultProfilePic;

  const resumeUrl = details.resumeUrl
    ? `${backendUrl}${details.resumeUrl}`
    : null;

  // ✅ Preview resume if selected before upload
  useEffect(() => {
    if (details.resume) {
      const url = URL.createObjectURL(details.resume);
      setResumePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [details.resume]);

  // ✅ Load profile and details from backend using JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Missing token");
      return;
    }

    fetch(`${backendUrl}/api/student/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setStudentInfo({
          id: data.id,
          name: data.name,
          email: data.email,
          department: data.department,
          batch: data.batch,
        });
        setDetails((prev) => ({
          ...prev,
          profilePicUrl: data.profilePicUrl || "",
        }));
      })
      .catch((err) => console.error("Fetch student info error:", err));

    fetch(`${backendUrl}/api/student/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch details");
        return res.json();
      })
      .then((data) => {
        setDetails((prev) => ({
          ...prev,
          headline: data.headline || "",
          about: data.about || "",
          education: data.education || "",
          skills: data.skills || "",
          linkedinGithub: data.linkedinGithub || "",
          resumeUrl: data.resumeUrl || "",
          profilePicUrl: data.profilePicUrl || "",
        }));
      })
      .catch((err) => console.error("Fetch details error:", err));
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTempProfilePic(file);
    setIsEditingPic(true);

    const previewUrl = URL.createObjectURL(file);
    setDetails((prev) => ({
      ...prev,
      profilePicUrl: previewUrl,
    }));
  };

  const handleSaveProfilePic = async () => {
    if (!tempProfilePic) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login session expired. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("file", tempProfilePic);

      const res = await fetch(`${backendUrl}/api/student/details/profile-picture`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();

      setDetails((prev) => ({
        ...prev,
        profilePicUrl: result.profilePicUrl,
        profilePicFileName: result.profilePicUrl,
      }));

      setTempProfilePic(null);
      setIsEditingPic(false);
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Profile pic upload error:", err);
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleCancelProfilePic = () => {
    setTempProfilePic(null);
    setIsEditingPic(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleChange = (field, value) => {
    setDetails({ ...details, [field]: value });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login session expired. Please log in again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${backendUrl}/api/student/details/resume`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Resume upload failed");

      const result = await res.json();

      setDetails((prev) => ({
        ...prev,
        resume: file,
        resumeUrl: result.resumeUrl,
      }));

      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Resume upload error:", err);
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleSaveDetails = async () => {
    const payload = {
      headline: details.headline,
      about: details.about,
      education: details.education,
      skills: details.skills,
      linkedinGithub: details.linkedinGithub,
      resumeUrl: details.resumeUrl,
      profilePicturePath: details.profilePicUrl.replace(backendUrl, ""),
    };

    try {
      await updateStudentDetails(payload);
      alert("Profile updated successfully!");
      setIsEditing({
        headline: false,
        about: false,
        education: false,
        skills: false,
        linkedinGithub: false,
      });
    } catch (err) {
      console.error("Error updating details:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-[#fef9f8] to-[#fff] py-10 px-6 relative">
    {/* 🔐 Logout Button */}
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("token");
          localStorage.removeItem("studentEmail");
          window.location.href = "/";
        }
      }}
      className="absolute top-4 right-4 bg-[#930911] hover:bg-[#b31425] text-white px-4 py-1 rounded shadow z-50"
    >
      Logout
    </button>

    {/* 🔙 Back Button */}
    <button
      onClick={() => window.history.back()}
      className="absolute top-4 left-4 flex items-center gap-1 text-[#930911] hover:underline z-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      Back
    </button>

    {/* 💡 Profile Section */}
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center relative">
        {/* 👤 Profile Picture */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-white flex-shrink-0">
          <img
            src={profilePicUrl}
            alt="Student profile"
            className="w-full h-full object-cover"
          />
          {!isEditingPic && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-[#930911] hover:bg-[#b31425] text-white p-2 rounded-full shadow-lg transition"
              title="Edit Profile Picture"
            >
              <FaEdit />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            className="hidden"
          />
        </div>

        {/* ✅ Save / Cancel Profile Pic */}
        {isEditingPic && (
          <div className="flex flex-col gap-2 ml-6">
            <button
              onClick={handleSaveProfilePic}
              className="flex items-center gap-2 bg-[#930911] hover:bg-[#b31425] text-white px-4 py-2 rounded shadow-md transition"
            >
              <FaCheck /> Save Picture
            </button>
            <button
              onClick={handleCancelProfilePic}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded shadow-md transition"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        )}

        {/* ℹ️ Student Info */}
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{studentInfo.name}</h1>
          <p className="text-gray-600">{studentInfo.email}</p>
          <p className="text-gray-600">Department: {studentInfo.department}</p>
          <p className="text-gray-600">Batch: {studentInfo.batch}</p>
        </div>
      </div>

      {/* 📝 Editable Fields */}
      <div className="space-y-6 mt-8">
        {[
          { label: "Headline", field: "headline" },
          { label: "About", field: "about", type: "textarea" },
          { label: "Education", field: "education" },
          { label: "Skills", field: "skills" },
          { label: "LinkedIn / GitHub", field: "linkedinGithub" },
        ].map(({ label, field, type }) => (
          <section key={field} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
              <FaEdit
                onClick={() => handleEditToggle(field)}
                className="text-gray-500 cursor-pointer"
                title={`Edit ${label}`}
              />
            </div>
            {isEditing[field] ? (
              <div className="flex flex-col gap-2">
                {type === "textarea" ? (
                  <textarea
                    value={details[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    rows={3}
                    className="border px-3 py-2 rounded w-full"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    type="text"
                    value={details[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditToggle(field)}
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSaveDetails();
                      handleEditToggle(field);
                    }}
                    className="bg-[#930911] text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : field === "skills" && details.skills ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {details.skills.split(",").filter(skill => skill.trim() !== "").map((skill, i) => (
                  <span
                    key={i}
                    className="bg-[#930911] text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                {details[field] || `Click edit to add ${label.toLowerCase()}`}
              </p>
            )}
          </section>
        ))}

        {/* 📎 Resume Section */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Resume</h2>
          <label
            htmlFor="resume"
            className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <FaUpload /> Upload Resume
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleResumeUpload}
          />

          {/* Preview */}
          {details.resumeUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Resume Preview</h3>
              <div className="w-full h-[500px] border rounded-lg shadow">
                <iframe
                  src={`${backendUrl}${details.resumeUrl}`}
                  title="Resume Preview"
                  className="w-full h-full border border-gray-300"
                  frameBorder="0"
                />
              </div>
            </div>
          )}

          {/* Download */}
          {details.resumeUrl && (
            <div className="mt-3 flex items-center gap-2">
              <FaFilePdf className="text-red-600 text-xl" />
              <a
                href={`${backendUrl}${details.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#930911] underline"
              >
                Download Resume
              </a>
            </div>
          )}
        </section>

        {/* ✅ Save All Button */}
        <div className="text-center">
          <button
            onClick={handleSaveDetails}
            className="bg-[#930911] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  </div>
);
};
export default StudentProfile;