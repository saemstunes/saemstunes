
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.error('No Authorization header found');
      return new Response(JSON.stringify({
        error: 'Missing Authorization header'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', 
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    console.log('Attempting to get user...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    console.log('User lookup result:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message
    });

    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(JSON.stringify({
        error: 'User not authenticated',
        details: userError?.message
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (!user?.email) {
      console.error('User has no email');
      return new Response(JSON.stringify({
        error: 'User email not found'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Parsing request body...');
    const requestBody = await req.json();
    const { orderType, itemId, itemName, amount, currency, paymentMethod, successUrl, cancelUrl } = requestBody;

    console.log('Request data:', {
      orderType,
      itemId,
      paymentMethod,
      amount,
      currency,
      hasSuccessUrl: !!successUrl
    });

    // Validate required fields
    if (!orderType || !paymentMethod || !amount || !currency) {
      console.error('Missing required fields');
      return new Response(JSON.stringify({
        error: 'Missing required fields: orderType, paymentMethod, amount, currency'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Creating order record...');
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

    if (orderError) {
      console.error('Order creation failed:', orderError);
      return new Response(JSON.stringify({
        error: `Failed to create order: ${orderError.message}`,
        code: orderError.code,
        details: orderError.details
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Order created successfully:', order.id);

    let sessionData;
    switch (paymentMethod) {
      case 'paystack': {
        console.log('Processing Paystack payment...');
        const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY_TEST');
        if (!paystackKey) {
          throw new Error('Paystack secret key not configured');
        }

        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${paystackKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            amount: amount,
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
        console.log('Paystack response:', paystackData);

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
        console.log('Processing Remitly payment...');
        const recipientName = "Saem's Tunes";
        const recipientPhone = "+254798903373";
        const amountUSD = (amount / 100).toFixed(2);

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
        console.log('Processing M-Pesa payment...');
        sessionData = {
          sessionId: `mpesa_${Date.now()}`,
          url: null,
          provider: 'mpesa',
          checkoutRequestId: `mock_checkout_request_id`
        };
        break;
      }
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }

    console.log('Storing payment session...');
    const { error: sessionError } = await supabaseClient
      .from('payment_sessions')
      .insert({
        order_id: order.id,
        session_id: sessionData.sessionId,
        provider: paymentMethod,
        session_url: sessionData.url,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        metadata: sessionData
      });

    if (sessionError) {
      console.error('Payment session storage failed:', sessionError);
      return new Response(JSON.stringify({
        error: `Failed to store payment session: ${sessionError.message}`,
        code: sessionError.code
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Payment session created successfully:', sessionData.sessionId);

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      sessionData
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({
      error: error.message,
      type: error.constructor.name
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
