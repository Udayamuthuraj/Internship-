import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import universityBg from "../../assets/unomstu1.jpg";

const AlumniResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Enter a valid email.");
      setMessageType("error");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/alumni/request-otp",
        { uemail: email },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage("OTP sent to your email.");
      setMessageType("success");
      setStep(2);
      setCountdown(120);
    } catch (err) {
      setMessage("Failed to send OTP: " + (err.response?.data?.message || err.message));
      setMessageType("error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/alumni/forgot-password/reset", null, {
        params: { email, otp, newPassword },
      });
      setMessage("Password reset successful!");
      setMessageType("success");
      setTimeout(() => navigate("/alumni/login"), 1500);
    } catch (err) {
      setMessage("Failed to reset password: " + (err.response?.data?.message || err.message));
      setMessageType("error");
    }
  };
  const handleResendOtp = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/alumni/request-otp",
        { uemail: email },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setMessage("New OTP sent to your email.");
      setMessageType("success");
      setCountdown(120); // restart countdown
    } catch (err) {
      setMessage("Failed to resend OTP: " + (err.response?.data?.message || err.message));
      setMessageType("error");
    }
  };


  return (
    <div style={backgroundStyle}>
      <form
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
        style={formStyle}
      >
        <h2 style={titleStyle}>
          {step === 1 ? "Forgot Password" : "Reset Your Password"}
        </h2>
        {message && (
          <div
            style={{
              backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
              color: messageType === "success" ? "#155724" : "#721c24",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px",
              border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
          disabled={step === 2}
        />

        {step === 2 && (
          <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={inputStyle}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "12px",
                  cursor: "pointer",
                  color: "#930911",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <p style={{ color: "#930911", textAlign: "center", margin: "5px 0" }}>
              OTP valid for: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
            </p>
            {countdown === 0 && (
              <button
                type="button"
                onClick={handleResendOtp}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#BA3D47",
                  marginTop: "5px",
                }}
              >
                Resend OTP
              </button>
            )}
          </div>
        )}

        <button type="submit" style={buttonStyle}>
          {step === 1 ? "Send OTP" : "Reset Password"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center", color: "black" }}>
          Remembered password?{" "}
          <span style={linkStyle} onClick={() => navigate("/alumni/login")}>
            Go to Login
          </span>
        </p>
      </form>
    </div>
  );
};

const backgroundStyle = {
  backgroundImage: `url(${universityBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  width: "90%",
  maxWidth: "400px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "16px",
};

const buttonStyle = {
  backgroundColor: "#930911",
  color: "white",
  padding: "12px",
  marginTop: "10px",
  border: "none",
  width: "100%",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

const titleStyle = {
  textAlign: "center",
  color: "#930911",
  marginBottom: "20px",
  fontWeight: "bold",
};

const linkStyle = {
  color: "#930911",
  cursor: "pointer",
  textDecoration: "underline",
};

export default AlumniResetPassword;
