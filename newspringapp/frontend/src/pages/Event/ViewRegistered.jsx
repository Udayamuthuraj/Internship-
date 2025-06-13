import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../../assets/unom.jpg"; // adjust this path if needed

const ViewRegistered = () => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/view-registrations")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchDetails = (id) => {
    axios
      .get(`http://localhost:9090/api/view-registrations/${id}`)
      .then((res) => setSelected(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6 text-center drop-shadow-xl">
          Registered Participants
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-md bg-black/60 text-white p-6 rounded-2xl shadow-lg border border-gray-400">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Students List
            </h2>
            {students.map((s) => (
              <div
                key={s.id}
                onClick={() => fetchDetails(s.id)}
                className="cursor-pointer p-2 rounded hover:bg-white/10"
              >
                <span className="font-medium text-white">{s.name}</span> — {s.course}
              </div>
            ))}
          </div>

          {selected && (
            <div className="backdrop-blur-md bg-black/60 text-white p-6 rounded-2xl shadow-lg border border-gray-400">
              <h2 className="text-2xl font-semibold mb-4">
                Details for: {selected.name}
              </h2>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Register No:</strong> {selected.regNo}</p>
              <p><strong>Department:</strong> {selected.department}</p>
              <p><strong>Course:</strong> {selected.course}</p>
              <p><strong>Batch:</strong> {selected.batch}</p>
              <p><strong>Event Title:</strong> {selected.eventTitle}</p>
              <p><strong>Role:</strong> {selected.role}</p>

              {selected.paymentScreenshotPath && (
                <div className="mt-4">
                  <p className="font-semibold">Payment Screenshot:</p>
                  <img
                    src={`http://localhost:9090/api/screenshot/${selected.paymentScreenshotPath}`}
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
