import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    description: '',
    poster: null,
    recapMedia: null,
    pdf: null,
    qrCode: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatTimeTo12Hour = (time24) => {
    if (!time24) return '';
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("time", formatTimeTo12Hour(formData.time));
    formDataToSend.append("location", formData.location);
    formDataToSend.append("organizer", formData.organizer);
    formDataToSend.append("description", formData.description);
    if (formData.poster) formDataToSend.append("poster", formData.poster);
    if (formData.recapMedia) formDataToSend.append("recapMedia", formData.recapMedia);
    if (formData.pdf) formDataToSend.append("pdf", formData.pdf);
    if (formData.qrCode) formDataToSend.append("qrCode", formData.qrCode);

    try {
      const response = await axios.post("http://localhost:8080/api/events/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Event uploaded successfully!");
      navigate("/admin/events/all");
    } catch (error) {
      console.error("❌ Error uploading event:", error);
      alert("❌ Failed to upload event.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/events/all")}
          className="mb-6 flex items-center gap-2 text-sm text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg shadow"
        >
          <ArrowLeft size={16} />
          Back to Events
        </motion.button>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">Upload New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-3">
              <LabelInput
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />
            </div>
            <div className="md:col-span-2">
              <LabelInput
                label="Event Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-1">
              <LabelInput
                label="Event Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />
              {formData.time && (
                <small className="text-gray-300 mt-1 block text-xs">
                  Selected: {formatTimeTo12Hour(formData.time)}
                </small>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Event location"
            />
            <LabelInput
              label="Organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="Organizer name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-200">
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 shadow-sm text-white resize-y"
              rows="4"
              required
              placeholder="Write event details here..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UploadFile
              label="Event Poster (Image)"
              name="poster"
              accept="image/*"
              file={formData.poster}
              handleChange={handleChange}
              required
            />
            <UploadFile
              label="Recap Media (Image/Video)"
              name="recapMedia"
              accept="image/*,video/*"
              file={formData.recapMedia}
              handleChange={handleChange}
            />
            <UploadFile
              label="Event PDF (Brochure)"
              name="pdf"
              accept="application/pdf"
              file={formData.pdf}
              handleChange={handleChange}
            />
          </div>

          <UploadFile
            label="QR Code (Image)"
            name="qrCode"
            accept="image/*"
            file={formData.qrCode}
            handleChange={handleChange}
          />

          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out"
            >
              Upload Event
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LabelInput = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-200">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 shadow-sm"
      placeholder={placeholder}
      required
    />
  </div>
);

const UploadFile = ({ label, name, accept, file, handleChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-200">{label}</label>
    <div className="flex items-center space-x-3">
      <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-5 rounded-md text-sm font-medium transition-all transform hover:scale-105">
        Choose File
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          required={required}
        />
      </label>
      <span className="text-sm text-gray-300 truncate max-w-[calc(100%-120px)]">
        {file ? file.name : 'No file chosen'}
      </span>
    </div>
  </div>
);

export default UploadEvent;
