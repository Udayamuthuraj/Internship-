import React, { useState } from 'react';
import axios from 'axios';
import bgImage from '../../assets/unom.jpg';

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
      const response = await axios.post("http://localhost:9090/api/events/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Event uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("❌ Error uploading event:", error);
      alert("❌ Failed to upload event.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative z-10 w-full max-w-4xl rounded-xl shadow-2xl mx-4 my-8 p-10 text-white
                    bg-gray-800 bg-opacity-90 border border-gray-700 backdrop-filter backdrop-blur-sm
                    transform transition-all duration-500 ease-in-out hover:shadow-3xl">
        
        <h2 className="text-3xl font-semibold text-center mb-8 tracking-wide">Upload New Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-200">Event Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                placeholder="Enter event title" required />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium mb-2 text-gray-200">Event Date</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white" required />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="time" className="block text-sm font-medium mb-2 text-gray-200">Event Time</label>
              <input type="time" id="time" name="time" value={formData.time} onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white" required />
              {formData.time && (
                <small className="text-gray-300 mt-1 block">
                  Selected: {formatTimeTo12Hour(formData.time)}
                </small>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2 text-gray-200">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                placeholder="Enter location" required />
            </div>
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium mb-2 text-gray-200">Organizer</label>
              <input type="text" id="organizer" name="organizer" value={formData.organizer} onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                placeholder="Organizer name" required />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-200">Event Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 resize-y"
              placeholder="Write event details here..." rows="4" required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UploadFile label="Event Poster (Image)" name="poster" accept="image/*" file={formData.poster} handleChange={handleChange} required />
            <UploadFile label="Recap Media (Optional)" name="recapMedia" accept="image/*,video/*" file={formData.recapMedia} handleChange={handleChange} />
            <UploadFile label="Event PDF (Optional)" name="pdf" accept="application/pdf" file={formData.pdf} handleChange={handleChange} />
          </div>

          <UploadFile label="QR Code (Optional)" name="qrCode" accept="image/*" file={formData.qrCode} handleChange={handleChange} />

          <div className="text-center mt-8">
            <button type="submit"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg
                         transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none">
              Upload Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UploadFile = ({ label, name, accept, file, handleChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-200">{label}</label>
    <div className="flex items-center space-x-3">
      <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-5 rounded-md border border-gray-600 text-sm font-medium transition-all transform hover:scale-105">
        Choose File
        <input type="file" id={name} name={name} accept={accept} onChange={handleChange} className="hidden" required={required} />
      </label>
      <span className="text-gray-300 text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[calc(100%-120px)]">
        {file ? file.name : 'No file chosen'}
      </span>
    </div>
  </div>
);

export default UploadEvent;
