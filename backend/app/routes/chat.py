from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.database import CharacterModel, ChatModel
from ..utils.openai_service import OpenAIService
from bson import ObjectId

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

def init_chat_routes(db):
    character_model = CharacterModel(db)
    chat_model = ChatModel(db)
    openai_service = OpenAIService()
    
    @chat_bp.route('/characters', methods=['GET'])
    @jwt_required()
    def get_characters():
        try:
            characters = character_model.get_all_characters()
            
            # Format characters for response
            formatted_characters = []
            for char in characters:
                formatted_characters.append({
                    'id': str(char['_id']),
                    'name': char['name'],
                    'description': char['description'],
                    'avatar': char['avatar'],
                    'greeting': char['greeting'],
                    'sample_responses': char.get('sample_responses', [])
                })
            
            return jsonify({
                'success': True,
                'data': {
                    'characters': formatted_characters
                }
            }), 200
        
        except Exception as e:
            print(f"Get characters error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @chat_bp.route('/sessions', methods=['GET'])
    @jwt_required()
    def get_chat_sessions():
        try:
            current_user_id = get_jwt_identity()
            sessions = chat_model.get_user_chat_sessions(current_user_id)
            
            # Format sessions with character info
            formatted_sessions = []
            for session in sessions:
                character = character_model.get_character(session['character_id'])
                
                formatted_sessions.append({
                    'id': str(session['_id']),
                    'title': session['title'],
                    'character': {
                        'id': str(character['_id']) if character else None,
                        'name': character['name'] if character else 'Unknown',
                        'avatar': character['avatar'] if character else '🤖'
                    },
                    'created_at': session['created_at'].isoformat(),
                    'updated_at': session['updated_at'].isoformat()
                })
            
            return jsonify({
                'success': True,
                'data': {
                    'sessions': formatted_sessions
                }
            }), 200
        
        except Exception as e:
            print(f"Get chat sessions error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @chat_bp.route('/sessions', methods=['POST'])
    @jwt_required()
    def create_chat_session():
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json()
            
            character_id = data.get('character_id')
            if not character_id:
                return jsonify({
                    'success': False,
                    'message': 'Character ID wajib diisi'
                }), 400
            
            # Validate character exists
            character = character_model.get_character(character_id)
            if not character:
                return jsonify({
                    'success': False,
                    'message': 'Karakter tidak ditemukan'
                }), 404
            
            # Create new chat session
            title = f"Chat dengan {character['name']}"
            session_id = chat_model.create_chat_session(
                current_user_id, 
                character_id, 
                title
            )
            
            # Add initial greeting message
            chat_model.add_message(
                session_id, 
                'ai', 
                character['greeting'], 
                character_id
            )
            
            return jsonify({
                'success': True,
                'data': {
                    'session_id': str(session_id),
                    'character': {
                        'id': str(character['_id']),
                        'name': character['name'],
                        'avatar': character['avatar']
                    },
                    'greeting': character['greeting']
                }
            }), 201
        
        except Exception as e:
            print(f"Create chat session error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @chat_bp.route('/sessions/<session_id>/messages', methods=['GET'])
    @jwt_required()
    def get_chat_messages(session_id):
        try:
            current_user_id = get_jwt_identity()
            
            # Validate session belongs to user
            session = chat_model.get_chat_session(session_id, current_user_id)
            if not session:
                return jsonify({
                    'success': False,
                    'message': 'Sesi chat tidak ditemukan'
                }), 404
            
            # Get messages
            messages = chat_model.get_chat_messages(session_id)
            
            # Format messages
            formatted_messages = []
            for msg in messages:
                formatted_messages.append({
                    'id': str(msg['_id']),
                    'sender_type': msg['sender_type'],
                    'content': msg['content'],
                    'timestamp': msg['timestamp'].isoformat()
                })
            
            # Get character info
            character = character_model.get_character(session['character_id'])
            
            return jsonify({
                'success': True,
                'data': {
                    'messages': formatted_messages,
                    'session': {
                        'id': str(session['_id']),
                        'title': session['title'],
                        'character': {
                            'id': str(character['_id']) if character else None,
                            'name': character['name'] if character else 'Unknown',
                            'avatar': character['avatar'] if character else '🤖'
                        }
                    }
                }
            }), 200
        
        except Exception as e:
            print(f"Get chat messages error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @chat_bp.route('/sessions/<session_id>/messages', methods=['POST'])
    @jwt_required()
    def send_message(session_id):
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json()
            
            message = data.get('message', '').strip()
            if not message:
                return jsonify({
                    'success': False,
                    'message': 'Pesan tidak boleh kosong'
                }), 400
            
            # Validate session belongs to user
            session = chat_model.get_chat_session(session_id, current_user_id)
            if not session:
                return jsonify({
                    'success': False,
                    'message': 'Sesi chat tidak ditemukan'
                }), 404
            
            # Get character
            character = character_model.get_character(session['character_id'])
            if not character:
                return jsonify({
                    'success': False,
                    'message': 'Karakter tidak ditemukan'
                }), 404
            
            # Save user message
            user_message_id = chat_model.add_message(session_id, 'user', message)
            
            # Get recent chat history for context
            recent_messages = chat_model.get_chat_messages(session_id, limit=10)
            
            # Generate AI response
            ai_response = openai_service.generate_response(
                message, 
                character['personality'],
                recent_messages,
                character['name']
            )
            
            if not ai_response:
                ai_response = "Maaf, aku lagi ada gangguan nih. Coba chat lagi ya! 😅"
            
            # Save AI response
            ai_message_id = chat_model.add_message(
                session_id, 
                'ai', 
                ai_response, 
                character['_id']
            )
            
            # Update chat title if this is the first user message
            if len(recent_messages) <= 2:  # Greeting + first user message
                new_title = openai_service.generate_chat_title(message, character['name'])
                db.chat_sessions.update_one(
                    {"_id": ObjectId(session_id)},
                    {"$set": {"title": new_title}}
                )
            
            return jsonify({
                'success': True,
                'data': {
                    'user_message': {
                        'id': str(user_message_id),
                        'sender_type': 'user',
                        'content': message,
                        'timestamp': chat_model.db.messages.find_one({'_id': user_message_id})['timestamp'].isoformat()
                    },
                    'ai_message': {
                        'id': str(ai_message_id),
                        'sender_type': 'ai',
                        'content': ai_response,
                        'timestamp': chat_model.db.messages.find_one({'_id': ai_message_id})['timestamp'].isoformat()
                    }
                }
            }), 201
        
        except Exception as e:
            print(f"Send message error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    @chat_bp.route('/sessions/<session_id>', methods=['DELETE'])
    @jwt_required()
    def delete_chat_session(session_id):
        try:
            current_user_id = get_jwt_identity()
            
            # Validate session belongs to user
            session = chat_model.get_chat_session(session_id, current_user_id)
            if not session:
                return jsonify({
                    'success': False,
                    'message': 'Sesi chat tidak ditemukan'
                }), 404
            
            # Soft delete session
            db.chat_sessions.update_one(
                {"_id": ObjectId(session_id)},
                {"$set": {"is_active": False}}
            )
            
            return jsonify({
                'success': True,
                'message': 'Sesi chat berhasil dihapus'
            }), 200
        
        except Exception as e:
            print(f"Delete chat session error: {e}")
            return jsonify({
                'success': False,
                'message': 'Terjadi kesalahan server'
            }), 500
    
    return chat_bp