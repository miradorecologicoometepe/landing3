import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_FAQS, FaqItem } from '../data/faqs';

export const FaqEditor: React.FC = () => {
  const [items, setItems] = useState<FaqItem[]>(DEFAULT_FAQS);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!supabase) { if (active) setLoaded(true); return; }
      const result = await supabase.from('site_content').select('value').eq('key', 'hotel_faqs').maybeSingle();
      if (!active) return;
      if (result.error) setStatus('No se pudieron cargar las preguntas: ' + result.error.message);
      else if (Array.isArray(result.data?.value)) setItems((result.data.value as FaqItem[]).filter(x => typeof x.q === 'string' && typeof x.a === 'string'));
      setLoaded(true);
    };
    void load();
    return () => { active = false; };
  }, []);
  const update = (index: number, key: keyof FaqItem, value: string) => setItems(current => current.map((item, i) => i === index ? { ...item, [key]: value } : item));
  const move = (index: number, delta: number) => setItems(current => {
    const next = [...current], target = index + delta;
    if (target < 0 || target >= next.length) return current;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
  const save = async () => {
    if (!supabase) { setStatus('Falta configurar Supabase en Cloudflare.'); return; }
    if (items.some(item => !item.q.trim() || !item.a.trim())) { setStatus('Completa las preguntas y respuestas antes de publicar.'); return; }
    setSaving(true); setStatus('');
    try {
      let { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!email || !password) throw new Error('Inicia sesión con una cuenta administradora de Supabase.');
        const login = await supabase.auth.signInWithPassword({ email, password });
        if (login.error) throw login.error;
        user = login.data.user;
      }
      if (!user) throw new Error('No se pudo verificar la sesión.');
      const admin = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (admin.error || !admin.data) throw new Error('Tu cuenta no tiene autorización para publicar contenido.');
      const result = await supabase.from('site_content').upsert({ key: 'hotel_faqs', value: items.map(item => ({ q: item.q.trim(), a: item.a.trim() })) }, { onConflict: 'key' });
      if (result.error) throw result.error;
      setStatus('Preguntas frecuentes publicadas. Los visitantes verán los cambios al recargar.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'No se pudieron publicar los cambios.'); }
    finally { setSaving(false); }
  };
  return <div className="max-w-3xl mx-auto space-y-4">
    <div><h3 className="text-xl font-bold text-stone-900">Preguntas frecuentes</h3><p className="text-sm text-stone-600">Edita las respuestas, agrega preguntas y cambia su orden. Pulsa «Publicar cambios» para guardarlas en Supabase.</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white rounded-xl p-3 border">
      <input aria-label="Correo administrador Supabase" type="email" autoComplete="username" placeholder="Correo administrador Supabase" value={email} onChange={e=>setEmail(e.target.value)} className="w-full min-w-0 rounded-lg border p-3 text-sm"/>
      <input aria-label="Contraseña Supabase" type="password" autoComplete="current-password" placeholder="Contraseña Supabase" value={password} onChange={e=>setPassword(e.target.value)} className="w-full min-w-0 rounded-lg border p-3 text-sm"/>
    </div>
    {items.map((item,index)=><div key={index} className="bg-white border rounded-xl p-3 sm:p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold text-stone-700">Pregunta {index+1}</span><div className="flex flex-wrap gap-2">
        <button type="button" disabled={index===0} onClick={()=>move(index,-1)} className="border rounded-lg px-3 py-2 text-xs disabled:opacity-40">Subir</button>
        <button type="button" disabled={index===items.length-1} onClick={()=>move(index,1)} className="border rounded-lg px-3 py-2 text-xs disabled:opacity-40">Bajar</button>
        <button type="button" onClick={()=>setItems(current=>current.filter((_,i)=>i!==index))} className="border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs">Eliminar</button>
      </div></div>
      <label className="block text-sm font-medium text-stone-700">Pregunta<input value={item.q} onChange={e=>update(index,'q',e.target.value)} className="block w-full min-w-0 border rounded-lg p-3 mt-1 text-sm"/></label>
      <label className="block text-sm font-medium text-stone-700">Respuesta<textarea rows={4} value={item.a} onChange={e=>update(index,'a',e.target.value)} className="block w-full min-w-0 border rounded-lg p-3 mt-1 text-sm"/></label>
    </div>)}
    <button type="button" onClick={()=>setItems(current=>[...current,{q:'',a:''}])} className="w-full sm:w-auto border border-teal-600 text-teal-800 rounded-xl px-4 py-3 font-semibold">+ Añadir pregunta</button>
    <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={!loaded||saving||!supabase} onClick={()=>void save()} className="bg-teal-700 text-white rounded-xl px-5 py-3 font-semibold disabled:opacity-50">{saving?'Publicando…':'Publicar cambios'}</button><p role="status" className="text-sm text-stone-700">{status}</p></div>
  </div>;
};
