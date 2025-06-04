import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../assets/unom.jpg";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const today = new Date();

  const filterEvents = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (activeTab === "upcoming") return eventDate >= today && matchesSearch;
      if (activeTab === "past") return eventDate < today && matchesSearch;
      return matchesSearch;
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      {/* Foreground content */}
      <div className="relative z-10 p-6 text-white transition-all duration-500 ease-in-out">
        <div className="text-center py-4">
          <h1 className="text-5xl font-extrabold mb-2 drop-shadow-xl animate-fade-in glitter-text-with-stroke">
            Alumni Events
          </h1>
        
        </div>

        <div className="max-w-3xl mx-auto mb-4 animate-slide-in">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-md text-black outline-orange-500 focus:outline-orange-700"
          />
        </div>

        <div className="flex justify-center gap-4 mb-6 animate-fade-in-up">
          {["upcoming", "past", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 glitter-border ${
                activeTab === tab
                  ? "bg-gradient-active text-white"
                  : "bg-orange-700 text-white hover:bg-orange-600"
              }`}
            >
              {tab === "upcoming"
                ? "Upcoming"
                : tab === "past"
                ? "Past"
                : "All"}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300">
          {filterEvents().map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-br from-orange-700 to-maroon-900 bg-opacity-90 text-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 glitter-border"
            >
              <img
                src={event.imageUrl || bgImage}
                alt={event.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 space-y-2">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <p className="text-sm text-gray-200">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-base">{event.description}</p>
                <button className="mt-3 px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md transition-all duration-300">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom animations and styles */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }
        .animate-slide-in {
          animation: fade-in 0.8s ease forwards;
        }
        .glitter-border:hover {
          box-shadow: 0 0 10px 3px #f97316, 0 0 20px 6px #7f1d1d;
        }

        /* Glitter text with orange-maroon mixed stroke */
        .glitter-text-with-stroke {
          color: #f97316; /* Orange base */
          text-shadow:
            0 0 5px #7f1d1d,    /* Maroon shadow */
            0 0 10px #fb923c,   /* Orange glow */
            0 0 20px #7f1d1d;   /* Maroon glow */
          -webkit-text-stroke: 1px #3b0d0d; /* Dark maroon stroke */
          position: relative;
        }

        /* Simple black glitter text for subtitle */
        .glitter-black-text-simple {
          color: black;
          font-style: normal;
          text-shadow:
            0 0 3px #f97316,
            0 0 7px #7f1d1d;
          letter-spacing: 0.03em;
        }

        /* Gradient background for active tab buttons */
        .bg-gradient-active {
          background: linear-gradient(45deg, #7f1d1d, #f97316);
          box-shadow: 0 0 8px 2px #f97316, 0 0 12px 6px #7f1d1d;
        }

        /* Custom orange-maroon gradient for cards */
        .from-orange-700 {
          --tw-gradient-from: #c2410c;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(194 65 12 / 0));
        }
        .to-maroon-900 {
          --tw-gradient-to: #4b0000;
        }
      `}</style>
    </div>
  );
};

export default EventPage;
