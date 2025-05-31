import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const alumniData = [
  {
    id: 1,
    name: "Ravi Kumar",
    place: "Chennai",
    job: "Software Developer",
    company: "TCS",
    department: "CSE",
  },
  {
    id: 2,
    name: "Meena Sharma",
    place: "Bangalore",
    job: "Data Analyst",
    company: "Infosys",
    department: "IT",
  },
  {
    id: 3,
    name: "Aarav Reddy",
    place: "Hyderabad",
    job: "UX Designer",
    company: "Adobe",
    department: "CSE",
  },
];

const StudentSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    place: "",
    company: "",
    department: "",
    sortBy: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredAlumni = alumniData
    .filter((alumnus) => {
      const matchesSearch =
        alumnus.name.toLowerCase().includes(searchText.toLowerCase()) ||
        alumnus.job.toLowerCase().includes(searchText.toLowerCase());
      const matchesPlace = filters.place
        ? alumnus.place === filters.place
        : true;
      const matchesCompany = filters.company
        ? alumnus.company === filters.company
        : true;
      const matchesDepartment = filters.department
        ? alumnus.department === filters.department
        : true;

      return matchesSearch && matchesPlace && matchesCompany && matchesDepartment;
    })
    .sort((a, b) => {
      if (filters.sortBy === "place") {
        return a.place.localeCompare(b.place);
      } else if (filters.sortBy === "company") {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f8] to-white py-10 px-4 sm:px-10">
      <h1 className="text-4xl font-bold text-center text-[#930911] mb-10">
        Search Alumni
      </h1>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or job..."
            value={searchText}
            onChange={handleSearchTextChange}
            className="w-full md:w-[35%] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#930911]"
          />

          {/* Dropdown Filters */}
          <div className="flex flex-wrap gap-4 w-full md:w-[60%]">
            <select
              name="place"
              value={filters.place}
              onChange={handleFilterChange}
              className="dropdown"
            >
              <option value="">All Places</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>

            <select
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              className="dropdown"
            >
              <option value="">All Companies</option>
              <option value="TCS">TCS</option>
              <option value="Infosys">Infosys</option>
              <option value="Adobe">Adobe</option>
            </select>

            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="dropdown"
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
            </select>

            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="dropdown"
            >
              <option value="">Sort By</option>
              <option value="place">Place</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto space-y-6">
        {filteredAlumni.length === 0 ? (
          <p className="text-center text-gray-500">No matching profiles found.</p>
        ) : (
          filteredAlumni.map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <FaUserCircle className="text-4xl text-[#930911]" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {alumnus.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {alumnus.job} @ {alumnus.company}
                  </p>
                  <p className="text-sm text-gray-500">
                    {alumnus.department} | {alumnus.place}
                  </p>
                </div>
              </div>
              <button className="bg-[#930911] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#b5313a] transition">
                Connect
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentSearch;
