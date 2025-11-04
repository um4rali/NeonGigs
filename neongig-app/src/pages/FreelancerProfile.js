import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

export default function FreelancerProfile() {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('userData') || 'null');
    if (user && user.isLoggedIn) {
        setUserData(user);
    } else {
        // Redirect to home if not logged in
        window.location.href = '/';
    }
}, []);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    // Static data for demonstration
    const stats = {
        totalOrders: 24,
        completedOrders: 22,
        pendingOrders: 2,
        totalEarnings: 4850,
        averageRating: 4.8,
        responseTime: '2 hours'
    };

    const recentOrders = [
        {
            id: 'ORD-001',
            client: 'John Smith',
            service: 'Logo Design',
            amount: 150,
            status: 'completed',
            date: '2024-01-15',
            rating: 5
        },
        {
            id: 'ORD-002',
            client: 'Sarah Johnson',
            service: 'Website Development',
            amount: 800,
            status: 'in-progress',
            date: '2024-01-14',
            rating: null
        },
        {
            id: 'ORD-003',
            client: 'Mike Wilson',
            service: 'Brand Identity',
            amount: 300,
            status: 'pending',
            date: '2024-01-13',
            rating: null
        },
        {
            id: 'ORD-004',
            client: 'Emily Davis',
            service: 'UI/UX Design',
            amount: 450,
            status: 'completed',
            date: '2024-01-12',
            rating: 5
        }
    ];

  const skills = userData?.skills ? userData.skills.split(',').map(skill => skill.trim()) : ['Web Development', 'UI/UX Design', 'Branding'];
    return (
        <div>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Freelancer Dashboard - NeonGigs</title>
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

        .user-profile {
            display: flex;
            align-items: center;
            gap: 1rem;
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

        /* Dashboard Layout */
        .dashboard {
            padding: 3rem 0;
            min-height: calc(100vh - 100px);
        }

        .dashboard-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .dashboard-header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
            background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .dashboard-header p {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
            max-width: 600px;
            margin: 0 auto;
        }

        .profile-card {
            background-color: var(--card-bg);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 42, 109, 0.3);
            position: relative;
            backdrop-filter: blur(10px);
        }

        .profile-card:before {
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

        .profile-info {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 2rem;
            align-items: center;
        }

        .profile-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-blue));
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            font-size: 2.5rem;
            border: 3px solid var(--neon-blue);
            box-shadow: 0 0 20px rgba(5, 217, 232, 0.5);
        }

        .profile-details h2 {
            font-size: 2rem;
            color: var(--neon-blue);
            margin-bottom: 0.5rem;
        }

        .profile-details p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 0.5rem;
        }

        .profile-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }

        .stat-item {
            text-align: center;
            padding: 1rem;
            background: rgba(0, 255, 157, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(0, 255, 157, 0.3);
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--neon-green);
            margin-bottom: 0.25rem;
        }

        .stat-label {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
        }

        /* Tabs */
        .tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 0.5rem;
            border-radius: 15px;
            border: 1px solid rgba(5, 217, 232, 0.3);
        }

        .tab {
            flex: 1;
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            border-radius: 10px;
            transition: all 0.3s ease;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 600;
        }

        .tab.active {
            background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
            color: white;
            box-shadow: 0 0 15px rgba(5, 217, 232, 0.3);
        }

        .tab:hover:not(.active) {
            background: rgba(5, 217, 232, 0.1);
            color: var(--neon-blue);
        }

        /* Tab Content */
        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background-color: var(--card-bg);
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            border: 1px solid rgba(5, 217, 232, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--glow);
            border-color: var(--neon-blue);
        }

        .stat-card:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
        }

        .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--neon-blue);
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--neon-green);
            margin-bottom: 0.5rem;
        }

        .stat-title {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
        }

        /* Orders Table */
        .orders-table {
            background-color: var(--card-bg);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid rgba(0, 255, 157, 0.3);
            overflow-x: auto;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th,
        .table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .table th {
            color: var(--neon-green);
            font-weight: 600;
            font-size: 1rem;
        }

        .table td {
            color: rgba(255, 255, 255, 0.8);
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-completed {
            background: rgba(0, 255, 157, 0.2);
            color: var(--neon-green);
            border: 1px solid var(--neon-green);
        }

        .status-in-progress {
            background: rgba(255, 247, 0, 0.2);
            color: var(--neon-yellow);
            border: 1px solid var(--neon-yellow);
        }

        .status-pending {
            background: rgba(255, 42, 109, 0.2);
            color: var(--neon-pink);
            border: 1px solid var(--neon-pink);
        }

        .rating {
            color: var(--neon-yellow);
            font-size: 1rem;
        }

        /* Skills Section */
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1rem;
        }

        .skill-tag {
            background: rgba(5, 217, 232, 0.1);
            color: var(--neon-blue);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            border: 1px solid var(--neon-blue);
            font-size: 0.9rem;
            font-weight: 500;
        }

        /* Portfolio Section */
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }

        .portfolio-item {
            background-color: var(--card-bg);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid rgba(211, 0, 197, 0.3);
            transition: all 0.3s ease;
        }

        .portfolio-item:hover {
            transform: translateY(-5px);
            box-shadow: var(--purple-glow);
            border-color: var(--neon-purple);
        }

        .portfolio-item h4 {
            color: var(--neon-purple);
            margin-bottom: 0.5rem;
        }

        .portfolio-item p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .profile-info {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .profile-stats {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .tabs {
                flex-direction: column;
            }

            .container {
                padding: 0 1rem;
            }
        }
    ` }} />

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
                        <div className="user-profile">
                            <div className="user-avatar">
                                {userData ? userData.name.charAt(0).toUpperCase() : 'F'}
                            </div>
                            <span>{userData ? userData.name : 'Freelancer'}</span>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Dashboard */}
            <section className="dashboard">
                <div className="container">
                    <div className="dashboard-header">
                        <h1>Freelancer Dashboard</h1>
                        <p>Welcome back, {userData?.name || 'Freelancer'}! Manage your services and track your success.</p>
                    </div>

                    {/* Profile Card */}
                    <div className="profile-card">
                        <div className="profile-info">
                            <div className="profile-avatar">
                                {userData ? userData.name.charAt(0).toUpperCase() : 'F'}
                            </div>
                            <div className="profile-details">
                                <h2>{userData?.name || 'Freelancer Name'}</h2>
                                <p><i className="fas fa-envelope" style={{marginRight: '0.5rem', color: 'var(--neon-blue)'}} />{userData?.email || 'email@example.com'}</p>
                                <p><i className="fas fa-phone" style={{marginRight: '0.5rem', color: 'var(--neon-blue)'}} />{userData?.phone || '+1234567890'}</p>
                                <p><i className="fas fa-briefcase" style={{marginRight: '0.5rem', color: 'var(--neon-blue)'}} />{userData?.experience || '3-5 years'} Experience</p>
                                <div className="skills-grid">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <div className="stat-value">{stats.totalOrders}</div>
                                    <div className="stat-label">Total Orders</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{stats.averageRating}</div>
                                    <div className="stat-label">Rating</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">${stats.totalEarnings}</div>
                                    <div className="stat-label">Earnings</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs">
                        <div className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                            <i className="fas fa-chart-line" style={{marginRight: '0.5rem'}} />
                            Overview
                        </div>
                        <div className={`tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            <i className="fas fa-shopping-cart" style={{marginRight: '0.5rem'}} />
                            Orders
                        </div>
                        <div className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
                            <i className="fas fa-images" style={{marginRight: '0.5rem'}} />
                            Portfolio
                        </div>
                        <div className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            <i className="fas fa-cog" style={{marginRight: '0.5rem'}} />
                            Settings
                        </div>
                    </div>

                    {/* Overview Tab */}
                    <div className={`tab-content ${activeTab === 'overview' ? 'active' : ''}`}>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-dollar-sign" />
                                </div>
                                <div className="stat-number">${stats.totalEarnings}</div>
                                <div className="stat-title">Total Earnings</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-check-circle" />
                                </div>
                                <div className="stat-number">{stats.completedOrders}</div>
                                <div className="stat-title">Completed Orders</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-clock" />
                                </div>
                                <div className="stat-number">{stats.pendingOrders}</div>
                                <div className="stat-title">Pending Orders</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-star" />
                                </div>
                                <div className="stat-number">{stats.averageRating}</div>
                                <div className="stat-title">Average Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Tab */}
                    <div className={`tab-content ${activeTab === 'orders' ? 'active' : ''}`}>
                        <div className="orders-table">
                            <h3 style={{color: 'var(--neon-green)', marginBottom: '1.5rem'}}>
                                <i className="fas fa-shopping-cart" style={{marginRight: '0.5rem'}} />
                                Recent Orders
                            </h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Client</th>
                                        <th>Service</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.client}</td>
                                            <td>{order.service}</td>
                                            <td>${order.amount}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status.replace('-', '-')}`}>
                                                    {order.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td>{order.date}</td>
                                            <td>
                                                {order.rating ? (
                                                    <div className="rating">
                                                        {Array.from({length: order.rating}).map((_, i) => (
                                                            <i key={i} className="fas fa-star" />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{color: 'rgba(255, 255, 255, 0.5)'}}>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Portfolio Tab */}
                    <div className={`tab-content ${activeTab === 'portfolio' ? 'active' : ''}`}>
                        <div className="portfolio-grid">
                            <div className="portfolio-item">
                                <h4><i className="fas fa-palette" style={{marginRight: '0.5rem', color: 'var(--neon-purple)'}} />Logo Design</h4>
                                <p>Modern logo design for tech startups and businesses. Clean, professional, and memorable designs.</p>
                            </div>
                            <div className="portfolio-item">
                                <h4><i className="fas fa-code" style={{marginRight: '0.5rem', color: 'var(--neon-purple)'}} />Web Development</h4>
                                <p>Full-stack web development using React, Node.js, and modern technologies.</p>
                            </div>
                            <div className="portfolio-item">
                                <h4><i className="fas fa-mobile-alt" style={{marginRight: '0.5rem', color: 'var(--neon-purple)'}} />UI/UX Design</h4>
                                <p>User interface and experience design for mobile and web applications.</p>
                            </div>
                            <div className="portfolio-item">
                                <h4><i className="fas fa-paint-brush" style={{marginRight: '0.5rem', color: 'var(--neon-purple)'}} />Brand Identity</h4>
                                <p>Complete brand identity packages including logos, color schemes, and style guides.</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings Tab */}
                    <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`}>
                        <div className="profile-card">
                            <h3 style={{color: 'var(--neon-blue)', marginBottom: '1.5rem'}}>
                                <i className="fas fa-cog" style={{marginRight: '0.5rem'}} />
                                Account Settings
                            </h3>
                            <div style={{display: 'grid', gap: '1rem'}}>
                                <div>
                                    <label style={{color: 'var(--neon-blue)', fontWeight: '600', display: 'block', marginBottom: '0.5rem'}}>Portfolio Website</label>
                                    <input 
                                        type="url" 
                                        value={userData?.portfolio || ''} 
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(5, 217, 232, 0.3)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{color: 'var(--neon-blue)', fontWeight: '600', display: 'block', marginBottom: '0.5rem'}}>Skills & Expertise</label>
                                    <div className="skills-grid">
                                        {skills.map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{color: 'var(--neon-blue)', fontWeight: '600', display: 'block', marginBottom: '0.5rem'}}>Experience Level</label>
                                    <span style={{color: 'var(--neon-green)', fontSize: '1.1rem'}}>{userData?.experience || '3-5 years'} Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
