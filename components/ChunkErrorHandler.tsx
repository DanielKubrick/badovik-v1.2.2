'use client';

import { useEffect } from 'react';

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event: any) => {
      // Проверяем, является ли ошибка ChunkLoadError
      if (
        event.error && 
        (event.error.name === 'ChunkLoadError' || 
         event.error.message?.includes('Loading chunk') ||
         event.error.message?.includes('Loading CSS chunk'))
      ) {
        console.warn('ChunkLoadError detected, attempting to reload page...');
        
        // Попытаемся перезагрузить страницу один раз
        if (!sessionStorage.getItem('chunkErrorReloaded')) {
          sessionStorage.setItem('chunkErrorReloaded', 'true');
          window.location.reload();
        } else {
          // Если перезагрузка уже была, очищаем флаг и показываем ошибку
          sessionStorage.removeItem('chunkErrorReloaded');
          console.error('ChunkLoadError persists after reload:', event.error);
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason && 
        (event.reason.name === 'ChunkLoadError' || 
         event.reason.message?.includes('Loading chunk'))
      ) {
        console.warn('ChunkLoadError in promise, attempting to reload page...');
        
        if (!sessionStorage.getItem('chunkErrorReloaded')) {
          sessionStorage.setItem('chunkErrorReloaded', 'true');
          window.location.reload();
        } else {
          sessionStorage.removeItem('chunkErrorReloaded');
          console.error('ChunkLoadError persists after reload:', event.reason);
        }
      }
    };

    // Очищаем флаг перезагрузки при успешной загрузке
    const clearReloadFlag = () => {
      sessionStorage.removeItem('chunkErrorReloaded');
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('load', clearReloadFlag);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('load', clearReloadFlag);
    };
  }, []);

  return null;
}
