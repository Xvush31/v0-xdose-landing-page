'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface PaymentButtonProps {
  type: 'tip' | 'subscription' | 'ppv';
  creatorId: string;
  amount?: number;
  currency?: string;
  className?: string;
  children: React.ReactNode;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: string) => void;
}

export default function PaymentButton({
  type,
  creatorId,
  amount = 10,
  currency = 'usd',
  className = '',
  children,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!session?.user) {
      onError?.('Vous devez être connecté pour effectuer un paiement');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments/nowpayments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          creatorId,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement');
      }

      // Ouvrir une modal ou rediriger vers la page de paiement
      if (data.payment?.payAddress) {
        // Pour les tips, on peut afficher directement l'adresse
        if (type === 'tip') {
          const confirmed = window.confirm(
            `Envoyez exactement ${data.payment.payAmount} ${data.payment.payCurrency} à cette adresse:\n\n${data.payment.payAddress}\n\nCopier l'adresse dans le presse-papiers ?`
          );
          
          if (confirmed) {
            navigator.clipboard.writeText(data.payment.payAddress);
            alert('Adresse copiée ! Envoyez le paiement et le statut sera mis à jour automatiquement.');
          }
        } else {
          // Pour les abonnements et PPV, rediriger vers une page dédiée
          window.open(`/payment/${data.payment.id}`, '_blank');
        }
      }

      onSuccess?.(data.payment);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      onError?.(errorMessage);
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !session?.user}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Traitement...
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Composants spécialisés pour chaque type de paiement
export function TipButton({ creatorId, amount = 5, ...props }: Omit<PaymentButtonProps, 'type'>) {
  return (
    <PaymentButton
      type="tip"
      creatorId={creatorId}
      amount={amount}
      currency="usd"
      className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
      {...props}
    >
      💝 Tip ${amount}
    </PaymentButton>
  );
}

export function SubscriptionButton({ creatorId, amount = 20, ...props }: Omit<PaymentButtonProps, 'type'>) {
  return (
    <PaymentButton
      type="subscription"
      creatorId={creatorId}
      amount={amount}
      currency="usd"
      className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
      {...props}
    >
      🔒 S'abonner ${amount}/mois
    </PaymentButton>
  );
}

export function PPVButton({ creatorId, amount = 10, ...props }: Omit<PaymentButtonProps, 'type'>) {
  return (
    <PaymentButton
      type="ppv"
      creatorId={creatorId}
      amount={amount}
      currency="usd"
      className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
      {...props}
    >
      👁️ Acheter ${amount}
    </PaymentButton>
  );
} 