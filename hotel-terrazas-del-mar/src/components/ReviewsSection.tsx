import React from 'react';
import { HOTEL_CONFIG, REVIEWS_DATA } from '../data/hotelData';
import { 
  Star, 
  CheckCircle2, 
  Award, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  ThumbsUp
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const ratingMetrics = [
    { label: 'Limpieza y Confort Ecológico', score: 9.9 },
    { label: 'Amabilidad & Atención Familiar', score: 9.9 },
    { label: 'Vista al Lago & Volcanes', score: 9.8 },
    { label: 'Piscina & Terraza Mirador', score: 9.7 },
    { label: 'Desayuno Nica & Café de Finca', score: 9.8 },
    { label: 'Tranquilidad & Contacto con la Naturaleza', score: 9.9 },
  ];

  return (
    <section id="resenas" className="py-20 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C2ECE5] text-brand-teal-dark border border-[#387378]/30 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
            Opiniones Verificadas de Huéspedes
          </div>
          <h2 className="font-gidole text-3xl sm:text-4xl text-stone-900 font-extrabold tracking-tight mb-4">
            Testimonios del Mirador Ecológico
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Nuestros huéspedes destacan la paz del entorno, la piscina panorámica y la calidez del servicio de nuestro personal local en Ometepe.
          </p>
        </div>

        {/* OTA Rating Summary Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Score Badge (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-stone-200 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-[#18363a] text-brand-sun flex items-center justify-center font-gidole font-black text-3xl shadow-md border border-brand-mint/40">
                  {HOTEL_CONFIG.ratingScore}
                </div>
                <div>
                  <div className="font-gidole font-bold text-xl text-stone-900">
                    Excepcional
                  </div>
                  <div className="text-xs text-stone-500">
                    Basado en <strong>{HOTEL_CONFIG.totalReviews} opiniones</strong> verificadas
                  </div>
                </div>
              </div>

              <div className="flex text-brand-sun my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-sun text-brand-sun" />
                ))}
              </div>

              <div className="mt-3 text-xs text-stone-600 bg-[#F4F9F8] p-3 rounded-xl border border-stone-200 w-full">
                <span className="font-semibold text-brand-teal">100% de reservas directas</span> con asistencia personalizada para traslados y ferries en la isla.
              </div>
            </div>

            {/* Right: Metrics Bars (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ratingMetrics.map((metric, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-stone-700">
                    <span>{metric.label}</span>
                    <span className="text-stone-900 font-bold">{metric.score} / 10</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#387378] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(metric.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Author info */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-gidole font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <span>{rev.author}</span>
                      <span>{rev.flag}</span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {rev.country} • {rev.travelerType}
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-[#18363a] text-brand-sun text-xs font-black border border-brand-mint/30">
                    {rev.rating} / 10
                  </div>
                </div>

                <div className="text-xs font-semibold text-brand-teal-dark bg-[#C2ECE5]/50 px-2 py-0.5 rounded inline-block mb-3 border border-brand-mint/30">
                  Estancia: {rev.roomStayed}
                </div>

                <h4 className="font-bold text-sm text-stone-800 mb-2">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Huésped verificado
                </span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
