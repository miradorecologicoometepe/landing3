import React, { useState, useEffect } from 'react';
import { HotelConfig } from '../types';
import { 
  MessageCircle, 
  Calendar, 
  Menu, 
  X, 
  Sparkles,
  Ship,
  Bed,
  Waves,
  Image as ImageIcon,
  MapPin,
  Home
} from 'lucide-react';
import { HotelLogo } from './HotelLogo';

export type PageId = 'inicio' | 'habitaciones' | 'eventos-piscina' | 'transporte' | 'galeria' | 'contacto';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenBookingModal: (roomTypeId?: string) => void;
  currency: string;
  onChangeCurrency: (curr: 'USD' | 'EUR' | 'MXN') => void;
  hotelConfig: HotelConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activePage,
  onNavigate,
  onOpenBookingModal, 
  currency, 
  onChangeCurrency,
  hotelConfig,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'habitaciones', label: 'Habitaciones', icon: Bed },
    { id: 'eventos-piscina', label: 'Eventos', icon: Waves },
    { id: 'transporte', label: 'Guía', icon: Ship },
    { id: 'contacto', label: 'Contacto', icon: MapPin },
  ];

  const handleNavClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-navbar-island"
      className="fixed top-2 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-16px)] sm:w-[95%] max-w-7xl transition-all duration-300"
    >
      {/* Floating Island Pill Bar */}
      <div 
        className={`rounded-2xl sm:rounded-full px-2.5 sm:px-7 py-2.5 sm:py-3.5 gap-2 min-w-0 transition-all duration-300 flex items-center justify-between border ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-teal-100 shadow-lg shadow-[#075e68]/10 text-[#103b43]' 
            : 'bg-white/90 backdrop-blur-xl border-white/60 shadow-lg shadow-[#075e68]/10 text-[#103b43]'
        }`}
      >
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('inicio')}
          className="flex items-center gap-2 group cursor-pointer min-w-0 flex-1 lg:flex-none text-left focus:outline-none" 
          title={hotelConfig.name}
        >
          <HotelLogo variant="horizontal" mode="color" height={28} className="min-w-0" />
        </button>

        {/* Desktop Minimalist Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 lg:gap-8 text-xs lg:text-[13px] font-medium">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-all py-1 px-2.5 rounded-full cursor-pointer font-semibold relative ${
                  isActive 
                    ? 'text-[#087f83] border-b-2 border-[#087f83] rounded-none' 
                    : 'text-[#244a50] hover:text-[#087f83] hover:bg-teal-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions & CTAs */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 relative z-10">
          
          {/* Primary Direct Booking CTA */}
          <button
            id="nav-reserve-btn"
            onClick={() => onOpenBookingModal()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-teal-200 bg-white hover:bg-teal-50 text-[#075e68] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Ver tarifas</span>
          </button>

          {/* Mobile Menu Toggle Button - Perfectly Tucked Inside Island Bar */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-11 h-11 shrink-0 lg:hidden rounded-xl flex items-center justify-center transition-all cursor-pointer border-2 shadow-sm ${
              mobileMenuOpen 
                ? 'bg-[#075e68] text-white border-[#075e68]' 
                : 'bg-white hover:bg-teal-50 text-[#075e68] border-[#087f83]'
            }`}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-island-dropdown"
            title="Menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Island Mobile Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-island-dropdown" 
          className="lg:hidden mt-2 p-4 rounded-3xl bg-[#075c63]/96 backdrop-blur-2xl border border-teal-400/30 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex flex-col space-y-1 pb-2 border-b border-white/10">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 py-2.5 px-3.5 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-teal-400/25 text-teal-200 border border-teal-400/40 font-bold' 
                      : 'text-stone-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isActive ? 'bg-teal-500 text-white' : 'bg-white/10 text-stone-300'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-teal-300"></span>}
                </button>
              );
            })}
          </div>

          {/* Direct WhatsApp and Reservation Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <a
              href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola, me gustaría consultar disponibilidad y detalles en ${hotelConfig.name} Ometepe.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Directo ({hotelConfig.displayPhone})</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#079c9d] hover:bg-[#087f83] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Cotizar con Tarifa Directa</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
