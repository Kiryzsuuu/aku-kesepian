import { createGlobalStyle } from 'styled-components';
import { COLORS } from '../config/constants';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: ${COLORS.textDark};
    background: ${COLORS.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    color: ${COLORS.textPrimary};
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1rem;
    color: ${COLORS.textSecondary};
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    color: ${COLORS.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${COLORS.primaryDark};
      text-decoration: underline;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${COLORS.light};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${COLORS.primary};
    border-radius: 10px;
    
    &:hover {
      background: ${COLORS.primaryDark};
    }
  }

  /* Selection color */
  ::selection {
    background: ${COLORS.primary};
    color: ${COLORS.white};
  }

  ::-moz-selection {
    background: ${COLORS.primary};
    color: ${COLORS.white};
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${COLORS.primary};
    outline-offset: 2px;
  }

  /* Remove default focus styles */
  button:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
  }
`;