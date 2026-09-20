import React, { useState } from 'react';
import { Room, HotelConfig } from '../types';
import { 
  Users, 
  Maximize, 
  Bed, 
  Sparkles, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface RoomsSectionProps {
  rooms: Room[];
  hotelConfig: HotelConfig;
  onSelectRoomForDetails: (room: Room) => void;
  onBookRoomViaWhatsApp: (roomId: string) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  hotelConfig,
  onSelectRoomForDetails,
  onBookRoomViaWhatsApp,
}) => {
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  const handleNextImage = (roomId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % max
    }));
  };

  const handlePrevImage = (roomId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + max) % max
    }));
  };

  return (
    <section id="habitaciones" className="py-16 sm:py-20 bg-[#f8fbfb] border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C2ECE5]/70 text-[#193d40] text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3 h-3 text-[#387378]" />
            Alojamiento en Ometepe
          </div>
          <h2 className="font-gidole text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-extrabold tracking-tight mb-2.5">
            Nuestros Tipos de Habitación
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Comodidad campestre frente al lago y los volcanes, con aire acondicionado, baño privado y 15% de ahorro directo por WhatsApp.
          </p>
        </div>

        {/* Proportional 2-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {rooms.map((room) => {
            const currentImgIndex = activeImageIndexes[room.id] || 0;
            const totalCapacity = room.capacity.adults + room.capacity.children;

            return (
              <div
                key={room.id}
                id={`room-card-${room.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-200/90 flex flex-col group"
              >
                {/* Image Carousel Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={room.images[currentImgIndex]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => onSelectRoomForDetails(room)}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    {room.badge ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-terracotta/95 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {room.badge}
                      </span>
                    ) : <span />}

                    <span className="px-2 py-0.5 rounded-full bg-[#142d30]/90 backdrop-blur-sm text-brand-sun text-[10px] font-bold shadow-sm flex items-center gap-1 border border-brand-mint/30">
                      <Sparkles className="w-2.5 h-2.5 text-brand-sun" />
                      15% OFF Directo
                    </span>
                  </div>

                  {/* Carousel navigation arrows */}
                  {room.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevImage(room.id, room.images.length, e)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNextImage(room.id, room.images.length, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        aria-label="Siguiente foto"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-medium backdrop-blur-sm pointer-events-none">
                        {currentImgIndex + 1}/{room.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Compact Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-terracotta">
                        {room.type}
                      </span>
                      <h3 
                        onClick={() => onSelectRoomForDetails(room)}
                        className="font-gidole text-xl font-bold text-stone-900 group-hover:text-brand-teal transition-colors cursor-pointer line-clamp-1"
                      >
                        {room.name}
                      </h3>
                    </div>

                    <p className="text-stone-500 text-xs line-clamp-2 mb-3">
                      {room.tagline}
                    </p>

                    {/* Official Bed & Capacity Specs (matching Booking.com and user rules) */}
                    <div className="space-y-2 py-3 border-y border-stone-100 mb-3 text-xs text-stone-700">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-brand-teal shrink-0" />
                        <span className="font-semibold text-stone-800">{room.bedType}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-brand-teal shrink-0" />
                          <span className="font-bold text-stone-900">
                            Capacidad máxima: {room.maxOccupancy} personas
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          Máx. {room.maxOccupancy} pax
                        </span>
                      </div>

                      {/* Pricing Tier Breakdown for Family Room */}
                      {room.id === 'habitacion-familiar-vistas-lago' && (
                        <div className="mt-1 p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
                          <span>Tarifas por personas:</span>
                          <span className="font-bold">3 pers: $70 • 4 pers: $90 USD</span>
                        </div>
                      )}
                      {room.id === 'habitacion-2-camas-grandes' && (
                        <div className="mt-1 p-2 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-700 flex items-center justify-between">
                          <span>Tarifa fija directa:</span>
                          <span className="font-bold text-brand-teal">$60 USD / noche</span>
                        </div>
                      )}
                    </div>

                    {/* Minimal Highlights */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-100/80 text-stone-600 font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <button 
                          type="button"
                          onClick={() => onSelectRoomForDetails(room)}
                          className="text-[10px] px-1.5 py-0.5 text-brand-teal font-semibold hover:underline cursor-pointer"
                        >
                          +{room.amenities.length - 3} más
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Compact Pricing & Action Row */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-stone-400 line-through">
                        OTA: ${room.originalPrice} USD
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#142d30]">
                          ${room.pricePerNight}
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {room.id === 'habitacion-familiar-vistas-lago' ? 'USD/noche (1-3p)' : 'USD/noche'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-details-${room.id}`}
                        onClick={() => onSelectRoomForDetails(room)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 text-xs font-semibold transition-colors cursor-pointer"
                        title="Ver detalles completos"
                      >
                        Detalles
                      </button>

                      <button
                        id={`btn-book-whatsapp-${room.id}`}
                        onClick={() => onBookRoomViaWhatsApp(room.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] active:bg-[#115e59] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Reservar directamente por WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Reservar</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Direct Booking Perks Bar */}
        <div className="mt-10 py-3.5 px-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
            <span className="font-semibold text-stone-800">Reserva Directa por WhatsApp:</span>
            <span>15% de descuento garantizado • Sin comisiones de OTA</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmación instantánea con el anfitrión</span>
          </div>
        </div>

      </div>
    </section>
  );
};
