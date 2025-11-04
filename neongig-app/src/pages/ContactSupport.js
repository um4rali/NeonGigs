import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


const faqs = [
                {
                    question: "How do I create an account on NeonGigs?",
                    answer: "Creating an account is simple! Click on the 'Join Now' button in the top right corner, fill in your details, and verify your email address. You'll be ready to start buying or selling services in minutes."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for certain regions. All payments are processed securely through our encrypted payment system."
                },
                {
                    question: "How do I become a seller on NeonGigs?",
                    answer: "To become a seller, you need to create an account and then complete your seller profile. You'll need to provide information about your skills, portfolio, and set up your payment details. Once approved, you can start creating and selling your services."
                },
                {
                    question: "What should I do if I'm not satisfied with a service?",
                    answer: "If you're not satisfied with a service you've received, first try to resolve the issue directly with the seller. If that doesn't work, you can contact our support team within 14 days of order completion, and we'll help mediate the situation according to our resolution policy."
                },
                {
                    question: "How does the refund policy work?",
                    answer: "We offer refunds in cases where the service was not delivered as described, or if there was a clear violation of our terms of service. Refund requests must be submitted within 14 days of order completion and will be reviewed by our support team on a case-by-case basis."
                },
                {
                    question: "Can I request custom services?",
                    answer: "Absolutely! Many sellers offer custom services. When browsing services, look for the 'Custom Offer' option, or you can directly contact sellers to discuss your specific needs and request a custom quote."
                }
            ];

export default function ContactSupport() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        {
            type: 'bot',
            message: 'Hello! Welcome to NeonGigs support. How can I help you today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('userData') || 'null');
        if (user && user.isLoggedIn) {
            setIsLoggedIn(true);
            setUserData(user);
        } else {
            setIsLoggedIn(false);
            setUserData(null);
        }
    }, []);

    const openLiveChat = () => {
        setIsChatOpen(true);
    };

    const closeLiveChat = () => {
        setIsChatOpen(false);
    };

    const sendChatMessage = () => {
        if (chatInput.trim() === '') return;

        const newMessage = {
            type: 'user',
            message: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, newMessage]);
        setChatInput('');

        // Simulate bot response after 1 second
        setTimeout(() => {
            const botResponse = {
                type: 'bot',
                message: 'Thank you for your message! A support agent will respond shortly. Our average response time is 2-3 minutes.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const handleChatKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
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

    const toggleFAQ = (index) => {
      if (activeIndex === index) {
        setActiveIndex(null); // close if same FAQ clicked
      } else {
        setActiveIndex(index);
      }
    };
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Contact Support - NeonGigs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@300;400;600;700&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <style dangerouslySetInnerHTML={{__html: "\n        :root {\n            --neon-pink: #ff2a6d;\n            --neon-blue: #05d9e8;\n            --neon-purple: #d300c5;\n            --neon-green: #00ff9d;\n            --neon-yellow: #fff700;\n            --dark-bg: #0d0221;\n            --darker-bg: #05010f;\n            --light-text: #f5f6fa;\n            --dark-text: #2d3436;\n            --card-bg: rgba(13, 2, 33, 0.7);\n            --glow: 0 0 10px rgba(5, 217, 232, 0.7);\n            --pink-glow: 0 0 15px rgba(255, 42, 109, 0.7);\n            --green-glow: 0 0 15px rgba(0, 255, 157, 0.7);\n            --purple-glow: 0 0 15px rgba(211, 0, 197, 0.7);\n            --yellow-glow: 0 0 15px rgba(255, 247, 0, 0.7);\n        }\n\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: 'Rajdhani', 'Poppins', sans-serif;\n        }\n\n        body {\n            background-color: var(--dark-bg);\n            color: var(--light-text);\n            min-height: 100vh;\n            overflow-x: hidden;\n            background-image: \n                radial-gradient(circle at 10% 20%, rgba(255, 42, 109, 0.1) 0%, transparent 20%),\n                radial-gradient(circle at 90% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 25%),\n                radial-gradient(circle at 50% 80%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);\n        }\n\n        /* Loading Spinner */\n        .loading {\n            border: 4px solid rgba(255, 255, 255, 0.3);\n            border-top: 4px solid white;\n            border-radius: 50%;\n            width: 24px;\n            height: 24px;\n            animation: spin 1s linear infinite;\n            margin: 0 auto;\n        }\n\n        @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n        }\n\n        /* Main Layout */\n        .container {\n            max-width: 1400px;\n            margin: 0 auto;\n            padding: 0 2rem;\n        }\n\n        /* Header */\n        header {\n            background-color: rgba(13, 2, 33, 0.9);\n            box-shadow: 0 2px 20px rgba(5, 217, 232, 0.2);\n            position: sticky;\n            top: 0;\n            z-index: 100;\n            backdrop-filter: blur(10px);\n            border-bottom: 1px solid var(--neon-blue);\n        }\n\n        .navbar {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            padding: 1.5rem 0;\n        }\n\n        .logo {\n            font-size: 2rem;\n            font-weight: 700;\n            color: var(--neon-blue);\n            text-decoration: none;\n            display: flex;\n            align-items: center;\n            font-family: 'Montserrat', sans-serif;\n            text-shadow: 0 0 10px var(--neon-blue);\n            animation: logoGlow 2s infinite alternate;\n        }\n\n        @keyframes logoGlow {\n            0% { text-shadow: 0 0 10px var(--neon-blue); }\n            100% { text-shadow: 0 0 20px var(--neon-blue), 0 0 30px rgba(5, 217, 232, 0.5); }\n        }\n\n        .logo i {\n            margin-right: 0.5rem;\n            color: var(--neon-pink);\n        }\n\n        .nav-links {\n            display: flex;\n            align-items: center;\n            gap: 2rem;\n        }\n\n        .nav-links a {\n            text-decoration: none;\n            color: var(--light-text);\n            font-weight: 500;\n            transition: all 0.3s ease;\n            position: relative;\n            font-size: 1.1rem;\n        }\n\n        .nav-links a:hover {\n            color: var(--neon-pink);\n        }\n\n        .nav-links a:after {\n            content: '';\n            position: absolute;\n            bottom: -5px;\n            left: 0;\n            width: 0;\n            height: 2px;\n            background-color: var(--neon-pink);\n            transition: width 0.3s ease;\n        }\n\n        .nav-links a:hover:after {\n            width: 100%;\n        }\n\n        .nav-links a.active {\n            color: var(--neon-blue);\n        }\n\n        .auth-buttons {\n            display: flex;\n            gap: 1rem;\n        }\n\n        .btn {\n            padding: 0.75rem 1.5rem;\n            border-radius: 8px;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.3s ease;\n            text-transform: uppercase;\n            letter-spacing: 1px;\n            font-size: 0.9rem;\n        }\n\n        .btn-primary {\n            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));\n            color: white;\n            border: none;\n        }\n\n        .btn-primary:hover {\n            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));\n            box-shadow: 0 0 15px var(--neon-pink);\n            transform: translateY(-2px);\n        }\n\n        .btn-outline {\n            background-color: transparent;\n            color: var(--neon-blue);\n            border: 2px solid var(--neon-blue);\n        }\n\n        .btn-outline:hover {\n            background-color: rgba(5, 217, 232, 0.1);\n            box-shadow: 0 0 15px var(--neon-blue);\n            transform: translateY(-2px);\n        }\n        \n        /* User Profile & Logout */\n        .user-profile {\n            display: none;\n            align-items: center;\n            gap: 1rem;\n        }\n\n        .user-profile.active {\n            display: flex;\n        }\n\n        .user-profile span {\n            font-size: 0.9rem;\n            color: var(--neon-green);\n        }\n        \n        .user-profile img {\n            width: 40px;\n            height: 40px;\n            border-radius: 50%;\n            object-fit: cover;\n            border: 2px solid var(--neon-blue);\n        }\n\n        .logout-btn {\n            background-color: var(--neon-pink);\n            color: white;\n            padding: 0.5rem 1rem;\n            border-radius: 8px;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.3s ease;\n        }\n        \n        .logout-btn:hover {\n            background-color: var(--neon-purple);\n        }\n\n        /* Notification Bell */\n        .notification-icon {\n            position: relative;\n            color: var(--neon-blue);\n            font-size: 1.5rem;\n            cursor: pointer;\n        }\n        \n        .notification-badge {\n            position: absolute;\n            top: -5px;\n            right: -5px;\n            background: var(--neon-pink);\n            color: white;\n            border-radius: 50%;\n            width: 20px;\n            height: 20px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 0.7rem;\n            font-weight: bold;\n        }\n\n        /* Mobile Menu Button */\n        .mobile-menu-btn {\n            display: none;\n            background: none;\n            border: none;\n            color: var(--neon-blue);\n            font-size: 1.5rem;\n            cursor: pointer;\n        }\n\n        /* Hero Section */\n        .hero {\n            padding: 8rem 0 6rem;\n            text-align: center;\n            position: relative;\n            overflow: hidden;\n        }\n\n        .hero:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at center, rgba(255, 42, 109, 0.1) 0%, transparent 70%);\n            z-index: -1;\n        }\n\n        .hero h1 {\n            font-size: 3.5rem;\n            margin-bottom: 1.5rem;\n            font-weight: 700;\n            background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));\n            -webkit-background-clip: text;\n            background-clip: text;\n            color: transparent;\n            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);\n            animation: textGlow 3s infinite alternate;\n        }\n\n        @keyframes textGlow {\n            0% { text-shadow: 0 0 10px rgba(255, 42, 109, 0.5); }\n            50% { text-shadow: 0 0 20px rgba(5, 217, 232, 0.5); }\n            100% { text-shadow: 0 0 20px rgba(0, 255, 157, 0.5); }\n        }\n\n        .hero p {\n            font-size: 1.3rem;\n            max-width: 800px;\n            margin: 0 auto 3rem;\n            opacity: 0.9;\n            line-height: 1.6;\n        }\n\n        /* Contact Section */\n        .contact {\n            padding: 5rem 0;\n            position: relative;\n        }\n\n        .contact:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 80% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 30%);\n            z-index: -1;\n        }\n\n        .section-title {\n            text-align: center;\n            margin-bottom: 4rem;\n        }\n\n        .section-title h2 {\n            font-size: 2.5rem;\n            color: var(--neon-blue);\n            margin-bottom: 1rem;\n            text-shadow: 0 0 10px var(--neon-blue);\n        }\n\n        .section-title p {\n            color: rgba(255, 255, 255, 0.7);\n            max-width: 700px;\n            margin: 0 auto;\n            font-size: 1.1rem;\n        }\n\n        .contact-container {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n            gap: 4rem;\n        }\n\n        .contact-info {\n            display: flex;\n            flex-direction: column;\n            gap: 2rem;\n        }\n\n        .contact-card {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            padding: 2rem;\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n            transition: all 0.3s ease;\n            border: 1px solid rgba(5, 217, 232, 0.3);\n            position: relative;\n            z-index: 1;\n        }\n\n        .contact-card:hover {\n            transform: translateY(-5px);\n            box-shadow: var(--glow);\n            border-color: var(--neon-blue);\n        }\n\n        .contact-card:after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: linear-gradient(135deg, rgba(5, 217, 232, 0.1) 0%, transparent 100%);\n            z-index: -1;\n            opacity: 0;\n            transition: opacity 0.3s ease;\n        }\n\n        .contact-card:hover:after {\n            opacity: 1;\n        }\n\n        .contact-card h3 {\n            font-size: 1.5rem;\n            margin-bottom: 1rem;\n            color: var(--neon-green);\n            display: flex;\n            align-items: center;\n        }\n\n        .contact-card h3 i {\n            margin-right: 0.75rem;\n            color: var(--neon-blue);\n        }\n\n        .contact-card p {\n            color: rgba(255, 255, 255, 0.7);\n            line-height: 1.6;\n            margin-bottom: 1rem;\n        }\n\n        .contact-method {\n            display: flex;\n            align-items: center;\n            margin-bottom: 1rem;\n        }\n\n        .contact-method i {\n            margin-right: 1rem;\n            color: var(--neon-pink);\n            font-size: 1.2rem;\n            width: 20px;\n        }\n\n        .contact-method span {\n            color: rgba(255, 255, 255, 0.9);\n        }\n\n        .social-links {\n            display: flex;\n            gap: 1rem;\n            margin-top: 1.5rem;\n        }\n\n        .social-link {\n            width: 50px;\n            height: 50px;\n            background-color: rgba(255, 255, 255, 0.05);\n            border-radius: 50%;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            color: white;\n            transition: all 0.3s ease;\n            font-size: 1.3rem;\n        }\n\n        .social-link:hover {\n            background-color: var(--neon-pink);\n            transform: translateY(-5px);\n            box-shadow: 0 0 15px var(--neon-pink);\n        }\n\n        /* Contact Form */\n        .contact-form {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            padding: 2.5rem;\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n            border: 1px solid rgba(255, 42, 109, 0.3);\n            position: relative;\n            z-index: 1;\n        }\n\n        .contact-form:after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: linear-gradient(135deg, rgba(255, 42, 109, 0.1) 0%, transparent 100%);\n            z-index: -1;\n            opacity: 0;\n            transition: opacity 0.3s ease;\n        }\n\n        .contact-form:hover:after {\n            opacity: 1;\n        }\n\n        .form-group {\n            margin-bottom: 1.5rem;\n        }\n\n        .form-group label {\n            display: block;\n            margin-bottom: 0.5rem;\n            color: var(--neon-blue);\n            font-weight: 600;\n        }\n\n        .form-control {\n            width: 100%;\n            padding: 1rem;\n            background-color: rgba(255, 255, 255, 0.05);\n            border: 1px solid rgba(5, 217, 232, 0.3);\n            border-radius: 8px;\n            color: white;\n            font-size: 1rem;\n            transition: all 0.3s ease;\n        }\n\n        .form-control:focus {\n            outline: none;\n            border-color: var(--neon-blue);\n            box-shadow: 0 0 10px var(--neon-blue);\n        }\n\n        textarea.form-control {\n            min-height: 150px;\n            resize: vertical;\n        }\n\n        .form-row {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n            gap: 1rem;\n        }\n\n        /* FAQ Section */\n        .faq {\n            padding: 5rem 0;\n            position: relative;\n        }\n\n        .faq:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 20% 70%, rgba(255, 42, 109, 0.1) 0%, transparent 30%);\n            z-index: -1;\n        }\n\n        .faq-container {\n            max-width: 900px;\n            margin: 0 auto;\n        }\n\n        .faq-item {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            margin-bottom: 1.5rem;\n            overflow: hidden;\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n            border: 1px solid rgba(0, 255, 157, 0.3);\n            transition: all 0.3s ease;\n        }\n\n        .faq-item:hover {\n            border-color: var(--neon-green);\n            box-shadow: var(--green-glow);\n        }\n\n        .faq-question {\n            padding: 1.5rem;\n            cursor: pointer;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            font-weight: 600;\n            font-size: 1.1rem;\n            color: var(--neon-green);\n        }\n\n        .faq-question i {\n            transition: transform 0.3s ease;\n        }\n\n        .faq-item.active .faq-question i {\n            transform: rotate(180deg);\n        }\n\n        .faq-answer {\n            padding: 0 1.5rem;\n            max-height: 0;\n            overflow: hidden;\n            transition: max-height 0.3s ease, padding 0.3s ease;\n            color: rgba(255, 255, 255, 0.7);\n            line-height: 1.6;\n        }\n\n        .faq-item.active .faq-answer {\n            padding: 0 1.5rem 1.5rem;\n            max-height: 500px;\n        }\n\n        /* Footer */\n        footer {\n            background-color: var(--darker-bg);\n            color: white;\n            padding: 5rem 0 2rem;\n            position: relative;\n            border-top: 1px solid rgba(5, 217, 232, 0.3);\n        }\n\n        footer:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 50% 0%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);\n            z-index: 0;\n        }\n\n        .footer-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n            gap: 3rem;\n            margin-bottom: 3rem;\n            position: relative;\n            z-index: 1;\n        }\n\n        .footer-col h3 {\n            font-size: 1.5rem;\n            margin-bottom: 1.5rem;\n            position: relative;\n            color: var(--neon-blue);\n        }\n\n        .footer-col h3:after {\n            content: '';\n            position: absolute;\n            left: 0;\n            bottom: -8px;\n            width: 40px;\n            height: 3px;\n            background-color: var(--neon-blue);\n            box-shadow: 0 0 10px var(--neon-blue);\n        }\n\n        .footer-about p {\n            color: rgba(255, 255, 255, 0.7);\n            line-height: 1.6;\n            margin-bottom: 1.5rem;\n        }\n\n        .footer-links {\n            list-style: none;\n            padding: 0;\n            margin: 0;\n            display: flex;\n            flex-direction: column;\n        }\n\n        .footer-links li {\n            margin-bottom: 1rem;\n            display: block;\n            width: 100%;\n        }\n\n        .footer-links a {\n            color: rgba(255, 255, 255, 0.7);\n            text-decoration: none;\n            transition: all 0.3s ease;\n            display: flex;\n            align-items: center;\n        }\n\n        .footer-links a i {\n            margin-right: 0.5rem;\n            color: var(--neon-green);\n        }\n\n        .footer-links a:hover {\n            color: var(--neon-pink);\n            transform: translateX(5px);\n        }\n\n        .footer-social {\n            display: flex;\n            gap: 1rem;\n            margin-top: 1.5rem;\n        }\n\n        .footer-social a {\n            width: 45px;\n            height: 45px;\n            background-color: rgba(255, 255, 255, 0.05);\n            border-radius: 50%;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            color: white;\n            transition: all 0.3s ease;\n            font-size: 1.2rem;\n        }\n\n        .footer-social a:hover {\n            background-color: var(--neon-pink);\n            transform: translateY(-5px);\n            box-shadow: 0 0 15px var(--neon-pink);\n        }\n\n        .footer-contact p {\n            display: flex;\n            align-items: center;\n            margin-bottom: 1rem;\n            color: rgba(255, 255, 255, 0.7);\n        }\n\n        .footer-contact i {\n            margin-right: 0.75rem;\n            color: var(--neon-blue);\n            font-size: 1.2rem;\n        }\n\n        .footer-bottom {\n            text-align: center;\n            padding-top: 2rem;\n            border-top: 1px solid rgba(255, 255, 255, 0.1);\n            color: rgba(255, 255, 255, 0.5);\n            font-size: 0.9rem;\n            position: relative;\n            z-index: 1;\n        }\n\n        /* Status Message */\n        #statusMessage {\n            position: fixed;\n            top: 1rem;\n            right: 1rem;\n            background-color: var(--neon-green);\n            color: var(--darker-bg);\n            padding: 0.75rem 1.5rem;\n            border-radius: 8px;\n            font-weight: bold;\n            box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n            z-index: 1000;\n            display: none;\n        }\n\n        /* Responsive */\n        @media (max-width: 1200px) {\n            .hero h1 {\n                font-size: 3rem;\n            }\n        }\n\n        @media (max-width: 992px) {\n            .hero h1 {\n                font-size: 2.5rem;\n            }\n            \n            .section-title h2 {\n                font-size: 2rem;\n            }\n            \n            .contact-container {\n                grid-template-columns: 1fr;\n                gap: 3rem;\n            }\n        }\n\n        @media (max-width: 768px) {\n            .navbar {\n                flex-direction: column;\n                gap: 1.5rem;\n            }\n            \n            .nav-links {\n                flex-wrap: wrap;\n                justify-content: center;\n            }\n            \n            .hero h1 {\n                font-size: 2rem;\n            }\n            \n            .hero p {\n                font-size: 1.1rem;\n            }\n            \n            .section-title h2 {\n                font-size: 1.8rem;\n            }\n            \n            .container {\n                padding: 0 1.5rem;\n            }\n            \n            .form-row {\n                grid-template-columns: 1fr;\n            }\n            \n            .mobile-menu-btn {\n                display: block;\n            }\n            \n            .nav-links {\n                display: none;\n                flex-direction: column;\n                width: 100%;\n                background: var(--darker-bg);\n                position: absolute;\n                top: 100%;\n                left: 0;\n                padding: 1rem;\n                box-shadow: 0 10px 20px rgba(0,0,0,0.3);\n                border-top: 1px solid var(--neon-blue);\n            }\n            \n            .nav-links.active {\n                display: flex;\n            }\n            \n            .nav-links a {\n                padding: 0.75rem 0;\n                border-bottom: 1px solid rgba(5, 217, 232, 0.2);\n            }\n            \n            .nav-links a:last-child {\n                border-bottom: none;\n            }\n            \n            .user-profile {\n                width: 100%;\n                justify-content: center;\n            }\n            \n            .auth-buttons {\n                justify-content: center;\n            }\n        }\n\n        @media (max-width: 576px) {\n            .hero h1 {\n                font-size: 1.8rem;\n            }\n            \n            .hero p {\n                font-size: 1rem;\n            }\n            \n            .section-title h2 {\n                font-size: 1.6rem;\n            }\n            \n            .container {\n                padding: 0 1rem;\n            }\n            \n            .contact-form {\n                padding: 1.5rem;\n            }\n        }\n    " }} />
        {/* Header */}
        <header>
          <div className="container">
            <div className="navbar">
              <Link to="/" className="logo">
                <i className="fas fa-bolt" />
                NeonGigs
              </Link>
              <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/Categories">Categories</Link>
                <Link to="/ContactSupport" className="active">Contact Support</Link>
              </div>
              <div className="notification-icon" id="notificationIcon">
                <i className="fas fa-bell" />
                <span className="notification-badge" id="notificationBadge" style={{display: 'none'}}>3</span>
              </div>
              <button className="mobile-menu-btn" id="mobileMenuBtn">
                <i className="fas fa-bars" />
              </button>
              <div className="auth-buttons" id="authButtons" style={{display: isLoggedIn ? 'none' : 'flex'}}>
                <Link to="/signin" className="btn btn-outline">Login</Link>
                <Link to="/login" className="btn btn-primary">Join Now</Link>
              </div>
              <div className="user-profile" id="userProfile" style={{display: isLoggedIn ? 'flex' : 'none'}}>
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
                <span id="userRoleDisplay">{userData ? userData.name : 'User Name'}</span>
                <button className="logout-btn" id="logoutBtn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </header>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1 className="animate__animated animate__fadeInDown">Contact Support</h1>
            <p className="animate__animated animate__fadeIn animate__delay-1s">We're here to help! Get in touch with our support team for any questions or issues.</p>
          </div>
        </section>
        {/* Contact Section */}
        <section className="contact">
          <div className="container">
            <div className="section-title">
              <h2>Get In Touch</h2>
              <p>Choose the best way to contact us based on your needs</p>
            </div>
            <div className="contact-container">
              <div className="contact-info">
                <div className="contact-card">
                  <h3><i className="fas fa-headset" /> Support Center</h3>
                  <p>Our support team is available 24/7 to help you with any issues or questions you might have.</p>
                  <div className="contact-method">
                    <i className="fas fa-phone" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-method">
                    <i className="fas fa-envelope" />
                    <span>support@neongigs.com</span>
                  </div>
                  <div className="contact-method">
                    <i className="fas fa-clock" />
                    <span>24/7 Availability</span>
                  </div>
                </div>
                <div className="contact-card">
                  <h3><i className="fas fa-comments" /> Live Chat</h3>
                  <p>Get instant help from our support agents through our live chat system.</p>
                  <div className="contact-method">
                    <i className="fas fa-comment-dots" />
                    <span>Available 9 AM - 11 PM EST</span>
                  </div>
                  <button className="btn btn-primary" id="liveChatBtn" onClick={openLiveChat} style={{marginTop: '1rem'}}>
                    <i className="fas fa-comment-alt" /> Start Live Chat
                  </button>
                </div>
                <div className="contact-card">
                  <h3><i className="fas fa-share-alt" /> Follow Us</h3>
                  <p>Stay connected with us on social media for updates, tips, and community discussions.</p>
                  <div className="social-links">
                    <a href="#" className="social-link"><i className="fab fa-facebook-f" /></a>
                    <a href="#" className="social-link"><i className="fab fa-twitter" /></a>
                    <a href="#" className="social-link"><i className="fab fa-instagram" /></a>
                    <a href="#" className="social-link"><i className="fab fa-linkedin-in" /></a>
                  </div>
                </div>
              </div>
              <div className="contact-form">
                <h3 style={{color: 'var(--neon-pink)', marginBottom: '1.5rem', fontSize: '1.5rem'}}>Send Us a Message</h3>
                <form id="supportForm">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input type="text" id="name" className="form-control" placeholder="Enter your name" required style={{
                        backgroundColor: 'rgba(5, 217, 232, 0.1)',
                        border: '1px solid var(--neon-blue)',
                        color: 'var(--light-text)'
                      }} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" className="form-control" placeholder="Enter your email" required style={{
                        backgroundColor: 'rgba(5, 217, 232, 0.1)',
                        border: '1px solid var(--neon-blue)',
                        color: 'var(--light-text)'
                      }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" className="form-control" placeholder="What is this regarding?" required style={{
                      backgroundColor: 'rgba(5, 217, 232, 0.1)',
                      border: '1px solid var(--neon-blue)',
                      color: 'var(--light-text)'
                    }} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Issue Category</label>
                    <select id="category" className="form-control" required style={{
                      backgroundColor: 'rgba(5, 217, 232, 0.1)',
                      border: '1px solid var(--neon-blue)',
                      color: 'var(--light-text)',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      background: 'rgba(5, 217, 232, 0.1) url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2305d9e8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'feather feather-chevron-down\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>") no-repeat right 1rem center',
                      backgroundSize: '1rem'
                    }}>
                      <option value="" style={{backgroundColor: 'var(--dark-bg)', color: 'var(--light-text)'}}>Select a category</option>
                      <option value="technical" style={{backgroundColor: 'var(--dark-bg)', color: 'var(--light-text)'}}>Technical Issue</option>
                      <option value="billing" style={{backgroundColor: 'var(--dark-bg)', color: 'var(--light-text)'}}>Billing &amp; Payments</option>
                      <option value="account" style={{backgroundColor: 'var(--dark-bg)', color: 'var(--light-text)'}}>Account Issues</option>
                      <option value="service" style={{backgroundColor: 'var(--dark-bg)', color: 'var(--light-text)'}}>Service Quality</option>
                      <option value="other" style={{backgroundColor: 'var(--dark-bg)', color: 'var(--light-text)'}}>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea id="message" className="form-control" placeholder="Please describe your issue in detail..." required style={{
                      backgroundColor: 'rgba(5, 217, 232, 0.1)',
                      border: '1px solid var(--neon-blue)',
                      color: 'var(--light-text)'
                    }} defaultValue={""} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                    <i className="fas fa-paper-plane" /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="faq">
          <div className="container">
            <div className="section-title">
              <h2>Frequently Asked Questions</h2>
              <p>Quick answers to common questions</p>
            </div>
            <div className="faq-container" id="faqContainer">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  <div
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div id="statusMessage" />
        
        {/* Live Chat Window */}
        {isChatOpen && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            maxWidth: '90vw',
            height: '500px',
            backgroundColor: 'var(--card-bg)',
            border: '2px solid var(--neon-blue)',
            borderRadius: '15px',
            boxShadow: '0 0 30px rgba(5, 217, 232, 0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'linear-gradient(45deg, var(--neon-blue), var(--neon-purple))',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--neon-blue)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-comment-dots" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Live Support</h4>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>We typically reply in minutes</span>
                </div>
              </div>
              <button onClick={closeLiveChat} style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {chatMessages.map((msg, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '70%',
                    padding: '0.75rem 1rem',
                    borderRadius: '15px',
                    backgroundColor: msg.type === 'user' ? 'var(--neon-pink)' : 'rgba(5, 217, 232, 0.2)',
                    border: msg.type === 'bot' ? '1px solid var(--neon-blue)' : 'none',
                    color: 'white'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{msg.message}</p>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid var(--neon-blue)',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'rgba(5, 217, 232, 0.1)',
                  border: '1px solid var(--neon-blue)',
                  borderRadius: '8px',
                  color: 'var(--light-text)',
                  outline: 'none'
                }}
              />
              <button onClick={sendChatMessage} style={{
                padding: '0.75rem 1.25rem',
                background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
        
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