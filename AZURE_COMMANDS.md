# 🔷 Azure Quick Deploy Commands

## Prerequisites
```powershell
# Install Azure CLI
winget install Microsoft.AzureCLI

# Verify installation
az --version

# Login
az login
```

## 🚀 Quick Deploy (Copy & Paste)

### 1️⃣ Create Resources
```bash
# Set variables (customize these)
$RESOURCE_GROUP="aku-kesepian-rg"
$LOCATION="southeastasia"
$BACKEND_NAME="aku-kesepian-backend"
$FRONTEND_NAME="aku-kesepian"
$PLAN_NAME="aku-kesepian-plan"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan (Basic B1)
az appservice plan create `
  --name $PLAN_NAME `
  --resource-group $RESOURCE_GROUP `
  --sku B1 `
  --is-linux

# Create Backend Web App
az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan $PLAN_NAME `
  --name $BACKEND_NAME `
  --runtime "PYTHON:3.11"
```

### 2️⃣ Configure Backend
```bash
# Set environment variables (UPDATE THESE VALUES!)
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $BACKEND_NAME `
  --settings `
    MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/" `
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
    FRONTEND_URL="https://$FRONTEND_NAME.azurestaticapps.net" `
    FLASK_DEBUG="False" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true"

# Set startup command
az webapp config set `
  --resource-group $RESOURCE_GROUP `
  --name $BACKEND_NAME `
  --startup-file "gunicorn --bind=0.0.0.0:8000 --timeout 600 --chdir backend run:app"

# Enable CORS
az webapp cors add `
  --resource-group $RESOURCE_GROUP `
  --name $BACKEND_NAME `
  --allowed-origins "https://$FRONTEND_NAME.azurestaticapps.net" "http://localhost:3000"
```

### 3️⃣ Deploy Backend from GitHub
```bash
# Configure GitHub deployment
az webapp deployment source config `
  --name $BACKEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --repo-url https://github.com/Kiryzsuuu/aku-kesepian `
  --branch main `
  --manual-integration

# Get deployment URL
az webapp show --name $BACKEND_NAME --resource-group $RESOURCE_GROUP --query defaultHostName --output tsv
```

### 4️⃣ Create Frontend (Static Web App)
```bash
# Create Static Web App with GitHub integration
az staticwebapp create `
  --name $FRONTEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --location "eastasia" `
  --source https://github.com/Kiryzsuuu/aku-kesepian `
  --branch main `
  --app-location "frontend" `
  --output-location "build" `
  --login-with-github

# Set frontend environment variable
az staticwebapp appsettings set `
  --name $FRONTEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --setting-names REACT_APP_API_URL="https://$BACKEND_NAME.azurewebsites.net"
```

---

## 📊 Monitor & Manage

### View Logs
```bash
# Stream backend logs
az webapp log tail --name $BACKEND_NAME --resource-group $RESOURCE_GROUP

# Download logs
az webapp log download --name $BACKEND_NAME --resource-group $RESOURCE_GROUP
```

### Restart Services
```bash
# Restart backend
az webapp restart --name $BACKEND_NAME --resource-group $RESOURCE_GROUP

# Check status
az webapp show --name $BACKEND_NAME --resource-group $RESOURCE_GROUP --query state
```

### Update Environment Variables
```bash
# Update single variable
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $BACKEND_NAME `
  --settings OPENAI_API_KEY="new-key"

# List all variables
az webapp config appsettings list `
  --name $BACKEND_NAME `
  --resource-group $RESOURCE_GROUP
```

---

## 🔍 Troubleshooting Commands

### Check Deployment Status
```bash
# Check last deployment
az webapp deployment list-publishing-credentials `
  --name $BACKEND_NAME `
  --resource-group $RESOURCE_GROUP

# Check deployment history
az webapp deployment list `
  --name $BACKEND_NAME `
  --resource-group $RESOURCE_GROUP
```

### Test Backend
```bash
# Get backend URL
$BACKEND_URL = az webapp show --name $BACKEND_NAME --resource-group $RESOURCE_GROUP --query defaultHostName --output tsv
echo "Backend URL: https://$BACKEND_URL"

# Test API
curl "https://$BACKEND_URL/api"
```

### Debug Issues
```bash
# Enable detailed logging
az webapp log config `
  --name $BACKEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --application-logging filesystem `
  --detailed-error-messages true `
  --failed-request-tracing true `
  --web-server-logging filesystem

# View configuration
az webapp config show --name $BACKEND_NAME --resource-group $RESOURCE_GROUP
```

---

## 🗑️ Cleanup (Delete Resources)

### Delete Everything
```bash
# Delete entire resource group (CAUTION!)
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

### Delete Individual Resources
```bash
# Delete backend only
az webapp delete --name $BACKEND_NAME --resource-group $RESOURCE_GROUP

# Delete frontend only
az staticwebapp delete --name $FRONTEND_NAME --resource-group $RESOURCE_GROUP
```

---

## 💰 Cost Management

### View Current Costs
```bash
# Show cost analysis
az consumption usage list --start-date 2025-11-01 --end-date 2025-11-30

# Show pricing tier
az appservice plan show --name $PLAN_NAME --resource-group $RESOURCE_GROUP --query sku
```

### Change Pricing Tier
```bash
# Scale down to Free tier (F1)
az appservice plan update `
  --name $PLAN_NAME `
  --resource-group $RESOURCE_GROUP `
  --sku F1

# Scale up to Standard (S1)
az appservice plan update `
  --name $PLAN_NAME `
  --resource-group $RESOURCE_GROUP `
  --sku S1
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain
```bash
# Add domain
az webapp config hostname add `
  --webapp-name $BACKEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --hostname yourdomain.com

# Enable managed SSL certificate (free)
az webapp config ssl create `
  --name $BACKEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --hostname yourdomain.com
```

---

## 📱 Useful One-Liners

```bash
# Get backend URL
az webapp show -n $BACKEND_NAME -g $RESOURCE_GROUP --query defaultHostName -o tsv

# Get frontend URL
az staticwebapp show -n $FRONTEND_NAME -g $RESOURCE_GROUP --query defaultHostname -o tsv

# Restart all services
az webapp restart -n $BACKEND_NAME -g $RESOURCE_GROUP

# Open backend in browser
az webapp browse -n $BACKEND_NAME -g $RESOURCE_GROUP

# SSH into backend (if enabled)
az webapp ssh -n $BACKEND_NAME -g $RESOURCE_GROUP

# View all resources in group
az resource list -g $RESOURCE_GROUP --output table
```

---

## ✅ Verification Checklist

After deployment, verify:

```bash
# 1. Check backend is running
curl https://$BACKEND_NAME.azurewebsites.net

# 2. Check API endpoint
curl https://$BACKEND_NAME.azurewebsites.net/api

# 3. View logs
az webapp log tail -n $BACKEND_NAME -g $RESOURCE_GROUP

# 4. Check environment variables
az webapp config appsettings list -n $BACKEND_NAME -g $RESOURCE_GROUP

# 5. Test CORS
curl -H "Origin: https://$FRONTEND_NAME.azurestaticapps.net" `
  -H "Access-Control-Request-Method: POST" `
  -H "Access-Control-Request-Headers: Content-Type" `
  -X OPTIONS https://$BACKEND_NAME.azurewebsites.net/api/auth/login
```

---

## 🎯 Final URLs

After successful deployment:

- **Frontend**: `https://aku-kesepian.azurestaticapps.net`
- **Backend**: `https://aku-kesepian-backend.azurewebsites.net`
- **Admin Panel**: `https://aku-kesepian.azurestaticapps.net/admin`

Login: `maskiryz23@gmail.com`

---

## 📚 More Resources

- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)
- [App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
