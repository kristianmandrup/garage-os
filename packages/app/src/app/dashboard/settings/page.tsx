'use client';

import { useState, useEffect } from 'react';
import { Settings, MessageSquare, Bell, Shield, Users, Save, CheckCircle, Plus, ListTodo } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { cn } from '@garageos/ui/utils';
import { useTranslation } from '@/i18n';

interface ShopSettings {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  // Messaging credentials
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

      {/* Messaging Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t.settings.messagingStatus}
          </CardTitle>
          <CardDescription>
            {t.settings.messagingStatusDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg border',
              messagingStatus.twilio ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-muted'
            )}>
              <CheckCircle className={cn('h-5 w-5', messagingStatus.twilio ? 'text-emerald-600' : 'text-muted-foreground')} />
              <div>
                <p className="font-medium">{t.settings.twilioSMSWhatsApp}</p>
                <p className="text-sm text-muted-foreground">
                  {messagingStatus.twilio ? t.settings.configured : t.settings.notConfigured}
                </p>
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg border',
              messagingStatus.line ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-muted'
            )}>
              <CheckCircle className={cn('h-5 w-5', messagingStatus.line ? 'text-emerald-600' : 'text-muted-foreground')} />
              <div>
                <p className="font-medium">{t.settings.lineMessaging}</p>
                <p className="text-sm text-muted-foreground">
                  {messagingStatus.line ? t.settings.configured : t.settings.notConfigured}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TaskMaster Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            {t.settings.taskmasterIntegration}
          </CardTitle>
          <CardDescription>
            {t.settings.taskmasterIntegrationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted">
              <CheckCircle className={cn('h-5 w-5', taskmasterStatus.enabled ? 'text-emerald-600' : 'text-muted-foreground')} />
              <div>
                <p className="font-medium">TaskMaster</p>
                <p className="text-sm text-muted-foreground">
                  {taskmasterStatus.enabled ? t.settings.connectedTasksSync : t.settings.notConfiguredTaskmaster}
                </p>
              </div>
            </div>

            {taskmasterStatus.enabled && taskmasterStatus.projects.length > 0 && (
              <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {t.settings.defaultProject}: {taskmasterStatus.projects.find((p: any) => p.id === taskmasterStatus.projects[0]?.id)?.name || 'Unknown'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  {taskmasterStatus.projects.length} {t.settings.projectsAvailable}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskmaster_api_url">{t.settings.apiUrl}</Label>
                <Input
                  id="taskmaster_api_url"
                  placeholder="https://taskmaster.vercel.app"
                  value={taskmasterConfig.apiUrl}
                  onChange={(e) => setTaskmasterConfig({ ...taskmasterConfig, apiUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskmaster_api_key">{t.settings.apiKey}</Label>
                <Input
                  id="taskmaster_api_key"
                  type="password"
                  placeholder="tm_xxxxxxxxxxxxx"
                  value={taskmasterConfig.apiKey}
                  onChange={(e) => setTaskmasterConfig({ ...taskmasterConfig, apiKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskmaster_project_id">{t.settings.defaultProjectId}</Label>
                <Input
                  id="taskmaster_project_id"
                  placeholder="project_xxxxxxxx"
                  value={taskmasterConfig.projectId}
                  onChange={(e) => setTaskmasterConfig({ ...taskmasterConfig, projectId: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleTestTaskmaster}
                disabled={testingConnection || !taskmasterConfig.apiUrl || !taskmasterConfig.apiKey || !taskmasterConfig.projectId}
                className="flex items-center gap-2"
              >
                {testingConnection ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    {t.settings.testing}
                  </>
                ) : (
                  <>
                    <ListTodo className="h-4 w-4" />
                    {t.settings.testConnection}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {t.settings.setEnvironmentVars}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.settings.shopInformation}
          </CardTitle>
          <CardDescription>
            {t.settings.shopDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.settings.shopName}</Label>
              <Input
                id="name"
                value={settings.name || ''}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.settings.phone}</Label>
              <Input
                id="phone"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t.settings.descriptionLabel}</Label>
            <Textarea
              id="description"
              value={settings.description || ''}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Twilio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t.settings.twilioConfiguration}
          </CardTitle>
          <CardDescription>
            {t.settings.twilioDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twilio_account_sid">{t.settings.accountSid}</Label>
            <Input
              id="twilio_account_sid"
              type="password"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={settings.twilio_account_sid || ''}
              onChange={(e) => setSettings({ ...settings, twilio_account_sid: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twilio_auth_token">{t.settings.authToken}</Label>
            <Input
              id="twilio_auth_token"
              type="password"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={settings.twilio_auth_token || ''}
              onChange={(e) => setSettings({ ...settings, twilio_auth_token: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twilio_phone_number">{t.settings.smsPhoneNumber}</Label>
              <Input
                id="twilio_phone_number"
                placeholder="+1234567890"
                value={settings.twilio_phone_number || ''}
                onChange={(e) => setSettings({ ...settings, twilio_phone_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio_whatsapp_from">{t.settings.whatsappFrom}</Label>
              <Input
                id="twilio_whatsapp_from"
                placeholder="+1234567890"
                value={settings.twilio_whatsapp_from || ''}
                onChange={(e) => setSettings({ ...settings, twilio_whatsapp_from: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LINE Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t.settings.lineConfiguration}
          </CardTitle>
          <CardDescription>
            {t.settings.lineDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="line_channel_access_token">{t.settings.channelAccessToken}</Label>
            <Textarea
              id="line_channel_access_token"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={settings.line_channel_access_token || ''}
              onChange={(e) => setSettings({ ...settings, line_channel_access_token: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="line_user_id">{t.settings.yourLineUserId}</Label>
            <Input
              id="line_user_id"
              placeholder="U1234567890abcdef..."
              value={settings.line_user_id || ''}
              onChange={(e) => setSettings({ ...settings, line_user_id: e.target.value })}
            />
          </div>
          {settings.line_channel_access_token && (
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleCreateRichMenu}
                disabled={creatingRichMenu}
                className="flex items-center gap-2"
              >
                {creatingRichMenu ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    {t.settings.creating}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {t.settings.createRichMenu}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {t.settings.richMenuDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} className="btn-gradient">
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
