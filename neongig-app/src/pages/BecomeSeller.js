import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://neongigs.onrender.com/api';

export default function BecomeSeller() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        bio: '',
        skills: '',
        category: 'Graphics & Design',
        experience: '',
        portfolio: '',
        languages: '',
        hourlyRate: 50,
        location: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('userData') || 'null');
        if (user && user.isLoggedIn) {
            setIsLoggedIn(true);
            setUserData(user);
            // Pre-fill form with user data if available
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        } else {
            setIsLoggedIn(false);
            setUserData(null);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await axios.post(`${API_URL}/freelancers/register`, formData);

            if (response.data.success) {
                setSubmitMessage('success');
                // Show success message
                alert('Application submitted successfully! Please wait for admin approval.');
                
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    bio: '',
                    skills: '',
                    category: 'Graphics & Design',
                    experience: '',
                    portfolio: '',
                    languages: '',
                    hourlyRate: 50,
                    location: ''
                });
            }
        } catch (error) {
            console.error('Error submitting freelancer application:', error);
            setSubmitMessage('error');
            alert(error.response?.data?.message || 'Error submitting application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        // Clear user data
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setUserData(null);
        
        // Show logout message
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 0 20px rgba(255, 42, 109, 0.5);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            border: 1px solid var(--neon-pink);
        `;
        popup.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-sign-out-alt" style="font-size: 1.2rem;"></i>
                <span>Logged out successfully!</span>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 500);
        }, 3000);
    };

    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Become a Seller - NeonGigs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@300;400;600;700&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: "\n        /* Base Theme Styles */\n        :root {\n            --neon-pink: #ff2a6d;\n            --neon-blue: #05d9e8;\n            --neon-purple: #d300c5;\n            --neon-green: #00ff9d;\n            --dark-bg: #0d0221;\n            --darker-bg: #05010f;\n            --light-text: #f5f6fa;\n            --card-bg: rgba(13, 2, 33, 0.7);\n            --glow: 0 0 10px rgba(5, 217, 232, 0.7);\n        }\n\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: 'Rajdhani', 'Poppins', sans-serif;\n        }\n\n        body {\n            background-color: var(--dark-bg);\n            color: var(--light-text);\n            background-image:\n                radial-gradient(circle at 10% 20%, rgba(255, 42, 109, 0.1) 0%, transparent 20%),\n                radial-gradient(circle at 90% 80%, rgba(211, 0, 197, 0.1) 0%, transparent 25%);\n        }\n\n        .container {\n            max-width: 900px;\n            margin: 0 auto;\n            padding: 2rem;\n        }\n\n        /* Consistent Header */\n        header {\n            background-color: rgba(13, 2, 33, 0.9);\n            box-shadow: 0 2px 20px rgba(5, 217, 232, 0.2);\n            padding: 1.5rem 2rem;\n            border-bottom: 1px solid var(--neon-blue);\n        }\n\n        .navbar {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            max-width: 1400px;\n            margin: 0 auto;\n        }\n\n        .logo {\n            font-size: 2rem;\n            font-weight: 700;\n            color: var(--neon-blue);\n            text-decoration: none;\n            display: flex;\n            align-items: center;\n        }\n\n        /* Wizard Styles */\n        .wizard-container {\n            background: var(--card-bg);\n            border: 1px solid var(--neon-blue);\n            border-radius: 15px;\n            padding: 2rem 3rem;\n            margin-top: 3rem;\n            box-shadow: var(--glow);\n        }\n\n        .progress-bar {\n            display: flex;\n            justify-content: space-between;\n            margin-bottom: 2.5rem;\n            position: relative;\n        }\n        \n        .progress-bar::before {\n            content: '';\n            position: absolute;\n            top: 50%;\n            left: 0;\n            transform: translateY(-50%);\n            height: 3px;\n            width: 100%;\n            background-color: rgba(5, 217, 232, 0.3);\n            z-index: 1;\n        }\n\n        #progress-line {\n            position: absolute;\n            top: 50%;\n            left: 0;\n            transform: translateY(-50%);\n            height: 3px;\n            background-color: var(--neon-green);\n            width: 0%; /* JS will update this */\n            z-index: 2;\n            transition: width 0.4s ease;\n        }\n\n        .progress-step {\n            text-align: center;\n            position: relative;\n            z-index: 3;\n        }\n\n        .step-circle {\n            width: 40px;\n            height: 40px;\n            border-radius: 50%;\n            background: var(--dark-bg);\n            border: 2px solid rgba(5, 217, 232, 0.3);\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            margin: 0 auto 0.5rem;\n            transition: all 0.4s ease;\n        }\n        .progress-step.active .step-circle {\n            border-color: var(--neon-green);\n            background: var(--neon-green);\n            color: var(--dark-bg);\n            font-weight: bold;\n        }\n        .progress-step.active .step-label {\n            color: var(--neon-green);\n            font-weight: bold;\n        }\n\n        .wizard-step { display: none; }\n        .wizard-step.active { display: block; animation: fadeIn 0.5s; }\n\n        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n\n        .form-group { margin-bottom: 1.5rem; }\n        .form-group label { display: block; margin-bottom: 0.5rem; color: var(--neon-blue); }\n        .form-group input, .form-group textarea {\n            width: 100%; padding: 0.75rem; background-color: rgba(5, 217, 232, 0.1);\n            border: 1px solid var(--neon-blue); border-radius: 8px; font-size: 1rem; color: var(--light-text);\n        }\n\n        .wizard-nav { display: flex; justify-content: space-between; margin-top: 2rem; }\n        .btn {\n            padding: 0.75rem 2rem; border-radius: 8px; font-weight: 600; cursor: pointer;\n            border: none; transition: all 0.3s ease;\n        }\n        .btn-primary { background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple)); color: white; }\n        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 15px var(--neon-pink); }\n        .btn-secondary { background: transparent; border: 2px solid var(--neon-blue); color: var(--neon-blue); }\n\n        /* Skills Input */\n        .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.5rem; border: 1px solid var(--neon-blue); border-radius: 8px; }\n        .skill-tag { background-color: var(--neon-blue); color: var(--dark-bg); padding: 0.25rem 0.75rem; border-radius: 20px; display: flex; align-items: center; }\n        .skill-tag .remove-tag { margin-left: 0.5rem; cursor: pointer; font-weight: bold; }\n        #skillInput { border: none; background: transparent; color: white; flex-grow: 1; padding: 0.25rem; }\n        #skillInput:focus { outline: none; }\n\n        /* File Upload */\n        .file-upload-wrapper { border: 2px dashed var(--neon-blue); border-radius: 8px; padding: 2rem; text-align: center; cursor: pointer; }\n        .file-upload-wrapper:hover { background: rgba(5, 217, 232, 0.1); }\n        #fileName { margin-top: 1rem; color: var(--neon-green); }\n\n        /* Review Step */\n        .review-section { margin-bottom: 1rem; }\n        .review-section h4 { color: var(--neon-pink); }\n        .review-section p, .review-section .skills-container { background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 4px; }\n        \n        /* Pending Approval View */\n        #pending-view { display: none; text-align: center; padding: 4rem 0; animation: fadeIn 0.5s; }\n        #pending-view h2 { color: var(--neon-green); font-size: 2rem; margin-bottom: 1rem; }\n        #timer { font-size: 3rem; font-weight: bold; color: var(--neon-blue); margin: 2rem 0; }\n        #status-message { margin-top: 1.5rem; font-size: 1.2rem; font-weight: bold; color: var(--neon-green); display: none; }\n\n    " }} />
        <header>
          <nav className="navbar">
            <Link to="/" className="logo"><i className="fas fa-bolt" /> NeonGigs</Link>
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/Categories">Categories</Link>
              <Link to="/ContactSupport">Contact</Link>
            </div>
            <div className="auth-buttons" style={{display: isLoggedIn ? 'none' : 'flex', gap: '1rem'}}>
              <Link to="/signin" className="btn btn-outline" style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem',
                border: 'none',
                outline: 'none',
                textDecoration: 'none',
                display: 'inline-block',
                backgroundColor: 'transparent',
                color: 'var(--neon-blue)',
                border: '2px solid var(--neon-blue)'
              }}>Login</Link>
              <Link to="/login" className="btn btn-primary" style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem',
                border: 'none',
                outline: 'none',
                textDecoration: 'none',
                display: 'inline-block',
                background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))',
                color: 'white'
              }}>Join Now</Link>
            </div>
            <div className="user-profile" style={{display: isLoggedIn ? 'flex' : 'none', alignItems: 'center', gap: '1rem'}}>
              <div className="user-avatar" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(45deg, var(--neon-pink), var(--neon-blue))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                border: '2px solid var(--neon-blue)'
              }}>
                {userData ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{fontSize: '0.9rem', color: 'var(--neon-green)'}}>{userData ? userData.name : 'User Name'}</span>
              <button className="logout-btn" onClick={handleLogout} style={{
                backgroundColor: 'var(--neon-pink)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none'
              }}>Logout</button>
            </div>
          </nav>
        </header>
        <div className="container">
          {/* Application Form View */}
          <div className="wizard-container" id="form-view">
            <h2 style={{marginBottom: '1rem', color: 'var(--neon-pink)'}}>Apply to become a Freelancer</h2>
            <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>Fill the form below and submit. Your application will be reviewed by an admin. Please wait up to 72 hours for approval.</p>

            <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Alex Doe" required />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" required />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 555 123 4567" />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input name="category" value={formData.category} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Hourly Rate (INR)</label>
                <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} min={0} />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Brief bio about your expertise" />
              </div>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input name="skills" value={formData.skills} onChange={handleInputChange} placeholder="React, Node, Logo Design" />
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
                <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{flex: 1}}>{isSubmitting ? 'Submitting…' : 'Submit for Approval'}</button>
                <button type="button" className="btn btn-outline" onClick={() => { setFormData({ name: '', email: '', password: '', phone: '', bio: '', skills: '', category: 'Graphics & Design', experience: '', portfolio: '', languages: '', hourlyRate: 50, location: '' }); }}>Reset</button>
              </div>

              {submitMessage === 'success' && (
                <div style={{marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(0,255,157,0.05)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)'}}>
                  Application submitted successfully. Your account will be reviewed by an admin. Please wait up to 72 hours for verification before you can log in.
                </div>
              )}

            </form>
          </div>
          {/* Pending Approval View */}
          <div id="pending-view">
            <h2><i className="fas fa-hourglass-half" /> Your Application is Under Review</h2>
            <p>You'll receive a notification once our team has reviewed your profile.</p>
            <div id="timer">24:00:00</div>
            <button className="btn btn-primary" id="checkStatusBtn">Check Status</button>
            <div id="status-message" />
          </div>
        </div>
        {/* Footer */}
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <h3>NeonGigs</h3>
                <div className="footer-about">
                  <p>The marketplace for creative and professional services with a neon twist.</p>
                  <div className="footer-social">
                    <a href="#"><i className="fab fa-facebook-f" /></a>
                    <a href="#"><i className="fab fa-twitter" /></a>
                    <a href="#"><i className="fab fa-instagram" /></a>
                    <a href="#"><i className="fab fa-linkedin-in" /></a>
                  </div>
                </div>
              </div>
              <div className="footer-col">
                <h3>Quick Links</h3>
                <ul className="footer-links">
                  <li><Link to="/"><i className="fas fa-chevron-right" /> Home</Link></li>
                  <li><Link to="/Categories"><i className="fas fa-chevron-right" /> Categories</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h3>Support</h3>
                <ul className="footer-links">
                  <li><Link to="/ContactSupport"><i className="fas fa-chevron-right" /> Contact Support</Link></li>
                  <li><a href="#"><i className="fas fa-chevron-right" /> Help Center</a></li>
                  <li><a href="#"><i className="fas fa-chevron-right" /> Terms of Service</a></li>
                  <li><a href="#"><i className="fas fa-chevron-right" /> Privacy Policy</a></li>
                  <li><a href="#"><i className="fas fa-chevron-right" /> Refund Policy</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h3>Contact Us</h3>
                <div className="footer-contact">
                  <p><i className="fas fa-map-marker-alt" /> 123 Neon Street, Digital City</p>
                  <p><i className="fas fa-phone" /> +1 (555) 123-4567</p>
                  <p><i className="fas fa-envelope" /> hello@neongigs.com</p>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2023 NeonGigs. All rights reserved. Designed with <i className="fas fa-heart" style={{color: 'var(--neon-pink)'}} /> by Digital Creators</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };
