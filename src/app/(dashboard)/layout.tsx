'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
