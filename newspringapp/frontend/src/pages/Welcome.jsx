import React, { useEffect, useState } from 'react';
import { FaInstagram, FaTwitter, FaEnvelope, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';

import unomLogo from '../assets/unomlogo.png';
import backgroundImage from '../assets/unomstu1.jpg';

import faculty1 from '../assets/HODsir.jpg';
import faculty2 from '../assets/LAVANYAmam.jpg';
import faculty3 from '../assets/SORNAMmam.jpg';
import faculty4 from '../assets/CHITHRAmam.jpg';

import '@fontsource/figtree/400.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';

const facultyData = [
  {
    name: 'Dr. S. Gopinathan',
    title: 'Professor and Head',
    qualification: 'M.Sc., Ph.D.',
    image: faculty1,
  },
  {
    name: 'Dr. B. Lavanya',
    title: 'Associate Professor',
    qualification: 'M.C.A., Ph.D.',
    image: faculty2,
  },
  {
    name: 'Dr. M. Sornam',
    title: 'Professor',
    qualification: 'M.Sc., M.C.A., Ph.D.',
    image: faculty3,
  },
  {
    name: 'Dr. PL. Chithra',
    title: 'Professor',
    qualification: 'M.C.A., M.Phil., Ph.D.',
    image: faculty4,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const WelcomePage = () => {
  const [count, setCount] = useState(0);
  const target = 1245;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 10);
    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(counter);
        setCount(target);
      } else {
        setCount(Math.floor(start));
      }
    }, 10);
    return () => clearInterval(counter);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      document.body.style.backgroundPosition = `center ${scroll * 0.5}px`;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center overflow-x-hidden transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: "'Figtree', sans-serif",
      }}
    >
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 bg-white bg-opacity-90 shadow-lg backdrop-blur-md px-8 py-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-3 text-[#930911] font-bold text-xl">
          <img src={unomLogo} alt="University Logo" className="h-10 w-10" />
          <span>University Of Madras</span>
        </div>
        <ul className="flex space-x-6 font-semibold text-[#930911]">
          <li><a href="#events" className="hover:text-[#BA3D47]">Events</a></li>
          <li><a href="#gallery" className="hover:text-[#BA3D47]">Gallery</a></li>
          <li><a href="#about" className="hover:text-[#BA3D47]">About</a></li>
          <li><a href="/admin" className="hover:text-[#BA3D47]">Admin</a></li>
        </ul>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-52 px-6 min-h-[120vh] flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative z-10 px-14 py-20 rounded-3xl max-w-6xl w-full">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-8xl font-extrabold text-[#FF4B4B] mb-10 drop-shadow-2xl"
          >
            Welcome to CSITAA
          </motion.h1>
          <h2 className="text-4xl text-white mb-10 drop-shadow-2xl">
            Computer Science and IT Alumni Association
          </h2>
          <p className="text-white text-2xl max-w-4xl mx-auto drop-shadow-xl leading-relaxed">
            Uniting students and alumni to share opportunities, achievements, and memories from our vibrant community.
          </p>
          <div className="mt-12 space-x-8">
            <a
              href="/student/Register"
              className="bg-[#930911] hover:bg-[#BA3D47] text-white px-10 py-5 rounded-2xl text-xl font-bold transition inline-block"
            >
              Join as Student
            </a>
            <a
              href="/alumni"
              className="bg-white text-[#930911] hover:bg-[#FFE9D4] px-10 py-5 rounded-2xl text-xl font-bold border border-[#930911] transition inline-block"
            >
              Explore Alumni
            </a>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-6 py-20 bg-white bg-opacity-20 backdrop-blur-lg text-center rounded-xl max-w-7xl mx-auto shadow-2xl"
      >
        <motion.h3 variants={item} className="text-3xl font-semibold text-[#930911] mb-12">
          Leadership Spotlight
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {facultyData.map((faculty, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-3xl shadow-lg border bg-[#FFE9D4] border-[#EEC8B9] transition"
            >
              <img
                src={faculty.image}
                alt={faculty.name}
                className="h-28 w-28 mx-auto rounded-full mb-4 border-4 border-[#BA3D47] object-cover"
              />
              <p className="text-[#BA3D47] font-medium">{faculty.title}</p>
              <h4 className="text-lg font-semibold text-[#930911]">{faculty.name}</h4>
              <p className="text-sm italic text-[#930911]">{faculty.qualification}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Alumni Counter */}
      <motion.section className="text-center py-16 bg-[#EEC8B9]">
        <h3 className="text-5xl font-bold text-[#930911] tracking-wide animate-pulse">
           {count.toLocaleString()} Alumni Registered
        </h3>
      </motion.section>

      {/* Contact Section */}
      <section
        id="about"
        className="bg-white bg-opacity-30 backdrop-blur-sm py-16 text-center rounded-xl max-w-4xl mx-auto shadow-lg"
      >
        <h3 className="text-3xl font-semibold text-[#930911] mb-6">Connect With Us</h3>
        <div className="flex justify-center gap-10 text-3xl text-[#930911]">
          <a href="mailto:csitaa@university.edu" className="hover:text-[#BA3D47] transition">
            <FaEnvelope />
          </a>
          <a href="https://instagram.com/CSITAA" className="hover:text-[#BA3D47] transition">
            <FaInstagram />
          </a>
          <a href="https://twitter.com/CSITAA" className="hover:text-[#BA3D47] transition">
            <FaTwitter />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-[#930911] bg-[#FFE9D4] font-medium">
        &copy; 2025 CSITAA – All rights reserved.
      </footer>

      {/* Chatbot Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-[#930911] hover:bg-[#BA3D47] text-white p-4 rounded-full shadow-xl z-50 animate-bounce"
        onClick={() => alert('Launching Chatbot...')}
      >
        <FaRobot size={24} />
      </motion.button>
    </div>
  );
};

export default WelcomePage;
