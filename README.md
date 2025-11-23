# 🏫 DevNest – Campus Communication & Opportunity Platform

<div align="center">

![DevNest Logo](https://img.shields.io/badge/DevNest-Campus%20Platform-blue?style=for-the-badge\&logo=chat\&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**A secure, modern, full-fledged campus ecosystem for communication, learning, opportunities, and anonymous discussions.**

[Features](#-features) • [Architecture](#-system-architecture) • [Workflow Diagram](#-devnest-end-to-end-system-workflow) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

DevNest is a comprehensive campus platform designed to bring **communication, opportunities, learning resources, and anonymous interactions** into one unified system.
It includes a fully integrated **scraping engine**, **moderation system**, **learning module**, **event & opportunity dashboard**, and **anonymous community**, all powered by robust backend architecture.

---

# 🌐 **DevNest: End-to-End System Workflow**

Below is the precise flowchart specification included in your project documentation.

```
                            ┌───────────────────────────┐
                            │       Start Node          │
                            └──────────────┬────────────┘
                                           │
                                ┌──────────▼──────────┐
                                │ User Access Layer   │
                                └──────────┬──────────┘
                                           │
                                ┌──────────▼───────────┐
                                │ User opens DevNest    │
                                └──────────┬────────────┘
                                           │
                                ┌──────────▼───────────┐
                                │ Decision: Logged in? │◄──────────────┐
                                └───────┬─────┬────────┘               │
                                        │     │ Yes                     │
                                        │ No  │                         │
                                        │     │                         │
            ┌───────────────────────────▼─┐   │                         │
            │ Login / Signup Page          │   │                         │
            └───────────────┬─────────────┘   │                         │
                            │                  │                         │
            ┌───────────────▼────────────────┐ │                         │
            │ Authentication Service          │ │                         │
            └───────────────┬────────────────┘ │                         │
                            │ Success           │                         │
            ┌───────────────▼──────────────────▼──────────┐
            │ Redirect to Dashboard / Load Dashboard        │
            └───────────────┬──────────────────────────────┘
                            │
                 ┌──────────▼────────────┐
                 │ Dashboard Operations  │
                 └──────────┬────────────┘
                            │
       ┌────────────────────▼───────────────────────────┐
       │ Load User Profile & Modules:                   │
       │  • Opportunity Dashboard                       │
       │  • Learning Module                              │
       │  • Community Section                            │
       └────────────────────┬───────────────────────────┘
                            │
              ┌─────────────▼──────────────┐
              │ Decision: Select Module?   │
              └──────┬─────────┬──────────┘
                     │         │
                     │         │
        ┌────────────▼─┐   ┌───▼──────────────┐    ┌──────────────────┐
        │ Opportunity   │   │ Learning Module  │    │ Community Module │
        │ Dashboard     │   └──────────────────┘    └──────────────────┘
        ├──────────────┤   • Select Skill Path      • View/Create Posts
        │• Filter/Search│   • Open Roadmaps         • Submit to DB
        │• Event Detail │   • Track Progress        • Log Interaction
        │• Redirect     │
        └──────────────┘
```

---

# 🔧 **Backend System (Parallel Subsystem)**

```
┌──────────────────────────────┐
│          API Gateway          │
└──────────────┬───────────────┘
               │
     ┌─────────▼─────────┐
     │  Database Query    │
     └─────────┬─────────┘
               │
     ┌─────────▼──────────┐
     │ Serve Data to UI   │
     └────────────────────┘
```

---

# 🤖 **Automated Scraper Engine (Background Process)**

```
┌───────────────────────────────┐
│ Scheduler (CRON Trigger)      │
└────────────────┬──────────────┘
                 │
    ┌────────────▼────────────────┐
    │ Scrape Unstop, Devpost      │
    └────────────┬────────────────┘
                 │
    ┌────────────▼────────────────┐
    │ Validate Response            │
    └───────┬───────────┬─────────┘
            │ Error     │ Success
            │           │
   ┌────────▼─┐     ┌───▼────────────────┐
   │ Log +    │     │ Extract → Clean →   │
   │ Retry    │     │ Normalize → Update  │
   └──────────┘     └─────────────────────┘
                          │
         ┌────────────────▼────────────────┐
         │ Notify UI (New Opportunities)   │
         └─────────────────────────────────┘
```

---

# 🗄️ **Database Layer**

* **Opportunities Collection**
* **User Data**
* **Posts & Discussions**
* **Learning Content**
* **Analytics & Logs**

---

# 📊 **Analytics & Monitoring**

* User behavior & engagement
* Scraper health/status logs
* Module usage insights

---

# ✨ Features

### 🔐 Authentication & Security

* Email/Password + Google OAuth
* JWT sessions
* Role-based permissions
* Secure bcrypt hashing

### 💬 Communication Layer

* Anonymous posting
* Real-time chat
* Course updates
* Event & opportunity feed
* Reporting & moderation

### 🎯 Learning Module

* Skill path selection
* Roadmaps
* Progress tracking

### 🚀 Opportunity Dashboard

* Scraped events from **Unstop & Devpost**
* Live updates
* Event redirect system

### 🛡️ Admin Dashboard

* Anonymous identity reveal
* Moderation tools
* User management
* Real-time analytics

---

# 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│    Backend       │◄──►│   Database      │
│ React + TS      │    │ Node + Express   │    │ MongoDB         │
│ Tailwind UI     │    │ Socket.IO        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                     │
       ┌──────────────────────────┐
       │ External Services        │
       │ Google OAuth, JWT, CRON  │
       └──────────────────────────┘
```

---

# 🚀 Installation

### Prerequisites

* Node.js ≥ 18
* MongoDB ≥ 5
* Google OAuth credentials

### 1️⃣ Clone the Project

```bash
git clone https://github.com/Nizamuddin1N/devNest
cd devNest
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

### 4️⃣ Start Servers

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

# 🛠️ Tech Stack

### **Frontend**

* React 18 + TS
* Vite
* Tailwind
* Shadcn/UI
* React Router
* Socket.IO client

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT, bcrypt
* Cron Jobs
* WebSockets

---

# 🧩 Project Structure

```
devnest/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
└── README.md
```

---

# 📊 API Documentation (Important Endpoints)

### **Auth**

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/google`
* `GET /api/auth/me`

### **Posts**

* `GET /api/posts`
* `POST /api/posts`
* `DELETE /api/posts/:id`
* `POST /api/posts/:id/report`

### **Admin**

* `GET /api/admin/anonymous-posts`
* `POST /api/admin/ban-user/:id`
* `GET /api/admin/identify-author/:id`
* `GET /api/admin/analytics`

### **WebSockets**

* `new-post`
* `post-reported`
* `admin-action`
* `user-status`

---

# 🧪 Testing

```bash
cd backend && npm test
cd frontend && npm test
```

---

# 🚀 Deployment

### Build

```bash
cd frontend && npm run build
cd backend && npm start
```

### Production Tips

* Enable HTTPS
* Use production MongoDB
* Set secure JWT secrets
* Restrict CORS

---

# 🤝 Contributing

1. Fork
2. Create a branch
3. Commit
4. Push
5. Open PR

---

# 📄 License

MIT License.

---

<div align="center">
# 🎓 DevNest
</div>


