# Quick Start Guide

## 🚀 Start the Application

### Option 1: Using Batch Files (Windows - Easiest)

**Terminal 1 - Start Backend:**
```bash
.\start-backend.bat
```

**Terminal 2 - Start Frontend:**
```bash
.\start-frontend.bat
```

### Option 2: Manual Start

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
npm install
npm run dev
```

## ✅ Verify Everything is Running

1. **Backend**: Should show "MongoDB Connected" message
   - URL: http://localhost:5000
   - Health check: http://localhost:5000/api/health

2. **Frontend**: Should open in browser automatically
   - URL: http://localhost:8080

## 🎯 First Time Use

1. Visit http://localhost:8080
2. You'll be redirected to `/login`
3. Click **"Sign up"** link
4. Create your account:
   - Name: Your full name
   - Email: your@email.com
   - Password: Must be 8+ chars with uppercase, lowercase, and number
   - Example: `SecurePass123`
5. After signup, you'll be logged in automatically
6. Your name will appear in the navbar!

## 🔧 Troubleshooting

### Backend Issues
- **Port 5000 already in use**: Close other apps using port 5000
- **MongoDB connection failed**: Check internet connection and MongoDB Atlas IP whitelist

### Frontend Issues
- **Port 8080 already in use**: Close other Vite dev servers
- **Can't connect to backend**: Make sure backend is running on port 5000

## 📝 Test Credentials

After you sign up, save your credentials:
- Email: _________________
- Password: _________________

## 🎨 Features to Test

✅ Sign up with validation
✅ Login with email/password
✅ View your name in navbar
✅ Click profile to see dropdown
✅ Navigate to protected pages
✅ Logout functionality

## 🛠️ Development Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests

# Backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
```

---

**Need help?** Check `README_AUTH.md` for detailed documentation.
