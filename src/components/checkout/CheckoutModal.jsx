import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Tag,
  Lock,
  ArrowLeft,
  X,
  Check,
  Loader2,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { CONCESSIONS, PROMO_CODES } from '../../data/cinemaData';

export default function CheckoutModal({
  isOpen,
  onClose,
  onBackToSnacks,
  selectedSeats,
  selectedMovie,
  selectedDate,
  selectedTime,
  concessionQuantities,
  onCompleteBooking,
}) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'applepay' | 'googlepay'
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form mock state
  const [cardName, setCardName] = useState('Alex Mercer');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('884');

  if (!isOpen) return null;

  // Calculations
  const ticketsSubtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  const snacksSubtotal = Object.entries(concessionQuantities).reduce(
    (acc, [id, qty]) => {
      const item = CONCESSIONS.find((c) => c.id === id);
      return acc + (item ? item.price * qty : 0);
    },
    0
  );

  const convenienceFee = selectedSeats.length * 1.5;
  const subtotal = ticketsSubtotal + snacksSubtotal + convenienceFee;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountAmount) {
      discount = appliedPromo.discountAmount;
    }
  }

  const tax = Math.max(0, (subtotal - discount) * 0.08);
  const finalTotal = Math.max(0, subtotal - discount + tax);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try "CINEMA20" or "IMAXVIP"');
    }
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onCompleteBooking({
        bookingId: 'CV-' + Math.floor(100000 + Math.random() * 900000),
        bookingDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        movie: selectedMovie,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        concessions: Object.entries(concessionQuantities)
          .filter(([, qty]) => qty > 0)
          .map(([id, qty]) => ({
            ...CONCESSIONS.find((c) => c.id === id),
            qty,
          })),
        total: finalTotal,
        paymentMethod,
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-white/15 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSnacks}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Back to snacks"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Secure Checkout
              </h3>
              <p className="text-xs text-gray-400">
                256-bit encrypted cinema reservation gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Order Breakdown */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Experience Details
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-12 h-16 rounded-lg object-cover bg-slate-800"
                />
                <div>
                  <h5 className="font-bold text-white text-sm">{selectedMovie.title}</h5>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">
                    {selectedDate.dayName}, {selectedDate.dateStr} • {selectedTime.time}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Screen 1 - Grand IMAX Laser 3D
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Seats Itemized */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-white/10">
                <span>Selected Seats ({selectedSeats.length})</span>
                <span>Price</span>
              </div>
              {selectedSeats.map((seat) => (
                <div
                  key={seat.id}
                  className="flex items-center justify-between text-xs text-gray-300"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">
                      Row {seat.row} - Seat {seat.number}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-gray-400">
                      {seat.tierName}
                    </span>
                  </span>
                  <span className="font-mono font-semibold">
                    ${seat.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Concessions Itemized (if any) */}
            {snacksSubtotal > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-white/10">
                  <span>Concessions Pre-order</span>
                  <span>Amount</span>
                </div>
                {Object.entries(concessionQuantities)
                  .filter(([, q]) => q > 0)
                  .map(([id, qty]) => {
                    const item = CONCESSIONS.find((c) => c.id === id);
                    if (!item) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between text-xs text-gray-300"
                      >
                        <span>
                          {qty}x {item.name}
                        </span>
                        <span className="font-mono font-semibold">
                          ${(item.price * qty).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Promo Code Input */}
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/10">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. CINEMA20)"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/15 text-xs text-white placeholder-gray-500 uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="mt-2 text-xs text-emerald-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" /> Code &quot;{appliedPromo.code}&quot; applied ({appliedPromo.description})
                  </span>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-gray-400 hover:text-white text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <div className="mt-1.5 text-xs text-rose-400">{promoError}</div>
              )}
            </div>
          </div>

          {/* Right Column: Payment & Final Total */}
          <div className="space-y-4">
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'applepay'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block">Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'googlepay'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block">Google Pay</span>
                </button>
              </div>
            </div>

            {/* Credit Card Simulated Inputs */}
            {paymentMethod === 'card' ? (
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 text-center space-y-2">
                <Smartphone className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-xs text-gray-300 font-medium">
                  {paymentMethod === 'applepay'
                    ? 'Apple Pay biometric authorization ready'
                    : 'Google Pay 1-tap checkout enabled'}
                </p>
                <p className="text-[11px] text-gray-500">
                  Click Pay Now to complete with standard device authorization
                </p>
              </div>
            )}

            {/* Price Calculations Total Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/15 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-gray-200">
                  ${ticketsSubtotal.toFixed(2)}
                </span>
              </div>
              {snacksSubtotal > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Concessions</span>
                  <span className="font-mono text-gray-200">
                    ${snacksSubtotal.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Online Booking Fee</span>
                <span className="font-mono text-gray-200">
                  ${convenienceFee.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({appliedPromo.code})</span>
                  <span className="font-mono font-bold">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-gray-200">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-white/15 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Complete Payment Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Cinema Reservation...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ${finalTotal.toFixed(2)} & Reserve</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
