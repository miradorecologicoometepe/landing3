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
  const groups = Array.from(contacts.reduce((map, contact) => {
    const key = contact.name.trim().toLocaleLowerCase() || contact.id;
    const group = map.get(key);
    if (group) group.items.push(contact);
    else map.set(key, { id: contact.id, name: contact.name, items: [contact] });
    return map;
  }, new Map<string, { id: string; name: string; items: GuideContact[] }>()).values());
  const renameGroup = (ids: string[], name: string) => setContacts(previous => previous.map(item => ids.includes(item.id) ? { ...item, name } : item));
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
    <div><h3 className="text-xl font-extrabold text-stone-900">Contactos de embarcaciones</h3><p className="text-sm text-stone-500">Cada embarcación reúne todos sus teléfonos. Edita el nombre una sola vez. Incluye el código de país, por ejemplo +505.</p></div>
    {status && <p role="status" className="rounded-xl bg-teal-50 p-3 text-sm">{status}</p>}
    <fieldset disabled={!ready || saving} className="space-y-3 disabled:opacity-60">
      {groups.map(group => <div key={group.id} className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
        <div className="flex items-end gap-3">
          <label className="flex-1 text-xs font-bold text-stone-700">Embarcación / operador<input required value={group.name} onChange={event => renameGroup(group.items.map(item => item.id), event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label>
          <button type="button" onClick={() => { if (window.confirm('¿Eliminar esta embarcación y todos sus teléfonos?')) setContacts(previous => previous.filter(item => !group.items.some(contact => contact.id === item.id))); }} className="rounded-lg p-2 text-xs text-red-600">Eliminar embarcación</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{group.items.map((item, index) => <div key={item.id} className="flex items-end gap-1">
          <label className="flex-1 text-xs font-semibold text-stone-600">Teléfono {index + 1}<input required type="tel" value={item.phone} onChange={event => update(item.id, 'phone', event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label>
          <button type="button" aria-label={'Eliminar teléfono ' + (index + 1) + ' de ' + group.name} onClick={() => setContacts(previous => previous.filter(contact => contact.id !== item.id))} className="p-2 text-red-600">×</button>
        </div>)}</div>
        <button type="button" onClick={() => setContacts(previous => [...previous, { id: crypto.randomUUID(), name: group.name, phone: '' }])} className="text-sm font-bold text-teal-700">+ Agregar teléfono</button>
      </div>)}
      {!contacts.length && <p className="text-sm text-stone-500">Sin contactos. Al guardar, se ocultará este bloque en la guía.</p>}
      <div className="flex flex-wrap justify-between gap-3">
        <button type="button" onClick={() => setContacts(previous => [...previous, { id: crypto.randomUUID(), name: '', phone: '' }])} className="rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-bold text-teal-800">Agregar embarcación</button>
        <button type="submit" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">{saving ? 'Guardando…' : 'Guardar contactos'}</button>
      </div>
    </fieldset>
  </form>;
}
