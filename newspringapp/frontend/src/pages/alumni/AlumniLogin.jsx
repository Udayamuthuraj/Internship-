import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import axios from "axios";
import universityBg from "../../assets/unomstu1.jpg";

const AlumniLogin = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // This effect now only handles the animation, ensuring the form always appears
    const timer = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);

    // Basic client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setMessage("Please enter your password.");
      setIsLoading(false);
      return;
    }

    try {
      // API call to your backend
      const response = await axios.post("http://localhost:8080/api/alumni/login", {
        username: email,
        password: password
      });

      console.log("LOGIN RESPONSE:", response.data);

      // Verify essential data before saving
      if (response.data && response.data.token && response.data.userId) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("uid", response.data.userId);
        localStorage.setItem("username", response.data.username || '');
        localStorage.setItem("userEmail", email);

        setMessage("Login successful!");
        setIsSuccess(true);

        // Redirect after a short delay
        setTimeout(() => navigate("/alumni/dashboard"), 1200);
      } else {
        throw new Error("Login successful, but missing authentication data from server.");
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      
      // --- MODIFIED ERROR HANDLING LOGIC STARTS HERE ---
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.response) {
        // Check for specific HTTP status codes from the server
        if (error.response.status === 403) {
          // Status 403 (Forbidden) is often used for invalid credentials
          errorMessage = "Invalid password";
        } else if (error.response.status === 404) {
          // Status 404 (Not Found) can be used to indicate the user doesn't exist
          errorMessage = "Incorrect email address";
        } else if (error.response.data && error.response.data.message) {
          // Fallback to the backend's message if a status code doesn't match
          errorMessage = error.response.data.message;
        } else {
          // Generic server error message
          errorMessage = `Server error: Status ${error.response.status}`;
        }
      } else {
        // Handle network errors (e.g., no internet, server is down)
        errorMessage = "Could not connect to the server. Please check your network.";
      }
      
      setMessage(errorMessage);
      setIsSuccess(false);
      // --- MODIFIED ERROR HANDLING LOGIC ENDS HERE ---

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${universityBg})` }}>
      <Link to="/" className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
        <Home className="text-[#930911] w-6 h-6" />
      </Link>

      <div className="min-h-screen w-full flex items-center justify-center px-4 bg-black/30">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl px-10 py-12 max-w-lg w-full"
            >
              <h2 className="text-4xl font-bold text-center text-[#930911] mb-8">Alumni Login</h2>
              {message && (
                <div className={`alert ${isSuccess ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} text-center mb-4 p-2 rounded`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-5">
                <input type="email" placeholder="Email" className="input-style" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="input-style" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="w-full bg-[#930911] text-white py-3 rounded-lg font-semibold hover:bg-[#BA3D47] transition duration-300" disabled={isLoading}>
                  {isLoading ? 'Logging In...' : 'Login'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-white-600">
                Don't have an account? <Link to="/alumni/register" className="text-[#930911] font-medium hover:underline">Register here</Link>
              </p>
              <p style={{ textAlign: 'center' }}>
                <Link to="/alumni/reset-password" style={{ color: 'red' }}>Forgot Password?</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlumniLogin;