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
    const { amount, currency, creatorId, type } = body;

    // Validation des données
    if (!amount || !currency || !creatorId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
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