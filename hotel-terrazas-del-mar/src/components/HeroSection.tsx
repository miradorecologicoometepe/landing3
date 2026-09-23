import React from 'react';
import { HotelConfig } from '../types';
import { ArrowRight, BedDouble, ChevronDown, Leaf, MapPin, Users } from 'lucide-react';

interface HeroSectionProps {
  onExploreRooms: () => void;
  onOpenGallery: () => void;
  onOpenBookingModal: () => void;
  hotelConfig: HotelConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreRooms, onOpenGallery, onOpenBookingModal, hotelConfig }) => (
  <section className="relative isolate min-h-[88svh] lg:min-h-screen overflow-hidden bg-[#12363d] text-white flex items-center">
    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85" alt="Imagen ilustrativa de un paisaje junto al agua; fotografía real del hotel pendiente" className="absolute inset-0 -z-20 h-full w-full object-cover" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#092d36]/95 via-[#123940]/75 to-[#123940]/25" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#092d36]/65 via-transparent to-[#092d36]/35" />
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-36 pb-28 sm:pt-44 sm:pb-36">
      <div className="max-w-3xl">
        <p className="text-xs sm:text-sm tracking-[0.32em] uppercase font-semibold text-[#fff0ae] mb-7">Hotel Mirador Ecológico · Ometepe</p>
        <h1 className="font-serif text-[clamp(2.8rem,6.3vw,6rem)] leading-[1.08] tracking-tight font-medium max-w-3xl mb-8">Donde la <em className="text-[#fff0ae]">naturaleza</em> se abraza con el lago y los volcanes</h1>
        <p className="text-base sm:text-xl leading-relaxed text-stone-100/95 max-w-2xl mb-10">Descubre nuestras habitaciones, espacios para eventos y el entorno natural de la Isla de Ometepe. Consulta disponibilidad y tarifas directamente con nosotros.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-6 max-w-2xl mb-12 text-sm">
          <div className="flex flex-col gap-2"><Leaf className="w-6 h-6 text-[#fff0ae]" /><span>Naturaleza y descanso</span></div>
          <div className="flex flex-col gap-2"><BedDouble className="w-6 h-6 text-[#fff0ae]" /><span>Habitaciones</span></div>
          <div className="flex flex-col gap-2"><Users className="w-6 h-6 text-[#fff0ae]" /><span>Eventos especiales</span></div>
          <div className="flex flex-col gap-2"><MapPin className="w-6 h-6 text-[#fff0ae]" /><span>Isla de Ometepe</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-5 sm:gap-8">
          <button onClick={onExploreRooms} className="rounded-full bg-[#ffe997] hover:bg-[#fff2b8] text-[#18363a] px-8 py-4 font-bold inline-flex items-center gap-3 shadow-lg transition-colors">Ver habitaciones <ArrowRight className="w-5 h-5" /></button>
          <button onClick={onOpenGallery} className="text-white font-semibold border-b border-white/70 pb-1 hover:text-[#ffe997] transition-colors">Explorar fotografías <ArrowRight className="inline w-4 h-4 ml-2" /></button>
        </div>
      </div>
    </div>
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-xs tracking-widest uppercase text-white/80"><ChevronDown className="w-5 h-5" />Desplaza para explorar</div>
  </section>
);
