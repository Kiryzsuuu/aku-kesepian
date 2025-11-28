import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, Heart } from 'lucide-react';
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

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetComplete, setResetComplete] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Token reset password tidak ditemukan');
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [token, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password baru wajib diisi';
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
    
    if (!validateForm() || !token) return;

    setLoading(true);
    
    try {
      const response = await authAPI.resetPassword(token, formData.password);

      if (response.success) {
        setResetComplete(true);
        toast.success('Password berhasil direset!');
      } else {
        toast.error(response.message || 'Reset password gagal');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Token tidak valid atau sudah kedaluwarsa';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (resetComplete) {
    return (
      <AuthContainer>
        <AuthCard
          as={motion.div}
          initial="initial"
          animate="animate"
          variants={ANIMATION_VARIANTS.slideUp}
        >
          <SuccessContainer>
            <StatusIcon>
              <CheckCircle size={64} color={COLORS.success} />
            </StatusIcon>
            <Heading2 style={{ color: COLORS.success, margin: '1rem 0' }}>
              Password Berhasil Direset! ✅
            </Heading2>
            <Text size="lg" style={{ margin: '1rem 0', color: COLORS.gray600 }}>
              Password kamu sudah berhasil diperbarui. Sekarang kamu bisa login dengan password yang baru.
            </Text>
            <Text style={{ marginBottom: '2rem', color: COLORS.gray500 }}>
              Jangan lupa simpan password barumu di tempat yang aman ya! 💕
            </Text>
            <Button onClick={() => navigate(ROUTES.LOGIN)} size="lg" fullWidth>
              <Heart size={20} />
              Login dengan Password Baru
            </Button>
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
        <LogoContainer>
          <Heart size={40} />
          <Heading2>Reset Password 🔐</Heading2>
        </LogoContainer>
        
        <Text size="lg" style={{ marginBottom: '2rem', color: COLORS.gray600 }}>
          Masukkan password baru untuk akun kamu. Pastikan passwordnya kuat dan mudah diingat!
        </Text>

        <form onSubmit={handleSubmit}>
          <FormContainer gap="1.5rem" direction="column">
            <InputContainer>
              <Label htmlFor="password">Password Baru</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password baru"
                  value={formData.password}
                  onChange={handleChange}
                  hasError={!!errors.password}
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
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
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password baru"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  hasError={!!errors.confirmPassword}
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
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

            <PasswordRequirements>
              <Text size="sm" color={COLORS.gray500}>
                Password harus:
              </Text>
              <RequirementsList>
                <RequirementItem valid={formData.password.length >= 6}>
                  ✓ Minimal 6 karakter
                </RequirementItem>
                <RequirementItem valid={formData.password === formData.confirmPassword && formData.password.length > 0}>
                  ✓ Kedua password harus sama
                </RequirementItem>
              </RequirementsList>
            </PasswordRequirements>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Mereset Password...' : 'Reset Password 🔐'}
            </Button>
          </FormContainer>
        </form>
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

const PasswordRequirements = styled.div`
  background: ${COLORS.gray50};
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid ${COLORS.info};
`;

const RequirementsList = styled.ul`
  margin: 0.5rem 0 0 0;
  padding: 0;
  list-style: none;
`;

const RequirementItem = styled.li<{ valid: boolean }>`
  color: ${props => props.valid ? COLORS.success : COLORS.gray400};
  font-size: 0.875rem;
  margin: 0.25rem 0;
  font-weight: ${props => props.valid ? '600' : '400'};
`;

const SuccessContainer = styled.div`
  text-align: center;
`;

const StatusIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

export default ResetPasswordPage;