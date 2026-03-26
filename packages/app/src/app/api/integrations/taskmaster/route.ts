import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isTaskMasterEnabled, TaskMasterService } from '@/lib/taskmaster/service';

const taskmasterService = new TaskMasterService();

// GET /api/integrations/taskmaster - Check TaskMaster status
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if TaskMaster is enabled via environment variables
    const enabled = isTaskMasterEnabled();

    // Try to get project info if enabled
    let projects: any[] = [];
    if (enabled) {
      try {
        const response = await fetch(`${process.env.TASKMASTER_API_URL}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${process.env.TASKMASTER_API_KEY}`,
          },
        });
        if (response.ok) {
          projects = await response.json();
        }
      } catch (error) {
        console.error('Failed to fetch TaskMaster projects:', error);
      }
    }

    return NextResponse.json({
      enabled,
      hasApiKey: !!process.env.TASKMASTER_API_KEY,
      hasProjectId: !!process.env.TASKMASTER_DEFAULT_PROJECT_ID,
      apiUrl: process.env.TASKMASTER_API_URL || 'https://taskmaster.vercel.app',
      projects,
    });
  } catch (error) {
    console.error('Error checking TaskMaster status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check status' },
      { status: 500 }
    );
  }
}

// POST /api/integrations/taskmaster/test - Test TaskMaster connection
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { apiUrl, apiKey, projectId } = body;

    if (!apiUrl || !apiKey || !projectId) {
      return NextResponse.json(
        { error: 'apiUrl, apiKey, and projectId are required' },
        { status: 400 }
      );
    }

    // Configure service temporarily for testing
    taskmasterService.configure({ apiUrl, apiKey, defaultProjectId: projectId });

    // Try to fetch projects to verify credentials
    const response = await fetch(`${apiUrl}/api/projects`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid API key or unable to access TaskMaster' },
        { status: 401 }
      );
    }

    const projects = await response.json();

    // Try to create a test task
    const testResult = await taskmasterService.createTask({
      title: 'GarageOS Integration Test',
      description: 'This is a test task created by GarageOS integration.',
      status: 'todo',
      priority: 4,
    });

    // Delete the test task if created
    if (testResult.success && testResult.task?.id) {
      await fetch(`${apiUrl}/api/tasks/${testResult.task.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      projects,
      testTaskCreated: testResult.success,
    });
  } catch (error) {
    console.error('Error testing TaskMaster connection:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Connection test failed' },
      { status: 500 }
    );
  }
}
