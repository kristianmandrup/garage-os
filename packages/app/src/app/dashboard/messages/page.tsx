'use client';

import { useState, useEffect } from 'react';
import {
  MessagesHeader,
  MessagesStatsCards,
  NewMessageForm,
  MessageFilters,
  MessagesList,
} from '@/components/messages';
import { generateMessageTemplate } from '@/lib/messaging/templates';

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Message {
  id: string;
  type: string;
  channel: string;
  content: string;
  status: string;
  sent_at: string;
  customer?: { name: string; phone: string };
  job_card?: { title: string } | null;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    type: 'custom',
    channel: 'sms',
    content: '',
  });

  useEffect(() => {
    fetchMessages();
    fetchCustomers();
  }, [channelFilter]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (channelFilter) params.set('channel', channelFilter);

      const response = await fetch(`/api/messages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!formData.customer_id || !formData.content) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowNewMessage(false);
        setFormData({ customer_id: '', type: 'custom', channel: 'sms', content: '' });
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTemplateSelect = (type: string) => {
    const customer = customers.find(c => c.id === formData.customer_id);
    if (!customer) return;

    const content = generateMessageTemplate(type as any, {
      customerName: customer.name,
      shopName: 'GarageOS Shop',
    });
    setFormData({ ...formData, type, content });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredMessages = messages.filter(m =>
    m.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <MessagesHeader onNewMessage={() => setShowNewMessage(true)} />

      <MessagesStatsCards messages={messages} loading={loading} />

      {showNewMessage && (
        <NewMessageForm
          customers={customers}
          formData={formData}
          sending={sending}
          onFormChange={handleFormChange}
          onTemplateSelect={handleTemplateSelect}
          onSubmit={handleSendMessage}
          onCancel={() => setShowNewMessage(false)}
        />
      )}

      <MessageFilters
        search={search}
        channelFilter={channelFilter}
        onSearchChange={setSearch}
        onChannelChange={setChannelFilter}
      />

      <MessagesList
        messages={filteredMessages}
        loading={loading}
        onNewMessage={() => setShowNewMessage(true)}
      />
    </div>
  );
}
