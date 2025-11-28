import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Heart, Loader } from 'lucide-react';
import styled from 'styled-components';
import {
  AuthContainer,
  AuthCard,
  Heading2,
  Text,
  Button,
  FlexContainer,
  LoadingSpinner,
  LoadingContainer
} from '../components/common/StyledComponents';
import { ROUTES, ANIMATION_VARIANTS, COLORS } from '../config/constants';
import { authAPI } from '../services/api';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasVerified = React.useRef(false);

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent double verification
      if (hasVerified.current) return;
      hasVerified.current = true;

      if (!token) {
        setVerificationState('error');
        setMessage('Token verifikasi tidak ditemukan');
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);
        
        if (response.success) {
          setVerificationState('success');
          setMessage('Email berhasil diverifikasi! Silakan login untuk melanjutkan.');
        } else {
          setVerificationState('error');
          setMessage(response.message || 'Verifikasi email gagal');
        }
      } catch (error: any) {
        setVerificationState('error');
        const errorMessage = error.response?.data?.message || 'Token verifikasi tidak valid atau sudah kedaluwarsa';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleContinue = () => {
    if (verificationState === 'success') {
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.REGISTER);
    }
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <LoadingContainer>
            <LoadingSpinner />
            <Text style={{ marginTop: '1rem', color: COLORS.gray600 }}>
              Memverifikasi email...
            </Text>
          </LoadingContainer>
        );

      case 'success':
        return (
          <SuccessContainer>
            <StatusIcon>
              <CheckCircle size={64} color={COLORS.success} />
            </StatusIcon>
            <Heading2 style={{ color: COLORS.success, margin: '1rem 0' }}>
              Email Terverifikasi! ✅
            </Heading2>
            <Text size="lg" style={{ margin: '1rem 0', color: COLORS.gray600 }}>
              {message}
            </Text>
            <Text style={{ marginBottom: '2rem', color: COLORS.gray500 }}>
              Sekarang kamu bisa login dan mulai chat dengan AI companions yang mengerti perasaanmu 💕
            </Text>
            <Button onClick={handleContinue} size="lg" fullWidth>
              <Heart size={20} />
              Login Sekarang
            </Button>
          </SuccessContainer>
        );

      case 'error':
        return (
          <ErrorContainer>
            <StatusIcon>
              <XCircle size={64} color={COLORS.error} />
            </StatusIcon>
            <Heading2 style={{ color: COLORS.error, margin: '1rem 0' }}>
              Verifikasi Gagal ❌
            </Heading2>
            <Text size="lg" style={{ margin: '1rem 0', color: COLORS.gray600 }}>
              {message}
            </Text>
            <Text style={{ marginBottom: '2rem', color: COLORS.gray500 }}>
              Link verifikasi mungkin sudah kedaluwarsa atau sudah digunakan sebelumnya.
            </Text>
            <FlexContainer direction="column" gap="1rem">
              <Button onClick={handleContinue} size="lg" fullWidth>
                Daftar Ulang
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(ROUTES.LOGIN)}
                size="lg" 
                fullWidth
              >
                Kembali ke Login
              </Button>
            </FlexContainer>
          </ErrorContainer>
        );

      default:
        return null;
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
        </LogoContainer>
        
        {renderContent()}
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

const SuccessContainer = styled.div`
  text-align: center;
`;

const ErrorContainer = styled.div`
  text-align: center;
`;

const StatusIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

export default VerifyEmailPage;