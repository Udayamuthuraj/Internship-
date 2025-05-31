import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../assets/unom.jpg';

function EventCard({ event, isPast = false }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 flex flex-col md:flex-row">
      <div className="md:w-1/3 w-full h-64 md:h-auto">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 md:w-2/3">
        <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
        <p className="text-sm text-gray-500 mb-2">{event.date}</p>
        <p className="text-gray-700 mb-4">{event.desc}</p>
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            isPast
              ? 'border border-gray-500 text-gray-500 hover:bg-gray-100'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isPast ? 'View Recap' : 'Register'}
        </button>
      </div>
    </div>
  );
}

function EventPage() {
  const [tab, setTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/events')
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const today = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= today);
  const past = events.filter((e) => new Date(e.date) < today);
  const allEvents = [...upcoming, ...past];

  const filter = (list) =>
    list.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );

  const tabs = [
    { key: 'upcoming', label: 'Upcoming Events', data: filter(upcoming) },
    { key: 'past', label: 'Past Events', data: filter(past) },
    { key: 'all', label: 'All Events', data: filter(allEvents) },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-10"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-white py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Alumni Event Portal</h1>
            <p className="text-sm mb-4">Celebrate, Connect, Contribute</p>
            <div className="flex justify-center gap-2">
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 text-black"
              />
              <button
                onClick={() => setSearch('')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-md font-medium ${
                  tab === key
                    ? 'bg-white text-black'
                    : 'text-white border border-white hover:bg-white hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            {tabs
              .find((t) => t.key === tab)
              ?.data.map((event, idx) => (
                <EventCard
                  key={idx}
                  event={event}
                  isPast={new Date(event.date) < today}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
