from openai import OpenAI
import os
from typing import Dict, List, Optional
import json

class OpenAIService:
    def __init__(self):
        self.client = None
        self.api_available = False
        self.model = "gpt-3.5-turbo"
        
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key or api_key == 'your_openai_api_key_here':
                print("⚠️ OpenAI API key not configured")
                print("🔄 Using intelligent fallback responses")
                return
            
            # Simple, clean OpenAI client initialization
            self.client = OpenAI(api_key=api_key)
            
            # Test the API with minimal request
            test_response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5
            )
            
            self.api_available = True
            print("✅ OpenAI API connected successfully!")
            
        except Exception as e:
            print(f"⚠️ OpenAI API initialization failed: {e}")
            print("🔄 Using intelligent fallback responses")
            self.api_available = False

    def create_character_prompt(self, character_personality: str, chat_history: Optional[List[Dict]] = None) -> str:
        """Create a system prompt based on character personality and chat history"""
        
        base_prompt = f"""
{character_personality}

ATURAN PENTING:
- Kamu adalah MANUSIA SUNGGUHAN dengan personality ini, BUKAN AI atau bot
- Bicara dengan SANGAT NATURAL seperti chatting biasa dengan teman/keluarga
- JANGAN gunakan bahasa formal atau kaku - santai dan casual aja
- JANGAN terlalu panjang - keep it simple dan to the point
- Gunakan bahasa gaul, singkatan, dan cara bicara anak muda (gue/aku, lo/kamu, etc)
- HARUS pakai emoji yang sesuai untuk ekspresif, tapi jangan berlebihan
- Respond dengan natural - kadang pendek, kadang panjang sesuai konteks
- Kalau ditanya sesuatu, jawab langsung dan helpful
- Show personality yang KUAT dan UNIK sesuai karakter kamu

Ingat: Chat ini harus terasa kayak chat WhatsApp dengan orang deket, BUKAN customer service!
"""
        
        # Add recent conversation context if available
        if chat_history and len(chat_history) > 0:
            base_prompt += "\n\nRecent conversation context:\n"
            for msg in chat_history[-5:]:  # Only use last 5 messages for context
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                base_prompt += f"{role}: {content}\n"
        
        return base_prompt

    def generate_response(self, user_message: str, character_personality: str, chat_history: Optional[List[Dict]] = None, character_name: Optional[str] = None) -> str:
        """Generate AI response using OpenAI API or intelligent fallback"""
        
        if not self.api_available or not self.client:
            return self.get_intelligent_fallback(user_message, character_personality, character_name)
        
        try:
            system_prompt = self.create_character_prompt(character_personality, chat_history)
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=500,  # Shorter, more natural responses
                temperature=0.9,  # More creative and natural
                top_p=0.95,
                frequency_penalty=0.6,  # Avoid repetitive patterns
                presence_penalty=0.6    # Encourage varied vocabulary
            )
            
            content = response.choices[0].message.content
            return content.strip() if content else self.get_intelligent_fallback(user_message, character_personality, character_name)
            
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            return self.get_intelligent_fallback(user_message, character_personality, character_name)

    def get_intelligent_fallback(self, user_message: str, character_personality: str, character_name: Optional[str] = None) -> str:
        """Intelligent fallback responses when OpenAI API is not available"""
        
        user_msg_lower = user_message.lower()
        character_name = character_name or "Sahabat Setia"
        
        # Math and academic subjects
        if any(word in user_msg_lower for word in ['matematika', 'math', 'aljabar', 'geometry', 'kalkulus', 'trigonometri', 'statistik']):
            if character_name == "Guru Motivator":
                return f"Wah {user_message} ya! 📚 Oke deh, guru jelasin dari dasar. Sebenernya ini gampang kok kalau udah ngerti konsepnya. Mana nih yang bikin bingung?"
            else:
                return f"Math ya? {user_message} emang tricky sih 🤔 Tapi tenang, gue bantuin. Mulai dari mana nih?"
        
        # Science subjects
        elif any(word in user_msg_lower for word in ['fisika', 'physics', 'kimia', 'chemistry', 'biologi', 'biology']):
            if character_name == "Guru Motivator":
                return f"{user_message}? Seru tuh! 🔬 Science emang keren banget. Oke guru jelasin ya, yang mana dulu nih yang pengen tau?"
            else:
                return f"Science! {user_message} nih ya? Cool topic 🧪 Ada yang spesifik yang mau dibahas?"
        
        # Questions and curiosity
        elif any(word in user_msg_lower for word in ['apa', 'what', 'bagaimana', 'how', 'kenapa', 'why']):
            if character_name == "Guru Motivator":
                return f"Good question! Tentang {user_message}, coba kita bahas bareng ya 🤔 Kamu udah tau dasarnya belum?"
            elif character_name == "Papa Pelindung":
                return f"Anak papa nanya bagus nih 💪 Soal {user_message}, papa jelasin ya. Dengerin baik-baik"
            elif character_name == "Pacar Romantis":
                return f"Sayang nanya {user_message}? 💕 Oke deh baby, aku jelasin. Dengerin ya~"
            else:
                return f"Oh {user_message} ya? Interesting nih 🤔 Gue coba jelasin deh"
        
        # Learning and study  
        elif any(word in user_msg_lower for word in ['belajar', 'study', 'tugas', 'pr', 'homework', 'ujian', 'exam']):
            if character_name == "Guru Motivator":
                return f"Belajar {user_message} ya? 📚 Oke, guru punya tips nih biar lebih gampang. Udah sampai mana?"
            else:
                return f"Lagi {user_message}? Semangat! 💪 Butuh bantuan apa nih?"
        
        # Emotional support
        elif any(word in user_msg_lower for word in ['sedih', 'sad', 'stress', 'capek', 'tired', 'bosan', 'galau']):
            if character_name == "Mama Penyayang":
                return f"Sayang kok {user_message}? 🤱 Cerita sama mama apa yang bikin gitu. Mama dengerin kok 💕"
            elif character_name == "Papa Pelindung":
                return f"{user_message} ya nak? 💪 Gapapa, papa ngerti kok. Coba cerita kenapa?"
            elif character_name == "Pacar Romantis":
                return f"Baby kok {user_message}? 💕 Sini cerita sama aku. I'm here for you sayang ❤️"
            else:
                return f"Eh {user_message} kenapa? 🤗 Yuk cerita, mungkin bisa bantuin"
        
        # Default responses
        else:
            if character_name == "Guru Motivator":
                return f"Oh {user_message} ya? 📚 Menarik nih! Guru suka bahas hal-hal gini. Kamu pengen tau apa spesifiknya?"
            elif character_name == "Pacar Romantis":
                return f"Sayang ngomong {user_message}? 💕 Cute banget sih. Cerita lebih dong baby~"
            elif character_name == "Mama Penyayang":
                return f"Anak mama cerita soal {user_message} ya? 🤱 Mama seneng dengerin. Lanjut dong ceritanya"
            elif character_name == "Papa Pelindung":
                return f"Hmm {user_message} ya nak? 💪 Papa dengerin. Gimana cerita lengkapnya?"
            elif character_name == "Sahabat Setia":
                return f"Loh {user_message}? 😎 Seru tuh! Spill dong detailnya bro"
            else:  # Kakak Kece
                return f"Dek! {user_message} ya? 🌈 Kakak interested nih. Cerita lebih lanjut dong!"

    def generate_chat_title(self, first_message: str, character_name: str) -> str:
        """Generate a chat title based on the first message"""
        
        # Try to use OpenAI to generate title
        if self.api_available and self.client:
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Generate a short, descriptive chat title (max 5 words) in Indonesian based on the user's message. Only return the title, nothing else."},
                        {"role": "user", "content": first_message}
                    ],
                    max_tokens=20,
                    temperature=0.7
                )
                
                title = response.choices[0].message.content.strip()
                if title:
                    return title
            except Exception as e:
                print(f"Error generating title: {e}")
        
        # Fallback: Generate simple title
        words = first_message.split()[:4]
        if len(words) > 0:
            return ' '.join(words) + "..."
        else:
            return f"Chat dengan {character_name}"