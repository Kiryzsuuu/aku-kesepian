# 🚀 Quick Start Guide - Deploy ke Vercel

## Langkah 1: Deploy Frontend ke Vercel

1. **Buka Vercel Dashboard**
   - Kunjungi: https://vercel.com/new
   - Login dengan GitHub

2. **Import Repository**
   - Search: `Kiryzsuuu/aku-kesepian`
   - Klik "Import"

3. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build (otomatis terdeteksi)
   Output Directory: build (otomatis terdeteksi)
   Install Command: npm install (otomatis terdeteksi)
   ```

4. **Environment Variables**
   Tambahkan satu variable ini dulu (backend URL akan diupdate nanti):
   ```
   REACT_APP_API_URL = http://localhost:5000
   ```

5. **Deploy!**
   - Klik "Deploy"
   - Tunggu ~2-3 menit
   - Copy URL frontend (contoh: `https://aku-kesepian.vercel.app`)

## Langkah 2: Deploy Backend ke Railway

1. **Buka Railway**
   - Kunjungi: https://railway.app/new
   - Login dengan GitHub

2. **Deploy from GitHub**
   - Klik "Deploy from GitHub repo"
   - Pilih `Kiryzsuuu/aku-kesepian`
   - Klik repository

3. **Configure Service**
   - Railway akan otomatis detect Python
   - Klik "Add variables" untuk environment

4. **Environment Variables Backend**
   Copy-paste semua ini:
   ```
   MONGODB_URI=mongodb+srv://[GANTI_DENGAN_CONNECTION_STRING]
   DATABASE_NAME=aku_kesepian
   FLASK_SECRET_KEY=akukesepian-secret-key-2024-super-secure
   JWT_SECRET_KEY=jwt-secret-key-akukesepian-very-secure-2024
   OPENAI_API_KEY=[GANTI_DENGAN_OPENAI_KEY]
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=maskiryz23@gmail.com
   MAIL_PASSWORD=[GANTI_DENGAN_GMAIL_APP_PASSWORD]
   MAIL_USE_TLS=True
   MAIL_USE_SSL=False
   FRONTEND_URL=https://aku-kesepian.vercel.app
   PORT=5000
   FLASK_DEBUG=False
   ```

5. **Configure Build**
   - Klik "Settings" tab
   - Root Directory: `/backend`
   - Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`

6. **Deploy**
   - Railway akan otomatis deploy
   - Klik "Generate Domain" untuk dapat public URL
   - Copy URL backend (contoh: `https://aku-kesepian-backend.railway.app`)

## Langkah 3: Update Environment Variables

1. **Update Frontend di Vercel**
   - Buka Vercel dashboard → Project → Settings → Environment Variables
   - Edit `REACT_APP_API_URL`:
   ```
   REACT_APP_API_URL = https://aku-kesepian-backend.railway.app
   ```
   - Klik "Save"
   - Klik "Redeploy" untuk apply changes

2. **Update Backend di Railway**
   - Pastikan `FRONTEND_URL` sudah benar:
   ```
   FRONTEND_URL=https://aku-kesepian.vercel.app
   ```

## Langkah 4: Setup MongoDB Atlas

1. **Create Free Cluster**
   - Kunjungi: https://www.mongodb.com/cloud/atlas/register
   - Create free M0 cluster

2. **Network Access**
   - Klik "Network Access" → "Add IP Address"
   - Pilih "Allow Access From Anywhere" (0.0.0.0/0)
   - Klik "Confirm"

3. **Database User**
   - Klik "Database Access" → "Add New Database User"
   - Username: `aku_kesepian_admin`
   - Password: (generate secure password)
   - Database User Privileges: "Atlas admin"
   - Klik "Add User"

4. **Get Connection String**
   - Klik "Database" → "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<username>` dan `<password>` dengan credentials tadi
   - Format: `mongodb+srv://aku_kesepian_admin:PASSWORD@cluster.mongodb.net/`

5. **Update Backend Railway**
   - Paste connection string ke `MONGODB_URI` variable

## Langkah 5: Setup Gmail App Password

1. **Enable 2FA Gmail**
   - Login ke Gmail: maskiryz23@gmail.com
   - Google Account → Security → 2-Step Verification
   - Enable 2FA

2. **Generate App Password**
   - Security → 2-Step Verification → App passwords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Name: "Aku Kesepian Backend"
   - Klik "Generate"
   - Copy 16-character password (contoh: `abcd efgh ijkl mnop`)

3. **Update Backend Railway**
   - Paste ke `MAIL_PASSWORD` variable (tanpa spasi: `abcdefghijklmnop`)

## Langkah 6: Test Deployment

1. **Test Backend**
   - Buka: `https://aku-kesepian-backend.railway.app`
   - Harus muncul: "Aku Kesepian API is running! 💕"

2. **Test Frontend**
   - Buka: `https://aku-kesepian.vercel.app`
   - Harus load homepage

3. **Test Registration**
   - Register dengan email baru
   - Check email untuk verification link
   - Klik link untuk verify

4. **Test Login**
   - Login dengan akun yang sudah verified
   - Pilih character dan mulai chat

5. **Test Admin**
   - Login dengan: `maskiryz23@gmail.com`
   - Klik tombol "Admin Dashboard" (ikon shield)
   - Check stats, sessions, dan users

## 🎉 Done!

Aplikasi sudah live di:
- **Frontend**: https://aku-kesepian.vercel.app
- **Backend**: https://aku-kesepian-backend.railway.app

### Admin Access
- Email: `maskiryz23@gmail.com`
- Password: (password yang kamu set saat register)

### Troubleshooting

**Frontend tidak connect ke backend:**
- Check REACT_APP_API_URL di Vercel environment variables
- Pastikan tidak ada trailing slash

**Email tidak terkirim:**
- Check Gmail App Password benar (16 karakter tanpa spasi)
- Verify 2FA enabled di Gmail

**Database error:**
- Check MongoDB connection string
- Verify network access di MongoDB Atlas (0.0.0.0/0)

**CORS Error:**
- Check FRONTEND_URL di Railway environment variables
- Pastikan URL frontend benar tanpa trailing slash

## 📝 Next Steps

1. **Custom Domain** (Optional)
   - Vercel: Settings → Domains → Add custom domain
   - Railway: Settings → Generate Domain atau add custom

2. **Monitoring**
   - Vercel Analytics: Enable di project settings
   - Railway Logs: Monitor di dashboard

3. **Backup**
   - MongoDB Atlas: Enable automatic backups
   - Export environment variables untuk backup

## 🔄 Updates

Setiap push ke GitHub `main` branch akan otomatis trigger deployment di Vercel dan Railway!

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel dan Railway akan otomatis rebuild dan deploy! 🚀
