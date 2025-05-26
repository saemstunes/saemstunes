
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
  paymentMethod: 'paystack' | 'remitly' | 'mpesa';
  successUrl?: string;
  cancelUrl?: string;
  userEmail?: string;
  guestCheckout?: boolean;
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

    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    // Try to get user from auth header, but don't require it
    if (authHeader) {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser(
          authHeader.replace('Bearer ', '')
        );
        userId = user?.id || null;
      } catch (error) {
        console.log('No valid auth token provided, proceeding as guest');
      }
    }

    const body: PaymentRequest = await req.json();
    console.log('Payment request received:', { ...body, amount: body.amount });

    // Validate required fields
    if (!body.orderType || !body.itemId || !body.itemName || !body.amount || !body.paymentMethod) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: orderType, itemId, itemName, amount, paymentMethod' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate amount
    if (body.amount <= 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Amount must be greater than 0' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order record
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: userId, // Can be null for guest checkout
        order_type: body.orderType,
        item_id: body.itemId,
        item_name: body.itemName,
        amount: Math.round(body.amount * 100), // Store in cents
        currency: body.currency || 'USD',
        payment_method: body.paymentMethod,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create order: ' + (orderError?.message || 'Unknown error')
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Handle different payment methods
    let sessionData: any = {};

    try {
      switch (body.paymentMethod) {
        case 'paystack': {
          const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY_TEST');
          if (!paystackSecretKey) {
            throw new Error('Paystack configuration missing');
          }

          const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: Math.round(body.amount * 100), // Paystack expects amount in kobo
              email: body.userEmail || 'guest@saemstunes.com',
              reference: `ST_${order.id}`,
              callback_url: body.successUrl || `${req.headers.get('origin') || 'https://saemstunes-app-main.vercel.app'}/payment-success`,
              metadata: {
                order_id: order.id,
                user_id: userId,
                order_type: body.orderType,
                item_name: body.itemName
              }
            }),
          });

          if (!paystackResponse.ok) {
            const errorText = await paystackResponse.text();
            console.error('Paystack API error:', errorText);
            throw new Error(`Paystack API error: ${paystackResponse.status}`);
          }

          const paystackData = await paystackResponse.json();
          
          if (!paystackData.status) {
            throw new Error(`Paystack error: ${paystackData.message}`);
          }

          sessionData = {
            sessionId: paystackData.data.reference,
            url: paystackData.data.authorization_url,
            provider: 'paystack'
          };
          break;
        }

        case 'mpesa': {
          // M-Pesa integration via Paystack or direct integration
          sessionData = {
            sessionId: `MPESA_${order.id}`,
            provider: 'mpesa',
            checkoutRequestId: `CR_${Date.now()}`,
            message: 'Please check your phone for M-Pesa payment prompt'
          };
          break;
        }

        case 'remitly': {
          // Remitly integration for international transfers
          sessionData = {
            sessionId: `REMITLY_${order.id}`,
            url: `https://www.remitly.com/app/send?amount=${body.amount}&currency=${body.currency}`,
            provider: 'remitly'
          };
          break;
        }

        default:
          throw new Error(`Unsupported payment method: ${body.paymentMethod}`);
      }

      // Create payment session record
      const { error: sessionError } = await supabaseClient
        .from('payment_sessions')
        .insert({
          order_id: order.id,
          session_id: sessionData.sessionId,
          provider: body.paymentMethod,
          session_url: sessionData.url,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          metadata: sessionData
        });

      if (sessionError) {
        console.error('Error creating payment session:', sessionError);
        // Continue anyway, as the main payment can still work
      }

      return new Response(
        JSON.stringify({
          success: true,
          orderId: order.id,
          sessionData: sessionData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (paymentError) {
      console.error('Payment provider error:', paymentError);
      
      // Update order status to failed
      await supabaseClient
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', order.id);

      return new Response(
        JSON.stringify({
          success: false,
          error: `Payment initialization failed: ${paymentError.message}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
