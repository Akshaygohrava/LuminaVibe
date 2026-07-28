LuminaVibe - Next-Gen Social Media Experience ✨
<div align="center">
https://via.placeholder.com/1200x400/6C63FF/FFFFFF?text=LuminaVibe+Social+Media+App

https://img.shields.io/badge/Live_Demo-FF6B6B?style=for-the-badge&logo=vercel&logoColor=white
https://img.shields.io/badge/API_Docs-6C63FF?style=for-the-badge&logo=spring&logoColor=white
https://img.shields.io/badge/License-MIT-4ECDC4?style=for-the-badge

</div>
🌟 Overview
LuminaVibe is a modern, full-stack social media platform that brings people together through shared moments. Built with cutting-edge technologies, it delivers a seamless, real-time social experience with a beautiful and responsive user interface.

<div align="center">
https://skillicons.dev/icons?i=react,vite,tailwindcss,spring,postgresql,redis,docker,aws

</div>
🚀 Live Demo & Resources
Resource	Link
🌐 Live Application	luminavibe.vercel.app
📡 Backend API	api.luminavibe.com
📚 API Documentation	Swagger UI
🎨 Figma Design	View Designs
📖 Postman Collection	Download Collection
✨ Features
🎯 Core Features
Category	Features	Status
👤 User Management	Registration, Login, OAuth2 (Google/GitHub), Profile Management, Account Settings	✅
📝 Posts	Create, Edit, Delete, Rich Text, Image Upload, Video Support, Hashtags, Mentions	✅
💬 Social Interactions	Likes, Comments, Replies, Shares, Bookmarks, Reactions	✅
🔗 Connections	Follow/Unfollow, Friend Requests, Block Users, Close Friends	✅
🔒 Privacy	Public/Private Accounts, Story Privacy, Custom Audience Lists	✅
🎨 Rich Media Features
Category	Features	Status
📸 Stories	24hr Stories, Highlights, AR Filters, Music Stickers	✅
🎥 Reels	Short Videos, Video Editing, Audio Sync, Trending Sounds	✅
💭 Messages	Real-time Chat, Group Chats, Voice Messages, File Sharing	✅
🔴 Live Streaming	Go Live, Viewer Comments, Gifts, Co-streaming	🚧
📊 Analytics	Profile Insights, Post Performance, Audience Demographics	✅
🎯 Engagement Features
Category	Features	Status
🏆 Gamification	Achievements, Badges, Streaks, Leaderboards	✅
💰 Monetization	Creator Fund, Subscriptions, Tips, Shop Integration	🚧
🗳️ Polls & Quizzes	Interactive Polls, Quizzes, Q&A Sessions	✅
📅 Events	Create Events, RSVP, Reminders, Live Coverage	✅
🤖 AI Features	Smart Filters, Content Suggestions, Auto-hashtags	🚧
🛠️ Technology Stack
Frontend 🎨






Technology	Purpose	Version
⚛️ React	UI Library	v19.0.0
⚡ Vite	Build Tool	v6.0.0
🎨 TailwindCSS	Utility-first CSS	v4.0.0
🎭 Framer Motion	Animations	v11.0.0
📡 TanStack Query	Server State Management	v5.0.0
🧭 React Router	Client-side Routing	v7.0.0
📋 React Hook Form	Form Management	v7.0.0
✅ Zod	Schema Validation	v3.0.0
🎯 Zustand	Client State Management	v5.0.0
🔔 Sonner	Toast Notifications	v2.0.0
Backend ⚙️








Technology	Purpose	Version
🍃 Spring Boot	Application Framework	v3.4.0
🔐 Spring Security	Authentication/Authorization	v6.4.0
🔑 JWT (JJWT)	Token-based Auth	v0.12.0
📊 Spring Data JPA	Data Access Layer	v3.4.0
🔄 Hibernate	ORM Framework	v6.6.0
🗄️ PostgreSQL	Primary Database	v16.0
⚡ Redis	Caching & Session	v7.2
📦 MinIO	Object Storage	vRELEASE.2024
🔍 Elasticsearch	Search Engine	v8.15
🚀 Apache Kafka	Message Queue	v3.9
📝 Swagger/OpenAPI	API Documentation	v2.6
☁️ Docker	Containerization	Latest
🚀 Quick Start
Prerequisites
Node.js 20+ & npm 10+

Java 21 & Maven 3.9+

PostgreSQL 16+

Redis 7+

Docker & Docker Compose (optional)

🎯 Frontend Setup
bash
# Clone the repository
git clone https://github.com/yourusername/luminavibe.git
cd luminavibe/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
<details> <summary>📁 Frontend Environment Variables</summary>
env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/ws
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ANALYTICS_ID=your_analytics_id
</details>
⚙️ Backend Setup
bash
# Navigate to backend directory
cd luminavibe/backend

# Build the project
mvn clean install

# Run with development profile
mvn spring-boot:run -Dspring.profiles.active=dev
<details> <summary>📁 Backend Environment Variables</summary>
properties
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/luminavibe
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password

# JWT Configuration
JWT_SECRET_KEY=your-256-bit-secret-key-here-make-it-long
JWT_EXPIRATION_MS=86400000
JWT_REFRESH_EXPIRATION_MS=604800000

# OAuth2 Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Redis Configuration
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# MinIO Configuration
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
</details>
🐳 Docker Setup (Full Stack)
bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
📊 API Endpoints
🔐 Authentication
typescript
POST   /api/v1/auth/register          // Register new user
POST   /api/v1/auth/login             // Login user
POST   /api/v1/auth/refresh-token     // Refresh JWT token
POST   /api/v1/auth/logout            // Logout user
POST   /api/v1/auth/forgot-password   // Request password reset
👤 User Management
typescript
GET    /api/v1/users/me               // Get current user profile
PUT    /api/v1/users/me               // Update profile
GET    /api/v1/users/{username}       // Get user by username
POST   /api/v1/users/{id}/follow      // Follow user
DELETE /api/v1/users/{id}/follow      // Unfollow user
GET    /api/v1/users/{id}/followers   // Get followers
GET    /api/v1/users/{id}/following   // Get following
📝 Posts
typescript
GET    /api/v1/posts                  // Get feed posts
POST   /api/v1/posts                  // Create post
GET    /api/v1/posts/{id}             // Get post by ID
PUT    /api/v1/posts/{id}             // Update post
DELETE /api/v1/posts/{id}             // Delete post
POST   /api/v1/posts/{id}/like        // Like post
DELETE /api/v1/posts/{id}/like        // Unlike post
GET    /api/v1/posts/{id}/comments    // Get comments
POST   /api/v1/posts/{id}/comments    // Add comment
💬 Messages
typescript
GET    /api/v1/messages/conversations // Get conversations
GET    /api/v1/messages/{conversationId} // Get messages
POST   /api/v1/messages               // Send message
DELETE /api/v1/messages/{id}          // Delete message
🏗️ Project Structure
Frontend Structure
text
frontend/
├── public/
│   ├── images/
│   └── locales/          # i18n translations
├── src/
│   ├── api/              # API client & endpoints
│   ├── components/       # Reusable components
│   │   ├── ui/          # Shadcn UI components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities & helpers
│   ├── pages/            # Route pages
│   ├── stores/           # Zustand stores
│   ├── styles/           # Global styles
│   └── types/            # TypeScript types
├── .env.example
├── tailwind.config.ts
└── vite.config.ts
Backend Structure
text
backend/
├── src/main/java/com/luminavibe/
│   ├── config/           # Security & app config
│   ├── controller/       # REST controllers
│   ├── service/          # Business logic
│   ├── repository/       # Data access layer
│   ├── model/            # Entity classes
│   ├── dto/              # Data transfer objects
│   ├── security/         # JWT & security utils
│   ├── exception/        # Custom exceptions
│   └── util/             # Utility classes
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/     # Flyway migrations
└── pom.xml
🎨 UI Screens
<details> <summary>📱 Mobile Screens (Click to expand)</summary>
Login	Feed	Profile	Chat
https://via.placeholder.com/200x400/6C63FF/FFFFFF?text=Login	https://via.placeholder.com/200x400/FF6B6B/FFFFFF?text=Feed	https://via.placeholder.com/200x400/4ECDC4/FFFFFF?text=Profile	https://via.placeholder.com/200x400/45B7D1/FFFFFF?text=Chat
</details>
🔒 Security Features
✅ JWT with Refresh Token Rotation

✅ CSRF Protection

✅ XSS Prevention

✅ Rate Limiting

✅ Input Validation & Sanitization

✅ SQL Injection Prevention (JPA Prepared Statements)

✅ File Upload Validation

✅ CORS Configuration

✅ Password Encryption (BCrypt)

✅ Two-Factor Authentication (2FA)

✅ Session Management

✅ API Key Rotation

🚀 Deployment
Frontend Deployment (Vercel)
bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
Backend Deployment (AWS/Docker)
bash
# Build Docker image
docker build -t luminavibe-api .

# Push to container registry
docker push your-registry/luminavibe-api:latest

# Deploy to ECS/Kubernetes
kubectl apply -f k8s/deployment.yaml
🧪 Testing
bash
# Frontend Tests
cd frontend
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
npm run test:coverage # Test coverage

# Backend Tests
cd backend
mvn test              # Run unit tests
mvn verify            # Run integration tests
mvn jacoco:report     # Generate coverage report
📈 Performance Optimizations
⚡ Code Splitting with React.lazy()

🖼️ Image Optimization & Lazy Loading

📦 Bundle Analysis & Tree Shaking

🔄 Infinite Scroll with Virtualization

📡 GraphQL for Complex Queries (Upcoming)

💾 Redis Caching for Frequently Accessed Data

🗄️ Database Indexing & Query Optimization

🔄 Background Jobs for Heavy Tasks

🤝 Contributing
We welcome contributions! Please see our Contributing Guide.

bash
# Create a new branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
👥 Team
Role	Name	GitHub
🎨 Frontend Lead	Sarah Chen	@sarahchen
⚙️ Backend Lead	Alex Kumar	@alexkumar
🎯 Full Stack	Mike Johnson	@mikejohnson
🎨 UI/UX Designer	Lisa Wang	@lisawang
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🌟 Support
If you find this project helpful, please give it a ⭐️ on GitHub!

<div align="center">
https://api.star-history.com/svg?repos=yourusername/luminavibe&type=Date

Made with ❤️ by the LuminaVibe Team
</div>
<div align="center">
⬆ Back to Top

</div>
