import React, { useState, useEffect } from "react";
import axios from "axios";
import bgImage from '../../assets/unom.jpg';

const EventRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNo: "",
    department: "",
    course: "",
    batch: "",
    eventTitle: "",
    role: "Student",
    paymentScreenshot: null,
  });

  const [qrImageUrl, setQrImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9090/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events", err));
  }, []);

  useEffect(() => {
    const selectedEvent = events.find(e => e.title === formData.eventTitle);
    if (selectedEvent?.qrCode) {
      setQrImageUrl(`http://localhost:9090/api/qr/${selectedEvent.qrCode}`);
    } else {
      setQrImageUrl("");
    }
  }, [formData.eventTitle, events]);

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
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      await axios.post("http://localhost:9090/api/register-event", data);
      setMessage("✅ Registration successful!");
      setFormData({
        name: "",
        email: "",
        regNo: "",
        department: "",
        course: "",
        batch: "",
        eventTitle: "",
        role: "Student",
        paymentScreenshot: null,
      });
      setQrImageUrl("");
    } catch (err) {
      setMessage("❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 bg-white rounded-2xl p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[95vh]">
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">Event Registration Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "regNo", "department", "course", "batch"].map((field) => (
            <div key={field}>
              <label className="block font-semibold text-gray-700 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={field !== "regNo"}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
              />
            </div>
          ))}

          <div>
            <label className="block font-semibold text-gray-700">Event Title</label>
            <select
              name="eventTitle"
              value={formData.eventTitle}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
              required
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.title}>{event.title}</option>
              ))}
            </select>
          </div>

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

          {qrImageUrl && (
            <div className="text-center">
              <p className="font-semibold text-gray-800 mb-2">Scan QR to Pay</p>
              <img src={qrImageUrl} alt="QR Code" className="mx-auto h-40 w-40 object-contain border border-gray-400 rounded" />
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 mt-4">Upload Payment Screenshot</label>
            <input
              type="file"
              name="paymentScreenshot"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
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

        {message && <p className="mt-4 text-center font-semibold text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default EventRegister;
