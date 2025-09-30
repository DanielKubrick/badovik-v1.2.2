'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import ToastComponent, { Toast, ToastType } from './Toast'

interface ToastContextType {
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration
    }

    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Convenience hooks for different toast types
export const useToastSuccess = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    addToast('success', title, message)
  }, [addToast])
}

export const useToastError = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    addToast('error', title, message)
  }, [addToast])
}

export const useToastInfo = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    addToast('info', title, message)
  }, [addToast])
}

export const useToastWarning = () => {
  const { addToast } = useToast()
  return useCallback((title: string, message?: string) => {
    addToast('warning', title, message)
  }, [addToast])
}
