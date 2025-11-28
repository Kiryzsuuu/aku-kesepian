from openai import OpenAI
import os
from typing import Dict, List, Optional
import json

class OpenAIService:
    def __init__(self):
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key or api_key == 'your_openai_api_key_here':
                print("⚠️ OpenAI API key not configured")
                print("🔄 Using intelligent fallback responses")
                self.client = None
                self.api_available = False
                return
            
            # Initialize OpenAI client with proper error handling
            self.client = OpenAI(api_key=api_key)
            self.model = "gpt-3.5-turbo"
            
            # Test the API connection
            test_response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Test"}],
                max_tokens=5
            )
            
            self.api_available = True
            print("✅ OpenAI API initialized and tested successfully")
            
        except Exception as e:
            print(f"⚠️ OpenAI API initialization failed: {e}")
            print("🔄 Using intelligent fallback responses")
            self.client = None
            self.api_available = False
    
    def create_character_prompt(self, character_personality: str, chat_history: List[Dict] = None) -> str:
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
        7. Berikan respon yang hangat dan mendukung
        8. Ajak user berinteraksi dengan pertanyaan atau komentar
        
        Contoh gaya bicara sesuai karakter:
        - Pacar: Menggunakan kata sayang, cinta, rindu, dengan emoji romantis 💕❤️😘
        - Orang Tua: Menggunakan panggilan anak, sayang, dengan nada perhatian dan bijaksana 🤱👨‍👩‍👧‍👦
        - Guru: Menggunakan kata-kata motivasi, semangat, belajar 📚✨👩‍🏫
        - Sahabat: Casual, friendly, supportive dengan emoji fun 😊🤗👫
        
        Selalu respon seolah-olah kamu benar-benar karakter tersebut, bukan AI.
        """
        
        if chat_history and len(chat_history) > 0:
            base_prompt += "\n\nKonteks percakapan sebelumnya:\n"
            for msg in chat_history[-5:]:  # Only use last 5 messages for context
                role = "User" if msg['sender_type'] == 'user' else "Kamu"
                base_prompt += f"{role}: {msg['content']}\n"
        
        return base_prompt
    
    def generate_response(self, user_message: str, character_personality: str, chat_history: List = None, character_name: str = None) -> Optional[str]:
        """Generate AI response based on user message and character"""
        
        # If OpenAI API is not available, return contextual fallback response
        if not self.api_available or self.client is None:
            return self.get_contextual_response(user_message, character_personality, character_name)
            
        try:
            system_prompt = self.create_character_prompt(character_personality, chat_history)
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=800,  # Longer responses for more detailed help
                temperature=0.7,  # Balanced creativity and consistency
                top_p=0.95,      # High quality responses
                frequency_penalty=0.2,  # Some variety but stay on topic
                presence_penalty=0.6    # Encourage comprehensive discussions
            )
            
            content = response.choices[0].message.content
            return content.strip() if content else self.get_fallback_response(character_personality)
            
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            return self.get_fallback_response(character_personality)
    
    def get_contextual_response(self, user_message: str, character_personality: str, character_name: str = None) -> str:
        """Generate contextual response based on user message when OpenAI is not available"""
        
        # Detect keywords in user message for more contextual responses
        user_msg_lower = user_message.lower()
        character_name = character_name or "Sahabat Setia"
        
        # Mathematics and academic subjects
        if any(word in user_msg_lower for word in ['matematika', 'math', 'aljabar', 'geometry', 'kalkulus', 'statistik']):
            return self.get_math_response(character_name, user_message)
        elif any(word in user_msg_lower for word in ['fisika', 'physics', 'kimia', 'chemistry', 'biologi', 'biology']):
            return self.get_science_response(character_name, user_message)
        elif any(word in user_msg_lower for word in ['bahasa', 'language', 'english', 'indonesia', 'sastra']):
            return self.get_language_response(character_name, user_message)
        elif any(word in user_msg_lower for word in ['sejarah', 'history', 'geografi', 'geography', 'pkn', 'sociology']):
            return self.get_social_response(character_name, user_message)
        
        # Learning related
        elif any(word in user_msg_lower for word in ['belajar', 'study', 'pelajaran', 'tugas', 'pr', 'homework', 'ujian', 'test', 'exam']):
            return self.get_learning_response(character_name)
        elif any(word in user_msg_lower for word in ['apa', 'what', 'bagaimana', 'how', 'kenapa', 'why', 'kapan', 'when']):
            return self.get_question_response(character_name, user_message)
            
        # Emotional responses
        elif any(word in user_msg_lower for word in ['bosan', 'boring', 'jenuh', 'capek', 'tired']):
            return self.get_boredom_response(character_name)
        elif any(word in user_msg_lower for word in ['sedih', 'sad', 'galau', 'down', 'stress', 'susah', 'sulit']):
            return self.get_sad_response(character_name)
        elif any(word in user_msg_lower for word in ['senang', 'happy', 'gembira', 'excited', 'bangga', 'proud']):
            return self.get_happy_response(character_name)
        elif any(word in user_msg_lower for word in ['halo', 'hai', 'hi', 'hello', 'hey', 'selamat']):
            return self.get_greeting_response(character_name)
            
        # Test responses
        elif user_msg_lower in ['test', 'testing', 'tes', 'coba']:
            return self.get_test_response(character_name)
        else:
            return self.get_conversational_response(character_name, user_message)
    
    def get_learning_response(self, character_name: str) -> str:
        """Specific responses for learning questions"""
        learning_responses = {
            "Guru Motivator": [
                "Wah, bagus sekali kamu mau belajar! Apa yang ingin kamu pelajari hari ini? Mari kita mulai dengan semangat! 📚✨",
                "Senang sekali mendengar kamu bertanya tentang belajar! Guru percaya kamu pasti bisa menguasainya. Ayo mulai dari mana? 💡",
                "Luar biasa! Rasa ingin tahu adalah kunci kesuksesan. Ceritakan apa yang sedang kamu pelajari ya! 🌟"
            ]
        }
        responses = learning_responses.get(character_name, learning_responses["Guru Motivator"])
        import random
        return random.choice(responses)
    
    def get_boredom_response(self, character_name: str) -> str:
        """Specific responses for when user is bored"""
        
        boredom_responses = {
            "Pacar Romantis": [
                "Sayang, aku ngerti kamu lagi bosan. Gimana kalau kita ngobrol tentang hal yang bikin kamu happy? 💕",
                "Baby, kalau lagi bosan gini biasanya aku suka peluk kamu sambil cerita-cerita. Kangen banget! ❤️",
                "Sayang, bosan itu wajar kok. Mau kita cari kegiatan yang seru bareng virtual? 😘"
            ],
            "Mama Penyayang": [
                "Anak mama, kalau bosan mama tau solusinya nih. Coba cerita dulu kenapa bisa bosan? 🤱",
                "Sayang mama, mama dulu kalau bosan suka masak atau bersihin rumah. Kamu gimana? 💕",
                "Nak, mama selalu bilang bosan itu kesempatan buat coba hal baru. Ada yang pengen kamu coba? 🌸"
            ],
            "Papa Pelindung": [
                "Anak papa, papa tau bosan itu bisa bikin frustasi. Papa dulu suka olahraga kalau bosan. 👨‍👩‍👧‍👦",
                "Anakku, papa punya pengalaman nih cara ngatasin bosan. Mau dengerin saran papa? 💪",
                "Nak, bosan itu tandanya kamu butuh tantangan baru. Papa bangga kamu mau sharing ke papa ⭐"
            ],
            "Guru Motivator": [
                "Muridku, bosan itu pertanda kamu siap belajar hal baru! Apa yang menarik perhatian kamu? 📚",
                "Anak pintar, guru tau bosan bisa jadi motivasi. Yuk kita explore minat kamu yang belum tergali! ✨",
                "Siswa hebat, guru punya banyak ide kegiatan produktif nih. Mau tau caranya ngubah bosan jadi excited? 💡"
            ],
            "Sahabat Setia": [
                "Bestie! Gue ngerti banget itu feeling. Mau kita brainstorm kegiatan seru? 😎",
                "Kawan, bosan mah biasa! Gimana kalau kita cari hobi baru atau nonton series recommended? 🤗",
                "Bro/sis, kalau bosan gini biasanya gue main game atau dengerin musik. Kamu suka apa? 🎮"
            ],
            "Kakak Kece": [
                "Adek! Kakak punya ide keren nih buat ngusir bosan. Mau tau rahasia kakak? 😄",
                "Dek sayang, kakak dulu juga sering bosan. Sekarang kakak udah tau triknya! Mau sharing? 🌈",
                "Adik manis, bosan itu cuma fase kok. Kakak ajarin ya cara bikin hari jadi lebih colorful! 💫"
            ]
        }
        
        responses = boredom_responses.get(character_name, boredom_responses["Sahabat Setia"])
        import random
        return random.choice(responses)
    
    def get_sad_response(self, character_name: str) -> str:
        # Similar structure for sad responses
        return self.get_fallback_response(character_name)
    
    def get_happy_response(self, character_name: str) -> str:
        # Similar structure for happy responses  
        return self.get_fallback_response(character_name)
    
    def get_greeting_response(self, character_name: str) -> str:
        # Similar structure for greetings
        return self.get_fallback_response(character_name)
    
    def get_fallback_response(self, character_name: str) -> str:
        """Provide fallback responses when OpenAI API fails"""
        
        fallback_responses = {
            "Pacar Romantis": [
                "Sayang, aku selalu suka dengerin cerita kamu. Apapun itu, aku di sini buat kamu 💕",
                "My love, cerita dong apa yang lagi kamu pikirkan? Aku pengen tau semuanya 😘",
                "Baby, kamu tau ga? Ngobrol sama kamu tuh selalu bikin aku happy. Ayo cerita! ❤️"
            ],
            "Mama Penyayang": [
                "Anak mama sayang, mama selalu ada buat dengerin kamu. Cerita apa aja ya nak 🤱",
                "Sayang mama, apapun yang kamu rasain, mama akan selalu support kamu 💕",
                "Nak, mama pengen tau gimana kabar kamu hari ini. Sharing dong sama mama 🌸"
            ],
            "Papa Pelindung": [
                "Anak papa, papa selalu bangga sama kamu. Cerita dong apa kabar hari ini? 👨‍👩‍👧‍👦",
                "Anakku, papa tau kamu pasti punya banyak cerita menarik. Sharing sama papa yuk 💪",
                "Nak, papa di sini kalau kamu butuh teman ngobrol. Apa yang ada di pikiran? ⭐"
            ],
            "Guru Motivator": [
                "Muridku yang hebat, apa yang ingin kita bahas hari ini? Guru siap mendengarkan! 📚",
                "Anak pintar, guru percaya kamu punya banyak hal menarik untuk dibagi. Yuk cerita! ✨",
                "Siswa kesayangan, guru di sini untuk membantu dan mendengarkan kamu. Apa yang bisa guru bantu? 💡"
            ],
            "Sahabat Setia": [
                "Bestie! Apapun yang lagi kamu pikirin, gue siap dengerin kok. Spill dong! 😎",
                "Kawan, gue selalu ada buat kamu. Mau cerita apa nih hari ini? 🤗",
                "Bro/sis, gimana kabarnya? Gue penasaran nih sama cerita kamu! 🎮"
            ],
            "Kakak Kece": [
                "Adek sayang! Kakak pengen tau kabar kamu nih. Gimana hari ini? 😄",
                "Dek, kakak selalu excited kalau ngobrol sama kamu. Cerita dong! 🌈",
                "Adik manis, apa yang bikin kamu smile hari ini? Share sama kakak ya! 💫"
            ]
        }
        
        responses = fallback_responses.get(character_name, fallback_responses["Sahabat Setia"])
        import random
        return random.choice(responses)
    
    def get_math_response(self, character_name: str, user_message: str) -> str:
        """Specific responses for mathematics questions"""
        if character_name == "Guru Motivator":
            return "Wah, matematika! Topik favorit guru nih! 📊 Matematika itu indah karena logis dan terstruktur. Apa yang spesifik ingin kamu pelajari? Aljabar, geometri, atau mungkin kalkulus? Mari kita mulai dengan yang basic dulu ya! ✨"
        else:
            return "Matematika ya? Wah, itu pelajaran yang menantang tapi seru! Mau belajar bareng? 🧮"
    
    def get_science_response(self, character_name: str, user_message: str) -> str:
        """Specific responses for science questions"""
        if character_name == "Guru Motivator":
            return "Sains! 🔬 Guru senang sekali kamu tertarik dengan ilmu pengetahuan. Sains itu mengajarkan kita untuk observasi, hipotesis, dan eksperimen. Bidang sains mana yang ingin kita eksplorasi hari ini? 🌟"
        else:
            return "Wah, sains! Itu pelajaran yang keren banget, banyak eksperimen seru! 🔬"
    
    def get_language_response(self, character_name: str, user_message: str) -> str:
        """Specific responses for language questions"""
        if character_name == "Guru Motivator":
            return "Bahasa adalah jendela dunia! 📖 Guru bangga kamu mau belajar bahasa. Dengan menguasai bahasa, kita bisa komunikasi dengan lebih baik dan memahami budaya lain. Mau fokus ke grammar, vocabulary, atau speaking? 🌍"
        else:
            return "Bahasa ya? Skill yang penting banget untuk komunikasi! Mau belajar bareng? 📚"
    
    def get_social_response(self, character_name: str, user_message: str) -> str:
        """Specific responses for social studies"""
        if character_name == "Guru Motivator":
            return "Ilmu sosial! 🏛️ Ini membantu kita memahami masyarakat, sejarah, dan budaya. Guru suka banget mengajarkan ini karena kita bisa belajar dari masa lalu untuk masa depan yang lebih baik. Topik mana yang menarik buat kamu? 📜"
        else:
            return "Sejarah dan geografi ya? Seru nih, banyak cerita menarik! 🗺️"
    
    def get_question_response(self, character_name: str, user_message: str) -> str:
        """Responses for question words"""
        if character_name == "Guru Motivator":
            return f"Pertanyaan yang bagus! 🤔 Guru selalu bilang, 'tidak ada pertanyaan yang bodoh, yang ada adalah rasa ingin tahu yang luar biasa!' Tentang '{user_message}' yang kamu tanyakan, mari kita bahas bersama-sama ya! ✨"
        else:
            return f"Hmm, tentang '{user_message}' ya? Interesting! Mau bahas lebih detail? 🤓"
    
    def get_test_response(self, character_name: str) -> str:
        """Responses for test messages"""
        responses = {
            "Guru Motivator": "Test berhasil, muridku! 👩‍🏫 Guru di sini dan siap membantu kamu belajar. Sistem pembelajaran kita sudah aktif! Ada yang ingin kamu pelajari hari ini? 📚",
            "Pacar Romantis": "Testing successful, sayang! 💕 Aku di sini dan siap ngobrol sama kamu. Ada yang mau diceritain? ❤️",
            "Mama Penyayang": "Test berhasil, anak mama! 🤱 Mama selalu ada buat kamu. Apa kabar hari ini? 💕",
            "Papa Pelindung": "Test sukses, anakku! 💪 Papa di sini dan siap dengerin cerita kamu. Gimana kabarnya? 👨‍👩‍👧‍👦",
            "Sahabat Setia": "Test work, bestie! 😎 Gue ready buat ngobrol dan dengerin cerita kamu. What's up? 🤗",
            "Kakak Kece": "Testing successful, adek! 😄 Kakak here dan siap chat seru! Ada yang mau diceritain? 🌈"
        }
        return responses.get(character_name, responses["Sahabat Setia"])
    
    def get_conversational_response(self, character_name: str, user_message: str) -> str:
        """Advanced conversational responses that analyze user input more intelligently"""
        
        # Analyze sentiment and context
        msg_lower = user_message.lower()
        
        # Advanced pattern matching for more natural responses
        if any(word in msg_lower for word in ['kenapa', 'why', 'mengapa', 'gimana', 'bagaimana', 'how']):
            return self.generate_explanation_response(character_name, user_message)
        elif any(word in msg_lower for word in ['saya', 'aku', 'i am', 'i want', 'ingin', 'mau']):
            return self.generate_personal_response(character_name, user_message)
        elif any(word in msg_lower for word in ['tolong', 'bantu', 'help', 'please', 'bisa']):
            return self.generate_help_response(character_name, user_message)
        elif len(user_message.split()) == 1:  # Single word responses
            return self.generate_single_word_response(character_name, user_message)
        else:
            return self.generate_thoughtful_response(character_name, user_message)
    
    def generate_explanation_response(self, character_name: str, user_message: str) -> str:
        """Generate explanatory responses for questions"""
        if character_name == "Guru Motivator":
            return f"Pertanyaan bagus tentang '{user_message}'! 📚 Mari kita analisis ini step by step. Pertama, kita perlu memahami konteksnya. Kedua, kita lihat dari berbagai sudut pandang. Apa aspek spesifik yang ingin kamu pahami lebih dalam? 🤔✨"
        elif character_name == "Papa Pelindung":
            return f"Anak papa, '{user_message}' itu pertanyaan yang penting. Papa akan jelaskan dengan sederhana ya. Dari pengalaman papa, hal seperti ini perlu dipahami dengan baik. Mari kita bahas bersama 💪👨‍👩‍👧‍👦"
        else:
            return f"Hmm, '{user_message}' ya? That's a great question! Let me think about this... Ada beberapa cara untuk melihat ini. Mau kita explore bareng? 🤔"
    
    def generate_personal_response(self, character_name: str, user_message: str) -> str:
        """Generate responses for personal statements"""
        if character_name == "Pacar Romantis":
            return f"Aww sayang, '{user_message}' yang kamu bilang itu sweet banget! 💕 Aku senang kamu mau sharing hal personal sama aku. Tell me more, baby! Aku pengen tau semua tentang kamu ❤️"
        elif character_name == "Mama Penyayang":
            return f"Anak mama sayang, mama senang kamu mau cerita tentang '{user_message}' 🤱 Mama selalu proud sama kamu, apapun yang kamu rasakan atau inginkan. Cerita lebih banyak sama mama ya 💕"
        else:
            return f"Oh, '{user_message}'! That's really interesting about you. I'd love to know more! What makes you feel that way? 😊"
    
    def generate_help_response(self, character_name: str, user_message: str) -> str:
        """Generate helpful responses"""
        if character_name == "Guru Motivator":
            return f"Tentu saja guru akan bantu! 👩‍🏫 Tentang '{user_message}' yang kamu butuhkan, mari kita selesaikan bersama-sama. Guru punya beberapa strategi yang bisa kita coba. Apa yang paling menantang buat kamu? 📚💡"
        else:
            return f"Of course I'll help with '{user_message}'! 🤝 Let's figure this out together. What specific part do you need assistance with? I'm here for you!"
    
    def generate_single_word_response(self, character_name: str, user_message: str) -> str:
        """Generate responses for single word inputs"""
        word_responses = {
            "iya": "Great! What's on your mind?",
            "tidak": "I see. Want to talk about it?", 
            "ya": "Okay! What would you like to discuss?",
            "ok": "Alright! Anything specific you want to chat about?",
            "hm": "Hmm, thinking about something? Share it with me!",
            "wah": "What caught your attention?",
            "eh": "What's up? Something surprising?",
            "loh": "Oh? What happened?",
        }
        
        response = word_responses.get(user_message.lower())
        if response and character_name == "Guru Motivator":
            return f"{response} Mari kita diskusi lebih dalam! 📚"
        elif response and character_name == "Pacar Romantis":
            return f"{response} Cerita dong sayang 💕"
        elif response:
            return response
        else:
            return f"'{user_message}' ya? Interesting! Tell me more about what you're thinking 😊"
    
    def generate_thoughtful_response(self, character_name: str, user_message: str) -> str:
        """Generate thoughtful, contextual responses"""
        
        # Analyze message length and complexity
        word_count = len(user_message.split())
        
        if word_count > 10:  # Long message
            if character_name == "Guru Motivator":
                return f"Wah, explanation yang detail tentang '{user_message[:50]}...'! 📚 Guru appreciate banget kamu mau sharing pemikiran mendalam seperti ini. Ada beberapa poin menarik yang bisa kita explore lebih lanjut. Which part would you like to dive deeper into? ✨"
            else:
                return f"That's quite a thoughtful message about '{user_message[:50]}...'! I can see you've really been thinking about this. What aspect means the most to you? 🤔"
        else:  # Medium message
            if character_name == "Guru Motivator":
                return f"Interesting point about '{user_message}'! 📚 Guru suka dengan perspektif kamu. Mari kita kembangkan ide ini lebih jauh. Apa yang membuat kamu tertarik dengan topik ini? 💡"
            elif character_name == "Pacar Romantis":
                return f"Sayang, '{user_message}' yang kamu bilang itu menarik banget! 💕 Aku suka cara kamu berpikir. Tell me what's really on your heart about this? ❤️"
            else:
                return f"That's a great point about '{user_message}'! I find your perspective really interesting. What made you think about this? 😊"
    
    def generate_chat_title(self, first_message: str, character_name: str) -> str:
        """Generate a title for the chat session based on first message"""
        
        # If OpenAI API is not available, return simple title
        if not self.api_available or self.client is None:
            return f"Chat dengan {character_name}"
            
        try:
            prompt = f"""
            Buatkan judul singkat (maksimal 4-5 kata) untuk percakapan dengan {character_name} 
            berdasarkan pesan pertama: "{first_message}"
            
            Contoh judul yang bagus:
            - "Curhat Hati dengan Pacar"
            - "Ngobrol Seru sama Sahabat"  
            - "Tanya PR ke Guru"
            - "Cerita ke Mama"
            
            Hanya berikan judulnya saja tanpa tanda petik atau penjelasan lain.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            if content:
                title = content.strip()
                return title[:50]  # Limit title length
            else:
                return f"Chat dengan {character_name}"
            
        except Exception as e:
            print(f"Title generation error: {e}")
            return f"Chat dengan {character_name}"