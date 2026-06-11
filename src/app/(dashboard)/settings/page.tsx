'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Smartphone,
  Key,
  LogOut
} from 'lucide-react';
import { mockUser } from '@/data/mockData';

type SettingsTab = 'profile' | 'security' | 'notifications';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  // Profile settings
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);
  const [bankName, setBankName] = useState(mockUser.bankName);
  const [accountNumber, setAccountNumber] = useState(mockUser.accountNumber);

  // Security settings
  const [twoFactor, setTwoFactor] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [lockOnIdle, setLockOnIdle] = useState(false);

  // Notificaciones
  const [notifYield, setNotifYield] = useState(true);
  const [notifDeposit, setNotifDeposit] = useState(true);
  const [notifLogin, setNotifLogin] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    // Simulate server saving
    setTimeout(() => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/login');
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-text-primary">
          Configuración del Portal
        </h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1">
          Administra tus claves de seguridad, rutas de notificación y detalles privados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 bg-bg-card border border-border-main p-3 rounded-2xl overflow-x-auto shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all w-full text-left whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary shadow-glow'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-main/50'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            <span>Detalles del Perfil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all w-full text-left whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary shadow-glow'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-main/50'
            }`}
          >
            <Shield className="w-4.5 h-4.5" />
            <span>Seguridad de Bóveda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all w-full text-left whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary shadow-glow'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-main/50'
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            <span>Alertas y Notificaciones</span>
          </button>
        </div>

        {/* Tab content panels */}
        <div className="lg:col-span-9 bg-bg-card border border-border-main rounded-3xl p-6 md:p-8 relative shadow-sm">
          
          <SaveToast visible={saveSuccess} />

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-border-main/50">
                  <h3 className="font-display font-semibold text-sm text-text-primary">Detalles del Perfil</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Metadatos autorizados del inversor privado
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-750">Nombre Completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-750">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-750">Número de Teléfono</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-750">Banco de Retiro</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-semibold text-gray-750">Número de Cuenta Bancaria</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-bg-main border border-border-main rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col items-stretch sm:items-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-xs font-bold text-white shadow-lg shadow-brand-primary/10 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4.5 h-4.5" />
                    Guardar Configuración de Perfil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-5 py-3 rounded-xl border border-red-200 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-border-main/50">
                  <h3 className="font-display font-semibold text-sm text-text-primary">Seguridad de Bóveda</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Administrar parámetros biométricos y controles de acceso
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Option 1 */}
                  <div className="flex items-center justify-between p-4 bg-bg-main border border-border-main rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-brand-primary" />
                      <div>
                        <span className="text-xs font-bold text-text-primary block">Autenticación de Dos Factores (2FA)</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">
                          Requiere código OTP en las verificaciones de credenciales
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={twoFactor}
                        onChange={(e) => setTwoFactor(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                  </div>

                  {/* Option 2 */}
                  <div className="flex items-center justify-between p-4 bg-bg-main border border-border-main rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-brand-primary" />
                      <div>
                        <span className="text-xs font-bold text-text-primary block">Bloqueo por Escáner de Reconocimiento Facial</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">
                          Requiere escaneo de cámara en retiros
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={faceIdEnabled}
                        onChange={(e) => setFaceIdEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                  </div>

                  {/* Option 3 */}
                  <div className="flex items-center justify-between p-4 bg-bg-main border border-border-main rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-brand-primary" />
                      <div>
                        <span className="text-xs font-bold text-text-primary block">Bloqueo por Sesión Inactiva</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">
                          Cierra sesión automáticamente tras 10 min de inactividad
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={lockOnIdle}
                        onChange={(e) => setLockOnIdle(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-xs font-bold text-white shadow-lg shadow-brand-primary/10 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4.5 h-4.5" />
                    Guardar Opciones de Seguridad
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-border-main/50">
                  <h3 className="font-display font-semibold text-sm text-text-primary">Alertas y Notificaciones</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Configurar condiciones de alerta y nodos de envío
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Notif 1 */}
                  <div className="flex items-center justify-between p-4 bg-bg-main border border-border-main rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary block">Estados de Rendimiento Semanales</span>
                      <span className="text-[10px] text-text-muted block">
                        Enviar informes detallados de ganancias de bloque acumuladas
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifYield}
                        onChange={(e) => setNotifYield(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                  </div>

                  {/* Notif 2 */}
                  <div className="flex items-center justify-between p-4 bg-bg-main border border-border-main rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary block">Eventos de Cambio de Custodia</span>
                      <span className="text-[10px] text-text-muted block">
                        Notificar modificaciones de claves o ejecuciones de firmas
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifDeposit}
                        onChange={(e) => setNotifDeposit(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                  </div>

                  {/* Notif 3 */}
                  <div className="flex items-center justify-between p-4 bg-bg-main border border-border-main rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-text-primary block">Intentos de Inicio de Sesión no Reconocidos</span>
                      <span className="text-[10px] text-text-muted block">
                        Alertar inmediatamente sobre inicios de sesión desde nodos de IP desconocidos
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifLogin}
                        onChange={(e) => setNotifLogin(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-xs font-bold text-white shadow-lg shadow-brand-primary/10 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4.5 h-4.5" />
                    Guardar Rutas de Alerta
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}

function SaveToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg z-50 whitespace-nowrap"
        >
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>¡La actualización de configuración se guardó exitosamente!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
