'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';
import {
  MessagingStatusCard,
  TaskmasterStatusCard,
  ShopInfoCard,
  TwilioSettingsCard,
  LINESettingsCard,
} from '@/components/settings';

interface ShopSettings {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  twilio_account_sid: string;
  twilio_auth_token: string;
  twilio_phone_number: string;
  twilio_whatsapp_from: string;
  line_channel_access_token: string;
  line_user_id: string;
}

export default function SettingsPage() {
  const t = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Partial<ShopSettings>>({});
  const [messagingStatus, setMessagingStatus] = useState({ twilio: false, line: false });
  const [creatingRichMenu, setCreatingRichMenu] = useState(false);
  const [taskmasterStatus, setTaskmasterStatus] = useState({ enabled: false, hasApiKey: false, hasProjectId: false, projects: [] as any[] });
  const [taskmasterConfig, setTaskmasterConfig] = useState({ apiUrl: '', apiKey: '', projectId: '' });
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchMessagingStatus();
    fetchTaskmasterStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/shops');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setSettings(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagingStatus = async () => {
    try {
      const response = await fetch('/api/messages/status');
      if (response.ok) {
        const data = await response.json();
        setMessagingStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch messaging status:', error);
    }
  };

  const fetchTaskmasterStatus = async () => {
    try {
      const response = await fetch('/api/integrations/taskmaster');
      if (response.ok) {
        const data = await response.json();
        setTaskmasterStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch TaskMaster status:', error);
    }
  };

  const handleTestTaskmaster = async () => {
    setTestingConnection(true);
    try {
      const response = await fetch('/api/integrations/taskmaster/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskmasterConfig),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(t.settings.taskmasterSuccess);
          fetchTaskmasterStatus();
        } else {
          alert(`${t.settings.taskmasterFailed}: ${data.error}`);
        }
      } else {
        const error = await response.json();
        alert(`${t.settings.testFailed}: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to test TaskMaster connection:', error);
      alert(t.settings.taskmasterFailed);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/shops/${settings.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRichMenu = async () => {
    setCreatingRichMenu(true);
    try {
      const response = await fetch('/api/integrations/line/rich-menu', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`LINE Rich Menu created! Portal URL: ${data.portalUrl}`);
      } else {
        const error = await response.json();
        alert(`${t.settings.testFailed}: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create LINE Rich Menu:', error);
      alert(t.settings.testFailed);
    } finally {
      setCreatingRichMenu(false);
    }
  };

  const handleSettingsChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleTaskmasterConfigChange = (field: string, value: string) => {
    setTaskmasterConfig((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.settings.title}</h1>
        <p className="text-muted-foreground">{t.settings.description}</p>
      </div>

      <MessagingStatusCard twilio={messagingStatus.twilio} line={messagingStatus.line} />

      <TaskmasterStatusCard
        status={taskmasterStatus}
        config={taskmasterConfig}
        testingConnection={testingConnection}
        onConfigChange={handleTaskmasterConfigChange}
        onTest={handleTestTaskmaster}
      />

      <ShopInfoCard
        name={settings.name || ''}
        phone={settings.phone || ''}
        description={settings.description || ''}
        onChange={handleSettingsChange}
      />

      <TwilioSettingsCard
        accountSid={settings.twilio_account_sid || ''}
        authToken={settings.twilio_auth_token || ''}
        phoneNumber={settings.twilio_phone_number || ''}
        whatsappFrom={settings.twilio_whatsapp_from || ''}
        onChange={handleSettingsChange}
      />

      <LINESettingsCard
        channelAccessToken={settings.line_channel_access_token || ''}
        userId={settings.line_user_id || ''}
        creatingRichMenu={creatingRichMenu}
        onChange={handleSettingsChange}
        onCreateRichMenu={handleCreateRichMenu}
      />

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          {saving ? t.settings.saving : t.settings.saveSettings}
        </Button>
        {saved && (
          <span className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            {t.settings.settingsSaved}
          </span>
        )}
      </div>
    </div>
  );
}
