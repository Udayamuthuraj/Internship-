import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../../assets/unom.jpg";

const ViewRegistered = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [alumniCount, setAlumniCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:9090/api/view-registrations/latest")
      .then((res) => {
        console.log("API response:", res.data); // helpful for debugging

        const fetched = res.data.registrations || [];
        setRegistrations(fetched);
        setStudentCount(res.data.studentCount || 0);
        setAlumniCount(res.data.alumniCount || 0);
      })
      .catch((err) => console.error("Error fetching registrations:", err));
  }, []);

  const fetchDetails = (id) => {
    const person = registrations.find(r => r.id === id);
    setSelected(person);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-4 text-center drop-shadow-xl">
          Registered Participants
        </h1>

        <div className="text-center mb-6 text-lg font-semibold">
          👨‍🎓 Students: {studentCount} | 🎓 Alumni: {alumniCount}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-md bg-black/60 text-white p-6 rounded-2xl shadow-lg border border-gray-400">
            <h2 className="text-2xl font-semibold mb-4">Participants</h2>
            {registrations.length === 0 ? (
              <p>No registrations found.</p>
            ) : (
              registrations.map((s) => (
                <div
                  key={s.id}
                  onClick={() => fetchDetails(s.id)}
                  className="cursor-pointer p-2 rounded hover:bg-white/10"
                >
                  <span className="font-medium text-white">{s.name}</span> — {s.course} ({s.role})
                </div>
              ))
            )}
          </div>

          {selected && (
            <div className="backdrop-blur-md bg-black/60 text-white p-6 rounded-2xl shadow-lg border border-gray-400">
              <h2 className="text-2xl font-semibold mb-4">
                Details for: {selected.name}
              </h2>
              <p><strong>Batch:</strong> {selected.batch}</p>
              <p><strong>Role:</strong> {selected.role}</p>
              <p><strong>Course:</strong> {selected.course}</p>
              <p><strong>Event Title:</strong> {selected.eventTitle}</p>
              {selected.paymentScreenshotPath && (
                <div className="mt-4">
                  <p className="font-semibold">Payment Screenshot:</p>
                  <img
                    src={`http://localhost:9090/api/payment-screenshot/${selected.paymentScreenshotPath}`}
                    alt="Payment Screenshot"
                    className="mt-2 w-60 border rounded shadow"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRegistered;
