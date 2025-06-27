// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";

import Gallery from "./pages/Gallery";

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
import AlumniAllPosts from './pages/alumni/AlumniAllPosts';
import AlumniProfile from "./pages/alumni/AlumniProfile";
import AlumniEditProfile from "./pages/alumni/AlumniEditProfile";
import AlumniResetPassword from "./pages/alumni/AlumniResetPassword";

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

        <Route path="/gallery" element={<Gallery />} />

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/home" element={<StudentHome />} />
        <Route path="/student/search" element={<StudentSearch />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Alumni Routes */}
        <Route path="/alumni/login" element={<AlumniLogin />} />
        <Route path="/alumni/register" element={<AlumniRegister />} />
        <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
        <Route path="/alumni/search" element={<AlumniSearch />} />
        <Route path="/alumni/post" element={<AlumniPost />} />
        <Route path="/alumni/posts" element={<AlumniAllPosts />} />
        <Route path="/alumni/profile" element={<AlumniProfile />} />
        <Route path="/alumni/editprofile" element={<AlumniEditProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path ="admin/register" element = {<AdminRegister/>}/>
   
        {/*event route */}
        <Route path= "/events" element ={<EventPage/>} />
        
        <Route path= "/faculty/:id" element ={<FacultyDetail/>} />

      </Routes>
    </Router>
  );
}

export default App;
