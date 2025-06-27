import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import alumniBg from "../../assets/Alumnibg.jpg"; // Ensure this path is correct or replace with a public URL

function PostModal({ isOpen, onClose, onPostSuccess }) {
  const navigate = useNavigate();

  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  const API_BASE_URL = "http://localhost:8080/api";
  const currentUserId = localStorage.getItem('userId');

  if (!isOpen) return null;

  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreviewUrl('');
    }
  };

  const handleSubmit = async () => {
    if (!postContent.trim() && !selectedImage) {
      setSubmitError('Post content or an image is required!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    if (!currentUserId) {
        setSubmitError("User not logged in. Cannot create post.");
        setIsSubmitting(false);
        return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', currentUserId);
      formData.append('postText', postContent);
      if (selectedImage) {
        formData.append('postPhoto', selectedImage);
      }

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to create post. Status: ${response.status}`);
      }

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
        onPostSuccess();
        setPostContent('');
        setSelectedImage(null);
        setImagePreviewUrl('');
        navigate('/alumni/profile');
      }, 1500);

    } catch (error) {
      console.error('Error submitting post:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative transform transition-all sm:w-11/12 md:w-3/4 lg:w-1/2">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4">Create New Post</h2>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4 resize-y min-h-[120px] text-gray-700"
          placeholder="What's on your mind, alumni?"
          value={postContent}
          onChange={handleContentChange}
          rows="5"
          disabled={isSubmitting}
        ></textarea>

        {imagePreviewUrl && (
          <div className="mb-4 relative">
            <img src={imagePreviewUrl} alt="Image Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreviewUrl('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors duration-200"
              aria-label="Remove image"
              disabled={isSubmitting}
            >
              &times; {/* Replaced Font Awesome with simple text */}
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
          disabled={isSubmitting}
        />

        {submitError && (
            <p className="text-red-500 text-sm mb-4 text-center">{submitError}</p>
        )}

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <button
            onClick={handleAddPhotoClick}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            📸 {/* Replaced Font Awesome with emoji */}
            <span>Add Photo</span>
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || (!postContent.trim() && !selectedImage)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>

        {showSuccessMessage && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center text-green-600 font-bold text-xl flex flex-col items-center">
              ✅ {/* Replaced Font Awesome with emoji */}
              Post Submitted Successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const navigate = useNavigate();

  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handlePostSuccess = () => {
    console.log("Post successful!");
  };

  const navigateToDashboard = () => {
    navigate('/alumni/dashboard'); 
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 font-sans opacity-80"
      style={{ backgroundImage: `url(https://placehold.co/1200x800/FFE9D4/BA3D47?text=University+Background)` }} // Replaced local image import
    >
      <div className="text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01] border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#BA3D47] mb-4 drop-shadow-md leading-tight">
          CREATE YOUR POST
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
          Welcome back! Share your updates, achievements, and connect with fellow alumni.
        </p>
        <button
          onClick={openPostModal}
          className="px-8 py-3 bg-[#930911] text-white font-bold rounded-full text-lg shadow-lg hover:bg-[#BA3D47] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CA5C62] focus:ring-opacity-75"
        >
          Create New Post
        </button>
      </div>

      <PostModal
        isOpen={isPostModalOpen}
        onClose={closePostModal}
        onPostSuccess={handlePostSuccess}
      />
    </div>
  );
}

