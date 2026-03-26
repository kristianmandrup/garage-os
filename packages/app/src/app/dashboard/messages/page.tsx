'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Plus, Search, Send, CheckCircle, Clock, XCircle, Phone, MessageCircle, Bell } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { Textarea } from '@garageos/ui/textarea';
import { Label } from '@garageos/ui/label';
import { cn } from '@garageos/ui/utils';
import { CHANNELS, generateMessageTemplate } from '@/lib/messaging/templates';

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
  customer: { name: string; phone: string };
  job_card: { title: string } | null;
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Send },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  read: { label: 'Read', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: CheckCircle },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

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

  const filteredMessages = messages.filter(m =>
    m.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'line': return <span className="text-lg">💚</span>;
      case 'app': return <Bell className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Send updates and notifications to customers
          </p>
        </div>
        <Button className="btn-gradient" onClick={() => setShowNewMessage(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Sent', value: messages.length, icon: Send, color: 'blue' },
          { label: 'Delivered', value: messages.filter(m => ['delivered', 'read'].includes(m.status)).length, icon: CheckCircle, color: 'emerald' },
          { label: 'Pending', value: messages.filter(m => m.status === 'pending').length, icon: Clock, color: 'amber' },
          { label: 'Failed', value: messages.filter(m => m.status === 'failed').length, icon: XCircle, color: 'red' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'emerald' ? 'text-emerald-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>New Message</CardTitle>
            <CardDescription>Send a message to a customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Customer *</Label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Select customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Channel *</Label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  {CHANNELS.map(ch => (
                    <option key={ch.value} value={ch.value}>{ch.icon} {ch.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <select
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Custom message</option>
                  <option value="status_update">Status Update</option>
                  <option value="approval">Approval Request</option>
                  <option value="ready">Ready for Pickup</option>
                  <option value="payment">Payment Reminder</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Type your message..."
                rows={5}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={sending || !formData.customer_id || !formData.content}
                className="btn-gradient"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">All Channels</option>
          {CHANNELS.map(ch => (
            <option key={ch.value} value={ch.value}>{ch.label}</option>
          ))}
        </select>
      </div>

      {/* Messages List */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground mb-4">
              Send your first message to a customer
            </p>
            <Button onClick={() => setShowNewMessage(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredMessages.map((message) => {
                const status = STATUS_CONFIG[message.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                return (
                  <div key={message.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {getChannelIcon(message.channel)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{message.customer?.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {CHANNELS.find(c => c.value === message.channel)?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {message.content}
                          </p>
                          {message.job_card && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Job: {message.job_card.title}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-xs', status.color)}>
                          <status.icon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.sent_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
