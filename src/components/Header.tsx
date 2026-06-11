'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Bell, ShieldAlert, Calendar, Clock, Eye, EyeOff, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockUser } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { privacyStorageKey, readPrivacyPreference, writePrivacyPreference } from '@/utils/privacy';

export default function Header() {
  const router = useRouter();
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isPrivate, setIsPrivate] = useState(true);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const notifications = [
    {
      id: 1,
      title: 'Ganancia semanal acreditada',
      desc: 'Tu crédito de Rendimiento Estándar fue publicado correctamente.',
      time: 'Hace 2 horas',
      unread: true,
    },
    {
      id: 2,
      title: 'Inicio de sesión detectado',
      desc: 'Acceso correcto con credenciales verificadas.',
      time: 'Hace 1 día',
      unread: true,
    },
    {
      id: 3,
      title: 'Sincronización de seguridad completa',
      desc: 'Parámetros biométricos y configuración validados.',
      time: 'Hace 3 días',
      unread: true,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem(privacyStorageKey) === null) {
      localStorage.setItem(privacyStorageKey, 'true');
    }
  }, []);

  const togglePrivacy = () => {
    const newVal = !isPrivate;
    setIsPrivate(newVal);
    writePrivacyPreference(newVal);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('es-MX', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cierra los paneles cuando se hace clic fuera.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/login');
    });
  };

  return (
    <header className="min-h-24 glass-panel border-b border-border-main flex items-center justify-between gap-3 px-5 py-5 sm:px-7 md:px-8 relative z-10">
      {/* Welcome & Date Ticker */}
      <div className="flex flex-col">
        <h2 className="font-display font-bold text-base sm:text-lg md:text-xl text-text-primary leading-tight">
          Bienvenido de nuevo, <span className="text-brand-primary">{mockUser.name}</span>
        </h2>
        <div className="flex items-center gap-3 mt-1 text-[11px] sm:text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            {date}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-border-main hidden sm:inline" />
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            {time}
          </span>
        </div>
      </div>

      {/* Account Info Actions */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
        {/* Privacy Balance Toggle */}
        <button
          onClick={togglePrivacy}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-bg-main border border-border-main flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-primary/30 hover:shadow-glow transition-all duration-300"
          title={isPrivate ? "Mostrar todos los montos" : "Ocultar todos los montos"}
        >
          {isPrivate ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-bg-main border border-border-main flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-primary/30 hover:shadow-glow transition-all duration-300 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-brand-primary border-2 border-bg-card animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel border border-border-main rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-border-main flex items-center justify-between bg-bg-main/50">
                  <h3 className="font-display font-semibold text-sm text-text-primary">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-brand-primary hover:text-brand-hover font-semibold transition-colors"
                    >
                      Marcar todo como leído
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border-main">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-bg-main/30 transition-colors ${
                        notif.unread && unreadCount > 0 ? 'bg-brand-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ShieldAlert className="w-4.5 h-4.5 text-brand-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs text-text-primary">{notif.title}</h4>
                          <p className="text-text-muted text-[11px] mt-1 leading-relaxed">{notif.desc}</p>
                          <span className="text-[10px] text-text-muted/65 mt-2 block">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Summary */}
        <div className="relative sm:pl-4 sm:border-l sm:border-border-main" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            title="Abrir perfil"
          >
            <Image
              src="/avatar.png"
              alt={mockUser.name}
              width={40}
              height={40}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-brand-primary/20 bg-brand-primary/10"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-semibold text-sm text-text-primary leading-none">{mockUser.name}</span>
              <span className="text-[10px] text-brand-primary font-medium mt-1 leading-none">
                {mockUser.investmentService}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-3 w-56 glass-panel border border-border-main rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-border-main">
                  <span className="text-xs font-bold text-text-primary block leading-tight">{mockUser.name}</span>
                  <span className="text-[10px] text-text-muted block mt-1 break-all">{mockUser.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

