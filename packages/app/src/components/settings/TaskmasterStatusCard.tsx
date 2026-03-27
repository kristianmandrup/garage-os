import { ListTodo, CheckCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { cn } from '@garageos/ui/utils';
import { useTranslation } from '@/i18n';

interface TaskmasterStatusCardProps {
  status: {
    enabled: boolean;
    projects: any[];
  };
  config: {
    apiUrl: string;
    apiKey: string;
    projectId: string;
  };
  testingConnection: boolean;
  onConfigChange: (field: string, value: string) => void;
  onTest: () => void;
}

export function TaskmasterStatusCard({
  status,
  config,
  testingConnection,
  onConfigChange,
  onTest,
}: TaskmasterStatusCardProps) {
  const t = useTranslation();

  return (
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
            <CheckCircle className={cn('h-5 w-5', status.enabled ? 'text-emerald-600' : 'text-muted-foreground')} />
            <div>
              <p className="font-medium">TaskMaster</p>
              <p className="text-sm text-muted-foreground">
                {status.enabled ? t.settings.connectedTasksSync : t.settings.notConfiguredTaskmaster}
              </p>
            </div>
          </div>

          {status.enabled && status.projects.length > 0 && (
            <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {t.settings.defaultProject}: {status.projects.find((p: any) => p.id === status.projects[0]?.id)?.name || 'Unknown'}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {status.projects.length} {t.settings.projectsAvailable}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskmaster_api_url">{t.settings.apiUrl}</Label>
              <Input
                id="taskmaster_api_url"
                placeholder="https://taskmaster.vercel.app"
                value={config.apiUrl}
                onChange={(e) => onConfigChange('apiUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskmaster_api_key">{t.settings.apiKey}</Label>
              <Input
                id="taskmaster_api_key"
                type="password"
                placeholder="tm_xxxxxxxxxxxxx"
                value={config.apiKey}
                onChange={(e) => onConfigChange('apiKey', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskmaster_project_id">{t.settings.defaultProjectId}</Label>
              <Input
                id="taskmaster_project_id"
                placeholder="project_xxxxxxxx"
                value={config.projectId}
                onChange={(e) => onConfigChange('projectId', e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={onTest}
              disabled={testingConnection || !config.apiUrl || !config.apiKey || !config.projectId}
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
  );
}
