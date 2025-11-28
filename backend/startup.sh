#!/bin/bash
# Azure App Service startup command
# Azure sets PORT environment variable automatically
gunicorn --bind=0.0.0.0:${PORT:-8000} --timeout 600 --workers 4 run:app
