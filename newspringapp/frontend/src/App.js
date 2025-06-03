// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";


// Student pages
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentHome from "./pages/student/StudentHome";
import StudentSearch from "./pages/student/StudentSearch";
import StudentProfile from "./pages/student/StudentProfile";

// Alumni pages
import AlumniLogin from "./pages/alumni/AlumniLogin";
import AlumniRegister from "./pages/alumni/AlumniRegister";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import AlumniSearch from "./pages/alumni/AlumniSearch";
import AlumniPost from "./pages/alumni/AlumniPost";
import AlumniProfile from "./pages/alumni/AlumniProfile";
import AlumniEditProfile from "./pages/alumni/AlumniEditProfile";

// Admin pagesLog
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacultyDetail from "./pages/FacultyDetail";  // <-- New import

//other pages
import EventPage from "./pages/Events";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Welcome Page */}
        <Route path="/" element={<Welcome />} />

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/StudentDashboard" element={<StudentDashboard />} />

        {/* Alumni Routes */}
        <Route path="/alumni/login" element={<AlumniLogin />} />
        <Route path="/alumni/register" element={<AlumniRegister />} />
        <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
        <Route path="/alumni/search" element={<AlumniSearch />} />
        <Route path="/alumni/post" element={<AlumniPost />} />
        <Route path="/alumni/profile" element={<AlumniProfile />} />
        <Route path="/alumni/editprofile" element={<AlumniEditProfile />} />
        <Route path="/pages/welcome" element={<Welcome />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
<<<<<<< HEAD
=======
        <Route path="/admin/register" element={<AdminRegister />} />

>>>>>>> aa5ea29 (Initial commit)
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/*event route */}
        <Route path= "/events" element ={<EventPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
