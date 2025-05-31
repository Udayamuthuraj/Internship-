import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import alumniBg from "../../assets/Alumnibg.jpg"; // Import the background image

// PostModal Component: Handles the display and logic for creating a new post.
function PostModal({ isOpen, onClose, onPostSuccess }) {
  // Initialize navigate hook for programmatic redirection
  const navigate = useNavigate();

  // State to manage the content of the post (text input)
  const [postContent, setPostContent] = useState('');
  // State to manage the selected image file
  const [selectedImage, setSelectedImage] = useState(null);
  // State to manage the URL of the selected image (for preview)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  // State to manage the visibility of a success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Ref for the file input element to programmatically trigger click
  const fileInputRef = useRef(null);

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  // Handles changes in the post content textarea
  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };

  // Handles file selection for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create a URL for image preview
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreviewUrl('');
    }
  };

  // Handles the submission of the post
  const handleSubmit = async () => {
    // Basic validation: ensure there's content or an image
    if (!postContent.trim() && !selectedImage) {
      console.error('Post content or an image is required!');
      // In a real app, you'd show a user-friendly error message in the UI
      return;
    }

    // Simulate API call to post data
    console.log('Submitting post:', { postContent, selectedImage });

    // Simulate a successful post for this example
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    setShowSuccessMessage(true); // Show success message

    setTimeout(() => {
      setShowSuccessMessage(false);
      onClose(); // Close modal after success
      onPostSuccess(); // Trigger parent's success callback (if any)
      // Reset form fields
      setPostContent('');
      setSelectedImage(null);
      setImagePreviewUrl('');
      // Redirect to AlumniDashboard.jsx after successful post
      navigate('/alumni/profile'); // <--- ADDED REDIRECTION HERE
    }, 1500); // Hide message and close modal after 1.5 seconds
  };

  // Trigger file input click when the "Add Photo" button is clicked
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  return (
    // Modal overlay for darkening the background and handling outside clicks
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative transform transition-all sm:w-11/12 md:w-3/4 lg:w-1/2">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4">Create New Post</h2>

        {/* Post content textarea */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4 resize-y min-h-[120px] text-gray-700"
          placeholder="What's on your mind, alumni?"
          value={postContent}
          onChange={handleContentChange}
          rows="5"
        ></textarea>

        {/* Image preview and upload section */}
        {imagePreviewUrl && (
          <div className="mb-4 relative">
            <img src={imagePreviewUrl} alt="Image Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreviewUrl('');
                if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors duration-200"
              aria-label="Remove image"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Action buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          {/* Add Photo button */}
          <button
            onClick={handleAddPhotoClick}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <i className="fas fa-image"></i>
            <span>Add Photo</span>
          </button>

          {/* Post button */}
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!postContent.trim() && !selectedImage} // Disable if no content and no image
          >
            Post
          </button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center text-green-600 font-bold text-xl flex flex-col items-center">
              <i className="fas fa-check-circle text-5xl mb-3"></i>
              Post Submitted Successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// App Component: The main entry point for the Alumni Post feature.
// It manages the state for opening/closing the post modal.
export default function App() {
  // State to control the visibility of the PostModal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Function to open the modal
  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  // Function to close the modal
  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  // Callback function to be executed after a post is successfully submitted
  const handlePostSuccess = () => {
    console.log("Post successful! You might want to refresh the dashboard feed here.");
    // In a real application, this is where you would trigger a data refresh
    // for the main alumni dashboard or feed to show the new post.
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 font-sans opacity-80"
      // Set background image using the imported alumniBg
      style={{ backgroundImage: `url(${alumniBg})` }}
    >
      {/* Tailwind CSS CDN for styling. Loaded once for the entire app. */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Font Awesome CDN for icons. Removed as it's not directly used in this component's UI elements. */}

      {/* Main content of the App */}
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">CREATE YOUR POST</h1>
        <p className="text-gray-600 mb-8">
          Welcome back! Share your updates, achievements, and connect with fellow alumni.
        </p>
        <button
          onClick={openPostModal}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-80"
        >
          Create New Post
        </button>
      </div>

      {/* Post Modal component, rendered conditionally */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={closePostModal}
        onPostSuccess={handlePostSuccess}
      />
    </div>
  );
}
