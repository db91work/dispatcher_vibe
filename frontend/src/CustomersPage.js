import React, { useEffect, useState } from 'react';
import { Table, Button, Input, InputNumber, DatePicker, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const API_URL = '/api/customers';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState({ name: '', lastVisit: null, totalPurchased: 0 });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setCustomers(data);
    } catch (err) {
      message.error('Ошибка загрузки данных');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Добавление ---
  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    setEditData({});
    setNewData({ name: '', lastVisit: null, totalPurchased: 0 });
  };

  const cancelAdd = () => {
    setAdding(false);
    setNewData({ name: '', lastVisit: null, totalPurchased: 0 });
  };

  const saveAdd = async () => {
    if (!newData.name.trim()) {
      message.warning('Введите имя покупателя');
      return;
    }
    try {
      await axios.post(API_URL, newData);
      message.success('Покупатель добавлен');
      setAdding(false);
      setNewData({ name: '', lastVisit: null, totalPurchased: 0 });
      fetchCustomers();
    } catch (err) {
      message.error('Ошибка при добавлении');
    }
  };

  // --- Редактирование ---
  const startEdit = (record) => {
    setAdding(false);
    setEditingId(record.id);
    setEditData({
      name: record.name,
      lastVisit: record.lastVisit,
      totalPurchased: record.totalPurchased,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, editData);
      message.success('Данные сохранены');
      setEditingId(null);
      setEditData({});
      fetchCustomers();
    } catch (err) {
      message.error('Ошибка сохранения');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (text, record) =>
        record.isNew ? <span style={{ color: '#999' }}>—</span> : text,
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              placeholder="Имя покупателя"
              value={newData.name}
              onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            />
          );
        }
        if (editingId === record.id) {
          return (
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          );
        }
        return text;
      },
    },
    {
      title: 'Последний визит',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <DatePicker
              showTime
              value={newData.lastVisit ? dayjs(newData.lastVisit) : null}
              onChange={(date) =>
                setNewData({
                  ...newData,
                  lastVisit: date ? date.format('YYYY-MM-DDTHH:mm:ss') : null,
                })
              }
            />
          );
        }
        if (editingId === record.id) {
          return (
            <DatePicker
              showTime
              value={editData.lastVisit ? dayjs(editData.lastVisit) : null}
              onChange={(date) =>
                setEditData({
                  ...editData,
                  lastVisit: date ? date.format('YYYY-MM-DDTHH:mm:ss') : null,
                })
              }
            />
          );
        }
        return text ? dayjs(text).format('DD.MM.YYYY HH:mm') : '—';
      },
    },
    {
      title: 'Сумма покупок',
      dataIndex: 'totalPurchased',
      key: 'totalPurchased',
      render: (value, record) => {
        if (record.isNew) {
          return (
            <InputNumber
              value={newData.totalPurchased}
              min={0}
              step={100}
              style={{ width: '100%' }}
              onChange={(val) => setNewData({ ...newData, totalPurchased: val })}
            />
          );
        }
        if (editingId === record.id) {
          return (
            <InputNumber
              value={editData.totalPurchased}
              min={0}
              step={100}
              style={{ width: '100%' }}
              onChange={(val) => setEditData({ ...editData, totalPurchased: val })}
            />
          );
        }
        return value != null ? `${value.toLocaleString('ru-RU')} ₽` : '—';
      },
    },
    {
      title: 'Действие',
      key: 'action',
      width: 220,
      render: (_, record) => {
        if (record.isNew) {
          return (
            <Space>
              <Button type="primary" onClick={saveAdd}>Добавить</Button>
              <Button onClick={cancelAdd}>Отмена</Button>
            </Space>
          );
        }
        if (editingId === record.id) {
          return (
            <Space>
              <Button type="primary" onClick={() => saveEdit(record.id)}>Сохранить</Button>
              <Button onClick={cancelEdit}>Отмена</Button>
            </Space>
          );
        }
        return (
          <Button onClick={() => startEdit(record)} disabled={editingId !== null || adding}>
            Изменить
          </Button>
        );
      },
    },
  ];

  const dataSource = adding
    ? [{ id: 'new', isNew: true }, ...customers]
    : customers;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={startAdd}
          disabled={adding || editingId !== null}
        >
          Добавить покупателя
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />
    </>
  );
};

export default CustomersPage;
