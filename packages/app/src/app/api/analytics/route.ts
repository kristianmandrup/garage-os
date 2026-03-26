import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's shop
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // 1. Revenue Metrics
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('shop_id', shop.id)
      .gte('created_at', startDate.toISOString());

    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
    const paidRevenue = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
    const pendingRevenue = invoices?.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

    // 2. Job Completion Rates
    const { data: jobCards } = await supabase
      .from('job_cards')
      .select('*')
      .eq('shop_id', shop.id)
      .gte('created_at', startDate.toISOString());

    const totalJobs = jobCards?.length || 0;
    const completedJobs = jobCards?.filter(jc => jc.status === 'completed').length || 0;
    const inProgressJobs = jobCards?.filter(jc => ['in_progress', 'pending_approval', 'diagnosed', 'parts_ordered'].includes(jc.status)).length || 0;
    const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

    // 3. Average Job Time
    const completedWithTime = jobCards?.filter(jc => jc.status === 'completed' && jc.actual_hours) || [];
    const avgJobHours = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, jc) => sum + (jc.actual_hours || 0), 0) / completedWithTime.length
      : 0;

    // 4. Parts Inventory Turnover
    const { data: parts } = await supabase
      .from('parts')
      .select('*')
      .eq('shop_id', shop.id);

    const { data: partUsage } = await supabase
      .from('part_usage')
      .select('*, job_card:job_cards(shop_id)')
      .gte('created_at', startDate.toISOString());

    const shopPartUsage = partUsage?.filter(pu => pu.job_card?.shop_id === shop.id) || [];
    const totalPartsUsed = shopPartUsage.reduce((sum, pu) => sum + pu.quantity, 0) || 0;
    const totalPartsValue = shopPartUsage.reduce((sum, pu) => sum + (pu.quantity * pu.unit_price), 0) || 0;

    const lowStockCount = parts?.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length || 0;
    const outOfStockCount = parts?.filter(p => p.status === 'out_of_stock').length || 0;

    // 5. Mechanic Productivity (jobs per mechanic)
    const { data: users } = await supabase
      .from('users')
      .select('id, name');

    const mechanicStats: Record<string, { name: string; completed: number; inProgress: number; totalHours: number }> = {};

    jobCards?.forEach(jc => {
      if (jc.assigned_to_id) {
        const mechanic = users?.find(u => u.id === jc.assigned_to_id);
        const name = mechanic?.name || 'Unknown';
        if (!mechanicStats[jc.assigned_to_id]) {
          mechanicStats[jc.assigned_to_id] = { name, completed: 0, inProgress: 0, totalHours: 0 };
        }
        if (jc.status === 'completed') {
          mechanicStats[jc.assigned_to_id].completed++;
          mechanicStats[jc.assigned_to_id].totalHours += jc.actual_hours || 0;
        } else if (['in_progress', 'diagnosed', 'parts_ordered', 'pending_approval'].includes(jc.status)) {
          mechanicStats[jc.assigned_to_id].inProgress++;
        }
      }
    });

    // 6. Revenue by Day (for chart)
    const revenueByDay: Record<string, number> = {};
    invoices?.forEach(inv => {
      const day = inv.created_at.split('T')[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + (inv.total || 0);
    });

    // 7. Jobs by Status
    const jobsByStatus: Record<string, number> = {};
    jobCards?.forEach(jc => {
      jobsByStatus[jc.status] = (jobsByStatus[jc.status] || 0) + 1;
    });

    // 8. Top Parts Used
    const { data: partsData } = await supabase
      .from('parts')
      .select('id, name');

    const partsUsageMap: Record<string, { name: string; quantity: number; value: number }> = {};
    shopPartUsage.forEach(pu => {
      const part = partsData?.find(p => p.id === pu.part_id);
      const name = part?.name || 'Unknown';
      if (!partsUsageMap[pu.part_id]) {
        partsUsageMap[pu.part_id] = { name, quantity: 0, value: 0 };
      }
      partsUsageMap[pu.part_id].quantity += pu.quantity;
      partsUsageMap[pu.part_id].value += pu.quantity * pu.unit_price;
    });

    const topParts = Object.entries(partsUsageMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // 9. Customer Retention (returning customers)
    const { data: allJobCards } = await supabase
      .from('job_cards')
      .select('customer_id, created_at')
      .eq('shop_id', shop.id);

    const customerJobCounts: Record<string, number> = {};
    allJobCards?.forEach(jc => {
      customerJobCounts[jc.customer_id] = (customerJobCounts[jc.customer_id] || 0) + 1;
    });
    const returningCustomers = Object.values(customerJobCounts).filter(count => count > 1).length;
    const totalCustomers = Object.keys(customerJobCounts).length;
    const retentionRate = totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0;

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        paid: paidRevenue,
        pending: pendingRevenue,
        byDay: revenueByDay,
      },
      jobs: {
        total: totalJobs,
        completed: completedJobs,
        inProgress: inProgressJobs,
        completionRate,
        avgJobHours: Math.round(avgJobHours * 10) / 10,
        byStatus: jobsByStatus,
      },
      inventory: {
        totalParts: parts?.length || 0,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        partsUsed: totalPartsUsed,
        partsValue: totalPartsValue,
        topParts,
      },
      mechanics: Object.entries(mechanicStats).map(([id, data]) => ({ id, ...data })),
      customerRetention: {
        total: totalCustomers,
        returning: returningCustomers,
        rate: retentionRate,
      },
      period: parseInt(period),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
