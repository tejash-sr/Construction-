# Ini-Yan Spark - Construction Website with Authentication

A full-stack construction company website with MongoDB authentication, built with React + TypeScript (frontend) and Node.js + Express (backend).

## 🚀 Features

### Frontend
- ✅ Modern React 18 with TypeScript
- ✅ Vite for fast development
- ✅ Tailwind CSS + shadcn/ui components
- ✅ React Router v6 for navigation
- ✅ Framer Motion animations
- ✅ React Hook Form + Zod validation
- ✅ Protected routes (authentication required)
- ✅ User profile with avatar and dropdown menu
- ✅ Toast notifications with Sonner

### Backend
- ✅ Express.js REST API
- ✅ MongoDB with Mongoose ODM
- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Input validation
- ✅ CORS enabled for frontend
- ✅ Secure environment variables

### Authentication
- ✅ Sign up with validation (name, email, password)
- ✅ Password strength requirements (min 8 chars, uppercase, lowercase, number)
- ✅ Login with JWT token
- ✅ Persistent sessions (localStorage)
- ✅ Auto-redirect to login for unauthenticated users
- ✅ User name displayed in navbar after login
- ✅ Logout functionality

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or bun package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
cd ini-yan-spark
```

### 2. Backend Setup

#### Install Backend Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
The `.env` file is already created in the `backend` folder with your MongoDB connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://sivadharshana:test123@cluster0.ais6mm7.mongodb.net/iniyan-spark?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2026
JWT_EXPIRE=7d
NODE_ENV=development
```

⚠️ **IMPORTANT**: Change the `JWT_SECRET` before deploying to production!

#### Start Backend Server
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Frontend Dependencies (if not done already)
```bash
# Go back to root directory
cd ..
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## 🎯 Usage

### First Time Setup

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   You should see:
   ```
   Server running in development mode on port 5000
   MongoDB Connected: cluster0.ais6mm7.mongodb.net
   ```

2. **Start Frontend Server** (in a new terminal):
   ```bash
   npm run dev
   ```
   Visit `http://localhost:8080`

3. **Create Your Account**:
   - You'll be redirected to `/login` (not authenticated)
   - Click "Sign up" link
   - Fill in your details:
     - Full Name (min 2 characters)
     - Email (valid email format)
     - Password (min 8 chars, must include uppercase, lowercase, and number)
     - Confirm Password
   - Click "Sign Up"

4. **Success!**:
   - After successful signup, you'll be automatically logged in
   - You'll be redirected to the home page
   - Your name will appear in the navbar with an avatar
   - Click on your name to see profile dropdown with logout option

### Logging In

1. Visit `http://localhost:8080`
2. If not logged in, you'll be redirected to `/login`
3. Enter your email and password
4. Click "Log In"
5. You'll be redirected to the home page

### Logging Out

1. Click on your name in the navbar (top right)
2. Click "Log out" from the dropdown menu
3. You'll be redirected to the login page

## 📁 Project Structure

```
ini-yan-spark/
├── backend/                      # Backend API
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Auth logic (signup, login, verify)
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & token generation
│   ├── models/
│   │   └── User.js              # User schema with password hashing
│   ├── routes/
│   │   └── authRoutes.js        # Auth API routes
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server entry point
│
├── src/                          # Frontend
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Updated with user menu
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/                  # shadcn/ui components
│   │   └── ProtectedRoute.tsx   # Route wrapper for auth
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication state management
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx        # Login page
│   │   │   └── SignUp.tsx       # Sign up page
│   │   ├── Index.tsx            # Home (protected)
│   │   ├── About.tsx            # About (protected)
│   │   ├── Services.tsx         # Services (protected)
│   │   ├── WhyChooseUs.tsx     # Why Choose Us (protected)
│   │   └── Contact.tsx          # Contact (protected)
│   ├── services/
│   │   └── authService.ts       # API calls to backend
│   └── App.tsx                  # Main app with routing & auth
│
└── README.md                     # This file
```

## 🔐 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/verify` | Verify JWT token | Yes |
| GET | `/api/health` | Health check | No |

### Request Examples

#### Sign Up
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your-jwt-token>
```

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens for stateless authentication
- ✅ Tokens stored in localStorage (7-day expiration)
- ✅ Protected API routes with middleware
- ✅ Password strength validation (frontend & backend)
- ✅ Email format validation
- ✅ CORS configured for specific origin
- ✅ Mongoose schema validation

## 🎨 UI Components Used

- Card, CardHeader, CardContent, CardFooter
- Button with loading states
- Input with icons
- Avatar with fallback initials
- DropdownMenu for user menu
- Toast notifications (Sonner)
- Framer Motion animations

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct in `.env`
- Ensure MongoDB Atlas allows connections from your IP
- Verify port 5000 is not in use: `netstat -ano | findstr :5000`

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify API_URL in `AuthContext.tsx` is correct

### "User already exists" error
- Email is already registered in MongoDB
- Use a different email or reset the database

### Can't login after signup
- Check backend console for errors
- Verify password meets requirements
- Clear localStorage and try again

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | Your Atlas URI |
| JWT_SECRET | Secret key for JWT | Change in production! |
| JWT_EXPIRE | Token expiration time | 7d |
| NODE_ENV | Environment mode | development |

## 🚀 Production Deployment

### Backend (e.g., Render, Railway, Heroku)
1. Create a new web service
2. Connect your repository
3. Set environment variables:
   - `MONGODB_URI` (production MongoDB)
   - `JWT_SECRET` (strong random string)
   - `JWT_EXPIRE` (e.g., 7d)
   - `NODE_ENV=production`
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`

### Frontend (e.g., Vercel, Netlify)
1. Create a new project
2. Build command: `npm run build`
3. Output directory: `dist`
4. Update `API_URL` in `AuthContext.tsx` to production backend URL
5. Deploy!

## 📚 Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **State**: React Query + Context API
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ by Ini-Yan Spark Team**
