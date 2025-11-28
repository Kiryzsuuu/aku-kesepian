from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.database import UserModel, ChatModel
from bson import ObjectId
from datetime import datetime
from functools import wraps

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(fn):
    """Decorator to require admin access"""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user_model = UserModel(admin_bp.db)
        user = user_model.get_user_by_id(current_user_id)
        
        if not user or not user.get('is_admin'):
            return jsonify({
                'success': False,
                'message': 'Akses ditolak. Admin only.'
            }), 403
        
        return fn(*args, **kwargs)
    return wrapper

def init_admin_routes(db):
    admin_bp.db = db
    user_model = UserModel(db)
    chat_model = ChatModel(db)
    
    @admin_bp.route('/check', methods=['GET'])
    @jwt_required()
    def check_admin():
        """Check if current user is admin"""
        try:
            current_user_id = get_jwt_identity()
            user = user_model.get_user_by_id(current_user_id)
            
            return jsonify({
                'success': True,
                'is_admin': user.get('is_admin', False) if user else False
            }), 200
        except Exception as e:
            print(f"Check admin error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error checking admin status'
            }), 500
    
    @admin_bp.route('/users', methods=['GET'])
    @admin_required
    def get_all_users():
        """Get all users with their stats"""
        try:
            users = list(db.users.find({}, {
                'password_hash': 0  # Don't send password hash
            }).sort('created_at', -1))
            
            # Add stats for each user
            for user in users:
                user['_id'] = str(user['_id'])
                
                # Count chat sessions
                user['total_sessions'] = db.chat_sessions.count_documents({
                    'user_id': ObjectId(user['_id']),
                    'is_active': True
                })
                
                # Count total messages
                user_sessions = db.chat_sessions.find({
                    'user_id': ObjectId(user['_id'])
                }, {'_id': 1})
                
                session_ids = [s['_id'] for s in user_sessions]
                user['total_messages'] = db.messages.count_documents({
                    'chat_session_id': {'$in': session_ids}
                })
                
                # Format dates
                user['created_at'] = user['created_at'].isoformat() if user.get('created_at') else None
                user['last_login'] = user['last_login'].isoformat() if user.get('last_login') else None
            
            return jsonify({
                'success': True,
                'data': {
                    'users': users,
                    'total': len(users)
                }
            }), 200
        except Exception as e:
            print(f"Get all users error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching users'
            }), 500
    
    @admin_bp.route('/users/<user_id>', methods=['DELETE'])
    @admin_required
    def delete_user(user_id):
        """Delete a user and all their data"""
        try:
            current_user_id = get_jwt_identity()
            
            # Prevent admin from deleting themselves
            if str(current_user_id) == user_id:
                return jsonify({
                    'success': False,
                    'message': 'Tidak bisa menghapus akun sendiri'
                }), 400
            
            # Get user's chat sessions
            user_sessions = db.chat_sessions.find({'user_id': ObjectId(user_id)})
            session_ids = [s['_id'] for s in user_sessions]
            
            # Delete user's messages
            db.messages.delete_many({'chat_session_id': {'$in': session_ids}})
            
            # Delete user's chat sessions
            db.chat_sessions.delete_many({'user_id': ObjectId(user_id)})
            
            # Delete user
            result = db.users.delete_one({'_id': ObjectId(user_id)})
            
            if result.deleted_count > 0:
                return jsonify({
                    'success': True,
                    'message': 'User berhasil dihapus'
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'message': 'User tidak ditemukan'
                }), 404
        except Exception as e:
            print(f"Delete user error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error deleting user'
            }), 500
    
    @admin_bp.route('/sessions', methods=['GET'])
    @admin_required
    def get_all_sessions():
        """Get all chat sessions from all users"""
        try:
            # Get all active sessions
            sessions = list(db.chat_sessions.find({
                'is_active': True
            }).sort('updated_at', -1).limit(100))
            
            formatted_sessions = []
            for session in sessions:
                # Get user info
                user = db.users.find_one({'_id': session['user_id']}, {
                    'username': 1, 'email': 1, 'full_name': 1
                })
                
                # Get character info
                character = db.characters.find_one({'_id': session['character_id']}, {
                    'name': 1, 'avatar': 1
                })
                
                # Get message count
                message_count = db.messages.count_documents({
                    'chat_session_id': session['_id']
                })
                
                # Get last message
                last_message = db.messages.find_one({
                    'chat_session_id': session['_id']
                }, sort=[('timestamp', -1)])
                
                formatted_sessions.append({
                    'session_id': str(session['_id']),
                    'title': session.get('title', 'Untitled Chat'),
                    'user': {
                        'id': str(user['_id']) if user else None,
                        'username': user.get('username', 'Unknown') if user else 'Unknown',
                        'email': user.get('email', '') if user else '',
                        'full_name': user.get('full_name', '') if user else ''
                    },
                    'character': {
                        'name': character.get('name', 'Unknown') if character else 'Unknown',
                        'avatar': character.get('avatar', '🤖') if character else '🤖'
                    },
                    'message_count': message_count,
                    'last_message': last_message.get('content', '')[:100] if last_message else '',
                    'last_message_time': last_message.get('timestamp').isoformat() if last_message else None,
                    'created_at': session['created_at'].isoformat(),
                    'updated_at': session['updated_at'].isoformat()
                })
            
            return jsonify({
                'success': True,
                'data': {
                    'sessions': formatted_sessions,
                    'total': len(formatted_sessions)
                }
            }), 200
        except Exception as e:
            print(f"Get all sessions error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching sessions'
            }), 500
    
    @admin_bp.route('/sessions/<session_id>/messages', methods=['GET'])
    @admin_required
    def get_session_messages(session_id):
        """Get all messages from a specific session"""
        try:
            # Get session info
            session = db.chat_sessions.find_one({'_id': ObjectId(session_id)})
            if not session:
                return jsonify({
                    'success': False,
                    'message': 'Session tidak ditemukan'
                }), 404
            
            # Get user info
            user = db.users.find_one({'_id': session['user_id']}, {
                'username': 1, 'email': 1, 'full_name': 1
            })
            
            # Get character info
            character = db.characters.find_one({'_id': session['character_id']}, {
                'name': 1, 'avatar': 1, 'personality': 1
            })
            
            # Get all messages
            messages = list(db.messages.find({
                'chat_session_id': ObjectId(session_id)
            }).sort('timestamp', 1))
            
            formatted_messages = []
            for msg in messages:
                formatted_messages.append({
                    'id': str(msg['_id']),
                    'sender_type': msg['sender_type'],
                    'content': msg['content'],
                    'timestamp': msg['timestamp'].isoformat()
                })
            
            return jsonify({
                'success': True,
                'data': {
                    'session': {
                        'id': str(session['_id']),
                        'title': session.get('title', 'Untitled Chat'),
                        'created_at': session['created_at'].isoformat(),
                        'updated_at': session['updated_at'].isoformat()
                    },
                    'user': {
                        'id': str(user['_id']) if user else None,
                        'username': user.get('username', 'Unknown') if user else 'Unknown',
                        'email': user.get('email', '') if user else '',
                        'full_name': user.get('full_name', '') if user else ''
                    },
                    'character': {
                        'name': character.get('name', 'Unknown') if character else 'Unknown',
                        'avatar': character.get('avatar', '🤖') if character else '🤖'
                    },
                    'messages': formatted_messages
                }
            }), 200
        except Exception as e:
            print(f"Get session messages error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching messages'
            }), 500
    
    @admin_bp.route('/sessions/<session_id>/takeover', methods=['POST'])
    @admin_required
    def takeover_session(session_id):
        """Admin takes over a chat session"""
        try:
            data = request.get_json()
            message = data.get('message', '').strip()
            
            if not message:
                return jsonify({
                    'success': False,
                    'message': 'Pesan tidak boleh kosong'
                }), 400
            
            # Verify session exists
            session = db.chat_sessions.find_one({'_id': ObjectId(session_id)})
            if not session:
                return jsonify({
                    'success': False,
                    'message': 'Session tidak ditemukan'
                }), 404
            
            # Add admin message
            admin_message = {
                'chat_session_id': ObjectId(session_id),
                'sender_type': 'admin',
                'content': message,
                'timestamp': datetime.utcnow()
            }
            
            result = db.messages.insert_one(admin_message)
            
            # Update session timestamp
            db.chat_sessions.update_one(
                {'_id': ObjectId(session_id)},
                {'$set': {'updated_at': datetime.utcnow()}}
            )
            
            return jsonify({
                'success': True,
                'data': {
                    'message_id': str(result.inserted_id),
                    'sender_type': 'admin',
                    'content': message,
                    'timestamp': admin_message['timestamp'].isoformat()
                }
            }), 201
        except Exception as e:
            print(f"Takeover session error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error sending admin message'
            }), 500
    
    @admin_bp.route('/sessions/<session_id>', methods=['DELETE'])
    @admin_required
    def delete_session(session_id):
        """Delete a chat session"""
        try:
            # Delete all messages in session
            db.messages.delete_many({'chat_session_id': ObjectId(session_id)})
            
            # Delete session
            result = db.chat_sessions.delete_one({'_id': ObjectId(session_id)})
            
            if result.deleted_count > 0:
                return jsonify({
                    'success': True,
                    'message': 'Session berhasil dihapus'
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'message': 'Session tidak ditemukan'
                }), 404
        except Exception as e:
            print(f"Delete session error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error deleting session'
            }), 500
    
    @admin_bp.route('/users/<user_id>/toggle-admin', methods=['PUT'])
    @admin_required
    def toggle_admin_role(user_id):
        """Toggle admin role for a user"""
        try:
            current_user_id = get_jwt_identity()
            
            # Prevent admin from removing their own admin role
            if str(current_user_id) == user_id:
                return jsonify({
                    'success': False,
                    'message': 'Tidak bisa mengubah role admin sendiri'
                }), 400
            
            # Get user
            user = db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User tidak ditemukan'
                }), 404
            
            # Prevent removing admin from maskiryz23@gmail.com
            if user.get('email') == 'maskiryz23@gmail.com':
                return jsonify({
                    'success': False,
                    'message': 'Tidak bisa mengubah role admin utama'
                }), 403
            
            # Toggle admin status
            new_admin_status = not user.get('is_admin', False)
            
            # Update user
            db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'is_admin': new_admin_status}}
            )
            
            action = 'ditambahkan sebagai' if new_admin_status else 'dihapus dari'
            return jsonify({
                'success': True,
                'message': f'User berhasil {action} admin',
                'is_admin': new_admin_status
            }), 200
        except Exception as e:
            print(f"Toggle admin role error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error toggling admin role'
            }), 500
    
    @admin_bp.route('/stats', methods=['GET'])
    @admin_required
    def get_stats():
        """Get overall statistics"""
        try:
            stats = {
                'total_users': db.users.count_documents({}),
                'total_sessions': db.chat_sessions.count_documents({'is_active': True}),
                'total_messages': db.messages.count_documents({}),
                'active_users_today': db.users.count_documents({
                    'last_login': {'$gte': datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)}
                })
            }
            
            return jsonify({
                'success': True,
                'data': stats
            }), 200
        except Exception as e:
            print(f"Get stats error: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching stats'
            }), 500
    
    return admin_bp
