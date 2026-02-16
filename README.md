# 🚗 Premier Limo - Luxury Car Rental System

A full-stack luxury car rental application built with the MERN stack, featuring a modern UI, multi-language support, and comprehensive admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Modules & Components](#-modules--components)
- [Contributing](#-contributing)

---

## ✨ Features

### Customer Features
- 🔐 **User Authentication** - Secure signup/login with JWT
- 🚙 **Car Browsing** - Browse luxury cars with filters and search
- 📅 **Booking System** - Real-time booking with date selection
- 💳 **Payment Processing** - Multiple payment methods support
- 📄 **Invoice Generation** - Downloadable/printable invoices
- 👤 **Profile Management** - Update profile with image upload
- 📊 **Dashboard** - Track bookings, payments, and history
- 🌍 **Multi-language** - Support for English, Spanish, French, German
- 📱 **Responsive Design** - Optimized for all devices

### Admin Features
- 📊 **Analytics Dashboard** - Real-time statistics and metrics
- 🚗 **Fleet Management** - Add, edit, delete vehicles
- 📸 **Image Upload** - ImageKit.io integration for car images
- 📋 **Booking Management** - Approve/deny booking requests
- 👥 **Customer Management** - View and manage customers
- 💰 **Payment Tracking** - Monitor all transactions
- 🔍 **Search & Filter** - Advanced filtering capabilities

### UI/UX Features
- 🎨 **Modern Design** - Glassmorphism and smooth animations
- 🎬 **Framer Motion** - Smooth page transitions
- 🌙 **Video Background** - Immersive homepage experience
- 📜 **Scroll Effects** - Dynamic navbar on scroll
- 🎯 **Single Page Feel** - Persistent background across routes

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **Vite** | 5.4.10 | Build tool & dev server |
| **React Router DOM** | 7.13.0 | Client-side routing |
| **Axios** | 1.13.5 | HTTP client |
| **Framer Motion** | 12.34.0 | Animations |
| **i18next** | 25.8.10 | Internationalization |
| **react-i18next** | 16.5.4 | React i18n bindings |
| **Lucide React** | 0.564.0 | Icon library |
| **React Easy Crop** | 5.5.6 | Image cropping |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | >=14.0.0 | Runtime environment |
| **Express** | 5.2.1 | Web framework |
| **MongoDB** | - | Database |
| **Mongoose** | 9.2.1 | ODM for MongoDB |
| **JWT** | 9.0.3 | Authentication |
| **bcryptjs** | 3.0.3 | Password hashing |
| **CORS** | 2.8.6 | Cross-origin requests |
| **dotenv** | 17.3.1 | Environment variables |
| **ImageKit** | 6.0.0 | Image CDN & upload |

### Development Tools
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting
- **CSS Modules** - Scoped styling

---

## 📁 Project Structure

```
Car Rental/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── carController.js       # Car CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Car.js                 # Car schema
│   │   ├── Booking.js             # Booking schema
│   │   └── Payment.js             # Payment schema
│   ├── routes/
│   │   ├── auth.js                # Auth routes
│   │   ├── car.js                 # Car routes
│   │   ├── booking.js             # Booking routes
│   │   ├── payment.js             # Payment routes
│   │   ├── admin.js               # Admin routes
│   │   └── imagekit.js            # ImageKit routes
│   ├── .env                       # Environment variables
│   ├── server.js                  # Entry point
│   ├── seedAdmin.js               # Admin seeder
│   ├── seedCars.js                # Car seeder
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── videos/                # Background videos
│   ├── src/
│   │   ├── assets/                # Static assets
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Navbar.module.css
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Footer.module.css
│   │   │   ├── cars/
│   │   │   │   ├── CarCard.jsx
│   │   │   │   ├── CarFilter.jsx
│   │   │   │   └── CarSearch.jsx
│   │   │   ├── home/              # Home page components
│   │   │   └── dashboard/         # Dashboard components
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Cars.jsx
│   │   │   ├── CarDetails.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── FleetManagement.jsx
│   │   │   └── user/
│   │   │       ├── UserDashboard.jsx
│   │   │       ├── UserBookings.jsx
│   │   │       ├── UserProfile.jsx
│   │   │       ├── UserPayments.jsx
│   │   │       ├── UserSettings.jsx
│   │   │       ├── UserLicense.jsx
│   │   │       ├── Payment.jsx
│   │   │       ├── Invoice.jsx
│   │   │       └── DashboardNav.jsx
│   │   ├── locales/
│   │   │   ├── en.json            # English translations
│   │   │   ├── es.json            # Spanish translations
│   │   │   ├── fr.json            # French translations
│   │   │   └── de.json            # German translations
│   │   ├── services/
│   │   │   └── api.js             # Axios configuration
│   │   ├── utils/
│   │   │   └── helpers.js         # Utility functions
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css
│   │   ├── index.css              # Global styles
│   │   ├── i18n.js                # i18n configuration
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

### Collections Overview

The application uses MongoDB with 4 main collections:

#### 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  phone: String,
  address: String,
  image: String (profile picture URL),
  createdAt: Date
}
```

#### 2. **Cars Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  model: String (required),
  category: String (enum: ['Luxury', 'Sports', 'SUV', 'Sedan', 'Coupe']),
  pricePerDay: Number (required),
  image: String (required),
  fuel: String (enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']),
  transmission: String (enum: ['Automatic', 'Manual']),
  availability: Boolean (default: true),
  seats: Number (default: 2),
  createdAt: Date
}
```

#### 3. **Bookings Collection**
```javascript
{
  _id: ObjectId,
  car: ObjectId (ref: 'Car'),
  user: ObjectId (ref: 'User'),
  userName: String,
  userEmail: String,
  carName: String,
  startDate: Date (required),
  endDate: Date (required),
  duration: Number (in days),
  totalAmount: Number (required),
  status: String (enum: ['pending', 'approved', 'denied', 'completed', 'cancelled']),
  paid: Boolean (default: false),
  createdAt: Date
}
```

#### 4. **Payments Collection**
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: 'Booking'),
  user: ObjectId (ref: 'User'),
  amount: Number (required),
  paymentMethod: String (enum: ['Credit Card', 'Debit Card', 'PayPal', 'Transfer']),
  transactionId: String (required, unique),
  status: String (enum: ['pending', 'completed', 'failed']),
  createdAt: Date
}
```

### Database Relationships

```
┌─────────────┐
│   Users     │
│  (1 to N)   │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Bookings   │    │  Payments   │
│             │◄───┤             │
└──────┬──────┘    └─────────────┘
       │              (1 to 1)
       │
       ▼
┌─────────────┐
│    Cars     │
│  (1 to N)   │
└─────────────┘
```

**Relationships:**
- **Users → Bookings**: One-to-Many (One user can have multiple bookings)
- **Cars → Bookings**: One-to-Many (One car can have multiple bookings)
- **Bookings → Payments**: One-to-One (One booking has one payment)
- **Users → Payments**: One-to-Many (One user can have multiple payments)

**Join Operations:**
- Bookings populate `car` and `user` fields
- Payments populate `booking` and `user` fields
- Admin stats aggregate bookings by status and calculate revenue

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |
| PUT | `/profile` | Update user profile | Yes |

### Car Routes (`/api/cars`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all cars | No |
| POST | `/` | Add new car | Admin |
| PUT | `/:id` | Update car | Admin |
| DELETE | `/:id` | Delete car | Admin |

### Booking Routes (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all bookings | Admin |
| GET | `/user/:userId` | Get user bookings | Yes |
| GET | `/:id` | Get single booking | Yes |
| POST | `/` | Create booking | Yes |
| PATCH | `/:id/status` | Update booking status | Admin |

### Payment Routes (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all payments | Admin |
| GET | `/user/:userId` | Get user payments | Yes |
| POST | `/` | Create payment | Yes |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get dashboard statistics | Admin |
| GET | `/customers` | Get all customers | Admin |

### ImageKit Routes (`/api/imagekit`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth` | Get ImageKit auth params | Admin |
| GET | `/config` | Get ImageKit config | Admin |

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- ImageKit account (for image uploads)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   touch .env
   ```

4. **Add environment variables** (see [Environment Variables](#-environment-variables))

5. **Seed the database** (optional)
   ```bash
   node seedAdmin.js
   node seedCars.js
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend `.env`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/car-rental
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/car-rental

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### Frontend Configuration
The frontend uses Vite's proxy configuration to connect to the backend API. Update `vite.config.js` if needed:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

---

## 💻 Usage

### For Customers

1. **Sign Up / Login**
   - Create an account or login with existing credentials
   - Default test user: `user@test.com` / `password123`

2. **Browse Cars**
   - View available luxury cars
   - Filter by category, price, transmission, fuel type
   - Search by name or model

3. **Book a Car**
   - Select car and choose dates
   - Review booking details and total cost
   - Submit booking request

4. **Make Payment**
   - Once booking is approved, proceed to payment
   - Choose payment method
   - Complete transaction

5. **View Dashboard**
   - Track all bookings and their status
   - View payment history
   - Download invoices
   - Update profile information

### For Admins

1. **Login**
   - Use admin credentials
   - Default admin: `admin@test.com` / `admin123`

2. **Dashboard Overview**
   - View key metrics (revenue, bookings, customers)
   - Monitor pending requests
   - Track fleet status

3. **Manage Fleet**
   - Add new vehicles with images
   - Edit existing car details
   - Remove cars from inventory
   - Upload images via ImageKit

4. **Handle Bookings**
   - Review pending booking requests
   - Approve or deny bookings
   - View booking history

5. **Customer Management**
   - View all registered customers
   - Search and filter customers
   - View customer booking history

---

## 📦 Modules & Components

### Frontend Modules

#### **Authentication Module**
- `AuthContext.jsx` - Global authentication state management
- `Login.jsx` - User login page
- `Signup.jsx` - User registration page

#### **Car Module**
- `Cars.jsx` - Car listing page
- `CarDetails.jsx` - Individual car details
- `CarCard.jsx` - Reusable car card component
- `CarFilter.jsx` - Filter component
- `CarSearch.jsx` - Search component

#### **Booking Module**
- `UserBookings.jsx` - User's booking list
- Booking creation flow in `CarDetails.jsx`

#### **Payment Module**
- `Payment.jsx` - Payment processing page
- `UserPayments.jsx` - Payment history
- `Invoice.jsx` - Invoice generation and printing

#### **Admin Module**
- `AdminDashboard.jsx` - Admin dashboard with stats
- `FleetManagement.jsx` - Car inventory management

#### **User Dashboard Module**
- `UserDashboard.jsx` - User dashboard layout
- `UserProfile.jsx` - Profile management with image upload
- `UserSettings.jsx` - User preferences
- `UserLicense.jsx` - License information
- `DashboardNav.jsx` - Dashboard navigation

#### **Common Components**
- `Navbar.jsx` - Responsive navigation with language switcher
- `Footer.jsx` - Site footer with links

#### **Internationalization**
- `i18n.js` - i18next configuration
- `locales/` - Translation files (en, es, fr, de)

### Backend Modules

#### **Controllers**
- `authController.js` - Handles signup, login, profile updates
- `carController.js` - CRUD operations for cars

#### **Middleware**
- `authMiddleware.js` - JWT verification and route protection

#### **Models**
- `User.js` - User schema with validation
- `Car.js` - Car schema with enums
- `Booking.js` - Booking schema with references
- `Payment.js` - Payment schema with transaction tracking

#### **Routes**
- `auth.js` - Authentication endpoints
- `car.js` - Car management endpoints
- `booking.js` - Booking management endpoints
- `payment.js` - Payment processing endpoints
- `admin.js` - Admin-specific endpoints
- `imagekit.js` - Image upload endpoints

---

## 🎨 Key Features Implementation

### Multi-language Support
- Uses `i18next` and `react-i18next`
- Language switcher in navbar
- Supports 4 languages: English, Spanish, French, German
- Translations stored in `locales/` directory

### Image Upload with ImageKit
- Integrated ImageKit.io for CDN and optimization
- Image cropping with `react-easy-crop`
- Used for car images and user profile pictures
- Automatic image optimization and transformation

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- Role-based access control (user/admin)

### Responsive Design
- Mobile-first approach
- CSS Modules for scoped styling
- Breakpoints for tablet and desktop
- Touch-friendly UI elements

### Animations
- Framer Motion for page transitions
- Smooth scroll effects
- Hover animations
- Loading states

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Premier Limo Development Team**

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- ImageKit for image optimization
- Framer Motion for smooth animations
- Lucide React for beautiful icons

---

## 📞 Support

For support, email support@premierlimo.com or open an issue in the repository.

---

**Made with ❤️ using MERN Stack**
