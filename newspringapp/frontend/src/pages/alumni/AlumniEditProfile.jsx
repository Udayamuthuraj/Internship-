import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlumniEditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+91 9876543210',
    location: 'Chennai, India',
    work: 'Software Engineer at TCS',
    experience: '5 years in Full Stack Development',
    education: 'B.E. Computer Science - University of Madras',
    tools: 'React, Spring Boot, MySQL, Docker',
    achievements: 'Employee of the Year - 2023, Open Source Contributor',
    summary: 'Experienced software engineer with a passion for developing scalable web applications and working across the full stack.'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('alumniProfile', JSON.stringify(formData));
    navigate('/alumni/profile');
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: 'auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#FFE9D4',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)'
    },
    heading: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#930911'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      color: '#BA3D47'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '5px',
      border: '1px solid #ccc'
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '5px',
      border: '1px solid #ccc',
      minHeight: '100px'
    },
    button: {
      backgroundColor: '#BA3D47',
      color: '#fff',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'block',
      margin: 'auto'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div style={styles.formGroup} key={key}>
            <label style={styles.label} htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            {key === 'summary' || key === 'experience' || key === 'education' || key === 'tools' || key === 'achievements' ? (
              <textarea name={key} value={value} onChange={handleChange} style={styles.textarea} />
            ) : (
              <input type="text" name={key} value={value} onChange={handleChange} style={styles.input} />
            )}
          </div>
        ))}
        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
};

export default AlumniEditProfile;