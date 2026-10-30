import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import TheaterCanvas from './components/theater3d/TheaterCanvas';
import SeatMap2D from './components/seating/SeatMap2D';
import MovieSelector from './components/movies/MovieSelector';
import ConcessionsModal from './components/checkout/ConcessionsModal';
import CheckoutModal from './components/checkout/CheckoutModal';
import TicketModal from './components/ticket/TicketModal';
import HelpModal from './components/help/HelpModal';
import {
  MOVIES,
  SHOW_DATES,
  SHOW_TIMES,
  THEATRES,
  generateCinemaSeats,
} from './data/cinemaData';
import { soundFX } from './utils/soundFX';
import {
  Armchair,
  ArrowRight,
  Film,
} from 'lucide-react';

export default function App() {
  // Sound FX toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Movie & Showtime selection
  const [selectedMovie, setSelectedMovie] = useState(MOVIES[0]);
  const [selectedDate, setSelectedDate] = useState(SHOW_DATES[0]);
  const [selectedTime, setSelectedTime] = useState(SHOW_TIMES[1]);
  const [selectedTheatre, setSelectedTheatre] = useState(THEATRES[0]);

  // View mode: 'split' | '3d-only' | '2d-only'
  const [viewMode, setViewMode] = useState('split');

  // Modals state
  const [isConcessionsOpen, setIsConcessionsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  // Concessions state
  const [concessionQuantities, setConcessionQuantities] = useState({});

  // POV Seat ID (for first-person seat sightline view)
  const [povSeatId, setPovSeatId] = useState(null);

  // Selected seat IDs
  const [selectedSeatIds, setSelectedSeatIds] = useState(['G-8', 'G-9']);

  // Compute dynamic seats for the selected movie and showtime
  const seats = useMemo(() => {
    return generateCinemaSeats(selectedTime.id, selectedMovie.id);
  }, [selectedTime.id, selectedMovie.id]);

  // Handle movie selection change
  const handleSelectMovie = (movie) => {
    soundFX.playWhoosh();
    setSelectedMovie(movie);
    setPovSeatId(null);
  };

  // Handle showtime change
  const handleSelectTime = (time) => {
    soundFX.playSeatSelect();
    setSelectedTime(time);
    setPovSeatId(null);
  };

  // Toggle seat selection
  const handleSeatToggle = useCallback((seat) => {
    if (!seat || seat.status === 'booked') return;

    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      } else {
        if (prev.length >= 8) {
          alert('Maximum of 8 seats per booking reservation.');
          return prev;
        }
        return [...prev, seat.id];
      }
    });
  }, []);

  // Enter POV mode for a given seat
  const handleEnterPov = useCallback((seatId) => {
    setPovSeatId(seatId);
    if (viewMode === '2d-only') {
      setViewMode('split');
    }
  }, [viewMode]);

  const handleExitPov = useCallback(() => {
    setPovSeatId(null);
  }, []);

  // Auto-pick best available seats (e.g. center rows E, F, G)
  const handleAutoSelectBest = useCallback(() => {
    const preferredRows = ['F', 'G', 'E', 'H'];
    const preferredSeatPairs = [
      [8, 9],
      [7, 8],
      [9, 10],
      [6, 7],
      [10, 11],
    ];

    for (const row of preferredRows) {
      for (const [seatA, seatB] of preferredSeatPairs) {
        const idA = `${row}-${seatA}`;
        const idB = `${row}-${seatB}`;
        const sA = seats.find((s) => s.id === idA);
        const sB = seats.find((s) => s.id === idB);

        if (sA && sB && sA.status !== 'booked' && sB.status !== 'booked') {
          soundFX.playSuccess();
          setSelectedSeatIds([idA, idB]);
          return;
        }
      }
    }

    // Fallback: any 2 available adjacent seats
    for (let i = 0; i < seats.length - 1; i++) {
      const s1 = seats[i];
      const s2 = seats[i + 1];
      if (
        s1.row === s2.row &&
        s2.number === s1.number + 1 &&
        s1.status !== 'booked' &&
        s2.status !== 'booked'
      ) {
        soundFX.playSuccess();
        setSelectedSeatIds([s1.id, s2.id]);
        return;
      }
    }
  }, [seats]);

  // Selected seats objects
  const selectedSeatObjects = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const ticketsTotalPrice = useMemo(() => {
    return selectedSeatObjects.reduce((acc, s) => acc + s.price, 0);
  }, [selectedSeatObjects]);

  // Concessions update handler
  const handleUpdateConcessionQuantity = (snackId, qty) => {
    setConcessionQuantities((prev) => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[snackId];
      } else {
        updated[snackId] = qty;
      }
      return updated;
    });
  };

  // Complete booking handler
  const handleCompleteBooking = (bookingData) => {
    setCompletedBooking(bookingData);
    setIsCheckoutOpen(false);
    setIsTicketOpen(true);
  };

  // Reset for new booking
  const handleNewBooking = () => {
    setIsTicketOpen(false);
    setSelectedSeatIds([]);
    setConcessionQuantities({});
    setPovSeatId(null);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Dynamic Background subtle glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 opacity-20 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${
            selectedMovie.accentColor || '#f59e0b'
          } 0%, transparent 65%)`,
        }}
      />

      {/* Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = soundFX.toggleSound();
          setSoundEnabled(next);
        }}
        onOpenHelp={() => setIsHelpOpen(true)}
        selectedCount={selectedSeatIds.length}
        onOpenSummary={() => setIsConcessionsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Movie Selector & Showtime Picker */}
        <section>
          <MovieSelector
            selectedMovie={selectedMovie}
            onSelectMovie={handleSelectMovie}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              soundFX.playSeatSelect();
              setSelectedDate(date);
            }}
            selectedTime={selectedTime}
            onSelectTime={handleSelectTime}
            selectedTheatre={selectedTheatre}
            onSelectTheatre={setSelectedTheatre}
          />
        </section>

        {/* View Layout Controls & Section Heading */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                <Armchair className="w-6 h-6 text-amber-400" />
                Select Your Seats in 3D
              </h2>
              <p className="text-xs text-gray-400">
                Rotate, zoom, and inspect sightlines in the real-time 3D auditorium
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-white/10 shadow-lg">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Split View (3D + 2D)
              </button>
              <button
                onClick={() => setViewMode('3d-only')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === '3d-only'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                3D Theater Only
              </button>
              <button
                onClick={() => setViewMode('2d-only')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === '2d-only'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                2D Matrix Only
              </button>
            </div>
          </div>

          {/* Interactive Cinema Hall View Area */}
          <div
            className={`grid gap-6 ${
              viewMode === 'split'
                ? 'grid-cols-1 lg:grid-cols-12'
                : 'grid-cols-1'
            }`}
          >
            {/* 3D WebGL Canvas */}
            {viewMode !== '2d-only' && (
              <div
                className={`${
                  viewMode === 'split' ? 'lg:col-span-7' : 'w-full'
                }`}
              >
                <TheaterCanvas
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  onSeatToggle={handleSeatToggle}
                  currentMovie={selectedMovie}
                  povSeatId={povSeatId}
                  onEnterPov={handleEnterPov}
                  onExitPov={handleExitPov}
                  onAutoSelectBest={handleAutoSelectBest}
                />
              </div>
            )}

            {/* 2D Interactive Seating Matrix */}
            {viewMode !== '3d-only' && (
              <div
                className={`${
                  viewMode === 'split' ? 'lg:col-span-5' : 'w-full'
                }`}
              >
                <SeatMap2D
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  onSeatToggle={handleSeatToggle}
                  onEnterPov={handleEnterPov}
                />
              </div>
            )}
          </div>
        </section>

        {/* Selected Seats Floating Checkout Sticky Footer */}
        {selectedSeatIds.length > 0 && (
          <div className="sticky bottom-6 z-30 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-amber-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg shrink-0">
                  {selectedSeatIds.length}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">
                      {selectedSeatIds.length}{' '}
                      {selectedSeatIds.length === 1 ? 'Seat' : 'Seats'} Selected
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-mono text-cyan-400">
                      {selectedMovie.title}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {selectedSeatObjects.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold"
                      >
                        {s.row}-{s.number} (${s.price})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400">
                    Tickets Subtotal
                  </div>
                  <div className="text-xl font-black text-amber-400 font-mono">
                    ${ticketsTotalPrice.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => setIsConcessionsOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Pre-order Snacks & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-slate-950/80 px-4 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-gray-300">CINEVERSE 3D CINEMAS</span>
            <span>— Next-Gen WebGL Spatial Booking Experience</span>
          </div>
          <div>
            Built with Three.js, WebGL, React & Tailwind CSS
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ConcessionsModal
        isOpen={isConcessionsOpen}
        onClose={() => setIsConcessionsOpen(false)}
        concessionQuantities={concessionQuantities}
        onUpdateQuantity={handleUpdateConcessionQuantity}
        onProceedToCheckout={() => {
          setIsConcessionsOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBackToSnacks={() => {
          setIsCheckoutOpen(false);
          setIsConcessionsOpen(true);
        }}
        selectedSeats={selectedSeatObjects}
        selectedMovie={selectedMovie}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        concessionQuantities={concessionQuantities}
        onCompleteBooking={handleCompleteBooking}
      />

      <TicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        bookingDetails={completedBooking}
        onNewBooking={handleNewBooking}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
