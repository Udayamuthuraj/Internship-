import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored session data
    localStorage.removeItem("adminToken"); // or whatever key you're using
    localStorage.removeItem("adminInfo");

    // Optionally show a toast message or animation (if added globally)

    // Redirect to login page after short delay
    const timer = setTimeout(() => {
      navigate("/admin/login");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-[#FFE9D4]">
      <h2 className="text-2xl font-bold text-[#930911] mb-4">
        Logging you out...
      </h2>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#930911] border-opacity-70" />
    </div>
  );
};

export default Logout;
