import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, LogOut, User, Shield } from 'lucide-react';
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
  LoadingContainer,
  LoadingSpinner
} from '../components/common/StyledComponents';
import { COLORS, ANIMATION_VARIANTS, ROUTES, STORAGE_KEYS } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI, Character } from '../services/api';
import toast from 'react-hot-toast';

const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await chatAPI.getCharacters();
        if (response.success && response.data) {
          setCharacters(response.data.characters);
        }
      } catch (error) {
        toast.error('Gagal memuat karakter AI');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        console.log('❌ No token found for admin check');
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('🔍 Checking admin status at:', `${API_URL}/api/admin/check`);
      console.log('🔑 Token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      console.log('✅ Admin check response:', data);
      
      if (data.is_admin) {
        setIsAdmin(true);
        console.log('🛡️ User is admin!');
      } else {
        console.log('👤 User is not admin');
      }
    } catch (error) {
      console.error('❌ Admin check error:', error);
    }
  };

  // Check admin status whenever user changes
  useEffect(() => {
    if (user) {
      // Small delay to ensure token is saved to localStorage
      const timer = setTimeout(() => {
        checkAdminStatus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleStartChat = async (character: Character) => {
    if (creatingSession === character.id) return;
    
    setCreatingSession(character.id);
    
    try {
      const response = await chatAPI.createChatSession(character.id);
      
      if (response.success && response.data) {
        toast.success(`Mulai chat dengan ${character.name}! 💕`);
        navigate(`/chat/${response.data.session_id}`);
      } else {
        toast.error('Gagal memulai chat');
      }
    } catch (error) {
      toast.error('Gagal memulai chat');
    } finally {
      setCreatingSession(null);
    }
  };

  const handleViewExistingChats = () => {
    navigate(ROUTES.CHAT);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <Text style={{ marginTop: '1rem' }}>Memuat AI Companions...</Text>
        </LoadingContainer>
      </PageContainer>
    );
  }

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
            <FlexContainer gap="1rem" align="center">
              <UserInfo>
                <User size={20} />
                <span>{user?.username}</span>
              </UserInfo>
              {isAdmin && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    console.log('🔘 Admin button clicked');
                    console.log('🔑 Current token:', localStorage.getItem(STORAGE_KEYS.TOKEN)?.substring(0, 20));
                    console.log('👤 Current user:', user);
                    navigate('/admin');
                  }}
                >
                  <Shield size={16} />
                  Admin
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleViewExistingChats}>
                <MessageCircle size={16} />
                Chat History
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut size={16} />
                Logout
              </Button>
            </FlexContainer>
          </FlexContainer>
        </Container>
      </Nav>

      {/* Main Content */}
      <MainContent>
        <Container>
          <motion.div
            initial="initial"
            animate="animate"
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            {/* Welcome Section */}
            <WelcomeSection>
              <Heading1>Halo, {user?.full_name?.split(' ')[0]}! 👋</Heading1>
              <Text size="lg">
                Pilih AI companion yang ingin kamu ajak ngobrol. Setiap karakter punya kepribadian unik 
                dan siap menemanimu kapan saja! 💕
              </Text>
            </WelcomeSection>

            {/* Characters Grid */}
            <CharactersSection>
              <Heading2>AI Companions Tersedia</Heading2>
              <Text style={{ marginBottom: '2rem' }}>
                Klik "Mulai Chat" untuk memulai percakapan baru dengan karakter pilihan kamu
              </Text>

              <CharacterGrid>
                {characters.map((character, index) => (
                  <CharacterCard
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <CharacterHeader>
                      <CharacterAvatar>{character.avatar}</CharacterAvatar>
                      <CharacterInfo>
                        <Heading3>{character.name}</Heading3>
                        <Text size="sm" color={COLORS.gray500}>
                          {character.description}
                        </Text>
                      </CharacterInfo>
                    </CharacterHeader>

                    <GreetingBox>
                      <Text size="sm" style={{ fontStyle: 'italic' }}>
                        "{character.greeting}"
                      </Text>
                    </GreetingBox>

                    <SampleResponses>
                      <Text size="sm" weight="600" color={COLORS.gray700}>
                        Contoh percakapan:
                      </Text>
                      {character.sample_responses.slice(0, 2).map((response, idx) => (
                        <SampleText key={idx} size="sm">
                          • {response}
                        </SampleText>
                      ))}
                    </SampleResponses>

                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => handleStartChat(character)}
                      disabled={creatingSession === character.id}
                      style={{
                        background: creatingSession === character.id 
                          ? COLORS.gray300 
                          : COLORS.primaryGradient
                      }}
                    >
                      {creatingSession === character.id ? (
                        <>
                          <LoadingSpinner style={{ width: '20px', height: '20px' }} />
                          Memulai Chat...
                        </>
                      ) : (
                        <>
                          <MessageCircle size={20} />
                          Chat dengan {character.name}
                        </>
                      )}
                    </Button>
                  </CharacterCard>
                ))}
              </CharacterGrid>
            </CharactersSection>
          </motion.div>
        </Container>
      </MainContent>
    </PageContainer>
  );
};

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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${COLORS.gray600};
  font-weight: 500;
`;

const MainContent = styled.main`
  padding: 3rem 0;
  min-height: calc(100vh - 80px);
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: ${COLORS.primaryGradient};
  border-radius: 20px;
  color: ${COLORS.white};
`;

const CharactersSection = styled.section`
  /* Add any specific styles if needed */
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  align-items: stretch;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CharacterCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 30px ${COLORS.shadow};
  border: 2px solid ${COLORS.borderLight};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  max-width: 100%;
  word-wrap: break-word;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${COLORS.primaryGradient};
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px ${COLORS.shadow};
    border-color: ${COLORS.primary};
  }
  
  * {
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 450px;
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
  overflow: hidden;
`;

const CharacterAvatar = styled.div`
  font-size: 3rem;
  flex-shrink: 0;
`;

const CharacterInfo = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  
  h3 {
    margin: 0 0 0.5rem 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.3;
    max-width: 100%;
  }
  
  p {
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
    max-width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const GreetingBox = styled.div`
  background: linear-gradient(135deg, rgba(248, 117, 170, 0.1), rgba(174, 222, 252, 0.1));
  border-radius: 16px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid ${COLORS.primary};
  color: ${COLORS.textDark};
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  max-width: 100%;
  
  p {
    margin: 0;
    line-height: 1.4;
    word-wrap: break-word;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 100%;
  }
  
  &:before {
    content: '"';
    font-size: 2rem;
    position: absolute;
    top: -0.5rem;
    left: 0.75rem;
    color: ${COLORS.primary};
    opacity: 0.3;
  }
`;

const SampleResponses = styled.div`
  margin-bottom: 2rem;
  flex: 1;
  
  > p:first-child {
    margin-bottom: 0.75rem;
  }
`;

const SampleText = styled(Text)`
  color: ${COLORS.gray600};
  margin: 0.5rem 0;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 100%;
`;

export default CharactersPage;