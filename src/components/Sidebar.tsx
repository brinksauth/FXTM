'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  History,
  ArrowDownLeft,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Panel de Control', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Portafolio', path: '/portfolio', icon: Briefcase },
    { name: 'Billetera', path: '/wallet', icon: Wallet },
    { name: 'Transacciones', path: '/transactions', icon: History },
    { name: 'Retiros', path: '/withdrawals', icon: ArrowDownLeft },
    { name: 'Configuración', path: '/settings', icon: Settings },
    { name: 'Soporte', path: '/support', icon: HelpCircle },
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('user_session');
      router.push('/login');
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-border-main fixed top-0 bottom-0 left-0 z-20">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-border-main gap-3">
          <Image src="/icon.svg" alt="FXTM Logo" width={32} height={32} />
          <div>
            <h1 className="font-display font-bold text-lg text-text-primary leading-tight tracking-wide">
              FXTM
            </h1>
            <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-widest">
              Trading de Élite
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 group ${
                  isActive
                    ? 'text-white font-bold relative z-10'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-card-hover relative z-10'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-brand-primary/20 border border-brand-primary/30 rounded-xl" />
                )}
                
                <Icon
                  className={`w-5 h-5 relative z-10`}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? 'rgba(255, 179, 195, 0.2)' : 'none'}
                />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Action */}
        <div className="p-4 border-t border-border-main">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[4.25rem] glass-panel border-t border-border-main flex items-center justify-around px-1.5 pb-[env(safe-area-inset-bottom)] z-30">
        {menuItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          let displayName = item.name;
          if (displayName === 'Panel de Control') displayName = 'Panel';
          if (displayName === 'Transacciones') displayName = 'Historial';
          if (displayName === 'Withdrawals') displayName = 'Retiro';

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all relative ${
                isActive ? 'text-brand-primary font-bold' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {isActive && (
                <span className="absolute top-1.5 w-1 h-1 rounded-full bg-brand-primary" />
              )}
              <Icon
                className="w-5 h-5 mb-1"
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? 'rgba(255, 179, 195, 0.15)' : 'none'}
              />
              <span>{displayName}</span>
            </Link>
          );
        })}
        {/* Profile Settings tab shortcut for mobile */}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all ${
            pathname === '/settings' ? 'text-brand-primary font-bold' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {pathname === '/settings' && (
            <span className="absolute top-1.5 w-1 h-1 rounded-full bg-brand-primary" />
          )}
          <Settings className="w-5 h-5 mb-1" strokeWidth={pathname === '/settings' ? 2.5 : 2} />
          <span>Perfil</span>
        </Link>
      </nav>
    </>
  );
}

