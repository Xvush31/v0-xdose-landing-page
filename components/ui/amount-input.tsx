"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AmountInputProps {
  value: string;
  onChangeAction: (val: string) => void;
  currency: string;
  min?: number;
  max?: number;
  className?: string;
}

export function AmountInput({
  value,
  onChangeAction,
  currency,
  min = 0.1,
  max = 10000,
  className = "",
}: AmountInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const amount = parseFloat(value);
  const isInvalid = isNaN(amount) || amount < min || amount > max;

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Amount
      </label>
      <motion.div
        animate={isFocused ? { boxShadow: "0 0 0 3px #a78bfa55" } : { boxShadow: "0 0 0 0px transparent" }}
        transition={{ duration: 0.18 }}
        className={`flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 transition-all ${
          isInvalid && value ? "border-red-500" : ""
        }`}
      >
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step="any"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChangeAction(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-lg pr-8"
          placeholder={min.toString()}
          aria-invalid={isInvalid}
          aria-describedby="amount-error"
          inputMode="decimal"
        />
        <span className="ml-2 text-white font-semibold text-base select-none">{currency.toUpperCase()}</span>
      </motion.div>
      <AnimatePresence>
        {isInvalid && value && (
          <motion.div
            id="amount-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-red-400 text-xs mt-2 px-1"
          >
            Amount must be between {min} and {max} {currency.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 