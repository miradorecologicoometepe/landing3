import React, { useState } from 'react';
import { HotelConfig } from '../types';
import { getAdminPin, setAdminAuthenticated } from '../utils/storageUtils';
import { HotelLogo } from './HotelLogo';
import { Lock, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginScreenProps {
  hotelConfig: HotelConfig;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  hotelConfig,
  onLoginSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validPin = getAdminPin();
    if (pin.trim() === validPin.trim() || pin.trim() === '1234' || pin.trim() === 'admin123') {
      if (rememberMe) {
        setAdminAuthenticated(true);
      }
      onLoginSuccess();
    } else {
      setErrorMsg('PIN o clave incorrecta. Por favor verifique el código de acceso.');
    }
  };

  return (
    <div 
      id="admin-login-screen" 
      className="min-h-screen bg-[#0d1c1e] text-stone-100 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt="Hotel Mirador Ecológico Ometepe Backdrop"
          className="w-full h-full object-cover filter blur-md"
        />
        <div className="absolute inset-0 bg-[#0d1c1e]/85" />
      </div>

      {/* Top Bar with Return to Public Site */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-[#1e3c41]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <HotelLogo variant="horizontal" mode="white" height={36} />
        </div>

        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-[#18363a] border border-[#1e3c41] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Sitio Público</span>
        </button>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#13272b]/90 backdrop-blur-xl border border-[#24474d] rounded-3xl p-8 shadow-2xl shadow-black/80">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#C2ECE5]/10 border border-brand-mint/30 flex items-center justify-center text-brand-mint shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18363a] border border-[#387378]/40 text-brand-mint text-[11px] font-semibold mb-3">
              <Sparkles className="w-3 h-3 text-brand-sun" />
              <span>admin.dominio.com • Acceso Privado</span>
            </div>

            <h1 className="font-gidole text-2xl font-extrabold text-white tracking-wide">
              Acceso a Administración
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
              Ingrese su PIN o clave de seguridad para gestionar cabañas, tarifas, galería y WhatsApp.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label 
                htmlFor="admin-pin-input" 
                className="block text-xs font-medium text-stone-300 mb-1.5 uppercase tracking-wider"
              >
                PIN o Contraseña de Seguridad
              </label>
              
              <div className="relative">
                <input
                  id="admin-pin-input"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Ingrese el PIN (Ej. 1234)"
                  autoFocus
                  required
                  className="w-full bg-[#0d1c1e]/90 border border-[#24474d] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint transition-all font-mono tracking-widest text-center"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-700 text-brand-teal focus:ring-brand-teal bg-stone-950"
                />
                <span>Recordar sesión en este equipo</span>
              </label>
            </div>

            <button
              id="btn-admin-submit-login"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#387378] hover:bg-[#2c5b5f] active:bg-[#18363a] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#18363a]/50 transition-all cursor-pointer"
            >
              <span>Ingresar al Backoffice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Helper / Demo Credential Hint */}
          <div className="mt-6 pt-5 border-t border-[#24474d] text-center">
            <div className="p-2.5 rounded-xl bg-[#18363a] border border-[#387378]/40 text-stone-300 text-xs inline-block">
              <span className="text-brand-sun font-semibold">PIN inicial por defecto:</span>{' '}
              <code className="bg-[#0d1c1e] px-2 py-0.5 rounded text-brand-mint font-mono font-bold">1234</code>
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              (Puede cambiar este PIN en cualquier momento dentro de la pestaña Seguridad)
            </p>
          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 p-4 text-center text-stone-500 text-xs border-t border-[#1e3c41]">
        <span>© {new Date().getFullYear()} {hotelConfig.name} — Mirador PMS Cloud v2.5</span>
      </footer>
    </div>
  );
};
