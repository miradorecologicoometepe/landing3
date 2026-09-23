import React, { useState, useEffect, useCallback } from 'react';
import { PhotoItem, PhotoCategory } from '../types';
import { GALLERY_PHOTOS, HOTEL_CONFIG } from '../data/hotelData';
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  MessageCircle, 
  Maximize2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface PhotoGallerySectionProps {
  photos: PhotoItem[];
  onBookExperienceViaWhatsApp: (photoTitle: string) => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  onBookExperienceViaWhatsApp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: { id: PhotoCategory; label: string }[] = [
    { id: 'all', label: 'Todas las Fotos' },
    { id: 'pool', label: 'Piscina & Mirador' },
    { id: 'rooms', label: 'Habitaciones' },
    { id: 'outdoors', label: 'Volcanes & Naturaleza' },
    { id: 'gastronomy', label: 'Gastronomía & Eventos' },
  ];

  const filteredPhotos = photos.filter((photo) => {
    if (selectedCategory === 'all') return true;
    return photo.category === selectedCategory;
  });

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  const currentPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <section id="galeria" className="py-20 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1b3d41] border border-brand-mint/40 text-brand-sun text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5 text-brand-mint" />
            Recorrido Visual • Ometepe
          </div>
          <h2 className="font-gidole text-3xl sm:text-4xl text-white font-extrabold tracking-tight mb-4">
            Galería del Mirador, Piscina & Habitaciones
          </h2>
          <p className="text-stone-300 text-base leading-relaxed">
            Explora nuestras habitaciones, los espacios para eventos y el entorno natural de Ometepe.
          </p>


          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`gallery-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0d9488] text-white shadow-lg shadow-black/40 border border-teal-300'
                    : 'bg-[#1b373b] text-stone-200 hover:bg-[#254c51] border border-[#2c585e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mosaic Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              id={`gallery-item-${photo.id}`}
              onClick={() => handleOpenLightbox(index)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-800 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-800 hover:border-amber-500/50"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Bottom Caption Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#387378] text-white backdrop-blur-xs">
                    {photo.category}
                  </span>
                  <span className="text-[10px] text-stone-300">
                    Click para ampliar
                  </span>
                </div>
                <h3 className="font-gidole text-lg font-bold text-white group-hover:text-brand-sun transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.caption}
                </p>
              </div>

              {/* Top Zoom Icon */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Maximize2 className="w-4 h-4 text-brand-sun" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {currentPhoto && lightboxIndex !== null && (
          <div
            id="gallery-lightbox-overlay"
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={handleCloseLightbox}
          >
            {/* Top Lightbox Bar */}
            <div 
              className="flex items-center justify-between text-white border-b border-stone-800 pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="font-gidole font-bold text-brand-sun tracking-wider text-sm sm:text-base">
                  {currentPhoto.title}
                </span>
                <span className="text-xs text-stone-400">
                  ({lightboxIndex + 1} de {filteredPhotos.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="lightbox-close-btn"
                  onClick={handleCloseLightbox}
                  className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors"
                  aria-label="Cerrar vista de pantalla completa"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Center Image with Prev / Next */}
            <div 
              className="relative flex-1 flex items-center justify-center py-4 max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="lightbox-prev-btn"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-[#387378] text-white transition-colors backdrop-blur-sm cursor-pointer"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all"
              />

              <button
                id="lightbox-next-btn"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-[#387378] text-white transition-colors backdrop-blur-sm cursor-pointer"
                aria-label="Siguiente foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & WhatsApp Action */}
            <div 
              className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 max-w-3xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="text-sm text-stone-200">
                  {currentPhoto.caption}
                </p>
                <span className="text-[11px] text-brand-mint">
                  {HOTEL_CONFIG.name}
                </span>
              </div>

              <button
                id="lightbox-whatsapp-action-btn"
                onClick={() => {
                  handleCloseLightbox();
                  onBookExperienceViaWhatsApp(currentPhoto.title);
                }}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
