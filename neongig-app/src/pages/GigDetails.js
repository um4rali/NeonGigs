import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://neongigs.onrender.com/api';

export default function GigDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState('basic');
    const [orderRequirements, setOrderRequirements] = useState('');
    const [showOrderForm, setShowOrderForm] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userData') || 'null');
        if (user && user.isLoggedIn) {
            setIsLoggedIn(true);
            setUserData(user);
        }
        
        fetchGigDetails();
        
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [id]);

    const fetchGigDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/services/${id}`);
            if (response.data.success) {
                setGig(response.data.service);
            }
        } catch (error) {
            console.error('Error fetching gig details:', error);
            // Fallback to static data if API fails
            const staticGigs = [
                {
                    _id: '1',
                    title: 'Professional Logo Design',
                    description: 'I will design a professional and unique logo for your brand that stands out from the competition. This includes multiple revisions, source files, and commercial rights.',
                    price: 50,
                    deliveryTime: 3,
                    category: 'graphics-design',
                    images: ['https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
                    rating: 4.9,
                    totalReviews: 124,
                    freelancerName: 'Alex Johnson'
                },
                {
                    _id: '2',
                    title: 'Social Media Marketing Strategy',
                    description: 'I will create a comprehensive social media marketing strategy to grow your brand presence online. Includes content calendar, platform recommendations, and engagement tactics.',
                    price: 120,
                    deliveryTime: 5,
                    category: 'digital-marketing',
                    images: ['https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
                    rating: 4.8,
                    totalReviews: 89,
                    freelancerName: 'Sarah Miller'
                },
                {
                    _id: '3',
                    title: 'Website Development',
                    description: 'I will develop a responsive and modern website for your business using the latest technologies. Includes responsive design, SEO optimization, and performance tuning.',
                    price: 300,
                    deliveryTime: 7,
                    category: 'programming-tech',
                    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
                    rating: 5.0,
                    totalReviews: 156,
                    freelancerName: 'Michael Chen'
                },
                {
                    _id: '4',
                    title: 'Video Editing for YouTube',
                    description: 'I will edit your YouTube videos with professional transitions, effects, and sound design. Perfect for content creators looking to elevate their video quality.',
                    price: 75,
                    deliveryTime: 4,
                    category: 'video-animation',
                    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
                    rating: 4.7,
                    totalReviews: 78,
                    freelancerName: 'Emma Wilson'
                },
                {
                    _id: '5',
                    title: 'Business Plan Writing',
                    description: 'I will write a comprehensive business plan that will help you secure funding and guide your business growth. Includes market analysis, financial projections, and executive summary.',
                    price: 150,
                    deliveryTime: 7,
                    category: 'business',
                    images: ['https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
                    rating: 4.9,
                    totalReviews: 92,
                    freelancerName: 'David Brown'
                },
                {
                    _id: '6',
                    title: 'Voice Over Recording',
                    description: 'Professional voice over recording for commercials, videos, audiobooks, and more with quick turnaround. Multiple accents available.',
                    price: 60,
                    deliveryTime: 2,
                    category: 'music-audio',
                    images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
                    rating: 4.8,
                    totalReviews: 67,
                    freelancerName: 'James Taylor'
                }
            ];
            const staticGig = staticGigs.find(g => g._id === id);
            if (staticGig) {
                setGig(staticGig);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOrder = () => {
        if (!isLoggedIn) {
            alert('Please login to place an order');
            navigate('/signin');
            return;
        }
        setShowOrderForm(true);
    };

    const confirmOrder = async () => {
        if (!orderRequirements.trim()) {
            alert('Please provide project requirements');
            return;
        }

        try {
            const amount = getPackagePrice();
            
            console.log('💳 Starting payment process...', {
                amount,
                gigTitle: gig.title,
                gigId: gig._id
            });
            
            // Step 1: Create order on backend
            const orderResponse = await axios.post(`${API_URL}/payment/create-order`, {
                amount: amount,
                currency: 'INR',
                gigTitle: gig.title,
                gigId: gig._id
            });

            console.log('📦 Order response:', orderResponse.data);

            if (!orderResponse.data.success) {
                console.error('❌ Failed to create order:', orderResponse.data);
                alert(`Failed to create order: ${orderResponse.data.message || 'Unknown error'}`);
                return;
            }

            const { order, key_id } = orderResponse.data;

            console.log('✅ Order created:', order.id);
            console.log('🔑 Using Razorpay key:', key_id);

            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                alert('Payment gateway not loaded. Please refresh the page and try again.');
                return;
            }

            // Open Razorpay checkout
            const options = {
                key: key_id,
                amount: order.amount,
                currency: order.currency,
                name: 'NeonGigs',
                description: gig.title,
                image: 'https://via.placeholder.com/100x100?text=NG',
                order_id: order.id,
                handler: async function (response) {
                    console.log('✅ Payment successful:', response);
                    // Step 3: Verify payment on backend
                    try {
                        const verifyResponse = await axios.post(`${API_URL}/payment/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            gigId: gig._id,
                            gigTitle: gig.title,
                            amount: amount,
                            userId: userData?.id
                        });

                        if (verifyResponse.data.success) {
                            alert(`✅ Payment Successful!\n\nPayment ID: ${response.razorpay_payment_id}\nGig: ${gig.title}\nAmount: ₹${amount}`);
                            setShowOrderForm(false);
                            navigate('/user-profile');
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('❌ Payment verification error:', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: userData?.name || '',
                    email: userData?.email || '',
                    contact: userData?.phone || ''
                },
                notes: {
                    gigId: gig._id,
                    gigTitle: gig.title,
                    requirements: orderRequirements
                },
                theme: {
                    color: '#ff2a6d'
                }
            };

            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', function (response) {
                console.error('❌ Payment failed:', response.error);
                alert(`Payment Failed!\nReason: ${response.error.description}`);
            });

            rzp.open();

        } catch (error) {
            console.error('❌ Error processing order:', error);
            console.error('Error details:', error.response?.data || error.message);
            alert(`Failed to process order: ${error.response?.data?.message || error.message || 'Please try again.'}`);
        }
    };

    const getPackagePrice = () => {
        if (!gig) return 0;
        return gig.price || 50;
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/');
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'var(--dark-bg)'
            }}>
                <div className="loading"></div>
            </div>
        );
    }

    if (!gig) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--dark-bg)', color: 'white', padding: '2rem' }}>
                <h2>Gig not found</h2>
                <Link to="/categories">← Back to Categories</Link>
            </div>
        );
    }

    return (
        <div>
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
                    --card-bg: rgba(13, 2, 33, 0.7);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Rajdhani', 'Poppins', sans-serif;
                }

                body {
                    background-color: var(--dark-bg);
                    color: var(--light-text);
                    min-height: 100vh;
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                header {
                    background-color: rgba(13, 2, 33, 0.9);
                    box-shadow: 0 2px 20px rgba(5, 217, 232, 0.2);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--neon-blue);
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
                    text-shadow: 0 0 10px var(--neon-blue);
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }

                .nav-links a {
                    color: var(--light-text);
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .nav-links a:hover {
                    color: var(--neon-pink);
                }

                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    text-decoration: none;
                    display: inline-block;
                }

                .btn-primary {
                    background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 15px var(--neon-pink);
                }

                .btn-outline {
                    background: transparent;
                    border: 2px solid var(--neon-blue);
                    color: var(--neon-blue);
                }

                .gig-details-section {
                    padding: 4rem 0;
                    min-height: 80vh;
                }

                .gig-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 3rem;
                    margin-top: 2rem;
                }

                .gig-main {
                    background: var(--card-bg);
                    border: 1px solid var(--neon-blue);
                    border-radius: 15px;
                    padding: 2rem;
                }

                .gig-image {
                    width: 100%;
                    height: 400px;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 2rem;
                }

                .gig-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .seller-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid rgba(5, 217, 232, 0.3);
                }

                .seller-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 2px solid var(--neon-blue);
                    overflow: hidden;
                }

                .seller-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .seller-details h3 {
                    color: var(--neon-green);
                    margin-bottom: 0.5rem;
                }

                .seller-rating {
                    color: var(--neon-yellow);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .gig-title {
                    font-size: 2rem;
                    color: var(--neon-pink);
                    margin-bottom: 1rem;
                }

                .gig-description {
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.8;
                    margin-bottom: 2rem;
                }

                .gig-sidebar {
                    position: sticky;
                    top: 100px;
                    height: fit-content;
                }

                .pricing-card {
                    background: var(--card-bg);
                    border: 2px solid var(--neon-pink);
                    border-radius: 15px;
                    padding: 2rem;
                    box-shadow: 0 0 20px rgba(255, 42, 109, 0.3);
                }

                .price {
                    font-size: 2.5rem;
                    color: var(--neon-green);
                    font-weight: bold;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 10px var(--neon-green);
                }

                .package-selector {
                    margin-bottom: 1.5rem;
                }

                .package-option {
                    padding: 1rem;
                    border: 1px solid var(--neon-blue);
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .package-option:hover {
                    background: rgba(5, 217, 232, 0.1);
                }

                .package-option.active {
                    background: rgba(5, 217, 232, 0.2);
                    border-color: var(--neon-green);
                }

                .delivery-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                .order-button {
                    width: 100%;
                    padding: 1rem;
                    font-size: 1.2rem;
                    margin-top: 1rem;
                }

                .order-form {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .order-form-content {
                    background: var(--card-bg);
                    border: 2px solid var(--neon-blue);
                    border-radius: 15px;
                    padding: 2rem;
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--neon-blue);
                }

                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    background: rgba(5, 217, 232, 0.1);
                    border: 1px solid var(--neon-blue);
                    border-radius: 8px;
                    color: var(--light-text);
                    min-height: 120px;
                }

                .form-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .loading {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid var(--neon-blue);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .gig-content {
                        grid-template-columns: 1fr;
                    }
                    
                    .gig-sidebar {
                        position: static;
                    }
                }
            `}} />

            <header>
                <div className="container">
                    <div className="navbar">
                        <Link to="/" className="logo">
                            <i className="fas fa-bolt" style={{marginRight: '0.5rem'}}></i>
                            NeonGigs
                        </Link>
                        <div className="nav-links">
                            <Link to="/">Home</Link>
                            <Link to="/categories">Categories</Link>
                            <Link to="/ContactSupport">Contact</Link>
                        </div>
                        {isLoggedIn ? (
                            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                <span style={{color: 'var(--neon-green)'}}>{userData?.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                            </div>
                        ) : (
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <Link to="/signin" className="btn btn-outline">Login</Link>
                                <Link to="/login" className="btn btn-primary">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <section className="gig-details-section">
                <div className="container">
                    <Link to="/categories" style={{color: 'var(--neon-blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
                        <i className="fas fa-arrow-left"></i> Back to Categories
                    </Link>

                    <div className="gig-content">
                        <div className="gig-main">
                            <div className="gig-image">
                                <img src={gig.images?.[0] || 'https://via.placeholder.com/800x400'} alt={gig.title} />
                            </div>

                            <div className="seller-info">
                                <div className="seller-avatar">
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt={gig.freelancerName} />
                                </div>
                                <div className="seller-details">
                                    <h3>{gig.freelancerName || 'Freelancer'}</h3>
                                    <div className="seller-rating">
                                        <i className="fas fa-star"></i>
                                        <span>{gig.rating || 0} ({gig.totalReviews || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <h1 className="gig-title">{gig.title}</h1>
                            <p className="gig-description">{gig.description}</p>

                            <div style={{marginTop: '2rem'}}>
                                <h3 style={{color: 'var(--neon-blue)', marginBottom: '1rem'}}>What you'll get:</h3>
                                <ul style={{listStyle: 'none', padding: 0}}>
                                    <li style={{padding: '0.5rem 0', color: 'rgba(255,255,255,0.8)'}}>
                                        <i className="fas fa-check" style={{color: 'var(--neon-green)', marginRight: '0.5rem'}}></i>
                                        Professional quality work
                                    </li>
                                    <li style={{padding: '0.5rem 0', color: 'rgba(255,255,255,0.8)'}}>
                                        <i className="fas fa-check" style={{color: 'var(--neon-green)', marginRight: '0.5rem'}}></i>
                                        Delivery in {gig.deliveryTime || 7} days
                                    </li>
                                    <li style={{padding: '0.5rem 0', color: 'rgba(255,255,255,0.8)'}}>
                                        <i className="fas fa-check" style={{color: 'var(--neon-green)', marginRight: '0.5rem'}}></i>
                                        100% satisfaction guarantee
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="gig-sidebar">
                            <div className="pricing-card">
                                <div className="price">₹{gig.price || 50}</div>
                                
                                <div className="delivery-info">
                                    <span><i className="fas fa-clock"></i> Delivery</span>
                                    <strong>{gig.deliveryTime || 7} days</strong>
                                </div>

                                <div className="delivery-info">
                                    <span><i className="fas fa-sync"></i> Revisions</span>
                                    <strong>2 revisions</strong>
                                </div>

                                <button className="btn btn-primary order-button" onClick={handleOrder}>
                                    <i className="fas fa-shopping-cart"></i> Order Now
                                </button>

                                <div style={{marginTop: '1.5rem', padding: '1rem', background: 'rgba(0, 255, 157, 0.1)', borderRadius: '8px', border: '1px solid var(--neon-green)'}}>
                                    <p style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', margin: 0}}>
                                        <i className="fas fa-shield-alt" style={{color: 'var(--neon-green)', marginRight: '0.5rem'}}></i>
                                        Your payment is protected
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showOrderForm && (
                <div className="order-form">
                    <div className="order-form-content">
                        <h2 style={{color: 'var(--neon-pink)', marginBottom: '1.5rem'}}>Complete Your Order</h2>
                        
                        <div style={{background: 'rgba(5, 217, 232, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'}}>
                            <h4 style={{color: 'var(--neon-blue)', marginBottom: '0.5rem'}}>{gig.title}</h4>
                            <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem'}}>Price: ₹{getPackagePrice()}</p>
                        </div>

                        <div className="form-group">
                            <label>Project Requirements</label>
                            <textarea
                                value={orderRequirements}
                                onChange={(e) => setOrderRequirements(e.target.value)}
                                placeholder="Please describe your project requirements in detail..."
                            />
                        </div>

                        <div className="form-buttons">
                            <button 
                                className="btn btn-primary" 
                                onClick={confirmOrder}
                                style={{flex: 1}}
                            >
                                <i className="fas fa-credit-card"></i> Proceed to Payment
                            </button>
                            <button 
                                className="btn btn-outline" 
                                onClick={() => setShowOrderForm(false)}
                                style={{flex: 1}}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
