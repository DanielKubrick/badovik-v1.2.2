'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('🚨 Application Error:', error);
  }, [error]);

  return (
    <div className="telegram-app" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: '#ff3347', marginBottom: '10px' }}>⚠️ Ошибка приложения</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
          {error.message || 'Произошла неожиданная ошибка'}
        </p>
        <details style={{ textAlign: 'left', fontSize: '12px', color: '#888' }}>
          <summary>Подробности ошибки</summary>
          <pre style={{ whiteSpace: 'pre-wrap', margin: '10px 0' }}>
            {error.stack || 'Stack trace недоступен'}
          </pre>
        </details>
      </div>
      
      <button
        onClick={reset}
        style={{
          background: '#007aff',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Попробовать снова
      </button>
      
      <button
        onClick={() => window.location.reload()}
        style={{
          background: '#666',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Перезагрузить
      </button>
    </div>
  );
}
