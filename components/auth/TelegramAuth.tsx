'use client'

import { useEffect } from 'react'
import { useAuth } from './store'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        MainButton: {
          setText: (text: string) => void
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        initDataUnsafe: any
        ready: () => void
        expand: () => void
        close: () => void
      }
    }
  }
}

export default function TelegramAuth() {
  const auth = useAuth()

  useEffect(() => {
    const initTelegramAuth = async () => {
      // Проверяем, доступен ли Telegram WebApp
      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        console.log('Telegram WebApp not available')
        return
      }

      const webApp = window.Telegram.WebApp
      
      // Инициализируем WebApp
      webApp.ready()
      webApp.expand()

      // Если пользователь уже аутентифицирован, не делаем повторную аутентификацию
      if (auth.isAuthenticated) {
        console.log('User already authenticated')
        return
      }

      // Проверяем, есть ли initData
      if (!webApp.initData) {
        console.log('No Telegram initData available')
        return
      }

      try {
        console.log('Attempting Telegram authentication...')
        const result = await auth.login(webApp.initData)
        
        if (result.success) {
          console.log('Authentication successful', auth.user?.firstName || 'пользователь')
        } else {
          console.warn('Authentication failed:', result.error)
          // Не показываем ошибку пользователю, так как приложение работает и без аутентификации
        }
      } catch (error) {
        console.error('Authentication error:', error)
      }
    }

    // Небольшая задержка для загрузки Telegram WebApp
    const timer = setTimeout(initTelegramAuth, 1000)
    
    return () => clearTimeout(timer)
  }, [auth])

  // Этот компонент не рендерит UI
  return null
}
