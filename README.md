# E-Commerce App (Assignment 2)

## Backend (Express + MongoDB)
1. cd backend
2. npm install
3. create .env:
   PORT=5000
   MONGO_URI=your_mongo_conn
   JWT_SECRET=some_secret
4. npm run dev
API base: http://localhost:5000/api

## Frontend (Expo React Native)
1. cd frontend
2. npm install
3. edit src/api/api.js -> baseURL to your backend (e.g. http://192.168.x.x:5000/api)
4. npx expo start

## Screenshots
(Add screenshots of Home, Product, Cart, Checkout, Order Confirmation, Profile, Category)

## Flow
- User logs in -> token stored; axios header set.
- Add to cart -> POST /api/cart/add -> update cart.
- Checkout -> POST /api/orders/checkout -> order created; cart cleared.

