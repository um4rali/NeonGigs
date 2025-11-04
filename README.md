# ⚡ NeonGigs — Digital Services Marketplace  
![MERN Stack](https://img.shields.io/badge/MERN-MongoDB_Express_React_Node.js-47A248?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge)
![Razorpay](https://img.shields.io/badge/Payment-Razorpay-00B9F1?style=for-the-badge)

A futuristic cyber-neon freelancing marketplace that connects **clients** with **freelancers** to buy & sell digital services.  
Built with the **MERN Stack**, secure payments via **Razorpay**, and a sleek **cyberpunk-inspired UI**.

---

## 🌌 Vision  

NeonGigs aims to empower gig workers by providing a **modern, intuitive, and trusted platform** for showcasing skills, discovering services, placing orders, and collaborating efficiently.

---

## 🧩 Core Features

| Feature | Description |
|--------|-------------|
| 🧑‍💼 Multi-role System | Client, Freelancer, and Admin roles with role-based access control |
| 🧾 Service Marketplace | Browse, search, filter, and purchase gigs across categories |
| 💬 Messaging & Updates | Order-based communication between buyer and seller |
| 💳 Secure Payments | Razorpay checkout flow integrated for real transactions |
| ⭐ Reviews & Ratings | Clients can review freelancers after order completion |
| 🔍 Smart Search & Filters | Assisted search to find services efficiently |
| 🛡️ Secure Auth | JWT Authentication + Protected Routes |

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, React Router, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Payment Gateway | Razorpay |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 🎨 UI & Design Philosophy

- **Dark Neon Interface** inspired by cyberpunk culture  
- **Responsive** for both desktop & mobile  
- **Minimal & intuitive navigation**  
- **Focus on discoverability of services**  

---

## 🧱 Project Structure

```
NeonGigs/
├── backend/
│   ├── models/          # User, Service, Order Schemas
│   ├── routes/          # API Endpoints
│   ├── middleware/      # Auth & Validation
│   └── server.js        # Express Server
├── src/
│   ├── pages/           # React UI Pages
│   │   ├── Home.js
│   │   ├── Explore.js
│   │   ├── UserProfile.js
│   │   └── BecomeSeller.js
│   └── App.js           # Main App Router
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas Account
- Razorpay Developer Keys

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=your_connection_string
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret" > .env

npm run dev
```

### Frontend Setup
```bash
cd ../src
npm install
npm start
```

---

## 🔮 Future Enhancements

| Feature | Goal |
|--------|------|
| 🗨 Real-Time Chat | Socket.io live buyer-seller messaging |
| 🤖 AI Service Recommendations | Personalized service suggestions |
| 📊 Advanced Admin Analytics | Sales, trends, user insights dashboard |
| 🐳 Containerization | Docker + Kubernetes deployment for scalability |

---

## 👨‍💻 Contributors

| Name | Role |
|------|------|
| **Mahesh Vaviya - 16010123184** | Backend + Logic |
| **Umar Ali Nasir Ali - 16010123198** | Frontend UI + UX + System Flow |
| **Vedant Desai - 16010123205** | Database + Deployment |

---

## 📜 License
This project is released under the MIT License.

---

> _"Connecting Creativity with Opportunity."_ ✨

