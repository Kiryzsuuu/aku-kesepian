# Azure App Service startup command
gunicorn --bind=0.0.0.0:8000 --timeout 600 --workers 4 run:app
