import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://neongigs.onrender.com/api';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    const navigate = useNavigate();

    // Mock data with detailed information
    const [adminData, setAdminData] = useState({
        stats: {
            totalUsers: 1247,
            pendingFreelancers: 23,
            totalGigs: 456,
            reportedReviews: 12,
            revenue: 45230,
            bannedUsers: 8,
            activeGigs: 389,
            suspendedGigs: 67
        },
        pendingFreelancers: [
            {
                id: 1,
                name: 'John Designer',
                email: 'john.designer@example.com',
                phone: '+1 (555) 123-4567',
                skills: ['Logo Design', 'Branding', 'Illustration', 'UI/UX Design'],
                experience: '3-5 years',
                portfolio: 'https://johndesignerportfolio.com',
                resume: 'john_designer_resume.pdf',
                appliedDate: '2024-01-15',
                status: 'pending',
                bio: 'Creative graphic designer with 4 years of experience in branding and digital design. Specialized in creating memorable visual identities for startups and established brands.',
                education: 'BFA in Graphic Design - Design University',
                languages: ['English', 'Spanish'],
                hourlyRate: 45,
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                previousWork: [
                    'Brand identity for TechStart Inc.',
                    'Mobile app UI for HealthTrack',
                    'Packaging design for OrganicFoods'
                ]
            }
        ],
        approvedFreelancers: [
            {
                id: 3,
                name: 'Mike Writer',
                email: 'mike.writer@example.com',
                phone: '+1 (555) 456-7890',
                skills: ['Content Writing', 'Copywriting', 'Technical Writing', 'SEO'],
                experience: '5+ years',
                portfolio: 'https://mikewriterportfolio.com',
                resume: 'mike_writer_resume.pdf',
                approvedDate: '2024-01-10',
                status: 'approved',
                bio: 'Professional writer with over 5 years of experience in content creation and digital marketing. Specialized in tech and business content.',
                education: 'MA in Journalism - Media College',
                languages: ['English', 'German'],
                hourlyRate: 50,
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                previousWork: [
                    'Content strategy for SaaS company',
                    'Blog articles for MarketingPro',
                    'Technical documentation for DevTools'
                ],
                rating: 4.9,
                completedProjects: 47,
                responseTime: '2 hours'
            }
        ],
        reportedReviews: [
            {
                id: 1,
                reviewId: 101,
                userName: 'Client123',
                userEmail: 'client123@example.com',
                freelancerName: 'Mike Writer',
                freelancerId: 3,
                reason: 'Inappropriate content',
                reviewContent: 'This freelancer was unprofessional and delivered low-quality work.',
                rating: 1,
                reportedDate: '2024-01-15',
                status: 'pending',
                orderDetails: {
                    orderId: 'ORD-2024-001',
                    service: 'Blog Article Writing',
                    amount: 120,
                    orderDate: '2024-01-05',
                    deliveryDate: '2024-01-12'
                },
                reporterComments: 'The content appears to be copied from other sources.'
            }
        ],
        users: [
            {
                id: 1,
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                phone: '+1 (555) 111-2222',
                type: 'buyer',
                joinDate: '2024-01-01',
                status: 'active',
                reports: 0,
                totalOrders: 12,
                totalSpent: 1250,
                lastActive: '2024-01-15',
                avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
                location: 'New York, USA',
                verified: true,
                paymentMethods: ['Credit Card', 'PayPal']
            }
        ],
        gigs: [
            {
                id: 1,
                title: 'Professional Logo Design',
                seller: 'Mike Writer',
                sellerId: 3,
                price: 50,
                category: 'Graphics & Design',
                subcategory: 'Logo Design',
                status: 'active',
                createdAt: '2024-01-10',
                orders: 15,
                rating: 4.9,
                description: 'I will design a professional and unique logo for your brand.',
                tags: ['logo', 'branding', 'business'],
                deliveryTime: '3 days',
                revisions: 'Unlimited',
                images: [
                    'https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                features: ['Source File', 'Vector File', 'Printable File']
            }
        ]
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userData') || 'null');
        if (user && user.isLoggedIn) {
            setIsLoggedIn(true);
            setUserData(user);
            setIsAdmin(user.email === 'admin@neongigs.com' || user.isAdmin);
            
            // Fetch pending freelancers on mount if admin
            if (user.email === 'admin@neongigs.com' || user.isAdmin) {
                fetchPendingFreelancers();
            }
        } else {
            setIsLoggedIn(false);
            setUserData(null);
            setIsAdmin(false);
        }
    }, []);

    // Poll pending freelancers every 5 seconds while admin is active
    useEffect(() => {
        let intervalId = null;
        if (isAdmin) {
            // initial fetch
            fetchPendingFreelancers();
            intervalId = setInterval(() => {
                fetchPendingFreelancers();
            }, 5000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isAdmin]);

    // Fetch pending freelancers from API
    const fetchPendingFreelancers = async () => {
        try {
            const response = await axios.get(`${API_URL}/freelancers/pending`);
            if (response.data.success) {
                setAdminData(prev => ({
                    ...prev,
                    pendingFreelancers: response.data.freelancers.map(freelancer => ({
                        id: freelancer._id,
                        name: freelancer.name,
                        email: freelancer.email,
                        phone: freelancer.phone || 'N/A',
                        skills: freelancer.skills || [],
                        experience: freelancer.experience || 'N/A',
                        portfolio: freelancer.portfolio || 'N/A',
                        appliedDate: new Date(freelancer.createdAt).toISOString().split('T')[0],
                        status: freelancer.status,
                        bio: freelancer.bio || 'No bio provided',
                        hourlyRate: freelancer.hourlyRate || 0,
                        avatar: freelancer.profileImage || 'https://via.placeholder.com/150',
                        category: freelancer.category || 'General',
                        languages: freelancer.languages || [],
                        location: freelancer.location || 'N/A'
                    })),
                    stats: {
                        ...prev.stats,
                        pendingFreelancers: response.data.count
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching pending freelancers:', error);
        }
    };

    // Modal handlers
    const openFreelancerModal = (freelancer, action) => {
        setModalData({ ...freelancer, action });
        setActiveModal('freelancer');
    };

    const openUserModal = (user, action) => {
        setModalData({ ...user, action });
        setActiveModal('user');
    };

    const openReviewModal = (review, action) => {
        setModalData({ ...review, action });
        setActiveModal('review');
    };

    const openGigModal = (gig, action) => {
        setModalData({ ...gig, action });
        setActiveModal('gig');
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    // Action handlers
    const approveFreelancer = async (freelancerId) => {
        try {
            const freelancer = adminData.pendingFreelancers.find(f => f.id === freelancerId);
            
            // Prepare service data from freelancer info
            const serviceData = {
                serviceTitle: `Professional ${freelancer.category || 'Services'}`,
                serviceDescription: freelancer.bio || `Expert ${freelancer.category} services by ${freelancer.name}`,
                servicePrice: freelancer.hourlyRate || 50,
                deliveryTime: 7
            };

            const response = await axios.put(`${API_URL}/freelancers/${freelancerId}/approve`, serviceData);
            
            if (response.data.success) {
                showNotification('Freelancer approved and service created successfully!', 'success');
                // Refresh the pending freelancers list
                fetchPendingFreelancers();
            }
        } catch (error) {
            console.error('Error approving freelancer:', error);
            showNotification('Error approving freelancer. Please try again.', 'error');
        }
        closeModal();
    };

    const rejectFreelancer = async (freelancerId, reason) => {
        try {
            const response = await axios.put(`${API_URL}/freelancers/${freelancerId}/reject`);
            
            if (response.data.success) {
                showNotification('Freelancer application rejected.', 'warning');
                // Refresh the pending freelancers list
                fetchPendingFreelancers();
            }
        } catch (error) {
            console.error('Error rejecting freelancer:', error);
            showNotification('Error rejecting freelancer. Please try again.', 'error');
        }
        closeModal();
    };

    const banUser = (userId, reason) => {
        const updatedData = {...adminData};
        const user = updatedData.users.find(u => u.id === userId);
        if (user) {
            user.status = user.status === 'banned' ? 'active' : 'banned';
            if (user.status === 'banned') {
                user.banReason = reason;
                user.banDate = new Date().toISOString().split('T')[0];
            } else {
                user.banReason = '';
                user.banDate = '';
            }
            setAdminData(updatedData);
            showNotification(user.status === 'banned' ? 'User banned successfully!' : 'User unbanned successfully!', user.status === 'banned' ? 'warning' : 'success');
        }
        closeModal();
    };

    const resolveReviewReport = (reportId, action) => {
        const updatedData = {...adminData};
        updatedData.reportedReviews = updatedData.reportedReviews.filter(r => r.id !== reportId);
        setAdminData(updatedData);
        showNotification(action === 'remove' ? 'Review removed successfully!' : 'Review report dismissed.', action === 'remove' ? 'warning' : 'success');
        closeModal();
    };

    const toggleGigStatus = (gigId, reason) => {
        const updatedData = {...adminData};
        const gig = updatedData.gigs.find(g => g.id === gigId);
        if (gig) {
            gig.status = gig.status === 'active' ? 'suspended' : 'active';
            if (gig.status === 'suspended') {
                gig.suspensionReason = reason;
            } else {
                gig.suspensionReason = '';
            }
            setAdminData(updatedData);
            showNotification(gig.status === 'suspended' ? 'Gig suspended!' : 'Gig activated!', gig.status === 'suspended' ? 'warning' : 'success');
        }
        closeModal();
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(45deg, var(--neon-green), var(--neon-blue))' : 
                         type === 'warning' ? 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))' : 
                         'linear-gradient(45deg, var(--neon-blue), var(--neon-purple))'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 0 20px ${type === 'success' ? 'rgba(0, 255, 157, 0.5)' : 
                              type === 'warning' ? 'rgba(255, 42, 109, 0.5)' : 
                              'rgba(5, 217, 232, 0.5)'};
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            border: 1px solid ${type === 'success' ? 'var(--neon-green)' : 
                             type === 'warning' ? 'var(--neon-pink)' : 
                             'var(--neon-blue)'};
            max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setUserData(null);
        setIsAdmin(false);
        navigate('/');
    };

    // Admin authentication check
    if (!isLoggedIn || !isAdmin) {
        return (
            <div style={styles.authRequired}>
                <div className="container">
                    <div style={styles.authContent}>
                        <i className="fas fa-lock" style={styles.authIcon}></i>
                        <h2 style={styles.authTitle}>Admin Access Required</h2>
                        <p style={styles.authText}>You need administrator privileges to access this portal.</p>
                        <div style={styles.authButtons}>
                            <Link to="/signin" className="btn btn-primary">Sign In</Link>
                            <Link to="/" className="btn btn-outline">Back to Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return <DashboardSection data={adminData} />;
            case 'freelancers':
                return <FreelancersSection 
                    data={adminData} 
                    onOpenModal={openFreelancerModal}
                />;
            case 'users':
                return <UsersSection 
                    data={adminData} 
                    onOpenModal={openUserModal}
                />;
            case 'reviews':
                return <ReviewsSection 
                    data={adminData} 
                    onOpenModal={openReviewModal}
                />;
            case 'gigs':
                return <GigsSection 
                    data={adminData} 
                    onOpenModal={openGigModal}
                />;
            default:
                return <DashboardSection data={adminData} />;
        }
    };

    return (
        <div style={styles.adminPortal}>
            <style>{`
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
                }
                @keyframes logoGlow {
                    0% { text-shadow: 0 0 10px var(--neon-blue); }
                    100% { text-shadow: 0 0 20px var(--neon-blue), 0 0 30px rgba(5, 217, 232, 0.5); }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `}</style>

            {/* Header */}
            <header style={styles.header}>
                <div style={styles.navbar}>
                    <Link to="/" style={styles.logo}>
                        <i className="fas fa-bolt" style={styles.logoIcon}></i>
                        NeonGigs Admin
                    </Link>
                    <div style={styles.headerActions}>
                        <Link to="/" style={styles.backButton}>
                            <i className="fas fa-arrow-left"></i> Back to Home
                        </Link>
                        <div style={styles.userInfo}>
                            <div style={styles.userAvatar}>
                                {userData?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <span style={styles.userName}>{userData?.name || 'Admin'}</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={styles.tabsContainer}>
                <div style={styles.tabs}>
                    {[
                        { id: 'dashboard', icon: 'chart-bar', label: 'Dashboard' },
                        { id: 'freelancers', icon: 'user-check', label: `Freelancers (${adminData.pendingFreelancers.length})` },
                        { id: 'users', icon: 'users', label: 'Users' },
                        { id: 'reviews', icon: 'flag', label: `Reports (${adminData.reportedReviews.length})` },
                        { id: 'gigs', icon: 'briefcase', label: 'Gigs' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            style={{
                                ...styles.tab,
                                ...(activeTab === tab.id ? styles.tabActive : {})
                            }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={`fas fa-${tab.icon}`} style={styles.tabIcon}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main style={styles.mainContent}>
                <div style={styles.container}>
                    {renderContent()}
                </div>
            </main>

            {/* Modals */}
            {activeModal === 'freelancer' && (
                <FreelancerModal 
                    data={modalData} 
                    onClose={closeModal}
                    onApprove={approveFreelancer}
                    onReject={rejectFreelancer}
                />
            )}
        </div>
    );
}

// Styles
const styles = {
    adminPortal: {
        minHeight: '100vh',
        background: 'var(--dark-bg)',
        color: 'var(--light-text)',
        backgroundImage: `radial-gradient(circle at 10% 20%, rgba(255, 42, 109, 0.1) 0%, transparent 20%),
                         radial-gradient(circle at 90% 30%, rgba(5, 217, 232, 0.1) 0%, transparent 25%),
                         radial-gradient(circle at 50% 80%, rgba(211, 0, 197, 0.1) 0%, transparent 30%)`
    },
    authRequired: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--dark-bg)',
        color: 'var(--light-text)'
    },
    authContent: {
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--card-bg)',
        borderRadius: '20px',
        border: '1px solid var(--neon-blue)',
        boxShadow: '0 0 30px rgba(5, 217, 232, 0.3)',
        maxWidth: '500px'
    },
    authIcon: {
        fontSize: '4rem',
        color: 'var(--neon-pink)',
        marginBottom: '1rem'
    },
    authTitle: {
        fontSize: '2.5rem',
        background: 'linear-gradient(90deg, var(--neon-pink), var(--neon-blue))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
    },
    authText: {
        fontSize: '1.2rem',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '2rem'
    },
    authButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
    },
    header: {
        background: 'rgba(13, 2, 33, 0.95)',
        boxShadow: '0 2px 20px rgba(5, 217, 232, 0.2)',
        borderBottom: '1px solid var(--neon-blue)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 2rem'
    },
    logo: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--neon-blue)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Montserrat, sans-serif',
        textShadow: '0 0 10px var(--neon-blue)',
        animation: 'logoGlow 2s infinite alternate'
    },
    logoIcon: {
        marginRight: '0.5rem',
        color: 'var(--neon-pink)'
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
    },
    backButton: {
        padding: '0.75rem 1.5rem',
        background: 'transparent',
        color: 'var(--neon-blue)',
        border: '2px solid var(--neon-blue)',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    userAvatar: {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-blue))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        border: '2px solid var(--neon-blue)'
    },
    userName: {
        color: 'var(--neon-green)',
        fontWeight: '600'
    },
    logoutBtn: {
        background: 'var(--neon-pink)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.75rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    tabsContainer: {
        background: 'rgba(5, 217, 232, 0.1)',
        borderBottom: '1px solid var(--neon-blue)'
    },
    tabs: {
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        gap: '0.5rem',
        overflowX: 'auto'
    },
    tab: {
        padding: '1rem 1.5rem',
        background: 'transparent',
        border: 'none',
        color: 'var(--light-text)',
        cursor: 'pointer',
        borderRadius: '8px 8px 0 0',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        fontSize: '0.9rem'
    },
    tabActive: {
        background: 'var(--neon-blue)',
        color: 'var(--dark-bg)',
        boxShadow: '0 -2px 10px rgba(5, 217, 232, 0.3)'
    },
    tabIcon: {
        fontSize: '1rem'
    },
    mainContent: {
        padding: '2rem 0'
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
    }
};

// Component Sections
function DashboardSection({ data }) {
    return (
        <div>
            <h2 style={sectionStyles.sectionTitle}>Admin Dashboard</h2>
            <div style={sectionStyles.statsGrid}>
                <div style={sectionStyles.statCard}>
                    <div style={{...sectionStyles.statIcon, background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))'}}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div style={sectionStyles.statInfo}>
                        <h3 style={sectionStyles.statNumber}>{data.stats.totalUsers}</h3>
                        <p style={sectionStyles.statLabel}>Total Users</p>
                    </div>
                </div>
                <div style={sectionStyles.statCard}>
                    <div style={{...sectionStyles.statIcon, background: 'linear-gradient(45deg, var(--neon-blue), var(--neon-green))'}}>
                        <i className="fas fa-user-check"></i>
                    </div>
                    <div style={sectionStyles.statInfo}>
                        <h3 style={sectionStyles.statNumber}>{data.stats.pendingFreelancers}</h3>
                        <p style={sectionStyles.statLabel}>Pending Freelancers</p>
                    </div>
                </div>
                <div style={sectionStyles.statCard}>
                    <div style={{...sectionStyles.statIcon, background: 'linear-gradient(45deg, var(--neon-purple), var(--neon-pink))'}}>
                        <i className="fas fa-briefcase"></i>
                    </div>
                    <div style={sectionStyles.statInfo}>
                        <h3 style={sectionStyles.statNumber}>{data.stats.totalGigs}</h3>
                        <p style={sectionStyles.statLabel}>Total Gigs</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FreelancersSection({ data, onOpenModal }) {
    return (
        <div>
            <h2 style={sectionStyles.sectionTitle}>Freelancer Management</h2>
            
            <div style={sectionStyles.section}>
                <h3 style={sectionStyles.subsectionTitle}>
                    <i className="fas fa-clock" style={{color: 'var(--neon-yellow)', marginRight: '0.5rem'}}></i>
                    Pending Applications ({data.pendingFreelancers.length})
                </h3>
                {data.pendingFreelancers.length === 0 ? (
                    <div style={sectionStyles.emptyState}>
                        <i className="fas fa-check-circle" style={sectionStyles.emptyIcon}></i>
                        <p>No pending applications</p>
                    </div>
                ) : (
                    <div style={sectionStyles.tableContainer}>
                        <table style={sectionStyles.table}>
                            <thead>
                                <tr>
                                    <th style={sectionStyles.th}>Applicant</th>
                                    <th style={sectionStyles.th}>Category</th>
                                    <th style={sectionStyles.th}>Skills</th>
                                    <th style={sectionStyles.th}>Hourly Rate</th>
                                    <th style={sectionStyles.th}>Applied</th>
                                    <th style={sectionStyles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.pendingFreelancers.map(freelancer => (
                                    <tr key={freelancer.id} style={sectionStyles.tr}>
                                        <td style={sectionStyles.td}>
                                            <div style={sectionStyles.userCell}>
                                                <img src={freelancer.avatar} alt={freelancer.name} style={sectionStyles.avatar} />
                                                <div>
                                                    <div style={sectionStyles.userName}>{freelancer.name}</div>
                                                    <div style={sectionStyles.userEmail}>{freelancer.email}</div>
                                                    <div style={sectionStyles.userEmail}>{freelancer.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={sectionStyles.td}>
                                            <span style={{
                                                background: 'rgba(211, 0, 197, 0.2)',
                                                color: 'var(--neon-purple)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                border: '1px solid var(--neon-purple)',
                                                display: 'inline-block'
                                            }}>
                                                {freelancer.category}
                                            </span>
                                        </td>
                                        <td style={sectionStyles.td}>
                                            <div style={sectionStyles.skills}>
                                                {freelancer.skills.slice(0, 3).map(skill => (
                                                    <span key={skill} style={sectionStyles.skillTag}>{skill}</span>
                                                ))}
                                                {freelancer.skills.length > 3 && (
                                                    <span style={{...sectionStyles.skillTag, opacity: 0.6}}>
                                                        +{freelancer.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={sectionStyles.td}>
                                            <div style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                color: 'var(--neon-green)'
                                            }}>
                                                ₹{freelancer.hourlyRate}/hr
                                            </div>
                                        </td>
                                        <td style={sectionStyles.td}>
                                            <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem'}}>
                                                {freelancer.appliedDate}
                                            </div>
                                        </td>
                                        <td style={sectionStyles.td}>
                                            <div style={sectionStyles.actionButtons}>
                                                <button 
                                                    style={{
                                                        ...sectionStyles.btnSuccess,
                                                        background: 'linear-gradient(45deg, var(--neon-green), var(--neon-blue))',
                                                        color: 'white',
                                                        padding: '0.75rem 1.5rem',
                                                        fontSize: '0.95rem',
                                                        boxShadow: '0 0 15px rgba(0, 255, 157, 0.3)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onClick={() => onOpenModal(freelancer, 'approve')}
                                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                                >
                                                    <i className="fas fa-user-check"></i> Review & Approve
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersSection({ data, onOpenModal }) {
    return (
        <div>
            <h2 style={sectionStyles.sectionTitle}>User Management</h2>
            <div style={sectionStyles.tableContainer}>
                <table style={sectionStyles.table}>
                    <thead>
                        <tr>
                            <th style={sectionStyles.th}>User</th>
                            <th style={sectionStyles.th}>Type</th>
                            <th style={sectionStyles.th}>Join Date</th>
                            <th style={sectionStyles.th}>Status</th>
                            <th style={sectionStyles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.users.map(user => (
                            <tr key={user.id} style={sectionStyles.tr}>
                                <td style={sectionStyles.td}>
                                    <div style={sectionStyles.userCell}>
                                        <img src={user.avatar} alt={user.name} style={sectionStyles.avatar} />
                                        <div>
                                            <div style={sectionStyles.userName}>{user.name}</div>
                                            <div style={sectionStyles.userEmail}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={sectionStyles.td}>
                                    <span style={{
                                        ...sectionStyles.badge,
                                        background: user.type === 'buyer' ? 'var(--neon-blue)' : 'var(--neon-purple)'
                                    }}>
                                        {user.type}
                                    </span>
                                </td>
                                <td style={sectionStyles.td}>{user.joinDate}</td>
                                <td style={sectionStyles.td}>
                                    <span style={{
                                        ...sectionStyles.status,
                                        background: user.status === 'active' ? 'var(--neon-green)' : 'var(--neon-pink)'
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={sectionStyles.td}>
                                    <div style={sectionStyles.actionButtons}>
                                        <button 
                                            style={sectionStyles.btnInfo}
                                            onClick={() => onOpenModal(user, 'view')}
                                        >
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ReviewsSection({ data, onOpenModal }) {
    return (
        <div>
            <h2 style={sectionStyles.sectionTitle}>Review Reports</h2>
            {data.reportedReviews.length === 0 ? (
                <div style={sectionStyles.emptyState}>
                    <i className="fas fa-flag" style={sectionStyles.emptyIcon}></i>
                    <p>No reported reviews</p>
                </div>
            ) : (
                <div style={sectionStyles.tableContainer}>
                    <table style={sectionStyles.table}>
                        <thead>
                            <tr>
                                <th style={sectionStyles.th}>Report Details</th>
                                <th style={sectionStyles.th}>Review Content</th>
                                <th style={sectionStyles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.reportedReviews.map(review => (
                                <tr key={review.id} style={sectionStyles.tr}>
                                    <td style={sectionStyles.td}>
                                        <div style={sectionStyles.reportInfo}>
                                            <div><strong>Report #{review.reviewId}</strong></div>
                                            <div>By: {review.userName}</div>
                                            <div>Freelancer: {review.freelancerName}</div>
                                        </div>
                                    </td>
                                    <td style={sectionStyles.td}>
                                        <div style={sectionStyles.reviewContent}>
                                            {review.reviewContent}
                                        </div>
                                    </td>
                                    <td style={sectionStyles.td}>
                                        <div style={sectionStyles.actionButtons}>
                                            <button 
                                                style={sectionStyles.btnInfo}
                                                onClick={() => onOpenModal(review, 'view')}
                                            >
                                                <i className="fas fa-search"></i> Investigate
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function GigsSection({ data, onOpenModal }) {
    return (
        <div>
            <h2 style={sectionStyles.sectionTitle}>Gig Management</h2>
            <div style={sectionStyles.tableContainer}>
                <table style={sectionStyles.table}>
                    <thead>
                        <tr>
                            <th style={sectionStyles.th}>Gig Details</th>
                            <th style={sectionStyles.th}>Seller</th>
                            <th style={sectionStyles.th}>Price</th>
                            <th style={sectionStyles.th}>Status</th>
                            <th style={sectionStyles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.gigs.map(gig => (
                            <tr key={gig.id} style={sectionStyles.tr}>
                                <td style={sectionStyles.td}>
                                    <div style={sectionStyles.gigInfo}>
                                        <div style={sectionStyles.gigTitle}>{gig.title}</div>
                                    </div>
                                </td>
                                <td style={sectionStyles.td}>
                                    <div style={sectionStyles.sellerInfo}>
                                        <div style={sectionStyles.userName}>{gig.seller}</div>
                                    </div>
                                </td>
                                <td style={sectionStyles.td}>
                                    <div style={sectionStyles.price}>${gig.price}</div>
                                </td>
                                <td style={sectionStyles.td}>
                                    <span style={{
                                        ...sectionStyles.status,
                                        background: gig.status === 'active' ? 'var(--neon-green)' : 'var(--neon-yellow)'
                                    }}>
                                        {gig.status}
                                    </span>
                                </td>
                                <td style={sectionStyles.td}>
                                    <div style={sectionStyles.actionButtons}>
                                        <button 
                                            style={sectionStyles.btnInfo}
                                            onClick={() => onOpenModal(gig, 'view')}
                                        >
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Section Styles
const sectionStyles = {
    sectionTitle: {
        fontSize: '2.5rem',
        background: 'linear-gradient(90deg, var(--neon-pink), var(--neon-blue))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '2rem',
        fontWeight: '700'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    statCard: {
        background: 'var(--card-bg)',
        borderRadius: '15px',
        padding: '2rem',
        border: '1px solid rgba(5, 217, 232, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        transition: 'all 0.3s ease'
    },
    statIcon: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        color: 'var(--dark-bg)',
        fontWeight: 'bold'
    },
    statInfo: {
        flex: 1
    },
    statNumber: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'var(--neon-green)',
        margin: '0.5rem 0'
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.1rem'
    },
    section: {
        marginBottom: '3rem'
    },
    subsectionTitle: {
        fontSize: '1.5rem',
        color: 'var(--neon-blue)',
        marginBottom: '1.5rem'
    },
    tableContainer: {
        background: 'var(--card-bg)',
        borderRadius: '15px',
        border: '1px solid rgba(5, 217, 232, 0.3)',
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        padding: '1.5rem',
        background: 'rgba(5, 217, 232, 0.2)',
        color: 'var(--neon-blue)',
        fontWeight: '600',
        textAlign: 'left',
        borderBottom: '1px solid rgba(5, 217, 232, 0.3)'
    },
    tr: {
        borderBottom: '1px solid rgba(5, 217, 232, 0.1)'
    },
    td: {
        padding: '1.5rem',
        verticalAlign: 'top'
    },
    userCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid var(--neon-blue)'
    },
    userName: {
        fontWeight: '600',
        color: 'var(--light-text)',
        marginBottom: '0.25rem'
    },
    userEmail: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem'
    },
    skills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
    },
    skillTag: {
        background: 'rgba(5, 217, 232, 0.2)',
        color: 'var(--neon-blue)',
        padding: '0.25rem 0.75rem',
        borderRadius: '15px',
        fontSize: '0.8rem',
        fontWeight: '600',
        border: '1px solid var(--neon-blue)'
    },
    badge: {
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.8rem'
    },
    status: {
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        color: 'var(--dark-bg)',
        fontWeight: '600',
        fontSize: '0.8rem'
    },
    actionButtons: {
        display: 'flex',
        gap: '0.5rem'
    },
    btnSuccess: {
        background: 'var(--neon-green)',
        color: 'var(--dark-bg)',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    btnInfo: {
        background: 'var(--neon-blue)',
        color: 'var(--dark-bg)',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    emptyIcon: {
        fontSize: '3rem',
        color: 'var(--neon-blue)',
        marginBottom: '1rem',
        opacity: '0.5'
    },
    reportInfo: {
        fontSize: '0.9rem'
    },
    reviewContent: {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.9rem'
    },
    gigInfo: {
        maxWidth: '250px'
    },
    gigTitle: {
        fontWeight: '600',
        color: 'var(--light-text)',
        marginBottom: '0.5rem'
    },
    sellerInfo: {
        fontSize: '0.9rem'
    },
    price: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'var(--neon-green)'
    }
};

// Freelancer Modal Component
function FreelancerModal({ data, onClose, onApprove, onReject }) {
    const [rejectionReason, setRejectionReason] = useState('');

    const handleApprove = () => {
        onApprove(data.id);
    };

    const handleReject = () => {
        if (window.confirm('Are you sure you want to reject this freelancer application?')) {
            onReject(data.id, rejectionReason);
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.title}>
                        <i className="fas fa-user-check" style={{marginRight: '0.5rem'}}></i>
                        Freelancer Application Review
                    </h2>
                    <button onClick={onClose} style={modalStyles.closeButton}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div style={modalStyles.content}>
                    <div style={modalStyles.profileSection}>
                        <div style={modalStyles.profileHeader}>
                            <img src={data.avatar} alt={data.name} style={modalStyles.profileAvatar} />
                            <div style={modalStyles.profileInfo}>
                                <h3 style={modalStyles.profileName}>{data.name}</h3>
                                <p style={modalStyles.profileEmail}>
                                    <i className="fas fa-envelope" style={{marginRight: '0.5rem'}}></i>
                                    {data.email}
                                </p>
                                <p style={modalStyles.profilePhone}>
                                    <i className="fas fa-phone" style={{marginRight: '0.5rem'}}></i>
                                    {data.phone}
                                </p>
                                {data.location && data.location !== 'N/A' && (
                                    <p style={modalStyles.profilePhone}>
                                        <i className="fas fa-map-marker-alt" style={{marginRight: '0.5rem'}}></i>
                                        {data.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {data.bio && data.bio !== 'No bio provided' && (
                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.sectionTitle}>
                                    <i className="fas fa-user" style={{marginRight: '0.5rem'}}></i>
                                    Bio
                                </h4>
                                <p style={{color: 'rgba(255,255,255,0.9)', lineHeight: '1.6'}}>{data.bio}</p>
                            </div>
                        )}

                        <div style={modalStyles.section}>
                            <h4 style={modalStyles.sectionTitle}>
                                <i className="fas fa-code" style={{marginRight: '0.5rem'}}></i>
                                Skills & Expertise
                            </h4>
                            <div style={modalStyles.skillsGrid}>
                                {data.skills.map(skill => (
                                    <span key={skill} style={modalStyles.skillItem}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div style={modalStyles.section}>
                            <h4 style={modalStyles.sectionTitle}>
                                <i className="fas fa-briefcase" style={{marginRight: '0.5rem'}}></i>
                                Professional Info
                            </h4>
                            <div style={{display: 'grid', gap: '0.75rem'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: 'rgba(255,255,255,0.7)'}}>Category:</span>
                                    <span style={{color: 'var(--neon-green)', fontWeight: '600'}}>{data.category}</span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: 'rgba(255,255,255,0.7)'}}>Hourly Rate:</span>
                                    <span style={{color: 'var(--neon-green)', fontWeight: '600', fontSize: '1.1rem'}}>₹{data.hourlyRate}/hr</span>
                                </div>
                                {data.experience && data.experience !== 'N/A' && (
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span style={{color: 'rgba(255,255,255,0.7)'}}>Experience:</span>
                                        <span style={{color: 'var(--light-text)', fontWeight: '600'}}>{data.experience}</span>
                                    </div>
                                )}
                                {data.languages && data.languages.length > 0 && (
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span style={{color: 'rgba(255,255,255,0.7)'}}>Languages:</span>
                                        <span style={{color: 'var(--light-text)', fontWeight: '600'}}>{data.languages.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {data.portfolio && data.portfolio !== 'N/A' && (
                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.sectionTitle}>
                                    <i className="fas fa-folder-open" style={{marginRight: '0.5rem'}}></i>
                                    Portfolio & Links
                                </h4>
                                <div style={modalStyles.links}>
                                    <a href={data.portfolio} target="_blank" rel="noopener noreferrer" style={modalStyles.link}>
                                        <i className="fas fa-external-link-alt"></i> View Portfolio
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={modalStyles.actionSection}>
                        <h4 style={modalStyles.sectionTitle}>
                            <i className="fas fa-gavel" style={{marginRight: '0.5rem'}}></i>
                            Review Decision
                        </h4>
                        <div style={modalStyles.rejectionSection}>
                            <label style={modalStyles.label}>Rejection Reason (optional):</label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Provide specific reason if rejecting..."
                                style={modalStyles.textarea}
                                rows="3"
                            />
                        </div>
                        <div style={modalStyles.actionButtons}>
                            <button onClick={handleApprove} style={modalStyles.approveButton}>
                                <i className="fas fa-check-circle"></i> Approve & Create Service
                            </button>
                            <button onClick={handleReject} style={modalStyles.rejectButton}>
                                <i className="fas fa-times-circle"></i> Reject Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modal Styles
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
        padding: '2rem'
    },
    modal: {
        background: 'var(--card-bg)',
        borderRadius: '20px',
        border: '1px solid var(--neon-blue)',
        boxShadow: '0 0 50px rgba(5, 217, 232, 0.3)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    header: {
        background: 'rgba(5, 217, 232, 0.2)',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--neon-blue)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
    },
    title: {
        fontSize: '1.5rem',
        color: 'var(--neon-blue)',
        margin: 0,
        display: 'flex',
        alignItems: 'center'
    },
    closeButton: {
        background: 'var(--neon-pink)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
        flexShrink: 0
    },
    content: {
        padding: '2rem',
        overflowY: 'auto',
        flex: 1
    },
    profileSection: {
        marginBottom: '2rem'
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    profileAvatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid var(--neon-blue)'
    },
    profileInfo: {
        flex: 1
    },
    profileName: {
        fontSize: '2rem',
        color: 'var(--light-text)',
        margin: '0 0 0.5rem 0'
    },
    profileEmail: {
        color: 'var(--neon-blue)',
        fontSize: '1.1rem',
        margin: '0 0 0.5rem 0'
    },
    profilePhone: {
        color: 'rgba(255, 255, 255, 0.7)',
        margin: 0
    },
    section: {
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px'
    },
    sectionTitle: {
        color: 'var(--neon-blue)',
        fontSize: '1.2rem',
        margin: '0 0 1rem 0'
    },
    skillsGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
    },
    skillItem: {
        background: 'rgba(5, 217, 232, 0.2)',
        color: 'var(--neon-blue)',
        padding: '0.5rem 1rem',
        borderRadius: '15px',
        fontSize: '0.9rem',
        fontWeight: '600',
        border: '1px solid var(--neon-blue)'
    },
    links: {
        display: 'flex',
        gap: '1rem'
    },
    link: {
        background: 'var(--neon-blue)',
        color: 'var(--dark-bg)',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    actionSection: {
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '1.5rem',
        borderRadius: '10px'
    },
    rejectionSection: {
        marginBottom: '1.5rem'
    },
    label: {
        display: 'block',
        color: 'var(--neon-blue)',
        fontWeight: '600',
        marginBottom: '0.5rem'
    },
    textarea: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid var(--neon-blue)',
        borderRadius: '8px',
        padding: '1rem',
        color: 'var(--light-text)',
        fontSize: '1rem',
        resize: 'vertical',
        minHeight: '80px'
    },
    actionButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
    },
    approveButton: {
        background: 'var(--neon-green)',
        color: 'var(--dark-bg)',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    rejectButton: {
        background: 'var(--neon-pink)',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    }
};

