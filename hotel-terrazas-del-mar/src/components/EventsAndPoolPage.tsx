import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  Sun, 
  Waves, 
  CheckCircle2, 
  MessageCircle, 
  Heart, 
  Coffee, 
  Music, 
  Camera, 
  Phone,
  ChevronRight,
  Wine
} from 'lucide-react';
import { HotelConfig, PhotoItem } from '../types';

interface EventsAndPoolPageProps {
  hotelConfig: HotelConfig;
  photos: PhotoItem[];
  onOpenBookingModal: () => void;
}

export const EventsAndPoolPage: React.FC<EventsAndPoolPageProps> = ({ 
  hotelConfig,
  photos,
  onOpenBookingModal 
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'eventos' | 'piscina'>('all');

  const eventPhotos = photos.filter(photo => photo.category === 'gastronomy');
  const poolPhotos = photos.filter(photo => photo.category === 'pool');
  const eventImage = (index: number, fallback: string) => eventPhotos[index % eventPhotos.length]?.url || fallback;
  const poolImage = (index: number, fallback: string) => poolPhotos[index % poolPhotos.length]?.url || fallback;

  const eventFeatures = [
    { title: 'Celebraciones Sociales', desc: 'Cumpleaños, aniversarios, quinceaños y reuniones familiares en un entorno campestre fresco y privado.', icon: Heart },
    { title: 'Bodas & Eventos Románticos', desc: 'Ceremonias al atardecer con vista panorámica al Lago Cocibolca y a los volcanes de Ometepe.', icon: Wine },
    { title: 'Retiros & Talleres Grupales', desc: 'Jornadas de yoga, meditación, retiros corporativos y convivencia de equipos de trabajo.', icon: Users },
    { title: 'Catering Campestre', desc: 'Menú de comida típica nicaragüense, asados al aire libre, frutas tropicales y bebidas frescas.', icon: Coffee }
  ];

  const poolFeatures = [
    { title: 'Piscina al Aire Libre', desc: 'Piscina con agua cristalina y vistas abiertas a la vegetación tropical de la finca.' },
    { title: 'Solárium & Tumbonas', desc: 'Área empedrada con sillas reclinables y sombra natural para relajarse bajo el sol de Ometepe.' },
    { title: 'Acceso Huéspedes & Pasadía', desc: 'Uso 100% gratuito para huéspedes alojados, y opción de Day-Pass para visitantes por el día.' },
    { title: 'Ambiente Familiar & Tranquilo', desc: 'Entorno seguro y acogedor rodeado de árboles frutales y cantos de aves silvestres.' }
  ];

  return (
    <main className="pt-24 pb-24 bg-[#f5fbfa] min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#075e68] via-[#078b91] to-[#0ca5a0] text-white pt-20 pb-20 sm:pt-24 sm:pb-24 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-200 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-300/30">
            <Sparkles className="w-3.5 h-3.5" />
            Espacios & Amenidades Exclusivas
          </div>
          
          <h1 className="font-gidole text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight break-words text-white">
            Local para Eventos & Piscina Panorámica
          </h1>
          
          <p className="text-teal-100/90 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Celebra tus momentos especiales en nuestro salón campestre con vista al lago y refréscate en la piscina rodeada por la naturaleza de Altagracia, Isla de Ometepe.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-start gap-4">
            <a
              href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, deseo cotizar el local de eventos para una celebración.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#089b9c] hover:bg-[#087f83] text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Cotizar Local de Eventos por WhatsApp</span>
            </a>
            <a
              href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, deseo información sobre el acceso a la piscina y pasadía.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-teal-100 font-bold text-xs sm:text-sm border border-teal-300/30 transition-all"
            >
              <Waves className="w-4 h-4" />
              <span>Consultar Pasadía en Piscina</span>
            </a>
          </div>
        </div>
      </div>

      <section className="w-full bg-[#f5fbfa] px-5 sm:px-8 py-16 sm:py-20 relative clear-both">
        <div className="max-w-6xl mx-auto">
        
        {/* Navigation Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl bg-white p-2 mb-12 w-full max-w-2xl mx-auto border border-teal-100 shadow-lg gap-2">
          <button
            onClick={() => setActiveSection('all')}
            className={`w-full min-h-12 px-3 py-3 rounded-xl whitespace-normal leading-snug text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'all'
                ? 'bg-[#087f83] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ver Todo
          </button>
          <button
            onClick={() => setActiveSection('eventos')}
            className={`w-full min-h-12 px-3 py-3 rounded-xl whitespace-normal leading-snug text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'eventos'
                ? 'bg-[#087f83] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Local para Eventos
          </button>
          <button
            onClick={() => setActiveSection('piscina')}
            className={`w-full min-h-12 px-3 py-3 rounded-xl whitespace-normal leading-snug text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'piscina'
                ? 'bg-[#087f83] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Piscina & Solárium
          </button>
        </div>

        {/* SECTION 1: LOCAL PARA EVENTOS */}
        {(activeSection === 'all' || activeSection === 'eventos') && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 mb-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  Salón & Espacio al Aire Libre
                </div>
                <h2 className="font-gidole text-2xl sm:text-4xl font-extrabold text-stone-900">
                  Local para Eventos & Celebraciones
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1">
                  Un entorno campestre auténtico, con amplia brisa del lago y vista a la montaña, ideal para agasajar a tus invitados sin prisas.
                </p>
              </div>

              <a
                href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, deseo cotizar el local de eventos para una fecha específica.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md shrink-0 self-start md:self-auto"
              >
                <Calendar className="w-4 h-4" />
                <span>Consultar Fechas de Evento</span>
              </a>
            </div>

            {/* Event Images Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-2xl overflow-hidden aspect-[16/10] relative group">
                <img
                  src={eventImage(1, "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85")}
                  alt="Espacio para eventos campestres"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="px-2.5 py-1 rounded bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Eventos Sociales
                    </span>
                    <h4 className="font-bold text-lg mt-1">Celebraciones frente al Lago Cocibolca</h4>
                    <p className="text-xs text-stone-200">Bodas, cumpleaños y cenas con atardeceres mágicos</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="rounded-2xl overflow-hidden aspect-[16/10] relative group">
                  <img
                    src={eventImage(2, "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80")}
                    alt="Banquete y comida campestre"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-bold">
                    Catering campestre con sabores de la isla
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden aspect-[16/10] relative group">
                  <img
                    src={eventImage(3, "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80")}
                    alt="Retiros y grupos"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-bold">
                    Reuniones de grupos, retiros y talleres
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {eventFeatures.map((feat, i) => {
                const IconComponent = feat.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">{feat.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quote Box */}
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-700">
                <span className="font-bold text-teal-950 text-sm block">¿Planeas un evento para más de 15 personas?</span>
                Ofrecemos paquetes combinados que incluyen uso del local de eventos + habitaciones para invitados con tarifa especial.
              </div>
              <a
                href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola, deseo cotizar paquete de evento + alojamiento grupal en Hotel Mirador Ecológico.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 shadow-sm flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Solicitar Paquete Grupal</span>
              </a>
            </div>
          </div>
        )}

        {/* SECTION 2: PISCINA & SOLÁRIUM */}
        {(activeSection === 'all' || activeSection === 'piscina') && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 mb-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <Waves className="w-4 h-4 text-teal-600" />
                  Relax & Recreación
                </div>
                <h2 className="font-gidole text-2xl sm:text-4xl font-extrabold text-stone-900">
                  Piscina Panorámica & Solárium
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1">
                  Refréscate tras explorar los senderos o volcanes de Ometepe. Agua limpia, solárium empedrado y vistas abiertas al lago.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Incluida para Huéspedes
                </span>
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  Pasadía Disponible
                </span>
              </div>
            </div>

            {/* Pool Images Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative group">
                <img
                  src={poolImage(1, "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80")}
                  alt="Piscina con vistas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-bold">
                  Piscina al aire libre en Altagracia
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative group">
                <img
                  src={poolImage(2, "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80")}
                  alt="Agua cristalina y descanso"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-bold">
                  Solárium para disfrutar del atardecer
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative group">
                <img
                  src={poolImage(3, "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80")}
                  alt="Bebidas refrescantes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-bold">
                  Bebidas tropicales y descanso total
                </div>
              </div>
            </div>

            {/* Pool Details List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {poolFeatures.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold text-xs">
                    0{i+1}
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{item.title}</h4>
                  <p className="text-stone-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Day Pass CTA */}
            <div className="bg-gradient-to-r from-teal-800 to-[#0e484d] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base sm:text-lg">¿No te hospedas con nosotros pero quieres pasar el día?</h4>
                <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
                  Pregunta por nuestra opción de <strong>Pasadía / Day-Pass</strong> para disfrutar de la piscina, áreas verdes y servicio de restaurante campestre.
                </p>
              </div>
              <a
                href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, quisiera información sobre el Pasadía / Day-Pass para uso de piscina.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Consultar Pasadía por WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        </div>
      </section>
    </main>
  );
};
