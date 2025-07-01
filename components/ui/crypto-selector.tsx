'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CryptoOption {
  code: string;
  name: string;
  icon: string;
  description: string;
  network?: string;
  fee?: string;
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    code: 'usdt',
    name: 'USDT (Tether)',
    icon: '💎',
    description: 'Stablecoin le plus populaire',
    network: 'Ethereum, Tron, Polygon',
    fee: '~$1-5'
  },
  {
    code: 'btc',
    name: 'Bitcoin',
    icon: '₿',
    description: 'Crypto originale',
    network: 'Bitcoin',
    fee: '~$2-10'
  },
  {
    code: 'eth',
    name: 'Ethereum',
    icon: 'Ξ',
    description: 'Smart contracts',
    network: 'Ethereum',
    fee: '~$5-20'
  },
  {
    code: 'usdc',
    name: 'USDC',
    icon: '💎',
    description: 'Stablecoin régulé',
    network: 'Ethereum, Polygon',
    fee: '~$1-5'
  },
  {
    code: 'dai',
    name: 'DAI',
    icon: '💎',
    description: 'Stablecoin décentralisé',
    network: 'Ethereum',
    fee: '~$5-15'
  },
  {
    code: 'matic',
    name: 'Polygon (MATIC)',
    icon: '🔷',
    description: 'Layer 2 rapide',
    network: 'Polygon',
    fee: '~$0.01-0.1'
  },
  {
    code: 'bnb',
    name: 'BNB',
    icon: '🟡',
    description: 'Binance Smart Chain',
    network: 'BSC',
    fee: '~$0.1-1'
  },
  {
    code: 'sol',
    name: 'Solana',
    icon: '🟣',
    description: 'Ultra rapide',
    network: 'Solana',
    fee: '~$0.001-0.01'
  },
];

interface CryptoSelectorProps {
  value: string;
  onChangeAction: (value: string) => void;
  className?: string;
}

export function CryptoSelector({ value, onChangeAction, className = '' }: CryptoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCrypto = CRYPTO_OPTIONS.find(crypto => crypto.code === value);
  const filteredCryptos = CRYPTO_OPTIONS.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{selectedCrypto?.icon}</span>
          <div className="text-left">
            <div className="font-medium">{selectedCrypto?.name}</div>
            <div className="text-xs text-gray-400">{selectedCrypto?.description}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown animé */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl max-h-80 overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                placeholder="Search a crypto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCryptos.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No crypto found
                </div>
              ) : (
                filteredCryptos.map((crypto) => {
                  const isSelected = value === crypto.code;
                  return (
                    <button
                      key={crypto.code}
                      type="button"
                      onClick={() => {
                        onChangeAction(crypto.code);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full p-3 flex items-center space-x-3 hover:bg-white/10 transition-colors relative overflow-hidden ${
                        isSelected ? 'bg-purple-500/20 border-l-4 border-purple-500' : ''
                      }`}
                    >
                      {/* Highlight animé */}
                      {isSelected && (
                        <motion.div
                          layoutId="crypto-highlight"
                          className="absolute inset-0 bg-purple-500/10 rounded-lg z-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        />
                      )}
                      <span className="text-xl z-10">{crypto.icon}</span>
                      <div className="flex-1 text-left z-10">
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-xs text-gray-400">{crypto.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {crypto.network} • Fee: {crypto.fee}
                        </div>
                      </div>
                      {/* Checkmark animé */}
                      {isSelected && (
                        <motion.svg
                          className="w-5 h-5 text-purple-500 z-10"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 