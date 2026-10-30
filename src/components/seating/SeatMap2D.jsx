import React, { useState } from 'react';
import { Eye, Armchair, Accessibility } from 'lucide-react';
import { soundFX } from '../../utils/soundFX';

export default function SeatMap2D({
  seats,
  selectedSeatIds,
  onSeatToggle,
  onEnterPov,
}) {
  const [filterTier, setFilterTier] = useState('ALL'); // 'ALL' | 'VIP' | 'PREMIUM' | 'STANDARD'
  const [hoveredSeatId, setHoveredSeatId] = useState(null);

  // Group seats by row character
  const rows = ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

  const getSeatColor = (seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'booked';
    const isFilteredOut = filterTier !== 'ALL' && seat.tierKey !== filterTier;

    if (isFilteredOut) {
      return 'opacity-20 cursor-not-allowed bg-slate-800 border-slate-700 text-transparent';
    }

    if (isSelected) {
      return 'bg-amber-500 border-amber-300 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-110 z-10';
    }

    if (isBooked) {
      return 'bg-slate-800/80 border-slate-700/50 text-slate-500 cursor-not-allowed opacity-50';
    }

    if (seat.tierKey === 'VIP') {
      return 'bg-amber-950/60 border-amber-600/60 text-amber-300 hover:border-amber-400 hover:bg-amber-900/80 hover:scale-105';
    }

    if (seat.tierKey === 'PREMIUM') {
      return 'bg-cyan-950/50 border-cyan-600/50 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/80 hover:scale-105';
    }

    return 'bg-slate-800/60 border-slate-600/50 text-slate-300 hover:border-slate-400 hover:bg-slate-700 hover:scale-105';
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    if (filterTier !== 'ALL' && seat.tierKey !== filterTier) return;

    if (selectedSeatIds.includes(seat.id)) {
      soundFX.playSeatDeselect();
    } else {
      soundFX.playSeatSelect();
    }
    onSeatToggle(seat);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 shadow-2xl">
      {/* Header and Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Armchair className="w-5 h-5 text-amber-400" />
            2D Interactive Seating Matrix
          </h3>
          <p className="text-xs text-gray-400">
            Click any seat to select or preview screen sightline
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            onClick={() => setFilterTier('ALL')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
              filterTier === 'ALL'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Tiers
          </button>
          <button
            onClick={() => setFilterTier('VIP')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 ${
              filterTier === 'VIP'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            VIP ($24.50)
          </button>
          <button
            onClick={() => setFilterTier('PREMIUM')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 ${
              filterTier === 'PREMIUM'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Premium ($18.00)
          </button>
          <button
            onClick={() => setFilterTier('STANDARD')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 ${
              filterTier === 'STANDARD'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-gray-400 hover:text-purple-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Standard ($13.50)
          </button>
        </div>
      </div>

      {/* Screen Curved Header */}
      <div className="relative mb-8 text-center">
        <div className="w-4/5 mx-auto h-3 border-t-4 border-cyan-400/80 rounded-t-[100%] shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
        <div className="mt-1 text-[11px] font-bold tracking-[0.25em] text-cyan-300 uppercase">
          ✦ Curved IMAX Screen ✦
        </div>
      </div>

      {/* Seating Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[620px] max-w-[760px] mx-auto space-y-2">
          {rows.map((rowLetter) => {
            const rowSeats = seats
              .filter((s) => s.row === rowLetter)
              .sort((a, b) => a.number - b.number);

            return (
              <div key={rowLetter} className="flex items-center justify-between gap-2">
                {/* Left Row Identifier */}
                <div className="w-6 text-center text-xs font-mono font-bold text-gray-400">
                  {rowLetter}
                </div>

                {/* Left Seat Bank (1 to 8) */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                  {rowSeats.slice(0, 8).map((seat) => {
                    return (
                      <button
                        key={seat.id}
                        disabled={seat.status === 'booked'}
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => setHoveredSeatId(seat.id)}
                        onMouseLeave={() => setHoveredSeatId(null)}
                        className={`relative w-8 h-8 rounded-lg border text-[11px] font-mono flex items-center justify-center transition-all duration-150 ${getSeatColor(
                          seat
                        )}`}
                        title={`Row ${seat.row} Seat ${seat.number} - ${seat.tierName} ($${seat.price})`}
                      >
                        {seat.isWheelchair ? (
                          <Accessibility className="w-3.5 h-3.5" />
                        ) : (
                          seat.number
                        )}

                        {/* Hover POV Quick Action */}
                        {hoveredSeatId === seat.id && seat.status !== 'booked' && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onEnterPov(seat.id);
                            }}
                            className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[10px] font-sans flex items-center gap-1 shadow-lg whitespace-nowrap cursor-pointer hover:bg-cyan-500"
                          >
                            <Eye className="w-3 h-3" /> 3D POV
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Center Aisle Gap */}
                <div className="w-8 flex flex-col items-center justify-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
                </div>

                {/* Right Seat Bank (9 to 16) */}
                <div className="flex items-center gap-1.5 flex-1 justify-start">
                  {rowSeats.slice(8, 16).map((seat) => {
                    return (
                      <button
                        key={seat.id}
                        disabled={seat.status === 'booked'}
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => setHoveredSeatId(seat.id)}
                        onMouseLeave={() => setHoveredSeatId(null)}
                        className={`relative w-8 h-8 rounded-lg border text-[11px] font-mono flex items-center justify-center transition-all duration-150 ${getSeatColor(
                          seat
                        )}`}
                        title={`Row ${seat.row} Seat ${seat.number} - ${seat.tierName} ($${seat.price})`}
                      >
                        {seat.isWheelchair ? (
                          <Accessibility className="w-3.5 h-3.5" />
                        ) : (
                          seat.number
                        )}

                        {/* Hover POV Quick Action */}
                        {hoveredSeatId === seat.id && seat.status !== 'booked' && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onEnterPov(seat.id);
                            }}
                            className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[10px] font-sans flex items-center gap-1 shadow-lg whitespace-nowrap cursor-pointer hover:bg-cyan-500"
                          >
                            <Eye className="w-3 h-3" /> 3D POV
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Row Identifier */}
                <div className="w-6 text-center text-xs font-mono font-bold text-gray-400">
                  {rowLetter}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 text-black font-bold text-[9px] flex items-center justify-center">
              ✓
            </span>
            Selected ({selectedSeatIds.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <Accessibility className="w-3.5 h-3.5 text-cyan-400" />
            Wheelchair Berth
          </span>
        </div>

        <div className="text-gray-300">
          Tip: Hover any seat and click <span className="text-cyan-400 font-semibold">3D POV</span> to inspect your view!
        </div>
      </div>
    </div>
  );
}
