'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function TestPaymentPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState('10');
  const [currency, setCurrency] = useState('usd');
  const [creatorId, setCreatorId] = useState('test-creator');
  const [paymentType, setPaymentType] = useState('tip');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async () => {
    if (!session?.user) {
      setError('Vous devez être connecté');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentData(null);

    try {
      const response = await fetch('/api/payments/nowpayments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          creatorId,
          type: paymentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement');
      }

      setPaymentData(data.payment);
      console.log('Payment created:', data.payment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments/nowpayments?payment_id=${paymentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la vérification du statut');
      }

      setPaymentData(data.payment);
      console.log('Payment status:', data.payment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Status check error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Paiements</h1>
          <p className="text-gray-600">Vous devez être connecté pour tester les paiements.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Paiements NowPayments</h1>

        {/* Formulaire de création de paiement */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Créer un Paiement</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="btc">BTC</option>
                <option value="eth">ETH</option>
                <option value="usdt">USDT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Créateur
              </label>
              <input
                type="text"
                value={creatorId}
                onChange={(e) => setCreatorId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test-creator"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de Paiement
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tip">Tip</option>
                <option value="subscription">Abonnement</option>
                <option value="ppv">Pay-Per-View</option>
              </select>
            </div>
          </div>

          <button
            onClick={createPayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer le Paiement'}
          </button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Affichage des données de paiement */}
        {paymentData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails du Paiement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-700">ID Paiement</p>
                <p className="text-sm text-gray-900 font-mono">{paymentData.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Statut</p>
                <p className="text-sm text-gray-900">{paymentData.paymentStatus}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Adresse de Paiement</p>
                <p className="text-sm text-gray-900 font-mono break-all">{paymentData.payAddress}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Montant à Payer</p>
                <p className="text-sm text-gray-900">{paymentData.payAmount} {paymentData.payCurrency}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Prix</p>
                <p className="text-sm text-gray-900">{paymentData.priceAmount} {paymentData.priceCurrency}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Order ID</p>
                <p className="text-sm text-gray-900 font-mono">{paymentData.orderId}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => checkPaymentStatus(paymentData.id)}
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Vérifier le Statut'}
              </button>
              
              <button
                onClick={() => {
                  setPaymentData(null);
                  setError(null);
                }}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Effacer
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-8">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions de Test</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Créez un paiement avec les paramètres souhaités</li>
            <li>• Copiez l'adresse de paiement générée</li>
            <li>• Utilisez un wallet crypto pour envoyer le montant exact</li>
            <li>• Vérifiez le statut du paiement après envoi</li>
            <li>• Les webhooks mettront à jour automatiquement le statut</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 