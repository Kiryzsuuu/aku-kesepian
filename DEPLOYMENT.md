# Deployment Guide - Aku Kesepian 💕

## 📦 GitHub Repository
Repository: https://github.com/Kiryzsuuu/aku-kesepian

## 🚀 Vercel Deployment

### Frontend Deployment (React)

1. **Login ke Vercel**
   - Kunjungi https://vercel.com
   - Login dengan GitHub account

2. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository `Kiryzsuuu/aku-kesepian`
   - Klik "Import"

3. **Configure Frontend**
   - Framework Preset: **Create React App**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Environment Variables (Frontend)**
   Tambahkan di Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

5. **Deploy**
   - Klik "Deploy"
   - Tunggu hingga selesai
   - Dapatkan URL frontend: `https://aku-kesepian.vercel.app`

### Backend Deployment Options

#### Option 1: Railway (Recommended) ⭐

1. **Setup Railway**
   - Kunjungi https://railway.app
   - Login dengan GitHub
   - Klik "New Project" → "Deploy from GitHub repo"
   - Pilih `Kiryzsuuu/aku-kesepian`

2. **Configure Backend**
   - Root Directory: `/backend`
   - Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`

3. **Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   DATABASE_NAME=aku_kesepian
   FLASK_SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret
   OPENAI_API_KEY=sk-...
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=maskiryz23@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_USE_TLS=True
   MAIL_USE_SSL=False
   FRONTEND_URL=https://aku-kesepian.vercel.app
   PORT=5000
   FLASK_DEBUG=False
   ```

4. **Deploy**
   - Railway akan otomatis deploy
   - Dapatkan URL backend: `https://your-app.railway.app`

#### Option 2: Render.com

1. **Setup Render**
   - Kunjungi https://render.com
   - Login dengan GitHub
   - Klik "New" → "Web Service"
   - Connect repository

2. **Configure**
   - Name: `aku-kesepian-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`

3. **Add Environment Variables** (sama seperti Railway)

#### Option 3: PythonAnywhere

1. **Upload Code**
   - Login ke PythonAnywhere
   - Clone repository via Git
   - Install dependencies di virtual environment

2. **Configure WSGI**
   - Setup WSGI file untuk Flask app
   - Point ke `run.py`

3. **Add Environment Variables**
   - Setup di `/etc/environment` atau `.env` file

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Login ke https://www.mongodb.com/cloud/atlas
   - Create free cluster (M0)
   - Choose region terdekat

2. **Configure Network Access**
   - IP Whitelist: Tambahkan `0.0.0.0/0` (allow all) untuk Vercel/Railway
   - Atau whitelist IP specific dari hosting provider

3. **Create Database User**
   - Username: `aku_kesepian_user`
   - Password: (generate secure password)
   - Privileges: Read and write to database

4. **Get Connection String**
   - Klik "Connect" → "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/`

### Email Setup (Gmail SMTP)

1. **Enable 2FA**
   - Login ke Gmail (maskiryz23@gmail.com)
   - Enable 2-Factor Authentication

2. **Generate App Password**
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" dan generate password
   - Copy password (16 karakter tanpa spasi)

3. **Use in Environment Variables**
   - `MAIL_USERNAME=maskiryz23@gmail.com`
   - `MAIL_PASSWORD=your-16-char-app-password`

## 🔧 Post-Deployment Configuration

### Update Frontend API URL

Setelah backend deployed, update environment variable di Vercel:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### Update Backend CORS

Di `backend/app/__init__.py`, pastikan CORS mencakup frontend URL:
```python
CORS(app, origins=[
    "http://localhost:3000",
    "https://aku-kesepian.vercel.app",
    os.getenv('FRONTEND_URL', 'http://localhost:3000')
])
```

### Test Deployment

1. **Test Frontend**
   - Buka `https://aku-kesepian.vercel.app`
   - Check console untuk errors
   - Test registration dan login

2. **Test Backend**
   - Buka `https://your-backend.railway.app`
   - Should show: "Aku Kesepian API is running! 💕"
   - Test `/api` endpoint

3. **Test Integration**
   - Register user baru
   - Check email verification
   - Login dan test chat
   - Test admin dashboard

## 📊 Monitoring

### Vercel Analytics
- Enable di Vercel dashboard
- Track performance dan errors

### Backend Logs
- Railway: Check logs di dashboard
- Monitor API response times
- Watch for errors

### Database Monitoring
- MongoDB Atlas dashboard
- Check connection count
- Monitor storage usage

## 🔄 Continuous Deployment

Setiap push ke `main` branch akan otomatis trigger deployment:
- Vercel akan rebuild frontend
- Railway akan rebuild backend

## 🆘 Troubleshooting

### Frontend tidak connect ke Backend
- Check REACT_APP_API_URL di environment variables
- Pastikan tidak ada trailing slash: ❌ `https://api.com/` → ✅ `https://api.com`

### CORS Error
- Update CORS origins di backend
- Pastikan frontend URL sudah ditambahkan

### Email tidak terkirim
- Check Gmail App Password benar
- Verify 2FA enabled
- Check MAIL_USERNAME dan MAIL_PASSWORD

### Database Connection Error
- Check MongoDB connection string
- Verify network access di MongoDB Atlas
- Ensure IP whitelist configured

### 502 Bad Gateway
- Check backend logs
- Verify environment variables
- Ensure gunicorn running correctly

## 📝 Environment Variables Checklist

### Frontend (Vercel)
- [ ] REACT_APP_API_URL

### Backend (Railway/Render)
- [ ] MONGODB_URI
- [ ] DATABASE_NAME
- [ ] FLASK_SECRET_KEY
- [ ] JWT_SECRET_KEY
- [ ] OPENAI_API_KEY
- [ ] MAIL_SERVER
- [ ] MAIL_PORT
- [ ] MAIL_USERNAME
- [ ] MAIL_PASSWORD
- [ ] MAIL_USE_TLS
- [ ] MAIL_USE_SSL
- [ ] FRONTEND_URL
- [ ] PORT
- [ ] FLASK_DEBUG

## 🎉 Done!

Your app should now be live:
- Frontend: https://aku-kesepian.vercel.app
- Backend: https://your-backend.railway.app

Admin login: maskiryz23@gmail.com
