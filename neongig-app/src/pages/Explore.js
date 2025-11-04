import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

export default function Explore() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

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
        <title>Spotlight - NeonGigs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@300;400;600;700&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: "\n        :root {\n            --neon-pink: #ff2a6d;\n            --neon-blue: #05d9e8;\n            --neon-purple: #d300c5;\n            --neon-green: #00ff9d;\n            --neon-yellow: #fff700;\n            --dark-bg: #0d0221;\n            --darker-bg: #05010f;\n            --light-text: #f5f6fa;\n            --card-bg: rgba(13, 2, 33, 0.7);\n            --pink-glow: 0 0 15px rgba(255, 42, 109, 0.7);\n            --blue-glow: 0 0 15px rgba(5, 217, 232, 0.7);\n            --green-glow: 0 0 15px rgba(0, 255, 157, 0.7);\n        }\n\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: 'Rajdhani', 'Poppins', sans-serif;\n        }\n\n        body {\n            background-color: var(--dark-bg);\n            color: var(--light-text);\n            min-height: 100vh;\n            overflow-x: hidden;\n            background-image: \n                radial-gradient(circle at 10% 20%, rgba(255, 42, 109, 0.1) 0%, transparent 20%),\n                radial-gradient(circle at 90% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 25%),\n                radial-gradient(circle at 50% 80%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);\n        }\n\n        .container {\n            max-width: 1400px;\n            margin: 0 auto;\n            padding: 0 2rem;\n        }\n\n        /* Header Styles */\n        header {\n            background-color: rgba(13, 2, 33, 0.9);\n            box-shadow: 0 2px 20px rgba(5, 217, 232, 0.2);\n            position: sticky;\n            top: 0;\n            z-index: 100;\n            border-bottom: 1px solid var(--neon-blue);\n        }\n\n        .navbar {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            padding: 1.5rem 0;\n        }\n\n        .logo {\n            font-size: 2rem;\n            font-weight: 700;\n            color: var(--neon-blue);\n            text-decoration: none;\n            display: flex;\n            align-items: center;\n        }\n\n        .logo i {\n            margin-right: 0.5rem;\n        }\n\n        .nav-links {\n            display: flex;\n            align-items: center;\n            gap: 2rem;\n        }\n\n        .nav-links a {\n            text-decoration: none;\n            color: var(--light-text);\n            font-weight: 500;\n            transition: all 0.3s ease;\n            position: relative;\n        }\n\n        .nav-links a:hover {\n            color: var(--neon-pink);\n        }\n\n        .nav-links a.active {\n            color: var(--neon-blue);\n        }\n\n        .nav-links a:after {\n            content: '';\n            position: absolute;\n            bottom: -5px;\n            left: 0;\n            width: 0;\n            height: 2px;\n            background-color: var(--neon-pink);\n            transition: width 0.3s ease;\n        }\n\n        .nav-links a:hover:after {\n            width: 100%;\n        }\n\n        /* Hero Section */\n        .spotlight-hero {\n            padding: 6rem 0 4rem;\n            text-align: center;\n            position: relative;\n            overflow: hidden;\n        }\n\n        .spotlight-hero:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at center, rgba(255, 42, 109, 0.1) 0%, transparent 70%);\n            z-index: -1;\n        }\n\n        .spotlight-hero h1 {\n            font-size: 3.5rem;\n            margin-bottom: 1.5rem;\n            font-weight: 700;\n            background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));\n            -webkit-background-clip: text;\n            background-clip: text;\n            color: transparent;\n            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);\n            animation: textGlow 3s infinite alternate;\n        }\n\n        @keyframes textGlow {\n            0% { text-shadow: 0 0 10px rgba(255, 42, 109, 0.5); }\n            50% { text-shadow: 0 0 20px rgba(5, 217, 232, 0.5); }\n            100% { text-shadow: 0 0 20px rgba(0, 255, 157, 0.5); }\n        }\n\n        .spotlight-hero p {\n            font-size: 1.3rem;\n            max-width: 800px;\n            margin: 0 auto 3rem;\n            opacity: 0.9;\n            line-height: 1.6;\n        }\n\n        /* Section Styles */\n        .section-title {\n            text-align: center;\n            margin-bottom: 3rem;\n            position: relative;\n        }\n\n        .section-title h2 {\n            font-size: 2.5rem;\n            color: var(--neon-blue);\n            margin-bottom: 1rem;\n            text-shadow: 0 0 10px var(--neon-blue);\n            display: inline-block;\n            position: relative;\n        }\n\n        .section-title h2:after {\n            content: '';\n            position: absolute;\n            bottom: -10px;\n            left: 50%;\n            transform: translateX(-50%);\n            width: 80px;\n            height: 3px;\n            background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue));\n            box-shadow: 0 0 10px var(--neon-blue);\n        }\n\n        /* Spotlight Grid */\n        .spotlight-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\n            gap: 2rem;\n            margin-bottom: 4rem;\n        }\n\n        .spotlight-card {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            overflow: hidden;\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n            transition: all 0.4s ease;\n            border: 1px solid rgba(5, 217, 232, 0.3);\n            position: relative;\n            z-index: 1;\n        }\n\n        .spotlight-card:hover {\n            transform: translateY(-10px);\n            box-shadow: var(--blue-glow);\n            border-color: var(--neon-blue);\n        }\n\n        .spotlight-card.featured {\n            border-color: var(--neon-pink);\n        }\n\n        .spotlight-card.featured:hover {\n            box-shadow: var(--pink-glow);\n            border-color: var(--neon-pink);\n        }\n\n        .spotlight-card.trending {\n            border-color: var(--neon-green);\n        }\n\n        .spotlight-card.trending:hover {\n            box-shadow: var(--green-glow);\n            border-color: var(--neon-green);\n        }\n\n        .spotlight-badge {\n            position: absolute;\n            top: 1rem;\n            left: 1rem;\n            padding: 0.5rem 1rem;\n            border-radius: 50px;\n            font-size: 0.8rem;\n            font-weight: 600;\n            z-index: 2;\n            text-transform: uppercase;\n            letter-spacing: 1px;\n        }\n\n        .featured .spotlight-badge {\n            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));\n            color: white;\n            box-shadow: 0 0 10px var(--neon-pink);\n        }\n\n        .trending .spotlight-badge {\n            background: linear-gradient(45deg, var(--neon-green), #00cc88);\n            color: var(--dark-bg);\n            box-shadow: 0 0 10px var(--neon-green);\n        }\n\n        .spotlight-image {\n            height: 200px;\n            position: relative;\n            overflow: hidden;\n        }\n\n        .spotlight-image img {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n            transition: transform 0.6s ease;\n        }\n\n        .spotlight-card:hover .spotlight-image img {\n            transform: scale(1.1);\n        }\n\n        .spotlight-info {\n            padding: 1.5rem;\n        }\n\n        .spotlight-category {\n            font-size: 0.9rem;\n            color: var(--neon-blue);\n            margin-bottom: 0.5rem;\n            text-transform: uppercase;\n            letter-spacing: 1px;\n        }\n\n        .spotlight-title {\n            font-size: 1.4rem;\n            font-weight: 600;\n            margin-bottom: 1rem;\n            color: white;\n        }\n\n        .spotlight-description {\n            color: rgba(255, 255, 255, 0.7);\n            margin-bottom: 1.5rem;\n            font-size: 0.95rem;\n            line-height: 1.5;\n        }\n\n        .spotlight-footer {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n        }\n\n        .spotlight-price {\n            font-weight: 700;\n            font-size: 1.3rem;\n            color: var(--neon-green);\n            text-shadow: 0 0 5px var(--neon-green);\n        }\n\n        .spotlight-rating {\n            display: flex;\n            align-items: center;\n            color: var(--neon-yellow);\n            font-size: 0.9rem;\n        }\n\n        .spotlight-rating i {\n            margin-right: 0.25rem;\n        }\n\n        .btn-primary {\n            padding: 0.75rem 1.5rem;\n            border-radius: 8px;\n            font-weight: 600;\n            cursor: pointer;\n            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));\n            color: white;\n            border: none;\n            transition: all 0.3s ease;\n        }\n\n        .btn-primary:hover {\n            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));\n            box-shadow: 0 0 15px var(--neon-pink);\n            transform: translateY(-2px);\n        }\n\n        /* Success Stories Section */\n        .success-stories {\n            padding: 5rem 0;\n            position: relative;\n        }\n\n        .success-stories:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 80% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 30%);\n            z-index: -1;\n        }\n\n        .stories-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));\n            gap: 2rem;\n        }\n\n        .story-card {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            padding: 2rem;\n            border: 1px solid rgba(255, 42, 109, 0.3);\n            transition: all 0.3s ease;\n        }\n\n        .story-card:hover {\n            transform: translateY(-5px);\n            box-shadow: var(--pink-glow);\n            border-color: var(--neon-pink);\n        }\n\n        .story-header {\n            display: flex;\n            align-items: center;\n            margin-bottom: 1.5rem;\n        }\n\n        .story-avatar {\n            width: 60px;\n            height: 60px;\n            border-radius: 50%;\n            overflow: hidden;\n            margin-right: 1rem;\n            border: 2px solid var(--neon-blue);\n        }\n\n        .story-avatar img {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n        }\n\n        .story-user h4 {\n            font-size: 1.2rem;\n            color: var(--neon-green);\n            margin-bottom: 0.25rem;\n        }\n\n        .story-user p {\n            color: rgba(255, 255, 255, 0.7);\n            font-size: 0.9rem;\n        }\n\n        .story-content {\n            margin-bottom: 1.5rem;\n        }\n\n        .story-content p {\n            color: rgba(255, 255, 255, 0.8);\n            line-height: 1.6;\n            font-style: italic;\n        }\n\n        .story-stats {\n            display: flex;\n            justify-content: space-between;\n            color: rgba(255, 255, 255, 0.7);\n            font-size: 0.9rem;\n        }\n\n        .story-service {\n            color: var(--neon-blue);\n        }\n\n        /* Limited Offers Section */\n        .limited-offers {\n            padding: 5rem 0;\n            position: relative;\n        }\n\n        .limited-offers:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 20% 70%, rgba(255, 42, 109, 0.1) 0%, transparent 30%);\n            z-index: -1;\n        }\n\n        .offers-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n            gap: 2rem;\n        }\n\n        .offer-card {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            overflow: hidden;\n            border: 1px solid rgba(211, 0, 197, 0.3);\n            position: relative;\n            transition: all 0.3s ease;\n        }\n\n        .offer-card:hover {\n            transform: translateY(-5px);\n            box-shadow: 0 0 20px rgba(211, 0, 197, 0.5);\n            border-color: var(--neon-purple);\n        }\n\n        .offer-badge {\n            position: absolute;\n            top: 1rem;\n            right: 1rem;\n            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));\n            color: white;\n            padding: 0.5rem 1rem;\n            border-radius: 50px;\n            font-size: 0.8rem;\n            font-weight: 600;\n            z-index: 2;\n            text-transform: uppercase;\n            letter-spacing: 1px;\n            box-shadow: 0 0 10px var(--neon-purple);\n        }\n\n        .offer-image {\n            height: 180px;\n            position: relative;\n            overflow: hidden;\n        }\n\n        .offer-image img {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n        }\n\n        .offer-info {\n            padding: 1.5rem;\n        }\n\n        .offer-title {\n            font-size: 1.3rem;\n            font-weight: 600;\n            margin-bottom: 1rem;\n            color: white;\n        }\n\n        .offer-description {\n            color: rgba(255, 255, 255, 0.7);\n            margin-bottom: 1.5rem;\n            font-size: 0.95rem;\n            line-height: 1.5;\n        }\n\n        .offer-footer {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n        }\n\n        .offer-price {\n            display: flex;\n            align-items: center;\n        }\n\n        .original-price {\n            text-decoration: line-through;\n            color: rgba(255, 255, 255, 0.5);\n            margin-right: 0.5rem;\n        }\n\n        .discounted-price {\n            font-weight: 700;\n            font-size: 1.3rem;\n            color: var(--neon-green);\n            text-shadow: 0 0 5px var(--neon-green);\n        }\n\n        .offer-timer {\n            font-size: 0.9rem;\n            color: var(--neon-pink);\n            font-weight: 600;\n        }\n\n        /* Modal Styles */\n        .modal {\n            display: none;\n            position: fixed;\n            z-index: 1001;\n            left: 0;\n            top: 0;\n            width: 100%;\n            height: 100%;\n            background-color: rgba(0,0,0,0.7);\n            backdrop-filter: blur(5px);\n        }\n\n        .modal-content {\n            background-color: var(--darker-bg);\n            border: 1px solid var(--neon-blue);\n            margin: 10% auto;\n            padding: 2rem;\n            border-radius: 15px;\n            width: 80%;\n            max-width: 500px;\n            position: relative;\n            box-shadow: 0 0 30px rgba(5, 217, 232, 0.3);\n        }\n\n        .close-btn {\n            color: #aaa;\n            position: absolute;\n            top: 1rem;\n            right: 1.5rem;\n            font-size: 28px;\n            font-weight: bold;\n            cursor: pointer;\n            transition: color 0.3s ease;\n        }\n\n        .close-btn:hover {\n            color: var(--neon-pink);\n        }\n\n        .modal-content h3 {\n            color: var(--neon-blue);\n            margin-bottom: 1.5rem;\n            text-align: center;\n        }\n\n        .queue-status {\n            margin-bottom: 1rem;\n            text-align: center;\n        }\n\n        .queue-status span {\n            color: var(--neon-green);\n            font-weight: bold;\n        }\n\n        .form-group {\n            margin-bottom: 1.5rem;\n        }\n\n        .form-group label {\n            display: block;\n            margin-bottom: 0.5rem;\n            color: var(--light-text);\n        }\n\n        .form-group textarea {\n            width: 100%;\n            background: var(--card-bg);\n            border: 1px solid var(--neon-blue);\n            color: white;\n            padding: 0.75rem;\n            border-radius: 8px;\n            min-height: 100px;\n            resize: vertical;\n        }\n\n        .loading-overlay {\n            display: none;\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0,0,0,0.8);\n            justify-content: center;\n            align-items: center;\n            text-align: center;\n            border-radius: 15px;\n            flex-direction: column;\n        }\n\n        .spinner {\n            border: 4px solid rgba(255, 255, 255, 0.3);\n            border-top: 4px solid var(--neon-blue);\n            border-radius: 50%;\n            width: 50px;\n            height: 50px;\n            animation: spin 1s linear infinite;\n            margin-bottom: 1rem;\n        }\n\n        @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n        }\n\n        .success-message {\n            display: none;\n            text-align: center;\n            padding: 2rem 0;\n        }\n\n        .success-message .icon {\n            font-size: 3rem;\n            color: var(--neon-green);\n            margin-bottom: 1rem;\n        }\n\n        .success-message h4 {\n            font-size: 1.5rem;\n            margin-bottom: 1rem;\n            color: var(--neon-green);\n        }\n\n        /* Footer */\n        footer {\n            background-color: var(--darker-bg);\n            color: white;\n            padding: 4rem 0 2rem;\n            position: relative;\n            border-top: 1px solid rgba(5, 217, 232, 0.3);\n            margin-top: 4rem;\n        }\n\n        footer:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 50% 0%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);\n            z-index: 0;\n        }\n\n        .footer-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n            gap: 3rem;\n            margin-bottom: 3rem;\n            position: relative;\n            z-index: 1;\n        }\n\n        .footer-col h3 {\n            font-size: 1.5rem;\n            margin-bottom: 1.5rem;\n            position: relative;\n            color: var(--neon-blue);\n        }\n\n        .footer-col h3:after {\n            content: '';\n            position: absolute;\n            left: 0;\n            bottom: -8px;\n            width: 40px;\n            height: 3px;\n            background-color: var(--neon-blue);\n            box-shadow: 0 0 10px var(--neon-blue);\n        }\n\n        .footer-about p {\n            color: rgba(255, 255, 255, 0.7);\n            line-height: 1.6;\n            margin-bottom: 1.5rem;\n        }\n\n        .footer-links {\n            list-style: none;\n            padding: 0;\n            margin: 0;\n            display: flex;\n            flex-direction: column;\n        }\n\n        .footer-links li {\n            margin-bottom: 1rem;\n            display: block;\n            width: 100%;\n        }\n\n        .footer-links a {\n            color: rgba(255, 255, 255, 0.7);\n            text-decoration: none;\n            transition: all 0.3s ease;\n            display: flex;\n            align-items: center;\n        }\n\n        .footer-links a i {\n            margin-right: 0.5rem;\n            color: var(--neon-green);\n        }\n\n        .footer-links a:hover {\n            color: var(--neon-pink);\n            transform: translateX(5px);\n        }\n\n        .footer-social {\n            display: flex;\n            gap: 1rem;\n            margin-top: 1.5rem;\n        }\n\n        .footer-social a {\n            width: 45px;\n            height: 45px;\n            background-color: rgba(255, 255, 255, 0.05);\n            border-radius: 50%;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            color: white;\n            transition: all 0.3s ease;\n            font-size: 1.2rem;\n        }\n\n        .footer-social a:hover {\n            background-color: var(--neon-pink);\n            transform: translateY(-5px);\n            box-shadow: 0 0 15px var(--neon-pink);\n        }\n\n        .footer-contact p {\n            display: flex;\n            align-items: center;\n            margin-bottom: 1rem;\n            color: rgba(255, 255, 255, 0.7);\n        }\n\n        .footer-contact i {\n            margin-right: 0.75rem;\n            color: var(--neon-blue);\n            font-size: 1.2rem;\n        }\n\n        .footer-bottom {\n            text-align: center;\n            padding-top: 2rem;\n            border-top: 1px solid rgba(255, 255, 255, 0.1);\n            color: rgba(255, 255, 255, 0.5);\n            font-size: 0.9rem;\n            position: relative;\n            z-index: 1;\n        }\n\n        /* Responsive */\n        @media (max-width: 992px) {\n            .spotlight-hero h1 {\n                font-size: 2.5rem;\n            }\n            \n            .section-title h2 {\n                font-size: 2rem;\n            }\n        }\n\n        @media (max-width: 768px) {\n            .navbar {\n                flex-direction: column;\n                gap: 1.5rem;\n            }\n            \n            .nav-links {\n                flex-wrap: wrap;\n                justify-content: center;\n            }\n            \n            .spotlight-hero h1 {\n                font-size: 2rem;\n            }\n            \n            .spotlight-hero p {\n                font-size: 1.1rem;\n            }\n            \n            .section-title h2 {\n                font-size: 1.8rem;\n            }\n            \n            .container {\n                padding: 0 1.5rem;\n            }\n        }\n\n        @media (max-width: 576px) {\n            .spotlight-hero h1 {\n                font-size: 1.8rem;\n            }\n            \n            .spotlight-hero p {\n                font-size: 1rem;\n            }\n            \n            .section-title h2 {\n                font-size: 1.6rem;\n            }\n            \n            .container {\n                padding: 0 1rem;\n            }\n            \n            .spotlight-grid, .stories-grid, .offers-grid {\n                grid-template-columns: 1fr;\n            }\n        }\n    " }} />
        {/* Header */}
        <header>
          <div className="container">
            <nav className="navbar">
              <Link to="/" className="logo"><i className="fas fa-bolt" />NeonGigs</Link>
              <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/Categories">Categories</Link>
               <Link to="/Explore" className="active">Spotlight</Link>

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
          </div>
        </header>
        {/* Hero Section */}
        <section className="spotlight-hero">
          <div className="container">
            <h1>Spotlight Services</h1>
            <p>Discover hand-picked services, trending gigs, and limited-time offers curated just for you</p>
          </div>
        </section>
        {/* Featured Services Section */}
        <section className="featured-services">
          <div className="container">
            <div className="section-title">
              <h2>Featured Services</h2>
              <p>Hand-picked by our team for exceptional quality and results</p>
            </div>
           <div className="spotlight-grid">
  {[
    { title: "Logo Design", category: "Graphics & Design", price: "$25", rating: 4.9, image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80" },
    { title: "SEO Optimization", category: "Digital Marketing", price: "$40", rating: 4.8, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" },
    { title: "App UI Design", category: "UI/UX", price: "$50", rating: 5.0, image: "https://images.unsplash.com/photo-1612832021059-9e6b9b1f6ec9?auto=format&fit=crop&w=800&q=80" }
  ].map((item, index) => (
    <div key={index} className="spotlight-card featured">
      <div className="spotlight-badge">Featured</div>
      <div className="spotlight-image">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="spotlight-info">
        <div className="spotlight-category">{item.category}</div>
        <h3 className="spotlight-title">{item.title}</h3>
        <p className="spotlight-description">High-quality {item.category.toLowerCase()} services for your project.</p>
        <div className="spotlight-footer">
          <div className="spotlight-price">{item.price}</div>
          <div className="spotlight-rating">
            <i className="fas fa-star" /> {item.rating}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

          </div>
        </section>
        {/* Trending Services Section */}
        <section className="trending-services">
          <div className="container">
            <div className="section-title">
              <h2>Trending Now</h2>
              <p>See what's popular this week among our community</p>
            </div>
           <div className="spotlight-grid">
  {[
    { title: "Video Editing", category: "Media Production", price: "$60", rating: 4.9, image: "https://images.unsplash.com/photo-1581091012184-5c1ccdc6e46e?auto=format&fit=crop&w=800&q=80" },
    { title: "Social Media Ads", category: "Marketing", price: "$35", rating: 4.7, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" },
    { title: "Web Development", category: "Tech", price: "$100", rating: 5.0, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" }
  ].map((item, index) => (
    <div key={index} className="spotlight-card trending">
      <div className="spotlight-badge">Trending</div>
      <div className="spotlight-image">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="spotlight-info">
        <div className="spotlight-category">{item.category}</div>
        <h3 className="spotlight-title">{item.title}</h3>
        <p className="spotlight-description">Currently trending in {item.category.toLowerCase()}.</p>
        <div className="spotlight-footer">
          <div className="spotlight-price">{item.price}</div>
          <div className="spotlight-rating"><i className="fas fa-star" /> {item.rating}</div>
        </div>
      </div>
    </div>
  ))}
</div>

          </div>
        </section>
        {/* Success Stories Section */}
        <section className="success-stories">
          <div className="container">
            <div className="section-title">
              <h2>Success Stories</h2>
              <p>Real results from real customers</p>
            </div>
            <div className="stories-grid">
  {[
    { name: "Emily Carter", service: "Logo Design", story: "NeonGigs helped me find a perfect designer who nailed my brand’s aesthetic!", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "James Lee", service: "App UI", story: "The process was smooth and professional. Loved the results!", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Aisha Malik", service: "SEO Optimization", story: "My website traffic grew 3x in a month! Highly recommend.", avatar: "https://randomuser.me/api/portraits/women/65.jpg" }
  ].map((s, i) => (
    <div key={i} className="story-card">
      <div className="story-header">
        <div className="story-avatar"><img src={s.avatar} alt={s.name} /></div>
        <div className="story-user">
          <h4>{s.name}</h4>
          <p className="story-service">{s.service}</p>
        </div>
      </div>
      <div className="story-content">
        <p>“{s.story}”</p>
      </div>
      <div className="story-stats">
        <span><i className="fas fa-thumbs-up" /> Verified</span>
        <span><i className="fas fa-clock" /> Recently Completed</span>
      </div>
    </div>
  ))}
</div>

          </div>
        </section>
        {/* Limited Offers Section */}
        <section className="limited-offers">
          <div className="container">
            <div className="section-title">
              <h2>Limited Time Offers</h2>
              <p>Special deals available for a short time only</p>
            </div>
            <div className="offers-grid">
  {[
    { title: "Business Card Design", description: "Premium design package for startups", price: "$15", original: "$30", image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=800&q=80" },
    { title: "Portfolio Website", description: "Responsive portfolio site for creatives", price: "$80", original: "$120", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" },
    { title: "Intro Animation", description: "Eye-catching motion intro for your videos", price: "$25", original: "$50", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" }
  ].map((offer, idx) => (
    <div key={idx} className="offer-card">
      <div className="offer-badge">Limited</div>
      <div className="offer-image">
        <img src={offer.image} alt={offer.title} />
      </div>
      <div className="offer-info">
        <h3 className="offer-title">{offer.title}</h3>
        <p className="offer-description">{offer.description}</p>
        <div className="offer-footer">
          <div className="offer-price">
            <span className="original-price">{offer.original}</span>
            <span className="discounted-price">{offer.price}</span>
          </div>
          <span className="offer-timer"><i className="fas fa-clock" /> Ends Soon</span>
        </div>
      </div>
    </div>
  ))}
</div>

          </div>
        </section>
        {/* Hire Modal */}
        <div id="hireModal" className="modal">
          <div className="modal-content">
            <span className="close-btn">×</span>
            <div id="hire-initial-view">
              <h3>Contact Seller &amp; Place Order</h3>
              <div className="queue-status">Queue Status: <span>Available</span></div>
              <div className="form-group">
                <label htmlFor="message">Send a message (optional):</label>
                <textarea id="message" placeholder="Hi, I'd like to get a quote for..." defaultValue={""} />
              </div>
              <button id="buyNowBtn" className="btn-primary" style={{width: '100%'}}>Buy Now</button>
            </div>
            <div className="loading-overlay" id="loading-view">
              <div className="spinner" />
              <p style={{marginTop: '1rem', color: 'var(--light-text)'}}>Processing Transaction...</p>
            </div>
            <div className="success-message" id="success-view">
              <div className="icon"><i className="fas fa-check-circle" /></div>
              <h4>Transaction Successful!</h4>
              <p>Your order has been placed.</p>
            </div>
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