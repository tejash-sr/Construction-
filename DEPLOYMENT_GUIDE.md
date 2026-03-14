# 🚀 Production Deployment Guide - Ini-Yan Spark

## ✅ Project Setup Complete

Your Construction website is now ready for deployment! The project has been:
- ✅ Set up with all dependencies installed
- ✅ Configured with environment variables
- ✅ Initialized with Git
- ✅ Pushed to GitHub (https://github.com/tejash-sr/Construction-.git)

### 📊 Project Architecture

```
├── Frontend (React + TypeScript + Vite)
│   ├── Port: 8080 (Development)
│   ├── Tech: Tailwind CSS, shadcn/ui, React Router
│   └── Features: Protected routes, User auth, Admin panel
│
├── Backend (Node.js + Express)
│   ├── Port: 5000
│   ├── Database: MongoDB (Atlas or Local)
│   └── Features: JWT Auth, Email service, Google Calendar, Appointments
│
└── Database: MongoDB with Mongoose ODM
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_key
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@buildiniyan.com
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env.local)
```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Ini-Yan Spark
```

## 📦 Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Step 1: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Click "Import Git Repository"
3. Select your Construction- repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   - VITE_API_URL=https://your-api.railway.app/api
6. Click Deploy

#### Step 2: Deploy Backend to Railway
1. Go to https://railway.app
2. Click "Create New Project" → "Deploy from GitHub"
3. Select Construction- repository
4. Railway auto-detects Node.js
5. Add these Environment Variables in Railway Dashboard:
   - MONGODB_URI
   - JWT_SECRET
   - EMAIL_USER
   - EMAIL_PASSWORD
   - ADMIN_EMAIL
   - NODE_ENV=production
   - FRONTEND_URL=https://your-construction-site.vercel.app

6. Deploy automatically
7. Copy the API URL (e.g., https://construction-api-prod.up.railway.app)
8. Update VITE_API_URL in Vercel with this URL

### Option 2: Heroku + Heroku (Free Alternative, Limited)

#### Backend Deployment
```bash
# Install Heroku CLI
choco install heroku-cli  # or download from heroku.com

# Login to Heroku
heroku login

# Create app
heroku create construction-api

# Add environment variables
heroku config:set -a construction-api MONGODB_URI="..."
heroku config:set -a construction-api JWT_SECRET="..."
heroku config:set -a construction-api EMAIL_USER="..."
heroku config:set -a construction-api EMAIL_PASSWORD="..."
heroku config:set -a construction-api ADMIN_EMAIL="..."
heroku config:set -a construction-api NODE_ENV="production"

# Push to Heroku
git push heroku main
```

### Option 3: Traditional Server (DigitalOcean, AWS, etc.)

#### Prerequisites
- Ubuntu/Linux server
- Node.js 16+ installed
- MongoDB installed or Atlas account
- Domain name

#### Setup Steps

```bash
# SSH into server
ssh root@your_server_ip

# Clone repository
git clone https://github.com/tejash-sr/Construction-.git
cd Construction-

# Install dependencies
npm install
cd backend && npm install && cd ..

# Install PM2 (process manager)
npm install -g pm2

# Create production .env file
nano backend/.env
# Add all environment variables

# Build frontend
npm run build

# Start backend with PM2
pm2 start backend/server.js --name "construction-api"
pm2 startup
pm2 save

# Install and configure Nginx
sudo apt update
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/construction
# Add config below...

# Enable site
sudo ln -s /etc/nginx/sites-available/construction /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Enable SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### Nginx Configuration

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /root/Construction-/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API Backend
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🌐 DNS Configuration

Update your domain DNS settings to point to:
- **A Record**: yourdomain.com → Your server IP (or Vercel IP)
- **CNAME Record**: api.yourdomain.com → api.railway.app (or your API URL)

## 🗄️ Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Create database user:
   - Username: `construction_user`
   - Password: Generate a strong password
5. Whitelist IP:
   - Add: `0.0.0.0/0` (allow all) or your server IP
6. Get connection string:
   - Copy: `mongodb+srv://user:pass@cluster.mongodb.net/ini-yan-spark?retryWrites=true&w=majority`
7. Add to backend `.env` as MONGODB_URI

### Local MongoDB (Development/Testing)

```bash
# Install MongoDB
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB
# Windows: mongod
# macOS/Ubuntu: brew services start mongodb-community (or sudo systemctl start mongod)

# Test connection
mongo localhost:27017
```

## 📧 Email Setup (Gmail)

1. Go to https://myaccount.google.com/
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Select Mail and Windows Computer (or your device)
5. Generate app password (16 characters)
6. Copy to EMAIL_PASSWORD in .env

## 🔐 Security Checklist

- ✅ Use strong JWT_SECRET (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- ✅ Use HTTPS only in production
- ✅ Keep dependencies updated: `npm audit`
- ✅ Never commit .env files to GitHub
- ✅ Use environment variables for all secrets
- ✅ Enable CORS properly (limit to your domain)
- ✅ Implement rate limiting on API
- ✅ Regular backups of MongoDB

## 📝 Post-Deployment Checklist

- [ ] Test user signup/login
- [ ] Test contact form email sends
- [ ] Test admin panel access
- [ ] Test appointment booking
- [ ] Verify HTTPS is enabled
- [ ] Check MongoDB backups
- [ ] Set up monitoring/logging
- [ ] Test on mobile devices
- [ ] Verify all images load correctly
- [ ] Test API from frontend

## 🆘 Troubleshooting

### Frontend Issues
- **Blank page**: Check browser console for errors
- **Can't connect to API**: Verify VITE_API_URL is correct
- **Static files missing**: Check Nginx root path or Vercel build settings

### Backend Issues
- **MongoDB connection fails**: Check connection string and IP whitelist
- **Email not sending**: Verify Gmail app password
- **Port already in use**: Check: `netstat -ano | findstr :5000` (Windows)

### Deployment Issues
- **Push to GitHub fails**: Check authentication, use personal access token instead of password
- **Build fails**: Check Node.js version matches package requirements
- **Out of memory**: Increase server RAM or check for memory leaks

## 📞 Support & Maintenance

### Regular Maintenance
- Update dependencies monthly: `npm update`
- Check security advisories: `npm audit`
- Monitor server logs: `pm2 logs`
- Verify backups are working
- Test disaster recovery

### Performance Optimization
- Enable gzip compression in Nginx
- Minify frontend assets (done by Vite)
- Use CDN for static assets
- Implement caching headers
- Monitor API response times

### Monitoring Tools (Optional)
- PM2 Plus (Process monitoring)
- Sentry (Error tracking)
- LogRocket (User session replay)
- MongoDB Atlas alerts (Database monitoring)
- Vercel Analytics (Frontend performance)

## 🎯 Next Steps

1. **Get MongoDB**: Set up MongoDB Atlas account
2. **Configure Email**: Generate Gmail app password
3. **Choose Deployment**: Pick Vercel + Railway or your preferred platform
4. **Deploy Backend**: Set up backend hosting
5. **Deploy Frontend**: Set up frontend hosting
6. **Update DNS**: Point domain to your deployment
7. **Test Everything**: Run full deployment tests
8. **Go Live**: Update domain DNS records

## 📚 Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://railway.app/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

---

**Created**: March 14, 2026  
**Project**: Ini-Yan Spark Construction Website  
**Repository**: https://github.com/tejash-sr/Construction-.git
