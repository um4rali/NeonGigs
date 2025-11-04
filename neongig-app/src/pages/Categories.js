import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const allGigs = [
                {
                    id: 1,
                    title: 'Professional Logo Design',
                    description: 'I will design a professional and unique logo for your brand that stands out from the competition.',
                    price: 50,
                    category: 'graphics-design',
                    seller: {
                        name: 'Alex Johnson',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        rating: 4.9
                    },
                    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'Featured',
                    filter: 'featured'
                },
                {
                    id: 2,
                    title: 'Social Media Marketing Strategy',
                    description: 'I will create a comprehensive social media marketing strategy to grow your brand presence online.',
                    price: 120,
                    category: 'digital-marketing',
                    seller: {
                        name: 'Sarah Miller',
                        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                        rating: 4.8
                    },
                    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'Popular',
                    filter: 'popular'
                },
                {
                    id: 3,
                    title: 'Website Development',
                    description: 'I will develop a responsive and modern website for your business using the latest technologies.',
                    price: 300,
                    category: 'programming-tech',
                    seller: {
                        name: 'Michael Chen',
                        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                        rating: 5.0
                    },
                    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'New',
                    filter: 'new'
                },
                {
                    id: 4,
                    title: 'Video Editing for YouTube',
                    description: 'I will edit your YouTube videos with professional transitions, effects, and sound design.',
                    price: 75,
                    category: 'video-animation',
                    seller: {
                        name: 'Emma Wilson',
                        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
                        rating: 4.7
                    },
                    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'Popular',
                    filter: 'popular'
                },
                {
                    id: 5,
                    title: 'Business Plan Writing',
                    description: 'I will write a comprehensive business plan that will help you secure funding and guide your business growth.',
                    price: 150,
                    category: 'business',
                    seller: {
                        name: 'David Brown',
                        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
                        rating: 4.9
                    },
                    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'Featured',
                    filter: 'featured'
                },
                {
                    id: 6,
                    title: 'Voice Over Recording',
                    description: 'Professional voice over recording for commercials, videos, audiobooks, and more with quick turnaround.',
                    price: 60,
                    category: 'music-audio',
                    seller: {
                        name: 'James Taylor',
                        avatar: 'https://randomuser.me/api/portraits/men/66.jpg',
                        rating: 4.8
                    },
                    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'New',
                    filter: 'new'
                }
            ];


const categories = [
                {
                    id: 'graphics-design',
                    name: 'Graphics & Design',
                    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 1245,
                    description: 'Logo design, branding, illustrations, and more'
                },
                {
                    id: 'digital-marketing',
                    name: 'Digital Marketing',
                    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 876,
                    description: 'SEO, social media marketing, content strategy'
                },
                {
                    id: 'writing-translation',
                    name: 'Writing & Translation',
                    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 932,
                    description: 'Content writing, translation, copywriting'
                },
                {
                    id: 'video-animation',
                    name: 'Video & Animation',
                    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 654,
                    description: 'Video editing, animation, motion graphics'
                },
                {
                    id: 'music-audio',
                    name: 'Music & Audio',
                    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 421,
                    description: 'Music production, voice over, sound design'
                },
                {
                    id: 'programming-tech',
                    name: 'Programming & Tech',
                    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 1567,
                    description: 'Web development, app development, software'
                },
                {
                    id: 'business',
                    name: 'Business',
                    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 789,
                    description: 'Business consulting, virtual assistant, market research'
                },
                {
                    id: 'lifestyle',
                    name: 'Lifestyle',
                    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    count: 543,
                    description: 'Life coaching, fitness training, nutrition'
                }
            ];

export default function Categories() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    //categories

    const selectCategory = (id, name) => {
      setSelectedCategory(id); 
      console.log(`Selected category: ${name} (${id})`);
      // You can add navigation or filter logic here
    };


    //services
    const [currentCategory, setCurrentCategory] = useState('all');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [dynamicServices, setDynamicServices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch services from API ONLY when filter is "new"
    useEffect(() => {
        if (currentFilter === 'new') {
            fetchNewServices();
        }
    }, [currentFilter, currentCategory]);

    const fetchNewServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/services`, {
                params: {
                    filter: 'new',
                    category: currentCategory,
                    limit: 6
                }
            });

            if (response.data.success && response.data.services.length > 0) {
                // Map API data to match component structure
                const mappedServices = response.data.services.map(service => ({
                    id: service._id,
                    title: service.title,
                    description: service.description || service.shortDescription,
                    price: service.price,
                    category: service.category,
                    image: service.images && service.images[0] ? service.images[0] : 'https://via.placeholder.com/400x300',
                    badge: 'New',
                    filter: 'new',
                    seller: {
                        name: service.freelancerName || 'Freelancer',
                        rating: service.rating || 0,
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
                    }
                }));
                setDynamicServices(mappedServices);
            } else {
                // No dynamic data for "new" services
                setDynamicServices([]);
            }
        } catch (error) {
            console.error('Error fetching new services:', error);
            setDynamicServices([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter gigs based on category and filter
    // ONLY use dynamic data when filter is "new", otherwise use static allGigs
    const filteredGigs = currentFilter === 'new' && dynamicServices.length > 0
        ? dynamicServices
        : allGigs
            .filter(gig => currentCategory === 'all' || gig.category === currentCategory)
            .filter(gig => currentFilter === 'all' || gig.filter === currentFilter);

    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
    };

    const orderGig = (id) => {
      navigate(`/gig/${id}`);
    };

    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Categories - NeonGigs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@300;400;600;700&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <style dangerouslySetInnerHTML={{__html: "\n        :root {\n            --neon-pink: #ff2a6d;\n            --neon-blue: #05d9e8;\n            --neon-purple: #d300c5;\n            --neon-green: #00ff9d;\n            --neon-yellow: #fff700;\n            --dark-bg: #0d0221;\n            --darker-bg: #05010f;\n            --light-text: #f5f6fa;\n            --dark-text: #2d3436;\n            --card-bg: rgba(13, 2, 33, 0.7);\n            --glow: 0 0 10px rgba(5, 217, 232, 0.7);\n            --pink-glow: 0 0 15px rgba(255, 42, 109, 0.7);\n            --green-glow: 0 0 15px rgba(0, 255, 157, 0.7);\n            --purple-glow: 0 0 15px rgba(211, 0, 197, 0.7);\n            --yellow-glow: 0 0 15px rgba(255, 247, 0, 0.7);\n        }\n\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: 'Rajdhani', 'Poppins', sans-serif;\n        }\n\n        body {\n            background-color: var(--dark-bg);\n            color: var(--light-text);\n            min-height: 100vh;\n            overflow-x: hidden;\n            background-image: \n                radial-gradient(circle at 10% 20%, rgba(255, 42, 109, 0.1) 0%, transparent 20%),\n                radial-gradient(circle at 90% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 25%),\n                radial-gradient(circle at 50% 80%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);\n        }\n\n        /* Loading Spinner */\n        .loading {\n            border: 4px solid rgba(255, 255, 255, 0.3);\n            border-top: 4px solid white;\n            border-radius: 50%;\n            width: 24px;\n            height: 24px;\n            animation: spin 1s linear infinite;\n            margin: 0 auto;\n        }\n\n        @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n        }\n\n        /* Main Layout */\n        .container {\n            max-width: 1400px;\n            margin: 0 auto;\n            padding: 0 2rem;\n        }\n\n        /* Header */\n        header {\n            background-color: rgba(13, 2, 33, 0.9);\n            box-shadow: 0 2px 20px rgba(5, 217, 232, 0.2);\n            position: sticky;\n            top: 0;\n            z-index: 100;\n            backdrop-filter: blur(10px);\n            border-bottom: 1px solid var(--neon-blue);\n        }\n\n        .navbar {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            padding: 1.5rem 0;\n        }\n\n        .logo {\n            font-size: 2rem;\n            font-weight: 700;\n            color: var(--neon-blue);\n            text-decoration: none;\n            display: flex;\n            align-items: center;\n            font-family: 'Montserrat', sans-serif;\n            text-shadow: 0 0 10px var(--neon-blue);\n            animation: logoGlow 2s infinite alternate;\n        }\n\n        @keyframes logoGlow {\n            0% { text-shadow: 0 0 10px var(--neon-blue); }\n            100% { text-shadow: 0 0 20px var(--neon-blue), 0 0 30px rgba(5, 217, 232, 0.5); }\n        }\n\n        .logo i {\n            margin-right: 0.5rem;\n            color: var(--neon-pink);\n        }\n\n        .nav-links {\n            display: flex;\n            align-items: center;\n            gap: 2rem;\n        }\n\n        .nav-links a {\n            text-decoration: none;\n            color: var(--light-text);\n            font-weight: 500;\n            transition: all 0.3s ease;\n            position: relative;\n            font-size: 1.1rem;\n        }\n\n        .nav-links a:hover {\n            color: var(--neon-pink);\n        }\n\n        .nav-links a:after {\n            content: '';\n            position: absolute;\n            bottom: -5px;\n            left: 0;\n            width: 0;\n            height: 2px;\n            background-color: var(--neon-pink);\n            transition: width 0.3s ease;\n        }\n\n        .nav-links a:hover:after {\n            width: 100%;\n        }\n\n        .nav-links a.active {\n            color: var(--neon-blue);\n        }\n\n        .auth-buttons {\n            display: flex;\n            gap: 1rem;\n        }\n\n        .btn {\n            padding: 0.75rem 1.5rem;\n            border-radius: 8px;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.3s ease;\n            text-transform: uppercase;\n            letter-spacing: 1px;\n            font-size: 0.9rem;\n        }\n\n        .btn-primary {\n            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));\n            color: white;\n            border: none;\n        }\n\n        .btn-primary:hover {\n            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));\n            box-shadow: 0 0 15px var(--neon-pink);\n            transform: translateY(-2px);\n        }\n\n        .btn-outline {\n            background-color: transparent;\n            color: var(--neon-blue);\n            border: 2px solid var(--neon-blue);\n        }\n\n        .btn-outline:hover {\n            background-color: rgba(5, 217, 232, 0.1);\n            box-shadow: 0 0 15px var(--neon-blue);\n            transform: translateY(-2px);\n        }\n        \n        /* User Profile & Logout */\n        .user-profile {\n            display: none;\n            align-items: center;\n            gap: 1rem;\n        }\n\n        .user-profile.active {\n            display: flex;\n        }\n\n        .user-profile span {\n            font-size: 0.9rem;\n            color: var(--neon-green);\n        }\n        \n        .user-profile img {\n            width: 40px;\n            height: 40px;\n            border-radius: 50%;\n            object-fit: cover;\n            border: 2px solid var(--neon-blue);\n        }\n\n        .logout-btn {\n            background-color: var(--neon-pink);\n            color: white;\n            padding: 0.5rem 1rem;\n            border-radius: 8px;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.3s ease;\n        }\n        \n        .logout-btn:hover {\n            background-color: var(--neon-purple);\n        }\n\n        /* Notification Bell */\n        .notification-icon {\n            position: relative;\n            color: var(--neon-blue);\n            font-size: 1.5rem;\n            cursor: pointer;\n        }\n        \n        .notification-badge {\n            position: absolute;\n            top: -5px;\n            right: -5px;\n            background: var(--neon-pink);\n            color: white;\n            border-radius: 50%;\n            width: 20px;\n            height: 20px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 0.7rem;\n            font-weight: bold;\n        }\n\n        /* Mobile Menu Button */\n        .mobile-menu-btn {\n            display: none;\n            background: none;\n            border: none;\n            color: var(--neon-blue);\n            font-size: 1.5rem;\n            cursor: pointer;\n        }\n\n        /* Hero Section */\n        .hero {\n            padding: 8rem 0 6rem;\n            text-align: center;\n            position: relative;\n            overflow: hidden;\n        }\n\n        .hero:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at center, rgba(255, 42, 109, 0.1) 0%, transparent 70%);\n            z-index: -1;\n        }\n\n        .hero h1 {\n            font-size: 3.5rem;\n            margin-bottom: 1.5rem;\n            font-weight: 700;\n            background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));\n            -webkit-background-clip: text;\n            background-clip: text;\n            color: transparent;\n            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);\n            animation: textGlow 3s infinite alternate;\n        }\n\n        @keyframes textGlow {\n            0% { text-shadow: 0 0 10px rgba(255, 42, 109, 0.5); }\n            50% { text-shadow: 0 0 20px rgba(5, 217, 232, 0.5); }\n            100% { text-shadow: 0 0 20px rgba(0, 255, 157, 0.5); }\n        }\n\n        .hero p {\n            font-size: 1.3rem;\n            max-width: 800px;\n            margin: 0 auto 3rem;\n            opacity: 0.9;\n            line-height: 1.6;\n        }\n\n        /* Categories Section */\n        .categories {\n            padding: 5rem 0;\n            position: relative;\n        }\n\n        .categories:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 80% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 30%);\n            z-index: -1;\n        }\n\n        .section-title {\n            text-align: center;\n            margin-bottom: 4rem;\n        }\n\n        .section-title h2 {\n            font-size: 2.5rem;\n            color: var(--neon-blue);\n            margin-bottom: 1rem;\n            text-shadow: 0 0 10px var(--neon-blue);\n        }\n\n        .section-title p {\n            color: rgba(255, 255, 255, 0.7);\n            max-width: 700px;\n            margin: 0 auto;\n            font-size: 1.1rem;\n        }\n\n        .categories-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n            gap: 2rem;\n            margin-bottom: 3rem;\n        }\n\n        .category-card {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            overflow: hidden;\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n            transition: all 0.3s ease;\n            border: 1px solid rgba(5, 217, 232, 0.3);\n            position: relative;\n            z-index: 1;\n            cursor: pointer;\n        }\n\n        .category-card:hover {\n            transform: translateY(-10px);\n            box-shadow: var(--glow);\n            border-color: var(--neon-blue);\n        }\n\n        .category-card:after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: linear-gradient(135deg, rgba(5, 217, 232, 0.1) 0%, transparent 100%);\n            z-index: -1;\n            opacity: 0;\n            transition: opacity 0.3s ease;\n        }\n\n        .category-card:hover:after {\n            opacity: 1;\n        }\n\n        .category-image {\n            height: 180px;\n            background-color: rgba(5, 217, 232, 0.1);\n            position: relative;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            overflow: hidden;\n        }\n\n        .category-image img {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n            transition: transform 0.5s ease;\n        }\n\n        .category-card:hover .category-image img {\n            transform: scale(1.1);\n        }\n\n        .category-info {\n            padding: 1.5rem;\n            text-align: center;\n        }\n\n        .category-title {\n            font-size: 1.3rem;\n            font-weight: 600;\n            margin-bottom: 0.5rem;\n            color: var(--neon-green);\n        }\n\n        .category-count {\n            color: rgba(255, 255, 255, 0.7);\n            font-size: 0.9rem;\n        }\n\n        /* Services Section */\n        .services {\n            padding: 5rem 0;\n            position: relative;\n        }\n\n        .services:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 20% 70%, rgba(255, 42, 109, 0.1) 0%, transparent 30%);\n            z-index: -1;\n        }\n\n        .services-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 2rem;\n        }\n\n        .services-title {\n            font-size: 2rem;\n            color: var(--neon-pink);\n            text-shadow: 0 0 10px var(--neon-pink);\n        }\n\n        .services-filter {\n            display: flex;\n            gap: 1rem;\n        }\n\n        .filter-btn {\n            padding: 0.5rem 1.5rem;\n            background-color: rgba(255, 42, 109, 0.1);\n            border: 1px solid var(--neon-pink);\n            border-radius: 50px;\n            color: var(--neon-pink);\n            cursor: pointer;\n            transition: all 0.3s ease;\n        }\n\n        .filter-btn.active, .filter-btn:hover {\n            background-color: var(--neon-pink);\n            color: white;\n            box-shadow: 0 0 15px var(--neon-pink);\n        }\n\n        .services-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n            gap: 2rem;\n        }\n\n        .service-card {\n            background-color: var(--card-bg);\n            border-radius: 15px;\n            overflow: hidden;\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n            transition: all 0.3s ease;\n            border: 1px solid rgba(255, 42, 109, 0.3);\n            position: relative;\n            z-index: 1;\n        }\n\n        .service-card:hover {\n            transform: translateY(-10px);\n            box-shadow: var(--pink-glow);\n            border-color: var(--neon-pink);\n        }\n\n        .service-card:after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: linear-gradient(135deg, rgba(255, 42, 109, 0.1) 0%, transparent 100%);\n            z-index: -1;\n            opacity: 0;\n            transition: opacity 0.3s ease;\n        }\n\n        .service-card:hover:after {\n            opacity: 1;\n        }\n\n        .service-image {\n            height: 200px;\n            background-color: rgba(255, 42, 109, 0.1);\n            position: relative;\n            overflow: hidden;\n        }\n\n        .service-image img {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n            transition: transform 0.5s ease;\n        }\n\n        .service-card:hover .service-image img {\n            transform: scale(1.1);\n        }\n\n        .service-badge {\n            position: absolute;\n            top: 1rem;\n            right: 1rem;\n            background-color: var(--neon-green);\n            color: var(--dark-text);\n            padding: 0.25rem 0.75rem;\n            border-radius: 50px;\n            font-size: 0.8rem;\n            font-weight: 600;\n            box-shadow: 0 0 10px var(--neon-green);\n        }\n\n        .service-info {\n            padding: 1.5rem;\n        }\n\n        .service-seller {\n            display: flex;\n            align-items: center;\n            margin-bottom: 1rem;\n        }\n\n        .seller-avatar {\n            width: 40px;\n            height: 40px;\n            border-radius: 50%;\n            background-color: rgba(5, 217, 232, 0.2);\n            margin-right: 0.75rem;\n            overflow: hidden;\n        }\n\n        .seller-avatar img {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n        }\n\n        .seller-info h4 {\n            font-size: 0.9rem;\n            color: var(--neon-blue);\n            margin-bottom: 0.25rem;\n        }\n\n        .seller-rating {\n            color: var(--neon-yellow);\n            font-size: 0.8rem;\n            display: flex;\n            align-items: center;\n        }\n\n        .seller-rating i {\n            margin-right: 0.25rem;\n        }\n\n        .service-title {\n            font-size: 1.3rem;\n            font-weight: 600;\n            margin-bottom: 0.75rem;\n            color: white;\n        }\n\n        .service-description {\n            color: rgba(255, 255, 255, 0.7);\n            margin-bottom: 1.5rem;\n            font-size: 0.95rem;\n            line-height: 1.5;\n        }\n\n        .service-footer {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n        }\n\n        .service-price {\n            font-weight: 700;\n            font-size: 1.3rem;\n            color: var(--neon-green);\n            text-shadow: 0 0 5px var(--neon-green);\n        }\n\n        .service-btn-small {\n            padding: 0.5rem 1.25rem;\n            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));\n            color: white;\n            border: none;\n            border-radius: 8px;\n            font-size: 0.9rem;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.3s ease;\n        }\n\n        .service-btn-small:hover {\n            background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink));\n            box-shadow: 0 0 10px var(--neon-pink);\n            transform: translateY(-2px);\n        }\n\n        /* Footer */\n        footer {\n            background-color: var(--darker-bg);\n            color: white;\n            padding: 5rem 0 2rem;\n            position: relative;\n            border-top: 1px solid rgba(5, 217, 232, 0.3);\n        }\n\n        footer:before {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: radial-gradient(circle at 50% 0%, rgba(211, 0, 197, 0.1) 0%, transparent 30%);\n            z-index: 0;\n        }\n\n        .footer-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n            gap: 3rem;\n            margin-bottom: 3rem;\n            position: relative;\n            z-index: 1;\n        }\n\n        .footer-col h3 {\n            font-size: 1.5rem;\n            margin-bottom: 1.5rem;\n            position: relative;\n            color: var(--neon-blue);\n        }\n\n        .footer-col h3:after {\n            content: '';\n            position: absolute;\n            left: 0;\n            bottom: -8px;\n            width: 40px;\n            height: 3px;\n            background-color: var(--neon-blue);\n            box-shadow: 0 0 10px var(--neon-blue);\n        }\n\n        .footer-about p {\n            color: rgba(255, 255, 255, 0.7);\n            line-height: 1.6;\n            margin-bottom: 1.5rem;\n        }\n\n        .footer-links {\n            list-style: none;\n            padding: 0;\n            margin: 0;\n            display: flex;\n            flex-direction: column;\n        }\n\n        .footer-links li {\n            margin-bottom: 1rem;\n            display: block;\n            width: 100%;\n        }\n\n        .footer-links a {\n            color: rgba(255, 255, 255, 0.7);\n            text-decoration: none;\n            transition: all 0.3s ease;\n            display: flex;\n            align-items: center;\n        }\n\n        .footer-links a i {\n            margin-right: 0.5rem;\n            color: var(--neon-green);\n        }\n\n        .footer-links a:hover {\n            color: var(--neon-pink);\n            transform: translateX(5px);\n        }\n\n        .footer-social {\n            display: flex;\n            gap: 1rem;\n            margin-top: 1.5rem;\n        }\n\n        .footer-social a {\n            width: 45px;\n            height: 45px;\n            background-color: rgba(255, 255, 255, 0.05);\n            border-radius: 50%;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            color: white;\n            transition: all 0.3s ease;\n            font-size: 1.2rem;\n        }\n\n        .footer-social a:hover {\n            background-color: var(--neon-pink);\n            transform: translateY(-5px);\n            box-shadow: 0 0 15px var(--neon-pink);\n        }\n\n        .footer-contact p {\n            display: flex;\n            align-items: center;\n            margin-bottom: 1rem;\n            color: rgba(255, 255, 255, 0.7);\n        }\n\n        .footer-contact i {\n            margin-right: 0.75rem;\n            color: var(--neon-blue);\n            font-size: 1.2rem;\n        }\n\n        .footer-bottom {\n            text-align: center;\n            padding-top: 2rem;\n            border-top: 1px solid rgba(255, 255, 255, 0.1);\n            color: rgba(255, 255, 255, 0.5);\n            font-size: 0.9rem;\n            position: relative;\n            z-index: 1;\n        }\n\n        /* Status Message */\n        #statusMessage {\n            position: fixed;\n            top: 1rem;\n            right: 1rem;\n            background-color: var(--neon-green);\n            color: var(--darker-bg);\n            padding: 0.75rem 1.5rem;\n            border-radius: 8px;\n            font-weight: bold;\n            box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n            z-index: 1000;\n            display: none;\n        }\n\n        /* Responsive */\n        @media (max-width: 1200px) {\n            .hero h1 {\n                font-size: 3rem;\n            }\n        }\n\n        @media (max-width: 992px) {\n            .hero h1 {\n                font-size: 2.5rem;\n            }\n            \n            .section-title h2 {\n                font-size: 2rem;\n            }\n            \n            .services-grid {\n                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n            }\n        }\n\n        @media (max-width: 768px) {\n            .navbar {\n                flex-direction: column;\n                gap: 1.5rem;\n            }\n            \n            .nav-links {\n                flex-wrap: wrap;\n                justify-content: center;\n            }\n            \n            .hero h1 {\n                font-size: 2rem;\n            }\n            \n            .hero p {\n                font-size: 1.1rem;\n            }\n            \n            .section-title h2 {\n                font-size: 1.8rem;\n            }\n            \n            .container {\n                padding: 0 1.5rem;\n            }\n            \n            .services-header {\n                flex-direction: column;\n                gap: 1rem;\n                align-items: flex-start;\n            }\n            \n            .services-filter {\n                width: 100%;\n                justify-content: center;\n            }\n            \n            .mobile-menu-btn {\n                display: block;\n            }\n            \n            .nav-links {\n                display: none;\n                flex-direction: column;\n                width: 100%;\n                background: var(--darker-bg);\n                position: absolute;\n                top: 100%;\n                left: 0;\n                padding: 1rem;\n                box-shadow: 0 10px 20px rgba(0,0,0,0.3);\n                border-top: 1px solid var(--neon-blue);\n            }\n            \n            .nav-links.active {\n                display: flex;\n            }\n            \n            .nav-links a {\n                padding: 0.75rem 0;\n                border-bottom: 1px solid rgba(5, 217, 232, 0.2);\n            }\n            \n            .nav-links a:last-child {\n                border-bottom: none;\n            }\n            \n            .user-profile {\n                width: 100%;\n                justify-content: center;\n            }\n            \n            .auth-buttons {\n                justify-content: center;\n            }\n        }\n\n        @media (max-width: 576px) {\n            .hero h1 {\n                font-size: 1.8rem;\n            }\n            \n            .hero p {\n                font-size: 1rem;\n            }\n            \n            .section-title h2 {\n                font-size: 1.6rem;\n            }\n            \n            .container {\n                padding: 0 1rem;\n            }\n            \n            .services-filter {\n                flex-wrap: wrap;\n            }\n        }\n    " }} />
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
                <Link to="/Categories" className="active">Categories</Link>
                <Link to="/ContactSupport">Contact Support</Link>
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
            <h1 className="animate__animated animate__fadeInDown">Browse by Categories</h1>
            <p className="animate__animated animate__fadeIn animate__delay-1s">Find the perfect digital service from our wide range of categories</p>
          </div>
        </section>
        {/* Categories Section */}
        <section className="categories">
          <div className="container">
            <div className="section-title">
              <h2>All Categories</h2>
              <p>Browse services by category to find exactly what you need</p>
            </div>
            <div className="categories-grid" id="categoriesGrid">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
                  onClick={() => selectCategory(category.id, category.name)}
                  data-category={category.id}
                >
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="category-info">
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-count">{category.count} services</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Services Section */}
        <section className="services">
          <div className="container">
            <div className="services-header">
              <h2 className="services-title">Services in <span id="selectedCategory">All Categories</span></h2>
              <div className="services-filter">
                <button 
                  className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} 
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${currentFilter === 'featured' ? 'active' : ''}`} 
                  onClick={() => handleFilterChange('featured')}
                >
                  Featured
                </button>
                <button 
                  className={`filter-btn ${currentFilter === 'popular' ? 'active' : ''}`} 
                  onClick={() => handleFilterChange('popular')}
                >
                  Popular
                </button>
                <button 
                  className={`filter-btn ${currentFilter === 'new' ? 'active' : ''}`} 
                  onClick={() => handleFilterChange('new')}
                >
                  New
                </button>
              </div>
            </div>
            <div className="services-grid" id="servicesGrid">
              {loading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                  <div className="loading"></div>
                  <p style={{ color: 'var(--neon-blue)', marginTop: '1rem' }}>Loading services...</p>
                </div>
              ) : filteredGigs.length > 0 ? (
        filteredGigs.map(gig => (
          <div key={gig.id} className="service-card">
            <div className="service-image">
              <img src={gig.image} alt={gig.title} />
              <div className="service-badge">{gig.badge}</div>
            </div>
            <div className="service-info">
              <div className="service-seller">
                <div className="seller-avatar">
                  <img src={gig.seller.avatar} alt={gig.seller.name} />
                </div>
                <div className="seller-info">
                  <h4>{gig.seller.name}</h4>
                  <div className="seller-rating">
                    <i className="fas fa-star"></i>
                    <span>{gig.seller.rating}</span>
                  </div>
                </div>
              </div>
              <h3 className="service-title">{gig.title}</h3>
              <p className="service-description">{gig.description}</p>
              <div className="service-footer">
                <div className="service-price">${gig.price}</div>
                <button
                  className="service-btn-small"
                  onClick={() => orderGig(gig.id)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--neon-pink)', marginBottom: '1rem' }}>No services found</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Try selecting a different category or filter.</p>
        </div>
      )}
            </div>
          </div>
        </section>
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
  };