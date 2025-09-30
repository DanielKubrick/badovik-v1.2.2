'use client';
import { useEffect, ReactNode } from 'react';
import { applyTelegramTheme, readyTg } from '@/app/lib/tg-theme';

export default function ClientLayout({ children }: { children: ReactNode }) {
  useEffect(() => { 
    readyTg(); 
    applyTelegramTheme(); 
  }, []);
  
  return (
    <>
      {children}
    </>
  );
}
