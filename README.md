<h1 align="center">
  <br/>
  🤖 AI Hire Hub
  <br/>
</h1>

<p align="center">
  <strong>An AI-powered full-stack freelancing marketplace</strong><br/>
  Plan projects with AI · Hire top freelancers · Pay via milestone escrow
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.io-4.8.1-010101?logo=socket.io" alt="Socket.io"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" alt="Tailwind"/>
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Key Workflows](#-key-workflows)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AI Hire Hub** is a production-ready, full-stack freelancing platform that combines AI project planning, real-time messaging, milestone-based escrow payments, and an intelligent freelancer recommendation system — all in one seamless product.

Clients describe their project in plain English and an AI assistant (powered by **Groq / LLaMA 3.3 70B**) generates a complete project plan with milestones, budget estimates, timelines, and required skills. Freelancers browse open projects, submit proposals, and get paid securely as each milestone is approved.

---

## ✨ Features

### 👤 Authentication & Roles
- JWT-based authentication with **HTTP-only cookie** + `Authorization` header support
- Two roles: **Client** and **Freelancer**
- Persistent login via Zustand + `localStorage`
- Rate-limited auth endpoints (10 attempts per 15 min)

### 🤖 AI Project Planning (Groq + LLaMA 3.3-70b)
- Chat-based AI project planner for clients
- AI generates a structured project plan including:
  - Title, description, budget (INR), timeline
  - Required skills array
  - Ordered milestones with amounts and deadlines
- AI milestone quality reviewer — automatically scores submitted work (0–100) and suggests approval or revision

### 📂 Project Management
- Clients create and manage projects; status lifecycle: `draft → open → in_progress → completed`
- Full-text search on title, description, and skills
- Skill-based filtering and pagination
- Freelancers browse open projects and submit proposals with cover letter, bid amount, and timeline
- Clients accept/reject proposals; accepting a proposal auto-assigns the freelancer

### 🏆 Milestone-Based Escrow Payments
- Client funds the full project budget into escrow before work begins
- Milestones progress through: `pending → active → submitted → approved → paid`
- Client approves each milestone → funds released instantly to freelancer's wallet
- Rejected milestones return to `rejected` state for revision and resubmission
- Full transaction history per user

### 💳 Wallet & Payments (Razorpay)
- Add funds via **Razorpay** payment gateway (INR)
- HMAC-SHA256 signature verification for every payment
- In-app wallet balance for escrow funding and withdrawals
- Withdrawal requests with bank transfer metadata

### 💬 Real-Time Messaging (Socket.io)
- One-on-one chat between client and freelancer on a project
- Online/offline presence indicators
- Typing indicators
- Unread message counts per conversation
- File attachments (images, PDFs, documents) via Cloudinary
- Message mark-as-read events

### 📁 File Uploads (Cloudinary)
- Profile avatar uploads
- Portfolio item files (freelancer)
- Milestone submission file attachments (up to 10 files, 10MB each)
- Allowed types: `jpg, jpeg, png, gif, pdf, doc, docx, zip`

### 🎯 Freelancer Recommendation Engine
- Skill-match scoring (0–50 pts)
- Rating score (0–25 pts)
- Completed project score (0–25 pts)
- Returns top 10 recommended freelancers per project

---

## 🛠 Tech Stack

### Frontend (Client)
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.6 | React framework (App Router) |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Zustand** | 5.0.4 | Global state management |
| **Radix UI** | latest | Accessible UI primitives |
| **React Hook Form** | 7.56.4 | Form state management |
| **Zod** | 3.24.4 | Schema validation |
| **Axios** | 1.9.0 | HTTP client |
| **Socket.io Client** | 4.8.1 | Real-time communication |
| **Lucide React** | 0.511.0 | Icon library |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **date-fns** | 4.1.0 | Date formatting |

### Backend (Server)
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18.0.0 | Runtime |
| **Express** | 4.21.2 | Web framework |
| **MongoDB + Mongoose** | 8.15.0 | Database & ODM |
| **Socket.io** | 4.8.1 | WebSocket server |
| **Groq SDK** | 0.13.0 | LLaMA 3.3 AI API |
| **Razorpay** | 2.9.6 | Payment gateway |
| **Cloudinary** | 2.6.1 | File storage & CDN |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Helmet** | 8.0.0 | Security HTTP headers |
| **express-rate-limit** | 7.5.0 | API rate limiting |
| **express-mongo-sanitize** | 2.2.0 | NoSQL injection protection |
| **Multer** | 1.4.5-lts | Multipart file handling |
| **Zod** | 3.24.4 | Server-side validation |
| **Nodemon** | 3.1.10 | Dev auto-restart |

---

## 🏗 Architecture

```
ai-hire-hub/
├── client/          # Next.js 16 frontend (App Router)
└── server/          # Express.js backend API
```

```
┌─────────────────────┐         ┌──────────────────────────┐
│   Next.js Client    │ ◄─────► │    Express REST API       │
│  (Port 3000)        │  HTTP   │    (Port 5000)            │
│                     │         │                          │
│  - App Router       │ ◄─────► │    Socket.io Server      │
│  - Zustand Store    │ WS/WSS  │    (same port)           │
│  - React Hook Form  │         │                          │
│  - Tailwind UI      │         │    MongoDB (Mongoose)    │
└─────────────────────┘         │    Groq AI (LLaMA 3.3)  │
                                │    Razorpay Payments     │
                                │    Cloudinary CDN        │
                                └──────────────────────────┘
```

---

## 📁 Project Structure

```
ai-hire-hub/
│
├── client/                          # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, toaster)
│   │   ├── page.tsx                 # Landing page
│   │   ├── globals.css              # Global styles + design tokens
│   │   ├── login/                   # Login page
│   │   ├── register/                # Register page
│   │   └── dashboard/
│   │       ├── client/              # Client dashboard
│   │       │   ├── page.tsx         # Client home (stats, projects)
│   │       │   ├── layout.tsx       # Client sidebar layout
│   │       │   ├── ai-chat/         # AI project planner chat
│   │       │   ├── projects/        # Project management pages
│   │       │   ├── messages/        # Real-time chat
│   │       │   ├── wallet/          # Wallet & payments
│   │       │   └── profile/         # Profile settings
│   │       └── freelancer/          # Freelancer dashboard
│   │           ├── page.tsx         # Freelancer home (stats, work)
│   │           ├── layout.tsx       # Freelancer sidebar layout
│   │           ├── browse/          # Browse open projects
│   │           ├── projects/        # My active projects
│   │           ├── messages/        # Real-time chat
│   │           ├── wallet/          # Earnings & withdrawals
│   │           └── profile/         # Profile & portfolio
│   ├── components/                  # Reusable UI components
│   ├── lib/
│   │   ├── api.ts                   # Axios instance + interceptors
│   │   └── utils.ts                 # Utility helpers
│   ├── store/
│   │   └── authStore.ts             # Zustand auth store (persisted)
│   ├── types/                       # TypeScript type definitions
│   ├── next.config.ts               # Next.js config (image domains)
│   ├── tailwind.config.ts           # Tailwind config
│   └── .env.local                   # Client environment variables
│
└── server/                          # Express Backend
    └── src/
        ├── app.js                   # Entry point (Express + Socket.io)
        ├── config/
        │   ├── database.js          # MongoDB connection
        │   └── cloudinary.js        # Cloudinary + Multer setup
        ├── models/
        │   ├── User.js              # User schema (client/freelancer)
        │   ├── Project.js           # Project + Milestone schemas
        │   ├── Message.js           # Chat message schema
        │   ├── Notification.js      # Notification schema
        │   ├── Transaction.js       # Wallet transaction schema
        │   └── Review.js            # Review/rating schema
        ├── controllers/
        │   ├── authController.js    # Register, login, logout, me
        │   ├── userController.js    # Profile, freelancers, portfolio
        │   ├── projectController.js # CRUD, proposals, search
        │   ├── milestoneController.js # Submit, review, activate
        │   ├── walletController.js  # Razorpay, escrow, withdraw
        │   ├── chatController.js    # Messages, conversations
        │   └── aiController.js      # Chat, generate, review
        ├── routes/                  # Express routers
        ├── middleware/
        │   ├── auth.js              # JWT protect + role authorize
        │   └── errorHandler.js      # Centralized error handler
        ├── services/
        │   └── aiService.js         # Groq AI service helpers
        └── sockets/
            └── socketHandler.js     # Socket.io event handlers
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 18.0.0` — [Download](https://nodejs.org/)
- **MongoDB** (local) or a **MongoDB Atlas** connection string
- **npm** `>= 9`

You will also need accounts and API keys for:

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| [Groq](https://console.groq.com/) | LLaMA 3.3 AI API | ✅ Yes |
| [Cloudinary](https://cloudinary.com/) | File & image hosting | ✅ Yes |
| [Razorpay](https://razorpay.com/) | Payment gateway | ✅ Test mode |

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/ai-hire-hub.git
cd ai-hire-hub
```

**2. Install server dependencies**
```bash
cd server
npm install
```

**3. Install client dependencies**
```bash
cd ../client
npm install --legacy-peer-deps
```

---

### Environment Variables

#### Server — `server/.env`

Copy the example file and fill in your values:
```bash
cp server/.env.example server/.env
```

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-hire-hub
# Or Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-hire-hub

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d

# Groq AI  (https://console.groq.com/keys)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary  (https://console.cloudinary.com/)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay  (https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

#### Client — `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

> **⚠️ Important:** Never commit `.env` or `.env.local` files to version control. They are already in `.gitignore`.

---

### Running Locally

Open **two terminals**:

**Terminal 1 — Start the backend server:**
```bash
cd server
npm run dev
```
Output:
```
🚀 AI Hire Hub server running on port 5000
🌍 Environment: development
✅ MongoDB Connected: localhost
```

**Terminal 2 — Start the frontend client:**
```bash
cd client
npm run dev
```
Output:
```
▲ Next.js 16.2.6
- Local:        http://localhost:3000
- Ready in 2.1s
```

Now open **http://localhost:3000** in your browser.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

All protected routes require a JWT — either via `Authorization: Bearer <token>` header or the `token` HTTP-only cookie.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register new user |
| `POST` | `/auth/login` | ❌ | Login and receive token |
| `POST` | `/auth/logout` | ❌ | Clear auth cookie |
| `GET`  | `/auth/me` | ✅ | Get current user |

**Register / Login Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "client"
}
```
`role` must be `"client"` or `"freelancer"`.

---

### Users

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/users/profile` | ✅ | Any | Get own profile |
| `PUT` | `/users/profile` | ✅ | Any | Update profile (supports avatar upload) |
| `GET` | `/users/freelancers` | ✅ | Any | List freelancers (filter: skills, minRating, search) |
| `GET` | `/users/freelancers/:id` | ✅ | Any | Get freelancer by ID |
| `POST` | `/users/portfolio` | ✅ | Freelancer | Add portfolio item |
| `GET` | `/users/recommend/:projectId` | ✅ | Any | Get recommended freelancers for a project |

---

### Projects

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/projects` | ✅ | Client | Create a project |
| `GET` | `/projects` | ✅ | Any | List projects (paginated, filterable) |
| `GET` | `/projects/:id` | ✅ | Any | Get project details |
| `PUT` | `/projects/:id` | ✅ | Client | Update project |
| `POST` | `/projects/:id/proposals` | ✅ | Freelancer | Submit a proposal |
| `PUT` | `/projects/:id/proposals/:proposalId` | ✅ | Client | Accept or reject a proposal |

**Project Query Params:** `?status=open&skills=React,Node.js&search=ecommerce&page=1&limit=10`

---

### Milestones

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/milestones/submit` | ✅ | Freelancer | Submit milestone work (multipart, up to 10 files) |
| `POST` | `/milestones/review` | ✅ | Client | Approve or reject a milestone |
| `PUT` | `/milestones/:projectId/:milestoneId/activate` | ✅ | Client | Activate next milestone |

---

### Wallet & Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/wallet` | ✅ | Get balance + last 50 transactions |
| `POST` | `/wallet/add-funds` | ✅ | Create Razorpay order |
| `POST` | `/wallet/verify-payment` | ✅ | Verify payment + credit wallet |
| `POST` | `/wallet/fund-escrow` | ✅ | Fund project escrow from wallet |
| `POST` | `/wallet/withdraw` | ✅ | Request withdrawal |

---

### AI

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ai/chat` | ✅ | AI project planning chat |
| `POST` | `/ai/generate-project` | ✅ | One-shot project plan generation |
| `POST` | `/ai/review-work` | ✅ | AI review of milestone submission |

---

### Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/chat/conversations` | ✅ | Get all conversations with last message |
| `GET` | `/chat/:userId` | ✅ | Get messages with a specific user |
| `POST` | `/chat/send` | ✅ | Send a message (optional file attachment) |

---

### Health Check

```
GET /health
```
```json
{
  "success": true,
  "message": "AI Hire Hub API is running! 🚀",
  "timestamp": "2026-05-13T17:00:00.000Z"
}
```

---

## 👥 User Roles

### Client
- Create projects with AI assistance
- Browse and hire freelancers
- Manage milestones (activate, approve, reject)
- Fund projects via Razorpay into escrow
- Chat with hired freelancers

### Freelancer
- Browse open projects
- Submit proposals with bid amount
- Work on active milestones
- Submit completed work with files
- Receive payments instantly upon milestone approval
- Withdraw earnings to bank account
- Build a public portfolio

---

## 🔄 Key Workflows

### 1. AI-Assisted Project Creation (Client)
```
Client describes project in chat
    → AI asks clarifying questions
    → AI generates structured project plan (JSON)
    → Client reviews and saves the project
    → Project is posted as "open"
```

### 2. Hiring a Freelancer
```
Freelancer browses open projects
    → Submits proposal (cover letter, bid, timeline)
    → Client receives notification
    → Client reviews proposals
    → Client accepts → Freelancer is assigned
    → Other proposals auto-rejected
```

### 3. Milestone Payment Flow
```
Client funds project budget into escrow
    → First milestone activated automatically
    → Freelancer works and submits (with files)
    → AI reviews submission (auto-score 0-100)
    → Client reviews and approves/rejects
    → On approval → payment instantly released to freelancer wallet
    → Client activates next milestone
    → Repeat until all milestones paid → Project marked "completed"
```

### 4. Socket.io Real-Time Events

| Event (emit) | Description |
|---|---|
| `sendMessage` | Send a chat message |
| `typing` | Broadcast typing status |
| `markRead` | Mark messages as read |
| `joinProject` | Subscribe to project room updates |
| `projectUpdate` | Emit project status change |

| Event (listen) | Description |
|---|---|
| `newMessage` | Incoming message from another user |
| `messageSent` | Confirmation of sent message |
| `typing` | Someone is typing |
| `messagesRead` | Messages marked as read by receiver |
| `userOnline` / `userOffline` | Presence updates |
| `onlineUsers` | Initial list of online users |
| `projectUpdated` | Project status changed |

---

## 🔒 Security

| Measure | Implementation |
|---------|---------------|
| **Password Hashing** | bcryptjs with salt rounds = 12 |
| **JWT Auth** | Short-lived tokens (7d), HTTP-only cookies |
| **Rate Limiting** | 10 req/15min on auth; 100 req/15min on API |
| **Security Headers** | Helmet v8 (HSTS, X-Frame, CSP, etc.) |
| **NoSQL Injection** | express-mongo-sanitize on all inputs |
| **Payment Verification** | HMAC-SHA256 signature check on every Razorpay callback |
| **File Type Validation** | Exact extension Set match (`allowedExtensions.has(ext)`) |
| **CORS** | Restricted to `CLIENT_URL` origin only |
| **Socket Auth** | JWT verified in Socket.io middleware before connection |

---

## 🗄 Data Models

### User
`name` · `email` · `password (select:false)` · `role (client|freelancer)` · `avatar` · `bio` · `skills[]` · `walletBalance` · `rating` · `completedProjects` · `portfolio[]` · `hourlyRate` · `isOnline` · `isVerified`

### Project
`clientId` · `freelancerId` · `title` · `description` · `budget` · `timeline` · `status` · `skillsRequired[]` · `aiSummary` · `milestones[]` · `escrowAmount` · `totalPaid` · `proposals[]`

### Milestone (embedded in Project)
`title` · `description` · `amount` · `deadline` · `status (pending|active|submitted|approved|rejected|paid)` · `submissionFiles[]` · `aiReview{score,feedback,status}` · `clientReview{comment,approved}`

### Transaction
`userId` · `projectId` · `amount` · `type (deposit|withdrawal|escrow|release|refund)` · `status` · `paymentMethod` · `razorpayOrderId` · `razorpayPaymentId`

### Message
`conversationId` · `senderId` · `receiverId` · `projectId` · `content` · `type (text|file|image|system)` · `fileUrl` · `isRead` · `readAt`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Commit Convention
This project follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (no logic change)
- `refactor:` — Code refactoring
- `chore:` — Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Next.js, Express, MongoDB, Groq AI & Razorpay
</p>
