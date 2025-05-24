import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-800 text-white p-4 flex justify-between">
      <div className="font-bold">CSITAA</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/about">About</Link>
        <Link to="/student/login">Student</Link>
        <Link to="/alumni/login">Alumni</Link>
        <Link to="/admin/login">Admin</Link>
      </div>
    </nav>
  );
}
