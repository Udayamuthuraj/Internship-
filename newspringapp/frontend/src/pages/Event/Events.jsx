import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../../assets/unom.jpg";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalImage, setModalImage] = useState(null); // For image modal

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const today = new Date();

  const filterEvents = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      if (activeTab === "upcoming") return eventDate >= today;
      if (activeTab === "past") return eventDate < today;
      return true;
    });
  };

  const getFileName = (path) => path?.split("\\").pop(); // Handles Windows-style paths
  const isUpcoming = (date) => new Date(date) >= today;

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto text-white">
        <h1 className="text-5xl font-extrabold mb-6 text-center glitter-text-with-stroke">
          Alumni Events
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6 animate-fade-in-up">
          {["upcoming", "past", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedEvent(null);
              }}
              className={`px-5 py-2 rounded-xl font-semibold transition-all shadow-lg hover:scale-105 glitter-border ${
                activeTab === tab
                  ? "bg-gradient-active text-white"
                  : "bg-orange-700 text-white hover:bg-orange-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
          {/* Left: Event Titles */}
          <div className="backdrop-blur-md bg-black/60 p-6 rounded-2xl shadow-lg border border-gray-400">
            <h2 className="text-2xl font-semibold mb-4 text-white">Event Titles</h2>
            {filterEvents().map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer p-2 rounded hover:bg-white/10 transition"
              >
                <span className="font-medium text-white">{event.title}</span>
              </div>
            ))}
          </div>

          {/* Right: Event Details */}
          {selectedEvent && (
            <div className="backdrop-blur-md bg-black/60 text-white p-6 rounded-2xl shadow-lg border border-gray-400">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {selectedEvent.title}
              </h2>

              {/* Poster */}
              {selectedEvent.posterPath &&
                /\.(jpe?g|png|gif|webp)$/i.test(selectedEvent.posterPath) && (
                  <div className="mb-4 text-center">
                    <img
                      src={`http://localhost:9090/api/events/poster/${getFileName(selectedEvent.posterPath)}`}
                      alt="Event Poster"
                      className="w-64 mx-auto rounded shadow-lg border cursor-pointer"
                      onClick={() =>
                        setModalImage(
                          `http://localhost:9090/api/events/poster/${getFileName(selectedEvent.posterPath)}`
                        )
                      }
                    />
                  </div>
                )}

              {/* Recap Media */}
              {selectedEvent.recapMediaPath &&
                /\.(jpe?g|png|gif|webp)$/i.test(selectedEvent.recapMediaPath) && (
                  <div className="mb-4 text-center">
                    <img
                      src={`http://localhost:9090/api/events/recap/${getFileName(selectedEvent.recapMediaPath)}`}
                      alt="Recap Media"
                      className="w-64 mx-auto rounded shadow-lg border cursor-pointer"
                      onClick={() =>
                        setModalImage(
                          `http://localhost:9090/api/events/recap/${getFileName(selectedEvent.recapMediaPath)}`
                        )
                      }
                    />
                  </div>
                )}

              {/* QR Code */}
              {selectedEvent.qrCodePath &&
                /\.(jpe?g|png|gif|webp)$/i.test(selectedEvent.qrCodePath) && (
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-300 mb-1">Scan QR to Register</p>
                    <img
                      src={`http://localhost:9090/api/events/qr/${getFileName(selectedEvent.qrCodePath)}`}
                      alt="QR Code"
                      className="w-32 mx-auto rounded shadow border cursor-pointer"
                      onClick={() =>
                        setModalImage(
                          `http://localhost:9090/api/events/qr/${getFileName(selectedEvent.qrCodePath)}`
                        )
                      }
                    />
                  </div>
                )}

              {/* PDF */}
              {selectedEvent.pdfPath &&
                selectedEvent.pdfPath.toLowerCase().endsWith(".pdf") && (
                  <div className="mb-4 text-center">
                    <a
                      href={`http://localhost:9090/api/events/pdf/${getFileName(selectedEvent.pdfPath)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 underline hover:text-blue-500"
                    >
                      📄 View PDF Brochure
                    </a>
                  </div>
                )}

              {/* Event Info */}
              <div className="grid grid-cols-2 gap-x-4 text-sm">
                <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedEvent.time}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
              </div>

              <p className="text-gray-200 text-sm mt-3">
                <strong>Description:</strong> {selectedEvent.description}
              </p>

              {/* Register Button */}
              {isUpcoming(selectedEvent.date) && (
                <div className="text-center mt-5">
                  <button
                    className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md transition-all"
                    onClick={() =>
                      window.location.href = `/event-register?eventId=${selectedEvent.id}`
                    }
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
  <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
    <div className="relative">
      {/* Close Button */}
      <button
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-600 text-white rounded-full px-3 py-1 text-sm hover:bg-red-700 transition"
        onClick={() => setModalImage(null)}
      >
        ✖
      </button>
      {/* Image */}
      <img
        src={modalImage}
        alt="Zoom"
        className="max-w-3xl max-h-[90vh] rounded-lg shadow-lg"
      />
    </div>
  </div>
)}

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }
        .glitter-border:hover {
          box-shadow: 0 0 10px 3px #f97316, 0 0 20px 6px #7f1d1d;
        }
        .glitter-text-with-stroke {
          color: #f97316;
          text-shadow: 0 0 5px #7f1d1d, 0 0 10px #fb923c, 0 0 20px #7f1d1d;
          -webkit-text-stroke: 1px #3b0d0d;
        }
        .bg-gradient-active {
          background: linear-gradient(45deg, #7f1d1d, #f97316);
          box-shadow: 0 0 8px 2px #f97316, 0 0 12px 6px #7f1d1d;
        }
      `}</style>
    </div>
  );
};

export default EventPage;
