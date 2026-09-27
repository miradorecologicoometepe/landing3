import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus, Save, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Room } from '../types';

type Reservation = {
  id: string; guest_name: string; guest_phone: string | null; room_id: string | null;
  check_in: string; check_out: string; adults: number; children: number;
  status: 'inquiry'|'confirmed'|'paid'|'cancelled'; notes: string | null;
};

export const ReservationsCalendar: React.FC<{rooms: Room[]}> = ({ rooms }) => {
  const [items,setItems]=useState<Reservation[]>([]);
  const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState<Partial<Reservation>|null>(null);
  const [status,setStatus]=useState('');
  const load=async()=>{ if(!supabase)return; setLoading(true); const {data,error}=await supabase.from('reservations').select('*').order('check_in'); if(error)setStatus(error.message); else setItems((data||[]) as Reservation[]); setLoading(false); };
  useEffect(()=>{void load()},[]);
  const upcoming=useMemo(()=>items.filter(x=>x.status!=='cancelled'&&x.check_out>=new Date().toISOString().slice(0,10)),[items]);
  const save=async()=>{ if(!supabase||!editing?.guest_name||!editing.check_in||!editing.check_out){setStatus('Completa huésped, entrada y salida.');return}
    const {data:{user}}=await supabase.auth.getUser(); if(!user){setStatus('Tu sesión expiró.');return}
    const payload={guest_name:editing.guest_name,guest_phone:editing.guest_phone||null,room_id:editing.room_id||null,check_in:editing.check_in,check_out:editing.check_out,adults:Number(editing.adults||1),children:Number(editing.children||0),status:editing.status||'inquiry',notes:editing.notes||null,created_by:user.id,updated_at:new Date().toISOString()};
    const q=editing.id?supabase.from('reservations').update(payload).eq('id',editing.id):supabase.from('reservations').insert(payload);
    const {error}=await q;if(error){setStatus(error.message);return} setEditing(null);setStatus('Reserva guardada.');void load();
  };
  const remove=async(id:string)=>{if(!supabase||!confirm('¿Eliminar esta reserva?'))return;const {error}=await supabase.from('reservations').delete().eq('id',id);if(error)setStatus(error.message);else void load()};
  return <div className="max-w-6xl mx-auto space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h3 className="text-xl font-bold text-stone-900 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-teal-700"/>Calendario y reservas</h3><p className="text-sm text-stone-600">Control interno privado. Estos datos no se muestran en la landing.</p></div><button onClick={()=>setEditing({status:'inquiry',adults:1,children:0})} className="bg-teal-700 text-white rounded-xl px-4 py-3 font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/>Nueva reserva</button></div>
    {status&&<p className="text-sm rounded-xl bg-white border p-3">{status}</p>}
    {editing&&<div className="bg-white border rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
      <div className="flex justify-between"><h4 className="font-bold">{editing.id?'Editar reserva':'Nueva reserva'}</h4><button onClick={()=>setEditing(null)}><X className="w-5 h-5"/></button></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="border rounded-xl p-3" placeholder="Nombre del huésped" value={editing.guest_name||''} onChange={e=>setEditing({...editing,guest_name:e.target.value})}/>
        <input className="border rounded-xl p-3" placeholder="WhatsApp / teléfono" value={editing.guest_phone||''} onChange={e=>setEditing({...editing,guest_phone:e.target.value})}/>
        <label className="text-xs font-bold text-stone-600">Entrada<input type="date" className="block w-full border rounded-xl p-3 mt-1" value={editing.check_in||''} onChange={e=>setEditing({...editing,check_in:e.target.value})}/></label>
        <label className="text-xs font-bold text-stone-600">Salida<input type="date" className="block w-full border rounded-xl p-3 mt-1" value={editing.check_out||''} onChange={e=>setEditing({...editing,check_out:e.target.value})}/></label>
        <select className="border rounded-xl p-3" value={editing.room_id||''} onChange={e=>setEditing({...editing,room_id:e.target.value})}><option value="">Habitación</option>{rooms.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select>
        <select className="border rounded-xl p-3" value={editing.status||'inquiry'} onChange={e=>setEditing({...editing,status:e.target.value as Reservation['status']})}><option value="inquiry">Consulta</option><option value="confirmed">Confirmada</option><option value="paid">Pagada</option><option value="cancelled">Cancelada</option></select>
        <label className="text-xs font-bold text-stone-600">Adultos<input type="number" min="0" className="block w-full border rounded-xl p-3 mt-1" value={editing.adults??1} onChange={e=>setEditing({...editing,adults:+e.target.value})}/></label>
        <label className="text-xs font-bold text-stone-600">Niños<input type="number" min="0" className="block w-full border rounded-xl p-3 mt-1" value={editing.children??0} onChange={e=>setEditing({...editing,children:+e.target.value})}/></label>
      </div><textarea className="w-full border rounded-xl p-3" rows={3} placeholder="Notas internas" value={editing.notes||''} onChange={e=>setEditing({...editing,notes:e.target.value})}/>
      <button onClick={()=>void save()} className="w-full sm:w-auto bg-teal-700 text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2"><Save className="w-4 h-4"/>Guardar reserva</button>
    </div>}
    <div className="space-y-2">{loading?<p className="text-sm text-stone-500">Cargando reservas…</p>:upcoming.length===0?<div className="bg-white border rounded-2xl p-8 text-center text-stone-500">No hay reservas próximas.</div>:upcoming.map(r=><div key={r.id} className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><button className="text-left flex-1" onClick={()=>setEditing(r)}><div className="font-bold text-stone-900">{r.guest_name}</div><div className="text-sm text-stone-600">{r.check_in} → {r.check_out} · {rooms.find(x=>x.id===r.room_id)?.name||'Sin habitación'}</div><div className="text-xs mt-1 uppercase font-bold text-teal-700">{r.status==='inquiry'?'Consulta':r.status==='confirmed'?'Confirmada':r.status==='paid'?'Pagada':'Cancelada'}</div></button><button onClick={()=>void remove(r.id)} className="self-end sm:self-auto p-3 text-red-600"><Trash2 className="w-4 h-4"/></button></div>)}</div>
  </div>
};