# 🌟 LuminaVibe

A feature-rich, high-performance social networking web application designed to connect people seamlessly. Built using modern frontend technologies and a robust Spring Boot micro-services backend.

<div align="center">

[![Live Preview](https://img.shields.io/badge/Live_Preview-Demo-brightgreen?style=for-the-badge&logo=vercel&logoColor=white)](https://luminavibe.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)

</div>

---

## 🚀 Key Features

*   **🔒 Secure Authentication**: Robust signup, login, and token-based session management using JWT (JSON Web Tokens) and Spring Security.
*   **📝 Dynamic Feed**: User post creation (text and media support) with instant feed updates.
*   **💬 Social Engagements**: Seamless interactions including liking posts, posting comments, and sharing content.
*   **👥 Connections**: User profiles with custom connection settings, follow/unfollow capability, and personalized recommendations.
*   **🔍 Advanced Search**: Real-time global search for profiles, posts, and trending tags.
*   **🎨 Responsive Layout**: Premium look and feel with Tailwind CSS, including customizable components.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (Vite)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **API Client**: [Axios](https://axios-http.com/)
*   **Form Handling**: React Form handling & validation

### Backend
*   **Framework**: [Spring Boot](https://spring.io/projects/spring-boot)
*   **Data Access**: Spring Data JPA & [Hibernate](https://hibernate.org/)
*   **Security**: [Spring Security](https://spring.io/projects/spring-security) & [JSON Web Token (JWT)](https://jwt.io/)
*   **Database**: [MySQL](https://www.mysql.com/)

---

## 📂 Project Structure

```text
LuminaVibe/
├── backend/            # Spring Boot Maven Project
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/luminavibe/    # Controllers, Entities, Repositories, Services
│   │   │   └── resources/              # Application configurations & properties
│   └── pom.xml         # Maven dependencies
├── src/                # React Frontend Source
│   ├── components/     # UI Components (SignIn, SignUp, LandingPage, etc.)
│   ├── pages/          # Application Pages
│   └── App.jsx         # App Entry Point
├── package.json        # Frontend dependencies
└── vite.config.js      # Vite Configuration
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
*   [Node.js (v18+)](https://nodejs.org/)
*   [MySQL Server](https://dev.mysql.com/downloads/installer/)

### 1. Database Setup
1. Open your MySQL client and create a new schema/database:
   ```sql
   CREATE DATABASE luminavibe;
   ```
2. Update the credentials in [application.properties](file:///c:/Users/aksha/OneDrive/Desktop/LuminaVibe/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/luminavibe
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### 2. Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Frontend App
1. Navigate back to the root directory and install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and view the application at `http://localhost:5173`.

---

## 👥 Authors & Contributors

*   **Akshay Gohrava** — *Initial Work & Architecture* — [GitHub Profile](https://github.com/Akshaygohrava)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
