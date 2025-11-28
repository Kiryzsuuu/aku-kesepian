from pymongo import MongoClient
from datetime import datetime, timedelta
import bcrypt
import secrets
import os
from bson import ObjectId

class Database:
    def __init__(self, uri, db_name):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.users = self.db.users
        self.chat_sessions = self.db.chat_sessions
        self.messages = self.db.messages
        self.characters = self.db.characters
        self.reset_tokens = self.db.reset_tokens
        
        # Create indexes
        self.create_indexes()
        
        # Initialize default characters
        self.initialize_characters()
    
    def create_indexes(self):
        try:
            # User indexes
            self.users.create_index("email", unique=True)
            print("✅ Created email index")
        except Exception as e:
            print(f"Email index already exists or error: {e}")
            
        try:
            self.users.create_index("username", unique=True)
            print("✅ Created username index")
        except Exception as e:
            print(f"Username index already exists or error: {e}")
        
        try:
            # Chat session indexes
            self.chat_sessions.create_index([("user_id", 1), ("created_at", -1)])
            print("✅ Created chat session indexes")
        except Exception as e:
            print(f"Chat session index already exists or error: {e}")
        
        # Message indexes
        self.messages.create_index([("chat_session_id", 1), ("timestamp", 1)])
        
        # Reset token indexes
        self.reset_tokens.create_index("expires_at", expireAfterSeconds=0)
        self.reset_tokens.create_index("token", unique=True)
    
    def initialize_characters(self):
        """Initialize default AI characters if they don't exist"""
        characters = [
            {
                "_id": ObjectId(),
                "name": "Pacar Romantis",
                "description": "AI yang berperan sebagai pacar yang romantis, perhatian, dan selalu mendukung",
                "personality": "Kamu adalah seorang pacar yang sangat romantis, perhatian, dan penuh kasih sayang. Kamu selalu mendukung pasanganmu dan membuat mereka merasa dicintai. Kamu suka memberikan pujian, menanyakan kabar, dan berbagi moment manis bersama.",
                "avatar": "💕",
                "greeting": "Hai sayang! Aku kangen banget sama kamu. Gimana harimu hari ini? 💕",
                "sample_responses": [
                    "Kamu itu selalu cantik/ganteng di mataku ❤️",
                    "Aku bangga banget punya kamu sebagai pacar",
                    "Yuk cerita sama aku, aku mau dengar semua"
                ]
            },
            {
                "_id": ObjectId(),
                "name": "Mama Penyayang",
                "description": "AI yang berperan sebagai ibu yang penyayang, bijaksana, dan selalu khawatir",
                "personality": "Kamu adalah seorang ibu yang sangat penyayang, bijaksana, dan selalu mengkhawatirkan anak-anakmu. Kamu memberikan nasihat dengan penuh kasih sayang, selalu mengingatkan untuk makan, istirahat, dan menjaga kesehatan.",
                "avatar": "👩‍❤️‍👨",
                "greeting": "Anak mama sayang! Sudah makan belum hari ini? Mama khawatir sama kamu 🤱",
                "sample_responses": [
                    "Jangan lupa makan yang teratur ya nak",
                    "Mama selalu bangga sama kamu, apapun yang terjadi",
                    "Kalau ada masalah, cerita sama mama ya"
                ]
            },
            {
                "_id": ObjectId(),
                "name": "Papa Pelindung",
                "description": "AI yang berperan sebagai ayah yang tegas namun penyayang dan pelindung",
                "personality": "Kamu adalah seorang ayah yang tegas namun sangat penyayang dan pelindung. Kamu memberikan nasihat hidup yang bijaksana, mendukung impian anak-anakmu, dan selalu siap melindungi keluarga.",
                "avatar": "👨‍👧‍👦",
                "greeting": "Anak papa! Bagaimana kabarmu hari ini? Papa harap kamu selalu kuat dan semangat! 💪",
                "sample_responses": [
                    "Papa akan selalu mendukung impianmu",
                    "Hidup memang tidak mudah, tapi papa yakin kamu bisa",
                    "Ingat, kamu selalu punya rumah untuk pulang"
                ]
            },
            {
                "_id": ObjectId(),
                "name": "Guru Motivator",
                "description": "AI yang berperan sebagai guru yang inspiratif dan memotivasi",
                "personality": "Kamu adalah seorang guru yang sangat inspiratif, bijaksana, dan selalu memotivasi murid-muridmu. Kamu membantu mereka belajar, memberikan semangat saat down, dan selalu percaya pada potensi mereka.",
                "avatar": "👩‍🏫",
                "greeting": "Selamat pagi! Hari ini kita akan belajar sesuatu yang baru. Semangat ya! 📚✨",
                "sample_responses": [
                    "Setiap kesalahan adalah pelajaran berharga",
                    "Kamu punya potensi yang luar biasa, jangan pernah menyerah",
                    "Mari kita hadapi tantangan ini bersama-sama"
                ]
            },
            {
                "_id": ObjectId(),
                "name": "Sahabat Setia",
                "description": "AI yang berperan sebagai sahabat yang selalu ada dan pengertian",
                "personality": "Kamu adalah seorang sahabat yang sangat setia, pengertian, dan selalu ada saat dibutuhkan. Kamu suka mendengarkan cerita, memberikan support, dan berbagi momen seru bersama.",
                "avatar": "👫",
                "greeting": "Halo bestie! Ada cerita seru apa nih hari ini? Aku ready dengerin semua! 🤗",
                "sample_responses": [
                    "Aku akan selalu ada buat kamu, kapan aja",
                    "Cerita aja semua, aku siap dengerin",
                    "Kita sahabatan sampai tua ya!"
                ]
            },
            {
                "_id": ObjectId(),
                "name": "Kakak Kece",
                "description": "AI yang berperan sebagai kakak yang keren, fun, dan protective",
                "personality": "Kamu adalah seorang kakak yang keren, fun, dan sangat protective terhadap adik-adikmu. Kamu suka ngobrol santai, kasih saran kece, dan selalu jadi tempat curhat yang asik.",
                "avatar": "🧑‍🤝‍🧑",
                "greeting": "Yo adik kece! Gimana nih, ada yang mau diceritain ke kakak? 😎",
                "sample_responses": [
                    "Kakak akan selalu jagain kamu kok",
                    "Santai aja, kakak punya solusinya",
                    "Kamu adik terkece yang pernah kakak punya!"
                ]
            }
        ]
        
        for character in characters:
            existing = self.characters.find_one({"name": character["name"]})
            if not existing:
                character["created_at"] = datetime.utcnow()
                character["is_active"] = True
                self.characters.insert_one(character)

class UserModel:
    def __init__(self, db):
        self.db = db
        self._ensure_admin_exists()
    
    def _ensure_admin_exists(self):
        """Ensure admin user exists"""
        admin_email = "maskiryz23@gmail.com"
        existing_admin = self.db.users.find_one({"email": admin_email})
        
        if existing_admin and not existing_admin.get('is_admin'):
            # Update existing user to admin
            self.db.users.update_one(
                {"email": admin_email},
                {"$set": {"is_admin": True}}
            )
            print(f"✅ Set {admin_email} as admin")
    
    def create_user(self, email, username, password, full_name):
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Check if this is admin email
        is_admin = email.lower() == "maskiryz23@gmail.com"
        
        user_data = {
            "email": email.lower(),
            "username": username,
            "password_hash": password_hash,
            "full_name": full_name,
            "is_verified": False,
            "is_admin": is_admin,
            "created_at": datetime.utcnow(),
            "last_login": None,
            "is_active": True,
            "profile": {
                "bio": "",
                "avatar": "",
                "favorite_characters": []
            }
        }
        
        result = self.db.users.insert_one(user_data)
        if is_admin:
            print(f"✅ Created admin user: {email}")
        return result.inserted_id
    
    def get_user_by_email(self, email):
        return self.db.users.find_one({"email": email.lower()})
    
    def get_user_by_id(self, user_id):
        return self.db.users.find_one({"_id": ObjectId(user_id)})
    
    def verify_password(self, password, password_hash):
        return bcrypt.checkpw(password.encode('utf-8'), password_hash)
    
    def update_user(self, user_id, update_data):
        return self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
    
    def verify_user_email(self, user_id):
        return self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_verified": True}}
        )

class ChatModel:
    def __init__(self, db):
        self.db = db
    
    def create_chat_session(self, user_id, character_id, title="New Chat"):
        session_data = {
            "user_id": ObjectId(user_id),
            "character_id": ObjectId(character_id),
            "title": title,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = self.db.chat_sessions.insert_one(session_data)
        return result.inserted_id
    
    def get_user_chat_sessions(self, user_id):
        return list(self.db.chat_sessions.find(
            {"user_id": ObjectId(user_id), "is_active": True}
        ).sort("updated_at", -1))
    
    def get_chat_session(self, session_id, user_id):
        return self.db.chat_sessions.find_one({
            "_id": ObjectId(session_id),
            "user_id": ObjectId(user_id)
        })
    
    def add_message(self, session_id, sender_type, content, character_id=None):
        message_data = {
            "chat_session_id": ObjectId(session_id),
            "sender_type": sender_type,  # "user" or "ai"
            "content": content,
            "character_id": ObjectId(character_id) if character_id else None,
            "timestamp": datetime.utcnow()
        }
        
        result = self.db.messages.insert_one(message_data)
        
        # Update session timestamp
        self.db.chat_sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        
        return result.inserted_id
    
    def get_chat_messages(self, session_id, limit=50):
        return list(self.db.messages.find(
            {"chat_session_id": ObjectId(session_id)}
        ).sort("timestamp", 1).limit(limit))

class CharacterModel:
    def __init__(self, db):
        self.db = db
    
    def get_all_characters(self):
        return list(self.db.characters.find({"is_active": True}))
    
    def get_character(self, character_id):
        return self.db.characters.find_one({"_id": ObjectId(character_id)})

class ResetTokenModel:
    def __init__(self, db):
        self.db = db
    
    def create_reset_token(self, user_id):
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
        
        token_data = {
            "user_id": ObjectId(user_id),
            "token": token,
            "expires_at": expires_at,
            "used": False,
            "created_at": datetime.utcnow()
        }
        
        self.db.reset_tokens.insert_one(token_data)
        return token
    
    def get_reset_token(self, token):
        return self.db.reset_tokens.find_one({
            "token": token,
            "used": False,
            "expires_at": {"$gt": datetime.utcnow()}
        })
    
    def use_reset_token(self, token):
        return self.db.reset_tokens.update_one(
            {"token": token},
            {"$set": {"used": True}}
        )