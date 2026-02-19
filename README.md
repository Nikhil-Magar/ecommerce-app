🛒 E-Commerce Website

A modern full-featured e-commerce web application built using React.js with local database storage and admin analytics dashboard.

🚀 Features
🛍 Customer Side

Browse products

Product categories

Add to cart

Checkout system

Order placement

Order history

🔐 Authentication

Login / Signup

User session management

🧑‍💼 Admin Panel

Product management

Order management

Analytics dashboard

Sales insights

Revenue tracking

Top product analysis

📊 Analytics Includes

Revenue by month

Top selling products

Orders by status

Category breakdown

Average order value

🧰 Tech Stack
Frontend

React.js

React Router

CSS / Custom Styling

Storage

IndexedDB (Local Database)

Development Tools

ESLint

Webpack

PostCSS

📁 Project Structure
src/
 ├ components/
 │ ├ admin/
 │ │ ├ Analytics.js
 │ │ └ AdminDashboard.js
 │ └ common/
 │
 ├ pages/
 │ ├ Welcome.js
 │ ├ Home.js
 │ ├ Login.js
 │ └ Signup.js
 │
 ├ db/
 │ └ indexedDB.js
 │
 ├ App.js
 └ index.js

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone <your-repo-url>
cd my-app

2️⃣ Install Dependencies
npm install

3️⃣ Run Development Server
npm start


App will run on:

http://localhost:3000

📦 Build for Production
npm run build

🗄 Database

This project uses IndexedDB for local storage.

Stores:

Products

Orders

Users (if implemented)

📈 Admin Analytics Logic

Analytics calculates:

Sales filtered by time range

Product sales quantity

Monthly revenue

Category distribution

Order status counts

🧪 Future Improvements (Optional Ideas)

Payment Gateway Integration

Cloud Database (MongoDB / Firebase)

Real Charts (Chart.js / Recharts)

Product Image Upload

Email Notifications

Real-time Order Tracking

Role-based Admin Access

🎨 UI Features

Animated Welcome Page

Gradient UI Theme

Responsive Layout

Modern Dashboard Cards

Interactive Charts UI
