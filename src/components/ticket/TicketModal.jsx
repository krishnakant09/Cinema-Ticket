import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Calendar,
  Clock,
  RotateCcw,
  X,
} from 'lucide-react';
import { soundFX } from '../../utils/soundFX';

export default function TicketModal({ isOpen, onClose, bookingDetails, onNewBooking }) {
  useEffect(() => {
    if (isOpen && bookingDetails) {
      soundFX.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#ffffff'],
        });
      } catch {}
    }
  }, [isOpen, bookingDetails]);

  if (!isOpen || !bookingDetails) return null;

  const {
    bookingId,
    movie,
    date,
    time,
    seats,
    concessions,
    total,
  } = bookingDetails;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-slate-950 border border-white/20 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Glow Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-amber-400 to-purple-500 animate-pulse" />

        {/* Confirmation Header */}
        <div className="p-6 text-center border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <CheckCircle2 className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-wide">
            Reservation Confirmed!
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Your 3D cinema pass has been generated. Show QR at the theatre entrance.
          </p>
        </div>

        {/* The Ticket Pass Body */}
        <div className="p-6">
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e121d] border border-amber-500/30 p-5 shadow-2xl">
            {/* Top Row: Movie Info */}
            <div className="flex gap-4 items-start pb-5 border-b border-white/10">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-20 h-28 rounded-xl object-cover shadow-lg bg-slate-800 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                  IMAX with Laser 3D
                </span>
                <h3 className="text-lg font-black text-white mt-1 leading-tight truncate">
                  {movie.title}
                </h3>
                <div className="text-xs text-gray-400 mt-0.5">
                  Dir. {movie.director} • {movie.rating} • {movie.duration}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {date.dayName}, {date.dateStr}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono font-bold text-white">
                      {time.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Theater & Seat Details */}
            <div className="py-4 grid grid-cols-3 gap-2 text-center border-b border-white/10">
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  Screen
                </div>
                <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
                  IMAX 1
                </div>
              </div>

              <div className="p-2 rounded-xl bg-black/30 border border-white/5 col-span-2">
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  Assigned Seats ({seats.length})
                </div>
                <div className="text-sm font-mono font-bold text-amber-400 mt-0.5 truncate">
                  {seats.map((s) => `${s.row}-${s.number}`).join(', ')}
                </div>
              </div>
            </div>

            {/* Concessions ordered list */}
            {concessions && concessions.length > 0 && (
              <div className="py-3 border-b border-white/10 text-xs text-gray-300">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Pre-ordered Concessions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {concessions.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px]"
                    >
                      {c.qty}x {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Cutout Notches */}
            <div className="relative my-4 flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-slate-950 -ml-8 border border-white/15" />
              <div className="flex-1 border-t-2 border-dashed border-white/20 mx-2" />
              <div className="w-6 h-6 rounded-full bg-slate-950 -mr-8 border border-white/15" />
            </div>

            {/* Bottom Row: Scannable Barcode & QR Code */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-gray-400">
                  Booking Reference
                </div>
                <div className="text-base font-mono font-black text-white tracking-widest">
                  {bookingId}
                </div>
                <div className="text-xs text-gray-400">
                  Total Paid: <span className="font-bold text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Holographic QR Code SVG */}
              <div className="p-2 rounded-xl bg-white shadow-md">
                <svg
                  className="w-18 h-18 text-black"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="black" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="black" />

                  <rect x="65" y="10" width="25" height="25" fill="black" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="black" />

                  <rect x="10" y="65" width="25" height="25" fill="black" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="black" />

                  <rect x="42" y="15" width="6" height="6" fill="black" />
                  <rect x="52" y="22" width="6" height="6" fill="black" />
                  <rect x="42" y="32" width="16" height="6" fill="black" />
                  <rect x="45" y="45" width="10" height="10" fill="black" />
                  <rect x="20" y="45" width="8" height="8" fill="black" />
                  <rect x="68" y="45" width="18" height="6" fill="black" />
                  <rect x="45" y="65" width="12" height="12" fill="black" />
                  <rect x="65" y="65" width="8" height="18" fill="black" />
                  <rect x="78" y="78" width="12" height="12" fill="black" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-6 border-t border-white/10 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onNewBooking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Book Another Movie
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Save / Print PDF
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
