import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

export default function UserProfile() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        checkAuth();
        loadNotifications();
    }, []);

    const checkAuth = () => {
        const user = JSON.parse(localStorage.getItem('userData') || 'null');
        const token = localStorage.getItem('token');

        if (user && token) {
            setIsLoggedIn(true);
            const enhancedUser = {
                ...user,
                joinDate: '2023-01-15',
                bio: user.userType === 'freelancer' 
                    ? 'Professional designer creating stunning visual experiences with 5+ years of expertise.'
                    : 'Business owner passionate about building brands and working with creative talent.',
                skills: user.userType === 'freelancer' 
                    ? ['UI/UX Design', 'Brand Identity', 'Web Development', 'Illustration']
                    : ['Project Management', 'Creative Direction', 'Marketing'],
                portfolio: user.userType === 'freelancer' ? [
                    { id: 1, title: 'Tech Startup Logo', image: '🎨', category: 'Logo Design' },
                    { id: 2, title: 'E-commerce Website', image: '💻', category: 'Web Design' },
                    { id: 3, title: 'Brand Guidelines', image: '📚', category: 'Branding' }
                ] : [],
                socialLinks: {
                    website: 'https://portfolio.example.com',
                    linkedin: 'https://linkedin.com/in/username',
                    behance: user.userType === 'freelancer' ? 'https://behance.net/username' : null
                },
                stats: user.userType === 'freelancer' ? {
                    rating: 4.9,
                    completedOrders: 127,
                    responseRate: 98,
                    earnings: 24500,
                    repeatClients: 45,
                    deliveryTime: '2.3 days'
                } : {
                    satisfaction: 4.8,
                    orders: 45,
                    favorites: 12,
                    spent: 3200,
                    activeOrders: 3,
                    completedProjects: 28
                }
            };
            setUserData(enhancedUser);
        }
        setLoading(false);
    };

    const loadNotifications = () => {
        const sampleNotifications = [
            { id: 1, type: 'order', message: 'New order received', time: '2 min ago', read: false },
            { id: 2, type: 'message', message: 'New message from client', time: '1 hour ago', read: false },
            { id: 3, type: 'review', message: 'You received a new review', time: '3 hours ago', read: true }
        ];
        setNotifications(sampleNotifications);
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            window.location.href = '/';
        }
    };

    const openModal = (modalType) => {
        setActiveModal(modalType);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div style={styles.authContainer}>
                <div style={styles.authContent}>
                    <div style={styles.authIcon}>🔒</div>
                    <h2>Authentication Required</h2>
                    <p>Please log in to view your profile</p>
                    <div style={styles.authButtons}>
                        <Link to="/signup" style={styles.primaryButton}>
                            Sign Up
                        </Link>
                        <Link to="/login" style={styles.outlineButton}>
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isFreelancer = userData?.userType === 'freelancer';

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.nav}>
                    <Link to="/" style={styles.logo}>
                        <span style={styles.logoIcon}>⚡</span>
                        NeonGigs
                    </Link>
                    <div style={styles.navActions}>
                        <Link to="/" style={styles.navLink}>Home</Link>
                        <Link to="/categories" style={styles.navLink}>Categories</Link>
                        <button 
                            onClick={() => setShowChat(!showChat)} 
                            style={styles.chatButton}
                        >
                            💬 Messages
                        </button>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Profile Hero */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.avatarSection}>
                        <div style={styles.avatar}>
                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div style={styles.verificationBadge}>
                            ✅ Verified {isFreelancer ? 'Seller' : 'Buyer'}
                        </div>
                        <div style={styles.memberSince}>
                            Member since {userData?.joinDate}
                        </div>
                    </div>
                    
                    <div style={styles.profileInfo}>
                        <h1 style={styles.profileName}>{userData?.name || 'User Name'}</h1>
                        <div style={styles.roleBadge}>
                            {isFreelancer ? '🌟 Premium Seller' : '💼 Verified Buyer'}
                        </div>
                        <p style={styles.bio}>{userData?.bio}</p>
                        
                        {/* Skills/Interests */}
                        <div style={styles.skillsSection}>
                            <h3 style={styles.skillsTitle}>
                                {isFreelancer ? 'Skills & Expertise' : 'Areas of Interest'}
                            </h3>
                            <div style={styles.skillsGrid}>
                                {userData?.skills?.map((skill, index) => (
                                    <span key={index} style={styles.skillTag}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div style={styles.statsGrid}>
                            {isFreelancer ? (
                                <>
                                    <StatCard value="4.9" label="Rating" icon="⭐" />
                                    <StatCard value="127" label="Orders" icon="📦" />
                                    <StatCard value="98%" label="Response" icon="⚡" />
                                    <StatCard value="$24.5K" label="Earnings" icon="💰" />
                                </>
                            ) : (
                                <>
                                    <StatCard value="4.8" label="Satisfaction" icon="😊" />
                                    <StatCard value="45" label="Orders" icon="📦" />
                                    <StatCard value="12" label="Favorites" icon="❤️" />
                                    <StatCard value="$3.2K" label="Spent" icon="💸" />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section style={styles.quickActions}>
                <div style={styles.actionsGrid}>
                    {isFreelancer ? (
                        <>
                            <ActionButton 
                                icon="➕" 
                                label="New Service" 
                                onClick={() => openModal('createService')}
                            />
                            <ActionButton 
                                icon="📊" 
                                label="Analytics" 
                                onClick={() => setActiveTab('analytics')}
                            />
                            <ActionButton 
                                icon="💬" 
                                label="Messages" 
                                onClick={() => setShowChat(true)}
                            />
                            <ActionButton 
                                icon="💳" 
                                label="Withdraw" 
                                onClick={() => openModal('withdraw')}
                            />
                        </>
                    ) : (
                        <>
                            <ActionButton 
                                icon="🔍" 
                                label="Find Services" 
                                onClick={() => window.location.href = '/categories'}
                            />
                            <ActionButton 
                                icon="❤️" 
                                label="Favorites" 
                                onClick={() => setActiveTab('favorites')}
                            />
                            <ActionButton 
                                icon="🔔" 
                                label="Notifications" 
                                onClick={() => openModal('notifications')}
                            />
                            <ActionButton 
                                icon="💳" 
                                label="Payment Methods" 
                                onClick={() => openModal('paymentMethods')}
                            />
                        </>
                    )}
                </div>
            </section>

            {/* Tabs */}
            <section style={styles.tabsSection}>
                <div style={styles.tabs}>
                    {[
                        { id: 'overview', label: 'Overview', icon: '📊' },
                        { id: 'orders', label: isFreelancer ? 'Orders' : 'Purchases', icon: '📦' },
                        ...(isFreelancer ? [
                            { id: 'services', label: 'Services', icon: '🎨' },
                            { id: 'earnings', label: 'Earnings', icon: '💰' },
                            { id: 'analytics', label: 'Analytics', icon: '📈' }
                        ] : [
                            { id: 'favorites', label: 'Favorites', icon: '❤️' },
                            { id: 'tracking', label: 'Order Tracking', icon: '🚚' }
                        ]),
                        { id: 'reviews', label: 'Reviews', icon: '⭐' },
                        { id: 'portfolio', label: isFreelancer ? 'Portfolio' : 'Projects', icon: '🖼️' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            style={{
                                ...styles.tab,
                                ...(activeTab === tab.id ? styles.activeTab : {})
                            }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span style={styles.tabIcon}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Tab Content */}
            <main style={styles.main}>
                {activeTab === 'overview' && <OverviewTab isFreelancer={isFreelancer} userData={userData} />}
                {activeTab === 'orders' && <OrdersTab isFreelancer={isFreelancer} />}
                {activeTab === 'services' && isFreelancer && <ServicesTab />}
                {activeTab === 'earnings' && isFreelancer && <EarningsTab />}
                {activeTab === 'analytics' && isFreelancer && <AnalyticsTab />}
                {activeTab === 'favorites' && !isFreelancer && <FavoritesTab />}
                {activeTab === 'tracking' && !isFreelancer && <TrackingTab />}
                {activeTab === 'reviews' && <ReviewsTab isFreelancer={isFreelancer} />}
                {activeTab === 'portfolio' && <PortfolioTab isFreelancer={isFreelancer} userData={userData} />}
                {activeTab === 'settings' && <SettingsTab userData={userData} onDeleteAccount={handleDeleteAccount} />}
            </main>

            {/* Chat Interface */}
            {showChat && (
                <ChatInterface onClose={() => setShowChat(false)} />
            )}

            {/* Modals */}
            {activeModal === 'createService' && (
                <CreateServiceModal onClose={closeModal} />
            )}

            {activeModal === 'withdraw' && (
                <WithdrawModal onClose={closeModal} />
            )}

            {activeModal === 'notifications' && (
                <NotificationsModal 
                    notifications={notifications} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
}

// Component for stat cards
const StatCard = ({ value, label, icon }) => (
    <div style={styles.statCard}>
        <div style={styles.statIcon}>{icon}</div>
        <div style={styles.statContent}>
            <div style={styles.statValue}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
        </div>
    </div>
);

// Component for action buttons
const ActionButton = ({ icon, label, onClick }) => (
    <button style={styles.actionButton} onClick={onClick}>
        <span style={styles.actionIcon}>{icon}</span>
        {label}
    </button>
);

// Tab Components
const OverviewTab = ({ isFreelancer, userData }) => (
    <div style={styles.tabContent}>
        <h2 style={styles.tabTitle}>Performance Overview</h2>
        <div style={styles.overviewGrid}>
            <div style={styles.overviewCard}>
                <h3>📈 Recent Activity</h3>
                <div style={styles.activityList}>
                    <ActivityItem 
                        icon="✅" 
                        title={isFreelancer ? "Order Completed" : "Purchase Completed"} 
                        description={isFreelancer ? "Premium Logo Design" : "Professional Logo Design"} 
                        time="2 hours ago" 
                    />
                    <ActivityItem 
                        icon="💬" 
                        title="New Message" 
                        description={isFreelancer ? "From Sarah Johnson" : "From Design Master"} 
                        time="5 hours ago" 
                    />
                    <ActivityItem 
                        icon="⭐" 
                        title="New Review" 
                        description="5-star rating received" 
                        time="1 day ago" 
                    />
                    <ActivityItem 
                        icon="🔄" 
                        title={isFreelancer ? "Order Update" : "Order Status Update"} 
                        description={isFreelancer ? "Website redesign in progress" : "Your order is being processed"} 
                        time="2 days ago" 
                    />
                </div>
            </div>
            
            <div style={styles.overviewCard}>
                <h3>🎯 Current Goals</h3>
                <div style={styles.goalsList}>
                    <GoalItem 
                        text={isFreelancer ? "Reach $30K earnings" : "Complete website project"} 
                        completed={isFreelancer ? userData?.stats?.earnings > 30000 : false} 
                    />
                    <GoalItem 
                        text={isFreelancer ? "Maintain 4.9+ rating" : "Find reliable designers"} 
                        completed={isFreelancer ? userData?.stats?.rating >= 4.9 : false} 
                    />
                    <GoalItem 
                        text={isFreelancer ? "50 new orders" : "Build brand identity"} 
                        completed={false} 
                    />
                    <GoalItem 
                        text={isFreelancer ? "Increase repeat clients" : "Launch new product"} 
                        completed={false} 
                    />
                </div>
            </div>

            <div style={styles.overviewCard}>
                <h3>📊 Quick Stats</h3>
                <div style={styles.quickStats}>
                    {isFreelancer ? (
                        <>
                            <QuickStat label="Active Orders" value="3" trend="+1" />
                            <QuickStat label="Response Time" value="2.1h" trend="-0.3h" />
                            <QuickStat label="Repeat Clients" value="45%" trend="+5%" />
                            <QuickStat label="Delivery Rate" value="99%" trend="+2%" />
                        </>
                    ) : (
                        <>
                            <QuickStat label="Active Orders" value="2" trend="0" />
                            <QuickStat label="Avg. Satisfaction" value="4.8" trend="+0.1" />
                            <QuickStat label="Budget Used" value="65%" trend="+15%" />
                            <QuickStat label="Projects Completed" value="28" trend="+3" />
                        </>
                    )}
                </div>
            </div>

            <div style={styles.overviewCard}>
                <h3>🚀 Recommendations</h3>
                <div style={styles.recommendations}>
                    {isFreelancer ? (
                        <>
                            <RecommendationItem 
                                text="Optimize your service descriptions for better visibility" 
                                action="Edit Services"
                            />
                            <RecommendationItem 
                                text="Share your portfolio on social media to attract more clients" 
                                action="Share Portfolio"
                            />
                            <RecommendationItem 
                                text="Consider offering package deals to increase order value" 
                                action="Create Packages"
                            />
                        </>
                    ) : (
                        <>
                            <RecommendationItem 
                                text="Save your favorite sellers for quick access" 
                                action="Browse Sellers"
                            />
                            <RecommendationItem 
                                text="Set up a project budget to track spending" 
                                action="Set Budget"
                            />
                            <RecommendationItem 
                                text="Leave reviews for completed projects to help the community" 
                                action="Write Reviews"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const OrdersTab = ({ isFreelancer }) => {
    const orders = isFreelancer ? [
        { 
            id: 'F001', 
            title: 'Logo Design', 
            client: 'Tech Startup', 
            price: '$499', 
            status: 'completed', 
            date: '2023-10-20',
            deadline: '2023-10-25',
            delivery: 'Early'
        },
        { 
            id: 'F002', 
            title: 'Website Redesign', 
            client: 'Innovation Labs', 
            price: '$1,299', 
            status: 'in-progress', 
            date: '2023-10-18',
            deadline: '2023-10-30',
            delivery: 'On Track'
        },
        { 
            id: 'F003', 
            title: 'Brand Identity', 
            client: 'Creative Studio', 
            price: '$899', 
            status: 'pending', 
            date: '2023-10-15',
            deadline: '2023-11-05',
            delivery: 'Scheduled'
        }
    ] : [
        { 
            id: 'B001', 
            title: 'Logo Design', 
            seller: 'Design Master', 
            price: '$299', 
            status: 'completed', 
            date: '2023-10-20',
            rating: 5
        },
        { 
            id: 'B002', 
            title: 'Social Media Kit', 
            seller: 'Creative Pro', 
            price: '$149', 
            status: 'delivered', 
            date: '2023-10-18',
            rating: 4
        },
        { 
            id: 'B003', 
            title: 'Website Development', 
            seller: 'Tech Solutions', 
            price: '$2,999', 
            status: 'in-progress', 
            date: '2023-10-15',
            rating: null
        }
    ];

    return (
        <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
                <h2 style={styles.tabTitle}>{isFreelancer ? 'Active Orders' : 'Recent Purchases'}</h2>
                {isFreelancer && (
                    <button style={styles.primaryButton}>
                        📋 View All Orders
                    </button>
                )}
            </div>
            <div style={styles.ordersList}>
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} isFreelancer={isFreelancer} />
                ))}
            </div>
        </div>
    );
};

const ServicesTab = () => {
    const [services, setServices] = useState([
        { id: 1, title: 'Premium Logo Design', price: '$499', orders: 127, rating: 4.9, delivery: '3 days', status: 'active' },
        { id: 2, title: 'Brand Identity Package', price: '$1,299', orders: 89, rating: 5.0, delivery: '7 days', status: 'active' },
        { id: 3, title: 'Website UI/UX Design', price: '$2,499', orders: 64, rating: 4.8, delivery: '14 days', status: 'paused' }
    ]);

    const handleDeleteService = (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setServices(services.filter(service => service.id !== serviceId));
        }
    };

    const handleToggleService = (serviceId) => {
        setServices(services.map(service => 
            service.id === serviceId 
                ? { ...service, status: service.status === 'active' ? 'paused' : 'active' }
                : service
        ));
    };

    return (
        <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
                <h2 style={styles.tabTitle}>My Services</h2>
                <button style={styles.primaryButton}>
                    + Add New Service
                </button>
            </div>
            <div style={styles.servicesGrid}>
                {services.map(service => (
                    <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onDelete={handleDeleteService}
                        onToggle={handleToggleService}
                    />
                ))}
            </div>
        </div>
    );
};

const EarningsTab = () => {
    const earningsData = {
        total: 24500,
        pending: 1200,
        available: 23300,
        history: [
            { month: 'Jan', earnings: 4200 },
            { month: 'Feb', earnings: 3800 },
            { month: 'Mar', earnings: 5100 },
            { month: 'Apr', earnings: 4700 },
            { month: 'May', earnings: 3900 },
            { month: 'Jun', earnings: 2800 }
        ]
    };

    return (
        <div style={styles.tabContent}>
            <h2 style={styles.tabTitle}>Earnings Dashboard</h2>
            <div style={styles.earningsOverview}>
                <div style={styles.earningsCard}>
                    <h3>💰 Total Earnings</h3>
                    <div style={styles.earningsAmount}>${earningsData.total.toLocaleString()}</div>
                    <div style={styles.earningsTrend}>+12% from last month</div>
                </div>
                <div style={styles.earningsCard}>
                    <h3>⏳ Pending Clearance</h3>
                    <div style={styles.earningsAmount}>${earningsData.pending.toLocaleString()}</div>
                    <div style={styles.earningsTrend}>Clears in 7 days</div>
                </div>
                <div style={styles.earningsCard}>
                    <h3>💳 Available Now</h3>
                    <div style={styles.earningsAmount}>${earningsData.available.toLocaleString()}</div>
                    <div style={styles.earningsTrend}>Ready to withdraw</div>
                </div>
            </div>

            <div style={styles.earningsChart}>
                <h3>📈 Earnings History</h3>
                <div style={styles.chartBars}>
                    {earningsData.history.map((item, index) => (
                        <div key={index} style={styles.chartBarContainer}>
                            <div 
                                style={{
                                    ...styles.chartBar,
                                    height: `${(item.earnings / 6000) * 100}px`
                                }}
                            ></div>
                            <div style={styles.chartLabel}>{item.month}</div>
                            <div style={styles.chartValue}>${item.earnings}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.withdrawalSection}>
                <h3>💸 Withdraw Funds</h3>
                <div style={styles.withdrawalOptions}>
                    <button style={styles.withdrawalButton}>
                        <span>🏦</span>
                        Bank Transfer
                    </button>
                    <button style={styles.withdrawalButton}>
                        <span>📱</span>
                        PayPal
                    </button>
                    <button style={styles.withdrawalButton}>
                        <span>💎</span>
                        Crypto
                    </button>
                </div>
            </div>
        </div>
    );
};

const AnalyticsTab = () => (
    <div style={styles.tabContent}>
        <h2 style={styles.tabTitle}>Performance Analytics</h2>
        <div style={styles.analyticsGrid}>
            <div style={styles.analyticsCard}>
                <h3>📊 Order Performance</h3>
                <div style={styles.metric}>
                    <span>Completion Rate</span>
                    <span style={styles.metricValue}>98%</span>
                </div>
                <div style={styles.metric}>
                    <span>On-Time Delivery</span>
                    <span style={styles.metricValue}>95%</span>
                </div>
                <div style={styles.metric}>
                    <span>Repeat Clients</span>
                    <span style={styles.metricValue}>42%</span>
                </div>
            </div>
            
            <div style={styles.analyticsCard}>
                <h3>⭐ Rating Analytics</h3>
                <div style={styles.ratingBreakdown}>
                    <div style={styles.ratingRow}>
                        <span>5 Stars</span>
                        <div style={styles.ratingBarContainer}>
                            <div style={{...styles.ratingBar, width: '85%', background: '#00ff9d'}}></div>
                        </div>
                        <span>85%</span>
                    </div>
                    <div style={styles.ratingRow}>
                        <span>4 Stars</span>
                        <div style={styles.ratingBarContainer}>
                            <div style={{...styles.ratingBar, width: '12%', background: '#05d9e8'}}></div>
                        </div>
                        <span>12%</span>
                    </div>
                    <div style={styles.ratingRow}>
                        <span>3 Stars</span>
                        <div style={styles.ratingBarContainer}>
                            <div style={{...styles.ratingBar, width: '2%', background: '#fff700'}}></div>
                        </div>
                        <span>2%</span>
                    </div>
                    <div style={styles.ratingRow}>
                        <span>2 Stars</span>
                        <div style={styles.ratingBarContainer}>
                            <div style={{...styles.ratingBar, width: '1%', background: '#ff2a6d'}}></div>
                        </div>
                        <span>1%</span>
                    </div>
                </div>
            </div>

            <div style={styles.analyticsCard}>
                <h3>🎯 Client Satisfaction</h3>
                <div style={styles.satisfactionScore}>
                    <div style={styles.scoreCircle}>
                        <span style={styles.scoreValue}>4.9</span>
                        <span style={styles.scoreLabel}>/5.0</span>
                    </div>
                </div>
                <div style={styles.satisfactionMetrics}>
                    <div style={styles.satisfactionMetric}>
                        <span>Communication</span>
                        <span>4.8</span>
                    </div>
                    <div style={styles.satisfactionMetric}>
                        <span>Quality</span>
                        <span>4.9</span>
                    </div>
                    <div style={styles.satisfactionMetric}>
                        <span>Delivery</span>
                        <span>4.7</span>
                    </div>
                </div>
            </div>

            <div style={styles.analyticsCard}>
                <h3>📈 Growth Trends</h3>
                <div style={styles.trendItem}>
                    <span>Monthly Orders</span>
                    <span style={styles.positiveTrend}>+15% ↗</span>
                </div>
                <div style={styles.trendItem}>
                    <span>Earnings Growth</span>
                    <span style={styles.positiveTrend}>+22% ↗</span>
                </div>
                <div style={styles.trendItem}>
                    <span>New Clients</span>
                    <span style={styles.positiveTrend}>+8% ↗</span>
                </div>
                <div style={styles.trendItem}>
                    <span>Response Time</span>
                    <span style={styles.negativeTrend}>+0.2h ↘</span>
                </div>
            </div>
        </div>
    </div>
);

const FavoritesTab = () => {
    const favorites = [
        { id: 1, name: 'Design Master', rating: 4.9, services: 'Logo Design, Branding', orders: 127, response: '1h' },
        { id: 2, name: 'Web Pro', rating: 4.8, services: 'Web Development, UI/UX', orders: 89, response: '2h' },
        { id: 3, name: 'Creative Studio', rating: 5.0, services: 'Illustration, Animation', orders: 203, response: '3h' }
    ];

    return (
        <div style={styles.tabContent}>
            <h2 style={styles.tabTitle}>Favorite Sellers</h2>
            <div style={styles.favoritesGrid}>
                {favorites.map(fav => (
                    <div key={fav.id} style={styles.favoriteCard}>
                        <div style={styles.favoriteHeader}>
                            <div style={styles.sellerAvatar}>
                                {fav.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={styles.sellerName}>{fav.name}</h3>
                                <div style={styles.sellerRating}>
                                    {'⭐'.repeat(5)} ({fav.rating})
                                </div>
                            </div>
                        </div>
                        <div style={styles.sellerInfo}>
                            <div style={styles.sellerStat}>
                                <span>Services:</span>
                                <span>{fav.services}</span>
                            </div>
                            <div style={styles.sellerStat}>
                                <span>Orders:</span>
                                <span>{fav.orders}</span>
                            </div>
                            <div style={styles.sellerStat}>
                                <span>Avg. Response:</span>
                                <span>{fav.response}</span>
                            </div>
                        </div>
                        <div style={styles.favoriteActions}>
                            <button style={styles.outlineButton}>View Profile</button>
                            <button style={styles.primaryButton}>Message</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TrackingTab = () => {
    const trackedOrders = [
        { id: 'TRK001', service: 'Website Development', seller: 'Tech Solutions', status: 'in-progress', progress: 65, eta: '5 days' },
        { id: 'TRK002', service: 'Logo Design', seller: 'Design Master', status: 'review', progress: 90, eta: '2 days' },
        { id: 'TRK003', service: 'Social Media Kit', seller: 'Creative Pro', status: 'delivered', progress: 100, eta: 'Completed' }
    ];

    return (
        <div style={styles.tabContent}>
            <h2 style={styles.tabTitle}>Order Tracking</h2>
            <div style={styles.trackingList}>
                {trackedOrders.map(order => (
                    <div key={order.id} style={styles.trackingCard}>
                        <div style={styles.trackingHeader}>
                            <h3 style={styles.trackingTitle}>{order.service}</h3>
                            <StatusBadge status={order.status} />
                        </div>
                        <p style={styles.trackingSeller}>Seller: {order.seller}</p>
                        
                        <div style={styles.progressContainer}>
                            <div style={styles.progressLabels}>
                                <span>Order Progress</span>
                                <span>{order.progress}%</span>
                            </div>
                            <div style={styles.progressBar}>
                                <div 
                                    style={{
                                        ...styles.progressFill,
                                        width: `${order.progress}%`,
                                        background: order.status === 'delivered' 
                                            ? '#00ff9d' 
                                            : order.status === 'in-progress'
                                            ? '#05d9e8'
                                            : '#fff700'
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div style={styles.trackingMeta}>
                            <div style={styles.trackingMetaItem}>
                                <span>Order ID:</span>
                                <span>{order.id}</span>
                            </div>
                            <div style={styles.trackingMetaItem}>
                                <span>Estimated Delivery:</span>
                                <span>{order.eta}</span>
                            </div>
                        </div>

                        <div style={styles.trackingActions}>
                            <button style={styles.outlineButton}>View Details</button>
                            <button style={styles.primaryButton}>Message Seller</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReviewsTab = ({ isFreelancer }) => {
    const reviews = isFreelancer ? [
        { id: 1, user: 'Sarah Johnson', rating: 5, comment: 'Exceptional work! Perfectly captured our brand vision. Will definitely work with again.', date: '2023-10-15', service: 'Logo Design' },
        { id: 2, user: 'Mike Chen', rating: 5, comment: 'Outstanding quality and attention to detail. Exceeded all expectations.', date: '2023-10-10', service: 'Brand Identity' },
        { id: 3, user: 'Emma Rodriguez', rating: 4, comment: 'Good work overall, communication could be better but the final result was excellent.', date: '2023-10-05', service: 'Website Design' }
    ] : [
        { id: 1, user: 'Design Master', rating: 5, comment: 'Excellent client! Clear requirements and prompt communication.', date: '2023-10-15', service: 'Logo Design' },
        { id: 2, user: 'Web Pro', rating: 4, comment: 'Good to work with, provided clear feedback throughout the project.', date: '2023-10-10', service: 'Website Development' }
    ];

    const [newReview, setNewReview] = useState({ rating: 5, comment: '', service: '' });

    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Handle review submission
        alert('Review submitted successfully!');
        setNewReview({ rating: 5, comment: '', service: '' });
    };

    return (
        <div style={styles.tabContent}>
            <h2 style={styles.tabTitle}>{isFreelancer ? 'Customer Reviews' : 'My Reviews'}</h2>
            
            {!isFreelancer && (
                <div style={styles.reviewFormCard}>
                    <h3>✍️ Write a Review</h3>
                    <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Service</label>
                            <select 
                                style={styles.input}
                                value={newReview.service}
                                onChange={(e) => setNewReview({...newReview, service: e.target.value})}
                                required
                            >
                                <option value="">Select a service</option>
                                <option value="Logo Design">Logo Design</option>
                                <option value="Website Development">Website Development</option>
                                <option value="Brand Identity">Brand Identity</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Rating</label>
                            <div style={styles.ratingSelector}>
                                {[1,2,3,4,5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        style={styles.ratingStar}
                                        onClick={() => setNewReview({...newReview, rating: star})}
                                    >
                                        {star <= newReview.rating ? '⭐' : '☆'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Your Review</label>
                            <textarea 
                                style={styles.textarea}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                placeholder="Share your experience with this service..."
                                rows="4"
                                required
                            />
                        </div>
                        <button type="submit" style={styles.primaryButton}>
                            Submit Review
                        </button>
                    </form>
                </div>
            )}

            <div style={styles.reviewsList}>
                {reviews.map(review => (
                    <div key={review.id} style={styles.reviewCard}>
                        <div style={styles.reviewHeader}>
                            <div style={styles.reviewerInfo}>
                                <div style={styles.reviewerAvatar}>
                                    {review.user.charAt(0)}
                                </div>
                                <div>
                                    <h4 style={styles.reviewerName}>{review.user}</h4>
                                    <div style={styles.reviewMeta}>
                                        <span style={styles.reviewDate}>{review.date}</span>
                                        <span style={styles.reviewService}>{review.service}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.reviewRating}>
                                {'⭐'.repeat(review.rating)}
                            </div>
                        </div>
                        <p style={styles.reviewComment}>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PortfolioTab = ({ isFreelancer, userData }) => (
    <div style={styles.tabContent}>
        <div style={styles.sectionHeader}>
            <h2 style={styles.tabTitle}>
                {isFreelancer ? 'My Portfolio' : 'My Projects'}
            </h2>
            {isFreelancer && (
                <button style={styles.primaryButton}>
                    + Add Project
                </button>
            )}
        </div>

        {isFreelancer ? (
            <div style={styles.portfolioGrid}>
                {userData?.portfolio?.map(project => (
                    <div key={project.id} style={styles.portfolioCard}>
                        <div style={styles.portfolioImage}>
                            {project.image}
                        </div>
                        <div style={styles.portfolioContent}>
                            <h3 style={styles.portfolioTitle}>{project.title}</h3>
                            <div style={styles.portfolioCategory}>{project.category}</div>
                            <div style={styles.portfolioActions}>
                                <button style={styles.outlineButton}>Edit</button>
                                <button style={styles.primaryButton}>View</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div style={styles.projectsList}>
                <div style={styles.projectCard}>
                    <h3>🚀 E-commerce Website</h3>
                    <p>Complete online store development with custom features</p>
                    <div style={styles.projectMeta}>
                        <span>Status: Completed</span>
                        <span>Budget: $2,500</span>
                        <span>Timeline: 4 weeks</span>
                    </div>
                </div>
                <div style={styles.projectCard}>
                    <h3>🎨 Brand Identity</h3>
                    <p>Logo design and brand guidelines for startup company</p>
                    <div style={styles.projectMeta}>
                        <span>Status: In Progress</span>
                        <span>Budget: $899</span>
                        <span>Timeline: 2 weeks</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

const SettingsTab = ({ userData, onDeleteAccount }) => {
    const [settings, setSettings] = useState({
        email: userData?.email || '',
        name: userData?.name || '',
        bio: userData?.bio || '',
        notifications: {
            email: true,
            push: true,
            sms: false
        },
        privacy: {
            profileVisible: true,
            portfolioPublic: true,
            showEarnings: false
        }
    });

    const handleSaveSettings = (e) => {
        e.preventDefault();
        // Save settings logic
        alert('Settings saved successfully!');
    };

    return (
        <div style={styles.tabContent}>
            <h2 style={styles.tabTitle}>Account Settings</h2>
            
            <form onSubmit={handleSaveSettings} style={styles.settingsForm}>
                <div style={styles.settingsSection}>
                    <h3>👤 Profile Information</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input 
                                type="text" 
                                style={styles.input}
                                value={settings.name}
                                onChange={(e) => setSettings({...settings, name: e.target.value})}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                style={styles.input}
                                value={settings.email}
                                onChange={(e) => setSettings({...settings, email: e.target.value})}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Bio</label>
                            <textarea 
                                style={styles.textarea}
                                value={settings.bio}
                                onChange={(e) => setSettings({...settings, bio: e.target.value})}
                                rows="4"
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.settingsSection}>
                    <h3>🔔 Notifications</h3>
                    <div style={styles.checkboxGroup}>
                        <label style={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={settings.notifications.email}
                                onChange={(e) => setSettings({
                                    ...settings, 
                                    notifications: {...settings.notifications, email: e.target.checked}
                                })}
                            />
                            Email Notifications
                        </label>
                        <label style={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={settings.notifications.push}
                                onChange={(e) => setSettings({
                                    ...settings, 
                                    notifications: {...settings.notifications, push: e.target.checked}
                                })}
                            />
                            Push Notifications
                        </label>
                        <label style={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={settings.notifications.sms}
                                onChange={(e) => setSettings({
                                    ...settings, 
                                    notifications: {...settings.notifications, sms: e.target.checked}
                                })}
                            />
                            SMS Notifications
                        </label>
                    </div>
                </div>

                <div style={styles.settingsSection}>
                    <h3>🔒 Privacy & Security</h3>
                    <div style={styles.checkboxGroup}>
                        <label style={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={settings.privacy.profileVisible}
                                onChange={(e) => setSettings({
                                    ...settings, 
                                    privacy: {...settings.privacy, profileVisible: e.target.checked}
                                })}
                            />
                            Make Profile Public
                        </label>
                        <label style={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={settings.privacy.portfolioPublic}
                                onChange={(e) => setSettings({
                                    ...settings, 
                                    privacy: {...settings.privacy, portfolioPublic: e.target.checked}
                                })}
                            />
                            Show Portfolio to Public
                        </label>
                        <label style={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={settings.privacy.showEarnings}
                                onChange={(e) => setSettings({
                                    ...settings, 
                                    privacy: {...settings.privacy, showEarnings: e.target.checked}
                                })}
                            />
                            Show Earnings Stats
                        </label>
                    </div>
                </div>

                <div style={styles.settingsActions}>
                    <button type="submit" style={styles.primaryButton}>
                        Save Changes
                    </button>
                    <button 
                        type="button" 
                        style={styles.dangerButton}
                        onClick={onDeleteAccount}
                    >
                        Delete Account
                    </button>
                </div>
            </form>
        </div>
    );
};

// Additional Components
const ActivityItem = ({ icon, title, description, time }) => (
    <div style={styles.activityItem}>
        <div style={styles.activityIcon}>{icon}</div>
        <div style={styles.activityContent}>
            <div style={styles.activityTitle}>{title}</div>
            <div style={styles.activityDescription}>{description}</div>
        </div>
        <div style={styles.activityTime}>{time}</div>
    </div>
);

const GoalItem = ({ text, completed }) => (
    <div style={styles.goalItem}>
        <div style={{
            ...styles.goalCheckbox,
            ...(completed ? styles.goalCompleted : {})
        }}>
            {completed ? '✅' : '⏳'}
        </div>
        <span style={{
            ...styles.goalText,
            ...(completed ? styles.goalTextCompleted : {})
        }}>
            {text}
        </span>
    </div>
);

const QuickStat = ({ label, value, trend }) => (
    <div style={styles.quickStat}>
        <div style={styles.quickStatValue}>{value}</div>
        <div style={styles.quickStatLabel}>{label}</div>
        <div style={styles.quickStatTrend}>{trend}</div>
    </div>
);

const RecommendationItem = ({ text, action }) => (
    <div style={styles.recommendationItem}>
        <div style={styles.recommendationText}>{text}</div>
        <button style={styles.recommendationAction}>{action}</button>
    </div>
);

const OrderCard = ({ order, isFreelancer }) => (
    <div style={styles.orderCard}>
        <div style={styles.orderHeader}>
            <h3 style={styles.orderTitle}>{order.title}</h3>
            <StatusBadge status={order.status} />
        </div>
        <div style={styles.orderDetails}>
            <div style={styles.orderDetail}>
                <span>{isFreelancer ? 'Client' : 'Seller'}:</span>
                <span>{isFreelancer ? order.client : order.seller}</span>
            </div>
            <div style={styles.orderDetail}>
                <span>Price:</span>
                <span style={styles.orderPrice}>{order.price}</span>
            </div>
            <div style={styles.orderDetail}>
                <span>Order Date:</span>
                <span>{order.date}</span>
            </div>
            {isFreelancer && (
                <div style={styles.orderDetail}>
                    <span>Delivery:</span>
                    <span style={styles.deliveryStatus}>{order.delivery}</span>
                </div>
            )}
        </div>
        <div style={styles.orderActions}>
            <button style={styles.outlineButton}>View Details</button>
            <button style={styles.primaryButton}>
                {isFreelancer ? 'Deliver' : 'Track Order'}
            </button>
        </div>
    </div>
);

const ServiceCard = ({ service, onDelete, onToggle }) => (
    <div style={styles.serviceCard}>
        <div style={styles.serviceHeader}>
            <h3 style={styles.serviceTitle}>{service.title}</h3>
            <div style={{
                ...styles.serviceStatus,
                ...(service.status === 'active' ? styles.statusActive : styles.statusPaused)
            }}>
                {service.status === 'active' ? 'Active' : 'Paused'}
            </div>
        </div>
        <div style={styles.serviceDetails}>
            <div style={styles.serviceDetail}>
                <span>Price:</span>
                <span style={styles.servicePrice}>{service.price}</span>
            </div>
            <div style={styles.serviceDetail}>
                <span>Orders:</span>
                <span>{service.orders}</span>
            </div>
            <div style={styles.serviceDetail}>
                <span>Rating:</span>
                <span>{service.rating} ⭐</span>
            </div>
            <div style={styles.serviceDetail}>
                <span>Delivery:</span>
                <span>{service.delivery}</span>
            </div>
        </div>
        <div style={styles.serviceActions}>
            <button 
                style={styles.outlineButton}
                onClick={() => onToggle(service.id)}
            >
                {service.status === 'active' ? 'Pause' : 'Activate'}
            </button>
            <button style={styles.primaryButton}>Edit</button>
            <button 
                style={styles.dangerButton}
                onClick={() => onDelete(service.id)}
            >
                Delete
            </button>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        'completed': { label: 'Completed', color: '#00ff9d' },
        'in-progress': { label: 'In Progress', color: '#05d9e8' },
        'pending': { label: 'Pending', color: '#fff700' },
        'delivered': { label: 'Delivered', color: '#00ff9d' },
        'review': { label: 'In Review', color: '#ff2a6d' }
    };

    const config = statusConfig[status] || { label: status, color: '#666' };

    return (
        <span style={{
            ...styles.statusBadge,
            background: config.color
        }}>
            {config.label}
        </span>
    );
};

// Modal Components
const CreateServiceModal = ({ onClose }) => (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
            <div style={styles.modalHeader}>
                <h2>Create New Service</h2>
                <button onClick={onClose} style={styles.closeButton}>✕</button>
            </div>
            <div style={styles.modalContent}>
                <form style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Service Title</label>
                        <input type="text" style={styles.input} placeholder="e.g., Professional Logo Design" />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea style={styles.textarea} rows="4" placeholder="Describe your service..." />
                    </div>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Price ($)</label>
                            <input type="number" style={styles.input} placeholder="299" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Delivery Time</label>
                            <select style={styles.input}>
                                <option>3 days</option>
                                <option>5 days</option>
                                <option>7 days</option>
                                <option>14 days</option>
                            </select>
                        </div>
                    </div>
                    <div style={styles.modalActions}>
                        <button type="button" style={styles.outlineButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.primaryButton}>
                            Create Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);

const WithdrawModal = ({ onClose }) => (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
            <div style={styles.modalHeader}>
                <h2>Withdraw Funds</h2>
                <button onClick={onClose} style={styles.closeButton}>✕</button>
            </div>
            <div style={styles.modalContent}>
                <div style={styles.withdrawInfo}>
                    <div style={styles.withdrawAmount}>
                        <span>Available Balance:</span>
                        <span style={styles.amount}>$23,300</span>
                    </div>
                </div>
                <form style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Amount to Withdraw</label>
                        <input type="number" style={styles.input} placeholder="Enter amount" max="23300" />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Withdrawal Method</label>
                        <select style={styles.input}>
                            <option>Bank Transfer</option>
                            <option>PayPal</option>
                            <option>Cryptocurrency</option>
                        </select>
                    </div>
                    <div style={styles.modalActions}>
                        <button type="button" style={styles.outlineButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.primaryButton}>
                            Process Withdrawal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);

const NotificationsModal = ({ notifications, onClose }) => (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
            <div style={styles.modalHeader}>
                <h2>Notifications</h2>
                <button onClick={onClose} style={styles.closeButton}>✕</button>
            </div>
            <div style={styles.modalContent}>
                <div style={styles.notificationsList}>
                    {notifications.map(notification => (
                        <div key={notification.id} style={styles.notificationItem}>
                            <div style={styles.notificationIcon}>
                                {notification.type === 'order' && '📦'}
                                {notification.type === 'message' && '💬'}
                                {notification.type === 'review' && '⭐'}
                            </div>
                            <div style={styles.notificationContent}>
                                <div style={styles.notificationMessage}>
                                    {notification.message}
                                </div>
                                <div style={styles.notificationTime}>
                                    {notification.time}
                                </div>
                            </div>
                            {!notification.read && <div style={styles.notificationDot}></div>}
                        </div>
                    ))}
                </div>
                <div style={styles.modalActions}>
                    <button style={styles.primaryButton} onClick={onClose}>
                        Mark All as Read
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const ChatInterface = ({ onClose }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
            // Set up real-time updates (WebSocket or polling)
            const interval = setInterval(() => {
                loadMessages(selectedConversation.id);
            }, 3000); // Poll every 3 seconds
            
            return () => clearInterval(interval);
        }
    }, [selectedConversation]);
      
    const loadConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://neongigs.onrender.com/api/chat/conversations', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
                if (data.length > 0 && !selectedConversation) {
                    setSelectedConversation(data[0]);
                }
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://neongigs.onrender.com/api/chat/conversations/${conversationId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // Add function to create new conversation
    const createConversation = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://neongigs.onrender.com/api/chat/conversations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    participantId: userId
                })
            });
            
            if (response.ok) {
                const newConversation = await response.json();
                setConversations(prev => [newConversation, ...prev]);
                setSelectedConversation(newConversation);
                setShowNewChat(false);
                setSearchQuery('');
                setSearchUsers([]);
            } else {
                alert('Failed to create conversation');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            alert('Error creating conversation');
        }
    };

    // Add function to search for users
    const handleSearchUsers = async (query) => {
        if (!query.trim()) {
            setSearchUsers([]);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://neongigs.onrender.com/api/users/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const users = await response.json();
                setSearchUsers(users);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    // Temporary function for testing without backend
    const createTestConversation = () => {
        const testConversation = {
            id: Date.now().toString(),
            otherUser: {
                name: 'Test User',
                userType: 'buyer'
            },
            lastMessage: {
                content: 'Hello there!',
                createdAt: new Date().toISOString()
            },
            unreadCount: 0
        };
        
        setConversations(prev => [testConversation, ...prev]);
        setSelectedConversation(testConversation);
        setShowNewChat(false);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const messageText = newMessage;
        setNewMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://neongigs.onrender.com/api/chat/conversations/${selectedConversation.id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: messageText
                })
            });
            
            if (response.ok) {
                // Message will be loaded in next poll
            } else {
                alert('Failed to send message');
                setNewMessage(messageText); // Restore message if failed
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageText); // Restore message if error
        }
    };

    if (loading) {
        return (
            <div style={styles.chatOverlay}>
                <div style={styles.chatContainer}>
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <div style={styles.spinner}></div>
                        <p>Loading messages...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.chatOverlay}>
            <div style={styles.chatContainer}>
                <div style={styles.chatHeader}>
                    <h3>💬 Messages</h3>
                    <div style={styles.chatHeaderActions}>
                        <button 
                            style={styles.primaryButton}
                            onClick={() => setShowNewChat(true)}
                        >
                            + New Chat
                        </button>
                        <button onClick={onClose} style={styles.closeButton}>✕</button>
                    </div>
                </div>
                <div style={styles.chatContent}>
                    <div style={styles.chatSidebar}>
                        <div style={styles.chatSearch}>
                            <input 
                                type="text" 
                                placeholder={showNewChat ? "Search users..." : "Search conversations..."} 
                                style={styles.chatSearchInput}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (showNewChat) {
                                        handleSearchUsers(e.target.value);
                                    }
                                }}
                            />
                        </div>
                        
                        {/* Show search results when in new chat mode */}
                        {showNewChat && (
                            <div style={styles.searchSection}>
                                <div style={styles.searchResultsHeader}>
                                    <h4>Search Users</h4>
                                    <button 
                                        style={styles.outlineButton}
                                        onClick={() => {
                                            setShowNewChat(false);
                                            setSearchQuery('');
                                            setSearchUsers([]);
                                        }}
                                    >
                                        ← Back
                                    </button>
                                </div>
                                
                                {searchUsers.length > 0 ? (
                                    <div style={styles.searchResults}>
                                        {searchUsers.map(user => (
                                            <div 
                                                key={user._id}
                                                style={styles.userResultItem}
                                                onClick={() => createConversation(user._id)}
                                            >
                                                <div style={styles.chatAvatar}>
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div style={styles.chatInfo}>
                                                    <div style={styles.chatName}>{user.name}</div>
                                                    <div style={styles.userType}>{user.userType}</div>
                                                </div>
                                                <button style={styles.startChatButton}>
                                                    Chat
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={styles.emptySearch}>
                                        <div style={styles.emptyIcon}>👤</div>
                                        <p>Search for users to start a conversation</p>
                                        <button 
                                            style={styles.outlineButton}
                                            onClick={createTestConversation}
                                        >
                                            🧪 Add Test Conversation
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Show conversations list when NOT in new chat mode */}
                        {!showNewChat && (
                            <div style={styles.chatList}>
                                {conversations.length === 0 ? (
                                    <div style={styles.emptyConversations}>
                                        <div style={styles.emptyIcon}>💬</div>
                                        <p>No conversations yet</p>
                                        <button 
                                            style={styles.primaryButton}
                                            onClick={() => setShowNewChat(true)}
                                        >
                                            Start a conversation
                                        </button>
                                    </div>
                                ) : (
                                    conversations.map(conversation => (
                                        <div 
                                            key={conversation.id}
                                            style={{
                                                ...styles.chatListItem,
                                                ...(selectedConversation?.id === conversation.id ? styles.activeChatItem : {})
                                            }}
                                            onClick={() => setSelectedConversation(conversation)}
                                        >
                                            <div style={styles.chatAvatar}>
                                                {conversation.otherUser?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div style={styles.chatInfo}>
                                                <div style={styles.chatName}>
                                                    {conversation.otherUser?.name || 'Unknown User'}
                                                </div>
                                                <div style={styles.chatPreview}>
                                                    {conversation.lastMessage?.content || 'No messages yet'}
                                                </div>
                                            </div>
                                            <div style={styles.chatMeta}>
                                                <div style={styles.chatTime}>
                                                    {conversation.lastMessage ? 
                                                        new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                        : ''
                                                    }
                                                </div>
                                                {conversation.unreadCount > 0 && (
                                                    <div style={styles.chatUnread}>
                                                        {conversation.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div style={styles.chatMain}>
                        {selectedConversation ? (
                            <>
                                <div style={styles.chatMessages}>
                                    {messages.length === 0 ? (
                                        <div style={styles.emptyChat}>
                                            <div style={styles.emptyIcon}>💬</div>
                                            <h4>No messages yet</h4>
                                            <p>Start a conversation with {selectedConversation.otherUser?.name}</p>
                                        </div>
                                    ) : (
                                        messages.map(message => (
                                            <div 
                                                key={message.id}
                                                style={{
                                                    ...styles.messageRow,
                                                    ...(message.senderId === getCurrentUserId() ? styles.messageRowRight : {})
                                                }}
                                            >
                                                <div style={{
                                                    ...styles.messageBubble,
                                                    ...(message.senderId === getCurrentUserId() ? styles.messageBubbleRight : {})
                                                }}>
                                                    <div style={styles.messageText}>{message.content}</div>
                                                    <div style={styles.messageTime}>
                                                        {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                
                                <form onSubmit={sendMessage} style={styles.chatInput}>
                                    <input 
                                        type="text" 
                                        placeholder="Type your message..." 
                                        style={styles.chatInputField}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button 
                                        type="submit" 
                                        style={styles.chatSendButton}
                                        disabled={!newMessage.trim()}
                                    >
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={styles.noConversation}>
                                <div style={styles.emptyIcon}>💬</div>
                                <h4>No conversation selected</h4>
                                <p>Select a conversation or start a new one</p>
                                <button 
                                    style={styles.primaryButton}
                                    onClick={() => setShowNewChat(true)}
                                >
                                    Start New Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to get current user ID (you'll need to implement this based on your auth system)
const getCurrentUserId = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.id;
};
// CSS Styles
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '3px solid rgba(5, 217, 232, 0.3)',
        borderTop: '3px solid #05d9e8',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },
    authContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
    },
    authContent: {
        textAlign: 'center',
        padding: '60px 40px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '400px',
        width: '90%'
    },
    authIcon: {
        fontSize: '64px',
        marginBottom: '20px'
    },
    authButtons: {
        display: 'flex',
        gap: '15px',
        marginTop: '30px',
        justifyContent: 'center'
    },
    header: {
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    nav: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#05d9e8',
        textDecoration: 'none'
    },
    logoIcon: {
        fontSize: '28px'
    },
    navActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    navLink: {
        color: '#ffffff',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
    },
    activeChatItem: {
    background: 'rgba(5, 217, 232, 0.1)',
    borderRight: '3px solid #05d9e8'
},
emptyChat: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'rgba(255, 255, 255, 0.6)'
},
noConversation: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'rgba(255, 255, 255, 0.6)'
},
emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'rgba(255, 255, 255, 0.6)',
    gridColumn: '1 / -1'
},
emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    opacity: '0.5'
},
    chatButton: {
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        border: 'none',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
    },
    logoutButton: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
    },
    hero: {
        padding: '60px 0 40px',
        background: 'linear-gradient(180deg, rgba(5, 217, 232, 0.1) 0%, transparent 100%)'
    },
    heroContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '40px',
        alignItems: 'start'
    },
    avatarSection: {
        textAlign: 'center'
    },
    avatar: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '15px',
        border: '3px solid rgba(255, 255, 255, 0.2)'
    },
    verificationBadge: {
        background: 'rgba(0, 255, 157, 0.1)',
        color: '#00ff9d',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        marginBottom: '10px',
        border: '1px solid rgba(0, 255, 157, 0.3)'
    },
    memberSince: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px'
    },
    profileInfo: {
        flex: 1
    },
    profileName: {
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '10px',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8, #00ff9d)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent'
    },
    roleBadge: {
        display: 'inline-block',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    bio: {
        fontSize: '18px',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '30px',
        maxWidth: '600px'
    },
    skillsSection: {
        marginBottom: '30px'
    },
    skillsTitle: {
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '15px',
        color: 'rgba(255, 255, 255, 0.9)'
    },
    skillsGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
    },
    skillTag: {
        background: 'rgba(5, 217, 232, 0.1)',
        color: '#05d9e8',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
        border: '1px solid rgba(5, 217, 232, 0.3)'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '20px',
        marginTop: '30px'
    },
    statCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        transition: 'all 0.3s ease'
    },
    statIcon: {
        fontSize: '24px'
    },
    statContent: {
        flex: 1
    },
    statValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    statLabel: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    quickActions: {
        padding: '40px 0',
        background: 'rgba(255, 255, 255, 0.02)'
    },
    actionsGrid: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
    },
    actionButton: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        ':hover': {
            background: 'rgba(5, 217, 232, 0.1)',
            borderColor: '#05d9e8',
            transform: 'translateY(-2px)'
        }
    },
    actionIcon: {
        fontSize: '24px'
    },
    tabsSection: {
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    tabs: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        overflowX: 'auto',
        gap: '5px'
    },
    tab: {
        background: 'transparent',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.6)',
        padding: '15px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
        borderBottom: '2px solid transparent'
    },
    activeTab: {
        color: '#05d9e8',
        borderBottomColor: '#05d9e8',
        background: 'rgba(5, 217, 232, 0.1)'
    },
    tabIcon: {
        fontSize: '16px'
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
    },
    tabContent: {
        animation: 'fadeIn 0.5s ease'
    },
    tabTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
    },
    primaryButton: {
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        border: 'none',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 15px rgba(255, 42, 109, 0.4)'
        }
    },
    outlineButton: {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        ':hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: '#05d9e8'
        }
    },
    dangerButton: {
        background: 'rgba(255, 42, 109, 0.1)',
        border: '1px solid rgba(255, 42, 109, 0.3)',
        color: '#ff2a6d',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        ':hover': {
            background: 'rgba(255, 42, 109, 0.2)',
            transform: 'translateY(-1px)'
        }
    },
    overviewGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
    },
    overviewCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    activityItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        ':hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            transform: 'translateX(5px)'
        }
    },
    activityIcon: {
        fontSize: '20px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 217, 232, 0.1)',
        borderRadius: '10px'
    },
    activityContent: {
        flex: 1
    },
    activityTitle: {
        fontWeight: '600',
        marginBottom: '5px'
    },
    activityDescription: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    activityTime: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)'
    },
    goalsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    goalItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px'
    },
    goalCheckbox: {
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        fontSize: '14px'
    },
    goalCompleted: {
        background: 'rgba(0, 255, 157, 0.2)'
    },
    goalText: {
        flex: 1,
        fontSize: '14px'
    },
    goalTextCompleted: {
        textDecoration: 'line-through',
        color: 'rgba(255, 255, 255, 0.5)'
    },
    quickStats: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    quickStat: {
        textAlign: 'center',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px'
    },
    quickStatValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    quickStatLabel: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '5px'
    },
    quickStatTrend: {
        fontSize: '12px',
        color: '#00ff9d'
    },
    recommendations: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    recommendationItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px'
    },
    recommendationText: {
        fontSize: '14px',
        flex: 1
    },
    recommendationAction: {
        background: 'rgba(5, 217, 232, 0.1)',
        border: '1px solid rgba(5, 217, 232, 0.3)',
        color: '#05d9e8',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    orderCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(5, 217, 232, 0.5)'
        }
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    orderTitle: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    statusBadge: {
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#000'
    },
    orderDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
    },
    orderDetail: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    orderPrice: {
        color: '#00ff9d',
        fontWeight: '600'
    },
    deliveryStatus: {
        color: '#05d9e8',
        fontWeight: '600'
    },
    orderActions: {
        display: 'flex',
        gap: '10px'
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px'
    },
    serviceCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-3px)',
            borderColor: 'rgba(5, 217, 232, 0.5)'
        }
    },
    serviceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },
    serviceTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    serviceStatus: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    statusActive: {
        background: 'rgba(0, 255, 157, 0.2)',
        color: '#00ff9d'
    },
    statusPaused: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    serviceDetails: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '20px'
    },
    serviceDetail: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    servicePrice: {
        color: '#00ff9d',
        fontWeight: '600'
    },
    serviceActions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    earningsOverview: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
    },
    earningsCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
    },
    earningsAmount: {
        fontSize: '36px',
        fontWeight: 'bold',
        margin: '15px 0 10px',
        background: 'linear-gradient(45deg, #00ff9d, #05d9e8)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent'
    },
    earningsTrend: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    earningsChart: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '40px'
    },
    chartBars: {
        display: 'flex',
        alignItems: 'end',
        gap: '20px',
        height: '200px',
        marginTop: '30px'
    },
    chartBarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    },
    chartBar: {
        background: 'linear-gradient(to top, #ff2a6d, #05d9e8)',
        width: '30px',
        borderRadius: '5px 5px 0 0',
        transition: 'all 0.3s ease'
    },
    chartLabel: {
        marginTop: '10px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    chartValue: {
        marginTop: '5px',
        fontSize: '12px',
        fontWeight: '600'
    },
    withdrawalSection: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    withdrawalOptions: {
        display: 'flex',
        gap: '15px',
        marginTop: '20px',
        flexWrap: 'wrap'
    },
    withdrawalButton: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        flex: '1',
        minWidth: '120px',
        ':hover': {
            background: 'rgba(5, 217, 232, 0.1)',
            borderColor: '#05d9e8',
            transform: 'translateY(-2px)'
        }
    },
    analyticsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
    },
    analyticsCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    metric: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    metricValue: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#00ff9d'
    },
    ratingBreakdown: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px'
    },
    ratingBarContainer: {
        flex: 1,
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    ratingBar: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.3s ease'
    },
    satisfactionScore: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    scoreCircle: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
    },
    scoreValue: {
        fontSize: '24px',
        fontWeight: 'bold'
    },
    scoreLabel: {
        fontSize: '12px',
        opacity: '0.8'
    },
    satisfactionMetrics: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    satisfactionMetric: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px'
    },
    trendItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    positiveTrend: {
        color: '#00ff9d',
        fontWeight: '600'
    },
    negativeTrend: {
        color: '#ff2a6d',
        fontWeight: '600'
    },
    favoritesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
    },
    favoriteCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-3px)',
            borderColor: 'rgba(255, 42, 109, 0.5)'
        }
    },
    favoriteHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px'
    },
    sellerAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    sellerName: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    sellerRating: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    sellerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '20px'
    },
    sellerStat: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    favoriteActions: {
        display: 'flex',
        gap: '10px'
    },
    trackingList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    trackingCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(5, 217, 232, 0.5)'
        }
    },
    trackingHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    trackingTitle: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    trackingSeller: {
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '20px'
    },
    progressContainer: {
        marginBottom: '20px'
    },
    progressLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '14px'
    },
    progressBar: {
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.3s ease'
    },
    trackingMeta: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
    },
    trackingMetaItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    trackingActions: {
        display: 'flex',
        gap: '10px'
    },
    reviewFormCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '30px'
    },
    reviewForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)'
    },
    input: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        ':focus': {
            outline: 'none',
            borderColor: '#05d9e8',
            boxShadow: '0 0 0 2px rgba(5, 217, 232, 0.2)'
        }
    },
    textarea: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        resize: 'vertical',
        minHeight: '80px',
        transition: 'all 0.3s ease',
        ':focus': {
            outline: 'none',
            borderColor: '#05d9e8',
            boxShadow: '0 0 0 2px rgba(5, 217, 232, 0.2)'
        }
    },
    ratingSelector: {
        display: 'flex',
        gap: '5px'
    },
    ratingStar: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        padding: '5px'
    },
    reviewsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    reviewCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px'
    },
    reviewerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    searchSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
},
searchResultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.03)'
},
emptySearch: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'rgba(255, 255, 255, 0.6)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
},
    reviewerAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    reviewerName: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    reviewMeta: {
        display: 'flex',
        gap: '15px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    reviewRating: {
        fontSize: '16px'
    },
    reviewComment: {
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.8)'
    },
    portfolioGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px'
    },
    portfolioCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-3px)',
            borderColor: 'rgba(5, 217, 232, 0.5)'
        }
    },
    portfolioImage: {
        height: '200px',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px'
    },
    portfolioContent: {
        padding: '20px'
    },
    portfolioTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '8px'
    },
    portfolioCategory: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '15px'
    },
    portfolioActions: {
        display: 'flex',
        gap: '10px'
    },
    projectsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    projectCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    projectMeta: {
        display: 'flex',
        gap: '20px',
        marginTop: '15px',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    settingsForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
    },
    settingsSection: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    checkboxGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        cursor: 'pointer'
    },
    settingsActions: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'flex-end'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modal: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '25px 30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        color: '#ffffff',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '5px',
        borderRadius: '5px',
        transition: 'all 0.3s ease',
        ':hover': {
            background: 'rgba(255, 255, 255, 0.1)'
        }
    },
    modalContent: {
        padding: '30px'
    },
    modalActions: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'flex-end',
        marginTop: '25px'
    },
    withdrawInfo: {
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px'
    },
    withdrawAmount: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '16px'
    },
    amount: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#00ff9d'
    },
    notificationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxHeight: '400px',
        overflowY: 'auto'
    },
    notificationItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px',
        position: 'relative'
    },
    notificationIcon: {
        fontSize: '20px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 217, 232, 0.1)',
        borderRadius: '10px'
    },
    notificationContent: {
        flex: 1
    },
    notificationMessage: {
        fontWeight: '600',
        marginBottom: '5px'
    },
    notificationTime: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    notificationDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#ff2a6d',
        position: 'absolute',
        top: '15px',
        right: '15px'
    },
 chatOverlay: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
},
    chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
},
    chatHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
   chatContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'row'
}, chatSidebar: {
    width: '350px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    background: 'rgba(255, 255, 255, 0.03)'
},
    chatSearch: {
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    chatSearchInput: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px'
    },
    chatList: {
        flex: 1,
        overflowY: 'auto'
    },
    chatListItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            background: 'rgba(255, 255, 255, 0.05)'
        }
    },
    chatAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    chatInfo: {
        flex: 1
    },
    chatName: {
        fontWeight: '600',
        marginBottom: '5px'
    },
    chatPreview: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    chatMeta: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '5px'
    },
    chatTime: {
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.5)'
    },
    chatUnread: {
        background: '#ff2a6d',
        color: 'white',
        fontSize: '10px',
        padding: '2px 6px',
        borderRadius: '10px',
        minWidth: '18px',
        textAlign: 'center'
    },
 chatMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    background: 'rgba(255, 255, 255, 0.02)'
},
    chatMessages: {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: 'rgba(255, 255, 255, 0.01)'
},
    messageRow: {
        display: 'flex'
    },
    messageRowRight: {
        justifyContent: 'flex-end'
    },
    messageBubble: {
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '12px 16px',
        borderRadius: '18px',
        maxWidth: '70%',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    messageBubbleRight: {
        background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
        border: 'none'
    },
   messageText: {
    marginBottom: '5px',
    lineHeight: '1.4',
    color: '#ffffff' // Add this to ensure text is visible
},
    messageTime: {
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'right'
    },
   chatInput: {
    display: 'flex',
    gap: '15px',
    padding: '25px 30px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.03)'
},
   chatInputField: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: '15px 20px',
    borderRadius: '12px',
    fontSize: '16px',
    minHeight: '50px'
},
chatSendButton: {
    background: 'linear-gradient(45deg, #ff2a6d, #05d9e8)',
    border: 'none',
    color: 'white',
    padding: '15px 25px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    minWidth: '100px'
},chatHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
},
searchResults: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    maxHeight: '200px',
    overflowY: 'auto'
},
searchResultsHeader: {
    padding: '10px 15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    fontWeight: '600'
},
userResultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
},
userType: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize'
},
startChatButton: {
    background: 'rgba(5, 217, 232, 0.2)',
    border: '1px solid rgba(5, 217, 232, 0.3)',
    color: '#05d9e8',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    cursor: 'pointer',
    marginLeft: 'auto'
},
emptyConversations: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'rgba(255, 255, 255, 0.6)'
}
};

// Add CSS animations
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

