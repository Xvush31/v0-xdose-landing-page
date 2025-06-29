import { NextRequest, NextResponse } from 'next/server';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY!;
const NOWPAYMENTS_BASE_URL = 'https://api.nowpayments.io/v1';

// Mapping des devises fiat vers cryptos supportées
const CURRENCY_MAPPING: { [key: string]: string } = {
  'usd': 'usdt', // USDT au lieu de USD
  'eur': 'usdt', // USDT pour EUR aussi
  'btc': 'btc',
  'eth': 'eth',
  'usdt': 'usdt',
  'usdc': 'usdc',
  'dai': 'dai',
  'matic': 'matic', // Polygon
  'bnb': 'bnb', // BNB
  'sol': 'sol', // Solana
};

// Fonction pour générer des données de test
function generateTestPayment(amount: number, currency: string, creatorId: string, type: string) {
  const payCurrency = CURRENCY_MAPPING[currency.toLowerCase()] || 'usdt';
  const paymentId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    payment_id: paymentId,
    pay_address: `test_address_${payCurrency}_${Date.now()}`,
    pay_amount: amount,
    pay_currency: payCurrency,
    price_amount: amount,
    price_currency: currency,
    order_id: `xdose_${Date.now()}_${creatorId}`,
    purchase_id: `purchase_${Date.now()}`,
    payment_status: 'waiting',
    payin_extra_id: null,
    payin_payment_id: null,
    payin_confirmations: 0,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'API key
    if (!NOWPAYMENTS_API_KEY) {
      console.error('NOWPAYMENTS_API_KEY not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, currency, creatorId, type, isTest = false } = body;

    // Validation des données
    if (!amount || !currency || !creatorId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mode test : simuler un paiement réussi
    if (isTest || process.env.NODE_ENV === 'development') {
      console.log('🧪 Test mode: Generating mock payment');
      const testPayment = generateTestPayment(amount, currency, creatorId, type);
      
      return NextResponse.json({
        success: true,
        payment: {
          id: testPayment.payment_id,
          payAddress: testPayment.pay_address,
          payAmount: testPayment.pay_amount,
          payCurrency: testPayment.pay_currency,
          priceAmount: testPayment.price_amount,
          priceCurrency: testPayment.price_currency,
          orderId: testPayment.order_id,
          purchaseId: testPayment.purchase_id,
          paymentStatus: testPayment.payment_status,
          payinExtraId: testPayment.payin_extra_id,
          payinPaymentId: testPayment.payin_payment_id,
          payinConfirmations: testPayment.payin_confirmations,
          updatedAt: testPayment.updated_at,
          createdAt: testPayment.created_at,
        },
        isTest: true,
      });
    }

    // Convertir la devise en crypto supportée
    const payCurrency = CURRENCY_MAPPING[currency.toLowerCase()] || 'usdt';
    
    console.log(`Converting ${currency} to ${payCurrency} for payment`);

    // Création du paiement via NowPayments
    const paymentData = {
      price_amount: amount,
      price_currency: currency,
      pay_currency: payCurrency, // Utiliser la crypto supportée
      order_id: `xdose_${Date.now()}_${creatorId}`,
      order_description: `${type} payment to creator ${creatorId}`,
      ipn_callback_url: process.env.NOWPAYMENTS_WEBHOOK_URL || 'https://v0xdosette.vercel.app/api/webhooks/nowpayments',
      is_fixed_rate: true,
      is_fee_paid_by_user: false,
    };

    console.log('Creating payment with data:', paymentData);

    const response = await fetch(`${NOWPAYMENTS_BASE_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': NOWPAYMENTS_API_KEY,
      },
      body: JSON.stringify(paymentData),
    });

    console.log('NowPayments response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NowPayments API error:', errorText);
      
      // Si c'est une erreur de devise indisponible, on peut soit :
      // 1. Retourner une erreur explicite
      // 2. Essayer avec une autre crypto
      // 3. Simuler en mode test
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.code === 'CURRENCY_UNAVAILABLE') {
          console.log('🔄 Currency unavailable, trying with USDT fallback');
          
          // Essayer avec USDT comme fallback
          const fallbackData = {
            ...paymentData,
            pay_currency: 'usdt',
          };
          
          const fallbackResponse = await fetch(`${NOWPAYMENTS_BASE_URL}/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': NOWPAYMENTS_API_KEY,
            },
            body: JSON.stringify(fallbackData),
          });
          
          if (fallbackResponse.ok) {
            const fallbackPayment = await fallbackResponse.json();
            console.log('✅ Fallback payment created successfully:', fallbackPayment);
            
            return NextResponse.json({
              success: true,
              payment: {
                id: fallbackPayment.payment_id,
                payAddress: fallbackPayment.pay_address,
                payAmount: fallbackPayment.pay_amount,
                payCurrency: fallbackPayment.pay_currency,
                priceAmount: fallbackPayment.price_amount,
                priceCurrency: fallbackPayment.price_currency,
                orderId: fallbackPayment.order_id,
                purchaseId: fallbackPayment.purchase_id,
                paymentStatus: fallbackPayment.payment_status,
                payinExtraId: fallbackPayment.payin_extra_id,
                payinPaymentId: fallbackPayment.payin_payment_id,
                payinConfirmations: fallbackPayment.payin_confirmations,
                updatedAt: fallbackPayment.updated_at,
                createdAt: fallbackPayment.created_at,
              },
              fallbackUsed: true,
              originalCurrency: currency,
            });
          }
        }
      } catch (parseError) {
        console.error('Error parsing NowPayments error:', parseError);
      }
      
      return NextResponse.json(
        { error: 'Payment creation failed', details: errorText },
        { status: 500 }
      );
    }

    const payment = await response.json();
    console.log('Payment created successfully:', payment);

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.payment_id,
        payAddress: payment.pay_address,
        payAmount: payment.pay_amount,
        payCurrency: payment.pay_currency,
        priceAmount: payment.price_amount,
        priceCurrency: payment.price_currency,
        orderId: payment.order_id,
        purchaseId: payment.purchase_id,
        paymentStatus: payment.payment_status,
        payinExtraId: payment.payin_extra_id,
        payinPaymentId: payment.payin_payment_id,
        payinConfirmations: payment.payin_confirmations,
        updatedAt: payment.updated_at,
        createdAt: payment.created_at,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    const isTest = searchParams.get('test') === 'true';

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    // Mode test : simuler un statut de paiement
    if (isTest || paymentId.startsWith('test_')) {
      console.log('🧪 Test mode: Generating mock payment status');
      
      const mockStatuses = ['waiting', 'confirming', 'confirmed', 'finished'];
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      return NextResponse.json({
        success: true,
        payment: {
          payment_id: paymentId,
          payment_status: randomStatus,
          pay_amount: 10,
          pay_currency: 'usdt',
          price_amount: 10,
          price_currency: 'usdt',
          order_id: 'test_order',
          purchase_id: 'test_purchase',
          payin_confirmations: randomStatus === 'confirmed' ? 3 : 0,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        isTest: true,
      });
    }

    // Vérification de l'API key
    if (!NOWPAYMENTS_API_KEY) {
      console.error('NOWPAYMENTS_API_KEY not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    // Récupérer le statut du paiement via NowPayments
    const response = await fetch(
      `${NOWPAYMENTS_BASE_URL}/payment/${paymentId}`,
      {
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NowPayments status check error:', errorText);
      return NextResponse.json(
        { error: 'Payment not found', details: errorText },
        { status: 404 }
      );
    }

    const payment = await response.json();

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 