import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/shops/analytics/aggregate - Get analytics across all shops
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user's shops
    const { data: shops, error: shopsError } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id);

    if (shopsError || !shops || shops.length === 0) {
      return NextResponse.json({ error: 'No shops found' }, { status: 404 });
    }

    const shopIds = shops.map(s => s.id);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const specificShopId = searchParams.get('shop_id');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Filter to specific shop if provided
    const targetShopIds = specificShopId ? [specificShopId] : shopIds;

    // Fetch invoices across shops
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .in('shop_id', targetShopIds)
      .gte('created_at', startDate.toISOString());

    // Fetch job cards
    const { data: jobCards } = await supabase
      .from('job_cards')
      .select('*')
      .in('shop_id', targetShopIds)
      .gte('created_at', startDate.toISOString());

    // Fetch parts
    const { data: parts } = await supabase
      .from('parts')
      .select('*')
      .in('shop_id', targetShopIds);

    // Fetch part usage
    const { data: partUsage } = await supabase
      .from('part_usage')
      .select('*, job_card:job_cards(shop_id)')
      .gte('created_at', startDate.toISOString());

    // Calculate aggregate metrics
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
    const paidRevenue = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
    const pendingRevenue = invoices?.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

    const totalJobs = jobCards?.length || 0;
    const completedJobs = jobCards?.filter(jc => jc.status === 'completed').length || 0;
    const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

    // Per-shop breakdown
    const shopBreakdown = shops.map(shop => {
      const shopInvoices = invoices?.filter(inv => inv.shop_id === shop.id) || [];
      const shopJobs = jobCards?.filter(jc => jc.shop_id === shop.id) || [];
      const shopParts = parts?.filter(p => p.shop_id === shop.id) || [];
      const lowStockCount = shopParts.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;

      return {
        shop: {
          id: shop.id,
          name: shop.name,
          logo_url: shop.logo_url,
        },
        revenue: shopInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        paidRevenue: shopInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0),
        pendingRevenue: shopInvoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + (inv.total || 0), 0),
        totalJobs: shopJobs.length,
        completedJobs: shopJobs.filter(jc => jc.status === 'completed').length,
        completionRate: shopJobs.length > 0 ? Math.round((shopJobs.filter(jc => jc.status === 'completed').length / shopJobs.length) * 100) : 0,
        lowStockCount,
        totalParts: shopParts.length,
      };
    });

    // Parts usage
    const shopPartUsage = partUsage?.filter(pu => targetShopIds.includes(pu.job_card?.shop_id)) || [];
    const totalPartsUsed = shopPartUsage.reduce((sum, pu) => sum + pu.quantity, 0) || 0;
    const totalPartsValue = shopPartUsage.reduce((sum, pu) => sum + (pu.quantity * pu.unit_price), 0) || 0;

    // Revenue by day
    const revenueByDay: Record<string, number> = {};
    invoices?.forEach(inv => {
      const day = inv.created_at.split('T')[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + (inv.total || 0);
    });

    // Jobs by status
    const jobsByStatus: Record<string, number> = {};
    jobCards?.forEach(jc => {
      jobsByStatus[jc.status] = (jobsByStatus[jc.status] || 0) + 1;
    });

    return NextResponse.json({
      aggregate: {
        totalRevenue,
        paidRevenue,
        pendingRevenue,
        totalJobs,
        completedJobs,
        completionRate,
        totalPartsUsed,
        totalPartsValue,
        totalShops: shopIds.length,
      },
      shopBreakdown,
      revenueByDay,
      jobsByStatus,
      period: parseInt(period),
      shops: shops.map(s => ({ id: s.id, name: s.name, logo_url: s.logo_url })),
    });
  } catch (error) {
    console.error('Error fetching aggregate analytics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
