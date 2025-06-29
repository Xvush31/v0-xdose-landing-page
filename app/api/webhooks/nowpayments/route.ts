import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-nowpayments-sig');

    // Vérification de la signature pour la sécurité
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha512', NOWPAYMENTS_IPN_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid signature from NowPayments');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const paymentData = JSON.parse(body);
    console.log('NowPayments webhook received:', paymentData);

    // Traitement selon le statut du paiement
    switch (paymentData.payment_status) {
      case 'waiting':
        console.log('Payment waiting for confirmation:', paymentData.payment_id);
        // Mettre à jour le statut en base de données
        break;

      case 'confirming':
        console.log('Payment confirming:', paymentData.payment_id);
        // Mettre à jour le statut en base de données
        break;

      case 'confirmed':
        console.log('Payment confirmed:', paymentData.payment_id);
        // Traiter le paiement confirmé
        await processConfirmedPayment(paymentData);
        break;

      case 'sending':
        console.log('Payment sending:', paymentData.payment_id);
        // Mettre à jour le statut en base de données
        break;

      case 'partially_paid':
        console.log('Payment partially paid:', paymentData.payment_id);
        // Traiter le paiement partiel
        break;

      case 'finished':
        console.log('Payment finished:', paymentData.payment_id);
        // Finaliser le paiement
        await processFinishedPayment(paymentData);
        break;

      case 'failed':
        console.log('Payment failed:', paymentData.payment_id);
        // Traiter l'échec du paiement
        await processFailedPayment(paymentData);
        break;

      case 'expired':
        console.log('Payment expired:', paymentData.payment_id);
        // Traiter l'expiration du paiement
        await processExpiredPayment(paymentData);
        break;

      default:
        console.log('Unknown payment status:', paymentData.payment_status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('NowPayments webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processConfirmedPayment(paymentData: any) {
  try {
    // Extraire les informations du paiement
    const { payment_id, order_id, pay_amount, pay_currency, price_amount, price_currency } = paymentData;

    // Parser l'order_id pour extraire les informations
    const orderParts = order_id.split('_');
    const userId = orderParts[2];
    const type = orderParts[3] || 'unknown';

    console.log(`Processing confirmed payment: ${payment_id} for user ${userId}, type: ${type}`);

    // TODO: Mettre à jour la base de données
    // await updatePaymentStatus(payment_id, 'confirmed');
    // await grantAccess(userId, type, pay_amount);

  } catch (error) {
    console.error('Error processing confirmed payment:', error);
  }
}

async function processFinishedPayment(paymentData: any) {
  try {
    const { payment_id, order_id } = paymentData;
    console.log(`Processing finished payment: ${payment_id}`);

    // TODO: Finaliser le paiement
    // await finalizePayment(payment_id);
    // await sendNotificationToCreator(payment_id);

  } catch (error) {
    console.error('Error processing finished payment:', error);
  }
}

async function processFailedPayment(paymentData: any) {
  try {
    const { payment_id, order_id } = paymentData;
    console.log(`Processing failed payment: ${payment_id}`);

    // TODO: Traiter l'échec
    // await updatePaymentStatus(payment_id, 'failed');
    // await notifyUserOfFailure(payment_id);

  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}

async function processExpiredPayment(paymentData: any) {
  try {
    const { payment_id, order_id } = paymentData;
    console.log(`Processing expired payment: ${payment_id}`);

    // TODO: Traiter l'expiration
    // await updatePaymentStatus(payment_id, 'expired');
    // await cleanupExpiredPayment(payment_id);

  } catch (error) {
    console.error('Error processing expired payment:', error);
  }
} 