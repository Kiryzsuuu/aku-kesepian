import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  User, 
  Bot,
  Loader,
  Trash2,
  Plus
} from 'lucide-react';
import styled from 'styled-components';
import {
  PageContainer,
  Container,
  Text,
  Button,
  Input,
  FlexContainer,
  LoadingContainer,
  LoadingSpinner
} from '../components/common/StyledComponents';
import { COLORS, ANIMATION_VARIANTS, ROUTES } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI, Message, ChatSession } from '../services/api';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Load chat sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await chatAPI.getChatSessions();
        if (response.success && response.data) {
          setSessions(response.data.sessions);
        }
      } catch (error) {
        toast.error('Gagal memuat riwayat chat');
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  // Load specific chat session messages
  useEffect(() => {
    if (sessionId) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const response = await chatAPI.getChatMessages(sessionId);
          if (response.success && response.data) {
            setMessages(response.data.messages);
            setCurrentSession(response.data.session);
          }
        } catch (error) {
          toast.error('Gagal memuat pesan');
          navigate(ROUTES.CHARACTERS);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [sessionId, navigate]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentSession || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const response = await chatAPI.sendMessage(currentSession.id, messageText);
      
      if (response.success && response.data) {
        // Add both user and AI messages to the chat
        const { user_message, ai_message } = response.data;
        if (user_message && ai_message) {
          setMessages(prev => [
            ...prev,
            user_message,
            ai_message
          ]);
        }
        
        // Focus back to input
        inputRef.current?.focus();
      } else {
        toast.error('Gagal mengirim pesan');
        setNewMessage(messageText); // Restore message
      }
    } catch (error) {
      toast.error('Gagal mengirim pesan');
      setNewMessage(messageText); // Restore message
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSession = async (sessionToDelete: ChatSession) => {
    if (!window.confirm(`Yakin ingin menghapus chat dengan ${sessionToDelete.character.name}?`)) {
      return;
    }

    try {
      const response = await chatAPI.deleteChatSession(sessionToDelete.id);
      
      if (response.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
        
        // If current session is being deleted, redirect
        if (currentSession?.id === sessionToDelete.id) {
          navigate(ROUTES.CHARACTERS);
        }
        
        toast.success('Chat berhasil dihapus');
      } else {
        toast.error('Gagal menghapus chat');
      }
    } catch (error) {
      toast.error('Gagal menghapus chat');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageContainer>
      <ChatLayout>
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <Logo>
              <Heart size={24} />
              <span>Aku Kesepian</span>
            </Logo>
            <UserInfo>
              <User size={16} />
              <span>{user?.username}</span>
            </UserInfo>
          </SidebarHeader>

          <SidebarContent>
            <Button
              fullWidth
              onClick={() => navigate(ROUTES.CHARACTERS)}
              style={{ marginBottom: '1rem' }}
            >
              <Plus size={16} />
              Chat Baru
            </Button>

            <SectionTitle>Chat History</SectionTitle>
            
            {loadingSessions ? (
              <LoadingContainer>
                <LoadingSpinner style={{ width: '20px', height: '20px' }} />
              </LoadingContainer>
            ) : sessions.length === 0 ? (
              <EmptyState>
                <MessageCircle size={32} color={COLORS.gray400} />
                <Text size="sm" color={COLORS.gray500} align="center">
                  Belum ada chat. Mulai chat dengan AI companion favoritmu!
                </Text>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(ROUTES.CHARACTERS)}
                >
                  Pilih Character
                </Button>
              </EmptyState>
            ) : (
              <SessionsList>
                {sessions.map((session) => (
                  <SessionItem
                    key={session.id}
                    active={currentSession?.id === session.id}
                    onClick={() => navigate(`/chat/${session.id}`)}
                  >
                    <SessionAvatar>{session.character.avatar}</SessionAvatar>
                    <SessionInfo>
                      <SessionTitle>{session.title}</SessionTitle>
                      <SessionMeta>
                        {session.character.name} • {formatDate(session.updated_at)}
                      </SessionMeta>
                    </SessionInfo>
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session);
                      }}
                    >
                      <Trash2 size={14} />
                    </DeleteButton>
                  </SessionItem>
                ))}
              </SessionsList>
            )}
          </SidebarContent>

          <SidebarFooter>
            <Button variant="ghost" size="sm" fullWidth onClick={logout}>
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Chat Area */}
        <MainContent>
          {!currentSession ? (
            <EmptyChat>
              <EmptyState>
                <MessageCircle size={64} color={COLORS.gray300} />
                <Text size="lg" color={COLORS.gray500}>
                  Pilih chat atau buat yang baru
                </Text>
                <Text color={COLORS.gray400}>
                  Mulai percakapan dengan AI companion favoritmu
                </Text>
                <Button onClick={() => navigate(ROUTES.CHARACTERS)}>
                  <Plus size={16} />
                  Mulai Chat Baru
                </Button>
              </EmptyState>
            </EmptyChat>
          ) : (
            <>
              {/* Chat Header */}
              <ChatHeader>
                <FlexContainer align="center" gap="1rem">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.CHARACTERS)}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <CharacterAvatar>{currentSession.character.avatar}</CharacterAvatar>
                  <div>
                    <ChatTitle>{currentSession.title}</ChatTitle>
                    <ChatSubtitle>Chat dengan {currentSession.character.name}</ChatSubtitle>
                  </div>
                </FlexContainer>
              </ChatHeader>

              {/* Messages Area */}
              <MessagesArea>
                {loading ? (
                  <LoadingContainer>
                    <LoadingSpinner />
                    <Text>Memuat pesan...</Text>
                  </LoadingContainer>
                ) : (
                  <MessagesList>
                    <AnimatePresence>
                      {messages.map((message) => (
                        <MessageItem
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          isUser={message.sender_type === 'user'}
                        >
                          <MessageAvatar isUser={message.sender_type === 'user'}>
                            {message.sender_type === 'user' ? (
                              <User size={16} />
                            ) : (
                              currentSession.character.avatar
                            )}
                          </MessageAvatar>
                          <MessageContent isUser={message.sender_type === 'user'}>
                            <MessageText>{message.content}</MessageText>
                            <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                          </MessageContent>
                        </MessageItem>
                      ))}
                    </AnimatePresence>
                    
                    {sending && (
                      <MessageItem
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        isUser={false}
                      >
                        <MessageAvatar isUser={false}>
                          <Bot size={16} />
                        </MessageAvatar>
                        <MessageContent isUser={false}>
                          <TypingIndicator>
                            <span></span>
                            <span></span>
                            <span></span>
                          </TypingIndicator>
                        </MessageContent>
                      </MessageItem>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </MessagesList>
                )}
              </MessagesArea>

              {/* Message Input */}
              <MessageInput>
                <form onSubmit={handleSendMessage}>
                  <InputContainer>
                    <Input
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Kirim pesan ke ${currentSession.character.name}...`}
                      disabled={sending}
                      style={{ paddingRight: '4rem' }}
                    />
                    <SendButton
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? (
                        <Loader size={20} className="animate-spin" />
                      ) : (
                        <Send size={20} />
                      )}
                    </SendButton>
                  </InputContainer>
                </form>
              </MessageInput>
            </>
          )}
        </MainContent>
      </ChatLayout>
    </PageContainer>
  );
};

// Styled Components
const ChatLayout = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
`;

const Sidebar = styled.aside`
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 2px solid ${COLORS.borderLight};
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 20px rgba(248, 117, 170, 0.1);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${COLORS.gray200};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.25rem;
  color: ${COLORS.primary};
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${COLORS.gray600};
  font-size: 0.875rem;
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.gray700};
  margin: 1rem 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SessionItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  background: ${props => props.active ? COLORS.primary + '10' : 'transparent'};
  border: ${props => props.active ? `2px solid ${COLORS.primary}` : '2px solid transparent'};
  
  &:hover {
    background: ${COLORS.gray50};
  }
`;

const SessionAvatar = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const SessionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SessionTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${COLORS.gray800};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SessionMeta = styled.div`
  font-size: 0.75rem;
  color: ${COLORS.gray500};
  margin-top: 0.25rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.gray400};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  
  ${SessionItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: ${COLORS.error + '10'};
    color: ${COLORS.error};
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${COLORS.gray200};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${COLORS.gray50};
  min-width: 0; /* Prevents flex item overflow */
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  max-width: 400px;
  
  > * {
    margin: 0.5rem 0;
  }
`;

const ChatHeader = styled.header`
  background: ${COLORS.white};
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${COLORS.gray200};
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
  }
`;

const CharacterAvatar = styled.div`
  font-size: 2rem;
`;

const ChatTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${COLORS.gray800};
  margin: 0;
`;

const ChatSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${COLORS.gray500};
  margin: 0;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }
`;

const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const MessageItem = styled(motion.div)<{ isUser: boolean }>`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const MessageAvatar = styled.div<{ isUser: boolean }>`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.isUser ? '1rem' : '1.5rem'};
  background: ${props => props.isUser ? COLORS.primaryGradient : COLORS.accentGradient};
  color: ${COLORS.white};
  flex-shrink: 0;
  border: 3px solid ${COLORS.white};
  box-shadow: 0 4px 15px ${COLORS.shadow};
`;

const MessageContent = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  min-width: 100px;
  background: ${props => props.isUser ? COLORS.primaryGradient : 'rgba(255, 255, 255, 0.95)'};
  color: ${props => props.isUser ? COLORS.white : COLORS.textDark};
  border-radius: ${props => props.isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px'};
  padding: 0.875rem 1rem;
  box-shadow: 0 6px 20px ${props => props.isUser ? COLORS.shadow : 'rgba(0, 0, 0, 0.08)'};
  backdrop-filter: blur(10px);
  border: ${props => props.isUser ? 'none' : `2px solid ${COLORS.borderLight}`};
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  
  @media (max-width: 768px) {
    max-width: 85%;
    padding: 0.75rem 0.875rem;
  }
  
  ${props => !props.isUser && `
    &::before {
      content: '';
      position: absolute;
      bottom: -1px;
      left: -8px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-right-color: rgba(255, 255, 255, 0.95);
      border-bottom: none;
    }
  `}
  
  ${props => props.isUser && `
    &::before {
      content: '';
      position: absolute;
      bottom: -1px;
      right: -8px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-left-color: ${COLORS.primary};
      border-bottom: none;
    }
  `}
`;

const MessageText = styled.p`
  margin: 0;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  font-size: 0.95rem;
`;

const MessageTime = styled.span`
  display: block;
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${COLORS.gray400};
    animation: typing 1.4s infinite ease-in-out;
  }
  
  span:nth-child(1) { animation-delay: 0s; }
  span:nth-child(2) { animation-delay: 0.2s; }
  span:nth-child(3) { animation-delay: 0.4s; }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
`;

const MessageInput = styled.div`
  background: ${COLORS.white};
  padding: 1rem 1.5rem;
  border-top: 1px solid ${COLORS.gray200};
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const InputContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
`;

const SendButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: ${COLORS.primary};
  color: ${COLORS.white};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${COLORS.primaryDark};
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default ChatPage;