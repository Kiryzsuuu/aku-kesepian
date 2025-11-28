import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { STORAGE_KEYS } from '../config/constants';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sessions' | 'users' | 'stats'>('stats');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState<any>(null);
  
  // Sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionMessages, setSessionMessages] = useState<any[]>([]);
  const [takeoverMessage, setTakeoverMessage] = useState('');
  
  // Users
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'stats') {
        loadStats();
      } else if (activeTab === 'sessions') {
        loadSessions();
      } else if (activeTab === 'users') {
        loadUsers();
      }
    }
  }, [isAdmin, activeTab]);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.is_admin) {
        setIsAdmin(true);
      } else {
        alert('Akses ditolak. Admin only.');
        navigate('/');
      }
    } catch (error) {
      console.error('Check admin error:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(`${API_URL}/api/admin/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data.data.sessions);
    } catch (error) {
      console.error('Load sessions error:', error);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(`${API_URL}/api/admin/sessions/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedSession(response.data.data);
      setSessionMessages(response.data.data.messages);
    } catch (error) {
      console.error('Load session messages error:', error);
    }
  };

  const handleTakeover = async () => {
    if (!takeoverMessage.trim() || !selectedSession) return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      await axios.post(
        `${API_URL}/api/admin/sessions/${selectedSession.session.id}/takeover`,
        { message: takeoverMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTakeoverMessage('');
      loadSessionMessages(selectedSession.session.id);
      alert('Pesan admin terkirim!');
    } catch (error) {
      console.error('Takeover error:', error);
      alert('Gagal mengirim pesan');
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!window.confirm('Yakin ingin menghapus session ini?')) return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      await axios.delete(`${API_URL}/api/admin/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Session berhasil dihapus');
      loadSessions();
      setSelectedSession(null);
    } catch (error) {
      console.error('Delete session error:', error);
      alert('Gagal menghapus session');
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Load users error:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Yakin ingin menghapus user ini? Semua data chat akan terhapus!')) return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('User berhasil dihapus');
      loadUsers();
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Gagal menghapus user');
    }
  };

  const toggleAdminRole = async (userId: string, currentIsAdmin: boolean) => {
    const action = currentIsAdmin ? 'menghapus role admin dari' : 'menjadikan admin';
    if (!window.confirm(`Yakin ingin ${action} user ini?`)) return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await axios.put(
        `${API_URL}/api/admin/users/${userId}/toggle-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(response.data.message);
      loadUsers();
    } catch (error: any) {
      console.error('Toggle admin role error:', error);
      alert(error.response?.data?.message || 'Gagal mengubah role admin');
    }
  };

  if (loading) {
    return <Container><LoadingText>Loading...</LoadingText></Container>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Container>
      <Header>
        <Title>🛡️ Admin Dashboard</Title>
        <BackButton onClick={() => navigate('/')}>← Kembali</BackButton>
      </Header>

      <Tabs>
        <Tab active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
          📊 Statistics
        </Tab>
        <Tab active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')}>
          💬 Chat Sessions
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          👥 User Management
        </Tab>
      </Tabs>

      <Content>
        {activeTab === 'stats' && stats && (
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.total_users}</StatNumber>
              <StatLabel>Total Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.total_sessions}</StatNumber>
              <StatLabel>Active Sessions</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.total_messages}</StatNumber>
              <StatLabel>Total Messages</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.active_users_today}</StatNumber>
              <StatLabel>Active Today</StatLabel>
            </StatCard>
          </StatsGrid>
        )}

        {activeTab === 'sessions' && (
          <SessionsView>
            <SessionsList>
              <SectionTitle>📋 Chat Sessions ({sessions.length})</SectionTitle>
              {sessions.map(session => (
                <SessionCard key={session.session_id} onClick={() => loadSessionMessages(session.session_id)}>
                  <SessionHeader>
                    <SessionTitle>{session.title}</SessionTitle>
                    <DeleteButton onClick={(e) => { e.stopPropagation(); deleteSession(session.session_id); }}>
                      🗑️
                    </DeleteButton>
                  </SessionHeader>
                  <SessionInfo>
                    👤 {session.user.username} • {session.character.avatar} {session.character.name}
                  </SessionInfo>
                  <SessionInfo>
                    💬 {session.message_count} messages
                  </SessionInfo>
                  <SessionTime>{new Date(session.updated_at).toLocaleString('id-ID')}</SessionTime>
                </SessionCard>
              ))}
            </SessionsList>

            {selectedSession && (
              <SessionDetail>
                <DetailHeader>
                  <div>
                    <DetailTitle>{selectedSession.session.title}</DetailTitle>
                    <DetailInfo>
                      User: {selectedSession.user.full_name} ({selectedSession.user.email})
                    </DetailInfo>
                    <DetailInfo>
                      Character: {selectedSession.character.avatar} {selectedSession.character.name}
                    </DetailInfo>
                  </div>
                  <CloseButton onClick={() => setSelectedSession(null)}>✕</CloseButton>
                </DetailHeader>

                <MessagesContainer>
                  {sessionMessages.map(msg => (
                    <Message key={msg.id} senderType={msg.sender_type}>
                      <MessageBadge senderType={msg.sender_type}>
                        {msg.sender_type === 'user' ? '👤 User' : msg.sender_type === 'admin' ? '🛡️ Admin' : '🤖 AI'}
                      </MessageBadge>
                      <MessageContent>{msg.content}</MessageContent>
                      <MessageTime>{new Date(msg.timestamp).toLocaleString('id-ID')}</MessageTime>
                    </Message>
                  ))}
                </MessagesContainer>

                <TakeoverPanel>
                  <TakeoverTitle>🛡️ Admin Takeover</TakeoverTitle>
                  <TakeoverInput
                    value={takeoverMessage}
                    onChange={(e) => setTakeoverMessage(e.target.value)}
                    placeholder="Ketik pesan sebagai admin..."
                    onKeyPress={(e) => e.key === 'Enter' && handleTakeover()}
                  />
                  <TakeoverButton onClick={handleTakeover}>
                    Kirim sebagai Admin
                  </TakeoverButton>
                </TakeoverPanel>
              </SessionDetail>
            )}
          </SessionsView>
        )}

        {activeTab === 'users' && (
          <UsersView>
            <SectionTitle>👥 User Management ({users.length})</SectionTitle>
            <UsersTable>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Sessions</th>
                  <th>Messages</th>
                  <th>Joined</th>
                  <th>Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.full_name}</td>
                    <td>{user.total_sessions}</td>
                    <td>{user.total_messages}</td>
                    <td>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                    <td>{user.is_admin ? '✅ Admin' : '❌ User'}</td>
                    <td>
                      <ActionButtons>
                        {user.email !== 'maskiryz23@gmail.com' && (
                          <>
                            <ToggleAdminButton 
                              isAdmin={user.is_admin}
                              onClick={() => toggleAdminRole(user._id, user.is_admin)}
                            >
                              {user.is_admin ? '⬇️ Remove Admin' : '⬆️ Make Admin'}
                            </ToggleAdminButton>
                            {!user.is_admin && (
                              <DeleteUserButton onClick={() => deleteUser(user._id)}>
                                🗑️ Delete
                              </DeleteUserButton>
                            )}
                          </>
                        )}
                        {user.email === 'maskiryz23@gmail.com' && (
                          <ProtectedBadge>🔒 Protected</ProtectedBadge>
                        )}
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </UsersTable>
          </UsersView>
        )}
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #F875AA 0%, #FDEDEF 100%);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
`;

const BackButton = styled.button`
  background: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'white' : 'rgba(255,255,255,0.7)'};
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: white;
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  min-height: 600px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: white;
  font-size: 24px;
  margin-top: 100px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #FDEDEF 0%, #FFF0AE 100%);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #F875AA;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 18px;
  color: #666;
`;

const SessionsView = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const SessionsList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #F875AA;
  margin-bottom: 20px;
`;

const SessionCard = styled.div`
  background: #FDEDEF;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SessionTitle = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const SessionInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
`;

const SessionTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 5px;
`;

const DeleteButton = styled.button`
  background: #ff4444;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #cc0000;
  }
`;

const SessionDetail = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 2px solid #ddd;
  margin-bottom: 15px;
`;

const DetailTitle = styled.h3`
  font-size: 20px;
  color: #F875AA;
  margin-bottom: 5px;
`;

const DetailInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
`;

const CloseButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: #cc0000;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 15px;
`;

const Message = styled.div<{ senderType: string }>`
  background: ${props => 
    props.senderType === 'user' ? '#AEDEFC' :
    props.senderType === 'admin' ? '#ffeb3b' :
    '#FFF0AE'
  };
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const MessageBadge = styled.div<{ senderType: string }>`
  font-size: 12px;
  font-weight: bold;
  color: ${props => 
    props.senderType === 'admin' ? '#ff5722' : '#666'
  };
  margin-bottom: 5px;
`;

const MessageContent = styled.div`
  color: #333;
  margin-bottom: 5px;
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #999;
`;

const TakeoverPanel = styled.div`
  background: #fff3cd;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #ffc107;
`;

const TakeoverTitle = styled.div`
  font-weight: bold;
  color: #ff5722;
  margin-bottom: 10px;
`;

const TakeoverInput = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid #ffc107;
  border-radius: 8px;
  resize: vertical;
  min-height: 60px;
  margin-bottom: 10px;
  font-family: inherit;
`;

const TakeoverButton = styled.button`
  width: 100%;
  background: #ff5722;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e64a19;
    transform: translateY(-2px);
  }
`;

const UsersView = styled.div``;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #F875AA;
    color: white;
    padding: 12px;
    text-align: left;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }

  tr:hover {
    background: #FDEDEF;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ToggleAdminButton = styled.button<{ isAdmin: boolean }>`
  background: ${props => props.isAdmin ? '#ff9800' : '#4CAF50'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.isAdmin ? '#f57c00' : '#45a049'};
    transform: translateY(-2px);
  }
`;

const DeleteUserButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: #cc0000;
    transform: translateY(-2px);
  }
`;

const ProtectedBadge = styled.span`
  background: #9e9e9e;
  color: white;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
`;

export default AdminDashboard;

