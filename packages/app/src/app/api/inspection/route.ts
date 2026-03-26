import { createClient } from '@/lib/supabase/server';
import { analyzeVehiclePhoto } from '@/lib/ai/inspection';
import { NextResponse } from 'next/server';

// POST /api/inspection/analyze - Analyze vehicle photo with AI
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
    const { photoId, imageBase64, mimeType = 'image/jpeg' } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    // Analyze the photo
    const result = await analyzeVehiclePhoto(imageBase64, mimeType);

    // If photoId provided, save the result
    if (photoId) {
      const { data: inspectionResult, error: insertError } = await supabase
        .from('ai_inspection_results')
        .insert({
          photo_id: photoId,
          detections: result.detections,
          overall_condition: result.overallCondition,
          summary: result.summary,
          confidence: result.confidence,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to save inspection result:', insertError);
      }

      return NextResponse.json(inspectionResult || result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Inspection error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze photo' },
      { status: 500 }
    );
  }
}

// GET /api/inspection/[jobCardId] - Get inspection results for a job card
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobCardId = searchParams.get('job_card_id');

    if (!jobCardId) {
      return NextResponse.json({ error: 'job_card_id is required' }, { status: 400 });
    }

    // Get inspection results for the job card's photos
    const { data: results, error } = await supabase
      .from('ai_inspection_results')
      .select(`
        *,
        photo:job_card_photos(
          id,
          url,
          caption,
          is_damage_photo,
          job_card_id
        )
      `)
      .eq('photo.job_card_id', jobCardId);

    if (error) throw error;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching inspection results:', error);
    return NextResponse.json({ error: 'Failed to fetch inspection results' }, { status: 500 });
  }
}
