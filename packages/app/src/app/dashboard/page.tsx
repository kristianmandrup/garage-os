import Link from 'next/link';
import {
  Wrench,
  Car,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Camera,
  FileText,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Button } from '@garageos/ui/button';
import { Badge } from '@garageos/ui/badge';
import { Progress } from '@garageos/ui/progress';

const stats = [
  {
    name: 'Active Jobs',
    value: '12',
    change: '+3',
    changeType: 'increase',
    icon: Wrench,
    color: 'blue',
  },
  {
    name: 'Vehicles',
    value: '248',
    change: '+12',
    changeType: 'increase',
    icon: Car,
    color: 'emerald',
  },
  {
    name: 'Customers',
    value: '156',
    change: '+8',
    changeType: 'increase',
    icon: Users,
    color: 'purple',
  },
  {
    name: 'Revenue',
    value: '฿45,230',
    change: '+18%',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'amber',
  },
];

const recentJobs = [
  {
    id: '1',
    title: 'Brake Pad Replacement',
    vehicle: 'Toyota Camry - กค 1234',
    status: 'in_progress',
    time: '2 hours ago',
    mechanic: 'John',
  },
  {
    id: '2',
    title: 'Oil Change & Inspection',
    vehicle: 'Honda Civic - ขค 5678',
    status: 'pending_approval',
    time: '4 hours ago',
    mechanic: 'Mike',
  },
  {
    id: '3',
    title: 'Engine Diagnostic',
    vehicle: 'Ford Ranger - คค 9012',
    status: 'inspection',
    time: '1 hour ago',
    mechanic: 'Sarah',
  },
  {
    id: '4',
    title: 'Tire Rotation',
    vehicle: 'Mazda 3 - งค 3456',
    status: 'completed',
    time: '30 mins ago',
    mechanic: 'John',
  },
];

const quickActions = [
  { name: 'New Job Card', href: '/dashboard/job-cards/new', icon: Wrench, color: 'blue' },
  { name: 'Add Vehicle', href: '/dashboard/vehicles/new', icon: Car, color: 'emerald' },
  { name: 'Add Customer', href: '/dashboard/customers/new', icon: Users, color: 'purple' },
  { name: 'AI Inspection', href: '/dashboard/inspection', icon: Camera, color: 'amber' },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  inspection: { label: 'Inspection', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  diagnosed: { label: 'Diagnosed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: FileText },
  parts_ordered: { label: 'Parts Ordered', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Package },
  in_progress: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Wrench },
  pending_approval: { label: 'Pending Approval', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', icon: AlertCircle },
};

const inventoryAlerts = [
  { name: 'Brake Pads (Front)', stock: 3, minStock: 5 },
  { name: 'Oil Filter', stock: 8, minStock: 10 },
  { name: 'Air Filter', stock: 12, minStock: 8 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening at your shop.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hidden sm:inline-flex">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Link href="/dashboard/job-cards/new">
            <Button className="btn-gradient">
              <Wrench className="h-4 w-4 mr-2" />
              New Job Card
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-amber-600 dark:text-amber-400'
                  }`} />
                </div>
                <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.name} href={action.href}>
            <Card className="card-hover cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  action.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  <action.icon className={`h-7 w-7 ${
                    action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    action.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-amber-600 dark:text-amber-400'
                  }`} />
                </div>
                <p className="font-medium">{action.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Jobs */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Job Cards</CardTitle>
              <CardDescription>Latest jobs across your shop</CardDescription>
            </div>
            <Link href="/dashboard/job-cards">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => {
                const status = statusConfig[job.status];
                return (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.vehicle} • {job.mechanic}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={status.color}>
                        <status.icon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {job.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Items running low</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryAlerts.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className={`text-sm ${item.stock < item.minStock ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                      {item.stock}/{item.minStock}
                    </span>
                  </div>
                  <Progress
                    value={(item.stock / item.minStock) * 100}
                    className={item.stock < item.minStock ? '[&>div]:bg-red-500' : '[&>div]:bg-emerald-500'}
                  />
                </div>
              ))}
            </div>
            <Link href="/dashboard/inventory">
              <Button variant="outline" className="w-full mt-4">
                Manage Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Activity</CardTitle>
          <CardDescription>Recent actions in your shop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {[
                { time: '10:30 AM', action: 'Job #1234 marked as completed', type: 'completion' },
                { time: '10:15 AM', action: 'New customer added: Mr. Somchai', type: 'customer' },
                { time: '09:45 AM', action: 'AI inspection completed for Toyota Camry', type: 'ai' },
                { time: '09:30 AM', action: 'Parts ordered: Brake pads for Honda Civic', type: 'parts' },
                { time: '09:00 AM', action: 'Morning team briefing completed', type: 'info' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pl-8 relative">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 bg-background ${
                    activity.type === 'completion' ? 'border-emerald-500' :
                    activity.type === 'customer' ? 'border-blue-500' :
                    activity.type === 'ai' ? 'border-purple-500' :
                    activity.type === 'parts' ? 'border-amber-500' :
                    'border-slate-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
