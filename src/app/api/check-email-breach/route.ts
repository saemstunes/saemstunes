/ App Router versions (for Next.js 13+)
// app/api/check-email-breach/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseHIBPIntegration } from '../../../lib/supabase-hibp';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const hibpIntegration = new SupabaseHIBPIntegration(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      process.env.HIBP_API_KEY!,
      'YourApp-HIBP-Integration'
    );

    const result = await hibpIntegration.smartCheck(email, user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking email breach:', error);
    
    if (error instanceof Error && error.message.includes('Rate limited')) {
      return NextResponse.json({ 
        error: 'Rate limited by HIBP API', 
        message: error.message 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error : 'Something went wrong'
    }, { status: 500 });
  }
}
