import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/admin/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/admin/events", newEvent);
      setNewEvent({ title: "", date: "", description: "" });
      fetchEvents();
    } catch (err) {
      console.error("Event creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/api/admin/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/events/${editingEvent.id}`, editingEvent);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Failed to update event", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-[#930911] mb-6">Manage Events</h2>

      {/* Create Event Form */}
      <form onSubmit={handleCreateEvent} className="space-y-4 mb-8">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleInputChange}
            required
            className="input-style w-full"
          />
        </div>
        <div>
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleInputChange}
            required
            className="input-style w-full"
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleInputChange}
            rows="4"
            required
            className="input-style w-full"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#930911] text-white px-6 py-2 rounded hover:bg-[#BA3D47] transition"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {/* Edit Event Form */}
      {editingEvent && (
        <form onSubmit={handleUpdateEvent} className="mb-8 space-y-4 bg-gray-100 p-4 rounded-md">
          <h3 className="text-xl font-semibold">Edit Event</h3>
          <input
            type="text"
            name="title"
            value={editingEvent.title}
            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            className="input-style w-full"
          />
          <input
            type="date"
            name="date"
            value={editingEvent.date}
            onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
            className="input-style w-full"
          />
          <textarea
            name="description"
            value={editingEvent.description}
            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            className="input-style w-full"
            rows="4"
          />
          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Update
            </button>
            <button onClick={() => setEditingEvent(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Event List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-gray-300 p-4 rounded-md shadow-sm bg-gray-50 flex justify-between items-start"
          >
            <div>
              <h4 className="text-lg font-semibold text-[#930911]">{event.title}</h4>
              <p className="text-sm text-gray-700">{event.date}</p>
              <p className="mt-1">{event.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEditEvent(event)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEvents;
