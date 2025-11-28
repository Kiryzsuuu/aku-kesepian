import styled from 'styled-components';
import { motion } from 'framer-motion';
import { COLORS } from '../../config/constants';

// Container Components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const FlexContainer = styled.div<{
  direction?: 'row' | 'column';
  justify?: string;
  align?: string;
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'flex-start'};
  gap: ${props => props.gap || '0'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
`;

export const GridContainer = styled.div<{
  columns?: number;
  gap?: string;
  minWidth?: string;
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 'auto-fit'}, minmax(${props => props.minWidth || '250px'}, 1fr));
  gap: ${props => props.gap || '1rem'};
`;

// Card Components
export const Card = styled(motion.div)`
  background: ${COLORS.white};
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 6px 25px ${COLORS.shadow};
  border: 2px solid ${COLORS.borderLight};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px ${COLORS.shadow};
    border-color: ${COLORS.primary};
  }
`;

export const GradientCard = styled(Card)`
  background: ${COLORS.primaryGradient};
  color: ${COLORS.white};
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }
`;

// Button Components
export const Button = styled(motion.button)<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  text-decoration: none;
  white-space: nowrap;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return `
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${COLORS.gray100};
          color: ${COLORS.gray700};
          &:hover:not(:disabled) {
            background: ${COLORS.gray200};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${COLORS.primary};
          border: 2px solid ${COLORS.primary};
          &:hover:not(:disabled) {
            background: ${COLORS.primary};
            color: ${COLORS.white};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${COLORS.gray600};
          &:hover:not(:disabled) {
            background: ${COLORS.gray100};
          }
        `;
      default:
        return `
          background: ${COLORS.primaryGradient};
          color: ${COLORS.white};
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }
        `;
    }
  }}

  ${props => props.fullWidth && `
    width: 100%;
  `}

  ${props => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}
`;

// Input Components
export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  width: 100%;
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${COLORS.gray700};
  font-size: 0.875rem;
`;

export const Input = styled.input<{ hasError?: boolean; hasLeftIcon?: boolean; hasRightIcon?: boolean }>`
  /* Reset all default styles */
  margin: 0;
  border: none;
  outline: none;
  
  /* Consistent sizing */
  width: 100%;
  min-height: 52px;
  height: 52px;
  max-height: 52px;
  
  /* Consistent padding */
  padding: 0 1rem;
  padding-left: ${props => props.hasLeftIcon ? '3rem' : '1rem'};
  padding-right: ${props => props.hasRightIcon ? '3rem' : '1rem'};
  
  /* Appearance */
  border-radius: 16px;
  border: 2px solid ${props => props.hasError ? COLORS.error : COLORS.borderLight};
  font-size: 1rem;
  line-height: 1;
  font-weight: 400;
  
  /* Layout */
  box-sizing: border-box;
  display: block;
  vertical-align: top;
  
  /* Visual effects */
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 4px ${COLORS.shadow};
    background: ${COLORS.white};
  }

  &::placeholder {
    color: ${COLORS.gray400};
    font-weight: 400;
  }

  &:disabled {
    background: ${COLORS.light};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-height: 48px;
    height: 48px;
    max-height: 48px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

export const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.9rem 1.2rem;
  border-radius: 16px;
  border: 2px solid ${props => props.hasError ? COLORS.error : COLORS.borderLight};
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  resize: vertical;
  min-height: 120px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 4px ${COLORS.shadow};
    background: ${COLORS.white};
  }

  &::placeholder {
    color: ${COLORS.gray400};
  }

  &:disabled {
    background: ${COLORS.light};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  color: ${COLORS.error};
  font-size: 0.875rem;
  font-weight: 500;
`;

// Typography Components
export const Heading1 = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: ${COLORS.primaryGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Heading2 = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${COLORS.gray800};
  margin: 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Heading3 = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: ${COLORS.gray800};
  margin: 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const Heading4 = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${COLORS.gray800};
  margin: 0;
  line-height: 1.4;
`;

export const Text = styled.p<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  weight?: string;
  align?: string;
}>`
  margin: 0;
  line-height: 1.6;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return 'font-size: 0.875rem;';
      case 'lg':
        return 'font-size: 1.125rem;';
      default:
        return 'font-size: 1rem;';
    }
  }}

  color: ${props => props.color || COLORS.gray600};
  font-weight: ${props => props.weight || '400'};
  text-align: ${props => props.align || 'left'};
`;

// Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${COLORS.backgroundGradient};
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(248, 117, 170, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(174, 222, 252, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 240, 174, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.backgroundGradient};
  padding: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 70%, rgba(248, 117, 170, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(174, 222, 252, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const AuthCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(248, 117, 170, 0.2);
  
  @media (max-width: 768px) {
    margin: 1rem;
    max-width: calc(100% - 2rem);
    padding: 1.25rem;
  }
`;

// Loading Components
export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${COLORS.gray200};
  border-top: 4px solid ${COLORS.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

// Badge Component
export const Badge = styled.span<{
  variant?: 'primary' | 'success' | 'warning' | 'error';
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: ${COLORS.success}20;
          color: ${COLORS.success};
        `;
      case 'warning':
        return `
          background: ${COLORS.warning}20;
          color: ${COLORS.warning};
        `;
      case 'error':
        return `
          background: ${COLORS.error}20;
          color: ${COLORS.error};
        `;
      default:
        return `
          background: ${COLORS.primary}20;
          color: ${COLORS.primary};
        `;
    }
  }}
`;