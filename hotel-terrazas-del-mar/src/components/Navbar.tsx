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
      className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300"
    >
      {/* Floating Island Pill Bar */}
      <div 
        className={`rounded-full px-3 sm:px-5 py-2 sm:py-2.5 transition-all duration-300 flex items-center justify-between border ${
          isScrolled 
            ? 'bg-[#0b2f33]/95 backdrop-blur-xl border-teal-500/30 shadow-2xl shadow-black/50 text-white' 
            : 'bg-[#0e3d42]/88 backdrop-blur-lg border-teal-400/25 shadow-xl shadow-black/35 text-white'
        }`}
      >
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('inicio')}
          className="flex items-center gap-2 group cursor-pointer shrink-0 text-left focus:outline-none" 
          title={hotelConfig.name}
        >
          <HotelLogo variant="horizontal" mode="white" height={28} />
        </button>

        {/* Desktop Minimalist Nav Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-[13px] font-medium">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-all py-1 px-2.5 rounded-full cursor-pointer font-semibold relative ${
                  isActive 
                    ? 'bg-teal-400/20 text-teal-200 border border-teal-300/40' 
                    : 'text-stone-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions & CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Subtle Currency Selector */}
          <div className="hidden sm:flex items-center text-xs text-stone-300">
            <select 
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as 'USD' | 'EUR' | 'MXN')}
              className="bg-white/10 hover:bg-white/15 text-stone-200 border border-teal-400/30 rounded-full px-2 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-teal-300 cursor-pointer"
              aria-label="Moneda"
            >
              <option value="USD" className="bg-[#0e3d42] text-white">USD ($)</option>
              <option value="EUR" className="bg-[#0e3d42] text-white">EUR (€)</option>
              <option value="MXN" className="bg-[#0e3d42] text-white">MXN ($)</option>
            </select>
          </div>

          {/* Quick WhatsApp Inquiry */}
          <a
            id="nav-whatsapp-quick-btn"
            href={`https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(`Hola ${hotelConfig.name}, deseo consultar disponibilidad directa en Ometepe.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide border border-emerald-400/30 transition-all shadow-sm"
            title="Consultar por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>

          {/* Primary Direct Booking CTA */}
          <button
            id="nav-reserve-btn"
            onClick={() => onOpenBookingModal()}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0d9488] hover:bg-[#0f766e] active:bg-[#115e59] text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer border border-teal-300/40"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reservar</span>
            <span className="xs:hidden">Tarifas</span>
          </button>

          {/* Mobile Menu Toggle Button - Perfectly Tucked Inside Island Bar */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-9 h-9 md:hidden rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              mobileMenuOpen 
                ? 'bg-teal-400 text-teal-950 border-teal-300 shadow-md rotate-90' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
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
          className="md:hidden mt-2 p-4 rounded-3xl bg-[#0b2f33]/96 backdrop-blur-2xl border border-teal-400/30 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200"
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

          {/* Currency selector inside mobile menu */}
          <div className="flex items-center justify-between text-xs text-stone-300 px-3 py-1">
            <span>Moneda de cotización:</span>
            <select 
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as 'USD' | 'EUR' | 'MXN')}
              className="bg-[#0f4347] text-white border border-teal-400/40 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="MXN">MXN ($)</option>
            </select>
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
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
