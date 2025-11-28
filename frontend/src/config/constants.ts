// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// App Configuration
export const APP_NAME = 'Aku Kesepian';
export const APP_VERSION = '1.0.0';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'aku_kesepian_token',
  USER: 'aku_kesepian_user',
  THEME: 'aku_kesepian_theme'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  CHAT: '/chat',
  CHARACTERS: '/characters',
  PROFILE: '/profile'
};

// Theme Colors - New Color Palette from ColorHunt (F875AA, FDEDEF, FFF0AE, DEFC)
export const COLORS = {
  // Main Palette Colors
  primary: '#F875AA',     // Pink
  secondary: '#FFF0AE',   // Light Yellow  
  tertiary: '#AEDEFC',    // Light Blue
  background: '#FDEDEF',  // Light Pink Background
  
  // Extended Colors
  primaryDark: '#E85D98',
  secondaryDark: '#F0E080',
  tertiaryDark: '#8BCEF0',
  backgroundDark: '#F5D5D8',
  
  // Status Colors
  success: '#4ADE80',
  warning: '#FFF0AE',
  error: '#EF4444',
  info: '#AEDEFC',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #F875AA 0%, #FFF0AE 100%)',
  secondaryGradient: 'linear-gradient(135deg, #AEDEFC 0%, #F875AA 100%)',
  backgroundGradient: 'linear-gradient(135deg, #FDEDEF 0%, #AEDEFC 50%, #FFF0AE 100%)',
  accentGradient: 'linear-gradient(135deg, #F875AA 0%, #AEDEFC 100%)',
  successGradient: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
  
  // Text Colors
  textPrimary: '#2D1B69',
  textSecondary: '#6B46C1',
  textLight: '#8B5CF6',
  textWhite: '#FFFFFF',
  textDark: '#1F2937',
  
  // Neutral colors
  white: '#FFFFFF',
  light: '#FDEDEF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Shadow and Border
  shadow: 'rgba(248, 117, 170, 0.2)',
  border: 'rgba(248, 117, 170, 0.3)',
  borderLight: 'rgba(174, 222, 252, 0.5)',
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }
};