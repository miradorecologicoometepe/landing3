import React, { useState } from 'react';
import { HOTEL_CONFIG } from '../data/hotelData';
import { 
  MapPin, 
  Plane, 
  Car, 
  Ship, 
  Compass, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface LocationSectionProps {
  onOpenBookingModal: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  onOpenBookingModal,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pointsOfInterest = [
    { name: 'Puerto Moyogalpa / Ferry San Jorge', distance: '30 minutos en vehículo', icon: Ship, detail: 'Llegada de ferries diarios desde San Jorge, Rivas' },
    { name: 'Ojo de Agua (Manantial Natural)', distance: '12 minutos', icon: Compass, detail: 'Aguas cristalinas volcánicas rodeadas de naturaleza' },
    { name: 'Reserva Ecológica Charco Verde', distance: '15 minutos', icon: MapPin, detail: 'Senderismo, mariposario y playas tranquilas' },
    { name: 'Volcanes Concepción & Maderas', distance: 'Vistas panorámicas directas', icon: Compass, detail: 'Tours de ascenso y canopy en las faldas volcánicas' },
  ];

  const faqs = [
    {
      q: '¿Cómo funciona el sistema de reserva directa por WhatsApp?',
      a: 'Es muy sencillo: seleccionas tus fechas y la cabaña o villa deseada en nuestra web. Al pulsar "Consultar por WhatsApp", se genera un mensaje ordenado con el desglose exacto de noches, huéspedes y el 15% de descuento directo. Nuestro equipo local te responderá de inmediato para confirmar disponibilidad y asistirte con los horarios del ferry a la isla.'
    },
    {
      q: '¿Cómo se llega al Hotel Mirador Ecológico en Ometepe?',
      a: 'Tomas el ferry desde el puerto de San Jorge (Rivas) hacia Moyogalpa o San José del Sur en Ometepe (1 hora de travesía). Desde el puerto, puedes tomar taxi, bus local o solicitarnos coordinar un traslado privado hasta la puerta del hotel.'
    },
    {
      q: '¿Cómo se garantiza y abona la reserva?',
      a: 'No necesitas introducir tarjetas de crédito en la web. Una vez acordados los detalles por WhatsApp, te proporcionamos opciones seguras de pago o depósito para confirmar tu estancia.'
    },
    {
      q: '¿Cuál es la política de cancelación flexible?',
      a: 'Para reservas directas por WhatsApp, ofrecemos cancelación gratuita y reprogramación sin penalización avisando con 48 horas de anticipación.'
    },
    {
      q: '¿Cuáles son los horarios de Check-in y Check-out?',
      a: `El Check-in oficial es a partir de las ${HOTEL_CONFIG.checkInTime} y el Check-out es a las ${HOTEL_CONFIG.checkOutTime}. Si tu ferry llega más temprano o sale más tarde, puedes disfrutar de la piscina y dejar tu equipaje en recepción con total comodidad.`
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="ubicacion" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C2ECE5] border border-[#387378]/30 text-brand-teal-dark text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-brand-teal" />
            Entorno Natural de Ometepe
          </div>
          <h2 className="font-gidole text-3xl sm:text-4xl text-stone-900 font-extrabold tracking-tight mb-4">
            Ubicación del Mirador & Preguntas Frecuentes
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Situado en un punto alto privilegiado con vistas panorámicas al volcán y al Lago Cocibolca, a minutos de las principales atracciones de la isla.
          </p>
        </div>

        {/* Location & Map Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* Map & Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-gidole font-bold text-xl text-stone-900">
                    {HOTEL_CONFIG.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {HOTEL_CONFIG.address}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C2ECE5] text-brand-teal-dark border border-brand-mint text-xs font-semibold">
                  Vista Volcánica & Lago
                </span>
              </div>

              {/* Styled Map Graphic / Preview */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-200 border border-stone-300 group shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                  alt="Ubicación Ometepe Mirador Ecológico"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Pin Card overlay */}
                <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center p-4">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-stone-200 max-w-xs text-center">
                    <div className="w-10 h-10 rounded-full bg-brand-terracotta text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="font-gidole font-bold text-sm text-stone-900">
                      {HOTEL_CONFIG.name}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      Isla de Ometepe • Rivas, Nicaragua
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(HOTEL_CONFIG.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:text-brand-teal-dark"
                    >
                      <span>Abrir en Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {pointsOfInterest.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAFDFB] border border-stone-200 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#C2ECE5]/50 text-brand-teal shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{pt.name}</div>
                      <div className="text-[11px] text-brand-terracotta font-semibold">{pt.distance}</div>
                      <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{pt.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQs Accordion (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-brand-teal" />
                <h3 className="font-gidole font-bold text-xl text-stone-900">
                  Preguntas Frecuentes
                </h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left px-4 py-3.5 font-bold text-xs sm:text-sm text-stone-900 hover:bg-stone-50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Inquiry Help Card */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-emerald-900">
                  ¿Tienes otra pregunta sobre tu viaje?
                </div>
                <div className="text-[11px] text-emerald-700">
                  Habla directamente con nuestro concierge en WhatsApp
                </div>
              </div>
              <a
                href={`https://wa.me/${HOTEL_CONFIG.whatsAppNumber}?text=${encodeURIComponent('Hola, tengo unas dudas antes de reservar en Hotel Mirador Ecológico en Ometepe.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-[#387378] hover:bg-[#2c5b5f] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Preguntar</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
