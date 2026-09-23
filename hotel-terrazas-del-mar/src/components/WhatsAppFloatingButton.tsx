import React, { useState } from 'react';
import { HotelConfig } from '../types';
import { MessageCircle, X, Sparkles, Calendar } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  onOpenBookingModal: () => void;
  hotelConfig: HotelConfig;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  onOpenBookingModal,
  hotelConfig,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Desktop & Tablet Floating Widget */}
      <div 
        id="floating-whatsapp-widget" 
        className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2 animate-in fade-in"
      >
        {/* Tooltip bubble */}
        {showTooltip && (
          <div className="bg-white rounded-2xl p-3.5 shadow-2xl border border-stone-200 text-stone-800 max-w-xs relative text-xs flex items-start gap-2.5">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-stone-400 hover:text-stone-700"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="pr-4">
              <div className="font-bold text-stone-900 mb-0.5">
                ¿Deseas cotizar tu estancia?
              </div>
              <p className="text-stone-600 text-[11px] leading-snug">
                Chatea con nuestro concierge en WhatsApp y obtén <strong className="text-emerald-700">información sobre disponibilidad y tarifas</strong>.
              </p>
              <button
                onClick={onOpenBookingModal}
                className="mt-2 text-emerald-700 hover:text-emerald-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>Cotizar ahora</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Big Pulsing WhatsApp Action Button */}
        <a
          id="btn-floating-whatsapp-direct"
          href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, deseo consultar disponibilidad y tarifas exclusivas.`)}`}
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
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#18363a]">Consultar tarifa</span>
            <span className="text-[10px] text-stone-500 font-medium">USD / noche</span>
          </div>
        </div>

        <button
          id="btn-mobile-sticky-reserve"
          onClick={onOpenBookingModal}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#387378] hover:bg-[#2c5b5f] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Consultar WhatsApp</span>
        </button>
      </div>
    </>
  );
};
