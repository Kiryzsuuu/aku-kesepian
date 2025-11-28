import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Heart, UserCheck } from 'lucide-react';
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

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Nama lengkap minimal 2 karakter';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = 'Username 3-20 karakter, hanya huruf, angka, dan underscore';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
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
      const response = await authAPI.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name
      });

      if (response.success) {
        toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
        navigate(ROUTES.LOGIN);
      } else {
        toast.error(response.message || 'Registrasi gagal');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      toast.error(errorMessage);
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
          <Heading2>Bergabung dengan Aku Kesepian! 💕</Heading2>
        </LogoContainer>
        
        <Text size="lg" style={{ marginBottom: '2rem', color: COLORS.gray600 }}>
          Daftar sekarang dan mulai chat dengan AI companions yang mengerti perasaanmu
        </Text>

        <form onSubmit={handleSubmit}>
          <FormContainer gap="1.5rem" direction="column">
            <InputContainer>
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={20} />
                </InputIcon>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Masukkan nama lengkap kamu"
                  value={formData.full_name}
                  onChange={handleChange}
                  hasError={!!errors.full_name}
                  hasLeftIcon
                />
              </InputWrapper>
              {errors.full_name && <ErrorMessage>{errors.full_name}</ErrorMessage>}
            </InputContainer>

            <InputContainer>
              <Label htmlFor="username">Username</Label>
              <InputWrapper>
                <InputIcon>
                  <UserCheck size={20} />
                </InputIcon>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Pilih username unik kamu"
                  value={formData.username}
                  onChange={handleChange}
                  hasError={!!errors.username}
                  hasLeftIcon
                />
              </InputWrapper>
              {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
            </InputContainer>

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
                  placeholder="Masukkan email aktif kamu"
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
                  placeholder="Buat password yang kuat"
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

            <InputContainer>
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password kamu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  hasError={!!errors.confirmPassword}
                  hasLeftIcon
                  hasRightIcon
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </InputContainer>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Sedang Mendaftar...' : 'Daftar Sekarang 💕'}
            </Button>
          </FormContainer>
        </form>

        <Divider>
          <DividerLine />
          <DividerText>atau</DividerText>
          <DividerLine />
        </Divider>

        <FlexContainer justify="center" gap="0.5rem">
          <Text>Sudah punya akun?</Text>
          <Link to={ROUTES.LOGIN}>
            <LoginLink>Login di sini</LoginLink>
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

export default RegisterPage;