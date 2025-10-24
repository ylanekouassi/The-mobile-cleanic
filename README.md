# 🚗 The Mobile Cleanic

A premium mobile car detailing service application built with React Native (Expo) and a backend powered by Bun, Hono, and Prisma.

## 📱 About

The Mobile Cleanic is a complete mobile car detailing booking platform that allows customers to:
- Browse detailing packages (Interior, Paint Correction, In-N-Out)
- Select vehicle type (Sedan, SUV, Van) with automatic pricing
- Schedule appointments with real-time availability
- Make reservations with secure payment options
- Track their booking history

## ✨ Features

### Customer-Facing Features
- **Interactive Package Selection** with detailed service descriptions
- **Smart Shopping Cart** with quantity management
- **Dynamic Pricing** based on vehicle type (Sedan +$0, SUV +$25, Van +$50)
- **Calendar Booking System** with date/time selection
- **Multiple Payment Options** (Credit Card, E-Transfer)
- **Reservation Fee System** ($30 upfront, remaining balance after service)
- **Booking Limits** - Maximum 2 customers OR 2 packages per day

### Admin Dashboard Features
- **Secure Admin Login** with authentication
- **Complete Customer Database** with booking history and spending tracking
- **Schedule Management** - View all bookings by date with customer details
- **Revenue Tracking** - Monitor total earnings and per-customer spending
- **Booking Details** - Full access to customer info, service address, packages, and payment status
- **Real-time Statistics** - Total bookings, customers, and revenue overview

## 🛠️ Tech Stack

### Frontend (React Native - Expo)
- **Framework:** Expo SDK 53 with React Native 0.76.7
- **Navigation:** React Navigation (Drawer Navigator)
- **State Management:** Zustand with AsyncStorage persistence
- **UI Components:**
  - React Native Calendars
  - Linear Gradient
  - Ionicons
  - Expo Vector Icons
- **Styling:** Custom StyleSheet with dark theme (#000000, #E89A3C gold accent)

### Backend (Bun + Hono + Prisma)
- **Runtime:** Bun (ultra-fast JavaScript runtime)
- **Web Framework:** Hono (lightweight, fast API framework)
- **ORM:** Prisma with SQLite database
- **API Features:**
  - RESTful endpoints
  - CORS enabled for React Native
  - Booking availability checking
  - Customer and booking management
  - Admin authentication

### Database Schema
- **Customer** - Personal info, contact details, addresses
- **Booking** - Date/time, payment info, status tracking
- **BookingPackage** - Service details, vehicle type, pricing

## 📂 Project Structure

```
/
├── src/                          # Frontend React Native app
│   ├── components/              # Reusable UI components
│   │   ├── CustomDrawer.tsx    # Navigation drawer with admin login
│   │   └── CartIcon.tsx        # Shopping cart indicator
│   ├── screens/                # App screens
│   │   ├── HomeScreen.tsx      # Landing page
│   │   ├── PackagesScreen.tsx  # Service packages with filters
│   │   ├── CartScreen.tsx      # Shopping cart management
│   │   ├── CheckoutScreen.tsx  # Booking and payment
│   │   ├── AdminLoginScreen.tsx      # Admin authentication
│   │   └── AdminDashboardScreen.tsx  # Admin management panel
│   ├── navigation/             # Navigation configuration
│   │   └── AppNavigator.tsx    # Drawer navigation setup
│   └── state/                  # State management
│       └── cartStore.ts        # Zustand cart store
│
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── index.ts           # Hono server with all API routes
│   │   └── db.ts              # Prisma client instance
│   └── prisma/
│       ├── schema.prisma      # Database schema
│       ├── dev.db             # SQLite database
│       └── migrations/        # Database migrations
│
├── assets/                     # Images, fonts, icons
├── package.json               # Frontend dependencies
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Bun (v1.0 or higher)
- Expo CLI

### Frontend Setup

```bash
# Install dependencies
bun install

# Start Expo development server (runs on port 8081)
bun start
```

The Expo app will automatically bundle and serve the frontend. Scan the QR code with Expo Go app to view on your phone.

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
bun install

# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate deploy

# Start development server (runs on port 3000)
bun run dev
```

The backend server will start on `http://localhost:3000` with hot-reload enabled.

### Environment Variables

Create a `.env` file in the root directory:

```env
BACKEND_URL=https://[YOUR-UNIQUE-ID].share.sandbox.dev/
```

The Vibecode sandbox automatically provides a reverse proxy for the backend.

## 🔐 Admin Access

To access the admin dashboard:

1. Open the app and tap the menu (☰) icon
2. Scroll to the bottom and tap "Admin Login"
3. Enter admin credentials:
   - **Username:** `ylanekouassi`
   - **Password:** `Algoma2021@!`
4. View schedule and customer management features

## 📊 API Endpoints

### Public Endpoints
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/availability/:date` - Check availability for a date

### Admin Endpoints
- `POST /api/admin/login` - Authenticate admin user
- `GET /api/admin/bookings` - Get all bookings with customer details
- `GET /api/admin/bookings/:date` - Get bookings for a specific date
- `GET /api/admin/customers` - Get all customers with statistics
- `GET /api/admin/customers/:id` - Get single customer details

## 💎 Service Packages

### Interior Detailing
- **Interior Basic** - $99 (1-2 hours)
- **Interior Premium** - $189 (2-4 hours) ⭐ Popular
- **Seat Shampooing** - $99 (up to 2 hours)

### Paint Correction
- **Stage 1** - $250 (up to 2 hours)
- **Stage 2** - $450 (up to 4 hours) ⭐ Popular
- **Stage 3** - $800 (up to 8 hours)

### In-N-Out Complete
- **Full Detail** - $299 (up to 6 hours) ⭐ Popular
- **Seat Shampooing** - $99 (up to 2 hours)

*Prices vary based on vehicle type and condition*

## 🎨 Design System

- **Primary Color:** `#E89A3C` (Gold/Orange)
- **Background:** `#000000` (Black)
- **Secondary Background:** `#0a0a0a`, `#1a1a1a`
- **Text:** `#FFFFFF` (White), `#CCCCCC` (Light Gray)
- **Accent:** `#888888` (Gray)

## 🔒 Business Logic

### Booking Limits
The system enforces strict booking limits to ensure quality service:
- Maximum **2 customers** per day, OR
- Maximum **2 packages** per day (whichever limit is reached first)

Customers attempting to book beyond these limits will receive an error message.

### Payment Flow
1. Customer selects packages and vehicle type
2. Total service cost is calculated
3. $30 reservation fee is required upfront
4. Remaining balance is due after service completion
5. Payment methods: Credit Card or E-Transfer to `themobilecleanic@gmail.com`

## 📞 Contact

**The Mobile Cleanic**
- **Phone:** +1 (343) 988-0197
- **Email:** themobilecleanic@gmail.com
- **Service Area:** Mobile service - We come to you!

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

Built with ❤️ using:
- React Native & Expo
- Bun runtime
- Hono web framework
- Prisma ORM
- Vibecode development platform

---

**Repository:** https://github.com/ylanekouassi/The-mobile-cleanic

**Live Development:** Powered by Vibecode Sandbox
