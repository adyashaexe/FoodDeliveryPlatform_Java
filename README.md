<div align="center">

# 🍽️ ByteBite — Food Delivery Platform

**A full-stack food delivery application built with Spring Boot and React**

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: Unlicense](https://img.shields.io/badge/License-Unlicense-lightgrey?style=flat-square)](https://unlicense.org/)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Project Structure](#-project-structure)

</div>

---

## Overview

ByteBite is a production-style food delivery platform evolved from a Java OOP university project into a full-stack application. It demonstrates REST API design with Spring Boot, JWT-based authentication, and a responsive React frontend with cart management, order placement, and an admin dashboard.

The backend runs on H2 in-memory by default — no database setup needed to get started — and is pre-configured to switch to PostgreSQL for production.

---

## ✨ Features

### For Customers
- Sign up and log in with JWT authentication
- Browse and search restaurants by name or cuisine
- Explore menus and add items to cart
- Adjust quantities and clear cart at any time
- Place orders with delivery address and payment method
- View order history with live tracking status

### For Admins
- Create and update restaurant listings
- Manage menu items (add, edit, delete)
- View all orders across the platform
- Advance order status through the delivery lifecycle

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3 |
| Auth | Spring Security + JWT |
| ORM | Spring Data JPA / Hibernate |
| Database (dev) | H2 in-memory |
| Database (prod) | PostgreSQL |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| HTTP client | Axios |
| Routing | React Router |
| Icons | Lucide React |

---

## 📁 Project Structure

```
FoodDeliveryPlatform_Java/
├── backend/
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/bytebite/
│           │       ├── auth/          # JWT, security config, user auth
│           │       ├── cart/          # Cart entity, service, controller
│           │       ├── menu/          # MenuItem entity, service, controller
│           │       ├── order/         # Order entity, service, controller
│           │       ├── restaurant/    # Restaurant entity, service, controller
│           │       └── admin/         # Admin-only controllers
│           └── resources/
│               └── application.properties
├── frontend/
│   ├── src/
│   │   ├── pages/                     # Login, Signup, Home, Cart, Orders, Admin
│   │   ├── components/                # Shared UI components
│   │   └── api/                       # Axios instances and service calls
│   ├── index.html
│   └── vite.config.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Maven 3.8+
- Node.js 18+
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/adyashaexe/FoodDeliveryPlatform_Java.git
cd FoodDeliveryPlatform_Java
```

### 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.  
The H2 console is available at `http://localhost:8080/h2-console` in development.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`.

---

## 🐳 Docker (optional)

Spin up the full stack — backend, frontend, and PostgreSQL — with a single command:

```bash
docker compose up --build
```

> Make sure Docker Desktop is running before you execute this.

| Service | Port |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

## 🔐 Demo Credentials

These accounts are seeded automatically when the backend starts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@bytebite.dev` | `Admin@123` |
| Customer | `user@bytebite.dev` | `User@123` |

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive JWT |
| `GET` | `/api/auth/me` | Get current authenticated user |

### Restaurants & Menu

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/restaurants` | List all restaurants |
| `GET` | `/api/restaurants/{id}` | Get restaurant details |
| `GET` | `/api/restaurants/{id}/menu` | Get menu for a restaurant |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cart` | Get current user's cart |
| `POST` | `/api/cart/add` | Add item to cart |
| `PUT` | `/api/cart/items/{itemId}` | Update item quantity |
| `DELETE` | `/api/cart/items/{itemId}` | Remove item from cart |
| `DELETE` | `/api/cart` | Clear entire cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/order/place` | Place an order |
| `GET` | `/api/order/my` | Get current user's order history |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/restaurants` | Create a restaurant |
| `PUT` | `/api/admin/restaurants/{id}` | Update a restaurant |
| `POST` | `/api/admin/restaurants/{id}/menu` | Add menu item |
| `PUT` | `/api/admin/menu/{itemId}` | Update menu item |
| `DELETE` | `/api/admin/menu/{itemId}` | Delete menu item |
| `GET` | `/api/admin/orders` | View all orders |
| `PUT` | `/api/admin/orders/{id}/status` | Advance order status |

All protected endpoints require the header:

```
Authorization: Bearer <your_jwt_token>
```

---

## ⚙️ Environment Configuration

### Backend — `backend/src/main/resources/application.properties`

The backend defaults to H2 for zero-configuration local development. To switch to PostgreSQL, set these environment variables:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bytebite
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
APP_JWT_SECRET=your-secret-key-at-least-256-bits-long
APP_JWT_EXPIRATION_MS=86400000
```

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🧪 Running Tests

```bash
# Backend unit and integration tests
cd backend
mvn test

# Frontend (if configured)
cd frontend
npm run test
```

---

## 🗺 Roadmap

- [ ] Real-time order tracking with WebSockets
- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Restaurant ratings and reviews
- [ ] Push notifications for order status updates
- [ ] Mobile app (React Native)
- [ ] CI/CD pipeline with GitHub Actions

---

## 🤝 Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is released into the public domain under the [Unlicense](LICENSE).

---

<div align="center">
Built with ☕ and Spring Boot by <a href="https://github.com/adyashaexe">adyashaexe</a>
</div>