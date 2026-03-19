import React from 'react';
import { Tabs, Typography } from 'antd';
import { TeamOutlined, LineChartOutlined } from '@ant-design/icons';
import CustomersPage from './CustomersPage';
import PricesPage from './PricesPage';

const App = () => {
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
      <Typography.Title level={2} style={{ marginBottom: 16 }}>
        Панель управления
      </Typography.Title>
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
