import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import "./globals.css";
import "./store-styles.css";
import "./mobile-styles.css";
import { ToastProvider } from "@/components/ui/ToastContainer";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";
import TelegramAuth from "@/components/auth/TelegramAuth";

export const metadata: Metadata = {
  title: "Mini Woo Store",
  description: "Telegram Mini App for WooCommerce Store",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: 'Mini Woo Store',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f97316',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen telegram-app">
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
        <ChunkErrorHandler />
        <TelegramAuth />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
