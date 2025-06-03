import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewStats = () => {
  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalStudents: 0,
    resumesUploaded: 0,
    resumesNotUploaded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/admin/stats");
      setStats(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading statistics...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-3xl font-bold text-[#930911] mb-6">Statistics</h2>
      <ul className="list-disc list-inside text-lg space-y-3">
        <li>
          Total Alumni: <strong>{stats.totalAlumni}</strong>
        </li>
        <li>
          Total Students: <strong>{stats.totalStudents}</strong>
        </li>
        <li>
          Resumes Uploaded: <strong>{stats.resumesUploaded}</strong>
        </li>
        <li>
          Resumes Not Uploaded: <strong>{stats.resumesNotUploaded}</strong>
        </li>
      </ul>
    </div>
  );
};

export default ViewStats;
