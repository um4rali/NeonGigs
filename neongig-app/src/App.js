import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Categories from './pages/Categories';
import UserProfile from './pages/UserProfile'; // Make sure this import is correct
import ContactSupport from './pages/ContactSupport';
import BecomeSeller from './pages/BecomeSeller';
import Explore from './pages/Explore';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import FreelancerProfile from './pages/FreelancerProfile';
import AdminDashboard from './pages/AdminDashboard';
import GigDetails from './pages/GigDetails';
import OpenSSLLab from "./pages/OpenSSLLab";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/Categories" element={<Categories />} />
    <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/ContactSupport" element={<ContactSupport />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/BecomeSeller" element={<BecomeSeller />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/Explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        <Route path="/FreelancerProfile" element={<FreelancerProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/gig/:id" element={<GigDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
