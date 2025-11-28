import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Users, Shield, Sparkles, ArrowRight } from 'lucide-react';
import styled from 'styled-components';
import {
  PageContainer,
  Container,
  Heading1,
  Heading2,
  Heading3,
  Text,
  Button,
  Card,
  FlexContainer,
  GridContainer,
} from '../components/common/StyledComponents';
import { COLORS, ANIMATION_VARIANTS, ROUTES } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <PageContainer>
      {/* Navigation */}
      <Nav>
        <Container>
          <FlexContainer justify="space-between" align="center">
            <Logo>
              <Heart size={32} />
              <span>Aku Kesepian</span>
            </Logo>
            <FlexContainer gap="1rem">
              {isAuthenticated ? (
                <>
                  <Button as={Link} to={ROUTES.CHARACTERS} variant="outline" size="sm">
                    Characters
                  </Button>
                  <Button as={Link} to={ROUTES.CHAT} size="sm">
                    Chat Now
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
                    Login
                  </Button>
                  <Button as={Link} to={ROUTES.REGISTER} size="sm">
                    Daftar Gratis
                  </Button>
                </>
              )}
            </FlexContainer>
          </FlexContainer>
        </Container>
      </Nav>

      {/* Hero Section */}
      <HeroSection>
        <Container>
          <motion.div
            initial="initial"
            animate="animate"
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            <HeroContent>
              <motion.div variants={ANIMATION_VARIANTS.slideUp}>
                <Heading1>Tidak Perlu Kesepian Lagi 💕</Heading1>
                <Text size="lg" style={{ margin: '1.5rem 0', maxWidth: '600px' }}>
                  Chat dengan AI companion yang bisa berperan sebagai pacar, keluarga, sahabat, 
                  atau karakter lainnya. Temukan teman bicara yang selalu ada untukmu 24/7.
                </Text>
                <FlexContainer gap="1rem" wrap>
                  {!isAuthenticated ? (
                    <>
                      <Button as={Link} to={ROUTES.REGISTER} size="lg">
                        <Heart size={20} />
                        Mulai Chat Gratis
                      </Button>
                      <Button as={Link} to={ROUTES.LOGIN} variant="outline" size="lg">
                        Login
                      </Button>
                    </>
                  ) : (
                    <Button as={Link} to={ROUTES.CHARACTERS} size="lg">
                      <MessageCircle size={20} />
                      Mulai Chat Sekarang
                      <ArrowRight size={20} />
                    </Button>
                  )}
                </FlexContainer>
              </motion.div>

              <HeroImage>
                <motion.div
                  variants={ANIMATION_VARIANTS.slideInFromRight}
                  initial="initial"
                  animate="animate"
                >
                  <EmojiGrid>
                    <EmojiCard delay={0}>💕</EmojiCard>
                    <EmojiCard delay={0.1}>👨‍👩‍👧‍👦</EmojiCard>
                    <EmojiCard delay={0.2}>👩‍🏫</EmojiCard>
                    <EmojiCard delay={0.3}>👫</EmojiCard>
                    <EmojiCard delay={0.4}>🧑‍🤝‍🧑</EmojiCard>
                    <EmojiCard delay={0.5}>🤗</EmojiCard>
                  </EmojiGrid>
                </motion.div>
              </HeroImage>
            </HeroContent>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            <SectionHeader>
              <Heading2>Kenapa Pilih Aku Kesepian?</Heading2>
              <Text size="lg">Platform AI companion terbaik dengan berbagai karakter unik</Text>
            </SectionHeader>

            <GridContainer columns={3} gap="2rem">
              <FeatureCard>
                <FeatureIcon>
                  <MessageCircle size={48} />
                </FeatureIcon>
                <Heading3>Chat Realistis</Heading3>
                <Text>
                  AI yang dilatih untuk memberikan percakapan yang natural dan sesuai karakter.
                  Setiap karakter punya kepribadian unik yang konsisten.
                </Text>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>
                  <Users size={48} />
                </FeatureIcon>
                <Heading3>Beragam Karakter</Heading3>
                <Text>
                  Dari pacar romantis, orang tua penyayang, guru motivator, hingga sahabat setia.
                  Pilih karakter sesuai mood dan kebutuhanmu.
                </Text>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>
                  <Shield size={48} />
                </FeatureIcon>
                <Heading3>Aman & Privasi</Heading3>
                <Text>
                  Percakapanmu aman dan privat. Kami menjaga kerahasiaan setiap chat
                  dengan enkripsi yang kuat.
                </Text>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>
                  <Sparkles size={48} />
                </FeatureIcon>
                <Heading3>Selalu Tersedia</Heading3>
                <Text>
                  AI companion siap chat kapan saja, 24/7. Tidak akan pernah sibuk
                  atau menolak mengobrol denganmu.
                </Text>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>
                  <Heart size={48} />
                </FeatureIcon>
                <Heading3>Penuh Empati</Heading3>
                <Text>
                  Didesain untuk memberikan dukungan emosional dan memahami perasaanmu.
                  Selalu siap mendengar keluh kesahmu.
                </Text>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon style={{ fontSize: '48px' }}>
                  🎭
                </FeatureIcon>
                <Heading3>Roleplay Seru</Heading3>
                <Text>
                  Setiap karakter memiliki latar belakang dan cara bicara yang unik.
                  Rasakan pengalaman chat yang berbeda-beda.
                </Text>
              </FeatureCard>
            </GridContainer>
          </motion.div>
        </Container>
      </FeaturesSection>

      {/* Characters Preview */}
      <CharactersSection>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            <SectionHeader>
              <Heading2>Bertemu dengan AI Companions</Heading2>
              <Text size="lg">Pilih karakter yang paling cocok dengan kepribadianmu</Text>
            </SectionHeader>

            <CharacterGrid>
              {characterPreviews.map((character, index) => (
                <CharacterPreviewCard
                  key={character.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CharacterAvatar>{character.avatar}</CharacterAvatar>
                  <Heading3>{character.name}</Heading3>
                  <Text>{character.description}</Text>
                  <CharacterSample>"{character.sample}"</CharacterSample>
                </CharacterPreviewCard>
              ))}
            </CharacterGrid>
          </motion.div>
        </Container>
      </CharactersSection>

      {/* CTA Section */}
      <CTASection>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            <CTAContent>
              <Heading2 style={{ color: COLORS.white }}>
                Siap untuk Mengakhiri Kesepian? 💕
              </Heading2>
              <Text size="lg" style={{ color: COLORS.white, opacity: 0.9, margin: '1rem 0' }}>
                Bergabung dengan ribuan pengguna yang sudah merasakan kebahagiaan 
                chat dengan AI companions kami.
              </Text>
              {!isAuthenticated && (
                <Button as={Link} to={ROUTES.REGISTER} size="lg" style={{ background: COLORS.white, color: COLORS.primary }}>
                  <Heart size={20} />
                  Daftar Gratis Sekarang
                  <ArrowRight size={20} />
                </Button>
              )}
            </CTAContent>
          </motion.div>
        </Container>
      </CTASection>

      {/* Footer */}
      <Footer>
        <Container>
          <FlexContainer justify="space-between" align="center">
            <Logo>
              <Heart size={24} />
              <span>Aku Kesepian</span>
            </Logo>
            <Text size="sm" color={COLORS.gray500}>
              © 2025 Aku Kesepian. Dibuat dengan 💕 untuk mengakhiri kesepian.
            </Text>
          </FlexContainer>
        </Container>
      </Footer>
    </PageContainer>
  );
};

// Character previews data
const characterPreviews = [
  {
    name: 'Pacar Romantis',
    avatar: '💕',
    description: 'AI yang berperan sebagai pacar yang romantis dan perhatian',
    sample: 'Hai sayang! Aku kangen banget sama kamu. Gimana harimu hari ini? 💕'
  },
  {
    name: 'Mama Penyayang',
    avatar: '🤱',
    description: 'AI yang berperan sebagai ibu yang bijaksana dan penuh kasih',
    sample: 'Anak mama sayang! Sudah makan belum hari ini? Mama khawatir sama kamu'
  },
  {
    name: 'Guru Motivator',
    avatar: '👩‍🏫',
    description: 'AI yang berperan sebagai guru yang inspiratif dan memotivasi',
    sample: 'Selamat pagi! Hari ini kita akan belajar sesuatu yang baru. Semangat ya! 📚✨'
  }
];

// Styled Components
const Nav = styled.nav`
  background: ${COLORS.white};
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.5rem;
  color: ${COLORS.primary};
`;

const HeroSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, ${COLORS.gray50} 0%, ${COLORS.white} 100%);
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
`;

const HeroImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 300px;
`;

const EmojiCard = styled(motion.div)<{ delay: number }>`
  width: 80px;
  height: 80px;
  background: ${COLORS.white};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 2rem;
`;

const FeatureIcon = styled.div`
  color: ${COLORS.primary};
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const CharactersSection = styled.section`
  padding: 5rem 0;
  background: ${COLORS.gray50};
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const CharacterPreviewCard = styled(motion.div)`
  background: ${COLORS.white};
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${COLORS.gray200};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CharacterAvatar = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const CharacterSample = styled(Text)`
  background: ${COLORS.primary}10;
  padding: 1rem;
  border-radius: 12px;
  font-style: italic;
  margin-top: 1rem;
  border-left: 4px solid ${COLORS.primary};
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background: ${COLORS.primaryGradient};
`;

const CTAContent = styled.div`
  text-align: center;
`;

const Footer = styled.footer`
  padding: 2rem 0;
  background: ${COLORS.white};
  border-top: 1px solid ${COLORS.gray200};
`;

export default LandingPage;