import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

import faculty1 from '../assets/HODsir.png';
import faculty2 from '../assets/LAVANYAmam.jpg';
import faculty3 from '../assets/SORNAMmam.jpg';
import faculty4 from '../assets/CHITHRAmam.jpg';

const facultyData = {
  gopinathan: {
    name: 'Dr. S. Gopinathan',
    title: 'Professor and Head',
    qualification: 'M.Sc., Ph.D.',
    image: faculty1,
    bio: "Dr. S. Gopinathan is Professor and Head in the Department of Computer Science, University of Madras. He/She has graduated in Published 36 publications in Indian / international journals and papers in national/international seminars, organized & participated in 5 workshops/seminars. His/Her area of specialization is/are Digital Image Processing, Software Engineering, Computer Architecture and Data mining.",
    contact: {
      phone1: '044- 22202905',
      phone2: '9443627956',
      email1: 'gnathans2002@unom.ac.in',
      email2: 'gnathans2002@gmail.com',
      address: [
        'Department of Computer Science',
        'University of Madras',
        'Guindy Campus',
        'Chennai - 600 025. Tamilnadu',
      ],
    },
  },
  lavanya: {
    name: 'Dr. B. Lavanya',
    title: 'Associate Professor',
    qualification: 'M.C.A., Ph.D',
    image: faculty2,
    bio: "Dr. B. Lavanya specializes in software engineering and cloud computing. She is passionate about mentoring students and fostering industry collaborations.",
    contact: {
      phone1: '044- 22202906',
      phone2: '9840928510',
      email1: 'lavanmu@unom.ac.in',
      email2: 'lavanmu@gmail.com',
      address: [
        'Department of Computer Science',
        'University of Madras',
        'Guindy Campus',
        'Chennai - 600 025. Tamilnadu',
      ],
    },
  },
  sornam: {
    name: 'Dr. M. Sornam',
    title: 'Professor',
    qualification: 'M.Sc., M.C.A., Ph.D',
    image: faculty3,
    bio: "Dr. M. Sornam is Professor in the Department of Computer Science, University of Madras. He/She has graduated in Published 112 publications in Indian / international journals and papers in national/international seminars, organized & participated in 56 workshops/seminars. His/Her area of specialization is/are Artificial Neural Networks.",
    contact: {
      phone1: '044- 22202904',
      phone2: '9841166535',
      email1: 'godsor28@unom.ac.in',
      email2: 'madasamy.sornam@gmail.com',
      address: [
        'Department of Computer Science',
        'University of Madras',
        'Guindy Campus',
        'Chennai - 600 025. Tamilnadu',
      ],
    },
  },
  chithra: {
    name: 'Dr. PL. Chithra',
    title: 'Professor',
    qualification: 'M.C.A., M.Phil., Ph.D',
    image: faculty4,
    bio: "Dr. Mrs. PL. Chithra is Professor in the Department of Computer Science, University of Madras. He/She has graduated in B.Sc (Physics), MCA (Computer Applications), M.Phil (Computer Science), Ph.D (Computer Science). Published 65 publications in Indian / international journals and papers in national/international seminars, organized & participated in 135 workshops/seminars. His/Her area of specialization is/are Digital Image Processing, 2D and 3D LiDAR Point Cloud Compression, and Computer Vision, Medical Image Processing, Artificial Intelligence, Machine Learning, Deep Learning, Network Security and Block Chain Techniques.",
    contact: {
      phone1: '044- 22202902',
      phone2: '9176202211',
      email1: 'chitra.cs@unom.ac.in',
      email2: 'chitrasp2001@yahoo.com',
      address: [
        'Department of Computer Science',
        'University of Madras',
        'Guindy Campus',
        'Chennai - 600 025. Tamilnadu',
      ],
    },
  },
};

const FacultyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faculty = facultyData[id];

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFE9D4] font-sans text-[#930911] p-6">
        <h2 className="text-3xl font-bold">Faculty not found</h2>
      </div>
    );
  }

  const { contact } = faculty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#FFE9D4] font-sans text-[#930911] px-6 py-16 flex flex-col items-center max-w-4xl mx-auto rounded-xl shadow-lg"
    >
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-6 flex items-center gap-2 text-[#930911] hover:text-[#BA3D47] font-semibold"
        aria-label="Go Back"
      >
        <FaArrowLeft /> Back
      </button>

      <img
        src={faculty.image}
        alt={faculty.name}
        className="rounded-full border-8 border-[#BA3D47] w-48 h-48 object-cover mb-8 shadow-lg"
      />

      <h1 className="text-4xl font-extrabold mb-2">{faculty.name}</h1>
      <h2 className="text-2xl font-semibold text-[#BA3D47] mb-1">{faculty.title}</h2>
      <p className="text-lg font-medium text-gray-700 mb-8">{faculty.qualification}</p>

      <div className="text-center text-[#333] text-xl leading-relaxed max-w-3xl mb-10">
        {faculty.bio}
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-[#930911]">
        <h3 className="text-2xl font-bold mb-4 border-b border-[#BA3D47] pb-2">Contact Me</h3>
        <p className="mb-1 font-semibold">Phone:</p>
        <p>{contact.phone1}</p>
        <p>{contact.phone2}</p>

        <p className="mt-4 mb-1 font-semibold">Email:</p>
        <p>{contact.email1}</p>
        <p>{contact.email2}</p>

        <h3 className="text-2xl font-bold mt-8 mb-4 border-b border-[#BA3D47] pb-2">Reach Me At</h3>
        <address className="not-italic space-y-1 text-[#555]">
          {contact.address.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </address>
      </div>
    </motion.div>
  );
};

export default FacultyProfile;
