import React, { useState } from 'react';
import { 
  Ship, 
  Bus, 
  Car, 
  Clock, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Compass, 
  Phone, 
  MessageCircle, 
  Download, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { HotelConfig } from '../types';

interface TransportPageProps {
  hotelConfig: HotelConfig;
  onOpenBookingModal: () => void;
}

export const TransportPage: React.FC<TransportPageProps> = ({ 
  hotelConfig,
  onOpenBookingModal 
}) => {
  const [activeTab, setActiveTab] = useState<'ferries' | 'buses' | 'taxis'>('ferries');

  const sanJorgeToMoyogalpa = [
    { time: '07:00 AM', vessel: 'Ferry Che Guevara', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '07:45 AM', vessel: 'Lancha Rey del Cocibolca', type: 'Solo Pasajeros', duration: '1h 00m' },
    { time: '08:30 AM', vessel: 'Ferry El Cacique', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '09:00 AM', vessel: 'Ferry Ometepe 1', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '10:30 AM', vessel: 'Ferry El Ché Guevara', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '11:45 AM', vessel: 'Lancha Santa Marta', type: 'Solo Pasajeros', duration: '1h 00m' },
    { time: '12:30 PM', vessel: 'Ferry Ometepe 3', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '01:30 PM', vessel: 'Ferry El Cacique', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '02:30 PM', vessel: 'Ferry Ometepe 1', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '03:30 PM', vessel: 'Ferry El Ché Guevara', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '04:30 PM', vessel: 'Ferry Ometepe 3', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '05:45 PM', vessel: 'Ferry El Cacique', type: 'Último Ferry (Vehículos)', duration: '1h 15m' },
  ];

  const moyogalpaToSanJorge = [
    { time: '06:00 AM', vessel: 'Ferry El Cacique', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '06:45 AM', vessel: 'Lancha Rey del Cocibolca', type: 'Solo Pasajeros', duration: '1h 00m' },
    { time: '07:30 AM', vessel: 'Ferry Ometepe 1', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '09:00 AM', vessel: 'Ferry El Ché Guevara', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '10:00 AM', vessel: 'Ferry Ometepe 3', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '11:30 AM', vessel: 'Ferry El Cacique', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '12:30 PM', vessel: 'Ferry Ometepe 1', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '01:30 PM', vessel: 'Lancha Santa Marta', type: 'Solo Pasajeros', duration: '1h 00m' },
    { time: '02:30 PM', vessel: 'Ferry El Ché Guevara', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '03:30 PM', vessel: 'Ferry Ometepe 3', type: 'Ferry con Vehículos', duration: '1h 15m' },
    { time: '04:30 PM', vessel: 'Ferry El Cacique', type: 'Ferry con Vehículos', duration: '1h 10m' },
    { time: '05:30 PM', vessel: 'Ferry Ometepe 1', type: 'Último Ferry', duration: '1h 15m' },
  ];

  const localBuses = [
    { route: 'Moyogalpa ➔ Altagracia', frequency: 'Cada 45 - 60 minutos', timeRange: '06:00 AM - 05:30 PM', notes: 'Pasa cerca de la entrada a la finca / hotel en Altagracia' },
    { route: 'Altagracia ➔ Moyogalpa', frequency: 'Cada 45 - 60 minutos', timeRange: '05:30 AM - 05:00 PM', notes: 'Conecta con las salidas de ferry hacia San Jorge' },
    { route: 'Altagracia ➔ Balgüe / Santo Domingo', frequency: 'Cada 1 - 2 horas', timeRange: '07:00 AM - 04:30 PM', notes: 'Ideal para visitar playas de Santo Domingo y el volcán Maderas' },
  ];

  const whatsappTransportMessage = encodeURIComponent(
    `Hola ${hotelConfig.name}, deseo consultar horarios actualizados de barcos y asistencia de transporte terrestre para llegar a Altagracia.`
  );

  return (
    <div className="pt-24 pb-24 bg-[#f5fbfa] min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#075e68] via-[#078b91] to-[#0ca5a0] text-white pt-20 pb-20 sm:pt-24 sm:pb-24 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-400/30">
            <Compass className="w-3.5 h-3.5" />
            Guía de Transporte a Ometepe
          </div>
          
          <h1 className="font-gidole text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-white">
            Horarios de Barcos & Transporte Terrestre
          </h1>
          
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Te ayudamos a planificar tu viaje hacia el <strong className="text-teal-200">Hotel Mirador Ecológico</strong> en Altagracia. Consulta las salidas de ferries entre San Jorge y Ometepe, y las opciones de transporte en la isla.
          </p>

          {/* Direct WhatsApp Assistance Badge */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${whatsappTransportMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Consultar Horario de Hoy por WhatsApp</span>
            </a>
            <div className="text-xs text-stone-300 flex items-center gap-1.5 bg-black/30 px-4 py-2 rounded-full border border-white/10">
              <Phone className="w-3.5 h-3.5 text-teal-300" />
              <span>Atención directa: <strong>{hotelConfig.displayPhone}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 relative z-10">
        
        {/* Important Notice Card */}
        <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-md flex items-start gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-200">
            <Info className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-xs sm:text-sm text-stone-700 space-y-1">
            <p className="font-bold text-stone-900">
              Nota para viajeros a Ometepe:
            </p>
            <p className="text-stone-600">
              Los horarios de ferry pueden tener variaciones leves según la temporada turística y el estado del viento en el Lago Cocibolca. 
              Si viajas con automóvil o motocicleta, se recomienda reservar el cupo del ferry con antelación o llegar al puerto de San Jorge al menos 45 minutos antes.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-2xl bg-stone-200/70 p-1.5 mb-8 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('ferries')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ferries'
                ? 'bg-white text-teal-800 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Ship className="w-4 h-4 text-teal-600" />
            <span>Ferries & Barcos</span>
          </button>

          <button
            onClick={() => setActiveTab('buses')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'buses'
                ? 'bg-white text-teal-800 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bus className="w-4 h-4 text-teal-600" />
            <span>Buses Locales</span>
          </button>

          <button
            onClick={() => setActiveTab('taxis')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'taxis'
                ? 'bg-white text-teal-800 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Car className="w-4 h-4 text-teal-600" />
            <span>Taxis & Alquiler</span>
          </button>
        </div>

        {/* TAB 1: FERRIES */}
        {activeTab === 'ferries' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* San Jorge -> Moyogalpa */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-[#0d474b] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Ship className="w-5 h-5 text-teal-300" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">San Jorge ➔ Moyogalpa</h3>
                      <p className="text-[11px] text-teal-200">Desde Rivas hacia la Isla de Ometepe</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-400/20 text-teal-200 text-[10px] font-bold border border-teal-300/30">
                    Frecuente
                  </span>
                </div>

                <div className="divide-y divide-stone-100 flex-1 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-2.5">Horario</th>
                        <th className="px-3 py-2.5">Embarcación</th>
                        <th className="px-3 py-2.5">Modalidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {sanJorgeToMoyogalpa.map((item, idx) => (
                        <tr key={idx} className="hover:bg-teal-50/50 transition-colors">
                          <td className="px-4 py-2.5 font-bold text-teal-900 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            {item.time}
                          </td>
                          <td className="px-3 py-2.5 font-medium">{item.vessel}</td>
                          <td className="px-3 py-2.5 text-stone-500 text-[11px]">{item.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
                  Tarifa estimada de pasajero: ~50 - 70 C$ (Córdobas) / ~$1.5 - $2 USD
                </div>
              </div>

              {/* Moyogalpa -> San Jorge */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-[#0d474b] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Ship className="w-5 h-5 text-teal-300" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">Moyogalpa ➔ San Jorge</h3>
                      <p className="text-[11px] text-teal-200">Retorno desde la isla hacia tierra firme</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-400/20 text-teal-200 text-[10px] font-bold border border-teal-300/30">
                    Regreso
                  </span>
                </div>

                <div className="divide-y divide-stone-100 flex-1 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-2.5">Horario</th>
                        <th className="px-3 py-2.5">Embarcación</th>
                        <th className="px-3 py-2.5">Modalidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {moyogalpaToSanJorge.map((item, idx) => (
                        <tr key={idx} className="hover:bg-teal-50/50 transition-colors">
                          <td className="px-4 py-2.5 font-bold text-teal-900 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            {item.time}
                          </td>
                          <td className="px-3 py-2.5 font-medium">{item.vessel}</td>
                          <td className="px-3 py-2.5 text-stone-500 text-[11px]">{item.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
                  Tarifa estimada de pasajero: ~50 - 70 C$ (Córdobas) / ~$1.5 - $2 USD
                </div>
              </div>

            </div>

            {/* Travel Tips for Ferry */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-teal-950 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                Consejos para tu cruce en Ferry
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700">
                <div className="bg-white p-3.5 rounded-xl border border-teal-100 shadow-sm">
                  <div className="font-bold text-stone-900 mb-1">🚗 Cruce con Vehículo</div>
                  <p className="text-stone-600">
                    Es indispensable reservar tu espacio en el ferry con anticipación para vehículos altos o camionetas. Escríbenos y te compartimos los contactos de las navieras.
                  </p>
                </div>
                
                <div className="bg-white p-3.5 rounded-xl border border-teal-100 shadow-sm">
                  <div className="font-bold text-stone-900 mb-1">💵 Efectivo a mano</div>
                  <p className="text-stone-600">
                    En el puerto de San Jorge se abona la tasa municipal (~1 USD) y el boleto de ferry se compra directamente en ventanilla antes de embarcar.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-teal-100 shadow-sm">
                  <div className="font-bold text-stone-900 mb-1">📍 Llegada a Moyogalpa</div>
                  <p className="text-stone-600">
                    Desde el puerto de Moyogalpa hasta nuestro hotel en Altagracia hay aprox. 25 km (35-40 min en taxi o 50 min en bus colectivo).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUSES */}
        {activeTab === 'buses' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-gidole text-xl font-bold text-stone-900 mb-1 flex items-center gap-2">
                  <Bus className="w-5 h-5 text-teal-600" />
                  Rutas de Buses Colectivos en Ometepe
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  El transporte en autobús público conecta las ciudades principales de Moyogalpa y Altagracia con los pueblos turísticos de la isla.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {localBuses.map((bus, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Ruta Regular
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {bus.route}
                    </h4>
                    <div className="space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Frecuencia: {bus.frequency}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>Horario: {bus.timeRange}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-500 border-t border-stone-200 pt-2">
                      {bus.notes}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold">Nota sobre domingos y feriados:</span>
                <p>
                  Los domingos las frecuencias de los buses públicos suelen reducirse a la mitad. Para mayor comodidad, recomendamos coordinar taxi con nuestro personal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TAXIS & ALQUILER */}
        {activeTab === 'taxis' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-gidole text-xl font-bold text-stone-900 mb-1 flex items-center gap-2">
                  <Car className="w-5 h-5 text-teal-600" />
                  Traslados Privados, Taxis & Alquiler de Motos
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  La forma más cómoda y flexible de moverte en Ometepe a tu propio ritmo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Taxi Privado */}
                <div className="p-5 rounded-2xl border border-teal-100 bg-teal-50/40 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-base">Taxi Privado Recomendado</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Podemos coordinar que un taxista local de confianza te espere a la salida de tu ferry en el puerto de Moyogalpa o San José del Sur y te traiga directo al hotel en Altagracia.
                  </p>
                  <div className="text-xs font-semibold text-teal-900">
                    Tarifa aprox. Moyogalpa ➔ Hotel: $20 - $25 USD
                  </div>
                  <a
                    href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola, deseo cotizar el traslado en taxi desde el puerto hacia Hotel Mirador Ecológico.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                  >
                    <span>Coordinar taxi por WhatsApp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Alquiler de Motos y Scooters */}
                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-base">Alquiler de Moto o Scooter</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Alquilar una moto scooter o motocicleta es la forma favorita de explorar Ometepe: Ojo de Agua, cascada San Ramón, Charco Verde y playas de Altagracia.
                  </p>
                  <div className="text-xs font-semibold text-stone-800">
                    Tarifa aprox.: $18 - $25 USD / día
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Requisitos: Licencia de conducir vigente y uso obligatorio de casco.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Action Call to Action Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#0c393c] via-[#115e59] to-[#087f83] text-white text-center space-y-4 shadow-xl">
          <h3 className="font-gidole text-2xl sm:text-3xl font-bold">
            ¿Tienes alguna duda con tu llegada a Ometepe?
          </h3>
          <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Escríbenos directamente a nuestro WhatsApp oficial y con gusto te asistiremos con los horarios exactos del día y la reserva de tu habitación.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${whatsappTransportMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chatear por WhatsApp ({hotelConfig.displayPhone})</span>
            </a>
            
            <button
              onClick={onOpenBookingModal}
              className="px-6 py-3 rounded-full bg-white text-stone-900 hover:bg-stone-100 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Reservar Habitación
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
