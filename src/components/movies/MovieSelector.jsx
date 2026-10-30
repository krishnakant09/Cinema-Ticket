import React from 'react';
import { Star, Clock, Film } from 'lucide-react';
import { MOVIES, SHOW_DATES, SHOW_TIMES } from '../../data/cinemaData';

export default function MovieSelector({
  selectedMovie,
  onSelectMovie,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}) {
  return (
    <div className="space-y-6">
      {/* Movie Selection Shelf */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            Select Feature Film
          </h2>
          <span className="text-xs text-amber-400/80 font-mono">
            {MOVIES.length} Movies Showing
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOVIES.map((movie) => {
            const isSelected = selectedMovie.id === movie.id;
            return (
              <button
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-500/20 scale-[1.02]'
                    : 'border-white/10 hover:border-white/30 hover:scale-[1.01] opacity-75 hover:opacity-100'
                }`}
              >
                {/* Poster Image */}
                <div className="aspect-[2/3] w-full overflow-hidden relative bg-slate-900">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {movie.imdb}
                  </div>

                  {/* Formats Tag */}
                  <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-mono font-bold text-cyan-300">
                    {movie.formats[0].split(' ')[0]}
                  </div>

                  {/* Bottom Movie Details on Poster */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <h3 className="font-bold text-white text-sm leading-tight truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-mono">
                      <span>{movie.duration}</span>
                      <span>•</span>
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Movie Spotlight Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xl font-extrabold text-white tracking-wide">
              {selectedMovie.title}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-xs font-semibold">
              {selectedMovie.rating}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" /> {selectedMovie.imdb}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> {selectedMovie.duration}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 max-w-3xl">
            {selectedMovie.synopsis}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedMovie.genre.map((g) => (
              <span
                key={g}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Formats available */}
        <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
            Experience Format
          </span>
          <div className="flex items-center gap-1.5">
            {selectedMovie.formats.map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Date & Showtime Strip */}
      <div className="space-y-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SHOW_DATES.map((d) => {
            const isSelected = selectedDate.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDate(d)}
                className={`px-4 py-2 rounded-xl border text-center transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/80 border-white/10 text-gray-300 hover:border-white/30 hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  {d.dayName}
                </div>
                <div className="text-sm font-semibold">{d.dateStr}</div>
              </button>
            );
          })}
        </div>

        {/* Showtime Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {SHOW_TIMES.map((t) => {
            const isSelected = selectedTime.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTime(t)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-white/10 text-gray-300 hover:border-white/30 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-sm text-cyan-300">
                    {t.time}
                  </span>
                  {t.priceMultiplier > 1 && (
                    <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20 text-amber-300">
                      Peak
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 truncate">{t.type}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
