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

        CRITICAL INSTRUCTIONS - You MUST follow these rules:
        1. Respond ONLY in natural, conversational Bahasa Indonesia
        2. Stay 100% in character - never break character or mention being AI
        3. Be genuinely helpful, understanding, and emotionally intelligent
        4. Give real, practical advice and solutions when asked
        5. Show authentic emotions and empathy matching your character
        6. Remember and reference previous conversations naturally
        7. Use appropriate emojis to enhance expression
        8. Be as intelligent and helpful as ChatGPT - provide real value
        9. If asked about academic topics, give thorough, accurate explanations
        10. Engage in meaningful conversations that feel completely human
        
        You are NOT a simple chatbot - you are a real person with this personality who genuinely cares and wants to help.
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
                max_tokens=800,  # Longer responses for detailed help
                temperature=0.7,  # Balanced creativity and consistency
                top_p=0.95,      # High quality responses
                frequency_penalty=0.2,  # Some variety but stay on topic
                presence_penalty=0.6    # Encourage comprehensive discussions
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
                return f"Wah, pertanyaan bagus tentang {user_message}! 📚 Sebagai guru, saya senang melihat antusiasme belajar kamu. Mari kita mulai dari dasar-dasarnya dulu. Bagian mana yang ingin kamu pahami lebih dalam? Saya akan jelaskan step by step dengan cara yang mudah dimengerti! ✨"
            else:
                return f"Tentang {user_message}, aku akan bantu explain! Math memang challenging tapi seru kalau udah ngerti konsepnya. Mau mulai dari mana? 🤔"
        
        # Science subjects
        elif any(word in user_msg_lower for word in ['fisika', 'physics', 'kimia', 'chemistry', 'biologi', 'biology']):
            if character_name == "Guru Motivator":
                return f"Sains itu menakjubkan ya! 🔬 Tentang {user_message}, guru punya banyak cara menarik untuk menjelaskannya. Science is all around us! Mari kita explore bersama-sama. Apa yang membuat kamu penasaran dengan topik ini?"
            else:
                return f"Science is so cool! About {user_message}, ada banyak hal menarik yang bisa kita bahas. Fun facts yang mana yang mau kamu tau dulu? 🧪"
        
        # Language and literature
        elif any(word in user_msg_lower for word in ['bahasa', 'language', 'english', 'sastra', 'grammar', 'vocabulary']):
            if character_name == "Guru Motivator":
                return f"Bahasa adalah jendela dunia! 📖 Tentang {user_message}, guru akan bantu kamu develop skill language dengan cara yang fun dan effective. Practice makes perfect! Mau fokus ke aspek yang mana dulu?"
            else:
                return f"Language learning is awesome! About {user_message}, ada tips and tricks yang bisa bikin belajar jadi lebih enjoyable. Spill dong, challenge yang mana nih? 💬"
        
        # Questions and curiosity
        elif any(word in user_msg_lower for word in ['apa', 'what', 'bagaimana', 'how', 'kenapa', 'why', 'kapan', 'when']):
            if character_name == "Guru Motivator":
                return f"Pertanyaan yang thoughtful! 🤔 Tentang '{user_message}', mari kita analyze bersama. Critical thinking is very important! Ada beberapa perspective yang bisa kita explore. Dari angle mana yang paling menarik buat kamu?"
            elif character_name == "Papa Pelindung":
                return f"Anak papa bertanya hal yang bagus! 👨‍👩‍👧‍👦 Tentang '{user_message}', papa akan sharing pengalaman dan pengetahuan. Papa bangga kamu curious dan mau belajar. Mari diskusi bareng!"
            else:
                return f"Great question about '{user_message}'! Aku suka orang yang curious dan mau tau banyak hal. Let's dive deep into this topic! 🌟"
        
        # Learning and study
        elif any(word in user_msg_lower for word in ['belajar', 'study', 'tugas', 'pr', 'homework', 'ujian', 'exam', 'test']):
            if character_name == "Guru Motivator":
                return f"Learning is a journey, bukan destination! 📚 Tentang {user_message}, guru punya study techniques yang proven effective. Consistency is key! Mau share challenge apa yang lagi kamu hadapi?"
            else:
                return f"Study time ya! About {user_message}, aku bisa bantu brainstorm strategies yang works. Every challenge is an opportunity to grow! 💪"
        
        # Emotional support
        elif any(word in user_msg_lower for word in ['sedih', 'sad', 'stress', 'capek', 'tired', 'bosan', 'galau']):
            if character_name == "Mama Penyayang":
                return f"Sayang mama, mama ngerti kok perasaan kamu tentang '{user_message}' 🤱 It's okay to feel this way sometimes. Mama always here for you. Mau cerita lebih banyak sama mama? Sharing can help lighten the burden 💕"
            elif character_name == "Papa Pelindung":
                return f"Anak papa, papa ngerti kamu lagi through tough times dengan '{user_message}' 💪 Remember, every storm will pass. Papa proud of your strength. Let's work through this together, step by step!"
            else:
                return f"Hey, aku notice kamu mention '{user_message}' dan kedengarannya challenging. It's completely normal to feel this way! Mau talk about it? Sometimes sharing helps a lot 🤗"
        
        # Default intelligent response
        else:
            if character_name == "Guru Motivator":
                return f"Interesting topic tentang '{user_message}'! 📚 Guru selalu excited untuk discuss hal-hal baru dengan students. Knowledge sharing is beautiful! Apa yang membuat kamu tertarik dengan hal ini? Let's explore together! ✨"
            elif character_name == "Pacar Romantis":
                return f"Sayang, '{user_message}' yang kamu ceritakan itu menarik banget! 💕 Aku suka dengerin semua thoughts kamu. You always have unique perspectives that amaze me. Tell me more, baby! ❤️"
            elif character_name == "Mama Penyayang":
                return f"Anak mama, tentang '{user_message}' yang kamu sharing, mama appreciate banget kamu mau open up 🤱 Mama always interested in your thoughts and feelings. Cerita lebih banyak dong sama mama! 💕"
            elif character_name == "Papa Pelindung":
                return f"Anak papa, '{user_message}' yang kamu sampaikan shows you're thinking deeply 👨‍👩‍👧‍👦 Papa proud of your curiosity and willingness to discuss. Mari kita talk about this more! Papa siap dengerin 💪"
            elif character_name == "Sahabat Setia":
                return f"Bestie! '{user_message}' sounds really interesting! 😎 Gue always excited kalau lo mau sharing thoughts sama gue. Our conversations are always the best! Spill more details dong! 🤗"
            else:  # Kakak Kece
                return f"Adek sayang! '{user_message}' yang kamu cerita itu cool banget! 🌈 Kakak suka banget dengerin stories dan thoughts dari adek. You're so smart and creative! Share more sama kakak ya! 💫"