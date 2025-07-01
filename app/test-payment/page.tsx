'use client';

import { useState, useEffect, useRef } from 'react';
import { CryptoSelector } from '@/components/ui/crypto-selector';
import { AmountInput } from '@/components/ui/amount-input';
import { PaymentQRCode } from '@/components/ui/payment-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const SUPPORTED_CRYPTOS = [
  { code: 'usdt', name: 'USDT (Tether)', icon: '💎' },
  { code: 'btc', name: 'Bitcoin', icon: '₿' },
  { code: 'eth', name: 'Ethereum', icon: 'Ξ' },
  { code: 'usdc', name: 'USDC', icon: '💎' },
  { code: 'dai', name: 'DAI', icon: '💎' },
  { code: 'matic', name: 'Polygon (MATIC)', icon: '🔷' },
  { code: 'bnb', name: 'BNB', icon: '🟡' },
  { code: 'sol', name: 'Solana', icon: '🟣' },
];

export default function TestPaymentPage() {
  const [amount, setAmount] = useState('10');
  const [currency, setCurrency] = useState('usdt');
  const [creatorId, setCreatorId] = useState('test-creator-123');
  const [type, setType] = useState('tip');
  const [isTestMode, setIsTestMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

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
          type,
          isTest: isTestMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment creation failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Polling du statut de paiement
  useEffect(() => {
    if (result && result.payment && result.payment.id) {
      setStatus(result.payment.paymentStatus || null);
      setIsPolling(true);
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/payments/nowpayments?payment_id=${result.payment.id}${result.isTest ? '&test=true' : ''}`);
          const data = await res.json();
          if (data && data.payment && data.payment.payment_status) {
            setStatus(data.payment.payment_status);
            // Arrêter le polling si paiement terminé
            if (["finished", "confirmed", "failed", "expired", "partially_paid"].includes(data.payment.payment_status)) {
              setIsPolling(false);
              if (pollingRef.current) clearInterval(pollingRef.current);
            }
          }
        } catch (e) {
          // Optionnel: gestion d'erreur
        }
      }, 5000);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    }
  }, [result]);

  // Confetti plein écran à la confirmation
  useEffect(() => {
    if ((status === 'finished' || status === 'confirmed') && !hasCelebrated) {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
      setHasCelebrated(true);
    }
    if (status !== 'finished' && status !== 'confirmed') {
      setHasCelebrated(false);
    }
  }, [status, hasCelebrated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            🚀 Test Crypto Payments
          </h1>
          
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-300 font-semibold">🧪 Test Mode</h3>
                <p className="text-blue-200 text-sm">
                  {isTestMode 
                    ? "Simulate payments without calling the NowPayments API" 
                    : "Use the NowPayments API"
                  }
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTestMode}
                  onChange={(e) => setIsTestMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount
                  </label>
                  <AmountInput
                    value={amount}
                    onChangeAction={setAmount}
                    currency={currency}
                    min={0.1}
                    max={10000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Crypto Currency
                  </label>
                  <CryptoSelector
                    value={currency}
                    onChangeAction={setCurrency}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Creator ID
                  </label>
                  <input
                    type="text"
                    value={creatorId}
                    onChange={(e) => setCreatorId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="creator-id"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="tip">Tip</option>
                    <option value="subscription">Subscription</option>
                    <option value="purchase">Purchase</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Payment...' : `Create ${isTestMode ? 'Test ' : ''}Payment`}
              </button>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Results
              </h2>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <h3 className="text-red-400 font-semibold mb-2">Error</h3>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {result && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-green-400 font-semibold">
                      ✅ Payment Created Successfully
                    </h3>
                    {result.isTest && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        🧪 TEST MODE
                      </span>
                    )}
                    {result.fallbackUsed && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        🔄 FALLBACK
                      </span>
                    )}
                  </div>
                  {/* QR code premium */}
                  <PaymentQRCode
                    address={result.payment.payAddress}
                    amount={result.payment.payAmount}
                    currency={result.payment.payCurrency}
                    className="mb-4"
                  />
                  {/* Statut temps réel */}
                  <div className="flex flex-col items-center mb-4">
                    <AnimatePresence>
                      {isPolling && (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center gap-2 text-purple-400 text-sm"
                        >
                          <svg className="animate-spin w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                          </svg>
                          Waiting for payment confirmation...
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {status && !isPolling && ["finished", "confirmed"].includes(status) && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.22 }}
                          className="flex flex-col items-center gap-2 text-green-400 text-base font-semibold mt-2"
                        >
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Payment confirmed!</span>
                          <span className="text-white text-lg font-bold mt-2">🎉 Thank you for your support!</span>
                          <button
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow transition-all"
                            onClick={() => window.location.href = '/'}
                          >
                            Return to home
                          </button>
                        </motion.div>
                      )}
                      {status && !isPolling && ["failed", "expired"].includes(status) && (
                        <motion.div
                          key="fail"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.22 }}
                          className="flex items-center gap-2 text-red-400 text-base font-semibold mt-2"
                        >
                          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Payment failed or expired
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Payment ID:</span>
                      <span className="text-white font-mono">{result.payment.id}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pay Address:</span>
                      <span className="text-white font-mono text-xs break-all">
                        {result.payment.payAddress}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pay Amount:</span>
                      <span className="text-white">
                        {result.payment.payAmount} {result.payment.payCurrency.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Price Amount:</span>
                      <span className="text-white">
                        {result.payment.priceAmount} {result.payment.priceCurrency.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status:</span>
                      <span className="text-yellow-400 capitalize">
                        {result.payment.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Order ID:</span>
                      <span className="text-white font-mono text-xs">{result.payment.orderId}</span>
                    </div>
                  </div>
                  
                  {result.isTest ? (
                    <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded">
                      <p className="text-blue-300 text-xs">
                        🧪 This is a simulated test payment. No real transactions were created.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded">
                      <p className="text-blue-300 text-xs">
                        💡 Send the exact amount to the address above. Payment will be confirmed automatically.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Supported Cryptos Info */}
          <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              💎 Supported Cryptocurrencies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SUPPORTED_CRYPTOS.map((crypto) => (
                <div
                  key={crypto.code}
                  className="flex items-center space-x-2 p-2 bg-white/10 rounded"
                >
                  <span className="text-lg">{crypto.icon}</span>
                  <span className="text-white text-sm">{crypto.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 