
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  orderType: 'subscription' | 'service' | 'product';
  itemId: string;
  itemName: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'mpesa';
  successUrl?: string;
  cancelUrl?: string;
}

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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user?.email) {
      throw new Error('User not authenticated');
    }

    const { orderType, itemId, itemName, amount, currency, paymentMethod, successUrl, cancelUrl }: PaymentRequest = await req.json();

    // Create order record
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        order_type: orderType,
        item_id: itemId,
        item_name: itemName,
        amount,
        currency,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

    let sessionData;

    switch (paymentMethod) {
      case 'stripe': {
        const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2023-10-16' });
        
        const session = await stripe.checkout.sessions.create({
          mode: orderType === 'subscription' ? 'subscription' : 'payment',
          payment_method_types: ['card'],
          line_items: orderType === 'subscription' ? [{
            price_data: {
              currency: currency.toLowerCase(),
              product_data: { name: itemName },
              unit_amount: amount,
              recurring: { interval: 'month' }
            },
            quantity: 1
          }] : [{
            price_data: {
              currency: currency.toLowerCase(),
              product_data: { name: itemName },
              unit_amount: amount
            },
            quantity: 1
          }],
          success_url: successUrl || `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${req.headers.get('origin')}/subscriptions`,
          metadata: { orderId: order.id }
        });

        sessionData = {
          sessionId: session.id,
          url: session.url,
          provider: 'stripe'
        };
        break;
      }

      case 'paypal': {
        // PayPal integration would go here
        // For now, returning a mock response
        sessionData = {
          sessionId: `paypal_${Date.now()}`,
          url: `https://www.paypal.com/checkoutnow?token=mock_token`,
          provider: 'paypal'
        };
        break;
      }

      case 'mpesa': {
        // M-Pesa STK Push integration would go here
        // This requires Safaricom's Daraja API
        sessionData = {
          sessionId: `mpesa_${Date.now()}`,
          url: null, // M-Pesa uses STK push, no redirect URL
          provider: 'mpesa',
          checkoutRequestId: `mock_checkout_request_id`
        };
        break;
      }

      default:
        throw new Error('Unsupported payment method');
    }

    // Store payment session
    await supabaseClient
      .from('payment_sessions')
      .insert({
        order_id: order.id,
        session_id: sessionData.sessionId,
        provider: paymentMethod,
        session_url: sessionData.url,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        metadata: sessionData
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        sessionData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Payment session creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
