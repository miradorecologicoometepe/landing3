import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_GUIDE_CONTACTS, GuideContact, loadGuideContacts } from '../lib/guideContacts';
export function GuideContactsEditor() {
  const [contacts, setContacts] = useState<GuideContact[]>(DEFAULT_GUIDE_CONTACTS);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    let active = true;
    loadGuideContacts().then(value => { if (active) { setContacts(value); setReady(true); } })
      .catch(error => { if (active) setStatus('No se pudieron cargar los contactos: ' + error.message); });
    return () => { active = false; };
  }, []);
  const update = (id: string, field: 'name' | 'phone', value: string) => setContacts(previous => previous.map(item => item.id === id ? { ...item, [field]: value } : item));
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) { setStatus('Supabase no está configurado.'); return; }
    const cleaned = contacts.map(item => ({ ...item, name: item.name.trim(), phone: item.phone.trim() }));
    if (cleaned.some(item => !item.name || !/^\+?[\d\s()-]+$/.test(item.phone) || item.phone.replace(/\D/g, '').length < 8 || item.phone.replace(/\D/g, '').length > 15)) { setStatus('Completa cada nombre y un teléfono válido de 8 a 15 dígitos.'); return; }
    setSaving(true); setStatus('');
    try {
      const result = await supabase.from('site_content').upsert({ key: 'guide_contacts', value: cleaned, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select('key').maybeSingle();
      if (result.error || !result.data) throw new Error(result.error?.message || 'No se confirmó el guardado.');
      setContacts(cleaned); setStatus('Contactos publicados. La guía mostrará los cambios al abrirla o recargarla.');
    } catch (error) { setStatus('No se pudo guardar: ' + (error instanceof Error ? error.message : 'Error de conexión.')); }
    finally { setSaving(false); }
  };
  return <form onSubmit={save} className="space-y-4 border-b border-stone-200 pb-7">
    <div><h3 className="text-xl font-extrabold text-stone-900">Contactos de embarcaciones</h3><p className="text-sm text-stone-500">Edita los nombres y teléfonos de la guía pública. Incluye el código de país, por ejemplo +505.</p></div>
    {status && <p role="status" className="rounded-xl bg-teal-50 p-3 text-sm">{status}</p>}
    <fieldset disabled={!ready || saving} className="space-y-3 disabled:opacity-60">
      {contacts.map(item => <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 rounded-xl border bg-white p-3">
        <label className="text-xs font-bold">Embarcación / operador<input required value={item.name} onChange={event => update(item.id, 'name', event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label>
        <label className="text-xs font-bold">Teléfono<input required type="tel" value={item.phone} onChange={event => update(item.id, 'phone', event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label>
        <button type="button" onClick={() => setContacts(previous => previous.filter(contact => contact.id !== item.id))} className="self-end rounded-lg p-2 text-sm text-red-600">Eliminar</button>
      </div>)}
      {!contacts.length && <p className="text-sm text-stone-500">Sin contactos. Al guardar, se ocultará este bloque en la guía.</p>}
      <div className="flex flex-wrap justify-between gap-3">
        <button type="button" onClick={() => setContacts(previous => [...previous, { id: crypto.randomUUID(), name: '', phone: '' }])} className="rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-bold text-teal-800">Agregar contacto</button>
        <button type="submit" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">{saving ? 'Guardando…' : 'Guardar contactos'}</button>
      </div>
    </fieldset>
  </form>;
}
