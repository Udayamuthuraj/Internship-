import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../assets/unom.jpg"; // Use a classy alumni meet backdrop

const ViewRecap = () => {
  const [recaps, setRecaps] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/events/recap")
      .then((res) => setRecaps(res.data))
      .catch((err) => console.error("Error loading recaps:", err));
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Blurred dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Foreground content */}
      <div className="relative z-10 text-white px-6 py-10">
        <h1 className="text-5xl text-center font-extrabold mb-8 glitter-text-with-stroke">
        Event Recaps
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {recaps.length === 0 ? (
            <p className="text-center col-span-full text-gray-300">
              No recaps uploaded yet.
            </p>
          ) : (
            recaps.map((recap) => (
              <div
                key={recap.id}
                className="bg-gradient-to-br from-orange-700 to-maroon-900 bg-opacity-90 rounded-2xl shadow-xl p-4 overflow-hidden transition-transform transform hover:scale-105 glitter-border"
              >
                {recap.mediaType === "image" && (
                  <img
                    src={recap.mediaUrl}
                    alt="Recap"
                    className="w-full h-52 object-cover rounded-md mb-3"
                  />
                )}
                {recap.mediaType === "video" && (
                  <video
                    controls
                    src={recap.mediaUrl}
                    className="w-full h-52 object-cover rounded-md mb-3"
                  />
                )}
                {recap.mediaType === "pdf" && (
                  <a
                    href={recap.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-black/70 text-orange-400 py-3 rounded-md mb-3 hover:underline"
                  >
                    📄 View PDF Recap
                  </a>
                )}
                <h2 className="text-2xl font-semibold">{recap.title}</h2>
                <p className="text-sm text-gray-300 mb-2">
                  📅 {new Date(recap.date).toLocaleDateString()}
                </p>
                <p className="text-base">{recap.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        .glitter-border:hover {
          box-shadow: 0 0 10px 3px #f97316, 0 0 20px 6px #7f1d1d;
        }
        .glitter-text-with-stroke {
          color: #f97316;
          text-shadow:
            0 0 5px #7f1d1d,
            0 0 10px #fb923c,
            0 0 20px #7f1d1d;
          -webkit-text-stroke: 1px #3b0d0d;
        }
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

export default ViewRecap;
