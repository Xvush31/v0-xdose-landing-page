'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PaymentData {
  id: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  priceAmount: number;
  priceCurrency: string;
  orderId: string;
  paymentStatus: string;
  createdAt: string;
}

export default function PaymentPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const paymentId = params.id as string;

  useEffect(() => {
    if (paymentId) {
      fetchPaymentData();
    }
  }, [paymentId]);

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`/api/payments/nowpayments?payment_id=${paymentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Paiement non trouvé');
      }

      setPaymentData(data.payment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    await fetchPaymentData();
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paiement</h1>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-700">Chargement du paiement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paiement non trouvé</h1>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirming':
        return 'text-blue-600 bg-blue-100';
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'finished':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'En attente de paiement';
      case 'confirming':
        return 'Paiement en cours de confirmation';
      case 'confirmed':
        return 'Paiement confirmé';
      case 'finished':
        return 'Paiement terminé';
      case 'failed':
        return 'Paiement échoué';
      case 'expired':
        return 'Paiement expiré';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paiement Crypto</h1>
            <p className="text-gray-600">Complétez votre paiement en envoyant la crypto exacte</p>
          </div>

          {/* Statut du paiement */}
          <div className="mb-8">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paymentData.paymentStatus)}`}>
              {getStatusText(paymentData.paymentStatus)}
            </div>
          </div>

          {/* Détails du paiement */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails du Paiement</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant à payer:</span>
                <span className="font-semibold text-gray-900">
                  {paymentData.payAmount} {paymentData.payCurrency.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Prix:</span>
                <span className="font-semibold text-gray-900">
                  {paymentData.priceAmount} {paymentData.priceCurrency.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">ID Paiement:</span>
                <span className="font-mono text-sm text-gray-900">{paymentData.id}</span>
              </div>
            </div>
          </div>

          {/* Adresse de paiement */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Adresse de Paiement</h2>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <code className="text-sm text-gray-900 break-all font-mono">
                  {paymentData.payAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(paymentData.payAddress)}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Instructions</h3>
            <ol className="text-blue-800 text-sm space-y-2">
              <li>1. Copiez l'adresse de paiement ci-dessus</li>
              <li>2. Ouvrez votre wallet crypto (Metamask, etc.)</li>
              <li>3. Envoyez exactement <strong>{paymentData.payAmount} {paymentData.payCurrency.toUpperCase()}</strong></li>
              <li>4. Attendez la confirmation (peut prendre quelques minutes)</li>
              <li>5. Le statut sera mis à jour automatiquement</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={checkStatus}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Vérifier le Statut'}
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Retour
            </button>
          </div>

          {/* Note importante */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Envoyez exactement le montant demandé. 
              Tout montant différent ne sera pas accepté et pourrait être perdu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 