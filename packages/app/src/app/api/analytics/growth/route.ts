import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/api-utils';

function getWeekKey(date: string): string {
  const d = new Date(date);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().split('T')[0];
}

function getMonthKey(date: string): string {
  return date.slice(0, 7);
}

export async function GET(request: Request) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '90');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    const startISO = startDate.toISOString();

    // Fetch customers created in range
    const { data: customers } = await supabase
      .from('customers')
      .select('id, created_at')
      .eq('shop_id', shop.id)
      .gte('created_at', startISO)
      .order('created_at', { ascending: true });

    // Fetch all customers for running total
    const { count: totalBefore } = await supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
      .lt('created_at', startISO);

    // Customer growth by week
    const weekMap: Record<string, number> = {};
    (customers || []).forEach(c => {
      const week = getWeekKey(c.created_at);
      weekMap[week] = (weekMap[week] || 0) + 1;
    });

    let runningTotal = totalBefore || 0;
    const customerGrowth = Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, newCustomers]) => {
        runningTotal += newCustomers;
        return { week, newCustomers, totalCustomers: runningTotal };
      });

    // Fetch invoices in range
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, total, created_at, status')
      .eq('shop_id', shop.id)
      .gte('created_at', startISO);

    // Revenue MoM comparison
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;

    let currentMonthRev = 0;
    let previousMonthRev = 0;
    (invoices || []).forEach(inv => {
      const mk = getMonthKey(inv.created_at);
      if (mk === currentMonthKey) currentMonthRev += inv.total || 0;
      if (mk === prevMonthKey) previousMonthRev += inv.total || 0;
    });

    const changePercent = previousMonthRev > 0
      ? Math.round(((currentMonthRev - previousMonthRev) / previousMonthRev) * 100)
      : currentMonthRev > 0 ? 100 : 0;

    const revenueComparison = {
      currentMonth: currentMonthRev,
      previousMonth: previousMonthRev,
      changePercent,
    };

    // Fetch job cards in range
    const { data: jobCards } = await supabase
      .from('job_cards')
      .select('id, created_at')
      .eq('shop_id', shop.id)
      .gte('created_at', startISO);

    // Job volume by week
    const jobWeekMap: Record<string, number> = {};
    (jobCards || []).forEach(jc => {
      const week = getWeekKey(jc.created_at);
      jobWeekMap[week] = (jobWeekMap[week] || 0) + 1;
    });

    const jobVolume = Object.entries(jobWeekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, jobs]) => ({ week, jobs }));

    // Avg ticket size by month
    const monthTotals: Record<string, { sum: number; count: number }> = {};
    (invoices || []).forEach(inv => {
      const mk = getMonthKey(inv.created_at);
      if (!monthTotals[mk]) monthTotals[mk] = { sum: 0, count: 0 };
      monthTotals[mk].sum += inv.total || 0;
      monthTotals[mk].count++;
    });

    const avgTicketSize = Object.entries(monthTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, { sum, count }]) => ({
        month,
        avg: Math.round(sum / count),
      }));

    return NextResponse.json({
      customerGrowth,
      revenueComparison,
      jobVolume,
      avgTicketSize,
      period,
    });
  } catch (error) {
    console.error('Error fetching growth analytics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch growth analytics' },
      { status: 500 }
    );
  }
}
