import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import styled from 'styled-components';
import {
  AuthContainer,
  AuthCard,
  Heading2,
  Text,
  Button,
  Input,
  InputContainer,
  Label,
  ErrorMessage,
  FlexContainer
} from '../components/common/StyledComponents';
import { ROUTES, ANIMATION_VARIANTS, COLORS } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access
  const from = (location.state as any)?.from?.pathname || ROUTES.CHARACTERS;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard
        as={motion.div}
        initial="initial"
        animate="animate"
        variants={ANIMATION_VARIANTS.slideUp}
      >
        <LogoContainer>
          <Heart size={40} />
          <Heading2>Selamat Datang Kembali! 💕</Heading2>
        </LogoContainer>
        
        <Text size="lg" style={{ marginBottom: '2rem', color: COLORS.gray600 }}>
          Login untuk melanjutkan chat dengan AI companions favoritmu
        </Text>

        <form onSubmit={handleSubmit}>
          <FormContainer gap="1.5rem" direction="column">
            <InputContainer>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <InputIcon>
                  <Mail size={20} />
                </InputIcon>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email kamu"
                  value={formData.email}
                  onChange={handleChange}
                  hasError={!!errors.email}
                  hasLeftIcon
                />
              </InputWrapper>
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </InputContainer>

            <InputContainer>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password kamu"
                  value={formData.password}
                  onChange={handleChange}
                  hasError={!!errors.password}
                  hasLeftIcon
                  hasRightIcon
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </InputContainer>

            <FlexContainer justify="flex-end">
              <Link to={ROUTES.FORGOT_PASSWORD}>
                <ForgotPasswordLink>Lupa password?</ForgotPasswordLink>
              </Link>
            </FlexContainer>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Sedang Login...' : 'Login 💕'}
            </Button>
          </FormContainer>
        </form>

        <Divider>
          <DividerLine />
          <DividerText>atau</DividerText>
          <DividerLine />
        </Divider>

        <FlexContainer justify="center" gap="0.5rem">
          <Text>Belum punya akun?</Text>
          <Link to={ROUTES.REGISTER}>
            <RegisterLink>Daftar di sini</RegisterLink>
          </Link>
        </FlexContainer>
      </AuthCard>
    </AuthContainer>
  );
};

// Styled Components
const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: ${COLORS.primary};
`;

const FormContainer = styled(FlexContainer)`
  margin: 1rem 0;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.gray400};
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${COLORS.gray400};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${COLORS.gray600};
  }
`;

const ForgotPasswordLink = styled.span`
  color: ${COLORS.primary};
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${COLORS.gray200};
`;

const DividerText = styled.span`
  padding: 0 1rem;
  color: ${COLORS.gray400};
  font-size: 0.875rem;
`;

const RegisterLink = styled.span`
  color: ${COLORS.primary};
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage;