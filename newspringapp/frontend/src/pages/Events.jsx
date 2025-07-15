import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home } from "lucide-react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/unomstu1.jpg";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const today = new Date();

  const filterEvents = () =>
    events.filter((event) => {
      const eventDate = new Date(event.date);
      if (activeTab === "upcoming") return eventDate >= today;
      if (activeTab === "past") return eventDate < today;
      return true;
    });

  const getFileName = (path) => path?.split("\\").pop();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
        title="Home"
        aria-label="Go to homepage"
      >
        <Home className="text-[#930911] w-6 h-6" />
      </Link>

      <div className="min-h-screen bg-white/10 backdrop-blur-md py-10 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-4xl font-bold text-[#930911] mb-2">
              Alumni Events
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            {["upcoming", "past", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedEvent(null);
                }}
                className={`px-5 py-2 rounded-xl font-semibold transition-all shadow-md ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#930911] to-[#3B82F6] text-white"
                    : "bg-[#D6E6F2] text-[#930911] border border-[#ADCBE3] hover:bg-[#BFD7ED]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Titles */}
            <div className="bg-white/30 backdrop-blur-lg border border-[#ADCBE3] rounded-xl p-6 shadow-lg transition">
              <h2 className="text-xl font-semibold text-[#930911] mb-4">
                Event Titles
              </h2>
              {filterEvents().map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer p-2 rounded hover:bg-[#ADCBE3]/30 transition text-black"
                >
                  <span className="font-medium">{event.title}</span>
                </div>
              ))}
            </div>

            {/* Event Details */}
            {selectedEvent && (
              <div className="bg-white/30 backdrop-blur-lg border border-[#ADCBE3] rounded-xl p-6 shadow-lg transition text-sm text-black space-y-4">
                <h2 className="text-xl font-bold text-center text-[#930911]">
                  {selectedEvent.title}
                </h2>

                {/* Poster */}
                {selectedEvent.posterPath &&
                  /\.(jpe?g|png|gif|webp)$/i.test(selectedEvent.posterPath) && (
                    <img
                      src={`http://localhost:8080/api/events/poster/${getFileName(
                        selectedEvent.posterPath
                      )}`}
                      alt="Poster"
                      className="w-64 mx-auto rounded border-2 border-[#3B82F6] shadow cursor-pointer"
                      onClick={() =>
                        setModalImage(
                          `http://localhost:8080/api/events/poster/${getFileName(
                            selectedEvent.posterPath
                          )}`
                        )
                      }
                    />
                  )}

                {/* Recap */}
                {selectedEvent.recapMediaPath &&
                  /\.(jpe?g|png|gif|webp)$/i.test(selectedEvent.recapMediaPath) && (
                    <img
                      src={`http://localhost:8080/api/events/recap/${getFileName(
                        selectedEvent.recapMediaPath
                      )}`}
                      alt="Recap"
                      className="w-64 mx-auto rounded border-2 border-[#3B82F6] shadow cursor-pointer"
                      onClick={() =>
                        setModalImage(
                          `http://localhost:8080/api/events/recap/${getFileName(
                            selectedEvent.recapMediaPath
                          )}`
                        )
                      }
                    />
                  )}

                {/* QR Code */}
                {selectedEvent.qrCodePath &&
                  /\.(jpe?g|png|gif|webp)$/i.test(selectedEvent.qrCodePath) && (
                    <div className="text-center">
                      <p className="text-[#930911] text-xs mb-1">
                        Scan QR to Register
                      </p>
                      <img
                        src={`http://localhost:8080/api/events/qr/${getFileName(
                          selectedEvent.qrCodePath
                        )}`}
                        alt="QR Code"
                        className="w-28 mx-auto border border-[#3B82F6] rounded shadow cursor-pointer"
                        onClick={() =>
                          setModalImage(
                            `http://localhost:8080/api/events/qr/${getFileName(
                              selectedEvent.qrCodePath
                            )}`
                          )
                        }
                      />
                    </div>
                  )}

                {/* PDF */}
                {selectedEvent.pdfPath &&
                  selectedEvent.pdfPath.toLowerCase().endsWith(".pdf") && (
                    <div className="text-center">
                      <a
                        href={`http://localhost:8080/api/events/pdf/${getFileName(
                          selectedEvent.pdfPath
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline hover:text-blue-900"
                      >
                        📄 View PDF Brochure
                      </a>
                    </div>
                  )}

                {/* Event Info */}
                <div className="grid grid-cols-2 gap-x-4">
                  <p>
                    <span className="text-[#930911] font-semibold">Date:</span>{" "}
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-[#930911] font-semibold">Time:</span>{" "}
                    {selectedEvent.time}
                  </p>
                  <p>
                    <span className="text-[#930911] font-semibold">Location:</span>{" "}
                    {selectedEvent.location}
                  </p>
                  <p>
                    <span className="text-[#930911] font-semibold">Organizer:</span>{" "}
                    {selectedEvent.organizer}
                  </p>
                </div>

                <p>
                  <span className="text-[#930911] font-semibold">Description:</span>{" "}
                  {selectedEvent.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Zoom Modal */}
        <AnimatePresence>
          {modalImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) setModalImage(null);
              }}
            >
              <div className="relative max-w-[80%] max-h-[90%]">
                <motion.img
                  src={modalImage}
                  alt="Zoomed"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="object-contain max-h-full max-w-full border-4 border-[#3B82F6] rounded shadow-xl"
                />
                <button
                  className="absolute -top-4 -right-4 bg-[#930911] text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                  onClick={() => setModalImage(null)}
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events;
