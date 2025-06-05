import React, { useState } from 'react';
import bgImage from '../../assets/unom.jpg'; // Correct import path based on your structure

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      time: formatTimeTo12Hour(formData.time),
    };
    console.log('Form Data:', formattedData); // Replace with API call
    alert("Event uploaded! (connect backend to store)");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Main form container with dark translucent background and backdrop blur */}
      <div className="relative z-10 w-full max-w-4xl rounded-xl shadow-2xl mx-4 my-8 p-10 text-white
                    bg-gray-800 bg-opacity-90 border border-gray-700 backdrop-filter backdrop-blur-sm
                    transform transition-all duration-500 ease-in-out hover:shadow-3xl"> 
        
        <h2 className="text-3xl font-semibold text-center mb-8 tracking-wide">Upload New Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Layout for Fields */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-200">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400
                           transition-all duration-300 ease-in-out" // Gray focus ring
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium mb-2 text-gray-200">Event Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-500 text-white
                           transition-all duration-300 ease-in-out" // Gray focus ring
                required
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="time" className="block text-sm font-medium mb-2 text-gray-200">Event Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-500 text-white
                           transition-all duration-300 ease-in-out" // Gray focus ring
                required
              />
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
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400
                           transition-all duration-300 ease-in-out" // Gray focus ring
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium mb-2 text-gray-200">Organizer</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400
                           transition-all duration-300 ease-in-out" // Gray focus ring
                placeholder="Organizer name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-200">Event Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400
                         resize-y transition-all duration-300 ease-in-out" // Gray focus ring
              placeholder="Write event details here..."
              rows="4"
              required
            ></textarea>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="poster" className="block text-sm font-medium mb-2 text-gray-200">Event Poster (Image)</label>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-5 rounded-md
                                  border border-gray-600 text-sm font-medium
                                  transition-all duration-300 ease-in-out transform hover:scale-105"> {/* Gray button, hover scale effect */}
                  Choose File
                  <input
                    type="file"
                    id="poster"
                    name="poster"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden" // Hide default file input
                    required
                  />
                </label>
                <span className="text-gray-300 text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[calc(100%-120px)]">
                  {formData.poster ? formData.poster.name : 'No file chosen'}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="recapMedia" className="block text-sm font-medium mb-2 text-gray-200">Recap Media (Optional)</label>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-5 rounded-md
                                  border border-gray-600 text-sm font-medium
                                  transition-all duration-300 ease-in-out transform hover:scale-105"> {/* Gray button, hover scale effect */}
                  Choose File
                  <input
                    type="file"
                    id="recapMedia"
                    name="recapMedia"
                    accept="image/*,video/*"
                    onChange={handleChange}
                    className="hidden" // Hide default file input
                  />
                </label>
                <span className="text-gray-300 text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[calc(100%-120px)]">
                  {formData.recapMedia ? formData.recapMedia.name : 'No file chosen'}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="pdf" className="block text-sm font-medium mb-2 text-gray-200">Event PDF (Optional)</label>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-5 rounded-md
                                  border border-gray-600 text-sm font-medium
                                  transition-all duration-300 ease-in-out transform hover:scale-105"> {/* Gray button, hover scale effect */}
                  Choose File
                  <input
                    type="file"
                    id="pdf"
                    name="pdf"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="hidden" // Hide default file input
                  />
                </label>
                <span className="text-gray-300 text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[calc(100%-120px)]">
                  {formData.pdf ? formData.pdf.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>
              <div>
  <label htmlFor="qrCode" className="block text-sm font-medium mb-2 text-gray-200">QR Code (Optional)</label>
  <div className="flex items-center space-x-3">
    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-5 rounded-md
                      border border-gray-600 text-sm font-medium
                      transition-all duration-300 ease-in-out transform hover:scale-105">
      Choose File
      <input
        type="file"
        id="qrCode"
        name="qrCode"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
    <span className="text-gray-300 text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[calc(100%-120px)]">
      {formData.qrCode ? formData.qrCode.name : 'No file chosen'}
    </span>
  </div>
</div>


          <div className="text-center mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg
                         transition-all duration-300 ease-in-out transform hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-lg" // Gray focus ring
            >
              Upload Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadEvent;