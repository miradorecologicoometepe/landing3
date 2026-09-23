import React from 'react';
import { Room, HotelConfig } from '../types';
import { 
  Bed, 
  Users, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';

interface RoomsPageProps {
  rooms: Room[];
  hotelConfig: HotelConfig;
  onSelectRoomForDetails: (room: Room) => void;
  onBookRoomViaWhatsApp: (roomId: string) => void;
  onOpenGeneralBookingModal: () => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({
  rooms,
  hotelConfig,
  onSelectRoomForDetails,
  onBookRoomViaWhatsApp,
  onOpenGeneralBookingModal
}) => {
  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-24 bg-[#f5fbfa] min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#075e68] via-[#078b91] to-[#0ca5a0] text-white pt-20 pb-20 sm:pt-24 sm:pb-24 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-200 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-300/30">
            <Bed className="w-3.5 h-3.5" />
            Descubre nuestras habitaciones
          </div>
          
          <h1 className="font-gidole text-3xl min-[375px]:text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-white">
            Nuestras Habitaciones
          </h1>
          
          <p className="text-teal-100/90 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Alojamiento campestre cómodo, fresco y tranquilo en Altagracia, Ometepe. Contamos con 2 tipos de habitaciones diseñadas para parejas, familias y grupos pequeños.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 relative z-10">
        
        {/* Transparent Rates Notice */}
        <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-200">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Consulta directa de disponibilidad</h4>
              <p className="text-xs text-stone-500">
                Consulta las tarifas y fechas disponibles directamente con nuestro equipo por WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGeneralBookingModal}
            className="px-5 py-2.5 rounded-full bg-[#089b9c] hover:bg-[#087f83] text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cotizar Fechas</span>
          </button>
        </div>

        {/* Rooms Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {rooms.map((room) => {
            const isFamilyRoom = room.id === 'habitacion-familiar-vistas-lago';

            return (
              <div
                key={room.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Showcase */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                    <img
                      src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold">
                        {room.badge || room.type}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow">
                        Máx. {room.maxOccupancy} personas
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
                      {room.images.length} fotos
                    </div>
                  </div>

                  {/* Room Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                        {room.type}
                      </div>
                      <h3 className="font-gidole text-2xl font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        {room.tagline}
                      </p>
                    </div>

                    {/* Beds & Capacity */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5 text-xs text-stone-700">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="font-semibold text-stone-900">Camas: {room.bedType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="font-semibold text-stone-900">
                          Capacidad máxima: {room.maxOccupancy} personas
                        </span>
                      </div>

                      {/* Pricing Tier Details */}
                      {isFamilyRoom ? (
                        <div className="mt-2 pt-2 border-t border-stone-200 space-y-1">
                          <div className="text-[11px] font-bold text-stone-800">Tarifas por número de personas:</div>
                          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-950">
                              <div className="text-[10px] text-teal-700 font-bold uppercase">1 a 3 personas</div>
                              <div className="font-black text-base">$70 <span className="text-[10px] font-normal">USD / noche</span></div>
                            </div>
                            <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-950">
                              <div className="text-[10px] text-teal-700 font-bold uppercase">4 personas</div>
                              <div className="font-black text-base">$90 <span className="text-[10px] font-normal">USD / noche</span></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between">
                          <span className="text-stone-600">Tarifa fija directa:</span>
                          <span className="font-bold text-teal-800 text-sm">$60 USD / noche</span>
                        </div>
                      )}
                    </div>

                    {/* Amenities Checklist */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Amenidades Incluidas
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                        {room.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between gap-3 mt-4">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-stone-900">
                        ${room.pricePerNight}
                      </span>
                      {isFamilyRoom && <span className="text-base font-bold text-stone-600">- $90</span>}
                      <span className="text-xs text-stone-500">USD / noche</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectRoomForDetails(room)}
                      className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      Detalles
                    </button>
                    <button
                      onClick={() => onBookRoomViaWhatsApp(room.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Reservar</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Assistance Box */}
        <div className="bg-stone-100 rounded-2xl p-6 text-center space-y-3">
          <h4 className="font-bold text-stone-800 text-base">¿Deseas una consulta personalizada o viajar con un grupo mayor?</h4>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Escríbenos directamente por WhatsApp al <strong className="text-teal-800">{hotelConfig.displayPhone}</strong> y con gusto te asistiremos con la asignación de habitaciones y cotización a medida.
          </p>
          <a
            href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, quisiera hacer una consulta sobre la disponibilidad de habitaciones.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Consultar Disponibilidad por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
