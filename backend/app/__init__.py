from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from .models.database import Database
from .routes.auth import init_auth_routes
from .routes.chat import init_chat_routes
from .routes.admin import init_admin_routes

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire automatically
    
    # Initialize CORS
    CORS(app, origins=[
        "http://localhost:3000",  # React dev server
        "http://127.0.0.1:3000",
        "https://*.azurestaticapps.net",  # Azure Static Web Apps
        "https://*.azurewebsites.net",  # Azure App Service
        "https://*.vercel.app",  # Vercel
        os.getenv('FRONTEND_URL', 'http://localhost:3000')
    ])
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    # Initialize Database
    try:
        mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
        db_name = os.getenv('DATABASE_NAME', 'aku_kesepian')
        db = Database(mongodb_uri, db_name)
        print(f"✅ Connected to MongoDB: {db_name}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise e
    
    # JWT Error Handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Token sudah kedaluwarsa. Silakan login ulang.'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Token tidak valid'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Token akses diperlukan'
        }), 401
    
    # Register Blueprints
    auth_bp = init_auth_routes(db)
    chat_bp = init_chat_routes(db)
    admin_bp = init_admin_routes(db)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(admin_bp)
    
    # Health Check Route
    @app.route('/')
    def health_check():
        return jsonify({
            'success': True,
            'message': 'Aku Kesepian API is running! 💕',
            'version': '1.0.0'
        })
    
    # API Info Route
    @app.route('/api')
    def api_info():
        return jsonify({
            'success': True,
            'message': 'Aku Kesepian API',
            'version': '1.0.0',
            'endpoints': {
                'auth': {
                    'register': 'POST /api/auth/register',
                    'login': 'POST /api/auth/login',
                    'verify_email': 'POST /api/auth/verify-email',
                    'forgot_password': 'POST /api/auth/forgot-password',
                    'reset_password': 'POST /api/auth/reset-password',
                    'me': 'GET /api/auth/me'
                },
                'chat': {
                    'characters': 'GET /api/chat/characters',
                    'sessions': 'GET /api/chat/sessions',
                    'create_session': 'POST /api/chat/sessions',
                    'messages': 'GET /api/chat/sessions/<id>/messages',
                    'send_message': 'POST /api/chat/sessions/<id>/messages',
                    'delete_session': 'DELETE /api/chat/sessions/<id>'
                }
            }
        })
    
    # Global Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint tidak ditemukan'
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({
            'success': False,
            'message': 'Method tidak diizinkan untuk endpoint ini'
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'message': 'Terjadi kesalahan server internal'
        }), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    )