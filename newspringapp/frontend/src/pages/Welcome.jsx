import React, { useEffect, useState } from 'react';

import { FaInstagram, FaTwitter, FaEnvelope, FaRobot, FaTimes, FaCommentDots } from 'react-icons/fa'; // FaCommentDots imported
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence imported
import { Link } from 'react-router-dom';

import unomLogo from '../assets/unomlogo.png';
import backgroundImage from '../assets/unomstu1.jpg';

import faculty1 from '../assets/HODsir.jpg';
import faculty2 from '../assets/LAVANYAmam.jpg';
import faculty3 from '../assets/SORNAMmam.jpg';
import faculty4 from '../assets/CHITHRAmam.jpg';

import '@fontsource/figtree/400.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';

const facultyData = [
  {
    id: 'gopinathan',
    name: 'Dr. S. Gopinathan',
    title: 'Professor and Head',
    qualification: 'M.Sc., Ph.D.',
    image: faculty1,
  },
  {
    id: 'lavanya',
    name: 'Dr. B. Lavanya',
    title: 'Associate Professor',
    qualification: 'M.C.A., Ph.D',
    image: faculty2,
  },
  {
    id: 'sornam',
    name: 'Dr. M. Sornam',
    title: 'Professor',
    qualification: 'M.Sc., M.C.A., Ph.D',
    image: faculty3,
  },
  {
    id: 'chithra',
    name: 'Dr. PL. Chithra',
    title: 'Professor',
    qualification: 'M.C.A., M.Phil., Ph.D',
    image: faculty4,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const WelcomePage = () => {
  const [count, setCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi there! How can I help you today?", from: "bot" }]);
  const [userInput, setUserInput] = useState("");
  const target = 1245;

  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [feedbackDisplayOpen, setFeedbackDisplayOpen] = useState(false); // New state for displaying feedback
  const [feedbackList, setFeedbackList] = useState([]); // State to store fetched feedback
  const [feedbackSuccess, setFeedbackSuccess] = useState(false); // To trigger refetch of feedback after submission

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 10);
    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(counter);
        setCount(target);
      } else {
        setCount(Math.floor(start));
      }
    }, 10);
    return () => clearInterval(counter);
  }, []);

  // Fetch feedback on component mount and after new feedback submission
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/feedback');
        if (response.ok) {
          const data = await response.json();
          setFeedbackList(data);
        } else {
          console.error("Failed to fetch feedback.");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [feedbackSuccess]); // Refetch when feedbackSuccess changes (i.e., after a new submission)


  const sendMessage = () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { text: userInput, from: "user" }];
    setMessages(newMessages);
    setUserInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Thanks for reaching out. We'll get back soon!", from: "bot" }]);
    }, 1000);
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const submitFeedback = async () => {
    if (!feedback.name || !feedback.email || !feedback.message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      if (response.ok) {
  setShowSuccessPopup(true);          // Show popup
  setFeedback({ name: '', email: '', message: '' });  // Clear form
  setFeedbackSuccess(prev => !prev); // Trigger refetch
} else {
  alert("Failed to submit feedback.");
}

    } catch (error) {
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center overflow-x-hidden transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: "'Figtree', sans-serif",
      }}

    >
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 bg-white bg-opacity-90 shadow-lg backdrop-blur-md px-8 py-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-3 text-[#930911] font-bold text-xl">
          <img src={unomLogo} alt="Logo" className="h-10 w-10" />
          <span>University Of Madras</span>
        </div>
        <ul className="flex space-x-6 font-semibold text-[#930911]">
          <li><a href="/events" className="hover:text-[#BA3D47]">Events</a></li>
          <li><a href="/gallery" className="hover:text-[#BA3D47]">Gallery</a></li>
          <li><a href="/about" className="hover:text-[#BA3D47]">About</a></li>
          <li><a href="/admin" className="hover:text-[#BA3D47]">Admin</a></li>
        </ul>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-52 px-6 min-h-[120vh] flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative z-10 px-14 py-20 rounded-3xl max-w-6xl w-full">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-8xl font-extrabold text-[#FF4B4B] mb-10 drop-shadow-2xl"
          >
            Welcome to CSITAA
          </motion.h1>
          <h2 className="text-4xl text-white mb-10 drop-shadow-2xl">
            Computer Science and IT Alumni Association
          </h2>
          <p className="text-white text-2xl max-w-4xl mx-auto drop-shadow-xl leading-relaxed">
            Uniting students and alumni to share opportunities, achievements, and memories from our vibrant community.
          </p>
          <div className="mt-12 space-x-8">
            <a href="/student/Register" className="bg-[#930911] hover:bg-[#BA3D47] text-white px-10 py-5 rounded-2xl text-xl font-bold transition inline-block">
              Join as Student
            </a>
            <a href="/alumni" className="bg-white text-[#930911] hover:bg-[#FFE9D4] px-10 py-5 rounded-2xl text-xl font-bold border border-[#930911] transition inline-block">
              Explore Alumni
            </a>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-6 py-20 bg-white bg-opacity-30 backdrop-blur-sm text-center rounded-xl max-w-7xl mx-auto shadow-lg"
      >
        <motion.h3 variants={item} className="text-3xl font-semibold text-[#930911] mb-12">
          Leadership Spotlight
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {facultyData.map((faculty) => (
            <motion.div
              key={faculty.id}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-3xl shadow-lg border bg-[#FFE9D4] border-[#EEC8B9] transition cursor-pointer"
            >
              <Link to={`/faculty/${faculty.id}`}>
                <img
                  src={faculty.image}
                  alt={faculty.name}
                  className="h-28 w-28 mx-auto rounded-full mb-4 border-4 border-[#BA3D47] object-cover block"
                />
                <h4 className="text-xl font-semibold text-[#930911]">{faculty.name}</h4>
                <p className="text-[#BA3D47]">{faculty.title}</p>
                <p className="text-sm text-gray-600 mt-1">{faculty.qualification}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Alumni Counter */}
      <motion.section
        id="alumni-count"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white bg-opacity-30 backdrop-blur-sm py-16 text-center rounded-xl max-w-5xl mx-auto shadow-lg mt-12 mb-16"
      >
        <h3 className="text-3xl font-semibold text-[#930911] mb-4">Alumni Registered</h3>
        <p className="text-6xl font-bold text-[#BA3D47] tracking-wide mb-2">{count.toLocaleString()}</p>
        <p className="text-lg text-[#930911]">Proud members and growing</p>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-16 text-center bg-white bg-opacity-30 backdrop-blur-sm rounded-xl max-w-5xl mx-auto shadow-lg">
        <h3 className="text-3xl font-semibold text-[#930911] mb-4">About This Portal</h3>
        <p className="text-xl text-[#333] px-6">
          CSITAA is the official alumni portal of the Department of Computer Science & IT, University of Madras. 
        </p>
        <p className="text-xl text-[#333] px-6">
          This platform bridges the gap between current students and alumni, fostering mentorship, collaboration, and lasting relationships.
        </p>
        <p className="text-xl text-[#333] px-6">
          Through CSITAA, we aim to build a vibrant and interactive community where alumni can stay connected with their alma mater and contribute meaningfully to its growth.
        </p>
        <p className="text-xl text-[#333] px-6">
          The portal provides students with access to a wealth of experience, guidance, and opportunities from graduates who have excelled in various industries across the globe.
        </p>
        <p className="text-xl text-[#333] px-6">
          Whether you're a student seeking career advice, an alumnus looking to give back, or a faculty member wanting to share department updates — CSITAA serves as the central hub for communication, knowledge-sharing, and professional networking
        </p>
      </section>

      {/* Feedback Section (Original - for submitting feedback) */}
      <section className="bg-white bg-opacity-30 backdrop-blur-sm py-16 text-center rounded-xl max-w-4xl mx-auto shadow-lg mt-12">
        <h3 className="text-3xl font-semibold text-[#930911] mb-6">Leave Us Feedback</h3>
        <div className="flex flex-col gap-4 px-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={feedback.name}
            onChange={handleFeedbackChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#930911]"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={feedback.email}
            onChange={handleFeedbackChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#930911]"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={feedback.message}
            onChange={handleFeedbackChange}
            rows={4}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#930911]"
          />
          <button
            onClick={submitFeedback}
            className="bg-[#930911] text-white px-6 py-3 rounded-lg hover:bg-[#BA3D47]"
          >
            Submit Feedback
          </button>
        </div>
      </section>

      {/* Contact Section (Original - social media icons here) */}
      <section className="bg-white bg-opacity-30 backdrop-blur-sm py-16 text-center rounded-xl max-w-4xl mx-auto shadow-lg mt-12">
        <h3 className="text-3xl font-semibold text-[#930911] mb-6">Connect With Us</h3>
        <div className="flex justify-center gap-10 text-3xl text-[#930911]">
          {/* These are your social media icons, untouched as per your original code */}
          <a href="mailto:csitaa@university.edu" className="hover:text-[#BA3D47] transition"><FaEnvelope /></a>
          <a href="https://www.instagram.com/_csitaa_/" className="hover:text-[#BA3D47] transition"><FaInstagram /></a>
          <a href="https://twitter.com/CSITAA" className="hover:text-[#BA3D47] transition"><FaTwitter /></a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-[#930911] bg-[#FFE9D4] font-medium">
        &copy; 2025 CSITAA – All rights reserved.
      </footer>

      {/* Chatbot Button */}
      <motion.button
        animate={{ y: [-5, 5] }} // Floating animation
        transition={{
          y: {
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            repeatType: "mirror",
          },
        }}
        className="fixed bottom-24 right-8 bg-[#930911] hover:bg-[#BA3D47] text-white rounded-full p-4 shadow-lg z-50"
        onClick={() => setChatOpen(true)}
        aria-label="Open Chatbot"
      >
        <FaRobot size={24} />
      </motion.button>

      {/* Feedback Icon to View Feedback */}
      <motion.button
        animate={{ y: [-5, 5] }} // Floating animation, similar to chatbot
        transition={{
          y: {
            repeat: Infinity,
            duration: 1.2, // Slightly different duration for visual variety
            ease: "easeInOut",
            repeatType: "mirror",
          },
        }}
        onClick={() => setFeedbackDisplayOpen(true)}
        aria-label="Open Feedback Display"
        className="fixed bottom-8 right-8 z-50 bg-[#930911] hover:bg-[#BA3D47] text-white rounded-full p-4 shadow-lg transition"
      >
        <FaCommentDots size={24} />
      </motion.button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-36 right-8 z-50 w-80 max-w-full h-96 bg-white rounded-xl shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center bg-[#930911] rounded-t-xl p-3 text-white">
              <h4 className="font-bold">Alumni Chatbot</h4>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close Chatbot"
                className="hover:text-[#BA3D47]"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f9f9f9]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] px-3 py-2 rounded-lg ${
                    msg.from === 'bot'
                      ? 'bg-[#BA3D47] text-white self-start'
                      : 'bg-gray-200 text-black self-end'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex p-3 border-t border-gray-300"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow rounded-l-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#930911]"
              />
              <button
                type="submit"
                className="bg-[#930911] hover:bg-[#BA3D47] text-white rounded-r-lg px-4 py-2 transition"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>


{/* Feedback Display Modal */}
<AnimatePresence>
  {feedbackDisplayOpen && (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="feedback-modal-title"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative"
      >
        <h3
          id="feedback-modal-title"
          className="text-2xl font-semibold text-[#930911] mb-4"
        >
          User Feedback
        </h3>
        <button
          onClick={() => setFeedbackDisplayOpen(false)}
          aria-label="Close Feedback Display"
          className="absolute top-4 right-4 text-[#930911] hover:text-[#BA3D47] focus:outline-none"
        >
          <FaTimes size={24} />
        </button>

        {feedbackList.length === 0 ? (
          <p className="text-gray-600">No feedback available.</p>
        ) : (
          <ul className="space-y-4">
            {feedbackList.map((fb) => (
              <li
                key={fb.id || fb._id || fb.email + fb.name}
                className="border border-[#EEC8B9] rounded-lg p-4 bg-[#FFE9D4]"
              >
                <p className="font-semibold text-[#930911]">{fb.name}</p>
                <p className="text-sm text-[#BA3D47] mb-2">{fb.email}</p>
                <p className="text-gray-700 whitespace-pre-line">{fb.message}</p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {showSuccessPopup && (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60"
      onClick={() => setShowSuccessPopup(false)} // Close on clicking outside
    >
      <motion.div
        className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside popup
      >
        <h2 className="text-2xl font-semibold mb-4 text-[#930911]">Thank You!</h2>
        <p className="mb-6">Your feedback has been submitted successfully.</p>
        <button
          onClick={() => setShowSuccessPopup(false)}
          className="bg-[#930911] text-white px-6 py-2 rounded hover:bg-[#BA3D47] transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
};

export default WelcomePage;