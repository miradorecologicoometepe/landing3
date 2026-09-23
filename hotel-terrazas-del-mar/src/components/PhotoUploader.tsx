import React, { useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Room, PhotoItem, PhotoCategory } from '../types';

type Props = { rooms: Room[]; onUploaded: (photo: PhotoItem, roomId: string) => void };

export const PhotoUploader: React.FC<Props> = ({ rooms, onUploaded }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<PhotoCategory>('rooms');
  const [roomId, setRoomId] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) { setStatus('Falta configurar Supabase en el despliegue.'); return; }
    if (!files.length) { setStatus('Selecciona al menos una fotografía.'); return; }
    if (category === 'rooms' && !(roomId || rooms[0]?.id)) { setStatus('Selecciona la habitación.'); return; }
    setBusy(true); setStatus(''); setProgress(0);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Tu sesión ha expirado. Cierra sesión y vuelve a ingresar al panel.');
      const admin = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (admin.error || !admin.data) throw new Error('Tu usuario no tiene autorización para publicar fotografías.');
      const selectedRoomId = roomId || rooms[0]?.id || '';
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) throw new Error('Solo se aceptan JPG, PNG, WebP o AVIF.');
        if (file.size > 10 * 1024 * 1024) throw new Error('Cada imagen debe pesar menos de 10 MB.');
        const id = crypto.randomUUID();
        const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'} as Record<string,string>)[file.type];
        const path = `gallery/${id}.${ext}`;
        const upload = await supabase.storage.from('hotel-media').upload(path, file, { contentType: file.type, upsert: false });
        if (upload.error) throw upload.error;
        const url = supabase.storage.from('hotel-media').getPublicUrl(path).data.publicUrl;
        const photo: PhotoItem = { id, title: (files.length === 1 && title.trim()) || file.name.replace(/\.[^.]+$/, ''), category, url, caption: '', roomTypeId: category === 'rooms' ? selectedRoomId : undefined, aspectRatio: 'landscape' };
        const saved = await supabase.from('gallery_photos').insert({ id, category, image_path: url, details: { title: photo.title, caption: '', roomTypeId: photo.roomTypeId, aspectRatio: 'landscape' }, sort_order: Date.now() + i });
        if (saved.error) { await supabase.storage.from('hotel-media').remove([path]); throw saved.error; }
        if (category === 'rooms') {
          const room = await supabase.from('rooms').select('details').eq('id', selectedRoomId).maybeSingle();
          if (room.error || !room.data) throw new Error('La foto se guardó en galería, pero no se encontró la habitación para vincularla.');
          const details = room.data.details as Room;
          const updated = await supabase.from('rooms').update({ details: { ...details, images: [...(details.images || []).filter((x: string) => !x.includes('images.unsplash.com')), url] } }).eq('id', roomId);
          if (updated.error) throw new Error('La foto se guardó en galería, pero no pudo vincularse a la habitación: ' + updated.error.message);
        }
        onUploaded(photo, category === 'rooms' ? selectedRoomId : '');
        uploadedCount++;
        setProgress(i + 1);
      }
      setStatus(`Se publicaron ${files.length} fotografía(s). Los visitantes verán los cambios al recargar.`);
      setFiles([]); setTitle('');
      if (fileInput.current) fileInput.current.value = '';
    } catch (err) { setStatus(`${uploadedCount} de ${files.length} fotografía(s) publicadas. ${err instanceof Error ? err.message : 'No se pudo publicar.'}`); }
    finally { setBusy(false); }
  };

  return <form onSubmit={publish} className="bg-white border border-teal-200 rounded-2xl p-5 space-y-4">
    <h4 className="text-lg font-bold text-stone-900">Subir fotografías reales</h4>
    <p className="text-sm text-stone-600">Selecciona fotos desde tu teléfono o computadora. Se publicarán en Supabase para todos los visitantes. No uses imágenes de muestra.</p>
    {!supabase && <p role="alert" className="text-red-700 text-sm">Supabase no está configurado en esta versión de la web.</p>}
    <label className="block text-sm font-semibold text-stone-800">Ubicación de las fotografías
      <select value={category} onChange={e=>setCategory(e.target.value as PhotoCategory)} className="block w-full mt-1 border rounded-xl p-3">
        <option value="rooms">Habitaciones</option><option value="pool">Piscina</option><option value="outdoors">Jardines, mirador y exteriores</option><option value="gastronomy">Gastronomía</option>
      </select>
    </label>
    {category === 'rooms' && <label className="block text-sm font-semibold text-stone-800">Habitación
      <select value={roomId || rooms[0]?.id || ''} onChange={e=>setRoomId(e.target.value)} className="block w-full mt-1 border rounded-xl p-3">{rooms.map(room=><option key={room.id} value={room.id}>{room.name}</option>)}</select>
    </label>}
    <label className="block text-sm font-semibold text-stone-800">Título (opcional para una sola foto)
      <input value={title} onChange={e=>setTitle(e.target.value)} className="block w-full mt-1 border rounded-xl p-3" placeholder="Ej. Piscina al atardecer" />
    </label>
    <label className="block text-sm font-semibold text-stone-800">Fotografías JPG, PNG, WebP o AVIF (máximo 10 MB por foto)
      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={e=>setFiles(Array.from(e.target.files || []))} className="block w-full mt-2 text-sm" />
    </label>
    {files.length > 0 && <p className="text-sm text-stone-600">{files.length} archivo(s) seleccionado(s)</p>}
    <button type="submit" disabled={busy || !supabase || !files.length} className="rounded-xl bg-teal-700 text-white font-bold px-5 py-3 disabled:opacity-50">{busy ? `Publicando ${progress}/${files.length}…` : 'Subir y publicar fotos'}</button>
    {status && <p role="status" className="text-sm text-stone-700">{status}</p>}
  </form>;
};
