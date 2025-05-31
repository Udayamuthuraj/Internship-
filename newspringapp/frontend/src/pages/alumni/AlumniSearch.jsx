import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Home, Plus, User, LogOut } from 'lucide-react'; // Using lucide-react for consistency

// --- LogoutConfirmationModal Component (Defined inline for this file) ---
// This component displays a confirmation dialog for logout.
function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  // If the modal is not open, don't render anything.
  if (!isOpen) return null;

  return (
    // Modal overlay for darkening the background and centering the modal.
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6 relative transform transition-all">
        {/* Modal Header/Message */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Logout</h2>
        <p className="text-gray-700 text-center mb-6">Are you sure you want to logout?</p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          {/* Cancel button */}
          <button
            onClick={onClose} // Closes the modal without logging out
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
          >
            Cancel
          </button>
          {/* Logout button */}
          <button
            onClick={onConfirm} // Triggers the logout action
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
// --- End of LogoutConfirmationModal Component ---

const AlumniSearch = () => {
  const navigate = useNavigate();

  // State for search term and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Depts');
  const [selectedBatch, setSelectedBatch] = useState('All Batch');
  const [searchResults, setSearchResults] = useState([]);
  const [showConnectMessage, setShowConnectMessage] = useState(false);
  const [connectedUser, setConnectedUser] = useState('');

  // State to control the visibility of the logout confirmation modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


  // Mock student data
  const mockStudents = [
    { id: 1, name: "Arun Kumar", department: "CS", batch: "2024-2026", profileImage: "https://placehold.co/50x50/3498db/ffffff?text=AK" },
    { id: 2, name: "Sneha Reddy", department: "IT", batch: "2025-2027", profileImage: "https://placehold.co/50x50/2ecc71/ffffff?text=SR" },
    { id: 3, name: "Praveen Nair", department: "CS", batch: "2024-2026", profileImage: "https://placehold.co/50x50/e67e22/ffffff?text=PN" },
    { id: 4, name: "Deepika Sharma", department: "IT", batch: "2024-2026", profileImage: "https://placehold.co/50x50/9b59b6/ffffff?text=DS" },
    { id: 5, name: "Rahul Singh", department: "CS", batch: "2024-2026", profileImage: "https://placehold.co/50x50/f39c12/ffffff?text=RS" },
    { id: 6, name: "Priya Patel", department: "IT", batch: "2025-2027", profileImage: "https://placehold.co/50x50/1abc9c/ffffff?text=PP" },
    { id: 7, name: "Vikram Gupta", department: "CS", batch: "2025-2027", profileImage: "https://placehold.co/50x50/8A2BE2/ffffff?text=VG" },
    { id: 8, name: "Neha Sharma", department: "IT", batch: "2024-2026", profileImage: "https://placehold.co/50x50/FF6347/ffffff?text=NS" },
    { id: 9, name: "Siddharth Rao", department: "CS", batch: "2024-2026", profileImage: "https://placehold.co/50x50/4682B4/ffffff?text=SR" },
    { id: 10, name: "Anjali Verma", department: "IT", batch: "2025-2027", profileImage: "https://placehold.co/50x50/DA70D6/ffffff?text=AV" },
  ];

  // Derive unique departments and batches from mock data for filter options
  const departments = ['All Depts', ...new Set(mockStudents.map(s => s.department))];
  const batches = ['All Batch', ...new Set(mockStudents.map(s => s.batch))].sort();

  // Filter logic
  useEffect(() => {
    const filtered = mockStudents.filter(student => {
      const matchesSearchTerm = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'All Depts' || student.department === selectedDepartment;
      const matchesBatch = selectedBatch === 'All Batch' || student.batch === selectedBatch;
      return matchesSearchTerm && matchesDepartment && matchesBatch;
    });
    setSearchResults(filtered);
  }, [searchTerm, selectedDepartment, selectedBatch]);

  // Handle "Connect" button click
  const handleConnect = (studentName) => {
    setConnectedUser(studentName);
    setShowConnectMessage(true);
    // In a real application, you would typically navigate to a chat screen
    // or initiate a connection request here.
    console.log(`Attempting to connect with ${studentName}`);
    setTimeout(() => {
      setShowConnectMessage(false);
      // Example: navigate(`/alumni/messages/${studentId}`);
    }, 2000); // Message disappears after 2 seconds
  };

  // Function to handle logout confirmation
  const handleLogout = () => {
    // In a real application, you would clear user session/token here
    console.log("Logging out from AlumniSearch...");
    setIsLogoutModalOpen(false); // Close the modal
    navigate('/pages/welcome'); // Redirect to Welcome.jsx
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE9D4] to-[#EEC8B9] font-inter pb-12">
      <div className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold text-[#BA3D47] text-center mb-6">Search</h1>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-xl mb-8 flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <select
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 bg-white"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 bg-white"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            {batches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>

        {/* Search Results Display */}
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-[#BA3D47] mb-4 border-b pb-2">Results</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(student => (
                <div key={student.id} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <img
                    src={student.profileImage}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#CA5C62]"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.department} - Batch {student.batch}</p>
                  </div>
                  <button
                    onClick={() => handleConnect(student.name)}
                    className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition duration-200 flex items-center gap-1"
                  >
                    <MessageSquare size={16} /> Connect
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No students found matching your criteria.</p>
          )}
        </div>
      </div>

      {/* Connection Success Message */}
      {showConnectMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-all duration-300 ease-out transform animate-fade-in-up">
          Connecting with {connectedUser}...
        </div>
      )}

      {/* Fixed Footer for navigation (consistent with other alumni pages) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#FFE9D4] flex justify-around items-center py-1 shadow-lg z-10 rounded-t-xl">
        <Link to="/alumni/dashboard" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
          <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
            <Home size={18} className="text-white" />
          </div>
          <span className="text-xxs mt-1 text-[#BA3D47]">Home</span>
        </Link>
        <Link to="/alumni/post" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
          <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
            <Plus size={18} className="text-white" />
          </div>
          <span className="text-xxs mt-1 text-[#BA3D47]">Post</span>
        </Link>
        <Link to="/alumni/profile" className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300">
          <div className="bg-[#930911] hover:bg-[#BA3D47] p-2.5 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
            <User size={18} className="text-white" />
          </div>
          <span className="text-xxs mt-1 text-[#BA3D47]">Profile</span>
        </Link>
        {/* Logout button: now opens modal */}
        <div
          onClick={() => setIsLogoutModalOpen(true)} // Open the modal on click
          className="flex flex-col items-center text-gray-600 hover:text-[#BA3D47] transition duration-300 cursor-pointer"
        >
          <div className="bg-[#930911] hover:bg-[#BA3D47] p-2 rounded-full transition duration-300 ease-in-out shadow-md transform hover:scale-105">
            <LogOut size={18} className="text-white" />
          </div>
          <span className="text-xxs mt-1 text-[#BA3D47]">Logout</span>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} // Close modal
        onConfirm={handleLogout} // Handle logout and redirection
      />
    </div>
  );
};

export default AlumniSearch;
