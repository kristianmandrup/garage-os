import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/api-utils';

function daysBetween(date: string): number {
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
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

    // Fetch invoices in range
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, total, tax, status, created_at, due_date')
      .eq('shop_id', shop.id)
      .gte('created_at', startISO);

    // Fetch part usage with cost data
    const { data: partUsage } = await supabase
      .from('part_usage')
      .select('quantity, unit_price, cost_price, job_card:job_cards(shop_id)')
      .gte('created_at', startISO);

    const shopPartUsage = (partUsage || []).filter(
      (pu: Record<string, unknown>) => {
        const jc = pu.job_card as { shop_id: string } | null;
        return jc?.shop_id === shop.id;
      }
    );

    // Fetch job cards for service breakdown
    const { data: jobCards } = await supabase
      .from('job_cards')
      .select('id, service_type, status, total_cost')
      .eq('shop_id', shop.id)
      .gte('created_at', startISO);

    // --- Profit & Loss ---
    const revenue = (invoices || [])
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    const partsCost = shopPartUsage.reduce(
      (sum: number, pu: Record<string, unknown>) =>
        sum + ((pu.quantity as number) * ((pu.cost_price as number) || (pu.unit_price as number) || 0)),
      0
    );

    const laborRevenue = revenue - shopPartUsage.reduce(
      (sum: number, pu: Record<string, unknown>) =>
        sum + ((pu.quantity as number) * ((pu.unit_price as number) || 0)),
      0
    );

    const profit = revenue - partsCost;
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

    const profitAndLoss = { revenue, partsCost, laborRevenue: Math.max(0, laborRevenue), profit, margin };

    // --- Tax Summary ---
    const taxRate = 7; // Thailand VAT
    const paidInvoices = (invoices || []).filter(inv => inv.status === 'paid');
    const totalTax = paidInvoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);
    const taxableRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

    const taxSummary = { totalTax, taxRate, taxableRevenue };

    // --- Payment Aging ---
    type Bucket = '0-30' | '31-60' | '61-90' | '90+';
    const buckets: Record<Bucket, { count: number; amount: number }> = {
      '0-30': { count: 0, amount: 0 },
      '31-60': { count: 0, amount: 0 },
      '61-90': { count: 0, amount: 0 },
      '90+': { count: 0, amount: 0 },
    };

    (invoices || [])
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .forEach(inv => {
        const days = daysBetween(inv.created_at);
        let bucket: Bucket = '0-30';
        if (days > 90) bucket = '90+';
        else if (days > 60) bucket = '61-90';
        else if (days > 30) bucket = '31-60';
        buckets[bucket].count++;
        buckets[bucket].amount += inv.total || 0;
      });

    const paymentAging = (Object.entries(buckets) as [Bucket, { count: number; amount: number }][])
      .map(([bucket, data]) => ({ bucket, ...data }));

    // --- Revenue by Service ---
    const serviceMap: Record<string, { revenue: number; count: number }> = {};
    (jobCards || []).forEach(jc => {
      const svc = jc.service_type || 'Other';
      if (!serviceMap[svc]) serviceMap[svc] = { revenue: 0, count: 0 };
      serviceMap[svc].revenue += jc.total_cost || 0;
      serviceMap[svc].count++;
    });

    const revenueByService = Object.entries(serviceMap)
      .map(([service, data]) => ({ service, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({
      profitAndLoss,
      taxSummary,
      paymentAging,
      revenueByService,
      period,
    });
  } catch (error) {
    console.error('Error fetching financial analytics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch financials' },
      { status: 500 }
    );
  }
}
