import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout & Protection
import ProtectedRoute from "../components/admin/layout/ProtectedRoute";
import AdminLayout from "../components/admin/layout/AdminLayout";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";

// Events
import EventRegister from "../pages/Event/EventRegister";
import Events from "../pages/Event/Events";
import UploadEvent from "../pages/Event/UploadEvent";
import ViewRegistered from "../pages/Event/ViewRegistered";

// Gallery
import GalleryPage from "../pages/admin/Gallery/GalleryPage";

// Video
import VideoPage from "../pages/admin/Video/VideoPage";

// Members
import MembersPage from "../pages/admin/Members/MembersPage";

// Statistics
import StatisticsPage from "../pages/admin/Statistics/StatisticsPage";

// Broadcast
import EmailBroadcastPage from "../pages/admin/Broadcast/EmailBroadcastPage";

// Feedback
import FeedbackPage from "../pages/admin/Feedback/FeedbackPage";

// Settings
import ForgotPassword from "../pages/admin/Settings/ForgotPassword";
import ProfileSettings from "../pages/admin/Settings/ProfileSettings";

// 404 Fallback Page
const NotFound = () => (
  <div className="flex items-center justify-center h-full text-red-600 font-bold text-xl">
    404 - Admin Page Not Found
  </div>
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Events */}
          <Route path="events/register" element={<EventRegister />} />
          <Route path="events/all" element={<Events />} />
          <Route path="events/upload" element={<UploadEvent />} />
          <Route path="events/registered" element={<ViewRegistered />} />

          {/* Gallery */}
          <Route path="gallery" element={<GalleryPage />} />

          {/* Videos */}
          <Route path="videos" element={<VideoPage />} />

          {/* Members */}
          <Route path="members" element={<MembersPage />} />

          {/* Statistics */}
          <Route path="statistics" element={<StatisticsPage />} />

          {/* Broadcast */}
          <Route path="broadcast" element={<EmailBroadcastPage />} />

          {/* Feedback */}
          <Route path="feedback" element={<FeedbackPage />} />

          {/* Settings */}
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="settings/profile" element={<ProfileSettings />} />
        </Route>
      </Route>

      {/* Fallback route outside protected scope */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
