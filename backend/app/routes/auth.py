from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from email_validator import validate_email, EmailNotValidError
import re
from datetime import timedelta
from ..models.database import UserModel, ResetTokenModel
from ..utils.email_service import EmailService
from bson import ObjectId
import bcrypt

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def init_auth_routes(db):
    user_model = UserModel(db)
    reset_token_model = ResetTokenModel(db)
    email_service = EmailService()
    
    @auth_bp.route('/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            
            # Validate input
            required_fields = ['email', 'username', 'password', 'full_name']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        'success': False,
                        'message': f'{field} wajib diisi'
                    }), 400
            
            email = data['email'].strip()
            username = data['username'].strip()
            password = data['password']
            full_name = data['full_name'].strip()
            
            # Validate email format
            try:
                valid = validate_email(email)
                email = valid.email
            except EmailNotValidError:
                return jsonify({
                    'success': False,
                    'message': 'Format email tidak valid'
                }), 400
            
            # Validate username (alphanumeric and underscore only)
            if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
                return jsonify({
                    'success': False,
                    'message': 'Username harus 3-20 karakter, hanya boleh huruf, angka, dan underscore'
                }), 400
            
            # Validate password strength
            if len(password) < 6:
                return jsonify({
                    'success': False,
                    'message': 'Password minimal 6 karakter'
                }), 400
            
            # Check if email already exists
            if user_model.get_user_by_email(email):
                return jsonify({
                    'success': False,
                    'message': 'Email sudah terdaftar'
                }), 400
            
            # Check if username already exists
            existing_user = db.users.find_one({'username': username})
            if existing_user:
                return jsonify({
                    'success': False,
                    'message': 'Username sudah digunakan'
                }), 400
            
            # Create user
            user_id = user_model.create_user(email, username, password, full_name)
            print(f"✅ User created with ID: {user_id}")
            
            # Generate verification token (using reset token model for simplicity)
            verification_token = reset_token_model.create_reset_token(user_id)
            print(f"✅ Verification token created: {verification_token[:20]}... for user {user_id}")
            
            # Send registration email
            email_sent = email_service.send_registration_email(email, username, verification_token)
            
            if not email_sent:
                print(f"❌ Failed to send email to {email}")
                return jsonify({
                    'success': False,
                    'message': 'Registrasi berhasil tapi gagal mengirim email verifikasi. Silakan coba lagi nanti.'
                }), 500
            
            print(f"✅ Registration email sent to {email}")
            
            return jsonify({
                'success': True,
                'message': 'Registrasi berhasil! Silakan cek email untuk verifikasi akun.'
            }), 201
        
        except Exception as e:
            print(f"❌ Registration error: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @auth_bp.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            email = data.get('email', '').strip()
            password = data.get('password', '')
            
            if not email or not password:
                return jsonify({
                    'success': False,
                    'message': 'Email dan password wajib diisi'
                }), 400
            
            # Get user
            user = user_model.get_user_by_email(email)
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'Email atau password salah'
                }), 401
            
            # Verify password
            if not user_model.verify_password(password, user['password_hash']):
                return jsonify({
                    'success': False,
                    'message': 'Email atau password salah'
                }), 401
            
            # Check if user is verified
            if not user.get('is_verified', False):
                return jsonify({
                    'success': False,
                    'message': 'Akun belum diverifikasi. Silakan cek email untuk verifikasi.'
                }), 401
            
            # Check if user is active
            if not user.get('is_active', True):
                return jsonify({
                    'success': False,
                    'message': 'Akun telah dinonaktifkan'
                }), 401
            
            # Create access token
            access_token = create_access_token(
                identity=str(user['_id']),
                expires_delta=timedelta(days=7)
            )
            
            # Update last login
            from datetime import datetime
            user_model.update_user(user['_id'], {'last_login': datetime.utcnow()})
            
            return jsonify({
                'success': True,
                'message': 'Login berhasil',
                'data': {
                    'access_token': access_token,
                    'user': {
                        'id': str(user['_id']),
                        'email': user['email'],
                        'username': user['username'],
                        'full_name': user['full_name'],
                        'profile': user.get('profile', {}),
                        'is_admin': user.get('is_admin', False)
                    }
                }
            }), 200
        
        except Exception as e:
            print(f"Login error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @auth_bp.route('/verify-email', methods=['POST'])
    def verify_email():
        try:
            data = request.get_json()
            token = data.get('token')
            
            print(f"📧 Verify email request with token: {token[:20] if token else 'None'}...")
            
            if not token:
                return jsonify({
                    'success': False,
                    'message': 'Token verifikasi wajib diisi'
                }), 400
            
            # Get and validate token
            token_data = reset_token_model.get_reset_token(token)
            print(f"🔍 Token data found: {token_data is not None}")
            
            if not token_data:
                print(f"❌ Token invalid or expired")
                return jsonify({
                    'success': False,
                    'message': 'Token verifikasi tidak valid atau sudah kedaluwarsa'
                }), 400
            
            print(f"✅ Verifying user: {token_data['user_id']}")
            # Verify user
            user_model.verify_user_email(token_data['user_id'])
            
            # Mark token as used
            reset_token_model.use_reset_token(token)
            print(f"✅ Email verified successfully")
            
            return jsonify({
                'success': True,
                'message': 'Email berhasil diverifikasi! Silakan login.'
            }), 200
        
        except Exception as e:
            print(f"❌ Email verification error: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @auth_bp.route('/forgot-password', methods=['POST'])
    def forgot_password():
        try:
            data = request.get_json()
            email = data.get('email', '').strip()
            
            if not email:
                return jsonify({
                    'success': False,
                    'message': 'Email wajib diisi'
                }), 400
            
            # Validate email format
            try:
                valid = validate_email(email)
                email = valid.email
            except EmailNotValidError:
                return jsonify({
                    'success': False,
                    'message': 'Format email tidak valid'
                }), 400
            
            # Get user
            user = user_model.get_user_by_email(email)
            if not user:
                # Don't reveal if email exists or not for security
                return jsonify({
                    'success': True,
                    'message': 'Jika email terdaftar, link reset password akan dikirim ke email tersebut.'
                }), 200
            
            # Generate reset token
            reset_token = reset_token_model.create_reset_token(user['_id'])
            
            # Send reset email
            email_sent = email_service.send_password_reset_email(
                email, 
                user['username'], 
                reset_token
            )
            
            if not email_sent:
                return jsonify({
                    'success': False,
                    'message': 'Gagal mengirim email reset password. Silakan coba lagi nanti.'
                }), 500
            
            return jsonify({
                'success': True,
                'message': 'Link reset password telah dikirim ke email Anda.'
            }), 200
        
        except Exception as e:
            print(f"Forgot password error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @auth_bp.route('/reset-password', methods=['POST'])
    def reset_password():
        try:
            data = request.get_json()
            token = data.get('token')
            new_password = data.get('password')
            
            if not token or not new_password:
                return jsonify({
                    'success': False,
                    'message': 'Token dan password baru wajib diisi'
                }), 400
            
            # Validate password strength
            if len(new_password) < 6:
                return jsonify({
                    'success': False,
                    'message': 'Password minimal 6 karakter'
                }), 400
            
            # Get and validate token
            token_data = reset_token_model.get_reset_token(token)
            if not token_data:
                return jsonify({
                    'success': False,
                    'message': 'Token reset tidak valid atau sudah kedaluwarsa'
                }), 400
            
            # Hash new password
            new_password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            
            # Update user password
            user_model.update_user(token_data['user_id'], {
                'password_hash': new_password_hash
            })
            
            # Mark token as used
            reset_token_model.use_reset_token(token)
            
            return jsonify({
                'success': True,
                'message': 'Password berhasil direset! Silakan login dengan password baru.'
            }), 200
        
        except Exception as e:
            print(f"Reset password error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @auth_bp.route('/me', methods=['GET'])
    @jwt_required()
    def get_current_user():
        try:
            current_user_id = get_jwt_identity()
            user = user_model.get_user_by_id(current_user_id)
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User tidak ditemukan'
                }), 404
            
            return jsonify({
                'success': True,
                'data': {
                    'user': {
                        'id': str(user['_id']),
                        'email': user['email'],
                        'username': user['username'],
                        'full_name': user['full_name'],
                        'profile': user.get('profile', {}),
                        'is_verified': user.get('is_verified', False),
                        'is_admin': user.get('is_admin', False),
                        'created_at': user.get('created_at').isoformat() if user.get('created_at') else None
                    }
                }
            }), 200
        
        except Exception as e:
            print(f"Get current user error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    return auth_bp