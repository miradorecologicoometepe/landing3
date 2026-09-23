import React, { useState, useEffect } from 'react';
import { loadPublicSiteData } from './lib/publicContent';
import { supabase } from './lib/supabase';
import { Room, PhotoItem, HotelConfig } from './types';
import { getDefaultDates } from './utils/bookingUtils';
import { 
  loadHotelConfig, 
  saveHotelConfig, 
  loadRooms, 
  saveRooms, 
  loadGalleryPhotos, 
  saveGalleryPhotos, 
  resetAllDataToDefault,
} from './utils/storageUtils';
import { Navbar, PageId } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingBar } from './components/BookingBar';
import { RoomsSection } from './components/RoomsSection';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { RoomsPage } from './components/RoomsPage';
import { EventsAndPoolPage } from './components/EventsAndPoolPage';
import { TransportPage } from './components/TransportPage';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { WhatsAppBookingModal } from './components/WhatsAppBookingModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { Footer } from './components/Footer';
import { 
  Lock, 
  LogOut, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Waves, 
  Ship, 
  Bed, 
  MessageCircle,
  Compass,
  Calendar
} from 'lucide-react';

export default function App() {
  const defaultDates = getDefaultDates();

  // Persistent Customization State
  const [hotelConfig, setHotelConfig] = useState<HotelConfig>(loadHotelConfig);
  const [rooms, setRooms] = useState<Room[]>(loadRooms);
  const [photos, setPhotos] = useState<PhotoItem[]>(loadGalleryPhotos);

  // Load published content for all visitors; preserve existing defaults until content is published.
  useEffect(() => {
    let active = true;
    loadPublicSiteData().then(data => {
      if (!active) return;
      if (data.config) setHotelConfig(data.config);
      if (data.rooms) setRooms(data.rooms);
      if (data.photos) setPhotos(data.photos);
    }).catch(error => console.error('Unable to load published site content', error));
    return () => { active = false; };
  }, []);

  // Dedicated Admin Route & Auth State (tipo admin.dominio.com)
  const checkIsAdminUrl = (): boolean => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname || '';
    const pathname = window.location.pathname || '';
    const hash = window.location.hash || '';
    const search = window.location.search || '';

    return (
      hostname.startsWith('admin.') || 
      pathname === '/admin' || 
      pathname.startsWith('/admin/') || 
      hash === '#admin' || 
      hash.startsWith('#admin') ||
      search.includes('admin=')
    );
  };

  const getInitialPage = (): PageId => {
    if (typeof window === 'undefined') return 'inicio';
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['habitaciones', 'rooms'].includes(hash)) return 'habitaciones';
    if (['eventos', 'piscina', 'eventos-piscina'].includes(hash)) return 'eventos-piscina';
    if (['transporte', 'ferries', 'barcos', 'horarios'].includes(hash)) return 'transporte';
    if (['galeria', 'fotos'].includes(hash)) return 'galeria';
    if (['contacto', 'ubicacion'].includes(hash)) return 'contacto';
    return 'inicio';
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminUrl);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminAuthChecking, setAdminAuthChecking] = useState(true);
  useEffect(() => {
    if (!supabase) { setAdminAuthChecking(false); return; }
    let active = true;
    let revision = 0;
    const verify = async () => {
      const currentRevision = ++revision;
      const { data: { user } } = await supabase.auth.getUser();
      const admin = user ? await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle() : null;
      if (active && currentRevision === revision) {
        setIsAdminAuth(Boolean(user && admin?.data && !admin.error));
        setAdminAuthChecking(false);
      }
    };
    void verify();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void verify(); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const [activePage, setActivePage] = useState<PageId>(getInitialPage);

  // Listen to hash and keyboard shortcuts (Ctrl+Alt+A / Cmd+Alt+A)
  useEffect(() => {
    const handleUrlChange = () => {
      const admin = checkIsAdminUrl();
      setIsAdminRoute(admin);
      if (!admin) {
        setActivePage(getInitialPage());
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminRoute(prev => {
          const next = !prev;
          if (next) {
            window.location.hash = '#admin';
          } else if (window.location.hash.includes('admin')) {
            window.location.hash = '';
          }
          return next;
        });
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page === 'inicio' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search / Booking State
  const [checkIn, setCheckIn] = useState<string>(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState<string>(defaultDates.checkOut);
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  // Modals State
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [detailedRoom, setDetailedRoom] = useState<Room | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'MXN'>('USD');

  // Handlers for Admin Panel updates with localStorage synchronization
  const handleSaveHotelConfig = (updatedConfig: HotelConfig) => {
    setHotelConfig(updatedConfig);
    saveHotelConfig(updatedConfig);
  };

  const handleSaveRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  };

  const handleSavePhotos = (updatedPhotos: PhotoItem[]) => {
    setPhotos(updatedPhotos);
    saveGalleryPhotos(updatedPhotos);
  };

  const handleResetAllData = () => {
    resetAllDataToDefault();
    const defConfig = loadHotelConfig();
    const defRooms = loadRooms();
    const defPhotos = loadGalleryPhotos();
    setHotelConfig(defConfig);
    setRooms(defRooms);
    setPhotos(defPhotos);
  };

  const handleExitAdminRoute = () => {
    setIsAdminRoute(false);
    if (window.location.hash.includes('admin')) {
      window.location.hash = '';
    }
  };

  const handleLogoutAdmin = async () => {
    setIsAdminAuth(false);
    await supabase?.auth.signOut();
  };

  // Trigger booking modal with optional pre-selected room
  const handleOpenBookingModal = (roomId?: string) => {
    if (roomId) {
      setSelectedRoomId(roomId);
    }
    setBookingModalOpen(true);
  };

  // Trigger from BookingBar search button
  const handleBookingBarSubmit = () => {
    setBookingModalOpen(true);
  };

  // Trigger booking with specific experience from gallery or amenities
  const handleBookExperienceViaWhatsApp = (itemTitle: string) => {
    const defaultMsg = `Hola ${hotelConfig.name}, me interesa consultar información y disponibilidad para la experiencia: "${itemTitle}".`;
    const url = `https://wa.me/${hotelConfig.whatsAppNumber}?text=${encodeURIComponent(defaultMsg)}`;
    window.open(url, '_blank');
  };

  // ==========================================
  // SCENARIO 1: DEDICATED ADMIN ROUTE (admin.dominio.com / #admin)
  // ==========================================
  if (isAdminRoute) {
    if (adminAuthChecking) return <div className="min-h-screen bg-[#0d1c1e] text-white flex items-center justify-center">Verificando acceso…</div>;
    if (!isAdminAuth) {
      return (
        <AdminLoginScreen
          hotelConfig={hotelConfig}
          onLoginSuccess={() => setIsAdminAuth(true)}
          onCancel={handleExitAdminRoute}
        />
      );
    }

    return (
      <AdminPanelModal
        isOpen={true}
        isDedicatedPage={true}
        onClose={handleExitAdminRoute}
        onLogout={handleLogoutAdmin}
        hotelConfig={hotelConfig}
        onSaveHotelConfig={handleSaveHotelConfig}
        rooms={rooms}
        onSaveRooms={handleSaveRooms}
        photos={photos}
        onSavePhotos={handleSavePhotos}
        onResetAllData={handleResetAllData}
      />
    );
  }

  // ==========================================
  // SCENARIO 2: PUBLIC GUEST MULTI-PAGE APPLICATION
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 selection:bg-teal-600 selection:text-white relative">
      
      {/* Discreet floating session pill for authenticated staff inspecting the live guest site */}
      {isAdminAuth && (
        <aside 
          id="admin-session-active-indicator"
          aria-label="Barra de control de personal"
          className="fixed top-20 right-4 z-40 bg-stone-900/95 text-white border border-teal-500/60 shadow-2xl rounded-2xl px-3.5 py-2 flex items-center gap-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div className="text-left">
              <div className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                Sesión Staff Activa
              </div>
              <div className="text-xs font-semibold text-stone-200">
                admin.dominio.com
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-stone-700 mx-0.5"></div>

          <button
            onClick={() => {
              setIsAdminRoute(true);
              window.location.hash = '#admin';
            }}
            className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Panel</span>
          </button>

          <button
            onClick={handleLogoutAdmin}
            className="p-1 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors cursor-pointer"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Floating Island Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenBookingModal={() => handleOpenBookingModal()}
        currency={currency}
        onChangeCurrency={setCurrency}
        hotelConfig={hotelConfig}
      />

      {/* Main Multi-Page Content Routing */}
      <main className="flex-1">
        
        {/* PAGE 1: INICIO (HOME LANDING) */}
        {activePage === 'inicio' && (
          <div>
            {/* Luxury Hero Visual */}
            <HeroSection
              onExploreRooms={() => handleNavigate('habitaciones')}
              onOpenGallery={() => handleNavigate('galeria')}
              onOpenBookingModal={() => handleOpenBookingModal()}
              hotelConfig={hotelConfig}
              photos={photos}
            />

            {/* Floating Search & Booking Bar */}
            <BookingBar
              checkIn={checkIn}
              checkOut={checkOut}
              adults={adults}
              childrenCount={childrenCount}
              selectedRoomId={selectedRoomId}
              rooms={rooms}
              onUpdateDates={(cin, cout) => {
                setCheckIn(cin);
                setCheckOut(cout);
              }}
              onUpdateGuests={(a, c) => {
                setAdults(a);
                setChildrenCount(c);
              }}
              onUpdateRoom={(rid) => setSelectedRoomId(rid)}
              onSubmitSearch={handleBookingBarSubmit}
            />

            {/* Room / Suites Catalog with direct WhatsApp action */}
            <RoomsSection
              rooms={rooms}
              hotelConfig={hotelConfig}
              onSelectRoomForDetails={(room) => setDetailedRoom(room)}
              onBookRoomViaWhatsApp={(roomId) => handleOpenBookingModal(roomId)}
            />

            {/* Feature Teasers: Eventos & Piscina + Horarios de Barcos */}
            <section className="py-12 bg-stone-100/70 border-y border-stone-200/80">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card 1: Local para Eventos & Piscina */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-3">
                        <Waves className="w-3.5 h-3.5" />
                        Instalaciones
                      </div>
                      <h3 className="font-gidole text-2xl font-extrabold text-stone-900 group-hover:text-teal-700 transition-colors">
                        Local para Eventos & Piscina
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        Celebra tus cumpleaños, bodas frente al lago o retiros en nuestro local campestre, y disfruta de nuestra piscina panorámica con solárium.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => handleNavigate('eventos-piscina')}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                      >
                        <span>Ver fotos y detalles del local</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Pasadía & Eventos
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Horarios de Barcos & Ferries */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-3">
                        <Ship className="w-3.5 h-3.5" />
                        Guía de Viaje
                      </div>
                      <h3 className="font-gidole text-2xl font-extrabold text-stone-900 group-hover:text-teal-700 transition-colors">
                        Horarios de Ferries & Transporte
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        Revisa los horarios de barcos entre San Jorge y Moyogalpa / San José del Sur, autobuses locales a Altagracia y traslados privados recomendados.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => handleNavigate('transporte')}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                      >
                        <span>Ver tabla de horarios completa</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                        Horarios al Día
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Public photo gallery: photos can later be replaced from the admin panel. */}
            <PhotoGallerySection
              photos={photos}
              onBookExperienceViaWhatsApp={handleBookExperienceViaWhatsApp}
            />

            <ReviewsSection />

            {/* Location & Frequently Asked Questions */}
            <LocationSection
              onOpenBookingModal={() => handleOpenBookingModal()}
            />
          </div>
        )}

        {/* PAGE 2: HABITACIONES DEDICATED */}
        {activePage === 'habitaciones' && (
          <RoomsPage
            rooms={rooms}
            hotelConfig={hotelConfig}
            onSelectRoomForDetails={(room) => setDetailedRoom(room)}
            onBookRoomViaWhatsApp={(roomId) => handleOpenBookingModal(roomId)}
            onOpenGeneralBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {/* PAGE 3: EVENTOS & PISCINA DEDICATED */}
        {activePage === 'eventos-piscina' && (
          <EventsAndPoolPage
            photos={photos}
            hotelConfig={hotelConfig}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {/* PAGE 4: HORARIOS DE FERRIES & TRANSPORTE */}
        {activePage === 'transporte' && (
          <TransportPage
            hotelConfig={hotelConfig}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {/* PAGE 5: GALERÍA DE FOTOS DEDICATED */}
        {activePage === 'galeria' && (
          <div className="pt-16">
            <PhotoGallerySection
              photos={photos}
              onBookExperienceViaWhatsApp={handleBookExperienceViaWhatsApp}
            />
          </div>
        )}

        {/* PAGE 6: UBICACIÓN Y CONTACTO DEDICATED */}
        {activePage === 'contacto' && (
          <div className="pt-16">
            <LocationSection
              onOpenBookingModal={() => handleOpenBookingModal()}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenBookingModal={() => handleOpenBookingModal()}
        hotelConfig={hotelConfig}
        onOpenAdminPanel={() => {
          setIsAdminRoute(true);
          window.location.hash = '#admin';
        }}
        onNavigate={handleNavigate}
      />

      {/* Modals & Floating Overlays */}
      
      {/* WhatsApp Booking System Modal */}
      <WhatsAppBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialRoomId={selectedRoomId || (rooms[0] ? rooms[0].id : undefined)}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialAdults={adults}
        initialChildren={childrenCount}
        hotelConfig={hotelConfig}
        onUpdateHotelConfig={handleSaveHotelConfig}
        rooms={rooms}
      />

      {/* Room Details Modal */}
      <RoomDetailsModal
        room={detailedRoom}
        onClose={() => setDetailedRoom(null)}
        onSelectForBooking={(roomId) => handleOpenBookingModal(roomId)}
      />

      {/* Floating Concierge WhatsApp Button & Mobile Sticky Bar */}
      <WhatsAppFloatingButton
        onOpenBookingModal={() => handleOpenBookingModal()}
        hotelConfig={hotelConfig}
      />

    </div>
  );
}
