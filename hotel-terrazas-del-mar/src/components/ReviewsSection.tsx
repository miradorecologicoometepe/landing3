import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/3cvrFknvs9qWTZKp9';

export const ReviewsSection: React.FC = () => (
  <section id="resenas" className="py-16 sm:py-20 bg-[#f5fbfa] border-y border-teal-100">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#087f83] mb-3">Opiniones de nuestros huéspedes</p>
        <h2 className="font-gidole text-3xl sm:text-4xl font-extrabold text-[#103b43] mb-3">Lo que dicen de nosotros en Google</h2>
        <p className="text-stone-600">Consulta las experiencias de quienes nos han visitado directamente en nuestro perfil de Google.</p>
      </div>
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm p-6 sm:p-10 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="inline-flex items-center gap-2 text-xl font-semibold text-stone-700" aria-label="Reseñas en Google">
              <span className="font-bold text-2xl" aria-hidden="true"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span>
              <span>Reseñas</span>
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-3xl text-[#103b43]">4.5</strong>
              <span className="flex items-center gap-0.5" aria-label="4.5 de 5 estrellas">
                {[0, 1, 2, 3, 4].map((n) => <Star key={n} className="w-5 h-5 fill-[#FBBC05] text-[#FBBC05]" aria-hidden="true" />)}
              </span>
              <span className="text-sm text-stone-500">/ 5</span>
            </div>
            <p className="text-xs text-stone-500">Valoración de referencia; consulta Google para ver la puntuación y las reseñas actuales.</p>
          </div>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#087f83] hover:bg-[#075e68] text-white font-bold text-sm px-6 py-4 transition-colors text-center">
            Ver reseñas de Google <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </section>
);
