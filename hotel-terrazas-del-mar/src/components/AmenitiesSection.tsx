import React from 'react';
import { HOTEL_AMENITIES } from '../data/hotelData';
import { 
  Waves, 
  Umbrella, 
  UtensilsCrossed, 
  Sparkles, 
  MessageCircle, 
  Wifi, 
  Ship, 
  Wine, 
  Sunset,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AmenitiesSectionProps {
  onBookExperienceViaWhatsApp: (experienceName: string) => void;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  onBookExperienceViaWhatsApp,
}) => {
  const experiences = [
    {
      id: 'sunset-kayak',
      title: 'Tour de Kayak en el Río Istián al Atardecer',
      tag: 'Aventura & Vida Silvestre',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      description: 'Rema entre santuarios de manglares del Lago Cocibolca avistando garzas reales, tortugas y monos aulladores frente al Volcán Concepción.',
      price: '$28 USD por persona'
    },
    {
      id: 'volcano-hike',
      title: 'Senderismo Guiado al Volcán Maderas & Laguna Cráter',
      tag: 'Bosque Nuboso & Naturaleza',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      description: 'Caminata entre árboles milenarios y petroglifos precolombinos hasta la misteriosa laguna de aguas color turquesa en la cumbre.',
      price: '$35 USD por persona con guía local'
    },
    {
      id: 'coffee-farm-dinner',
      title: 'Cena Típica Campestre & Degustación de Café de Ometepe',
      tag: 'Gastronomía & Fuego de Leña',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      description: 'Cena servida en el mirador con guapote y tilapia fresca del lago, tostones crocantes y café orgánico recién tostado en la isla.',
      price: '$45 USD por pareja'
    }
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves': return <Waves className="w-6 h-6 text-brand-teal" />;
      case 'Umbrella': return <Umbrella className="w-6 h-6 text-brand-teal" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-6 h-6 text-brand-teal" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-brand-teal" />;
      case 'MessageCircle': return <MessageCircle className="w-6 h-6 text-brand-teal" />;
      case 'Wifi': return <Wifi className="w-6 h-6 text-brand-teal" />;
      default: return <Sparkles className="w-6 h-6 text-brand-teal" />;
    }
  };

  return (
    <section id="experiencias" className="py-20 bg-[#F4F9F8] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Resort Services Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C2ECE5] border border-brand-teal/30 text-brand-teal-dark text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
            Hospitalidad Ecológica de Primera
          </div>
          <h2 className="font-gidole text-3xl sm:text-4xl text-stone-900 font-extrabold tracking-tight mb-4">
            Comodidades del Mirador & Eco-Resort
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Todo lo necesario para desconectarte del bullicio urbano y reconectar con la energía natural de la Isla de Ometepe.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {HOTEL_AMENITIES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C2ECE5]/30 border border-brand-mint flex items-center justify-center mb-4">
                  {renderIcon(item.icon)}
                </div>
                <h3 className="font-gidole font-bold text-lg text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Curated Experiences Showcase */}
        <div className="pt-10 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                Aventuras & Tradición Ometepe
              </span>
              <h3 className="font-gidole text-2xl sm:text-3xl font-extrabold text-stone-900">
                Experiencias Ecológicas Guiadas
              </h3>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md">
              Puedes agregar o consultar estas actividades antes de tu llegada vía WhatsApp con nuestro equipo de hospitalidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <div 
                key={exp.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#18363a]/90 backdrop-blur-sm text-brand-sun text-[11px] font-bold border border-brand-mint/30">
                    {exp.tag}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-gidole font-bold text-lg text-stone-900 group-hover:text-brand-teal transition-colors mb-2">
                      {exp.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                      {exp.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Tarifa</span>
                      <span className="text-sm font-bold text-stone-900">{exp.price}</span>
                    </div>

                    <button
                      onClick={() => onBookExperienceViaWhatsApp(exp.title)}
                      className="px-3.5 py-2 rounded-lg bg-[#387378] hover:bg-[#2c5b5f] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Consultar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
