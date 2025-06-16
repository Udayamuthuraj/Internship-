import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventPage from './pages/Event/Events';
import EventRegister from './pages/Event/EventRegister';
import UploadEvent from './pages/Event/UploadEvent';
//import ViewRegistered from './pages/ViewRegistered';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventPage />} />
        <Route path="/event-register" element={<EventRegister />} />
        <Route path="/upload-event" element={<UploadEvent />} />
        
      </Routes>
    </Router>
  );
}

export default App;
/*
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadEvent from './pages/Event/UploadEvent'; // ✅ Update path based on actual location

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadEvent />} />
      </Routes>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewRegistered from './pages/Event/ViewRegistered'; // ✅ Update path based on actual location

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ViewRegistered />} />
      </Routes>
    </Router>
  );
}

export default App;
*/