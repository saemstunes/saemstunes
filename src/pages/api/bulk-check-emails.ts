// pages/api/bulk-check-emails.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseHIBPIntegration } from '../../lib/supabase-hibp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Array of emails is required' });
    }

    if (emails.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 emails per request' });
    }

    const supabase = createServerSupabaseClient({ req, res });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hibpIntegration = new SupabaseHIBPIntegration(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      process.env.HIBP_API_KEY!,
      'YourApp-HIBP-Integration'
    );

    // Set a longer delay for bulk operations to be safe with rate limits
    const results = await hibpIntegration.bulkCheck(emails, user.id, 2000);

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Error in bulk email check:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error : 'Something went wrong'
    });
  }
}
