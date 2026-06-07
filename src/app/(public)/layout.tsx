import React from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-bg-main text-foreground overflow-x-hidden">
      {children}
    </div>
  );
}
