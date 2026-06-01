import React, { useState, useEffect } from "react";
import { MembershipTier } from "../types";
import { CreditCard, Lock, X, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: MembershipTier | null;
  isAnnual: boolean;
  onPaymentSuccess: (finalTierId: any) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedTier,
  isAnnual,
  onPaymentSuccess
}: CheckoutModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaymentDone(false);
      setIsLoading(false);
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setCouponCode("");
      setDiscountPercent(0);
      setCouponApplied(false);
      setCouponError("");
    }
  }, [isOpen]);

  if (!isOpen || !selectedTier) return null;

  const basePrice = parseInt(selectedTier.price, 10);
  const startingPrice = isAnnual ? Math.floor(basePrice * 0.8) : basePrice;
  const periodText = isAnnual ? "year" : "month";
  const calculateTotal = () => {
    const totalBeforePromo = isAnnual ? startingPrice * 12 : startingPrice;
    return Math.max(0, totalBeforePromo * (1 - discountPercent / 100));
  };

  const cleanCardNumber = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    const trimmed = numeric.slice(0, 16);
    const matches = trimmed.match(/.{1,4}/g);
    return matches ? matches.join(" ") : trimmed;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(cleanCardNumber(e.target.value));
  };

  const applyPromo = () => {
    setCouponError("");
    const normalized = couponCode.toUpperCase().trim();
    if (normalized === "LAUNCH50") {
      setDiscountPercent(50);
      setCouponApplied(true);
    } else if (normalized === "STARTUP100") {
      setDiscountPercent(100);
      setCouponApplied(true);
    } else {
      setCouponError("Unknown coupon code. Try 'LAUNCH50' or 'STARTUP100'!");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }
    setIsLoading(true);

    // Simulate standard credit card processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentDone(true);
      setTimeout(() => {
        onPaymentSuccess(selectedTier.id);
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        id="checkout-modal-container"
        className="relative w-full max-w-2xl bg-[#09090A] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 font-sans"
      >
        {/* Header Ribbon */}
        <div className="bg-black/60 px-6 py-4 flex items-center justify-between border-b border-white/5 text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-mono tracking-widest text-gray-400">SECURE STRIPE CHECKOUT</span>
          </div>
          <button
            id="close-checkout"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Summary Column */}
          <div className="p-8 bg-black/40 border-r border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold py-1 px-2.5 rounded bg-indigo-500/10 text-indigo-300 font-mono tracking-wider uppercase border border-indigo-500/20">
                Order Review
              </span>
              <h4 className="text-lg font-medium font-display leading-tight mt-4 text-white">
                {selectedTier.name} Subscription
              </h4>
              <p className="text-xs text-gray-450 mt-1.5 leading-relaxed">{selectedTier.description}</p>

              <div className="text-gray-300 mt-6 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Rate ({periodText})</span>
                  <span>${startingPrice}</span>
                </div>
                {isAnnual && (
                  <div className="flex justify-between text-gray-400">
                    <span>12 Months Term</span>
                    <span>${startingPrice * 12}</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${((isAnnual ? startingPrice * 12 : startingPrice) * discountPercent) / 100}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-8">
              {/* Promo Coupon Entry */}
              <div className="mb-4">
                <label className="block text-[9px] font-bold text-gray-500 font-mono uppercase mb-2 tracking-wider">Promo Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. LAUNCH50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 bg-black border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase placeholder-gray-700"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={couponApplied || !couponCode}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Coupon applied successfully!
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-red-400 font-medium mt-2">{couponError}</p>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-white/5 font-sans">
                <span className="text-xs font-mono text-gray-400">Total Due</span>
                <span className="text-3xl font-bold text-white font-mono leading-none tracking-tight">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="p-8 flex flex-col justify-center bg-black/10">
            <AnimatePresence mode="wait">
              {!paymentDone ? (
                <motion.form
                  key="checkout-form"
                  onSubmit={handleCheckoutSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <label className="block text-[9px] font-bold text-gray-550 font-mono uppercase mb-2 tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#111112] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-550 font-mono uppercase mb-2 tracking-wider">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={handleCardChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#111112] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700"
                      />
                      <CreditCard className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-550 font-mono uppercase mb-2 tracking-wider">Expires</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 2) {
                            setExpiry(val);
                          } else {
                            setExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-[#111112] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-550 font-mono uppercase mb-2 tracking-wider">CVC / CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        className="w-full px-4 py-2.5 bg-[#111112] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-payment-btn"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-505 text-white font-semibold py-3.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider shadow-md transition-all active:scale-[0.98] disabled:opacity-50 mt-6 flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying Funds...
                      </div>
                    ) : (
                      "Confirm & Authorize Plan"
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-500 font-sans tracking-wide leading-normal">
                    By clicking authorize, you consent to simulated sandbox Stripe billing. Revert or reset credentials at any time.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="checkout-success"
                  className="flex flex-col items-center justify-center text-center space-y-4 py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 shrink-0 animate-bounce" />
                  <div>
                    <h5 className="text-base font-semibold text-white tracking-tight">Payment Verified!</h5>
                    <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                      Updating your credentials and unlocking members portal modules...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
