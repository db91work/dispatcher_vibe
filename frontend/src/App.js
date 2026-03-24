import React, { useEffect, useState } from 'react';
import { Tabs, Typography, Button, Spin, Space } from 'antd';
import { TeamOutlined, LineChartOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import CustomersPage from './CustomersPage';
import PricesPage from './PricesPage';
import LoginPage from './LoginPage';

// Global axios config
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    // Only reload on 401 from non-auth endpoints (session expired mid-use)
    if (error.response && error.response.status === 401 && !url.includes('/api/auth/')) {
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const App = () => {
  // null = checking, true = logged in, false = need login
  const [authenticated, setAuthenticated] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get('/api/auth/status')
      .then((res) => {
        if (!res.data.authEnabled) {
          setAuthenticated(true);
          setUsername('');
          return;
        }
        return axios.get('/api/auth/me')
          .then((res) => {
            setAuthenticated(true);
            setUsername(res.data.username);
          })
          .catch(() => setAuthenticated(false));
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogout = () => {
    axios.post('/api/auth/logout').then(() => {
      setAuthenticated(false);
      setUsername('');
    });
  };

  const handleLoginSuccess = (name) => {
    setAuthenticated(true);
    setUsername(name);
  };

  // Loading state
  if (authenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Login page
  if (authenticated === false) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Main app
  const items = [
    {
      key: 'customers',
      label: (
        <span>
          <TeamOutlined /> Покупатели
        </span>
      ),
      children: <CustomersPage />,
    },
    {
      key: 'prices',
      label: (
        <span>
          <LineChartOutlined /> Цены
        </span>
      ),
      children: <PricesPage />,
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Панель управления
        </Typography.Title>
        {username && (
          <Space>
            <Typography.Text strong>{username}</Typography.Text>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Выйти
            </Button>
          </Space>
        )}
      </div>
      <Tabs
        defaultActiveKey="customers"
        items={items}
        type="card"
        size="large"
      />
    </div>
  );
};

export default App;
