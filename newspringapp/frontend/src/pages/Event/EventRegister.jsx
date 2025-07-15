import React, { useState, useEffect } from "react";
import axios from "axios";
import bgImage from '../../assets/unom.jpg';

const EventRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    role: "Student",
    course: "",
    eventTitle: "",
    paymentScreenshot: null,
  });

  const [upcomingTitles, setUpcomingTitles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch upcoming event titles from backend
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/events/upcoming-titles"); // you need to expose this API
        setUpcomingTitles(response.data); // Expecting array of strings (event titles)
      } catch (error) {
        console.error("Failed to fetch upcoming event titles:", error);
      }
    };
    fetchUpcomingEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "paymentScreenshot" && files?.[0]) {
      const file = files[0];
      const isImage = file.type.startsWith("image/");
      const isSizeValid = file.size < 5 * 1024 * 1024;
      if (!isImage || !isSizeValid) {
        alert("Please upload a valid image under 5MB.");
        return;
      }
    }
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.eventTitle) {
      setMessage("❌ Please select an event.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post("http://localhost:8080/api/register-event", data);
      setMessage("✅ Registration successful!");
      setFormData({
        name: "",
        batch: "",
        role: "Student",
        course: "",
        eventTitle: "",
        paymentScreenshot: null,
      });
    } catch (err) {
      console.error("Registration failed:", err);
      setMessage("❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">
          Event Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
            />
          </div>

          {/* Batch */}
          <div>
            <label className="block font-semibold text-gray-700">Batch</label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
            >
              <option>Student</option>
              <option>Alumni</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block font-semibold text-gray-700">Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
            />
          </div>

          {/* Event Title Dropdown */}
          <div>
            <label className="block font-semibold text-gray-700">Event</label>
            <select
              name="eventTitle"
              value={formData.eventTitle}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
            >
              <option value="">-- Select Upcoming Event --</option>
              {upcomingTitles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Screenshot */}
          <div>
            <label className="block font-semibold text-gray-700 mt-4">
              Upload Payment Screenshot
            </label>
            <input
              type="file"
              name="paymentScreenshot"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-700 text-white py-3 rounded-md hover:bg-orange-800 font-semibold"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-semibold text-green-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventRegister;