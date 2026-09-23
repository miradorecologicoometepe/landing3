import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/3cvrFknvs9qWTZKp9';

export const ReviewsSection: React.FC = () => (
  <section id="resenas" className="py-16 sm:py-20 bg-[#f5fbfa] border-y border-teal-100">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#087f83] mb-3">Opiniones de huéspedes</p>
          <h2 className="font-gidole text-3xl sm:text-4xl font-extrabold text-[#103b43] mb-3">Conoce las experiencias de nuestros visitantes</h2>
          <p className="text-stone-600 leading-relaxed">Lee las reseñas publicadas por huéspedes en Google Maps y conoce sus experiencias antes de planificar tu estancia.</p>
          <p className="mt-4 text-sm text-stone-600">Google: <strong>4.5 de 5</strong> · 96 opiniones (consulta de septiembre de 2026). La puntuación y la cantidad pueden cambiar.</p>
        </div>
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#087f83] hover:bg-[#075e68] text-white font-bold text-sm px-6 py-4 transition-colors">
          <Star className="w-4 h-4" aria-hidden="true" />
          Leer reseñas en Google Maps
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);
