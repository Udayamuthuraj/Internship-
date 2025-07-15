// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Pages
import Welcome from "./pages/Welcome";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import Members from "./pages/Members";
import Events from "./pages/Events";
import FacultyDetail from "./pages/FacultyDetail";

// Student
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentHome from "./pages/student/StudentHome";
import StudentSearch from "./pages/student/StudentSearch";
import StudentProfile from "./pages/student/StudentProfile";
import StudentForgotResetPassword from "./pages/student/StudentForgotResetPassword";

// Alumni
import AlumniLogin from "./pages/alumni/AlumniLogin";
import AlumniRegister from "./pages/alumni/AlumniRegister";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import AlumniSearch from "./pages/alumni/AlumniSearch";
import AlumniPost from "./pages/alumni/AlumniPost";
import AlumniProfile from "./pages/alumni/AlumniProfile";
import AlumniEditProfile from "./pages/alumni/AlumniEditProfile";
import AlumniForgotResetPassword from "./pages/alumni/AlumniForgotResetPassword";

// Admin Auth
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminForgotResetPassword from "./pages/admin/AdminForgotResetPassword";

// Admin Dashboard Routes
import AdminRoutes from "./routes/AdminRoutes";



// Fallback Page
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen text-2xl text-red-600 font-semibold">
    404 - Page Not Found
  </div>
);

const App = () => {
  return (
    <Routes>
      {/* 🌐 Public Pages */}
      <Route path="/" element={<Welcome />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/events" element={<Events/>} />
      <Route path="/mambers" element={<Members/>}/>
      <Route path="/faculty/:id" element={<FacultyDetail />} />

      {/* 👨‍🎓 Student Routes */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/student/search" element={<StudentSearch />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route
        path="/student/forgot-reset-password"
        element={<StudentForgotResetPassword />}
      />

      {/* 🎓 Alumni Routes */}
      <Route path="/alumni/login" element={<AlumniLogin />} />
      <Route path="/alumni/register" element={<AlumniRegister />} />
      <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
      <Route path="/alumni/search" element={<AlumniSearch />} />
      <Route path="/alumni/post" element={<AlumniPost />} />
      <Route path="/alumni/profile" element={<AlumniProfile />} />
      <Route path="/alumni/editprofile" element={<AlumniEditProfile />} />
      <Route
        path="/alumni/forgot-reset-password"
        element={<AlumniForgotResetPassword />}
      />

      {/* 🛡️ Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route
        path="/admin/forgot-reset-password"
        element={<AdminForgotResetPassword />}
      />

      {/* 🧑‍💼 Admin Dashboard Protected Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />



      {/* 🔚 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
