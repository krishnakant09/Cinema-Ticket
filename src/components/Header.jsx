import React from 'react';
import { Film, Volume2, VolumeX, HelpCircle, Ticket } from 'lucide-react';

export default function Header({
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  selectedCount,
  onOpenSummary,
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            {/* Ambient pulse */}
            <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-30 blur-sm -z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-white">
                CINE<span className="text-amber-400">VERSE</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase">
                3D THEATER
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Interactive 3D Seating & POV Experience
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Cinema Sound FX' : 'Enable Cinema Sound FX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* How to use 3D button */}
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">3D Guide</span>
          </button>

          {/* Cart / Tickets count pill */}
          {selectedCount > 0 && (
            <button
              onClick={onOpenSummary}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200"
            >
              <Ticket className="w-4 h-4" />
              <span>{selectedCount} Seats</span>
              <span className="px-1.5 py-0.5 rounded bg-black/20 text-black text-[10px]">
                Proceed →
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
