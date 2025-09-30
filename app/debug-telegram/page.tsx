'use client'

import { useEffect, useState } from 'react'

export default function DebugTelegram() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const checkTelegram = () => {
      const info = {
        hasTelegram: !!(window as any).Telegram,
        hasWebApp: !!(window as any).Telegram?.WebApp,
        initData: (window as any).Telegram?.WebApp?.initData || 'NOT AVAILABLE',
        initDataUnsafe: (window as any).Telegram?.WebApp?.initDataUnsafe || 'NOT AVAILABLE',
        platform: (window as any).Telegram?.WebApp?.platform || 'NOT AVAILABLE',
        version: (window as any).Telegram?.WebApp?.version || 'NOT AVAILABLE',
        userAgent: navigator.userAgent,
        location: window.location.href,
        isSecure: window.location.protocol === 'https:',
        headers: Object.fromEntries(
          new Headers(document.cookie ? { cookie: document.cookie } : {})
        )
      }
      setDebugInfo(info)
    }

    // Проверяем сразу и через секунду
    checkTelegram()
    setTimeout(checkTelegram, 1000)
    setTimeout(checkTelegram, 3000)
  }, [])

  return (
    <div className="p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">Telegram WebApp Debug Info</h1>
      <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}
