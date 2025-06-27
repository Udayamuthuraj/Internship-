// src/components/FeedbackFormModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const FeedbackFormModal = ({ onClose, onFeedbackSubmitted }) => { // Added onFeedbackSubmitted prop
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Added email state
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [errorPopup, setErrorPopup] = useState(false); // Added error popup state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading
    setErrorPopup(false); // Clear previous errors
    try {
      // Changed endpoint to /api/feedback as per your backend
      await axios.post('http://localhost:8080/api/feedback', { name, email, message: feedback });
      setPopup(true);
      if (onFeedbackSubmitted) {
          onFeedbackSubmitted(); // Notify parent that feedback was submitted
      }
      setTimeout(() => {
        setPopup(false);
        onClose(); // Close the modal after success
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      setErrorPopup(true); // Show error popup
      setTimeout(() => {
        setErrorPopup(false);
      }, 3000);
    } finally {
      setIsLoading(false); // Reset loading
    }
  };

  return (
    <>
      {popup && (
<motion.div
  className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-xl shadow-lg z-50"
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.5 }}
>
  Feedback submitted! 🎉
</motion.div>

      )}

      {errorPopup && ( // New error popup
        <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-xl shadow-lg z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            Failed to submit feedback. Please try again.
        </motion.div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">Give Us Your Feedback</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input // Added email input
              type="email"
              placeholder="Your email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your feedback"
              className="w-full p-2 border rounded"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FeedbackFormModal;