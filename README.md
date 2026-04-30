# 🛍️ ShopNow — Full-Stack E-Commerce Application

A complete, production-ready e-commerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Includes a full product catalog, shopping cart, order tracking, user authentication, and a rich admin panel.

---

## 📋 Features

### Customer-Facing
- 🏠 **Home Page** — Hero banner, featured products, category browsing
- 🔍 **Product Catalog** — Search, filter by category/price, sort, pagination
- 📦 **Product Detail** — Image gallery, reviews & ratings, add to cart
- 🛒 **Shopping Cart** — Real-time cart management with quantity controls
- 💳 **Checkout** — Multi-step (Shipping → Payment → Review)
- 📋 **Order Tracking** — Status timeline, cancel orders
- 👤 **User Profile** — Edit info, address, change password

### Admin Panel (`/admin`)
- 📊 **Dashboard** — Revenue stats, recent orders, top products
- 📦 **Product Management** — Full CRUD, stock management
- 🛒 **Order Management** — View all orders, update status, add tracking
- 👥 **User Management** — Role control, activate/deactivate users

### Authentication & Security
- JWT-based authentication
- Role-based access control (Admin / User)
- Protected routes (frontend & backend)
- Password hashing with bcryptjs

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ 
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

---

### 1. Clone & Install

```bash
# Install all dependencies (root + backend + frontend)
npm run install-all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Configure Environment

```bash
# Copy the example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

For the frontend, create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Admin user: `admin@example.com` / `admin123`
- ✅ Regular user: `user@example.com` / `user123`
- ✅ 12 sample products across categories
- ✅ 2 sample orders

---

### 4. Start the Application

```bash
# Start both backend and frontend concurrently
npm run dev
```

Or start separately:
```bash
# Terminal 1 — Backend (port 5000)
npm run start:backend

# Terminal 2 — Frontend (port 3000)
npm run start:frontend
```

Open: **http://localhost:3000**

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   └── seed.js               # Database seeder
│   ├── controllers/
│   │   ├── authController.js     # Login, register, profile
│   │   ├── productController.js  # Product CRUD, reviews
│   │   ├── orderController.js    # Order creation, tracking
│   │   ├── cartController.js     # Cart operations
│   │   └── userController.js     # Admin user management
│   ├── middleware/
│   │   └── auth.js               # JWT protect & authorize
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product + reviews schema
│   │   ├── Order.js              # Order + items schema
│   │   └── Cart.js               # Cart schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   └── users.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api.js                # Axios API calls
│       ├── App.js                # Routes & layout
│       ├── index.js
│       ├── context/
│       │   ├── AuthContext.js    # Auth state
│       │   └── CartContext.js    # Cart state
│       ├── components/
│       │   ├── Admin/
│       │   │   ├── AdminLayout.js
│       │   │   ├── AdminDashboard.js
│       │   │   ├── AdminProducts.js
│       │   │   ├── AdminOrders.js
│       │   │   └── AdminUsers.js
│       │   ├── Auth/
│       │   │   └── PrivateRoute.js
│       │   ├── Layout/
│       │   │   ├── Navbar.js
│       │   │   └── Footer.js
│       │   └── Products/
│       │       └── ProductCard.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Products.js
│       │   ├── ProductDetail.js
│       │   ├── Cart.js
│       │   ├── Checkout.js
│       │   ├── Orders.js
│       │   ├── Auth.js
│       │   └── Profile.js
│       └── styles/
│           └── global.css
│
├── package.json                  # Root scripts
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |
| PUT | `/api/auth/change-password` | Private |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| GET | `/api/products/categories` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| POST | `/api/products/:id/reviews` | Private |

### Cart
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/cart` | Private |
| POST | `/api/cart` | Private |
| PUT | `/api/cart/:productId` | Private |
| DELETE | `/api/cart/:productId` | Private |
| DELETE | `/api/cart` | Private |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Private |
| GET | `/api/orders/my-orders` | Private |
| GET | `/api/orders/:id` | Private |
| PUT | `/api/orders/:id/cancel` | Private |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |

### Users (Admin)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Admin |
| PUT | `/api/users/:id` | Admin |
| DELETE | `/api/users/:id` | Admin |
| GET | `/api/users/dashboard/stats` | Admin |

---

## 🗄️ Database (MongoDB)

This app uses **MongoDB** with Mongoose. To use **PostgreSQL** instead:
1. Replace Mongoose with **Sequelize** or **Prisma**
2. Adapt models to use SQL table definitions
3. Update associations (User hasMany Orders, etc.)

To use **Atlas** (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

---

## 🌐 Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables in the platform
2. Set `NODE_ENV=production`
3. Deploy from `/backend`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-api.railway.app/api`
2. Build command: `npm run build`
3. Output directory: `build`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcryptjs |
| Notifications | React Toastify |

---

## 📝 License

MIT — Free to use for learning and projects.

---

**Built for:** E-Commerce Web Application Assignment  
**Due Date:** 20 May 2026
