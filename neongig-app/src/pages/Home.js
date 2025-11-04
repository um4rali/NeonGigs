import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState('USD');
    const navigate = useNavigate();
    
    // Search functionality states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const checkLoginStatus = async () => {
        try {
            const storedUserData = localStorage.getItem('userData');
            const token = localStorage.getItem('token');
            
            if (storedUserData && token) {
                const user = JSON.parse(storedUserData);
                
                if (user.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUserData(user);
                    console.log('✅ User logged in:', user.name);
                } else {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setUserData(null);
                }
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    // Mock search function with AI simulation
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);

        // Simulate API delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Mock AI-powered search results
            const mockResults = getMockSearchResults(query);
            setSearchResults(mockResults);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Enhanced mock data with AI-themed results
    const getMockSearchResults = (query) => {
        const services = [
            {
                id: 1,
                title: `AI ${query} Assistant Development`,
                type: 'service',
                icon: 'fas fa-robot',
                description: 'Custom AI solution for your business needs',
                price: 199,
                category: 'AI Development'
            },
            {
                id: 2,
                title: `Professional ${query} Design`,
                type: 'service',
                icon: 'fas fa-paint-brush',
                description: 'Modern and creative design solutions',
                price: 89,
                category: 'Design'
            },
            {
                id: 3,
                title: `${query} Web Application`,
                type: 'service',
                icon: 'fas fa-code',
                description: 'Full-stack development with latest technologies',
                price: 299,
                category: 'Development'
            },
            {
                id: 4,
                title: `${query} Content Strategy`,
                type: 'service',
                icon: 'fas fa-pen-fancy',
                description: 'AI-optimized content creation and strategy',
                price: 149,
                category: 'Marketing'
            },
            {
                id: 5,
                title: `${query} Mobile App`,
                type: 'service',
                icon: 'fas fa-mobile-alt',
                description: 'Cross-platform mobile application development',
                price: 399,
                category: 'Mobile Development'
            }
        ];
        
        const freelancers = [
            {
                id: 101,
                title: `Sarah Chen - ${query} Expert`,
                type: 'freelancer',
                icon: 'fas fa-user-tie',
                description: 'AI Specialist • 5+ years experience',
                rating: 4.9,
                category: 'AI Development'
            },
            {
                id: 102,
                title: `Mike Rodriguez - ${query} Developer`,
                type: 'freelancer',
                icon: 'fas fa-user',
                description: 'Full Stack Developer • 3+ years experience',
                rating: 4.7,
                category: 'Development'
            }
        ];
        
        return [...services.slice(0, 3), ...freelancers];
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // Debounce search - wait 500ms after user stops typing
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            if (value.trim()) {
                handleSearch(value);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            // Show AI thinking animation
            setIsSearching(true);
            setShowResults(true);
            
            setTimeout(() => {
                handleSearch(searchQuery);
            }, 300);
        }
    };

    const handleResultClick = (result) => {
        console.log(`Navigating to ${result.type}:`, result.title);
        setShowResults(false);
        setSearchQuery('');
        
        // Show success message
        const popup = document.createElement('div');
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
                <i class="fas fa-robot" style="font-size: 1.2rem;"></i>
                <span>AI found: "${result.title}"</span>
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

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserData(null);
        
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

    const handleCurrencyToggle = () => {
        setIsCurrencyOpen(!isCurrencyOpen);
    };

    const handleCurrencySelect = (currency) => {
        setCurrentCurrency(currency);
        setIsCurrencyOpen(false);
    };

    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>NeonGigs - Digital Services Marketplace</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet" />
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
            transition: all 0.3s ease;
        }

        header.scrolled {
            padding: 0.5rem 0;
            box-shadow: 0 5px 25px rgba(5, 217, 232, 0.3);
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 0;
            transition: all 0.3s ease;
        }

        header.scrolled .navbar {
            padding: 0.75rem 0;
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

        .header-actions {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .currency-selector {
            position: relative;
            display: inline-block;
        }

        .currency-toggle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(5, 217, 232, 0.1);
            border: 1px solid var(--neon-blue);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            color: var(--neon-blue);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .currency-toggle:hover {
            background: rgba(5, 217, 232, 0.2);
            box-shadow: 0 0 10px var(--neon-blue);
        }

        .currency-toggle.active {
            background: rgba(5, 217, 232, 0.2);
            border-color: var(--neon-pink);
        }

        .currency-text {
            font-weight: 600;
        }

        .currency-arrow {
            transition: transform 0.3s ease;
            font-size: 0.8rem;
        }

        .currency-toggle.active .currency-arrow {
            transform: rotate(180deg);
        }

        .currency-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--card-bg);
            border: 1px solid var(--neon-blue);
            border-radius: 8px;
            padding: 0.5rem 0;
            min-width: 120px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            display: none;
            margin-top: 0.25rem;
        }

        .currency-menu.active {
            display: block;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .currency-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            color: var(--light-text);
        }

        .currency-item:hover {
            background: rgba(5, 217, 232, 0.1);
            color: var(--neon-pink);
        }

        .currency-code {
            font-weight: 600;
        }

        .currency-symbol {
            font-size: 1.1rem;
            color: var(--neon-green);
        }

        .currency-item:hover .currency-symbol {
            color: var(--neon-pink);
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
        
        /* User Profile & Logout */
        .user-profile {
            display: none;
            align-items: center;
            gap: 1rem;
        }

        .user-profile.active {
            display: flex;
        }

        .user-profile span {
            font-size: 0.9rem;
            color: var(--neon-green);
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-blue));
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            border: 2px solid var(--neon-blue);
            transition: all 0.3s ease;
        }

        .user-avatar:hover {
            border-color: var(--neon-pink);
            box-shadow: 0 0 10px var(--neon-pink);
        }

        .logout-btn {
            background-color: var(--neon-pink);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
        }
        
        .logout-btn:hover {
            background-color: var(--neon-purple);
            transform: translateY(-2px);
        }

        /* Notification Bell */
        .notification-icon {
            position: relative;
            color: var(--neon-blue);
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .notification-icon:hover {
            color: var(--neon-pink);
            transform: scale(1.1);
        }
        
        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--neon-pink);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: var(--neon-blue);
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
            color: var(--neon-pink);
        }

        /* Hero Section */
        .hero {
            padding: 6rem 0 4rem;
            position: relative;
            overflow: hidden;
            min-height: 80vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, rgba(13, 2, 33, 0.9) 0%, rgba(5, 1, 15, 0.9) 100%);
        }

        .hero:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255, 42, 109, 0.1) 0%, transparent 70%);
            z-index: -1;
        }

        .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            font-weight: 700;
            background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            animation: textGlow 3s infinite alternate;
            line-height: 1.2;
        }

        @keyframes textGlow {
            0% { text-shadow: 0 0 10px rgba(255, 42, 109, 0.5); }
            50% { text-shadow: 0 0 20px rgba(5, 217, 232, 0.5); }
            100% { text-shadow: 0 0 20px rgba(0, 255, 157, 0.5); }
        }

        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2.5rem;
            opacity: 0.9;
            line-height: 1.6;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Search Bar */
        .search-container {
            max-width: 800px;
            margin: 0 auto 2rem;
            position: relative;
        }

        .search-bar {
            display: flex;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50px;
            overflow: hidden;
            border: 2px solid var(--neon-blue);
            box-shadow: 0 0 15px rgba(5, 217, 232, 0.3);
        }

        .search-input {
            flex: 1;
            padding: 1.25rem 1.5rem;
            background: transparent;
            border: none;
            font-size: 1.1rem;
            color: white;
            outline: none;
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .search-btn {
            padding: 0 2rem;
            background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.2rem;
        }

        .search-btn:hover {
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-blue));
            box-shadow: 0 0 20px var(--neon-blue);
        }

        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--card-bg);
            border-radius: 0 0 15px 15px;
            box-shadow: var(--glow);
            border: 1px solid var(--neon-blue);
            border-top: none;
            max-height: 300px;
            overflow-y: auto;
            z-index: 10;
            display: none;
        }

        .search-results.active {
            display: block;
        }

        .search-result-item {
            padding: 1rem;
            border-bottom: 1px solid rgba(5, 217, 232, 0.2);
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .search-result-item:hover {
            background: rgba(5, 217, 232, 0.1);
        }

        .search-result-item:last-child {
            border-bottom: none;
        }

        .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .hero-buttons .btn {
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .btn-white {
            background-color: white;
            color: var(--neon-pink);
            font-weight: 700;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .btn-white:hover {
            background-color: #f1f1f1;
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
            transform: translateY(-3px);
        }

        .btn-transparent {
            background-color: transparent;
            color: white;
            border: 2px solid white;
        }

        .btn-transparent:hover {
            background-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            transform: translateY(-3px);
        }

        /* Trusted By Section */
        .trusted-by {
            padding: 3rem 0;
            background-color: var(--section-bg);
            text-align: center;
        }

        .trusted-by p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }

        .trusted-logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3rem;
            flex-wrap: wrap;
        }

        .trusted-logo {
            color: rgba(255, 255, 255, 0.5);
            font-size: 1.8rem;
            font-weight: 700;
            transition: all 0.3s ease;
        }

        .trusted-logo:hover {
            color: var(--neon-blue);
            transform: translateY(-3px);
        }

        /* Popular Services */
        .popular-services {
            padding: 5rem 0;
            position: relative;
        }

        .popular-services:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 70%, rgba(255, 42, 109, 0.1) 0%, transparent 30%);
            z-index: -1;
        }

        .section-title {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title h2 {
            font-size: 2.5rem;
            color: var(--neon-blue);
            margin-bottom: 1rem;
            text-shadow: 0 0 10px var(--neon-blue);
        }

        .section-title p {
            color: rgba(255, 255, 255, 0.7);
            max-width: 700px;
            margin: 0 auto;
            font-size: 1.1rem;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }

        .service-card {
            background-color: var(--card-bg);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid var(--border-color);
            position: relative;
            z-index: 1;
        }

        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--pink-glow);
            border-color: var(--neon-pink);
        }

        .service-card:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 42, 109, 0.1) 0%, transparent 100%);
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .service-card:hover:after {
            opacity: 1;
        }

        .service-image {
            height: 200px;
            background-color: rgba(255, 42, 109, 0.1);
            position: relative;
            overflow: hidden;
        }

        .service-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .service-card:hover .service-image img {
            transform: scale(1.1);
        }

        .service-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background-color: var(--neon-green);
            color: var(--dark-text);
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 600;
            box-shadow: 0 0 10px var(--neon-green);
        }

        .service-info {
            padding: 1.5rem;
        }

        .service-seller {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }

        .seller-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(5, 217, 232, 0.2);
            margin-right: 0.75rem;
            overflow: hidden;
        }

        .seller-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .seller-info h4 {
            font-size: 0.9rem;
            color: var(--neon-blue);
            margin-bottom: 0.25rem;
        }

        .seller-rating {
            color: var(--neon-yellow);
            font-size: 0.8rem;
            display: flex;
            align-items: center;
        }

        .seller-rating i {
            margin-right: 0.25rem;
        }

        .service-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: white;
        }

        .service-description {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .service-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .service-price {
            font-weight: 700;
            font-size: 1.3rem;
            color: var(--neon-green);
            text-shadow: 0 0 5px var(--neon-green);
        }

        .service-btn-small {
            padding: 0.5rem 1.25rem;
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .service-btn-small:hover {
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));
            box-shadow: 0 0 10px var(--neon-pink);
            transform: translateY(-2px);
        }

        /* Popular Categories */
        .categories {
            padding: 5rem 0;
            background-color: var(--section-bg);
            position: relative;
        }

        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }

        .category-card {
            background-color: var(--card-bg);
            border-radius: 15px;
            padding: 2.5rem 2rem;
            text-align: center;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        .category-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--glow);
            border-color: var(--neon-blue);
        }

        .category-card:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
        }

        .category-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            color: var(--neon-blue);
            transition: all 0.3s ease;
        }

        .category-card:hover .category-icon {
            color: var(--neon-pink);
            transform: scale(1.1);
        }

        .category-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--neon-blue);
            transition: all 0.3s ease;
        }

        .category-card:hover .category-title {
            color: var(--neon-pink);
        }

        .category-description {
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
        }

        /* How It Works */
        .how-it-works {
            padding: 5rem 0;
            position: relative;
        }

        .how-it-works:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(211, 0, 197, 0.1) 0%, transparent 40%);
            z-index: -1;
        }

        .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .step-card {
            background-color: var(--card-bg);
            border-radius: 15px;
            padding: 2.5rem 2rem;
            text-align: center;
            border: 1px solid rgba(211, 0, 197, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .step-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--purple-glow);
            border-color: var(--neon-purple);
        }

        .step-card:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--neon-purple), var(--neon-pink));
        }

        .step-number {
            width: 70px;
            height: 70px;
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.8rem;
            font-weight: bold;
            margin: 0 auto 1.5rem;
            box-shadow: 0 0 15px var(--neon-purple);
            transition: all 0.3s ease;
        }

        .step-card:hover .step-number {
            transform: scale(1.1) rotate(10deg);
        }

        .step-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--neon-purple);
        }

        .step-description {
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
        }

        /* Reviews Section */
        .reviews {
            padding: 5rem 0;
            background-color: var(--section-bg);
            position: relative;
        }

        .reviews:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 70% 20%, rgba(0, 255, 157, 0.1) 0%, transparent 30%);
            z-index: -1;
        }

        .reviews-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .review-card {
            background-color: var(--card-bg);
            border-radius: 15px;
            padding: 2rem;
            border: 1px solid rgba(0, 255, 157, 0.3);
            transition: all 0.3s ease;
            position: relative;
        }

        .review-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--green-glow);
            border-color: var(--neon-green);
        }

        .review-card:before {
            content: '\"';
            position: absolute;
            top: 10px;
            left: 15px;
            font-size: 4rem;
            color: var(--neon-green);
            opacity: 0.3;
            font-family: serif;
        }

        .review-content {
            font-style: italic;
            margin-bottom: 1.5rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            position: relative;
            z-index: 1;
        }

        .review-author {
            display: flex;
            align-items: center;
        }

        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 1rem;
            border: 2px solid var(--neon-green);
        }

        .author-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .author-info h4 {
            color: var(--neon-green);
            margin-bottom: 0.25rem;
        }

        .author-info p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
        }

        .review-rating {
            color: var(--neon-yellow);
            margin-top: 0.5rem;
        }

        /* Modals */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        .modal-container {
            background-color: var(--card-bg);
            padding: 2rem;
            border-radius: 15px;
            width: 600px;
            max-width: 90%;
            animation: slideUp 0.4s ease;
            max-height: 90vh;
            overflow-y: auto;
        }

        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
        }

        .modal-header h2 {
            color: var(--neon-green);
            margin-bottom: 0.5rem;
            font-size: 2rem;
            text-shadow: 0 0 10px var(--neon-green);
        }

        .close-modal {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--neon-pink);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px var(--neon-pink);
            transition: all 0.3s ease;
        }

        .close-modal:hover {
            transform: rotate(90deg);
            box-shadow: 0 0 20px var(--neon-pink);
        }

        /* Auth Modal */
        .auth-container {
            width: 400px;
            box-shadow: var(--purple-glow);
            border: 1px solid var(--neon-purple);
        }

        .auth-tabs {
            display: flex;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid rgba(255, 42, 109, 0.3);
        }

        .auth-tab {
            padding: 0.75rem 1.5rem;
            cursor: pointer;
            font-weight: 600;
            color: #777;
            transition: all 0.3s ease;
            position: relative;
        }

        .auth-tab.active {
            color: var(--neon-pink);
        }

        .auth-tab.active:after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--neon-pink);
            box-shadow: 0 0 10px var(--neon-pink);
        }

        .auth-form {
            display: none;
        }

        .auth-form.active {
            display: block;
        }

        /* Explore Modal */
        .explore-container {
            box-shadow: var(--green-glow);
            border: 1px solid var(--neon-green);
        }

        .explore-categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .explore-category-card {
            background-color: rgba(5, 217, 232, 0.1);
            border-radius: 10px;
            padding: 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(5, 217, 232, 0.3);
        }

        .explore-category-card:hover {
            background-color: rgba(5, 217, 232, 0.2);
            transform: translateY(-5px);
            box-shadow: var(--glow);
            border-color: var(--neon-blue);
        }

        .category-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--neon-blue);
        }

        .category-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--neon-green);
        }

        /* Order Modal */
        .order-container {
            box-shadow: var(--pink-glow);
            border: 1px solid var(--neon-pink);
        }

        .order-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 2rem;
        }

        .order-summary {
            background-color: rgba(255, 42, 109, 0.1);
            border-radius: 10px;
            padding: 1.5rem;
            border: 1px solid var(--neon-pink);
        }

        .order-service {
            display: flex;
            margin-bottom: 1.5rem;
        }

        .order-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.1);
            margin-right: 1rem;
            overflow: hidden;
        }

        .order-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .order-details {
            flex: 1;
        }

        .order-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: white;
        }

        .order-seller {
            color: var(--neon-blue);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .order-price {
            font-weight: 700;
            color: var(--neon-green);
        }

        .order-total {
            border-top: 1px solid rgba(255, 42, 109, 0.3);
            padding-top: 1rem;
            margin-top: 1rem;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }

        .total-row:last-child {
            font-weight: 700;
            font-size: 1.2rem;
            color: var(--neon-green);
        }

        /* Contact Support Modal */
        .contact-container {
            box-shadow: var(--blue-glow);
            border: 1px solid var(--neon-blue);
        }

        /* Notification Sidebar */
        .notification-sidebar {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: var(--card-bg);
            box-shadow: -5px 0 15px rgba(0,0,0,0.5);
            z-index: 1500;
            transition: right 0.4s ease;
            padding: 2rem;
            overflow-y: auto;
            border-left: 2px solid var(--neon-blue);
        }

        .notification-sidebar.active {
            right: 0;
        }

        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(5, 217, 232, 0.3);
        }

        .notification-header h3 {
            color: var(--neon-blue);
            font-size: 1.5rem;
        }

        .close-notifications {
            background: none;
            border: none;
            color: var(--neon-pink);
            font-size: 1.5rem;
            cursor: pointer;
        }

        .notification-item {
            padding: 1rem;
            margin-bottom: 1rem;
            background: rgba(5, 217, 232, 0.1);
            border-radius: 8px;
            border-left: 3px solid var(--neon-blue);
        }

        .notification-item.unread {
            border-left-color: var(--neon-pink);
            background: rgba(255, 42, 109, 0.1);
        }

        .notification-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--neon-green);
        }

        .notification-time {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
        }

        /* Add Service Button */
        .add-service-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
            color: white;
            display: none;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            cursor: pointer;
            box-shadow: 0 0 20px var(--neon-pink);
            z-index: 50;
            transition: all 0.3s ease;
            border: none;
            animation: pulse 2s infinite;
        }

        .add-service-btn.active {
            display: flex;
        }

        .add-service-btn:hover {
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 0 30px var(--neon-pink);
        }

        /* Support Button */
        .btn-support {
            background: var(--neon-pink);
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-support:hover {
            background-color: #e02668;
            box-shadow: 0 0 15px var(--neon-pink);
            transform: translateY(-2px);
        }

        /* User Profile Link */
        .user-profile-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            text-decoration: none;
            color: var(--neon-green);
            transition: opacity 0.3s ease;
        }

        .user-profile-link:hover {
            opacity: 0.8;
        }

        /* Footer */
        footer {
            background-color: var(--darker-bg);
            color: white;
            padding: 5rem 0 2rem;
            position: relative;
            border-top: 1px solid rgba(5, 217, 232, 0.3);
        }

        footer:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 0%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);
            z-index: 0;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
            position: relative;
            z-index: 1;
        }

        .footer-col h3 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            position: relative;
            color: var(--neon-blue);
        }

        .footer-col h3:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -8px;
            width: 40px;
            height: 3px;
            background-color: var(--neon-blue);
            box-shadow: 0 0 10px var(--neon-blue);
        }

        .footer-about p {
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
        }

        .footer-links li {
            margin-bottom: 1rem;
            display: block;
            width: 100%;
        }

        .footer-links a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
        }

        .footer-links a i {
            margin-right: 0.5rem;
            color: var(--neon-green);
        }

        .footer-links a:hover {
            color: var(--neon-pink);
            transform: translateX(5px);
        }

        .footer-social {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .footer-social a {
            width: 45px;
            height: 45px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            transition: all 0.3s ease;
            font-size: 1.2rem;
        }

        .footer-social a:hover {
            background-color: var(--neon-pink);
            transform: translateY(-5px);
            box-shadow: 0 0 15px var(--neon-pink);
        }

        .footer-contact p {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.7);
        }

        .footer-contact i {
            margin-right: 0.75rem;
            color: var(--neon-blue);
            font-size: 1.2rem;
        }

        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
            position: relative;
            z-index: 1;
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

        /* Loading Spinner */
        .loading {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Scroll to Top Button */
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 100;
            box-shadow: 0 0 15px var(--neon-blue);
            opacity: 0;
            visibility: hidden;
        }

        .scroll-to-top.active {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 20px var(--neon-blue);
        }

        /* Form Elements */
        .form-group {
            margin-bottom: 1.5rem;
            position: relative;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--neon-blue);
            font-weight: 600;
        }

        .form-group input, 
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background-color: rgba(5, 217, 232, 0.1);
            border: 1px solid var(--neon-blue);
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            color: var(--light-text);
        }

        .form-group input:focus, 
        .form-group select:focus,
        .form-group textarea:focus {
            border-color: var(--neon-pink);
            outline: none;
            box-shadow: 0 0 10px var(--neon-pink);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .form-group select {
            color: var(--light-text);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background: rgba(5, 217, 232, 0.1) url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2305d9e8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-chevron-down\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>') no-repeat right 1rem center;
            background-size: 1rem;
        }

        .form-group textarea {
            min-height: 120px;
            resize: vertical;
        }

        .error-message {
            color: var(--neon-pink);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: none;
        }

        .form-group.error .error-message {
            display: block;
        }

        .auth-btn {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1rem;
        }

        .auth-btn:hover {
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));
            box-shadow: 0 0 15px var(--neon-pink);
        }

        .auth-footer {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: var(--neon-blue);
        }

        .auth-footer a {
            color: var(--neon-pink);
            text-decoration: none;
            font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .hero h1 {
                font-size: 3rem;
            }
            
            .order-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 992px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .services-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }
        }

        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }
            
            .container {
                padding: 0 1.5rem;
            }
            
            .mobile-menu-btn {
                display: block;
            }
            
            .nav-links {
                display: none;
                flex-direction: column;
                width: 100%;
                background: var(--darker-bg);
                position: absolute;
                top: 100%;
                left: 0;
                padding: 1rem;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                border-top: 1px solid var(--neon-blue);
            }
            
            .nav-links.active {
                display: flex;
            }
            
            .nav-links a {
                padding: 0.75rem 0;
                border-bottom: 1px solid rgba(5, 217, 232, 0.2);
            }
            
            .nav-links a:last-child {
                border-bottom: none;
            }
            
            .user-profile {
                width: 100%;
                justify-content: center;
            }
            
            .auth-buttons {
                justify-content: center;
            }
            
            .hero-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                gap: 2rem;
                text-align: left;
            }
            
            .footer-section {
                text-align: left;
            }
            
            .notification-sidebar {
                width: 100%;
                right: -100%;
            }
            
            .trusted-logos {
                gap: 2rem;
            }
            
            .trusted-logo {
                font-size: 1.5rem;
            }
        }

        @media (max-width: 576px) {
            .hero h1 {
                font-size: 1.8rem;
            }
            
            .hero p {
                font-size: 1rem;
            }
            
            .container {
                padding: 0 1rem;
            }
            
            .section-title h2 {
                font-size: 2rem;
            }
            
            .trusted-logos {
                gap: 1.5rem;
            }
            
            .trusted-logo {
                font-size: 1.3rem;
            }
        }
    ` }} />
        
        {/* Auth Modal */}
        <div className="modal" id="authModal">
          <div className="modal-container auth-container">
            <div className="modal-header">
              <h2>Welcome to NeonGigs</h2>
              <p>Buy or sell digital services in our marketplace</p>
              <button className="close-modal" id="closeAuthModal">×</button>
            </div>
            <div className="auth-tabs">
              <div className="auth-tab active" data-tab="login">Login</div>
              <div className="auth-tab" data-tab="register">Register</div>
            </div>
            <form className="auth-form active" id="loginForm">
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input type="email" id="loginEmail" placeholder="Enter your email" required />
                <div className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input type="password" id="loginPassword" placeholder="Enter your password" required />
                <div className="error-message" />
              </div>
              <button type="submit" className="auth-btn">Login</button>
              <div className="auth-footer">
                <p>Don't have an account? <a href="#" id="showRegister">Register here</a></p>
              </div>
            </form>
            <form className="auth-form" id="registerForm">
              <div className="form-group">
                <label htmlFor="registerName">Full Name</label>
                <input type="text" id="registerName" placeholder="Enter your full name" required />
                <div className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="registerEmail">Email</label>
                <input type="email" id="registerEmail" placeholder="Enter your email" required />
                <div className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="registerPassword">Password</label>
                <input type="password" id="registerPassword" placeholder="Create a password" required />
                <div className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="registerRole">I want to</label>
                <select id="registerRole" required>
                  <option value>Select role</option>
                  <option value="buyer">Buy services</option>
                  <option value="freelancer">Sell services</option>
                </select>
                <div className="error-message" />
              </div>
              <button type="submit" className="auth-btn">Register</button>
              <div className="auth-footer">
                <p>Already have an account? <a href="#" id="showLogin">Login here</a></p>
              </div>
            </form>
          </div>
        </div>

        {/* Explore Modal */}
        <div className="modal" id="exploreModal">
          <div className="modal-container explore-container">
            <div className="modal-header">
              <h2>Spotlight</h2>
              <button className="close-modal" id="closeExploreModal">×</button>
            </div>
            
            {/* Search Bar */}
            <div className="search-container">
                <div className="search-bar">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="🔍 AI-Powered Search - Try: 'website', 'logo', 'AI assistant'..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    />
                    <button className="search-btn" onClick={handleSearchSubmit}>
                        {isSearching ? (
                            <div className="loading" style={{width: '20px', height: '20px'}}></div>
                        ) : (
                            <i className="fas fa-search" />
                        )}
                    </button>
                </div>
                
                {/* AI-Powered Search Results */}
                {showResults && (
                    <div className="search-results" id="searchResults">
                        {isSearching ? (
                            <div className="search-result-item" style={{textAlign: 'center', color: 'var(--neon-blue)'}}>
                                <i className="fas fa-robot fa-spin" style={{marginRight: '0.5rem'}}></i>
                                AI is searching our database...
                            </div>
                        ) : searchResults.length > 0 ? (
                            <>
                                <div className="search-result-item" style={{
                                    background: 'rgba(5, 217, 232, 0.1)',
                                    color: 'var(--neon-blue)',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <i className="fas fa-robot" style={{marginRight: '0.5rem'}}></i>
                                    AI-Powered Results ({searchResults.length} found)
                                </div>
                                {searchResults.map((result) => (
                                    <div 
                                        key={`${result.type}-${result.id}`} 
                                        className="search-result-item"
                                        onClick={() => handleResultClick(result)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                            <i className={result.icon} style={{
                                                color: result.type === 'service' ? 'var(--neon-pink)' : 'var(--neon-green)',
                                                width: '20px',
                                                fontSize: '1.1rem'
                                            }}></i>
                                            <div style={{flex: 1}}>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: result.type === 'service' ? 'var(--neon-pink)' : 'var(--neon-green)',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {result.title}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: 'rgba(255,255,255,0.7)',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {result.description}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    color: 'var(--neon-blue)'
                                                }}>
                                                    {result.category} • {result.type === 'service' ? `From $${result.price}` : `Rating: ${result.rating}/5`}
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                padding: '0.25rem 0.5rem',
                                                background: result.type === 'service' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(0, 255, 157, 0.2)',
                                                borderRadius: '4px',
                                                color: result.type === 'service' ? 'var(--neon-pink)' : 'var(--neon-green)'
                                            }}>
                                                {result.type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : searchQuery.trim() ? (
                            <div className="search-result-item" style={{textAlign: 'center', color: 'rgba(255,255,255,0.7)'}}>
                                <i className="fas fa-search" style={{marginRight: '0.5rem'}}></i>
                                No results found for "{searchQuery}"
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <h3 style={{color: 'var(--neon-blue)', marginBottom: '1.5rem', textAlign: 'center'}}>Browse Categories</h3>
            <div className="explore-categories-grid">
              <div className="explore-category-card" data-category="graphics-design">
                <div className="category-icon">
                  <i className="fas fa-paint-brush" />
                </div>
                <h4 className="category-title">Graphics &amp; Design</h4>
              </div>
              <div className="explore-category-card" data-category="programming-tech">
                <div className="category-icon">
                  <i className="fas fa-code" />
                </div>
                <h4 className="category-title">Programming &amp; Tech</h4>
              </div>
              <div className="explore-category-card" data-category="writing-translation">
                <div className="category-icon">
                  <i className="fas fa-pen-fancy" />
                </div>
                <h4 className="category-title">Writing &amp; Translation</h4>
              </div>
              <div className="explore-category-card" data-category="video-animation">
                <div className="category-icon">
                  <i className="fas fa-video" />
                </div>
                <h4 className="category-title">Video &amp; Animation</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Order Modal */}
        <div className="modal" id="orderModal">
          <div className="modal-container order-container">
            <div className="modal-header">
              <h2>Place Your Order</h2>
              <button className="close-modal" id="closeOrderModal">×</button>
            </div>
            <div className="order-grid">
              <div className="order-summary">
                <div className="order-service">
                  <div className="order-image">
                    <img src="" alt="Service" id="orderServiceImage" />
                  </div>
                  <div className="order-details">
                    <h3 className="order-title" id="orderServiceTitle" />
                    <p className="order-seller" id="orderServiceSeller" />
                    <p className="order-price" id="orderServicePrice" />
                  </div>
                </div>
                <div className="order-total">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span id="orderSubtotal" data-price="0">$0</span>
                  </div>
                  <div className="total-row">
                    <span>Service Fee</span>
                    <span data-price="3">$3</span>
                  </div>
                  <div className="total-row">
                    <span>Total</span>
                    <span id="orderTotal" data-price="0">$0</span>
                  </div>
                </div>
              </div>
              <div className="order-form">
                <div className="form-group">
                  <label htmlFor="orderInstructions">Instructions</label>
                  <textarea id="orderInstructions" placeholder="Provide specific details about what you need..." defaultValue={""} />
                  <div className="error-message" />
                </div>
                <button className="btn btn-primary" id="confirmOrder">Pay Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Modal */}
        <div className="modal" id="contactModal">
          <div className="modal-container contact-container">
            <div className="modal-header">
              <h2>Contact Support</h2>
              <button className="close-modal" id="closeContactModal">×</button>
            </div>
            <div className="form-group">
              <label htmlFor="contactName">Your Name</label>
              <input type="text" id="contactName" placeholder="Enter your name" />
              <div className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">Email</label>
              <input type="email" id="contactEmail" placeholder="Enter your email" />
              <div className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="contactSubject">Subject</label>
              <input type="text" id="contactSubject" placeholder="What is this regarding?" />
              <div className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="contactMessage">Message</label>
              <textarea id="contactMessage" placeholder="Describe your issue or question..." defaultValue={""} />
              <div className="error-message" />
            </div>
            <Link to="/ContactSupport" className="btn btn-primary" style={{display: 'block', textAlign: 'center', textDecoration: 'none'}}>Send Message</Link>
          </div>
        </div>

        {/* User Profile Modal */}
        <div className="modal" id="profileModal">
          <div className="modal-container">
            <div className="modal-header">
              <h2>User Profile</h2>
              <button className="close-modal" id="closeProfileModal">×</button>
            </div>
            <div className="profile-content">
              <div className="profile-header" style={{display: 'flex', alignItems: 'center', marginBottom: '2rem'}}>
                <div className="user-avatar" id="profileAvatar" style={{width: '80px', height: '80px', fontSize: '2rem', marginRight: '1.5rem'}} />
                <div>
                  <h3 style={{color: 'var(--neon-green)', marginBottom: '0.5rem'}} id="profileName">User Name</h3>
                  <p style={{color: 'var(--neon-blue)'}} id="profileRole">Member</p>
                </div>
              </div>
              <div className="profile-stats" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
                <div style={{textAlign: 'center', padding: '1rem', background: 'rgba(5, 217, 232, 0.1)', borderRadius: '10px'}}>
                  <h4 style={{color: 'var(--neon-green)'}}>12</h4>
                  <p>Orders</p>
                </div>
                <div style={{textAlign: 'center', padding: '1rem', background: 'rgba(5, 217, 232, 0.1)', borderRadius: '10px'}}>
                  <h4 style={{color: 'var(--neon-green)'}}>8</h4>
                  <p>Services</p>
                </div>
                <div style={{textAlign: 'center', padding: '1rem', background: 'rgba(5, 217, 232, 0.1)', borderRadius: '10px'}}>
                  <h4 style={{color: 'var(--neon-green)'}}>4.9</h4>
                  <p>Rating</p>
                </div>
              </div>
              <div className="profile-actions" style={{display: 'flex', gap: '1rem'}}>
                <Link to="/UserProfile" className="btn btn-primary">Edit Profile</Link>
                <button className="btn btn-outline">Settings</button>
              </div>
            </div>
          </div>
        </div>

        {/* Become Seller Modal */}
        <div className="modal" id="sellerModal">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Become a Seller</h2>
              <button className="close-modal" id="closeSellerModal">×</button>
            </div>
            <p style={{textAlign: 'center', marginBottom: '2rem', color: 'rgba(255,255,255,0.7)'}}>Join our community of talented freelancers and start earning today!</p>
            <div className="form-group">
              <label htmlFor="sellerSkills">Your Skills</label>
              <input type="text" id="sellerSkills" placeholder="e.g. Graphic Design, Web Development" />
              <div className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="sellerExperience">Experience Level</label>
              <select id="sellerExperience">
                <option value>Select your experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
              <div className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="sellerPortfolio">Portfolio Link (Optional)</label>
              <input type="url" id="sellerPortfolio" placeholder="https://yourportfolio.com" />
              <div className="error-message" />
            </div>
            <Link to="/BecomeSeller" className="btn btn-primary" style={{display: 'block', textAlign: 'center', textDecoration: 'none'}}>Apply Now</Link>
          </div>
        </div>

        {/* Notification Sidebar */}
        <div className="notification-sidebar" id="notificationSidebar">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button className="close-notifications" id="closeNotifications">×</button>
          </div>
          <div className="notification-list" id="notificationList">
            {/* Notifications will be added dynamically */}
          </div>
        </div>

        {/* Header */}
        <header id="mainHeader">
          <div className="container">
            <div className="navbar">
              <a href="#" className="logo">
                <i className="fas fa-bolt" />
                NeonGigs
              </a>
              <div className="nav-links">
                <a href="#" className="active">Home</a>
                <Link to="/Explore" id="exploreLink">Explore</Link>
                <Link to="/Categories">Categories</Link>
              </div>
              <div className="header-actions">
                <div className="currency-selector">
                    <button className={`currency-toggle ${isCurrencyOpen ? 'active' : ''}`} onClick={handleCurrencyToggle}>
                        <span className="currency-text">{currentCurrency}</span>
                        <i className={`fas fa-chevron-down currency-arrow ${isCurrencyOpen ? 'active' : ''}`}></i>
                    </button>
                    <div className={`currency-menu ${isCurrencyOpen ? 'active' : ''}`}>
                        <div className="currency-item" onClick={() => handleCurrencySelect('USD')}>
                            <span className="currency-code">USD</span>
                            <span className="currency-symbol">$</span>
                        </div>
                        <div className="currency-item" onClick={() => handleCurrencySelect('INR')}>
                            <span className="currency-code">INR</span>
                            <span className="currency-symbol">₹</span>
                        </div>
                    </div>
                </div>
                <div className="notification-icon" id="notificationIcon">
                  <i className="fas fa-bell" />
                  <span className="notification-badge" id="notificationBadge">3</span>
                </div>
                <button className="mobile-menu-btn" id="mobileMenuBtn">
                  <i className="fas fa-bars" />
                </button>
                <div className="auth-buttons" id="authButtons" style={{display: isLoggedIn ? 'none' : 'flex'}}>
                  <Link to="/signin" className="btn btn-outline">Login</Link>
                  <Link to="/login" className="btn btn-primary">Join Now</Link>
                  <Link to="/ContactSupport" className="btn-support">Contact Support</Link>
                </div>
                <div className="user-profile" id="userProfile" style={{display: isLoggedIn ? 'flex' : 'none'}}>
                    <Link to="/user-profile" className="user-profile-link" id="userProfileLink">
                        <div className="user-avatar" id="userAvatar" style={{
                            background: `linear-gradient(45deg, var(--neon-pink), var(--neon-blue))`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            {userData ? userData.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span id="userName">{userData ? userData.name : 'User Name'}</span>
                    </Link>
                    
                    {(userData?.email === 'admin@neongigs.com' || userData?.isAdmin) && (
                        <Link to="/admin" className="btn btn-primary" style={{
                            padding: '0.5rem 1rem',
                            marginLeft: '1rem',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            background: 'linear-gradient(45deg, var(--neon-green), var(--neon-blue))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}>
                            <i className="fas fa-cog" style={{marginRight: '0.5rem'}}></i> Admin
                        </Link>
                    )}
                    
                    <button className="logout-btn" id="logoutBtn" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="animate__animated animate__fadeInDown">Find The Perfect <span style={{display: 'block'}}>Digital Service</span></h1>
              <p className="animate__animated animate__fadeIn animate__delay-1s">From logo design to website development, connect with talented freelancers ready to bring your ideas to life.</p>
              
              {/* Search Bar */}
              <div className="search-container">
                <div className="search-bar">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="🔍 AI-Powered Search - Try: 'website', 'logo', 'AI assistant'..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    />
                    <button className="search-btn" onClick={handleSearchSubmit}>
                        {isSearching ? (
                            <div className="loading" style={{width: '20px', height: '20px'}}></div>
                        ) : (
                            <i className="fas fa-search" />
                        )}
                    </button>
                </div>
                
                {/* AI-Powered Search Results */}
                {showResults && (
                    <div className="search-results" id="searchResults">
                        {isSearching ? (
                            <div className="search-result-item" style={{textAlign: 'center', color: 'var(--neon-blue)'}}>
                                <i className="fas fa-robot fa-spin" style={{marginRight: '0.5rem'}}></i>
                                AI is searching our database...
                            </div>
                        ) : searchResults.length > 0 ? (
                            <>
                                <div className="search-result-item" style={{
                                    background: 'rgba(5, 217, 232, 0.1)',
                                    color: 'var(--neon-blue)',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <i className="fas fa-robot" style={{marginRight: '0.5rem'}}></i>
                                    AI-Powered Results ({searchResults.length} found)
                                </div>
                                {searchResults.map((result) => (
                                    <div 
                                        key={`${result.type}-${result.id}`} 
                                        className="search-result-item"
                                        onClick={() => handleResultClick(result)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                            <i className={result.icon} style={{
                                                color: result.type === 'service' ? 'var(--neon-pink)' : 'var(--neon-green)',
                                                width: '20px',
                                                fontSize: '1.1rem'
                                            }}></i>
                                            <div style={{flex: 1}}>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: result.type === 'service' ? 'var(--neon-pink)' : 'var(--neon-green)',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {result.title}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: 'rgba(255,255,255,0.7)',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {result.description}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    color: 'var(--neon-blue)'
                                                }}>
                                                    {result.category} • {result.type === 'service' ? `From $${result.price}` : `Rating: ${result.rating}/5`}
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                padding: '0.25rem 0.5rem',
                                                background: result.type === 'service' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(0, 255, 157, 0.2)',
                                                borderRadius: '4px',
                                                color: result.type === 'service' ? 'var(--neon-pink)' : 'var(--neon-green)'
                                            }}>
                                                {result.type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : searchQuery.trim() ? (
                            <div className="search-result-item" style={{textAlign: 'center', color: 'rgba(255,255,255,0.7)'}}>
                                <i className="fas fa-search" style={{marginRight: '0.5rem'}}></i>
                                No results found for "{searchQuery}"
                            </div>
                        ) : null}
                    </div>
                )}
              </div>

              <div className="hero-buttons animate__animated animate__fadeInUp animate__delay-2s">
                <Link to="/Explore" className="btn btn-white" id="exploreBtn">
                    Spotlight
                </Link>
                <Link to="/login?type=freelancer" className="btn btn-transparent" id="becomeSellerBtn">Become a Seller</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="trusted-by">
          <div className="container">
            <p>Trusted by the world's leading brands and startups</p>
            <div className="trusted-logos">
              <div className="trusted-logo">Google</div>
              <div className="trusted-logo">Microsoft</div>
              <div className="trusted-logo">Netflix</div>
              <div className="trusted-logo">Facebook</div>
              <div className="trusted-logo">Amazon</div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="how-it-works">
          <div className="container">
            <div className="section-title">
              <h2>How It Works</h2>
              <p>Get your project done in just a few simple steps</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Find a Service</h3>
                <p className="step-description">Browse through thousands of services or use our AI assistant to find exactly what you need for your project.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">Place Your Order</h3>
                <p className="step-description">Select the service that fits your needs, provide requirements, and place your order securely.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Get Your Delivery</h3>
                <p className="step-description">Receive your completed work on time. Review it and request revisions if needed until you're satisfied.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="categories">
          <div className="container">
            <div className="section-title">
              <h2>Popular Categories</h2>
              <p>Explore our most in-demand service categories</p>
            </div>
            <div className="categories-grid">
              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-paint-brush" />
                </div>
                <h3 className="category-title">Graphics &amp; Design</h3>
                <p className="category-description">Logo design, branding, illustrations, and more creative services.</p>
              </div>
              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-code" />
                </div>
                <h3 className="category-title">Programming &amp; Tech</h3>
                <p className="category-description">Web development, app creation, software solutions, and tech support.</p>
              </div>
              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-pen-fancy" />
                </div>
                <h3 className="category-title">Writing &amp; Translation</h3>
                <p className="category-description">Content writing, translation, proofreading, and editing services.</p>
              </div>
              <div className="category-card">
                <div className="category-icon">
                  <i className="fas fa-video" />
                </div>
                <h3 className="category-title">Video &amp; Animation</h3>
                <p className="category-description">Video editing, animation, motion graphics, and visual effects.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="reviews">
          <div className="container">
            <div className="section-title">
              <h2>Customer Reviews</h2>
              <p>See what our clients say about their experience</p>
            </div>
            <div className="reviews-grid">
              <div className="review-card">
                <p className="review-content">"The logo design service exceeded my expectations. The designer was professional and delivered exactly what I envisioned for my brand."</p>
                <div className="review-author">
                  <div className="author-avatar">
                    <img src="https://randomuser.me/api/portraits/women/26.jpg" alt="Emily Rodriguez" />
                  </div>
                  <div className="author-info">
                    <h4>Emily Rodriguez</h4>
                    <p>CEO, TechStart Inc.</p>
                    <div className="review-rating">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <p className="review-content">"I needed a website for my new business and found the perfect developer here. The process was smooth and the result was fantastic!"</p>
                <div className="review-author">
                  <div className="author-avatar">
                    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="David Kim" />
                  </div>
                  <div className="author-info">
                    <h4>David Kim</h4>
                    <p>Founder, UrbanBites</p>
                    <div className="review-rating">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <p className="review-content">"The social media marketing campaign increased our engagement by 300% in just one month. Highly recommend this service!"</p>
                <div className="review-author">
                  <div className="author-avatar">
                    <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="Sophia Martinez" />
                  </div>
                  <div className="author-info">
                    <h4>Sophia Martinez</h4>
                    <p>Marketing Director, StyleCo</p>
                    <div className="review-rating">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add Service Button */}
        <button className="add-service-btn" id="addServiceBtn">
          <i className="fas fa-plus" />
        </button>

        {/* Scroll to Top Button */}
        <div className="scroll-to-top" id="scrollToTop">
          <i className="fas fa-arrow-up" />
        </div>

        <div id="statusMessage" />

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
}