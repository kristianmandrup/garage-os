import { createClient } from '@/lib/supabase/server';
import { diagnoseFromSymptoms } from '@/lib/ai/inspection';
import { NextResponse } from 'next/server';

// POST /api/ai/diagnostics - Get AI-powered diagnosis based on symptoms
export async function POST(request: Request) {
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

    const body = await request.json();
    const { vehicle_id, symptoms, mileage, year, brand, model } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'At least one symptom is required' },
        { status: 400 }
      );
    }

    // Call the AI diagnostic function
    const diagnosis = await diagnoseFromSymptoms(symptoms, {
      brand: brand || '',
      model: model || '',
      year: year || 0,
      mileage,
    });

    // Store the diagnostic result if vehicle_id is provided
    let resultId = `temp-${Date.now()}`;

    if (vehicle_id) {
      const { data: diagnosticResult, error: insertError } = await supabase
        .from('ai_diagnostic_results')
        .insert({
          shop_id: shop.id,
          vehicle_id,
          symptoms,
          suggestions: diagnosis.suggestions.map((s) => ({
            symptom: s.symptom,
            possibleCauses: s.possibleCauses.map((cause, i) => ({
              cause,
              likelihood: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
              description: '',
            })),
            recommendedActions: s.recommendedActions,
            urgency: s.urgency,
          })),
          confidence: diagnosis.confidence,
        })
        .select()
        .single();

      if (!insertError && diagnosticResult) {
        resultId = diagnosticResult.id;
      }
    }

    return NextResponse.json({
      id: resultId,
      diagnosis,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI diagnostics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to run diagnostics' },
      { status: 500 }
    );
  }
}

// GET /api/ai/diagnostics - Get diagnostic history for current shop
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
    const vehicleId = searchParams.get('vehicle_id');

    let query = supabase
      .from('ai_diagnostic_results')
      .select(`
        *,
        vehicle:vehicles(id, license_plate, brand, model)
      `)
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }

    const { data: diagnostics, error } = await query.limit(20);

    if (error) throw error;

    return NextResponse.json(diagnostics);
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch diagnostics' },
      { status: 500 }
    );
  }
}
