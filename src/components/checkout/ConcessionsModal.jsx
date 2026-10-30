import React from 'react';
import { Plus, Minus, Popcorn, Sparkles, ArrowRight, X } from 'lucide-react';
import { CONCESSIONS } from '../../data/cinemaData';

export default function ConcessionsModal({
  isOpen,
  onClose,
  concessionQuantities,
  onUpdateQuantity,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

  const totalSnacksPrice = Object.entries(concessionQuantities).reduce(
    (acc, [id, qty]) => {
      const item = CONCESSIONS.find((c) => c.id === id);
      return acc + (item ? item.price * qty : 0);
    },
    0
  );

  const totalItemsCount = Object.values(concessionQuantities).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950 border border-white/15 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Popcorn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gourmet Snacks & Drinks</h3>
              <p className="text-xs text-gray-400">
                Pre-order concessions to skip the theater counter queues
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snack Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONCESSIONS.map((snack) => {
              const qty = concessionQuantities[snack.id] || 0;
              return (
                <div
                  key={snack.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    qty > 0
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={snack.image}
                      alt={snack.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded">
                          {snack.category}
                        </span>
                        {snack.popular && (
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Best Seller
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm leading-snug">
                        {snack.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                        {snack.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <div>
                      <span className="font-bold text-amber-400 text-base">
                        ${snack.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-500 ml-1.5 font-mono">
                        {snack.calories}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-slate-800 border border-white/15 rounded-xl px-2 py-1">
                          <button
                            onClick={() => onUpdateQuantity(snack.id, qty - 1)}
                            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-bold text-sm text-white w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(snack.id, qty + 1)}
                            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onUpdateQuantity(snack.id, 1)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Summary & Proceed */}
        <div className="p-6 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Total Concessions</div>
            <div className="text-lg font-bold text-white">
              ${totalSnacksPrice.toFixed(2)}{' '}
              <span className="text-xs text-gray-400 font-normal">
                ({totalItemsCount} items)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onProceedToCheckout}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer"
            >
              <span>{totalItemsCount > 0 ? 'Continue to Checkout' : 'Skip & Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

