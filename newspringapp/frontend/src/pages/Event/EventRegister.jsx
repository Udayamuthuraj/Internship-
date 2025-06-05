import React, { useState } from "react";
import bgImage from '../../assets/unom.jpg';
import axios from "axios";

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

  const [qrImage] = useState("/assets/payment-qr.png"); // Replace with actual QR code path
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );

    try {
      await axios.post("http://localhost:8080/api/register-event", data);
      setMessage("Registration successful!");
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
    } catch (err) {
      setMessage("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 bg-white rounded-2xl p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[95vh]">
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-6 drop-shadow">
          Event Registration Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["Name", "name", "text"],
            ["Email", "email", "email"],
            ["Register Number (optional)", "regNo", "text"],
            ["Department", "department", "text"],
            ["Course", "course", "text"],
            ["Batch", "batch", "text"],
            ["Event Title", "eventTitle", "text"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="block font-semibold text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-orange-500"
                required={name !== "regNo"}
              />
            </div>
          ))}

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

          <div className="text-center">
            <p className="font-semibold text-gray-800 mb-2">Scan the QR Code to make payment</p>
            <img
              src={qrImage}
              alt="Payment QR"
              className="mx-auto h-40 w-40 object-contain border border-gray-400 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mt-4">
              Upload Payment Screenshot
            </label>
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
            className="w-full bg-orange-700 text-white py-3 rounded-md hover:bg-orange-800 transition font-semibold"
          >
            Submit Registration
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
