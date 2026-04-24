# FoodDeliveryPlatform_Java

Foodly Flow is a full-stack food delivery platform upgraded from the original Java student project into a Spring Boot REST API plus a React + Tailwind frontend. It now supports authentication, restaurant browsing, menu exploration, cart management, order placement, and a small admin dashboard for restaurant and order operations.

## Project Overview

This repo is structured like a real product instead of a single-file demo:

```text
FoodDeliveryPlatform_Java/
├── backend/   Spring Boot REST API
├── frontend/  React + Vite + Tailwind client
├── LICENSE
├── README.md
└── Report.pdf
```

## Features

### Customer Features

- User signup and login with JWT authentication
- Browse restaurants and search by name or cuisine
- View restaurant details and menu items
- Add items to cart, update quantity, and clear cart
- Place orders with address and payment method
- View order history with tracking code and status

### Admin Features

- Create and update restaurants
- Add, update, and delete menu items
- View all orders
- Progress order status through the delivery lifecycle

## Tech Stack

### Backend

- Java 21
- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- PostgreSQL-ready datasource support
- H2 in-memory database for quick local development

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React icons

## Screens / UI Included

- Login page
- Signup page
- Home page with restaurant list
- Restaurant details and menu page
- Cart page
- Orders page
- Admin dashboard

## Demo Credentials

These are seeded automatically by the backend:

- Admin: `admin@foodly.dev` / `Admin@123`
- User: `user@foodly.dev` / `User@123`

## Backend API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Restaurants and Menu

- `GET /api/restaurants`
- `GET /api/restaurants/{restaurantId}`
- `GET /api/restaurants/{restaurantId}/menu`

### Cart

- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/items/{cartItemId}`
- `DELETE /api/cart/items/{cartItemId}`
- `DELETE /api/cart`

### Orders

- `POST /api/order/place`
- `GET /api/order/my`

### Admin

- `POST /api/admin/restaurants`
- `PUT /api/admin/restaurants/{restaurantId}`
- `POST /api/admin/restaurants/{restaurantId}/menu`
- `PUT /api/admin/menu/{menuItemId}`
- `DELETE /api/admin/menu/{menuItemId}`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{orderId}/status`

## Environment Configuration

### Backend

Backend config lives in [backend/src/main/resources/application.properties](/C:/VSC/FoodDeliveryPlatform_Java/backend/src/main/resources/application.properties).

The backend runs with H2 by default, but you can switch to PostgreSQL using environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_DATASOURCE_DRIVER_CLASS_NAME`
- `APP_JWT_SECRET`
- `APP_JWT_EXPIRATION_MS`

Example PostgreSQL datasource:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/fooddelivery
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
```

### Frontend

Frontend optionally uses:

- `VITE_API_BASE_URL`

Default:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## How To Run

### Backend

1. Install Maven if it is not available on your machine.
2. Open a terminal in `backend/`.
3. Run:

```bash
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.

### Frontend

1. Open a terminal in `frontend/`.
2. Install dependencies:

```bash
npm install
```

3. Start the Vite dev server:

```bash
npm run dev
```

The frontend starts at `http://localhost:5173`.

## Notes

- The old Swing-based `App.java` and compiled `.class` artifacts were removed so the repo now reflects the new full-stack structure cleanly.
- The backend currently defaults to H2 for zero-setup local development, but the config is ready for PostgreSQL.
- If you want screenshots in the README, the cleanest next step is to run the app locally and capture the login, home, cart, orders, and admin pages.
