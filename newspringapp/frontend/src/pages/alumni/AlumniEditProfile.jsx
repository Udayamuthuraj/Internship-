import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AlumniEditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentJob: '',
    batch: '',
    department: '',
    yearsOfExperience: '',
    numOfProjects: '',
    numOfAwards: '',
    contactNumber: '',
    summary: '',
    specializations: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
  });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://placehold.co/150x150/CA5C62/ffffff?text=Upload+Photo');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null); // State to hold the selected file for upload
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api";
  // Get userId from localStorage (set during login)
  const currentUserId = localStorage.getItem('userId');

  // Fetch existing user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUserId) {
        setError("User not logged in or ID not found. Please log in.");
        setLoading(false);
        navigate('/alumni/login'); // Redirect to login if no user ID
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/profile`);
        if (!response.ok) {
          // If profile doesn't exist yet, populate with sensible defaults for editing
          if (response.status === 404) {
            console.log("Profile not found, initializing form with defaults.");
            setFormData({
                username: '', email: '', currentJob: '', batch: '', department: '',
                yearsOfExperience: '', numOfProjects: '', numOfAwards: '',
                contactNumber: '', summary: '', specializations: '',
                facebookUrl: '', instagramUrl: '', linkedinUrl: ''
            });
            setProfilePhotoUrl('https://placehold.co/150x150/CA5C62/ffffff?text=Upload+Photo');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setFormData({
            username: data.username || '',
            email: data.email || '',
            currentJob: data.currentJob || '',
            batch: data.batch || '',
            department: data.department || '',
            yearsOfExperience: data.yearsOfExperience || '',
            numOfProjects: data.numOfProjects || '',
            numOfAwards: data.numOfAwards || '',
            contactNumber: data.contactNumber || '',
            summary: data.summary || '',
            specializations: data.specializations || '',
            facebookUrl: data.facebookUrl || '',
            instagramUrl: data.instagramUrl || '',
            linkedinUrl: data.linkedinUrl || '',
          });
          setProfilePhotoUrl(data.profilePhotoUrl || 'https://placehold.co/150x150/CA5C62/ffffff?text=Upload+Photo');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUserId, navigate]); // Rerun if userId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoUrl(URL.createObjectURL(file)); // For instant preview
    } else {
      setProfilePhotoFile(null);
      // Revert to current photo URL if no new file is selected, or default placeholder
      setProfilePhotoUrl(formData.profilePhotoUrl || 'https://placehold.co/150x150/CA5C62/ffffff?text=Upload+Photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!currentUserId) {
        setError("User ID missing. Cannot save profile.");
        setSubmitting(false);
        return;
    }

    const dataToSend = new FormData();
    dataToSend.append('username', formData.username);
    dataToSend.append('email', formData.email);
    dataToSend.append('currentJob', formData.currentJob);
    dataToSend.append('batch', formData.batch);
    dataToSend.append('department', formData.department);
    dataToSend.append('yearsOfExperience', formData.yearsOfExperience);
    dataToSend.append('numOfProjects', formData.numOfProjects);
    dataToSend.append('numOfAwards', formData.numOfAwards);
    dataToSend.append('contactNumber', formData.contactNumber);
    dataToSend.append('summary', formData.summary);
    dataToSend.append('specializations', formData.specializations);
    dataToSend.append('facebookUrl', formData.facebookUrl);
    dataToSend.append('instagramUrl', formData.instagramUrl);
    dataToSend.append('linkedinUrl', formData.linkedinUrl);

    if (profilePhotoFile) {
        dataToSend.append('profilePhoto', profilePhotoFile); // Append the actual file
    } else {
        // If no new file is selected, but there's an existing URL, send it
        // The backend should handle if this is empty or a URL
        dataToSend.append('profilePhotoUrl', formData.profilePhotoUrl || '');
    }


    try {
      const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/profile`, {
        method: 'PUT',
        // When sending FormData, DO NOT manually set Content-Type header.
        // The browser sets it automatically as 'multipart/form-data' with the correct boundary.
        body: dataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get raw text for better debugging
        console.error('Server error response:', errorText);
        let message = "Failed to save changes.";
        try {
            const errorJson = JSON.parse(errorText);
            message = errorJson.message || message;
        } catch (e) {
            // Not a JSON response, use generic message
        }
        throw new Error(message);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/alumni/profile'); // Redirect to profile page on success
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
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-[#E4A39D] transform transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-[#BA3D47] mb-6">Edit Your Profile</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center mb-4 font-bold">Profile updated successfully!</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <img src={profilePhotoUrl} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border-4 border-[#BA3D47] mb-4 shadow-md" />
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E4A39D] file:text-[#930911] hover:file:bg-[#EEC8B9] cursor-pointer"
              disabled={submitting}
            />
          </div>

          {/* Form Fields */}
          {/* Grouping related fields for better layout and readability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="currentJob" className="block text-sm font-medium text-gray-700 mb-1">Current Job</label>
              <input type="text" id="currentJob" name="currentJob" value={formData.currentJob} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <input type="text" id="batch" name="batch" value={formData.batch} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" id="department" name="department" value={formData.department} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" min="0" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="numOfProjects" className="block text-sm font-medium text-gray-700 mb-1">Number of Projects</label>
              <input type="number" id="numOfProjects" name="numOfProjects" value={formData.numOfProjects} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" min="0" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="numOfAwards" className="block text-sm font-medium text-gray-700 mb-1">Number of Awards</label>
              <input type="number" id="numOfAwards" name="numOfAwards" value={formData.numOfAwards} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" min="0" disabled={submitting} />
            </div>
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm min-h-[100px] resize-y" disabled={submitting} />
          </div>
          <div>
            <label htmlFor="specializations" className="block text-sm font-medium text-gray-700 mb-1">Specializations (comma-separated)</label>
            <textarea id="specializations" name="specializations" value={formData.specializations} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm min-h-[80px] resize-y" disabled={submitting} />
          </div>

          {/* Social Media Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" id="facebookUrl" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" id="instagramUrl" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input type="url" id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CA5C62] focus:border-[#CA5C62] sm:text-sm" disabled={submitting} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#BA3D47] hover:bg-[#930911] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CA5C62] transition-colors duration-200 mt-6"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlumniEditProfile;
