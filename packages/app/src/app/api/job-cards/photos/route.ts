import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/job-cards/photos - Upload photo to job card
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobCardId, imageBase64, mimeType = 'image/jpeg', caption, isDamagePhoto } = body;

    if (!jobCardId || !imageBase64) {
      return NextResponse.json(
        { error: 'jobCardId and imageBase64 are required' },
        { status: 400 }
      );
    }

    // Verify job card belongs to user's shop
    const { data: jobCard } = await supabase
      .from('job_cards')
      .select('shop_id')
      .eq('id', jobCardId)
      .single();

    if (!jobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }

    // Upload image to Supabase Storage
    const fileName = `${jobCardId}/${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('job-card-photos')
      .upload(fileName, Buffer.from(imageBase64, 'base64'), {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      // Fall back to direct URL if storage not configured
    }

    // Get public URL (or construct from bucket)
    const { data: urlData } = supabase.storage
      .from('job-card-photos')
      .getPublicUrl(uploadData?.path || fileName);

    // Save photo record
    const { data: photo, error: photoError } = await supabase
      .from('job_card_photos')
      .insert({
        job_card_id: jobCardId,
        url: urlData.publicUrl,
        caption,
        is_damage_photo: isDamagePhoto || false,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (photoError) throw photoError;

    // Log activity
    await supabase
      .from('activity_items')
      .insert({
        shop_id: jobCard.shop_id,
        user_id: user.id,
        type: 'photo_uploaded',
        title: 'Photo uploaded',
        description: `Photo added to job card`,
        metadata: { job_card_id: jobCardId, photo_id: photo.id },
      });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
