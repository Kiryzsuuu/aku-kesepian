# 🔷 Azure App Service Deployment Guide

## Prerequisites

- Azure Account (https://azure.microsoft.com/free/)
- Azure CLI installed (https://docs.microsoft.com/cli/azure/install-azure-cli)
- GitHub repository ready

## Architecture

- **Frontend**: Azure Static Web Apps (Free tier) ⚡
- **Backend**: Azure App Service (Python) 🐍
- **Database**: MongoDB Atlas (Free tier) ☁️

---

## Part 1: Deploy Backend to Azure App Service

### Step 1: Install Azure CLI

```bash
# Windows (PowerShell)
winget install Microsoft.AzureCLI

# Verify installation
az --version
```

### Step 2: Login to Azure

```bash
az login
```

### Step 3: Create Resource Group

```bash
# Create resource group
az group create --name aku-kesepian-rg --location southeastasia

# Verify
az group list --output table
```

### Step 4: Create App Service Plan

```bash
# Create Linux App Service Plan (Free tier F1 or Basic B1)
az appservice plan create \
  --name aku-kesepian-plan \
  --resource-group aku-kesepian-rg \
  --sku B1 \
  --is-linux

# For Free tier, use: --sku F1
```

### Step 5: Create Web App

```bash
# Create Python web app
az webapp create \
  --resource-group aku-kesepian-rg \
  --plan aku-kesepian-plan \
  --name aku-kesepian-backend \
  --runtime "PYTHON:3.11" \
  --deployment-local-git

# Save the deployment URL shown in output
```

### Step 6: Configure Deployment from GitHub

```bash
# Configure GitHub deployment
az webapp deployment source config \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg \
  --repo-url https://github.com/Kiryzsuuu/aku-kesepian \
  --branch main \
  --manual-integration

# Or use GitHub Actions (recommended)
az webapp deployment github-actions add \
  --repo Kiryzsuuu/aku-kesepian \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg \
  --runtime python \
  --runtime-version 3.11
```

### Step 7: Set Environment Variables

```bash
# Set all required environment variables
az webapp config appsettings set \
  --resource-group aku-kesepian-rg \
  --name aku-kesepian-backend \
  --settings \
    MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/" \
    DATABASE_NAME="aku_kesepian" \
    FLASK_SECRET_KEY="your-secret-key" \
    JWT_SECRET_KEY="your-jwt-secret" \
    OPENAI_API_KEY="sk-your-key" \
    MAIL_SERVER="smtp.gmail.com" \
    MAIL_PORT="587" \
    MAIL_USERNAME="maskiryz23@gmail.com" \
    MAIL_PASSWORD="your-app-password" \
    MAIL_USE_TLS="True" \
    MAIL_USE_SSL="False" \
    FRONTEND_URL="https://aku-kesepian.azurestaticapps.net" \
    FLASK_DEBUG="False" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" \
    WEBSITE_HTTPLOGGING_RETENTION_DAYS="7"
```

### Step 8: Configure Startup Command

```bash
# Set startup command
az webapp config set \
  --resource-group aku-kesepian-rg \
  --name aku-kesepian-backend \
  --startup-file "gunicorn --bind=0.0.0.0:8000 --timeout 600 --chdir backend run:app"
```

### Step 9: Enable CORS

```bash
# Enable CORS for frontend
az webapp cors add \
  --resource-group aku-kesepian-rg \
  --name aku-kesepian-backend \
  --allowed-origins "https://aku-kesepian.azurestaticapps.net" "http://localhost:3000"
```

### Step 10: Deploy Code

```bash
# Using Git deployment
cd "C:\Users\Rizky\Documents\Web Chat\Webchat"

# Add Azure remote
az webapp deployment source config-local-git \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg

# Get deployment credentials
az webapp deployment list-publishing-credentials \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg

# Deploy
git remote add azure https://<deployment-user>@aku-kesepian-backend.scm.azurewebsites.net/aku-kesepian-backend.git
git push azure main
```

### Backend URL
Your backend will be available at:
```
https://aku-kesepian-backend.azurewebsites.net
```

---

## Part 2: Deploy Frontend to Azure Static Web Apps

### Step 1: Create Static Web App

```bash
# Create Static Web App (Free tier)
az staticwebapp create \
  --name aku-kesepian \
  --resource-group aku-kesepian-rg \
  --location "East Asia" \
  --source https://github.com/Kiryzsuuu/aku-kesepian \
  --branch main \
  --app-location "frontend" \
  --output-location "build" \
  --login-with-github
```

### Step 2: Configure Environment Variables

```bash
# Set frontend environment variables
az staticwebapp appsettings set \
  --name aku-kesepian \
  --resource-group aku-kesepian-rg \
  --setting-names REACT_APP_API_URL="https://aku-kesepian-backend.azurewebsites.net"
```

### Frontend URL
Your frontend will be available at:
```
https://aku-kesepian.azurestaticapps.net
```

---

## Part 3: Configure GitHub Actions (Automatic)

Azure will automatically create GitHub Actions workflow files:

1. `.github/workflows/azure-staticwebapp-*.yml` (Frontend)
2. `.github/workflows/azure-webapps-python.yml` (Backend)

These files enable automatic deployment on every push to `main`.

---

## Alternative: Deploy via Azure Portal (GUI)

### Backend Deployment:

1. **Login to Azure Portal**: https://portal.azure.com
2. **Create Resource**:
   - Search "App Service"
   - Click "Create"
   
3. **Configure**:
   - Resource Group: Create new "aku-kesepian-rg"
   - Name: `aku-kesepian-backend`
   - Publish: Code
   - Runtime stack: Python 3.11
   - Region: Southeast Asia
   - Pricing plan: B1 Basic (or F1 Free)

4. **Deployment**:
   - Go to "Deployment Center"
   - Source: GitHub
   - Repository: Kiryzsuuu/aku-kesepian
   - Branch: main
   - Build: GitHub Actions

5. **Configuration**:
   - Go to "Configuration" → "Application settings"
   - Add all environment variables
   - Go to "General settings"
   - Startup Command: `gunicorn --bind=0.0.0.0:8000 --timeout 600 --chdir backend run:app`

6. **CORS**:
   - Go to "CORS"
   - Add: `https://aku-kesepian.azurestaticapps.net`
   - Save

### Frontend Deployment:

1. **Create Static Web App**:
   - Search "Static Web Apps"
   - Click "Create"

2. **Configure**:
   - Resource Group: aku-kesepian-rg
   - Name: `aku-kesepian`
   - Region: East Asia
   - Source: GitHub
   - Repository: Kiryzsuuu/aku-kesepian
   - Branch: main
   - Build Presets: React
   - App location: `/frontend`
   - Output location: `build`

3. **Environment Variables**:
   - Go to "Configuration"
   - Add: `REACT_APP_API_URL` = `https://aku-kesepian-backend.azurewebsites.net`

---

## Part 4: Update Backend CORS in Code

Update `backend/app/__init__.py`:

```python
CORS(app, origins=[
    "http://localhost:3000",
    "https://aku-kesepian.azurestaticapps.net",
    "https://aku-kesepian-backend.azurewebsites.net",
    os.getenv('FRONTEND_URL', 'http://localhost:3000')
])
```

Commit and push changes:
```bash
git add backend/app/__init__.py
git commit -m "Update CORS for Azure deployment"
git push
```

---

## Part 5: Monitor & Logs

### View Backend Logs:
```bash
# Stream logs
az webapp log tail \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg

# Download logs
az webapp log download \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg
```

### View in Portal:
- Go to App Service → "Log stream"
- Or "Diagnose and solve problems"

---

## Cost Estimation

### Free Tier Option:
- **Backend**: F1 Free (1 GB RAM, 60 min/day)
- **Frontend**: Static Web Apps Free (100 GB bandwidth/month)
- **Database**: MongoDB Atlas M0 Free (512 MB)
- **Total**: $0/month ⚠️ Limited resources

### Recommended Production:
- **Backend**: B1 Basic (~$13/month)
- **Frontend**: Static Web Apps Free
- **Database**: MongoDB Atlas M0 Free
- **Total**: ~$13/month

---

## Troubleshooting

### Backend Not Starting:
```bash
# Check logs
az webapp log tail --name aku-kesepian-backend --resource-group aku-kesepian-rg

# Check startup command
az webapp config show --name aku-kesepian-backend --resource-group aku-kesepian-rg

# Restart app
az webapp restart --name aku-kesepian-backend --resource-group aku-kesepian-rg
```

### CORS Errors:
- Check CORS settings in Azure Portal
- Verify frontend URL in environment variables
- Update `backend/app/__init__.py` CORS origins

### Environment Variables Not Working:
```bash
# List all settings
az webapp config appsettings list \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg

# Update specific setting
az webapp config appsettings set \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg \
  --settings OPENAI_API_KEY="new-key"
```

### Build Failures:
- Check `requirements.txt` is in `/backend` directory
- Verify Python version compatibility
- Check GitHub Actions logs in repository

---

## Custom Domain (Optional)

### Add Custom Domain:
```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name aku-kesepian-backend \
  --resource-group aku-kesepian-rg \
  --hostname yourdomain.com

# Enable HTTPS
az webapp config ssl bind \
  --name aku-kesepian-backend \
  --resource-group aku-kesepian-rg \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI
```

---

## Useful Commands

```bash
# Check app status
az webapp show --name aku-kesepian-backend --resource-group aku-kesepian-rg

# Restart app
az webapp restart --name aku-kesepian-backend --resource-group aku-kesepian-rg

# Stop app
az webapp stop --name aku-kesepian-backend --resource-group aku-kesepian-rg

# Start app
az webapp start --name aku-kesepian-backend --resource-group aku-kesepian-rg

# Delete resources (cleanup)
az group delete --name aku-kesepian-rg --yes
```

---

## 🎉 Final URLs

After deployment:
- **Frontend**: https://aku-kesepian.azurestaticapps.net
- **Backend**: https://aku-kesepian-backend.azurewebsites.net
- **Admin**: https://aku-kesepian.azurestaticapps.net/admin

Login as admin: `maskiryz23@gmail.com`

---

## Next Steps

1. ✅ Install Azure CLI
2. ✅ Login to Azure
3. ✅ Create resources
4. ✅ Deploy backend
5. ✅ Deploy frontend
6. ✅ Test all features
7. ✅ Monitor logs
8. ✅ Setup custom domain (optional)

For more details, see official docs:
- https://docs.microsoft.com/azure/app-service/
- https://docs.microsoft.com/azure/static-web-apps/
