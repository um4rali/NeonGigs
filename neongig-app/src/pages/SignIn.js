import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Create demo user on component mount
    React.useEffect(() => {
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const demoUser = existingUsers.find(u => u.email === 'demo@neongigs.com');
        
        if (!demoUser) {
            const demoUserData = {
                id: 'demo-user',
                name: 'Demo User',
                email: 'demo@neongigs.com',
                password: 'demo123',
                phone: '+1234567890',
                dob: '1990-01-01',
                userType: 'buyer',
                skills: 'Web Development, Design',
                experience: '3-5',
                portfolio: 'https://demo-portfolio.com',
                registeredAt: new Date().toISOString(),
                isLoggedIn: false
            };
            
            existingUsers.push(demoUserData);
            localStorage.setItem('users', JSON.stringify(existingUsers));
        }
    }, []);

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
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Password validation
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
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
    const response = await fetch('https://neongigs.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await response.json();

    // Check if freelancer is not verified
    if (!data.success && data.isVerified === false && data.userType === 'freelancer') {
      // Show verification pending message
      showVerificationPendingMessage();
      setIsLoading(false);
      return;
    }

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
      if (data.user.userType === 'buyer') {
        navigate('/');
      } else {
        navigate('/freelancer-profile');
      }
    }, 2000);

  } catch (error) {
    console.error('Login error:', error);
    showStatusMessage(error.message, 'error');
    setErrors({ general: error.message });
  } finally {
    setIsLoading(false);
  }
};

    const showVerificationPendingMessage = () => {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(13, 2, 33, 0.98), rgba(5, 1, 15, 0.98));
            border: 2px solid var(--neon-yellow);
            padding: 2rem 3rem;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(255, 247, 0, 0.5);
            z-index: 10000;
            text-align: center;
            min-width: 400px;
            animation: fadeIn 0.5s ease;
        `;
        popup.innerHTML = `
            <div>
                <i class="fas fa-clock" style="font-size: 3rem; color: var(--neon-yellow); margin-bottom: 1rem;"></i>
                <h2 style="color: var(--neon-yellow); margin-bottom: 1rem; font-size: 1.8rem;">
                    Account Pending Verification
                </h2>
                <p style="color: var(--light-text); line-height: 1.6; margin-bottom: 1.5rem; font-size: 1.1rem;">
                    Your freelancer account is currently under review by our admin team. 
                    This process typically takes <strong style="color: var(--neon-green);">up to 72 hours</strong>.
                </p>
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    You will receive an email notification once your account is verified.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                ">
                    Understood
                </button>
            </div>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
        
        overlay.onclick = () => {
            overlay.remove();
            popup.remove();
        };
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
            <title>Sign In - NeonGigs</title>
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
            text-decoration: none;
            display: inline-block;
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

        /* Sign In Section */
        .signin-section {
            padding: 6rem 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
        }

        .signin-section:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(5, 217, 232, 0.1) 0%, transparent 70%);
            z-index: -1;
        }

        .signin-container {
            max-width: 500px;
            margin: 0 auto;
            width: 100%;
        }

        .signin-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .signin-header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
            background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink), var(--neon-green));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            animation: textGlow 3s infinite alternate;
        }

        @keyframes textGlow {
            0% { text-shadow: 0 0 10px rgba(5, 217, 232, 0.5); }
            50% { text-shadow: 0 0 20px rgba(255, 42, 109, 0.5); }
            100% { text-shadow: 0 0 20px rgba(0, 255, 157, 0.5); }
        }

        .signin-header p {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
            max-width: 400px;
            margin: 0 auto;
        }

        .signin-form {
            background-color: var(--card-bg);
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(5, 217, 232, 0.3);
            position: relative;
            backdrop-filter: blur(10px);
        }

        .signin-form:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(5, 217, 232, 0.1) 0%, rgba(255, 42, 109, 0.1) 100%);
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

        .password-toggle {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--neon-blue);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0.5rem;
            transition: color 0.3s ease;
        }

        .password-toggle:hover {
            color: var(--neon-pink);
        }

        .error-message {
            color: var(--neon-pink);
            font-size: 0.9rem;
            margin-top: 0.5rem;
            display: block;
        }

        .general-error {
            background-color: rgba(255, 42, 109, 0.1);
            border: 1px solid var(--neon-pink);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            color: var(--neon-pink);
            text-align: center;
        }

        .submit-btn {
            width: 100%;
            padding: 1.2rem;
            background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
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
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-blue));
            box-shadow: 0 0 20px rgba(5, 217, 232, 0.5);
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

        .form-footer {
            text-align: center;
            margin-top: 2rem;
            color: rgba(255, 255, 255, 0.7);
        }

        .form-footer a {
            color: var(--neon-blue);
            text-decoration: none;
            font-weight: 600;
        }

        .form-footer a:hover {
            color: var(--neon-pink);
        }

        .divider {
            display: flex;
            align-items: center;
            margin: 2rem 0;
            color: rgba(255, 255, 255, 0.5);
        }

        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(5, 217, 232, 0.3);
        }

        .divider span {
            padding: 0 1rem;
            font-size: 0.9rem;
        }

        .demo-credentials {
            background-color: rgba(0, 255, 157, 0.1);
            border: 1px solid rgba(0, 255, 157, 0.3);
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }

        .demo-credentials h3 {
            color: var(--neon-green);
            margin-bottom: 1rem;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
        }

        .demo-credentials h3 i {
            margin-right: 0.5rem;
        }

        .demo-credentials p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .demo-credentials .credential {
            background-color: rgba(0, 255, 157, 0.1);
            padding: 0.5rem;
            border-radius: 5px;
            margin: 0.5rem 0;
            font-family: monospace;
            font-size: 0.9rem;
            color: var(--neon-green);
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
            .signin-header h1 {
                font-size: 2.5rem;
            }
            
            .signin-form {
                padding: 2rem;
            }
            
            .container {
                padding: 0 1rem;
            }
        }

        @media (max-width: 576px) {
            .signin-header h1 {
                font-size: 2rem;
            }
            
            .signin-form {
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

            {/* Sign In Section */}
            <section className="signin-section">
                <div className="container">
                    <div className="signin-container">
                        <div className="signin-header">
                            <h1>Welcome Back</h1>
                            <p>Sign in to your NeonGigs account and continue your journey</p>
                        </div>

                        <form className="signin-form" onSubmit={handleSubmit}>
                            {/* Demo Credentials */}
                            <div className="demo-credentials">
                                <h3>
                                    <i className="fas fa-info-circle" />
                                    Demo Credentials
                                </h3>
                                <p>Use these credentials to test the login:</p>
                                <div className="credential">Email: demo@neongigs.com</div>
                                <div className="credential">Password: demo123</div>
                                <p style={{fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7}}>
                                    Or register a new account to create your own credentials
                                </p>
                            </div>

                            {/* General Error */}
                            {errors.general && (
                                <div className="general-error">
                                    <i className="fas fa-exclamation-triangle" style={{marginRight: '0.5rem'}} />
                                    {errors.general}
                                </div>
                            )}

                            {/* Email Field */}
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
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label htmlFor="password">
                                    <i className="fas fa-lock" style={{marginRight: '0.5rem'}} />
                                    Password
                                </label>
                                <div style={{position: 'relative'}}>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        style={{paddingRight: '3rem'}}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => {
                                            const passwordInput = document.getElementById('password');
                                            const toggleBtn = document.querySelector('.password-toggle i');
                                            if (passwordInput.type === 'password') {
                                                passwordInput.type = 'text';
                                                toggleBtn.className = 'fas fa-eye-slash';
                                            } else {
                                                passwordInput.type = 'password';
                                                toggleBtn.className = 'fas fa-eye';
                                            }
                                        }}
                                    >
                                        <i className="fas fa-eye" />
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
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
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt" style={{marginRight: '0.5rem'}} />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="form-footer">
                            <p>
                                Don't have an account? 
                                <Link to="/login"> Create one here</Link>
                            </p>
                            <div className="divider">
                                <span>or</span>
                            </div>
                            <p>
                                <Link to="/" style={{color: 'var(--neon-green)'}}>
                                    <i className="fas fa-home" style={{marginRight: '0.5rem'}} />
                                    Back to Home
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
