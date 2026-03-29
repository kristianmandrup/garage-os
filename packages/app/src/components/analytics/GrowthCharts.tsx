'use client';

import { useLocale, formatCurrency } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface CustomerGrowthPoint {
  week: string;
  newCustomers: number;
  totalCustomers: number;
}

interface RevenueComparison {
  currentMonth: number;
  previousMonth: number;
  changePercent: number;
}

interface JobVolumePoint {
  week: string;
  jobs: number;
}

interface AvgTicketPoint {
  month: string;
  avg: number;
}

interface GrowthChartsProps {
  customerGrowth: CustomerGrowthPoint[];
  revenueComparison: RevenueComparison;
  jobVolume: JobVolumePoint[];
  avgTicketSize: AvgTicketPoint[];
}

const tooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
};

function formatWeek(week: string) {
  const d = new Date(week);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function GrowthCharts({ customerGrowth, revenueComparison, jobVolume, avgTicketSize }: GrowthChartsProps) {
  const { locale } = useLocale();

  const revenueBarData = [
    { label: 'Previous', revenue: revenueComparison.previousMonth },
    { label: 'Current', revenue: revenueComparison.currentMonth },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Customer Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
        </CardHeader>
        <CardContent>
          {customerGrowth.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={customerGrowth} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickFormatter={formatWeek} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(label: unknown) => formatWeek(String(label))} />
                <Area type="monotone" dataKey="newCustomers" stroke="#3b82f6" fill="#3b82f680" name="New" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Revenue MoM */}
      <Card>
        <CardHeader>
          <CardTitle>
            Revenue Month-over-Month
            <span className={`ml-2 text-sm font-normal ${revenueComparison.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {revenueComparison.changePercent >= 0 ? '+' : ''}{revenueComparison.changePercent}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueBarData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value), locale), 'Revenue']} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Job Volume */}
      <Card>
        <CardHeader>
          <CardTitle>Job Volume</CardTitle>
        </CardHeader>
        <CardContent>
          {jobVolume.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={jobVolume} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickFormatter={formatWeek} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(label: unknown) => formatWeek(String(label))} />
                <Line type="monotone" dataKey="jobs" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Jobs" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Avg Ticket Size */}
      <Card>
        <CardHeader>
          <CardTitle>Average Ticket Size</CardTitle>
        </CardHeader>
        <CardContent>
          {avgTicketSize.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={avgTicketSize} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value), locale), 'Avg Ticket']} />
                <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Avg" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
