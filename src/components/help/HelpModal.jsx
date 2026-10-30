import React from 'react';
import {
  Eye,
  MousePointer,
  Layers,
  X,
  Compass,
} from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-white/15 p-6 shadow-2xl text-left">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">3D Cinema Guide</h3>
              <p className="text-xs text-gray-400">
                Explore the auditorium before you book
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-5">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <MousePointer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">
                Orbit & Pan Navigation
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Click and drag your mouse to rotate freely around the hall. Scroll
                to zoom in closely to inspect seat textures and legroom.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">
                First-Person Seat POV Mode
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hover any seat in the 2D matrix or 3D hall and trigger{' '}
                <span className="text-cyan-300 font-semibold">3D POV</span> to fly
                your camera right into that seat at eye level to test the sightline!
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">
                Camera Angle Presets
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Use the quick buttons in the 3D viewer (Sweet Spot, VIP Balcony,
                Top Down, Front View) to jump to key viewing angles instantly.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20"
        >
          Got It, Let&apos;s Book!
        </button>
      </div>
    </div>
  );
}
