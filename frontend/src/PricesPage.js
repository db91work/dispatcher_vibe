import React, { useMemo } from 'react';
import { Typography } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MONTHS = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
];

const PRODUCTS = [
  { key: 'product1', name: 'Товар 1', color: '#1677ff' },
  { key: 'product2', name: 'Товар 2', color: '#52c41a' },
  { key: 'product3', name: 'Товар 3', color: '#fa541c' },
  { key: 'product4', name: 'Товар 4', color: '#722ed1' },
];

const randomPrice = () => Math.round(1000 + Math.random() * 500);

const generateData = () =>
  MONTHS.map((month) => ({
    month,
    product1: randomPrice(),
    product2: randomPrice(),
    product3: randomPrice(),
    product4: randomPrice(),
  }));

const PricesPage = () => {
  const data = useMemo(() => generateData(), []);

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Динамика цен товаров за год
      </Typography.Title>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[900, 1600]} tickFormatter={(v) => `${v} ₽`} />
          <Tooltip
            formatter={(value) => [`${value} ₽`]}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          {PRODUCTS.map((p) => (
            <Line
              key={p.key}
              type="monotone"
              dataKey={p.key}
              name={p.name}
              stroke={p.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default PricesPage;
