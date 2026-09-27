import React from 'react';
import { HotelConfig, PhotoItem } from '../types';
import { ArrowRight, BedDouble, ChevronDown, Leaf, MapPin, Users } from 'lucide-react';

interface HeroSectionProps {
  onExploreRooms: () => void;
  onOpenGallery: () => void;
  onOpenBookingModal: () => void;
  hotelConfig: HotelConfig;
  photos: PhotoItem[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreRooms, onOpenGallery, onOpenBookingModal, hotelConfig, photos }) => {
  const heroPhoto = hotelConfig.heroImageUrl || photos.find(photo => photo.category === 'outdoors')?.url || photos.find(photo => photo.category === 'pool')?.url || photos.find(photo => photo.url)?.url;

  return (
  <section className="relative isolate min-h-[82svh] sm:min-h-[90svh] lg:min-h-[94vh] overflow-hidden bg-gradient-to-br from-[#075e68] via-[#087f83] to-[#0b4f50] text-white flex items-center">
    {heroPhoto && <img src={heroPhoto} alt="Vista del Mirador Ecológico Ometepe" fetchPriority="high" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062f32]/90 via-[#0b4f50]/58 to-transparent" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#062f32]/65 via-transparent to-black/15" />
    <div className="w-full max-w-7xl mx-auto px-4 min-[375px]:px-5 sm:px-10 lg:px-14 pt-28 pb-24 sm:pt-44 sm:pb-36">
      <div className="max-w-3xl">
        <p className="text-xs sm:text-sm tracking-[0.32em] uppercase font-semibold text-[#d7f4ee] mb-5">Hotel Mirador Ecológico · Ometepe</p>
        <h1 className="font-serif text-[clamp(2.35rem,8.5vw,5.25rem)] leading-[1.02] tracking-[-0.035em] font-semibold max-w-3xl mb-6 sm:mb-8">Un mirador donde la <em className="text-[#d7f4ee]">naturaleza</em>, el lago y el volcán forman parte del paisaje</h1>
        <p className="text-[15px] sm:text-lg leading-relaxed text-white/85 max-w-xl mb-8 sm:mb-10">Descubre nuestras habitaciones, espacios para eventos y el entorno natural de la Isla de Ometepe. Consulta disponibilidad y tarifas directamente con nosotros.</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 max-w-2xl mb-8 sm:mb-10 text-xs">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-3 py-2"><Leaf className="w-4 h-4 text-[#d7f4ee]" /><span>Naturaleza y descanso</span></div>
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-3 py-2"><BedDouble className="w-4 h-4 text-[#d7f4ee]" /><span>Habitaciones</span></div>
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-3 py-2"><Users className="w-4 h-4 text-[#d7f4ee]" /><span>Eventos especiales</span></div>
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-3 py-2"><MapPin className="w-4 h-4 text-[#d7f4ee]" /><span>Isla de Ometepe</span></div>
        </div>
        <div className="flex flex-col min-[390px]:flex-row items-stretch min-[390px]:items-center gap-3 sm:gap-6">
          <button onClick={onExploreRooms} className="rounded-full bg-white hover:bg-[#eefaf7] text-[#075c63] px-6 sm:px-8 py-3.5 sm:py-4 font-bold inline-flex items-center justify-center gap-3 shadow-xl shadow-black/10 transition-all">Ver habitaciones <ArrowRight className="w-5 h-5" /></button>
          <button onClick={onOpenGallery} className="rounded-full border border-white/35 bg-white/5 px-6 py-3.5 text-white text-center font-semibold hover:bg-white/10 transition-colors">Explorar fotografías <ArrowRight className="inline w-4 h-4 ml-2" /></button>
        </div>
      </div>
    </div>
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-xs tracking-widest uppercase text-white/80"><ChevronDown className="w-5 h-5" />Desplaza para explorar</div>
  </section>
  );
};
