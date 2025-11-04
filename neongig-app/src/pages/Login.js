import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Check URL params for pre-selected user type
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        userType: typeParam === 'freelancer' ? 'freelancer' : 'buyer',
        password: '',
        confirmPassword: '',
        skills: '',
        experience: '',
        portfolio: '',
        category: '',
        hourlyRate: '',
        bio: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        // Password validation
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        // Age validation (must be at least 18)
        if (formData.dob) {
            const today = new Date();
            const birthDate = new Date(formData.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                newErrors.dob = 'You must be at least 18 years old to register';
            }
        }
        
        // Freelancer specific validation
        if (formData.userType === 'freelancer') {
            if (!formData.skills.trim()) newErrors.skills = 'Skills are required for freelancers';
            if (!formData.experience.trim()) newErrors.experience = 'Experience is required for freelancers';
            if (!formData.category.trim()) newErrors.category = 'Category is required for freelancers';
            if (!formData.hourlyRate || formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate must be greater than 0';
            if (!formData.bio.trim()) newErrors.bio = 'Bio is required for freelancers';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setIsLoading(true);
  
  try {
    // Different endpoints for freelancers and buyers
    if (formData.userType === 'freelancer') {
      // Register as freelancer
      const response = await fetch('http://localhost:5000/api/freelancers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          skills: formData.skills.split(',').map(s => s.trim()),
          category: formData.category,
          hourlyRate: parseFloat(formData.hourlyRate),
          bio: formData.bio,
          portfolio: formData.portfolio,
          experience: formData.experience
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success message for freelancer
      showStatusMessage('Application submitted successfully! Please wait up to 72 hours for admin verification before you can log in.', 'success');

      // Clear form after 2 seconds and redirect to signin
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          dob: '',
          userType: 'buyer',
          password: '',
          confirmPassword: '',
          skills: '',
          experience: '',
          portfolio: '',
          category: '',
          hourlyRate: '',
          bio: ''
        });
        navigate('/signin');
      }, 3000);

    } else {
      // Register as buyer (existing flow)
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Store in localStorage - MAKE SURE isLoggedIn is true
      const userDataWithLogin = {
        ...data.user,
        isLoggedIn: true // This is crucial!
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(userDataWithLogin));

      showStatusMessage(data.message, 'success');

      setTimeout(() => {
        showLoginSuccessPopup();
      }, 1000);

      // Redirect based on user type
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }

  } catch (error) {
    console.error('Registration error:', error);
    showStatusMessage(error.message, 'error');
    setErrors({ general: error.message });
  } finally {
    setIsLoading(false);
  }
};
    const showStatusMessage = (message, type) => {
        const statusDiv = document.getElementById('statusMessage');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.backgroundColor = type === 'success' ? 'var(--neon-green)' : 'var(--neon-pink)';
            statusDiv.style.display = 'block';
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    };

    const showLoginSuccessPopup = () => {
        const popup = document.createElement('div');
        popup.id = 'loginSuccessPopup';
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, var(--neon-green), var(--neon-blue));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            border: 1px solid var(--neon-green);
        `;
        popup.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <span>Logged in successfully!</span>
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
            <title>Join NeonGigs - Register Now</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@300;400;600;700&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
            <style dangerouslySetInnerHTML={{__html: `
        :root {
            --neon-pink: #ff2a6d;
            --neon-blue: #05d9e8;
            --neon-purple: #d300c5;
            --neon-green: #00ff9d;
            --neon-yellow: #fff700;
            --dark-bg: #0d0221;
            --darker-bg: #05010f;
            --light-text: #f5f6fa;
            --dark-text: #2d3436;
            --card-bg: rgba(13, 2, 33, 0.7);
            --section-bg: rgba(13, 2, 33, 0.9);
            --border-color: rgba(5, 217, 232, 0.2);
            --glow: 0 0 10px rgba(5, 217, 232, 0.7);
            --pink-glow: 0 0 15px rgba(255, 42, 109, 0.7);
            --green-glow: 0 0 15px rgba(0, 255, 157, 0.7);
            --purple-glow: 0 0 15px rgba(211, 0, 197, 0.7);
            --yellow-glow: 0 0 15px rgba(255, 247, 0, 0.7);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            background-color: var(--dark-bg);
            color: var(--light-text);
            min-height: 100vh;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(255, 42, 109, 0.1) 0%, transparent 20%),
                radial-gradient(circle at 90% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 25%),
                radial-gradient(circle at 50% 80%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        /* Header */
        header {
            background-color: var(--section-bg);
            box-shadow: 0 2px 20px rgba(5, 217, 232, 0.2);
            position: sticky;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-color);
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 0;
        }

        .logo {
            font-size: 2rem;
            font-weight: 700;
            color: var(--neon-blue);
            text-decoration: none;
            display: flex;
            align-items: center;
            font-family: 'Montserrat', sans-serif;
            text-shadow: 0 0 10px var(--neon-blue);
            animation: logoGlow 2s infinite alternate;
        }

        @keyframes logoGlow {
            0% { text-shadow: 0 0 10px var(--neon-blue); }
            100% { text-shadow: 0 0 20px var(--neon-blue), 0 0 30px rgba(5, 217, 232, 0.5); }
        }

        .logo i {
            margin-right: 0.5rem;
            color: var(--neon-pink);
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--light-text);
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
            font-size: 1.1rem;
        }

        .nav-links a:hover {
            color: var(--neon-pink);
        }

        .nav-links a:after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--neon-pink);
            transition: width 0.3s ease;
        }

        .nav-links a:hover:after {
            width: 100%;
        }

        .nav-links a.active {
            color: var(--neon-blue);
        }

        .auth-buttons {
            display: flex;
            gap: 1rem;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
            border: none;
            outline: none;
        }

        .btn-primary {
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
            color: white;
        }

        .btn-primary:hover {
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));
            box-shadow: 0 0 15px var(--neon-pink);
            transform: translateY(-2px);
        }

        .btn-outline {
            background-color: transparent;
            color: var(--neon-blue);
            border: 2px solid var(--neon-blue);
        }

        .btn-outline:hover {
            background-color: rgba(5, 217, 232, 0.1);
            box-shadow: 0 0 15px var(--neon-blue);
            transform: translateY(-2px);
        }

        /* Login Section */
        .login-section {
            padding: 6rem 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
        }

        .login-section:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255, 42, 109, 0.1) 0%, transparent 70%);
            z-index: -1;
        }

        .login-container {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
        }

        .login-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .login-header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
            background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            animation: textGlow 3s infinite alternate;
        }

        @keyframes textGlow {
            0% { text-shadow: 0 0 10px rgba(255, 42, 109, 0.5); }
            50% { text-shadow: 0 0 20px rgba(5, 217, 232, 0.5); }
            100% { text-shadow: 0 0 20px rgba(0, 255, 157, 0.5); }
        }

        .login-header p {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
            max-width: 500px;
            margin: 0 auto;
        }

        .login-form {
            background-color: var(--card-bg);
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 42, 109, 0.3);
            position: relative;
            backdrop-filter: blur(10px);
        }

        .login-form:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 42, 109, 0.1) 0%, rgba(5, 217, 232, 0.1) 100%);
            border-radius: 20px;
            z-index: -1;
        }

        .form-group {
            margin-bottom: 1.5rem;
            position: relative;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--neon-blue);
            font-weight: 600;
            font-size: 1rem;
        }

        .form-control {
            width: 100%;
            padding: 1rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(5, 217, 232, 0.3);
            border-radius: 10px;
            color: white !important;
            font-size: 1rem;
            transition: all 0.3s ease;
            outline: none;
        }

        .form-control:focus {
            border-color: var(--neon-blue);
            box-shadow: 0 0 15px rgba(5, 217, 232, 0.3);
            background-color: rgba(255, 255, 255, 0.08);
            color: white !important;
        }

        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
        }

        input.form-control {
            color: white !important;
        }

        input.form-control:focus {
            color: white !important;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .user-type-selection {
            margin-bottom: 2rem;
        }

        .user-type-title {
            font-size: 1.2rem;
            color: var(--neon-green);
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .user-type-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .user-type-option {
            position: relative;
            cursor: pointer;
        }

        .user-type-option input[type="radio"] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }

        .user-type-label {
            display: block;
            padding: 1.5rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(5, 217, 232, 0.3);
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .user-type-label:hover {
            border-color: var(--neon-blue);
            background-color: rgba(5, 217, 232, 0.1);
        }

        .user-type-option input[type="radio"]:checked + .user-type-label {
            border-color: var(--neon-pink);
            background-color: rgba(255, 42, 109, 0.1);
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.3);
        }

        .user-type-label i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
            color: var(--neon-blue);
        }

        .user-type-option input[type="radio"]:checked + .user-type-label i {
            color: var(--neon-pink);
        }

        .user-type-label span {
            font-weight: 600;
            color: white;
        }

        .freelancer-fields {
            margin-top: 1.5rem;
            padding: 1.5rem;
            background-color: rgba(0, 255, 157, 0.05);
            border: 1px solid rgba(0, 255, 157, 0.3);
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .freelancer-fields.hidden {
            display: none;
        }

        .freelancer-fields h3 {
            color: var(--neon-green);
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }

        .error-message {
            color: var(--neon-pink);
            font-size: 0.9rem;
            margin-top: 0.5rem;
            display: block;
        }

        .submit-btn {
            width: 100%;
            padding: 1.2rem;
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1rem;
            position: relative;
            overflow: hidden;
        }

        .submit-btn:hover {
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));
            box-shadow: 0 0 20px rgba(255, 42, 109, 0.5);
            transform: translateY(-2px);
        }

        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .submit-btn .loading {
            display: none;
        }

        .submit-btn.loading .loading {
            display: inline-block;
            margin-right: 0.5rem;
        }

        .login-footer {
            text-align: center;
            margin-top: 2rem;
            color: rgba(255, 255, 255, 0.7);
        }

        .login-footer a {
            color: var(--neon-blue);
            text-decoration: none;
            font-weight: 600;
        }

        .login-footer a:hover {
            color: var(--neon-pink);
        }

        /* Status Message */
        #statusMessage {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background-color: var(--neon-green);
            color: var(--darker-bg);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            display: none;
            animation: slideInRight 0.5s ease;
        }

        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        /* Loading Spinner */
        .loading {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .login-header h1 {
                font-size: 2.5rem;
            }
            
            .login-form {
                padding: 2rem;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .user-type-options {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 0 1rem;
            }
        }

        @media (max-width: 576px) {
            .login-header h1 {
                font-size: 2rem;
            }
            
            .login-form {
                padding: 1.5rem;
            }
        }
    ` }} />

            {/* Status Message */}
            <div id="statusMessage"></div>

            {/* Header */}
            <header>
                <div className="container">
                    <nav className="navbar">
                        <Link to="/" className="logo">
                            <i className="fas fa-bolt" />
                            NeonGigs
                        </Link>
                        <div className="nav-links">
                            <Link to="/">Home</Link>
                            <Link to="/Categories">Categories</Link>
                            <Link to="/ContactSupport">Contact</Link>
                        </div>
                        <div className="auth-buttons">
                            <Link to="/" className="btn btn-outline">Back to Home</Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Login Section */}
            <section className="login-section">
                <div className="container">
                    <div className="login-container">
                        <div className="login-header">
                            <h1>Join NeonGigs</h1>
                            <p>Create your account and start your journey in the digital marketplace</p>
                        </div>

                        <form className="login-form" onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">
                                        <i className="fas fa-user" style={{marginRight: '0.5rem'}} />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">
                                        <i className="fas fa-envelope" style={{marginRight: '0.5rem'}} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">
                                        <i className="fas fa-phone" style={{marginRight: '0.5rem'}} />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-control"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob">
                                        <i className="fas fa-calendar" style={{marginRight: '0.5rem'}} />
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        className="form-control"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                    />
                                    {errors.dob && <span className="error-message">{errors.dob}</span>}
                                </div>
                            </div>

                            {/* User Type Selection */}
                            <div className="user-type-selection">
                                <div className="user-type-title">
                                    <i className="fas fa-user-tag" style={{marginRight: '0.5rem'}} />
                                    I want to register as:
                                </div>
                                <div className="user-type-options">
                                    <div className="user-type-option">
                                        <input
                                            type="radio"
                                            id="buyer"
                                            name="userType"
                                            value="buyer"
                                            checked={formData.userType === 'buyer'}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="buyer" className="user-type-label">
                                            <i className="fas fa-shopping-cart" />
                                            <span>Buyer</span>
                                        </label>
                                    </div>
                                    <div className="user-type-option">
                                        <input
                                            type="radio"
                                            id="freelancer"
                                            name="userType"
                                            value="freelancer"
                                            checked={formData.userType === 'freelancer'}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="freelancer" className="user-type-label">
                                            <i className="fas fa-code" />
                                            <span>Freelancer</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Freelancer Specific Fields */}
                            <div className={`freelancer-fields ${formData.userType === 'freelancer' ? '' : 'hidden'}`}>
                                <h3>
                                    <i className="fas fa-tools" style={{marginRight: '0.5rem'}} />
                                    Freelancer Information
                                </h3>
                                <div className="form-group">
                                    <label htmlFor="category">
                                        <i className="fas fa-tag" style={{marginRight: '0.5rem'}} />
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="form-control"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Mobile Development">Mobile Development</option>
                                        <option value="Graphic Design">Graphic Design</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Content Writing">Content Writing</option>
                                        <option value="Digital Marketing">Digital Marketing</option>
                                        <option value="Video Editing">Video Editing</option>
                                        <option value="Data Entry">Data Entry</option>
                                        <option value="Virtual Assistant">Virtual Assistant</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.category && <span className="error-message">{errors.category}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hourlyRate">
                                        <i className="fas fa-dollar-sign" style={{marginRight: '0.5rem'}} />
                                        Hourly Rate (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="hourlyRate"
                                        name="hourlyRate"
                                        className="form-control"
                                        placeholder="e.g., 500"
                                        min="0"
                                        step="50"
                                        value={formData.hourlyRate}
                                        onChange={handleInputChange}
                                    />
                                    {errors.hourlyRate && <span className="error-message">{errors.hourlyRate}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bio">
                                        <i className="fas fa-user-circle" style={{marginRight: '0.5rem'}} />
                                        Professional Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        className="form-control"
                                        placeholder="Tell us about yourself and your expertise..."
                                        rows="4"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        style={{resize: 'vertical', minHeight: '100px'}}
                                    />
                                    {errors.bio && <span className="error-message">{errors.bio}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="skills">
                                        <i className="fas fa-star" style={{marginRight: '0.5rem'}} />
                                        Skills & Expertise (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="skills"
                                        name="skills"
                                        className="form-control"
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                    />
                                    {errors.skills && <span className="error-message">{errors.skills}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="experience">
                                        <i className="fas fa-briefcase" style={{marginRight: '0.5rem'}} />
                                        Years of Experience
                                    </label>
                                    <select
                                        id="experience"
                                        name="experience"
                                        className="form-control"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select experience level</option>
                                        <option value="0-1">0-1 years (Beginner)</option>
                                        <option value="1-3">1-3 years (Intermediate)</option>
                                        <option value="3-5">3-5 years (Advanced)</option>
                                        <option value="5+">5+ years (Expert)</option>
                                    </select>
                                    {errors.experience && <span className="error-message">{errors.experience}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="portfolio">
                                        <i className="fas fa-link" style={{marginRight: '0.5rem'}} />
                                        Portfolio/Website (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        id="portfolio"
                                        name="portfolio"
                                        className="form-control"
                                        placeholder="https://yourportfolio.com"
                                        value={formData.portfolio}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Password Fields */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">
                                        <i className="fas fa-lock" style={{marginRight: '0.5rem'}} />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    {errors.password && <span className="error-message">{errors.password}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">
                                        <i className="fas fa-lock" style={{marginRight: '0.5rem'}} />
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus" style={{marginRight: '0.5rem'}} />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>
                                Already have an account? 
                                <Link to="/signin"> Sign in here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
