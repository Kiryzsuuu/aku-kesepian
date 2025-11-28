import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../config/constants';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
      toast.error('Sesi telah berakhir. Silakan login ulang.');
    } else if (error.response?.status >= 500) {
      toast.error('Terjadi kesalahan server. Silakan coba lagi.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Koneksi timeout. Periksa koneksi internet Anda.');
    } else if (!error.response) {
      toast.error('Tidak dapat terhubung ke server.');
    }
    
    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  profile: {
    bio?: string;
    avatar?: string;
    favorite_characters?: string[];
  };
  is_verified?: boolean;
  created_at?: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  greeting: string;
  sample_responses: string[];
}

export interface Message {
  id: string;
  sender_type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  character: {
    id: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Authentication API
export const authAPI = {
  register: async (userData: {
    email: string;
    username: string;
    password: string;
    full_name: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ access_token: string; user: User }>> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const response = await api.post('/api/auth/verify-email', { token });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  getCharacters: async (): Promise<ApiResponse<{ characters: Character[] }>> => {
    const response = await api.get('/api/chat/characters');
    return response.data;
  },

  getChatSessions: async (): Promise<ApiResponse<{ sessions: ChatSession[] }>> => {
    const response = await api.get('/api/chat/sessions');
    return response.data;
  },

  createChatSession: async (characterId: string): Promise<ApiResponse<{
    session_id: string;
    character: Character;
    greeting: string;
  }>> => {
    const response = await api.post('/api/chat/sessions', { character_id: characterId });
    return response.data;
  },

  getChatMessages: async (sessionId: string): Promise<ApiResponse<{
    messages: Message[];
    session: ChatSession;
  }>> => {
    const response = await api.get(`/api/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  sendMessage: async (sessionId: string, message: string): Promise<ApiResponse<{
    user_message: Message;
    ai_message: Message;
  }>> => {
    const response = await api.post(`/api/chat/sessions/${sessionId}/messages`, { message });
    return response.data;
  },

  deleteChatSession: async (sessionId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/api/chat/sessions/${sessionId}`);
    return response.data;
  },
};

export default api;