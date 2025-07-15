import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ViewRegistered = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [alumniCount, setAlumniCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/view-registrations/latest")
      .then((res) => {
        const fetched = res.data.registrations || [];
        setRegistrations(fetched);
        setStudentCount(res.data.studentCount || 0);
        setAlumniCount(res.data.alumniCount || 0);
      })
      .catch((err) => console.error("Error fetching registrations:", err));
  }, []);

  const fetchDetails = (id) => {
    const person = registrations.find((r) => r.id === id);
    setSelected(person);
  };

  return (
    <div className="min-h-screen text-white py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/events/all")}
          className="backdrop-blur-md bg-black/60 text-white px-4 py-2 text-sm rounded-lg shadow-lg border border-gray-400 flex items-center gap-2 "

        >
          <ArrowLeft size={16} />
          Back to Events
        </motion.button>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-black mb-4 text-center drop-shadow-xl">
          Registered Participants
        </h1>
        <div className="text-center mb-6 text-lg font-semibold">
          👨‍🎓 Students: {studentCount} &nbsp; | &nbsp; 🎓 Alumni: {alumniCount}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registrations List */}
          <div className="backdrop-blur-md bg-black/60 text-white p-6 rounded-2xl shadow-lg border border-gray-400">
            <h2 className="text-2xl font-semibold mb-4">Participants</h2>
            {registrations.length === 0 ? (
              <p className="text-gray-300">No registrations found.</p>
            ) : (
              registrations.map((s) => (
                <div
                  key={s.id}
                  onClick={() => fetchDetails(s.id)}
                  className="cursor-pointer p-2 rounded hover:bg-white/10 transition-colors"
                >
                  <span className="font-medium text-white">{s.name}</span> — {s.course} ({s.role})
                </div>
              ))
            )}
          </div>

          {/* Selected User Details */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-md bg-black/60 text-white p-6 rounded-2xl shadow-lg border border-gray-400"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Details for: {selected.name}
              </h2>
              <p className="mb-1"><strong>Batch:</strong> {selected.batch}</p>
              <p className="mb-1"><strong>Role:</strong> {selected.role}</p>
              <p className="mb-1"><strong>Course:</strong> {selected.course}</p>
              <p className="mb-3"><strong>Event Title:</strong> {selected.eventTitle}</p>

              {selected.paymentScreenshotPath && (
                <div className="mt-4">
                  <p className="font-semibold">Payment Screenshot:</p>
                  <img
                    src={`http://localhost:8080/api/payment-screenshot/${selected.paymentScreenshotPath}`}
                    alt="Payment Screenshot"
                    className="mt-2 w-60 border rounded shadow"
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRegistered;
