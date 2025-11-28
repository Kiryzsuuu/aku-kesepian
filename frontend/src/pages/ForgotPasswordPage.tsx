import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Heart } from 'lucide-react';
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
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const response = await authAPI.forgotPassword(email);

      if (response.success) {
        setEmailSent(true);
        toast.success('Link reset password telah dikirim ke email Anda');
      } else {
        toast.error(response.message || 'Gagal mengirim email reset');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal mengirim email reset. Silakan coba lagi.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthContainer>
        <AuthCard
          as={motion.div}
          initial="initial"
          animate="animate"
          variants={ANIMATION_VARIANTS.slideUp}
        >
          <SuccessContainer>
            <SuccessIcon>📧</SuccessIcon>
            <Heading2>Email Terkirim! 💕</Heading2>
            <Text size="lg" style={{ margin: '1rem 0', color: COLORS.gray600 }}>
              Kami sudah mengirimkan link reset password ke email <strong>{email}</strong>
            </Text>
            <Text style={{ marginBottom: '2rem', color: COLORS.gray500 }}>
              Silakan cek email kamu (termasuk folder spam) dan ikuti instruksi untuk reset password.
              Link akan kedaluwarsa dalam 1 jam.
            </Text>
            <FlexContainer gap="1rem" direction="column">
              <Button as={Link} to={ROUTES.LOGIN} fullWidth>
                Kembali ke Login
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
              >
                Kirim Ulang ke Email Lain
              </Button>
            </FlexContainer>
          </SuccessContainer>
        </AuthCard>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <AuthCard
        as={motion.div}
        initial="initial"
        animate="animate"
        variants={ANIMATION_VARIANTS.slideUp}
      >
        <HeaderContainer>
          <Link to={ROUTES.LOGIN}>
            <BackButton>
              <ArrowLeft size={20} />
            </BackButton>
          </Link>
          <LogoContainer>
            <Heart size={40} />
            <Heading2>Lupa Password? 🤔</Heading2>
          </LogoContainer>
        </HeaderContainer>
        
        <Text size="lg" style={{ marginBottom: '2rem', color: COLORS.gray600 }}>
          Tidak masalah! Masukkan email kamu dan kami akan kirimkan link untuk reset password.
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
                  placeholder="Masukkan email yang terdaftar"
                  value={email}
                  onChange={handleChange}
                  hasError={!!errors.email}
                  style={{ paddingLeft: '3rem' }}
                />
              </InputWrapper>
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </InputContainer>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Mengirim Email...' : 'Kirim Link Reset Password 📧'}
            </Button>
          </FormContainer>
        </form>

        <Divider>
          <DividerLine />
          <DividerText>atau</DividerText>
          <DividerLine />
        </Divider>

        <FlexContainer justify="center" gap="0.5rem">
          <Text>Ingat password kamu?</Text>
          <Link to={ROUTES.LOGIN}>
            <LoginLink>Login di sini</LoginLink>
          </Link>
        </FlexContainer>

        <FlexContainer justify="center" gap="0.5rem" style={{ marginTop: '1rem' }}>
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
const HeaderContainer = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  color: ${COLORS.gray500};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${COLORS.gray100};
    color: ${COLORS.gray700};
  }
`;

const LogoContainer = styled.div`
  color: ${COLORS.primary};
`;

const FormContainer = styled(FlexContainer)`
  margin: 1rem 0;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.gray400};
  z-index: 1;
`;

const SuccessContainer = styled.div`
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
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

const LoginLink = styled.span`
  color: ${COLORS.primary};
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled.span`
  color: ${COLORS.primary};
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default ForgotPasswordPage;