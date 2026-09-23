import React, { useState, useEffect } from 'react';
import { Room, BookingReservation, HotelConfig } from '../types';
import { ROOMS_DATA, ADDON_PRICING, HOTEL_CONFIG } from '../data/hotelData';
import { 
  calculateNights, 
  calculateQuote, 
  generateWhatsAppMessage, 
  buildWhatsAppLink, 
  formatDisplayDate 
} from '../utils/bookingUtils';
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Bed, 
  ExternalLink,
  Settings,
  ChevronRight,
  Info,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
  hotelConfig: HotelConfig;
  onUpdateHotelConfig?: (config: HotelConfig) => void;
  rooms?: Room[];
}

export const WhatsAppBookingModal: React.FC<WhatsAppBookingModalProps> = ({
  isOpen,
  onClose,
  initialRoomId,
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
  hotelConfig,
  onUpdateHotelConfig,
  rooms = ROOMS_DATA,
}) => {
  if (!isOpen) return null;

  // Selected room
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    initialRoomId || (rooms[0] ? rooms[0].id : ROOMS_DATA[0].id)
  );

  // Reservation details
  const [reservation, setReservation] = useState<BookingReservation>({
    checkIn: initialCheckIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    checkOut: initialCheckOut || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    adults: initialAdults || 2,
    children: initialChildren || 0,
    roomTypeId: initialRoomId || (rooms[0] ? rooms[0].id : ROOMS_DATA[0].id),
    roomsCount: 1,
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    specialRequests: '',
    addons: {
      breakfast: true, // by default true for direct web benefit
      airportTransfer: false,
      romanticPackage: false,
      lateCheckout: false,
    },
  });

  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPhoneConfig, setShowPhoneConfig] = useState(false);
  const [customPhone, setCustomPhone] = useState(hotelConfig.whatsAppNumber);

  // Keep room in sync if initialRoomId changes
  useEffect(() => {
    if (initialRoomId) {
      setSelectedRoomId(initialRoomId);
      setReservation((prev) => ({ ...prev, roomTypeId: initialRoomId }));
    }
  }, [initialRoomId]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0] || ROOMS_DATA[0];
  const quote = calculateQuote(reservation, selectedRoom);
  const generatedMessage = generateWhatsAppMessage(reservation, selectedRoom, hotelConfig);
  const whatsAppLink = buildWhatsAppLink(hotelConfig.whatsAppNumber, generatedMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateHotelConfig && customPhone.trim()) {
      onUpdateHotelConfig({
        ...hotelConfig,
        whatsAppNumber: customPhone.replace(/[^0-9]/g, ''),
        displayPhone: customPhone,
      });
    }
    setShowPhoneConfig(false);
  };

  return (
    <div 
      id="whatsapp-booking-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="whatsapp-booking-modal-container"
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 my-auto text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#18363a] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C2ECE5]/20 border border-brand-mint/40 flex items-center justify-center text-brand-mint shrink-0">
              <MessageCircle className="w-5 h-5 fill-brand-mint" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-gidole font-extrabold text-lg sm:text-xl text-white">
                  Motor de Reserva Directa por WhatsApp
                </h3>
              </div>
              <p className="text-xs text-[#C2ECE5]/80">
                Atención personalizada en {hotelConfig.name} • Ometepe, Nicaragua
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-toggle-phone-config"
              onClick={() => setShowPhoneConfig(!showPhoneConfig)}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-xs flex items-center gap-1"
              title="Configurar número de WhatsApp de destino"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Configurar Teléfono</span>
            </button>
            <button
              id="btn-close-booking-modal"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              aria-label="Cerrar modal de reserva"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Optional phone config drawer */}
        {showPhoneConfig && (
          <form onSubmit={handleSavePhone} className="bg-stone-800 text-white p-4 border-b border-stone-700 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-stone-300">Número de WhatsApp del Hotel (con código de país):</span>
            <input
              type="text"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              className="bg-stone-900 border border-stone-600 rounded px-3 py-1.5 text-white font-mono text-xs focus:ring-1 focus:ring-emerald-500"
              placeholder="Ej: 5219842508899"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500"
            >
              Guardar Número
            </button>
            <span className="text-stone-400 text-[11px]">
              (Actual: {hotelConfig.displayPhone})
            </span>
          </form>
        )}

        {/* Modal Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
          
          {/* Left Column: Booking Form Controls (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-6">
            
            {/* 1. Room Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-teal-600" />
                1. Selecciona tu Habitación
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {rooms.map((room) => {
                  const isSelected = room.id === selectedRoomId;
                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setReservation((prev) => ({ ...prev, roomTypeId: room.id }));
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#387378] bg-[#C2ECE5]/30 shadow-sm' 
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      <img
                        src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                        alt={room.name}
                        className="w-16 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {room.name}
                        </div>
                        <div className="text-[11px] text-stone-600 font-medium">
                          {room.id === 'habitacion-familiar-vistas-lago' 
                            ? '3p: $70 • 4p: $90 USD' 
                            : '$60 USD / noche'}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <span>Máx. {room.maxOccupancy} personas</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Dates & Occupancy */}
            <div className="space-y-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Check-in */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Llegada (Check-in)
                  </label>
                  <input
                    type="date"
                    value={reservation.checkIn}
                    onChange={(e) => setReservation({ ...reservation, checkIn: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm font-semibold text-stone-800"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Salida ({quote.nights} {quote.nights === 1 ? 'noche' : 'noches'})
                  </label>
                  <input
                    type="date"
                    value={reservation.checkOut}
                    onChange={(e) => setReservation({ ...reservation, checkOut: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm font-semibold text-stone-800"
                  />
                </div>
              </div>

              {/* Adults & Children */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Adultos
                  </label>
                  <select
                    value={reservation.adults}
                    onChange={(e) => setReservation({ ...reservation, adults: parseInt(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Adulto' : 'Adultos'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Niños
                  </label>
                  <select
                    value={reservation.children}
                    onChange={(e) => setReservation({ ...reservation, children: parseInt(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {[0, 1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Niño' : 'Niños'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Habitaciones
                  </label>
                  <select
                    value={reservation.roomsCount}
                    onChange={(e) => setReservation({ ...reservation, roomsCount: parseInt(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Habitación' : 'Habitaciones'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Capacity Status & Dynamic Rate Applied */}
              <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Users className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Total: <strong>{reservation.adults + reservation.children} huéspedes</strong> (Máx. permitido: {selectedRoom.maxOccupancy})</span>
                </div>
                
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                  {quote.rateLabel}
                </span>
              </div>

              {/* Over-capacity Warning */}
              {(reservation.adults + reservation.children) > (selectedRoom.maxOccupancy || 4) && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Has seleccionado <strong>{reservation.adults + reservation.children} personas</strong>. La capacidad máxima de esta habitación es de <strong>{selectedRoom.maxOccupancy} personas</strong>. Por favor ajusta los huéspedes o reserva 2 habitaciones.
                  </span>
                </div>
              )}
            </div>

            {/* 3. Addon Services */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                2. Servicios & Experiencias Opcionales
              </label>
              <div className="space-y-2">
                
                {/* Breakfast */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reservation.addons.breakfast}
                      onChange={(e) => setReservation({
                        ...reservation,
                        addons: { ...reservation.addons, breakfast: e.target.checked }
                      })}
                      className="w-4 h-4 text-brand-teal rounded focus:ring-brand-teal"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        {ADDON_PRICING.breakfast.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Desayuno típico nicaragüense, frutas tropicales frescas y café orgánico de Ometepe
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-terracotta shrink-0">
                    +${ADDON_PRICING.breakfast.price} USD / pax
                  </span>
                </label>

                {/* VIP Ferry / Island Transfer */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reservation.addons.airportTransfer}
                      onChange={(e) => setReservation({
                        ...reservation,
                        addons: { ...reservation.addons, airportTransfer: e.target.checked }
                      })}
                      className="w-4 h-4 text-brand-teal rounded focus:ring-brand-teal"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        {ADDON_PRICING.airportTransfer.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Recepción privada en puerto Moyogalpa / San José y traslado hasta el mirador
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-terracotta shrink-0">
                    +${ADDON_PRICING.airportTransfer.price} USD
                  </span>
                </label>

                {/* Romantic Package */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reservation.addons.romanticPackage}
                      onChange={(e) => setReservation({
                        ...reservation,
                        addons: { ...reservation.addons, romanticPackage: e.target.checked }
                      })}
                      className="w-4 h-4 text-brand-teal rounded focus:ring-brand-teal"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        {ADDON_PRICING.romanticPackage.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Decoración especial con flores locales, botella de vino y vista al atardecer
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-terracotta shrink-0">
                    +${ADDON_PRICING.romanticPackage.price} USD
                  </span>
                </label>

                {/* Late Check-out */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reservation.addons.lateCheckout}
                      onChange={(e) => setReservation({
                        ...reservation,
                        addons: { ...reservation.addons, lateCheckout: e.target.checked }
                      })}
                      className="w-4 h-4 text-brand-teal rounded focus:ring-brand-teal"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        {ADDON_PRICING.lateCheckout.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Disfruta de tu habitación, piscina y mirador hasta la tarde antes de tu ferry
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-terracotta shrink-0">
                    +${ADDON_PRICING.lateCheckout.price} USD
                  </span>
                </label>

              </div>
            </div>

            {/* 4. Guest Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-teal" />
                3. Datos del Huésped Titular (Opcional)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre y Apellido"
                  value={reservation.guestName}
                  onChange={(e) => setReservation({ ...reservation, guestName: e.target.value })}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="tel"
                  placeholder="Teléfono / WhatsApp (ej. +54 9 11...)"
                  value={reservation.guestPhone}
                  onChange={(e) => setReservation({ ...reservation, guestPhone: e.target.value })}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <textarea
                placeholder="Peticiones especiales (ej. cama matrimonial, cuna para bebé, horario estimado de check-in, restricciones dietéticas...)"
                value={reservation.specialRequests}
                onChange={(e) => setReservation({ ...reservation, specialRequests: e.target.value })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

          </div>

          {/* Right Column: Price Quote & Live WhatsApp Message Preview (5 cols) */}
          <div className="lg:col-span-5 bg-stone-50/70 p-6 flex flex-col justify-between space-y-6">
            
            {/* Real-Time Price Breakdown Card */}
            <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Cotización de Estancia
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Cotización estimada
                </span>
              </div>

              <div className="text-xs space-y-2 text-stone-600">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-stone-800">{selectedRoom.name}</div>
                    <div className="text-[11px] text-brand-teal font-semibold">
                      ${quote.basePricePerNight} USD × {quote.nights} {quote.nights === 1 ? 'noche' : 'noches'} • {quote.rateLabel}
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    ${quote.basePricePerNight * quote.nights * reservation.roomsCount} USD
                  </span>
                </div>


                {quote.addonsList.map((addon, i) => (
                  <div key={i} className="flex justify-between text-stone-700 text-[11px]">
                    <span>{addon.name}</span>
                    <span className="font-medium">+${addon.cost} USD</span>
                  </div>
                ))}

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <div>
                    <div className="text-xs text-stone-500 font-medium">Total Estimado</div>
                    <div className="text-[10px] text-stone-400">Tarifa sujeta a confirmación del establecimiento</div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-stone-900">
                      ${quote.total}
                    </span>
                    <span className="text-xs font-bold text-stone-600 ml-1">USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live WhatsApp Message Preview Card */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Mensaje que se enviará por WhatsApp
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-stone-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Chat bubble representation */}
              <div className="bg-[#EFEAE2] p-3 rounded-xl border border-stone-300 font-sans text-xs text-stone-800 shadow-inner max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                <div className="bg-white p-3 rounded-lg shadow-xs text-stone-800 border-l-4 border-emerald-600">
                  {generatedMessage}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                id="btn-send-whatsapp-reservation"
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                <span>Enviar Reserva por WhatsApp Ahora</span>
              </a>

              <div className="flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="flex-1 py-2 px-3 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-stone-600" />
                  <span>Código QR para Móvil</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 py-2 px-3 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
                  <span>{copied ? 'Copiado al portapapeles' : 'Copiar Texto'}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Reserva segura sin ingresar tarjetas de crédito hasta confirmar con el hotel
              </p>
            </div>

          </div>

        </div>

        {/* Modal QR Code Dialog for Mobile Scanners */}
        {showQrModal && (
          <div 
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setShowQrModal(false)}
          >
            <div 
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-stone-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-serif-heading font-bold text-stone-900 text-base">
                  Escanea para Enviar por WhatsApp
                </h4>
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-stone-600">
                Abre la cámara de tu teléfono móvil o el escáner de WhatsApp para iniciar la conversación con tu solicitud lista:
              </p>

              {/* High-Contrast QR Code */}
              <div className="p-4 bg-stone-50 rounded-xl inline-block border border-stone-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(whatsAppLink)}`}
                  alt="Código QR WhatsApp Reserva"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="text-[11px] text-stone-500">
                Número de destino: <strong className="text-stone-800">{hotelConfig.displayPhone}</strong>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
