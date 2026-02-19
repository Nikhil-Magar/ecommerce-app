# 🛒 E-Commerce Website

A modern, full-featured e-commerce web application built with **React.js**, **Node.js**, and **MongoDB** — complete with a customer storefront, secure authentication, and a powerful admin analytics dashboard.

---

## 🚀 Features

### 🛍 Customer Side
- Browse and search products
- Filter by product categories
- Add items to cart
- Checkout system with order placement
- View order history

### 🔐 Authentication
- User Login / Signup
- Secure session management

### 🧑‍💼 Admin Panel
- Product management (add, edit, delete)
- Order management and tracking
- Analytics dashboard with sales insights
- Revenue tracking and top product analysis

---

## 🛠 Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React.js          |
| Backend   | Node.js, Express  |
| Database  | MongoDB           |

---

## 📦 Installation

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app
```

### 2. Install Backend Dependencies

```bash
cd back-end
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `back-end/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Install Frontend Dependencies

```bash
cd ../front-end
npm install
```

### 5. Run the Application

**Start the backend:**
```bash
cd back-end
npm run dev
```

**Start the frontend:**
```bash
cd front-end
npm start
```

The app will be running at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## 💡 Usage

### As a Customer
1. Register or log in to your account.
2. Browse products and filter by category.
3. Add items to your cart and proceed to checkout.
4. Place your order and track it via Order History.

### As an Admin
1. Log in with admin credentials.
2. Navigate to the **Admin Panel** from the dashboard.
3. Manage products — add new listings, update details, or remove items.
4. View and manage incoming orders.
5. Explore the **Analytics Dashboard** for sales insights, revenue tracking, and top-performing products.

---

## 📁 Project Structure

```
ecommerce-app/
├── back-end/                  # Node.js + Express backend
│   ├── models/
│   │   ├── Product.js
│   │   └── Users.js
│   ├── roots/
│   │   └── package.json
│   ├── routes/
│   │   ├── categories.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── Users.js
│   ├── .env
│   ├── package.json
│   └── Server.js
├── front-end/                 # React frontend
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
├── images/
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for improvements, bug fixes, or new features.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
