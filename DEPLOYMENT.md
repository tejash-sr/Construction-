# Deployment Guide - Ini-Yan Spark

## Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (for production)
- GitHub account
- Gmail account with app password (for email service)

## Environment Setup

### 1. Configure Backend Environment Variables

Create `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/ini-yan-spark?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secure_secret_key_here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Admin Email
ADMIN_EMAIL=admin@buildiniyan.com

# Server
PORT=5000
NODE_ENV=production

# Frontend
FRONTEND_URL=https://yourdomain.com
```

### 2. Configure Frontend Environment Variables

Create `.env.local` file in the root directory:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Ini-Yan Spark
```

## Local Development

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Run both servers
./start-backend.bat   # Terminal 1
./start-frontend.bat  # Terminal 2
```

## Production Deployment

### Option 1: Vercel (Frontend) + Railway/Heroku (Backend)

#### Deploy Frontend to Vercel

1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-api.com`

#### Deploy Backend to Railway

1. Create account on [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway auto-detects Node.js app
4. Add environment variables in Railway dashboard:
   - MONGODB_URI
   - JWT_SECRET
   - EMAIL_USER
   - EMAIL_PASSWORD
   - ADMIN_EMAIL
   - NODE_ENV=production
   - FRONTEND_URL=https://your-frontend.vercel.app

### Option 2: Traditional Server Deployment

1. SSH into your server
2. Clone repository: `git clone https://github.com/tejash-sr/Construction-.git`
3. Install dependencies:
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```
4. Create environment files with production values
5. Build frontend: `npm run build`
6. Run backend with PM2:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name "ini-yan-spark-api"
   pm2 startup
   pm2 save
   ```
7. Serve frontend with Nginx

## Database Setup

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user credentials
4. Add IP address to whitelist (or allow all: 0.0.0.0/0)
5. Copy connection string to MONGODB_URI

## Email Setup

1. Enable 2-factor authentication on Gmail
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use the generated password in EMAIL_PASSWORD

## Domain Setup

1. Update FRONTEND_URL in backend .env
2. Update VITE_API_URL in frontend .env.local
3. Configure DNS records
4. Get SSL certificate (auto with Vercel/Railway)

## Post-Deployment

1. Test all functionality:
   - User signup/login
   - Contact form
   - Admin panel
   - Appointments

2. Set up monitoring:
   - Check logs regularly
   - Monitor database usage
   - Set up error tracking (Optional: Sentry)

3. Maintenance:
   - Keep dependencies updated: `npm outdated`
   - Monitor security advisories: `npm audit`
   - Backup database regularly

## Troubleshooting

### MongoDB Connection Fails
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network connectivity

### Email Not Sending
- Verify Gmail app password
- Check ADMIN_EMAIL is set
- Check email quotas

### Frontend Can't Connect to API
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Verify backend is running

## Important Security Notes

⚠️ **NEVER commit .env files to GitHub**
⚠️ **Use strong JWT_SECRET in production**
⚠️ **Enable HTTPS only in production**
⚠️ **Keep dependencies updated**
⚠️ **Use environment variables for all secrets**

---

For more information, see README.md and README_AUTH.md
