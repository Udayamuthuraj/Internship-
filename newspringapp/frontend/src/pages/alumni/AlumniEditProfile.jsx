import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AlumniEditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uname: '',
    uemail: '',
    currentJob: '',
    ubatch: '',
    udepartment: '',
    yearsOfExperience: 0,
    numOfProjects: 0,
    numOfAwards: 0,
    contactNumber: '',
    summary: '',
    specializations: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
  });

  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://placehold.co/150x150/CA5C62/ffffff?text=Upload+Photo');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api";
  const uid = localStorage.getItem('uid');
  const UserId = uid && uid !== "undefined" ? parseInt(uid) : null;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!UserId) {
      setError("Invalid user session. Please log in again.");
      setLoading(false);
      navigate('/alumni/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/alumni/${UserId}/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFormData({
          uname: data.uname || '',
          uemail: data.uemail || '',
          currentJob: data.currentJob || '',
          ubatch: data.ubatch || '',
          udepartment: data.udepartment || '',
          yearsOfExperience: data.yearsOfExperience || 0,
          numOfProjects: data.numOfProjects || 0,
          numOfAwards: data.numOfAwards || 0,
          contactNumber: data.contactNumber || '',
          summary: data.summary || '',
          specializations: data.specializations || '',
          facebookUrl: data.facebookUrl || '',
          instagramUrl: data.instagramUrl || '',
          linkedinUrl: data.linkedinUrl || '',
        });

        setProfilePhotoUrl(data.profilePhotoUrl || 'https://placehold.co/150x150/CA5C62/ffffff?text=Upload+Photo');
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [UserId, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value === '' ? 0 : parseInt(value)) : value
    }));
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoUrl(URL.createObjectURL(file));
    } else {
      setProfilePhotoFile(null);
      setProfilePhotoUrl('https://placehold.co/150x150/CA5C62/ffffff?text=Upload+Photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");

    if (!UserId) {
      setError("User ID missing. Cannot save profile.");
      setSubmitting(false);
      return;
    }

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value);
    });

    dataToSend.append('upassword', 'upassword');
    if (profilePhotoFile) {
      dataToSend.append('uploadedProfileImage', profilePhotoFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/alumni/${UserId}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save changes.");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/alumni/profile');
      }, 1500);

    } catch (err) {
      console.error('Error submitting profile update:', err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter">
        <p className="text-[#BA3D47] text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] p-4 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-[#E4A39D]">
        <h2 className="text-3xl font-bold text-center text-[#BA3D47] mb-6">Edit Your Profile</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center mb-4 font-bold">Profile updated successfully!</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <label className="cursor-pointer relative">
              <img src={profilePhotoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-[#CA5C62]" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {[
            { name: "uname", label: "Full Name" },
            { name: "uemail", label: "Email", type: "email" },
            { name: "currentJob", label: "Current Job" },
            { name: "ubatch", label: "Batch" },
            { name: "udepartment", label: "Department" },
            { name: "yearsOfExperience", label: "Years of Experience", type: "number" },
            { name: "numOfProjects", label: "No. of Projects", type: "number" },
            { name: "numOfAwards", label: "No. of Awards", type: "number" },
            { name: "contactNumber", label: "Contact Number" },
            { name: "summary", label: "Summary", type: "textarea" },
            { name: "specializations", label: "Specializations" },
            { name: "facebookUrl", label: "Facebook URL" },
            { name: "instagramUrl", label: "Instagram URL" },
            { name: "linkedinUrl", label: "LinkedIn URL" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-[#930911] mb-1">{field.label}</label>
              {field.type === "textarea" ? (
                <>
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    maxLength={1000}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <small className="text-xs text-gray-500">{formData.summary.length}/1000 characters</small>
                </>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#BA3D47] hover:bg-[#930911] text-white font-semibold py-2 px-4 rounded transition"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlumniEditProfile;
