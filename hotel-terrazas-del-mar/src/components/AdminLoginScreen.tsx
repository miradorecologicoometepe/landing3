import React, { useEffect, useState } from 'react';
import { HotelConfig } from '../types';
import { supabase } from '../lib/supabase';
import { HotelLogo } from './HotelLogo';
import { Lock, ArrowRight, ArrowLeft, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';

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
  const [message, setMessage] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setError('');
        setMessage('Enlace verificado. Crea una contraseña nueva.');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const requestPasswordReset = async () => {
    setError(''); setMessage('');
    if (!supabase) { setError('Supabase no está configurado en este despliegue.'); return; }
    if (!email.trim()) { setError('Escribe tu correo electrónico primero.'); return; }
    setBusy(true);
    const redirectTo = `${window.location.origin}/admin`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setBusy(false);
    if (resetError) { setError('No se pudo enviar el correo de recuperación. Intenta nuevamente.'); return; }
    setMessage('Si la cuenta existe, recibirás un enlace para restablecer tu contraseña. Revisa también Spam.');
  };

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); setMessage('');
    if (!supabase) return;
    if (newPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (newPassword !== confirmPassword) { setError('Las contraseñas no coinciden.'); return; }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) { setError('No se pudo actualizar la contraseña. Solicita un enlace nuevo e inténtalo otra vez.'); setBusy(false); return; }
    await supabase.auth.signOut();
    setNewPassword(''); setConfirmPassword(''); setRecoveryMode(false); setBusy(false);
    window.history.replaceState({}, '', '/admin');
    setMessage('Contraseña actualizada. Ya puedes iniciar sesión con la nueva contraseña.');
  };
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
  if (recoveryMode) return <div className="min-h-screen bg-[#0d1c1e] text-white flex flex-col">
    <header className="p-5 border-b border-white/10"><HotelLogo variant="horizontal" mode="white" height={36} logoUrl={hotelConfig.logoUrl} /></header>
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <form onSubmit={updatePassword} className="w-full max-w-md bg-[#13272b] border border-[#24474d] rounded-3xl p-7 sm:p-9 space-y-5">
        <KeyRound className="w-9 h-9 text-teal-200 mx-auto" />
        <h1 className="text-2xl font-bold text-center">Crear nueva contraseña</h1>
        <p className="text-sm text-stone-300 text-center">Elige una contraseña nueva para tu cuenta administradora.</p>
        <label className="block text-sm">Nueva contraseña<div className="relative mt-2"><input type={showNewPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-xl bg-[#0d1c1e] border border-[#387378] p-3 pr-12 text-white" /><button type="button" onClick={() => setShowNewPassword(v => !v)} aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute inset-y-0 right-0 px-4 text-teal-200 hover:text-white">{showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></label>
        <label className="block text-sm">Confirmar contraseña<div className="relative mt-2"><input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl bg-[#0d1c1e] border border-[#387378] p-3 pr-12 text-white" /><button type="button" onClick={() => setShowConfirmPassword(v => !v)} aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute inset-y-0 right-0 px-4 text-teal-200 hover:text-white">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></label>
        {message && <p className="text-sm text-teal-200">{message}</p>}
        {message && <p className="text-sm text-teal-200">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#387378] p-3 font-bold disabled:opacity-50">{busy ? 'Guardando…' : 'Guardar nueva contraseña'}</button>
      </form>
    </main>
  </div>;

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
          <div className="relative mt-2"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl bg-[#0d1c1e] border border-[#387378] p-3 pr-12 text-white" /><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute inset-y-0 right-0 px-4 text-teal-200 hover:text-white">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
        </label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <div className="text-right"><button type="button" onClick={requestPasswordReset} disabled={busy || !supabase} className="text-sm text-teal-200 hover:text-white inline-flex items-center gap-1.5 disabled:opacity-50"><Mail className="w-4 h-4" /> ¿Olvidaste tu contraseña?</button></div>
        <button type="submit" disabled={busy || !supabase} className="w-full rounded-xl bg-[#387378] p-3 font-bold disabled:opacity-50 flex justify-center items-center gap-2">{busy ? 'Verificando…' : 'Ingresar al panel'} <ArrowRight className="w-4 h-4" /></button>
      </form>
    </main>
  </div>;
};
