'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const session = localStorage.getItem('user_session');
      if (!session) {
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-text-muted text-xs">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-orange-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Authorizing secure session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-foreground flex flex-col md:flex-row">
      {/* Sidebar - Desktop navigation drawer & mobile bottom dock */}
      <Sidebar />

      {/* Main Area Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 pb-24 md:pb-0 min-h-screen">
        {/* Top Header */}
        <Header />

        {/* Dynamic page contents viewport */}
        <main className="flex-1 px-5 py-8 sm:p-7 md:p-8 bg-bg-main">
          {children}
        </main>
      </div>

      {/* Floating account agent chat widget overlay */}
      <ChatWidget />
    </div>
  );
}
