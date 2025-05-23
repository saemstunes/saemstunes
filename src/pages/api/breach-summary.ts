// pages/api/breach-summary.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createServerSupabaseClient({ req, res });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get breach summary for the user
    const { data, error } = await supabase
      .rpc('get_user_breach_summary', { target_user_id: user.id });

    if (error) {
      throw error;
    }

    return res.status(200).json(data[0] || {
      total_emails_checked: 0,
      compromised_emails: 0,
      total_breaches: 0,
      total_pastes: 0,
      last_check_date: null
    });
  } catch (error) {
    console.error('Error getting breach summary:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error : 'Something went wrong'
    });
  }
}
