import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Room, PhotoItem, PhotoCategory } from '../types';

type Props = { rooms: Room[]; onUploaded: (photo: PhotoItem, roomId: string) => void; replacePhoto?: PhotoItem | null; onReplaced?: (photo: PhotoItem) => void; onCancelReplace?: () => void };

export const PhotoUploader: React.FC<Props> = ({ rooms, onUploaded, replacePhoto, onReplaced, onCancelReplace }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<PhotoCategory>('rooms');
  const [roomId, setRoomId] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const storagePathFromUrl = (url?: string) => { if (!url) return null; const marker = '/storage/v1/object/public/hotel-media/'; const at = url.indexOf(marker); return at >= 0 ? decodeURIComponent(url.slice(at + marker.length).split('?')[0]) : null; };
  useEffect(() => { const urls = files.map(file => URL.createObjectURL(file)); setPreviews(urls); return () => urls.forEach(url => URL.revokeObjectURL(url)); }, [files]);

  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) { setStatus('Falta configurar Supabase en el despliegue.'); return; }
    if (!files.length) { setStatus('Selecciona al menos una fotografía.'); return; }
    if (!replacePhoto && category === 'rooms' && !(roomId || rooms[0]?.id)) { setStatus('Selecciona la habitación.'); return; }
    if (replacePhoto && files.length !== 1) { setStatus('Para reemplazar una foto selecciona exactamente un archivo.'); return; }
    setBusy(true); setStatus(''); setProgress(0);
    let uploadedCount = 0;
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Tu sesión ha expirado. Cierra sesión y vuelve a ingresar al panel.');
      const admin = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (admin.error || !admin.data) throw new Error('Tu usuario no tiene autorización para publicar fotografías.');
      const selectedRoomId = roomId || rooms[0]?.id || '';
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) throw new Error('Solo se aceptan JPG, PNG, WebP o AVIF.');
        if (file.size > 10 * 1024 * 1024) throw new Error('Cada imagen debe pesar menos de 10 MB.');
        const id = replacePhoto?.id || crypto.randomUUID();
        const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'} as Record<string,string>)[file.type];
        const path = `gallery/${crypto.randomUUID()}.${ext}`;
        const upload = await supabase.storage.from('hotel-media').upload(path, file, { contentType: file.type, upsert: false });
        if (upload.error) throw upload.error;
        const url = supabase.storage.from('hotel-media').getPublicUrl(path).data.publicUrl;
        const photo: PhotoItem = replacePhoto
          ? { ...replacePhoto, url }
          : { id, title: (files.length === 1 && title.trim()) || file.name.replace(/\.[^.]+$/, ''), category, url, caption: '', roomTypeId: category === 'rooms' ? selectedRoomId : undefined, aspectRatio: 'landscape' };
        if (replacePhoto) {
          const saved = await supabase.from('gallery_photos').update({ image_path: url }).eq('id', id).select('id').maybeSingle();
          if (saved.error || !saved.data) {
            await supabase.storage.from('hotel-media').remove([path]);
            throw new Error(saved.error?.message || 'La foto original no está publicada en Supabase.');
          }
          if (replacePhoto.roomTypeId) {
            const room = await supabase.from('rooms').select('details').eq('id', replacePhoto.roomTypeId).maybeSingle();
            if (room.error || !room.data) throw new Error('La foto se reemplazó, pero no se pudo actualizar la habitación.');
            const details = room.data.details as Room;
            const updated = await supabase.from('rooms').update({ details: { ...details, images: (details.images || []).map((image: string) => image === replacePhoto.url ? url : image) } }).eq('id', replacePhoto.roomTypeId).select('id').maybeSingle();
            if (updated.error || !updated.data) throw new Error('La foto se reemplazó, pero no se pudo actualizar la habitación: ' + (updated.error?.message || 'No se encontró la habitación vinculada.'));
          }
          const oldPath = storagePathFromUrl(replacePhoto.url);
          if (oldPath) await supabase.storage.from('hotel-media').remove([oldPath]);
          onReplaced?.(photo);
        } else {
          const saved = await supabase.from('gallery_photos').insert({ id, category, image_path: url, details: { title: photo.title, caption: '', roomTypeId: photo.roomTypeId, aspectRatio: 'landscape' }, sort_order: Date.now() + i });
          if (saved.error) { await supabase.storage.from('hotel-media').remove([path]); throw saved.error; }
          if (category === 'rooms') {
            const room = await supabase.from('rooms').select('details').eq('id', selectedRoomId).maybeSingle();
            if (room.error || !room.data) throw new Error('La foto se guardó en galería, pero no se encontró la habitación para vincularla.');
            const details = room.data.details as Room;
            const updated = await supabase.from('rooms').update({ details: { ...details, images: [...(details.images || []).filter((x: string) => !x.includes('images.unsplash.com')), url] } }).eq('id', selectedRoomId).select('id').maybeSingle();
            if (updated.error || !updated.data) throw new Error('La foto se guardó en galería, pero no pudo vincularse a la habitación: ' + (updated.error?.message || 'No se encontró la habitación seleccionada.'));
          }
          onUploaded(photo, category === 'rooms' ? selectedRoomId : '');
        }
        uploadedCount++;
        setProgress(i + 1);
      }
      setStatus(replacePhoto ? 'Fotografía reemplazada. Los visitantes verán la nueva imagen al recargar.' : `Se publicaron ${files.length} fotografía(s). Los visitantes verán los cambios al recargar.`);
      setFiles([]); setTitle('');
      if (fileInput.current) fileInput.current.value = '';
    } catch (err) { setStatus(`${uploadedCount} de ${files.length} fotografía(s) publicadas. ${err instanceof Error ? err.message : 'No se pudo publicar.'}`); }
    finally { setBusy(false); }
  };

  return <form onSubmit={publish} className="bg-white border border-teal-200 rounded-2xl p-3 sm:p-5 space-y-4">
    <h4 className="text-lg font-bold text-stone-900">{replacePhoto ? `Reemplazar: ${replacePhoto.title}` : 'Añadir fotos a la web'}</h4>
    <p className="text-sm text-stone-600">Elige primero dónde quieres que aparezcan. El panel se encarga de publicarlas en la sección correcta.</p>
    {!supabase && <p role="alert" className="text-red-700 text-sm">Supabase no está configurado en esta versión de la web.</p>}
    {!replacePhoto && <label className="block text-sm font-semibold text-stone-800">Ubicación de las fotografías
      <select value={category} onChange={e=>setCategory(e.target.value as PhotoCategory)} className="block w-full mt-1 border rounded-xl p-3">
        <option value="outdoors">Inicio y exteriores — galería + entorno</option><option value="rooms">Habitaciones — ficha de habitación + galería</option><option value="pool">Piscina y mirador — galería + página de eventos</option><option value="events">Eventos y celebraciones — galería + página de eventos</option><option value="gastronomy">Gastronomía — galería</option>
      </select>
    </label>}
    {!replacePhoto && <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600"><strong className="text-stone-900">Destino:</strong> {category==='rooms'?'Se añadirá a la habitación seleccionada y también a la Galería pública.':category==='pool'?'Aparecerá en Piscina & Mirador dentro de la Galería y podrá usarse en Eventos.':category==='events'?'Aparecerá en Eventos y celebraciones y en la Galería pública.':category==='gastronomy'?'Aparecerá en Gastronomía dentro de la Galería pública.':'Aparecerá como foto de exteriores/naturaleza en la Galería pública.'}</div>}
    {!replacePhoto && category === 'rooms' && <label className="block text-sm font-semibold text-stone-800">Habitación
      <select value={roomId || rooms[0]?.id || ''} onChange={e=>setRoomId(e.target.value)} className="block w-full mt-1 border rounded-xl p-3">{rooms.map(room=><option key={room.id} value={room.id}>{room.name}</option>)}</select>
    </label>}
    {!replacePhoto && <label className="block text-sm font-semibold text-stone-800">Título (opcional para una sola foto)
      <input value={title} onChange={e=>setTitle(e.target.value)} className="block w-full mt-1 border rounded-xl p-3" placeholder="Ej. Piscina al atardecer" />
    </label>}
    <label className="block text-sm font-semibold text-stone-800">Fotografías JPG, PNG, WebP o AVIF (máximo 10 MB por foto)
      <span className="block mt-2 rounded-xl bg-teal-700 text-white text-center px-5 py-4 cursor-pointer">{replacePhoto ? "Seleccionar foto de reemplazo" : "Seleccionar fotografías desde mi dispositivo"}</span>
      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={!replacePhoto} onChange={e=>setFiles(Array.from(e.target.files || []))} className="sr-only" />
    </label>
    {previews.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{previews.map((url, index) => <img key={url} src={url} alt={`Vista previa ${index + 1}`} className="h-28 w-full rounded-xl object-cover border" />)}</div>}
    {files.length > 0 && <p className="text-sm text-stone-600">{files.length} archivo(s) seleccionado(s)</p>}
    <div className="flex flex-col sm:flex-row gap-2"><button type="submit" disabled={busy || !supabase || !files.length} className="w-full sm:w-auto rounded-xl bg-teal-700 text-white font-bold px-5 py-3 disabled:opacity-50">{busy ? `Publicando ${progress}/${files.length}…` : replacePhoto ? 'Reemplazar fotografía' : 'Subir y publicar fotos'}</button>
    {replacePhoto && <button type="button" onClick={onCancelReplace} className="w-full sm:w-auto rounded-xl border px-4 py-3 text-sm">Cancelar reemplazo</button>}</div>
    {status && <p role="status" className="text-sm text-stone-700">{status}</p>}
  </form>;
};
