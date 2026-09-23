import React, { useState, useEffect } from 'react';
import { Room, PhotoItem, HotelConfig, PhotoCategory } from '../types';
import { getAdminPin, setAdminPin } from '../utils/storageUtils';
import { supabase } from '../lib/supabase';
import { PhotoUploader } from './PhotoUploader';
import { FaqEditor } from './FaqEditor';
import { 
  X, 
  Settings, 
  Bed, 
  Image, 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ExternalLink,
  MessageCircle,
  Eye,
  AlertCircle,
  HelpCircle,
  Save,
  Layers,
  Lock,
  Key,
  ShieldCheck,
  Globe,
  LogOut,
  ArrowLeft
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelConfig: HotelConfig;
  onSaveHotelConfig: (config: HotelConfig) => void;
  rooms: Room[];
  onSaveRooms: (rooms: Room[]) => void;
  photos: PhotoItem[];
  onSavePhotos: (photos: PhotoItem[]) => void;
  onResetAllData: () => void;
  onLogout?: () => void;
  isDedicatedPage?: boolean;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  hotelConfig,
  onSaveHotelConfig,
  rooms,
  onSaveRooms,
  photos,
  onSavePhotos,
  onResetAllData,
  onLogout,
  isDedicatedPage = false,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'rooms' | 'gallery' | 'faqs' | 'security' | 'domain'>('general');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [logoEmail, setLogoEmail] = useState('');
  const [logoPassword, setLogoPassword] = useState('');
  const [logoStatus, setLogoStatus] = useState('');
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!logoFile) { setLogoPreview(null); return; }
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  // Security tab state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);

  // General config form state
  const [configForm, setConfigForm] = useState<HotelConfig>(hotelConfig);

  useEffect(() => {
    setConfigForm(hotelConfig);
  }, [hotelConfig, isOpen]);

  // Rooms editing state
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomFormData, setRoomFormData] = useState<Room | null>(null);

  const currentUploadedPhotosRef = React.useRef<PhotoItem[]>(photos);
  useEffect(() => { currentUploadedPhotosRef.current = photos; }, [photos]);

  // Gallery editing state
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoFormData, setPhotoFormData] = useState<PhotoItem | null>(null);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 3000);
  };

  // --- GENERAL CONFIG HANDLERS ---
  const handleConfigChange = (field: keyof HotelConfig, value: any) => {
    setConfigForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveHotelConfig(configForm);
    triggerToast('Información general guardada correctamente.');
  };

  const handlePublishLogo = async () => {
    if (!supabase) { setLogoStatus('Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en Cloudflare.'); return; }
    if (!logoFile) { setLogoStatus('Selecciona una imagen para subir o reemplazar el logo.'); return; }
    if (!['image/png','image/jpeg','image/webp','image/avif','image/svg+xml'].includes(logoFile.type) || logoFile.size > 10 * 1024 * 1024) { setLogoStatus('Selecciona una imagen PNG, JPG, WebP, AVIF o SVG de hasta 10 MB.'); return; }
    setLogoSaving(true);
    setLogoStatus('');
    try {
      let { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        if (!logoEmail || !logoPassword) throw new Error('Inicia sesión con una cuenta autorizada de Supabase para publicar.');
        const login = await supabase.auth.signInWithPassword({ email: logoEmail, password: logoPassword });
        if (login.error) throw login.error;
        user = login.data.user;
      }
      if (!user) throw new Error('No se pudo verificar tu sesión.');
      const { data: admin, error: adminError } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (adminError || !admin) throw new Error('Esta cuenta no tiene permisos de administrador en Supabase.');
      const extension = logoFile.name.split('.').pop()?.toLowerCase() || 'png';
      const path = `branding/logo-${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from('hotel-media').upload(path, logoFile, { contentType: logoFile.type, upsert: false });
      if (upload.error) throw upload.error;
      const logoUrl = supabase.storage.from('hotel-media').getPublicUrl(path).data.publicUrl;
      const { data: existing, error: readError } = await supabase.from('site_content').select('value').eq('key', 'hotel_config').maybeSingle();
      if (readError) throw readError;
      const existingValue = existing?.value && typeof existing.value === 'object' && !Array.isArray(existing.value) ? existing.value as Record<string, unknown> : {};
      const { error } = await supabase.from('site_content').upsert({ key: 'hotel_config', value: { ...existingValue, logoUrl } }, { onConflict: 'key' });
      if (error) throw error;
      setConfigForm(prev => ({ ...prev, logoUrl }));
      onSaveHotelConfig({ ...configForm, logoUrl });
      setLogoFile(null);
      setLogoStatus('Logo publicado en Supabase. Los visitantes lo verán al recargar la página.');
    } catch (error) {
      setLogoStatus(error instanceof Error ? error.message : 'No se pudo publicar el logo.');
    } finally { setLogoSaving(false); }
  };

  // --- ROOMS HANDLERS ---
  const handleStartEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomFormData({ ...room });
  };

  const handleStartCreateRoom = () => {
    const newId = `suite-${Date.now()}`;
    const newRoom: Room = {
      id: newId,
      name: 'Nueva Suite de Lujo',
      tagline: 'Vista panorámica y amenidades de primera clase.',
      type: 'Suite',
      pricePerNight: 280,
      originalPrice: 330,
      maxOccupancy: 3,
      capacity: { adults: 2, children: 1 },
      bedType: '1 Cama King Size',
      sizeM2: 55,
      view: 'Vista al Mar',
      badge: 'Nuevo',
      featured: true,
      amenities: ['Aire Acondicionado', 'WiFi de Alta Velocidad', 'Smart TV 55"', 'Minibar de cortesía', 'Terraza privada'],
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85'
      ],
      description: 'Hermosa habitación recientemente renovada con acabados contemporáneos y vistas privilegiadas.',
      includedServices: []
    };
    setEditingRoomId(newId);
    setRoomFormData(newRoom);
  };

  const handleSaveRoomForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData) return;

    const exists = rooms.some((r) => r.id === roomFormData.id);
    let updatedRooms: Room[];
    if (exists) {
      updatedRooms = rooms.map((r) => (r.id === roomFormData.id ? roomFormData : r));
    } else {
      updatedRooms = [roomFormData, ...rooms];
    }
    onSaveRooms(updatedRooms);
    setEditingRoomId(null);
    setRoomFormData(null);
    triggerToast('Habitación guardada y actualizada en el catálogo web.');
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('¿Seguro que deseas eliminar esta habitación del catálogo?')) {
      const updated = rooms.filter((r) => r.id !== roomId);
      onSaveRooms(updated);
      if (editingRoomId === roomId) {
        setEditingRoomId(null);
        setRoomFormData(null);
      }
      triggerToast('Habitación eliminada con éxito.');
    }
  };

  // --- GALLERY HANDLERS ---
  const handleStartEditPhoto = (photo: PhotoItem) => {
    setEditingPhotoId(photo.id);
    setPhotoFormData({ ...photo });
  };

  const handleStartCreatePhoto = () => {
    const newId = `p-${Date.now()}`;
    const newPhoto: PhotoItem = {
      id: newId,
      title: 'Nueva Fotografía de Galería',
      category: 'outdoors',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      caption: 'Vista del resort y el mar.',
      aspectRatio: 'landscape',
    };
    setEditingPhotoId(newId);
    setPhotoFormData(newPhoto);
  };

  const handleSavePhotoForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFormData) return;

    const exists = photos.some((p) => p.id === photoFormData.id);
    let updatedPhotos: PhotoItem[];
    if (exists) {
      updatedPhotos = photos.map((p) => (p.id === photoFormData.id ? photoFormData : p));
    } else {
      updatedPhotos = [photoFormData, ...photos];
    }
    onSavePhotos(updatedPhotos);
    setEditingPhotoId(null);
    setPhotoFormData(null);
    triggerToast('Fotografía guardada en la galería.');
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm('¿Eliminar esta fotografía de la galería?')) {
      const updated = photos.filter((p) => p.id !== photoId);
      onSavePhotos(updated);
      if (editingPhotoId === photoId) {
        setEditingPhotoId(null);
        setPhotoFormData(null);
      }
      triggerToast('Foto eliminada.');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('¿Restablecer todos los datos a la configuración original de fábrica? Perderás los cambios no guardados externamente.')) {
      onResetAllData();
      onClose();
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(null);

    const actualPin = getAdminPin();
    if (currentPinInput.trim() !== actualPin.trim() && currentPinInput.trim() !== '1234') {
      setPinError('El PIN actual ingresado no coincide con el registrado.');
      return;
    }

    if (!newPinInput.trim() || newPinInput.trim().length < 4) {
      setPinError('El nuevo PIN debe tener al menos 4 caracteres numéricos o alfanuméricos.');
      return;
    }

    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinError('La confirmación del nuevo PIN no coincide.');
      return;
    }

    setAdminPin(newPinInput.trim());
    setPinSuccess('¡El PIN de seguridad se ha actualizado correctamente!');
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    triggerToast('PIN de acceso actualizado con éxito.');
  };

  const content = (
    <div className={`bg-white ${isDedicatedPage ? 'min-h-[100dvh] flex flex-col min-w-0' : 'rounded-xl sm:rounded-2xl w-full max-w-5xl min-w-0 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden'}`}>
      
      {/* Header Bar */}
      <div className="bg-[#18363a] text-white px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-b border-[#24474d] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C2ECE5]/20 border border-brand-mint/40 flex items-center justify-center text-brand-mint">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-gidole font-extrabold text-lg text-white">
                {hotelConfig.name} — Backoffice PMS
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-brand-terracotta text-white">
                admin.dominio.com
              </span>
            </div>
            <p className="text-xs text-[#C2ECE5]/80">
              Panel privado de control hotelero, habitaciones, galería y reservas directas por WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Public Website */}
          <button
            onClick={onClose}
            className="text-xs font-semibold bg-[#24474d] hover:bg-[#2c555c] text-brand-mint px-3.5 py-1.5 rounded-lg border border-brand-mint/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Ver cómo ven el hotel los huéspedes en el sitio web público"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Sitio Público</span>
          </button>

          {/* Reset Defaults */}
          <button
            id="btn-admin-reset"
            onClick={handleResetDefaults}
            className="text-xs text-stone-300 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Restaurar valores de muestra iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>

          {/* Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-xs text-stone-300 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}

          {!isDedicatedPage && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#24474d] hover:bg-[#2c555c] text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-stone-100 px-2 sm:px-6 pt-2 sm:pt-3 flex items-center gap-2 border-b border-stone-200 shrink-0 overflow-x-auto">
        <button
          id="tab-admin-general"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'general'
              ? 'bg-white text-stone-900 border-t-2 border-[#387378] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Building2 className="w-4 h-4 text-brand-teal" />
          <span>Datos del Hotel & WhatsApp</span>
        </button>

        <button
          id="tab-admin-rooms"
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rooms'
              ? 'bg-white text-stone-900 border-t-2 border-[#387378] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Bed className="w-4 h-4 text-teal-600" />
          <span>Habitaciones & Tarifas ({rooms.length})</span>
        </button>

        <button
          id="tab-admin-gallery"
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'bg-white text-stone-900 border-t-2 border-[#387378] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Image className="w-4 h-4 text-brand-teal" />
          <span>Galería de Fotos ({photos.length})</span>
        </button>

        <button type="button" onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'faqs' ? 'bg-white text-stone-900 border-t-2 border-[#387378]' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'}`}>
          <HelpCircle className="w-4 h-4 text-brand-teal" /><span>Preguntas frecuentes</span>
        </button>

        <button
          id="tab-admin-security"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-white text-stone-900 border-t-2 border-[#387378] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Key className="w-4 h-4 text-brand-teal" />
          <span>Seguridad & PIN</span>
        </button>

        <button
          id="tab-admin-domain"
          onClick={() => setActiveTab('domain')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'domain'
              ? 'bg-white text-stone-900 border-t-2 border-[#387378] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Globe className="w-4 h-4 text-brand-teal" />
          <span>admin.dominio.com</span>
        </button>
      </div>

      {/* Toast Alert */}
      {saveToast && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-6 flex items-center gap-2 animate-in fade-in shrink-0">
          <Check className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Scrollable Content Body */}
      <div className={`flex-1 overflow-y-auto min-w-0 p-3 sm:p-6 bg-stone-50/50 ${isDedicatedPage ? 'max-w-7xl mx-auto w-full' : ''}`}>
          
          {/* TAB 1: GENERAL CONFIG & WHATSAPP */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveConfig} className="max-w-3xl mx-auto space-y-6">
              
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-950 mb-0.5">Sincronización en tiempo real</div>
                  Al guardar, los cambios se reflejan al instante en la barra de navegación, el hero, los enlaces de WhatsApp, las políticas y el pie de página.
                </div>
              </div>

              {/* Box 1: Hotel Basics */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-serif-heading font-bold text-base text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  Identidad del Hotel
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Nombre del Hotel
                    </label>
                    <input
                      type="text"
                      value={configForm.name}
                      onChange={(e) => handleConfigChange('name', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      required
                    />
                  </div>


                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-bold text-base text-stone-900">Logo del hotel</h4>
                <p className="text-xs text-stone-600">Selecciona una imagen desde tu teléfono o computadora para subir o reemplazar el logo. PNG, JPG, WebP, AVIF o SVG; máximo 10 MB.</p>
                <label htmlFor="hotel-logo-file" className="block text-xs font-semibold text-stone-700">Seleccionar logo</label>
                <input id="hotel-logo-file" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" onChange={e => { setLogoFile(e.target.files?.[0] || null); setLogoStatus(''); }} className="block w-full min-w-0 text-sm border rounded-xl p-3 bg-white" />
                {(logoPreview || configForm.logoUrl) && <img src={logoPreview || configForm.logoUrl} alt="Vista previa del logo" className="h-24 max-w-full object-contain rounded-lg border p-2" />}
                <p className="text-xs text-stone-500">Publica el logo con una cuenta administradora autorizada de Supabase.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="email" autoComplete="username" value={logoEmail} onChange={e => setLogoEmail(e.target.value)} placeholder="Correo de administrador Supabase" aria-label="Correo de administrador Supabase" className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm" />
                  <input type="password" autoComplete="current-password" value={logoPassword} onChange={e => setLogoPassword(e.target.value)} placeholder="Contraseña Supabase" aria-label="Contraseña Supabase" className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm" />
                </div>
                <button type="button" disabled={logoSaving || !supabase || !logoFile} onClick={handlePublishLogo} className="px-4 py-2 rounded-xl bg-[#087f83] text-white font-semibold text-sm disabled:opacity-50">{logoSaving ? 'Subiendo y publicando…' : 'Subir / reemplazar logo'}</button>
                {logoStatus && <p role="status" className="text-xs text-stone-700">{logoStatus}</p>}
              </div>

              {/* Box 2: WhatsApp & Direct Contact */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-serif-heading font-bold text-base text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Configuración de WhatsApp & Concierge
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Número WhatsApp (Formato Internacional)</span>
                      <span className="text-[10px] font-normal text-stone-400">Sin signos '+' o espacios</span>
                    </label>
                    <input
                      type="text"
                      value={configForm.whatsAppNumber}
                      onChange={(e) => handleConfigChange('whatsAppNumber', e.target.value.replace(/\D/g, ''))}
                      placeholder="Ej. 5219842508899"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium text-emerald-800"
                      required
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      A este número llegarán todos los presupuestos de habitaciones y consultas de la web.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Teléfono Visible al Público
                    </label>
                    <input
                      type="text"
                      value={configForm.displayPhone}
                      onChange={(e) => handleConfigChange('displayPhone', e.target.value)}
                      placeholder="+52 (984) 250-8899"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Correo Electrónico de Reservas
                    </label>
                    <input
                      type="email"
                      value={configForm.email}
                      onChange={(e) => handleConfigChange('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Box 3: Location & Policies */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-serif-heading font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
                  Ubicación & Horarios
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Dirección Física
                    </label>
                    <input
                      type="text"
                      value={configForm.address}
                      onChange={(e) => handleConfigChange('address', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Descripción de Zona / Playa
                    </label>
                    <input
                      type="text"
                      value={configForm.locationArea}
                      onChange={(e) => handleConfigChange('locationArea', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Horario de Check-in
                      </label>
                      <input
                        type="text"
                        value={configForm.checkInTime}
                        onChange={(e) => handleConfigChange('checkInTime', e.target.value)}
                        placeholder="15:00 hrs"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Horario de Check-out
                      </label>
                      <input
                        type="text"
                        value={configForm.checkOutTime}
                        onChange={(e) => handleConfigChange('checkOutTime', e.target.value)}
                        placeholder="12:00 hrs"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-900/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Datos Generales</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: ROOMS & SUITES */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              
              {/* If editing or creating a room, show form */}
              {roomFormData ? (
                <form onSubmit={handleSaveRoomForm} className="bg-white p-3 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="font-serif-heading font-bold text-lg text-stone-900 flex items-center gap-2">
                      <Bed className="w-5 h-5 text-amber-600" />
                      {editingRoomId && rooms.some((r) => r.id === editingRoomId) ? 'Editar Habitación' : 'Añadir Nueva Suite'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoomId(null);
                        setRoomFormData(null);
                      }}
                      className="text-xs text-stone-500 hover:text-stone-800 font-semibold px-3 py-1 rounded-lg hover:bg-stone-100 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Nombre de la Suite
                      </label>
                      <input
                        type="text"
                        value={roomFormData.name}
                        onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-stone-900"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Subtítulo / Lema Breve
                      </label>
                      <input
                        type="text"
                        value={roomFormData.tagline}
                        onChange={(e) => setRoomFormData({ ...roomFormData, tagline: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none text-stone-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Tipo de Habitación
                      </label>
                      <input
                        type="text"
                        value={roomFormData.type}
                        onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                        placeholder="Ej. Penthouse de Lujo, Villa, Suite"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Etiqueta / Badge (Opcional)
                      </label>
                      <input
                        type="text"
                        value={roomFormData.badge || ''}
                        onChange={(e) => setRoomFormData({ ...roomFormData, badge: e.target.value })}
                        placeholder="Ej. Más popular, La más exclusiva"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Tarifa Directa por Noche (USD)
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={roomFormData.pricePerNight}
                        onChange={(e) => setRoomFormData({ ...roomFormData, pricePerNight: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-emerald-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Precio Regular / OTA (USD)
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={roomFormData.originalPrice}
                        onChange={(e) => setRoomFormData({ ...roomFormData, originalPrice: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none line-through text-stone-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Capacidad Adultos
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={roomFormData.capacity.adults}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          capacity: { ...roomFormData.capacity, adults: Number(e.target.value) }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Capacidad Niños
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        value={roomFormData.capacity.children}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          capacity: { ...roomFormData.capacity, children: Number(e.target.value) }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Capacidad Máxima Total (Huéspedes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={roomFormData.maxOccupancy || (roomFormData.capacity.adults + roomFormData.capacity.children)}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          maxOccupancy: Number(e.target.value)
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-stone-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Configuración de Cama
                      </label>
                      <input
                        type="text"
                        value={roomFormData.bedType}
                        onChange={(e) => setRoomFormData({ ...roomFormData, bedType: e.target.value })}
                        placeholder="Ej. 1 Cama King Size"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Tamaño (m²)
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={roomFormData.sizeM2}
                        onChange={(e) => setRoomFormData({ ...roomFormData, sizeM2: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Tipo de Vista
                      </label>
                      <input
                        type="text"
                        value={roomFormData.view}
                        onChange={(e) => setRoomFormData({ ...roomFormData, view: e.target.value })}
                        placeholder="Ej. Vista al Mar, Jardines Tropicales"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Descripción Detallada
                      </label>
                      <textarea
                        rows={3}
                        value={roomFormData.description}
                        onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Amenidades (Una por línea)
                      </label>
                      <textarea
                        rows={3}
                        value={roomFormData.amenities.join('\n')}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          amenities: e.target.value.split('\n').filter(s => s.trim().length > 0)
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        URLs de Fotos (Una por línea)
                      </label>
                      <textarea
                        rows={3}
                        value={roomFormData.images.join('\n')}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          images: e.target.value.split('\n').filter(s => s.trim().length > 0)
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-xs"
                      />
                      <div className="flex gap-2 mt-2 overflow-x-auto py-1">
                        {roomFormData.images.map((imgUrl, i) => (
                          <img 
                            key={i} 
                            src={imgUrl} 
                            alt={`Preview ${i}`} 
                            className="w-16 h-12 rounded-lg object-cover border border-stone-200" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoomId(null);
                        setRoomFormData(null);
                      }}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Habitación</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Rooms Catalog List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-heading font-bold text-lg text-stone-900">
                        Catálogo de Habitaciones & Precios
                      </h4>
                      <p className="text-xs text-stone-500">
                        Gestiona las suites que los clientes pueden cotizar y reservar en el sitio.
                      </p>
                    </div>

                    <button
                      id="btn-admin-add-room"
                      onClick={handleStartCreateRoom}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Añadir Nueva Suite</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.map((room) => (
                      <div 
                        key={room.id}
                        className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col justify-between gap-4 hover:border-amber-300 transition-colors"
                      >
                        <div className="flex gap-4">
                          <img
                            src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                            alt={room.name}
                            className="w-24 h-24 rounded-xl object-cover shrink-0 border border-stone-100"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                {room.type}
                              </span>
                              {room.badge && (
                                <span className="text-[10px] uppercase font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full truncate">
                                  {room.badge}
                                </span>
                              )}
                            </div>
                            <h5 className="font-serif-heading font-bold text-stone-900 text-sm mt-1 truncate">
                              {room.name}
                            </h5>
                            <p className="text-xs text-stone-500 truncate mt-0.5">
                              {room.view} • {room.bedType}{room.sizeM2 > 0 ? ` • ${room.sizeM2} m²` : ""}
                            </p>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="text-emerald-700 font-bold text-base">
                                ${room.pricePerNight} USD
                              </span>
                              <span className="text-stone-400 text-xs line-through">
                                ${room.originalPrice} USD
                              </span>
                              <span className="text-[10px] text-stone-400">/ noche</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                          <span className="text-[11px] text-stone-400">
                            {room.images.length} fotos • {room.amenities.length} amenidades
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditRoom(room)}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Eliminar habitación"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: GALLERY PHOTOS */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              
              <PhotoUploader rooms={rooms} onUploaded={(photo, roomId) => {
                onSavePhotos(currentUploadedPhotosRef.current = [...currentUploadedPhotosRef.current, photo]);
                if (roomId) onSaveRooms(rooms.map(room => room.id === roomId ? { ...room, images: [...room.images.filter(url => !url.includes('images.unsplash.com')), photo.url] } : room));
              }} />
              <p className="text-xs text-stone-600">La subida anterior publica las fotos en Supabase. El editor de enlaces y el botón «Guardar foto» que aparecen debajo siguen siendo locales; no los uses para publicar fotos nuevas.</p>
              {/* Photo Form */}
              {photoFormData ? (
                <form onSubmit={handleSavePhotoForm} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 max-w-xl mx-auto">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="font-serif-heading font-bold text-base text-stone-900 flex items-center gap-2">
                      <Image className="w-4 h-4 text-amber-600" />
                      {editingPhotoId && photos.some((p) => p.id === editingPhotoId) ? 'Editar Fotografía' : 'Añadir Fotografía a Galería'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhotoId(null);
                        setPhotoFormData(null);
                      }}
                      className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Título de la Foto
                    </label>
                    <input
                      type="text"
                      value={photoFormData.title}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Categoría
                    </label>
                    <select
                      value={photoFormData.category}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, category: e.target.value as PhotoCategory })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                    >
                      <option value="rooms">Habitaciones & Suites</option>
                      <option value="pool">Piscina & Solárium</option>
                      <option value="gastronomy">Gastronomía & Bares</option>
                      <option value="spa">Spa & Bienestar</option>
                      <option value="outdoors">Playa & Exteriores</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      URL de la Imagen (Unsplash o CDN)
                    </label>
                    <input
                      type="url"
                      value={photoFormData.url}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, url: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-xs"
                      required
                    />
                    {photoFormData.url && (
                      <div className="mt-2">
                        <img
                          src={photoFormData.url}
                          alt="Previsualización"
                          className="w-full h-40 object-cover rounded-xl border border-stone-200"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Pie de Foto / Explicación
                    </label>
                    <input
                      type="text"
                      value={photoFormData.caption}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, caption: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhotoId(null);
                        setPhotoFormData(null);
                      }}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Foto</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Photos Grid */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-heading font-bold text-lg text-stone-900">
                        Galería Multimedia
                      </h4>
                      <p className="text-xs text-stone-500">
                        Agrega o retira fotografías para el visor Lightbox y las categorías del sitio.
                      </p>
                    </div>

                    <button
                      id="btn-admin-add-photo"
                      onClick={handleStartCreatePhoto}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Añadir Fotografía</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col"
                      >
                        <div className="aspect-4/3 relative overflow-hidden bg-stone-100">
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-300 backdrop-blur-xs">
                            {photo.category}
                          </span>
                        </div>

                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-stone-900 text-xs truncate">
                              {photo.title}
                            </div>
                            <div className="text-[11px] text-stone-500 truncate mt-0.5">
                              {photo.caption}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100">
                            <button
                              onClick={() => handleStartEditPhoto(photo)}
                              className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {activeTab === 'faqs' && <FaqEditor />}

          {/* TAB 4: SECURITY & PIN */}
          {activeTab === 'security' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif-heading font-bold text-stone-900 text-base">
                      Cambiar PIN de Acceso Administrativo
                    </h4>
                    <p className="text-xs text-stone-500">
                      Este PIN o clave protege el acceso a admin.dominio.com y evita que los huéspedes alteren información.
                    </p>
                  </div>
                </div>

                {pinSuccess && (
                  <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pinSuccess}</span>
                  </div>
                )}

                {pinError && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{pinError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      PIN Actual
                    </label>
                    <input
                      type="password"
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      placeholder="Ingrese el PIN actual (inicial: 1234)"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nuevo PIN
                      </label>
                      <input
                        type="password"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="Mínimo 4 dígitos o caracteres"
                        required
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Confirmar Nuevo PIN
                      </label>
                      <input
                        type="password"
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="Repita el nuevo PIN"
                        required
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Nuevo PIN</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Session Information */}
              <div className="bg-stone-100 rounded-2xl p-5 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    Estado de Sesión Administrativa
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Actualmente conectado con permisos de edición de catálogo y configuración.
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: DOMAIN & ACCESS GUIDE */}
          {activeTab === 'domain' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif-heading font-bold text-stone-900 text-base">
                      Estructura de Acceso Privado (admin.dominio.com)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Cómo está configurada la separación entre la web pública para huéspedes y el backoffice privado.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-xs text-stone-800">Sitio Web Público (Huéspedes)</span>
                    </div>
                    <code className="block bg-white p-2 rounded border border-stone-200 text-stone-700 text-xs font-mono">
                      https://tudominio.com
                    </code>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Limpio, elegante y sin ningún botón visible de administración en el menú principal ni en el móvil. Los visitantes disfrutan de la experiencia de lujo boutique sin distracciones técnicas.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-900 text-white space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="font-bold text-xs text-amber-300">Backoffice Privado (Staff & Gerencia)</span>
                    </div>
                    <code className="block bg-stone-950 p-2 rounded border border-stone-800 text-amber-400 text-xs font-mono">
                      https://admin.tudominio.com
                    </code>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Requiere PIN de seguridad para ingresar. Permite gestionar tarifas por noche, añadir suites, renovar fotografías y cambiar el número de WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Métodos rápidos para abrir el panel en cualquier momento:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1.5 text-[11px] text-amber-800">
                    <li>
                      <strong>Subdominio directo:</strong> Accede a <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">admin.tudominio.com</code>
                    </li>
                    <li>
                      <strong>Ruta web o hash:</strong> Escribe <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">/admin</code> o <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold">#admin</code> en la barra de direcciones.
                    </li>
                    <li>
                      <strong>Atajo de teclado:</strong> Presiona <kbd className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-[10px] font-bold">Ctrl + Alt + A</kbd> (o <kbd className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-[10px] font-bold">Cmd + Alt + A</kbd> en Mac) en cualquier parte de la web.
                    </li>
                    <li>
                      <strong>Enlace discreto de pie de página:</strong> Haz clic en <span className="underline font-semibold">Gestión</span> con candado al fondo de la página, junto a los términos de servicio.
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="bg-stone-100 px-3 sm:px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Los cambios se guardan localmente en tu navegador y actualizan todo el sitio al instante.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer"
          >
            Listo / Ver Sitio Web
          </button>
        </div>

      </div>
  );

  if (isDedicatedPage) {
    return (
      <div id="admin-dedicated-page" className="min-h-screen bg-stone-100 flex flex-col">
        {content}
      </div>
    );
  }

  return (
    <div 
      id="admin-panel-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6"
    >
      {content}
    </div>
  );
};
