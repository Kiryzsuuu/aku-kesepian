import React, { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../config/constants';

const TestAdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [adminCheckResult, setAdminCheckResult] = useState<any>(null);
  const [meResult, setMeResult] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    setToken(storedToken);
  }, []);

  const checkAdmin = async () => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/admin/check`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setAdminCheckResult(data);
  };

  const checkMe = async () => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setMeResult(data);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Admin Test Page</h1>
      
      <div style={{ marginTop: '1rem' }}>
        <h3>Token:</h3>
        <pre style={{ background: '#f0f0f0', padding: '1rem', overflow: 'auto' }}>
          {token || 'No token found'}
        </pre>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={checkAdmin} style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Test /api/admin/check
        </button>
        <button onClick={checkMe} style={{ padding: '0.5rem 1rem' }}>
          Test /api/auth/me
        </button>
      </div>

      {adminCheckResult && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Admin Check Result:</h3>
          <pre style={{ background: '#f0f0f0', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(adminCheckResult, null, 2)}
          </pre>
        </div>
      )}

      {meResult && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Me Result:</h3>
          <pre style={{ background: '#f0f0f0', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(meResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAdminPage;
