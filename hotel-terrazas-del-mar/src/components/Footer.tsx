import React from 'react';
import { HotelConfig } from '../types';
import { HotelLogo } from './HotelLogo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Calendar,
  Lock
} from 'lucide-react';

interface FooterProps {
  onOpenBookingModal: () => void;
  hotelConfig: HotelConfig;
  onOpenAdminPanel?: () => void;
  onNavigate?: (page: 'inicio' | 'habitaciones' | 'eventos-piscina' | 'transporte' | 'galeria' | 'contacto') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenBookingModal,
  hotelConfig,
  onOpenAdminPanel,
  onNavigate,
}) => {
  return (
    <footer id="footer-section" className="bg-[#0c2225] text-stone-300 pt-16 pb-20 sm:pb-12 border-t border-teal-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-teal-900/40">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <HotelLogo variant="horizontal" mode="white" height={48} logoUrl={hotelConfig.logoUrl} />

            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              Un espacio para descansar, descubrir Ometepe y organizar encuentros especiales en {hotelConfig.locationArea || 'Isla de Ometepe'}.
            </p>

            <div className="text-xs text-stone-400 space-y-1">
              <div>Check-in: <strong className="text-teal-200">{hotelConfig.checkInTime}</strong></div>
              <div>Check-out: <strong className="text-teal-200">{hotelConfig.checkOutTime}</strong></div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-gidole text-sm font-bold uppercase tracking-wider text-white mb-4">
              Páginas & Secciones
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate?.('inicio')} 
                  className="hover:text-teal-300 transition-colors text-left cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('habitaciones')} 
                  className="hover:text-teal-300 transition-colors text-left cursor-pointer"
                >
                  Habitaciones & Tarifas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('eventos-piscina')} 
                  className="hover:text-teal-300 transition-colors text-left cursor-pointer"
                >
                  Eventos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('transporte')} 
                  className="hover:text-teal-300 transition-colors text-left cursor-pointer text-teal-200 font-semibold"
                >
                  Guía de Ometepe
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('galeria')} 
                  className="hover:text-teal-300 transition-colors text-left cursor-pointer"
                >
                  Galería de Fotos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('contacto')} 
                  className="hover:text-teal-300 transition-colors text-left cursor-pointer"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Booking Perks */}
          <div>
            <h4 className="font-gidole text-sm font-bold uppercase tracking-wider text-white mb-4">
              Planifica tu estancia
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-sun shrink-0" />
                <span>Consulta directa de tarifas y disponibilidad</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-mint shrink-0" />
                <span>Información para planificar tu visita</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-sun shrink-0" />
                <span>Consulta de habitaciones y eventos</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-mint shrink-0" />
                <span>Atención directa por WhatsApp</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct WhatsApp Contact */}
          <div className="space-y-4">
            <h4 className="font-gidole text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contacto Directo
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
                <span>{hotelConfig.address}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Mail className="w-4 h-4 text-brand-mint shrink-0" />
                <span>{hotelConfig.email}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Phone className="w-4 h-4 text-brand-mint shrink-0" />
                <span>{hotelConfig.displayPhone}</span>
              </div>
            </div>

            <button
              onClick={onOpenBookingModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#387378] hover:bg-[#2c5b5f] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Cotizar por WhatsApp</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} {hotelConfig.name} • Isla de Ometepe, Rivas, Nicaragua.
          </div>
          <div className="flex items-center gap-6">
            <span>Aviso de Privacidad</span>
            <span>Términos de Reserva</span>
            <span>Políticas de Cancelación</span>
            {onOpenAdminPanel && (
              <button
                id="footer-staff-portal-btn"
                onClick={onOpenAdminPanel}
                className="text-stone-500 hover:text-brand-mint transition-colors flex items-center gap-1 text-[10px] cursor-pointer"
                title="Acceso reservado a gerencia y personal de recepción"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Gestión</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
