import React, { useState } from 'react';
import { Room } from '../types';
import { 
  X, 
  Check, 
  Users, 
  Maximize, 
  Eye, 
  Bed, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Coffee,
  CheckCircle2
} from 'lucide-react';

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  onSelectForBooking: (roomId: string) => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  room,
  onClose,
  onSelectForBooking,
}) => {
  if (!room) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div 
      id="room-details-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="room-details-modal-content"
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200 my-auto text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
              {room.type}
            </span>
            <h3 className="font-gidole text-xl sm:text-2xl font-extrabold text-stone-900">
              {room.name}
            </h3>
          </div>
          <button
            id="close-room-details-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            aria-label="Cerrar detalles de la habitación"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Main Room Photo Showcase */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-stone-900 shadow-inner group">
            <img
              src={room.images[activeImageIndex]}
              alt={`${room.name} foto ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors opacity-80 group-hover:opacity-100"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors opacity-80 group-hover:opacity-100"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
                  {activeImageIndex + 1} / {room.images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {room.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#387378] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Key Room Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-2">
              <Maximize className="w-5 h-5 text-brand-teal" />
              <div>
                <div className="text-[10px] uppercase text-stone-500 font-bold">Tamaño</div>
                <div className="text-sm font-bold text-stone-800">{room.sizeM2} m²</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-teal" />
              <div>
                <div className="text-[10px] uppercase text-stone-500 font-bold">Capacidad</div>
                <div className="text-sm font-bold text-stone-800">
                  Máximo {room.maxOccupancy} personas
                </div>
                <div className="text-[10px] text-stone-500">
                  {room.id === 'habitacion-familiar-vistas-lago' 
                    ? '3 pers: $70 • 4 pers: $90' 
                    : 'Tarifa fija: $60 USD'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-brand-teal" />
              <div>
                <div className="text-[10px] uppercase text-stone-500 font-bold">Cama</div>
                <div className="text-sm font-bold text-stone-800 truncate">{room.bedType}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-teal" />
              <div>
                <div className="text-[10px] uppercase text-stone-500 font-bold">Vista</div>
                <div className="text-sm font-bold text-stone-800 truncate">{room.view}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-gidole font-bold text-lg text-stone-900 mb-2">
              Descripción de la Habitación
            </h4>
            <p className="text-stone-600 leading-relaxed text-sm">
              {room.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="font-gidole font-bold text-lg text-stone-900 mb-3">
              Amenidades y Equipamiento Incluido
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm">
                  <Check className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Services */}
          <div className="p-4 rounded-xl bg-[#C2ECE5]/30 border border-brand-mint">
            <h4 className="font-bold text-sm text-brand-teal-dark flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-brand-teal" />
              Beneficios Exclusivos para esta Estancia
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {room.includedServices.map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-brand-teal-dark font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer with Pricing & WhatsApp Reservation CTA */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 line-through text-sm">
                ${room.originalPrice} USD
              </span>
              <span className="font-bold text-2xl text-stone-900">
                ${room.pricePerNight} {room.id === 'habitacion-familiar-vistas-lago' && '- $90'} <span className="text-xs font-normal text-stone-500">USD / noche</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                Reserva Directa
              </span>
            </div>
            <div className="text-[11px] text-stone-500">
              {room.id === 'habitacion-familiar-vistas-lago' 
                ? 'Tarifa: 3 personas $70 • 4 personas $90 USD/noche (Máx. 4 personas)'
                : 'Tarifa fija: $60 USD/noche (Capacidad máxima 3 personas)'}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-100 transition-colors w-1/3 sm:w-auto"
            >
              Cerrar
            </button>
            <button
              id="room-modal-reserve-whatsapp-btn"
              onClick={() => {
                onClose();
                onSelectForBooking(room.id);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Reservar por WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
