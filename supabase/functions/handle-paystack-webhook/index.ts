
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHash } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();

    // Verify webhook signature
    const hash = createHash("sha512");
    hash.update(Deno.env.get('PAYSTACK_SECRET_KEY_TEST') + body);
    const expectedSignature = hash.toString("hex");

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);

    switch (event.event) {
      case 'charge.success': {
        const transaction = event.data;
        const reference = transaction.reference;
        const orderId = reference.replace('ST_', '');

        console.log('Processing successful payment for order:', orderId);

        // Update order status
        const { error: orderError } = await supabaseClient
          .from('orders')
          .update({
            status: 'completed',
            payment_provider_id: transaction.id,
            payment_metadata: { transaction }
          })
          .eq('id', orderId);

        if (orderError) {
          console.error('Failed to update order:', orderError);
          break;
        }

        // Get order details to create subscription if needed
        const { data: order } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (order?.order_type === 'subscription') {
          // Create or update subscription
          const validUntil = new Date();
          validUntil.setMonth(validUntil.getMonth() + 1); // 1 month subscription

          await supabaseClient
            .from('subscriptions')
            .upsert({
              user_id: order.user_id,
              type: order.item_id as any,
              status: 'active',
              valid_until: validUntil.toISOString(),
              order_id: orderId
            });
        }

        console.log('Payment completed successfully for order:', orderId);
        break;
      }

      case 'charge.failed': {
        const transaction = event.data;
        const reference = transaction.reference;
        const orderId = reference.replace('ST_', '');

        await supabaseClient
          .from('orders')
          .update({ 
            status: 'failed',
            payment_metadata: { transaction }
          })
          .eq('id', orderId);

        console.log('Payment failed for order:', orderId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
