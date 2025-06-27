// src/services/feedbackService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Your backend base URL

export const submitFeedback = async (feedbackData) => {
  try {
    // Check your backend endpoint: is it /feedback or /api/feedback?
    const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData);
    return response.data; // Return data from successful submission
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error; // Re-throw to be handled by the caller
  }
};

export const getFeedbacks = async () => {
  try {
    // Check your backend endpoint: is it /feedback or /api/feedback?
    const response = await axios.get(`${API_BASE_URL}/feedback`);
    return response.data; // Return the list of feedbacks
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error; // Re-throw to be handled by the caller
  }
};