import React, { useState } from 'react';
import { HotelConfig } from '../types';
import { supabase } from '../lib/supabase';
import { HotelLogo } from './HotelLogo';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminLoginScreenProps {
  hotelConfig: HotelConfig;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ hotelConfig, onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!supabase) { setError('Supabase no está configurado en este despliegue.'); return; }
    setBusy(true);
    try {
      const login = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (login.error || !login.data.user) throw new Error('No se pudo iniciar sesión. Revisa tu correo y contraseña.');
      const admin = await supabase.from('admin_users').select('user_id').eq('user_id', login.data.user.id).maybeSingle();
      if (admin.error || !admin.data) {
        await supabase.auth.signOut();
        throw new Error('Esta cuenta no tiene acceso al panel de administración.');
      }
      setPassword('');
      onLoginSuccess();
    } catch (err) { setError(err instanceof Error ? err.message : 'Error de acceso.'); }
    finally { setBusy(false); }
  };
  return <div className="min-h-screen bg-[#0d1c1e] text-white flex flex-col">
    <header className="p-5 border-b border-white/10 flex items-center justify-between gap-4">
      <HotelLogo variant="horizontal" mode="white" height={36} logoUrl={hotelConfig.logoUrl} />
      <button type="button" onClick={onCancel} className="flex items-center gap-2 text-sm text-stone-200"><ArrowLeft className="w-4 h-4" /> Volver al sitio</button>
    </header>
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md bg-[#13272b] border border-[#24474d] rounded-3xl p-7 sm:p-9 space-y-5">
        <Lock className="w-9 h-9 text-teal-200 mx-auto" />
        <h1 className="text-2xl font-bold text-center">Acceso a Administración</h1>
        <p className="text-sm text-stone-300 text-center">Inicia sesión con tu cuenta administradora de Supabase.</p>
        <label className="block text-sm">Correo electrónico
          <input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl bg-[#0d1c1e] border border-[#387378] p-3 text-white" />
        </label>
        <label className="block text-sm">Contraseña
          <input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl bg-[#0d1c1e] border border-[#387378] p-3 text-white" />
        </label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={busy || !supabase} className="w-full rounded-xl bg-[#387378] p-3 font-bold disabled:opacity-50 flex justify-center items-center gap-2">{busy ? 'Verificando…' : 'Ingresar al panel'} <ArrowRight className="w-4 h-4" /></button>
      </form>
    </main>
  </div>;
};
