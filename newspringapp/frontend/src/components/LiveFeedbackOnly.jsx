import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const LiveFeedbackOnly = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/feedback");
        setFeedbacks(response.data.slice(-10)); // get last 10 feedbacks
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        feedbacks.length ? (prevIndex + 1) % feedbacks.length : 0
      );
    }, 3000); // every 3s switch feedback

    const refreshInterval = setInterval(fetchFeedbacks, 10000); // refresh every 10s

    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, [feedbacks.length]);

  if (!feedbacks.length) return null;

  const current = feedbacks[currentIndex];

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-xl mx-auto my-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-semibold text-gray-800">{current.name}</p>
          <p className="italic text-gray-600">"{current.message}"</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveFeedbackOnly;
