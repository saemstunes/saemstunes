
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

    console.log('Creating payment session for:', { orderType, itemId, paymentMethod, amount, currency });

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
      case 'paystack': {
        // Initialize Paystack transaction
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY_TEST')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            amount: amount, // Paystack expects amount in kobo (cents equivalent)
            currency: currency,
            reference: `ST_${order.id}`,
            callback_url: successUrl || `${req.headers.get('origin')}/payment-success`,
            metadata: {
              orderId: order.id,
              orderType: orderType,
              itemName: itemName
            }
          })
        });

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

      case 'remitly': {
        // Create Remitly redirect with pre-filled recipient info
        const recipientName = "Samuel Muthomi"; // Your name
        const recipientPhone = "+254798903373"; // Your M-Pesa number
        const amountUSD = (amount / 100).toFixed(2); // Convert from cents to dollars
        
        // Remitly URL with pre-filled data
        const remitlyUrl = `https://www.remitly.com/us/en/kenya/send-money?` +
          `amount=${amountUSD}&` +
          `recipient_name=${encodeURIComponent(recipientName)}&` +
          `recipient_phone=${encodeURIComponent(recipientPhone)}&` +
          `delivery_method=mobile_money&` +
          `source=saems_tunes`;

        sessionData = {
          sessionId: `remitly_${Date.now()}`,
          url: remitlyUrl,
          provider: 'remitly'
        };
        break;
      }

      case 'mpesa': {
        // M-Pesa STK Push integration would go here
        // For now, returning a mock response
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

    console.log('Payment session created successfully:', sessionData);

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
