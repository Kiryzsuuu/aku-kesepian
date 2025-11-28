# 🚀 Quick Deploy to Vercel

## Step 1: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import `Kiryzsuuu/aku-kesepian`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
   (You'll update this after deploying backend)

6. Click **Deploy**
7. Save your frontend URL: `https://aku-kesepian.vercel.app`

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `Kiryzsuuu/aku-kesepian`
4. Configure:
   - **Root Directory**: Click "Settings" → Set root directory to `/backend`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`

5. Add Environment Variables (Click "Variables" tab):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   DATABASE_NAME=aku_kesepian
   FLASK_SECRET_KEY=generate-random-secret-here
   JWT_SECRET_KEY=generate-random-jwt-secret-here
   OPENAI_API_KEY=sk-your-openai-key
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=maskiryz23@gmail.com
   MAIL_PASSWORD=your-gmail-app-password
   MAIL_USE_TLS=True
   MAIL_USE_SSL=False
   FRONTEND_URL=https://aku-kesepian.vercel.app
   FLASK_DEBUG=False
   ```

6. Click **Deploy**
7. Save your backend URL: `https://your-app.up.railway.app`

## Step 3: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Select your project → "Settings" → "Environment Variables"
3. Edit `REACT_APP_API_URL` to your Railway backend URL:
   ```
   REACT_APP_API_URL=https://your-app.up.railway.app
   ```
4. Click "Redeploy" to apply changes

## Step 4: Setup MongoDB Atlas (If not done yet)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user with read/write access
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Get connection string and update `MONGODB_URI` in Railway

## Step 5: Setup Gmail App Password (If not done yet)

1. Enable 2-Factor Authentication on Gmail
2. Google Account → Security → 2-Step Verification → App passwords
3. Generate password for "Mail"
4. Copy password and update `MAIL_PASSWORD` in Railway

## Step 6: Test Your Deployment

1. Visit your Vercel URL: `https://aku-kesepian.vercel.app`
2. Try to register a new account
3. Check email for verification
4. Login and test chat functionality
5. Login as admin: `maskiryz23@gmail.com`

## 🎉 Done!

Your app is now live!

- **Frontend**: https://aku-kesepian.vercel.app
- **Backend**: https://your-app.up.railway.app

## ⚠️ Important Notes

- Make sure backend CORS includes your frontend URL
- MongoDB must allow connections from `0.0.0.0/0`
- Gmail App Password is 16 characters without spaces
- Test all features after deployment

## 🔧 Troubleshooting

**Frontend can't connect to backend:**
- Check `REACT_APP_API_URL` has correct Railway URL
- No trailing slash in URL

**CORS Error:**
- Update `backend/app/__init__.py` CORS origins
- Redeploy backend

**Email not sending:**
- Verify Gmail App Password
- Check 2FA is enabled

**502 Bad Gateway:**
- Check Railway logs for errors
- Verify all environment variables are set

For detailed documentation, see `DEPLOYMENT.md`
