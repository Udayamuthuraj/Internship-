import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import axios from "axios"; // Import axios for API calls
import universityBg from "../../assets/unomstu1.jpg"; // Ensure this path is correct

const AlumniRegister = () => {
  // State to hold all form data, including OTP
  const [formData, setFormData] = useState({
    uname: "",
    udepartment: "",
    ubatch: "",
    uemail: "",
    otp: "", 
    upassword: "",
  });

  const [currentStep, setCurrentStep] = useState('initial');

  // State for displaying messages to the user
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Loading states for buttons
  const [isLoading, setIsLoading] = useState(false);

  const [showForm, setShowForm] = useState(false); // For animation

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Main handler for the single "Register" button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsLoading(true); // Disable button during processing

    try {
      if (currentStep === 'initial') {
        // Step 1: Request OTP
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = formData.uemail.trim(); // Add this line to remove leading/trailing whitespace
        if (!emailRegex.test(trimmedEmail)) {
          setMessage("Please enter a valid email address.");
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.post('/api/alumni/request-otp', { uemail: trimmedEmail });
        setMessage(response.data.message || 'OTP sent to your email.');
        setIsSuccess(true);
        setCurrentStep('otp_sent'); // Move to next step
        console.log('OTP Request Success:', response.data);

      } else if (currentStep === 'otp_sent') {
        // Step 2: Verify OTP
        if (!formData.otp) {
          setMessage("Please enter the OTP.");
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.post('/api/alumni/verify-otp', { uemail: formData.uemail, otp: formData.otp });
        setMessage(response.data.message || 'OTP verified successfully! Click Register to complete.');
        setIsSuccess(true);
        setCurrentStep('otp_verified'); // Move to next step
        console.log('OTP Verification Success:', response.data);

      } else if (currentStep === 'otp_verified') {
        // Step 3: Complete Registration
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.upassword)) {
          setMessage("Password must be 8+ characters, contain upper/lowercase, number, and special char.");
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.post('/api/alumni/register', formData); // Send all form data
        setMessage(response.data.message || 'Registration successful!');
        setIsSuccess(true);
        console.log('Registration Success:', response.data);

        // Navigate to login page after a short delay
        setTimeout(() => {
          navigate("/alumni/login"); // Ensure '/login' route is defined in App.js
        }, 2000);
      }
    } catch (error) {
      console.error('Operation failed:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  // Determine button text based on current step
  const getButtonText = () => {
    if (isLoading) {
      if (currentStep === 'initial') return 'Sending OTP...';
      if (currentStep === 'otp_sent') return 'Verifying OTP...';
      if (currentStep === 'otp_verified') return 'Registering...';
    }
    if (currentStep === 'initial') return 'Send OTP & Register';
    if (currentStep === 'otp_sent') return 'Verify OTP & Register';
    if (currentStep === 'otp_verified') return 'Complete Registration';
    return 'Register'; // Default
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${universityBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link
        to="/"
        className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
        title="Home"
      >
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
              <h2 className="text-4xl font-bold text-center text-[#930911] mb-8">
                Alumni Register
              </h2>

              {/* Message Display Area */}
              {message && (
                <div className={`alert ${isSuccess ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} text-center mb-4 p-2 rounded`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Always visible fields */}
                <input
                  type="text"
                  placeholder="Username"
                  className="input-style"
                  name="uname"
                  value={formData.uname}
                  onChange={handleChange}
                  required
                  disabled={currentStep !== 'initial' && currentStep !== 'otp_sent'} // Disable after OTP sent, re-enable if verified
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="input-style"
                  name="udepartment"
                  value={formData.udepartment}
                  onChange={handleChange}
                  required
                  disabled={currentStep !== 'initial' && currentStep !== 'otp_sent'}
                />
                <input
                  type="text"
                  placeholder="Batch (e.g., 2020-2022)"
                  className="input-style"
                  name="ubatch"
                  value={formData.ubatch}
                  onChange={handleChange}
                  required
                  disabled={currentStep !== 'initial' && currentStep !== 'otp_sent'}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input-style"
                  name="uemail"
                  value={formData.uemail}
                  onChange={handleChange}
                  required
                  disabled={currentStep !== 'initial'} // Disable email input after OTP sent
                />

                {/* OTP input field - only visible after OTP is sent */}
                {currentStep !== 'initial' && (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="input-style"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    disabled={currentStep === 'otp_verified'} // Disable OTP input once verified
                  />
                )}

                {/* Password field - only visible after OTP is verified */}
                {currentStep === 'otp_verified' && (
                  <input
                    type="password"
                    placeholder="Create Password"
                    className="input-style"
                    name="upassword"
                    value={formData.upassword}
                    onChange={handleChange}
                    required
                  />
                )}

                <button
                  type="submit"
                  className="w-full bg-[#930911] text-white py-3 rounded-lg font-semibold hover:bg-[#BA3D47] transition duration-300"
                  disabled={isLoading}
                >
                  {getButtonText()}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-white-600">
                Already have an account?{" "}
                <Link
                  to="/alumni/login"
                  className="text-[#930911] font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlumniRegister;
