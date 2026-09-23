import React from 'react';
import { HotelConfig } from '../types';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  onOpenBookingModal: () => void;
  hotelConfig: HotelConfig;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  onOpenBookingModal,
  hotelConfig,
}) => {

  return (
    <>
      {/* Desktop & Tablet Floating Widget */}
      <div 
        id="floating-whatsapp-widget" 
        className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2 animate-in fade-in"
      >
        {/* Discreet direct contact */}}
        <a
          id="btn-floating-whatsapp-direct"
          href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, deseo consultar disponibilidad y tarifas.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center justify-center shadow-xl shadow-emerald-900/30 hover:scale-105 transition-all group relative cursor-pointer"
          title="Abrir WhatsApp con el hotel"
        >
          <MessageCircle className="w-7 h-7 fill-white" />
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar (OTA Style) */}
      <div 
        id="mobile-sticky-booking-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3"
      >
        <div>
          <div className="text-[10px] uppercase font-bold text-stone-500">
            Consulta disponibilidad
          </div>
          <p className="text-sm font-semibold text-[#18363a]">Reserva directamente</p>
        </div>

        <button
          id="btn-mobile-sticky-reserve"
          onClick={onOpenBookingModal}
          className="flex-1 max-w-[190px] py-2.5 px-4 rounded-xl bg-[#387378] hover:bg-[#2c5b5f] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Consultar WhatsApp</span>
        </button>
      </div>
    </>
  );
};
