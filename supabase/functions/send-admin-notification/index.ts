
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { type, title, description, user_email, user_name } = await req.json();
    
    console.log('Sending admin notification:', { type, title, user_email });

    // For now, we'll just log the notification
    // In production, you would integrate with an email service like Resend
    console.log(`
      New Track Upload Notification:
      Type: ${type}
      Title: ${title}
      Description: ${description}
      User: ${user_name} (${user_email})
      
      Please review and reply with "I accept" to approve this track for publication.
    `);

    // You can integrate with email services here
    // Example with Resend:
    /*
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    await resend.emails.send({
      from: 'noreply@saemstunes.com',
      to: 'saemstunes@gmail.com',
      subject: `New Track Upload: ${title}`,
      html: `
        <h2>New Track Upload for Review</h2>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Uploaded by:</strong> ${user_name} (${user_email})</p>
        <p>Please review this track and reply with "I accept" to approve it for publication.</p>
      `
    });
    */

    return new Response(
      JSON.stringify({ success: true, message: 'Admin notification sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Admin notification error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to send admin notification' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
