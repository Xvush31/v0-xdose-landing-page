"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentQRCodeProps {
  address: string;
  amount: string;
  currency: string;
  className?: string;
}

export function PaymentQRCode({ address, amount, currency, className = "" }: PaymentQRCodeProps) {
  const [copied, setCopied] = useState(false);
  const qrValue = `${address}?amount=${amount}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white p-4 rounded-xl shadow-lg mb-4"
      >
        <QRCode
          value={qrValue}
          size={160}
          bgColor="#fff"
          fgColor="#4f46e5"
          level="M"
          aria-label={`QR code for ${currency.toUpperCase()} payment`}
        />
      </motion.div>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex items-center gap-2">
          <span className="text-white font-mono text-xs break-all select-all">
            {address}
          </span>
          <button
            onClick={handleCopy}
            className="ml-2 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-all text-xs font-semibold"
            aria-label="Copy address"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="text-sm text-gray-300 mt-1">
          Amount: <span className="font-semibold text-white">{amount} {currency.toUpperCase()}</span>
        </div>
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="text-green-400 text-xs mt-2"
            >
              Address copied!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 