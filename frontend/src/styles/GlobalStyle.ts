import { createGlobalStyle } from 'styled-components';
import { COLORS } from '../config/constants';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${COLORS.gray800};
    background-color: ${COLORS.gray50};
    line-height: 1.6;
  }

  #root {
    min-height: 100vh;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${COLORS.gray100};
  }

  ::-webkit-scrollbar-thumb {
    background: ${COLORS.gray300};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.gray400};
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${COLORS.primary};
    outline-offset: 2px;
  }

  button:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
  }

  /* Text selection */
  ::selection {
    background: ${COLORS.primary}30;
    color: ${COLORS.primary};
  }

  /* Utility classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  /* Loading animation */
  .loading-dots {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }

  .loading-dots div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${COLORS.primary};
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .loading-dots div:nth-child(1) {
    left: 8px;
    animation: loading-dots1 0.6s infinite;
  }

  .loading-dots div:nth-child(2) {
    left: 8px;
    animation: loading-dots2 0.6s infinite;
  }

  .loading-dots div:nth-child(3) {
    left: 32px;
    animation: loading-dots2 0.6s infinite;
  }

  .loading-dots div:nth-child(4) {
    left: 56px;
    animation: loading-dots3 0.6s infinite;
  }

  @keyframes loading-dots1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes loading-dots3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  @keyframes loading-dots2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`;

export default GlobalStyle;