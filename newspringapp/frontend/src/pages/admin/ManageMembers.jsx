import React, { useEffect, useState } from "react";
import axios from "axios";

const roles = ["president", "vicepresident", "treasurer"];

const ManageMembers = () => {
  const [members, setMembers] = useState({
    president: { name: "", email: "" },
    vicepresident: { name: "", email: "" },
    treasurer: { name: "", email: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("/api/admin/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (role, field, value) => {
    setMembers((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  const handleSave = async (role) => {
    setSaving(role);
    try {
      await axios.put(`/api/admin/members/${role}`, members[role]);
      alert(`${role} updated successfully.`);
    } catch (err) {
      console.error(`Failed to update ${role}:`, err);
      alert("Update failed. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-[#930911] mb-6">
        Manage Key Members
      </h2>

      {loading ? (
        <p>Loading members...</p>
      ) : (
        roles.map((role) => (
          <div
            key={role}
            className="mb-6 border border-gray-200 p-4 rounded shadow-sm"
          >
            <h3 className="text-xl font-semibold capitalize mb-4 text-[#BA3D47]">
              {role.replace(/([A-Z])/g, " $1")}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={members[role].name}
                onChange={(e) => handleChange(role, "name", e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={members[role].email}
                onChange={(e) => handleChange(role, "email", e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <button
                onClick={() => handleSave(role)}
                disabled={saving === role}
                className="bg-[#930911] text-white px-4 py-2 rounded hover:bg-[#BA3D47] transition"
              >
                {saving === role ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageMembers;
