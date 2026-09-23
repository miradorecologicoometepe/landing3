import React, { useState } from 'react';
import { Room } from '../types';
import { calculateNights, formatDisplayDate } from '../utils/bookingUtils';
import { 
  Calendar, 
  Users, 
  Bed, 
  Search, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  Clock 
} from 'lucide-react';

interface BookingBarProps {
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenCount: number;
  selectedRoomId: string;
  rooms: Room[];
  onUpdateDates: (checkIn: string, checkOut: string) => void;
  onUpdateGuests: (adults: number, children: number) => void;
  onUpdateRoom: (roomId: string) => void;
  onSubmitSearch: () => void;
}

export const BookingBar: React.FC<BookingBarProps> = ({
  checkIn,
  checkOut,
  adults,
  childrenCount,
  selectedRoomId,
  rooms,
  onUpdateDates,
  onUpdateGuests,
  onUpdateRoom,
  onSubmitSearch,
}) => {
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const nights = calculateNights(checkIn, checkOut);

  // Minimum check-in is today
  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIn = e.target.value;
    if (newIn >= checkOut) {
      // push checkOut 1 day ahead
      const d = new Date(newIn);
      d.setDate(d.getDate() + 2);
      onUpdateDates(newIn, d.toISOString().split('T')[0]);
    } else {
      onUpdateDates(newIn, checkOut);
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOut = e.target.value;
    if (newOut <= checkIn) {
      const d = new Date(newOut);
      d.setDate(d.getDate() - 1);
      onUpdateDates(d.toISOString().split('T')[0], newOut);
    } else {
      onUpdateDates(checkIn, newOut);
    }
  };

  return (
    <div id="ota-search-booking-bar" className="w-full max-w-6xl mx-auto -mt-16 sm:-mt-20 relative z-30 px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-black/10 border border-stone-200/90 p-4 sm:p-5 lg:p-6 backdrop-blur-md">
        
        {/* Banner above search fields */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-stone-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Consulta disponibilidad y organiza tu estancia</span>
          </div>
          <div className="flex items-center gap-3 text-stone-500 text-xs">
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-700 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Consulta directa por WhatsApp
            </span>
          </div>
        </div>

        {/* 4-column OTA booking grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          
          {/* 1. Check-In & Check-Out */}
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FAFDFB] border border-stone-200 hover:border-brand-teal transition-colors">
            <label htmlFor="booking-checkin-date" className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-teal" />
              Llegada (Check-in)
            </label>
            <input
              id="booking-checkin-date"
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={handleCheckInChange}
              className="bg-transparent text-sm font-semibold text-stone-800 focus:outline-none cursor-pointer w-full"
            />
            <span className="text-[11px] text-stone-500 truncate">
              {formatDisplayDate(checkIn)}
            </span>
          </div>

          {/* 2. Check-Out */}
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FAFDFB] border border-stone-200 hover:border-brand-teal transition-colors">
            <label htmlFor="booking-checkout-date" className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-teal" />
              Salida ({nights} {nights === 1 ? 'noche' : 'noches'})
            </label>
            <input
              id="booking-checkout-date"
              type="date"
              min={checkIn}
              value={checkOut}
              onChange={handleCheckOutChange}
              className="bg-transparent text-sm font-semibold text-stone-800 focus:outline-none cursor-pointer w-full"
            />
            <span className="text-[11px] text-stone-500 truncate">
              {formatDisplayDate(checkOut)}
            </span>
          </div>

          {/* 3. Room Type Selection */}
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FAFDFB] border border-stone-200 hover:border-teal-500 transition-colors">
            <label htmlFor="booking-room-select" className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-teal-600" />
              Tipo de Habitación
            </label>
            <select
              id="booking-room-select"
              value={selectedRoomId}
              onChange={(e) => onUpdateRoom(e.target.value)}
              className="bg-transparent text-sm font-semibold text-stone-800 focus:outline-none cursor-pointer w-full py-1"
            >
              <option value="">Todas las Habitaciones ({rooms.length} disponibles)</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — ${r.pricePerNight}/noche
                </option>
              ))}
            </select>
            <span className="text-[11px] text-teal-700 font-medium truncate">
              {selectedRoomId ? 'Habitación seleccionada' : 'Comparar tarifas ecológicas'}
            </span>
          </div>

          {/* 4. Guests Selection + Trigger Button */}
          <div className="relative flex flex-col justify-between">
            <div 
              id="booking-guests-selector"
              onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
              className="flex flex-col gap-1 p-3 rounded-xl bg-[#FAFDFB] border border-stone-200 hover:border-teal-500 transition-colors cursor-pointer"
            >
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                Huéspedes
              </label>
              <div className="text-sm font-semibold text-stone-800">
                {adults} {adults === 1 ? 'Adulto' : 'Adultos'}{childrenCount > 0 ? `, ${childrenCount} ${childrenCount === 1 ? 'Niño' : 'Niños'}` : ''}
              </div>
              <span className="text-[11px] text-stone-500">
                1 Habitación • Haz clic para cambiar
              </span>
            </div>

            {/* Guests Popover Dropdown */}
            {showGuestsDropdown && (
              <div 
                id="guests-popover-menu"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 space-y-4 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-800">Adultos</div>
                    <div className="text-[11px] text-stone-400">Mayores de 13 años</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (adults > 1) onUpdateGuests(adults - 1, childrenCount);
                      }}
                      className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                      disabled={adults <= 1}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{adults}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (adults < 6) onUpdateGuests(adults + 1, childrenCount);
                      }}
                      className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                      disabled={adults >= 6}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <div>
                    <div className="text-xs font-bold text-stone-800">Niños</div>
                    <div className="text-[11px] text-stone-500">Mayores de 5 años pagan tarifa estándar</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (childrenCount > 0) onUpdateGuests(adults, childrenCount - 1);
                      }}
                      className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                      disabled={childrenCount <= 0}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (childrenCount < 4) onUpdateGuests(adults, childrenCount + 1);
                      }}
                      className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuestsDropdown(false)}
                  className="w-full py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>

        </div>

        {/* CTA Button full width bottom */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span className="font-semibold text-stone-800">Estancia seleccionada:</span> {nights} {nights === 1 ? 'noche' : 'noches'} • Check-in {formatDisplayDate(checkIn)} ➔ Check-out {formatDisplayDate(checkOut)}
          </div>

          <button
            id="bar-submit-whatsapp-btn"
            onClick={onSubmitSearch}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Consultar y Reservar por WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
