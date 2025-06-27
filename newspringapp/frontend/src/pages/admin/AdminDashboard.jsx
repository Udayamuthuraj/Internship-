import React, { useState } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#930911] text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-[#BA3D47]">
          Admin Dashboard
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-4">
          <button
            onClick={() => setActiveTab("events")}
            className={`text-left px-4 py-3 rounded ${
              activeTab === "events" ? "bg-[#BA3D47]" : "hover:bg-[#BA3D47]/70"
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`text-left px-4 py-3 rounded ${
              activeTab === "gallery" ? "bg-[#BA3D47]" : "hover:bg-[#BA3D47]/70"
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`text-left px-4 py-3 rounded ${
              activeTab === "stats" ? "bg-[#BA3D47]" : "hover:bg-[#BA3D47]/70"
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`text-left px-4 py-3 rounded ${
              activeTab === "members" ? "bg-[#BA3D47]" : "hover:bg-[#BA3D47]/70"
            }`}
          >
            Key Members
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`text-left px-4 py-3 rounded ${
              activeTab === "email" ? "bg-[#BA3D47]" : "hover:bg-[#BA3D47]/70"
            }`}
          >
            Broadcast Email
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-10 bg-white">
        {activeTab === "events" && (
          <section>
            <h1 className="text-3xl font-bold mb-6 text-[#930911]">Manage Events</h1>
            {/* TODO: Add event create/edit/delete UI */}
            <p>This is where you will create, edit, or delete university events.</p>
          </section>
        )}

        {activeTab === "gallery" && (
          <section>
            <h1 className="text-3xl font-bold mb-6 text-[#930911]">Manage Gallery</h1>
            {/* TODO: Add gallery upload & management UI */}
            <p>Upload and manage gallery pictures for university events.</p>
          </section>
        )}

        {activeTab === "stats" && (
          <section>
            <h1 className="text-3xl font-bold mb-6 text-[#930911]">Statistics</h1>
            {/* TODO: Fetch and display stats */}
            <ul className="list-disc ml-5 text-lg">
              <li>Total Alumni: <strong>Loading...</strong></li>
              <li>Total Students: <strong>Loading...</strong></li>
              <li>Resumes Uploaded: <strong>Loading...</strong></li>
              <li>Resumes Not Uploaded: <strong>Loading...</strong></li>
            </ul>
          </section>
        )}

        {activeTab === "members" && (
          <section>
            <h1 className="text-3xl font-bold mb-6 text-[#930911]">Key Members</h1>
            {/* TODO: Edit Treasurer, President, Vice President details */}
            <p>Edit details of key association members here.</p>
          </section>
        )}

        {activeTab === "email" && (
          <section>
            <h1 className="text-3xl font-bold mb-6 text-[#930911]">Broadcast Email</h1>
            {/* TODO: Email form to send announcements */}
            <p>Send emails to all registered alumni and students.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;