import React, { useState, useEffect } from 'react';
import { Room, PhotoItem, HotelConfig, PhotoCategory } from '../types';
import { supabase } from '../lib/supabase';
import { PhotoUploader } from './PhotoUploader';
import { FaqEditor } from './FaqEditor';
import { ReservationsCalendar } from './ReservationsCalendar';
import { 
  X, 
  Settings, 
  Bed, 
  Image, 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Save,
  Lock,
  LogOut,
  CalendarDays,
  Waves,
  Bus
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
  onLogout,
  isDedicatedPage = false,
}) => {
  const adminTabs = ['calendar','general','services','transport','rooms','gallery'] as const;
  type AdminTab = typeof adminTabs[number];
  const initialAdminTab = (): AdminTab => { if (typeof window === 'undefined') return 'general'; const tab=new URLSearchParams(window.location.search).get('tab') as AdminTab | null; return tab && adminTabs.includes(tab) ? tab : 'general'; };
  const [activeTab, setActiveTab] = useState<AdminTab>(initialAdminTab);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [logoStatus, setLogoStatus] = useState('');
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconStatus, setFaviconStatus] = useState('');
  const [faviconSaving, setFaviconSaving] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroStatus, setHeroStatus] = useState('');
  const [heroSaving, setHeroSaving] = useState(false);
  const [replacingPhoto, setReplacingPhoto] = useState<PhotoItem | null>(null);
  const [galleryStatus, setGalleryStatus] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('');
  const [busRoutes, setBusRoutes] = useState<Array<{id:string; route:string; frequency:string; timeRange:string; notes:string; times:string[]}>>([]);
  const [ferrySchedules, setFerrySchedules] = useState<Array<{id:string; route:string; time:string; vessel:string; type:string; notes:string}>>([]);
  const [transportStatus, setTransportStatus] = useState('');
  const [busFilter, setBusFilter] = useState('');
  const [ferryFilter, setFerryFilter] = useState('');
  const [expandedBusId, setExpandedBusId] = useState<string | null>(null);
  const [transportSaving, setTransportSaving] = useState(false);
  const [savingBusRouteId, setSavingBusRouteId] = useState<string | null>(null);
  const [customRoomTypes, setCustomRoomTypes] = useState<string[]>([]);
  const [customBedTypes, setCustomBedTypes] = useState<string[]>([]);

  const roomTypeOptions = Array.from(new Set([
    'Habitación familiar',
    'Habitación matrimonial',
    ...rooms.map((room) => room.type).filter(Boolean),
    ...customRoomTypes,
  ]));
  const bedTypeOptions = Array.from(new Set([
    'Cama matrimonial',
    '1 cama individual y 2 camas dobles',
    '2 camas dobles',
    '1 cama individual',
    ...rooms.map((room) => room.bedType).filter(Boolean),
    ...customBedTypes,
  ]));

  const addCustomOption = (kind: 'type' | 'bed') => {
    const label = kind === 'type' ? 'tipo de habitación' : 'configuración de cama';
    const value = window.prompt(`Nueva ${label}:`)?.trim();
    if (!value || !roomFormData) return;
    if (kind === 'type') {
      setCustomRoomTypes((current) => Array.from(new Set([...current, value])));
      setRoomFormData({ ...roomFormData, type: value });
    } else {
      setCustomBedTypes((current) => Array.from(new Set([...current, value])));
      setRoomFormData({ ...roomFormData, bedType: value });
    }
  };
  useEffect(() => {
    if (!isDedicatedPage || typeof window === 'undefined') return;
    const url = new URL(window.location.href); url.searchParams.set('tab', activeTab); window.history.replaceState({}, '', url);
  }, [activeTab, isDedicatedPage]);

  useEffect(() => {
    if (!logoFile) { setLogoPreview(null); return; }
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  // General config form state
  const [configForm, setConfigForm] = useState<HotelConfig>(hotelConfig);

  useEffect(() => {
    setConfigForm(hotelConfig);
  }, [hotelConfig, isOpen]);

  useEffect(() => {
    if (!isOpen || !supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      const metadataName = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.first_name;
      const emailName = user.email?.split('@')[0]?.split(/[._-]/)[0];
      const rawName = String(metadataName || emailName || '').trim();
      if (rawName) setAdminName(rawName.charAt(0).toUpperCase() + rawName.slice(1));
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !supabase) return;
    void supabase.from('transport_schedules').select('id,details').eq('category','bus').then(({data,error}) => {
      if (error) { setTransportStatus(error.message); return; }
      setBusRoutes((data || []).map((row: any) => ({ id: row.id, route: row.details?.route || '', frequency: row.details?.frequency || '', timeRange: row.details?.timeRange || '', notes: row.details?.notes || '', times: Array.isArray(row.details?.times) ? row.details.times : [] })));
    });
    void supabase.from('transport_schedules').select('id,details').eq('category','ferry').then(({data,error}) => {
      if (error) { setTransportStatus(error.message); return; }
      setFerrySchedules((data || []).map((row:any)=>({id:row.id,route:row.details?.route||'',time:row.details?.time||'',vessel:row.details?.vessel||'',type:row.details?.type||'',notes:row.details?.notes||''})));
    });
  }, [isOpen]);

  const saveBusRoute = async (route: {id:string; route:string; frequency:string; timeRange:string; notes:string; times:string[]}) => {
    if (!supabase) { setTransportStatus('Supabase no está configurado.'); return; }
    setTransportSaving(true); setSavingBusRouteId(route.id); setTransportStatus('');
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Tu sesión administrativa expiró. Vuelve a iniciar sesión.');
      const admin = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (admin.error || !admin.data) throw new Error('Tu cuenta no tiene permisos para editar la guía.');
      const current = await supabase.from('transport_schedules').select('details').eq('id', route.id).maybeSingle();
      if (current.error || !current.data) throw new Error(current.error?.message || 'No se encontró esta ruta.');
      const details = current.data.details && typeof current.data.details === 'object' && !Array.isArray(current.data.details) ? current.data.details as Record<string,unknown> : {};
      const cleanTimes = route.times.filter(Boolean);
      const saved = await supabase.from('transport_schedules').update({ details: { ...details, route:route.route.trim(), frequency:route.frequency.trim(), timeRange:route.timeRange.trim(), notes:route.notes.trim(), times:cleanTimes } }).eq('id',route.id).select('id,details').maybeSingle();
      if (saved.error || !saved.data) throw new Error(saved.error?.message || 'Supabase no confirmó el guardado.');
      const d:any = saved.data.details || {};
      setBusRoutes(prev=>prev.map(x=>x.id===route.id?{...x,route:d.route||'',frequency:d.frequency||'',timeRange:d.timeRange||'',notes:d.notes||'',times:Array.isArray(d.times)?d.times:[]}:x));
      setTransportStatus(`✓ Guardado: ${d.route || route.route}`);
    } catch (error) {
      setTransportStatus(error instanceof Error ? `Error: ${error.message}` : 'No se pudo guardar la ruta.');
    } finally {
      setTransportSaving(false); setSavingBusRouteId(null);
    }
  };

  const addBusRoute = async () => {
    if (!supabase) return;
    setTransportSaving(true); setTransportStatus('');
    const details={route:'Nueva ruta',frequency:'',timeRange:'',notes:'',times:[] as string[]};
    const saved=await supabase.from('transport_schedules').insert({category:'bus',details}).select('id,details').single();
    setTransportSaving(false);
    if(saved.error || !saved.data){setTransportStatus(saved.error?.message || 'No se pudo crear la ruta.');return;}
    setBusRoutes(prev=>[...prev,{id:saved.data.id, ...details}]); setTransportStatus('Nueva ruta creada. Completa los datos y guarda.');
  };

  const deleteBusRoute = async (id:string) => {
    if (!supabase || !window.confirm('¿Eliminar esta ruta de bus de la guía?')) return;
    const deleted=await supabase.from('transport_schedules').delete().eq('id',id).select('id').maybeSingle();
    if(deleted.error || !deleted.data){setTransportStatus(deleted.error?.message || 'No se pudo eliminar la ruta.');return;}
    setBusRoutes(prev=>prev.filter(row=>row.id!==id)); setTransportStatus('Ruta eliminada.');
  };

  const addBusTime = (id:string) => setBusRoutes(prev=>prev.map(x=>x.id===id?{...x,times:[...x.times,'']}:x));
  const updateBusTime = (id:string,index:number,value:string) => setBusRoutes(prev=>prev.map(x=>x.id===id?{...x,times:x.times.map((t,i)=>i===index?value:t)}:x));
  const removeBusTime = (id:string,index:number) => setBusRoutes(prev=>prev.map(x=>x.id===id?{...x,times:x.times.filter((_,i)=>i!==index)}:x));

  const saveFerrySchedule = async (item:{id:string;route:string;time:string;vessel:string;type:string;notes:string}) => { if(!supabase)return; setTransportSaving(true); const {data:existing}=await supabase.from('transport_schedules').select('details').eq('id',item.id).maybeSingle(); const details=existing?.details&&typeof existing.details==='object'?existing.details as Record<string,unknown>:{}; const saved=await supabase.from('transport_schedules').update({details:{...details,route:item.route,time:item.time,vessel:item.vessel,type:item.type,notes:item.notes}}).eq('id',item.id).select('id').maybeSingle(); setTransportSaving(false); setTransportStatus(saved.error||!saved.data?(saved.error?.message||'No se pudo guardar el horario.'):'Horario acuático publicado.'); };
  const addFerrySchedule = async () => { if(!supabase)return; setTransportSaving(true); const details={route:'San Jorge → Moyogalpa',time:'',vessel:'',type:'',notes:''}; const saved=await supabase.from('transport_schedules').insert({category:'ferry',details}).select('id,details').single(); setTransportSaving(false); if(saved.error||!saved.data){setTransportStatus(saved.error?.message||'No se pudo crear el horario.');return;} setFerrySchedules(prev=>[...prev,{id:saved.data.id,...details}]); };
  const deleteFerrySchedule = async(id:string)=>{if(!supabase||!window.confirm('¿Eliminar este horario acuático?'))return;const d=await supabase.from('transport_schedules').delete().eq('id',id).select('id').maybeSingle();if(d.error||!d.data){setTransportStatus(d.error?.message||'No se pudo eliminar.');return;}setFerrySchedules(prev=>prev.filter(x=>x.id!==id));};

  // Rooms editing state
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomFormData, setRoomFormData] = useState<Room | null>(null);
  const [roomPhotoStatus, setRoomPhotoStatus] = useState('');
  const [roomPhotoBusy, setRoomPhotoBusy] = useState(false);

  const currentUploadedPhotosRef = React.useRef<PhotoItem[]>(photos);
  useEffect(() => { currentUploadedPhotosRef.current = photos; }, [photos]);

  // Gallery editing state
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoFormData, setPhotoFormData] = useState<PhotoItem | null>(null);

  if (!isOpen) return null;

  const storagePathFromUrl = (url?: string) => {
    if (!url) return null;
    const marker = '/storage/v1/object/public/hotel-media/';
    const at = url.indexOf(marker);
    return at >= 0 ? decodeURIComponent(url.slice(at + marker.length).split('?')[0]) : null;
  };

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

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { triggerToast('Supabase no está disponible.'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { triggerToast('Tu sesión expiró. Vuelve a iniciar sesión.'); return; }
    const admin = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
    if (admin.error || !admin.data) { triggerToast('Tu cuenta no tiene permisos para publicar.'); return; }
    const saved = await supabase.from('site_content').upsert({ key: 'hotel_config', value: configForm }, { onConflict: 'key' }).select('key').maybeSingle();
    if (saved.error || !saved.data) { triggerToast(saved.error?.message || 'No se pudo publicar la información.'); return; }
    onSaveHotelConfig(configForm);
    triggerToast('Información publicada en Supabase.');
  };

  const handlePublishLogo = async () => {
    if (!supabase) { setLogoStatus('Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en Cloudflare.'); return; }
    if (!logoFile) { setLogoStatus('Selecciona una imagen para subir o reemplazar el logo.'); return; }
    if (!['image/png','image/jpeg','image/webp','image/avif','image/svg+xml'].includes(logoFile.type) || logoFile.size > 10 * 1024 * 1024) { setLogoStatus('Selecciona una imagen PNG, JPG, WebP, AVIF o SVG de hasta 10 MB.'); return; }
    setLogoSaving(true);
    setLogoStatus('');
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Tu sesión administrativa expiró. Cierra sesión y vuelve a ingresar.');
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

  const handlePublishFavicon = async () => {
    if (!supabase) { setFaviconStatus('Supabase no está configurado.'); return; }
    if (!faviconFile) { setFaviconStatus('Selecciona una imagen para el favicon.'); return; }
    if (!['image/png','image/jpeg','image/webp','image/svg+xml','image/x-icon','image/vnd.microsoft.icon'].includes(faviconFile.type) || faviconFile.size > 2 * 1024 * 1024) { setFaviconStatus('Usa PNG, JPG, WebP, SVG o ICO de hasta 2 MB.'); return; }
    setFaviconSaving(true); setFaviconStatus('');
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Tu sesión administrativa expiró. Vuelve a iniciar sesión.');
      const { data: admin, error: adminError } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (adminError || !admin) throw new Error('Esta cuenta no tiene permisos de administrador.');
      const extension = faviconFile.name.split('.').pop()?.toLowerCase() || 'png';
      const path = `branding/favicon-${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from('hotel-media').upload(path, faviconFile, { contentType: faviconFile.type, upsert: false });
      if (upload.error) throw upload.error;
      const faviconUrl = supabase.storage.from('hotel-media').getPublicUrl(path).data.publicUrl;
      const { data: existing, error: readError } = await supabase.from('site_content').select('value').eq('key', 'hotel_config').maybeSingle();
      if (readError) throw readError;
      const existingValue = existing?.value && typeof existing.value === 'object' && !Array.isArray(existing.value) ? existing.value as Record<string, unknown> : {};
      const { error } = await supabase.from('site_content').upsert({ key: 'hotel_config', value: { ...existingValue, faviconUrl } }, { onConflict: 'key' });
      if (error) throw error;
      const updated = { ...configForm, faviconUrl };
      setConfigForm(updated); onSaveHotelConfig(updated); setFaviconFile(null);
      setFaviconStatus('Favicon publicado. Puede tardar un momento en reflejarse en la pestaña por la caché del navegador.');
    } catch (error) { setFaviconStatus(error instanceof Error ? error.message : 'No se pudo publicar el favicon.'); }
    finally { setFaviconSaving(false); }
  };

  const handlePublishHero = async () => {
    if (!supabase) { setHeroStatus('Supabase no está configurado.'); return; }
    if (!heroFile) { setHeroStatus('Selecciona una fotografía para la portada.'); return; }
    if (!['image/jpeg','image/png','image/webp','image/avif'].includes(heroFile.type) || heroFile.size > 10 * 1024 * 1024) { setHeroStatus('Usa JPG, PNG, WebP o AVIF de hasta 10 MB.'); return; }
    setHeroSaving(true); setHeroStatus('');
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Tu sesión administrativa expiró.');
      const admin = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (admin.error || !admin.data) throw new Error('Tu cuenta no tiene permisos de administrador.');
      const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'} as Record<string,string>)[heroFile.type];
      const path = `branding/hero-${crypto.randomUUID()}.${ext}`;
      const upload = await supabase.storage.from('hotel-media').upload(path, heroFile, { contentType: heroFile.type, upsert: false });
      if (upload.error) throw upload.error;
      const heroImageUrl = supabase.storage.from('hotel-media').getPublicUrl(path).data.publicUrl;
      const { data: existing, error: readError } = await supabase.from('site_content').select('value').eq('key', 'hotel_config').maybeSingle();
      if (readError) throw readError;
      const existingValue = existing?.value && typeof existing.value === 'object' && !Array.isArray(existing.value) ? existing.value as Record<string, unknown> : {};
      const saved = await supabase.from('site_content').upsert({ key:'hotel_config', value:{ ...existingValue, heroImageUrl } }, { onConflict:'key' }).select('key').maybeSingle();
      if (saved.error || !saved.data) throw new Error(saved.error?.message || 'No se pudo publicar la portada.');
      const updated = { ...configForm, heroImageUrl }; setConfigForm(updated); onSaveHotelConfig(updated); setHeroFile(null); setHeroStatus('Foto principal publicada correctamente.');
    } catch (error) { setHeroStatus(error instanceof Error ? error.message : 'No se pudo publicar la portada.'); }
    finally { setHeroSaving(false); }
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
      includedGuests: 2,
      extraGuestPrice: 0,
      view: 'Vista al Mar',
      badge: 'Nuevo',
      featured: true,
      amenities: ['Aire Acondicionado', 'WiFi de Alta Velocidad', 'Smart TV 55"', 'Minibar de cortesía', 'Terraza privada'],
      images: [],
      description: 'Hermosa habitación recientemente renovada con acabados contemporáneos y vistas privilegiadas.',
      includedServices: []
    };
    setEditingRoomId(newId);
    setRoomFormData(newRoom);
  };

  const handleSaveRoomForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData || !supabase) return;
    const saved = await supabase.from('rooms').upsert({ id: roomFormData.id, details: roomFormData }, { onConflict: 'id' }).select('id').maybeSingle();
    if (saved.error || !saved.data) { triggerToast(saved.error?.message || 'No se pudo publicar la habitación.'); return; }

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

  const handleUploadRoomPhotos = async (files: FileList | null) => {
    // Snapshot the FileList before any await/input reset. Mobile browsers can invalidate
    // the live FileList as soon as the file input value is cleared.
    const selectedFiles = files ? Array.from(files) : [];
    if (!supabase || !roomFormData || !selectedFiles.length) return;
    setRoomPhotoBusy(true); setRoomPhotoStatus('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Tu sesión administrativa expiró. Vuelve a iniciar sesión.');
      const admin = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (admin.error || !admin.data) throw new Error('Tu usuario no tiene permisos de administrador.');
      const urls: string[] = [];
      setRoomPhotoStatus(`Preparando ${selectedFiles.length} foto(s)…`);
      for (const file of selectedFiles) {
        if (!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type)) throw new Error('Usa fotografías JPG, PNG, WebP o AVIF.');
        if (file.size > 10 * 1024 * 1024) throw new Error('Cada fotografía debe pesar menos de 10 MB.');
      }
      setRoomPhotoStatus('Subiendo fotografías…');
      const uploaded = await Promise.all(selectedFiles.map(async file => {
        const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'} as Record<string,string>)[file.type];
        const path = `rooms/${roomFormData.id}/${crypto.randomUUID()}.${ext}`;
        const result = await supabase.storage.from('hotel-media').upload(path, file, { contentType: file.type, upsert: false });
        if (result.error) throw result.error;
        return { path, url: supabase.storage.from('hotel-media').getPublicUrl(path).data.publicUrl };
      }));
      urls.push(...uploaded.map(item => item.url));
      setRoomPhotoStatus('Guardando fotografías en la habitación…');
      const cleanExisting = (roomFormData.images || []).filter(url => !url.includes('images.unsplash.com'));
      const updatedRoom = { ...roomFormData, images: [...cleanExisting, ...urls] };
      const saved = await supabase.from('rooms').upsert({ id: updatedRoom.id, details: updatedRoom }, { onConflict: 'id' }).select('id').maybeSingle();
      if (saved.error || !saved.data) throw new Error(saved.error?.message || 'No se pudo guardar la habitación.');
      const newPhotos: PhotoItem[] = urls.map((url, i) => ({ id: crypto.randomUUID(), title: `${updatedRoom.name} ${cleanExisting.length+i+1}`, category: 'rooms', url, caption: '', roomTypeId: updatedRoom.id, aspectRatio: 'landscape' }));
      const galleryRows = newPhotos.map((photo, i) => ({ id: photo.id, category: 'rooms', image_path: photo.url, details: { title: photo.title, caption: '', roomTypeId: updatedRoom.id, aspectRatio: 'landscape' }, sort_order: Date.now()+i }));
      const gallerySaved = await supabase.from('gallery_photos').insert(galleryRows);
      if (gallerySaved.error) {
        await supabase.storage.from('hotel-media').remove(uploaded.map(item => item.path));
        throw new Error('No se pudieron registrar las fotos: ' + gallerySaved.error.message);
      }
      currentUploadedPhotosRef.current = [...currentUploadedPhotosRef.current, ...newPhotos];
      setRoomFormData(updatedRoom);
      onSaveRooms(rooms.some(room => room.id === updatedRoom.id) ? rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room) : [updatedRoom, ...rooms]);
      onSavePhotos(currentUploadedPhotosRef.current);
      setRoomPhotoStatus(`${urls.length} fotografía(s) añadidas correctamente.`);
    } catch (error) { setRoomPhotoStatus(error instanceof Error ? error.message : 'No se pudieron subir las fotografías.'); }
    finally { setRoomPhotoBusy(false); }
  };

  const handleSetPrimaryRoomPhoto = async (url: string) => {
    if (!supabase || !roomFormData) return;
    const images = [url, ...roomFormData.images.filter(image => image !== url)];
    const updatedRoom = { ...roomFormData, images };
    const saved = await supabase.from('rooms').upsert({ id: updatedRoom.id, details: updatedRoom }, { onConflict: 'id' });
    if (saved.error) { setRoomPhotoStatus(saved.error.message); return; }
    setRoomFormData(updatedRoom);
    onSaveRooms(rooms.some(room => room.id === updatedRoom.id) ? rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room) : [updatedRoom, ...rooms]);
    setRoomPhotoStatus('Portada de la habitación actualizada.');
  };

  const handleRemoveRoomPhoto = async (url: string) => {
    if (!supabase || !roomFormData) return;
    const updatedRoom = { ...roomFormData, images: roomFormData.images.filter(image => image !== url) };
    const saved = await supabase.from('rooms').upsert({ id: updatedRoom.id, details: updatedRoom }, { onConflict: 'id' });
    if (saved.error) { setRoomPhotoStatus(saved.error.message); return; }
    const linked = currentUploadedPhotosRef.current.filter(photo => photo.roomTypeId === updatedRoom.id && photo.url === url);
    for (const photo of linked) await supabase.from('gallery_photos').delete().eq('id', photo.id);
    const storagePath = storagePathFromUrl(url);
    if (storagePath) await supabase.storage.from('hotel-media').remove([storagePath]);
    currentUploadedPhotosRef.current = currentUploadedPhotosRef.current.filter(photo => !(photo.roomTypeId === updatedRoom.id && photo.url === url));
    setRoomFormData(updatedRoom); onSaveRooms(rooms.some(room => room.id === updatedRoom.id) ? rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room) : [updatedRoom, ...rooms]); onSavePhotos(currentUploadedPhotosRef.current);
    setRoomPhotoStatus('Fotografía retirada de la habitación.');
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (supabase && confirm('¿Seguro que deseas eliminar esta habitación del catálogo?')) {
      const deleted = await supabase.from('rooms').delete().eq('id', roomId);
      if (deleted.error) { triggerToast(deleted.error.message); return; }
      const linked = currentUploadedPhotosRef.current.filter(p => p.roomTypeId === roomId);
      if (linked.length) {
        await supabase.from('gallery_photos').delete().in('id', linked.map(p => p.id));
        const paths = linked.map(p => storagePathFromUrl(p.url)).filter((p): p is string => Boolean(p));
        if (paths.length) await supabase.storage.from('hotel-media').remove(paths);
      }
      currentUploadedPhotosRef.current = currentUploadedPhotosRef.current.filter(p => p.roomTypeId !== roomId);
      onSavePhotos(currentUploadedPhotosRef.current);
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
    const newId = crypto.randomUUID();
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

  const handleSavePhotoForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFormData || !supabase) return;
    const row = { id: photoFormData.id, category: photoFormData.category, image_path: photoFormData.url, details: { title: photoFormData.title, caption: photoFormData.caption || '', roomTypeId: photoFormData.roomTypeId || null, aspectRatio: photoFormData.aspectRatio || 'landscape' }, sort_order: Date.now() };
    const saved = await supabase.from('gallery_photos').upsert(row, { onConflict: 'id' }).select('id').maybeSingle();
    if (saved.error || !saved.data) { triggerToast(saved.error?.message || 'No se pudo publicar la fotografía.'); return; }

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

  const handleDeletePhoto = async (photoId: string) => {
    if (supabase && confirm('¿Eliminar esta fotografía de la galería?')) {
      const deleted = await supabase.from('gallery_photos').delete().eq('id', photoId);
      if (deleted.error) { triggerToast(deleted.error.message); return; }
      const removedPhoto = photos.find(p => p.id === photoId);
      const storagePath = storagePathFromUrl(removedPhoto?.url);
      if (storagePath) await supabase.storage.from('hotel-media').remove([storagePath]);
      const updated = photos.filter((p) => p.id !== photoId);
      onSavePhotos(updated);
      if (editingPhotoId === photoId) {
        setEditingPhotoId(null);
        setPhotoFormData(null);
      }
      triggerToast('Foto eliminada.');
    }
  };

  const content = (
    <div className={`bg-white ${isDedicatedPage ? 'min-h-[100dvh] flex flex-col min-w-0' : 'rounded-xl sm:rounded-2xl w-full max-w-5xl min-w-0 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden'}`}>
      
      {/* Header Bar */}
      <div className="bg-[#18363a] text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24474d] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#C2ECE5]/20 border border-brand-mint/40 flex items-center justify-center text-brand-mint">
            <Lock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-gidole font-extrabold text-base sm:text-lg text-white truncate">
                {hotelConfig.name} — Backoffice PMS
              </h3>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-brand-terracotta text-white">
                Panel privado
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#C2ECE5]/80 line-clamp-2">
              {adminName ? `Hola, ${adminName} · ` : ''}Administración privada de contenido, habitaciones y operación.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* View Public Website */}
          <button
            onClick={onClose}
            className="text-xs font-semibold bg-[#24474d] hover:bg-[#2c555c] text-brand-mint px-3.5 py-1.5 rounded-lg border border-brand-mint/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Ver cómo ven el hotel los huéspedes en el sitio web público"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver sitio</span>
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
      <div className="fixed sm:sticky bottom-0 sm:bottom-auto sm:top-0 left-0 right-0 z-50 bg-white px-1.5 sm:px-6 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:py-2.5 grid grid-cols-6 sm:flex sm:items-center gap-0.5 sm:gap-2 border-t sm:border-t-0 sm:border-b border-stone-200 shrink-0 sm:overflow-x-auto shadow-[0_-6px_24px_rgba(0,0,0,0.08)] sm:shadow-sm">
        <button type="button" onClick={() => setActiveTab('calendar')}
          className={`px-1 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0 ${activeTab === 'calendar' ? 'bg-teal-50 text-teal-900 border border-teal-200' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'}`}>
          <CalendarDays className="w-4 h-4 text-brand-teal" /><span>Calendario</span>
        </button>

        <button
          id="tab-admin-general"
          onClick={() => setActiveTab('general')}
          className={`px-1 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer min-w-0 ${
            activeTab === 'general'
              ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Building2 className="w-4 h-4 text-brand-teal" />
          <span className="truncate">Hotel</span>
        </button>

        <button type="button" onClick={() => setActiveTab('services')}
          className={`px-1 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0 ${activeTab === 'services' ? 'bg-teal-50 text-teal-900 border border-teal-200' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'}`}>
          <Waves className="w-4 h-4 text-brand-teal" /><span className="truncate">Servicios</span>
        </button>

        <button type="button" onClick={() => setActiveTab('transport')}
          className={`px-1 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0 ${activeTab === 'transport' ? 'bg-teal-50 text-teal-900 border border-teal-200' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'}`}>
          <Bus className="w-4 h-4 text-brand-teal" /><span className="truncate">Guía</span>
        </button>

        <button
          id="tab-admin-rooms"
          onClick={() => setActiveTab('rooms')}
          className={`px-1 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer min-w-0 ${
            activeTab === 'rooms'
              ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Bed className="w-4 h-4 text-teal-600" />
          <span className="truncate">Habitaciones</span>
        </button>

        <button
          id="tab-admin-gallery"
          onClick={() => setActiveTab('gallery')}
          className={`px-1 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer min-w-0 ${
            activeTab === 'gallery'
              ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Image className="w-4 h-4 text-brand-teal" />
          <span className="truncate">Galería</span>
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
      <div className={`flex-1 overflow-y-auto min-w-0 p-3 sm:p-6 pb-28 sm:pb-6 bg-stone-50/50 ${isDedicatedPage ? 'max-w-7xl mx-auto w-full' : ''}`}>
          
          {activeTab === 'calendar' && <ReservationsCalendar rooms={rooms} />}

          {/* TAB 1: GENERAL CONFIG & WHATSAPP */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveConfig} className="max-w-3xl mx-auto space-y-6">
              
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-950 mb-0.5">Sincronización en tiempo real</div>
                  Los cambios publicados se guardan en Supabase y la landing los carga desde allí. No se usan datos locales del navegador.
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
                <p className="text-xs text-emerald-700">Tu sesión administrativa actual se utilizará para publicar el logo.</p>
                <button type="button" disabled={logoSaving || !supabase || !logoFile} onClick={handlePublishLogo} className="px-4 py-2 rounded-xl bg-[#087f83] text-white font-semibold text-sm disabled:opacity-50">{logoSaving ? 'Subiendo y publicando…' : 'Subir / reemplazar logo'}</button>
                {logoStatus && <p role="status" className="text-xs text-stone-700">{logoStatus}</p>}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-bold text-base text-stone-900">Favicon del sitio</h4>
                <p className="text-xs text-stone-600">Sube el ícono que aparecerá en la pestaña del navegador. Recomendado: imagen cuadrada PNG, SVG o ICO.</p>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico" onChange={e => { setFaviconFile(e.target.files?.[0] || null); setFaviconStatus(''); }} className="block w-full min-w-0 text-sm border rounded-xl p-3 bg-white" />
                {configForm.faviconUrl && <img src={configForm.faviconUrl} alt="Favicon actual" className="w-16 h-16 object-contain rounded-xl border p-2" />}
                <button type="button" disabled={faviconSaving || !supabase || !faviconFile} onClick={handlePublishFavicon} className="px-4 py-2 rounded-xl bg-[#087f83] text-white font-semibold text-sm disabled:opacity-50">{faviconSaving ? 'Publicando…' : 'Subir / reemplazar favicon'}</button>
                {faviconStatus && <p role="status" className="text-xs text-stone-700">{faviconStatus}</p>}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div><h4 className="font-bold text-base text-stone-900">Foto principal de la landing</h4><p className="text-xs text-stone-600 mt-1">Esta es la fotografía grande detrás del título de inicio. Puedes reemplazarla directamente desde aquí.</p></div>
                {configForm.heroImageUrl && <img src={configForm.heroImageUrl} alt="Portada actual" className="w-full aspect-[16/7] object-cover rounded-xl border border-stone-200" />}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { setHeroFile(e.target.files?.[0] || null); setHeroStatus(''); }} className="block w-full min-w-0 text-sm border rounded-xl p-3 bg-white" />
                <button type="button" disabled={heroSaving || !heroFile} onClick={handlePublishHero} className="px-4 py-2.5 rounded-xl bg-[#087f83] text-white font-semibold text-sm disabled:opacity-50">{heroSaving ? 'Publicando portada…' : configForm.heroImageUrl ? 'Reemplazar foto principal' : 'Subir foto principal'}</button>
                {heroStatus && <p role="status" className="text-xs text-stone-700">{heroStatus}</p>}
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
          {activeTab === 'general' && (
            <div className="max-w-4xl mx-auto mt-6">
              <div className="mb-3"><h4 className="font-bold text-lg text-stone-900">Preguntas frecuentes</h4><p className="text-xs text-stone-500 mt-1">Administra aquí las preguntas y respuestas que aparecen en la web.</p></div>
              <FaqEditor />
            </div>
          )}

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

                  <div className="space-y-5">
                    <section className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                      <div className="mb-4"><h5 className="font-bold text-stone-900">1. Información de la habitación</h5><p className="text-xs text-stone-500">Así verá el huésped la habitación en el sitio.</p></div>
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
                      <div className="flex gap-2">
                        <select
                          value={roomFormData.type}
                          onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                          className="min-w-0 flex-1 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          required
                        >
                          {roomTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                        <button type="button" onClick={() => addCustomOption('type')} className="shrink-0 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 inline-flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Nueva
                        </button>
                      </div>
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

                      </div>
                    </section>

                    <section className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                      <div className="mb-4"><h5 className="font-bold text-stone-900">2. Precio y capacidad</h5><p className="text-xs text-stone-500">Configura la tarifa y cuántas personas pueden hospedarse.</p></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Tarifa por noche
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
                      <div className="flex gap-2">
                        <select
                          value={roomFormData.bedType}
                          onChange={(e) => setRoomFormData({ ...roomFormData, bedType: e.target.value })}
                          className="min-w-0 flex-1 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          required
                        >
                          {bedTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                        <button type="button" onClick={() => addCustomOption('bed')} className="shrink-0 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 inline-flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Nueva
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Personas incluidas en precio estándar</label>
                      <input type="number" min="1" max="10" value={roomFormData.includedGuests ?? Math.min(roomFormData.maxOccupancy, roomFormData.capacity.adults || 1)}
                        onChange={(e) => setRoomFormData({ ...roomFormData, includedGuests: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                      <p className="text-[11px] text-stone-500 mt-1">Ej.: precio estándar cubre hasta 3 personas.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Persona adicional (USD / noche)</label>
                      <input type="number" min="0" value={roomFormData.extraGuestPrice ?? 0}
                        onChange={(e) => setRoomFormData({ ...roomFormData, extraGuestPrice: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-emerald-700" />
                      <p className="text-[11px] text-stone-500 mt-1">0 = no se cobra suplemento adicional.</p>
                    </div>

                      </div>
                    </section>

                    <section className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                      <div className="mb-4"><h5 className="font-bold text-stone-900">3. Detalles de la estancia</h5><p className="text-xs text-stone-500">Cama, vista y descripción para ayudar al huésped a elegir.</p></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      </div>
                    </section>

                    <section className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                      <div className="mb-4"><h5 className="font-bold text-stone-900">4. Comodidades</h5><p className="text-xs text-stone-500">Marca las opciones disponibles o agrega una personalizada.</p></div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        {['Aire acondicionado','Baño privado','Wi-Fi','Agua caliente','Ventilador','Vista al lago','Vista al volcán','Terraza','Desayuno'].map(item => {
                          const selected=roomFormData.amenities.includes(item);
                          return <button key={item} type="button" onClick={()=>setRoomFormData({...roomFormData,amenities:selected?roomFormData.amenities.filter(a=>a!==item):[...roomFormData.amenities,item]})} className={`rounded-xl border px-3 py-2.5 text-xs font-semibold text-left ${selected?'border-teal-600 bg-teal-50 text-teal-800':'border-stone-200 bg-white text-stone-600'}`}>{selected?'✓ ':''}{item}</button>
                        })}
                      </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Otras comodidades
                      </label>
                      <textarea
                        rows={3}
                        value={roomFormData.amenities.join('\n')}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          amenities: e.target.value.split('\n').filter(s => s.trim().length > 0)
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                      />
                    </div>
                    </section>

                    <section className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div><div className="font-bold text-stone-900">5. Fotos</div><p className="text-xs text-stone-600">Añade varias fotos y elige cuál será la portada que verá el huésped.</p></div>
                        <label className={`w-full sm:w-auto shrink-0 rounded-xl text-white font-bold text-xs px-4 py-3 text-center ${roomPhotoBusy?'bg-stone-400 cursor-wait':'bg-teal-700 hover:bg-teal-800 cursor-pointer'}`}>
                          {roomPhotoBusy ? 'Subiendo…' : '＋ Subir fotos'}
                          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={roomPhotoBusy} onChange={e => { const selected=e.currentTarget.files; if(selected?.length) void handleUploadRoomPhotos(selected); e.currentTarget.value=''; }} className="absolute w-px h-px opacity-0 overflow-hidden" />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {roomFormData.images.map((imgUrl, i) => <div key={imgUrl+i} className="relative rounded-xl overflow-hidden border bg-white"><img src={imgUrl} alt={`Foto de habitación ${i + 1}`} className="w-full h-24 object-cover" /><div className="p-2 space-y-2"><div className="flex items-center justify-between"><span className={`text-[10px] font-bold ${i===0?'text-teal-700':'text-stone-500'}`}>{i===0?'★ Portada':`Foto ${i+1}`}</span><button type="button" onClick={() => void handleRemoveRoomPhoto(imgUrl)} className="text-[10px] font-bold text-red-600">Quitar</button></div>{i!==0 && <button type="button" onClick={() => void handleSetPrimaryRoomPhoto(imgUrl)} className="w-full rounded-lg border border-teal-300 bg-teal-50 text-teal-800 text-[10px] font-bold py-1.5">Usar como portada</button>}</div></div>)}
                      </div>
                      {roomPhotoStatus && <p role="status" className="text-xs text-stone-700 mt-2">{roomPhotoStatus}</p>}
                    </section>
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

          {activeTab === 'transport' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {transportStatus && <p role="status" className="text-sm rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 text-stone-700">{transportStatus}</p>}
              <section className="space-y-4"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">Transporte terrestre</p><h3 className="text-xl font-extrabold text-stone-900">Horarios de buses</h3><p className="text-sm text-stone-500">Crea rutas y agrega cada hora de salida como se muestra en la landing.</p></div><button type="button" onClick={addBusRoute} className="px-4 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-sm"><Plus className="w-4 h-4 inline mr-1"/>Agregar ruta</button></div>
              <div className="space-y-2"><input value={busFilter} onChange={e=>setBusFilter(e.target.value)} placeholder="Filtrar rutas terrestres…" className="w-full sm:max-w-sm px-3 py-2 rounded-xl border border-stone-200 text-sm"/><div className="bg-white border border-stone-200 rounded-2xl overflow-hidden"><div className="hidden md:grid grid-cols-[1.5fr_2fr_1fr_auto] gap-2 px-3 py-2 bg-stone-50 border-b text-[11px] font-bold uppercase tracking-wide text-stone-500"><span>Ruta</span><span>Horas</span><span>Frecuencia</span><span>Acciones</span></div><div className="divide-y divide-stone-100">{busRoutes.filter(item=>item.route.toLowerCase().includes(busFilter.toLowerCase())).map(item=><div key={item.id} className="p-2.5"><div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr_auto] gap-2 items-center"><input value={item.route} onChange={e=>setBusRoutes(p=>p.map(x=>x.id===item.id?{...x,route:e.target.value}:x))} className="w-full px-2.5 py-2 rounded-lg border border-stone-200 text-sm"/><div className="flex flex-wrap gap-1">{item.times.slice(0,6).map((time,i)=><span key={i} className="px-2 py-1 rounded-md bg-stone-100 text-[11px] font-semibold">{time}</span>)}{item.times.length>6&&<span className="px-2 py-1 text-[11px] font-bold text-teal-700">+{item.times.length-6}</span>}</div><input value={item.frequency} onChange={e=>setBusRoutes(p=>p.map(x=>x.id===item.id?{...x,frequency:e.target.value}:x))} placeholder="Frecuencia" className="w-full px-2.5 py-2 rounded-lg border border-stone-200 text-sm"/><div className="flex justify-end gap-1"><button type="button" onClick={()=>setExpandedBusId(expandedBusId===item.id?null:item.id)} className="px-3 py-2 rounded-lg border border-stone-200 text-xs font-bold">{expandedBusId===item.id?'Cerrar':'Editar'}</button><button type="button" disabled={savingBusRouteId===item.id} onClick={()=>saveBusRoute(item)} className="p-2 rounded-lg bg-[#087f83] text-white disabled:opacity-50"><Save className="w-4 h-4"/></button><button type="button" onClick={()=>deleteBusRoute(item.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></button></div></div>{expandedBusId===item.id&&<div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-3"><div className="flex items-center justify-between"><label className="text-xs font-bold">Horas de salida</label><button type="button" onClick={()=>addBusTime(item.id)} className="text-xs font-bold text-teal-700">+ Agregar hora</button></div><div className="flex flex-wrap gap-2">{item.times.map((time,i)=><div key={i} className="flex items-center gap-1"><input type="time" value={time} onChange={e=>updateBusTime(item.id,i,e.target.value)} className="px-2 py-1.5 rounded-lg border text-sm"/><button type="button" onClick={()=>removeBusTime(item.id,i)} className="text-red-500 px-1">×</button></div>)}</div><div className="grid sm:grid-cols-2 gap-2"><input value={item.timeRange} onChange={e=>setBusRoutes(p=>p.map(x=>x.id===item.id?{...x,timeRange:e.target.value}:x))} placeholder="Rango general" className="px-3 py-2 rounded-lg border text-sm"/><input value={item.notes} onChange={e=>setBusRoutes(p=>p.map(x=>x.id===item.id?{...x,notes:e.target.value}:x))} placeholder="Nota" className="px-3 py-2 rounded-lg border text-sm"/></div></div>}</div>)}</div></div></div></section>
              <section className="space-y-4 border-t pt-7"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">Transporte acuático</p><h3 className="text-xl font-extrabold text-stone-900">Horarios de ferries y barcos</h3><p className="text-sm text-stone-500">Administra cada salida, embarcación y tipo de servicio.</p></div><button type="button" onClick={addFerrySchedule} className="px-4 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-sm"><Plus className="w-4 h-4 inline mr-1"/>Agregar salida</button></div><div className="space-y-2"><select value={ferryFilter} onChange={e=>setFerryFilter(e.target.value)} className="w-full sm:max-w-sm px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white"><option value="">Todas las rutas</option><option value="San Jorge → Moyogalpa">San Jorge → Moyogalpa</option><option value="San Jorge → San José del Sur">San Jorge → San José del Sur</option><option value="Moyogalpa → San Jorge">Moyogalpa → San Jorge</option><option value="San José del Sur → San Jorge">San José del Sur → San Jorge</option></select><div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
<div className="hidden md:grid grid-cols-[1.45fr_.55fr_1.2fr_1fr_auto] gap-2 px-3 py-2 bg-stone-50 border-b text-[11px] font-bold uppercase tracking-wide text-stone-500"><span>Ruta</span><span>Hora</span><span>Embarcación</span><span>Tipo</span><span>Acciones</span></div>
<div className="divide-y divide-stone-100">{ferrySchedules.filter(item=>!ferryFilter || item.route===ferryFilter).map(item=><div key={item.id} className="p-2.5"><div className="grid grid-cols-1 md:grid-cols-[1.45fr_.55fr_1.2fr_1fr_auto] gap-2 items-center"><select aria-label="Ruta" value={item.route} onChange={e=>setFerrySchedules(p=>p.map(x=>x.id===item.id?{...x,route:e.target.value}:x))} className="w-full px-2.5 py-2 rounded-lg border border-stone-200 text-sm bg-white"><option>San Jorge → Moyogalpa</option><option>San Jorge → San José del Sur</option><option>Moyogalpa → San Jorge</option><option>San José del Sur → San Jorge</option></select><input aria-label="Hora" type="time" value={item.time} onChange={e=>setFerrySchedules(p=>p.map(x=>x.id===item.id?{...x,time:e.target.value}:x))} className="w-full px-2.5 py-2 rounded-lg border border-stone-200 text-sm"/><input aria-label="Embarcación" value={item.vessel} onChange={e=>setFerrySchedules(p=>p.map(x=>x.id===item.id?{...x,vessel:e.target.value}:x))} placeholder="Barco / Ferry" className="w-full px-2.5 py-2 rounded-lg border border-stone-200 text-sm"/><input aria-label="Tipo" value={item.type} onChange={e=>setFerrySchedules(p=>p.map(x=>x.id===item.id?{...x,type:e.target.value}:x))} placeholder="Pasajeros / vehículos" className="w-full px-2.5 py-2 rounded-lg border border-stone-200 text-sm"/><div className="flex items-center justify-end gap-1"><button type="button" title="Guardar" onClick={()=>saveFerrySchedule(item)} className="px-3 py-2 rounded-lg bg-[#087f83] text-white font-bold text-xs"><Save className="w-4 h-4"/></button><button type="button" title="Eliminar" onClick={()=>deleteFerrySchedule(item.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></button></div></div>{item.notes && <input aria-label="Nota" value={item.notes} onChange={e=>setFerrySchedules(p=>p.map(x=>x.id===item.id?{...x,notes:e.target.value}:x))} placeholder="Nota opcional" className="mt-2 w-full px-2.5 py-1.5 rounded-lg border border-stone-100 bg-stone-50 text-xs text-stone-600"/>}</div>)}</div></div></div></section>
            </div>
          )}

          {activeTab === 'services' && (
            <form onSubmit={handleSaveConfig} className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3">
                  <div><h4 className="font-bold text-lg text-stone-900">Day Pass de Piscina</h4><p className="text-xs text-stone-500 mt-1">Configura el servicio aquí. Mientras esté oculto, no aparecerá ninguna promoción de Day Pass en la landing.</p></div>
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 shrink-0"><input type="checkbox" checked={Boolean(configForm.dayPass?.enabled)} onChange={e => handleConfigChange('dayPass', { ...(configForm.dayPass || {}), enabled: e.target.checked })} className="w-5 h-5 accent-teal-700" />{configForm.dayPass?.enabled ? 'Activo' : 'Oculto'}</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-stone-700 mb-1">Nombre</label><input value={configForm.dayPass?.title || 'Day Pass Piscina'} onChange={e => handleConfigChange('dayPass', { ...(configForm.dayPass || { enabled:false }), title:e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-stone-700 mb-1">Precio por persona (opcional)</label><input type="number" min="0" value={configForm.dayPass?.price ?? ''} onChange={e => handleConfigChange('dayPass', { ...(configForm.dayPass || { enabled:false }), price:e.target.value === '' ? null : Number(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-stone-700 mb-1">Hora de inicio</label><input type="time" value={configForm.dayPass?.startTime || ''} onChange={e => handleConfigChange('dayPass', { ...(configForm.dayPass || { enabled:false }), startTime:e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-stone-700 mb-1">Hora de cierre</label><input type="time" value={configForm.dayPass?.endTime || ''} onChange={e => handleConfigChange('dayPass', { ...(configForm.dayPass || { enabled:false }), endTime:e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm" /></div>
                  <div className="sm:col-span-2"><label className="block text-xs font-bold text-stone-700 mb-2">Días disponibles</label><div className="flex flex-wrap gap-2">{['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(day => { const selected=configForm.dayPass?.days?.includes(day); return <button key={day} type="button" onClick={() => { const days=configForm.dayPass?.days || []; handleConfigChange('dayPass',{...(configForm.dayPass || {enabled:false}),days:selected?days.filter(d=>d!==day):[...days,day]}); }} className={`px-3 py-2 rounded-lg border text-xs font-semibold ${selected?'bg-teal-700 border-teal-700 text-white':'bg-white border-stone-200 text-stone-600'}`}>{day}</button>; })}</div></div>
                  <div className="sm:col-span-2"><label className="block text-xs font-bold text-stone-700 mb-1">Notas / condiciones</label><textarea value={configForm.dayPass?.notes || ''} onChange={e => handleConfigChange('dayPass', { ...(configForm.dayPass || { enabled:false }), notes:e.target.value })} rows={3} placeholder="Ej. Cupos limitados, incluye uso de piscina..." className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm" /></div>
                </div>
              </div>
              <div className="flex justify-end"><button type="submit" className="px-5 py-3 rounded-xl bg-[#087f83] hover:bg-[#076f73] text-white font-bold text-sm flex items-center gap-2"><Save className="w-4 h-4" />Guardar servicio</button></div>
            </form>
          )}

          {/* Galería: únicamente carga de archivos; las URL se generan automáticamente en Supabase. */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-stone-800"><h4 className="font-bold mb-2">Reemplazar imágenes iniciales de la landing</h4><p>Portada y exteriores: selecciona «Portada, jardines y exteriores». Eventos: «Eventos y celebraciones». Piscina: «Piscina». Habitaciones: «Habitaciones» y elige la habitación. Al subir la primera foto de una sección, la landing utilizará tu imagen en lugar de la imagen de muestra. Las fotografías que publiques aparecerán abajo con su botón «Reemplazar».</p></div>
              <PhotoUploader key={replacingPhoto?.id || 'new'} rooms={rooms} replacePhoto={replacingPhoto} onCancelReplace={() => setReplacingPhoto(null)} onReplaced={photo => { onSavePhotos(currentUploadedPhotosRef.current = currentUploadedPhotosRef.current.map(item => item.id === photo.id ? photo : item)); setReplacingPhoto(null); setGalleryStatus('Fotografía reemplazada correctamente.'); }} onUploaded={(photo, roomId) => {
                onSavePhotos(currentUploadedPhotosRef.current = [...currentUploadedPhotosRef.current, photo]);
                if (roomId) onSaveRooms(rooms.map(room => room.id === roomId ? { ...room, images: [...room.images.filter(url => !url.includes('images.unsplash.com')), photo.url] } : room));
              }} />
              <div className="bg-white border border-stone-200 rounded-2xl p-5">
                <h4 className="font-bold text-stone-900 mb-3">Fotografías de la landing</h4>
                {galleryStatus && <p role="status" className="text-sm mb-3">{galleryStatus}</p>}
                <p className="text-xs text-stone-600 mb-4">Las fotos publicadas se muestran en la landing y en su categoría. Para añadir fotos nuevas utiliza el formulario de subida de arriba.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map(photo => <div key={photo.id} className="rounded-xl overflow-hidden border border-stone-200">
                    <img src={photo.url} alt={photo.title} className="w-full aspect-[4/3] object-cover" />
                    <div className="p-2 text-xs font-semibold text-stone-800">{photo.title}</div>
                    <div className="flex gap-2 p-2 pt-0"><button type="button" onClick={() => { setReplacingPhoto(photo); setGalleryStatus(""); }} className="text-xs rounded-lg bg-teal-700 text-white px-2 py-2">Reemplazar</button><button type="button" onClick={async () => { if (!supabase || !window.confirm("¿Eliminar esta fotografía publicada?")) return; const deleted = await supabase.from("gallery_photos").delete().eq("id", photo.id).select("id").maybeSingle(); if (deleted.error || !deleted.data) { setGalleryStatus(deleted.error?.message || "No se pudo eliminar la fotografía."); return; } if (photo.roomTypeId) { const room = await supabase.from("rooms").select("details").eq("id", photo.roomTypeId).maybeSingle(); if (room.data) { const details = room.data.details as Room; await supabase.from("rooms").update({ details: { ...details, images: details.images.filter(image => image !== photo.url) } }).eq("id", photo.roomTypeId); } } onSavePhotos(currentUploadedPhotosRef.current = currentUploadedPhotosRef.current.filter(item => item.id !== photo.id)); setGalleryStatus("Fotografía eliminada de la galería."); }} className="text-xs rounded-lg border border-red-300 text-red-700 px-2 py-2">Eliminar</button></div>
                  </div>)}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="bg-stone-100 px-3 sm:px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Contenido conectado a Supabase. La landing carga la información publicada desde la base de datos.</span>
          </div>
          <span className="hidden sm:inline font-semibold">Panel privado</span>
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
