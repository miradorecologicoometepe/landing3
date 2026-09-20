import React from 'react';
import { HotelConfig } from '../types';
import { 
  Sparkles, 
  MapPin, 
  Star, 
  Compass, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { HotelLogo } from './HotelLogo';

interface HeroSectionProps {
  onExploreRooms: () => void;
  onOpenGallery: () => void;
  onOpenBookingModal: () => void;
  hotelConfig: HotelConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreRooms,
  onOpenGallery,
  onOpenBookingModal,
  hotelConfig,
}) => {
  return (
    <div className="relative">
      {/* Visual Canvas with Panoramic View of the Eco-lodge & Volcano/Lake */}
      <div className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#122426]">
        
        {/* Background Image matching brand board photo: lush nature, pool, panoramic lake & volcano */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90"
            alt={`${hotelConfig.name} - Vista Panorámica al Lago Cocibolca y Volcanes`}
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Subtle gradient vignette tailored to brand teal & deep forest */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1e20] via-[#152e31]/75 to-[#0b1719]/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 sm:pt-36 pb-28 sm:pb-32">
          
          {/* Brand Board Primary Logo Highlight */}
          <div className="mb-6 flex justify-center transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-4 sm:p-5 rounded-3xl bg-[#142d30]/70 backdrop-blur-md border border-brand-mint/30 shadow-2xl">
              <HotelLogo variant="full" mode="white" size="lg" />
            </div>
          </div>

          {/* Top Pill / Rating Proof */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18363a]/90 backdrop-blur-md border border-brand-sky/40 text-stone-200 text-xs sm:text-sm mb-6 shadow-xl">
            <span className="flex text-brand-sun">
              {Array.from({ length: hotelConfig.stars || 4 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-sun text-brand-sun" />
              ))}
            </span>
            <span className="font-bold text-white">{hotelConfig.ratingScore} / 10 Excepcional</span>
            <span className="text-[#80CEDE]">•</span>
            <span className="text-brand-sun font-semibold">Isla de Ometepe, Nicaragua</span>
          </div>

          {/* Main Title */}
          <h1 className="font-gidole text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-tight sm:leading-tight mb-5">
            Donde la naturaleza se abraza con el lago y los volcanes
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-stone-200 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
            Habitaciones con vista al Lago Cocibolca y a los volcanes, piscina panorámica y local para eventos en Altagracia. 
            Reserva con <span className="text-teal-300 font-bold">tarifa directa garantizada</span> vía WhatsApp sin comisiones de intermediarios.
          </p>

          {/* Action CTAs using Turquoise Accents */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <button
              id="hero-book-now-cta"
              onClick={onOpenBookingModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] active:bg-[#115e59] text-white font-bold text-sm sm:text-base tracking-wider shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer border border-teal-300/40"
            >
              <Sparkles className="w-5 h-5 text-teal-200" />
              <span>Cotizar con Tarifa Directa</span>
            </button>

            <button
              id="hero-explore-suites-cta"
              onClick={onExploreRooms}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0e3d42]/90 hover:bg-[#134e54] text-white font-semibold text-sm sm:text-base border border-teal-400/40 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ver Habitaciones</span>
            </button>

            <button
              id="hero-gallery-cta"
              onClick={onOpenGallery}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-stone-200 font-medium text-sm sm:text-base border border-stone-400/40 backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-teal-300" />
              <span>Ver Fotos</span>
            </button>
          </div>

          {/* Guarantees Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-[#294f54]/80 text-left">
            <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-sky shrink-0" />
              <span>Mejor tarifa garantizada</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-sky shrink-0" />
              <span>Cancelación flexible</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-sky shrink-0" />
              <span>Desayuno campestre diario</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-sky shrink-0" />
              <span>Concierge WhatsApp 24/7</span>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-brand-mint hidden lg:flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[10px] tracking-widest uppercase font-semibold">Explorar el Mirador</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>

      </div>
    </div>
  );
};
