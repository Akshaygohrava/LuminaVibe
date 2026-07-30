# LuminaVibe - Next-Gen Social Media Experience ✨

<div align="center">

![LuminaVibe Social Media App](https://via.placeholder.com/1200x400/6C63FF/FFFFFF?text=LuminaVibe+Social+Media+App)

[![Live Preview](https://img.shields.io/badge/Live_Preview-Demo-brightgreen?style=for-the-badge&logo=vercel&logoColor=white)](https://luminavibe.vercel.app)
[![API Docs](https://img.shields.io/badge/API_Docs-6C63FF?style=for-the-badge&logo=spring&logoColor=white)](https://api.luminavibe.com)
[![License-MIT](https://img.shields.io/badge/License-MIT-4ECDC4?style=for-the-badge)](LICENSE)

</div>

## 🌟 Overview
LuminaVibe is a modern, full-stack social media platform that brings people together through shared moments. Built with cutting-edge technologies, it delivers a seamless, real-time social experience with a beautiful and responsive user interface.

<div align="center">

[![Tech Icons](https://skillicons.dev/icons?i=react,vite,tailwindcss,spring,mysql,docker,aws)](https://skillicons.dev)

</div>

## 🚀 Live Demo & Resources
| Resource | Link |
| :--- | :--- |
| **🌐 Live Application** | [luminavibe.vercel.app](https://luminavibe.vercel.app) |
| **📡 Backend API** | [api.luminavibe.com](https://api.luminavibe.com) |
| **📚 API Documentation** | Swagger UI (e.g. `/swagger-ui/index.html`) |

---

## ✨ Features

### 🎯 Core Features
| Category | Features | Status |
| :--- | :--- | :---: |
| **👤 User Management** | Registration, Login, OAuth2 (Google/GitHub), Profile Management, Account Settings | ✅ |
| **📝 Posts** | Create, Edit, Delete, Rich Text, Image Upload, Video Support, Hashtags, Mentions | ✅ |
| **💬 Social Interactions** | Likes, Comments, Replies, Shares, Bookmarks, Reactions | ✅ |
| **🔗 Connections** | Follow/Unfollow, Friend Requests, Block Users, Close Friends | ✅ |
| **🔒 Privacy** | Public/Private Accounts, Story Privacy, Custom Audience Lists | ✅ |

### 📸 Rich Media Features
| Category | Features | Status |
| :--- | :--- | :---: |
| **📸 Stories** | 24hr Stories, Highlights, AR Filters, Music Stickers | ✅ |
| **🎥 Reels** | Short Videos, Video Editing, Audio Sync, Trending Sounds | ✅ |
| **💭 Messages** | Real-time Chat, Group Chats, Voice Messages, File Sharing | ✅ |
| **🔴 Live Streaming** | Go Live, Viewer Comments, Gifts, Co-streaming | 🚧 |
| **📊 Analytics** | Profile Insights, Post Performance, Audience Demographics | ✅ |

### 🎯 Engagement Features
| Category | Features | Status |
| :--- | :--- | :---: |
| **🏆 Gamification** | Achievements, Badges, Streaks, Leaderboards | ✅ |
| **💰 Monetization** | Creator Fund, Subscriptions, Tips, Shop Integration | 🚧 |
| **🗳️ Polls & Quizzes** | Interactive Polls, Quizzes, Q&A Sessions | ✅ |
| **📅 Events** | Create Events, RSVP, Reminders, Live Coverage | ✅ |
| **🤖 AI Features** | Smart Filters, Content Suggestions, Auto-hashtags | 🚧 |

---

## 🛠️ Technology Stack

### Frontend 🎨
| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **⚛️ React** | UI Library | v19.0.0 |
| **⚡ Vite** | Build Tool | v6.0.0 |
| **🎨 TailwindCSS** | Utility-first CSS | v4.0.0 |
| **📡 Axios** | API Client (HTTP Requests) | v1.x.x |
| **📋 React Hook Form** | Form Management & Validation | v7.x.x |
| **🎭 Framer Motion** | UI Animations | v11.x.x |
| **🧭 React Router** | Client-side Routing | v7.0.0 |
| **🎯 Zustand** | Client State Management | v5.0.0 |
| **🔔 Sonner** | Toast Notifications | v2.0.0 |

### Backend ⚙️
| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **🍃 Spring Boot** | Application Framework | v4.1.0 |
| **🔐 Spring Security** | Authentication & Authorization | v6.4.0 |
| **🔑 JWT (JJWT)** | Token-based Auth | v0.12.0 |
| **📊 Spring Data JPA** | Data Access Layer | v3.4.0 |
| **🔄 Hibernate** | Object-Relational Mapping (ORM) | v6.6.0 |
| **🗄️ MySQL** | Primary Database | v8.0 |
| **🐳 Docker** | Containerization | Latest |

---

## 🚀 Quick Start

### Prerequisites
*   [Node.js (v20+)](https://nodejs.org/) & [npm](https://www.npmjs.com/)
*   [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/) & Maven 3.9+
*   [MySQL Server](https://dev.mysql.com/downloads/installer/)

---

### 🎯 Frontend Setup (Root Directory)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup environment variables (create a `.env.local` file in the root):
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_WS_URL=ws://localhost:8080/ws
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

### ⚙️ Backend Setup (backend Directory)
1. Create a MySQL database schema:
   ```sql
   CREATE DATABASE luminavibe;
   ```
2. Update database credentials in [application.properties](file:///c:/Users/aksha/OneDrive/Desktop/LuminaVibe/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/luminavibe
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```
3. Navigate to the backend directory:
   ```bash
   cd backend
   ```
4. Build and run the project:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

---

### 🐳 Docker Setup (Optional)
```bash
# Start MySQL and container services
docker-compose up -d

# Stop services
docker-compose down
```

---

## 📊 API Endpoints

### 🔐 Authentication
```typescript
POST   /api/v1/auth/register          // Register new user
POST   /api/v1/auth/login             // Login user
POST   /api/v1/auth/refresh-token     // Refresh JWT token
POST   /api/v1/auth/logout            // Logout user
```

### 👤 User Management
```typescript
GET    /api/v1/users/me               // Get current user profile
PUT    /api/v1/users/me               // Update profile
GET    /api/v1/users/{username}       // Get user by username
POST   /api/v1/users/{id}/follow      // Follow user
DELETE /api/v1/users/{id}/follow      // Unfollow user
```

### 📝 Posts
```typescript
GET    /api/v1/posts                  // Get feed posts
POST   /api/v1/posts                  // Create post
GET    /api/v1/posts/{id}             // Get post by ID
PUT    /api/v1/posts/{id}             // Update post
DELETE /api/v1/posts/{id}             // Delete post
POST   /api/v1/posts/{id}/like        // Like post
DELETE /api/v1/posts/{id}/like        // Unlike post
GET    /api/v1/posts/{id}/comments    // Get comments
POST   /api/v1/posts/{id}/comments    // Add comment
```

---

## 🏗️ Project Structure

### Frontend Structure (Root Directory)
```text
LuminaVibe/
├── public/               # Public assets
├── src/
│   ├── api/              # API Client (Axios settings)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom hooks
│   ├── pages/            # View pages / routes
│   ├── styles/           # Main CSS styles
│   ├── App.jsx           # App wrapper
│   └── main.jsx          # App entrypoint
├── package.json          # Frontend packages
└── vite.config.js        # Vite config
```

### Backend Structure (backend Subdirectory)
```text
LuminaVibe/backend/
├── src/main/java/com/luminavibe/
│   ├── controllers/      # REST API controllers
│   ├── services/         # Business logic
│   ├── repositories/     # Spring Data JPA repositories
│   ├── entities/         # JPA entities
│   ├── dtos/             # Data Transfer Objects
│   └── LuminavibeApplication.java
├── src/main/resources/
│   └── application.properties # DB & Security properties
└── pom.xml               # Maven configuration
```

---

## 🔒 Security Features
*   ✅ **JWT with Refresh Token Rotation**
*   ✅ **CORS Configuration**
*   ✅ **Password Encryption (BCrypt)**
*   ✅ **Input Validation & Sanitization**
*   ✅ **SQL Injection Prevention** (JPA Prepared Statements)

---

## 🧪 Testing
```bash
# Frontend unit tests
npm run test

# Backend unit & integration tests
cd backend
mvn test
```

---

## 📈 Performance Optimizations
*   ⚡ Code Splitting with `React.lazy()`
*   🖼️ Image Optimization & Lazy Loading
*   💾 Query Optimization & Indexing in MySQL

---

## 👥 Creator & Contributors
*   **Akshay Gohrava** — *Creator & Lead Full-Stack Developer* — [@Akshaygohrava](https://github.com/Akshaygohrava)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

Made with ❤️ by [Akshay Gohrava](https://github.com/Akshaygohrava)

[⬆ Back to Top](#-luminavibe---next-gen-social-media-experience-)

</div>