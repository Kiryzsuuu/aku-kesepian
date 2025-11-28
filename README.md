# Aku Kesepian 💕 - Your AI Companion

Chat dengan AI yang bisa jadi pacar, sahabat, keluarga, dan teman curhat yang selalu ada untukmu.

## 🚀 Fitur Utama

- **💕 Multiple AI Characters**: Pacar romantis, mama penyayang, papa pelindung, guru motivator, sahabat setia, kakak kece
- **🔐 Authentication System**: Register, login, email verification, forgot password
- **📧 Email Integration**: Notifikasi email untuk registrasi dan reset password
- **💬 Real-time Chat**: Chat interface yang responsif dan menarik
- **🎨 Beautiful UI**: Desain modern dengan gradients dan animations
- **📱 Responsive Design**: Works on desktop and mobile
- **🔒 Secure**: JWT authentication dan password hashing

## 🛠 Tech Stack

### Backend (Python)
- **Flask** - Web framework
- **MongoDB** - Database
- **OpenAI API** - AI chat responses
- **JWT** - Authentication
- **Flask-Mail** - Email service
- **bcrypt** - Password hashing

### Frontend (React)
- **React 18** with TypeScript
- **Styled Components** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB
- Gmail account (for email service)
- OpenAI API key

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd "Webchat"
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `backend/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/aku_kesepian
DATABASE_NAME=aku_kesepian

# JWT & Flask
JWT_SECRET_KEY=your_super_secret_jwt_key_here
FLASK_SECRET_KEY=your_flask_secret_key_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Gmail SMTP
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Aku Kesepian
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# Start MongoDB service (varies by OS)
sudo systemctl start mongod  # Linux
# or use MongoDB Compass
```

### 6. Run the Applications

**Backend (Terminal 1):**
```bash
cd backend
python run.py
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## 📧 Gmail Setup for Email Service

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in `MAIL_PASSWORD` environment variable

## 🎭 Available AI Characters

1. **💕 Pacar Romantis** - Romantic, caring, and supportive partner
2. **🤱 Mama Penyayang** - Loving, wise, and nurturing mother figure
3. **👨‍👩‍👧‍👦 Papa Pelindung** - Strong, protective, and supportive father figure
4. **👩‍🏫 Guru Motivator** - Inspirational and motivating teacher
5. **👫 Sahabat Setia** - Loyal, understanding, and fun best friend
6. **🧑‍🤝‍🧑 Kakak Kece** - Cool, protective, and fun older sibling

## 🚀 Deployment

### Backend Deployment
1. Update environment variables for production
2. Use gunicorn for production server:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```
3. Consider using services like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Update API URL in `.env.production`
2. Build the project:
```bash
npm run build
```
3. Deploy to services like Vercel, Netlify, or serve with nginx

### Database Deployment
- Use MongoDB Atlas for cloud database
- Update `MONGODB_URI` in production environment

## 📱 Usage

1. **Register**: Create a new account with email verification
2. **Login**: Access your account
3. **Choose Character**: Select an AI companion that matches your mood
4. **Start Chatting**: Begin conversation with your chosen AI character
5. **Multiple Sessions**: Create multiple chat sessions with different characters
6. **Chat History**: View and manage your previous conversations

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Email verification for new accounts
- Secure password reset via email
- Input validation and sanitization
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the logs in both backend and frontend terminals
2. Ensure all environment variables are set correctly
3. Verify MongoDB is running
4. Check OpenAI API key is valid
5. Ensure Gmail credentials are correct

## 🎯 Roadmap

- [ ] Voice chat integration
- [ ] Mobile app (React Native)
- [ ] More AI characters
- [ ] Group chat features
- [ ] Custom character creation
- [ ] Chat export functionality
- [ ] Multi-language support

## 💡 Tips

- Use specific and emotional prompts for better AI responses
- Each character has unique personality traits
- Chat history is automatically saved
- You can have multiple ongoing conversations
- Email verification is required for full access

---

**Made with 💕 to end loneliness through AI companionship**