
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, user_id } = await req.json();
    
    console.log('Moderating upload:', { title, description, user_id });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Basic validation
    if (!title || title.trim().length < 3) {
      return new Response(
        JSON.stringify({
          approved: false,
          reason: 'Title must be at least 3 characters long'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (title.length > 100) {
      return new Response(
        JSON.stringify({
          approved: false,
          reason: 'Title must be less than 100 characters'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check for profanity (basic implementation)
    const profanityList = ['spam', 'scam', 'hate', 'violent'];
    const contentToCheck = `${title} ${description}`.toLowerCase();
    
    for (const word of profanityList) {
      if (contentToCheck.includes(word)) {
        return new Response(
          JSON.stringify({
            approved: false,
            reason: 'Content violates community guidelines'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    }

    // Check user's upload limit (basic rate limiting)
    const { data: recentUploads, error } = await supabase
      .from('tracks')
      .select('id')
      .eq('user_id', user_id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error checking recent uploads:', error);
    } else if (recentUploads && recentUploads.length >= 5) {
      return new Response(
        JSON.stringify({
          approved: false,
          reason: 'Upload limit reached. Please wait 24 hours before uploading more tracks.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Log moderation activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id,
        action: `track_moderation_approved: ${title}`
      });

    return new Response(
      JSON.stringify({
        approved: true,
        reason: 'Content approved'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Moderation error:', error);
    
    return new Response(
      JSON.stringify({
        approved: false,
        reason: 'Moderation service temporarily unavailable'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
