# Azure Deployment Commands untuk Aku Kesepian

## 🎯 Resources yang Sudah Ada:

- **Backend**: aku-backend-h7aabeamdpb0gccp.indonesiacentral-01.azurewebsites.net
- **Frontend**: aku-frontend-bna0fncfc2crcjaf.indonesiacentral-01.azurewebsites.net
- **Resource Group**: aku-kesepian
- **Location**: Indonesia Central
- **App Service Plan**: ASP-akukesepian-a025 (B1)

---

## ✅ Step 1: Login ke Azure CLI

```powershell
# Login ke Azure
az login

# Pastikan subscription yang benar
az account show

# Set subscription jika perlu
az account set --subscription "a8b83bcd-a609-47f2-a9ec-8e2692045919"
```

---

## ✅ Step 2: Set Environment Variables untuk Backend

```powershell
# Set semua environment variables untuk backend
az webapp config appsettings set `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --settings `
    MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING" `
    DATABASE_NAME="aku_kesepian" `
    FLASK_SECRET_KEY="your-secret-key-here" `
    JWT_SECRET_KEY="your-jwt-secret-here" `
    OPENAI_API_KEY="sk-your-openai-key" `
    MAIL_SERVER="smtp.gmail.com" `
    MAIL_PORT="587" `
    MAIL_USERNAME="maskiryz23@gmail.com" `
    MAIL_PASSWORD="your-gmail-app-password" `
    MAIL_USE_TLS="True" `
    MAIL_USE_SSL="False" `
    FRONTEND_URL="https://aku-frontend-bna0fncfc2crcjaf.indonesiacentral-01.azurewebsites.net" `
    FLASK_DEBUG="False" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" `
    WEBSITE_HTTPLOGGING_RETENTION_DAYS="7"
```

---

## ✅ Step 3: Configure Backend Startup

```powershell
# Set startup command untuk backend
az webapp config set `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --startup-file "gunicorn --bind=0.0.0.0:\$PORT --timeout 600 --workers 4 run:app"

# Enable persistent storage
az webapp config appsettings set `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE="true"
```

---

## ✅ Step 4: Enable CORS untuk Backend

```powershell
# Enable CORS
az webapp cors add `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --allowed-origins `
    "https://aku-frontend-bna0fncfc2crcjaf.indonesiacentral-01.azurewebsites.net" `
    "http://localhost:3000"

# Show CORS settings
az webapp cors show `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp
```

---

## ✅ Step 5: Deploy Backend dari GitHub

```powershell
# Configure deployment dari GitHub
az webapp deployment source config `
  --name aku-backend-h7aabeamdpb0gccp `
  --resource-group aku-kesepian `
  --repo-url https://github.com/Kiryzsuuu/aku-kesepian `
  --branch main `
  --manual-integration

# Atau menggunakan GitHub Actions (recommended)
az webapp deployment github-actions add `
  --repo Kiryzsuuu/aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --resource-group aku-kesepian `
  --runtime python `
  --runtime-version 3.11 `
  --build-path backend
```

---

## ✅ Step 6: Configure Frontend Environment Variables

```powershell
# Set environment variable untuk frontend
az webapp config appsettings set `
  --resource-group aku-kesepian `
  --name aku-frontend-bna0fncfc2crcjaf `
  --settings `
    REACT_APP_API_URL="https://aku-backend-h7aabeamdpb0gccp.indonesiacentral-01.azurewebsites.net"
```

---

## ✅ Step 7: Deploy Frontend dari GitHub

```powershell
# Configure deployment untuk frontend
az webapp deployment source config `
  --name aku-frontend-bna0fncfc2crcjaf `
  --resource-group aku-kesepian `
  --repo-url https://github.com/Kiryzsuuu/aku-kesepian `
  --branch main `
  --manual-integration

# Set build command untuk React
az webapp config appsettings set `
  --resource-group aku-kesepian `
  --name aku-frontend-bna0fncfc2crcjaf `
  --settings `
    PRE_BUILD_COMMAND="cd frontend && npm install" `
    BUILD_COMMAND="cd frontend && npm run build" `
    POST_BUILD_COMMAND="cp -r frontend/build/* /home/site/wwwroot/"
```

---

## ✅ Step 8: Restart Both Apps

```powershell
# Restart backend
az webapp restart `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp

# Restart frontend
az webapp restart `
  --resource-group aku-kesepian `
  --name aku-frontend-bna0fncfc2crcjaf
```

---

## 📊 Step 9: Monitor Deployment

```powershell
# Stream backend logs
az webapp log tail `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp

# Stream frontend logs
az webapp log tail `
  --resource-group aku-kesepian `
  --name aku-frontend-bna0fncfc2crcjaf

# Check deployment status
az webapp deployment list `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp
```

---

## 🧪 Step 10: Test Endpoints

```powershell
# Test backend health
curl https://aku-backend-h7aabeamdpb0gccp.indonesiacentral-01.azurewebsites.net

# Test API endpoint
curl https://aku-backend-h7aabeamdpb0gccp.indonesiacentral-01.azurewebsites.net/api

# Test frontend
Start-Process "https://aku-frontend-bna0fncfc2crcjaf.indonesiacentral-01.azurewebsites.net"
```

---

## 🔧 Troubleshooting Commands

### Check Configuration
```powershell
# List all backend settings
az webapp config appsettings list `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --output table

# Show app details
az webapp show `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp
```

### Fix Common Issues
```powershell
# Enable detailed logging
az webapp log config `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --application-logging filesystem `
  --detailed-error-messages true `
  --failed-request-tracing true `
  --web-server-logging filesystem

# Download logs
az webapp log download `
  --resource-group aku-kesepian `
  --name aku-backend-h7aabeamdpb0gccp `
  --log-file backend-logs.zip
```

---

## 📝 Environment Variables Checklist

### Backend (WAJIB):
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `DATABASE_NAME` - aku_kesepian
- [ ] `FLASK_SECRET_KEY` - Random secret key
- [ ] `JWT_SECRET_KEY` - Random JWT secret
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `MAIL_USERNAME` - maskiryz23@gmail.com
- [ ] `MAIL_PASSWORD` - Gmail App Password
- [ ] `FRONTEND_URL` - Frontend Azure URL
- [ ] `FLASK_DEBUG` - False

### Frontend (WAJIB):
- [ ] `REACT_APP_API_URL` - Backend Azure URL

---

## 🎯 Final URLs

Setelah deployment berhasil:

- **Backend API**: https://aku-backend-h7aabeamdpb0gccp.indonesiacentral-01.azurewebsites.net
- **Frontend**: https://aku-frontend-bna0fncfc2crcjaf.indonesiacentral-01.azurewebsites.net
- **Admin**: https://aku-frontend-bna0fncfc2crcjaf.indonesiacentral-01.azurewebsites.net/admin

Login admin: `maskiryz23@gmail.com`

---

## 🚨 IMPORTANT: Update Secrets

Sebelum deploy, pastikan update nilai berikut:

1. **MONGODB_URI**: Dapatkan dari MongoDB Atlas
2. **FLASK_SECRET_KEY**: Generate dengan `python -c "import secrets; print(secrets.token_hex(32))"`
3. **JWT_SECRET_KEY**: Generate dengan `python -c "import secrets; print(secrets.token_hex(32))"`
4. **OPENAI_API_KEY**: Dari OpenAI dashboard
5. **MAIL_PASSWORD**: Gmail App Password (16 karakter)

---

## 📚 Quick Reference

```powershell
# View all resources
az resource list --resource-group aku-kesepian --output table

# Get backend URL
az webapp show -g aku-kesepian -n aku-backend-h7aabeamdpb0gccp --query defaultHostName -o tsv

# Get frontend URL
az webapp show -g aku-kesepian -n aku-frontend-bna0fncfc2crcjaf --query defaultHostName -o tsv

# SSH into backend (if needed)
az webapp ssh -g aku-kesepian -n aku-backend-h7aabeamdpb0gccp
```
