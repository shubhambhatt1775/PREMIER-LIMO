# 🚗 Premier Limo - Luxury Car Rental System

A full-stack luxury car rental application built with the MERN stack, featuring a modern UI, real-time analytics, smart availability checking, and a comprehensive admin dashboard.

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
- 🔐 **User Authentication** - Secure signup/login with JWT and **Social Auth (Google/Facebook)**
- 🔔 **Push Notifications** - Real-time browser notifications for booking status and alerts
- 📡 **Live GPS Tracking** - Real-time location sharing during active rentals
- 💳 **Stripe Payment Gateway** - Real-world secure payment integration with Stripe Checkout
- 🚀 **High-Performance Caching** - In-memory data acceleration using `node-cache`
- 🪪 **Driving License** - Verify user identity with driving license info
- 🚙 **Car Browsing** - Browse luxury cars with filters and search
- 📅 **Booking System** - Real-time booking with date selection
-  **Invoice Generation** - Downloadable/printable invoices
- 👤 **Profile Management** - Update profile with image upload
- 📊 **SaaS-Level Analytics** - Comprehensive data visualizations including:
    - Monthly Revenue & Booking Trends
    - Daily Activity (Last 30 days Area Chart)
    - Revenue per Category (Donut Pie Chart)
    - Customer Growth (Step Line Chart)
    - Booking Cancellation Rate (Operational Pie Chart)
- 🧠 **Smart Availability** - Date-based overlap checks prevent double bookings
- 💰 **Partial Refund Policy** - Automated time-based cancellation rules:
    - > 48h before pickup: **100% Refund**
    - 24h - 48h before pickup: **80% Partial Refund**
    - < 24h before pickup: **Cancellation locked**
- ⭐ **Rating & Reviews** - Rate and review cars after successful rentals
- 🗺️ **Map-Based Locations** - Choose pickup/dropoff points on an interactive map
- 🌍 **Multi-language** - Support for English, Spanish, French, German
- 📱 **Responsive Design** - Optimized for all devices
- 💬 **Real-time Chat** - Chat with support admin in real-time


### Admin Features
- 📊 **Advanced Analytics** - Dedicated Analytics section with interactive **Recharts** charts: Monthly Revenue, Most Booked Vehicles, and Booking Trends
- 🚗 **Fleet Management** - Add, edit, delete vehicles
- 📸 **Image Upload** - ImageKit.io integration for car images
- 📋 **Booking Management** - Approve/deny booking requests with race-condition protection
- 👥 **Customer Management** - View and manage customers
- 💰 **Payment Tracking** - Monitor all transactions
- 🔍 **Search & Filter** - Advanced filtering capabilities
- 💬 **Customer Support Chat** - Manage multiple real-time conversations with users
- 🗺️ **Live Fleet Tracking** - Monitor all "On-Road" vehicles on a real-time interactive map
- 🔔 **Notification Center** - Real-time notification bell with unread count and dropdown


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
| **Leaflet / React Leaflet** | 4.2.1 | Maps & Live GPS Tracking |
| **Recharts** | latest | Analytics charts (Revenue, Trends, Fleet) |
| **React Easy Crop** | 5.5.6 | Image cropping |
| **Socket.io Client** | 4.8.1 | Real-time communication |
| **@react-oauth/google** | 0.13.4 | Google Social Auth |
| **react-facebook-login-lite** | 1.0.0 | Facebook Social Auth |



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
| **Socket.io** | 4.8.1 | Real-time communication |
| **web-push** | 3.6.7 | Push Notification protocol |
| **node-cache** | latest | In-memory caching layer |
| **stripe** | latest | Payment gateway integration |
| **google-auth-library** | 10.5.0 | Google OAuth verification |



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
│   │   ├── Payment.js             # Payment schema
│   │   ├── DrivingLicense.js      # License schema
│   │   ├── Handover.js            # OTP schema
│   │   ├── VehicleLocation.js     # Live GPS schema
│   │   ├── Availability.js        # Date-based rental availability
│   │   └── Notification.js        # Admin notification schema
│   ├── routes/
│   │   ├── auth.js                # Auth routes
│   │   ├── car.js                 # Car routes
│   │   ├── booking.js             # Booking & Availability logic
│   │   ├── payment.js             # Payment routes
│   │   ├── admin.js               # Admin statistics & management
│   │   ├── imagekit.js            # ImageKit integration
│   │   ├── license.js             # License verification
│   │   ├── handover.js            # OTP & Handover logic
│   │   ├── chat.js                # Chat routes
│   │   └── notification.js        # Push notification routes

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
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   ├── chat/              # Chat components (ChatWidget)
│   │   │   └── LocationTracker.jsx # Background GPS service

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
│   │   │   │   ├── FleetManagement.jsx
│   │   │   │   ├── AdminMessages.jsx
│   │   │   │   ├── LiveTracking.jsx
│   │   │   │   └── LiveTracking.module.css

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

The application uses MongoDB with 10 main collections:

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
  googleId: String (unique, sparse),
  facebookId: String (unique, sparse),
  drivingLicense: ObjectId (ref: 'DrivingLicense'),
  pushSubscriptions: Array (endpoint, keys: {p256dh, auth}),
  createdAt: Date
}
```

#### 2. **Notifications Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  type: String (enum: ['booking', 'payment', 'user', 'license', 'review']),
  title: String (required),
  message: String (required),
  isRead: Boolean (default: false),
  link: String,
  createdAt: Date
}
```


#### 3. **Driving License Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, unique),
  licenseNumber: String (required, unique),
  expiryDate: Date (required),
  issuingCountry: String (required),
  frontImage: String,
  backImage: String,
  status: String (enum: ['pending', 'verified', 'rejected'], default: 'pending'),
  createdAt: Date
}
```

#### 4. **Cars Collection**
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

#### 5. **Bookings Collection**
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
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  dropoffLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  createdAt: Date
}
```

#### 6. **Reviews Collection**
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: 'Booking'),
  car: ObjectId (ref: 'Car'),
  user: ObjectId (ref: 'User'),
  userName: String,
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

#### 7. **Payments Collection**
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

#### 8. **Messages Collection**
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: 'User', required),
  receiver: ObjectId (ref: 'User', required),
  text: String (required),
  isRead: Boolean (default: false),
  timestamp: Date (default: Date.now)
}
```

#### 9. **Handover Collection**
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: 'Booking', required),
  user: ObjectId (ref: 'User', required),
  car: ObjectId (ref: 'Car', required),
  pickupOTP: String,
  pickupVerified: Boolean,
  pickupTime: Date,
  dropoffOTP: String,
  dropoffVerified: Boolean,
  dropoffTime: Date,
  status: String (enum: ['pending_pickup', 'picked_up', 'pending_dropoff', 'dropped_off']),
  createdAt: Date
}
```

#### 10. **VehicleLocation Collection**
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: 'Booking', required, unique),
  car: ObjectId (ref: 'Car', required),
  user: ObjectId (ref: 'User', required),
  latitude: Number,
  longitude: Number,
  lastUpdated: Date (default: Date.now)
}
```

#### 11. **Availability Collection**
```javascript
{
  _id: ObjectId,
  car: ObjectId (ref: 'Car', required),
  booking: ObjectId (ref: 'Booking'),
  startDate: Date (required),
  endDate: Date (required),
  type: String (enum: ['booking', 'maintenance', 'blocked']),
  createdAt: Date
}
```

### Database Relationships


```
          ┌──────────────────┐
          │      Users       │
          │     (1 to N)     │
          └────────┬─────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌────────────┐
│ Bookings │  │ Payments │  │  License   │
│          │◄─┤          │  │  (1 to 1)  │
└─────┬────┘  └──────────┘  └────────────┘
      │         (1 to 1)
      ▼
┌──────────┐
│   Cars   │
│ (1 to N) │
└──────────┘
```

**Relationships:**
- **Users ↔ License**: **One-to-One** (A user has exactly one driving license record for identity verification).
- **Users → Bookings**: **One-to-Many** (A user can place multiple car rental reservations over time).
- **Users → Payments**: **One-to-Many** (A user can make multiple payments corresponding to their bookings).
- **Cars → Bookings**: **One-to-Many** (A single car can be booked for different periods by different users).
- **Bookings ↔ Payments**: **One-to-One** (Each specific booking is linked to exactly one payment transaction).
- **Bookings ↔ Cars**: **Many-to-One** (Multiple booking records can reference the same vehicle).
- **Bookings ↔ Users**: **Many-to-One** (Multiple booking records can reference the same registered user).

**Join Operations:**
- `Bookings` use `.populate('car user')` to retrieve full vehicle and customer details.
- `Payments` use `.populate('booking user')` to reconcile transactions with specific rentals and users.
- `Users` use `.populate('drivingLicense')` to include verified identity data.
- `DrivingLicense` use `.populate('userId')` to link license data back to the primary user account.
- Admin analytics perform cross-collection aggregations to calculate total revenue, popular cars, and customer activity.

---

## � Data Flow Diagrams (DFD)

### 0️⃣ Context Level DFD (Level 0)
Shows the system boundaries and external entities.

```
                  ┌──────────────┐
                  │   ImageKit   │
                  │     (CDN)    │
                  └──────▲───────┘
                         │ Car/User Images
                         │
    Booking/Payment Info │  ┌──────────────────┐  Admin Actions
   ┌─────────────────────┼──┤   Premier Limo   │◄────────────────┐
   │                     │  │      System      │                 │
   ▼                     │  └────────▲─────────┘                 │
┌──────┐                 │           │                           │             ┌───────┐
│ User │                 │           │ API Requests/Responses    │             │ Admin │
└──────┘                 │           │                           └─────────────┤       │
   ▲                     │           │                                         └───────┘
   │                     │   ┌───────▼────────┐
   └─────────────────────┼───┤ Payment Gateway│
       Receipts/Status   │   └────────────────┘
                         │
```

### 1️⃣ Level 1 DFD: General Process
Breaks down the system into its primary functional modules.

```
       Users         Cars       Bookings      Payments      Licenses
         ║             ║            ║             ║             ║
  ┌──────▼──────┐      ║            ║             ║             ║
  │ 1.0 Auth    │      ║            ║             ║             ║
  └──────┬──────┘      ║            ║             ║             ║
         │             ║            ║             ║             ║
  ┌──────▼──────┐      ║            ║             ║             ║
  │ 2.0 Fleet   ◄══════╝            ║             ║             ║
  │ Management  │                   ║             ║             ║
  └──────┬──────┘                   ║             ║             ║
         │            ┌─────────────▼─────────────┐             ║
  ┌──────▼──────┐     │ 3.0 Booking Management    │             ║
  │ 4.0 Payment ◄═════┤ (Calculations & Status)   │             ║
  │ Processing  │     └─────────────┬─────────────┘             ║
  └──────┬──────┘                   │                           ║
         │            ┌─────────────▼─────────────┐             ║
  ┌──────▼──────┐     │ 5.0 Profile & License     ◄═════════════╝
  │ 6.0 Admin   │     │ Management                │
  │ Analytics   │     └───────────────────────────┘
  └─────────────┘
```

### 2️⃣ Level 2 DFD: User Side
Detailed view of customer interactions.

```
[User] ───► (2.1 Search/Filter Cars) ───► [Cars DataStore]
   │                │
   │                ▼
   ├────────► (2.2 Select Car & Dates) ───► (2.3 Check Availability)
   │                                               │
   │                                               ▼
   ├────────► (2.4 Submit Booking) ────────► [Bookings DataStore]
   │                                               │
   │                                               ▼
   ├────────► (2.5 Process Payment) ───────► [Payments DataStore]
   │                                               │
   │                                               ▼
   └────────► (2.6 Manage License) ────────► [Licenses DataStore]
```

### 2️⃣ Level 2 DFD: Admin Side
Detailed view of administrative operations.

```
[Admin] ──► (3.1 Add/Edit Vehicles) ───► [Cars DataStore]
   │                │
   │                ▼
   ├────────► (3.2 Manage Bookings) ───► (3.2.1 Approve/Deny) ───► [Bookings DB]
   │                                               │
   │                                               ▼
   ├────────► (3.3 Customer Management) ───► [Users DataStore]
   │                                               │
   │                                               ▼
   └────────► (3.4 Generate Analytics) ────► [Payments/Bookings DB]


### 3️⃣ Level 3 DFD: Detailed Booking Lifecycle
Granular look at the booking-to-payment process.

```
[User]
  │
 (3.1.1: Select Car/Dates) ────► [Cars DB: Check Availability]
  │
 (3.1.2: Calculate Amount) ────► [Pricing Engine] ──┐
  │                                                 │
 (3.1.3: Submit Request) ──────► [Bookings DB: Status = 'pending']
                                       │
                                       ▼
 [Admin] ──────────────────────► (3.2.1: Review Request)
                                       │
             ┌─────────────────────────┴─────────────────────────┐
             ▼                                                   ▼
 (3.2.2: Deny Request)                                 (3.2.3: Approve Request)
             │                                                   │
 [Status = 'denied']                                   [Status = 'approved']
                                                                 │
                                                                 ▼
 [User Portal] ◄───────────────────────────────────── (3.3.1: Trigger Payment)
                                                                 │
                                       ┌─────────────────────────┘
                                       ▼
 (3.3.2: Process Payment) ─────► [Payment Gateway] ─────► [Payments DB]
                                                                 │
                                       ┌─────────────────────────┘
                                       ▼
 (3.3.3: Update Booking) ──────► [Bookings DB: paid = True]
                                       │
                                       ▼
 (3.3.4: Generate PDF) ────────► [Invoice Generator] ───► [User]
```

### 3️⃣ Level 3 DFD: License Verification Process
Granular look at user identity verification.

```
[User]
  │
 (5.1.1: Upload Front/Back Images) ──► [ImageKit API] ──► [Image URLs]
  │                                                            │
 (5.1.2: Submit Detail Form) ────────► [Licenses DB: Status = 'pending']
                                              │
                                              ▼
 [Admin] ────────────────────────────► (5.2.1: Review Documents)
                                              │
                    ┌─────────────────────────┴────────────────────────┐
                    ▼                                                  ▼
      (5.2.2: Reject License)                            (5.2.3: Verify License)
                    │                                                  │
       [Status = 'rejected']                              [Status = 'verified']
                    │                                                  │
          (Notify User) ◄──────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/google` | Google Social Login | No |
| POST | `/facebook` | Facebook Social Login | No |
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

### License Routes (`/api/license`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user license | Yes |
| POST | `/` | Upsert user license | Yes |

### Review Routes (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit a car review | Yes |
| GET | `/car/:carId` | Get reviews for a car | No |
| GET | `/check/:bookingId`| Check if booking reviewed| Yes |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get dashboard statistics | Admin |
| GET | `/customers` | Get all customers | Admin |
| GET | `/analytics` | Get monthly revenue, trends, and top cars | Admin |
| GET | `/live-locations`| Get all real-time vehicle positions | Admin |

### ImageKit Routes (`/api/imagekit`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth` | Get ImageKit auth params | Admin |
| GET | `/config` | Get ImageKit config | Admin |

### Chat Routes (`/api/chat`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/messages/:userId/:otherId` | Get chat history | Yes |
| POST | `/send` | Save new message | Yes |
| GET | `/users/:adminId` | Get chat list for admin | Admin |
| PUT | `/mark-read` | Mark messages as read | Yes |
| GET | `/admin` | Get admin details | Yes |

### Handover Routes (`/api/handover`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/status/:bookingId` | Get detailed handover status | Yes |
| GET | `/active-trip/:userId`| Get current "picked_up" trip | Yes |
| POST | `/verify-pickup-otp/:bookingId` | Verify pickup & start tracking | Admin |
| POST | `/verify-dropoff-otp/:bookingId`| Verify return & stop tracking | Admin |

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all notifications | Admin |
| PATCH | `/:id/read` | Mark as read | Yes |
| PATCH | `/read-all` | Mark all as read | Yes |
| POST | `/subscribe` | Register push subscription | Yes |



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

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
MAILTO=mailto:admin@example.com
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_VAPID_PUBLIC_KEY=your_key
VITE_SOCKET_URL=http://localhost:5000
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
   - **Track Vehicles on Road**: Real-time count of active rentals
   - Monitor pending requests
   - Track fleet status

7. **Live Fleet Tracking**
   - View all active "Picked Up" vehicles on a map
   - Monitor driver locations in real-time
   - Dynamic map auto-zooming to fit entire fleet

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

## 🌐 Deployment (Vercel)

The application is fully optimized for **Vercel** deployment. You can view the live site here:
**Live Demo:** [https://premier-limo.vercel.app](https://premier-limo.vercel.app)

### 1. Backend Deployment (Serverless API)
The backend is hosted as a dedicated Vercel project using `@vercel/node`.

1. **Root Directory:** Set to `backend` in Vercel settings.
2. **Framework Preset:** None (detected as Node.js).
3. **Vercel Config:** Managed via `backend/vercel.json`.
4. **Health Check:** Monitor status at `/api/health`.

### 2. Frontend Deployment (Vite SPA)
The frontend is hosted as a separate Vercel project.

1. **Root Directory:** Set to `frontend` in Vercel settings.
2. **Framework Preset:** `Vite`.
3. **Build Command:** `npm run build`.
4. **Output Directory:** `dist`.
5. **SPA Routing:** Managed via `frontend/vercel.json` (Rewrites all routes to `index.html`).

### 3. Required Environment Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `MONGO_URI` | MongoDB Atlas | Cloud Database Connection |
| `JWT_SECRET` | Custom | Authentication security |
| `NODE_ENV` | production | Optimization flag |
| `FRONTEND_URL` | Vercel | Used for CORS and Stripe redirects |
| `VITE_API_URL` | Vercel | Connection point for the frontend |
| `IMAGEKIT_*` | ImageKit.io | Media storage and optimization |
| `STRIPE_*` | Stripe | Real-time payment processing |

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
Shubham Bhatt :bhattshubham274@gmail.com

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- ImageKit for image optimization
- Framer Motion for smooth animations
- Lucide React for beautiful icons
- Antigravity for the amazing understanding of the project


---

**Made with ❤️ using MERN Stack**