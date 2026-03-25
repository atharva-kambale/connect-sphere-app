<p align="center">
  <h1 align="center">🌐 Connect Sphere</h1>
  <p align="center">
    A full-stack campus marketplace demo — built as a <strong>university student academic project</strong>.
    <br />
    <strong>Built with React · Express · MongoDB · Socket.io</strong>
  </p>
</p>

> **⚠️ DISCLAIMER:** This is a **non-commercial student project** created for educational and portfolio purposes only. It is NOT a registered business, startup, or real commercial service. No real financial transactions are processed. The name "Connect Sphere" is a project title only and is not a registered trademark. See [DISCLAIMER.md](./DISCLAIMER.md) for full details.

---

## ✨ Features

- **🔐 Secure Authentication** — Email OTP verification, password reset, JWT tokens
- **📦 Listings Management** — Create, browse, edit, and delete marketplace listings with image uploads
- **💬 Real-time Chat** — Instant messaging between buyers and sellers via Socket.io
- **⭐ Reviews & Reputation** — Rate users and build trust scores
- **🔔 Notifications** — Stay updated on new messages and activity
- **☁️ Cloud Image Uploads** — Powered by Cloudinary
- **📱 Responsive Design** — Beautiful glassmorphic UI that works on all devices

## 🛠️ Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | React 19, Vite, Tailwind CSS, Framer Motion, Redux     |
| Backend    | Node.js, Express 4, Socket.io                          |
| Database   | MongoDB Atlas, Mongoose ODM                            |
| Auth       | JWT, bcrypt, OTP email verification                    |
| Storage    | Cloudinary                                             |
| Email      | Resend                                                 |
| Security   | Helmet, Rate Limiting, CORS, Input Validation, HPP     |

## 📁 Project Structure

```
connect-sphere-app/
├── backend/
│   ├── config/          # DB connection, Cloudinary setup
│   ├── controllers/     # Route handlers (auth, listings, chat, etc.)
│   ├── middleware/       # Auth, error handling, rate limiting, validation
│   ├── models/          # Mongoose schemas (User, Listing, Message, etc.)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Token generation, email service
│   ├── server.js        # App entry point
│   └── .env.example     # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── features/    # Redux slices
│   │   ├── services/    # API service layer
│   │   └── App.jsx      # Root component with routing
│   └── index.html
├── .gitignore
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for image uploads)
- **Resend** account (for email delivery)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/connect-sphere-app.git
   cd connect-sphere-app
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running in Development

**Start the backend** (from `backend/`):
```bash
npm run dev
```

**Start the frontend** (from `frontend/`):
```bash
npm run dev
```

- Backend API: `http://localhost:5000`
- Frontend App: `http://localhost:5173`

## 📡 API Overview

| Method | Endpoint                  | Description              | Auth |
| ------ | ------------------------- | ------------------------ | ---- |
| POST   | `/api/auth/register`      | Register a new user      | ❌   |
| POST   | `/api/auth/login`         | Login                    | ❌   |
| POST   | `/api/auth/verify-otp`    | Verify email OTP         | ❌   |
| POST   | `/api/auth/forgot-password` | Request password reset | ❌   |
| GET    | `/api/listings`           | Get all listings         | ❌   |
| POST   | `/api/listings`           | Create a listing         | ✅   |
| GET    | `/api/users/profile`      | Get user profile         | ✅   |
| PUT    | `/api/users/profile`      | Update user profile      | ✅   |
| GET    | `/api/conversations`      | Get user conversations   | ✅   |
| POST   | `/api/messages`           | Send a message           | ✅   |
| POST   | `/api/reviews`            | Submit a review          | ✅   |
| POST   | `/api/upload`             | Upload images            | ✅   |

## 🔒 Security

This project implements multiple layers of security:

- **Helmet.js** — Secure HTTP headers
- **Rate Limiting** — Brute-force protection on auth endpoints
- **MongoDB Sanitization** — NoSQL injection prevention
- **Input Validation** — Server-side validation on all auth routes
- **CORS** — Restricted to allowed origins only
- **Socket.io Auth** — JWT-verified WebSocket connections
- **bcrypt** — Password hashing with salt rounds

See [SECURITY.md](./SECURITY.md) for our security policy.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

## ⚠️ Disclaimer

This is a **student academic project** for educational purposes only. It is not a commercial product, registered business, or production service. See [DISCLAIMER.md](./DISCLAIMER.md) for the complete legal disclaimer.

---

<p align="center">
  🎓 University Student Academic Project — Not a commercial service
</p>
